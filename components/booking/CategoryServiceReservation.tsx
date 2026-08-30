"use client";

import { useMemo, useState } from "react";
import { ArrowRight, CalendarDays, Users, CheckCircle2, Smartphone } from "lucide-react";
import Image from "next/image";

import {
  getServiceCatalogItem,
  type ServiceCatalogCategory,
  type ServiceCatalogItem,
} from "@/data/service-catalog";
import type { Product } from "@/data/products";

const PAYMENT_METHODS = ["크레딧카드", "카카오페이", "계좌송금", "법인 후불 정산"];

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
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0]);
  const [form, setForm] = useState({
    organization: "", manager: "", phone: "", email: "", request: "", agree: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [submittedBookingNo, setSubmittedBookingNo] = useState("");

  const selectedOption = item.options.find((o) => o.id === selectedOptionId) ?? item.options[0];
  const totalAmount = useMemo(
    () => (selectedOption?.price ?? 0) * quantity,
    [quantity, selectedOption?.price]
  );

  /* ── 완료 ── */
  if (submittedBookingNo) {
    return (
      <div className="mx-auto max-w-xl rounded-[36px] border border-emerald-200 bg-emerald-50 p-10 text-center shadow-soft">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
          <CheckCircle2 className="h-8 w-8 text-emerald-600" />
        </div>
        <h3 className="mt-5 text-2xl font-black text-slate-950">예약이 접수되었습니다</h3>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          예약 번호 <span className="font-bold text-slate-950">{submittedBookingNo}</span>
          <br />담당자가 확인 후 연락드리겠습니다.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4 pb-16">

      {/* ── 대표 이미지 (전체 폭) ── */}
      {item.imageUrl && (
        <div className="relative h-52 w-full overflow-hidden rounded-[28px]">
          <Image src={item.imageUrl} alt={item.title} fill className="object-cover" sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-5 left-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/70">{item.subtitle}</p>
            <p className="mt-1 text-2xl font-black text-white">{item.title}</p>
          </div>
        </div>
      )}

      {/* ── 2열 메인 레이아웃 ── */}
      <div className="grid gap-4 lg:grid-cols-2 lg:items-start">

        {/* ─ 왼쪽: 선택 영역 ─ */}
        <div className="space-y-3">

          {/* 상품 요약 */}
          <div className="flex items-center justify-between rounded-[24px] border border-slate-200 bg-white px-5 py-4 shadow-sm">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">선택 상품</p>
              <p className="mt-0.5 text-base font-black text-slate-950">{item.title}</p>
              <p className="text-xs text-slate-500">{item.location}</p>
            </div>
            {/* 오더 #P4: 티켓 외 카테고리(ServiceCatalogCategory ∌ ticket) → 가격 렌더 차단.
                item.originalPrice / selectedOption.price 데이터 필드는 유지. */}
          </div>

          {/* 날짜 + 인원 (2열) */}
          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1.5 rounded-[24px] border border-slate-200 bg-white px-4 py-3.5 cursor-pointer">
              <span className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                <CalendarDays className="h-3.5 w-3.5" /> 예약 날짜
              </span>
              <input type="date" value={reservationDate}
                min={new Date().toISOString().slice(0, 10)}
                onChange={(e) => setReservationDate(e.target.value)}
                className="bg-transparent text-sm font-bold text-slate-900 outline-none" />
            </label>
            <div className="flex flex-col gap-1.5 rounded-[24px] border border-slate-200 bg-white px-4 py-3.5">
              <span className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                <Users className="h-3.5 w-3.5" /> 인원 / 수량
              </span>
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => setQuantity((n) => Math.max(1, n - 1))}
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-700 hover:bg-slate-200 transition">−</button>
                <span className="w-5 text-center text-lg font-black text-slate-950">{quantity}</span>
                <button type="button" onClick={() => setQuantity((n) => n + 1)}
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-700 hover:bg-slate-200 transition">+</button>
                <span className="text-xs text-slate-400">명</span>
              </div>
            </div>
          </div>

          {/* 옵션 선택 */}
          {item.options.length > 0 && (
            <div className="rounded-[24px] border border-slate-200 bg-white p-4">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-slate-400">옵션 선택</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {item.options.map((opt) => (
                  <button key={opt.id} type="button" onClick={() => setSelectedOptionId(opt.id)}
                    className={`rounded-[18px] border px-4 py-3 text-left transition ${
                      selectedOptionId === opt.id
                        ? "border-slate-950 bg-slate-950 text-white"
                        : "border-slate-200 bg-slate-50 text-slate-900 hover:border-slate-400"
                    }`}>
                    <p className="text-sm font-black">{opt.label}</p>
                    <p className={`mt-0.5 text-[11px] ${selectedOptionId === opt.id ? "text-slate-300" : "text-slate-500"}`}>
                      {opt.benefits.join(" · ")}
                    </p>
                    {/* 오더 #P4: 티켓 외 카테고리 → 옵션 가격 렌더 차단. opt.price 필드는 유지. */}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 하이라이트 / 포함 */}
          {((item.highlights?.length ?? 0) > 0 || (item.includes?.length ?? 0) > 0) && (
            <div className={`grid gap-3 ${(item.highlights?.length ?? 0) > 0 && (item.includes?.length ?? 0) > 0 ? "grid-cols-2" : ""}`}>
              {(item.highlights?.length ?? 0) > 0 && (
                <div className="rounded-[24px] border border-slate-200 bg-white p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-sky-600">Highlights</p>
                  <ul className="mt-2 space-y-1.5">
                    {item.highlights!.map((h) => (
                      <li key={h} className="flex items-start gap-2 text-xs leading-6 text-slate-600">
                        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-sky-500" />{h}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {(item.includes?.length ?? 0) > 0 && (
                <div className="rounded-[24px] border border-slate-200 bg-white p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-emerald-600">Included</p>
                  <ul className="mt-2 space-y-1.5">
                    {item.includes!.map((inc) => (
                      <li key={inc} className="flex items-start gap-2 text-xs leading-6 text-slate-600">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />{inc}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* 쿠폰 안내 */}
          {item.couponGuide && (
            <div className="flex items-start gap-3 rounded-[24px] border border-amber-200 bg-amber-50 px-4 py-3">
              <Smartphone className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
              <p className="text-xs leading-6 text-slate-700">{item.couponGuide}</p>
            </div>
          )}
        </div>

        {/* ─ 오른쪽: 예약 폼 (검정) ─ */}
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setSubmitting(true);
            setError("");
            try {
              const res = await fetch("/api/bookings", {
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
                    `결제 방식: ${paymentMethod}`,
                    `총 금액: ${totalAmount.toLocaleString("ko-KR")}원`,
                    form.request ? `추가 요청: ${form.request}` : "",
                  ].filter(Boolean).join("\n"),
                  privacy_agreed: form.agree,
                }),
              });
              const result = await res.json() as { success: boolean; error?: string; data?: { booking_no?: string } };
              if (!res.ok || !result.success || !result.data?.booking_no)
                throw new Error(result.error || "예약 접수에 실패했습니다.");
              setSubmittedBookingNo(result.data.booking_no);
            } catch (err) {
              setError(err instanceof Error ? err.message : "오류가 발생했습니다.");
            } finally {
              setSubmitting(false);
            }
          }}
          className="sticky top-20 space-y-3 rounded-[28px] bg-slate-950 p-6 text-white"
        >
          <p className="text-[11px] font-semibold uppercase tracking-widest text-cyan-300">예약자 정보</p>

          {/* 2열 입력 */}
          <div className="grid grid-cols-2 gap-2">
            <FormInput placeholder="담당자명 *" value={form.manager} required
              onChange={(v) => setForm((f) => ({ ...f, manager: v }))} />
            <FormInput placeholder="연락처 *" type="tel" value={form.phone} required
              onChange={(v) => setForm((f) => ({ ...f, phone: v }))} />
            <FormInput placeholder="이메일 *" type="email" value={form.email} required
              onChange={(v) => setForm((f) => ({ ...f, email: v }))} />
            <FormInput placeholder="기관명 / 단체명" value={form.organization}
              onChange={(v) => setForm((f) => ({ ...f, organization: v }))} />
          </div>

          <textarea rows={2} placeholder="추가 요청사항 (선택)" value={form.request}
            onChange={(e) => setForm((f) => ({ ...f, request: e.target.value }))}
            className="w-full resize-none rounded-[18px] border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder-slate-400 outline-none focus:border-white/40 transition" />

          {/* 결제수단 */}
          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-slate-300">결제 방식</p>
            <div className="flex flex-wrap gap-2">
              {PAYMENT_METHODS.map((m) => (
                <button key={m} type="button" onClick={() => setPaymentMethod(m)}
                  className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
                    paymentMethod === m ? "bg-white text-slate-950" : "border border-white/30 text-white hover:bg-white/10"
                  }`}>{m}</button>
              ))}
            </div>
          </div>

          {/* 요약 — 오더 #P4: 티켓 외 카테고리 → 결제 금액 렌더 차단. totalAmount 는 유지. */}
          <div className="flex items-center justify-end rounded-[18px] bg-white/10 px-4 py-3">
            <div className="text-right text-[11px] text-slate-400 space-y-0.5">
              <p className="font-semibold text-slate-200">{selectedOption?.label}</p>
              <p>{quantity}명 · {reservationDate}</p>
            </div>
          </div>

          {/* 동의 */}
          <label className="flex cursor-pointer items-start gap-2.5 rounded-[18px] border border-white/20 bg-white/10 px-4 py-3">
            <input type="checkbox" checked={form.agree}
              onChange={(e) => setForm((f) => ({ ...f, agree: e.target.checked }))}
              className="mt-0.5 h-4 w-4 shrink-0 accent-white" />
            <span className="text-xs leading-5 text-slate-300">개인정보 수집 및 예약·결제 안내를 위한 연락에 동의합니다.</span>
          </label>

          {error && (
            <div className="rounded-[18px] border border-rose-300 bg-rose-100/10 px-4 py-3 text-sm text-rose-200">{error}</div>
          )}

          <button type="submit" disabled={submitting || !form.agree}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-3.5 text-sm font-black text-slate-950 transition hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed">
            {submitting ? "접수 중..." : "예약 요청"}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}

function FormInput({ value, onChange, placeholder, type = "text", required = false }: {
  value: string; onChange: (v: string) => void; placeholder: string; type?: string; required?: boolean;
}) {
  return (
    <input type={type} required={required} placeholder={placeholder} value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-[18px] border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder-slate-400 outline-none focus:border-white/40 transition" />
  );
}
