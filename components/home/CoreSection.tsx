import {
  ArrowRight,
  Building2,
  Compass,
  FileSearch,
  Mail,
  ShoppingBag,
} from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import { Link } from "@/lib/navigation";

type QuickCard = {
  tag: string;
  title: string;
  desc: string;
  point: string;
  href: string;
  gradientFrom: string;
  gradientTo: string;
  chip: string;
  iconBg: string;
  iconColor: string;
  glowColor: string;
  icon: typeof Building2;
};

const cardSets: Record<"ko" | "en", QuickCard[]> = {
  ko: [
    {
      tag: "About",
      title: "연구소 소개",
      desc: "플랫폼의 비전과 운영 방향, 협업 구조를 한눈에 확인할 수 있습니다.",
      point: "브랜드 소개와 운영 철학",
      href: "/about",
      gradientFrom: "#fffbee",
      gradientTo: "#fff4da",
      chip: "bg-[#fff0c9] text-[#9b6400]",
      iconBg: "bg-[#fff0c9]",
      iconColor: "text-[#9b6400]",
      glowColor: "rgba(255,233,139,0.5)",
      icon: Building2,
    },
    {
      tag: "Research",
      title: "연구 분야",
      desc: "고양의 문화, 관광, 마이스, 라이프스타일 전략을 만드는 핵심 연구 트랙을 살펴보세요.",
      point: "핵심 트랙과 연구 아카이브",
      href: "/research",
      gradientFrom: "#f0fdf8",
      gradientTo: "#e8fbf3",
      chip: "bg-[#dff7ee] text-[#0d7b58]",
      iconBg: "bg-[#b7f0d8]",
      iconColor: "text-[#0a6b48]",
      glowColor: "rgba(141,240,207,0.5)",
      icon: FileSearch,
    },
    {
      tag: "DMC",
      title: "DMC 서비스",
      desc: "행사 운영과 로컬 경험을 연결하는 DMC 서비스 구조를 바로 확인할 수 있습니다.",
      point: "현장 운영과 로컬 연결",
      href: "/dmc",
      gradientFrom: "#f0f4ff",
      gradientTo: "#eef2ff",
      chip: "bg-[#e1e8ff] text-[#3655a6]",
      iconBg: "bg-[#d4ddff]",
      iconColor: "text-[#3655a6]",
      glowColor: "rgba(100,130,255,0.4)",
      icon: Compass,
    },
    {
      tag: "Booking",
      title: "서비스 예약",
      desc: "여행상품, 숙박, 음식점, 티켓, 공항픽업까지 필요한 예약을 빠르게 찾을 수 있습니다.",
      point: "예약 카테고리와 흐름",
      href: "/products",
      gradientFrom: "#fff6f2",
      gradientTo: "#ffe7df",
      chip: "bg-[#ffd9cd] text-[#a34d36]",
      iconBg: "bg-[#ffd0c0]",
      iconColor: "text-[#9b3a1a]",
      glowColor: "rgba(255,143,126,0.5)",
      icon: ShoppingBag,
    },
    {
      tag: "Contact",
      title: "문의하기",
      desc: "협력 제안과 구축 상담, 맞춤형 운영 문의를 한 곳에서 남길 수 있습니다.",
      point: "상담 접수와 제안",
      href: "/contact",
      gradientFrom: "#f9f5ff",
      gradientTo: "#f2ecff",
      chip: "bg-[#efe4ff] text-[#7b55b3]",
      iconBg: "bg-[#e0cfff]",
      iconColor: "text-[#6b3dbf]",
      glowColor: "rgba(160,100,255,0.4)",
      icon: Mail,
    },
  ],
  en: [
    {
      tag: "About",
      title: "About the institute",
      desc: "See the platform vision, direction and collaboration structure at a glance.",
      point: "Brand story and philosophy",
      href: "/about",
      gradientFrom: "#fffbee",
      gradientTo: "#fff4da",
      chip: "bg-[#fff0c9] text-[#9b6400]",
      iconBg: "bg-[#fff0c9]",
      iconColor: "text-[#9b6400]",
      glowColor: "rgba(255,233,139,0.5)",
      icon: Building2,
    },
    {
      tag: "Research",
      title: "Research",
      desc: "Explore the strategy tracks covering culture, tourism, MICE and lifestyle in Goyang.",
      point: "Core tracks and archive",
      href: "/research",
      gradientFrom: "#f0fdf8",
      gradientTo: "#e8fbf3",
      chip: "bg-[#dff7ee] text-[#0d7b58]",
      iconBg: "bg-[#b7f0d8]",
      iconColor: "text-[#0a6b48]",
      glowColor: "rgba(141,240,207,0.5)",
      icon: FileSearch,
    },
    {
      tag: "DMC",
      title: "DMC services",
      desc: "Understand how Goyang connects operations, bookings and local visitor experiences.",
      point: "Operations and local connection",
      href: "/dmc",
      gradientFrom: "#f0f4ff",
      gradientTo: "#eef2ff",
      chip: "bg-[#e1e8ff] text-[#3655a6]",
      iconBg: "bg-[#d4ddff]",
      iconColor: "text-[#3655a6]",
      glowColor: "rgba(100,130,255,0.4)",
      icon: Compass,
    },
    {
      tag: "Booking",
      title: "Bookings",
      desc: "Browse stays, travel products, dining, tickets and airport pickup categories quickly.",
      point: "Booking categories and flow",
      href: "/products",
      gradientFrom: "#fff6f2",
      gradientTo: "#ffe7df",
      chip: "bg-[#ffd9cd] text-[#a34d36]",
      iconBg: "bg-[#ffd0c0]",
      iconColor: "text-[#9b3a1a]",
      glowColor: "rgba(255,143,126,0.5)",
      icon: ShoppingBag,
    },
    {
      tag: "Contact",
      title: "Contact",
      desc: "Send consultation, partnership and program inquiries from one place.",
      point: "Consultation and proposals",
      href: "/contact",
      gradientFrom: "#f9f5ff",
      gradientTo: "#f2ecff",
      chip: "bg-[#efe4ff] text-[#7b55b3]",
      iconBg: "bg-[#e0cfff]",
      iconColor: "text-[#6b3dbf]",
      glowColor: "rgba(160,100,255,0.4)",
      icon: Mail,
    },
  ],
};

