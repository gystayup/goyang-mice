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

// 오더 #D4 [1]: ON SCREEN — 드라마·영화에서 본 인물이 실제로 잠든 곳.
// 오더 #E1 [1]: 'music' 타입 추가 (Ma City 등 곡). artist·album·year 로 표기.
//   spots-onscreen-royal-tombs.md 스키마 그대로. 포스터·스틸·배우명·대사·로고·가사 금지.
export interface SpotOnScreenWork {
  /** drama → Tv, film → Clapperboard, music → Music (lucide) */
  type: "drama" | "film" | "music";
  /** 한국어 원제 (드라마·영화) 또는 곡명 (music) */
  titleKo: string;
  /** 영문 제목 */
  titleEn: string;
  /** MBC · SBS · JTBC · tvN 등 (영화·음악은 미설정) */
  broadcaster?: string;
  /** music 전용: 아티스트명 (예: BTS) */
  artist?: string;
  /** music 전용: 앨범명 */
  album?: string;
  year: string;
  /** 등장 인물 (드라마·영화) 또는 언급된 장소 (music) — 실존 인물명만 (배우명 금지) */
  characters: I18nText;
  /** 그 인물/장소가 실제로 있는 곳 */
  site: I18nText;
  /** 해당 구역 공개 여부. false 면 "현재 비공개 구역입니다" 5로케일 병기 필수. */
  open: boolean;
  note?: I18nText;
}

export interface SpotOnScreenCourse {
  name: I18nText;
  /** 능 이름 순서 (문자열 → 화살표 렌더). */
  stops: I18nText[];
}

export interface SpotOnScreen {
  works: SpotOnScreenWork[];
  courses?: SpotOnScreenCourse[];
}

// 오더 #E1 [1]: THE STORY — 챕터 단위 인물·능·묘 서사.
//   open: null 이면 「확인필요」 → 챕터 자체 렌더 X.
//   open: false 면 렌더 O + 5로케일 비공개 문구 병기.
export interface SpotStoryOnScreen {
  titleKo: string;
  titleEn: string;
  type: "drama" | "film" | "music";
  /** 영화·음악은 미설정 가능 */
  broadcaster?: string;
  year: string;
}

export interface SpotStoryChapter {
  /** "CHAPTER 1" · "A BRIDGE" 등 5로케일 공통 영문 */
  eyebrow: string;
  /** LOVE · POWER 등 한 단어 주제 */
  theme: I18nText;
  title: I18nText;
  /** 실존 인물 — 없으면 미설정 (예: 서오릉 CH6 유럽 관광객용 다리) */
  people?: I18nText;
  /** 능·원·묘 */
  site: I18nText;
  /** true=공개, false=비공개(회색+문구), null=확인필요(렌더 X) */
  open: boolean | null;
  /** 3~5문장 */
  body: I18nText;
  /** 관련 작품 (없으면 미설정) */
  onScreen?: SpotStoryOnScreen[];
  /** 추가 안내 (예: "효릉은 예약제") */
  note?: I18nText;
}

export interface SpotStoriesHeader {
  /** 5로케일 부제 (섹션 title 은 THE STORY 로 하드코딩). */
  title: I18nText;
  lead: I18nText;
}

// 오더 #E1 [1]: 한복 무료입장 안내.
export interface SpotHanbok {
  eligible: boolean;
  note: I18nText;
  caution: I18nText;
}

// 오더 #E1 [1]: AROUND KINTEX — 반경 안 시설 안내.
export interface SpotNearbyItem {
  name: I18nText;
  /** "350m" 등. 없으면 생략. */
  distance?: string;
  tag: I18nText;
  /** 우리 스팟이면 slug 로 링크. 없으면 미링크 카드. */
  slug?: string;
}

export interface SpotNearby {
  /** 5로케일 공통 영문 (예: "AROUND KINTEX") */
  eyebrow: string;
  title: I18nText;
  lead: I18nText;
  items: SpotNearbyItem[];
}

// 오더 #E1 [1]: 공사·임시 안내 배너 (갤러리 아래).
export interface SpotNotice {
  body: I18nText;
  /** ISO YYYY-MM-DD. 없으면 무기한. */
  until?: string;
}

