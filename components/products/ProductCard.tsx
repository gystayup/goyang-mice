import {
  ArrowRight,
  CalendarClock,
  Coffee,
  Compass,
  Hotel,
  MapPin,
  Plane,
  Ticket,
  Users,
  UtensilsCrossed,
} from "lucide-react";

import type { Product } from "@/data/products";
import { Link } from "@/lib/navigation";

type LocaleKey = "ko" | "en" | "ja" | "zh-CN" | "zh-TW";

interface ProductCardProps {
  product: Product;
  locale?: LocaleKey;
}

type ProductCopy = {
  category: string;
  categorySummary: string;
  tag: string;
  title: string;
  summary: string;
  duration: string;
  people: string;
  location: string;
  subcategories: string[];
  priceLabel: string;
};

const tagIcons: Record<Product["categoryKey"], typeof Compass> = {
  tour: Compass,
  stay: Hotel,
  restaurant: UtensilsCrossed,
  cafe: Coffee,
  ticket: Ticket,
  airport: Plane,
};

// ── 한국어 ──────────────────────────────────────────────
const koCopy: Record<string, ProductCopy> = {
  "tour-experience-platform": {
    category: "여행상품", categorySummary: "체험상품 포함", tag: "투어",
    title: "고양 여행상품예약 플랫폼",
    summary: "공연, 관광, 로컬 체험을 하나의 예약 구조로 연결하는 여행상품 플랫폼입니다.",
    duration: "반일 ~ 1일 코스", people: "2명 ~ 80명", location: "고양시 전역",
    subcategories: ["시티투어", "로컬 체험", "가족형 코스"], priceLabel: "1인 기준 시작가",
  },
  "stay-reservation-platform": {
    category: "숙박예약", categorySummary: "객실, 룸블록, VIP 숙박", tag: "스테이",
    title: "고양 숙박예약 운영 플랫폼",
    summary: "KINTEX와 공연장, 관광 거점이 있는 숙박 예약과 체류 운영을 함께 관리합니다.",
    duration: "1박 ~ 장기 체류", people: "1명 ~ 300명", location: "KINTEX 권역 및 고양 주요 숙소",
    subcategories: ["호텔", "레지던스", "단체 숙소"], priceLabel: "객실 기준 시작가",
  },
  "restaurant-booking-platform": {
    category: "음식점예약", categorySummary: "단체식, 코스, VIP 만찬", tag: "다이닝",
    title: "고양 음식점예약 플랫폼",
    summary: "단체 식사와 지역 미식 경험을 연결하는 다이닝 예약 플랫폼입니다.",
    duration: "1시간 ~ 3시간", people: "2명 ~ 200명", location: "고양 주요 음식점 및 관광특구 상권",
    subcategories: ["단체 식사", "코스 다이닝", "VIP 만찬"], priceLabel: "1인 기준 시작가",
  },
  "cafe-booking-platform": {
    category: "라이프스타일 예약", categorySummary: "브런치, 디저트, 미팅 공간", tag: "라이프스타일",
    title: "라이프스타일 예약 플랫폼",
    summary: "브런치, 카페, 로컬 공간 경험을 연결하는 라이프스타일 예약 플랫폼입니다.",
    duration: "1시간 ~ 반일", people: "2명 ~ 60명", location: "고양 로컬 카페 및 라이프스타일 공간",
    subcategories: ["브런치", "디저트", "미팅 공간"], priceLabel: "1인 기준 시작가",
  },
  "ticket-agency-platform": {
    category: "티켓예약", categorySummary: "공연, 전시, 체험", tag: "티켓",
    title: "고양 티켓예약 플랫폼",
    summary: "공연, 전시, 체험 프로그램 티켓을 한 번에 연결하는 예약 플랫폼입니다.",
    duration: "회차별 운영", people: "1명 ~ 500명", location: "공연장 및 전시 공간",
    subcategories: ["공연", "전시", "체험"], priceLabel: "티켓 기준 시작가",
  },
  "airport-pickup-platform": {
    category: "공항픽업예약", categorySummary: "인천, 김포, VIP 이동", tag: "공항",
    title: "공항픽업예약 플랫폼",
    summary: "공항 픽업부터 호텔, 행사장, 시내 이동까지 연결하는 예약 플랫폼입니다.",
    duration: "노선별 운영", people: "1명 ~ 9명", location: "인천공항 / 김포공항 ~ 고양",
    subcategories: ["인천 픽업", "인천 샌딩", "김포 픽업"], priceLabel: "차량 기준 시작가",
  },
};

