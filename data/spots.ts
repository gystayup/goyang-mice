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
  /**
   * 오더 #H2 [1]: 챕터 body 아래 인라인 사진 경로 (예: /images/history/xxx.jpg).
   *   없으면 렌더 스킵. 값 없이 필드만 두면 텍스트만 노출.
   */
  image?: string;
  /**
   * 오더 #H2 [1]: image 크레딧 문자열 (예: "출처: 한국관광공사 공공누리 제1유형").
   *   image 가 있고 이 값이 있을 때만 캡션 렌더.
   */
  image_credit?: string;
}

export interface SpotStoriesHeader {
  /** 5로케일 부제 (섹션 title 은 THE STORY 로 하드코딩). */
  title: I18nText;
  lead: I18nText;
  /**
   * 오더 #H2 [1]: 서사 상단 대표 사진 경로 (예: /images/history/xxx.jpg).
   *   없으면 텍스트만 렌더 (기존 동작 유지).
   */
  hero_image?: string;
  /** 오더 #H2 [1]: hero_image 크레딧 문자열. */
  hero_image_credit?: string;
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
  /** 오더 #REV1 [3]: 원본 md 에 note 가 있으면 tag 밑 부기. 없으면 생략. */
  note?: I18nText;
}

export interface SpotNearby {
  /** 5로케일 공통 영문 (예: "AROUND KINTEX") */
  eyebrow: string;
  title: I18nText;
  /** 오더 #REV1 [3]: 원본 md 에 lead 값이 없는 경우가 있어 optional 완화. */
  lead?: I18nText;
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

/**
 * 오더 #REV1 [4]: food 카테고리 데이터 태그. 카테고리 구조·배지·네비·필터 UI 는
 *   이번에 건드리지 않음. 값: "restaurant" 레스토랑/맛집 · "drink" 커피·전통주·수제맥주 등.
 */
export type SpotFoodSubtype = "restaurant" | "drink";

// 오더 #C20 [1]: 미식 허브 큐레이션 (밤리단길 전용).
//
// FOOD 10 + CAFE 8 = TourAPI 공공데이터 등재분 (contentid 명시).
// NIGHT = 기존 spot slug 재사용 (야경 스팟 재정의, F&B 아닌 야간 산책 묶음).
// COURSES = 2h/4h 도보 동선 (waypoints = FoodHubItem id 참조).
//
// 규범: §5-4 공공데이터만. 창작 금지. overview 첫 문장만 이식 (원문).
export interface SpotFoodHubItem {
  /** 원자 id (외부 참조용, kebab-case). TourAPI contentid 가 primary source. */
  id: string;
  /** TourAPI contentid (§5-4 크레딧 표기용). */
  contentid: string;
  /** 상호명 (5로케일 · 한글 원문 유지, 다른 로케일은 ko 폴백). */
  title: I18nText;
  /** 도로명 주소 (TourAPI addr1 원문). ko 만 사용 · 5로케일 폴백. */
  addr_ko: string;
  /** overview 첫 문장 (5로케일 ko 폴백). 창작 금지 · TourAPI 원문 발췌만. */
  first_sentence: I18nText;
  /** TourAPI mapx/mapy 좌표 (길찾기 CTA URL 생성용). */
  lat: number;
  lng: number;
  /** TourAPI homepage (있으면 외부 링크 · 없으면 미렌더). */
  homepage?: string;
  /** TourAPI tel (있으면 tel: 링크 · 없으면 미렌더). */
  tel?: string;
}
export interface SpotFoodHubCourse {
  /** 코스 키 (예: "2h", "4h"). */
  key: "2h" | "4h";
  /** 소요 시간 라벨 (5로케일 · 예: "2시간 코스 · 약 1.5 km"). */
  label: I18nText;
  /** 코스 경유지 (SpotFoodHubItem.id 또는 spot slug 참조 · 순서대로). */
  stops: string[];
}
export interface SpotFoodHub {
  /** 섹션 헤드라인 (5로케일). 예: "밤리단길 미식 허브". */
  headline: I18nText;
  /** 서브 카피 (5로케일). 사장님 원문 or overview 발췌. */
  subhead: I18nText;
  /** FOOD 10 (TourAPI 공공데이터 등재분). */
  food: SpotFoodHubItem[];
  /** CAFE 8 (TourAPI 공공데이터 등재분). */
  cafe: SpotFoodHubItem[];
  /**
   * NIGHT — 기존 spot slug 재사용 (야경 스팟 재정의).
   *   신규 F&B 스팟 생성 없음 · 유흥 제외 · 야간 산책 묶음.
   *   각 항목: slug (spots.ts 참조) + 야간 소구 한 줄 (5로케일).
   */
  night: Array<{ slug: string; note: I18nText }>;
  /** COURSES (2h · 4h). stops 는 foodHub.food/cafe 의 id 또는 spot slug. */
  courses: SpotFoodHubCourse[];
  /** §5-4 크레딧 라벨 (5로케일). 예: "출처: 한국관광공사 공공데이터포털". */
  credit: I18nText;
}

export interface Spot {
  slug: string;
  category: SpotCategory;
  type: SpotType;
  /** 오더 #REV1 [4]: food 카테고리 데이터 태그 (restaurant/drink). food 외 카테고리는 미사용. */
  subtype?: SpotFoodSubtype;
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
  /**
   * 오더 #V1 [1]: 상세 페이지 Location 섹션 전화번호 (예: "+82 31 XXX XXXX").
   *   값 있을 때만 tel: 링크 렌더. 없으면 전화 줄 스킵.
   */
  phone?: string;
  /**
   * 오더 #V1 [1]: 상세 페이지 Location 지도 임베드용 iframe src URL.
   *   값 있으면 우선 사용. 없고 map[0].lat/lng 있으면 OSM 임베드 자동 생성.
   *   둘 다 없으면 카카오 지도 CTA 외부 링크만 렌더.
   */
  map_embed?: string;
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
  /**
   * 오더 #C20 [1]: 미식 허브 큐레이션 (밤리단길 전용 · 다른 스팟 미소비).
   *   FOOD·CAFE·NIGHT·COURSES 서브 컬렉션. 개별 F&B 는 spots.ts 스팟 신설
   *   대신 nearby/큐레이션 리스트 형태. TourAPI 공공데이터 등재분만
   *   (§5-4 준수). 창작·의역 금지 · overview 첫 문장만 이식.
   */
  foodHub?: SpotFoodHub;
  /**
   * 오더 #C54: admin 노출 여부 토글. false 면 프론트에서 필터링 (미노출).
   *   undefined/true → 노출. 기존 정적 배열 무영향 (optional).
   */
  published?: boolean;
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
    // 오더 #D3 [3] 도입 · #C35 [2] 사장님 교체분 (전체 새 사진, 자체 소스): 4·5·6·7 로 갤러리 전량 교체.
    //   4 (940×627): 봄 벚꽃 정자 섬 항공뷰
    //   5 (940×627): 나무 다리 산책 · 도시 스카이라인 (저녁)
    //   6 (940×627): 호수 항공뷰 · 도시 스카이라인 · 산 배경
    //   7 (560×375): 노래하는분수대 야경 (원본 크기 · upscale 안 함)
    //   credit 미설정 (자체 소스). cpyrht 미지정 → Type1 취급(크롭 그리드 렌더 대상).
    gallery: [
      { url: "/images/spots/ilsan-lake-park-4.jpg" },
      { url: "/images/spots/ilsan-lake-park-5.jpg" },
      { url: "/images/spots/ilsan-lake-park-6.jpg" },
      { url: "/images/spots/ilsan-lake-park-7.jpg" },
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
    // 오더 #V4 [1] B안: TourAPI overview_ko 원문 이식. 문장 사이 문단 분리만.
    sections: [
      {
        heading: { ko: "소개", en: "About", ja: "紹介", "zh-CN": "介绍", "zh-TW": "介紹" },
        body: {
          ko: "고양시 일산지역에 위치한 정발산은 해발 90m가 되지 않는 야트막한 산이다.\n\n오래전 이 일대에 정 씨와 박 씨가 살아 정박산이 되었다가 후에 정발산이 되었다는 유래가 있다.\n\n일산호수공원과 가까이 있어 산책을 하거나 데이트하기 좋고, 배드민턴장과 도서관, 전망대를 갖추고 있다.\n\n산이라고 하지만 아이들도 즐길 수 있을 만큼 낮은 언덕으로 이루어진 공원이다.",
          en: "Jeongbalsan is a low hill in the Ilsan district of Goyang, standing under 90 m above sea level.\n\nThe name is said to come from families surnamed Jeong and Park who once lived at its foot — first called Jeongbaksan, later softened to Jeongbalsan.\n\nIt sits close to Ilsan Lake Park, which makes it good for walks and dates, and the site includes badminton courts, a library, and an observation deck.\n\nDespite the word \"mountain\" in its name, it is a park of low hills — flat enough that even children can enjoy the climb.",
          ja: "高陽市一山地区に位置する鼎鉢山（チョンバルサン）は海抜90mに満たない、なだらかな山です。\n\nかつてこの一帯に鄭氏と朴氏が暮らしていたことから鼎泊山と呼ばれ、後に鼎鉢山になったという由来があります。\n\n一山湖水公園に近く、散歩やデートに最適で、バドミントンコート・図書館・展望台を備えています。\n\n「山」とはいえ、子どもも楽しめるほどの低い丘で構成された公園です。",
          "zh-CN": "鼎钵山（Jeongbalsan）位于高阳市一山区，是一座海拔不到90米的低矮小山。\n\n据说昔日此地郑氏与朴氏聚居，故名「鼎泊山」，后演变为「鼎钵山」。\n\n紧邻一山湖水公园，适合散步与约会，园内设有羽毛球场、图书馆和观景台。\n\n虽名为「山」，实为低缓的丘陵组成的公园，连小朋友都能轻松游玩。",
          "zh-TW": "鼎缽山（Jeongbalsan）位於高陽市一山區，是一座海拔不到90公尺的低矮小山。\n\n據說昔日此地鄭氏與朴氏聚居，故名「鼎泊山」，後演變為「鼎缽山」。\n\n緊鄰一山湖水公園，適合散步與約會，園內設有羽毛球場、圖書館和觀景台。\n\n雖名為「山」，實為低緩的丘陵組成的公園，連小朋友都能輕鬆遊玩。",
        },
      },
    ],
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
    // 오더 #V4 [1] B안: TourAPI overview_ko 원문 이식. 문장 사이 문단 분리만.
    sections: [
      {
        heading: { ko: "소개", en: "About", ja: "紹介", "zh-CN": "介绍", "zh-TW": "介紹" },
        body: {
          ko: "행주산성은 경기도 고양시 덕양구 행주내동 덕양산의 7, 8부 능선에 쌓은 테뫼식[山頂式] 성으로 흙을 이용해서 쌓은 산성이다.\n\n덕양산 정상부를 에워싼 소규모의 내성[內城]과 북쪽으로 뻗은 골짜기를 에워싼 외성[外城]의 이중구조로 강안의 험한 절벽을 이용하고 동, 북, 서로 전개된 넓은 평야를 감싸고 있다.\n\n성안에서는 삼국시대의 적갈색 연질 토기와 회청색 경질토기 등의 조각을 비롯하여 어골문[魚骨文], 수지문[手指文]이 새겨진 기왓조각도 발견되고 있어 고려 시대까지도 사용된 것으로 보인다.\n\n임진왜란 당시 권율[權慄] 장군이 의병과 승명을 포함한 2천3백 명과 함께 왜군 3만여 명을 크게 물리쳤다.\n\n왜군을 격파하여 나라를 위기에서 벗어나게 하는데 큰 공을 세운 충장공 권율 도원수의 행주대첩을 기념하기 위한 매년 제례행사와 그 밖의 여러 가지 문화 행사가 개최되고 있다.\n\n권율 도원수의 영정이 모셔져 있는 충장사에서 행해지는 이 제례에는 장군의 영혼을 불러들이기 위해 향을 피우고 제례를 지낸다.\n\n선조들의 나라 사랑하는 마음과 지혜를 배울 수 있는 곳이다.",
          en: "Haengjusanseong Fortress is a hilltop-style earthen fortress built along the 7th to 8th ridge lines of Deogyangsan Mountain in Haengju-nae-dong, Deokyang-gu, Goyang-si, Gyeonggi-do.\n\nIt has a double-ring structure — a small inner wall enclosing Deogyangsan's summit, and an outer wall enclosing a valley extending to the north. It uses the steep cliffs on the riverside and wraps the broad plains that open to the east, north, and west.\n\nInside the walls, potsherds have been found — reddish-brown soft ware and blue-gray hard ware from the Three Kingdoms period, together with roof-tile fragments bearing fish-bone (eogolmun) and finger-mark (sujimun) patterns — suggesting that the fortress remained in use through the Goryeo period.\n\nDuring the Imjin War, General Gwon Yul (權慄), leading some 2,300 troops including righteous militia and monk-soldiers, dealt a major defeat to a Japanese force of about 30,000.\n\nTo commemorate the Battle of Haengju (Haengju Daecheop) — the great feat of Chungjanggong Gwon Yul, who broke the Japanese and pulled the country back from the brink — annual memorial rites and other cultural events are held here.\n\nThe rite, held at Chungjangsa Shrine, which enshrines Gwon Yul's portrait, burns incense to summon the general's spirit and offers a formal ceremony.\n\nIt is a place to learn the love of country and the wisdom of our ancestors.",
          ja: "幸州山城は京畿道高陽市徳陽区幸州内洞（ヘンジュネドン）の徳陽山（トギャンサン）7・8合目の稜線に築かれた「テモイ式（山頂式）」の城で、土を用いて築かれた山城です。\n\n徳陽山の山頂部を取り囲む小規模な内城［內城］と、北へ延びる谷を取り囲む外城［外城］の二重構造となっており、川岸の険しい断崖を利用し、東・北・西へ広がる平野を包み込んでいます。\n\n城内からは、三国時代の赤褐色軟質土器や灰青色硬質土器の破片のほか、魚骨文［魚骨文］や手指文［手指文］が刻まれた瓦片も見つかっており、高麗時代まで使われたと考えられています。\n\n壬辰倭乱の際、権慄（クォン・ユル／權慄）将軍が義兵と僧兵を含む2,300名とともに、日本軍3万余名を大きく撃退しました。\n\n日本軍を打ち破り国を危機から救った忠壮公・権慄都元帥の幸州大捷を記念して、毎年の祭礼行事のほか、さまざまな文化行事が催されています。\n\n権慄都元帥の御影が奉安されている忠壮祠（チュンジャンサ）で行われるこの祭礼では、将軍の魂を招くために香を焚き、儀式を執り行います。\n\n先祖たちの祖国愛と知恵に学べる場所です。",
          "zh-CN": "幸州山城位于京畿道高阳市德阳区幸州内洞德阳山7、8分山脊上，是一座以土筑成、属「山顶式（테뫼식）」的山城。\n\n采用双重结构：环绕德阳山山顶的小型内城［內城］，与环绕向北延伸山谷的外城［外城］，利用江岸险峻悬崖，环抱向东、北、西展开的宽阔平原。\n\n城内曾出土三国时代的红褐色软质陶器与灰青色硬质陶器碎片，以及刻有鱼骨纹［魚骨文］、手指纹［手指文］的瓦片，推测使用至高丽时代。\n\n壬辰倭乱期间，权慄（Gwon Yul／權慄）将军率义兵与僧兵在内的2,300余人，大破日军3万余人。\n\n为纪念击破日军、拯救国家于危难的忠壮公权慄都元帅之幸州大捷，每年在此举行祭礼与多项文化活动。\n\n在供奉权慄都元帅遗像的忠壮祠举行的祭礼中，会焚香召请将军英灵并行祭。\n\n此处是学习先祖爱国之心与智慧的场所。",
          "zh-TW": "幸州山城位於京畿道高陽市德陽區幸州內洞德陽山7、8分山脊上，是一座以土築成、屬「山頂式（테뫼식）」的山城。\n\n採用雙重結構：環繞德陽山山頂的小型內城［內城］，與環繞向北延伸山谷的外城［外城］，利用江岸險峻懸崖，環抱向東、北、西展開的寬闊平原。\n\n城內曾出土三國時代的紅褐色軟質陶器與灰青色硬質陶器碎片，以及刻有魚骨紋［魚骨文］、手指紋［手指文］的瓦片，推測使用至高麗時代。\n\n壬辰倭亂期間，權慄（Gwon Yul／權慄）將軍率義兵與僧兵在內的2,300餘人，大破日軍3萬餘人。\n\n為紀念擊破日軍、拯救國家於危難的忠壯公權慄都元帥之幸州大捷，每年在此舉行祭禮與多項文化活動。\n\n在供奉權慄都元帥遺像的忠壯祠舉行的祭禮中，會焚香召請將軍英靈並行祭。\n\n此處是學習先祖愛國之心與智慧的場所。",
        },
      },
    ],
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
      // 오더 #C9: Type1 확장 3장 추가 (총 6장).
      { url: "/images/spots/haengju-fortress-4.jpg", credit: "출처: 한국관광공사 (공공누리 제1유형)", cpyrht: "Type1" },
      { url: "/images/spots/haengju-fortress-5.jpg", credit: "출처: 한국관광공사 (공공누리 제1유형)", cpyrht: "Type1" },
      { url: "/images/spots/haengju-fortress-6.jpg", credit: "출처: 한국관광공사 (공공누리 제1유형)", cpyrht: "Type1" },
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
    // 오더 #C3 [1]: 사장님 확정 소개글 원문 이식 (about-19-spots.md). 창작·의역 0. 5로케일 ko 폴백.
    sections: [
      {
        heading: { ko: "소개", en: "About", ja: "紹介", "zh-CN": "介绍", "zh-TW": "介紹" },
        body: {
          ko: "이름의 '창릉'은 근처 서오릉의 창릉(예종과 안순왕후의 능)에서 왔다. 왕의 능 곁을 흐르던 물길이 지금은 덕양구를 가로지르는 평지 산책로가 됐다.\n\n오르막 없이 물 따라 걷는 완만한 길이라, 가볍게 걷고 싶은 날이나 자전거를 타는 사람에게 맞다. 도심과 왕릉 숲을 잇는 조용한 초록 축이다.",
          en: "The name \"Changneung\" comes from the nearby Changneung tomb at Seooreung — the resting place of King Yejong and Queen Ansun. The stream that once flowed past the royal tomb has become a flat walking path crossing Deogyang-gu.\n\nWith no climbs and only the water to follow, it suits days for an easy walk or a cyclist's ride. It is a quiet green thread linking the city center and the royal-tomb forest.",
          ja: "「昌陵」の名は、近くの西五陵にある昌陵（睿宗と安順王后の陵）に由来します。かつて王の陵の傍らを流れていた水路は、いまでは徳陽区を横切る平坦な散歩道となりました。\n\n登りがなく水辺に沿って歩けるなだらかな道で、軽く散歩したい日や自転車を楽しむ方に向いています。都心と王陵の森をつなぐ、静かな緑の軸です。",
          "zh-CN": "「昌陵」之名源自附近西五陵中的昌陵——睿宗与安顺王后的陵墓。曾流经王陵旁的水道，如今成为横贯德阳区的平地步道。\n\n沿水而行、无坡度的缓路，适合想轻松散步的日子，也适合骑行者。它是连接市中心与王陵林的一条安静绿轴。",
          "zh-TW": "「昌陵」之名源自附近西五陵中的昌陵——睿宗與安順王后的陵墓。曾流經王陵旁的水道，如今成為橫貫德陽區的平地步道。\n\n沿水而行、無坡度的緩路，適合想輕鬆散步的日子，也適合騎行者。它是連接市中心與王陵林的一條安靜綠軸。",
        },
      },
    ],
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
      ko: "넷플릭스가 아니라, 진짜 왕이 잠든 곳",
      en: "Not a Netflix set — the real kings rest here",
      ja: "Netflixのセットではない、本物の王が眠る場所",
      "zh-CN": "不是 Netflix 的布景，是真正的王长眠之地",
      "zh-TW": "不是 Netflix 的佈景，是真正的王長眠之地",
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
    // 오더 #V4 [1] B안: TourAPI overview_ko 원문 이식. 문장 사이 문단 분리만.
    // 오더 #C7 [A]: 사장님 확정 About + subtitle 재이식 (글로벌 각색). 5로케일 ko 폴백. onScreen·다른 필드 무터치.
    sections: [
      {
        heading: { ko: "소개", en: "About", ja: "紹介", "zh-CN": "介绍", "zh-TW": "介紹" },
        body: {
          ko: "당신이 정주행한 그 드라마의 왕과 왕비가, 여기 진짜로 누워 있다.\n\n서오릉은 2009년 유네스코 세계유산에 오른 조선왕릉이다. 한국의 조선왕릉 40기가 한꺼번에 세계유산에 등재된, 지구상에 이런 규모의 왕실 능묘군은 흔치 않다. 그 대표적인 한 곳이 서울이 아니라 고양에 있다.\n\n이곳에 잠든 이름을 부르는 순간 사극 팬은 소름이 돋는다. 숙종, 인현왕후, 그리고 희빈 장씨. 《동이》(2010)와 《장옥정, 사랑에 살다》(2013)가 수백만 명을 울리고 웃긴 그 삼각의 주인공들이, 배우가 아니라 진짜 그 사람으로 명릉과 대빈묘에 누워 있다. 영화 《사도》(2015)의 그 비극도, 《인수대비》(2011)의 그 서슬 퍼런 인수대비(소혜왕후)의 경릉도 전부 이 숲 안이다.\n\n세트가 아니다. 소품이 아니다. 화면 속 그 인물들의 진짜 무덤이다. 500년 넘게 끊기지 않은 왕실 제례가 지금도 여기서 올려진다.\n\n그리고 한복을 입으면 입장료가 공짜다. 입구에서 한복을 빌려(유료 대여) 왕조의 시간 속으로 걸어 들어간다. 3호선 원당역·6호선 역촌역/구산역에서 9701번 「서오릉입구」 하차.",
          en: "The kings and queens from the drama you binge-watched are really lying here.\n\nSeooreung Royal Tombs is a Joseon royal-tomb site inscribed on the UNESCO World Heritage List in 2009. Korea's 40 Royal Tombs of the Joseon Dynasty were inscribed together, and a royal burial ensemble of this scale is rare on earth. One of its foremost sites lies not in Seoul but in Goyang.\n\nCall the names of those resting here, and any historical-drama fan feels a chill. King Sukjong, Queen Inhyeon, and Consort Jang Hui-bin — the triangle at the heart of Dong Yi (2010) and Jang Ok-jung, Live for Love (2013), which moved millions to tears and laughter — lie at Myeongneung and Daebinmyo, not as actors but as the real people. The tragedy of the film The Throne (Sado, 2015) is here, and so is Gyeongneung, tomb of the formidable Queen Insoo (Queen Sohye) of the series Queen Insoo (2011). All within this forest.\n\nNo set. No prop. These are the real graves of the figures on your screen. Royal ancestral rites, unbroken for more than five hundred years, are still offered here.\n\nAnd admission is free if you come in hanbok. Rent a hanbok at the entrance (paid rental) and step into the dynasty's own time. From Wondang Station (Line 3) or Yeokchon / Gusan Stations (Line 6), take Bus 9701 and get off at \"Seooreung Entrance.\"",
          ja: "あなたが一気見したあのドラマの王と王妃が、ここに本当に眠っています。\n\n西五陵は2009年にユネスコ世界遺産に登録された朝鮮王陵です。韓国の朝鮮王陵40基が一括で世界遺産に登録され、地球上でこれほどの規模の王室墓群は稀です。その代表的な一か所が、ソウルではなく高陽（コヤン）にあります。\n\nここに眠る名を口にすれば、時代劇ファンは鳥肌が立ちます。粛宗、仁顕王后、そして禧嬪張氏。『トンイ』（2010）と『チャン・オクチョン、愛に生きる』（2013）で数百万を泣かせ笑わせた三角の主人公たちが、俳優ではなく本人として明陵と大嬪墓に眠っています。映画『王の運命 —歴史を変えた八日間—』（原題：思悼、2015）のあの悲劇も、『仁粋大妃』（2011）の凛とした仁粋大妃（昭恵王后）の敬陵も、すべてこの森の中にあります。\n\nセットではありません。小道具でもありません。画面のあの人物たちの本当の墓です。500年以上途切れていない王室の祭礼が、今もここで営まれています。\n\nそして韓服（ハンボク）を着ると入場料は無料です。入口で韓服を借り（有料レンタル）、王朝の時間の中へ歩き入ります。3号線・元堂（ウォンダン）駅／6号線・駅村（ヨクチョン）駅・亀山（クサン）駅から9701番に乗り、「西五陵入口」で下車します。",
          "zh-CN": "你追完的那部剧里的国王与王妃，真的就长眠在这里。\n\n西五陵是2009年列入联合国教科文组织世界遗产名录的朝鲜王陵。韩国的40座朝鲜王陵一并登录为世界遗产，如此规模的王室陵墓群在世界上并不多见。其代表之一并不在首尔，而在高阳。\n\n只要念出安葬于此的名字，古装剧粉丝便会寒毛直竖。肃宗、仁显王后与禧嫔张氏——让数百万观众为之落泪与欢笑的《同伊》（2010）与《张玉贞，为爱而生》（2013）的三角主角，不是演员，而是本人，安睡于明陵与大嫔墓。电影《思悼》（2015）的那段悲剧，以及《仁粹大妃》（2011）中凛然的仁粹大妃（昭惠王后）的敬陵，亦皆在这片林间。\n\n这不是布景，也不是道具。是屏幕上那些人物真正的墓。延续五百余年不曾中断的王室祭礼，如今仍在此举行。\n\n身着韩服则免费入场。可在入口处租借韩服（付费租借），走进王朝的时间。可从3号线元堂站或6号线驿村站／龟山站搭乘9701路，在「西五陵入口」下车。",
          "zh-TW": "你追完的那部劇裡的國王與王妃，真的就長眠在這裡。\n\n西五陵是2009年列入聯合國教科文組織世界遺產名錄的朝鮮王陵。韓國的40座朝鮮王陵一併登錄為世界遺產，如此規模的王室陵墓群在世界上並不多見。其代表之一並不在首爾，而在高陽。\n\n只要唸出安葬於此的名字，古裝劇粉絲便會寒毛直豎。肅宗、仁顯王后與禧嬪張氏——讓數百萬觀眾為之落淚與歡笑的《同伊》（2010）與《張玉貞，為愛而生》（2013）的三角主角，不是演員，而是本人，安睡於明陵與大嬪墓。電影《思悼》（2015）的那段悲劇，以及《仁粹大妃》（2011）中凜然的仁粹大妃（昭惠王后）的敬陵，亦皆在這片林間。\n\n這不是佈景，也不是道具。是螢幕上那些人物真正的墓。延續五百餘年不曾中斷的王室祭禮，如今仍在此舉行。\n\n身著韓服則免費入場。可在入口處租借韓服（付費租借），走進王朝的時間。可從3號線元堂站或6號線驛村站／龜山站搭乘9701路，在「西五陵入口」下車。",
        },
      },
    ],
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
      // 오더 #C9: Type1 확장 3장 추가 (능침 다양성·정자각+능·소나무 숲길).
      { url: "/images/spots/seooreung-4.jpg", credit: "출처: 한국관광공사 (공공누리 제1유형)", cpyrht: "Type1" },
      { url: "/images/spots/seooreung-5.jpg", credit: "출처: 한국관광공사 (공공누리 제1유형)", cpyrht: "Type1" },
      { url: "/images/spots/seooreung-6.jpg", credit: "출처: 한국관광공사 (공공누리 제1유형)", cpyrht: "Type1" },
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
      ko: "《미스터 퀸》의 그 왕비가 실제로 잠든 곳",
      en: "Where the queen from Mr. Queen actually rests",
      ja: "『ミスター・クイーン(Mr. Queen)』のあの王妃が実際に眠る場所",
      "zh-CN": "《哲仁王后》里那位王妃真正长眠的地方",
      "zh-TW": "《哲仁王后》裡那位王妃真正長眠的地方",
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
    // 오더 #V4 [1] B안: TourAPI overview_ko 원문 이식. 문장 사이 문단 분리만.
    // 오더 #C7 [A]: 사장님 확정 About + subtitle 재이식 (글로벌 각색). 5로케일 ko 폴백. onScreen·다른 필드 무터치.
    sections: [
      {
        heading: { ko: "소개", en: "About", ja: "紹介", "zh-CN": "介绍", "zh-TW": "介紹" },
        body: {
          ko: "넷플릭스는 세트를 지었다. 고양은 진짜를 가졌다.\n\n세계 어느 궁궐을 가든 당신이 보는 건 '건물'이다. 왕이 앉았던 자리, 걸었던 복도 — 훌륭하지만 결국 돌과 나무다. 고양의 서삼릉은 다르다. 여기엔 진짜 왕과 왕비가, 지금 이 순간에도 이 땅 아래 잠들어 있다. 재현이 아니라 실재. 관광지가 아니라 그들의 유물 그 자체다.\n\n그리고 이 이름들 앞에서 K-드라마 팬은 숨이 멎는다. 넷플릭스에서 비영어권 세계 7위에 오른 《철인왕후 (Mr. Queen)》(2020) — 그 왕비 철인왕후와 철종이, 픽션이 아니라 실존 인물로 이곳 예릉에 누워 있다. 화면에서 웃고 울던 그 사람이, 여기 능 아래 진짜 있었다.\n\n그게 전부가 아니다. 《여인천하》(2001)가 그린 권력의 화신 장경왕후(희릉), 《올빼미》(2022)와 《연인》(2023)이 눈물로 그려낸 비운의 소현세자(소경원)까지 — 《킹덤》 이래 전 세계를 사로잡은 한국 사극의 주인공들이, 한 명도 아니고 떼로 이 숲에 잠들어 있다. 세계 어디에도 없는, 드라마와 실제 역사가 포개진 성지다.\n\n이 모든 것이 2009년 유네스코 세계유산에 오른 조선왕릉이다. 스크린에서 만난 그들을, 이제 유네스코가 인증한 진짜 무덤 앞에서 만난다.\n\n압권은 이거다 — 한복을 입으면 입장료가 공짜다. 입구에서 한복을 빌려 갈아입고(유료 대여), 500년 전 왕조의 후예가 된 채로 능침 사이 소나무 숲을 걷는다. 픽션이 끝나는 자리에서, 진짜 역사가 시작된다.",
          en: "Netflix built the set. Goyang has the real thing.\n\nGo to any palace in the world and what you see is a building. Where the king sat, the corridor he walked — impressive, but stone and wood in the end. Seosamneung in Goyang is different. Real kings and queens lie under this ground, at this very moment. Not a re-enactment but the real thing. Not a tourist site — the artefact itself.\n\nAt these names, K-drama fans lose their breath. Mr. Queen (2020), which reached No. 7 worldwide on Netflix's non-English chart — the queen Cheorin and King Cheoljong from that show lie here at Yereung, not as fiction but as real people. That very person who laughed and cried on screen was really here, under this tomb.\n\nThat is not all. Queen Janggyeong, the incarnation of power drawn in Ladies of the Palace (2001), rests at Huireung; the tragic Crown Prince Sohyeon, painted through tears in The Night Owl (2022) and My Dearest (2023), lies at Sogyeongwon. From Kingdom onward, the protagonists of the Korean historical dramas that seized the world sleep here — not one, but a whole cluster of them. It is a sanctuary where drama and real history overlap, one you will find nowhere else in the world.\n\nAll of this is part of the Royal Tombs of the Joseon Dynasty, inscribed on the UNESCO World Heritage List in 2009. The people you met on screen you now meet at their real, UNESCO-recognised graves.\n\nThe kicker — admission is free if you come in hanbok. Rent a hanbok at the entrance and change into it (paid rental), then walk through the pine woods between the tombs as an heir of a 500-year-old dynasty. Where fiction ends, real history begins.",
          ja: "Netflixはセットを建てました。高陽（コヤン）は本物を持っています。\n\n世界のどの宮殿へ行っても、あなたが見るのは「建物」です。王が座った場所、歩いた廊下——立派ですが、結局は石と木です。高陽の西三陵は違います。ここには本物の王と王妃が、今この瞬間もこの地の下に眠っています。再現ではなく実在。観光地ではなく、彼らそのものの遺物です。\n\nこの名前の前でK-ドラマファンは息を呑みます。Netflix非英語圏で世界7位に上った『哲仁王后（Mr. Queen）』（2020）——その王妃・哲仁王后と哲宗が、フィクションではなく実在の人物としてここ睿陵（イェルン）に眠っています。画面で笑い、泣いていたあの人が、この陵の下に本当にいたのです。\n\nそれだけではありません。『女人天下』（2001）が描いた権力の化身・章敬王后（禧陵）、『梟 —フクロウの目撃者—』（原題：올빼미、2022）と『恋人（原題：연인）』（2023）が涙で描いた悲運の昭顕世子（昭慶園）まで——『キングダム（Kingdom）』以来、世界を魅了した韓国時代劇の主人公たちが、一人ではなく群れをなしてこの森に眠っています。世界のどこにもない、ドラマと実際の歴史が重なる聖地です。\n\nこれらすべてが、2009年にユネスコ世界遺産に登録された朝鮮王陵です。スクリーンで出会った彼らを、いまユネスコ公認の本物の墓の前で出会います。\n\n極めつけはこれ——韓服（ハンボク）を着ると入場料は無料です。入口で韓服を借りて着替え（有料レンタル）、500年前の王朝の末裔になって陵の間の松林を歩きます。フィクションが終わる場所で、本物の歴史が始まります。",
          "zh-CN": "Netflix搭建了布景。高阳拥有真正的本尊。\n\n无论走进世界哪座宫殿，你看到的都是「建筑」。王曾坐过的位置、走过的廊道——固然精彩，终究是石与木。高阳的西三陵不同。这里，真正的国王与王后此刻正长眠于地下。不是重现，而是实存。不是景点，而是他们本身的遗迹。\n\n面对这些名字，K-剧粉丝会为之屏息。曾冲上Netflix非英语圈全球第七位的《哲仁王后（Mr. Queen）》（2020）——那位哲仁王后与哲宗，并非虚构，而是真实存在的人物，长眠于此地的睿陵。屏幕上或笑或泣的那个人，此刻就真真切切地在这陵下。\n\n还不止如此。《女人天下》（2001）描绘的权力化身章敬王后（禧陵），《猫头鹰》（올빼미，2022）与《恋人》（연인，2023）以泪水刻画的悲运昭显世子（昭庆园）——自《王国（Kingdom）》以来征服世界的韩国古装剧主角，成群地长眠于此。这是世界上独一无二、剧集与真实历史重叠的圣地。\n\n上述一切都是2009年列入联合国教科文组织世界遗产的朝鲜王陵。曾在屏幕上相遇的他们，如今可在获联合国教科文组织认定的真陵前相见。\n\n最令人惊艳的是——身着韩服可免费入场。在入口租借并换上韩服（付费租借），化身500年前王朝的后裔，穿行陵寝间的松林。在虚构结束的地方，真实的历史才刚开始。",
          "zh-TW": "Netflix搭建了佈景。高陽擁有真正的本尊。\n\n無論走進世界哪座宮殿，你看到的都是「建築」。王曾坐過的位置、走過的廊道——固然精彩，終究是石與木。高陽的西三陵不同。這裡，真正的國王與王后此刻正長眠於地下。不是重現，而是實存。不是景點，而是他們本身的遺跡。\n\n面對這些名字，K-劇粉絲會為之屏息。曾衝上Netflix非英語圈全球第七位的《哲仁王后（Mr. Queen）》（2020）——那位哲仁王后與哲宗，並非虛構，而是真實存在的人物，長眠於此地的睿陵。螢幕上或笑或泣的那個人，此刻就真真切切地在這陵下。\n\n還不止如此。《女人天下》（2001）描繪的權力化身章敬王后（禧陵），《貓頭鷹》（올빼미，2022）與《戀人》（연인，2023）以淚水刻畫的悲運昭顯世子（昭慶園）——自《屍戰朝鮮（Kingdom）》以來征服世界的韓國古裝劇主角，成群地長眠於此。這是世界上獨一無二、劇集與真實歷史重疊的聖地。\n\n上述一切都是2009年列入聯合國教科文組織世界遺產的朝鮮王陵。曾在螢幕上相遇的他們，如今可在獲聯合國教科文組織認定的真陵前相見。\n\n最令人驚艷的是——身著韓服可免費入場。在入口租借並換上韓服（付費租借），化身500年前王朝的後裔，穿行陵寢間的松林。在虛構結束的地方，真實的歷史才剛開始。",
        },
      },
    ],
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
    // 오더 #C3 [1]: 사장님 확정 소개글 원문 이식 (about-19-spots.md). 창작·의역 0. 5로케일 ko 폴백.
    sections: [
      {
        heading: { ko: "소개", en: "About", ja: "紹介", "zh-CN": "介绍", "zh-TW": "介紹" },
        body: {
          ko: "아파트 숲 한복판에, 150년 된 초가집 한 채가 살아남았다. 일산 신도시가 논밭을 통째로 갈아엎을 때 유일하게 헐리지 않은 조선 후기 농가 — 그게 밤가시초가다.\n\n이름부터 이곳 이야기다. 옛날 이 마을엔 밤나무가 지천이라 '밤가시'라 불렸고, 집도 기둥·대들보·서까래·문틀은 물론 바깥 울타리까지 전부 밤나무로 지었다.\n\n압권은 지붕이다. 중부지방에서 유일한 ㅁ자형 초가로, 네 면의 지붕이 안마당 위로 똬리처럼 둥글게 모인다. 마당 한가운데 서서 위를 올려다보면 지붕 사이로 둥근 하늘이 뻥 뚫려 열린다. 비가 오면 그 원을 따라 낙숫물이 안마당 웅덩이로 떨어지도록 설계됐다. 정발산역·풍산역에서 걸어서 닿는다.",
          en: "In the middle of a forest of apartment blocks, one 150-year-old thatched house has survived. When Ilsan New Town ploughed the fields under, this late-Joseon farmhouse was the only one left standing — that is Bamgasi Thatched House.\n\nThe name itself tells its story. Chestnut trees (bam) once filled this village, giving it the name \"Bamgasi.\" The house too was built entirely of chestnut wood — pillars, main beams, rafters, door frames, even the outer fence.\n\nThe roof is the real showpiece. It is the only ㅁ-shaped (square-plan) thatched house in central Korea, with four sides of roof coiling in a ring above the inner courtyard. Stand in the middle of the courtyard, look up, and a perfect circle of open sky appears between the eaves. When it rains, the design lets the water fall along that circle into a hollow in the courtyard floor. Reachable on foot from Jeongbalsan Stn. or Pungsan Stn.",
          ja: "マンションが並ぶ街の真ん中に、築150年の草葺きの家が一軒残っている。一山新都市が田畑をまるごと造成した際に、唯一取り壊されなかった朝鮮時代後期の農家 — それがバムガシ草家（밤가시초가）だ。\n\n名前からしてこの土地の物語だ。かつてこの一帯には栗の木（밤/バム）が群生し、村は「バムガシ」と呼ばれ、家自体も柱・梁・垂木・門枠、そして外の垣根までことごとく栗材で建てられた。\n\n圧巻は屋根だ。中部地方で唯一のㅁ字型（コの字ではなく四方をふさいだロの字型）草家で、四方の屋根が中庭の上でとぐろのように丸く集まる。中庭の真ん中に立ち上を見上げると、屋根の間から丸い空がぽっかりと開く。雨が降ると、その円に沿って落ちる雨だれが中庭の水受けに落ちるよう設計されている。鼎鉢山（チョンバルサン）駅・楓山（プンサン）駅から徒歩で行ける。",
          "zh-CN": "在公寓林立的街区中央，一栋150年历史的茅草屋幸存下来。当一山新城把田地整个翻新时，唯一未被拆除的朝鲜后期农舍——就是栗刺草屋（밤가시초가）。\n\n连名字都是这里的故事。从前这一带栗子树（밤／bam）成群，村庄被叫作「栗刺」，房屋也从柱、大梁、椽子、门框到院外围栏全用栗木建成。\n\n最引人注目的是屋顶。这是中部地区唯一的ㅁ字形（口字形）草屋，四面屋顶在内院上方如盘绕般聚拢成一个圆。站在院子中央仰望，屋檐之间豁然露出一圈天。设计上，一下雨就沿着这个圆将屋檐水引至院内的接水凹槽。可从鼎钵山（Jeongbalsan）站、枫山（Pungsan）站步行前往。",
          "zh-TW": "在公寓林立的街區中央，一棟150年歷史的茅草屋倖存下來。當一山新城把田地整個翻新時，唯一未被拆除的朝鮮後期農舍——就是栗刺草屋（밤가시초가）。\n\n連名字都是這裡的故事。從前這一帶栗子樹（밤／bam）成群，村莊被叫作「栗刺」，房屋也從柱、大梁、椽子、門框到院外圍欄全用栗木建成。\n\n最引人注目的是屋頂。這是中部地區唯一的ㅁ字形（口字形）草屋，四面屋頂在內院上方如盤繞般聚攏成一個圓。站在院子中央仰望，屋簷之間豁然露出一圈天。設計上，一下雨就沿著這個圓將屋簷水引至院內的接水凹槽。可從鼎缽山（Jeongbalsan）站、楓山（Pungsan）站步行前往。",
        },
      },
    ],
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
    // 오더 #C3 [1]: 사장님 확정 소개글 원문 이식 (about-19-spots.md). 창작·의역 0. 5로케일 ko 폴백.
    sections: [
      {
        heading: { ko: "소개", en: "About", ja: "紹介", "zh-CN": "介绍", "zh-TW": "介紹" },
        body: {
          ko: "덕양구 성사동, 공연장과 얼음판과 수영장이 한 단지에 모인 '고양어울림누리'를 감싼 야외 공간이다. 이곳의 캐치프레이즈가 성격을 말해준다 — \"생활 속의 예술가가 되는 곳\". 세계적 예술가를 모시는 무대(아람누리)와 짝을 이루되, 여기는 아동극·가족극처럼 시민이 직접 참여하는 문화가 중심이다.\n\n그래서 아이와 함께 오기 좋다. 사계절 어는 성사얼음마루 빙상장, 꽃우물수영장, 그리고 어린이 예술영재를 키우는 별따기배움터·어울림미술관까지 — 공연 보고, 스케이트 타고, 잔디밭에서 뛰노는 하루가 한자리에서 된다. 인근 성라공원 숲과도 이어진다.",
          en: "The outdoor grounds wrapped around Goyang Eoullim Nuri in Seongsa-dong, Deogyang-gu — a single complex that holds a theater, an ice rink, and a swimming pool. The venue's own catchphrase captures its spirit: \"a place to become an artist in daily life.\" Paired with Aram Nuri, which hosts world-class artists, this side instead centers on programs the public takes part in — children's theater, family theater, and the like.\n\nThat is why it works well with kids. Between the year-round Seongsa Ice Rink, the Kkotumul Swimming Pool, and Byeolttagi Learning Center and Eoullim Art Museum that nurture young artistic talents — see a show, skate, and run on the lawns, all in one day. It also connects to the nearby Seongla Park forest.",
          ja: "徳陽区城沙洞（ソンサドン）にあり、公演場・スケートリンク・プールが一つの敷地に集まる「高陽オウルリムヌリ」を取り囲む屋外空間です。ここのキャッチフレーズがその性格を物語ります — 「暮らしの中のアーティストになる場所」。世界的アーティストを迎える舞台（アラムヌリ）と対をなしつつ、こちらは児童劇や家族劇のように市民が自ら参加する文化が中心です。\n\nだからこそお子様連れに向いています。四季通じて凍る城沙アイスマル・スケートリンク、コッチュムル水泳場、そして子どもの芸術英才を育てる別ッタギ学び場・オウルリム美術館まで — 公演を観て、スケートを滑り、芝生を駆け回る一日が一か所で完結します。近隣の城羅公園の森ともつながります。",
          "zh-CN": "位于德阳区城沙洞的户外空间，环抱着将演出场馆、冰场与游泳池汇于一园的「高阳和谐世界（Eoullim Nuri）」。这里的宣传语点明了它的性格 — 「成为日常生活中艺术家的地方」。与迎接世界级艺术家的舞台（阿蓝世界 Aram Nuri）成对，而这里以儿童剧、家庭剧等市民亲身参与的文化为核心。\n\n所以特别适合带孩子来。有全年冻结的城沙冰园、花井游泳池，以及培养儿童艺术才能的星摘学堂与和谐美术馆——看演出、滑冰、在草坪上奔跑，一整天可以在一个地方完成。也与附近城罗公园森林相连。",
          "zh-TW": "位於德陽區城沙洞的戶外空間，環抱著將演出場館、冰場與游泳池匯於一園的「高陽和諧世界（Eoullim Nuri）」。這裡的宣傳語點明了它的性格 — 「成為日常生活中藝術家的地方」。與迎接世界級藝術家的舞台（阿藍世界 Aram Nuri）成對，而這裡以兒童劇、家庭劇等市民親身參與的文化為核心。\n\n所以特別適合帶孩子來。有全年冰凍的城沙冰園、花井游泳池，以及培養兒童藝術才能的星摘學堂與和諧美術館——看演出、滑冰、在草坪上奔跑，一整天可以在一個地方完成。也與附近城羅公園森林相連。",
        },
      },
    ],
    access: [],
    know: [],
    ko_card: [{ name_ko: "고양어울림누리", address_ko: null }],
    // 오더 #V2 [1] 그룹 C: 부모 스팟 eoullimnuri(cid 130549) 좌표 상속. address 는 미채움 유지.
    map: [{ lat: 37.6484671422, lng: 126.834631829, label: "고양어울림누리 누리공원" }],
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
    // 오더 #C3 [1]: 사장님 확정 소개글 원문 이식 (about-19-spots.md). 창작·의역 0. 5로케일 ko 폴백.
    sections: [
      {
        heading: { ko: "소개", en: "About", ja: "紹介", "zh-CN": "介绍", "zh-TW": "介紹" },
        body: {
          ko: "'아람누리'는 '크고 아름다운 세상'이라는 뜻의 순우리말이다. 예술의전당에 이어 국내 제2 규모의 종합 예술기관으로, 1,887석 오페라극장(아람극장)·1,449석 음악당·미술관·갤러리·도서관이 한 건물에 모여 있다. 캐치프레이즈는 \"세계적인 예술가를 만나는 곳\".\n\n이 광장이 특별한 건 위치다. 건물 뒤편이 곧장 정발산 숲으로 이어져, 오페라를 보고 나와 숲길을 걷는 흐름이 자연스럽다. 정발산역에서 바로 닿고, 라페스타 상권과도 가까워 일산 산책로들이 교차하는 문화의 결절점이다. 공연·전시·산책이 한자리에서 만나는 곳이다.",
          en: "\"Aramnuri\" is a pure-Korean word meaning \"a great and beautiful world.\" It is the country's second-largest integrated arts complex after Seoul Arts Center — an 1,887-seat opera house (Aram Theater), a 1,449-seat concert hall, an art museum, a gallery, and a library, all under one roof. The catchphrase reads, \"where you meet world-class artists.\"\n\nWhat makes this plaza special is its location. The back of the building runs straight into the forest of Jeongbalsan, so leaving an opera and walking a forest path is a natural sequence. Reachable directly from Jeongbalsan Stn., and close to the Lafesta shopping strip, it is the cultural node where Ilsan's walking paths cross. Performance, exhibition, and a stroll all meet in one place.",
          ja: "「アラムヌリ」は「大きく美しい世界」を意味する純韓国語です。芸術の殿堂（ソウル芸術の殿堂）に次ぐ国内第2規模の総合芸術機関で、1,887席のオペラ劇場（アラム劇場）・1,449席の音楽堂・美術館・ギャラリー・図書館が一つの建物に集まっています。キャッチフレーズは「世界的なアーティストに出会う場所」。\n\nこの広場が特別なのはその立地です。建物の裏手がそのまま鼎鉢山（チョンバルサン）の森につながり、オペラを観たあとに森の道を歩く流れが自然に生まれます。鼎鉢山駅からすぐ、ラフェスタ商圏にも近く、一山の散策路が交差する文化の結節点です。公演・展示・散策が一か所で出会う場所です。",
          "zh-CN": "「阿蓝世界（Aramnuri）」是纯韩语词，意为「宏大而美丽的世界」。它是继艺术殿堂之后国内第二大综合艺术机构，1,887席歌剧院（阿蓝剧场）、1,449席音乐厅、美术馆、画廊与图书馆汇于一栋建筑。宣传语是「与世界级艺术家相遇的地方」。\n\n这座广场特别之处在于位置。建筑背面直接与鼎钵山森林相连，看完歌剧后沿林道散步成为自然衔接。可从鼎钵山（Jeongbalsan）站步行直达，也靠近拉菲斯塔商圈——是一山散步路交汇的文化结节。演出、展览与散步在一处相遇。",
          "zh-TW": "「阿藍世界（Aramnuri）」是純韓語詞，意為「宏大而美麗的世界」。它是繼藝術殿堂之後國內第二大綜合藝術機構，1,887席歌劇院（阿藍劇場）、1,449席音樂廳、美術館、畫廊與圖書館匯於一棟建築。宣傳語是「與世界級藝術家相遇的地方」。\n\n這座廣場特別之處在於位置。建築背面直接與鼎缽山森林相連，看完歌劇後沿林道散步成為自然銜接。可從鼎缽山（Jeongbalsan）站步行直達，也靠近拉菲斯塔商圈——是一山散步路交匯的文化結節。演出、展覽與散步在一處相遇。",
        },
      },
    ],
    access: [],
    know: [],
    ko_card: [{ name_ko: "고양아람누리", address_ko: null }],
    // 오더 #V2 [1] 그룹 C: 부모 스팟 aramnuri(cid 254860) 좌표 상속. address 는 미채움 유지.
    map: [{ lat: 37.660973360108, lng: 126.772797186522, label: "고양아람누리 야외광장" }],
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

  // ─── 오더 #C8: 미식 6 (spots-food-01-10.md에서 채택) ─────────────────────
  //   공통: gallery/insider 미설정, adSlot=null, credits=[], access=[],
  //   ko_card.address_ko=null (「확인필요」), practical/map 미설정.

  {
    slug: "lafesta",
    category: "food",
    subtype: "restaurant",
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
    // 오더 #V4 [1] B안: TourAPI 1144856 overview_ko 원문 이식. 문장 사이 문단 분리만.
    sections: [
      {
        heading: { ko: "소개", en: "About", ja: "紹介", "zh-CN": "介绍", "zh-TW": "介紹" },
        body: {
          ko: "일산신도시 중심상업용지의 보행자몰 구간 중 일부를 차지하고 있고, 의도 상으로도 명실 상부한 신도시 보행문화의 중심이다.\n\n상업적 중심이기에 애초에 이곳은 테마 있는 보행자 몰로 활성화되기를 원했던 구간이며, 현재 일산최대의 상업지역이다.\n\n옥외에 생긴 국내 1호의 몰개념 쇼핑 공간 라페스타는 연면적 20,000여 평, 총길이 300m 폭 28m의 보행자도로 등의 규모를 자랑한다.\n\n이곳은 명동이나 압구정동처럼 자연발생적으로 생겨난 곳은 아니다.\n\n일정한 계획단계를 거쳐 설계가 이루어졌으며 터를 파고 건물을 지어 탄생된 곳이다.\n\n일산에 처음 선보인 몰 개념의 라페스타는 찾는 사람들에게 즐겁고, 재미나고, 유쾌함을 전해준다.\n\n언제나 다양한 문화행사를 통해 단순히 쇼핑의 역할뿐만 아니라 볼거리와 먹을거리, 즐길 거리를 제공한다.\n\n이곳의 진입 부분부터 끊어지지 않게 이어주는 동선은 시간이 가는 줄 모르게 할 뿐만 아니라, 쇼핑 중간의 지친 이들에게 휴식과 여유를 주기도 한다.\n\n이러한 자연스러운 동선은 총 6개 동으로 나누어진 건물 상층부위에서도 조형적으로 처리된 브릿지를 통해 가능하게 되었다.\n\n또한 300m에 걸쳐 펼쳐진 6개 동의 입면은 각각 화려한 색을 뽐내며 뷰티샵, 푸드 코트, 롯데시네마 8 개관 등 최근 멀티기능을 가진 쇼핑 공간 못지않은 시설을 가지고 있다.\n\n아울러 라이브나 콘서트 등이 가능한 대규모 공연장도 갖추고 있어 그 어느 문화공간과 뒤처지지 않는 환경으로 꾸며져 있다.\n\n이러한 점은 분명 기존에 알고 지내던 쇼핑·문화공간과도 크게 다를 바는 없다.\n\n하지만 분명 다른 것은 화창한 봄날에 햇빛을 마음껏 맞으며 즐길 수 있는 쇼핑, 마치 놀이동산이라도 온 듯한 착각을 주는 다양한 행사.\n\n또한 라페스타는 일산의 명동이라 불린다.\n\n미국의 샌타모니카 거리나 일본의 신주쿠 거리와도 비교된다.\n\n각종 음식점과 패션몰은 물론이고 테마카페와 대형오락실로 재미를 선사하고 피트니스센터와 뷰티클리닉으로 외모에 관심이 많은 젊은 층의 눈길을 사로잡고 있다.",
          en: "It occupies part of the pedestrian-mall section within the central commercial site of Ilsan New Town, and by design it stands as the true center of the new town's walking-street culture.\n\nAs a commercial hub, this stretch was meant from the outset to grow as a themed pedestrian mall, and it is now Ilsan's largest commercial district.\n\nKorea's first open-air mall-concept shopping space, La Festa boasts about 20,000 pyeong of total floor area and a pedestrian street 300 m long and 28 m wide.\n\nUnlike Myeongdong or Apgujeong-dong, it did not develop organically.\n\nIt was designed through a formal planning process, then built from the ground up.\n\nAs Ilsan's first venue built on the mall concept, La Festa brings visitors joy, fun, and playfulness.\n\nBeyond shopping, ongoing cultural events also deliver sights, food, and entertainment.\n\nAn unbroken pedestrian flow from the entry point makes time slip by unnoticed, and offers rest and breathing space to shoppers along the way.\n\nThis natural flow is made possible by sculpturally treated bridges linking the upper floors of the six buildings.\n\nThe facades of the six buildings stretching over 300 m each show off vivid colors, and its facilities — beauty shops, a food court, an 8-screen Lotte Cinema — are on par with today's multi-functional shopping spaces.\n\nIt also features a large-scale performance venue suitable for live shows and concerts, standing on par with dedicated cultural spaces.\n\nIn this respect it is not markedly different from familiar shopping and cultural venues.\n\nWhat is different is shopping under bright spring sunlight and a lineup of events that make the place feel almost like a theme park.\n\nLa Festa is also called \"Ilsan's Myeongdong.\"\n\nIt is compared with Santa Monica's streets in the United States and Shinjuku in Japan.\n\nAlongside diverse restaurants and fashion malls, theme cafes and large arcades bring the fun, while fitness centers and beauty clinics draw younger crowds interested in appearance.",
          ja: "一山（イルサン）新都市の中心商業用地の歩行者モール区間の一部を占め、意図的にも新都市の歩行者文化の中心地といえる場所です。\n\n商業の中心であるため、当初からテーマ性を持つ歩行者モールとして活性化を目指した区間で、現在は一山最大の商業地域です。\n\n屋外に生まれた国内初のモール型ショッピング空間・ラフェスタ（La Festa）は、延床面積約20,000坪、総延長300m・幅28mの歩行者道路などの規模を誇ります。\n\n明洞（ミョンドン）や狎鴎亭洞（アックジョンドン）のように自然発生的にできた場所ではありません。\n\n一定の計画段階を経て設計され、土地を掘り建物を建てて生まれた場所です。\n\n一山に初めて登場したモール型のラフェスタは、訪れる人に楽しさと面白さ、爽快感を届けます。\n\n常に多彩な文化イベントを通じて、単なるショッピングにとどまらず、見どころ・食べどころ・楽しみを提供します。\n\n入口から途切れずにつながる動線は時が経つのを忘れさせるだけでなく、ショッピングの合間に疲れた方に休息とゆとりも与えてくれます。\n\nこうした自然な動線は、6棟に分かれた建物の上層部を造形的に処理したブリッジによっても可能となっています。\n\nさらに、300mにわたって並ぶ6棟のファサードはそれぞれ華やかな色を見せ、ビューティーショップ、フードコート、ロッテシネマ8スクリーンなど、最近のマルチ機能を備えたショッピング空間に引けを取らない設備を持っています。\n\nライブやコンサートが可能な大規模公演場も備えており、他のどの文化空間にも劣らない環境が整えられています。\n\nこうした点は、既存のショッピング・文化空間と大きく異なるわけではありません。\n\nただし明確に違うのは、晴れた春の日に陽光を浴びながら楽しめるショッピングと、まるでテーマパークに来たかのような多彩なイベントです。\n\nラフェスタは「一山の明洞」とも呼ばれます。\n\nアメリカのサンタモニカ通りや日本の新宿とも比較されます。\n\n各種飲食店やファッションモールはもちろん、テーマカフェや大型ゲームセンターで楽しみを提供し、フィットネスセンターやビューティークリニックで美容に関心の高い若い層の目を引いています。",
          "zh-CN": "位于一山新城中心商业用地的步行街区一部分，从设计意图上就是新城步行文化的真正中心。\n\n作为商业中心，此区段自始便被寄望发展为主题步行商城，现为一山最大的商业地区。\n\n在户外诞生的韩国首个「Mall 概念」购物空间——拉斐斯塔（La Festa），建筑面积约20,000坪，全长300米、宽28米的步行道等规模令人瞩目。\n\n它并非像明洞或狎鸥亭洞那样自然形成。\n\n它经历了完整的规划阶段进行设计，从掘地建楼一路创建而成。\n\n作为一山首次亮相的 Mall 型空间，拉斐斯塔为造访者带来快乐、趣味与愉悦。\n\n通过持续举办各类文化活动，不仅提供购物功能，也提供看点、美食与娱乐。\n\n从入口开始不间断延伸的动线，让人不觉时光流逝；也为购物途中疲累的人提供小憩与从容。\n\n这种自然动线还通过在6栋建筑上层进行造型处理的连桥得以实现。\n\n绵延300米的6栋建筑立面各具鲜艳色彩，并拥有美妆店、美食广场、乐天影院8厅等媲美现代多功能购物空间的设施。\n\n另设可举办演唱会等的大型演出场，营造出不输任何文化空间的环境。\n\n在这方面，它与人们熟知的购物·文化空间并无太大不同。\n\n但明显不同的是，能在晴朗的春日下尽情享受阳光的购物，以及仿佛置身游乐园般的多样活动。\n\n拉斐斯塔也被称为「一山的明洞」。\n\n亦被拿来与美国圣塔莫尼卡街道或日本新宿相提并论。\n\n除了各种餐饮与时尚商城，主题咖啡与大型游戏中心带来欢乐，健身中心与美容诊所也吸引重视外表的年轻族群。",
          "zh-TW": "位於一山新城中心商業用地的步行街區一部分，從設計意圖上就是新城步行文化的真正中心。\n\n作為商業中心，此區段自始便被寄望發展為主題步行商城，現為一山最大的商業地區。\n\n在戶外誕生的韓國首個「Mall 概念」購物空間——拉斐斯塔（La Festa），建築面積約20,000坪，全長300公尺、寬28公尺的步行道等規模令人矚目。\n\n它並非像明洞或狎鷗亭洞那樣自然形成。\n\n它經歷了完整的規劃階段進行設計，從掘地建樓一路建成。\n\n作為一山首次亮相的 Mall 型空間，拉斐斯塔為造訪者帶來快樂、趣味與愉悅。\n\n透過持續舉辦各類文化活動，不僅提供購物功能，也提供看點、美食與娛樂。\n\n從入口開始不間斷延伸的動線，讓人不覺時光流逝；也為購物途中疲累的人提供小憩與從容。\n\n這種自然動線還透過在6棟建築上層進行造型處理的連橋得以實現。\n\n綿延300公尺的6棟建築立面各具鮮艷色彩，並擁有美妝店、美食廣場、樂天影院8廳等媲美現代多功能購物空間的設施。\n\n另設可舉辦演唱會等的大型演出場，營造出不輸任何文化空間的環境。\n\n在這方面，它與人們熟知的購物·文化空間並無太大不同。\n\n但明顯不同的是，能在晴朗的春日下盡情享受陽光的購物，以及彷彿置身遊樂園般的多樣活動。\n\n拉斐斯塔也被稱為「一山的明洞」。\n\n亦被拿來與美國聖塔莫尼卡街道或日本新宿相提並論。\n\n除了各種餐飲與時尚商城，主題咖啡與大型遊戲中心帶來歡樂，健身中心與美容診所也吸引重視外表的年輕族群。",
        },
      },
    ],
    access: [],
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
    official_url: "https://www.instagram.com/lafesta_ilsan",
    best_selected: false,
    // 오더 #V2 [1] 그룹 B: TourAPI 1144856 매칭 (기존 addr·map 유지, official+tourapi 신규).
    tourapi: { contentid: "1144856", overview_ko: "일산신도시 중심상업용지의 보행자몰 구간 중 일부를 차지하고 있고, 의도 상으로도 명실 상부한 신도시 보행문화의 중심이다. 상업적 중심이기에 애초에 이곳은 테마 있는 보행자 몰로 활성화되기를 원했던 구간이며, 현재 일산최대의 상업지역이다. 옥외에 생긴 국내 1호의 몰개념 쇼핑 공간 라페스타는 연면적 20,000여 평, 총길이 300m 폭 28m의 보행자도로 등의 규모를 자랑한다. 이곳은 명동이나 압구정동처럼 자연발생적으로 생겨난 곳은 아니다. 일정한 계획단계를 거쳐 설계가 이루어졌으며 터를 파고 건물을 지어 탄생된 곳이다. 일산에 처음 선보인 몰 개념의 라페스타는 찾는 사람들에게 즐겁고, 재미나고, 유쾌함을 전해준다. 언제나 다양한 문화행사를 통해 단순히 쇼핑의 역할뿐만 아니라 볼거리와 먹을거리, 즐길 거리를 제공한다. 이곳의 진입 부분부터 끊어지지 않게 이어주는 동선은 시간이 가는 줄 모르게 할 뿐만 아니라, 쇼핑 중간의 지친 이들에게 휴식과 여유를 주기도 한다. 이러한 자연스러운 동선은 총 6개 동으로 나누어진 건물 상층부위에서도 조형적으로 처리된 브릿지를 통해 가능하게 되었다. 또한 300m에 걸쳐 펼쳐진 6개 동의 입면은 각각 화려한 색을 뽐내며 뷰티샵, 푸드 코트, 롯데시네마 8 개관 등 최근 멀티기능을 가진 쇼핑 공간 못지않은 시설을 가지고 있다. 아울러 라이브나 콘서트 등이 가능한 대규모 공연장도 갖추고 있어 그 어느 문화공간과 뒤처지지 않는 환경으로 꾸며져 있다. 이러한 점은 분명 기존에 알고 지내던 쇼핑·문화공간과도 크게 다를 바는 없다. 하지만 분명 다른 것은 화창한 봄날에 햇빛을 마음껏 맞으며 즐길 수 있는 쇼핑, 마치 놀이동산이라도 온 듯한 착각을 주는 다양한 행사. 또한 라페스타는 일산의 명동이라 불린다. 미국의 샌타모니카 거리나 일본의 신주쿠 거리와도 비교된다. 각종 음식점과 패션몰은 물론이고 테마카페와 대형오락실로 재미를 선사하고 피트니스센터와 뷰티클리닉으로 외모에 관심이 많은 젊은 층의 눈길을 사로잡고 있다.", homepage: "https://www.instagram.com/lafesta_ilsan" },
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
    subtype: "restaurant",
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
    // 오더 #V4 [1] B안: TourAPI overview_ko 원문 이식. 문장 사이 문단 분리만.
    sections: [
      {
        heading: { ko: "소개", en: "About", ja: "紹介", "zh-CN": "介绍", "zh-TW": "介紹" },
        body: {
          ko: "경기도 일산 장항동에 위치한 '웨스턴돔(WesternDom)'은 전국적으로 보기 드문 스트리트형 쇼핑몰인 '라페스타'와 함께 일산의 대표적인 상업시설이다.\n\n웨스턴돔은 지하 2층, 지상 10층 규모에 약 500여개의 점포가 입점해 있다.\n\n세계 각국의 유명 식음 브랜드 매장을 비롯하여 의류/패션잡화, 화장품 매장, 아이맥스관을 갖춘 멀티플렉스 영화관 등과 그리고 고품격 섹션형 오피스타운인 웨스턴 타워로 이루어졌다.\n\n웨스턴돔은 '현대식 전통시장'이라는 컨셉을 도입하여 시간과 테마별로 아이템을 바꿔가며 100여개의 매대를 설치하고 각종 상품을 판매한다.\n\n또한 보행자의 동선이 쉽게 연결되도록 건물을 배치한 것이 특징이며, 고양시 미술작가들이 참여한 다양한 미술작품이 웨스턴돔 곳곳에 전시해놓았다.\n\n야간에는 돔 구조의 천장에 형형색색의 조명을 설치해 방문객들의 눈길을 끈다.\n\n이곳에서는 쇼핑 뿐만 아니라 넓은 광장에서 펼쳐지는 공연이나 각종 문화행사 등 다양한 볼거리와 즐길거리를 제공한다.\n\n인근에는 롯데백화점과 홈플러스 등의 대형 유통업체와 호수공원, 미관광장, 정발산공원 등 다양한 휴식공간이 있다.",
          en: "Located in Janghang-dong, Ilsan (Gyeonggi-do), WesternDom is one of Ilsan's landmark commercial complexes, alongside La Festa, a rare street-format shopping mall in Korea.\n\nWesternDom spans 2 basement levels and 10 above-ground floors, with about 500 stores inside.\n\nIt houses well-known international food and beverage brands, apparel and fashion accessory shops, cosmetics stores, a multiplex cinema with an IMAX screen, and Western Tower — a premium sectional office town.\n\nBuilt around the concept of a \"modern traditional market,\" it also runs about 100 seasonal booths whose items rotate by time and theme.\n\nThe buildings are arranged so that pedestrian flow connects easily, and various artworks by Goyang artists are displayed throughout the complex.\n\nAt night, colorful lighting installed on the dome-shaped ceiling draws the eye of visitors.\n\nAlongside shopping, WesternDom offers plenty to see and do — performances and cultural events held on its wide plaza.\n\nNearby you can find large retailers such as Lotte Department Store and Homeplus, along with green and open spaces like Ilsan Lake Park, Migwan Plaza, and Jeongbalsan Park.",
          ja: "京畿道一山（イルサン）獐項洞（チャンハンドン）にある「ウエスタンドム（WesternDom）」は、全国的にも珍しいストリート型ショッピングモール「ラフェスタ」と並ぶ一山を代表する商業施設です。\n\nウエスタンドムは地下2階・地上10階規模で、約500の店舗が入居しています。\n\n世界各国の有名飲食ブランド店舗をはじめ、衣料/ファッション雑貨、コスメ店舗、IMAXスクリーンを備えたシネマコンプレックス、そして高品質セクション型オフィスタウン「ウエスタンタワー」で構成されています。\n\nウエスタンドムは「現代式伝統市場」というコンセプトを取り入れ、時間やテーマ別にアイテムを入れ替えながら100あまりのブースを設け、多様な商品を販売しています。\n\nまた歩行者の動線がスムーズにつながるよう建物を配置しているのが特徴で、高陽市のアーティストが参加した多彩なアート作品が館内各所に展示されています。\n\n夜にはドーム構造の天井に色とりどりの照明が設置され、来訪者の目を引きます。\n\nショッピングだけでなく、広い広場で行われる公演や各種文化イベントなど、多様な見どころと楽しみを提供しています。\n\n近隣にはロッテ百貨店やホームプラスなど大型流通施設と、湖水公園・美観広場・鼎鉢山公園など多様な憩いの空間があります。",
          "zh-CN": "位于京畿道一山獐项洞的「西部圆顶（WesternDom）」，与全国罕见的街区型购物中心「拉斐斯塔」并称一山的代表性商业设施。\n\n西部圆顶为地下2层、地上10层规模，入驻店铺约500家。\n\n包括世界各国知名餐饮品牌店铺、服装/时尚饰品、化妆品店，以及配备IMAX厅的多厅影院，还设有高品质分区型办公塔「西部塔」。\n\n引入「现代式传统市场」概念，按时间与主题轮换商品，设置约100个摊位销售各类商品。\n\n特色之一是建筑布局便于步行动线自然衔接，高阳市艺术家参与创作的各类艺术作品也遍布馆内。\n\n夜间在圆顶结构的天花板上装设各色灯光，吸引访客目光。\n\n除购物外，还在宽阔广场举办演出与文化活动，提供丰富的看点与乐趣。\n\n附近有乐天百货、Homeplus等大型商业设施，以及湖水公园、美观广场、鼎钵山公园等多种休憩空间。",
          "zh-TW": "位於京畿道一山獐項洞的「西部圓頂（WesternDom）」，與全國罕見的街區型購物中心「拉斐斯塔」並稱一山的代表性商業設施。\n\n西部圓頂為地下2層、地上10層規模，進駐店鋪約500家。\n\n包括世界各國知名餐飲品牌店鋪、服裝/時尚飾品、化妝品店，以及配備IMAX廳的多廳影院，還設有高品質分區型辦公塔「西部塔」。\n\n引入「現代式傳統市場」概念，按時間與主題輪換商品，設置約100個攤位銷售各類商品。\n\n特色之一是建築布局便於步行動線自然銜接，高陽市藝術家參與創作的各類藝術作品也遍布館內。\n\n夜間在圓頂結構的天花板上裝設各色燈光，吸引訪客目光。\n\n除購物外，還在寬闊廣場舉辦演出與文化活動，提供豐富的看點與樂趣。\n\n附近有樂天百貨、Homeplus等大型商業設施，以及湖水公園、美觀廣場、鼎缽山公園等多種休憩空間。",
        },
      },
    ], access: [], know: [],
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
    // 오더 #V2 [1] 그룹 B: TourAPI 1071954 매칭 (기존 addr·map 유지, tourapi 신규. homepage 없어 official 미채움).
    tourapi: { contentid: "1071954", overview_ko: "경기도 일산 장항동에 위치한 '웨스턴돔(WesternDom)'은 전국적으로 보기 드문 스트리트형 쇼핑몰인 '라페스타'와 함께 일산의 대표적인 상업시설이다. 웨스턴돔은 지하 2층, 지상 10층 규모에 약 500여개의 점포가 입점해 있다. 세계 각국의 유명 식음 브랜드 매장을 비롯하여 의류/패션잡화, 화장품 매장, 아이맥스관을 갖춘 멀티플렉스 영화관 등과 그리고 고품격 섹션형 오피스타운인 웨스턴 타워로 이루어졌다. 웨스턴돔은 '현대식 전통시장'이라는 컨셉을 도입하여 시간과 테마별로 아이템을 바꿔가며 100여개의 매대를 설치하고 각종 상품을 판매한다. 또한 보행자의 동선이 쉽게 연결되도록 건물을 배치한 것이 특징이며, 고양시 미술작가들이 참여한 다양한 미술작품이 웨스턴돔 곳곳에 전시해놓았다. 야간에는 돔 구조의 천장에 형형색색의 조명을 설치해 방문객들의 눈길을 끈다. 이곳에서는 쇼핑 뿐만 아니라 넓은 광장에서 펼쳐지는 공연이나 각종 문화행사 등 다양한 볼거리와 즐길거리를 제공한다. 인근에는 롯데백화점과 홈플러스 등의 대형 유통업체와 호수공원, 미관광장, 정발산공원 등 다양한 휴식공간이 있다." },
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
    slug: "ilsan-traditional-market",
    category: "food",
    subtype: "restaurant",
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
    // 오더 #V4 [1] B안: TourAPI overview_ko 원문 이식. 문장 사이 문단 분리만.
    sections: [
      {
        heading: { ko: "소개", en: "About", ja: "紹介", "zh-CN": "介绍", "zh-TW": "介紹" },
        body: {
          ko: "일산시장은 1908년 경의선 철도가 개통되고 면사무소가 일산으로 이전되면서 일산사거리를 중심으로 시장이 형성되었다.\n\n당시 고양과 파주의 중심상권으로 호황을 누리면서 시장을 찾는 사람들에 비해 장소가 협소하여 불편을 겪다가 1956년 논을 매립하여 시장을 재편성하였으며 현재의 위치에서 3일 8일을 장날로 정하고 우시장까지 형성하는 등 번창하였다.\n\n일산시장은 1979년 재래시장 현대화계획에 따라 당시 개별 목조건물을 철근콘크리트 복합상가 형태로 신축하여 1983년에 입주해 지금까지 이어져 오고 있다.\n\n단순히 물건을 사고파는 시장으로서의 의미를 넘어 도심 속에서 전통 오일장의 명맥을 유지하고 있는 풍물장으로서의 민속적 가치를 지니고 있다.\n\n일산전통시장은 백화점이나 대형마트에서도 구입하기 힘든 특색 있는 상품도 취급하고 있으며 다양한 품목에 저렴한 가격으로 판매하고 있다.",
          en: "Ilsan Market took shape around Ilsan Intersection after the Gyeongui Line railway opened in 1908 and the myeon (township) office moved to Ilsan.\n\nAt the time it prospered as the central commercial district for Goyang and Paju, but the site was too small for its crowds. In 1956 rice paddies were reclaimed to reorganize the market at its current location, with the 3rd and 8th of each month set as market days and a cattle market added — the district thrived.\n\nUnder the 1979 traditional-market modernization plan, Ilsan Market was rebuilt from individual wooden buildings into a reinforced-concrete mixed-use complex; tenants moved in in 1983, and the market has continued on this site since.\n\nBeyond a place simply for buying and selling, it carries folk value as a traditional gathering market that keeps the tradition of the five-day cycle alive in the middle of the city.\n\nIlsan Traditional Market also carries distinctive items that are hard to find at department stores or large marts, offering a wide range of goods at affordable prices.",
          ja: "一山（イルサン）市場は1908年に京義線鉄道が開通し、面事務所が一山に移転したことにより一山四つ角を中心に形成されました。\n\n当時は高陽と坡州（パジュ）の中心商圏として栄えましたが、来場者に対して敷地が狭く不便だったため、1956年に水田を埋め立てて市場を再編成し、現在地で毎月3日と8日を市の日と定め、牛市まで開かれるほど繁盛しました。\n\n一山市場は1979年の在来市場現代化計画により、当時個別の木造建物を鉄筋コンクリートの複合商店街に建て替え、1983年に入居して今日まで続いています。\n\n単に物を売買する市場を超え、都心の中で伝統的な五日市の系譜を保つ「風物市」としての民俗的価値を持っています。\n\n一山伝統市場は百貨店や大型マートでは手に入りにくい特色ある品も取り扱い、幅広い商品を手頃な価格で販売しています。",
          "zh-CN": "一山市场随着1908年京义线铁路开通、面事务所迁至一山，以一山十字路口为中心逐渐形成。\n\n当时作为高阳与坡州的中心商圈相当繁荣，但相较人流场地过窄，1956年填埋水田重新整合市场，并在现址将每月3日与8日定为集日，甚至发展出牛市。\n\n一山市场依据1979年在来市场现代化计划，将当时的独立木造建筑改建为钢筋混凝土综合商街，1983年入驻并延续至今。\n\n它已超越单纯的买卖场所，作为在市中心中延续传统五日集脉络的「民俗集市」，具有民俗学价值。\n\n一山传统市场也销售百货公司或大型超市难以购得的特色商品，以低价提供多样品项。",
          "zh-TW": "一山市場隨著1908年京義線鐵路開通、面事務所遷至一山，以一山十字路口為中心逐漸形成。\n\n當時作為高陽與坡州的中心商圈相當繁榮，但相較人流場地過窄，1956年填埋水田重新整合市場，並在現址將每月3日與8日定為集日，甚至發展出牛市。\n\n一山市場依據1979年在來市場現代化計畫，將當時的獨立木造建築改建為鋼筋混凝土綜合商街，1983年入駐並延續至今。\n\n它已超越單純的買賣場所，作為在市中心中延續傳統五日集脈絡的「民俗集市」，具有民俗學價值。\n\n一山傳統市場也販售百貨公司或大型超市難以購得的特色商品，以低價提供多樣品項。",
        },
      },
    ], access: [],
    know: [
      { ko: "국밥 — 밥을 국에 말아 먹는 한국식 한 그릇 음식입니다.", en: "Gukbap — a one-bowl dish of rice served in hot soup.", ja: "クッパ — ご飯をスープに入れて食べる韓国式の一皿料理です。", "zh-CN": "汤饭 — 将米饭泡入热汤食用的韩式单碗料理。", "zh-TW": "湯飯 — 將米飯泡入熱湯食用的韓式單碗料理。" },
      { ko: "분식 — 떡볶이·순대·튀김 등 간단한 길거리 음식입니다.", en: "Bunsik — inexpensive street snacks such as tteokbokki, sundae and fritters.", ja: "粉食 — トッポッキ·スンデ·天ぷらなど手軽な屋台料理です。", "zh-CN": "粉食 — 炒年糕、血肠、炸物等简便街头小吃。", "zh-TW": "粉食 — 炒年糕、血腸、炸物等簡便街頭小吃。" },
    ],
    // 오더 #V2 [1] 그룹 A: TourAPI 132419 확신 매칭 (addr+map+official+tourapi 신규).
    ko_card: [{ name_ko: "일산 전통시장", address_ko: "경기도 고양시 일산서구 일청로12번길 9 (일산동)" }],
    map: [{ lat: 37.6856783379, lng: 126.7708393847, label: "일산 전통시장" }],
    credits: [], related: [],
    info: { hours: "varies", duration: "1h", admission: "varies", access: "partial" },
    highlights: [
      { ko: "시장 안에서 해결하는 간단한 식사", en: "Simple meals inside the market", ja: "市場の中で済ませる簡単な食事", "zh-CN": "市场内的简餐", "zh-TW": "市場內的簡餐" },
      { ko: "낮은 가격대", en: "Low prices", ja: "低めの価格帯", "zh-CN": "价格较低", "zh-TW": "價格較低" },
      { ko: "현지 생활 모습", en: "Everyday local life", ja: "地元の暮らしの様子", "zh-CN": "当地日常生活", "zh-TW": "當地日常生活" },
    ],
    adSlot: null,
    nearest_station: { name: { ko: "경의중앙선 일산역", en: "Ilsan Stn. (Gyeongui-Jungang)", ja: "京義中央線 一山駅", "zh-CN": "京义中央线 一山站", "zh-TW": "京義中央線 一山站" }, walk_min: null },
    official_url: "https://www.goyang.go.kr/visitgoyang",
    best_selected: false,
    tourapi: { contentid: "132419", overview_ko: "일산시장은 1908년 경의선 철도가 개통되고 면사무소가 일산으로 이전되면서 일산사거리를 중심으로 시장이 형성되었다. 당시 고양과 파주의 중심상권으로 호황을 누리면서 시장을 찾는 사람들에 비해 장소가 협소하여 불편을 겪다가 1956년 논을 매립하여 시장을 재편성하였으며 현재의 위치에서 3일 8일을 장날로 정하고 우시장까지 형성하는 등 번창하였다. 일산시장은 1979년 재래시장 현대화계획에 따라 당시 개별 목조건물을 철근콘크리트 복합상가 형태로 신축하여 1983년에 입주해 지금까지 이어져 오고 있다. 단순히 물건을 사고파는 시장으로서의 의미를 넘어 도심 속에서 전통 오일장의 명맥을 유지하고 있는 풍물장으로서의 민속적 가치를 지니고 있다. 일산전통시장은 백화점이나 대형마트에서도 구입하기 힘든 특색 있는 상품도 취급하고 있으며 다양한 품목에 저렴한 가격으로 판매하고 있다.", homepage: "https://www.goyang.go.kr/visitgoyang" },
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
    // 오더 #V4 [1] B안: TourAPI overview_ko 원문 이식. 문장 사이 문단 분리만.
    sections: [
      {
        heading: { ko: "소개", en: "About", ja: "紹介", "zh-CN": "介绍", "zh-TW": "介紹" },
        body: {
          ko: "고양시 일산동구 마두동에 위치한 아람누리는 '크고 아름다운 세상'이라는 의미의 우리말이다.\n\n2007년 5월 4일 개관한 아람누리는 오페라극장인 아람극장, 최상의 건축 음향을 자랑하는 아람음악당, 최첨단 가변형 극장 새라새극장 등 3개의 공연장으로 구성되어 있으며, 이동형 파티션을 갖춘 아람미술관, 창의적 전시공간 갤러리누리, 정발산의 울창한 숲으로 둘러싸인 노루목야외극장, 그리고 문화예술 강의시설과 카페·식당등의 편의시설이 갖추어진 아람마슬이 있다.\n\n(출처 : 고양 아람누리 홈페이지)",
          en: "Located in Madu-dong, Ilsandong-gu, Goyang, \"Aramnuri\" is a pure-Korean word meaning \"a great and beautiful world.\"\n\nOpened on May 4, 2007, Aram Nuri consists of three performance venues: Aram Theater (an opera house), Aram Concert Hall (renowned for its architectural acoustics), and Saerasae Theater (a cutting-edge flexible-format theater), together with Aram Art Museum (with movable partitions), the creative Gallery Nuri exhibition space, Norumok Outdoor Theater set within the dense forest of Jeongbalsan, and Aram Maseul, which houses arts and culture lecture facilities and amenities such as cafes and restaurants.\n\n(Source: Goyang Aram Nuri official site)",
          ja: "高陽市一山東区麻頭洞（マドゥドン）にあるアラムヌリは「大きく美しい世界」を意味する純韓国語です。\n\n2007年5月4日に開館したアラムヌリは、オペラ劇場のアラム劇場、最上級の建築音響を誇るアラム音楽堂、最先端の可変型劇場・セラセ劇場の3つの公演場で構成されており、可動式パーティションを備えたアラム美術館、創造的な展示空間ギャラリー・ヌリ、鼎鉢山（チョンバルサン）の鬱蒼とした森に囲まれたノルモク野外劇場、そして文化芸術の講座施設やカフェ・レストランなどの利便施設を備えたアラム・マスルがあります。\n\n（出典：高陽アラムヌリ公式ホームページ）",
          "zh-CN": "位于高阳市一山东区麻头洞的阿蓝世界（Aramnuri），是意为「宏大而美丽的世界」的纯韩语词。\n\n2007年5月4日开馆的阿蓝世界，由歌剧院阿蓝剧场、以顶级建筑声学著称的阿蓝音乐厅，以及尖端可变型剧场——世拉世剧场共3个演出场馆构成，另设有配备可移动隔板的阿蓝美术馆、创意展览空间「画廊·世界（Gallery Nuri）」、被鼎钵山葱郁森林环绕的獐颈户外剧场，以及配备文化艺术讲座设施与咖啡·餐厅等便利设施的「阿蓝·村落（Aram Maseul）」。\n\n（资料来源：高阳阿蓝世界官方网站）",
          "zh-TW": "位於高陽市一山東區麻頭洞的阿藍世界（Aramnuri），是意為「宏大而美麗的世界」的純韓語詞。\n\n2007年5月4日開館的阿藍世界，由歌劇院阿藍劇場、以頂級建築聲學著稱的阿藍音樂廳，以及尖端可變型劇場——世拉世劇場共3個演出場館構成，另設有配備可移動隔板的阿藍美術館、創意展覽空間「畫廊·世界（Gallery Nuri）」、被鼎缽山蔥鬱森林環繞的獐頸戶外劇場，以及配備文化藝術講座設施與咖啡·餐廳等便利設施的「阿藍·村落（Aram Maseul）」。\n\n（資料來源：高陽阿藍世界官方網站）",
        },
      },
    ], access: [], know: [],
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
    // 오더 #V2 [1] 그룹 B: TourAPI 254860 매칭 (기존 addr·map·official 유지, tourapi 만 신규).
    tourapi: { contentid: "254860", overview_ko: "고양시 일산동구 마두동에 위치한 아람누리는 '크고 아름다운 세상'이라는 의미의 우리말이다. 2007년 5월 4일 개관한 아람누리는 오페라극장인 아람극장, 최상의 건축 음향을 자랑하는 아람음악당, 최첨단 가변형 극장 새라새극장 등 3개의 공연장으로 구성되어 있으며, 이동형 파티션을 갖춘 아람미술관, 창의적 전시공간 갤러리누리, 정발산의 울창한 숲으로 둘러싸인 노루목야외극장, 그리고 문화예술 강의시설과 카페·식당등의 편의시설이 갖추어진 아람마슬이 있다. (출처 : 고양 아람누리 홈페이지)", homepage: "http://www.artgy.or.kr" },
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
    // 오더 #V4 [1] B안: TourAPI overview_ko 원문 이식. 문장 사이 문단 분리만.
    sections: [
      {
        heading: { ko: "소개", en: "About", ja: "紹介", "zh-CN": "介绍", "zh-TW": "介紹" },
        body: {
          ko: "고양시 덕양구 성사동에 위치한 고양어울림누리는 공연장, 문화예술 교육시설, 체육시설이 어우러진 동양 최대의 복합문화예술 공간이다.\n\n고양어울림누리를 대표하는 다목적 공연장인 어울림극장 지상 2층 규모에 총 1,290명 관객을 동시에 수용할 수 있는 대극장이다.\n\n최첨단 무대 시스템으로 발레, 뮤지컬, 콘서트 등 다양한 장르의 대형 공연을 완벽하게 구현해 내며, 관람객에게 최적의 시야를 확보해 주기 위해 32m 이내에 모든 좌석을 배치한 것이 특징이다.\n\n별모래극장은 소규모 공연을 위한 공간이지만 비교적 큰 무대 규모와 우수한 음향 및 조명 시스템을 갖추고 있으며, 무대를 자유롭게 변환할 수 있는 웨건이 설치되어 있어 다양한 무대 연출이 가능하다.\n\n꽃메야외극장은 콘서트와 연극, 마당극 등 다양한 장르의 공연이 펼쳐지는 소규모 야외공연장이다.\n\n별따기배움터 1, 2층에 위치한 어울림미술관은 제1전시실과 제2전시실로 이루어져 있는데, 회화, 공예, 사진, 설치미술 및 어린이 체험전시 등 폭넓은 장르의 기획전시와 대관전시를 함께 선보이고 있다.\n\n지하 1층, 지상 3층 규모의 별따기배움터는 문화예술교육 및 각종 취미 강좌와 세미나를 위한 공간으로 구성되어 있다.\n\n체계적인 교육 프로그램으로 청소년 및 가족의 건전한 여가 생활과 문화 활동을 돕는 열린 공간이다.\n\n또한, 시민들의 생활체육과 체력증진을 위한 별무리경기장, 얼음마루, 꽃우물수영장, 몸과마음닦음터를 고양도시관리공사가 운영하고 있다.",
          en: "Located in Seongsa-dong, Deokyang-gu, Goyang, Goyang Eoullim Nuri is one of Asia's largest combined arts complexes, integrating performance venues, arts and culture education facilities, and sports facilities.\n\nEoullim Theater, its flagship multipurpose venue, is a 2-story hall able to seat 1,290 people at once.\n\nWith cutting-edge stage systems, it delivers large-scale performances across ballet, musicals, and concerts, and — to give every audience member the best sightline — all seats are placed within 32 m of the stage.\n\nByeolmorae Theater, though built for smaller productions, has a relatively large stage and high-grade sound and lighting systems, plus a stage wagon that can freely reconfigure the stage for diverse stagings.\n\nKkotme Outdoor Theater is a small open-air venue for concerts, plays, madanggeuk (Korean outdoor theater), and other genres.\n\nEoullim Art Museum, on the 1st and 2nd floors of Byeolttagi Learning Center, comprises Exhibition Halls 1 and 2 and presents curated and rental exhibitions across a wide range — painting, crafts, photography, installation art, and children's interactive shows.\n\nSpanning 1 basement level and 3 above-ground levels, Byeolttagi Learning Center houses arts and culture education programs, along with a variety of hobby classes and seminars.\n\nWith structured programs, it is an open space that supports healthy leisure and cultural life for youth and families.\n\nGoyang Urban Management Corporation also operates Byeolmuri Stadium, Eoreum Maru (ice rink), Kkotumul Swimming Pool, and Mom-gwa-Maeum Dakkeumteo — venues for citizens' everyday sports and fitness.",
          ja: "高陽市徳陽区城沙洞（ソンサドン）に位置する高陽オウルリムヌリは、公演場・文化芸術教育施設・体育施設が一体となった東洋最大級の複合文化芸術空間です。\n\n高陽オウルリムヌリを代表する多目的公演場・オウルリム劇場は地上2階規模で、総1,290名の観客を同時に収容できる大劇場です。\n\n最先端の舞台システムにより、バレエ・ミュージカル・コンサートなど多彩なジャンルの大型公演を完璧に演出し、観客に最適な視界を確保するために全ての座席を32m以内に配置しているのが特徴です。\n\nピョルモレ劇場は小規模公演のための空間ですが、比較的大きな舞台と優れた音響・照明システムを備え、舞台を自由に変換できるワゴンが設置されており、多様な演出が可能です。\n\nコッメ野外劇場はコンサート・演劇・マダングク（韓国の野外劇）など多彩なジャンルの公演が行われる小規模野外公演場です。\n\nピョルタギ学び場1・2階に位置するオウルリム美術館は第1・第2展示室で構成され、絵画・工芸・写真・インスタレーション、子ども体験展示など幅広いジャンルの企画展・貸館展を開催しています。\n\n地下1階・地上3階規模のピョルタギ学び場は、文化芸術教育や各種趣味講座・セミナーのための空間として構成されています。\n\n体系的な教育プログラムにより、青少年やファミリーの健全な余暇生活と文化活動を支える開かれた空間です。\n\nまた、市民の生活体育と体力増進のためのピョルムリ競技場・氷マル（アイスリンク）・コッチュムル水泳場・心身鍛錬場を高陽都市管理公社が運営しています。",
          "zh-CN": "位于高阳市德阳区城沙洞的高阳和谐世界（Eoullim Nuri），是集演出场馆、文化艺术教育设施与体育设施于一体、被誉为亚洲最大的复合型文化艺术空间。\n\n和谐世界的代表性多用途演出场——和谐剧场为地上2层规模，可同时容纳1,290名观众。\n\n凭借尖端舞台系统，可以完美呈现芭蕾、音乐剧、演唱会等多种类型的大型演出。为确保观众获得最佳视野，所有座位均布置在距舞台32米以内。\n\n星沙剧场虽为小型演出而设，但拥有相对较大的舞台规模和优秀的音响与灯光系统，并配备可自由变换舞台的转台，能实现多样化的舞台呈现。\n\n花山（Kkotme）户外剧场是可举办演唱会、话剧、庭戏（Madanggeuk）等多种类型演出的小型露天演出场。\n\n位于摘星学堂1、2层的和谐美术馆由第1、第2展厅组成，涵盖绘画、工艺、摄影、装置艺术以及儿童体验展等多种类型的策划展与租展。\n\n地下1层、地上3层规模的摘星学堂，用于文化艺术教育与各类兴趣讲座、研讨活动。\n\n通过系统的教育项目，为青少年与家庭的健康休闲与文化活动提供开放空间。\n\n此外，高阳城市管理公社还运营着面向市民生活体育与体质增进的星群运动场、冰园、花井游泳池与心身修炼场。",
          "zh-TW": "位於高陽市德陽區城沙洞的高陽和諧世界（Eoullim Nuri），是集演出場館、文化藝術教育設施與體育設施於一體、被譽為亞洲最大的複合型文化藝術空間。\n\n和諧世界的代表性多用途演出場——和諧劇場為地上2層規模，可同時容納1,290名觀眾。\n\n憑藉尖端舞台系統，可以完美呈現芭蕾、音樂劇、演唱會等多種類型的大型演出。為確保觀眾獲得最佳視野，所有座位均布置在距舞台32公尺以內。\n\n星沙劇場雖為小型演出而設，但擁有相對較大的舞台規模和優秀的音響與燈光系統，並配備可自由變換舞台的轉台，能實現多樣化的舞台呈現。\n\n花山（Kkotme）戶外劇場是可舉辦演唱會、話劇、庭戲（Madanggeuk）等多種類型演出的小型露天演出場。\n\n位於摘星學堂1、2層的和諧美術館由第1、第2展廳組成，涵蓋繪畫、工藝、攝影、裝置藝術以及兒童體驗展等多種類型的策劃展與租展。\n\n地下1層、地上3層規模的摘星學堂，用於文化藝術教育與各類興趣講座、研討活動。\n\n透過系統的教育項目，為青少年與家庭的健康休閒與文化活動提供開放空間。\n\n此外，高陽城市管理公社還運營著面向市民生活體育與體質增進的星群運動場、冰園、花井游泳池與心身修煉場。",
        },
      },
    ], access: [], know: [],
    // 오더 #V2 [1] 그룹 B: TourAPI 130549 매칭 (addr+map+official+tourapi 신규).
    ko_card: [{ name_ko: "고양어울림누리", address_ko: "경기도 고양시 덕양구 어울림로 33 (성사동)" }],
    map: [{ lat: 37.6484671422, lng: 126.834631829, label: "고양어울림누리" }],
    credits: [], related: [],
    info: { hours: "varies", duration: "1_2h", admission: "varies", access: "wheelchair" },
    highlights: [
      { ko: "극장 두 곳과 전시관", en: "Two theatres and a gallery", ja: "二つの劇場と展示館", "zh-CN": "两座剧场与展览馆", "zh-TW": "兩座劇場與展覽館" },
      { ko: "체육시설 병설", en: "Sports facilities on site", ja: "体育施設を併設", "zh-CN": "附设体育设施", "zh-TW": "附設體育設施" },
      { ko: "덕양구 문화 거점", en: "The cultural hub of Deokyang", ja: "徳陽区の文化拠点", "zh-CN": "德阳区文化据点", "zh-TW": "德陽區文化據點" },
    ],
    adSlot: null,
    // 오더 #V3 [1]: TourAPI Type1 상위 3장 (contentid 130549, 원본 940×626 → 재인코딩).
    gallery: [
      { url: "/images/spots/eoullimnuri-1.jpg", credit: "출처: 한국관광공사 (공공누리 제1유형)", cpyrht: "Type1" },
      { url: "/images/spots/eoullimnuri-2.jpg", credit: "출처: 한국관광공사 (공공누리 제1유형)", cpyrht: "Type1" },
      { url: "/images/spots/eoullimnuri-3.jpg", credit: "출처: 한국관광공사 (공공누리 제1유형)", cpyrht: "Type1" },
      // 오더 #C9: Type1 확장 3장 추가 (총 6장 · 6장 전량 소진).
      { url: "/images/spots/eoullimnuri-4.jpg", credit: "출처: 한국관광공사 (공공누리 제1유형)", cpyrht: "Type1" },
      { url: "/images/spots/eoullimnuri-5.jpg", credit: "출처: 한국관광공사 (공공누리 제1유형)", cpyrht: "Type1" },
      { url: "/images/spots/eoullimnuri-6.jpg", credit: "출처: 한국관광공사 (공공누리 제1유형)", cpyrht: "Type1" },
    ],
    official_url: "https://www.artgy.or.kr/oulim",
    best_selected: false,
    tourapi: { contentid: "130549", overview_ko: "고양시 덕양구 성사동에 위치한 고양어울림누리는 공연장, 문화예술 교육시설, 체육시설이 어우러진 동양 최대의 복합문화예술 공간이다. 고양어울림누리를 대표하는 다목적 공연장인 어울림극장 지상 2층 규모에 총 1,290명 관객을 동시에 수용할 수 있는 대극장이다. 최첨단 무대 시스템으로 발레, 뮤지컬, 콘서트 등 다양한 장르의 대형 공연을 완벽하게 구현해 내며, 관람객에게 최적의 시야를 확보해 주기 위해 32m 이내에 모든 좌석을 배치한 것이 특징이다. 별모래극장은 소규모 공연을 위한 공간이지만 비교적 큰 무대 규모와 우수한 음향 및 조명 시스템을 갖추고 있으며, 무대를 자유롭게 변환할 수 있는 웨건이 설치되어 있어 다양한 무대 연출이 가능하다. 꽃메야외극장은 콘서트와 연극, 마당극 등 다양한 장르의 공연이 펼쳐지는 소규모 야외공연장이다. 별따기배움터 1, 2층에 위치한 어울림미술관은 제1전시실과 제2전시실로 이루어져 있는데, 회화, 공예, 사진, 설치미술 및 어린이 체험전시 등 폭넓은 장르의 기획전시와 대관전시를 함께 선보이고 있다. 지하 1층, 지상 3층 규모의 별따기배움터는 문화예술교육 및 각종 취미 강좌와 세미나를 위한 공간으로 구성되어 있다. 체계적인 교육 프로그램으로 청소년 및 가족의 건전한 여가 생활과 문화 활동을 돕는 열린 공간이다. 또한, 시민들의 생활체육과 체력증진을 위한 별무리경기장, 얼음마루, 꽃우물수영장, 몸과마음닦음터를 고양도시관리공사가 운영하고 있다.", homepage: "https://www.artgy.or.kr/oulim" },
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
    // 오더 #C3 [1]: 사장님 확정 소개글 원문 이식 (about-19-spots.md). 창작·의역 0. 5로케일 ko 폴백.
    sections: [
      {
        heading: { ko: "소개", en: "About", ja: "紹介", "zh-CN": "介绍", "zh-TW": "介紹" },
        body: {
          ko: "킨텍스 옆에 자리한 자동차 테마 복합 문화공간이다. 단순 전시장을 넘어 자동차가 만들어지는 과정을 체험으로 풀어낸 대형 공간으로, 아이와 어른이 함께 즐길 수 있는 무료 관람 코스가 마련돼 있다.\n\n킨텍스·현대백화점·원마운트가 도보권에 모여 있어, 전시나 MICE 일정과 묶어 반나절 동선으로 넣기 좋다.",
          en: "An automotive-themed cultural complex next to KINTEX. More than a showroom, it is a large space where the process of building a car is turned into hands-on experience, with a free tour designed for children and adults alike.\n\nKINTEX, Hyundai Department Store and One Mount all sit within walking distance, making it easy to fold into a half-day route around an exhibition or MICE schedule.",
          ja: "キンテックス（KINTEX）の隣に位置する自動車テーマの複合文化空間です。単なる展示場を超え、自動車がつくられる過程を体験として展開する大型空間で、子どもも大人も楽しめる無料観覧コースが用意されています。\n\nキンテックス・現代百貨店・ワンマウント（One Mount）が徒歩圏に集まっており、展示会やMICE日程と組み合わせて半日動線に組み込みやすいスポットです。",
          "zh-CN": "位于韩国国际展览中心（KINTEX）旁的汽车主题综合文化空间。不仅是展厅，更是把汽车制造过程转化为体验的大型空间，设有大人小孩都可享受的免费参观路线。\n\n韩国国际展览中心、现代百货与One Mount皆在步行可达范围内，方便结合展会或MICE行程规划半日动线。",
          "zh-TW": "位於韓國國際展覽中心（KINTEX）旁的汽車主題綜合文化空間。不僅是展廳，更是把汽車製造過程轉化為體驗的大型空間，設有大人小孩皆可享受的免費參觀路線。\n\n韓國國際展覽中心、現代百貨與One Mount皆在步行可達範圍內，方便結合展會或MICE行程規劃半日動線。",
        },
      },
    ], access: [], know: [],
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
      // 오더 #C9: Type1 확장 3장 추가 (총 6장 · 6장 전량 소진).
      { url: "/images/spots/hyundai-motorstudio-4.jpg", credit: "출처: 한국관광공사 (공공누리 제1유형)", cpyrht: "Type1" },
      { url: "/images/spots/hyundai-motorstudio-5.jpg", credit: "출처: 한국관광공사 (공공누리 제1유형)", cpyrht: "Type1" },
      { url: "/images/spots/hyundai-motorstudio-6.jpg", credit: "출처: 한국관광공사 (공공누리 제1유형)", cpyrht: "Type1" },
      // 오더 #C48 [해제]: .jpg.png 이중 확장자 정정 후 940×627 재인코딩 · 사장님 수동 배치 의도 살림.
      { url: "/images/spots/hyundai-motorstudio-7.jpg", credit: "출처: 한국관광공사 (공공누리 제1유형)", cpyrht: "Type1" },
      { url: "/images/spots/hyundai-motorstudio-8.jpg", credit: "출처: 한국관광공사 (공공누리 제1유형)", cpyrht: "Type1" },
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
    // 오더 #C3 [1]: 사장님 확정 소개글 원문 이식 (about-19-spots.md). 창작·의역 0. 5로케일 ko 폴백.
    sections: [
      {
        heading: { ko: "소개", en: "About", ja: "紹介", "zh-CN": "介绍", "zh-TW": "介紹" },
        body: {
          ko: "고양 덕양구 고양동, 붉은 벽돌 건물과 말 달리는 돈키호테 동상이 맞이하는 이곳은 아시아에서 유일한 중남미 테마 문화공간이다. 중남미 4개국에서 30여 년간 외교관으로 일한 이복형 전 대사가 은퇴 후 사비를 들여 1994년 세웠고, 그가 40여 년에 걸쳐 모은 고대 유물부터 근·현대 회화·조각까지 한자리에 있다.\n\n돔형 천장 한가운데 나무로 조각한 금빛 태양상은 태양을 섬긴 중남미인의 세계관을 그대로 옮긴 것이다. 이국의 정취가 짙어 사진 명소로도, 조용한 산책지로도 사랑받는다. 삼송역에서 마을버스로 닿는다.",
          en: "In Goyang-dong, Deokyang-gu, Goyang — where a red-brick building and a statue of Don Quixote on horseback greet visitors — this is Asia's only cultural venue dedicated to Latin America. It was founded in 1994 with the private funds of former ambassador Lee Bok-hyung, after more than 30 years as a diplomat across four Latin American countries; the works he gathered over some 40 years, from ancient artefacts to modern and contemporary paintings and sculpture, are shown together here.\n\nAt the centre of the domed ceiling, a golden sun carved in wood carries over the sun-worshipping worldview of the peoples of Latin America. With its strong foreign atmosphere it is loved both as a photo spot and as a quiet place to walk. It is reached by community bus from Samsong Station.",
          ja: "高陽（コヤン）市徳陽区高陽洞（コヤンドン）、赤煉瓦の建物と馬を駆るドン・キホーテの像が迎えるここは、アジア唯一の中南米テーマ文化空間です。中南米4か国で30余年にわたり外交官を務めた李福衡（イ・ボクヒョン／Lee Bok-hyung）元大使が退官後に私費で1994年に建て、40年余りをかけて集めた古代遺物から近・現代の絵画・彫刻までが一堂に会します。\n\nドーム天井の中央に木で彫られた金色の太陽像は、太陽を崇めた中南米の人々の世界観をそのまま移したものです。異国情緒が濃く、写真スポットとしても、静かな散策地としても愛されています。三松（サムソン）駅からマウルバスでアクセスできます。",
          "zh-CN": "高阳市德阳区高阳洞——由红砖建筑与骑马奔驰的堂吉诃德雕像迎接访客的这里，是亚洲唯一的中南美主题文化空间。曾在中南美四国担任外交官30余年的前大使李福衡（Lee Bok-hyung）退休后以私费于1994年创立，历时40余年收集的从古代文物到近现代绘画、雕塑齐聚一堂。\n\n穹顶中央以木雕成的金色太阳像，原样呈现了敬奉太阳的中南美人的世界观。异国情调浓厚，既是热门拍照地，也是安静的散步地。可从三松站搭乘社区巴士抵达。",
          "zh-TW": "高陽市德陽區高陽洞——由紅磚建築與騎馬奔馳的唐吉訶德雕像迎接訪客的這裡，是亞洲唯一的中南美主題文化空間。曾在中南美四國擔任外交官30餘年的前大使李福衡（Lee Bok-hyung）退休後以私費於1994年創立，歷時40餘年蒐集的從古代文物到近現代繪畫、雕塑齊聚一堂。\n\n穹頂中央以木雕成的金色太陽像，原樣呈現了敬奉太陽的中南美人的世界觀。異國情調濃厚，既是熱門拍照地，也是安靜的散步地。可從三松站搭乘社區巴士抵達。",
        },
      },
    ], access: [], know: [],
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
      // 오더 #C9: Type1 확장 3장 추가 (내부 컷 · 총 6장).
      { url: "/images/spots/latin-america-museum-4.jpg", credit: "출처: 한국관광공사 (공공누리 제1유형)", cpyrht: "Type1" },
      { url: "/images/spots/latin-america-museum-5.jpg", credit: "출처: 한국관광공사 (공공누리 제1유형)", cpyrht: "Type1" },
      { url: "/images/spots/latin-america-museum-6.jpg", credit: "출처: 한국관광공사 (공공누리 제1유형)", cpyrht: "Type1" },
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
    // 오더 #V4 [1] B안: TourAPI overview_ko 원문 이식. 문장 사이 문단 분리만.
    sections: [
      {
        heading: { ko: "소개", en: "About", ja: "紹介", "zh-CN": "介绍", "zh-TW": "介紹" },
        body: {
          ko: "아람미술관은 정발산역 3번 출구에 있는 고양시립 미술관이다.\n\n면적 1,300여 m²(400평), 높이 4m의 전시 공간을 갖추고 있으며 국내 신인 작가들을 발굴, 육성하고 세계 미술계의 경향을 국내에 소개하는 징검다리 역할을 하고 있다.\n\n또한 회화, 사진을 비롯해 최첨단 미디어아트 전시까지 장르를 넘나드는 다양한 전시를 개최하고 있다.\n\n주변에 아람 도서관과 공연장이 있어서 전시회 관람 후 연계해서 공연을 보거나 도서관에 들르기 좋다.\n\n정발산역 인근에 식당과 카페도 많아서 가족 나들이 코스로도 좋다.",
          en: "Aram Art Museum is a Goyang municipal gallery at Exit 3 of Jeongbalsan Station.\n\nWith about 1,300 m² (400 pyeong) of exhibition space and 4 m-high ceilings, it serves as a bridge — discovering and nurturing emerging Korean artists and introducing global art-world trends at home.\n\nIts programme crosses genres, from painting and photography to cutting-edge media-art exhibitions.\n\nAram Library and the performance halls are nearby, so it pairs naturally with a concert or a library stop after seeing a show.\n\nRestaurants and cafés cluster around Jeongbalsan Station, making it a good family outing course.",
          ja: "アラム美術館は鼎鉢山（チョンバルサン）駅3番出口にある高陽市立美術館です。\n\n面積約1,300m²（400坪）、高さ4mの展示空間を備え、国内新人作家の発掘・育成と、世界美術界の潮流を国内に紹介する橋渡し役を担っています。\n\nまた、絵画・写真から最先端メディアアート展示まで、ジャンルを横断する多彩な展示を開催しています。\n\n周辺にはアラム図書館と公演場があるため、展覧会鑑賞後にそのまま公演を観たり図書館に立ち寄ったりするのに適しています。\n\n鼎鉢山駅近くには飲食店・カフェも多く、家族の外出コースとしてもおすすめです。",
          "zh-CN": "阿蓝美术馆是位于鼎钵山站3号出口的高阳市立美术馆。\n\n拥有约1,300平方米（400坪）、高4米的展览空间，肩负发掘与培育韩国新锐作家、并将世界美术界的潮流介绍至国内的桥梁角色。\n\n举办涵盖绘画、摄影乃至尖端媒体艺术展等跨门类的多样展览。\n\n周边设有阿蓝图书馆与演出场馆，观展后可衔接观演或造访图书馆。\n\n鼎钵山站附近餐厅与咖啡馆众多，也很适合作为家庭出游路线。",
          "zh-TW": "阿藍美術館是位於鼎缽山站3號出口的高陽市立美術館。\n\n擁有約1,300平方公尺（400坪）、高4公尺的展覽空間，肩負發掘與培育韓國新銳作家、並將世界美術界的潮流介紹至國內的橋樑角色。\n\n舉辦涵蓋繪畫、攝影乃至尖端媒體藝術展等跨門類的多樣展覽。\n\n周邊設有阿藍圖書館與演出場館，觀展後可銜接觀演或造訪圖書館。\n\n鼎缽山站附近餐廳與咖啡館眾多，也很適合作為家庭出遊路線。",
        },
      },
    ], access: [], know: [],
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
    official_url: "https://www.artgy.or.kr/",
    best_selected: false,
    // 오더 #V2 [1] 그룹 B: TourAPI 2892126 매칭 (기존 addr·map 유지, official+tourapi 신규).
    tourapi: { contentid: "2892126", overview_ko: "아람미술관은 정발산역 3번 출구에 있는 고양시립 미술관이다. 면적 1,300여 m²(400평), 높이 4m의 전시 공간을 갖추고 있으며 국내 신인 작가들을 발굴, 육성하고 세계 미술계의 경향을 국내에 소개하는 징검다리 역할을 하고 있다. 또한 회화, 사진을 비롯해 최첨단 미디어아트 전시까지 장르를 넘나드는 다양한 전시를 개최하고 있다. 주변에 아람 도서관과 공연장이 있어서 전시회 관람 후 연계해서 공연을 보거나 도서관에 들르기 좋다. 정발산역 인근에 식당과 카페도 많아서 가족 나들이 코스로도 좋다.", homepage: "https://www.artgy.or.kr/" },
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
    // 오더 #V4 [1] B안: TourAPI overview_ko 원문 이식. 문장 사이 문단 분리만.
    sections: [
      {
        heading: { ko: "소개", en: "About", ja: "紹介", "zh-CN": "介绍", "zh-TW": "介紹" },
        body: {
          ko: "킨텍스(KINTEX)는 대한민국 최대 규모의 국제적 전시 컨벤션 센터이다.\n\n2005년 4월 29일 개장하였으며, 기존 국내 전시장에서 수용하기 어려웠던 대형 중량물 전시 및 이벤트 개최가 용이하게 된 것이 가장 큰 특징이다.\n\n경기도, 고양시, 코트라 공동출자 기관인 국제 전시장으로 경제 활성화와 일자리 창출, 지역 사회 공헌에 기여하고 있다.\n\n특히 대정부와의 긴밀한 협력체계 구축을 통해 전시 지원 산업 육성 및 첨단 전시 기술 기반 산업 유치뿐 아니라 시민 참여를 통한 지자체 문화 관광 여건 개선 등 대한민국 MICE 산업 발전을 위해 노력하고 있다.",
          en: "KINTEX (Korea International Exhibition Center) is Korea's largest international exhibition and convention center.\n\nIt opened on April 29, 2005, and its defining feature is the ability to host large-scale, heavy-load exhibitions and events that Korea's existing venues found hard to accommodate.\n\nAs an international exhibition center co-invested by Gyeonggi-do, Goyang City, and KOTRA, it contributes to economic vitality, job creation, and the community.\n\nBy building close cooperation with the central government, KINTEX advances Korea's MICE industry — nurturing exhibition-support industries, attracting industries built on advanced exhibition technology, and improving cultural-tourism conditions at the municipal level through citizen participation.",
          ja: "キンテックス（KINTEX）は大韓民国最大規模の国際展示コンベンションセンターです。\n\n2005年4月29日に開場し、従来の国内展示場では収容が難しかった大型重量物の展示・イベント開催が容易になった点が最大の特徴です。\n\n京畿道・高陽市・KOTRA共同出資機関の国際展示場として、経済活性化と雇用創出、地域社会への貢献に寄与しています。\n\n特に政府との緊密な協力体制構築を通じて、展示支援産業の育成と先端展示技術基盤産業の誘致のみならず、市民参加による自治体の文化観光条件改善など、大韓民国のMICE産業発展のため尽力しています。",
          "zh-CN": "韩国国际展览中心（KINTEX）是韩国规模最大的国际展览会议中心。\n\n于2005年4月29日开馆，最大特点是可轻松承办以往韩国国内展馆难以容纳的大型重物展览与活动。\n\n作为由京畿道、高阳市与大韩贸易投资振兴公社（KOTRA）共同出资的国际展馆，为经济振兴、创造就业与社会贡献发挥作用。\n\n尤其通过与政府构建紧密合作体系，不仅培育展览支援产业与引入以尖端展览技术为基础的产业，还借助市民参与改善地方文化观光条件，为韩国MICE产业发展持续努力。",
          "zh-TW": "韓國國際展覽中心（KINTEX）是韓國規模最大的國際展覽會議中心。\n\n於2005年4月29日開館，最大特點是可輕鬆承辦以往韓國國內展館難以容納的大型重物展覽與活動。\n\n作為由京畿道、高陽市與大韓貿易投資振興公社（KOTRA）共同出資的國際展館，為經濟振興、創造就業與社會貢獻發揮作用。\n\n尤其透過與政府建構緊密合作體系，不僅培育展覽支援產業與引入以尖端展覽技術為基礎的產業，還藉助市民參與改善地方文化觀光條件，為韓國MICE產業發展持續努力。",
        },
      },
    ], access: [], know: [],
    // 오더 #V2 [1] 그룹 A: TourAPI 250465 확신 매칭.
    ko_card: [{ name_ko: "킨텍스", address_ko: "경기도 고양시 일산서구 킨텍스로 217-60" }],
    map: [{ lat: 37.6689357879, lng: 126.7455635138, label: "킨텍스" }],
    credits: [], related: [],
    info: { hours: "varies", duration: "half_day", admission: "varies", access: "wheelchair" },
    // 오더 #E1 [3]: highlights 교체 (10홀 + 걷는 거리 + GTX).
    highlights: [
      { ko: "제1·2전시장 10개 홀", en: "Ten halls across Halls 1 and 2", ja: "第1·第2展示場10ホール", "zh-CN": "第一、第二展馆共十个展厅", "zh-TW": "第一、第二展館共十個展廳" },
      { ko: "걸어서 닿는 거리에 전시관·수족관·백화점", en: "A gallery, aquarium and department store within walking distance", ja: "徒歩圏に展示館·水族館·百貨店", "zh-CN": "步行可达展馆、水族馆与百货商场", "zh-TW": "步行可達展館、水族館與百貨商場" },
      { ko: "GTX 킨텍스역", en: "GTX Kintex Station", ja: "GTXキンテックス駅", "zh-CN": "GTX韩国国际展览中心站", "zh-TW": "GTX韓國國際展覽中心站" },
    ],
    adSlot: null,
    // 오더 #C22: 킨텍스 실사진 3장 (사장님 배치본 · card/ 폴더 정리하며 spots/로 이동).
    //   Type1/Type3 아님 · cpyrht 미설정 (TourAPI 외 소스). credit 미설정.
    gallery: [
      { url: "/images/spots/kintex-1.jpg" },
      { url: "/images/spots/kintex-2.jpg" },
      { url: "/images/spots/kintex-3.jpg" },
    ],
    nearest_station: { name: { ko: "GTX 킨텍스역", en: "GTX Kintex Stn.", ja: "GTX キンテックス駅", "zh-CN": "GTX 韩国国际展览中心站", "zh-TW": "GTX 韓國國際展覽中心站" }, walk_min: null },
    official_url: "http://www.kintex.com",
    best_selected: false,
    tourapi: { contentid: "250465", overview_ko: "킨텍스(KINTEX)는 대한민국 최대 규모의 국제적 전시 컨벤션 센터이다. 2005년 4월 29일 개장하였으며, 기존 국내 전시장에서 수용하기 어려웠던 대형 중량물 전시 및 이벤트 개최가 용이하게 된 것이 가장 큰 특징이다. 경기도, 고양시, 코트라 공동출자 기관인 국제 전시장으로 경제 활성화와 일자리 창출, 지역 사회 공헌에 기여하고 있다. 특히 대정부와의 긴밀한 협력체계 구축을 통해 전시 지원 산업 육성 및 첨단 전시 기술 기반 산업 유치뿐 아니라 시민 참여를 통한 지자체 문화 관광 여건 개선 등 대한민국 MICE 산업 발전을 위해 노력하고 있다.", homepage: "http://www.kintex.com" },
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
    // 오더 #C3 [1]: 사장님 확정 소개글 원문 이식 (about-19-spots.md). 창작·의역 0. 5로케일 ko 폴백.
    sections: [
      {
        heading: { ko: "소개", en: "About", ja: "紹介", "zh-CN": "介绍", "zh-TW": "介紹" },
        body: {
          ko: "겉보기엔 4만 석 규모의 평범한 종합경기장이지만, 지금 이곳은 K-POP과 글로벌 공연의 새로운 메카로 떠올랐다. BTS·블랙핑크·지드래곤·데이식스 같은 K-팝 최정상 뮤지션들이 이곳을 찾았고, 해외 톱스타로는 2024년 8월 칸예 웨스트, 2025년 4월 콜드플레이가 특설무대에 올랐다. 콜드플레이는 2025년 4월 16일부터 25일까지 이곳에서 6회 공연을 펼쳤다.\n\n어떻게 고양이 대형 공연의 중심이 됐을까. 대형공연의 단골이던 잠실종합운동장이 리모델링에 들어갔고, 상암월드컵경기장 등은 프로축구 일정 때문에 공연장으로 쓰기 어려운 반면, 고양종합운동장은 4만 석 규모에 인천공항과 가깝고 3호선 대곡역·GTX-A 킨텍스역으로 이어져 입지가 뛰어나다. 무엇보다 고양에 프로축구팀이 없어 경기장을 공연장으로 쓰기에 부담이 덜하다.\n\n방문 팁: 3호선 대화역 3번 출구에서 도보 약 3분, GTX-A 킨텍스역과도 가깝다. K-콘텐츠를 보러 고양에 온다면 공연 일정을 먼저 확인하고 동선을 짜는 것이 좋다.",
          en: "겉보기엔 4만 석 규모의 평범한 종합경기장이지만, 지금 이곳은 K-POP과 글로벌 공연의 새로운 메카로 떠올랐다. BTS·블랙핑크·지드래곤·데이식스 같은 K-팝 최정상 뮤지션들이 이곳을 찾았고, 해외 톱스타로는 2024년 8월 칸예 웨스트, 2025년 4월 콜드플레이가 특설무대에 올랐다. 콜드플레이는 2025년 4월 16일부터 25일까지 이곳에서 6회 공연을 펼쳤다.\n\n어떻게 고양이 대형 공연의 중심이 됐을까. 대형공연의 단골이던 잠실종합운동장이 리모델링에 들어갔고, 상암월드컵경기장 등은 프로축구 일정 때문에 공연장으로 쓰기 어려운 반면, 고양종합운동장은 4만 석 규모에 인천공항과 가깝고 3호선 대곡역·GTX-A 킨텍스역으로 이어져 입지가 뛰어나다. 무엇보다 고양에 프로축구팀이 없어 경기장을 공연장으로 쓰기에 부담이 덜하다.\n\n방문 팁: 3호선 대화역 3번 출구에서 도보 약 3분, GTX-A 킨텍스역과도 가깝다. K-콘텐츠를 보러 고양에 온다면 공연 일정을 먼저 확인하고 동선을 짜는 것이 좋다.",
          ja: "겉보기엔 4만 석 규모의 평범한 종합경기장이지만, 지금 이곳은 K-POP과 글로벌 공연의 새로운 메카로 떠올랐다. BTS·블랙핑크·지드래곤·데이식스 같은 K-팝 최정상 뮤지션들이 이곳을 찾았고, 해외 톱스타로는 2024년 8월 칸예 웨스트, 2025년 4월 콜드플레이가 특설무대에 올랐다. 콜드플레이는 2025년 4월 16일부터 25일까지 이곳에서 6회 공연을 펼쳤다.\n\n어떻게 고양이 대형 공연의 중심이 됐을까. 대형공연의 단골이던 잠실종합운동장이 리모델링에 들어갔고, 상암월드컵경기장 등은 프로축구 일정 때문에 공연장으로 쓰기 어려운 반면, 고양종합운동장은 4만 석 규모에 인천공항과 가깝고 3호선 대곡역·GTX-A 킨텍스역으로 이어져 입지가 뛰어나다. 무엇보다 고양에 프로축구팀이 없어 경기장을 공연장으로 쓰기에 부담이 덜하다.\n\n방문 팁: 3호선 대화역 3번 출구에서 도보 약 3분, GTX-A 킨텍스역과도 가깝다. K-콘텐츠를 보러 고양에 온다면 공연 일정을 먼저 확인하고 동선을 짜는 것이 좋다.",
          "zh-CN": "겉보기엔 4만 석 규모의 평범한 종합경기장이지만, 지금 이곳은 K-POP과 글로벌 공연의 새로운 메카로 떠올랐다. BTS·블랙핑크·지드래곤·데이식스 같은 K-팝 최정상 뮤지션들이 이곳을 찾았고, 해외 톱스타로는 2024년 8월 칸예 웨스트, 2025년 4월 콜드플레이가 특설무대에 올랐다. 콜드플레이는 2025년 4월 16일부터 25일까지 이곳에서 6회 공연을 펼쳤다.\n\n어떻게 고양이 대형 공연의 중심이 됐을까. 대형공연의 단골이던 잠실종합운동장이 리모델링에 들어갔고, 상암월드컵경기장 등은 프로축구 일정 때문에 공연장으로 쓰기 어려운 반면, 고양종합운동장은 4만 석 규모에 인천공항과 가깝고 3호선 대곡역·GTX-A 킨텍스역으로 이어져 입지가 뛰어나다. 무엇보다 고양에 프로축구팀이 없어 경기장을 공연장으로 쓰기에 부담이 덜하다.\n\n방문 팁: 3호선 대화역 3번 출구에서 도보 약 3분, GTX-A 킨텍스역과도 가깝다. K-콘텐츠를 보러 고양에 온다면 공연 일정을 먼저 확인하고 동선을 짜는 것이 좋다.",
          "zh-TW": "겉보기엔 4만 석 규모의 평범한 종합경기장이지만, 지금 이곳은 K-POP과 글로벌 공연의 새로운 메카로 떠올랐다. BTS·블랙핑크·지드래곤·데이식스 같은 K-팝 최정상 뮤지션들이 이곳을 찾았고, 해외 톱스타로는 2024년 8월 칸예 웨스트, 2025년 4월 콜드플레이가 특설무대에 올랐다. 콜드플레이는 2025년 4월 16일부터 25일까지 이곳에서 6회 공연을 펼쳤다.\n\n어떻게 고양이 대형 공연의 중심이 됐을까. 대형공연의 단골이던 잠실종합운동장이 리모델링에 들어갔고, 상암월드컵경기장 등은 프로축구 일정 때문에 공연장으로 쓰기 어려운 반면, 고양종합운동장은 4만 석 규모에 인천공항과 가깝고 3호선 대곡역·GTX-A 킨텍스역으로 이어져 입지가 뛰어나다. 무엇보다 고양에 프로축구팀이 없어 경기장을 공연장으로 쓰기에 부담이 덜하다.\n\n방문 팁: 3호선 대화역 3번 출구에서 도보 약 3분, GTX-A 킨텍스역과도 가깝다. K-콘텐츠를 보러 고양에 온다면 공연 일정을 먼저 확인하고 동선을 짜는 것이 좋다.",
        },
      },
    ], access: [], know: [],
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
    // 오더 #C3 [1]: 사장님 확정 소개글 원문 이식 (about-19-spots.md). 창작·의역 0. 5로케일 ko 폴백.
    sections: [
      {
        heading: { ko: "소개", en: "About", ja: "紹介", "zh-CN": "介绍", "zh-TW": "介紹" },
        body: {
          ko: "이름부터 이야기가 있는 곳이다. '원마운트(One Mount)'는 '일산(一山)'을 그대로 영어로 옮긴 것이다 — '일(一)=One, 산(山)=Mount'. 그런데 그 '일산'이라는 이름 자체가 사연이 깊다. 원래 이 땅은 '큰 산'이라는 뜻의 우리말 '한뫼'로 불렸는데, 일제강점기 지명 정리 때 '한(크다)'을 '하나(一)'로 잘못 읽으면서 '하나의 산 = 일산'이 되어버렸다. 즉 원마운트는 오래전의 오역까지 품고 태어난 이름인 셈이다.\n\n라페스타·웨스턴돔을 만든 고양 향토기업이 킨텍스 옆에 2013년 세운 복합문화시설로, 실내외 워터파크와 사계절 눈이 내리는 스노우파크, 쇼핑몰이 한 건물에 모여 있다.\n\n겨울이 아니어도 눈썰매를 타고, 여름에도 물놀이를 즐길 수 있어 아이 동반 가족의 하루 코스로 제격이다. 일산에서 보기 드문 SPA 브랜드 매장과 타코 양조장 같은 개성 있는 식음 공간도 함께 있다.",
          en: "이름부터 이야기가 있는 곳이다. '원마운트(One Mount)'는 '일산(一山)'을 그대로 영어로 옮긴 것이다 — '일(一)=One, 산(山)=Mount'. 그런데 그 '일산'이라는 이름 자체가 사연이 깊다. 원래 이 땅은 '큰 산'이라는 뜻의 우리말 '한뫼'로 불렸는데, 일제강점기 지명 정리 때 '한(크다)'을 '하나(一)'로 잘못 읽으면서 '하나의 산 = 일산'이 되어버렸다. 즉 원마운트는 오래전의 오역까지 품고 태어난 이름인 셈이다.\n\n라페스타·웨스턴돔을 만든 고양 향토기업이 킨텍스 옆에 2013년 세운 복합문화시설로, 실내외 워터파크와 사계절 눈이 내리는 스노우파크, 쇼핑몰이 한 건물에 모여 있다.\n\n겨울이 아니어도 눈썰매를 타고, 여름에도 물놀이를 즐길 수 있어 아이 동반 가족의 하루 코스로 제격이다. 일산에서 보기 드문 SPA 브랜드 매장과 타코 양조장 같은 개성 있는 식음 공간도 함께 있다.",
          ja: "이름부터 이야기가 있는 곳이다. '원마운트(One Mount)'는 '일산(一山)'을 그대로 영어로 옮긴 것이다 — '일(一)=One, 산(山)=Mount'. 그런데 그 '일산'이라는 이름 자체가 사연이 깊다. 원래 이 땅은 '큰 산'이라는 뜻의 우리말 '한뫼'로 불렸는데, 일제강점기 지명 정리 때 '한(크다)'을 '하나(一)'로 잘못 읽으면서 '하나의 산 = 일산'이 되어버렸다. 즉 원마운트는 오래전의 오역까지 품고 태어난 이름인 셈이다.\n\n라페스타·웨스턴돔을 만든 고양 향토기업이 킨텍스 옆에 2013년 세운 복합문화시설로, 실내외 워터파크와 사계절 눈이 내리는 스노우파크, 쇼핑몰이 한 건물에 모여 있다.\n\n겨울이 아니어도 눈썰매를 타고, 여름에도 물놀이를 즐길 수 있어 아이 동반 가족의 하루 코스로 제격이다. 일산에서 보기 드문 SPA 브랜드 매장과 타코 양조장 같은 개성 있는 식음 공간도 함께 있다.",
          "zh-CN": "이름부터 이야기가 있는 곳이다. '원마운트(One Mount)'는 '일산(一山)'을 그대로 영어로 옮긴 것이다 — '일(一)=One, 산(山)=Mount'. 그런데 그 '일산'이라는 이름 자체가 사연이 깊다. 원래 이 땅은 '큰 산'이라는 뜻의 우리말 '한뫼'로 불렸는데, 일제강점기 지명 정리 때 '한(크다)'을 '하나(一)'로 잘못 읽으면서 '하나의 산 = 일산'이 되어버렸다. 즉 원마운트는 오래전의 오역까지 품고 태어난 이름인 셈이다.\n\n라페스타·웨스턴돔을 만든 고양 향토기업이 킨텍스 옆에 2013년 세운 복합문화시설로, 실내외 워터파크와 사계절 눈이 내리는 스노우파크, 쇼핑몰이 한 건물에 모여 있다.\n\n겨울이 아니어도 눈썰매를 타고, 여름에도 물놀이를 즐길 수 있어 아이 동반 가족의 하루 코스로 제격이다. 일산에서 보기 드문 SPA 브랜드 매장과 타코 양조장 같은 개성 있는 식음 공간도 함께 있다.",
          "zh-TW": "이름부터 이야기가 있는 곳이다. '원마운트(One Mount)'는 '일산(一山)'을 그대로 영어로 옮긴 것이다 — '일(一)=One, 산(山)=Mount'. 그런데 그 '일산'이라는 이름 자체가 사연이 깊다. 원래 이 땅은 '큰 산'이라는 뜻의 우리말 '한뫼'로 불렸는데, 일제강점기 지명 정리 때 '한(크다)'을 '하나(一)'로 잘못 읽으면서 '하나의 산 = 일산'이 되어버렸다. 즉 원마운트는 오래전의 오역까지 품고 태어난 이름인 셈이다.\n\n라페스타·웨스턴돔을 만든 고양 향토기업이 킨텍스 옆에 2013년 세운 복합문화시설로, 실내외 워터파크와 사계절 눈이 내리는 스노우파크, 쇼핑몰이 한 건물에 모여 있다.\n\n겨울이 아니어도 눈썰매를 타고, 여름에도 물놀이를 즐길 수 있어 아이 동반 가족의 하루 코스로 제격이다. 일산에서 보기 드문 SPA 브랜드 매장과 타코 양조장 같은 개성 있는 식음 공간도 함께 있다.",
        },
      },
    ], access: [], know: [],
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
    // 오더 #C2 [2]: lead + onScreen.works[0] 검증 사실만 (BTS Ma City 곡·조형물·벽화). 창작·의역 0.
    sections: [
      {
        heading: { ko: "소개", en: "About", ja: "紹介", "zh-CN": "介绍", "zh-TW": "介紹" },
        body: {
          ko: "정발산역 2번 출구 앞에 자리한 관광안내소입니다. 관광 자료를 받고 시티투어를 문의할 수 있습니다.\n\n건물 외벽에는 고양시가 그린 벽화가 있고, 인근 육교 아래에는 BTS 곡 「Ma City」(2015, 앨범 The Most Beautiful Moment in Life, Part 2) 와 연관된 조형물이 설치되어 있습니다. 이 곡에는 일산 · 라페스타 · 웨스턴돔 · 후곡 · 호수공원 등 고양시의 장소가 이름 그대로 등장합니다.",
          en: "A tourist information centre in front of Jeongbalsan Station Exit 2. Travel material is available here, and city-tour queries can be made on the spot.\n\nThe building's exterior wall carries a mural commissioned by Goyang, and beneath the nearby footbridge stands an installation tied to the BTS song 「Ma City」 (2015, The Most Beautiful Moment in Life, Part 2). The song names several Goyang locations directly — Ilsan, Lafesta, Western Dom, Hugok, and Ilsan Lake Park.",
          ja: "鼎鉢山駅2番出口の前にある観光案内所です。観光資料を受け取り、シティツアーの相談ができます。\n\n建物の外壁には高陽市が描いた壁画があり、近くの歩道橋の下には BTS の楽曲「Ma City」(2015、アルバム The Most Beautiful Moment in Life, Part 2) にちなんだ造形物が設置されています。この曲には一山・ラフェスタ・ウエスタンドム・後谷・湖水公園など高陽市の場所が名前のまま登場します。",
          "zh-CN": "位于鼎钵山站2号出口前的旅游信息中心。可在此领取旅游资料，并咨询城市观光行程。\n\n建筑外墙有高阳市绘制的壁画，附近天桥下设有与 BTS 歌曲 「Ma City」(2015, 专辑 The Most Beautiful Moment in Life, Part 2) 相关的造形物。这首歌直接出现了一山、拉斐斯塔、西部圆顶、后谷、湖水公园等高阳市的地名。",
          "zh-TW": "位於鼎缽山站2號出口前的旅遊資訊中心。可在此領取旅遊資料，並諮詢城市觀光行程。\n\n建築外牆有高陽市繪製的壁畫，附近天橋下設有與 BTS 歌曲 「Ma City」(2015, 專輯 The Most Beautiful Moment in Life, Part 2) 相關的造形物。這首歌直接出現了一山、拉斐斯塔、西部圓頂、後谷、湖水公園等高陽市的地名。",
        },
      },
    ], access: [], know: [],
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
      // 오더 #C48 [해제]: .jpg.png 이중 확장자 정정 후 940×627 재인코딩 · 사장님 수동 배치 의도 살림.
      // -6 은 RM 벽화 (기존 -1~-3 에 이미 RM/조형물 배선 유형 확장 · 고양시 조성 공공벽화).
      { url: "/images/spots/goyang-tourist-center-4.jpg", credit: "출처: 한국관광공사 (공공누리 제1유형)", cpyrht: "Type1" },
      { url: "/images/spots/goyang-tourist-center-5.jpg", credit: "출처: 한국관광공사 (공공누리 제1유형)", cpyrht: "Type1" },
      { url: "/images/spots/goyang-tourist-center-6.jpg", credit: "출처: 한국관광공사 (공공누리 제1유형)", cpyrht: "Type1" },
      { url: "/images/spots/goyang-tourist-center-7.jpg", credit: "출처: 한국관광공사 (공공누리 제1유형)", cpyrht: "Type1" },
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

  // ─── 오더 #REV1: 미반영 콘텐츠 일괄 반영 ─────────────────────────
  //   spots-culture-kculture.md 문화 05·08 (goyang-museum-of-art · kkotnuri) — 5로케일 완비.
  //     ※ 09 aqua-studio · 10 cultural-foundation-space 는 원본 md 에 title/subtitle/lead
  //       자체가 없어(전면 확인필요) 반영 제외.
  //   spots-food-01-10.md 미식 03·06·08·09 (jeongbalsan-cafe-street · hallyu-world-dining
  //     · bamridan-gil · starfield-dining) — 5로케일 완비.
  //   spot-drink-goyang.md 신규 스팟 — 5로케일 완비. food/subtype:drink.
  //     ※ courses 「만드는 곳을 따라」와 「역사 연결」 블록은 스팟 스키마에 대응 필드가
  //       없어 이번 이식에서 반영 제외 (원본 md 는 유지, 스키마 확장 후 별도 오더).
  //     ※ info.access "varies" 는 SpotInfoAccess enum(wheelchair/partial/inquiry) 에 없어
  //       "inquiry" 로 매핑. 원문 값 자체는 유지 필요 시 tourapi 필드 확장 후 별도 오더.

  {
    slug: "goyang-museum-of-art",
    category: "culture",
    type: "list",
    region: "확인필요",
    title: { ko: "고양시립미술관", en: "Goyang Museum of Art", ja: "高陽市立美術館", "zh-CN": "高阳市立美术馆", "zh-TW": "高陽市立美術館" },
    title_en_display: "GOYANG MUSEUM OF ART",
    subtitle: {
      ko: "지역 미술을 보여주는 공간",
      en: "A window on the city's art scene",
      ja: "地域の美術を見せる空間",
      "zh-CN": "展现本地美术的空间",
      "zh-TW": "展現本地美術的空間",
    },
    lead: {
      ko: "고양의 시립 미술 전시 공간입니다. 지역 작가와 기획전이 번갈아 열립니다.",
      en: "The city's public art venue, alternating between local artists and curated shows.",
      ja: "高陽の市立美術展示空間です。地域作家と企画展が交互に開かれます。",
      "zh-CN": "高阳市立美术展览空间，本地作家展与策划展交替举办。",
      "zh-TW": "高陽市立美術展覽空間，本地作家展與策劃展交替舉辦。",
    },
    meta: { updated_at: "2026-09-01" },
    sections: [], access: [], know: [],
    ko_card: [{ name_ko: "고양시립미술관", address_ko: null }],
    credits: [], related: [],
    info: { hours: "varies", duration: "1h", admission: "varies", access: "wheelchair" },
    highlights: [
      { ko: "지역 작가 전시", en: "Shows by local artists", ja: "地域作家の展示", "zh-CN": "本地作家展览", "zh-TW": "本地作家展覽" },
      { ko: "기획전 운영", en: "Curated exhibitions", ja: "企画展の運営", "zh-CN": "策划展览", "zh-TW": "策劃展覽" },
      { ko: "시립 공공 공간", en: "A public city venue", ja: "市立の公共空間", "zh-CN": "市立公共空间", "zh-TW": "市立公共空間" },
    ],
    adSlot: null,
    best_selected: false,
  },

  {
    slug: "kkotnuri",
    category: "culture",
    type: "list",
    region: "확인필요",
    title: { ko: "꽃누리", en: "Kkot Nuri", ja: "コンヌリ", "zh-CN": "花世界", "zh-TW": "花世界" },
    title_en_display: "KKOT NURI",
    subtitle: {
      ko: "소규모 공연이 열리는 공간",
      en: "A venue for smaller performances",
      ja: "小規模公演が開かれる空間",
      "zh-CN": "举办小型演出的场地",
      "zh-TW": "舉辦小型演出的場地",
    },
    lead: {
      ko: "대형 공연장과 달리 규모가 작은 공연 공간입니다. 무대와 객석이 가까워 밀도 있는 공연을 볼 수 있습니다.",
      en: "A smaller venue than the main halls, with stage and seats close together for a more intimate performance.",
      ja: "大型公演場とは異なる小規模な公演空間です。舞台と客席が近く、密度のある公演を楽しめます。",
      "zh-CN": "与大型场馆不同的小型演出空间。舞台与观众席距离近，观演体验更为紧密。",
      "zh-TW": "與大型場館不同的小型演出空間。舞台與觀眾席距離近，觀演體驗更為緊密。",
    },
    meta: { updated_at: "2026-09-01" },
    sections: [], access: [], know: [],
    ko_card: [{ name_ko: "꽃누리", address_ko: null }],
    credits: [], related: [],
    info: { hours: "varies", duration: "1_2h", admission: "varies", access: "partial" },
    highlights: [
      { ko: "무대와 객석이 가까움", en: "Stage close to the seats", ja: "舞台と客席が近い", "zh-CN": "舞台与观众席相近", "zh-TW": "舞台與觀眾席相近" },
      { ko: "소규모 공연 중심", en: "Smaller-scale programming", ja: "小規模公演中心", "zh-CN": "以小型演出为主", "zh-TW": "以小型演出為主" },
    ],
    adSlot: null,
    best_selected: false,
  },

  {
    slug: "bamridan-gil",
    category: "food",
    subtype: "restaurant",
    type: "list",
    region: "일산동구",
    title: { ko: "밤리단길", en: "Bamridan-gil", ja: "バムリダン通り", "zh-CN": "栗里断街", "zh-TW": "栗里斷街" },
    title_en_display: "BAMRIDAN-GIL",
    subtitle: {
      ko: "주택가 사이에 생긴 골목 상권",
      en: "A lane that grew up between houses",
      ja: "住宅街の間にできた路地商圏",
      "zh-CN": "住宅区之间形成的巷弄商圈",
      "zh-TW": "住宅區之間形成的巷弄商圈",
    },
    lead: {
      ko: "주택가 골목을 따라 카페와 작은 음식점이 들어선 곳입니다. 대형 상권보다 규모는 작지만 개성 있는 가게가 많아 천천히 둘러보기 좋습니다.",
      en: "Cafes and small restaurants that have opened along a residential lane. It is smaller than the main districts but full of individual shops, so it rewards a slow wander.",
      ja: "住宅街の路地に沿ってカフェや小さな飲食店が入った場所です。大型商圏より規模は小さいものの個性のある店が多く、ゆっくり見て回るのに向いています。",
      "zh-CN": "沿住宅区巷弄开设咖啡馆与小餐厅之处。规模小于大型商圈，但个性小店众多，适合慢慢逛。",
      "zh-TW": "沿住宅區巷弄開設咖啡館與小餐廳之處。規模小於大型商圈，但個性小店眾多，適合慢慢逛。",
    },
    meta: { updated_at: "2026-09-02" },
    // 오더 #C6 [A]: 사장님 확정 소개글 원문 이식 (기존 #V4 TourAPI overview_ko 원문 대체).
    // 창작·의역 0. 5로케일 ko 폴백(A안).
    sections: [
      {
        heading: { ko: "소개", en: "About", ja: "紹介", "zh-CN": "介绍", "zh-TW": "介紹" },
        body: {
          ko: "일산에서 지금 가장 뜨거운 골목. 정발산동 밤가시마을의 오래된 주택가 골목에 2010년대 중반부터 감각적인 카페·레스토랑·베이커리가 하나둘 들어서면서, 서울 경리단길에 빗대어 '밤리단길'로 불리게 됐다.\n\n이름의 뿌리는 밤나무다. 예부터 이 일대는 밤나무가 울창해 밤송이 가시가 흙바닥에 지천으로 널렸다 하여 '밤가시마을'로 불렸고, 밤리단길의 '밤'도 여기서 왔다. 골목 한가운데엔 150년 넘은 밤가시초가(경기도 민속문화재 제8호)가 그대로 보존돼 있다.\n\n앤티크 가구거리에서 출발한 만큼 골목마다 개성이 다르고, 예쁜 연못과 노래하는 분수대의 야경도 함께 즐길 수 있다. 대화역·킨텍스에서 멀지 않아, 공연장 앞 번잡함을 벗어나 여유로운 한 끼를 보내기 좋다. 다만 오래된 주택가라 주차가 까다로우니 공영주차장을 이용하는 게 좋다.",
          en: "Now Ilsan's hottest lane. From the mid-2010s, tasteful cafes, restaurants, and bakeries began opening one by one along the old residential lanes of Bamgasi Village in Jeongbalsan-dong; borrowing from Seoul's Gyeongnidan-gil, the area came to be called \"Bamridan-gil.\"\n\nThe name goes back to chestnut trees (bam). Chestnut trees once grew densely here, and the ground was said to be strewn with the spiny burrs of chestnut husks — hence \"Bamgasi (chestnut-burr) Village,\" and the \"Bam\" in Bamridan-gil comes from the same root. In the middle of the lane stands Bamgasi Thatched House (Gyeonggi Folk Cultural Heritage No. 8), a house over 150 years old, still preserved.\n\nBecause the area began as an antique-furniture street, each lane has its own character, and you can also enjoy a pretty pond and the night view of the Singing Fountain. Not far from Daehwa Stn. and KINTEX, it is a good place to step away from the crowds outside a performance venue and take a relaxed meal. As this is an old residential area, however, parking is tight — using a public parking lot is recommended.",
          ja: "今、一山（イルサン）で最も熱い路地。鼎鉢山洞（チョンバルサンドン）バムガシ村の古い住宅街の路地に、2010年代半ばから感度の高いカフェ・レストラン・ベーカリーが少しずつ入り始め、ソウルの経理団通り（キョンリダンギル）になぞらえて「バムリダン通り」と呼ばれるようになりました。\n\n名前の由来は栗の木（밤／バム）です。古くからこの一帯は栗の木が生い茂り、栗のいがのトゲが土の上に一面に散らばっていたことから「バムガシ（栗いが）村」と呼ばれ、バムリダン通りの「バム」もここに由来します。路地の真ん中には150年以上の歴史を持つバムガシ草家（京畿道民俗文化財第8号）がそのまま保存されています。\n\nアンティーク家具の通りとして始まっただけあって、路地ごとに個性が異なり、可愛い池と「歌う噴水台」の夜景も一緒に楽しめます。大化（テファ）駅・KINTEXから遠くなく、公演場前の賑やかさを離れてゆったりとした一食を過ごすのに向いています。ただし古い住宅街のため駐車が難しく、公営駐車場の利用をおすすめします。",
          "zh-CN": "如今一山最热闹的巷弄。鼎钵山洞栗刺村（Bamgasi）的老住宅巷弄，从2010年代中期开始，一家家有格调的咖啡馆、餐厅与烘焙店陆续入驻，仿效首尔的经理团街，被称为「栗里断街（Bamridan-gil）」。\n\n名字的根源在栗子树（밤／bam）。自古这一带栗树茂密，栗子壳的刺满地皆是，故被称为「栗刺村」，栗里断街的「栗（bam）」也源于此。巷弄中央保留着历史逾150年的栗刺草屋（京畿道民俗文化财第8号）。\n\n此处起始于古董家具街，因此每条巷弄各具风情，还能欣赏漂亮的池塘与「歌唱喷泉」的夜景。距大化站与KINTEX不远，非常适合在演出场馆前的喧嚣之外享用一顿从容的餐食。但因是老住宅区，停车不便，建议使用公营停车场。",
          "zh-TW": "如今一山最熱鬧的巷弄。鼎缽山洞栗刺村（Bamgasi）的老住宅巷弄，從2010年代中期開始，一家家有格調的咖啡館、餐廳與烘焙店陸續進駐，仿效首爾的經理團街，被稱為「栗里斷街（Bamridan-gil）」。\n\n名字的根源在栗子樹（밤／bam）。自古這一帶栗樹茂密，栗子殼的刺滿地皆是，故被稱為「栗刺村」，栗里斷街的「栗（bam）」也源於此。巷弄中央保留著歷史逾150年的栗刺草屋（京畿道民俗文化財第8號）。\n\n此處起始於古董家具街，因此每條巷弄各具風情，還能欣賞漂亮的池塘與「歌唱噴泉」的夜景。距大化站與KINTEX不遠，非常適合在演出場館前的喧囂之外享用一頓從容的餐食。但因是老住宅區，停車不便，建議使用公營停車場。",
        },
      },
    ], access: [], know: [],
    // 오더 #V2 [1] 그룹 A: TourAPI 3018574 확신 매칭 (addr+map+tourapi 신규, homepage 없음).
    ko_card: [{ name_ko: "밤리단길", address_ko: "경기도 고양시 일산동구 정발산동" }],
    map: [{ lat: 37.6721, lng: 126.7841, label: "밤리단길" }],
    credits: [], related: [],
    info: { hours: "varies", duration: "1h", admission: "varies", access: "partial" },
    highlights: [
      { ko: "개성 있는 작은 가게", en: "Individual small shops", ja: "個性のある小さな店", "zh-CN": "个性小店", "zh-TW": "個性小店" },
      { ko: "주택가 골목 분위기", en: "A residential lane atmosphere", ja: "住宅街の路地の雰囲気", "zh-CN": "住宅巷弄氛围", "zh-TW": "住宅巷弄氛圍" },
      { ko: "천천히 둘러보기 좋음", en: "Good for a slow wander", ja: "ゆっくり見て回れる", "zh-CN": "适合慢慢逛", "zh-TW": "適合慢慢逛" },
    ],
    adSlot: null,
    nearest_station: { name: { ko: "3호선 마두역", en: "Madu Stn. (Line 3)", ja: "3号線 馬頭駅", "zh-CN": "3号线 马头站", "zh-TW": "3號線 馬頭站" }, walk_min: null },
    best_selected: false,
    tourapi: { contentid: "3018574", overview_ko: "일산의 앤티크 가구거리 골목골목에는 다양한 종류의 음식점과 카페가 있는데 이곳을 밤리단길이라 부른다. 경의선 풍산역 1번 출구로 나가면 6분 거리에 있는 밤가시 마을 부근이다. 경리단길, 망리단길, 가로수길처럼 유명해진 길을 따라 음식점이나 가게, 카페 등이 생겨난 곳이다. 이곳에는 세계의 다양한 음식점과 색다른 멋을 가진 카페, 베이커리 등 사진 스폿들이 많아 설레는 마음으로 둘러볼 수 있다. 또한 밤리단길에는 예쁜 연못과 노래하는 분수대도 설치되어 있고, 그 야경도 멋지다. 밤리단길 대부분의 가게 앞에는 주차하기가 어려운 편이라 근처 공영 주차장에 주차를 하는 것이 좋다. 고즈넉한 분위기의 골목을 따라 작은 가게들이 옹기종기 모여있고, 앤티크한 분위기와 감성이 공생하는 길, 맛있는 음식점이 많은 길, 즐길 거리가 있는 길이다. 색다른 여행을 원한다면 한 번쯤 둘러보기 좋을 듯하다." },
    foodHub: {
      // 오더 #C20 [1]: 미식 허브 큐레이션 · TourAPI 공공데이터 등재분만.
      //   §5-4 준수 · 창작 금지 · overview 첫 문장만 이식.
      //   FOOD 10 + CAFE 8 · NIGHT 4 (기존 spot 재사용) · COURSES 2h/4h.
      headline: {"ko":"밤리단길 미식 허브","en":"밤리단길 미식 허브","ja":"밤리단길 미식 허브","zh-CN":"밤리단길 미식 허브","zh-TW":"밤리단길 미식 허브"},
      subhead: {"ko":"정발산·산두로 카페골목부터 애니골까지, 도보권 미식 지도","en":"정발산·산두로 카페골목부터 애니골까지, 도보권 미식 지도","ja":"정발산·산두로 카페골목부터 애니골까지, 도보권 미식 지도","zh-CN":"정발산·산두로 카페골목부터 애니골까지, 도보권 미식 지도","zh-TW":"정발산·산두로 카페골목부터 애니골까지, 도보권 미식 지도"},
      food: [
      {
        id: "peaches-springs",
        contentid: "2735300",
        title: { ko: "피치스프링스", en: "피치스프링스", ja: "피치스프링스", "zh-CN": "피치스프링스", "zh-TW": "피치스프링스" },
        addr_ko: "경기도 고양시 일산동구 산두로175번길 6-1 (정발산동)",
        first_sentence: {
          ko: "피치 스프링스는 라스베이거스와 그랜드 캐넌을 이어주는 66번 국도 중간에 있는 작은 마을의 이름으로 운영자가 오랜 미국, 캐나다 생활과 요식업을 바탕으로 북미 현지의 맛과 분위기를 그대로 전하기 위해 창업한 일산의 브런치 맛집이다.",
          en: "피치 스프링스는 라스베이거스와 그랜드 캐넌을 이어주는 66번 국도 중간에 있는 작은 마을의 이름으로 운영자가 오랜 미국, 캐나다 생활과 요식업을 바탕으로 북미 현지의 맛과 분위기를 그대로 전하기 위해 창업한 일산의 브런치 맛집이다.",
          ja: "피치 스프링스는 라스베이거스와 그랜드 캐넌을 이어주는 66번 국도 중간에 있는 작은 마을의 이름으로 운영자가 오랜 미국, 캐나다 생활과 요식업을 바탕으로 북미 현지의 맛과 분위기를 그대로 전하기 위해 창업한 일산의 브런치 맛집이다.",
          "zh-CN": "피치 스프링스는 라스베이거스와 그랜드 캐넌을 이어주는 66번 국도 중간에 있는 작은 마을의 이름으로 운영자가 오랜 미국, 캐나다 생활과 요식업을 바탕으로 북미 현지의 맛과 분위기를 그대로 전하기 위해 창업한 일산의 브런치 맛집이다.",
          "zh-TW": "피치 스프링스는 라스베이거스와 그랜드 캐넌을 이어주는 66번 국도 중간에 있는 작은 마을의 이름으로 운영자가 오랜 미국, 캐나다 생활과 요식업을 바탕으로 북미 현지의 맛과 분위기를 그대로 전하기 위해 창업한 일산의 브런치 맛집이다.",
        },
        lat: 37.673085575,
        lng: 126.7829136365,
        homepage: "http://instagram.com/peachsprings_",
      },
      {
        id: "mini-thai",
        contentid: "2875618",
        title: { ko: "미니타이", en: "미니타이", ja: "미니타이", "zh-CN": "미니타이", "zh-TW": "미니타이" },
        addr_ko: "경기도 고양시 일산동구 산두로145번길 1 (정발산동)",
        first_sentence: {
          ko: "미니타이는 밤가시마을 밤리단길에 있는 태국 음식 전문점이다.",
          en: "미니타이는 밤가시마을 밤리단길에 있는 태국 음식 전문점이다.",
          ja: "미니타이는 밤가시마을 밤리단길에 있는 태국 음식 전문점이다.",
          "zh-CN": "미니타이는 밤가시마을 밤리단길에 있는 태국 음식 전문점이다.",
          "zh-TW": "미니타이는 밤가시마을 밤리단길에 있는 태국 음식 전문점이다.",
        },
        lat: 37.6705109088,
        lng: 126.7848274231,
        homepage: "https://www.instagram.com/minithai_",
      },
      {
        id: "hyogyo",
        contentid: "2854077",
        title: { ko: "효교", en: "효교", ja: "효교", "zh-CN": "효교", "zh-TW": "효교" },
        addr_ko: "경기도 고양시 일산동구 일산로380번길 41 (정발산동)",
        first_sentence: {
          ko: "효교는 경기도 고양시 일산동구 정발산동에 있는 중식당이다.",
          en: "효교는 경기도 고양시 일산동구 정발산동에 있는 중식당이다.",
          ja: "효교는 경기도 고양시 일산동구 정발산동에 있는 중식당이다.",
          "zh-CN": "효교는 경기도 고양시 일산동구 정발산동에 있는 중식당이다.",
          "zh-TW": "효교는 경기도 고양시 일산동구 정발산동에 있는 중식당이다.",
        },
        lat: 37.67050269506418,
        lng: 126.78302616879292,
      },
      {
        id: "alice-bakery",
        contentid: "2866758",
        title: { ko: "앨리스 케이커리", en: "앨리스 케이커리", ja: "앨리스 케이커리", "zh-CN": "앨리스 케이커리", "zh-TW": "앨리스 케이커리" },
        addr_ko: "경기도 고양시 일산동구 경의로 459-78 1층",
        first_sentence: {
          ko: "일산 밤가시마을(일명 밤리단길)에 있는 앨리스 케이커리는 케이크 맛집이다.",
          en: "일산 밤가시마을(일명 밤리단길)에 있는 앨리스 케이커리는 케이크 맛집이다.",
          ja: "일산 밤가시마을(일명 밤리단길)에 있는 앨리스 케이커리는 케이크 맛집이다.",
          "zh-CN": "일산 밤가시마을(일명 밤리단길)에 있는 앨리스 케이커리는 케이크 맛집이다.",
          "zh-TW": "일산 밤가시마을(일명 밤리단길)에 있는 앨리스 케이커리는 케이크 맛집이다.",
        },
        lat: 37.670469261,
        lng: 126.7856106862,
        homepage: "https://www.instagram.com/alicescakery_",
      },
      {
        id: "monghwa-garak",
        contentid: "2874934",
        title: { ko: "몽화가락", en: "몽화가락", ja: "몽화가락", "zh-CN": "몽화가락", "zh-TW": "몽화가락" },
        addr_ko: "경기도 고양시 일산동구 일산로394번길 19-9 (정발산동)",
        first_sentence: {
          ko: "몽화가락은 일산 정발산동 밤가시마을에 있는 고깃집이다.",
          en: "몽화가락은 일산 정발산동 밤가시마을에 있는 고깃집이다.",
          ja: "몽화가락은 일산 정발산동 밤가시마을에 있는 고깃집이다.",
          "zh-CN": "몽화가락은 일산 정발산동 밤가시마을에 있는 고깃집이다.",
          "zh-TW": "몽화가락은 일산 정발산동 밤가시마을에 있는 고깃집이다.",
        },
        lat: 37.670972908127325,
        lng: 126.78194204944843,
      },
      {
        id: "hosuyang-gopchang",
        contentid: "2830359",
        title: { ko: "호수양곱창구이전문점 일산본점", en: "호수양곱창구이전문점 일산본점", ja: "호수양곱창구이전문점 일산본점", "zh-CN": "호수양곱창구이전문점 일산본점", "zh-TW": "호수양곱창구이전문점 일산본점" },
        addr_ko: "경기도 고양시 일산동구 무궁화로181번길 8-11 (정발산동)",
        first_sentence: {
          ko: "호수양곱창구이전문점은 소의 양, 곱창, 대창, 막창, 차돌구이, 염통, 내장탕 등을 맛볼 수 있는 구이 전문점이다.",
          en: "호수양곱창구이전문점은 소의 양, 곱창, 대창, 막창, 차돌구이, 염통, 내장탕 등을 맛볼 수 있는 구이 전문점이다.",
          ja: "호수양곱창구이전문점은 소의 양, 곱창, 대창, 막창, 차돌구이, 염통, 내장탕 등을 맛볼 수 있는 구이 전문점이다.",
          "zh-CN": "호수양곱창구이전문점은 소의 양, 곱창, 대창, 막창, 차돌구이, 염통, 내장탕 등을 맛볼 수 있는 구이 전문점이다.",
          "zh-TW": "호수양곱창구이전문점은 소의 양, 곱창, 대창, 막창, 차돌구이, 염통, 내장탕 등을 맛볼 수 있는 구이 전문점이다.",
        },
        lat: 37.6716496022,
        lng: 126.7812971581,
      },
      {
        id: "katsu-eat",
        contentid: "2874859",
        title: { ko: "가츠잇", en: "가츠잇", ja: "가츠잇", "zh-CN": "가츠잇", "zh-TW": "가츠잇" },
        addr_ko: "경기도 고양시 일산동구 경의로 459-112 (정발산동)",
        first_sentence: {
          ko: "경기도 고양시 밤리단길에 위치한 가츠잇은 일본식 돈가츠 전문점이다.",
          en: "경기도 고양시 밤리단길에 위치한 가츠잇은 일본식 돈가츠 전문점이다.",
          ja: "경기도 고양시 밤리단길에 위치한 가츠잇은 일본식 돈가츠 전문점이다.",
          "zh-CN": "경기도 고양시 밤리단길에 위치한 가츠잇은 일본식 돈가츠 전문점이다.",
          "zh-TW": "경기도 고양시 밤리단길에 위치한 가츠잇은 일본식 돈가츠 전문점이다.",
        },
        lat: 37.6698221165,
        lng: 126.7857412479,
      },
      {
        id: "iri-restaurant",
        contentid: "2875385",
        title: { ko: "2리 식당", en: "2리 식당", ja: "2리 식당", "zh-CN": "2리 식당", "zh-TW": "2리 식당" },
        addr_ko: "경기도 고양시 일산동구 일산로372번길 59 (정발산동)",
        first_sentence: {
          ko: "2리 식당은 경기도 고양시 밤리단길에 위치한 일식덮밥 전문점이다.",
          en: "2리 식당은 경기도 고양시 밤리단길에 위치한 일식덮밥 전문점이다.",
          ja: "2리 식당은 경기도 고양시 밤리단길에 위치한 일식덮밥 전문점이다.",
          "zh-CN": "2리 식당은 경기도 고양시 밤리단길에 위치한 일식덮밥 전문점이다.",
          "zh-TW": "2리 식당은 경기도 고양시 밤리단길에 위치한 일식덮밥 전문점이다.",
        },
        lat: 37.66957168828406,
        lng: 126.78518440867933,
      },
      {
        id: "hihihi",
        contentid: "2875397",
        title: { ko: "히히히", en: "히히히", ja: "히히히", "zh-CN": "히히히", "zh-TW": "히히히" },
        addr_ko: "경기도 고양시 일산동구 일산로394번길 10 (정발산동)",
        first_sentence: {
          ko: "히히히는 에그타르트와 커피를 판매하는 일산 밤리단길 맛집이다.",
          en: "히히히는 에그타르트와 커피를 판매하는 일산 밤리단길 맛집이다.",
          ja: "히히히는 에그타르트와 커피를 판매하는 일산 밤리단길 맛집이다.",
          "zh-CN": "히히히는 에그타르트와 커피를 판매하는 일산 밤리단길 맛집이다.",
          "zh-TW": "히히히는 에그타르트와 커피를 판매하는 일산 밤리단길 맛집이다.",
        },
        lat: 37.6702025537,
        lng: 126.7815888389,
        homepage: "https://www.instagram.com/hee__hee__hee",
      },
      {
        id: "bamgasi-burger",
        contentid: "2843736",
        title: { ko: "밤가시버거", en: "밤가시버거", ja: "밤가시버거", "zh-CN": "밤가시버거", "zh-TW": "밤가시버거" },
        addr_ko: "경기도 고양시 일산동구 일산로372번길 46 (정발산동)",
        first_sentence: {
          ko: "밤가시버거는 일산동구 밤리단길 안쪽에 있다.",
          en: "밤가시버거는 일산동구 밤리단길 안쪽에 있다.",
          ja: "밤가시버거는 일산동구 밤리단길 안쪽에 있다.",
          "zh-CN": "밤가시버거는 일산동구 밤리단길 안쪽에 있다.",
          "zh-TW": "밤가시버거는 일산동구 밤리단길 안쪽에 있다.",
        },
        lat: 37.6691388425,
        lng: 126.7846358128,
        homepage: "https://www.instagram.com/bamgasiburger",
      },
      ],
      cafe: [
      {
        id: "tico-coffee",
        contentid: "2875219",
        title: { ko: "티코커피", en: "티코커피", ja: "티코커피", "zh-CN": "티코커피", "zh-TW": "티코커피" },
        addr_ko: "경기도 고양시 일산동구 일산로394번길 5-18 (정발산동)",
        first_sentence: {
          ko: "티코커피는 밤리단길 저동고등학교 근처에 있는 크로플 맛집이다.",
          en: "티코커피는 밤리단길 저동고등학교 근처에 있는 크로플 맛집이다.",
          ja: "티코커피는 밤리단길 저동고등학교 근처에 있는 크로플 맛집이다.",
          "zh-CN": "티코커피는 밤리단길 저동고등학교 근처에 있는 크로플 맛집이다.",
          "zh-TW": "티코커피는 밤리단길 저동고등학교 근처에 있는 크로플 맛집이다.",
        },
        lat: 37.6707024978,
        lng: 126.7817165909,
        homepage: "https://www.instagram.com/tico_coffee",
      },
      {
        id: "cafe-sobi",
        contentid: "2875123",
        title: { ko: "카페소비", en: "카페소비", ja: "카페소비", "zh-CN": "카페소비", "zh-TW": "카페소비" },
        addr_ko: "경기도 고양시 일산동구 산두로 134 (정발산동)",
        first_sentence: {
          ko: "경기도 일산시 밤리단길에 위치한 카페 소비는 보다 좋은 소비를 위해 만든 공간이다.",
          en: "경기도 일산시 밤리단길에 위치한 카페 소비는 보다 좋은 소비를 위해 만든 공간이다.",
          ja: "경기도 일산시 밤리단길에 위치한 카페 소비는 보다 좋은 소비를 위해 만든 공간이다.",
          "zh-CN": "경기도 일산시 밤리단길에 위치한 카페 소비는 보다 좋은 소비를 위해 만든 공간이다.",
          "zh-TW": "경기도 일산시 밤리단길에 위치한 카페 소비는 보다 좋은 소비를 위해 만든 공간이다.",
        },
        lat: 37.6697748977,
        lng: 126.7856245932,
        homepage: "https://www.instagram.com/cafe_sobi",
      },
      {
        id: "peak-coffee",
        contentid: "2772246",
        title: { ko: "피크커피", en: "피크커피", ja: "피크커피", "zh-CN": "피크커피", "zh-TW": "피크커피" },
        addr_ko: "경기도 고양시 일산동구 일산로380번길 5-23 (정발산동)",
        first_sentence: {
          ko: "일산 밤가시마을에 있는 흰색과 우드의 조합으로 테이블은 양쪽으로 4~5 테이블씩 있고 창이 나 있는 쪽은 환하고 시야가 트여 있는 분위기 좋은 카페이다.",
          en: "일산 밤가시마을에 있는 흰색과 우드의 조합으로 테이블은 양쪽으로 4~5 테이블씩 있고 창이 나 있는 쪽은 환하고 시야가 트여 있는 분위기 좋은 카페이다.",
          ja: "일산 밤가시마을에 있는 흰색과 우드의 조합으로 테이블은 양쪽으로 4~5 테이블씩 있고 창이 나 있는 쪽은 환하고 시야가 트여 있는 분위기 좋은 카페이다.",
          "zh-CN": "일산 밤가시마을에 있는 흰색과 우드의 조합으로 테이블은 양쪽으로 4~5 테이블씩 있고 창이 나 있는 쪽은 환하고 시야가 트여 있는 분위기 좋은 카페이다.",
          "zh-TW": "일산 밤가시마을에 있는 흰색과 우드의 조합으로 테이블은 양쪽으로 4~5 테이블씩 있고 창이 나 있는 쪽은 환하고 시야가 트여 있는 분위기 좋은 카페이다.",
        },
        lat: 37.6701358905,
        lng: 126.7813499737,
        homepage: "https://www.instagram.com/peakcoffee__",
      },
      {
        id: "mi-wan-seong-cafe",
        contentid: "2874953",
        title: { ko: "미완성카페", en: "미완성카페", ja: "미완성카페", "zh-CN": "미완성카페", "zh-TW": "미완성카페" },
        addr_ko: "경기도 고양시 일산동구 애니골길43번길 17-1 (풍동)",
        first_sentence: {
          ko: "미완성카페는 일산동구 풍동 애니골에 있는 베이커리 카페다.",
          en: "미완성카페는 일산동구 풍동 애니골에 있는 베이커리 카페다.",
          ja: "미완성카페는 일산동구 풍동 애니골에 있는 베이커리 카페다.",
          "zh-CN": "미완성카페는 일산동구 풍동 애니골에 있는 베이커리 카페다.",
          "zh-TW": "미완성카페는 일산동구 풍동 애니골에 있는 베이커리 카페다.",
        },
        lat: 37.6722024774,
        lng: 126.7903740902,
      },
      {
        id: "bluff-coffee",
        contentid: "2830469",
        title: { ko: "블러프커피", en: "블러프커피", ja: "블러프커피", "zh-CN": "블러프커피", "zh-TW": "블러프커피" },
        addr_ko: "경기도 고양시 일산동구 일산로316번길 53-1 (마두동)",
        first_sentence: {
          ko: "블러프커피는 고양시 밤리단길 중심거리에서 조금 떨어져 있는 한적한 주택 1층에 있다.",
          en: "블러프커피는 고양시 밤리단길 중심거리에서 조금 떨어져 있는 한적한 주택 1층에 있다.",
          ja: "블러프커피는 고양시 밤리단길 중심거리에서 조금 떨어져 있는 한적한 주택 1층에 있다.",
          "zh-CN": "블러프커피는 고양시 밤리단길 중심거리에서 조금 떨어져 있는 한적한 주택 1층에 있다.",
          "zh-TW": "블러프커피는 고양시 밤리단길 중심거리에서 조금 떨어져 있는 한적한 주택 1층에 있다.",
        },
        lat: 37.6648027709,
        lng: 126.7873779656,
      },
      {
        id: "miluku-coffee",
        contentid: "2772263",
        title: { ko: "미루꾸커피", en: "미루꾸커피", ja: "미루꾸커피", "zh-CN": "미루꾸커피", "zh-TW": "미루꾸커피" },
        addr_ko: "경기도 고양시 일산동구 일산로316번길 25-1 (마두동)",
        first_sentence: {
          ko: "일산 밤리단길에 있는 르뱅 쿠키와 바스크 치즈케이크 등 다양한 디저트와 특색있는 커피를 즐길 수 있는 카페이다.",
          en: "일산 밤리단길에 있는 르뱅 쿠키와 바스크 치즈케이크 등 다양한 디저트와 특색있는 커피를 즐길 수 있는 카페이다.",
          ja: "일산 밤리단길에 있는 르뱅 쿠키와 바스크 치즈케이크 등 다양한 디저트와 특색있는 커피를 즐길 수 있는 카페이다.",
          "zh-CN": "일산 밤리단길에 있는 르뱅 쿠키와 바스크 치즈케이크 등 다양한 디저트와 특색있는 커피를 즐길 수 있는 카페이다.",
          "zh-TW": "일산 밤리단길에 있는 르뱅 쿠키와 바스크 치즈케이크 등 다양한 디저트와 특색있는 커피를 즐길 수 있는 카페이다.",
        },
        lat: 37.6643227614,
        lng: 126.7859719375,
        homepage: "https://www.instagram.com/mirukku_coffee",
      },
      {
        id: "named-coffee",
        contentid: "2830017",
        title: { ko: "네임드커피", en: "네임드커피", ja: "네임드커피", "zh-CN": "네임드커피", "zh-TW": "네임드커피" },
        addr_ko: "경기도 고양시 일산동구 일산로286번길 14-1",
        first_sentence: {
          ko: "네임드커피는 고양시 일산동구 마두동에 있다.",
          en: "네임드커피는 고양시 일산동구 마두동에 있다.",
          ja: "네임드커피는 고양시 일산동구 마두동에 있다.",
          "zh-CN": "네임드커피는 고양시 일산동구 마두동에 있다.",
          "zh-TW": "네임드커피는 고양시 일산동구 마두동에 있다.",
        },
        lat: 37.6615342162,
        lng: 126.7870524729,
        homepage: "https://www.instagram.com/named_coffee",
      },
      {
        id: "goya-cafe",
        contentid: "3356049",
        title: { ko: "고야카페", en: "고야카페", ja: "고야카페", "zh-CN": "고야카페", "zh-TW": "고야카페" },
        addr_ko: "경기도 고양시 일산동구 중앙로 1271-1 (장항동)",
        first_sentence: {
          ko: "경기도 고양 관광정보센터 내부에 위치해서 고양시 관광을 소개하는 카페이다.",
          en: "경기도 고양 관광정보센터 내부에 위치해서 고양시 관광을 소개하는 카페이다.",
          ja: "경기도 고양 관광정보센터 내부에 위치해서 고양시 관광을 소개하는 카페이다.",
          "zh-CN": "경기도 고양 관광정보센터 내부에 위치해서 고양시 관광을 소개하는 카페이다.",
          "zh-TW": "경기도 고양 관광정보센터 내부에 위치해서 고양시 관광을 소개하는 카페이다.",
        },
        lat: 37.6595397482,
        lng: 126.7727121731,
      },
      ],
      night: [
        {
          slug: "bamridan-gil",
          note: {
            ko: "연못과 노래하는 분수대 · 앤티크 골목 야경",
            en: "The pond, the singing fountain, and antique alleys after dark",
            ja: "池と歌う噴水・アンティーク路地の夜景",
            "zh-CN": "池塘与音乐喷泉·古董巷弄夜景",
            "zh-TW": "池塘與音樂噴泉·古董巷弄夜景",
          },
        },
        {
          slug: "bamgasi-thatched-house",
          note: {
            ko: "150년 초가 · 밤 조명",
            en: "150-year-old thatched house lit at night",
            ja: "150年の草家・夜間照明",
            "zh-CN": "150年草屋·夜间照明",
            "zh-TW": "150年草屋·夜間照明",
          },
        },
        {
          slug: "ilsan-lake-park",
          note: {
            ko: "애수교 야경 · 노래하는분수대 주말 가동",
            en: "Aesu-gyo lakeside at night · fountain on weekends",
            ja: "哀愁橋の夜景・週末は歌う噴水",
            "zh-CN": "哀愁桥夜景·周末音乐喷泉",
            "zh-TW": "哀愁橋夜景·週末音樂噴泉",
          },
        },
        {
          slug: "jeongbalsan-park",
          note: {
            ko: "정발산에서 내려다보는 일산 야경",
            en: "Ilsan skyline from Jeongbalsan",
            ja: "鼎鉢山から見下ろす一山の夜景",
            "zh-CN": "从鼎钵山俯瞰一山夜景",
            "zh-TW": "從鼎缽山俯瞰一山夜景",
          },
        },
      ],
      courses: [
        {
          key: "2h",
          label: {"ko":"2시간 코스 · 약 1.5 km","en":"2시간 코스 · 약 1.5 km","ja":"2시간 코스 · 약 1.5 km","zh-CN":"2시간 코스 · 약 1.5 km","zh-TW":"2시간 코스 · 약 1.5 km"},
          stops: ["bamgasi-thatched-house","hyogyo","monghwa-garak","mini-thai","tico-coffee","cafe-sobi","alice-bakery","bamgasi-burger"],
        },
        {
          key: "4h",
          label: {"ko":"4시간 코스 · 약 3 km","en":"4시간 코스 · 약 3 km","ja":"4시간 코스 · 약 3 km","zh-CN":"4시간 코스 · 약 3 km","zh-TW":"4시간 코스 · 약 3 km"},
          stops: ["bamgasi-thatched-house","hyogyo","monghwa-garak","mini-thai","tico-coffee","cafe-sobi","alice-bakery","bamgasi-burger","mi-wan-seong-cafe","bluff-coffee","miluku-coffee"],
        },
      ],
      credit: {"ko":"출처: 한국관광공사 공공데이터포털 (TourAPI)","en":"출처: 한국관광공사 공공데이터포털 (TourAPI)","ja":"출처: 한국관광공사 공공데이터포털 (TourAPI)","zh-CN":"출처: 한국관광공사 공공데이터포털 (TourAPI)","zh-TW":"출처: 한국관광공사 공공데이터포털 (TourAPI)"},
    },
  },

  {
    slug: "starfield-dining",
    category: "food",
    subtype: "restaurant",
    type: "list",
    region: "덕양구",
    title: { ko: "스타필드 고양 식당가", en: "Starfield Goyang Dining", ja: "スターフィールド高陽 飲食街", "zh-CN": "星芒城高阳餐饮区", "zh-TW": "星芒城高陽餐飲區" },
    title_en_display: "STARFIELD GOYANG DINING",
    subtitle: {
      ko: "날씨와 상관없이 먹을 수 있는 곳",
      en: "Dining that works whatever the weather",
      ja: "天気に左右されず食べられる場所",
      "zh-CN": "不受天气影响的用餐场所",
      "zh-TW": "不受天氣影響的用餐場所",
    },
    lead: {
      ko: "대형 복합쇼핑몰 안에 자리한 식당가입니다. 실내라 날씨에 영향을 받지 않고, 여러 종류의 음식이 한 층에 모여 있어 일행끼리 취향이 갈릴 때 편합니다.",
      en: "The dining floor inside a large shopping complex. Being indoors, it is unaffected by weather, and the range of cuisines on one floor makes it easy when a group cannot agree.",
      ja: "大型複合ショッピングモール内にある飲食街です。屋内のため天気に左右されず、複数の料理が一つのフロアに集まっているので同行者の好みが分かれるときに便利です。",
      "zh-CN": "位于大型综合购物中心内的餐饮区。室内不受天气影响，多种料理集中于同一楼层，同行者口味不一时尤为方便。",
      "zh-TW": "位於大型綜合購物中心內的餐飲區。室內不受天氣影響，多種料理集中於同一樓層，同行者口味不一時尤為方便。",
    },
    meta: { updated_at: "2026-09-01" },
    // 오더 #C3 [1]: 사장님 확정 소개글 원문 이식 (about-19-spots.md). 창작·의역 0. 5로케일 ko 폴백.
    sections: [
      {
        heading: { ko: "소개", en: "About", ja: "紹介", "zh-CN": "介绍", "zh-TW": "介紹" },
        body: {
          ko: "'별들의 들판(Starfield)'이라는 이름 그대로, 신세계가 만든 초대형 복합쇼핑몰 안의 식음 공간이다. 쇼핑·엔터테인먼트·미식이 한 지붕 아래 모여, 날씨와 상관없이 하루를 보낼 수 있다.\n\n고양대로변에 있어 킨텍스·원마운트와 함께 고양 서부의 대형 소비 벨트를 이룬다. 가족 단위 방문객이 식사부터 디저트까지 한 번에 해결하기 좋은 곳이다.",
          en: "True to its name — a \"field of stars\" — this is the food and beverage floor inside a huge Shinsegae-built shopping complex. Shopping, entertainment, and dining sit under one roof, letting you spend a full day here regardless of the weather.\n\nSet along Goyang-daero, it forms Goyang's western mega-retail belt together with KINTEX and One Mount. It works well for families that want to cover a meal through dessert in one place.",
          ja: "「星の野原（Starfield）」という名前どおり、新世界（Shinsegae）が手がけた超大型複合ショッピングモール内の飲食空間です。ショッピング・エンターテインメント・グルメが一つ屋根の下に集まり、天気に左右されず一日を過ごせます。\n\n高陽大路（コヤンデロ）沿いにあり、KINTEX・ワンマウント（One Mount）とともに高陽西部の大型消費ベルトを形成します。ファミリー来場者が食事からデザートまで一か所で済ませるのに向いています。",
          "zh-CN": "如其名「星之原野（Starfield）」，这是新世界打造的超大型综合购物中心内的餐饮空间。购物、娱乐、美食汇于同一屋顶下，不受天气影响，可畅玩一整天。\n\n位于高阳大路沿线，与KINTEX、One Mount 一起构成高阳西部的大型消费带。适合家庭访客一次解决从正餐到甜点的需求。",
          "zh-TW": "如其名「星之原野（Starfield）」，這是新世界打造的超大型綜合購物中心內的餐飲空間。購物、娛樂、美食匯於同一屋頂下，不受天氣影響，可暢玩一整天。\n\n位於高陽大路沿線，與KINTEX、One Mount 一起構成高陽西部的大型消費帶。適合家庭訪客一次解決從正餐到甜點的需求。",
        },
      },
    ], access: [], know: [],
    ko_card: [{ name_ko: "스타필드 고양", address_ko: null }],
    credits: [], related: [],
    info: { hours: "varies", duration: "1h", admission: "varies", access: "wheelchair" },
    highlights: [
      { ko: "실내라 날씨 영향 없음", en: "Indoors, weatherproof", ja: "屋内で天気に左右されない", "zh-CN": "室内不受天气影响", "zh-TW": "室內不受天氣影響" },
      { ko: "여러 종류가 한 층에", en: "Many cuisines on one floor", ja: "複数の料理が一つのフロアに", "zh-CN": "多种料理集中一层", "zh-TW": "多種料理集中一層" },
      { ko: "일행끼리 취향이 갈릴 때", en: "Useful for mixed groups", ja: "同行者の好みが分かれるときに", "zh-CN": "适合口味不一的同行者", "zh-TW": "適合口味不一的同行者" },
    ],
    adSlot: null,
    best_selected: false,
  },

  {
    slug: "drink-goyang",
    category: "food",
    subtype: "drink",
    type: "course",
    region: "고양 전역",
    title: { ko: "고양이 만드는 것", en: "What Goyang Makes", ja: "高陽がつくるもの", "zh-CN": "高阳所酿所焙", "zh-TW": "高陽所釀所焙" },
    title_en_display: "DRINK GOYANG",
    subtitle: {
      ko: "커피를 볶고, 술을 빚는 도시",
      en: "A city that roasts and brews",
      ja: "珈琲を焙煎し、酒を醸す街",
      "zh-CN": "焙咖啡、酿酒的城市",
      "zh-TW": "焙咖啡、釀酒的城市",
    },
    lead: {
      ko: "이 도시에는 커피를 직접 볶는 곳과 술을 직접 빚는 곳이 있습니다. 사서 파는 것이 아니라 만들어 파는 곳입니다. 고양시는 관내 커피 관련 업체를 전수 조사하고 커피 특화 도시를 추진하고 있고, 전통주 양조장은 지역 쌀로 술을 빚습니다. 오천 년 전 볍씨가 나온 땅에서 지금도 쌀로 술을 만듭니다.",
      en: "In this city there are places that roast their own coffee and places that brew their own alcohol — not resellers, but makers. The city has surveyed every coffee-related business within its boundaries and is pursuing a coffee-specialised city plan, while local breweries make their drinks from rice grown here. On ground where 5,020-year-old rice grains were found, rice is still turned into drink.",
      ja: "この街には珈琲を自ら焙煎する場所と、酒を自ら醸す場所があります。仕入れて売るのではなく、つくって売る場所です。高陽市は市内の珈琲関連事業者を悉皆調査し、珈琲特化都市を推進しており、伝統酒の醸造場は地域の米で酒を醸します。五千年前の籾が出土した土地で、今も米から酒がつくられています。",
      "zh-CN": "这座城市有自行焙炒咖啡之处，也有自行酿酒之处——不是转售，而是制造。高阳市已对辖内咖啡相关业者进行全面普查，并推动咖啡特色城市建设；传统酒酿造场则以当地稻米酿酒。在出土五千年前稻种的土地上，如今仍以米酿酒。",
      "zh-TW": "這座城市有自行焙炒咖啡之處，也有自行釀酒之處——不是轉售，而是製造。高陽市已對轄內咖啡相關業者進行全面普查，並推動咖啡特色城市建設；傳統酒釀造場則以當地稻米釀酒。在出土五千年前稻種的土地上，如今仍以米釀酒。",
    },
    meta: { updated_at: "2026-09-01" },
    sections: [], access: [], know: [],
    ko_card: [{ name_ko: "고양이 만드는 것", address_ko: null }],
    credits: [], related: [],
    info: { hours: "varies", duration: "half_day", admission: "varies", access: "inquiry" },
    highlights: [
      { ko: "직접 볶는 로스터리", en: "Roasteries that roast on site", ja: "自家焙煎のロースタリー", "zh-CN": "自行焙炒的烘豆坊", "zh-TW": "自行焙炒的烘豆坊" },
      { ko: "지역 쌀로 빚는 전통주", en: "Traditional drinks made from local rice", ja: "地域の米で醸す伝統酒", "zh-CN": "以当地稻米酿制的传统酒", "zh-TW": "以當地稻米釀製的傳統酒" },
      { ko: "도시 안에 있는 양조장", en: "Breweries inside the city", ja: "街の中にある醸造場", "zh-CN": "城中的酿造场", "zh-TW": "城中的釀造場" },
    ],
    adSlot: null,
    best_selected: false,
    nearby: {
      eyebrow: "MADE IN GOYANG",
      title: {
        ko: "이 도시가 만드는 것",
        en: "Made in This City",
        ja: "この街がつくるもの",
        "zh-CN": "这座城市的出品",
        "zh-TW": "這座城市的出品",
      },
      items: [
        {
          name: { ko: "커피", en: "Coffee", ja: "珈琲", "zh-CN": "咖啡", "zh-TW": "咖啡" },
          tag: {
            ko: "고양시는 관내 커피 관련 업체 약 2천 곳을 전수 조사하고 커피 특화 도시를 추진하고 있습니다. 원두를 직접 볶는 로스터리가 여러 곳 있고, 식품제조 허가를 받아 원두를 생산하는 곳도 있습니다. 대형 프랜차이즈가 아니라 한 사람이 볶는 규모의 가게들입니다.",
            en: "The city has surveyed some two thousand coffee-related businesses within its boundaries and is pursuing a coffee-specialised city plan. A number of roasteries roast their own beans, and some hold food-manufacturing licences to produce them. These are not large chains but shops at the scale of one person at a roaster.",
            ja: "高陽市は市内の珈琲関連事業者約2千か所を悉皆調査し、珈琲特化都市を推進しています。豆を自ら焙煎するロースタリーが複数あり、食品製造の許可を得て豆を生産する所もあります。大手チェーンではなく、一人が焙煎する規模の店です。",
            "zh-CN": "高阳市已对辖内约两千家咖啡相关业者进行普查，并推动咖啡特色城市建设。多处烘豆坊自行焙炒咖啡豆，亦有取得食品制造许可生产豆子者。这些并非大型连锁，而是一人操作烘豆机的规模。",
            "zh-TW": "高陽市已對轄內約兩千家咖啡相關業者進行普查，並推動咖啡特色城市建設。多處烘豆坊自行焙炒咖啡豆，亦有取得食品製造許可生產豆子者。這些並非大型連鎖，而是一人操作烘豆機的規模。",
          },
        },
        {
          name: { ko: "전통주", en: "Korean Traditional Drinks", ja: "伝統酒", "zh-CN": "传统酒", "zh-TW": "傳統酒" },
          tag: {
            ko: "쌀과 누룩으로 빚는 탁주와 약주를 만드는 양조장이 있습니다. 고양시는 2025년 전국막걸리축제에서 지역 양조장 다섯 곳을 소개했습니다. 그중에는 지역에서 나는 쌀을 주원료로 쓰는 곳도 있습니다. 오천 년 전 볍씨가 나온 땅에서 이어지는 일입니다.",
            en: "There are breweries making takju and yakju from rice and nuruk. In 2025 the city presented five local breweries at a national makgeolli festival. Some of them use rice grown in the area as their main ingredient — a line running back to the ground where 5,020-year-old grains were found.",
            ja: "米と麹で醸す濁酒と薬酒をつくる醸造場があります。高陽市は2025年の全国マッコリ祭りで地域の醸造場五か所を紹介しました。その中には地域産の米を主原料とする所もあります。五千年前の籾が出土した土地から続いていることです。",
            "zh-CN": "有以稻米与曲酿制浊酒与药酒的酿造场。2025年高阳市在全国马格利酒庆典上介绍了五家本地酿造场，其中部分以当地稻米为主要原料——这与出土五千年前稻种的土地一脉相承。",
            "zh-TW": "有以稻米與麴釀製濁酒與藥酒的釀造場。2025年高陽市在全國馬格利酒慶典上介紹了五家本地釀造場，其中部分以當地稻米為主要原料——這與出土五千年前稻種的土地一脈相承。",
          },
          note: {
            ko: "술 빚기를 직접 해볼 수 있는 양조장도 있습니다.",
            en: "Some breweries let you take part in the brewing itself.",
            ja: "酒づくりを実際に体験できる醸造場もあります。",
            "zh-CN": "部分酿造场亦可亲身参与酿造。",
            "zh-TW": "部分釀造場亦可親身參與釀造。",
          },
        },
        {
          name: { ko: "수제맥주", en: "Craft Beer", ja: "クラフトビール", "zh-CN": "精酿啤酒", "zh-TW": "精釀啤酒" },
          tag: {
            ko: "도시 안에 소규모 양조 시설이 있습니다. 한 곳은 한국 전통 탈놀이의 가면에서 이름을 딴 제품을 만듭니다. 대량 생산이 아니라 소량을 만들어 그 자리에서 파는 방식입니다.",
            en: "Small-scale brewing facilities operate within the city. One takes the names of its products from the masks of a Korean traditional masked dance. These are small batches made and sold on site rather than mass-produced.",
            ja: "街の中に小規模な醸造施設があります。ある一つは韓国伝統の仮面劇の面から名を取った製品をつくっています。大量生産ではなく、少量をつくってその場で売る方式です。",
            "zh-CN": "城中设有小规模酿造设施。其中一处的产品以韩国传统假面剧的面具命名。并非大量生产，而是小批量制作、就地销售。",
            "zh-TW": "城中設有小規模釀造設施。其中一處的產品以韓國傳統假面劇的面具命名。並非大量生產，而是小批量製作、就地銷售。",
          },
        },
      ],
    },
    partnerCta: {
      ko: "양조장이나 로스터리를 운영하시나요? 제휴 문의",
      en: "Do you run a brewery or roastery? Partner with us",
      ja: "醸造場やロースタリーを運営されていますか? 提携のお問い合わせ",
      "zh-CN": "您经营酿造场或烘豆坊吗？合作咨询",
      "zh-TW": "您經營釀造場或烘豆坊嗎？合作諮詢",
    },
  },
  // ─── 오더 #B1 [1]: SHOPPING 앵커 9곳 신규 (라페스타·웨스턴돔·일산시장 은 기존 spot 재사용) ───

  {
    slug: "starfield-goyang",
    category: "shopping",
    type: "list",
    region: "덕양구",
    title: { ko: "스타필드 고양", en: "Starfield Goyang", ja: "スターフィールド高陽", "zh-CN": "Starfield 高阳", "zh-TW": "Starfield 高陽" },
    title_en_display: "STARFIELD GOYANG",
    subtitle: { ko: "덕양구의 대형 복합쇼핑몰", en: "A large mixed-use mall in Deokyang", ja: "徳陽区の大型複合ショッピングモール", "zh-CN": "德阳区大型综合购物中心", "zh-TW": "德陽區大型綜合購物中心" },
    lead: {
      ko: "스타필드 고양은 서울과 경기 서북부를 연결하는 관문적 위치에 있다.",
      en: "스타필드 고양은 서울과 경기 서북부를 연결하는 관문적 위치에 있다.",
      ja: "스타필드 고양은 서울과 경기 서북부를 연결하는 관문적 위치에 있다.",
      "zh-CN": "스타필드 고양은 서울과 경기 서북부를 연결하는 관문적 위치에 있다.",
      "zh-TW": "스타필드 고양은 서울과 경기 서북부를 연결하는 관문적 위치에 있다.",
    },
    meta: { updated_at: "2026-09-02" },
    // 오더 #B1 [1][b]: TourAPI overview_ko 원문 이식. 5로케일 ko 폴백.
    sections: [
      {
        heading: { ko: "소개", en: "About", ja: "紹介", "zh-CN": "介绍", "zh-TW": "介紹" },
        body: {
          ko: "스타필드 고양은 서울과 경기 서북부를 연결하는 관문적 위치에 있다. 북한산의 아름다운 자연환경과 성곽, 솟을 문, 망루 등 예로부터 이어져 온 한국적 건축 모티브들을 현대적으로 재해석하여 건축 디자인에 접목하였다. 트렌디한 패션 뷰티 전문관부터 합리적 가격대의 창고형 하이퍼마켓, 업그레이드된 마켓까지 하나의 공간에서 다양한 쇼핑과 여가 문화를 편안하고 쾌적하게 즐기실 수 있다. 사계절 온천수로 즐길 수 있는 아쿠아필드, 최신 시설의 시네마, 아이들을 위한 복합놀이 공간과 다양한 특화 서비스 시설까지 온 가족이 함께 소중한 추억을 만들 수 있다.\n\n(출처 : 스타필드 고양 홈페이지)",
          en: "스타필드 고양은 서울과 경기 서북부를 연결하는 관문적 위치에 있다. 북한산의 아름다운 자연환경과 성곽, 솟을 문, 망루 등 예로부터 이어져 온 한국적 건축 모티브들을 현대적으로 재해석하여 건축 디자인에 접목하였다. 트렌디한 패션 뷰티 전문관부터 합리적 가격대의 창고형 하이퍼마켓, 업그레이드된 마켓까지 하나의 공간에서 다양한 쇼핑과 여가 문화를 편안하고 쾌적하게 즐기실 수 있다. 사계절 온천수로 즐길 수 있는 아쿠아필드, 최신 시설의 시네마, 아이들을 위한 복합놀이 공간과 다양한 특화 서비스 시설까지 온 가족이 함께 소중한 추억을 만들 수 있다.\n\n(출처 : 스타필드 고양 홈페이지)",
          ja: "스타필드 고양은 서울과 경기 서북부를 연결하는 관문적 위치에 있다. 북한산의 아름다운 자연환경과 성곽, 솟을 문, 망루 등 예로부터 이어져 온 한국적 건축 모티브들을 현대적으로 재해석하여 건축 디자인에 접목하였다. 트렌디한 패션 뷰티 전문관부터 합리적 가격대의 창고형 하이퍼마켓, 업그레이드된 마켓까지 하나의 공간에서 다양한 쇼핑과 여가 문화를 편안하고 쾌적하게 즐기실 수 있다. 사계절 온천수로 즐길 수 있는 아쿠아필드, 최신 시설의 시네마, 아이들을 위한 복합놀이 공간과 다양한 특화 서비스 시설까지 온 가족이 함께 소중한 추억을 만들 수 있다.\n\n(출처 : 스타필드 고양 홈페이지)",
          "zh-CN": "스타필드 고양은 서울과 경기 서북부를 연결하는 관문적 위치에 있다. 북한산의 아름다운 자연환경과 성곽, 솟을 문, 망루 등 예로부터 이어져 온 한국적 건축 모티브들을 현대적으로 재해석하여 건축 디자인에 접목하였다. 트렌디한 패션 뷰티 전문관부터 합리적 가격대의 창고형 하이퍼마켓, 업그레이드된 마켓까지 하나의 공간에서 다양한 쇼핑과 여가 문화를 편안하고 쾌적하게 즐기실 수 있다. 사계절 온천수로 즐길 수 있는 아쿠아필드, 최신 시설의 시네마, 아이들을 위한 복합놀이 공간과 다양한 특화 서비스 시설까지 온 가족이 함께 소중한 추억을 만들 수 있다.\n\n(출처 : 스타필드 고양 홈페이지)",
          "zh-TW": "스타필드 고양은 서울과 경기 서북부를 연결하는 관문적 위치에 있다. 북한산의 아름다운 자연환경과 성곽, 솟을 문, 망루 등 예로부터 이어져 온 한국적 건축 모티브들을 현대적으로 재해석하여 건축 디자인에 접목하였다. 트렌디한 패션 뷰티 전문관부터 합리적 가격대의 창고형 하이퍼마켓, 업그레이드된 마켓까지 하나의 공간에서 다양한 쇼핑과 여가 문화를 편안하고 쾌적하게 즐기실 수 있다. 사계절 온천수로 즐길 수 있는 아쿠아필드, 최신 시설의 시네마, 아이들을 위한 복합놀이 공간과 다양한 특화 서비스 시설까지 온 가족이 함께 소중한 추억을 만들 수 있다.\n\n(출처 : 스타필드 고양 홈페이지)",
        },
      },
    ],
    access: [],
    know: [],
    // 오더 #B1 [1][b]: TourAPI addr1 · 좌표.
    ko_card: [{ name_ko: "스타필드 고양", address_ko: "경기도 고양시 덕양구 고양대로 1955" }],
    map: [{ lat: 37.646977059497985, lng: 126.89477800778101, label: "스타필드 고양" }],
    credits: [],
    related: [],
    // 오더 #B1: 소개형. varies 로 통일. price/booking 필드 신설 금지.
    info: { hours: "varies", duration: "1_2h", admission: "varies", access: "wheelchair" },
    highlights: [
      { ko: "서울·경기 서북부 관문 위치", en: "Starfield Goyang", ja: "スターフィールド高陽", "zh-CN": "Starfield 高阳", "zh-TW": "Starfield 高陽" },
      { ko: "신세계프라퍼티 운영", en: "Starfield Goyang", ja: "スターフィールド高陽", "zh-CN": "Starfield 高阳", "zh-TW": "Starfield 高陽" },
      { ko: "대중교통·자가용 접근 용이", en: "Starfield Goyang", ja: "スターフィールド高陽", "zh-CN": "Starfield 高阳", "zh-TW": "Starfield 高陽" },
    ],
    adSlot: null,
    // 오더 #C35 [2] 신규 배선 (자체 소스 · credit 미설정):
    //   1 (940×627): 야경 대표 (Starfield 사인 · 그랜드오프닝 배너 · 잔디밭)
    //   2 (940×627): 내부 조형물 (Samsung 매장 · 라이트닝 슈퍼히어로 마네킹)
    //   3 (940×627): 펫파크 (붉은 조형물 · 강아지들 · Shinsegae Factory Store)
    //   [3] Must-see 폴백 순서 2 (gallery 첫 장 승격) 로 자동 승격 — 야경 대표(1)가 Must-see 카드에 노출.
    gallery: [
      { url: "/images/spots/starfield-goyang-1.jpg" },
      { url: "/images/spots/starfield-goyang-2.jpg" },
      { url: "/images/spots/starfield-goyang-3.jpg" },
    ],
    official_url: "https://www.starfield.co.kr/goyang",
    best_selected: false,
    tourapi: { contentid: "3111794", overview_ko: "스타필드 고양은 서울과 경기 서북부를 연결하는 관문적 위치에 있다. 북한산의 아름다운 자연환경과 성곽, 솟을 문, 망루 등 예로부터 이어져 온 한국적 건축 모티브들을 현대적으로 재해석하여 건축 디자인에 접목하였다. 트렌디한 패션 뷰티 전문관부터 합리적 가격대의 창고형 하이퍼마켓, 업그레이드된 마켓까지 하나의 공간에서 다양한 쇼핑과 여가 문화를 편안하고 쾌적하게 즐기실 수 있다. 사계절 온천수로 즐길 수 있는 아쿠아필드, 최신 시설의 시네마, 아이들을 위한 복합놀이 공간과 다양한 특화 서비스 시설까지 온 가족이 함께 소중한 추억을 만들 수 있다.  (출처 : 스타필드 고양 홈페이지)", homepage: "https://www.starfield.co.kr/goyang" },
  },
  {
    slug: "wondang-market",
    category: "shopping",
    type: "list",
    region: "덕양구",
    title: { ko: "원당시장", en: "Wondang Market", ja: "元堂市場", "zh-CN": "元堂市场", "zh-TW": "元堂市場" },
    title_en_display: "WONDANG MARKET",
    subtitle: { ko: "성사동의 전통시장", en: "A traditional market in Seongsa-dong", ja: "城沙洞の伝統市場", "zh-CN": "城沙洞的传统市场", "zh-TW": "城沙洞的傳統市場" },
    lead: {
      ko: "고양시에 위치한 원당시장은 오랜 역사와 전통을 자랑하며, 지역 주민들의 삶과 밀접하게 맞닿아 있는 고양시의 대표적인 전통시장이다.",
      en: "고양시에 위치한 원당시장은 오랜 역사와 전통을 자랑하며, 지역 주민들의 삶과 밀접하게 맞닿아 있는 고양시의 대표적인 전통시장이다.",
      ja: "고양시에 위치한 원당시장은 오랜 역사와 전통을 자랑하며, 지역 주민들의 삶과 밀접하게 맞닿아 있는 고양시의 대표적인 전통시장이다.",
      "zh-CN": "고양시에 위치한 원당시장은 오랜 역사와 전통을 자랑하며, 지역 주민들의 삶과 밀접하게 맞닿아 있는 고양시의 대표적인 전통시장이다.",
      "zh-TW": "고양시에 위치한 원당시장은 오랜 역사와 전통을 자랑하며, 지역 주민들의 삶과 밀접하게 맞닿아 있는 고양시의 대표적인 전통시장이다.",
    },
    meta: { updated_at: "2026-09-02" },
    // 오더 #B1 [1][b]: TourAPI overview_ko 원문 이식. 5로케일 ko 폴백.
    sections: [
      {
        heading: { ko: "소개", en: "About", ja: "紹介", "zh-CN": "介绍", "zh-TW": "介紹" },
        body: {
          ko: "고양시에 위치한 원당시장은 오랜 역사와 전통을 자랑하며, 지역 주민들의 삶과 밀접하게 맞닿아 있는 고양시의 대표적인 전통시장이다. 현대화된 대형 마트와 쇼핑몰이 가득한 도심 속에서 옛 정취와 넉넉한 인심을 고스란히 간직한 채, 매일 활기차게 운영되는 전통시장이다. 볼거리가 많고 정겨운 분위기에 가족과 함께 방문하기에 좋은 시장이다.",
          en: "고양시에 위치한 원당시장은 오랜 역사와 전통을 자랑하며, 지역 주민들의 삶과 밀접하게 맞닿아 있는 고양시의 대표적인 전통시장이다. 현대화된 대형 마트와 쇼핑몰이 가득한 도심 속에서 옛 정취와 넉넉한 인심을 고스란히 간직한 채, 매일 활기차게 운영되는 전통시장이다. 볼거리가 많고 정겨운 분위기에 가족과 함께 방문하기에 좋은 시장이다.",
          ja: "고양시에 위치한 원당시장은 오랜 역사와 전통을 자랑하며, 지역 주민들의 삶과 밀접하게 맞닿아 있는 고양시의 대표적인 전통시장이다. 현대화된 대형 마트와 쇼핑몰이 가득한 도심 속에서 옛 정취와 넉넉한 인심을 고스란히 간직한 채, 매일 활기차게 운영되는 전통시장이다. 볼거리가 많고 정겨운 분위기에 가족과 함께 방문하기에 좋은 시장이다.",
          "zh-CN": "고양시에 위치한 원당시장은 오랜 역사와 전통을 자랑하며, 지역 주민들의 삶과 밀접하게 맞닿아 있는 고양시의 대표적인 전통시장이다. 현대화된 대형 마트와 쇼핑몰이 가득한 도심 속에서 옛 정취와 넉넉한 인심을 고스란히 간직한 채, 매일 활기차게 운영되는 전통시장이다. 볼거리가 많고 정겨운 분위기에 가족과 함께 방문하기에 좋은 시장이다.",
          "zh-TW": "고양시에 위치한 원당시장은 오랜 역사와 전통을 자랑하며, 지역 주민들의 삶과 밀접하게 맞닿아 있는 고양시의 대표적인 전통시장이다. 현대화된 대형 마트와 쇼핑몰이 가득한 도심 속에서 옛 정취와 넉넉한 인심을 고스란히 간직한 채, 매일 활기차게 운영되는 전통시장이다. 볼거리가 많고 정겨운 분위기에 가족과 함께 방문하기에 좋은 시장이다.",
        },
      },
    ],
    access: [],
    know: [],
    // 오더 #B1 [1][b]: TourAPI addr1 · 좌표.
    ko_card: [{ name_ko: "원당시장", address_ko: "경기도 고양시 덕양구 호국로790번길 17 (성사동)" }],
    map: [{ lat: 37.6562810028, lng: 126.8372528621, label: "원당시장" }],
    credits: [],
    related: [],
    // 오더 #B1: 소개형. varies 로 통일. price/booking 필드 신설 금지.
    info: { hours: "varies", duration: "1_2h", admission: "varies", access: "wheelchair" },
    highlights: [
      { ko: "덕양구 대표 재래시장", en: "Wondang Market", ja: "元堂市場", "zh-CN": "元堂市场", "zh-TW": "元堂市場" },
      { ko: "지역 주민 생활상권", en: "Wondang Market", ja: "元堂市場", "zh-CN": "元堂市场", "zh-TW": "元堂市場" },
      { ko: "원당역 도보권", en: "Wondang Market", ja: "元堂市場", "zh-CN": "元堂市场", "zh-TW": "元堂市場" },
    ],
    adSlot: null,
    // 오더 #C9: TourAPI Type1 상위 3장 신규 배선 (contentid 2736370).
    gallery: [
      { url: "/images/spots/wondang-market-1.jpg", credit: "출처: 한국관광공사 (공공누리 제1유형)", cpyrht: "Type1" },
      { url: "/images/spots/wondang-market-2.jpg", credit: "출처: 한국관광공사 (공공누리 제1유형)", cpyrht: "Type1" },
      { url: "/images/spots/wondang-market-3.jpg", credit: "출처: 한국관광공사 (공공누리 제1유형)", cpyrht: "Type1" },
    ],
    best_selected: false,
    tourapi: { contentid: "2736370", overview_ko: "고양시에 위치한 원당시장은 오랜 역사와 전통을 자랑하며, 지역 주민들의 삶과 밀접하게 맞닿아 있는 고양시의 대표적인 전통시장이다. 현대화된 대형 마트와 쇼핑몰이 가득한 도심 속에서 옛 정취와 넉넉한 인심을 고스란히 간직한 채, 매일 활기차게 운영되는 전통시장이다. 볼거리가 많고 정겨운 분위기에 가족과 함께 방문하기에 좋은 시장이다." },
  },
  {
    slug: "ilsan-furniture-district",
    category: "shopping",
    type: "list",
    region: "일산서구",
    title: { ko: "일산가구단지", en: "Ilsan Furniture District", ja: "一山家具団地", "zh-CN": "一山家具园区", "zh-TW": "一山家具園區" },
    title_en_display: "ILSAN FURNITURE DISTRICT",
    subtitle: { ko: "대형 규모의 가구 상권", en: "A large furniture district", ja: "大規模の家具団地", "zh-CN": "大型规模的家具园区", "zh-TW": "大型規模的家具園區" },
    lead: {
      ko: "일산가구단지는 고양에 위치한 대형 규모의 가구단지이다.",
      en: "일산가구단지는 고양에 위치한 대형 규모의 가구단지이다.",
      ja: "일산가구단지는 고양에 위치한 대형 규모의 가구단지이다.",
      "zh-CN": "일산가구단지는 고양에 위치한 대형 규모의 가구단지이다.",
      "zh-TW": "일산가구단지는 고양에 위치한 대형 규모의 가구단지이다.",
    },
    meta: { updated_at: "2026-09-02" },
    // 오더 #B1 [1][b]: TourAPI overview_ko 원문 이식. 5로케일 ko 폴백.
    sections: [
      {
        heading: { ko: "소개", en: "About", ja: "紹介", "zh-CN": "介绍", "zh-TW": "介紹" },
        body: {
          ko: "일산가구단지는 고양에 위치한 대형 규모의 가구단지이다. 대형 매장이 입점해 가구를 소비자와 직거래하는 방식으로 판매하기 때문에 할인된 제품이 많으며, 특정 기간에 행사가 열리기도 한다.\n브랜드 가구, 디자이너 가구, 수입 가구 등 다양한 종류와 디자인의 가구들을 직접 보고 구입할 수 있다는 장점이 있다. 보다 수월하게 선택할 수 있도록 가구의 쓰임새, 놓을 위치 등을 판단하여 전문가와 상담이 가능하다.",
          en: "일산가구단지는 고양에 위치한 대형 규모의 가구단지이다. 대형 매장이 입점해 가구를 소비자와 직거래하는 방식으로 판매하기 때문에 할인된 제품이 많으며, 특정 기간에 행사가 열리기도 한다.\n브랜드 가구, 디자이너 가구, 수입 가구 등 다양한 종류와 디자인의 가구들을 직접 보고 구입할 수 있다는 장점이 있다. 보다 수월하게 선택할 수 있도록 가구의 쓰임새, 놓을 위치 등을 판단하여 전문가와 상담이 가능하다.",
          ja: "일산가구단지는 고양에 위치한 대형 규모의 가구단지이다. 대형 매장이 입점해 가구를 소비자와 직거래하는 방식으로 판매하기 때문에 할인된 제품이 많으며, 특정 기간에 행사가 열리기도 한다.\n브랜드 가구, 디자이너 가구, 수입 가구 등 다양한 종류와 디자인의 가구들을 직접 보고 구입할 수 있다는 장점이 있다. 보다 수월하게 선택할 수 있도록 가구의 쓰임새, 놓을 위치 등을 판단하여 전문가와 상담이 가능하다.",
          "zh-CN": "일산가구단지는 고양에 위치한 대형 규모의 가구단지이다. 대형 매장이 입점해 가구를 소비자와 직거래하는 방식으로 판매하기 때문에 할인된 제품이 많으며, 특정 기간에 행사가 열리기도 한다.\n브랜드 가구, 디자이너 가구, 수입 가구 등 다양한 종류와 디자인의 가구들을 직접 보고 구입할 수 있다는 장점이 있다. 보다 수월하게 선택할 수 있도록 가구의 쓰임새, 놓을 위치 등을 판단하여 전문가와 상담이 가능하다.",
          "zh-TW": "일산가구단지는 고양에 위치한 대형 규모의 가구단지이다. 대형 매장이 입점해 가구를 소비자와 직거래하는 방식으로 판매하기 때문에 할인된 제품이 많으며, 특정 기간에 행사가 열리기도 한다.\n브랜드 가구, 디자이너 가구, 수입 가구 등 다양한 종류와 디자인의 가구들을 직접 보고 구입할 수 있다는 장점이 있다. 보다 수월하게 선택할 수 있도록 가구의 쓰임새, 놓을 위치 등을 판단하여 전문가와 상담이 가능하다.",
        },
      },
    ],
    access: [],
    know: [],
    // 오더 #B1 [1][b]: TourAPI addr1 · 좌표.
    ko_card: [{ name_ko: "일산가구단지", address_ko: "경기도 고양시 일산서구 경의로917번길 26" }],
    map: [{ lat: 37.7004655027, lng: 126.7586057864, label: "일산가구단지" }],
    credits: [],
    related: [],
    // 오더 #B1: 소개형. varies 로 통일. price/booking 필드 신설 금지.
    info: { hours: "varies", duration: "1_2h", admission: "varies", access: "wheelchair" },
    highlights: [
      { ko: "국내 최대급 가구 상권", en: "Ilsan Furniture District", ja: "一山家具団地", "zh-CN": "一山家具园区", "zh-TW": "一山家具園區" },
      { ko: "덕이동 일대 밀집", en: "Ilsan Furniture District", ja: "一山家具団地", "zh-CN": "一山家具园区", "zh-TW": "一山家具園區" },
      { ko: "인테리어·가전 병설", en: "Ilsan Furniture District", ja: "一山家具団地", "zh-CN": "一山家具园区", "zh-TW": "一山家具園區" },
    ],
    adSlot: null,
    // 오더 #C9: TourAPI Type1 상위 3장 신규 배선 (contentid 132509).
    gallery: [
      { url: "/images/spots/ilsan-furniture-district-1.jpg", credit: "출처: 한국관광공사 (공공누리 제1유형)", cpyrht: "Type1" },
      { url: "/images/spots/ilsan-furniture-district-2.jpg", credit: "출처: 한국관광공사 (공공누리 제1유형)", cpyrht: "Type1" },
      { url: "/images/spots/ilsan-furniture-district-3.jpg", credit: "출처: 한국관광공사 (공공누리 제1유형)", cpyrht: "Type1" },
    ],
    official_url: "https://www.ilsan-gagu.com",
    best_selected: false,
    tourapi: { contentid: "132509", overview_ko: "일산가구단지는 고양에 위치한 대형 규모의 가구단지이다. 대형 매장이 입점해 가구를 소비자와 직거래하는 방식으로 판매하기 때문에 할인된 제품이 많으며, 특정 기간에 행사가 열리기도 한다. 브랜드 가구, 디자이너 가구, 수입 가구 등 다양한 종류와 디자인의 가구들을 직접 보고 구입할 수 있다는 장점이 있다. 보다 수월하게 선택할 수 있도록 가구의 쓰임새, 놓을 위치 등을 판단하여 전문가와 상담이 가능하다.", homepage: "https://www.ilsan-gagu.com" },
  },
  {
    slug: "hyundai-dept-kintex",
    category: "shopping",
    type: "list",
    region: "일산서구",
    title: { ko: "현대백화점 킨텍스점", en: "The Hyundai Kintex", ja: "現代百貨店キンテックス店", "zh-CN": "现代百货 KINTEX 店", "zh-TW": "現代百貨 KINTEX 店" },
    title_en_display: "THE HYUNDAI KINTEX",
    subtitle: { ko: "킨텍스 인근 백화점", en: "A department store near KINTEX", ja: "キンテックス近くの百貨店", "zh-CN": "KINTEX 附近的百货店", "zh-TW": "KINTEX 附近的百貨店" },
    lead: {
      ko: "현대백화점은 고객의 삶에 품격과 여유를 더하는 프리미엄 라이프스타일 문화 공간입니다.",
      en: "현대백화점은 고객의 삶에 품격과 여유를 더하는 프리미엄 라이프스타일 문화 공간입니다.",
      ja: "현대백화점은 고객의 삶에 품격과 여유를 더하는 프리미엄 라이프스타일 문화 공간입니다.",
      "zh-CN": "현대백화점은 고객의 삶에 품격과 여유를 더하는 프리미엄 라이프스타일 문화 공간입니다.",
      "zh-TW": "현대백화점은 고객의 삶에 품격과 여유를 더하는 프리미엄 라이프스타일 문화 공간입니다.",
    },
    meta: { updated_at: "2026-09-02" },
    // 오더 #B1 [1][b]: TourAPI overview_ko 원문 이식. 5로케일 ko 폴백.
    sections: [
      {
        heading: { ko: "소개", en: "About", ja: "紹介", "zh-CN": "介绍", "zh-TW": "介紹" },
        body: {
          ko: "현대백화점은 고객의 삶에 품격과 여유를 더하는 프리미엄 라이프스타일 문화 공간입니다. 전 세계의 수준 높은 브랜드와 차별화된 문화 콘텐츠, 세심한 고객 서비스를 통해 단순한 쇼핑 그 이상의 가치를 전달합니다.",
          en: "현대백화점은 고객의 삶에 품격과 여유를 더하는 프리미엄 라이프스타일 문화 공간입니다. 전 세계의 수준 높은 브랜드와 차별화된 문화 콘텐츠, 세심한 고객 서비스를 통해 단순한 쇼핑 그 이상의 가치를 전달합니다.",
          ja: "현대백화점은 고객의 삶에 품격과 여유를 더하는 프리미엄 라이프스타일 문화 공간입니다. 전 세계의 수준 높은 브랜드와 차별화된 문화 콘텐츠, 세심한 고객 서비스를 통해 단순한 쇼핑 그 이상의 가치를 전달합니다.",
          "zh-CN": "현대백화점은 고객의 삶에 품격과 여유를 더하는 프리미엄 라이프스타일 문화 공간입니다. 전 세계의 수준 높은 브랜드와 차별화된 문화 콘텐츠, 세심한 고객 서비스를 통해 단순한 쇼핑 그 이상의 가치를 전달합니다.",
          "zh-TW": "현대백화점은 고객의 삶에 품격과 여유를 더하는 프리미엄 라이프스타일 문화 공간입니다. 전 세계의 수준 높은 브랜드와 차별화된 문화 콘텐츠, 세심한 고객 서비스를 통해 단순한 쇼핑 그 이상의 가치를 전달합니다.",
        },
      },
    ],
    access: [],
    know: [],
    // 오더 #B1 [1][b]: TourAPI addr1 · 좌표.
    ko_card: [{ name_ko: "현대백화점 킨텍스점", address_ko: "경기도 고양시 일산서구 호수로 817 (대화동)" }],
    map: [{ lat: 37.6679852145335, lng: 126.751647571454, label: "현대백화점 킨텍스점" }],
    credits: [],
    related: [],
    // 오더 #B1: 소개형. varies 로 통일. price/booking 필드 신설 금지.
    info: { hours: "varies", duration: "1_2h", admission: "varies", access: "wheelchair" },
    highlights: [
      { ko: "킨텍스 지근거리", en: "The Hyundai Kintex", ja: "現代百貨店キンテックス店", "zh-CN": "现代百货 KINTEX 店", "zh-TW": "現代百貨 KINTEX 店" },
      { ko: "프리미엄 브랜드 다수", en: "The Hyundai Kintex", ja: "現代百貨店キンテックス店", "zh-CN": "现代百货 KINTEX 店", "zh-TW": "現代百貨 KINTEX 店" },
      { ko: "호수공원 도보권", en: "The Hyundai Kintex", ja: "現代百貨店キンテックス店", "zh-CN": "现代百货 KINTEX 店", "zh-TW": "現代百貨 KINTEX 店" },
    ],
    adSlot: null,
    best_selected: false,
    tourapi: { contentid: "2911512", overview_ko: "현대백화점은 고객의 삶에 품격과 여유를 더하는 프리미엄 라이프스타일 문화 공간입니다. 전 세계의 수준 높은 브랜드와 차별화된 문화 콘텐츠, 세심한 고객 서비스를 통해 단순한 쇼핑 그 이상의 가치를 전달합니다." },
  },
  // ─── 오더 #B1 [1]: STAY 7곳 신규 (contentTypeId=32 전량) ───
  {
    slug: "gyisc-youth-center",
    category: "stay",
    type: "list",
    region: "일산동구",
    title: { ko: "고양국제청소년문화센터 유스센터", en: "Goyang Int'l Youth Culture Center", ja: "高陽国際青少年文化センターユースセンター", "zh-CN": "高阳国际青少年文化中心 Youth Center", "zh-TW": "高陽國際青少年文化中心 Youth Center" },
    title_en_display: "GOYANG INT'L YOUTH CULTURE CENTER",
    subtitle: { ko: "애니골 인근 청소년 문화 숙박", en: "Youth-oriented accommodation near Anigol", ja: "アニゴル近くの青少年文化宿泊", "zh-CN": "Anigol 附近的青少年文化住宿", "zh-TW": "Anigol 附近的青少年文化住宿" },
    lead: {
      ko: "YMCA유스센터는 청소년 수련활동과 정서함양 등 건전한 청소년의 육성을 위한 수학여행을 보낼 수 있는 공간과 높은 수준의 객실과 컨벤션 세미나, 레스토랑을 갖춘 청소년 수련시설이다.",
      en: "YMCA유스센터는 청소년 수련활동과 정서함양 등 건전한 청소년의 육성을 위한 수학여행을 보낼 수 있는 공간과 높은 수준의 객실과 컨벤션 세미나, 레스토랑을 갖춘 청소년 수련시설이다.",
      ja: "YMCA유스센터는 청소년 수련활동과 정서함양 등 건전한 청소년의 육성을 위한 수학여행을 보낼 수 있는 공간과 높은 수준의 객실과 컨벤션 세미나, 레스토랑을 갖춘 청소년 수련시설이다.",
      "zh-CN": "YMCA유스센터는 청소년 수련활동과 정서함양 등 건전한 청소년의 육성을 위한 수학여행을 보낼 수 있는 공간과 높은 수준의 객실과 컨벤션 세미나, 레스토랑을 갖춘 청소년 수련시설이다.",
      "zh-TW": "YMCA유스센터는 청소년 수련활동과 정서함양 등 건전한 청소년의 육성을 위한 수학여행을 보낼 수 있는 공간과 높은 수준의 객실과 컨벤션 세미나, 레스토랑을 갖춘 청소년 수련시설이다.",
    },
    meta: { updated_at: "2026-09-02" },
    // 오더 #B1 [1][b]: TourAPI overview_ko 원문 이식. 5로케일 ko 폴백.
    sections: [
      {
        heading: { ko: "소개", en: "About", ja: "紹介", "zh-CN": "介绍", "zh-TW": "介紹" },
        body: {
          ko: "YMCA유스센터는 청소년 수련활동과 정서함양 등 건전한 청소년의 육성을 위한 수학여행을 보낼 수 있는 공간과 높은 수준의 객실과 컨벤션 세미나, 레스토랑을 갖춘 청소년 수련시설이다. 청소년뿐만 아니라 성인, 가족, 단체이용객들에게 편안하고 안전한 서비스를 제공하며 다양한 이벤트는 물론 맞춤형 체험 교육프로그램을 통해 국내외 청소년들의 교류활동과 국내외 여행객들의 다채로운 체험을 제공하고자 한다. 다양한 부대시설이 있어 투숙기간 중 편리하게 이용할 수 있는 숙소이다.",
          en: "The YMCA Youth Center is a youth-training facility offering space for school trips that support wholesome youth development — youth-training activities, emotional enrichment and the like — together with high-grade guest rooms, convention and seminar rooms, and a restaurant. It provides comfortable, safe service not only to young people but also to adults, families, and groups, and aims to enable domestic and international youth exchange and diverse experiences for domestic and overseas travellers through a range of events and tailor-made hands-on educational programmes. A variety of on-site facilities make for a convenient stay.",
          ja: "YMCAユースセンターは、青少年修練活動や情操教育など健全な青少年の育成を目的とする修学旅行の場と、高水準の客室・コンベンション/セミナー・レストランを備えた青少年修練施設です。青少年のみならず、大人・家族・団体利用客にも快適で安全なサービスを提供し、多様なイベントはもちろん、オーダーメイド型の体験教育プログラムを通じて国内外の青少年の交流活動や、国内外旅行者の多彩な体験を提供しようとしています。各種の付帯施設が整っており、宿泊期間中に便利にご利用いただける宿です。",
          "zh-CN": "YMCA青少年中心是设有可承接以青少年培训活动与情操培养等健全青少年培育为目标的修学旅行空间，并配备高水准客房、会展研讨设施与餐厅的青少年培训设施。为青少年，以及成人、家庭与团体客人提供舒适安全的服务，并通过多样活动与定制体验教育项目，致力于国内外青少年的交流活动与国内外旅行者的多元体验。多种配套设施，让入住期间使用便利。",
          "zh-TW": "YMCA青少年中心是設有可承接以青少年培訓活動與情操培養等健全青少年培育為目標的修學旅行空間，並配備高水準客房、會展研討設施與餐廳的青少年培訓設施。為青少年，以及成人、家庭與團體客人提供舒適安全的服務，並透過多樣活動與客製體驗教育項目，致力於國內外青少年的交流活動與國內外旅行者的多元體驗。多種配套設施，讓入住期間使用便利。",
        },
      },
    ],
    access: [],
    know: [],
    // 오더 #B1 [1][b]: TourAPI addr1 · 좌표.
    ko_card: [{ name_ko: "고양국제청소년문화센터 유스센터", address_ko: "경기도 고양시 일산동구 애니골길 97 고양국제청소년문화센터" }],
    map: [{ lat: 37.6775015074, lng: 126.7913563157, label: "고양국제청소년문화센터 유스센터" }],
    credits: [],
    related: [],
    // 오더 #B1: 소개형. varies 로 통일. price/booking 필드 신설 금지.
    info: { hours: "varies", duration: "1_2h", admission: "varies", access: "wheelchair" },
    highlights: [
      { ko: "청소년 수련활동 기반", en: "Goyang Int'l Youth Culture Center", ja: "高陽国際青少年文化センターユースセンター", "zh-CN": "高阳国际青少年文化中心 Youth Center", "zh-TW": "高陽國際青少年文化中心 Youth Center" },
      { ko: "수학여행 단체 이용", en: "Goyang Int'l Youth Culture Center", ja: "高陽国際青少年文化センターユースセンター", "zh-CN": "高阳国际青少年文化中心 Youth Center", "zh-TW": "高陽國際青少年文化中心 Youth Center" },
      { ko: "일산동구 애니골", en: "Goyang Int'l Youth Culture Center", ja: "高陽国際青少年文化センターユースセンター", "zh-CN": "高阳国际青少年文化中心 Youth Center", "zh-TW": "高陽國際青少年文化中心 Youth Center" },
    ],
    adSlot: null,
    best_selected: false,
    tourapi: { contentid: "2818337", overview_ko: "YMCA유스센터는 청소년 수련활동과 정서함양 등 건전한 청소년의 육성을 위한 수학여행을 보낼 수 있는 공간과 높은 수준의 객실과 컨벤션 세미나, 레스토랑을 갖춘 청소년 수련시설이다. 청소년뿐만 아니라 성인, 가족, 단체이용객들에게 편안하고 안전한 서비스를 제공하며 다양한 이벤트는 물론 맞춤형 체험 교육프로그램을 통해 국내외 청소년들의 교류활동과 국내외 여행객들의 다채로운 체험을 제공하고자 한다. 다양한 부대시설이 있어 투숙기간 중 편리하게 이용할 수 있는 숙소이다." },
  },
  {
    slug: "lakebay-hostel",
    category: "stay",
    type: "list",
    region: "일산동구",
    title: { ko: "레이크베이 호스텔", en: "Lakebay Hostel", ja: "レイクベイ ホステル", "zh-CN": "Lakebay 青旅", "zh-TW": "Lakebay 青旅" },
    title_en_display: "LAKEBAY HOSTEL",
    subtitle: { ko: "라페스타·웨스턴돔 인근 신축 호스텔", en: "A new-build hostel near Lafesta and Westerndom", ja: "ラフェスタ・ウェスタンドーム近くの新築ホステル", "zh-CN": "Lafesta·Westerndom 附近的新建青旅", "zh-TW": "Lafesta·Westerndom 附近的新建青旅" },
    lead: {
      ko: "레이크베이 호스텔은 일산동구 장항동 라페스타, 웨스턴돔 쪽에 새로 생긴 신축 호텔이다.",
      en: "레이크베이 호스텔은 일산동구 장항동 라페스타, 웨스턴돔 쪽에 새로 생긴 신축 호텔이다.",
      ja: "레이크베이 호스텔은 일산동구 장항동 라페스타, 웨스턴돔 쪽에 새로 생긴 신축 호텔이다.",
      "zh-CN": "레이크베이 호스텔은 일산동구 장항동 라페스타, 웨스턴돔 쪽에 새로 생긴 신축 호텔이다.",
      "zh-TW": "레이크베이 호스텔은 일산동구 장항동 라페스타, 웨스턴돔 쪽에 새로 생긴 신축 호텔이다.",
    },
    meta: { updated_at: "2026-09-02" },
    // 오더 #B1 [1][b]: TourAPI overview_ko 원문 이식. 5로케일 ko 폴백.
    sections: [
      {
        heading: { ko: "소개", en: "About", ja: "紹介", "zh-CN": "介绍", "zh-TW": "介紹" },
        body: {
          ko: "레이크베이 호스텔은 일산동구 장항동 라페스타, 웨스턴돔 쪽에 새로 생긴 신축 호텔이다. 주차는 드림월드 빌딩 지하에 하면 되고 엘리베이터를 이용해 8층으로 올라가면 레이크베이 호스텔 인포메이션 데스크가 나온다. 신축 호텔이라 입구도 깔끔하고 객실도 깔끔하다. 객실 내부 침대 맞은편에 넷플릭스, 유튜브 시청이 가능한 대형 TV가 있고 공기 청정기도 설치되어 있다. 침대와 벽을 두고 옷걸이와 세면대가 있고 욕실은 깨끗하고 넓으며 비데도 설치되어 있다. 로비 쪽 공용 공간엔 간단한 음료나 커피 등을 먹을 수 있는 테이블이 있고, 커피머신, 전자레인지 등을 갖추고 있어 쿠키, 시리얼 등 간식들을 먹을 수 있다. 성수기 요금은 별도 문의해야 한다.",
          en: "Lakebay Hostel is a newly built hotel that opened near Lafesta and Westerndom in Janghang-dong, Ilsandong-gu. Parking is available in the basement of the Dreamworld Building; take the elevator up to the 8th floor and you will find the Lakebay Hostel information desk. As a new-build hotel the entrance is fresh and the rooms are tidy. Opposite the bed each room has a large TV that plays Netflix and YouTube, and an air purifier is installed. Behind the bed, a partition wall sets off a closet space and washbasin; the bathroom is clean and spacious, with a bidet. In the common space by the lobby there are tables for a light drink or coffee, plus a coffee machine and a microwave, so cookies, cereal and other snacks can be enjoyed. Peak-season rates are quoted on request.",
          ja: "レイクベイ ホステルは、一山東区長項洞のラフェスタ・ウェスタンドーム周辺に新しくできた新築ホテルです。駐車はドリームワールドビル地下に停め、エレベーターで8階に上がるとレイクベイ ホステルのインフォメーションデスクがあります。新築のため、入口も客室も清潔です。客室のベッド向かい側にはNetflix・YouTubeが視聴可能な大型TVがあり、空気清浄機も設置されています。ベッドと壁を隔ててハンガーラックと洗面台があり、バスルームは清潔で広く、ウォシュレット（ビデ）も備えています。ロビー側の共有スペースには軽い飲み物やコーヒーを楽しめるテーブルがあり、コーヒーマシン・電子レンジも備え、クッキー・シリアルなどの軽食を摂ることができます。繁忙期の料金は別途お問い合わせください。",
          "zh-CN": "Lakebay 青旅是位于一山东区长项洞Lafesta、Westerndom一带新建的酒店。停车可停于Dreamworld大厦地下停车场，搭乘电梯至8楼即可看到Lakebay 青旅前台。作为新建酒店，入口与客房均整洁清爽。客房床对面配备可观看Netflix、YouTube的大屏电视，并设有空气净化器。床与墙之间设有衣架与洗手台，浴室洁净宽敞，并配备智能马桶盖（Bidet）。大堂公共区设有可小酌饮品与咖啡的桌位，配备咖啡机、微波炉等，可享用饼干、麦片等轻食。旺季价格请另行咨询。",
          "zh-TW": "Lakebay 青旅是位於一山東區長項洞Lafesta、Westerndom一帶新建的酒店。停車可停於Dreamworld大廈地下停車場，搭乘電梯至8樓即可看到Lakebay 青旅前台。作為新建酒店，入口與客房均整潔清爽。客房床對面配備可觀看Netflix、YouTube的大屏電視，並設有空氣清淨機。床與牆之間設有衣架與洗手台，浴室潔淨寬敞，並配備智能馬桶蓋（Bidet）。大堂公共區設有可小酌飲品與咖啡的桌位，配備咖啡機、微波爐等，可享用餅乾、麥片等輕食。旺季價格請另行諮詢。",
        },
      },
    ],
    access: [],
    know: [],
    // 오더 #B1 [1][b]: TourAPI addr1 · 좌표.
    ko_card: [{ name_ko: "레이크베이 호스텔", address_ko: "경기도 고양시 일산동구 정발산로 15 (장항동)" }],
    map: [{ lat: 37.6564872867, lng: 126.7705263475, label: "레이크베이 호스텔" }],
    credits: [],
    related: [],
    // 오더 #B1: 소개형. varies 로 통일. price/booking 필드 신설 금지.
    info: { hours: "varies", duration: "1_2h", admission: "varies", access: "wheelchair" },
    highlights: [
      { ko: "장항동 신축", en: "Lakebay Hostel", ja: "レイクベイ ホステル", "zh-CN": "Lakebay 青旅", "zh-TW": "Lakebay 青旅" },
      { ko: "라페스타·웨스턴돔 도보권", en: "Lakebay Hostel", ja: "レイクベイ ホステル", "zh-CN": "Lakebay 青旅", "zh-TW": "Lakebay 青旅" },
      { ko: "호수공원 인접", en: "Lakebay Hostel", ja: "レイクベイ ホステル", "zh-CN": "Lakebay 青旅", "zh-TW": "Lakebay 青旅" },
    ],
    adSlot: null,
    best_selected: false,
    tourapi: { contentid: "2918421", overview_ko: "레이크베이 호스텔은 일산동구 장항동 라페스타, 웨스턴돔 쪽에 새로 생긴 신축 호텔이다. 주차는 드림월드 빌딩 지하에 하면 되고 엘리베이터를 이용해 8층으로 올라가면 레이크베이 호스텔 인포메이션 데스크가 나온다. 신축 호텔이라 입구도 깔끔하고 객실도 깔끔하다. 객실 내부 침대 맞은편에 넷플릭스, 유튜브 시청이 가능한 대형 TV가 있고 공기 청정기도 설치되어 있다. 침대와 벽을 두고 옷걸이와 세면대가 있고 욕실은 깨끗하고 넓으며 비데도 설치되어 있다. 로비 쪽 공용 공간엔 간단한 음료나 커피 등을 먹을 수 있는 테이블이 있고, 커피머신, 전자레인지 등을 갖추고 있어 쿠키, 시리얼 등 간식들을 먹을 수 있다. 성수기 요금은 별도 문의해야 한다." },
  },
  {
    slug: "sono-calm-goyang",
    category: "stay",
    type: "list",
    region: "일산동구",
    title: { ko: "소노캄 고양", en: "Sono Calm Goyang", ja: "ソノカーム高陽", "zh-CN": "Sono Calm 高阳", "zh-TW": "Sono Calm 高陽" },
    title_en_display: "SONO CALM GOYANG",
    subtitle: { ko: "킨텍스 인근 5성급 호텔", en: "A 5-star hotel near KINTEX", ja: "キンテックス近くの5つ星ホテル", "zh-CN": "KINTEX 附近的五星级酒店", "zh-TW": "KINTEX 附近的五星級酒店" },
    lead: {
      ko: "소노캄 고양은 국제 행사와 다양한 문화행사가 개최되는 컨벤션 센터 킨텍스와 근접해 있는 5성급 호텔이다.",
      en: "소노캄 고양은 국제 행사와 다양한 문화행사가 개최되는 컨벤션 센터 킨텍스와 근접해 있는 5성급 호텔이다.",
      ja: "소노캄 고양은 국제 행사와 다양한 문화행사가 개최되는 컨벤션 센터 킨텍스와 근접해 있는 5성급 호텔이다.",
      "zh-CN": "소노캄 고양은 국제 행사와 다양한 문화행사가 개최되는 컨벤션 센터 킨텍스와 근접해 있는 5성급 호텔이다.",
      "zh-TW": "소노캄 고양은 국제 행사와 다양한 문화행사가 개최되는 컨벤션 센터 킨텍스와 근접해 있는 5성급 호텔이다.",
    },
    meta: { updated_at: "2026-09-02" },
    // 오더 #B1 [1][b]: TourAPI overview_ko 원문 이식. 5로케일 ko 폴백.
    sections: [
      {
        heading: { ko: "소개", en: "About", ja: "紹介", "zh-CN": "介绍", "zh-TW": "介紹" },
        body: {
          ko: "소노캄 고양은 국제 행사와 다양한 문화행사가 개최되는 컨벤션 센터 킨텍스와 근접해 있는 5성급 호텔이다. 비즈니스로 최적화된 소노캄 고양은 국제공항과 근접해 있는 것은 물론, 편리한 교통시설로 접근성 높다. 소노캄 고양의 매력 포인트인 프리미엄 펫 복합문화공간에서 반려동물과 보호자만의 소사이어티도 즐길 수 있다.",
          en: "Sono Calm Goyang is a 5-star hotel close to KINTEX, the convention center that hosts international events and a wide range of cultural programmes. Optimised for business, Sono Calm Goyang is near the international airport and highly accessible by convenient transport. At the hotel's signature premium pet cultural complex, guests can also enjoy a community for pets and their owners.",
          ja: "ソノカーム高陽（Sono Calm Goyang）は、国際イベントや多彩な文化行事が開催されるコンベンションセンター・キンテックスに隣接する5つ星ホテルです。ビジネスに最適化されたソノカーム高陽は、国際空港に近いことはもちろん、便利な交通機関でアクセス性に優れています。ソノカーム高陽の魅力である「プレミアム・ペット複合文化空間」では、ペットと飼い主だけのソサエティも楽しめます。",
          "zh-CN": "Sono Calm 高阳是紧邻承办国际盛会与多元文化活动的会展中心KINTEX的五星级酒店。为商务出行优化的Sono Calm 高阳临近国际机场，交通便利、可及性高。在Sono Calm 高阳的亮点——高级宠物综合文化空间中，还可体验专属宠物与主人的社群。",
          "zh-TW": "Sono Calm 高陽是緊鄰承辦國際盛會與多元文化活動的會展中心KINTEX的五星級酒店。為商務出行優化的Sono Calm 高陽鄰近國際機場，交通便利、可及性高。在Sono Calm 高陽的亮點——高級寵物綜合文化空間中，還可體驗專屬寵物與主人的社群。",
        },
      },
    ],
    access: [],
    know: [],
    // 오더 #B1 [1][b]: TourAPI addr1 · 좌표.
    ko_card: [{ name_ko: "소노캄 고양", address_ko: "경기도 고양시 일산동구 태극로 20 (장항동)" }],
    map: [{ lat: 37.6619258306, lng: 126.7508077067, label: "소노캄 고양" }],
    credits: [],
    related: [],
    // 오더 #B1: 소개형. varies 로 통일. price/booking 필드 신설 금지.
    info: { hours: "varies", duration: "1_2h", admission: "varies", access: "wheelchair" },
    highlights: [
      { ko: "킨텍스 지근거리", en: "Sono Calm Goyang", ja: "ソノカーム高陽", "zh-CN": "Sono Calm 高阳", "zh-TW": "Sono Calm 高陽" },
      { ko: "5성급 · 컨벤션 소구", en: "Sono Calm Goyang", ja: "ソノカーム高陽", "zh-CN": "Sono Calm 高阳", "zh-TW": "Sono Calm 高陽" },
      { ko: "장항동 태극로", en: "Sono Calm Goyang", ja: "ソノカーム高陽", "zh-CN": "Sono Calm 高阳", "zh-TW": "Sono Calm 高陽" },
    ],
    adSlot: null,
    best_selected: false,
    tourapi: { contentid: "2496500", overview_ko: "소노캄 고양은 국제 행사와 다양한 문화행사가 개최되는 컨벤션 센터 킨텍스와 근접해 있는 5성급 호텔이다. 비즈니스로 최적화된 소노캄 고양은 국제공항과 근접해 있는 것은 물론, 편리한 교통시설로 접근성 높다. 소노캄 고양의 매력 포인트인 프리미엄 펫 복합문화공간에서 반려동물과 보호자만의 소사이어티도 즐길 수 있다." },
  },
  {
    slug: "deohyusik-anok-tanhyun",
    category: "stay",
    type: "list",
    region: "일산서구",
    title: { ko: "더휴식 아늑호텔 일산탄현점", en: "DeoHyuSik Anok Hotel Ilsan Tanhyun", ja: "ドヒュシク アヌク ホテル 一山炭峴店", "zh-CN": "DeoHyuSik Anok 酒店 一山炭岘店", "zh-TW": "DeoHyuSik Anok 酒店 一山炭峴店" },
    title_en_display: "DEOHYUSIK ANOK HOTEL ILSAN TANHYUN",
    subtitle: { ko: "탄현동의 테마 부티크 숙소", en: "A themed boutique stay in Tanhyun", ja: "炭峴洞のテーマ型ブティック宿泊", "zh-CN": "炭岘洞的主题精品住宿", "zh-TW": "炭峴洞的主題精品住宿" },
    lead: {
      ko: "더휴식 아늑호텔 일산탄현점 내에는 개성 있는 다양한 테마 객실이 마련되어 있습니다.",
      en: "더휴식 아늑호텔 일산탄현점 내에는 개성 있는 다양한 테마 객실이 마련되어 있습니다.",
      ja: "더휴식 아늑호텔 일산탄현점 내에는 개성 있는 다양한 테마 객실이 마련되어 있습니다.",
      "zh-CN": "더휴식 아늑호텔 일산탄현점 내에는 개성 있는 다양한 테마 객실이 마련되어 있습니다.",
      "zh-TW": "더휴식 아늑호텔 일산탄현점 내에는 개성 있는 다양한 테마 객실이 마련되어 있습니다.",
    },
    meta: { updated_at: "2026-09-02" },
    // 오더 #B1 [1][b]: TourAPI overview_ko 원문 이식. 5로케일 ko 폴백.
    sections: [
      {
        heading: { ko: "소개", en: "About", ja: "紹介", "zh-CN": "介绍", "zh-TW": "介紹" },
        body: {
          ko: "더휴식 아늑호텔 일산탄현점 내에는 개성 있는 다양한 테마 객실이 마련되어 있습니다. 닌텐도 객실은 게임 애호가들에게 즐거움을 선사하며, 뮤직 객실은 아날로그 감성을 자극하는 LP 음악 감상을 제공한다. 무비 객실에서는 영화 감상에 몰입할 수 있는 공간을 제공하고, 골프 객실은 스윙의 재미를 즐길 수 있는 최적의 환경을 갖추고 있다. 다채로운 즐길 거리를 통해 손님들은 특별한 경험을 누릴 수 있다.",
          en: "DeoHyuSik Anok Hotel Ilsan Tanhyun offers a range of distinctive themed rooms. The Nintendo Room delights game fans; the Music Room stirs the analog senses with LP listening; the Movie Room provides a space designed for full immersion in film; and the Golf Room is set up for the pleasure of a swing. A varied line-up of amenities lets guests enjoy a distinctive stay.",
          ja: "ドヒュシク アヌク ホテル 一山炭峴店には、個性豊かな多彩なテーマ客室が用意されています。ニンテンドー客室はゲーム愛好家に喜びを、ミュージック客室はアナログの感性を刺激するLPリスニングを提供します。ムービー客室では映画鑑賞に没入できる空間を、ゴルフ客室ではスイングの楽しさを味わえる最適な環境を備えています。多彩な楽しみ方を通じて、お客様に特別な体験をお届けします。",
          "zh-CN": "DeoHyuSik Anok 酒店 一山炭岘店内设有个性鲜明的多种主题客房。任天堂客房让游戏爱好者尽情享乐；音乐客房以LP唱片聆听激发怀旧情怀；电影客房打造沉浸观影的空间；高尔夫客房则为享受挥杆乐趣配备最佳环境。丰富的娱乐配置让宾客获得独特体验。",
          "zh-TW": "DeoHyuSik Anok 酒店 一山炭峴店內設有個性鮮明的多種主題客房。任天堂客房讓遊戲愛好者盡情享樂；音樂客房以LP唱片聆聽激發懷舊情懷；電影客房打造沉浸觀影的空間；高爾夫客房則為享受揮桿樂趣配備最佳環境。豐富的娛樂配置讓賓客獲得獨特體驗。",
        },
      },
    ],
    access: [],
    know: [],
    // 오더 #B1 [1][b]: TourAPI addr1 · 좌표.
    ko_card: [{ name_ko: "더휴식 아늑호텔 일산탄현점", address_ko: "경기도 고양시 일산서구 일현로41번길 8-32 (탄현동)" }],
    map: [{ lat: 37.69205299118743, lng: 126.76216069258045, label: "더휴식 아늑호텔 일산탄현점" }],
    credits: [],
    related: [],
    // 오더 #B1: 소개형. varies 로 통일. price/booking 필드 신설 금지.
    info: { hours: "varies", duration: "1_2h", admission: "varies", access: "wheelchair" },
    highlights: [
      { ko: "테마 객실 다수", en: "DeoHyuSik Anok Hotel Ilsan Tanhyun", ja: "ドヒュシク アヌク ホテル 一山炭峴店", "zh-CN": "DeoHyuSik Anok 酒店 一山炭岘店", "zh-TW": "DeoHyuSik Anok 酒店 一山炭峴店" },
      { ko: "탄현역 인근", en: "DeoHyuSik Anok Hotel Ilsan Tanhyun", ja: "ドヒュシク アヌク ホテル 一山炭峴店", "zh-CN": "DeoHyuSik Anok 酒店 一山炭岘店", "zh-TW": "DeoHyuSik Anok 酒店 一山炭峴店" },
      { ko: "일산서구", en: "DeoHyuSik Anok Hotel Ilsan Tanhyun", ja: "ドヒュシク アヌク ホテル 一山炭峴店", "zh-CN": "DeoHyuSik Anok 酒店 一山炭岘店", "zh-TW": "DeoHyuSik Anok 酒店 一山炭峴店" },
    ],
    adSlot: null,
    best_selected: false,
    tourapi: { contentid: "3485478", overview_ko: "더휴식 아늑호텔 일산탄현점 내에는 개성 있는 다양한 테마 객실이 마련되어 있습니다. 닌텐도 객실은 게임 애호가들에게 즐거움을 선사하며, 뮤직 객실은 아날로그 감성을 자극하는 LP 음악 감상을 제공한다. 무비 객실에서는 영화 감상에 몰입할 수 있는 공간을 제공하고, 골프 객실은 스윙의 재미를 즐길 수 있는 최적의 환경을 갖추고 있다. 다채로운 즐길 거리를 통해 손님들은 특별한 경험을 누릴 수 있다." },
  },
  {
    slug: "kintex-by-ktree",
    category: "stay",
    type: "list",
    region: "일산서구",
    title: { ko: "킨텍스 바이 케이트리", en: "Kintex by K-Tree", ja: "キンテックス バイ Kツリー", "zh-CN": "Kintex by K-Tree", "zh-TW": "Kintex by K-Tree" },
    title_en_display: "KINTEX BY K-TREE",
    subtitle: { ko: "킨텍스 제1전시장 옆 레지던스", en: "A residence hotel next to KINTEX Hall 1", ja: "キンテックス第1展示場隣のレジデンス", "zh-CN": "KINTEX 一号展馆旁的公寓式酒店", "zh-TW": "KINTEX 一號展館旁的公寓式酒店" },
    lead: {
      ko: "킨텍스 바이 케이트리는 킨텍스 제1전시장 옆에 있는 레지던스 호텔이다.",
      en: "킨텍스 바이 케이트리는 킨텍스 제1전시장 옆에 있는 레지던스 호텔이다.",
      ja: "킨텍스 바이 케이트리는 킨텍스 제1전시장 옆에 있는 레지던스 호텔이다.",
      "zh-CN": "킨텍스 바이 케이트리는 킨텍스 제1전시장 옆에 있는 레지던스 호텔이다.",
      "zh-TW": "킨텍스 바이 케이트리는 킨텍스 제1전시장 옆에 있는 레지던스 호텔이다.",
    },
    meta: { updated_at: "2026-09-02" },
    // 오더 #B1 [1][b]: TourAPI overview_ko 원문 이식. 5로케일 ko 폴백.
    sections: [
      {
        heading: { ko: "소개", en: "About", ja: "紹介", "zh-CN": "介绍", "zh-TW": "介紹" },
        body: {
          ko: "킨텍스 바이 케이트리는 킨텍스 제1전시장 옆에 있는 레지던스 호텔이다. 건물 지하 1층과 지하 3층까지 주차장으로 객실당 1대 무료 주차할 수 있다. 킨텍스를 마주하고 있는 16층 건물로 다양한 객실과 효율적인 업무공간이 있는 이 호텔은 전 객실 금연 룸이며 최대인원 초과하는 인원 추가는 안 된다. 호텔 내에는 점심, 저녁 운영하는 한식뷔페가 있고 16석의 최고급 리클라이너 좌석에 다양한 음료, 음식과 함께 최신 개봉작을 볼 수 있는 시네마도 있다. 또한 24시간 이용할 수 있는 비즈니스 라운지와 16층에 있는 바에서 조식을 제공하고 있다. 호텔 근처에는 일산 호수공원, 고양아람누리, 장항습지, 북한산, 흥국사 등의 볼거리가 있고 대중교통으로 3호선 대화역이 가까이 있다.",
          en: "Kintex by K-Tree is a residence hotel next to KINTEX Hall 1. The building's basement levels B1 through B3 serve as car parks; one free space per room is provided. Facing KINTEX, this 16-storey building offers a range of rooms and efficient workspaces; all rooms are non-smoking, and extra guests beyond the maximum occupancy are not allowed. Inside the hotel there is a Korean buffet at lunch and dinner, and a cinema with 16 top-grade recliner seats where you can watch the latest releases with a variety of food and drinks. A 24-hour business lounge and a bar on the 16th floor serve breakfast. Nearby attractions include Ilsan Lake Park, Goyang Aram Nuri, Janghang Wetlands, Bukhansan Mountain, and Heungguksa Temple; by public transport, Daehwa Station on Line 3 is close by.",
          ja: "キンテックス バイ K-Tree（Kintex by K-Tree）は、キンテックス第1展示場の隣にあるレジデンス型ホテルです。建物の地下1階から地下3階までが駐車場で、客室あたり1台まで無料で駐車できます。キンテックスに面する16階建てのこのホテルは、多彩な客室と効率的なワークスペースを備え、全室禁煙で、定員を超える宿泊は不可です。館内には昼・夜に営業する韓食ビュッフェがあり、16席の最高級リクライナーシートで多彩な飲食を楽しみながら最新公開作を観られるシネマもあります。また、24時間利用可能なビジネスラウンジと16階のバーで朝食を提供しています。ホテル近くには一山湖水公園、高陽アラムヌリ、獐項湿地、北漢山、興国寺などの見どころがあり、公共交通では3号線・大化（テファ）駅が近くにあります。",
          "zh-CN": "Kintex by K-Tree是位于KINTEX第一展馆旁的公寓式酒店。建筑B1至B3层为停车场，每间客房可享1个免费车位。这座正对KINTEX的16层建筑，客房类型多样，工作空间高效，全馆客房禁烟，不接受超出最大入住人数的加人。馆内设有午晚营业的韩式自助餐，并有一间配备16席顶级躺椅座席的影院，可搭配多种餐饮观赏最新影片。此外，24小时开放的商务贵宾室与16层的酒吧提供早餐。酒店附近有一山湖水公园、高阳阿蓝世界、獐项湿地、北汉山、兴国寺等景点，公共交通方面3号线大化站在附近。",
          "zh-TW": "Kintex by K-Tree是位於KINTEX第一展館旁的公寓式酒店。建築B1至B3層為停車場，每間客房可享1個免費車位。這座正對KINTEX的16層建築，客房類型多樣，工作空間高效，全館客房禁菸，不接受超出最大入住人數的加人。館內設有午晚營業的韓式自助餐，並有一間配備16席頂級躺椅座席的影院，可搭配多種餐飲觀賞最新影片。此外，24小時開放的商務貴賓室與16層的酒吧提供早餐。酒店附近有一山湖水公園、高陽阿藍世界、獐項濕地、北漢山、興國寺等景點，公共交通方面3號線大化站在附近。",
        },
      },
    ],
    access: [],
    know: [],
    // 오더 #B1 [1][b]: TourAPI addr1 · 좌표.
    ko_card: [{ name_ko: "킨텍스 바이 케이트리", address_ko: "경기도 고양시 일산서구 킨텍스로 255-3 (대화동)" }],
    map: [{ lat: 37.6684743797, lng: 126.7480780616, label: "킨텍스 바이 케이트리" }],
    credits: [],
    related: [],
    // 오더 #B1: 소개형. varies 로 통일. price/booking 필드 신설 금지.
    info: { hours: "varies", duration: "1_2h", admission: "varies", access: "wheelchair" },
    highlights: [
      { ko: "킨텍스 바로 옆", en: "Kintex by K-Tree", ja: "キンテックス バイ Kツリー", "zh-CN": "Kintex by K-Tree", "zh-TW": "Kintex by K-Tree" },
      { ko: "레지던스 · 장기 소구", en: "Kintex by K-Tree", ja: "キンテックス バイ Kツリー", "zh-CN": "Kintex by K-Tree", "zh-TW": "Kintex by K-Tree" },
      { ko: "일산서구 킨텍스로", en: "Kintex by K-Tree", ja: "キンテックス バイ Kツリー", "zh-CN": "Kintex by K-Tree", "zh-TW": "Kintex by K-Tree" },
    ],
    adSlot: null,
    official_url: "http://kintexbyk-tree.com",
    best_selected: false,
    tourapi: { contentid: "2872922", overview_ko: "킨텍스 바이 케이트리는 킨텍스 제1전시장 옆에 있는 레지던스 호텔이다. 건물 지하 1층과 지하 3층까지 주차장으로 객실당 1대 무료 주차할 수 있다. 킨텍스를 마주하고 있는 16층 건물로 다양한 객실과 효율적인 업무공간이 있는 이 호텔은 전 객실 금연 룸이며 최대인원 초과하는 인원 추가는 안 된다. 호텔 내에는 점심, 저녁 운영하는 한식뷔페가 있고 16석의 최고급 리클라이너 좌석에 다양한 음료, 음식과 함께 최신 개봉작을 볼 수 있는 시네마도 있다. 또한 24시간 이용할 수 있는 비즈니스 라운지와 16층에 있는 바에서 조식을 제공하고 있다. 호텔 근처에는 일산 호수공원, 고양아람누리, 장항습지, 북한산, 흥국사 등의 볼거리가 있고 대중교통으로 3호선 대화역이 가까이 있다.", homepage: "http://kintexbyk-tree.com" },
  },
  // ─── 오더 #C8: 신규 스팟 8곳 (TourAPI overview_ko + Type1 확보분) ─────
  {
    slug: "haengju-historical-park",
    category: "history",
    type: "list",
    region: "덕양구",
    title: { ko: "행주산성 역사공원", en: "Haengju Historical Park", ja: "幸州山城歴史公園", "zh-CN": "幸州山城历史公园", "zh-TW": "幸州山城歷史公園" },
    title_en_display: "HAENGJU HISTORICAL PARK",
    subtitle: {
      ko: "고양 인재개발원 주변 한강변 공원으로 2000년 고양 인재개발원 건립과 함께 조성되었다.",
      en: "고양 인재개발원 주변 한강변 공원으로 2000년 고양 인재개발원 건립과 함께 조성되었다.",
      ja: "고양 인재개발원 주변 한강변 공원으로 2000년 고양 인재개발원 건립과 함께 조성되었다.",
      "zh-CN": "고양 인재개발원 주변 한강변 공원으로 2000년 고양 인재개발원 건립과 함께 조성되었다.",
      "zh-TW": "고양 인재개발원 주변 한강변 공원으로 2000년 고양 인재개발원 건립과 함께 조성되었다.",
    },
    lead: {
      ko: "고양 인재개발원 주변 한강변 공원으로 2000년 고양 인재개발원 건립과 함께 조성되었다. 운동장처럼 탁 트인 이곳은 넓은 잔디밭에서 한강뷰를 감상하거나 잔디밭에 앉아 휴식을 취할 수도 있다. 2016년 전망대를 설치하고 한강 백사장에 근접할 수 있도록 한강변으로 길을 내어 정비한 곳으로 군대 초소를 정비한 자리에는 한강과 철새를 조망할 수 있는 친수공간(빨랫돌 머리) 군대 초소 전망대(행호정), 철책 포토존, 바람개비 언덕을 갖춘 역사 공원이다. 주차장에 무료로 차박이 가능해서 한강변의 야경을 보기 위해 찾는 사람들도 많다. 대덕 생태공원~행주산성 역사 공원~군 순찰로~장항 습지 18.2km 코스가 생태테마 관광 10선으로 지정되어 있다. 각종 축제 및 행사가 이루어져 시민들의 여가 공간으로 활용되며 공원 일부는 행주산성 누리길 코스로 행주산성을 한 바퀴 도는 길이다. 순환길이라 출발지와 도착지가 같고 초입은 계단이 많아 다소 힘들 수 있으나 10분 정도 후면 팔각정이 보이고 진강정, 충의정, 덕양정, 행주대첩비 등을 볼 수 있다. 1시간 반 정도면 여유 있게 둘러볼 수 있다. 또한 역사 공원 왼쪽으로 있는 방화대교는 일몰 명소로 해 질 녘이면 많은 사람들이 몰려오기도 한다. 아름다운 한강변에서 자연을 느끼고 역사를 배울 수 있는 곳이다.",
      en: "고양 인재개발원 주변 한강변 공원으로 2000년 고양 인재개발원 건립과 함께 조성되었다. 운동장처럼 탁 트인 이곳은 넓은 잔디밭에서 한강뷰를 감상하거나 잔디밭에 앉아 휴식을 취할 수도 있다. 2016년 전망대를 설치하고 한강 백사장에 근접할 수 있도록 한강변으로 길을 내어 정비한 곳으로 군대 초소를 정비한 자리에는 한강과 철새를 조망할 수 있는 친수공간(빨랫돌 머리) 군대 초소 전망대(행호정), 철책 포토존, 바람개비 언덕을 갖춘 역사 공원이다. 주차장에 무료로 차박이 가능해서 한강변의 야경을 보기 위해 찾는 사람들도 많다. 대덕 생태공원~행주산성 역사 공원~군 순찰로~장항 습지 18.2km 코스가 생태테마 관광 10선으로 지정되어 있다. 각종 축제 및 행사가 이루어져 시민들의 여가 공간으로 활용되며 공원 일부는 행주산성 누리길 코스로 행주산성을 한 바퀴 도는 길이다. 순환길이라 출발지와 도착지가 같고 초입은 계단이 많아 다소 힘들 수 있으나 10분 정도 후면 팔각정이 보이고 진강정, 충의정, 덕양정, 행주대첩비 등을 볼 수 있다. 1시간 반 정도면 여유 있게 둘러볼 수 있다. 또한 역사 공원 왼쪽으로 있는 방화대교는 일몰 명소로 해 질 녘이면 많은 사람들이 몰려오기도 한다. 아름다운 한강변에서 자연을 느끼고 역사를 배울 수 있는 곳이다.",
      ja: "고양 인재개발원 주변 한강변 공원으로 2000년 고양 인재개발원 건립과 함께 조성되었다. 운동장처럼 탁 트인 이곳은 넓은 잔디밭에서 한강뷰를 감상하거나 잔디밭에 앉아 휴식을 취할 수도 있다. 2016년 전망대를 설치하고 한강 백사장에 근접할 수 있도록 한강변으로 길을 내어 정비한 곳으로 군대 초소를 정비한 자리에는 한강과 철새를 조망할 수 있는 친수공간(빨랫돌 머리) 군대 초소 전망대(행호정), 철책 포토존, 바람개비 언덕을 갖춘 역사 공원이다. 주차장에 무료로 차박이 가능해서 한강변의 야경을 보기 위해 찾는 사람들도 많다. 대덕 생태공원~행주산성 역사 공원~군 순찰로~장항 습지 18.2km 코스가 생태테마 관광 10선으로 지정되어 있다. 각종 축제 및 행사가 이루어져 시민들의 여가 공간으로 활용되며 공원 일부는 행주산성 누리길 코스로 행주산성을 한 바퀴 도는 길이다. 순환길이라 출발지와 도착지가 같고 초입은 계단이 많아 다소 힘들 수 있으나 10분 정도 후면 팔각정이 보이고 진강정, 충의정, 덕양정, 행주대첩비 등을 볼 수 있다. 1시간 반 정도면 여유 있게 둘러볼 수 있다. 또한 역사 공원 왼쪽으로 있는 방화대교는 일몰 명소로 해 질 녘이면 많은 사람들이 몰려오기도 한다. 아름다운 한강변에서 자연을 느끼고 역사를 배울 수 있는 곳이다.",
      "zh-CN": "고양 인재개발원 주변 한강변 공원으로 2000년 고양 인재개발원 건립과 함께 조성되었다. 운동장처럼 탁 트인 이곳은 넓은 잔디밭에서 한강뷰를 감상하거나 잔디밭에 앉아 휴식을 취할 수도 있다. 2016년 전망대를 설치하고 한강 백사장에 근접할 수 있도록 한강변으로 길을 내어 정비한 곳으로 군대 초소를 정비한 자리에는 한강과 철새를 조망할 수 있는 친수공간(빨랫돌 머리) 군대 초소 전망대(행호정), 철책 포토존, 바람개비 언덕을 갖춘 역사 공원이다. 주차장에 무료로 차박이 가능해서 한강변의 야경을 보기 위해 찾는 사람들도 많다. 대덕 생태공원~행주산성 역사 공원~군 순찰로~장항 습지 18.2km 코스가 생태테마 관광 10선으로 지정되어 있다. 각종 축제 및 행사가 이루어져 시민들의 여가 공간으로 활용되며 공원 일부는 행주산성 누리길 코스로 행주산성을 한 바퀴 도는 길이다. 순환길이라 출발지와 도착지가 같고 초입은 계단이 많아 다소 힘들 수 있으나 10분 정도 후면 팔각정이 보이고 진강정, 충의정, 덕양정, 행주대첩비 등을 볼 수 있다. 1시간 반 정도면 여유 있게 둘러볼 수 있다. 또한 역사 공원 왼쪽으로 있는 방화대교는 일몰 명소로 해 질 녘이면 많은 사람들이 몰려오기도 한다. 아름다운 한강변에서 자연을 느끼고 역사를 배울 수 있는 곳이다.",
      "zh-TW": "고양 인재개발원 주변 한강변 공원으로 2000년 고양 인재개발원 건립과 함께 조성되었다. 운동장처럼 탁 트인 이곳은 넓은 잔디밭에서 한강뷰를 감상하거나 잔디밭에 앉아 휴식을 취할 수도 있다. 2016년 전망대를 설치하고 한강 백사장에 근접할 수 있도록 한강변으로 길을 내어 정비한 곳으로 군대 초소를 정비한 자리에는 한강과 철새를 조망할 수 있는 친수공간(빨랫돌 머리) 군대 초소 전망대(행호정), 철책 포토존, 바람개비 언덕을 갖춘 역사 공원이다. 주차장에 무료로 차박이 가능해서 한강변의 야경을 보기 위해 찾는 사람들도 많다. 대덕 생태공원~행주산성 역사 공원~군 순찰로~장항 습지 18.2km 코스가 생태테마 관광 10선으로 지정되어 있다. 각종 축제 및 행사가 이루어져 시민들의 여가 공간으로 활용되며 공원 일부는 행주산성 누리길 코스로 행주산성을 한 바퀴 도는 길이다. 순환길이라 출발지와 도착지가 같고 초입은 계단이 많아 다소 힘들 수 있으나 10분 정도 후면 팔각정이 보이고 진강정, 충의정, 덕양정, 행주대첩비 등을 볼 수 있다. 1시간 반 정도면 여유 있게 둘러볼 수 있다. 또한 역사 공원 왼쪽으로 있는 방화대교는 일몰 명소로 해 질 녘이면 많은 사람들이 몰려오기도 한다. 아름다운 한강변에서 자연을 느끼고 역사를 배울 수 있는 곳이다.",
    },
    meta: { updated_at: "2026-09-02" },
    // 오더 #C8 [1]: TourAPI overview_ko 원문 이식 · 마침표 뒤 \n\n 문단 분리만. 창작·의역 0.
    sections: [
      {
        heading: { ko: "소개", en: "About", ja: "紹介", "zh-CN": "介绍", "zh-TW": "介紹" },
        body: {
          ko: "고양 인재개발원 주변 한강변 공원으로 2000년 고양 인재개발원 건립과 함께 조성되었다.\n\n운동장처럼 탁 트인 이곳은 넓은 잔디밭에서 한강뷰를 감상하거나 잔디밭에 앉아 휴식을 취할 수도 있다.\n\n2016년 전망대를 설치하고 한강 백사장에 근접할 수 있도록 한강변으로 길을 내어 정비한 곳으로 군대 초소를 정비한 자리에는 한강과 철새를 조망할 수 있는 친수공간(빨랫돌 머리) 군대 초소 전망대(행호정), 철책 포토존, 바람개비 언덕을 갖춘 역사 공원이다.\n\n주차장에 무료로 차박이 가능해서 한강변의 야경을 보기 위해 찾는 사람들도 많다.\n\n대덕 생태공원~행주산성 역사 공원~군 순찰로~장항 습지 18.2km 코스가 생태테마 관광 10선으로 지정되어 있다.\n\n각종 축제 및 행사가 이루어져 시민들의 여가 공간으로 활용되며 공원 일부는 행주산성 누리길 코스로 행주산성을 한 바퀴 도는 길이다.\n\n순환길이라 출발지와 도착지가 같고 초입은 계단이 많아 다소 힘들 수 있으나 10분 정도 후면 팔각정이 보이고 진강정, 충의정, 덕양정, 행주대첩비 등을 볼 수 있다.\n\n1시간 반 정도면 여유 있게 둘러볼 수 있다.\n\n또한 역사 공원 왼쪽으로 있는 방화대교는 일몰 명소로 해 질 녘이면 많은 사람들이 몰려오기도 한다.\n\n아름다운 한강변에서 자연을 느끼고 역사를 배울 수 있는 곳이다.",
          en: "A Han-riverside park surrounding Goyang Human Resources Development Institute, laid out together with the institute in 2000.\n\nAs wide open as a sports ground, it lets you take in Han River views from the broad lawn or sit on the grass and rest.\n\nAn observation deck was installed in 2016 and paths were laid along the riverside to bring visitors close to the Han River's sand banks. In place of a former military guard post, this is now a history park with a waterfront space overlooking the Han River and its migratory birds (Ppallaettol-meori), a former-guard-post observatory (Haenghojeong), a barbed-wire photo zone, and Pinwheel Hill.\n\nFree overnight car-camping is allowed in the car park, so many come to enjoy the night view along the Han River.\n\nThe 18.2 km course Daedeok Ecological Park → Haengju Historical Park → Military Patrol Trail → Janghang Wetlands is designated one of the Top 10 Eco-themed Tours.\n\nHosting a variety of festivals and events, it serves as a leisure space for citizens; part of the park doubles as the Haengjusanseong Nuri-gil course, which loops all the way around Haengjusanseong Fortress.\n\nAs a loop trail its start and end points coincide. The initial section has many stairs and can feel demanding, but after about ten minutes the octagonal pavilion comes into view, followed by Jingang-jeong, Chungui-jeong, Deogyang-jeong, and the Haengju Daecheop Memorial Stele.\n\nAbout an hour and a half is enough for a leisurely round.\n\nAlso, Banghwa Bridge to the left of the historical park is a well-known sunset spot, drawing crowds as evening falls.\n\nIt is a place where you can feel nature and learn history along the beautiful banks of the Han River.",
          ja: "高陽（コヤン）人材開発院周辺の漢江沿い公園で、2000年の同開発院建設に合わせて造成されました。\n\n運動場のように開けたこの場所は、広い芝生から漢江の眺めを楽しんだり、芝生に座って休んだりできます。\n\n2016年に展望台を設置し、漢江の砂浜に近づけるよう漢江側へ道を整備した場所で、旧軍事哨所の跡地には、漢江と渡り鳥を眺められる親水空間（パルレットル・モリ）、旧哨所展望台（幸湖亭／ヘンホジョン）、鉄柵フォトゾーン、風車の丘を備えた歴史公園があります。\n\n駐車場では無料の車中泊が可能で、漢江沿いの夜景を見に訪れる人も多くいます。\n\n大德エコパーク〜幸州山城歴史公園〜軍巡察路〜獐項湿地の18.2kmコースは「エコテーマ観光10選」に指定されています。\n\n各種フェスティバルやイベントが催され、市民の余暇空間として活用されており、公園の一部は幸州山城ヌリギル・コースとして幸州山城を一周する道になっています。\n\n循環路のため出発地と到着地が同じで、初めの区間は階段が多くやや大変ですが、10分ほどで八角亭が見え、鎮江亭・忠義亭・徳陽亭・幸州大捷碑などを見ることができます。\n\n1時間半ほどでゆったりと巡ることができます。\n\nまた、歴史公園の左手にある傍花大橋（パンファデギョ）は日没の名所で、夕暮れ時には多くの人が集まります。\n\n美しい漢江のほとりで自然を感じ、歴史を学ぶことができる場所です。",
          "zh-CN": "位于高阳人才开发院周边、汉江畔的公园，与2000年高阳人才开发院的建成一同建成。\n\n此地开阔如运动场，可在宽阔的草坪上欣赏汉江景色，或坐于草坪上休息。\n\n2016年设置观景台，并沿汉江修建步道以便靠近汉江沙滩。曾为军哨的位置，现建成集观赏汉江与候鸟的亲水空间（Ppallaettol-meori／빨랫돌 머리）、军哨观景台（幸湖亭）、铁栅栏拍照点与风车山丘于一体的历史公园。\n\n停车场可免费露营宿车，因此不少人为一睹汉江夜景而来。\n\n大德生态公园〜幸州山城历史公园〜军巡逻路〜獐项湿地的18.2公里线路，被指定为「生态主题旅游10选」。\n\n举办多种庆典与活动，是市民的休闲场所；公园部分区段亦为幸州山城Nuri-gil线路，绕行幸州山城一周。\n\n此为环线，起终点相同；起点阶梯较多、稍显吃力，约10分钟后可见八角亭，并依次经过镇江亭、忠义亭、德阳亭、幸州大捷碑等。\n\n约1小时半便可从容游览一圈。\n\n另外，位于历史公园左侧的傍花大桥是有名的日落地，黄昏时常常人潮涌动。\n\n此处可在美丽的汉江之畔感受自然、学习历史。",
          "zh-TW": "位於高陽人才開發院周邊、漢江畔的公園，與2000年高陽人才開發院的建成一同建成。\n\n此地開闊如運動場，可在寬闊的草坪上欣賞漢江景色，或坐於草坪上休息。\n\n2016年設置觀景台，並沿漢江修建步道以便靠近漢江沙灘。曾為軍哨的位置，現建成集觀賞漢江與候鳥的親水空間（Ppallaettol-meori／빨랫돌 머리）、軍哨觀景台（幸湖亭）、鐵柵欄拍照點與風車山丘於一體的歷史公園。\n\n停車場可免費露營宿車，因此不少人為一睹漢江夜景而來。\n\n大德生態公園〜幸州山城歷史公園〜軍巡邏路〜獐項濕地的18.2公里線路，被指定為「生態主題旅遊10選」。\n\n舉辦多種慶典與活動，是市民的休閒場所；公園部分區段亦為幸州山城Nuri-gil線路，繞行幸州山城一周。\n\n此為環線，起終點相同；起點階梯較多、稍顯吃力，約10分鐘後可見八角亭，並依次經過鎮江亭、忠義亭、德陽亭、幸州大捷碑等。\n\n約1小時半便可從容遊覽一圈。\n\n另外，位於歷史公園左側的傍花大橋是有名的日落地，黃昏時常常人潮湧動。\n\n此處可在美麗的漢江之畔感受自然、學習歷史。",
        },
      },
    ],
    access: [],
    know: [],
    ko_card: [{ name_ko: "행주산성 역사공원", address_ko: "경기도 고양시 덕양구 행주외동 140-8" }],
    map: [{ lat: 37.5982699389, lng: 126.8197596027, label: "행주산성 역사공원" }],
    credits: [],
    related: [],
    info: { hours: "varies", duration: "1_2h", admission: "varies", access: "inquiry" },
    highlights: [
      { ko: "행주산성과 연접한 역사 공원", en: "Haengju Historical Park", ja: "幸州山城歴史公園", "zh-CN": "幸州山城历史公园", "zh-TW": "幸州山城歷史公園" },
      { ko: "실외 산책 코스", en: "Haengju Historical Park", ja: "幸州山城歴史公園", "zh-CN": "幸州山城历史公园", "zh-TW": "幸州山城歷史公園" },
      { ko: "주변 문화유산 연계", en: "Haengju Historical Park", ja: "幸州山城歴史公園", "zh-CN": "幸州山城历史公园", "zh-TW": "幸州山城歷史公園" },
    ],
    adSlot: null,
    official_url: "http://www.goyang.go.kr/haengju/haengju04/haengju04_4.jsp",
    best_selected: false,
    tourapi: { contentid: "2661736", overview_ko: "고양 인재개발원 주변 한강변 공원으로 2000년 고양 인재개발원 건립과 함께 조성되었다. 운동장처럼 탁 트인 이곳은 넓은 잔디밭에서 한강뷰를 감상하거나 잔디밭에 앉아 휴식을 취할 수도 있다. 2016년 전망대를 설치하고 한강 백사장에 근접할 수 있도록 한강변으로 길을 내어 정비한 곳으로 군대 초소를 정비한 자리에는 한강과 철새를 조망할 수 있는 친수공간(빨랫돌 머리) 군대 초소 전망대(행호정), 철책 포토존, 바람개비 언덕을 갖춘 역사 공원이다. 주차장에 무료로 차박이 가능해서 한강변의 야경을 보기 위해 찾는 사람들도 많다. 대덕 생태공원~행주산성 역사 공원~군 순찰로~장항 습지 18.2km 코스가 생태테마 관광 10선으로 지정되어 있다. 각종 축제 및 행사가 이루어져 시민들의 여가 공간으로 활용되며 공원 일부는 행주산성 누리길 코스로 행주산성을 한 바퀴 도는 길이다. 순환길이라 출발지와 도착지가 같고 초입은 계단이 많아 다소 힘들 수 있으나 10분 정도 후면 팔각정이 보이고 진강정, 충의정, 덕양정, 행주대첩비 등을 볼 수 있다. 1시간 반 정도면 여유 있게 둘러볼 수 있다. 또한 역사 공원 왼쪽으로 있는 방화대교는 일몰 명소로 해 질 녘이면 많은 사람들이 몰려오기도 한다. 아름다운 한강변에서 자연을 느끼고 역사를 배울 수 있는 곳이다.", homepage: "http://www.goyang.go.kr/haengju/haengju04/haengju04_4.jsp" },
  },

  {
    slug: "heungguksa-goyang",
    category: "history",
    type: "list",
    region: "덕양구",
    title: { ko: "흥국사 (고양)", en: "Heungguksa Temple (Goyang)", ja: "興国寺(高陽)", "zh-CN": "兴国寺 (高阳)", "zh-TW": "興國寺 (高陽)" },
    title_en_display: "HEUNGGUKSA TEMPLE (GOYANG)",
    subtitle: {
      ko: "흥국사의 창건은 지금으로부터 1300여 년 전 전인 서기 661년(신라 문무왕 원년)에 당대 최고의 고승인 원효스님이 북한산 원효암에서 수행 중 북서쪽에서 상서로운 기운이 일어나는 것을 보고 산을 내려와 이곳에 이르게 되었다.",
      en: "흥국사의 창건은 지금으로부터 1300여 년 전 전인 서기 661년(신라 문무왕 원년)에 당대 최고의 고승인 원효스님이 북한산 원효암에서 수행 중 북서쪽에서 상서로운 기운이 일어나는 것을 보고 산을 내려와 이곳에 이르게 되었다.",
      ja: "흥국사의 창건은 지금으로부터 1300여 년 전 전인 서기 661년(신라 문무왕 원년)에 당대 최고의 고승인 원효스님이 북한산 원효암에서 수행 중 북서쪽에서 상서로운 기운이 일어나는 것을 보고 산을 내려와 이곳에 이르게 되었다.",
      "zh-CN": "흥국사의 창건은 지금으로부터 1300여 년 전 전인 서기 661년(신라 문무왕 원년)에 당대 최고의 고승인 원효스님이 북한산 원효암에서 수행 중 북서쪽에서 상서로운 기운이 일어나는 것을 보고 산을 내려와 이곳에 이르게 되었다.",
      "zh-TW": "흥국사의 창건은 지금으로부터 1300여 년 전 전인 서기 661년(신라 문무왕 원년)에 당대 최고의 고승인 원효스님이 북한산 원효암에서 수행 중 북서쪽에서 상서로운 기운이 일어나는 것을 보고 산을 내려와 이곳에 이르게 되었다.",
    },
    lead: {
      ko: "흥국사의 창건은 지금으로부터 1300여 년 전 전인 서기 661년(신라 문무왕 원년)에 당대 최고의 고승인 원효스님이 북한산 원효암에서 수행 중 북서쪽에서 상서로운 기운이 일어나는 것을 보고 산을 내려와 이곳에 이르게 되었다. 서기를 발하고 계신 석조 약사여래 부처님을 보신 원효스님이 인연도량이라 생각하여 본전에 약사부처님을 모시고 ‘상서로운 빛이 일어난 곳이라 앞으로 많은 성인들이 배출될 것이다’하시며 절이름을 흥성암이라 하고 오늘의 흥국사를 창건했다.\n그 이후 사찰의 역사를 가늠해 볼 수 있는 자료가 없어 자세한 자취는 알 수 없으나 서기 1686년(숙종 12)에 중창한 사실과 영조시대에 크게 발전하였다는 기록이 있다. 특히, 서기 1758년(영조 34)에 미타전 아미타불을 개금 중수(복장연기문)하였고, 서기 1770년(영조 46) 생모 숙빈 최씨 묘원인 소녕원에 행차하다가 많은 눈을 만나게 되어 이곳에 들르게 된 영조대왕이 하루를 머물고 아침에 일어나 지었던 시가 비문에 전해진다.\n이후 서기 1785년에 승도대장·관선·가선·법헌스님 등이 중창하였고, 1792년(정조 16)에는 관선·법선스님 등이 후불탱을 조성·봉안했다. 1867(고종 4)년에는 화주 곽명스님이 약사전을 중건하였으며, 1876년(고종 13)에는 화주 설허스님이 칠성각을 중건하였다.",
      en: "흥국사의 창건은 지금으로부터 1300여 년 전 전인 서기 661년(신라 문무왕 원년)에 당대 최고의 고승인 원효스님이 북한산 원효암에서 수행 중 북서쪽에서 상서로운 기운이 일어나는 것을 보고 산을 내려와 이곳에 이르게 되었다. 서기를 발하고 계신 석조 약사여래 부처님을 보신 원효스님이 인연도량이라 생각하여 본전에 약사부처님을 모시고 ‘상서로운 빛이 일어난 곳이라 앞으로 많은 성인들이 배출될 것이다’하시며 절이름을 흥성암이라 하고 오늘의 흥국사를 창건했다.\n그 이후 사찰의 역사를 가늠해 볼 수 있는 자료가 없어 자세한 자취는 알 수 없으나 서기 1686년(숙종 12)에 중창한 사실과 영조시대에 크게 발전하였다는 기록이 있다. 특히, 서기 1758년(영조 34)에 미타전 아미타불을 개금 중수(복장연기문)하였고, 서기 1770년(영조 46) 생모 숙빈 최씨 묘원인 소녕원에 행차하다가 많은 눈을 만나게 되어 이곳에 들르게 된 영조대왕이 하루를 머물고 아침에 일어나 지었던 시가 비문에 전해진다.\n이후 서기 1785년에 승도대장·관선·가선·법헌스님 등이 중창하였고, 1792년(정조 16)에는 관선·법선스님 등이 후불탱을 조성·봉안했다. 1867(고종 4)년에는 화주 곽명스님이 약사전을 중건하였으며, 1876년(고종 13)에는 화주 설허스님이 칠성각을 중건하였다.",
      ja: "흥국사의 창건은 지금으로부터 1300여 년 전 전인 서기 661년(신라 문무왕 원년)에 당대 최고의 고승인 원효스님이 북한산 원효암에서 수행 중 북서쪽에서 상서로운 기운이 일어나는 것을 보고 산을 내려와 이곳에 이르게 되었다. 서기를 발하고 계신 석조 약사여래 부처님을 보신 원효스님이 인연도량이라 생각하여 본전에 약사부처님을 모시고 ‘상서로운 빛이 일어난 곳이라 앞으로 많은 성인들이 배출될 것이다’하시며 절이름을 흥성암이라 하고 오늘의 흥국사를 창건했다.\n그 이후 사찰의 역사를 가늠해 볼 수 있는 자료가 없어 자세한 자취는 알 수 없으나 서기 1686년(숙종 12)에 중창한 사실과 영조시대에 크게 발전하였다는 기록이 있다. 특히, 서기 1758년(영조 34)에 미타전 아미타불을 개금 중수(복장연기문)하였고, 서기 1770년(영조 46) 생모 숙빈 최씨 묘원인 소녕원에 행차하다가 많은 눈을 만나게 되어 이곳에 들르게 된 영조대왕이 하루를 머물고 아침에 일어나 지었던 시가 비문에 전해진다.\n이후 서기 1785년에 승도대장·관선·가선·법헌스님 등이 중창하였고, 1792년(정조 16)에는 관선·법선스님 등이 후불탱을 조성·봉안했다. 1867(고종 4)년에는 화주 곽명스님이 약사전을 중건하였으며, 1876년(고종 13)에는 화주 설허스님이 칠성각을 중건하였다.",
      "zh-CN": "흥국사의 창건은 지금으로부터 1300여 년 전 전인 서기 661년(신라 문무왕 원년)에 당대 최고의 고승인 원효스님이 북한산 원효암에서 수행 중 북서쪽에서 상서로운 기운이 일어나는 것을 보고 산을 내려와 이곳에 이르게 되었다. 서기를 발하고 계신 석조 약사여래 부처님을 보신 원효스님이 인연도량이라 생각하여 본전에 약사부처님을 모시고 ‘상서로운 빛이 일어난 곳이라 앞으로 많은 성인들이 배출될 것이다’하시며 절이름을 흥성암이라 하고 오늘의 흥국사를 창건했다.\n그 이후 사찰의 역사를 가늠해 볼 수 있는 자료가 없어 자세한 자취는 알 수 없으나 서기 1686년(숙종 12)에 중창한 사실과 영조시대에 크게 발전하였다는 기록이 있다. 특히, 서기 1758년(영조 34)에 미타전 아미타불을 개금 중수(복장연기문)하였고, 서기 1770년(영조 46) 생모 숙빈 최씨 묘원인 소녕원에 행차하다가 많은 눈을 만나게 되어 이곳에 들르게 된 영조대왕이 하루를 머물고 아침에 일어나 지었던 시가 비문에 전해진다.\n이후 서기 1785년에 승도대장·관선·가선·법헌스님 등이 중창하였고, 1792년(정조 16)에는 관선·법선스님 등이 후불탱을 조성·봉안했다. 1867(고종 4)년에는 화주 곽명스님이 약사전을 중건하였으며, 1876년(고종 13)에는 화주 설허스님이 칠성각을 중건하였다.",
      "zh-TW": "흥국사의 창건은 지금으로부터 1300여 년 전 전인 서기 661년(신라 문무왕 원년)에 당대 최고의 고승인 원효스님이 북한산 원효암에서 수행 중 북서쪽에서 상서로운 기운이 일어나는 것을 보고 산을 내려와 이곳에 이르게 되었다. 서기를 발하고 계신 석조 약사여래 부처님을 보신 원효스님이 인연도량이라 생각하여 본전에 약사부처님을 모시고 ‘상서로운 빛이 일어난 곳이라 앞으로 많은 성인들이 배출될 것이다’하시며 절이름을 흥성암이라 하고 오늘의 흥국사를 창건했다.\n그 이후 사찰의 역사를 가늠해 볼 수 있는 자료가 없어 자세한 자취는 알 수 없으나 서기 1686년(숙종 12)에 중창한 사실과 영조시대에 크게 발전하였다는 기록이 있다. 특히, 서기 1758년(영조 34)에 미타전 아미타불을 개금 중수(복장연기문)하였고, 서기 1770년(영조 46) 생모 숙빈 최씨 묘원인 소녕원에 행차하다가 많은 눈을 만나게 되어 이곳에 들르게 된 영조대왕이 하루를 머물고 아침에 일어나 지었던 시가 비문에 전해진다.\n이후 서기 1785년에 승도대장·관선·가선·법헌스님 등이 중창하였고, 1792년(정조 16)에는 관선·법선스님 등이 후불탱을 조성·봉안했다. 1867(고종 4)년에는 화주 곽명스님이 약사전을 중건하였으며, 1876년(고종 13)에는 화주 설허스님이 칠성각을 중건하였다.",
    },
    meta: { updated_at: "2026-09-02" },
    // 오더 #C8 [1]: TourAPI overview_ko 원문 이식 · 마침표 뒤 \n\n 문단 분리만. 창작·의역 0.
    sections: [
      {
        heading: { ko: "소개", en: "About", ja: "紹介", "zh-CN": "介绍", "zh-TW": "介紹" },
        body: {
          ko: "흥국사의 창건은 지금으로부터 1300여 년 전 전인 서기 661년(신라 문무왕 원년)에 당대 최고의 고승인 원효스님이 북한산 원효암에서 수행 중 북서쪽에서 상서로운 기운이 일어나는 것을 보고 산을 내려와 이곳에 이르게 되었다.\n\n서기를 발하고 계신 석조 약사여래 부처님을 보신 원효스님이 인연도량이라 생각하여 본전에 약사부처님을 모시고 ‘상서로운 빛이 일어난 곳이라 앞으로 많은 성인들이 배출될 것이다’하시며 절이름을 흥성암이라 하고 오늘의 흥국사를 창건했다.\n\n그 이후 사찰의 역사를 가늠해 볼 수 있는 자료가 없어 자세한 자취는 알 수 없으나 서기 1686년(숙종 12)에 중창한 사실과 영조시대에 크게 발전하였다는 기록이 있다.\n\n특히, 서기 1758년(영조 34)에 미타전 아미타불을 개금 중수(복장연기문)하였고, 서기 1770년(영조 46) 생모 숙빈 최씨 묘원인 소녕원에 행차하다가 많은 눈을 만나게 되어 이곳에 들르게 된 영조대왕이 하루를 머물고 아침에 일어나 지었던 시가 비문에 전해진다.\n\n이후 서기 1785년에 승도대장·관선·가선·법헌스님 등이 중창하였고, 1792년(정조 16)에는 관선·법선스님 등이 후불탱을 조성·봉안했다.\n\n1867(고종 4)년에는 화주 곽명스님이 약사전을 중건하였으며, 1876년(고종 13)에는 화주 설허스님이 칠성각을 중건하였다.",
          en: "Heungguksa Temple was founded more than 1,300 years ago, in 661 CE (the 1st year of King Munmu of Silla), when the eminent monk Wonhyo — foremost of his day — was practising at Wonhyoam Hermitage on Bukhansan Mountain and, on seeing an auspicious energy rising in the northwest, came down the mountain and arrived here.\n\nSeeing the stone Bhaishajyaguru (Yaksa Yeorae) Buddha emitting an auspicious light, Wonhyo took it as an inyeon (karmic) practice site, enshrined the Medicine Buddha in the main hall, and, declaring \"since this is a place where auspicious light has arisen, many saints will come forth from it in the future,\" named the temple Heungseong-am — the founding of what is today Heungguksa.\n\nThe records that would let us gauge the temple's history from that point onward are lost, so the fine details remain unknown, but records survive of a major reconstruction in 1686 (12th year of King Sukjong) and of great development during the reign of King Yeongjo.\n\nIn particular, in 1758 (34th year of Yeongjo) the Amitabha Buddha of Mitajeon Hall was regilded and refurbished (recorded in the Bokjang-yeon-gimun), and in 1770 (46th year of Yeongjo) King Yeongjo — on his way to Sonyeongwon, the tomb park of his birth mother Sukbin Choi — was caught in heavy snow and stopped here for the night. The poem he composed the next morning is preserved on a stele.\n\nThereafter, in 1785, the monks Seungdodaejang, Gwanseon, Gaseon and Beopheon carried out a reconstruction, and in 1792 (16th year of King Jeongjo), the monks Gwanseon and Beopseon created and enshrined a hubultaeng (rear Buddha painting).\n\nIn 1867 (4th year of King Gojong), the fund-raising monk Gwakmyeong rebuilt Yaksajeon Hall, and in 1876 (13th year of Gojong), the fund-raising monk Seolheo rebuilt Chilseonggak Shrine.",
          ja: "興国寺（フングクサ）の創建は今から1,300余年前の西暦661年（新羅・文武王元年）、当代随一の高僧・元暁（ウォンヒョ）大師が北漢山の元暁庵で修行中、北西から瑞々しい気運が立ち上るのを見て山を下り、この地に至ったことに始まります。\n\n瑞光を放つ石造の薬師如来仏を見た元暁大師は、この地を因縁の道場と考えて本殿に薬師仏を奉安し、「瑞光が立ち上がった地であるから、これから多くの聖人が輩出されるであろう」として寺の名を興聖庵と定め、今日の興国寺を創建しました。\n\nそれ以降、寺の歴史をたどれる資料が残らず詳細は不明ですが、西暦1686年（粛宗12年）に重創された事実、および英祖時代に大いに発展したという記録があります。\n\n特に西暦1758年（英祖34年）に弥陀殿の阿弥陀仏を改金補修（腹蔵縁起文）し、西暦1770年（英祖46年）には、生母・淑嬪崔氏の墓園である昭寧園への行幸の途中で大雪に遭ってここに立ち寄った英祖大王が一夜を過ごし、翌朝起きて詠んだ詩が碑文に伝わっています。\n\nその後、西暦1785年に僧都大将・寛善・可善・法軒などの僧たちが重創し、1792年（正祖16年）には寛善・法善などの僧たちが後仏幀（フブルテン）を制作・奉安しました。\n\n1867年（高宗4年）には化主・郭明和尚が薬師殿を再建し、1876年（高宗13年）には化主・雪虚和尚が七星閣を再建しました。",
          "zh-CN": "兴国寺的创建可追溯至距今1,300余年前的公元661年（新罗文武王元年）。当时首屈一指的高僧元晓大师在北汉山元晓庵修行时，见西北方升起祥瑞之气，遂下山抵达此地。\n\n元晓大师见到发出瑞光的石造药师如来佛像，认为此处为因缘道场，遂于本殿供奉药师佛，并称「此乃瑞光升起之地，日后将出许多圣人」，遂将寺名定为兴圣庵，即今兴国寺之创立。\n\n此后可考的寺史资料缺失，详细踪迹已不可知，然于公元1686年（肃宗12年）曾有重创记录，并载英祖时代大有发展。\n\n尤其公元1758年（英祖34年），弥陀殿阿弥陀佛像经改金重修（腹藏缘起文）；公元1770年（英祖46年），英祖大王前往其生母淑嫔崔氏之墓园昭宁园途中遭遇大雪，遂驻跸于此，翌晨起身所作之诗保存于碑文之中。\n\n此后于公元1785年，僧都大将、宽善、可善、法轩等僧重创；1792年（正祖16年）宽善、法善等僧制作并奉安后佛帧。\n\n1867年（高宗4年）化主郭明和尚重建药师殿；1876年（高宗13年）化主雪虚和尚重建七星阁。",
          "zh-TW": "興國寺的創建可追溯至距今1,300餘年前的西元661年（新羅文武王元年）。當時首屈一指的高僧元曉大師在北漢山元曉庵修行時，見西北方升起祥瑞之氣，遂下山抵達此地。\n\n元曉大師見到發出瑞光的石造藥師如來佛像，認為此處為因緣道場，遂於本殿供奉藥師佛，並稱「此乃瑞光升起之地，日後將出許多聖人」，遂將寺名定為興聖庵，即今興國寺之創立。\n\n此後可考的寺史資料缺失，詳細蹤跡已不可知，然於西元1686年（肅宗12年）曾有重創記錄，並載英祖時代大有發展。\n\n尤其西元1758年（英祖34年），彌陀殿阿彌陀佛像經改金重修（腹藏緣起文）；西元1770年（英祖46年），英祖大王前往其生母淑嬪崔氏之墓園昭寧園途中遭遇大雪，遂駐蹕於此，翌晨起身所作之詩保存於碑文之中。\n\n此後於西元1785年，僧都大將、寬善、可善、法軒等僧重創；1792年（正祖16年）寬善、法善等僧製作並奉安後佛幀。\n\n1867年（高宗4年）化主郭明和尚重建藥師殿；1876年（高宗13年）化主雪虛和尚重建七星閣。",
        },
      },
    ],
    access: [],
    know: [],
    ko_card: [{ name_ko: "흥국사 (고양)", address_ko: "경기도 고양시 덕양구 흥국사길 82 (지축동)" }],
    map: [{ lat: 37.6634311722, lng: 126.9397745828, label: "흥국사 (고양)" }],
    credits: [],
    related: [],
    info: { hours: "varies", duration: "1_2h", admission: "varies", access: "inquiry" },
    highlights: [
      { ko: "북한산 자락 사찰", en: "Heungguksa Temple (Goyang)", ja: "興国寺(高陽)", "zh-CN": "兴国寺 (高阳)", "zh-TW": "興國寺 (高陽)" },
      { ko: "유서 깊은 대웅전", en: "Heungguksa Temple (Goyang)", ja: "興国寺(高陽)", "zh-CN": "兴国寺 (高阳)", "zh-TW": "興國寺 (高陽)" },
      { ko: "조용한 산사 분위기", en: "Heungguksa Temple (Goyang)", ja: "興国寺(高陽)", "zh-CN": "兴国寺 (高阳)", "zh-TW": "興國寺 (高陽)" },
    ],
    adSlot: null,
    official_url: "http://www.heungguksa.or.kr",
    best_selected: false,
    tourapi: { contentid: "128871", overview_ko: "흥국사의 창건은 지금으로부터 1300여 년 전 전인 서기 661년(신라 문무왕 원년)에 당대 최고의 고승인 원효스님이 북한산 원효암에서 수행 중 북서쪽에서 상서로운 기운이 일어나는 것을 보고 산을 내려와 이곳에 이르게 되었다. 서기를 발하고 계신 석조 약사여래 부처님을 보신 원효스님이 인연도량이라 생각하여 본전에 약사부처님을 모시고 ‘상서로운 빛이 일어난 곳이라 앞으로 많은 성인들이 배출될 것이다’하시며 절이름을 흥성암이라 하고 오늘의 흥국사를 창건했다.\n그 이후 사찰의 역사를 가늠해 볼 수 있는 자료가 없어 자세한 자취는 알 수 없으나 서기 1686년(숙종 12)에 중창한 사실과 영조시대에 크게 발전하였다는 기록이 있다. 특히, 서기 1758년(영조 34)에 미타전 아미타불을 개금 중수(복장연기문)하였고, 서기 1770년(영조 46) 생모 숙빈 최씨 묘원인 소녕원에 행차하다가 많은 눈을 만나게 되어 이곳에 들르게 된 영조대왕이 하루를 머물고 아침에 일어나 지었던 시가 비문에 전해진다.\n이후 서기 1785년에 승도대장·관선·가선·법헌스님 등이 중창하였고, 1792년(정조 16)에는 관선·법선스님 등이 후불탱을 조성·봉안했다. 1867(고종 4)년에는 화주 곽명스님이 약사전을 중건하였으며, 1876년(고종 13)에는 화주 설허스님이 칠성각을 중건하였다.", homepage: "http://www.heungguksa.or.kr" },
  },

  {
    slug: "bukhansanseong",
    category: "history",
    type: "list",
    region: "덕양구",
    title: { ko: "북한산성", en: "Bukhansanseong Fortress", ja: "北漢山城", "zh-CN": "北汉山城", "zh-TW": "北漢山城" },
    title_en_display: "BUKHANSANSEONG FORTRESS",
    subtitle: {
      ko: "북한산성은 고양시 덕양구 북한동과 서울시 강북구, 종로구, 은평구 경계의 북한산 정상 능선을 따라 위치하는 포곡식 석축산성이다.",
      en: "북한산성은 고양시 덕양구 북한동과 서울시 강북구, 종로구, 은평구 경계의 북한산 정상 능선을 따라 위치하는 포곡식 석축산성이다.",
      ja: "북한산성은 고양시 덕양구 북한동과 서울시 강북구, 종로구, 은평구 경계의 북한산 정상 능선을 따라 위치하는 포곡식 석축산성이다.",
      "zh-CN": "북한산성은 고양시 덕양구 북한동과 서울시 강북구, 종로구, 은평구 경계의 북한산 정상 능선을 따라 위치하는 포곡식 석축산성이다.",
      "zh-TW": "북한산성은 고양시 덕양구 북한동과 서울시 강북구, 종로구, 은평구 경계의 북한산 정상 능선을 따라 위치하는 포곡식 석축산성이다.",
    },
    lead: {
      ko: "북한산성은 고양시 덕양구 북한동과 서울시 강북구, 종로구, 은평구 경계의 북한산 정상 능선을 따라 위치하는 포곡식 석축산성이다. 백제가 수도를 하남 위례성으로 정했을 때 도성을 지키던 북방의 성으로 백제 개루왕 5년(132년)에 북한산성의 명칭으로 축조했다는 기록이 있다. 이 지역은 고구려, 백제, 신라가 서로 차지하기 위해 쟁탈전을 벌였던 곳이며, 조선시대에는 도성을 지키는 중요한 곳이었다. 11세기 초 거란의 침입이 있을 때 현종이 고려 태조의 관을 이곳으로 옮겨 오기도 했다. 고려 고종 19년(1232년)에 몽고군과의 격전이 있었고, 우왕 13년(1387년)에 성을 다시 고쳐지었다. 성의 규모는 대서문, 동서문, 북문 등 13개의 성문과 불을 피우던 곳으로 동장대, 남장대, 북장대가 있었다. 현재 북한산성에는 삼국시대의 토성이 약간 남아 있기는 하나 대개 조선 숙종 때 쌓은 것으로 여장은 허물어졌고, 대서문과 장대지, 우물터, 건물터로 생각되는 방어시설 일부가 남아있다.",
      en: "북한산성은 고양시 덕양구 북한동과 서울시 강북구, 종로구, 은평구 경계의 북한산 정상 능선을 따라 위치하는 포곡식 석축산성이다. 백제가 수도를 하남 위례성으로 정했을 때 도성을 지키던 북방의 성으로 백제 개루왕 5년(132년)에 북한산성의 명칭으로 축조했다는 기록이 있다. 이 지역은 고구려, 백제, 신라가 서로 차지하기 위해 쟁탈전을 벌였던 곳이며, 조선시대에는 도성을 지키는 중요한 곳이었다. 11세기 초 거란의 침입이 있을 때 현종이 고려 태조의 관을 이곳으로 옮겨 오기도 했다. 고려 고종 19년(1232년)에 몽고군과의 격전이 있었고, 우왕 13년(1387년)에 성을 다시 고쳐지었다. 성의 규모는 대서문, 동서문, 북문 등 13개의 성문과 불을 피우던 곳으로 동장대, 남장대, 북장대가 있었다. 현재 북한산성에는 삼국시대의 토성이 약간 남아 있기는 하나 대개 조선 숙종 때 쌓은 것으로 여장은 허물어졌고, 대서문과 장대지, 우물터, 건물터로 생각되는 방어시설 일부가 남아있다.",
      ja: "북한산성은 고양시 덕양구 북한동과 서울시 강북구, 종로구, 은평구 경계의 북한산 정상 능선을 따라 위치하는 포곡식 석축산성이다. 백제가 수도를 하남 위례성으로 정했을 때 도성을 지키던 북방의 성으로 백제 개루왕 5년(132년)에 북한산성의 명칭으로 축조했다는 기록이 있다. 이 지역은 고구려, 백제, 신라가 서로 차지하기 위해 쟁탈전을 벌였던 곳이며, 조선시대에는 도성을 지키는 중요한 곳이었다. 11세기 초 거란의 침입이 있을 때 현종이 고려 태조의 관을 이곳으로 옮겨 오기도 했다. 고려 고종 19년(1232년)에 몽고군과의 격전이 있었고, 우왕 13년(1387년)에 성을 다시 고쳐지었다. 성의 규모는 대서문, 동서문, 북문 등 13개의 성문과 불을 피우던 곳으로 동장대, 남장대, 북장대가 있었다. 현재 북한산성에는 삼국시대의 토성이 약간 남아 있기는 하나 대개 조선 숙종 때 쌓은 것으로 여장은 허물어졌고, 대서문과 장대지, 우물터, 건물터로 생각되는 방어시설 일부가 남아있다.",
      "zh-CN": "북한산성은 고양시 덕양구 북한동과 서울시 강북구, 종로구, 은평구 경계의 북한산 정상 능선을 따라 위치하는 포곡식 석축산성이다. 백제가 수도를 하남 위례성으로 정했을 때 도성을 지키던 북방의 성으로 백제 개루왕 5년(132년)에 북한산성의 명칭으로 축조했다는 기록이 있다. 이 지역은 고구려, 백제, 신라가 서로 차지하기 위해 쟁탈전을 벌였던 곳이며, 조선시대에는 도성을 지키는 중요한 곳이었다. 11세기 초 거란의 침입이 있을 때 현종이 고려 태조의 관을 이곳으로 옮겨 오기도 했다. 고려 고종 19년(1232년)에 몽고군과의 격전이 있었고, 우왕 13년(1387년)에 성을 다시 고쳐지었다. 성의 규모는 대서문, 동서문, 북문 등 13개의 성문과 불을 피우던 곳으로 동장대, 남장대, 북장대가 있었다. 현재 북한산성에는 삼국시대의 토성이 약간 남아 있기는 하나 대개 조선 숙종 때 쌓은 것으로 여장은 허물어졌고, 대서문과 장대지, 우물터, 건물터로 생각되는 방어시설 일부가 남아있다.",
      "zh-TW": "북한산성은 고양시 덕양구 북한동과 서울시 강북구, 종로구, 은평구 경계의 북한산 정상 능선을 따라 위치하는 포곡식 석축산성이다. 백제가 수도를 하남 위례성으로 정했을 때 도성을 지키던 북방의 성으로 백제 개루왕 5년(132년)에 북한산성의 명칭으로 축조했다는 기록이 있다. 이 지역은 고구려, 백제, 신라가 서로 차지하기 위해 쟁탈전을 벌였던 곳이며, 조선시대에는 도성을 지키는 중요한 곳이었다. 11세기 초 거란의 침입이 있을 때 현종이 고려 태조의 관을 이곳으로 옮겨 오기도 했다. 고려 고종 19년(1232년)에 몽고군과의 격전이 있었고, 우왕 13년(1387년)에 성을 다시 고쳐지었다. 성의 규모는 대서문, 동서문, 북문 등 13개의 성문과 불을 피우던 곳으로 동장대, 남장대, 북장대가 있었다. 현재 북한산성에는 삼국시대의 토성이 약간 남아 있기는 하나 대개 조선 숙종 때 쌓은 것으로 여장은 허물어졌고, 대서문과 장대지, 우물터, 건물터로 생각되는 방어시설 일부가 남아있다.",
    },
    meta: { updated_at: "2026-09-02" },
    // 오더 #C8 [1]: TourAPI overview_ko 원문 이식 · 마침표 뒤 \n\n 문단 분리만. 창작·의역 0.
    sections: [
      {
        heading: { ko: "소개", en: "About", ja: "紹介", "zh-CN": "介绍", "zh-TW": "介紹" },
        body: {
          ko: "북한산성은 고양시 덕양구 북한동과 서울시 강북구, 종로구, 은평구 경계의 북한산 정상 능선을 따라 위치하는 포곡식 석축산성이다.\n\n백제가 수도를 하남 위례성으로 정했을 때 도성을 지키던 북방의 성으로 백제 개루왕 5년(132년)에 북한산성의 명칭으로 축조했다는 기록이 있다.\n\n이 지역은 고구려, 백제, 신라가 서로 차지하기 위해 쟁탈전을 벌였던 곳이며, 조선시대에는 도성을 지키는 중요한 곳이었다.\n\n11세기 초 거란의 침입이 있을 때 현종이 고려 태조의 관을 이곳으로 옮겨 오기도 했다.\n\n고려 고종 19년(1232년)에 몽고군과의 격전이 있었고, 우왕 13년(1387년)에 성을 다시 고쳐지었다.\n\n성의 규모는 대서문, 동서문, 북문 등 13개의 성문과 불을 피우던 곳으로 동장대, 남장대, 북장대가 있었다.\n\n현재 북한산성에는 삼국시대의 토성이 약간 남아 있기는 하나 대개 조선 숙종 때 쌓은 것으로 여장은 허물어졌고, 대서문과 장대지, 우물터, 건물터로 생각되는 방어시설 일부가 남아있다.",
          en: "Bukhansanseong Fortress is a valley-enclosing stone-walled mountain fortress that runs along the summit ridge of Bukhansan Mountain, on the boundary of Bukhan-dong (Deokyang-gu, Goyang-si) and Seoul's Gangbuk-gu, Jongno-gu, and Eunpyeong-gu.\n\nRecords indicate that it was built as a northern defence of the capital when Baekje set its seat at Hanam Wiryeseong, and was constructed under the name Bukhansanseong in the 5th year of King Gaeru of Baekje (132 CE).\n\nThis region was contested among Goguryeo, Baekje, and Silla, and in the Joseon era it was a critical site defending the capital.\n\nDuring the Khitan invasion in the early 11th century, King Hyeonjong even moved the coffin of the Goryeo founder Taejo here.\n\nA major battle against Mongol forces was fought in the 19th year of King Gojong of Goryeo (1232), and the fortress was rebuilt in the 13th year of King U (1387).\n\nAt its extent the fortress had 13 gates — including Daeseomun, Dongseomun and Bukmun — and, as command-fire posts, Dongjangdae, Namjangdae and Bukjangdae.\n\nToday only a small portion of a Three Kingdoms-period earthen wall survives at Bukhansanseong; most of what stands dates to the reign of King Sukjong of Joseon. The parapets are ruined, but Daeseomun, jangdae sites, well sites, and part of the defensive works believed to be building foundations remain.",
          ja: "北漢山城は、高陽市徳陽区北漢洞とソウル特別市江北区・鍾路区・恩平区の境界にある北漢山の山頂稜線に沿って築かれた「包谷式」の石築山城です。\n\n百済が都を漢南慰礼城（ハナム・ウィレソン）と定めた時、都城を守る北方の城として、百済・蓋婁王5年（132年）に「北漢山城」の名で築造されたとの記録があります。\n\nこの地域は高句麗・百済・新羅が互いに争奪戦を繰り広げた場所で、朝鮮時代には都城を守る要衝でした。\n\n11世紀初め、契丹の侵入があった際には、顕宗が高麗・太祖の棺をこの地に移してきたこともあります。\n\n高麗・高宗19年（1232年）にはモンゴル軍との激戦があり、禑王13年（1387年）に城が再び修築されました。\n\n城の規模は、大西門・東西門・北門など13の城門と、烽火を焚く場所として東将台・南将台・北将台が置かれていました。\n\n現在の北漢山城には、三国時代の土城がわずかに残るのみで、大部分は朝鮮・粛宗の時に築かれたもので、女牆は崩れており、大西門と将台跡、井戸跡、建物跡と考えられる防御施設の一部が残っています。",
          "zh-CN": "北汉山城是沿北汉山山顶山脊修筑的「包谷式」石筑山城，位于高阳市德阳区北汉洞与首尔市江北区、钟路区、恩平区的交界处。\n\n据记载，百济定都汉南慰礼城时，为拱卫都城之北方城池，于百济盖娄王5年（132年）以「北汉山城」之名筑造。\n\n此地是高句丽、百济、新罗为争夺而互相攻伐之地，朝鲜时代亦为守卫都城的要地。\n\n11世纪初契丹入侵时，显宗曾将高丽太祖之棺移至此地。\n\n高丽高宗19年（1232年）此地曾与蒙古军激战，禑王13年（1387年）重修城郭。\n\n城的规模有大西门、东西门、北门等13座城门，作为烽燧之处设有东将台、南将台、北将台。\n\n如今北汉山城仅存少量三国时代土城，其余多为朝鲜肃宗时期所筑；女墙已倾圮，仅存大西门、将台旧址、井址与被认为是建筑遗址的部分防御设施。",
          "zh-TW": "北漢山城是沿北漢山山頂山脊修築的「包谷式」石築山城，位於高陽市德陽區北漢洞與首爾市江北區、鐘路區、恩平區的交界處。\n\n據記載，百濟定都漢南慰禮城時，為拱衛都城之北方城池，於百濟蓋婁王5年（132年）以「北漢山城」之名築造。\n\n此地是高句麗、百濟、新羅為爭奪而互相攻伐之地，朝鮮時代亦為守衛都城的要地。\n\n11世紀初契丹入侵時，顯宗曾將高麗太祖之棺移至此地。\n\n高麗高宗19年（1232年）此地曾與蒙古軍激戰，禑王13年（1387年）重修城郭。\n\n城的規模有大西門、東西門、北門等13座城門，作為烽燧之處設有東將台、南將台、北將台。\n\n如今北漢山城僅存少量三國時代土城，其餘多為朝鮮肅宗時期所築；女牆已傾圮，僅存大西門、將台舊址、井址與被認為是建築遺址的部分防禦設施。",
        },
      },
    ],
    access: [],
    know: [],
    ko_card: [{ name_ko: "북한산성", address_ko: "경기도 고양시 덕양구 북한동" }],
    map: [{ lat: 37.6461, lng: 126.9612, label: "북한산성" }],
    credits: [],
    related: [],
    info: { hours: "varies", duration: "1_2h", admission: "varies", access: "inquiry" },
    highlights: [
      { ko: "고양·서울에 걸친 산성", en: "Bukhansanseong Fortress", ja: "北漢山城", "zh-CN": "北汉山城", "zh-TW": "北漢山城" },
      { ko: "북한산 등산로 연계", en: "Bukhansanseong Fortress", ja: "北漢山城", "zh-CN": "北汉山城", "zh-TW": "北漢山城" },
      { ko: "사적 지정", en: "Bukhansanseong Fortress", ja: "北漢山城", "zh-CN": "北汉山城", "zh-TW": "北漢山城" },
    ],
    adSlot: null,
    official_url: "https://www.goyang.go.kr/visitgoyang",
    best_selected: false,
    tourapi: { contentid: "125550", overview_ko: "북한산성은 고양시 덕양구 북한동과 서울시 강북구, 종로구, 은평구 경계의 북한산 정상 능선을 따라 위치하는 포곡식 석축산성이다. 백제가 수도를 하남 위례성으로 정했을 때 도성을 지키던 북방의 성으로 백제 개루왕 5년(132년)에 북한산성의 명칭으로 축조했다는 기록이 있다. 이 지역은 고구려, 백제, 신라가 서로 차지하기 위해 쟁탈전을 벌였던 곳이며, 조선시대에는 도성을 지키는 중요한 곳이었다. 11세기 초 거란의 침입이 있을 때 현종이 고려 태조의 관을 이곳으로 옮겨 오기도 했다. 고려 고종 19년(1232년)에 몽고군과의 격전이 있었고, 우왕 13년(1387년)에 성을 다시 고쳐지었다. 성의 규모는 대서문, 동서문, 북문 등 13개의 성문과 불을 피우던 곳으로 동장대, 남장대, 북장대가 있었다. 현재 북한산성에는 삼국시대의 토성이 약간 남아 있기는 하나 대개 조선 숙종 때 쌓은 것으로 여장은 허물어졌고, 대서문과 장대지, 우물터, 건물터로 생각되는 방어시설 일부가 남아있다.", homepage: "https://www.goyang.go.kr/visitgoyang" },
  },

  {
    slug: "gongyang-royal-tomb",
    category: "history",
    type: "list",
    region: "덕양구",
    title: { ko: "고양 공양왕릉", en: "King Gongyang's Tomb (Goyang)", ja: "高陽 恭譲王陵", "zh-CN": "高阳 恭让王陵", "zh-TW": "高陽 恭讓王陵" },
    title_en_display: "KING GONGYANG'S TOMB (GOYANG)",
    subtitle: {
      ko: "고려 공양왕릉은 고려의 마지막 왕인 공양왕과 그의 부인 순비 노 씨의 무덤이다.",
      en: "고려 공양왕릉은 고려의 마지막 왕인 공양왕과 그의 부인 순비 노 씨의 무덤이다.",
      ja: "고려 공양왕릉은 고려의 마지막 왕인 공양왕과 그의 부인 순비 노 씨의 무덤이다.",
      "zh-CN": "고려 공양왕릉은 고려의 마지막 왕인 공양왕과 그의 부인 순비 노 씨의 무덤이다.",
      "zh-TW": "고려 공양왕릉은 고려의 마지막 왕인 공양왕과 그의 부인 순비 노 씨의 무덤이다.",
    },
    lead: {
      ko: "고려 공양왕릉은 고려의 마지막 왕인 공양왕과 그의 부인 순비 노 씨의 무덤이다. 공양왕은 이성계 등에 의해서 즉위한 이름뿐인 왕이었다. 조선 건국 직후 원주로 추방되었다가 1394년에 삼척부에서 두 아들과 함께 살해되었다. 1416년에 공양왕으로 봉하고 고양현에 무덤을 마련하였다. 왕과 함께 묻힌 왕비는 노신의 딸로 숙녕, 정신, 경화 세 공주와 창성군을 낳았으나 고려가 멸망한 후 왕과 함께 폐위되었다. 무덤은 쌍릉 형식으로 무덤 앞에는 비석과 상석이 하나씩 놓여 있고, 두 무덤 사이에 석등과 돌로 만든 호랑이 상이 있다. 이 호랑이 상은 고려의 전통적인 양식을 보여주고 있으나, 조선 초기의 왕릉인 태조와 태종 무덤의 것과 양식이 비슷하다. 무덤의 양쪽에는 문신과 무신상을 세웠다. 무덤 앞에 만들어 놓은 석물은 양식과 수법이 대체로 소박하다. 비석은 처음에 세운 것으로 보이지만 고려 공양왕 고릉이라는 글씨가 있는 무덤을 표시하는 돌은 조선 고종 때에 세운 것으로 알려지고 있다.",
      en: "고려 공양왕릉은 고려의 마지막 왕인 공양왕과 그의 부인 순비 노 씨의 무덤이다. 공양왕은 이성계 등에 의해서 즉위한 이름뿐인 왕이었다. 조선 건국 직후 원주로 추방되었다가 1394년에 삼척부에서 두 아들과 함께 살해되었다. 1416년에 공양왕으로 봉하고 고양현에 무덤을 마련하였다. 왕과 함께 묻힌 왕비는 노신의 딸로 숙녕, 정신, 경화 세 공주와 창성군을 낳았으나 고려가 멸망한 후 왕과 함께 폐위되었다. 무덤은 쌍릉 형식으로 무덤 앞에는 비석과 상석이 하나씩 놓여 있고, 두 무덤 사이에 석등과 돌로 만든 호랑이 상이 있다. 이 호랑이 상은 고려의 전통적인 양식을 보여주고 있으나, 조선 초기의 왕릉인 태조와 태종 무덤의 것과 양식이 비슷하다. 무덤의 양쪽에는 문신과 무신상을 세웠다. 무덤 앞에 만들어 놓은 석물은 양식과 수법이 대체로 소박하다. 비석은 처음에 세운 것으로 보이지만 고려 공양왕 고릉이라는 글씨가 있는 무덤을 표시하는 돌은 조선 고종 때에 세운 것으로 알려지고 있다.",
      ja: "고려 공양왕릉은 고려의 마지막 왕인 공양왕과 그의 부인 순비 노 씨의 무덤이다. 공양왕은 이성계 등에 의해서 즉위한 이름뿐인 왕이었다. 조선 건국 직후 원주로 추방되었다가 1394년에 삼척부에서 두 아들과 함께 살해되었다. 1416년에 공양왕으로 봉하고 고양현에 무덤을 마련하였다. 왕과 함께 묻힌 왕비는 노신의 딸로 숙녕, 정신, 경화 세 공주와 창성군을 낳았으나 고려가 멸망한 후 왕과 함께 폐위되었다. 무덤은 쌍릉 형식으로 무덤 앞에는 비석과 상석이 하나씩 놓여 있고, 두 무덤 사이에 석등과 돌로 만든 호랑이 상이 있다. 이 호랑이 상은 고려의 전통적인 양식을 보여주고 있으나, 조선 초기의 왕릉인 태조와 태종 무덤의 것과 양식이 비슷하다. 무덤의 양쪽에는 문신과 무신상을 세웠다. 무덤 앞에 만들어 놓은 석물은 양식과 수법이 대체로 소박하다. 비석은 처음에 세운 것으로 보이지만 고려 공양왕 고릉이라는 글씨가 있는 무덤을 표시하는 돌은 조선 고종 때에 세운 것으로 알려지고 있다.",
      "zh-CN": "고려 공양왕릉은 고려의 마지막 왕인 공양왕과 그의 부인 순비 노 씨의 무덤이다. 공양왕은 이성계 등에 의해서 즉위한 이름뿐인 왕이었다. 조선 건국 직후 원주로 추방되었다가 1394년에 삼척부에서 두 아들과 함께 살해되었다. 1416년에 공양왕으로 봉하고 고양현에 무덤을 마련하였다. 왕과 함께 묻힌 왕비는 노신의 딸로 숙녕, 정신, 경화 세 공주와 창성군을 낳았으나 고려가 멸망한 후 왕과 함께 폐위되었다. 무덤은 쌍릉 형식으로 무덤 앞에는 비석과 상석이 하나씩 놓여 있고, 두 무덤 사이에 석등과 돌로 만든 호랑이 상이 있다. 이 호랑이 상은 고려의 전통적인 양식을 보여주고 있으나, 조선 초기의 왕릉인 태조와 태종 무덤의 것과 양식이 비슷하다. 무덤의 양쪽에는 문신과 무신상을 세웠다. 무덤 앞에 만들어 놓은 석물은 양식과 수법이 대체로 소박하다. 비석은 처음에 세운 것으로 보이지만 고려 공양왕 고릉이라는 글씨가 있는 무덤을 표시하는 돌은 조선 고종 때에 세운 것으로 알려지고 있다.",
      "zh-TW": "고려 공양왕릉은 고려의 마지막 왕인 공양왕과 그의 부인 순비 노 씨의 무덤이다. 공양왕은 이성계 등에 의해서 즉위한 이름뿐인 왕이었다. 조선 건국 직후 원주로 추방되었다가 1394년에 삼척부에서 두 아들과 함께 살해되었다. 1416년에 공양왕으로 봉하고 고양현에 무덤을 마련하였다. 왕과 함께 묻힌 왕비는 노신의 딸로 숙녕, 정신, 경화 세 공주와 창성군을 낳았으나 고려가 멸망한 후 왕과 함께 폐위되었다. 무덤은 쌍릉 형식으로 무덤 앞에는 비석과 상석이 하나씩 놓여 있고, 두 무덤 사이에 석등과 돌로 만든 호랑이 상이 있다. 이 호랑이 상은 고려의 전통적인 양식을 보여주고 있으나, 조선 초기의 왕릉인 태조와 태종 무덤의 것과 양식이 비슷하다. 무덤의 양쪽에는 문신과 무신상을 세웠다. 무덤 앞에 만들어 놓은 석물은 양식과 수법이 대체로 소박하다. 비석은 처음에 세운 것으로 보이지만 고려 공양왕 고릉이라는 글씨가 있는 무덤을 표시하는 돌은 조선 고종 때에 세운 것으로 알려지고 있다.",
    },
    meta: { updated_at: "2026-09-02" },
    // 오더 #C8 [1]: TourAPI overview_ko 원문 이식 · 마침표 뒤 \n\n 문단 분리만. 창작·의역 0.
    sections: [
      {
        heading: { ko: "소개", en: "About", ja: "紹介", "zh-CN": "介绍", "zh-TW": "介紹" },
        body: {
          ko: "고려 공양왕릉은 고려의 마지막 왕인 공양왕과 그의 부인 순비 노 씨의 무덤이다.\n\n공양왕은 이성계 등에 의해서 즉위한 이름뿐인 왕이었다.\n\n조선 건국 직후 원주로 추방되었다가 1394년에 삼척부에서 두 아들과 함께 살해되었다.\n\n1416년에 공양왕으로 봉하고 고양현에 무덤을 마련하였다.\n\n왕과 함께 묻힌 왕비는 노신의 딸로 숙녕, 정신, 경화 세 공주와 창성군을 낳았으나 고려가 멸망한 후 왕과 함께 폐위되었다.\n\n무덤은 쌍릉 형식으로 무덤 앞에는 비석과 상석이 하나씩 놓여 있고, 두 무덤 사이에 석등과 돌로 만든 호랑이 상이 있다.\n\n이 호랑이 상은 고려의 전통적인 양식을 보여주고 있으나, 조선 초기의 왕릉인 태조와 태종 무덤의 것과 양식이 비슷하다.\n\n무덤의 양쪽에는 문신과 무신상을 세웠다.\n\n무덤 앞에 만들어 놓은 석물은 양식과 수법이 대체로 소박하다.\n\n비석은 처음에 세운 것으로 보이지만 고려 공양왕 고릉이라는 글씨가 있는 무덤을 표시하는 돌은 조선 고종 때에 세운 것으로 알려지고 있다.",
          en: "The Tomb of King Gongyang of Goryeo holds Gongyang — Goryeo's last king — and his consort, Sunbi Lady No.\n\nKing Gongyang was a king in name only, enthroned by Yi Seong-gye and others.\n\nSoon after the founding of Joseon he was banished to Wonju, and in 1394 he was killed at Samcheokbu together with his two sons.\n\nIn 1416 he was invested with the posthumous title \"King Gongyang\" and his tomb was set up in Goyang-hyeon.\n\nThe queen buried with him was a daughter of the minister No; she bore three princesses — Sungnyeong, Jeongsin, and Gyeonghwa — and Prince Changseong, but was deposed alongside the king after the fall of Goryeo.\n\nThe tomb is a paired-mound (ssangneung) type: in front of the mounds sit one stele and one offering table, and between the two mounds stand a stone lantern and a stone tiger figure.\n\nThe tiger figure follows the traditional Goryeo idiom yet is stylistically similar to the tiger figures at the early-Joseon tombs of King Taejo and King Taejong.\n\nOn either flank of the mounds stand civil-official and military-official figures.\n\nThe stone works before the tombs are generally simple in style and execution.\n\nThe stele appears to be original, but the marker stone bearing the inscription \"Goryeo Gongyangwang Goreung\" (Old Tomb of King Gongyang of Goryeo) is believed to have been erected in the reign of King Gojong of Joseon.",
          ja: "高麗恭譲王陵は、高麗最後の王・恭譲王とその妃である順妃盧氏の墓です。\n\n恭譲王は、李成桂（イ・ソンゲ）らによって擁立された名ばかりの王でした。\n\n朝鮮建国直後に原州へ追放され、1394年に三陟府で二人の息子とともに殺害されました。\n\n1416年に「恭譲王」として封じられ、高陽県に墓が設けられました。\n\n王とともに葬られた王妃は盧臣の娘で、淑寧・貞信・敬和の三公主と昌城君を生みましたが、高麗滅亡後に王とともに廃位されました。\n\n墓は双陵形式で、墓前には石碑と床石が一つずつ置かれ、二つの墓の間には石灯と石造の虎像があります。\n\nこの虎像は高麗の伝統的な様式を示していますが、朝鮮初期の王陵である太祖・太宗の墓のものと様式が似ています。\n\n墓の両側には文臣像と武臣像が立てられています。\n\n墓前の石物は、様式・技法ともにおおむね素朴です。\n\n石碑は当初建立されたものと見られますが、「高麗恭譲王古陵」の銘が刻まれた墓標石は朝鮮・高宗の時に建立されたと知られています。",
          "zh-CN": "高丽恭让王陵是高丽末代国王恭让王与其王妃顺妃卢氏之墓。\n\n恭让王为李成桂等人所拥立，仅是名义上的国王。\n\n朝鲜建国后不久便被流放至原州，1394年在三陟府与两位王子一同遭杀害。\n\n1416年被追封为「恭让王」，并在高阳县设墓。\n\n与王同葬的王妃为卢臣之女，育有淑宁、贞信、敬和三位公主及昌城君，然高丽灭亡后与王一同被废。\n\n墓采双陵形式，墓前各置石碑与床石一件，两墓之间设石灯与石虎像。\n\n此虎像呈现高丽传统样式，但与朝鲜初期王陵（太祖、太宗陵）之虎像样式相近。\n\n墓两侧立有文臣像与武臣像。\n\n墓前之石物，样式与手法大体朴素。\n\n石碑虽疑为初建之物，然刻有「高丽恭让王古陵」字样、用以标识墓所之石碑，据传为朝鲜高宗时期所立。",
          "zh-TW": "高麗恭讓王陵是高麗末代國王恭讓王與其王妃順妃盧氏之墓。\n\n恭讓王為李成桂等人所擁立，僅是名義上的國王。\n\n朝鮮建國後不久便被流放至原州，1394年在三陟府與兩位王子一同遭殺害。\n\n1416年被追封為「恭讓王」，並在高陽縣設墓。\n\n與王同葬的王妃為盧臣之女，育有淑寧、貞信、敬和三位公主及昌城君，然高麗滅亡後與王一同被廢。\n\n墓採雙陵形式，墓前各置石碑與床石一件，兩墓之間設石燈與石虎像。\n\n此虎像呈現高麗傳統樣式，但與朝鮮初期王陵（太祖、太宗陵）之虎像樣式相近。\n\n墓兩側立有文臣像與武臣像。\n\n墓前之石物，樣式與手法大體樸素。\n\n石碑雖疑為初建之物，然刻有「高麗恭讓王古陵」字樣、用以標識墓所之石碑，據傳為朝鮮高宗時期所立。",
        },
      },
    ],
    access: [],
    know: [],
    ko_card: [{ name_ko: "고양 공양왕릉", address_ko: "경기도 고양시 덕양구 원당동 산 65-6" }],
    map: [{ lat: 37.68, lng: 126.839, label: "고양 공양왕릉" }],
    credits: [],
    related: [],
    info: { hours: "varies", duration: "1_2h", admission: "varies", access: "inquiry" },
    highlights: [
      { ko: "고려 마지막 왕의 능", en: "King Gongyang's Tomb (Goyang)", ja: "高陽 恭譲王陵", "zh-CN": "高阳 恭让王陵", "zh-TW": "高陽 恭讓王陵" },
      { ko: "사적 지정", en: "King Gongyang's Tomb (Goyang)", ja: "高陽 恭譲王陵", "zh-CN": "高阳 恭让王陵", "zh-TW": "高陽 恭讓王陵" },
      { ko: "조용한 참배지", en: "King Gongyang's Tomb (Goyang)", ja: "高陽 恭譲王陵", "zh-CN": "高阳 恭让王陵", "zh-TW": "高陽 恭讓王陵" },
    ],
    adSlot: null,
    // 오더 #C8 [1]: TourAPI Type1 상위 3장 (contentid 128139). 출처 한국관광공사 공공누리 제1유형.
    gallery: [
      { url: "/images/spots/gongyang-royal-tomb-1.jpg", credit: "출처: 한국관광공사 (공공누리 제1유형)", cpyrht: "Type1" },
      { url: "/images/spots/gongyang-royal-tomb-2.jpg", credit: "출처: 한국관광공사 (공공누리 제1유형)", cpyrht: "Type1" },
      { url: "/images/spots/gongyang-royal-tomb-3.jpg", credit: "출처: 한국관광공사 (공공누리 제1유형)", cpyrht: "Type1" },
    ],
    official_url: "http://www.goyang.go.kr/visitgoyang",
    best_selected: false,
    tourapi: { contentid: "128139", overview_ko: "고려 공양왕릉은 고려의 마지막 왕인 공양왕과 그의 부인 순비 노 씨의 무덤이다. 공양왕은 이성계 등에 의해서 즉위한 이름뿐인 왕이었다. 조선 건국 직후 원주로 추방되었다가 1394년에 삼척부에서 두 아들과 함께 살해되었다. 1416년에 공양왕으로 봉하고 고양현에 무덤을 마련하였다. 왕과 함께 묻힌 왕비는 노신의 딸로 숙녕, 정신, 경화 세 공주와 창성군을 낳았으나 고려가 멸망한 후 왕과 함께 폐위되었다. 무덤은 쌍릉 형식으로 무덤 앞에는 비석과 상석이 하나씩 놓여 있고, 두 무덤 사이에 석등과 돌로 만든 호랑이 상이 있다. 이 호랑이 상은 고려의 전통적인 양식을 보여주고 있으나, 조선 초기의 왕릉인 태조와 태종 무덤의 것과 양식이 비슷하다. 무덤의 양쪽에는 문신과 무신상을 세웠다. 무덤 앞에 만들어 놓은 석물은 양식과 수법이 대체로 소박하다. 비석은 처음에 세운 것으로 보이지만 고려 공양왕 고릉이라는 글씨가 있는 무덤을 표시하는 돌은 조선 고종 때에 세운 것으로 알려지고 있다.", homepage: "http://www.goyang.go.kr/visitgoyang" },
  },

  {
    slug: "aquaplanet-ilsan",
    category: "family",
    type: "list",
    region: "일산서구",
    title: { ko: "아쿠아플라넷 일산", en: "Aqua Planet Ilsan", ja: "アクアプラネット一山", "zh-CN": "水族館 一山", "zh-TW": "水族館 一山" },
    title_en_display: "AQUA PLANET ILSAN",
    subtitle: {
      ko: "아쿠아플라넷 일산은 경기도 고양 한류월드 조성부지 인근에 자리한 수도권 최대 규모의 아쿠아리움으로 특히 국내에서는 처음으로 실내 동물원이 결합한 아쿠아리움이라는 점이 특징이다.",
      en: "아쿠아플라넷 일산은 경기도 고양 한류월드 조성부지 인근에 자리한 수도권 최대 규모의 아쿠아리움으로 특히 국내에서는 처음으로 실내 동물원이 결합한 아쿠아리움이라는 점이 특징이다.",
      ja: "아쿠아플라넷 일산은 경기도 고양 한류월드 조성부지 인근에 자리한 수도권 최대 규모의 아쿠아리움으로 특히 국내에서는 처음으로 실내 동물원이 결합한 아쿠아리움이라는 점이 특징이다.",
      "zh-CN": "아쿠아플라넷 일산은 경기도 고양 한류월드 조성부지 인근에 자리한 수도권 최대 규모의 아쿠아리움으로 특히 국내에서는 처음으로 실내 동물원이 결합한 아쿠아리움이라는 점이 특징이다.",
      "zh-TW": "아쿠아플라넷 일산은 경기도 고양 한류월드 조성부지 인근에 자리한 수도권 최대 규모의 아쿠아리움으로 특히 국내에서는 처음으로 실내 동물원이 결합한 아쿠아리움이라는 점이 특징이다.",
    },
    lead: {
      ko: "아쿠아플라넷 일산은 경기도 고양 한류월드 조성부지 인근에 자리한 수도권 최대 규모의 아쿠아리움으로 특히 국내에서는 처음으로 실내 동물원이 결합한 아쿠아리움이라는 점이 특징이다. 전 세계에서 온 해양 생물과 육지 생물이 입주하여 바다코끼리, 알락꼬리여우원숭이, 히야신스매커우 등의 다양한 생물들을 한자리에서 만나볼 수 있다. 특히 대형 수조 딥 블루오션에서의 신기한 마술 공연, 다양한 생태 설명회가 열리는 오션 아레나, 정글에 사는 동물 친구들을 만나는 나무 쉼터 등을 운영하여 재미와 교육을 동시에 느낄 수 있는 다양한 콘텐츠들을 접할 수 있다. 이 외에도 부대 업장 및 선물 가게를 운영 중이다.",
      en: "아쿠아플라넷 일산은 경기도 고양 한류월드 조성부지 인근에 자리한 수도권 최대 규모의 아쿠아리움으로 특히 국내에서는 처음으로 실내 동물원이 결합한 아쿠아리움이라는 점이 특징이다. 전 세계에서 온 해양 생물과 육지 생물이 입주하여 바다코끼리, 알락꼬리여우원숭이, 히야신스매커우 등의 다양한 생물들을 한자리에서 만나볼 수 있다. 특히 대형 수조 딥 블루오션에서의 신기한 마술 공연, 다양한 생태 설명회가 열리는 오션 아레나, 정글에 사는 동물 친구들을 만나는 나무 쉼터 등을 운영하여 재미와 교육을 동시에 느낄 수 있는 다양한 콘텐츠들을 접할 수 있다. 이 외에도 부대 업장 및 선물 가게를 운영 중이다.",
      ja: "아쿠아플라넷 일산은 경기도 고양 한류월드 조성부지 인근에 자리한 수도권 최대 규모의 아쿠아리움으로 특히 국내에서는 처음으로 실내 동물원이 결합한 아쿠아리움이라는 점이 특징이다. 전 세계에서 온 해양 생물과 육지 생물이 입주하여 바다코끼리, 알락꼬리여우원숭이, 히야신스매커우 등의 다양한 생물들을 한자리에서 만나볼 수 있다. 특히 대형 수조 딥 블루오션에서의 신기한 마술 공연, 다양한 생태 설명회가 열리는 오션 아레나, 정글에 사는 동물 친구들을 만나는 나무 쉼터 등을 운영하여 재미와 교육을 동시에 느낄 수 있는 다양한 콘텐츠들을 접할 수 있다. 이 외에도 부대 업장 및 선물 가게를 운영 중이다.",
      "zh-CN": "아쿠아플라넷 일산은 경기도 고양 한류월드 조성부지 인근에 자리한 수도권 최대 규모의 아쿠아리움으로 특히 국내에서는 처음으로 실내 동물원이 결합한 아쿠아리움이라는 점이 특징이다. 전 세계에서 온 해양 생물과 육지 생물이 입주하여 바다코끼리, 알락꼬리여우원숭이, 히야신스매커우 등의 다양한 생물들을 한자리에서 만나볼 수 있다. 특히 대형 수조 딥 블루오션에서의 신기한 마술 공연, 다양한 생태 설명회가 열리는 오션 아레나, 정글에 사는 동물 친구들을 만나는 나무 쉼터 등을 운영하여 재미와 교육을 동시에 느낄 수 있는 다양한 콘텐츠들을 접할 수 있다. 이 외에도 부대 업장 및 선물 가게를 운영 중이다.",
      "zh-TW": "아쿠아플라넷 일산은 경기도 고양 한류월드 조성부지 인근에 자리한 수도권 최대 규모의 아쿠아리움으로 특히 국내에서는 처음으로 실내 동물원이 결합한 아쿠아리움이라는 점이 특징이다. 전 세계에서 온 해양 생물과 육지 생물이 입주하여 바다코끼리, 알락꼬리여우원숭이, 히야신스매커우 등의 다양한 생물들을 한자리에서 만나볼 수 있다. 특히 대형 수조 딥 블루오션에서의 신기한 마술 공연, 다양한 생태 설명회가 열리는 오션 아레나, 정글에 사는 동물 친구들을 만나는 나무 쉼터 등을 운영하여 재미와 교육을 동시에 느낄 수 있는 다양한 콘텐츠들을 접할 수 있다. 이 외에도 부대 업장 및 선물 가게를 운영 중이다.",
    },
    meta: { updated_at: "2026-09-02" },
    // 오더 #C8 [1]: TourAPI overview_ko 원문 이식 · 마침표 뒤 \n\n 문단 분리만. 창작·의역 0.
    sections: [
      {
        heading: { ko: "소개", en: "About", ja: "紹介", "zh-CN": "介绍", "zh-TW": "介紹" },
        body: {
          ko: "아쿠아플라넷 일산은 경기도 고양 한류월드 조성부지 인근에 자리한 수도권 최대 규모의 아쿠아리움으로 특히 국내에서는 처음으로 실내 동물원이 결합한 아쿠아리움이라는 점이 특징이다.\n\n전 세계에서 온 해양 생물과 육지 생물이 입주하여 바다코끼리, 알락꼬리여우원숭이, 히야신스매커우 등의 다양한 생물들을 한자리에서 만나볼 수 있다.\n\n특히 대형 수조 딥 블루오션에서의 신기한 마술 공연, 다양한 생태 설명회가 열리는 오션 아레나, 정글에 사는 동물 친구들을 만나는 나무 쉼터 등을 운영하여 재미와 교육을 동시에 느낄 수 있는 다양한 콘텐츠들을 접할 수 있다.\n\n이 외에도 부대 업장 및 선물 가게를 운영 중이다.",
          en: "아쿠아플라넷 일산은 경기도 고양 한류월드 조성부지 인근에 자리한 수도권 최대 규모의 아쿠아리움으로 특히 국내에서는 처음으로 실내 동물원이 결합한 아쿠아리움이라는 점이 특징이다.\n\n전 세계에서 온 해양 생물과 육지 생물이 입주하여 바다코끼리, 알락꼬리여우원숭이, 히야신스매커우 등의 다양한 생물들을 한자리에서 만나볼 수 있다.\n\n특히 대형 수조 딥 블루오션에서의 신기한 마술 공연, 다양한 생태 설명회가 열리는 오션 아레나, 정글에 사는 동물 친구들을 만나는 나무 쉼터 등을 운영하여 재미와 교육을 동시에 느낄 수 있는 다양한 콘텐츠들을 접할 수 있다.\n\n이 외에도 부대 업장 및 선물 가게를 운영 중이다.",
          ja: "아쿠아플라넷 일산은 경기도 고양 한류월드 조성부지 인근에 자리한 수도권 최대 규모의 아쿠아리움으로 특히 국내에서는 처음으로 실내 동물원이 결합한 아쿠아리움이라는 점이 특징이다.\n\n전 세계에서 온 해양 생물과 육지 생물이 입주하여 바다코끼리, 알락꼬리여우원숭이, 히야신스매커우 등의 다양한 생물들을 한자리에서 만나볼 수 있다.\n\n특히 대형 수조 딥 블루오션에서의 신기한 마술 공연, 다양한 생태 설명회가 열리는 오션 아레나, 정글에 사는 동물 친구들을 만나는 나무 쉼터 등을 운영하여 재미와 교육을 동시에 느낄 수 있는 다양한 콘텐츠들을 접할 수 있다.\n\n이 외에도 부대 업장 및 선물 가게를 운영 중이다.",
          "zh-CN": "아쿠아플라넷 일산은 경기도 고양 한류월드 조성부지 인근에 자리한 수도권 최대 규모의 아쿠아리움으로 특히 국내에서는 처음으로 실내 동물원이 결합한 아쿠아리움이라는 점이 특징이다.\n\n전 세계에서 온 해양 생물과 육지 생물이 입주하여 바다코끼리, 알락꼬리여우원숭이, 히야신스매커우 등의 다양한 생물들을 한자리에서 만나볼 수 있다.\n\n특히 대형 수조 딥 블루오션에서의 신기한 마술 공연, 다양한 생태 설명회가 열리는 오션 아레나, 정글에 사는 동물 친구들을 만나는 나무 쉼터 등을 운영하여 재미와 교육을 동시에 느낄 수 있는 다양한 콘텐츠들을 접할 수 있다.\n\n이 외에도 부대 업장 및 선물 가게를 운영 중이다.",
          "zh-TW": "아쿠아플라넷 일산은 경기도 고양 한류월드 조성부지 인근에 자리한 수도권 최대 규모의 아쿠아리움으로 특히 국내에서는 처음으로 실내 동물원이 결합한 아쿠아리움이라는 점이 특징이다.\n\n전 세계에서 온 해양 생물과 육지 생물이 입주하여 바다코끼리, 알락꼬리여우원숭이, 히야신스매커우 등의 다양한 생물들을 한자리에서 만나볼 수 있다.\n\n특히 대형 수조 딥 블루오션에서의 신기한 마술 공연, 다양한 생태 설명회가 열리는 오션 아레나, 정글에 사는 동물 친구들을 만나는 나무 쉼터 등을 운영하여 재미와 교육을 동시에 느낄 수 있는 다양한 콘텐츠들을 접할 수 있다.\n\n이 외에도 부대 업장 및 선물 가게를 운영 중이다.",
        },
      },
    ],
    access: [],
    know: [],
    ko_card: [{ name_ko: "아쿠아플라넷 일산", address_ko: "경기도 고양시 일산서구 한류월드로 282" }],
    map: [{ lat: 37.6638195002, lng: 126.7555775071, label: "아쿠아플라넷 일산" }],
    credits: [],
    related: [],
    info: { hours: "varies", duration: "1_2h", admission: "varies", access: "inquiry" },
    highlights: [
      { ko: "한류월드 안 실내 수족관", en: "Aqua Planet Ilsan", ja: "アクアプラネット一山", "zh-CN": "水族館 一山", "zh-TW": "水族館 一山" },
      { ko: "가족 단위 방문 적합", en: "Aqua Planet Ilsan", ja: "アクアプラネット一山", "zh-CN": "水族館 一山", "zh-TW": "水族館 一山" },
      { ko: "실내 관람으로 날씨 무관", en: "Aqua Planet Ilsan", ja: "アクアプラネット一山", "zh-CN": "水族館 一山", "zh-TW": "水族館 一山" },
    ],
    adSlot: null,
    official_url: "https://www.aquaplanet.co.kr/ilsan/index.do",
    best_selected: false,
    tourapi: { contentid: "1917066", overview_ko: "아쿠아플라넷 일산은 경기도 고양 한류월드 조성부지 인근에 자리한 수도권 최대 규모의 아쿠아리움으로 특히 국내에서는 처음으로 실내 동물원이 결합한 아쿠아리움이라는 점이 특징이다. 전 세계에서 온 해양 생물과 육지 생물이 입주하여 바다코끼리, 알락꼬리여우원숭이, 히야신스매커우 등의 다양한 생물들을 한자리에서 만나볼 수 있다. 특히 대형 수조 딥 블루오션에서의 신기한 마술 공연, 다양한 생태 설명회가 열리는 오션 아레나, 정글에 사는 동물 친구들을 만나는 나무 쉼터 등을 운영하여 재미와 교육을 동시에 느낄 수 있는 다양한 콘텐츠들을 접할 수 있다. 이 외에도 부대 업장 및 선물 가게를 운영 중이다.", homepage: "https://www.aquaplanet.co.kr/ilsan/index.do" },
  },

  {
    slug: "ilsan-childrens-observatory",
    category: "family",
    type: "list",
    region: "일산동구",
    title: { ko: "일산 어린이천문대", en: "Ilsan Children's Observatory", ja: "一山こども天文台", "zh-CN": "一山儿童天文台", "zh-TW": "一山兒童天文台" },
    title_en_display: "ILSAN CHILDREN'S OBSERVATORY",
    subtitle: {
      ko: "어린이천문대는 전문천체관측 시설과 장비, 천문연구활동을 중심으로 아이들에게 우주과학에 대한 흥미와 관심을 고취시키고 별과 우주에 대한 꿈과 희망을 갖도록 하기 위해 세워졌다.",
      en: "어린이천문대는 전문천체관측 시설과 장비, 천문연구활동을 중심으로 아이들에게 우주과학에 대한 흥미와 관심을 고취시키고 별과 우주에 대한 꿈과 희망을 갖도록 하기 위해 세워졌다.",
      ja: "어린이천문대는 전문천체관측 시설과 장비, 천문연구활동을 중심으로 아이들에게 우주과학에 대한 흥미와 관심을 고취시키고 별과 우주에 대한 꿈과 희망을 갖도록 하기 위해 세워졌다.",
      "zh-CN": "어린이천문대는 전문천체관측 시설과 장비, 천문연구활동을 중심으로 아이들에게 우주과학에 대한 흥미와 관심을 고취시키고 별과 우주에 대한 꿈과 희망을 갖도록 하기 위해 세워졌다.",
      "zh-TW": "어린이천문대는 전문천체관측 시설과 장비, 천문연구활동을 중심으로 아이들에게 우주과학에 대한 흥미와 관심을 고취시키고 별과 우주에 대한 꿈과 희망을 갖도록 하기 위해 세워졌다.",
    },
    lead: {
      ko: "어린이천문대는 전문천체관측 시설과 장비, 천문연구활동을 중심으로 아이들에게 우주과학에 대한 흥미와 관심을 고취시키고 별과 우주에 대한 꿈과 희망을 갖도록 하기 위해 세워졌다. 이를 위해서 어린이천문대는 매달 다른 주제로 이론과 만들기, 천체관측등으로 이루어진 정규프로그램과 일일체험, 가족프로그램등 다양한 교육프로그램을 운영하고 있다. 체험적이고 심층적인 다양한 교육프로그램을 개발하여 어린이들에게 보다 다양하고 심도 있는 천문 자연과학 교육서비스를 제공하고자 한다.\n2003년 일산어린이천문대를 시작으로 경기/인천 지역에 19개 지점, 충청도에 3개 지점, 경상도에 2개 지점, 전라도와 강원특별자치도에 각각 1개 지점이 있어 어디서든 어린이 천문대를 만날 수 있다.",
      en: "어린이천문대는 전문천체관측 시설과 장비, 천문연구활동을 중심으로 아이들에게 우주과학에 대한 흥미와 관심을 고취시키고 별과 우주에 대한 꿈과 희망을 갖도록 하기 위해 세워졌다. 이를 위해서 어린이천문대는 매달 다른 주제로 이론과 만들기, 천체관측등으로 이루어진 정규프로그램과 일일체험, 가족프로그램등 다양한 교육프로그램을 운영하고 있다. 체험적이고 심층적인 다양한 교육프로그램을 개발하여 어린이들에게 보다 다양하고 심도 있는 천문 자연과학 교육서비스를 제공하고자 한다.\n2003년 일산어린이천문대를 시작으로 경기/인천 지역에 19개 지점, 충청도에 3개 지점, 경상도에 2개 지점, 전라도와 강원특별자치도에 각각 1개 지점이 있어 어디서든 어린이 천문대를 만날 수 있다.",
      ja: "어린이천문대는 전문천체관측 시설과 장비, 천문연구활동을 중심으로 아이들에게 우주과학에 대한 흥미와 관심을 고취시키고 별과 우주에 대한 꿈과 희망을 갖도록 하기 위해 세워졌다. 이를 위해서 어린이천문대는 매달 다른 주제로 이론과 만들기, 천체관측등으로 이루어진 정규프로그램과 일일체험, 가족프로그램등 다양한 교육프로그램을 운영하고 있다. 체험적이고 심층적인 다양한 교육프로그램을 개발하여 어린이들에게 보다 다양하고 심도 있는 천문 자연과학 교육서비스를 제공하고자 한다.\n2003년 일산어린이천문대를 시작으로 경기/인천 지역에 19개 지점, 충청도에 3개 지점, 경상도에 2개 지점, 전라도와 강원특별자치도에 각각 1개 지점이 있어 어디서든 어린이 천문대를 만날 수 있다.",
      "zh-CN": "어린이천문대는 전문천체관측 시설과 장비, 천문연구활동을 중심으로 아이들에게 우주과학에 대한 흥미와 관심을 고취시키고 별과 우주에 대한 꿈과 희망을 갖도록 하기 위해 세워졌다. 이를 위해서 어린이천문대는 매달 다른 주제로 이론과 만들기, 천체관측등으로 이루어진 정규프로그램과 일일체험, 가족프로그램등 다양한 교육프로그램을 운영하고 있다. 체험적이고 심층적인 다양한 교육프로그램을 개발하여 어린이들에게 보다 다양하고 심도 있는 천문 자연과학 교육서비스를 제공하고자 한다.\n2003년 일산어린이천문대를 시작으로 경기/인천 지역에 19개 지점, 충청도에 3개 지점, 경상도에 2개 지점, 전라도와 강원특별자치도에 각각 1개 지점이 있어 어디서든 어린이 천문대를 만날 수 있다.",
      "zh-TW": "어린이천문대는 전문천체관측 시설과 장비, 천문연구활동을 중심으로 아이들에게 우주과학에 대한 흥미와 관심을 고취시키고 별과 우주에 대한 꿈과 희망을 갖도록 하기 위해 세워졌다. 이를 위해서 어린이천문대는 매달 다른 주제로 이론과 만들기, 천체관측등으로 이루어진 정규프로그램과 일일체험, 가족프로그램등 다양한 교육프로그램을 운영하고 있다. 체험적이고 심층적인 다양한 교육프로그램을 개발하여 어린이들에게 보다 다양하고 심도 있는 천문 자연과학 교육서비스를 제공하고자 한다.\n2003년 일산어린이천문대를 시작으로 경기/인천 지역에 19개 지점, 충청도에 3개 지점, 경상도에 2개 지점, 전라도와 강원특별자치도에 각각 1개 지점이 있어 어디서든 어린이 천문대를 만날 수 있다.",
    },
    meta: { updated_at: "2026-09-02" },
    // 오더 #C8 [1]: TourAPI overview_ko 원문 이식 · 마침표 뒤 \n\n 문단 분리만. 창작·의역 0.
    sections: [
      {
        heading: { ko: "소개", en: "About", ja: "紹介", "zh-CN": "介绍", "zh-TW": "介紹" },
        body: {
          ko: "어린이천문대는 전문천체관측 시설과 장비, 천문연구활동을 중심으로 아이들에게 우주과학에 대한 흥미와 관심을 고취시키고 별과 우주에 대한 꿈과 희망을 갖도록 하기 위해 세워졌다.\n\n이를 위해서 어린이천문대는 매달 다른 주제로 이론과 만들기, 천체관측등으로 이루어진 정규프로그램과 일일체험, 가족프로그램등 다양한 교육프로그램을 운영하고 있다.\n\n체험적이고 심층적인 다양한 교육프로그램을 개발하여 어린이들에게 보다 다양하고 심도 있는 천문 자연과학 교육서비스를 제공하고자 한다.\n\n2003년 일산어린이천문대를 시작으로 경기/인천 지역에 19개 지점, 충청도에 3개 지점, 경상도에 2개 지점, 전라도와 강원특별자치도에 각각 1개 지점이 있어 어디서든 어린이 천문대를 만날 수 있다.",
          en: "어린이천문대는 전문천체관측 시설과 장비, 천문연구활동을 중심으로 아이들에게 우주과학에 대한 흥미와 관심을 고취시키고 별과 우주에 대한 꿈과 희망을 갖도록 하기 위해 세워졌다.\n\n이를 위해서 어린이천문대는 매달 다른 주제로 이론과 만들기, 천체관측등으로 이루어진 정규프로그램과 일일체험, 가족프로그램등 다양한 교육프로그램을 운영하고 있다.\n\n체험적이고 심층적인 다양한 교육프로그램을 개발하여 어린이들에게 보다 다양하고 심도 있는 천문 자연과학 교육서비스를 제공하고자 한다.\n\n2003년 일산어린이천문대를 시작으로 경기/인천 지역에 19개 지점, 충청도에 3개 지점, 경상도에 2개 지점, 전라도와 강원특별자치도에 각각 1개 지점이 있어 어디서든 어린이 천문대를 만날 수 있다.",
          ja: "어린이천문대는 전문천체관측 시설과 장비, 천문연구활동을 중심으로 아이들에게 우주과학에 대한 흥미와 관심을 고취시키고 별과 우주에 대한 꿈과 희망을 갖도록 하기 위해 세워졌다.\n\n이를 위해서 어린이천문대는 매달 다른 주제로 이론과 만들기, 천체관측등으로 이루어진 정규프로그램과 일일체험, 가족프로그램등 다양한 교육프로그램을 운영하고 있다.\n\n체험적이고 심층적인 다양한 교육프로그램을 개발하여 어린이들에게 보다 다양하고 심도 있는 천문 자연과학 교육서비스를 제공하고자 한다.\n\n2003년 일산어린이천문대를 시작으로 경기/인천 지역에 19개 지점, 충청도에 3개 지점, 경상도에 2개 지점, 전라도와 강원특별자치도에 각각 1개 지점이 있어 어디서든 어린이 천문대를 만날 수 있다.",
          "zh-CN": "어린이천문대는 전문천체관측 시설과 장비, 천문연구활동을 중심으로 아이들에게 우주과학에 대한 흥미와 관심을 고취시키고 별과 우주에 대한 꿈과 희망을 갖도록 하기 위해 세워졌다.\n\n이를 위해서 어린이천문대는 매달 다른 주제로 이론과 만들기, 천체관측등으로 이루어진 정규프로그램과 일일체험, 가족프로그램등 다양한 교육프로그램을 운영하고 있다.\n\n체험적이고 심층적인 다양한 교육프로그램을 개발하여 어린이들에게 보다 다양하고 심도 있는 천문 자연과학 교육서비스를 제공하고자 한다.\n\n2003년 일산어린이천문대를 시작으로 경기/인천 지역에 19개 지점, 충청도에 3개 지점, 경상도에 2개 지점, 전라도와 강원특별자치도에 각각 1개 지점이 있어 어디서든 어린이 천문대를 만날 수 있다.",
          "zh-TW": "어린이천문대는 전문천체관측 시설과 장비, 천문연구활동을 중심으로 아이들에게 우주과학에 대한 흥미와 관심을 고취시키고 별과 우주에 대한 꿈과 희망을 갖도록 하기 위해 세워졌다.\n\n이를 위해서 어린이천문대는 매달 다른 주제로 이론과 만들기, 천체관측등으로 이루어진 정규프로그램과 일일체험, 가족프로그램등 다양한 교육프로그램을 운영하고 있다.\n\n체험적이고 심층적인 다양한 교육프로그램을 개발하여 어린이들에게 보다 다양하고 심도 있는 천문 자연과학 교육서비스를 제공하고자 한다.\n\n2003년 일산어린이천문대를 시작으로 경기/인천 지역에 19개 지점, 충청도에 3개 지점, 경상도에 2개 지점, 전라도와 강원특별자치도에 각각 1개 지점이 있어 어디서든 어린이 천문대를 만날 수 있다.",
        },
      },
    ],
    access: [],
    know: [],
    ko_card: [{ name_ko: "일산 어린이천문대", address_ko: "경기도 고양시 일산동구 중산로 306-176 (성석동)" }],
    map: [{ lat: 37.7004047622, lng: 126.7911037826, label: "일산 어린이천문대" }],
    credits: [],
    related: [],
    info: { hours: "varies", duration: "1_2h", admission: "varies", access: "inquiry" },
    highlights: [
      { ko: "천체 관측 체험 시설", en: "Ilsan Children's Observatory", ja: "一山こども天文台", "zh-CN": "一山儿童天文台", "zh-TW": "一山兒童天文台" },
      { ko: "가족 단위 프로그램", en: "Ilsan Children's Observatory", ja: "一山こども天文台", "zh-CN": "一山儿童天文台", "zh-TW": "一山兒童天文台" },
      { ko: "실내·실외 관측", en: "Ilsan Children's Observatory", ja: "一山こども天文台", "zh-CN": "一山儿童天文台", "zh-TW": "一山兒童天文台" },
    ],
    adSlot: null,
    // 오더 #C8 [1]: TourAPI Type1 상위 3장 (contentid 128989). 출처 한국관광공사 공공누리 제1유형.
    gallery: [
      { url: "/images/spots/ilsan-childrens-observatory-1.jpg", credit: "출처: 한국관광공사 (공공누리 제1유형)", cpyrht: "Type1" },
      { url: "/images/spots/ilsan-childrens-observatory-2.jpg", credit: "출처: 한국관광공사 (공공누리 제1유형)", cpyrht: "Type1" },
      { url: "/images/spots/ilsan-childrens-observatory-3.jpg", credit: "출처: 한국관광공사 (공공누리 제1유형)", cpyrht: "Type1" },
    ],
    official_url: "https://www.astrocamp.net",
    best_selected: false,
    tourapi: { contentid: "128989", overview_ko: "어린이천문대는 전문천체관측 시설과 장비, 천문연구활동을 중심으로 아이들에게 우주과학에 대한 흥미와 관심을 고취시키고 별과 우주에 대한 꿈과 희망을 갖도록 하기 위해 세워졌다. 이를 위해서 어린이천문대는 매달 다른 주제로 이론과 만들기, 천체관측등으로 이루어진 정규프로그램과 일일체험, 가족프로그램등 다양한 교육프로그램을 운영하고 있다. 체험적이고 심층적인 다양한 교육프로그램을 개발하여 어린이들에게 보다 다양하고 심도 있는 천문 자연과학 교육서비스를 제공하고자 한다.\n2003년 일산어린이천문대를 시작으로 경기/인천 지역에 19개 지점, 충청도에 3개 지점, 경상도에 2개 지점, 전라도와 강원특별자치도에 각각 1개 지점이 있어 어디서든 어린이 천문대를 만날 수 있다.", homepage: "https://www.astrocamp.net" },
  },

  {
    slug: "wondang-ranch-lets-run-farm",
    category: "walk",
    type: "list",
    region: "덕양구",
    title: { ko: "원당종마목장 (렛츠런팜 원당)", en: "Wondang Horse Ranch (Let's Run Farm Wondang)", ja: "元堂種馬牧場(レッツランファーム元堂)", "zh-CN": "元堂种马牧场（Let's Run Farm 元堂）", "zh-TW": "元堂種馬牧場（Let's Run Farm 元堂）" },
    title_en_display: "WONDANG HORSE RANCH (LET'S RUN FARM WONDANG)",
    subtitle: {
      ko: "서울 근교 고양시 서삼릉에 인접한 원당 종마목장은 한국마사회에서 설치하여 운영하는 곳이다.",
      en: "서울 근교 고양시 서삼릉에 인접한 원당 종마목장은 한국마사회에서 설치하여 운영하는 곳이다.",
      ja: "서울 근교 고양시 서삼릉에 인접한 원당 종마목장은 한국마사회에서 설치하여 운영하는 곳이다.",
      "zh-CN": "서울 근교 고양시 서삼릉에 인접한 원당 종마목장은 한국마사회에서 설치하여 운영하는 곳이다.",
      "zh-TW": "서울 근교 고양시 서삼릉에 인접한 원당 종마목장은 한국마사회에서 설치하여 운영하는 곳이다.",
    },
    lead: {
      ko: "서울 근교 고양시 서삼릉에 인접한 원당 종마목장은 한국마사회에서 설치하여 운영하는 곳이다. 1988년 서울 올림픽 게임이 있을 때는 크로스컨트리 종목의 경기장으로도 활용되었다. 목장의 목가적 풍경에 반한 시민들의 요청으로 1997년부터 일반인에게도 일부 시설이 개방되었고 그 이후 드라마 촬영지로 더욱 알려지게 되었다. 위험 시설이 많아 개방 지역을 제한하고 있으며 내부에는 특별한 볼거리보다는 말이 방목되어 있는 목가적인 풍경을 산책하면서 즐길 수 있다. 이곳은 승마를 배우거나 말먹이주기 체험 등을 진행하는 곳이 아닌 산책로와 그늘막, 잔디광장, 화장실 등을 개방하기 때문에 조용히 산책을 즐길 수 있는 곳이다. 주변에 높은 건물이 없어 탁 트인 초원과 높은 하늘을 마음껏 느낄 수 있고 인근에 있는 서삼릉과 함께 둘러봐도 좋다. 산책길 언덕 위쪽으로는 의자와 매점이 있어 쉬어갈 수 있는 곳이다.",
      en: "서울 근교 고양시 서삼릉에 인접한 원당 종마목장은 한국마사회에서 설치하여 운영하는 곳이다. 1988년 서울 올림픽 게임이 있을 때는 크로스컨트리 종목의 경기장으로도 활용되었다. 목장의 목가적 풍경에 반한 시민들의 요청으로 1997년부터 일반인에게도 일부 시설이 개방되었고 그 이후 드라마 촬영지로 더욱 알려지게 되었다. 위험 시설이 많아 개방 지역을 제한하고 있으며 내부에는 특별한 볼거리보다는 말이 방목되어 있는 목가적인 풍경을 산책하면서 즐길 수 있다. 이곳은 승마를 배우거나 말먹이주기 체험 등을 진행하는 곳이 아닌 산책로와 그늘막, 잔디광장, 화장실 등을 개방하기 때문에 조용히 산책을 즐길 수 있는 곳이다. 주변에 높은 건물이 없어 탁 트인 초원과 높은 하늘을 마음껏 느낄 수 있고 인근에 있는 서삼릉과 함께 둘러봐도 좋다. 산책길 언덕 위쪽으로는 의자와 매점이 있어 쉬어갈 수 있는 곳이다.",
      ja: "서울 근교 고양시 서삼릉에 인접한 원당 종마목장은 한국마사회에서 설치하여 운영하는 곳이다. 1988년 서울 올림픽 게임이 있을 때는 크로스컨트리 종목의 경기장으로도 활용되었다. 목장의 목가적 풍경에 반한 시민들의 요청으로 1997년부터 일반인에게도 일부 시설이 개방되었고 그 이후 드라마 촬영지로 더욱 알려지게 되었다. 위험 시설이 많아 개방 지역을 제한하고 있으며 내부에는 특별한 볼거리보다는 말이 방목되어 있는 목가적인 풍경을 산책하면서 즐길 수 있다. 이곳은 승마를 배우거나 말먹이주기 체험 등을 진행하는 곳이 아닌 산책로와 그늘막, 잔디광장, 화장실 등을 개방하기 때문에 조용히 산책을 즐길 수 있는 곳이다. 주변에 높은 건물이 없어 탁 트인 초원과 높은 하늘을 마음껏 느낄 수 있고 인근에 있는 서삼릉과 함께 둘러봐도 좋다. 산책길 언덕 위쪽으로는 의자와 매점이 있어 쉬어갈 수 있는 곳이다.",
      "zh-CN": "서울 근교 고양시 서삼릉에 인접한 원당 종마목장은 한국마사회에서 설치하여 운영하는 곳이다. 1988년 서울 올림픽 게임이 있을 때는 크로스컨트리 종목의 경기장으로도 활용되었다. 목장의 목가적 풍경에 반한 시민들의 요청으로 1997년부터 일반인에게도 일부 시설이 개방되었고 그 이후 드라마 촬영지로 더욱 알려지게 되었다. 위험 시설이 많아 개방 지역을 제한하고 있으며 내부에는 특별한 볼거리보다는 말이 방목되어 있는 목가적인 풍경을 산책하면서 즐길 수 있다. 이곳은 승마를 배우거나 말먹이주기 체험 등을 진행하는 곳이 아닌 산책로와 그늘막, 잔디광장, 화장실 등을 개방하기 때문에 조용히 산책을 즐길 수 있는 곳이다. 주변에 높은 건물이 없어 탁 트인 초원과 높은 하늘을 마음껏 느낄 수 있고 인근에 있는 서삼릉과 함께 둘러봐도 좋다. 산책길 언덕 위쪽으로는 의자와 매점이 있어 쉬어갈 수 있는 곳이다.",
      "zh-TW": "서울 근교 고양시 서삼릉에 인접한 원당 종마목장은 한국마사회에서 설치하여 운영하는 곳이다. 1988년 서울 올림픽 게임이 있을 때는 크로스컨트리 종목의 경기장으로도 활용되었다. 목장의 목가적 풍경에 반한 시민들의 요청으로 1997년부터 일반인에게도 일부 시설이 개방되었고 그 이후 드라마 촬영지로 더욱 알려지게 되었다. 위험 시설이 많아 개방 지역을 제한하고 있으며 내부에는 특별한 볼거리보다는 말이 방목되어 있는 목가적인 풍경을 산책하면서 즐길 수 있다. 이곳은 승마를 배우거나 말먹이주기 체험 등을 진행하는 곳이 아닌 산책로와 그늘막, 잔디광장, 화장실 등을 개방하기 때문에 조용히 산책을 즐길 수 있는 곳이다. 주변에 높은 건물이 없어 탁 트인 초원과 높은 하늘을 마음껏 느낄 수 있고 인근에 있는 서삼릉과 함께 둘러봐도 좋다. 산책길 언덕 위쪽으로는 의자와 매점이 있어 쉬어갈 수 있는 곳이다.",
    },
    meta: { updated_at: "2026-09-02" },
    // 오더 #C8 [1]: TourAPI overview_ko 원문 이식 · 마침표 뒤 \n\n 문단 분리만. 창작·의역 0.
    sections: [
      {
        heading: { ko: "소개", en: "About", ja: "紹介", "zh-CN": "介绍", "zh-TW": "介紹" },
        body: {
          ko: "서울 근교 고양시 서삼릉에 인접한 원당 종마목장은 한국마사회에서 설치하여 운영하는 곳이다.\n\n1988년 서울 올림픽 게임이 있을 때는 크로스컨트리 종목의 경기장으로도 활용되었다.\n\n목장의 목가적 풍경에 반한 시민들의 요청으로 1997년부터 일반인에게도 일부 시설이 개방되었고 그 이후 드라마 촬영지로 더욱 알려지게 되었다.\n\n위험 시설이 많아 개방 지역을 제한하고 있으며 내부에는 특별한 볼거리보다는 말이 방목되어 있는 목가적인 풍경을 산책하면서 즐길 수 있다.\n\n이곳은 승마를 배우거나 말먹이주기 체험 등을 진행하는 곳이 아닌 산책로와 그늘막, 잔디광장, 화장실 등을 개방하기 때문에 조용히 산책을 즐길 수 있는 곳이다.\n\n주변에 높은 건물이 없어 탁 트인 초원과 높은 하늘을 마음껏 느낄 수 있고 인근에 있는 서삼릉과 함께 둘러봐도 좋다.\n\n산책길 언덕 위쪽으로는 의자와 매점이 있어 쉬어갈 수 있는 곳이다.",
          en: "Adjacent to Seosamneung in Goyang on the outskirts of Seoul, Wondang Horse Ranch is a facility set up and operated by the Korea Racing Authority.\n\nDuring the 1988 Seoul Olympics it was also used as the venue for the cross-country event.\n\nCharmed by the pastoral scenery, residents asked for public access, and part of the site has been open to visitors since 1997; it has since become better known as a filming location for TV dramas.\n\nBecause there are many hazardous facilities on site, the open area is limited, and rather than special attractions, visitors can enjoy the pastoral landscape of horses grazing while taking a walk.\n\nThis is not a place to learn horseback riding or feed the horses; only the walking paths, shade shelters, lawn plaza, and restrooms are open, so you can enjoy a quiet walk.\n\nWith no tall buildings nearby, you can take in the wide-open pasture and the vast sky, and it pairs well with a visit to nearby Seosamneung.\n\nAbove the walking path there is a hill with benches and a shop where you can rest.",
          ja: "ソウル近郊、高陽市の西三陵（ソサムヌン）に隣接する元堂（ウォンダン）種馬牧場は、韓国馬事会（Korea Racing Authority）が設置・運営する施設です。\n\n1988年ソウルオリンピック開催時にはクロスカントリー競技の会場としても使われました。\n\n牧場の牧歌的な風景に魅せられた市民の要望を受け、1997年から一部施設が一般開放され、その後はドラマのロケ地としてさらに広く知られるようになりました。\n\n危険な施設が多いため開放区域は制限されており、館内には特別な見どころというより、放牧されている馬たちの牧歌的な風景を散策しながら楽しむ形になります。\n\nここは乗馬を習ったり馬に餌をやる体験ができる場所ではなく、散策路・日除けシェルター・芝生広場・トイレのみが開放されているため、静かな散策を楽しむのに向いています。\n\n周辺に高い建物がなく、広々とした草原と高い空を存分に感じられ、近くの西三陵と合わせて回るのもおすすめです。\n\n散策路の丘の上にはベンチと売店があり、休憩できる場所となっています。",
          "zh-CN": "位于首尔近郊高阳市西三陵旁的元堂（Wondang）种马牧场，是由韩国马事会（Korea Racing Authority）设置并运营的场所。\n\n1988年首尔奥运会期间，这里曾作为越野赛项目的赛场使用。\n\n因牧场的田园风光受到市民喜爱，应市民请求，1997年起部分设施对普通民众开放，其后作为电视剧取景地更加知名。\n\n由于场内设施存在危险，开放区域受到限制；场内并无特别景点，主要以放牧的马匹与田园风景的散步体验为主。\n\n此处并非可学习骑马或参与投喂体验的地方，仅开放步道、遮阳棚、草坪广场与洗手间，因此适合享受静谧的散步。\n\n周边没有高层建筑，可尽情感受开阔草原与高远天空，与邻近的西三陵一同游览亦为佳选。\n\n步道山丘上方设有座椅与小卖部，是可以歇脚的场所。",
          "zh-TW": "位於首爾近郊高陽市西三陵旁的元堂（Wondang）種馬牧場，是由韓國馬事會（Korea Racing Authority）設置並運營的場所。\n\n1988年首爾奧運會期間，這裡曾作為越野賽項目的賽場使用。\n\n因牧場的田園風光受到市民喜愛，應市民請求，1997年起部分設施對普通民眾開放，其後作為電視劇取景地更加知名。\n\n由於場內設施存在危險，開放區域受到限制；場內並無特別景點，主要以放牧的馬匹與田園風景的散步體驗為主。\n\n此處並非可學習騎馬或參與餵食體驗的地方，僅開放步道、遮陽棚、草坪廣場與洗手間，因此適合享受靜謐的散步。\n\n周邊沒有高層建築，可盡情感受開闊草原與高遠天空，與鄰近的西三陵一同遊覽亦為佳選。\n\n步道山丘上方設有座椅與小賣部，是可以歇腳的場所。",
        },
      },
    ],
    access: [],
    know: [],
    ko_card: [{ name_ko: "원당종마목장 (렛츠런팜 원당)", address_ko: "경기도 고양시 덕양구 서삼릉길 233-112" }],
    map: [{ lat: 37.6615023377, lng: 126.8683006076, label: "원당종마목장 (렛츠런팜 원당)" }],
    credits: [],
    related: [],
    info: { hours: "varies", duration: "1_2h", admission: "varies", access: "inquiry" },
    highlights: [
      { ko: "말 목장 · 사극·CF 촬영지", en: "Wondang Horse Ranch (Let's Run Farm Wondang)", ja: "元堂種馬牧場(レッツランファーム元堂)", "zh-CN": "元堂种马牧场（Let's Run Farm 元堂）", "zh-TW": "元堂種馬牧場（Let's Run Farm 元堂）" },
      { ko: "초원 산책", en: "Wondang Horse Ranch (Let's Run Farm Wondang)", ja: "元堂種馬牧場(レッツランファーム元堂)", "zh-CN": "元堂种马牧场（Let's Run Farm 元堂）", "zh-TW": "元堂種馬牧場（Let's Run Farm 元堂）" },
      { ko: "한국마사회 운영", en: "Wondang Horse Ranch (Let's Run Farm Wondang)", ja: "元堂種馬牧場(レッツランファーム元堂)", "zh-CN": "元堂种马牧场（Let's Run Farm 元堂）", "zh-TW": "元堂種馬牧場（Let's Run Farm 元堂）" },
    ],
    adSlot: null,
    best_selected: false,
    tourapi: { contentid: "128138", overview_ko: "서울 근교 고양시 서삼릉에 인접한 원당 종마목장은 한국마사회에서 설치하여 운영하는 곳이다. 1988년 서울 올림픽 게임이 있을 때는 크로스컨트리 종목의 경기장으로도 활용되었다. 목장의 목가적 풍경에 반한 시민들의 요청으로 1997년부터 일반인에게도 일부 시설이 개방되었고 그 이후 드라마 촬영지로 더욱 알려지게 되었다. 위험 시설이 많아 개방 지역을 제한하고 있으며 내부에는 특별한 볼거리보다는 말이 방목되어 있는 목가적인 풍경을 산책하면서 즐길 수 있다. 이곳은 승마를 배우거나 말먹이주기 체험 등을 진행하는 곳이 아닌 산책로와 그늘막, 잔디광장, 화장실 등을 개방하기 때문에 조용히 산책을 즐길 수 있는 곳이다. 주변에 높은 건물이 없어 탁 트인 초원과 높은 하늘을 마음껏 느낄 수 있고 인근에 있는 서삼릉과 함께 둘러봐도 좋다. 산책길 언덕 위쪽으로는 의자와 매점이 있어 쉬어갈 수 있는 곳이다." },
  },

  {
    slug: "janghang-wetlands",
    category: "walk",
    type: "list",
    region: "일산동구",
    title: { ko: "장항습지", en: "Janghang Wetlands", ja: "獐項湿地", "zh-CN": "獐项湿地", "zh-TW": "獐項濕地" },
    title_en_display: "JANGHANG WETLANDS",
    subtitle: {
      ko: "한강하구는 우리나라 큰 하천 중에서 유일하게 하굿둑이 없는 열린 하구로 민물과 바닷물이 섞이는 갯물지역(기수역)이 발달하였다.",
      en: "한강하구는 우리나라 큰 하천 중에서 유일하게 하굿둑이 없는 열린 하구로 민물과 바닷물이 섞이는 갯물지역(기수역)이 발달하였다.",
      ja: "한강하구는 우리나라 큰 하천 중에서 유일하게 하굿둑이 없는 열린 하구로 민물과 바닷물이 섞이는 갯물지역(기수역)이 발달하였다.",
      "zh-CN": "한강하구는 우리나라 큰 하천 중에서 유일하게 하굿둑이 없는 열린 하구로 민물과 바닷물이 섞이는 갯물지역(기수역)이 발달하였다.",
      "zh-TW": "한강하구는 우리나라 큰 하천 중에서 유일하게 하굿둑이 없는 열린 하구로 민물과 바닷물이 섞이는 갯물지역(기수역)이 발달하였다.",
    },
    lead: {
      ko: "한강하구는 우리나라 큰 하천 중에서 유일하게 하굿둑이 없는 열린 하구로 민물과 바닷물이 섞이는 갯물지역(기수역)이 발달하였다. 또한 한강하구 공동수역 주변의 민간인 통제구역 내에 있어서 생태계가 잘 보전되어 왔다. 환경부는 2006년 4월 17일 장항습지, 산남습지, 시암리습지, 공릉천하구습지, 성동습지, 유도 등의 습지를 포함하여 수역 전체를 ‘한강하구 습지보호지역’으로 지정하였다. 지정면적은 60.6㎢으로 낙동강하구 습지보호지역의 1.6배, 우포늪의 7배이다. \n장항습지는 한강하구 기수역이 시작하는 초입에 자리 잡고 있다. 행정적으로 고양시의 신평동, 장항동, 법곳동에 걸쳐있다. 길이는 김포대교에서 일산대교까지 약 7.6 ㎞이고, 면적은 습지숲과 갈대밭, 농경지, 갯벌, 수역을 포함하여 약 5.95㎢에 이른다.\n장항습지에는 너구리, 삵, 고라니, 두더지, 등줄쥐, 멧밭쥐, 작은땃쥐, 갈밭쥐 등의 포유류가 서식하고 있다. 특히 고라니는 습지를 둘러싼 철책선으로 보호되어 70여 마리가 관찰되기도 했다. 이외에도 저어새, 재두루미, 개리 등의 조류가 찾아오고, 55종의 어류가 서식하고 있다.",
      en: "한강하구는 우리나라 큰 하천 중에서 유일하게 하굿둑이 없는 열린 하구로 민물과 바닷물이 섞이는 갯물지역(기수역)이 발달하였다. 또한 한강하구 공동수역 주변의 민간인 통제구역 내에 있어서 생태계가 잘 보전되어 왔다. 환경부는 2006년 4월 17일 장항습지, 산남습지, 시암리습지, 공릉천하구습지, 성동습지, 유도 등의 습지를 포함하여 수역 전체를 ‘한강하구 습지보호지역’으로 지정하였다. 지정면적은 60.6㎢으로 낙동강하구 습지보호지역의 1.6배, 우포늪의 7배이다. \n장항습지는 한강하구 기수역이 시작하는 초입에 자리 잡고 있다. 행정적으로 고양시의 신평동, 장항동, 법곳동에 걸쳐있다. 길이는 김포대교에서 일산대교까지 약 7.6 ㎞이고, 면적은 습지숲과 갈대밭, 농경지, 갯벌, 수역을 포함하여 약 5.95㎢에 이른다.\n장항습지에는 너구리, 삵, 고라니, 두더지, 등줄쥐, 멧밭쥐, 작은땃쥐, 갈밭쥐 등의 포유류가 서식하고 있다. 특히 고라니는 습지를 둘러싼 철책선으로 보호되어 70여 마리가 관찰되기도 했다. 이외에도 저어새, 재두루미, 개리 등의 조류가 찾아오고, 55종의 어류가 서식하고 있다.",
      ja: "한강하구는 우리나라 큰 하천 중에서 유일하게 하굿둑이 없는 열린 하구로 민물과 바닷물이 섞이는 갯물지역(기수역)이 발달하였다. 또한 한강하구 공동수역 주변의 민간인 통제구역 내에 있어서 생태계가 잘 보전되어 왔다. 환경부는 2006년 4월 17일 장항습지, 산남습지, 시암리습지, 공릉천하구습지, 성동습지, 유도 등의 습지를 포함하여 수역 전체를 ‘한강하구 습지보호지역’으로 지정하였다. 지정면적은 60.6㎢으로 낙동강하구 습지보호지역의 1.6배, 우포늪의 7배이다. \n장항습지는 한강하구 기수역이 시작하는 초입에 자리 잡고 있다. 행정적으로 고양시의 신평동, 장항동, 법곳동에 걸쳐있다. 길이는 김포대교에서 일산대교까지 약 7.6 ㎞이고, 면적은 습지숲과 갈대밭, 농경지, 갯벌, 수역을 포함하여 약 5.95㎢에 이른다.\n장항습지에는 너구리, 삵, 고라니, 두더지, 등줄쥐, 멧밭쥐, 작은땃쥐, 갈밭쥐 등의 포유류가 서식하고 있다. 특히 고라니는 습지를 둘러싼 철책선으로 보호되어 70여 마리가 관찰되기도 했다. 이외에도 저어새, 재두루미, 개리 등의 조류가 찾아오고, 55종의 어류가 서식하고 있다.",
      "zh-CN": "한강하구는 우리나라 큰 하천 중에서 유일하게 하굿둑이 없는 열린 하구로 민물과 바닷물이 섞이는 갯물지역(기수역)이 발달하였다. 또한 한강하구 공동수역 주변의 민간인 통제구역 내에 있어서 생태계가 잘 보전되어 왔다. 환경부는 2006년 4월 17일 장항습지, 산남습지, 시암리습지, 공릉천하구습지, 성동습지, 유도 등의 습지를 포함하여 수역 전체를 ‘한강하구 습지보호지역’으로 지정하였다. 지정면적은 60.6㎢으로 낙동강하구 습지보호지역의 1.6배, 우포늪의 7배이다. \n장항습지는 한강하구 기수역이 시작하는 초입에 자리 잡고 있다. 행정적으로 고양시의 신평동, 장항동, 법곳동에 걸쳐있다. 길이는 김포대교에서 일산대교까지 약 7.6 ㎞이고, 면적은 습지숲과 갈대밭, 농경지, 갯벌, 수역을 포함하여 약 5.95㎢에 이른다.\n장항습지에는 너구리, 삵, 고라니, 두더지, 등줄쥐, 멧밭쥐, 작은땃쥐, 갈밭쥐 등의 포유류가 서식하고 있다. 특히 고라니는 습지를 둘러싼 철책선으로 보호되어 70여 마리가 관찰되기도 했다. 이외에도 저어새, 재두루미, 개리 등의 조류가 찾아오고, 55종의 어류가 서식하고 있다.",
      "zh-TW": "한강하구는 우리나라 큰 하천 중에서 유일하게 하굿둑이 없는 열린 하구로 민물과 바닷물이 섞이는 갯물지역(기수역)이 발달하였다. 또한 한강하구 공동수역 주변의 민간인 통제구역 내에 있어서 생태계가 잘 보전되어 왔다. 환경부는 2006년 4월 17일 장항습지, 산남습지, 시암리습지, 공릉천하구습지, 성동습지, 유도 등의 습지를 포함하여 수역 전체를 ‘한강하구 습지보호지역’으로 지정하였다. 지정면적은 60.6㎢으로 낙동강하구 습지보호지역의 1.6배, 우포늪의 7배이다. \n장항습지는 한강하구 기수역이 시작하는 초입에 자리 잡고 있다. 행정적으로 고양시의 신평동, 장항동, 법곳동에 걸쳐있다. 길이는 김포대교에서 일산대교까지 약 7.6 ㎞이고, 면적은 습지숲과 갈대밭, 농경지, 갯벌, 수역을 포함하여 약 5.95㎢에 이른다.\n장항습지에는 너구리, 삵, 고라니, 두더지, 등줄쥐, 멧밭쥐, 작은땃쥐, 갈밭쥐 등의 포유류가 서식하고 있다. 특히 고라니는 습지를 둘러싼 철책선으로 보호되어 70여 마리가 관찰되기도 했다. 이외에도 저어새, 재두루미, 개리 등의 조류가 찾아오고, 55종의 어류가 서식하고 있다.",
    },
    meta: { updated_at: "2026-09-02" },
    // 오더 #C8 [1]: TourAPI overview_ko 원문 이식 · 마침표 뒤 \n\n 문단 분리만. 창작·의역 0.
    sections: [
      {
        heading: { ko: "소개", en: "About", ja: "紹介", "zh-CN": "介绍", "zh-TW": "介紹" },
        body: {
          ko: "한강하구는 우리나라 큰 하천 중에서 유일하게 하굿둑이 없는 열린 하구로 민물과 바닷물이 섞이는 갯물지역(기수역)이 발달하였다.\n\n또한 한강하구 공동수역 주변의 민간인 통제구역 내에 있어서 생태계가 잘 보전되어 왔다.\n\n환경부는 2006년 4월 17일 장항습지, 산남습지, 시암리습지, 공릉천하구습지, 성동습지, 유도 등의 습지를 포함하여 수역 전체를 ‘한강하구 습지보호지역’으로 지정하였다.\n\n지정면적은 60.6㎢으로 낙동강하구 습지보호지역의 1.6배, 우포늪의 7배이다.\n\n장항습지는 한강하구 기수역이 시작하는 초입에 자리 잡고 있다.\n\n행정적으로 고양시의 신평동, 장항동, 법곳동에 걸쳐있다.\n\n길이는 김포대교에서 일산대교까지 약 7.6 ㎞이고, 면적은 습지숲과 갈대밭, 농경지, 갯벌, 수역을 포함하여 약 5.95㎢에 이른다.\n\n장항습지에는 너구리, 삵, 고라니, 두더지, 등줄쥐, 멧밭쥐, 작은땃쥐, 갈밭쥐 등의 포유류가 서식하고 있다.\n\n특히 고라니는 습지를 둘러싼 철책선으로 보호되어 70여 마리가 관찰되기도 했다.\n\n이외에도 저어새, 재두루미, 개리 등의 조류가 찾아오고, 55종의 어류가 서식하고 있다.",
          en: "The Han River estuary is the only open estuary among Korea's major rivers with no barrier dam, so a brackish zone where fresh and sea water mix has developed here.\n\nThe surrounding common water zone also falls within a Civilian Control Line area, which has kept the ecosystem well preserved.\n\nOn April 17, 2006 the Ministry of Environment designated the entire water zone, including Janghang, Sannam, Siamri, Gongneungcheon-Estuary, Seongdong, and Yudo wetlands, as the \"Han River Estuary Wetland Protection Area.\"\n\nThe designated area is 60.6 km², 1.6 times the Nakdong Estuary Wetland Protection Area and 7 times Upo Marsh.\n\nJanghang Wetland sits right at the entrance of the Han River brackish zone.\n\nAdministratively it spans Sinpyeong-dong, Janghang-dong, and Beopgot-dong in Goyang.\n\nIt is about 7.6 km long between the Gimpo Bridge and Ilsan Bridge, and about 5.95 km² in area including wetland forest, reed beds, farmland, tidal flats, and water surfaces.\n\nMammals such as raccoon dog, leopard cat, water deer, mole, striped field mouse, harvest mouse, lesser white-toothed shrew, and reed vole live in Janghang Wetland.\n\nWater deer in particular have been protected by the fence surrounding the wetland, and as many as around 70 individuals have been observed at a time.\n\nBirds such as black-faced spoonbill, white-naped crane, and swan goose also visit, and 55 species of fish live in the waters.",
          ja: "漢江河口は韓国の主要河川の中で唯一、河口堰のない開放河口であり、淡水と海水が混じる汽水域が発達しています。\n\nまた漢江河口の共同水域周辺は民間人統制区域内にあり、生態系が良好に保存されてきました。\n\n環境部は2006年4月17日、獐項（チャンハン）湿地・山南湿地・侍岩里湿地・空陵川河口湿地・城東湿地・留島などの湿地を含む水域全体を「漢江河口湿地保護地域」に指定しました。\n\n指定面積は60.6㎢で、洛東江河口湿地保護地域の1.6倍、牛浦沼の7倍です。\n\n獐項湿地は漢江河口の汽水域が始まる入口に位置しています。\n\n行政区域上は高陽市の新坪洞・獐項洞・法串洞にまたがっています。\n\n長さは金浦大橋から一山大橋まで約7.6km、面積は湿地林・葦原・農耕地・干潟・水域を含めて約5.95㎢に及びます。\n\n獐項湿地にはタヌキ、ヤマネコ（サル）、キバノロ（ゴラニ）、モグラ、セスジネズミ、カヤネズミ、コジャコウネズミ、カワラネズミなどの哺乳類が生息しています。\n\n特にキバノロは湿地を囲む鉄柵で保護され、一度に70頭ほどが観察されることもあります。\n\nそのほかクロツラヘラサギ、ソデグロヅル、サカツラガンなどの鳥類も飛来し、55種の魚類が生息しています。",
          "zh-CN": "汉江河口是韩国主要河川中唯一没有河口坝的开放河口，发展出淡水与海水交汇的咸淡水域（汽水域）。\n\n此外，汉江河口共同水域周边位于民间人统制区域之内，生态系统得到良好保存。\n\n环境部于2006年4月17日将獐项（Janghang）湿地、山南湿地、侍岩里湿地、空陵川河口湿地、城东湿地、留岛等湿地在内的整个水域指定为「汉江河口湿地保护区」。\n\n指定面积为60.6㎢，是洛东江河口湿地保护区的1.6倍、牛浦沼的7倍。\n\n獐项湿地位于汉江河口汽水域的入口。\n\n行政区划上横跨高阳市新坪洞、獐项洞、法串洞。\n\n长度自金浦大桥至一山大桥约7.6公里，面积包括湿地林、芦苇丛、农耕地、滩涂与水域，约达5.95㎢。\n\n獐项湿地栖息着貉、豹猫、獐、鼹鼠、纹背鼠、姬鼠、小麝鼩、田鼠等哺乳动物。\n\n特别是獐，因湿地周围的铁丝网得以保护，曾一次观察到约70只。\n\n此外还有黑脸琵鹭、白枕鹤、鸿雁等鸟类到访，水中栖息着55种鱼类。",
          "zh-TW": "漢江河口是韓國主要河川中唯一沒有河口壩的開放河口，發展出淡水與海水交匯的鹹淡水域（汽水域）。\n\n此外，漢江河口共同水域周邊位於民間人統制區域之內，生態系統得到良好保存。\n\n環境部於2006年4月17日將獐項（Janghang）濕地、山南濕地、侍岩里濕地、空陵川河口濕地、城東濕地、留島等濕地在內的整個水域指定為「漢江河口濕地保護區」。\n\n指定面積為60.6㎢，是洛東江河口濕地保護區的1.6倍、牛浦沼的7倍。\n\n獐項濕地位於漢江河口汽水域的入口。\n\n行政區劃上橫跨高陽市新坪洞、獐項洞、法串洞。\n\n長度自金浦大橋至一山大橋約7.6公里，面積包括濕地林、蘆葦叢、農耕地、灘塗與水域，約達5.95㎢。\n\n獐項濕地棲息著貉、豹貓、獐、鼴鼠、紋背鼠、姬鼠、小麝鼩、田鼠等哺乳動物。\n\n特別是獐，因濕地周圍的鐵絲網得以保護，曾一次觀察到約70隻。\n\n此外還有黑臉琵鷺、白枕鶴、鴻雁等鳥類到訪，水中棲息著55種魚類。",
        },
      },
    ],
    access: [],
    know: [],
    ko_card: [{ name_ko: "장항습지", address_ko: "경기도 고양시 일산동구 장항동 516" }],
    map: [{ lat: 37.6447548203, lng: 126.742512571, label: "장항습지" }],
    credits: [],
    related: [],
    info: { hours: "varies", duration: "1_2h", admission: "varies", access: "inquiry" },
    highlights: [
      { ko: "한강 하구의 습지", en: "Janghang Wetlands", ja: "獐項湿地", "zh-CN": "獐项湿地", "zh-TW": "獐項濕地" },
      { ko: "람사르협약 인접 보호구역", en: "Janghang Wetlands", ja: "獐項湿地", "zh-CN": "獐项湿地", "zh-TW": "獐項濕地" },
      { ko: "철새 관찰", en: "Janghang Wetlands", ja: "獐項湿地", "zh-CN": "獐项湿地", "zh-TW": "獐項濕地" },
    ],
    adSlot: null,
    // 오더 #C8 [1]: TourAPI Type1 상위 3장 (contentid 2613655). 출처 한국관광공사 공공누리 제1유형.
    gallery: [
      { url: "/images/spots/janghang-wetlands-1.jpg", credit: "출처: 한국관광공사 (공공누리 제1유형)", cpyrht: "Type1" },
      { url: "/images/spots/janghang-wetlands-2.jpg", credit: "출처: 한국관광공사 (공공누리 제1유형)", cpyrht: "Type1" },
      { url: "/images/spots/janghang-wetlands-3.jpg", credit: "출처: 한국관광공사 (공공누리 제1유형)", cpyrht: "Type1" },
    ],
    official_url: "https://www.goyang.go.kr/gojanghang/index.do",
    best_selected: false,
    tourapi: { contentid: "2613655", overview_ko: "한강하구는 우리나라 큰 하천 중에서 유일하게 하굿둑이 없는 열린 하구로 민물과 바닷물이 섞이는 갯물지역(기수역)이 발달하였다. 또한 한강하구 공동수역 주변의 민간인 통제구역 내에 있어서 생태계가 잘 보전되어 왔다. 환경부는 2006년 4월 17일 장항습지, 산남습지, 시암리습지, 공릉천하구습지, 성동습지, 유도 등의 습지를 포함하여 수역 전체를 ‘한강하구 습지보호지역’으로 지정하였다. 지정면적은 60.6㎢으로 낙동강하구 습지보호지역의 1.6배, 우포늪의 7배이다. \n장항습지는 한강하구 기수역이 시작하는 초입에 자리 잡고 있다. 행정적으로 고양시의 신평동, 장항동, 법곳동에 걸쳐있다. 길이는 김포대교에서 일산대교까지 약 7.6 ㎞이고, 면적은 습지숲과 갈대밭, 농경지, 갯벌, 수역을 포함하여 약 5.95㎢에 이른다.\n장항습지에는 너구리, 삵, 고라니, 두더지, 등줄쥐, 멧밭쥐, 작은땃쥐, 갈밭쥐 등의 포유류가 서식하고 있다. 특히 고라니는 습지를 둘러싼 철책선으로 보호되어 70여 마리가 관찰되기도 했다. 이외에도 저어새, 재두루미, 개리 등의 조류가 찾아오고, 55종의 어류가 서식하고 있다.", homepage: "https://www.goyang.go.kr/gojanghang/index.do" },
  },


  // ─── 오더 #C10: 자연·산책 신규 스팟 2곳 (TourAPI overview_ko 확보분) ─────
  {
    slug: "angok-wetland-park",
    category: "walk",
    type: "list",
    region: "일산동구",
    title: { ko: "안곡습지공원", en: "Angok Wetland Park", ja: "安谷湿地公園", "zh-CN": "安谷湿地公园", "zh-TW": "安谷濕地公園" },
    title_en_display: "ANGOK WETLAND PARK",
    subtitle: {
      ko: "안곡습지는 고봉산 습지라고도 불리는 고양시의 생태공원으로, 오색딱따구리, 솔부엉이 등 다양한 동물들은 물론 가재, 맹꽁이 같은 양서류들 또한 관찰할 수 있다.",
      en: "안곡습지는 고봉산 습지라고도 불리는 고양시의 생태공원으로, 오색딱따구리, 솔부엉이 등 다양한 동물들은 물론 가재, 맹꽁이 같은 양서류들 또한 관찰할 수 있다.",
      ja: "안곡습지는 고봉산 습지라고도 불리는 고양시의 생태공원으로, 오색딱따구리, 솔부엉이 등 다양한 동물들은 물론 가재, 맹꽁이 같은 양서류들 또한 관찰할 수 있다.",
      "zh-CN": "안곡습지는 고봉산 습지라고도 불리는 고양시의 생태공원으로, 오색딱따구리, 솔부엉이 등 다양한 동물들은 물론 가재, 맹꽁이 같은 양서류들 또한 관찰할 수 있다.",
      "zh-TW": "안곡습지는 고봉산 습지라고도 불리는 고양시의 생태공원으로, 오색딱따구리, 솔부엉이 등 다양한 동물들은 물론 가재, 맹꽁이 같은 양서류들 또한 관찰할 수 있다.",
    },
    lead: {
      ko: "안곡습지는 고봉산 습지라고도 불리는 고양시의 생태공원으로, 오색딱따구리, 솔부엉이 등 다양한 동물들은 물론 가재, 맹꽁이 같은 양서류들 또한 관찰할 수 있다. 한때 신도시 개발로 사라질 위기였으나 주민들의 자발적 참여로 생태공원으로 남게 되었다. 갈대가 무성하고 겨울에도 짙은 녹색의 해캄을 확인할 수 있다. 열린 광장을 시작으로 야외학습원, 수로 습지원, 묵논 학습원, 생태보전습지원, 생태학습원, 야생초화원, 숲 속 체험, 삐약이 체험숲, 운동시설로 이어지는 안곡습지공원은 남녀노소 모든 사람들의 휴식처이자 생태학습 공간이다.",
      en: "안곡습지는 고봉산 습지라고도 불리는 고양시의 생태공원으로, 오색딱따구리, 솔부엉이 등 다양한 동물들은 물론 가재, 맹꽁이 같은 양서류들 또한 관찰할 수 있다. 한때 신도시 개발로 사라질 위기였으나 주민들의 자발적 참여로 생태공원으로 남게 되었다. 갈대가 무성하고 겨울에도 짙은 녹색의 해캄을 확인할 수 있다. 열린 광장을 시작으로 야외학습원, 수로 습지원, 묵논 학습원, 생태보전습지원, 생태학습원, 야생초화원, 숲 속 체험, 삐약이 체험숲, 운동시설로 이어지는 안곡습지공원은 남녀노소 모든 사람들의 휴식처이자 생태학습 공간이다.",
      ja: "안곡습지는 고봉산 습지라고도 불리는 고양시의 생태공원으로, 오색딱따구리, 솔부엉이 등 다양한 동물들은 물론 가재, 맹꽁이 같은 양서류들 또한 관찰할 수 있다. 한때 신도시 개발로 사라질 위기였으나 주민들의 자발적 참여로 생태공원으로 남게 되었다. 갈대가 무성하고 겨울에도 짙은 녹색의 해캄을 확인할 수 있다. 열린 광장을 시작으로 야외학습원, 수로 습지원, 묵논 학습원, 생태보전습지원, 생태학습원, 야생초화원, 숲 속 체험, 삐약이 체험숲, 운동시설로 이어지는 안곡습지공원은 남녀노소 모든 사람들의 휴식처이자 생태학습 공간이다.",
      "zh-CN": "안곡습지는 고봉산 습지라고도 불리는 고양시의 생태공원으로, 오색딱따구리, 솔부엉이 등 다양한 동물들은 물론 가재, 맹꽁이 같은 양서류들 또한 관찰할 수 있다. 한때 신도시 개발로 사라질 위기였으나 주민들의 자발적 참여로 생태공원으로 남게 되었다. 갈대가 무성하고 겨울에도 짙은 녹색의 해캄을 확인할 수 있다. 열린 광장을 시작으로 야외학습원, 수로 습지원, 묵논 학습원, 생태보전습지원, 생태학습원, 야생초화원, 숲 속 체험, 삐약이 체험숲, 운동시설로 이어지는 안곡습지공원은 남녀노소 모든 사람들의 휴식처이자 생태학습 공간이다.",
      "zh-TW": "안곡습지는 고봉산 습지라고도 불리는 고양시의 생태공원으로, 오색딱따구리, 솔부엉이 등 다양한 동물들은 물론 가재, 맹꽁이 같은 양서류들 또한 관찰할 수 있다. 한때 신도시 개발로 사라질 위기였으나 주민들의 자발적 참여로 생태공원으로 남게 되었다. 갈대가 무성하고 겨울에도 짙은 녹색의 해캄을 확인할 수 있다. 열린 광장을 시작으로 야외학습원, 수로 습지원, 묵논 학습원, 생태보전습지원, 생태학습원, 야생초화원, 숲 속 체험, 삐약이 체험숲, 운동시설로 이어지는 안곡습지공원은 남녀노소 모든 사람들의 휴식처이자 생태학습 공간이다.",
    },
    meta: { updated_at: "2026-09-03" },
    // 오더 #C10 [1]: TourAPI overview_ko 원문 이식 · 마침표 뒤 \n\n 문단 분리만. 창작·의역 0.
    sections: [
      {
        heading: { ko: "소개", en: "About", ja: "紹介", "zh-CN": "介绍", "zh-TW": "介紹" },
        body: {
          ko: "안곡습지는 고봉산 습지라고도 불리는 고양시의 생태공원으로, 오색딱따구리, 솔부엉이 등 다양한 동물들은 물론 가재, 맹꽁이 같은 양서류들 또한 관찰할 수 있다.\n\n한때 신도시 개발로 사라질 위기였으나 주민들의 자발적 참여로 생태공원으로 남게 되었다.\n\n갈대가 무성하고 겨울에도 짙은 녹색의 해캄을 확인할 수 있다.\n\n열린 광장을 시작으로 야외학습원, 수로 습지원, 묵논 학습원, 생태보전습지원, 생태학습원, 야생초화원, 숲 속 체험, 삐약이 체험숲, 운동시설로 이어지는 안곡습지공원은 남녀노소 모든 사람들의 휴식처이자 생태학습 공간이다.",
          en: "Angok Wetland, also known as Gobongsan Wetland, is Goyang's ecological park. Alongside diverse animals such as the great spotted woodpecker and the brown hawk owl, amphibians like crayfish and the narrow-mouthed toad can also be observed here.\n\nIt was once at risk of disappearing to new-town development, but survived as an ecological park thanks to residents' voluntary participation.\n\nReeds grow thick, and even in winter the deep-green Spirogyra algae is visible.\n\nStarting from the Open Plaza, Angok Wetland Park continues through the Outdoor Learning Center, Waterway Wetland Garden, Fallow-Paddy Learning Garden, Ecological Preservation Wetland Garden, Ecological Learning Center, Wildflower Garden, Forest Experience, Ppiyagi Experience Forest, and exercise facilities — a place of rest and eco-learning for people of all ages.",
          ja: "安谷（アンゴク）湿地は高峰山（コボンサン）湿地とも呼ばれる高陽市の生態公園で、アカゲラやアオバズクなど多様な動物のほか、ザリガニやヌマガエルのような両生類も観察できます。\n\n一時は新都市開発で消失の危機にありましたが、住民の自発的な参加によって生態公園として残されました。\n\n葦が生い茂り、冬でも濃い緑色のミズオオバコ（藻類）を確認できます。\n\n開かれた広場を出発点に、屋外学習園、水路湿地園、休耕田学習園、生態保全湿地園、生態学習園、野生草花園、森の体験、ピヤギ体験の森、運動施設へと続く安谷湿地公園は、老若男女すべての人の憩いの場であり、生態学習の空間です。",
          "zh-CN": "安谷湿地也被称为高峰山湿地，是高阳市的生态公园。除了大斑啄木鸟、褐鹰鸮等各种动物，还可观察到淡水虾、狭口蛙等两栖类。\n\n它曾因新城开发而濒临消失，靠居民的自愿参与得以保留为生态公园。\n\n芦苇丛生，即使在冬季也能看到浓绿色的水绵藻。\n\n从开放广场出发，安谷湿地公园依次串联户外学习园、水路湿地园、休耕田学习园、生态保护湿地园、生态学习园、野生花草园、森林体验、皮亚基体验林与运动设施，是老少皆宜的休憩之地与生态学习空间。",
          "zh-TW": "安谷濕地也被稱為高峰山濕地，是高陽市的生態公園。除了大斑啄木鳥、褐鷹鴞等各種動物，還可觀察到淡水蝦、狹口蛙等兩棲類。\n\n它曾因新城開發而瀕臨消失，靠居民的自願參與得以保留為生態公園。\n\n蘆葦叢生，即使在冬季也能看到濃綠色的水綿藻。\n\n從開放廣場出發，安谷濕地公園依次串聯戶外學習園、水路濕地園、休耕田學習園、生態保護濕地園、生態學習園、野生花草園、森林體驗、皮亞基體驗林與運動設施，是老少皆宜的休憩之地與生態學習空間。",
        },
      },
    ],
    access: [],
    know: [],
    ko_card: [{ name_ko: "안곡습지공원", address_ko: "경기도 고양시 일산동구 하늘마을로 39-5 (중산동)" }],
    map: [{ lat: 37.68402280667885, lng: 126.78449361187113, label: "안곡습지공원" }],
    credits: [],
    related: [],
    info: { hours: "varies", duration: "1_2h", admission: "free", access: "wheelchair" },
    highlights: [
      { ko: "도심 속 습지 생태공원", en: "Angok Wetland Park", ja: "安谷湿地公園", "zh-CN": "安谷湿地公园", "zh-TW": "安谷濕地公園" },
      { ko: "중산동 하늘마을 인접", en: "Angok Wetland Park", ja: "安谷湿地公園", "zh-CN": "安谷湿地公园", "zh-TW": "安谷濕地公園" },
      { ko: "가벼운 산책로", en: "Angok Wetland Park", ja: "安谷湿地公園", "zh-CN": "安谷湿地公园", "zh-TW": "安谷濕地公園" },
    ],
    adSlot: null,
    // 오더 #C10 [1]: TourAPI Type1 상위 3장 (contentid 2733849). 출처 한국관광공사 공공누리 제1유형.
    gallery: [
      { url: "/images/spots/angok-wetland-park-1.jpg", credit: "출처: 한국관광공사 (공공누리 제1유형)", cpyrht: "Type1" },
      { url: "/images/spots/angok-wetland-park-2.jpg", credit: "출처: 한국관광공사 (공공누리 제1유형)", cpyrht: "Type1" },
      { url: "/images/spots/angok-wetland-park-3.jpg", credit: "출처: 한국관광공사 (공공누리 제1유형)", cpyrht: "Type1" },
    ],
    best_selected: false,
    tourapi: { contentid: "2733849", overview_ko: "안곡습지는 고봉산 습지라고도 불리는 고양시의 생태공원으로, 오색딱따구리, 솔부엉이 등 다양한 동물들은 물론 가재, 맹꽁이 같은 양서류들 또한 관찰할 수 있다. 한때 신도시 개발로 사라질 위기였으나 주민들의 자발적 참여로 생태공원으로 남게 되었다. 갈대가 무성하고 겨울에도 짙은 녹색의 해캄을 확인할 수 있다. 열린 광장을 시작으로 야외학습원, 수로 습지원, 묵논 학습원, 생태보전습지원, 생태학습원, 야생초화원, 숲 속 체험, 삐약이 체험숲, 운동시설로 이어지는 안곡습지공원은 남녀노소 모든 사람들의 휴식처이자 생태학습 공간이다." },
  },

  {
    slug: "goyang-ecological-park",
    category: "walk",
    type: "list",
    region: "일산서구",
    title: { ko: "고양생태공원", en: "Goyang Ecological Park", ja: "高陽生態公園", "zh-CN": "高阳生态公园", "zh-TW": "高陽生態公園" },
    title_en_display: "GOYANG ECOLOGICAL PARK",
    subtitle: {
      ko: "고양생태공원은 고양시 최초로 생태를 주제로 조성한 새로운 개념의 공원이다.",
      en: "고양생태공원은 고양시 최초로 생태를 주제로 조성한 새로운 개념의 공원이다.",
      ja: "고양생태공원은 고양시 최초로 생태를 주제로 조성한 새로운 개념의 공원이다.",
      "zh-CN": "고양생태공원은 고양시 최초로 생태를 주제로 조성한 새로운 개념의 공원이다.",
      "zh-TW": "고양생태공원은 고양시 최초로 생태를 주제로 조성한 새로운 개념의 공원이다.",
    },
    lead: {
      ko: "고양생태공원은 고양시 최초로 생태를 주제로 조성한 새로운 개념의 공원이다. 도심 속 나대지를 활용하여 사람과 자연이 함께 살아가는 생태공간으로 생물들에게 안정적이고 다양한 서식처를 제공함으로써 시민들이 자연 속에서 살아가는 생물들을 쉽게 관찰·체험할 수 있는 건강한 생태환경을 만들어가고자 한다. 가족과 함께 하는 다양한 생태체험 및 탐방 프로그램을 제공하고 있으며 프로그램은 시기 및 상황에 따라 조정될 수 있다.\n\n(출처 : 고양특례시청)",
      en: "고양생태공원은 고양시 최초로 생태를 주제로 조성한 새로운 개념의 공원이다. 도심 속 나대지를 활용하여 사람과 자연이 함께 살아가는 생태공간으로 생물들에게 안정적이고 다양한 서식처를 제공함으로써 시민들이 자연 속에서 살아가는 생물들을 쉽게 관찰·체험할 수 있는 건강한 생태환경을 만들어가고자 한다. 가족과 함께 하는 다양한 생태체험 및 탐방 프로그램을 제공하고 있으며 프로그램은 시기 및 상황에 따라 조정될 수 있다.\n\n(출처 : 고양특례시청)",
      ja: "고양생태공원은 고양시 최초로 생태를 주제로 조성한 새로운 개념의 공원이다. 도심 속 나대지를 활용하여 사람과 자연이 함께 살아가는 생태공간으로 생물들에게 안정적이고 다양한 서식처를 제공함으로써 시민들이 자연 속에서 살아가는 생물들을 쉽게 관찰·체험할 수 있는 건강한 생태환경을 만들어가고자 한다. 가족과 함께 하는 다양한 생태체험 및 탐방 프로그램을 제공하고 있으며 프로그램은 시기 및 상황에 따라 조정될 수 있다.\n\n(출처 : 고양특례시청)",
      "zh-CN": "고양생태공원은 고양시 최초로 생태를 주제로 조성한 새로운 개념의 공원이다. 도심 속 나대지를 활용하여 사람과 자연이 함께 살아가는 생태공간으로 생물들에게 안정적이고 다양한 서식처를 제공함으로써 시민들이 자연 속에서 살아가는 생물들을 쉽게 관찰·체험할 수 있는 건강한 생태환경을 만들어가고자 한다. 가족과 함께 하는 다양한 생태체험 및 탐방 프로그램을 제공하고 있으며 프로그램은 시기 및 상황에 따라 조정될 수 있다.\n\n(출처 : 고양특례시청)",
      "zh-TW": "고양생태공원은 고양시 최초로 생태를 주제로 조성한 새로운 개념의 공원이다. 도심 속 나대지를 활용하여 사람과 자연이 함께 살아가는 생태공간으로 생물들에게 안정적이고 다양한 서식처를 제공함으로써 시민들이 자연 속에서 살아가는 생물들을 쉽게 관찰·체험할 수 있는 건강한 생태환경을 만들어가고자 한다. 가족과 함께 하는 다양한 생태체험 및 탐방 프로그램을 제공하고 있으며 프로그램은 시기 및 상황에 따라 조정될 수 있다.\n\n(출처 : 고양특례시청)",
    },
    meta: { updated_at: "2026-09-03" },
    // 오더 #C10 [1]: TourAPI overview_ko 원문 이식 · 마침표 뒤 \n\n 문단 분리만. 창작·의역 0.
    sections: [
      {
        heading: { ko: "소개", en: "About", ja: "紹介", "zh-CN": "介绍", "zh-TW": "介紹" },
        body: {
          ko: "고양생태공원은 고양시 최초로 생태를 주제로 조성한 새로운 개념의 공원이다.\n\n도심 속 나대지를 활용하여 사람과 자연이 함께 살아가는 생태공간으로 생물들에게 안정적이고 다양한 서식처를 제공함으로써 시민들이 자연 속에서 살아가는 생물들을 쉽게 관찰·체험할 수 있는 건강한 생태환경을 만들어가고자 한다.\n\n가족과 함께 하는 다양한 생태체험 및 탐방 프로그램을 제공하고 있으며 프로그램은 시기 및 상황에 따라 조정될 수 있다.\n\n(출처 : 고양특례시청)",
          en: "Goyang Ecological Park is a new-concept park in Goyang built around an ecological theme — the first of its kind in the city.\n\nBy repurposing an undeveloped urban lot, it creates a shared space where people and nature live together and provides stable, varied habitats for wildlife, aiming to build a healthy ecological environment where citizens can easily observe and experience the creatures living in nature.\n\nA variety of ecological experience and exploration programs are offered for families, and the programs may be adjusted by season or situation.\n\n(Source: Goyang Special City Hall)",
          ja: "高陽（コヤン）生態公園は、生態を主題として造成された高陽市初の新しい概念の公園です。\n\n都心の未利用地を活用し、人と自然が共に生きる生態空間として、生物に安定した多様な生息地を提供することで、市民が自然の中で暮らす生物を身近に観察・体験できる健全な生態環境をつくることを目指しています。\n\n家族と一緒に楽しめる多様な生態体験・探訪プログラムが提供されており、プログラムは時期や状況により調整される場合があります。\n\n（出典：高陽特例市役所）",
          "zh-CN": "高阳生态公园是高阳市首个以生态为主题打造的新概念公园。\n\n它将市中心的空置土地转化为人与自然共同生活的生态空间，为生物提供稳定而多样的栖息地，努力营造让市民能轻松观察与体验自然生物的健康生态环境。\n\n园内提供适合亲子同游的多样生态体验与探访项目，节目内容可能因季节和情况而调整。\n\n（资料来源：高阳特例市厅）",
          "zh-TW": "高陽生態公園是高陽市首個以生態為主題打造的新概念公園。\n\n它將市中心的空置土地轉化為人與自然共同生活的生態空間，為生物提供穩定而多樣的棲息地，努力營造讓市民能輕鬆觀察與體驗自然生物的健康生態環境。\n\n園內提供適合親子同遊的多樣生態體驗與探訪項目，節目內容可能因季節和情況而調整。\n\n（資料來源：高陽特例市廳）",
        },
      },
    ],
    access: [],
    know: [],
    ko_card: [{ name_ko: "고양생태공원", address_ko: "경기도 고양시 일산서구 대화로 315 (대화동)" }],
    map: [{ lat: 37.6839475174595, lng: 126.744128282208, label: "고양생태공원" }],
    credits: [],
    related: [],
    info: { hours: "varies", duration: "1_2h", admission: "free", access: "wheelchair" },
    highlights: [
      { ko: "킨텍스 인근 생태공원", en: "Goyang Ecological Park", ja: "高陽生態公園", "zh-CN": "高阳生态公园", "zh-TW": "高陽生態公園" },
      { ko: "대화동 자연 산책", en: "Goyang Ecological Park", ja: "高陽生態公園", "zh-CN": "高阳生态公园", "zh-TW": "高陽生態公園" },
      { ko: "가족 단위 방문 적합", en: "Goyang Ecological Park", ja: "高陽生態公園", "zh-CN": "高阳生态公园", "zh-TW": "高陽生態公園" },
    ],
    adSlot: null,
    official_url: "https://www.goyang.go.kr/ecopark",
    best_selected: false,
    tourapi: { contentid: "2732164", overview_ko: "고양생태공원은 고양시 최초로 생태를 주제로 조성한 새로운 개념의 공원이다. 도심 속 나대지를 활용하여 사람과 자연이 함께 살아가는 생태공간으로 생물들에게 안정적이고 다양한 서식처를 제공함으로써 시민들이 자연 속에서 살아가는 생물들을 쉽게 관찰·체험할 수 있는 건강한 생태환경을 만들어가고자 한다. 가족과 함께 하는 다양한 생태체험 및 탐방 프로그램을 제공하고 있으며 프로그램은 시기 및 상황에 따라 조정될 수 있다.\n\n(출처 : 고양특례시청)", homepage: "https://www.goyang.go.kr/ecopark" },
  },


  // ─── 오더 #C11 [1]: gawaji-rice-museum 신규 spot (culture · TourAPI 미등재) ─


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
