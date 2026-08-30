// components/home/WeeklyExhibitionsSection.tsx
// 홈 · 이번 주 전시·축제·이벤트 (오더 #R3-2).
//
// 위치: CuratedGridSection 직후.
// 데이터: data/ticket-booking.ts 재사용 (읽기만). 3 슬롯 그룹 필터:
//   · 전시 (EXHIBITION) → category === "exhibition"
//   · 축제 (FESTIVAL)   → category === "festival"
//   · 이벤트 (EVENT)    → category ∈ {concert, k-pop, family} (통합)
//
// 각 슬롯에서 isCurrentOrUpcoming 통과한 첫 매치를 카드로 렌더.
// 슬롯별 데이터 0건이면 그 카드만 숨김 (다른 카드는 유지).
// 3 슬롯 모두 0건이면 섹션 자체 return null.
//
// 태그색: 6카테고리 팔레트 재사용 (EMBLEM_COLORS):
//   · 전시 → culture
//   · 축제 → kculture
//   · 이벤트 → family
//
// CTA (5로케일, 슬롯별 개별): "전시 후 / 축제 후 / 이벤트 후 이렇게 즐기세요 →"
// 앵커: 홈 내 #after-kintex-bridge (같은 페이지 스크롤).
//
// 그리드: 활성 카드 수(1/2/3)에 따라 자동 축소.
//
// 무접촉: data/ticket-booking.ts (읽기만) · messages/*.json (in-component 유지).

import { EMBLEM_COLORS, type EmblemCategory } from "@/components/emblem/colors";
import {
  ticketProducts,
  type TicketProduct,
  type TicketLocale,
} from "@/data/ticket-booking";

type LocaleKey = "ko" | "en" | "ja" | "zh-CN" | "zh-TW";
const LOCALES: LocaleKey[] = ["ko", "en", "ja", "zh-CN", "zh-TW"];

type SlotKey = "exhibition" | "festival" | "event";

const EYEBROW: Record<LocaleKey, string> = {
  ko: "이번 주 전시·축제·이벤트",
  en: "This Week's Exhibitions, Festivals & Events",
  ja: "今週の展示・フェスティバル・イベント",
  "zh-CN": "本周展览·节庆·活动",
  "zh-TW": "本週展覽·節慶·活動",
};

const HEADLINE: Record<LocaleKey, string> = {
  ko: "이번 주 고양일산에서 만나는 전시·축제·이벤트",
  en: "Exhibitions, festivals and events in Goyang-Ilsan this week",
  ja: "今週、高陽・一山で出会う展示・フェスティバル・イベント",
  "zh-CN": "本周在高阳·一山遇见的展览·节庆·活动",
  "zh-TW": "本週在高陽·一山遇見的展覽·節慶·活動",
};

/** 슬롯별 카드 태그 라벨 — 5로케일 공통 영문 (지시). */
const TAG_LABEL: Record<SlotKey, string> = {
  exhibition: "EXHIBITION",
  festival: "FESTIVAL",
  event: "EVENT",
};

/** 슬롯별 accent 색 = EMBLEM_COLORS[매핑]. */
const SLOT_COLOR_KEY: Record<SlotKey, EmblemCategory> = {
  exhibition: "culture",
  festival: "kculture",
  event: "family",
};

/** 슬롯별 CTA 5로케일. */
const BRIDGE_CTA: Record<SlotKey, Record<LocaleKey, string>> = {
  exhibition: {
    ko: "전시 후 이렇게 즐기세요 →",
    en: "After the show, do this →",
    ja: "展示のあとはこう楽しむ →",
    "zh-CN": "展览之后这样玩 →",
    "zh-TW": "展覽之後這樣玩 →",
  },
  festival: {
    ko: "축제 후 이렇게 즐기세요 →",
    en: "After the festival, do this →",
    ja: "フェスティバルのあとはこう楽しむ →",
    "zh-CN": "节庆之后这样玩 →",
    "zh-TW": "節慶之後這樣玩 →",
  },
  event: {
    ko: "이벤트 후 이렇게 즐기세요 →",
    en: "After the event, do this →",
    ja: "イベントのあとはこう楽しむ →",
    "zh-CN": "活动之后这样玩 →",
    "zh-TW": "活動之後這樣玩 →",
  },
};

