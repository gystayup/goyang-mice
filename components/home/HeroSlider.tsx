// components/home/HeroSlider.tsx
// 홈 최상단 Hero — 6 카테고리 순환 Ken Burns 슬라이더 (Time Out 폴리시).
//
// 슬라이드 6장: walk / food / culture / kculture / history / family
//   · 배경 사진 (public/images/hero/hero-<cat>.jpg — 순수 풍경, 카드용 통짜 배지 이미지와 분리)
//   · Ken Burns: scale 1 → 1.14, 12s ease-out infinite alternate
//     · transformOrigin 카테고리마다 다른 방향
//     · @media (prefers-reduced-motion: reduce) 시 애니메이션 자동 비활성
//
// 오버레이:
//   · 다중 스크림 — 좌 강→우 약 (다이애그널) + 하단 강 (텍스트 대비 확보)
//   · 좌측 정렬 수직 리듬:
//       (1) 상단 고정 슬로건 — 오더 #R2 브랜드 리프레시.
//           · 5로케일 (SLOGAN 상수), 골드 강조(var(--gold)) + 흰색 조합
//           · ko: "그냥 보는 여행이 아니라, 제대로 아는 여행"
//           · en: "Don't Just Visit Goyang. Know How to Experience It."
//       (2) 대형 영문 헤드라인 (카테고리별, text-4xl→7xl, font-black, tracking-tight)
//       (3) 한글 서브 (카테고리·로케일별, CuratedGridSection.CARD_DESC 와 문안 일관)
//       (4) CTA "자세히 보기 →" — 앵커 #story-<cat>
//   · 하단 카테고리 프리뷰 (Time Out식): 얇은 라인 + 카테고리명 6개(한글),
//     현재 슬라이드 강조 (강조색 #FF2D55 · 라인 두께↑ + glow), 나머지는 옅게 (white/50)
//   · 좌/우 화살표: 우하단 코너 (프리뷰와 안 겹침)
//   · 우상단 코너 배지 없음 (배경이 순수 풍경이라 텍스트만 깔끔 노출)
//
// 폰트: globals.css 의 --font-sans (SUIT Variable → Pretendard Variable → Noto Sans KR)
//       fallback stack 을 상속 — WHY 섹션과 동일 서체 라인 (일관성).
//
// 접근성: 카테고리 프리뷰 aria-current·aria-label, 화살표 aria-label 5로케일,
//         prefers-reduced-motion CSS 자동.
//
// 판매 소구어 0. i18n 키 구조 무접촉 (컴포넌트 내부 상수만 사용).

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

/** 카테고리 짧은 로케일 라벨 (하단 프리뷰 인디케이터 용). */
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

/** 상단 고정 슬로건 (5로케일). 오더 #R2 브랜드 리프레시.
 *  구조: {before} + {gold} — 골드 강조 부분은 var(--gold) 로 하이라이트. */
type SloganPart = { before: string; gold: string };
const SLOGAN: Record<EmblemLocale, SloganPart> = {
  ko: { before: "그냥 보는 여행이 아니라, ", gold: "제대로 아는 여행" },
  en: {
    before: "Don't Just Visit Goyang. ",
    gold: "Know How to Experience It.",
  },
  ja: { before: "ただ訪れるのではなく、", gold: "本当に知る旅" },
  "zh-CN": { before: "不只是走马观花，", gold: "而是懂得体验的旅程" },
  "zh-TW": { before: "不只是走馬看花，", gold: "而是懂得體驗的旅程" },
};

/** 대형 영문 헤드라인 (모든 로케일 공통, uppercase). */
const HEADLINE_EN: Record<EmblemCategory, string> = {
  walk: "BREATHE THE CITY",
  food: "EAT LIKE A LOCAL",
  culture: "FEEL THE STAGE",
  kculture: "FEEL THE K-WAVE",
  history: "WALK THROUGH HISTORY",
  family: "PLAY ALL DAY",
};

/** Hero 서브 문구 (5로케일 · 카테고리별). CuratedGridSection.CARD_DESC 문안 라인 일관.
 *  history/family: 서오릉·원마운트 먼저 언급, "고양일산" 브랜딩 통일. */
