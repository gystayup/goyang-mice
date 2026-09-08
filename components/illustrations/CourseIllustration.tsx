// components/illustrations/CourseIllustration.tsx — 오더 #D07.
//
// 17개 당일코스 전용 라인 일러스트 (visitlondon 참고).
// viewBox 300x250 · stroke var(--accent) · fill none · stroke-width 1.15 (세부 0.72)
// linecap/linejoin round · 각 코스 2~3 요소 + 지면선 · 애니 1~2개
// prefers-reduced-motion: reduce 시 정지 (CSS media query)
//
// 외부 이미지·라이브러리 사용 없음. SVG 순수 인라인.

import type { ReactElement } from "react";

type Props = {
  courseId: string;
  className?: string;
  title?: string;
};

const SVG_PROPS = {
  viewBox: "0 0 300 250",
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  stroke: "var(--accent)",
  strokeWidth: 1.15,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

// 애니메이션 CSS — 컴포넌트 최상위에 한 번 삽입, prefers-reduced-motion 대응.
const ANIM_STYLE = `
@keyframes ci-drift { 0%,100%{transform:translateX(0)} 50%{transform:translateX(6px)} }
@keyframes ci-fly   { 0%{transform:translateX(-8px)} 100%{transform:translateX(12px)} }
@keyframes ci-blink { 0%,60%,100%{opacity:1} 30%{opacity:0.25} }
@keyframes ci-wave  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-1.5px)} }
@keyframes ci-spin  { from{transform:rotate(0)} to{transform:rotate(360deg)} }
@keyframes ci-sway  { 0%,100%{transform:rotate(-3deg)} 50%{transform:rotate(3deg)} }
.ci-drift{animation:ci-drift 5s ease-in-out infinite}
.ci-fly  {animation:ci-fly   9s linear      infinite alternate}
.ci-blink{animation:ci-blink 2.4s ease-in-out infinite}
.ci-wave {animation:ci-wave  3.5s ease-in-out infinite}
.ci-spin {transform-origin:center;animation:ci-spin 12s linear infinite}
.ci-sway {transform-origin:center;animation:ci-sway 4s ease-in-out infinite}
@media (prefers-reduced-motion: reduce) {
  .ci-drift,.ci-fly,.ci-blink,.ci-wave,.ci-spin,.ci-sway { animation: none !important; transform: none !important; }
}
`;

// ─── 개별 코스 SVG ─────────────────────────────────────────────────────────
// 공통 지면선 (헬퍼)
const Ground = () => <line x1="10" y1="220" x2="290" y2="220" strokeWidth="1.15" />;

// 서울축 ────────────────────────────────────────────────

// seoul-royal — 경복궁 근정전 (근정전 상세 형태)
//   상층: 용마루 + 취두(양끝) + 겹처마(2겹) + 처마 상승 곡선 + 잡상 3개씩
//   상층 몸체: 공포 세로선 9개 + 창방
//   하층: 겹처마 지붕 + 기둥 5개 + 어칸 문(창살) + 협칸 창 2개
//   기단: 이층 월대 + 답도 계단
//   부속: 우측 소나무, 좌측 깃대+깃발
//   애니: 구름 2개 drift, 새 2마리 fly, 깃발 sway
function IllustSeoulRoyal(): ReactElement {
  return (
    <>
      {/* 구름 A (좌 상단, drift) */}
      <g className="ci-drift" strokeWidth="0.72">
        <path d="M20 42 q8 -10 20 -6 q4 -12 18 -6 q12 -3 14 7 q4 8 -4 10 z" />
      </g>
      {/* 구름 B (중앙 상단, drift) — 애니 위상 다르게 하려면 다른 클래스지만 간단히 유지 */}
      <g className="ci-drift" strokeWidth="0.72" transform="translate(120 -6)">
        <path d="M40 52 q6 -8 16 -4 q4 -10 14 -4 q10 -2 12 6 q4 6 -4 8 z" />
      </g>
      {/* 새 (fly, 우 상단) */}
      <g className="ci-fly" strokeWidth="0.72" transform="translate(200 40)">
        <path d="M0 4 q4 -6 8 0 q4 -6 8 0" />
        <path d="M18 12 q3 -5 6 0 q3 -5 6 0" strokeWidth="0.6" />
      </g>

      {/* 깃대 + 깃발 (좌 · sway) */}
      <line x1="30" y1="200" x2="30" y2="80" strokeWidth="0.72" />
      <g className="ci-sway" style={{ transformOrigin: "30px 82px" }}>
        <path d="M30 82 l16 4 l-16 6 z" strokeWidth="0.72" />
      </g>

      {/* 소나무 (우) */}
      <g transform="translate(268 200)" strokeWidth="0.72">
        <path d="M0 0 q-4 -20 -2 -40 q2 -18 6 -30" />
        <path d="M-8 -30 q4 -6 10 -4" />
        <path d="M-12 -20 q6 -6 14 -4" />
        <path d="M4 -55 q-10 -4 -18 -2" />
        <path d="M2 -65 q-8 -3 -14 -1" />
      </g>

      {/* ─── 상층 지붕 ─── */}
      {/* 용마루 */}
      <line x1="90" y1="94" x2="210" y2="94" strokeWidth="1.15" />
      {/* 취두 (양 끝) */}
      <path d="M88 94 q-3 -5 0 -8 q3 3 2 8" strokeWidth="0.72" />
      <path d="M212 94 q3 -5 0 -8 q-3 3 -2 8" strokeWidth="0.72" />
      {/* 겹처마 상단 곡선 (2겹) + 처마 상승 */}
      <path d="M78 108 q72 -22 144 0" />
      <path d="M70 118 q80 -18 160 0" strokeWidth="0.72" />
      <path d="M70 118 q-4 -4 -6 -10" strokeWidth="0.72" />
      <path d="M230 118 q4 -4 6 -10" strokeWidth="0.72" />
      {/* 잡상 3개씩 (좌우 지붕마루) */}
      {[86, 92, 98].map((x) => (
        <g key={`jL${x}`} strokeWidth="0.5" transform={`translate(${x} 108)`}>
          <path d="M0 0 l1.5 -3 l1.5 3 z" />
        </g>
      ))}
      {[210, 216, 222].map((x) => (
        <g key={`jR${x}`} strokeWidth="0.5" transform={`translate(${x} 108)`}>
          <path d="M0 0 l1.5 -3 l1.5 3 z" />
        </g>
      ))}

      {/* 상층 몸체 · 창방 */}
      <line x1="82" y1="126" x2="218" y2="126" strokeWidth="0.72" />
      <line x1="82" y1="140" x2="218" y2="140" strokeWidth="0.72" />
      {/* 공포 세로선 9개 */}
      {[90, 106, 122, 138, 150, 162, 178, 194, 210].map((x) => (
        <line
          key={`gong-${x}`}
          x1={x}
          y1="126"
          x2={x}
          y2="140"
          strokeWidth="0.5"
        />
      ))}

      {/* ─── 하층 지붕 ─── */}
      <path d="M50 156 q100 -22 200 0" />
      <path d="M45 168 q105 -20 210 0" strokeWidth="0.72" />
      <path d="M45 168 q-5 -5 -7 -12" strokeWidth="0.72" />
      <path d="M255 168 q5 -5 7 -12" strokeWidth="0.72" />

      {/* 하층 몸체 · 창방 */}
      <line x1="58" y1="176" x2="242" y2="176" strokeWidth="0.72" />
      {/* 기둥 5개 */}
      {[70, 110, 150, 190, 230].map((x) => (
        <line key={`col-${x}`} x1={x} y1="176" x2={x} y2="212" strokeWidth="0.72" />
      ))}
      {/* 어칸 문 (중앙 · 창살 격자) */}
      <rect x="138" y="180" width="24" height="32" strokeWidth="0.72" />
      <line x1="150" y1="180" x2="150" y2="212" strokeWidth="0.5" />
      <line x1="138" y1="188" x2="162" y2="188" strokeWidth="0.5" />
      <line x1="138" y1="196" x2="162" y2="196" strokeWidth="0.5" />
      <line x1="138" y1="204" x2="162" y2="204" strokeWidth="0.5" />
      {/* 협칸 창 2개 */}
      <rect x="82" y="184" width="20" height="24" strokeWidth="0.72" />
      <line x1="92" y1="184" x2="92" y2="208" strokeWidth="0.5" />
      <line x1="82" y1="196" x2="102" y2="196" strokeWidth="0.5" />
      <rect x="198" y="184" width="20" height="24" strokeWidth="0.72" />
      <line x1="208" y1="184" x2="208" y2="208" strokeWidth="0.5" />
      <line x1="198" y1="196" x2="218" y2="196" strokeWidth="0.5" />

      {/* ─── 이층 월대 (상 · 하) ─── */}
      <line x1="55" y1="212" x2="245" y2="212" />
      <line x1="55" y1="212" x2="55" y2="218" strokeWidth="0.72" />
      <line x1="245" y1="212" x2="245" y2="218" strokeWidth="0.72" />
      <line x1="55" y1="218" x2="245" y2="218" strokeWidth="0.72" />
      <line x1="45" y1="220" x2="255" y2="220" />

      {/* 답도 (중앙 계단 3단) */}
      <path d="M138 220 l6 -4 h12 l6 4" strokeWidth="0.72" />
      <path d="M132 224 l8 -4 h20 l8 4" strokeWidth="0.72" />
      <line x1="150" y1="216" x2="150" y2="220" strokeWidth="0.5" />
      {/* 계단 봉황 (답도 중앙 상징) */}
      <circle cx="150" cy="218" r="1.4" strokeWidth="0.5" />

      <Ground />
    </>
  );
}

// seoul-night — N서울타워 + 남산 케이블카 + 조명 점멸
function IllustSeoulNight(): ReactElement {
  return (
    <>
      {/* 남산 능선 */}
      <path d="M20 200 q60 -60 120 -50 q60 10 140 40" strokeWidth="0.72" />
      {/* 케이블카 케이블 */}
      <line x1="30" y1="130" x2="150" y2="90" strokeWidth="0.72" />
      {/* 케이블카 캐빈 */}
      <rect x="70" y="107" width="14" height="8" rx="1.5" strokeWidth="0.72" />
      <line x1="77" y1="107" x2="77" y2="103" strokeWidth="0.72" />
      {/* N서울타워 본체 */}
      <line x1="200" y1="200" x2="200" y2="80" />
      {/* 타워 상단 캡슐 */}
      <ellipse cx="200" cy="70" rx="16" ry="6" />
      <line x1="184" y1="70" x2="184" y2="82" />
      <line x1="216" y1="70" x2="216" y2="82" />
      <path d="M188 82 h24" />
      {/* 안테나 (blink) */}
      <line x1="200" y1="70" x2="200" y2="45" strokeWidth="0.72" />
      <circle cx="200" cy="42" r="2.5" className="ci-blink" strokeWidth="0.72" />
      {/* 캐빈 조명 (blink) */}
      <circle cx="200" cy="72" r="1.4" className="ci-blink" strokeWidth="0.72" />
      <Ground />
    </>
  );
}

// seoul-k-youth — 경의선숲길 철길 + 가로수 + 벤치
function IllustSeoulKYouth(): ReactElement {
  return (
    <>
      {/* 원경 나무 (sway) */}
      <g className="ci-sway" transform="translate(60 200)" strokeWidth="0.72">
        <line x1="0" y1="0" x2="0" y2="-40" />
        <circle cx="0" cy="-45" r="14" />
      </g>
      <g className="ci-sway" transform="translate(240 200)" strokeWidth="0.72">
        <line x1="0" y1="0" x2="0" y2="-40" />
        <circle cx="0" cy="-45" r="14" />
      </g>
      {/* 철길 (원근) */}
      <line x1="60" y1="220" x2="140" y2="140" />
      <line x1="240" y1="220" x2="160" y2="140" />
      {/* 침목 */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const y = 220 - i * 14;
        const w = 90 - i * 12;
        const cx = 150;
        return <line key={i} x1={cx - w / 2} y1={y} x2={cx + w / 2} y2={y} strokeWidth="0.72" />;
      })}
      {/* 벤치 */}
      <line x1="180" y1="205" x2="220" y2="205" />
      <line x1="180" y1="205" x2="180" y2="215" strokeWidth="0.72" />
      <line x1="220" y1="205" x2="220" y2="215" strokeWidth="0.72" />
      <Ground />
    </>
  );
}

