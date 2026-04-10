"use client";

import { useLocale } from "next-intl";

import { getCategoryLabel, getCommonCopy } from "@/data/locales/general-copy";
import type { DmcCategoryKey } from "@/data/products";
import { Link } from "@/lib/navigation";

type QuickNavMode = "detail" | "reservation";

const categoryTargets: Record<DmcCategoryKey, string> = {
  tour: "tour-experience-platform",
  stay: "stay-reservation-platform",
  restaurant: "restaurant-booking-platform",
  cafe: "cafe-booking-platform",
  ticket: "ticket-agency-platform",
  airport: "airport-pickup-platform",
};

export default function ProductCategoryQuickNav({
  activeCategory,
  mode = "detail",
}: {
  activeCategory: DmcCategoryKey;
  mode?: QuickNavMode;
}) {
  const rawLocale = useLocale();
  const SUPPORTED = ["ko", "en", "ja", "zh-CN", "zh-TW"] as const;
  type SupportedLocale = (typeof SUPPORTED)[number];
  const locale: SupportedLocale = SUPPORTED.includes(rawLocale as SupportedLocale) ? (rawLocale as SupportedLocale) : "ko";
  const common = getCommonCopy(locale);
  const suffix = mode === "reservation" ? "/reservation" : "";

  return (
    <div className="mt-8 rounded-[28px] border border-slate-200 bg-white/90 p-4 shadow-soft sm:p-5">
      <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
        {common.quickNav.label}
      </div>
      <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
        <Link
          href="/products"
          locale={locale}
          className="inline-flex shrink-0 items-center rounded-full border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          {common.quickNav.all}
        </Link>

        {(Object.keys(categoryTargets) as DmcCategoryKey[]).map((key) => {
          const isActive = key === activeCategory;
          return (
            <Link
              key={key}
              href={`/products/${categoryTargets[key]}${suffix}`}
              locale={locale}
              aria-current={isActive ? "page" : undefined}
              className={`inline-flex shrink-0 items-center rounded-full px-4 py-2.5 text-sm font-semibold transition ${
                isActive
                  ? "border border-slate-950 bg-slate-950 text-white"
                  : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              {getCategoryLabel(locale, key)}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
