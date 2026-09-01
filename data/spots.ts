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
  /**
   * 오더 #C1 [3]: null 이면 「확인필요」 상태 — 렌더 규칙 상
   * 역 이름만 표시하고 시간·모드는 미표시 (#A4·#P9-e 원칙).
   * 필드 신설이 아닌 기존 필드의 nullable 완화.
   */
  minutes: number | null;
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
  /**
   * 오더 #C1 [1]: 렌더에서 사용되지 않는 부가 정보 필드. 데이터가 없어도
   * 페이지 렌더에 영향 없음. optional 완화 (필드 신설 아님, 기존 필드 완화).
   */
  practical?: SpotPractical;
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
  /**
   * 오더 #B1 [1] · 최근접 역 도보 분. 위치 한 줄 및 카드에서 사용.
   * 오더 #C4 [3]: name 은 5로케일 스왑 필요 → I18nText 로 완화.
   *   walk_min 은 「확인필요」 null 허용 (SpotAccessPoint.minutes 와 동일 원칙).
   */
  nearest_station?: { name: I18nText; walk_min: number | null };
  /** 오더 #B1 [1] · 지도 CTA·한국어 원문 카드용 공식 사이트 URL. */
  official_url?: string;
  /** 오더 #B1 [1] · GOYANG BEST 유료 슬롯 선정 여부. */
  best_selected?: boolean;
}

