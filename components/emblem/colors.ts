// 고양 BEST 엠블럼 색상·라벨 상수 (신규 파일).
// 기존 디자인 토큰 파일은 손대지 않고, 엠블럼 전용 상수만 여기 모음.
// 다크모드 반전 없음 — 자체 크림 배경을 가진 독립 배지.

export type EmblemCategory =
  | "walk"
  | "food"
  | "culture"
  | "kculture"
  | "history";

export type EmblemSize = "L" | "M" | "S" | "XS";

export type EmblemLocale = "ko" | "en" | "ja" | "zh-CN" | "zh-TW";

/** 카테고리별 브랜드 컬러 + 크림 배경 */
export const EMBLEM_COLORS: Record<EmblemCategory | "cream", string> = {
  walk: "#00A651",
  food: "#FF7A00",
  culture: "#7C3AED",
  kculture: "#F5258C",
  history: "#1D4ED8",
  cream: "#FFF8EF",
} as const;

/** 사이즈별 기본 지름 (px) */
export const EMBLEM_DIAMETERS: Record<EmblemSize, number> = {
  L: 180,
  M: 96,
  S: 48,
  XS: 28,
} as const;

/** 상단 아크 텍스트 — 5로케일 공통 고정 */
export const EMBLEM_ARC_TEXT = "GOYANG BEST" as const;

/** aria-label 접두사 (로케일별 브랜드 표기) */
export const EMBLEM_LABEL_PREFIX: Record<EmblemLocale, string> = {
  ko: "고양 BEST",
  en: "Goyang Best",
  ja: "高陽 BEST",
  "zh-CN": "高阳 BEST",
  "zh-TW": "高陽 BEST",
} as const;

/**
 * 리본 문자열 — 하드코딩 로케일 분기.
 * i18n 키 구조 변경 금지 원칙에 따라 messages 파일이 아닌 이 상수 파일에 정의.
 */
export const EMBLEM_RIBBON_TEXT: Record<
  EmblemLocale,
  Record<EmblemCategory, string>
> = {
  ko: {
    walk: "산책",
    food: "미식",
    culture: "문화",
    kculture: "K컬처",
    history: "역사",
  },
  en: {
    walk: "Walks",
    food: "Food",
    culture: "Culture",
    kculture: "K-culture",
    history: "History",
  },
  ja: {
    walk: "さんぽ",
    food: "グルメ",
    culture: "文化",
    kculture: "Kカルチャー",
    history: "歴史",
  },
  "zh-CN": {
    walk: "漫步",
    food: "美食",
    culture: "文化",
    kculture: "K文化",
    history: "历史",
  },
  "zh-TW": {
    walk: "漫步",
    food: "美食",
    culture: "文化",
    kculture: "K文化",
    history: "歷史",
  },
} as const;