// ── English ──────────────────────────────────────────────
const enCopy: Record<string, ProductCopy> = {
  "tour-experience-platform": {
    category: "Travel Products", categorySummary: "Experience included", tag: "Tour",
    title: "Goyang Travel Products Platform",
    summary: "A travel booking platform connecting performances, tourism and local experiences.",
    duration: "Half day to one-day course", people: "2 to 80 guests", location: "Across Goyang",
    subcategories: ["City Tour", "Local Experience", "Family Course"], priceLabel: "Starting price per person",
  },
  "stay-reservation-platform": {
    category: "Accommodation", categorySummary: "Room blocks and VIP stay", tag: "Stay",
    title: "Goyang Stay Reservation Platform",
    summary: "A stay platform linking KINTEX, venues and tourism hubs in one operational flow.",
    duration: "1 night to long stay", people: "1 to 300 guests", location: "KINTEX zone and major stays in Goyang",
    subcategories: ["Hotel", "Residence", "Group Stay"], priceLabel: "Starting room rate",
  },
  "restaurant-booking-platform": {
    category: "Restaurant Booking", categorySummary: "Group, course and VIP dinner", tag: "Dining",
    title: "Goyang Restaurant Booking Platform",
    summary: "A dining reservation platform connecting group meals and local culinary experiences.",
    duration: "1 to 3 hours", people: "2 to 200 guests", location: "Major restaurants and tourism districts",
    subcategories: ["Group Dining", "Course Dining", "VIP Dinner"], priceLabel: "Starting price per person",
  },
  "cafe-booking-platform": {
    category: "Lifestyle Booking", categorySummary: "Brunch, dessert and meeting space", tag: "Lifestyle",
    title: "Lifestyle Reservation Platform",
    summary: "A lifestyle booking platform for brunch cafés, local spaces and relaxed meetings.",
    duration: "1 hour to half day", people: "2 to 60 guests", location: "Local cafés and lifestyle venues",
    subcategories: ["Brunch", "Dessert", "Meeting Space"], priceLabel: "Starting price per person",
  },
  "ticket-agency-platform": {
    category: "Ticket Booking", categorySummary: "Performance, exhibition and activity", tag: "Ticket",
    title: "Goyang Ticket Booking Platform",
    summary: "A connected ticket structure for performances, exhibitions and experience programs.",
    duration: "By session", people: "1 to 500 guests", location: "Performance venues and exhibition halls",
    subcategories: ["Performance", "Exhibition", "Activity"], priceLabel: "Starting ticket price",
  },
  "airport-pickup-platform": {
    category: "Airport Pickup", categorySummary: "ICN, GMP and VIP transfer", tag: "Airport",
    title: "Airport Pickup Reservation Platform",
    summary: "A transfer booking platform linking airport arrival, hotels, venues and city movement.",
    duration: "By route", people: "1 to 9 guests", location: "Incheon / Gimpo Airport to Goyang",
    subcategories: ["ICN Pickup", "ICN Sending", "GMP Pickup"], priceLabel: "Starting fare",
  },
};