// seoul-food-design — DDP 곡면 외벽 + 광장시장 노점 천막
function IllustSeoulFoodDesign(): ReactElement {
  return (
    <>
      {/* DDP 곡면 (좌) */}
      <path d="M20 200 q30 -100 90 -80 q40 20 40 60 q0 20 -20 20 z" />
      {/* DDP 패널 라인 */}
      <path d="M40 175 q30 -50 70 -45" strokeWidth="0.72" />
      <path d="M50 195 q30 -40 75 -30" strokeWidth="0.72" />
      {/* 시장 천막 (우 · drift) */}
      <g className="ci-drift" transform="translate(190 100)">
        <path d="M0 60 q30 -30 60 0" />
        <line x1="0" y1="60" x2="60" y2="60" strokeWidth="0.72" />
        {/* 술 장식 */}
        <line x1="10" y1="60" x2="10" y2="66" strokeWidth="0.72" />
        <line x1="30" y1="60" x2="30" y2="66" strokeWidth="0.72" />
        <line x1="50" y1="60" x2="50" y2="66" strokeWidth="0.72" />
      </g>
      {/* 노점 다리 */}
      <line x1="190" y1="160" x2="190" y2="200" />
      <line x1="250" y1="160" x2="250" y2="200" />
      <Ground />
    </>
  );
}

