// components/home/DayTripsTeaserSection.tsx — 오더 #C14b · #C16 · #C33 · #C57 재편.
//
// 진화:
//   · #C33: 시간링 → 지역 2축(서울·경기).
//   · #C57: 3축(서울·파주·경기) · DB 소비 · admin 편집 실시간 반영.
//     data/day-trips.ts axis 메타 + loadDayTrips() (DB → 정적 시드 폴백) 소비.
//     각 축 첫 코스(order 최소) 1건씩 총 3장.
//
// 규범: 판매·예약·"예약" 표현 0. 사진 없음 → 축 컬러 그라디언트 폴백. 5로케일 ko 폴백.

import { ArrowRight } from "lucide-react";

import { DAYTRIPS_TEASER, pickHomeLocale } from "@/data/home-copy";
import { dayTripAxes, type DayTripAxisBlock } from "@/data/day-trips";
import { loadDayTrips } from "@/lib/day-trip-catalog-db";
import { Link } from "@/lib/navigation";

export default async function DayTripsTeaserSection({ locale }: { locale: string }) {
  const active = pickHomeLocale(locale);
  const courses = await loadDayTrips();

  const featured = dayTripAxes
    .map<{ axis: DayTripAxisBlock; course: (typeof courses)[number] | undefined }>((axis) => {
      const inAxis = courses
        .filter((c) => c.axis === axis.key)
        .sort((a, b) => a.order - b.order);
      return { axis, course: inAxis[0] };
    })
    .filter((x): x is { axis: DayTripAxisBlock; course: (typeof courses)[number] } => !!x.course);

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
        <div className="text-[11px] font-bold uppercase tracking-[0.28em] text-[var(--accent)]">
          {DAYTRIPS_TEASER.eyebrow}
        </div>
        <h2 className="mt-3 text-2xl font-black tracking-[-0.03em] text-[#232322] sm:text-3xl lg:text-4xl">
          {DAYTRIPS_TEASER.headline[active]}
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
          {DAYTRIPS_TEASER.subhead[active]}
        </p>

        <div className="mt-8 grid grid-cols-1 gap-5 sm:mt-10 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map(({ axis, course }) => (
            <Link
              key={axis.key}
              href={`/products/day-trips/${course.id}`}
              className="group block overflow-hidden rounded-[20px] border border-slate-200 bg-white shadow-[0_4px_14px_rgba(16,32,58,0.06)] transition hover:border-slate-950 hover:shadow-md"
            >
              <article>
                <div
                  aria-hidden="true"
                  className="relative aspect-[16/9] w-full"
                  style={{
                    background: `linear-gradient(135deg, ${axis.color} 0%, ${axis.color}CC 55%, ${axis.color}99 100%)`,
                  }}
                >
                  <div className="absolute inset-0 flex items-end justify-between p-4">
                    <span className="inline-flex items-center rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-950 sm:text-[11px]">
                      {axis.label[active]}
                    </span>
                    <span className="inline-flex items-center rounded-full bg-slate-950/90 px-2.5 py-1 text-[10px] font-black text-white sm:text-[11px]">
                      {course.durationBadge}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-2 p-5">
                  <h3 className="text-base font-black leading-tight tracking-tight text-[#232322] sm:text-lg">
                    {course.name}
                  </h3>
                  <p className="text-xs leading-relaxed text-slate-600 sm:text-sm">
                    {course.hook}
                  </p>
                </div>
              </article>
            </Link>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-[#232322] shadow-[0_4px_14px_rgba(16,32,58,0.06)] transition hover:border-slate-950 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          >
            {DAYTRIPS_TEASER.cta[active]}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
