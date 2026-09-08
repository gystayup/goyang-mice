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

// D11: 애니메이션은 SVG SMIL 로 표현.
//   · SVG 내부 <style> + @keyframes 는 브라우저마다 문서-level 로 승격되지 않아
//     Safari · 일부 Chromium 에서 미동작. SMIL 은 SVG DOM 이 직접 평가하므로
//     빌드/스타일 승격과 무관하게 확실히 동작.
//   · 모든 헬퍼는 additive="sum" — 기존 부모 transform 위에 얹힘 (좌표계 유지).
//   · prefers-reduced-motion 은 SMIL 에서는 사용자 에이전트가 처리하지 않으므로,
//     동일한 접근성을 원하면 별도 처리 필요. 본 릴리스는 우선 실동작 확보.

const Drift = ({ dx = 6, dur = 5 }: { dx?: number; dur?: number }) => (
  <animateTransform
    attributeName="transform"
    type="translate"
    additive="sum"
    values={`0 0; ${dx} 0; 0 0`}
    dur={`${dur}s`}
    repeatCount="indefinite"
  />
);

const Fly = ({ dur = 9 }: { dur?: number }) => (
  <animateTransform
    attributeName="transform"
    type="translate"
    additive="sum"
    values="-8 0; 12 0; -8 0"
    dur={`${dur}s`}
    repeatCount="indefinite"
  />
);

const Blink = () => (
  <animate
    attributeName="opacity"
    values="1;1;0.25;1;1"
    keyTimes="0;0.29;0.35;0.6;1"
    dur="2.4s"
    repeatCount="indefinite"
  />
);

const Wave = () => (
  <animateTransform
    attributeName="transform"
    type="translate"
    additive="sum"
    values="0 0; 0 -1.5; 0 0"
    dur="3.5s"
    repeatCount="indefinite"
  />
);

const Spin = ({ cx = 0, cy = 0, dur = 12 }: { cx?: number; cy?: number; dur?: number }) => (
  <animateTransform
    attributeName="transform"
    type="rotate"
    additive="sum"
    values={`0 ${cx} ${cy}; 360 ${cx} ${cy}`}
    dur={`${dur}s`}
    repeatCount="indefinite"
  />
);

const Sway = ({ cx = 0, cy = 0, dur = 4 }: { cx?: number; cy?: number; dur?: number }) => (
  <animateTransform
    attributeName="transform"
    type="rotate"
    additive="sum"
    values={`-3 ${cx} ${cy}; 3 ${cx} ${cy}; -3 ${cx} ${cy}`}
    dur={`${dur}s`}
    repeatCount="indefinite"
  />
);

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
      <g strokeWidth="0.72">
        <Drift dx={8} dur={5} />
        <path d="M20 42 q8 -10 20 -6 q4 -12 18 -6 q12 -3 14 7 q4 8 -4 10 z" />
      </g>
      {/* 구름 B (중앙 상단, drift · 위상 다르게 dur 7s) */}
      <g strokeWidth="0.72" transform="translate(120 -6)">
        <Drift dx={6} dur={7} />
        <path d="M40 52 q6 -8 16 -4 q4 -10 14 -4 q10 -2 12 6 q4 6 -4 8 z" />
      </g>
      {/* 새 (fly, 우 상단) — 두 마리 실루엣 (몸통 + 뒤쪽) */}
      <g strokeWidth="0.72" transform="translate(200 40)">
        <Fly />
        <path d="M0 4 q4 -6 8 0 q4 -6 8 0" />
        <path d="M18 12 q3 -5 6 0 q3 -5 6 0" strokeWidth="0.6" />
      </g>

      {/* 깃대 + 깃발 (좌 · sway — 회전축 = 깃대 상단 30,82) */}
      <line x1="30" y1="200" x2="30" y2="80" strokeWidth="0.72" />
      <g>
        <Sway cx={30} cy={82} dur={4} />
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

// seoul-night — 남산 능선 + N서울타워(전망대 3층·안테나·기단) + 케이블카 + 자물쇠 담장 + 별 (D14)
function IllustSeoulNight(): ReactElement {
  return (
    <>
      {/* 별 (밤하늘 · blink) */}
      {[[40, 30, 1.3], [80, 18, 1], [120, 35, 1.2], [260, 25, 1.4], [275, 55, 1]].map(
        ([cx, cy, r], i) => (
          <circle key={i} cx={cx} cy={cy} r={r} strokeWidth="0.5">
            <Blink />
          </circle>
        )
      )}

      {/* 남산 능선 (원경 2중) */}
      <path
        d="M0 195 q40 -35 80 -30 q30 3 60 -18 q40 -8 70 12 q30 20 90 24"
        strokeWidth="0.72"
      />
      <path d="M0 210 q60 -18 130 -12 q80 8 170 5" strokeWidth="0.72" />

      {/* 케이블카 지주 (좌) */}
      <line x1="35" y1="140" x2="35" y2="180" strokeWidth="0.72" />
      <path d="M30 180 l5 -3 l5 3" strokeWidth="0.72" />
      {/* 케이블 (좌 → 타워 전망대) */}
      <line x1="35" y1="140" x2="200" y2="105" strokeWidth="0.72" />

      {/* 캐빈 (drift · 케이블 방향 이동) */}
      <g transform="translate(90 122)">
        <Drift dx={30} dur={9} />
        <line x1="0" y1="-8" x2="0" y2="-2" strokeWidth="0.4" />
        <path d="M-2 -8 h4" strokeWidth="0.4" />
        <rect x="-10" y="-2" width="20" height="10" rx="2" strokeWidth="0.72" />
        {/* 캐빈 창 */}
        <line x1="-6" y1="1" x2="-6" y2="5" strokeWidth="0.4" />
        <line x1="0" y1="1" x2="0" y2="5" strokeWidth="0.4" />
        <line x1="6" y1="1" x2="6" y2="5" strokeWidth="0.4" />
      </g>

      {/* N서울타워 기단 (사다리꼴 · 다층) */}
      <path d="M190 200 l3 -10 h14 l3 10 z" strokeWidth="0.72" />
      <line x1="185" y1="200" x2="215" y2="200" />
      <line x1="188" y1="196" x2="212" y2="196" strokeWidth="0.5" />
      {/* 타워 본체 (좌우 수직) */}
      <line x1="197" y1="190" x2="199" y2="115" />
      <line x1="203" y1="190" x2="201" y2="115" />

      {/* 전망대 (원기둥 3층) */}
      <ellipse cx="200" cy="115" rx="14" ry="4" strokeWidth="0.72" />
      <line x1="186" y1="115" x2="186" y2="80" strokeWidth="0.72" />
      <line x1="214" y1="115" x2="214" y2="80" strokeWidth="0.72" />
      <ellipse cx="200" cy="80" rx="14" ry="4" strokeWidth="0.72" />
      {/* 3층 링 */}
      <ellipse cx="200" cy="88" rx="14" ry="3" strokeWidth="0.5" />
      <ellipse cx="200" cy="97" rx="14" ry="3" strokeWidth="0.5" />
      <ellipse cx="200" cy="106" rx="14" ry="3" strokeWidth="0.5" />
      {/* 캐빈 조명 (blink · 반복) */}
      {[186, 191, 196, 200, 204, 209, 214].map((x) => (
        <circle key={x} cx={x} cy="93" r="0.9" strokeWidth="0.4">
          <Blink />
        </circle>
      ))}
      {/* 전망대 지붕 */}
      <path d="M186 80 q14 -8 28 0" strokeWidth="0.72" />

      {/* 안테나 첨탑 (여러 단) */}
      <line x1="200" y1="80" x2="200" y2="45" />
      <line x1="197" y1="72" x2="203" y2="72" strokeWidth="0.5" />
      <line x1="198" y1="60" x2="202" y2="60" strokeWidth="0.5" />
      {/* 첨탑 상단 조명 (blink) */}
      <circle cx="200" cy="42" r="2" strokeWidth="0.72">
        <Blink />
      </circle>

      {/* 자물쇠 담장 (전망대 앞 · 하트 반복) */}
      <line x1="140" y1="215" x2="180" y2="215" strokeWidth="0.72" />
      {[143, 149, 155, 161, 167, 173, 179].map((x) => (
        <g key={x} transform={`translate(${x} 210)`}>
          <path d="M0 0 q-2 -2 0 -3 q2 1 0 3 z" strokeWidth="0.4" />
          <line x1="0" y1="0" x2="0" y2="3" strokeWidth="0.4" />
        </g>
      ))}

      <Ground />
    </>
  );
}

