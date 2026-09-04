// components/home/HomePageContent.tsx — 오더 #C14b 홈 개편 · #C26 마스코트 배너 삽입 · #C50 async server.
//
// 이전 (#P9·#A3): HeroSlider · EmblemEntry · WhatsOn · CuratedGrid · AccessHub
//                 · GettingHere · Social · MobileQuickActions
// #C14b:          HeroDiscover · MustSee · BestGridEntry(9) · DayTripsTeaser
//                 · WhatsOnCalendar · AccessHub · GettingHere · Social
//                 · MobileQuickActions
// #C26:           HeroDiscover · MustSee · MascotWelcomeBanner · BestGridEntry(9)
//                 · DayTripsTeaser · WhatsOnCalendar · AccessHub · GettingHere
//                 · Social · MobileQuickActions
// #C50 (지금):    async 서버 컴포넌트 · WhatsOn 이벤트를 admin Supabase 등록분 포함해
//                 SSR fetch 후 <WhatsOnCalendarSection events={...}> 로 주입.
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
import { loadVisibleWhatsOnEvents } from "@/data/whats-on-events";

export default async function HomePageContent({ locale }: { locale: string }) {
  // 오더 #C50: admin Supabase 등록 티켓 + native 이벤트 결합 후 클라이언트에 주입.
  // DB 실패 시 loadAdminTicketEvents() 가 빈 배열 → native events (verified=true) 만.
  const whatsOnEvents = await loadVisibleWhatsOnEvents();

  return (
    <>
      <HeroDiscoverSection locale={locale} />
      <MustSeeSection locale={locale} />
      <MascotWelcomeBanner locale={locale} />
      <BestGridEntrySection locale={locale} />
      <DayTripsTeaserSection locale={locale} />
      <WhatsOnCalendarSection locale={locale} events={whatsOnEvents} />
      <AccessHubSection locale={locale} />
      <GettingAroundSection locale={locale} />
      <GettingHereSection locale={locale} />
      <SocialSection locale={locale} />
      <MobileQuickActions locale={locale} />
    </>
  );
}
