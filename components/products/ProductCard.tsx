import {
  ArrowRight,
  CalendarClock,
  Coffee,
  Compass,
  Hotel,
  MapPin,
  Plane,
  Stethoscope,
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
  medical: Stethoscope,
};

// 카피 원칙:
//   · 티켓(공연·전시) = 정당 판매 UI 유지 ("예약" 문구·가격·예매 버튼 그대로)
//   · 나머지 카테고리 = "안내" 톤만 (예약·플랫폼·판매 소구어 제거)
//   · 의료 3종 = 병원·시설 "정보 소개"만 (치료·미용·회복 서비스 나열 금지, 유치·알선·모객 뉘앙스 완전 배제)

// ── 한국어 ──────────────────────────────────────────────
const koCopy: Record<string, ProductCopy> = {
  "tour-experience-platform": {
    category: "여행 안내", categorySummary: "체험 프로그램 포함", tag: "투어",
    title: "고양일산 여행 안내 플랫폼",
    summary: "공연·관광·로컬 체험 정보를 한 흐름으로 안내합니다.",
    duration: "반일 ~ 1일 코스", people: "2명 ~ 80명", location: "고양시 전역",
    subcategories: ["시티투어", "로컬 체험", "가족형 코스"], priceLabel: "상세 문의",
  },
  "stay-reservation-platform": {
    category: "숙박 안내", categorySummary: "객실·단체·VIP 숙박 안내", tag: "스테이",
    title: "고양일산 숙박 안내 플랫폼",
    summary: "KINTEX·공연장·관광 거점 인근 숙박 정보를 안내합니다.",
    duration: "1박 ~ 장기 체류", people: "1명 ~ 300명", location: "KINTEX 권역 및 고양 주요 숙소",
    subcategories: ["호텔", "레지던스", "단체 숙소"], priceLabel: "상세 문의",
  },
  "restaurant-booking-platform": {
    category: "음식점 안내", categorySummary: "단체식·코스·VIP 만찬 안내", tag: "다이닝",
    title: "고양일산 음식점 안내 플랫폼",
    summary: "단체 식사·지역 미식 경험 정보를 안내합니다.",
    duration: "1시간 ~ 3시간", people: "2명 ~ 200명", location: "고양 주요 음식점 및 관광특구 상권",
    subcategories: ["단체 식사", "코스 다이닝", "VIP 만찬"], priceLabel: "상세 문의",
  },
  "cafe-booking-platform": {
    category: "라이프스타일 안내", categorySummary: "브런치·디저트·미팅 공간 안내", tag: "라이프스타일",
    title: "라이프스타일 안내 플랫폼",
    summary: "브런치·카페·로컬 공간 경험 정보를 안내합니다.",
    duration: "1시간 ~ 반일", people: "2명 ~ 60명", location: "고양 로컬 카페 및 라이프스타일 공간",
    subcategories: ["브런치", "디저트", "미팅 공간"], priceLabel: "상세 문의",
  },
  "ticket-agency-platform": {
    category: "티켓예약", categorySummary: "공연, 전시, 체험", tag: "티켓",
    title: "고양일산 티켓예약 플랫폼",
    summary: "공연, 전시, 체험 프로그램 티켓을 한 번에 연결하는 예약 플랫폼입니다.",
    duration: "회차별 운영", people: "1명 ~ 500명", location: "공연장 및 전시 공간",
    subcategories: ["공연", "전시", "체험"], priceLabel: "티켓 기준 시작가",
  },
  "airport-pickup-platform": {
    category: "공항픽업 안내", categorySummary: "인천·김포·VIP 이동 안내", tag: "공항",
    title: "공항픽업 안내 플랫폼",
    summary: "공항 픽업·호텔·행사장·시내 이동 정보를 안내합니다.",
    duration: "노선별 운영", people: "1명 ~ 9명", location: "인천공항 / 김포공항 ~ 고양",
    subcategories: ["인천 픽업", "인천 샌딩", "김포 픽업"], priceLabel: "상세 문의",
  },
  "medical-treatment-platform": {
    category: "고양일산 의료기관 안내", categorySummary: "종합병원 안내", tag: "종합병원",
    title: "고양일산 종합병원 정보 안내",
    summary: "고양일산 종합병원 및 전문 의료기관 정보를 안내합니다.",
    duration: "각 기관 안내", people: "각 기관 안내", location: "고양시 대학병원·전문 의료기관",
    subcategories: ["종합진료", "전문진료", "정밀검진"], priceLabel: "각 기관 문의",
  },
  "medical-beauty-platform": {
    category: "고양일산 의료기관 안내", categorySummary: "미용의료 안내", tag: "미용의료",
    title: "고양일산 미용의료 정보 안내",
    summary: "고양일산 미용의료 시설 정보를 안내합니다.",
    duration: "각 기관 안내", people: "각 기관 안내", location: "고양시 미용의료 시설",
    subcategories: ["미용의료", "피부의료", "웰니스"], priceLabel: "각 기관 문의",
  },
  "medical-recovery-platform": {
    category: "고양일산 의료기관 안내", categorySummary: "재활의료 안내", tag: "재활의료",
    title: "고양일산 재활의료 정보 안내",
    summary: "고양일산 재활의료 시설 정보를 안내합니다.",
    duration: "각 기관 안내", people: "각 기관 안내", location: "고양시 재활의료 시설",
    subcategories: ["재활의료", "회복 안내", "정보 안내"], priceLabel: "각 기관 문의",
  },
};

