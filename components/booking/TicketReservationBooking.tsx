"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { ArrowRight, CalendarDays, Clock, MapPinned, Users } from "lucide-react";

import BookingMetaPanel from "@/components/booking/BookingMetaPanel";
import { getTicketProduct, type TicketProduct } from "@/data/ticket-booking";
import type { Product } from "@/data/products";

type TicketReservationBookingProps = {
  product: Product;
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

const paymentMethods = ["크레딧카드", "카카오페이", "계좌송금", "법인 후불 정산"];
const ticketSeasonLabels: Record<TicketProduct["category"], string> = {
  concert: "공연 시즌 운영",
  festival: "축제 시즌 운영",
  exhibition: "전시 시즌 운영",
  family: "가족 프로그램 시즌",
  "k-pop": "K-POP 시즌 운영",
  // 오더 #C51: 신규 3종 (activity·admission·tour) 시즌 라벨.
  activity: "체험 프로그램 시즌",
  admission: "입장권 상시 운영",
  tour: "투어 시즌 운영",
};

export default function TicketReservationBooking({
  product,
  initialTicketId,
  initialTicket,
  initialOptionId,
  initialCount,
  initialDate,
}: TicketReservationBookingProps) {
  const ticket = initialTicket ?? getTicketProduct(initialTicketId);
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
    ticket.options.find((option) => option.id === selectedOptionId) ?? ticket.options[0];

  const totalAmount = useMemo(
    () => (selectedOption?.price ?? 0) * ticketCount,
    [selectedOption?.price, ticketCount]
  );

  if (submittedBookingNo) {
    return (
      <div className="rounded-[36px] border border-emerald-200 bg-emerald-50 p-8 text-emerald-950 shadow-soft">
        <div className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
          Ticket Reservation
        </div>
        <h3 className="mt-4 text-3xl font-black tracking-tight">
          티켓 예약이 접수되었습니다.
        </h3>
        <p className="mt-4 max-w-3xl text-sm leading-7">
          예약 번호는 <span className="font-bold">{submittedBookingNo}</span> 입니다.
          선택하신 좌석/패키지와 결제방법(참고)이 함께 접수되었으며, 관리자가 발권과
          진행 상태를 이어서 안내드립니다.
        </p>
        <button
          type="button"
          onClick={() => {
            setSubmittedBookingNo("");
            setError("");
          }}
          className="mt-6 rounded-full bg-emerald-900 px-5 py-3 text-sm font-semibold text-white"
        >
          다시 예약 작성
        </button>
      </div>
    );
  }

  return (
    <div className="mt-10 space-y-6">

      {/* ── 인터파크 스타일 티켓 소개 섹션 ── */}
      <section className="overflow-hidden rounded-[36px] border border-slate-200 bg-white shadow-soft">
        <div className="grid gap-0 md:grid-cols-[280px_1fr]">
          {/* 포스터 */}
          <div className="flex items-stretch">
            {ticket.imageUrl ? (
              <div className="relative min-h-[320px] w-full md:min-h-0">
                <Image
                  src={ticket.imageUrl}
                  alt={ticket.title}
                  fill
                  className="object-cover object-top"
                  sizes="280px"
                />
              </div>
            ) : (
              <div className={`flex w-full flex-col justify-end bg-gradient-to-br ${ticket.imageTone} p-8 text-slate-950`}>
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">{ticket.badge}</div>
                <div className="mt-3 text-5xl font-black tracking-tight">{ticket.posterLabel}</div>
                <div className="mt-4 text-2xl font-black leading-tight">{ticket.title}</div>
              </div>
            )}
          </div>

          {/* 상세 정보 */}
          <div className="p-8 md:p-10">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-bold text-indigo-700">
                {ticket.badge || "티켓"}
              </span>
              {ticket.subtitle && (
                <span className="text-sm text-slate-500">{ticket.subtitle}</span>
              )}
            </div>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 md:text-4xl">
              {ticket.title}
            </h2>
            <p className="mt-4 text-sm leading-8 text-slate-600">{ticket.description}</p>

            {/* 공연 정보 그리드 */}
            <div className="mt-6 divide-y divide-slate-100 rounded-[20px] border border-slate-200">
              <InfoRow icon={<MapPinned className="h-4 w-4 text-indigo-500" />} label="장소" value={ticket.venue} />
              <InfoRow icon={<CalendarDays className="h-4 w-4 text-indigo-500" />} label="공연기간" value={ticket.dateText} />
              {ticket.duration && (
                <InfoRow icon={<Clock className="h-4 w-4 text-indigo-500" />} label="공연시간" value={ticket.duration} />
              )}
              {ticket.ageLimit && (
                <InfoRow icon={<Users className="h-4 w-4 text-indigo-500" />} label="관람연령" value={ticket.ageLimit} />
              )}
            </div>

            {/* 좌석 등급별 가격 */}
            {ticket.options.length > 0 && (
              <div className="mt-6">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">전체 가격 보기</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {ticket.options.map((opt) => (
                    <div key={opt.id} className="rounded-[16px] border border-slate-200 bg-slate-50 px-4 py-3 text-center">
                      <div className="text-xs font-bold text-slate-600">{opt.label}</div>
                      <div className="mt-1 text-base font-black text-slate-950">
                        {opt.price.toLocaleString("ko-KR")}원
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 태그 */}
            <div className="mt-5 flex flex-wrap gap-2">
              {ticket.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 예약 폼 그리드 ── */}
    <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="space-y-6">
        <section className="overflow-hidden rounded-[36px] border border-slate-200 bg-white shadow-soft">
          <div className="grid gap-0 md:grid-cols-[0.75fr_1.25fr]">
            <div className={`bg-gradient-to-br ${ticket.imageTone} p-8 text-slate-950`}>
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-700">
                {ticket.badge}
              </div>
              <div className="mt-5 text-5xl font-black tracking-tight">{ticket.posterLabel}</div>
              <div className="mt-8 text-3xl font-black leading-tight">{ticket.title}</div>
            </div>

            <div className="p-8 md:p-10">
              <div className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">
                Selected Ticket
              </div>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
                {ticket.title}
              </h2>
              <p className="mt-3 text-base text-slate-500">{ticket.subtitle}</p>
              <p className="mt-5 text-sm leading-8 text-slate-600">{ticket.description}</p>

              <div className="mt-6 grid gap-3 md:grid-cols-2">
                <InfoCard
                  icon={<MapPinned className="h-4 w-4 text-slate-500" />}
                  label="공연장"
                  value={ticket.venue}
                />
                <InfoCard
                  icon={<CalendarDays className="h-4 w-4 text-slate-500" />}
                  label="공연 일정"
                  value={ticket.dateText}
                />
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {ticket.tags.map((tag) => (
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
          availabilityLabel={ticket.badge.includes("오픈 예정") ? "오픈 예정" : "예약 가능"}
          availabilityTone={ticket.badge.includes("오픈 예정") ? "pending" : "open"}
          seasonLabel={ticketSeasonLabels[ticket.category]}
          reservationDate={reservationDate}
          onReservationDateChange={setReservationDate}
          paymentMethods={paymentMethods}
          note="공연 일정과 좌석 패키지를 확인한 뒤 예약 날짜와 결제방법(참고)을 정하면 티켓 예약이 접수되고, 발권·정산은 관리자가 별도로 안내드립니다."
        />

        <section className="rounded-[36px] border border-slate-200 bg-white p-6 shadow-soft">
          <div className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Ticket Options
          </div>
          <div className="mt-5 grid gap-4">
            {ticket.options.map((option) => (
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
              headers: {
                "Content-Type": "application/json",
              },
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
          Ticket Reservation
        </div>
        <h3 className="mt-4 text-3xl font-black tracking-tight">예약 신청</h3>

        <div className="mt-6 space-y-3">
          <SummaryRow label="선택 공연" value={ticket.title} />
          <SummaryRow label="좌석/패키지" value={selectedOption?.label ?? "-"} />
          <SummaryRow label="예약 날짜" value={reservationDate} />
          <SummaryRow label="공연장" value={ticket.venue} />
        </div>

        <div className="mt-6 rounded-[28px] bg-white/12 px-5 py-5">
          <div className="text-sm font-semibold text-slate-200">티켓 수량</div>
          <div className="mt-3 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setTicketCount((count) => Math.max(1, count - 1))}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 text-lg hover:bg-white/10 transition"
            >
              -
            </button>
            <div className="min-w-16 text-center text-2xl font-black">{ticketCount}</div>
            <button
              type="button"
              onClick={() => setTicketCount((count) => count + 1)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 text-lg hover:bg-white/10 transition"
            >
              +
            </button>
            <div className="text-sm text-slate-300">매</div>
          </div>
        </div>

        <div className="mt-4 rounded-[28px] bg-white/12 px-5 py-5">
          <div className="text-sm font-semibold text-slate-200">예상 금액 (예약 접수 기준)</div>
          <div className="mt-2 text-3xl font-black">
            {totalAmount.toLocaleString("ko-KR")}원
          </div>
          <p className="mt-2 text-xs leading-6 text-slate-300">
            예약 접수 후 관리자가 확인해 발권 가능 여부와 결제·정산 진행 상태를
            안내드립니다.
          </p>
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
              결제 방식 (참고)
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
            placeholder="좌석 요청, 단체 발권, 세금계산서 요청 등 추가 내용을 적어 주세요."
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
            개인정보 수집 및 티켓 예약·발권 안내를 위한 연락에 동의합니다.
          </span>
        </label>

        {error && (
          <div className="mt-4 rounded-[24px] border border-rose-300 bg-rose-100/10 px-4 py-3 text-sm text-rose-200">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting || !form.agree}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {submitting ? "예약 접수 중..." : "티켓 예약 요청"}
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>
    </div>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-4 px-5 py-3">
      <div className="flex w-24 shrink-0 items-center gap-2 text-xs font-semibold text-slate-500">
        {icon}
        <span>{label}</span>
      </div>
      <div className="text-sm font-medium text-slate-800">{value}</div>
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
