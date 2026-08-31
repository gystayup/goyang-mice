import type { Metadata } from "next";

import Shell from "@/components/layout/Shell";
import SectionedBookingGrid, { type UnifiedItem } from "@/components/products/SectionedBookingGrid";
import type { ServiceCatalogCategory } from "@/data/service-catalog";
import { readServiceCatalog } from "@/lib/service-catalog-db";
import { getLocalizedServiceItem } from "@/lib/service-catalog-i18n";
import { readTicketCatalog } from "@/lib/ticket-catalog-db";

// 티켓 장소명 번역 맵 — DB/static 무관하게 ID로 직접 적용
type TLocale = "en" | "ja" | "zh-CN" | "zh-TW";
const TICKET_VENUE: Record<string, Partial<Record<TLocale, string>>> = {
  "goyang-kpop-arena-open":   { en: "Goyang K-POP Arena", ja: "高陽K-POPアリーナ", "zh-CN": "高阳K-POP竞技场", "zh-TW": "高陽K-POP競技場" },
  "goyang-con-city-festival": { en: "Ilsan Cultural Plaza", ja: "一山文化広場", "zh-CN": "一山文化广场", "zh-TW": "一山文化廣場" },
  "goyang-art-night":         { en: "Goyang Aramnuri Exhibition Hall", ja: "高陽アラムヌリ展示館", "zh-CN": "高阳阿拉木努里展览馆", "zh-TW": "高陽阿拉木努里展覽館" },
  "goyang-family-play":       { en: "Goyang Eoullim Nuri", ja: "高陽オウルリムヌリ", "zh-CN": "高阳欧拉利姆努里", "zh-TW": "高陽歐拉利姆努里" },
  "goyang-kmusic-series":     { en: "Goyang Aramnuri Aram Theater", ja: "高陽アラムヌリ アラム劇場", "zh-CN": "高阳阿拉木努里剧场", "zh-TW": "高陽阿拉木努里劇場" },
  "goyang-mice-opening-show": { en: "KINTEX Outdoor Stage", ja: "KINTEX野外ステージ", "zh-CN": "KINTEX户外舞台", "zh-TW": "KINTEX戶外舞台" },
  "goyang-local-stage":       { en: "Ilsan Lake Park Outdoor Stage", ja: "一山湖水公園野外ステージ", "zh-CN": "一山湖水公园户外舞台", "zh-TW": "一山湖水公園戶外舞台" },
  "goyang-night-run-ticket":  { en: "Goyang Stadium", ja: "高陽総合運動場", "zh-CN": "高阳综合运动场", "zh-TW": "高陽綜合運動場" },
};
const TICKET_BADGE: Record<string, Partial<Record<TLocale, string>>> = {
  "goyang-kpop-arena-open":   { en: "Coming Soon", ja: "近日オープン", "zh-CN": "即将开放", "zh-TW": "即將開放" },
  "goyang-con-city-festival": { en: "2nd Ticket Sale", ja: "第2次チケット販売", "zh-CN": "第二轮票务开放", "zh-TW": "第二輪票務開放" },
  "goyang-art-night":         { en: "Extra Seats Available", ja: "追加席販売中", "zh-CN": "增开座位", "zh-TW": "增開座位" },
  "goyang-family-play":       { en: "Family Pick", ja: "ファミリー向け", "zh-CN": "家庭推荐", "zh-TW": "家庭推薦" },
  "goyang-kmusic-series":     { en: "Limited Offer", ja: "限定特価", "zh-CN": "限时特惠", "zh-TW": "限時特惠" },
  "goyang-mice-opening-show": { en: "Coming Soon", ja: "近日オープン", "zh-CN": "即将开放", "zh-TW": "即將開放" },
  "goyang-local-stage":       { en: "On Sale Now", ja: "本日オープン", "zh-CN": "今日开售", "zh-TW": "今日開售" },
  "goyang-night-run-ticket":  { en: "Tickets Available", ja: "チケット販売中", "zh-CN": "票务开放", "zh-TW": "票務開放" },
};
const TICKET_TAGS: Record<string, Partial<Record<TLocale, string[]>>> = {
  "goyang-kpop-arena-open": {
    en: ["K-POP", "Concert", "Premium Seats"],
    ja: ["K-POP", "公演", "プレミアム席"],
    "zh-CN": ["K-POP", "演出", "高级座位"],
    "zh-TW": ["K-POP", "演出", "高級座位"],
  },
  "goyang-con-city-festival": {
    en: ["Festival", "Outdoor Concert", "Food Zone"],
    ja: ["フェスティバル", "野外公演", "フードゾーン"],
    "zh-CN": ["音乐节", "户外演出", "美食区"],
    "zh-TW": ["音樂節", "戶外演出", "美食區"],
  },
  "goyang-art-night": {
    en: ["Exhibition", "Night", "Media Art"],
    ja: ["展示", "夜間", "メディアアート"],
    "zh-CN": ["展览", "夜间", "媒体艺术"],
    "zh-TW": ["展覽", "夜間", "媒體藝術"],
  },
  "goyang-family-play": {
    en: ["Family", "Experience Show", "Weekend Program"],
    ja: ["ファミリー", "体験公演", "週末プログラム"],
    "zh-CN": ["家庭", "体验演出", "周末活动"],
    "zh-TW": ["家庭", "體驗演出", "週末活動"],
  },
  "goyang-kmusic-series": {
    en: ["Concert", "Band", "Indoor Show"],
    ja: ["コンサート", "バンド", "室内公演"],
    "zh-CN": ["音乐会", "乐队", "室内演出"],
    "zh-TW": ["音樂會", "樂隊", "室內演出"],
  },
  "goyang-mice-opening-show": {
    en: ["MICE", "VIP", "Special Stage"],
    ja: ["MICE", "VIP", "スペシャルステージ"],
    "zh-CN": ["MICE", "VIP", "特别舞台"],
    "zh-TW": ["MICE", "VIP", "特別舞台"],
  },
  "goyang-local-stage": {
    en: ["Local", "Outdoor Stage", "Flea Market"],
    ja: ["ローカル", "野外ステージ", "フリーマーケット"],
    "zh-CN": ["本地", "户外舞台", "跳蚤市场"],
    "zh-TW": ["本地", "戶外舞台", "跳蚤市場"],
  },
  "goyang-night-run-ticket": {
    en: ["Sports", "Night Event", "Package Ticket"],
    ja: ["スポーツ", "夜間イベント", "パッケージチケット"],
    "zh-CN": ["体育", "夜间活动", "套票"],
    "zh-TW": ["體育", "夜間活動", "套票"],
  },
};
// 관리자에서 새 티켓 생성 시 ID가 `ticket-${Date.now()}` 형식이라 고정 ID 매칭 실패.
// 따라서 title(영문 고정값) 기반으로도 매칭할 수 있도록 보조 맵을 둠.
const TITLE_TO_KEY: Record<string, string> = {
  "GOYANG K-POP ARENA OPEN STAGE": "goyang-kpop-arena-open",
  "GOYANG CON CITY FESTIVAL": "goyang-con-city-festival",
  "GOYANG ART NIGHT EXHIBITION": "goyang-art-night",
  "GOYANG FAMILY PLAY WEEK": "goyang-family-play",
  "GOYANG K-MUSIC SERIES": "goyang-kmusic-series",
  "GOYANG MICE OPENING SHOW": "goyang-mice-opening-show",
  "GOYANG LOCAL STAGE": "goyang-local-stage",
  "GOYANG NIGHT RUN & SHOW": "goyang-night-run-ticket",
};
// 티켓 제목 번역 맵
const TICKET_TITLE: Record<string, Partial<Record<TLocale, string>>> = {
  "goyang-kpop-arena-open": {
    en: "GOYANG K-POP ARENA OPEN STAGE",
    ja: "高陽K-POPアリーナ オープンステージ",
    "zh-CN": "高阳K-POP竞技场开幕演出",
    "zh-TW": "高陽K-POP競技場開幕演出",
  },
  "goyang-con-city-festival": {
    en: "GOYANG CON CITY FESTIVAL",
    ja: "高陽コンシティフェスティバル",
    "zh-CN": "高阳Con城市音乐节",
    "zh-TW": "高陽Con城市音樂節",
  },
  "goyang-art-night": {
    en: "GOYANG ART NIGHT EXHIBITION",
    ja: "高陽アートナイト展示",
    "zh-CN": "高阳艺术之夜展览",
    "zh-TW": "高陽藝術之夜展覽",
  },
  "goyang-family-play": {
    en: "GOYANG FAMILY PLAY WEEK",
    ja: "高陽ファミリープレイウィーク",
    "zh-CN": "高阳家庭游玩周",
    "zh-TW": "高陽家庭遊玩週",
  },
  "goyang-kmusic-series": {
    en: "GOYANG K-MUSIC SERIES",
    ja: "高陽K-ミュージックシリーズ",
    "zh-CN": "高阳K-音乐系列",
    "zh-TW": "高陽K-音樂系列",
  },
  "goyang-mice-opening-show": {
    en: "GOYANG MICE OPENING SHOW",
    ja: "高陽MICE オープニングショー",
    "zh-CN": "高阳MICE开幕演出",
    "zh-TW": "高陽MICE開幕演出",
  },
  "goyang-local-stage": {
    en: "GOYANG LOCAL STAGE",
    ja: "高陽ローカルステージ",
    "zh-CN": "高阳本地舞台",
    "zh-TW": "高陽本地舞台",
  },
  "goyang-night-run-ticket": {
    en: "GOYANG NIGHT RUN & SHOW",
    ja: "高陽ナイトラン&ショー",
    "zh-CN": "高阳夜跑&演出",
    "zh-TW": "高陽夜跑&演出",
  },
};
// 공항픽업 제목 번역 맵 — DB의 영문/한글 title 모두 매칭 가능
const AIRPORT_TITLE_MAP: Record<string, Partial<Record<TLocale, string>>> = {
  "pickup from Incheon Airport": {
    en: "Incheon Airport Pickup",
    ja: "仁川空港ピックアップ",
    "zh-CN": "仁川机场接送",
    "zh-TW": "仁川機場接送",
  },
  "Gimpo airport pickup services": {
    en: "Gimpo Airport Pickup Services",
    ja: "金浦空港送迎サービス",
    "zh-CN": "金浦机场接送服务",
    "zh-TW": "金浦機場接送服務",
  },
  "인천공항 픽업·샌드오프": {
    en: "Incheon Airport Pickup & Sendoff",
    ja: "仁川空港 ピックアップ＆送迎",
    "zh-CN": "仁川机场 接送服务",
    "zh-TW": "仁川機場 接送服務",
  },
  "김포공항 픽업·샌드오프": {
    en: "Gimpo Airport Pickup & Sendoff",
    ja: "金浦空港 ピックアップ＆送迎",
    "zh-CN": "金浦机场 接送服务",
    "zh-TW": "金浦機場 接送服務",
  },
};
// 공항픽업 venue(location) 번역 맵 — DB/static 한국어·영문 모두 매칭
const AIRPORT_VENUE_MAP: Record<string, Partial<Record<TLocale, string>>> = {
  "인천공항 터미널 1.2": {
    en: "Incheon Int'l Airport T1·T2",
    ja: "仁川国際空港 T1·T2",
    "zh-CN": "仁川国际机场 T1·T2",
    "zh-TW": "仁川國際機場 T1·T2",
  },
  "김포공항에서 고양시로": {
    en: "Gimpo Airport → Goyang",
    ja: "金浦空港から高陽市へ",
    "zh-CN": "金浦机场 → 高阳市",
    "zh-TW": "金浦機場 → 高陽市",
  },
  "인천국제공항 T1·T2": {
    en: "Incheon Int'l Airport T1·T2",
    ja: "仁川国際空港 T1·T2",
    "zh-CN": "仁川国际机场 T1·T2",
    "zh-TW": "仁川國際機場 T1·T2",
  },
  "김포국제공항": {
    en: "Gimpo International Airport",
    ja: "金浦国際空港",
    "zh-CN": "金浦国际机场",
    "zh-TW": "金浦國際機場",
  },
};
// 공항픽업 dateText 번역 맵
const AIRPORT_DATE_MAP: Record<string, Partial<Record<TLocale, string>>> = {
  "매일": {
    en: "Daily",
    ja: "毎日",
    "zh-CN": "每天",
    "zh-TW": "每天",
  },
  "365일 · 24시간": {
    en: "365 days · 24h",
    ja: "365日・24時間",
    "zh-CN": "全年无休 · 24小时",
    "zh-TW": "全年無休 · 24小時",
  },
  "365일 · 06:00-24:00": {
    en: "365 days · 06:00-24:00",
    ja: "365日・06:00-24:00",
    "zh-CN": "全年无休 · 06:00-24:00",
    "zh-TW": "全年無休 · 06:00-24:00",
  },
};
function resolveTicketKey(ticket: { id: string; title: string }): string {
  // ID가 하드코딩 맵에 있으면 그대로 사용
  if (TICKET_VENUE[ticket.id]) return ticket.id;
  // 아니면 title로 매칭 시도
  const normTitle = ticket.title?.trim().toUpperCase() ?? "";
  return TITLE_TO_KEY[normTitle] ?? ticket.id;
}

