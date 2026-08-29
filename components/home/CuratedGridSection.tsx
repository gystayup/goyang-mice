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
//   · 헤드라인 "고양 BEST {카테고리} 10선" (slate-950, black)
//   · 설명 1문장 (카테고리·로케일별, slate-600, 2줄 제한)
//   · "자세히 보기 →" (slate-500, group-hover 시 slate-950)
//
// 접근성: 카드 <a aria-label={{레이블} — {헤드라인}}> — 스크린리더 대응.
// 판매 소구어 0 (안내 톤만).
//
// 그리드: 3열/2열/1열 (6장 = 3×2). 카드 링크는 앵커 플레이스홀더 (TODO routing).

"use client";

import Image from "next/image";
import { useState } from "react";

import {
  EMBLEM_COLORS,
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

/** 카테고리 짧은 로케일 라벨 (하단 텍스트 블록 헤드라인·태그용). */
const CATEGORY_LABEL: Record<LocaleKey, Record<EmblemCategory, string>> = {
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

/** 카테고리 영문 태그 (모든 로케일 공통, 라벨 뒤 " · TAG" 형태로 붙음). */
const CATEGORY_TAG: Record<EmblemCategory, string> = {
  walk: "NATURE",
  food: "FOOD",
  culture: "CULTURE",
  kculture: "K-CULTURE",
  history: "HISTORY",
  family: "FAMILY",
};

/** "고양 BEST {카테고리} N선" 로케일 헤드라인 템플릿. */
const HEADLINE: Record<LocaleKey, (label: string, n: number) => string> = {
  ko: (l, n) => `고양 BEST ${l} ${n}선`,
  en: (l, n) => `Goyang's ${n} Best ${l}`,
  ja: (l, n) => `高陽ベスト${l}${n}選`,
  "zh-CN": (l, n) => `高阳${l}BEST ${n}选`,
  "zh-TW": (l, n) => `高陽${l}BEST ${n}選`,
};

// TODO(content): 큐레이션 데이터 확정 시 서버/CMS 이관.
const CARD_COUNT: Record<EmblemCategory, number> = {
  walk: 10,
  food: 10,
  culture: 10,
  kculture: 10,
  history: 10,
  family: 10,
};

/** 카드 설명 1문장 (카테고리·로케일별). 판매 소구어 0 — 안내 톤만. */
const CARD_DESC: Record<LocaleKey, Record<EmblemCategory, string>> = {
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

/** "자세히 보기" 링크 문구 (로케일별). */
const READ_MORE: Record<LocaleKey, string> = {
  ko: "자세히 보기 →",
  en: "Read more →",
  ja: "詳しく見る →",
  "zh-CN": "查看详情 →",
  "zh-TW": "查看詳情 →",
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

// 통짜 카드 이미지 파일: public/images/cards/card-<category>.jpg
// (배지·타이틀이 이미지 안에 포함된 완성본)
function photoSrc(cat: EmblemCategory): string {
  return `/images/cards/card-${cat}.jpg`;
}

// 상위 3장(walk/food/culture)은 above-the-fold LCP 후보 → 배경 사진 priority
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
  const label = CATEGORY_LABEL[locale][category];
  const tag = CATEGORY_TAG[category];
  const headline = HEADLINE[locale](label, CARD_COUNT[category]);
  const description = CARD_DESC[locale][category];
  const readMore = READ_MORE[locale];
  // 통짜 카드 이미지 폴백: 부재/실패 시 카테고리 gradient
  const [photoBroken, setPhotoBroken] = useState(false);

  return (
    <a
      id={`story-${category}`}
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
    </a>
  );
}
