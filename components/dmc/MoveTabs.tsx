"use client";
// GOYANG MOVE 탭 스위처 (오더 #A4 [2] · #A5 [1][2] · #E2 [3][4] 확장).
// URL 쿼리로 방향(dir=in|out|essentials) + IN 탭(from=…) 을 파생. 로컬 state·useEffect 없음.
//
// - dir 미지정 또는 dir=in → IN 뷰 (5탭 + 활성 탭 메소드)
// - dir=out              → OUT 뷰 (목적지 카드 그리드 + 노선도 3개 + koCard)
// - dir=essentials       → 알아두기 뷰 (13 items + PLAN YOUR TRIP)  ← #E2

import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Toilet, Trash2, Store, Droplet, HandCoins, Footprints, CreditCard,
  Phone, Info as InfoIcon, CalendarDays, Wifi, ShieldCheck, Stethoscope,
  Compass, Accessibility, HelpCircle,
} from "lucide-react";
import type { ComponentType, SVGProps } from "react";

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
import {
  essentialsHeader,
  essentialsItems,
  planHeader,
  planFirstTime,
  planAccessibility,
  planFaq,
  type EssentialIcon,
} from "@/data/essentials";
import { spots, type Spot } from "@/data/spots";
import { Link } from "@/lib/navigation";

type Direction = "in" | "out" | "essentials";

// 오더 #E2 [3][5]: 알아두기 탭 라벨.
const ESSENTIALS_LABEL: Record<MoveLocale, string> = {
  ko: "알아두기", en: "Good to Know", ja: "知っておく",
  "zh-CN": "了解一下", "zh-TW": "了解一下",
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
  const dir: Direction =
    dirParam === "out" ? "out"
    : dirParam === "essentials" ? "essentials"
    : "in";

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
      } else if (next === "essentials") {
        params.set("dir", "essentials");
        params.delete("from");
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
        {(["in", "out", "essentials"] as const).map((d) => {
          const selected = d === dir;
          // 오더 #E2 [3]: essentials 는 dmc-move.ts data.directions 미포함 → 별도 라벨.
          const label =
            d === "essentials" ? ESSENTIALS_LABEL[locale] : data.directions[d][locale];
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
              {label}
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
      ) : dir === "out" ? (
        <OutView
          out={data.out}
          locale={locale}
          copyLabel={copyLabel}
          copiedLabel={copiedLabel}
        />
      ) : (
        <EssentialsView locale={locale} />
      )}
    </>
  );
}

// ─── 오더 #E2 [3][4]: 알아두기 뷰 ─────────────────────────────────────────
const ICON_MAP: Record<EssentialIcon, ComponentType<SVGProps<SVGSVGElement>>> = {
  Toilet, Trash2, Store, Droplet, HandCoins, Footprints, CreditCard,
  Phone, Info: InfoIcon, CalendarDays, Wifi, ShieldCheck, Stethoscope,
};

