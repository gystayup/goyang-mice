import { ArrowRight, BedDouble, Compass, PlaneTakeoff, Sparkles, Ticket, UtensilsCrossed } from "lucide-react";
import Image from "next/image";

import SectionTitle from "@/components/common/SectionTitle";
import { products } from "@/data/products";
import { readDmcCategoryMediaMap } from "@/lib/dmc-category-media";
import { Link } from "@/lib/navigation";

import ProductCard from "../products/ProductCard";

type CategoryKey = "tour" | "stay" | "restaurant" | "cafe" | "ticket" | "airport";
type LocaleKey = "ko" | "en" | "ja" | "zh-CN" | "zh-TW";

const categoryIcons: Record<CategoryKey, typeof Compass> = {
  tour: Compass,
  stay: BedDouble,
  restaurant: UtensilsCrossed,
  cafe: Sparkles,
  ticket: Ticket,
  airport: PlaneTakeoff,
};

type MainCopy = { eyebrow: string; title: string; viewAll: string };
const copyMap: Record<LocaleKey, MainCopy> = {
  ko:      { eyebrow: "DMC Services", title: "고양시 방문, 체류 관광, 이벤트 원스톱 서비스",                        viewAll: "전체 서비스 보기" },
  en:      { eyebrow: "DMC Services", title: "One-stop services for Goyang visits, stays, tourism and events",      viewAll: "View all services" },
  ja:      { eyebrow: "DMC Services", title: "高陽市訪問・滞在観光・イベントのワンストップサービス",                viewAll: "全サービスを見る" },
  "zh-CN": { eyebrow: "DMC Services", title: "高阳市访问·滞留旅游·活动一站式服务",                                 viewAll: "查看全部服务" },
  "zh-TW": { eyebrow: "DMC Services", title: "高陽市訪問·滯留旅遊·活動一站式服務",                                 viewAll: "查看全部服務" },
};

type CatItem = { title: string; gradFrom: string; gradTo: string; iconBg: string; iconColor: string; glow: string };
const categoryCopy: Record<LocaleKey, Record<CategoryKey, CatItem>> = {
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
  ja: {
    tour:       { title: "旅行商品予約",    gradFrom: "#fffbee", gradTo: "#fff4da", iconBg: "bg-[#ffe8a0]", iconColor: "text-[#9b7a00]", glow: "rgba(255,233,139,0.5)" },
    stay:       { title: "宿泊予約",        gradFrom: "#f0fdf8", gradTo: "#e9fbf4", iconBg: "bg-[#b7f0d8]", iconColor: "text-[#0a6b48]", glow: "rgba(141,240,207,0.5)" },
    restaurant: { title: "レストラン予約",  gradFrom: "#fff7f2", gradTo: "#fff2e5", iconBg: "bg-[#ffd5a8]", iconColor: "text-[#9b4800]", glow: "rgba(255,181,143,0.5)" },
    cafe:       { title: "ライフスタイル",  gradFrom: "#f8f4ff", gradTo: "#f2ecff", iconBg: "bg-[#dcc8ff]", iconColor: "text-[#6b3dbf]", glow: "rgba(160,100,255,0.4)" },
    ticket:     { title: "チケット予約",    gradFrom: "#f2fdf9", gradTo: "#eef8f5", iconBg: "bg-[#a8e8da]", iconColor: "text-[#0a6b5a]", glow: "rgba(100,220,200,0.4)" },
    airport:    { title: "空港送迎予約",    gradFrom: "#fff8f2", gradTo: "#fff4e9", iconBg: "bg-[#ffd5b0]", iconColor: "text-[#9b5200]", glow: "rgba(255,200,140,0.5)" },
  },
  "zh-CN": {
    tour:       { title: "旅游产品预约",    gradFrom: "#fffbee", gradTo: "#fff4da", iconBg: "bg-[#ffe8a0]", iconColor: "text-[#9b7a00]", glow: "rgba(255,233,139,0.5)" },
    stay:       { title: "住宿预约",        gradFrom: "#f0fdf8", gradTo: "#e9fbf4", iconBg: "bg-[#b7f0d8]", iconColor: "text-[#0a6b48]", glow: "rgba(141,240,207,0.5)" },
    restaurant: { title: "餐厅预约",        gradFrom: "#fff7f2", gradTo: "#fff2e5", iconBg: "bg-[#ffd5a8]", iconColor: "text-[#9b4800]", glow: "rgba(255,181,143,0.5)" },
    cafe:       { title: "生活方式",        gradFrom: "#f8f4ff", gradTo: "#f2ecff", iconBg: "bg-[#dcc8ff]", iconColor: "text-[#6b3dbf]", glow: "rgba(160,100,255,0.4)" },
    ticket:     { title: "票务预约",        gradFrom: "#f2fdf9", gradTo: "#eef8f5", iconBg: "bg-[#a8e8da]", iconColor: "text-[#0a6b5a]", glow: "rgba(100,220,200,0.4)" },
    airport:    { title: "机场接送预约",    gradFrom: "#fff8f2", gradTo: "#fff4e9", iconBg: "bg-[#ffd5b0]", iconColor: "text-[#9b5200]", glow: "rgba(255,200,140,0.5)" },
  },
  "zh-TW": {
    tour:       { title: "旅遊產品預約",    gradFrom: "#fffbee", gradTo: "#fff4da", iconBg: "bg-[#ffe8a0]", iconColor: "text-[#9b7a00]", glow: "rgba(255,233,139,0.5)" },
    stay:       { title: "住宿預約",        gradFrom: "#f0fdf8", gradTo: "#e9fbf4", iconBg: "bg-[#b7f0d8]", iconColor: "text-[#0a6b48]", glow: "rgba(141,240,207,0.5)" },
    restaurant: { title: "餐廳預約",        gradFrom: "#fff7f2", gradTo: "#fff2e5", iconBg: "bg-[#ffd5a8]", iconColor: "text-[#9b4800]", glow: "rgba(255,181,143,0.5)" },
    cafe:       { title: "生活風格",        gradFrom: "#f8f4ff", gradTo: "#f2ecff", iconBg: "bg-[#dcc8ff]", iconColor: "text-[#6b3dbf]", glow: "rgba(160,100,255,0.4)" },
    ticket:     { title: "票務預約",        gradFrom: "#f2fdf9", gradTo: "#eef8f5", iconBg: "bg-[#a8e8da]", iconColor: "text-[#0a6b5a]", glow: "rgba(100,220,200,0.4)" },
    airport:    { title: "機場接送預約",    gradFrom: "#fff8f2", gradTo: "#fff4e9", iconBg: "bg-[#ffd5b0]", iconColor: "text-[#9b5200]", glow: "rgba(255,200,140,0.5)" },
  },
};

