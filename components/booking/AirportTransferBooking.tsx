"use client";

import { useMemo, useState } from "react";
import { ArrowRight, CheckCircle2, Luggage, Plane, Users } from "lucide-react";

import BookingMetaPanel from "@/components/booking/BookingMetaPanel";
import {
  airportTransferRoutes,
  getAirportTransferRoute,
  getAirportTransferVehicle,
  getAirportVehiclesByRoute,
  getInitialAirportTransferSearch,
  type AirportTransferMode,
  type AirportTransferRouteId,
} from "@/data/airport-transfer";
import type { Product } from "@/data/products";

type AirportTransferBookingProps = {
  product: Product;
  initialRouteId?: string;
  initialMode?: string;
  initialVehicleId?: string;
  initialFrom?: string;
  initialTo?: string;
  initialDepartureDate?: string;
  initialPassengers?: string;
};

type FormState = {
  organization: string;
  manager: string;
  phone: string;
  email: string;
  paymentMethod: string;
  flightNumber: string;
  request: string;
  agree: boolean;
};

const paymentMethods = ["크레딧카드", "카카오페이", "계좌송금", "법인 후불 정산"];

const initialFormState: FormState = {
  organization: "",
  manager: "",
  phone: "",
  email: "",
  paymentMethod: paymentMethods[0],
  flightNumber: "",
  request: "",
  agree: false,
};

