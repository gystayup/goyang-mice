"use client";

import Image from "next/image";
import { useLocale } from "next-intl";
import { MapPinned, CalendarDays, ChevronRight } from "lucide-react";

import { Link } from "@/lib/navigation";
import type { UnifiedItem, ItemCategory } from "./UnifiedBookingGrid";

// Re-export types for convenience
export type { UnifiedItem, ItemCategory };

// ─── Category metadata ────────────────────────────────────────────────────────

interface CategoryMeta {
  key: ItemCategory;
  emoji: string;
  label: string;
  /** URL to the "전체보기" list page for this category */
  allHref: string;
  /** Card aspect ratio: portrait cards for ticket/tour, landscape for the rest */
  portrait: boolean;
}

type SupportedLocale = "ko" | "en" | "ja" | "zh-CN" | "zh-TW";

const CATEGORY_LABELS: Record<ItemCategory, Record<SupportedLocale, string>> = {
  tour: { ko: "투어", en: "Tour", ja: "ツアー", "zh-CN": "旅游", "zh-TW": "旅遊" },
  stay: { ko: "숙박", en: "Stay", ja: "宿泊", "zh-CN": "住宿", "zh-TW": "住宿" },
  restaurant: { ko: "음식점", en: "Dining", ja: "飲食", "zh-CN": "餐厅", "zh-TW": "餐廳" },
  cafe: { ko: "라이프스타일", en: "Lifestyle", ja: "ライフスタイル", "zh-CN": "生活方式", "zh-TW": "生活風格" },
  ticket: { ko: "티켓", en: "Ticket", ja: "チケット", "zh-CN": "票务", "zh-TW": "票務" },
  airport: { ko: "공항픽업", en: "Airport", ja: "空港送迎", "zh-CN": "机场接送", "zh-TW": "機場接送" },
  medical: { ko: "메디컬", en: "Medical", ja: "メディカル", "zh-CN": "医疗", "zh-TW": "醫療" },
};

const SEE_ALL_LABEL: Record<SupportedLocale, string> = {
  ko: "전체보기",
  en: "See all",
  ja: "すべて見る",
  "zh-CN": "查看全部",
  "zh-TW": "查看全部",
};

const NO_ITEMS_LABEL: Record<SupportedLocale, string> = {
  ko: "등록된 상품이 없습니다.",
  en: "No products available.",
  ja: "登録された商品がありません。",
  "zh-CN": "暂无商品。",
  "zh-TW": "暫無商品。",
};

const BOOKING_INQUIRY_LABEL: Record<SupportedLocale, string> = {
  ko: "예약 문의",
  en: "Inquire for Booking",
  ja: "予約お問い合わせ",
  "zh-CN": "预约咨询",
  "zh-TW": "預約諮詢",
};

// locale별 통화·"~" 상응 표현
const FROM_PREFIX: Record<SupportedLocale, { prefix: string; suffix: string }> = {
  ko: { prefix: "", suffix: "원~" },
  en: { prefix: "from ₩", suffix: "" },
  ja: { prefix: "₩", suffix: "〜" },
  "zh-CN": { prefix: "₩", suffix: " 起" },
  "zh-TW": { prefix: "₩", suffix: " 起" },
};

function formatPrice(amount: number, locale: SupportedLocale, withFrom: boolean): string {
  const localeCode =
    locale === "ko" ? "ko-KR" :
    locale === "ja" ? "ja-JP" :
    locale === "zh-CN" ? "zh-CN" :
    locale === "zh-TW" ? "zh-TW" :
    "en-US";
  const num = amount.toLocaleString(localeCode);
  if (!withFrom) return num;
  const { prefix, suffix } = FROM_PREFIX[locale];
  return `${prefix}${num}${suffix}`;
}

