// lib/spot-catalog-db.ts — 오더 #C54 admin 스팟 관리.
//
// 티켓 패턴 미러 (lib/ticket-catalog-db.ts): Supabase `pages` 테이블
// pageKey='spot-catalog' 단일 row · contentJson 배열 (Spot[]).
// Prisma·마이그레이션 없음. Supabase 스키마 무변경 (기존 pages 재사용).
//
// 폴백: DB 조회 실패 or contentJson 없음 → data/spots.ts 정적 배열.

import { createClient } from "@supabase/supabase-js";

import { spots as defaultSpots } from "@/data/spots";
import type { Spot } from "@/data/spots";

const PAGE_KEY = "spot-catalog";

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase 환경변수가 설정되지 않았습니다.");
  return createClient(url, key);
}

/** DB에서 스팟 목록 읽기. 없거나 실패 시 정적 폴백. */
export async function readSpotCatalog(): Promise<Spot[]> {
  try {
    const supabase = getSupabaseClient();
    const { data } = await supabase
      .from("pages")
      .select("contentJson")
      .eq("pageKey", PAGE_KEY)
      .single();
    if (!data?.contentJson) return defaultSpots;
    return data.contentJson as Spot[];
  } catch {
    return defaultSpots;
  }
}

/**
 * admin 등록 스팟만 반환 (폴백 없음).
 * DB 실패 or 비어있음 → null. 호출부에서 정적 fallback 로직 별도 처리 시 사용.
 */
export async function readSpotCatalogAdminOnly(): Promise<Spot[] | null> {
  try {
    const supabase = getSupabaseClient();
    const { data } = await supabase
      .from("pages")
      .select("contentJson")
      .eq("pageKey", PAGE_KEY)
      .single();
    if (!data?.contentJson) return null;
    return data.contentJson as Spot[];
  } catch {
    return null;
  }
}

/** 스팟 목록 전체 저장 (upsert). */
export async function writeSpotCatalog(spots: Spot[]): Promise<void> {
  const supabase = getSupabaseClient();
  const { data: existing } = await supabase
    .from("pages")
    .select("id")
    .eq("pageKey", PAGE_KEY)
    .single();

  if (existing) {
    await supabase
      .from("pages")
      .update({ contentJson: spots, updatedAt: new Date().toISOString() })
      .eq("pageKey", PAGE_KEY);
  } else {
    await supabase.from("pages").insert({
      id: crypto.randomUUID(),
      pageKey: PAGE_KEY,
      title: "Spot Catalog",
      slug: PAGE_KEY,
      contentJson: spots,
      status: "PUBLISHED",
      lang: "ko",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }
}

/** 스팟 추가. */
export async function addSpotItem(item: Spot): Promise<Spot[]> {
  const list = await readSpotCatalog();
  if (list.some((s) => s.slug === item.slug)) {
    throw new Error(`이미 존재하는 slug: ${item.slug}`);
  }
  const updated = [...list, item];
  await writeSpotCatalog(updated);
  return updated;
}

/** 스팟 수정 (slug 기준). */
export async function updateSpotItem(item: Spot): Promise<Spot[]> {
  const list = await readSpotCatalog();
  const idx = list.findIndex((s) => s.slug === item.slug);
  if (idx === -1) throw new Error(`스팟을 찾을 수 없습니다: ${item.slug}`);
  const updated = [...list];
  updated[idx] = item;
  await writeSpotCatalog(updated);
  return updated;
}

/** 스팟 삭제 (slug 기준). */
export async function deleteSpotItem(slug: string): Promise<Spot[]> {
  const list = await readSpotCatalog();
  const updated = list.filter((s) => s.slug !== slug);
  await writeSpotCatalog(updated);
  return updated;
}

/** slug 로 단일 스팟 조회 (published 무관). */
export async function getSpotFromCatalog(slug: string): Promise<Spot | null> {
  const list = await readSpotCatalog();
  return list.find((s) => s.slug === slug) ?? null;
}

/** 노출(published !== false) 스팟만 반환. published 필드가 없으면 노출 취급. */
export async function readVisibleSpots(): Promise<Spot[]> {
  const list = await readSpotCatalog();
  return list.filter((s) => s.published !== false);
}