// seoul-hip — 서울숲 나무 + 성수동 붉은벽돌 공장 굴뚝
function IllustSeoulHip(): ReactElement {
  return (
    <>
      {/* 나무 (sway) */}
      <g className="ci-sway" transform="translate(70 200)">
        <line x1="0" y1="0" x2="0" y2="-55" />
        <circle cx="-8" cy="-58" r="12" strokeWidth="0.72" />
        <circle cx="8" cy="-63" r="14" strokeWidth="0.72" />
        <circle cx="0" cy="-72" r="10" strokeWidth="0.72" />
      </g>
      {/* 공장 건물 (붉은벽돌) */}
      <rect x="150" y="140" width="100" height="80" />
      {/* 벽돌 힌트 */}
      <line x1="150" y1="160" x2="250" y2="160" strokeWidth="0.72" />
      <line x1="150" y1="180" x2="250" y2="180" strokeWidth="0.72" />
      <line x1="150" y1="200" x2="250" y2="200" strokeWidth="0.72" />
      <line x1="180" y1="140" x2="180" y2="220" strokeWidth="0.72" />
      <line x1="220" y1="140" x2="220" y2="220" strokeWidth="0.72" />
      {/* 창문 */}
      <rect x="160" y="150" width="12" height="8" strokeWidth="0.72" />
      <rect x="190" y="150" width="12" height="8" strokeWidth="0.72" />
      <rect x="228" y="150" width="12" height="8" strokeWidth="0.72" />
      {/* 굴뚝 */}
      <line x1="230" y1="140" x2="230" y2="80" />
      <line x1="240" y1="140" x2="240" y2="80" />
      <line x1="230" y1="80" x2="240" y2="80" />
      <Ground />
    </>
  );
}

