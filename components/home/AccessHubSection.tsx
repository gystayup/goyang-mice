// components/home/AccessHubSection.tsx
// 홈 · Access Hub 섹션 — 배경 이미지 + 균일 스크림 + 5로케일 코드 오버레이 (오더 #2-R4 최종).
//
// 배경: public/images/access/access-bg.jpg (bg-cover · bg-center · 크롭 허용).
//   · 이미지 원본은 한국어 텍스트가 하드코딩된 인포그래픽 →
//     전면 균일 그라디언트 스크림(네이비 상→하 진하게)으로 판독 불가 수준까지 가라앉힘.
//   · 정보 텍스트는 전부 코드 오버레이(5로케일). 로케일별 이미지 불필요.
//   · 지점별 뱃지 스크림 없음. WCAG AA 이상 대비 유지.
//
// 오버레이:
//   상단: eyebrow "ACCESS HUB" + 헤드라인 + 서브 (5로케일)
//   중하단: 목적지 6칩 (서울 13–17분 GTX-A · 김포 9분 · KINTEX 15분 ·
//           DMZ 30분 · 호수공원 5분 · 인천공항 직결) + 서울 세부 1줄
//           (홍대 20 · 경복궁 30 · 강남 40 · 성수 1h)
//   하단: 강점 4항목 + STAY IN GOYANG. EXPERIENCE MORE OF KOREA. (영문 고정)
//   시간 숫자는 골드 강조 (#ffe98b).
//
// 모바일: 배경 유지, 세로 스택으로 잘림 없이. Ken Burns/애니메이션 없음
// (필요 시 prefers-reduced-motion 자동 대응 필요 없음 — 정적 오버레이).
//
// 무접촉: DB / card·hero·badge 자산 / 다른 섹션 / messages/*.json. 판매 소구어 0.

