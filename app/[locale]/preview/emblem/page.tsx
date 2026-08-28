// 엠블럼 프리뷰 라우트 — 실물 검수용 (홈 적용 전 렌더 품질 확인).
// robots noindex 로 검색 노출 차단, 판매 소구어 없음, 임시 라우트.
// 클라이언트 상태(로케일 전환) 는 preview-client.tsx 에 위임.
import type { Metadata } from "next";

import EmblemPreviewClient from "./preview-client";

export const metadata: Metadata = {
  title: "Emblem Preview",
  description: "고양 BEST 엠블럼 렌더 품질 검수용 비공개 프리뷰.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
};

export default function EmblemPreviewPage() {
  return <EmblemPreviewClient />;
}
