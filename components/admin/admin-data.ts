import type { Booking } from "@/lib/database";
import { dmcCategories, products as catalogProducts } from "@/data/products";

export type AdminTab =
  | "dashboard"
  | "bookings"
  | "airport"
  | "ticketing"
  | "payments"
  | "schedules"
  | "stay"
  | "products"
  | "news"
  | "research-archive"
  | "hero-slides"
  | "social-links"
  | "inquiries"
  | "users"
  | "settings";

export type PaymentStatus =
  | "pending_deposit"
  | "deposit_paid"
  | "balance_due"
  | "paid"
  | "refund_review";

export type ScheduleStatus = "planned" | "open" | "operating" | "closed";

export type StayOperationStatus =
  | "rooming"
  | "ready"
  | "check_in"
  | "in_house"
  | "check_out"
  | "completed";

export type AirportTransferStatus =
  | "requested"
  | "quoted"
  | "driver_assigned"
  | "boarding"
  | "completed"
  | "cancelled";

export type TicketingStatus =
  | "received"
  | "ready_to_issue"
  | "issued"
  | "refunded"
  | "cancelled";

export type NewsStatus = "draft" | "scheduled" | "published" | "archived";
export type NewsCategory = "announcement" | "event" | "research" | "press" | "operation";

export type NewsRecord = {
  id: string;
  title_ko: string;
  title_en: string;
  title_ja: string;
  title_zhCN: string;
  title_zhTW: string;
  category: NewsCategory;
  author: string;
  publish_date: string;
  status: NewsStatus;
  views: number;
  note: string;
};

export type PaymentRecord = {
  id: string;
  product_id: string;
  payer_name: string;
  organization_name: string;
  payment_method: string;
  total_amount: number;
  deposit_amount: number;
  balance_amount: number;
  due_date: string;
  status: PaymentStatus;
  note: string;
};

export type ScheduleRecord = {
  id: string;
  product_id: string;
  subcategory: string;
  date: string;
  start_time: string;
  end_time: string;
  capacity: number;
  booked_count: number;
  operator: string;
  status: ScheduleStatus;
};

export type StayOperationRecord = {
  id: string;
  product_id: string;
  property_name: string;
  room_type: string;
  check_in_date: string;
  check_out_date: string;
  rooms_blocked: number;
  guests: number;
  shuttle_required: boolean;
  housekeeping_status: "ready" | "pending" | "completed";
  status: StayOperationStatus;
  note: string;
};

export type AirportTransferRecord = {
  id: string;
  product_id: string;
  route_label: string;
  transfer_mode: "pickup" | "sending";
  airport_name: string;
  origin: string;
  destination: string;
  service_date: string;
  passengers: number;
  vehicle_name: string;
  driver_name: string;
  amount: number;
  status: AirportTransferStatus;
  note: string;
};

export type TicketingRecord = {
  id: string;
  product_id: string;
  ticket_name: string;
  option_label: string;
  venue: string;
  event_date: string;
  purchaser_name: string;
  quantity: number;
  amount: number;
  status: TicketingStatus;
  note: string;
};

export const navItems = [
  { id: "dashboard", label: "대시보드" },
  { id: "bookings", label: "예약 관리" },
  { id: "airport", label: "공항 운영" },
  { id: "ticketing", label: "발권 운영" },
  { id: "payments", label: "결제 관리" },
  { id: "schedules", label: "스케줄 관리" },
  { id: "stay", label: "숙박 운영" },
  { id: "products", label: "상품 운영" },
  { id: "news", label: "뉴스·공지" },
  { id: "research-archive", label: "연구 아카이브" },
  { id: "hero-slides", label: "히어로 슬라이드" },
  { id: "social-links", label: "SNS 관리" },
  { id: "inquiries", label: "문의 관리" },
  { id: "users", label: "사용자 관리" },
  { id: "settings", label: "설정" },
] as const satisfies ReadonlyArray<{ id: AdminTab; label: string }>;

export const newsStatusOrder: NewsStatus[] = ["draft", "scheduled", "published", "archived"];

export const bookingStatusOrder: Booking["status"][] = [
  "received",
  "reviewing",
  "confirmed",
  "on_hold",
  "cancelled",
];

export const paymentStatusOrder: PaymentStatus[] = [
  "pending_deposit",
  "deposit_paid",
  "balance_due",
  "paid",
  "refund_review",
];

