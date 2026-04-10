import React from "react";
import { Search } from "lucide-react";

export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-[30px] border border-slate-200 bg-white p-8 shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

export function InfoBox() {
  return (
    <div className="flex items-center justify-between rounded-[28px] border border-slate-200 bg-white px-6 py-4 shadow-sm">
      <div className="flex items-center gap-3 text-sm text-slate-500">
        <Search className="h-4 w-4" />
        예약 전환 화면과 관리자 운영 화면까지 포함한 확장 시안입니다.
      </div>
      <div className="rounded-full bg-slate-100 px-4 py-1 text-xs font-semibold text-slate-600">
        Operational Prototype
      </div>
    </div>
  );
}
