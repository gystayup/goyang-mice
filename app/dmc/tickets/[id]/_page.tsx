// /[locale]/dmc/tickets/[id] — 오더 #D18 visitlondon 예매형 레이아웃.
//
// 진화:
//   · #C56 [1]: 초기 안내형 페이지 (탭 8종 · 세로 나열).
//   · #C57 [3]: 최하단 예매 CTA 복구 (기존 Toss reservation 재사용).
//   · #D18: visitlondon(theatre.visitlondon.com) 예매형 2단 레이아웃 전환.
//     좌측 본문(히어로·정보블록·현지어 장소명·4탭) + 우측 sticky 예매 박스(캘린더·CTA).
//     새 결제 시스템 신설 금지 — 기존 /products/ticket-agency-platform/reservation?ticket={id} 재사용.
//     회차·잔여 상태 데이터 미보유 → 캘린더는 dateText~endDate 범위를 "여유"로 표시,
//     선택 시 "회차·좌석은 예매 화면에서" 안내.
//
// 데이터: readTicketCatalog() (Supabase 우선 · 실패 시 정적 폴백).
// 5로케일 (ko/en/ja/zh-CN/zh-TW) — ko 원문 + translations 병합.

import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Calendar, Clock, MapPin, Ticket as TicketIcon, Users } from "lucide-react";

import Shell from "@/components/layout/Shell";
import { Link } from "@/lib/navigation";
import TicketBookingBox from "@/components/tickets/TicketBookingBox";
import TicketDetailTabs from "@/components/tickets/TicketDetailTabs";
import { readTicketCatalog } from "@/lib/ticket-catalog-db";
import type {
  TicketLocale,
  TicketProduct,
  TicketOption,
} from "@/data/ticket-booking";

export type PageLocale = "ko" | "en" | "ja" | "zh-CN" | "zh-TW";

type PageCopy = {
  eyebrow: string;
  venueKoreanLabel: string;
  categoryLabel: string;
  ticketTypeLabel: string;
  languageLabel: string;
  languageFallback: string;
  contactCta: string;
  backCta: string;
  durationLabel: string;
  ageLabel: string;
  dateLabel: string;
  venueLabel: string;
  bookingLabel: string;
};

const COPY: Record<PageLocale, PageCopy> = {
  ko: {
    eyebrow: "GOYANG TICKETS",
    venueKoreanLabel: "장소 (한국어)",
    categoryLabel: "카테고리",
    ticketTypeLabel: "티켓 형태",
    languageLabel: "언어",
    languageFallback: "한국어",
    contactCta: "문의하기",
    backCta: "티켓 목록으로",
    durationLabel: "관람 시간",
    ageLabel: "관람 연령",
    dateLabel: "일정",
    venueLabel: "장소",
    bookingLabel: "예매하기",
  },
  en: {
    eyebrow: "GOYANG TICKETS",
    venueKoreanLabel: "Venue (Korean)",
    categoryLabel: "Category",
    ticketTypeLabel: "Ticket type",
    languageLabel: "Language",
    languageFallback: "Korean",
    contactCta: "Contact us",
    backCta: "Back to tickets",
    durationLabel: "Running time",
    ageLabel: "Age",
    dateLabel: "Dates",
    venueLabel: "Venue",
    bookingLabel: "Book Now",
  },
  ja: {
    eyebrow: "GOYANG TICKETS",
    venueKoreanLabel: "会場 (韓国語)",
    categoryLabel: "カテゴリ",
    ticketTypeLabel: "チケット形態",
    languageLabel: "言語",
    languageFallback: "韓国語",
    contactCta: "お問い合わせ",
    backCta: "チケット一覧へ",
    durationLabel: "上演時間",
    ageLabel: "観覧年齢",
    dateLabel: "日程",
    venueLabel: "会場",
    bookingLabel: "予約する",
  },
  "zh-CN": {
    eyebrow: "GOYANG TICKETS",
    venueKoreanLabel: "场地 (韩语)",
    categoryLabel: "类别",
    ticketTypeLabel: "票种",
    languageLabel: "语言",
    languageFallback: "韩语",
    contactCta: "咨询",
    backCta: "返回门票列表",
    durationLabel: "演出时长",
    ageLabel: "观演年龄",
    dateLabel: "日程",
    venueLabel: "场地",
    bookingLabel: "立即预约",
  },
  "zh-TW": {
    eyebrow: "GOYANG TICKETS",
    venueKoreanLabel: "場地 (韓語)",
    categoryLabel: "類別",
    ticketTypeLabel: "票種",
    languageLabel: "語言",
    languageFallback: "韓語",
    contactCta: "諮詢",
    backCta: "返回門票列表",
    durationLabel: "演出時長",
    ageLabel: "觀演年齡",
    dateLabel: "日程",
    venueLabel: "場地",
    bookingLabel: "立即預約",
  },
};

