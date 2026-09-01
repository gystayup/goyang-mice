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
  /**
   * 오더 #C5: 「확인필요」 항목은 null 로 두고 주소 줄 렌더 생략.
   *   기존 필드의 nullable 완화 (필드 신설 아님).
   */
  address_ko: string | null;
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

// 오더 #D3 [1]: TourAPI 이미지 저작권 구분.
//   Type1 (공공누리 제1유형, 자유이용) — 카드·상세 모두 사용, 크롭 허용.
//   Type3 (공공누리 제3유형, 원본유지) — 상세 페이지에서 원본 비율 단독 배치.
//                                         카드 사용 금지, 크롭·필터·오버레이 금지.
export type SpotImageCpyrht = "Type1" | "Type3";

export interface SpotGalleryImage {
  url: string;
  credit?: string;
  /** 오더 #D3 [1]: 카드/상세 렌더 분기용. TourAPI 외 이미지는 미설정. */
  cpyrht?: SpotImageCpyrht;
}

/**
 * 오더 #D3 [1]: TourAPI (KorService2) 원본 데이터를 스팟에 붙인다.
 *   overview_ko 는 detailCommon2 의 overview 필드 HTML 태그 strip 후 저장.
 *   문안 대체 목적이 아니라 참조·크레딧용. UI 는 기존 lead/subtitle/highlights 유지.
 */
export interface SpotTourApi {
  contentid: string;
  overview_ko: string;
  homepage?: string;
  tel?: string;
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
  /**
   * 오더 #D3 [1]: TourAPI 원본 데이터 (contentid, overview_ko, homepage, tel).
   *   문안 대체용 아님 — 기존 lead/subtitle/highlights 는 그대로.
   *   overview 는 참고·크레딧 표기용. UI 는 필요 시 별도 배치.
   */
  tourapi?: SpotTourApi;
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
    // 오더 #D3 [2]: TourAPI contentid 127197 detailCommon2 주소로 갱신.
    ko_card: [
      {
        name_ko: "일산호수공원",
        address_ko: "경기도 고양시 일산동구 호수로 595 (장항동)",
      },
    ],
    // 오더 #D3 [2]: TourAPI 좌표 (mapy=lat, mapx=lng).
    map: [{ lat: 37.657058, lng: 126.763855, label: "일산호수공원" }],
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
    // 오더 #D3 [3]: TourAPI Type1 상위 3장 (다운로드 저장). hero-walk.jpg 대체.
    gallery: [
      { url: "/images/spots/ilsan-lake-park-1.jpg", credit: "출처: 한국관광공사 (공공누리 제1유형)", cpyrht: "Type1" },
      { url: "/images/spots/ilsan-lake-park-2.jpg", credit: "출처: 한국관광공사 (공공누리 제1유형)", cpyrht: "Type1" },
      { url: "/images/spots/ilsan-lake-park-3.jpg", credit: "출처: 한국관광공사 (공공누리 제1유형)", cpyrht: "Type1" },
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
    // 오더 #D3 [2]: TourAPI homepage 로 official_url 갱신.
    official_url: "http://www.goyang.go.kr/park",
    best_selected: false,
    // 오더 #D3 [1][2]: TourAPI 원본 (문안 대체 아님).
    tourapi: {
      contentid: "127197",
      overview_ko: "일산호수공원은 일산신도시 택지개발사업과 연계하여 조성한 근린공원이다. 국내 최대의 인공호수를 만들어 도시인이 접할 수 없는 자연생태계를 재현하고 다양한 주변경관 및 호수를 이용한 레크레이션 공간을 제공하고 있다. 특히 호수를 중심으로 한 4.7㎞의 자전거도로와 메타세쿼이아길 등 9.1㎞의 산책로는 시민들이 특별히 좋아하는 장소이다. 이외에도 생태자연학습장, 조형예술품, 선인장전시관 등이 다양한 생태문화시설이 조성되어 있다. 또한 매년 고양국제꽃박람회, 가을꽃축제, 호수예술축제 등이 개최되는 등 국내는 물론 세계적인 명소로 자리 잡아가고 있는 공원이다.",
      homepage: "http://www.goyang.go.kr/park",
    },
  },

  // ─── 오더 #C5: 산책 10선 02~10 (spots-walk-02-10.md 그대로) ─────────────
  // 공통: gallery/insider 미설정, adSlot=null, credits=[], access=[] (md 에 access
  //   hub 미명시 → 임의 생성 금지), map/practical 미설정, ko_card.address_ko=null
  //   (「확인필요」), official_url 미설정 (「확인필요」).

