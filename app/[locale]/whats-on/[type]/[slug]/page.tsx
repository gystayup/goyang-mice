// /[locale]/whats-on/[type]/[slug] — 티켓 상세 라우트 (오더 #P9 [2]).
//
// 티켓은 우리의 유일한 실판매 동선. 결제는 이 경로에만 존재.
// 구성 순서 (오더):
//   1. 대형 사진
//   2. 분류 라벨
//   3. 영문 제목 + 한글 병기 (subtitle)
//   4. 일정 (dateText)
//   5. 장소 + ACCESS (KINTEX·일산역·서울역 3개 고정)
//   6. 소개 2~3문장 (description → 문장 슬라이스)
//   7. 한국어 원문 카드 (장소명·주소)
//   8. 지도 (Kakao 지도 링크)
//   9. 티켓 예매 CTA — 유일한 결제 진입점
//  10. "이 근처에서" /best 링크 3개 (food · culture · walk)
//
// 디자인: 차콜 #232322 + 골드 #D4AF37 + 사진. 그림자·형광 강조 금지.
// 배지 1개 (분류 라벨). 섹션 간 96px+. 모바일 1열.

import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import Shell from "@/components/layout/Shell";
import {
  ticketProducts,
  type TicketProduct,
  type TicketLocale,
} from "@/data/ticket-booking";
import { Link } from "@/lib/navigation";

type LocaleKey = "ko" | "en" | "ja" | "zh-CN" | "zh-TW";
const LOCALES: LocaleKey[] = ["ko", "en", "ja", "zh-CN", "zh-TW"];

type WhatsOnType = "performance" | "festival" | "exhibition";
const TYPE_KEYS: WhatsOnType[] = ["performance", "festival", "exhibition"];

const TYPE_SOURCE_CATEGORIES: Record<WhatsOnType, ReadonlyArray<TicketProduct["category"]>> = {
  performance: ["concert", "k-pop", "family"],
  festival: ["festival"],
  exhibition: ["exhibition"],
};

function toLocale(v: string): LocaleKey {
  return LOCALES.includes(v as LocaleKey) ? (v as LocaleKey) : "ko";
}
function isType(v: string): v is WhatsOnType {
  return (TYPE_KEYS as string[]).includes(v);
}

