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
  /** 실사진에 대한 © 크레딧. imageUrl 있을 때만 의미. */
  imageCredit?: string;
  /** 주최·주관. 어댑터 이벤트는 미지정될 수 있음. */
  host?: I18nText;
  free: boolean;
}

// ─── native events ────────────────────────────────────────────────────────────

/**
 * GSAF — 고양호수예술축제 2026 (오더 #P9-b [2]).
 * 사실 근거: gylaf.kr 공식 사이트에 공개된 항목만 기재.
 *   · 주제: "예술, 거리에서 놀다 — Rhythm of the Street"
 *   · 거리예술 공연 100여 회
 *   · 일산호수공원 일원, 사흘간 진행
 *   · 주최 고양시 · 주관 고양문화재단, 무료 관람
 * 프로그램 세부·출연진 등 미확인 정보는 추가하지 않음.
 */
const gsaf2026: WhatsOnEvent = {
  id: "goyang-lake-arts-festival-2026",
  slug: "goyang-lake-arts-festival-2026",
  type: "festival",
  title: {
    ko: "2026 고양호수예술축제",
    en: "Goyang Lake Park Arts Festival 2026",
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
    ko: "‘예술, 거리에서 놀다 — Rhythm of the Street’를 주제로 한 거리예술 축제입니다. 일산호수공원 일원에서 사흘간 열리며, 거리예술 공연이 100여 회 진행됩니다.",
    en: "A street arts festival under the theme ‘Art at Play on the Street — Rhythm of the Street’. Held over three days across Ilsan Lake Park, the festival features around 100 street arts performances.",
    ja: "テーマ「芸術、街で遊ぶ — Rhythm of the Street」の下で開催される街頭芸術祭。一山湖水公園一帯で3日間開かれ、約100本の街頭芸術公演が行われます。",
    "zh-CN": "以“艺术，在街头玩耍 — Rhythm of the Street”为主题的街头艺术节。在一山湖水公园一带持续三天，共举办约100场街头艺术表演。",
    "zh-TW": "以「藝術，在街頭玩耍 — Rhythm of the Street」為主題的街頭藝術節。於一山湖水公園一帶連續三天舉行，共有約100場街頭藝術演出。",
  },
  host: {
    ko: "주최 고양시 · 주관 고양문화재단",
    en: "Hosted by Goyang City · Organized by Goyang Cultural Foundation",
    ja: "主催 高陽市 · 主管 高陽文化財団",
    "zh-CN": "主办 高阳市 · 主管 高阳文化财团",
    "zh-TW": "主辦 高陽市 · 主管 高陽文化財團",
  },
  officialUrl: "https://www.gylaf.kr/",
  free: true,
};

export const nativeWhatsOnEvents: WhatsOnEvent[] = [gsaf2026];

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
    imageCredit: t.credit,
    free: false,
  };
}

// ─── combined view ───────────────────────────────────────────────────────────

/** 네이티브 + 어댑터 티켓 이벤트를 합친 전체 목록. */
export function getAllWhatsOnEvents(): WhatsOnEvent[] {
  return [...nativeWhatsOnEvents, ...ticketProducts.map(ticketToEvent)];
}

export function getWhatsOnEvent(type: string, slug: string): WhatsOnEvent | null {
  const list = getAllWhatsOnEvents();
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

// ─── image fallback ──────────────────────────────────────────────────────────

/**
 * public/images/ 하위 실파일 fallback.
 * 외부 이미지 직접 링크 금지 (저작권). fallback 사용 시 카드/상세에
 * "사진: {장소}" 캡션 표기 (행사 사진으로 오인 방지).
 */
type FallbackKind = "lake-park" | "kintex" | "aramnuri" | "eoullim" | "stadium" | "goyang-city";

const FALLBACK_SRC: Record<FallbackKind, string> = {
  "lake-park": "/images/hero/hero-walk.jpg",
  kintex: "/images/hero/hero-kculture.jpg",
  aramnuri: "/images/hero/hero-culture.jpg",
  eoullim: "/images/hero/hero-family.jpg",
  stadium: "/images/hero/hero-history.jpg",
  "goyang-city": "/images/hero/hero-food.jpg",
};

const FALLBACK_LOCATION_LABEL: Record<FallbackKind, I18nText> = {
  "lake-park": {
    ko: "일산호수공원",
    en: "Ilsan Lake Park",
    ja: "一山湖水公園",
    "zh-CN": "一山湖水公园",
    "zh-TW": "一山湖水公園",
  },
  kintex: replicate("KINTEX"),
  aramnuri: {
    ko: "고양아람누리",
    en: "Goyang Aramnuri",
    ja: "高陽アラムヌリ",
    "zh-CN": "高阳阿蓝努里",
    "zh-TW": "高陽阿藍努里",
  },
  eoullim: {
    ko: "고양어울림누리",
    en: "Goyang Eoullim Nuri",
    ja: "高陽オウルリムヌリ",
    "zh-CN": "高阳欧拉利姆努里",
    "zh-TW": "高陽歐拉利姆努里",
  },
  stadium: {
    ko: "고양종합운동장",
    en: "Goyang Sports Complex",
    ja: "高陽総合運動場",
    "zh-CN": "高阳综合运动场",
    "zh-TW": "高陽綜合運動場",
  },
  "goyang-city": {
    ko: "고양시",
    en: "Goyang City",
    ja: "高陽市",
    "zh-CN": "高阳市",
    "zh-TW": "高陽市",
  },
};

const PHOTO_PREFIX: I18nText = {
  ko: "사진",
  en: "Photo",
  ja: "写真",
  "zh-CN": "照片",
  "zh-TW": "照片",
};

function pickFallbackKind(e: WhatsOnEvent): FallbackKind {
  const venueKo = e.venue.ko;
  if (/호수공원|Lake Park/i.test(venueKo)) return "lake-park";
  if (/KINTEX|아레나|K-?POP/i.test(venueKo)) return "kintex";
  if (/아람누리/.test(venueKo)) return "aramnuri";
  if (/어울림/.test(venueKo)) return "eoullim";
  if (/종합운동장|Stadium/i.test(venueKo)) return "stadium";
  if (/문화광장/.test(venueKo)) return "goyang-city";
  // 최종 폴백은 type 기준.
  if (e.type === "performance") return "kintex";
  if (e.type === "festival") return "lake-park";
  return "aramnuri";
}

export type ResolvedEventImage = {
  src: string;
  isFallback: boolean;
  /** true 이면 "사진: {장소}", false 이고 credit 있으면 "© {credit}", 그 외 null. */
  captionText: (locale: WhatsOnLocale) => string | null;
};

export function resolveEventImage(e: WhatsOnEvent): ResolvedEventImage {
  if (e.imageUrl) {
    const credit = e.imageCredit?.trim();
    return {
      src: e.imageUrl,
      isFallback: false,
      captionText: () => (credit ? `© ${credit}` : null),
    };
  }
  const kind = pickFallbackKind(e);
  const src = FALLBACK_SRC[kind];
  return {
    src,
    isFallback: true,
    captionText: (locale) =>
      `${PHOTO_PREFIX[locale]}: ${FALLBACK_LOCATION_LABEL[kind][locale]}`,
  };
}
