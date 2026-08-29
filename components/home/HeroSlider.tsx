// components/home/HeroSlider.tsx
// 홈 최상단 Hero — 6 카테고리 순환 Ken Burns 슬라이더 (Time Out 폴리시).
//
// 슬라이드 6장: walk / food / culture / kculture / history / family
//   · 배경 사진 (public/images/hero/hero-<cat>.jpg — 순수 풍경, 카드용 통짜 배지 이미지와 분리)
//   · Ken Burns: scale 1 → 1.14, 12s ease-out infinite alternate
//     · transformOrigin 카테고리마다 다른 방향
//     · @media (prefers-reduced-motion: reduce) 시 애니메이션 자동 비활성
//
// 오버레이 (Time Out 폴리시):
//   · 다중 스크림 — 좌 강→우 약 (다이애그널) + 하단 강 (텍스트 대비 확보)
//   · 우상단 코너: 배지 (badge-<cat>.png, 축소 · 헤드라인과 물리적 분리)
//   · 좌측 정렬: 라벨 pill → 대형 헤드라인 → 서브 → CTA (수직 리듬)
//   · 헤드라인: text-4xl sm:text-6xl lg:text-7xl, font-black, tracking-[-0.03em],
//               leading-[1.02] (WHY 섹션 수준의 무게감)
//   · CTA "자세히 보기 →" — 앵커 #story-<cat>
//   · 하단 카테고리 프리뷰 (Time Out식): 얇은 라인 + 카테고리명 6개,
//     현재 슬라이드 강조 (흰색), 나머지는 옅게 (white/50)
//   · 좌/우 화살표: 우하단 코너 (배지·프리뷰와 안 겹침)
//
// 폰트: globals.css 의 --font-sans (SUIT Variable → Pretendard Variable → Noto Sans KR)
//       fallback stack 을 상속 — WHY 섹션과 동일 서체 라인 (일관성).
//       (next/font 실 파일 로드는 별도 오더 스코프)
//
// 접근성: 카드 링크 aria-label, 카테고리 프리뷰 aria-current,
//         화살표·라벨 aria-label 5로케일. prefers-reduced-motion CSS 자동.
//
// 판매 소구어 0. i18n 키 구조 무접촉 (컴포넌트 내부 상수만 사용).

"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Emblem } from "@/components/emblem/Emblem";
import {
  type EmblemCategory,
  type EmblemLocale,
} from "@/components/emblem/colors";

const LOCALES: EmblemLocale[] = ["ko", "en", "ja", "zh-CN", "zh-TW"];
const CATEGORIES: EmblemCategory[] = [
  "walk",
  "food",
  "culture",
  "kculture",
  "history",
  "family",
];
const SLIDE_DURATION_MS = 6000;

/** 카테고리 짧은 로케일 라벨 (헤드라인·프리뷰·라벨 pill 용). */
const CATEGORY_LABEL: Record<EmblemLocale, Record<EmblemCategory, string>> = {
  ko: {
    walk: "산책",
    food: "미식",
    culture: "문화",
    kculture: "K컬처",
    history: "역사",
    family: "가족",
  },
  en: {
    walk: "Walks",
    food: "Food",
    culture: "Culture",
    kculture: "K-Culture",
    history: "History",
    family: "Family",
  },
  ja: {
    walk: "散策",
    food: "美食",
    culture: "文化",
    kculture: "K文化",
    history: "歴史",
    family: "ファミリー",
  },
  "zh-CN": {
    walk: "散步",
    food: "美食",
    culture: "文化",
    kculture: "K文化",
    history: "历史",
    family: "亲子",
  },
  "zh-TW": {
    walk: "散步",
    food: "美食",
    culture: "文化",
    kculture: "K文化",
    history: "歷史",
    family: "親子",
  },
};

