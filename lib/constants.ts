/**
 * Constants & Common Types
 * 애플리케이션 전역 상수 및 타입
 */

// ============ 상수 ============
export const SITE_NAME = '고양 문화관광·MICE 연구소';
export const SITE_DESCRIPTION = '고양의 문화관광·MICE 경쟁력을 이끄는 최고의 전략 플랫폼';
export const SITE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
export const SITE_LOGO = '/logo.svg';

// ============ 메뉴 ============
export const NAVIGATION_MENU = [
  { label: '연구소 소개', href: '/institute', icon: 'Building2' },
  { label: '연구 분야', href: '/research', icon: 'Sparkles' },
  { label: 'DMC 서비스', href: '/dmc', icon: 'Compass' },
  { label: '상품', href: '/products', icon: 'ShoppingBag' },
  { label: '문의하기', href: '/contact', icon: 'Mail' },
];

export const FOOTER_MENU = [
  { label: '개인정보처리방침', href: '/privacy' },
  { label: '이용약관', href: '/terms' },
  { label: '사이트맵', href: '/sitemap' },
];

// ============ 상품 타입 ============
export const PRODUCT_TYPES = {
  STAY: 'stay',
  EXPERIENCE: 'experience',
  TOUR: 'tour',
  PACKAGE: 'package',
} as const;

export const PRODUCT_TYPE_LABELS = {
  stay: '숙박',
  experience: '체험',
  tour: '관광상품',
  package: '패키지',
} as const;

// ============ 예약 상태 ============
export const BOOKING_STATUS = {
  RECEIVED: 'received',
  REVIEWING: 'reviewing',
  CONFIRMED: 'confirmed',
  ON_HOLD: 'on_hold',
  CANCELLED: 'cancelled',
} as const;

export const BOOKING_STATUS_LABELS = {
  received: '접수',
  reviewing: '검토중',
  confirmed: '확정',
  on_hold: '보류',
  cancelled: '취소',
} as const;

// ============ 문의 타입 ============
export const INQUIRY_TYPES = {
  RESEARCH: 'research',
  POLICY: 'policy',
  DMC: 'dmc',
  BOOKING: 'booking',
  EVENT: 'event',
  PARTNERSHIP: 'partnership',
} as const;

export const INQUIRY_TYPE_LABELS = {
  research: '연구용역 문의',
  policy: '정책협력 문의',
  dmc: 'DMC 상담',
  booking: '숙박·체험 예약 문의',
  event: '행사운영 문의',
  partnership: '협업 제안',
} as const;

// ============ 문의 상태 ============
export const INQUIRY_STATUS = {
  RECEIVED: 'received',
  REVIEWING: 'reviewing',
  REPLIED: 'replied',
  CLOSED: 'closed',
} as const;

export const INQUIRY_STATUS_LABELS = {
  received: '접수',
  reviewing: '검토중',
  replied: '회신완료',
  closed: '종료',
} as const;

// ============ 페이지 경로 ============
export const PAGES = {
  HOME: '/',
  INSTITUTE: '/institute',
  RESEARCH: '/research',
  DMC: '/dmc',
  PRODUCTS: '/products',
  PRODUCTS_STAY: '/products/stay',
  PRODUCTS_EXPERIENCE: '/products/experience',
  PRODUCTS_TOUR: '/products/tour',
  PRODUCT_DETAIL: '/products/:slug',
  BOOKING: '/booking/:slug',
  BOOKING_COMPLETE: '/booking/complete',
  CONTACT: '/contact',
  PRIVACY: '/privacy',
  TERMS: '/terms',
  ADMIN_LOGIN: '/admin/login',
  ADMIN_DASHBOARD: '/admin',
  PROTOTYPE: '/prototype',
} as const;

// ============ 검증 규칙 ============
export const VALIDATION_RULES = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^0\d{1,2}-?\d{3,4}-?\d{4}$/,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  MESSAGE_MIN_LENGTH: 10,
  MESSAGE_MAX_LENGTH: 5000,
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
} as const;

// ============ 페이지네이션 ============
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
} as const;

// ============ 캐시 시간 (초) ============
export const CACHE_TIME = {
  SHORT: 60, // 1분
  MEDIUM: 300, // 5분
  LONG: 3600, // 1시간
  VERY_LONG: 86400, // 24시간
} as const;

// ============ API 응답 메시지 ============
export const API_MESSAGES = {
  SUCCESS: '요청이 성공했습니다.',
  ERROR: '요청 처리 중 오류가 발생했습니다.',
  VALIDATION_ERROR: '입력값이 올바르지 않습니다.',
  NOT_FOUND: '요청한 리소스를 찾을 수 없습니다.',
  UNAUTHORIZED: '인증이 필요합니다.',
  FORBIDDEN: '권한이 없습니다.',
  CONFLICT: '이미 존재하는 데이터입니다.',
  BOOKING_SUCCESS: '예약이 접수되었습니다. 담당자가 확인 후 연락드리겠습니다.',
  INQUIRY_SUCCESS: '문의가 접수되었습니다. 담당자가 확인 후 연락드리겠습니다.',
} as const;

// ============ 다국어 지원 ============
export const LANGUAGES = {
  KO: 'ko',
  EN: 'en',
} as const;

export const LANGUAGE_LABELS = {
  ko: '한국어',
  en: 'English',
} as const;

export const DEFAULT_LANGUAGE = 'ko' as const;

// ============ 색상 팔레트 ============
export const COLORS = {
  PRIMARY: '#1f2937', // slate-900
  SECONDARY: '#64748b', // slate-500
  SUCCESS: '#10b981', // emerald-500
  WARNING: '#f59e0b', // amber-500
  ERROR: '#ef4444', // red-500
  INFO: '#3b82f6', // blue-500
} as const;

// ============ 시간대 ============
export const TIME_ZONES = {
  KOREA: 'Asia/Seoul',
} as const;
