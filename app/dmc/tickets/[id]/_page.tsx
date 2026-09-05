// /[locale]/dmc/tickets/[id] — 오더 #C56 [1] 티켓 상세 안내 라우트.
//
// 방침 (사장님 확정):
//   · 결제·예약 시스템 신설 금지. 안내형 페이지.
//   · 표시 항목은 data/ticket-booking.ts 의 기존 필드만 사용 (창작 금지).
//   · 5로케일 (ko/en/ja/zh-CN/zh-TW) — ko 원문 + translations 병합 (A안).
//   · 최하단 CTA = "문의하기" → /contact.
//
// 데이터: readTicketCatalog() (Supabase 우선 · DB 실패 시 정적 폴백).
// 렌더 필드: 포스터(imageUrl or 그라디언트+posterLabel) · badge · title · subtitle
//   · venue · dateText · duration · ageLimit · tags · options(label/price/benefits)
//   · summary · description · credit · tab* (있으면).

import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowRight, Calendar, Clock, MapPin, Users } from "lucide-react";

import Shell from "@/components/layout/Shell";
import { Link } from "@/lib/navigation";
import { readTicketCatalog } from "@/lib/ticket-catalog-db";
import type {
  TicketLocale,
  TicketProduct,
  TicketOption,
} from "@/data/ticket-booking";

export type PageLocale = "ko" | "en" | "ja" | "zh-CN" | "zh-TW";

type DetailCopy = {
  eyebrow: string;
  seatSection: string;
  benefitsLabel: string;
  aboutSection: string;
  noticeLabel: string;
  castingLabel: string;
  detailsLabel: string;
  priceLabel: string;
  discountLabel: string;
  usageLabel: string;
  venueLabel: string;
  cancellationLabel: string;
  contactCta: string;
  backCta: string;
  durationLabel: string;
  ageLabel: string;
};

