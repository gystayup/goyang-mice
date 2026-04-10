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
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#ff7d66] sm:text-xs">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="mt-3 text-[1.9rem] font-black leading-[1.08] tracking-[-0.04em] text-[#10203a] [text-wrap:balance] sm:text-[2.3rem] lg:text-[2.9rem]">
        {title}
      </h2>
      {desc ? (
        <p className="mt-4 max-w-3xl text-[15px] leading-7 text-slate-600 sm:text-base sm:leading-8">
          {desc}
        </p>
      ) : null}
    </div>
  );
}