// 오더 #C1: 첫 실데이터 1건 (일산호수공원). spot-01-ilsan-lake-park.md 그대로.
// 「확인필요」 필드는 null 로 두어 렌더 규칙에서 스킵된다.
// nearest_station 은 name 스키마가 5로케일이 아니므로 미설정 — LocationLine
//   은 region 만 표시하고 나머지 정보는 access 4칸에서 커버.
// gallery·insider·adSlot·related·practical·map·credits 는 데이터 부재 →
//   각 렌더 규칙에서 자동 스킵된다.
export const spots: Spot[] = [
  {
    slug: "ilsan-lake-park",
    category: "walk",
    type: "list",
    region: "일산동구",
    title: {
      ko: "일산호수공원",
      en: "Ilsan Lake Park",
      ja: "一山湖水公園",
      "zh-CN": "一山湖水公园",
      "zh-TW": "一山湖水公園",
    },
    title_en_display: "ILSAN LAKE PARK",
    subtitle: {
      ko: "도심 한가운데 호수를 한 바퀴 도는 길",
      en: "A loop around the lake in the middle of the city",
      ja: "都心の真ん中で湖を一周する道",
      "zh-CN": "环绕城市中心湖泊的步道",
      "zh-TW": "環繞城市中心湖泊的步道",
    },
    lead: {
      ko: "일산신도시 한가운데 자리한 인공호수입니다. 호수를 한 바퀴 도는 산책로가 이어지고, 노래하는분수대와 장미원, 자연학습원이 길을 따라 배치돼 있어 걷는 동안 볼거리가 끊기지 않습니다. 매년 봄에는 고양국제꽃박람회가 이곳에서 열립니다.",
      en: "A man-made lake in the middle of Ilsan New Town. A walking path circles the water, with the Singing Fountain, the Rose Garden and the Nature Study Center spaced along the way, so there is always something to look at. Each spring the park hosts the Goyang International Flower Festival.",
      ja: "一山新都市の中心にある人工湖です。湖を一周する遊歩道が続き、歌う噴水台やバラ園、自然学習園が道沿いに配置されているため、歩く間も見どころが途切れません。毎年春にはここで高陽国際花博覧会が開かれます。",
      "zh-CN": "位于一山新城中心的人工湖。环湖步道贯穿全园，歌唱喷泉、玫瑰园和自然学习园沿路分布，一路都有可看之处。每年春季，高阳国际花卉博览会在此举办。",
      "zh-TW": "位於一山新城中心的人工湖。環湖步道貫穿全園，歌唱噴泉、玫瑰園和自然學習園沿路分布，一路都有可看之處。每年春季，高陽國際花卉博覽會在此舉辦。",
    },
    meta: { updated_at: "2026-08-31" },
    sections: [
      {
        heading: {
          ko: "걷는 길",
          en: "The Walk",
          ja: "歩く道",
          "zh-CN": "步道",
          "zh-TW": "步道",
        },
        body: {
          ko: "산책로는 호수를 따라 이어지며 평지에 가까워 부담 없이 걸을 수 있습니다. 자전거 대여소가 있어 걷는 대신 자전거로 도는 방문객도 많습니다. 구간에 따라 자전거 전용 노선이 나뉘어 있으니 표지판을 확인하세요.",
          en: "The path follows the shoreline and stays close to level ground, so it is an easy walk. There is a bicycle rental point, and many visitors ride instead of walk. Some stretches have separate bicycle lanes — check the signs as you go.",
          ja: "遊歩道は湖に沿って続き、ほぼ平坦なので気軽に歩けます。レンタサイクルがあり、歩く代わりに自転車で回る方も多くいます。区間によって自転車専用路が分かれているので、標識をご確認ください。",
          "zh-CN": "步道沿湖延伸，地势平缓，走起来轻松。园内设有自行车租赁点，不少访客选择骑行。部分路段设有自行车专用道，请留意指示牌。",
          "zh-TW": "步道沿湖延伸，地勢平緩，走起來輕鬆。園內設有自行車租賃點，不少訪客選擇騎行。部分路段設有自行車專用道，請留意指示牌。",
        },
      },
      {
        heading: {
          ko: "언제 가면 좋은가",
          en: "When to Go",
          ja: "いつ行くとよいか",
          "zh-CN": "何时前往",
          "zh-TW": "何時前往",
        },
        body: {
          ko: "해질 무렵이 가장 좋습니다. 호수에 도시 불빛이 비치고 기온도 내려갑니다. 여름 낮에는 그늘이 부족하니 오전 이른 시간을 권합니다. 장미원은 오뉴월에 절정을 이룹니다.",
          en: "Late afternoon into sunset is the best time — the city lights start to reflect on the water and the heat eases. On summer days there is little shade, so early morning is more comfortable. The Rose Garden peaks in May and June.",
          ja: "夕暮れ時が最も良い時間帯です。湖面に街の灯りが映り、気温も下がります。夏の日中は日陰が少ないため、早朝をおすすめします。バラ園は5〜6月が見頃です。",
          "zh-CN": "傍晚时分最佳，城市灯光倒映湖面，气温也随之下降。夏季白天遮阴较少，建议清晨前往。玫瑰园在五六月最为繁盛。",
          "zh-TW": "傍晚時分最佳，城市燈光倒映湖面，氣溫也隨之下降。夏季白天遮蔭較少，建議清晨前往。玫瑰園在五六月最為繁盛。",
        },
      },
    ],
    access: [
      { from: "GTX 킨텍스역", minutes: null, mode: "walk" },
      { from: "3호선 대화역", minutes: null, mode: "walk" },
      { from: "서울역", minutes: null, mode: "gtx" },
    ],
    know: [
      {
        ko: "노래하는분수대 — 음악에 맞춰 물줄기가 움직이는 분수입니다. 가동 시간은 계절에 따라 다릅니다.",
        en: "Singing Fountain — a fountain whose jets move in time with music. Operating times vary by season.",
        ja: "歌う噴水台 — 音楽に合わせて水柱が動く噴水です。稼働時間は季節によって異なります。",
        "zh-CN": "歌唱喷泉 — 水柱随音乐起舞的喷泉，运行时间随季节变化。",
        "zh-TW": "歌唱噴泉 — 水柱隨音樂起舞的噴泉，運行時間隨季節變化。",
      },
      {
        ko: "고양국제꽃박람회 — 매년 봄 이 공원에서 열리는 화훼 박람회입니다.",
        en: "Goyang International Flower Festival — a horticultural exhibition held here each spring.",
        ja: "高陽国際花博覧会 — 毎年春にこの公園で開かれる花の博覧会です。",
        "zh-CN": "高阳国际花卉博览会 — 每年春季在此公园举办的花卉博览会。",
        "zh-TW": "高陽國際花卉博覽會 — 每年春季在此公園舉辦的花卉博覽會。",
      },
    ],
    ko_card: [
      {
        name_ko: "일산호수공원",
        address_ko: "경기도 고양시 일산동구 호수로 595",
      },
    ],
    credits: [],
    related: [],
    info: {
      hours: "always",
      duration: "1_2h",
      admission: "free",
      access: "wheelchair",
    },
    highlights: [
      {
        ko: "호수를 한 바퀴 도는 산책로",
        en: "A walking path that circles the lake",
        ja: "湖を一周する遊歩道",
        "zh-CN": "环绕湖泊一周的步道",
        "zh-TW": "環繞湖泊一周的步道",
      },
      {
        ko: "노래하는분수대 · 장미원 · 자연학습원",
        en: "Singing Fountain, Rose Garden and Nature Study Center",
        ja: "歌う噴水台・バラ園・自然学習園",
        "zh-CN": "歌唱喷泉·玫瑰园·自然学习园",
        "zh-TW": "歌唱噴泉·玫瑰園·自然學習園",
      },
      {
        ko: "입장료 없이 시간 제한 없이 개방",
        en: "Free entry, open without time limits",
        ja: "入場無料・時間制限なしで開放",
        "zh-CN": "免费入园，无时间限制",
        "zh-TW": "免費入園，無時間限制",
      },
    ],
    adSlot: null,
    // 오더 #C4 [1]: 상단 갤러리 1장 (풀폭 렌더 규칙). hero-walk.jpg 는
    //   walk 카테고리 대표 이미지 = 호수공원 사진.
    gallery: [
      { url: "/images/hero/hero-walk.jpg", credit: "사진: 일산호수공원" },
    ],
    // 오더 #C4 [3]: 카드 하단 「지역 · 최근접역」. spot-01 md 그대로.
    //   walk_min 은 실측 미확정 → null → 렌더 시 시간 미표시.
    nearest_station: {
      name: {
        ko: "3호선 대화역",
        en: "Daehwa Stn. (Line 3)",
        ja: "3号線 大化駅",
        "zh-CN": "3号线 大化站",
        "zh-TW": "3號線 大化站",
      },
      walk_min: null,
    },
    official_url: "https://www.goyang.go.kr/visitgoyang/",
    best_selected: false,
  },
];

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