// ── English ──────────────────────────────────────────────
const enCopy: Record<string, ProductCopy> = {
  "tour-experience-platform": {
    category: "Travel Guide", categorySummary: "Experience programs included", tag: "Tour",
    title: "Goyang-Ilsan Travel Guide Platform",
    summary: "Guides for performances, tourism and local experiences in one flow.",
    duration: "Half day to one-day course", people: "2 to 80 guests", location: "Across Goyang",
    subcategories: ["City Tour", "Local Experience", "Family Course"], priceLabel: "See details",
  },
  "stay-reservation-platform": {
    category: "Stay Guide", categorySummary: "Rooms, group and VIP stays", tag: "Stay",
    title: "Goyang-Ilsan Stay Guide Platform",
    summary: "Stay information near KINTEX, venues and tourism hubs.",
    duration: "1 night to long stay", people: "1 to 300 guests", location: "KINTEX zone and major stays in Goyang",
    subcategories: ["Hotel", "Residence", "Group Stay"], priceLabel: "See details",
  },
  "restaurant-booking-platform": {
    category: "Restaurant Guide", categorySummary: "Group, course and VIP dinners", tag: "Dining",
    title: "Goyang-Ilsan Restaurant Guide Platform",
    summary: "Guides for group meals and local culinary experiences.",
    duration: "1 to 3 hours", people: "2 to 200 guests", location: "Major restaurants and tourism districts",
    subcategories: ["Group Dining", "Course Dining", "VIP Dinner"], priceLabel: "See details",
  },
  "cafe-booking-platform": {
    category: "Lifestyle Guide", categorySummary: "Brunch, dessert and meeting space", tag: "Lifestyle",
    title: "Lifestyle Guide Platform",
    summary: "Guides for brunch cafés, local spaces and relaxed meetings.",
    duration: "1 hour to half day", people: "2 to 60 guests", location: "Local cafés and lifestyle venues",
    subcategories: ["Brunch", "Dessert", "Meeting Space"], priceLabel: "See details",
  },
  "ticket-agency-platform": {
    category: "Ticket Booking", categorySummary: "Performance, exhibition and activity", tag: "Ticket",
    title: "Goyang-Ilsan Ticket Booking Platform",
    summary: "A connected ticket structure for performances, exhibitions and experience programs.",
    duration: "By session", people: "1 to 500 guests", location: "Performance venues and exhibition halls",
    subcategories: ["Performance", "Exhibition", "Activity"], priceLabel: "Starting ticket price",
  },
  "airport-pickup-platform": {
    category: "Airport Pickup Guide", categorySummary: "ICN, GMP and VIP transfer", tag: "Airport",
    title: "Airport Pickup Guide Platform",
    summary: "Guides for airport pickup, hotels, venues and city transfer.",
    duration: "By route", people: "1 to 9 guests", location: "Incheon / Gimpo Airport to Goyang",
    subcategories: ["ICN Pickup", "ICN Sending", "GMP Pickup"], priceLabel: "See details",
  },
  "medical-treatment-platform": {
    category: "Goyang-Ilsan Healthcare Guide", categorySummary: "General hospitals", tag: "Hospital",
    title: "Goyang-Ilsan General Hospital Guide",
    summary: "Information on general hospitals and specialty clinics in Goyang-Ilsan.",
    duration: "See each facility", people: "See each facility", location: "Goyang teaching hospitals and specialty clinics",
    subcategories: ["General care", "Specialty care", "Health screening"], priceLabel: "Contact each facility",
  },
  "medical-beauty-platform": {
    category: "Goyang-Ilsan Healthcare Guide", categorySummary: "Aesthetic medicine", tag: "Aesthetic",
    title: "Goyang-Ilsan Aesthetic Clinic Guide",
    summary: "Information on aesthetic medicine facilities in Goyang-Ilsan.",
    duration: "See each facility", people: "See each facility", location: "Goyang aesthetic medicine facilities",
    subcategories: ["Aesthetic", "Dermatology", "Wellness"], priceLabel: "Contact each facility",
  },
  "medical-recovery-platform": {
    category: "Goyang-Ilsan Healthcare Guide", categorySummary: "Rehabilitation care", tag: "Rehab",
    title: "Goyang-Ilsan Rehabilitation Care Guide",
    summary: "Information on rehabilitation care facilities in Goyang-Ilsan.",
    duration: "See each facility", people: "See each facility", location: "Goyang rehabilitation facilities",
    subcategories: ["Rehabilitation", "Recovery care", "Guide"], priceLabel: "Contact each facility",
  },
};

