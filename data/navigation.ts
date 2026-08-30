export type LocaleKey = "ko" | "en" | "ja" | "zh-CN" | "zh-TW";

// 방문객 앞 · 기관 뒤 원칙: best → products → dmc → institute → research → contact
// (오더 #P1 — 고양 가이드(best) + 상품(products) 을 앞으로, 연구원·연구는 뒤로.
//  라벨 문구는 이번 오더에서 바꾸지 않음. 신규 키 best 만 추가.)
export type NavigationKey =
  | "best"
  | "products"
  | "dmc"
  | "institute"
  | "research"
  | "contact";

export interface NavigationItem {
  key: NavigationKey;
  href: string;
}

export const navigation: NavigationItem[] = [
  { key: "best", href: "/best" },
  { key: "products", href: "/products" },
  { key: "dmc", href: "/dmc" },
  { key: "institute", href: "/institute" },
  { key: "research", href: "/research" },
  { key: "contact", href: "/contact" },
];

const koLabels: Record<NavigationKey, string> = {
  best: "고양 BEST",
  dmc: "고양 여행·체험",
  products: "서비스 안내",
  institute: "연구소 소개",
  research: "연구 분야",
  contact: "문의하기",
};

const enLabels: Record<NavigationKey, string> = {
  best: "Goyang Best",
  dmc: "Goyang Experiences",
  products: "Services",
  institute: "About the Institute",
  research: "Research",
  contact: "Contact",
};

const jaLabels: Record<NavigationKey, string> = {
  best: "高陽ベスト",
  dmc: "高陽の旅・体験",
  products: "サービス案内",
  institute: "研究所紹介",
  research: "研究分野",
  contact: "お問い合わせ",
};

const zhCNLabels: Record<NavigationKey, string> = {
  best: "高阳精选",
  dmc: "高阳旅行·体验",
  products: "服务指南",
  institute: "研究所介绍",
  research: "研究领域",
  contact: "联系我们",
};

const zhTWLabels: Record<NavigationKey, string> = {
  best: "高陽精選",
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
