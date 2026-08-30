// 고양 BEST 카테고리 진입부 (Time Out 리뉴얼 3차 · Section B).
// Hero 아래, 큐레이션 그리드(Section C) 위. 6개 엠블럼 가로 배열.
// 각 엠블럼 클릭 시 해당 카테고리 상세 라우트 /best/{cat} 로 진입 (오더 #P1).
//
// 오더 #A2 [1][2]: 원 안 리본 카테고리 텍스트를 원 밖으로 이동.
//   · Emblem 에 hideRibbon 전달 → 원 안 리본 미렌더
//   · 엠블럼 아래 카테고리명 라벨(5로케일) 추가
//   · 라벨 값은 오더 표대로 정의 (기존 CATEGORY_LABEL 과 일부 차이 有 → 재사용 불가)

import { Emblem } from "@/components/emblem/Emblem";
import type {
  EmblemCategory,
  EmblemLocale,
} from "@/components/emblem/colors";
import { Link } from "@/lib/navigation";

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

const HEADLINE: Record<LocaleKey, string> = {
  ko: "고양일산, 무엇부터 볼까",
  en: "Where to start in Goyang-Ilsan",
  ja: "高陽・一山、何から見る？",
  "zh-CN": "高阳·一山，从哪里开始",
  "zh-TW": "高陽·一山，從哪裡開始",
};

/**
 * 엠블럼 외부 라벨 (오더 #A2 [1] 표 그대로).
 * data/curated-categories.ts 의 CATEGORY_LABEL 과는 일부 로케일에서 값이 달라
 * (예: en walk "Nature" vs "Walks", ja food "グルメ" vs "美食") 재사용 대신
 * 별도 정의. 임의 수정 금지.
 */
const ENTRY_LABEL: Record<LocaleKey, Record<EmblemCategory, string>> = {
  ko: {
    walk: "산책",
    food: "미식",
    culture: "문화",
    kculture: "K컬처",
    history: "역사",
    family: "가족",
  },
  en: {
    walk: "Nature",
    food: "Food",
    culture: "Culture",
    kculture: "K-Culture",
    history: "History",
    family: "Family",
  },
  ja: {
    walk: "散策",
    food: "グルメ",
    culture: "文化",
    kculture: "K-カルチャー",
    history: "歴史",
    family: "ファミリー",
  },
  "zh-CN": {
    walk: "漫步",
    food: "美食",
    culture: "文化",
    kculture: "K文化",
    history: "历史",
    family: "家庭",
  },
  "zh-TW": {
    walk: "漫步",
    food: "美食",
    culture: "文化",
    kculture: "K文化",
    history: "歷史",
    family: "家庭",
  },
};

// 카테고리별 상세 라우트 (오더 #P1). 로케일 prefix 는 next-intl Link 가 자동 처리.
const CATEGORY_HREF: Record<EmblemCategory, string> = {
  walk: "/best/walk",
  food: "/best/food",
  culture: "/best/culture",
  kculture: "/best/kculture",
  history: "/best/history",
  family: "/best/family",
};

export default function EmblemEntrySection({ locale }: { locale: string }) {
  const activeLocale: LocaleKey = (
    LOCALES.includes(locale as LocaleKey) ? locale : "ko"
  ) as LocaleKey;
  const headline = HEADLINE[activeLocale];

  return (
    <section className="mx-auto max-w-7xl px-4 pt-14 sm:px-6 sm:pt-18">
      <h2 className="text-center text-2xl font-black tracking-[-0.03em] text-slate-950 sm:text-3xl">
        {headline}
      </h2>
      {/* 오더 #A2 [3]: 6개 가로 정렬(모바일 3열 2행) — 3-of-6 grid.
          라벨은 엠블럼과 mt-2.5 (10px) 간격, 색 #232322, 중앙 정렬. */}
      <ul className="mt-8 grid grid-cols-3 justify-items-center gap-x-4 gap-y-6 sm:flex sm:flex-wrap sm:justify-center sm:gap-x-10 sm:gap-y-4">
        {CATEGORIES.map((cat) => (
          <li key={cat} className="flex flex-col items-center">
            <Link
              href={CATEGORY_HREF[cat]}
              className="inline-block rounded-full transition duration-200 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950"
            >
              <Emblem
                category={cat}
                size="M"
                locale={activeLocale}
                hideRibbon
              />
            </Link>
            <span className="mt-2.5 text-center text-sm font-bold tracking-[-0.01em] text-[#232322]">
              {ENTRY_LABEL[activeLocale][cat]}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
