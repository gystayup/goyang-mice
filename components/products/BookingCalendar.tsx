"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Minus, Plus } from "lucide-react";

export interface BookingCalendarProps {
  category: "tour" | "restaurant" | "cafe" | "ticket";
  performanceDates?: Date[];
  soldOutDates?: Date[];
  timeSlots?: string[];
  fullSlots?: string[];
  onConfirm: (date: Date, timeSlot: string, count: number) => void;
}

const DEFAULT_SLOTS: Record<BookingCalendarProps["category"], string[]> = {
  tour: ["09:00", "11:00", "14:00", "16:00"],
  restaurant: ["11:30", "12:00", "12:30", "13:00", "18:00", "18:30", "19:00", "19:30", "20:00"],
  cafe: ["10:00", "11:00", "13:00", "14:00", "15:00", "16:00"],
  ticket: ["15:00", "19:00"],
};

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function toMidnight(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export default function BookingCalendar({
  category,
  performanceDates,
  soldOutDates,
  timeSlots,
  fullSlots,
  onConfirm,
}: BookingCalendarProps) {
  const today = toMidnight(new Date());

  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth()); // 0-indexed

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [count, setCount] = useState(1);

  // ── Month navigation ──────────────────────────────────────────────────────
  function goPrevMonth() {
    if (viewMonth === 0) {
      setViewYear((y) => y - 1);
      setViewMonth(11);
    } else {
      setViewMonth((m) => m - 1);
    }
  }

  function goNextMonth() {
    if (viewMonth === 11) {
      setViewYear((y) => y + 1);
      setViewMonth(0);
    } else {
      setViewMonth((m) => m + 1);
    }
  }

  // ── Calendar grid computation ─────────────────────────────────────────────
  const firstDay = new Date(viewYear, viewMonth, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  // Pad start with nulls so grid starts on correct weekday
  const cells: (Date | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(viewYear, viewMonth, i + 1)),
  ];

  // Pad end to complete the last row
  while (cells.length % 7 !== 0) cells.push(null);

  const monthLabel = new Date(viewYear, viewMonth, 1).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
  });

  // ── Date state classifiers ────────────────────────────────────────────────
  function isPast(d: Date) {
    return d < today;
  }

  function isSoldOut(d: Date) {
    return soldOutDates?.some((s) => isSameDay(s, d)) ?? false;
  }

  function isPerformanceDate(d: Date) {
    return performanceDates?.some((p) => isSameDay(p, d)) ?? false;
  }

  function isSelected(d: Date) {
    return selectedDate ? isSameDay(d, selectedDate) : false;
  }

  function handleDateClick(d: Date) {
    if (isPast(d) || isSoldOut(d)) return;
    setSelectedDate(d);
    setSelectedSlot(null); // reset time when date changes
  }

  // ── Slot list ─────────────────────────────────────────────────────────────
  const slots =
    timeSlots && timeSlots.length > 0 ? timeSlots : DEFAULT_SLOTS[category];

  // ── Count ─────────────────────────────────────────────────────────────────
  const countLabel = category === "ticket" ? "매수" : "인원";

  // ── Confirm ───────────────────────────────────────────────────────────────
  const canConfirm = selectedDate !== null && selectedSlot !== null;

  function handleConfirm() {
    if (!canConfirm) return;
    onConfirm(selectedDate!, selectedSlot!, count);
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="border-y border-slate-100 bg-white">
      {/* Month header */}
      <div className="flex items-center justify-between px-5 py-2.5">
        <button
          type="button"
          onClick={goPrevMonth}
          className="flex h-7 w-7 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 active:scale-95"
          aria-label="이전 달"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="text-sm font-black text-slate-950">{monthLabel}</span>
        <button
          type="button"
          onClick={goNextMonth}
          className="flex h-7 w-7 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 active:scale-95"
          aria-label="다음 달"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 border-t border-slate-100">
        {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
          <div
            key={day}
            className="py-1.5 text-center text-[10px] font-bold text-slate-400"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Date grid */}
      <div className="grid grid-cols-7 border-t border-slate-100 px-1 pb-2">
        {cells.map((d, idx) => {
          if (!d) {
            return <div key={`empty-${idx}`} className="h-9" />;
          }

          const past = isPast(d);
          const soldOut = isSoldOut(d);
          const selected = isSelected(d);
          const perfDate = category === "ticket" && isPerformanceDate(d);
          const disabled = past || soldOut;

          let cellCls =
            "relative mx-auto flex h-8 w-8 items-center justify-center rounded-full text-[13px] font-semibold transition select-none";

          if (selected) {
            cellCls += " bg-slate-950 text-white";
          } else if (soldOut) {
            cellCls += " bg-red-50 text-red-300 line-through cursor-not-allowed";
          } else if (past) {
            cellCls += " text-slate-300 cursor-not-allowed";
          } else if (perfDate) {
            cellCls += " bg-sky-50 text-sky-700 cursor-pointer hover:bg-sky-100";
          } else {
            cellCls += " text-slate-800 cursor-pointer hover:bg-slate-100";
          }

          return (
            <div key={d.toISOString()} className="flex h-9 items-center justify-center">
              <button
                type="button"
                disabled={disabled}
                onClick={() => handleDateClick(d)}
                className={cellCls}
                aria-label={`${d.getDate()}일${soldOut ? " (매진)" : ""}`}
              >
                {d.getDate()}
                {/* Performance dot indicator (not selected) */}
                {perfDate && !selected && (
                  <span className="absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-sky-400" />
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* ── Time slots (shown after date picked) ─────────────────────────── */}
      {selectedDate && (
        <div className="border-t border-slate-100 px-5 py-4">
          <p className="mb-3 text-sm font-bold text-slate-700">시간 선택</p>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {slots.map((slot) => {
              const isFull = fullSlots?.includes(slot) ?? false;
              const isSelectedSlot = selectedSlot === slot;

              let pillCls =
                "shrink-0 rounded-full px-4 py-2 text-sm font-bold transition";

              if (isSelectedSlot) {
                pillCls += " bg-slate-950 text-white";
              } else if (isFull) {
                pillCls +=
                  " bg-red-50 text-red-300 cursor-not-allowed line-through ring-1 ring-red-100";
              } else {
                pillCls +=
                  " bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer ring-1 ring-slate-200";
              }

              return (
                <button
                  key={slot}
                  type="button"
                  disabled={isFull}
                  onClick={() => !isFull && setSelectedSlot(slot)}
                  className={pillCls}
                >
                  {slot}
                  {isFull && (
                    <span className="ml-1 text-[10px] font-semibold text-red-300">마감</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Party count ──────────────────────────────────────────────────── */}
      {selectedDate && (
        <div className="border-t border-slate-100 px-5 py-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-slate-700">{countLabel}</p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setCount((c) => Math.max(1, c - 1))}
                disabled={count <= 1}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30"
                aria-label="줄이기"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-6 text-center text-base font-black text-slate-950">
                {count}
              </span>
              <button
                type="button"
                onClick={() => setCount((c) => Math.min(10, c + 1))}
                disabled={count >= 10}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30"
                aria-label="늘이기"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Confirm button ────────────────────────────────────────────────── */}
      <div className="border-t border-slate-100 px-5 py-4">
        <button
          type="button"
          disabled={!canConfirm}
          onClick={handleConfirm}
          className="w-full rounded-2xl bg-slate-950 py-3.5 text-base font-black text-white shadow-sm transition hover:bg-slate-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-30"
        >
          날짜 선택 완료
        </button>
        {!selectedDate && (
          <p className="mt-2 text-center text-xs text-slate-400">날짜를 먼저 선택해 주세요</p>
        )}
        {selectedDate && !selectedSlot && (
          <p className="mt-2 text-center text-xs text-slate-400">시간을 선택해 주세요</p>
        )}
      </div>
    </div>
  );
}
