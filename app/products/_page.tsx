import type { Metadata } from "next";

import Shell from "@/components/layout/Shell";
import SectionedBookingGrid, { type UnifiedItem } from "@/components/products/SectionedBookingGrid";
import type { ServiceCatalogCategory } from "@/data/service-catalog";
import { readServiceCatalog } from "@/lib/service-catalog-db";
import { getLocalizedServiceItem } from "@/lib/service-catalog-i18n";
import { readTicketCatalog } from "@/lib/ticket-catalog-db";

// 티켓 장소명 번역 맵 — DB/static 무관하게 ID로 직접 적용
type TLocale = "en" | "ja" | "zh-CN" | "zh-TW";
const TICKET_VENUE: Record<string, Partial<Record<TLocale, string>>> = {
  "goyang-kpop-arena-open":   { en: "Goyang K-POP Arena", ja: "高陽K-POPアリーナ", "zh-CN": "高阳K-POP竞技场", "zh-TW": "高陽K-POP競技場" },
  "goyang-con-city-festival": { en: "Ilsan Cultural Plaza", ja: "一山文化広場", "zh-CN": "一山文化广场", "zh-TW": "一山文化廣場" },
  "goyang-art-night":         { en: "Goyang Aramnuri Exhibition Hall", ja: "高陽アラムヌリ展示館", "zh-CN": "高阳阿拉木努里展览馆", "zh-TW": "高陽阿拉木努里展覽館" },
  "goyang-family-play":       { en: "Goyang Eoullim Nuri", ja: "高陽オウルリムヌリ", "zh-CN": "高阳欧拉利姆努里", "zh-TW": "高陽歐拉利姆努里" },
  "goyang-kmusic-series":     { en: "Goyang Aramnuri Aram Theater", ja: "高陽アラムヌリ アラム劇場", "zh-CN": "高阳阿拉木努里剧场", "zh-TW": "高陽阿拉木努里劇場" },
  "goyang-mice-opening-show": { en: "KINTEX Outdoor Stage", ja: "KINTEX野外ステージ", "zh-CN": "KINTEX户外舞台", "zh-TW": "KINTEX戶外舞台" },
  "goyang-local-stage":       { en: "Ilsan Lake Park Outdoor Stage", ja: "一山湖水公園野外ステージ", "zh-CN": "一山湖水公园户外舞台", "zh-TW": "一山湖水公園戶外舞台" },
  "goyang-night-run-ticket":  { en: "Goyang Stadium", ja: "高陽総合運動場", "zh-CN": "高阳综合运动场", "zh-TW": "高陽綜合運動場" },
};
const TICKET_BADGE: Record<string, Partial<Record<TLocale, string>>> = {
  "goyang-kpop-arena-open":   { en: "Coming Soon", ja: "近日オープン", "zh-CN": "即将开放", "zh-TW": "即將開放" },
  "goyang-con-city-festival": { en: "2nd Ticket Sale", ja: "第2次チケット販売", "zh-CN": "第二轮票务开放", "zh-TW": "第二輪票務開放" },
  "goyang-art-night":         { en: "Extra Seats Available", ja: "追加席販売中", "zh-CN": "增开座位", "zh-TW": "增開座位" },
  "goyang-family-play":       { en: "Family Pick", ja: "ファミリー向け", "zh-CN": "家庭推荐", "zh-TW": "家庭推薦" },
  "goyang-kmusic-series":     { en: "Limited Offer", ja: "限定特価", "zh-CN": "限时特惠", "zh-TW": "限時特惠" },
  "goyang-mice-opening-show": { en: "Coming Soon", ja: "近日オープン", "zh-CN": "即将开放", "zh-TW": "即將開放" },
  "goyang-local-stage":       { en: "On Sale Now", ja: "本日オープン", "zh-CN": "今日开售", "zh-TW": "今日開售" },
  "goyang-night-run-ticket":  { en: "Tickets Available", ja: "チケット販売中", "zh-CN": "票务开放", "zh-TW": "票務開放" },
};

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
  airport: "airport-pickup-platform",
};

const CATEGORY_LABELS_MAP: Record<
  PageLocale,
  Record<ServiceCatalogCategory | "ticket", string>
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
      airport: [],
    })),
    readTicketCatalog().catch(() => []),
  ]);

  const CATEGORY_LABELS = CATEGORY_LABELS_MAP[locale];
  const items: UnifiedItem[] = [];

  // 서비스 카탈로그 아이템 (투어/숙박/음식점/라이프스타일/공항픽업) — locale 적용
  for (const [cat, catItems] of Object.entries(catalog)) {
    const category = cat as ServiceCatalogCategory;
    const productId = CATEGORY_PRODUCT_IDS[category];
    for (const rawItem of catItems) {
      const item = getLocalizedServiceItem(rawItem, locale);
      // 공항픽업은 상세페이지 없이 예약 폼으로 직접 이동
      const reservationUrl =
        category === "airport"
          ? `/products/${productId}/reservation`
          : `/products/${productId}/detail?item=${item.id}`;
      const minPrice =
        item.options && item.options.length > 0
          ? Math.min(...item.options.map((o) => o.price))
          : item.price;
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
        minPrice,
        originalPrice: item.originalPrice,
        discountLabel: item.discountLabel,
        tags: item.tags,
        reservationUrl,
      });
    }
  }

  // 티켓 아이템 — locale별 번역 직접 맵에서 적용
  for (const ticket of tickets) {
    const minPrice =
      ticket.options.length > 0
        ? Math.min(...ticket.options.map((o) => o.price))
        : 0;
    const tLocale = locale as TLocale;
    const localizedVenue =
      locale !== "ko" ? (TICKET_VENUE[ticket.id]?.[tLocale] ?? ticket.venue) : ticket.venue;
    const localizedBadge =
      locale !== "ko" ? (TICKET_BADGE[ticket.id]?.[tLocale] ?? ticket.badge) : ticket.badge;
    items.push({
      id: `ticket-${ticket.id}`,
      category: "ticket",
      categoryLabel: CATEGORY_LABELS.ticket,
      title: ticket.title,
      venue: localizedVenue,
      dateText: ticket.dateText,
      imageUrl: ticket.imageUrl,
      imageTone: ticket.imageTone,
      posterLabel: ticket.posterLabel,
      badge: localizedBadge || undefined,
      minPrice,
      tags: ticket.tags,
      reservationUrl: `/products/ticket-agency-platform/detail?ticket=${ticket.id}`,
    });
  }

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
