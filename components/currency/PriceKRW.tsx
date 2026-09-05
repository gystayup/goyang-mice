// components/currency/PriceKRW.tsx — 오더 #C58 [1] KRW 금액을 컨텍스트 통화로 표시.
//
// · SSR 컴포넌트 안에서도 <PriceKRW krw={..} /> 로 삽입 가능한 client island.
// · 결제 화면에서는 사용 금지 (Toss 실결제는 원화 고정).

"use client";

import { useCurrency } from "@/components/currency/CurrencyProvider";

export default function PriceKRW({ krw, className, suffix }: { krw: number; className?: string; suffix?: string }) {
  const { format } = useCurrency();
  return (
    <span className={className}>
      {format(krw)}
      {suffix ?? null}
    </span>
  );
}
