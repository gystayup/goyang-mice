// data/spots.ts
// /dmc/[slug] "소개층" 데이터 SSOT (오더 #P7).
//
// 3층 구조:
//   /best/[cat]  → 목록층 (리스트)
//   /dmc/[slug]  → 소개층 (장소 1곳)   ← 이 파일이 소비됨
//   /products    → 업체 카탈로그
//
// 이 오더에서는 구조만 신설. items 배열은 빈 상태로 시작한다.
// 콘텐츠는 별도 오더로 채운다.
//
// 판매 불가 구조 고정 — price/booking/reservation 필드 신설 금지.

import type { EmblemCategory } from "@/components/emblem/colors";

export type SpotLocale = "ko" | "en" | "ja" | "zh-CN" | "zh-TW";
export const SPOT_LOCALES: SpotLocale[] = ["ko", "en", "ja", "zh-CN", "zh-TW"];

export type I18nText = Record<SpotLocale, string>;

export type SpotCategory = EmblemCategory;
export type SpotType = "list" | "course";

/** ACCESS 3거점 고정 (한글 원문). */
export type SpotAccessHub = "KINTEX" | "일산역" | "서울역";

export interface SpotLeg {
  /** 구간 시작점 (한글 원문). */
  from: string;
  /** 구간 도착점 (한글 원문). */
  to: string;
  walk_min: number;
  /** 구간 관전 포인트. */
  point: I18nText;
}

export interface SpotSection {
  heading: I18nText;
  body: I18nText;
  image?: string;
  image_credit?: string;
}

export interface SpotAccessPoint {
  from: SpotAccessHub;
  minutes: number;
  /** '지하철', '버스', '자가용' 등 (i18n 미적용 — 아이콘/약어 위주). */
  mode: string;
}

export interface SpotPractical {
  best_time: I18nText;
  parking: I18nText;
  payment: I18nText;
  closed_day: I18nText;
  restroom: I18nText;
}

export interface SpotKoCard {
  name_ko: string;
  address_ko: string;
}

export interface SpotMap {
  lat: number;
  lng: number;
  label: string;
}

export interface SpotCredit {
  caption: string;
  source: string;
  url?: string;
}

export interface Spot {
  slug: string;
  category: SpotCategory;
  type: SpotType;
  /** data/regions.ts key 참조. */
  region: string;
  title: I18nText;
  /** 영문 대제목 (5로케일 공통 표기). */
  title_en_display: string;
  subtitle: I18nText;
  lead: I18nText;
  meta: {
    distance_km?: number;
    duration_min?: number;
    read_min?: number;
    /** ISO YYYY-MM-DD. */
    updated_at: string;
  };
  /** type='course' 만 사용. */
  legs?: SpotLeg[];
  sections: SpotSection[];
  access: SpotAccessPoint[];
  practical: SpotPractical;
  know: I18nText[];
  ko_card: SpotKoCard[];
  map?: SpotMap[];
  credits: SpotCredit[];
  /** 관련 spot slug 배열 — 상세 하단 "관련 3개" 렌더. */
  related: string[];
}

// 콘텐츠는 별도 오더에서 채운다. 지금은 빈 배열로 골격만 확정.
export const spots: Spot[] = [];

export function getSpot(slug: string): Spot | null {
  return spots.find((s) => s.slug === slug) ?? null;
}

export function hasSpot(slug: string): boolean {
  return spots.some((s) => s.slug === slug);
}

export function getRelatedSpots(slug: string): Spot[] {
  const target = getSpot(slug);
  if (!target) return [];
  return target.related
    .map((s) => getSpot(s))
    .filter((s): s is Spot => s !== null)
    .slice(0, 3);
}
