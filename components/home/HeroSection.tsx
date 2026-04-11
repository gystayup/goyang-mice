
import { BookOpen, MapPin, Sparkles } from "lucide-react";

import HeroMediaCarousel from "@/components/home/HeroMediaCarousel";
import ExpandableStats from "@/components/home/ExpandableStats";

type LocaleCopy = {
  badgeEyebrow: string;
  badgeTitle: string;
  cards: Array<{ eyebrow: string; title: string; desc: string; tone: string; iconTone: string; icon: typeof BookOpen }>;
  stats: Array<{ value: string; label: string; tone: string }>;
};

const heroCopy: Record<"ko" | "en", LocaleCopy> = {
  ko: {
    badgeEyebrow: "고양 방문경험 연구·연계 플랫폼",
    badgeTitle: "고양 방문경험 연구·연계 플랫폼",
    cards: [
      {
        eyebrow: "Research",
        title: "고양특례시 문화·관광·마이스 전략 연구",
        desc: "도시 자산 분석과 방문객 여정 설계를 기반으로 실행 가능한 기획 구조를 만듭니다.",
        tone: "bg-[#fff4da]",
        iconTone: "bg-[#ffe8a0] text-[#9b7a00]",
        icon: BookOpen,
      },
      {
        eyebrow: "DMC",
        title: "현장을 움직이는 로컬 운영 서비스",
        desc: "공연, 전시, VIP, 단체 방문객을 위한 일정 설계와 현장 대응을 통합 지원합니다.",
        tone: "bg-[#e8fbf3]",
        iconTone: "bg-[#b7f0d8] text-[#0a6b48]",
        icon: MapPin,
      },
      {
        eyebrow: "Experience",
        title: "머무르고 이어지는 체류 경험",
        desc: "카페, 미식, 로컬 체험, 쇼핑 동선을 연결해 고양만의 라이프스타일 경험을 확장합니다.",
        tone: "bg-[#ffe7df]",
        iconTone: "bg-[#ffd0c0] text-[#9b3a1a]",
        icon: Sparkles,
      },
    ],
    stats: [
      { value: "K-POP · KINTEX",    label: "공연, 전시, 비즈니스 방문이 이어지는 핵심 거점",            tone: "bg-[#fff7df]" },
      { value: "5축 연결",           label: "공연, 전시, 관광, 숙박, 쇼핑·미식을 하나의 흐름으로 연결", tone: "bg-[#eff9f4]" },
      { value: "운영형 DMC",         label: "기획부터 예약, 현장 운영까지 이어지는 실행 구조",            tone: "bg-[#eef3ff]" },
      { value: "라이프스타일 확장",  label: "가족 체험과 상시 운영 콘텐츠로 체류 프로그램을 확대",       tone: "bg-[#fff0ea]" },
    ],
  },
  en: {
    badgeEyebrow: "Goyang Visit Experience Platform",
    badgeTitle: "Goyang Visit Experience Research & Connection Platform",
    cards: [
      {
        eyebrow: "Research",
        title: "Strategic research for culture, tourism and MICE",
        desc: "We build practical strategies based on city assets and visitor journey design.",
        tone: "bg-[#fff4da]",
        iconTone: "bg-[#ffe8a0] text-[#9b7a00]",
        icon: BookOpen,
      },
      {
        eyebrow: "DMC",
        title: "Local operations that keep experiences moving",
        desc: "We support schedules, logistics and on-site coordination for events, buyers, VIPs and groups.",
        tone: "bg-[#e8fbf3]",
        iconTone: "bg-[#b7f0d8] text-[#0a6b48]",
        icon: MapPin,
      },
      {
        eyebrow: "Experience",
        title: "Lifestyle journeys that extend the stay",
        desc: "We expand visits through dining, cafés, shopping and local lifestyle experiences.",
        tone: "bg-[#ffe7df]",
        iconTone: "bg-[#ffd0c0] text-[#9b3a1a]",
        icon: Sparkles,
      },
    ],
    stats: [
      { value: "K-POP · KINTEX",       label: "A key hub for performances, exhibitions and business visits",           tone: "bg-[#fff7df]" },
      { value: "5 connected layers",    label: "Performance, exhibition, tourism, stay and dining in one flow",        tone: "bg-[#eff9f4]" },
      { value: "Operations-first DMC",  label: "A practical structure from planning and booking to field delivery",    tone: "bg-[#eef3ff]" },
      { value: "Lifestyle expansion",   label: "Family-friendly programs and repeatable content that lengthen stays",  tone: "bg-[#fff0ea]" },
    ],
  },
};

