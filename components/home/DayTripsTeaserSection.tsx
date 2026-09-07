// components/home/DayTripsTeaserSection.tsx — 오더 #C14b · #C16 · #C33 · #C57 재편.
//
// 진화:
//   · #C33: 시간링 → 지역 2축(서울·경기).
//   · #C57: 3축(서울·파주·경기) · DB 소비 · admin 편집 실시간 반영.
//     data/day-trips.ts axis 메타 + loadDayTrips() (DB → 정적 시드 폴백) 소비.
//     각 축 첫 코스(order 최소) 1건씩 총 3장.
//
// 규범: 판매·예약·"예약" 표현 0. 사진 없음 → 축 컬러 그라디언트 폴백. 5로케일 ko 폴백.

import Image from "next/image";
import { ArrowRight } from "lucide-react";

import { DAYTRIPS_TEASER, pickHomeLocale } from "@/data/home-copy";
import { dayTripAxes, type DayTripAxisBlock } from "@/data/day-trips";
import { loadDayTrips } from "@/lib/day-trip-catalog-db";
import { getCoursePhotos } from "@/lib/day-trip-photos";
import { Link } from "@/lib/navigation";

export default async function DayTripsTeaserSection({ locale }: { locale: string }) {
  const active = pickHomeLocale(locale);
  const courses = await loadDayTrips();

  // 오더 #C79: 각 축 첫 코스 1건씩 준비 + 카드 사진 우선순위
  //   ① course.heroImages[0] (사장님 업로드) → ② getCoursePhotos (timeline
  //   스팟 gallery 폴백) → ③ undefined (축 색 그라디언트 폴백 유지)
  //   상세(C68)·목록(C73) 과 동일 우선순위.
  const featured = await Promise.all(
    dayTripAxes
      .map((axis) => {
        const inAxis = courses
          .filter((c) => c.axis === axis.key)
          .sort((a, b) => a.order - b.order);
        return { axis, course: inAxis[0] as (typeof courses)[number] | undefined };
      })
      .filter(
        (x): x is { axis: DayTripAxisBlock; course: (typeof courses)[number] } => !!x.course
      )
      .map(async ({ axis, course }) => {
        const photo =
          (course.heroImages && course.heroImages.length > 0
            ? course.heroImages[0]
            : undefined) ?? (await getCoursePhotos(course, { limit: 1 }))[0];
        return { axis, course, photo };
      })
  );

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
          {featured.map(({ axis, course, photo }) => (
            <Link
              key={axis.key}
              href={`/products/day-trips/${course.id}`}
              className="group block overflow-hidden rounded-[20px] border border-slate-200 bg-white shadow-[0_4px_14px_rgba(16,32,58,0.06)] transition hover:border-slate-950 hover:shadow-md"
            >
              <article>
                {/* 오더 #C79: photo 있으면 사진 + 하단 어두운 그라디언트 오버레이,
                   없으면 기존 축 색 그라디언트 유지. 배지 pill (지역·시간) 은
                   둘 다에서 대비 확보. */}
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
                    <>
                      <Image
                        src={photo}
                        alt=""
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover"
                      />
                      <div
                        aria-hidden="true"
                        className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/45 to-transparent"
                      />
                    </>
                  )}
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
