// components/booking/TicketReservationBooking.tsx — 오더 #D20 예약 페이지 전면 정리.
//
// 진화:
//   · C56~C57: 최초 · SelectedTicket / RESERVATION INFO / 예약 폼 3중복 카드로 정보 반복.
//     상단 인터파크 스타일 카드 · 검정 배경 폼 · 보라·핑크 그라디언트 폴백.
//   · D20: visitlondon / D18 티켓 상세와 동일한 브랜드 규격으로 재구성.
//     좌 (1fr): 공연 요약 카드 1개 (이전 3중복 통합) + 좌석 옵션 + 결제 수단 안내.
//     우 (360px sticky): 예약 신청 폼. 흰 배경 + 코럴레드 헤더 + 코럴레드 CTA.
//     검정 배경 · 인디고 · 보라·핑크 그라디언트 전면 제거.
//     포스터: imageUrl 있으면 이미지만 (텍스트 오버레이 제거) · 없으면 posterLabel 만 단순 표시.
//
// 결제 로직·Toss 연동 무접촉 · /api/bookings POST 로직 그대로 유지.
// 5로케일 별도 트랙 (한글 하드코딩 유지 → 다음 오더에서 처리).

"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { ArrowRight, CalendarDays, Clock, Info, MapPinned, Ticket, Users } from "lucide-react";

import { getTicketProduct, type TicketLocale, type TicketProduct } from "@/data/ticket-booking";
import type { Product } from "@/data/products";
import type { PageLocale } from "@/data/locales/types";
import type { ReservationCopy } from "@/data/locales/reservation-copy";

type TicketReservationBookingProps = {
  product: Product;
  locale: PageLocale;
  copy: ReservationCopy;
  initialTicketId?: string;
  initialTicket?: TicketProduct;
  initialOptionId?: string;
  initialCount?: number;
  initialDate?: string;
};

type FormState = {
  organization: string;
  manager: string;
  phone: string;
  email: string;
  paymentMethod: string;
  request: string;
  agree: boolean;
};

/** 데이터 번역 필드 우선, 없으면 ko 원문 폴백 (D21 [1]-A). */
function pickTicketBadge(t: TicketProduct, locale: PageLocale): string {
  if (locale === "ko") return t.badge;
  return t.translations?.[locale as TicketLocale]?.badge ?? t.badge;
}
function pickTicketVenue(t: TicketProduct, locale: PageLocale): string {
  if (locale === "ko") return t.venue;
  return t.translations?.[locale as TicketLocale]?.venue ?? t.venue;
}
function pickTicketTags(t: TicketProduct, locale: PageLocale): string[] {
  if (locale === "ko") return t.tags ?? [];
  return t.translations?.[locale as TicketLocale]?.tags ?? t.tags ?? [];
}
function pickTicketOptionLabel(
  t: TicketProduct,
  optId: string,
  fallback: string,
  locale: PageLocale
): string {
  if (locale === "ko") return fallback;
  const tr = t.translations?.[locale as TicketLocale]?.options?.find((o) => o.id === optId);
  return tr?.label ?? fallback;
}
function pickTicketOptionBenefits(
  t: TicketProduct,
  optId: string,
  fallback: string[],
  locale: PageLocale
): string[] {
  if (locale === "ko") return fallback;
  const tr = t.translations?.[locale as TicketLocale]?.options?.find((o) => o.id === optId);
  return tr?.benefits ?? fallback;
}

