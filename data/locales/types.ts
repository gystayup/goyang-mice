export type PageLocale = "ko" | "en" | "ja" | "zh-CN" | "zh-TW";

export type LocalizedText = {
  ko: string;
  en: string;
  ja?: string;
  "zh-CN"?: string;
  "zh-TW"?: string;
};

export function pick(locale: PageLocale, text: LocalizedText): string {
  if (locale === "en") return text.en;
  if (locale === "ja") return text.ja ?? text.ko;
  if (locale === "zh-CN") return text["zh-CN"] ?? text.ko;
  if (locale === "zh-TW") return text["zh-TW"] ?? text.ko;
  return text.ko;
}
