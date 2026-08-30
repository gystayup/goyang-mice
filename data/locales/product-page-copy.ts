import { pick, type LocalizedText, type PageLocale } from "./types";

type ProductPageCopy = {
  eyebrow: LocalizedText;
  title: LocalizedText;
  description: LocalizedText;
  summary: LocalizedText;
};

const productPageCopy: Record<string, ProductPageCopy> = {
  "tour-experience-platform": {
    eyebrow: { ko: "투어·체험", en: "Tours & Experiences", ja: "ツアー・体験", "zh-CN": "旅游·体验", "zh-TW": "旅遊·體驗" },
    title: { ko: "고양 여행상품예약 플랫폼", en: "Goyang Travel Product Booking Platform", ja: "高陽 旅行商品予約プラットフォーム", "zh-CN": "高阳旅游产品预约平台", "zh-TW": "高陽旅遊產品預約平台" },
    description: {
      ko: "고양의 문화, 관광, 공연, 체험 자산을 하나의 여행상품 구조로 연결해 예약과 운영을 함께 관리하는 서비스입니다.",
      en: "A service that connects Goyang's culture, tourism, performance, and experience assets into one travel-product booking structure.",
      ja: "高陽の文化、観光、公演、体験資産をひとつの旅行商品構造でつなぎ、予約と運営を一括管理するサービスです。",
      "zh-CN": "将高阳的文化、旅游、演出、体验资产整合为一体化旅游产品预约与运营服务。",
      "zh-TW": "將高陽的文化、旅遊、演出、體驗資產整合為一體化旅遊產品預約與營運服務。",
    },
    summary: {
      ko: "공연 전후 일정에 맞춘 반일 코스, 1일 체험, 로컬 투어를 하나의 예약 흐름으로 운영합니다.",
      en: "Half-day plans, one-day experiences, and local tours are managed in one booking flow around event schedules.",
      ja: "公演前後の日程に合わせた半日コース、1日体験、ローカルツアーをひとつの予約フローで運営します。",
      "zh-CN": "围绕演出日程，将半日游、一日体验及本地游览整合为一体化预约流程。",
      "zh-TW": "圍繞演出日程，將半日遊、一日體驗及在地遊覽整合為一體化預約流程。",
    },
  },
  "stay-reservation-platform": {
    eyebrow: { ko: "숙박예약", en: "Accommodation Booking", ja: "宿泊予約", "zh-CN": "住宿预约", "zh-TW": "住宿預約" },
    title: { ko: "고양 숙박예약 운영 플랫폼", en: "Goyang Accommodation Booking Platform", ja: "高陽 宿泊予約運営プラットフォーム", "zh-CN": "高阳住宿预约运营平台", "zh-TW": "高陽住宿預約營運平台" },
    description: {
      ko: "KINTEX, 공연장, 관광 거점을 방문하는 고객을 위한 객실 예약과 체류 운영을 함께 지원합니다.",
      en: "Room booking and stay operations for visitors heading to KINTEX, venues, and tourism hubs.",
      ja: "KINTEX、公演場、観光拠点を訪れるお客様のための客室予約と滞在運営を一括サポートします。",
      "zh-CN": "为前往KINTEX、演出场馆及旅游据点的访客提供客房预约与驻留运营一体化服务。",
      "zh-TW": "為前往KINTEX、演出場館及旅遊據點的訪客提供客房預約與駐留營運一體化服務。",
    },
    summary: {
      ko: "객실 예약, 그룹 룸블록, VIP 스테이까지 하나의 운영 구조로 연결합니다.",
      en: "Individual rooms, group room blocks, and VIP stays are connected within one operating structure.",
      ja: "客室予約、グループルームブロック、VIPステイまでひとつの運営構造でつなぎます。",
      "zh-CN": "将客房预约、团体房间块及VIP住宿整合为一体化运营结构。",
      "zh-TW": "將客房預約、團體房間塊及VIP住宿整合為一體化營運結構。",
    },
  },
  "restaurant-booking-platform": {
    eyebrow: { ko: "음식점예약", en: "Restaurant Booking", ja: "飲食店予約", "zh-CN": "餐厅预约", "zh-TW": "餐廳預約" },
    title: { ko: "고양 음식점예약 플랫폼", en: "Goyang Restaurant Booking Platform", ja: "高陽 飲食店予約プラットフォーム", "zh-CN": "高阳餐厅预约平台", "zh-TW": "高陽餐廳預約平台" },
    description: {
      ko: "단체 식사, 로컬 미식, VIP 다이닝을 시간대와 목적에 맞춰 예약하고 운영합니다.",
      en: "Book and operate group dining, local food experiences, and VIP dining by schedule and purpose.",
      ja: "団体食事、ローカルグルメ、VIPダイニングを時間帯と目的に合わせて予約・運営します。",
      "zh-CN": "按时间与目的预约并运营团体用餐、本地美食体验及VIP餐饮服务。",
      "zh-TW": "按時間與目的預約並營運團體用餐、在地美食體驗及VIP餐飲服務。",
    },
    summary: {
      ko: "행사 식사부터 지역 미식 체험까지 하나의 예약 구조로 관리합니다.",
      en: "From event meals to local culinary experiences, everything is managed in one reservation structure.",
      ja: "行事食事から地域グルメ体験まで、ひとつの予約構造で管理します。",
      "zh-CN": "从活动用餐到本地美食体验，均在一体化预约结构中统一管理。",
      "zh-TW": "從活動用餐到在地美食體驗，均在一體化預約結構中統一管理。",
    },
  },
  "cafe-booking-platform": {
    eyebrow: { ko: "라이프스타일 예약", en: "Lifestyle Booking", ja: "ライフスタイル予約", "zh-CN": "生活方式预约", "zh-TW": "生活風格預約" },
    title: { ko: "라이프스타일 예약 플랫폼", en: "Lifestyle Booking Platform", ja: "ライフスタイル予約プラットフォーム", "zh-CN": "生活方式预约平台", "zh-TW": "生活風格預約平台" },
    description: {
      ko: "브런치, 카페, 감성 공간, 미팅 장소까지 한 번에 연결되는 라이프스타일 예약 서비스입니다.",
      en: "A lifestyle reservation service connecting brunch, cafes, mood spaces, and meeting places in one flow.",
      ja: "ブランチ、カフェ、感性空間、ミーティング場所まで一度につながるライフスタイル予約サービスです。",
      "zh-CN": "一站式连接早午餐、咖啡馆、氛围空间与会议场所的生活方式预约服务。",
      "zh-TW": "一站式連結早午餐、咖啡廳、氛圍空間與會議場所的生活風格預約服務。",
    },
    summary: {
      ko: "휴식, 모임, 체류 경험을 함께 설계하는 고양형 라이프스타일 예약 구조입니다.",
      en: "A Goyang lifestyle booking structure for rest, gatherings, and extended stay experiences.",
      ja: "休息、集まり、滞在体験を一緒に設計する高陽型ライフスタイル予約構造です。",
      "zh-CN": "专为休憩、聚会与驻留体验而设计的高阳式生活方式预约结构。",
      "zh-TW": "專為休憩、聚會與駐留體驗而設計的高陽式生活風格預約結構。",
    },
  },
  "ticket-agency-platform": {
    eyebrow: { ko: "티켓예약", en: "Ticket Booking", ja: "チケット予約", "zh-CN": "票务预约", "zh-TW": "票務預約" },
    title: { ko: "고양 티켓예약 플랫폼", en: "Goyang Ticket Booking Platform", ja: "高陽 チケット予約プラットフォーム", "zh-CN": "高阳票务预约平台", "zh-TW": "高陽票務預約平台" },
    description: {
      ko: "공연, 전시, 체험 프로그램 티켓을 비교하고 예약까지 이어지는 통합 발권 서비스입니다.",
      en: "An integrated ticketing service for browsing and booking performances, exhibitions, and activity programs.",
      ja: "公演、展示、体験プログラムのチケットを比較・予約できる統合発券サービスです。",
      "zh-CN": "可比较并预约演出、展览及体验项目票务的一体化售票服务。",
      "zh-TW": "可比較並預約演出、展覽及體驗方案票務的一體化售票服務。",
    },
    summary: {
      ko: "공연 일정, 좌석 옵션, 패키지 결제를 하나의 발권 흐름으로 연결합니다.",
      en: "Schedules, seating options, and package payments are connected in one ticketing flow.",
      ja: "公演スケジュール、座席オプション、パッケージ決済をひとつの発券フローでつなぎます。",
      "zh-CN": "将演出日程、座位选项与套餐支付整合为一体化售票流程。",
      "zh-TW": "將演出日程、座位選項與套餐支付整合為一體化售票流程。",
    },
  },
  "airport-pickup-platform": {
    eyebrow: { ko: "공항픽업예약", en: "Airport Pickup Booking", ja: "空港送迎予約", "zh-CN": "机场接送预约", "zh-TW": "機場接送預約" },
    title: { ko: "공항픽업예약 플랫폼", en: "Airport Pickup Booking Platform", ja: "空港送迎予約プラットフォーム", "zh-CN": "机场接送预约平台", "zh-TW": "機場接送預約平台" },
    description: {
      ko: "인천공항과 김포공항에서 고양 주요 거점까지 바로 연결되는 픽업·샌딩 서비스입니다.",
      en: "Pickup and sending services directly connecting Incheon and Gimpo airports with major Goyang destinations.",
      ja: "仁川空港と金浦空港から高陽の主要拠点まで直接つながるピックアップ・センディングサービスです。",
      "zh-CN": "连接仁川机场与金浦机场至高阳主要目的地的直达接送服务。",
      "zh-TW": "連結仁川機場與金浦機場至高陽主要目的地的直達接送服務。",
    },
    summary: {
      ko: "도착, 출발, 차량 선택, 현장 운영까지 하나의 이동 예약 구조로 연결합니다.",
      en: "Arrival, departure, vehicle selection, and on-site operations are managed in one transfer booking structure.",
      ja: "到着、出発、車両選択、現場運営までひとつの移動予約構造でつなぎます。",
      "zh-CN": "将到达、出发、车辆选择与现场运营整合为一体化接送预约结构。",
      "zh-TW": "將到達、出發、車輛選擇與現場營運整合為一體化接送預約結構。",
    },
  },
};

export function getProductPageCopy(locale: PageLocale, productId: string) {
  const copy = productPageCopy[productId];
  if (!copy) return null;

  return {
    eyebrow: pick(locale, copy.eyebrow),
    title: pick(locale, copy.title),
    description: pick(locale, copy.description),
    summary: pick(locale, copy.summary),
  };
}
