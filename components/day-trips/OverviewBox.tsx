// components/day-trips/OverviewBox.tsx — 오더 #D09 [1]-B.
//
// 상세 페이지 좌측 상단 회색박스 (visitlondon 개요 박스 참고):
//   · 알약형 탭 [개요 / 위치]
//   · 개요 탭: 2×2 그리드 (총소요·이동·추천시간·이런분께)
//   · 위치 탭: 대곡역 교통 개념도 이미지 (지역별 로컬라이즈)
// 배경 #ebebeb, padding 18px 22px 22px. 아이콘 얇은 라인 (stroke-width 1.2).

"use client";

import { useState } from "react";
import Image from "next/image";
import { Clock, Route, Sun, Users, MapPin } from "lucide-react";

import { Link } from "@/lib/navigation";

type Locale = "ko" | "en" | "ja" | "zh-CN" | "zh-TW";

type Overview = {
  totalDuration?: string;
  transport?: string;
  recommendedTime?: string;
  recommendedFor?: string;
};

const TABS: Record<Locale, { overview: string; location: string }> = {
  ko: { overview: "개요", location: "위치" },
  en: { overview: "Overview", location: "Location" },
  ja: { overview: "概要", location: "位置" },
  "zh-CN": { overview: "概览", location: "位置" },
  "zh-TW": { overview: "概覽", location: "位置" },
};

const ITEM_LABELS: Record<Locale, {
  totalDuration: string;
  transport: string;
  recommendedTime: string;
  recommendedFor: string;
}> = {
  ko: { totalDuration: "총 소요", transport: "이동", recommendedTime: "추천 시간", recommendedFor: "이런 분께" },
  en: { totalDuration: "Total time", transport: "Transit", recommendedTime: "Best time", recommendedFor: "For you if" },
  ja: { totalDuration: "総所要", transport: "移動", recommendedTime: "おすすめ時間", recommendedFor: "こんな方に" },
  "zh-CN": { totalDuration: "总用时", transport: "交通", recommendedTime: "推荐时间", recommendedFor: "适合" },
  "zh-TW": { totalDuration: "總用時", transport: "交通", recommendedTime: "推薦時間", recommendedFor: "適合" },
};

const MAP_LINK: Record<Locale, string> = {
  ko: "대곡역 교통 개념도 보기",
  en: "See Daegok Station map",
  ja: "大谷駅 交通図を見る",
  "zh-CN": "查看大谷站交通图",
  "zh-TW": "查看大谷站交通圖",
};

export default function OverviewBox({
  locale,
  overview,
}: {
  locale: Locale;
  overview: Overview;
}) {
  const [tab, setTab] = useState<"overview" | "location">("overview");
  const t = TABS[locale] ?? TABS.ko;
  const labels = ITEM_LABELS[locale] ?? ITEM_LABELS.ko;

  return (
    <div className="rounded-md" style={{ background: "#ebebeb", padding: "18px 22px 22px" }}>
      {/* 알약형 탭 */}
      <div className="inline-flex rounded-full bg-white/70 p-0.5">
        {(["overview", "location"] as const).map((key) => {
          const active = tab === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={`rounded-full px-4 py-1.5 text-[13px] font-bold transition ${
                active
                  ? "bg-[var(--accent)] text-white"
                  : "text-[#232322] hover:bg-white"
              }`}
            >
              {t[key]}
            </button>
          );
        })}
      </div>

      {/* 개요 탭 */}
      {tab === "overview" && (
        <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-4">
          <Cell
            icon={<Clock className="h-[19px] w-[19px]" strokeWidth={1.2} />}
            label={labels.totalDuration}
            value={overview.totalDuration}
          />
          <Cell
            icon={<Route className="h-[19px] w-[19px]" strokeWidth={1.2} />}
            label={labels.transport}
            value={overview.transport}
          />
          <Cell
            icon={<Sun className="h-[19px] w-[19px]" strokeWidth={1.2} />}
            label={labels.recommendedTime}
            value={overview.recommendedTime}
          />
          <Cell
            icon={<Users className="h-[19px] w-[19px]" strokeWidth={1.2} />}
            label={labels.recommendedFor}
            value={overview.recommendedFor}
          />
        </dl>
      )}

      {/* 위치 탭 */}
      {tab === "location" && (
        <div className="mt-4">
          <Link
            href="/dmc/move"
            locale={locale}
            className="group block overflow-hidden rounded-md border border-slate-300 bg-white"
          >
            <Image
              src={`/images/transit/daegok-access-map-${locale}.svg`}
              alt={MAP_LINK[locale]}
              width={720}
              height={480}
              className="h-auto w-full transition group-hover:opacity-90"
            />
          </Link>
          <div className="mt-2 flex items-center gap-1 text-[12px] font-semibold text-[var(--accent)]">
            <MapPin className="h-3.5 w-3.5" strokeWidth={1.2} />
            {MAP_LINK[locale]}
          </div>
        </div>
      )}
    </div>
  );
}

function Cell({ icon, label, value }: { icon: React.ReactNode; label: string; value?: string }) {
  if (!value) return <div />;
  return (
    <div>
      <div className="flex items-center gap-1.5 text-[13px] font-bold text-[#232322]">
        <span aria-hidden="true" className="text-[#232322]/80">
          {icon}
        </span>
        <span>{label}</span>
      </div>
      <div className="mt-1 text-[13.5px] leading-[1.5] text-[#232322]">{value}</div>
    </div>
  );
}
