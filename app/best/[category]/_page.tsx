// /[locale]/best/[category] 상세 페이지 실체.
//
// Phase 1: 라우트 + 헤더 + 지역 필터 UI 뼈대 + placeholder.
//   · 유효하지 않은 category 는 notFound().
//   · items 0개면 "준비 중입니다" placeholder (5로케일).
//   · 지역 탭/칩은 시각만 (Phase 2에서 필터 동작 추가).
//
// 재사용:
//   · 헤더 배경: public/images/cards/card-{cat}.jpg (통짜 배지 카드 이미지)
//   · eyebrow · headline · sub 문안: data/curated-categories.ts
//   · 지역 목록: data/regions.ts
//   · items: data/curated-stories.ts (Phase 4까지 빈 배열)

import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";

import { Emblem } from "@/components/emblem/Emblem";
import {
  EMBLEM_COLORS,
  type EmblemCategory,
  type EmblemLocale,
} from "@/components/emblem/colors";
import Shell from "@/components/layout/Shell";
import {
  CATEGORY_LABEL,
  CATEGORY_TAG,
  CARD_COUNT,
  CARD_DESC,
  HEADLINE,
  isCuratedCategory,
} from "@/data/curated-categories";
import { getCuratedStory } from "@/data/curated-stories";
import { getRegionLabel, regions, type RegionLocale } from "@/data/regions";
import { Link } from "@/lib/navigation";

export type PageLocale = EmblemLocale;

const ALL_REGIONS_LABEL: Record<PageLocale, string> = {
  ko: "전체",
  en: "All",
  ja: "すべて",
  "zh-CN": "全部",
  "zh-TW": "全部",
};

const PLACEHOLDER: Record<PageLocale, string> = {
  ko: "10선 콘텐츠를 정성껏 준비하고 있습니다.",
  en: "The curated ten are being prepared with care.",
  ja: "10選コンテンツを準備中です。",
  "zh-CN": "十选内容正在精心准备中。",
  "zh-TW": "十選內容正在精心準備中。",
};

const PLACEHOLDER_SUB: Record<PageLocale, string> = {
  ko: "곧 이 자리에서 만나요.",
  en: "See you here soon.",
  ja: "近日中にこの場所でお会いしましょう。",
  "zh-CN": "很快在此与您见面。",
  "zh-TW": "很快在此與您見面。",
};

const CATALOG_CTA: Record<PageLocale, string> = {
  ko: "카탈로그 전체 보기",
  en: "See all in the catalog",
  ja: "カタログをすべて見る",
  "zh-CN": "查看完整目录",
  "zh-TW": "查看完整目錄",
};

export async function generateBestCategoryMetadata(
  category: string,
  locale: PageLocale
): Promise<Metadata> {
  if (!isCuratedCategory(category)) {
    return { title: "" };
  }
  const cat = category as EmblemCategory;
  const label = CATEGORY_LABEL[locale][cat];
  const n = CARD_COUNT[cat];
  const title = HEADLINE[locale](label, n);
  return {
    title,
    description: CARD_DESC[locale][cat],
    alternates: {
      canonical: `/${locale}/best/${cat}`,
    },
  };
}

export default async function BestCategoryPage({
  category,
  locale = "ko",
}: {
  category: string;
  locale?: PageLocale;
}) {
  if (!isCuratedCategory(category)) {
    notFound();
  }
  const cat = category as EmblemCategory;
  const label = CATEGORY_LABEL[locale][cat];
  const tag = CATEGORY_TAG[cat];
  const n = CARD_COUNT[cat];
  const headline = HEADLINE[locale](label, n);
  const desc = CARD_DESC[locale][cat];
  const color = EMBLEM_COLORS[cat];
  const story = getCuratedStory(cat);
  const orderedRegions = [...regions].sort((a, b) => a.order - b.order);

  return (
    <Shell>
      {/* Hero — card-{cat}.jpg 배경 + 반투명 어두운 오버레이 + 문안 */}
      <section className="relative overflow-hidden">
        <div className="relative aspect-[16/9] max-h-[520px] w-full">
          <Image
            src={`/images/cards/card-${cat}.jpg`}
            alt=""
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(0,0,0,0.20) 0%, rgba(0,0,0,0.55) 55%, rgba(0,0,0,0.88) 100%)",
            }}
          />
          <div className="absolute inset-x-0 bottom-0 px-6 pb-10 sm:pb-14 lg:pb-16">
            <div className="mx-auto max-w-6xl">
              <div className="flex items-center gap-3">
                <Emblem
                  category={cat}
                  size="M"
                  locale={locale}
                  className="h-12 w-12"
                />
                <div
                  className="text-[11px] font-bold uppercase tracking-[0.22em]"
                  style={{ color }}
                >
                  {label} · {tag}
                </div>
              </div>
              <h1 className="mt-3 text-3xl font-black leading-tight tracking-[-0.03em] text-white sm:text-4xl lg:text-5xl">
                {headline}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/85 sm:text-base">
                {desc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 지역 필터 (Phase 1: 시각 뼈대만, 동작은 Phase 2 이후) */}
      <section className="mx-auto max-w-6xl px-6 pt-8">
        <div className="flex flex-wrap gap-2">
          <span
            aria-current="true"
            className="inline-flex items-center rounded-full border border-slate-950 bg-slate-950 px-4 py-2 text-xs font-bold text-white"
          >
            {ALL_REGIONS_LABEL[locale]}
          </span>
          {orderedRegions.map((region) => (
            <span
              key={region.key}
              className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-500"
            >
              {getRegionLabel(region.key, locale as RegionLocale)}
            </span>
          ))}
        </div>
      </section>

      {/* items 리스트 or placeholder */}
      <section className="mx-auto max-w-6xl px-6 py-10 sm:py-14">
        {story.items.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Phase 4: items 렌더 자리 (id/rank/name/desc/photo/tags/links) */}
          </div>
        ) : (
          <div
            className="rounded-[24px] border border-slate-200 bg-white p-10 text-center shadow-[0_4px_14px_rgba(16,32,58,0.06)] sm:p-14"
            style={{ borderTop: `3px solid ${color}` }}
          >
            <p className="text-base font-black tracking-tight text-slate-950 sm:text-lg">
              {PLACEHOLDER[locale]}
            </p>
            <p className="mt-2 text-sm text-slate-500">
              {PLACEHOLDER_SUB[locale]}
            </p>
          </div>
        )}
      </section>

      {/* 카탈로그 전체 보기 CTA */}
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="flex justify-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#10203a] to-[#1e3a6e] px-6 py-3 text-sm font-bold text-white shadow-[0_8px_20px_rgba(16,32,58,0.20)] transition hover:brightness-110"
          >
            {CATALOG_CTA[locale]}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </Shell>
  );
}