// seoul-modern — 봉은사 전각 + 코엑스 유리빌딩 대비
function IllustSeoulModern(): ReactElement {
  return (
    <>
      {/* 봉은사 전각 (좌) */}
      <path d="M40 140 q45 -30 90 0" />
      <line x1="45" y1="140" x2="45" y2="200" />
      <line x1="65" y1="140" x2="65" y2="200" />
      <line x1="105" y1="140" x2="105" y2="200" />
      <line x1="125" y1="140" x2="125" y2="200" />
      <line x1="35" y1="200" x2="135" y2="200" />
      {/* 계단 */}
      <line x1="40" y1="210" x2="130" y2="210" strokeWidth="0.72" />
      {/* 코엑스 유리빌딩 (우) */}
      <rect x="180" y="70" width="70" height="150" />
      {/* 유리 분할 */}
      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <line
          key={i}
          x1="180"
          y1={85 + i * 15}
          x2="250"
          y2={85 + i * 15}
          strokeWidth="0.72"
        />
      ))}
      <line x1="215" y1="70" x2="215" y2="220" strokeWidth="0.72" />
      <Ground />
    </>
  );
}

// 파주축 ────────────────────────────────────────────────

// paju-dmz-peace — 임진각 망배단 + 평화곤돌라 케이블 + 철조망
function IllustPajuDmzPeace(): ReactElement {
  return (
    <>
      {/* 곤돌라 케이블 */}
      <line x1="10" y1="90" x2="280" y2="65" strokeWidth="0.72" />
      {/* 지지 기둥 */}
      <line x1="60" y1="90" x2="60" y2="130" strokeWidth="0.72" />
      <line x1="220" y1="72" x2="220" y2="130" strokeWidth="0.72" />
      {/* 곤돌라 (drift) */}
      <g className="ci-drift" transform="translate(130 82)">
        <rect x="-10" y="0" width="20" height="12" rx="2" strokeWidth="0.72" />
        <line x1="0" y1="0" x2="0" y2="-6" strokeWidth="0.72" />
      </g>
      {/* 망배단 (좌 · 계단식 단상) */}
      <rect x="30" y="180" width="70" height="10" />
      <rect x="40" y="170" width="50" height="10" />
      <rect x="50" y="160" width="30" height="10" />
      <line x1="65" y1="160" x2="65" y2="150" />
      <circle cx="65" cy="145" r="4" strokeWidth="0.72" />
      {/* 철조망 (우) */}
      <line x1="180" y1="200" x2="180" y2="140" strokeWidth="0.72" />
      <line x1="200" y1="200" x2="200" y2="140" strokeWidth="0.72" />
      <line x1="220" y1="200" x2="220" y2="140" strokeWidth="0.72" />
      <line x1="240" y1="200" x2="240" y2="140" strokeWidth="0.72" />
      <line x1="180" y1="150" x2="240" y2="150" strokeWidth="0.72" />
      <line x1="180" y1="170" x2="240" y2="170" strokeWidth="0.72" />
      <line x1="180" y1="190" x2="240" y2="190" strokeWidth="0.72" />
      {/* X 지그재그 (철조망 느낌) */}
      <line x1="180" y1="150" x2="200" y2="170" strokeWidth="0.72" />
      <line x1="200" y1="150" x2="180" y2="170" strokeWidth="0.72" />
      <line x1="200" y1="170" x2="220" y2="190" strokeWidth="0.72" />
      <line x1="220" y1="170" x2="200" y2="190" strokeWidth="0.72" />
      <Ground />
    </>
  );
}