export const scheduleStatusOrder: ScheduleStatus[] = [
  "planned",
  "open",
  "operating",
  "closed",
];

export const stayStatusOrder: StayOperationStatus[] = [
  "rooming",
  "ready",
  "check_in",
  "in_house",
  "check_out",
  "completed",
];

export const airportTransferStatusOrder: AirportTransferStatus[] = [
  "requested",
  "quoted",
  "driver_assigned",
  "boarding",
  "completed",
  "cancelled",
];

export const ticketingStatusOrder: TicketingStatus[] = [
  "received",
  "ready_to_issue",
  "issued",
  "refunded",
  "cancelled",
];

export const addDays = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
};

export function createDemoBookings(): Booking[] {
  return [
    {
      id: "demo-booking-1",
      booking_no: "BK-20260407-001",
      product_id: "stay-reservation-platform",
      customer_name: "김지현",
      organization_name: "글로벌 이벤트 그룹",
      phone: "010-1234-5678",
      email: "stay@example.com",
      booking_date: new Date(addDays(2)),
      guest_count: 32,
      total_price: 3840000,
      request_note: "VIP 숙박 6객실 포함 / 셔틀 요청",
      status: "reviewing",
      privacy_agreed: true,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: "demo-booking-2",
      booking_no: "BK-20260407-002",
      product_id: "tour-experience-platform",
      customer_name: "박정우",
      organization_name: "서울 MICE 포럼",
      phone: "010-2222-3333",
      email: "tour@example.com",
      booking_date: new Date(addDays(4)),
      guest_count: 24,
      total_price: 1416000,
      request_note: "영어 가이드 / 킨텍스 그룹",
      status: "confirmed",
      privacy_agreed: true,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: "demo-booking-3",
      booking_no: "BK-20260407-003",
      product_id: "restaurant-booking-platform",
      customer_name: "이예지",
      organization_name: "고양컨벤션",
      phone: "010-4444-5555",
      email: "dining@example.com",
      booking_date: new Date(addDays(1)),
      guest_count: 48,
      total_price: 1680000,
      request_note: "알레르기 인원 2명 / 단체석",
      status: "received",
      privacy_agreed: true,
      created_at: new Date(),
      updated_at: new Date(),
    },
  ];
}

export function createInitialPayments(): PaymentRecord[] {
  return [
    {
      id: "pay-1",
      product_id: "stay-reservation-platform",
      payer_name: "김지현",
      organization_name: "글로벌 이벤트 그룹",
      payment_method: "법인카드 + 세금계산서",
      total_amount: 3840000,
      deposit_amount: 960000,
      balance_amount: 2880000,
      due_date: addDays(1),
      status: "pending_deposit",
      note: "객실 블록 확정 후 예약금 대기",
    },
    {
      id: "pay-2",
      product_id: "tour-experience-platform",
      payer_name: "박정우",
      organization_name: "서울 MICE 포럼",
      payment_method: "온라인 카드결제",
      total_amount: 1416000,
      deposit_amount: 1416000,
      balance_amount: 0,
      due_date: addDays(0),
      status: "paid",
      note: "전액 결제 완료",
    },
    {
      id: "pay-3",
      product_id: "restaurant-booking-platform",
      payer_name: "이예지",
      organization_name: "고양컨벤션",
      payment_method: "예약금 + 현장정산",
      total_amount: 1680000,
      deposit_amount: 420000,
      balance_amount: 1260000,
      due_date: addDays(2),
      status: "deposit_paid",
      note: "잔금은 행사 1일 전 정산",
    },
    {
      id: "pay-4",
      product_id: "ticket-agency-platform",
      payer_name: "최도윤",
      organization_name: "K-POP VISIT",
      payment_method: "단체 후불",
      total_amount: 2640000,
      deposit_amount: 0,
      balance_amount: 2640000,
      due_date: addDays(5),
      status: "balance_due",
      note: "단체 발권 후 정산 예정",
    },
  ];
}

