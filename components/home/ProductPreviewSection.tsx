import { ArrowRight, Building2, Car, Coffee, MapPin, ShoppingBag, Ticket } from "lucide-react";

import SectionTitle from "@/components/common/SectionTitle";
import { products } from "@/data/products";
import { Link } from "@/lib/navigation";

import ProductCard from "../products/ProductCard";

type CategoryKey = "tour" | "stay" | "restaurant" | "cafe" | "ticket" | "airport";

const categoryIcons: Record<CategoryKey, typeof MapPin> = {
  tour: MapPin,
  stay: Building2,
  restaurant: ShoppingBag,
  cafe: Coffee,
  ticket: Ticket,
  airport: Car,
};

const copyMap = {
  ko: {
    eyebrow: "DMC Services",
    title: "여행상품부터 공항픽업까지 6개 예약 서비스를 한 번에 확인하세요",
    desc: "카테고리를 먼저 읽고, 아래 상품 카드에서 상세 보기와 예약으로 바로 이어지는 사용자 중심 구조로 정리했습니다.",
    paymentTitle: "결제방법",
    paymentMethods: ["💳 크레딧카드", "💬 카카오페이", "🏦 계좌송금"],
    note: "모바일에서는 먼저 서비스 성격을 빠르게 파악하고, 바로 아래 카드에서 예약 상세로 이동할 수 있습니다.",
    viewAll: "전체 서비스 보기",
  },
  en: {
    eyebrow: "DMC Services",
    title: "See all six booking services from travel products to airport pickup",
    desc: "Users can understand the category first and then move directly into product details and booking cards below.",
    paymentTitle: "Payment Methods",
    paymentMethods: ["💳 Credit Card", "💬 KakaoPay", "🏦 Bank Transfer"],
    note: "On mobile, users can read the service summary first and move directly into booking cards below.",
    viewAll: "View all services",
  },
} as const;

const categoryCopy: Record<
  "ko" | "en",
  Record<CategoryKey, { eyebrow: string; title: string; preview: string; tone: string; iconTone: string }>
> = {
  ko: {
    tour: { eyebrow: "여행상품", title: "여행상품 예약", preview: "시티투어와 로컬 체험", tone: "bg-[#fff7df]", iconTone: "bg-[#ffe8a0] text-[#9b7a00]" },
    stay: { eyebrow: "숙박예약", title: "숙박 예약", preview: "호텔과 레지던스", tone: "bg-[#e9fbf4]", iconTone: "bg-[#b7f0d8] text-[#0a6b48]" },
    restaurant: { eyebrow: "음식점예약", title: "음식점 예약", preview: "단체 식사와 코스 다이닝", tone: "bg-[#fff2e5]", iconTone: "bg-[#ffd5a8] text-[#9b4800]" },
    cafe: { eyebrow: "라이프스타일", title: "라이프스타일 예약", preview: "브런치와 감각적 공간", tone: "bg-[#f5efff]", iconTone: "bg-[#dcc8ff] text-[#6b3dbf]" },
    ticket: { eyebrow: "티켓예약", title: "티켓 예약", preview: "공연과 전시", tone: "bg-[#eef8f5]", iconTone: "bg-[#a8e8da] text-[#0a6b5a]" },
    airport: { eyebrow: "공항픽업", title: "공항픽업 예약", preview: "인천과 김포 공항 이동", tone: "bg-[#fff4e9]", iconTone: "bg-[#ffd5b0] text-[#9b5200]" },
  },
  en: {
    tour: { eyebrow: "Tour", title: "Travel Products", preview: "City tours and local experiences", tone: "bg-[#fff7df]", iconTone: "bg-[#ffe8a0] text-[#9b7a00]" },
    stay: { eyebrow: "Stay", title: "Accommodation", preview: "Hotels and residences", tone: "bg-[#e9fbf4]", iconTone: "bg-[#b7f0d8] text-[#0a6b48]" },
    restaurant: { eyebrow: "Dining", title: "Restaurant Booking", preview: "Group and course dining", tone: "bg-[#fff2e5]", iconTone: "bg-[#ffd5a8] text-[#9b4800]" },
    cafe: { eyebrow: "Lifestyle", title: "Lifestyle Booking", preview: "Brunch and stylish spaces", tone: "bg-[#f5efff]", iconTone: "bg-[#dcc8ff] text-[#6b3dbf]" },
    ticket: { eyebrow: "Ticket", title: "Ticket Booking", preview: "Performances and exhibitions", tone: "bg-[#eef8f5]", iconTone: "bg-[#a8e8da] text-[#0a6b5a]" },
    airport: { eyebrow: "Airport", title: "Airport Pickup", preview: "Incheon and Gimpo transfers", tone: "bg-[#fff4e9]", iconTone: "bg-[#ffd5b0] text-[#9b5200]" },
  },
};

const categoryOrder: CategoryKey[] = ["tour", "stay", "restaurant", "cafe", "ticket", "airport"];

export default async function ProductPreviewSection({ locale }: { locale: string }) {
  const activeLocale = locale === "en" ? "en" : "ko";
  const copy = copyMap[activeLocale];

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="overflow-hidden rounded-[30px] border border-white/70 bg-[linear-gradient(135deg,_#fff0d7_0%,_#ffe5df_30%,_#eef7ff_68%,_#e7fbf3_100%)] px-5 py-8 shadow-[0_18px_46px_rgba(16,32,58,0.08)] sm:rounded-[36px] sm:px-8 sm:py-10">
        <SectionTitle eyebrow={copy.eyebrow} title={copy.title} desc={copy.desc} />

        {/* 결제방법 */}
        <div className="mt-6 rounded-[20px] border border-white/80 bg-white/75 p-4 sm:p-5">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[#ff7d66]">
            {copy.paymentTitle}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {copy.paymentMethods.map((item) => (
              <span
                key={item}
                className="inline-flex min-h-10 items-center rounded-full border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* 카테고리 카드 - 아이콘 추가 */}
        <div className="mt-5 grid gap-3 sm:mt-6 sm:grid-cols-2 md:grid-cols-3">
          {categoryOrder.map((key) => {
            const item = categoryCopy[activeLocale][key];
            const Icon = categoryIcons[key];
            return (
              <Link
                key={key}
                href={`/products`}
                className={`group flex items-center gap-3.5 rounded-[20px] border border-white/80 px-4 py-4 shadow-[0_6px_16px_rgba(16,32,58,0.05)] transition hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(16,32,58,0.08)] sm:px-5 ${item.tone}`}
              >
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${item.iconTone}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[#ff7d66]">
                    {item.eyebrow}
                  </div>
                  <div className="mt-0.5 text-base font-black tracking-[-0.02em] text-slate-950">
                    {item.title}
                  </div>
                  <div className="mt-0.5 truncate text-xs leading-5 text-slate-500">{item.preview}</div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="text-sm leading-7 text-slate-600 sm:text-[15px]">{copy.note}</div>
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
