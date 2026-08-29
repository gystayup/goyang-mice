export type LocaleKey = "ko" | "en" | "ja" | "zh-CN" | "zh-TW";

// 방문객 앞 · 기관 뒤 원칙: dmc → products → institute → research → contact
// (오더 #N — Header/Footer 통일 소스. 두 컴포넌트 모두 이 파일을 참조.)
export type NavigationKey =
  | "dmc"
  | "products"
  | "institute"
  | "research"
  | "contact";

export interface NavigationItem {
  key: NavigationKey;
  href: string;
}

export const navigation: NavigationItem[] = [
  { key: "dmc", href: "/dmc" },
  { key: "products", href: "/products" },
  { key: "institute", href: "/institute" },
  { key: "research", href: "/research" },
  { key: "contact", href: "/contact" },
];

const koLabels: Record<NavigationKey, string> = {
  dmc: "고양 여행·체험",
  products: "서비스 안내",
  institute: "연구소 소개",
  research: "연구 분야",
  contact: "문의하기",
};

const enLabels: Record<NavigationKey, string> = {
  dmc: "Goyang Experiences",
  products: "Services",
  institute: "About the Institute",
  research: "Research",
  contact: "Contact",
};

const jaLabels: Record<NavigationKey, string> = {
  dmc: "高陽の旅・体験",
  products: "サービス案内",
  institute: "研究所紹介",
  research: "研究分野",
  contact: "お問い合わせ",
};

const zhCNLabels: Record<NavigationKey, string> = {
  dmc: "高阳旅行·体验",
  products: "服务指南",
  institute: "研究所介绍",
  research: "研究领域",
  contact: "联系我们",
};

const zhTWLabels: Record<NavigationKey, string> = {
  dmc: "高陽旅行·體驗",
  products: "服務指南",
  institute: "研究所介紹",
  research: "研究領域",
  contact: "聯絡我們",
};

export const navigationLabels: Record<LocaleKey, Record<NavigationKey, string>> = {
  ko: koLabels,
  en: enLabels,
  ja: jaLabels,
  "zh-CN": zhCNLabels,
  "zh-TW": zhTWLabels,
};
