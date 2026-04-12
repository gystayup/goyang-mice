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
      className={`relative overflow-hidden rounded-[28px] border border-white/80 bg-white/75 shadow-[0_8px_28px_rgba(16,32,58,0.07)] backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:bg-white/90 hover:shadow-[0_16px_40px_rgba(16,32,58,0.11)] ${className}`}
    >
      {children}
    </div>
  );
}
