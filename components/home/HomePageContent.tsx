import HeroSection from "@/components/home/HeroSection";
import EmblemEntrySection from "@/components/home/EmblemEntrySection";
import CuratedGridSection from "@/components/home/CuratedGridSection";
import WhyGoyangSection from "@/components/home/WhyGoyangSection";
import ProductPreviewSection from "@/components/home/ProductPreviewSection";
import NewsSection from "@/components/home/NewsSection";
import SocialSection from "@/components/home/SocialSection";
import ContactCtaSection from "@/components/home/ContactCtaSection";
import MobileQuickActions from "@/components/home/MobileQuickActions";

export default function HomePageContent({ locale }: { locale: string }) {
  return (
    <>
      <HeroSection locale={locale} />
      {/* Hero 아래 · 기존 5카드 위: 고양 BEST 카테고리 진입부 (엠블럼 5종 가로) */}
      <EmblemEntrySection locale={locale} />
      {/* 기존 파스텔 5카드 영역을 대체: Time Out 식 컬러풀 큐레이션 그리드 */}
      <CuratedGridSection locale={locale} />
      <WhyGoyangSection locale={locale} />
      <ProductPreviewSection locale={locale} />
      <NewsSection locale={locale} />
      <SocialSection locale={locale} />
      <ContactCtaSection locale={locale} />
      <MobileQuickActions locale={locale} />
    </>
  );
}
