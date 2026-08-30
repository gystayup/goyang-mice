"use client";

import { useMemo, useState } from "react";

import type { Product } from "@/data/products";

interface BookingFormProps {
  product: Product;
}

type FormState = {
  organization: string;
  manager: string;
  phone: string;
  email: string;
  serviceDate: string;
  subcategory: string;
  paymentMethod: string;
  request: string;
  agree: boolean;
};

const buildInitialState = (product: Product): FormState => ({
  organization: "",
  manager: "",
  phone: "",
  email: "",
  serviceDate: "",
  subcategory: product.subcategories[0] ?? "",
  paymentMethod: product.paymentFeatures[0] ?? "",
  request: "",
  agree: false,
});

export default function BookingForm({ product }: BookingFormProps) {
  const [guestCount, setGuestCount] = useState(10);
  const [submitting, setSubmitting] = useState(false);
  const [submittedBookingNo, setSubmittedBookingNo] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState<FormState>(() => buildInitialState(product));

  const estimatedPrice = useMemo(
    () => product.price * guestCount,
    [guestCount, product.price]
  );

  if (submittedBookingNo) {
    return (
      <div className="rounded-[30px] bg-emerald-50 p-8 text-emerald-950 shadow-soft">
        <div className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
          Booking Complete
        </div>
        <h3 className="mt-4 text-2xl font-black tracking-tight">
          예약 요청이 접수되었습니다.
        </h3>
        <p className="mt-4 text-sm leading-7">
          접수 번호는 <span className="font-semibold">{submittedBookingNo}</span>
          입니다. 운영팀이 내용을 확인한 뒤 순차적으로 연락드리겠습니다.
        </p>
        <button
          type="button"
          onClick={() => {
            setSubmittedBookingNo("");
            setError("");
            setForm(buildInitialState(product));
            setGuestCount(10);
          }}
          className="mt-6 rounded-full bg-emerald-900 px-5 py-3 text-sm font-semibold text-white"
        >
          새 예약 작성
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();
        setSubmitting(true);
        setError("");

        try {
          const response = await fetch("/api/bookings", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              product_id: product.id,
              customer_name: form.manager,
              organization_name: form.organization,
              phone: form.phone,
              email: form.email,
              booking_date: form.serviceDate || new Date().toISOString(),
              guest_count: guestCount,
              request_note: [
                `카테고리: ${product.category}`,
                `서브카테고리: ${form.subcategory}`,
                `희망 결제 방식: ${form.paymentMethod}`,
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
            data?: {
              booking_no?: string;
            };
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
      className="rounded-[30px] bg-slate-950 p-8 text-white shadow-soft"
    >
      <div className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-200">
        Booking Summary
      </div>
      <h3 className="mt-4 text-2xl font-black tracking-tight">예약 요청</h3>

      <div className="mt-6 space-y-3">
        <div className="rounded-2xl bg-white/8 px-5 py-4 text-sm">
          선택 서비스: <span className="font-semibold">{product.title}</span>
        </div>
        <div className="rounded-2xl bg-white/8 px-5 py-4 text-sm">
          운영 권역: <span className="font-semibold">{product.location}</span>
        </div>
      </div>

      <div className="mt-6 rounded-2xl bg-white/8 px-5 py-5">
        <div className="text-sm text-slate-300">예상 인원</div>
        <div className="mt-3 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setGuestCount((count) => Math.max(1, count - 1))}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-lg"
          >
            -
          </button>
          <div className="min-w-16 text-center text-2xl font-black">
            {guestCount}
          </div>
          <button
            type="button"
            onClick={() => setGuestCount((count) => count + 1)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-lg"
          >
            +
          </button>
          <div className="text-sm text-slate-400">명</div>
        </div>
      </div>

      {/* 오더 #P4: 티켓 외 카테고리 → 예상 견적 렌더 차단.
          estimatedPrice / product.price 데이터·계산은 유지 (되돌리기 대비). */}

      <div className="mt-6 space-y-3">
        <input
          type="text"
          required
          placeholder="기관명 또는 단체명"
          value={form.organization}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              organization: event.target.value,
            }))
          }
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-white/30"
        />
        <input
          type="text"
          required
          placeholder="담당자명"
          value={form.manager}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              manager: event.target.value,
            }))
          }
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-white/30"
        />
        <input
          type="tel"
          required
          placeholder="연락처"
          value={form.phone}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              phone: event.target.value,
            }))
          }
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-white/30"
        />
        <input
          type="email"
          required
          placeholder="이메일"
          value={form.email}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              email: event.target.value,
            }))
          }
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-white/30"
        />
        <input
          type="date"
          required
          value={form.serviceDate}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              serviceDate: event.target.value,
            }))
          }
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-white outline-none transition focus:border-white/30"
        />

        <select
          value={form.subcategory}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              subcategory: event.target.value,
            }))
          }
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-white outline-none transition focus:border-white/30"
        >
          {product.subcategories.map((item) => (
            <option key={item} value={item} className="text-slate-900">
              서브카테고리: {item}
            </option>
          ))}
        </select>

        <select
          value={form.paymentMethod}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              paymentMethod: event.target.value,
            }))
          }
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-white outline-none transition focus:border-white/30"
        >
          {product.paymentFeatures.map((item) => (
            <option key={item} value={item} className="text-slate-900">
              결제 방식: {item}
            </option>
          ))}
        </select>

        <textarea
          rows={4}
          placeholder="희망 일정, 운영 목적, 추가 요청사항을 입력해 주세요."
          value={form.request}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              request: event.target.value,
            }))
          }
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-white/30"
        />
      </div>

      <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
        <input
          type="checkbox"
          checked={form.agree}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              agree: event.target.checked,
            }))
          }
          className="mt-1 h-4 w-4 shrink-0 accent-white"
        />
        <span className="text-sm leading-6 text-slate-300">
          개인정보 수집 및 예약 운영을 위한 이용에 동의합니다.
        </span>
      </label>

      {error && (
        <div className="mt-4 rounded-2xl border border-rose-300 bg-rose-100/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!form.agree || submitting}
        className="mt-6 w-full rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {submitting ? "예약 접수 중..." : "예약 요청 보내기"}
      </button>
    </form>
  );
}
