// data/whats-on-events.ts
// 홈 · 상세 라우트 통합 이벤트 소스 (오더 #P9-b).
//
// #P9 는 티켓 상품만 WhatsOn 소스로 썼기 때문에, 무료 축제·현장 발권 등
// 티켓 상품이 아닌 행사(고양시·고양문화재단 주최 상당수)를 실을 수 없었음.
// 이 파일은 두 종류의 이벤트를 하나의 스키마로 통합한다:
//   1) native events (예: GSAF 고양호수예술축제)  — free/officialUrl 중심
//   2) adapter events (data/ticket-booking.ts 8건) — ticketUrl 중심
//
// 소스 원자성:
//   · data/ticket-booking.ts — **무접촉** (기존 티켓 결제 라우트가 그대로 참조).
//     이 파일은 어댑터로 읽어서 WhatsOnEvent 형태로 노출만.
//   · 이 파일 (native events) — WhatsOnSection · 상세 라우트 소비.
//
// 사진 fallback:
//   · imageUrl 있으면 그대로.
//   · 없으면 venue/type 힌트로 public/images/hero/hero-{cat}.jpg 대체.
//   · fallback 사용 시 카드·상세에 "사진: {장소}" 캡션. 행사 사진으로
//     오인되지 않도록 실제 촬영 장소를 표기.
//   · 외부 사이트 이미지 직접 링크 금지 (저작권).

import {
  ticketProducts,
  type TicketProduct,
  type TicketLocale,
} from "@/data/ticket-booking";

export type WhatsOnLocale = "ko" | "en" | "ja" | "zh-CN" | "zh-TW";
export const WHATS_ON_LOCALES: WhatsOnLocale[] = ["ko", "en", "ja", "zh-CN", "zh-TW"];

export type I18nText = Record<WhatsOnLocale, string>;

export type WhatsOnEventType = "performance" | "festival" | "exhibition";

export interface WhatsOnEvent {
  id: string;
  slug: string;
  type: WhatsOnEventType;
  title: I18nText;
  venue: I18nText;
  /** ISO YYYY-MM-DD. 종료일 오늘 이전 항목은 자동 비노출. */
  startDate: string;
  endDate: string;
  /** 2~3문장. 판매 소구 0. */
  summary: I18nText;
  officialUrl?: string;
  /** 내부(예: /products/…/reservation?ticket=…) 또는 외부. 있으면 CTA "티켓 예매". */
  ticketUrl?: string;
  imageUrl?: string;
  /**
   * 실사진에 대한 © 크레딧 (오더 #P9-i [2]). 5로케일.
   * imageUrl 있을 때만 의미. 어댑터 티켓은 원본이 문자열 하나뿐이라
   * replicate() 로 5로케일 동일값을 채운다.
   */
  imageCredit?: I18nText;
  /**
   * 도로명 주소 (오더 #P9-e [8]). 지도 링크·한국어 원문 카드에서 사용.
   * 값 없으면 지도 블록 미렌더 (틀린 위치를 보여주느니 안 보여주는 편이 낫다).
   * venue 문자열 검색은 부정확 사례 발생 — address 기준으로 조회한다.
   */
  address?: string;
  /** 주최·주관. 어댑터 이벤트는 미지정될 수 있음. */
  host?: I18nText;
  free: boolean;
  /**
   * 실재 확인된 행사인지 (오더 #P9-d).
   * false 인 항목은 홈·상세 라우트·generateStaticParams 에서 전부 비노출.
   * 시드 상태 티켓 8건은 전부 false; 사실 확인된 항목만 true 로 표시.
   */
  verified: boolean;
}

// ─── native events ────────────────────────────────────────────────────────────

