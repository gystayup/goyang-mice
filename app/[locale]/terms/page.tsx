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
  { label: "개인정보관리책임자", value: "심송학" },
];

export default function TermsPage() {
  return (
    <Shell>
      <div className="mx-auto max-w-4xl px-6 py-16">
        <SectionTitle
          eyebrow="Terms"
          title="이용약관"
          desc="서비스 구조와 운영 범위를 반영한 이용약관을 현재 정리 중입니다. 프로그램 예약과 협력 문의 관련 조건은 실제 운영안 확정 후 반영됩니다."
        />

        {/* 사업자 정보 — 통신판매업 필수 게재 */}
        <section className="mt-12 rounded-[24px] border border-slate-200 bg-slate-50 p-6 sm:p-8">
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
