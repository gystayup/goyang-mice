import type { AirportTransferFilterId, AirportTransferMode, AirportTransferRouteId } from "@/data/airport-transfer";

import { pick, type LocalizedText, type PageLocale } from "./types";

type AirportRouteCopy = {
  airportName: LocalizedText;
  label: LocalizedText;
  title: LocalizedText;
  desc: LocalizedText;
  fromLabel: LocalizedText;
  toLabel: LocalizedText;
  terminalInfo: LocalizedText;
  heroNote: LocalizedText;
};

type AirportVehicleCopy = {
  name: LocalizedText;
  desc: LocalizedText;
  badges: LocalizedText[];
  etaNote: LocalizedText;
};

const routeCopy: Record<AirportTransferRouteId, AirportRouteCopy> = {
  "icn-pickup": {
    airportName: { ko: "인천국제공항", en: "Incheon International Airport" },
    label: { ko: "인천공항 픽업", en: "Incheon Airport Pickup" },
    title: { ko: "인천공항에서 고양까지 바로 연결되는 픽업", en: "Pickup from Incheon Airport to Goyang" },
    desc: { ko: "입국 후 호텔, 공연장, KINTEX까지 바로 이동할 수 있는 대표 픽업 노선입니다.", en: "A flagship pickup route directly connecting airport arrivals with hotels, venues, and KINTEX." },
    fromLabel: { ko: "인천국제공항 제1 · 제2터미널", en: "Incheon Airport Terminal 1 · 2" },
    toLabel: { ko: "고양 주요 호텔 · KINTEX · 공연장", en: "Goyang Hotels · KINTEX · Venues" },
    terminalInfo: { ko: "입국장 기준 90분 무료 대기", en: "90 min free waiting from arrival" },
    heroNote: { ko: "공연 관람객, 바이어, VIP, 단체 방문객 이동에 최적화", en: "Optimized for visitors, buyers, VIP guests, and group travel" },
  },
  "icn-sending": {
    airportName: { ko: "인천국제공항", en: "Incheon International Airport" },
    label: { ko: "인천공항 샌딩", en: "Incheon Airport Sending" },
    title: { ko: "고양에서 인천공항으로 이동하는 샌딩", en: "Sending from Goyang to Incheon Airport" },
    desc: { ko: "호텔 체크아웃부터 공항 도착까지 행사 일정과 연동해 안전하게 이동합니다.", en: "A safe transfer route aligned to hotel checkout and event schedules." },
    fromLabel: { ko: "고양 주요 호텔 · KINTEX · 공연장", en: "Goyang Hotels · KINTEX · Venues" },
    toLabel: { ko: "인천국제공항 제1 · 제2터미널", en: "Incheon Airport Terminal 1 · 2" },
    terminalInfo: { ko: "출국 3시간 전 도착 권장", en: "Recommended arrival 3 hours before departure" },
    heroNote: { ko: "단체 출국, VIP 출국, 전시 종료 후 샌딩에 적합", en: "Ideal for group departures, VIP transfers, and post-exhibition sending" },
  },
  "gmp-pickup": {
    airportName: { ko: "김포국제공항", en: "Gimpo International Airport" },
    label: { ko: "김포공항 픽업", en: "Gimpo Airport Pickup" },
    title: { ko: "김포공항에서 고양까지 빠르게 이동하는 픽업", en: "Fast pickup from Gimpo Airport to Goyang" },
    desc: { ko: "국내선과 국제선 입국 고객을 고양 주요 거점으로 빠르게 연결합니다.", en: "A fast link from Gimpo Airport arrivals to major destinations in Goyang." },
    fromLabel: { ko: "김포국제공항 국내선 · 국제선", en: "Gimpo Domestic · International Terminal" },
    toLabel: { ko: "고양 주요 호텔 · 스튜디오 · 행사장", en: "Goyang Hotels · Studios · Event Venues" },
    terminalInfo: { ko: "입국장 기준 60분 무료 대기", en: "60 min free waiting from arrival" },
    heroNote: { ko: "K-POP 행사, 방송 스튜디오 이동과 연계하기 적합", en: "Great for K-POP schedules and broadcast studio transfers" },
  },
  "gmp-sending": {
    airportName: { ko: "김포국제공항", en: "Gimpo International Airport" },
    label: { ko: "김포공항 샌딩", en: "Gimpo Airport Sending" },
    title: { ko: "고양에서 김포공항으로 이동하는 샌딩", en: "Sending from Goyang to Gimpo Airport" },
    desc: { ko: "개인, 가족, 단체 모두를 위한 공항 출발 이동 서비스입니다.", en: "An airport departure service for individual, family, and group visitors." },
    fromLabel: { ko: "고양 주요 호텔 · 스튜디오 · 행사장", en: "Goyang Hotels · Studios · Event Venues" },
    toLabel: { ko: "김포국제공항 국내선 · 국제선", en: "Gimpo Domestic · International Terminal" },
    terminalInfo: { ko: "국내선 2시간, 국제선 3시간 전 도착 권장", en: "Recommended 2h domestic / 3h international" },
    heroNote: { ko: "가족여행객과 공연 스태프, VIP 이동에 적합", en: "Suitable for family visitors, performance staff, and VIP guests" },
  },
};

