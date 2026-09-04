// lib/day-trip-catalog-db.ts — 오더 #C57 [1] 당일코스 admin 연동.
//
// 스팟(lib/spot-catalog-db.ts) · 티켓(lib/ticket-catalog-db.ts) 패턴 미러:
//   Supabase `pages` 테이블 pageKey='day-trip-catalog' 단일 row
//   contentJson 배열 (DayTripCourse[]). Prisma 스키마 무변경.
//
// 폴백: DB 조회 실패 or contentJson 없음 → data/day-trip-courses.ts 17코스 시드.
// 요청당 1회 memoize (React cache).

import { cache } from "react";
import { createClient } from "@supabase/supabase-js";

import { dayTripCourses as defaultCourses } from "@/data/day-trip-courses";
import type { DayTripCourse } from "@/data/day-trip-courses";

const PAGE_KEY = "day-trip-catalog";

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase 환경변수가 설정되지 않았습니다.");
  return createClient(url, key);
}

/** DB 조회 → 없거나 실패 시 정적 폴백. 요청당 1회 memoize. */
export const readDayTripCatalog = cache(async (): Promise<DayTripCourse[]> => {
  try {
    const supabase = getSupabaseClient();
    const { data } = await supabase
      .from("pages")
      .select("contentJson")
      .eq("pageKey", PAGE_KEY)
      .single();
    if (!data?.contentJson) return defaultCourses;
    return data.contentJson as DayTripCourse[];
  } catch {
    return defaultCourses;
  }
});

/** admin 등록 코스만 반환 (폴백 없음). 비어있음 → null. */
export async function readDayTripCatalogAdminOnly(): Promise<DayTripCourse[] | null> {
  try {
    const supabase = getSupabaseClient();
    const { data } = await supabase
      .from("pages")
      .select("contentJson")
      .eq("pageKey", PAGE_KEY)
      .single();
    if (!data?.contentJson) return null;
    return data.contentJson as DayTripCourse[];
  } catch {
    return null;
  }
}

/** 전체 저장 (upsert). */
export async function writeDayTripCatalog(courses: DayTripCourse[]): Promise<void> {
  const supabase = getSupabaseClient();
  const { data: existing } = await supabase
    .from("pages")
    .select("id")
    .eq("pageKey", PAGE_KEY)
    .single();

  if (existing) {
    await supabase
      .from("pages")
      .update({ contentJson: courses, updatedAt: new Date().toISOString() })
      .eq("pageKey", PAGE_KEY);
  } else {
    await supabase.from("pages").insert({
      id: crypto.randomUUID(),
      pageKey: PAGE_KEY,
      title: "Day Trip Catalog",
      slug: PAGE_KEY,
      contentJson: courses,
      status: "PUBLISHED",
      lang: "ko",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }
}

/** 코스 추가 (id 기준 중복 방지). */
export async function addDayTripCourse(item: DayTripCourse): Promise<DayTripCourse[]> {
  const list = await readDayTripCatalog();
  if (list.some((c) => c.id === item.id)) {
    throw new Error(`이미 존재하는 id: ${item.id}`);
  }
  const updated = [...list, item];
  await writeDayTripCatalog(updated);
  return updated;
}

/** 코스 수정 (id 기준). */
export async function updateDayTripCourse(item: DayTripCourse): Promise<DayTripCourse[]> {
  const list = await readDayTripCatalog();
  const idx = list.findIndex((c) => c.id === item.id);
  if (idx === -1) throw new Error(`코스를 찾을 수 없습니다: ${item.id}`);
  const updated = [...list];
  updated[idx] = item;
  await writeDayTripCatalog(updated);
  return updated;
}

/** 코스 삭제 (id 기준). */
export async function deleteDayTripCourse(id: string): Promise<DayTripCourse[]> {
  const list = await readDayTripCatalog();
  const updated = list.filter((c) => c.id !== id);
  await writeDayTripCatalog(updated);
  return updated;
}

/** id 로 단일 코스 조회 (published 무관 · admin·URL 접근). */
export async function getDayTripCourseFromCatalog(id: string): Promise<DayTripCourse | null> {
  const list = await readDayTripCatalog();
  return list.find((c) => c.id === id) ?? null;
}

/** 노출(published !== false) 코스만 반환. published 필드 없으면 노출 취급. */
export async function readVisibleDayTripCourses(): Promise<DayTripCourse[]> {
  const list = await readDayTripCatalog();
  return list.filter((c) => c.published !== false);
}

// ─── 프론트 소비 API (published 필터 자동) ───────────────────────────────

/** 프론트 노출용 전체 목록. published !== false 만. */
export async function loadDayTrips(): Promise<DayTripCourse[]> {
  return readVisibleDayTripCourses();
}

/** id 로 단일 코스 (프론트용). published === false → null. */
export async function loadDayTrip(id: string): Promise<DayTripCourse | null> {
  const c = await getDayTripCourseFromCatalog(id);
  if (!c) return null;
  if (c.published === false) return null;
  return c;
}
