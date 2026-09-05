// lib/day-trip-photos.ts — 오더 #C59-B [2] 당일코스 사진 자동 수집.
//
// 목적: 당일코스 상세 히어로·목록 카드에 축 색 그라디언트 대신 실제 사진을 채운다.
//       course.timeline[].spotSlug 를 순회 → loadSpot(slug) → spot.gallery[].url 수집.
//
// 방침: 신규 사진 제작·외부 수집 금지. 기존 public/images/spots/* (spots.ts gallery 필드) 재사용.
//       timeline 없음 · spotSlug 없음 · 매칭 스팟 없음 · gallery 없음 → 빈 배열.
//       0장이면 호출부에서 그라디언트 폴백 유지.
//
// 성능: loadSpot 은 lib/spot-catalog-db.ts 의 React cache() 로 요청당 1회 memoize.
//       각 코스마다 loadSpot 여러 번 호출되어도 실제 DB fetch 는 요청당 1회.

import type { DayTripCourse } from "@/data/day-trip-courses";
import { loadSpot } from "@/lib/spot-catalog-db";

/**
 * 코스의 timeline 스팟 갤러리에서 대표 사진 URL 을 순서대로 수집한다.
 *
 * · timeline 없음 → [] 반환.
 * · 각 노드의 spotSlug 로 loadSpot 호출 → spot.gallery[].url 을 순서대로 수집.
 * · 중복 URL 제거.
 * · limit 지정 시 상위 N 개로 자름.
 */
export async function getCoursePhotos(
  course: DayTripCourse,
  opts?: { limit?: number }
): Promise<string[]> {
  const timeline = course.timeline ?? [];
  if (timeline.length === 0) return [];

  const collected: string[] = [];
  const seen = new Set<string>();

  for (const node of timeline) {
    if (!node.spotSlug) continue;
    const spot = await loadSpot(node.spotSlug);
    if (!spot?.gallery || spot.gallery.length === 0) continue;
    for (const img of spot.gallery) {
      if (!img?.url) continue;
      if (seen.has(img.url)) continue;
      seen.add(img.url);
      collected.push(img.url);
    }
  }

  const limit = opts?.limit;
  if (typeof limit === "number" && limit > 0) return collected.slice(0, limit);
  return collected;
}
