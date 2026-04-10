import type { Metadata } from "next";

import HomePageContent from "@/components/home/HomePageContent";
import Shell from "@/components/layout/Shell";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  if (locale === "en") {
    return {
      title: "Goyang Special City K-Culture Platform",
      description:
        "A platform connecting K-culture, tourism, MICE and local lifestyle experiences in Goyang.",
      alternates: {
        canonical: "/en",
      },
    };
  }

  return {
    title: "고양특례시 K-컬처플랫폼",
    description:
      "고양의 문화, 관광, 마이스, 라이프스타일 경험을 연결하는 고양특례시 K-컬처플랫폼 홈페이지입니다.",
    alternates: {
      canonical: "/ko",
    },
  };
}

export default function LocaleHomePage() {
  return (
    <Shell>
      <HomePageContent />
    </Shell>
  );
}
