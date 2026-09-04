// components/dmc/DmcTicketGrid.tsx — 오더 #C51 /dmc 티켓 그리드 + 카테고리 필터 (client).
//
// 페이지는 SSR 로 admin Supabase 티켓 배열을 로드 후 이 컴포넌트에 initialTickets 로 전달.
// 클라이언트에서 useState<selectedCategory> 로 필터 · 카테고리 카운트 계산 · 0건 버튼 숨김.
//
// 규범:
//   · CTA 는 기존 /products/{id}/reservation (Toss 결제 흐름 무변경)
//   · 5로케일 라벨 (data/ticket-categories.ts SSOT)
//   · Supabase 데이터 변경 금지 · legacy k-pop 은 normalizeTicketCategory 로 concert 매핑

"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { ArrowRight, Calendar, MapPin } from "lucide-react";

import { Link } from "@/lib/navigation";
import type { TicketProduct, TicketLocale } from "@/data/ticket-booking";
import {
  DMC_TICKET_CATEGORIES,
  TICKET_CATEGORY_LABEL,
  TICKET_CATEGORY_ALL_LABEL,
  normalizeTicketCategory,
  type DmcTicketCategory,
  type TicketCategoryLocale,
} from "@/data/ticket-categories";

type FilterKey = "all" | DmcTicketCategory;

export interface DmcTicketGridProps {
  initialTickets: TicketProduct[];
  locale: TicketCategoryLocale;
  ctaLabel: string;
  emptyLabel: string;
}

function pickLocalizedVenue(t: TicketProduct, locale: TicketCategoryLocale): string {
  if (locale === "ko") return t.venue;
  const key = locale as TicketLocale;
  return t.translations?.[key]?.venue ?? t.venue;
}

function pickLowestPrice(t: TicketProduct): number | null {
  if (!Array.isArray(t.options) || t.options.length === 0) return null;
  const prices = t.options.map((o) => o.price).filter((p) => typeof p === "number" && p > 0);
  if (prices.length === 0) return null;
  return Math.min(...prices);
}

function formatKRW(price: number): string {
  return `₩${price.toLocaleString("ko-KR")}`;
}

export default function DmcTicketGrid({ initialTickets, locale, ctaLabel, emptyLabel }: DmcTicketGridProps) {
  const [selected, setSelected] = useState<FilterKey>("all");

  // 카테고리별 카운트 (0건 버튼 숨김 판정용).
  const counts = useMemo(() => {
    const m: Record<DmcTicketCategory, number> = {
      concert: 0, exhibition: 0, festival: 0, activity: 0, admission: 0, tour: 0, family: 0,
    };
    for (const t of initialTickets) {
      const norm = normalizeTicketCategory(t.category);
      m[norm] = (m[norm] ?? 0) + 1;
    }
    return m;
  }, [initialTickets]);

  const visibleCategories = useMemo(
    () => DMC_TICKET_CATEGORIES.filter((c) => counts[c] > 0),
    [counts],
  );

  const filtered = useMemo(() => {
    if (selected === "all") return initialTickets;
    return initialTickets.filter((t) => normalizeTicketCategory(t.category) === selected);
  }, [initialTickets, selected]);

  if (initialTickets.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center text-sm text-slate-500">
        {emptyLabel}
      </div>
    );
  }

  return (
    <div>
      {/* 카테고리 필터 바 */}
      <div className="flex flex-wrap gap-2">
        <FilterButton
          active={selected === "all"}
          onClick={() => setSelected("all")}
          label={`${TICKET_CATEGORY_ALL_LABEL[locale]} (${initialTickets.length})`}
        />
        {visibleCategories.map((cat) => (
          <FilterButton
            key={cat}
            active={selected === cat}
            onClick={() => setSelected(cat)}
            label={`${TICKET_CATEGORY_LABEL[cat][locale]} (${counts[cat]})`}
          />
        ))}
      </div>

      {/* 티켓 그리드 (단일) */}
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((t) => {
          const venue = pickLocalizedVenue(t, locale);
          const price = pickLowestPrice(t);
          return (
            <article
              key={t.id}
              className="group overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_4px_14px_rgba(16,32,58,0.06)] transition hover:border-slate-950 hover:shadow-md"
            >
              {t.imageUrl ? (
                <div className="relative aspect-[16/9] w-full bg-slate-100">
                  <Image
                    src={t.imageUrl}
                    alt={t.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
              ) : (
                <div
                  aria-hidden="true"
                  className={`relative flex aspect-[16/9] w-full items-end bg-gradient-to-br ${t.imageTone} p-4`}
                >
                  <span className="text-2xl font-black uppercase tracking-[0.14em] text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.35)]">
                    {t.posterLabel}
                  </span>
                </div>
              )}
              <div className="flex flex-col gap-2 p-5">
                {t.badge && (
                  <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--accent)]">
                    {t.badge}
                  </div>
                )}
                <h3 className="text-base font-black leading-tight tracking-[-0.02em] text-slate-950 sm:text-lg">
                  {t.title}
                </h3>
                {t.subtitle && <p className="text-sm text-slate-600">{t.subtitle}</p>}
                <div className="mt-2 flex items-start gap-2 text-xs text-slate-600">
                  <MapPin className="mt-0.5 h-3 w-3 shrink-0" aria-hidden="true" />
                  <span>{venue}</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-slate-600">
                  <Calendar className="mt-0.5 h-3 w-3 shrink-0" aria-hidden="true" />
                  <span>{t.dateText}</span>
                </div>
                {price !== null && (
                  <div className="text-sm font-bold text-slate-950">
                    {formatKRW(price)}
                    <span className="ml-1 text-xs font-normal text-slate-500">~</span>
                  </div>
                )}
                <Link
                  href={`/products/${t.id}/reservation`}
                  className="mt-3 inline-flex items-center justify-center gap-1.5 rounded-full bg-slate-950 px-4 py-2 text-xs font-bold text-white transition hover:brightness-110"
                >
                  {ctaLabel}
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

function FilterButton({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex items-center rounded-full border px-4 py-2 text-xs font-semibold transition ${
        active
          ? "border-slate-950 bg-slate-950 text-white"
          : "border-slate-200 bg-white text-slate-700 hover:border-slate-400"
      }`}
    >
      {label}
    </button>
  );
}
