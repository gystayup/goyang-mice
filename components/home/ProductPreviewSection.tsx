import { ArrowRight, BedDouble, Compass, PlaneTakeoff, Sparkles, Stethoscope, Ticket, UtensilsCrossed } from "lucide-react";
import Image from "next/image";

import SectionTitle from "@/components/common/SectionTitle";
import { products } from "@/data/products";
import { readDmcCategoryMediaMap } from "@/lib/dmc-category-media";
import { Link } from "@/lib/navigation";

import ProductCard from "../products/ProductCard";

type CategoryKey = "tour" | "stay" | "restaurant" | "cafe" | "ticket" | "airport" | "medical";
type LocaleKey = "ko" | "en" | "ja" | "zh-CN" | "zh-TW";

const categoryIcons: Record<CategoryKey, typeof Compass> = {
  tour: Compass,
  stay: BedDouble,
  restaurant: UtensilsCrossed,
  cafe: Sparkles,
  ticket: Ticket,
  airport: PlaneTakeoff,
  medical: Stethoscope,
};

type MainCopy = { eyebrow: string; title: string; viewAll: string; medicalEyebrow: string; medicalTitle: string };
const copyMap: Record<LocaleKey, MainCopy> = {
  ko:      { eyebrow: "MICE 안내", title: "고양일산 방문·체류·이벤트 정보 한눈에",                                    viewAll: "전체 안내 보기",   medicalEyebrow: "Healthcare Guide", medicalTitle: "고양일산 의료기관 안내 — 종합병원·미용의료·재활의료 정보" },
  en:      { eyebrow: "MICE Guide", title: "Guides for Goyang-Ilsan visits, stays, tourism and events",                viewAll: "View all guides",   medicalEyebrow: "Healthcare Guide", medicalTitle: "Goyang-Ilsan Healthcare Guide — hospitals, aesthetic clinics and rehabilitation" },
  ja:      { eyebrow: "MICEガイド", title: "高陽・一山 訪問・滞在観光・イベントのご案内",                              viewAll: "全ての案内を見る", medicalEyebrow: "Healthcare Guide", medicalTitle: "高陽・一山 医療機関ガイド — 総合病院・美容医療・リハビリの情報" },
  "zh-CN": { eyebrow: "MICE 指南",  title: "高阳·一山访问·滞留·活动信息一览",                                          viewAll: "查看全部指南",     medicalEyebrow: "Healthcare Guide", medicalTitle: "高阳·一山医疗机构信息 — 综合医院·美容医疗·康复信息" },
  "zh-TW": { eyebrow: "MICE 指南",  title: "高陽·一山訪問·滯留·活動資訊一覽",                                          viewAll: "查看全部指南",     medicalEyebrow: "Healthcare Guide", medicalTitle: "高陽·一山醫療機構資訊 — 綜合醫院·美容醫療·復健資訊" },
};

