import type { Metadata } from "next";

import Shell from "@/components/layout/Shell";
import SectionTitle from "@/components/common/SectionTitle";

export const metadata: Metadata = {
  title: "개인정보 처리방침",
  description: "고양 MICE 플랫폼의 개인정보 처리방침 안내 페이지입니다.",
  alternates: {
    canonical: "/ko/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <Shell>
      <div className="mx-auto max-w-4xl px-6 py-16">
        <SectionTitle
          eyebrow="Privacy"
          title="개인정보 처리방침"
          desc="현재 홈페이지 고도화 단계에 맞춰 개인정보 처리방침 페이지를 정리 중입니다. 문의 전 개인정보 처리와 상담 접수 원칙은 운영팀에서 별도로 안내해드립니다."
        />
      </div>
    </Shell>
  );
}
