"use client";
// components/dmc/SpotDetailTabs.tsx
// /dmc/[slug] 개요·위치 탭 스위처 (오더 #B1 [3]).
//
// URL: ?tab=overview|location. 기본값 overview.
// #A4·#A5 동일 패턴: useSearchParams() 로 상태 파생, 로컬 state·useEffect 없음.
//
// 두 탭 콘텐츠는 서버에서 미리 렌더한 ReactNode 로 prop 전달받고,
// 이 컴포넌트는 활성 탭만 노출한다 (양쪽 콘텐츠가 항상 DOM 에는 있지만
// hidden 처리하면 접힘 상태에서 스크린리더가 헷갈릴 수 있어 조건부 렌더).

import type { ReactNode } from "react";
import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type TabKey = "overview" | "location";

const TAB_KEYS: TabKey[] = ["overview", "location"];
function isTabKey(v: string | null | undefined): v is TabKey {
  return typeof v === "string" && (TAB_KEYS as string[]).includes(v);
}

export function SpotDetailTabs({
  labels,
  overview,
  location,
}: {
  labels: { overview: string; location: string };
  overview: ReactNode;
  location: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const q = searchParams?.get("tab");
  const active: TabKey = isTabKey(q) ? q : "overview";

  const selectTab = useCallback(
    (key: TabKey) => {
      const params = new URLSearchParams(searchParams?.toString() ?? "");
      if (key === "overview") {
        params.delete("tab"); // 기본값 → URL 청결 유지
      } else {
        params.set("tab", key);
      }
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  return (
    <>
      <div
        role="tablist"
        aria-label="spot-detail tabs"
        className="flex flex-wrap gap-2 border-b border-[#232322]/15 pb-4"
      >
        {TAB_KEYS.map((k) => {
          const selected = k === active;
          return (
            <button
              key={k}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => selectTab(k)}
              className={
                selected
                  ? "border border-[#232322] bg-[#232322] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-white transition-colors"
                  : "border border-[#232322]/20 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#232322] transition-colors hover:border-[#D4AF37] hover:text-[#D4AF37]"
              }
            >
              {labels[k]}
            </button>
          );
        })}
      </div>

      <div className="mt-10">
        {active === "overview" ? overview : location}
      </div>
    </>
  );
}
