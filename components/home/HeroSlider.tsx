// components/home/HeroSlider.tsx
// 홈 최상단 Hero — 6 카테고리 순환 Ken Burns 슬라이더.
//
// 슬라이드 6장: walk / food / culture / kculture / history / family
//   · 배경 사진 (public/images/cards/card-<cat>.jpg)
//   · Ken Burns: scale 1 → 1.14, 12s ease-out infinite alternate
//     · transformOrigin 카테고리마다 다른 방향(좌상/우중/상중/우하/좌하/하중)
//     · @media (prefers-reduced-motion: reduce) 시 애니메이션 자동 비활성
//
// 오버레이:
//   · 하단 스크림 (linear-gradient 상단 투명 → 하단 rgba(0,0,0,0.72))
//   · 좌상 라벨 pill ({로케일 카테고리명}, 카테고리 컬러 화이트 톤)
//   · 헤드라인 "고양 BEST {카테고리}" (흰색 대형)
//   · 배지 (badge-<cat>.png) 헤드라인 오른쪽 (sm+ 만 표시, 모바일은 숨김)
//   · 서브 문구 1문장 (CuratedGridSection 카피 재사용, 5로케일)
//   · CTA "자세히 보기 →" — 앵커 #story-<cat> 로 이동 (CuratedGrid 카드로 스크롤)
//
// 컨트롤:
//   · 하단 도트 인디케이터 6개, 현재 슬라이드 강조 (w-8 vs w-2)
//   · 좌/우 화살표 버튼
//   · 자동 순환 6초 (수동 전환 시 시각 리셋 — useEffect deps 에 index)
//
// 성능·접근성:
//   · 첫 슬라이드(walk) 사진 priority, 나머지 lazy
//   · 배지는 현재 슬라이드용만 렌더 (조건부)
//   · 도트/화살표 aria-label, aria-current
//   · prefers-reduced-motion CSS 미디어로 자동 처리 (JS 감지 불필요)
//
// 판매 소구어 0 (안내 톤). i18n 키 구조 무접촉 (컴포넌트 내부 상수만 사용).

"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

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

/** 카테고리 짧은 로케일 라벨 (Hero 헤드라인·인디케이터·라벨 pill 용). */
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

/** "고양 BEST {카테고리}" 로케일 헤드라인 템플릿 (Hero용 짧은 버전, N선 없음). */
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

/** Ken Burns 방향 (카테고리마다 다른 transform-origin 으로 이동 방향 다양성 확보). */
const KEN_BURNS_ORIGIN: Record<EmblemCategory, string> = {
  walk: "left top",
  food: "right center",
  culture: "center top",
  kculture: "right bottom",
  history: "left bottom",
  family: "center bottom",
};

function photoSrc(cat: EmblemCategory) {
  return `/images/cards/card-${cat}.jpg`;
}
function badgeSrc(cat: EmblemCategory) {
  return `/images/badges/badge-${cat}.png`;
}
function anchorHref(cat: EmblemCategory) {
  return `#story-${cat}`;
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

  // 자동 순환 6초 (수동 전환 시 index 변경으로 타이머 리셋)
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
      {/* Ken Burns 애니메이션 CSS + prefers-reduced-motion 자동 대응 */}
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

      {/* 배경 슬라이드 6장 겹치기 (opacity 크로스페이드) */}
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
        {/* 하단 스크림 (헤드라인·서브 가독성 확보) */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,_rgba(0,0,0,0)_0%,_rgba(0,0,0,0.32)_55%,_rgba(0,0,0,0.72)_100%)]" />
      </div>

      {/* 콘텐츠 오버레이 */}
      <div className="relative flex min-h-[22rem] flex-col justify-end p-5 sm:min-h-[30rem] sm:p-7 lg:min-h-[38rem] lg:p-10">
        <div className="max-w-2xl">
          <div className="mb-3 inline-block rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-white/90 backdrop-blur">
            {label}
          </div>

          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-black leading-tight tracking-tight text-white [text-wrap:balance] sm:text-4xl lg:text-5xl lg:leading-[1.1]">
              {headline}
            </h2>
            {/* 배지: sm+ 만 표시 (모바일은 텍스트 공간 확보 위해 숨김) */}
            <div className="relative hidden aspect-square shrink-0 sm:block sm:h-20 sm:w-20 lg:h-28 lg:w-28">
              <Image
                src={badgeSrc(currentCat)}
                alt=""
                fill
                sizes="(max-width: 1024px) 80px, 112px"
                className="object-contain drop-shadow-[0_6px_18px_rgba(0,0,0,0.35)]"
              />
            </div>
          </div>

          <p className="mt-4 max-w-xl text-sm leading-7 text-white/85 sm:text-base">
            {desc}
          </p>

          <a
            href={anchorHref(currentCat)}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-bold text-slate-950 shadow-lg transition hover:bg-white/95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            {readMore}
          </a>
        </div>

        {/* 하단 컨트롤: 카테고리 인디케이터 + 좌/우 화살표 */}
        <div className="mt-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {CATEGORIES.map((cat, i) => (
              <button
                key={cat}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={CATEGORY_LABEL[activeLocale][cat]}
                aria-current={i === index}
                className={`transition-all duration-300 rounded-full ${
                  i === index
                    ? "h-2 w-8 bg-white"
                    : "h-2 w-2 bg-white/40 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={goToPrev}
              aria-label={PREV_LABEL[activeLocale]}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={goToNext}
              aria-label={NEXT_LABEL[activeLocale]}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