  {
    slug: "jeongbalsan-park",
    category: "walk",
    type: "list",
    region: "일산동구",
    title: {
      ko: "정발산근린공원",
      en: "Jeongbalsan Park",
      ja: "鼎鉢山近隣公園",
      "zh-CN": "鼎钵山近邻公园",
      "zh-TW": "鼎缽山近鄰公園",
    },
    title_en_display: "JEONGBALSAN PARK",
    subtitle: {
      ko: "도심에서 바로 오르는 낮은 산",
      en: "A low hill you can climb straight from downtown",
      ja: "都心からすぐ登れる低い山",
      "zh-CN": "从市中心即可登上的小山",
      "zh-TW": "從市中心即可登上的小山",
    },
    lead: {
      ko: "일산 도심 한가운데 솟은 낮은 산입니다. 정상까지 오르는 데 오래 걸리지 않아 짧은 산책으로 알맞고, 정상에서는 일산 시가지가 내려다보입니다. 산 위에는 한옥 정자 평심루가 있습니다.",
      en: "A low hill rising in the middle of Ilsan. The climb is short enough for a quick walk, and from the top you look out over the city. A traditional pavilion, Pyeongsimnu, stands at the summit.",
      ja: "一山の中心にそびえる低い山です。頂上まで長くかからず短い散策にちょうどよく、頂上からは一山の市街地を見渡せます。山上には韓屋の東屋・平心楼があります。",
      "zh-CN": "矗立在一山市中心的小山。登顶用时不长，适合短途散步，山顶可俯瞰一山市区，并建有韩屋亭阁平心楼。",
      "zh-TW": "矗立在一山市中心的小山。登頂用時不長，適合短途散步，山頂可俯瞰一山市區，並建有韓屋亭閣平心樓。",
    },
    meta: { updated_at: "2026-09-01" },
    sections: [],
    access: [],
    know: [],
    // 오더 #D3 [2]: TourAPI 2733846 주소 (addr2=819 포함).
    ko_card: [{ name_ko: "정발산근린공원", address_ko: "경기도 고양시 일산동구 마두동 819" }],
    // 오더 #D3 [2]: TourAPI 좌표.
    map: [{ lat: 37.663, lng: 126.7785, label: "정발산근린공원" }],
    credits: [],
    related: [],
    info: { hours: "always", duration: "1h", admission: "free", access: "partial" },
    highlights: [
      { ko: "정상까지 짧게 오르는 코스", en: "A short climb to the summit", ja: "頂上まで短く登るコース", "zh-CN": "短途登顶路线", "zh-TW": "短途登頂路線" },
      { ko: "한옥 정자 평심루", en: "Pyeongsimnu, a traditional pavilion", ja: "韓屋の東屋・平心楼", "zh-CN": "韩屋亭阁平心楼", "zh-TW": "韓屋亭閣平心樓" },
      { ko: "정상에서 내려다보는 일산 시가지", en: "City views from the top", ja: "頂上から見渡す一山市街地", "zh-CN": "山顶俯瞰一山市区", "zh-TW": "山頂俯瞰一山市區" },
    ],
    adSlot: null,
    // 오더 #D3 [3]: TourAPI Type1 상위 3장.
    gallery: [
      { url: "/images/spots/jeongbalsan-park-1.jpg", credit: "출처: 한국관광공사 (공공누리 제1유형)", cpyrht: "Type1" },
      { url: "/images/spots/jeongbalsan-park-2.jpg", credit: "출처: 한국관광공사 (공공누리 제1유형)", cpyrht: "Type1" },
      { url: "/images/spots/jeongbalsan-park-3.jpg", credit: "출처: 한국관광공사 (공공누리 제1유형)", cpyrht: "Type1" },
    ],
    nearest_station: {
      name: {
        ko: "3호선 정발산역",
        en: "Jeongbalsan Stn. (Line 3)",
        ja: "3号線 鼎鉢山駅",
        "zh-CN": "3号线 鼎钵山站",
        "zh-TW": "3號線 鼎缽山站",
      },
      walk_min: null,
    },
    best_selected: false,
    // 오더 #D3 [1][2]: TourAPI 원본. homepage 부재.
    tourapi: {
      contentid: "2733846",
      overview_ko: "고양시 일산지역에 위치한 정발산은 해발 90m가 되지 않는 야트막한 산이다. 오래전 이 일대에 정 씨와 박 씨가 살아 정박산이 되었다가 후에 정발산이 되었다는 유래가 있다. 일산호수공원과 가까이 있어 산책을 하거나 데이트하기 좋고, 배드민턴장과 도서관, 전망대를 갖추고 있다. 산이라고 하지만 아이들도 즐길 수 있을 만큼 낮은 언덕으로 이루어진 공원이다.",
    },
  },

