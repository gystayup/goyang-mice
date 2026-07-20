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
  "medical-treatment-platform": {
    category: "고양메디컬투어", categorySummary: "질병치료형", tag: "메디컬",
    title: "질병치료형 예약 플랫폼",
    summary: "맞춤상담, 진료예약, 공항픽업, 숙박지원, 통역서비스, 사후관리까지 원스톱으로 연결합니다.",
    duration: "단기 진료 ~ 장기 체류", people: "1명 ~ 10명", location: "고양 대학병원 및 전문 의료기관",
    subcategories: ["암·중증질환", "여성질환", "정밀치료"], priceLabel: "진료 상담 후 견적",
  },
  "medical-beauty-platform": {
    category: "고양메디컬투어", categorySummary: "건강미용 증진형", tag: "K-뷰티",
    title: "건강미용 증진형 예약 플랫폼",
    summary: "프리미엄 스테이, 편리한 접근성, 다국어 응대 기반으로 성형·피부·웰니스를 예약합니다.",
    duration: "당일 시술 ~ 2주 체류", people: "1명 ~ 6명", location: "고양 K-뷰티 클리닉 및 프리미엄 스테이",
    subcategories: ["성형", "피부", "웰니스"], priceLabel: "프로그램별 상담 견적",
  },
  "medical-recovery-platform": {
    category: "고양메디컬투어", categorySummary: "회복·재활형", tag: "회복",
    title: "회복·재활 예약 플랫폼",
    summary: "편안한 숙박, 맞춤 식이관리, 의료 일정 관리, 심리상담, 자연·휴식, 정기 체크까지 운영합니다.",
    duration: "1주 ~ 장기 체류", people: "1명 ~ 4명", location: "고양 회복 거점 스테이 및 재활 기관",
    subcategories: ["회복체류", "재활", "보호자 동반"], priceLabel: "체류 기간별 상담 견적",
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
  "medical-treatment-platform": {
    category: "Goyang Medical Tour", categorySummary: "Disease Treatment", tag: "Medical",
    title: "Medical Treatment Booking Platform",
    summary: "Connects consultation, treatment booking, airport pickup, stay, interpretation and follow-up in one flow.",
    duration: "Short treatment to extended stay", people: "1 to 10 guests", location: "Major hospitals in Goyang",
    subcategories: ["Cancer / Serious Illness", "Women's Health", "Precision Care"], priceLabel: "Quote after consultation",
  },
  "medical-beauty-platform": {
    category: "Goyang Medical Tour", categorySummary: "Health & Beauty", tag: "K-Beauty",
    title: "Health & Beauty Booking Platform",
    summary: "Premium stay, convenient access and multi-language support for aesthetics, dermatology and wellness.",
    duration: "Same-day to 2-week stay", people: "1 to 6 guests", location: "Goyang K-Beauty clinics and premium stays",
    subcategories: ["Aesthetic", "Dermatology", "Wellness"], priceLabel: "Quote by program",
  },
  "medical-recovery-platform": {
    category: "Goyang Medical Tour", categorySummary: "Recovery & Rehab", tag: "Recovery",
    title: "Recovery & Rehabilitation Booking Platform",
    summary: "Comfortable stay, tailored diet, medical schedule, counseling, nature rest and regular check-ups.",
    duration: "1 week to long stay", people: "1 to 4 guests", location: "Goyang recovery stays and rehab facilities",
    subcategories: ["Recovery Stay", "Rehabilitation", "Caregiver Support"], priceLabel: "Quote by stay length",
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
  "medical-treatment-platform": {
    category: "高陽メディカルツアー", categorySummary: "疾病治療型", tag: "メディカル",
    title: "疾病治療型予約プラットフォーム",
    summary: "相談、診療予約、空港送迎、宿泊支援、通訳、アフターケアまでワンストップでつなぎます。",
    duration: "短期診療〜長期滞在", people: "1名〜10名", location: "高陽の大学病院および専門医療機関",
    subcategories: ["がん・重症疾患", "女性疾患", "精密治療"], priceLabel: "相談後の見積もり",
  },
  "medical-beauty-platform": {
    category: "高陽メディカルツアー", categorySummary: "健康美容増進型", tag: "K-ビューティ",
    title: "健康美容増進型予約プラットフォーム",
    summary: "プレミアムステイ・便利なアクセス・多言語対応で美容・皮膚・ウェルネスを予約します。",
    duration: "当日施術〜2週間滞在", people: "1名〜6名", location: "高陽K-ビューティクリニックおよびプレミアムステイ",
    subcategories: ["美容", "皮膚科", "ウェルネス"], priceLabel: "プログラム別相談見積もり",
  },
  "medical-recovery-platform": {
    category: "高陽メディカルツアー", categorySummary: "回復・リハビリ型", tag: "リカバリー",
    title: "回復・リハビリ予約プラットフォーム",
    summary: "快適な宿泊、食事管理、医療日程、カウンセリング、自然・休息、定期チェックまで運営します。",
    duration: "1週間〜長期滞在", people: "1名〜4名", location: "高陽の回復ステイおよびリハビリ機関",
    subcategories: ["回復滞在", "リハビリ", "付き添いサポート"], priceLabel: "滞在期間別見積もり",
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
  "medical-treatment-platform": {
    category: "高阳医疗旅游", categorySummary: "疾病治疗型", tag: "医疗",
    title: "疾病治疗型预约平台",
    summary: "咨询、就诊预约、机场接送、住宿、翻译与后续管理一站式衔接。",
    duration: "短期诊疗至长期驻留", people: "1人至10人", location: "高阳大学医院及专业医疗机构",
    subcategories: ["癌症·重症", "妇科", "精密诊疗"], priceLabel: "咨询后报价",
  },
  "medical-beauty-platform": {
    category: "高阳医疗旅游", categorySummary: "健康美容增进型", tag: "K-美妆",
    title: "健康美容增进型预约平台",
    summary: "以高端驻留、便捷通勤与多语言服务预约整形、皮肤与康养项目。",
    duration: "当日手术至2周驻留", people: "1人至6人", location: "高阳K-美妆诊所及高端驻留",
    subcategories: ["整形", "皮肤", "康养"], priceLabel: "按项目咨询报价",
  },
  "medical-recovery-platform": {
    category: "高阳医疗旅游", categorySummary: "恢复·康复型", tag: "康复",
    title: "恢复·康复预约平台",
    summary: "舒适住宿、定制膳食、医疗日程、心理咨询、自然休憩与定期体检一站式运营。",
    duration: "1周至长期驻留", people: "1人至4人", location: "高阳康复驻留与康复机构",
    subcategories: ["康复驻留", "康复治疗", "陪护服务"], priceLabel: "按驻留期咨询报价",
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
  "medical-treatment-platform": {
    category: "高陽醫療旅遊", categorySummary: "疾病治療型", tag: "醫療",
    title: "疾病治療型預約平台",
    summary: "諮詢、就診預約、機場接送、住宿、翻譯與後續管理一站式銜接。",
    duration: "短期診療至長期駐留", people: "1人至10人", location: "高陽大學醫院及專業醫療機構",
    subcategories: ["癌症·重症", "婦科", "精密診療"], priceLabel: "諮詢後報價",
  },
  "medical-beauty-platform": {
    category: "高陽醫療旅遊", categorySummary: "健康美容增進型", tag: "K-美妝",
    title: "健康美容增進型預約平台",
    summary: "以高端駐留、便捷通勤與多語言服務預約整形、皮膚與養生方案。",
    duration: "當日手術至2週駐留", people: "1人至6人", location: "高陽K-美妝診所及高端駐留",
    subcategories: ["整形", "皮膚", "養生"], priceLabel: "按方案諮詢報價",
  },
  "medical-recovery-platform": {
    category: "高陽醫療旅遊", categorySummary: "恢復·復健型", tag: "復健",
    title: "恢復·復健預約平台",
    summary: "舒適住宿、定制膳食、醫療日程、心理諮詢、自然休憩與定期體檢一站式營運。",
    duration: "1週至長期駐留", people: "1人至4人", location: "高陽恢復駐留與復健機構",
    subcategories: ["恢復駐留", "復健治療", "陪護服務"], priceLabel: "按駐留期諮詢報價",
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

        {/* 가격 — 티켓 카테고리에서만 표시 */}
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

        {/* 버튼 */}
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
