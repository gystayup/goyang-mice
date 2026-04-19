import { createClient } from "@supabase/supabase-js";
import path from "path";

/**
 * 연구소 소식 / 공지 CMS — Supabase pages(pageKey="news-articles") row 의
 * { items: NewsArticle[] } 에 저장합니다.
 *
 * - 본문은 평문(plain text) — 줄바꿈 = 문단. 향후 마크다운/리치텍스트로 확장 가능.
 * - 커버 이미지는 Supabase Storage uploads/news/ 에 저장.
 */

import {
  NEWS_CATEGORY_LABELS,
  type NewsArticle,
  type NewsCategory,
  type NewsStatus,
} from "@/lib/news-types";

export {
  NEWS_CATEGORY_LABELS,
  type NewsArticle,
  type NewsCategory,
  type NewsStatus,
};

const PAGE_KEY = "news-articles";
const BUCKET = "uploads";
const FOLDER = "news";

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase 환경변수가 설정되지 않았습니다.");
  return createClient(url, key);
}

function randomId(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return `news_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  }
}

function slugify(input: string): string {
  const base = input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9가-힣\s-]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 60);
  return base || `post-${Date.now()}`;
}

async function readAllInternal(): Promise<NewsArticle[]> {
  try {
    const supabase = getSupabaseClient();
    const { data } = await supabase
      .from("pages")
      .select("contentJson")
      .eq("pageKey", PAGE_KEY)
      .single();
    if (!data?.contentJson) return [];
    const parsed = data.contentJson as { items?: NewsArticle[] };
    return Array.isArray(parsed.items) ? parsed.items : [];
  } catch {
    return [];
  }
}

async function writeAllInternal(items: NewsArticle[]): Promise<void> {
  const supabase = getSupabaseClient();
  const { data: existing } = await supabase
    .from("pages")
    .select("id")
    .eq("pageKey", PAGE_KEY)
    .single();
  const now = new Date().toISOString();
  const payload = { items };
  if (existing) {
    await supabase
      .from("pages")
      .update({ contentJson: payload, updatedAt: now })
      .eq("pageKey", PAGE_KEY);
  } else {
    await supabase.from("pages").insert({
      id: randomId(),
      pageKey: PAGE_KEY,
      title: "News Articles",
      slug: PAGE_KEY,
      contentJson: payload,
      status: "PUBLISHED",
      lang: "ko",
      createdAt: now,
      updatedAt: now,
    });
  }
}

// ─────────────────────────────────────────────────────────────
// 공개(읽기) API
// ─────────────────────────────────────────────────────────────

export async function listAllArticles(): Promise<NewsArticle[]> {
  return readAllInternal();
}

export async function listPublishedArticles(options?: {
  category?: NewsCategory;
  limit?: number;
}): Promise<NewsArticle[]> {
  const items = await readAllInternal();
  let filtered = items.filter((it) => it.status === "PUBLISHED");
  if (options?.category) filtered = filtered.filter((it) => it.category === options.category);
  filtered.sort((a, b) => {
    const aTime = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
    const bTime = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
    return bTime - aTime;
  });
  if (options?.limit) filtered = filtered.slice(0, options.limit);
  return filtered;
}

export async function getArticleById(id: string): Promise<NewsArticle | null> {
  const items = await readAllInternal();
  return items.find((it) => it.id === id) ?? null;
}

export async function getPublishedArticleBySlug(slug: string): Promise<NewsArticle | null> {
  const items = await readAllInternal();
  return items.find((it) => it.slug === slug && it.status === "PUBLISHED") ?? null;
}

// ─────────────────────────────────────────────────────────────
// 관리자(쓰기) API
// ─────────────────────────────────────────────────────────────

export interface CreateArticleInput {
  title: string;
  subtitle?: string;
  body: string;
  category: NewsCategory;
  status: NewsStatus;
  tags?: string[];
  coverImageUrl?: string;
  coverImageFileName?: string;
  publishedAt?: string | null;
}

export async function createArticle(input: CreateArticleInput): Promise<NewsArticle> {
  const items = await readAllInternal();
  const now = new Date().toISOString();
  const baseSlug = slugify(input.title);
  let slug = baseSlug;
  let i = 2;
  while (items.some((it) => it.slug === slug)) slug = `${baseSlug}-${i++}`;

  const article: NewsArticle = {
    id: randomId(),
    slug,
    category: input.category,
    status: input.status,
    title: input.title.trim(),
    subtitle: input.subtitle?.trim() || undefined,
    body: input.body,
    coverImageUrl: input.coverImageUrl,
    coverImageFileName: input.coverImageFileName,
    tags: Array.isArray(input.tags) ? input.tags.filter(Boolean) : [],
    publishedAt:
      input.status === "PUBLISHED" ? input.publishedAt ?? now : input.publishedAt ?? null,
    createdAt: now,
    updatedAt: now,
  };
  await writeAllInternal([...items, article]);
  return article;
}

export type UpdateArticleInput = Partial<
  Pick<
    NewsArticle,
    | "title"
    | "subtitle"
    | "body"
    | "category"
    | "status"
    | "tags"
    | "coverImageUrl"
    | "coverImageFileName"
    | "publishedAt"
  >
>;

export async function updateArticle(
  id: string,
  patch: UpdateArticleInput
): Promise<NewsArticle | null> {
  const items = await readAllInternal();
  const target = items.find((it) => it.id === id);
  if (!target) return null;
  const now = new Date().toISOString();
  const next: NewsArticle = { ...target, ...patch, updatedAt: now };
  // DRAFT → PUBLISHED 승격 시 publishedAt 자동 설정
  if (target.status !== "PUBLISHED" && next.status === "PUBLISHED" && !next.publishedAt) {
    next.publishedAt = now;
  }
  const updatedList = items.map((it) => (it.id === id ? next : it));
  await writeAllInternal(updatedList);
  return next;
}

export async function deleteArticle(id: string): Promise<void> {
  const items = await readAllInternal();
  const target = items.find((it) => it.id === id);
  if (target?.coverImageUrl) await deleteCoverImageFile(target.coverImageUrl);
  const filtered = items.filter((it) => it.id !== id);
  await writeAllInternal(filtered);
}

export async function markEmailSent(
  id: string,
  recipientCount: number
): Promise<NewsArticle | null> {
  const items = await readAllInternal();
  const target = items.find((it) => it.id === id);
  if (!target) return null;
  const now = new Date().toISOString();
  const next: NewsArticle = {
    ...target,
    emailSentAt: now,
    emailRecipientCount: recipientCount,
    updatedAt: now,
  };
  const updatedList = items.map((it) => (it.id === id ? next : it));
  await writeAllInternal(updatedList);
  return next;
}

// ─────────────────────────────────────────────────────────────
// 커버 이미지 업로드 / 삭제
// ─────────────────────────────────────────────────────────────

export async function uploadCoverImage(
  file: File
): Promise<{ url: string; fileName: string }> {
  const supabase = getSupabaseClient();

  // 버킷 자동 생성
  const { data: buckets } = await supabase.storage.listBuckets();
  const bucketExists = buckets?.some((b) => b.name === BUCKET);
  if (!bucketExists) {
    const { error: createErr } = await supabase.storage.createBucket(BUCKET, { public: true });
    if (createErr && !createErr.message.includes("already exists")) {
      throw new Error(`버킷 생성 실패: ${createErr.message}`);
    }
  }

  const ext = path.extname(file.name).toLowerCase() || ".bin";
  const saved = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(`${FOLDER}/${saved}`, buffer, { contentType: file.type, upsert: false });
  if (error) throw new Error(error.message);

  const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(`${FOLDER}/${saved}`);
  return { url: urlData.publicUrl, fileName: file.name };
}

async function deleteCoverImageFile(url: string): Promise<void> {
  try {
    const supabase = getSupabaseClient();
    const fileName = url.split("/").pop();
    if (fileName) await supabase.storage.from(BUCKET).remove([`${FOLDER}/${fileName}`]);
  } catch {
    /* ignore */
  }
}