  {
    slug: "haengju-fortress",
    category: "walk",
    type: "list",
    region: "덕양구",
    title: {
      ko: "행주산성",
      en: "Haengju Fortress",
      ja: "幸州山城",
      "zh-CN": "幸州山城",
      "zh-TW": "幸州山城",
    },
    title_en_display: "HAENGJU FORTRESS",
    subtitle: {
      ko: "한강을 내려다보며 걷는 성곽길",
      en: "A fortress walk overlooking the Han River",
      ja: "漢江を見下ろしながら歩く城郭の道",
      "zh-CN": "俯瞰汉江的城郭步道",
      "zh-TW": "俯瞰漢江的城郭步道",
    },
    lead: {
      ko: "한강 변 언덕에 자리한 산성입니다. 성곽을 따라 이어지는 길에서 한강과 서울 방향이 한눈에 들어옵니다. 임진왜란 당시 행주대첩이 벌어진 곳으로, 산책과 역사 답사를 함께 할 수 있습니다.",
      en: "A hilltop fortress beside the Han River. The path along the walls opens onto wide views of the river and Seoul beyond. It is the site of the Battle of Haengju during the Imjin War, so a walk here doubles as a history visit.",
      ja: "漢江沿いの丘にある山城です。城郭に沿った道からは漢江とソウル方面が一望できます。壬辰倭乱の幸州大捷の舞台であり、散策と歴史探訪を兼ねられます。",
      "zh-CN": "位于汉江畔山丘上的山城。沿城墙的步道可一览汉江与首尔方向。此处是壬辰倭乱幸州大捷的战场，散步之余亦可探访历史。",
      "zh-TW": "位於漢江畔山丘上的山城。沿城牆的步道可一覽漢江與首爾方向。此處是壬辰倭亂幸州大捷的戰場，散步之餘亦可探訪歷史。",
    },
    meta: { updated_at: "2026-09-01" },
    sections: [],
    access: [],
    know: [
      { ko: "행주대첩 — 1593년 임진왜란 중 이곳에서 벌어진 전투입니다.", en: "Battle of Haengju — a 1593 engagement fought here during the Imjin War.", ja: "幸州大捷 — 1593年、壬辰倭乱中にここで行われた戦いです。", "zh-CN": "幸州大捷 — 1593年壬辰倭乱期间在此发生的战役。", "zh-TW": "幸州大捷 — 1593年壬辰倭亂期間在此發生的戰役。" },
    ],
    // 오더 #D3 [2]: TourAPI 125562 주소.
    ko_card: [{ name_ko: "행주산성", address_ko: "경기도 고양시 덕양구 행주로15번길 89" }],
    // 오더 #D3 [2]: TourAPI 좌표.
    map: [{ lat: 37.5960655816, lng: 126.8264548944, label: "행주산성" }],
    credits: [],
    related: [],
    info: { hours: "varies", duration: "1_2h", admission: "paid", access: "partial" },
    highlights: [
      { ko: "한강과 서울이 보이는 조망", en: "Views of the Han River and Seoul", ja: "漢江とソウルを望む眺め", "zh-CN": "眺望汉江与首尔", "zh-TW": "眺望漢江與首爾" },
      { ko: "성곽을 따라 이어지는 길", en: "A path along the fortress walls", ja: "城郭に沿って続く道", "zh-CN": "沿城墙延伸的步道", "zh-TW": "沿城牆延伸的步道" },
      { ko: "행주대첩 유적", en: "Site of the Battle of Haengju", ja: "幸州大捷の史跡", "zh-CN": "幸州大捷遗址", "zh-TW": "幸州大捷遺址" },
    ],
    adSlot: null,
    // 오더 #D3 [3]: TourAPI Type1 상위 3장 (Type3 8장은 제외).
    gallery: [
      { url: "/images/spots/haengju-fortress-1.jpg", credit: "출처: 한국관광공사 (공공누리 제1유형)", cpyrht: "Type1" },
      { url: "/images/spots/haengju-fortress-2.jpg", credit: "출처: 한국관광공사 (공공누리 제1유형)", cpyrht: "Type1" },
      { url: "/images/spots/haengju-fortress-3.jpg", credit: "출처: 한국관광공사 (공공누리 제1유형)", cpyrht: "Type1" },
    ],
    nearest_station: {
      name: { ko: "버스", en: "Bus", ja: "バス", "zh-CN": "公交", "zh-TW": "公車" },
      walk_min: null,
    },
    // 오더 #D3 [2]: TourAPI homepage.
    official_url: "http://www.goyang.go.kr",
    best_selected: false,
    // 오더 #D3 [1][2]: TourAPI 원본.
    tourapi: {
      contentid: "125562",
      overview_ko: "행주산성은 경기도 고양시 덕양구 행주내동 덕양산의 7, 8부 능선에 쌓은 테뫼식[山頂式] 성으로 흙을 이용해서 쌓은 산성이다. 덕양산 정상부를 에워싼 소규모의 내성[內城]과 북쪽으로 뻗은 골짜기를 에워싼 외성[外城]의 이중구조로 강안의 험한 절벽을 이용하고 동, 북, 서로 전개된 넓은 평야를 감싸고 있다. 성안에서는 삼국시대의 적갈색 연질 토기와 회청색 경질토기 등의 조각을 비롯하여 어골문[魚骨文], 수지문[手指文]이 새겨진 기왓조각도 발견되고 있어 고려 시대까지도 사용된 것으로 보인다. 임진왜란 당시 권율[權慄] 장군이 의병과 승명을 포함한 2천3백 명과 함께 왜군 3만여 명을 크게 물리쳤다. 왜군을 격파하여 나라를 위기에서 벗어나게 하는데 큰 공을 세운 충장공 권율 도원수의 행주대첩을 기념하기 위한 매년 제례행사와 그 밖의 여러 가지 문화 행사가 개최되고 있다. 권율 도원수의 영정이 모셔져 있는 충장사에서 행해지는 이 제례에는 장군의 영혼을 불러들이기 위해 향을 피우고 제례를 지낸다. 선조들의 나라 사랑하는 마음과 지혜를 배울 수 있는 곳이다.",
      homepage: "http://www.goyang.go.kr",
    },
  },