// seoul-k-youth — 경의선숲길 철길·침목 + 가로수 3그루 + 벤치 + 연남동 상점 파사드 (D14)
function IllustSeoulKYouth(): ReactElement {
  return (
    <>
      {/* 연남동 상점 파사드 (우 · 낮은 건물) */}
      <rect x="170" y="120" width="120" height="90" />
      <line x1="165" y1="120" x2="295" y2="120" strokeWidth="0.72" />
      {/* 간판 */}
      <rect x="185" y="128" width="60" height="12" strokeWidth="0.72" />
      <line x1="195" y1="134" x2="200" y2="134" strokeWidth="0.4" />
      <line x1="205" y1="134" x2="215" y2="134" strokeWidth="0.4" />
      <line x1="220" y1="134" x2="235" y2="134" strokeWidth="0.4" />
      {/* 차양 (줄무늬) */}
      <path d="M170 148 l25 6 l25 -6 l25 6 l25 -6 l20 6" strokeWidth="0.72" />
      {[178, 195, 212, 228, 245, 262, 278].map((x) => (
        <line key={x} x1={x} y1="148" x2={x + 4} y2="154" strokeWidth="0.4" />
      ))}
      {/* 창 (2개) + 문 + 창3 */}
      <rect x="180" y="160" width="34" height="30" strokeWidth="0.72" />
      <line x1="197" y1="160" x2="197" y2="190" strokeWidth="0.4" />
      <line x1="180" y1="175" x2="214" y2="175" strokeWidth="0.4" />
      <rect x="230" y="160" width="20" height="50" strokeWidth="0.72" />
      <path d="M230 160 q10 -6 20 0" strokeWidth="0.5" />
      <circle cx="246" cy="185" r="0.7" strokeWidth="0.4" />
      <rect x="260" y="160" width="28" height="30" strokeWidth="0.72" />
      <line x1="274" y1="160" x2="274" y2="190" strokeWidth="0.4" />
      <line x1="260" y1="175" x2="288" y2="175" strokeWidth="0.4" />
      {/* 화분 */}
      <path d="M256 210 v-8 h4 v8" strokeWidth="0.5" />
      <circle cx="258" cy="200" r="3" strokeWidth="0.5" />

      {/* 가로수 3그루 (원근 · sway) */}
      <g transform="translate(30 200)">
        <Sway cx={0} cy={0} dur={5} />
        <line x1="0" y1="0" x2="0" y2="-42" strokeWidth="0.72" />
        <circle cx="0" cy="-48" r="12" strokeWidth="0.72" />
        <path d="M-10 -55 q10 -4 20 0" strokeWidth="0.4" />
        <path d="M-8 -45 q8 -3 16 0" strokeWidth="0.4" />
      </g>
      <g transform="translate(80 210)">
        <Sway cx={0} cy={0} dur={4} />
        <line x1="0" y1="0" x2="0" y2="-55" />
        <circle cx="-6" cy="-60" r="12" strokeWidth="0.72" />
        <circle cx="6" cy="-65" r="14" strokeWidth="0.72" />
        <circle cx="0" cy="-74" r="10" strokeWidth="0.72" />
        <path d="M-14 -60 q14 -6 28 0" strokeWidth="0.4" />
      </g>
      <g transform="translate(140 218)">
        <Sway cx={0} cy={0} dur={4.5} />
        <line x1="0" y1="0" x2="0" y2="-70" />
        <circle cx="-10" cy="-72" r="16" strokeWidth="0.72" />
        <circle cx="10" cy="-78" r="18" strokeWidth="0.72" />
        <circle cx="0" cy="-92" r="14" strokeWidth="0.72" />
        <path d="M-18 -72 q18 -8 36 0" strokeWidth="0.4" />
      </g>

      {/* 철길 (원근 · 소실점 향해) */}
      <line x1="10" y1="220" x2="120" y2="120" strokeWidth="0.72" />
      <line x1="160" y1="220" x2="140" y2="120" strokeWidth="0.72" />
      {/* 침목 반복 */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const y = 220 - i * 12;
        const cx = 100 - i * 3;
        const w = 100 - i * 12;
        return (
          <line
            key={i}
            x1={cx - w / 2}
            y1={y}
            x2={cx + w / 2}
            y2={y}
            strokeWidth="0.72"
          />
        );
      })}

      {/* 벤치 (좌하 · 상세) */}
      <line x1="18" y1="210" x2="60" y2="210" />
      <line x1="20" y1="210" x2="20" y2="218" strokeWidth="0.72" />
      <line x1="58" y1="210" x2="58" y2="218" strokeWidth="0.72" />
      <line x1="18" y1="207" x2="60" y2="207" strokeWidth="0.4" />
      <line x1="18" y1="213" x2="60" y2="213" strokeWidth="0.4" />

      <Ground />
    </>
  );
}

// seoul-food-design — DDP 곡면 외벽(유선형 다중 곡선·패널 분할) + 광장시장 천막·전구줄 blink (D14)
function IllustSeoulFoodDesign(): ReactElement {
  return (
    <>
      {/* DDP 곡면 (좌 · 유선형 실루엣) */}
      <path
        d="M15 210 q10 -70 55 -105 q40 -25 80 -18 q40 8 40 55 q0 40 -60 55 q-70 20 -115 13 z"
      />
      {/* DDP 패널 분할 (수평 다중 곡선) */}
      <path d="M22 155 q45 -55 100 -50 q40 4 40 30" strokeWidth="0.72" />
      <path d="M25 170 q45 -45 100 -40 q40 4 55 20" strokeWidth="0.72" />
      <path d="M25 185 q45 -35 100 -30 q50 3 65 8" strokeWidth="0.72" />
      <path d="M25 198 q45 -25 100 -20 q60 3 75 3" strokeWidth="0.72" />
      {/* 세로 슬릿 창 */}
      <line x1="60" y1="160" x2="62" y2="175" strokeWidth="0.5" />
      <line x1="80" y1="145" x2="82" y2="180" strokeWidth="0.5" />
      <line x1="100" y1="135" x2="102" y2="185" strokeWidth="0.5" />
      <line x1="125" y1="128" x2="127" y2="190" strokeWidth="0.5" />

      {/* 광장시장 노점 지지 기둥 (3개) */}
      <line x1="185" y1="210" x2="185" y2="145" strokeWidth="0.72" />
      <line x1="230" y1="210" x2="230" y2="130" strokeWidth="0.72" />
      <line x1="275" y1="210" x2="275" y2="145" strokeWidth="0.72" />
      {/* 천막 (2겹) */}
      <path d="M180 155 q30 -18 60 0" strokeWidth="0.72" />
      <line x1="180" y1="155" x2="240" y2="155" strokeWidth="0.72" />
      <path d="M220 140 q30 -18 60 0" strokeWidth="0.72" />
      <line x1="220" y1="140" x2="280" y2="140" strokeWidth="0.72" />
      {/* 술 장식 (프릴) */}
      {[188, 196, 204, 212, 220, 228, 236].map((x) => (
        <line key={`fL${x}`} x1={x} y1="155" x2={x} y2="160" strokeWidth="0.4" />
      ))}
      {[228, 236, 244, 252, 260, 268, 276].map((x) => (
        <line key={`fR${x}`} x1={x} y1="140" x2={x} y2="145" strokeWidth="0.4" />
      ))}

      {/* 전구줄 (U자 매달림) + 전구 blink */}
      <path d="M185 145 q45 30 90 -15" strokeWidth="0.4" />
      {[[205, 158], [220, 162], [235, 163], [250, 158], [265, 149]].map(([cx, cy], i) => (
        <g key={i}>
          <line x1={cx} y1={cy - 5} x2={cx} y2={cy - 2} strokeWidth="0.4" />
          <circle cx={cx} cy={cy} r="1.8" strokeWidth="0.5">
            <Blink />
          </circle>
        </g>
      ))}

      {/* 좌판 상판 · 다리 */}
      <line x1="180" y1="200" x2="285" y2="200" strokeWidth="0.72" />
      <line x1="200" y1="200" x2="200" y2="215" strokeWidth="0.5" />
      <line x1="260" y1="200" x2="260" y2="215" strokeWidth="0.5" />
      {/* 그릇/음식 힌트 */}
      <ellipse cx="210" cy="195" rx="6" ry="2.5" strokeWidth="0.5" />
      <ellipse cx="235" cy="195" rx="7" ry="2.5" strokeWidth="0.5" />
      <ellipse cx="265" cy="195" rx="6" ry="2.5" strokeWidth="0.5" />
      <path d="M210 195 q0 -3 3 -3" strokeWidth="0.3" />
      <path d="M235 195 q0 -4 4 -4" strokeWidth="0.3" />

      <Ground />
    </>
  );
}

