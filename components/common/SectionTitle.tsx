import React from "react";

interface SectionTitleProps {
  eyebrow?: string;
  title: string;
  desc?: string;
  className?: string;
}

export default function SectionTitle({
  eyebrow,
  title,
  desc,
  className = "",
}: SectionTitleProps) {
  return (
    <div className={className}>
      {eyebrow ? (
        <div className="inline-flex items-center gap-2 rounded-full border border-[#ff8f7e]/30 bg-[linear-gradient(135deg,_rgba(255,143,126,0.12),_rgba(255,181,143,0.12))] px-3.5 py-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[#ff8f7e]" />
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#ff6b52]">
            {eyebrow}
          </p>
        </div>
      ) : null}
      <h2 className="mt-4 text-[1.9rem] font-black leading-[1.08] tracking-[-0.04em] text-[#080e1a] [text-wrap:balance] sm:text-[2.3rem] lg:text-[2.9rem]">
        {title}
      </h2>
      {desc ? (
        <p className="mt-4 max-w-3xl text-[15px] leading-7 text-slate-500 sm:text-base sm:leading-8">
          {desc}
        </p>
      ) : null}
    </div>
  );
}