  {
    slug: "changneungcheon-trail",
    category: "walk",
    type: "list",
    region: "덕양구",
    title: {
      ko: "창릉천 산책로",
      en: "Changneungcheon Trail",
      ja: "昌陵川遊歩道",
      "zh-CN": "昌陵川步道",
      "zh-TW": "昌陵川步道",
    },
    title_en_display: "CHANGNEUNGCHEON TRAIL",
    subtitle: {
      ko: "물길을 따라 이어지는 평지 코스",
      en: "A flat route along the stream",
      ja: "水辺に沿って続く平坦なコース",
      "zh-CN": "沿溪流延伸的平坦路线",
      "zh-TW": "沿溪流延伸的平坦路線",
    },
    lead: {
      ko: "덕양구를 흐르는 하천을 따라 이어지는 산책로입니다. 오르내림이 거의 없어 걷기 편하고, 자전거를 타는 사람도 많습니다. 계절에 따라 물가 풍경이 달라집니다.",
      en: "A walking path that follows a stream through Deogyang-gu. It is almost entirely flat, easy on the legs, and popular with cyclists. The waterside scenery changes with the seasons.",
      ja: "徳陽区を流れる川に沿って続く遊歩道です。高低差がほとんどなく歩きやすく、自転車を利用する人も多くいます。季節によって水辺の風景が変わります。",
      "zh-CN": "沿德阳区河川延伸的步道。几乎没有坡度，走起来轻松，骑行者也不少。水边景色随季节变化。",
      "zh-TW": "沿德陽區河川延伸的步道。幾乎沒有坡度，走起來輕鬆，騎行者也不少。水邊景色隨季節變化。",
    },
    meta: { updated_at: "2026-09-01" },
    sections: [],
    access: [],
    know: [],
    ko_card: [{ name_ko: "창릉천 산책로", address_ko: null }],
    credits: [],
    related: [],
    info: { hours: "always", duration: "1_2h", admission: "free", access: "wheelchair" },
    highlights: [
      { ko: "오르내림 없는 평지 코스", en: "A flat route with no climbs", ja: "起伏のない平坦コース", "zh-CN": "无坡度的平坦路线", "zh-TW": "無坡度的平坦路線" },
      { ko: "자전거로도 이용 가능", en: "Also suitable for cycling", ja: "自転車でも利用可能", "zh-CN": "亦可骑行", "zh-TW": "亦可騎行" },
      { ko: "계절마다 달라지는 물가 풍경", en: "Waterside scenery that shifts with the seasons", ja: "季節ごとに変わる水辺の風景", "zh-CN": "随季节变化的水边景色", "zh-TW": "隨季節變化的水邊景色" },
    ],
    adSlot: null,
    nearest_station: {
      name: { ko: "버스", en: "Bus", ja: "バス", "zh-CN": "公交", "zh-TW": "公車" },
      walk_min: null,
    },
    best_selected: false,
  },

