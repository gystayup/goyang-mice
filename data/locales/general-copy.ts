import type { DmcCategoryKey } from "@/data/products";
import type { ServiceCatalogCategory } from "@/data/service-catalog";
import type { TicketCategory } from "@/data/ticket-booking";

import { pick, type LocalizedText, type PageLocale } from "./types";

// 오더 #P4-c: 티켓 외 카테고리 라벨에서 예약 표현 제거 (판매 불가 카테고리 톤 통일).
// 티켓 카테고리는 예약/발권 표현 유지 (판매 가능).
const categoryLabels: Record<DmcCategoryKey, LocalizedText> = {
  tour: { ko: "투어·체험", en: "Tours & Experiences", ja: "ツアー・体験", "zh-CN": "旅游·体验", "zh-TW": "旅遊·體驗" },
  stay: { ko: "숙박", en: "Accommodation", ja: "宿泊", "zh-CN": "住宿", "zh-TW": "住宿" },
  restaurant: { ko: "음식점", en: "Restaurant", ja: "レストラン", "zh-CN": "餐厅", "zh-TW": "餐廳" },
  cafe: { ko: "라이프스타일", en: "Lifestyle", ja: "ライフスタイル", "zh-CN": "生活方式", "zh-TW": "生活風格" },
  ticket: { ko: "티켓예약", en: "Ticket", ja: "チケット予約", "zh-CN": "票务预约", "zh-TW": "票務預約" },
  airport: { ko: "공항픽업", en: "Airport Pickup", ja: "空港送迎", "zh-CN": "机场接送", "zh-TW": "機場接送" },
  medical: { ko: "고양메디컬투어", en: "Goyang Medical Tour", ja: "高陽メディカルツアー", "zh-CN": "高阳医疗旅游", "zh-TW": "高陽醫療旅遊" },
};

const categoryEyebrows: Record<DmcCategoryKey, LocalizedText> = {
  tour: { ko: "투어·체험", en: "Tours & Experiences", ja: "ツアー・体験", "zh-CN": "旅游·体验", "zh-TW": "旅遊·體驗" },
  stay: { ko: "숙박", en: "Stay / Room Block", ja: "宿泊", "zh-CN": "住宿", "zh-TW": "住宿" },
  restaurant: { ko: "음식점", en: "Dining", ja: "レストラン", "zh-CN": "餐厅", "zh-TW": "餐廳" },
  cafe: { ko: "라이프스타일", en: "Lifestyle", ja: "ライフスタイル", "zh-CN": "生活方式", "zh-TW": "生活風格" },
  ticket: { ko: "티켓예약", en: "Ticket Booking", ja: "チケット予約", "zh-CN": "票务预约", "zh-TW": "票務預約" },
  airport: { ko: "공항픽업", en: "Airport Transfer", ja: "空港送迎", "zh-CN": "机场接送", "zh-TW": "機場接送" },
  medical: { ko: "메디컬투어", en: "Medical Tour", ja: "メディカルツアー", "zh-CN": "医疗旅游", "zh-TW": "醫療旅遊" },
};

const serviceSeasons: Record<ServiceCatalogCategory, LocalizedText> = {
  tour: { ko: "봄·가을 집중 시즌", en: "Spring · Autumn Focus", ja: "春・秋集中シーズン", "zh-CN": "春秋重点季节", "zh-TW": "春秋重點季節" },
  stay: { ko: "연중 운영", en: "Year-round", ja: "年中運営", "zh-CN": "全年运营", "zh-TW": "全年營運" },
  restaurant: { ko: "연중 운영", en: "Year-round", ja: "年中運営", "zh-CN": "全年运营", "zh-TW": "全年營運" },
  cafe: { ko: "봄·가을 추천 시즌", en: "Spring · Autumn Picks", ja: "春・秋おすすめシーズン", "zh-CN": "春秋推荐季节", "zh-TW": "春秋推薦季節" },
  airport: { ko: "365일 · 24시간 운영", en: "365 days · 24h", ja: "365日 · 24時間", "zh-CN": "全年·24小时", "zh-TW": "全年·24小時" },
  medical: { ko: "연중 운영", en: "Year-round", ja: "年中運営", "zh-CN": "全年运营", "zh-TW": "全年營運" },
};

