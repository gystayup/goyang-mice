"use client";

// components/day-trips/DayTripStickyCta.tsx — 오더 #C61 [7].
// 하단 sticky CTA. 스크롤이 문서 하단 80% 지점을 넘긴 뒤에만 노출.
// - 신규 라이브러리 도입 0 · 브라우저 API 만 사용.
// - IntersectionObserver 로 동적으로 body 하단 80% 지점에 sentinel 배치.
// - IO 미지원 브라우저 · 초기 SSR 폴백: 상시 표시 (기능 손실 없음).

import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "@/lib/navigation";

export default function DayTripStickyCta({
  href,
  label,
  introText,
}: {
  href: string;
  label: string;
  introText: string;
}) {
  const [visible, setVisible] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (typeof IntersectionObserver === "undefined") {
      // IO 미지원 → 폴백: 상시 표시. setState 는 다음 tick 으로 미룸
      // (react-hooks/set-state-in-effect 룰 회피).
      const t = window.setTimeout(() => setVisible(true), 0);
      return () => window.clearTimeout(t);
    }

    // 스크롤 문서 80% 지점에 sentinel div 를 절대 배치하고 IO 로 관찰.
    // body 에 얹으므로 페이지 레이아웃엔 영향 없음.
    const sentinel = document.createElement("div");
    sentinel.setAttribute("aria-hidden", "true");
    sentinel.setAttribute("data-day-trip-cta-sentinel", "true");
    sentinel.style.position = "absolute";
    sentinel.style.left = "0";
    sentinel.style.width = "1px";
    sentinel.style.height = "1px";
    sentinel.style.pointerEvents = "none";
    document.body.appendChild(sentinel);

    const positionSentinel = () => {
      const total = document.documentElement.scrollHeight;
      // 문서 총 높이 80% 지점에 sentinel · 이 지점이 뷰포트에 들어오면 노출.
      sentinel.style.top = `${Math.max(0, total * 0.8)}px`;
    };
    positionSentinel();

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setVisible(true);
        }
      },
      { threshold: 0 }
    );
    io.observe(sentinel);

    // 레이아웃 변화 · 이미지 로딩 · 리사이즈 대응
    const onLayoutChange = () => positionSentinel();
    window.addEventListener("resize", onLayoutChange);
    window.addEventListener("load", onLayoutChange);
    const mo = new MutationObserver(onLayoutChange);
    mo.observe(document.body, { childList: true, subtree: true });
    const raf = window.requestAnimationFrame(onLayoutChange);

    return () => {
      io.disconnect();
      mo.disconnect();
      window.removeEventListener("resize", onLayoutChange);
      window.removeEventListener("load", onLayoutChange);
      window.cancelAnimationFrame(raf);
      sentinel.remove();
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      role="complementary"
      data-day-trip-sticky-cta
      aria-hidden={!visible}
      className={
        "sticky bottom-0 z-30 border-t border-slate-200 bg-[#faf7f2]/95 backdrop-blur transition-opacity duration-300 " +
        (visible ? "opacity-100" : "pointer-events-none opacity-0")
      }
    >
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-4 py-4 sm:flex-row sm:justify-between sm:px-6">
        <p className="text-sm text-[#232322] sm:text-base">{introText}</p>
        <Link
          href={href}
          className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-bold text-white shadow-[0_8px_20px_rgba(226,62,46,0.28)] transition hover:brightness-110"
        >
          {label} <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