// paju-border-view — 오두산 전망대 + 망원경 + 강
function IllustPajuBorderView(): ReactElement {
  return (
    <>
      {/* 강 물결 (wave) */}
      <g className="ci-wave" strokeWidth="0.72">
        <path d="M20 200 q20 -4 40 0 t40 0 t40 0 t40 0 t40 0 t40 0" />
        <path d="M20 210 q20 -4 40 0 t40 0 t40 0 t40 0 t40 0 t40 0" strokeWidth="0.5" />
      </g>
      {/* 전망대 본체 */}
      <rect x="130" y="90" width="70" height="90" />
      {/* 전망대 창 */}
      <line x1="130" y1="120" x2="200" y2="120" strokeWidth="0.72" />
      <line x1="130" y1="150" x2="200" y2="150" strokeWidth="0.72" />
      <line x1="165" y1="90" x2="165" y2="180" strokeWidth="0.72" />
      {/* 옥상 안테나 */}
      <line x1="165" y1="90" x2="165" y2="70" />
      <circle cx="165" cy="66" r="3" strokeWidth="0.72" />
      {/* 망원경 (좌하) */}
      <g transform="translate(60 175)">
        <line x1="0" y1="0" x2="0" y2="15" />
        <rect x="-4" y="-8" width="18" height="6" strokeWidth="0.72" />
        <line x1="14" y1="-5" x2="20" y2="-3" strokeWidth="0.72" />
      </g>
      <Ground />
    </>
  );
}

// paju-art-cafe — 헤이리 갤러리 각진 건물 + 프로방스 지붕
function IllustPajuArtCafe(): ReactElement {
  return (
    <>
      {/* 갤러리 각진 건물 (좌) */}
      <path d="M30 200 l0 -70 l40 -20 l40 20 l0 70 z" />
      <line x1="70" y1="110" x2="70" y2="200" strokeWidth="0.72" />
      {/* 큰 창 */}
      <rect x="40" y="140" width="20" height="30" strokeWidth="0.72" />
      <rect x="80" y="140" width="20" height="30" strokeWidth="0.72" />
      {/* 프로방스 지붕 (우) */}
      <path d="M140 200 l0 -30 l50 -40 l50 40 l0 30 z" />
      {/* 지붕 기와 힌트 */}
      <line x1="145" y1="165" x2="235" y2="165" strokeWidth="0.72" />
      <line x1="150" y1="155" x2="230" y2="155" strokeWidth="0.72" />
      {/* 문 */}
      <rect x="180" y="170" width="20" height="30" strokeWidth="0.72" />
      {/* 굴뚝 (연기 drift) */}
      <line x1="215" y1="140" x2="215" y2="115" strokeWidth="0.72" />
      <g className="ci-drift" strokeWidth="0.72">
        <path d="M215 112 q4 -6 8 -2 q3 -6 -2 -10" />
      </g>
      <Ground />
    </>
  );
}

