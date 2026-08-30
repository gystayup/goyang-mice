"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
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
  terminal: string;       // "1터미널" | "2터미널" | ""
  baggageCount: number;   // 수하물 개수
  customDestination: string; // 기타 직접 입력 도착지
  request: string;
  agree: boolean;
};

const paymentMethods = ["크레딧카드", "카카오페이", "계좌송금", "법인 후불 정산"];

// 공항별 터미널 목록
const AIRPORT_TERMINALS: Record<string, string[]> = {
  ICN: ["제1터미널 (T1)", "제2터미널 (T2)"],
  GMP: ["국내선 터미널", "국제선 터미널"],
};

// 고양시 주요 도착지 10개
const GOYANG_DESTINATIONS = [
  "KINTEX 제1·2전시장",
  "고양 K-POP 아레나",
  "일산호수공원 인근 호텔",
  "고양아람누리",
  "고양종합운동장",
  "스타필드 고양",
  "킨텍스 인근 비즈니스 호텔",
  "일산동구 (마두·장항동)",
  "일산서구 (탄현·대화동)",
  "고양시청 / 덕양구청",
  "직접 입력",
];

const initialFormState: FormState = {
  organization: "",
  manager: "",
  phone: "",
  email: "",
  paymentMethod: paymentMethods[0],
  flightNumber: "",
  terminal: "",
  baggageCount: 1,
  customDestination: "",
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

    // 공항 변경 시 터미널 초기화
    setForm((c) => ({ ...c, terminal: "" }));
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

    // 노선(공항) 변경 시 터미널 초기화
    setForm((c) => ({ ...c, terminal: "" }));
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

  // 노선별 최저가
  const routeMinPrices: Record<string, number> = {
    "icn-pickup": 89000,
    "icn-sending": 84000,
    "gmp-pickup": 62000,
    "gmp-sending": 57000,
  };

  return (
    <div>
      {/* ── 히어로 섹션 ── */}
      <div className="relative -mx-6 mb-10 overflow-hidden rounded-[32px] bg-[linear-gradient(135deg,_#020617_0%,_#0c1a3a_40%,_#0e3a6e_70%,_#0ea5e9_100%)] px-8 py-12 md:px-16 md:py-16">
        {/* 배경 별/점 장식 */}
        <div className="pointer-events-none absolute inset-0 opacity-20" style={{backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "40px 40px"}} />

        <div className="relative flex flex-col gap-8 md:flex-row md:items-center md:gap-12">
          {/* 텍스트 */}
          <div className="flex-1">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-sky-300">
              Airport Transfer Service
            </p>
            <h2 className="mt-3 text-4xl font-black leading-tight tracking-tight text-white md:text-5xl">
              공항픽업·샌딩<br />서비스
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-300">
              <span className="font-semibold text-sky-200">고객을 안전하게 모시겠습니다.</span>
            </p>
            <p className="mt-2 text-sm text-slate-400">
              인천공항 · 김포공항 · 365일 24시간 · 짐 많아도 걱정 마세요!
            </p>
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById("airport-booking-form");
                el?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-amber-500 px-7 py-3.5 text-base font-black text-white shadow-lg transition hover:bg-amber-400 active:scale-95"
            >
              <ArrowRight className="h-5 w-5" />
              안내 보기
            </button>
          </div>

          {/* 차량 이미지 콜라주 */}
          <div className="grid w-full max-w-sm grid-cols-2 gap-2 md:w-auto md:shrink-0">
            {/* 메르세데스 E-Class */}
            <div className="relative col-span-2 h-36 overflow-hidden rounded-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=600&q=80"
                alt="프리미엄 세단"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <span className="absolute bottom-2 left-3 text-xs font-bold text-white">프리미엄 세단 (Mercedes · BMW)</span>
            </div>
            {/* SUV / 카니발 */}
            <div className="relative h-28 overflow-hidden rounded-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400&q=80"
                alt="SUV"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <span className="absolute bottom-2 left-2 text-[10px] font-bold text-white">프리미엄 SUV</span>
            </div>
            {/* 밴 / 솔라티 */}
            <div className="relative h-28 overflow-hidden rounded-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80"
                alt="밴"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <span className="absolute bottom-2 left-2 text-[10px] font-bold text-white">그룹 밴</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── 차량 Fleet 소개 ── */}
      <div className="mb-10">
        <h3 className="mb-4 text-lg font-black text-slate-900">보유 차량 안내</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            {
              img: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400&q=80",
              name: "프리미엄 세단",
              desc: "Mercedes E-Class · BMW 5",
              seats: "최대 3인",
              badge: "비즈니스",
              badgeColor: "bg-blue-100 text-blue-700",
            },
            {
              img: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&q=80",
              name: "이코노미 세단",
              desc: "그랜저 · K8 · 소나타",
              seats: "최대 3인",
              badge: "경제적",
              badgeColor: "bg-emerald-100 text-emerald-700",
            },
            {
              img: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400&q=80",
              name: "프리미엄 SUV",
              desc: "카니발 · 스타리아",
              seats: "최대 7인",
              badge: "가족·단체",
              badgeColor: "bg-purple-100 text-purple-700",
            },
            {
              img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
              name: "그룹 밴·버스",
              desc: "솔라티 · 전세버스",
              seats: "최대 45인",
              badge: "단체 문의",
              badgeColor: "bg-amber-100 text-amber-700",
            },
          ].map((v) => (
            <div key={v.name} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="relative h-28 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={v.img} alt={v.name} className="h-full w-full object-cover" />
                <span className={`absolute right-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-bold ${v.badgeColor}`}>{v.badge}</span>
              </div>
              <div className="px-3 py-3">
                <p className="text-sm font-black text-slate-900">{v.name}</p>
                <p className="text-[11px] text-slate-500">{v.desc}</p>
                <p className="mt-1 text-[11px] font-semibold text-sky-600">{v.seats}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 노선 카드 그리드 (본보야지벤 스타일) ── */}
      <div className="mb-10">
        {/* 배너 */}
        <div className="mb-6 flex items-start gap-3 rounded-2xl border-l-4 border-amber-400 bg-amber-50 px-5 py-4">
          <Plane className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
          <div>
            <p className="text-sm font-bold text-amber-900">공항 갈 때도, 올 때도!</p>
            <p className="mt-0.5 text-xs text-amber-700">
              고양 특례시 전 지역 픽업 &amp; 샌딩을 책임집니다. 기사님이 시간 맞춰 딱 도착해요.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {airportTransferRoutes.map((route) => {
            const isActive = search.routeId === route.id;
            const minPrice = routeMinPrices[route.id] ?? 0;
            const isPickup = route.mode === "pickup";
            return (
              <div
                key={route.id}
                className={`flex flex-col overflow-hidden rounded-[20px] border-2 bg-white transition ${
                  isActive ? "border-amber-400 shadow-md" : "border-slate-200 hover:border-slate-300"
                }`}
              >
                {/* 카드 상단 */}
                <div className={`flex flex-col items-center px-4 py-5 ${isActive ? "bg-amber-50" : "bg-slate-50"}`}>
                  {/* 공항 아이콘 */}
                  <div className={`flex h-16 w-16 items-center justify-center rounded-full ${route.airportCode === "ICN" ? "bg-blue-100" : "bg-sky-100"}`}>
                    <Plane className={`h-8 w-8 ${isPickup ? "rotate-[225deg]" : "rotate-45"} ${route.airportCode === "ICN" ? "text-blue-600" : "text-sky-600"}`} />
                  </div>
                  <p className="mt-3 text-xl font-black tracking-tight text-slate-900">
                    {route.airportCode === "ICN" ? "인천공항" : "김포공항"}
                  </p>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    {route.airportCode}
                  </p>
                  {/* 픽업/샌딩 배지 */}
                  <span className={`mt-2 rounded-full px-2.5 py-1 text-[11px] font-bold ${
                    isPickup
                      ? "bg-blue-100 text-blue-700"
                      : "bg-rose-100 text-rose-700"
                  }`}>
                    {isPickup ? "↓ 픽업 (도착)" : "↑ 샌딩 (출발)"}
                  </span>
                </div>
                {/* 카드 하단 — 오더 #P4: 공항픽업(티켓 외) 가격 표시 렌더 차단, CTA "안내 보기" */}
                <div className="flex flex-1 flex-col justify-between px-4 py-4">
                  <p className="text-xs text-slate-500 line-clamp-2">{route.desc}</p>
                  <div>
                    <div className="mt-3 flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          handleRouteChange(route.id);
                          setTimeout(() => {
                            document.getElementById("airport-booking-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
                          }, 100);
                        }}
                        className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-amber-500 px-2 py-2 text-xs font-black text-white hover:bg-amber-400"
                      >
                        <Users className="h-3 w-3" /> 안내 보기
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 기존 예약 폼 ── */}
      <div id="airport-booking-form" className="scroll-mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
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

          {/* ── 터미널 선택 (ICN: T1/T2, GMP: 국내/국제) ── */}
          {(() => {
            const airportCode = activeRoute.airportCode;
            const airportName = airportCode === "ICN" ? "인천공항" : "김포공항";
            const terminals = AIRPORT_TERMINALS[airportCode] ?? [];
            const isPickup = search.mode === "pickup";
            const label = isPickup ? `${airportName} 도착 터미널 선택` : `${airportName} 출발 터미널 선택`;
            return (
              <div className="mt-5 rounded-[24px] border-2 border-sky-300 bg-sky-50 px-5 py-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-base">✈️</span>
                  <p className="text-sm font-black text-sky-800">{label}</p>
                  {!form.terminal && (
                    <span className="ml-auto rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-600">필수 선택</span>
                  )}
                  {form.terminal && (
                    <span className="ml-auto rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-600">✓ {form.terminal}</span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {terminals.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setForm((c) => ({ ...c, terminal: t }))}
                      className={`rounded-full px-6 py-2.5 text-sm font-black transition active:scale-95 ${
                        form.terminal === t
                          ? "bg-sky-600 text-white shadow-md ring-2 ring-sky-300"
                          : "border-2 border-sky-200 bg-white text-sky-700 hover:border-sky-400 hover:bg-sky-50"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            );
          })()}

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {/* 출발지 */}
            {search.mode === "sending" ? (
              /* 샌딩: 출발지 = 고양시 위치 선택 */
              <div className="rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-3">
                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">출발지</div>
                <select
                  value={search.from}
                  onChange={(e) => {
                    const v = e.target.value;
                    setSearch((c) => ({ ...c, from: v === "직접 입력" ? "" : v }));
                    if (v === "직접 입력") setForm((c) => ({ ...c, customDestination: "" }));
                  }}
                  className="mt-2 w-full bg-transparent text-sm font-bold text-slate-900 outline-none"
                >
                  <option value="">-- 출발지 선택 --</option>
                  {GOYANG_DESTINATIONS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
                {search.from === "" && (
                  <input
                    type="text"
                    placeholder="직접 입력"
                    value={form.customDestination}
                    onChange={(e) => {
                      setForm((c) => ({ ...c, customDestination: e.target.value }));
                      setSearch((c) => ({ ...c, from: e.target.value }));
                    }}
                    className="mt-2 w-full border-t border-slate-200 bg-transparent pt-2 text-sm font-bold text-slate-900 outline-none placeholder-slate-400"
                  />
                )}
              </div>
            ) : (
              <FieldCard label="출발지" value={search.from} onChange={(value) => setSearch((c) => ({ ...c, from: value }))} />
            )}

            {/* 목적지 */}
            {search.mode === "pickup" ? (
              /* 픽업: 목적지 = 고양시 위치 선택 */
              <div className="rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-3">
                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">고양 도착지</div>
                <select
                  value={search.to}
                  onChange={(e) => {
                    const v = e.target.value;
                    setSearch((c) => ({ ...c, to: v === "직접 입력" ? "" : v }));
                    if (v === "직접 입력") setForm((c) => ({ ...c, customDestination: "" }));
                  }}
                  className="mt-2 w-full bg-transparent text-sm font-bold text-slate-900 outline-none"
                >
                  <option value="">-- 도착지 선택 --</option>
                  {GOYANG_DESTINATIONS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
                {search.to === "" && (
                  <input
                    type="text"
                    placeholder="직접 입력 (예: 고양시 일산서구 OO동)"
                    value={form.customDestination}
                    onChange={(e) => {
                      setForm((c) => ({ ...c, customDestination: e.target.value }));
                      setSearch((c) => ({ ...c, to: e.target.value }));
                    }}
                    className="mt-2 w-full border-t border-slate-200 bg-transparent pt-2 text-sm font-bold text-slate-900 outline-none placeholder-slate-400"
                  />
                )}
              </div>
            ) : (
              <FieldCard label="목적지" value={search.to} onChange={(value) => setSearch((c) => ({ ...c, to: value }))} />
            )}

            <FieldCard
              label="출발일"
              type="datetime-local"
              value={search.departureDate}
              onChange={(value) => setSearch((current) => ({ ...current, departureDate: value }))}
            />
            <label className="rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-3">
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">탑승객</div>
              <select
                value={search.passengers}
                onChange={(event) => setSearch((current) => ({ ...current, passengers: Number(event.target.value) }))}
                className="mt-2 w-full bg-transparent text-lg font-bold text-slate-900 outline-none"
              >
                {Array.from({ length: 12 }).map((_, index) => (
                  <option key={index + 1} value={index + 1}>{index + 1}명</option>
                ))}
              </select>
            </label>
          </div>

          {/* ── 항공편명 + 수하물 수 ── */}
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-3">
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">✈️ 항공편명</div>
              <input
                type="text"
                placeholder="예: KE 082, OZ 201"
                value={form.flightNumber}
                onChange={(e) => setForm((c) => ({ ...c, flightNumber: e.target.value }))}
                className="mt-2 w-full bg-transparent text-base font-bold text-slate-900 outline-none placeholder-slate-400"
              />
            </div>
            <div className="rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-3">
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">🧳 수하물 (가방 수)</div>
              <div className="mt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setForm((c) => ({ ...c, baggageCount: Math.max(0, c.baggageCount - 1) }))}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-slate-700 hover:bg-slate-300 font-bold"
                >−</button>
                <span className="text-lg font-black text-slate-900 w-6 text-center">{form.baggageCount}</span>
                <button
                  type="button"
                  onClick={() => setForm((c) => ({ ...c, baggageCount: Math.min(20, c.baggageCount + 1) }))}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-slate-700 hover:bg-slate-300 font-bold"
                >+</button>
                <span className="text-sm text-slate-500">개</span>
              </div>
            </div>
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
                  {/* 오더 #P4: 공항픽업(티켓 외) 예약가 · vehicle.price 렌더 차단.
                      vehicle.price 데이터 필드는 유지. */}
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
                  form.terminal ? `터미널: ${form.terminal}` : "",
                  `출발지: ${search.from || "-"}`,
                  `목적지: ${search.to || "-"}`,
                  `선택 차량: ${selectedVehicle?.name ?? "미선택"}`,
                  selectedVehicle ? `차량 금액: ₩ ${selectedVehicle.price.toLocaleString("ko-KR")}` : "",
                  form.flightNumber ? `항공편명: ${form.flightNumber}` : "",
                  `수하물: ${form.baggageCount}개`,
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
          {form.terminal && <SummaryRow label="터미널" value={form.terminal} />}
          <SummaryRow label="이동 경로" value={`${search.from || "-"} → ${search.to || "-"}`} />
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
          {form.flightNumber && <SummaryRow label="항공편명" value={form.flightNumber} />}
          <SummaryRow label="수하물" value={`${form.baggageCount}개`} />
          {/* 오더 #P4: 공항픽업(티켓 외) 예약 금액 렌더 차단.
              selectedVehicle.price 데이터 필드는 유지. */}
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
          <textarea
            rows={4}
            placeholder="기사 미팅보드명, 수하물 정보, VIP 요청, 공연 일정 등 추가 요청을 남겨주세요."
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
    {/* ── 하단 CTA ── */}
    <div className="mt-12 rounded-2xl bg-slate-950 px-6 py-8 text-center">
      <p className="text-lg font-black text-white">맞춤 차량 문의</p>
      <p className="mt-2 text-sm text-slate-300">단체, VIP, 특수 이동이 필요하신가요? 전담 매니저가 직접 상담해드립니다.</p>
      <Link
        href="/contact"
        className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-amber-500 px-6 py-3 text-sm font-black text-white hover:bg-amber-400"
      >
        <ArrowRight className="h-4 w-4" />
        맞춤 차량 문의하기
      </Link>
    </div>
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
