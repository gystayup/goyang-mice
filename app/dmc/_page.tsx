// /[locale]/dmc — 오더 #C51 티켓 커머스 페이지 재구성.
//
// 방침 (사장님 확정):
//   · /dmc = "티켓으로 판매하는 모든 것" 페이지 (공연·전시·축제·체험·입장권·투어·가족)
//   · service 6종 (tour/stay/restaurant/cafe/airport/medical) 은 /best 쪽 · /dmc 미노출
//   · MICE 참가권은 exhibition과 동일 구조 (별도 카테고리 미신설)
//
// 이전 (#C49·#C50): Hero + Exhibitions + Performances 2섹션 + PLACES + MOVE + FINAL CTA.
// 지금 (#C51):
//   1. Hero 제거
//   2. 짧은 제목 + 카테고리 필터 바 (전체 + 7종 · 0건 숨김 · 클라이언트 필터)
//   3. 단일 티켓 그리드 (섹션 분리 없음)
//   4. FINAL CTA 1개 + "당일코스 보기" 통합
//   5. PLACES · GOYANG MOVE 제거
//
// 톤 정합:
//   · 배경 흰/#faf7f2 · 여백 py-16 sm:py-20 lg:py-24 · 폭 max-w-7xl
//   · 네비 하단선 ~ 첫 콘텐츠 0px (Hero 제거 후 확인)
//
// 데이터 소스 (#C50 유지): await readTicketCatalog() — Supabase pages/ticket-catalog · DB 실패 시 정적 폴백.
// legacy "k-pop" 카테고리는 normalizeTicketCategory 로 concert 매핑 (Supabase 데이터 변경 금지 · G7 LOCK).

import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";

import Shell from "@/components/layout/Shell";
import DmcTicketGrid from "@/components/dmc/DmcTicketGrid";
import { readTicketCatalog } from "@/lib/ticket-catalog-db";
import { Link } from "@/lib/navigation";

export const dynamic = "force-dynamic";

export type PageLocale = "ko" | "en" | "ja" | "zh-CN" | "zh-TW";

type DmcCopy = {
  metadata: Metadata;
  eyebrow: string;
  title: string;
  desc: string;
  ctaTicket: string;
  emptyPlaceholder: string;
  catalogViewAll: string;
  final: { title: string; description: string };
};

const koreanCopy: DmcCopy = {
  metadata: { title: "고양 티켓", description: "고양에서 열리는 공연·전시·축제 티켓 안내." },
  eyebrow: "GOYANG TICKETS",
  title: "티켓",
  desc: "고양에서 열리는 공연·전시·축제를 한 곳에서 확인하세요.",
  ctaTicket: "티켓 안내",
  emptyPlaceholder: "등록된 티켓이 곧 여기에 표시됩니다.",
  catalogViewAll: "당일코스 보기",
  final: { title: "고양에서 무엇을 할지 함께 찾아드립니다", description: "방문 목적과 일정에 맞는 안내를 연결해 드립니다." },
};

const englishCopy: DmcCopy = {
  metadata: { title: "Goyang Tickets", description: "Tickets for concerts, exhibitions and festivals in Goyang." },
  eyebrow: "GOYANG TICKETS",
  title: "Tickets",
  desc: "Find what's on in Goyang — all in one place.",
  ctaTicket: "Ticket info",
  emptyPlaceholder: "Registered tickets will appear here soon.",
  catalogViewAll: "See day trips",
  final: { title: "Let us help you find what to do in Goyang", description: "We connect you with guidance that fits your purpose and schedule." },
};

const japaneseCopy: DmcCopy = {
  metadata: { title: "高陽チケット", description: "高陽で開催される公演・展示・フェスティバルのチケット案内。" },
  eyebrow: "GOYANG TICKETS",
  title: "チケット",
  desc: "高陽で開催される公演・展示・フェスティバルを一カ所で。",
  ctaTicket: "チケット案内",
  emptyPlaceholder: "登録されたチケットが近日中にここに表示されます。",
  catalogViewAll: "日帰り旅行を見る",
  final: { title: "高陽での過ごし方を一緒に探します", description: "訪問の目的と日程に合った案内をおつなぎします。" },
};

const chineseSimplifiedCopy: DmcCopy = {
  metadata: { title: "高阳门票", description: "高阳演出·展览·节庆门票指南。" },
  eyebrow: "GOYANG TICKETS",
  title: "门票",
  desc: "高阳举办的演出·展览·节庆，一站式查看。",
  ctaTicket: "门票信息",
  emptyPlaceholder: "已登记的门票将很快显示在此。",
  catalogViewAll: "查看一日游",
  final: { title: "一起找到在高阳的玩法", description: "为您连接符合出行目的与日程的指引。" },
};

const chineseTraditionalCopy: DmcCopy = {
  metadata: { title: "高陽門票", description: "高陽演出·展覽·節慶門票指南。" },
  eyebrow: "GOYANG TICKETS",
  title: "門票",
  desc: "高陽舉辦的演出·展覽·節慶，一站式查看。",
  ctaTicket: "門票資訊",
  emptyPlaceholder: "已登記的門票將很快顯示在此。",
  catalogViewAll: "查看一日遊",
  final: { title: "一起找到在高陽的玩法", description: "為您連接符合出行目的與日程的指引。" },
};

export const metadata: Metadata = koreanCopy.metadata;

function getCopy(locale: PageLocale) {
  if (locale === "en") return englishCopy;
  if (locale === "ja") return japaneseCopy;
  if (locale === "zh-CN") return chineseSimplifiedCopy;
  if (locale === "zh-TW") return chineseTraditionalCopy;
  return koreanCopy;
}

export default async function DmcPage({ locale = "ko" }: { locale?: PageLocale }) {
  const copy = getCopy(locale);
  // 오더 #C50 데이터 소스: admin Supabase 우선 · DB 실패 시 정적 폴백.
  const products = await readTicketCatalog();

  return (
    <Shell>
      {/* 홈 정합: max-w-7xl · py-16 sm:py-20 lg:py-24. Hero 제거 → 네비 하단선 ~ 첫 콘텐츠 0px */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
        <div className="text-[11px] font-bold uppercase tracking-[0.28em] text-[var(--accent)]">
          {copy.eyebrow}
        </div>
        <h1 className="mt-3 text-2xl font-black tracking-[-0.03em] text-[#232322] sm:text-3xl lg:text-4xl">
          {copy.title}
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base">
          {copy.desc}
        </p>

        {/* 카테고리 필터 바 + 단일 티켓 그리드 (client) */}
        <div className="mt-10">
          <DmcTicketGrid
            initialTickets={products}
            locale={locale}
            ctaLabel={copy.ctaTicket}
            emptyLabel={copy.emptyPlaceholder}
          />
        </div>
      </section>

      {/* FINAL CTA + 당일코스 보기 통합 */}
      <section className="bg-[#faf7f2]">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-black leading-tight tracking-[-0.03em] text-[#232322] sm:text-3xl lg:text-4xl">
              {copy.final.title}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
              {copy.final.description}
            </p>
            <div className="mt-8 flex justify-center">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-sm font-bold text-white shadow-[0_8px_20px_rgba(16,32,58,0.20)] transition hover:brightness-110"
              >
                {copy.catalogViewAll}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Shell>
  );
}
