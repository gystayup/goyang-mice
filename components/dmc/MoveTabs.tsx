"use client";
// GOYANG MOVE 탭 스위처 (오더 #A4 [2]).
// URL 쿼리(?from=incheon|gimpo|seoul|metro|other) ↔ 클라이언트 상태 동기화.
// 홈 GETTING HERE 5카드가 각각 /dmc/move?from={key} 로 진입.

import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { KoCopyButton } from "@/components/dmc/KoCopyButton";
import { LineDiagram } from "@/components/dmc/LineDiagram";
import {
  isTabKey,
  type MoveLocale,
  type MoveTab,
  type Method,
  type TabKey,
} from "@/data/dmc-move";

type Props = {
  tabs: MoveTab[];
  locale: MoveLocale;
};

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

export function MoveTabs({ tabs, locale }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 상태는 URL 이 단일 진실원 — 별도 로컬 state 를 두면 URL 과 어긋날 수 있고
  // useEffect 로 재동기화하면 캐스케이딩 렌더가 발생한다.
  const q = searchParams?.get("from");
  const active: TabKey = isTabKey(q) ? q : tabs[0]?.key ?? "incheon";

  const handleSelect = useCallback(
    (key: TabKey) => {
      const params = new URLSearchParams(searchParams?.toString() ?? "");
      params.set("from", key);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  const activeTab = tabs.find((t) => t.key === active) ?? tabs[0];
  const copyLabel = COPY_LABEL_FALLBACK[locale];
  const copiedLabel = COPIED_LABEL_FALLBACK[locale];

  return (
    <>
      {/* 탭 헤더 */}
      <div
        role="tablist"
        aria-label="GOYANG MOVE tabs"
        className="flex flex-wrap gap-2 border-b border-[#232322]/15 pb-4"
      >
        {tabs.map((t) => {
          const selected = t.key === active;
          return (
            <button
              key={t.key}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => handleSelect(t.key)}
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

      {/* 탭 콘텐츠 */}
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
