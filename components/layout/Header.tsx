// Header — 오더 #C25 런던식 상단 리뉴얼 (흰 배경 · accent 코럴레드 언더라인).
//
// 이전 (#R2): 검은 pill + 차콜 배경 + 골드 언더라인.
// 이후 (#C25): 흰 배경 pill + 슬레이트 텍스트 위계 + accent 하단 언더라인.
//   · 로고 "GOYANG DMC" — dot·DMC 는 accent (골드 → accent 로 포인트 이동)
//   · 활성 메뉴 = text-[var(--accent)] + border-b-2 border-[var(--accent)]
//   · BEST 카테고리 칩 가볍게 (슬레이트 톤 · 활성 = accent tint)
//   · 스크롤 시 흰색 sticky 고정 (sticky top-0 유지)
//   · 언어 버튼 · 로그인 CTA 톤은 흰 배경에 어울리게 재정렬
//
// 무접촉: navigation 항목 · CATEGORY_LABEL · 5로케일 copy · 스타일 외 로직.

"use client";

import { Menu, X } from "lucide-react";
import { useLocale } from "next-intl";
import { useState } from "react";

import { type LocaleKey, navigation, navigationLabels, type NavigationKey } from "@/data/navigation";
import { Link, usePathname } from "@/lib/navigation";
import HeaderUserMenu from "@/components/layout/HeaderUserMenu";
import {
  CATEGORY_LABEL,
  CURATED_CATEGORIES,
} from "@/data/curated-categories";

type HeaderCopy = {
  menuLabel: string;
  closeLabel: string;
};

// 5로케일 헤더 문구 (menuLabel / closeLabel).
const copyMap: Record<LocaleKey, HeaderCopy> = {
  ko: {
    menuLabel: "메뉴 열기",
    closeLabel: "메뉴 닫기",
  },
  en: {
    menuLabel: "Open menu",
    closeLabel: "Close menu",
  },
  ja: {
    menuLabel: "メニューを開く",
    closeLabel: "メニューを閉じる",
  },
  "zh-CN": {
    menuLabel: "打开菜单",
    closeLabel: "关闭菜单",
  },
  "zh-TW": {
    menuLabel: "開啟選單",
    closeLabel: "關閉選單",
  },
};

// 언어 버튼 목록
const localeButtons: { locale: LocaleKey; label: string }[] = [
  { locale: "ko", label: "KO" },
  { locale: "en", label: "EN" },
  { locale: "ja", label: "JP" },
  { locale: "zh-CN", label: "简" },
  { locale: "zh-TW", label: "繁" },
];

const localeButtonClass =
  "inline-flex min-h-8 min-w-8 items-center justify-center rounded-full px-2.5 text-[11px] font-bold transition";

/** 네비 항목별 위계 톤 결정 (오더 #R2 · #P1 로 best 추가 · #C25 로 흰 배경 톤 재조정). */
function navTone(key: NavigationKey): "visitor" | "action" | "institutional" {
  if (key === "best" || key === "products" || key === "dmc") return "visitor";
  if (key === "contact") return "action";
  return "institutional"; // institute, research
}

/** 로고 텍스트 — 5로케일 공통 영문 고정. 오더 #C25: dot 과 DMC 를 accent 로. */
function BrandLogo({ size = "sm" }: { size?: "sm" | "md" }) {
  const sizeClass =
    size === "md"
      ? "text-[10.5px] tracking-[0.3em]"
      : "text-[9px] tracking-[0.22em] md:text-[10px] md:tracking-[0.28em]";
  return (
    <span className={`relative font-black uppercase text-[var(--charcoal)] ${sizeClass}`}>
      GOYANG <span className="text-[var(--accent)]">DMC</span>
    </span>
  );
}

