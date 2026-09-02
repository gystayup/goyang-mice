// /products → 당일코스 (Day Trips) 페이지 · 오더 #FINAL PART B [B-1].
//
// 기존 서비스 카탈로그(투어·숙박·음식점·라이프스타일·티켓·메디컬) 그리드는
// /best 와 중복 해소 목적으로 이 인덱스에서 렌더 중단. /products/[id]* 하위
// 상세·예약 라우트 및 data/products.ts · data/service-catalog.ts · admin 은
// 완전 보존 (직접 URL 접근·admin 관리 계속 가능).
//
// 이 페이지는 소개형 — 판매·예약·"예약" 표현 0. 사진 미확보 → gradient 폴백.
// 목적지 문안은 data/day-trips.ts 원문만 렌더 (창작·의역 금지).

import type { Metadata } from "next";

import Shell from "@/components/layout/Shell";
import {
  dayTripRings,
  DAY_TRIPS_PAGE_COPY,
  type DayTripLocale,
} from "@/data/day-trips";

export type PageLocale = DayTripLocale;

// 라우트 세그먼트 설정은 wrapper (`app/[locale]/products/page.tsx`) 에서 관리.
//   기존 wrapper 는 force-dynamic 유지 (admin 상품 CRUD 반영 위해).
//   이 페이지는 상수 데이터만 사용하나 wrapper 정책을 존중.

export const metadata: Metadata = {
  title: "당일코스",
  description: "고양에서 30분–1시간, 서울과 파주",
  alternates: { canonical: "/ko/products" },
};

export default async function ProductsPage({
  locale = "ko",
}: {
  locale?: PageLocale;
}) {
  const copy = DAY_TRIPS_PAGE_COPY;

  return (
    <Shell>
      <div className="mx-auto max-w-6xl px-4 pt-10 sm:px-6 sm:pt-14">
        <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#b7912c] sm:text-[11px]">
          {copy.eyebrow[locale]}
        </p>
        <h1 className="mt-3 text-3xl font-black leading-tight tracking-[-0.03em] text-slate-950 sm:text-4xl lg:text-5xl">
          {copy.title[locale]}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
          {copy.subtitle[locale]}
        </p>
        <p className="mt-2 text-xs font-semibold text-slate-500">
          {copy.anchorLabel[locale]}
        </p>
      </div>

      {dayTripRings.map((ring) => (
        <section key={ring.key} className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
          <div className="flex items-baseline gap-3">
            <span
              aria-hidden="true"
              className="inline-block h-2 w-2 shrink-0 rounded-full"
              style={{ backgroundColor: ring.color }}
            />
            <h2 className="text-xl font-black tracking-[-0.02em] text-slate-950 sm:text-2xl">
              {ring.label[locale]}
            </h2>
          </div>
          <p className="mt-1.5 text-sm text-slate-500 sm:text-base">
            {ring.subline[locale]}
          </p>

          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {ring.destinations.map((d) => (
              <article
                key={d.id}
                className="group overflow-hidden rounded-[20px] border border-slate-200 bg-white shadow-[0_4px_14px_rgba(16,32,58,0.06)] transition hover:border-slate-950 hover:shadow-md"
              >
                {/* 상단 시각 블록: 사진 미확보 → 링 컬러 그라디언트 폴백. */}
                <div
                  aria-hidden="true"
                  className="relative aspect-[16/9] w-full"
                  style={{
                    background: `linear-gradient(135deg, ${ring.color} 0%, ${ring.color}CC 55%, ${ring.color}99 100%)`,
                  }}
                >
                  <div className="absolute inset-0 flex items-end p-4">
                    <span className="inline-flex items-center rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-950 sm:text-[11px]">
                      {d.region[locale]}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-3 p-5">
                  <h3 className="text-base font-black leading-tight tracking-tight text-slate-950 sm:text-lg">
                    {d.title[locale]}
                  </h3>
                  <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 text-xs text-slate-600 sm:text-sm">
                    <dt className="font-bold text-slate-500">
                      {DURATION_LABEL[locale]}
                    </dt>
                    <dd className="text-slate-800">{d.duration[locale]}</dd>
                    <dt className="font-bold text-slate-500">
                      {TRANSPORT_LABEL[locale]}
                    </dt>
                    <dd className="text-slate-800">{d.transport[locale]}</dd>
                  </dl>
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}

      {/* 하단 안내 — 판매 CTA 없음. 소개 톤 유지. */}
      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <div className="rounded-[20px] border border-slate-200 bg-slate-50 p-5 text-center text-xs text-slate-500 sm:p-6 sm:text-sm">
          {FOOTNOTE[locale]}
        </div>
      </section>
    </Shell>
  );
}

// dl 라벨 5로케일 (컴포넌트 로컬).
const DURATION_LABEL: Record<PageLocale, string> = {
  ko: "소요",
  en: "Time",
  ja: "所要",
  "zh-CN": "用时",
  "zh-TW": "用時",
};
const TRANSPORT_LABEL: Record<PageLocale, string> = {
  ko: "교통",
  en: "Route",
  ja: "交通",
  "zh-CN": "交通",
  "zh-TW": "交通",
};

// 하단 안내 — 사실만.
const FOOTNOTE: Record<PageLocale, string> = {
  ko: "소요시간·교통편은 실시간 상황에 따라 달라질 수 있습니다.",
  en: "Travel time and routing may vary with real-time conditions.",
  ja: "所要時間・交通手段は当日の状況により変わることがあります。",
  "zh-CN": "用时与交通方式可能因实时状况而变化。",
  "zh-TW": "用時與交通方式可能因即時狀況而變化。",
};
