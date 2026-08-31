"use client";
// GOYANG MOVE 탭 스위처 (오더 #A4 [2] · #A5 [1][2] 확장).
// URL 쿼리로 방향(dir=in|out) + IN 탭(from=…) 을 파생. 로컬 state·useEffect 없음.
//
// - dir 미지정 또는 dir=in → IN 뷰 (5탭 + 활성 탭 메소드)
// - dir=out              → OUT 뷰 (목적지 카드 그리드 + 노선도 3개 + koCard)
// - 홈 GETTING HERE 카드 링크 /dmc/move?from={key} 는 dir 미지정이라 기본 IN.

import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { KoCopyButton } from "@/components/dmc/KoCopyButton";
import { LineDiagram } from "@/components/dmc/LineDiagram";
import {
  isTabKey,
  type DmcMoveData,
  type MoveLocale,
  type Method,
  type Destination,
  type OutDiagram,
  type TabKey,
} from "@/data/dmc-move";

type Direction = "in" | "out";

const COPY_LABEL_FALLBACK: Record<MoveLocale, string> = {
  ko: "복사",
  en: "Copy",
  ja: "コピー",
  "zh-CN": "复制",
  "zh-TW": "複製",
};
const COPIED_LABEL_FALLBACK: Record<MoveLocale, string> = {
  ko: "복사됨",
  en: "Copied",
  ja: "コピーしました",
  "zh-CN": "已复制",
  "zh-TW": "已複製",
};

