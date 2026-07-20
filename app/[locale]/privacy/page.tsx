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

// 통신판매업 필수 게재 정보
const BUSINESS_INFO = [
  { label: "상호", value: "원새봄 주식회사" },
  { label: "대표", value: "심송학" },
  { label: "사업자등록번호", value: "287-87-01247" },
  {
    label: "통신판매업 신고번호",
    value: "제 2021-서울서초-3110 호",
    note: "소재지 이전에 따른 변경신고 예정",
  },
  { label: "소재지", value: "경기도 고양시 일산동구 호수로 358-25, 동문타워2차 618호" },
  { label: "대표전화", value: "010-8851-1274" },
  { label: "이메일", value: "onesaebom1@gmail.com" },
];

export default function PrivacyPage() {
  return (
    <Shell>
      <div className="mx-auto max-w-4xl px-6 py-16">
        <SectionTitle
          eyebrow="Privacy"
          title="개인정보 처리방침"
          desc="현재 홈페이지 고도화 단계에 맞춰 개인정보 처리방침 페이지를 정리 중입니다. 문의 전 개인정보 처리와 상담 접수 원칙은 운영팀에서 별도로 안내해드립니다."
        />

        {/* 개인정보관리책임자 — 강조 표시 */}
        <section className="mt-10 rounded-[24px] border border-slate-900 bg-slate-950 p-6 text-white sm:p-8">
          <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
            Privacy Officer
          </div>
          <div className="mt-3 flex items-baseline gap-3">
            <span className="text-sm font-semibold text-slate-300">
              개인정보관리책임자
            </span>
            <span className="text-2xl font-black tracking-tight text-white">
              심송학
            </span>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            개인정보 처리 관련 문의는 아래 사업자 연락처로 접수해 주시면 담당자가 확인 후 회신드립니다.
          </p>
        </section>

        {/* 사업자 정보 — 통신판매업 필수 게재 */}
        <section className="mt-6 rounded-[24px] border border-slate-200 bg-slate-50 p-6 sm:p-8">
          <h2 className="text-lg font-black tracking-tight text-slate-950">
            사업자 정보
          </h2>
          <dl className="mt-5 grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
            {BUSINESS_INFO.map((item) => (
              <div key={item.label} className="flex flex-col gap-1 sm:flex-row sm:gap-3">
                <dt className="shrink-0 font-semibold text-slate-500 sm:w-40">
                  {item.label}
                </dt>
                <dd className="text-slate-800">
                  {item.value}
                  {item.note && (
                    <span className="ml-1 text-xs text-slate-500">({item.note})</span>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </Shell>
  );
}