// ── 日本語 ──────────────────────────────────────────────
const jaCopy: Record<string, ProductCopy> = {
  "tour-experience-platform": {
    category: "旅行案内", categorySummary: "体験プログラム含む", tag: "ツアー",
    title: "高陽・一山 旅行案内プラットフォーム",
    summary: "公演・観光・ローカル体験の情報を一つの流れで案内します。",
    duration: "半日〜1日コース", people: "2名〜80名", location: "高陽市全域",
    subcategories: ["シティツアー", "ローカル体験", "ファミリーコース"], priceLabel: "詳細はお問い合わせ",
  },
  "stay-reservation-platform": {
    category: "宿泊案内", categorySummary: "客室・団体・VIP宿泊", tag: "ステイ",
    title: "高陽・一山 宿泊案内プラットフォーム",
    summary: "KINTEX・公演場・観光拠点周辺の宿泊情報を案内します。",
    duration: "1泊〜長期滞在", people: "1名〜300名", location: "KINTEX周辺および高陽の主要宿泊施設",
    subcategories: ["ホテル", "レジデンス", "団体宿泊"], priceLabel: "詳細はお問い合わせ",
  },
  "restaurant-booking-platform": {
    category: "レストラン案内", categorySummary: "団体食・コース・VIPディナー", tag: "ダイニング",
    title: "高陽・一山 レストラン案内プラットフォーム",
    summary: "団体食事と地域グルメ体験の情報を案内します。",
    duration: "1時間〜3時間", people: "2名〜200名", location: "高陽の主要レストランおよび観光特区",
    subcategories: ["団体食", "コースダイニング", "VIPディナー"], priceLabel: "詳細はお問い合わせ",
  },
  "cafe-booking-platform": {
    category: "ライフスタイル案内", categorySummary: "ブランチ・デザート・ミーティング", tag: "ライフスタイル",
    title: "ライフスタイル案内プラットフォーム",
    summary: "ブランチ・カフェ・ローカルスペース体験の情報を案内します。",
    duration: "1時間〜半日", people: "2名〜60名", location: "高陽のローカルカフェおよびライフスタイルスペース",
    subcategories: ["ブランチ", "デザート", "ミーティングスペース"], priceLabel: "詳細はお問い合わせ",
  },
  "ticket-agency-platform": {
    category: "チケット予約", categorySummary: "公演・展示・体験", tag: "チケット",
    title: "高陽・一山 チケット予約プラットフォーム",
    summary: "公演・展示・体験プログラムのチケットを一括でつなぐ予約プラットフォームです。",
    duration: "回次ごとに運営", people: "1名〜500名", location: "公演場および展示スペース",
    subcategories: ["公演", "展示", "体験"], priceLabel: "チケットあたり開始価格",
  },
  "airport-pickup-platform": {
    category: "空港送迎案内", categorySummary: "仁川・金浦・VIP移動", tag: "空港",
    title: "空港送迎案内プラットフォーム",
    summary: "空港送迎・ホテル・会場・市内移動の情報を案内します。",
    duration: "路線ごとに運営", people: "1名〜9名", location: "仁川空港 / 金浦空港〜高陽",
    subcategories: ["仁川ピックアップ", "仁川センディング", "金浦ピックアップ"], priceLabel: "詳細はお問い合わせ",
  },
  "medical-treatment-platform": {
    category: "高陽・一山 医療機関ガイド", categorySummary: "総合病院ご案内", tag: "総合病院",
    title: "高陽・一山 総合病院ご案内",
    summary: "高陽・一山の総合病院および専門医療機関の情報をご案内します。",
    duration: "各医療機関ご案内", people: "各医療機関ご案内", location: "高陽市の大学病院・専門医療機関",
    subcategories: ["総合診療", "専門診療", "健康検診"], priceLabel: "各医療機関へお問い合わせ",
  },
  "medical-beauty-platform": {
    category: "高陽・一山 医療機関ガイド", categorySummary: "美容医療ご案内", tag: "美容医療",
    title: "高陽・一山 美容医療ご案内",
    summary: "高陽・一山の美容医療施設の情報をご案内します。",
    duration: "各医療機関ご案内", people: "各医療機関ご案内", location: "高陽市の美容医療施設",
    subcategories: ["美容医療", "皮膚医療", "ウェルネス"], priceLabel: "各医療機関へお問い合わせ",
  },
  "medical-recovery-platform": {
    category: "高陽・一山 医療機関ガイド", categorySummary: "リハビリ医療ご案内", tag: "リハビリ",
    title: "高陽・一山 リハビリ医療ご案内",
    summary: "高陽・一山のリハビリ医療施設の情報をご案内します。",
    duration: "各医療機関ご案内", people: "各医療機関ご案内", location: "高陽市のリハビリ医療施設",
    subcategories: ["リハビリ医療", "回復ケア", "案内"], priceLabel: "各医療機関へお問い合わせ",
  },
};