  {
    slug: "seooreung",
    category: "walk",
    type: "list",
    region: "덕양구",
    title: {
      ko: "서오릉",
      en: "Seooreung Royal Tombs",
      ja: "西五陵",
      "zh-CN": "西五陵",
      "zh-TW": "西五陵",
    },
    title_en_display: "SEOOREUNG ROYAL TOMBS",
    subtitle: {
      ko: "왕릉 사이로 이어지는 숲길",
      en: "Forest paths between royal tombs",
      ja: "王陵の間を抜ける森の道",
      "zh-CN": "穿行于王陵之间的林间小路",
      "zh-TW": "穿行於王陵之間的林間小路",
    },
    lead: {
      ko: "조선 왕실의 능이 모여 있는 곳입니다. 능과 능 사이로 숲길이 이어져 산책하기 좋고, 소나무가 많아 여름에도 그늘이 넉넉합니다. 유네스코 세계유산 조선왕릉에 포함됩니다.",
      en: "A cluster of Joseon royal tombs. Forest paths link one tomb to the next, and the pine cover keeps the route shaded even in summer. It is part of the UNESCO-listed Royal Tombs of the Joseon Dynasty.",
      ja: "朝鮮王室の陵が集まる場所です。陵と陵の間を森の道がつなぎ、松が多く夏でも日陰が十分にあります。ユネスコ世界遺産の朝鮮王陵に含まれます。",
      "zh-CN": "朝鲜王室陵墓聚集之地。陵与陵之间以林间小路相连，松树成荫，夏日亦凉爽。属联合国教科文组织世界遗产朝鲜王陵。",
      "zh-TW": "朝鮮王室陵墓聚集之地。陵與陵之間以林間小路相連，松樹成蔭，夏日亦涼爽。屬聯合國教科文組織世界遺產朝鮮王陵。",
    },
    meta: { updated_at: "2026-09-01" },
    sections: [],
    access: [],
    know: [
      { ko: "조선왕릉 — 조선 왕과 왕비의 무덤으로, 40기가 유네스코 세계유산에 등재돼 있습니다.", en: "Royal Tombs of the Joseon Dynasty — 40 tombs of Joseon kings and queens, inscribed on the UNESCO World Heritage List.", ja: "朝鮮王陵 — 朝鮮の王と王妃の墓で、40基がユネスコ世界遺産に登録されています。", "zh-CN": "朝鲜王陵 — 朝鲜历代国王与王后的陵墓，共40座列入联合国教科文组织世界遗产。", "zh-TW": "朝鮮王陵 — 朝鮮歷代國王與王后的陵墓，共40座列入聯合國教科文組織世界遺產。" },
    ],
    // 오더 #D3 [2]: TourAPI 125552 주소.
    ko_card: [{ name_ko: "서오릉", address_ko: "경기도 고양시 덕양구 서오릉로 334-32" }],
    // 오더 #D3 [2]: TourAPI 좌표.
    map: [{ lat: 37.6235552311, lng: 126.9007662973, label: "서오릉" }],
    credits: [],
    related: [],
    info: { hours: "varies", duration: "1_2h", admission: "paid", access: "partial" },
    highlights: [
      { ko: "능 사이로 이어지는 숲길", en: "Forest paths linking the tombs", ja: "陵の間を結ぶ森の道", "zh-CN": "连接各陵的林间小路", "zh-TW": "連接各陵的林間小路" },
      { ko: "소나무 그늘이 많은 코스", en: "Shaded by pine woods", ja: "松の木陰が多いコース", "zh-CN": "松荫遍布的路线", "zh-TW": "松蔭遍布的路線" },
      { ko: "유네스코 세계유산 조선왕릉", en: "Part of the UNESCO Royal Tombs of Joseon", ja: "ユネスコ世界遺産・朝鮮王陵", "zh-CN": "联合国教科文组织世界遗产朝鲜王陵", "zh-TW": "聯合國教科文組織世界遺產朝鮮王陵" },
    ],
    adSlot: null,
    // 오더 #D3 [3]: TourAPI Type1 상위 3장 (C5-b 의 hero-history.jpg 대체).
    gallery: [
      { url: "/images/spots/seooreung-1.jpg", credit: "출처: 한국관광공사 (공공누리 제1유형)", cpyrht: "Type1" },
      { url: "/images/spots/seooreung-2.jpg", credit: "출처: 한국관광공사 (공공누리 제1유형)", cpyrht: "Type1" },
      { url: "/images/spots/seooreung-3.jpg", credit: "출처: 한국관광공사 (공공누리 제1유형)", cpyrht: "Type1" },
    ],
    nearest_station: {
      name: { ko: "버스", en: "Bus", ja: "バス", "zh-CN": "公交", "zh-TW": "公車" },
      walk_min: null,
    },
    // 오더 #D3 [2]: TourAPI homepage (문화재청 왕실).
    official_url: "https://royal.khs.go.kr",
    best_selected: false,
    // 오더 #D3 [1][2]: TourAPI 원본.
    tourapi: {
      contentid: "125552",
      overview_ko: "서오릉(西五陵)은 ‘서쪽에 있는 5기의 능’이라는 뜻으로 경릉(敬陵), 창릉(昌陵), 익릉(翼陵), 명릉(明陵), 홍릉(弘陵)의 다섯 능을 말한다. 서오릉은 구리 동구릉(東九陵) 다음으로 규모가 큰 조선왕실의 왕릉군이다. 1457년(세조 3) 세조의 첫째 아들 의경세자(추존 덕종)의 의묘(懿墓, 경릉)가 처음 조성되었고 1470년(성종 1) 예종의 창릉(昌陵)이 왕릉으로서 최초로 조성되었다. 이후 순회세자의 순창원(順昌園), 인경왕후의 익릉(翼陵), 숙종의 명릉(明陵), 정성왕후의 홍릉( 弘陵)이 차례로 조성되어 조선시대에는 5기의 능과 1기의 원이 조성되었다. 그러다가 1970년대 영빈 이씨의 수경원(綏慶園)과 옥산부대빈 장씨의 대빈묘(大嬪墓)가 옮겨져 지금의 서오릉이 되었다.",
      homepage: "https://royal.khs.go.kr",
    },
  },

