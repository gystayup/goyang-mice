"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { CalendarDays, MapPinned } from "lucide-react";

import { Link } from "@/lib/navigation";

export type ItemCategory =
  | "tour"
  | "stay"
  | "restaurant"
  | "cafe"
  | "ticket"
  | "airport"
  | "medical";

export interface UnifiedItem {
  id: string;
  category: ItemCategory;
  categoryLabel: string;
  title: string;
  venue: string;
  dateText: string;
  imageUrl?: string;
  imageTone: string;
  posterLabel: string;
  badge?: string;
  minPrice: number;
  originalPrice?: number;
  discountLabel?: string;
  tags: string[];
  reservationUrl: string;
}

const CATEGORY_TABS: { key: ItemCategory | "all"; label: string }[] = [
  { key: "all", label: "전체" },
  { key: "tour", label: "투어" },
  { key: "stay", label: "숙박" },
  { key: "restaurant", label: "음식점" },
  { key: "cafe", label: "라이프스타일" },
  { key: "ticket", label: "티켓" },
  { key: "airport", label: "공항픽업" },
  { key: "medical", label: "메디컬" },
];

export default function UnifiedBookingGrid({ items }: { items: UnifiedItem[] }) {
  const [active, setActive] = useState<ItemCategory | "all">("all");

  const filtered = useMemo(() => {
    if (active === "all") return items;
    return items.filter((i) => i.category === active);
  }, [items, active]);

  const countByCategory = useMemo(() => {
    const map: Partial<Record<ItemCategory, number>> = {};
    for (const item of items) {
      map[item.category] = (map[item.category] ?? 0) + 1;
    }
    return map;
  }, [items]);

  return (
    <div>
      {/* ── 카테고리 탭 ── */}
      <div className="flex flex-wrap gap-2">
        {CATEGORY_TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActive(tab.key)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              active === tab.key
                ? "bg-slate-950 text-white"
                : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            {tab.label}
            {tab.key !== "all" && (
              <span className="ml-1.5 text-[11px] opacity-50">
                ({countByCategory[tab.key as ItemCategory] ?? 0})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── 상품 그리드 ── */}
      {filtered.length === 0 ? (
        <div className="mt-16 py-20 text-center text-sm text-slate-400">
          등록된 상품이 없습니다.
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
          {filtered.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

function ItemCard({ item }: { item: UnifiedItem }) {
  return (
    <Link href={item.reservationUrl}>
      <article className="group cursor-pointer overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
        {/* 포스터 영역 */}
        <div className="relative aspect-[2/3] overflow-hidden">
          {item.imageUrl ? (
            <>
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                className="object-cover object-top transition duration-300 group-hover:scale-105"
                sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, (max-width:1280px) 25vw, 20vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                {item.badge && (
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-white/70">
                    {item.badge}
                  </p>
                )}
                <p className="mt-0.5 text-sm font-black leading-snug text-white line-clamp-2">
                  {item.title}
                </p>
              </div>
            </>
          ) : (
            <div
              className={`flex h-full w-full flex-col justify-end bg-gradient-to-br ${item.imageTone} p-4`}
            >
              {item.badge && (
                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                  {item.badge}
                </p>
              )}
              <p className="mt-1 text-2xl font-black tracking-tight text-slate-900 line-clamp-1">
                {item.posterLabel}
              </p>
              <p className="mt-1 text-sm font-black leading-snug text-slate-800 line-clamp-2">
                {item.title}
              </p>
            </div>
          )}
          {/* 카테고리 배지 */}
          <div className="absolute left-2 top-2">
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                item.imageUrl
                  ? "bg-black/50 text-white backdrop-blur-sm"
                  : "bg-white/70 text-slate-700"
              }`}
            >
              {item.categoryLabel}
            </span>
          </div>
          {/* 할인 배지 — 티켓 카테고리에서만 (오더 #P4) */}
          {item.category === "ticket" && item.discountLabel && (
            <div className="absolute right-2 top-2">
              <span className="rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-black text-white">
                {item.discountLabel}
              </span>
            </div>
          )}
        </div>

        {/* 정보 영역 */}
        <div className="p-3">
          <h3 className="line-clamp-2 text-sm font-bold leading-snug text-slate-950">
            {item.title}
          </h3>
          <div className="mt-1.5 space-y-0.5 text-[11px] text-slate-400">
            <div className="flex items-center gap-1">
              <MapPinned className="h-3 w-3 shrink-0" />
              <span className="truncate">{item.venue}</span>
            </div>
            <div className="flex items-center gap-1">
              <CalendarDays className="h-3 w-3 shrink-0" />
              <span className="truncate">{item.dateText}</span>
            </div>
          </div>
          {/* 가격 — 티켓 카테고리에서만 (오더 #P4). 데이터 필드는 유지, 렌더만 차단. */}
          {item.category === "ticket" && (
            <div className="mt-2 flex items-baseline gap-1.5">
              {item.originalPrice ? (
                <span className="text-[11px] text-slate-400 line-through">
                  {item.originalPrice.toLocaleString("ko-KR")}
                </span>
              ) : null}
              {item.minPrice > 0 ? (
                <span className="text-sm font-black text-slate-950">
                  {item.minPrice.toLocaleString("ko-KR")}원~
                </span>
              ) : (
                <span className="text-sm font-bold text-sky-600">예약 문의</span>
              )}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}
