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

const jaLabels: Record<NavigationKey, string> = {
  about: "研究所紹介",
  research: "研究分野",
  dmc: "DMCサービス",
  products: "予約",
  contact: "お問い合わせ",
};

const zhCNLabels: Record<NavigationKey, string> = {
  about: "研究所介绍",
  research: "研究领域",
  dmc: "DMC服务",
  products: "服务预约",
  contact: "联系我们",
};

const zhTWLabels: Record<NavigationKey, string> = {
  about: "研究所介紹",
  research: "研究領域",
  dmc: "DMC服務",
  products: "服務預約",
  contact: "聯絡我們",
};

export const navigationLabels: Record<LocaleKey, Record<NavigationKey, string>> = {
  ko: koLabels,
  en: enLabels,
  ja: jaLabels,
  "zh-CN": zhCNLabels,
  "zh-TW": zhTWLabels,
};