export default function TicketReservationBooking({
  product,
  locale,
  copy,
  initialTicketId,
  initialTicket,
  initialOptionId,
  initialCount,
  initialDate,
}: TicketReservationBookingProps) {
  const ticket = initialTicket ?? getTicketProduct(initialTicketId);
  const paymentMethods = copy.paymentMethods;
  const localizedBadge = pickTicketBadge(ticket, locale);
  const localizedVenue = pickTicketVenue(ticket, locale);
  const localizedTags = pickTicketTags(ticket, locale);

  const [selectedOptionId, setSelectedOptionId] = useState(() => {
    if (initialOptionId && ticket.options.some((o) => o.id === initialOptionId)) {
      return initialOptionId;
    }
    return ticket.options[0]?.id ?? "";
  });
  const [ticketCount, setTicketCount] = useState(
    initialCount && initialCount > 0 ? initialCount : 2
  );
  const [reservationDate, setReservationDate] = useState(
    initialDate ?? new Date().toISOString().slice(0, 10)
  );
  const [form, setForm] = useState<FormState>({
    organization: "",
    manager: "",
    phone: "",
    email: "",
    paymentMethod: paymentMethods[0],
    request: "",
    agree: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [submittedBookingNo, setSubmittedBookingNo] = useState("");

  const selectedOption =
    ticket.options.find((o) => o.id === selectedOptionId) ?? ticket.options[0];
  const totalAmount = useMemo(
    () => (selectedOption?.price ?? 0) * ticketCount,
    [selectedOption?.price, ticketCount]
  );

  if (submittedBookingNo) {
    return (
      <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-emerald-950">
        <div className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">
          {copy.successEyebrow}
        </div>
        <h3 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl">
          {copy.successTitle}
        </h3>
        <p className="mt-3 max-w-3xl text-sm leading-7">
          {copy.successBookingNoLabel} <span className="font-bold">{submittedBookingNo}</span>
          {copy.successBookingNoSuffix} {copy.successFollowUp}
        </p>
        <button
          type="button"
          onClick={() => {
            setSubmittedBookingNo("");
            setError("");
          }}
          className="mt-5 rounded-full bg-emerald-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
        >
          {copy.successRestartCta}
        </button>
      </div>
    );
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: product.id,
          customer_name: form.manager,
          organization_name: form.organization,
          phone: form.phone,
          email: form.email,
          booking_date: new Date(`${reservationDate}T19:00:00`).toISOString(),
          guest_count: ticketCount,
          unit_price: selectedOption?.price ?? 0,
          total_price: totalAmount,
          request_note: [
            `티켓 상품: ${ticket.title}`,
            `예약 날짜: ${reservationDate}`,
            `좌석/패키지: ${selectedOption?.label ?? "-"}`,
            `수량: ${ticketCount}매`,
            `결제 방식: ${form.paymentMethod}`,
            `총 결제 금액: ${totalAmount.toLocaleString("ko-KR")}원`,
            form.request ? `추가 요청: ${form.request}` : "",
          ]
            .filter(Boolean)
            .join("\n"),
          privacy_agreed: form.agree,
        }),
      });
      const result = (await response.json()) as {
        success: boolean;
        error?: string;
        data?: { booking_no?: string };
      };
      if (!response.ok || !result.success || !result.data?.booking_no) {
        throw new Error(result.error || copy.errorSubmitFailed);
      }
      setSubmittedBookingNo(result.data.booking_no);
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : copy.errorGeneric
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px] lg:gap-8">
      {/* ── 좌: 공연 요약 + 옵션 + 결제 수단 ── */}
      <div className="min-w-0 space-y-6">
        {/* 1) 공연 요약 카드 (이전 3중복 통합) */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="grid gap-0 md:grid-cols-[220px_1fr]">
            {/* 포스터 — imageUrl 있으면 이미지만 · 없으면 posterLabel 만 슬레이트 배경 */}
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-100 md:aspect-auto md:min-h-[280px]">
              {ticket.imageUrl ? (
                <Image
                  src={ticket.imageUrl}
                  alt={ticket.title}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, 220px"
                  priority
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 p-6">
                  <span className="whitespace-nowrap text-2xl font-black tracking-tight text-slate-500">
                    {ticket.posterLabel}
                  </span>
                </div>
              )}
            </div>

            <div className="p-5 sm:p-6">
              {localizedBadge ? (
                <div className="text-[11px] font-black uppercase tracking-[0.18em] text-[var(--accent)]">
                  {localizedBadge}
                </div>
              ) : null}
              <h2 className="mt-2 break-keep text-xl font-black leading-tight tracking-[-0.02em] text-[#232322] sm:text-2xl">
                {ticket.title}
              </h2>
              {ticket.subtitle ? (
                <p className="mt-2 text-sm text-slate-600">{ticket.subtitle}</p>
              ) : null}

              {/* 4열 통합 정보 — 이전 InfoRow / InfoCard 중복 제거 · D21 로케일화 */}
              <dl className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                <InfoLine icon={MapPinned} label={copy.labelVenue} value={localizedVenue} />
                <InfoLine icon={CalendarDays} label={copy.labelDates} value={ticket.dateText} />
                {ticket.duration ? (
                  <InfoLine icon={Clock} label={copy.labelDuration} value={ticket.duration} />
                ) : null}
                {ticket.ageLimit ? (
                  <InfoLine icon={Users} label={copy.labelAge} value={ticket.ageLimit} />
                ) : null}
              </dl>

              {localizedTags.length > 0 ? (
                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {localizedTags.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-full border border-slate-200 bg-white px-2.5 py-0.5 text-[11px] font-semibold text-slate-700"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>
        </section>

        {/* 2) 좌석 옵션 */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
          <div className="flex items-center gap-2">
            <Ticket className="h-4 w-4 text-[var(--accent)]" aria-hidden="true" />
            <h3 className="text-sm font-black uppercase tracking-[0.16em] text-slate-700">
              {copy.optionsTitle}
            </h3>
          </div>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {ticket.options.map((option) => {
              const active = selectedOptionId === option.id;
              const label = pickTicketOptionLabel(ticket, option.id, option.label, locale);
              const benefits = pickTicketOptionBenefits(
                ticket,
                option.id,
                option.benefits,
                locale
              );
              return (
                <li key={option.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedOptionId(option.id)}
                    aria-pressed={active}
                    className={
                      "w-full rounded-xl border p-4 text-left transition " +
                      (active
                        ? "border-[var(--accent)] bg-[var(--accent)]/5"
                        : "border-slate-200 bg-white hover:border-slate-300")
                    }
                  >
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="text-base font-black text-[#232322]">
                        {label}
                      </span>
                      <span className="text-base font-black text-[#232322]">
                        {option.price.toLocaleString("ko-KR")}원
                      </span>
                    </div>
                    {benefits.length > 0 ? (
                      <div className="mt-2 text-xs leading-5 text-slate-600">
                        {benefits.join(" · ")}
                      </div>
                    ) : null}
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        {/* 3) 결제 수단 안내 (D21 로케일화) */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 text-[var(--accent)]" aria-hidden="true" />
            <h3 className="text-sm font-black uppercase tracking-[0.16em] text-slate-700">
              {copy.paymentsTitle}
            </h3>
          </div>
          <p className="mt-2 text-xs leading-6 text-slate-500">{copy.paymentsNote}</p>
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {paymentMethods.map((m) => (
              <li
                key={m}
                className="rounded-full border border-slate-200 bg-[#faf7f2] px-3 py-1 text-xs font-semibold text-[#232322]"
              >
                {m}
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* ── 우: sticky 예약 신청 폼 ── */}
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <form
          onSubmit={handleSubmit}
          className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_2px_12px_rgba(16,32,58,0.06)]"
        >
          {/* 코럴레드 헤더 (D21 로케일화) */}
          <div className="flex items-center gap-2 px-4 py-3" style={{ background: "var(--accent)" }}>
            <Ticket className="h-4 w-4 text-white" aria-hidden="true" />
            <span className="text-sm font-black uppercase tracking-[0.14em] text-white">
              {copy.formHeader}
            </span>
          </div>

          <div className="space-y-4 p-4 sm:p-5">
            {/* 요약 rows */}
            <div className="space-y-1.5 rounded-xl bg-slate-50 px-3 py-3 text-xs leading-6">
              <FormSummary label={copy.summarySelected} value={ticket.title} />
              <FormSummary label={copy.summarySeat} value={selectedOption?.label ?? "-"} />
              <FormSummary label={copy.summaryVenue} value={localizedVenue} />
            </div>

            {/* 날짜 · 수량 */}
            <div className="grid grid-cols-2 gap-2">
              <label className="rounded-xl border border-slate-200 px-3 py-2">
                <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                  {copy.fieldDate}
                </div>
                <input
                  type="date"
                  value={reservationDate}
                  onChange={(e) => setReservationDate(e.target.value)}
                  className="mt-1 w-full bg-transparent text-sm font-bold text-[#232322] outline-none"
                />
              </label>
              <div className="rounded-xl border border-slate-200 px-3 py-2">
                <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                  {copy.fieldQuantity}
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setTicketCount((c) => Math.max(1, c - 1))}
                    className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-300 text-slate-700 transition hover:bg-slate-100"
                    aria-label={copy.ariaDecrease}
                  >
                    −
                  </button>
                  <div className="min-w-[28px] text-center text-base font-black text-[#232322]">
                    {ticketCount}
                  </div>
                  <button
                    type="button"
                    onClick={() => setTicketCount((c) => c + 1)}
                    className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-300 text-slate-700 transition hover:bg-slate-100"
                    aria-label={copy.ariaIncrease}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* form fields */}
            <div className="space-y-2">
              <FormInput
                placeholder={copy.placeholderOrganization}
                value={form.organization}
                onChange={(v) => setForm((s) => ({ ...s, organization: v }))}
              />
              <FormInput
                placeholder={copy.placeholderManager}
                value={form.manager}
                onChange={(v) => setForm((s) => ({ ...s, manager: v }))}
                required
              />
              <FormInput
                type="tel"
                placeholder={copy.placeholderPhone}
                value={form.phone}
                onChange={(v) => setForm((s) => ({ ...s, phone: v }))}
                required
              />
              <FormInput
                type="email"
                placeholder={copy.placeholderEmail}
                value={form.email}
                onChange={(v) => setForm((s) => ({ ...s, email: v }))}
                required
              />
              <label className="block rounded-xl border border-slate-200 px-3 py-2">
                <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                  {copy.fieldPayment}
                </div>
                <select
                  value={form.paymentMethod}
                  onChange={(e) => setForm((s) => ({ ...s, paymentMethod: e.target.value }))}
                  className="mt-1 w-full bg-transparent text-sm font-bold text-[#232322] outline-none"
                >
                  {paymentMethods.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </label>
              <textarea
                rows={3}
                placeholder={copy.placeholderRequest}
                value={form.request}
                onChange={(e) => setForm((s) => ({ ...s, request: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-[#232322] outline-none transition focus:border-[var(--accent)]"
              />
            </div>

            {/* 예상 금액 */}
            <div
              className="rounded-xl border border-slate-200 px-3 py-3"
              style={{ background: "rgba(226, 62, 46, 0.06)" }}
            >
              <div className="flex items-baseline justify-between">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-600">
                  {copy.totalLabel}
                </span>
                <span className="text-xl font-black text-[#232322]">
                  {totalAmount.toLocaleString("ko-KR")}원
                </span>
              </div>
              <p className="mt-1 text-[10px] leading-5 text-slate-500">{copy.totalNote}</p>
            </div>

            <label className="flex cursor-pointer items-start gap-2 rounded-xl border border-slate-200 px-3 py-3">
              <input
                type="checkbox"
                checked={form.agree}
                onChange={(e) => setForm((s) => ({ ...s, agree: e.target.checked }))}
                className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--accent)]"
              />
              <span className="text-xs leading-5 text-slate-700">{copy.agreeLabel}</span>
            </label>

            {error ? (
              <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={submitting || !form.agree}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-black text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
              style={{ background: "var(--accent)" }}
            >
              {submitting ? copy.submittingLabel : copy.submitCta}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </form>
      </aside>
    </div>
  );
}

function InfoLine({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof MapPinned;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" aria-hidden="true" />
      <div className="min-w-0">
        <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
          {label}
        </div>
        <div className="mt-0.5 text-sm font-bold text-[#232322]">{value}</div>
      </div>
    </div>
  );
}

function FormSummary({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
        {label}
      </span>
      <span className="max-w-[65%] truncate text-right text-xs font-bold text-[#232322]">
        {value}
      </span>
    </div>
  );
}

function FormInput({
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <input
      type={type}
      required={required}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-[#232322] placeholder:text-slate-400 outline-none transition focus:border-[var(--accent)]"
    />
  );
}
