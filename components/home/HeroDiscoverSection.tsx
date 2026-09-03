// components/home/HeroDiscoverSection.tsx — 오더 #C14b 홈 히어로 · #C23 마감 고도화 · #C25 런던식 리뉴얼.
//
// 구조:
//   1) 배경: HeroSlider Ken Burns 6장 (hero-{cat}.jpg 6장 자산 재사용)
//      · 오더 #C25: 스크림 소폭 감소 (#C23 감소분에서 한 단계 더 · 사진 살림 · 가독성 유지)
//      · 자동 8초 순환 (client)
//   2) 오버레이:
//      · brand eyebrow — 오더 #C23 도입, #C25: 색 accent (얇은 줄 + accent 라벨 · 5로케일)
//      · 초대형 헤드라인 "Discover GOYANG" (5로케일 · text-5xl → text-8xl)
//      · 서브 카피 (5로케일)
//      · 검색바 UI — 오더 #C23 도입, #C25: 우측 accent 원형 제출 버튼 (UI만 · 라우팅 미구현)
//      · 신뢰배너 3칸 — 오더 #C23 도입 (인덱스 01·02·03 + 아이콘 정돈),
//        #C25: 카드 배경을 accent 로 · 흰 글씨 (런던식 하단 컬러바)
//
// 규범:
//   · 판매·예약·"예약" 표현 0. 검색 기능 구현 0 (UI 뼈대만).
//   · 브랜드 색: var(--charcoal) · var(--gold) 병존, var(--accent) 신규 (오더 #C25).
//   · 신뢰배너 3칸은 사실 근거만 (data/home-copy.ts SSOT).
//   · 5로케일 ko 폴백.

"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Search, Zap, Award, Sparkles } from "lucide-react";

import { HERO_DISCOVER, pickHomeLocale } from "@/data/home-copy";

// 배경 슬라이드 6장 (hero-{cat}.jpg 재사용).
const BG_SLIDES = ["walk", "food", "culture", "kculture", "history", "family"] as const;
const SLIDE_MS = 8000;

// 신뢰배너 아이콘 (index 순서: GTX=Zap · UNESCO=Award · MICE=Sparkles).
const BANNER_ICONS = [Zap, Award, Sparkles];

export default function HeroDiscoverSection({ locale }: { locale: string }) {
  const active = pickHomeLocale(locale);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = window.setInterval(() => setIndex((c) => (c + 1) % BG_SLIDES.length), SLIDE_MS);
    return () => window.clearInterval(t);
  }, []);

  return (
    <section className="relative overflow-hidden bg-[#0a0e1a] text-white">
      {/* ── 배경 슬라이드 · Ken Burns · 크로스페이드 ── */}
      <style>{`
        @keyframes hero-discover-kb {
          0% { transform: scale(1); }
          100% { transform: scale(1.12); }
        }
        .hero-discover-kb {
          animation: hero-discover-kb 14s ease-out infinite alternate;
          will-change: transform;
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-discover-kb { animation: none !important; transform: none !important; }
        }
      `}</style>

      <div className="absolute inset-0">
        {BG_SLIDES.map((cat, i) => (
          <div
            key={cat}
            aria-hidden="true"
            className={`absolute inset-0 transition-opacity duration-1000 ${
              i === index ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          >
            <div className="relative h-full w-full hero-discover-kb">
              <Image
                src={`/images/hero/hero-${cat}.jpg`}
                alt=""
                fill
                sizes="100vw"
                priority={i === 0}
                className="object-cover"
              />
            </div>
          </div>
        ))}
        {/* 오더 #C25: 스크림 소폭 감소 — 세로 0.35→0.28 · 0.60→0.50 · 0.85→0.72 (사진 살림 · 가독성 유지). */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0.50) 55%, rgba(0,0,0,0.72) 100%)",
          }}
        />
        {/* 좌측 강 스크림도 감소 (0.55→0.42) — 좌 정렬 텍스트 가독은 유지. */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background: "linear-gradient(90deg, rgba(0,0,0,0.42) 0%, rgba(0,0,0,0) 60%)",
          }}
        />
      </div>

      {/* ── 오버레이 컨텐츠 ── */}
      <div className="relative mx-auto max-w-7xl px-4 pt-24 pb-16 sm:px-6 sm:pt-32 sm:pb-20 lg:pt-40 lg:pb-28">
        {/* 오더 #C23 도입 · #C25 [3]: brand eyebrow — accent 얇은 줄 + accent 라벨 (작게 · 5로케일). */}
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="inline-block h-px w-8 bg-[var(--accent)]"
          />
          <span className="text-[10px] font-bold uppercase tracking-[0.32em] text-[var(--accent)] sm:text-[11px]">
            {HERO_DISCOVER.brandEyebrow[active]}
          </span>
        </div>

        {/* 초대형 헤드라인 */}
        <h1 className="mt-5 text-5xl font-black leading-[0.95] tracking-[-0.04em] sm:text-6xl lg:text-7xl xl:text-8xl">
          {HERO_DISCOVER.headline[active]}
        </h1>

        {/* 서브 카피 */}
        <p className="mt-6 max-w-3xl text-base font-semibold leading-relaxed text-white/90 sm:text-lg lg:text-xl">
          {HERO_DISCOVER.subhead[active]}
        </p>

        {/* 오더 #C23 도입 · #C25 [4]: 검색바 UI + 우측 accent 원형 제출 버튼. 라우팅 미구현 · UI 뼈대만. */}
        <form
          action="#"
          onSubmit={(e) => e.preventDefault()}
          role="search"
          aria-label={HERO_DISCOVER.searchAriaLabel[active]}
          className="mt-8 max-w-2xl"
        >
          <div className="flex items-center gap-2 rounded-full bg-white/95 py-2 pl-5 pr-2 shadow-[0_10px_28px_rgba(0,0,0,0.28)] backdrop-blur">
            <Search className="h-5 w-5 shrink-0 text-slate-500" aria-hidden="true" />
            <input
              type="search"
              placeholder={HERO_DISCOVER.searchPlaceholder[active]}
              aria-label={HERO_DISCOVER.searchAriaLabel[active]}
              className="min-w-0 flex-1 bg-transparent text-sm text-slate-950 outline-none placeholder:text-slate-500 sm:text-base"
            />
            <button
              type="submit"
              aria-label={HERO_DISCOVER.searchButtonAriaLabel[active]}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-white shadow-[0_4px_12px_rgba(226,62,46,0.45)] transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              <Search className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </form>

        {/* 오더 #C23 도입 (인덱스 01·02·03 + 아이콘) · #C25 [4]: 카드 배경 accent + 흰 글씨 (런던식 하단 컬러바). */}
        <ul className="mt-10 grid grid-cols-1 gap-4 sm:mt-12 sm:grid-cols-3 sm:gap-5">
          {HERO_DISCOVER.trustBanner.map((b, i) => {
            const Icon = BANNER_ICONS[i] ?? Sparkles;
            return (
              <li
                key={i}
                className="relative overflow-hidden rounded-2xl bg-[var(--accent)] px-5 py-5 shadow-[0_10px_30px_rgba(226,62,46,0.35)]"
              >
                <div className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20 text-white"
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/85">
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <div className="mt-1 text-base font-black leading-tight tracking-[-0.02em] text-white sm:text-lg">
                      {b.title[active]}
                    </div>
                    <p className="mt-2 text-xs leading-snug text-white/90 sm:text-sm">
                      {b.desc[active]}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
