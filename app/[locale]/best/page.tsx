// /[locale]/best — 고양 BEST 인덱스 (오더 #P1).
//
// 방문객 진입 상단 네비의 "/best" 목적지.
// 홈의 기존 CuratedGridSection(6카드) 를 그대로 재사용해 6카테고리를 나열한다.
// 신규 카피·히어로·필터 추가 금지 (오더 #P1 조건).
//   · 카드 제목/설명 SSOT: data/curated-categories.ts (무변경)
//   · 카드 링크 목적지:      /best/{category} (CuratedGridSection 내부 STORY_HREF)

import type { Metadata } from "next";

import CuratedGridSection from "@/components/home/CuratedGridSection";
import Shell from "@/components/layout/Shell";
import { navigationLabels, type LocaleKey } from "@/data/navigation";

const SUPPORTED: LocaleKey[] = ["ko", "en", "ja", "zh-CN", "zh-TW"];

function toLocale(locale: string): LocaleKey {
  return SUPPORTED.includes(locale as LocaleKey)
    ? (locale as LocaleKey)
    : "ko";
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const active = toLocale(locale);
  return {
    title: navigationLabels[active].best,
    alternates: {
      canonical: `/${active}/best`,
    },
  };
}

export default async function LocaleBestIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const active = toLocale(locale);
  return (
    <Shell>
      <CuratedGridSection locale={active} />
    </Shell>
  );
}
