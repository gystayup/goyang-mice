// components/currency/CurrencyProvider.tsx — 오더 #C58 [1] 통화 컨텍스트.
//
// · 사용자가 명시 선택한 통화는 localStorage 에 저장 (useSyncExternalStore 로 구독).
// · 명시 선택이 없으면 언어 매핑으로 자동 결정 (파생값 · 별도 state 불필요).
// · SSR 안전: getServerSnapshot 은 null 반환 → 최초 렌더에서 언어 매핑 값 사용.

"use client";

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore, type ReactNode } from "react";
import { useLocale } from "next-intl";

import {
  CURRENCY_CODES,
  formatCurrency,
  localeToCurrency,
  type CurrencyCode,
} from "@/data/currency";

const STORAGE_KEY = "gm.currency";

interface CurrencyContextValue {
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  format: (krwAmount: number) => string;
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

function isCurrencyCode(v: unknown): v is CurrencyCode {
  return typeof v === "string" && (CURRENCY_CODES as string[]).includes(v);
}

// storage 이벤트 구독 (외부 탭 동기화 포함).
function subscribe(cb: () => void): () => void {
  window.addEventListener("storage", cb);
  window.addEventListener("gm-currency-change", cb);
  return () => {
    window.removeEventListener("storage", cb);
    window.removeEventListener("gm-currency-change", cb);
  };
}

function getSnapshot(): CurrencyCode | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return isCurrencyCode(raw) ? raw : null;
  } catch {
    return null;
  }
}

function getServerSnapshot(): CurrencyCode | null {
  return null;
}

// 오더 #C60: rates prop — server 에서 readSiteCopy 로 조회한 admin 편집 환율.
//   미전달 시 formatCurrency 내부 EXCHANGE_RATES 폴백 사용.
export function CurrencyProvider({
  children,
  rates,
}: {
  children: ReactNode;
  rates?: Record<CurrencyCode, number>;
}) {
  const locale = useLocale();

  // 명시 선택값 (없으면 null).
  const explicit = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  // 파생: 명시 선택 우선, 없으면 언어 매핑.
  const currency: CurrencyCode = explicit ?? localeToCurrency(locale);

  const setCurrency = useCallback((code: CurrencyCode) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, code);
      window.dispatchEvent(new Event("gm-currency-change"));
    } catch { /* 무시 */ }
  }, []);

  const value = useMemo<CurrencyContextValue>(() => ({
    currency,
    setCurrency,
    format: (krw: number) => formatCurrency(krw, currency, locale, rates),
  }), [currency, setCurrency, locale, rates]);

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency(): CurrencyContextValue {
  const ctx = useContext(CurrencyContext);
  if (ctx) return ctx;
  // Provider 밖에서도 안전 fallback (KRW).
  return {
    currency: "KRW",
    setCurrency: () => {},
    format: (krw: number) => formatCurrency(krw, "KRW", "ko"),
  };
}