// paju-k-book-hangeul — 지혜의숲 서가 계단 + 펼친 책
function IllustPajuKBookHangeul(): ReactElement {
  return (
    <>
      {/* 서가 (계단식 · 3층) */}
      <rect x="30" y="140" width="220" height="20" />
      <rect x="50" y="120" width="200" height="20" />
      <rect x="70" y="100" width="180" height="20" />
      {/* 책 세로줄 */}
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
        <line
          key={`b1-${i}`}
          x1={40 + i * 20}
          y1="140"
          x2={40 + i * 20}
          y2="160"
          strokeWidth="0.72"
        />
      ))}
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
        <line
          key={`b2-${i}`}
          x1={60 + i * 20}
          y1="120"
          x2={60 + i * 20}
          y2="140"
          strokeWidth="0.72"
        />
      ))}
      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <line
          key={`b3-${i}`}
          x1={80 + i * 20}
          y1="100"
          x2={80 + i * 20}
          y2="120"
          strokeWidth="0.72"
        />
      ))}
      {/* 펼친 책 (전경) */}
      <g transform="translate(110 190)">
        <path d="M0 10 q20 -14 40 0 v10 q-20 -14 -40 0 z" />
        <line x1="20" y1="4" x2="20" y2="20" strokeWidth="0.72" />
        <line x1="8" y1="10" x2="16" y2="8" strokeWidth="0.72" />
        <line x1="24" y1="8" x2="32" y2="10" strokeWidth="0.72" />
      </g>
      <Ground />
    </>
  );
}

// paju-lake-bridge — 마장호수 출렁다리 현수선 + 물결
function IllustPajuLakeBridge(): ReactElement {
  return (
    <>
      {/* 지지 기둥 */}
      <line x1="50" y1="180" x2="50" y2="80" />
      <line x1="250" y1="180" x2="250" y2="80" />
      {/* 현수 케이블 */}
      <path d="M50 80 q100 100 200 0" />
      {/* 다리 상판 */}
      <line x1="30" y1="180" x2="270" y2="180" />
      {/* 케이블 걸이 */}
      {[70, 100, 130, 150, 170, 200, 230].map((x) => (
        <line
          key={x}
          x1={x}
          y1="180"
          x2={x}
          y2={80 + Math.abs(x - 150) * Math.abs(x - 150) / 100 + 20}
          strokeWidth="0.72"
        />
      ))}
      {/* 물결 (wave) */}
      <g className="ci-wave" strokeWidth="0.72">
        <path d="M20 205 q20 -4 40 0 t40 0 t40 0 t40 0 t40 0 t40 0" />
        <path d="M20 215 q20 -4 40 0 t40 0 t40 0 t40 0 t40 0 t40 0" strokeWidth="0.5" />
      </g>
      <Ground />
    </>
  );
}

// paju-k-nature — 감악산 능선 + 출렁다리
function IllustPajuKNature(): ReactElement {
  return (
    <>
      {/* 능선 (원경 → 근경 3중) */}
      <path d="M0 180 q60 -80 130 -50 q60 25 170 -20" strokeWidth="0.72" />
      <path d="M0 200 q50 -60 120 -40 q80 20 180 -10" strokeWidth="0.72" />
      <path d="M0 215 q80 -40 150 -20 q80 25 150 -5" />
      {/* 출렁다리 (능선 사이) */}
      <line x1="90" y1="150" x2="200" y2="140" />
      <line x1="90" y1="150" x2="90" y2="130" strokeWidth="0.72" />
      <line x1="200" y1="140" x2="200" y2="120" strokeWidth="0.72" />
      <path d="M90 150 q55 20 110 -10" strokeWidth="0.72" />
      <Ground />
    </>
  );
}

// 경기축 ────────────────────────────────────────────────

// gyeonggi-royal-suwon — 수원화성 화서문·공심돈 + 성벽
function IllustGyeonggiRoyalSuwon(): ReactElement {
  return (
    <>
      {/* 성벽 */}
      <line x1="10" y1="200" x2="290" y2="200" />
      <line x1="10" y1="180" x2="290" y2="180" strokeWidth="0.72" />
      {/* 성벽 요철 */}
      {[20, 50, 80, 220, 250, 280].map((x) => (
        <path key={x} d={`M${x - 6} 180 v-8 h12 v8`} strokeWidth="0.72" />
      ))}
      {/* 화서문 (좌 · 아치) */}
      <path d="M100 180 v-30 q20 -20 40 0 v30" />
      {/* 화서문 상단 지붕 */}
      <path d="M90 150 q30 -20 60 0" />
      <line x1="105" y1="150" x2="105" y2="140" strokeWidth="0.72" />
      <line x1="135" y1="150" x2="135" y2="140" strokeWidth="0.72" />
      {/* 공심돈 (우 · 원형 망루) */}
      <ellipse cx="220" cy="160" rx="24" ry="8" />
      <line x1="196" y1="160" x2="196" y2="180" />
      <line x1="244" y1="160" x2="244" y2="180" />
      <line x1="196" y1="180" x2="244" y2="180" strokeWidth="0.72" />
      {/* 공심돈 총안 (구멍) */}
      <circle cx="210" cy="170" r="2" strokeWidth="0.72" />
      <circle cx="230" cy="170" r="2" strokeWidth="0.72" />
      {/* 공심돈 지붕 */}
      <path d="M196 160 q24 -18 48 0" strokeWidth="0.72" />
      <Ground />
    </>
  );
}

