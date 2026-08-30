// components/home/WhatsOnSection.tsx
// 홈 · WHAT'S ON IN GOYANG (오더 #P9). WeeklyExhibitionsSection 를 대체.
//
// 구조:
//   섹션 헤더 (WHAT'S ON IN GOYANG · 이번 달 고양일산)
//   3개 행: 공연 (performance) · 축제 (festival) · 전시 (exhibition)
//     각 행: 행 헤더 (라벨 + "전체 보기 →") + 대형1 + 소형2
//     노출분 0 → 그 행 전체 숨김. 3개 행 전부 0 → 섹션 자체 return null.
//
// 데이터: data/ticket-booking.ts 재사용 (읽기만). 매핑:
//   · performance ← concert + k-pop + family
//   · festival    ← festival
//   · exhibition  ← exhibition
//   endDate 오늘 이전이면 자동 비노출.
//
// 카드 4요소만: 사진 / 제목 / 한 줄(장소·소요시간) / 날짜.
//   태그 칩 없음. 카테고리색 테두리 없음. 그림자 없음.
//   색 3종 통일: 차콜 #232322 + 골드 #D4AF37 + 사진.
//
// 라우트: 카드 링크 = /whats-on/{type}/{slug}. type 은 URL 상 영문
// (performance/festival/exhibition), slug 은 ticket.id.
//
// 사진: imageUrl 있으면 <Image>, 없으면 차콜 배경 + 골드 posterLabel 폴백.
// credit 값이 있고 비어있지 않으면 사진 하단에 소형 표기.

import Image from "next/image";

import {
  ticketProducts,
  type TicketProduct,
  type TicketLocale,
} from "@/data/ticket-booking";
import { Link } from "@/lib/navigation";

type LocaleKey = "ko" | "en" | "ja" | "zh-CN" | "zh-TW";
const LOCALES: LocaleKey[] = ["ko", "en", "ja", "zh-CN", "zh-TW"];

type RowKey = "performance" | "festival" | "exhibition";
const ROW_KEYS: RowKey[] = ["performance", "festival", "exhibition"];

/** 섹션 상단 두 줄 헤드라인 (5로케일). */
const SECTION_EYEBROW = "WHAT'S ON IN GOYANG"; // 5로케일 공통 영문
const SECTION_HEADLINE: Record<LocaleKey, string> = {
  ko: "이번 달 고양일산",
  en: "This Month in Goyang-Ilsan",
  ja: "今月の高陽・一山",
  "zh-CN": "本月的高阳·一山",
  "zh-TW": "本月的高陽·一山",
};

/** 행 라벨 (한글 + 영문 병기 두 줄). */
const ROW_LABEL: Record<RowKey, Record<LocaleKey, string>> = {
  performance: {
    ko: "공연",
    en: "Performance",
    ja: "公演",
    "zh-CN": "演出",
    "zh-TW": "演出",
  },
  festival: {
    ko: "축제",
    en: "Festival",
    ja: "フェスティバル",
    "zh-CN": "节庆",
    "zh-TW": "節慶",
  },
  exhibition: {
    ko: "전시",
    en: "Exhibition",
    ja: "展示",
    "zh-CN": "展览",
    "zh-TW": "展覽",
  },
};

const ROW_LABEL_EN: Record<RowKey, string> = {
  performance: "PERFORMANCE",
  festival: "FESTIVAL",
  exhibition: "EXHIBITION",
};

const VIEW_ALL: Record<LocaleKey, string> = {
  ko: "전체 보기 →",
  en: "View all →",
  ja: "すべて見る →",
  "zh-CN": "查看全部 →",
  "zh-TW": "查看全部 →",
};

/** 행별 소스 카테고리 매핑. */
const ROW_SOURCE_CATEGORIES: Record<RowKey, ReadonlyArray<TicketProduct["category"]>> = {
  performance: ["concert", "k-pop", "family"],
  festival: ["festival"],
  exhibition: ["exhibition"],
};

/** 전체 보기 링크 — /products 티켓 섹션으로 anchor. */
const VIEW_ALL_HREF = "/products#section-ticket";

/** endDate 파싱: 오늘 이전이면 지난 이벤트. 값 없으면 상시 노출. */
function isCurrentOrUpcoming(item: TicketProduct): boolean {
  if (!item.endDate) return true;
  const end = Date.parse(item.endDate);
  if (Number.isNaN(end)) return true;
  const now = new Date();
  const todayZero = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  return end >= todayZero;
}

function pickLocalizedVenue(item: TicketProduct, locale: LocaleKey): string {
  if (locale === "ko") return item.venue;
  return item.translations?.[locale as TicketLocale]?.venue ?? item.venue;
}

