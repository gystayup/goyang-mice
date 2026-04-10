import { mkdir, readFile, rm, stat, writeFile } from "fs/promises";
import path from "path";

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

const metadataPath = path.join(process.cwd(), "data", "dmc-hero-media.json");
const uploadDir = path.join(process.cwd(), "public", "uploads", "dmc");

function toPublicMediaUrl(fileName: string) {
  return `/uploads/dmc/${fileName}`;
}

function resolveStoredFilePath(src: string) {
  const relativePath = src.replace(/^\/+/, "");
  return path.join(process.cwd(), "public", relativePath.replace(/^public[\\/]/, ""));
}

export async function ensureDmcHeroMediaStorage() {
  await mkdir(uploadDir, { recursive: true });

  try {
    await stat(metadataPath);
  } catch {
    await writeFile(
      metadataPath,
      JSON.stringify(defaultDmcHeroMedia, null, 2),
      "utf8"
    );
  }
}

export async function readDmcHeroMedia(): Promise<DmcHeroMedia> {
  await ensureDmcHeroMediaStorage();

  try {
    const raw = await readFile(metadataPath, "utf8");
    const parsed = JSON.parse(raw) as Partial<DmcHeroMedia>;

    return {
      mediaType:
        parsed.mediaType === "image" || parsed.mediaType === "video"
          ? parsed.mediaType
          : "none",
      src: parsed.src ?? "",
      fileName: parsed.fileName ?? "",
      mimeType: parsed.mimeType ?? "",
      updatedAt: parsed.updatedAt ?? null,
    };
  } catch {
    return defaultDmcHeroMedia;
  }
}

export async function writeDmcHeroMedia(media: DmcHeroMedia) {
  await ensureDmcHeroMediaStorage();
  await writeFile(metadataPath, JSON.stringify(media, null, 2), "utf8");
}

export async function clearDmcHeroMedia() {
  const current = await readDmcHeroMedia();

  if (current.src) {
    try {
      await rm(resolveStoredFilePath(current.src), { force: true });
    } catch {
      // Ignore missing or already removed files.
    }
  }

  await writeDmcHeroMedia(defaultDmcHeroMedia);
  return defaultDmcHeroMedia;
}

export async function saveDmcHeroMediaFile(file: File): Promise<DmcHeroMedia> {
  await ensureDmcHeroMediaStorage();

  const current = await readDmcHeroMedia();
  if (current.src) {
    try {
      await rm(resolveStoredFilePath(current.src), { force: true });
    } catch {
      // Ignore cleanup issues for replaced files.
    }
  }

  const fileExtension = path.extname(file.name) || ".bin";
  const safeBaseName = path
    .basename(file.name, fileExtension)
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, "-")
    .replace(/^-+|-+$/g, "") || "dmc-hero";
  const savedFileName = `${Date.now()}-${safeBaseName}${fileExtension.toLowerCase()}`;
  const filePath = path.join(uploadDir, savedFileName);
  const buffer = Buffer.from(await file.arrayBuffer());

  await writeFile(filePath, buffer);

  const nextMedia: DmcHeroMedia = {
    mediaType: file.type.startsWith("video/") ? "video" : "image",
    src: toPublicMediaUrl(savedFileName),
    fileName: file.name,
    mimeType: file.type,
    updatedAt: new Date().toISOString(),
  };

  await writeDmcHeroMedia(nextMedia);
  return nextMedia;
}
