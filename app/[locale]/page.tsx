import type { Metadata } from "next";

import HomePageContent from "@/components/home/HomePageContent";
import Shell from "@/components/layout/Shell";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  if (locale === "en") {
    return {
      title: "Goyang Special City GOYANG DMC",
      description:
        "A platform connecting K-culture, tourism, MICE and local lifestyle experiences in Goyang.",
      alternates: {
        canonical: "/en",
      },
    };
  }

  return {
    title: "고양특례시 GOYANG DMC",
    description:
      "고양의 문화, 관광, 마이스, 라이프스타일 경험을 연결하는 고양특례시 GOYANG DMC 홈페이지입니다.",
    alternates: {
      canonical: "/ko",
    },
  };
}

export default async function LocaleHomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <Shell>
      <HomePageContent locale={locale} />
    </Shell>
  );
}
