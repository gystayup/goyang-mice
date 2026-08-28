// 고양 BEST 큐레이션 카드 그리드 — Time Out 정석 (사진 배경 + 중앙 배지).
//
// 카드 6장(walk/food/culture/kculture/history/family) · 4:3 · radius 20.
// 레이어 (아래→위):
//   1. 사진 배경 (next/image, src=/images/cards/card-<category>.jpg, object-cover 꽉 채움)
//      · 파일 부재/로드 실패 시 카테고리 색 gradient 폴백 (onError)
//   2. 중앙 배지 (카드 폭의 60%, 정중앙, min 140 / max 260px)
//      · next/image src=/images/badges/badge-<category>.png (투명 PNG, 타이틀 텍스트 포함)
//      · drop-shadow-lg 로 사진과 시각적 분리
//      · 파일 부재/로드 실패 시 자체 SVG 엠블럼(size=L) 폴백
//      · SVG 폴백일 때만 배지 아래 카테고리명 텍스트 추가 (접근성 보완)
//
// 스크림/하단 헤드라인 오버레이 없음 — 배지 이미지에 타이틀 텍스트가 이미 포함되어
// 있어 별도 오버레이가 불필요하고, 사진을 그대로 노출.
//
// 접근성: 카드 <a aria-label={카테고리명}> — 텍스트 오버레이가 사라져도
//         스크린리더가 카테고리를 읽어 냄.
//
// 그리드: 데스크톱 3열 · 태블릿 2열 · 모바일 1열 (6장 = 3×2)
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

// 중앙 배지 파일: public/images/badges/badge-<category>.png (투명 PNG, 512×512+, 타이틀 텍스트 포함)
function badgeSrc(cat: EmblemCategory): string {
  return `/images/badges/badge-${cat}.png`;
}

// 상위 3장(walk/food/culture)은 above-the-fold LCP 후보 → 배경 사진에 priority
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
  priority,
}: {
  category: EmblemCategory;
  locale: LocaleKey;
  priority: boolean;
}) {
  const color = EMBLEM_COLORS[category];
  const ribbonLabel = EMBLEM_RIBBON_TEXT[locale][category];
  // 사진 배경 · 배지 이미지 각각 독립 폴백
  const [photoBroken, setPhotoBroken] = useState(false);
  const [badgeBroken, setBadgeBroken] = useState(false);

  return (
    <a
      id={`story-${category}`}
      href={STORY_HREF[category]}
      aria-label={ribbonLabel}
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
        {/* 1. 사진 배경 (object-cover 로 카드 꽉 채움) — 부재/실패 시 gradient 폴백 */}
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

        {/* 2. 중앙 배지 (카드 폭의 60%, 정중앙, min/max 클램프)
             · 배지 이미지에 카테고리명·"BEST" 등 타이틀 텍스트가 이미 포함
             · drop-shadow-lg 로 사진과 시각적 분리
             · SVG 폴백일 때만 배지 아래 카테고리명 텍스트 추가 (접근성 보완) */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="relative aspect-square w-[60%] min-w-[140px] max-w-[260px]">
              {!badgeBroken ? (
                <Image
                  src={badgeSrc(category)}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 60vw, (max-width: 1024px) 30vw, 20vw"
                  className="object-contain drop-shadow-lg"
                  onError={() => setBadgeBroken(true)}
                />
              ) : (
                <Emblem
                  category={category}
                  size="L"
                  locale={locale}
                  className="h-full w-full drop-shadow-lg"
                />
              )}
            </div>
            {badgeBroken && (
              <div className="text-center text-sm font-bold tracking-[0.15em] text-white drop-shadow-md">
                {ribbonLabel}
              </div>
            )}
          </div>
        </div>
      </article>
    </a>
  );
}