export type PageLocale = "ko" | "en" | "ja" | "zh-CN" | "zh-TW";

// 관리자에서 상품/이미지 업데이트 시 즉시 반영되도록 캐시 비활성화
export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "서비스 안내",
  description:
    "고양의 문화·여가·MICE 서비스를 한 곳에서 안내해 드립니다.",
  alternates: { canonical: "/ko/products" },
};

// 카테고리 → 예약 페이지 product ID 매핑
const CATEGORY_PRODUCT_IDS: Record<ServiceCatalogCategory, string> = {
  tour: "tour-experience-platform",
  stay: "stay-reservation-platform",
  restaurant: "restaurant-booking-platform",
  cafe: "cafe-booking-platform",
  airport: "airport-pickup-platform",
  medical: "medical-treatment-platform",
};

const CATEGORY_LABELS_MAP: Record<
  PageLocale,
  Record<ServiceCatalogCategory | "ticket" | "medical", string>
> = {
  ko: {
    tour: "투어",
    stay: "숙박",
    restaurant: "음식점",
    cafe: "라이프스타일",
    ticket: "티켓",
    airport: "공항픽업",
    medical: "메디컬",
  },
  en: {
    tour: "Tour",
    stay: "Stay",
    restaurant: "Dining",
    cafe: "Lifestyle",
    ticket: "Ticket",
    airport: "Airport",
    medical: "Medical",
  },
  ja: {
    tour: "ツアー",
    stay: "宿泊",
    restaurant: "飲食",
    cafe: "ライフスタイル",
    ticket: "チケット",
    airport: "空港送迎",
    medical: "メディカル",
  },
  "zh-CN": {
    tour: "旅游",
    stay: "住宿",
    restaurant: "餐厅",
    cafe: "生活方式",
    ticket: "票务",
    airport: "机场接送",
    medical: "医疗",
  },
  "zh-TW": {
    tour: "旅遊",
    stay: "住宿",
    restaurant: "餐廳",
    cafe: "生活風格",
    ticket: "票務",
    airport: "機場接送",
    medical: "醫療",
  },
};

