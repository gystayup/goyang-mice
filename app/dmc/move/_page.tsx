// /[locale]/dmc/move — GOYANG MOVE 상세 (오더 #A4).
//
// 서버 컴포넌트에서 헤더·데이터를 렌더하고, 탭 스위처는 클라이언트 컴포넌트
// (MoveTabs) 로 분리. URL 쿼리 ?from={key} 로 홈 GETTING HERE 진입 지원.

import type { Metadata } from "next";
import { Suspense } from "react";

import { MoveTabs } from "@/components/dmc/MoveTabs";
import Shell from "@/components/layout/Shell";
import {
  dmcMoveData,
  MOVE_LOCALES,
  type MoveLocale,
} from "@/data/dmc-move";

export type PageLocale = MoveLocale;

function toPageLocale(v: string): PageLocale {
  return (MOVE_LOCALES as string[]).includes(v) ? (v as PageLocale) : "ko";
}

export function getMoveMetadata(locale: PageLocale): Metadata {
  const { title, lead } = dmcMoveData.header;
  return {
    title: title[locale],
    description: lead[locale],
    alternates: {
      canonical: `/${locale}/dmc/move`,
    },
  };
}

export default function DmcMovePage({
  locale = "ko",
}: {
  locale?: PageLocale;
}) {
  const active = toPageLocale(locale);
  const { header, tabs } = dmcMoveData;

  return (
    <Shell>
      <article className="bg-white text-[#232322]">
        {/* 페이지 헤더 */}
        <section className="mx-auto max-w-4xl px-6 py-16 sm:py-20">
          <div className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#D4AF37]">
            {header.eyebrow}
          </div>
          <h1 className="mt-4 text-3xl font-black leading-tight tracking-[-0.03em] sm:text-5xl">
            {header.title[active]}
          </h1>
          <p className="mt-6 text-base leading-relaxed text-[#232322]/85 sm:text-lg">
            {header.lead[active]}
          </p>
        </section>

        {/* 탭 스위처 (클라이언트) — useSearchParams 는 Suspense 안이어야 SSG 통과. */}
        <section className="mx-auto max-w-4xl px-6 pb-24">
          <Suspense fallback={null}>
            <MoveTabs tabs={tabs} locale={active} />
          </Suspense>
        </section>
      </article>
    </Shell>
  );
}