/** "고양 BEST {카테고리}" 로케일 헤드라인 템플릿. */
const HERO_HEADLINE: Record<EmblemLocale, (l: string) => string> = {
  ko: (l) => `고양 BEST ${l}`,
  en: (l) => `Goyang Best ${l}`,
  ja: (l) => `高陽ベスト${l}`,
  "zh-CN": (l) => `高阳${l}BEST`,
  "zh-TW": (l) => `高陽${l}BEST`,
};

/** Hero 서브 문구 (CuratedGridSection.CARD_DESC 와 문안 일관). 안내 톤. */
const HERO_DESC: Record<EmblemLocale, Record<EmblemCategory, string>> = {
  ko: {
    walk: "일산호수공원부터 정발산까지, 사계절 걷기 좋은 길",
    food: "일산 카페거리부터 백석 맛집까지, 놓치면 아쉬운 한 끼",
    culture: "아람누리·꽃누리에서 만나는 이번 시즌 공연·전시",
    kculture: "킨텍스에서 열리는 K-POP·팬 이벤트의 중심",
    history: "행주산성부터 서오릉까지, 걸으며 만나는 고양의 시간",
    family: "스타필드·원마운트, 아이와 하루가 짧은 곳",
  },
  en: {
    walk: "From Ilsan Lake Park to Jeongbalsan — trails made for every season.",
    food: "From Ilsan's cafe streets to Baekseok's kitchens — a meal worth the trip.",
    culture: "This season's stages and exhibitions at Aram Nuri and Kkot Nuri.",
    kculture: "KINTEX — the hub of K-POP concerts and fan events.",
    history: "From Haengju Fortress to Seooreung — Goyang's story, on foot.",
    family: "Starfield and OneMount — where a day with the kids is never long enough.",
  },
  ja: {
    walk: "一山湖水公園から鼎鉢山まで、四季を通じて歩きたい道。",
    food: "一山カフェ通りから白石の名店まで、逃したくない一食。",
    culture: "アラムヌリ・コッヌリで出会う、今シーズンの舞台と展示。",
    kculture: "KINTEXで開かれるK-POP・ファンイベントの中心地。",
    history: "幸州山城から西五陵まで、歩いて出会う高陽の時間。",
    family: "Starfield・OneMount、子どもと過ごす一日が短い場所。",
  },
  "zh-CN": {
    walk: "从一山湖水公园到鼎钵山，四季皆宜的漫步路线。",
    food: "从一山咖啡街到白石名店，一顿不容错过的美味。",
    culture: "在阿蓝努里·花努里，遇见本季演出与展览。",
    kculture: "KINTEX——K-POP与粉丝活动的中心。",
    history: "从幸州山城到西五陵，步行走进高阳的历史。",
    family: "Starfield·OneMount，与孩子共度的一天总嫌短。",
  },
  "zh-TW": {
    walk: "從一山湖水公園到鼎缽山，四季皆宜的漫步路線。",
    food: "從一山咖啡街到白石名店，一頓不容錯過的美味。",
    culture: "在阿藍努里·花努里，遇見本季演出與展覽。",
    kculture: "KINTEX——K-POP與粉絲活動的中心。",
    history: "從幸州山城到西五陵，步行走進高陽的歷史。",
    family: "Starfield·OneMount，與孩子共度的一天總嫌短。",
  },
};

const READ_MORE: Record<EmblemLocale, string> = {
  ko: "자세히 보기 →",
  en: "Read more →",
  ja: "詳しく見る →",
  "zh-CN": "查看详情 →",
  "zh-TW": "查看詳情 →",
};

const PREV_LABEL: Record<EmblemLocale, string> = {
  ko: "이전 슬라이드",
  en: "Previous slide",
  ja: "前のスライド",
  "zh-CN": "上一张",
  "zh-TW": "上一張",
};
const NEXT_LABEL: Record<EmblemLocale, string> = {
  ko: "다음 슬라이드",
  en: "Next slide",
  ja: "次のスライド",
  "zh-CN": "下一张",
  "zh-TW": "下一張",
};

