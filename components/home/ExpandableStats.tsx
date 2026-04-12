"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

type Stat = {
  value: string;
  label: string;
  tone: string;
};

type Props = {
  stats: Stat[];
  locale: string;
};

const toneGlow: Record<string, string> = {
  "bg-[#fffdf0]": "rgba(255,233,139,0.4)",
  "bg-[#f0fdf8]": "rgba(141,240,207,0.4)",
  "bg-[#f0f4ff]": "rgba(100,130,255,0.35)",
  "bg-[#fff6f2]": "rgba(255,143,126,0.4)",
};

export default function ExpandableStats({ stats, locale }: Props) {
  const [open, setOpen] = useState(false);
  const isEn = locale === "en";

  return (
    <div className="mt-4 border-t border-slate-100/80 pt-4">
      {/* 토글 버튼 */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-center gap-2 rounded-[18px] border border-white/80 bg-white/60 py-3 text-sm font-bold text-slate-600 shadow-[0_2px_8px_rgba(16,32,58,0.05)] backdrop-blur transition hover:bg-white/80 hover:text-slate-800"
      >
        {open ? (
          <>
            {isEn ? "Collapse" : "접기"}
            <ChevronUp className="h-4 w-4" />
          </>
        ) : (
          <>
            {isEn ? "More +" : "더 보기 +"}
            <ChevronDown className="h-4 w-4" />
          </>
        )}
      </button>

      {/* 펼쳐지는 통계 4개 */}
      {open && (
        <div className="mt-3 grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          {stats.map((stat) => (
            <article
              key={stat.value}
              className={`group relative overflow-hidden rounded-[20px] border border-white/80 px-4 py-4 shadow-[0_6px_18px_rgba(16,32,58,0.05)] transition duration-300 hover:-translate-y-0.5 sm:px-5 ${stat.tone}`}
              style={{ boxShadow: `0 6px 18px ${toneGlow[stat.tone] ?? "rgba(16,32,58,0.06)"}` }}
            >
              <div className="text-base font-black tracking-[-0.03em] text-slate-950 sm:text-lg lg:text-xl">
                {stat.value}
              </div>
              <p className="mt-1.5 text-xs leading-5 text-slate-500 sm:text-sm sm:leading-6">
                {stat.label}
              </p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
