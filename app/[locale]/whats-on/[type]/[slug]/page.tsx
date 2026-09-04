// /[locale]/whats-on/[type]/[slug] — 이벤트 상세 라우트
// (오더 #P9 [2] · 데이터 소스 재구성은 오더 #P9-b [4]).
//
// 소스: data/whats-on-events.ts (native + ticket-booking 어댑터 통합).
//   · 티켓 상품이 아닌 행사(무료 축제·현장 발권 등)도 노출 가능.
//   · 결제는 기존 티켓 결제 라우트에만 존재. 이 페이지는 진입점만 제공.
//
// CTA 분기 (오더 #P9-b [1]):
//   · ticketUrl 있으면 "티켓 예매하기"
//   · 없고 officialUrl 있으면 "공식 사이트"
//   · 둘 다 없으면 CTA 섹션 자체 미렌더
//
// 사진 fallback (오더 #P9-b [3]):
//   · imageUrl 있으면 그대로.
//   · 없으면 venue/type 기준 장소 사진 + "사진: {장소}" 캡션
//     (행사 사진 오인 방지).
//
// 디자인: 차콜 #232322 + 골드 #D4AF37 + 사진. 그림자·형광 강조 금지.
// 배지 1개 (분류 라벨). 섹션 간 96px+. 모바일 1열.

import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import Shell from "@/components/layout/Shell";
import {
  findWhatsOnEvent,
  isCurrentOrUpcoming,
  loadVisibleWhatsOnEvents,
  resolveEventImage,
  WHATS_ON_LOCALES,
  type WhatsOnEvent,
  type WhatsOnEventType,
  type WhatsOnLocale,
} from "@/data/whats-on-events";
import { Link } from "@/lib/navigation";

const TYPE_KEYS: WhatsOnEventType[] = ["performance", "festival", "exhibition"];

function toLocale(v: string): WhatsOnLocale {
  return WHATS_ON_LOCALES.includes(v as WhatsOnLocale) ? (v as WhatsOnLocale) : "ko";
}
function isType(v: string): v is WhatsOnEventType {
  return (TYPE_KEYS as string[]).includes(v);
}

const TYPE_LABEL: Record<WhatsOnEventType, Record<WhatsOnLocale, string>> = {
  performance: { ko: "공연", en: "Performance", ja: "公演", "zh-CN": "演出", "zh-TW": "演出" },
  festival: { ko: "축제", en: "Festival", ja: "フェスティバル", "zh-CN": "节庆", "zh-TW": "節慶" },
  exhibition: { ko: "전시", en: "Exhibition", ja: "展示", "zh-CN": "展览", "zh-TW": "展覽" },
};

const LABEL_DATE: Record<WhatsOnLocale, string> = {
  ko: "일정", en: "Schedule", ja: "スケジュール", "zh-CN": "日程", "zh-TW": "日程",
};
const LABEL_VENUE: Record<WhatsOnLocale, string> = {
  ko: "장소", en: "Venue", ja: "会場", "zh-CN": "地点", "zh-TW": "地點",
};
const LABEL_HOST: Record<WhatsOnLocale, string> = {
  ko: "주최", en: "Host", ja: "主催", "zh-CN": "主办", "zh-TW": "主辦",
};
const LABEL_FREE: Record<WhatsOnLocale, string> = {
  ko: "무료 관람", en: "Free Admission", ja: "無料", "zh-CN": "免费入场", "zh-TW": "免費入場",
};
const LABEL_ACCESS: Record<WhatsOnLocale, string> = {
  ko: "ACCESS", en: "ACCESS", ja: "ACCESS", "zh-CN": "ACCESS", "zh-TW": "ACCESS",
};
const LABEL_INTRO: Record<WhatsOnLocale, string> = {
  ko: "소개", en: "About", ja: "紹介", "zh-CN": "简介", "zh-TW": "簡介",
};
const LABEL_KOREAN_ORIGINAL: Record<WhatsOnLocale, string> = {
  ko: "장소명 (한국어)",
  en: "Venue (Korean · show this to locals)",
  ja: "会場名 (韓国語表記)",
  "zh-CN": "地点（韩语原文）",
  "zh-TW": "地點（韓語原文）",
};
const LABEL_MAP: Record<WhatsOnLocale, string> = {
  ko: "지도에서 보기", en: "Open in map", ja: "地図で見る",
  "zh-CN": "在地图中查看", "zh-TW": "在地圖中查看",
};
const LABEL_BOOK_CTA: Record<WhatsOnLocale, string> = {
  ko: "티켓 예매하기", en: "Book tickets", ja: "チケットを予約する",
  "zh-CN": "预订门票", "zh-TW": "預訂門票",
};
const LABEL_OFFICIAL_CTA: Record<WhatsOnLocale, string> = {
  ko: "공식 사이트", en: "Official site", ja: "公式サイト",
  "zh-CN": "官方网站", "zh-TW": "官方網站",
};
const LABEL_NEARBY: Record<WhatsOnLocale, string> = {
  ko: "이 근처에서", en: "Nearby", ja: "この近くで",
  "zh-CN": "附近推荐", "zh-TW": "附近推薦",
};