// seoul-hip — 성수동 붉은벽돌 공장(벽돌 패턴·아치창·굴뚝) + 서울숲 나무 · 연기 drift (D14)
function IllustSeoulHip(): ReactElement {
  return (
    <>
      {/* 서울숲 나무 2그루 (좌 · sway) */}
      <g transform="translate(30 218)">
        <Sway cx={0} cy={0} dur={4} />
        <line x1="0" y1="0" x2="0" y2="-60" />
        <circle cx="-8" cy="-62" r="14" strokeWidth="0.72" />
        <circle cx="8" cy="-68" r="16" strokeWidth="0.72" />
        <circle cx="0" cy="-80" r="12" strokeWidth="0.72" />
        <path d="M-16 -60 q16 -8 32 0" strokeWidth="0.4" />
      </g>
      <g transform="translate(75 220)">
        <Sway cx={0} cy={0} dur={5} />
        <line x1="0" y1="0" x2="0" y2="-45" strokeWidth="0.72" />
        <circle cx="-6" cy="-48" r="10" strokeWidth="0.72" />
        <circle cx="6" cy="-52" r="11" strokeWidth="0.72" />
      </g>

      {/* 공장 건물 (우 · 붉은벽돌 파사드) */}
      <rect x="110" y="130" width="180" height="90" />
      {/* 벽돌 패턴 (수평 여러 줄) */}
      {[142, 154, 166, 178, 190, 202, 214].map((y) => (
        <line key={`h${y}`} x1="110" y1={y} x2="290" y2={y} strokeWidth="0.4" />
      ))}
      {/* 벽돌 세로 (엇갈림 3층) */}
      {[130, 160, 190, 220, 250, 280].map((x) => (
        <line key={`v${x}`} x1={x} y1="130" x2={x} y2="142" strokeWidth="0.3" />
      ))}
      {[122, 142, 172, 202, 232, 262, 288].map((x) => (
        <line key={`v2${x}`} x1={x} y1="142" x2={x} y2="154" strokeWidth="0.3" />
      ))}
      {[130, 160, 190, 220, 250, 280].map((x) => (
        <line key={`v3${x}`} x1={x} y1="154" x2={x} y2="166" strokeWidth="0.3" />
      ))}
      {[122, 142, 172, 202, 232, 262, 288].map((x) => (
        <line key={`v4${x}`} x1={x} y1="166" x2={x} y2="178" strokeWidth="0.3" />
      ))}

      {/* 아치창 3개 */}
      {[135, 190, 245].map((cx) => (
        <g key={cx}>
          <path d={`M${cx - 15} 210 v-30 q15 -18 30 0 v30 z`} strokeWidth="0.72" />
          <line x1={cx} y1="180" x2={cx} y2="210" strokeWidth="0.4" />
          <line x1={cx - 15} y1="195" x2={cx + 15} y2="195" strokeWidth="0.4" />
        </g>
      ))}
      {/* 지붕선 */}
      <line x1="105" y1="130" x2="295" y2="130" strokeWidth="0.72" />

      {/* 굴뚝 */}
      <line x1="255" y1="130" x2="255" y2="55" />
      <line x1="270" y1="130" x2="270" y2="55" />
      <line x1="255" y1="55" x2="270" y2="55" />
      <path d="M253 55 h19 v-4 h-19 z" strokeWidth="0.72" />

      {/* 굴뚝 연기 (drift · 상승 3덩이) */}
      <g strokeWidth="0.5">
        <Drift dx={6} dur={4} />
        <path d="M262 50 q-6 -6 -2 -12 q6 -4 2 -12" />
        <circle cx="260" cy="40" r="2" strokeWidth="0.4" />
        <circle cx="266" cy="28" r="1.5" strokeWidth="0.4" />
        <circle cx="262" cy="18" r="1.2" strokeWidth="0.4" />
      </g>

      <Ground />
    </>
  );
}

// seoul-modern — 봉은사 팔작지붕 전각(기둥·계단·잡상) + 코엑스 유리빌딩 대비 · 구름 drift (D14)
function IllustSeoulModern(): ReactElement {
  return (
    <>
      {/* 구름 (drift · 상단 2개) */}
      <g strokeWidth="0.72">
        <Drift dx={8} dur={6} />
        <path d="M50 45 q8 -10 20 -6 q4 -12 18 -6 q12 -3 14 7 q4 8 -4 10 z" />
      </g>
      <g strokeWidth="0.72" transform="translate(130 -8)">
        <Drift dx={6} dur={8} />
        <path d="M40 55 q6 -8 16 -4 q4 -10 14 -4 q10 -2 12 6 q4 6 -4 8 z" />
      </g>

      {/* 코엑스 유리빌딩 (우 · 세로 고층) */}
      <line x1="185" y1="220" x2="185" y2="60" />
      <line x1="270" y1="220" x2="270" y2="60" />
      <line x1="185" y1="60" x2="270" y2="60" />
      {/* 옥상 안테나 */}
      <line x1="227" y1="60" x2="227" y2="45" strokeWidth="0.72" />
      <circle cx="227" cy="43" r="1.2" strokeWidth="0.5" />
      {/* 유리 층 분할 (다층) */}
      {[75, 90, 105, 120, 135, 150, 165, 180, 195, 210].map((y) => (
        <line key={y} x1="185" y1={y} x2="270" y2={y} strokeWidth="0.4" />
      ))}
      {/* 세로 3분할 */}
      <line x1="213" y1="60" x2="213" y2="220" strokeWidth="0.4" />
      <line x1="241" y1="60" x2="241" y2="220" strokeWidth="0.4" />
      {/* 회전문 (하단) */}
      <path d="M220 220 v-14 h14 v14" strokeWidth="0.5" />
      <path d="M227 220 v-14" strokeWidth="0.4" />

      {/* 봉은사 전각 (좌 · 팔작지붕) */}
      {/* 지붕 겹처마 (2겹) + 용마루 */}
      <line x1="46" y1="128" x2="124" y2="128" strokeWidth="0.72" />
      <path d="M40 128 q45 -22 90 0" strokeWidth="1.15" />
      <path d="M36 140 q49 -22 98 0" strokeWidth="0.72" />
      {/* 처마 상승 */}
      <path d="M36 140 q-4 -4 -6 -10" strokeWidth="0.4" />
      <path d="M134 140 q4 -4 6 -10" strokeWidth="0.4" />
      {/* 잡상 (좌우) */}
      {[46, 51, 56].map((x) => (
        <path key={`jl${x}`} d={`M${x} 140 l1.2 -3 l1.2 3`} strokeWidth="0.4" />
      ))}
      {[118, 123, 128].map((x) => (
        <path key={`jr${x}`} d={`M${x} 140 l1.2 -3 l1.2 3`} strokeWidth="0.4" />
      ))}
      {/* 본체 창방 (2줄) */}
      <line x1="46" y1="150" x2="124" y2="150" strokeWidth="0.72" />
      <line x1="46" y1="158" x2="124" y2="158" strokeWidth="0.72" />
      {/* 공포 세로선 */}
      {[50, 60, 70, 80, 90, 100, 110, 120].map((x) => (
        <line key={`g${x}`} x1={x} y1="150" x2={x} y2="158" strokeWidth="0.4" />
      ))}
      {/* 기둥 5개 */}
      {[50, 70, 85, 100, 120].map((x) => (
        <line key={`c${x}`} x1={x} y1="158" x2={x} y2="200" strokeWidth="0.72" />
      ))}
      {/* 어칸 문 (중앙) */}
      <rect x="80" y="165" width="15" height="35" strokeWidth="0.72" />
      <line x1="87" y1="165" x2="87" y2="200" strokeWidth="0.4" />
      <line x1="80" y1="180" x2="95" y2="180" strokeWidth="0.4" />
      <line x1="80" y1="190" x2="95" y2="190" strokeWidth="0.4" />
      {/* 협칸 창 */}
      <rect x="55" y="170" width="10" height="20" strokeWidth="0.4" />
      <rect x="105" y="170" width="10" height="20" strokeWidth="0.4" />
      {/* 기단 · 계단 */}
      <line x1="42" y1="200" x2="128" y2="200" />
      <line x1="42" y1="207" x2="128" y2="207" strokeWidth="0.72" />
      <path d="M78 215 l6 -8 h8 l6 8" strokeWidth="0.5" />

      <Ground />
    </>
  );
}

// 파주축 ────────────────────────────────────────────────

