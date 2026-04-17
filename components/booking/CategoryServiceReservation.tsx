"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { ArrowRight, CalendarDays, CheckCircle2, MapPinned, Smartphone } from "lucide-react";

import BookingMetaPanel from "@/components/booking/BookingMetaPanel";
import {
  getServiceCatalogItem,
  type ServiceCatalogCategory,
  type ServiceCatalogItem,
} from "@/data/service-catalog";
import type { Product } from "@/data/products";

const paymentMethods = ["크레딧카드", "카카오페이", "계좌송금", "법인 후불 정산"];
const seasonLabels: Record<ServiceCatalogCategory, string> = {
  tour: "봄·가을 집중 시즌",
  stay: "연중 운영",
  restaurant: "연중 운영",
  cafe: "봄·가을 추천 시즌",
  airport: "365일 · 24시간 운영",
};

export default function CategoryServiceReservation({
  product,
  category,
  initialItemId,
  initialItem,
}: {
  product: Product;
  category: ServiceCatalogCategory;
  initialItemId?: string;
  initialItem?: ServiceCatalogItem;
}) {
  const item = initialItem ?? getServiceCatalogItem(category, initialItemId);
  const [selectedOptionId, setSelectedOptionId] = useState(item.options[0]?.id ?? "");
  const [quantity, setQuantity] = useState(2);
  const [reservationDate, setReservationDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [form, setForm] = useState({
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
    item.options.find((option) => option.id === selectedOptionId) ?? item.options[0];

  const totalAmount = useMemo(
    () => (selectedOption?.price ?? 0) * quantity,
    [quantity, selectedOption?.price]
  );

  if (submittedBookingNo) {
    return (
      <div className="rounded-[36px] border border-emerald-200 bg-emerald-50 p-8 text-emerald-950 shadow-soft">
        <div className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
          Reservation Complete
        </div>
        <h3 className="mt-4 text-3xl font-black tracking-tight">예약이 접수되었습니다.</h3>
        <p className="mt-4 text-sm leading-7">
          예약 번호는 <span className="font-bold">{submittedBookingNo}</span> 입니다. 관리자
          페이지에서 예약과 결제 상태를 계속 관리할 수 있도록 접수되었습니다.
        </p>
      </div>
    );
  }

  const hasIntro = item.imageUrl || (item.highlights?.length ?? 0) > 0 || (item.includes?.length ?? 0) > 0 || item.couponGuide;

  return (
    <div className="mt-10 space-y-6">

      {/* ── 상품 소개 섹션 ── */}
      {hasIntro && (
        <section className="overflow-hidden rounded-[36px] border border-slate-200 bg-white shadow-soft">
          {/* 대표 사진 */}
          {item.imageUrl && (
            <div className="relative h-56 w-full md:h-72">
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 1200px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-8">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/70">{item.subtitle}</p>
                <h2 className="mt-1 text-2xl font-black tracking-tight text-white md:text-3xl">{item.title}</h2>
              </div>
            </div>
          )}

          <div className={`grid gap-0 ${(item.highlights?.length ?? 0) > 0 && (item.includes?.length ?? 0) > 0 ? "md:grid-cols-2" : ""}`}>
            {/* 주요 특징 */}
            {(item.highlights?.length ?? 0) > 0 && (
              <div className="border-b border-slate-100 p-8 md:border-b-0 md:border-r">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">Highlights</p>
                <h3 className="mt-2 text-lg font-black tracking-tight text-slate-950">주요 특징</h3>
                <ul className="mt-5 space-y-3">
                  {item.highlights!.map((hl) => (
                    <li key={hl} className="flex items-start gap-3 text-sm leading-7 text-slate-600">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-sky-600" />
                      <span>{hl}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 포함 사항 */}
            {(item.includes?.length ?? 0) > 0 && (
              <div className="border-b border-slate-100 p-8 md:border-b-0">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">Included</p>
                <h3 className="mt-2 text-lg font-black tracking-tight text-slate-950">포함 사항</h3>
                <ul className="mt-5 space-y-3">
                  {item.includes!.map((inc) => (
                    <li key={inc} className="flex items-start gap-3 text-sm leading-7 text-slate-600">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                      <span>{inc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* 모바일 쿠폰 안내 */}
          {item.couponGuide && (
            <div className="border-t border-slate-100 bg-amber-50 p-8">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-200">
                  <Smartphone className="h-5 w-5 text-amber-800" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">Mobile Coupon</p>
                  <h3 className="mt-1 text-base font-black text-slate-950">모바일 쿠폰 사용 안내</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-700">{item.couponGuide}</p>
                </div>
              </div>
            </div>
          )}
        </section>
      )}

    <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="space-y-6">
        <section className="overflow-hidden rounded-[36px] border border-slate-200 bg-white shadow-soft">
          <div className="grid gap-0 md:grid-cols-[0.78fr_1.22fr]">
            <div className={`bg-gradient-to-br ${item.imageTone} p-8 text-slate-950`}>
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-700">
                {item.subtitle}
              </div>
              <div className="mt-5 text-5xl font-black tracking-tight">{item.posterLabel}</div>
              <div className="mt-8 text-3xl font-black leading-tight">{item.title}</div>
            </div>

            <div className="p-8 md:p-10">
              <div className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">
                Selected Product
              </div>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
                {item.title}
              </h2>
              <p className="mt-4 text-sm leading-8 text-slate-600">{item.description}</p>

              <div className="mt-6 grid gap-3 md:grid-cols-2">
                <InfoCard
                  icon={<MapPinned className="h-4 w-4 text-slate-500" />}
                  label="운영 지역"
                  value={item.location}
                />
                <InfoCard
                  icon={<CalendarDays className="h-4 w-4 text-slate-500" />}
                  label="운영 일정"
                  value={item.dateText}
                />
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <BookingMetaPanel
          availabilityLabel="예약 가능"
          availabilityTone="open"
          seasonLabel={seasonLabels[category]}
          reservationDate={reservationDate}
          onReservationDateChange={setReservationDate}
          paymentMethods={paymentMethods}
          note="예약 날짜를 먼저 정한 뒤 옵션과 인원을 선택하시면 시즌과 운영 가능 여부를 기준으로 빠르게 예약 요청을 접수할 수 있습니다."
        />

        <section className="rounded-[36px] border border-slate-200 bg-white p-6 shadow-soft">
          <div className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Booking Options
          </div>
          <div className="mt-5 grid gap-4">
            {item.options.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setSelectedOptionId(option.id)}
                className={`rounded-[28px] border p-5 text-left transition ${
                  selectedOptionId === option.id
                    ? "border-slate-950 bg-slate-950 text-white"
                    : "border-slate-200 bg-slate-50 text-slate-900 hover:border-slate-300"
                }`}
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="text-xl font-black tracking-tight">{option.label}</div>
                    <div
                      className={`mt-2 text-sm leading-7 ${
                        selectedOptionId === option.id ? "text-slate-200" : "text-slate-600"
                      }`}
                    >
                      {option.benefits.join(" · ")}
                    </div>
                  </div>
                  <div className="text-2xl font-black tracking-tight">
                    {option.price.toLocaleString("ko-KR")}원
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>
      </div>

      <form
        onSubmit={async (event) => {
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
                booking_date: new Date(`${reservationDate}T09:00:00`).toISOString(),
                guest_count: quantity,
                unit_price: selectedOption?.price ?? 0,
                total_price: totalAmount,
                request_note: [
                  `선택 상품: ${item.title}`,
                  `예약 날짜: ${reservationDate}`,
                  `옵션: ${selectedOption?.label ?? "-"}`,
                  `수량/인원: ${quantity}`,
                  `결제 방식: ${form.paymentMethod}`,
                  `총 금액: ${totalAmount.toLocaleString("ko-KR")}원`,
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
              throw new Error(result.error || "예약 접수에 실패했습니다.");
            }

            setSubmittedBookingNo(result.data.booking_no);
          } catch (submitError) {
            setError(
              submitError instanceof Error
                ? submitError.message
                : "예약 접수 중 오류가 발생했습니다."
            );
          } finally {
            setSubmitting(false);
          }
        }}
        className="rounded-[36px] bg-slate-950 p-8 text-white shadow-soft"
      >
        <div className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-200">
          Booking & Payment
        </div>
        <h3 className="mt-4 text-3xl font-black tracking-tight">상세 확인 및 결제</h3>

        <div className="mt-6 space-y-3">
          <SummaryRow label="상품명" value={item.title} />
          <SummaryRow label="옵션" value={selectedOption?.label ?? "-"} />
          <SummaryRow label="예약 날짜" value={reservationDate} />
          <SummaryRow label="운영 지역" value={item.location} />
        </div>

        <div className="mt-6 rounded-[28px] bg-white/12 px-5 py-5">
          <div className="text-sm font-semibold text-slate-200">인원 / 수량</div>
          <div className="mt-3 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setQuantity((count) => Math.max(1, count - 1))}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 text-lg hover:bg-white/10 transition"
            >
              -
            </button>
            <div className="min-w-16 text-center text-2xl font-black">{quantity}</div>
            <button
              type="button"
              onClick={() => setQuantity((count) => count + 1)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 text-lg hover:bg-white/10 transition"
            >
              +
            </button>
            <div className="text-sm text-slate-300">명 / 건</div>
          </div>
        </div>

        <div className="mt-4 rounded-[28px] bg-white/12 px-5 py-5">
          <div className="text-sm font-semibold text-slate-200">총 결제 금액</div>
          <div className="mt-2 text-3xl font-black">
            {totalAmount.toLocaleString("ko-KR")}원
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <FormInput
            placeholder="기관명 또는 단체명"
            value={form.organization}
            onChange={(value) => setForm((current) => ({ ...current, organization: value }))}
          />
          <FormInput
            placeholder="예약 담당자명"
            value={form.manager}
            onChange={(value) => setForm((current) => ({ ...current, manager: value }))}
            required
          />
          <FormInput
            type="tel"
            placeholder="연락처"
            value={form.phone}
            onChange={(value) => setForm((current) => ({ ...current, phone: value }))}
            required
          />
          <FormInput
            type="email"
            placeholder="이메일"
            value={form.email}
            onChange={(value) => setForm((current) => ({ ...current, email: value }))}
            required
          />
          <label className="block rounded-[24px] border border-white/20 bg-white/10 px-4 py-3.5">
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-300">
              결제 방식
            </div>
            <select
              value={form.paymentMethod}
              onChange={(event) =>
                setForm((current) => ({ ...current, paymentMethod: event.target.value }))
              }
              className="mt-2 w-full bg-transparent text-base font-bold text-white outline-none"
            >
              {paymentMethods.map((method) => (
                <option key={method} value={method} className="text-slate-900">
                  {method}
                </option>
              ))}
            </select>
          </label>
          <textarea
            rows={4}
            placeholder="추가 요청, 일정, 좌석/객실/테이블 요청 사항을 적어 주세요."
            value={form.request}
            onChange={(event) =>
              setForm((current) => ({ ...current, request: event.target.value }))
            }
            className="w-full rounded-[24px] border border-white/20 bg-white/10 px-4 py-3.5 text-sm text-white placeholder-slate-400 outline-none transition focus:border-white/40"
          />
        </div>

        <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-[24px] border border-white/20 bg-white/10 px-4 py-4">
          <input
            type="checkbox"
            checked={form.agree}
            onChange={(event) =>
              setForm((current) => ({ ...current, agree: event.target.checked }))
            }
            className="mt-1 h-4 w-4 shrink-0 accent-white"
          />
          <span className="text-sm leading-6 text-slate-200">
            개인정보 수집 및 예약·결제 안내를 위한 연락에 동의합니다.
          </span>
        </label>

        {error ? (
          <div className="mt-4 rounded-[24px] border border-rose-300 bg-rose-100/10 px-4 py-3 text-sm text-rose-200">
            {error}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={submitting || !form.agree}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {submitting ? "예약 접수 중..." : "상세 확인 후 예약 요청"}
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>
    </div>
    </div>
  );
}

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-4">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
        {icon}
        <span>{label}</span>
      </div>
      <div className="mt-3 text-base font-bold text-slate-900">{value}</div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[24px] bg-white/12 px-5 py-4">
      <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-300">
        {label}
      </div>
      <div className="mt-2 text-base font-bold text-white">{value}</div>
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
  onChange: (value: string) => void;
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
      onChange={(event) => onChange(event.target.value)}
      className="w-full rounded-[24px] border border-white/20 bg-white/10 px-4 py-3.5 text-sm text-white placeholder-slate-400 outline-none transition focus:border-white/40"
    />
  );
}
