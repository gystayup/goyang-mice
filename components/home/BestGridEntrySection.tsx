// components/home/BestGridEntrySection.tsx — 오더 #C14b 9카테고리 진입.
//
// 기존 EmblemEntrySection (6개 · 무접촉) 를 대체 · 신규 파일 신설.
// 9카테고리 전부 노출: walk / food / culture / kculture / history / family /
//                     shopping / stay / night (#B1 [1] 시점 확장분 반영)
//
// 렌더:
//   · 섹션 헤드라인 + 서브 (data/home-copy.ts)
//   · 데스크탑 3×3 그리드 / sm 3열 3행 / xs 2열
//   · 각 셀: <Emblem size="M" /> + 라벨 (CATEGORY_LABEL) + hover 확대
//   · 링크 /best/{cat}
//
// 규범:
//   · 판매·예약·"예약" 표현 0.
//   · CATEGORY_LABEL / CURATED_CATEGORIES 재사용 (data/curated-categories.ts).
//   · 5로케일 ko 폴백.

import { Emblem } from "@/components/emblem/Emblem";
import type { EmblemCategory, EmblemLocale } from "@/components/emblem/colors";
import {
  CATEGORY_LABEL,
  CURATED_CATEGORIES,
} from "@/data/curated-categories";
import { BEST_ENTRY, pickHomeLocale } from "@/data/home-copy";
import { Link } from "@/lib/navigation";

export default function BestGridEntrySection({ locale }: { locale: string }) {
  const active = pickHomeLocale(locale);
  const emblemLocale = active as EmblemLocale;

  return (
    <section className="bg-[#faf7f2]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
        <div className="text-[11px] font-bold uppercase tracking-[0.28em] text-[var(--gold,#D4AF37)]">
          {BEST_ENTRY.eyebrow}
        </div>
        <h2 className="mt-3 text-2xl font-black tracking-[-0.03em] text-[#232322] sm:text-3xl lg:text-4xl">
          {BEST_ENTRY.headline[active]}
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
          {BEST_ENTRY.subhead[active]}
        </p>

        <ul className="mt-10 grid grid-cols-3 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-9">
          {CURATED_CATEGORIES.map((cat: EmblemCategory) => {
            const label = CATEGORY_LABEL[active][cat];
            return (
              <li key={cat} className="flex flex-col items-center">
                <Link
                  href={`/best/${cat}`}
                  aria-label={label}
                  className="inline-block rounded-full transition duration-200 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold,#D4AF37)]"
                >
                  <Emblem
                    category={cat}
                    size="M"
                    locale={emblemLocale}
                    hideRibbon
                    className="h-20 w-20 sm:h-24 sm:w-24"
                  />
                </Link>
                <span className="mt-2.5 text-center text-xs font-bold text-[#232322] sm:text-sm">
                  {label}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
