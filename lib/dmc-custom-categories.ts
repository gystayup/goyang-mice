import { createClient } from "@supabase/supabase-js";
import path from "path";

/**
 * 사용자 정의 카테고리 (관리자가 DMC 페이지에 자유롭게 추가할 수 있는 카테고리)
 *
 * - 기본 카테고리 (tour, stay, restaurant, cafe, ticket, airport, medical-*) 는
 *   lib/dmc-category-media.ts 에 정의되며, 코드 수정이 필요합니다.
 * - 본 파일의 커스텀 카테고리는 관리자가 화면에서 추가/삭제/이미지 변경할 수 있으며,
 *   Supabase pages 테이블에 저장됩니다. pageKey = "dmc-custom-categories"
 */
export interface DmcCustomCategory {
  slug: string; // 고유 키 (URL-safe)
  label: string; // 표시 이름 (한국어)
  description?: string; // 짧은 설명 (선택)
  src: string; // 이미지 URL
  fileName: string;
  mimeType: string;
  createdAt: string;
  updatedAt: string;
}

const PAGE_KEY = "dmc-custom-categories";
const BUCKET = "uploads";
const FOLDER = "dmc/custom-categories";

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase 환경변수가 설정되지 않았습니다.");
  return createClient(url, key);
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9가-힣\s-]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 40);
}

export async function readDmcCustomCategories(): Promise<DmcCustomCategory[]> {
  try {
    const supabase = getSupabaseClient();
    const { data } = await supabase
      .from("pages")
      .select("contentJson")
      .eq("pageKey", PAGE_KEY)
      .single();
    if (!data?.contentJson) return [];
    const parsed = data.contentJson as { items?: DmcCustomCategory[] };
    return Array.isArray(parsed.items) ? parsed.items : [];
  } catch {
    return [];
  }
}

async function writeDmcCustomCategories(items: DmcCustomCategory[]) {
  const supabase = getSupabaseClient();
  const { data: existing } = await supabase
    .from("pages")
    .select("id")
    .eq("pageKey", PAGE_KEY)
    .single();

  const payload = { items };
  const now = new Date().toISOString();

  if (existing) {
    await supabase
      .from("pages")
      .update({ contentJson: payload, updatedAt: now })
      .eq("pageKey", PAGE_KEY);
  } else {
    await supabase.from("pages").insert({
      id: crypto.randomUUID(),
      pageKey: PAGE_KEY,
      title: "DMC Custom Categories",
      slug: PAGE_KEY,
      contentJson: payload,
      status: "PUBLISHED",
      lang: "ko",
      createdAt: now,
      updatedAt: now,
    });
  }
}

export async function addDmcCustomCategory(params: {
  label: string;
  description?: string;
  file?: File;
}): Promise<DmcCustomCategory[]> {
  const label = params.label.trim();
  if (!label) throw new Error("카테고리 이름을 입력해 주세요.");

  const items = await readDmcCustomCategories();

  // slug 생성 (중복 방지)
  const base = slugify(label) || `custom-${Date.now()}`;
  let slug = base;
  let i = 2;
  while (items.some((it) => it.slug === slug)) {
    slug = `${base}-${i++}`;
  }

  let src = "";
  let fileName = "";
  let mimeType = "";

  if (params.file) {
    const uploaded = await uploadImage(slug, params.file);
    src = uploaded.src;
    fileName = uploaded.fileName;
    mimeType = uploaded.mimeType;
  }

  const now = new Date().toISOString();
  const next: DmcCustomCategory = {
    slug,
    label,
    description: params.description?.trim() || undefined,
    src,
    fileName,
    mimeType,
    createdAt: now,
    updatedAt: now,
  };

  items.push(next);
  await writeDmcCustomCategories(items);
  return items;
}

export async function updateDmcCustomCategoryImage(
  slug: string,
  file: File
): Promise<DmcCustomCategory[]> {
  const items = await readDmcCustomCategories();
  const target = items.find((it) => it.slug === slug);
  if (!target) throw new Error("해당 카테고리를 찾을 수 없습니다.");

  // 기존 파일 삭제
  if (target.src) {
    await deleteImageFile(target.src);
  }

  const uploaded = await uploadImage(slug, file);
  target.src = uploaded.src;
  target.fileName = uploaded.fileName;
  target.mimeType = uploaded.mimeType;
  target.updatedAt = new Date().toISOString();

  await writeDmcCustomCategories(items);
  return items;
}

export async function deleteDmcCustomCategory(
  slug: string
): Promise<DmcCustomCategory[]> {
  const items = await readDmcCustomCategories();
  const target = items.find((it) => it.slug === slug);
  if (target?.src) {
    await deleteImageFile(target.src);
  }
  const next = items.filter((it) => it.slug !== slug);
  await writeDmcCustomCategories(next);
  return next;
}

async function uploadImage(slug: string, file: File) {
  const supabase = getSupabaseClient();

  // 버킷 자동 생성 (기존 dmc-category-media 와 동일 버킷)
  const { data: buckets } = await supabase.storage.listBuckets();
  const bucketExists = buckets?.some((b) => b.name === BUCKET);
  if (!bucketExists) {
    const { error: createErr } = await supabase.storage.createBucket(BUCKET, {
      public: true,
    });
    if (createErr && !createErr.message.includes("already exists")) {
      throw new Error(`버킷 생성 실패: ${createErr.message}`);
    }
  }

  const ext = path.extname(file.name).toLowerCase() || ".bin";
  const savedFileName = `${Date.now()}-${slug}${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(`${FOLDER}/${savedFileName}`, buffer, {
      contentType: file.type,
      upsert: true,
    });
  if (error) throw new Error(error.message);

  const { data: urlData } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(`${FOLDER}/${savedFileName}`);

  return {
    src: urlData.publicUrl,
    fileName: file.name,
    mimeType: file.type,
  };
}

async function deleteImageFile(src: string) {
  try {
    const supabase = getSupabaseClient();
    const fileName = src.split("/").pop();
    if (fileName) {
      await supabase.storage.from(BUCKET).remove([`${FOLDER}/${fileName}`]);
    }
  } catch {
    // 무시 — 파일이 없거나 이미 삭제됨
  }
}