// gyeonggi-korean-garden — 아침고요 정원 아치 + 침엽수
function IllustGyeonggiKoreanGarden(): ReactElement {
  return (
    <>
      {/* 침엽수 (우 · sway) */}
      <g className="ci-sway" transform="translate(230 200)">
        <line x1="0" y1="0" x2="0" y2="-70" />
        <path d="M-15 -20 l15 -15 l15 15 z" strokeWidth="0.72" />
        <path d="M-18 -40 l18 -18 l18 18 z" strokeWidth="0.72" />
        <path d="M-15 -55 l15 -15 l15 15 z" strokeWidth="0.72" />
      </g>
      {/* 침엽수 (좌 작음) */}
      <g transform="translate(50 200)">
        <line x1="0" y1="0" x2="0" y2="-45" strokeWidth="0.72" />
        <path d="M-10 -15 l10 -10 l10 10 z" strokeWidth="0.72" />
        <path d="M-12 -28 l12 -12 l12 12 z" strokeWidth="0.72" />
      </g>
      {/* 정원 아치 (중앙) */}
      <path d="M110 200 q0 -60 40 -60 q40 0 40 60" />
      {/* 아치 격자 */}
      <line x1="110" y1="170" x2="190" y2="170" strokeWidth="0.72" />
      <line x1="122" y1="145" x2="178" y2="145" strokeWidth="0.72" />
      <line x1="150" y1="140" x2="150" y2="200" strokeWidth="0.72" />
      {/* 아치 아래 잔디 */}
      <path d="M115 200 q35 8 70 0" strokeWidth="0.72" />
      <Ground />
    </>
  );
}

// gyeonggi-living-korea — 민속촌 초가 + 물레방아
function IllustGyeonggiLivingKorea(): ReactElement {
  return (
    <>
      {/* 초가 (좌) */}
      <path d="M40 160 q40 -35 80 0 z" />
      <line x1="60" y1="152" x2="100" y2="152" strokeWidth="0.72" />
      <line x1="55" y1="145" x2="105" y2="145" strokeWidth="0.72" />
      <rect x="60" y="160" width="40" height="40" />
      <rect x="72" y="175" width="16" height="25" strokeWidth="0.72" />
      {/* 물레방아 (우 · spin) */}
      <g transform="translate(220 165)">
        <g className="ci-spin">
          <circle cx="0" cy="0" r="30" />
          <line x1="-30" y1="0" x2="30" y2="0" strokeWidth="0.72" />
          <line x1="0" y1="-30" x2="0" y2="30" strokeWidth="0.72" />
          <line x1="-21" y1="-21" x2="21" y2="21" strokeWidth="0.72" />
          <line x1="-21" y1="21" x2="21" y2="-21" strokeWidth="0.72" />
        </g>
        {/* 축 */}
        <circle cx="0" cy="0" r="3" strokeWidth="0.72" />
      </g>
      {/* 물길 */}
      <line x1="180" y1="200" x2="270" y2="200" strokeWidth="0.72" />
      <path d="M180 210 q15 -3 30 0 t30 0 t30 0" strokeWidth="0.5" />
      <Ground />
    </>
  );
}

// gyeonggi-nami-island — 남이섬 메타세쿼이아 길 + 나룻배
function IllustGyeonggiNamiIsland(): ReactElement {
  return (
    <>
      {/* 메타세쿼이아 (원근 3그루씩 양쪽) */}
      {[
        [50, -60],
        [90, -50],
        [130, -42],
      ].map(([x, h], i) => (
        <g key={`L${i}`} transform={`translate(${x} 180)`}>
          <line x1="0" y1="0" x2="0" y2={h} strokeWidth="0.72" />
          <path d={`M-8 ${h + 5} l8 -12 l8 12 z`} strokeWidth="0.72" />
          <path d={`M-10 ${h + 20} l10 -14 l10 14 z`} strokeWidth="0.72" />
        </g>
      ))}
      {[
        [250, -60],
        [210, -50],
        [170, -42],
      ].map(([x, h], i) => (
        <g key={`R${i}`} transform={`translate(${x} 180)`}>
          <line x1="0" y1="0" x2="0" y2={h} strokeWidth="0.72" />
          <path d={`M-8 ${h + 5} l8 -12 l8 12 z`} strokeWidth="0.72" />
          <path d={`M-10 ${h + 20} l10 -14 l10 14 z`} strokeWidth="0.72" />
        </g>
      ))}
      {/* 길 (원근) */}
      <line x1="140" y1="180" x2="130" y2="215" strokeWidth="0.72" />
      <line x1="160" y1="180" x2="170" y2="215" strokeWidth="0.72" />
      {/* 나룻배 (하단 · wave) */}
      <g className="ci-wave" transform="translate(150 218)">
        <path d="M-24 0 q24 12 48 0 l-6 -6 h-36 z" />
        <line x1="0" y1="-6" x2="0" y2="-14" strokeWidth="0.72" />
      </g>
      <Ground />
    </>
  );
}