// 메디컬 카드 정적 데이터 (DB 없이 카탈로그에 바로 렌더)
type MedicalStatic = {
  id: string;
  productId: "medical-treatment-platform" | "medical-beauty-platform" | "medical-recovery-platform";
  imageTone: string;
  posterLabel: string;
  titles: Record<PageLocale, string>;
  venues: Record<PageLocale, string>;
  dates: Record<PageLocale, string>;
  tags: Record<PageLocale, string[]>;
  /**
   * 실 계약 여부 (오더 #H1). 미지정=false=미검증 취급. 렌더에서 걸러짐.
   * 데이터 삭제 없이 플래그로만 숨긴다.
   */
  verified?: boolean;
};

const MEDICAL_STATIC_ITEMS: MedicalStatic[] = [
  {
    id: "medical-treatment",
    productId: "medical-treatment-platform",
    imageTone: "from-[#e9f1ff] via-[#ffffff] to-[#f2f7ff]",
    posterLabel: "TREATMENT",
    titles: {
      ko: "질병치료형 예약",
      en: "Treatment-Focused Medical Booking",
      ja: "疾病治療型予約",
      "zh-CN": "疾病治疗型预约",
      "zh-TW": "疾病治療型預約",
    },
    venues: {
      ko: "고양 의료·치료 네트워크",
      en: "Goyang Treatment Network",
      ja: "高陽 医療・治療ネットワーク",
      "zh-CN": "高阳医疗·治疗网络",
      "zh-TW": "高陽醫療·治療網絡",
    },
    dates: {
      ko: "연중 · 예약 상담",
      en: "Year-round · By consultation",
      ja: "通年・要予約相談",
      "zh-CN": "全年·预约咨询",
      "zh-TW": "全年·預約諮詢",
    },
    tags: {
      ko: ["암·중증질환", "여성질환", "정밀치료"],
      en: ["Cancer & Severe", "Women's Health", "Precision Care"],
      ja: ["がん・重症", "女性疾患", "精密治療"],
      "zh-CN": ["癌症·重症", "女性疾病", "精密治疗"],
      "zh-TW": ["癌症·重症", "女性疾病", "精密治療"],
    },
  },
  {
    id: "medical-beauty",
    productId: "medical-beauty-platform",
    imageTone: "from-[#f2f7ff] via-[#fff5f5] to-[#fff0ea]",
    posterLabel: "K-BEAUTY",
    titles: {
      ko: "건강미용 증진형 예약",
      en: "Health & Beauty Booking",
      ja: "健康美容増進型予約",
      "zh-CN": "健康美容增进型预约",
      "zh-TW": "健康美容增進型預約",
    },
    venues: {
      ko: "고양 K-뷰티·웰니스 파트너",
      en: "Goyang K-Beauty & Wellness Partners",
      ja: "高陽 K-ビューティー&ウェルネス",
      "zh-CN": "高阳 K-美容&健康伙伴",
      "zh-TW": "高陽 K-美容&健康夥伴",
    },
    dates: {
      ko: "연중 · 예약 상담",
      en: "Year-round · By consultation",
      ja: "通年・要予約相談",
      "zh-CN": "全年·预约咨询",
      "zh-TW": "全年·預約諮詢",
    },
    tags: {
      ko: ["성형", "피부", "웰니스"],
      en: ["Plastic Surgery", "Dermatology", "Wellness"],
      ja: ["美容整形", "皮膚科", "ウェルネス"],
      "zh-CN": ["整形", "皮肤", "健康管理"],
      "zh-TW": ["整形", "皮膚", "健康管理"],
    },
  },
  {
    id: "medical-recovery",
    productId: "medical-recovery-platform",
    imageTone: "from-[#eef7ff] via-[#f5f9ff] to-[#e6f0ff]",
    posterLabel: "RECOVERY",
    titles: {
      ko: "회복·재활 예약",
      en: "Recovery & Rehabilitation Booking",
      ja: "回復・リハビリ予約",
      "zh-CN": "恢复·康复预约",
      "zh-TW": "恢復·復健預約",
    },
    venues: {
      ko: "고양 회복·재활 케어 네트워크",
      en: "Goyang Recovery & Rehab Care",
      ja: "高陽 回復・リハビリケア",
      "zh-CN": "高阳恢复·康复护理网络",
      "zh-TW": "高陽恢復·復健護理網絡",
    },
    dates: {
      ko: "연중 · 예약 상담",
      en: "Year-round · By consultation",
      ja: "通年・要予約相談",
      "zh-CN": "全年·预约咨询",
      "zh-TW": "全年·預約諮詢",
    },
    tags: {
      ko: ["회복체류", "재활", "보호자 동반"],
      en: ["Recovery Stay", "Rehabilitation", "Caregiver"],
      ja: ["回復滞在", "リハビリ", "同行者"],
      "zh-CN": ["恢复驻留", "康复治疗", "陪护同行"],
      "zh-TW": ["恢復駐留", "復健治療", "陪護同行"],
    },
  },
];