// paju-dmz-peace — 임진각 망배단(계단·향로) + 평화곤돌라(지주·케이블·캐빈 drift) + 철조망 가시 (D14)
function IllustPajuDmzPeace(): ReactElement {
  return (
    <>
      {/* 원경 능선 */}
      <path
        d="M0 175 q40 -25 90 -8 q60 -18 110 -3 q60 -22 100 3"
        strokeWidth="0.4"
      />

      {/* 곤돌라 지주 (좌 · 우 · A자 밑둥) */}
      <line x1="40" y1="120" x2="40" y2="200" strokeWidth="0.72" />
      <line x1="35" y1="120" x2="45" y2="120" strokeWidth="0.72" />
      <path d="M38 200 l2 -4 l2 4" strokeWidth="0.5" />
      <line x1="260" y1="80" x2="260" y2="200" strokeWidth="0.72" />
      <line x1="255" y1="80" x2="265" y2="80" strokeWidth="0.72" />
      <path d="M258 200 l2 -4 l2 4" strokeWidth="0.5" />

      {/* 케이블 (좌 → 우 경사) */}
      <line x1="40" y1="120" x2="260" y2="80" strokeWidth="0.5" />

      {/* 곤돌라 캐빈 (drift · 상세) */}
      <g transform="translate(120 105)">
        <Drift dx={30} dur={9} />
        <line x1="0" y1="-8" x2="0" y2="0" strokeWidth="0.4" />
        <path d="M-2 -8 h4" strokeWidth="0.4" />
        <rect x="-14" y="0" width="28" height="16" rx="4" strokeWidth="0.72" />
        <rect x="-11" y="3" width="7" height="6" strokeWidth="0.4" />
        <rect x="-3.5" y="3" width="7" height="6" strokeWidth="0.4" />
        <rect x="4" y="3" width="7" height="6" strokeWidth="0.4" />
      </g>

      {/* 망배단 (좌하 · 계단식 3층 + 향로) */}
      <rect x="80" y="200" width="80" height="12" />
      <rect x="90" y="190" width="60" height="10" strokeWidth="0.72" />
      <rect x="100" y="180" width="40" height="10" strokeWidth="0.72" />
      <line x1="120" y1="180" x2="120" y2="165" />
      {/* 향로 (지붕 모양) */}
      <ellipse cx="120" cy="163" rx="6" ry="2" strokeWidth="0.5" />
      <path d="M114 163 q6 -8 12 0" strokeWidth="0.4" />
      {/* 연기 */}
      <path d="M117 155 q-2 -3 0 -6" strokeWidth="0.3" />
      <path d="M120 155 v-8" strokeWidth="0.3" />
      <path d="M123 155 q2 -3 0 -6" strokeWidth="0.3" />
      {/* 계단 (중앙) */}
      <path d="M108 200 h24 l3 -5 h-30 z" strokeWidth="0.4" />

      {/* 철조망 (우하 · 상세) */}
      {/* 기둥 5개 */}
      {[180, 205, 230, 255, 280].map((x) => (
        <line key={x} x1={x} y1="220" x2={x} y2="155" strokeWidth="0.5" />
      ))}
      {/* 상단 가시 (V자) */}
      {[184, 192, 200, 208, 216, 224, 232, 240, 248, 256, 264, 272].map((x) => (
        <path key={x} d={`M${x} 155 l2 -4 l2 4`} strokeWidth="0.3" />
      ))}
      {/* 가로 3줄 */}
      {[165, 185, 205].map((y) => (
        <line key={y} x1="180" y1={y} x2="280" y2={y} strokeWidth="0.4" />
      ))}
      {/* X 지그재그 (그물 느낌) */}
      {[180, 205, 230, 255].map((x) => (
        <g key={`x${x}`}>
          <line x1={x} y1="165" x2={x + 25} y2="185" strokeWidth="0.3" />
          <line x1={x + 25} y1="165" x2={x} y2="185" strokeWidth="0.3" />
          <line x1={x} y1="185" x2={x + 25} y2="205" strokeWidth="0.3" />
          <line x1={x + 25} y1="185" x2={x} y2="205" strokeWidth="0.3" />
        </g>
      ))}

      <Ground />
    </>
  );
}

// paju-border-view — 오두산 원통 전망대(3층·전망창·돔지붕) + 망원경(삼각대·렌즈) + 강 수면 wave (D14)
function IllustPajuBorderView(): ReactElement {
  return (
    <>
      {/* 원경 능선 */}
      <path
        d="M0 170 q60 -25 110 -18 q60 8 110 -8 q40 -10 80 8"
        strokeWidth="0.4"
      />

      {/* 강 수면 (하단 wave · 3중) */}
      <g strokeWidth="0.5">
        <Wave />
        <path d="M0 200 q15 -3 30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0" />
        <path
          d="M0 210 q15 -3 30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0"
          strokeWidth="0.4"
        />
        <path
          d="M0 218 q15 -3 30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0"
          strokeWidth="0.4"
        />
      </g>

      {/* 전망대 원통 본체 (우 · 4층) */}
      {/* 기단 */}
      <ellipse cx="200" cy="200" rx="45" ry="8" strokeWidth="0.72" />
      <line x1="155" y1="200" x2="155" y2="90" />
      <line x1="245" y1="200" x2="245" y2="90" />
      {/* 층 링 */}
      <ellipse cx="200" cy="90" rx="45" ry="7" strokeWidth="0.72" />
      <ellipse cx="200" cy="130" rx="45" ry="7" strokeWidth="0.5" />
      <ellipse cx="200" cy="165" rx="45" ry="7" strokeWidth="0.5" />
      {/* 전망창 (수평 반복 · 층별) */}
      {[100, 108, 115, 138, 145, 173, 180].map((y) => (
        <line key={y} x1="160" y1={y} x2="240" y2={y} strokeWidth="0.4" />
      ))}
      {/* 창 세로 격자 */}
      {[170, 185, 200, 215, 230].map((x) => (
        <line key={x} x1={x} y1="90" x2={x} y2="200" strokeWidth="0.3" />
      ))}
      {/* 지붕 (돔) */}
      <path d="M155 90 q45 -20 90 0" strokeWidth="0.72" />
      <ellipse cx="200" cy="80" rx="20" ry="6" strokeWidth="0.5" />
      {/* 옥상 안테나 */}
      <line x1="200" y1="74" x2="200" y2="55" strokeWidth="0.72" />
      <circle cx="200" cy="53" r="2" strokeWidth="0.5" />
      {/* 옥상 조명 */}
      <line x1="192" y1="88" x2="192" y2="84" strokeWidth="0.4" />
      <line x1="208" y1="88" x2="208" y2="84" strokeWidth="0.4" />

      {/* 망원경 (좌하 · 삼각대·렌즈통 상세) */}
      <g transform="translate(50 200)">
        <line x1="0" y1="0" x2="0" y2="18" />
        {/* 삼각대 */}
        <line x1="0" y1="18" x2="-6" y2="24" strokeWidth="0.4" />
        <line x1="0" y1="18" x2="6" y2="24" strokeWidth="0.4" />
        {/* 렌즈통 */}
        <rect x="-4" y="-12" width="26" height="8" rx="1" strokeWidth="0.72" />
        {/* 접안렌즈 */}
        <line x1="-4" y1="-11" x2="-8" y2="-9" strokeWidth="0.4" />
        <line x1="-4" y1="-5" x2="-8" y2="-3" strokeWidth="0.4" />
        <line x1="-8" y1="-11" x2="-8" y2="-3" strokeWidth="0.4" />
        {/* 대안렌즈 */}
        <line x1="22" y1="-12" x2="26" y2="-14" strokeWidth="0.4" />
        <line x1="22" y1="-4" x2="26" y2="-2" strokeWidth="0.4" />
        <line x1="26" y1="-14" x2="26" y2="-2" strokeWidth="0.4" />
        {/* 조정 노브 */}
        <circle cx="8" cy="-4" r="1" strokeWidth="0.4" />
      </g>

      <Ground />
    </>
  );
}

