// 홈 최종 구성 (refactor/home-lab-split + feat/access-hub-section):
//   1. HeroSlider (Ken Burns 6카테고리)
//   2. EmblemEntrySection (엠블럼 6종 진입부)
//   3. CuratedGridSection (이번 주 고양일산 BEST — 통짜 배지 카드 6장)
//   4. AccessHubSection (교통 접근성 인포그래픽)
//   5. SocialSection (SNS)
//   ※ MobileQuickActions: 모바일 하단 고정 플로터 (오버레이 유지)
//
// 이동됨(연구소 페이지 하부로):
//   HeroSection ("고양일산에서 만나는 경험"), WhyGoyangSection,
//   ProductPreviewSection (MICE + Healthcare), ContactCtaSection, NewsSection.
//
// 브릿지·전시 행은 후속 오더 (자리만 비워둠).

import HeroSlider from "@/components/home/HeroSlider";
import EmblemEntrySection from "@/components/home/EmblemEntrySection";
import CuratedGridSection from "@/components/home/CuratedGridSection";
import AccessHubSection from "@/components/home/AccessHubSection";
import SocialSection from "@/components/home/SocialSection";
import MobileQuickActions from "@/components/home/MobileQuickActions";

export default function HomePageContent({ locale }: { locale: string }) {
  return (
    <>
      <section className="relative overflow-hidden pb-12 pt-4 sm:pb-16 sm:pt-6 lg:pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <HeroSlider locale={locale} />
        </div>
      </section>
      <EmblemEntrySection locale={locale} />
      <CuratedGridSection locale={locale} />
      <AccessHubSection locale={locale} />
      <SocialSection locale={locale} />
      <MobileQuickActions locale={locale} />
    </>
  );
}