// ── 日本語 ──────────────────────────────────────────────
const jaCopy: Record<string, ProductCopy> = {
  "tour-experience-platform": {
    category: "旅行商品", categorySummary: "体験商品含む", tag: "ツアー",
    title: "高陽旅行商品予約プラットフォーム",
    summary: "公演・観光・ローカル体験を一つの予約構造でつなぐ旅行商品プラットフォームです。",
    duration: "半日〜1日コース", people: "2名〜80名", location: "高陽市全域",
    subcategories: ["シティツアー", "ローカル体験", "ファミリーコース"], priceLabel: "1名あたり開始価格",
  },
  "stay-reservation-platform": {
    category: "宿泊予約", categorySummary: "客室・ルームブロック・VIP宿泊", tag: "ステイ",
    title: "高陽宿泊予約運営プラットフォーム",
    summary: "KINTEXと公演場、観光拠点の宿泊予約と滞在運営を一括管理します。",
    duration: "1泊〜長期滞在", people: "1名〜300名", location: "KINTEX周辺および高陽の主要宿泊施設",
    subcategories: ["ホテル", "レジデンス", "団体宿泊"], priceLabel: "客室あたり開始価格",
  },
  "restaurant-booking-platform": {
    category: "レストラン予約", categorySummary: "団体食・コース・VIPディナー", tag: "ダイニング",
    title: "高陽レストラン予約プラットフォーム",
    summary: "団体食事と地域グルメ体験をつなぐダイニング予約プラットフォームです。",
    duration: "1時間〜3時間", people: "2名〜200名", location: "高陽の主要レストランおよび観光特区",
    subcategories: ["団体食", "コースダイニング", "VIPディナー"], priceLabel: "1名あたり開始価格",
  },
  "cafe-booking-platform": {
    category: "ライフスタイル予約", categorySummary: "ブランチ・デザート・ミーティング", tag: "ライフスタイル",
    title: "ライフスタイル予約プラットフォーム",
    summary: "ブランチ・カフェ・ローカルスペース体験をつなぐライフスタイル予約プラットフォームです。",
    duration: "1時間〜半日", people: "2名〜60名", location: "高陽のローカルカフェおよびライフスタイルスペース",
    subcategories: ["ブランチ", "デザート", "ミーティングスペース"], priceLabel: "1名あたり開始価格",
  },
  "ticket-agency-platform": {
    category: "チケット予約", categorySummary: "公演・展示・体験", tag: "チケット",
    title: "高陽チケット予約プラットフォーム",
    summary: "公演・展示・体験プログラムのチケットを一括でつなぐ予約プラットフォームです。",
    duration: "回次ごとに運営", people: "1名〜500名", location: "公演場および展示スペース",
    subcategories: ["公演", "展示", "体験"], priceLabel: "チケットあたり開始価格",
  },
  "airport-pickup-platform": {
    category: "空港送迎予約", categorySummary: "仁川・金浦・VIP移動", tag: "空港",
    title: "空港送迎予約プラットフォーム",
    summary: "空港送迎からホテル・会場・市内移動まで一括でつなぐ予約プラットフォームです。",
    duration: "路線ごとに運営", people: "1名〜9名", location: "仁川空港 / 金浦空港〜高陽",
    subcategories: ["仁川ピックアップ", "仁川センディング", "金浦ピックアップ"], priceLabel: "車両あたり開始価格",
  },
};

// ── 简体中文 ──────────────────────────────────────────────
const zhCNCopy: Record<string, ProductCopy> = {
  "tour-experience-platform": {
    category: "旅游产品", categorySummary: "含体验项目", tag: "旅游",
    title: "高阳旅游产品预约平台",
    summary: "将演出、观光、本地体验整合为一个预约结构的旅游产品平台。",
    duration: "半天至1天行程", people: "2人至80人", location: "高阳市全域",
    subcategories: ["城市游览", "本地体验", "家庭行程"], priceLabel: "每人起始价格",
  },
  "stay-reservation-platform": {
    category: "住宿预约", categorySummary: "客房、房间预留、VIP住宿", tag: "住宿",
    title: "高阳住宿预约运营平台",
    summary: "一站式管理KINTEX及演出场馆、旅游据点的住宿预约与滞留运营。",
    duration: "1晚至长期滞留", people: "1人至300人", location: "KINTEX区域及高阳主要住宿",
    subcategories: ["酒店", "公寓式酒店", "团体住宿"], priceLabel: "每间客房起始价格",
  },
  "restaurant-booking-platform": {
    category: "餐厅预约", categorySummary: "团体餐、套餐、VIP晚宴", tag: "餐饮",
    title: "高阳餐厅预约平台",
    summary: "连接团体餐食与地方美食体验的餐饮预约平台。",
    duration: "1小时至3小时", people: "2人至200人", location: "高阳主要餐厅及旅游特区",
    subcategories: ["团体餐", "套餐", "VIP晚宴"], priceLabel: "每人起始价格",
  },
  "cafe-booking-platform": {
    category: "生活方式预约", categorySummary: "早午餐、甜点、会议空间", tag: "生活方式",
    title: "生活方式预约平台",
    summary: "连接早午餐、咖啡馆及本地空间体验的生活方式预约平台。",
    duration: "1小时至半天", people: "2人至60人", location: "高阳本地咖啡馆及生活方式空间",
    subcategories: ["早午餐", "甜点", "会议空间"], priceLabel: "每人起始价格",
  },
  "ticket-agency-platform": {
    category: "票务预约", categorySummary: "演出、展览、体验", tag: "票务",
    title: "高阳票务预约平台",
    summary: "一站式连接演出、展览及体验项目票务的预约平台。",
    duration: "按场次运营", people: "1人至500人", location: "演出场馆及展览空间",
    subcategories: ["演出", "展览", "体验"], priceLabel: "每张票起始价格",
  },
  "airport-pickup-platform": {
    category: "机场接送预约", categorySummary: "仁川、金浦、VIP接送", tag: "机场",
    title: "机场接送预约平台",
    summary: "一站式连接机场接送至酒店、场馆及市内出行的预约平台。",
    duration: "按路线运营", people: "1人至9人", location: "仁川机场 / 金浦机场至高阳",
    subcategories: ["仁川接机", "仁川送机", "金浦接机"], priceLabel: "每辆车起始价格",
  },
};