// paju-art-cafe — 헤이리 갤러리(각진 매스·큰 창) + 프로방스 카페(박공지붕·굴뚝·차양 sway) (D14)
function IllustPajuArtCafe(): ReactElement {
  return (
    <>
      {/* 갤러리 각진 건물 (좌 · 오벨리스크형) */}
      <path d="M20 210 v-90 l40 -22 l40 22 v90 z" />
      <line x1="60" y1="98" x2="60" y2="210" strokeWidth="0.72" />
      <line x1="20" y1="120" x2="60" y2="98" strokeWidth="0.72" />
      <line x1="60" y1="98" x2="100" y2="120" strokeWidth="0.72" />
      {/* 갤러리 큰 창 (2개 · 격자) */}
      <rect x="28" y="140" width="24" height="35" strokeWidth="0.72" />
      <line x1="28" y1="157" x2="52" y2="157" strokeWidth="0.4" />
      <line x1="40" y1="140" x2="40" y2="175" strokeWidth="0.4" />
      <rect x="68" y="140" width="24" height="35" strokeWidth="0.72" />
      <line x1="68" y1="157" x2="92" y2="157" strokeWidth="0.4" />
      <line x1="80" y1="140" x2="80" y2="175" strokeWidth="0.4" />
      {/* 문 */}
      <rect x="52" y="185" width="16" height="25" strokeWidth="0.72" />
      <circle cx="65" cy="197" r="0.6" strokeWidth="0.4" />
      {/* 갤러리 사인 (짧은 선) */}
      <line x1="28" y1="185" x2="46" y2="185" strokeWidth="0.4" />
      <line x1="72" y1="185" x2="92" y2="185" strokeWidth="0.4" />

      {/* 프로방스 카페 (우) */}
      {/* 몸체 */}
      <rect x="140" y="140" width="130" height="70" />
      {/* 박공 지붕 */}
      <path d="M135 140 l70 -40 l70 40 z" strokeWidth="0.72" />
      {/* 지붕 기와 라인 */}
      <line x1="205" y1="115" x2="270" y2="140" strokeWidth="0.4" />
      <line x1="205" y1="123" x2="270" y2="140" strokeWidth="0.4" />
      <line x1="205" y1="130" x2="270" y2="140" strokeWidth="0.4" />
      <line x1="205" y1="115" x2="140" y2="140" strokeWidth="0.4" />
      <line x1="205" y1="123" x2="140" y2="140" strokeWidth="0.4" />
      <line x1="205" y1="130" x2="140" y2="140" strokeWidth="0.4" />
      {/* 굴뚝 */}
      <rect x="240" y="115" width="8" height="20" strokeWidth="0.5" />
      <path d="M240 115 h8 v-3 h-8 z" strokeWidth="0.5" />
      {/* 굴뚝 연기 (drift) */}
      <g strokeWidth="0.4">
        <Drift dx={4} dur={4} />
        <path d="M244 112 q-3 -4 0 -8 q3 -4 0 -8" />
        <circle cx="244" cy="98" r="1.2" />
      </g>

      {/* 차양 (sway · 프릴 상세) */}
      <g transform="translate(150 155)">
        <Sway cx={30} cy={0} dur={4.5} />
        <path d="M0 0 h60 l-3 12 h-54 z" strokeWidth="0.72" />
        <line x1="10" y1="0" x2="9" y2="12" strokeWidth="0.4" />
        <line x1="20" y1="0" x2="18" y2="12" strokeWidth="0.4" />
        <line x1="30" y1="0" x2="30" y2="12" strokeWidth="0.4" />
        <line x1="40" y1="0" x2="42" y2="12" strokeWidth="0.4" />
        <line x1="50" y1="0" x2="51" y2="12" strokeWidth="0.4" />
        {/* 하단 프릴 */}
        <path d="M0 12 q5 4 10 0 q5 4 10 0 q5 4 10 0 q5 4 10 0 q5 4 10 0" strokeWidth="0.4" />
      </g>

      {/* 차양 아래 창 2개 */}
      <rect x="155" y="170" width="20" height="30" strokeWidth="0.5" />
      <line x1="165" y1="170" x2="165" y2="200" strokeWidth="0.3" />
      <line x1="155" y1="185" x2="175" y2="185" strokeWidth="0.3" />
      <rect x="185" y="170" width="20" height="30" strokeWidth="0.5" />
      <line x1="195" y1="170" x2="195" y2="200" strokeWidth="0.3" />
      <line x1="185" y1="185" x2="205" y2="185" strokeWidth="0.3" />

      {/* 카페 문 (아치) */}
      <rect x="225" y="170" width="18" height="40" strokeWidth="0.72" />
      <path d="M225 170 q9 -8 18 0" strokeWidth="0.5" />
      <circle cx="240" cy="190" r="0.7" strokeWidth="0.4" />
      {/* 화분 */}
      <path d="M250 210 v-8 l4 0 v8" strokeWidth="0.4" />
      <circle cx="252" cy="200" r="3" strokeWidth="0.4" />

      <Ground />
    </>
  );
}

// paju-k-book-hangeul — 지혜의숲 다층 서가(계단식 5층·책등 반복) + 펼친 책 + 사다리 (D14 · 정적)
function IllustPajuKBookHangeul(): ReactElement {
  const shelves = [
    { y: 195, x: 20, w: 260 },
    { y: 170, x: 30, w: 240 },
    { y: 145, x: 40, w: 220 },
    { y: 120, x: 50, w: 200 },
    { y: 95, x: 60, w: 180 },
  ];
  return (
    <>
      {/* 다층 서가 계단식 (5층) */}
      {shelves.map((row, ri) => (
        <g key={ri}>
          <rect x={row.x} y={row.y} width={row.w} height="22" strokeWidth="0.72" />
          <line
            x1={row.x}
            y1={row.y - 1}
            x2={row.x + row.w}
            y2={row.y - 1}
            strokeWidth="0.4"
          />
          {/* 책등 반복 */}
          {Array.from({ length: Math.floor(row.w / 7) }).map((_, bi) => {
            const bx = row.x + 2 + bi * 7;
            if (bx + 5 > row.x + row.w - 2) return null;
            const bh = 12 + (bi % 4) * 4;
            const by = row.y + 22 - bh;
            return (
              <g key={bi}>
                <rect x={bx} y={by} width="5" height={bh} strokeWidth="0.3" />
                <line x1={bx + 0.7} y1={by + 4} x2={bx + 4.3} y2={by + 4} strokeWidth="0.25" />
              </g>
            );
          })}
        </g>
      ))}

      {/* 사다리 (우측 · 서가에 기댐 · 원근 축소) */}
      {(() => {
        const bx1 = 240,
          bx2 = 250,
          by1 = 215,
          ty1 = 85;
        const shift = 12;
        return (
          <g>
            <line x1={bx1} y1={by1} x2={bx1 - shift} y2={ty1} strokeWidth="0.5" />
            <line x1={bx2} y1={by1} x2={bx2 - shift} y2={ty1} strokeWidth="0.5" />
            {[210, 195, 180, 165, 150, 135, 120, 105, 90].map((y) => {
              const t = (by1 - y) / (by1 - ty1);
              const lx1 = bx1 - shift * t;
              const lx2 = bx2 - shift * t;
              return <line key={y} x1={lx1} y1={y} x2={lx2} y2={y} strokeWidth="0.3" />;
            })}
          </g>
        );
      })()}

      {/* 펼친 책 (좌하 전경) */}
      <g transform="translate(24 218)">
        {/* 책 페이지 좌우 */}
        <path d="M0 0 q30 -6 30 -14 v-3 q-30 6 -30 14 z" strokeWidth="0.72" />
        <path d="M30 -14 v3 q30 -8 60 -14 v-3 q-30 6 -60 14 z" strokeWidth="0.72" />
        <line x1="30" y1="-14" x2="30" y2="0" strokeWidth="0.5" />
        {/* 페이지 라인 */}
        <line x1="6" y1="-4" x2="26" y2="-8" strokeWidth="0.3" />
        <line x1="6" y1="-2" x2="26" y2="-6" strokeWidth="0.3" />
        <line x1="34" y1="-8" x2="54" y2="-12" strokeWidth="0.3" />
        <line x1="34" y1="-6" x2="54" y2="-10" strokeWidth="0.3" />
        <line x1="34" y1="-4" x2="54" y2="-8" strokeWidth="0.3" />
      </g>

      {/* 한글 힌트 (하단 · ㄱ/ㅎ/ㄴ 힌트 · 짧은 점) */}
      <path d="M120 215 h6 v4" strokeWidth="0.3" />
      <path d="M135 215 h6 m-3 0 v4" strokeWidth="0.3" />
      <path d="M150 215 h6 v-4" strokeWidth="0.3" />

      <Ground />
    </>
  );
}

// paju-lake-bridge — 마장호수 출렁다리(H주탑 2개·현수 케이블·데크 판재) + 물결·미세 sway (D14)
function IllustPajuLakeBridge(): ReactElement {
  return (
    <>
      {/* 원경 산 */}
      <path
        d="M0 130 q40 -20 70 -8 q40 -12 80 -2 q40 -18 90 -5 q40 -8 60 5"
        strokeWidth="0.4"
      />

      {/* 주탑 (좌 · H 형태) */}
      <line x1="55" y1="60" x2="55" y2="180" strokeWidth="0.72" />
      <line x1="80" y1="60" x2="80" y2="180" strokeWidth="0.72" />
      <line x1="55" y1="90" x2="80" y2="90" strokeWidth="0.4" />
      <line x1="55" y1="130" x2="80" y2="130" strokeWidth="0.4" />
      <line x1="55" y1="170" x2="80" y2="170" strokeWidth="0.4" />
      {/* 주탑 (우) */}
      <line x1="220" y1="60" x2="220" y2="180" strokeWidth="0.72" />
      <line x1="245" y1="60" x2="245" y2="180" strokeWidth="0.72" />
      <line x1="220" y1="90" x2="245" y2="90" strokeWidth="0.4" />
      <line x1="220" y1="130" x2="245" y2="130" strokeWidth="0.4" />
      <line x1="220" y1="170" x2="245" y2="170" strokeWidth="0.4" />

      {/* 현수 케이블 (좌 → 우 · 포물선) */}
      <path d="M67.5 70 q82 120 165 0" strokeWidth="0.72" />
      <path d="M67.5 80 q82 105 165 0" strokeWidth="0.5" />
      {/* 케이블 걸이 (현수선 → 상판) */}
      {[80, 100, 120, 140, 160, 180, 200, 220].map((x) => {
        const t = (x - 67.5) / 165;
        const cy = 70 + Math.sin(t * Math.PI) * 60;
        return <line key={x} x1={x} y1={cy} x2={x} y2="185" strokeWidth="0.3" />;
      })}

      {/* 다리 상판 (미세 sway) */}
      <g>
        <Sway cx={150} cy={185} dur={6} />
        <line x1="20" y1="185" x2="280" y2="185" />
        <line x1="20" y1="192" x2="280" y2="192" strokeWidth="0.5" />
        {/* 데크 판재 (수직선 반복) */}
        {Array.from({ length: 27 }).map((_, i) => (
          <line
            key={i}
            x1={20 + i * 10}
            y1="185"
            x2={20 + i * 10}
            y2="192"
            strokeWidth="0.3"
          />
        ))}
        {/* 난간 (반복 세로선) */}
        {Array.from({ length: 14 }).map((_, i) => (
          <line
            key={`r${i}`}
            x1={30 + i * 20}
            y1="185"
            x2={30 + i * 20}
            y2="176"
            strokeWidth="0.3"
          />
        ))}
        <line x1="20" y1="176" x2="280" y2="176" strokeWidth="0.4" />
      </g>

      {/* 물결 (wave · 하단 3중) */}
      <g strokeWidth="0.5">
        <Wave />
        <path d="M0 210 q15 -3 30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0" />
        <path
          d="M0 218 q15 -3 30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0"
          strokeWidth="0.4"
        />
      </g>

      <Ground />
    </>
  );
}

