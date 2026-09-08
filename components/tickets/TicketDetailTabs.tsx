// components/tickets/TicketDetailTabs.tsx — 오더 #D18 [1] 티켓 상세 4탭 (공연정보/일정/갤러리/오시는 길).
//
// 방침:
//   · 창작 금지. 기존 TicketProduct 필드(원문) 를 매핑해서 4탭으로 재구성.
//   · 5로케일 라벨. 본문은 ko 원문 (translations 미보유 필드 그대로).

"use client";

import { useState } from "react";
import Image from "next/image";
import { CalendarDays, Camera, Info, MapPin } from "lucide-react";

import PriceKRW from "@/components/currency/PriceKRW";
import type { TicketOption, TicketProduct } from "@/data/ticket-booking";

export type TabsLocale = "ko" | "en" | "ja" | "zh-CN" | "zh-TW";

type Props = {
  ticket: TicketProduct;
  locale: TabsLocale;
  options: Array<{ opt: TicketOption; label: string; benefits: string[] }>;
};

const TAB_LABEL: Record<
  TabsLocale,
  { info: string; schedule: string; gallery: string; venue: string; noContent: string; benefits: string }
> = {
  ko: { info: "공연정보", schedule: "일정 · 좌석", gallery: "갤러리", venue: "오시는 길", noContent: "관련 내용이 아직 등록되지 않았습니다.", benefits: "포함 사항" },
  en: { info: "About", schedule: "Schedule & Seats", gallery: "Gallery", venue: "Getting there", noContent: "No content yet.", benefits: "Included" },
  ja: { info: "公演情報", schedule: "日程・座席", gallery: "ギャラリー", venue: "アクセス", noContent: "まだ登録された内容はありません。", benefits: "含まれる特典" },
  "zh-CN": { info: "演出信息", schedule: "日程 · 座位", gallery: "图库", venue: "交通信息", noContent: "尚未登记相关内容。", benefits: "包含内容" },
  "zh-TW": { info: "演出資訊", schedule: "日程 · 座位", gallery: "圖庫", venue: "交通資訊", noContent: "尚未登記相關內容。", benefits: "包含內容" },
};

const TAB_KEYS = ["info", "schedule", "gallery", "venue"] as const;
type TabKey = (typeof TAB_KEYS)[number];