/**
 * GSAF — 고양호수예술축제 2026 (오더 #P9-b [2] · P9-f [3][4][5]).
 * 사실 근거: gylaf.kr + 배너 확인분.
 *   · 해외 6팀 · 국내 40팀 · 100여 회 공연 · 사흘간
 *   · 폐막공연 신승훈 · 야간 불꽃드론쇼 + 불꽃놀이
 *   · 일산호수공원 일원, 무료 관람
 *   · 주최 고양특례시 · 주관 고양문화재단
 * 프로그램 세부·출연진 등 미확인 정보는 추가하지 않음.
 * 이미지 imageUrl 설정 시 fallback 캡션 미적용 — imageCredit 로 크레딧.
 */
const gsaf2026: WhatsOnEvent = {
  id: "goyang-lake-arts-festival-2026",
  slug: "goyang-lake-arts-festival-2026",
  type: "festival",
  title: {
    ko: "2026 고양호수예술축제",
    en: "Goyang Lake Arts Festival 2026",
    ja: "2026 高陽湖水芸術祭",
    "zh-CN": "2026 高阳湖水艺术节",
    "zh-TW": "2026 高陽湖水藝術節",
  },
  venue: {
    ko: "일산호수공원 일원",
    en: "Ilsan Lake Park",
    ja: "一山湖水公園一帯",
    "zh-CN": "一山湖水公园一带",
    "zh-TW": "一山湖水公園一帶",
  },
  startDate: "2026-09-18",
  endDate: "2026-09-20",
  summary: {
    ko: "해외 거리예술 6개 팀과 국내 40개 팀이 참여해 100여 회 공연이 사흘간 열립니다. 폐막공연 신승훈, 야간 불꽃드론쇼와 불꽃놀이가 함께 진행됩니다.",
    en: "Six international street-arts companies and 40 Korean teams present around 100 performances over three days. The closing night features vocalist Shin Seung-hun and a night-time fireworks and drone show.",
    ja: "海外の街頭芸術6チームと韓国の40チームが参加し、3日間で約100本の公演が行われます。閉幕公演にはシン・スンフンが登場し、夜間の花火とドローンショーも実施されます。",
    "zh-CN": "海外街头艺术团队6组与韩国团队40组参加，为期三天举办约100场演出。闭幕演出由申胜勋登台，夜间还将同步呈现烟花与无人机秀。",
    "zh-TW": "海外街頭藝術團隊6組與韓國團隊40組參加，為期三天舉辦約100場演出。閉幕演出由申勝勳登台，夜間並同步呈現煙火與無人機秀。",
  },
  host: {
    ko: "주최 고양특례시 · 주관 고양문화재단",
    en: "Hosted by Goyang Special City · Organized by Goyang Cultural Foundation",
    ja: "主催 高陽特例市 · 主管 高陽文化財団",
    "zh-CN": "主办 高阳特例市 · 主管 高阳文化财团",
    "zh-TW": "主辦 高陽特例市 · 主管 高陽文化財團",
  },
  officialUrl: "https://www.gylaf.kr/",
  address: "경기도 고양시 일산동구 호수로 595",
  imageUrl: "/images/events/goyang-lake-arts-festival-2026.jpg",
  imageCredit: {
    ko: "이미지: 고양문화관광·MICE 연구소",
    en: "Image: Goyang Culture Tourism & MICE Institute",
    ja: "画像: 高陽文化観光・MICE研究所",
    "zh-CN": "图片: 高阳文化观光·MICE研究所",
    "zh-TW": "圖片: 高陽文化觀光·MICE研究所",
  },
  free: true,
  verified: true,
};

/**
 * 2026 Garmin Run Korea (오더 #P9-d [3]).
 * 사실 근거: discover.garmin.com/ko-KR/event/2026/garmin-run/ 공식 페이지.
 *   · 하프(21K)·10K 두 종목
 *   · 고양종합운동장 출발
 *   · 참가 신청은 공식 사이트, 현재 접수 마감 상태
 * ticketUrl 없음 — 우리는 판매하지 않음. type 은 3분류(공연·축제·전시)에
 * 스포츠가 없어 festival 로 편입 (분류 신설 없음).
 * 코스·시상·기념품 등 미확인 정보는 추가하지 않음.
 */
