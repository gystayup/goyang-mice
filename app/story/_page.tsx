// app/story/_page.tsx — 오더 #C83 [1]-B.
// "나의 고양 스토리 (베타)" 테스트 페이지. Shell 안에 StoryClient 배치.
// 홈 네비에 링크 추가 없음 (오더 [2] 준수 · 직접 URL 접근으로 검증).

import type { Metadata } from "next";

import Shell from "@/components/layout/Shell";
import StoryClient from "@/components/story/StoryClient";

export type PageLocale = "ko" | "en" | "ja" | "zh-CN" | "zh-TW";

export function getStoryMetadata(locale: PageLocale): Metadata {
  return {
    title: "나의 고양 스토리 (베타)",
    description:
      "고양에서 찍은 사진을 스케치 화풍으로 변환해 보는 베타 기능입니다.",
    alternates: {
      canonical: `/${locale}/story`,
    },
    robots: { index: false, follow: false },
  };
}

export const metadata = getStoryMetadata("ko");

export default function StoryPage({ locale = "ko" }: { locale?: PageLocale }) {
  return (
    <Shell>
      <StoryClient locale={locale} />
    </Shell>
  );
}
