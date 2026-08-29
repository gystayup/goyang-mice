// components/home/AfterKintexBridgeSection.tsx
// 홈 · AFTER KINTEX 브릿지 섹션 (오더 #R3-[1]).
//
// 위치: ACCESS HUB 아래, SocialSection 위 (HomePageContent 참조).
// 서사: KINTEX 전시 종료 → 서울 대신 고양일산에서 이어지는 하루.
//
// 5스텝 타임라인 (동선 = /best/[category] 진입):
//   01 아침       · 일산호수공원 · walk
//   02 낮         · KINTEX      · culture
//   03 저녁       · 라페스타     · food
//   04 밤         · 호텔        · family (가족 체류 축)
//   05 다음날     · 행주산성    · history
//
// 앵커 id="after-kintex-bridge" — WeeklyExhibitions 카드의
// "전시 후 이렇게 즐기세요 →" CTA 가 이 앵커로 스크롤.
//
// 색: R2 토큰 (var(--charcoal) 배경 + var(--gold) 포인트) · 카테고리색은
// EMBLEM_COLORS 재사용 (편애하지 않는 중립 프리미엄).
//
// 애니메이션 없음 → prefers-reduced-motion 자동 만족.
// 모바일: 세로 스택 · 데스크톱(lg+): 5열 가로 타임라인.

import {
  EMBLEM_COLORS,
  type EmblemCategory,
  type EmblemLocale,
} from "@/components/emblem/colors";
import { CATEGORY_LABEL } from "@/data/curated-categories";
import { Link } from "@/lib/navigation";

type LocaleKey = EmblemLocale;
const LOCALES: LocaleKey[] = ["ko", "en", "ja", "zh-CN", "zh-TW"];

const EYEBROW = "AFTER KINTEX";

const HEADLINE: Record<LocaleKey, string> = {
  ko: "전시가 끝나도, 하루는 계속됩니다",
  en: "The show ends. Your day doesn't have to.",
  ja: "展示が終わっても、一日は続きます",
  "zh-CN": "展览结束了，一天还没结束",
  "zh-TW": "展覽結束了，一天還沒結束",
};

const SUB: Record<LocaleKey, string> = {
  ko: "서울로 돌아가지 마세요 — 고양일산에서 이어지는 하루",
  en: "Don't rush back to Seoul — the day in Goyang-Ilsan is just getting started.",
  ja: "ソウルに戻らないで — 高陽・一山で続く一日",
  "zh-CN": "别急着回首尔 — 高阳·一山，一天才刚刚开始",
  "zh-TW": "別急著回首爾 — 高陽·一山，一天才剛剛開始",
};

type TimeSlot = "morning" | "afternoon" | "evening" | "night" | "next-day";

const TIME_LABEL: Record<LocaleKey, Record<TimeSlot, string>> = {
  ko: {
    morning: "아침",
    afternoon: "낮",
    evening: "저녁",
    night: "밤",
    "next-day": "다음날",
  },
  en: {
    morning: "Morning",
    afternoon: "Afternoon",
    evening: "Evening",
    night: "Night",
    "next-day": "Next day",
  },
  ja: {
    morning: "朝",
    afternoon: "昼",
    evening: "夕方",
    night: "夜",
    "next-day": "翌日",
  },
  "zh-CN": {
    morning: "上午",
    afternoon: "下午",
    evening: "傍晚",
    night: "夜晚",
    "next-day": "次日",
  },
  "zh-TW": {
    morning: "上午",
    afternoon: "下午",
    evening: "傍晚",
    night: "夜晚",
    "next-day": "次日",
  },
};

type Step = {
  time: TimeSlot;
  place: Record<LocaleKey, string>;
  category: EmblemCategory;
};

