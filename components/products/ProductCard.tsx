import {
  ArrowRight,
  CalendarClock,
  Coffee,
  Compass,
  Hotel,
  MapPin,
  Plane,
  Ticket,
  Users,
  UtensilsCrossed,
} from "lucide-react";

import type { Product } from "@/data/products";
import { Link } from "@/lib/navigation";

interface ProductCardProps {
  product: Product;
  locale?: "ko" | "en" | "ja" | "zh-CN" | "zh-TW";
}

type ProductCopy = {
  category: string;
  categorySummary: string;
  tag: string;
  title: string;
  summary: string;
  duration: string;
  people: string;
  location: string;
  subcategories: string[];
  priceLabel: string;
};

const tagIcons: Record<Product["categoryKey"], typeof Compass> = {
  tour: Compass,
  stay: Hotel,
  restaurant: UtensilsCrossed,
  cafe: Coffee,
  ticket: Ticket,
  airport: Plane,
};

const koCopy: Record<string, ProductCopy> = {
  "tour-experience-platform": {
    category: "여행상품",
    categorySummary: "체험상품 포함",
    tag: "투어",
    title: "고양 여행상품예약 플랫폼",
    summary: "공연, 관광, 로컬 체험을 하나의 예약 구조로 연결하는 여행상품 플랫폼입니다.",
    duration: "반일 ~ 1일 코스",
    people: "2명 ~ 80명",
    location: "고양시 전역",
    subcategories: ["시티투어", "로컬 체험", "가족형 코스"],
    priceLabel: "1인 기준 시작가",
  },
  "stay-reservation-platform": {
    category: "숙박예약",
    categorySummary: "객실, 룸블록, VIP 숙박",
    tag: "스테이",
    title: "고양 숙박예약 운영 플랫폼",
    summary: "KINTEX와 공연장, 관광 거점이 있는 숙박 예약과 체류 운영을 함께 관리합니다.",
    duration: "1박 ~ 장기 체류",
    people: "1명 ~ 300명",
    location: "KINTEX 권역 및 고양 주요 숙소",
    subcategories: ["호텔", "레지던스", "단체 숙소"],
    priceLabel: "객실 기준 시작가",
  },
  "restaurant-booking-platform": {
    category: "음식점예약",
    categorySummary: "단체식, 코스, VIP 만찬",
    tag: "다이닝",
    title: "고양 음식점예약 플랫폼",
    summary: "단체 식사와 지역 미식 경험을 연결하는 다이닝 예약 플랫폼입니다.",
    duration: "1시간 ~ 3시간",
    people: "2명 ~ 200명",
    location: "고양 주요 음식점 및 관광특구 상권",
    subcategories: ["단체 식사", "코스 다이닝", "VIP 만찬"],
    priceLabel: "1인 기준 시작가",
  },
  "cafe-booking-platform": {
    category: "라이프스타일 예약",
    categorySummary: "브런치, 디저트, 미팅 공간",
    tag: "라이프스타일",
    title: "라이프스타일 예약 플랫폼",
    summary: "브런치, 카페, 로컬 공간 경험을 연결하는 라이프스타일 예약 플랫폼입니다.",
    duration: "1시간 ~ 반일",
    people: "2명 ~ 60명",
    location: "고양 로컬 카페 및 라이프스타일 공간",
    subcategories: ["브런치", "디저트", "미팅 공간"],
    priceLabel: "1인 기준 시작가",
  },
  "ticket-agency-platform": {
    category: "티켓예약",
    categorySummary: "공연, 전시, 체험",
    tag: "티켓",
    title: "고양 티켓예약 플랫폼",
    summary: "공연, 전시, 체험 프로그램 티켓을 한 번에 연결하는 예약 플랫폼입니다.",
    duration: "회차별 운영",
    people: "1명 ~ 500명",
    location: "공연장 및 전시 공간",
    subcategories: ["공연", "전시", "체험"],
    priceLabel: "티켓 기준 시작가",
  },
  "airport-pickup-platform": {
    category: "공항픽업예약",
    categorySummary: "인천, 김포, VIP 이동",
    tag: "공항",
    title: "공항픽업예약 플랫폼",
    summary: "공항 픽업부터 호텔, 행사장, 시내 이동까지 연결하는 예약 플랫폼입니다.",
    duration: "노선별 운영",
    people: "1명 ~ 9명",
    location: "인천공항 / 김포공항 ~ 고양",
    subcategories: ["인천 픽업", "인천 샌딩", "김포 픽업"],
    priceLabel: "차량 기준 시작가",
  },
};

