// 고양 BEST 큐레이션 카드 그리드 — 완성형 (사진 배경 + 이미지 배지 · Time Out 식).
//
// 카드 6장(walk/food/culture/kculture/history/family) · 4:3 · radius 20.
// 레이어 (아래→위):
//   1. 사진 배경 (next/image, src=/images/cards/card-<category>.jpg)
//      · 파일 부재/로드 실패 시 카테고리 색 gradient 폴백 (onError)
//   2. 하단 스크림 (투명 → 검정 0.7, 하단 40%)
//   3. 중앙 대형 배지 (next/image, src=/images/badges/badge-<category>.png)
//      · 파일 부재/로드 실패 시 자체 SVG 엠블럼(size=L) 폴백 (onError)
//      · 사진 폴백과 배지 폴백은 서로 독립 — 4가지 조합 모두 정상 렌더
//      · 폭 72% · object-contain (잘림 방지) · 세로 중앙보다 살짝 위 (-translate-y 6%)
//   4. 하단 좌측 텍스트 — 배지 유형에 따라 분기:
//      · 배지 이미지 O → 이미 GOYANG BEST 텍스트가 배지에 있으므로
//        하단은 작은 "카테고리 · N선" 만 (중복 방지)
//      · SVG 폴백 O → 기존 대형 헤드라인 유지 (배지에 텍스트 없어 필요)
//
// 그리드: 데스크톱 3열 · 태블릿 2열 · 모바일 1열 (6장이 3×2 배치)
// 헤드라인 N선 숫자는 card props(count), 미지정 시 로케일별 "큐레이션" 문구.
// 카드 링크는 앵커 플레이스홀더 — TODO(routing) 로 카테고리 랜딩 준비 후 갱신.

"use client";

import Image from "next/image";
import { useState } from "react";

import { Emblem } from "@/components/emblem/Emblem";
import {
  EMBLEM_COLORS,
  EMBLEM_RIBBON_TEXT,
  type EmblemCategory,
  type EmblemLocale,
} from "@/components/emblem/colors";

type LocaleKey = EmblemLocale;

const LOCALES: LocaleKey[] = ["ko", "en", "ja", "zh-CN", "zh-TW"];

const CATEGORIES: EmblemCategory[] = [
  "walk",
  "food",
  "culture",
  "kculture",
  "history",
  "family",
];

const SECTION_HEADLINE: Record<LocaleKey, string> = {
  ko: "이번 주 고양 BEST",
  en: "This Week's Goyang Best",
  ja: "今週の高陽ベスト",
  "zh-CN": "本周高阳BEST",
  "zh-TW": "本週高陽BEST",
};

/**
 * "고양 BEST N선" 로케일 템플릿.
 * count 미지정 시 로케일별 "큐레이션" 문구로 대체.
 */
const HEADLINE_WITH_COUNT: Record<LocaleKey, (n: number) => string> = {
  ko: (n) => `고양 BEST ${n}선`,
  en: (n) => `Goyang's ${n} Best`,
  ja: (n) => `高陽ベスト${n}選`,
  "zh-CN": (n) => `高阳BEST ${n}选`,
  "zh-TW": (n) => `高陽BEST ${n}選`,
};
const HEADLINE_CURATED: Record<LocaleKey, string> = {
  ko: "고양 BEST 큐레이션",
  en: "Goyang Best Curation",
  ja: "高陽ベストキュレーション",
  "zh-CN": "高阳BEST精选",
  "zh-TW": "高陽BEST精選",
};

/**
 * 배지 이미지 있을 때 하단에 작게 표시할 카운트 단위.
 * 예) ko 10선 / en 10 best / ja 10選 / zh-CN 10选 / zh-TW 10選
 */
const COUNT_UNIT: Record<LocaleKey, (n: number) => string> = {
  ko: (n) => `${n}선`,
  en: (n) => `${n} best`,
  ja: (n) => `${n}選`,
  "zh-CN": (n) => `${n}选`,
  "zh-TW": (n) => `${n}選`,
};

// TODO(content): 카드별 count 는 실 큐레이션 데이터가 확정되면 서버/CMS 로 이관.
const CARD_COUNT: Record<EmblemCategory, number | undefined> = {
  walk: 10,
  food: 10,
  culture: 10,
  kculture: 10,
  history: 10,
  family: 10,
};

// TODO(routing): 카테고리별 상세 라우트 준비되면 갱신.
const STORY_HREF: Record<EmblemCategory, string> = {
  walk: "#",
  food: "#",
  culture: "#",
  kculture: "#",
  history: "#",
  family: "#",
};