const vehicleCopy: Record<string, AirportVehicleCopy> = {
  "icn-pickup-economy": { name: { ko: "이코노미 세단 3인", en: "Economy Sedan for 3" }, desc: { ko: "Hyundai Sonata / Kia K5 동급", en: "Hyundai Sonata / Kia K5 class" }, badges: [{ ko: "즉시 확정", en: "Instant Confirm" }, { ko: "무료 대기", en: "Free Waiting" }], etaNote: { ko: "평균 소요 65분", en: "Approx. 65 min" } },
  "icn-pickup-suv": { name: { ko: "프리미엄 SUV 5인", en: "Premium SUV for 5" }, desc: { ko: "Carnival Hi-Limousine / SUV 동급", en: "Carnival Hi-Limousine / SUV class" }, badges: [{ ko: "영문 지원", en: "English Support" }, { ko: "VIP 추천", en: "VIP Pick" }], etaNote: { ko: "평균 소요 65분", en: "Approx. 65 min" } },
  "icn-pickup-van": { name: { ko: "그룹 밴 9인", en: "Group Van for 9" }, desc: { ko: "Solati / 대형 밴 동급", en: "Solati / Large Van class" }, badges: [{ ko: "단체 이동", en: "Group Transfer" }, { ko: "수하물 대응", en: "Luggage Ready" }], etaNote: { ko: "평균 소요 70분", en: "Approx. 70 min" } },
  "icn-sending-economy": { name: { ko: "샌딩 세단 3인", en: "Sending Sedan for 3" }, desc: { ko: "Hyundai Sonata / Kia K5 동급", en: "Hyundai Sonata / Kia K5 class" }, badges: [{ ko: "즉시 확정", en: "Instant Confirm" }, { ko: "야간 가능", en: "Night Available" }], etaNote: { ko: "호텔 출발 기준 65분", en: "Approx. 65 min from hotel" } },
  "icn-sending-suv": { name: { ko: "샌딩 프리미엄 SUV 5인", en: "Premium Sending SUV for 5" }, desc: { ko: "Carnival Hi-Limousine / SUV 동급", en: "Carnival Hi-Limousine / SUV class" }, badges: [{ ko: "VIP 추천", en: "VIP Pick" }, { ko: "영문 지원", en: "English Support" }], etaNote: { ko: "호텔 출발 기준 65분", en: "Approx. 65 min from hotel" } },
  "gmp-pickup-economy": { name: { ko: "시티 세단 3인", en: "City Sedan for 3" }, desc: { ko: "Hyundai Avante / Kia K3 동급", en: "Hyundai Avante / Kia K3 class" }, badges: [{ ko: "빠른 배차", en: "Fast Dispatch" }, { ko: "무료 대기", en: "Free Waiting" }], etaNote: { ko: "평균 소요 35분", en: "Approx. 35 min" } },
  "gmp-pickup-van": { name: { ko: "그룹 밴 7인", en: "Group Van for 7" }, desc: { ko: "Carnival / 대형 밴 동급", en: "Carnival / Large Van class" }, badges: [{ ko: "단체 이동", en: "Group Transfer" }, { ko: "행사 일정 대응", en: "Event Ready" }], etaNote: { ko: "평균 소요 40분", en: "Approx. 40 min" } },
  "gmp-sending-economy": { name: { ko: "시티 샌딩 세단 3인", en: "City Sending Sedan for 3" }, desc: { ko: "Hyundai Avante / Kia K3 동급", en: "Hyundai Avante / Kia K3 class" }, badges: [{ ko: "빠른 출발", en: "Fast Departure" }, { ko: "국내선 추천", en: "Good for Domestic" }], etaNote: { ko: "평균 소요 35분", en: "Approx. 35 min" } },
  "gmp-sending-suv": { name: { ko: "프리미엄 샌딩 SUV 5인", en: "Premium Sending SUV for 5" }, desc: { ko: "Carnival Hi-Limousine / SUV 동급", en: "Carnival Hi-Limousine / SUV class" }, badges: [{ ko: "VIP 추천", en: "VIP Pick" }, { ko: "K-POP 일정 대응", en: "K-POP Ready" }], etaNote: { ko: "평균 소요 40분", en: "Approx. 40 min" } },
};

