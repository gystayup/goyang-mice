import { Plane, Route, UserRound } from "lucide-react";

import {
  productMap,
  type AirportTransferRecord,
  type AirportTransferStatus,
} from "./admin-data";

function formatDateTime(value?: string | Date) {
  if (!value) return "-";
  return new Date(value).toLocaleString("ko-KR");
}

function formatCurrency(value?: number) {
  if (value == null) return "-";
  return `₩ ${value.toLocaleString("ko-KR")}`;
}

function getStatusClasses(status: string) {
  switch (status) {
    case "completed":
      return "bg-emerald-100 text-emerald-700";
    case "driver_assigned":
    case "boarding":
      return "bg-sky-100 text-sky-700";
    case "quoted":
      return "bg-amber-100 text-amber-700";
    case "cancelled":
      return "bg-rose-100 text-rose-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

const airportTransferStatusLabel: Record<AirportTransferStatus, string> = {
  requested: "요청 접수",
  quoted: "견적 전달",
  driver_assigned: "기사 배정",
  boarding: "탑승 진행",
  completed: "운행 완료",
  cancelled: "취소",
};

export default function AirportTransferAdminPanel({
  records,
  onCycleStatus,
}: {
  records: AirportTransferRecord[];
  onCycleStatus: (id: string) => void;
}) {
  const airportProduct = productMap.get("airport-pickup-platform");

  return (
    <div className="mt-6 space-y-6">
      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6">
          <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
            Airport Transfer Console
          </div>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
            {airportProduct?.title ?? "공항픽업 운영 관리"}
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            공항 픽업과 샌딩 예약은 여기에서 차량, 기사, 시간, 금액, 상태까지 한 번에
            관리합니다. 홈페이지에서는 예약 탐색에 집중하고, 운영은 관리자 콘솔에서
            이어지도록 분리했습니다.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <MetricCard
              label="오늘 운행"
              value={records.filter((record) => record.status === "boarding").length}
              icon={<Plane className="h-5 w-5" />}
            />
            <MetricCard
              label="배차 필요"
              value={records.filter((record) => record.status === "requested").length}
              icon={<Route className="h-5 w-5" />}
            />
            <MetricCard
              label="기사 배정"
              value={records.filter((record) => record.status === "driver_assigned").length}
              icon={<UserRound className="h-5 w-5" />}
            />
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6">
          <h3 className="text-xl font-semibold text-slate-900">운영 포인트</h3>
          <div className="mt-5 space-y-3">
            {[
              "인천공항 픽업/샌딩, 김포공항 픽업/샌딩을 노선별로 구분 운영",
              "차량 종류와 탑승 인원, 수하물 수 기준으로 배차 조정",
              "예약 접수 후 기사 배정, 공항 대기, 운행 완료 상태를 순환 관리",
              "추가 요금, 야간 운행, VIP 요청은 메모와 금액에서 함께 확인",
            ].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-7 text-slate-600"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="rounded-3xl border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-semibold text-slate-900">공항픽업 운영 목록</h2>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-sm text-slate-700">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                {[
                  "노선",
                  "출발지 / 목적지",
                  "운행 일시",
                  "탑승객",
                  "차량 / 기사",
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
                  <td className="px-4 py-4">
                    <div className="font-medium text-slate-900">{record.route_label}</div>
                    <div className="text-xs text-slate-500">{record.airport_name}</div>
                  </td>
                  <td className="px-4 py-4">
                    <div>{record.origin}</div>
                    <div className="text-xs text-slate-500">→ {record.destination}</div>
                  </td>
                  <td className="px-4 py-4">{formatDateTime(record.service_date)}</td>
                  <td className="px-4 py-4">{record.passengers}명</td>
                  <td className="px-4 py-4">
                    <div>{record.vehicle_name}</div>
                    <div className="text-xs text-slate-500">{record.driver_name}</div>
                  </td>
                  <td className="px-4 py-4">{formatCurrency(record.amount)}</td>
                  <td className="px-4 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(record.status)}`}
                    >
                      {airportTransferStatusLabel[record.status]}
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
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
      <div className="flex items-center gap-2 text-slate-600">
        {icon}
        <span className="text-sm font-medium">{label}</span>
      </div>
      <div className="mt-3 text-3xl font-bold text-slate-900">{value}</div>
    </div>
  );
}