type CatItem = { title: string; gradFrom: string; gradTo: string; iconBg: string; iconColor: string; glow: string };
const categoryCopy: Record<LocaleKey, Record<CategoryKey, CatItem>> = {
  ko: {
    tour:       { title: "여행상품 안내",  gradFrom: "#fffbee", gradTo: "#fff4da", iconBg: "bg-[#ffe8a0]", iconColor: "text-[#9b7a00]", glow: "rgba(255,233,139,0.5)" },
    stay:       { title: "숙박 안내",      gradFrom: "#f0fdf8", gradTo: "#e9fbf4", iconBg: "bg-[#b7f0d8]", iconColor: "text-[#0a6b48]", glow: "rgba(141,240,207,0.5)" },
    restaurant: { title: "음식점 안내",    gradFrom: "#fff7f2", gradTo: "#fff2e5", iconBg: "bg-[#ffd5a8]", iconColor: "text-[#9b4800]", glow: "rgba(255,181,143,0.5)" },
    cafe:       { title: "라이프스타일",   gradFrom: "#f8f4ff", gradTo: "#f2ecff", iconBg: "bg-[#dcc8ff]", iconColor: "text-[#6b3dbf]", glow: "rgba(160,100,255,0.4)" },
    ticket:     { title: "티켓 예매",      gradFrom: "#f2fdf9", gradTo: "#eef8f5", iconBg: "bg-[#a8e8da]", iconColor: "text-[#0a6b5a]", glow: "rgba(100,220,200,0.4)" },
    airport:    { title: "공항픽업 안내",  gradFrom: "#fff8f2", gradTo: "#fff4e9", iconBg: "bg-[#ffd5b0]", iconColor: "text-[#9b5200]", glow: "rgba(255,200,140,0.5)" },
    medical:    { title: "고양일산 의료기관 안내", gradFrom: "#f2f7ff", gradTo: "#e9f1ff", iconBg: "bg-[#c7d8ff]", iconColor: "text-[#234ca6]", glow: "rgba(120,160,240,0.4)" },
  },
  en: {
    tour:       { title: "Travel Guide",    gradFrom: "#fffbee", gradTo: "#fff4da", iconBg: "bg-[#ffe8a0]", iconColor: "text-[#9b7a00]", glow: "rgba(255,233,139,0.5)" },
    stay:       { title: "Stay Guide",      gradFrom: "#f0fdf8", gradTo: "#e9fbf4", iconBg: "bg-[#b7f0d8]", iconColor: "text-[#0a6b48]", glow: "rgba(141,240,207,0.5)" },
    restaurant: { title: "Restaurants",     gradFrom: "#fff7f2", gradTo: "#fff2e5", iconBg: "bg-[#ffd5a8]", iconColor: "text-[#9b4800]", glow: "rgba(255,181,143,0.5)" },
    cafe:       { title: "Lifestyle",       gradFrom: "#f8f4ff", gradTo: "#f2ecff", iconBg: "bg-[#dcc8ff]", iconColor: "text-[#6b3dbf]", glow: "rgba(160,100,255,0.4)" },
    ticket:     { title: "Ticket Booking",  gradFrom: "#f2fdf9", gradTo: "#eef8f5", iconBg: "bg-[#a8e8da]", iconColor: "text-[#0a6b5a]", glow: "rgba(100,220,200,0.4)" },
    airport:    { title: "Airport Access",  gradFrom: "#fff8f2", gradTo: "#fff4e9", iconBg: "bg-[#ffd5b0]", iconColor: "text-[#9b5200]", glow: "rgba(255,200,140,0.5)" },
    medical:    { title: "Goyang-Ilsan Healthcare Guide", gradFrom: "#f2f7ff", gradTo: "#e9f1ff", iconBg: "bg-[#c7d8ff]", iconColor: "text-[#234ca6]", glow: "rgba(120,160,240,0.4)" },
  },
  ja: {
    tour:       { title: "旅行商品案内",    gradFrom: "#fffbee", gradTo: "#fff4da", iconBg: "bg-[#ffe8a0]", iconColor: "text-[#9b7a00]", glow: "rgba(255,233,139,0.5)" },
    stay:       { title: "宿泊案内",        gradFrom: "#f0fdf8", gradTo: "#e9fbf4", iconBg: "bg-[#b7f0d8]", iconColor: "text-[#0a6b48]", glow: "rgba(141,240,207,0.5)" },
    restaurant: { title: "レストラン案内",  gradFrom: "#fff7f2", gradTo: "#fff2e5", iconBg: "bg-[#ffd5a8]", iconColor: "text-[#9b4800]", glow: "rgba(255,181,143,0.5)" },
    cafe:       { title: "ライフスタイル",  gradFrom: "#f8f4ff", gradTo: "#f2ecff", iconBg: "bg-[#dcc8ff]", iconColor: "text-[#6b3dbf]", glow: "rgba(160,100,255,0.4)" },
    ticket:     { title: "チケット予約",    gradFrom: "#f2fdf9", gradTo: "#eef8f5", iconBg: "bg-[#a8e8da]", iconColor: "text-[#0a6b5a]", glow: "rgba(100,220,200,0.4)" },
    airport:    { title: "空港送迎案内",    gradFrom: "#fff8f2", gradTo: "#fff4e9", iconBg: "bg-[#ffd5b0]", iconColor: "text-[#9b5200]", glow: "rgba(255,200,140,0.5)" },
    medical:    { title: "高陽・一山 医療機関ガイド", gradFrom: "#f2f7ff", gradTo: "#e9f1ff", iconBg: "bg-[#c7d8ff]", iconColor: "text-[#234ca6]", glow: "rgba(120,160,240,0.4)" },
  },
  "zh-CN": {
    tour:       { title: "旅游产品指南",    gradFrom: "#fffbee", gradTo: "#fff4da", iconBg: "bg-[#ffe8a0]", iconColor: "text-[#9b7a00]", glow: "rgba(255,233,139,0.5)" },
    stay:       { title: "住宿指南",        gradFrom: "#f0fdf8", gradTo: "#e9fbf4", iconBg: "bg-[#b7f0d8]", iconColor: "text-[#0a6b48]", glow: "rgba(141,240,207,0.5)" },
    restaurant: { title: "餐厅指南",        gradFrom: "#fff7f2", gradTo: "#fff2e5", iconBg: "bg-[#ffd5a8]", iconColor: "text-[#9b4800]", glow: "rgba(255,181,143,0.5)" },
    cafe:       { title: "生活方式",        gradFrom: "#f8f4ff", gradTo: "#f2ecff", iconBg: "bg-[#dcc8ff]", iconColor: "text-[#6b3dbf]", glow: "rgba(160,100,255,0.4)" },
    ticket:     { title: "票务预约",        gradFrom: "#f2fdf9", gradTo: "#eef8f5", iconBg: "bg-[#a8e8da]", iconColor: "text-[#0a6b5a]", glow: "rgba(100,220,200,0.4)" },
    airport:    { title: "机场接送指南",    gradFrom: "#fff8f2", gradTo: "#fff4e9", iconBg: "bg-[#ffd5b0]", iconColor: "text-[#9b5200]", glow: "rgba(255,200,140,0.5)" },
    medical:    { title: "高阳·一山医疗机构信息", gradFrom: "#f2f7ff", gradTo: "#e9f1ff", iconBg: "bg-[#c7d8ff]", iconColor: "text-[#234ca6]", glow: "rgba(120,160,240,0.4)" },
  },
  "zh-TW": {
    tour:       { title: "旅遊產品指南",    gradFrom: "#fffbee", gradTo: "#fff4da", iconBg: "bg-[#ffe8a0]", iconColor: "text-[#9b7a00]", glow: "rgba(255,233,139,0.5)" },
    stay:       { title: "住宿指南",        gradFrom: "#f0fdf8", gradTo: "#e9fbf4", iconBg: "bg-[#b7f0d8]", iconColor: "text-[#0a6b48]", glow: "rgba(141,240,207,0.5)" },
    restaurant: { title: "餐廳指南",        gradFrom: "#fff7f2", gradTo: "#fff2e5", iconBg: "bg-[#ffd5a8]", iconColor: "text-[#9b4800]", glow: "rgba(255,181,143,0.5)" },
    cafe:       { title: "生活風格",        gradFrom: "#f8f4ff", gradTo: "#f2ecff", iconBg: "bg-[#dcc8ff]", iconColor: "text-[#6b3dbf]", glow: "rgba(160,100,255,0.4)" },
    ticket:     { title: "票務預約",        gradFrom: "#f2fdf9", gradTo: "#eef8f5", iconBg: "bg-[#a8e8da]", iconColor: "text-[#0a6b5a]", glow: "rgba(100,220,200,0.4)" },
    airport:    { title: "機場接送指南",    gradFrom: "#fff8f2", gradTo: "#fff4e9", iconBg: "bg-[#ffd5b0]", iconColor: "text-[#9b5200]", glow: "rgba(255,200,140,0.5)" },
    medical:    { title: "高陽·一山醫療機構資訊", gradFrom: "#f2f7ff", gradTo: "#e9f1ff", iconBg: "bg-[#c7d8ff]", iconColor: "text-[#234ca6]", glow: "rgba(120,160,240,0.4)" },
  },
};

