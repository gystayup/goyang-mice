// app/bamridan/_page.tsx — 오더 #C72 [1]-A.
//
// 밤리단길 인터랙티브 관광맵 페이지.
// 원본 HTML(docs/bamridan/밤리단길_관광맵_v3수정본5.html) 을 CSS Module +
// client 컴포넌트 (BamridanMap) 으로 이관. 헤더·푸터는 기존 Shell 재사용.
// 5로케일: 밤리단길 문안 자체가 ko 원문 (사장님 자료) — 다른 로케일은 ko 폴백.

import type { Metadata } from "next";

import Shell from "@/components/layout/Shell";
import BamridanMap from "@/components/bamridan/BamridanMap";

export type PageLocale = "ko" | "en" | "ja" | "zh-CN" | "zh-TW";

export function getBamridanMetadata(locale: PageLocale): Metadata {
  return {
    title: "고양·일산 핫플레이스 밤리단길",
    description:
      "정발산동 주택가 골목에 맛집·카페·디저트·소품숍·공방이 모인 고양의 로컬 라이프스타일 거리 — 27개 핫플레이스를 인터랙티브 관광맵으로 안내합니다.",
    alternates: {
      canonical: `/${locale}/bamridan`,
    },
  };
}

export const metadata = getBamridanMetadata("ko");

export default function BamridanPage(_props: { locale?: PageLocale }) {
  return (
    <Shell>
      <BamridanMap />
    </Shell>
  );
}
