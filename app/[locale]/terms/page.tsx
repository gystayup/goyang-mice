import type { Metadata } from "next";

import Shell from "@/components/layout/Shell";
import SectionTitle from "@/components/common/SectionTitle";

export const metadata: Metadata = {
  title: "이용약관",
  description: "고양 MICE 플랫폼의 서비스 이용약관 안내 페이지입니다.",
  alternates: {
    canonical: "/ko/terms",
  },
};

export default function TermsPage() {
  return (
    <Shell>
      <div className="mx-auto max-w-4xl px-6 py-16">
        <SectionTitle
          eyebrow="Terms"
          title="이용약관"
          desc="서비스 구조와 운영 범위를 반영한 이용약관을 현재 정리 중입니다. 프로그램 예약과 협력 문의 관련 조건은 실제 운영안 확정 후 반영됩니다."
        />
      </div>
    </Shell>
  );
}