/** 5로케일 정적 문안 — 배지 1개 원칙, 3단 위계. */
const TYPE_LABEL: Record<WhatsOnType, Record<LocaleKey, string>> = {
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

const LABEL_DATE: Record<LocaleKey, string> = {
  ko: "일정",
  en: "Schedule",
  ja: "スケジュール",
  "zh-CN": "日程",
  "zh-TW": "日程",
};
const LABEL_VENUE: Record<LocaleKey, string> = {
  ko: "장소",
  en: "Venue",
  ja: "会場",
  "zh-CN": "地点",
  "zh-TW": "地點",
};
const LABEL_ACCESS: Record<LocaleKey, string> = {
  ko: "ACCESS",
  en: "ACCESS",
  ja: "ACCESS",
  "zh-CN": "ACCESS",
  "zh-TW": "ACCESS",
};
const LABEL_INTRO: Record<LocaleKey, string> = {
  ko: "소개",
  en: "About",
  ja: "紹介",
  "zh-CN": "简介",
  "zh-TW": "簡介",
};
const LABEL_KOREAN_ORIGINAL: Record<LocaleKey, string> = {
  ko: "장소명 (한국어)",
  en: "Venue (Korean · show this to locals)",
  ja: "会場名 (韓国語表記)",
  "zh-CN": "地点（韩语原文）",
  "zh-TW": "地點（韓語原文）",
};
const LABEL_MAP: Record<LocaleKey, string> = {
  ko: "지도에서 보기",
  en: "Open in map",
  ja: "地図で見る",
  "zh-CN": "在地图中查看",
  "zh-TW": "在地圖中查看",
};
const LABEL_BOOK_CTA: Record<LocaleKey, string> = {
  ko: "티켓 예매하기",
  en: "Book tickets",
  ja: "チケットを予約する",
  "zh-CN": "预订门票",
  "zh-TW": "預訂門票",
};
const LABEL_NEARBY: Record<LocaleKey, string> = {
  ko: "이 근처에서",
  en: "Nearby",
  ja: "この近くで",
  "zh-CN": "附近推荐",
  "zh-TW": "附近推薦",
};

/** ACCESS 3개 고정 거점 (KINTEX·일산역·서울역). 정적 문안. */
const ACCESS_POINTS: ReadonlyArray<{
  key: "kintex" | "ilsan" | "seoul";
  labels: Record<LocaleKey, string>;
}> = [
  {
    key: "kintex",
    labels: {
      ko: "KINTEX",
      en: "KINTEX",
      ja: "KINTEX",
      "zh-CN": "KINTEX",
      "zh-TW": "KINTEX",
    },
  },
  {
    key: "ilsan",
    labels: {
      ko: "일산역",
      en: "Ilsan Station",
      ja: "一山駅",
      "zh-CN": "一山站",
      "zh-TW": "一山站",
    },
  },
  {
    key: "seoul",
    labels: {
      ko: "서울역",
      en: "Seoul Station",
      ja: "ソウル駅",
      "zh-CN": "首尔站",
      "zh-TW": "首爾站",
    },
  },
];

/** "이 근처에서" — /best 3개 링크. */
const NEARBY_CATS: ReadonlyArray<{
  slug: string;
  label: Record<LocaleKey, string>;
}> = [
  {
    slug: "food",
    label: { ko: "미식", en: "Food", ja: "美食", "zh-CN": "美食", "zh-TW": "美食" },
  },
  {
    slug: "culture",
    label: { ko: "문화", en: "Culture", ja: "文化", "zh-CN": "文化", "zh-TW": "文化" },
  },
  {
    slug: "walk",
    label: { ko: "산책", en: "Walks", ja: "散策", "zh-CN": "散步", "zh-TW": "散步" },
  },
];

/** 소개 2~3문장 슬라이스 — description 을 마침표/。 기준으로 자르고 최대 3. */
function pickIntroSentences(text: string): string[] {
  return text
    .split(/(?<=[.。])\s+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 3);
}

function pickLocalized(item: TicketProduct, locale: LocaleKey) {
  if (locale === "ko") return { venue: item.venue };
  const t = item.translations?.[locale as TicketLocale];
  return { venue: t?.venue ?? item.venue };
}

function getTicket(type: WhatsOnType, slug: string): TicketProduct | null {
  const item = ticketProducts.find((t) => t.id === slug);
  if (!item) return null;
  if (!TYPE_SOURCE_CATEGORIES[type].includes(item.category)) return null;
  return item;
}

export function generateStaticParams() {
  return LOCALES.flatMap((locale) =>
    ticketProducts.flatMap((t) => {
      const matchedType = TYPE_KEYS.find((k) =>
        TYPE_SOURCE_CATEGORIES[k].includes(t.category)
      );
      if (!matchedType) return [];
      return [{ locale, type: matchedType, slug: t.id }];
    })
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; type: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, type, slug } = await params;
  const active = toLocale(locale);
  if (!isType(type)) return { title: "" };
  const item = getTicket(type, slug);
  if (!item) return { title: "" };
  return {
    title: `${item.title} — ${TYPE_LABEL[type][active]}`,
    description: item.summary,
    alternates: {
      canonical: `/${active}/whats-on/${type}/${slug}`,
    },
  };
}

export default async function WhatsOnDetailPage({
  params,
}: {
  params: Promise<{ locale: string; type: string; slug: string }>;
}) {
  const { locale, type, slug } = await params;
  const active = toLocale(locale);
  if (!isType(type)) notFound();
  const item = getTicket(type as WhatsOnType, slug);
  if (!item) notFound();

  const { venue } = pickLocalized(item, active);
  const intro = pickIntroSentences(item.description);
  const credit = item.credit?.trim();
  const kakaoMapUrl = `https://map.kakao.com/?q=${encodeURIComponent(item.venue)}`;
  const reservationUrl = `/products/ticket-agency-platform/reservation?ticket=${item.id}`;

  return (
    <Shell>
      <article className="bg-white text-[#232322]">
        {/* 1. 대형 사진 */}
        <section className="relative aspect-[16/9] max-h-[600px] w-full bg-[#232322]">
          {item.imageUrl ? (
            <Image
              src={item.imageUrl}
              alt={item.title}
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="text-5xl font-black uppercase tracking-[0.24em] text-[#D4AF37] sm:text-7xl">
                {item.posterLabel}
              </span>
            </div>
          )}
          {credit && (
            <p className="absolute bottom-3 right-4 text-[10px] uppercase tracking-[0.18em] text-white/80">
              © {credit}
            </p>
          )}
        </section>

        {/* 2. 분류 라벨 · 3. 제목+한글병기 · 4. 일정 */}
        <section className="mx-auto max-w-4xl px-6 py-24 sm:py-28">
          <span className="inline-block border border-[#D4AF37] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.24em] text-[#D4AF37]">
            {TYPE_LABEL[type as WhatsOnType][active]}
          </span>
          <h1 className="mt-6 text-3xl font-black leading-tight tracking-[-0.03em] sm:text-5xl">
            {item.title}
          </h1>
          {item.subtitle && (
            <p className="mt-3 text-lg font-semibold text-[#232322]/70 sm:text-xl">
              {item.subtitle}
            </p>
          )}
          <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:gap-10">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#D4AF37]">
                {LABEL_DATE[active]}
              </div>
              <p className="mt-1 text-base font-semibold">{item.dateText}</p>
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#D4AF37]">
                {LABEL_VENUE[active]}
              </div>
              <p className="mt-1 text-base font-semibold">{venue}</p>
            </div>
          </div>
        </section>

        {/* 5. 장소 + ACCESS — 3개 고정 거점 */}
        <section className="mx-auto max-w-4xl px-6 pb-24 sm:pb-28">
          <div className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#D4AF37]">
            {LABEL_ACCESS[active]}
          </div>
          <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {ACCESS_POINTS.map((p) => (
              <li
                key={p.key}
                className="border border-[#232322]/15 px-4 py-3 text-sm font-semibold"
              >
                {p.labels[active]}
              </li>
            ))}
          </ul>
        </section>

        {/* 6. 소개 2~3문장 */}
        {intro.length > 0 && (
          <section className="mx-auto max-w-4xl px-6 pb-24 sm:pb-28">
            <div className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#D4AF37]">
              {LABEL_INTRO[active]}
            </div>
            <div className="mt-4 space-y-3 text-base leading-relaxed text-[#232322]/85">
              {intro.map((s, i) => (
                <p key={i}>{s}</p>
              ))}
            </div>
          </section>
        )}

        {/* 7. 한국어 원문 카드 · 8. 지도 */}
        <section className="mx-auto max-w-4xl px-6 pb-24 sm:pb-28">
          <div className="border border-[#232322]/20 p-6 sm:p-8">
            <div className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#D4AF37]">
              {LABEL_KOREAN_ORIGINAL[active]}
            </div>
            <p className="mt-3 text-xl font-black leading-tight sm:text-2xl">
              {item.venue}
            </p>
            <a
              href={kakaoMapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-block border border-[#232322] px-5 py-2.5 text-sm font-bold text-[#232322] transition-colors hover:border-[#D4AF37] hover:text-[#D4AF37]"
            >
              🗺️ {LABEL_MAP[active]}
            </a>
          </div>
        </section>

        {/* 9. 티켓 예매 CTA — 결제 진입점 (티켓 라우트에만 허용) */}
        <section className="bg-[#232322] py-24 sm:py-28">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <Link
              href={reservationUrl}
              className="inline-block border border-[#D4AF37] bg-[#D4AF37] px-10 py-4 text-base font-black uppercase tracking-[0.18em] text-[#232322] transition-colors hover:bg-transparent hover:text-[#D4AF37]"
            >
              {LABEL_BOOK_CTA[active]}
            </Link>
          </div>
        </section>

        {/* 10. 이 근처에서 · /best 3개 */}
        <section className="mx-auto max-w-4xl px-6 py-24 sm:py-28">
          <div className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#D4AF37]">
            {LABEL_NEARBY[active]}
          </div>
          <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {NEARBY_CATS.map((cat) => (
              <li key={cat.slug}>
                <Link
                  href={`/best/${cat.slug}`}
                  className="block border border-[#232322]/15 px-5 py-6 text-lg font-black transition-colors hover:border-[#D4AF37] hover:text-[#D4AF37]"
                >
                  {cat.label[active]}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </article>
    </Shell>
  );
}
