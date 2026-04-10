import { CalendarDays, Ticket, Wallet } from "lucide-react";

import type { TicketingRecord, TicketingStatus } from "./admin-data";

function formatDate(value?: string | Date) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("ko-KR");
}

function formatCurrency(value?: number) {
  if (value == null) return "-";
  return `₩ ${value.toLocaleString("ko-KR")}`;
}

function getStatusClasses(status: string) {
  switch (status) {
    case "issued":
      return "bg-emerald-100 text-emerald-700";
    case "ready_to_issue":
      return "bg-amber-100 text-amber-700";
    case "refunded":
      return "bg-violet-100 text-violet-700";
    case "cancelled":
      return "bg-rose-100 text-rose-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

const ticketingStatusLabel: Record<TicketingStatus, string> = {
  received: "접수",
  ready_to_issue: "발권 준비",
  issued: "발권 완료",
  refunded: "환불 완료",
  cancelled: "취소",
};

export default function TicketingAdminPanel({
  records,
  onCycleStatus,
}: {
  records: TicketingRecord[];
  onCycleStatus: (id: string) => void;
}) {
  return (
    <div className="mt-6 space-y-6">
      <section className="grid gap-6 xl:grid-cols-3">
        <MetricCard
          icon={<Ticket className="h-5 w-5" />}
          label="발권 대기"
          value={records.filter((item) => item.status === "ready_to_issue").length}
        />
        <MetricCard
          icon={<CalendarDays className="h-5 w-5" />}
          label="이번 주 공연"
          value={records.length}
        />
        <MetricCard
          icon={<Wallet className="h-5 w-5" />}
          label="티켓 매출"
          value={records.reduce((sum, item) => sum + item.amount, 0)}
          currency
        />
      </section>

      <div className="rounded-3xl border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-semibold text-slate-900">티켓 발권 운영 목록</h2>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-sm text-slate-700">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                {[
                  "상품명",
                  "옵션",
                  "공연장",
                  "공연일",
                  "구매자",
                  "수량",
                  "금액",
                  "상태",
                  "메모",
                  "운영",
                ].map((column) => (
                  <th key={column} className="px-4 py-4 text-left">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-4 font-medium text-slate-900">{record.ticket_name}</td>
                  <td className="px-4 py-4">{record.option_label}</td>
                  <td className="px-4 py-4">{record.venue}</td>
                  <td className="px-4 py-4">{formatDate(record.event_date)}</td>
                  <td className="px-4 py-4">{record.purchaser_name}</td>
                  <td className="px-4 py-4">{record.quantity}매</td>
                  <td className="px-4 py-4">{formatCurrency(record.amount)}</td>
                  <td className="px-4 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(record.status)}`}
                    >
                      {ticketingStatusLabel[record.status]}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-slate-500">{record.note}</td>
                  <td className="px-4 py-4 text-right">
                    <button
                      onClick={() => onCycleStatus(record.id)}
                      className="rounded-2xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
                    >
                      상태 변경
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  icon,
  label,
  value,
  currency = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  currency?: boolean;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6">
      <div className="flex items-center gap-3 text-slate-600">
        {icon}
        <span className="text-sm font-medium">{label}</span>
      </div>
      <div className="mt-4 text-3xl font-semibold text-slate-900">
        {currency ? `₩ ${value.toLocaleString("ko-KR")}` : value}
      </div>
    </div>
  );
}
