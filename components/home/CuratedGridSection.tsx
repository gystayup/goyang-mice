// 고양 BEST 큐레이션 카드 그리드 — Time Out 잡지형 (이미지 블록 + 텍스트 블록 상하 분할).
//
// 카드 6장(walk/food/culture/kculture/history/family) · aspect-[4/5] · rounded 20.
// 카드 = 상단 이미지 블록(65%) + 하단 텍스트 블록(35%) 상하 분할.
//
// [상단 — 이미지 블록] (통짜 이미지)
//   · card-{cat}.jpg 한 장 (배지·타이틀 이미지에 포함, object-cover)
//   · 부재/실패 시 카테고리 gradient 폴백
//
// [하단 — 텍스트 블록] (bg-white)
//   · 카테고리 레이블 ({로케일 라벨} · {영문 태그}, 엠블럼 색, 11px bold uppercase)
//   · 헤드라인 "고양 BEST {카테고리}" (slate-950, black) — 오더 #F0 [1] 「N선」 제거
//   · 설명 1문장 (카테고리·로케일별, slate-600, 2줄 제한)
//   · "자세히 보기 →" (slate-500, group-hover 시 slate-950)
//
// 접근성: 카드 <Link aria-label={{레이블} — {헤드라인}}> — 스크린리더 대응.
// 판매 소구어 0 (안내 톤만).
//
// 그리드: 3열/2열/1열. 카드 링크 목적지 = /best/{cat} (오더 #BEST1).
//
// Props (오더 #P1-f 로 추가):
//   · categories  — 렌더할 카테고리 목록. 기본 = 전체 6장.
//   · showHeadline — 섹션 상단 SECTION_HEADLINE 노출 여부. 기본 = true.
//   · ctaHref     — 지정 시 그리드 하단에 "고양 BEST 전체 보기 →" CTA 링크.

"use client";

import Image from "next/image";
import { useState } from "react";

import { Emblem } from "@/components/emblem/Emblem";
import {
  EMBLEM_COLORS,
  type EmblemCategory,
  type EmblemLocale,
} from "@/components/emblem/colors";
import {
  CURATED_CATEGORIES,
  CATEGORY_LABEL,
  CATEGORY_TAG,
  HEADLINE,
  CARD_COUNT,
  CARD_DESC,
} from "@/data/curated-categories";
import { Link } from "@/lib/navigation";

type LocaleKey = EmblemLocale;

const LOCALES: LocaleKey[] = ["ko", "en", "ja", "zh-CN", "zh-TW"];

const SECTION_HEADLINE: Record<LocaleKey, string> = {
  ko: "고양일산 BEST",
  en: "Goyang-Ilsan Best",
  ja: "高陽・一山ベスト",
  "zh-CN": "高阳·一山BEST",
  "zh-TW": "高陽·一山BEST",
};

/** "자세히 보기" 링크 문구 (로케일별). */
const READ_MORE: Record<LocaleKey, string> = {
  ko: "자세히 보기 →",
  en: "Read more →",
  ja: "詳しく見る →",
  "zh-CN": "查看详情 →",
  "zh-TW": "查看詳情 →",
};

/** "전체 보기" 하단 CTA 문구 (오더 #P1-f, 홈 티저용). */
const VIEW_ALL_CTA: Record<LocaleKey, string> = {
  ko: "고양 BEST 전체 보기 →",
  en: "See all Goyang Best →",
  ja: "高陽ベストをすべて見る →",
  "zh-CN": "查看全部高阳精选 →",
  "zh-TW": "查看全部高陽精選 →",
};

// 카테고리 상세 라우트 (오더 #BEST1). 오더 #P1 로 홈의 앵커 진입
// (#story-<cat>) 는 폐지되어 target id 도 제거됨.
// 오더 #B1 [1]: shopping·stay·night 3키 추가.
const STORY_HREF: Record<EmblemCategory, string> = {
  walk: "/best/walk",
  food: "/best/food",
  culture: "/best/culture",
  kculture: "/best/kculture",
  history: "/best/history",
  family: "/best/family",
  shopping: "/best/shopping",
  stay: "/best/stay",
  night: "/best/night",
};

// 통짜 카드 이미지 파일: public/images/cards/card-<category>.jpg
// (배지·타이틀이 이미지 안에 포함된 완성본)
function photoSrc(cat: EmblemCategory): string {
  return `/images/cards/card-${cat}.jpg`;
}

// 오더 #V7: card-{shopping,stay,night}.jpg 실사진 배선 완료 → 폴백 집합 비움.
//   앞으로 새 카테고리 추가 시 자산 미확보면 여기 넣어 gradient 폴백으로 대체
//   (기존 6+3 은 전량 실사진 보유).
const CARD_PHOTO_MISSING = new Set<EmblemCategory>();

// 오더 #EMB [1]: card-{cat}.jpg 이미지 자체에 배지 도안이 인쇄된 카테고리.
//   이 3장은 이미지 안 배지로 이미 노출 중 → 오버레이 SVG 안 그림 (이중 방지).
//   나머지 6개 카드는 <Emblem> SVG 를 이미지 블록 중앙에 오버레이하여
//   9/9 균일 노출. 사장님 옵션 B 확정 (2026-09-02).
const HAS_BAKED_EMBLEM = new Set<EmblemCategory>(["kculture", "history", "family"]);