export default function Header() {
  const pathname = usePathname();
  const locale = useLocale();
  const activeLocale: LocaleKey = (["ko", "en", "ja", "zh-CN", "zh-TW"].includes(locale) ? locale : "ko") as LocaleKey;
  const copy = copyMap[activeLocale];
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-50 px-2 sm:px-4">
      {/* 오더 #C25: 흰 배경 · 슬레이트 보더 · 스크롤 시 자연스레 고정. */}
      <div className="mx-auto max-w-7xl rounded-[28px] border border-slate-200/80 bg-white px-3 py-2 shadow-[0_10px_30px_rgba(15,23,42,0.08)] md:px-4 md:py-3.5 sm:px-5 lg:px-6">

        {/* ── 모바일 헤더 ── */}
        <div className="flex items-center justify-between gap-1.5 md:gap-2 lg:hidden">
          <Link href="/" className="group relative inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-slate-200 bg-white px-2.5 py-1 transition-all duration-300 hover:border-[var(--accent)]/50 hover:bg-slate-50 md:gap-2 md:px-3.5 md:py-1.5">
            {/* 오더 #C25: dot 을 accent 로. */}
            <span className="relative flex h-1.5 w-1.5 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-pulse rounded-full bg-[var(--accent)]/40" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
            </span>
            <BrandLogo size="sm" />
          </Link>

          <div className="flex shrink-0 items-center gap-1.5 md:gap-2">
            <HeaderUserMenu locale={activeLocale} />
            {/* 모바일 언어 버튼 — 드롭다운 */}
            <MobileLocaleSelector activeLocale={activeLocale} pathname={pathname} />
            <button
              type="button"
              aria-label={menuOpen ? copy.closeLabel : copy.menuLabel}
              onClick={() => setMenuOpen((o) => !o)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-[var(--charcoal)] transition hover:bg-slate-50 md:h-10 md:w-10"
            >
              {menuOpen ? <X className="h-4 w-4 md:h-5 md:w-5" /> : <Menu className="h-4 w-4 md:h-5 md:w-5" />}
            </button>
          </div>
        </div>

        {/* 모바일 메뉴 — 흰 배경 톤으로 통일. */}
        {menuOpen ? (
          <div className="mt-4 rounded-[24px] border border-slate-200 bg-white p-3 lg:hidden">
            <nav className="grid gap-1">
              {navigation.map((item) => {
                const active = isActive(item.href);
                const tone = navTone(item.key);
                const toneClass = active
                  ? "text-[var(--accent)]"
                  : tone === "visitor"
                    ? "text-[var(--charcoal)] hover:text-[var(--accent)]"
                    : tone === "action"
                      ? "text-slate-600 hover:text-[var(--accent)]"
                      : "text-slate-400 hover:text-slate-700";
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={`inline-flex min-h-12 items-center rounded-none border-b border-slate-100 px-2 py-3 text-sm font-semibold transition ${toneClass} ${
                      active ? "border-b-2 border-[var(--accent)]" : ""
                    }`}
                  >
                    {navigationLabels[activeLocale][item.key]}
                  </Link>
                );
              })}
            </nav>
            {/* 오더 #B1 [1]: 모바일 메뉴 내 BEST 하위 9카테고리 (wrap 허용). 오더 #C25: 흰 톤. */}
            <div className="mt-3 border-t border-slate-100 pt-3">
              <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--accent)]">
                BEST
              </div>
              <div className="flex flex-wrap gap-1.5">
                {CURATED_CATEGORIES.map((cat) => {
                  const href = `/best/${cat}`;
                  const active = pathname === href;
                  return (
                    <Link
                      key={cat}
                      href={href}
                      onClick={() => setMenuOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className={`inline-flex shrink-0 items-center rounded-full border px-3 py-1.5 text-[12px] font-semibold transition ${
                        active
                          ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]"
                          : "border-slate-200 text-slate-700 hover:border-[var(--accent)]/40 hover:text-[var(--charcoal)]"
                      }`}
                    >
                      {CATEGORY_LABEL[activeLocale][cat]}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        ) : null}

        {/* ── 데스크탑 헤더 ── */}
        <div className="hidden lg:grid lg:grid-cols-[minmax(0,16rem)_auto_minmax(0,1fr)_auto] lg:items-center lg:gap-4 xl:grid-cols-[minmax(0,18rem)_auto_minmax(0,1fr)_auto] xl:gap-5">

          {/* 로고 (한 줄) — 오더 #C25: 흰 pill + accent dot·DMC */}
          <Link href="/" className="min-w-0 group">
            <div className="relative inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 transition-all duration-300 group-hover:border-[var(--accent)]/50 group-hover:bg-slate-50 group-hover:shadow-[0_6px_20px_rgba(226,62,46,0.12)]">
              <span className="relative flex h-1.5 w-1.5 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-pulse rounded-full bg-[var(--accent)]/40" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
              </span>
              <BrandLogo size="md" />
            </div>
          </Link>

          {/* 언어 버튼 — 흰 배경 톤 */}
          <div>
            <div className="inline-flex items-center gap-0.5 rounded-full border border-slate-200 bg-slate-50 p-1">
              {localeButtons.map(({ locale: loc, label }) => (
                <Link
                  key={loc}
                  href={pathname}
                  locale={loc}
                  aria-current={activeLocale === loc ? "true" : undefined}
                  className={`${localeButtonClass} ${
                    activeLocale === loc
                      ? "bg-[var(--charcoal)] text-white"
                      : "text-slate-500 hover:bg-white hover:text-[var(--charcoal)]"
                  }`}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* 네비게이션 — 방문객·액션·기관 톤 위계 유지 · 활성 = accent 언더라인 + accent 텍스트 */}
          <nav className="flex flex-wrap items-center gap-x-1 gap-y-1 pt-0.5">
            {navigation.map((item) => {
              const active = isActive(item.href);
              const tone = navTone(item.key);
              const toneClass = active
                ? "text-[var(--accent)]"
                : tone === "visitor"
                  ? "text-[var(--charcoal)] hover:text-[var(--accent)]"
                  : tone === "action"
                    ? "text-slate-600 hover:text-[var(--accent)]"
                    : "text-slate-400 hover:text-slate-700";
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`relative inline-flex shrink-0 items-center px-3 py-2 text-[12px] font-semibold transition xl:px-3.5 xl:text-[13px] ${toneClass} border-b-2 ${
                    active ? "border-[var(--accent)]" : "border-transparent"
                  }`}
                >
                  {navigationLabels[activeLocale][item.key]}
                </Link>
              );
            })}
          </nav>

          {/* User 메뉴 */}
          <div className="flex items-center gap-2">
            <HeaderUserMenu locale={activeLocale} />
          </div>
        </div>

        {/* 오더 #B1 [1] + #C25: BEST 하위 9카테고리 서브줄 · 흰 배경용 라이트 톤. */}
        <div className="hidden lg:block">
          <BestCategoriesSubRow
            activeLocale={activeLocale}
            pathname={pathname}
          />
        </div>
      </div>
    </header>
  );
}

/**
 * 오더 #B1 [1] · #C25: BEST 하위 9카테고리 서브 네비. 흰 배경 · 슬레이트 톤 · 활성 = accent tint.
 */
function BestCategoriesSubRow({
  activeLocale,
  pathname,
}: {
  activeLocale: LocaleKey;
  pathname: string;
}) {
  return (
    <nav
      aria-label="BEST 카테고리"
      className="mt-1.5 flex flex-wrap items-center gap-x-1 gap-y-1 border-t border-slate-100 pt-2"
    >
      <span className="mr-2 text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--accent)]">
        BEST
      </span>
      {CURATED_CATEGORIES.map((cat) => {
        const href = `/best/${cat}`;
        const active = pathname === href;
        return (
          <Link
            key={cat}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`inline-flex shrink-0 items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold transition ${
              active
                ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]"
                : "border-slate-200 text-slate-700 hover:border-[var(--accent)]/40 hover:text-[var(--charcoal)]"
            }`}
          >
            {CATEGORY_LABEL[activeLocale][cat]}
          </Link>
        );
      })}
    </nav>
  );
}

// 모바일용 언어 선택기 (드롭다운) — 흰 배경 톤.
function MobileLocaleSelector({
  activeLocale,
  pathname,
}: {
  activeLocale: LocaleKey;
  pathname: string;
}) {
  const [open, setOpen] = useState(false);
  const current = localeButtons.find((b) => b.locale === activeLocale);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-8 items-center gap-1 rounded-full border border-slate-200 bg-white px-2 text-[11px] font-bold text-[var(--charcoal)] transition hover:bg-slate-50 md:h-10 md:gap-1.5 md:px-3 md:text-[12px]"
      >
        {current?.label ?? "KO"}
        <svg className={`h-2.5 w-2.5 transition-transform md:h-3 md:w-3 ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-12 z-50 min-w-[90px] overflow-hidden rounded-[18px] border border-slate-200 bg-white shadow-[0_12px_32px_rgba(15,23,42,0.15)]">
          {localeButtons.map(({ locale: loc, label }) => (
            <Link
              key={loc}
              href={pathname}
              locale={loc}
              onClick={() => setOpen(false)}
              className={`flex items-center justify-between px-4 py-2.5 text-[12px] font-bold transition hover:bg-slate-50 ${
                activeLocale === loc ? "bg-[var(--charcoal)] text-white" : "text-slate-700"
              }`}
            >
              <span>{label}</span>
              {activeLocale === loc && (
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