const ticketCategories: Record<TicketCategory | "all", LocalizedText> = {
  all: { ko: "전체", en: "All", ja: "すべて", "zh-CN": "全部", "zh-TW": "全部" },
  concert: { ko: "콘서트", en: "Concert", ja: "コンサート", "zh-CN": "演唱会", "zh-TW": "演唱會" },
  festival: { ko: "페스티벌", en: "Festival", ja: "フェスティバル", "zh-CN": "节庆", "zh-TW": "節慶" },
  exhibition: { ko: "전시/행사", en: "Exhibition", ja: "展示/イベント", "zh-CN": "展览/活动", "zh-TW": "展覽/活動" },
  family: { ko: "아동/가족", en: "Family", ja: "キッズ/ファミリー", "zh-CN": "儿童/家庭", "zh-TW": "兒童/家庭" },
  "k-pop": { ko: "K-POP", en: "K-POP", ja: "K-POP", "zh-CN": "K-POP", "zh-TW": "K-POP" },
};

const common = {
  detailPage: {
    notFoundTitle: {
      ko: "요청하신 서비스를 찾을 수 없습니다.",
      en: "The requested service could not be found.",
      ja: "ご要望のサービスが見つかりませんでした。",
      "zh-CN": "找不到您请求的服务。",
      "zh-TW": "找不到您請求的服務。",
    },
    notFoundDescription: {
      ko: "서비스 목록으로 돌아가 다른 DMC 카테고리를 확인해 주세요.",
      en: "Please return to the service list and explore another DMC category.",
      ja: "サービス一覧に戻り、別のDMCカテゴリをご確認ください。",
      "zh-CN": "请返回服务列表，查看其他DMC类别。",
      "zh-TW": "請返回服務列表，查看其他DMC類別。",
    },
    viewAll: { ko: "서비스 목록 보기", en: "View All Services", ja: "サービス一覧を見る", "zh-CN": "查看服务列表", "zh-TW": "查看服務列表" },
    serviceScope: { ko: "서비스 범위", en: "Service Scope", ja: "サービス範囲", "zh-CN": "服务范围", "zh-TW": "服務範圍" },
    recommendedGroup: { ko: "권장 인원", en: "Recommended Guests", ja: "推奨人数", "zh-CN": "建议人数", "zh-TW": "建議人數" },
    operationArea: { ko: "운영 권역", en: "Operating Area", ja: "運営エリア", "zh-CN": "运营区域", "zh-TW": "營運區域" },
    subcategories: { ko: "서브카테고리", en: "Subcategories", ja: "サブカテゴリ", "zh-CN": "子类别", "zh-TW": "子類別" },
    serviceHighlights: { ko: "서비스 핵심 포인트", en: "Service Highlights", ja: "サービスのポイント", "zh-CN": "服务亮点", "zh-TW": "服務亮點" },
    includedItems: { ko: "포함 항목", en: "Included Items", ja: "含まれる項目", "zh-CN": "包含项目", "zh-TW": "包含項目" },
    recommendedFor: { ko: "추천 대상", en: "Recommended For", ja: "おすすめ対象", "zh-CN": "适合人群", "zh-TW": "適合對象" },
  },
  reservationPage: {
    eyebrow: { ko: "예약", en: "Reservation", ja: "予約", "zh-CN": "预约", "zh-TW": "預約" },
    titleSuffix: { ko: "예약 요청", en: "Reservation Request", ja: "予約リクエスト", "zh-CN": "预约申请", "zh-TW": "預約申請" },
    description: {
      ko: "선택한 상품의 상세 설명과 옵션, 결제 방식을 확인한 뒤 바로 예약 요청을 진행할 수 있습니다.",
      en: "Review the selected product, options, and payment methods, then submit your reservation request.",
      ja: "選択した商品の詳細説明・オプション・決済方法を確認してから、予約リクエストをお進めください。",
      "zh-CN": "确认所选产品的详细说明、选项及付款方式后，即可提交预约申请。",
      "zh-TW": "確認所選產品的詳細說明、選項及付款方式後，即可提交預約申請。",
    },
    notFoundTitle: {
      ko: "예약 가능한 서비스를 찾을 수 없습니다.",
      en: "No reservable service could be found.",
      ja: "予約可能なサービスが見つかりませんでした。",
      "zh-CN": "找不到可预约的服务。",
      "zh-TW": "找不到可預約的服務。",
    },
  },
  bookingMeta: {
    panelTitle: { ko: "예약 정보", en: "Reservation Info", ja: "予約情報", "zh-CN": "预约信息", "zh-TW": "預約資訊" },
    availability: { ko: "예약 상태", en: "Availability", ja: "予約状況", "zh-CN": "预约状态", "zh-TW": "預約狀態" },
    season: { ko: "운영 시즌", en: "Season", ja: "運営シーズン", "zh-CN": "运营季节", "zh-TW": "營運季節" },
    calendar: { ko: "예약 캘린더", en: "Reservation Calendar", ja: "予約カレンダー", "zh-CN": "预约日历", "zh-TW": "預約日曆" },
    payments: { ko: "결제방법", en: "Payment Methods", ja: "お支払い方法", "zh-CN": "支付方式", "zh-TW": "付款方式" },
    open: { ko: "예약 가능", en: "Available", ja: "予約可能", "zh-CN": "可预约", "zh-TW": "可預約" },
    pending: { ko: "오픈 예정", en: "Opening Soon", ja: "近日公開", "zh-CN": "即将开放", "zh-TW": "即將開放" },
    closed: { ko: "예약 마감", en: "Closed", ja: "予約締切", "zh-CN": "预约截止", "zh-TW": "預約截止" },
    paymentMethods: [
      { ko: "크레딧카드", en: "Credit Card", ja: "クレジットカード", "zh-CN": "信用卡", "zh-TW": "信用卡" },
      { ko: "카카오페이", en: "KakaoPay", ja: "カカオペイ", "zh-CN": "KakaoPay", "zh-TW": "KakaoPay" },
      { ko: "계좌송금", en: "Bank Transfer", ja: "銀行振込", "zh-CN": "银行转账", "zh-TW": "銀行轉帳" },
      { ko: "법인 후불 정산", en: "Corporate Billing", ja: "法人後払い精算", "zh-CN": "法人后付结算", "zh-TW": "法人後付結算" },
    ],
  },
  quickNav: {
    all: { ko: "전체 서비스", en: "All Services", ja: "すべてのサービス", "zh-CN": "全部服务", "zh-TW": "全部服務" },
    label: { ko: "카테고리 바로가기", en: "Category Shortcuts", ja: "カテゴリへのショートカット", "zh-CN": "类别快捷入口", "zh-TW": "類別快捷入口" },
  },
};

