// 홈 BEST 6카테고리 공용 문안 · 상수 SSOT.
// CuratedGridSection(홈)과 /best/[category] 상세 페이지 양쪽에서 import.
//
// EmblemCategory 는 `components/emblem/colors` 에 정의된 6종:
//   walk / food / culture / kculture / history / family

import type {
  EmblemCategory,
  EmblemLocale,
} from "@/components/emblem/colors";

export type CuratedLocale = EmblemLocale;

export const CURATED_CATEGORIES: EmblemCategory[] = [
  "walk",
  "food",
  "culture",
  "kculture",
  "history",
  "family",
];

/** 짧은 로케일 라벨 (카드/헤더 eyebrow, 프리뷰 인디케이터 용). */
export const CATEGORY_LABEL: Record<
  CuratedLocale,
  Record<EmblemCategory, string>
> = {
  ko: {
    walk: "산책",
    food: "미식",
    culture: "문화",
    kculture: "K컬처",
    history: "역사",
    family: "가족",
  },
  en: {
    walk: "Walks",
    food: "Food",
    culture: "Culture",
    kculture: "K-Culture",
    history: "History",
    family: "Family",
  },
  ja: {
    walk: "散策",
    food: "美食",
    culture: "文化",
    kculture: "K文化",
    history: "歴史",
    family: "ファミリー",
  },
  "zh-CN": {
    walk: "散步",
    food: "美食",
    culture: "文化",
    kculture: "K文化",
    history: "历史",
    family: "亲子",
  },
  "zh-TW": {
    walk: "散步",
    food: "美食",
    culture: "文化",
    kculture: "K文化",
    history: "歷史",
    family: "親子",
  },
};

/** 영문 태그 (모든 로케일 공통, 라벨 뒤 " · TAG" 형태). */
export const CATEGORY_TAG: Record<EmblemCategory, string> = {
  walk: "NATURE",
  food: "FOOD",
  culture: "CULTURE",
  kculture: "K-CULTURE",
  history: "HISTORY",
  family: "FAMILY",
};

/**
 * "고양 BEST {카테고리}" 로케일 헤드라인 템플릿.
 * 오더 #F0 [1]: 「N선/N Best/N選」 표기 전면 제거 — 실제 항목 수와 제목이
 *   불일치하는 문제 해소. n 인자는 시그니처만 유지 (호출부 무변경).
 */
export const HEADLINE: Record<
  CuratedLocale,
  (label: string, n: number) => string
> = {
  ko: (l) => `고양 BEST ${l}`,
  en: (l) => `Goyang Best ${l}`,
  ja: (l) => `高陽ベスト${l}`,
  "zh-CN": (l) => `高阳${l} BEST`,
  "zh-TW": (l) => `高陽${l} BEST`,
};

/**
 * 카테고리별 목표 항목 개수. 오더 #F0 [1] 이후 렌더 제목에는 등장하지 않지만,
 * 데이터 상한/기획 참고값으로 상수 유지 (CMS 이관 시 서버 값으로 대체).
 */
export const CARD_COUNT: Record<EmblemCategory, number> = {
  walk: 10,
  food: 10,
  culture: 10,
  kculture: 10,
  history: 10,
  family: 10,
};

/** 카드/헤더 서브 설명 1문장 (5로케일). 판매 소구어 0 · 안내 톤. */
export const CARD_DESC: Record<
  CuratedLocale,
  Record<EmblemCategory, string>
