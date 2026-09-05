// data/currency.ts — 오더 #C58 [1] 통화 SSOT.
//
// · 고정 환산표 (참조용 · 실시간 API 금지)
// · 원화(KRW) 기준
// · 결제 화면 금액은 무접촉 (Toss 실결제는 원화 고정)
// · 언어↔통화 기본 매핑: ko→KRW · en→USD · ja→JPY · zh-CN→CNY · zh-TW→TWD

export type CurrencyCode = "KRW" | "USD" | "JPY" | "CNY" | "TWD";

export const CURRENCY_CODES: CurrencyCode[] = ["KRW", "USD", "JPY", "CNY", "TWD"];

// 원화 대비 환산 계수 (참조용 고정 폴백).
// 오더 #C60: admin DB 편집 가능 값 · 이 상수는 DB 실패 시 폴백.
export const EXCHANGE_RATES: Record<CurrencyCode, number> = {
  KRW: 1,
  USD: 0.00073,
  JPY: 0.107,
  CNY: 0.0053,
  TWD: 0.023,
};

export const CURRENCY_SYMBOL: Record<CurrencyCode, string> = {
  KRW: "₩",
  USD: "$",
  JPY: "¥",
  CNY: "¥",
  TWD: "NT$",
};

// 소수점 자릿수 (JPY/KRW 는 0자리).
const DECIMAL_DIGITS: Record<CurrencyCode, number> = {
  KRW: 0,
  USD: 2,
  JPY: 0,
  CNY: 2,
  TWD: 0,
};

type LocaleKey = "ko" | "en" | "ja" | "zh-CN" | "zh-TW";

// 통화 라벨 (드롭다운 표기용).
export const CURRENCY_LABEL: Record<LocaleKey, Record<CurrencyCode, string>> = {
  ko: {
    KRW: "원 (KRW)",
    USD: "미국 달러 (USD)",
    JPY: "일본 엔 (JPY)",
    CNY: "중국 위안 (CNY)",
    TWD: "대만 달러 (TWD)",
  },
  en: {
    KRW: "Korean Won (KRW)",
    USD: "US Dollar (USD)",
    JPY: "Japanese Yen (JPY)",
    CNY: "Chinese Yuan (CNY)",
    TWD: "Taiwan Dollar (TWD)",
  },
  ja: {
    KRW: "韓国ウォン (KRW)",
    USD: "米ドル (USD)",
    JPY: "日本円 (JPY)",
    CNY: "中国元 (CNY)",
    TWD: "台湾ドル (TWD)",
  },
  "zh-CN": {
    KRW: "韩元 (KRW)",
    USD: "美元 (USD)",
    JPY: "日元 (JPY)",
    CNY: "人民币 (CNY)",
    TWD: "新台币 (TWD)",
  },
  "zh-TW": {
    KRW: "韓元 (KRW)",
    USD: "美元 (USD)",
    JPY: "日圓 (JPY)",
    CNY: "人民幣 (CNY)",
    TWD: "新臺幣 (TWD)",
  },
};

// 참조용 안내 문구 (드롭다운 상단).
export const CURRENCY_DISCLAIMER: Record<LocaleKey, string> = {
  ko: "표시 환산 금액은 참조용이며, 실제 결제는 원화로 이뤄집니다.",
  en: "Displayed conversions are for reference only. Actual payment is settled in KRW.",
  ja: "表示の換算金額は参考であり、実際の決済は韓国ウォンで行われます。",
  "zh-CN": "所示折算金额仅供参考，实际支付以韩元结算。",
  "zh-TW": "所示折算金額僅供參考，實際支付以韓元結算。",
};

export function localeToCurrency(locale: string): CurrencyCode {
  switch (locale) {
    case "en": return "USD";
    case "ja": return "JPY";
    case "zh-CN": return "CNY";
    case "zh-TW": return "TWD";
    case "ko":
    default: return "KRW";
  }
}

/**
 * KRW 금액을 지정 통화로 환산 · 로케일-포맷팅한 문자열 반환.
 * 예: formatCurrency(15000, "USD", "en") → "$10.95"
 * 예: formatCurrency(15000, "KRW", "ko") → "₩15,000"
 *
 * 오더 #C60: rates 인자로 admin 편집 환율 주입 가능 (기존 호출부 무변경 · 미전달 시 EXCHANGE_RATES 폴백).
 */
export function formatCurrency(
  krwAmount: number,
  code: CurrencyCode,
  locale?: string,
  rates?: Record<CurrencyCode, number>,
): string {
  const rate = rates?.[code] ?? EXCHANGE_RATES[code];
  const converted = krwAmount * rate;
  const digits = DECIMAL_DIGITS[code];
  const symbol = CURRENCY_SYMBOL[code];
  const localeStr = locale ?? "en-US";
  try {
    // Intl.NumberFormat 은 심볼을 자체 처리하므로 currency 스타일 사용.
    return new Intl.NumberFormat(localeStr, {
      style: "currency",
      currency: code,
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    }).format(converted);
  } catch {
    // Fallback: 심볼 + 콤마 구분.
    const rounded = digits === 0 ? Math.round(converted) : converted;
    return `${symbol}${rounded.toLocaleString("en-US", {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    })}`;
  }
}