function getCategories(locale: SupportedLocale): CategoryMeta[] {
  return [
    { key: "tour",       emoji: "🗺️", label: CATEGORY_LABELS.tour[locale],       allHref: "/products?cat=tour",       portrait: false },
    { key: "stay",       emoji: "🏨", label: CATEGORY_LABELS.stay[locale],       allHref: "/products?cat=stay",       portrait: false },
    { key: "restaurant", emoji: "🍽️", label: CATEGORY_LABELS.restaurant[locale], allHref: "/products?cat=restaurant", portrait: false },
    { key: "cafe",       emoji: "☕", label: CATEGORY_LABELS.cafe[locale],       allHref: "/products?cat=cafe",       portrait: false },
    { key: "ticket",     emoji: "🎫", label: CATEGORY_LABELS.ticket[locale],     allHref: "/products?cat=ticket",     portrait: false },
    { key: "airport",    emoji: "✈️", label: CATEGORY_LABELS.airport[locale],    allHref: "/products?cat=airport",    portrait: false },
    { key: "medical",    emoji: "🩺", label: CATEGORY_LABELS.medical[locale],    allHref: "/products?cat=medical",    portrait: false },
  ];
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function SectionedBookingGrid({ items }: { items: UnifiedItem[] }) {
  const locale = useLocale();
  const activeLocale: SupportedLocale = (
    ["ko", "en", "ja", "zh-CN", "zh-TW"].includes(locale) ? locale : "ko"
  ) as SupportedLocale;

  const categories = getCategories(activeLocale);

  // Group items by category, preserving CATEGORIES order
  const grouped: Map<ItemCategory, UnifiedItem[]> = new Map();
  for (const cat of categories) {
    const catItems = items.filter((i) => i.category === cat.key);
    if (catItems.length > 0) grouped.set(cat.key, catItems);
  }

  const activeCats = categories.filter((c) => grouped.has(c.key));

  if (activeCats.length === 0) {
    return (
      <div className="py-20 text-center text-sm text-slate-400">
        {NO_ITEMS_LABEL[activeLocale]}
      </div>
    );
  }

  return (
    <div>
      {/* ── Category quick-nav bar ── */}
      <QuickNav categories={activeCats} />

      {/* ── Category sections ── */}
      <div className="mt-6 space-y-12">
        {activeCats.map((cat) => (
          <CategorySection
            key={cat.key}
            meta={cat}
            items={grouped.get(cat.key)!}
            seeAllLabel={SEE_ALL_LABEL[activeLocale]}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Quick-nav bar ────────────────────────────────────────────────────────────

function QuickNav({ categories }: { categories: CategoryMeta[] }) {
  const scrollToSection = (key: ItemCategory) => {
    const el = document.getElementById(`section-${key}`);
    if (!el) return;
    const offset = 72; // height of the sticky nav itself
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <div className="sticky top-0 z-20 -mx-4 border-b border-slate-100 bg-white/85 px-4 py-3 shadow-sm backdrop-blur-md sm:-mx-6 sm:px-6">
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.key}
            type="button"
            onClick={() => scrollToSection(cat.key)}
            className="flex shrink-0 items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-sky-400 hover:text-sky-600 active:scale-95"
          >
            <span>{cat.emoji}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Category section ─────────────────────────────────────────────────────────

function CategorySection({
  meta,
  items,
  seeAllLabel,
}: {
  meta: CategoryMeta;
  items: UnifiedItem[];
  seeAllLabel: string;
}) {
  return (
    <section id={`section-${meta.key}`} className="scroll-mt-20">
      {/* Section header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">{meta.emoji}</span>
          <h2 className="text-lg font-black tracking-tight text-slate-950">
            {meta.label}
          </h2>
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-500">
            {items.length}
          </span>
        </div>
        <Link
          href={meta.allHref}
          className="flex items-center gap-0.5 text-xs font-semibold text-sky-600 hover:text-sky-700"
        >
          {seeAllLabel}
          <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* 4열 그리드 */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {items.slice(0, 4).map((item) => (
          <ItemCard key={item.id} item={item} portrait={meta.portrait} />
        ))}
      </div>
    </section>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────

function ItemCard({ item, portrait }: { item: UnifiedItem; portrait: boolean }) {
  const locale = useLocale();
  const activeLocale: SupportedLocale = (
    ["ko", "en", "ja", "zh-CN", "zh-TW"].includes(locale) ? locale : "ko"
  ) as SupportedLocale;
  const aspectClass = portrait ? "aspect-[2/3]" : "aspect-[3/2]";

  return (
    <Link href={item.reservationUrl} className="block h-full">
      {/* h-full → 같은 행 카드끼리 CSS Grid가 자동으로 높이를 맞춰줌 */}
      <article className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
        {/* ── Image / gradient area ── */}
        <div className={`relative ${aspectClass} shrink-0 overflow-hidden`}>
          {item.imageUrl ? (
            <>
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                className="object-cover object-center transition duration-300 group-hover:scale-105"
                sizes="(max-width:640px) 48vw, 300px"
              />
              {/* Gradient overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
              {/* Title overlay */}
              <div className="absolute bottom-3 left-3 right-3">
                <p className="line-clamp-2 text-sm font-black leading-snug text-white drop-shadow">
                  {item.title}
                </p>
              </div>
            </>
          ) : (
            /* Gradient placeholder */
            <div
              className={`flex h-full w-full flex-col justify-end bg-gradient-to-br ${item.imageTone} p-4`}
            >
              <p className="line-clamp-1 text-xl font-black tracking-tight text-slate-900">
                {item.posterLabel}
              </p>
              <p className="mt-1 line-clamp-2 text-sm font-bold leading-snug text-slate-800">
                {item.title}
              </p>
            </div>
          )}

          {/* Category badge — top-left */}
          <div className="absolute left-2 top-2">
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                item.imageUrl
                  ? "bg-black/70 text-white backdrop-blur-sm"
                  : "bg-white/80 text-slate-700 shadow-sm"
              }`}
            >
              {item.categoryLabel}
            </span>
          </div>

          {/* Discount badge — top-right */}
          {item.discountLabel && (
            <div className="absolute right-2 top-2">
              <span className="rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-black text-white shadow">
                {item.discountLabel}
              </span>
            </div>
          )}
        </div>

        {/* ── Info area: flex-1로 늘어나고, 가격은 항상 맨 아래 고정 ── */}
        <div className="flex flex-1 flex-col p-3">
          {/* 제목 + 장소/날짜 — flex-1로 공간을 차지 */}
          <div className="flex-1">
            <h3 className="line-clamp-2 text-sm font-bold leading-snug text-slate-950 sm:text-[13px]">
              {item.title}
            </h3>
            <div className="mt-1.5 space-y-0.5 text-xs text-slate-500 sm:text-[11px]">
              <div className="flex items-center gap-1">
                <MapPinned className="h-3 w-3 shrink-0" />
                <span className="truncate" title={item.venue}>{item.venue}</span>
              </div>
              <div className="flex items-center gap-1">
                <CalendarDays className="h-3 w-3 shrink-0" />
                <span className="truncate" title={item.dateText}>{item.dateText}</span>
              </div>
            </div>
          </div>
          {/* 가격 — 항상 하단에 붙음 */}
          <div className="mt-2 flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5 border-t border-slate-100 pt-2">
            {item.originalPrice ? (
              <span className="text-[11px] text-slate-400 line-through">
                {formatPrice(item.originalPrice, activeLocale, false)}
              </span>
            ) : null}
            {item.minPrice > 0 ? (
              <span className="text-sm font-black text-slate-950 sm:text-[13px]">
                {formatPrice(item.minPrice, activeLocale, true)}
              </span>
            ) : (
              <span className="text-sm font-bold text-sky-600 sm:text-[13px]">{BOOKING_INQUIRY_LABEL[activeLocale]}</span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
