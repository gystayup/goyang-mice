"use client";
// 한국어 원문 카드 (오더 #P7 [2]⑭) — 클립보드 복사 버튼.
// 서버 컴포넌트인 상세 페이지 안에서 클라이언트 상호작용만 담당.

import { useState } from "react";

export function KoCopyButton({
  text,
  label,
  copiedLabel,
}: {
  text: string;
  label: string;
  copiedLabel: string;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // 클립보드 API 실패 시 무음 처리 (구형 브라우저·안전 컨텍스트 미충족).
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 border border-[#232322] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#232322] transition-colors hover:border-[#D4AF37] hover:text-[#D4AF37]"
      aria-live="polite"
    >
      📋 {copied ? copiedLabel : label}
    </button>
  );
}