const garminRun2026: WhatsOnEvent = {
  id: "garmin-run-korea-2026",
  slug: "garmin-run-korea-2026",
  type: "festival",
  title: {
    ko: "2026 가민런 코리아",
    en: "Garmin Run Korea 2026",
    ja: "2026 ガーミンラン コリア",
    "zh-CN": "2026 佳明跑 韩国",
    "zh-TW": "2026 佳明跑 韓國",
  },
  venue: {
    ko: "고양종합운동장",
    en: "Goyang Stadium",
    ja: "高陽総合運動場",
    "zh-CN": "高阳综合运动场",
    "zh-TW": "高陽綜合運動場",
  },
  startDate: "2026-11-15",
  endDate: "2026-11-15",
  summary: {
    ko: "하프(21K)와 10K 두 종목으로 진행되며 오전 8시 고양종합운동장에서 출발합니다. 참가 신청은 공식 사이트에서 진행되며 현재 접수 마감 상태입니다.",
    en: "A running event with a half marathon (21K) and 10K, starting at 8:00 a.m. from Goyang Stadium. Registration is handled on the official site and is currently closed.",
    ja: "ハーフ(21K)と10Kの2種目で行われ、午前8時に高陽総合運動場からスタートします。参加申込は公式サイトで行われており、現在受付は終了しています。",
    "zh-CN": "分为半程马拉松（21K）和10K两个组别，上午8点从高阳综合运动场出发。报名通过官方网站进行，目前报名已截止。",
    "zh-TW": "分為半程馬拉松（21K）與10K兩個組別，上午8點從高陽綜合運動場出發。報名透過官方網站進行，目前報名已截止。",
  },
  host: replicate("Garmin Korea"),
  officialUrl: "https://discover.garmin.com/ko-KR/event/2026/garmin-run/",
  address: "경기도 고양시 일산서구 중앙로 1601",
  imageUrl: "/images/events/garmin-run-korea-2026.jpg",
  imageCredit: {
    ko: "이미지: 고양문화관광·MICE 연구소",
    en: "Image: Goyang Culture Tourism & MICE Institute",
    ja: "画像: 高陽文化観光・MICE研究所",
    "zh-CN": "图片: 高阳文化观光·MICE研究所",
    "zh-TW": "圖片: 高陽文化觀光·MICE研究所",
  },
  free: false,
  verified: true,
};

/**
 * 임영웅 콘서트 IM HERO — THE STADIUM 2 (오더 #P9-e [7-1]).
 * 근거: 포스터 확인 — 2026-09-04~06 · 고양종합운동장 · 오후 6:30 시작.
 * 예매처는 공식 예매처 안내로만. 셋리스트·게스트·좌석·가격 미기재
 * (판매 소구 0 · 확인된 사실만).
 */
