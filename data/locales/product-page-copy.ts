import { pick, type LocalizedText, type PageLocale } from "./types";

type ProductPageCopy = {
  eyebrow: LocalizedText;
  title: LocalizedText;
  description: LocalizedText;
  summary: LocalizedText;
};

const productPageCopy: Record<string, ProductPageCopy> = {
  "tour-experience-platform": {
    eyebrow: { ko: "여행상품", en: "Travel Products" },
    title: { ko: "고양 여행상품예약 플랫폼", en: "Goyang Travel Product Booking Platform" },
    description: {
      ko: "고양의 문화, 관광, 공연, 체험 자산을 하나의 여행상품 구조로 연결해 예약과 운영을 함께 관리하는 서비스입니다.",
      en: "A service that connects Goyang's culture, tourism, performance, and experience assets into one travel-product booking structure.",
    },
    summary: {
      ko: "공연 전후 일정에 맞춘 반일 코스, 1일 체험, 로컬 투어를 하나의 예약 흐름으로 운영합니다.",
      en: "Half-day plans, one-day experiences, and local tours are managed in one booking flow around event schedules.",
    },
  },
  "stay-reservation-platform": {
    eyebrow: { ko: "숙박예약", en: "Accommodation Booking" },
    title: { ko: "고양 숙박예약 운영 플랫폼", en: "Goyang Accommodation Booking Platform" },
    description: {
      ko: "KINTEX, 공연장, 관광 거점을 방문하는 고객을 위한 객실 예약과 체류 운영을 함께 지원합니다.",
      en: "Room booking and stay operations for visitors heading to KINTEX, venues, and tourism hubs.",
    },
    summary: {
      ko: "객실 예약, 그룹 룸블록, VIP 스테이까지 하나의 운영 구조로 연결합니다.",
      en: "Individual rooms, group room blocks, and VIP stays are connected within one operating structure.",
    },
  },
  "restaurant-booking-platform": {
    eyebrow: { ko: "음식점예약", en: "Restaurant Booking" },
    title: { ko: "고양 음식점예약 플랫폼", en: "Goyang Restaurant Booking Platform" },
    description: {
      ko: "단체 식사, 로컬 미식, VIP 다이닝을 시간대와 목적에 맞춰 예약하고 운영합니다.",
      en: "Book and operate group dining, local food experiences, and VIP dining by schedule and purpose.",
    },
    summary: {
      ko: "행사 식사부터 지역 미식 체험까지 하나의 예약 구조로 관리합니다.",
      en: "From event meals to local culinary experiences, everything is managed in one reservation structure.",
    },
  },
  "cafe-booking-platform": {
    eyebrow: { ko: "라이프스타일 예약", en: "Lifestyle Booking" },
    title: { ko: "라이프스타일 예약 플랫폼", en: "Lifestyle Booking Platform" },
    description: {
      ko: "브런치, 카페, 감성 공간, 미팅 장소까지 한 번에 연결되는 라이프스타일 예약 서비스입니다.",
      en: "A lifestyle reservation service connecting brunch, cafes, mood spaces, and meeting places in one flow.",
    },
    summary: {
      ko: "휴식, 모임, 체류 경험을 함께 설계하는 고양형 라이프스타일 예약 구조입니다.",
      en: "A Goyang lifestyle booking structure for rest, gatherings, and extended stay experiences.",
    },
  },
  "ticket-agency-platform": {
    eyebrow: { ko: "티켓예약", en: "Ticket Booking" },
    title: { ko: "고양 티켓예약 플랫폼", en: "Goyang Ticket Booking Platform" },
    description: {
      ko: "공연, 전시, 체험 프로그램 티켓을 비교하고 예약까지 이어지는 통합 발권 서비스입니다.",
      en: "An integrated ticketing service for browsing and booking performances, exhibitions, and activity programs.",
    },
    summary: {
      ko: "공연 일정, 좌석 옵션, 패키지 결제를 하나의 발권 흐름으로 연결합니다.",
      en: "Schedules, seating options, and package payments are connected in one ticketing flow.",
    },
  },
  "airport-pickup-platform": {
    eyebrow: { ko: "공항픽업예약", en: "Airport Pickup Booking" },
    title: { ko: "공항픽업예약 플랫폼", en: "Airport Pickup Booking Platform" },
    description: {
      ko: "인천공항과 김포공항에서 고양 주요 거점까지 바로 연결되는 픽업·샌딩 서비스입니다.",
      en: "Pickup and sending services directly connecting Incheon and Gimpo airports with major Goyang destinations.",
    },
    summary: {
      ko: "도착, 출발, 차량 선택, 현장 운영까지 하나의 이동 예약 구조로 연결합니다.",
      en: "Arrival, departure, vehicle selection, and on-site operations are managed in one transfer booking structure.",
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