const enCopy: Record<string, ProductCopy> = {
  "tour-experience-platform": {
    category: "Travel Products",
    categorySummary: "Experience included",
    tag: "Tour",
    title: "Goyang Travel Products Platform",
    summary: "A travel booking platform connecting performances, tourism and local experiences.",
    duration: "Half day to one-day course",
    people: "2 to 80 guests",
    location: "Across Goyang",
    subcategories: ["City Tour", "Local Experience", "Family Course"],
    priceLabel: "Starting price per person",
  },
  "stay-reservation-platform": {
    category: "Accommodation",
    categorySummary: "Room blocks and VIP stay",
    tag: "Stay",
    title: "Goyang Stay Reservation Platform",
    summary: "A stay platform linking KINTEX, venues and tourism hubs in one operational flow.",
    duration: "1 night to long stay",
    people: "1 to 300 guests",
    location: "KINTEX zone and major stays in Goyang",
    subcategories: ["Hotel", "Residence", "Group Stay"],
    priceLabel: "Starting room rate",
  },
  "restaurant-booking-platform": {
    category: "Restaurant Booking",
    categorySummary: "Group, course and VIP dinner",
    tag: "Dining",
    title: "Goyang Restaurant Booking Platform",
    summary: "A dining reservation platform connecting group meals and local culinary experiences.",
    duration: "1 to 3 hours",
    people: "2 to 200 guests",
    location: "Major restaurants and tourism districts",
    subcategories: ["Group Dining", "Course Dining", "VIP Dinner"],
    priceLabel: "Starting price per person",
  },
  "cafe-booking-platform": {
    category: "Lifestyle Booking",
    categorySummary: "Brunch, dessert and meeting space",
    tag: "Lifestyle",
    title: "Lifestyle Reservation Platform",
    summary: "A lifestyle booking platform for brunch cafés, local spaces and relaxed meetings.",
    duration: "1 hour to half day",
    people: "2 to 60 guests",
    location: "Local cafés and lifestyle venues",
    subcategories: ["Brunch", "Dessert", "Meeting Space"],
    priceLabel: "Starting price per person",
  },
  "ticket-agency-platform": {
    category: "Ticket Booking",
    categorySummary: "Performance, exhibition and activity",
    tag: "Ticket",
    title: "Goyang Ticket Booking Platform",
    summary: "A connected ticket structure for performances, exhibitions and experience programs.",
    duration: "By session",
    people: "1 to 500 guests",
    location: "Performance venues and exhibition halls",
    subcategories: ["Performance", "Exhibition", "Activity"],
    priceLabel: "Starting ticket price",
  },
  "airport-pickup-platform": {
    category: "Airport Pickup",
    categorySummary: "ICN, GMP and VIP transfer",
    tag: "Airport",
    title: "Airport Pickup Reservation Platform",
    summary: "A transfer booking platform linking airport arrival, hotels, venues and city movement.",
    duration: "By route",
    people: "1 to 9 guests",
    location: "Incheon / Gimpo Airport to Goyang",
    subcategories: ["ICN Pickup", "ICN Sending", "GMP Pickup"],
    priceLabel: "Starting fare",
  },
};

const buttonCopy = {
  ko: { details: "상세 보기", reserve: "예약하기" },
  en: { details: "View details", reserve: "Reserve" },
};

export default function ProductCard({ product, locale = "ko" }: ProductCardProps) {
  const activeLocale = locale === "en" ? "en" : "ko";
  const copySet = activeLocale === "en" ? enCopy : koCopy;
  const display = copySet[product.id] ?? {
    category: product.category,
    categorySummary: product.categorySummary,
    tag: product.tag,
    title: product.title,
    summary: product.summary,
    duration: product.duration,
    people: product.people,
    location: product.location,
    subcategories: product.subcategories.slice(0, 3),
    priceLabel: product.priceLabel,
  };
  const ui = buttonCopy[activeLocale];
  const Icon = tagIcons[product.categoryKey];

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_12px_32px_rgba(16,32,58,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_48px_rgba(16,32,58,0.12)]">
      <div className="relative flex min-h-[14.5rem] flex-col overflow-hidden border-b border-slate-200 bg-[linear-gradient(140deg,_#13254a_0%,_#284fb0_42%,_#7fd5ec_100%)] p-5 text-white sm:min-h-[15.5rem] sm:p-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_26%)]" />
        <div className="absolute -bottom-16 -left-10 h-32 w-32 rounded-full bg-white/12 blur-3xl" />

        <div className="relative flex items-start justify-between gap-3">
          <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-50">
            {product.badge}
          </span>
          <span className="inline-flex items-center gap-1.5 pt-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/82">
            <Icon className="h-3.5 w-3.5" />
            {display.tag}
          </span>
        </div>

        <h3 className="relative mt-5 min-h-[3rem] text-[1.45rem] font-black leading-[1.08] tracking-[-0.05em] text-white sm:text-[1.75rem]">
          {display.title}
        </h3>
        <p className="relative mt-4 line-clamp-3 text-[15px] leading-7 text-slate-50/94 sm:text-base">
          {display.summary}
        </p>
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex min-h-[3rem] items-start justify-between gap-3">
          <span className="inline-flex rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700">
            {display.category}
          </span>
          <span className="text-right text-[13px] font-semibold leading-6 text-slate-500">
            {display.categorySummary}
          </span>
        </div>

        <div className="mt-5 grid gap-3 rounded-[24px] border border-slate-100 bg-slate-50/80 p-4 text-[15px] text-slate-700">
          <div className="flex items-center gap-2.5">
            <CalendarClock className="h-4.5 w-4.5 shrink-0 text-sky-700" />
            <span>{display.duration}</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Users className="h-4.5 w-4.5 shrink-0 text-sky-700" />
            <span>{display.people}</span>
          </div>
          <div className="flex items-center gap-2.5">
            <MapPin className="h-4.5 w-4.5 shrink-0 text-sky-700" />
            <span>{display.location}</span>
          </div>
        </div>

        <div className="mt-5 min-h-[2.9rem]">
          <div className="flex flex-wrap gap-2">
            {display.subcategories.slice(0, 3).map((item) => (
              <span
                key={item}
                className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-600"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-6 rounded-[24px] border border-slate-100 bg-[linear-gradient(180deg,_#ffffff_0%,_#f8fafc_100%)] px-5 py-4">
          <div className="text-xs font-semibold tracking-[0.18em] text-slate-500">
            {display.priceLabel}
          </div>
          <div className="mt-2 text-[1.9rem] font-black tracking-[-0.04em] text-slate-950 sm:text-[2.1rem]">
            ₩{product.price.toLocaleString("ko-KR")}
          </div>
        </div>

        <div className="mt-auto pt-6">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Link
              href={`/products/${product.id}`}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              {ui.details}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href={`/products/${product.id}/reservation`}
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
            >
              {ui.reserve}
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