export default async function ProductsPage({ locale = "ko" }: { locale?: PageLocale }) {
  // DB에서 전체 카탈로그 병렬 로드
  const [catalog, tickets] = await Promise.all([
    readServiceCatalog().catch(() => ({
      tour: [],
      stay: [],
      restaurant: [],
      cafe: [],
      airport: [],
      medical: [],
    })),
    readTicketCatalog().catch(() => []),
  ]);

  const CATEGORY_LABELS = CATEGORY_LABELS_MAP[locale];
  const items: UnifiedItem[] = [];

  // 서비스 카탈로그 아이템 (투어/숙박/음식점/라이프스타일/공항픽업) — locale 적용.
  // 오더 #H1 [2]: verified === true 인 실 계약 업체만 카드로 노출.
  // 시드 19건은 verified 미설정 → false → 여기서 전부 걸러진다. admin 무접촉.
  for (const [cat, catItems] of Object.entries(catalog)) {
    const category = cat as ServiceCatalogCategory;
    const productId = CATEGORY_PRODUCT_IDS[category];
    for (const rawItem of catItems.filter((it) => it.verified === true)) {
      const item = getLocalizedServiceItem(rawItem, locale);
      // 모든 카테고리 카드는 상세 페이지로 이동 → 상세에서 예약 CTA로 이동하는 플로우 통일
      const reservationUrl = `/products/${productId}/detail?item=${item.id}`;
      const minPrice =
        item.options && item.options.length > 0
          ? Math.min(...item.options.map((o) => o.price))
          : item.price;
      // 공항픽업은 DB의 영문/한글 title이 정적 번역 데이터와 불일치 → 별도 맵으로 fallback
      let finalTitle = item.title;
      let finalVenue = item.location;
      let finalDateText = item.dateText;
      if (category === "airport" && locale !== "ko") {
        const tLocaleAirport = locale as TLocale;
        // 현재 title 또는 원본 rawItem.title로 번역 시도
        const mappedByCurrent = AIRPORT_TITLE_MAP[item.title]?.[tLocaleAirport];
        const mappedByRaw = AIRPORT_TITLE_MAP[rawItem.title]?.[tLocaleAirport];
        finalTitle = mappedByCurrent ?? mappedByRaw ?? item.title;
        // venue: 현재값 또는 원본으로 번역 시도
        const venueByCurrent = AIRPORT_VENUE_MAP[item.location ?? ""]?.[tLocaleAirport];
        const venueByRaw = AIRPORT_VENUE_MAP[rawItem.location ?? ""]?.[tLocaleAirport];
        finalVenue = venueByCurrent ?? venueByRaw ?? item.location;
        // dateText: 현재값 또는 원본으로 번역 시도
        const dateByCurrent = AIRPORT_DATE_MAP[item.dateText ?? ""]?.[tLocaleAirport];
        const dateByRaw = AIRPORT_DATE_MAP[rawItem.dateText ?? ""]?.[tLocaleAirport];
        finalDateText = dateByCurrent ?? dateByRaw ?? item.dateText;
      }
      items.push({
        id: `${category}-${item.id}`,
        category,
        categoryLabel: CATEGORY_LABELS[category],
        title: finalTitle,
        venue: finalVenue,
        dateText: finalDateText,
        imageUrl: item.imageUrl,
        imageTone: item.imageTone,
        posterLabel: item.posterLabel,
        badge: item.subtitle || undefined,
        minPrice,
        originalPrice: item.originalPrice,
        discountLabel: item.discountLabel,
        tags: item.tags,
        reservationUrl,
      });
    }
  }

  // 티켓 아이템 — locale별 번역 직접 맵에서 적용.
  // 오더 #P9-d [2]: verified === true 인 실재 확인 티켓만 카드로 노출한다.
  // 시드 8건은 verified 미설정 → false → 여기서 걸러진다. admin 은 무접촉.
  for (const ticket of tickets.filter((t) => t.verified === true)) {
    const minPrice =
      ticket.options.length > 0
        ? Math.min(...ticket.options.map((o) => o.price))
        : 0;
    const tLocale = locale as TLocale;
    const tKey = resolveTicketKey(ticket);
    const localizedTitle =
      locale !== "ko" ? (TICKET_TITLE[tKey]?.[tLocale] ?? ticket.title) : ticket.title;
    const localizedVenue =
      locale !== "ko" ? (TICKET_VENUE[tKey]?.[tLocale] ?? ticket.venue) : ticket.venue;
    const localizedBadge =
      locale !== "ko" ? (TICKET_BADGE[tKey]?.[tLocale] ?? ticket.badge) : ticket.badge;
    const localizedTags =
      locale !== "ko" ? (TICKET_TAGS[tKey]?.[tLocale] ?? ticket.tags) : ticket.tags;
    items.push({
      id: `ticket-${ticket.id}`,
      category: "ticket",
      categoryLabel: CATEGORY_LABELS.ticket,
      title: localizedTitle,
      venue: localizedVenue,
      dateText: ticket.dateText,
      imageUrl: ticket.imageUrl,
      imageTone: ticket.imageTone,
      posterLabel: ticket.posterLabel,
      badge: localizedBadge || undefined,
      minPrice,
      tags: localizedTags,
      reservationUrl: `/products/ticket-agency-platform/detail?ticket=${ticket.id}`,
    });
  }

  // 메디컬 카드 3장 (DB 없이 정적 데이터 기반).
  // 오더 #H1 [2]: verified === true 인 실 계약만 노출. 시드 3건은 미설정 → 걸러짐.
  for (const med of MEDICAL_STATIC_ITEMS.filter((m) => m.verified === true)) {
    items.push({
      id: `medical-${med.id}`,
      category: "medical",
      categoryLabel: CATEGORY_LABELS.medical,
      title: med.titles[locale],
      venue: med.venues[locale],
      dateText: med.dates[locale],
      imageTone: med.imageTone,
      posterLabel: med.posterLabel,
      minPrice: 0,
      tags: med.tags[locale],
      reservationUrl: `/products/${med.productId}/detail`,
    });
  }

  const titleMap: Record<PageLocale, string> = {
    ko: "서비스 안내",
    en: "Services",
    ja: "サービス案内",
    "zh-CN": "服务指南",
    "zh-TW": "服務指南",
  };
  const descMap: Record<PageLocale, string> = {
    ko: "고양의 문화·여가·MICE 서비스를 한 곳에서 안내해 드립니다.",
    en: "Explore Goyang's culture, leisure, and MICE services in one place.",
    ja: "高陽の文化・レジャー・MICEサービスを一括でご案内します。",
    "zh-CN": "在一处了解高阳的文化、休闲与MICE服务信息。",
    "zh-TW": "在一處了解高陽的文化、休閒與MICE服務資訊。",
  };

  return (
    <Shell>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        {/* 페이지 헤더 */}
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">
            DMC Services
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            {titleMap[locale]}
          </h1>
          <p className="mt-2 text-sm leading-7 text-slate-500">{descMap[locale]}</p>
        </div>

        <SectionedBookingGrid items={items} />
      </div>
    </Shell>
  );
}
