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
import { ArrowRight, MapPin } from "lucide-react";

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
import { CategoryIllustration } from "@/components/dmc/CategoryIllustration";
import { historyHeader, historyOutro, historyStories } from "@/data/history-stories";
import { loadSpots } from "@/lib/spot-catalog-db";
import { resolveSpotAutoPhoto } from "@/lib/spot-photos";
import { Link } from "@/lib/navigation";

export type PageLocale = EmblemLocale;

// 5로케일 공통 브랜드 라벨 (영문 고정). /best 인덱스에서도 재사용 (오더 #P1-f).
export const INSIDERS_BRAND = "GOYANG INSIDERS";

// 오더 #FINAL [A]: hero-{shopping,stay,night}.jpg 실사진 배선 완료 →
//   폴백 집합 비움. 앞으로 새 카테고리 추가 시 자산 미확보면 여기 넣어
//   gradient 폴백으로 대체 (기존 6+3 은 전량 실사진 보유).
const HERO_IMAGE_MISSING = new Set<EmblemCategory>();

export const ALL_REGIONS_LABEL: Record<PageLocale, string> = {
  ko: "전체",
  en: "All",
  ja: "すべて",
  "zh-CN": "全部",
  "zh-TW": "全部",
};

// 오더 #F0 [1]: N선/N選 표기 제거. 실제 항목 수와 무관한 일반 안내로.
const PLACEHOLDER: Record<PageLocale, string> = {
  ko: "콘텐츠를 정성껏 준비하고 있습니다.",
  en: "Curated content is being prepared with care.",
  ja: "コンテンツを準備中です。",
  "zh-CN": "内容正在精心准备中。",
  "zh-TW": "內容正在精心準備中。",
};

const PLACEHOLDER_SUB: Record<PageLocale, string> = {
  ko: "곧 이 자리에서 만나요.",
  en: "See you here soon.",
  ja: "近日中にこの場所でお会いしましょう。",
  "zh-CN": "很快在此与您见面。",
  "zh-TW": "很快在此與您見面。",
};

// 오더 #FINAL PART B [B-1]: /products → 당일코스 재편에 맞춰 CTA 문안 5로케일 갱신.
//   링크 target(/products) 무변경.
const CATALOG_CTA: Record<PageLocale, string> = {
  ko: "당일코스 보기",
  en: "See day trips",
  ja: "日帰り旅行を見る",
  "zh-CN": "查看一日游",
  "zh-TW": "查看一日遊",
};

