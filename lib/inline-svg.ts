// lib/inline-svg.ts
// public/images/... 하위의 SVG 를 서버-사이드에서 읽어 인라인 문자열로 반환.
//
// currentColor 를 사용하는 SVG 를 wrapper 의 text 컬러로 재색상하기 위한 유틸.
// Next Image 는 SVG 내부 fill/stroke 를 제어하지 못하므로,
// dangerouslySetInnerHTML 로 원문 삽입해야 currentColor 가 부모 색상을 승계.
//
// 초기 도입은 오더 #A6 MovePrep 컴포넌트가 자체 함수로 사용. 오더 #B1 에서
// CategoryIllustration 도 동일 방식이 필요해 공통 유틸로 뽑음.
// MovePrep 파일은 무접촉 (자체 사본 유지). 후속 리팩터로 통합 가능.

import { existsSync, readFileSync } from "fs";
import path from "path";

/**
 * public 하위 SVG 를 로드해 원문 문자열로 반환. 파일 부재·비 SVG 시 null.
 * @param publicRelPath "/images/…/foo.svg" 형태
 */
export function loadPublicSvg(publicRelPath: string): string | null {
  try {
    const clean = publicRelPath.replace(/^\/+/, "");
    const abs = path.join(process.cwd(), "public", clean);
    if (!existsSync(abs)) return null;
    const svg = readFileSync(abs, "utf8");
    if (!svg.trim().toLowerCase().startsWith("<svg")) return null;
    return svg;
  } catch {
    return null;
  }
}
