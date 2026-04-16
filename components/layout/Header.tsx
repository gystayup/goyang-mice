"use client";

import { ArrowRight, Menu, X } from "lucide-react";
import { useLocale } from "next-intl";
import { useState } from "react";

import { type LocaleKey, navigation, navigationLabels } from "@/data/navigation";
import { Link, usePathname } from "@/lib/navigation";

type HeaderCopy = {
  brand: string;
  titleLine2: string;
  partnership: string;
  menuLabel: string;
  closeLabel: string;
};

const copyMap: Record<LocaleKey, HeaderCopy> = {
  ko: {
    brand: "GOYANG VIBE LAB",
    titleLine2: "K-컬처플랫폼",
    partnership: "협력 제안",
    menuLabel: "메뉴 열기",
    closeLabel: "메뉴 닫기",
  },
  en: {
    brand: "GOYANG VIBE LAB",
    titleLine2: "K-Culture Platform",
    partnership: "Partnership",
    menuLabel: "Open menu",
    closeLabel: "Close menu",
  },
  ja: {
    brand: "GOYANG VIBE LAB",
    titleLine2: "K-カルチャープラットフォーム",
    partnership: "提携提案",
    menuLabel: "メニューを開く",
    closeLabel: "メニューを閉じる",
  },
  "zh-CN": {
    brand: "GOYANG VIBE LAB",
    titleLine2: "K-文化平台",
    partnership: "合作提案",
    menuLabel: "打开菜单",
    closeLabel: "关闭菜单",
  },
  "zh-TW": {
    brand: "GOYANG VIBE LAB",
    titleLine2: "K-文化平台",
    partnership: "合作提案",
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

export default function Header() {
  const pathname = usePathname();
  const locale = useLocale();
  const activeLocale: LocaleKey = (["ko", "en", "ja", "zh-CN", "zh-TW"].includes(locale) ? locale : "ko") as LocaleKey;
  const copy = copyMap[activeLocale];
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-50 px-3 sm:px-4">
      <div className="mx-auto max-w-7xl rounded-[28px] border border-white/80 bg-white/80 px-4 py-3.5 shadow-[0_18px_50px_rgba(16,32,58,0.10),_0_0_0_1px_rgba(255,255,255,0.6)] backdrop-blur-2xl sm:px-5 lg:px-6">

        {/* ── 모바일 헤더 ── */}
        <div className="flex items-center justify-between gap-2 lg:hidden">
          <Link href="/" className="group relative inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border border-slate-900/10 bg-white/60 px-3.5 py-1.5 backdrop-blur-md transition-all duration-300 hover:border-slate-900/20 hover:bg-white hover:shadow-sm">
            <span className="relative flex h-1.5 w-1.5 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-pulse rounded-full bg-emerald-400/40" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </span>
            <span className="relative bg-[linear-gradient(135deg,_#0f172a_0%,_#334155_50%,_#0f172a_100%)] bg-clip-text text-[10px] font-black uppercase tracking-[0.28em] text-transparent">
              {copy.brand}
            </span>
          </Link>

          <div className="flex shrink-0 items-center gap-2">
            {/* 모바일 언어 버튼 — 드롭다운 */}
            <MobileLocaleSelector activeLocale={activeLocale} pathname={pathname} />
            <button
              type="button"
              aria-label={menuOpen ? copy.closeLabel : copy.menuLabel}
              onClick={() => setMenuOpen((o) => !o)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-700 transition hover:bg-white"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* 모바일 메뉴 */}
        {menuOpen ? (
          <div className="mt-4 rounded-[24px] border border-slate-200 bg-slate-50/90 p-3 lg:hidden">
            <nav className="grid gap-2">
              {navigation.map((item, index) => {
                const active = isActive(item.href);
                const tone =
                  index % 3 === 0
                    ? "bg-[#fff4da] text-[#8a5a08]"
                    : index % 3 === 1
                      ? "bg-[#e9fbf4] text-[#126a4c]"
                      : "bg-[#eef3ff] text-[#304f9b]";
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={`inline-flex min-h-12 items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                      active ? "bg-slate-950 text-white" : `${tone} hover:brightness-[0.98]`
                    }`}
                  >
                    <span>{navigationLabels[activeLocale][item.key]}</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                );
              })}
            </nav>
            <Link
              href="/contact"
              onClick={() => setMenuOpen(false)}
              className="mt-3 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,_#ff8f7e,_#ffcc8f)] px-5 text-sm font-semibold text-slate-950"
            >
              {copy.partnership}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : null}

        {/* ── 데스크탑 헤더 ── */}
        <div className="hidden lg:grid lg:grid-cols-[minmax(0,16rem)_auto_minmax(0,1fr)_auto] lg:items-center lg:gap-4 xl:grid-cols-[minmax(0,18rem)_auto_minmax(0,1fr)_auto] xl:gap-5">

          {/* 로고 + 타이틀 */}
          <Link href="/" className="min-w-0 group">
            <div className="relative inline-flex items-center gap-2 rounded-full border border-slate-900/10 bg-white/70 px-4 py-1.5 backdrop-blur-md transition-all duration-300 group-hover:border-slate-900/25 group-hover:bg-white group-hover:shadow-[0_6px_20px_rgba(15,23,42,0.08)]">
              <span className="relative flex h-1.5 w-1.5 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-pulse rounded-full bg-emerald-400/40" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </span>
              <span className="relative bg-[linear-gradient(135deg,_#0f172a_0%,_#334155_50%,_#0f172a_100%)] bg-clip-text text-[10.5px] font-black uppercase tracking-[0.3em] text-transparent transition-all duration-300 group-hover:tracking-[0.32em]">
                {copy.brand}
              </span>
            </div>
            <div className="mt-2 whitespace-nowrap text-[1.2rem] font-black leading-[1.15] tracking-[-0.03em] text-slate-950">
              {copy.titleLine2}
            </div>
          </Link>

          {/* 언어 버튼 */}
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
                      ? "bg-slate-950 text-white"
                      : "text-slate-500 hover:bg-white hover:text-slate-800"
                  }`}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* 네비게이션 */}
          <nav className="flex flex-nowrap items-center gap-1 overflow-x-auto pt-0.5">
            {navigation.map((item, index) => {
              const active = isActive(item.href);
              const tone =
                index % 3 === 0
                  ? "bg-[#fff4da] text-[#8a5a08] hover:bg-[#ffe8b9]"
                  : index % 3 === 1
                    ? "bg-[#e9fbf4] text-[#126a4c] hover:bg-[#d7f6ea]"
                    : "bg-[#eef3ff] text-[#304f9b] hover:bg-[#dde7ff]";
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-2 text-[12px] font-semibold transition xl:px-3.5 xl:text-[13px] ${
                    active
                      ? "bg-slate-950 text-white shadow-[0_10px_24px_rgba(15,23,42,0.16)]"
                      : tone
                  }`}
                >
                  <span className={`h-2 w-2 rounded-full ${active ? "bg-[#8df0cf]" : "bg-current/25"}`} />
                  {navigationLabels[activeLocale][item.key]}
                </Link>
              );
            })}
          </nav>

          {/* CTA 버튼 */}
          <div>
            <Link
              href="/contact"
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[linear-gradient(135deg,_#ff8f7e,_#ffcc8f)] px-5 text-sm font-semibold text-slate-950 shadow-[0_12px_25px_rgba(255,143,126,0.28)] transition hover:-translate-y-0.5 hover:brightness-105"
            >
              {copy.partnership}
              <ArrowRight className="h-4 w-4" />
            </Link>
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
        className="inline-flex h-10 items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 text-[12px] font-bold text-slate-700 transition hover:bg-white"
      >
        {current?.label ?? "KO"}
        <svg className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-12 z-50 min-w-[90px] overflow-hidden rounded-[18px] border border-slate-200 bg-white shadow-[0_12px_32px_rgba(16,32,58,0.12)]">
          {localeButtons.map(({ locale: loc, label }) => (
            <Link
              key={loc}
              href={pathname}
              locale={loc}
              onClick={() => setOpen(false)}
              className={`flex items-center justify-between px-4 py-2.5 text-[12px] font-bold transition hover:bg-slate-50 ${
                activeLocale === loc ? "bg-slate-950 text-white" : "text-slate-700"
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