export default function AirportTransferBooking({
  product,
  initialRouteId,
  initialMode,
  initialVehicleId,
  initialFrom,
  initialTo,
  initialDepartureDate,
  initialPassengers,
}: AirportTransferBookingProps) {
  const fallbackRouteId =
    (airportTransferRoutes.find((route) => route.id === initialRouteId)?.id ??
      (initialMode === "sending" ? "icn-sending" : "icn-pickup")) as AirportTransferRouteId;

  const [search, setSearch] = useState(() => {
    const base = getInitialAirportTransferSearch(
      fallbackRouteId,
      initialDepartureDate,
      Number(initialPassengers) || 3
    );

    return {
      ...base,
      from: initialFrom || base.from,
      to: initialTo || base.to,
    };
  });
  const [selectedVehicleId, setSelectedVehicleId] = useState(() => {
    const routeVehicles = getAirportVehiclesByRoute(fallbackRouteId);

    return (
      routeVehicles.find((vehicle) => vehicle.id === initialVehicleId)?.id ??
      routeVehicles[0]?.id ??
      ""
    );
  });
  const [form, setForm] = useState<FormState>(initialFormState);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [submittedBookingNo, setSubmittedBookingNo] = useState("");

  const activeRoute =
    getAirportTransferRoute(search.routeId) ?? airportTransferRoutes[0];

  const visibleRoutes = useMemo(
    () => airportTransferRoutes.filter((route) => route.mode === search.mode),
    [search.mode]
  );

  const visibleVehicles = useMemo(
    () =>
      getAirportVehiclesByRoute(search.routeId).filter(
        (vehicle) => vehicle.seats >= search.passengers
      ),
    [search.passengers, search.routeId]
  );

  const selectedVehicle =
    getAirportTransferVehicle(selectedVehicleId) ?? visibleVehicles[0];

  const handleModeChange = (mode: AirportTransferMode) => {
    const nextRoute =
      airportTransferRoutes.find((route) => route.mode === mode) ?? airportTransferRoutes[0];

    setSearch((current) => ({
      ...getInitialAirportTransferSearch(nextRoute.id, current.departureDate, current.passengers),
      from: nextRoute.fromLabel,
      to: nextRoute.toLabel,
    }));

    const nextVehicle = getAirportVehiclesByRoute(nextRoute.id)[0];
    setSelectedVehicleId(nextVehicle?.id ?? "");
  };

  const handleRouteChange = (routeId: AirportTransferRouteId) => {
    const route = getAirportTransferRoute(routeId);

    if (!route) return;

    setSearch((current) => ({
      ...current,
      routeId,
      mode: route.mode,
      from: route.fromLabel,
      to: route.toLabel,
    }));

    const nextVehicle = getAirportVehiclesByRoute(routeId)[0];
    setSelectedVehicleId(nextVehicle?.id ?? "");
  };

  if (submittedBookingNo) {
    return (
      <div className="rounded-[36px] border border-emerald-200 bg-emerald-50 p-8 text-emerald-950 shadow-soft">
        <div className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
          Airport Transfer Booking
        </div>
        <h3 className="mt-4 text-3xl font-black tracking-tight">
          공항 이동 예약이 접수되었습니다
        </h3>
        <p className="mt-4 max-w-3xl text-sm leading-7">
          예약 번호는 <span className="font-bold">{submittedBookingNo}</span> 입니다.
          관리자 페이지에서 차량 배차, 기사 배정, 결제 상태까지 바로 관리할 수 있도록
          접수되었습니다.
        </p>
        <button
          type="button"
          onClick={() => {
            setSubmittedBookingNo("");
            setError("");
            setForm(initialFormState);
          }}
          className="mt-6 rounded-full bg-emerald-900 px-5 py-3 text-sm font-semibold text-white"
        >
          새 예약 작성
        </button>
      </div>
    );
  }

  return (
    <div className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="space-y-6">
        <section className="rounded-[36px] border border-slate-200 bg-white p-6 shadow-soft md:p-7">
          <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
            <div className="rounded-[30px] bg-[linear-gradient(135deg,_#081b4b_0%,_#1d4ed8_48%,_#7dd3fc_100%)] p-6 text-white">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-100">
                Transfer Route
              </div>
              <h3 className="mt-3 text-2xl font-black tracking-tight">
                {activeRoute.label}
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-100">
                {activeRoute.desc}
              </p>
              <div className="mt-5 rounded-[24px] bg-white/12 px-4 py-4 text-sm leading-7 text-slate-100">
                {activeRoute.heroNote}
              </div>
            </div>

            <div className="rounded-[30px] border border-slate-200 bg-slate-50 p-5">
              <div className="flex flex-wrap gap-3">
                {[
                  { id: "pickup" as const, label: "공항 픽업" },
                  { id: "sending" as const, label: "공항 샌딩" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleModeChange(item.id)}
                    className={`rounded-full px-4 py-2.5 text-sm font-semibold transition ${
                      search.mode === item.id
                        ? "bg-slate-950 text-white"
                        : "border border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <div className="mt-4 grid gap-3">
                {visibleRoutes.map((route) => (
                  <button
                    key={route.id}
                    type="button"
                    onClick={() => handleRouteChange(route.id)}
                    className={`rounded-[24px] border px-4 py-4 text-left transition ${
                      route.id === search.routeId
                        ? "border-slate-950 bg-white text-slate-950"
                        : "border-slate-200 bg-white/70 text-slate-700 hover:border-slate-300"
                    }`}
                  >
                    <div className="font-bold">{route.label}</div>
                    <div className="mt-1 text-sm text-slate-500">
                      {route.fromLabel} → {route.toLabel}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <FieldCard
              label="출발지"
              value={search.from}
              onChange={(value) => setSearch((current) => ({ ...current, from: value }))}
            />
            <FieldCard
              label="목적지"
              value={search.to}
              onChange={(value) => setSearch((current) => ({ ...current, to: value }))}
            />
            <FieldCard
              label="출발일"
              type="datetime-local"
              value={search.departureDate}
              onChange={(value) =>
                setSearch((current) => ({ ...current, departureDate: value }))
              }
            />
            <label className="rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-3">
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                탑승객
              </div>
              <select
                value={search.passengers}
                onChange={(event) =>
                  setSearch((current) => ({
                    ...current,
                    passengers: Number(event.target.value),
                  }))
                }
                className="mt-2 w-full bg-transparent text-lg font-bold text-slate-900 outline-none"
              >
                {Array.from({ length: 12 }).map((_, index) => (
                  <option key={index + 1} value={index + 1}>
                    {index + 1}명
                  </option>
                ))}
              </select>
            </label>
          </div>
        </section>

        <BookingMetaPanel
          availabilityLabel={visibleVehicles.length > 0 ? "예약 가능" : "예약 마감"}
          availabilityTone={visibleVehicles.length > 0 ? "open" : "closed"}
          seasonLabel="상시 운영"
          reservationDate={search.departureDate.slice(0, 10)}
          onReservationDateChange={(value) =>
            setSearch((current) => ({
              ...current,
              departureDate: `${value}T${(current.departureDate.split("T")[1] ?? "09:00")}`,
            }))
          }
          paymentMethods={paymentMethods}
          note="공항 픽업과 샌딩은 차량 가용 대수와 탑승 인원 기준으로 예약 가능 여부가 바뀌며, 선택한 날짜를 기준으로 운영팀이 배차를 확정합니다."
        />

        <section className="space-y-4">
          {visibleVehicles.map((vehicle) => (
            <button
              key={vehicle.id}
              type="button"
              onClick={() => setSelectedVehicleId(vehicle.id)}
              className={`w-full rounded-[36px] border p-6 text-left shadow-soft transition ${
                selectedVehicleId === vehicle.id
                  ? "border-slate-950 bg-slate-950 text-white"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="flex gap-4">
                  <div
                    className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-[24px] ${
                      selectedVehicleId === vehicle.id
                        ? "bg-white/12 text-white"
                        : "bg-[linear-gradient(135deg,_#dbeafe_0%,_#fdf2f8_100%)] text-slate-900"
                    }`}
                  >
                    <Plane className="h-7 w-7" />
                  </div>
                  <div>
                    <div
                      className={`text-xs font-semibold uppercase tracking-[0.18em] ${
                        selectedVehicleId === vehicle.id ? "text-cyan-100" : "text-slate-500"
                      }`}
                    >
                      {vehicle.operator}
                    </div>
                    <h3 className="mt-2 text-2xl font-black tracking-tight">
                      {vehicle.name}
                    </h3>
                    <p
                      className={`mt-2 text-sm leading-7 ${
                        selectedVehicleId === vehicle.id ? "text-slate-200" : "text-slate-600"
                      }`}
                    >
                      {vehicle.desc}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {vehicle.badges.map((badge) => (
                        <span
                          key={badge}
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            selectedVehicleId === vehicle.id
                              ? "bg-white/12 text-white"
                              : "bg-emerald-50 text-emerald-700"
                          }`}
                        >
                          {badge}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="md:text-right">
                  <div
                    className={`text-xs font-semibold uppercase tracking-[0.18em] ${
                      selectedVehicleId === vehicle.id ? "text-cyan-100" : "text-slate-500"
                    }`}
                  >
                    예약가
                  </div>
                  <div className="mt-2 text-3xl font-black tracking-tight">
                    ₩ {vehicle.price.toLocaleString("ko-KR")}
                  </div>
                  <p
                    className={`mt-2 text-sm ${
                      selectedVehicleId === vehicle.id ? "text-slate-200" : "text-slate-500"
                    }`}
                  >
                    세금 및 수수료 포함
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-3">
                <InfoBadge
                  selected={selectedVehicleId === vehicle.id}
                  icon={<Users className="h-4 w-4" />}
                  text={`${vehicle.seats}명 탑승`}
                />
                <InfoBadge
                  selected={selectedVehicleId === vehicle.id}
                  icon={<Luggage className="h-4 w-4" />}
                  text={`수하물 ${vehicle.luggage}개`}
                />
                <InfoBadge
                  selected={selectedVehicleId === vehicle.id}
                  icon={<CheckCircle2 className="h-4 w-4" />}
                  text={vehicle.etaNote}
                />
              </div>
            </button>
          ))}
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
                booking_date: search.departureDate || new Date().toISOString(),
                guest_count: search.passengers,
                unit_price: selectedVehicle?.price ?? 0,
                total_price: selectedVehicle?.price ?? 0,
                request_note: [
                  `공항 서비스: ${activeRoute.label}`,
                  `이동 방식: ${search.mode === "pickup" ? "픽업" : "샌딩"}`,
                  `출발지: ${search.from}`,
                  `목적지: ${search.to}`,
                  `선택 차량: ${selectedVehicle?.name ?? "미선택"}`,
                  selectedVehicle ? `차량 금액: ₩ ${selectedVehicle.price.toLocaleString("ko-KR")}` : "",
                  form.flightNumber ? `항공편 정보: ${form.flightNumber}` : "",
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
          Booking Summary
        </div>
        <h3 className="mt-4 text-3xl font-black tracking-tight">공항픽업 예약</h3>

        <div className="mt-6 space-y-3">
          <SummaryRow label="노선" value={activeRoute.label} />
          <SummaryRow label="이동 경로" value={`${search.from} → ${search.to}`} />
          <SummaryRow
            label="출발 일시"
            value={
              search.departureDate
                ? new Date(search.departureDate).toLocaleString("ko-KR")
                : "-"
            }
          />
          <SummaryRow label="차량" value={selectedVehicle?.name ?? "-"} />
          <SummaryRow label="탑승객" value={`${search.passengers}명`} />
          <SummaryRow
            label="예약 금액"
            value={
              selectedVehicle
                ? `₩ ${selectedVehicle.price.toLocaleString("ko-KR")}`
                : "-"
            }
          />
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
          <label className="rounded-[24px] border border-white/10 bg-white/5 px-4 py-3.5">
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
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
          <FormInput
            placeholder="항공편명 또는 행사 스케줄 코드"
            value={form.flightNumber}
            onChange={(value) => setForm((current) => ({ ...current, flightNumber: value }))}
          />
          <textarea
            rows={4}
            placeholder="기사 미팅보드명, 수하물 정보, VIP 요청, 공연 일정 등 추가 요청을 남겨주세요."
            value={form.request}
            onChange={(event) =>
              setForm((current) => ({ ...current, request: event.target.value }))
            }
            className="w-full rounded-[24px] border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-white/30"
          />
        </div>

        <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-[24px] border border-white/10 bg-white/5 px-4 py-4">
          <input
            type="checkbox"
            checked={form.agree}
            onChange={(event) =>
              setForm((current) => ({ ...current, agree: event.target.checked }))
            }
            className="mt-1 h-4 w-4 shrink-0 accent-white"
          />
          <span className="text-sm leading-6 text-slate-300">
            개인정보 수집 및 공항픽업 예약 운영을 위한 연락에 동의합니다.
          </span>
        </label>

        {error && (
          <div className="mt-4 rounded-[24px] border border-rose-300 bg-rose-100/10 px-4 py-3 text-sm text-rose-200">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting || !form.agree || !selectedVehicle}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {submitting ? "예약 접수 중..." : "공항픽업 예약 요청"}
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}

function FieldCard({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "datetime-local";
}) {
  return (
    <label className="rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-3">
      <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
        {label}
      </div>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full bg-transparent text-lg font-bold text-slate-900 outline-none"
      />
    </label>
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
      className="w-full rounded-[24px] border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-white/30"
    />
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[24px] bg-white/8 px-5 py-4">
      <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
        {label}
      </div>
      <div className="mt-2 text-base font-bold text-white">{value}</div>
    </div>
  );
}

function InfoBadge({
  icon,
  text,
  selected,
}: {
  icon: React.ReactNode;
  text: string;
  selected: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-medium ${
        selected
          ? "border-white/10 bg-white/8 text-slate-100"
          : "border-slate-200 bg-slate-50 text-slate-700"
      }`}
    >
      {icon}
      <span>{text}</span>
    </div>
  );
}
