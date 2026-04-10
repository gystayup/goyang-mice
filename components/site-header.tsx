"use client";

import { usePathname, useRouter } from "@/lib/navigation";
import { Link } from "@/lib/navigation";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { Menu, X, ChevronDown, Globe } from "lucide-react";

const localeLabels: Record<string, string> = {
  ko: "한국어",
  en: "English",
  ja: "日本語",
  "zh-CN": "简体中文",
  "zh-TW": "繁體中文",
};

const localeShort: Record<string, string> = {
  ko: "KR",
  en: "EN",
  ja: "JP",
  "zh-CN": "CN",
  "zh-TW": "TW",
};

export default function SiteHeader() {
  const t = useTranslations("nav");
  const tc = useTranslations("common");
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) ?? "ko";

  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const navItems = [
    { label: t("institute"), href: "/institute" },
    { label: t("research"), href: "/research" },
    { label: t("dmc"), href: "/dmc" },
    { label: t("products"), href: "/products" },
    { label: t("contact"), href: "/contact" },
  ];

  function switchLocale(next: string) {
    router.replace(pathname, { locale: next });
    setLangOpen(false);
    setMobileOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* 로고 */}
        <Link href="/" className="group">
          <div className="text-base font-bold tracking-tight text-slate-950 group-hover:text-slate-700 transition">
            {tc("siteTitle")}
          </div>
          <div className="text-xs text-slate-500">{tc("siteSubtitle")}</div>
        </Link>

        {/* PC 네비게이션 */}
        <nav className="hidden gap-1 lg:flex">
          {navItems.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-2xl px-4 py-2 text-sm font-medium transition ${
                  active
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* 우측: 언어 선택 + CTA */}
        <div className="hidden items-center gap-3 lg:flex">
          {/* 언어 드롭다운 */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1.5 rounded-2xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 transition"
            >
              <Globe className="h-4 w-4" />
              {localeShort[locale]}
              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${langOpen ? "rotate-180" : ""}`} />
            </button>
            {langOpen && (
              <div className="absolute right-0 top-full mt-2 w-40 rounded-2xl border border-slate-200 bg-white py-2 shadow-lg">
                {Object.entries(localeLabels).map(([code, label]) => (
                  <button
                    key={code}
                    onClick={() => switchLocale(code)}
                    className={`flex w-full items-center justify-between px-4 py-2.5 text-sm transition hover:bg-slate-50 ${
                      locale === code ? "font-semibold text-slate-950" : "text-slate-600"
                    }`}
                  >
                    <span>{label}</span>
                    {locale === code && (
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-900" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <Link
            href="/contact"
            className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 transition"
          >
            {tc("contactCTA")}
          </Link>
        </div>

        {/* 모바일 햄버거 */}
        <button
          className="rounded-xl border border-slate-200 p-2 text-slate-600 lg:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="메뉴"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* 모바일 메뉴 */}
      {mobileOpen && (
        <div className="border-t border-slate-100 bg-white px-6 py-4 lg:hidden">
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`rounded-2xl px-4 py-3 text-sm font-medium transition ${
                    active
                      ? "bg-slate-900 text-white"
                      : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link
              href="/contact"
              onClick={() => setMobileOpen(false)}
              className="mt-2 rounded-2xl bg-slate-900 px-4 py-3 text-center text-sm font-semibold text-white"
            >
              {tc("contactCTA")}
            </Link>
            {/* 모바일 언어 선택 */}
            <div className="mt-3 border-t border-slate-100 pt-3">
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-400">
                <Globe className="h-3.5 w-3.5" /> Language
              </div>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(localeLabels).map(([code, label]) => (
                  <button
                    key={code}
                    onClick={() => switchLocale(code)}
                    className={`rounded-xl px-3 py-2 text-xs font-medium transition ${
                      locale === code
                        ? "bg-slate-900 text-white"
                        : "border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
