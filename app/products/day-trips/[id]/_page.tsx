// /[locale]/products/day-trips/[id] — 오더 #C56 [2] + #C57 [1][2] DB 소비.
//
// 방침 (사장님 확정):
//   · 판매·예약 없음. 소개형.
//   · lib/day-trip-catalog-db.ts `loadDayTrip(id)` (DB → 정적 시드 폴백) 소비.
//   · 창작·의역 금지 · md 원문 그대로 렌더.
//   · 축(axis) 배지·컬러는 data/day-trips.ts 3축 메타.
//   · 사진 미확보 → 축 컬러 그라디언트 폴백.

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";

import Shell from "@/components/layout/Shell";
import { Link } from "@/lib/navigation";
import {
  DAY_TRIPS_PAGE_COPY,
  getAxisBlock,
  type DayTripLocale,
} from "@/data/day-trips";
import { loadDayTrip } from "@/lib/day-trip-catalog-db";

export type PageLocale = DayTripLocale;

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
const RECOMMENDED_LABEL: Record<PageLocale, string> = {
  ko: "추천 시간",
  en: "Best time",
  ja: "おすすめ時間",
  "zh-CN": "推荐时间",
  "zh-TW": "推薦時間",
};
const STOPS_LABEL: Record<PageLocale, string> = {
  ko: "스팟",
  en: "Stops",
  ja: "スポット",
  "zh-CN": "站点",
  "zh-TW": "站點",
};
const CONTACT_LABEL: Record<PageLocale, string> = {
  ko: "문의하기",
  en: "Contact us",
  ja: "お問い合わせ",
  "zh-CN": "咨询",
  "zh-TW": "諮詢",
};
const BACK_LABEL: Record<PageLocale, string> = {
  ko: "당일코스 목록으로",
  en: "Back to day trips",
  ja: "日帰り一覧へ",
  "zh-CN": "返回一日游列表",
  "zh-TW": "返回一日遊列表",
};
const FOOTNOTE: Record<PageLocale, string> = {
  ko: "소요시간·교통편은 실시간 상황에 따라 달라질 수 있습니다.",
  en: "Travel time and routing may vary with real-time conditions.",
  ja: "所要時間・交通手段は当日の状況により変わることがあります。",
  "zh-CN": "用时与交通方式可能因实时状况而变化。",
  "zh-TW": "用時與交通方式可能因即時狀況而變化。",
};

export async function getDayTripDetailMetadata(
  id: string,
  locale: PageLocale
): Promise<Metadata> {
  const course = await loadDayTrip(id);
  if (!course) return { title: "당일코스" };
  return {
    title: course.name,
    description: course.hook,
    alternates: { canonical: `/${locale}/products/day-trips/${id}` },
  };
}

export default async function DayTripDetailPage({
  id,
  locale = "ko",
}: {
  id: string;
  locale?: PageLocale;
}) {
  const course = await loadDayTrip(id);
  if (!course) notFound();
  const axis = getAxisBlock(course.axis);
  const displayName = locale === "ko" || !course.nameEn ? course.name : course.nameEn;

  return (
    <Shell>
      <article className="bg-white text-[#232322]">
        <section className="mx-auto max-w-5xl px-4 pt-10 sm:px-6 sm:pt-14">
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500">
            <span
              aria-hidden="true"
              className="inline-block h-2 w-2 rounded-full"
              style={{ backgroundColor: axis.color }}
            />
            <span>{axis.label[locale]}</span>
            <span className="ml-2 inline-flex items-center rounded-full bg-slate-950 px-2 py-0.5 text-[10px] font-black text-white">
              {course.durationBadge}
            </span>
          </div>
          <h1 className="mt-3 text-3xl font-black leading-tight tracking-[-0.03em] text-slate-950 sm:text-4xl lg:text-5xl">
            {displayName}
          </h1>
          <p className="mt-3 max-w-3xl text-sm text-slate-600 sm:text-base">{course.hook}</p>
        </section>

        <section className="mx-auto mt-8 max-w-5xl px-4 sm:px-6">
          <div
            aria-hidden="true"
            className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl"
            style={{
              background: `linear-gradient(135deg, ${axis.color} 0%, ${axis.color}CC 55%, ${axis.color}99 100%)`,
            }}
          >
            <div className="absolute inset-0 flex items-end justify-between p-5">
              <span className="inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-950">
                {axis.label[locale]}
              </span>
              <span className="inline-flex items-center rounded-full bg-slate-950/90 px-3 py-1 text-[11px] font-black text-white">
                {course.durationBadge}
              </span>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
          <p className="whitespace-pre-line text-base leading-relaxed text-slate-800 sm:text-lg">
            {course.intro}
          </p>

          {course.stops.length > 0 && (
            <div className="mt-8">
              <h2 className="text-sm font-black uppercase tracking-[0.16em] text-slate-500">
                {STOPS_LABEL[locale]}
              </h2>
              <ul className="mt-3 space-y-3">
                {course.stops.map((s, i) => (
                  <li
                    key={`${s.name}-${i}`}
                    className="rounded-xl border border-slate-200 bg-white p-4"
                  >
                    <div className="flex items-baseline gap-2">
                      <span className="text-xs font-black text-slate-400">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-base font-bold text-slate-950">{s.name}</span>
                    </div>
                    <p className="mt-1 text-sm leading-relaxed text-slate-700">{s.note}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <dl className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                {DURATION_LABEL[locale]}
              </dt>
              <dd className="mt-2 text-base font-bold text-slate-950">{course.duration}</dd>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                {TRANSPORT_LABEL[locale]}
              </dt>
              <dd className="mt-2 whitespace-pre-line text-base font-bold text-slate-950">
                {course.transport}
              </dd>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                {RECOMMENDED_LABEL[locale]}
              </dt>
              <dd className="mt-2 text-base font-bold text-slate-950">
                {course.recommendedTime}
              </dd>
            </div>
          </dl>

          {course.note && (
            <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
              <p className="whitespace-pre-line text-sm text-amber-900">{course.note}</p>
            </div>
          )}

          <p className="mt-8 text-xs text-slate-500 sm:text-sm">{FOOTNOTE[locale]}</p>
        </section>

        <section className="bg-[#faf7f2]">
          <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
            <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
              <Link
                href="/products"
                className="text-sm font-semibold text-slate-700 underline-offset-4 hover:underline"
              >
                ← {BACK_LABEL[locale]}
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-sm font-bold text-white shadow-[0_8px_20px_rgba(16,32,58,0.20)] transition hover:brightness-110"
              >
                {CONTACT_LABEL[locale]}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <p className="mt-4 text-center text-[11px] text-slate-500 sm:text-left">
              {DAY_TRIPS_PAGE_COPY.anchorLabel[locale]}
            </p>
          </div>
        </section>
      </article>
    </Shell>
  );
}
