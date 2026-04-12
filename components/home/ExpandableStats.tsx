"use client";

import { useState } from "react";

type Stat = { value: string; label: string; tone: string };
type LocaleKey = "ko" | "en" | "ja" | "zh-CN" | "zh-TW";

const uiCopy: Record<LocaleKey, { collapse: string; more: string }> = {
  ko:      { collapse: "접기",     more: "더 보기 +" },
  en:      { collapse: "Collapse", more: "More +"    },
  ja:      { collapse: "閉じる",   more: "もっと見る +" },
  "zh-CN": { collapse: "收起",     more: "查看更多 +" },
  "zh-TW": { collapse: "收合",     more: "查看更多 +" },
};

interface Props {
  stats: Stat[];
  locale: string;
}

const LOCALES: LocaleKey[] = ["ko", "en", "ja", "zh-CN", "zh-TW"];

export default function ExpandableStats({ stats, locale }: Props) {
  const activeLocale: LocaleKey = (LOCALES.includes(locale as LocaleKey) ? locale : "ko") as LocaleKey;
  const ui = uiCopy[activeLocale];
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? stats : stats.slice(0, 2);

  return (
    <div className="mt-4">
      <div className="grid gap-3 sm:grid-cols-2">
        {visible.map((stat) => (
          <div
            key={stat.value}
            className={`rounded-[18px] border border-white/80 px-5 py-4 shadow-[0_4px_14px_rgba(16,32,58,0.06)] backdrop-blur ${stat.tone}`}
          >
            <p className="text-[1.05rem] font-black tracking-[-0.02em] text-slate-950">{stat.value}</p>
            <p className="mt-1 text-[13px] leading-6 text-slate-500">{stat.label}</p>
          </div>
        ))}
      </div>
      {stats.length > 2 && (
        <div className="mt-3 flex justify-end">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="rounded-full border border-white/70 bg-white/60 px-4 py-1.5 text-xs font-semibold text-slate-500 backdrop-blur transition hover:bg-white/80"
          >
            {expanded ? ui.collapse : ui.more}
          </button>
        </div>
      )}
    </div>
  );
}