// ── 繁體中文 ──────────────────────────────────────────────
const zhTWCopy: Record<string, ProductCopy> = {
  "tour-experience-platform": {
    category: "旅遊產品", categorySummary: "含體驗項目", tag: "旅遊",
    title: "高陽旅遊產品預約平台",
    summary: "將演出、觀光、在地體驗整合為一個預約結構的旅遊產品平台。",
    duration: "半天至1天行程", people: "2人至80人", location: "高陽市全域",
    subcategories: ["城市遊覽", "在地體驗", "家庭行程"], priceLabel: "每人起始價格",
  },
  "stay-reservation-platform": {
    category: "住宿預約", categorySummary: "客房、房間預留、VIP住宿", tag: "住宿",
    title: "高陽住宿預約運營平台",
    summary: "一站式管理KINTEX及演出場館、旅遊據點的住宿預約與滯留運營。",
    duration: "1晚至長期滯留", people: "1人至300人", location: "KINTEX區域及高陽主要住宿",
    subcategories: ["酒店", "公寓式酒店", "團體住宿"], priceLabel: "每間客房起始價格",
  },
  "restaurant-booking-platform": {
    category: "餐廳預約", categorySummary: "團體餐、套餐、VIP晚宴", tag: "餐飲",
    title: "高陽餐廳預約平台",
    summary: "連結團體餐食與地方美食體驗的餐飲預約平台。",
    duration: "1小時至3小時", people: "2人至200人", location: "高陽主要餐廳及旅遊特區",
    subcategories: ["團體餐", "套餐", "VIP晚宴"], priceLabel: "每人起始價格",
  },
  "cafe-booking-platform": {
    category: "生活風格預約", categorySummary: "早午餐、甜點、會議空間", tag: "生活風格",
    title: "生活風格預約平台",
    summary: "連結早午餐、咖啡廳及在地空間體驗的生活風格預約平台。",
    duration: "1小時至半天", people: "2人至60人", location: "高陽在地咖啡廳及生活風格空間",
    subcategories: ["早午餐", "甜點", "會議空間"], priceLabel: "每人起始價格",
  },
  "ticket-agency-platform": {
    category: "票務預約", categorySummary: "演出、展覽、體驗", tag: "票務",
    title: "高陽票務預約平台",
    summary: "一站式連結演出、展覽及體驗項目票務的預約平台。",
    duration: "按場次運營", people: "1人至500人", location: "演出場館及展覽空間",
    subcategories: ["演出", "展覽", "體驗"], priceLabel: "每張票起始價格",
  },
  "airport-pickup-platform": {
    category: "機場接送預約", categorySummary: "仁川、金浦、VIP接送", tag: "機場",
    title: "機場接送預約平台",
    summary: "一站式連結機場接送至酒店、場館及市內出行的預約平台。",
    duration: "按路線運營", people: "1人至9人", location: "仁川機場 / 金浦機場至高陽",
    subcategories: ["仁川接機", "仁川送機", "金浦接機"], priceLabel: "每輛車起始價格",
  },
};

const copyByLocale: Record<LocaleKey, Record<string, ProductCopy>> = {
  ko: koCopy,
  en: enCopy,
  ja: jaCopy,
  "zh-CN": zhCNCopy,
  "zh-TW": zhTWCopy,
};

const buttonCopy: Record<LocaleKey, { details: string; reserve: string }> = {
  ko:      { details: "상세 보기",   reserve: "예약하기" },
  en:      { details: "View details", reserve: "Reserve" },
  ja:      { details: "詳細を見る",  reserve: "予約する" },
  "zh-CN": { details: "查看详情",    reserve: "立即预约" },
  "zh-TW": { details: "查看詳情",    reserve: "立即預約" },
};

const LOCALES: LocaleKey[] = ["ko", "en", "ja", "zh-CN", "zh-TW"];

