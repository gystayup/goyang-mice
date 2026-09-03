// components/home/DayTripsTeaserSection.tsx — 오더 #C14b 당일코스 티저.
//
// data/day-trips.ts 3링 (30분/1시간/2시간) 재사용 · 각 링 대표 1건씩 3장 노출.
//
// 초안 대표 (오더 #C16: 2링):
//   30분 이내:  서울역·명동         (seoul-station-myeongdong)
//   1시간 이내: 임진각·평화누리·DMZ  (imjingak-peace-nuri-dmz)
//
// 규범:
//   · 판매·예약·"예약" 표현 0. 사진 없음 → 링 컬러 그라디언트 폴백.
//   · 5로케일 ko 폴백.

import { ArrowRight } from "lucide-react";

import { DAYTRIPS_TEASER, pickHomeLocale } from "@/data/home-copy";
import {
  dayTripRings,
  type DayTripDestination,
  type DayTripRing,
  type DayTripRingBlock,
} from "@/data/day-trips";
import { Link } from "@/lib/navigation";

const FEATURED_BY_RING: Record<DayTripRing, string> = {
  "within-30min": "seoul-station-myeongdong",
  "within-1hour": "imjingak-peace-nuri-dmz",
};

function pickDestination(ring: DayTripRingBlock): DayTripDestination | undefined {
  const id = FEATURED_BY_RING[ring.key];
  return ring.destinations.find((d) => d.id === id) ?? ring.destinations[0];
}

export default function DayTripsTeaserSection({ locale }: { locale: string }) {
  const active = pickHomeLocale(locale);

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

        <div className="mt-8 grid grid-cols-1 gap-5 sm:mt-10 sm:grid-cols-2">
          {dayTripRings.map((ring) => {
            const d = pickDestination(ring);
            if (!d) return null;
            return (
              <article
                key={ring.key}
                className="group overflow-hidden rounded-[20px] border border-slate-200 bg-white shadow-[0_4px_14px_rgba(16,32,58,0.06)] transition hover:border-slate-950 hover:shadow-md"
              >
                <div
                  aria-hidden="true"
                  className="relative aspect-[16/9] w-full"
                  style={{
                    background: `linear-gradient(135deg, ${ring.color} 0%, ${ring.color}CC 55%, ${ring.color}99 100%)`,
                  }}
                >
                  <div className="absolute inset-0 flex items-end p-4">
                    <span className="inline-flex items-center rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-950 sm:text-[11px]">
                      {ring.label[active]}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-2 p-5">
                  <h3 className="text-base font-black leading-tight tracking-tight text-[#232322] sm:text-lg">
                    {d.title[active]}
                  </h3>
                  <p className="text-xs text-slate-600 sm:text-sm">
                    <span className="font-bold text-slate-500">·</span>{" "}
                    {d.duration[active]}
                  </p>
                  <p className="text-xs text-slate-600 sm:text-sm">
                    <span className="font-bold text-slate-500">·</span>{" "}
                    {d.transport[active]}
                  </p>
                </div>
              </article>
            );
          })}
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