// ── 简体中文 ──────────────────────────────────────────────
const zhCNCopy: Record<string, ProductCopy> = {
  "tour-experience-platform": {
    category: "旅游指南", categorySummary: "含体验项目", tag: "旅游",
    title: "高阳·一山旅游指南平台",
    summary: "以一体化流程指引演出、观光与本地体验信息。",
    duration: "半天至1天行程", people: "2人至80人", location: "高阳市全域",
    subcategories: ["城市游览", "本地体验", "家庭行程"], priceLabel: "详情咨询",
  },
  "stay-reservation-platform": {
    category: "住宿指南", categorySummary: "客房·团体·VIP住宿", tag: "住宿",
    title: "高阳·一山住宿指南平台",
    summary: "指引KINTEX、演出场馆及旅游据点周边的住宿信息。",
    duration: "1晚至长期滞留", people: "1人至300人", location: "KINTEX区域及高阳主要住宿",
    subcategories: ["酒店", "公寓式酒店", "团体住宿"], priceLabel: "详情咨询",
  },
  "restaurant-booking-platform": {
    category: "餐厅指南", categorySummary: "团体餐·套餐·VIP晚宴", tag: "餐饮",
    title: "高阳·一山餐厅指南平台",
    summary: "指引团体餐食与地方美食体验信息。",
    duration: "1小时至3小时", people: "2人至200人", location: "高阳主要餐厅及旅游特区",
    subcategories: ["团体餐", "套餐", "VIP晚宴"], priceLabel: "详情咨询",
  },
  "cafe-booking-platform": {
    category: "生活方式指南", categorySummary: "早午餐·甜点·会议空间", tag: "生活方式",
    title: "生活方式指南平台",
    summary: "指引早午餐、咖啡馆及本地空间体验信息。",
    duration: "1小时至半天", people: "2人至60人", location: "高阳本地咖啡馆及生活方式空间",
    subcategories: ["早午餐", "甜点", "会议空间"], priceLabel: "详情咨询",
  },
  "ticket-agency-platform": {
    category: "票务预约", categorySummary: "演出、展览、体验", tag: "票务",
    title: "高阳·一山票务预约平台",
    summary: "一站式连接演出、展览及体验项目票务的预约平台。",
    duration: "按场次运营", people: "1人至500人", location: "演出场馆及展览空间",
    subcategories: ["演出", "展览", "体验"], priceLabel: "每张票起始价格",
  },
  "airport-pickup-platform": {
    category: "机场接送指南", categorySummary: "仁川·金浦·VIP接送", tag: "机场",
    title: "机场接送指南平台",
    summary: "指引机场接送至酒店、场馆及市内出行信息。",
    duration: "按路线运营", people: "1人至9人", location: "仁川机场 / 金浦机场至高阳",
    subcategories: ["仁川接机", "仁川送机", "金浦接机"], priceLabel: "详情咨询",
  },
  "medical-treatment-platform": {
    category: "高阳·一山医疗机构信息", categorySummary: "综合医院信息", tag: "综合医院",
    title: "高阳·一山综合医院信息指南",
    summary: "介绍高阳·一山综合医院与专业医疗机构信息。",
    duration: "各医疗机构信息", people: "各医疗机构信息", location: "高阳市大学医院与专业医疗机构",
    subcategories: ["综合诊疗", "专业诊疗", "健康检查"], priceLabel: "请咨询各医疗机构",
  },
  "medical-beauty-platform": {
    category: "高阳·一山医疗机构信息", categorySummary: "美容医疗信息", tag: "美容医疗",
    title: "高阳·一山美容医疗信息指南",
    summary: "介绍高阳·一山美容医疗设施信息。",
    duration: "各医疗机构信息", people: "各医疗机构信息", location: "高阳市美容医疗设施",
    subcategories: ["美容医疗", "皮肤医疗", "康养"], priceLabel: "请咨询各医疗机构",
  },
  "medical-recovery-platform": {
    category: "高阳·一山医疗机构信息", categorySummary: "康复医疗信息", tag: "康复医疗",
    title: "高阳·一山康复医疗信息指南",
    summary: "介绍高阳·一山康复医疗设施信息。",
    duration: "各医疗机构信息", people: "各医疗机构信息", location: "高阳市康复医疗设施",
    subcategories: ["康复医疗", "康复护理", "信息指南"], priceLabel: "请咨询各医疗机构",
  },
};

