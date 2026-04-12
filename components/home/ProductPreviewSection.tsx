import { ArrowRight, BedDouble, Compass, PlaneTakeoff, Sparkles, Ticket, UtensilsCrossed } from "lucide-react";

import SectionTitle from "@/components/common/SectionTitle";
import { products } from "@/data/products";
import { Link } from "@/lib/navigation";

import ProductCard from "../products/ProductCard";

type CategoryKey = "tour" | "stay" | "restaurant" | "cafe" | "ticket" | "airport";

const categoryIcons: Record<CategoryKey, typeof Compass> = {
  tour: Compass,
  stay: BedDouble,
  restaurant: UtensilsCrossed,
  cafe: Sparkles,
  ticket: Ticket,
  airport: PlaneTakeoff,
};

const copyMap = {
  ko: {
    eyebrow: "DMC Services",
    title: "고양시 방문, 체류 관광, 이벤트 원스톱 서비스",
    viewAll: "전체 서비스 보기",
  },
  en: {
    eyebrow: "DMC Services",
    title: "One-stop services for Goyang visits, stays, tourism and events",
    viewAll: "View all services",
  },
} as const;

const categoryCopy: Record<
  "ko" | "en",
  Record<CategoryKey, { title: string; gradFrom: string; gradTo: string; iconBg: string; iconColor: string; glow: string }>
> = {
  ko: {
    tour:       { title: "여행상품 예약",  gradFrom: "#fffbee", gradTo: "#fff4da", iconBg: "bg-[#ffe8a0]", iconColor: "text-[#9b7a00]", glow: "rgba(255,233,139,0.5)" },
    stay:       { title: "숙박 예약",      gradFrom: "#f0fdf8", gradTo: "#e9fbf4", iconBg: "bg-[#b7f0d8]", iconColor: "text-[#0a6b48]", glow: "rgba(141,240,207,0.5)" },
    restaurant: { title: "음식점 예약",    gradFrom: "#fff7f2", gradTo: "#fff2e5", iconBg: "bg-[#ffd5a8]", iconColor: "text-[#9b4800]", glow: "rgba(255,181,143,0.5)" },
    cafe:       { title: "라이프스타일",   gradFrom: "#f8f4ff", gradTo: "#f2ecff", iconBg: "bg-[#dcc8ff]", iconColor: "text-[#6b3dbf]", glow: "rgba(160,100,255,0.4)" },
    ticket:     { title: "티켓 예약",      gradFrom: "#f2fdf9", gradTo: "#eef8f5", iconBg: "bg-[#a8e8da]", iconColor: "text-[#0a6b5a]", glow: "rgba(100,220,200,0.4)" },
    airport:    { title: "공항픽업 예약",  gradFrom: "#fff8f2", gradTo: "#fff4e9", iconBg: "bg-[#ffd5b0]", iconColor: "text-[#9b5200]", glow: "rgba(255,200,140,0.5)" },
  },
  en: {
    tour:       { title: "Travel Products", gradFrom: "#fffbee", gradTo: "#fff4da", iconBg: "bg-[#ffe8a0]", iconColor: "text-[#9b7a00]", glow: "rgba(255,233,139,0.5)" },
    stay:       { title: "Accommodation",   gradFrom: "#f0fdf8", gradTo: "#e9fbf4", iconBg: "bg-[#b7f0d8]", iconColor: "text-[#0a6b48]", glow: "rgba(141,240,207,0.5)" },
    restaurant: { title: "Restaurant",      gradFrom: "#fff7f2", gradTo: "#fff2e5", iconBg: "bg-[#ffd5a8]", iconColor: "text-[#9b4800]", glow: "rgba(255,181,143,0.5)" },
    cafe:       { title: "Lifestyle",       gradFrom: "#f8f4ff", gradTo: "#f2ecff", iconBg: "bg-[#dcc8ff]", iconColor: "text-[#6b3dbf]", glow: "rgba(160,100,255,0.4)" },
    ticket:     { title: "Ticket Booking",  gradFrom: "#f2fdf9", gradTo: "#eef8f5", iconBg: "bg-[#a8e8da]", iconColor: "text-[#0a6b5a]", glow: "rgba(100,220,200,0.4)" },
    airport:    { title: "Airport Pickup",  gradFrom: "#fff8f2", gradTo: "#fff4e9", iconBg: "bg-[#ffd5b0]", iconColor: "text-[#9b5200]", glow: "rgba(255,200,140,0.5)" },
  },
};

const categoryOrder: CategoryKey[] = ["tour", "stay", "restaurant", "cafe", "ticket", "airport"];

export default async function ProductPreviewSection({ locale }: { locale: string }) {
  const activeLocale = locale === "en" ? "en" : "ko";
  const copy = copyMap[activeLocale];

  return (
    <section className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
      {/* 배경 글로우 */}
      <div className="pointer-events-none absolute left-1/4 top-0 h-48 w-48 rounded-full bg-[#ffe98b]/20 blur-[70px]" />
      <div className="pointer-events-none absolute bottom-0 right-1/4 h-48 w-48 rounded-full bg-[#8df0cf]/18 blur-[70px]" />

      <div className="relative overflow-hidden rounded-[32px] border border-white/80 bg-white/60 px-5 py-10 shadow-[0_20px_60px_rgba(16,32,58,0.09),_0_0_0_1px_rgba(255,255,255,0.7)] backdrop-blur-lg sm:rounded-[40px] sm:px-8 sm:py-12">
        {/* 상단 장식 라인 */}
        <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[#8df0cf] via-[#ffe98b] to-[#ffb58f]" />

        <SectionTitle eyebrow={copy.eyebrow} title={copy.title} />

        {/* 카테고리 카드 */}
        <div className="mt-8 grid gap-3 sm:mt-10 sm:grid-cols-2 md:grid-cols-3">
          {categoryOrder.map((key) => {
            const item = categoryCopy[activeLocale][key];
            const Icon = categoryIcons[key];
            return (
              <Link
                key={key}
                href="/products"
                style={{ background: `linear-gradient(145deg, ${item.gradFrom}, ${item.gradTo})` }}
                className="group relative flex items-center gap-4 overflow-hidden rounded-[20px] border border-white/90 px-5 py-5 shadow-[0_4px_16px_rgba(16,32,58,0.06)] transition duration-300 hover:-translate-y-1 sm:px-6"
              >
                {/* 호버 글로우 */}
                <div
                  className="pointer-events-none absolute inset-0 rounded-[20px] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{ boxShadow: `0 0 28px ${item.glow}` }}
                />
                <div className={`relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl shadow-sm ${item.iconBg} ${item.iconColor}`}>
                  <Icon className="h-7 w-7" />
                </div>
                <div className="relative text-xl font-black tracking-[-0.03em] text-slate-950 sm:text-[1.35rem]">
                  {item.title}
                </div>
                <ArrowRight className="relative ml-auto h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-slate-600" />
              </Link>
            );
          })}
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <Link
          href="/products"
          className="inline-flex min-h-12 shrink-0 items-center gap-2 rounded-full border border-white/70 bg-white/80 px-5 text-sm font-semibold text-slate-700 shadow-[0_4px_14px_rgba(16,32,58,0.07)] backdrop-blur transition hover:bg-white hover:shadow-[0_8px_24px_rgba(16,32,58,0.10)]"
        >
          {copy.viewAll}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} locale={activeLocale} />
        ))}
      </div>
    </section>
  );
}
