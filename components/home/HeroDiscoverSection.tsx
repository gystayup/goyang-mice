// components/home/HeroDiscoverSection.tsx — 오더 #C14b · #C23 · #C25 · #C28 · #C52 마스코트 이동.
//
// 구조:
//   1) <section>  히어로 배경 + 오버레이 (배경 6장 · 스크림 · 헤드라인 · 검색바 · 우측 상단 마스코트)
//   2) <section>  하단 신뢰 띠 (Visit London 스타일 화면 폭 accent 배너)
//
// 진화:
//   #C23: brand eyebrow · 검색바 골드 원형 · 신뢰배너 3카드
//   #C25: accent 색 통일
//   #C28 [3]: 신뢰배너 화면 폭 코럴 띠
//   #C52 (지금): 홈 독립 MascotWelcomeBanner 섹션 제거 · 마스코트 이미지를 히어로 오버레이
//              우측 상단에 작게 배치 (absolute · 히어로 높이 무변경).
//              WELCOME 문구는 히어로 h1·eyebrow 와 중복이라 버림 (이미지 자체에 한글 웰컴 각인).
//
// 규범:
//   · 판매·예약·"예약" 표현 0. 검색 기능 구현 0.
//   · 브랜드 색 var(--charcoal)·var(--gold)·var(--accent).
//   · 마스코트 이미지 파일 무터치 (렌더 크기만 조정 · 오더 #C52).

"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Search, Zap, Award, Sparkles } from "lucide-react";

import { HERO_DISCOVER, pickHomeLocale } from "@/data/home-copy";

// 오더 #C52: 마스코트 alt 5로케일 (기존 MascotWelcomeBanner 에서 이관).
const MASCOT_ALT: Record<"ko" | "en" | "ja" | "zh-CN" | "zh-TW", string> = {
  ko: "한복 입은 고양 마스코트 · 어서오세요",
  en: "Goyang mascots in traditional hanbok · Welcome",
  ja: "韓服姿の高陽マスコット · ようこそ",
  "zh-CN": "身穿韩服的高阳吉祥物 · 欢迎",
  "zh-TW": "身穿韓服的高陽吉祥物 · 歡迎",
};

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
    <>
      {/* ─── 1) 히어로 섹션 (신뢰배너 제거 · pb 감소로 하단 띠와 맞닿음) ─── */}
      <section className="relative overflow-hidden bg-[#0a0e1a] text-white">
        {/* 배경 슬라이드 · Ken Burns · 크로스페이드 */}
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
          {/* 오더 #C25: 스크림 소폭 감소 (사진 살림 · 가독성 유지). */}
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0.50) 55%, rgba(0,0,0,0.72) 100%)",
            }}
          />
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background: "linear-gradient(90deg, rgba(0,0,0,0.42) 0%, rgba(0,0,0,0) 60%)",
            }}
          />
        </div>

        {/* 오버레이 컨텐츠 (오더 #C28: 신뢰배너 제거로 pb 감소 · 하단 accent 띠와 맞닿음) */}
        <div className="relative mx-auto max-w-7xl px-4 pt-24 pb-16 sm:px-6 sm:pt-32 sm:pb-20 lg:pt-40 lg:pb-24">
          {/* 오더 #C52: 마스코트 우측 상단 absolute 배치 (히어로 높이 무변경).
             데스크탑 lg 128px · md 96px · 모바일 sm 64px · 히어로 지배하지 않는 보조 요소. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-4 top-4 h-16 w-16 sm:h-20 sm:w-20 md:right-6 md:top-6 md:h-24 md:w-24 lg:right-8 lg:top-8 lg:h-32 lg:w-32"
          >
            <Image
              src="/images/mascot/welcome-hanbok-cats.png"
              alt={MASCOT_ALT[active]}
              fill
              sizes="(max-width: 640px) 64px, (max-width: 1024px) 96px, 128px"
              className="object-contain drop-shadow-[0_4px_16px_rgba(0,0,0,0.35)]"
            />
          </div>

          {/* brand eyebrow — accent 얇은 줄 + accent 라벨 (5로케일). */}
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

          {/* 검색바 UI + 우측 accent 원형 제출 버튼. 라우팅 미구현 · UI 뼈대만. */}
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
        </div>
      </section>

      {/* ─── 2) 하단 신뢰 띠 (오더 #C28 [3]) — 화면 폭 100% accent · 3항목 flex row · 구분선 ─── */}
      <section
        aria-label="Goyang trust highlights"
        className="w-full bg-[var(--accent)] text-white"
      >
        <ul className="mx-auto flex max-w-7xl flex-col sm:flex-row">
          {HERO_DISCOVER.trustBanner.map((b, i) => {
            const Icon = BANNER_ICONS[i] ?? Sparkles;
            return (
              <li
                key={i}
                className={`flex flex-1 items-start gap-3 px-5 py-5 sm:px-6 sm:py-6 ${
                  i > 0 ? "border-t border-white/20 sm:border-l sm:border-t-0" : ""
                }`}
              >
                <span
                  aria-hidden="true"
                  className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20 text-white"
                >
                  <Icon className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <div className="text-base font-black leading-tight tracking-[-0.02em] text-white sm:text-lg">
                    {b.title[active]}
                  </div>
                  <p className="mt-1 text-xs leading-snug text-white/90 sm:text-sm">
                    {b.desc[active]}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </>
  );
}