function pickBadge(t: TicketProduct, locale: PageLocale): string {
  if (locale === "ko") return t.badge;
  return t.translations?.[locale as TicketLocale]?.badge ?? t.badge;
}
function pickVenue(t: TicketProduct, locale: PageLocale): string {
  if (locale === "ko") return t.venue;
  return t.translations?.[locale as TicketLocale]?.venue ?? t.venue;
}
function pickTags(t: TicketProduct, locale: PageLocale): string[] {
  if (locale === "ko") return t.tags ?? [];
  return t.translations?.[locale as TicketLocale]?.tags ?? t.tags ?? [];
}
function pickOptionLabel(t: TicketProduct, opt: TicketOption, locale: PageLocale): string {
  if (locale === "ko") return opt.label;
  const tr = t.translations?.[locale as TicketLocale]?.options?.find((o) => o.id === opt.id);
  return tr?.label ?? opt.label;
}
function pickOptionBenefits(t: TicketProduct, opt: TicketOption, locale: PageLocale): string[] {
  if (locale === "ko") return opt.benefits ?? [];
  const tr = t.translations?.[locale as TicketLocale]?.options?.find((o) => o.id === opt.id);
  return tr?.benefits ?? opt.benefits ?? [];
}
async function loadTicket(id: string): Promise<TicketProduct | null> {
  const list = await readTicketCatalog();
  return list.find((t) => t.id === id) ?? null;
}

export async function getTicketDetailMetadata(
  id: string,
  locale: PageLocale,
): Promise<Metadata> {
  const t = await loadTicket(id);
  if (!t) return { title: "티켓 상세" };
  return {
    title: t.title,
    description: t.summary,
    alternates: { canonical: `/${locale}/dmc/tickets/${id}` },
  };
}

