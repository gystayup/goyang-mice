'use client';

import React, { useState } from 'react';
import { api, validation } from '@/lib/utils';
import { INQUIRY_TYPE_LABELS } from '@/lib/constants';
import { InquiryRequest } from '@/lib/database';

interface InquiryFormProps {
  onSuccess?: () => void;
}

export function InquiryForm({ onSuccess }: InquiryFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState<InquiryRequest>({
    inquiry_type: 'dmc',
    organization_name: '',
    contact_name: '',
    phone: '',
    email: '',
    subject: '',
    event_date: '',
    expected_people: undefined,
    budget_text: '',
    message: '',
    privacy_agreed: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // 유효성 검사
    if (!validation.validateRequired(formData.contact_name)) {
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

    if (!validation.validateRequired(formData.message) || formData.message.length < 10) {
      setError('문의 내용은 최소 10자 이상 입력해주세요.');
      return;
    }

    if (!formData.privacy_agreed) {
      setError('개인정보 수집 및 이용에 동의해주세요.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.createInquiry(formData);

      if (response.success) {
        setSuccess(true);
        setFormData({
          inquiry_type: 'dmc',
          organization_name: '',
          contact_name: '',
          phone: '',
          email: '',
          subject: '',
          event_date: '',
          expected_people: undefined,
          budget_text: '',
          message: '',
          privacy_agreed: false,
        });

        onSuccess?.();

        setTimeout(() => setSuccess(false), 5000);
      } else {
        setError(response.error || '문의 신청 중 오류가 발생했습니다.');
      }
    } catch (err) {
      setError('문의 신청 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      console.error('Inquiry form error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 문의 유형 */}
      <div>
        <label htmlFor="inquiry_type" className="block text-sm font-medium text-slate-700 mb-2">
          문의 유형 <span className="text-red-500">*</span>
        </label>
        <select
          id="inquiry_type"
          name="inquiry_type"
          value={formData.inquiry_type}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-slate-900 focus:outline-none"
        >
          {Object.entries(INQUIRY_TYPE_LABELS).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
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
          placeholder="예: 공아상공회의소"
          className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-slate-900 focus:outline-none"
        />
      </div>

      {/* 담당자명 */}
      <div>
        <label htmlFor="contact_name" className="block text-sm font-medium text-slate-700 mb-2">
          담당자명 <span className="text-red-500">*</span>
        </label>
        <input
          id="contact_name"
          name="contact_name"
          type="text"
          value={formData.contact_name}
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

      {/* 제목 */}
      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-2">
          제목 (선택)
        </label>
        <input
          id="subject"
          name="subject"
          type="text"
          value={formData.subject}
          onChange={handleChange}
          placeholder="문의 제목을 입력해주세요"
          className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-slate-900 focus:outline-none"
        />
      </div>

      {/* 행사일 */}
      <div>
        <label htmlFor="event_date" className="block text-sm font-medium text-slate-700 mb-2">
          행사/예정일 (선택)
        </label>
        <input
          id="event_date"
          name="event_date"
          type="date"
          value={formData.event_date}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-slate-900 focus:outline-none"
        />
      </div>

      {/* 예상 인원 */}
      <div>
        <label htmlFor="expected_people" className="block text-sm font-medium text-slate-700 mb-2">
          예상 인원 (선택)
        </label>
        <input
          id="expected_people"
          name="expected_people"
          type="number"
          min="1"
          value={formData.expected_people || ''}
          onChange={handleChange}
          placeholder="예: 50"
          className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-slate-900 focus:outline-none"
        />
      </div>

      {/* 예산 범위 */}
      <div>
        <label htmlFor="budget_text" className="block text-sm font-medium text-slate-700 mb-2">
          예산 범위 (선택)
        </label>
        <input
          id="budget_text"
          name="budget_text"
          type="text"
          value={formData.budget_text}
          onChange={handleChange}
          placeholder="예: 1,000만원 ~ 1,500만원"
          className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-slate-900 focus:outline-none"
        />
      </div>

      {/* 문의 내용 */}
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
          문의 내용 <span className="text-red-500">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="구체적인 문의 내용을 입력해주세요"
          rows={6}
          required
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
          문의가 정상적으로 접수되었습니다!
        </div>
      )}

      {/* 제출 버튼 */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full px-6 py-3 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 disabled:bg-slate-400 transition"
      >
        {isLoading ? '처리 중...' : '문의 접수하기'}
      </button>
    </form>
  );
}
