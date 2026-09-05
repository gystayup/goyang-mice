// components/layout/LanguageSelector.tsx — 오더 #C58 [2] 언어 드롭다운.
//
// · 기존 인라인 KO/EN/JP/简/繁 5개 링크 대체
// · Globe 아이콘 + 현재 언어 native name → 드롭다운
// · 드롭다운: 5개 언어 native name (한국어 · English · 日本語 · 简体中文 · 繁體中文)
// · Link + locale prop 활용 (기존 라우팅 로직 유지)

"use client";

import { Check, Globe } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Link } from "@/lib/navigation";

type LocaleKey = "ko" | "en" | "ja" | "zh-CN" | "zh-TW";

const LANGS: { locale: LocaleKey; native: string; short: string }[] = [
  { locale: "ko",    native: "한국어",      short: "KO" },
  { locale: "en",    native: "English",     short: "EN" },
  { locale: "ja",    native: "日本語",      short: "JP" },
  { locale: "zh-CN", native: "简体中文",    short: "简" },
  { locale: "zh-TW", native: "繁體中文",    short: "繁" },
];

export default function LanguageSelector({
  activeLocale,
  pathname,
  variant = "utility",
}: {
  activeLocale: LocaleKey;
  pathname: string;
  variant?: "utility" | "mobile";
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = LANGS.find((l) => l.locale === activeLocale) ?? LANGS[0];

  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const buttonBase =
    variant === "utility"
      ? "inline-flex h-6 items-center gap-1.5 px-1.5 text-[11px] font-bold tracking-[0.06em] text-slate-600 transition hover:text-[var(--accent)]"
      : "inline-flex h-9 items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 text-[11px] font-bold text-[var(--charcoal)] transition hover:bg-slate-50";

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Change language"
        className={buttonBase}
      >
        <Globe className="h-3.5 w-3.5" strokeWidth={2} />
        <span>{current.native}</span>
        <svg
          className={`h-2.5 w-2.5 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div
          role="menu"
          className={`absolute z-50 mt-2 min-w-[180px] overflow-hidden rounded-md border border-slate-200 bg-white shadow-[0_12px_32px_rgba(15,23,42,0.15)] ${
            variant === "utility" ? "left-0 top-full" : "right-0 top-11"
          }`}
        >
          <ul className="py-1">
            {LANGS.map(({ locale: loc, native }) => {
              const selected = activeLocale === loc;
              return (
                <li key={loc}>
                  <Link
                    href={pathname}
                    locale={loc}
                    onClick={() => setOpen(false)}
                    aria-current={selected ? "true" : undefined}
                    className={`flex w-full items-center justify-between gap-3 px-3 py-2 text-[12px] font-semibold transition hover:bg-slate-50 ${
                      selected ? "text-[var(--accent)]" : "text-slate-700"
                    }`}
                  >
                    <span>{native}</span>
                    {selected && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
