export type AirportTransferMode = "pickup" | "sending";

export type AirportTransferRouteId =
  | "icn-pickup"
  | "icn-sending"
  | "gmp-pickup"
  | "gmp-sending";

export type AirportTransferFilterId =
  | "meet-greet"
  | "english-driver"
  | "wheelchair"
  | "wifi"
  | "charger"
  | "pet-friendly"
  | "water"
  | "multilingual";

export interface AirportTransferRoute {
  id: AirportTransferRouteId;
  mode: AirportTransferMode;
  airportCode: "ICN" | "GMP";
  airportName: string;
  label: string;
  title: string;
  desc: string;
  fromLabel: string;
  toLabel: string;
  terminalInfo: string;
  heroNote: string;
}

export interface AirportVehicleOption {
  id: string;
  routeId: AirportTransferRouteId;
  operator: string;
  name: string;
  desc: string;
  seats: number;
  luggage: number;
  price: number;
  badges: string[];
  features: AirportTransferFilterId[];
  etaNote: string;
  // 소개형 CTA용 (Phase 3): 데이터 없으면 CTA 자동 숨김
  homepageUrl?: string;
  phone?: string;
}

export interface AirportTransferFilter {
  id: AirportTransferFilterId;
  label: string;
}

export interface AirportTransferSearchState {
  mode: AirportTransferMode;
  routeId: AirportTransferRouteId;
  from: string;
  to: string;
  departureDate: string;
  passengers: number;
}

export const airportTransferFilters: AirportTransferFilter[] = [
  { id: "meet-greet", label: "미팅보드 서비스" },
  { id: "english-driver", label: "영어 가능 기사" },
  { id: "wheelchair", label: "휠체어 수용 가능" },
  { id: "wifi", label: "차량 내 Wi-Fi" },
  { id: "charger", label: "충전기 제공" },
  { id: "pet-friendly", label: "반려동물 동승 가능" },
  { id: "water", label: "생수 제공" },
  { id: "multilingual", label: "중국어·일본어 응대" },
];

export const airportTransferRoutes: AirportTransferRoute[] = [
  {
    id: "icn-pickup",
    mode: "pickup",
    airportCode: "ICN",
    airportName: "인천국제공항",
    label: "인천공항 픽업",
    title: "인천공항 도착 후 고양까지 바로 연결하는 픽업",
    desc: "입국 게이트, 공연장, 호텔, 행사장으로 바로 이어지는 차량 배차 구조입니다.",
    fromLabel: "인천국제공항 제1·2터미널",
    toLabel: "고양 특례시 호텔 · KINTEX · 공연장",
    terminalInfo: "도착 항공편 기준 90분 무료 대기",
    heroNote: "공연 관람객, 바이어, VIP, 단체 방문객 이동에 최적화",
  },
  {
    id: "icn-sending",
    mode: "sending",
    airportCode: "ICN",
    airportName: "인천국제공항",
    label: "인천공항 샌딩",
    title: "고양에서 인천공항으로 이동하는 출국 샌딩",
    desc: "호텔 체크아웃부터 공항 도착까지 행사 일정과 연계해 안전하게 운영합니다.",
    fromLabel: "고양 특례시 호텔 · KINTEX · 공연장",
    toLabel: "인천국제공항 제1·2터미널",
    terminalInfo: "항공편 출발 3시간 전 도착 추천",
    heroNote: "출국 동선, 수하물, 단체 이동 스케줄까지 함께 관리",
  },
  {
    id: "gmp-pickup",
    mode: "pickup",
    airportCode: "GMP",
    airportName: "김포국제공항",
    label: "김포공항 픽업",
    title: "김포공항에서 고양까지 빠르게 이어지는 픽업",
    desc: "국내선과 국제선 도착 고객을 고양 주요 거점으로 빠르게 연결합니다.",
    fromLabel: "김포국제공항 국내선 · 국제선",
    toLabel: "고양 특례시 호텔 · 스타디움 · 행사장",
    terminalInfo: "도착 항공편 기준 60분 무료 대기",
    heroNote: "K-POP 행사장, 고양콘, 방송 스튜디오 이동에 적합",
  },
  {
    id: "gmp-sending",
    mode: "sending",
    airportCode: "GMP",
    airportName: "김포국제공항",
    label: "김포공항 샌딩",
    title: "고양에서 김포공항으로 이동하는 샌딩 서비스",
    desc: "개인 이동부터 소규모 그룹 출국까지 시간대별로 배차를 운영합니다.",
    fromLabel: "고양 특례시 호텔 · 스타디움 · 행사장",
    toLabel: "김포국제공항 국내선 · 국제선",
    terminalInfo: "국내선 2시간 전, 국제선 3시간 전 도착 추천",
    heroNote: "가족 여행객, 공연 스태프, 소규모 VIP 이동에 최적화",
  },
];

