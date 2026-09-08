// components/tickets/TicketBookingBox.tsx — 오더 #D18 [2] visitlondon 예매형 우측 sticky 박스.
//
// 방침:
//   · 새 결제 시스템 신설 금지. 기존 /products/ticket-agency-platform/reservation?ticket={id} 재사용.
//   · 회차·잔여 상태는 데이터 미보유 (TicketProduct 는 options[]/dateText/endDate 만 보유).
//     캘린더는 dateText 파싱된 시작~endDate 범위를 "여유" 로 표시. 잔여 3단계 legend 는 UI 로만.
//     날짜 선택 시 "회차·좌석은 예매 화면에서 확인" 안내 문구 노출.
//   · 5로케일 (ko/en/ja/zh-CN/zh-TW).

"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Calendar, ChevronLeft, ChevronRight, ShieldCheck, Ticket } from "lucide-react";

import PriceKRW from "@/components/currency/PriceKRW";

export type BookingLocale = "ko" | "en" | "ja" | "zh-CN" | "zh-TW";

type Props = {
  locale: BookingLocale;
  dateText: string;
  endDate?: string;
  minPrice: number | null;
  bookingUrl: string;
  bookingLabel: string;
};

type Copy = {
  header: string;
  fromLabel: string;
  selectDate: string;
  selectedPrefix: string;
  noShowtimeInfo: string;
  legendAvailable: string;
  legendLimited: string;
  legendSoldOut: string;
  bookNow: string;
  guaranteePay: string;
  guaranteeRefund: string;
  weekdays: string[];
  monthFormat: (year: number, month: number) => string;
  dateFormat: (iso: string) => string;
};

const COPY: Record<BookingLocale, Copy> = {
  ko: {
    header: "예매",
    fromLabel: "최저",
    selectDate: "관람일 선택",
    selectedPrefix: "선택",
    noShowtimeInfo: "회차·좌석·잔여 상태는 예매 화면에서 안내됩니다.",
    legendAvailable: "여유",
    legendLimited: "마감임박",
    legendSoldOut: "매진",
    bookNow: "예매하기",
    guaranteePay: "안전 결제 (Toss 결제 · 카드/간편결제)",
    guaranteeRefund: "환불 규정은 상세 페이지 하단 참조",
    weekdays: ["일", "월", "화", "수", "목", "금", "토"],
    monthFormat: (y, m) => `${y}년 ${m + 1}월`,
    dateFormat: (iso) => {
      const [y, mo, d] = iso.split("-");
      return `${y}.${mo}.${d}`;
    },
  },
  en: {
    header: "Book",
    fromLabel: "From",
    selectDate: "Select date",
    selectedPrefix: "Selected",
    noShowtimeInfo: "Showtimes, seats, and availability are shown on the booking page.",
    legendAvailable: "Available",
    legendLimited: "Few seats",
    legendSoldOut: "Sold out",
    bookNow: "Book Now",
    guaranteePay: "Secure payment (Toss · card / one-tap)",
    guaranteeRefund: "See refund policy at the bottom of this page",
    weekdays: ["S", "M", "T", "W", "T", "F", "S"],
    monthFormat: (y, m) =>
      `${["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][m]} ${y}`,
    dateFormat: (iso) => iso,
  },
  ja: {
    header: "予約",
    fromLabel: "最安",
    selectDate: "観覧日を選択",
    selectedPrefix: "選択",
    noShowtimeInfo: "上演回・座席・残席状況は予約画面でご案内します。",
    legendAvailable: "空きあり",
    legendLimited: "残りわずか",
    legendSoldOut: "完売",
    bookNow: "予約する",
    guaranteePay: "安全な決済 (Toss · カード / 簡単決済)",
    guaranteeRefund: "返金規定はページ下部をご参照ください",
    weekdays: ["日", "月", "火", "水", "木", "金", "土"],
    monthFormat: (y, m) => `${y}年 ${m + 1}月`,
    dateFormat: (iso) => iso.replace(/-/g, "."),
  },
  "zh-CN": {
    header: "预约",
    fromLabel: "起价",
    selectDate: "选择观演日期",
    selectedPrefix: "已选",
    noShowtimeInfo: "场次·座位·余票状态在预约页面查看。",
    legendAvailable: "有余票",
    legendLimited: "余票少",
    legendSoldOut: "售罄",
    bookNow: "立即预约",
    guaranteePay: "安全支付 (Toss · 银行卡 / 一键支付)",
    guaranteeRefund: "退款规定请参考页面底部",
    weekdays: ["日", "一", "二", "三", "四", "五", "六"],
    monthFormat: (y, m) => `${y}年 ${m + 1}月`,
    dateFormat: (iso) => iso.replace(/-/g, "."),
  },
  "zh-TW": {
    header: "預約",
    fromLabel: "起價",
    selectDate: "選擇觀演日期",
    selectedPrefix: "已選",
    noShowtimeInfo: "場次·座位·餘票狀態在預約頁面查看。",
    legendAvailable: "有餘票",
    legendLimited: "餘票少",
    legendSoldOut: "售罄",
    bookNow: "立即預約",
    guaranteePay: "安全支付 (Toss · 銀行卡 / 一鍵支付)",
    guaranteeRefund: "退款規定請參考頁面底部",
    weekdays: ["日", "一", "二", "三", "四", "五", "六"],
    monthFormat: (y, m) => `${y}年 ${m + 1}月`,
    dateFormat: (iso) => iso.replace(/-/g, "."),
  },
};