export function MoveTabs({
  data,
  locale,
}: {
  data: DmcMoveData;
  locale: MoveLocale;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 상태는 URL 이 단일 진실원.
  const dirParam = searchParams?.get("dir");
  const dir: Direction = dirParam === "out" ? "out" : "in";

  const fromParam = searchParams?.get("from");
  const activeTabKey: TabKey =
    isTabKey(fromParam) && dir === "in"
      ? fromParam
      : data.tabs[0]?.key ?? "incheon";

  const copyLabel = COPY_LABEL_FALLBACK[locale];
  const copiedLabel = COPIED_LABEL_FALLBACK[locale];

  const setDir = useCallback(
    (next: Direction) => {
      const params = new URLSearchParams(searchParams?.toString() ?? "");
      if (next === "out") {
        params.set("dir", "out");
        params.delete("from"); // OUT 은 from 무의미
      } else {
        params.delete("dir"); // in 은 기본값 → URL 청결 유지
      }
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  const selectTab = useCallback(
    (key: TabKey) => {
      const params = new URLSearchParams(searchParams?.toString() ?? "");
      params.set("from", key);
      params.delete("dir"); // 탭 선택은 in 방향에서만 의미
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  return (
    <>
      {/* 방향 토글 (오더 #A5 [1]) — 탭 줄 위. */}
      <div
        role="tablist"
        aria-label="direction"
        className="flex flex-wrap gap-2"
      >
        {(["in", "out"] as const).map((d) => {
          const selected = d === dir;
          return (
            <button
              key={d}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setDir(d)}
              className={
                selected
                  ? "border border-[#232322] bg-[#232322] px-5 py-2.5 text-sm font-black uppercase tracking-[0.16em] text-white transition-colors"
                  : "border border-[#232322]/20 bg-white px-5 py-2.5 text-sm font-black uppercase tracking-[0.16em] text-[#232322] transition-colors hover:border-[#D4AF37] hover:text-[#D4AF37]"
              }
            >
              {data.directions[d][locale]}
            </button>
          );
        })}
      </div>

      {dir === "in" ? (
        <InView
          tabs={data.tabs}
          activeKey={activeTabKey}
          onSelectTab={selectTab}
          locale={locale}
          copyLabel={copyLabel}
          copiedLabel={copiedLabel}
        />
      ) : (
        <OutView
          out={data.out}
          locale={locale}
          copyLabel={copyLabel}
          copiedLabel={copiedLabel}
        />
      )}
    </>
  );
}

function InView({
  tabs,
  activeKey,
  onSelectTab,
  locale,
  copyLabel,
  copiedLabel,
}: {
  tabs: DmcMoveData["tabs"];
  activeKey: TabKey;
  onSelectTab: (key: TabKey) => void;
  locale: MoveLocale;
  copyLabel: string;
  copiedLabel: string;
}) {
  const activeTab = tabs.find((t) => t.key === activeKey) ?? tabs[0];

  return (
    <>
      {/* IN 탭 헤더 */}
      <div
        role="tablist"
        aria-label="GOYANG MOVE tabs"
        className="mt-8 flex flex-wrap gap-2 border-b border-[#232322]/15 pb-4"
      >
        {tabs.map((t) => {
          const selected = t.key === activeKey;
          return (
            <button
              key={t.key}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => onSelectTab(t.key)}
              className={
                selected
                  ? "border border-[#232322] bg-[#232322] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-white transition-colors"
                  : "border border-[#232322]/20 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#232322] transition-colors hover:border-[#D4AF37] hover:text-[#D4AF37]"
              }
            >
              {t.label[locale]}
            </button>
          );
        })}
      </div>

      {activeTab && (
        <div className="mt-10 space-y-16">
          {activeTab.intro && (
            <p className="max-w-3xl text-base leading-relaxed text-[#232322]/85">
              {activeTab.intro[locale]}
            </p>
          )}
          {activeTab.methods.map((m) => (
            <MethodCard
              key={m.id}
              method={m}
              locale={locale}
              copyLabel={copyLabel}
              copiedLabel={copiedLabel}
            />
          ))}
        </div>
      )}
    </>
  );
}

function OutView({
  out,
  locale,
  copyLabel,
  copiedLabel,
}: {
  out: DmcMoveData["out"];
  locale: MoveLocale;
  copyLabel: string;
  copiedLabel: string;
}) {
  return (
    <div className="mt-10 space-y-16">
      {/* 리드 */}
      <p className="max-w-3xl text-base leading-relaxed text-[#232322]/85">
        {out.lead[locale]}
      </p>

      {/* 목적지 카드 7개 — 데스크톱 3열 · 모바일 1열 (오더 #A5 [3]) */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {out.destinations.map((d) => (
          <DestinationCard key={d.id} dest={d} locale={locale} />
        ))}
      </div>

      {/* 노선도 3개 — 세로 배치 (오더 #A5 [4]) */}
      <div className="space-y-16">
        {out.diagrams.map((d) => (
          <OutDiagramCard key={d.id} data={d} locale={locale} />
        ))}
      </div>

      {/* 한국어 원문 카드 (오더 #A5 [5]) */}
      <div className="border border-[#232322]/20 p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#D4AF37]">
            {out.koCard.label[locale]}
          </div>
          <KoCopyButton
            text={out.koCard.sentenceKo}
            label={copyLabel}
            copiedLabel={copiedLabel}
          />
        </div>
        <p className="mt-4 text-xl font-black leading-tight text-[#232322] sm:text-2xl">
          {out.koCard.sentenceKo}
        </p>
      </div>
    </div>
  );
}

function DestinationCard({
  dest,
  locale,
}: {
  dest: Destination;
  locale: MoveLocale;
}) {
  return (
    <article className="flex items-center justify-between gap-4 border border-[#232322]/15 p-5">
      <div className="min-w-0">
        <div className="text-lg font-black leading-tight text-[#232322]">
          {dest.name[locale]}
        </div>
        <div className="mt-1 text-xs text-[#232322]/70">
          {dest.route[locale]}
        </div>
      </div>
      <div className="shrink-0 text-2xl font-black text-[#D4AF37]">
        {dest.duration[locale]}
      </div>
    </article>
  );
}

function OutDiagramCard({
  data,
  locale,
}: {
  data: OutDiagram;
  locale: MoveLocale;
}) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-black leading-tight tracking-[-0.02em] text-[#232322] sm:text-xl">
        {data.titleKo}
      </h3>
      <LineDiagram data={data.diagram} />
      <p className="text-sm leading-relaxed text-[#232322]/85">
        {data.note[locale]}
      </p>
    </div>
  );
}

function MethodCard({
  method,
  locale,
  copyLabel,
  copiedLabel,
}: {
  method: Method;
  locale: MoveLocale;
  copyLabel: string;
  copiedLabel: string;
}) {
  const rows = (method.infoRows ?? []).filter((r) => r.value !== null);

  return (
    <article className="space-y-6">
      {/* 제목 + 배지 */}
      <header>
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-2xl font-black leading-tight tracking-[-0.02em] text-[#232322] sm:text-3xl">
            {method.title[locale]}
          </h3>
          {method.badge && (
            <span className="inline-block border border-[#D4AF37] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.24em] text-[#D4AF37]">
              {method.badge[locale]}
            </span>
          )}
        </div>
        {method.region && (
          <p className="mt-2 text-sm text-[#232322]/70">
            {method.region[locale]}
          </p>
        )}
      </header>

      {/* 노선도 */}
      {method.diagram && <LineDiagram data={method.diagram} />}

      {/* 정보표 — 값이 null 인 row 는 제외됨 */}
      {rows.length > 0 && (
        <dl className="divide-y divide-[#232322]/15 border-y border-[#232322]/15">
          {rows.map((r, i) => (
            <div
              key={i}
              className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-[140px_1fr] sm:gap-4"
            >
              <dt className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#232322]/60">
                {r.label[locale]}
              </dt>
              <dd className="text-sm text-[#232322]">
                {r.value?.[locale]}
              </dd>
            </div>
          ))}
        </dl>
      )}

      {/* 주의문 */}
      {method.notice && (
        <p className="border-l-2 border-[#D4AF37] pl-4 text-sm leading-relaxed text-[#232322]/85">
          {method.notice[locale]}
        </p>
      )}

      {/* 비고 */}
      {method.note && (
        <p className="text-xs leading-relaxed text-[#232322]/60">
          {method.note[locale]}
        </p>
      )}

      {/* 이미지 슬롯 — 파일이 없으면 렌더 생략 (경로 미지정) */}
      {method.imageSlot && (
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#232322]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={method.imageSlot} alt="" className="h-full w-full object-cover" />
        </div>
      )}

      {/* 한국어 원문 카드 */}
      {method.koCard && (
        <div className="border border-[#232322]/20 p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#D4AF37]">
              {method.koCard.label[locale]}
            </div>
            <KoCopyButton
              text={method.koCard.sentenceKo}
              label={copyLabel}
              copiedLabel={copiedLabel}
            />
          </div>
          <p className="mt-4 text-xl font-black leading-tight text-[#232322] sm:text-2xl">
            {method.koCard.sentenceKo}
          </p>
        </div>
      )}
    </article>
  );
}
