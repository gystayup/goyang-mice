import type { Metadata } from "next";

import HomePageContent from "@/components/home/HomePageContent";
import Shell from "@/components/layout/Shell";

export const metadata: Metadata = {
  title: "고양특례시 K-컬처플랫폼",
  description:
    "고양의 문화, 관광, 마이스, 라이프스타일 경험을 연결하는 고양특례시 K-컬처플랫폼 홈페이지입니다.",
  alternates: {
    canonical: "/ko",
  },
};

export default function HomePage() {
  return (
    <Shell>
      <HomePageContent />
    </Shell>
  );
}
