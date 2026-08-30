// 홈 최종 구성 (오더 #P9 반영):
//   1. HeroSlider              (Ken Burns 6카테고리)
//   2. EmblemEntrySection      (엠블럼 6종 진입부)
//   3. WhatsOnSection          (WHAT'S ON · 공연·축제·전시 3분할 · 이달 이벤트)
//   4. CuratedGridSection      (고양일산 BEST · 홈 티저 3장 + 전체 보기 CTA)
//   5. AccessHubSection        (교통 접근성 인포그래픽)
//   6. AfterKintexBridgeSection (KINTEX 후 하루 서사 · 5스텝 타임라인)
//   7. SocialSection           (SNS)
//   ※ MobileQuickActions: 모바일 하단 고정 플로터 (오버레이 유지)
//
// 이동됨(연구소 페이지 하부로):
//   HeroSection ("고양일산에서 만나는 경험"), WhyGoyangSection,
//   ProductPreviewSection (MICE + Healthcare), ContactCtaSection, NewsSection.

import HeroSlider from "@/components/home/HeroSlider";
import EmblemEntrySection from "@/components/home/EmblemEntrySection";
import CuratedGridSection from "@/components/home/CuratedGridSection";
import WhatsOnSection from "@/components/home/WhatsOnSection";
import AccessHubSection from "@/components/home/AccessHubSection";
import AfterKintexBridgeSection from "@/components/home/AfterKintexBridgeSection";
import SocialSection from "@/components/home/SocialSection";
import MobileQuickActions from "@/components/home/MobileQuickActions";
import type { EmblemCategory } from "@/components/emblem/colors";

// 홈 티저용 3카테고리 (오더 #P1-f): 산책·미식·K컬처.
// 나머지 3장(문화·역사·가족)은 /best 인덱스에서 노출.
const HOME_TEASER_CATEGORIES: EmblemCategory[] = ["walk", "food", "kculture"];

export default function HomePageContent({ locale }: { locale: string }) {
  return (
    <>
      <section className="relative overflow-hidden pb-12 pt-4 sm:pb-16 sm:pt-6 lg:pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <HeroSlider locale={locale} />
        </div>
      </section>
      <EmblemEntrySection locale={locale} />
      <WhatsOnSection locale={locale} />
      <CuratedGridSection
        locale={locale}
        categories={HOME_TEASER_CATEGORIES}
        ctaHref="/best"
      />
      <AccessHubSection locale={locale} />
      <AfterKintexBridgeSection locale={locale} />
      <SocialSection locale={locale} />
      <MobileQuickActions locale={locale} />
    </>
  );
}
