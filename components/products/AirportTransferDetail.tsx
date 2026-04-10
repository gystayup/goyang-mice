"use client";

import { useMemo, useState } from "react";
import { ArrowRight, CheckCircle2, Luggage, MapPinned, Plane, Users } from "lucide-react";

import type { Product } from "@/data/products";
import {
  airportTransferFilters,
  airportTransferRoutes,
  getAirportTransferRoute,
  getAirportVehiclesByRoute,
  getInitialAirportTransferSearch,
  type AirportTransferFilterId,
  type AirportTransferMode,
  type AirportTransferRouteId,
} from "@/data/airport-transfer";
import { Link } from "@/lib/navigation";

export default function AirportTransferDetail({ product }: { product: Product }) {
  const [search, setSearch] = useState(() =>
    getInitialAirportTransferSearch("icn-pickup")
  );
  const [selectedFilters, setSelectedFilters] = useState<AirportTransferFilterId[]>([]);

  const activeRoute =
    getAirportTransferRoute(search.routeId) ?? airportTransferRoutes[0];

  const visibleRoutes = useMemo(
    () => airportTransferRoutes.filter((route) => route.mode === search.mode),
    [search.mode]
  );

  const vehicleOptions = useMemo(
    () =>
      getAirportVehiclesByRoute(search.routeId).filter((vehicle) => {
        const featureMatch =
          selectedFilters.length === 0 ||
          selectedFilters.every((filter) => vehicle.features.includes(filter));
        const passengerMatch = vehicle.seats >= search.passengers;

        return featureMatch && passengerMatch;
      }),
    [search.passengers, search.routeId, selectedFilters]
  );

  const toggleFilter = (filterId: AirportTransferFilterId) => {
    setSelectedFilters((current) =>
      current.includes(filterId)
        ? current.filter((item) => item !== filterId)
        : [...current, filterId]
    );
  };

  const handleModeChange = (mode: AirportTransferMode) => {
    const fallbackRoute =
      airportTransferRoutes.find((route) => route.mode === mode) ?? airportTransferRoutes[0];

    setSearch((current) => ({
      ...getInitialAirportTransferSearch(fallbackRoute.id, current.departureDate, current.passengers),
      from: fallbackRoute.fromLabel,
      to: fallbackRoute.toLabel,
    }));
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
  };

  return (
    <div className="mt-10 space-y-8">
      <section className="overflow-hidden rounded-[36px] border border-slate-200 bg-white shadow-soft">
        <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="bg-[linear-gradient(135deg,_#081b4b_0%,_#1d4ed8_45%,_#7dd3fc_100%)] p-8 text-white md:p-10">
            <div className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-100">
              Airport Transfer
            </div>
            <h2 className="mt-5 text-3xl font-black tracking-tight md:text-4xl">
              {activeRoute.title}
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-8 text-slate-100 md:text-base">
              {activeRoute.desc}
            </p>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <div className="rounded-[28px] bg-white/12 p-5">
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-100">
                  운영 구간
                </div>
                <div className="mt-2 text-lg font-bold">{activeRoute.label}</div>
                <p className="mt-2 text-sm leading-7 text-slate-100">
                  {activeRoute.heroNote}
                </p>
              </div>
              <div className="rounded-[28px] bg-white/12 p-5">
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-100">
                  기본 안내
                </div>
                <div className="mt-2 text-lg font-bold">
                  {activeRoute.terminalInfo}
                </div>
                <p className="mt-2 text-sm leading-7 text-slate-100">
                  항공편, 공연 일정, 호텔 체크인 시간에 맞춰 출발 시각을 조정합니다.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[linear-gradient(180deg,_#fff7ed_0%,_#ffffff_100%)] p-8 md:p-10">
            <div className="text-sm font-semibold uppercase tracking-[0.22em] text-orange-500">
              Quick Route
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              {[
                { id: "pickup" as const, label: "공항 픽업" },
                { id: "sending" as const, label: "공항 샌딩" },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleModeChange(item.id)}
                  className={`rounded-full px-5 py-3 text-sm font-semibold transition ${
                    search.mode === item.id
                      ? "bg-slate-950 text-white"
                      : "border border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="mt-6 grid gap-3">
              {visibleRoutes.map((route) => (
                <button
                  key={route.id}
                  type="button"
                  onClick={() => handleRouteChange(route.id)}
                  className={`rounded-[28px] border px-5 py-4 text-left transition ${
                    search.routeId === route.id
                      ? "border-slate-950 bg-slate-950 text-white"
                      : "border-slate-200 bg-white text-slate-800 hover:border-slate-300"
                  }`}
                >
                  <div className="text-sm font-bold">{route.label}</div>
                  <div
                    className={`mt-1 text-sm leading-6 ${
                      search.routeId === route.id ? "text-slate-200" : "text-slate-500"
                    }`}
                  >
                    {route.fromLabel} → {route.toLabel}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[36px] border border-slate-200 bg-white p-5 shadow-soft md:p-6">
        <div className="grid gap-4 xl:grid-cols-[1.1fr_1.1fr_0.8fr_0.7fr_0.6fr]">
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
            label="날짜 및 시간"
            type="datetime-local"
            value={search.departureDate}
            onChange={(value) =>
              setSearch((current) => ({ ...current, departureDate: value }))
            }
          />
          <div className="rounded-[28px] border border-slate-200 bg-slate-50 px-5 py-4">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              탑승객 수
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
          </div>
          <div className="flex">
            <button
              type="button"
              className="w-full rounded-[28px] bg-orange-500 px-6 py-4 text-base font-bold text-white transition hover:bg-orange-400"
            >
              차량 검색
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.35fr_0.65fr]">
        <div className="rounded-[36px] border border-slate-200 bg-white p-6 shadow-soft">
          <div className="text-lg font-black text-slate-950">서비스 필터</div>
          <div className="mt-5 space-y-3">
            {airportTransferFilters.map((filter) => (
              <label
                key={filter.id}
                className="flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 transition hover:border-slate-300"
              >
                <input
                  type="checkbox"
                  checked={selectedFilters.includes(filter.id)}
                  onChange={() => toggleFilter(filter.id)}
                  className="h-4 w-4 rounded border-slate-300 accent-slate-950"
                />
                <span className="text-sm font-medium text-slate-700">{filter.label}</span>
              </label>
            ))}
          </div>

          <div className="mt-6 rounded-[28px] bg-slate-50 p-5">
            <div className="text-sm font-bold text-slate-950">운영 메모</div>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-600">
              <li>- 항공편 지연 시 관리자 콘솔에서 기사 배차와 대기 시간을 재조정합니다.</li>
              <li>- 단체 예약은 좌석 수와 수하물 기준으로 차량을 자동 제안할 수 있습니다.</li>
              <li>- 예약 접수 후 기사, 차량, 결제 상태를 관리자 페이지에서 계속 관리합니다.</li>
            </ul>
          </div>
        </div>

        <div className="space-y-4">
          {vehicleOptions.length === 0 ? (
            <div className="rounded-[36px] border border-dashed border-slate-300 bg-white p-10 text-center shadow-soft">
              <div className="text-xl font-black text-slate-950">조건에 맞는 차량이 없습니다</div>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                인원 수를 줄이거나 필터를 일부 해제하면 더 많은 차량을 확인할 수 있습니다.
              </p>
            </div>
          ) : (
            vehicleOptions.map((vehicle) => {
              const reservationParams = new URLSearchParams({
                mode: search.mode,
                route: search.routeId,
                from: search.from,
                to: search.to,
                departureDate: search.departureDate,
                passengers: String(search.passengers),
                vehicle: vehicle.id,
              });

              return (
                <article
                  key={vehicle.id}
                  className="rounded-[36px] border border-slate-200 bg-white p-6 shadow-soft"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex gap-4">
                      <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-[28px] bg-[linear-gradient(135deg,_#dbeafe_0%,_#fdf2f8_100%)] text-slate-900">
                        <Plane className="h-8 w-8" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                          {vehicle.operator}
                        </div>
                        <h3 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
                          {vehicle.name}
                        </h3>
                        <p className="mt-2 text-sm leading-7 text-slate-600">{vehicle.desc}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {vehicle.badges.map((badge) => (
                            <span
                              key={badge}
                              className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700"
                            >
                              {badge}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="rounded-[28px] bg-slate-50 px-6 py-5 text-left lg:min-w-[220px] lg:text-right">
                      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                        최저가
                      </div>
                      <div className="mt-2 text-3xl font-black tracking-tight text-slate-950">
                        ₩ {vehicle.price.toLocaleString("ko-KR")}
                      </div>
                      <p className="mt-2 text-sm text-slate-500">세금 및 수수료 포함</p>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 md:grid-cols-3">
                    <InfoBadge icon={<Users className="h-4 w-4" />} text={`${vehicle.seats}인 탑승`} />
                    <InfoBadge icon={<Luggage className="h-4 w-4" />} text={`수하물 ${vehicle.luggage}개`} />
                    <InfoBadge
                      icon={<MapPinned className="h-4 w-4" />}
                      text={vehicle.etaNote}
                    />
                  </div>

                  <div className="mt-5 grid gap-3 md:grid-cols-2">
                    {vehicle.features.map((featureId) => {
                      const filter = airportTransferFilters.find((item) => item.id === featureId);

                      return (
                        <div
                          key={featureId}
                          className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
                        >
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          <span>{filter?.label ?? featureId}</span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-6 flex flex-col gap-3 border-t border-slate-100 pt-6 md:flex-row md:items-center md:justify-between">
                    <div className="text-sm leading-7 text-slate-600">
                      {search.from}에서 {search.to}까지 {search.passengers}명 기준으로 예약합니다.
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <Link
                        href={`/products/${product.id}/reservation?${reservationParams.toString()}`}
                        className="inline-flex items-center justify-center rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                      >
                        자세히 보기
                      </Link>
                      <Link
                        href={`/products/${product.id}/reservation?${reservationParams.toString()}`}
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                      >
                        바로 예약
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </div>
      </section>
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
    <label className="rounded-[28px] border border-slate-200 bg-slate-50 px-5 py-4">
      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
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

function InfoBadge({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
      {icon}
      <span>{text}</span>
    </div>
  );
}
