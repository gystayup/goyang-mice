// Header — 브랜드 리프레시 (오더 #R2). 차콜 베이스 + 골드 포인트.
//
// 로고: "GOYANG BEST" (5로케일 공통 영문 고정, BEST 골드 강조).
// 네비 위계 (data/navigation.ts 5항목):
//   · 방문객 (dmc, products)     — 밝게 (text-white)
//   · 액션   (contact)           — 중간 (text-white/75)
//   · 기관   (institute, research)— 어둡게 (text-white/45)
//   · 활성 항목: 골드 밑줄 (border-b-2 border-[var(--gold)]) + 골드 텍스트
// 로그인 CTA: HeaderUserMenu 안에서 골드 버튼.
// 배경 색은 CSS 토큰 (var(--charcoal), var(--gold)) 사용, 하드코딩 금지.

"use client";

import { Menu, X } from "lucide-react";
import { useLocale } from "next-intl";
import { useState } from "react";

import { type LocaleKey, navigation, navigationLabels, type NavigationKey } from "@/data/navigation";
import { Link, usePathname } from "@/lib/navigation";
import HeaderUserMenu from "@/components/layout/HeaderUserMenu";

type HeaderCopy = {
  titleLine2: string;
  menuLabel: string;
  closeLabel: string;
};

