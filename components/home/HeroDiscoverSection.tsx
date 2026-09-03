// components/home/HeroDiscoverSection.tsx — 오더 #C14b 홈 히어로 개편.
//
// 구조:
//   1) 배경: HeroSlider Ken Burns 6장 (자산 재사용 · hero-{cat}.jpg 6장)
//      · 어두운 스크림 강화 (텍스트 대비)
//      · 자동 8초 순환 (client)
//   2) 오버레이:
//      · eyebrow "GOYANG DMC" (5로케일 공통 브랜드)
//      · 초대형 헤드라인 "Discover GOYANG" (5로케일 · text-5xl → text-8xl)
//      · 서브 카피 (5로케일)
//      · 검색바 UI 뼈대 (라우팅 미구현 · placeholder만) · form submit 시 이동 없음
//      · 신뢰배너 3칸 (GTX 16분 · UNESCO×Netflix · 한류·MICE 특구)
//
// 규범:
//   · 판매·예약·"예약" 표현 0. 검색바는 UI 뼈대 (별도 오더로 라우팅 확장).
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
        {/* 스크림: 상단 옅게 → 하단 강하게. 좌측 강하게 (텍스트 정렬 좌) */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.60) 55%, rgba(0,0,0,0.85) 100%)",
          }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background: "linear-gradient(90deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 60%)",
          }}
        />
      </div>

      {/* ── 오버레이 컨텐츠 ── */}
      <div className="relative mx-auto max-w-7xl px-4 pt-24 pb-16 sm:px-6 sm:pt-32 sm:pb-20 lg:pt-40 lg:pb-28">
        <div className="text-[10px] font-bold uppercase tracking-[0.32em] text-[var(--gold,#D4AF37)] sm:text-[11px]">
          GOYANG DMC
        </div>

        {/* 초대형 헤드라인 */}
        <h1 className="mt-4 text-5xl font-black leading-[0.95] tracking-[-0.04em] sm:text-6xl lg:text-7xl xl:text-8xl">
          {HERO_DISCOVER.headline[active]}
        </h1>

        {/* 서브 카피 */}
        <p className="mt-6 max-w-3xl text-base font-semibold leading-relaxed text-white/90 sm:text-lg lg:text-xl">
          {HERO_DISCOVER.subhead[active]}
        </p>

        {/* 검색바 UI 뼈대 (라우팅 미구현) */}
        <form
          action="#"
          onSubmit={(e) => e.preventDefault()}
          role="search"
          aria-label={HERO_DISCOVER.searchAriaLabel[active]}
          className="mt-8 max-w-2xl"
        >
          <div className="flex items-center gap-3 rounded-full bg-white/95 px-5 py-3 shadow-[0_10px_28px_rgba(0,0,0,0.28)] backdrop-blur">
            <Search className="h-5 w-5 shrink-0 text-slate-500" aria-hidden="true" />
            <input
              type="search"
              placeholder={HERO_DISCOVER.searchPlaceholder[active]}
              aria-label={HERO_DISCOVER.searchAriaLabel[active]}
              className="min-w-0 flex-1 bg-transparent text-sm text-slate-950 outline-none placeholder:text-slate-500 sm:text-base"
            />
          </div>
        </form>

        {/* 신뢰배너 3칸 */}
        <ul className="mt-10 grid grid-cols-1 gap-4 sm:mt-12 sm:grid-cols-3 sm:gap-5">
          {HERO_DISCOVER.trustBanner.map((b, i) => {
            const Icon = BANNER_ICONS[i] ?? Sparkles;
            return (
              <li
                key={i}
                className="flex items-start gap-3 rounded-2xl border border-white/15 bg-white/[0.08] px-5 py-4 backdrop-blur"
              >
                <span
                  aria-hidden="true"
                  className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--gold,#D4AF37)]/20 text-[var(--gold,#D4AF37)]"
                >
                  <Icon className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <div className="text-sm font-black tracking-[-0.02em] text-white sm:text-base">
                    {b.title[active]}
                  </div>
                  <p className="mt-1 text-xs leading-snug text-white/80 sm:text-sm">
                    {b.desc[active]}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