  {
    slug: "seosamneung",
    category: "walk",
    type: "list",
    region: "덕양구",
    title: {
      ko: "서삼릉",
      en: "Seosamneung Royal Tombs",
      ja: "西三陵",
      "zh-CN": "西三陵",
      "zh-TW": "西三陵",
    },
    title_en_display: "SEOSAMNEUNG ROYAL TOMBS",
    subtitle: {
      ko: "조용히 걷기 좋은 왕릉 숲",
      en: "A quiet woodland around royal tombs",
      ja: "静かに歩ける王陵の森",
      "zh-CN": "适合静静漫步的王陵林地",
      "zh-TW": "適合靜靜漫步的王陵林地",
    },
    lead: {
      ko: "서오릉과 함께 고양에 있는 조선 왕릉입니다. 방문객이 비교적 적어 조용하게 걸을 수 있고, 능역을 감싼 숲이 잘 보존돼 있습니다. 유네스코 세계유산 조선왕릉에 포함됩니다.",
      en: "Along with Seooreung, one of two Joseon royal tomb sites in Goyang. It draws fewer visitors, so the walk stays quiet, and the woodland around the tombs is well preserved. Part of the UNESCO-listed Royal Tombs of the Joseon Dynasty.",
      ja: "西五陵とともに高陽にある朝鮮王陵です。訪問者が比較的少なく静かに歩け、陵域を囲む森がよく保たれています。ユネスコ世界遺産の朝鮮王陵に含まれます。",
      "zh-CN": "与西五陵同为高阳的朝鲜王陵。访客相对较少，可安静漫步，陵区周边林地保存良好。属联合国教科文组织世界遗产朝鲜王陵。",
      "zh-TW": "與西五陵同為高陽的朝鮮王陵。訪客相對較少，可安靜漫步，陵區周邊林地保存良好。屬聯合國教科文組織世界遺產朝鮮王陵。",
    },
    meta: { updated_at: "2026-09-01" },
    sections: [],
    access: [],
    know: [],
    // 오더 #D3 [2]: TourAPI 125551 주소.
    ko_card: [{ name_ko: "서삼릉", address_ko: "경기도 고양시 덕양구 서삼릉길 233-126 (원당동)" }],
    // 오더 #D3 [2]: TourAPI 좌표.
    map: [{ lat: 37.6630660206, lng: 126.8669756845, label: "서삼릉" }],
    credits: [],
    related: [],
    info: { hours: "varies", duration: "1h", admission: "paid", access: "partial" },
    highlights: [
      { ko: "방문객이 적어 조용한 코스", en: "Quiet, with fewer visitors", ja: "訪問者が少なく静かなコース", "zh-CN": "访客较少的安静路线", "zh-TW": "訪客較少的安靜路線" },
      { ko: "잘 보존된 능역 숲", en: "Well-preserved woodland", ja: "よく保たれた陵域の森", "zh-CN": "保存良好的陵区林地", "zh-TW": "保存良好的陵區林地" },
      { ko: "유네스코 세계유산 조선왕릉", en: "Part of the UNESCO Royal Tombs of Joseon", ja: "ユネスコ世界遺産・朝鮮王陵", "zh-CN": "联合国教科文组织世界遗产朝鲜王陵", "zh-TW": "聯合國教科文組織世界遺產朝鮮王陵" },
    ],
    adSlot: null,
    // 오더 #D3 [3]: TourAPI 이미지 0장 → 갤러리 미설정, 일러스트 유지.
    nearest_station: {
      name: { ko: "버스", en: "Bus", ja: "バス", "zh-CN": "公交", "zh-TW": "公車" },
      walk_min: null,
    },
    // 오더 #D3 [2]: TourAPI homepage.
    official_url: "https://royal.khs.go.kr",
    best_selected: false,
    // 오더 #D3 [1][2]: TourAPI 원본.
    tourapi: {
      contentid: "125551",
      overview_ko: "서삼릉(西三陵)은 ‘서쪽에 있는 3기의 능’이라는 뜻으로 경기 고양시에 위치한 조선왕릉 중 서오릉 다음으로 큰 왕릉군이다. 1537년(중종 32) 중종의 두 번째 왕비 장경왕후의 희릉(禧陵)이 현 서울 서초구 헌릉과 인릉 서쪽 언덕에서 현재의 자리로 옮겨졌고, 1545년(인종 1) 중종의 정릉이 희릉 서쪽 언덕에 조성되자 능의 이름을 희릉과 합쳐 정릉이라 하였다. 그러나 1562년(명종 17) 정릉이 현 서울 강남구로 옮겨지면서 다시 희릉이 되었다. 이후 인종의 효릉(孝陵), 소현세자의 소현묘(昭顯墓, 이후 소경원(昭慶園)), 철종의 예릉(睿陵)이 조성되었다. 그러다가 일제강점기 때 전국에 있던 왕을 비롯한 왕실가족의 태실(胎室)과 왕자·왕녀·후궁의 묘와 문효세자의 효창원(孝昌園)이 서삼릉 경내로 옮겨졌다. 1945년 광복 후 의소세손의 의령원(懿寧園)이 옮겨졌고, 도시화 개발 시기에 왕실 후궁들의 묘와 폐비 윤씨의 회묘(懷墓)가 경내로 옮겨지면서 지금의 서삼릉이 되었다.",
      homepage: "https://royal.khs.go.kr",
    },
  },