const imHeroStadium2026: WhatsOnEvent = {
  id: "im-hero-the-stadium-2-2026",
  slug: "im-hero-the-stadium-2-2026",
  type: "performance",
  title: {
    ko: "임영웅 콘서트 IM HERO — THE STADIUM 2",
    en: "Lim Young-woong Concert: IM HERO — THE STADIUM 2",
    ja: "イム・ヨンウン コンサート IM HERO — THE STADIUM 2",
    "zh-CN": "林英雄演唱会 IM HERO — THE STADIUM 2",
    "zh-TW": "林英雄演唱會 IM HERO — THE STADIUM 2",
  },
  venue: {
    ko: "고양종합운동장",
    en: "Goyang Stadium",
    ja: "高陽総合運動場",
    "zh-CN": "高阳综合运动场",
    "zh-TW": "高陽綜合運動場",
  },
  startDate: "2026-09-04",
  endDate: "2026-09-06",
  summary: {
    ko: "고양종합운동장에서 사흘간 진행되는 스타디움 공연입니다. 공연 시작은 오후 6시 30분입니다. 예매는 공식 예매처에서 진행됩니다.",
    en: "A three-day stadium concert at Goyang Stadium. Performances start at 6:30 p.m. Ticketing is handled by the official channels.",
    ja: "高陽総合運動場で3日間行われるスタジアム公演です。開演は午後6時30分。チケットは公式販売元をご確認ください。",
    "zh-CN": "在高阳综合运动场连续三天举行的体育场演唱会。演出于下午6点30分开始。购票请前往官方售票渠道。",
    "zh-TW": "於高陽綜合運動場連續三天舉行的體育場演唱會。演出於下午6點30分開始。購票請前往官方售票渠道。",
  },
  host: {
    ko: "공식 예매처 안내",
    en: "See official ticketing",
    ja: "公式チケット販売元をご確認ください",
    "zh-CN": "详见官方售票处",
    "zh-TW": "詳見官方售票處",
  },
  address: "경기도 고양시 일산서구 중앙로 1601",
  imageUrl: "/images/events/im-hero-the-stadium-2-2026.jpg",
  imageCredit: {
    ko: "이미지: 고양문화관광·MICE 연구소",
    en: "Image: Goyang Culture Tourism & MICE Institute",
    ja: "画像: 高陽文化観光・MICE研究所",
    "zh-CN": "图片: 高阳文化观光·MICE研究所",
    "zh-TW": "圖片: 高陽文化觀光·MICE研究所",
  },
  free: false,
  verified: true,
};

/**
 * Charlie Puth — Whatever's Clever! World Tour in Goyang (오더 #P9-e [7-2]).
 * 근거: 포스터 확인 — 2026-10-11 · 고양종합운동장 · Live Nation 주관.
 * officialUrl·ticketUrl·imageUrl 없음. 아티스트 사진·포스터 사용 금지 —
 * fallback 이미지만 (고양종합운동장 → hero-kculture.jpg).
 */
const charliePuthGoyang2026: WhatsOnEvent = {
  id: "charlie-puth-goyang-2026",
  slug: "charlie-puth-goyang-2026",
  type: "performance",
  title: {
    ko: "찰리 푸스 내한공연 Whatever’s Clever! World Tour",
    en: "Charlie Puth — Whatever’s Clever! World Tour in Goyang",
    ja: "チャーリー・プース来韓公演 Whatever’s Clever! World Tour",
    "zh-CN": "查理·普斯访韩演唱会 Whatever’s Clever! World Tour",
    "zh-TW": "查理·普斯訪韓演唱會 Whatever’s Clever! World Tour",
  },
  venue: {
    ko: "고양종합운동장",
    en: "Goyang Stadium",
    ja: "高陽総合運動場",
    "zh-CN": "高阳综合运动场",
    "zh-TW": "高陽綜合運動場",
  },
  startDate: "2026-10-11",
  endDate: "2026-10-11",
  summary: {
    ko: "고양종합운동장에서 열리는 월드투어 내한 공연입니다. 예매는 공식 예매처에서 진행됩니다.",
    en: "A world-tour stop at Goyang Stadium. Ticketing is handled by the official channels.",
    ja: "高陽総合運動場で行われるワールドツアーの来韓公演です。チケットは公式販売元をご確認ください。",
    "zh-CN": "在高阳综合运动场举行的世界巡演访韩场。购票请前往官方售票渠道。",
    "zh-TW": "於高陽綜合運動場舉行的世界巡演訪韓場。購票請前往官方售票渠道。",
  },
  host: {
    ko: "주관 Live Nation",
    en: "Presented by Live Nation",
    ja: "主催 Live Nation",
    "zh-CN": "主办 Live Nation",
    "zh-TW": "主辦 Live Nation",
  },
  address: "경기도 고양시 일산서구 중앙로 1601",
  free: false,
  verified: true,
};

export const nativeWhatsOnEvents: WhatsOnEvent[] = [
  gsaf2026,
  garminRun2026,
  imHeroStadium2026,
  charliePuthGoyang2026,
];

