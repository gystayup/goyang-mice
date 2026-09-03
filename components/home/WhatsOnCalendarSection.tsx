// components/home/WhatsOnCalendarSection.tsx — 오더 #C14b 날짜 바 연동 WHAT'S ON.
//
// Visit Seoul 방식: 오늘부터 +30일 horizontal 날짜 바 · 선택 날짜의 이벤트만 노출.
// 포스터 이미지 금지(§5-3) · resolveEventImage() 그대로 사용 (장소 사진 폴백 + "사진: {장소}" 캡션).
//
// 규범:
//   · 판매 소구어 0. 이벤트가 ticketUrl 갖고 있으면 카드에서 소비 (기존 관행 유지).
//   · 5로케일 ko 폴백. 날짜 표기 로케일별.
//   · 접근성: 날짜 셀 aria-selected · 키보드 좌우 화살표 · aria-live 로 이벤트 개수 알림.

"use client";

import Image from "next/image";
import { useMemo, useState, useCallback, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { WHATSON_CAL, pickHomeLocale, type HomeLocale } from "@/data/home-copy";
import {
  getEventsOnDate,
  resolveEventImage,
  type WhatsOnEvent,
} from "@/data/whats-on-events";
import { Link } from "@/lib/navigation";

const DAYS_AHEAD = 30;

function toIso(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}

function buildDateRange(startIso: string): string[] {
  const [sy, sm, sd] = startIso.split("-").map(Number);
  const arr: string[] = [];
  for (let i = 0; i < DAYS_AHEAD; i++) {
    const d = new Date(sy, sm - 1, sd + i);
    arr.push(toIso(d));
  }
  return arr;
}

function shortDate(iso: string, locale: HomeLocale): string {
  const [y, m, d] = iso.split("-");
  if (locale === "ko" || locale === "ja") return `${m}.${d}`;
  if (locale === "zh-CN" || locale === "zh-TW") return `${m}.${d}`;
  return `${m}/${d}`;
  void y;
}

function weekdayShort(iso: string, locale: HomeLocale): string {
  const [y, m, d] = iso.split("-").map(Number);
  const dow = new Date(y, m - 1, d).getDay();
  return WHATSON_CAL.weekdayShort[locale][dow] ?? "";
}

function formatDateRange(start: string, end: string): string {
  if (!end) return start;
  if (!start || start === end) return isoToShort(end);
  const s = start.split("-");
  const e = end.split("-");
  if (s[0] === e[0] && s[1] === e[1]) {
    return `${s[0]}.${s[1]}.${s[2]} – ${e[2]}`;
  }
  return `${isoToShort(start)} – ${isoToShort(end)}`;
}
function isoToShort(iso: string): string {
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return iso;
  return `${y}.${m}.${d}`;
}

export default function WhatsOnCalendarSection({ locale }: { locale: string }) {
  const active = pickHomeLocale(locale);

  // 기준일: 클라이언트 마운트 시점의 로컬 오늘. SSR 안전을 위해 null 로 시작
  // 후 마운트 useEffect 에서 setState.  본 컴포넌트는 클라이언트 상태
  // (선택 날짜)를 UI 로 노출하는 것이 목적이라 서버 렌더에서 헤더만 노출하고
  // 날짜 바는 하이드레이션 후 나타난다 (fallback 분기 아래 참조).
  const [today, setToday] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setToday((prev) => prev ?? toIso(new Date()));
  }, []);
  useEffect(() => {
    if (today && !selected) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelected(today);
    }
  }, [today, selected]);

  const dates = useMemo(() => (today ? buildDateRange(today) : []), [today]);

  // 각 날짜별 이벤트 개수 (배지용) · 30번 O(N) 필터 · 이벤트 4건이라 무시 가능.
  const countsByDate = useMemo(() => {
    const m = new Map<string, number>();
    for (const iso of dates) m.set(iso, getEventsOnDate(iso).length);
    return m;
  }, [dates]);

  const selectedEvents = useMemo(
    () => (selected ? getEventsOnDate(selected) : []),
    [selected]
  );

  // 스크롤 컨테이너 (weekly navigation).
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const scrollByWeek = useCallback((dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * 320, behavior: "smooth" });
  }, []);

  // 서버 렌더시에는 날짜 바 자체를 미노출 (하이드레이션 mismatch 방지).
  if (!today) {
    return (
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
          <div className="text-[11px] font-bold uppercase tracking-[0.28em] text-[var(--accent)]">
            {WHATSON_CAL.eyebrow}
          </div>
          <h2 className="mt-3 text-2xl font-black tracking-[-0.03em] text-[#232322] sm:text-3xl lg:text-4xl">
            {WHATSON_CAL.headline[active]}
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
            {WHATSON_CAL.subhead[active]}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
        <div className="text-[11px] font-bold uppercase tracking-[0.28em] text-[var(--accent)]">
          {WHATSON_CAL.eyebrow}
        </div>
        <h2 className="mt-3 text-2xl font-black tracking-[-0.03em] text-[#232322] sm:text-3xl lg:text-4xl">
          {WHATSON_CAL.headline[active]}
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
          {WHATSON_CAL.subhead[active]}
        </p>

        {/* 날짜 바 */}
        <div className="mt-8 flex items-center gap-2 sm:mt-10">
          <button
            type="button"
            onClick={() => scrollByWeek(-1)}
            aria-label={WHATSON_CAL.prevLabel[active]}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:border-slate-950 hover:text-slate-950"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div
            ref={scrollerRef}
            role="tablist"
            aria-label={WHATSON_CAL.headline[active]}
            className="flex flex-1 gap-2 overflow-x-auto scroll-smooth pb-1"
            style={{ scrollbarWidth: "thin" }}
          >
            {dates.map((iso) => {
              const isSel = iso === selected;
              const isToday = iso === today;
              const cnt = countsByDate.get(iso) ?? 0;
              return (
                <button
                  key={iso}
                  type="button"
                  role="tab"
                  aria-selected={isSel}
                  aria-current={isToday ? "date" : undefined}
                  onClick={() => setSelected(iso)}
                  className={`relative flex min-w-[62px] shrink-0 flex-col items-center rounded-2xl border px-3 py-2 text-center transition ${
                    isSel
                      ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[#232322]"
                      : "border-slate-200 bg-white text-slate-700 hover:border-slate-400"
                  }`}
                >
                  <span
                    className={`text-[10px] font-bold uppercase tracking-[0.16em] ${
                      isSel ? "text-[var(--accent)]" : "text-slate-500"
                    }`}
                  >
                    {isToday ? WHATSON_CAL.todayLabel[active] : weekdayShort(iso, active)}
                  </span>
                  <span className="mt-0.5 text-sm font-black tracking-[-0.02em] sm:text-base">
                    {shortDate(iso, active)}
                  </span>
                  {cnt > 0 && (
                    <span
                      aria-label={`${cnt} events`}
                      className={`mt-1 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full px-1 text-[10px] font-bold ${
                        isSel
                          ? "bg-[var(--accent)] text-white"
                          : "bg-slate-950 text-white"
                      }`}
                    >
                      {cnt}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          <button
            type="button"
            onClick={() => scrollByWeek(1)}
            aria-label={WHATSON_CAL.nextLabel[active]}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:border-slate-950 hover:text-slate-950"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* 선택 날짜 이벤트 카드 */}
        <div className="mt-10 min-h-[120px]" aria-live="polite">
          {selectedEvents.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center text-sm text-slate-500">
              {WHATSON_CAL.emptyDate[active]}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {selectedEvents.map((ev) => (
                <WhatsOnCard key={ev.id} event={ev} locale={active} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function WhatsOnCard({
  event,
  locale,
}: {
  event: WhatsOnEvent;
  locale: HomeLocale;
}) {
  const image = resolveEventImage(event);
  const caption = image.captionText(locale);
  const href = `/whats-on/${event.type}/${event.slug}`;

  return (
    <Link href={href} className="group block">
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#232322]">
        <Image
          src={image.src}
          alt={event.title[locale]}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          style={
            image.isFallback && image.cardObjectPosition
              ? { objectPosition: image.cardObjectPosition }
              : undefined
          }
          className={`transition-transform duration-500 group-hover:scale-[1.02] ${
            image.isFallback ? "object-cover" : "object-contain"
          }`}
        />
      </div>
      {caption && (
        <p className="mt-1.5 text-[10px] uppercase tracking-[0.18em] text-[#232322]/50">
          {caption}
        </p>
      )}
      <div className="mt-4">
        <h3 className="text-lg font-black leading-tight tracking-[-0.02em] text-[#232322] transition-colors group-hover:text-[var(--accent)] sm:text-xl">
          {event.title[locale]}
        </h3>
        <p className="mt-2 text-sm text-[#232322]/70">{event.venue[locale]}</p>
        <p className="mt-1 text-sm font-semibold text-[#232322]">
          {formatDateRange(event.startDate, event.endDate)}
        </p>
      </div>
    </Link>
  );
}