// 서브 브랜드 (오더 #BRAND1): "K-컬처플랫폼" → "고양이즘 / GOYANGISM".
// 로케일별 표기 판단:
//   · ko:    "고양이즘" (한글 브랜드 원표기)
//   · en:    "GOYANGISM" (로마자만)
//   · ja:    "고양이즘(ゴヤンイズム)" (한글 원표기 + 카타카나 발음 병기)
//   · zh-CN: "GOYANGISM" (한자 표기 없이 로마자)
//   · zh-TW: "GOYANGISM"
const copyMap: Record<LocaleKey, HeaderCopy> = {
  ko: {
    titleLine2: "고양이즘",
    menuLabel: "메뉴 열기",
    closeLabel: "메뉴 닫기",
  },
  en: {
    titleLine2: "GOYANGISM",
    menuLabel: "Open menu",
    closeLabel: "Close menu",
  },
  ja: {
    titleLine2: "고양이즘(ゴヤンイズム)",
    menuLabel: "メニューを開く",
    closeLabel: "メニューを閉じる",
  },
  "zh-CN": {
    titleLine2: "GOYANGISM",
    menuLabel: "打开菜单",
    closeLabel: "关闭菜单",
  },
  "zh-TW": {
    titleLine2: "GOYANGISM",
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

/** 네비 항목별 위계 톤 결정 (오더 #R2). */
function navTone(key: NavigationKey): "visitor" | "action" | "institutional" {
  if (key === "dmc" || key === "products") return "visitor";
  if (key === "contact") return "action";
  return "institutional"; // institute, research
}

/** 로고 텍스트 — 5로케일 공통 영문 고정. BEST 만 골드. */
function BrandLogo({ size = "sm" }: { size?: "sm" | "md" }) {
  const sizeClass =
    size === "md"
      ? "text-[10.5px] tracking-[0.3em]"
      : "text-[9px] tracking-[0.22em] md:text-[10px] md:tracking-[0.28em]";
  return (
    <span className={`relative font-black uppercase text-white ${sizeClass}`}>
      GOYANG <span className="text-[var(--gold)]">BEST</span>
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
      <div className="mx-auto max-w-7xl rounded-[28px] border border-white/10 bg-[var(--charcoal)] px-3 py-2 shadow-[0_18px_50px_rgba(35,35,34,0.35)] md:px-4 md:py-3.5 sm:px-5 lg:px-6">

        {/* ── 모바일 헤더 ── */}
        <div className="flex items-center justify-between gap-1.5 md:gap-2 lg:hidden">
          <Link href="/" className="group relative inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-white/12 bg-white/[0.06] px-2.5 py-1 backdrop-blur-md transition-all duration-300 hover:border-[var(--gold)]/40 hover:bg-white/[0.10] md:gap-2 md:px-3.5 md:py-1.5">
            <span className="relative flex h-1.5 w-1.5 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-pulse rounded-full bg-[var(--gold)]/40" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--gold)]" />
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
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/12 bg-white/[0.06] text-white transition hover:bg-white/[0.12] md:h-10 md:w-10"
            >
              {menuOpen ? <X className="h-4 w-4 md:h-5 md:w-5" /> : <Menu className="h-4 w-4 md:h-5 md:w-5" />}
            </button>
          </div>
        </div>

        {/* 모바일 메뉴 */}
        {menuOpen ? (
          <div className="mt-4 rounded-[24px] border border-white/10 bg-[var(--charcoal)] p-3 lg:hidden">
            <nav className="grid gap-1">
              {navigation.map((item) => {
                const active = isActive(item.href);
                const tone = navTone(item.key);
                const toneClass = active
                  ? "text-[var(--gold)]"
                  : tone === "visitor"
                    ? "text-white hover:text-[var(--gold)]"
                    : tone === "action"
                      ? "text-white/75 hover:text-[var(--gold)]"
                      : "text-white/45 hover:text-white/85";
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={`inline-flex min-h-12 items-center rounded-none border-b border-white/8 px-2 py-3 text-sm font-semibold transition ${toneClass} ${
                      active ? "border-b-2 border-[var(--gold)]" : ""
                    }`}
                  >
                    {navigationLabels[activeLocale][item.key]}
                  </Link>
                );
              })}
            </nav>
          </div>
        ) : null}

        {/* ── 데스크탑 헤더 ── */}
        <div className="hidden lg:grid lg:grid-cols-[minmax(0,16rem)_auto_minmax(0,1fr)_auto] lg:items-center lg:gap-4 xl:grid-cols-[minmax(0,18rem)_auto_minmax(0,1fr)_auto] xl:gap-5">

          {/* 로고 + 타이틀 */}
          <Link href="/" className="min-w-0 group">
            <div className="relative inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.06] px-4 py-1.5 backdrop-blur-md transition-all duration-300 group-hover:border-[var(--gold)]/50 group-hover:bg-white/[0.10] group-hover:shadow-[0_6px_20px_rgba(212,175,55,0.15)]">
              <span className="relative flex h-1.5 w-1.5 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-pulse rounded-full bg-[var(--gold)]/40" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--gold)]" />
              </span>
              <BrandLogo size="md" />
            </div>
            <div className="mt-2 whitespace-nowrap text-[1.2rem] font-black leading-[1.15] tracking-[-0.03em] text-white/90">
              {copy.titleLine2}
            </div>
          </Link>

          {/* 언어 버튼 */}
          <div>
            <div className="inline-flex items-center gap-0.5 rounded-full border border-white/12 bg-white/[0.06] p-1">
              {localeButtons.map(({ locale: loc, label }) => (
                <Link
                  key={loc}
                  href={pathname}
                  locale={loc}
                  aria-current={activeLocale === loc ? "true" : undefined}
                  className={`${localeButtonClass} ${
                    activeLocale === loc
                      ? "bg-[var(--gold)] text-[var(--charcoal)]"
                      : "text-white/60 hover:bg-white/[0.10] hover:text-white"
                  }`}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* 네비게이션 — 방문객 밝게 · 액션 중간 · 기관 어둡게. 활성 = 골드 밑줄 + 골드 텍스트 */}
          <nav className="flex flex-wrap items-center gap-x-1 gap-y-1 pt-0.5">
            {navigation.map((item) => {
              const active = isActive(item.href);
              const tone = navTone(item.key);
              const toneClass = active
                ? "text-[var(--gold)]"
                : tone === "visitor"
                  ? "text-white hover:text-[var(--gold)]"
                  : tone === "action"
                    ? "text-white/75 hover:text-[var(--gold)]"
                    : "text-white/45 hover:text-white/85";
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`relative inline-flex shrink-0 items-center px-3 py-2 text-[12px] font-semibold transition xl:px-3.5 xl:text-[13px] ${toneClass} border-b-2 ${
                    active ? "border-[var(--gold)]" : "border-transparent"
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
      </div>
    </header>
  );
}

// 모바일용 언어 선택기 (드롭다운)
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
        className="inline-flex h-8 items-center gap-1 rounded-full border border-white/12 bg-white/[0.06] px-2 text-[11px] font-bold text-white transition hover:bg-white/[0.12] md:h-10 md:gap-1.5 md:px-3 md:text-[12px]"
      >
        {current?.label ?? "KO"}
        <svg className={`h-2.5 w-2.5 transition-transform md:h-3 md:w-3 ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-12 z-50 min-w-[90px] overflow-hidden rounded-[18px] border border-white/10 bg-[var(--charcoal)] shadow-[0_12px_32px_rgba(35,35,34,0.35)]">
          {localeButtons.map(({ locale: loc, label }) => (
            <Link
              key={loc}
              href={pathname}
              locale={loc}
              onClick={() => setOpen(false)}
              className={`flex items-center justify-between px-4 py-2.5 text-[12px] font-bold transition hover:bg-white/[0.08] ${
                activeLocale === loc ? "bg-[var(--gold)] text-[var(--charcoal)]" : "text-white/85"
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