// paju-k-nature — 감악산 능선 3중 + 봉우리 사이 출렁다리 + 소나무 3그루 · 구름 drift (D14)
function IllustPajuKNature(): ReactElement {
  return (
    <>
      {/* 구름 (drift · 상단 2개) */}
      <g strokeWidth="0.72">
        <Drift dx={10} dur={7} />
        <path d="M40 40 q8 -10 20 -6 q4 -12 18 -6 q12 -3 14 7 q4 8 -4 10 z" />
      </g>
      <g strokeWidth="0.72" transform="translate(140 -8)">
        <Drift dx={8} dur={9} />
        <path d="M60 50 q6 -8 16 -4 q4 -10 14 -4 q10 -2 12 6 q4 6 -4 8 z" />
      </g>

      {/* 능선 원경 (옅음) */}
      <path
        d="M0 140 q40 -30 90 -12 q60 -25 110 -5 q40 -20 100 5"
        strokeWidth="0.4"
      />
      {/* 능선 중경 */}
      <path
        d="M0 165 q60 -35 120 -20 q60 -18 100 5 q40 -12 80 5"
        strokeWidth="0.5"
      />
      {/* 능선 근경 (진하게 · 봉우리 뚜렷) */}
      <path d="M0 210 q30 -50 70 -40 q20 -25 40 -20 q30 5 60 -25 q30 -8 60 15 q30 -15 60 20 q20 -8 30 5" />
      {/* 그림자 힌트 */}
      <line x1="70" y1="170" x2="70" y2="195" strokeWidth="0.4" />
      <line x1="130" y1="165" x2="130" y2="185" strokeWidth="0.4" />
      <line x1="200" y1="155" x2="200" y2="185" strokeWidth="0.4" />

      {/* 출렁다리 (봉우리 사이 · 좌 봉 → 우 봉) */}
      <line x1="90" y1="155" x2="180" y2="145" strokeWidth="0.72" />
      <line x1="90" y1="155" x2="90" y2="135" strokeWidth="0.5" />
      <line x1="180" y1="145" x2="180" y2="125" strokeWidth="0.5" />
      {/* 데크 (아래로 처짐) */}
      <path d="M90 155 q45 22 90 -10" strokeWidth="0.5" />
      {/* 케이블 걸이 */}
      {[105, 120, 135, 150, 165].map((x, i) => {
        const t = (x - 90) / 90;
        const yTop = 155 - t * 10;
        const yBot = 155 + Math.sin(t * Math.PI) * 12 - t * 10;
        return <line key={i} x1={x} y1={yTop} x2={x} y2={yBot} strokeWidth="0.3" />;
      })}

      {/* 소나무 3그루 (좌 · 우 근경) */}
      <g transform="translate(20 220)" strokeWidth="0.72">
        <path d="M0 0 q-3 -25 -1 -45 q2 -20 4 -30" />
        <path d="M-9 -30 q6 -5 14 -3" strokeWidth="0.4" />
        <path d="M-12 -18 q8 -8 16 -3" strokeWidth="0.4" />
      </g>
      <g transform="translate(240 220)" strokeWidth="0.72">
        <path d="M0 0 q-4 -25 -2 -50 q2 -22 6 -35" />
        <path d="M-10 -35 q6 -6 14 -4" strokeWidth="0.4" />
        <path d="M-14 -22 q8 -8 18 -4" strokeWidth="0.4" />
        <path d="M6 -50 q-12 -4 -20 -1" strokeWidth="0.4" />
        <path d="M4 -60 q-10 -4 -16 -1" strokeWidth="0.4" />
      </g>
      <g transform="translate(268 222)" strokeWidth="0.72">
        <path d="M0 0 q-3 -18 -1 -32 q2 -13 4 -22" />
        <path d="M-8 -25 q6 -4 12 -2" strokeWidth="0.4" />
        <path d="M-10 -15 q7 -5 14 -2" strokeWidth="0.4" />
      </g>

      <Ground />
    </>
  );
}

// 경기축 ────────────────────────────────────────────────

// gyeonggi-royal-suwon — 수원화성 화서문(홍예·문루) + 공심돈(원통·총안 격자·팔각지붕) + 성벽 여장 반복 · 깃발 sway (D14)
function IllustGyeonggiRoyalSuwon(): ReactElement {
  return (
    <>
      {/* 원경 구름 (drift) */}
      <g strokeWidth="0.4">
        <Drift dx={5} dur={9} />
        <path d="M40 30 q6 -8 16 -4 q4 -10 12 -4 q8 -2 10 6 q3 6 -4 8 z" />
      </g>

      {/* 성벽 */}
      <line x1="0" y1="210" x2="300" y2="210" />
      <line x1="0" y1="195" x2="300" y2="195" strokeWidth="0.72" />
      {/* 성벽 여장 (요철 반복) */}
      {Array.from({ length: 22 }).map((_, i) => (
        <path key={i} d={`M${5 + i * 13} 195 v-6 h6 v6`} strokeWidth="0.4" />
      ))}
      {/* 성벽 돌 격자 힌트 */}
      {[200, 205].map((y) => (
        <g key={y}>
          {Array.from({ length: 15 }).map((_, i) => (
            <line key={i} x1={i * 20} y1={y} x2={i * 20} y2={y + 3} strokeWidth="0.3" />
          ))}
        </g>
      ))}

      {/* 화서문 (좌 · 홍예문 + 문루 겹처마) */}
      {/* 홍예문 아치 */}
      <path d="M80 195 v-25 q17 -20 34 0 v25" strokeWidth="0.72" />
      <line x1="97" y1="150" x2="97" y2="195" strokeWidth="0.4" />
      <line x1="82" y1="175" x2="112" y2="175" strokeWidth="0.4" />
      {/* 문루 몸체 */}
      <rect x="70" y="140" width="54" height="30" strokeWidth="0.72" />
      {/* 문루 겹처마 (2겹) */}
      <line x1="65" y1="140" x2="129" y2="140" strokeWidth="0.5" />
      <path d="M60 140 q37 -18 74 0" strokeWidth="0.72" />
      <path d="M55 128 q42 -18 84 0" strokeWidth="0.5" />
      {/* 처마 상승 */}
      <path d="M60 140 q-4 -4 -6 -10" strokeWidth="0.3" />
      <path d="M134 140 q4 -4 6 -10" strokeWidth="0.3" />
      {/* 창방 · 창살 */}
      <line x1="70" y1="150" x2="124" y2="150" strokeWidth="0.4" />
      {[152, 156, 160, 164].map((y) => (
        <line key={y} x1="80" y1={y} x2="114" y2={y} strokeWidth="0.3" />
      ))}

      {/* 깃대 + 깃발 (좌 · sway) */}
      <line x1="55" y1="195" x2="55" y2="75" strokeWidth="0.5" />
      <g>
        <Sway cx={55} cy={78} dur={3.5} />
        <path d="M55 78 l14 3 l-14 6 z" strokeWidth="0.5" />
      </g>

      {/* 공심돈 (우 · 원통 망루 · 상세) */}
      <ellipse cx="235" cy="195" rx="30" ry="7" strokeWidth="0.5" />
      <line x1="205" y1="195" x2="205" y2="140" />
      <line x1="265" y1="195" x2="265" y2="140" />
      <ellipse cx="235" cy="140" rx="30" ry="7" strokeWidth="0.5" />
      {/* 총안 (구멍 · 격자) */}
      {[
        [216, 155], [225, 155], [234, 155], [243, 155], [252, 155],
        [216, 172], [225, 172], [234, 172], [243, 172], [252, 172],
      ].map(([cx, cy], i) => (
        <rect key={i} x={cx - 2} y={cy - 1.5} width="4" height="3" strokeWidth="0.3" />
      ))}
      {/* 지붕 (팔각형) */}
      <path d="M205 140 q30 -16 60 0" strokeWidth="0.72" />
      <ellipse cx="235" cy="128" rx="12" ry="4" strokeWidth="0.5" />
      <line x1="235" y1="124" x2="235" y2="115" strokeWidth="0.5" />
      <circle cx="235" cy="112" r="2" strokeWidth="0.4" />

      <Ground />
    </>
  );
}