export function createInitialSchedules(): ScheduleRecord[] {
  return [
    {
      id: "sch-1",
      product_id: "stay-reservation-platform",
      subcategory: "호텔",
      date: addDays(2),
      start_time: "15:00",
      end_time: "23:00",
      capacity: 80,
      booked_count: 32,
      operator: "숙박 운영팀",
      status: "operating",
    },
    {
      id: "sch-2",
      product_id: "tour-experience-platform",
      subcategory: "킨텍스 연계 코스",
      date: addDays(4),
      start_time: "10:00",
      end_time: "18:00",
      capacity: 40,
      booked_count: 24,
      operator: "투어 운영팀",
      status: "open",
    },
    {
      id: "sch-3",
      product_id: "restaurant-booking-platform",
      subcategory: "단체 식사",
      date: addDays(1),
      start_time: "19:00",
      end_time: "21:00",
      capacity: 60,
      booked_count: 48,
      operator: "F&B 운영팀",
      status: "planned",
    },
    {
      id: "sch-4",
      product_id: "cafe-booking-platform",
      subcategory: "브런치",
      date: addDays(3),
      start_time: "09:30",
      end_time: "11:30",
      capacity: 36,
      booked_count: 18,
      operator: "라이프스타일 운영팀",
      status: "open",
    },
    {
      id: "sch-5",
      product_id: "ticket-agency-platform",
      subcategory: "공연 티켓",
      date: addDays(5),
      start_time: "18:00",
      end_time: "20:30",
      capacity: 120,
      booked_count: 84,
      operator: "발권 운영팀",
      status: "operating",
    },
  ];
}

export function createInitialStayOperations(): StayOperationRecord[] {
  return [
    {
      id: "stay-op-1",
      product_id: "stay-reservation-platform",
      property_name: "소노캄 비즈니스 스테이",
      room_type: "디럭스 트윈 18실 / 스위트 2실",
      check_in_date: addDays(2),
      check_out_date: addDays(4),
      rooms_blocked: 20,
      guests: 32,
      shuttle_required: true,
      housekeeping_status: "ready",
      status: "ready",
      note: "VIP 룸 2실 어메니티 별도 준비",
    },
    {
      id: "stay-op-2",
      product_id: "stay-reservation-platform",
      property_name: "고양 프리미엄 레지던스",
      room_type: "패밀리룸 12실",
      check_in_date: addDays(6),
      check_out_date: addDays(8),
      rooms_blocked: 12,
      guests: 24,
      shuttle_required: false,
      housekeeping_status: "pending",
      status: "rooming",
      note: "가족 체험 프로그램 연계",
    },
  ];
}

export function createInitialAirportTransfers(): AirportTransferRecord[] {
  return [
    {
      id: "airport-1",
      product_id: "airport-pickup-platform",
      route_label: "인천공항 픽업",
      transfer_mode: "pickup",
      airport_name: "인천국제공항",
      origin: "인천국제공항 제2터미널",
      destination: "킨텍스 제1전시장 VIP 라운지",
      service_date: addDays(1),
      passengers: 3,
      vehicle_name: "프리미엄 SUV 5인",
      driver_name: "김민수 기사",
      amount: 148000,
      status: "driver_assigned",
      note: "도착편 지연 가능성 있어 20분 전 재확인 예정",
    },
    {
      id: "airport-2",
      product_id: "airport-pickup-platform",
      route_label: "김포공항 샌딩",
      transfer_mode: "sending",
      airport_name: "김포국제공항",
      origin: "고양 소노캄 호텔",
      destination: "김포국제공항 국제선",
      service_date: addDays(2),
      passengers: 2,
      vehicle_name: "시티 샌딩 세단 3인",
      driver_name: "박도윤 기사",
      amount: 59000,
      status: "quoted",
      note: "출국 3시간 전 출발 권장 안내 완료",
    },
    {
      id: "airport-3",
      product_id: "airport-pickup-platform",
      route_label: "인천공항 샌딩",
      transfer_mode: "sending",
      airport_name: "인천국제공항",
      origin: "고양콘 공연장 후문",
      destination: "인천국제공항 제1터미널",
      service_date: addDays(3),
      passengers: 9,
      vehicle_name: "그룹 밴 9인",
      driver_name: "이현우 기사",
      amount: 219000,
      status: "requested",
      note: "공연 종료 시각 확정 후 최종 배차 예정",
    },
  ];
}