/** Ken Burns transform-origin (카테고리마다 다른 방향). */
const KEN_BURNS_ORIGIN: Record<EmblemCategory, string> = {
  walk: "left top",
  food: "right center",
  culture: "center top",
  kculture: "right bottom",
  history: "left bottom",
  family: "center bottom",
};

function photoSrc(cat: EmblemCategory) {
  return `/images/hero/hero-${cat}.jpg`;
}
function badgeSrc(cat: EmblemCategory) {
  return `/images/badges/badge-${cat}.png`;
}
function anchorHref(cat: EmblemCategory) {
  return `#story-${cat}`;
}

/**
 * 우상단 배지 (SlideBadge) — 카테고리별 배지 이미지, 실패 시 SVG 엠블럼 폴백.
 * 부모에서 key={currentCat} 로 렌더하면 카테고리 전환 시 컴포넌트 리마운트되어
 * 폴백 상태(broken)가 자연 초기화됨 → useEffect(setState) 불필요.
 */
function SlideBadge({
  category,
  locale,
}: {
  category: EmblemCategory;
  locale: EmblemLocale;
}) {
  const [broken, setBroken] = useState(false);
  return !broken ? (
    <Image
      src={badgeSrc(category)}
      alt=""
      fill
      sizes="(max-width: 640px) 56px, (max-width: 1024px) 80px, 96px"
      className="object-contain drop-shadow-[0_8px_22px_rgba(0,0,0,0.45)]"
      onError={() => setBroken(true)}
    />
  ) : (
    <Emblem
      category={category}
      size="L"
      locale={locale}
      className="h-full w-full drop-shadow-[0_8px_22px_rgba(0,0,0,0.45)]"
    />
  );
}

