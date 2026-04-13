import { createClient } from "@supabase/supabase-js";
import path from "path";

import { prisma } from "@/lib/prisma";

export type DmcHeroMediaType = "none" | "image" | "video";

export interface DmcHeroMedia {
  mediaType: DmcHeroMediaType;
  src: string;
  fileName: string;
  mimeType: string;
  updatedAt: string | null;
}

const defaultDmcHeroMedia: DmcHeroMedia = {
  mediaType: "none",
  src: "",
  fileName: "",
  mimeType: "",
  updatedAt: null,
};

const PAGE_KEY = "dmc-hero-media";
const BUCKET = "uploads";
const FOLDER = "dmc/hero";

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase 환경변수가 설정되지 않았습니다.");
  return createClient(url, key);
}

export async function readDmcHeroMedia(): Promise<DmcHeroMedia> {
  try {
    const page = await prisma.page.findUnique({ where: { pageKey: PAGE_KEY } });
    if (!page || !page.contentJson) return defaultDmcHeroMedia;
    const data = page.contentJson as Partial<DmcHeroMedia>;
    return {
      mediaType:
        data.mediaType === "image" || data.mediaType === "video"
          ? data.mediaType
          : "none",
      src: data.src ?? "",
      fileName: data.fileName ?? "",
      mimeType: data.mimeType ?? "",
      updatedAt: data.updatedAt ?? null,
    };
  } catch {
    return defaultDmcHeroMedia;
  }
}

async function writeDmcHeroMedia(media: DmcHeroMedia) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await prisma.page.upsert({
    where: { pageKey: PAGE_KEY },
    update: { contentJson: media as any },
    create: {
      pageKey: PAGE_KEY,
      title: "DMC Hero Media",
      slug: "dmc-hero-media",
      contentJson: media as any,
      status: "PUBLISHED",
      lang: "ko",
    },
  });
}

export async function saveDmcHeroMediaFile(file: File): Promise<DmcHeroMedia> {
  const supabase = getSupabaseClient();

  // Delete old file
  const current = await readDmcHeroMedia();
  if (current.src) {
    const oldFileName = current.src.split("/").pop();
    if (oldFileName) {
      await supabase.storage.from(BUCKET).remove([`${FOLDER}/${oldFileName}`]);
    }
  }

  // Upload new file
  const ext = path.extname(file.name).toLowerCase() || ".bin";
  const savedFileName = `${Date.now()}-dmc-hero${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(`${FOLDER}/${savedFileName}`, buffer, { contentType: file.type, upsert: false });
  if (error) throw new Error(error.message);

  const { data: urlData } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(`${FOLDER}/${savedFileName}`);

  const nextMedia: DmcHeroMedia = {
    mediaType: file.type.startsWith("video/") ? "video" : "image",
    src: urlData.publicUrl,
    fileName: file.name,
    mimeType: file.type,
    updatedAt: new Date().toISOString(),
  };

  await writeDmcHeroMedia(nextMedia);
  return nextMedia;
}

export async function clearDmcHeroMedia(): Promise<DmcHeroMedia> {
  const supabase = getSupabaseClient();
  const current = await readDmcHeroMedia();

  if (current.src) {
    const oldFileName = current.src.split("/").pop();
    if (oldFileName) {
      await supabase.storage.from(BUCKET).remove([`${FOLDER}/${oldFileName}`]);
    }
  }

  await writeDmcHeroMedia(defaultDmcHeroMedia);
  return defaultDmcHeroMedia;
}
