import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "연구 분야",
  description:
    "고양의 K-컬처, 관광, MICE, 라이프스타일 전략을 설계하는 핵심 연구 트랙과 아카이브 자료를 확인하세요.",
  alternates: {
    canonical: "/ko/research",
  },
};

export default function ResearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
