"use client";

import { ArrowRight, Menu, X } from "lucide-react";
import { useLocale } from "next-intl";
import { useState } from "react";

import { type LocaleKey, navigation, navigationLabels } from "@/data/navigation";
import { Link, usePathname } from "@/lib/navigation";

type HeaderCopy = {
  brand: string;
  titleLine1: string;
  titleLine2: string;
  reservation: string;
  contact: string;
  partnership: string;
  menuLabel: string;
  closeLabel: string;
};

const copyMap: Record<"ko" | "en", HeaderCopy> = {
  ko: {
    brand: "GOYANG VIBE LAB",
    titleLine1: "고양특례시",
    titleLine2: "K-컬처플랫폼",
    reservation: "예약 보기",
    contact: "문의하기",
    partnership: "협력 제안",
    menuLabel: "메뉴 열기",
    closeLabel: "메뉴 닫기",
  },
  en: {
    brand: "GOYANG VIBE LAB",
    titleLine1: "Goyang Special City",
    titleLine2: "K-Culture Platform",
    reservation: "Bookings",
    contact: "Contact",
    partnership: "Partnership",
    menuLabel: "Open menu",
    closeLabel: "Close menu",
  },
};

const localeButtonClass =
  "inline-flex min-h-10 min-w-10 items-center justify-center rounded-full px-3 text-sm font-semibold transition";

export default function Header() {
  const pathname = usePathname();
  const locale = useLocale();
  const activeLocale: LocaleKey = locale === "en" ? "en" : "ko";
  const copy = copyMap[activeLocale];
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-50 px-3 sm:px-4">
      <div className="mx-auto max-w-7xl rounded-[28px] border border-white/70 bg-white/88 px-4 py-4 shadow-[0_18px_50px_rgba(16,32,58,0.08)] backdrop-blur-xl sm:px-5 lg:px-6">
        {/* 모바일 헤더: 배지 + 언어 + 메뉴만 표시 */}
        <div className="flex items-center justify-between gap-2 lg:hidden">
          <Link href="/" className="inline-flex shrink-0 whitespace-nowrap rounded-full bg-[linear-gradient(135deg,_#8df0cf,_#ffe98b)] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-950">
            {copy.brand}
          </Link>

          <div className="flex shrink-0 items-center gap-2">
            <div className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 p-1">
              <Link href={pathname} locale="ko" className={`${localeButtonClass} ${activeLocale === "ko" ? "bg-slate-950 text-white" : "text-slate-600 hover:bg-white"}`}>KO</Link>
              <Link href={pathname} locale="en" className={`${localeButtonClass} ${activeLocale === "en" ? "bg-slate-950 text-white" : "text-slate-600 hover:bg-white"}`}>EN</Link>
            </div>
            <button type="button" aria-label={menuOpen ? copy.closeLabel : copy.menuLabel} onClick={() => setMenuOpen((o) => !o)} className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-700 transition hover:bg-white">
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

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

        <div className="hidden lg:grid lg:grid-cols-[minmax(0,18rem)_auto_minmax(0,1fr)_auto] lg:items-start lg:gap-4 xl:grid-cols-[minmax(0,22rem)_auto_minmax(0,1fr)_auto] xl:gap-5">
          <Link href="/" className="min-w-0">
            <div className="inline-flex rounded-full bg-[linear-gradient(135deg,_#8df0cf,_#ffe98b)] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.24em] text-slate-950">
              {copy.brand}
            </div>
            <div className="mt-3 text-[1.7rem] font-black leading-[1.1] tracking-[-0.04em] text-slate-950">
              <span className="block">{copy.titleLine1}</span>
              <span className="block">{copy.titleLine2}</span>
            </div>
          </Link>

          <div className="pt-2">
            <div className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 p-1">
              <Link
                href={pathname}
                locale="ko"
                aria-current={activeLocale === "ko" ? "true" : undefined}
                className={`${localeButtonClass} ${
                  activeLocale === "ko"
                    ? "bg-slate-950 text-white"
                    : "text-slate-600 hover:bg-white"
                }`}
              >
                KO
              </Link>
              <Link
                href={pathname}
                locale="en"
                aria-current={activeLocale === "en" ? "true" : undefined}
                className={`${localeButtonClass} ${
                  activeLocale === "en"
                    ? "bg-slate-950 text-white"
                    : "text-slate-600 hover:bg-white"
                }`}
              >
                EN
              </Link>
            </div>
          </div>

          <nav className="flex flex-nowrap items-center gap-1.5 pt-2">
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
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-[13px] font-semibold transition xl:px-4 xl:text-[14px] ${
                    active
                      ? "bg-slate-950 text-white shadow-[0_10px_24px_rgba(15,23,42,0.16)]"
                      : tone
                  }`}
                >
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      active ? "bg-[#8df0cf]" : "bg-current/25"
                    }`}
                  />
                  {navigationLabels[activeLocale][item.key]}
                </Link>
              );
            })}
          </nav>

          <div className="pt-2">
            <Link
              href="/contact"
              className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[linear-gradient(135deg,_#ff8f7e,_#ffcc8f)] px-5 text-sm font-semibold text-slate-950 shadow-[0_12px_25px_rgba(255,143,126,0.28)] transition hover:-translate-y-0.5 hover:brightness-105"
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
