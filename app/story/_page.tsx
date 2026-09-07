// app/story/_page.tsx — 오더 #D05 [1]-B.
// GOYANG STORY 매장 스토리 카드 (9/9 포럼 시연용).
// Shell 안에 StoryClient 배치. useSearchParams 사용 위해 Suspense 로 감쌈.

import { Suspense } from "react";
import type { Metadata } from "next";

import Shell from "@/components/layout/Shell";
import StoryClient from "@/components/story/StoryClient";

export type PageLocale = "ko" | "en" | "ja" | "zh-CN" | "zh-TW";

export function getStoryMetadata(locale: PageLocale): Metadata {
  return {
    title: "GOYANG STORY (베타)",
    description:
      "고양 매장에서 찍은 사진 한 장으로 AI 스토리 카드를 만들어 봅니다.",
    alternates: {
      canonical: `/${locale}/story`,
    },
    robots: { index: false, follow: false },
  };
}

export const metadata = getStoryMetadata("ko");

export default function StoryPage(_props: { locale?: PageLocale }) {
  return (
    <Shell>
      <Suspense fallback={null}>
        <StoryClient />
      </Suspense>
    </Shell>
  );
}
