// components/home/AccessHubSection.tsx
// 홈 · Access Hub 섹션 (CuratedGridSection 과 SocialSection 사이).
//
// SVG 코드 빌드 다이어그램 (이전 이미지 버전에서 전환):
//   · 다크 네이비 배경 + 골드·오렌지 포인트 (Design OS 2.0 토큰)
//   · 데스크톱: 방사형 허브 다이어그램 (SVG 연결선 + HTML 노드 카드 오버레이)
//   · 모바일: 세로 리스트 (서울은 4개 세부 행을 들여쓴 형태)
//   · Ken Burns 없음. 연결선 draw 애니메이션·허브 pulse·카드 fade-in
//     모두 prefers-reduced-motion 시 즉시 정지.
//   · 외부 라이브러리 사용 없음 (아이콘만 lucide-react — 이미 프로젝트 표준).
//
// 5로케일 텍스트 (헤더/서브/캡션 + 다이어그램 내부 지명·시간 라벨 + 강점 바):
//   messages/*.json 키 추가 없음. EmblemEntrySection 방식 준용.
//   "GOYANG·ILSAN" / "Gateway to Korea" / "STAY IN GOYANG. EXPERIENCE MORE OF KOREA."
//   3문안은 영문 고정 (컴포넌트 상수).
//
// 무접촉: DB / 카드·hero·badge 자산 / 다른 섹션. 판매 소구어 0.

import {
  Building2,
  Landmark,
  Mountain,
  Plane,
  Train,
  Trees,
} from "lucide-react";

type LocaleKey = "ko" | "en" | "ja" | "zh-CN" | "zh-TW";
const LOCALES: LocaleKey[] = ["ko", "en", "ja", "zh-CN", "zh-TW"];

type NodeCopy = { label: string; time: string };
type Copy = {
  head: string;
  sub: string;
  caption: string;
  seoul: {
    label: string;
    mainLine: string;
    subs: Array<{ label: string; time: string }>;
  };
  nodes: {
    gimpo: NodeCopy;
    incheon: NodeCopy;
    dmz: NodeCopy;
    kintex: NodeCopy;
    lake: NodeCopy;
  };
  strengths: [string, string, string, string];
};

// 영문 고정 문안 (다이어그램 심볼·마감 카피).
const HUB_NAME = "GOYANG·ILSAN";
const HUB_TAG = "Gateway to Korea";
const CLOSER = "STAY IN GOYANG. EXPERIENCE MORE OF KOREA.";
const EYEBROW = "ACCESS HUB";

