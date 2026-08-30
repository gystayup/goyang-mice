// /[locale]/dmc/[slug] — 장소 1곳 소개층 실체 (오더 #P7).
//
// 3층 구조에서 "소개층"만 담당:
//   /best/[cat] = 목록층 · /dmc/[slug] = 이 파일 · /products = 카탈로그
//
// 판매 불가 구조 고정 — 가격·예약·booking CTA 없음. 광고 슬롯은 빈 컨테이너.
//
// 렌더 순서 (오더 #P7 [2]):
//   ① 대형 사진(풀블리드)  ② 카테고리 라벨  ③ 영문 대제목 + 한글 병기
//   ④ 부제  ⑤ 메타(읽는시간·거리·소요시간·갱신일)
//   ⑥ 리드  ⑦ 목차(데스크톱 sticky · 모바일 접이식)
//   ⑧ 동선표(type='course'만)  ⑨ 지도  ⑩ 구간·섹션 본문
//   ⑪ ACCESS(3거점 고정)  ⑫ 실용 정보  ⑬ WHAT TO KNOW
//   ⑭ 한국어 원문 카드(복사 버튼)  ⑮ [광고 슬롯 — 빈 컨테이너]
//   ⑯ 이미지 출처  ⑰ 관련 3개
//
// 디자인: 차콜 #232322 + 골드 #D4AF37 + 사진. 그림자·형광 강조 금지.

import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { KoCopyButton } from "@/components/dmc/KoCopyButton";
import Shell from "@/components/layout/Shell";
import {
  CATEGORY_LABEL,
  isCuratedCategory,
} from "@/data/curated-categories";
import {
  getRelatedSpots,
  getSpot,
  SPOT_LOCALES,
  type Spot,
  type SpotLocale,
} from "@/data/spots";
import { Link } from "@/lib/navigation";

export type PageLocale = SpotLocale;

function toLocale(v: string): PageLocale {
  return SPOT_LOCALES.includes(v as PageLocale) ? (v as PageLocale) : "ko";
}

// ─── 5로케일 정적 문안 ───────────────────────────────────────────────────────

const LABEL_TOC: Record<PageLocale, string> = {
  ko: "목차", en: "Contents", ja: "目次", "zh-CN": "目录", "zh-TW": "目錄",
};
const LABEL_LEGS: Record<PageLocale, string> = {
  ko: "동선", en: "Route", ja: "動線", "zh-CN": "路线", "zh-TW": "路線",
};
const LABEL_MAP: Record<PageLocale, string> = {
  ko: "지도", en: "Map", ja: "地図", "zh-CN": "地图", "zh-TW": "地圖",
};
const LABEL_MAP_OPEN: Record<PageLocale, string> = {
  ko: "지도에서 보기", en: "Open in map", ja: "地図で見る",
  "zh-CN": "在地图中查看", "zh-TW": "在地圖中查看",
};
const LABEL_ACCESS: Record<PageLocale, string> = {
  ko: "ACCESS", en: "ACCESS", ja: "ACCESS", "zh-CN": "ACCESS", "zh-TW": "ACCESS",
};
const LABEL_PRACTICAL: Record<PageLocale, string> = {
  ko: "실용 정보", en: "Practical Info", ja: "実用情報",
  "zh-CN": "实用信息", "zh-TW": "實用資訊",
};
const LABEL_KNOW: Record<PageLocale, string> = {
  ko: "WHAT TO KNOW", en: "WHAT TO KNOW", ja: "WHAT TO KNOW",
  "zh-CN": "WHAT TO KNOW", "zh-TW": "WHAT TO KNOW",
};
const LABEL_KOCARD: Record<PageLocale, string> = {
  ko: "장소명·주소 (한국어)",
  en: "Venue & address (Korean · show this to locals)",
  ja: "会場名·住所 (韓国語表記)",
  "zh-CN": "地点·地址（韩语原文）",
  "zh-TW": "地點·地址（韓語原文）",
};
const LABEL_COPY: Record<PageLocale, string> = {
  ko: "복사", en: "Copy", ja: "コピー", "zh-CN": "复制", "zh-TW": "複製",
};
const LABEL_COPIED: Record<PageLocale, string> = {
  ko: "복사됨", en: "Copied", ja: "コピーしました",
  "zh-CN": "已复制", "zh-TW": "已複製",
};
const LABEL_CREDITS: Record<PageLocale, string> = {
  ko: "이미지 출처", en: "Image credits", ja: "画像出典",
  "zh-CN": "图片来源", "zh-TW": "圖片來源",
};
const LABEL_RELATED: Record<PageLocale, string> = {
  ko: "관련 소개", en: "Related", ja: "関連", "zh-CN": "相关介绍", "zh-TW": "相關介紹",
};
const LABEL_UPDATED: Record<PageLocale, string> = {
  ko: "갱신", en: "Updated", ja: "更新", "zh-CN": "更新", "zh-TW": "更新",
};
const LABEL_READ_MIN: Record<PageLocale, string> = {
  ko: "분 읽기", en: "min read", ja: "分で読める",
  "zh-CN": "分钟阅读", "zh-TW": "分鐘閱讀",
};
const LABEL_DISTANCE: Record<PageLocale, string> = {
  ko: "거리", en: "Distance", ja: "距離", "zh-CN": "距离", "zh-TW": "距離",
};
const LABEL_DURATION: Record<PageLocale, string> = {
  ko: "소요", en: "Duration", ja: "所要時間", "zh-CN": "耗时", "zh-TW": "耗時",
};
const LABEL_WALK_MIN: Record<PageLocale, string> = {
  ko: "도보 분", en: "min walk", ja: "徒歩分",
  "zh-CN": "步行分钟", "zh-TW": "步行分鐘",
};
const LABEL_MINUTES: Record<PageLocale, string> = {
  ko: "분", en: "min", ja: "分", "zh-CN": "分钟", "zh-TW": "分鐘",
};