const STEPS: Step[] = [
  {
    time: "morning",
    place: {
      ko: "일산호수공원",
      en: "Ilsan Lake Park",
      ja: "一山湖水公園",
      "zh-CN": "一山湖水公园",
      "zh-TW": "一山湖水公園",
    },
    category: "walk",
  },
  {
    time: "afternoon",
    place: {
      ko: "KINTEX",
      en: "KINTEX",
      ja: "KINTEX",
      "zh-CN": "KINTEX",
      "zh-TW": "KINTEX",
    },
    category: "culture",
  },
  {
    time: "evening",
    place: {
      ko: "라페스타",
      en: "La Festa",
      ja: "ラフェスタ",
      "zh-CN": "拉费斯塔",
      "zh-TW": "拉費斯塔",
    },
    category: "food",
  },
  {
    time: "night",
    place: {
      ko: "호텔",
      en: "Hotel",
      ja: "ホテル",
      "zh-CN": "酒店",
      "zh-TW": "飯店",
    },
    category: "family",
  },
  {
    time: "next-day",
    place: {
      ko: "행주산성",
      en: "Haengju Fortress",
      ja: "幸州山城",
      "zh-CN": "幸州山城",
      "zh-TW": "幸州山城",
    },
    category: "history",
  },
];

export default function AfterKintexBridgeSection({
  locale,
}: {
  locale: string;
}) {
  const active: LocaleKey = (
    LOCALES.includes(locale as LocaleKey) ? locale : "ko"
  ) as LocaleKey;

  return (
    <section
      id="after-kintex-bridge"
      className="mx-auto max-w-7xl scroll-mt-24 px-4 py-10 sm:px-6 sm:py-14"
    >
      <div className="rounded-[32px] bg-[var(--charcoal)] px-6 py-10 shadow-[0_28px_70px_rgba(35,35,34,0.35)] sm:rounded-[40px] sm:px-10 sm:py-14 lg:px-14">
        {/* Header */}
        <div>
          <div className="text-[11px] font-bold uppercase tracking-[0.28em] text-[var(--gold)]">
            {EYEBROW}
          </div>
          <h2 className="mt-3 max-w-3xl text-2xl font-black leading-tight tracking-[-0.03em] text-white sm:text-3xl lg:text-4xl">
            {HEADLINE[active]}
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/70 sm:text-base">
            {SUB[active]}
          </p>
        </div>

        {/* Timeline — sm 이하: 세로 스택 · lg+: 5열 가로 */}
        <ol className="mt-10 grid gap-3 sm:mt-14 lg:grid-cols-5 lg:gap-3">
          {STEPS.map((step, i) => {
            const color = EMBLEM_COLORS[step.category];
            const catLabel = CATEGORY_LABEL[active][step.category];
            const timeLabel = TIME_LABEL[active][step.time];
            const placeName = step.place[active];
            return (
              <li key={step.time} className="relative">
                <Link
                  href={`/best/${step.category}`}
                  className="group flex h-full items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.05] p-5 transition hover:border-[var(--gold)]/40 hover:bg-white/[0.08] lg:flex-col lg:items-start lg:gap-3"
                  aria-label={`${timeLabel} · ${placeName} · ${catLabel}`}
                >
                  {/* step number + time — 데스크톱은 상단 가로, 모바일은 좌측 세로 뱃지 */}
                  <div className="flex shrink-0 flex-col items-center gap-1 lg:w-full lg:flex-row lg:justify-between">
                    <span
                      className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-[11px] font-black lg:h-6 lg:w-6 lg:text-[10px]"
                      style={{ borderColor: color, color, background: `${color}18` }}
                    >
                      {`0${i + 1}`}
                    </span>
                    <span className="hidden text-[10px] font-bold uppercase tracking-[0.22em] text-white/55 lg:inline">
                      {timeLabel}
                    </span>
                  </div>

                  {/* 모바일 전용 시간 라벨 (원형 뱃지 옆) */}
                  <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/55 lg:hidden">
                    {timeLabel}
                  </div>

                  {/* 장소명 + 카테고리 라벨 */}
                  <div className="min-w-0 flex-1">
                    <div className="text-base font-black leading-tight text-white sm:text-lg">
                      {placeName}
                    </div>
                    <div
                      className="mt-1 text-[11px] font-bold uppercase tracking-[0.18em]"
                      style={{ color }}
                    >
                      {catLabel}
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
