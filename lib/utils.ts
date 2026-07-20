/**
 * Utility Functions
 * 폼 검증, API 호출, 유틸리티 함수
 */

// ============ 폼 검증 ============
export const validation = {
  /**
   * 이메일 검증
   */
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * 전화번호 검증
   */
  isValidPhone: (phone: string): boolean => {
    const phoneRegex = /^0\d{1,2}-?\d{3,4}-?\d{4}$/;
    return phoneRegex.test(phone.replace(/-/g, ''));
  },

  /**
   * 필수 필드 검증
   */
  validateRequired: (value: string | null | undefined): boolean => {
    return value !== null && value !== undefined && value.trim() !== '';
  },

  /**
   * 숫자 범위 검증
   */
  validateRange: (value: number, min: number, max: number): boolean => {
    return value >= min && value <= max;
  },
};

// ============ API 호출 ============
export const api = {
  /**
   * 예약 신청
   */
  createBooking: async (data: any) => {
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Booking API Error:', error);
      throw error;
    }
  },

  /**
   * 문의 신청
   */
  createInquiry: async (data: any) => {
    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Inquiry API Error:', error);
      throw error;
    }
  },

  /**
   * 상품 목록 조회
   */
  getProducts: async (type?: string) => {
    try {
      const url = type ? `/api/products?type=${type}` : '/api/products';
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Products API Error:', error);
      throw error;
    }
  },

  /**
   * 상품 상세 조회
   */
  getProductDetail: async (id: string) => {
    try {
      const response = await fetch(`/api/products/${id}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Product Detail API Error:', error);
      throw error;
    }
  },
};

// ============ 포맷팅 ============
export const format = {
  /**
   * 통화 포맷팅 (원 단위)
   */
  currency: (value: number): string => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
      minimumFractionDigits: 0,
    }).format(value);
  },

  /**
   * 날짜 포맷팅
   */
  date: (date: Date | string, format: string = 'YYYY.MM.DD'): string => {
    const d = typeof date === 'string' ? new Date(date) : date;
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');

    return format
      .replace('YYYY', String(year))
      .replace('MM', month)
      .replace('DD', day)
      .replace('HH', hours)
      .replace('mm', minutes);
  },

  /**
   * 폰 번호 포맷팅
   */
  phone: (phone: string): string => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      // 서울 번호(02): 2-4-4 분할 (예: 0212345678 → 02-1234-5678)
      if (cleaned.startsWith('02')) {
        return `${cleaned.slice(0, 2)}-${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
      }
      // 그 외 10자리: 3-3-4 분할
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    if (cleaned.length === 11) {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7)}`;
    }
    return phone;
  },

  /**
   * 예약번호 생성
   */
  generateBookingNo: (): string => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = String(Math.floor(Math.random() * 9999)).padStart(4, '0');
    return `BK-${year}${month}${day}-${random}`;
  },
};

// ============ 상태 관리 ============
export const status = {
  bookingStatus: {
    received: '접수',
    reviewing: '검토중',
    confirmed: '확정',
    on_hold: '보류',
    cancelled: '취소',
  },

  inquiryStatus: {
    received: '접수',
    reviewing: '검토중',
    replied: '회신완료',
    closed: '종료',
  },

  productType: {
    stay: '숙박',
    experience: '체험',
    tour: '관광상품',
    package: '패키지',
  },

  inquiryType: {
    research: '연구용역 문의',
    policy: '정책협력 문의',
    dmc: 'DMC 상담',
    booking: '숙박·체험 예약 문의',
    event: '행사운영 문의',
    partnership: '협업 제안',
  },
};

// ============ 기타 유틸리티 ============
export const utils = {
  /**
   * 딜레이
   */
  delay: (ms: number): Promise<void> => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  },

  /**
   * 클립보드에 복사
   */
  copyToClipboard: async (text: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      console.error('Copy to clipboard error:', error);
      throw error;
    }
  },

  /**
   * URL 파라미터 파싱
   */
  parseQueryString: (queryString: string): Record<string, string> => {
    const params = new URLSearchParams(queryString);
    const result: Record<string, string> = {};
    params.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  },

  /**
   * Deep clone
   */
  deepClone: <T>(obj: T): T => {
    return JSON.parse(JSON.stringify(obj));
  },
};