export function createInitialTicketingRecords(): TicketingRecord[] {
  return [
    {
      id: "ticket-1",
      product_id: "ticket-agency-platform",
      ticket_name: "GOYANG K-POP ARENA OPEN STAGE",
      option_label: "VIP 패키지",
      venue: "고양 K-POP 아레나",
      event_date: addDays(7),
      purchaser_name: "정하늘",
      quantity: 2,
      amount: 396000,
      status: "ready_to_issue",
      note: "모바일 티켓 우선 발송 요청",
    },
    {
      id: "ticket-2",
      product_id: "ticket-agency-platform",
      ticket_name: "GOYANG ART NIGHT EXHIBITION",
      option_label: "도슨트 패키지",
      venue: "고양아람누리 전시관",
      event_date: addDays(4),
      purchaser_name: "민서연",
      quantity: 4,
      amount: 168000,
      status: "issued",
      note: "단체 QR 발권 완료",
    },
    {
      id: "ticket-3",
      product_id: "ticket-agency-platform",
      ticket_name: "GOYANG CON CITY FESTIVAL",
      option_label: "양일권",
      venue: "일산 문화광장",
      event_date: addDays(30),
      purchaser_name: "K-POP VISIT",
      quantity: 12,
      amount: 1548000,
      status: "received",
      note: "법인 후불 정산 요청",
    },
  ];
}

export const productMap = new Map(
  catalogProducts.map((product) => [product.id, product])
);

export function createInitialNews(): NewsRecord[] {
  return [
    {
      id: "news-1",
      title_ko: "2026 고양 K-POP 아레나 오픈 스테이지 공식 발표",
      title_en: "2026 Goyang K-POP Arena Open Stage Official Announcement",
      title_ja: "2026 高陽 K-POP アリーナ オープンステージ 公式発表",
      title_zhCN: "2026年高阳K-POP竞技场开放舞台官方公告",
      title_zhTW: "2026年高陽K-POP競技場開放舞台官方公告",
      category: "event",
      author: "운영팀",
      publish_date: addDays(3),
      status: "scheduled",
      views: 0,
      note: "SNS 동시 배포 예정",
    },
    {
      id: "news-2",
      title_ko: "KINTEX 연계 바이어 투어 프로그램 신규 출시",
      title_en: "New KINTEX-Linked Buyer Tour Program Launch",
      title_ja: "KINTEX連携バイヤーツアープログラム新規リリース",
      title_zhCN: "KINTEX联动买家参观项目全新推出",
      title_zhTW: "KINTEX聯動買家參觀方案全新推出",
      category: "announcement",
      author: "DMC 운영팀",
      publish_date: addDays(-2),
      status: "published",
      views: 342,
      note: "영문 보도자료 배포 완료",
    },
    {
      id: "news-3",
      title_ko: "고양시 관광·MICE 전략 연구 보고서 발간",
      title_en: "Goyang City Tourism & MICE Strategy Research Report Published",
      title_ja: "高陽市観光・MICE戦略研究レポート発刊",
      title_zhCN: "高阳市旅游·MICE战略研究报告发布",
      title_zhTW: "高陽市旅遊·MICE策略研究報告發布",
      category: "research",
      author: "연구소",
      publish_date: addDays(-7),
      status: "published",
      views: 891,
      note: "PDF 다운로드 링크 연결 완료",
    },
    {
      id: "news-4",
      title_ko: "2026 봄 시즌 로컬투어 상품 업데이트",
      title_en: "2026 Spring Season Local Tour Products Update",
      title_ja: "2026年春シーズン ローカルツアー商品アップデート",
      title_zhCN: "2026年春季本地游产品更新",
      title_zhTW: "2026年春季在地旅遊產品更新",
      category: "operation",
      author: "투어 운영팀",
      publish_date: addDays(7),
      status: "draft",
      views: 0,
      note: "초안 검토 후 발행 예정",
    },
    {
      id: "news-5",
      title_ko: "[보도자료] 고양 DMC, 일본·중화권 여행사 파트너십 체결",
      title_en: "[Press Release] Goyang DMC Signs Partnership with Japan & Chinese Travel Agencies",
      title_ja: "【プレスリリース】高陽DMC、日本・中華圏旅行会社とパートナーシップ締結",
      title_zhCN: "【新闻稿】高阳DMC与日本及华语圈旅行社签署合作协议",
      title_zhTW: "【新聞稿】高陽DMC與日本及華語圈旅行社簽署合作協議",
      category: "press",
      author: "대외협력팀",
      publish_date: addDays(-14),
      status: "archived",
      views: 1240,
      note: "국내외 주요 미디어 배포 완료",
    },
  ];
}

export { catalogProducts, dmcCategories };
