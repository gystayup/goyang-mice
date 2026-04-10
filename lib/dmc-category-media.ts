import { mkdir, readFile, rm, stat, writeFile } from "fs/promises";
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

const metadataPath = path.join(process.cwd(), "data", "dmc-category-media.json");
const uploadDir = path.join(process.cwd(), "public", "uploads", "dmc", "categories");

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

function toPublicMediaUrl(fileName: string) {
  return `/uploads/dmc/categories/${fileName}`;
}

function resolveStoredFilePath(src: string) {
  const relativePath = src.replace(/^\/+/, "");
  return path.join(process.cwd(), "public", relativePath.replace(/^public[\\/]/, ""));
}

function isValidCategoryKey(value: string): value is DmcCategoryMediaKey {
  return dmcCategoryMediaDefinitions.some((item) => item.key === value);
}

export async function ensureDmcCategoryMediaStorage() {
  await mkdir(uploadDir, { recursive: true });

  try {
    await stat(metadataPath);
  } catch {
    await writeFile(metadataPath, JSON.stringify(createDefaultMap(), null, 2), "utf8");
  }
}

export async function readDmcCategoryMediaMap(): Promise<DmcCategoryMediaMap> {
  await ensureDmcCategoryMediaStorage();

  try {
    const raw = await readFile(metadataPath, "utf8");
    const parsed = JSON.parse(raw) as Partial<Record<DmcCategoryMediaKey, Partial<DmcCategoryMediaItem>>>;
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

export async function writeDmcCategoryMediaMap(mediaMap: DmcCategoryMediaMap) {
  await ensureDmcCategoryMediaStorage();
  await writeFile(metadataPath, JSON.stringify(mediaMap, null, 2), "utf8");
}

export async function saveDmcCategoryMediaFile(
  categoryKey: DmcCategoryMediaKey,
  file: File
) {
  const mediaMap = await readDmcCategoryMediaMap();
  const current = mediaMap[categoryKey];

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
    .replace(/^-+|-+$/g, "") || `${categoryKey}-category`;
  const savedFileName = `${Date.now()}-${categoryKey}-${safeBaseName}${fileExtension.toLowerCase()}`;
  const filePath = path.join(uploadDir, savedFileName);
  const buffer = Buffer.from(await file.arrayBuffer());

  await writeFile(filePath, buffer);

  mediaMap[categoryKey] = {
    ...mediaMap[categoryKey],
    src: toPublicMediaUrl(savedFileName),
    fileName: file.name,
    mimeType: file.type,
    updatedAt: new Date().toISOString(),
  };

  await writeDmcCategoryMediaMap(mediaMap);
  return mediaMap;
}

export async function clearDmcCategoryMediaFile(categoryKey: DmcCategoryMediaKey) {
  const mediaMap = await readDmcCategoryMediaMap();
  const current = mediaMap[categoryKey];

  if (current.src) {
    try {
      await rm(resolveStoredFilePath(current.src), { force: true });
    } catch {
      // Ignore missing or already removed files.
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
