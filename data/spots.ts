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
/**
 * ACCESS 3거점 (오더 #P9-e [10]).
 * 이전: 'KINTEX' | '일산역' | '서울역' — 일산역(경의중앙선)은 킨텍스·호수공원
 * 권역과 거리가 있어 방문객 기준점으로 부적절.
 * 이제: 실제 하차역 기준 (GTX 킨텍스역 · 3호선 대화역 · 서울역).
 */
export type SpotAccessHub = "GTX 킨텍스역" | "3호선 대화역" | "서울역";

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

// ─── #B1 스키마 확장 ────────────────────────────────────────────────────────
// 오더 #B1 · spot-detail-data.md 「스키마 확장」 그대로.
// 기존 필드 삭제 없음. price·booking·reservation 필드 신설 금지.

export interface SpotGalleryImage {
  url: string;
  credit?: string;
}

export type SpotInfoHours = "always" | "varies" | "seasonal" | "inquiry";
export type SpotInfoDuration = "30min" | "1h" | "1_2h" | "half_day" | "full_day";
export type SpotInfoAdmission = "free" | "paid" | "varies" | "inquiry";
export type SpotInfoAccess = "wheelchair" | "partial" | "inquiry";

export interface SpotInfo {
  hours: SpotInfoHours;
  duration: SpotInfoDuration;
  admission: SpotInfoAdmission;
  access: SpotInfoAccess;
}

export interface SpotInsider {
  role: I18nText;
  quote: I18nText;
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
  /** 오더 #B1 [1] · 최대 4장. 0장이면 갤러리 블록 자체 미렌더. */
  gallery?: SpotGalleryImage[];
  /** 오더 #B1 [1] · 아이콘 4칸 (열거형 라벨은 상수 맵으로 렌더). */
  info: SpotInfo;
  /** 오더 #B1 [1] · 정확히 3개. 부족하면 있는 만큼만 렌더. */
  highlights: I18nText[];
  /** 오더 #B1 [1] · 없으면 인사이더 박스는 지도 CTA·공식 사이트·BEST 배지만 렌더. */
  insider?: SpotInsider;
  /** 오더 #B1 [1] · R6 에서 채움. null 이면 광고 블록 미렌더. */
  adSlot: null;
  /** 오더 #B1 [1] · 최근접 역 도보 분. 위치 한 줄 및 헤더에서 사용. */
  nearest_station?: { name: string; walk_min: number };
  /** 오더 #B1 [1] · 지도 CTA·한국어 원문 카드용 공식 사이트 URL. */
  official_url?: string;
  /** 오더 #B1 [1] · GOYANG BEST 유료 슬롯 선정 여부. */
  best_selected?: boolean;
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

/**
 * NEARBY — 같은 카테고리의 다른 spot 최대 3개 (오더 #B1 화면 구성 7).
 * spots 배열이 0건인 상태에서는 항상 빈 배열.
 */
export function getNearbySpots(slug: string): Spot[] {
  const target = getSpot(slug);
  if (!target) return [];
  return spots
    .filter((s) => s.category === target.category && s.slug !== target.slug)
    .slice(0, 3);
}
