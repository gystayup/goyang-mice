import type { Metadata } from "next";

import Shell from "@/components/layout/Shell";
import SectionedBookingGrid, { type UnifiedItem } from "@/components/products/SectionedBookingGrid";
import type { ServiceCatalogCategory } from "@/data/service-catalog";
import { readServiceCatalog } from "@/lib/service-catalog-db";
import { getLocalizedServiceItem } from "@/lib/service-catalog-i18n";
import { readTicketCatalog } from "@/lib/ticket-catalog-db";

export type PageLocale = "ko" | "en" | "ja" | "zh-CN" | "zh-TW";

// 관리자에서 상품/이미지 업데이트 시 즉시 반영되도록 캐시 비활성화
export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "서비스 예약",
  description:
    "고양의 여행상품, 숙박, 음식점, 라이프스타일, 티켓, 공항픽업 예약 서비스를 한 곳에서 확인해보세요.",
  alternates: { canonical: "/ko/products" },
};

// 카테고리 → 예약 페이지 product ID 매핑
const CATEGORY_PRODUCT_IDS: Record<ServiceCatalogCategory, string> = {
  tour: "tour-experience-platform",
  stay: "stay-reservation-platform",
  restaurant: "restaurant-booking-platform",
  cafe: "cafe-booking-platform",
};

const CATEGORY_LABELS_MAP: Record<
  PageLocale,
  Record<ServiceCatalogCategory | "ticket" | "airport", string>
> = {
  ko: {
    tour: "투어",
    stay: "숙박",
    restaurant: "음식점",
    cafe: "라이프스타일",
    ticket: "티켓",
    airport: "공항픽업",
  },
  en: {
    tour: "Tour",
    stay: "Stay",
    restaurant: "Dining",
    cafe: "Lifestyle",
    ticket: "Ticket",
    airport: "Airport",
  },
  ja: {
    tour: "ツアー",
    stay: "宿泊",
    restaurant: "飲食",
    cafe: "ライフスタイル",
    ticket: "チケット",
    airport: "空港送迎",
  },
  "zh-CN": {
    tour: "旅游",
    stay: "住宿",
    restaurant: "餐厅",
    cafe: "生活方式",
    ticket: "票务",
    airport: "机场接送",
  },
  "zh-TW": {
    tour: "旅遊",
    stay: "住宿",
    restaurant: "餐廳",
    cafe: "生活風格",
    ticket: "票務",
    airport: "機場接送",
  },
};

