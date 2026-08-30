// /[locale]/best — 고양 BEST 인덱스 (오더 #P1 · #P1-f).
//
// 홈 티저(3장)와 차별화된 랜딩 페이지.
// 구성:
//   1) 페이지 헤더 (신설):
//        · eyebrow  = INSIDERS_BRAND ("GOYANG INSIDERS", 재사용)
//        · h1       = "GOYANG BEST" (5로케일 공통 영문 브랜드)
//        · subtitle = 인사이더가 고르는 고양일산 (5로케일)
//   2) 지역 필터 칩 (전체·덕양구·일산동구·일산서구) — 시각 뼈대만.
//        · /best/[category] 의 지역 필터 마크업/스타일 그대로 재사용.
//   3) CuratedGridSection (카드 6장 전체, showHeadline=false, ctaHref 없음).
//
// SSG 전환 (오더 #P1-f): 네비 최상단 진입점이라 정적 렌더 유지가 유리.
// dynamic 지정 없이 generateStaticParams 로 5로케일 사전 렌더.
//
// 신규 디자인 금지 조건: INSIDERS_BRAND · 지역 필터 칩 · CuratedGridSection
// 모두 기존 자원 재사용. 새로 도입한 것은 페이지 헤더 문안(신설 허용)뿐.

import type { Metadata } from "next";

import CuratedGridSection from "@/components/home/CuratedGridSection";
import Shell from "@/components/layout/Shell";
import { navigationLabels, type LocaleKey } from "@/data/navigation";
import { getRegionLabel, regions, type RegionLocale } from "@/data/regions";
import {
  ALL_REGIONS_LABEL,
  INSIDERS_BRAND,
} from "@/app/best/[category]/_page";

const SUPPORTED: LocaleKey[] = ["ko", "en", "ja", "zh-CN", "zh-TW"];

function toLocale(locale: string): LocaleKey {
  return SUPPORTED.includes(locale as LocaleKey)
    ? (locale as LocaleKey)
    : "ko";
}

/** 5로케일 사전 렌더 (SSG). */
export function generateStaticParams() {
  return SUPPORTED.map((locale) => ({ locale }));
}

/** 인덱스 페이지 h1 — 5로케일 공통 영문 브랜드. */
const PAGE_TITLE = "GOYANG BEST";

/** 인덱스 페이지 subtitle (5로케일). 판매 소구어 0, 안내 톤. */
const PAGE_SUBTITLE: Record<LocaleKey, string> = {
  ko: "인사이더가 고르는 고양일산",
  en: "Goyang-Ilsan, chosen by insiders",
  ja: "インサイダーが選ぶ高陽・一山",
  "zh-CN": "内行人精选的高阳·一山",
  "zh-TW": "內行人精選的高陽·一山",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const active = toLocale(locale);
  return {
    title: `${PAGE_TITLE} — ${navigationLabels[active].best}`,
    description: PAGE_SUBTITLE[active],
    alternates: {
      canonical: `/${active}/best`,
    },
  };
}

export default async function LocaleBestIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const active = toLocale(locale);
  const subtitle = PAGE_SUBTITLE[active];
  const orderedRegions = [...regions].sort((a, b) => a.order - b.order);

  return (
    <Shell>
      {/* 페이지 헤더 (신설) — 기존 INSIDERS 브랜드 라벨 재사용 */}
      <section className="mx-auto max-w-6xl px-6 pt-10 sm:pt-14">
        <div className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#b7912c] sm:text-[11px]">
          {INSIDERS_BRAND}
        </div>
        <h1 className="mt-3 text-3xl font-black leading-tight tracking-[-0.03em] text-slate-950 sm:text-4xl lg:text-5xl">
          {PAGE_TITLE}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
          {subtitle}
        </p>
      </section>

      {/* 지역 필터 (Phase 1: 시각 뼈대만) — /best/[category] 마크업 재사용 */}
      <section className="mx-auto max-w-6xl px-6 pt-8">
        <div className="flex flex-wrap gap-2">
          <span
            aria-current="true"
            className="inline-flex items-center rounded-full border border-slate-950 bg-slate-950 px-4 py-2 text-xs font-bold text-white"
          >
            {ALL_REGIONS_LABEL[active]}
          </span>
          {orderedRegions.map((region) => (
            <span
              key={region.key}
              className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-500"
            >
              {getRegionLabel(region.key, active as RegionLocale)}
            </span>
          ))}
        </div>
      </section>

      {/* 6카드 그리드 (기존 컴포넌트 재사용, 섹션 헤드라인 · CTA 숨김) */}
      <CuratedGridSection locale={active} showHeadline={false} />
    </Shell>
  );
}