> = {
  ko: {
    walk: "일산호수공원부터 정발산까지, 사계절 걷기 좋은 길",
    food: "일산 카페거리부터 백석 맛집까지, 놓치면 아쉬운 한 끼",
    culture: "아람누리·꽃누리에서 만나는 이번 시즌 공연·전시",
    kculture: "킨텍스에서 열리는 K-POP·팬 이벤트의 중심",
    history: "행주산성부터 서오릉까지, 걸으며 만나는 고양의 시간",
    family: "스타필드·원마운트, 아이와 하루가 짧은 곳",
  },
  en: {
    walk: "From Ilsan Lake Park to Jeongbalsan — trails made for every season.",
    food: "From Ilsan's cafe streets to Baekseok's kitchens — a meal worth the trip.",
    culture: "This season's stages and exhibitions at Aram Nuri and Kkot Nuri.",
    kculture: "KINTEX — the hub of K-POP concerts and fan events.",
    history: "From Haengju Fortress to Seooreung — Goyang's story, on foot.",
    family: "Starfield and OneMount — where a day with the kids is never long enough.",
  },
  ja: {
    walk: "一山湖水公園から鼎鉢山まで、四季を通じて歩きたい道。",
    food: "一山カフェ通りから白石の名店まで、逃したくない一食。",
    culture: "アラムヌリ・コッヌリで出会う、今シーズンの舞台と展示。",
    kculture: "KINTEXで開かれるK-POP・ファンイベントの中心地。",
    history: "幸州山城から西五陵まで、歩いて出会う高陽の時間。",
    family: "Starfield・OneMount、子どもと過ごす一日が短い場所。",
  },
  "zh-CN": {
    walk: "从一山湖水公园到鼎钵山，四季皆宜的漫步路线。",
    food: "从一山咖啡街到白石名店，一顿不容错过的美味。",
    culture: "在阿蓝努里·花努里，遇见本季演出与展览。",
    kculture: "KINTEX——K-POP与粉丝活动的中心。",
    history: "从幸州山城到西五陵，步行走进高阳的历史。",
    family: "Starfield·OneMount，与孩子共度的一天总嫌短。",
  },
  "zh-TW": {
    walk: "從一山湖水公園到鼎缽山，四季皆宜的漫步路線。",
    food: "從一山咖啡街到白石名店，一頓不容錯過的美味。",
    culture: "在阿藍努里·花努里，遇見本季演出與展覽。",
    kculture: "KINTEX——K-POP與粉絲活動的中心。",
    history: "從幸州山城到西五陵，步行走進高陽的歷史。",
    family: "Starfield·OneMount，與孩子共度的一天總嫌短。",
  },
};

/** GOYANG INSIDERS — 카테고리별 Insider 태그라인 (5로케일). 톤: 아는 사람의 추천.
 *  구조: "{Type} Insider · {짧은 태그라인}". Type 부분(Local/Culture 등)은
 *  브랜드성 영문 라벨로 5로케일 공통 유지, 뒤 · 이하만 로케일화. */
export const INSIDER_TAGLINE: Record<
  CuratedLocale,
  Record<EmblemCategory, string>
> = {
  ko: {
    walk: "Local Insider · 고양 산책 명소를 아는 사람",
    food: "Local Food Insider · 고양 20년 주민이 고르는 맛집",
    culture: "Culture Insider · 이번 시즌 공연·전시",
    kculture: "K-Culture Insider · 현장을 아는 사람의 추천",
    history: "History Insider · 행주산성부터 고양의 시간",
    family: "Family Insider · 아이와 가기 좋은 곳",
  },
  en: {
    walk: "Local Insider · Where locals walk in Goyang",
    food: "Local Food Insider · Picks from 20-year Goyang residents",
    culture: "Culture Insider · This season's stages and exhibitions",
    kculture: "K-Culture Insider · Recommended by those who know the scene",
    history: "History Insider · Goyang's timeline, from Haengju Fortress",
    family: "Family Insider · Places to go with the kids",
  },
  ja: {
    walk: "Local Insider · 高陽の散策スポットを知る人",
    food: "Local Food Insider · 高陽20年住民が選ぶ名店",
    culture: "Culture Insider · 今シーズンの公演・展示",
    kculture: "K-Culture Insider · 現場を知る人の推薦",
    history: "History Insider · 幸州山城から高陽の時間",
    family: "Family Insider · 子どもと行きたい場所",
  },
  "zh-CN": {
    walk: "Local Insider · 熟悉高阳散步路线的人",
    food: "Local Food Insider · 高阳20年老居民推荐的餐厅",
    culture: "Culture Insider · 本季演出与展览",
    kculture: "K-Culture Insider · 熟知现场的人的推荐",
    history: "History Insider · 从幸州山城开始的高阳时间",
    family: "Family Insider · 适合带孩子去的地方",
  },
  "zh-TW": {
    walk: "Local Insider · 熟悉高陽散步路線的人",
    food: "Local Food Insider · 高陽20年老居民推薦的餐廳",
    culture: "Culture Insider · 本季演出與展覽",
    kculture: "K-Culture Insider · 熟知現場的人的推薦",
    history: "History Insider · 從幸州山城開始的高陽時間",
    family: "Family Insider · 適合帶孩子去的地方",
  },
};

/** 문자열이 유효한 카테고리 키인지 판정. 상세 페이지의 notFound() 분기용. */
export function isCuratedCategory(value: string): value is EmblemCategory {
  return (CURATED_CATEGORIES as readonly string[]).includes(value);
}
