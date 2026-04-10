export type LocaleKey = "ko" | "en" | "ja" | "zh-CN" | "zh-TW";

export type NavigationKey =
  | "about"
  | "research"
  | "dmc"
  | "products"
  | "contact";

export interface NavigationItem {
  key: NavigationKey;
  href: string;
}

export const navigation: NavigationItem[] = [
  { key: "about", href: "/about" },
  { key: "research", href: "/research" },
  { key: "dmc", href: "/dmc" },
  { key: "products", href: "/products" },
  { key: "contact", href: "/contact" },
];

const koLabels: Record<NavigationKey, string> = {
  about: "연구소 소개",
  research: "연구 분야",
  dmc: "DMC 서비스",
  products: "서비스 예약",
  contact: "문의하기",
};

const enLabels: Record<NavigationKey, string> = {
  about: "About",
  research: "Research",
  dmc: "DMC Services",
  products: "Bookings",
  contact: "Contact",
};

export const navigationLabels: Record<LocaleKey, Record<NavigationKey, string>> = {
  ko: koLabels,
  en: enLabels,
  ja: enLabels,
  "zh-CN": enLabels,
  "zh-TW": enLabels,
};
