// data/ticket-categories.ts — 오더 #C51 티켓 카테고리 7종 SSOT.
//
// 배경: 기존 TicketProduct.category 는 5종 (concert · festival · exhibition · family · k-pop).
// #C51 방침:
//   · k-pop → concert 통합 (Supabase 데이터 변경 금지 · 코드에서 정규화 매핑)
//   · activity · admission · tour 신설 (체험·입장권·투어)
//   · MICE 참가권은 exhibition과 동일 구조로 다룸 (별도 카테고리 미신설)
//
// 결과: 프론트 렌더용 7종 · admin 등록용 7종 · legacy k-pop 은 concert 로 자동 매핑.

import type { TicketCategory } from "@/data/ticket-booking";

/** #C51: 프론트/admin 노출 카테고리 7종. */
export type DmcTicketCategory =
  | "concert"
  | "exhibition"
  | "festival"
  | "activity"
  | "admission"
  | "tour"
  | "family";

export const DMC_TICKET_CATEGORIES: DmcTicketCategory[] = [
  "concert",
  "exhibition",
  "festival",
  "activity",
  "admission",
  "tour",
  "family",
];

export type TicketCategoryLocale = "ko" | "en" | "ja" | "zh-CN" | "zh-TW";

/** 5로케일 라벨 · ko 폴백. */
export const TICKET_CATEGORY_LABEL: Record<DmcTicketCategory, Record<TicketCategoryLocale, string>> = {
  concert: { ko: "공연", en: "Concert", ja: "公演", "zh-CN": "演出", "zh-TW": "演出" },
  exhibition: { ko: "전시", en: "Exhibition", ja: "展示", "zh-CN": "展览", "zh-TW": "展覽" },
  festival: { ko: "축제", en: "Festival", ja: "フェスティバル", "zh-CN": "节庆", "zh-TW": "節慶" },
  activity: { ko: "체험", en: "Activity", ja: "体験", "zh-CN": "体验", "zh-TW": "體驗" },
  admission: { ko: "입장권", en: "Admission", ja: "入場券", "zh-CN": "入场券", "zh-TW": "入場券" },
  tour: { ko: "투어", en: "Tour", ja: "ツアー", "zh-CN": "游览", "zh-TW": "遊覽" },
  family: { ko: "가족", en: "Family", ja: "ファミリー", "zh-CN": "家庭", "zh-TW": "家庭" },
};

export const TICKET_CATEGORY_ALL_LABEL: Record<TicketCategoryLocale, string> = {
  ko: "전체",
  en: "All",
  ja: "すべて",
  "zh-CN": "全部",
  "zh-TW": "全部",
};

/**
 * 오더 #C51: Supabase 데이터에 남아있는 legacy "k-pop" 을 concert 로 정규화.
 * DB 데이터 변경 금지 — 렌더 시 매핑.
 * 신규 3종 (activity·admission·tour) 은 DB 값 그대로 통과.
 */
export function normalizeTicketCategory(raw: TicketCategory | DmcTicketCategory | string): DmcTicketCategory {
  if (raw === "k-pop") return "concert";
  if (
    raw === "concert" ||
    raw === "exhibition" ||
    raw === "festival" ||
    raw === "activity" ||
    raw === "admission" ||
    raw === "tour" ||
    raw === "family"
  ) {
    return raw as DmcTicketCategory;
  }
  // 미지 카테고리는 concert 로 흡수 (안전 폴백).
  return "concert";
}
