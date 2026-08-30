// 고양 BEST 카테고리 진입부 (Time Out 리뉴얼 3차 · Section B).
// Hero 아래, 큐레이션 그리드(Section C) 위. 6개 엠블럼 가로 배열.
// 각 엠블럼 클릭 시 해당 카테고리 상세 라우트 /best/{cat} 로 진입 (오더 #P1).

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
      {/* 엠블럼 하단 카테고리명 라벨 없음 — 엠블럼 리본이 이미 표시 */}
      <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-4 sm:gap-x-10">
        {CATEGORIES.map((cat) => (
          <li key={cat}>
            <Link
              href={CATEGORY_HREF[cat]}
              className="inline-block rounded-full transition duration-200 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950"
            >
              <Emblem category={cat} size="M" locale={activeLocale} />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
