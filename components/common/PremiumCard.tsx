import React from "react";

interface PremiumCardProps {
  children: React.ReactNode;
  className?: string;
}

// 오더 #G1 [1]:
//   · 이브로우 잘림 방지 위해 기본 padding p-6 sm:p-8 내장
//     (호출부에서 별도 className="p-*" 지정 시 tailwind 규칙상 뒤쪽이 이겨서
//      기존 사용처는 무영향).
//   · 그림자·backdrop-blur·hover translate/그림자 전면 제거 (홈·BEST 정합).
//   · 배경 bg-white, 보더 border-[#232322]/15 로 색 3종 규격 정리.
//   · overflow-hidden 도 제거 — 이브로우가 rounded 코너에 걸리는 경우 방지.
export default function PremiumCard({
  children,
  className = ""
}: PremiumCardProps) {
  return (
    <div
      className={`relative rounded-[28px] border border-[#232322]/15 bg-white p-6 transition-colors sm:p-8 ${className}`}
    >
      {children}
    </div>
  );
}
