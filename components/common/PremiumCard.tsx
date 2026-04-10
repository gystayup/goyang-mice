import React from "react";

interface PremiumCardProps {
  children: React.ReactNode;
  className?: string;
}

export default function PremiumCard({
  children,
  className = ""
}: PremiumCardProps) {
  return (
    <div
      className={`rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm hover:shadow-lg transition-shadow ${className}`}
    >
      {children}
    </div>
  );
}