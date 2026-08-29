// components/home/WeeklyExhibitionsSection.tsx
// 홈 · 이번 주 전시 행 (오더 #R3-[2]).
//
// 위치: CuratedGridSection 직후.
// 데이터: data/ticket-booking.ts 재사용 (읽기만). category === "exhibition" 필터.
// 태그색: 6카테고리 체계 재사용 — 전시는 culture 축으로 매핑,
//   EMBLEM_COLORS.culture 를 카드 accent + 태그 pill 색으로 사용.
//
// 노출 규칙:
//   · exhibition 카테고리 0건 → 섹션 자체 return null (행 숨김).
//   · endDate 지난 것 자동 숨김 — TicketProduct 에 endDate 필드가 아직 없으므로
//     로직 훅만 준비 (예약된 필드 활성화 시 즉시 동작).
//
// CTA: "전시 후 이렇게 즐기세요 →" — 홈 내 앵커 #after-kintex-bridge 로 스크롤.
//
// 무접촉: data/ticket-booking.ts (읽기만).

import { EMBLEM_COLORS } from "@/components/emblem/colors";
import { ticketProducts, type TicketProduct, type TicketLocale } from "@/data/ticket-booking";

type LocaleKey = "ko" | "en" | "ja" | "zh-CN" | "zh-TW";
const LOCALES: LocaleKey[] = ["ko", "en", "ja", "zh-CN", "zh-TW"];

const EYEBROW: Record<LocaleKey, string> = {
  ko: "이번 주 전시",
  en: "This Week's Exhibitions",
  ja: "今週の展示",
  "zh-CN": "本周展览",
  "zh-TW": "本週展覽",
};

const HEADLINE: Record<LocaleKey, string> = {
  ko: "이번 주 고양일산에서 만나는 전시",
  en: "Exhibitions in Goyang-Ilsan this week",
  ja: "今週、高陽・一山で出会う展示",
  "zh-CN": "本周在高阳·一山遇见的展览",
  "zh-TW": "本週在高陽·一山遇見的展覽",
};

const BRIDGE_CTA: Record<LocaleKey, string> = {
  ko: "전시 후 이렇게 즐기세요 →",
  en: "After the show, do this →",
  ja: "展示のあとはこう楽しむ →",
  "zh-CN": "展览之后这样玩 →",
  "zh-TW": "展覽之後這樣玩 →",
};

const EXHIBITION_TAG: Record<LocaleKey, string> = {
  ko: "EXHIBITION",
  en: "EXHIBITION",
  ja: "EXHIBITION",
  "zh-CN": "EXHIBITION",
  "zh-TW": "EXHIBITION",
};

/**
 * endDate 지난 전시 자동 숨김 훅.
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

export default function WeeklyExhibitionsSection({
  locale,
}: {
  locale: string;
}) {
  const active: LocaleKey = (
    LOCALES.includes(locale as LocaleKey) ? locale : "ko"
  ) as LocaleKey;

  const exhibitions = ticketProducts
    .filter((t) => t.category === "exhibition")
    .filter(isCurrentOrUpcoming)
    .slice(0, 5);

  if (exhibitions.length === 0) return null;

  const cultureColor = EMBLEM_COLORS.culture;

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-500">
        {EYEBROW[active]}
      </div>
      <h2 className="mt-2 max-w-3xl text-xl font-black leading-tight tracking-[-0.03em] text-slate-950 sm:text-2xl">
        {HEADLINE[active]}
      </h2>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {exhibitions.map((ex) => {
          const { venue, tags } = pickLocalized(ex, active);
          return (
            <article
              key={ex.id}
              className="flex h-full flex-col overflow-hidden rounded-[20px] border border-slate-200/70 bg-white shadow-[0_10px_30px_rgba(16,32,58,0.08)]"
              style={{ borderTop: `3px solid ${cultureColor}` }}
            >
              <div className="flex flex-1 flex-col p-6">
                <div
                  className="text-[10px] font-bold uppercase tracking-[0.24em]"
                  style={{ color: cultureColor }}
                >
                  {EXHIBITION_TAG[active]}
                </div>
                <h3 className="mt-2 text-lg font-black leading-snug tracking-[-0.02em] text-slate-950">
                  {ex.title}
                </h3>
                <div className="mt-2 text-xs leading-relaxed text-slate-500">
                  <div>{ex.dateText}</div>
                  <div className="mt-0.5">{venue}</div>
                </div>
                {tags && tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold"
                        style={{
                          border: `1px solid ${cultureColor}55`,
                          color: cultureColor,
                          background: `${cultureColor}12`,
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
                  {BRIDGE_CTA[active]}
                </a>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