const categoryOrder: CategoryKey[] = ["tour", "stay", "restaurant", "cafe", "ticket", "airport"];
const LOCALES: LocaleKey[] = ["ko", "en", "ja", "zh-CN", "zh-TW"];

// 카테고리 클릭 시 이동할 안내 페이지
const categoryHref: Record<CategoryKey, string> = {
  tour:       "/products#section-tour",
  stay:       "/products#section-stay",
  restaurant: "/products#section-restaurant",
  cafe:       "/products#section-cafe",
  ticket:     "/products#section-ticket",
  airport:    "/products#section-airport",
  medical:    "/products#section-medical",
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
            const photo = (categoryMedia as Record<string, { src?: string } | undefined> | null)?.[key]?.src ?? "";
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
        {products
          .filter((product) => product.categoryKey !== "medical")
          .map((product) => (
            <ProductCard key={product.id} product={product} locale={activeLocale} />
          ))}
      </div>

      {/* 고양 의료기관 정보 안내 섹션 (판매·유치·알선 아님, 사실 정보 안내) */}
      <div className="mt-12">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-[#234ca6]">
              {copy.medicalEyebrow}
            </div>
            <h3 className="mt-2 text-xl font-black tracking-[-0.03em] text-slate-950 sm:text-2xl">
              {copy.medicalTitle}
            </h3>
          </div>
        </div>
        <div className="mt-6 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {products
            .filter((product) => product.categoryKey === "medical")
            .map((product) => (
              <ProductCard key={product.id} product={product} locale={activeLocale} />
            ))}
        </div>
      </div>
    </section>
  );
}