// gyeonggi-korean-garden — 아침고요 아치 게이트(팔작 힌트·격자) + 침엽수 3그루(sway) + 화단 단차·꽃 (D14)
function IllustGyeonggiKoreanGarden(): ReactElement {
  return (
    <>
      {/* 배경 원경 능선 */}
      <path d="M0 145 q60 -25 130 -10 q60 8 170 -8" strokeWidth="0.3" />

      {/* 침엽수 원경 (좌 · sway) */}
      <g transform="translate(30 200)">
        <Sway cx={0} cy={0} dur={5} />
        <line x1="0" y1="0" x2="0" y2="-50" strokeWidth="0.5" />
        <path d="M-9 -15 l9 -12 l9 12 z" strokeWidth="0.5" />
        <path d="M-11 -28 l11 -14 l11 14 z" strokeWidth="0.5" />
        <path d="M-9 -42 l9 -12 l9 12 z" strokeWidth="0.5" />
      </g>
      {/* 침엽수 중경 (우 · 큰) */}
      <g transform="translate(255 218)">
        <Sway cx={0} cy={0} dur={4} />
        <line x1="0" y1="0" x2="0" y2="-80" />
        <path d="M-16 -20 l16 -18 l16 18 z" strokeWidth="0.72" />
        <path d="M-20 -42 l20 -22 l20 22 z" strokeWidth="0.72" />
        <path d="M-17 -60 l17 -18 l17 18 z" strokeWidth="0.72" />
        <path d="M-13 -75 l13 -14 l13 14 z" strokeWidth="0.72" />
      </g>
      {/* 침엽수 근경 (좌하 · 가장 큼) */}
      <g transform="translate(85 220)">
        <Sway cx={0} cy={0} dur={4.5} />
        <line x1="0" y1="0" x2="0" y2="-90" />
        <path d="M-18 -22 l18 -20 l18 20 z" strokeWidth="0.72" />
        <path d="M-22 -45 l22 -24 l22 24 z" strokeWidth="0.72" />
        <path d="M-18 -68 l18 -20 l18 20 z" strokeWidth="0.72" />
        <path d="M-14 -85 l14 -16 l14 16 z" strokeWidth="0.72" />
      </g>

      {/* 아치 게이트 (중앙) */}
      <path d="M130 205 v-55 q30 -30 60 0 v55" />
      {/* 아치 격자 */}
      <line x1="130" y1="175" x2="190" y2="175" strokeWidth="0.4" />
      <line x1="135" y1="150" x2="185" y2="150" strokeWidth="0.4" />
      <line x1="160" y1="120" x2="160" y2="205" strokeWidth="0.4" />
      <line x1="145" y1="130" x2="145" y2="205" strokeWidth="0.4" />
      <line x1="175" y1="130" x2="175" y2="205" strokeWidth="0.4" />
      {/* 아치 위 팔작 지붕 힌트 */}
      <path d="M125 122 q35 -15 70 0" strokeWidth="0.72" />
      <line x1="130" y1="122" x2="190" y2="122" strokeWidth="0.5" />
      <path d="M125 122 q-3 -3 -4 -7" strokeWidth="0.3" />
      <path d="M195 122 q3 -3 4 -7" strokeWidth="0.3" />

      {/* 화단 단차 (전경 · 원호 2단) */}
      <path d="M110 220 q50 -15 100 0" strokeWidth="0.5" />
      <path d="M110 215 q50 -12 100 0" strokeWidth="0.4" />
      {/* 꽃 반복 */}
      {[125, 140, 155, 170, 185, 200].map((x) => (
        <g key={x}>
          <circle cx={x} cy="212" r="1" strokeWidth="0.4" />
          <line x1={x} y1="215" x2={x} y2="218" strokeWidth="0.4" />
        </g>
      ))}
      {/* 잔디 짧은 선 */}
      {[20, 45, 70, 100, 220, 245, 275].map((x) => (
        <path key={x} d={`M${x} 220 v-3`} strokeWidth="0.4" />
      ))}

      <Ground />
    </>
  );
}

// gyeonggi-living-korea — 민속촌 초가(이엉 다층·창살) + 물레방아(바퀴살·물받이 spin) + 장독대 3항아리 (D14)
function IllustGyeonggiLivingKorea(): ReactElement {
  return (
    <>
      {/* 초가 (좌) */}
      {/* 이엉 지붕 (3중 곡선) */}
      <path d="M20 145 q55 -50 110 0 z" />
      <path d="M25 145 q50 -45 100 0" strokeWidth="0.72" />
      <path d="M30 145 q45 -40 90 0" strokeWidth="0.5" />
      {/* 이엉 결 */}
      {[35, 45, 55, 65, 75, 85, 95, 105, 115].map((x) => (
        <line key={x} x1={x} y1="130" x2={x} y2="145" strokeWidth="0.3" />
      ))}
      {/* 흙벽 몸체 */}
      <rect x="30" y="145" width="90" height="65" />
      {/* 문 */}
      <rect x="60" y="165" width="30" height="45" strokeWidth="0.72" />
      <line x1="75" y1="165" x2="75" y2="210" strokeWidth="0.4" />
      {[172, 182, 195, 205].map((y) => (
        <line key={y} x1="60" y1={y} x2="90" y2={y} strokeWidth="0.3" />
      ))}
      {/* 벽 창 (2개) */}
      <rect x="38" y="170" width="15" height="12" strokeWidth="0.5" />
      <line x1="38" y1="176" x2="53" y2="176" strokeWidth="0.3" />
      <line x1="45" y1="170" x2="45" y2="182" strokeWidth="0.3" />
      <rect x="98" y="170" width="15" height="12" strokeWidth="0.5" />
      <line x1="98" y1="176" x2="113" y2="176" strokeWidth="0.3" />
      <line x1="105" y1="170" x2="105" y2="182" strokeWidth="0.3" />

      {/* 물레방아 (중앙 · spin) */}
      <g transform="translate(180 165)">
        <g>
          <Spin cx={0} cy={0} dur={9} />
          <circle cx="0" cy="0" r="32" />
          <circle cx="0" cy="0" r="26" strokeWidth="0.5" />
          {/* 스포크 8개 */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
            const rad = (deg * Math.PI) / 180;
            return (
              <line
                key={deg}
                x1="0"
                y1="0"
                x2={Math.cos(rad) * 32}
                y2={Math.sin(rad) * 32}
                strokeWidth="0.5"
              />
            );
          })}
          {/* 물받이 판재 (외곽) */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
            const rad = (deg * Math.PI) / 180;
            const x = Math.cos(rad) * 32;
            const y = Math.sin(rad) * 32;
            const nx = Math.cos(rad + Math.PI / 8) * 32;
            const ny = Math.sin(rad + Math.PI / 8) * 32;
            return (
              <line key={`bd${deg}`} x1={x} y1={y} x2={nx} y2={ny} strokeWidth="0.4" />
            );
          })}
        </g>
        <circle cx="0" cy="0" r="4" strokeWidth="0.5" />
        <circle cx="0" cy="0" r="1.5" strokeWidth="0.4" />
      </g>
      {/* 물레방아 프레임 */}
      <line x1="150" y1="200" x2="170" y2="165" strokeWidth="0.5" />
      <line x1="210" y1="200" x2="190" y2="165" strokeWidth="0.5" />
      {/* 물길 */}
      <line x1="140" y1="205" x2="230" y2="205" strokeWidth="0.5" />
      <path d="M140 213 q15 -3 30 0 t30 0 t30 0" strokeWidth="0.4" />

      {/* 장독대 (우 · 돌담 + 항아리 3개) */}
      <rect x="235" y="200" width="55" height="12" strokeWidth="0.5" />
      <line x1="250" y1="200" x2="250" y2="212" strokeWidth="0.4" />
      <line x1="270" y1="200" x2="270" y2="212" strokeWidth="0.4" />
      <g transform="translate(240 200)">
        <path d="M0 0 q3 -12 10 -12 q7 0 10 12 z" strokeWidth="0.5" />
        <ellipse cx="10" cy="-11" rx="6" ry="1.5" strokeWidth="0.4" />
      </g>
      <g transform="translate(258 200)">
        <path d="M0 0 q4 -16 14 -16 q10 0 14 16 z" strokeWidth="0.5" />
        <ellipse cx="14" cy="-15" rx="8" ry="1.8" strokeWidth="0.4" />
      </g>
      <g transform="translate(278 200)">
        <path d="M0 0 q3 -10 8 -10 q5 0 8 10 z" strokeWidth="0.5" />
        <ellipse cx="8" cy="-9" rx="5" ry="1.2" strokeWidth="0.4" />
      </g>

      <Ground />
    </>
  );
}

