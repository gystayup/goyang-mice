// components/home/MustSeeCarousel.tsx — 오더 #C74 [1]-B.
//
// 홈 MustSeeSection 자동회전 캐러셀. 데스크톱에서 한 번에 4개(기존 카드 크기
// 유지) 보이며 4.5초마다 한 칸 순환. hover 시 일시정지, 좌우 화살표 제공.
// 모바일은 반응형 그리드(2개)로 유지 · 자동회전은 데스크톱 위주.
// 신규 npm 라이브러리 없음(순수 React + Tailwind).

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { StampBadge, stampForSlug } from "@/components/badges/StampBadge";
import { Link } from "@/lib/navigation";
import type { HomeLocale } from "@/data/home-copy";

export type MustSeeCard = {
  /** React key + slug 기반 스탬프 매핑용 (bamridan 은 stamp 없음). */
  key: string;
  href: string;
  imageSrc: string;
  /** eyebrow 코럴 라벨 (예: "walk", "culture", "HOT PLACE"). */
  category: string;
  name: string;
  subtitle: string;
  ariaLabel: string;
};

const INTERVAL_MS = 4500;
const VISIBLE = 4;

export default function MustSeeCarousel({
  cards,
  eyebrow,
  headline,
  locale,
  prevLabel = "이전",
  nextLabel = "다음",
}: {
  cards: MustSeeCard[];
  eyebrow: string;
  headline: string;
  locale: HomeLocale;
  prevLabel?: string;
  nextLabel?: string;
}) {
  const total = cards.length;
  const [startIdx, setStartIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || total <= VISIBLE) return;
    const t = setInterval(() => {
      setStartIdx((i) => (i + 1) % total);
    }, INTERVAL_MS);
    return () => clearInterval(t);
  }, [paused, total]);

  const rotated =
    total <= VISIBLE ? cards : [...cards.slice(startIdx), ...cards.slice(0, startIdx)];
  const visible = rotated.slice(0, VISIBLE);

  const prev = () => setStartIdx((i) => (i - 1 + total) % total);
  const next = () => setStartIdx((i) => (i + 1) % total);

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
        <div className="text-[11px] font-bold uppercase tracking-[0.28em] text-[var(--accent)]">
          {eyebrow}
        </div>
        <h2 className="mt-3 text-2xl font-black tracking-[-0.03em] text-[#232322] sm:text-3xl lg:text-4xl">
          {headline}
        </h2>

        <div
          className="relative mt-10"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* 좌우 화살표 (5카드 이상일 때만 노출) */}
          {total > VISIBLE && (
            <>
              <button
                type="button"
                onClick={prev}
                aria-label={prevLabel}
                className="absolute -left-3 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white/95 p-2.5 text-slate-700 shadow-md transition hover:border-[var(--accent)] hover:text-[var(--accent)] lg:inline-flex"
              >
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={next}
                aria-label={nextLabel}
                className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white/95 p-2.5 text-slate-700 shadow-md transition hover:border-[var(--accent)] hover:text-[var(--accent)] lg:inline-flex"
              >
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </button>
            </>
          )}

          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {visible.map((card) => {
              const stamp = stampForSlug(card.key);
              return (
                <li key={card.key}>
                  <Link
                    href={card.href}
                    aria-label={card.ariaLabel}
                    className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                  >
                    <article className="grid aspect-[4/5] grid-rows-[13fr_7fr] overflow-hidden rounded-[20px] bg-white ring-1 ring-slate-200/70 transition-shadow group-hover:shadow-md">
                      <div className="relative overflow-hidden bg-slate-100">
                        <Image
                          src={card.imageSrc}
                          alt=""
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          className="object-cover transition duration-500 group-hover:scale-[1.03]"
                        />
                        {stamp && (
                          <div
                            aria-hidden="true"
                            className="pointer-events-none absolute right-3 top-3"
                          >
                            <StampBadge kind={stamp} locale={locale} size={64} />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col justify-between gap-2 p-5">
                        <div>
                          <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--accent)]">
                            {card.category}
                          </div>
                          <h3 className="mt-1.5 text-base font-black leading-tight tracking-[-0.02em] text-[#232322] sm:text-lg">
                            {card.name}
                          </h3>
                          <p className="mt-2 line-clamp-2 text-sm leading-snug text-slate-600">
                            {card.subtitle}
                          </p>
                        </div>
                      </div>
                    </article>
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* 인디케이터 도트 (5카드 이상일 때만) */}
          {total > VISIBLE && (
            <div className="mt-6 flex items-center justify-center gap-1.5">
              {Array.from({ length: total }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setStartIdx(i)}
                  aria-label={`슬라이드 ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all ${
                    i === startIdx
                      ? "w-6 bg-[var(--accent)]"
                      : "w-1.5 bg-slate-300 hover:bg-slate-400"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