// gyeonggi-everland — 대관람차 + 회전목마 (회전 애니)
function IllustGyeonggiEverland(): ReactElement {
  return (
    <>
      {/* 대관람차 (좌 · spin) */}
      <g transform="translate(80 130)">
        <g className="ci-spin">
          <circle cx="0" cy="0" r="60" />
          {/* 8 스포크 */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
            const rad = (deg * Math.PI) / 180;
            return (
              <g key={deg}>
                <line
                  x1="0"
                  y1="0"
                  x2={Math.cos(rad) * 60}
                  y2={Math.sin(rad) * 60}
                  strokeWidth="0.72"
                />
                {/* 캐빈 */}
                <rect
                  x={Math.cos(rad) * 60 - 4}
                  y={Math.sin(rad) * 60 - 4}
                  width="8"
                  height="8"
                  rx="1.5"
                  strokeWidth="0.72"
                />
              </g>
            );
          })}
        </g>
        {/* 지지대 */}
        <line x1="0" y1="0" x2="-30" y2="70" strokeWidth="0.72" />
        <line x1="0" y1="0" x2="30" y2="70" strokeWidth="0.72" />
      </g>
      {/* 회전목마 (우 · spin) */}
      <g transform="translate(230 165)">
        {/* 지붕 */}
        <path d="M-30 -20 q30 -25 60 0 z" />
        <line x1="0" y1="-35" x2="0" y2="-45" strokeWidth="0.72" />
        <path d="M-2 -45 h6 v-4 h-6 z" strokeWidth="0.72" />
        {/* 회전축 (spin) */}
        <g className="ci-spin">
          <ellipse cx="0" cy="0" rx="30" ry="8" />
          {/* 폴 */}
          <line x1="-20" y1="-2" x2="-20" y2="14" strokeWidth="0.72" />
          <line x1="0" y1="-4" x2="0" y2="14" strokeWidth="0.72" />
          <line x1="20" y1="-2" x2="20" y2="14" strokeWidth="0.72" />
        </g>
        {/* 바닥 */}
        <ellipse cx="0" cy="18" rx="34" ry="6" strokeWidth="0.72" />
      </g>
      <Ground />
    </>
  );
}

// ─── 매핑 ─────────────────────────────────────────────────────────
const REGISTRY: Record<string, () => ReactElement> = {
  "seoul-royal": IllustSeoulRoyal,
  "seoul-night": IllustSeoulNight,
  "seoul-k-youth": IllustSeoulKYouth,
  "seoul-food-design": IllustSeoulFoodDesign,
  "seoul-hip": IllustSeoulHip,
  "seoul-modern": IllustSeoulModern,
  "paju-dmz-peace": IllustPajuDmzPeace,
  "paju-border-view": IllustPajuBorderView,
  "paju-art-cafe": IllustPajuArtCafe,
  "paju-k-book-hangeul": IllustPajuKBookHangeul,
  "paju-lake-bridge": IllustPajuLakeBridge,
  "paju-k-nature": IllustPajuKNature,
  "gyeonggi-royal-suwon": IllustGyeonggiRoyalSuwon,
  "gyeonggi-korean-garden": IllustGyeonggiKoreanGarden,
  "gyeonggi-living-korea": IllustGyeonggiLivingKorea,
  "gyeonggi-nami-island": IllustGyeonggiNamiIsland,
  "gyeonggi-everland": IllustGyeonggiEverland,
};

export default function CourseIllustration({ courseId, className, title }: Props) {
  const Draw = REGISTRY[courseId];
  if (!Draw) return null;
  return (
    <svg {...SVG_PROPS} role="img" aria-label={title ?? "course illustration"} className={className}>
      <style>{ANIM_STYLE}</style>
      <Draw />
    </svg>
  );
}