export default async function CoreSection({ locale }: { locale: string }) {
  const activeLocale = locale === "en" ? "en" : "ko";
  const cards = cardSets[activeLocale];

  return (
    <section className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-18">
      {/* 배경 글로우 */}
      <div className="pointer-events-none absolute left-0 top-1/2 h-56 w-56 -translate-y-1/2 rounded-full bg-[#8df0cf]/15 blur-[80px]" />
      <div className="pointer-events-none absolute right-0 top-1/3 h-56 w-56 rounded-full bg-[#a4d8ff]/18 blur-[80px]" />

      <SectionTitle
        eyebrow={activeLocale === "en" ? "Core Services" : "핵심업무"}
        title={activeLocale === "en" ? "What We Do" : "우리가 하는 일"}
      />

      <div className="mt-8 grid gap-4 sm:mt-10 md:grid-cols-2 xl:grid-cols-5">
        {cards.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              style={{ background: `linear-gradient(145deg, ${item.gradientFrom}, ${item.gradientTo})` }}
              className="group relative flex h-full flex-col overflow-hidden rounded-[26px] border border-white/90 p-5 shadow-[0_8px_28px_rgba(16,32,58,0.07)] transition duration-300 hover:-translate-y-1.5 sm:p-6"
            >
              {/* 호버 글로우 */}
              <div
                className="pointer-events-none absolute inset-0 rounded-[26px] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{ boxShadow: `0 0 32px ${item.glowColor}` }}
              />
              {/* 상단 그라데이션 라인 */}
              <div
                className="absolute inset-x-0 top-0 h-[3px] rounded-t-[26px]"
                style={{ background: `linear-gradient(90deg, ${item.gradientTo}, ${item.gradientFrom})` }}
              />

              <div className="flex items-start justify-between gap-3">
                <div className={`flex h-11 w-11 items-center justify-center rounded-2xl shadow-sm ${item.iconBg} ${item.iconColor}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className={`inline-flex rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] ${item.chip}`}>
                  {item.tag}
                </span>
              </div>

              <h3 className="mt-5 text-[1.3rem] font-black leading-[1.18] tracking-[-0.04em] text-slate-950">
                {item.title}
              </h3>

              <div className="mt-3 rounded-xl bg-white/60 px-3.5 py-2.5 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400 backdrop-blur">
                {item.point}
              </div>

              <p className="mt-4 text-[14px] leading-7 text-slate-500">{item.desc}</p>

              <div className="mt-auto pt-6">
                <span className="inline-flex items-center gap-2 text-sm font-bold text-[#ff6b52] transition-all duration-200 group-hover:gap-3">
                  {activeLocale === "en" ? "View details" : "자세히 보기"}
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
