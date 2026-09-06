export type LocaleKey = "ko" | "en" | "ja" | "zh-CN" | "zh-TW";

// 방문객 앞 · 기관 뒤 원칙: best → products → dmc → institute → contact
// (오더 #P1 — 고양 가이드(best) + 상품(products) 을 앞으로, 연구원·연구는 뒤로.
//  라벨 문구는 이번 오더에서 바꾸지 않음. 신규 키 best 만 추가.)
// (오더 #C53-R [1]-D — /research 는 /institute 로 통합. NavigationKey 에서
//  "research" 제거, redirects()가 기존 URL·SEO 를 /institute 로 넘긴다.)
export type NavigationKey =
  | "best"
  | "products"
  | "dmc"
  | "institute"
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
  { key: "contact", href: "/contact" },
];

// 오더 #FINAL PART B [B-1]: /products 를 "당일코스" 로 재편.
//   URL 은 /products 유지 (라벨만 5로케일 갱신). 하위 라우트 무접촉.
// 오더 #C67 [1]-B: dmc 라벨 5로케일 → 페이지 실체(#C51 티켓 전용)에 맞춰
//   "티켓/Tickets/チケット/门票/門票" 로 교체. href="/dmc" 및 dmc 키 자체는 불변.
const koLabels: Record<NavigationKey, string> = {
  best: "고양 BEST",
  dmc: "티켓",
  products: "당일코스",
  institute: "연구소 소개",
  contact: "문의하기",
};

const enLabels: Record<NavigationKey, string> = {
  best: "Goyang Best",
  dmc: "Tickets",
  products: "Day Trips",
  institute: "About the Institute",
  contact: "Contact",
};

const jaLabels: Record<NavigationKey, string> = {
  best: "高陽ベスト",
  dmc: "チケット",
  products: "日帰り旅行",
  institute: "研究所紹介",
  contact: "お問い合わせ",
};

const zhCNLabels: Record<NavigationKey, string> = {
  best: "高阳精选",
  dmc: "门票",
  products: "一日游",
  institute: "研究所介绍",
  contact: "联系我们",
};

const zhTWLabels: Record<NavigationKey, string> = {
  best: "高陽精選",
  dmc: "門票",
  products: "一日遊",
  institute: "研究所介紹",
  contact: "聯絡我們",
};

export const navigationLabels: Record<LocaleKey, Record<NavigationKey, string>> = {
  ko: koLabels,
  en: enLabels,
  ja: jaLabels,
  "zh-CN": zhCNLabels,
  "zh-TW": zhTWLabels,
};
