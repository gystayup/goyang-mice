// lib/spot-catalog-db.ts — 오더 #C54 admin 스팟 관리 · #C54-C React cache().
//
// 티켓 패턴 미러 (lib/ticket-catalog-db.ts): Supabase `pages` 테이블
// pageKey='spot-catalog' 단일 row · contentJson 배열 (Spot[]).
// Prisma·마이그레이션 없음. Supabase 스키마 무변경 (기존 pages 재사용).
//
// 폴백: DB 조회 실패 or contentJson 없음 → data/spots.ts 정적 배열.
//
// 오더 #C54-C: readSpotCatalog 를 React cache() 로 래핑 → 요청당 1회 DB 조회.
//   상세 1페이지가 loadSpot·loadSpots·loadNearbySpots 로 5~6회 호출하던 것이
//   요청 단위 memoize 로 단일 fetch 로 축소. 요청 사이에는 캐시 안 남음 (매 요청 새로 조회).
//
// 오더 #D26-검증: DB 시드 시점(C54, D26 이전)에 en/ja/zh 는 ko 폴백값으로 저장
//   되어 있고 D26 이후 정적 파일(data/spots.ts) 만 번역되었기 때문에, DB row 만
//   가지고 렌더하면 /en /ja /zh 페이지 본문이 한국어로 나온다. DB 직접 조작·
//   admin 저장 로직 무접촉 조건 하에 렌더 경로에서 오버레이:
//     · DB[loc] === DB.ko  (미번역 마커)  AND
//     · static[loc] !== static.ko           (정적에 실제 번역 존재)  AND
//     · DB.ko === static.ko                 (ko 원문 동일 · 안전한 페어)
//   세 조건 모두 성립할 때만 loc 값을 static 값으로 스왑. DB 에서 admin 이
//   실제로 번역해 둔 필드(DB[loc] !== DB.ko)는 그대로 존중. day-trip 다국어
//   패턴 (getLocalizedDayTripCourse) 과 동일 사상.

import { cache } from "react";
import { createClient } from "@supabase/supabase-js";

import { spots as defaultSpots } from "@/data/spots";
import type { Spot, I18nText, SpotLocale } from "@/data/spots";

const PAGE_KEY = "spot-catalog";
const OVERLAY_LOCALES: readonly Exclude<SpotLocale, "ko">[] = [
  "en",
  "ja",
  "zh-CN",
  "zh-TW",
];
const STATIC_BY_SLUG: Map<string, Spot> = new Map(
  defaultSpots.map((s) => [s.slug, s]),
);

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase 환경변수가 설정되지 않았습니다.");
  return createClient(url, key);
}

/** I18nText 형태 판별 (ko/en/ja/zh-CN/zh-TW 5키 모두 string). */
function isI18nText(v: unknown): v is I18nText {
  if (!v || typeof v !== "object") return false;
  const o = v as Record<string, unknown>;
  return (
    typeof o.ko === "string" &&
    typeof o.en === "string" &&
    typeof o.ja === "string" &&
    typeof o["zh-CN"] === "string" &&
    typeof o["zh-TW"] === "string"
  );
}

/** DB 미번역 마커 → 정적 번역으로 스왑. 세 안전조건 성립 시에만. */
function overlayI18n(dbVal: I18nText, staticVal: I18nText): I18nText {
  const out: I18nText = { ...dbVal };
  for (const loc of OVERLAY_LOCALES) {
    if (
      dbVal[loc] === dbVal.ko &&
      staticVal[loc] !== staticVal.ko &&
      dbVal.ko === staticVal.ko
    ) {
      out[loc] = staticVal[loc];
    }
  }
  return out;
}

/** 트리 재귀 오버레이. 배열은 index 대응, I18nText 리프에서만 값 스왑. */
function overlayNode(dbNode: unknown, staticNode: unknown): unknown {
  if (dbNode === null || dbNode === undefined) return dbNode;
  if (isI18nText(dbNode)) {
    if (isI18nText(staticNode)) return overlayI18n(dbNode, staticNode);
    return dbNode;
  }
  if (Array.isArray(dbNode)) {
    if (!Array.isArray(staticNode)) return dbNode;
    return dbNode.map((item, i) => overlayNode(item, staticNode[i]));
  }
  if (typeof dbNode === "object") {
    if (
      staticNode === null ||
      staticNode === undefined ||
      typeof staticNode !== "object" ||
      Array.isArray(staticNode)
    ) {
      return dbNode;
    }
    const src = dbNode as Record<string, unknown>;
    const other = staticNode as Record<string, unknown>;
    const out: Record<string, unknown> = {};
    for (const k of Object.keys(src)) {
      out[k] = k in other ? overlayNode(src[k], other[k]) : src[k];
    }
    return out;
  }
  return dbNode;
}

/** DB 스팟 목록에 정적 번역을 slug 매칭으로 오버레이. */
function overlaySpotList(dbList: Spot[]): Spot[] {
  return dbList.map((dbSpot) => {
    const staticSpot = STATIC_BY_SLUG.get(dbSpot.slug);
    if (!staticSpot) return dbSpot;
    return overlayNode(dbSpot, staticSpot) as Spot;
  });
}

/** DB에서 스팟 목록 읽기. 없거나 실패 시 정적 폴백. 오더 #C54-C: 요청당 1회 memoize.
 *  오더 #D26-검증: DB 결과에는 정적 번역 오버레이 적용. 정적 폴백 경로는 이미
 *  data/spots.ts 원본이므로 오버레이 불필요. */
export const readSpotCatalog = cache(async (): Promise<Spot[]> => {
  try {
    const supabase = getSupabaseClient();
    const { data } = await supabase
      .from("pages")
      .select("contentJson")
      .eq("pageKey", PAGE_KEY)
      .single();
    if (!data?.contentJson) return defaultSpots;
    return overlaySpotList(data.contentJson as Spot[]);
  } catch {
    return defaultSpots;
  }
});

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

// ─── 오더 #C54-B 프론트 소비 API (published 필터 자동 · DB 우선 · 정적 폴백) ───

/** 프론트 노출용 전체 스팟 목록. published !== false 만. */
export async function loadSpots(): Promise<Spot[]> {
  return readVisibleSpots();
}

/**
 * slug 로 단일 스팟 조회 (프론트용).
 *   · published === false 이면 null 반환 (오더 #C54-B [2] "노출 off → 화면에서 사라짐")
 *   · 없거나 published false → null
 */
export async function loadSpot(slug: string): Promise<Spot | null> {
  const s = await getSpotFromCatalog(slug);
  if (!s) return null;
  if (s.published === false) return null;
  return s;
}

/** slug 존재 여부 (published !== false 만 카운트). 프론트에서 링크 노출 판정. */
export async function hasSpotAsync(slug: string): Promise<boolean> {
  const s = await loadSpot(slug);
  return s !== null;
}

/**
 * 근처 스팟 조회 (프론트용). 기존 data/spots.ts getNearbySpots 로직 미러:
 *   같은 category · slug 다름 · published !== false · limit(기본 3)
 */
export async function loadNearbySpots(
  spot: Spot,
  opts?: { limit?: number },
): Promise<Spot[]> {
  const limit = opts?.limit ?? 3;
  const list = await readVisibleSpots();
  return list
    .filter((s) => s.slug !== spot.slug && s.category === spot.category)
    .slice(0, limit);
}
