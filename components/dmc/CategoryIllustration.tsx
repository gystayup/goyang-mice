// components/dmc/CategoryIllustration.tsx
// /dmc/[slug] 개요 탭 About 좌측 카테고리 일러스트 (오더 #B1 [4]).
//
// 파일 규약: /images/illustrations/illust-{category}.svg
// 렌더 방식: MovePrep(#A6) 과 동일한 인라인 SVG + currentColor(color #D4AF37).
//   Next Image 는 SVG 내부 색을 못 바꾸므로 dangerouslySetInnerHTML.
//   공용 유틸: lib/inline-svg.ts loadPublicSvg().
// 파일 부재 시 렌더 생략 (원문 렌더 규칙 8).

import type { SpotCategory } from "@/data/spots";
import { loadPublicSvg } from "@/lib/inline-svg";

export function CategoryIllustration({
  category,
  className,
}: {
  category: SpotCategory;
  className?: string;
}) {
  const svg = loadPublicSvg(`/images/illustrations/illust-${category}.svg`);
  if (!svg) return null;
  return (
    <div
      aria-hidden="true"
      className={`inline-block text-[#D4AF37] [&>svg]:h-full [&>svg]:w-full ${className ?? ""}`}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