/**
 * ACCESS 3개 고정 거점 (오더 #P9-e [10]).
 * 이전: 'KINTEX' | '일산역' | '서울역' — 일산역은 경의중앙선으로 킨텍스·
 * 호수공원 권역과 거리가 있어 방문객 기준점으로 부적절.
 * 이제: 실제 하차역 기준 — GTX 킨텍스역 · 3호선 대화역 · 서울역.
 * 소요시간 값은 별도 지시로 확정 (임의 값 금지).
 */
const ACCESS_POINTS: ReadonlyArray<{
  key: "gtx-kintex" | "daehwa" | "seoul";
  labels: Record<WhatsOnLocale, string>;
}> = [
  {
    key: "gtx-kintex",
    labels: {
      ko: "GTX 킨텍스역",
      en: "GTX Kintex Stn.",
      ja: "GTX キンテックス駅",
      "zh-CN": "GTX 韩国国际展览中心站",
      "zh-TW": "GTX 韓國國際展覽中心站",
    },
  },
  {
    key: "daehwa",
    labels: {
      ko: "3호선 대화역",
      en: "Daehwa Stn. (Line 3)",
      ja: "3号線 大化駅",
      "zh-CN": "3号线 大化站",
      "zh-TW": "3號線 大化站",
    },
  },
  {
    key: "seoul",
    labels: {
      ko: "서울역",
      en: "Seoul Stn.",
      ja: "ソウル駅",
      "zh-CN": "首尔站",
      "zh-TW": "首爾站",
    },
  },
];

/** "이 근처에서" — /best 3개 링크. */
const NEARBY_CATS: ReadonlyArray<{
  slug: string;
  label: Record<WhatsOnLocale, string>;
}> = [
  { slug: "food", label: { ko: "미식", en: "Food", ja: "美食", "zh-CN": "美食", "zh-TW": "美食" } },
  { slug: "culture", label: { ko: "문화", en: "Culture", ja: "文化", "zh-CN": "文化", "zh-TW": "文化" } },
  { slug: "walk", label: { ko: "산책", en: "Walks", ja: "散策", "zh-CN": "散步", "zh-TW": "散步" } },
];