export default async function DmcTicketDetailPage({
  id,
  locale = "ko",
}: {
  id: string;
  locale?: PageLocale;
}) {
  const t = await loadTicket(id);
  if (!t) notFound();

  const copy = COPY[locale];
  const badge = pickBadge(t, locale);
  const venueLocalized = pickVenue(t, locale);
  const venueOriginal = t.venue;
  const showKoreanVenueCard = locale !== "ko" && venueLocalized !== venueOriginal;
  const tags = pickTags(t, locale);

  const optionRows = (t.options ?? []).map((opt) => ({
    opt,
    label: pickOptionLabel(t, opt, locale),
    benefits: pickOptionBenefits(t, opt, locale),
  }));

  const prices = optionRows.map((r) => r.opt.price).filter((p) => typeof p === "number" && p > 0);
  const minPrice = prices.length > 0 ? Math.min(...prices) : null;

  // 오더 #D18 [3]-A: 기존 Toss reservation 흐름 재사용 (C57-B 동일 패턴).
  //   hub product 'ticket-agency-platform' 로드 후 ?ticket=<id> 로 실제 티켓 주입.
  const bookingUrl = `/${locale}/products/ticket-agency-platform/reservation?ticket=${t.id}`;

  return (
    <Shell>
      <article className="bg-white text-[#232322]">
        <section className="mx-auto max-w-[1200px] px-4 pb-10 pt-8 sm:px-6 sm:pt-12">
          {/* Eyebrow */}
          <div className="text-[11px] font-bold uppercase tracking-[0.28em] text-[var(--accent)]">
            {copy.eyebrow}
          </div>

          {/* 2단 레이아웃 (오더 D18 [1]+[2]) */}
          <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_360px] lg:gap-10">
            {/* ─── 좌측 본문 ─── */}
            <div className="min-w-0">
              {/* 히어로 + 타이틀 (포스터 좌 · 텍스트 우) */}
              <div className="grid gap-6 sm:grid-cols-[minmax(0,300px)_1fr] sm:gap-8">
                <div className="w-full">
                  {t.imageUrl ? (
                    <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-slate-100">
                      <Image
                        src={t.imageUrl}
                        alt={t.title}
                        fill
                        className="object-cover object-center"
                        sizes="(max-width: 640px) 100vw, 300px"
                        priority
                      />
                    </div>
                  ) : (
                    <div
                      aria-hidden="true"
                      className={`relative flex aspect-[3/4] w-full items-end overflow-hidden rounded-2xl bg-gradient-to-br ${t.imageTone} p-5`}
                    >
                      <span className="text-3xl font-black uppercase tracking-[0.14em] text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.35)]">
                        {t.posterLabel}
                      </span>
                    </div>
                  )}
                  {t.credit ? (
                    <p className="mt-2 text-[11px] leading-relaxed text-slate-500">{t.credit}</p>
                  ) : null}
                </div>

                <div className="flex flex-col">
                  {badge ? (
                    <div className="text-[11px] font-bold uppercase tracking-[0.24em] text-[var(--accent)]">
                      {badge}
                    </div>
                  ) : null}
                  <h1 className="mt-2 text-2xl font-black leading-tight tracking-[-0.03em] sm:text-3xl lg:text-[34px]">
                    {t.title}
                  </h1>
                  {t.subtitle ? (
                    <p className="mt-3 text-sm text-slate-600 sm:text-base">{t.subtitle}</p>
                  ) : null}

                  {tags.length > 0 ? (
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <li
                          key={tag}
                          className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700"
                        >
                          {tag}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </div>

              {/* 아이콘 정보 블록 (오더 D18 [1] · 2열 그리드) */}
              <dl className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {t.dateText ? (
                  <InfoCell icon={Calendar} label={copy.dateLabel} value={t.dateText} />
                ) : null}
                <InfoCell icon={MapPin} label={copy.venueLabel} value={venueLocalized} />
                {t.duration ? (
                  <InfoCell icon={Clock} label={copy.durationLabel} value={t.duration} />
                ) : null}
                {t.ageLimit ? (
                  <InfoCell icon={Users} label={copy.ageLabel} value={t.ageLimit} />
                ) : null}
                <InfoCell
                  icon={TicketIcon}
                  label={copy.ticketTypeLabel}
                  value={t.category.toUpperCase()}
                />
                <InfoCell
                  icon={TicketIcon}
                  label={copy.languageLabel}
                  value={copy.languageFallback}
                />
              </dl>

              {/* 현지어 장소명 카드 (non-KO 로케일에서만) */}
              {showKoreanVenueCard ? (
                <div
                  className="mt-6 rounded-2xl border border-slate-200 bg-[#faf7f2] p-4"
                >
                  <div className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-500">
                    {copy.venueKoreanLabel}
                  </div>
                  <div className="mt-1 text-base font-bold text-[#232322]">
                    {venueOriginal}
                  </div>
                </div>
              ) : null}

              {/* 탭 (공연정보 · 일정·좌석 · 갤러리 · 오시는 길) */}
              <TicketDetailTabs ticket={t} locale={locale} options={optionRows} />
            </div>

            {/* ─── 우측 sticky 예매 박스 (오더 D18 [2]) ─── */}
            <div className="lg:mt-0">
              <TicketBookingBox
                locale={locale}
                dateText={t.dateText}
                endDate={t.endDate}
                minPrice={minPrice}
                bookingUrl={bookingUrl}
                bookingLabel={copy.bookingLabel}
              />
            </div>
          </div>
        </section>

        {/* 하단 back / 문의 */}
        <section className="bg-[#faf7f2]">
          <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-3 px-4 py-8 sm:flex-row sm:justify-between sm:px-6">
            <Link
              href="/dmc"
              className="text-sm font-semibold text-slate-700 underline-offset-4 hover:underline"
            >
              ← {copy.backCta}
            </Link>
            <Link
              href="/contact"
              className="text-sm font-semibold text-slate-600 underline-offset-4 hover:underline"
            >
              {copy.contactCta}
            </Link>
          </div>
        </section>
      </article>
    </Shell>
  );
}

function InfoCell({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Calendar;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4">
      <span
        aria-hidden="true"
        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
        style={{ background: "rgba(226, 62, 46, 0.10)", color: "var(--accent)" }}
      >
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
          {label}
        </div>
        <div className="mt-0.5 text-sm font-bold text-[#232322]">{value}</div>
      </div>
    </div>
  );
}
