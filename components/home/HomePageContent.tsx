// components/home/HomePageContent.tsx — 오더 #C14b · #C26 · #C50 · #C52 마스코트 히어로 이동.
//
// 진화:
// #C14b:          HeroDiscover · MustSee · BestGridEntry(9) · DayTripsTeaser
//                 · WhatsOnCalendar · AccessHub · GettingHere · Social · MobileQuickActions
// #C26:           MascotWelcomeBanner 를 MustSee ~ BestGridEntry 사이 삽입
// #C50:           async 서버 컴포넌트 · WhatsOn 이벤트 admin Supabase SSR fetch
// #C52 (지금):    MascotWelcomeBanner 섹션 제거 (홈 화면 하나 통째로 차지 · 우측 빈 공간 컸음).
//                 마스코트 이미지는 HeroDiscover 안 우측 상단에 작게 배치 (Hero 컴포넌트 내부 수정).
//                 MascotWelcomeBanner.tsx 파일 보존 (deprecated).
//
// 무접촉:
//   · HeroSlider.tsx / EmblemEntrySection.tsx / WhatsOnSection.tsx /
//     CuratedGridSection.tsx / MascotWelcomeBanner.tsx — 파일 보존.
//   · MustSee · BestGrid 등 기존 섹션 무터치.

import HeroDiscoverSection from "@/components/home/HeroDiscoverSection";
import MustSeeSection from "@/components/home/MustSeeSection";
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
