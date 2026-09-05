// components/currency/CurrencySelector.tsx — 오더 #C58 [1] 통화 드롭다운.
//
// · Header 상단 유틸바 통화 <span> 대체
// · 5개 코드 라디오 선택 · 참조용 안내 상단 노출
// · 흰 배경 · 얇은 슬레이트 톤 (기존 유틸바와 일치)
// · 접근성: role=menu · 외부 클릭 닫힘

"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { Check } from "lucide-react";

import { useCurrency } from "@/components/currency/CurrencyProvider";
import {
  CURRENCY_CODES,
  CURRENCY_DISCLAIMER,
  CURRENCY_LABEL,
  CURRENCY_SYMBOL,
  type CurrencyCode,
} from "@/data/currency";

type LocaleKey = "ko" | "en" | "ja" | "zh-CN" | "zh-TW";

function pickLocale(locale: string): LocaleKey {
  return (["ko", "en", "ja", "zh-CN", "zh-TW"] as string[]).includes(locale)
    ? (locale as LocaleKey)
    : "ko";
}

export default function CurrencySelector({
  variant = "utility",
}: {
  variant?: "utility" | "mobile";
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { currency, setCurrency } = useCurrency();
  const locale = useLocale();
  const active = pickLocale(locale);

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
      ? "inline-flex h-6 items-center gap-1 px-1.5 text-[11px] font-bold tracking-[0.08em] text-slate-500 transition hover:text-[var(--charcoal)]"
      : "inline-flex h-9 items-center gap-1 rounded-md border border-slate-200 bg-white px-2 text-[11px] font-bold text-[var(--charcoal)] transition hover:bg-slate-50";

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Change currency"
        className={buttonBase}
      >
        <span>{CURRENCY_SYMBOL[currency]} {currency}</span>
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
          className={`absolute z-50 mt-2 min-w-[220px] overflow-hidden rounded-md border border-slate-200 bg-white shadow-[0_12px_32px_rgba(15,23,42,0.15)] ${
            variant === "utility" ? "left-0 top-full" : "right-0 top-11"
          }`}
        >
          <div className="border-b border-slate-100 px-3 py-2 text-[10px] leading-tight text-slate-500">
            {CURRENCY_DISCLAIMER[active]}
          </div>
          <ul className="py-1">
            {CURRENCY_CODES.map((code: CurrencyCode) => {
              const selected = currency === code;
              return (
                <li key={code}>
                  <button
                    type="button"
                    onClick={() => { setCurrency(code); setOpen(false); }}
                    aria-current={selected ? "true" : undefined}
                    className={`flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-[12px] transition hover:bg-slate-50 ${
                      selected ? "text-[var(--accent)]" : "text-slate-700"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="inline-flex h-5 w-8 items-center justify-center rounded bg-slate-100 text-[11px] font-black text-slate-700">
                        {CURRENCY_SYMBOL[code]}
                      </span>
                      <span className="font-semibold">{CURRENCY_LABEL[active][code]}</span>
                    </span>
                    {selected && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
