// /products → 당일코스 (Day Trips) 페이지 · 오더 #C57 [1][2] DB 소비 + 17코스.
//
// 진화:
//   · #FINAL PART B [B-1]: 서비스 카탈로그 그리드 종료 → 당일코스 소개형 인덱스.
//   · #C33: 시간링 → 지역 2축(서울·경기).
//   · #C57 [1][2]: 3축(서울·파주·경기) · 17코스 · admin 편집 실시간 반영.
//     lib/day-trip-catalog-db.ts `loadDayTrips()` (DB → 폴백 정적 시드) 소비.
//     축(axis) 메타는 data/day-trips.ts, 코스 데이터는 data/day-trip-courses.ts.
//
// 방침 (사장님 확정): 판매·예약·"예약" 표현 0. 소개형. 창작·의역 금지.
// 사진 미확보 → 축 컬러 그라디언트 폴백.
// 라우트 세그먼트 config(force-dynamic) 는 wrapper (app/[locale]/products/page.tsx) 관리.

import type { Metadata } from "next";
import Image from "next/image";

import Shell from "@/components/layout/Shell";
import { Link } from "@/lib/navigation";
import {
  DAY_TRIPS_PAGE_COPY,
  dayTripAxes,
  type DayTripLocale,
} from "@/data/day-trips";
import { loadDayTrips } from "@/lib/day-trip-catalog-db";
import type { DayTripCourse } from "@/data/day-trip-courses";
import { getCoursePhotos } from "@/lib/day-trip-photos";

export type PageLocale = DayTripLocale;

export const metadata: Metadata = {
  title: "당일코스",
  description: "고양에서 시작하는 서울·파주·경기 당일코스 17종",
  alternates: { canonical: "/ko/products" },
};

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

const FOOTNOTE: Record<PageLocale, string> = {
  ko: "소요시간·교통편은 실시간 상황에 따라 달라질 수 있습니다.",
  en: "Travel time and routing may vary with real-time conditions.",
  ja: "所要時間・交通手段は当日の状況により変わることがあります。",
  "zh-CN": "用时与交通方式可能因实时状况而变化。",
  "zh-TW": "用時與交通方式可能因即時狀況而變化。",
};

export default async function ProductsPage({
  locale = "ko",
}: {
  locale?: PageLocale;
}) {
  const copy = DAY_TRIPS_PAGE_COPY;
  const courses = await loadDayTrips();

  // 오더 #C59-B [2] — 목록 카드용 대표 사진 자동 수집.
  //   각 코스의 timeline 스팟 갤러리 첫 장 · 없으면 undefined (그라디언트 폴백 유지).
  //   loadSpot 은 React cache() 로 요청당 memoize.
  // 오더 #C73 — 사장님이 업로드한 course.heroImages 를 최우선. 없으면 기존
  //   getCoursePhotos 폴백. 셋 다 없으면 undefined (그라디언트 색면 유지).
  //   상세 히어로 (day-trips/[id]/_page.tsx) 우선순위와 동일하게 맞춤.
  const cardPhotos = new Map<string, string | undefined>();
  await Promise.all(
    courses.map(async (c) => {
      const photo =
        (c.heroImages && c.heroImages.length > 0 ? c.heroImages[0] : undefined)
        ?? (await getCoursePhotos(c, { limit: 1 }))[0];
      cardPhotos.set(c.id, photo);
    })
  );

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

      {dayTripAxes.map((axis) => {
        const inAxis: DayTripCourse[] = courses
          .filter((c) => c.axis === axis.key)
          .sort((a, b) => a.order - b.order);
        if (inAxis.length === 0) return null;
        return (
          <section
            key={axis.key}
            className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14"
          >
            <div className="flex items-baseline gap-3">
              <span
                aria-hidden="true"
                className="inline-block h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: axis.color }}
              />
              <h2 className="text-xl font-black tracking-[-0.02em] text-slate-950 sm:text-2xl">
                {axis.label[locale]}
              </h2>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-700">
                {inAxis.length}
              </span>
            </div>
            <p className="mt-1.5 text-sm text-slate-500 sm:text-base">
              {axis.subline[locale]}
            </p>

            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {inAxis.map((c) => {
                const photo = cardPhotos.get(c.id);
                return (
                <Link
                  key={c.id}
                  href={`/products/day-trips/${c.id}`}
                  className="group block overflow-hidden rounded-[20px] border border-slate-200 bg-white shadow-[0_4px_14px_rgba(16,32,58,0.06)] transition hover:border-slate-950 hover:shadow-md"
                >
                  <article>
                    <div
                      aria-hidden={photo ? undefined : true}
                      className="relative aspect-[16/9] w-full overflow-hidden"
                      style={
                        photo
                          ? undefined
                          : {
                              background: `linear-gradient(135deg, ${axis.color} 0%, ${axis.color}CC 55%, ${axis.color}99 100%)`,
                            }
                      }
                    >
                      {photo && (
                        <Image
                          src={photo}
                          alt={c.name}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover"
                        />
                      )}
                      <div className="absolute inset-0 flex items-end justify-between p-4">
                        <span className="inline-flex items-center rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-950 sm:text-[11px]">
                          {axis.label[locale]}
                        </span>
                        <span className="inline-flex items-center rounded-full bg-slate-950/90 px-2.5 py-1 text-[10px] font-black text-white sm:text-[11px]">
                          {c.durationBadge}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 p-5">
                      <h3 className="text-base font-black leading-tight tracking-tight text-slate-950 sm:text-lg">
                        {c.name}
                      </h3>
                      <p className="text-sm leading-relaxed text-slate-700">
                        {c.hook}
                      </p>
                      <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 text-xs text-slate-600 sm:text-sm">
                        <dt className="font-bold text-slate-500">
                          {DURATION_LABEL[locale]}
                        </dt>
                        <dd className="text-slate-800">{c.duration}</dd>
                        <dt className="font-bold text-slate-500">
                          {TRANSPORT_LABEL[locale]}
                        </dt>
                        <dd className="whitespace-pre-line text-slate-800">
                          {c.transport}
                        </dd>
                      </dl>
                    </div>
                  </article>
                </Link>
                );
              })}
            </div>
          </section>
        );
      })}

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <div className="rounded-[20px] border border-slate-200 bg-slate-50 p-5 text-center text-xs text-slate-500 sm:p-6 sm:text-sm">
          {FOOTNOTE[locale]}
        </div>
      </section>
    </Shell>
  );
}
