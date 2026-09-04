// 당일코스 SSOT (axis 메타) — 오더 #C57 [1][2] 재편.
//
// 진화:
//   · #FINAL PART B [B-1] · #C16 · #C33: 지역 2축(서울/경기) + 8 destinations 하드코딩.
//   · #C57 [1][2]: destinations 제거. 3축(서울/파주/경기) 메타만 유지.
//     실제 코스는 lib/day-trip-catalog-db.ts → data/day-trip-courses.ts (17코스) 로 이동.
//     · admin 등록 코스는 Supabase pages · pageKey='day-trip-catalog'.
//     · DB 없거나 실패 → 정적 시드 17코스로 폴백.
//
// 이 파일은 축 배지 색상·라벨·서브라인만 담는다. 창작·의역 금지.
// 판매 없음 — price·booking·reservation 필드 없음.

import type { DayTripAxis } from "@/data/day-trip-courses";

export type DayTripLocale = "ko" | "en" | "ja" | "zh-CN" | "zh-TW";
export type DayTripI18n = Record<DayTripLocale, string>;

export interface DayTripAxisBlock {
  key: DayTripAxis;
  label: DayTripI18n;
  subline: DayTripI18n;
  /** 카드/링 gradient 폴백용 hex. */
  color: string;
}

// ─── 3축 메타 ─────────────────────────────────────────────────────────────

const SEOUL_AXIS: DayTripAxisBlock = {
  key: "seoul",
  label: {
    ko: "서울",
    en: "Seoul",
    ja: "ソウル",
    "zh-CN": "首尔",
    "zh-TW": "首爾",
  },
  subline: {
    ko: "환승 없이 궁궐·야경·핫플까지",
    en: "To palaces, night views and hot spots — no transfers",
    ja: "乗換なしで宮殿・夜景・話題スポットへ",
    "zh-CN": "无换乘直达宫殿·夜景·热门景点",
    "zh-TW": "無轉乘直達宮殿·夜景·熱門景點",
  },
  color: "#0F766E",
};

const PAJU_AXIS: DayTripAxisBlock = {
  key: "paju",
  label: {
    ko: "파주 · DMZ",
    en: "Paju · DMZ",
    ja: "坡州・DMZ",
    "zh-CN": "坡州·DMZ",
    "zh-TW": "坡州·DMZ",
  },
  subline: {
    ko: "Stay in Goyang. Visit the DMZ in Half a Day.",
    en: "Stay in Goyang. Visit the DMZ in Half a Day.",
    ja: "Stay in Goyang. Visit the DMZ in Half a Day.",
    "zh-CN": "Stay in Goyang. Visit the DMZ in Half a Day.",
    "zh-TW": "Stay in Goyang. Visit the DMZ in Half a Day.",
  },
  color: "#B45309",
};

const GYEONGGI_AXIS: DayTripAxisBlock = {
  key: "gyeonggi",
  label: {
    ko: "경기",
    en: "Gyeonggi",
    ja: "京畿",
    "zh-CN": "京畿",
    "zh-TW": "京畿",
  },
  subline: {
    ko: "4시간부터 하루까지, 남은 시간에 맞춰 고르는 코스",
    en: "Courses from 4 hours to a full day — pick by time left",
    ja: "4時間から1日まで、残り時間に合わせて選ぶコース",
    "zh-CN": "从4小时到全天，按剩余时间挑选的路线",
    "zh-TW": "從4小時到全天，依剩餘時間挑選的路線",
  },
  color: "#DB2777",
};

/** 3축 배열 (순서: 서울 · 파주 · 경기). */
export const dayTripAxes: DayTripAxisBlock[] = [SEOUL_AXIS, PAJU_AXIS, GYEONGGI_AXIS];

/** axis key → 메타 조회. */
export function getAxisBlock(key: DayTripAxis): DayTripAxisBlock {
  return dayTripAxes.find((a) => a.key === key) ?? SEOUL_AXIS;
}

/** 페이지 헤더 문안 (5로케일). */
export const DAY_TRIPS_PAGE_COPY: {
  eyebrow: DayTripI18n;
  title: DayTripI18n;
  subtitle: DayTripI18n;
  anchorLabel: DayTripI18n;
} = {
  eyebrow: {
    ko: "GOYANG DAY TRIPS",
    en: "GOYANG DAY TRIPS",
    ja: "GOYANG DAY TRIPS",
    "zh-CN": "GOYANG DAY TRIPS",
    "zh-TW": "GOYANG DAY TRIPS",
  },
  title: {
    ko: "Stay in Goyang. Reach all of Korea in half a day.",
    en: "Stay in Goyang. Reach all of Korea in half a day.",
    ja: "Stay in Goyang. Reach all of Korea in half a day.",
    "zh-CN": "Stay in Goyang. Reach all of Korea in half a day.",
    "zh-TW": "Stay in Goyang. Reach all of Korea in half a day.",
  },
  subtitle: {
    ko: "서울 6 · 파주 6 · 경기 5 — 총 17코스",
    en: "Seoul 6 · Paju 6 · Gyeonggi 5 — 17 courses in all",
    ja: "ソウル6・坡州6・京畿5 — 全17コース",
    "zh-CN": "首尔6·坡州6·京畿5 — 共17条路线",
    "zh-TW": "首爾6·坡州6·京畿5 — 共17條路線",
  },
  anchorLabel: {
    ko: "기준점: KINTEX (일산서구 대화동)",
    en: "Anchor: KINTEX (Daehwa-dong, Ilsan-seo)",
    ja: "基準点: KINTEX (一山西区 大化洞)",
    "zh-CN": "基准点: KINTEX (一山西区 大化洞)",
    "zh-TW": "基準點: KINTEX (一山西區 大化洞)",
  },
};