export default function ProductCard({ product, locale = "ko" }: ProductCardProps) {
  const activeLocale: LocaleKey = (LOCALES.includes(locale) ? locale : "ko") as LocaleKey;
  const copySet = copyByLocale[activeLocale];
  const display = copySet[product.id] ?? {
    category: product.category,
    categorySummary: product.categorySummary,
    tag: product.tag,
    title: product.title,
    summary: product.summary,
    duration: product.duration,
    people: product.people,
    location: product.location,
    subcategories: product.subcategories.slice(0, 3),
    priceLabel: product.priceLabel,
  };
  const ui = buttonCopy[activeLocale];
  const Icon = tagIcons[product.categoryKey];

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[28px] border border-white/80 bg-white/80 shadow-[0_12px_36px_rgba(16,32,58,0.08)] backdrop-blur-sm transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_56px_rgba(16,32,58,0.14)]">
      {/* 카드 헤더 — 다크 그라데이션 */}
      <div className="relative flex min-h-[14.5rem] flex-col overflow-hidden p-5 text-white sm:min-h-[15.5rem] sm:p-6"
           style={{ background: "linear-gradient(145deg, #080e1a 0%, #0f1e38 35%, #1a3060 70%, #2a4a8a 100%)" }}>
        {/* 도트 그리드 */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.05]"
             style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
        {/* 글로우 */}
        <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[#8df0cf]/18 blur-[40px]" />
        <div className="pointer-events-none absolute -bottom-8 left-0 h-28 w-28 rounded-full bg-[#a4d8ff]/14 blur-[40px]" />
        {/* 상단 네온 라인 */}
        <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[#8df0cf] via-[#ffe98b] to-[#ffb58f]" />

        <div className="relative flex items-start justify-between gap-3">
          <span className="rounded-full border border-[#8df0cf]/25 bg-[#8df0cf]/12 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#8df0cf]/90 backdrop-blur">
            {product.badge}
          </span>
          <span className="inline-flex items-center gap-1.5 pt-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/70">
            <Icon className="h-3.5 w-3.5" />
            {display.tag}
          </span>
        </div>

        <h3 className="relative mt-5 min-h-[3rem] text-[1.45rem] font-black leading-[1.1] tracking-[-0.05em] text-white sm:text-[1.75rem]">
          {display.title}
        </h3>
        <p className="relative mt-4 line-clamp-3 text-[15px] leading-7 text-slate-300 sm:text-base">
          {display.summary}
        </p>
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex min-h-[3rem] items-start justify-between gap-3">
          <span className="inline-flex rounded-full border border-white/60 bg-white/70 px-3 py-1.5 text-xs font-semibold text-slate-700 backdrop-blur">
            {display.category}
          </span>
          <span className="text-right text-[13px] font-semibold leading-6 text-slate-400">
            {display.categorySummary}
          </span>
        </div>

        <div className="mt-5 grid gap-3 rounded-[20px] border border-white/60 bg-white/50 p-4 text-[15px] text-slate-700 backdrop-blur">
          <div className="flex items-center gap-2.5">
            <CalendarClock className="h-4 w-4 shrink-0 text-[#0a6b48]" />
            <span>{display.duration}</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Users className="h-4 w-4 shrink-0 text-[#3655a6]" />
            <span>{display.people}</span>
          </div>
          <div className="flex items-center gap-2.5">
            <MapPin className="h-4 w-4 shrink-0 text-[#9b3a1a]" />
            <span>{display.location}</span>
          </div>
        </div>

        <div className="mt-5 min-h-[2.9rem]">
          <div className="flex flex-wrap gap-2">
            {display.subcategories.slice(0, 3).map((item) => (
              <span
                key={item}
                className="rounded-full border border-white/70 bg-white/70 px-3 py-1.5 text-[11px] font-semibold text-slate-600 backdrop-blur"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-[20px] border border-white/60 bg-gradient-to-br from-[#f0f4ff] to-[#eef2ff] px-5 py-4">
          <div className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
            {display.priceLabel}
          </div>
          <div className="mt-2 text-[1.9rem] font-black tracking-[-0.04em] text-slate-950 sm:text-[2.1rem]">
            ₩{product.price.toLocaleString("ko-KR")}
          </div>
        </div>

        <div className="mt-auto pt-6">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Link
              href={`/products/${product.id}`}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#10203a] to-[#1e3a6e] px-5 text-sm font-bold text-white shadow-[0_6px_18px_rgba(16,32,58,0.20)] transition hover:-translate-y-0.5 hover:brightness-110"
            >
              {ui.details}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href={`/products/${product.id}/reservation`}
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/70 bg-white/80 px-5 text-sm font-semibold text-slate-700 backdrop-blur transition hover:bg-white hover:shadow-md"
            >
              {ui.reserve}
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