const COPY: Record<LocaleKey, Copy> = {
  ko: {
    head: "가장 가까운 곳에서 만나는 가장 특별한 경험",
    sub: "공항·서울·DMZ·KINTEX를 가장 빠르게 잇는 대한민국 관문 도시",
    caption:
      "서울 13–17분(GTX-A) · 김포공항 9분(대곡역 기준) · 파주 DMZ 30분 · 인천공항 직결",
    seoul: {
      label: "서울",
      mainLine: "서울역 13–17분 GTX-A",
      subs: [
        { label: "홍대", time: "20분" },
        { label: "경복궁", time: "30분" },
        { label: "강남", time: "40분" },
        { label: "성수", time: "1시간" },
      ],
    },
    nodes: {
      gimpo: { label: "김포공항", time: "9분" },
      incheon: { label: "인천공항", time: "직결" },
      dmz: { label: "파주 DMZ", time: "30분" },
      kintex: { label: "KINTEX", time: "15분" },
      lake: { label: "일산호수공원", time: "5분" },
    },
    strengths: [
      "수도권 핵심을 잇는 최적의 위치",
      "GTX·지하철·광역도로로 빠르게 연결",
      "비즈니스·여행·문화·휴식을 모두 누리는 도시",
      "머무를수록 특별한 K-CULTURE CITY",
    ],
  },
  en: {
    head: "The most special experiences, closest at hand",
    sub: "The gateway city that links the airports, Seoul, the DMZ and KINTEX in the shortest time",
    caption:
      "Seoul 13–17 min (GTX-A) · Gimpo Airport 9 min (from Daegok) · Paju DMZ 30 min · Direct to Incheon Airport",
    seoul: {
      label: "Seoul",
      mainLine: "Seoul Station 13–17 min via GTX-A",
      subs: [
        { label: "Hongdae", time: "20 min" },
        { label: "Gyeongbokgung Palace", time: "30 min" },
        { label: "Gangnam", time: "40 min" },
        { label: "Seongsu", time: "1 hr" },
      ],
    },
    nodes: {
      gimpo: { label: "Gimpo Airport", time: "9 min" },
      incheon: { label: "Incheon Airport", time: "Direct" },
      dmz: { label: "Paju DMZ", time: "30 min" },
      kintex: { label: "KINTEX", time: "15 min" },
      lake: { label: "Ilsan Lake Park", time: "5 min" },
    },
    strengths: [
      "Positioned at the heart of the capital region",
      "Fast connections via GTX, subway and expressway",
      "A city for business, travel, culture and rest",
      "K-culture city — the longer you stay, the more it reveals",
    ],
  },
  ja: {
    head: "最も近い場所で出会う、最も特別な体験",
    sub: "空港・ソウル・DMZ・KINTEXを最短でつなぐ、韓国のゲートウェイ都市",
    caption:
      "ソウル13–17分（GTX-A）・金浦空港9分（大谷駅基準）・坡州DMZ30分・仁川空港直結",
    seoul: {
      label: "ソウル",
      mainLine: "ソウル駅 13–17分 GTX-A",
      subs: [
        { label: "弘大", time: "20分" },
        { label: "景福宮", time: "30分" },
        { label: "江南", time: "40分" },
        { label: "聖水", time: "1時間" },
      ],
    },
    nodes: {
      gimpo: { label: "金浦空港", time: "9分" },
      incheon: { label: "仁川空港", time: "直結" },
      dmz: { label: "坡州 DMZ", time: "30分" },
      kintex: { label: "KINTEX", time: "15分" },
      lake: { label: "一山湖水公園", time: "5分" },
    },
    strengths: [
      "首都圏の中心をつなぐ最適の立地",
      "GTX・地下鉄・広域道路で素早くつながる",
      "ビジネス・旅行・文化・休息を一度に楽しめる都市",
      "滞在するほど特別なK-CULTURE CITY",
    ],
  },
  "zh-CN": {
    head: "在最近的地方，遇见最特别的体验",
    sub: "以最短时间连接机场、首尔、DMZ与KINTEX的韩国门户城市",
    caption:
      "首尔13–17分钟（GTX-A）· 金浦机场9分钟（自大谷站）· 坡州DMZ 30分钟 · 直达仁川机场",
    seoul: {
      label: "首尔",
      mainLine: "首尔站 13–17分钟 GTX-A",
      subs: [
        { label: "弘大", time: "20分钟" },
        { label: "景福宫", time: "30分钟" },
        { label: "江南", time: "40分钟" },
        { label: "圣水", time: "1小时" },
      ],
    },
    nodes: {
      gimpo: { label: "金浦机场", time: "9分钟" },
      incheon: { label: "仁川机场", time: "直达" },
      dmz: { label: "坡州 DMZ", time: "30分钟" },
      kintex: { label: "KINTEX", time: "15分钟" },
      lake: { label: "一山湖水公园", time: "5分钟" },
    },
    strengths: [
      "位于首都圈核心的最佳位置",
      "GTX·地铁·高速公路快速联通",
      "商务·旅行·文化·休憩一站式享受",
      "停留越久越特别的K-CULTURE CITY",
    ],
  },
  "zh-TW": {
    head: "在最近的地方，遇見最特別的體驗",
    sub: "以最短時間連接機場、首爾、DMZ與KINTEX的韓國門戶城市",
    caption:
      "首爾13–17分鐘（GTX-A）· 金浦機場9分鐘（自大谷站）· 坡州DMZ 30分鐘 · 直達仁川機場",
    seoul: {
      label: "首爾",
      mainLine: "首爾站 13–17分鐘 GTX-A",
      subs: [
        { label: "弘大", time: "20分鐘" },
        { label: "景福宮", time: "30分鐘" },
        { label: "江南", time: "40分鐘" },
        { label: "聖水", time: "1小時" },
      ],
    },
    nodes: {
      gimpo: { label: "金浦機場", time: "9分鐘" },
      incheon: { label: "仁川機場", time: "直達" },
      dmz: { label: "坡州 DMZ", time: "30分鐘" },
      kintex: { label: "KINTEX", time: "15分鐘" },
      lake: { label: "一山湖水公園", time: "5分鐘" },
    },
    strengths: [
      "位處首都圈核心的最佳位置",
      "GTX·地鐵·高速公路快速聯通",
      "商務·旅行·文化·休憩一站式享受",
      "停留越久越特別的K-CULTURE CITY",
    ],
  },
};

/**
 * 방사형 노드 좌표 — viewBox 1200x700 기준.
 * 허브 중심 (450, 340). 노드 카드는 %-based 절대 위치로 오버레이,
 * SVG 연결선 좌표와 동기화되도록 계산 (leftPct = x/1200, topPct = y/700).
 */
type NodeKey = "kintex" | "dmz" | "lake" | "gimpo" | "incheon";
type NodeSpec = {
  key: NodeKey;
  icon: typeof Plane;
  x: number;
  y: number;
  delayMs: number;
};

const HUB_X = 450;
const HUB_Y = 340;