// 오더 #C9 [1]: FIND YOUR WALK — 한 스팟에서 고를 수 있는 여러 산책 코스.
//   방문객이 살던 도시의 산책과 연결하도록 "이 산책이 닮은 순간" 을 hook 으로 제시.
//   없으면 섹션 자체 미렌더 ([4]).
export interface SpotWalk {
  /** kebab-case (예: "morning-walk"). key/앵커용. */
  id: string;
  /** 5로케일 공통 영문 (예: "MORNING WALK"). */
  eyebrow: string;
  title: I18nText;
  /** "이 산책이 닮은 순간". */
  hook: I18nText;
  body: I18nText;
  /** "지나는 곳" 한 줄. 화살표 그대로 포함. */
  stops: I18nText;
  bestTime: I18nText;
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
  /**
   * 오더 #D4 [1]: ON SCREEN 섹션. works[] + optional courses[].
   *   없으면 섹션 자체 미렌더. 포스터·스틸·배우명·대사·방송사 로고 금지.
   */
  onScreen?: SpotOnScreen;
  /**
   * 오더 #C9 [1]: FIND YOUR WALK — 스팟 내 여러 산책 코스.
   *   없으면 섹션 자체 미렌더 (렌더 규칙).
   */
  walks?: SpotWalk[];
  /**
   * 오더 #E1 [1]: THE STORY — 챕터 배열. open:null 챕터는 렌더 제외.
   *   없으면 섹션 자체 미렌더.
   */
  stories?: SpotStoryChapter[];
  /** 오더 #E1 [1]: THE STORY 섹션 부제 (섹션 제목은 THE STORY 하드코딩). */
  storiesHeader?: SpotStoriesHeader;
  /** 오더 #E1 [1]: 한복 무료입장 안내 카드. */
  hanbok?: SpotHanbok;
  /** 오더 #E1 [1]: AROUND … 주변 시설 카드. */
  nearby?: SpotNearby;
  /** 오더 #E1 [1]: 갤러리 아래 임시 안내 배너. */
  notice?: SpotNotice;
  /**
   * 오더 #E2 [1]: 제휴 문의 CTA (스팟 하단, /contact 링크).
   *   광고 유치 목적의 배너. 없으면 미렌더.
   */
  partnerCta?: I18nText;
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
    // 오더 #C9 [2]: lead 교체 (spot-ilsan-lake-park-walks.md 그대로).
    //   "당신이 살던 도시의 산책을 여기서도" 콘셉트. subtitle/info/gallery 무변경.
    lead: {
      ko: "어느 도시에서 왔든 당신에게는 익숙한 산책이 있을 겁니다. 바르샤바의 와지엔키, 뉴욕의 센트럴파크, 런던의 하이드파크. 나무 사이를 걷고 물가에서 잠시 멈추고 도시가 깨어나는 모습을 바라보던 시간. 일산호수공원에도 그 시간이 있습니다. 9.1km 산책로가 국내 최대 인공호수를 따라 이어지고, 한쪽에는 물과 나무가, 다른 쪽에는 일산의 스카이라인이 보입니다.",
      en: "Wherever you come from, you probably have a walk you know by heart. Łazienki in Warsaw. Central Park in New York. Hyde Park in London. Trees above you, water beside you, a city slowly waking up. Ilsan Lake Park holds that same hour. A 9.1 km path circles Korea's largest man-made lake, with water and trees on one side and the Ilsan skyline on the other.",
      ja: "どの街から来た方にも、慣れ親しんだ散歩があるはずです。ワルシャワのワジェンキ、ニューヨークのセントラルパーク、ロンドンのハイドパーク。木々の間を歩き、水辺で少し立ち止まり、街が目を覚ますのを眺める時間。一山湖水公園にもその時間があります。9.1kmの遊歩道が国内最大の人工湖に沿って続き、片側には水と木が、もう片側には一山のスカイラインが広がります。",
      "zh-CN": "无论你来自哪座城市，心中大概都有一段熟悉的散步。华沙的瓦金基、纽约的中央公园、伦敦的海德公园。走在树影之间，在水边稍作停留，看着城市慢慢苏醒。一山湖水公园也有这样的时光。9.1公里步道环绕韩国最大的人工湖，一侧是水与树，另一侧是一山的天际线。",
      "zh-TW": "無論你來自哪座城市，心中大概都有一段熟悉的散步。華沙的瓦金基、紐約的中央公園、倫敦的海德公園。走在樹影之間，在水邊稍作停留，看著城市慢慢甦醒。一山湖水公園也有這樣的時光。9.1公里步道環繞韓國最大的人工湖，一側是水與樹，另一側是一山的天際線。",
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
      // 오더 #C9 [2]: know 2건 추가.
      {
        ko: "월파정 — 호수 가운데 달맞이섬에 세워진 팔각정입니다.",
        en: "Wolpajeong — an octagonal pavilion on Dalmaji Island in the middle of the lake.",
        ja: "月波亭 — 湖の中央、月波島に建てられた八角亭です。",
        "zh-CN": "月波亭 — 建于湖心达迎岛上的八角亭。",
        "zh-TW": "月波亭 — 建於湖心達迎島上的八角亭。",
      },
      {
        ko: "메타세쿼이아 — 잎이 가늘고 키가 큰 낙엽 침엽수로, 가을에 붉게 물듭니다.",
        en: "Metasequoia — a tall deciduous conifer with fine needles that turn rust-red in autumn.",
        ja: "メタセコイア — 葉が細く背の高い落葉針葉樹で、秋に赤く色づきます。",
        "zh-CN": "水杉 — 叶细而高大的落叶针叶树，秋季转为红褐色。",
        "zh-TW": "水杉 — 葉細而高大的落葉針葉樹，秋季轉為紅褐色。",
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
    // 오더 #C9 [2]: highlights 3줄 교체 (walks 콘셉트 반영).
    highlights: [
      {
        ko: "호수를 한 바퀴 도는 9.1km 산책로",
        en: "A 9.1 km path around the lake",
        ja: "湖を一周する9.1kmの遊歩道",
        "zh-CN": "环湖9.1公里步道",
        "zh-TW": "環湖9.1公里步道",
      },
      {
        ko: "다섯 가지 산책 코스",
        en: "Five different walks",
        ja: "五つの散歩コース",
        "zh-CN": "五种散步路线",
        "zh-TW": "五種散步路線",
      },
      {
        ko: "입장료 없이 연중무휴 개방",
        en: "Free entry, open year-round",
        ja: "入場無料・年中無休",
        "zh-CN": "免费入园，全年开放",
        "zh-TW": "免費入園，全年開放",
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
    // 오더 #C9 [2][3]: FIND YOUR WALK 5 코스. About 아래 · ON SCREEN 위에 렌더.
    walks: [
      {
        id: "morning-walk",
        eyebrow: "MORNING WALK",
        title: { ko: "아침 물안개", en: "The Morning Mist", ja: "朝の川霧", "zh-CN": "清晨水雾", "zh-TW": "清晨水霧" },
        hook: {
          ko: "조용한 아침을 걷던 사람에게",
          en: "For those who walked their city before it woke",
          ja: "静かな朝を歩いていた方へ",
          "zh-CN": "献给习惯在清晨漫步的人",
          "zh-TW": "獻給習慣在清晨漫步的人",
        },
        body: {
          ko: "해가 뜨기 전 호숫가에는 물안개가 낮게 깔립니다. 사람이 적고 소리가 가라앉아 있어 걷는 속도가 저절로 느려집니다. 달맞이섬 쪽으로 건너가면 월파정이 물 위로 보입니다.",
          en: "Before sunrise a low mist settles over the water. There are few people and little sound, and your pace slows without your deciding to. Cross toward Dalmaji Island and the Wolpajeong pavilion appears above the surface.",
          ja: "日の出前、湖畔には低く川霧が立ちこめます。人は少なく音も沈み、歩く速度が自然と緩みます。月波島の方へ渡ると、月波亭が水の上に見えてきます。",
          "zh-CN": "日出前，湖面上低垂着一层水雾。人少声静，脚步不自觉地慢了下来。走向达迎岛，月波亭便浮现于水面之上。",
          "zh-TW": "日出前，湖面上低垂著一層水霧。人少聲靜，腳步不自覺地慢了下來。走向達迎島，月波亭便浮現於水面之上。",
        },
        stops: {
          ko: "호수 북측 산책로 → 달맞이섬 → 월파정",
          en: "North lakeside path → Dalmaji Island → Wolpajeong",
          ja: "湖北側遊歩道 → 月波島 → 月波亭",
          "zh-CN": "湖北侧步道 → 达迎岛 → 月波亭",
          "zh-TW": "湖北側步道 → 達迎島 → 月波亭",
        },
        bestTime: { ko: "해뜨기 전후", en: "Around sunrise", ja: "日の出前後", "zh-CN": "日出前后", "zh-TW": "日出前後" },
      },
      {
        id: "city-and-lake-walk",
        eyebrow: "CITY & LAKE WALK",
        title: { ko: "물과 스카이라인 사이", en: "Between Water and Skyline", ja: "水とスカイラインの間", "zh-CN": "水与天际线之间", "zh-TW": "水與天際線之間" },
        hook: {
          ko: "도시 한가운데서 도시를 벗어나던 사람에게",
          en: "For those who left the city without leaving it",
          ja: "街の真ん中で街を離れていた方へ",
          "zh-CN": "献给在城市中心逃离城市的人",
          "zh-TW": "獻給在城市中心逃離城市的人",
        },
        body: {
          ko: "호수를 한 바퀴 도는 9.1km 코스입니다. 걷는 동안 한쪽에는 물과 나무가, 다른 쪽에는 아파트 스카이라인이 계속 따라옵니다. 자연 속에 있으면서 도시를 보고 있다는 감각이 이 공원의 특징입니다.",
          en: "The full 9.1 km loop around the lake. As you walk, water and trees hold one side while the apartment skyline follows on the other. That double view — inside nature, still watching the city — is what defines this park.",
          ja: "湖を一周する9.1kmのコースです。歩く間、片側には水と木が、もう片側にはマンションのスカイラインがずっとついてきます。自然の中にいながら街を眺めているという感覚が、この公園の特徴です。",
          "zh-CN": "环湖一周的9.1公里路线。行走途中，一侧是水与树，另一侧是公寓天际线始终相随。身处自然却仍望着城市，这种双重感受正是这座公园的特色。",
          "zh-TW": "環湖一周的9.1公里路線。行走途中，一側是水與樹，另一側是公寓天際線始終相隨。身處自然卻仍望著城市，這種雙重感受正是這座公園的特色。",
        },
        stops: {
          ko: "한울광장 → 호수 일주 → 애수교",
          en: "Hanul Square → full lake loop → Aesugyo Bridge",
          ja: "ハヌル広場 → 湖一周 → 哀愁橋",
          "zh-CN": "한울广场 → 环湖一周 → 哀愁桥",
          "zh-TW": "한울廣場 → 環湖一周 → 哀愁橋",
        },
        bestTime: { ko: "오전 또는 늦은 오후", en: "Morning or late afternoon", ja: "午前または夕方近く", "zh-CN": "上午或傍晚前", "zh-TW": "上午或傍晚前" },
      },
      {
        id: "forest-walk",
        eyebrow: "FOREST WALK",
        title: { ko: "메타세쿼이아길", en: "The Metasequoia Path", ja: "メタセコイア並木", "zh-CN": "水杉大道", "zh-TW": "水杉大道" },
        hook: {
          ko: "나무 그늘 아래를 걷던 사람에게",
          en: "For those who walked beneath the trees",
          ja: "木陰の下を歩いていた方へ",
          "zh-CN": "献给习惯走在树荫下的人",
          "zh-TW": "獻給習慣走在樹蔭下的人",
        },
        body: {
          ko: "공원 안쪽으로 들어가면 메타세쿼이아가 줄지어 선 길이 나옵니다. 호숫가와 달리 시야가 좁아지고 소리가 달라집니다. 여름에는 그늘이 깊고 가을에는 잎이 붉게 물듭니다.",
          en: "Deeper inside the park, a corridor of metasequoia trees closes in. Unlike the open lakeside, the view narrows and the sound changes. The shade is deep in summer; in autumn the needles turn rust-red.",
          ja: "公園の奥へ入ると、メタセコイアが並ぶ道が現れます。湖畔とは違い視界が狭まり、音が変わります。夏は木陰が深く、秋には葉が赤く色づきます。",
          "zh-CN": "走进公园深处，水杉列队而立的小径展开。与开阔的湖畔不同，视野收窄，声音也随之改变。夏日树荫浓密，秋天叶色转红。",
          "zh-TW": "走進公園深處，水杉列隊而立的小徑展開。與開闊的湖畔不同，視野收窄，聲音也隨之改變。夏日樹蔭濃密，秋天葉色轉紅。",
        },
        stops: {
          ko: "메타세쿼이아길 → 자연학습원",
          en: "Metasequoia path → Nature Study Center",
          ja: "メタセコイア並木 → 自然学習園",
          "zh-CN": "水杉大道 → 自然学习园",
          "zh-TW": "水杉大道 → 自然學習園",
        },
        bestTime: { ko: "한여름 낮 · 가을", en: "Midsummer days · autumn", ja: "真夏の日中・秋", "zh-CN": "盛夏白天·秋季", "zh-TW": "盛夏白天·秋季" },
      },
      {
        id: "garden-walk",
        eyebrow: "GARDEN WALK",
        title: { ko: "장미원과 전통정원", en: "Rose Garden and Traditional Garden", ja: "バラ園と伝統庭園", "zh-CN": "玫瑰园与传统庭园", "zh-TW": "玫瑰園與傳統庭園" },
        hook: {
          ko: "정원을 걷던 사람에게",
          en: "For those who walked in gardens",
          ja: "庭園を歩いていた方へ",
          "zh-CN": "献给习惯在庭园漫步的人",
          "zh-TW": "獻給習慣在庭園漫步的人",
        },
        body: {
          ko: "오뉴월이면 장미원에 수만 송이가 핍니다. 그 안쪽으로 연못과 정자가 있는 한국식 전통정원이, 호수 쪽으로는 중국식 정자 학괴정이 있습니다. 정원마다 성격이 달라 짧게 여러 곳을 볼 수 있습니다.",
          en: "In May and June tens of thousands of roses open in the Rose Garden. Beyond it lies a Korean traditional garden with a pond and pavilion; toward the lake stands Hakgoejeong, a Chinese-style pavilion. Each garden has its own character, so several can be seen in a short walk.",
          ja: "5〜6月になるとバラ園に数万本の花が咲きます。その奥には池と東屋のある韓国式伝統庭園が、湖側には中国式の東屋・鶴槐亭があります。庭園ごとに性格が異なり、短時間で複数を巡れます。",
          "zh-CN": "五六月间，玫瑰园中数万朵花齐放。其内侧是设有池塘与亭阁的韩式传统庭园，靠湖一侧则有中式亭阁鹤槐亭。各庭园风格不同，短时间内可游览多处。",
          "zh-TW": "五六月間，玫瑰園中數萬朵花齊放。其內側是設有池塘與亭閣的韓式傳統庭園，靠湖一側則有中式亭閣鶴槐亭。各庭園風格不同，短時間內可遊覽多處。",
        },
        stops: {
          ko: "장미원 → 전통정원 → 학괴정",
          en: "Rose Garden → Traditional Garden → Hakgoejeong",
          ja: "バラ園 → 伝統庭園 → 鶴槐亭",
          "zh-CN": "玫瑰园 → 传统庭园 → 鹤槐亭",
          "zh-TW": "玫瑰園 → 傳統庭園 → 鶴槐亭",
        },
        bestTime: { ko: "5~6월", en: "May–June", ja: "5〜6月", "zh-CN": "五至六月", "zh-TW": "五至六月" },
      },
      {
        id: "sunset-walk",
        eyebrow: "SUNSET WALK",
        title: { ko: "한울광장의 일몰", en: "Sunset at Hanul Square", ja: "ハヌル広場の日没", "zh-CN": "한울广场的日落", "zh-TW": "한울廣場的日落" },
        hook: {
          ko: "하루의 끝을 걷던 사람에게",
          en: "For those who walked at the end of the day",
          ja: "一日の終わりを歩いていた方へ",
          "zh-CN": "献给习惯在日暮时分散步的人",
          "zh-TW": "獻給習慣在日暮時分散步的人",
        },
        body: {
          ko: "정발산역에서 육교를 건너면 바로 한울광장입니다. 해질 무렵 이곳에서 보는 일몰이 공원의 대표 풍경 중 하나입니다. 어두워지면 애수교에서 호수에 비친 도시 불빛을 볼 수 있고, 주말에는 노래하는분수대가 가동됩니다.",
          en: "Cross the footbridge from Jeongbalsan Station and you arrive at Hanul Square. The sunset seen from here is one of the park's signature views. After dark, Aesugyo Bridge frames the city lights on the water, and on weekends the Singing Fountain runs.",
          ja: "鼎鉢山駅から歩道橋を渡るとすぐハヌル広場です。夕暮れ時にここから見る日没は、この公園を代表する風景の一つです。暗くなると哀愁橋から湖面に映る街の灯りが見え、週末には歌う噴水台が稼働します。",
          "zh-CN": "从鼎钵山站过天桥即达한울广场。傍晚在此观看的日落是公园代表性景致之一。天黑后可从哀愁桥望见湖面倒映的城市灯火，周末歌唱喷泉开放。",
          "zh-TW": "從鼎缽山站過天橋即達한울廣場。傍晚在此觀看的日落是公園代表性景致之一。天黑後可從哀愁橋望見湖面倒映的城市燈火，週末歌唱噴泉開放。",
        },
        stops: {
          ko: "한울광장 → 호숫가 → 애수교",
          en: "Hanul Square → lakeside → Aesugyo Bridge",
          ja: "ハヌル広場 → 湖畔 → 哀愁橋",
          "zh-CN": "한울广场 → 湖畔 → 哀愁桥",
          "zh-TW": "한울廣場 → 湖畔 → 哀愁橋",
        },
        bestTime: { ko: "일몰 전후", en: "Around sunset", ja: "日没前後", "zh-CN": "日落前后", "zh-TW": "日落前後" },
      },
    ],
    // 오더 #C9 [2]: ON SCREEN 신설. 《대행사》 1건.
    onScreen: {
      works: [
        {
          type: "drama",
          titleKo: "대행사",
          titleEn: "Agency",
          broadcaster: "JTBC",
          year: "2023",
          characters: {
            ko: "촬영지",
            en: "Filming location",
            ja: "撮影地",
            "zh-CN": "取景地",
            "zh-TW": "取景地",
          },
          site: {
            ko: "일산호수공원",
            en: "Ilsan Lake Park",
            ja: "一山湖水公園",
            "zh-CN": "一山湖水公园",
            "zh-TW": "一山湖水公園",
          },
          open: true,
          note: {
            ko: "한국관광공사 한류 여행 정보에 등재된 촬영지입니다",
            en: "Listed as a filming location in the Korea Tourism Organization's Hallyu travel guide",
            ja: "韓国観光公社の韓流旅行情報に登録された撮影地です",
            "zh-CN": "已列入韩国观光公社韩流旅游信息的取景地",
            "zh-TW": "已列入韓國觀光公社韓流旅遊資訊的取景地",
          },
        },
        // 오더 #E1 [3]: 기존 《대행사》 유지, Ma City 1건 추가 (곡에 언급됨).
        {
          type: "music",
          titleKo: "Ma City",
          titleEn: "Ma City",
          artist: "BTS",
          album: "The Most Beautiful Moment in Life, Part 2",
          year: "2015",
          characters: { ko: "호수공원", en: "Ilsan Lake Park", ja: "湖水公園", "zh-CN": "湖水公园", "zh-TW": "湖水公園" },
          site: {
            ko: "이곳이 곡에 이름 그대로 등장합니다",
            en: "This place appears in the song by name",
            ja: "この場所が曲に名前のまま登場します",
            "zh-CN": "此地在歌曲中以原名出现",
            "zh-TW": "此地在歌曲中以原名出現",
          },
          open: true,
        },
      ],
    },
  },

  // ─── 오더 #C5: 산책 02~10 (spots-walk-02-10.md 그대로) ─────────────
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
    // 오더 #C8 [4]: 주 카테고리를 history 로 조정 (일러스트·NEARBY 용).
    //   walk 목록에서는 curated-stories items 로 유지됨.
    category: "history",
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
    // 오더 #C8 [4]: 주 카테고리 history. walk items 는 그대로 유지.
    category: "history",
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
    // 오더 #D4 [2]: lead 교체 (spots-onscreen-royal-tombs.md 그대로).
    //   subtitle · highlights · info · gallery 는 무변경.
    lead: {
      ko: "조선 왕실의 능 다섯 기와 원·묘가 한 자리에 모인 곳입니다. 숙종과 인현왕후, 장희빈, 인수대비, 사도세자의 생모 영빈 이씨가 모두 이곳에 잠들어 있어, 한국 사극을 본 사람이라면 낯익은 이름을 여럿 만나게 됩니다. 능과 능 사이로 숲길이 이어져 걷기에도 좋습니다.",
      en: "Five royal tombs of the Joseon dynasty, together with several smaller graves, share one wooded site. King Sukjong and Queen Inhyeon, Jang Hui-bin, Queen Insoo and Lady Yeongbin — the mother of Prince Sado — all rest here, so anyone who has watched Korean historical dramas will recognise the names. Forest paths link one tomb to the next.",
      ja: "朝鮮王室の陵五基と園·墓が一か所に集まっています。粛宗と仁顕王后、張禧嬪、仁粋大妃、思悼世子の生母である暎嬪李氏がここに眠っており、韓国時代劇を見た方なら見覚えのある名前に何度も出会います。陵と陵の間を森の道がつないでいます。",
      "zh-CN": "朝鲜王室五座王陵与数座园墓汇聚于此。肃宗与仁显王后、张禧嫔、仁粹大妃，以及思悼世子生母暎嫔李氏皆长眠于此，看过韩国古装剧的人会遇到许多熟悉的名字。陵与陵之间以林间小路相连。",
      "zh-TW": "朝鮮王室五座王陵與數座園墓匯聚於此。肅宗與仁顯王后、張禧嬪、仁粹大妃，以及思悼世子生母暎嬪李氏皆長眠於此，看過韓國古裝劇的人會遇到許多熟悉的名字。陵與陵之間以林間小路相連。",
    },
    meta: { updated_at: "2026-09-01" },
    sections: [],
    access: [],
    // 오더 #D4 [2]: know 항목 추가 (능·원·묘 구분 해설).
    know: [
      { ko: "조선왕릉 — 조선 왕과 왕비의 무덤으로, 40기가 유네스코 세계유산에 등재돼 있습니다.", en: "Royal Tombs of the Joseon Dynasty — 40 tombs of Joseon kings and queens, inscribed on the UNESCO World Heritage List.", ja: "朝鮮王陵 — 朝鮮の王と王妃の墓で、40基がユネスコ世界遺産に登録されています。", "zh-CN": "朝鲜王陵 — 朝鲜历代国王与王后的陵墓，共40座列入联合国教科文组织世界遗产。", "zh-TW": "朝鮮王陵 — 朝鮮歷代國王與王后的陵墓，共40座列入聯合國教科文組織世界遺產。" },
      { ko: "능 · 원 · 묘 — 왕과 왕비의 무덤은 능, 세자와 후궁의 무덤은 원, 그 밖은 묘로 구분합니다.", en: "Neung, Won, Myo — tombs of kings and queens are called neung; those of crown princes and royal concubines, won; others, myo.", ja: "陵·園·墓 — 王と王妃の墓は陵、世子と側室の墓は園、それ以外は墓と区分します。", "zh-CN": "陵·园·墓 — 国王与王后之墓称陵，世子与嫔御之墓称园，其余称墓。", "zh-TW": "陵·園·墓 — 國王與王后之墓稱陵，世子與嬪御之墓稱園，其餘稱墓。" },
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
    // 오더 #D4 [2]: ON SCREEN — 서오릉 (works 4건 + courses 2건).
    //   md 그대로. 배우명·포스터·로고·대사 없음. 전 works 전 구역 공개.
    onScreen: {
      works: [
        {
          type: "drama",
          titleKo: "동이",
          titleEn: "Dong Yi",
          broadcaster: "MBC",
          year: "2010",
          characters: {
            ko: "숙종 · 인현왕후 · 희빈 장씨",
            en: "King Sukjong · Queen Inhyeon · Jang Hui-bin",
            ja: "粛宗 · 仁顕王后 · 禧嬪張氏",
            "zh-CN": "肃宗 · 仁显王后 · 禧嫔张氏",
            "zh-TW": "肅宗 · 仁顯王后 · 禧嬪張氏",
          },
          site: {
            ko: "명릉(숙종·인현왕후) · 대빈묘(희빈 장씨)",
            en: "Myeongneung (Sukjong, Inhyeon) · Daebinmyo (Jang Hui-bin)",
            ja: "明陵(粛宗·仁顕王后) · 大嬪墓(禧嬪張氏)",
            "zh-CN": "明陵(肃宗·仁显王后) · 大嫔墓(禧嫔张氏)",
            "zh-TW": "明陵(肅宗·仁顯王后) · 大嬪墓(禧嬪張氏)",
          },
          open: true,
        },
        {
          type: "film",
          titleKo: "사도",
          titleEn: "The Throne",
          year: "2015",
          characters: {
            ko: "인원왕후 · 정성왕후 · 영빈 이씨",
            en: "Queen Inwon · Queen Jeongseong · Lady Yeongbin",
            ja: "仁元王后 · 貞聖王后 · 暎嬪李氏",
            "zh-CN": "仁元王后 · 贞圣王后 · 暎嫔李氏",
            "zh-TW": "仁元王后 · 貞聖王后 · 暎嬪李氏",
          },
          site: {
            ko: "명릉(인원왕후) · 홍릉(정성왕후) · 수경원(영빈 이씨)",
            en: "Myeongneung (Inwon) · Hongneung (Jeongseong) · Sugyeongwon (Lady Yeongbin)",
            ja: "明陵(仁元王后) · 弘陵(貞聖王后) · 綏慶園(暎嬪李氏)",
            "zh-CN": "明陵(仁元王后) · 弘陵(贞圣王后) · 绥庆园(暎嫔李氏)",
            "zh-TW": "明陵(仁元王后) · 弘陵(貞聖王后) · 綏慶園(暎嬪李氏)",
          },
          open: true,
          note: {
            ko: "영화 속 세 여인이 모두 이곳에 있습니다",
            en: "All three royal women from the film rest here",
            ja: "映画に登場する三人の女性が全員ここにいます",
            "zh-CN": "影片中的三位王室女性皆在此长眠",
            "zh-TW": "影片中的三位王室女性皆在此長眠",
          },
        },
        {
          type: "drama",
          titleKo: "인수대비",
          titleEn: "Queen Insoo",
          broadcaster: "JTBC",
          year: "2011",
          characters: {
            ko: "소혜왕후(인수대비) · 덕종",
            en: "Queen Insoo (Queen Sohye) · King Deokjong",
            ja: "昭恵王后(仁粋大妃) · 徳宗",
            "zh-CN": "昭惠王后(仁粹大妃) · 德宗",
            "zh-TW": "昭惠王后(仁粹大妃) · 德宗",
          },
          site: { ko: "경릉", en: "Gyeongneung", ja: "敬陵", "zh-CN": "敬陵", "zh-TW": "敬陵" },
          open: true,
        },
        {
          type: "drama",
          titleKo: "장옥정, 사랑에 살다",
          titleEn: "Jang Ok-jung, Live in Love",
          broadcaster: "SBS",
          year: "2013",
          characters: {
            ko: "숙종 · 희빈 장씨 · 인현왕후",
            en: "King Sukjong · Jang Hui-bin · Queen Inhyeon",
            ja: "粛宗 · 禧嬪張氏 · 仁顕王后",
            "zh-CN": "肃宗 · 禧嫔张氏 · 仁显王后",
            "zh-TW": "肅宗 · 禧嬪張氏 · 仁顯王后",
          },
          site: {
            ko: "명릉 · 대빈묘",
            en: "Myeongneung · Daebinmyo",
            ja: "明陵 · 大嬪墓",
            "zh-CN": "明陵 · 大嫔墓",
            "zh-TW": "明陵 · 大嬪墓",
          },
          open: true,
        },
      ],
      courses: [
        {
          name: {
            ko: "《사도》의 세 여인",
            en: "The Three Women of The Throne",
            ja: "『思悼』の三人の女性",
            "zh-CN": "《思悼》的三位女性",
            "zh-TW": "《思悼》的三位女性",
          },
          stops: [
            { ko: "명릉", en: "Myeongneung", ja: "明陵", "zh-CN": "明陵", "zh-TW": "明陵" },
            { ko: "홍릉", en: "Hongneung", ja: "弘陵", "zh-CN": "弘陵", "zh-TW": "弘陵" },
            { ko: "수경원", en: "Sugyeongwon", ja: "綏慶園", "zh-CN": "绥庆园", "zh-TW": "綏慶園" },
          ],
        },
        {
          name: {
            ko: "《동이》의 세 사람",
            en: "The Three of Dong Yi",
            ja: "『トンイ』の三人",
            "zh-CN": "《同伊》中的三人",
            "zh-TW": "《同伊》中的三人",
          },
          stops: [
            { ko: "명릉", en: "Myeongneung", ja: "明陵", "zh-CN": "明陵", "zh-TW": "明陵" },
            { ko: "대빈묘", en: "Daebinmyo", ja: "大嬪墓", "zh-CN": "大嫔墓", "zh-TW": "大嬪墓" },
          ],
        },
      ],
    },
    // 오더 #E1 [3]: 한복 무료입장 안내 (서오릉·서삼릉 동일).
    hanbok: {
      eligible: true,
      note: {
        ko: "한복을 입으면 입장료 없이 관람할 수 있습니다. 저고리와 치마 또는 바지를 함께 입은 경우에 해당하며, 전통한복과 생활한복 모두 인정됩니다. 외국인도 대상입니다.",
        en: "Wear hanbok and admission is free. This applies when a jeogori (upper garment) is worn together with a skirt or trousers; both traditional and modern-style hanbok qualify. Foreign visitors are eligible.",
        ja: "韓服を着用すると入場料なしで観覧できます。チョゴリとチマまたはパジを一緒に着用した場合が対象で、伝統韓服と生活韓服のいずれも認められます。外国人も対象です。",
        "zh-CN": "身着韩服即可免费入场。须上衣（赤古里）与裙或裤同时穿着，传统韩服与生活韩服均可。外国游客同样适用。",
        "zh-TW": "身著韓服即可免費入場。須上衣（赤古里）與裙或褲同時穿著，傳統韓服與生活韓服均可。外國遊客同樣適用。",
      },
      caution: {
        ko: "원피스형 한복, 청바지에 저고리만, 티셔츠 형태의 상의는 인정되지 않습니다. 삼각대나 조명 등 촬영 장비를 들여오는 경우 별도 규정이 적용됩니다.",
        en: "One-piece hanbok dresses, a jeogori worn over jeans, and T-shirt-style tops do not qualify. Bringing tripods, lighting or other equipment falls under separate rules.",
        ja: "ワンピース型の韓服、ジーンズにチョゴリのみ、Tシャツ形態の上衣は認められません。三脚や照明など撮影機材を持ち込む場合は別途規定が適用されます。",
        "zh-CN": "连衣裙式韩服、牛仔裤配赤古里、T恤式上衣均不符合。携带三脚架、灯光等拍摄器材另有规定。",
        "zh-TW": "連衣裙式韓服、牛仔褲配赤古里、T恤式上衣均不符合。攜帶三腳架、燈光等拍攝器材另有規定。",
      },
    },
    // 오더 #E1 [2][3]: THE STORY — 스토리파일 6챕터 + 왕가파일 3챕터 = 9.
    storiesHeader: {
      title: {
        ko: "다섯 개의 능, 다섯 개의 이야기",
        en: "Five Tombs, Five Stories",
        ja: "五つの陵、五つの物語",
        "zh-CN": "五座陵墓，五段故事",
        "zh-TW": "五座陵墓，五段故事",
      },
      lead: {
        ko: "한국 사극을 본 적이 있다면 이곳에 잠든 사람들의 이름을 이미 알고 계실지도 모릅니다. 왕의 사랑, 폐위된 왕비, 다시 뒤집힌 권력. 그 이야기의 주인공들이 거의 한 자리에 모여 있습니다.",
        en: "If you have watched a Korean historical drama, you may already know the names of the people buried here. A king's affection, a deposed queen, power overturned again. Most of those figures rest within this one site.",
        ja: "韓国時代劇をご覧になったことがあれば、ここに眠る人々の名前をすでにご存じかもしれません。王の寵愛、廃位された王妃、再び覆された権力。その物語の主人公たちがほぼ一か所に集まっています。",
        "zh-CN": "若您看过韩国古装剧，或许早已知晓长眠于此者的名字。君王的宠爱、被废的王后、再度翻转的权力——那些故事的主角几乎都汇聚于此。",
        "zh-TW": "若您看過韓國古裝劇，或許早已知曉長眠於此者的名字。君王的寵愛、被廢的王后、再度翻轉的權力——那些故事的主角幾乎都匯聚於此。",
      },
    },
    stories: [
      {
        eyebrow: "CHAPTER 1",
        theme: { ko: "사랑", en: "LOVE", ja: "愛", "zh-CN": "爱", "zh-TW": "愛" },
        title: {
          ko: "왕과 두 번 왕비가 된 여인",
          en: "The King and the Queen Who Returned",
          ja: "王と、二度王妃となった女性",
          "zh-CN": "君王与两度成为王后的女子",
          "zh-TW": "君王與兩度成為王后的女子",
        },
        people: {
          ko: "숙종 · 인현왕후 · 인원왕후",
          en: "King Sukjong · Queen Inhyeon · Queen Inwon",
          ja: "粛宗 · 仁顕王后 · 仁元王后",
          "zh-CN": "肃宗 · 仁显王后 · 仁元王后",
          "zh-TW": "肅宗 · 仁顯王后 · 仁元王后",
        },
        site: { ko: "명릉", en: "Myeongneung", ja: "明陵", "zh-CN": "明陵", "zh-TW": "明陵" },
        open: true,
        body: {
          ko: "숙종은 46년간 왕위에 있었습니다. 그의 왕비와 후궁을 둘러싼 일은 개인의 애정사가 아니라 당시 정치 세력이 뒤바뀌던 환국과 얽혀 있었습니다. 인현왕후는 폐위되었다가 다시 왕비가 되었습니다. 드라마에서 여러 번 그려진 그 관계의 두 사람이 지금 명릉에 함께 잠들어 있습니다.",
          en: "Sukjong reigned for forty-six years. What happened around his queens and consorts was not a private matter of affection but tangled with the hwan-guk — the abrupt reversals of political factions. Queen Inhyeon was deposed and later restored. The two figures at the centre of that story, retold many times on screen, now lie together at Myeongneung.",
          ja: "粛宗は46年間王位にありました。彼の王妃と側室をめぐる出来事は個人の恋愛史ではなく、当時政治勢力が入れ替わった換局と絡み合っていました。仁顕王后は廃位された後、再び王妃となりました。ドラマで幾度も描かれたその関係の二人が、今、明陵に共に眠っています。",
          "zh-CN": "肃宗在位四十六年。围绕其王后与嫔御的种种，并非私人情感之事，而与当时政治势力更迭的换局交织在一起。仁显王后曾被废黜，后又复位。剧中屡屡描绘的这段关系中的两人，如今共眠于明陵。",
          "zh-TW": "肅宗在位四十六年。圍繞其王后與嬪御的種種，並非私人情感之事，而與當時政治勢力更迭的換局交織在一起。仁顯王后曾被廢黜，後又復位。劇中屢屢描繪的這段關係中的兩人，如今共眠於明陵。",
        },
        onScreen: [
          { titleKo: "동이", titleEn: "Dong Yi", type: "drama", broadcaster: "MBC", year: "2010" },
          { titleKo: "장옥정, 사랑에 살다", titleEn: "Jang Ok-jung, Live in Love", type: "drama", broadcaster: "SBS", year: "2013" },
        ],
      },
      {
        eyebrow: "CHAPTER 2",
        theme: { ko: "권력", en: "POWER", ja: "権力", "zh-CN": "权力", "zh-TW": "權力" },
        title: {
          ko: "60년 동안 반복해 그려진 인물",
          en: "A Figure Retold for Sixty Years",
          ja: "60年間繰り返し描かれた人物",
          "zh-CN": "被反复演绎六十年的人物",
          "zh-TW": "被反覆演繹六十年的人物",
        },
        people: { ko: "희빈 장씨", en: "Jang Hui-bin", ja: "禧嬪張氏", "zh-CN": "禧嫔张氏", "zh-TW": "禧嬪張氏" },
        site: { ko: "대빈묘", en: "Daebinmyo", ja: "大嬪墓", "zh-CN": "大嫔墓", "zh-TW": "大嬪墓" },
        open: true,
        body: {
          ko: "희빈 장씨는 한국 영화와 드라마에서 가장 여러 번 다시 만들어진 인물 가운데 하나입니다. 1961년 영화를 시작으로 지금까지 여러 세대의 배우가 같은 인물을 연기했습니다. 왕의 총애를 받아 왕비가 되었다가 다시 물러났고, 마지막은 알려진 대로입니다. 그가 잠든 대빈묘는 명릉에서 걸어서 갈 수 있습니다.",
          en: "Jang Hui-bin is among the most frequently retold figures in Korean film and television. Beginning with a 1961 film, performers across several generations have played her. She rose to become queen under the king's favour, then lost that position; the ending is well known. Daebinmyo, where she rests, is a short walk from Myeongneung.",
          ja: "禧嬪張氏は韓国の映画とドラマで最も繰り返し作り直された人物の一人です。1961年の映画を皮切りに、今日まで何世代もの俳優が同じ人物を演じてきました。王の寵愛を受けて王妃となり、再び退けられ、最期は知られている通りです。彼女が眠る大嬪墓は明陵から歩いて行けます。",
          "zh-CN": "禧嫔张氏是韩国影视中被反复重塑最多的人物之一。自1961年的电影起，几代演员先后演绎过同一人物。她因君王宠爱而登上后位，又再度失势，结局众所周知。她长眠的大嫔墓，从明陵步行即可抵达。",
          "zh-TW": "禧嬪張氏是韓國影視中被反覆重塑最多的人物之一。自1961年的電影起，幾代演員先後演繹過同一人物。她因君王寵愛而登上后位，又再度失勢，結局眾所周知。她長眠的大嬪墓，從明陵步行即可抵達。",
        },
        onScreen: [
          { titleKo: "동이", titleEn: "Dong Yi", type: "drama", broadcaster: "MBC", year: "2010" },
          { titleKo: "장옥정, 사랑에 살다", titleEn: "Jang Ok-jung, Live in Love", type: "drama", broadcaster: "SBS", year: "2013" },
        ],
      },
      {
        eyebrow: "CHAPTER 3",
        theme: { ko: "첫 번째", en: "THE FIRST", ja: "最初の", "zh-CN": "最初", "zh-TW": "最初" },
        title: {
          ko: "드라마에 거의 나오지 않는 첫 왕비",
          en: "The First Queen, Rarely Seen on Screen",
          ja: "ドラマにほとんど登場しない最初の王妃",
          "zh-CN": "剧中鲜少出现的第一位王后",
          "zh-TW": "劇中鮮少出現的第一位王后",
        },
        people: { ko: "인경왕후", en: "Queen Ingyeong", ja: "仁敬王后", "zh-CN": "仁敬王后", "zh-TW": "仁敬王后" },
        site: { ko: "익릉", en: "Ikneung", ja: "翼陵", "zh-CN": "翼陵", "zh-TW": "翼陵" },
        open: true,
        body: {
          ko: "숙종의 첫 번째 왕비입니다. 인현왕후와 희빈 장씨의 이야기가 드라마의 중심이 되면서 인경왕후는 화면에 거의 등장하지 않습니다. 그러나 서오릉에서는 익릉이 명릉·대빈묘와 함께 있습니다. 이야기에서 밀려난 인물이 같은 자리에 있다는 점이 이 능의 특징입니다.",
          en: "Sukjong's first queen. As the story of Queen Inhyeon and Jang Hui-bin came to dominate the screen, Queen Ingyeong all but disappeared from it. At Seooreung, however, Ikneung stands alongside Myeongneung and Daebinmyo. That the figure written out of the drama lies in the same grounds is what marks this tomb.",
          ja: "粛宗の最初の王妃です。仁顕王后と禧嬪張氏の物語がドラマの中心となるにつれ、仁敬王后は画面にほとんど登場しなくなりました。しかし西五陵では、翼陵が明陵·大嬪墓とともにあります。物語から押し出された人物が同じ場所にいる——それがこの陵の特徴です。",
          "zh-CN": "肃宗的第一位王后。随着仁显王后与禧嫔张氏的故事成为剧作中心，仁敬王后几乎从画面中消失。然而在西五陵，翼陵与明陵、大嫔墓同处一地。被故事推到一旁的人物，仍在同一片土地上——这正是此陵的特别之处。",
          "zh-TW": "肅宗的第一位王后。隨著仁顯王后與禧嬪張氏的故事成為劇作中心，仁敬王后幾乎從畫面中消失。然而在西五陵，翼陵與明陵、大嬪墓同處一地。被故事推到一旁的人物，仍在同一片土地上——這正是此陵的特別之處。",
        },
      },
      {
        eyebrow: "CHAPTER 4",
        theme: { ko: "반전", en: "THE TWIST", ja: "反転", "zh-CN": "反转", "zh-TW": "反轉" },
        title: {
          ko: "영화에서는 탐정이 된 왕",
          en: "The King Who Became a Detective on Film",
          ja: "映画では探偵になった王",
          "zh-CN": "在影片中化身侦探的君王",
          "zh-TW": "在影片中化身偵探的君王",
        },
        people: { ko: "예종 · 안순왕후", en: "King Yejong · Queen Ansun", ja: "睿宗 · 安順王后", "zh-CN": "睿宗 · 安顺王后", "zh-TW": "睿宗 · 安順王后" },
        site: { ko: "창릉", en: "Changneung", ja: "昌陵", "zh-CN": "昌陵", "zh-TW": "昌陵" },
        open: true,
        body: {
          ko: "조선 제8대 왕 예종은 짧게 재위했습니다. 그런데 2017년 영화 《임금님의 사건수첩》에서는 사건을 추적하는 인물로 완전히 다르게 그려집니다. 영화 속 모습과 실제 기록의 간격이 큰 편이라, 영화를 본 사람에게는 창릉이 색다르게 보입니다.",
          en: "Yejong, the eighth king of Joseon, reigned only briefly. Yet in the 2017 film The King's Case Note he is drawn as an entirely different figure — one who chases down a case. The gap between the screen version and the record is wide, which makes Changneung read differently for anyone who has seen the film.",
          ja: "朝鮮第8代王の睿宗は在位が短い王でした。ところが2017年の映画『王様の事件手帖』では、事件を追う人物としてまったく異なる姿で描かれます。映画の中の姿と実際の記録との隔たりが大きく、映画を観た方には昌陵が違って見えます。",
          "zh-CN": "朝鲜第八代君王睿宗在位短暂。然而在2017年电影《君王的案件手册》中，他被塑造成追查案件的截然不同的形象。银幕形象与史实记载相去甚远，因此看过该片的人来到昌陵，感受会格外不同。",
          "zh-TW": "朝鮮第八代君王睿宗在位短暫。然而在2017年電影《君王的案件手冊》中，他被塑造成追查案件的截然不同的形象。銀幕形象與史實記載相去甚遠，因此看過該片的人來到昌陵，感受會格外不同。",
        },
        onScreen: [{ titleKo: "임금님의 사건수첩", titleEn: "The King's Case Note", type: "film", year: "2017" }],
      },
      {
        eyebrow: "CHAPTER 5",
        theme: { ko: "왕좌의 뒤", en: "BEHIND THE THRONE", ja: "王座の後ろ", "zh-CN": "王座之后", "zh-TW": "王座之後" },
        title: {
          ko: "왕이 되지 않고 왕을 만든 사람",
          en: "She Never Took the Throne. She Shaped Who Did.",
          ja: "王にはならず、王をつくった人",
          "zh-CN": "未曾登基，却塑造了君王",
          "zh-TW": "未曾登基，卻塑造了君王",
        },
        people: {
          ko: "소혜왕후(인수대비) · 덕종",
          en: "Queen Sohye (Queen Insoo) · King Deokjong",
          ja: "昭恵王后(仁粋大妃) · 徳宗",
          "zh-CN": "昭惠王后(仁粹大妃) · 德宗",
          "zh-TW": "昭惠王后(仁粹大妃) · 德宗",
        },
        site: { ko: "경릉", en: "Gyeongneung", ja: "敬陵", "zh-CN": "敬陵", "zh-TW": "敬陵" },
        open: true,
        body: {
          ko: "남편이 왕위에 오르기 전 세상을 떠나면서 소혜왕후는 왕비가 되지 못했습니다. 그러나 아들이 왕이 되고 손자가 그 뒤를 이으면서 왕실 안에서 오래 영향력을 행사했습니다. 흔히 인수대비로 불립니다. 이 인물을 제목으로 삼은 드라마가 따로 만들어졌을 만큼 이야깃거리가 많은 사람입니다.",
          en: "Because her husband died before taking the throne, Sohye never became queen consort. But her son became king and her grandson followed, and she held influence within the court for a long time. She is commonly known as Queen Insoo. A drama was made bearing her name alone — an indication of how much there is to tell.",
          ja: "夫が王位に就く前に世を去ったため、昭恵王后は王妃にはなれませんでした。しかし息子が王となり孫がその後を継ぐ中で、王室内で長く影響力を持ちました。一般に仁粋大妃と呼ばれます。この人物を題名にしたドラマが別途作られたほど、語るべきことの多い人です。",
          "zh-CN": "因丈夫在登基前离世，昭惠王后未能成为王后。但其子继位、其孙相承，她在宫廷内长期握有影响力，世称仁粹大妃。曾有以她之名为题的电视剧问世，可见其故事之丰富。",
          "zh-TW": "因丈夫在登基前離世，昭惠王后未能成為王后。但其子繼位、其孫相承，她在宮廷內長期握有影響力，世稱仁粹大妃。曾有以她之名為題的電視劇問世，可見其故事之豐富。",
        },
        onScreen: [{ titleKo: "인수대비", titleEn: "Queen Insoo", type: "drama", broadcaster: "JTBC", year: "2011" }],
      },
      {
        eyebrow: "A BRIDGE",
        theme: { ko: "닮은 구조", en: "A FAMILIAR SHAPE", ja: "似た構造", "zh-CN": "相似的结构", "zh-TW": "相似的結構" },
        title: {
          ko: "앤 불린을 아신다면",
          en: "If You Know Anne Boleyn",
          ja: "アン・ブーリンをご存じなら",
          "zh-CN": "若您知晓安妮·博林",
          "zh-TW": "若您知曉安妮·博林",
        },
        // 유럽 관광객용 다리 — people 은 없음
        site: { ko: "대빈묘", en: "Daebinmyo", ja: "大嬪墓", "zh-CN": "大嫔墓", "zh-TW": "大嬪墓" },
        open: true,
        body: {
          ko: "왕의 총애를 받아 왕비가 된 여성, 궁정의 권력 다툼, 그리고 몰락. 이 구조는 여러 나라의 역사에서 되풀이됩니다. 유럽에서 앤 불린이 오페라로 기억된다면, 한국에서 희빈 장씨는 영화와 드라마로 기억됩니다. 같은 인물이라는 뜻은 아닙니다. 시대도 제도도 삶도 다릅니다. 다만 이야기의 모양이 닮아 있습니다.",
          en: "A woman who rose to queen through a king's favour, a court struggle for power, and a fall. This shape recurs across many national histories. Where Europe remembers Anne Boleyn through opera, Korea remembers Jang Hui-bin through film and television. This is not to say they were the same. The eras, the institutions and the lives were entirely different. Only the shape of the story rhymes.",
          ja: "王の寵愛を受けて王妃となった女性、宮廷の権力争い、そして没落。この構造は複数の国の歴史で繰り返されます。ヨーロッパでアン・ブーリンがオペラで記憶されるなら、韓国では禧嬪張氏が映画とドラマで記憶されます。同じ人物という意味ではありません。時代も制度も生涯も異なります。ただ物語の形が似ているのです。",
          "zh-CN": "因君王宠爱而登上后位的女子、宫廷权力之争，以及最终的陨落。这一结构在多国历史中反复出现。若说欧洲以歌剧铭记安妮·博林，韩国则以影视铭记禧嫔张氏。这并非指两人相同——时代、制度与人生皆不相同，只是故事的形状彼此呼应。",
          "zh-TW": "因君王寵愛而登上后位的女子、宮廷權力之爭，以及最終的殞落。這一結構在多國歷史中反覆出現。若說歐洲以歌劇銘記安妮·博林，韓國則以影視銘記禧嬪張氏。這並非指兩人相同——時代、制度與人生皆不相同，只是故事的形狀彼此呼應。",
        },
      },
      // 왕가파일 3챕터 (수경원·홍릉·순창원)
      {
        eyebrow: "CHAPTER 7",
        theme: { ko: "어머니의 선택", en: "A MOTHER'S CHOICE", ja: "母の選択", "zh-CN": "母亲的抉择", "zh-TW": "母親的抉擇" },
        title: {
          ko: "사도세자를 낳은 사람",
          en: "The Woman Who Bore Prince Sado",
          ja: "思悼世子を産んだ人",
          "zh-CN": "生下思悼世子的人",
          "zh-TW": "生下思悼世子的人",
        },
        people: { ko: "영빈 이씨", en: "Lady Yeongbin Yi", ja: "暎嬪李氏", "zh-CN": "暎嫔李氏", "zh-TW": "暎嬪李氏" },
        site: { ko: "수경원", en: "Sugyeongwon", ja: "綏慶園", "zh-CN": "绥庆园", "zh-TW": "綏慶園" },
        open: true,
        body: {
          ko: "영빈 이씨는 영조의 후궁이며 사도세자의 생모입니다. 사도세자를 둘러싼 일에서 그가 어떤 위치에 있었는지는 기록과 해석이 갈립니다. 영화 《사도》에도 이 인물이 등장합니다. 무덤은 1970년대에 서오릉으로 옮겨졌고, 옮기는 과정에서 나온 부장품 일부가 서오릉 역사문화관에 전시되고 있습니다.",
          en: "Lady Yeongbin was a consort of King Yeongjo and the birth mother of Prince Sado. Where she stood in the events surrounding her son is a matter on which records and readings differ. She appears in the film The Throne. Her tomb was moved to Seooreung in the 1970s, and some of the burial goods recovered in the process are displayed at the Seooreung history museum.",
          ja: "暎嬪李氏は英祖の側室であり、思悼世子の生母です。思悼世子をめぐる出来事において彼女がどの位置にいたかは、記録と解釈が分かれます。映画『思悼』にもこの人物が登場します。墓は1970年代に西五陵へ移され、移葬の過程で出土した副葬品の一部が西五陵歴史文化館に展示されています。",
          "zh-CN": "暎嫔李氏是英祖的嫔御，思悼世子的生母。在围绕其子的事件中她处于何种位置，记载与解读各有不同。电影《思悼》中亦有此人物。其墓于1970年代迁至西五陵，迁葬过程中出土的部分随葬品现陈列于西五陵历史文化馆。",
          "zh-TW": "暎嬪李氏是英祖的嬪御，思悼世子的生母。在圍繞其子的事件中她處於何種位置，記載與解讀各有不同。電影《思悼》中亦有此人物。其墓於1970年代遷至西五陵，遷葬過程中出土的部分隨葬品現陳列於西五陵歷史文化館。",
        },
        onScreen: [{ titleKo: "사도", titleEn: "The Throne", type: "film", year: "2015" }],
      },
      {
        eyebrow: "CHAPTER 8",
        theme: { ko: "비워진 자리", en: "THE EMPTY SPACE", ja: "空けられた場所", "zh-CN": "空置之位", "zh-TW": "空置之位" },
        title: {
          ko: "옆자리가 비어 있는 능",
          en: "The Tomb with an Empty Space Beside It",
          ja: "隣が空いたままの陵",
          "zh-CN": "身旁空置的陵",
          "zh-TW": "身旁空置的陵",
        },
        people: { ko: "정성왕후", en: "Queen Jeongseong", ja: "貞聖王后", "zh-CN": "贞圣王后", "zh-TW": "貞聖王后" },
        site: { ko: "홍릉", en: "Hongneung", ja: "弘陵", "zh-CN": "弘陵", "zh-TW": "弘陵" },
        open: true,
        body: {
          // md 「영조가 자리를 미리 마련했으나 다른 곳에 묻혔다」 → 검증 필요 표기.
          //   확정 전이므로 그 문장을 제외하고 나머지만 사용.
          ko: "정성왕후는 영조의 첫 번째 왕비입니다. 영화 《사도》에 이 인물이 등장하며, 영빈 이씨의 수경원도 같은 서오릉 안에 있습니다.",
          en: "Queen Jeongseong was King Yeongjo's first queen. She appears in the film The Throne, and Sugyeongwon — Lady Yeongbin's grave — lies within the same grounds.",
          ja: "貞聖王后は英祖の最初の王妃です。映画『思悼』にこの人物が登場し、暎嬪李氏の綏慶園も同じ西五陵内にあります。",
          "zh-CN": "贞圣王后是英祖的第一位王后。电影《思悼》中有此人物，而暎嫔李氏的绥庆园亦在同一片西五陵内。",
          "zh-TW": "貞聖王后是英祖的第一位王后。電影《思悼》中有此人物，而暎嬪李氏的綏慶園亦在同一片西五陵內。",
        },
        onScreen: [{ titleKo: "사도", titleEn: "The Throne", type: "film", year: "2015" }],
      },
      {
        eyebrow: "CHAPTER 9",
        theme: { ko: "이어지지 않은 왕위", en: "THE THRONE THAT PASSED", ja: "継がれなかった王位", "zh-CN": "未能继承的王位", "zh-TW": "未能繼承的王位" },
        title: {
          ko: "명종의 하나뿐인 아들",
          en: "Myeongjong's Only Son",
          ja: "明宗のただ一人の息子",
          "zh-CN": "明宗唯一的儿子",
          "zh-TW": "明宗唯一的兒子",
        },
        people: {
          ko: "순회세자 · 공회빈 윤씨",
          en: "Crown Prince Sunhoe · Lady Gonghoebin Yun",
          ja: "順懐世子 · 恭懐嬪尹氏",
          "zh-CN": "顺怀世子 · 恭怀嫔尹氏",
          "zh-TW": "順懷世子 · 恭懷嬪尹氏",
        },
        site: { ko: "순창원", en: "Sunchangwon", ja: "順昌園", "zh-CN": "顺昌园", "zh-TW": "順昌園" },
        open: true,
        body: {
          ko: "순회세자는 명종의 아들입니다. 어린 나이에 세상을 떠나면서 명종에게는 뒤를 이을 아들이 남지 않았고, 왕위는 다른 가계로 넘어갔습니다. 서오릉의 다른 능묘와 달리 이곳은 드라마에서 거의 다뤄지지 않습니다.",
          en: "Sunhoe was the son of King Myeongjong. He died young, leaving Myeongjong without an heir, and the throne passed to another line. Unlike the other tombs at Seooreung, this one is almost never treated on screen.",
          ja: "順懐世子は明宗の息子です。幼くして世を去り、明宗には跡を継ぐ息子が残らず、王位は別の家系に移りました。西五陵の他の陵墓と異なり、ここはドラマでほとんど扱われません。",
          "zh-CN": "顺怀世子是明宗之子。他年幼离世，明宗因此再无子嗣继位，王位遂转入他系。与西五陵其他陵墓不同，此处几乎从未出现在影视中。",
          "zh-TW": "順懷世子是明宗之子。他年幼離世，明宗因此再無子嗣繼位，王位遂轉入他系。與西五陵其他陵墓不同，此處幾乎從未出現在影視中。",
        },
      },
    ],
  },

  {
    slug: "seosamneung",
    // 오더 #C8 [4]: 주 카테고리 history. walk items 는 그대로 유지.
    category: "history",
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
    // 오더 #D4 [2]: lead 교체 (spots-onscreen-royal-tombs.md 그대로).
    lead: {
      ko: "조선 왕실의 능 세 기를 중심으로 원과 묘가 모인 곳입니다. 철종과 철인왕후, 장경왕후가 이곳에 잠들어 있습니다. 방문객이 비교적 적어 조용하게 걸을 수 있습니다.",
      en: "A royal burial ground centred on three Joseon tombs, with several smaller graves nearby. King Cheoljong and Queen Cheorin, and Queen Janggyeong, rest here. It draws fewer visitors, so the walk stays quiet.",
      ja: "朝鮮王室の陵三基を中心に園と墓が集まった場所です。哲宗と哲仁王后、章敬王后がここに眠っています。訪問者が比較的少なく静かに歩けます。",
      "zh-CN": "以朝鲜王室三座王陵为中心，园墓聚集之地。哲宗与哲仁王后、章敬王后长眠于此。访客较少，可安静漫步。",
      "zh-TW": "以朝鮮王室三座王陵為中心，園墓聚集之地。哲宗與哲仁王后、章敬王后長眠於此。訪客較少，可安靜漫步。",
    },
    meta: { updated_at: "2026-09-01" },
    sections: [],
    access: [],
    // 오더 #D4 [2]: know 항목 추가 (조선왕릉·서오릉·서삼릉 유네스코 포함).
    know: [
      { ko: "조선왕릉 — 조선의 왕과 왕비 무덤 40기가 유네스코 세계유산에 등재돼 있습니다. 서오릉과 서삼릉은 모두 여기에 포함됩니다.", en: "Royal Tombs of the Joseon Dynasty — 40 tombs inscribed on the UNESCO World Heritage List, including both Seooreung and Seosamneung.", ja: "朝鮮王陵 — 朝鮮の王と王妃の墓40基がユネスコ世界遺産に登録されており、西五陵と西三陵はいずれも含まれます。", "zh-CN": "朝鲜王陵 — 40座朝鲜国王与王后陵墓列入联合国教科文组织世界遗产，西五陵与西三陵均在其中。", "zh-TW": "朝鮮王陵 — 40座朝鮮國王與王后陵墓列入聯合國教科文組織世界遺產，西五陵與西三陵均在其中。" },
    ],
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
    // 오더 #D4 [2][4]: ON SCREEN — 서삼릉 (works 4건, courses 없음).
    //   《올빼미》·《연인》 두 작품은 소경원 비공개 → open:false, 필수 병기.
    onScreen: {
      works: [
        {
          type: "drama",
          titleKo: "철인왕후",
          titleEn: "Mr. Queen",
          broadcaster: "tvN",
          year: "2020",
          characters: {
            ko: "철종 · 철인왕후",
            en: "King Cheoljong · Queen Cheorin",
            ja: "哲宗 · 哲仁王后",
            "zh-CN": "哲宗 · 哲仁王后",
            "zh-TW": "哲宗 · 哲仁王后",
          },
          site: { ko: "예릉", en: "Yeneung", ja: "睿陵", "zh-CN": "睿陵", "zh-TW": "睿陵" },
          open: true,
          note: {
            ko: "드라마의 두 주인공이 실제로 함께 잠든 곳입니다",
            en: "The drama's two leads actually rest here together",
            ja: "ドラマの二人の主人公が実際に共に眠る場所です",
            "zh-CN": "剧中两位主角实际合葬于此",
            "zh-TW": "劇中兩位主角實際合葬於此",
          },
        },
        {
          type: "drama",
          titleKo: "여인천하",
          titleEn: "Ladies of the Palace",
          broadcaster: "SBS",
          year: "2001",
          characters: {
            ko: "장경왕후 · 인종 · 인성왕후",
            en: "Queen Janggyeong · King Injong · Queen Inseong",
            ja: "章敬王后 · 仁宗 · 仁聖王后",
            "zh-CN": "章敬王后 · 仁宗 · 仁圣王后",
            "zh-TW": "章敬王后 · 仁宗 · 仁聖王后",
          },
          site: {
            ko: "희릉(장경왕후) · 효릉(인종·인성왕후)",
            en: "Huireung (Janggyeong) · Hyoreung (Injong, Inseong)",
            ja: "禧陵(章敬王后) · 孝陵(仁宗·仁聖王后)",
            "zh-CN": "禧陵(章敬王后) · 孝陵(仁宗·仁圣王后)",
            "zh-TW": "禧陵(章敬王后) · 孝陵(仁宗·仁聖王后)",
          },
          open: true,
          note: {
            ko: "효릉은 예약제로 제한 공개됩니다",
            en: "Hyoreung is open by reservation only",
            ja: "孝陵は予約制で限定公開です",
            "zh-CN": "孝陵采预约制限量开放",
            "zh-TW": "孝陵採預約制限量開放",
          },
        },
        {
          type: "film",
          titleKo: "올빼미",
          titleEn: "The Night Owl",
          year: "2022",
          characters: {
            ko: "소현세자",
            en: "Crown Prince Sohyeon",
            ja: "昭顕世子",
            "zh-CN": "昭显世子",
            "zh-TW": "昭顯世子",
          },
          site: { ko: "소경원", en: "Sogyeongwon", ja: "昭慶園", "zh-CN": "昭庆园", "zh-TW": "昭慶園" },
          open: false,
        },
        {
          type: "drama",
          titleKo: "연인",
          titleEn: "My Dearest",
          broadcaster: "MBC",
          year: "2023",
          characters: {
            ko: "소현세자",
            en: "Crown Prince Sohyeon",
            ja: "昭顕世子",
            "zh-CN": "昭显世子",
            "zh-TW": "昭顯世子",
          },
          site: { ko: "소경원", en: "Sogyeongwon", ja: "昭慶園", "zh-CN": "昭庆园", "zh-TW": "昭慶園" },
          open: false,
        },
      ],
    },
    // 오더 #E1 [3]: 한복 무료입장 안내 (서오릉·서삼릉 동일 데이터).
    hanbok: {
      eligible: true,
      note: {
        ko: "한복을 입으면 입장료 없이 관람할 수 있습니다. 저고리와 치마 또는 바지를 함께 입은 경우에 해당하며, 전통한복과 생활한복 모두 인정됩니다. 외국인도 대상입니다.",
        en: "Wear hanbok and admission is free. This applies when a jeogori (upper garment) is worn together with a skirt or trousers; both traditional and modern-style hanbok qualify. Foreign visitors are eligible.",
        ja: "韓服を着用すると入場料なしで観覧できます。チョゴリとチマまたはパジを一緒に着用した場合が対象で、伝統韓服と生活韓服のいずれも認められます。外国人も対象です。",
        "zh-CN": "身着韩服即可免费入场。须上衣（赤古里）与裙或裤同时穿着，传统韩服与生活韩服均可。外国游客同样适用。",
        "zh-TW": "身著韓服即可免費入場。須上衣（赤古里）與裙或褲同時穿著，傳統韓服與生活韓服均可。外國遊客同樣適用。",
      },
      caution: {
        ko: "원피스형 한복, 청바지에 저고리만, 티셔츠 형태의 상의는 인정되지 않습니다. 삼각대나 조명 등 촬영 장비를 들여오는 경우 별도 규정이 적용됩니다.",
        en: "One-piece hanbok dresses, a jeogori worn over jeans, and T-shirt-style tops do not qualify. Bringing tripods, lighting or other equipment falls under separate rules.",
        ja: "ワンピース型の韓服、ジーンズにチョゴリのみ、Tシャツ形態の上衣は認められません。三脚や照明など撮影機材を持ち込む場合は別途規定が適用されます。",
        "zh-CN": "连衣裙式韩服、牛仔裤配赤古里、T恤式上衣均不符合。携带三脚架、灯光等拍摄器材另有规定。",
        "zh-TW": "連衣裙式韓服、牛仔褲配赤古里、T恤式上衣均不符合。攜帶三腳架、燈光等拍攝器材另有規定。",
      },
    },
    // 오더 #E1 [2][3]: 스토리파일 3챕터 + 왕가파일 4챕터. open:null 3건은 렌더 X.
    storiesHeader: {
      title: {
        ko: "조용한 능역에 남은 이야기",
        en: "Stories in a Quieter Ground",
        ja: "静かな陵域に残る物語",
        "zh-CN": "静谧陵域中留存的故事",
        "zh-TW": "靜謐陵域中留存的故事",
      },
      lead: {
        ko: "서오릉보다 방문객이 적고 조용합니다. 그러나 이곳에도 화면에서 여러 번 다뤄진 인물들이 잠들어 있습니다. 일부 구역은 공개되지 않으니 방문 전에 확인하세요.",
        en: "Quieter and less visited than Seooreung. Yet figures who have appeared on screen many times rest here too. Some areas are not open to visitors, so check before you go.",
        ja: "西五陵より訪問者が少なく静かです。しかしここにも画面で幾度も扱われた人物が眠っています。一部区域は公開されていないため、訪問前にご確認ください。",
        "zh-CN": "比西五陵更为清静，访客较少。但此处同样长眠着多次登上银幕的人物。部分区域不对外开放，前往前请先确认。",
        "zh-TW": "比西五陵更為清靜，訪客較少。但此處同樣長眠著多次登上銀幕的人物。部分區域不對外開放，前往前請先確認。",
      },
    },
    stories: [
      // 스토리파일 CH1 — 예릉
      {
        eyebrow: "CHAPTER 1",
        theme: { ko: "왕과 왕비", en: "KING AND QUEEN", ja: "王と王妃", "zh-CN": "君王与王后", "zh-TW": "君王與王后" },
        title: {
          ko: "드라마의 두 주인공이 함께 잠든 곳",
          en: "Where the Drama's Two Leads Rest Together",
          ja: "ドラマの二人の主人公が共に眠る場所",
          "zh-CN": "剧中两位主角合葬之处",
          "zh-TW": "劇中兩位主角合葬之處",
        },
        people: { ko: "철종 · 철인왕후", en: "King Cheoljong · Queen Cheorin", ja: "哲宗 · 哲仁王后", "zh-CN": "哲宗 · 哲仁王后", "zh-TW": "哲宗 · 哲仁王后" },
        site: { ko: "예릉", en: "Yeneung", ja: "睿陵", "zh-CN": "睿陵", "zh-TW": "睿陵" },
        open: true,
        body: {
          ko: "철종은 왕이 될 준비 없이 왕위에 올랐습니다. 강화도에서 지내다 불려 왔고, 재위 중 실권은 다른 곳에 있었습니다. 2020년 드라마 《철인왕후》는 이 왕과 왕비를 두 주인공으로 삼았습니다. 예릉에는 그 두 사람이 실제로 함께 잠들어 있습니다.",
          en: "Cheoljong came to the throne without preparation for it. He had been living on Ganghwa Island when he was summoned, and real power lay elsewhere during his reign. The 2020 drama Mr. Queen made this king and queen its two leads. At Yeneung the two of them lie together in fact.",
          ja: "哲宗は王になる準備のないまま王位に就きました。江華島で暮らしていたところを呼ばれ、在位中の実権は別のところにありました。2020年のドラマ『哲仁王后』はこの王と王妃を二人の主人公にしました。睿陵にはその二人が実際に共に眠っています。",
          "zh-CN": "哲宗未经准备便登上王位。他原居于江华岛，被召入宫，在位期间实权旁落。2020年电视剧《哲仁王后》以这位君王与王后为两位主角。而睿陵中，两人确实合葬于此。",
          "zh-TW": "哲宗未經準備便登上王位。他原居於江華島，被召入宮，在位期間實權旁落。2020年電視劇《哲仁王后》以這位君王與王后為兩位主角。而睿陵中，兩人確實合葬於此。",
        },
        onScreen: [{ titleKo: "철인왕후", titleEn: "Mr. Queen", type: "drama", broadcaster: "tvN", year: "2020" }],
      },
      // 스토리파일 CH2 — 희릉·효릉
      {
        eyebrow: "CHAPTER 2",
        theme: { ko: "어머니와 아들", en: "MOTHER AND SON", ja: "母と子", "zh-CN": "母与子", "zh-TW": "母與子" },
        title: {
          ko: "나란히 놓인 두 개의 능",
          en: "Two Tombs Side by Side",
          ja: "並んで置かれた二つの陵",
          "zh-CN": "并列而立的两座陵",
          "zh-TW": "並列而立的兩座陵",
        },
        people: {
          ko: "장경왕후 · 인종 · 인성왕후",
          en: "Queen Janggyeong · King Injong · Queen Inseong",
          ja: "章敬王后 · 仁宗 · 仁聖王后",
          "zh-CN": "章敬王后 · 仁宗 · 仁圣王后",
          "zh-TW": "章敬王后 · 仁宗 · 仁聖王后",
        },
        site: {
          ko: "희릉(장경왕후) · 효릉(인종·인성왕후)",
          en: "Huireung (Janggyeong) · Hyoreung (Injong, Inseong)",
          ja: "禧陵(章敬王后) · 孝陵(仁宗·仁聖王后)",
          "zh-CN": "禧陵(章敬王后) · 孝陵(仁宗·仁圣王后)",
          "zh-TW": "禧陵(章敬王后) · 孝陵(仁宗·仁聖王后)",
        },
        open: true,
        body: {
          ko: "장경왕후는 원자를 낳은 뒤 얼마 지나지 않아 세상을 떠났습니다. 그 아들이 뒷날 인종입니다. 서삼릉에는 어머니의 희릉과 아들 부부의 효릉이 함께 있습니다. 2001년 드라마 《여인천하》가 이 시기를 다뤘습니다.",
          en: "Queen Janggyeong died not long after giving birth to a son. That son later became King Injong. At Seosamneung the mother's tomb, Huireung, stands together with Hyoreung, where her son and his queen lie. The 2001 drama Ladies of the Palace covered this period.",
          ja: "章敬王后は元子を産んで間もなく世を去りました。その子が後の仁宗です。西三陵には母の禧陵と、息子夫妻の孝陵が共にあります。2001年のドラマ『女人天下』がこの時期を扱いました。",
          "zh-CN": "章敬王后产下元子后不久便离世，那个孩子便是日后的仁宗。西三陵中，母亲的禧陵与其子夫妇的孝陵同处一地。2001年电视剧《女人天下》即描绘了这一时期。",
          "zh-TW": "章敬王后產下元子後不久便離世，那個孩子便是日後的仁宗。西三陵中，母親的禧陵與其子夫婦的孝陵同處一地。2001年電視劇《女人天下》即描繪了這一時期。",
        },
        onScreen: [{ titleKo: "여인천하", titleEn: "Ladies of the Palace", type: "drama", broadcaster: "SBS", year: "2001" }],
        note: {
          ko: "효릉은 예약제로 제한 공개됩니다",
          en: "Hyoreung is open by reservation only",
          ja: "孝陵は予約制で限定公開です",
          "zh-CN": "孝陵采预约制限量开放",
          "zh-TW": "孝陵採預約制限量開放",
        },
      },
      // 스토리파일 CH3 — 소경원 (open false)
      {
        eyebrow: "CHAPTER 3",
        theme: { ko: "돌아온 세자", en: "THE PRINCE WHO RETURNED", ja: "帰ってきた世子", "zh-CN": "归来的世子", "zh-TW": "歸來的世子" },
        title: {
          ko: "8년 만에 돌아와 두 달 만에",
          en: "Eight Years Away, Two Months Home",
          ja: "八年ぶりに帰り、二か月で",
          "zh-CN": "八年归来，两月而终",
          "zh-TW": "八年歸來，兩月而終",
        },
        people: { ko: "소현세자", en: "Crown Prince Sohyeon", ja: "昭顕世子", "zh-CN": "昭显世子", "zh-TW": "昭顯世子" },
        site: { ko: "소경원", en: "Sogyeongwon", ja: "昭慶園", "zh-CN": "昭庆园", "zh-TW": "昭慶園" },
        open: false,
        body: {
          ko: "병자호란 뒤 소현세자는 청나라에 볼모로 갔습니다. 8년이 지나 돌아왔지만 얼마 지나지 않아 세상을 떠났고, 그 죽음을 둘러싼 기록은 지금도 여러 해석을 남깁니다. 영화 《올빼미》와 드라마 《연인》이 이 시기를 다뤘습니다.",
          en: "After the Manchu invasion, Crown Prince Sohyeon was taken to Qing China as a hostage. He returned eight years later and died not long after; the records surrounding that death still admit of several readings. The film The Night Owl and the drama My Dearest both dealt with this period.",
          ja: "丙子胡乱の後、昭顕世子は清に人質として送られました。八年を経て帰りましたが、まもなく世を去り、その死をめぐる記録は今も複数の解釈を残しています。映画『オクル』とドラマ『恋人』がこの時期を扱いました。",
          "zh-CN": "丙子胡乱后，昭显世子被送往清朝为质。八年后归国，不久便离世，围绕其死因的记载至今仍有多种解读。电影《猫头鹰》与电视剧《恋人》皆描绘了这一时期。",
          "zh-TW": "丙子胡亂後，昭顯世子被送往清朝為質。八年後歸國，不久便離世，圍繞其死因的記載至今仍有多種解讀。電影《貓頭鷹》與電視劇《戀人》皆描繪了這一時期。",
        },
        onScreen: [
          { titleKo: "올빼미", titleEn: "The Night Owl", type: "film", year: "2022" },
          { titleKo: "연인", titleEn: "My Dearest", type: "drama", broadcaster: "MBC", year: "2023" },
        ],
      },
      // 왕가파일 CH4 — 태실 (open false, note 병기)
      {
        eyebrow: "CHAPTER 4",
        theme: { ko: "모아진 것들", en: "THE GATHERED", ja: "集められたもの", "zh-CN": "被聚集之物", "zh-TW": "被聚集之物" },
        title: {
          ko: "전국에서 옮겨진 왕실의 태실",
          en: "Royal Placenta Chambers Moved from Across the Country",
          ja: "全国から移された王室の胎室",
          "zh-CN": "自全国迁来的王室胎室",
          "zh-TW": "自全國遷來的王室胎室",
        },
        people: {
          ko: "조선 왕실",
          en: "The Joseon royal house",
          ja: "朝鮮王室",
          "zh-CN": "朝鲜王室",
          "zh-TW": "朝鮮王室",
        },
        site: { ko: "태실 54기", en: "54 placenta chambers", ja: "胎室54基", "zh-CN": "54座胎室", "zh-TW": "54座胎室" },
        open: false,
        body: {
          ko: "조선 왕실은 아이가 태어나면 탯줄을 항아리에 담아 좋은 땅을 골라 묻었습니다. 이것을 태실이라 부르며 전국 각지에 흩어져 있었습니다. 일제강점기에 일본은 이 태실들을 원래 자리에서 파내 서삼릉 한 곳으로 모았습니다. 지금 이곳에는 54기가 줄지어 있습니다. 왕이 태어난 땅과 태실이 분리된 상태로 백 년 가까이 지났습니다.",
          en: "When a child was born into the Joseon royal house, the umbilical cord was placed in a jar and buried in a carefully chosen site. These are called taesil — placenta chambers — and they were scattered across the country. During the colonial period the Japanese authorities dug them out of their original locations and gathered them here at Seosamneung. Fifty-four now stand in rows. Nearly a century has passed with the chambers separated from the ground where each king was born.",
          ja: "朝鮮王室では子が生まれると、へその緒を壺に納め、良い土地を選んで埋めました。これを胎室と呼び、全国各地に散らばっていました。日本統治期に日本は、これらの胎室を元の場所から掘り出し、西三陵の一か所に集めました。今ここには54基が並んでいます。王が生まれた土地と胎室が切り離されたまま、百年近くが過ぎました。",
          "zh-CN": "朝鲜王室每逢有子女降生，便将脐带盛入瓮中，择吉地埋藏，称为胎室，原本散布全国各地。日据时期，日本当局将这些胎室从原址掘出，集中迁至西三陵一处。如今此地排列着54座。国王出生之地与其胎室分离，已近百年。",
          "zh-TW": "朝鮮王室每逢有子女降生，便將臍帶盛入甕中，擇吉地埋藏，稱為胎室，原本散布全國各地。日據時期，日本當局將這些胎室從原址掘出，集中遷至西三陵一處。如今此地排列著54座。國王出生之地與其胎室分離，已近百年。",
        },
        note: {
          ko: "태실 권역은 예약제로 제한 공개됩니다",
          en: "The taesil area is open by reservation only",
          ja: "胎室区域は予約制で限定公開です",
          "zh-CN": "胎室区域采预约制限量开放",
          "zh-TW": "胎室區域採預約制限量開放",
        },
      },
      // 왕가파일 CH5 — 효창원 (open null → 렌더 X, 데이터 보존)
      //   zh-CN 본문 "early" 오타 → "年幼离世" 로 수정 반영.
      {
        eyebrow: "CHAPTER 5",
        theme: { ko: "짧았던 생", en: "A SHORT LIFE", ja: "短かった生", "zh-CN": "短暂的一生", "zh-TW": "短暫的一生" },
        title: {
          ko: "정조가 오래 기다려 얻은 아들",
          en: "The Son Jeongjo Waited Long For",
          ja: "正祖が長く待って得た息子",
          "zh-CN": "正祖久候而得的儿子",
          "zh-TW": "正祖久候而得的兒子",
        },
        people: { ko: "문효세자", en: "Crown Prince Munhyo", ja: "文孝世子", "zh-CN": "文孝世子", "zh-TW": "文孝世子" },
        site: { ko: "효창원", en: "Hyochangwon", ja: "孝昌園", "zh-CN": "孝昌园", "zh-TW": "孝昌園" },
        open: null,
        body: {
          ko: "문효세자는 정조와 의빈 성씨 사이에서 태어난 맏아들입니다. 어린 나이에 세상을 떠났고, 그 뒤 어머니 의빈 성씨도 오래 살지 못했습니다. 원래 서울에 있던 무덤이 일제강점기에 서삼릉으로 옮겨졌습니다. 정조와 의빈 성씨의 이야기는 여러 드라마에서 다뤄졌습니다.",
          en: "Crown Prince Munhyo was the eldest son born to King Jeongjo and Lady Uibin Seong. He died young, and his mother did not long outlive him. His tomb, originally in Seoul, was moved to Seosamneung during the colonial period. The story of Jeongjo and Lady Uibin has been told in several dramas.",
          ja: "文孝世子は正祖と宜嬪成氏の間に生まれた長男です。幼くして世を去り、その後母の宜嬪成氏も長くは生きませんでした。もとはソウルにあった墓が日本統治期に西三陵へ移されました。正祖と宜嬪成氏の物語は複数のドラマで扱われています。",
          "zh-CN": "文孝世子是正祖与宜嫔成氏所生的长子。他年幼离世，其后母亲宜嫔成氏亦未久活。原位于首尔的墓在日据时期迁至西三陵。正祖与宜嫔成氏的故事曾在多部电视剧中演绎。",
          "zh-TW": "文孝世子是正祖與宜嬪成氏所生的長子。他年幼離世，其後母親宜嬪成氏亦未久活。原位於首爾的墓在日據時期遷至西三陵。正祖與宜嬪成氏的故事曾在多部電視劇中演繹。",
        },
        onScreen: [
          { titleKo: "이산", titleEn: "Yi San", type: "drama", broadcaster: "MBC", year: "2007" },
          { titleKo: "옷소매 붉은 끝동", titleEn: "The Red Sleeve", type: "drama", broadcaster: "MBC", year: "2021" },
        ],
      },
      // 왕가파일 CH6 — 의령원 (open null → 렌더 X)
      {
        eyebrow: "CHAPTER 6",
        theme: { ko: "이어지지 못한", en: "THE LINE THAT BROKE", ja: "続かなかったもの", "zh-CN": "未能延续", "zh-TW": "未能延續" },
        title: {
          ko: "사도세자의 맏아들",
          en: "Prince Sado's Eldest Son",
          ja: "思悼世子の長男",
          "zh-CN": "思悼世子的长子",
          "zh-TW": "思悼世子的長子",
        },
        people: { ko: "의소세손", en: "Royal Grandson Uiso", ja: "懿昭世孫", "zh-CN": "懿昭世孙", "zh-TW": "懿昭世孫" },
        site: { ko: "의령원", en: "Uiryeongwon", ja: "懿寧園", "zh-CN": "懿宁园", "zh-TW": "懿寧園" },
        open: null,
        body: {
          ko: "의소세손은 사도세자와 혜경궁 홍씨의 맏아들이며 영조의 손자입니다. 어린 나이에 세상을 떠났고, 그 뒤에 태어난 동생이 훗날 정조가 됩니다. 서울에 있던 무덤이 광복 이후 서삼릉으로 옮겨졌습니다.",
          en: "Uiso was the eldest son of Prince Sado and Lady Hyegyeong, and a grandson of King Yeongjo. He died young; the younger brother born after him later became King Jeongjo. His tomb, once in Seoul, was moved to Seosamneung after liberation.",
          ja: "懿昭世孫は思悼世子と恵慶宮洪氏の長男であり、英祖の孫です。幼くして世を去り、その後に生まれた弟が後の正祖となります。ソウルにあった墓が光復後に西三陵へ移されました。",
          "zh-CN": "懿昭世孙是思悼世子与惠庆宫洪氏的长子，英祖之孙。他年幼离世，其后出生的弟弟即日后的正祖。原位于首尔的墓在光复后迁至西三陵。",
          "zh-TW": "懿昭世孫是思悼世子與惠慶宮洪氏的長子，英祖之孫。他年幼離世，其後出生的弟弟即日後的正祖。原位於首爾的墓在光復後遷至西三陵。",
        },
        onScreen: [{ titleKo: "사도", titleEn: "The Throne", type: "film", year: "2015" }],
      },
      // 왕가파일 CH7 — 왕자·공주·후궁 46기 (open null → 렌더 X)
      {
        eyebrow: "CHAPTER 7",
        theme: { ko: "이름 없는 자리", en: "NAMES WITHOUT STORIES", ja: "名の残らぬ場所", "zh-CN": "无名之处", "zh-TW": "無名之處" },
        title: {
          ko: "드라마에 나오지 않은 사람들",
          en: "The Ones the Dramas Left Out",
          ja: "ドラマに出てこなかった人々",
          "zh-CN": "未曾入戏的人们",
          "zh-TW": "未曾入戲的人們",
        },
        people: {
          ko: "왕자 · 공주 · 옹주 · 후궁",
          en: "Princes, princesses and royal consorts",
          ja: "王子 · 公主 · 翁主 · 側室",
          "zh-CN": "王子 · 公主 · 翁主 · 嫔御",
          "zh-TW": "王子 · 公主 · 翁主 · 嬪御",
        },
        site: { ko: "묘 46기", en: "46 graves", ja: "墓46基", "zh-CN": "46座墓", "zh-TW": "46座墓" },
        open: null,
        body: {
          ko: "서삼릉에는 왕릉과 원 외에도 왕자·공주·옹주·후궁의 묘 46기가 있습니다. 대부분 일제강점기에 다른 곳에서 옮겨온 것입니다. 이름이 남았지만 이야기는 남지 않은 사람들이 대부분입니다. 드라마의 주인공이 되지 못한 왕실 구성원이 이렇게 많았다는 사실이 이곳에서 보입니다.",
          en: "Beyond the royal tombs and princely graves, Seosamneung holds 46 graves of princes, princesses and royal consorts. Most were moved here from elsewhere during the colonial period. For most of them a name survives but no story does. What this ground shows is how many members of the royal house never became the subject of a drama.",
          ja: "西三陵には王陵と園のほかに、王子·公主·翁主·側室の墓46基があります。多くは日本統治期に他所から移されたものです。名は残っても物語は残らなかった人がほとんどです。ドラマの主人公になれなかった王室の人々がこれほど多かったという事実が、ここでは見えます。",
          "zh-CN": "西三陵除王陵与园之外，还有王子、公主、翁主与嫔御之墓46座，多为日据时期自他处迁来。他们大多留下了名字，却未留下故事。未能成为剧中主角的王室成员竟有如此之多——在此地可以看见这一事实。",
          "zh-TW": "西三陵除王陵與園之外，還有王子、公主、翁主與嬪御之墓46座，多為日據時期自他處遷來。他們大多留下了名字，卻未留下故事。未能成為劇中主角的王室成員竟有如此之多——在此地可以看見這一事實。",
        },
      },
    ],
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

  // ─── 오더 #C8: 미식 6 (spots-food-01-10.md에서 채택) ─────────────────────
  //   공통: gallery/insider 미설정, adSlot=null, credits=[], access=[],
  //   ko_card.address_ko=null (「확인필요」), practical/map 미설정.

  {
    slug: "lafesta",
    category: "food",
    type: "list",
    region: "일산동구",
    title: { ko: "라페스타", en: "La Festa", ja: "ラフェスタ", "zh-CN": "拉斐斯塔", "zh-TW": "拉斐斯塔" },
    title_en_display: "LA FESTA",
    subtitle: {
      ko: "밤늦게까지 이어지는 거리형 상권",
      en: "An open-air street that stays busy late",
      ja: "夜遅くまで続くストリート型商圏",
      "zh-CN": "热闹至深夜的街区商圈",
      "zh-TW": "熱鬧至深夜的街區商圈",
    },
    lead: {
      ko: "야외 거리를 따라 음식점과 카페가 이어지는 상권입니다. 한식·고깃집부터 카페·주점까지 한 거리에 모여 있어 목적지를 정하지 않고 걸으며 고르기 좋습니다. 저녁 이후에 가장 활기가 있습니다.",
      en: "A pedestrian street lined with restaurants and cafes. Korean barbecue, cafes and bars sit side by side, so you can walk in without deciding first. It is busiest after dark.",
      ja: "屋外の通りに沿って飲食店とカフェが並ぶ商圏です。韓国料理·焼肉からカフェ·居酒屋まで一つの通りに集まっており、行き先を決めずに歩きながら選べます。夕方以降が最も賑わいます。",
      "zh-CN": "沿露天街道分布着餐厅与咖啡馆的商圈。韩餐、烤肉、咖啡与酒馆聚集于同一条街，无需事先决定即可边走边选。傍晚后最为热闹。",
      "zh-TW": "沿露天街道分布著餐廳與咖啡館的商圈。韓餐、烤肉、咖啡與酒館聚集於同一條街，無需事先決定即可邊走邊選。傍晚後最為熱鬧。",
    },
    meta: { updated_at: "2026-09-01" },
    sections: [], access: [],
    know: [
      { ko: "삼겹살 — 돼지 뱃살을 구워 먹는 한국식 구이입니다. 상추에 싸서 먹습니다.", en: "Samgyeopsal — grilled pork belly, usually wrapped in lettuce.", ja: "サムギョプサル — 豚バラ肉を焼いて食べる韓国式の焼肉。サンチュに包んで食べます。", "zh-CN": "五花肉 — 韩式烤猪腩肉，通常用生菜包裹食用。", "zh-TW": "五花肉 — 韓式烤豬腩肉，通常用生菜包裹食用。" },
    ],
    // 오더 #F0 [4]: TourAPI 1144856 주소.
    ko_card: [{ name_ko: "라페스타", address_ko: "경기도 고양시 일산동구 무궁화로 20-11 (장항동)" }],
    map: [{ lat: 37.6618866056, lng: 126.7675570226, label: "라페스타" }],
    credits: [], related: [],
    info: { hours: "varies", duration: "1_2h", admission: "varies", access: "wheelchair" },
    highlights: [
      { ko: "한 거리에 모인 음식점과 카페", en: "Restaurants and cafes on one street", ja: "一つの通りに集まる飲食店とカフェ", "zh-CN": "餐厅与咖啡馆集中于一条街", "zh-TW": "餐廳與咖啡館集中於一條街" },
      { ko: "저녁 이후 가장 활기", en: "Liveliest after dark", ja: "夕方以降が最も賑やか", "zh-CN": "傍晚后最热闹", "zh-TW": "傍晚後最熱鬧" },
      { ko: "정발산역에서 도보권", en: "Walking distance from Jeongbalsan Stn.", ja: "鼎鉢山駅から徒歩圏", "zh-CN": "鼎钵山站步行可达", "zh-TW": "鼎缽山站步行可達" },
    ],
    adSlot: null,
    nearest_station: { name: { ko: "3호선 정발산역", en: "Jeongbalsan Stn. (Line 3)", ja: "3号線 鼎鉢山駅", "zh-CN": "3号线 鼎钵山站", "zh-TW": "3號線 鼎缽山站" }, walk_min: null },
    best_selected: false,
    // 오더 #E1 [3]: Ma City 곡에 이 장소가 언급됨. 가사 인용·이미지 금지.
    onScreen: {
      works: [
        {
          type: "music",
          titleKo: "Ma City",
          titleEn: "Ma City",
          artist: "BTS",
          album: "The Most Beautiful Moment in Life, Part 2",
          year: "2015",
          characters: { ko: "라페스타", en: "Lafesta", ja: "ラフェスタ", "zh-CN": "拉斐斯塔", "zh-TW": "拉斐斯塔" },
          site: {
            ko: "이곳이 곡에 이름 그대로 등장합니다",
            en: "This place appears in the song by name",
            ja: "この場所が曲に名前のまま登場します",
            "zh-CN": "此地在歌曲中以原名出现",
            "zh-TW": "此地在歌曲中以原名出現",
          },
          open: true,
        },
      ],
    },
  },

  {
    slug: "westerndom",
    category: "food",
    type: "list",
    region: "일산동구",
    title: { ko: "웨스턴돔", en: "Western Dom", ja: "ウエスタンドム", "zh-CN": "西部圆顶", "zh-TW": "西部圓頂" },
    title_en_display: "WESTERN DOM",
    subtitle: {
      ko: "라페스타와 마주 보는 또 하나의 거리",
      en: "A second street facing La Festa",
      ja: "ラフェスタと向かい合うもう一つの通り",
      "zh-CN": "与拉斐斯塔相对的另一条街",
      "zh-TW": "與拉斐斯塔相對的另一條街",
    },
    lead: {
      ko: "라페스타 건너편에 자리한 상권입니다. 음식점과 카페, 영화관이 함께 있어 식사 뒤 이어서 시간을 보내기 좋습니다. 두 상권을 걸어서 오갈 수 있습니다.",
      en: "A commercial district across from La Festa. Restaurants, cafes and a cinema share the block, so it is easy to linger after a meal. The two districts are within walking distance of each other.",
      ja: "ラフェスタの向かいにある商圏です。飲食店·カフェ·映画館が一緒にあり、食後に続けて過ごすのに適しています。二つの商圏は歩いて行き来できます。",
      "zh-CN": "位于拉斐斯塔对面的商圈。餐厅、咖啡馆与影院同处一区，饭后可继续消磨时间。两个商圈步行可互通。",
      "zh-TW": "位於拉斐斯塔對面的商圈。餐廳、咖啡館與影院同處一區，飯後可繼續消磨時間。兩個商圈步行可互通。",
    },
    meta: { updated_at: "2026-09-01" },
    sections: [], access: [], know: [],
    // 오더 #F0 [4]: TourAPI 2914203 주소.
    ko_card: [{ name_ko: "웨스턴돔", address_ko: "경기도 고양시 일산동구 정발산로 24 (장항동)" }],
    map: [{ lat: 37.6558964094856, lng: 126.772038816453, label: "웨스턴돔" }],
    credits: [], related: [],
    info: { hours: "varies", duration: "1_2h", admission: "varies", access: "wheelchair" },
    highlights: [
      { ko: "음식점·카페·영화관이 함께", en: "Restaurants, cafes and a cinema together", ja: "飲食店·カフェ·映画館が一体", "zh-CN": "餐厅、咖啡馆与影院并存", "zh-TW": "餐廳、咖啡館與影院並存" },
      { ko: "라페스타와 도보로 연결", en: "Walkable to La Festa", ja: "ラフェスタと徒歩で連結", "zh-CN": "与拉斐斯塔步行相连", "zh-TW": "與拉斐斯塔步行相連" },
      { ko: "식사 후 이어가기 좋음", en: "Easy to continue after a meal", ja: "食後に続けやすい", "zh-CN": "便于饭后延续行程", "zh-TW": "便於飯後延續行程" },
    ],
    adSlot: null,
    nearest_station: { name: { ko: "3호선 정발산역", en: "Jeongbalsan Stn. (Line 3)", ja: "3号線 鼎鉢山駅", "zh-CN": "3号线 鼎钵山站", "zh-TW": "3號線 鼎缽山站" }, walk_min: null },
    best_selected: false,
    // 오더 #E1 [3]: Ma City 곡에 언급.
    onScreen: {
      works: [
        {
          type: "music",
          titleKo: "Ma City",
          titleEn: "Ma City",
          artist: "BTS",
          album: "The Most Beautiful Moment in Life, Part 2",
          year: "2015",
          characters: { ko: "웨스턴돔", en: "Western Dom", ja: "ウエスタンドム", "zh-CN": "西部圆顶", "zh-TW": "西部圓頂" },
          site: {
            ko: "이곳이 곡에 이름 그대로 등장합니다",
            en: "This place appears in the song by name",
            ja: "この場所が曲に名前のまま登場します",
            "zh-CN": "此地在歌曲中以原名出现",
            "zh-TW": "此地在歌曲中以原名出現",
          },
          open: true,
        },
      ],
    },
  },

  {
    slug: "baekseok-food-alley",
    category: "food",
    type: "list",
    region: "일산동구",
    title: { ko: "백석 먹자골목", en: "Baekseok Food Alley", ja: "白石食べ物横丁", "zh-CN": "白石美食巷", "zh-TW": "白石美食巷" },
    title_en_display: "BAEKSEOK FOOD ALLEY",
    subtitle: {
      ko: "퇴근길에 붐비는 골목 상권",
      en: "A back-street strip that fills up after work",
      ja: "退勤時に賑わう横丁商圏",
      "zh-CN": "下班后热闹的巷弄商圈",
      "zh-TW": "下班後熱鬧的巷弄商圈",
    },
    lead: {
      ko: "역 주변으로 이어지는 골목 상권입니다. 관광지보다 생활권에 가까워 현지인 비중이 높고, 가격대도 상대적으로 부담이 적습니다. 저녁 시간대에 가장 붐빕니다.",
      en: "A grid of back streets around the station. It reads more like a neighbourhood than a tourist strip, with mostly local diners and generally lower prices. Evenings are the busiest.",
      ja: "駅周辺に続く横丁商圏です。観光地というより生活圏に近く、地元客の割合が高く、価格帯も比較的抑えめです。夕方の時間帯が最も賑わいます。",
      "zh-CN": "车站周边延伸的巷弄商圈。比起旅游区更接近生活区，本地客居多，价格也相对亲民。傍晚时段最为拥挤。",
      "zh-TW": "車站周邊延伸的巷弄商圈。比起旅遊區更接近生活區，本地客居多，價格也相對親民。傍晚時段最為擁擠。",
    },
    meta: { updated_at: "2026-09-01" },
    sections: [], access: [], know: [],
    ko_card: [{ name_ko: "백석 먹자골목", address_ko: null }],
    credits: [], related: [],
    info: { hours: "varies", duration: "1_2h", admission: "varies", access: "partial" },
    highlights: [
      { ko: "현지인 비중이 높은 상권", en: "Mostly local diners", ja: "地元客の割合が高い商圏", "zh-CN": "本地客为主的商圈", "zh-TW": "本地客為主的商圈" },
      { ko: "상대적으로 부담이 적은 가격대", en: "Generally lower prices", ja: "比較的抑えめの価格帯", "zh-CN": "价格相对亲民", "zh-TW": "價格相對親民" },
      { ko: "백석역에서 도보권", en: "Walking distance from Baekseok Stn.", ja: "白石駅から徒歩圏", "zh-CN": "白石站步行可达", "zh-TW": "白石站步行可達" },
    ],
    adSlot: null,
    nearest_station: { name: { ko: "3호선 백석역", en: "Baekseok Stn. (Line 3)", ja: "3号線 白石駅", "zh-CN": "3号线 白石站", "zh-TW": "3號線 白石站" }, walk_min: null },
    best_selected: false,
  },

  {
    slug: "hwajeong-rodeo",
    category: "food",
    type: "list",
    region: "덕양구",
    title: { ko: "화정 로데오거리", en: "Hwajeong Rodeo Street", ja: "花井ロデオ通り", "zh-CN": "花井罗迪欧街", "zh-TW": "花井羅迪歐街" },
    title_en_display: "HWAJEONG RODEO STREET",
    subtitle: {
      ko: "덕양구의 대표 상권",
      en: "The main commercial strip in Deokyang",
      ja: "徳陽区を代表する商圏",
      "zh-CN": "德阳区的代表商圈",
      "zh-TW": "德陽區的代表商圈",
    },
    lead: {
      ko: "화정역 주변으로 형성된 상권입니다. 일산 쪽 상권과 분위기가 달라, 덕양구에 머무를 때 들르기 좋습니다. 음식점과 카페, 상점이 섞여 있습니다.",
      en: "The commercial area around Hwajeong Station. It has a different feel from the Ilsan districts, and is the natural stop if you are staying on the Deokyang side. Restaurants, cafes and shops are mixed together.",
      ja: "花井駅周辺に形成された商圏です。一山側の商圏とは雰囲気が異なり、徳陽区に滞在する際に立ち寄りやすい場所です。飲食店·カフェ·商店が混在しています。",
      "zh-CN": "花井站周边形成的商圈。氛围与一山商圈不同，若停留在德阳区一带可顺道前往。餐厅、咖啡馆与商店混杂其间。",
      "zh-TW": "花井站周邊形成的商圈。氛圍與一山商圈不同，若停留在德陽區一帶可順道前往。餐廳、咖啡館與商店混雜其間。",
    },
    meta: { updated_at: "2026-09-01" },
    sections: [], access: [], know: [],
    ko_card: [{ name_ko: "화정 로데오거리", address_ko: null }],
    credits: [], related: [],
    info: { hours: "varies", duration: "1_2h", admission: "varies", access: "wheelchair" },
    highlights: [
      { ko: "덕양구에 머무를 때", en: "Handy if you are staying in Deokyang", ja: "徳陽区に滞在する際に", "zh-CN": "停留德阳区时的选择", "zh-TW": "停留德陽區時的選擇" },
      { ko: "일산과 다른 분위기", en: "A different feel from Ilsan", ja: "一山とは異なる雰囲気", "zh-CN": "与一山氛围不同", "zh-TW": "與一山氛圍不同" },
      { ko: "음식점·카페·상점이 함께", en: "Restaurants, cafes and shops together", ja: "飲食店·カフェ·商店が一体", "zh-CN": "餐厅、咖啡馆与商店并存", "zh-TW": "餐廳、咖啡館與商店並存" },
    ],
    adSlot: null,
    nearest_station: { name: { ko: "3호선 화정역", en: "Hwajeong Stn. (Line 3)", ja: "3号線 花井駅", "zh-CN": "3号线 花井站", "zh-TW": "3號線 花井站" }, walk_min: null },
    best_selected: false,
  },

  {
    slug: "ilsan-traditional-market",
    category: "food",
    type: "list",
    region: "일산서구",
    title: { ko: "일산 전통시장", en: "Ilsan Traditional Market", ja: "一山伝統市場", "zh-CN": "一山传统市场", "zh-TW": "一山傳統市場" },
    title_en_display: "ILSAN TRADITIONAL MARKET",
    subtitle: {
      ko: "시장 안에서 먹는 한 끼",
      en: "A meal inside the market",
      ja: "市場の中で食べる一食",
      "zh-CN": "在市场里吃的一餐",
      "zh-TW": "在市場裡吃的一餐",
    },
    lead: {
      ko: "신도시 상권과 성격이 다른 재래시장입니다. 분식과 국밥 같은 간단한 식사를 시장 안에서 해결할 수 있고, 가격대가 낮습니다. 현지 생활 모습을 보기에도 좋습니다.",
      en: "A traditional market with a different character from the new-town districts. Simple meals such as snacks and rice soup are available inside, at low prices. It is also a good place to see everyday local life.",
      ja: "新都市の商圏とは性格の異なる在来市場です。粉食や クッパのような簡単な食事を市場の中で済ませられ、価格帯も低めです。地元の暮らしを見るのにも向いています。",
      "zh-CN": "与新城商圈性格不同的传统市场。可在市场内解决小吃、汤饭等简餐，价格较低。也是观察当地日常生活的好去处。",
      "zh-TW": "與新城商圈性格不同的傳統市場。可在市場內解決小吃、湯飯等簡餐，價格較低。也是觀察當地日常生活的好去處。",
    },
    meta: { updated_at: "2026-09-01" },
    sections: [], access: [],
    know: [
      { ko: "국밥 — 밥을 국에 말아 먹는 한국식 한 그릇 음식입니다.", en: "Gukbap — a one-bowl dish of rice served in hot soup.", ja: "クッパ — ご飯をスープに入れて食べる韓国式の一皿料理です。", "zh-CN": "汤饭 — 将米饭泡入热汤食用的韩式单碗料理。", "zh-TW": "湯飯 — 將米飯泡入熱湯食用的韓式單碗料理。" },
      { ko: "분식 — 떡볶이·순대·튀김 등 간단한 길거리 음식입니다.", en: "Bunsik — inexpensive street snacks such as tteokbokki, sundae and fritters.", ja: "粉食 — トッポッキ·スンデ·天ぷらなど手軽な屋台料理です。", "zh-CN": "粉食 — 炒年糕、血肠、炸物等简便街头小吃。", "zh-TW": "粉食 — 炒年糕、血腸、炸物等簡便街頭小吃。" },
    ],
    ko_card: [{ name_ko: "일산 전통시장", address_ko: null }],
    credits: [], related: [],
    info: { hours: "varies", duration: "1h", admission: "varies", access: "partial" },
    highlights: [
      { ko: "시장 안에서 해결하는 간단한 식사", en: "Simple meals inside the market", ja: "市場の中で済ませる簡単な食事", "zh-CN": "市场内的简餐", "zh-TW": "市場內的簡餐" },
      { ko: "낮은 가격대", en: "Low prices", ja: "低めの価格帯", "zh-CN": "价格较低", "zh-TW": "價格較低" },
      { ko: "현지 생활 모습", en: "Everyday local life", ja: "地元の暮らしの様子", "zh-CN": "当地日常生活", "zh-TW": "當地日常生活" },
    ],
    adSlot: null,
    nearest_station: { name: { ko: "경의중앙선 일산역", en: "Ilsan Stn. (Gyeongui-Jungang)", ja: "京義中央線 一山駅", "zh-CN": "京义中央线 一山站", "zh-TW": "京義中央線 一山站" }, walk_min: null },
    best_selected: false,
  },

  {
    slug: "daehwa-cafes",
    category: "food",
    type: "list",
    region: "일산서구",
    title: { ko: "대화동 카페 밀집구역", en: "Daehwa Cafe Cluster", ja: "大化洞カフェ密集エリア", "zh-CN": "大化洞咖啡聚集区", "zh-TW": "大化洞咖啡聚集區" },
    title_en_display: "DAEHWA CAFE CLUSTER",
    subtitle: {
      ko: "호수공원 산책 뒤에 들르는 곳",
      en: "Where to stop after a lake park walk",
      ja: "湖水公園の散策後に立ち寄る場所",
      "zh-CN": "湖水公园散步后的落脚处",
      "zh-TW": "湖水公園散步後的落腳處",
    },
    lead: {
      ko: "대화역과 호수공원 사이에 카페가 모여 있는 구역입니다. 산책을 마치고 앉아 쉬기 좋고, 킨텍스 일정 전후에도 이용하기 편합니다.",
      en: "A cluster of cafes between Daehwa Station and the lake park. It is a natural place to sit after a walk, and convenient around KINTEX schedules too.",
      ja: "大化駅と湖水公園の間にカフェが集まるエリアです。散策を終えて座って休むのに適しており、キンテックスの予定の前後にも利用しやすい場所です。",
      "zh-CN": "大化站与湖水公园之间的咖啡馆聚集区。散步后适合坐下休息，展会日程前后亦便于利用。",
      "zh-TW": "大化站與湖水公園之間的咖啡館聚集區。散步後適合坐下休息，展會日程前後亦便於利用。",
    },
    meta: { updated_at: "2026-09-01" },
    sections: [], access: [], know: [],
    ko_card: [{ name_ko: "대화동", address_ko: null }],
    credits: [], related: [],
    info: { hours: "varies", duration: "1h", admission: "varies", access: "partial" },
    highlights: [
      { ko: "호수공원 산책 뒤에", en: "After a walk in the lake park", ja: "湖水公園の散策後に", "zh-CN": "湖水公园散步之后", "zh-TW": "湖水公園散步之後" },
      { ko: "킨텍스 일정 전후", en: "Around KINTEX schedules", ja: "キンテックスの予定の前後", "zh-CN": "展会日程前后", "zh-TW": "展會日程前後" },
      { ko: "대화역에서 도보권", en: "Walking distance from Daehwa Stn.", ja: "大化駅から徒歩圏", "zh-CN": "大化站步行可达", "zh-TW": "大化站步行可達" },
    ],
    adSlot: null,
    nearest_station: { name: { ko: "3호선 대화역", en: "Daehwa Stn. (Line 3)", ja: "3号線 大化駅", "zh-CN": "3号线 大化站", "zh-TW": "3號線 大化站" }, walk_min: null },
    best_selected: false,
  },

  // ─── 오더 #C8: 문화 6 (spots-culture-kculture.md에서 채택) ─────────────
  {
    slug: "aramnuri",
    category: "culture",
    type: "list",
    region: "일산동구",
    title: { ko: "고양아람누리", en: "Goyang Aram Nuri", ja: "高陽アラムヌリ", "zh-CN": "高阳阿蓝世界", "zh-TW": "高陽阿藍世界" },
    title_en_display: "GOYANG ARAM NURI",
    subtitle: { ko: "고양의 대표 공연장", en: "Goyang's main performing arts centre", ja: "高陽を代表する公演場", "zh-CN": "高阳代表性演出场馆", "zh-TW": "高陽代表性演出場館" },
    lead: {
      ko: "곡선 지붕이 인상적인 복합 공연장입니다. 아람극장·아람음악당·아람미술관 등 여러 공간이 한 건물에 모여 있어 공연과 전시를 함께 볼 수 있습니다.",
      en: "A performing arts complex marked by its curved roofline. Theatre, concert hall and gallery share one building, so a visit can combine a show with an exhibition.",
      ja: "曲線の屋根が印象的な複合公演場です。アラム劇場·音楽堂·美術館などが一つの建物に集まり、公演と展示を一緒に楽しめます。",
      "zh-CN": "以曲线屋顶著称的综合演出场馆。剧场、音乐厅与美术馆同处一栋建筑，可同时观演与看展。",
      "zh-TW": "以曲線屋頂著稱的綜合演出場館。劇場、音樂廳與美術館同處一棟建築，可同時觀演與看展。",
    },
    meta: { updated_at: "2026-09-01" },
    sections: [], access: [], know: [],
    // 오더 #F0 [4]: TourAPI 2892126 (아람누리) 주소.
    ko_card: [{ name_ko: "고양아람누리", address_ko: "경기도 고양시 일산동구 중앙로 1286 고양아람누리" }],
    map: [{ lat: 37.660973360108, lng: 126.772797186522, label: "고양아람누리" }],
    credits: [], related: [],
    info: { hours: "varies", duration: "1_2h", admission: "varies", access: "wheelchair" },
    highlights: [
      { ko: "극장·음악당·미술관이 한 건물에", en: "Theatre, concert hall and gallery in one", ja: "劇場·音楽堂·美術館が一つの建物に", "zh-CN": "剧场、音乐厅与美术馆合一", "zh-TW": "劇場、音樂廳與美術館合一" },
      { ko: "곡선 지붕 건축", en: "Distinctive curved architecture", ja: "曲線屋根の建築", "zh-CN": "曲线屋顶建筑", "zh-TW": "曲線屋頂建築" },
      { ko: "정발산역에서 도보권", en: "Walking distance from Jeongbalsan Stn.", ja: "鼎鉢山駅から徒歩圏", "zh-CN": "鼎钵山站步行可达", "zh-TW": "鼎缽山站步行可達" },
    ],
    adSlot: null,
    nearest_station: { name: { ko: "3호선 정발산역", en: "Jeongbalsan Stn. (Line 3)", ja: "3号線 鼎鉢山駅", "zh-CN": "3号线 鼎钵山站", "zh-TW": "3號線 鼎缽山站" }, walk_min: null },
    official_url: "https://www.artgy.or.kr/",
    best_selected: false,
  },

  {
    slug: "eoullimnuri",
    category: "culture",
    type: "list",
    region: "덕양구",
    title: { ko: "고양어울림누리", en: "Goyang Eoullim Nuri", ja: "高陽オウルリムヌリ", "zh-CN": "高阳和谐世界", "zh-TW": "高陽和諧世界" },
    title_en_display: "GOYANG EOULLIM NURI",
    subtitle: { ko: "덕양구의 공연·전시 거점", en: "The arts hub of Deokyang", ja: "徳陽区の公演·展示拠点", "zh-CN": "德阳区演出与展览据点", "zh-TW": "德陽區演出與展覽據點" },
    lead: {
      ko: "덕양구에 있는 복합 문화시설입니다. 어울림극장과 별모래극장, 전시관, 체육시설이 함께 있어 공연 외에도 이용할 거리가 많습니다.",
      en: "A cultural complex on the Deokyang side. Alongside its theatres and gallery it houses sports facilities, so there is more here than performances alone.",
      ja: "徳陽区にある複合文化施設です。オウルリム劇場·ピョルモレ劇場·展示館·体育施設が併設され、公演以外の楽しみもあります。",
      "zh-CN": "位于德阳区的综合文化设施。设有和谐剧场、星沙剧场、展览馆与体育设施，除演出外亦有多种用途。",
      "zh-TW": "位於德陽區的綜合文化設施。設有和諧劇場、星沙劇場、展覽館與體育設施，除演出外亦有多種用途。",
    },
    meta: { updated_at: "2026-09-01" },
    sections: [], access: [], know: [],
    ko_card: [{ name_ko: "고양어울림누리", address_ko: null }],
    credits: [], related: [],
    info: { hours: "varies", duration: "1_2h", admission: "varies", access: "wheelchair" },
    highlights: [
      { ko: "극장 두 곳과 전시관", en: "Two theatres and a gallery", ja: "二つの劇場と展示館", "zh-CN": "两座剧场与展览馆", "zh-TW": "兩座劇場與展覽館" },
      { ko: "체육시설 병설", en: "Sports facilities on site", ja: "体育施設を併設", "zh-CN": "附设体育设施", "zh-TW": "附設體育設施" },
      { ko: "덕양구 문화 거점", en: "The cultural hub of Deokyang", ja: "徳陽区の文化拠点", "zh-CN": "德阳区文化据点", "zh-TW": "德陽區文化據點" },
    ],
    adSlot: null,
    best_selected: false,
  },

  {
    slug: "hyundai-motorstudio",
    category: "culture",
    type: "list",
    region: "일산서구",
    title: { ko: "현대 모터스튜디오 고양", en: "Hyundai Motorstudio Goyang", ja: "現代モータースタジオ高陽", "zh-CN": "现代汽车文化馆高阳", "zh-TW": "現代汽車文化館高陽" },
    title_en_display: "HYUNDAI MOTORSTUDIO GOYANG",
    subtitle: { ko: "자동차를 주제로 한 대형 전시공간", en: "A large exhibition space built around cars", ja: "自動車をテーマにした大型展示空間", "zh-CN": "以汽车为主题的大型展览空间", "zh-TW": "以汽車為主題的大型展覽空間" },
    lead: {
      ko: "킨텍스 옆에 자리한 자동차 복합문화공간입니다. 차량 전시와 체험 프로그램이 함께 운영되며, 건물 자체도 볼거리입니다.",
      en: "An automotive cultural complex next to KINTEX. It combines vehicle displays with hands-on programmes, and the building itself is worth a look.",
      ja: "キンテックスの隣にある自動車複合文化空間です。車両展示と体験プログラムが運営され、建物自体も見どころです。",
      "zh-CN": "位于韩国国际展览中心旁的汽车综合文化空间。展出车辆并设有体验项目，建筑本身亦值得一看。",
      "zh-TW": "位於韓國國際展覽中心旁的汽車綜合文化空間。展出車輛並設有體驗項目，建築本身亦值得一看。",
    },
    meta: { updated_at: "2026-09-01" },
    sections: [], access: [], know: [],
    // 오더 #F0 [4]: TourAPI 2660801 detailCommon2 로 주소 보강.
    ko_card: [{ name_ko: "현대 모터스튜디오 고양", address_ko: "경기도 고양시 일산서구 킨텍스로 217-6" }],
    // 오더 #F0 [4]: TourAPI 좌표.
    map: [{ lat: 37.6662056038, lng: 126.7476828283, label: "현대 모터스튜디오 고양" }],
    credits: [], related: [],
    info: { hours: "varies", duration: "1_2h", admission: "free", access: "wheelchair" },
    highlights: [
      { ko: "차량 전시와 체험 프로그램", en: "Displays and hands-on programmes", ja: "車両展示と体験プログラム", "zh-CN": "车辆展示与体验项目", "zh-TW": "車輛展示與體驗項目" },
      { ko: "건축물 자체가 볼거리", en: "The building is a sight in itself", ja: "建物自体が見どころ", "zh-CN": "建筑本身即为看点", "zh-TW": "建築本身即為看點" },
      { ko: "킨텍스 바로 옆", en: "Right beside KINTEX", ja: "キンテックスのすぐ隣", "zh-CN": "紧邻韩国国际展览中心", "zh-TW": "緊鄰韓國國際展覽中心" },
    ],
    adSlot: null,
    // 오더 #F0 [3]: TourAPI Type1 3장 (contentid 2660801).
    gallery: [
      { url: "/images/spots/hyundai-motorstudio-1.jpg", credit: "출처: 한국관광공사 (공공누리 제1유형)", cpyrht: "Type1" },
      { url: "/images/spots/hyundai-motorstudio-2.jpg", credit: "출처: 한국관광공사 (공공누리 제1유형)", cpyrht: "Type1" },
      { url: "/images/spots/hyundai-motorstudio-3.jpg", credit: "출처: 한국관광공사 (공공누리 제1유형)", cpyrht: "Type1" },
    ],
    nearest_station: { name: { ko: "GTX 킨텍스역", en: "GTX Kintex Stn.", ja: "GTX キンテックス駅", "zh-CN": "GTX 韩国国际展览中心站", "zh-TW": "GTX 韓國國際展覽中心站" }, walk_min: null },
    // 오더 #F0 [4]: TourAPI homepage.
    official_url: "https://motorstudio.hyundai.com/",
    best_selected: false,
    tourapi: { contentid: "2660801", overview_ko: "" },
  },

  {
    slug: "latin-america-museum",
    category: "culture",
    type: "list",
    region: "덕양구",
    title: { ko: "중남미문화원", en: "Museum of Latin American Art", ja: "中南米文化院", "zh-CN": "中南美文化院", "zh-TW": "中南美文化院" },
    title_en_display: "MUSEUM OF LATIN AMERICAN ART",
    subtitle: { ko: "라틴아메리카를 옮겨온 정원", en: "A garden that brings Latin America to Goyang", ja: "ラテンアメリカを移した庭園", "zh-CN": "移植拉丁美洲的庭园", "zh-TW": "移植拉丁美洲的庭園" },
    lead: {
      ko: "중남미 지역의 미술과 유물을 모은 사립 박물관입니다. 박물관과 미술관, 조각공원, 종교전시관이 함께 있고 건물과 정원이 이국적입니다.",
      en: "A private museum of Latin American art and artefacts. It comprises a museum, gallery, sculpture garden and religious hall, with buildings and grounds that feel far from Korea.",
      ja: "中南米地域の美術と遺物を集めた私立博物館です。博物館·美術館·彫刻公園·宗教展示館があり、建物と庭園が異国的です。",
      "zh-CN": "收藏中南美地区美术与文物的私立博物馆。设有博物馆、美术馆、雕塑公园与宗教展览馆，建筑与庭园充满异国情调。",
      "zh-TW": "收藏中南美地區美術與文物的私立博物館。設有博物館、美術館、雕塑公園與宗教展覽館，建築與庭園充滿異國情調。",
    },
    meta: { updated_at: "2026-09-01" },
    sections: [], access: [], know: [],
    // 오더 #F0 [4]: TourAPI 129897.
    ko_card: [{ name_ko: "중남미문화원", address_ko: "경기도 고양시 덕양구 대양로285번길 33-15 (고양동)" }],
    map: [{ lat: 37.7035987299, lng: 126.8952679691, label: "중남미문화원" }],
    credits: [], related: [],
    info: { hours: "varies", duration: "1_2h", admission: "paid", access: "partial" },
    highlights: [
      { ko: "중남미 미술과 유물", en: "Latin American art and artefacts", ja: "中南米の美術と遺物", "zh-CN": "中南美美术与文物", "zh-TW": "中南美美術與文物" },
      { ko: "조각공원과 정원", en: "Sculpture garden and grounds", ja: "彫刻公園と庭園", "zh-CN": "雕塑公园与庭园", "zh-TW": "雕塑公園與庭園" },
      { ko: "이국적인 건축", en: "Distinctly foreign architecture", ja: "異国的な建築", "zh-CN": "异国情调建筑", "zh-TW": "異國情調建築" },
    ],
    adSlot: null,
    // 오더 #F0 [3]: TourAPI Type1 3장.
    gallery: [
      { url: "/images/spots/latin-america-museum-1.jpg", credit: "출처: 한국관광공사 (공공누리 제1유형)", cpyrht: "Type1" },
      { url: "/images/spots/latin-america-museum-2.jpg", credit: "출처: 한국관광공사 (공공누리 제1유형)", cpyrht: "Type1" },
      { url: "/images/spots/latin-america-museum-3.jpg", credit: "출처: 한국관광공사 (공공누리 제1유형)", cpyrht: "Type1" },
    ],
    nearest_station: { name: { ko: "버스", en: "Bus", ja: "バス", "zh-CN": "公交", "zh-TW": "公車" }, walk_min: null },
    // 오더 #F0 [4]: 공식 사이트 (TourAPI 응답 첫 URL).
    official_url: "http://www.latina.or.kr",
    best_selected: false,
    tourapi: { contentid: "129897", overview_ko: "" },
  },

  {
    slug: "aram-art-museum",
    category: "culture",
    type: "list",
    region: "일산동구",
    title: { ko: "아람미술관", en: "Aram Art Museum", ja: "アラム美術館", "zh-CN": "阿蓝美术馆", "zh-TW": "阿藍美術館" },
    title_en_display: "ARAM ART MUSEUM",
    subtitle: { ko: "공연장 안의 전시 공간", en: "A gallery inside the arts centre", ja: "公演場の中の展示空間", "zh-CN": "演出场馆内的展览空间", "zh-TW": "演出場館內的展覽空間" },
    lead: {
      ko: "아람누리 안에 있는 미술관입니다. 공연을 보러 왔다가 함께 둘러보기 좋습니다.",
      en: "The gallery within Aram Nuri — an easy addition to a visit for a performance.",
      ja: "アラムヌリ内の美術館です。公演のついでに立ち寄るのに適しています。",
      "zh-CN": "位于阿蓝世界内的美术馆，观演之余可顺道参观。",
      "zh-TW": "位於阿藍世界內的美術館，觀演之餘可順道參觀。",
    },
    meta: { updated_at: "2026-09-01" },
    sections: [], access: [], know: [],
    // 오더 #F0 [4]: TourAPI 2892126 (아람누리 = 아람미술관 상위) 주소.
    ko_card: [{ name_ko: "아람미술관", address_ko: "경기도 고양시 일산동구 중앙로 1286 고양아람누리" }],
    map: [{ lat: 37.660973360108, lng: 126.772797186522, label: "아람미술관" }],
    credits: [], related: [],
    info: { hours: "varies", duration: "1h", admission: "varies", access: "wheelchair" },
    highlights: [
      { ko: "공연 관람과 함께", en: "Combine with a performance", ja: "公演鑑賞と合わせて", "zh-CN": "与观演结合", "zh-TW": "與觀演結合" },
      { ko: "아람누리 내부", en: "Inside Aram Nuri", ja: "アラムヌリ内部", "zh-CN": "阿蓝世界内部", "zh-TW": "阿藍世界內部" },
      { ko: "기획전 중심", en: "Focused on curated shows", ja: "企画展中心", "zh-CN": "以策划展为主", "zh-TW": "以策劃展為主" },
    ],
    adSlot: null,
    nearest_station: { name: { ko: "3호선 정발산역", en: "Jeongbalsan Stn. (Line 3)", ja: "3号線 鼎鉢山駅", "zh-CN": "3号线 鼎钵山站", "zh-TW": "3號線 鼎缽山站" }, walk_min: null },
    best_selected: false,
  },

  {
    slug: "kintex",
    category: "culture",
    type: "list",
    region: "일산서구",
    title: { ko: "킨텍스", en: "KINTEX", ja: "キンテックス", "zh-CN": "韩国国际展览中心", "zh-TW": "韓國國際展覽中心" },
    title_en_display: "KINTEX",
    subtitle: { ko: "국내 최대 규모의 전시장", en: "Korea's largest exhibition centre", ja: "国内最大規模の展示場", "zh-CN": "韩国最大规模展览中心", "zh-TW": "韓國最大規模展覽中心" },
    // 오더 #E1 [3]: lead 교체 — 전시장이 아닌 「구역」 소개로 전환.
    lead: {
      ko: "연중 전시회와 박람회가 열리는 대형 전시장입니다. 제1·2전시장을 합쳐 10개 전시홀 규모이며, 국제회의와 대형 공연도 이곳에서 열립니다. 행사가 없는 날에는 건물 안에서 볼 것이 많지 않지만, 걸어서 닿는 거리에 자동차 전시관·수족관·백화점·호수공원이 모여 있어 전시 일정 앞뒤로 하루를 채울 수 있습니다.",
      en: "A large exhibition centre hosting trade fairs and expos year-round, with ten halls across Halls 1 and 2, plus international conferences and large concerts. On days without an event there is not much to see inside the building itself — but an automotive gallery, an aquarium, a department store and a lake park all sit within walking distance, enough to fill the hours around a show.",
      ja: "年間を通じて展示会や博覧会が開かれる大型展示場です。第1·第2展示場を合わせて10のホール規模で、国際会議や大型公演もここで行われます。行事のない日は建物内に見どころが多くありませんが、徒歩圏に自動車展示館·水族館·百貨店·湖水公園が集まっており、展示日程の前後に一日を埋められます。",
      "zh-CN": "全年举办展会与博览会的大型展馆，第一、第二展馆共设十个展厅，国际会议与大型演出亦在此举行。无活动的日子馆内可看之处不多，但步行可达之处汇聚了汽车展馆、水族馆、百货商场与湖水公园，足以填满展会前后的时间。",
      "zh-TW": "全年舉辦展會與博覽會的大型展館，第一、第二展館共設十個展廳，國際會議與大型演出亦在此舉行。無活動的日子館內可看之處不多，但步行可達之處匯聚了汽車展館、水族館、百貨商場與湖水公園，足以填滿展會前後的時間。",
    },
    meta: { updated_at: "2026-09-01" },
    sections: [], access: [], know: [],
    ko_card: [{ name_ko: "킨텍스", address_ko: null }],
    credits: [], related: [],
    info: { hours: "varies", duration: "half_day", admission: "varies", access: "wheelchair" },
    // 오더 #E1 [3]: highlights 교체 (10홀 + 걷는 거리 + GTX).
    highlights: [
      { ko: "제1·2전시장 10개 홀", en: "Ten halls across Halls 1 and 2", ja: "第1·第2展示場10ホール", "zh-CN": "第一、第二展馆共十个展厅", "zh-TW": "第一、第二展館共十個展廳" },
      { ko: "걸어서 닿는 거리에 전시관·수족관·백화점", en: "A gallery, aquarium and department store within walking distance", ja: "徒歩圏に展示館·水族館·百貨店", "zh-CN": "步行可达展馆、水族馆与百货商场", "zh-TW": "步行可達展館、水族館與百貨商場" },
      { ko: "GTX 킨텍스역", en: "GTX Kintex Station", ja: "GTXキンテックス駅", "zh-CN": "GTX韩国国际展览中心站", "zh-TW": "GTX韓國國際展覽中心站" },
    ],
    adSlot: null,
    nearest_station: { name: { ko: "GTX 킨텍스역", en: "GTX Kintex Stn.", ja: "GTX キンテックス駅", "zh-CN": "GTX 韩国国际展览中心站", "zh-TW": "GTX 韓國國際展覽中心站" }, walk_min: null },
    best_selected: false,
    // 오더 #E1 [3]: notice — 제3전시장 공사. until 확인필요 → 미설정.
    notice: {
      body: {
        ko: "제3전시장 신축 공사가 진행 중입니다. 제1전시장 주차장 일부가 영향을 받을 수 있으니 방문 전 확인하세요.",
        en: "Construction of Hall 3 is under way. Part of the Hall 1 car park may be affected — check before you go.",
        ja: "第3展示場の新築工事が進行中です。第1展示場の駐車場の一部が影響を受ける場合がありますので、訪問前にご確認ください。",
        "zh-CN": "第三展馆新建工程正在进行，第一展馆部分停车场可能受影响，前往前请先确认。",
        "zh-TW": "第三展館新建工程正在進行，第一展館部分停車場可能受影響，前往前請先確認。",
      },
    },
    // 오더 #E1 [3]: nearby 6건 (전시관·수족관·원마운트·백화점·호수공원·한류월드).
    //   distance 는 전부 「확인필요」 → 미설정.
    nearby: {
      eyebrow: "AROUND KINTEX",
      title: {
        ko: "전시장에서 걸어서",
        en: "Within Walking Distance",
        ja: "展示場から歩いて",
        "zh-CN": "从展馆步行可达",
        "zh-TW": "從展館步行可達",
      },
      lead: {
        ko: "행사가 끝난 뒤 무엇을 할지 정해두면 하루가 달라집니다.",
        en: "Decide in advance what comes after the show, and the day changes.",
        ja: "行事の後に何をするか決めておくと、一日が変わります。",
        "zh-CN": "若事先想好活动结束后做什么，一天将截然不同。",
        "zh-TW": "若事先想好活動結束後做什麼，一天將截然不同。",
      },
      items: [
        {
          name: { ko: "현대 모터스튜디오 고양", en: "Hyundai Motorstudio Goyang", ja: "現代モータースタジオ高陽", "zh-CN": "现代汽车文化馆高阳", "zh-TW": "現代汽車文化館高陽" },
          slug: "hyundai-motorstudio",
          tag: {
            ko: "자동차가 만들어지는 과정을 보는 상설 전시. 영어·중국어 안내 있음",
            en: "A permanent exhibition on how cars are built. English and Chinese guidance available",
            ja: "自動車がつくられる工程を見る常設展示。英語·中国語案内あり",
            "zh-CN": "展示汽车制造过程的常设展览，提供英语与中文导览",
            "zh-TW": "展示汽車製造過程的常設展覽，提供英語與中文導覽",
          },
        },
        {
          // slug 미확인이라 무링크 카드
          name: { ko: "아쿠아플라넷 일산", en: "Aqua Planet Ilsan", ja: "アクアプラネット一山", "zh-CN": "一山水族馆", "zh-TW": "一山水族館" },
          tag: {
            ko: "수족관과 생태 프로그램. 아이를 동반한 방문에 적합",
            en: "An aquarium with live programmes. Suited to visits with children",
            ja: "水族館と生態プログラム。子ども連れの訪問に適する",
            "zh-CN": "水族馆与生态项目，适合亲子造访",
            "zh-TW": "水族館與生態項目，適合親子造訪",
          },
        },
        {
          name: { ko: "원마운트", en: "One Mount", ja: "ワンマウント", "zh-CN": "One Mount", "zh-TW": "One Mount" },
          slug: "onemount",
          tag: {
            ko: "실내 스노우파크와 워터파크. 한여름에도 눈을 볼 수 있음",
            en: "An indoor snow park and water park — snow even in midsummer",
            ja: "屋内スノーパークとウォーターパーク。真夏でも雪が見られる",
            "zh-CN": "室内雪世界与水上乐园，盛夏亦可赏雪",
            "zh-TW": "室內雪世界與水上樂園，盛夏亦可賞雪",
          },
        },
        {
          name: { ko: "현대백화점 킨텍스점", en: "Hyundai Department Store Kintex", ja: "現代百貨店キンテックス店", "zh-CN": "现代百货韩国国际展览中心店", "zh-TW": "現代百貨韓國國際展覽中心店" },
          tag: {
            ko: "식사·쇼핑·화장품. 전시 사이에 들르기 좋은 위치",
            en: "Meals, shopping and cosmetics — easy to fit between sessions",
            ja: "食事·買い物·化粧品。展示の合間に立ち寄りやすい立地",
            "zh-CN": "用餐、购物与化妆品，便于在展会间隙前往",
            "zh-TW": "用餐、購物與化妝品，便於在展會間隙前往",
          },
        },
        {
          name: { ko: "일산호수공원", en: "Ilsan Lake Park", ja: "一山湖水公園", "zh-CN": "一山湖水公园", "zh-TW": "一山湖水公園" },
          slug: "ilsan-lake-park",
          tag: {
            ko: "9.1km 산책로. 해질 무렵이 가장 좋음",
            en: "A 9.1 km path. Best around sunset",
            ja: "9.1kmの遊歩道。夕暮れ時が最も良い",
            "zh-CN": "9.1公里步道，傍晚时分最佳",
            "zh-TW": "9.1公里步道，傍晚時分最佳",
          },
        },
        {
          name: { ko: "한류월드", en: "Hallyu World", ja: "韓流ワールド", "zh-CN": "韩流世界", "zh-TW": "韓流世界" },
          slug: "hallyu-world",
          tag: {
            ko: "EBS 본사와 방송 제작시설이 모인 구역",
            en: "The district where EBS headquarters and broadcast facilities stand",
            ja: "EBS本社と放送制作施設が集まる区域",
            "zh-CN": "EBS总部与广播制作设施汇聚的区域",
            "zh-TW": "EBS總部與廣播製作設施匯聚的區域",
          },
        },
      ],
    },
    // 오더 #E1 [3]: 방문 코스 2건. onScreen.courses 를 재활용 (works 빈 배열).
    onScreen: {
      works: [],
      courses: [
        {
          name: {
            ko: "오전은 비즈니스, 오후는 고양",
            en: "Business in the Morning, Goyang in the Afternoon",
            ja: "午前はビジネス、午後は高陽",
            "zh-CN": "上午办公事，下午看高阳",
            "zh-TW": "上午辦公事，下午看高陽",
          },
          stops: [
            { ko: "킨텍스 전시 관람", en: "KINTEX exhibition", ja: "キンテックス展示", "zh-CN": "参观展会", "zh-TW": "參觀展會" },
            { ko: "현대 모터스튜디오", en: "Hyundai Motorstudio", ja: "現代モータースタジオ", "zh-CN": "现代汽车文化馆", "zh-TW": "現代汽車文化館" },
            { ko: "현대백화점에서 식사", en: "lunch at the department store", ja: "百貨店で食事", "zh-CN": "百货商场用餐", "zh-TW": "百貨商場用餐" },
            { ko: "일산호수공원", en: "Ilsan Lake Park", ja: "一山湖水公園", "zh-CN": "一山湖水公园", "zh-TW": "一山湖水公園" },
            { ko: "한울광장 일몰", en: "sunset at Hanul Square", ja: "ハヌル広場の日没", "zh-CN": "한울广场日落", "zh-TW": "한울廣場日落" },
          ],
        },
        {
          name: {
            ko: "아이와 함께라면",
            en: "If You Are With Children",
            ja: "子ども連れなら",
            "zh-CN": "若与孩子同行",
            "zh-TW": "若與孩子同行",
          },
          stops: [
            { ko: "아쿠아플라넷 일산", en: "Aqua Planet Ilsan", ja: "アクアプラネット一山", "zh-CN": "一山水族馆", "zh-TW": "一山水族館" },
            { ko: "원마운트", en: "One Mount", ja: "ワンマウント", "zh-CN": "One Mount", "zh-TW": "One Mount" },
            { ko: "현대백화점", en: "department store", ja: "百貨店", "zh-CN": "百货商场", "zh-TW": "百貨商場" },
            { ko: "일산호수공원", en: "Ilsan Lake Park", ja: "一山湖水公園", "zh-CN": "一山湖水公园", "zh-TW": "一山湖水公園" },
          ],
        },
      ],
    },
  },

  // ─── 오더 #C8: K컬처 4 ────────────────────────────────────────────────
  {
    slug: "goyang-stadium",
    category: "kculture",
    type: "list",
    region: "일산서구",
    title: { ko: "고양종합운동장", en: "Goyang Stadium", ja: "高陽総合運動場", "zh-CN": "高阳综合运动场", "zh-TW": "高陽綜合運動場" },
    title_en_display: "GOYANG STADIUM",
    subtitle: { ko: "K팝 스타디움 공연이 열리는 곳", en: "Where K-pop stadium shows happen", ja: "K-POPスタジアム公演が開かれる場所", "zh-CN": "举办K-pop体育场演唱会之地", "zh-TW": "舉辦K-pop體育場演唱會之地" },
    lead: {
      ko: "4만 석 규모의 다목적 경기장입니다. 축구 경기 외에 대형 콘서트가 자주 열려 국내외 아티스트의 스타디움 공연 무대가 됩니다.",
      en: "A multi-purpose stadium seating around 40,000. Beyond football it regularly hosts large concerts, serving as a stadium stage for Korean and international artists.",
      ja: "4万席規模の多目的競技場です。サッカー以外に大型コンサートが頻繁に開かれ、国内外アーティストのスタジアム公演の舞台になります。",
      "zh-CN": "可容纳约四万人的多功能体育场。除足球赛事外常举办大型演唱会，是国内外艺人的体育场舞台。",
      "zh-TW": "可容納約四萬人的多功能體育場。除足球賽事外常舉辦大型演唱會，是國內外藝人的體育場舞台。",
    },
    meta: { updated_at: "2026-09-01" },
    sections: [], access: [], know: [],
    ko_card: [{ name_ko: "고양종합운동장", address_ko: "경기도 고양시 일산서구 중앙로 1601" }],
    credits: [], related: [],
    info: { hours: "varies", duration: "half_day", admission: "paid", access: "wheelchair" },
    highlights: [
      { ko: "대형 콘서트 개최", en: "Hosts large concerts", ja: "大型コンサート開催", "zh-CN": "举办大型演唱会", "zh-TW": "舉辦大型演唱會" },
      { ko: "4만 석 규모", en: "Around 40,000 seats", ja: "4万席規模", "zh-CN": "约四万座席", "zh-TW": "約四萬座席" },
      { ko: "축구 경기도 개최", en: "Also a football venue", ja: "サッカーの試合も開催", "zh-CN": "亦举办足球赛事", "zh-TW": "亦舉辦足球賽事" },
    ],
    adSlot: null,
    best_selected: false,
  },

  {
    slug: "kintex-kpop",
    category: "kculture",
    type: "list",
    region: "일산서구",
    title: { ko: "킨텍스 K팝 이벤트", en: "K-pop Events at KINTEX", ja: "キンテックスK-POPイベント", "zh-CN": "韩国国际展览中心K-pop活动", "zh-TW": "韓國國際展覽中心K-pop活動" },
    title_en_display: "K-POP AT KINTEX",
    subtitle: { ko: "팬 이벤트와 콘서트가 열리는 실내 무대", en: "Indoor stages for fan events and concerts", ja: "ファンイベントとコンサートの屋内ステージ", "zh-CN": "举办粉丝活动与演唱会的室内舞台", "zh-TW": "舉辦粉絲活動與演唱會的室內舞台" },
    lead: {
      ko: "킨텍스 전시장은 전시 외에 K팝 콘서트와 팬 이벤트 장소로도 쓰입니다. 실내라 날씨 영향이 없고 규모가 큽니다.",
      en: "Beyond trade shows, the KINTEX halls serve as venues for K-pop concerts and fan events. Being indoors and large, they work in any weather.",
      ja: "キンテックス展示場は展示以外にK-POPコンサートやファンイベントの会場としても使われます。屋内で天候の影響がなく規模も大きいです。",
      "zh-CN": "韩国国际展览中心除展会外，亦作为K-pop演唱会与粉丝活动的场地。室内举办不受天气影响，规模宏大。",
      "zh-TW": "韓國國際展覽中心除展會外，亦作為K-pop演唱會與粉絲活動的場地。室內舉辦不受天氣影響，規模宏大。",
    },
    meta: { updated_at: "2026-09-01" },
    sections: [], access: [], know: [],
    // 오더 #F0 [4]: TourAPI 250465 (킨텍스) 주소.
    ko_card: [{ name_ko: "킨텍스", address_ko: "경기도 고양시 일산서구 킨텍스로 217-60" }],
    map: [{ lat: 37.6689357879, lng: 126.7455635138, label: "킨텍스" }],
    credits: [], related: [],
    info: { hours: "varies", duration: "half_day", admission: "paid", access: "wheelchair" },
    highlights: [
      { ko: "실내 대형 무대", en: "A large indoor stage", ja: "屋内の大型ステージ", "zh-CN": "室内大型舞台", "zh-TW": "室內大型舞台" },
      { ko: "팬 이벤트 개최", en: "Fan events", ja: "ファンイベント開催", "zh-CN": "举办粉丝活动", "zh-TW": "舉辦粉絲活動" },
      { ko: "날씨 영향 없음", en: "Unaffected by weather", ja: "天候に左右されない", "zh-CN": "不受天气影响", "zh-TW": "不受天氣影響" },
    ],
    adSlot: null,
    nearest_station: { name: { ko: "GTX 킨텍스역", en: "GTX Kintex Stn.", ja: "GTX キンテックス駅", "zh-CN": "GTX 韩国国际展览中心站", "zh-TW": "GTX 韓國國際展覽中心站" }, walk_min: null },
    official_url: "http://www.kintex.com",
    best_selected: false,
  },

  {
    slug: "hallyu-world",
    category: "kculture",
    type: "list",
    region: "일산서구",
    title: { ko: "한류월드", en: "Hallyu World", ja: "韓流ワールド", "zh-CN": "韩流世界", "zh-TW": "韓流世界" },
    title_en_display: "HALLYU WORLD",
    subtitle: { ko: "K컬처를 주제로 조성된 구역", en: "A district built around Korean pop culture", ja: "K-カルチャーをテーマにした区域", "zh-CN": "以韩流文化为主题的区域", "zh-TW": "以韓流文化為主題的區域" },
    lead: {
      ko: "킨텍스 주변에 조성된 한류 테마 구역입니다. 공연시설과 상업시설이 함께 들어서 있습니다.",
      en: "A Korean-wave themed district around KINTEX, mixing performance venues with commercial facilities.",
      ja: "キンテックス周辺に造成された韓流テーマ区域です。公演施設と商業施設が併存します。",
      "zh-CN": "韩国国际展览中心周边打造的韩流主题区域，演出设施与商业设施并存。",
      "zh-TW": "韓國國際展覽中心周邊打造的韓流主題區域，演出設施與商業設施並存。",
    },
    meta: { updated_at: "2026-09-01" },
    sections: [], access: [], know: [],
    ko_card: [{ name_ko: "한류월드", address_ko: null }],
    credits: [], related: [],
    info: { hours: "always", duration: "1_2h", admission: "free", access: "wheelchair" },
    highlights: [
      { ko: "한류 테마 구역", en: "A Korean-wave themed district", ja: "韓流テーマ区域", "zh-CN": "韩流主题区域", "zh-TW": "韓流主題區域" },
      { ko: "공연·상업시설 혼재", en: "Venues and shops together", ja: "公演·商業施設が混在", "zh-CN": "演出与商业设施混合", "zh-TW": "演出與商業設施混合" },
      { ko: "킨텍스 도보권", en: "Walking distance from KINTEX", ja: "キンテックス徒歩圏", "zh-CN": "韩国国际展览中心步行可达", "zh-TW": "韓國國際展覽中心步行可達" },
    ],
    adSlot: null,
    nearest_station: { name: { ko: "GTX 킨텍스역", en: "GTX Kintex Stn.", ja: "GTX キンテックス駅", "zh-CN": "GTX 韩国国际展览中心站", "zh-TW": "GTX 韓國國際展覽中心站" }, walk_min: null },
    best_selected: false,
  },

  {
    slug: "onemount",
    category: "family",
    type: "list",
    region: "일산서구",
    title: { ko: "원마운트", en: "One Mount", ja: "ワンマウント", "zh-CN": "One Mount", "zh-TW": "One Mount" },
    title_en_display: "ONE MOUNT",
    subtitle: { ko: "스노우파크와 워터파크가 있는 복합시설", en: "A complex with snow and water parks", ja: "スノーパークとウォーターパークのある複合施設", "zh-CN": "设有雪世界与水上乐园的综合设施", "zh-TW": "設有雪世界與水上樂園的綜合設施" },
    lead: {
      ko: "실내 스노우파크와 워터파크를 갖춘 복합 레저시설입니다. 계절과 무관하게 이용할 수 있습니다.",
      en: "A leisure complex with an indoor snow park and water park, open regardless of season.",
      ja: "屋内スノーパークとウォーターパークを備えた複合レジャー施設です。季節を問わず利用できます。",
      "zh-CN": "设有室内雪世界与水上乐园的综合休闲设施，四季皆可利用。",
      "zh-TW": "設有室內雪世界與水上樂園的綜合休閒設施，四季皆可利用。",
    },
    meta: { updated_at: "2026-09-01" },
    sections: [], access: [], know: [],
    // 오더 #F0 [4]: 기존 address 유지 (오더 지시 "덮어쓰지 말 것"), 좌표만 신규.
    ko_card: [{ name_ko: "원마운트", address_ko: "경기도 고양시 일산서구 한류월드로 300" }],
    map: [{ lat: 37.6645540981816, lng: 126.754526582068, label: "원마운트" }],
    credits: [], related: [],
    info: { hours: "varies", duration: "half_day", admission: "paid", access: "wheelchair" },
    highlights: [
      { ko: "실내 스노우파크", en: "Indoor snow park", ja: "屋内スノーパーク", "zh-CN": "室内雪世界", "zh-TW": "室內雪世界" },
      { ko: "워터파크", en: "Water park", ja: "ウォーターパーク", "zh-CN": "水上乐园", "zh-TW": "水上樂園" },
      { ko: "계절 무관", en: "Open year-round", ja: "季節を問わない", "zh-CN": "四季皆宜", "zh-TW": "四季皆宜" },
    ],
    adSlot: null,
    nearest_station: { name: { ko: "GTX 킨텍스역", en: "GTX Kintex Stn.", ja: "GTX キンテックス駅", "zh-CN": "GTX 韩国国际展览中心站", "zh-TW": "GTX 韓國國際展覽中心站" }, walk_min: null },
    best_selected: false,
  },

  // ─── 오더 #E1 [2]: 신규 스팟 — 고양관광정보센터 (kculture) ─────────────
  //   Ma City 곡 안내 스팟. TourAPI contentid 2946746. Ma City 가사 인용 금지.
  {
    slug: "goyang-tourist-center",
    category: "kculture",
    type: "list",
    region: "일산동구",
    title: {
      ko: "고양관광정보센터",
      en: "Goyang Tourist Information Center",
      ja: "高陽観光情報センター",
      "zh-CN": "高阳旅游信息中心",
      "zh-TW": "高陽旅遊資訊中心",
    },
    title_en_display: "GOYANG TOURIST INFORMATION CENTER",
    subtitle: {
      ko: "벽화가 있는 정발산역 앞 안내소",
      en: "The information center with the mural, by Jeongbalsan Station",
      ja: "壁画のある鼎鉢山駅前の案内所",
      "zh-CN": "鼎钵山站前设有壁画的服务中心",
      "zh-TW": "鼎缽山站前設有壁畫的服務中心",
    },
    lead: {
      ko: "정발산역 2번 출구 앞 관광안내소입니다. 고양시가 이 건물 외벽에 벽화를 그렸고, 인근 육교 아래에는 일산이 언급된 곡의 조형물이 설치돼 있습니다. 관광 자료를 받고 시티투어를 문의할 수 있는 곳이기도 합니다.",
      en: "A tourist information center just outside Exit 2 of Jeongbalsan Station. The city painted a mural on the building's exterior wall, and beneath the nearby footbridge stands an installation for a song that names Ilsan. You can also pick up maps here and ask about city tours.",
      ja: "鼎鉢山駅2番出口前の観光案内所です。高陽市がこの建物の外壁に壁画を描き、近くの歩道橋の下には一山が言及された曲の造形物が設置されています。観光資料を受け取り、シティツアーを問い合わせることもできます。",
      "zh-CN": "位于鼎钵山站2号出口前的旅游服务中心。高阳市在建筑外墙绘制了壁画，附近天桥下设有一首提及一山的歌曲造形物。此处亦可索取旅游资料、咨询城市观光。",
      "zh-TW": "位於鼎缽山站2號出口前的旅遊服務中心。高陽市在建築外牆繪製了壁畫，附近天橋下設有一首提及一山的歌曲造形物。此處亦可索取旅遊資料、諮詢城市觀光。",
    },
    meta: { updated_at: "2026-09-01" },
    sections: [], access: [], know: [],
    ko_card: [{ name_ko: "고양관광정보센터", address_ko: "경기도 고양시 일산동구 중앙로 1271-1" }],
    credits: [], related: [],
    info: { hours: "varies", duration: "30min", admission: "free", access: "wheelchair" },
    highlights: [
      { ko: "고양시가 조성한 벽화", en: "A mural commissioned by the city", ja: "高陽市が造成した壁画", "zh-CN": "高阳市打造的壁画", "zh-TW": "高陽市打造的壁畫" },
      { ko: "육교 아래 조형물", en: "An installation beneath the footbridge", ja: "歩道橋の下の造形物", "zh-CN": "天桥下的造形物", "zh-TW": "天橋下的造形物" },
      { ko: "관광 자료·시티투어 안내", en: "Maps and city tour information", ja: "観光資料・シティツアー案内", "zh-CN": "旅游资料与城市观光咨询", "zh-TW": "旅遊資料與城市觀光諮詢" },
    ],
    adSlot: null,
    // 오더 #F0 [3]: TourAPI Type1 3장 (contentid 2946746).
    gallery: [
      { url: "/images/spots/goyang-tourist-center-1.jpg", credit: "출처: 한국관광공사 (공공누리 제1유형)", cpyrht: "Type1" },
      { url: "/images/spots/goyang-tourist-center-2.jpg", credit: "출처: 한국관광공사 (공공누리 제1유형)", cpyrht: "Type1" },
      { url: "/images/spots/goyang-tourist-center-3.jpg", credit: "출처: 한국관광공사 (공공누리 제1유형)", cpyrht: "Type1" },
    ],
    // 오더 #F0 [4]: TourAPI 좌표.
    map: [{ lat: 37.6595397482, lng: 126.7727121731, label: "고양관광정보센터" }],
    nearest_station: { name: { ko: "3호선 정발산역", en: "Jeongbalsan Stn. (Line 3)", ja: "3号線 鼎鉢山駅", "zh-CN": "3号线 鼎钵山站", "zh-TW": "3號線 鼎缽山站" }, walk_min: null },
    // 오더 #F0 [4]: 공식 사이트 (비짓고양).
    official_url: "https://www.goyang.go.kr/",
    best_selected: false,
    tourapi: { contentid: "2946746", overview_ko: "" },
    // 오더 #E1 [3]: onScreen (Ma City) + courses (MA CITY WALK).
    onScreen: {
      works: [
        {
          type: "music",
          titleKo: "Ma City",
          titleEn: "Ma City",
          artist: "BTS",
          album: "The Most Beautiful Moment in Life, Part 2",
          year: "2015",
          characters: {
            ko: "일산 · 라페스타 · 웨스턴돔 · 후곡 · 호수공원",
            en: "Ilsan · Lafesta · Western Dom · Hugok · Ilsan Lake Park",
            ja: "一山 · ラフェスタ · ウエスタンドム · 後谷 · 湖水公園",
            "zh-CN": "一山 · 拉斐斯塔 · 西部圆顶 · 后谷 · 湖水公园",
            "zh-TW": "一山 · 拉斐斯塔 · 西部圓頂 · 後谷 · 湖水公園",
          },
          site: {
            ko: "정발산역 육교 아래 조형물",
            en: "Installation beneath the Jeongbalsan Station footbridge",
            ja: "鼎鉢山駅の歩道橋下の造形物",
            "zh-CN": "鼎钵山站天桥下的造形物",
            "zh-TW": "鼎缽山站天橋下的造形物",
          },
          open: true,
          note: {
            ko: "이 곡에는 고양시의 여러 장소가 이름 그대로 등장합니다. 아래 코스로 그 장소들을 걸어서 돌 수 있습니다.",
            en: "Several places in Goyang appear in this song by name. The route below links them on foot.",
            ja: "この曲には高陽市のいくつかの場所が名前のまま登場します。下記のコースで歩いて巡ることができます。",
            "zh-CN": "这首歌中直接出现了高阳市的多个地名，可循下方路线步行走访。",
            "zh-TW": "這首歌中直接出現了高陽市的多個地名，可循下方路線步行走訪。",
          },
        },
      ],
      courses: [
        {
          name: {
            ko: "노래 속 장소를 걷는 길",
            en: "Walking the Places in the Song",
            ja: "歌の中の場所を歩く道",
            "zh-CN": "走过歌中的地方",
            "zh-TW": "走過歌中的地方",
          },
          stops: [
            { ko: "정발산역 2번 출구", en: "Jeongbalsan Stn. Exit 2", ja: "鼎鉢山駅2番出口", "zh-CN": "鼎钵山站2号出口", "zh-TW": "鼎缽山站2號出口" },
            { ko: "고양관광정보센터 벽화", en: "mural at the tourist center", ja: "観光情報センターの壁画", "zh-CN": "旅游中心壁画", "zh-TW": "旅遊中心壁畫" },
            { ko: "육교 조형물", en: "footbridge installation", ja: "歩道橋の造形物", "zh-CN": "天桥造形物", "zh-TW": "天橋造形物" },
            { ko: "라페스타", en: "Lafesta", ja: "ラフェスタ", "zh-CN": "拉斐斯塔", "zh-TW": "拉斐斯塔" },
            { ko: "웨스턴돔", en: "Western Dom", ja: "ウエスタンドム", "zh-CN": "西部圆顶", "zh-TW": "西部圓頂" },
            { ko: "일산호수공원", en: "Ilsan Lake Park", ja: "一山湖水公園", "zh-CN": "一山湖水公园", "zh-TW": "一山湖水公園" },
          ],
        },
      ],
    },
  },

  // ─── 오더 #E2 [1]: 신규 스팟 — 배우는 K컬처 (kculture · course) ─────────
  //   개별 학원·스튜디오 상호 게재 금지 → nearby(공공 프로그램) 항목은
  //   전부 「확인필요」라 미설정. 제휴 CTA 로 마무리.
  {
    slug: "learn-kculture",
    category: "kculture",
    type: "course",
    region: "일산동구",
    title: {
      ko: "고양에서 배우는 K컬처",
      en: "Learn K-Culture in Goyang",
      ja: "高陽で学ぶKカルチャー",
      "zh-CN": "在高阳学习韩流文化",
      "zh-TW": "在高陽學習韓流文化",
    },
    title_en_display: "LEARN K-CULTURE",
    subtitle: {
      ko: "보는 것에서 해보는 것으로",
      en: "From watching to doing",
      ja: "見ることから、やってみることへ",
      "zh-CN": "从观看到亲身体验",
      "zh-TW": "從觀看到親身體驗",
    },
    lead: {
      ko: "서울에서는 K팝을 보고, 고양에서는 해봅니다. 라페스타와 웨스턴돔 일대에는 댄스 스튜디오와 연기 학원이 걸어서 닿는 거리에 모여 있습니다. 원래 한국 학생들이 입시와 오디션을 준비하러 다니던 곳입니다. 방송 제작시설이 이 도시에 모여 있기 때문에 생긴 구조입니다.",
      en: "In Seoul you watch K-pop. In Goyang you can try it. Around Lafesta and Western Dom, dance studios and acting academies sit within walking distance of one another. They exist for Korean students preparing for auditions and arts-school entrance exams — a consequence of the broadcast production facilities concentrated in this city.",
      ja: "ソウルではK-POPを観て、高陽ではやってみます。ラフェスタとウエスタンドム一帯には、ダンススタジオと演技学院が徒歩圏に集まっています。もともと韓国の学生が入試やオーディションの準備に通う場所です。放送制作施設がこの都市に集まっているために生まれた構造です。",
      "zh-CN": "在首尔观看K-pop，在高阳则可亲身尝试。拉斐斯塔与西部圆顶一带，舞蹈工作室与表演学院步行可达。这些原本是韩国学生备考艺考与选秀之处——这一格局源于本市集中的广播制作设施。",
      "zh-TW": "在首爾觀看K-pop，在高陽則可親身嘗試。拉斐斯塔與西部圓頂一帶，舞蹈工作室與表演學院步行可達。這些原本是韓國學生備考藝考與選秀之處——這一格局源於本市集中的廣播製作設施。",
    },
    meta: { updated_at: "2026-09-01" },
    sections: [], access: [], know: [],
    ko_card: [{ name_ko: "라페스타 · 웨스턴돔 일대", address_ko: null }],
    credits: [], related: [],
    info: { hours: "varies", duration: "half_day", admission: "varies", access: "inquiry" },
    highlights: [
      { ko: "라페스타 일대에 밀집", en: "Clustered around Lafesta", ja: "ラフェスタ一帯に密集", "zh-CN": "集中于拉斐斯塔一带", "zh-TW": "集中於拉斐斯塔一帶" },
      { ko: "방송 제작시설이 모인 도시", en: "A city of broadcast facilities", ja: "放送制作施設が集まる都市", "zh-CN": "广播制作设施汇聚之城", "zh-TW": "廣播製作設施匯聚之城" },
      { ko: "공공 프로그램도 운영", en: "Public programmes also available", ja: "公共プログラムも運営", "zh-CN": "亦有公共项目", "zh-TW": "亦有公共項目" },
    ],
    adSlot: null,
    nearest_station: { name: { ko: "3호선 정발산역", en: "Jeongbalsan Stn. (Line 3)", ja: "3号線 鼎鉢山駅", "zh-CN": "3号线 鼎钵山站", "zh-TW": "3號線 鼎缽山站" }, walk_min: null },
    best_selected: false,
    storiesHeader: {
      title: {
        ko: "왜 고양에 학원이 많은가",
        en: "Why So Many Studios Are Here",
        ja: "なぜ高陽に学院が多いのか",
        "zh-CN": "为何高阳有这么多学院",
        "zh-TW": "為何高陽有這麼多學院",
      },
      lead: {
        ko: "이 도시에 학원이 몰린 이유는 방송국이 먼저 왔기 때문입니다.",
        en: "The reason so many academies are here is that the broadcasters arrived first.",
        ja: "この街に学院が集まった理由は、放送局が先に来たからです。",
        "zh-CN": "此地学院聚集，源于电视台先行落址。",
        "zh-TW": "此地學院聚集，源於電視台先行落址。",
      },
    },
    stories: [
      {
        eyebrow: "CHAPTER 1",
        theme: { ko: "방송의 도시", en: "BROADCAST CITY", ja: "放送の都市", "zh-CN": "广播之城", "zh-TW": "廣播之城" },
        title: {
          ko: "방송국이 모이자 학원이 따라왔다",
          en: "The Studios Followed the Broadcasters",
          ja: "放送局が集まると学院が続いた",
          "zh-CN": "电视台聚集，学院随之而来",
          "zh-TW": "電視台聚集，學院隨之而來",
        },
        site: { ko: "일산 일대", en: "The Ilsan area", ja: "一山一帯", "zh-CN": "一山一带", "zh-TW": "一山一帶" },
        open: true,
        body: {
          ko: "1995년 SBS가 탄현에 제작센터를 세운 뒤 MBC 드림센터가 들어왔고, 2017년에는 EBS 본사가 서울을 떠나 이곳으로 옮겨왔습니다. 전국네트워크 방송사 중 본사가 서울 밖에 있는 첫 사례입니다. 2019년 JTBC 스튜디오, 2022년 MBN 본사가 뒤따랐고, 정부가 운영하는 종합방송지원센터도 이 도시에 있습니다. 제작시설이 모이면서 그곳을 목표로 하는 사람들과 그들을 가르치는 곳도 함께 모였습니다.",
          en: "After SBS built its production centre in Tanhyeon in 1995, MBC's Dream Center followed, and in 2017 EBS moved its headquarters out of Seoul to this city — the first national network to base its head office outside the capital. A JTBC studio came in 2019 and MBN's headquarters in 2022, and the government-run broadcast support centre is here as well. As production facilities gathered, so did the people aiming for them, and the places that train them.",
          ja: "1995年にSBSが炭峴に制作センターを建てた後、MBCドリームセンターが入り、2017年にはEBS本社がソウルを離れてここへ移ってきました。全国ネットワーク放送局のうち本社がソウル外にある初の事例です。2019年にJTBCスタジオ、2022年にMBN本社が続き、政府が運営する総合放送支援センターもこの都市にあります。制作施設が集まるにつれ、そこを目指す人々と、その人々を教える場所も一緒に集まりました。",
          "zh-CN": "1995年SBS在炭岘建立制作中心后，MBC梦想中心随之进驻；2017年EBS总部离开首尔迁至此地，成为全国网络电视台中首个总部设于首都之外的案例。2019年JTBC演播室、2022年MBN总部相继落成，政府运营的综合广播支援中心亦设于此。随着制作设施聚集，怀抱志向的人们与培养他们的场所也一同汇聚而来。",
          "zh-TW": "1995年SBS在炭峴建立製作中心後，MBC夢想中心隨之進駐；2017年EBS總部離開首爾遷至此地，成為全國網絡電視台中首個總部設於首都之外的案例。2019年JTBC攝影棚、2022年MBN總部相繼落成，政府營運的綜合廣播支援中心亦設於此。隨著製作設施聚集，懷抱志向的人們與培養他們的場所也一同匯聚而來。",
        },
      },
    ],
    onScreen: {
      works: [],
      courses: [
        {
          name: {
            ko: "하루 K팝 댄서",
            en: "K-Pop Dancer for a Day",
            ja: "一日K-POPダンサー",
            "zh-CN": "一日K-pop舞者",
            "zh-TW": "一日K-pop舞者",
          },
          stops: [
            { ko: "안무 배우기", en: "Learn the choreography", ja: "振付を学ぶ", "zh-CN": "学习编舞", "zh-TW": "學習編舞" },
            { ko: "동선·표정·카메라", en: "positioning, expression, camera", ja: "動線·表情·カメラ", "zh-CN": "走位·表情·镜头", "zh-TW": "走位·表情·鏡頭" },
            { ko: "스타일링", en: "styling", ja: "スタイリング", "zh-CN": "造型", "zh-TW": "造型" },
            { ko: "스튜디오 촬영", en: "studio filming", ja: "スタジオ撮影", "zh-CN": "录影棚拍摄", "zh-TW": "攝影棚拍攝" },
            { ko: "라페스타에서 편집", en: "editing at Lafesta", ja: "ラフェスタで編集", "zh-CN": "在拉斐斯塔剪辑", "zh-TW": "在拉斐斯塔剪輯" },
          ],
        },
        {
          name: {
            ko: "두 시간 K드라마 배우",
            en: "K-Drama Actor for Two Hours",
            ja: "二時間のKドラマ俳優",
            "zh-CN": "两小时K剧演员",
            "zh-TW": "兩小時K劇演員",
          },
          stops: [
            { ko: "대본 받기", en: "Receive a script", ja: "台本を受け取る", "zh-CN": "领取剧本", "zh-TW": "領取劇本" },
            { ko: "대사 발음", en: "pronunciation", ja: "セリフの発音", "zh-CN": "台词发音", "zh-TW": "台詞發音" },
            { ko: "감정 연기", en: "emotional work", ja: "感情演技", "zh-CN": "情绪表演", "zh-TW": "情緒表演" },
            { ko: "카메라 연기", en: "acting for camera", ja: "カメラ演技", "zh-CN": "镜头表演", "zh-TW": "鏡頭表演" },
            { ko: "짧은 장면 촬영", en: "film a short scene", ja: "短いシーンの撮影", "zh-CN": "拍摄短场景", "zh-TW": "拍攝短場景" },
          ],
        },
      ],
    },
    partnerCta: {
      ko: "체험 프로그램을 운영하시나요? 제휴 문의",
      en: "Do you run a programme? Partner with us",
      ja: "体験プログラムを運営されていますか? 提携のお問い合わせ",
      "zh-CN": "您经营体验项目吗？合作咨询",
      "zh-TW": "您經營體驗項目嗎？合作諮詢",
    },
  },

  // ─── 오더 #E2 [1]: 신규 스팟 — 고양의 밤 (kculture · course) ────────────
  //   업체 상호·평점·후기수·가격 게재 금지. nearby 10 · onScreen.courses 3 · 제휴 CTA.
  {
    slug: "goyang-after-dark",
    category: "kculture",
    type: "course",
    region: "일산동구",
    title: { ko: "고양의 밤", en: "Goyang After Dark", ja: "高陽の夜", "zh-CN": "高阳之夜", "zh-TW": "高陽之夜" },
    title_en_display: "GOYANG AFTER DARK",
    subtitle: {
      ko: "한국 사람들이 저녁에 실제로 노는 방법",
      en: "How Koreans actually spend an evening",
      ja: "韓国の人が夕方に実際に遊ぶ方法",
      "zh-CN": "韩国人傍晚真正的消遣方式",
      "zh-TW": "韓國人傍晚真正的消遣方式",
    },
    lead: {
      ko: "서울의 밤은 관광지가 되었지만, 고양의 밤은 아직 생활입니다. 퇴근한 사람들이 저녁을 먹고, 스크린골프를 치고, 노래방에 가고, 카페에서 늦게까지 앉아 있습니다. 관광객을 위해 만든 것이 아니라 원래 그렇게 살아온 방식입니다.",
      en: "Seoul's nightlife has become a destination; Goyang's is still just life. People finish work, eat dinner, play screen golf, go to a noraebang, sit in a cafe until late. None of it was built for visitors — it is simply how people here have always spent an evening.",
      ja: "ソウルの夜は観光地になりましたが、高陽の夜はまだ生活です。仕事を終えた人が夕食を食べ、スクリーンゴルフを打ち、カラオケに行き、カフェで遅くまで座っています。観光客のためにつくられたものではなく、もともとそう暮らしてきた形です。",
      "zh-CN": "首尔的夜晚已成为旅游目的地，高阳的夜晚仍是生活本身。下班的人吃晚餐、打室内高尔夫、去练歌房、在咖啡馆坐到很晚。这些并非为游客而设，而是此地原本的生活方式。",
      "zh-TW": "首爾的夜晚已成為旅遊目的地，高陽的夜晚仍是生活本身。下班的人吃晚餐、打室內高爾夫、去練歌房、在咖啡館坐到很晚。這些並非為遊客而設，而是此地原本的生活方式。",
    },
    meta: { updated_at: "2026-09-01" },
    sections: [], access: [], know: [],
    ko_card: [{ name_ko: "라페스타 · 웨스턴돔 일대", address_ko: null }],
    credits: [], related: [],
    info: { hours: "varies", duration: "half_day", admission: "varies", access: "inquiry" },
    highlights: [
      { ko: "관광용이 아닌 생활 문화", en: "Everyday life, not a tourist product", ja: "観光用ではない生活文化", "zh-CN": "生活文化而非旅游产品", "zh-TW": "生活文化而非旅遊產品" },
      { ko: "라페스타·웨스턴돔 도보권", en: "Walkable around Lafesta and Western Dom", ja: "ラフェスタ·ウエスタンドム徒歩圏", "zh-CN": "拉斐斯塔与西部圆顶步行可达", "zh-TW": "拉斐斯塔與西部圓頂步行可達" },
      { ko: "늦게까지 여는 곳이 많음", en: "Many places stay open late", ja: "遅くまで開いている店が多い", "zh-CN": "多数场所营业至深夜", "zh-TW": "多數場所營業至深夜" },
    ],
    adSlot: null,
    nearest_station: { name: { ko: "3호선 정발산역", en: "Jeongbalsan Stn. (Line 3)", ja: "3号線 鼎鉢山駅", "zh-CN": "3号线 鼎钵山站", "zh-TW": "3號線 鼎缽山站" }, walk_min: null },
    best_selected: false,
    // 오더 #E2 [1]: nearby 10건. distance 미설정. slug 있는 항목은 자동 링크.
    //   zh-CN 항목3(K-BBQ) 오타 "добавить" → "续添" 로 수정 반영.
    nearby: {
      eyebrow: "TEN WAYS TO SPEND THE EVENING",
      title: {
        ko: "저녁을 보내는 열 가지 방법",
        en: "Ten Ways to Spend the Evening",
        ja: "夕方の過ごし方 十通り",
        "zh-CN": "度过夜晚的十种方式",
        "zh-TW": "度過夜晚的十種方式",
      },
      lead: {
        ko: "어느 하나만 골라도 되고, 몇 개를 이어도 됩니다.",
        en: "Pick one, or string several together.",
        ja: "どれか一つでも、いくつかつなげても構いません。",
        "zh-CN": "择其一，或数项相连，皆可。",
        "zh-TW": "擇其一，或數項相連，皆可。",
      },
      items: [
        {
          name: { ko: "스크린골프", en: "Screen Golf", ja: "スクリーンゴルフ", "zh-CN": "室内高尔夫", "zh-TW": "室內高爾夫" },
          tag: {
            ko: "방 하나를 빌려 골프 시뮬레이터로 9홀을 칩니다. 실제 코스를 화면으로 옮겨놓은 것이고, 클럽은 빌려 씁니다. 두세 시간 동안 이야기하며 노는 자리에 가깝습니다. 날씨와 상관없고 밤늦게까지 엽니다.",
            en: "You book a room and play nine holes on a golf simulator. Real courses are rendered on screen and clubs are provided. It is closer to a two- or three-hour hangout than a round of golf. Weather does not matter and many places stay open late.",
            ja: "部屋を一つ借りてゴルフシミュレーターで9ホールを打ちます。実際のコースを画面に移したもので、クラブは借りて使います。2〜3時間話しながら遊ぶ場に近いです。天気に左右されず、夜遅くまで開いています。",
            "zh-CN": "包一间房，用高尔夫模拟器打九洞。真实球场以屏幕呈现，球杆现场租借。与其说是打球，更接近两三小时的聚会。不受天气影响，多营业至深夜。",
            "zh-TW": "包一間房，用高爾夫模擬器打九洞。真實球場以螢幕呈現，球桿現場租借。與其說是打球，更接近兩三小時的聚會。不受天氣影響，多營業至深夜。",
          },
        },
        {
          name: { ko: "노래방", en: "Noraebang", ja: "カラオケ", "zh-CN": "练歌房", "zh-TW": "練歌房" },
          tag: {
            ko: "방을 시간 단위로 빌려 노래를 부릅니다. 일행끼리만 들어가므로 무대에 서는 부담이 없습니다. 외국곡이 들어 있는 곳도 많습니다.",
            en: "You rent a room by the hour and sing. Only your own group is inside, so there is no stage to face. Many places carry foreign-language songs.",
            ja: "部屋を時間単位で借りて歌います。同行者だけで入るので、舞台に立つ負担がありません。外国曲が入っている店も多いです。",
            "zh-CN": "按小时包房歌唱，仅同行者入内，无需面对舞台。不少店家备有外语歌曲。",
            "zh-TW": "按小時包廂歌唱，僅同行者入內，無需面對舞台。不少店家備有外語歌曲。",
          },
        },
        {
          name: { ko: "고깃집", en: "Korean BBQ", ja: "焼肉店", "zh-CN": "烤肉店", "zh-TW": "烤肉店" },
          tag: {
            ko: "테이블에서 직접 구워 먹습니다. 반찬은 대개 추가 요금 없이 다시 채워줍니다. 저녁 시간에 가장 붐빕니다.",
            en: "You grill at the table yourself. Side dishes are usually refilled at no extra charge. Evenings are the busiest.",
            ja: "テーブルで自分で焼いて食べます。おかずはたいてい追加料金なしでおかわりできます。夕方が最も混みます。",
            // zh-CN 오타 수정: "续добавить" → "续添".
            "zh-CN": "在餐桌上自行烤制。小菜通常可免费续添。傍晚时段最为拥挤。",
            "zh-TW": "在餐桌上自行烤製。小菜通常可免費續添。傍晚時段最為擁擠。",
          },
        },
        {
          name: { ko: "치킨과 맥주", en: "Chicken and Beer", ja: "チキンとビール", "zh-CN": "炸鸡配啤酒", "zh-TW": "炸雞配啤酒" },
          tag: {
            ko: "치킨에 맥주를 곁들이는 조합을 줄여 치맥이라 부릅니다. 늦은 시간까지 여는 곳이 많고 포장해서 숙소로 가져가도 됩니다.",
            en: "The pairing of fried chicken with beer is shortened to chimaek. Many places are open late, and you can take it back to your accommodation.",
            ja: "チキンにビールを合わせる組み合わせを縮めてチメクと呼びます。遅くまで開いている店が多く、持ち帰って宿で食べることもできます。",
            "zh-CN": "炸鸡配啤酒的组合简称「chimaek」。多数店家营业至深夜，亦可打包带回住处。",
            "zh-TW": "炸雞配啤酒的組合簡稱「chimaek」。多數店家營業至深夜，亦可打包帶回住處。",
          },
        },
        {
          name: { ko: "늦게까지 여는 카페", en: "Late-Night Cafes", ja: "遅くまで開くカフェ", "zh-CN": "深夜咖啡馆", "zh-TW": "深夜咖啡館" },
          tag: {
            ko: "식사 뒤에 카페로 자리를 옮기는 것이 보통입니다. 밤 열한 시, 열두 시까지 여는 곳이 있고 디저트를 함께 파는 곳도 많습니다.",
            en: "Moving to a cafe after a meal is the norm. Some stay open until eleven or midnight, and many serve desserts as well.",
            ja: "食事の後にカフェへ移るのが普通です。夜11時や12時まで開く店があり、デザートを一緒に出す店も多いです。",
            "zh-CN": "餐后转往咖啡馆是常态。有些营业至晚上十一点或午夜，许多也供应甜点。",
            "zh-TW": "餐後轉往咖啡館是常態。有些營業至晚上十一點或午夜，許多也供應甜點。",
          },
        },
        {
          name: { ko: "영화관", en: "Cinema", ja: "映画館", "zh-CN": "电影院", "zh-TW": "電影院" },
          tag: {
            ko: "웨스턴돔과 라페스타 안에 영화관이 있습니다. 자막 여부는 상영관마다 다르니 예매 전에 확인하세요.",
            en: "There are cinemas inside Western Dom and Lafesta. Subtitling varies by screening, so check before booking.",
            ja: "ウエスタンドムとラフェスタの中に映画館があります。字幕の有無は上映ごとに異なるため、予約前にご確認ください。",
            "zh-CN": "西部圆顶与拉斐斯塔内设有影院。字幕情况因场次而异，订票前请先确认。",
            "zh-TW": "西部圓頂與拉斐斯塔內設有影院。字幕情況因場次而異，訂票前請先確認。",
          },
        },
        {
          name: { ko: "볼링", en: "Bowling", ja: "ボウリング", "zh-CN": "保龄球", "zh-TW": "保齡球" },
          tag: {
            ko: "신발을 빌려 게임 단위로 칩니다. 여럿이 갈 때 무난한 선택입니다.",
            en: "Shoes are rented and you pay by the game. A straightforward choice for a group.",
            ja: "靴を借りてゲーム単位で投げます。大人数で行くときに無難な選択です。",
            "zh-CN": "租鞋后按局计费，多人同行时是稳妥之选。",
            "zh-TW": "租鞋後按局計費，多人同行時是穩妥之選。",
          },
        },
        {
          name: { ko: "공연", en: "Performances", ja: "公演", "zh-CN": "演出", "zh-TW": "演出" },
          tag: {
            ko: "아람누리와 어울림누리에서 저녁 공연이 열립니다. 대형 콘서트는 고양종합운동장과 킨텍스에서 열립니다.",
            en: "Evening performances run at Aram Nuri and Eoullim Nuri. Larger concerts take place at Goyang Stadium and KINTEX.",
            ja: "アラムヌリとオウルリムヌリで夜の公演が開かれます。大型コンサートは高陽総合運動場とキンテックスで行われます。",
            "zh-CN": "阿蓝世界与和谐世界有晚间演出。大型演唱会则在高阳综合运动场与韩国国际展览中心举行。",
            "zh-TW": "阿藍世界與和諧世界有晚間演出。大型演唱會則在高陽綜合運動場與韓國國際展覽中心舉行。",
          },
        },
        {
          name: { ko: "호수 야경", en: "The Lake at Night", ja: "湖の夜景", "zh-CN": "湖畔夜景", "zh-TW": "湖畔夜景" },
          slug: "ilsan-lake-park",
          tag: {
            ko: "일산호수공원은 밤에도 걸을 수 있습니다. 애수교에서 물에 비친 도시 불빛을 볼 수 있고, 주말에는 노래하는분수대가 가동됩니다.",
            en: "Ilsan Lake Park can be walked at night. From Aesugyo Bridge the city lights reflect on the water, and the Singing Fountain runs at weekends.",
            ja: "一山湖水公園は夜も歩けます。哀愁橋から水面に映る街の灯りが見え、週末には歌う噴水台が稼働します。",
            "zh-CN": "一山湖水公园夜间亦可漫步。自哀愁桥可见湖面倒映的城市灯火，周末歌唱喷泉开放。",
            "zh-TW": "一山湖水公園夜間亦可漫步。自哀愁橋可見湖面倒映的城市燈火，週末歌唱噴泉開放。",
          },
        },
        {
          name: { ko: "시장의 저녁", en: "The Market in the Evening", ja: "市場の夕方", "zh-CN": "市场的傍晚", "zh-TW": "市場的傍晚" },
          slug: "ilsan-traditional-market",
          tag: {
            ko: "전통시장 안이나 주변에 저녁까지 여는 식당이 있습니다. 신도시 상권과는 분위기가 다르고 가격대가 낮습니다.",
            en: "Inside and around the traditional market, some restaurants stay open into the evening. The atmosphere differs from the new-town districts, and prices are lower.",
            ja: "伝統市場の中や周辺に、夕方まで開いている食堂があります。新都市の商圏とは雰囲気が異なり、価格帯も低めです。",
            "zh-CN": "传统市场内外有营业至傍晚的餐馆。氛围与新城商圈不同，价格也较低。",
            "zh-TW": "傳統市場內外有營業至傍晚的餐館。氛圍與新城商圈不同，價格也較低。",
          },
        },
      ],
    },
    onScreen: {
      works: [],
      courses: [
        {
          name: { ko: "처음이라면", en: "If It Is Your First Evening", ja: "初めてなら", "zh-CN": "若是初次", "zh-TW": "若是初次" },
          stops: [
            { ko: "라페스타에서 고깃집", en: "Korean BBQ at Lafesta", ja: "ラフェスタで焼肉", "zh-CN": "拉斐斯塔烤肉", "zh-TW": "拉斐斯塔烤肉" },
            { ko: "웨스턴돔 카페", en: "a cafe at Western Dom", ja: "ウエスタンドムのカフェ", "zh-CN": "西部圆顶咖啡馆", "zh-TW": "西部圓頂咖啡館" },
            { ko: "일산호수공원 야경", en: "the lake park at night", ja: "一山湖水公園の夜景", "zh-CN": "一山湖水公园夜景", "zh-TW": "一山湖水公園夜景" },
          ],
        },
        {
          name: { ko: "한국식으로 놀아보기", en: "The Korean Way", ja: "韓国式に遊ぶ", "zh-CN": "韩式玩法", "zh-TW": "韓式玩法" },
          stops: [
            { ko: "저녁 식사", en: "Dinner", ja: "夕食", "zh-CN": "晚餐", "zh-TW": "晚餐" },
            { ko: "스크린골프 두세 시간", en: "two or three hours of screen golf", ja: "スクリーンゴルフ2〜3時間", "zh-CN": "室内高尔夫两三小时", "zh-TW": "室內高爾夫兩三小時" },
            { ko: "치맥으로 마무리", en: "chimaek to finish", ja: "チメクで締め", "zh-CN": "以炸鸡啤酒作结", "zh-TW": "以炸雞啤酒作結" },
          ],
        },
        {
          name: { ko: "전시가 끝난 뒤", en: "After the Exhibition", ja: "展示が終わった後", "zh-CN": "展会结束后", "zh-TW": "展會結束後" },
          stops: [
            { ko: "킨텍스", en: "KINTEX", ja: "キンテックス", "zh-CN": "韩国国际展览中心", "zh-TW": "韓國國際展覽中心" },
            { ko: "현대백화점 식사", en: "dinner at the department store", ja: "百貨店で食事", "zh-CN": "百货商场用餐", "zh-TW": "百貨商場用餐" },
            { ko: "호수공원 야경", en: "the lake park at night", ja: "湖水公園の夜景", "zh-CN": "湖水公园夜景", "zh-TW": "湖水公園夜景" },
            { ko: "라페스타", en: "Lafesta", ja: "ラフェスタ", "zh-CN": "拉斐斯塔", "zh-TW": "拉斐斯塔" },
          ],
        },
      ],
    },
    partnerCta: {
      ko: "저녁 프로그램을 운영하시나요? 제휴 문의",
      en: "Do you run an evening programme? Partner with us",
      ja: "夜のプログラムを運営されていますか? 提携のお問い合わせ",
      "zh-CN": "您经营夜间项目吗？合作咨询",
      "zh-TW": "您經營夜間項目嗎？合作諮詢",
    },
  },

  // ─── 오더 #FD1: food 실데이터 6건 추가 ─────────────────────────
  //   TourAPI 신 규격 lDong 인벤토리(706건)에서 detailCommon2 로 overview 확보.
  //   A안 채택: subtitle·lead 는 overview_ko 한글 원문을 5로케일 전부에 복제(폴백).
  //   subtitle = overview_ko 첫 문장 발췌 · lead = overview_ko 전체 원문.
  //   info varies · highlights [] · gallery 미설정(일러스트 폴백) · sections/access/know [] · nearest_station 미설정.
  //   창작·의역 금지. 다국어 번역은 후속 별도 오더.

  {
    slug: "neungwon-galbi",
    category: "food",
    type: "list",
    region: "덕양구",
    title: { ko: "능원숯불갈비", en: "능원숯불갈비", ja: "능원숯불갈비", "zh-CN": "능원숯불갈비", "zh-TW": "능원숯불갈비" },
    title_en_display: "NEUNGWON SUKBUL GALBI",
    subtitle: {
      ko: "능원숯불갈비는 고양시 용두동, 서오릉 정문 앞에 있는 숯불구이 전문점이다.",
      en: "능원숯불갈비는 고양시 용두동, 서오릉 정문 앞에 있는 숯불구이 전문점이다.",
      ja: "능원숯불갈비는 고양시 용두동, 서오릉 정문 앞에 있는 숯불구이 전문점이다.",
      "zh-CN": "능원숯불갈비는 고양시 용두동, 서오릉 정문 앞에 있는 숯불구이 전문점이다.",
      "zh-TW": "능원숯불갈비는 고양시 용두동, 서오릉 정문 앞에 있는 숯불구이 전문점이다.",
    },
    lead: {
      ko: "능원숯불갈비는 고양시 용두동, 서오릉 정문 앞에 있는 숯불구이 전문점이다. 갈비 전문 식당으로 200석 규모의 넓은 좌석이 있어 가족 식사나 단체 회식, 칠순 모임 등을 할 수 있다. 식당은 본관과 별관으로 나누어져 있고, 2층까지 사용할 수 있어 한꺼번에 많은 손님이 몰려와도 모두 수용할 수 있다. 대표 메뉴는 천연 과일 양념으로 숙성시킨 수제 갈비로 소갈비와 돼지갈비가 있고 육즙이 살아있고 부드러운 생갈비도 인기다. 그 밖에 한우 육회, 왕갈비탕, 냉면, 된장찌개가 있다. 기본으로 제공되는 다양한 종류의 밑반찬은 셀프 바를 이용해 얼마든지 가져다 먹을 수 있다.",
      en: "능원숯불갈비는 고양시 용두동, 서오릉 정문 앞에 있는 숯불구이 전문점이다. 갈비 전문 식당으로 200석 규모의 넓은 좌석이 있어 가족 식사나 단체 회식, 칠순 모임 등을 할 수 있다. 식당은 본관과 별관으로 나누어져 있고, 2층까지 사용할 수 있어 한꺼번에 많은 손님이 몰려와도 모두 수용할 수 있다. 대표 메뉴는 천연 과일 양념으로 숙성시킨 수제 갈비로 소갈비와 돼지갈비가 있고 육즙이 살아있고 부드러운 생갈비도 인기다. 그 밖에 한우 육회, 왕갈비탕, 냉면, 된장찌개가 있다. 기본으로 제공되는 다양한 종류의 밑반찬은 셀프 바를 이용해 얼마든지 가져다 먹을 수 있다.",
      ja: "능원숯불갈비는 고양시 용두동, 서오릉 정문 앞에 있는 숯불구이 전문점이다. 갈비 전문 식당으로 200석 규모의 넓은 좌석이 있어 가족 식사나 단체 회식, 칠순 모임 등을 할 수 있다. 식당은 본관과 별관으로 나누어져 있고, 2층까지 사용할 수 있어 한꺼번에 많은 손님이 몰려와도 모두 수용할 수 있다. 대표 메뉴는 천연 과일 양념으로 숙성시킨 수제 갈비로 소갈비와 돼지갈비가 있고 육즙이 살아있고 부드러운 생갈비도 인기다. 그 밖에 한우 육회, 왕갈비탕, 냉면, 된장찌개가 있다. 기본으로 제공되는 다양한 종류의 밑반찬은 셀프 바를 이용해 얼마든지 가져다 먹을 수 있다.",
      "zh-CN": "능원숯불갈비는 고양시 용두동, 서오릉 정문 앞에 있는 숯불구이 전문점이다. 갈비 전문 식당으로 200석 규모의 넓은 좌석이 있어 가족 식사나 단체 회식, 칠순 모임 등을 할 수 있다. 식당은 본관과 별관으로 나누어져 있고, 2층까지 사용할 수 있어 한꺼번에 많은 손님이 몰려와도 모두 수용할 수 있다. 대표 메뉴는 천연 과일 양념으로 숙성시킨 수제 갈비로 소갈비와 돼지갈비가 있고 육즙이 살아있고 부드러운 생갈비도 인기다. 그 밖에 한우 육회, 왕갈비탕, 냉면, 된장찌개가 있다. 기본으로 제공되는 다양한 종류의 밑반찬은 셀프 바를 이용해 얼마든지 가져다 먹을 수 있다.",
      "zh-TW": "능원숯불갈비는 고양시 용두동, 서오릉 정문 앞에 있는 숯불구이 전문점이다. 갈비 전문 식당으로 200석 규모의 넓은 좌석이 있어 가족 식사나 단체 회식, 칠순 모임 등을 할 수 있다. 식당은 본관과 별관으로 나누어져 있고, 2층까지 사용할 수 있어 한꺼번에 많은 손님이 몰려와도 모두 수용할 수 있다. 대표 메뉴는 천연 과일 양념으로 숙성시킨 수제 갈비로 소갈비와 돼지갈비가 있고 육즙이 살아있고 부드러운 생갈비도 인기다. 그 밖에 한우 육회, 왕갈비탕, 냉면, 된장찌개가 있다. 기본으로 제공되는 다양한 종류의 밑반찬은 셀프 바를 이용해 얼마든지 가져다 먹을 수 있다.",
    },
    meta: { updated_at: "2026-09-02" },
    sections: [], access: [], know: [],
    ko_card: [{ name_ko: "능원숯불갈비", address_ko: "경기도 고양시 덕양구 서오릉로 396-26 (용두동)" }],
    map: [{ lat: 37.6256375838, lng: 126.8971850975, label: "능원숯불갈비" }],
    credits: [], related: [],
    info: { hours: "varies", duration: "1_2h", admission: "varies", access: "inquiry" },
    highlights: [],
    adSlot: null,
    best_selected: false,
    tourapi: { contentid: "2874764", overview_ko: "능원숯불갈비는 고양시 용두동, 서오릉 정문 앞에 있는 숯불구이 전문점이다. 갈비 전문 식당으로 200석 규모의 넓은 좌석이 있어 가족 식사나 단체 회식, 칠순 모임 등을 할 수 있다. 식당은 본관과 별관으로 나누어져 있고, 2층까지 사용할 수 있어 한꺼번에 많은 손님이 몰려와도 모두 수용할 수 있다. 대표 메뉴는 천연 과일 양념으로 숙성시킨 수제 갈비로 소갈비와 돼지갈비가 있고 육즙이 살아있고 부드러운 생갈비도 인기다. 그 밖에 한우 육회, 왕갈비탕, 냉면, 된장찌개가 있다. 기본으로 제공되는 다양한 종류의 밑반찬은 셀프 바를 이용해 얼마든지 가져다 먹을 수 있다." },
  },

  {
    slug: "neunggok-halmeoni-bugeotang",
    category: "food",
    type: "list",
    region: "덕양구",
    title: { ko: "능곡할머니북어탕", en: "능곡할머니북어탕", ja: "능곡할머니북어탕", "zh-CN": "능곡할머니북어탕", "zh-TW": "능곡할머니북어탕" },
    title_en_display: "NEUNGGOK HALMEONI BUGEOTANG",
    subtitle: {
      ko: "현재는 폐역이 된 능곡역 인근에 위치한 능곡할머니북어탕은 전통의 북어탕 맛집이다.",
      en: "현재는 폐역이 된 능곡역 인근에 위치한 능곡할머니북어탕은 전통의 북어탕 맛집이다.",
      ja: "현재는 폐역이 된 능곡역 인근에 위치한 능곡할머니북어탕은 전통의 북어탕 맛집이다.",
      "zh-CN": "현재는 폐역이 된 능곡역 인근에 위치한 능곡할머니북어탕은 전통의 북어탕 맛집이다.",
      "zh-TW": "현재는 폐역이 된 능곡역 인근에 위치한 능곡할머니북어탕은 전통의 북어탕 맛집이다.",
    },
    lead: {
      ko: "현재는 폐역이 된 능곡역 인근에 위치한 능곡할머니북어탕은 전통의 북어탕 맛집이다. 이곳은 1대 주인장 할머니께서 젊은 시절 1970년대부터 시작하여 지금까지 50여 년이 넘은 역사를 자랑하는 식당이다. 능곡할머니북어탕의 대표메뉴는 반건조 북어 한 마리가 들어간 얼큰한 북어탕이다. 품질 좋은 반건조 북어를 비범 양념과 함께 푹 쪄내기 때문에 비린내는 없고 식감은 쫀득하다. 두부사리와 라면사리를 넣어 먹으면 더욱 맛있다. 또, 이 식당의 별미인 강원도 고랭지 배추로 담근 김치인데, 아삭하면서도 시원한 맛이 일품이다. 북어탕과 고랭지 김치는 모두 포장, 택배가 가능하다.",
      en: "현재는 폐역이 된 능곡역 인근에 위치한 능곡할머니북어탕은 전통의 북어탕 맛집이다. 이곳은 1대 주인장 할머니께서 젊은 시절 1970년대부터 시작하여 지금까지 50여 년이 넘은 역사를 자랑하는 식당이다. 능곡할머니북어탕의 대표메뉴는 반건조 북어 한 마리가 들어간 얼큰한 북어탕이다. 품질 좋은 반건조 북어를 비범 양념과 함께 푹 쪄내기 때문에 비린내는 없고 식감은 쫀득하다. 두부사리와 라면사리를 넣어 먹으면 더욱 맛있다. 또, 이 식당의 별미인 강원도 고랭지 배추로 담근 김치인데, 아삭하면서도 시원한 맛이 일품이다. 북어탕과 고랭지 김치는 모두 포장, 택배가 가능하다.",
      ja: "현재는 폐역이 된 능곡역 인근에 위치한 능곡할머니북어탕은 전통의 북어탕 맛집이다. 이곳은 1대 주인장 할머니께서 젊은 시절 1970년대부터 시작하여 지금까지 50여 년이 넘은 역사를 자랑하는 식당이다. 능곡할머니북어탕의 대표메뉴는 반건조 북어 한 마리가 들어간 얼큰한 북어탕이다. 품질 좋은 반건조 북어를 비범 양념과 함께 푹 쪄내기 때문에 비린내는 없고 식감은 쫀득하다. 두부사리와 라면사리를 넣어 먹으면 더욱 맛있다. 또, 이 식당의 별미인 강원도 고랭지 배추로 담근 김치인데, 아삭하면서도 시원한 맛이 일품이다. 북어탕과 고랭지 김치는 모두 포장, 택배가 가능하다.",
      "zh-CN": "현재는 폐역이 된 능곡역 인근에 위치한 능곡할머니북어탕은 전통의 북어탕 맛집이다. 이곳은 1대 주인장 할머니께서 젊은 시절 1970년대부터 시작하여 지금까지 50여 년이 넘은 역사를 자랑하는 식당이다. 능곡할머니북어탕의 대표메뉴는 반건조 북어 한 마리가 들어간 얼큰한 북어탕이다. 품질 좋은 반건조 북어를 비범 양념과 함께 푹 쪄내기 때문에 비린내는 없고 식감은 쫀득하다. 두부사리와 라면사리를 넣어 먹으면 더욱 맛있다. 또, 이 식당의 별미인 강원도 고랭지 배추로 담근 김치인데, 아삭하면서도 시원한 맛이 일품이다. 북어탕과 고랭지 김치는 모두 포장, 택배가 가능하다.",
      "zh-TW": "현재는 폐역이 된 능곡역 인근에 위치한 능곡할머니북어탕은 전통의 북어탕 맛집이다. 이곳은 1대 주인장 할머니께서 젊은 시절 1970년대부터 시작하여 지금까지 50여 년이 넘은 역사를 자랑하는 식당이다. 능곡할머니북어탕의 대표메뉴는 반건조 북어 한 마리가 들어간 얼큰한 북어탕이다. 품질 좋은 반건조 북어를 비범 양념과 함께 푹 쪄내기 때문에 비린내는 없고 식감은 쫀득하다. 두부사리와 라면사리를 넣어 먹으면 더욱 맛있다. 또, 이 식당의 별미인 강원도 고랭지 배추로 담근 김치인데, 아삭하면서도 시원한 맛이 일품이다. 북어탕과 고랭지 김치는 모두 포장, 택배가 가능하다.",
    },
    meta: { updated_at: "2026-09-02" },
    sections: [], access: [], know: [],
    ko_card: [{ name_ko: "능곡할머니북어탕", address_ko: "경기도 고양시 덕양구 토당로 66-15 (토당동)" }],
    map: [{ lat: 37.621661651, lng: 126.8191228907, label: "능곡할머니북어탕" }],
    credits: [], related: [],
    info: { hours: "varies", duration: "1_2h", admission: "varies", access: "inquiry" },
    highlights: [],
    adSlot: null,
    best_selected: false,
    tourapi: { contentid: "2891412", overview_ko: "현재는 폐역이 된 능곡역 인근에 위치한 능곡할머니북어탕은 전통의 북어탕 맛집이다. 이곳은 1대 주인장 할머니께서 젊은 시절 1970년대부터 시작하여 지금까지 50여 년이 넘은 역사를 자랑하는 식당이다. 능곡할머니북어탕의 대표메뉴는 반건조 북어 한 마리가 들어간 얼큰한 북어탕이다. 품질 좋은 반건조 북어를 비범 양념과 함께 푹 쪄내기 때문에 비린내는 없고 식감은 쫀득하다. 두부사리와 라면사리를 넣어 먹으면 더욱 맛있다. 또, 이 식당의 별미인 강원도 고랭지 배추로 담근 김치인데, 아삭하면서도 시원한 맛이 일품이다. 북어탕과 고랭지 김치는 모두 포장, 택배가 가능하다.", homepage: "https://www.instagram.com/grandmom_boogertang/" },
  },

  {
    slug: "gobongsan-siraegi",
    category: "food",
    type: "list",
    region: "일산동구",
    title: { ko: "고봉산시래기", en: "고봉산시래기", ja: "고봉산시래기", "zh-CN": "고봉산시래기", "zh-TW": "고봉산시래기" },
    title_en_display: "GOBONGSAN SIRAEGI",
    subtitle: {
      ko: "고봉산 시래기는 일산동구 고봉산 아래에 있는 생선구이와 가마솥 밥 전문점이다.",
      en: "고봉산 시래기는 일산동구 고봉산 아래에 있는 생선구이와 가마솥 밥 전문점이다.",
      ja: "고봉산 시래기는 일산동구 고봉산 아래에 있는 생선구이와 가마솥 밥 전문점이다.",
      "zh-CN": "고봉산 시래기는 일산동구 고봉산 아래에 있는 생선구이와 가마솥 밥 전문점이다.",
      "zh-TW": "고봉산 시래기는 일산동구 고봉산 아래에 있는 생선구이와 가마솥 밥 전문점이다.",
    },
    lead: {
      ko: "고봉산 시래기는 일산동구 고봉산 아래에 있는 생선구이와 가마솥 밥 전문점이다. 건물 1층에 초록색 간판이 눈에 띄는 이곳은 매장 앞에 주차장이 있어 편하게 주차할 수 있다. 깔끔하고 넓은 매장 안에는 테이블이 많이 배치되어 있어 많은 인원을 수용할 수 있다. 매일 직접 담은 김치와 당일 도정한 토종 품종 참드림으로 지은 가마솥 밥이 나오며 국내 청정지역 시래기를 사용하고 자화수 육각수를 이용하여 모든 음식을 만들고 있다. 이곳은 다양한 생선을 500도 화덕에서 구워 제공하며 시래기를 이용한 국밥과 육개장, 비빔밥, 가마솥 밥 등과 전국 20가지의 지역 막걸리를 판매하고 있어 다양하게 즐길 수 있다.",
      en: "고봉산 시래기는 일산동구 고봉산 아래에 있는 생선구이와 가마솥 밥 전문점이다. 건물 1층에 초록색 간판이 눈에 띄는 이곳은 매장 앞에 주차장이 있어 편하게 주차할 수 있다. 깔끔하고 넓은 매장 안에는 테이블이 많이 배치되어 있어 많은 인원을 수용할 수 있다. 매일 직접 담은 김치와 당일 도정한 토종 품종 참드림으로 지은 가마솥 밥이 나오며 국내 청정지역 시래기를 사용하고 자화수 육각수를 이용하여 모든 음식을 만들고 있다. 이곳은 다양한 생선을 500도 화덕에서 구워 제공하며 시래기를 이용한 국밥과 육개장, 비빔밥, 가마솥 밥 등과 전국 20가지의 지역 막걸리를 판매하고 있어 다양하게 즐길 수 있다.",
      ja: "고봉산 시래기는 일산동구 고봉산 아래에 있는 생선구이와 가마솥 밥 전문점이다. 건물 1층에 초록색 간판이 눈에 띄는 이곳은 매장 앞에 주차장이 있어 편하게 주차할 수 있다. 깔끔하고 넓은 매장 안에는 테이블이 많이 배치되어 있어 많은 인원을 수용할 수 있다. 매일 직접 담은 김치와 당일 도정한 토종 품종 참드림으로 지은 가마솥 밥이 나오며 국내 청정지역 시래기를 사용하고 자화수 육각수를 이용하여 모든 음식을 만들고 있다. 이곳은 다양한 생선을 500도 화덕에서 구워 제공하며 시래기를 이용한 국밥과 육개장, 비빔밥, 가마솥 밥 등과 전국 20가지의 지역 막걸리를 판매하고 있어 다양하게 즐길 수 있다.",
      "zh-CN": "고봉산 시래기는 일산동구 고봉산 아래에 있는 생선구이와 가마솥 밥 전문점이다. 건물 1층에 초록색 간판이 눈에 띄는 이곳은 매장 앞에 주차장이 있어 편하게 주차할 수 있다. 깔끔하고 넓은 매장 안에는 테이블이 많이 배치되어 있어 많은 인원을 수용할 수 있다. 매일 직접 담은 김치와 당일 도정한 토종 품종 참드림으로 지은 가마솥 밥이 나오며 국내 청정지역 시래기를 사용하고 자화수 육각수를 이용하여 모든 음식을 만들고 있다. 이곳은 다양한 생선을 500도 화덕에서 구워 제공하며 시래기를 이용한 국밥과 육개장, 비빔밥, 가마솥 밥 등과 전국 20가지의 지역 막걸리를 판매하고 있어 다양하게 즐길 수 있다.",
      "zh-TW": "고봉산 시래기는 일산동구 고봉산 아래에 있는 생선구이와 가마솥 밥 전문점이다. 건물 1층에 초록색 간판이 눈에 띄는 이곳은 매장 앞에 주차장이 있어 편하게 주차할 수 있다. 깔끔하고 넓은 매장 안에는 테이블이 많이 배치되어 있어 많은 인원을 수용할 수 있다. 매일 직접 담은 김치와 당일 도정한 토종 품종 참드림으로 지은 가마솥 밥이 나오며 국내 청정지역 시래기를 사용하고 자화수 육각수를 이용하여 모든 음식을 만들고 있다. 이곳은 다양한 생선을 500도 화덕에서 구워 제공하며 시래기를 이용한 국밥과 육개장, 비빔밥, 가마솥 밥 등과 전국 20가지의 지역 막걸리를 판매하고 있어 다양하게 즐길 수 있다.",
    },
    meta: { updated_at: "2026-09-02" },
    sections: [], access: [], know: [],
    ko_card: [{ name_ko: "고봉산시래기", address_ko: "경기도 고양시 일산동구 성석로 60 (중산동)" }],
    map: [{ lat: 37.6850176923, lng: 126.7926374107, label: "고봉산시래기" }],
    credits: [], related: [],
    info: { hours: "varies", duration: "1_2h", admission: "varies", access: "inquiry" },
    highlights: [],
    adSlot: null,
    best_selected: false,
    tourapi: { contentid: "2873185", overview_ko: "고봉산 시래기는 일산동구 고봉산 아래에 있는 생선구이와 가마솥 밥 전문점이다. 건물 1층에 초록색 간판이 눈에 띄는 이곳은 매장 앞에 주차장이 있어 편하게 주차할 수 있다. 깔끔하고 넓은 매장 안에는 테이블이 많이 배치되어 있어 많은 인원을 수용할 수 있다. 매일 직접 담은 김치와 당일 도정한 토종 품종 참드림으로 지은 가마솥 밥이 나오며 국내 청정지역 시래기를 사용하고 자화수 육각수를 이용하여 모든 음식을 만들고 있다. 이곳은 다양한 생선을 500도 화덕에서 구워 제공하며 시래기를 이용한 국밥과 육개장, 비빔밥, 가마솥 밥 등과 전국 20가지의 지역 막걸리를 판매하고 있어 다양하게 즐길 수 있다." },
  },

  {
    slug: "gom-taco",
    category: "food",
    type: "list",
    region: "일산동구",
    title: { ko: "곰타코", en: "곰타코", ja: "곰타코", "zh-CN": "곰타코", "zh-TW": "곰타코" },
    title_en_display: "GOM TACO",
    subtitle: {
      ko: "곰타코는 백석역 근처에 있는 멕시코 음식점이다.",
      en: "곰타코는 백석역 근처에 있는 멕시코 음식점이다.",
      ja: "곰타코는 백석역 근처에 있는 멕시코 음식점이다.",
      "zh-CN": "곰타코는 백석역 근처에 있는 멕시코 음식점이다.",
      "zh-TW": "곰타코는 백석역 근처에 있는 멕시코 음식점이다.",
    },
    lead: {
      ko: "곰타코는 백석역 근처에 있는 멕시코 음식점이다. 외부는 검은색 나무 간판에 멕시칸&스모킹BBQ라고 씌어있고 주차는 가게 앞이나 골목에 하면 된다. 내부엔 2인석 5~6개, 4인석 4~5개의 테이블을 갖추고 있고 '곰'이라는 상호처럼 곳곳에 곰으로 꾸며져 있다. 메뉴는 곰 파히타, 곰 립, 곰 감바스, 저크칠리파스타, 살시치아파스타, 타코 종류들, 퀘사디아, 나초 등이다. 대표메뉴는 곰파히타로 특제 시즈닝으로 볶은 야채 위에 새우, 소고기, 수제 베이컨이 올라간다. 고기는 부드럽고 새우는 크고 탱탱해서 토르티야에 싸 먹어도 되고 그냥 먹어도 된다. 소주, 맥주, 하이볼 등 주류도 판매한다.",
      en: "곰타코는 백석역 근처에 있는 멕시코 음식점이다. 외부는 검은색 나무 간판에 멕시칸&스모킹BBQ라고 씌어있고 주차는 가게 앞이나 골목에 하면 된다. 내부엔 2인석 5~6개, 4인석 4~5개의 테이블을 갖추고 있고 '곰'이라는 상호처럼 곳곳에 곰으로 꾸며져 있다. 메뉴는 곰 파히타, 곰 립, 곰 감바스, 저크칠리파스타, 살시치아파스타, 타코 종류들, 퀘사디아, 나초 등이다. 대표메뉴는 곰파히타로 특제 시즈닝으로 볶은 야채 위에 새우, 소고기, 수제 베이컨이 올라간다. 고기는 부드럽고 새우는 크고 탱탱해서 토르티야에 싸 먹어도 되고 그냥 먹어도 된다. 소주, 맥주, 하이볼 등 주류도 판매한다.",
      ja: "곰타코는 백석역 근처에 있는 멕시코 음식점이다. 외부는 검은색 나무 간판에 멕시칸&스모킹BBQ라고 씌어있고 주차는 가게 앞이나 골목에 하면 된다. 내부엔 2인석 5~6개, 4인석 4~5개의 테이블을 갖추고 있고 '곰'이라는 상호처럼 곳곳에 곰으로 꾸며져 있다. 메뉴는 곰 파히타, 곰 립, 곰 감바스, 저크칠리파스타, 살시치아파스타, 타코 종류들, 퀘사디아, 나초 등이다. 대표메뉴는 곰파히타로 특제 시즈닝으로 볶은 야채 위에 새우, 소고기, 수제 베이컨이 올라간다. 고기는 부드럽고 새우는 크고 탱탱해서 토르티야에 싸 먹어도 되고 그냥 먹어도 된다. 소주, 맥주, 하이볼 등 주류도 판매한다.",
      "zh-CN": "곰타코는 백석역 근처에 있는 멕시코 음식점이다. 외부는 검은색 나무 간판에 멕시칸&스모킹BBQ라고 씌어있고 주차는 가게 앞이나 골목에 하면 된다. 내부엔 2인석 5~6개, 4인석 4~5개의 테이블을 갖추고 있고 '곰'이라는 상호처럼 곳곳에 곰으로 꾸며져 있다. 메뉴는 곰 파히타, 곰 립, 곰 감바스, 저크칠리파스타, 살시치아파스타, 타코 종류들, 퀘사디아, 나초 등이다. 대표메뉴는 곰파히타로 특제 시즈닝으로 볶은 야채 위에 새우, 소고기, 수제 베이컨이 올라간다. 고기는 부드럽고 새우는 크고 탱탱해서 토르티야에 싸 먹어도 되고 그냥 먹어도 된다. 소주, 맥주, 하이볼 등 주류도 판매한다.",
      "zh-TW": "곰타코는 백석역 근처에 있는 멕시코 음식점이다. 외부는 검은색 나무 간판에 멕시칸&스모킹BBQ라고 씌어있고 주차는 가게 앞이나 골목에 하면 된다. 내부엔 2인석 5~6개, 4인석 4~5개의 테이블을 갖추고 있고 '곰'이라는 상호처럼 곳곳에 곰으로 꾸며져 있다. 메뉴는 곰 파히타, 곰 립, 곰 감바스, 저크칠리파스타, 살시치아파스타, 타코 종류들, 퀘사디아, 나초 등이다. 대표메뉴는 곰파히타로 특제 시즈닝으로 볶은 야채 위에 새우, 소고기, 수제 베이컨이 올라간다. 고기는 부드럽고 새우는 크고 탱탱해서 토르티야에 싸 먹어도 되고 그냥 먹어도 된다. 소주, 맥주, 하이볼 등 주류도 판매한다.",
    },
    meta: { updated_at: "2026-09-02" },
    sections: [], access: [], know: [],
    ko_card: [{ name_ko: "곰타코", address_ko: "경기도 고양시 일산동구 백석로108번길 6-8 (백석동)" }],
    map: [{ lat: 37.6487607363, lng: 126.7889359946, label: "곰타코" }],
    credits: [], related: [],
    info: { hours: "varies", duration: "1_2h", admission: "varies", access: "inquiry" },
    highlights: [],
    adSlot: null,
    best_selected: false,
    tourapi: { contentid: "2868410", overview_ko: "곰타코는 백석역 근처에 있는 멕시코 음식점이다. 외부는 검은색 나무 간판에 멕시칸&스모킹BBQ라고 씌어있고 주차는 가게 앞이나 골목에 하면 된다. 내부엔 2인석 5~6개, 4인석 4~5개의 테이블을 갖추고 있고 '곰'이라는 상호처럼 곳곳에 곰으로 꾸며져 있다. 메뉴는 곰 파히타, 곰 립, 곰 감바스, 저크칠리파스타, 살시치아파스타, 타코 종류들, 퀘사디아, 나초 등이다. 대표메뉴는 곰파히타로 특제 시즈닝으로 볶은 야채 위에 새우, 소고기, 수제 베이컨이 올라간다. 고기는 부드럽고 새우는 크고 탱탱해서 토르티야에 싸 먹어도 되고 그냥 먹어도 된다. 소주, 맥주, 하이볼 등 주류도 판매한다." },
  },

  {
    slug: "the-nurungji",
    category: "food",
    type: "list",
    region: "일산서구",
    title: { ko: "더 누룽지", en: "더 누룽지", ja: "더 누룽지", "zh-CN": "더 누룽지", "zh-TW": "더 누룽지" },
    title_en_display: "THE NURUNGJI",
    subtitle: {
      ko: "더 누룽지는 경기도 고양시 덕이동, 덕이 초등학교 근처에 있는 해물누룽지탕 전문점이다.",
      en: "더 누룽지는 경기도 고양시 덕이동, 덕이 초등학교 근처에 있는 해물누룽지탕 전문점이다.",
      ja: "더 누룽지는 경기도 고양시 덕이동, 덕이 초등학교 근처에 있는 해물누룽지탕 전문점이다.",
      "zh-CN": "더 누룽지는 경기도 고양시 덕이동, 덕이 초등학교 근처에 있는 해물누룽지탕 전문점이다.",
      "zh-TW": "더 누룽지는 경기도 고양시 덕이동, 덕이 초등학교 근처에 있는 해물누룽지탕 전문점이다.",
    },
    lead: {
      ko: "더 누룽지는 경기도 고양시 덕이동, 덕이 초등학교 근처에 있는 해물누룽지탕 전문점이다. 대로변에 있어 찾기 쉽고 매장 앞에 넓은 주차장이 있어 편하게 주차할 수 있다. 깔끔하고 넓은 식당 내부에는 테이블이 간격을 두고 여유롭게 배치되어 있다. 대표 메뉴는 주꾸미, 소라살, 갑오징어, 새우등의 신선한 해산물과 제철 채소를 넣은 기본 누룽지탕과 완도와 노화도에서 직송한 전복, 키조개, 관자가 더해진 해물 가득 누룽지탕, 그리고 바다의 풍부한 향이 담긴 매생이 굴 누룽지탕이 있다. 또한 1등급 국내산 등심만을 사용해 만든 찹쌀 탕수육도 사이드 메뉴로 인기다. 기본으로 제공되는 깔끔한 밑반찬과 샐러드는 셀프 코너를 이용해 가져다 먹을 수 있다. 더 누룽지의 모든 메뉴는 포장할 수 있다.",
      en: "더 누룽지는 경기도 고양시 덕이동, 덕이 초등학교 근처에 있는 해물누룽지탕 전문점이다. 대로변에 있어 찾기 쉽고 매장 앞에 넓은 주차장이 있어 편하게 주차할 수 있다. 깔끔하고 넓은 식당 내부에는 테이블이 간격을 두고 여유롭게 배치되어 있다. 대표 메뉴는 주꾸미, 소라살, 갑오징어, 새우등의 신선한 해산물과 제철 채소를 넣은 기본 누룽지탕과 완도와 노화도에서 직송한 전복, 키조개, 관자가 더해진 해물 가득 누룽지탕, 그리고 바다의 풍부한 향이 담긴 매생이 굴 누룽지탕이 있다. 또한 1등급 국내산 등심만을 사용해 만든 찹쌀 탕수육도 사이드 메뉴로 인기다. 기본으로 제공되는 깔끔한 밑반찬과 샐러드는 셀프 코너를 이용해 가져다 먹을 수 있다. 더 누룽지의 모든 메뉴는 포장할 수 있다.",
      ja: "더 누룽지는 경기도 고양시 덕이동, 덕이 초등학교 근처에 있는 해물누룽지탕 전문점이다. 대로변에 있어 찾기 쉽고 매장 앞에 넓은 주차장이 있어 편하게 주차할 수 있다. 깔끔하고 넓은 식당 내부에는 테이블이 간격을 두고 여유롭게 배치되어 있다. 대표 메뉴는 주꾸미, 소라살, 갑오징어, 새우등의 신선한 해산물과 제철 채소를 넣은 기본 누룽지탕과 완도와 노화도에서 직송한 전복, 키조개, 관자가 더해진 해물 가득 누룽지탕, 그리고 바다의 풍부한 향이 담긴 매생이 굴 누룽지탕이 있다. 또한 1등급 국내산 등심만을 사용해 만든 찹쌀 탕수육도 사이드 메뉴로 인기다. 기본으로 제공되는 깔끔한 밑반찬과 샐러드는 셀프 코너를 이용해 가져다 먹을 수 있다. 더 누룽지의 모든 메뉴는 포장할 수 있다.",
      "zh-CN": "더 누룽지는 경기도 고양시 덕이동, 덕이 초등학교 근처에 있는 해물누룽지탕 전문점이다. 대로변에 있어 찾기 쉽고 매장 앞에 넓은 주차장이 있어 편하게 주차할 수 있다. 깔끔하고 넓은 식당 내부에는 테이블이 간격을 두고 여유롭게 배치되어 있다. 대표 메뉴는 주꾸미, 소라살, 갑오징어, 새우등의 신선한 해산물과 제철 채소를 넣은 기본 누룽지탕과 완도와 노화도에서 직송한 전복, 키조개, 관자가 더해진 해물 가득 누룽지탕, 그리고 바다의 풍부한 향이 담긴 매생이 굴 누룽지탕이 있다. 또한 1등급 국내산 등심만을 사용해 만든 찹쌀 탕수육도 사이드 메뉴로 인기다. 기본으로 제공되는 깔끔한 밑반찬과 샐러드는 셀프 코너를 이용해 가져다 먹을 수 있다. 더 누룽지의 모든 메뉴는 포장할 수 있다.",
      "zh-TW": "더 누룽지는 경기도 고양시 덕이동, 덕이 초등학교 근처에 있는 해물누룽지탕 전문점이다. 대로변에 있어 찾기 쉽고 매장 앞에 넓은 주차장이 있어 편하게 주차할 수 있다. 깔끔하고 넓은 식당 내부에는 테이블이 간격을 두고 여유롭게 배치되어 있다. 대표 메뉴는 주꾸미, 소라살, 갑오징어, 새우등의 신선한 해산물과 제철 채소를 넣은 기본 누룽지탕과 완도와 노화도에서 직송한 전복, 키조개, 관자가 더해진 해물 가득 누룽지탕, 그리고 바다의 풍부한 향이 담긴 매생이 굴 누룽지탕이 있다. 또한 1등급 국내산 등심만을 사용해 만든 찹쌀 탕수육도 사이드 메뉴로 인기다. 기본으로 제공되는 깔끔한 밑반찬과 샐러드는 셀프 코너를 이용해 가져다 먹을 수 있다. 더 누룽지의 모든 메뉴는 포장할 수 있다.",
    },
    meta: { updated_at: "2026-09-02" },
    sections: [], access: [], know: [],
    ko_card: [{ name_ko: "더 누룽지", address_ko: "경기도 고양시 일산서구 미래로 184-12 (덕이동)" }],
    map: [{ lat: 37.694265807, lng: 126.7473246256, label: "더 누룽지" }],
    credits: [], related: [],
    info: { hours: "varies", duration: "1_2h", admission: "varies", access: "inquiry" },
    highlights: [],
    adSlot: null,
    best_selected: false,
    tourapi: { contentid: "2874808", overview_ko: "더 누룽지는 경기도 고양시 덕이동, 덕이 초등학교 근처에 있는 해물누룽지탕 전문점이다. 대로변에 있어 찾기 쉽고 매장 앞에 넓은 주차장이 있어 편하게 주차할 수 있다. 깔끔하고 넓은 식당 내부에는 테이블이 간격을 두고 여유롭게 배치되어 있다. 대표 메뉴는 주꾸미, 소라살, 갑오징어, 새우등의 신선한 해산물과 제철 채소를 넣은 기본 누룽지탕과 완도와 노화도에서 직송한 전복, 키조개, 관자가 더해진 해물 가득 누룽지탕, 그리고 바다의 풍부한 향이 담긴 매생이 굴 누룽지탕이 있다. 또한 1등급 국내산 등심만을 사용해 만든 찹쌀 탕수육도 사이드 메뉴로 인기다. 기본으로 제공되는 깔끔한 밑반찬과 샐러드는 셀프 코너를 이용해 가져다 먹을 수 있다. 더 누룽지의 모든 메뉴는 포장할 수 있다.", homepage: "http://www.더누룽지.com" },
  },

  {
    slug: "gaya-milmyeon-ilsan",
    category: "food",
    type: "list",
    region: "일산서구",
    title: { ko: "가야밀면돼지국밥 일산본점", en: "가야밀면돼지국밥 일산본점", ja: "가야밀면돼지국밥 일산본점", "zh-CN": "가야밀면돼지국밥 일산본점", "zh-TW": "가야밀면돼지국밥 일산본점" },
    title_en_display: "GAYA MILMYEON ILSAN",
    subtitle: {
      ko: "가야밀면돼지국밥 일산본점은 일산 대화동 킨텍스 건너편에 있는 밀면, 돼지국밥 맛집이다.",
      en: "가야밀면돼지국밥 일산본점은 일산 대화동 킨텍스 건너편에 있는 밀면, 돼지국밥 맛집이다.",
      ja: "가야밀면돼지국밥 일산본점은 일산 대화동 킨텍스 건너편에 있는 밀면, 돼지국밥 맛집이다.",
      "zh-CN": "가야밀면돼지국밥 일산본점은 일산 대화동 킨텍스 건너편에 있는 밀면, 돼지국밥 맛집이다.",
      "zh-TW": "가야밀면돼지국밥 일산본점은 일산 대화동 킨텍스 건너편에 있는 밀면, 돼지국밥 맛집이다.",
    },
    lead: {
      ko: "가야밀면돼지국밥 일산본점은 일산 대화동 킨텍스 건너편에 있는 밀면, 돼지국밥 맛집이다. 가게 앞에 3~4대 정도의 주차 공간이 있다. 본관 옆에 신관 건물도 있어서 둘 중 편한 곳으로 자리 잡으면 된다. 이곳은 밀면이 유명하지만, 돼지국밥이나 고기국수도 맛있다. 밀면을 주문하면 굵고 쫄깃한 면발 위에 정성스럽게 달인 육수를 붓고 양념장을 얹어 준다. 돼지국밥은 약재를 넣어 끓여서 냄새가 나지 않고 고기를 듬뿍 얹어 준다. 국밥이 뜨거울 때 부추를 넣고 기호에 맞게 청양고추를 넣어 먹으면 된다.",
      en: "가야밀면돼지국밥 일산본점은 일산 대화동 킨텍스 건너편에 있는 밀면, 돼지국밥 맛집이다. 가게 앞에 3~4대 정도의 주차 공간이 있다. 본관 옆에 신관 건물도 있어서 둘 중 편한 곳으로 자리 잡으면 된다. 이곳은 밀면이 유명하지만, 돼지국밥이나 고기국수도 맛있다. 밀면을 주문하면 굵고 쫄깃한 면발 위에 정성스럽게 달인 육수를 붓고 양념장을 얹어 준다. 돼지국밥은 약재를 넣어 끓여서 냄새가 나지 않고 고기를 듬뿍 얹어 준다. 국밥이 뜨거울 때 부추를 넣고 기호에 맞게 청양고추를 넣어 먹으면 된다.",
      ja: "가야밀면돼지국밥 일산본점은 일산 대화동 킨텍스 건너편에 있는 밀면, 돼지국밥 맛집이다. 가게 앞에 3~4대 정도의 주차 공간이 있다. 본관 옆에 신관 건물도 있어서 둘 중 편한 곳으로 자리 잡으면 된다. 이곳은 밀면이 유명하지만, 돼지국밥이나 고기국수도 맛있다. 밀면을 주문하면 굵고 쫄깃한 면발 위에 정성스럽게 달인 육수를 붓고 양념장을 얹어 준다. 돼지국밥은 약재를 넣어 끓여서 냄새가 나지 않고 고기를 듬뿍 얹어 준다. 국밥이 뜨거울 때 부추를 넣고 기호에 맞게 청양고추를 넣어 먹으면 된다.",
      "zh-CN": "가야밀면돼지국밥 일산본점은 일산 대화동 킨텍스 건너편에 있는 밀면, 돼지국밥 맛집이다. 가게 앞에 3~4대 정도의 주차 공간이 있다. 본관 옆에 신관 건물도 있어서 둘 중 편한 곳으로 자리 잡으면 된다. 이곳은 밀면이 유명하지만, 돼지국밥이나 고기국수도 맛있다. 밀면을 주문하면 굵고 쫄깃한 면발 위에 정성스럽게 달인 육수를 붓고 양념장을 얹어 준다. 돼지국밥은 약재를 넣어 끓여서 냄새가 나지 않고 고기를 듬뿍 얹어 준다. 국밥이 뜨거울 때 부추를 넣고 기호에 맞게 청양고추를 넣어 먹으면 된다.",
      "zh-TW": "가야밀면돼지국밥 일산본점은 일산 대화동 킨텍스 건너편에 있는 밀면, 돼지국밥 맛집이다. 가게 앞에 3~4대 정도의 주차 공간이 있다. 본관 옆에 신관 건물도 있어서 둘 중 편한 곳으로 자리 잡으면 된다. 이곳은 밀면이 유명하지만, 돼지국밥이나 고기국수도 맛있다. 밀면을 주문하면 굵고 쫄깃한 면발 위에 정성스럽게 달인 육수를 붓고 양념장을 얹어 준다. 돼지국밥은 약재를 넣어 끓여서 냄새가 나지 않고 고기를 듬뿍 얹어 준다. 국밥이 뜨거울 때 부추를 넣고 기호에 맞게 청양고추를 넣어 먹으면 된다.",
    },
    meta: { updated_at: "2026-09-02" },
    sections: [], access: [], know: [],
    ko_card: [{ name_ko: "가야밀면돼지국밥 일산본점", address_ko: "경기도 고양시 일산서구 호수로856번길 8-9 (대화동)" }],
    map: [{ lat: 37.6708852204, lng: 126.748641831, label: "가야밀면돼지국밥 일산본점" }],
    credits: [], related: [],
    info: { hours: "varies", duration: "1_2h", admission: "varies", access: "inquiry" },
    highlights: [],
    adSlot: null,
    best_selected: false,
    tourapi: { contentid: "2891928", overview_ko: "가야밀면돼지국밥 일산본점은 일산 대화동 킨텍스 건너편에 있는 밀면, 돼지국밥 맛집이다. 가게 앞에 3~4대 정도의 주차 공간이 있다. 본관 옆에 신관 건물도 있어서 둘 중 편한 곳으로 자리 잡으면 된다. 이곳은 밀면이 유명하지만, 돼지국밥이나 고기국수도 맛있다. 밀면을 주문하면 굵고 쫄깃한 면발 위에 정성스럽게 달인 육수를 붓고 양념장을 얹어 준다. 돼지국밥은 약재를 넣어 끓여서 냄새가 나지 않고 고기를 듬뿍 얹어 준다. 국밥이 뜨거울 때 부추를 넣고 기호에 맞게 청양고추를 넣어 먹으면 된다." },
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