export const airportVehicleOptions: AirportVehicleOption[] = [
  {
    id: "icn-pickup-economy",
    homepageUrl: "",
    phone: "",
    routeId: "icn-pickup",
    operator: "GOYANG TRANSFER",
    name: "이코노미 세단 3인",
    desc: "Hyundai Sonata / Kia K5 동급",
    seats: 3,
    luggage: 2,
    price: 89000,
    badges: ["즉시 확정", "무료 대기"],
    features: ["meet-greet", "charger", "water"],
    etaNote: "평균 소요 65분",
  },
  {
    id: "icn-pickup-suv",
    homepageUrl: "",
    phone: "",
    routeId: "icn-pickup",
    operator: "GOYANG VIP DRIVE",
    name: "프리미엄 SUV 5인",
    desc: "Carnival Hi-Limousine / SUV 동급",
    seats: 5,
    luggage: 5,
    price: 148000,
    badges: ["영문 응대", "VIP 추천"],
    features: ["meet-greet", "english-driver", "wifi", "charger", "water"],
    etaNote: "평균 소요 65분",
  },
  {
    id: "icn-pickup-van",
    homepageUrl: "",
    phone: "",
    routeId: "icn-pickup",
    operator: "GOYANG GROUP MOVE",
    name: "그룹 밴 9인",
    desc: "Solati / 대형 밴 동급",
    seats: 9,
    luggage: 9,
    price: 219000,
    badges: ["단체 이동", "수하물 대응"],
    features: ["meet-greet", "wheelchair", "wifi", "charger", "water"],
    etaNote: "평균 소요 70분",
  },
  {
    id: "icn-sending-economy",
    homepageUrl: "",
    phone: "",
    routeId: "icn-sending",
    operator: "GOYANG TRANSFER",
    name: "샌딩 세단 3인",
    desc: "Hyundai Sonata / Kia K5 동급",
    seats: 3,
    luggage: 2,
    price: 84000,
    badges: ["즉시 확정", "야간 가능"],
    features: ["charger", "water"],
    etaNote: "호텔 출발 기준 평균 65분",
  },
  {
    id: "icn-sending-suv",
    homepageUrl: "",
    phone: "",
    routeId: "icn-sending",
    operator: "GOYANG VIP DRIVE",
    name: "샌딩 프리미엄 SUV 5인",
    desc: "Carnival Hi-Limousine / SUV 동급",
    seats: 5,
    luggage: 5,
    price: 139000,
    badges: ["VIP 추천", "영문 응대"],
    features: ["english-driver", "wifi", "charger", "water"],
    etaNote: "호텔 출발 기준 평균 65분",
  },
  {
    id: "gmp-pickup-economy",
    homepageUrl: "",
    phone: "",
    routeId: "gmp-pickup",
    operator: "GOYANG CITY RIDE",
    name: "시티 세단 3인",
    desc: "Hyundai Avante / Kia K3 동급",
    seats: 3,
    luggage: 2,
    price: 62000,
    badges: ["빠른 배차", "무료 대기"],
    features: ["meet-greet", "charger", "water"],
    etaNote: "평균 소요 35분",
  },
  {
    id: "gmp-pickup-van",
    homepageUrl: "",
    phone: "",
    routeId: "gmp-pickup",
    operator: "GOYANG GROUP MOVE",
    name: "그룹 밴 7인",
    desc: "Carnival / 대형 밴 동급",
    seats: 7,
    luggage: 6,
    price: 118000,
    badges: ["단체 이동", "공연 일정 대응"],
    features: ["meet-greet", "wifi", "charger", "water", "multilingual"],
    etaNote: "평균 소요 40분",
  },
  {
    id: "gmp-sending-economy",
    homepageUrl: "",
    phone: "",
    routeId: "gmp-sending",
    operator: "GOYANG CITY RIDE",
    name: "시티 샌딩 세단 3인",
    desc: "Hyundai Avante / Kia K3 동급",
    seats: 3,
    luggage: 2,
    price: 59000,
    badges: ["빠른 출발", "국내선 추천"],
    features: ["charger", "water"],
    etaNote: "평균 소요 35분",
  },
  {
    id: "gmp-sending-suv",
    homepageUrl: "",
    phone: "",
    routeId: "gmp-sending",
    operator: "GOYANG VIP DRIVE",
    name: "프리미엄 샌딩 SUV 5인",
    desc: "Carnival Hi-Limousine / SUV 동급",
    seats: 5,
    luggage: 4,
    price: 112000,
    badges: ["VIP 추천", "K-POP 일정 대응"],
    features: ["english-driver", "wifi", "charger", "water", "multilingual"],
    etaNote: "평균 소요 40분",
  },
];

export function getAirportTransferRoute(routeId: string) {
  return airportTransferRoutes.find((route) => route.id === routeId);
}

export function getAirportTransferVehicle(vehicleId: string) {
  return airportVehicleOptions.find((vehicle) => vehicle.id === vehicleId);
}

export function getAirportVehiclesByRoute(routeId: AirportTransferRouteId) {
  return airportVehicleOptions.filter((vehicle) => vehicle.routeId === routeId);
}

export function getInitialAirportTransferSearch(
  routeId: AirportTransferRouteId = "icn-pickup",
  departureDate?: string,
  passengers = 3
): AirportTransferSearchState {
  const route = getAirportTransferRoute(routeId) ?? airportTransferRoutes[0];

  return {
    mode: route.mode,
    routeId: route.id,
    from: route.fromLabel,
    to: route.toLabel,
    departureDate:
      departureDate ??
      new Date(Date.now() + 86400000).toISOString().slice(0, 16),
    passengers,
  };
}
