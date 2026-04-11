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

export default function ExpandableStats({ stats, locale }: Props) {
  const [open, setOpen] = useState(false);
  const isEn = locale === "en";

  return (
    <div className="mt-4 border-t border-slate-100 pt-4">
      {/* 토글 버튼 */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-center gap-2 rounded-[18px] border border-slate-200 bg-slate-50/80 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
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
              className={`rounded-[20px] border border-slate-100 px-4 py-4 shadow-[0_6px_18px_rgba(16,32,58,0.04)] sm:px-5 ${stat.tone}`}
            >
              <div className="text-base font-black tracking-[-0.03em] text-slate-950 sm:text-lg lg:text-xl">
                {stat.value}
              </div>
              <p className="mt-1.5 text-xs leading-5 text-slate-600 sm:text-sm sm:leading-6">
                {stat.label}
              </p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
