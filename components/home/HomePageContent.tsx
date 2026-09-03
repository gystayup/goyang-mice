// components/home/HomePageContent.tsx — 오더 #C14b 홈 개편 · #C26 마스코트 배너 삽입.
//
// 이전 (#P9·#A3): HeroSlider · EmblemEntry · WhatsOn · CuratedGrid · AccessHub
//                 · GettingHere · Social · MobileQuickActions
// #C14b:          HeroDiscover · MustSee · BestGridEntry(9) · DayTripsTeaser
//                 · WhatsOnCalendar · AccessHub · GettingHere · Social
//                 · MobileQuickActions
// #C26 (지금):    HeroDiscover · MustSee · MascotWelcomeBanner · BestGridEntry(9)
//                 · DayTripsTeaser · WhatsOnCalendar · AccessHub · GettingHere
//                 · Social · MobileQuickActions
//
// 무접촉:
//   · HeroSlider.tsx / EmblemEntrySection.tsx / WhatsOnSection.tsx /
//     CuratedGridSection.tsx — 파일 보존 (deprecated 주석만 추가). /best 인덱스
//     등 다른 소비처가 여전히 존재하므로 삭제하지 않는다.
//   · MustSee · BestGrid 등 기존 섹션 무터치 (렌더 순서에 신규 컴포넌트 1개만 삽입).

import HeroDiscoverSection from "@/components/home/HeroDiscoverSection";
import MustSeeSection from "@/components/home/MustSeeSection";
import MascotWelcomeBanner from "@/components/home/MascotWelcomeBanner";
import BestGridEntrySection from "@/components/home/BestGridEntrySection";
import DayTripsTeaserSection from "@/components/home/DayTripsTeaserSection";
import WhatsOnCalendarSection from "@/components/home/WhatsOnCalendarSection";
import AccessHubSection from "@/components/home/AccessHubSection";
import GettingAroundSection from "@/components/home/GettingAroundSection";
import GettingHereSection from "@/components/home/GettingHereSection";
import SocialSection from "@/components/home/SocialSection";
import MobileQuickActions from "@/components/home/MobileQuickActions";

export default function HomePageContent({ locale }: { locale: string }) {
  return (
    <>
      <HeroDiscoverSection locale={locale} />
      <MustSeeSection locale={locale} />
      <MascotWelcomeBanner locale={locale} />
      <BestGridEntrySection locale={locale} />
      <DayTripsTeaserSection locale={locale} />
      <WhatsOnCalendarSection locale={locale} />
      <AccessHubSection locale={locale} />
      <GettingAroundSection locale={locale} />
      <GettingHereSection locale={locale} />
      <SocialSection locale={locale} />
      <MobileQuickActions locale={locale} />
    </>
  );
}