const COPY: Record<PageLocale, DetailCopy> = {
  ko: {
    eyebrow: "GOYANG TICKETS",
    seatSection: "좌석 · 옵션",
    benefitsLabel: "포함 사항",
    aboutSection: "소개",
    noticeLabel: "관람 안내",
    castingLabel: "캐스팅 / 구성",
    detailsLabel: "상세 안내",
    priceLabel: "가격 안내",
    discountLabel: "할인 안내",
    usageLabel: "이용 안내",
    venueLabel: "장소 안내",
    cancellationLabel: "취소 · 환불",
    contactCta: "문의하기",
    backCta: "티켓 목록으로",
    durationLabel: "관람 시간",
    ageLabel: "관람 연령",
  },
  en: {
    eyebrow: "GOYANG TICKETS",
    seatSection: "Seats & Options",
    benefitsLabel: "Included",
    aboutSection: "About",
    noticeLabel: "Notice",
    castingLabel: "Cast / Program",
    detailsLabel: "Details",
    priceLabel: "Pricing",
    discountLabel: "Discounts",
    usageLabel: "Usage Info",
    venueLabel: "Venue",
    cancellationLabel: "Cancellation & Refund",
    contactCta: "Contact us",
    backCta: "Back to tickets",
    durationLabel: "Running time",
    ageLabel: "Age",
  },
  ja: {
    eyebrow: "GOYANG TICKETS",
    seatSection: "座席・オプション",
    benefitsLabel: "含まれる特典",
    aboutSection: "紹介",
    noticeLabel: "観覧のご案内",
    castingLabel: "キャスト / 構成",
    detailsLabel: "詳細",
    priceLabel: "料金案内",
    discountLabel: "割引案内",
    usageLabel: "利用案内",
    venueLabel: "会場案内",
    cancellationLabel: "キャンセル・返金",
    contactCta: "お問い合わせ",
    backCta: "チケット一覧へ",
    durationLabel: "上演時間",
    ageLabel: "観覧年齢",
  },
  "zh-CN": {
    eyebrow: "GOYANG TICKETS",
    seatSection: "座位 · 选项",
    benefitsLabel: "包含内容",
    aboutSection: "简介",
    noticeLabel: "观演须知",
    castingLabel: "阵容 / 构成",
    detailsLabel: "详细信息",
    priceLabel: "价格说明",
    discountLabel: "优惠说明",
    usageLabel: "使用说明",
    venueLabel: "场地说明",
    cancellationLabel: "取消 · 退款",
    contactCta: "咨询",
    backCta: "返回门票列表",
    durationLabel: "演出时长",
    ageLabel: "观演年龄",
  },
  "zh-TW": {
    eyebrow: "GOYANG TICKETS",
    seatSection: "座位 · 選項",
    benefitsLabel: "包含內容",
    aboutSection: "簡介",
    noticeLabel: "觀演須知",
    castingLabel: "陣容 / 構成",
    detailsLabel: "詳細資訊",
    priceLabel: "價格說明",
    discountLabel: "優惠說明",
    usageLabel: "使用說明",
    venueLabel: "場地說明",
    cancellationLabel: "取消 · 退款",
    contactCta: "諮詢",
    backCta: "返回門票列表",
    durationLabel: "演出時長",
    ageLabel: "觀演年齡",
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
function formatKRW(v: number): string {
  return `₩${v.toLocaleString("ko-KR")}`;
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
  const venue = pickVenue(t, locale);
  const tags = pickTags(t, locale);

  return (
    <Shell>
      <article className="bg-white text-[#232322]">
        <section className="mx-auto max-w-5xl px-4 pt-10 pb-6 sm:px-6 sm:pt-14">
          <div className="text-[11px] font-bold uppercase tracking-[0.28em] text-[var(--accent)]">
            {copy.eyebrow}
          </div>
          <div className="mt-10 grid gap-8 sm:grid-cols-[minmax(0,320px)_1fr] sm:gap-10">
            <div className="w-full">
              {t.imageUrl ? (
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-slate-100">
                  <Image
                    src={t.imageUrl}
                    alt={t.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 320px"
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
              <h1 className="mt-3 text-2xl font-black leading-tight tracking-[-0.03em] sm:text-3xl lg:text-4xl">
                {t.title}
              </h1>
              {t.subtitle ? (
                <p className="mt-3 text-sm text-slate-600 sm:text-base">{t.subtitle}</p>
              ) : null}

              <dl className="mt-6 grid gap-3 text-sm text-slate-700">
                <div className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" aria-hidden="true" />
                  <span>{venue}</span>
                </div>
                <div className="flex items-start gap-2">
                  <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" aria-hidden="true" />
                  <span>{t.dateText}</span>
                </div>
                {t.duration ? (
                  <div className="flex items-start gap-2">
                    <Clock className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" aria-hidden="true" />
                    <span>
                      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                        {copy.durationLabel}
                      </span>
                      <span className="ml-2">{t.duration}</span>
                    </span>
                  </div>
                ) : null}
                {t.ageLimit ? (
                  <div className="flex items-start gap-2">
                    <Users className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" aria-hidden="true" />
                    <span>
                      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                        {copy.ageLabel}
                      </span>
                      <span className="ml-2">{t.ageLimit}</span>
                    </span>
                  </div>
                ) : null}
              </dl>

              {tags.length > 0 ? (
                <ul className="mt-6 flex flex-wrap gap-2">
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
        </section>

        {t.summary || t.description ? (
          <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
            <h2 className="text-lg font-black tracking-[-0.02em] text-[#232322] sm:text-xl">
              {copy.aboutSection}
            </h2>
            {t.summary ? (
              <p className="mt-4 text-sm leading-relaxed text-slate-700 sm:text-base">
                {t.summary}
              </p>
            ) : null}
            {t.description ? (
              <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-slate-700 sm:text-base">
                {t.description}
              </p>
            ) : null}
          </section>
        ) : null}

        {Array.isArray(t.options) && t.options.length > 0 ? (
          <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
            <h2 className="text-lg font-black tracking-[-0.02em] text-[#232322] sm:text-xl">
              {copy.seatSection}
            </h2>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {t.options.map((opt) => {
                const label = pickOptionLabel(t, opt, locale);
                const benefits = pickOptionBenefits(t, opt, locale);
                return (
                  <li
                    key={opt.id}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_10px_rgba(16,32,58,0.04)]"
                  >
                    <div className="flex items-baseline justify-between gap-3">
                      <div className="text-base font-black tracking-[-0.02em] text-slate-950">
                        {label}
                      </div>
                      <div className="text-base font-bold text-slate-950">{formatKRW(opt.price)}</div>
                    </div>
                    {benefits.length > 0 ? (
                      <div className="mt-3">
                        <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                          {copy.benefitsLabel}
                        </div>
                        <ul className="mt-2 space-y-1 text-sm text-slate-700">
                          {benefits.map((b) => (
                            <li key={b}>· {b}</li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </section>
        ) : null}

        <TabBlocks ticket={t} copy={copy} />

        {/* 오더 #C57 [3]: 예매 CTA 복구 · #C56 오설정 (/contact) 정정.
            최저가 표시 + [예매하기] → 기존 /products/{id}/reservation Toss 결제 흐름 재사용.
            문의하기는 보조 링크로 유지. */}
        <section className="bg-[#faf7f2]">
          <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
            <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
              <Link
                href="/dmc"
                className="text-sm font-semibold text-slate-700 underline-offset-4 hover:underline"
              >
                ← {copy.backCta}
              </Link>
              <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center">
                <Link
                  href="/contact"
                  className="text-sm font-semibold text-slate-600 underline-offset-4 hover:underline"
                >
                  {copy.contactCta}
                </Link>
                {(() => {
                  const prices = (t.options ?? []).map((o) => o.price).filter((p) => typeof p === "number" && p > 0);
                  const min = prices.length > 0 ? Math.min(...prices) : null;
                  const label = locale === "ko" ? "예매하기"
                    : locale === "ja" ? "予約する"
                    : locale === "zh-CN" ? "立即预约"
                    : locale === "zh-TW" ? "立即預約"
                    : "Book Now";
                  return (
                    <Link
                      // 오더 #C57-B: 티켓 hub product 재사용 · ticket id 는 쿼리로 전달.
                      //   reservation 라우트가 getProductById("ticket-agency-platform") 로 hub 상품 로드 후
                      //   ?ticket 쿼리로 TicketReservationBooking 에 실제 티켓 주입 (whats-on 어댑터 동일 패턴).
                      //   기존 Toss 결제 흐름·금액 로직 무변경.
                      href={`/products/ticket-agency-platform/reservation?ticket=${t.id}`}
                      className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-sm font-bold text-white shadow-[0_8px_20px_rgba(16,32,58,0.20)] transition hover:brightness-110"
                    >
                      {min ? <span className="text-white/85">{formatKRW(min)} ~</span> : null}
                      <span>{label}</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  );
                })()}
              </div>
            </div>
          </div>
        </section>
      </article>
    </Shell>
  );
}

function TabBlocks({ ticket, copy }: { ticket: TicketProduct; copy: DetailCopy }) {
  const blocks: Array<{ label: string; body?: string }> = [
    { label: copy.noticeLabel, body: ticket.tabNotice },
    { label: copy.castingLabel, body: ticket.tabCasting },
    { label: copy.detailsLabel, body: ticket.tabDetails },
    { label: copy.priceLabel, body: ticket.tabPrice },
    { label: copy.discountLabel, body: ticket.tabDiscount },
    { label: copy.usageLabel, body: ticket.tabUsageInfo },
    { label: copy.venueLabel, body: ticket.tabVenue },
    { label: copy.cancellationLabel, body: ticket.tabCancellation },
  ].filter((b) => typeof b.body === "string" && b.body!.trim().length > 0);
  if (blocks.length === 0) return null;
  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="grid gap-6">
        {blocks.map((b) => (
          <div key={b.label} className="rounded-2xl border border-slate-200 bg-white p-6">
            <h3 className="text-sm font-black uppercase tracking-[0.16em] text-slate-700">
              {b.label}
            </h3>
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-slate-700">
              {b.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