const filterCopy: Record<AirportTransferFilterId, LocalizedText> = {
  "meet-greet": { ko: "미팅보드 서비스", en: "Meet & Greet" },
  "english-driver": { ko: "영어 가능 기사", en: "English-speaking Driver" },
  wheelchair: { ko: "휠체어 수용 가능", en: "Wheelchair Friendly" },
  wifi: { ko: "차량 내 Wi-Fi", en: "In-car Wi-Fi" },
  charger: { ko: "충전기 제공", en: "Device Charger" },
  "pet-friendly": { ko: "반려동물 탑승 가능", en: "Pet Friendly" },
  water: { ko: "생수 제공", en: "Water Included" },
  multilingual: { ko: "다국어 기사 지원", en: "Multilingual Driver" },
};

const modeCopy: Record<AirportTransferMode, LocalizedText> = {
  pickup: { ko: "공항 픽업", en: "Airport Pickup" },
  sending: { ko: "공항 샌딩", en: "Airport Sending" },
};

export function getAirportRouteCopy(locale: PageLocale, routeId: AirportTransferRouteId) {
  const route = routeCopy[routeId];
  return {
    airportName: pick(locale, route.airportName),
    label: pick(locale, route.label),
    title: pick(locale, route.title),
    desc: pick(locale, route.desc),
    fromLabel: pick(locale, route.fromLabel),
    toLabel: pick(locale, route.toLabel),
    terminalInfo: pick(locale, route.terminalInfo),
    heroNote: pick(locale, route.heroNote),
  };
}

export function getAirportVehicleCopy(locale: PageLocale, vehicleId: string) {
  const vehicle = vehicleCopy[vehicleId];
  if (!vehicle) return null;
  return {
    name: pick(locale, vehicle.name),
    desc: pick(locale, vehicle.desc),
    badges: vehicle.badges.map((badge) => pick(locale, badge)),
    etaNote: pick(locale, vehicle.etaNote),
  };
}

export function getAirportFilterLabel(locale: PageLocale, filterId: AirportTransferFilterId) {
  return pick(locale, filterCopy[filterId]);
}

export function getAirportModeLabel(locale: PageLocale, mode: AirportTransferMode) {
  return pick(locale, modeCopy[mode]);
}