// 오더 #C4 [3]: 카드 하단 "자세히 보기" CTA.
const CARD_MORE_CTA: Record<PageLocale, string> = {
  ko: "자세히 보기",
  en: "Read more",
  ja: "詳しく見る",
  "zh-CN": "查看详情",
  "zh-TW": "查看詳情",
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

  // 오더 #C54-B: 스팟 데이터를 admin Supabase 소스에서 loadSpots() 로 fetch.
  // published !== false 만. items map 반복 안에서 async 호출 없이 Map lookup.
  const spotList = await loadSpots();
  const spotBySlug = new Map(spotList.map((s) => [s.slug, s]));

  return (
    <Shell>
      {/* Hero — hero-{cat}.jpg 풍경 배경 + 어두운 스크림 + 문안 (오더 #BEST2-fix).
          card-{cat}.jpg (배지 통짜) 대신 이미 존재하는 hero 풍경 이미지 재사용:
          텍스트 대비 확보 + 배지 통짜가 화면을 다 먹는 문제 해소.
          오더 #B1 [1]: 사진 미확보(shopping/stay/night) 는 카테고리 컬러
          그라디언트로 대체. 스크림·문안 렌더 그대로. */}
      <section className="relative overflow-hidden">
        <div className="relative aspect-[16/9] max-h-[520px] w-full">
          {HERO_IMAGE_MISSING.has(cat) ? (
            <div
              aria-hidden="true"
              className="absolute inset-0"
              style={{
                background: `linear-gradient(135deg, ${color} 0%, ${color}CC 60%, ${color}99 100%)`,
              }}
            />
          ) : (
            <Image
              src={`/images/hero/hero-${cat}.jpg`}
              alt=""
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          )}
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

      {/* 오더 #E2 [2]: history 카테고리에서만 상단 GOYANG IN 10 STORIES. */}
      {cat === "history" && <HistoryStoriesSection locale={locale} />}

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
                오더 #C3 [1]: locale 에 맞춰 name/desc 스왑 (translations override → ko 폴백).
                오더 #C4 [3]: rank 를 items 배열 순서로 자동 부여 (index+1). */}
            {story.items.map((item, i) => (
              <BestListCard
                key={item.id}
                item={{
                  ...getLocalizedCuratedItem(item, story, locale),
                  rank: item.rank ?? i + 1,
                }}
                spot={spotBySlug.get(item.id) ?? null}
                spotLinked={spotBySlug.has(item.id)}
                locale={locale}
                categoryColor={color}
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
 * BEST 리스트 카드 (오더 #P7 [4], #C4 [2][3] 보강).
 * item.id ↔ Spot.slug 매칭. 소개층(Spot) 이 있으면 /dmc/{id} 로 링크,
 * 없으면 링크 없는 정보 카드 (링크 파손 0 원칙).
 *
 * 카드 구성 (#C4 [3]):
 *   사진(photoUrl → spot.gallery[0] → CategoryIllustration 폴백)
 *   → 순번(01) → 제목 → 지역 · 최근접역 → 한 줄 → 자세히 보기 →
 */
function BestListCard({
  item,
  spot,
  spotLinked,
  locale,
  categoryColor,
}: {
  item: CuratedItem;
  spot: import("@/data/spots").Spot | null;
  spotLinked: boolean;
  locale: PageLocale;
  /** 오더 #C47: 사진 없을 때 개선 플레이스홀더 그라디언트 배경 색. */
  categoryColor: string;
}) {
  // 오더 #C5-c [3] 사진 우선순위 통합:
  //   1) item.photoUrl (CuratedItem 수동)
  //   2) spot.gallery 중 cpyrht !== "Type3" 첫 장 (D3 저작권 필터)
  //   3) public/images/spots/{slug}-1.{ext} (D3 다운로드 규칙)
  //   4) public/images/spots/{slug}.{ext} (C5-b 자동 감지)
  //   5) 없음 → CategoryIllustration
  //   각 단계에서 Type3 자동 배제 (auto 감지 결과는 cpyrht 미상이지만
  //   사장님 승인 후 배치되는 파일이므로 안전 처리로 카드에 허용).
  const cardGalleryFirst = spot?.gallery?.find((g) => g.cpyrht !== "Type3");
  const autoPhoto = spot
    ? resolveSpotAutoPhoto(spot.slug, spot.title.ko)
    : null;
  const photoUrl =
    item.photoUrl ??
    cardGalleryFirst?.url ??
    autoPhoto?.url ??
    null;
  // 지역 라벨 (regions.ts key → locale 라벨)
  const regionLabel = item.region
    ? getRegionLabel(item.region, locale as RegionLocale)
    : null;
  // 최근접역 (spot.nearest_station.name 5로케일 스왑)
  const stationName = spot?.nearest_station?.name?.[locale] ?? null;
  const metaParts = [regionLabel, stationName].filter(Boolean);
  const rankStr =
    typeof item.rank === "number" ? String(item.rank).padStart(2, "0") : null;

  const inner = (
    <div className="flex h-full flex-col overflow-hidden rounded-[20px] border border-slate-200 bg-white transition group-hover:border-slate-950">
      <div className="relative aspect-[4/3] w-full bg-slate-100">
        {photoUrl ? (
          <>
            <Image
              src={photoUrl}
              alt={item.name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            {/* 오더 #C48: TourAPI 이미지 사용 시 카드 좌하단 미니 크레딧. */}
            {item.photoCredit && (
              <span className="pointer-events-none absolute bottom-1 left-1 rounded bg-black/55 px-1.5 py-0.5 text-[9px] font-medium text-white/90">
                {item.photoCredit}
              </span>
            )}
          </>
        ) : (
          // 오더 #C47: 개선 플레이스홀더 — 카테고리 색상 그라디언트 배경 + 장소명 흰 텍스트.
          //   기존 CategoryIllustration 만 표시 (아이콘 뿐) → "미완성 빈 카드" 문제 해소.
          //   실제 그 장소가 아닌 이미지 사용 0 (아무 이미지로 채우지 않음).
          <div
            aria-hidden="true"
            className="relative flex h-full w-full items-end p-4"
            style={{
              background: `linear-gradient(135deg, ${categoryColor} 0%, ${categoryColor}CC 55%, ${categoryColor}99 100%)`,
            }}
          >
            {spot ? (
              <div className="pointer-events-none absolute right-3 top-3 opacity-30">
                <CategoryIllustration
                  category={spot.category}
                  className="h-14 w-14 text-white"
                />
              </div>
            ) : null}
            <span className="relative text-lg font-black leading-tight tracking-[-0.02em] text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.35)] sm:text-xl">
              {item.name}
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        {rankStr ? (
          <div className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500">
            {rankStr}
          </div>
        ) : null}
        <p className="text-base font-black leading-tight tracking-tight text-slate-950 sm:text-lg">
          {item.name}
        </p>
        {metaParts.length > 0 ? (
          <p className="flex items-center gap-1 text-xs text-slate-500">
            <MapPin className="h-3 w-3 shrink-0" aria-hidden="true" />
            <span>{metaParts.join(" · ")}</span>
          </p>
        ) : null}
        {item.desc ? (
          <p className="line-clamp-3 text-sm text-slate-600">{item.desc}</p>
        ) : null}
        {spotLinked ? (
          <div className="mt-auto pt-2">
            <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-950 group-hover:text-slate-700">
              {CARD_MORE_CTA[locale]}
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
          </div>
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

// ─── 오더 #E2 [2] · #H2 [2]: GOYANG IN 10 STORIES — /best/history 상단 ─────
// open:null 챕터는 렌더 X (렌더 규칙 유지). 포스터·배우명 없음.
// #H2: 상단 hero_image (있으면) + 각 챕터 body 아래 인라인 image (있으면).
//   값이 비어 있으면 아무것도 렌더 안 함 — 빈 자리·깨짐 없어야 함.
function HistoryStoriesSection({ locale }: { locale: PageLocale }) {
  const visible = historyStories.filter((c) => c.open !== null);
  return (
    <section className="mx-auto max-w-6xl px-6 pt-10">
      <div className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#D4AF37]">
        GOYANG IN 10 STORIES
      </div>
      <h2 className="mt-3 text-2xl font-black leading-snug tracking-[-0.02em] sm:text-3xl">
        {historyHeader.title[locale]}
      </h2>
      <p className="mt-3 max-w-3xl text-base leading-relaxed text-[#232322]/85">
        {historyHeader.lead[locale]}
      </p>
      {historyHeader.hero_image && (
        <figure className="mt-6">
          <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100">
            <Image
              src={historyHeader.hero_image}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 1024px"
            />
          </div>
          {historyHeader.hero_image_credit && (
            <figcaption className="mt-2 text-[11px] text-[#232322]/55">
              {historyHeader.hero_image_credit}
            </figcaption>
          )}
        </figure>
      )}
      <div className="mt-8 space-y-8">
        {visible.map((c, i) => (
          <article key={i} className="border-l-2 border-[#D4AF37] pl-4">
            <div className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#D4AF37]">
              {c.eyebrow}
            </div>
            <p className="mt-1 text-xs font-black uppercase tracking-[0.2em] text-[#D4AF37]">
              {c.theme[locale]}
            </p>
            <h3 className="mt-2 text-lg font-black leading-snug tracking-[-0.02em]">
              {c.title[locale]}
            </h3>
            <p className="mt-1 text-sm text-[#232322]/70">→ {c.site[locale]}</p>
            <p className="mt-3 text-sm leading-relaxed text-[#232322]/85">
              {c.body[locale]}
            </p>
            {c.image && (
              <figure className="mt-4">
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100 sm:aspect-[16/9]">
                  <Image
                    src={c.image}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 720px"
                  />
                </div>
                {c.image_credit && (
                  <figcaption className="mt-2 text-[11px] text-[#232322]/55">
                    {c.image_credit}
                  </figcaption>
                )}
              </figure>
            )}
          </article>
        ))}
      </div>
      <p className="mt-8 border-t border-[#232322]/10 pt-6 text-base font-black italic text-[#232322]/70">
        {historyOutro[locale]}
      </p>
    </section>
  );
}