export default async function ProductsPage({ locale = "ko" }: { locale?: PageLocale }) {
  // DB에서 전체 카탈로그 병렬 로드
  const [catalog, tickets] = await Promise.all([
    readServiceCatalog().catch(() => ({
      tour: [],
      stay: [],
      restaurant: [],
      cafe: [],
    })),
    readTicketCatalog().catch(() => []),
  ]);

  const CATEGORY_LABELS = CATEGORY_LABELS_MAP[locale];
  const items: UnifiedItem[] = [];

  // 서비스 카탈로그 아이템 (투어/숙박/음식점/라이프스타일) — locale 적용
  for (const [cat, catItems] of Object.entries(catalog)) {
    const category = cat as ServiceCatalogCategory;
    const productId = CATEGORY_PRODUCT_IDS[category];
    for (const rawItem of catItems) {
      const item = getLocalizedServiceItem(rawItem, locale);
      items.push({
        id: `${category}-${item.id}`,
        category,
        categoryLabel: CATEGORY_LABELS[category],
        title: item.title,
        venue: item.location,
        dateText: item.dateText,
        imageUrl: item.imageUrl,
        imageTone: item.imageTone,
        posterLabel: item.posterLabel,
        badge: item.subtitle || undefined,
        minPrice: item.price,
        originalPrice: item.originalPrice,
        discountLabel: item.discountLabel,
        tags: item.tags,
        reservationUrl: `/products/${productId}/detail?item=${item.id}`,
      });
    }
  }

  // 티켓 아이템
  for (const ticket of tickets) {
    const minPrice =
      ticket.options.length > 0
        ? Math.min(...ticket.options.map((o) => o.price))
        : 0;
    items.push({
      id: `ticket-${ticket.id}`,
      category: "ticket",
      categoryLabel: CATEGORY_LABELS.ticket,
      title: ticket.title,
      venue: ticket.venue,
      dateText: ticket.dateText,
      imageUrl: ticket.imageUrl,
      imageTone: ticket.imageTone,
      posterLabel: ticket.posterLabel,
      badge: ticket.badge || undefined,
      minPrice,
      tags: ticket.tags,
      reservationUrl: `/products/ticket-agency-platform/detail?ticket=${ticket.id}`,
    });
  }

  // 공항픽업 (단일 항목) — locale 적용
  const airportCopy: Record<
    PageLocale,
    { title: string; venue: string; dateText: string; tags: string[] }
  > = {
    ko: {
      title: "공항픽업·샌딩 예약",
      venue: "인천공항 · 김포공항",
      dateText: "365일 · 24시간 운영",
      tags: ["인천공항", "김포공항", "VIP 이동"],
    },
    en: {
      title: "Airport Pickup & Sendoff Booking",
      venue: "Incheon · Gimpo Airport",
      dateText: "365 days · 24h operation",
      tags: ["Incheon Airport", "Gimpo Airport", "VIP Transfer"],
    },
    ja: {
      title: "空港ピックアップ・送迎予約",
      venue: "仁川空港 · 金浦空港",
      dateText: "365日 · 24時間運営",
      tags: ["仁川空港", "金浦空港", "VIP送迎"],
    },
    "zh-CN": {
      title: "机场接送预约",
      venue: "仁川机场 · 金浦机场",
      dateText: "全年 · 24小时运营",
      tags: ["仁川机场", "金浦机场", "VIP接送"],
    },
    "zh-TW": {
      title: "機場接送預約",
      venue: "仁川機場 · 金浦機場",
      dateText: "全年 · 24小時運營",
      tags: ["仁川機場", "金浦機場", "VIP接送"],
    },
  };
  const ac = airportCopy[locale];
  items.push({
    id: "airport-general",
    category: "airport",
    categoryLabel: CATEGORY_LABELS.airport,
    title: ac.title,
    venue: ac.venue,
    dateText: ac.dateText,
    imageTone: "from-slate-800 via-slate-700 to-sky-900",
    posterLabel: "AIRPORT",
    badge: CATEGORY_LABELS.airport,
    minPrice: 0,
    tags: ac.tags,
    reservationUrl: `/products/airport-pickup-platform/reservation`,
  });

  const titleMap: Record<PageLocale, string> = {
    ko: "서비스 예약",
    en: "Booking Services",
    ja: "サービス予約",
    "zh-CN": "服务预约",
    "zh-TW": "服務預約",
  };
  const descMap: Record<PageLocale, string> = {
    ko: "투어, 숙박, 음식점, 라이프스타일, 티켓, 공항픽업을 한 곳에서 예약하세요.",
    en: "Book tours, stays, dining, lifestyle, tickets, and airport pickup all in one place.",
    ja: "ツアー、宿泊、飲食店、ライフスタイル、チケット、空港送迎をまとめて予約。",
    "zh-CN": "在一处预约旅游、住宿、餐厅、生活方式、票务及机场接送。",
    "zh-TW": "在一處預約旅遊、住宿、餐廳、生活風格、票務及機場接送。",
  };

  return (
    <Shell>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        {/* 페이지 헤더 */}
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">
            DMC Services
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            {titleMap[locale]}
          </h1>
          <p className="mt-2 text-sm leading-7 text-slate-500">{descMap[locale]}</p>
        </div>

        <SectionedBookingGrid items={items} />
      </div>
    </Shell>
  );
}