import {
  Building2,
  Landmark,
  Mountain,
  Plane,
  Sparkles,
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
    subsInline: string; // "홍대 20 · 경복궁 30 · 강남 40 · 성수 1h" — 로케일별 완성문
    subsPrefix: string; // "Seoul details" 류 라벨
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

const EYEBROW = "ACCESS HUB";
const CLOSER = "STAY IN GOYANG. EXPERIENCE MORE OF KOREA.";

const COPY: Record<LocaleKey, Copy> = {
  ko: {
    head: "가장 가까운 곳에서 만나는 가장 특별한 경험",
    sub: "공항·서울·DMZ·KINTEX를 가장 빠르게 잇는 대한민국 관문 도시",
    caption:
      "서울 13–17분(GTX-A) · 김포공항 9분(대곡역 기준) · 파주 DMZ 30분 · 인천공항 직결",
    seoul: {
      label: "서울",
      mainLine: "13–17분 GTX-A",
      subsPrefix: "서울 상세",
      subsInline: "홍대 20분 · 경복궁 30분 · 강남 40분 · 성수 1시간",
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
      mainLine: "13–17 min via GTX-A",
      subsPrefix: "Seoul in detail",
      subsInline:
        "Hongdae 20 min · Gyeongbokgung 30 min · Gangnam 40 min · Seongsu 1 hr",
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
      mainLine: "13–17分 GTX-A",
      subsPrefix: "ソウル詳細",
      subsInline: "弘大 20分 · 景福宮 30分 · 江南 40分 · 聖水 1時間",
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
      mainLine: "13–17分钟 GTX-A",
      subsPrefix: "首尔详情",
      subsInline: "弘大 20分钟 · 景福宫 30分钟 · 江南 40分钟 · 圣水 1小时",
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
      mainLine: "13–17分鐘 GTX-A",
      subsPrefix: "首爾詳情",
      subsInline: "弘大 20分鐘 · 景福宮 30分鐘 · 江南 40分鐘 · 聖水 1小時",
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

type ChipSpec = {
  key: "seoul" | "kintex" | "dmz" | "lake" | "gimpo" | "incheon";
  icon: typeof Plane;
};
// 6칩 진열 순서 (허브에서 시작해 서쪽·북쪽·남쪽으로 균형있게).
const CHIPS: ChipSpec[] = [
  { key: "seoul", icon: Landmark },
  { key: "kintex", icon: Building2 },
  { key: "dmz", icon: Mountain },
  { key: "lake", icon: Trees },
  { key: "gimpo", icon: Plane },
  { key: "incheon", icon: Plane },
];

function ChipRow({ copy }: { copy: Copy }) {
  return (
    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {CHIPS.map(({ key, icon: Icon }) => {
        const label = key === "seoul" ? copy.seoul.label : copy.nodes[key].label;
        const time =
          key === "seoul" ? copy.seoul.mainLine : copy.nodes[key].time;
        return (
          <div
            key={key}
            className="flex items-center gap-2.5 rounded-xl border border-white/12 bg-black/35 px-3.5 py-2.5 backdrop-blur-sm"
          >
            <Icon
              className="h-4 w-4 shrink-0 text-[#ffb58f]"
              aria-hidden="true"
            />
            <div className="min-w-0 flex-1 truncate text-sm font-semibold text-white">
              {label}
            </div>
            <div className="shrink-0 text-sm font-black tracking-tight text-[#ffe98b] sm:text-base">
              {time}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function AccessHubSection({ locale }: { locale: string }) {
  const active: LocaleKey = (
    LOCALES.includes(locale as LocaleKey) ? locale : "ko"
  ) as LocaleKey;
  const copy = COPY[active];

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12">
      <div
        className="relative overflow-hidden rounded-[32px] shadow-[0_28px_70px_rgba(8,14,26,0.35)] sm:rounded-[40px]"
        style={{
          backgroundImage: "url('/images/access/access-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* 균일 스크림 (네이비 상→하 진하게) —
            이미지 자체 텍스트·수치는 판독 불가 수준으로 가라앉히고
            오버레이 흰색 텍스트 WCAG AA 대비를 확보. */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(8,14,26,0.86) 0%, rgba(14,28,53,0.90) 45%, rgba(8,14,26,0.94) 100%)",
          }}
        />

        {/* 배경 글로우 (스크림 위에서 미묘) */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full bg-[#ffe98b]/8 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-72 w-72 rounded-full bg-[#ffb58f]/8 blur-3xl" />

        <div className="relative p-6 sm:p-8 lg:p-10">
          {/* 헤더 */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#ffe98b]/95">
              {EYEBROW}
            </div>
            <h2 className="mt-2 max-w-3xl text-2xl font-black leading-tight tracking-[-0.03em] text-white sm:text-3xl lg:text-4xl">
              {copy.head}
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-white/85 sm:text-base">
              {copy.sub}
            </p>
          </div>

          {/* 6 목적지 칩 */}
          <div className="mt-6 sm:mt-7">
            <ChipRow copy={copy} />
          </div>

          {/* 서울 세부 인라인 */}
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-xl border border-white/10 bg-black/25 px-3.5 py-2 text-xs text-white/85 backdrop-blur-sm sm:text-sm">
            <div className="flex items-center gap-1.5">
              <Sparkles
                className="h-3.5 w-3.5 text-[#ffe98b]"
                aria-hidden="true"
              />
              <span className="font-bold uppercase tracking-[0.14em] text-[#ffe98b]">
                {copy.seoul.subsPrefix}
              </span>
            </div>
            <span className="text-white/85">{copy.seoul.subsInline}</span>
          </div>

          {/* 하단 강점 4항목 + 마감 카피 */}
          <div className="mt-6 grid gap-3 border-t border-white/12 pt-5 sm:grid-cols-2 lg:grid-cols-4">
            {copy.strengths.map((s, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#ffe98b]/50 bg-[#ffe98b]/12 text-[10px] font-bold text-[#ffe98b]">
                  {i + 1}
                </div>
                <div className="text-[13px] font-medium leading-snug text-white/90 sm:text-sm">
                  {s}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 text-center">
            <div className="inline-block text-[11px] font-bold uppercase tracking-[0.28em] text-[#ffb58f] sm:text-xs">
              {CLOSER}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
