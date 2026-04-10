import Image from "next/image";
import React from "react";

interface ImageCardProps {
  src: string;
  title: string;
  subtitle?: string;
  className?: string;
}

export default function ImageCard({ src, title, subtitle, className = "" }: ImageCardProps) {
  return (
    <div className={`relative overflow-hidden rounded-[30px] ${className}`}>
      <Image src={src} alt={title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0f1a36]/80 via-[#0f1a36]/20 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-6 text-white">
        {subtitle ? <div className="text-xs font-semibold uppercase tracking-[0.18em] text-white/80">{subtitle}</div> : null}
        <div className="mt-2 text-xl font-bold tracking-tight">{title}</div>
      </div>
    </div>
  );
}