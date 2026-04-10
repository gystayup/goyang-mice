"use client";

import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  CreditCard,
  Landmark,
  MessageCircleMore,
} from "lucide-react";

type BookingStatusTone = "open" | "pending" | "closed";

type BookingMetaPanelProps = {
  availabilityLabel: string;
  availabilityTone: BookingStatusTone;
  seasonLabel: string;
  reservationDate: string;
  onReservationDateChange: (value: string) => void;
  paymentMethods: string[];
  note?: string;
};

const paymentIcons: Record<string, typeof CreditCard> = {
  "크레딧카드": CreditCard,
  "카카오페이": MessageCircleMore,
  "계좌송금": Landmark,
  "법인 후불 정산": Landmark,
};

export default function BookingMetaPanel({
  availabilityLabel,
  availabilityTone,
  seasonLabel,
  reservationDate,
  onReservationDateChange,
  paymentMethods,
  note,
}: BookingMetaPanelProps) {
  const availabilityClasses =
    availabilityTone === "open"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : availabilityTone === "pending"
        ? "border-amber-200 bg-amber-50 text-amber-700"
        : "border-rose-200 bg-rose-50 text-rose-700";

  return (
    <section className="rounded-[36px] border border-slate-200 bg-white p-6 shadow-soft">
      <div className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
        Reservation Info
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <MetaCard
          label="예약 상태"
          icon={<CheckCircle2 className="h-4 w-4 text-slate-500" />}
        >
          <span
            className={`inline-flex rounded-full border px-3 py-1.5 text-sm font-semibold ${availabilityClasses}`}
          >
            {availabilityLabel}
          </span>
        </MetaCard>

        <MetaCard
          label="운영 시즌"
          icon={<Clock3 className="h-4 w-4 text-slate-500" />}
        >
          <div className="text-base font-bold text-slate-900">{seasonLabel}</div>
        </MetaCard>

        <label className="rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            <CalendarDays className="h-4 w-4 text-slate-500" />
            <span>예약 캘린더</span>
          </div>
          <input
            type="date"
            value={reservationDate}
            onChange={(event) => onReservationDateChange(event.target.value)}
            className="mt-3 w-full bg-transparent text-base font-bold text-slate-900 outline-none"
          />
        </label>
      </div>

      <div className="mt-4 rounded-[24px] border border-slate-200 bg-slate-50 p-4">
        <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
          결제방법
        </div>
        <div className="mt-3 flex flex-wrap gap-2.5">
          {paymentMethods.map((method) => {
            const Icon = paymentIcons[method] ?? CreditCard;

            return (
              <span
                key={method}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700"
              >
                <Icon className="h-4 w-4 text-slate-500" />
                {method}
              </span>
            );
          })}
        </div>
      </div>

      {note ? (
        <p className="mt-4 text-sm leading-7 text-slate-500">{note}</p>
      ) : null}
    </section>
  );
}

function MetaCard({
  label,
  icon,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-4">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
        {icon}
        <span>{label}</span>
      </div>
      <div className="mt-3">{children}</div>
    </div>
  );
}
