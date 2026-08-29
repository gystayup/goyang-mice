// 홈 BEST 카테고리별 "10선" 큐레이션 콘텐츠 (Phase 1: 골격만, items 전부 []).
//
// Phase 4에서 각 카테고리 items 배열에 10곳씩 push 예정.
// 로케일 번역은 translations 에 id 매핑으로 override.
// region 은 data/regions.ts 의 key 를 참조 (다중 지역이면 regions[]).
//
// DB 이관 시 (Phase 후반) 이 파일은 fallback 역할로 유지되고,
// readCuratedStories() 헬퍼가 DB 우선 · 이 파일 fallback 패턴으로 로드.

import type {
  EmblemCategory,
  EmblemLocale,
} from "@/components/emblem/colors";

export type CuratedCategory = EmblemCategory;
export type CuratedItemLocale = Exclude<EmblemLocale, "ko">;

export interface CuratedItem {
  /** URL·번역 오버라이드 참조용 kebab-case */
  id: string;
  /** 10선 랭킹 (선택) */
  rank?: number;
  /** ko 기본 이름 (예: "일산호수공원") */
  name: string;
  subtitle?: string;
  desc: string;
  address?: string;
  hours?: string;
  photoUrl?: string;
  tags?: string[];
  /** 단일 지역 (data/regions.ts key 참조) */
  region?: string;
  /** 다중 지역 (예: 행주산성+일산 조합) */
  regions?: string[];
  links?: Array<{ label: string; url: string }>;
  /** "고양 BEST 선정" 배지 — 유료 광고 슬롯 여부 (오더 #BEST2, 값은 Phase 4). */
  featured?: boolean;
  /**
   * INSIDERS "얼굴 있는 소개" — 업체 사장·셰프 등 인물 카드 (오더 #BEST2).
   * 데이터 들어오면 아이템 카드에 인물 슬롯 렌더 (Phase 4).
   */
  host?: {
    name: string;
    title: string;
    photoUrl?: string;
  };
}

export interface CuratedItemTranslation {
  name?: string;
  subtitle?: string;
  desc?: string;
  address?: string;
  hours?: string;
  tags?: string[];
}

export interface CuratedStory {
  category: CuratedCategory;
  items: CuratedItem[];
  translations?: Partial<
    Record<CuratedItemLocale, Record<string, CuratedItemTranslation>>
  >;
}

export const curatedStories: Record<CuratedCategory, CuratedStory> = {
  walk: { category: "walk", items: [] },
  food: { category: "food", items: [] },
  culture: { category: "culture", items: [] },
  kculture: { category: "kculture", items: [] },
  history: { category: "history", items: [] },
  family: { category: "family", items: [] },
};

export function getCuratedStory(cat: CuratedCategory): CuratedStory {
  return curatedStories[cat];
}
