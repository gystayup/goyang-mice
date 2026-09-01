// lib/spot-photos.ts
// 오더 #C5-b [2] · #C5-c [2][3]: 스팟 사진 자동 감지.
//
// 감지 파일명 패턴 (우선순위, 앞이 이김):
//   1. {slug}-1.{ext}, {slug}-2.{ext}, {slug}-3.{ext} — D3 다운로드 규칙
//   2. {slug}.{ext}                                    — C5-b 자동 감지
// 확장자 우선순위: jpg → png → webp.
//
// 호출부 우선순위:
//   1) spot.gallery (수동 지정 — 카드에서는 cpyrht !== "Type3" 만 통과)
//   2) resolveSpotAutoPhoto(slug, titleKo)   ← 이 파일
//   3) CategoryIllustration (완전 없을 때)
//
// credit 은 "사진: {titleKo}" 로 자동 생성. cpyrht 는 알 수 없으니 미설정
//   (Type3 배제 필터는 spot.gallery 단계에서만 작동. auto 감지 파일은 사장님이
//    직접 승인해 배치한 것으로 간주하여 카드에도 허용).
//
// 서버 컴포넌트 전용 (fs 접근). 클라이언트 컴포넌트에서 import 금지.

import { existsSync } from "node:fs";
import path from "node:path";

import type { SpotGalleryImage } from "@/data/spots";

const EXTENSIONS = ["jpg", "png", "webp"] as const;

/** 파일이 존재하면 gallery 항목 반환, 아니면 null. */
function tryFile(rel: string, titleKo: string): SpotGalleryImage | null {
  const abs = path.join(process.cwd(), "public", rel);
  if (!existsSync(abs)) return null;
  return { url: `/${rel}`, credit: `사진: ${titleKo}` };
}

/**
 * 자동 감지된 첫 번째 사진을 반환한다.
 *   순서: {slug}-1.jpg → -2 → -3 → {slug}.jpg  (각 단계에서 png·webp 도 탐색)
 * 카드 폴백용으로 1장만 필요할 때 사용.
 */
export function resolveSpotAutoPhoto(
  slug: string,
  titleKo: string,
): SpotGalleryImage | null {
  for (const suffix of ["-1", "-2", "-3", ""]) {
    for (const ext of EXTENSIONS) {
      const hit = tryFile(`images/spots/${slug}${suffix}.${ext}`, titleKo);
      if (hit) return hit;
    }
  }
  return null;
}

/**
 * 자동 감지된 사진을 전부 모아 반환한다 (상세 갤러리용).
 *   {slug}-1, -2, -3 순서 (한 자리에 여러 확장자 있으면 첫 확장자 승),
 *   이어서 {slug} 접미어 없는 파일.
 */
function resolveSpotAutoAll(slug: string, titleKo: string): SpotGalleryImage[] {
  const out: SpotGalleryImage[] = [];
  for (const suffix of ["-1", "-2", "-3", ""]) {
    for (const ext of EXTENSIONS) {
      const hit = tryFile(`images/spots/${slug}${suffix}.${ext}`, titleKo);
      if (hit) {
        out.push(hit);
        break; // 같은 suffix 내에서는 첫 확장자만.
      }
    }
  }
  return out;
}

/**
 * 상세 페이지 갤러리에 넘길 이미지 배열.
 *   수동 spot.gallery 가 있으면 그대로. 없으면 auto 감지 배열. 둘 다 없으면 빈 배열.
 */
export function resolveSpotGallery(
  gallery: SpotGalleryImage[] | undefined,
  slug: string,
  titleKo: string,
): SpotGalleryImage[] {
  if (gallery && gallery.length > 0) return gallery;
  return resolveSpotAutoAll(slug, titleKo);
}