// ─── ticket-booking.ts → WhatsOnEvent adapter ────────────────────────────────

const TICKET_TYPE_MAP: Record<TicketProduct["category"], WhatsOnEventType> = {
  concert: "performance",
  "k-pop": "performance",
  family: "performance",
  festival: "festival",
  exhibition: "exhibition",
};

function replicate(value: string): I18nText {
  return {
    ko: value,
    en: value,
    ja: value,
    "zh-CN": value,
    "zh-TW": value,
  };
}

function localizedVenue(t: TicketProduct): I18nText {
  const en = t.translations?.en?.venue ?? t.venue;
  const ja = (t.translations?.ja as { venue?: string } | undefined)?.venue ?? t.venue;
  const zhCN = (t.translations as Partial<Record<TicketLocale, { venue?: string }>>)?.["zh-CN"]?.venue ?? t.venue;
  const zhTW = (t.translations as Partial<Record<TicketLocale, { venue?: string }>>)?.["zh-TW"]?.venue ?? t.venue;
  return { ko: t.venue, en, ja, "zh-CN": zhCN, "zh-TW": zhTW };
}

/** dateText "2026.05.14 - 2026.05.16" 또는 "2026.09.12" 에서 시작일 파싱. 실패 시 endDate. */
function parseStartDate(dateText: string, fallback: string): string {
  const match = dateText.match(/(\d{4})[.\-/](\d{1,2})[.\-/](\d{1,2})/);
  if (!match) return fallback;
  const [, y, m, d] = match;
  return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
}

function ticketToEvent(t: TicketProduct): WhatsOnEvent {
  const type = TICKET_TYPE_MAP[t.category];
  const endDate = t.endDate ?? "";
  return {
    id: t.id,
    slug: t.id,
    type,
    title: replicate(t.title),
    venue: localizedVenue(t),
    startDate: parseStartDate(t.dateText, endDate),
    endDate,
    summary: replicate(t.summary),
    // 결제는 티켓 상세 route 에만 존재 (오더 #P9 유지) — 어댑터 티켓의 CTA 도
    // 그 결제 진입점 URL 로 라우팅.
    ticketUrl: `/products/ticket-agency-platform/reservation?ticket=${t.id}`,
    imageUrl: t.imageUrl,
    // 오더 #P9-i [2]: WhatsOnEvent.imageCredit 은 I18nText. 어댑터 티켓의
    // credit 은 문자열 하나뿐이라 5로케일 동일값으로 확장. 어댑터 이벤트는
    // 전부 verified=false 라 현재 렌더되지 않음 — 타입 정합성만 유지.
    imageCredit: t.credit ? replicate(t.credit) : undefined,
    free: false,
    // 오더 #P9-d: TicketProduct.verified 를 그대로 승계. 시드 8건은 미설정 →
    // false 로 정규화되어 비노출.
    verified: t.verified === true,
  };
}

// ─── combined view ───────────────────────────────────────────────────────────

/** 네이티브 + 어댑터 티켓 이벤트를 합친 전체 목록 (verified 무관). */
export function getAllWhatsOnEvents(): WhatsOnEvent[] {
  return [...nativeWhatsOnEvents, ...ticketProducts.map(ticketToEvent)];
}

/**
 * 사용자 노출 대상만 (오더 #P9-d [2]).
 * 홈 WhatsOnSection · 상세 라우트 · generateStaticParams 는 이 함수를 사용.
 * verified === false 인 시드 항목은 여기서 걸러진다.
 */
export function getVisibleWhatsOnEvents(): WhatsOnEvent[] {
  return getAllWhatsOnEvents().filter((e) => e.verified === true);
}

/** verified 항목만 매칭. 미검증 slug 로 접근 시 null 반환 → 페이지에서 notFound(). */
export function getWhatsOnEvent(type: string, slug: string): WhatsOnEvent | null {
  const list = getVisibleWhatsOnEvents();
  const match = list.find((e) => e.slug === slug && e.type === type);
  return match ?? null;
}