export default function HeroSlider({ locale }: { locale: string }) {
  const activeLocale: EmblemLocale = (
    LOCALES.includes(locale as EmblemLocale) ? locale : "ko"
  ) as EmblemLocale;
  const [index, setIndex] = useState(0);

  const goToNext = useCallback(
    () => setIndex((c) => (c + 1) % CATEGORIES.length),
    []
  );
  const goToPrev = useCallback(
    () => setIndex((c) => (c - 1 + CATEGORIES.length) % CATEGORIES.length),
    []
  );

  // 자동 순환 (index 변경 시 타이머 리셋)
  useEffect(() => {
    const timer = window.setTimeout(goToNext, SLIDE_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [index, goToNext]);

  const currentCat = CATEGORIES[index];
  const label = CATEGORY_LABEL[activeLocale][currentCat];
  const headline = HERO_HEADLINE[activeLocale](label);
  const desc = HERO_DESC[activeLocale][currentCat];
  const readMore = READ_MORE[activeLocale];

  return (
    <div className="relative overflow-hidden rounded-[28px] border border-white/70 bg-slate-950 text-white shadow-[0_22px_60px_rgba(16,32,58,0.16)] sm:rounded-[34px]">
      {/* Ken Burns CSS + prefers-reduced-motion 자동 대응 */}
      <style>{`
        @keyframes hero-slider-kb {
          0% { transform: scale(1); }
          100% { transform: scale(1.14); }
        }
        .hero-slider-kb {
          animation: hero-slider-kb 12s ease-out infinite alternate;
          will-change: transform;
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-slider-kb { animation: none !important; transform: none !important; }
        }
      `}</style>

      {/* 배경 슬라이드 6장 (opacity 크로스페이드) */}
      <div className="absolute inset-0">
        {CATEGORIES.map((cat, i) => (
          <div
            key={cat}
            className={`absolute inset-0 transition-opacity duration-700 ${
              i === index ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          >
            <div
              className="hero-slider-kb absolute inset-0"
              style={{ transformOrigin: KEN_BURNS_ORIGIN[cat] }}
            >
              <Image
                src={photoSrc(cat)}
                alt=""
                fill
                sizes="100vw"
                className="object-cover"
                priority={i === 0}
              />
            </div>
          </div>
        ))}
        {/*
          강화 스크림 (텍스트 대비 확보):
          1. 다이애그널 좌 강 → 우 약 (헤드라인 좌측 정렬 대비)
          2. 하단 강 → 상단 약 (하단 콘텐츠·프리뷰 대비)
        */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(100deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.45) 45%, rgba(0,0,0,0.15) 100%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.18) 55%, transparent 80%)",
          }}
        />
      </div>

      {/* 우상단 코너 배지 (헤드라인과 물리적 분리, 축소)
          key={currentCat} 로 카테고리 전환 시 컴포넌트 리마운트 → 폴백 상태 자연 초기화 */}
      <div className="pointer-events-none absolute right-5 top-5 z-20 sm:right-8 sm:top-8">
        <div className="relative aspect-square h-14 w-14 sm:h-20 sm:w-20 lg:h-24 lg:w-24">
          <SlideBadge key={currentCat} category={currentCat} locale={activeLocale} />
        </div>
      </div>

      {/* 콘텐츠 오버레이 (좌측 정렬, 여백 넉넉) */}
      <div className="relative flex min-h-[28rem] flex-col justify-end p-6 sm:min-h-[36rem] sm:p-10 lg:min-h-[42rem] lg:p-14">
        <div className="max-w-3xl">
          {/* 라벨 pill */}
          <div className="mb-5 inline-block rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-white/90 backdrop-blur">
            {label}
          </div>

          {/* 대형 헤드라인 (WHY 섹션 수준의 무게감) */}
          <h2 className="text-4xl font-black leading-[1.02] tracking-[-0.03em] text-white [text-wrap:balance] sm:text-6xl lg:text-7xl">
            {headline}
          </h2>

          {/* 서브 */}
          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/85 sm:mt-6 sm:text-lg">
            {desc}
          </p>

          {/* CTA */}
          <a
            href={anchorHref(currentCat)}
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-sm font-bold text-slate-950 shadow-[0_10px_28px_rgba(0,0,0,0.25)] transition hover:bg-white/95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:mt-8 sm:px-7 sm:py-3 sm:text-base"
          >
            {readMore}
          </a>
        </div>

        {/*
          하단 카테고리 프리뷰 (Time Out식):
          6개 가로 배치, 얇은 라인 + 카테고리명, 현재 강조.
          기존 도트 인디케이터 대체.
        */}
        <div className="mt-10 border-t border-white/15 pt-5 sm:mt-14">
          <div className="grid grid-cols-6 gap-2 sm:gap-4">
            {CATEGORIES.map((cat, i) => {
              const active = i === index;
              const catLabel = CATEGORY_LABEL[activeLocale][cat];
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={catLabel}
                  aria-current={active}
                  className="group/cat text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                >
                  <div
                    className={`h-0.5 w-full rounded-full transition-colors duration-300 ${
                      active
                        ? "bg-white"
                        : "bg-white/25 group-hover/cat:bg-white/55"
                    }`}
                  />
                  <div
                    className={`mt-2 truncate text-[10px] font-bold uppercase tracking-[0.14em] transition-colors duration-300 sm:text-[11px] ${
                      active
                        ? "text-white"
                        : "text-white/50 group-hover/cat:text-white/85"
                    }`}
                  >
                    {catLabel}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/*
        좌/우 화살표 — 우하단 코너 (배지·프리뷰와 안 겹치도록 위치 분리).
        pointer-events: 컨테이너 none, 버튼 auto.
      */}
      <div className="pointer-events-none absolute bottom-6 right-6 z-20 flex gap-2 sm:bottom-10 sm:right-10">
        <button
          type="button"
          onClick={goToPrev}
          aria-label={PREV_LABEL[activeLocale]}
          className="pointer-events-auto inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-black/30 text-white backdrop-blur transition hover:bg-black/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={goToNext}
          aria-label={NEXT_LABEL[activeLocale]}
          className="pointer-events-auto inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-black/30 text-white backdrop-blur transition hover:bg-black/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
