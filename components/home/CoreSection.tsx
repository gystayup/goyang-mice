import {
  ArrowRight,
  Building2,
  Compass,
  FileSearch,
  Mail,
  ShoppingBag,
} from "lucide-react";
import { getLocale } from "next-intl/server";

import SectionTitle from "@/components/common/SectionTitle";
import { Link } from "@/lib/navigation";

type QuickCard = {
  tag: string;
  title: string;
  desc: string;
  point: string;
  href: string;
  tone: string;
  chip: string;
  iconTone: string;
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
      tone: "from-[#fff4da] to-[#fffaf0]",
      chip: "bg-[#fff0c9] text-[#9b6400]",
      iconTone: "bg-[#fff4da] text-[#9b6400]",
      icon: Building2,
    },
    {
      tag: "Research",
      title: "연구 분야",
      desc: "고양의 문화, 관광, 마이스, 라이프스타일 전략을 만드는 핵심 연구 트랙을 살펴보세요.",
      point: "핵심 트랙과 연구 아카이브",
      href: "/research",
      tone: "from-[#e8fbf3] to-[#f6fffb]",
      chip: "bg-[#dff7ee] text-[#0d7b58]",
      iconTone: "bg-[#e8fbf3] text-[#0d7b58]",
      icon: FileSearch,
    },
    {
      tag: "DMC",
      title: "DMC 서비스",
      desc: "행사 운영과 로컬 경험을 연결하는 DMC 서비스 구조를 바로 확인할 수 있습니다.",
      point: "현장 운영과 로컬 연결",
      href: "/dmc",
      tone: "from-[#eef2ff] to-[#f8faff]",
      chip: "bg-[#e1e8ff] text-[#3655a6]",
      iconTone: "bg-[#eef2ff] text-[#3655a6]",
      icon: Compass,
    },
    {
      tag: "Booking",
      title: "서비스 예약",
      desc: "여행상품, 숙박, 음식점, 티켓, 공항픽업까지 필요한 예약을 빠르게 찾을 수 있습니다.",
      point: "예약 카테고리와 흐름",
      href: "/products",
      tone: "from-[#ffe7df] to-[#fff6f1]",
      chip: "bg-[#ffd9cd] text-[#a34d36]",
      iconTone: "bg-[#ffe7df] text-[#a34d36]",
      icon: ShoppingBag,
    },
    {
      tag: "Contact",
      title: "문의하기",
      desc: "협력 제안과 구축 상담, 맞춤형 운영 문의를 한 곳에서 남길 수 있습니다.",
      point: "상담 접수와 제안",
      href: "/contact",
      tone: "from-[#f7f1ff] to-[#fcf9ff]",
      chip: "bg-[#efe4ff] text-[#7b55b3]",
      iconTone: "bg-[#f7f1ff] text-[#7b55b3]",
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
      tone: "from-[#fff4da] to-[#fffaf0]",
      chip: "bg-[#fff0c9] text-[#9b6400]",
      iconTone: "bg-[#fff4da] text-[#9b6400]",
      icon: Building2,
    },
    {
      tag: "Research",
      title: "Research",
      desc: "Explore the strategy tracks covering culture, tourism, MICE and lifestyle in Goyang.",
      point: "Core tracks and archive",
      href: "/research",
      tone: "from-[#e8fbf3] to-[#f6fffb]",
      chip: "bg-[#dff7ee] text-[#0d7b58]",
      iconTone: "bg-[#e8fbf3] text-[#0d7b58]",
      icon: FileSearch,
    },
    {
      tag: "DMC",
      title: "DMC services",
      desc: "Understand how Goyang connects operations, bookings and local visitor experiences.",
      point: "Operations and local connection",
      href: "/dmc",
      tone: "from-[#eef2ff] to-[#f8faff]",
      chip: "bg-[#e1e8ff] text-[#3655a6]",
      iconTone: "bg-[#eef2ff] text-[#3655a6]",
      icon: Compass,
    },
    {
      tag: "Booking",
      title: "Bookings",
      desc: "Browse stays, travel products, dining, tickets and airport pickup categories quickly.",
      point: "Booking categories and flow",
      href: "/products",
      tone: "from-[#ffe7df] to-[#fff6f1]",
      chip: "bg-[#ffd9cd] text-[#a34d36]",
      iconTone: "bg-[#ffe7df] text-[#a34d36]",
      icon: ShoppingBag,
    },
    {
      tag: "Contact",
      title: "Contact",
      desc: "Send consultation, partnership and program inquiries from one place.",
      point: "Consultation and proposals",
      href: "/contact",
      tone: "from-[#f7f1ff] to-[#fcf9ff]",
      chip: "bg-[#efe4ff] text-[#7b55b3]",
      iconTone: "bg-[#f7f1ff] text-[#7b55b3]",
      icon: Mail,
    },
  ],
};

export default async function CoreSection() {
  const locale = await getLocale();
  const activeLocale = locale === "en" ? "en" : "ko";
  const cards = cardSets[activeLocale];

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-18">
      <SectionTitle
        eyebrow={activeLocale === "en" ? "Quick Access" : "핵심 메뉴"}
        title={
          activeLocale === "en"
            ? "Five clear paths for first-time visitors"
            : "처음 들어와도 바로 이해되는 5개의 핵심 메뉴"
        }
        desc={
          activeLocale === "en"
            ? "Each menu is organized as a distinct content unit so users can understand where to go without confusion."
            : "연구소 소개부터 DMC 서비스, 예약 프로그램, 문의까지 모바일에서도 읽기 쉽게 핵심 경로를 정리했습니다."
        }
      />

      <div className="mt-8 grid gap-4 sm:mt-10 md:grid-cols-2 xl:grid-cols-5">
        {cards.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="group relative flex h-full flex-col overflow-hidden rounded-[26px] border border-white/70 bg-white/90 p-5 shadow-[0_12px_32px_rgba(16,32,58,0.06)] transition hover:-translate-y-1 hover:shadow-[0_18px_42px_rgba(16,32,58,0.1)] sm:p-6"
            >
              <div className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${item.tone}`} />

              <div className="flex items-start justify-between gap-3">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl ${item.iconTone}`}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${item.chip}`}
                >
                  {item.tag}
                </span>
              </div>

              <h3 className="mt-4 text-lg font-black leading-[1.25] tracking-[-0.03em] text-slate-950 sm:text-xl">
                {item.title}
              </h3>

              <div className="mt-3 rounded-2xl bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                {item.point}
              </div>

              <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-[15px]">{item.desc}</p>

              <div className="mt-auto pt-5">
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#ff7d66] transition group-hover:gap-3">
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