  {
    slug: "bamgasi-thatched-house",
    category: "walk",
    type: "list",
    region: "일산동구",
    title: {
      ko: "고양 밤가시초가",
      en: "Bamgasi Thatched House",
      ja: "高陽 バムガシ草家",
      "zh-CN": "高阳栗刺草屋",
      "zh-TW": "高陽栗刺草屋",
    },
    title_en_display: "BAMGASI THATCHED HOUSE",
    subtitle: {
      ko: "신도시 한가운데 남은 옛집",
      en: "An old farmhouse left in the middle of a new town",
      ja: "新都市の真ん中に残る古い家",
      "zh-CN": "留存于新城中心的老宅",
      "zh-TW": "留存於新城中心的老宅",
    },
    lead: {
      ko: "아파트 단지 사이에 남아 있는 초가집입니다. 일산신도시가 들어서기 전 이 지역 생활 모습을 보여주는 곳으로, 규모는 작지만 주변 산책과 함께 들르기 좋습니다.",
      en: "A thatched farmhouse that survives among the apartment blocks. It shows how people lived here before Ilsan New Town was built — small in scale, but an easy stop on a longer walk.",
      ja: "マンション団地の間に残る草葺きの家です。一山新都市ができる前の暮らしを伝える場所で、規模は小さいものの周辺の散策と合わせて立ち寄るのに適しています。",
      "zh-CN": "保留在公寓小区之间的茅草屋。展现一山新城建成前当地的生活样貌，规模虽小，适合与周边散步一同前往。",
      "zh-TW": "保留在公寓社區之間的茅草屋。展現一山新城建成前當地的生活樣貌，規模雖小，適合與周邊散步一同前往。",
    },
    meta: { updated_at: "2026-09-01" },
    sections: [],
    access: [],
    know: [
      { ko: "초가 — 볏짚으로 지붕을 인 전통 가옥입니다.", en: "Thatched house — a traditional dwelling roofed with rice straw.", ja: "草家 — 稲わらで屋根を葺いた伝統家屋です。", "zh-CN": "草屋 — 以稻草铺顶的传统民居。", "zh-TW": "草屋 — 以稻草鋪頂的傳統民居。" },
    ],
    ko_card: [{ name_ko: "고양 밤가시초가", address_ko: null }],
    credits: [],
    related: [],
    info: { hours: "varies", duration: "30min", admission: "free", access: "partial" },
    highlights: [
      { ko: "신도시 안에 남은 옛 살림집", en: "An old dwelling inside a new town", ja: "新都市に残る昔の住まい", "zh-CN": "新城中留存的旧民居", "zh-TW": "新城中留存的舊民居" },
      { ko: "짧게 둘러보기 좋은 규모", en: "Small enough for a short visit", ja: "短時間で回れる規模", "zh-CN": "规模适合短暂参观", "zh-TW": "規模適合短暫參觀" },
      { ko: "주변 산책과 함께", en: "Easy to combine with a nearby walk", ja: "周辺の散策と合わせて", "zh-CN": "可与周边散步结合", "zh-TW": "可與周邊散步結合" },
    ],
    adSlot: null,
    nearest_station: {
      name: {
        ko: "3호선 마두역",
        en: "Madu Stn. (Line 3)",
        ja: "3号線 馬頭駅",
        "zh-CN": "3号线 马头站",
        "zh-TW": "3號線 馬頭站",
      },
      walk_min: null,
    },
    best_selected: false,
  },

  {
    slug: "eoullimnuri-park",
    category: "walk",
    type: "list",
    region: "덕양구",
    title: {
      ko: "고양어울림누리 누리공원",
      en: "Nuri Park at Goyang Eoullim Nuri",
      ja: "高陽オウルリムヌリ ヌリ公園",
      "zh-CN": "高阳和谐世界 世界公园",
      "zh-TW": "高陽和諧世界 世界公園",
    },
    title_en_display: "NURI PARK",
    subtitle: {
      ko: "공연장을 둘러싼 잔디 마당",
      en: "Lawns around a performing arts complex",
      ja: "公演場を囲む芝生の広場",
      "zh-CN": "环绕演出场馆的草坪广场",
      "zh-TW": "環繞演出場館的草坪廣場",
    },
    lead: {
      ko: "공연장 어울림누리를 둘러싼 야외 공간입니다. 잔디밭과 산책로가 이어져 공연 전후로 시간을 보내기 좋습니다.",
      en: "The open grounds surrounding the Eoullim Nuri arts complex. Lawns and walking paths make it an easy place to spend time before or after a performance.",
      ja: "公演場オウルリムヌリを囲む屋外空間です。芝生と遊歩道が続き、公演の前後に過ごすのに適しています。",
      "zh-CN": "环绕和谐世界演出场馆的户外空间。草坪与步道相连，适合在观演前后停留。",
      "zh-TW": "環繞和諧世界演出場館的戶外空間。草坪與步道相連，適合在觀演前後停留。",
    },
    meta: { updated_at: "2026-09-01" },
    sections: [],
    access: [],
    know: [],
    ko_card: [{ name_ko: "고양어울림누리", address_ko: null }],
    credits: [],
    related: [],
    info: { hours: "always", duration: "30min", admission: "free", access: "wheelchair" },
    highlights: [
      { ko: "공연 전후에 들르기 좋은 위치", en: "Convenient before or after a show", ja: "公演の前後に立ち寄りやすい立地", "zh-CN": "观演前后便于停留", "zh-TW": "觀演前後便於停留" },
      { ko: "잔디밭과 산책로", en: "Lawns and walking paths", ja: "芝生と遊歩道", "zh-CN": "草坪与步道", "zh-TW": "草坪與步道" },
      { ko: "입장료 없음", en: "Free to enter", ja: "入場無料", "zh-CN": "免费入园", "zh-TW": "免費入園" },
    ],
    adSlot: null,
    // nearest_station: 「확인필요」 → 미설정
    best_selected: false,
  },

