import { CheckCircle2, ExternalLink, Luggage, MapPinned, Phone, Plane, Users } from "lucide-react";

import type { Product } from "@/data/products";
import {
  airportTransferFilters,
  airportTransferRoutes,
  getAirportVehiclesByRoute,
} from "@/data/airport-transfer";

export default function AirportTransferDetail({ product }: { product: Product }) {
  // 4개 노선 전체를 정보 카드로 나열 (사용자가 원하는 노선을 스크롤로 확인)
  return (
    <div className="mt-10 space-y-10">
      {/* 히어로 — 공항 → 고양시 교통편 안내 */}
      <section className="overflow-hidden rounded-[36px] border border-slate-200 bg-white shadow-soft">
        <div className="bg-[linear-gradient(135deg,_#081b4b_0%,_#1d4ed8_45%,_#7dd3fc_100%)] p-8 text-white md:p-10">
          <div className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-100">
            Airport Access Guide
          </div>
          <h2 className="mt-5 text-3xl font-black tracking-tight md:text-4xl">
            {product.title}
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-8 text-slate-100 md:text-base">
            {product.summary}
          </p>
          <p className="mt-3 max-w-3xl text-sm leading-8 text-cyan-100">
            아래 노선별 안내를 확인하고, 각 운영업체에 직접 문의해 주세요.
          </p>
        </div>
      </section>

      {/* 노선별 안내 */}
      {airportTransferRoutes.map((route) => {
        const vehicles = getAirportVehiclesByRoute(route.id);

        return (
          <section
            key={route.id}
            className="rounded-[36px] border border-slate-200 bg-white p-6 shadow-soft md:p-8"
          >
            <div className="flex flex-col gap-4 border-b border-slate-100 pb-6 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-600">
                  {route.airportCode} · {route.mode === "pickup" ? "공항 픽업" : "공항 샌딩"}
                </div>
                <h3 className="mt-3 text-2xl font-black tracking-tight text-slate-950">
                  {route.title}
                </h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">{route.desc}</p>
                <div className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <MapPinned className="h-4 w-4 text-slate-500" />
                  <span>
                    {route.fromLabel} → {route.toLabel}
                  </span>
                </div>
              </div>
              <div className="rounded-[24px] bg-slate-50 px-5 py-4 md:min-w-[240px]">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  기본 안내
                </div>
                <div className="mt-2 text-sm font-bold text-slate-900">
                  {route.terminalInfo}
                </div>
                <p className="mt-2 text-xs leading-6 text-slate-500">{route.heroNote}</p>
              </div>
            </div>

            {/* 운영업체 목록 */}
            <div className="mt-6 space-y-4">
              <div className="text-sm font-semibold text-slate-500">운영업체 안내</div>
              {vehicles.length === 0 ? (
                <div className="rounded-[24px] border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
                  등록된 운영업체가 없습니다.
                </div>
              ) : (
                vehicles.map((vehicle) => (
                  <article
                    key={vehicle.id}
                    className="rounded-[28px] border border-slate-200 bg-white p-5 md:p-6"
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div className="flex gap-4">
                        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[24px] bg-[linear-gradient(135deg,_#dbeafe_0%,_#fdf2f8_100%)] text-slate-900">
                          <Plane className="h-7 w-7" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                            {vehicle.operator}
                          </div>
                          <h4 className="mt-1 text-lg font-black tracking-tight text-slate-950">
                            {vehicle.name}
                          </h4>
                          <p className="mt-2 text-sm leading-7 text-slate-600">
                            {vehicle.desc}
                          </p>
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

                    {/* CTA: 홈페이지 / 전화 — 데이터 있을 때만 렌더 */}
                    {(vehicle.homepageUrl || vehicle.phone) && (
                      <div className="mt-6 flex flex-col gap-3 border-t border-slate-100 pt-5 md:flex-row md:items-center md:justify-end">
                        {vehicle.homepageUrl && (
                          <a
                            href={vehicle.homepageUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                          >
                            홈페이지 바로가기
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                        {vehicle.phone && (
                          <a
                            href={`tel:${vehicle.phone}`}
                            className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                          >
                            <Phone className="h-4 w-4" />
                            매장에 문의하기
                          </a>
                        )}
                      </div>
                    )}
                  </article>
                ))
              )}
            </div>
          </section>
        );
      })}
    </div>
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
