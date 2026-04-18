export type DmcCategoryKey =
  | "tour"
  | "stay"
  | "restaurant"
  | "cafe"
  | "ticket"
  | "airport"
  | "medical";

export interface DmcCategory {
  key: DmcCategoryKey;
  label: string;
  shortLabel: string;
  promoTitle: string;
  promoDesc: string;
  desc: string;
  subcategories: string[];
  reservationScope: string;
  operationsScope: string;
  managementScope: string;
  paymentScope: string;
}

export interface Product {
  id: string;
  slug: string;
  categoryKey: DmcCategoryKey;
  category: string;
  categorySummary: string;
  subcategories: string[];
  type: string;
  badge: string;
  title: string;
  desc: string;
  summary: string;
  duration: string;
  people: string;
  tag: string;
  location: string;
  price: number;
  priceLabel: string;
  highlights: string[];
  includes: string[];
  idealFor: string[];
  reservationFeatures: string[];
  operationFeatures: string[];
  managementFeatures: string[];
  paymentFeatures: string[];
  reservationSteps: Array<{
    title: string;
    desc: string;
  }>;
}

export const dmcCategories: DmcCategory[] = [
  {
    key: "tour",
    label: "여행상품",
    shortLabel: "Tour",
    promoTitle: "고양 로컬 여행과 체험을 연결하는 예약 서비스",
    promoDesc:
      "공연 관람 전후 일정, 가족형 체험, 로컬 투어, 관광특구 코스를 하나의 예약 흐름 안에서 연결합니다.",
    desc:
      "고양시 방문자 증대와 지역경제효과 확장을 목표로, 체험형 여행상품을 유연하게 운영할 수 있도록 설계했습니다.",
    subcategories: ["시티투어", "로컬 체험", "가족형 코스", "K-컬처 연계 코스"],
    reservationScope: "날짜, 인원, 언어, 차량, 코스 옵션을 기준으로 예약을 접수합니다.",
    operationsScope: "가이드 배정, 이동 동선, 체험 시간표, 현장 체크포인트를 운영합니다.",
    managementScope: "상품 상태, 파트너 연결, 운영 메모, 고객 이력을 관리자에서 관리합니다.",
    paymentScope: "카드결제, 단체 견적, 후불, 부분결제 구조까지 확장할 수 있습니다.",
  },
  {
    key: "stay",
    label: "숙박예약",
    shortLabel: "Stay",
    promoTitle: "행사와 체류를 함께 설계하는 숙박 예약 서비스",
    promoDesc:
      "KINTEX, 공연장, 관광거점과 연결된 호텔과 단체 숙소를 행사 흐름에 맞춰 예약하고 운영합니다.",
    desc:
      "객실 예약을 넘어 룸블록, VIP 숙박, 단체 체크인과 정산 흐름까지 연결되는 체류형 서비스입니다.",
    subcategories: ["호텔", "레지던스", "단체 숙소", "VIP 객실"],
    reservationScope: "체크인 일정, 객실 타입, 인원, 조식, 룸블록 요청을 접수합니다.",
    operationsScope: "체크인 명단, 객실 배정, 현장 요청, 셔틀 연계를 운영합니다.",
    managementScope: "객실 재고, 파트너 정산, 변경 이력, 고객 메모를 관리합니다.",
    paymentScope: "사전결제, 현장결제, 법인청구, 세금계산서 발행까지 지원할 수 있습니다.",
  },
  {
    key: "restaurant",
    label: "음식점예약",
    shortLabel: "Dining",
    promoTitle: "행사와 미식을 연결하는 음식점 예약 서비스",
    promoDesc:
      "단체 식사, VIP 만찬, 지역 미식 코스, 브랜드 다이닝 프로그램을 시간대별로 예약하고 운영합니다.",
    desc:
      "방문객 체류 경험을 강화할 수 있도록 좌석 예약과 현장 운영, 메뉴 구성까지 함께 고려한 서비스입니다.",
    subcategories: ["단체 식사", "코스 다이닝", "VIP 만찬", "로컬 미식"],
    reservationScope: "매장, 시간, 인원, 메뉴, 좌석 옵션을 기준으로 예약을 받습니다.",
    operationsScope: "좌석 배치, 코스 순서, 현장 응대, 특별요청을 현장에서 운영합니다.",
    managementScope: "매장별 재고, 고객 요청, 취소 정책, 파트너 메모를 관리합니다.",
    paymentScope: "예약금, 현장 추가결제, 단체 정산, 세금계산서 발행으로 확장 가능합니다.",
  },
  {
    key: "cafe",
    label: "라이프스타일 예약",
    shortLabel: "Lifestyle",
    promoTitle: "고양 라이프스타일 예약 플랫폼",
    promoDesc:
      "브런치, 로컬 카페, 취향 기반 공간 체험, 소규모 모임 프로그램을 예약 상품처럼 운영합니다.",
    desc:
      "카페 예약을 넘어 고양 로컬에 숨어 있는 공간 체험과 체류 프로그램까지 연결하는 라이프스타일 서비스입니다.",
    subcategories: ["브런치", "카페 투어", "로컬 공간", "취향 체험"],
    reservationScope: "공간, 시간대, 인원, 패키지, 부가 옵션을 기준으로 예약을 접수합니다.",
    operationsScope: "공간 세팅, 입장 관리, 체험 진행, 현장 주문 흐름을 운영합니다.",
    managementScope: "공간 가용성, 판매 이력, 고객 메모, 파트너 상태를 관리합니다.",
    paymentScope: "패키지 사전결제, 현장 추가결제, 그룹 정산 구조까지 확장 가능합니다.",
  },
  {
    key: "ticket",
    label: "티켓예약",
    shortLabel: "Ticket",
    promoTitle: "고양 공연과 전시를 연결하는 티켓 예약 서비스",
    promoDesc:
      "K-POP 공연, 전시, 체험 입장권, 가족 프로그램을 4열 그리드 기반 상품 구조로 탐색하고 예약합니다.",
    desc:
      "상품 목록, 상세설명, 좌석 또는 패키지 선택, 결제 흐름까지 하나의 티켓 플랫폼 구조로 연결합니다.",
    subcategories: ["공연 티켓", "전시 입장권", "체험 패스", "단체 발권"],
    reservationScope: "날짜, 회차, 좌석, 수량, 발권 유형을 기준으로 예약을 접수합니다.",
    operationsScope: "명단 대조, QR 발권, 입장 처리, 현장 문의 응대를 운영합니다.",
    managementScope: "판매 상태, 좌석 가용성, 취소/환불, 운영 메모를 관리자에서 관리합니다.",
    paymentScope: "즉시결제, 발권 보류, 단체 정산, 환불 정책까지 확장 가능합니다.",
  },
  {
    key: "medical",
    label: "고양메디컬투어",
    shortLabel: "Medical",
    promoTitle: "고양 메디컬투어 예약 플랫폼",
    promoDesc:
      "질병치료, 건강미용, 회복·재활을 하나의 예약 구조로 연결해 진료·체류·사후관리까지 운영합니다.",
    desc:
      "해외·국내 환자의 의료 여정을 예약 단계에서 체류·회복·사후관리까지 이어지는 원스톱 메디컬 플랫폼입니다.",
    subcategories: ["질병치료형", "건강미용 증진형", "회복·재활형"],
    reservationScope: "진료 목적, 희망 일정, 보호자 동반 여부, 통역 언어를 기준으로 예약을 접수합니다.",
    operationsScope: "진료 예약, 공항 픽업, 숙박 배정, 통역 배정, 일정 관리를 함께 운영합니다.",
    managementScope: "환자 상태, 진료 이력, 보호자 정보, 사후관리 일정을 관리자에서 관리합니다.",
    paymentScope: "선결제, 보증금, 진료 후 정산, 보험 연계 결제 구조까지 확장할 수 있습니다.",
  },
  {
    key: "airport",
    label: "공항픽업예약",
    shortLabel: "Airport",
    promoTitle: "공항에서 고양까지 연결하는 픽업·샌딩 서비스",
    promoDesc:
      "인천공항 픽업·샌딩, 김포공항 픽업·샌딩, VIP 의전, 단체 차량 이동을 상품처럼 예약할 수 있습니다.",
    desc:
      "항공편 정보와 목적지, 차량 타입을 기준으로 예약하고 기사 배정과 현장 연락까지 이어지는 이동 서비스입니다.",
    subcategories: ["인천공항 픽업", "인천공항 샌딩", "김포공항 픽업", "김포공항 샌딩"],
    reservationScope: "공항, 출발지, 목적지, 날짜, 인원, 차량 타입 기준으로 예약을 받습니다.",
    operationsScope: "기사 배정, 항공편 지연 대응, 대기시간, 실시간 연락을 운영합니다.",
    managementScope: "차량 스케줄, 기사 상태, 추가요금, 변경 이력을 관리자에서 관리합니다.",
    paymentScope: "사전결제, 법인청구, 심야 추가요금, 환불 정산 구조까지 지원할 수 있습니다.",
  },
];