  {
    slug: "aramnuri-plaza",
    category: "walk",
    type: "list",
    region: "일산동구",
    title: {
      ko: "고양아람누리 야외광장",
      en: "Aram Nuri Outdoor Plaza",
      ja: "高陽アラムヌリ 屋外広場",
      "zh-CN": "高阳阿蓝世界 户外广场",
      "zh-TW": "高陽阿藍世界 戶外廣場",
    },
    title_en_display: "ARAM NURI PLAZA",
    subtitle: {
      ko: "곡선 지붕 아래 열린 광장",
      en: "An open plaza beneath a curved roof",
      ja: "曲線の屋根の下に開かれた広場",
      "zh-CN": "曲线屋顶下的开放广场",
      "zh-TW": "曲線屋頂下的開放廣場",
    },
    lead: {
      ko: "공연장 아람누리 앞에 펼쳐진 야외 광장입니다. 곡선 지붕의 건물과 광장이 어우러져 사진을 찍는 사람이 많고, 정발산과 이어져 함께 걷기 좋습니다.",
      en: "The open plaza in front of the Aram Nuri arts complex. The curved roofline and the square together draw photographers, and the area connects to Jeongbalsan for a longer walk.",
      ja: "公演場アラムヌリの前に広がる屋外広場です。曲線屋根の建物と広場が調和し写真を撮る人が多く、鼎鉢山とつながっていて合わせて歩けます。",
      "zh-CN": "阿蓝世界演出场馆前的户外广场。曲线屋顶建筑与广场相映，常有人取景拍照，并与鼎钵山相连可延伸步行。",
      "zh-TW": "阿藍世界演出場館前的戶外廣場。曲線屋頂建築與廣場相映，常有人取景拍照，並與鼎缽山相連可延伸步行。",
    },
    meta: { updated_at: "2026-09-01" },
    sections: [],
    access: [],
    know: [],
    ko_card: [{ name_ko: "고양아람누리", address_ko: null }],
    credits: [],
    related: [],
    info: { hours: "always", duration: "30min", admission: "free", access: "wheelchair" },
    highlights: [
      { ko: "곡선 지붕 건물과 광장", en: "The curved-roof building and its square", ja: "曲線屋根の建物と広場", "zh-CN": "曲线屋顶建筑与广场", "zh-TW": "曲線屋頂建築與廣場" },
      { ko: "정발산과 이어지는 동선", en: "Connects to Jeongbalsan", ja: "鼎鉢山とつながる動線", "zh-CN": "与鼎钵山相连", "zh-TW": "與鼎缽山相連" },
      { ko: "공연 전후 산책", en: "A walk before or after a performance", ja: "公演前後の散策", "zh-CN": "观演前后散步", "zh-TW": "觀演前後散步" },
    ],
    adSlot: null,
    // 오더 #C5-b [1]: hero-culture.jpg 를 아람누리 사진으로 승인. 갤러리 1장.
    gallery: [
      { url: "/images/hero/hero-culture.jpg", credit: "사진: 고양아람누리" },
    ],
    nearest_station: {
      name: {
        ko: "3호선 정발산역",
        en: "Jeongbalsan Stn. (Line 3)",
        ja: "3号線 鼎鉢山駅",
        "zh-CN": "3号线 鼎钵山站",
        "zh-TW": "3號線 鼎缽山站",
      },
      walk_min: null,
    },
    best_selected: false,
  },

  {
    slug: "kintex-walkway",
    category: "walk",
    type: "list",
    region: "일산서구",
    title: {
      ko: "킨텍스 일대 산책로",
      en: "KINTEX Area Walkway",
      ja: "キンテックス一帯の遊歩道",
      "zh-CN": "韩国国际展览中心一带步道",
      "zh-TW": "韓國國際展覽中心一帶步道",
    },
    title_en_display: "KINTEX AREA WALKWAY",
    subtitle: {
      ko: "전시 일정 사이에 걷는 길",
      en: "A walk between exhibition sessions",
      ja: "展示の合間に歩く道",
      "zh-CN": "展会间隙可走的步道",
      "zh-TW": "展會間隙可走的步道",
    },
    lead: {
      ko: "킨텍스 주변으로 이어지는 보행로입니다. 전시나 공연 일정 사이에 잠시 걷기 좋고, 호수공원 방향으로도 이어집니다.",
      en: "Walkways that run around KINTEX. They are handy for a short break between exhibition or concert sessions, and they connect toward Ilsan Lake Park.",
      ja: "キンテックス周辺に続く歩道です。展示や公演の合間に少し歩くのに適しており、湖水公園方面にもつながっています。",
      "zh-CN": "环绕韩国国际展览中心的步行道。适合在展会或演出间隙短暂散步，并可通往湖水公园方向。",
      "zh-TW": "環繞韓國國際展覽中心的步行道。適合在展會或演出間隙短暫散步，並可通往湖水公園方向。",
    },
    meta: { updated_at: "2026-09-01" },
    sections: [],
    access: [],
    know: [],
    ko_card: [{ name_ko: "킨텍스", address_ko: null }],
    credits: [],
    related: [],
    info: { hours: "always", duration: "30min", admission: "free", access: "wheelchair" },
    highlights: [
      { ko: "전시·공연 사이 짧은 산책", en: "A short break between events", ja: "展示·公演の合間の短い散策", "zh-CN": "展会与演出间的短途散步", "zh-TW": "展會與演出間的短途散步" },
      { ko: "호수공원 방향으로 연결", en: "Connects toward Ilsan Lake Park", ja: "湖水公園方面へ接続", "zh-CN": "通往湖水公园方向", "zh-TW": "通往湖水公園方向" },
      { ko: "GTX 킨텍스역에서 가까움", en: "Close to GTX Kintex Station", ja: "GTXキンテックス駅から近い", "zh-CN": "邻近GTX韩国国际展览中心站", "zh-TW": "鄰近GTX韓國國際展覽中心站" },
    ],
    adSlot: null,
    nearest_station: {
      name: {
        ko: "GTX 킨텍스역",
        en: "GTX Kintex Stn.",
        ja: "GTX キンテックス駅",
        "zh-CN": "GTX 韩国国际展览中心站",
        "zh-TW": "GTX 韓國國際展覽中心站",
      },
      walk_min: null,
    },
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