/** 소개 2~3문장 슬라이스 — summary 를 마침표/。 기준으로 자르고 최대 3. */
function pickIntroSentences(text: string): string[] {
  return text
    .split(/(?<=[.。])\s+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 3);
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

// 오더 #C50: async — admin(Supabase) 등록 티켓 + native 이벤트 결합해 정적 경로 생성.
export async function generateStaticParams() {
  // 오더 #P9-d [2]: 미검증(verified=false) 이벤트는 정적 경로 자체를 생성하지 않는다.
  const events = await loadVisibleWhatsOnEvents();
  return WHATS_ON_LOCALES.flatMap((locale) =>
    events.map((e) => ({ locale, type: e.type, slug: e.slug }))
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
  const events = await loadVisibleWhatsOnEvents();
  const event = findWhatsOnEvent(events, type, slug);
  if (!event) return { title: "" };
  return {
    title: `${event.title[active]} — ${TYPE_LABEL[type][active]}`,
    description: event.summary[active],
    alternates: {
      canonical: `/${active}/whats-on/${type}/${slug}`,
    },
  };
}

type CtaResolution =
  | { kind: "ticket"; href: string }
  | { kind: "official"; href: string }
  | { kind: "none" };

function resolveCta(event: WhatsOnEvent): CtaResolution {
  if (event.ticketUrl) return { kind: "ticket", href: event.ticketUrl };
  if (event.officialUrl) return { kind: "official", href: event.officialUrl };
  return { kind: "none" };
}

export default async function WhatsOnDetailPage({
  params,
}: {
  params: Promise<{ locale: string; type: string; slug: string }>;
}) {
  const { locale, type, slug } = await params;
  const active = toLocale(locale);
  if (!isType(type)) notFound();
  const events = await loadVisibleWhatsOnEvents();
  const event = findWhatsOnEvent(events, type, slug);
  if (!event) notFound();
  // 지난 이벤트는 상세 진입도 차단 (홈에서 이미 자동 숨김).
  if (!isCurrentOrUpcoming(event)) notFound();

  const image = resolveEventImage(event);
  const heroCaption = image.captionText(active);
  const intro = pickIntroSentences(event.summary[active]);
  const dateText = formatDateRange(event.startDate, event.endDate);
  // 오더 #P9-e [8-2]: 지도 링크는 address 기준. address 없으면 지도 미렌더
  // (틀린 위치를 보여주느니 안 보여주는 편이 낫다 — venue 문자열 검색은 부정확).
  const kakaoMapUrl = event.address
    ? `https://map.kakao.com/?q=${encodeURIComponent(event.address)}`
    : null;
  const cta = resolveCta(event);
  const isExternalCta = cta.kind === "official";

  return (
    <Shell>
      <article className="bg-white text-[#232322]">
        {/* 1. 대형 사진 (fallback 시 캡션 표기).
            오더 #P9-k [3]: 실사진 배너에는 제목·날짜 텍스트가 포함되어
            잘림 방지를 위해 object-contain + 차콜 배경. fallback 은
            풍경/장소 사진이라 잘림 무방하므로 object-cover 유지. */}
        <section className="relative aspect-[16/9] max-h-[600px] w-full bg-[#232322]">
          <Image
            src={image.src}
            alt={event.title[active]}
            fill
            className={image.isFallback ? "object-cover" : "object-contain"}
            sizes="100vw"
            priority
          />
          {heroCaption && (
            <p className="absolute bottom-3 right-4 text-[10px] uppercase tracking-[0.18em] text-white/80">
              {heroCaption}
            </p>
          )}
        </section>

        {/* 2. 분류 라벨 · 3. 제목 · 4. 일정·장소·주최 */}
        <section className="mx-auto max-w-4xl px-6 py-24 sm:py-28">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-block border border-[#D4AF37] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.24em] text-[#D4AF37]">
              {TYPE_LABEL[type][active]}
            </span>
            {event.free && (
              <span className="inline-block bg-[#232322] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.24em] text-white">
                {LABEL_FREE[active]}
              </span>
            )}
          </div>
          <h1 className="mt-6 text-3xl font-black leading-tight tracking-[-0.03em] sm:text-5xl">
            {event.title[active]}
          </h1>
          <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:gap-10">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#D4AF37]">
                {LABEL_DATE[active]}
              </div>
              <p className="mt-1 text-base font-semibold">{dateText}</p>
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#D4AF37]">
                {LABEL_VENUE[active]}
              </div>
              <p className="mt-1 text-base font-semibold">{event.venue[active]}</p>
            </div>
            {event.host && (
              <div>
                <div className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#D4AF37]">
                  {LABEL_HOST[active]}
                </div>
                <p className="mt-1 text-base font-semibold">{event.host[active]}</p>
              </div>
            )}
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

        {/* 7. 한국어 원문 카드 · 8. 지도 (오더 #P9-e [8-2/8-3]).
            address 있으면 카드에 주소도 표기하고 지도 링크 렌더.
            address 없으면 지도 버튼 미렌더 (틀린 위치 노출 방지). */}
        <section className="mx-auto max-w-4xl px-6 pb-24 sm:pb-28">
          <div className="border border-[#232322]/20 p-6 sm:p-8">
            <div className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#D4AF37]">
              {LABEL_KOREAN_ORIGINAL[active]}
            </div>
            <p className="mt-3 text-xl font-black leading-tight sm:text-2xl">
              {event.venue.ko}
            </p>
            {event.address && (
              <p className="mt-2 text-sm text-[#232322]/70">{event.address}</p>
            )}
            {kakaoMapUrl && (
              <a
                href={kakaoMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-block border border-[#232322] px-5 py-2.5 text-sm font-bold text-[#232322] transition-colors hover:border-[#D4AF37] hover:text-[#D4AF37]"
              >
                🗺️ {LABEL_MAP[active]}
              </a>
            )}
          </div>
        </section>

        {/* 9. CTA — ticketUrl 우선, 그다음 officialUrl. 둘 다 없으면 섹션 미렌더. */}
        {cta.kind !== "none" && (
          <section className="bg-[#232322] py-24 sm:py-28">
            <div className="mx-auto max-w-4xl px-6 text-center">
              {isExternalCta ? (
                <a
                  href={cta.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block border border-[#D4AF37] bg-[#D4AF37] px-10 py-4 text-base font-black uppercase tracking-[0.18em] text-[#232322] transition-colors hover:bg-transparent hover:text-[#D4AF37]"
                >
                  {LABEL_OFFICIAL_CTA[active]}
                </a>
              ) : (
                <Link
                  href={cta.href}
                  className="inline-block border border-[#D4AF37] bg-[#D4AF37] px-10 py-4 text-base font-black uppercase tracking-[0.18em] text-[#232322] transition-colors hover:bg-transparent hover:text-[#D4AF37]"
                >
                  {LABEL_BOOK_CTA[active]}
                </Link>
              )}
            </div>
          </section>
        )}

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