/** endDate 오늘 이전이면 지난 이벤트. 값 없으면 상시 노출 취급. */
export function isCurrentOrUpcoming(e: WhatsOnEvent): boolean {
  if (!e.endDate) return true;
  const end = Date.parse(e.endDate);
  if (Number.isNaN(end)) return true;
  const now = new Date();
  const todayZero = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  return end >= todayZero;
}

// ─── image fallback (오더 #P9-c) ────────────────────────────────────────────
//
// 원칙: 캡션은 venue 가 아니라 "실제 사용된 이미지의 피사체" 를 표기한다.
// 이전 코드는 이미지와 캡션을 서로 다른 근거(카테고리 vs venue)로 생성해,
// 프로덕션에 사진·캡션 불일치가 노출되었다 (예: hero-history.jpg=서오릉
// 사진에 "사진: 고양종합운동장" 캡션).
//
// 이제:
//   1. FALLBACK_SUBJECT — 이미지 파일별 피사체 라벨 (5로케일).
//      캡션은 반드시 이 라벨을 사용한다.
//   2. pickFallbackKind — venue.ko 를 명시 키워드 표로 매핑. 어느 키워드
//      에도 걸리지 않으면 walk (일산호수공원) 를 기본값.
//   3. imageUrl 이 실제로 설정된 항목은 credit 을 그대로 쓰고, 이 fallback
//      캡션은 적용하지 않는다.

/** hero-{kind}.jpg 파일 basename 과 동일. */
type FallbackKind = "walk" | "food" | "culture" | "kculture" | "history" | "family";

const FALLBACK_SRC: Record<FallbackKind, string> = {
  walk: "/images/hero/hero-walk.jpg",
  food: "/images/hero/hero-food.jpg",
  culture: "/images/hero/hero-culture.jpg",
  kculture: "/images/hero/hero-kculture.jpg",
  history: "/images/hero/hero-history.jpg",
  family: "/images/hero/hero-family.jpg",
};

/** 이미지 파일별 피사체 라벨 (오더 #P9-c [1]). */
const FALLBACK_SUBJECT: Record<FallbackKind, I18nText> = {
  walk: {
    ko: "일산호수공원",
    en: "Ilsan Lake Park",
    ja: "一山湖水公園",
    "zh-CN": "一山湖水公园",
    "zh-TW": "一山湖水公園",
  },
  // 오더 #P9-f [1]: 실물이 특정 식당 실내라 "라페스타"(야외 쇼핑스트리트)와
  // 불일치. 특정 업체 지목 없는 카테고리형 라벨로 전환.
  food: {
    ko: "고양 미식",
    en: "Goyang Dining",
    ja: "高陽グルメ",
    "zh-CN": "高阳美食",
    "zh-TW": "高陽美食",
  },
  culture: {
    ko: "고양아람누리",
    en: "Goyang Aram Nuri",
    ja: "高陽アラムヌリ",
    "zh-CN": "高阳阿蓝努里",
    "zh-TW": "高陽阿藍努里",
  },
  // 오더 #P9-e [6-2]: 실물 확인 결과 hero-kculture.jpg 은 옥외 스타디움
  // 야간 공연 사진 (KINTEX 실내 컨벤션 아님). 캡션을 실제 피사체(고양종합
  // 운동장)로 교정. 이로써 종합운동장 keyword → kculture → hero-kculture.jpg
  // → "사진: 고양종합운동장" 이 사진·캡션·venue 모두 일치.
  kculture: {
    ko: "고양종합운동장",
    en: "Goyang Stadium",
    ja: "高陽総合運動場",
    "zh-CN": "高阳综合运动场",
    "zh-TW": "高陽綜合運動場",
  },
  history: {
    ko: "서오릉",
    en: "Seooreung Royal Tombs",
    ja: "西五陵",
    "zh-CN": "西五陵",
    "zh-TW": "西五陵",
  },
  family: {
    ko: "스타필드 고양",
    en: "Starfield Goyang",
    ja: "スターフィールド高陽",
    "zh-CN": "星光广场 高阳",
    "zh-TW": "星光廣場 高陽",
  },
};

