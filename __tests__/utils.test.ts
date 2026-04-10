/**
 * API & Utility 테스트
 * Jest/Vitest를 사용하여 테스트합니다
 */

import { validation, format, status } from '@/lib/utils';

describe('Validation Functions', () => {
  describe('isValidEmail', () => {
    it('올바른 이메일을 검증해야 함', () => {
      expect(validation.isValidEmail('test@example.com')).toBe(true);
      expect(validation.isValidEmail('user+tag@domain.co.kr')).toBe(true);
    });

    it('잘못된 이메일을 거부해야 함', () => {
      expect(validation.isValidEmail('invalid')).toBe(false);
      expect(validation.isValidEmail('user@')).toBe(false);
      expect(validation.isValidEmail('@example.com')).toBe(false);
    });
  });

  describe('isValidPhone', () => {
    it('올바른 전화번호를 검증해야 함', () => {
      expect(validation.isValidPhone('010-1234-5678')).toBe(true);
      expect(validation.isValidPhone('01012345678')).toBe(true);
      expect(validation.isValidPhone('02-123-4567')).toBe(true);
    });

    it('잘못된 전화번호를 거부해야 함', () => {
      expect(validation.isValidPhone('123-456')).toBe(false);
      expect(validation.isValidPhone('abc-def-ghij')).toBe(false);
    });
  });

  describe('validateRequired', () => {
    it('필수 값이 있으면 true를 반환해야 함', () => {
      expect(validation.validateRequired('test')).toBe(true);
      expect(validation.validateRequired('  text  ')).toBe(true);
    });

    it('빈 값이면 false를 반환해야 함', () => {
      expect(validation.validateRequired('')).toBe(false);
      expect(validation.validateRequired(null)).toBe(false);
      expect(validation.validateRequired(undefined)).toBe(false);
    });
  });

  describe('validateRange', () => {
    it('범위 내 값을 검증해야 함', () => {
      expect(validation.validateRange(5, 1, 10)).toBe(true);
      expect(validation.validateRange(1, 1, 10)).toBe(true);
      expect(validation.validateRange(10, 1, 10)).toBe(true);
    });

    it('범위 밖 값을 거부해야 함', () => {
      expect(validation.validateRange(0, 1, 10)).toBe(false);
      expect(validation.validateRange(11, 1, 10)).toBe(false);
    });
  });
});

describe('Format Functions', () => {
  describe('currency', () => {
    it('숫자를 원 단위로 포맷팅해야 함', () => {
      const result = format.currency(1000000);
      expect(result).toContain('1,000,000');
      expect(result).toContain('₩');
    });

    it('소수점을 처리해야 함', () => {
      const result = format.currency(1234.56);
      // 원 단위는 정수이므로 반올림되어야 함
      expect(typeof result).toBe('string');
    });
  });

  describe('date', () => {
    it('날짜를 YYYY.MM.DD 형식으로 포맷팅해야 함', () => {
      const date = new Date('2026-05-10');
      const result = format.date(date, 'YYYY.MM.DD');
      expect(result).toMatch(/\d{4}\.\d{2}\.\d{2}/);
    });

    it('문자열 날짜를 처리해야 함', () => {
      const result = format.date('2026-05-10', 'YYYY.MM.DD');
      expect(result).toMatch(/\d{4}\.\d{2}\.\d{2}/);
    });
  });

  describe('phone', () => {
    it('전화번호를 포맷팅해야 함', () => {
      expect(format.phone('01012345678')).toBe('010-1234-5678');
      expect(format.phone('0212345678')).toBe('02-1234-5678');
    });

    it('이미 포맷된 번호를 처리해야 함', () => {
      const result = format.phone('010-1234-5678');
      expect(result).toContain('010');
    });
  });

  describe('generateBookingNo', () => {
    it('예약번호를 생성해야 함', () => {
      const bookingNo = format.generateBookingNo();
      expect(bookingNo).toMatch(/^BK-\d{8}-\d{4}$/);
    });

    it('고유한 예약번호를 생성해야 함', () => {
      const no1 = format.generateBookingNo();
      const no2 = format.generateBookingNo();
      expect(no1).not.toBe(no2);
    });
  });
});

describe('Status Constants', () => {
  it('예약 상태를 포함해야 함', () => {
    expect(status.bookingStatus.received).toBe('접수');
    expect(status.bookingStatus.confirmed).toBe('확정');
  });

  it('상품 타입을 포함해야 함', () => {
    expect(status.productType.stay).toBe('숙박');
    expect(status.productType.tour).toBe('관광상품');
  });

  it('문의 타입을 포함해야 함', () => {
    expect(status.inquiryType.dmc).toBe('DMC 상담');
    expect(status.inquiryType.partnership).toBe('협업 제안');
  });
});