const SMALL_NODES: NodeSpec[] = [
  { key: "kintex", icon: Building2, x: 450, y: 90, delayMs: 100 },
  { key: "dmz", icon: Mountain, x: 130, y: 130, delayMs: 200 },
  { key: "lake", icon: Trees, x: 100, y: 340, delayMs: 300 },
  { key: "gimpo", icon: Plane, x: 130, y: 550, delayMs: 400 },
  { key: "incheon", icon: Plane, x: 450, y: 610, delayMs: 500 },
];
const SEOUL_XY = { x: 950, y: 340 };

function pct(value: number, total: number): string {
  return `${(value / total) * 100}%`;
}

export default function AccessHubSection({ locale }: { locale: string }) {
  const active: LocaleKey = (
    LOCALES.includes(locale as LocaleKey) ? locale : "ko"
  ) as LocaleKey;
  const copy = COPY[active];

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-18">
      <div className="relative overflow-hidden rounded-[32px] bg-[linear-gradient(140deg,_#080e1a_0%,_#0e1c35_40%,_#152a52_75%,_#1a3468_100%)] p-6 shadow-[0_28px_70px_rgba(8,14,26,0.35)] sm:rounded-[40px] sm:p-10 lg:p-14">
        <style>{`
          @keyframes access-line-draw {
            from { stroke-dashoffset: 1; }
            to   { stroke-dashoffset: 0; }
          }
          @keyframes access-pulse {
            0%,100% { box-shadow: 0 10px 40px rgba(255,233,139,0.20); }
            50%     { box-shadow: 0 10px 60px rgba(255,233,139,0.45); }
          }
          @keyframes access-card-in {
            from { opacity: 0; transform: translateY(6px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          .access-line  { animation: access-line-draw 1.2s ease-out forwards; }
          .access-pulse { animation: access-pulse 4s ease-in-out infinite; }
          .access-card  { animation: access-card-in 700ms ease-out backwards; }
          @media (prefers-reduced-motion: reduce) {
            .access-line, .access-pulse, .access-card {
              animation: none !important;
            }
            .access-line { stroke-dashoffset: 0 !important; }
          }
        `}</style>

        {/* 배경 글로우 */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full bg-[#ffe98b]/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-72 w-72 rounded-full bg-[#ffb58f]/10 blur-3xl" />

        {/* 헤더 */}
        <div className="relative">
          <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#ffe98b]/90">
            {EYEBROW}
          </div>
          <h2 className="mt-3 max-w-3xl text-2xl font-black leading-tight tracking-[-0.03em] text-white sm:text-3xl lg:text-4xl">
            {copy.head}
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/70 sm:text-base">
            {copy.sub}
          </p>
        </div>

        {/* 데스크톱 방사형 다이어그램 */}
        <div className="relative mt-10 hidden aspect-[12/7] w-full md:block">
          {/* 연결선 (SVG 레이어) */}
          <svg
            viewBox="0 0 1200 700"
            className="absolute inset-0 h-full w-full"
            aria-hidden="true"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="access-line-grad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#ffe98b" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#ffb58f" stopOpacity="0.55" />
              </linearGradient>
            </defs>
            {[
              ...SMALL_NODES.map((n) => ({ x: n.x, y: n.y, delay: n.delayMs })),
              { x: SEOUL_XY.x, y: SEOUL_XY.y, delay: 600 },
            ].map((l, i) => (
              <line
                key={i}
                x1={HUB_X}
                y1={HUB_Y}
                x2={l.x}
                y2={l.y}
                stroke="url(#access-line-grad)"
                strokeWidth="1.4"
                strokeLinecap="round"
                pathLength="1"
                strokeDasharray="1"
                strokeDashoffset="1"
                className="access-line"
                style={{ animationDelay: `${l.delay}ms` }}
              />
            ))}
          </svg>

          {/* 노드 카드 (HTML 오버레이) */}
          <div className="absolute inset-0">
            {/* 중심 허브 */}
            <div
              className="absolute"
              style={{
                left: pct(HUB_X, 1200),
                top: pct(HUB_Y, 700),
                transform: "translate(-50%, -50%)",
              }}
            >
              <div className="access-pulse flex h-40 w-40 flex-col items-center justify-center rounded-full border-2 border-[#ffe98b]/60 bg-[#080e1a]/90 text-center">
                <Train className="h-4 w-4 text-[#ffe98b]" aria-hidden="true" />
                <div className="mt-1.5 text-[13px] font-black tracking-[0.06em] text-[#ffe98b]">
                  {HUB_NAME}
                </div>
                <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/55">
                  {HUB_TAG}
                </div>
              </div>
            </div>

            {/* 서울 (확장 카드) */}
            <div
              className="absolute w-[300px]"
              style={{
                left: pct(SEOUL_XY.x, 1200),
                top: pct(SEOUL_XY.y, 700),
                transform: "translate(-50%, -50%)",
              }}
            >
              <div
                className="access-card rounded-2xl border border-[#ffe98b]/25 bg-white/[0.07] px-5 py-4 shadow-[0_10px_30px_rgba(0,0,0,0.35)] backdrop-blur"
                style={{ animationDelay: "600ms" }}
              >
                <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#ffe98b]/90">
                  <Landmark className="h-3.5 w-3.5" aria-hidden="true" />
                  {copy.seoul.label}
                </div>
                <div className="mt-2 text-[15px] font-black leading-snug text-white">
                  {copy.seoul.mainLine}
                </div>
                <div className="mt-3 space-y-1.5 border-t border-white/10 pt-3">
                  {copy.seoul.subs.map((s) => (
                    <div
                      key={s.label}
                      className="flex items-center justify-between text-[12px]"
                    >
                      <span className="text-white/70">{s.label}</span>
                      <span className="font-bold text-[#ffe98b]">{s.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 5 작은 노드 */}
            {SMALL_NODES.map((node) => {
              const Icon = node.icon;
              const nc = copy.nodes[node.key];
              return (
                <div
                  key={node.key}
                  className="absolute w-[168px]"
                  style={{
                    left: pct(node.x, 1200),
                    top: pct(node.y, 700),
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <div
                    className="access-card rounded-2xl border border-white/12 bg-white/[0.06] px-3.5 py-3 text-center shadow-[0_8px_24px_rgba(0,0,0,0.30)] backdrop-blur"
                    style={{ animationDelay: `${node.delayMs}ms` }}
                  >
                    <div className="flex items-center justify-center gap-1.5 text-[11px] font-semibold text-white/85">
                      <Icon
                        className="h-3.5 w-3.5 text-[#ffb58f]"
                        aria-hidden="true"
                      />
                      <span className="truncate">{nc.label}</span>
                    </div>
                    <div className="mt-1 text-lg font-black tracking-tight text-[#ffe98b]">
                      {nc.time}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 모바일 세로 리스트 (억지 축소 없이 각 카드 full-width) */}
        <div className="relative mt-8 space-y-2.5 md:hidden">
          {/* 허브 바 */}
          <div className="rounded-2xl border border-[#ffe98b]/40 bg-[#080e1a]/70 px-4 py-3 text-center">
            <div className="text-sm font-black tracking-[0.06em] text-[#ffe98b]">
              {HUB_NAME}
            </div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/55">
              {HUB_TAG}
            </div>
          </div>

          {/* 서울 (확장) */}
          <div className="rounded-2xl border border-[#ffe98b]/25 bg-white/[0.07] px-4 py-3">
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#ffe98b]/90">
              <Landmark className="h-3.5 w-3.5" aria-hidden="true" />
              {copy.seoul.label}
            </div>
            <div className="mt-1.5 text-sm font-black leading-snug text-white">
              {copy.seoul.mainLine}
            </div>
            <div className="mt-2 space-y-1 border-l-2 border-[#ffe98b]/30 pl-3">
              {copy.seoul.subs.map((s) => (
                <div
                  key={s.label}
                  className="flex items-center justify-between text-xs"
                >
                  <span className="text-white/70">{s.label}</span>
                  <span className="font-bold text-[#ffe98b]">{s.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 5 작은 노드 */}
          {SMALL_NODES.map((node) => {
            const Icon = node.icon;
            const nc = copy.nodes[node.key];
            return (
              <div
                key={node.key}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3"
              >
                <div className="flex items-center gap-2 text-sm text-white/90">
                  <Icon
                    className="h-4 w-4 text-[#ffb58f]"
                    aria-hidden="true"
                  />
                  {nc.label}
                </div>
                <div className="text-sm font-bold text-[#ffe98b]">
                  {nc.time}
                </div>
              </div>
            );
          })}
        </div>

        {/* 캡션 */}
        <p className="relative mt-6 text-xs leading-relaxed text-white/60 sm:text-sm">
          {copy.caption}
        </p>

        {/* 하단 강점 바 (4항목) */}
        <div className="relative mt-10 grid gap-4 border-t border-white/10 pt-8 sm:grid-cols-2 lg:grid-cols-4">
          {copy.strengths.map((s, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#ffe98b]/40 bg-[#ffe98b]/10 text-[10px] font-bold text-[#ffe98b]">
                {i + 1}
              </div>
              <div className="text-sm font-medium leading-snug text-white/85">
                {s}
              </div>
            </div>
          ))}
        </div>

        {/* 마감 카피 (영문 고정) */}
        <div className="relative mt-8 text-center">
          <div className="inline-block text-[11px] font-bold uppercase tracking-[0.28em] text-[#ffb58f] sm:text-xs">
            {CLOSER}
          </div>
        </div>
      </div>
    </section>
  );
}