const categoryOrder: CategoryKey[] = ["tour", "stay", "restaurant", "cafe", "ticket", "airport"];
const LOCALES: LocaleKey[] = ["ko", "en", "ja", "zh-CN", "zh-TW"];

// 카테고리 클릭 시 이동할 예약 페이지
const categoryHref: Record<CategoryKey, string> = {
  tour:       "/products/tour-experience-platform/reservation",
  stay:       "/products/stay-reservation-platform/reservation",
  restaurant: "/products/restaurant-booking-platform/reservation",
  cafe:       "/products/cafe-booking-platform/reservation",
  ticket:     "/products/ticket-agency-platform/reservation",
  airport:    "/products/airport-pickup-platform/reservation",
};

export default async function ProductPreviewSection({ locale }: { locale: string }) {
  const activeLocale: LocaleKey = (LOCALES.includes(locale as LocaleKey) ? locale : "ko") as LocaleKey;
  const copy = copyMap[activeLocale];
  const categoryMedia = await readDmcCategoryMediaMap().catch(() => null);

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
            const photo = categoryMedia?.[key]?.src ?? "";
            return (
              <Link
                key={key}
                href={categoryHref[key]}
                style={photo ? undefined : { background: `linear-gradient(145deg, ${item.gradFrom}, ${item.gradTo})` }}
                className="group relative flex items-center gap-4 overflow-hidden rounded-[20px] border border-white/90 px-5 py-5 shadow-[0_4px_16px_rgba(16,32,58,0.06)] transition duration-300 hover:-translate-y-1 sm:px-6"
              >
                {/* 배경 사진 */}
                {photo ? (
                  <>
                    <Image
                      src={photo}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    {/* 사진 위 어두운 오버레이 */}
                    <div className="pointer-events-none absolute inset-0 bg-black/40 transition-opacity duration-300 group-hover:bg-black/50" />
                  </>
                ) : (
                  /* 호버 글로우 (그라데이션 모드) */
                  <div
                    className="pointer-events-none absolute inset-0 rounded-[20px] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    style={{ boxShadow: `0 0 28px ${item.glow}` }}
                  />
                )}
                <div className={`relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl shadow-sm ${photo ? "bg-white/20 text-white" : `${item.iconBg} ${item.iconColor}`}`}>
                  <Icon className="h-7 w-7" />
                </div>
                <div className={`relative text-xl font-black tracking-[-0.03em] sm:text-[1.35rem] ${photo ? "text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]" : "text-slate-950"}`}>
                  {item.title}
                </div>
                <ArrowRight className={`relative ml-auto h-4 w-4 shrink-0 transition-transform duration-200 group-hover:translate-x-1 ${photo ? "text-white/80 group-hover:text-white" : "text-slate-400 group-hover:text-slate-600"}`} />
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
