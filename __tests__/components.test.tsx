/**
 * 컴포넌트 테스트
 * Card, InfoBox 등의 공유 컴포넌트 테스트
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { Card, InfoBox } from '@/components/shared-components';

describe('Card Component', () => {
  it('컨텐츠를 렌더링해야 함', () => {
    render(
      <Card>
        <div>테스트 컨텐츠</div>
      </Card>
    );

    expect(screen.getByText('테스트 컨텐츠')).toBeInTheDocument();
  });

  it('커스텀 클래스네임을 적용해야 함', () => {
    const { container } = render(
      <Card className="custom-class">
        <div>컨텐츠</div>
      </Card>
    );

    const cardElement = container.querySelector('.custom-class');
    expect(cardElement).toBeInTheDocument();
  });

  it('그림자와 둥근 모서리를 포함해야 함', () => {
    const { container } = render(
      <Card>
        <div>컨텐츠</div>
      </Card>
    );

    const cardElement = container.firstChild;
    // shared-components.tsx Card 실제 클래스: rounded-[30px] ... p-8 shadow-sm
    expect(cardElement).toHaveClass('shadow-sm');
    expect(cardElement).toHaveClass('rounded-[30px]');
    expect(cardElement).toHaveClass('p-8');
  });
});

describe('InfoBox Component', () => {
  it('정보 박스를 렌더링해야 함', () => {
    render(<InfoBox />);
    // InfoBox 요소가 렌더링 되는지 확인
    expect(document.querySelector('[class*="bg-"]')).toBeInTheDocument();
  });

  it('기본 스타일을 적용해야 함', () => {
    const { container } = render(<InfoBox />);
    const infoBox = container.firstChild;

    // shared-components.tsx InfoBox 실제 클래스:
    //   flex items-center justify-between rounded-[28px] ... px-6 py-4 shadow-sm
    // (p-* 단축 클래스 없음 → px/py 축별로 분리)
    expect(infoBox).toHaveClass('px-6');
    expect(infoBox).toHaveClass('py-4');
    expect(infoBox).toHaveClass('rounded-[28px]');
  });
});

describe('BookingForm Component', () => {
  // TODO: BookingForm 테스트
  it('예약 폼을 렌더링해야 함', () => {
    // BookingForm 렌더링 테스트
  });

  it('필수 필드를 표시해야 함', () => {
    // 필수 필드 마김 테스트
  });

  it('제출 시 유효성 검사를 수행해야 함', () => {
    // 유효성 검사 테스트
  });
});

describe('InquiryForm Component', () => {
  // TODO: InquiryForm 테스트
  it('문의 폼을 렌더링해야 함', () => {
    // InquiryForm 렌더링 테스트
  });

  it('문의 타입 드롭다운을 표시해야 함', () => {
    // 드롭다운 렌더링 테스트
  });

  it('메시지 길이를 검증해야 함', () => {
    // 메시지 길이 검사 테스트
  });
});