// 상위 3장(walk/food/culture)은 above-the-fold LCP 후보 → 배경 사진 priority
const PRIORITY_CATEGORIES = new Set<EmblemCategory>([
  "walk",
  "food",
  "culture",
]);

export default function CuratedGridSection({
  locale,
  categories,
  showHeadline = true,
  ctaHref,
}: {
  locale: string;
  categories?: EmblemCategory[];
  showHeadline?: boolean;
  ctaHref?: string;
}) {
  const activeLocale: LocaleKey = (
    LOCALES.includes(locale as LocaleKey) ? locale : "ko"
  ) as LocaleKey;
  const sectionHeadline = SECTION_HEADLINE[activeLocale];
  const renderCategories = categories ?? CURATED_CATEGORIES;
  const viewAllLabel = VIEW_ALL_CTA[activeLocale];

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-18">
      {showHeadline && (
        <h2 className="text-xl font-black tracking-[-0.03em] text-slate-950 sm:text-2xl">
          {sectionHeadline}
        </h2>
      )}

      <div
        className={`grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 ${
          showHeadline ? "mt-8" : ""
        }`}
      >
        {renderCategories.map((cat) => (
          <CuratedCard
            key={cat}
            category={cat}
            locale={activeLocale}
            priority={PRIORITY_CATEGORIES.has(cat)}
          />
        ))}
      </div>

      {ctaHref && (
        <div className="mt-8 flex justify-center">
          <Link
            href={ctaHref}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-950 shadow-[0_4px_14px_rgba(16,32,58,0.06)] transition hover:border-slate-950 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950"
          >
            {viewAllLabel}
          </Link>
        </div>
      )}
    </section>
  );
}

function CuratedCard({
  category,
  locale,
  priority,
}: {
  category: EmblemCategory;
  locale: LocaleKey;
  priority: boolean;
}) {
  const color = EMBLEM_COLORS[category];
  const label = CATEGORY_LABEL[locale][category];
  const tag = CATEGORY_TAG[category];
  const headline = HEADLINE[locale](label, CARD_COUNT[category]);
  const description = CARD_DESC[locale][category];
  const readMore = READ_MORE[locale];
  // 통짜 카드 이미지 폴백: 부재/실패 시 카테고리 gradient.
  // 오더 #B1 [1]: shopping/stay/night 는 파일 미확보 → 초기 true 로 렌더.
  const [photoBroken, setPhotoBroken] = useState(
    CARD_PHOTO_MISSING.has(category)
  );

  return (
    <Link
      href={STORY_HREF[category]}
      aria-label={`${label} — ${headline}`}
      className="group block scroll-mt-24 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950"
    >
      <article className="grid aspect-[4/5] grid-rows-[13fr_7fr] overflow-hidden rounded-[20px] bg-white ring-1 ring-slate-200/70 transition-shadow group-hover:shadow-md">
        {/* [상단 — 이미지 블록] 통짜 이미지 (배지·타이틀 포함) */}
        <div
          className="relative overflow-hidden"
          style={
            photoBroken
              ? { background: `linear-gradient(135deg, ${color} 0%, ${color}CC 100%)` }
              : undefined
          }
        >
          {!photoBroken && (
            <Image
              src={photoSrc(category)}
              alt=""
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition duration-500 group-hover:scale-[1.03]"
              priority={priority}
              onError={() => setPhotoBroken(true)}
            />
          )}
          {/* 오더 #EMB [1]: 이미지에 배지가 인쇄돼 있지 않은 6개 카테고리에만
              <Emblem> SVG 를 중앙 오버레이. 인쇄본 3장(kculture/history/family)
              은 이중 방지 위해 생략. hideRibbon=true (하단 텍스트에 카테고리명
              이미 있음). pointer-events-none 로 Link 클릭 가로채기 방지. */}
          {!HAS_BAKED_EMBLEM.has(category) && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 flex items-center justify-center"
            >
              <Emblem
                category={category}
                size="L"
                locale={locale}
                hideRibbon
                className="drop-shadow-[0_8px_20px_rgba(0,0,0,0.25)]"
              />
            </div>
          )}
        </div>

        {/* [하단 — 텍스트 블록] 레이블 + 헤드라인 + 설명 + 자세히 보기 */}
        <div className="flex flex-col justify-between gap-2 p-5 sm:p-6">
          <div>
            <div
              className="text-[11px] font-bold uppercase tracking-[0.2em]"
              style={{ color }}
            >
              {label} · {tag}
            </div>
            <h3 className="mt-1.5 text-base font-black leading-tight tracking-[-0.02em] text-slate-950 sm:text-lg">
              {headline}
            </h3>
            <p className="mt-2 line-clamp-2 text-sm leading-snug text-slate-600">
              {description}
            </p>
          </div>
          <div className="text-xs font-semibold text-slate-500 transition-colors group-hover:text-slate-950">
            {readMore}
          </div>
        </div>
      </article>
    </Link>
  );
}
