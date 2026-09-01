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
  INSIDER_TAGLINE,
  isCuratedCategory,
} from "@/data/curated-categories";
import {
  getCuratedStory,
  getLocalizedCuratedItem,
  type CuratedItem,
} from "@/data/curated-stories";
import { getRegionLabel, regions, type RegionLocale } from "@/data/regions";
import { hasSpot } from "@/data/spots";
import { Link } from "@/lib/navigation";

export type PageLocale = EmblemLocale;

// 5로케일 공통 브랜드 라벨 (영문 고정). /best 인덱스에서도 재사용 (오더 #P1-f).
export const INSIDERS_BRAND = "GOYANG INSIDERS";

export const ALL_REGIONS_LABEL: Record<PageLocale, string> = {
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
  const insiderTagline = INSIDER_TAGLINE[locale][cat];
  const color = EMBLEM_COLORS[cat];
  const story = getCuratedStory(cat);
  const orderedRegions = [...regions].sort((a, b) => a.order - b.order);

  return (
    <Shell>
      {/* Hero — hero-{cat}.jpg 풍경 배경 + 어두운 스크림 + 문안 (오더 #BEST2-fix).
          card-{cat}.jpg (배지 통짜) 대신 이미 존재하는 hero 풍경 이미지 재사용:
          텍스트 대비 확보 + 배지 통짜가 화면을 다 먹는 문제 해소. */}
      <section className="relative overflow-hidden">
        <div className="relative aspect-[16/9] max-h-[520px] w-full">
          <Image
            src={`/images/hero/hero-${cat}.jpg`}
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
                "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.65) 55%, rgba(0,0,0,0.92) 100%)",
            }}
          />
          <div className="absolute inset-x-0 bottom-0 px-6 pb-10 sm:pb-14 lg:pb-16">
            <div className="mx-auto max-w-6xl">
              {/* GOYANG INSIDERS 브랜드 라벨 (5로케일 공통 영문 고정) */}
              <div className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#ffe98b] sm:text-[11px]">
                {INSIDERS_BRAND}
              </div>
              <div className="mt-3 flex items-center gap-3">
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
              {/* Insider 태그라인 — h1 아래, 안내 톤 앞의 저자 목소리 */}
              <p className="mt-2 text-sm font-semibold italic text-[#ffe98b]/95 sm:text-base">
                {insiderTagline}
              </p>
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
            {/* 오더 #P7 [4] 링크 배선: item.id 로 Spot 존재 여부 확인 후
                존재할 때만 /dmc/{id} 링크. 데이터 없는 항목은 무링크 카드 유지.
                오더 #C3 [1]: locale 에 맞춰 name/desc 스왑 (translations override → ko 폴백). */}
            {story.items.map((item) => (
              <BestListCard
                key={item.id}
                item={getLocalizedCuratedItem(item, story, locale)}
                spotLinked={hasSpot(item.id)}
              />
            ))}
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

/**
 * BEST 리스트 카드 (오더 #P7 [4]).
 * item.id ↔ Spot.slug 매칭. 소개층(Spot) 이 있으면 /dmc/{id} 로 링크,
 * 없으면 링크 없는 정보 카드 (링크 파손 0 원칙).
 */
function BestListCard({
  item,
  spotLinked,
}: {
  item: CuratedItem;
  spotLinked: boolean;
}) {
  const inner = (
    <div className="flex h-full flex-col overflow-hidden rounded-[20px] border border-slate-200 bg-white transition group-hover:border-slate-950">
      {item.photoUrl ? (
        <div className="relative aspect-[4/3] w-full bg-slate-100">
          <Image
            src={item.photoUrl}
            alt={item.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      ) : null}
      <div className="flex flex-1 flex-col gap-2 p-5">
        <p className="text-base font-black leading-tight tracking-tight text-slate-950 sm:text-lg">
          {typeof item.rank === "number" ? (
            <span className="mr-2 text-xs text-slate-500">
              {String(item.rank).padStart(2, "0")}
            </span>
          ) : null}
          {item.name}
        </p>
        {item.desc ? (
          <p className="line-clamp-3 text-sm text-slate-600">{item.desc}</p>
        ) : null}
      </div>
    </div>
  );

  if (spotLinked) {
    return (
      <Link href={`/dmc/${item.id}`} className="group block">
        {inner}
      </Link>
    );
  }
  // Spot 데이터가 아직 없는 항목: 링크 미생성 (오더 #P7 [4]).
  return <div className="group block">{inner}</div>;
}
