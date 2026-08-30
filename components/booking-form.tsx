'use client';

import React, { useState } from 'react';
import { api, validation, status } from '@/lib/utils';
import { BookingRequest } from '@/lib/database';

interface BookingFormProps {
  productId: string;
  productTitle: string;
  onSuccess?: () => void;
}

export function BookingForm({ productId, productTitle, onSuccess }: BookingFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState<BookingRequest>({
    product_id: productId,
    customer_name: '',
    organization_name: '',
    phone: '',
    email: '',
    booking_date: new Date().toISOString().split('T')[0],
    guest_count: 1,
    request_note: '',
    privacy_agreed: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // 유효성 검사
    if (!validation.validateRequired(formData.customer_name)) {
      setError('담당자명을 입력해주세요.');
      return;
    }

    if (!validation.isValidPhone(formData.phone)) {
      setError('올바른 전화번호 형식을 입력해주세요.');
      return;
    }

    if (!validation.isValidEmail(formData.email)) {
      setError('올바른 이메일 주소를 입력해주세요.');
      return;
    }

    if (!validation.validateRequired(formData.booking_date)) {
      setError('예약 날짜를 선택해주세요.');
      return;
    }

    if (!validation.validateRange(formData.guest_count, 1, 1000)) {
      setError('인원 수는 1명 이상이어야 합니다.');
      return;
    }

    if (!formData.privacy_agreed) {
      setError('개인정보 수집 및 이용에 동의해주세요.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.createBooking(formData);

      if (response.success) {
        setSuccess(true);
        setFormData({
          product_id: productId,
          customer_name: '',
          organization_name: '',
          phone: '',
          email: '',
          booking_date: new Date().toISOString().split('T')[0],
          guest_count: 1,
          request_note: '',
          privacy_agreed: false,
        });

        onSuccess?.();

        setTimeout(() => setSuccess(false), 5000);
      } else {
        setError(response.error || '예약 신청 중 오류가 발생했습니다.');
      }
    } catch (err) {
      setError('예약 신청 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      console.error('Booking form error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 상품명 (읽기 전용) */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          상품명
        </label>
        <input
          type="text"
          value={productTitle}
          disabled
          className="w-full px-4 py-2 rounded-lg border border-slate-300 bg-slate-50 text-slate-500 cursor-not-allowed"
        />
      </div>

      {/* 기관명 */}
      <div>
        <label htmlFor="organization_name" className="block text-sm font-medium text-slate-700 mb-2">
          기관명 / 단체명 (선택)
        </label>
        <input
          id="organization_name"
          name="organization_name"
          type="text"
          value={formData.organization_name}
          onChange={handleChange}
          placeholder="예: 고양상공회의소"
          className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-slate-900 focus:outline-none"
        />
      </div>

      {/* 담당자명 */}
      <div>
        <label htmlFor="customer_name" className="block text-sm font-medium text-slate-700 mb-2">
          담당자명 <span className="text-red-500">*</span>
        </label>
        <input
          id="customer_name"
          name="customer_name"
          type="text"
          value={formData.customer_name}
          onChange={handleChange}
          placeholder="홍길동"
          required
          className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-slate-900 focus:outline-none"
        />
      </div>

      {/* 연락처 */}
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">
          연락처 <span className="text-red-500">*</span>
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          placeholder="010-0000-0000"
          required
          className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-slate-900 focus:outline-none"
        />
      </div>

      {/* 이메일 */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
          이메일 <span className="text-red-500">*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="example@example.com"
          required
          className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-slate-900 focus:outline-none"
        />
      </div>

      {/* 예약 날짜 */}
      <div>
        <label htmlFor="booking_date" className="block text-sm font-medium text-slate-700 mb-2">
          예약 희망일 <span className="text-red-500">*</span>
        </label>
        <input
          id="booking_date"
          name="booking_date"
          type="date"
          value={formData.booking_date}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-slate-900 focus:outline-none"
        />
      </div>

      {/* 인원 수 */}
      <div>
        <label htmlFor="guest_count" className="block text-sm font-medium text-slate-700 mb-2">
          인원 수 <span className="text-red-500">*</span>
        </label>
        <input
          id="guest_count"
          name="guest_count"
          type="number"
          min="1"
          value={formData.guest_count}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-slate-900 focus:outline-none"
        />
      </div>

      {/* 요청사항 */}
      <div>
        <label htmlFor="request_note" className="block text-sm font-medium text-slate-700 mb-2">
          추가 요청사항 (선택)
        </label>
        <textarea
          id="request_note"
          name="request_note"
          value={formData.request_note}
          onChange={handleChange}
          placeholder="특별한 요청사항이 있으신가요?"
          rows={4}
          className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-slate-900 focus:outline-none resize-none"
        />
      </div>

      {/* 약관 동의 */}
      <div className="flex items-start gap-3">
        <input
          id="privacy_agreed"
          name="privacy_agreed"
          type="checkbox"
          checked={formData.privacy_agreed}
          onChange={handleChange}
          required
          className="mt-1"
        />
        <label htmlFor="privacy_agreed" className="text-sm text-slate-600">
          개인정보 수집 및 이용에 동의합니다. <span className="text-red-500">*</span>
        </label>
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* 성공 메시지 */}
      {success && (
        <div className="p-4 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">
          예약이 정상적으로 접수되었습니다!
        </div>
      )}

      {/* 제출 버튼 */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full px-6 py-3 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 disabled:bg-slate-400 transition"
      >
        {isLoading ? '처리 중...' : '안내 보기'}
      </button>
    </form>
  );
}