export function getCategoryLabel(locale: PageLocale, key: DmcCategoryKey) {
  return pick(locale, categoryLabels[key]);
}

export function getCategoryEyebrow(locale: PageLocale, key: DmcCategoryKey) {
  return pick(locale, categoryEyebrows[key]);
}

export function getServiceSeason(locale: PageLocale, key: ServiceCatalogCategory) {
  return pick(locale, serviceSeasons[key]);
}

export function getTicketCategoryLabel(locale: PageLocale, key: TicketCategory | "all") {
  return pick(locale, ticketCategories[key]);
}

export function getCommonCopy(locale: PageLocale) {
  return {
    detailPage: Object.fromEntries(
      Object.entries(common.detailPage).map(([key, value]) => [key, pick(locale, value)])
    ) as Record<keyof typeof common.detailPage, string>,
    reservationPage: {
      eyebrow: pick(locale, common.reservationPage.eyebrow),
      titleSuffix: pick(locale, common.reservationPage.titleSuffix),
      description: pick(locale, common.reservationPage.description),
      notFoundTitle: pick(locale, common.reservationPage.notFoundTitle),
    },
    bookingMeta: {
      panelTitle: pick(locale, common.bookingMeta.panelTitle),
      availability: pick(locale, common.bookingMeta.availability),
      season: pick(locale, common.bookingMeta.season),
      calendar: pick(locale, common.bookingMeta.calendar),
      payments: pick(locale, common.bookingMeta.payments),
      open: pick(locale, common.bookingMeta.open),
      pending: pick(locale, common.bookingMeta.pending),
      closed: pick(locale, common.bookingMeta.closed),
      paymentMethods: common.bookingMeta.paymentMethods.map((method) =>
        pick(locale, method)
      ),
    },
    quickNav: {
      all: pick(locale, common.quickNav.all),
      label: pick(locale, common.quickNav.label),
    },
  };
}
