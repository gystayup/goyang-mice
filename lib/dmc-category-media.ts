import { createClient } from "@supabase/supabase-js";
import path from "path";

export const dmcCategoryMediaDefinitions = [
  { key: "tour", label: "여행상품 예약" },
  { key: "stay", label: "숙박 예약" },
  { key: "restaurant", label: "음식점 예약" },
  { key: "cafe", label: "카페 예약" },
  { key: "ticket", label: "티켓 예약" },
  { key: "airport", label: "공항픽업 예약" },
] as const;

export type DmcCategoryMediaKey = (typeof dmcCategoryMediaDefinitions)[number]["key"];

export interface DmcCategoryMediaItem {
  key: DmcCategoryMediaKey;
  label: string;
  src: string;
  fileName: string;
  mimeType: string;
  updatedAt: string | null;
}

export type DmcCategoryMediaMap = Record<DmcCategoryMediaKey, DmcCategoryMediaItem>;

const PAGE_KEY = "dmc-category-media";
const BUCKET = "uploads";
const FOLDER = "dmc/categories";

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase 환경변수가 설정되지 않았습니다.");
  return createClient(url, key);
}

function createDefaultMap(): DmcCategoryMediaMap {
  return Object.fromEntries(
    dmcCategoryMediaDefinitions.map((item) => [
      item.key,
      {
        key: item.key,
        label: item.label,
        src: "",
        fileName: "",
        mimeType: "",
        updatedAt: null,
      },
    ])
  ) as DmcCategoryMediaMap;
}

function isValidCategoryKey(value: string): value is DmcCategoryMediaKey {
  return dmcCategoryMediaDefinitions.some((item) => item.key === value);
}

export async function readDmcCategoryMediaMap(): Promise<DmcCategoryMediaMap> {
  try {
    const supabase = getSupabaseClient();
    const { data } = await supabase.from("pages").select("contentJson").eq("pageKey", PAGE_KEY).single();
    if (!data?.contentJson) return createDefaultMap();
    const parsed = data.contentJson as Partial<Record<DmcCategoryMediaKey, Partial<DmcCategoryMediaItem>>>;
    const defaults = createDefaultMap();

    for (const item of dmcCategoryMediaDefinitions) {
      const value = parsed[item.key];
      defaults[item.key] = {
        key: item.key,
        label: item.label,
        src: value?.src ?? "",
        fileName: value?.fileName ?? "",
        mimeType: value?.mimeType ?? "",
        updatedAt: value?.updatedAt ?? null,
      };
    }

    return defaults;
  } catch {
    return createDefaultMap();
  }
}

async function writeDmcCategoryMediaMap(mediaMap: DmcCategoryMediaMap) {
  const supabase = getSupabaseClient();
  const { data: existing } = await supabase.from("pages").select("id").eq("pageKey", PAGE_KEY).single();
  if (existing) {
    await supabase.from("pages").update({ contentJson: mediaMap, updatedAt: new Date().toISOString() }).eq("pageKey", PAGE_KEY);
  } else {
    await supabase.from("pages").insert({
      id: crypto.randomUUID(),
      pageKey: PAGE_KEY,
      title: "DMC Category Media",
      slug: PAGE_KEY,
      contentJson: mediaMap,
      status: "PUBLISHED",
      lang: "ko",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }
}

export async function saveDmcCategoryMediaFile(
  categoryKey: DmcCategoryMediaKey,
  file: File
) {
  const supabase = getSupabaseClient();
  const mediaMap = await readDmcCategoryMediaMap();
  const current = mediaMap[categoryKey];

  // Delete old file
  if (current.src) {
    const oldFileName = current.src.split("/").pop();
    if (oldFileName) {
      await supabase.storage.from(BUCKET).remove([`${FOLDER}/${oldFileName}`]);
    }
  }

  // 버킷이 없으면 자동 생성
  const { data: buckets } = await supabase.storage.listBuckets();
  const bucketExists = buckets?.some((b) => b.name === BUCKET);
  if (!bucketExists) {
    const { error: createErr } = await supabase.storage.createBucket(BUCKET, { public: true });
    if (createErr && !createErr.message.includes("already exists")) {
      throw new Error(`버킷 생성 실패: ${createErr.message}`);
    }
  }

  // Upload new file
  const ext = path.extname(file.name).toLowerCase() || ".bin";
  const savedFileName = `${Date.now()}-${categoryKey}${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(`${FOLDER}/${savedFileName}`, buffer, { contentType: file.type, upsert: true });
  if (error) throw new Error(error.message);

  const { data: urlData } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(`${FOLDER}/${savedFileName}`);

  mediaMap[categoryKey] = {
    ...mediaMap[categoryKey],
    src: urlData.publicUrl,
    fileName: file.name,
    mimeType: file.type,
    updatedAt: new Date().toISOString(),
  };

  await writeDmcCategoryMediaMap(mediaMap);
  return mediaMap;
}

export async function clearDmcCategoryMediaFile(categoryKey: DmcCategoryMediaKey) {
  const supabase = getSupabaseClient();
  const mediaMap = await readDmcCategoryMediaMap();
  const current = mediaMap[categoryKey];

  if (current.src) {
    const oldFileName = current.src.split("/").pop();
    if (oldFileName) {
      await supabase.storage.from(BUCKET).remove([`${FOLDER}/${oldFileName}`]);
    }
  }

  mediaMap[categoryKey] = {
    ...mediaMap[categoryKey],
    src: "",
    fileName: "",
    mimeType: "",
    updatedAt: null,
  };

  await writeDmcCategoryMediaMap(mediaMap);
  return mediaMap;
}

export function parseDmcCategoryKey(value: string | null) {
  if (!value || !isValidCategoryKey(value)) {
    return null;
  }

  return value;
}
