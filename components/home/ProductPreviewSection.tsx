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
  Record<CategoryKey, { title: string; tone: string; iconTone: string }>
> = {
  ko: {
    tour:       { title: "여행상품 예약",    tone: "bg-[#fff7df]", iconTone: "bg-[#ffe8a0] text-[#9b7a00]" },
    stay:       { title: "숙박 예약",        tone: "bg-[#e9fbf4]", iconTone: "bg-[#b7f0d8] text-[#0a6b48]" },
    restaurant: { title: "음식점 예약",      tone: "bg-[#fff2e5]", iconTone: "bg-[#ffd5a8] text-[#9b4800]" },
    cafe:       { title: "라이프스타일",     tone: "bg-[#f5efff]", iconTone: "bg-[#dcc8ff] text-[#6b3dbf]" },
    ticket:     { title: "티켓 예약",        tone: "bg-[#eef8f5]", iconTone: "bg-[#a8e8da] text-[#0a6b5a]" },
    airport:    { title: "공항픽업 예약",    tone: "bg-[#fff4e9]", iconTone: "bg-[#ffd5b0] text-[#9b5200]" },
  },
  en: {
    tour:       { title: "Travel Products", tone: "bg-[#fff7df]", iconTone: "bg-[#ffe8a0] text-[#9b7a00]" },
    stay:       { title: "Accommodation",   tone: "bg-[#e9fbf4]", iconTone: "bg-[#b7f0d8] text-[#0a6b48]" },
    restaurant: { title: "Restaurant",      tone: "bg-[#fff2e5]", iconTone: "bg-[#ffd5a8] text-[#9b4800]" },
    cafe:       { title: "Lifestyle",       tone: "bg-[#f5efff]", iconTone: "bg-[#dcc8ff] text-[#6b3dbf]" },
    ticket:     { title: "Ticket Booking",  tone: "bg-[#eef8f5]", iconTone: "bg-[#a8e8da] text-[#0a6b5a]" },
    airport:    { title: "Airport Pickup",  tone: "bg-[#fff4e9]", iconTone: "bg-[#ffd5b0] text-[#9b5200]" },
  },
};

const categoryOrder: CategoryKey[] = ["tour", "stay", "restaurant", "cafe", "ticket", "airport"];

export default async function ProductPreviewSection({ locale }: { locale: string }) {
  const activeLocale = locale === "en" ? "en" : "ko";
  const copy = copyMap[activeLocale];

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="overflow-hidden rounded-[30px] border border-white/70 bg-[linear-gradient(135deg,_#fff0d7_0%,_#ffe5df_30%,_#eef7ff_68%,_#e7fbf3_100%)] px-5 py-8 shadow-[0_18px_46px_rgba(16,32,58,0.08)] sm:rounded-[36px] sm:px-8 sm:py-10">
        <SectionTitle eyebrow={copy.eyebrow} title={copy.title} />

        {/* 카테고리 카드 */}
        <div className="mt-6 grid gap-3 sm:mt-8 sm:grid-cols-2 md:grid-cols-3">
          {categoryOrder.map((key) => {
            const item = categoryCopy[activeLocale][key];
            const Icon = categoryIcons[key];
            return (
              <Link
                key={key}
                href="/products"
                className={`group flex items-center gap-4 rounded-[20px] border border-white/80 px-5 py-5 shadow-[0_6px_16px_rgba(16,32,58,0.05)] transition hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(16,32,58,0.08)] sm:px-6 ${item.tone}`}
              >
                <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${item.iconTone}`}>
                  <Icon className="h-7 w-7" />
                </div>
                <div className="text-xl font-black tracking-[-0.03em] text-slate-950 sm:text-2xl">
                  {item.title}
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <Link
          href="/products"
          className="inline-flex min-h-12 shrink-0 items-center gap-2 rounded-full border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
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