// gyeonggi-nami-island — 남이섬 메타세쿼이아 원근 가로수(양쪽 3그루씩·다층 원뿔) + 나룻배(좌석·노) wave (D14)
function IllustGyeonggiNamiIsland(): ReactElement {
  return (
    <>
      {/* 원경 능선 */}
      <path d="M0 145 q60 -20 120 -10 q60 8 180 -5" strokeWidth="0.3" />

      {/* 메타세쿼이아 좌열 (원근 3그루) */}
      {[
        [30, 60],
        [70, 80],
        [120, 100],
      ].map(([x, h], i) => (
        <g key={`L${i}`} transform={`translate(${x} 220)`}>
          <line x1="0" y1="0" x2="0" y2={-h - 15} strokeWidth="0.72" />
          {Array.from({ length: 6 }).map((_, layer) => {
            const y = -h - 15 + (layer + 1) * (h / 6);
            const w = (layer + 1) * (h / 30);
            return (
              <path
                key={layer}
                d={`M${-w} ${y} l${w} ${-h / 8} l${w} ${h / 8} z`}
                strokeWidth="0.4"
              />
            );
          })}
        </g>
      ))}
      {/* 메타세쿼이아 우열 */}
      {[
        [280, 60],
        [240, 80],
        [190, 100],
      ].map(([x, h], i) => (
        <g key={`R${i}`} transform={`translate(${x} 220)`}>
          <line x1="0" y1="0" x2="0" y2={-h - 15} strokeWidth="0.72" />
          {Array.from({ length: 6 }).map((_, layer) => {
            const y = -h - 15 + (layer + 1) * (h / 6);
            const w = (layer + 1) * (h / 30);
            return (
              <path
                key={layer}
                d={`M${-w} ${y} l${w} ${-h / 8} l${w} ${h / 8} z`}
                strokeWidth="0.4"
              />
            );
          })}
        </g>
      ))}

      {/* 길 (원근 · 소실점) */}
      <line x1="140" y1="220" x2="150" y2="145" strokeWidth="0.5" />
      <line x1="170" y1="220" x2="160" y2="145" strokeWidth="0.5" />
      {[210, 195, 180, 165].map((y) => {
        const t = (y - 145) / (220 - 145);
        const cx = 155 - t * 5;
        const w = 10 + t * 15;
        return (
          <line
            key={y}
            x1={cx - w / 2}
            y1={y}
            x2={cx + w / 2}
            y2={y}
            strokeWidth="0.3"
          />
        );
      })}

      {/* 나룻배 (하단 · wave · 상세) */}
      <g transform="translate(215 210)">
        <Wave />
        {/* 배 몸체 (곡선) */}
        <path d="M-30 0 q30 15 60 0 l-7 -8 h-46 z" strokeWidth="0.72" />
        {/* 좌석 판 */}
        <line x1="-20" y1="-2" x2="20" y2="-2" strokeWidth="0.4" />
        <line x1="-15" y1="-5" x2="15" y2="-5" strokeWidth="0.4" />
        {/* 노 (측면) */}
        <line x1="-28" y1="-4" x2="-40" y2="6" strokeWidth="0.5" />
        <path d="M-40 6 l-4 6 l4 -2" strokeWidth="0.4" />
        <line x1="28" y1="-4" x2="40" y2="6" strokeWidth="0.5" />
        <path d="M40 6 l4 6 l-4 -2" strokeWidth="0.4" />
        {/* 뱃머리 장식 */}
        <line x1="0" y1="-8" x2="0" y2="-16" strokeWidth="0.5" />
        <path d="M-2 -16 h4 v-3 h-4 z" strokeWidth="0.4" />
      </g>

      {/* 배 주변 물결 */}
      <path
        d="M180 218 q10 -3 20 0 t20 0 t20 0 t20 0"
        strokeWidth="0.3"
      />
      <path
        d="M170 224 q12 -3 24 0 t24 0 t24 0 t24 0"
        strokeWidth="0.3"
      />

      <Ground />
    </>
  );
}

// gyeonggi-everland — 대관람차(림·12 스포크·캐빈 8개) + 회전목마(원뿔지붕·프릴·말 실루엣 3폴 spin) (D14)
function IllustGyeonggiEverland(): ReactElement {
  return (
    <>
      {/* 대관람차 (좌 · spin) */}
      <g transform="translate(85 130)">
        <g>
          <Spin cx={0} cy={0} dur={20} />
          {/* 외곽 림 (2겹) */}
          <circle cx="0" cy="0" r="65" />
          <circle cx="0" cy="0" r="60" strokeWidth="0.5" />
          {/* 중앙 허브 */}
          <circle cx="0" cy="0" r="6" strokeWidth="0.72" />
          <circle cx="0" cy="0" r="2" strokeWidth="0.5" />
          {/* 스포크 12개 */}
          {Array.from({ length: 12 }).map((_, i) => {
            const rad = (i * 30 * Math.PI) / 180;
            return (
              <line
                key={i}
                x1={Math.cos(rad) * 6}
                y1={Math.sin(rad) * 6}
                x2={Math.cos(rad) * 60}
                y2={Math.sin(rad) * 60}
                strokeWidth="0.4"
              />
            );
          })}
          {/* 캐빈 8개 */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
            const rad = (deg * Math.PI) / 180;
            const x = Math.cos(rad) * 65;
            const y = Math.sin(rad) * 65;
            return (
              <g key={deg}>
                <line
                  x1={Math.cos(rad) * 60}
                  y1={Math.sin(rad) * 60}
                  x2={x}
                  y2={y}
                  strokeWidth="0.4"
                />
                <rect
                  x={x - 4}
                  y={y - 3}
                  width="8"
                  height="6"
                  rx="1.5"
                  strokeWidth="0.5"
                />
                <line x1={x - 4} y1={y} x2={x + 4} y2={y} strokeWidth="0.3" />
              </g>
            );
          })}
        </g>
        {/* 지지대 A자 */}
        <line x1="0" y1="0" x2="-35" y2="80" strokeWidth="0.72" />
        <line x1="0" y1="0" x2="35" y2="80" strokeWidth="0.72" />
        <line x1="-25" y1="55" x2="25" y2="55" strokeWidth="0.4" />
      </g>

      {/* 회전목마 (우) */}
      <g transform="translate(225 160)">
        {/* 원뿔 지붕 */}
        <path d="M-40 -18 q40 -32 80 0 z" strokeWidth="0.72" />
        {/* 프릴 (하단 물결) */}
        <path
          d="M-40 -18 q10 8 20 0 q10 8 20 0 q10 8 20 0 q10 8 20 0"
          strokeWidth="0.4"
        />
        {/* 지붕 세로 줄무늬 */}
        {[-30, -15, 0, 15, 30].map((x) => (
          <line key={x} x1={x} y1="-18" x2={x / 2} y2="-45" strokeWidth="0.3" />
        ))}
        {/* 꼭대기 */}
        <line x1="0" y1="-50" x2="0" y2="-60" strokeWidth="0.5" />
        <path d="M-3 -60 h6 v-4 h-6 z" strokeWidth="0.4" />
        <path d="M-2 -64 l2 -4 l2 4" strokeWidth="0.4" />

        {/* 회전축 (spin · 폴대 + 말) */}
        <g>
          <Spin cx={0} cy={0} dur={12} />
          <ellipse cx="0" cy="0" rx="40" ry="10" strokeWidth="0.5" />
          {/* 3폴대 + 말 실루엣 */}
          {[-25, 0, 25].map((x, i) => (
            <g key={i}>
              <line x1={x} y1="-6" x2={x} y2="18" strokeWidth="0.5" />
              {/* 말 실루엣 (단순화) */}
              <g transform={`translate(${x} 8)`}>
                <path
                  d="M-10 0 q3 -6 10 -6 q7 0 8 3 l4 -1 l-2 3 l-2 0 l0 5 h-4 v-3 h-8 v3 h-4 z"
                  strokeWidth="0.4"
                />
                {/* 다리 4개 */}
                <line x1="-8" y1="1" x2="-8" y2="6" strokeWidth="0.3" />
                <line x1="-4" y1="1" x2="-4" y2="6" strokeWidth="0.3" />
                <line x1="4" y1="1" x2="4" y2="6" strokeWidth="0.3" />
                <line x1="0" y1="1" x2="0" y2="6" strokeWidth="0.3" />
                {/* 꼬리 */}
                <path d="M-10 -2 l-3 2" strokeWidth="0.3" />
                {/* 갈기 */}
                <path d="M4 -5 l1 -2" strokeWidth="0.3" />
              </g>
            </g>
          ))}
        </g>
        {/* 바닥 원반 (두께) */}
        <ellipse cx="0" cy="22" rx="42" ry="8" strokeWidth="0.72" />
        <line x1="-42" y1="22" x2="-42" y2="30" strokeWidth="0.4" />
        <line x1="42" y1="22" x2="42" y2="30" strokeWidth="0.4" />
        <line x1="-42" y1="30" x2="42" y2="30" strokeWidth="0.4" />
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
      <Draw />
    </svg>
  );
}