const HERO_DESC: Record<EmblemLocale, Record<EmblemCategory, string>> = {
  ko: {
    walk: "일산호수공원부터 정발산까지, 사계절 걷기 좋은 길",
    food: "일산 카페거리부터 백석 맛집까지, 놓치면 아쉬운 한 끼",
    culture: "아람누리·꽃누리에서 만나는 이번 시즌 공연·전시",
    kculture: "킨텍스에서 열리는 K-POP·팬 이벤트의 중심",
    history: "서오릉부터 행주산성까지, 걸으며 만나는 고양일산의 시간",
    family: "원마운트·스타필드, 아이와 하루가 짧은 곳",
  },
  en: {
    walk: "From Ilsan Lake Park to Jeongbalsan — trails made for every season.",
    food: "From Ilsan's cafe streets to Baekseok's kitchens — a meal worth the trip.",
    culture: "This season's stages and exhibitions at Aram Nuri and Kkot Nuri.",
    kculture: "KINTEX — the hub of K-POP concerts and fan events.",
    history: "From Seooreung to Haengju Fortress — Goyang-Ilsan's story, on foot.",
    family: "OneMount and Starfield — where a day with the kids is never long enough.",
  },
  ja: {
    walk: "一山湖水公園から鼎鉢山まで、四季を通じて歩きたい道。",
    food: "一山カフェ通りから白石の名店まで、逃したくない一食。",
    culture: "アラムヌリ・コッヌリで出会う、今シーズンの舞台と展示。",
    kculture: "KINTEXで開かれるK-POP・ファンイベントの中心地。",
    history: "西五陵から幸州山城まで、歩いて出会う高陽・一山の時間。",
    family: "OneMount・Starfield、子どもと過ごす一日が短い場所。",
  },
  "zh-CN": {
    walk: "从一山湖水公园到鼎钵山，四季皆宜的漫步路线。",
    food: "从一山咖啡街到白石名店，一顿不容错过的美味。",
    culture: "在阿蓝努里·花努里，遇见本季演出与展览。",
    kculture: "KINTEX——K-POP与粉丝活动的中心。",
    history: "从西五陵到幸州山城，步行走进高阳·一山的历史。",
    family: "OneMount·Starfield，与孩子共度的一天总嫌短。",
  },
  "zh-TW": {
    walk: "從一山湖水公園到鼎缽山，四季皆宜的漫步路線。",
    food: "從一山咖啡街到白石名店，一頓不容錯過的美味。",
    culture: "在阿藍努里·花努里，遇見本季演出與展覽。",
    kculture: "KINTEX——K-POP與粉絲活動的中心。",
    history: "從西五陵到幸州山城，步行走進高陽·一山的歷史。",
    family: "OneMount·Starfield，與孩子共度的一天總嫌短。",
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

  // 자동 순환 (index 변경 시 타이머 리셋)
  useEffect(() => {
    const timer = window.setTimeout(goToNext, SLIDE_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [index, goToNext]);

  const currentCat = CATEGORIES[index];
  const headlineEn = HEADLINE_EN[currentCat];
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

      {/* 콘텐츠 오버레이 (좌측 정렬, 여백 넉넉) */}
      <div className="relative flex min-h-[28rem] flex-col justify-end p-6 sm:min-h-[36rem] sm:p-10 lg:min-h-[42rem] lg:p-14">
        <div className="max-w-3xl">
          {/* (1) 상단 고정 슬로건 (오더 #R2) — 5로케일, 흰색 + 골드 강조 */}
          <div className="mb-5 max-w-2xl text-sm font-semibold leading-snug tracking-tight sm:mb-6 sm:text-base">
            <span className="text-white/85">{SLOGAN[activeLocale].before}</span>
            <span className="text-[var(--gold)]">{SLOGAN[activeLocale].gold}</span>
          </div>

          {/* (2) 대형 영문 헤드라인 (카테고리별) */}
          <h2 className="text-4xl font-black uppercase leading-[1.02] tracking-[-0.03em] text-white [text-wrap:balance] sm:text-6xl lg:text-7xl">
            {headlineEn}
          </h2>

          {/* (3) 한글/로케일별 서브 */}
          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/85 sm:mt-6 sm:text-lg">
            {desc}
          </p>

          {/* (4) CTA */}
          <a
            href={anchorHref(currentCat)}
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-sm font-bold text-slate-950 shadow-[0_10px_28px_rgba(0,0,0,0.25)] transition hover:bg-white/95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:mt-8 sm:px-7 sm:py-3 sm:text-base"
          >
            {readMore}
          </a>
        </div>

        {/*
          하단 카테고리 프리뷰 (Time Out식):
          6개 가로 배치, 얇은 라인 + 카테고리명(한글), 현재 강조.
          활성 슬라이드: 상단 라인 두께↑ + 카테고리명을 강조색(#FF2D55)으로.
          비활성: 흰색/반투명 유지.
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
                    className={`w-full rounded-full transition-all duration-300 ${
                      active
                        ? "h-[3px] bg-[#FF2D55] shadow-[0_0_12px_rgba(255,45,85,0.55)]"
                        : "h-0.5 bg-white/25 group-hover/cat:bg-white/55"
                    }`}
                  />
                  <div
                    className={`mt-2 truncate text-[10px] font-bold uppercase tracking-[0.14em] transition-colors duration-300 sm:text-[11px] ${
                      active
                        ? "text-[#FF2D55]"
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
        좌/우 화살표 — 우하단 코너 (프리뷰와 안 겹치도록 위치 분리).
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