/** dateText 에서 첫 YYYY.MM.DD or YYYY-MM-DD 파싱 → ISO. */
function parseFirstDate(text: string): string | null {
  const m = text.match(/(\d{4})[.\-/](\d{1,2})[.\-/](\d{1,2})/);
  if (!m) return null;
  const [, y, mo, d] = m;
  return `${y}-${mo.padStart(2, "0")}-${d.padStart(2, "0")}`;
}

function isoToDate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function dateToIso(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function TicketBookingBox({
  locale,
  dateText,
  endDate,
  minPrice,
  bookingUrl,
  bookingLabel,
}: Props) {
  const copy = COPY[locale];

  const { startIso, endIso } = useMemo(() => {
    const start = parseFirstDate(dateText);
    const end = endDate ?? parseFirstDate(dateText.split(/[-~,]/).slice(-1)[0] ?? "") ?? start;
    return { startIso: start, endIso: end };
  }, [dateText, endDate]);

  const initialMonth = useMemo(() => {
    if (startIso) {
      const d = isoToDate(startIso);
      return { year: d.getFullYear(), month: d.getMonth() };
    }
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  }, [startIso]);

  const [monthState, setMonthState] = useState(initialMonth);
  const [selectedIso, setSelectedIso] = useState<string | null>(startIso);

  const availableSet = useMemo(() => {
    if (!startIso || !endIso) return new Set<string>();
    const set = new Set<string>();
    const s = isoToDate(startIso);
    const e = isoToDate(endIso);
    for (let d = new Date(s); d <= e; d.setDate(d.getDate() + 1)) {
      set.add(dateToIso(d));
    }
    return set;
  }, [startIso, endIso]);

  const monthGrid = useMemo(() => {
    const first = new Date(monthState.year, monthState.month, 1);
    const startDow = first.getDay();
    const daysInMonth = new Date(monthState.year, monthState.month + 1, 0).getDate();
    const cells: Array<{ iso: string; day: number; inMonth: boolean }> = [];
    // 이전 달 채움
    for (let i = 0; i < startDow; i++) {
      const d = new Date(monthState.year, monthState.month, -startDow + i + 1);
      cells.push({ iso: dateToIso(d), day: d.getDate(), inMonth: false });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const dt = new Date(monthState.year, monthState.month, d);
      cells.push({ iso: dateToIso(dt), day: d, inMonth: true });
    }
    // 다음 달 채움 → 7의 배수
    while (cells.length % 7 !== 0) {
      const last = cells[cells.length - 1];
      const dt = isoToDate(last.iso);
      dt.setDate(dt.getDate() + 1);
      cells.push({ iso: dateToIso(dt), day: dt.getDate(), inMonth: false });
    }
    return cells;
  }, [monthState]);

  function shiftMonth(delta: number) {
    setMonthState((prev) => {
      const d = new Date(prev.year, prev.month + delta, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
  }

  return (
    <aside className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_2px_12px_rgba(16,32,58,0.06)] lg:sticky lg:top-24">
      {/* 상단 코럴레드 헤더 */}
      <div className="flex items-center justify-between px-4 py-3" style={{ background: "var(--accent)" }}>
        <div className="flex items-center gap-2 text-white">
          <Ticket className="h-4 w-4" aria-hidden="true" />
          <span className="text-sm font-black uppercase tracking-[0.14em]">{copy.header}</span>
        </div>
        {minPrice ? (
          <div className="text-right text-white">
            <div className="text-[10px] font-semibold uppercase tracking-[0.14em] opacity-80">
              {copy.fromLabel}
            </div>
            <PriceKRW krw={minPrice} className="text-sm font-black text-white" suffix=" ~" />
          </div>
        ) : null}
      </div>

      <div className="p-4">
        {/* 캘린더 헤더 (월 이동) */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => shiftMonth(-1)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-600 transition hover:bg-slate-100"
            aria-label="Previous month"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="text-sm font-bold text-[#232322]">
            {copy.monthFormat(monthState.year, monthState.month)}
          </div>
          <button
            type="button"
            onClick={() => shiftMonth(1)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-600 transition hover:bg-slate-100"
            aria-label="Next month"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* 요일 헤더 */}
        <div className="mt-3 grid grid-cols-7 gap-1 text-center text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-400">
          {copy.weekdays.map((w, i) => (
            <div key={i} className={i === 0 ? "text-[var(--accent)]" : ""}>
              {w}
            </div>
          ))}
        </div>

        {/* 날짜 그리드 */}
        <div className="mt-1 grid grid-cols-7 gap-1">
          {monthGrid.map((c) => {
            const isAvailable = availableSet.has(c.iso);
            const isSelected = selectedIso === c.iso;
            const disabled = !c.inMonth || !isAvailable;
            return (
              <button
                key={c.iso}
                type="button"
                onClick={() => {
                  if (!disabled) setSelectedIso(c.iso);
                }}
                disabled={disabled}
                className={[
                  "relative flex h-9 items-center justify-center rounded-md text-xs font-semibold transition",
                  !c.inMonth
                    ? "text-slate-300"
                    : disabled
                      ? "text-slate-400"
                      : isSelected
                        ? "bg-[var(--accent)] text-white"
                        : "text-[#232322] hover:bg-[var(--accent)]/10",
                ].join(" ")}
              >
                {c.day}
                {isAvailable && !isSelected && (
                  <span
                    aria-hidden="true"
                    className="absolute bottom-1 h-1 w-1 rounded-full"
                    style={{ background: "#22c55e" }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* 잔여 legend */}
        <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-3 text-[10px] text-slate-500">
          <span className="flex items-center gap-1">
            <span className="inline-block h-2 w-2 rounded-full" style={{ background: "#22c55e" }} />
            {copy.legendAvailable}
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-2 w-2 rounded-full" style={{ background: "#f59e0b" }} />
            {copy.legendLimited}
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-2 w-2 rounded-full" style={{ background: "#cbd5e1" }} />
            {copy.legendSoldOut}
          </span>
        </div>

        {/* 선택 결과 표시 */}
        <div className="mt-4 rounded-xl bg-slate-50 p-3">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="font-semibold uppercase tracking-[0.14em]">{copy.selectDate}</span>
          </div>
          <div className="mt-1 text-sm font-bold text-[#232322]">
            {selectedIso ? `${copy.selectedPrefix} · ${copy.dateFormat(selectedIso)}` : dateText}
          </div>
          <p className="mt-2 text-[11px] leading-relaxed text-slate-500">{copy.noShowtimeInfo}</p>
        </div>

        {/* CTA */}
        <a
          href={bookingUrl}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-black text-white transition hover:brightness-110"
          style={{ background: "var(--accent)" }}
        >
          <span>{bookingLabel}</span>
          <ArrowRight className="h-4 w-4" />
        </a>

        {/* 보증 문구 */}
        <ul className="mt-3 space-y-1.5 text-[11px] text-slate-600">
          <li className="flex items-start gap-1.5">
            <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" aria-hidden="true" />
            <span>{copy.guaranteePay}</span>
          </li>
          <li className="flex items-start gap-1.5">
            <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" aria-hidden="true" />
            <span>{copy.guaranteeRefund}</span>
          </li>
        </ul>
      </div>
    </aside>
  );
}