/** 이벤트 슬롯의 통합 필터 대상 카테고리. */
const EVENT_CATEGORIES = new Set(["concert", "k-pop", "family"]);

/**
 * endDate 지난 항목 자동 숨김 훅.
 * 현재 TicketProduct 에 endDate 필드 없음 → 필드 확장 시 즉시 필터 활성.
 * dateText 자유 텍스트 파싱은 오탐 위험 → 스킵.
 */
function isCurrentOrUpcoming(item: TicketProduct): boolean {
  const withEndDate = item as TicketProduct & { endDate?: string };
  if (!withEndDate.endDate) return true;
  const end = Date.parse(withEndDate.endDate);
  if (Number.isNaN(end)) return true;
  return end >= Date.now();
}

/** 슬롯별 첫 매치 아이템 픽. */
function pickForSlot(slot: SlotKey): TicketProduct | null {
  const matches = ticketProducts
    .filter((t) => {
      if (slot === "exhibition") return t.category === "exhibition";
      if (slot === "festival") return t.category === "festival";
      return EVENT_CATEGORIES.has(t.category);
    })
    .filter(isCurrentOrUpcoming);
  return matches[0] ?? null;
}

function pickLocalized(item: TicketProduct, locale: LocaleKey) {
  if (locale === "ko") {
    return { venue: item.venue, tags: item.tags };
  }
  const t = item.translations?.[locale as TicketLocale];
  return {
    venue: t?.venue ?? item.venue,
    tags: t?.tags ?? item.tags,
  };
}

type ResolvedCard = {
  slot: SlotKey;
  item: TicketProduct;
};

export default function WeeklyExhibitionsSection({
  locale,
}: {
  locale: string;
}) {
  const active: LocaleKey = (
    LOCALES.includes(locale as LocaleKey) ? locale : "ko"
  ) as LocaleKey;

  const cards: ResolvedCard[] = (["exhibition", "festival", "event"] as SlotKey[])
    .map((slot) => {
      const item = pickForSlot(slot);
      return item ? { slot, item } : null;
    })
    .filter((c): c is ResolvedCard => c !== null);

  if (cards.length === 0) return null;

  // 활성 카드 수에 따른 그리드 (tailwind 정적 클래스라 조건별 분기).
  const gridClass =
    cards.length === 3
      ? "sm:grid-cols-2 lg:grid-cols-3"
      : cards.length === 2
        ? "sm:grid-cols-2"
        : "mx-auto max-w-md";

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-500">
        {EYEBROW[active]}
      </div>
      <h2 className="mt-2 max-w-3xl text-xl font-black leading-tight tracking-[-0.03em] text-slate-950 sm:text-2xl">
        {HEADLINE[active]}
      </h2>

      <div className={`mt-8 grid gap-6 ${gridClass}`}>
        {cards.map(({ slot, item }) => {
          const color = EMBLEM_COLORS[SLOT_COLOR_KEY[slot]];
          const tagLabel = TAG_LABEL[slot];
          const cta = BRIDGE_CTA[slot][active];
          const { venue, tags } = pickLocalized(item, active);
          return (
            <article
              key={slot}
              className="flex h-full flex-col overflow-hidden rounded-[20px] border border-slate-200/70 bg-white shadow-[0_10px_30px_rgba(16,32,58,0.08)]"
              style={{ borderTop: `3px solid ${color}` }}
            >
              <div className="flex flex-1 flex-col p-6">
                <div
                  className="text-[10px] font-bold uppercase tracking-[0.24em]"
                  style={{ color }}
                >
                  {tagLabel}
                </div>
                <h3 className="mt-2 text-lg font-black leading-snug tracking-[-0.02em] text-slate-950">
                  {item.title}
                </h3>
                <div className="mt-2 text-xs leading-relaxed text-slate-500">
                  <div>{item.dateText}</div>
                  <div className="mt-0.5">{venue}</div>
                </div>
                {tags && tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold"
                        style={{
                          border: `1px solid ${color}55`,
                          color,
                          background: `${color}12`,
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <a
                  href="#after-kintex-bridge"
                  className="mt-auto inline-flex items-center pt-5 text-sm font-bold text-slate-950 transition hover:text-[var(--gold)]"
                >
                  {cta}
                </a>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