// ── 繁體中文 ──────────────────────────────────────────────
const zhTWCopy: Record<string, ProductCopy> = {
  "tour-experience-platform": {
    category: "旅遊指南", categorySummary: "含體驗項目", tag: "旅遊",
    title: "高陽·一山旅遊指南平台",
    summary: "以一體化流程指引演出、觀光與在地體驗資訊。",
    duration: "半天至1天行程", people: "2人至80人", location: "高陽市全域",
    subcategories: ["城市遊覽", "在地體驗", "家庭行程"], priceLabel: "詳情諮詢",
  },
  "stay-reservation-platform": {
    category: "住宿指南", categorySummary: "客房·團體·VIP住宿", tag: "住宿",
    title: "高陽·一山住宿指南平台",
    summary: "指引KINTEX、演出場館及旅遊據點周邊的住宿資訊。",
    duration: "1晚至長期滯留", people: "1人至300人", location: "KINTEX區域及高陽主要住宿",
    subcategories: ["酒店", "公寓式酒店", "團體住宿"], priceLabel: "詳情諮詢",
  },
  "restaurant-booking-platform": {
    category: "餐廳指南", categorySummary: "團體餐·套餐·VIP晚宴", tag: "餐飲",
    title: "高陽·一山餐廳指南平台",
    summary: "指引團體餐食與在地美食體驗資訊。",
    duration: "1小時至3小時", people: "2人至200人", location: "高陽主要餐廳及旅遊特區",
    subcategories: ["團體餐", "套餐", "VIP晚宴"], priceLabel: "詳情諮詢",
  },
  "cafe-booking-platform": {
    category: "生活風格指南", categorySummary: "早午餐·甜點·會議空間", tag: "生活風格",
    title: "生活風格指南平台",
    summary: "指引早午餐、咖啡廳及在地空間體驗資訊。",
    duration: "1小時至半天", people: "2人至60人", location: "高陽在地咖啡廳及生活風格空間",
    subcategories: ["早午餐", "甜點", "會議空間"], priceLabel: "詳情諮詢",
  },
  "ticket-agency-platform": {
    category: "票務預約", categorySummary: "演出、展覽、體驗", tag: "票務",
    title: "高陽·一山票務預約平台",
    summary: "一站式連結演出、展覽及體驗項目票務的預約平台。",
    duration: "按場次運營", people: "1人至500人", location: "演出場館及展覽空間",
    subcategories: ["演出", "展覽", "體驗"], priceLabel: "每張票起始價格",
  },
  "airport-pickup-platform": {
    category: "機場接送指南", categorySummary: "仁川·金浦·VIP接送", tag: "機場",
    title: "機場接送指南平台",
    summary: "指引機場接送至酒店、場館及市內出行資訊。",
    duration: "按路線運營", people: "1人至9人", location: "仁川機場 / 金浦機場至高陽",
    subcategories: ["仁川接機", "仁川送機", "金浦接機"], priceLabel: "詳情諮詢",
  },
  "medical-treatment-platform": {
    category: "高陽·一山醫療機構資訊", categorySummary: "綜合醫院資訊", tag: "綜合醫院",
    title: "高陽·一山綜合醫院資訊指南",
    summary: "介紹高陽·一山綜合醫院與專業醫療機構資訊。",
    duration: "各醫療機構資訊", people: "各醫療機構資訊", location: "高陽市大學醫院與專業醫療機構",
    subcategories: ["綜合診療", "專業診療", "健康檢查"], priceLabel: "請洽詢各醫療機構",
  },
  "medical-beauty-platform": {
    category: "高陽·一山醫療機構資訊", categorySummary: "美容醫療資訊", tag: "美容醫療",
    title: "高陽·一山美容醫療資訊指南",
    summary: "介紹高陽·一山美容醫療設施資訊。",
    duration: "各醫療機構資訊", people: "各醫療機構資訊", location: "高陽市美容醫療設施",
    subcategories: ["美容醫療", "皮膚醫療", "養生"], priceLabel: "請洽詢各醫療機構",
  },
  "medical-recovery-platform": {
    category: "高陽·一山醫療機構資訊", categorySummary: "復健醫療資訊", tag: "復健醫療",
    title: "高陽·一山復健醫療資訊指南",
    summary: "介紹高陽·一山復健醫療設施資訊。",
    duration: "各醫療機構資訊", people: "各醫療機構資訊", location: "高陽市復健醫療設施",
    subcategories: ["復健醫療", "復健護理", "資訊指南"], priceLabel: "請洽詢各醫療機構",
  },
};