export const products: Product[] = [
  {
    id: "tour-experience-platform",
    slug: "tour-experience-platform",
    categoryKey: "tour",
    category: "여행상품",
    categorySummary: "체험상품 포함",
    subcategories: ["시티투어", "로컬 체험", "가족형 코스", "K-컬처 연계 코스"],
    type: "예약 서비스 + 현장 운영 서비스",
    badge: "TOUR / EXPERIENCE",
    title: "고양 로컬여행상품예약 플랫폼",
    desc:
      "고양의 문화, 관광, 공연, 체험 자산을 하나의 여행상품 구조로 묶어 예약과 운영을 함께 관리하는 서비스입니다.",
    summary:
      "방문객 여정에 맞춘 반나절 코스, 1일 체험, 공연 연계 투어를 예약형 상품으로 운영할 수 있습니다.",
    duration: "반일 ~ 1일 코스",
    people: "2명 ~ 80명",
    tag: "Tour",
    location: "고양시 전역",
    price: 59000,
    priceLabel: "1인 기준 시작가",
    highlights: [
      "코스, 체험, 차량, 가이드를 하나의 화면에서 예약",
      "공연 일정과 연동된 투어 시간표 설계 가능",
      "개인 예약과 단체 예약을 같은 구조로 운영",
    ],
    includes: ["상품 예약", "일정 운영", "가이드 배정", "체험 체크리스트"],
    idealFor: ["공연 관람객", "기업 인센티브", "가족 방문객", "전시 연계 관광객"],
    reservationFeatures: [
      "상품과 세부 코스 선택",
      "날짜, 인원, 언어, 차량 옵션 선택",
      "단체 요청사항과 이동 동선 입력",
    ],
    operationFeatures: [
      "가이드와 차량 배정",
      "시간표와 현장 체크포인트 운영",
      "방문객 안내 메시지 발송",
    ],
    managementFeatures: [
      "상품별 판매 현황과 파트너 상태 관리",
      "운영 메모와 고객 요청 이력 관리",
      "정산 상태와 파생 리포트 관리",
    ],
    paymentFeatures: [
      "온라인 카드결제",
      "계좌이체와 법인 견적 결제",
      "예약금과 잔금 분리 관리",
    ],
    reservationSteps: [
      { title: "상품 선택", desc: "투어 유형과 날짜, 인원, 옵션을 선택합니다." },
      { title: "운영 확인", desc: "가이드, 차량, 시간표 운영 가능 여부를 확인합니다." },
      { title: "결제 확정", desc: "예약금 또는 전체 금액 결제로 예약을 확정합니다." },
    ],
  },
  {
    id: "stay-reservation-platform",
    slug: "stay-reservation-platform",
    categoryKey: "stay",
    category: "숙박예약",
    categorySummary: "객실, 룸블록, VIP 숙박",
    subcategories: ["호텔", "레지던스", "단체 숙소", "VIP 객실"],
    type: "예약 서비스 + 숙박 운영 서비스",
    badge: "STAY / ROOM BLOCK",
    title: "고양 숙박예약 운영 플랫폼",
    desc:
      "행사 참가자, 바이어, VIP, 단체 방문객을 위한 숙박 예약과 체크인 운영을 통합 관리하는 서비스입니다.",
    summary:
      "KINTEX, 공연장, 관광거점과 연결된 숙소를 행사 일정에 맞춰 배정하고 체류 운영까지 이어갈 수 있습니다.",
    duration: "1박 ~ 장기 체류",
    people: "1명 ~ 300명",
    tag: "Stay",
    location: "KINTEX 권역 및 고양 주요 숙소",
    price: 120000,
    priceLabel: "객실 기준 시작가",
    highlights: [
      "객실 예약과 룸블록을 함께 운영",
      "VIP, 단체, 개별 숙박 흐름을 분리 관리",
      "체크인 명단과 현장 요청사항까지 연결",
    ],
    includes: ["객실 예약", "체크인 리스트", "배정 관리", "정산 메모"],
    idealFor: ["전시 참가자", "공연 방문객", "VIP 초청객", "단체 방문객"],
    reservationFeatures: [
      "체크인 일정과 객실 타입 선택",
      "조식, 룸블록, 추가 요청 입력",
      "개인 예약과 단체 예약 동시 관리",
    ],
    operationFeatures: [
      "체크인 명단 운영",
      "객실 배정과 현장 요청 대응",
      "셔틀 및 행사 동선 연계",
    ],
    managementFeatures: [
      "객실 재고와 판매 상태 관리",
      "파트너 정산과 변경 이력 기록",
      "고객 메모와 CS 이력 관리",
    ],
    paymentFeatures: [
      "사전결제와 현장결제",
      "법인 청구와 세금계산서 발행",
      "취소 수수료와 환불 정산 관리",
    ],
    reservationSteps: [
      { title: "숙소 선택", desc: "숙소와 객실 타입, 일정, 인원을 선택합니다." },
      { title: "운영 확인", desc: "재고, 체크인 운영, 룸블록 가능 여부를 확인합니다." },
      { title: "결제 확정", desc: "예약금 또는 전체 금액 결제로 숙박 예약을 확정합니다." },
    ],
  },
  {
    id: "restaurant-booking-platform",
    slug: "restaurant-booking-platform",
    categoryKey: "restaurant",
    category: "음식점예약",
    categorySummary: "단체식, 코스, VIP 만찬",
    subcategories: ["단체 식사", "코스 다이닝", "VIP 만찬", "로컬 미식"],
    type: "예약 서비스 + 현장 운영 서비스",
    badge: "DINING / RESERVATION",
    title: "고양 음식점예약 플랫폼",
    desc:
      "행사 일정과 연계된 식사 예약, VIP 만찬, 로컬 미식 프로그램을 하나의 흐름으로 관리하는 서비스입니다.",
    summary:
      "점심, 저녁, 환영만찬, 로컬 다이닝 체험까지 시간대별 상품으로 구성하고 예약과 운영을 함께 처리합니다.",
    duration: "1시간 ~ 3시간",
    people: "2명 ~ 200명",
    tag: "Dining",
    location: "고양 주요 음식점 및 관광특구 상권",
    price: 35000,
    priceLabel: "1인 기준 시작가",
    highlights: [
      "매장, 시간, 메뉴, 좌석 옵션을 한 번에 선택",
      "단체 만찬과 VIP 프로그램을 같은 구조로 운영",
      "행사 일정과 식사 시간을 자동으로 맞출 수 있음",
    ],
    includes: ["좌석 예약", "메뉴 선택", "운영 메모", "현장 체크리스트"],
    idealFor: ["전시 참가자", "비즈니스 미팅", "VIP 손님", "관광 방문객"],
    reservationFeatures: [
      "매장과 시간대, 인원, 메뉴 선택",
      "단체 요청사항과 알레르기 정보 입력",
      "단독룸, 코스, 패키지 옵션 운영",
    ],
    operationFeatures: [
      "좌석 배치와 입장 순서 운영",
      "코스 진행과 현장 요청사항 대응",
      "행사 시간표와 연동된 서비스 운영",
    ],
    managementFeatures: [
      "매장별 가능 좌석과 판매 상태 관리",
      "취소 정책과 고객 메모 관리",
      "파트너 정산 및 운영 히스토리 기록",
    ],
    paymentFeatures: [
      "예약금 선결제",
      "현장 추가결제와 법인 청구",
      "단체 정산과 세금계산서 발행",
    ],
    reservationSteps: [
      { title: "매장 선택", desc: "음식점, 시간대, 메뉴, 인원을 선택합니다." },
      { title: "운영 확인", desc: "좌석 가능 여부와 현장 운영 조건을 확인합니다." },
      { title: "결제 확정", desc: "예약금 또는 전체 금액 결제로 예약을 확정합니다." },
    ],
  },
  {
    id: "cafe-booking-platform",
    slug: "cafe-booking-platform",
    categoryKey: "cafe",
    category: "라이프스타일 예약",
    categorySummary: "브런치, 카페, 공간체험",
    subcategories: ["브런치", "카페 투어", "로컬 공간", "취향 체험"],
    type: "예약 서비스 + 라이프스타일 운영 서비스",
    badge: "LIFESTYLE / CAFE",
    title: "고양 라이프스타일 예약 플랫폼",
    desc:
      "고양 로컬의 카페, 브런치, 취향 기반 공간체험과 체류 프로그램을 예약 상품처럼 운영하는 서비스입니다.",
    summary:
      "생활감 있는 공간과 로컬 체험을 연결해 머무르고 싶은 고양의 라이프스타일 경험을 예약형 구조로 제공합니다.",
    duration: "1시간 ~ 반일",
    people: "2명 ~ 60명",
    tag: "Lifestyle",
    location: "고양 로컬 카페 및 라이프스타일 거점",
    price: 18000,
    priceLabel: "1인 기준 시작가",
    highlights: [
      "공간 예약과 음료 패키지를 함께 운영",
      "브런치, 로컬 카페 투어, 공간체험까지 확장 가능",
      "소규모 모임과 가족 체험을 같은 구조로 관리",
    ],
    includes: ["공간 예약", "음료 패키지", "브런치 옵션", "현장 체크리스트"],
    idealFor: ["소규모 모임", "브랜드 방문객", "체류형 관광객", "가족 체험"],
    reservationFeatures: [
      "공간 유형과 시간대, 패키지 선택",
      "테이블 배치와 인원 정보 입력",
      "체험 프로그램과 음료 구성을 함께 예약",
    ],
    operationFeatures: [
      "공간 세팅과 입장 관리",
      "브런치 제공 및 체험 프로그램 운영",
      "현장 요청과 추가 주문 관리",
    ],
    managementFeatures: [
      "공간 가용성과 판매 이력 관리",
      "고객 만족도와 메모 관리",
      "파트너 운영 상태와 정산 관리",
    ],
    paymentFeatures: [
      "패키지 사전결제",
      "현장 추가 주문 결제",
      "그룹 예약과 후불 정산 구조 지원",
    ],
    reservationSteps: [
      { title: "공간 선택", desc: "카페, 공간 유형, 시간, 패키지를 선택합니다." },
      { title: "운영 확인", desc: "공간 운영 가능 여부와 체험 구성을 확인합니다." },
      { title: "결제 완료", desc: "사전결제 또는 현장 추가결제 방식으로 예약을 확정합니다." },
    ],
  },
  {
    id: "ticket-agency-platform",
    slug: "ticket-agency-platform",
    categoryKey: "ticket",
    category: "티켓예약",
    categorySummary: "공연, 전시, 체험 입장권",
    subcategories: ["공연 티켓", "전시 입장권", "체험 패스", "단체 발권"],
    type: "예약 서비스 + 발권 관리 서비스",
    badge: "TICKET / ACCESS",
    title: "고양 티켓예약 플랫폼",
    desc:
      "K-POP 공연, 전시, 체험 입장권을 4개씩 배치된 상품 그리드로 탐색하고 상세설명과 결제까지 바로 이어지는 플랫폼입니다.",
    summary:
      "개인 티켓부터 단체 발권, VIP 초청 운영까지 한 구조 안에서 판매, 발권, 입장 관리를 연결할 수 있습니다.",
    duration: "회차 기준",
    people: "1명 ~ 500명",
    tag: "Ticket",
    location: "공연장, 전시장, 체험 시설",
    price: 22000,
    priceLabel: "티켓 기준 시작가",
    highlights: [
      "4열 카드 그리드 기반 상품 탐색 구조",
      "상품 상세설명, 회차, 좌석, 패키지 결제 연결",
      "발권과 입장 관리까지 한 흐름으로 운영",
    ],
    includes: ["티켓 예약", "발권 상태", "QR 발권", "취소 이력"],
    idealFor: ["공연 관람객", "전시 방문객", "단체 예약", "VIP 초청"],
    reservationFeatures: [
      "회차, 좌석, 수량, 티켓 유형 선택",
      "개인, 단체, 초청권 구분 관리",
      "발권 보류와 확정 상태 운영",
    ],
    operationFeatures: [
      "명단 대조와 QR 발권",
      "현장 배포와 문의 응대",
      "입장 완료 상태 체크",
    ],
    managementFeatures: [
      "좌석 재고와 판매 현황 관리",
      "수수료와 환불 상태 기록",
      "공연별 규정과 운영 메모 관리",
    ],
    paymentFeatures: [
      "즉시결제와 발권 보류 결제",
      "단체 정산과 세금계산서 발행",
      "취소 수수료와 환불 정책 관리",
    ],
    reservationSteps: [
      { title: "상품 선택", desc: "회차와 좌석, 수량, 패키지 옵션을 선택합니다." },
      { title: "발권 준비", desc: "발권 방식과 수령 정보를 확인합니다." },
      { title: "결제 확정", desc: "결제 완료 후 QR 또는 명단 발권으로 예약을 확정합니다." },
    ],
  },
  {
    id: "airport-pickup-platform",
    slug: "airport-pickup-platform",
    categoryKey: "airport",
    category: "공항픽업예약",
    categorySummary: "인천공항, 김포공항, VIP 의전",
    subcategories: ["인천공항 픽업", "인천공항 샌딩", "김포공항 픽업", "김포공항 샌딩"],
    type: "예약 서비스 + 배차 운영 서비스",
    badge: "AIRPORT / PICK-UP",
    title: "공항픽업예약 운영 플랫폼",
    desc:
      "인천공항과 김포공항에서 고양시 주요 거점까지 연결되는 픽업·샌딩 예약과 배차 운영 서비스입니다.",
    summary:
      "출발지, 목적지, 날짜, 인원, 차량 타입을 기준으로 예약을 접수하고 기사 배정과 실시간 운영까지 이어집니다.",
    duration: "편도 또는 왕복",
    people: "1명 ~ 200명",
    tag: "Airport",
    location: "인천공항, 김포공항, 고양시 전역",
    price: 85000,
    priceLabel: "차량 기준 시작가",
    highlights: [
      "인천공항 픽업·샌딩과 김포공항 픽업·샌딩 구분",
      "차량별 금액과 인원 구성 확인 후 바로 예약 가능",
      "기사 배정과 실시간 연락, 추가요금 관리까지 연결",
    ],
    includes: ["배차 예약", "기사 배정", "운행 메모", "이동 정산"],
    idealFor: ["해외 바이어", "공연 방문객", "VIP 초청", "단체 이동"],
    reservationFeatures: [
      "공항, 출발지, 목적지, 날짜, 인원 입력",
      "차량 종류와 편도/왕복 여부 선택",
      "VIP, 단체, 개인 이동 유형 구분",
    ],
    operationFeatures: [
      "기사와 차량 배정",
      "항공편 지연과 대기시간 관리",
      "실시간 연락처와 픽업 사인 안내",
    ],
    managementFeatures: [
      "차량 스케줄과 기사 근무 상태 관리",
      "추가요금, 심야요금, 변경 이력 기록",
      "CS 메모와 이동 완료 상태 관리",
    ],
    paymentFeatures: [
      "사전 카드결제와 법인 후불",
      "심야 추가요금 자동 반영",
      "세금계산서와 영수증 발행 지원",
    ],
    reservationSteps: [
      { title: "이동 정보 입력", desc: "공항, 출발지, 목적지, 차량 타입을 선택합니다." },
      { title: "배차 확인", desc: "기사, 차량, 대기 조건과 추가요금을 확인합니다." },
      { title: "결제 완료", desc: "편도 또는 왕복 기준으로 결제를 완료합니다." },
    ],
  },
  {
    id: "medical-treatment-platform",
    slug: "medical-treatment-platform",
    categoryKey: "medical",
    category: "고양메디컬투어",
    categorySummary: "질병치료형",
    subcategories: ["암·중증질환", "여성질환", "정밀치료", "종합검진"],
    type: "예약 서비스 + 진료·체류 운영 서비스",
    badge: "MEDICAL / TREATMENT",
    title: "질병치료형 예약 플랫폼",
    desc:
      "암·중증질환·여성질환·정밀치료 등 치료 목적의 해외·국내 환자를 위한 진료 예약과 체류 운영을 통합 관리합니다.",
    summary:
      "맞춤상담, 진료예약, 공항픽업, 숙박지원, 통역서비스, 사후관리까지 한 번의 예약 흐름으로 제공합니다.",
    duration: "단기 진료 ~ 장기 체류",
    people: "1명 ~ 10명 (보호자 동반 가능)",
    tag: "Medical",
    location: "고양시 주요 대학병원 및 전문 의료기관",
    price: 0,
    priceLabel: "진료 상담 후 견적",
    highlights: [
      "의료진 매칭과 진료 일정 예약을 하나의 흐름으로 운영",
      "공항픽업, 숙박, 통역, 사후관리까지 원스톱 지원",
      "해외 환자와 보호자를 위한 다국어 상담 서비스",
    ],
    includes: ["맞춤상담", "진료예약", "공항픽업", "숙박지원", "통역서비스", "사후관리"],
    idealFor: ["해외 환자", "중증질환 환자", "정밀검진 희망자", "보호자 동반 환자"],
    reservationFeatures: [
      "진료 희망 분야와 일정 접수",
      "보호자 동반과 체류 기간 입력",
      "통역 언어와 이동 요청사항 입력",
    ],
    operationFeatures: [
      "병원 진료 일정과 픽업 운영",
      "숙박과 식이 관리, 통역 배정",
      "진료 결과 공유와 보호자 커뮤니케이션",
    ],
    managementFeatures: [
      "환자 상태와 진료 이력 관리",
      "체류 일정, 의료진 연계, 사후관리 기록",
      "보험과 정산 문서, 의료 기록 보관",
    ],
    paymentFeatures: [
      "상담 후 견적 결제",
      "진료 후 정산과 보증금 관리",
      "국제 결제와 보험 연계 정산 지원",
    ],
    reservationSteps: [
      { title: "상담 접수", desc: "희망 진료, 일정, 보호자 동반 여부를 입력합니다." },
      { title: "진료 매칭", desc: "병원, 의료진, 체류 일정을 조율해 확정합니다." },
      { title: "체류 운영", desc: "픽업, 숙박, 통역, 사후관리까지 운영합니다." },
    ],
  },
  {
    id: "medical-beauty-platform",
    slug: "medical-beauty-platform",
    categoryKey: "medical",
    category: "고양메디컬투어",
    categorySummary: "건강미용 증진형",
    subcategories: ["성형", "피부", "웰니스", "안티에이징"],
    type: "예약 서비스 + 뷰티·웰니스 운영 서비스",
    badge: "MEDICAL / K-BEAUTY",
    title: "건강미용 증진형 예약 플랫폼",
    desc:
      "K-뷰티 수요자를 위한 성형, 피부, 웰니스 프로그램을 프리미엄 체류와 다국어 응대 기반으로 운영하는 예약 서비스입니다.",
    summary:
      "프리미엄 스테이, 편리한 접근성, 다국어 응대를 기반으로 성형·피부·웰니스 프로그램을 한 번에 예약합니다.",
    duration: "당일 시술 ~ 2주 체류",
    people: "1명 ~ 6명",
    tag: "K-Beauty",
    location: "고양시 K-뷰티 클리닉 및 프리미엄 스테이",
    price: 0,
    priceLabel: "프로그램별 상담 견적",
    highlights: [
      "Premium Stay — 프리미엄 숙박과 회복 케어를 함께 운영",
      "Convenient Access — 클리닉과 체류지 사이 전용 이동",
      "Multi-Language Support — 다국어 상담과 시술 통역 제공",
    ],
    includes: ["상담 예약", "시술 예약", "회복 케어", "전용 이동", "통역 응대"],
    idealFor: ["K-뷰티 방문객", "웰니스 프로그램 참가자", "안티에이징 체류 고객", "프리미엄 회복 케어 선호 고객"],
    reservationFeatures: [
      "시술·프로그램 유형 선택",
      "체류 일정과 회복 기간 입력",
      "언어, 동반자, 숙소 선호도 입력",
    ],
    operationFeatures: [
      "클리닉 예약과 회복 케어 운영",
      "전용 이동과 통역 배정",
      "체류 중 일정과 추가 프로그램 안내",
    ],
    managementFeatures: [
      "고객 시술 이력과 회복 상태 관리",
      "클리닉 파트너와 정산 관리",
      "재방문 고객 프로그램 운영",
    ],
    paymentFeatures: [
      "프로그램 선결제",
      "시술 후 추가결제",
      "다국가 카드 및 간편결제 지원",
    ],
    reservationSteps: [
      { title: "상담 신청", desc: "시술·프로그램 희망과 체류 일정을 접수합니다." },
      { title: "프로그램 매칭", desc: "클리닉, 스테이, 이동 일정을 확정합니다." },
      { title: "체류 운영", desc: "시술, 회복 케어, 통역 응대를 운영합니다." },
    ],
  },
  {
    id: "medical-recovery-platform",
    slug: "medical-recovery-platform",
    categoryKey: "medical",
    category: "고양메디컬투어",
    categorySummary: "회복·재활형",
    subcategories: ["회복체류", "재활", "보호자 동반 서비스", "심리상담"],
    type: "예약 서비스 + 회복·재활 운영 서비스",
    badge: "MEDICAL / RECOVERY",
    title: "회복·재활 예약 플랫폼",
    desc:
      "수술·치료 후 회복과 재활이 필요한 환자와 보호자를 위한 체류형 메디컬 예약 서비스입니다.",
    summary:
      "편안한 숙박, 맞춤 식이관리, 의료 일정 관리, 전용 이동, 심리상담, 자연·휴식, 정기 체크까지 연결합니다.",
    duration: "1주 ~ 장기 체류",
    people: "1명 ~ 4명 (보호자 포함)",
    tag: "Recovery",
    location: "고양시 회복 거점 스테이 및 재활 기관",
    price: 0,
    priceLabel: "체류 기간별 상담 견적",
    highlights: [
      "편안한 숙박 — 회복에 최적화된 정적 환경",
      "맞춤 식이관리와 의료 일정 관리",
      "자연·휴식 기반 회복과 정기 체크",
    ],
    includes: ["편안한숙박", "맞춤식이관리", "의료일정관리", "전용이동", "심리상담", "자연&휴식", "정기체크"],
    idealFor: ["수술 후 회복 환자", "재활 프로그램 참가자", "보호자 동반 고객", "장기 체류 의료 관광객"],
    reservationFeatures: [
      "회복 목적과 체류 기간 접수",
      "보호자 동반, 이동, 식이 요구사항 입력",
      "심리상담과 재활 프로그램 선택",
    ],
    operationFeatures: [
      "의료 일정과 재활 진행 관리",
      "식이, 이동, 심리상담 배정",
      "정기 체크와 보호자 안내",
    ],
    managementFeatures: [
      "회복 진행 상황과 의료 이력 관리",
      "재활 파트너와 정산 관리",
      "사후관리 및 재방문 프로그램 운영",
    ],
    paymentFeatures: [
      "체류 패키지 선결제",
      "추가 프로그램 현장 결제",
      "보호자 동반과 보험 연계 정산",
    ],
    reservationSteps: [
      { title: "상담 접수", desc: "회복 목적, 기간, 보호자 동반 여부를 입력합니다." },
      { title: "프로그램 구성", desc: "재활, 식이, 이동, 심리상담 일정을 확정합니다." },
      { title: "체류 운영", desc: "정기 체크와 의료 일정을 운영합니다." },
    ],
  },
];

export function getProductBySlug(slug: string) {
  return products.find((item) => item.slug === slug || item.id === slug);
}

export function getProductById(id: string) {
  return products.find((item) => item.id === id || item.slug === id);
}

export function getProductsByCategory(categoryKey: DmcCategoryKey) {
  return products.filter((item) => item.categoryKey === categoryKey);
}