function EssentialsView({ locale }: { locale: MoveLocale }) {
  return (
    <div className="mt-10 space-y-20">
      {/* ESSENTIALS 항목 13개 */}
      <section>
        <div className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#D4AF37]">
          {essentialsHeader.eyebrow}
        </div>
        <h2 className="mt-3 text-2xl font-black leading-snug tracking-[-0.02em] sm:text-3xl">
          {essentialsHeader.title[locale]}
        </h2>
        <p className="mt-2 max-w-3xl text-base leading-relaxed text-[#232322]/85">
          {essentialsHeader.lead[locale]}
        </p>
        <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {essentialsItems.map((it) => {
            const Icon = ICON_MAP[it.icon];
            return (
              <li key={it.id} className="border border-[#232322]/15 p-5">
                <div className="flex items-center gap-2 text-sm font-black text-[#232322]">
                  <Icon className="h-4 w-4 shrink-0 text-[#D4AF37]" aria-hidden="true" />
                  <span>{it.title[locale]}</span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-[#232322]/85">
                  {it.body[locale]}
                </p>
                {it.sub && (
                  <p className="mt-2 text-xs leading-relaxed text-[#232322]/60">
                    {it.sub[locale]}
                  </p>
                )}
                {it.slug && (
                  <Link
                    href={`/dmc/${it.slug}`}
                    className="mt-3 inline-block text-xs font-bold text-[#D4AF37] hover:underline"
                  >
                    → {it.title[locale]}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      {/* PLAN YOUR TRIP */}
      <section>
        <div className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#D4AF37]">
          {planHeader.eyebrow}
        </div>
        <h2 className="mt-3 text-2xl font-black leading-snug tracking-[-0.02em] sm:text-3xl">
          {planHeader.title[locale]}
        </h2>

        {/* 처음이라면 */}
        <div className="mt-8 border-t border-[#232322]/10 pt-8">
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.24em] text-[#D4AF37]">
            <Compass className="h-4 w-4" aria-hidden="true" />
            <span>{planFirstTime.title[locale]}</span>
          </div>
          <p className="mt-2 text-base leading-relaxed text-[#232322]/85">
            {planFirstTime.lead[locale]}
          </p>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {planFirstTime.courses.map((c, i) => (
              <article key={i} className="border border-[#232322]/15 p-5">
                <div className="text-sm font-black text-[#232322]">
                  {c.name[locale]}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-[#232322]/85">
                  {c.stops[locale]}
                </p>
                {c.note && (
                  <p className="mt-2 text-xs text-[#232322]/60">
                    {c.note[locale]}
                  </p>
                )}
              </article>
            ))}
          </div>
        </div>

        {/* 접근성 — spots.ts info.access 3분류 집계 */}
        <AccessibilityBlock locale={locale} />

        {/* FAQ */}
        <div className="mt-10 border-t border-[#232322]/10 pt-8">
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.24em] text-[#D4AF37]">
            <HelpCircle className="h-4 w-4" aria-hidden="true" />
            <span>
              {locale === "ko" ? "자주 묻는 질문"
                : locale === "en" ? "Frequently Asked Questions"
                : locale === "ja" ? "よくある質問"
                : locale === "zh-CN" ? "常见问题"
                : "常見問題"}
            </span>
          </div>
          <ul className="mt-6 space-y-6">
            {planFaq.map((f, i) => (
              <li key={i} className="border-l-2 border-[#D4AF37] pl-4">
                <p className="text-sm font-black text-[#232322]">
                  Q. {f.q[locale]}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-[#232322]/85">
                  {f.a[locale]}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

function AccessibilityBlock({ locale }: { locale: MoveLocale }) {
  // 오더 #E2 [4]: spot.info.access 값 3분류로 집계. 새 데이터 만들지 않음.
  const buckets: Record<"wheelchair" | "partial" | "inquiry", Spot[]> = {
    wheelchair: [], partial: [], inquiry: [],
  };
  for (const s of spots) {
    const k = s.info?.access;
    if (k === "wheelchair" || k === "partial" || k === "inquiry") {
      buckets[k].push(s);
    }
  }
  const order: Array<"wheelchair" | "partial" | "inquiry"> = ["wheelchair", "partial", "inquiry"];
  return (
    <div className="mt-10 border-t border-[#232322]/10 pt-8">
      <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.24em] text-[#D4AF37]">
        <Accessibility className="h-4 w-4" aria-hidden="true" />
        <span>{planAccessibility.title[locale]}</span>
      </div>
      <p className="mt-2 text-base leading-relaxed text-[#232322]/85">
        {planAccessibility.lead[locale]}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-[#232322]/70">
        {planAccessibility.transportNote[locale]}
      </p>
      <div className="mt-6 space-y-6">
        {order.map((k) => {
          const list = buckets[k];
          if (list.length === 0) return null;
          return (
            <div key={k}>
              <div className="text-sm font-black text-[#232322]">
                {planAccessibility.labels[k][locale]} ({list.length})
              </div>
              <ul className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
                {list.map((s) => (
                  <li key={s.slug} className="text-sm">
                    <Link
                      href={`/dmc/${s.slug}`}
                      className="text-[#232322]/85 hover:text-[#D4AF37] hover:underline"
                    >
                      {s.title[locale]}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
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
