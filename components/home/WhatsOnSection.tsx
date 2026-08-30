// components/home/WhatsOnSection.tsx
// 홈 · WHAT'S ON IN GOYANG (오더 #P9 · 데이터 오더 #P9-b · #P9-c · #P9-d).
//
// 구조:
//   섹션 헤더 (WHAT'S ON IN GOYANG · 이번 달 고양일산)
//   3개 행: 공연 (performance) · 축제 (festival) · 전시 (exhibition)
//     각 행: 행 헤더 (라벨 + "전체 보기 →") + 균등 2열 카드 (오더 #P9-d [4])
//     노출분 0 → 그 행 전체 숨김. 3개 행 전부 0 → 섹션 자체 return null.
//
// 데이터: data/whats-on-events.ts.
//   getVisibleWhatsOnEvents() — verified 항목만 노출 (오더 #P9-d [2]).
//   endDate 오늘 이전이면 자동 비노출.
//
// 카드 4요소만: 사진 / 제목 / 한 줄(장소) / 날짜.
//   태그 칩 없음. 카테고리색 테두리 없음. 그림자 없음.
//   색 3종 통일: 차콜 #232322 + 골드 #D4AF37 + 사진.
//   사진 비율 · 타이포 위계 · 카드 사이즈 전 카드 동일 (오더 #P9-d [4]).
//
// 레이아웃 (오더 #P9-d [4]):
//   데스크톱 lg:grid-cols-2 · 모바일 grid-cols-1.
//   행에 1건만 있으면 카드 1장이 열 절반 폭 · 나머지 절반 비움
//   (grid 컨테이너의 기본 동작 — 카드를 폭 전체로 늘리지 않음).

import Image from "next/image";

import {
  getVisibleWhatsOnEvents,
  isCurrentOrUpcoming,
  resolveEventImage,
  type WhatsOnEvent,
  type WhatsOnEventType,
  type WhatsOnLocale,
} from "@/data/whats-on-events";
import { Link } from "@/lib/navigation";

const LOCALES: WhatsOnLocale[] = ["ko", "en", "ja", "zh-CN", "zh-TW"];
const ROW_KEYS: WhatsOnEventType[] = ["performance", "festival", "exhibition"];

const SECTION_EYEBROW = "WHAT'S ON IN GOYANG"; // 5로케일 공통 영문
const SECTION_HEADLINE: Record<WhatsOnLocale, string> = {
  ko: "이번 달 고양일산",
  en: "This Month in Goyang-Ilsan",
  ja: "今月の高陽・一山",
  "zh-CN": "本月的高阳·一山",
  "zh-TW": "本月的高陽·一山",
};

const ROW_LABEL: Record<WhatsOnEventType, Record<WhatsOnLocale, string>> = {
  performance: { ko: "공연", en: "Performance", ja: "公演", "zh-CN": "演出", "zh-TW": "演出" },
  festival: { ko: "축제", en: "Festival", ja: "フェスティバル", "zh-CN": "节庆", "zh-TW": "節慶" },
  exhibition: { ko: "전시", en: "Exhibition", ja: "展示", "zh-CN": "展览", "zh-TW": "展覽" },
};

const ROW_LABEL_EN: Record<WhatsOnEventType, string> = {
  performance: "PERFORMANCE",
  festival: "FESTIVAL",
  exhibition: "EXHIBITION",
};

const VIEW_ALL: Record<WhatsOnLocale, string> = {
  ko: "전체 보기 →",
  en: "View all →",
  ja: "すべて見る →",
  "zh-CN": "查看全部 →",
  "zh-TW": "查看全部 →",
};

const VIEW_ALL_HREF = "/products#section-ticket";

function detailHref(type: WhatsOnEventType, slug: string): string {
  return `/whats-on/${type}/${slug}`;
}

type ResolvedRow = {
  key: WhatsOnEventType;
  items: WhatsOnEvent[];
};

function resolveRows(): ResolvedRow[] {
  const all = getVisibleWhatsOnEvents().filter(isCurrentOrUpcoming);
  return ROW_KEYS.map((key) => ({
    key,
    items: all.filter((e) => e.type === key),
  })).filter((row) => row.items.length > 0);
}

export default function WhatsOnSection({ locale }: { locale: string }) {
  const active: WhatsOnLocale = (
    LOCALES.includes(locale as WhatsOnLocale) ? locale : "ko"
  ) as WhatsOnLocale;
  const rows = resolveRows();
  if (rows.length === 0) return null;

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-28">
        <div className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#D4AF37]">
          {SECTION_EYEBROW}
        </div>
        <h2 className="mt-3 text-2xl font-black leading-tight tracking-[-0.03em] text-[#232322] sm:text-3xl">
          {SECTION_HEADLINE[active]}
        </h2>

        <div className="mt-16 space-y-24">
          {rows.map((row) => (
            <WhatsOnRow key={row.key} row={row} locale={active} />
          ))}
        </div>
      </div>
    </section>
  );
}

function WhatsOnRow({ row, locale }: { row: ResolvedRow; locale: WhatsOnLocale }) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4 border-b border-[#232322]/15 pb-4">
        <div className="flex items-baseline gap-3">
          <span className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#D4AF37]">
            {ROW_LABEL_EN[row.key]}
          </span>
          <span className="text-lg font-black tracking-[-0.02em] text-[#232322] sm:text-xl">
            {ROW_LABEL[row.key][locale]}
          </span>
        </div>
        <Link
          href={VIEW_ALL_HREF}
          className="text-xs font-bold text-[#232322] transition-colors hover:text-[#D4AF37]"
        >
          {VIEW_ALL[locale]}
        </Link>
      </div>

      {/* 균등 2열 (오더 #P9-d [4]) — 사진 비율·타이포 위계 전 카드 동일.
          행에 1건만 있으면 카드 1장이 열 절반 폭을 차지하고 나머지 절반은 비움. */}
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        {row.items.map((item) => (
          <WhatsOnCard key={item.id} event={item} locale={locale} />
        ))}
      </div>
    </div>
  );
}

function WhatsOnCard({
  event,
  locale,
}: {
  event: WhatsOnEvent;
  locale: WhatsOnLocale;
}) {
  const image = resolveEventImage(event);
  const caption = image.captionText(locale);

  return (
    <Link href={detailHref(event.type, event.slug)} className="group block">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#232322]">
        <Image
          src={image.src}
          alt={event.title[locale]}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        />
      </div>

      {caption && (
        <p className="mt-1.5 text-[10px] uppercase tracking-[0.18em] text-[#232322]/50">
          {caption}
        </p>
      )}

      <div className="mt-4">
        <h3 className="text-xl font-black leading-tight tracking-[-0.02em] text-[#232322] transition-colors group-hover:text-[#D4AF37] sm:text-2xl">
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

/** ISO YYYY-MM-DD start·end 를 카드용 짧은 표기로. 단일 → "2026.09.20", 범위 → "2026.09.18 – 09.20". */
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
