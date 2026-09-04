// /[locale]/products/day-trips/[id] — 오더 #C56 [2] 당일코스 상세 안내 라우트.
//
// 방침 (사장님 확정):
//   · 판매·예약 없음. 소개형.
//   · data/day-trips.ts 원문만 렌더 (title/region/duration/transport/description).
//   · 창작·의역 금지 (원문 ko 폴백 A안 유지).
//   · 상단 소속 링(서울/경기) 레이블·서브라인·컬러 노출.
//   · 사진 미확보 → 링 컬러 그라디언트 폴백 (index 카드와 정합).

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";

import Shell from "@/components/layout/Shell";
import { Link } from "@/lib/navigation";
import {
  dayTripRings,
  type DayTripDestination,
  type DayTripLocale,
  type DayTripRingBlock,
} from "@/data/day-trips";

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
const REGION_LABEL: Record<PageLocale, string> = {
  ko: "지역",
  en: "Region",
  ja: "地域",
  "zh-CN": "地区",
  "zh-TW": "地區",
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

type Found = { destination: DayTripDestination; ring: DayTripRingBlock };

function findDestination(id: string): Found | null {
  for (const ring of dayTripRings) {
    const d = ring.destinations.find((x) => x.id === id);
    if (d) return { destination: d, ring };
  }
  return null;
}

export function getDayTripDetailMetadata(id: string, locale: PageLocale): Metadata {
  const found = findDestination(id);
  if (!found) return { title: "당일코스" };
  return {
    title: found.destination.title[locale],
    description: found.destination.description[locale],
    alternates: { canonical: `/${locale}/products/day-trips/${id}` },
  };
}

export default function DayTripDetailPage({
  id,
  locale = "ko",
}: {
  id: string;
  locale?: PageLocale;
}) {
  const found = findDestination(id);
  if (!found) notFound();
  const { destination: d, ring } = found;

  return (
    <Shell>
      <article className="bg-white text-[#232322]">
        <section className="mx-auto max-w-5xl px-4 pt-10 sm:px-6 sm:pt-14">
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500">
            <span
              aria-hidden="true"
              className="inline-block h-2 w-2 rounded-full"
              style={{ backgroundColor: ring.color }}
            />
            <span>{ring.label[locale]}</span>
          </div>
          <h1 className="mt-3 text-3xl font-black leading-tight tracking-[-0.03em] text-slate-950 sm:text-4xl lg:text-5xl">
            {d.title[locale]}
          </h1>
          <p className="mt-2 text-sm text-slate-500 sm:text-base">
            {ring.subline[locale]}
          </p>
        </section>

        <section className="mx-auto mt-8 max-w-5xl px-4 sm:px-6">
          <div
            aria-hidden="true"
            className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl"
            style={{
              background: `linear-gradient(135deg, ${ring.color} 0%, ${ring.color}CC 55%, ${ring.color}99 100%)`,
            }}
          >
            <div className="absolute inset-0 flex items-end p-5">
              <span className="inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-950">
                {d.region[locale]}
              </span>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
          <p className="whitespace-pre-line text-base leading-relaxed text-slate-800 sm:text-lg">
            {d.description[locale]}
          </p>

          <dl className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                {REGION_LABEL[locale]}
              </dt>
              <dd className="mt-2 text-base font-bold text-slate-950">{d.region[locale]}</dd>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                {DURATION_LABEL[locale]}
              </dt>
              <dd className="mt-2 text-base font-bold text-slate-950">{d.duration[locale]}</dd>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                {TRANSPORT_LABEL[locale]}
              </dt>
              <dd className="mt-2 text-base font-bold text-slate-950">{d.transport[locale]}</dd>
            </div>
          </dl>

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
          </div>
        </section>
      </article>
    </Shell>
  );
}