const PHOTO_PREFIX: I18nText = {
  ko: "사진",
  en: "Photo",
  ja: "写真",
  "zh-CN": "照片",
  "zh-TW": "照片",
};

/**
 * venue.ko 기준 명시 키워드 매핑 (오더 #P9-c [2] · 보강 [1]).
 * 위에서부터 순차 매치 — 표 밖의 매치는 만들지 않는다.
 * 어느 키워드에도 걸리지 않으면 walk (기본값).
 *
 * 카테고리 카탈로그와 실제 venue 문자열 간극을 좁히기 위해 어울림누리·
 * 종합운동장·K-POP 아레나·문화광장 등을 실제 사진 자산이 있는 이미지에
 * 명시 매핑. 캡션은 여전히 이미지 피사체 기준(카테고리 카탈로그 아님).
 */
function pickFallbackKind(e: WhatsOnEvent): FallbackKind {
  const venueKo = e.venue.ko;
  // 오더 #P9-f [2]: KINTEX 매핑 제거. hero-kculture.jpg 가 이제
  // 고양종합운동장 사진(P9-f [6-2])이라 KINTEX venue → kculture 는
  // 사진·캡션·venue 3자 불일치가 재발한다. KINTEX 전용 사진 확보 시 재도입.
  if (/K-?POP\s*아레나|아레나/i.test(venueKo)) return "kculture";
  if (/아람누리|꽃누리/.test(venueKo)) return "culture";
  if (/어울림누리/.test(venueKo)) return "culture";
  if (/종합운동장|스타디움/.test(venueKo)) return "kculture";
  if (/문화광장|라페스타|웨스턴돔/.test(venueKo)) return "food";
  if (/호수공원/.test(venueKo)) return "walk";
  if (/서오릉|서삼릉|행주산성/.test(venueKo)) return "history";
  if (/스타필드|원마운트/.test(venueKo)) return "family";
  return "walk";
}

/**
 * 실사진 카드 크롭 위치 (오더 #P9-f [3-3]).
 * 원본이 가로형(≈16:9)이라 카드 aspect-[4/3] 에서 좌우 크롭이 발생 —
 * 슬러그별로 어느 쪽을 살릴지 지정한다. 상세 페이지는 원본 비율 유지(크롭 최소).
 */
const CARD_OBJECT_POSITION: Record<string, string> = {
  "garmin-run-korea-2026": "center right",
  "goyang-lake-arts-festival-2026": "center",
  "im-hero-the-stadium-2-2026": "center",
};

export type ResolvedEventImage = {
  src: string;
  isFallback: boolean;
  /**
   * fallback 이면 "사진: {피사체}" (이미지 기준),
   * imageUrl 실사진 + credit 있으면 "© {credit}",
   * 그 외 null.
   */
  captionText: (locale: WhatsOnLocale) => string | null;
  /** 카드용 object-position CSS 값. 미지정 시 undefined 반환. */
  cardObjectPosition?: string;
};

export function resolveEventImage(e: WhatsOnEvent): ResolvedEventImage {
  if (e.imageUrl) {
    // 오더 #P9-i [2]: imageCredit 이 I18nText 로 확장. 로케일별 크레딧 반환.
    const credit = e.imageCredit;
    return {
      src: e.imageUrl,
      isFallback: false,
      captionText: (locale) => {
        const value = credit?.[locale]?.trim();
        return value ? `© ${value}` : null;
      },
      cardObjectPosition: CARD_OBJECT_POSITION[e.slug],
    };
  }
  const kind = pickFallbackKind(e);
  const src = FALLBACK_SRC[kind];
  return {
    src,
    isFallback: true,
    captionText: (locale) =>
      `${PHOTO_PREFIX[locale]}: ${FALLBACK_SUBJECT[kind][locale]}`,
  };
}