export default function TicketDetailTabs({ ticket, locale, options }: Props) {
  const [active, setActive] = useState<TabKey>("info");
  const t = ticket;
  const labels = TAB_LABEL[locale];

  const iconFor: Record<TabKey, typeof Info> = {
    info: Info,
    schedule: CalendarDays,
    gallery: Camera,
    venue: MapPin,
  };
  const labelFor: Record<TabKey, string> = {
    info: labels.info,
    schedule: labels.schedule,
    gallery: labels.gallery,
    venue: labels.venue,
  };

  return (
    <div className="mt-8">
      {/* 탭 헤더 (pill row) */}
      <div className="flex flex-wrap gap-1.5 border-b border-slate-200 pb-0">
        {TAB_KEYS.map((k) => {
          const Icon = iconFor[k];
          const isActive = active === k;
          return (
            <button
              key={k}
              type="button"
              onClick={() => setActive(k)}
              className={[
                "-mb-px inline-flex items-center gap-1.5 border-b-2 px-4 py-2.5 text-sm font-bold transition",
                isActive
                  ? "border-[var(--accent)] text-[var(--accent)]"
                  : "border-transparent text-slate-500 hover:text-[#232322]",
              ].join(" ")}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              <span>{labelFor[k]}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-6">
        {active === "info" && <PanelInfo t={t} locale={locale} labels={labels} />}
        {active === "schedule" && (
          <PanelSchedule t={t} locale={locale} labels={labels} options={options} />
        )}
        {active === "gallery" && <PanelGallery t={t} labels={labels} />}
        {active === "venue" && <PanelVenue t={t} labels={labels} />}
      </div>
    </div>
  );
}

function Prose({ text }: { text?: string }) {
  if (!text || text.trim().length === 0) return null;
  return (
    <p className="whitespace-pre-line text-sm leading-[1.75] text-slate-700 sm:text-[15px]">
      {text}
    </p>
  );
}

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <h3 className="text-xs font-black uppercase tracking-[0.16em] text-slate-700">{title}</h3>
      <div className="mt-3 space-y-2">{children}</div>
    </div>
  );
}

function PanelInfo({
  t,
  locale,
  labels,
}: {
  t: TicketProduct;
  locale: TabsLocale;
  labels: (typeof TAB_LABEL)[TabsLocale];
}) {
  const hasAny = Boolean(
    t.summary || t.description || t.tabDetails || t.tabCasting || t.tabNotice
  );
  if (!hasAny) return <div className="text-sm text-slate-500">{labels.noContent}</div>;
  return (
    <div className="space-y-4">
      {t.summary || t.description ? (
        <div className="space-y-3">
          {t.summary ? <Prose text={t.summary} /> : null}
          {t.description ? <Prose text={t.description} /> : null}
        </div>
      ) : null}
      {t.tabDetails ? (
        <SectionCard title={locale === "ko" ? "상세 안내" : "Details"}>
          <Prose text={t.tabDetails} />
        </SectionCard>
      ) : null}
      {t.tabCasting ? (
        <SectionCard title={locale === "ko" ? "캐스팅 / 구성" : "Cast / Program"}>
          <Prose text={t.tabCasting} />
        </SectionCard>
      ) : null}
      {t.tabNotice ? (
        <SectionCard title={locale === "ko" ? "관람 안내" : "Notice"}>
          <Prose text={t.tabNotice} />
        </SectionCard>
      ) : null}
    </div>
  );
}

function PanelSchedule({
  t,
  locale,
  labels,
  options,
}: {
  t: TicketProduct;
  locale: TabsLocale;
  labels: (typeof TAB_LABEL)[TabsLocale];
  options: Array<{ opt: TicketOption; label: string; benefits: string[] }>;
}) {
  const hasAny = Boolean(
    t.dateText || t.duration || t.ageLimit || options.length > 0 || t.tabPrice || t.tabDiscount || t.tabUsageInfo
  );
  if (!hasAny) return <div className="text-sm text-slate-500">{labels.noContent}</div>;
  return (
    <div className="space-y-4">
      {/* 요약 정보 3칸 */}
      <div className="grid gap-3 sm:grid-cols-3">
        {t.dateText ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
              {locale === "ko" ? "일정" : "Dates"}
            </div>
            <div className="mt-1.5 text-sm font-bold text-[#232322]">{t.dateText}</div>
          </div>
        ) : null}
        {t.duration ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
              {locale === "ko" ? "관람 시간" : "Running time"}
            </div>
            <div className="mt-1.5 text-sm font-bold text-[#232322]">{t.duration}</div>
          </div>
        ) : null}
        {t.ageLimit ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
              {locale === "ko" ? "관람 연령" : "Age"}
            </div>
            <div className="mt-1.5 text-sm font-bold text-[#232322]">{t.ageLimit}</div>
          </div>
        ) : null}
      </div>

      {/* 좌석·옵션 */}
      {options.length > 0 ? (
        <div>
          <h3 className="text-xs font-black uppercase tracking-[0.16em] text-slate-700">
            {locale === "ko" ? "좌석 · 옵션" : "Seats & Options"}
          </h3>
          <ul className="mt-3 grid gap-3 sm:grid-cols-2">
            {options.map(({ opt, label, benefits }) => (
              <li
                key={opt.id}
                className="rounded-2xl border border-slate-200 bg-white p-4"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <div className="text-base font-black text-slate-950">{label}</div>
                  <PriceKRW krw={opt.price} className="text-base font-bold text-slate-950" />
                </div>
                {benefits.length > 0 ? (
                  <div className="mt-2">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                      {labels.benefits}
                    </div>
                    <ul className="mt-1 space-y-0.5 text-xs text-slate-700">
                      {benefits.map((b) => (
                        <li key={b}>· {b}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {t.tabPrice ? (
        <SectionCard title={locale === "ko" ? "가격 안내" : "Pricing"}>
          <Prose text={t.tabPrice} />
        </SectionCard>
      ) : null}
      {t.tabDiscount ? (
        <SectionCard title={locale === "ko" ? "할인 안내" : "Discounts"}>
          <Prose text={t.tabDiscount} />
        </SectionCard>
      ) : null}
      {t.tabUsageInfo ? (
        <SectionCard title={locale === "ko" ? "이용 안내" : "Usage"}>
          <Prose text={t.tabUsageInfo} />
        </SectionCard>
      ) : null}
      {t.tabCancellation ? (
        <SectionCard title={locale === "ko" ? "취소 · 환불" : "Cancellation & Refund"}>
          <Prose text={t.tabCancellation} />
        </SectionCard>
      ) : null}
    </div>
  );
}

function PanelGallery({
  t,
  labels,
}: {
  t: TicketProduct;
  labels: (typeof TAB_LABEL)[TabsLocale];
}) {
  const imgs = (t.images ?? []).filter(Boolean);
  if (imgs.length === 0) {
    return <div className="text-sm text-slate-500">{labels.noContent}</div>;
  }
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {imgs.map((src, i) => (
        <div
          key={`${src}-${i}`}
          className="relative aspect-square w-full overflow-hidden rounded-xl bg-slate-100"
        >
          <Image
            src={src}
            alt=""
            fill
            sizes="(max-width: 640px) 50vw, 240px"
            className="object-cover"
          />
        </div>
      ))}
    </div>
  );
}

function PanelVenue({
  t,
  labels,
}: {
  t: TicketProduct;
  labels: (typeof TAB_LABEL)[TabsLocale];
}) {
  if (!t.tabVenue || t.tabVenue.trim().length === 0) {
    return <div className="text-sm text-slate-500">{labels.noContent}</div>;
  }
  return (
    <SectionCard title={t.venue}>
      <Prose text={t.tabVenue} />
    </SectionCard>
  );
}
