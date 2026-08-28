// 고양 BEST 엠블럼 — 원형 SVG 컴포넌트 (Design OS 2.0 §4).
//
// 5레이어 (바깥→안):
//   1. 외곽 컬러 링 (카테고리 색, 두께 ≈ 지름의 10%)
//   2. 크림 내부 원 (#FFF8EF)
//   3. 상단 아크 텍스트 "GOYANG BEST" (카테고리 색)
//   4. 중앙 고양이 아이콘 (단색, 카테고리 색)
//   5. 하단 알약형 리본 (카테고리 색 배경 + 크림 텍스트, locale)
//
// 사이즈별 축약:
//   L·M  → 5레이어 전부
//   S    → 아크 텍스트 생략
//   XS   → 링 + 고양이 얼굴만 (리본·아크 생략)
//
// 다크모드 반전 없음 — 자체 크림 배경을 가진 독립 배지.
// 링/텍스트에 별도 인터랙션 없음 → 서버·클라이언트 어디서든 렌더 가능.

import { useId } from "react";

import {
  EMBLEM_ARC_TEXT,
  EMBLEM_COLORS,
  EMBLEM_DIAMETERS,
  EMBLEM_LABEL_PREFIX,
  EMBLEM_RIBBON_TEXT,
  type EmblemCategory,
  type EmblemLocale,
  type EmblemSize,
} from "@/components/emblem/colors";
import { EMBLEM_ICONS } from "@/components/emblem/icons";

export interface EmblemProps {
  category: EmblemCategory;
  size: EmblemSize;
  locale: EmblemLocale;
  /** 선택적 오버라이드용 className (예: 여백/그림자). SVG 자체 색상은 건드리지 않는 것을 권장. */
  className?: string;
}

export function Emblem({ category, size, locale, className }: EmblemProps) {
  const diameter = EMBLEM_DIAMETERS[size];
  const color = EMBLEM_COLORS[category];
  const cream = EMBLEM_COLORS.cream;
  const ribbonText = EMBLEM_RIBBON_TEXT[locale][category];
  const ariaLabel = `${EMBLEM_LABEL_PREFIX[locale]} ${ribbonText}`;
  const IconComponent = EMBLEM_ICONS[category];

  const showArcText = size === "L" || size === "M";
  const showRibbon = size !== "XS";

  const arcId = useId();
  const arcPathId = `emblem-arc-${arcId.replace(/[:]/g, "")}`;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={diameter}
      height={diameter}
      viewBox="0 0 200 200"
      role="img"
      aria-label={ariaLabel}
      className={className}
    >
      {/* 1. 외곽 컬러 링: 컬러 디스크 + 크림 디스크 오버레이로 링 두께 확보 */}
      <circle cx="100" cy="100" r="100" fill={color} />

      {/* 2. 크림 내부 원 — 링 두께 = 200 - 160 = 20 (지름의 10%) */}
      <circle cx="100" cy="100" r="80" fill={cream} />

      {/* 3. 상단 아크 텍스트 — L·M 에서만 */}
      {showArcText && (
        <>
          <defs>
            <path
              id={arcPathId}
              d="M 45 100 A 55 55 0 0 0 155 100"
              fill="none"
            />
          </defs>
          <text
            fill={color}
            fontSize="13"
            fontWeight="700"
            letterSpacing="2"
            fontFamily="system-ui, -apple-system, sans-serif"
          >
            <textPath
              href={`#${arcPathId}`}
              startOffset="50%"
              textAnchor="middle"
            >
              {EMBLEM_ARC_TEXT}
            </textPath>
          </text>
        </>
      )}

      {/* 4. 중앙 고양이 아이콘 (카테고리 색 단색 실루엣) */}
      {/* size 를 넘겨 S/XS 에서 아이콘이 뭉치지 않도록 subtle stroke 를 얹음 */}
      <IconComponent color={color} size={size} />

      {/* 5. 하단 알약형 리본 — L·M·S 에서만 (XS 는 생략) */}
      {showRibbon && (
        <g>
          <rect
            x="40"
            y="150"
            width="120"
            height="30"
            rx="15"
            ry="15"
            fill={color}
          />
          <text
            x="100"
            y="171"
            fill={cream}
            fontSize="14"
            fontWeight="700"
            textAnchor="middle"
            fontFamily="system-ui, -apple-system, sans-serif"
          >
            {ribbonText}
          </text>
        </g>
      )}
    </svg>
  );
}

export default Emblem;
