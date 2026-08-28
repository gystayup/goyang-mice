// 고양 BEST 엠블럼 — 카테고리별 고양이 아이콘 5종.
// viewBox 0-200 좌표계에서 카테고리 색상 단색 실루엣으로 그림.
// 추후 정식 캐릭터 아트가 준비되면 이 파일의 아이콘만 교체하면 됨
// (Emblem.tsx 및 colors.ts 는 손대지 않아도 되도록 인터페이스 격리).

import type { ReactElement } from "react";

import type { EmblemCategory } from "@/components/emblem/colors";

type IconProps = { color: string };

/** 얼굴 실루엣 base — food/culture/kculture/history 공통 */
const FACE_D =
  "M 100 76 L 88 60 L 94 78 C 78 82 74 100 74 108 C 74 122 88 128 100 128 C 112 128 126 122 126 108 C 126 100 122 82 106 78 L 112 60 Z";

/** walk — 걷는 옆모습 + 꼬리 */
function WalkIcon({ color }: IconProps) {
  return (
    <g fill={color}>
      {/* body ellipse */}
      <ellipse cx="98" cy="108" rx="30" ry="12" />
      {/* head (side) */}
      <circle cx="126" cy="94" r="11" />
      {/* ears */}
      <path d="M 118 89 L 120 80 L 124 88 Z" />
      <path d="M 128 88 L 132 80 L 130 89 Z" />
      {/* legs */}
      <rect x="76" y="118" width="4" height="14" rx="1.5" />
      <rect x="88" y="118" width="4" height="14" rx="1.5" />
      <rect x="102" y="118" width="4" height="14" rx="1.5" />
      <rect x="114" y="118" width="4" height="14" rx="1.5" />
      {/* tail curving up-back */}
      <path d="M 70 106 C 58 96 60 82 68 74 L 74 78 C 68 84 68 96 78 108 Z" />
    </g>
  );
}

/** food — 얼굴 + 포크 */
function FoodIcon({ color }: IconProps) {
  return (
    <g fill={color}>
      <path d={FACE_D} />
      {/* fork stem */}
      <rect x="146" y="82" width="4" height="40" rx="1.5" />
      {/* fork head (bar + 3 prongs) */}
      <rect x="140" y="76" width="16" height="6" rx="1.5" />
      <rect x="141" y="70" width="2.5" height="8" />
      <rect x="146.75" y="70" width="2.5" height="8" />
      <rect x="152.5" y="70" width="2.5" height="8" />
    </g>
  );
}

/** culture — 얼굴 + 별 2개 */
function CultureIcon({ color }: IconProps) {
  const star = (cx: number, cy: number, r: number) => {
    // 5-point star centered at (cx,cy), outer radius r, inner r*0.4
    const pts: string[] = [];
    for (let i = 0; i < 10; i++) {
      const angle = (Math.PI / 5) * i - Math.PI / 2;
      const rr = i % 2 === 0 ? r : r * 0.4;
      pts.push(`${cx + rr * Math.cos(angle)},${cy + rr * Math.sin(angle)}`);
    }
    return pts.join(" ");
  };
  return (
    <g fill={color}>
      <path d={FACE_D} />
      <polygon points={star(58, 70, 10)} />
      <polygon points={star(142, 70, 10)} />
    </g>
  );
}

/** kculture — 얼굴 + 마이크 */
function KcultureIcon({ color }: IconProps) {
  return (
    <g fill={color}>
      <path d={FACE_D} />
      {/* mic head */}
      <ellipse cx="148" cy="78" rx="10" ry="12" />
      {/* mic stem */}
      <rect x="145" y="88" width="6" height="18" rx="2" />
      {/* mic base */}
      <rect x="136" y="104" width="24" height="4" rx="2" />
    </g>
  );
}

/** history — 얼굴 + 갓 + 갓끈 */
function HistoryIcon({ color }: IconProps) {
  return (
    <g fill={color}>
      <path d={FACE_D} />
      {/* gat brim (넓은 챙) */}
      <rect x="62" y="58" width="76" height="5" rx="2.5" />
      {/* gat crown (원통형) */}
      <path d="M 82 58 L 118 58 L 114 40 L 86 40 Z" />
      {/* 갓끈 (chin straps) — 얼굴 옆으로 흘러내림 */}
      <rect x="76" y="66" width="3" height="52" rx="1.5" />
      <rect x="121" y="66" width="3" height="52" rx="1.5" />
    </g>
  );
}

export const EMBLEM_ICONS: Record<
  EmblemCategory,
  (props: IconProps) => ReactElement
> = {
  walk: WalkIcon,
  food: FoodIcon,
  culture: CultureIcon,
  kculture: KcultureIcon,
  history: HistoryIcon,
};