// ─── 유틸 ───────────────────────────────────────────────────────────────────

/** DOM id 로 안전한 슬러그 (섹션 heading → 앵커). */
function toAnchorId(prefix: string, text: string, i: number): string {
  const clean = text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 40);
  return `${prefix}-${i}-${clean || "sec"}`;
}

// ─── metadata / staticParams ────────────────────────────────────────────────

export async function generateSpotDetailMetadata(
  slug: string,
  locale: PageLocale
): Promise<Metadata> {
  const spot = getSpot(slug);
  if (!spot) return { title: "" };
  return {
    title: `${spot.title[locale]} — ${CATEGORY_LABEL[locale][spot.category]}`,
    description: spot.lead[locale],
    alternates: {
      canonical: `/${locale}/dmc/${slug}`,
    },
  };
}

// 데이터 0건 → 빈 배열. Next 는 이 경우 dynamicParams 로 처리 (아래 미설정 =
// 기본 true 유지). getSpot() null → notFound() 로 방어.
export function generateSpotDetailStaticParams(): Array<{
  locale: PageLocale;
  slug: string;
}> {
  return [];
}

// ─── page ────────────────────────────────────────────────────────────────────

export default async function SpotDetailPage({
  slug,
  locale = "ko",
}: {
  slug: string;
  locale?: PageLocale;
}) {
  const spot = getSpot(slug);
  if (!spot) notFound();

  const categoryLabel = isCuratedCategory(spot.category)
    ? CATEGORY_LABEL[locale][spot.category]
    : spot.category;

  const heroImage = spot.sections.find((s) => s.image)?.image;
  const heroCredit = spot.sections.find((s) => s.image)?.image_credit;

  const tocItems = spot.sections.map((s, i) => ({
    id: toAnchorId("sec", s.heading[locale] || "sec", i),
    label: s.heading[locale],
  }));

  const koCardCombined = spot.ko_card
    .map((c) => `${c.name_ko}\n${c.address_ko}`)
    .join("\n\n");

  const kakaoMapUrl = spot.ko_card[0]
    ? `https://map.kakao.com/?q=${encodeURIComponent(spot.ko_card[0].name_ko)}`
    : "https://map.kakao.com/";

  const related = getRelatedSpots(spot.slug);

  return (
    <Shell>
      <article className="bg-white text-[#232322]">
        {/* ① 대형 사진 (풀블리드). 사진 없으면 차콜 배경. */}
        <section className="relative aspect-[16/9] max-h-[600px] w-full bg-[#232322]">
          {heroImage ? (
            <Image
              src={heroImage}
              alt={spot.title[locale]}
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
          ) : null}
          {heroCredit ? (
            <p className="absolute bottom-3 right-4 text-[10px] uppercase tracking-[0.18em] text-white/80">
              © {heroCredit}
            </p>
          ) : null}
        </section>

        {/* ②③④⑤⑥ — 헤더 블록 (카테고리 · 영문/한글 · 부제 · 메타 · 리드) */}
        <section className="mx-auto max-w-4xl px-6 py-24 sm:py-28">
          {/* ② 카테고리 라벨 — 배지 1개 원칙 */}
          <span className="inline-block border border-[#D4AF37] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.24em] text-[#D4AF37]">
            {categoryLabel}
          </span>

          {/* ③ 영문 대제목 + 한글 병기 */}
          <h1 className="mt-6 text-3xl font-black uppercase leading-tight tracking-[-0.02em] sm:text-5xl">
            {spot.title_en_display}
          </h1>
          <p className="mt-2 text-xl font-black leading-tight tracking-[-0.02em] sm:text-2xl">
            {spot.title[locale]}
          </p>

          {/* ④ 부제 */}
          {spot.subtitle[locale] ? (
            <p className="mt-4 text-lg font-semibold text-[#232322]/70 sm:text-xl">
              {spot.subtitle[locale]}
            </p>
          ) : null}

          {/* ⑤ 메타 (읽는시간·거리·소요시간·갱신일) */}
          <SpotMetaRow spot={spot} locale={locale} />

          {/* ⑥ 리드 */}
          {spot.lead[locale] ? (
            <p className="mt-8 text-base leading-relaxed text-[#232322]/85 sm:text-lg">
              {spot.lead[locale]}
            </p>
          ) : null}
        </section>

        {/* ⑦ 목차 — 데스크톱 sticky 사이드바 · 모바일 접이식 (<details>) */}
        {tocItems.length > 0 ? (
          <section className="mx-auto max-w-6xl px-6 pb-24 sm:pb-28">
            <div className="lg:grid lg:grid-cols-12 lg:gap-10">
              <aside className="lg:col-span-3">
                <details className="border border-[#232322]/15 lg:hidden">
                  <summary className="cursor-pointer list-none px-4 py-3 text-[11px] font-bold uppercase tracking-[0.24em] text-[#D4AF37]">
                    {LABEL_TOC[locale]} ▾
                  </summary>
                  <TocList items={tocItems} />
                </details>

                <div className="hidden lg:sticky lg:top-24 lg:block">
                  <div className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#D4AF37]">
                    {LABEL_TOC[locale]}
                  </div>
                  <TocList items={tocItems} />
                </div>
              </aside>

              <div className="mt-6 lg:col-span-9 lg:mt-0">
                {/* ⑧ 동선표 — type='course' 만 */}
                {spot.type === "course" && spot.legs && spot.legs.length > 0 ? (
                  <div className="mb-20 sm:mb-24">
                    <div className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#D4AF37]">
                      {LABEL_LEGS[locale]}
                    </div>
                    <ol className="mt-4 divide-y divide-[#232322]/15 border-y border-[#232322]/15">
                      {spot.legs.map((leg, i) => (
                        <li key={`${leg.from}-${leg.to}-${i}`} className="grid grid-cols-1 gap-2 py-4 sm:grid-cols-[auto_1fr_auto] sm:items-center sm:gap-6">
                          <div className="text-sm font-black">
                            {leg.from} → {leg.to}
                          </div>
                          <div className="text-sm text-[#232322]/85">
                            {leg.point[locale]}
                          </div>
                          <div className="text-xs font-bold uppercase tracking-[0.18em] text-[#232322]/60 sm:text-right">
                            {leg.walk_min} {LABEL_WALK_MIN[locale]}
                          </div>
                        </li>
                      ))}
                    </ol>
                  </div>
                ) : null}

                {/* ⑨ 지도 — Kakao 외부 링크 (마커 SDK 미도입, 링크 재사용) */}
                <div className="mb-20 sm:mb-24">
                  <div className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#D4AF37]">
                    {LABEL_MAP[locale]}
                  </div>
                  <a
                    href={kakaoMapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-block border border-[#232322] px-5 py-2.5 text-sm font-bold text-[#232322] transition-colors hover:border-[#D4AF37] hover:text-[#D4AF37]"
                  >
                    🗺️ {LABEL_MAP_OPEN[locale]}
                  </a>
                  {spot.map && spot.map.length > 0 ? (
                    <ul className="mt-4 space-y-1 text-xs text-[#232322]/70">
                      {spot.map.map((m, i) => (
                        <li key={`${m.label}-${i}`}>
                          {m.label} · {m.lat.toFixed(5)}, {m.lng.toFixed(5)}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>

                {/* ⑩ 구간·섹션 본문 */}
                <div className="space-y-24 sm:space-y-28">
                  {spot.sections.map((sec, i) => {
                    const anchorId = toAnchorId(
                      "sec",
                      sec.heading[locale] || "sec",
                      i
                    );
                    return (
                      <div key={anchorId} id={anchorId} className="scroll-mt-24">
                        <h2 className="text-2xl font-black leading-tight tracking-[-0.02em] sm:text-3xl">
                          {sec.heading[locale]}
                        </h2>
                        {sec.image ? (
                          <div className="relative mt-6 aspect-[16/9] w-full overflow-hidden bg-[#232322]">
                            <Image
                              src={sec.image}
                              alt={sec.heading[locale]}
                              fill
                              className="object-cover"
                              sizes="(max-width: 1024px) 100vw, 66vw"
                            />
                            {sec.image_credit ? (
                              <p className="absolute bottom-2 right-3 text-[10px] uppercase tracking-[0.18em] text-white/80">
                                © {sec.image_credit}
                              </p>
                            ) : null}
                          </div>
                        ) : null}
                        <div className="mt-6 whitespace-pre-line text-base leading-relaxed text-[#232322]/85 sm:text-lg">
                          {sec.body[locale]}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
        ) : null}

        {/* ⑪ ACCESS — 3거점 고정. spot.access 항목이 있어야 렌더. */}
        {spot.access.length > 0 ? (
          <section className="mx-auto max-w-4xl px-6 pb-24 sm:pb-28">
            <div className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#D4AF37]">
              {LABEL_ACCESS[locale]}
            </div>
            <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {spot.access.map((a) => (
                <li key={a.from} className="border border-[#232322]/15 px-4 py-3 text-sm">
                  <div className="font-black">{a.from}</div>
                  <div className="mt-1 text-[#232322]/70">
                    {a.mode} · {a.minutes} {LABEL_MINUTES[locale]}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {/* ⑫ 실용 정보 */}
        <section className="mx-auto max-w-4xl px-6 pb-24 sm:pb-28">
          <div className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#D4AF37]">
            {LABEL_PRACTICAL[locale]}
          </div>
          <dl className="mt-4 grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
            <PracticalRow label={LABEL_BEST_TIME[locale]} value={spot.practical.best_time[locale]} />
            <PracticalRow label={LABEL_PARKING[locale]} value={spot.practical.parking[locale]} />
            <PracticalRow label={LABEL_PAYMENT[locale]} value={spot.practical.payment[locale]} />
            <PracticalRow label={LABEL_CLOSED[locale]} value={spot.practical.closed_day[locale]} />
            <PracticalRow label={LABEL_RESTROOM[locale]} value={spot.practical.restroom[locale]} />
          </dl>
        </section>

        {/* ⑬ WHAT TO KNOW */}
        {spot.know.length > 0 ? (
          <section className="mx-auto max-w-4xl px-6 pb-24 sm:pb-28">
            <div className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#D4AF37]">
              {LABEL_KNOW[locale]}
            </div>
            <ul className="mt-4 space-y-3">
              {spot.know.map((k, i) => (
                <li key={i} className="border-l-2 border-[#D4AF37] pl-4 text-base leading-relaxed text-[#232322]/85">
                  {k[locale]}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {/* ⑭ 한국어 원문 카드 (복사 버튼) */}
        {spot.ko_card.length > 0 ? (
          <section className="mx-auto max-w-4xl px-6 pb-24 sm:pb-28">
            <div className="border border-[#232322]/20 p-6 sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <div className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#D4AF37]">
                  {LABEL_KOCARD[locale]}
                </div>
                <KoCopyButton
                  text={koCardCombined}
                  label={LABEL_COPY[locale]}
                  copiedLabel={LABEL_COPIED[locale]}
                />
              </div>
              <ul className="mt-4 space-y-4">
                {spot.ko_card.map((c, i) => (
                  <li key={`${c.name_ko}-${i}`}>
                    <p className="text-xl font-black leading-tight sm:text-2xl">
                      {c.name_ko}
                    </p>
                    <p className="mt-1 text-sm text-[#232322]/70">
                      {c.address_ko}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ) : null}

        {/* ⑮ 광고 슬롯 — 빈 컨테이너로 자리만. 콘텐츠·스크립트 0. */}
        <section className="mx-auto max-w-4xl px-6 pb-24 sm:pb-28">
          <div
            data-ad-slot="dmc-spot-detail"
            aria-hidden="true"
            className="min-h-[90px] border border-dashed border-[#232322]/15"
          />
        </section>

        {/* ⑯ 이미지 출처 */}
        {spot.credits.length > 0 ? (
          <section className="mx-auto max-w-4xl px-6 pb-24 sm:pb-28">
            <div className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#D4AF37]">
              {LABEL_CREDITS[locale]}
            </div>
            <ul className="mt-4 space-y-2 text-xs text-[#232322]/70">
              {spot.credits.map((c, i) => (
                <li key={i}>
                  {c.caption} —{" "}
                  {c.url ? (
                    <a
                      href={c.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline decoration-[#D4AF37] underline-offset-2 hover:text-[#D4AF37]"
                    >
                      {c.source}
                    </a>
                  ) : (
                    <span>{c.source}</span>
                  )}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {/* ⑰ 관련 3개 */}
        {related.length > 0 ? (
          <section className="mx-auto max-w-4xl px-6 py-24 sm:py-28">
            <div className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#D4AF37]">
              {LABEL_RELATED[locale]}
            </div>
            <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {related.map((r) => (
                <li key={r.slug}>
                  <Link
                    href={`/dmc/${r.slug}`}
                    className="block border border-[#232322]/15 p-5 transition-colors hover:border-[#D4AF37]"
                  >
                    <div className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#D4AF37]">
                      {CATEGORY_LABEL[locale][r.category]}
                    </div>
                    <p className="mt-2 text-lg font-black leading-tight tracking-[-0.02em]">
                      {r.title[locale]}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </article>
    </Shell>
  );
}

// ─── 하위 렌더 헬퍼 ─────────────────────────────────────────────────────────

const LABEL_BEST_TIME: Record<PageLocale, string> = {
  ko: "추천 시간대", en: "Best time", ja: "おすすめ時間",
  "zh-CN": "推荐时间", "zh-TW": "推薦時段",
};
const LABEL_PARKING: Record<PageLocale, string> = {
  ko: "주차", en: "Parking", ja: "駐車場", "zh-CN": "停车", "zh-TW": "停車",
};
const LABEL_PAYMENT: Record<PageLocale, string> = {
  ko: "결제", en: "Payment", ja: "支払い", "zh-CN": "付款", "zh-TW": "付款",
};
const LABEL_CLOSED: Record<PageLocale, string> = {
  ko: "휴무", en: "Closed", ja: "休業", "zh-CN": "休息日", "zh-TW": "公休",
};
const LABEL_RESTROOM: Record<PageLocale, string> = {
  ko: "화장실", en: "Restroom", ja: "トイレ", "zh-CN": "洗手间", "zh-TW": "洗手間",
};

function PracticalRow({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div>
      <dt className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#232322]/60">
        {label}
      </dt>
      <dd className="mt-1 text-sm font-semibold">{value}</dd>
    </div>
  );
}

function TocList({ items }: { items: Array<{ id: string; label: string }> }) {
  return (
    <ol className="mt-4 space-y-2 text-sm">
      {items.map((t, i) => (
        <li key={t.id} className="flex gap-2">
          <span className="w-5 text-right text-[10px] font-bold text-[#D4AF37]">
            {String(i + 1).padStart(2, "0")}
          </span>
          <a
            href={`#${t.id}`}
            className="text-[#232322] transition-colors hover:text-[#D4AF37]"
          >
            {t.label}
          </a>
        </li>
      ))}
    </ol>
  );
}

function SpotMetaRow({ spot, locale }: { spot: Spot; locale: PageLocale }) {
  const parts: string[] = [];
  if (spot.meta.read_min) parts.push(`${spot.meta.read_min} ${LABEL_READ_MIN[locale]}`);
  if (spot.meta.distance_km) parts.push(`${LABEL_DISTANCE[locale]} ${spot.meta.distance_km} km`);
  if (spot.meta.duration_min) parts.push(`${LABEL_DURATION[locale]} ${spot.meta.duration_min} ${LABEL_MINUTES[locale]}`);
  parts.push(`${LABEL_UPDATED[locale]} ${spot.meta.updated_at}`);
  return (
    <p className="mt-6 flex flex-wrap gap-x-3 gap-y-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#232322]/60">
      {parts.map((p, i) => (
        <span key={i}>{p}</span>
      ))}
    </p>
  );
}