// 사진 배경 파일: public/images/cards/card-<category>.jpg (1200×900+, 4:3)
function photoSrc(cat: EmblemCategory): string {
  return `/images/cards/card-${cat}.jpg`;
}

// 중앙 배지 파일: public/images/badges/badge-<category>.png (투명 PNG, 512×512+)
function badgeSrc(cat: EmblemCategory): string {
  return `/images/badges/badge-${cat}.png`;
}

// 상위 3장(walk/food/culture)은 above-the-fold LCP 후보 → 배경 사진에만 priority
// (배지 이미지는 파일 부재 가능성이 있어 priority 미지정으로 preload 경고 회피)
const PRIORITY_CATEGORIES = new Set<EmblemCategory>([
  "walk",
  "food",
  "culture",
]);

export default function CuratedGridSection({ locale }: { locale: string }) {
  const activeLocale: LocaleKey = (
    LOCALES.includes(locale as LocaleKey) ? locale : "ko"
  ) as LocaleKey;
  const sectionHeadline = SECTION_HEADLINE[activeLocale];

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-18">
      <h2 className="text-xl font-black tracking-[-0.03em] text-slate-950 sm:text-2xl">
        {sectionHeadline}
      </h2>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORIES.map((cat) => (
          <CuratedCard
            key={cat}
            category={cat}
            locale={activeLocale}
            count={CARD_COUNT[cat]}
            priority={PRIORITY_CATEGORIES.has(cat)}
          />
        ))}
      </div>
    </section>
  );
}

function CuratedCard({
  category,
  locale,
  count,
  priority,
}: {
  category: EmblemCategory;
  locale: LocaleKey;
  count?: number;
  priority: boolean;
}) {
  const color = EMBLEM_COLORS[category];
  const ribbonLabel = EMBLEM_RIBBON_TEXT[locale][category];
  const headline =
    typeof count === "number"
      ? HEADLINE_WITH_COUNT[locale](count)
      : HEADLINE_CURATED[locale];
  // 사진 배경 · 배지 이미지는 서로 독립적으로 폴백 판정
  const [photoBroken, setPhotoBroken] = useState(false);
  const [badgeBroken, setBadgeBroken] = useState(false);

  return (
    <a
      id={`story-${category}`}
      href={STORY_HREF[category]}
      className="group block scroll-mt-24 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950"
    >
      <article
        className="relative aspect-[4/3] overflow-hidden rounded-[20px]"
        style={
          photoBroken
            ? { background: `linear-gradient(135deg, ${color} 0%, ${color}CC 100%)` }
            : undefined
        }
      >
        {/* 1. 사진 배경 — 부재/실패 시 gradient 폴백 */}
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

        {/* 2. 하단 스크림 — 투명 → 검정 0.7 (하단 40%) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 100%)",
          }}
        />

        {/* 3. 중앙 대형 배지 — 이미지 우선, 실패 시 자체 SVG 엠블럼 폴백
             · 폭 72% · 세로 중앙보다 살짝 위 (-translate-y 6%)
             · 헤드라인 영역(하단 40% 스크림) 과 안 겹치도록 위쪽으로 시프트
             · object-contain 으로 잘림 방지 */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="relative aspect-square w-[72%] -translate-y-[6%]">
            {!badgeBroken ? (
              <Image
                src={badgeSrc(category)}
                alt=""
                fill
                sizes="(max-width: 640px) 72vw, (max-width: 1024px) 36vw, 24vw"
                className="object-contain"
                onError={() => setBadgeBroken(true)}
              />
            ) : (
              <Emblem
                category={category}
                size="L"
                locale={locale}
                className="h-full w-full"
              />
            )}
          </div>
        </div>

        {/* 4. 하단 텍스트 블록 — 배지 유형에 따라 분기 */}
        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
          {badgeBroken ? (
            /* SVG 폴백일 때: 기존 대형 헤드라인 유지 (배지에 텍스트 없어 필요) */
            <>
              <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/90">
                {ribbonLabel}
              </div>
              <h3 className="mt-1 text-xl font-black leading-tight tracking-[-0.02em] text-white drop-shadow-sm sm:text-2xl">
                {headline}
              </h3>
            </>
          ) : (
            /* 배지 이미지 있을 때: 배지에 이미 GOYANG BEST 텍스트가 있으므로
               하단은 작은 "카테고리 · N선" 정도만 (중복 방지) */
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-white drop-shadow-sm">
              <span>{ribbonLabel}</span>
              {typeof count === "number" && (
                <span className="ml-2 font-black opacity-90">
                  · {COUNT_UNIT[locale](count)}
                </span>
              )}
            </h3>
          )}
        </div>
      </article>
    </a>
  );
}