export default async function HeroSection({ locale }: { locale: string }) {
  const copy = heroCopy[locale === "en" ? "en" : "ko"];

  return (
    <section className="relative overflow-hidden pb-12 pt-4 sm:pb-16 sm:pt-6 lg:pb-20">
      {/* 배경 블러 장식 */}
      <div className="absolute left-[-7rem] top-10 h-48 w-48 rounded-full bg-[#ffe0d6] blur-3xl" />
      <div className="absolute right-[-5rem] top-24 h-56 w-56 rounded-full bg-[#dff9ef] blur-3xl" />

      {/* 캐러셀 */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <HeroMediaCarousel />
      </div>

      {/* 콘텐츠 카드 영역 */}
      <div className="mx-auto mt-8 max-w-7xl px-4 sm:mt-10 sm:px-6 lg:mt-12">
        <div className="rounded-[30px] border border-white/70 bg-white/86 p-5 shadow-[0_18px_50px_rgba(16,32,58,0.08)] backdrop-blur sm:rounded-[34px] sm:p-6 lg:p-8">

          {/* ── 플랫폼 타이틀 배너 ── */}
          <div className="relative overflow-hidden rounded-[22px] bg-[linear-gradient(135deg,_#10203a_0%,_#1e3a6e_45%,_#2d5a8e_100%)] px-6 py-7 sm:px-8 sm:py-8 lg:px-10 lg:py-9">
            {/* 장식 원 */}
            <div className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full bg-white/5" />
            <div className="pointer-events-none absolute -bottom-8 right-24 h-32 w-32 rounded-full bg-[#8df0cf]/10" />
            <div className="pointer-events-none absolute bottom-4 left-1/2 h-20 w-20 -translate-x-1/2 rounded-full bg-[#ffe98b]/8" />

            {/* 뱃지 */}
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-[#8df0cf]" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/80">
                {copy.badgeEyebrow}
              </span>
            </div>

            {/* 메인 타이틀 */}
            <h2 className="mt-4 text-[1.5rem] font-black leading-[1.2] tracking-[-0.03em] text-white [text-wrap:balance] sm:text-[1.9rem] lg:text-[2.4rem] lg:leading-[1.15]">
              {copy.badgeTitle}
            </h2>

            {/* 하단 장식 라인 */}
            <div className="mt-6 h-px w-full bg-gradient-to-r from-[#8df0cf]/40 via-[#ffe98b]/30 to-transparent" />
          </div>

          {/* ── 카드 3개 ── */}
          <div className="mt-4 grid gap-3 sm:gap-4 lg:grid-cols-3">
            {copy.cards.map((card) => {
              const Icon = card.icon;
              return (
                <article
                  key={card.title}
                  className={`group rounded-[22px] border border-white/70 p-5 shadow-[0_8px_24px_rgba(16,32,58,0.05)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_32px_rgba(16,32,58,0.09)] sm:p-6 ${card.tone}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${card.iconTone}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="inline-flex rounded-full border border-slate-200/60 bg-white/60 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                      {card.eyebrow}
                    </span>
                  </div>
                  <h3 className="mt-4 text-lg font-black leading-[1.25] tracking-[-0.03em] text-slate-950 sm:text-xl">
                    {card.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-7 text-slate-600 sm:text-[15px]">{card.desc}</p>
                </article>
              );
            })}
          </div>

          {/* ── 통계 4개 접기/펼치기 ── */}
          <ExpandableStats stats={copy.stats} locale={locale} />
        </div>
      </div>
    </section>
  );
}
