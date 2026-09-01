// lib/spot-photos.ts
// 오더 #C5-b [2]: 스팟 사진 자동 감지.
//
// 규칙:
//   · public/images/spots/{slug}.{jpg,png,webp} 파일이 있으면
//     자동으로 gallery 첫 장으로 사용한다.
//   · credit 은 "사진: {title.ko}" 로 자동 생성.
//   · 파일이 없으면 조용히 null 반환 → 상위 폴백(CategoryIllustration) 로 진행.
//
// 우선순위 (호출부):
//   1) spot.gallery (수동 지정 — 스팟 데이터에 직접 넣은 것)
//   2) resolveSpotAutoPhoto(slug, title_ko)  ← 이 파일
//   3) CategoryIllustration (완전 없을 때)
//
// 서버 컴포넌트 전용 (fs 접근). 클라이언트 컴포넌트에서 import 금지.

import { existsSync } from "node:fs";
import path from "node:path";

import type { SpotGalleryImage } from "@/data/spots";

// 감지 대상 확장자. 오더 [2] 지시대로 jpg + png + webp.
//   같은 slug 에 여러 확장자가 있으면 이 배열의 앞쪽이 이긴다.
const EXTENSIONS = ["jpg", "png", "webp"] as const;

/**
 * public/images/spots/{slug}.{ext} 를 순회하여 첫 발견 파일을 gallery 항목으로 반환.
 * 없으면 null. 파일을 리포에 넣는 즉시 (코드 변경 없이) 반영된다.
 */
export function resolveSpotAutoPhoto(
  slug: string,
  titleKo: string,
): SpotGalleryImage | null {
  for (const ext of EXTENSIONS) {
    const rel = `images/spots/${slug}.${ext}`;
    const abs = path.join(process.cwd(), "public", rel);
    if (existsSync(abs)) {
      return {
        url: `/${rel}`,
        credit: `사진: ${titleKo}`,
      };
    }
  }
  return null;
}

/**
 * 상세 페이지 갤러리에 넘길 이미지 배열을 계산한다.
 *   수동 spot.gallery 가 있으면 그대로. 없으면 auto photo 1장. 둘 다 없으면 빈 배열.
 */
export function resolveSpotGallery(
  gallery: SpotGalleryImage[] | undefined,
  slug: string,
  titleKo: string,
): SpotGalleryImage[] {
  if (gallery && gallery.length > 0) return gallery;
  const auto = resolveSpotAutoPhoto(slug, titleKo);
  return auto ? [auto] : [];
}