function detailHref(rowKey: RowKey, slug: string): string {
  return `/whats-on/${rowKey}/${slug}`;
}

type ResolvedRow = {
  key: RowKey;
  items: TicketProduct[]; // 최신순 아님 (등록 순). 첫 항목이 대형.
};

function resolveRows(): ResolvedRow[] {
  return ROW_KEYS.map((key) => {
    const items = ticketProducts
      .filter((t) => ROW_SOURCE_CATEGORIES[key].includes(t.category))
      .filter(isCurrentOrUpcoming);
    return { key, items };
  }).filter((row) => row.items.length > 0);
}

export default function WhatsOnSection({ locale }: { locale: string }) {
  const active: LocaleKey = (
    LOCALES.includes(locale as LocaleKey) ? locale : "ko"
  ) as LocaleKey;
  const rows = resolveRows();
  if (rows.length === 0) return null;

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-28">
        {/* 섹션 헤더 — 3단 위계: eyebrow · headline (배지 없음) */}
        <div className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#D4AF37]">
          {SECTION_EYEBROW}
        </div>
        <h2 className="mt-3 text-2xl font-black leading-tight tracking-[-0.03em] text-[#232322] sm:text-3xl">
          {SECTION_HEADLINE[active]}
        </h2>

        {/* 3개 행 (0건 자동 숨김) */}
        <div className="mt-16 space-y-24">
          {rows.map((row) => (
            <WhatsOnRow key={row.key} row={row} locale={active} />
          ))}
        </div>
      </div>
    </section>
  );
}

function WhatsOnRow({ row, locale }: { row: ResolvedRow; locale: LocaleKey }) {
  const [large, ...smalls] = row.items;
  const smallList = smalls.slice(0, 2); // 소형 최대 2

  return (
    <div>
      {/* 행 헤더: 라벨 좌 · 전체보기 우 */}
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

      {/* 대형1 + 소형2 · 모바일 1열 · 데스크탑 12분할 (대형 7 + 소형 스택 5) */}
      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <WhatsOnCard item={large} rowKey={row.key} locale={locale} size="lg" />
        </div>
        {smallList.length > 0 && (
          <div className="grid grid-cols-1 gap-6 lg:col-span-5 sm:grid-cols-2 lg:grid-cols-1">
            {smallList.map((item) => (
              <WhatsOnCard
                key={item.id}
                item={item}
                rowKey={row.key}
                locale={locale}
                size="sm"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function WhatsOnCard({
  item,
  rowKey,
  locale,
  size,
}: {
  item: TicketProduct;
  rowKey: RowKey;
  locale: LocaleKey;
  size: "lg" | "sm";
}) {
  const venue = pickLocalizedVenue(item, locale);
  const metaParts = [venue, item.duration].filter(
    (part): part is string => Boolean(part && part.trim())
  );
  const metaLine = metaParts.join(" · ");
  const credit = item.credit?.trim();
  const aspect = size === "lg" ? "aspect-[16/10]" : "aspect-[4/3]";
  const titleSize =
    size === "lg"
      ? "text-2xl sm:text-3xl"
      : "text-lg sm:text-xl";

  return (
    <Link href={detailHref(rowKey, item.id)} className="group block">
      {/* 사진 */}
      <div className={`relative w-full overflow-hidden bg-[#232322] ${aspect}`}>
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.title}
            fill
            sizes={
              size === "lg"
                ? "(max-width: 1024px) 100vw, 60vw"
                : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 30vw"
            }
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span
              className={`font-black uppercase tracking-[0.24em] text-[#D4AF37] ${
                size === "lg" ? "text-3xl" : "text-xl"
              }`}
            >
              {item.posterLabel}
            </span>
          </div>
        )}
      </div>

      {/* credit — 값 있을 때만 (오더 #P9 [4]) */}
      {credit && (
        <p className="mt-1.5 text-[10px] uppercase tracking-[0.18em] text-[#232322]/50">
          © {credit}
        </p>
      )}

      {/* 텍스트 블록 · 4요소 · 태그/배지 없음 */}
      <div className="mt-4">
        <h3
          className={`font-black leading-tight tracking-[-0.02em] text-[#232322] transition-colors group-hover:text-[#D4AF37] ${titleSize}`}
        >
          {item.title}
        </h3>
        {metaLine && (
          <p className="mt-2 text-sm text-[#232322]/70">{metaLine}</p>
        )}
        <p className="mt-1 text-sm font-semibold text-[#232322]">
          {item.dateText}
        </p>
      </div>
    </Link>
  );
}