const copyByLocale: Record<LocaleKey, Record<string, ProductCopy>> = {
  ko: koCopy,
  en: enCopy,
  ja: jaCopy,
  "zh-CN": zhCNCopy,
  "zh-TW": zhTWCopy,
};

const buttonCopy: Record<LocaleKey, { details: string; reserve: string; guide: string }> = {
  ko:      { details: "상세 보기",   reserve: "예약하기",  guide: "안내 보기" },
  en:      { details: "View details", reserve: "Reserve",   guide: "View info" },
  ja:      { details: "詳細を見る",  reserve: "予約する",  guide: "案内を見る" },
  "zh-CN": { details: "查看详情",    reserve: "立即预约",  guide: "查看指南" },
  "zh-TW": { details: "查看詳情",    reserve: "立即預約",  guide: "查看指南" },
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
    <article className="group flex h-full flex-col overflow-hidden rounded-[20px] border border-white/80 bg-white/80 shadow-[0_8px_24px_rgba(16,32,58,0.08)] backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(16,32,58,0.13)]">
      {/* 카드 헤더 — 다크 그라데이션 (축소) */}
      <div className="relative flex flex-col overflow-hidden px-4 py-3 text-white sm:px-5 sm:py-4"
           style={{ background: "linear-gradient(145deg, #080e1a 0%, #0f1e38 35%, #1a3060 70%, #2a4a8a 100%)" }}>
        {/* 상단 네온 라인 */}
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-[#8df0cf] via-[#ffe98b] to-[#ffb58f]" />
        {/* 글로우 */}
        <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[#8df0cf]/15 blur-[32px]" />

        <div className="relative flex items-center justify-between gap-2">
          <span className="rounded-full border border-[#8df0cf]/25 bg-[#8df0cf]/12 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-[#8df0cf]/90">
            {product.badge}
          </span>
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.13em] text-white/60">
            <Icon className="h-3 w-3" />
            {display.tag}
          </span>
        </div>

        <h3 className="relative mt-2 line-clamp-1 text-[1.05rem] font-black leading-tight tracking-[-0.03em] text-white sm:text-[1.2rem]">
          {display.title}
        </h3>
        <p className="relative mt-1 line-clamp-1 text-[11px] leading-5 text-slate-400 sm:text-[12px]">
          {display.summary}
        </p>
      </div>

      <div className="flex flex-1 flex-col p-3 sm:p-4">
        {/* 카테고리 */}
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex rounded-full border border-white/60 bg-white/70 px-2.5 py-1 text-[11px] font-semibold text-slate-700 backdrop-blur">
            {display.category}
          </span>
          <span className="truncate text-right text-[11px] font-medium text-slate-400">
            {display.categorySummary}
          </span>
        </div>

        {/* 정보 그리드 — 수평 레이아웃으로 압축 */}
        <div className="mt-2 rounded-[12px] border border-white/60 bg-white/50 px-3 py-2 backdrop-blur">
          <div className="grid grid-cols-1 gap-1 text-[11px] text-slate-600 sm:text-[12px]">
            <div className="flex items-center gap-2">
              <CalendarClock className="h-3.5 w-3.5 shrink-0 text-[#0a6b48]" />
              <span className="truncate">{display.duration}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-3.5 w-3.5 shrink-0 text-[#3655a6]" />
              <span className="truncate">{display.people}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-[#9b3a1a]" />
              <span className="truncate">{display.location}</span>
            </div>
          </div>
        </div>

        {/* 서브카테고리 태그 */}
        <div className="mt-2 flex flex-wrap gap-1">
          {display.subcategories.slice(0, 3).map((item) => (
            <span
              key={item}
              className="rounded-full border border-white/70 bg-white/70 px-2.5 py-0.5 text-[10px] font-semibold text-slate-600 backdrop-blur"
            >
              {item}
            </span>
          ))}
        </div>

        {/* 가격 — 티켓 카테고리에서만 표시 (공연·전시 정당 판매) */}
        {product.categoryKey === "ticket" && (
          <div className="mt-2 overflow-hidden rounded-[12px] border border-white/60 bg-gradient-to-br from-[#f0f4ff] to-[#eef2ff] px-3 py-2">
            <div className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400">
              {display.priceLabel}
            </div>
            <div className="mt-0.5 text-[1.25rem] font-black tracking-[-0.03em] text-slate-950 sm:text-[1.4rem]">
              {product.price > 0 ? `₩${product.price.toLocaleString("ko-KR")}` : display.priceLabel}
            </div>
          </div>
        )}

        {/* 버튼 — 티켓만 "예약", 나머지는 "안내" */}
        <div className="mt-auto grid grid-cols-2 gap-2 pt-3">
          <Link
            href={`/products#section-${product.categoryKey}`}
            className="inline-flex min-h-9 items-center justify-center gap-1 rounded-full bg-gradient-to-r from-[#10203a] to-[#1e3a6e] px-3 text-[11px] font-bold text-white transition hover:brightness-110 sm:min-h-10"
          >
            {ui.details}
            <ArrowRight className="h-3 w-3" />
          </Link>
          <Link
            href={`/products#section-${product.categoryKey}`}
            className="inline-flex min-h-9 items-center justify-center rounded-full border border-white/70 bg-white/80 px-3 text-[11px] font-semibold text-slate-700 backdrop-blur transition hover:bg-white sm:min-h-10"
          >
            {product.categoryKey === "ticket" ? ui.reserve : ui.guide}
          </Link>
        </div>
      </div>
    </article>
  );
}
