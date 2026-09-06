// /[locale]/products/day-trips/[id] — 오더 #C61 상세 페이지 정보 밀도 재설계.
//
// 진화:
//   · #C59: 12블록 템플릿 (히어로 · 제목 · Overview · 타임라인 · About · Why · Access · Stops · FAQ · Related · Sticky CTA).
//   · #C59-B: 사진 0장 → 히어로 미렌더 · 지도 숨김.
//   · #C61: 히어로 복구(항상 렌더 · 색면/사진 위 오버레이) · Breadcrumb 신설 ·
//           「가는 법」 2칸 카드 + 지도 축소 · About 줄바꿈 버그 수정 ·
//           여백 압축(py-16→py-10) · Sticky CTA IntersectionObserver.
//
// 방침:
//   · 판매·예약 없음. 소개형.
//   · 창작·의역 금지. 원문 그대로 (UI 레이블만 5로케일).
//   · 신규 색 도입 0 · 기존 토큰만 (#232322 · var(--accent) · var(--gold) · #faf7f2).
//   · 신규 이미지 제작 금지 · 기존 12 일러스트 + 5로케일 대곡역 지도 재사용.
//   · 5로케일 폴백 · ko 만 신규 필드 채움 · en/ja/zh-CN/zh-TW 렌더 시 ko fallback.

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { ArrowRight, Bus, Car, Train, Zap } from "lucide-react";

import Shell from "@/components/layout/Shell";
import DayTripStickyCta from "@/components/day-trips/DayTripStickyCta";
import { Link } from "@/lib/navigation";
import { getAxisBlock, type DayTripLocale } from "@/data/day-trips";
import type { DayTripAxis, DayTripCourse } from "@/data/day-trip-courses";
import { loadDayTrip, loadDayTrips } from "@/lib/day-trip-catalog-db";
import { hasSpotAsync } from "@/lib/spot-catalog-db";
import { getCoursePhotos } from "@/lib/day-trip-photos";

export type PageLocale = DayTripLocale;

// ─── 라벨 (5로케일) ─────────────────────────────────────────────────────
const OVERVIEW_LABEL: Record<PageLocale, string> = {
  ko: "Overview",
  en: "Overview",
  ja: "Overview",
  "zh-CN": "Overview",
  "zh-TW": "Overview",
};
const OVERVIEW_ITEM_LABELS: Record<PageLocale, {
  totalDuration: string;
  transport: string;
  recommendedTime: string;
  recommendedFor: string;
}> = {
  ko: { totalDuration: "총 소요", transport: "이동", recommendedTime: "추천 시간", recommendedFor: "이런 분께" },
  en: { totalDuration: "Total time", transport: "Transit", recommendedTime: "Best time", recommendedFor: "For you if" },
  ja: { totalDuration: "総所要", transport: "移動", recommendedTime: "おすすめ時間", recommendedFor: "こんな方に" },
  "zh-CN": { totalDuration: "总用时", transport: "交通", recommendedTime: "推荐时间", recommendedFor: "适合" },
  "zh-TW": { totalDuration: "總用時", transport: "交通", recommendedTime: "推薦時間", recommendedFor: "適合" },
};
const TIMELINE_LABEL: Record<PageLocale, string> = {
  ko: "코스 타임라인",
  en: "Course timeline",
  ja: "コースタイムライン",
  "zh-CN": "路线时间轴",
  "zh-TW": "路線時間軸",
};
const ABOUT_LABEL: Record<PageLocale, string> = {
  ko: "About this course",
  en: "About this course",
  ja: "About this course",
  "zh-CN": "About this course",
  "zh-TW": "About this course",
};
const WHY_LABEL: Record<PageLocale, string> = {
  ko: "이 코스가 좋은 이유",
  en: "Why this course",
  ja: "このコースがおすすめの理由",
  "zh-CN": "为什么选这条路线",
  "zh-TW": "為什麼選這條路線",
};
const ACCESS_LABEL: Record<PageLocale, string> = {
  ko: "가는 법",
  en: "Getting there",
  ja: "行き方",
  "zh-CN": "如何前往",
  "zh-TW": "如何前往",
};
const ACCESS_MAP_LINK: Record<PageLocale, string> = {
  ko: "대곡역 교통 개념도 보기",
  en: "See Daegok Station map",
  ja: "大谷駅 交通図を見る",
  "zh-CN": "查看大谷站交通图",
  "zh-TW": "查看大谷站交通圖",
};
const STOPS_LABEL: Record<PageLocale, string> = {
  ko: "코스에 포함된 스팟",
  en: "Stops on this course",
  ja: "コース内のスポット",
  "zh-CN": "路线上的地点",
  "zh-TW": "路線上的地點",
};
const FAQ_LABEL: Record<PageLocale, string> = {
  ko: "자주 묻는 질문",
  en: "FAQ",
  ja: "よくある質問",
  "zh-CN": "常见问题",
  "zh-TW": "常見問題",
};
const RELATED_LABEL: Record<PageLocale, string> = {
  ko: "같은 축의 다른 코스",
  en: "Other courses in this axis",
  ja: "同じ軸の他のコース",
  "zh-CN": "同一线路的其他路线",
  "zh-TW": "同一線路的其他路線",
};
const CTA_INTRO: Record<PageLocale, (badge: string) => string> = {
  ko: (b) => `이 코스는 고양에서 왕복 ${b} · Stay in Goyang.`,
  en: (b) => `This course runs ${b} round-trip from Goyang · Stay in Goyang.`,
  ja: (b) => `このコースは高陽から往復${b} · Stay in Goyang.`,
  "zh-CN": (b) => `本路线从高阳往返 ${b} · Stay in Goyang.`,
  "zh-TW": (b) => `本路線從高陽往返 ${b} · Stay in Goyang.`,
};
const CTA_BUTTON: Record<PageLocale, string> = {
  ko: "고양 숙소 보기",
  en: "See stays in Goyang",
  ja: "高陽の宿泊を見る",
  "zh-CN": "查看高阳住宿",
  "zh-TW": "查看高陽住宿",
};
const AXIS_BADGE_EN: Record<string, string> = {
  seoul: "SEOUL",
  paju: "PAJU",
  gyeonggi: "GYEONGGI",
};

// 오더 #C61 [2] — Breadcrumb 라벨 5로케일.
const BREADCRUMB_HOME: Record<PageLocale, string> = {
  ko: "홈",
  en: "Home",
  ja: "ホーム",
  "zh-CN": "首页",
  "zh-TW": "首頁",
};
const BREADCRUMB_DAYTRIPS: Record<PageLocale, string> = {
  ko: "당일코스",
  en: "Day Trips",
  ja: "日帰りコース",
  "zh-CN": "一日游",
  "zh-TW": "一日遊",
};
const AXIS_LABEL_LOCALIZED: Record<DayTripAxis, Record<PageLocale, string>> = {
  seoul: {
    ko: "서울",
    en: "Seoul",
    ja: "ソウル",
    "zh-CN": "首尔",
    "zh-TW": "首爾",
  },
  paju: {
    ko: "파주",
    en: "Paju",
    ja: "坡州",
    "zh-CN": "坡州",
    "zh-TW": "坡州",
  },
  gyeonggi: {
    ko: "경기",
    en: "Gyeonggi",
    ja: "京畿",
    "zh-CN": "京畿",
    "zh-TW": "京畿",
  },
};

// 오더 #C61 [3] — 가는 법 카드 아이콘 · 축별 fallback 라벨.
type TransportIconKey = "Train" | "Zap" | "Bus" | "Car";
const TRANSPORT_ICONS: Record<TransportIconKey, typeof Train> = {
  Train,
  Zap,
  Bus,
  Car,
};
const CAR_LABEL: Record<PageLocale, string> = {
  ko: "차량",
  en: "Car",
  ja: "車",
  "zh-CN": "自驾",
  "zh-TW": "自駕",
};
const BUS_LABEL: Record<PageLocale, string> = {
  ko: "버스",
  en: "Bus",
  ja: "バス",
  "zh-CN": "巴士",
  "zh-TW": "巴士",
};
const RAIL_LABEL: Record<PageLocale, string> = {
  ko: "철도",
  en: "Rail",
  ja: "鉄道",
  "zh-CN": "铁路",
  "zh-TW": "鐵路",
};

/** 축 배지 색 — 신규 색 도입 0 · 기존 토큰만. */
function axisBadgeStyle(axis: string): { background: string; color: string } {
  if (axis === "seoul") return { background: "var(--accent)", color: "#ffffff" };
  if (axis === "gyeonggi") return { background: "var(--gold)", color: "#232322" };
  return { background: "var(--charcoal, #232322)", color: "#ffffff" };
}

/** 축 컬러 gradient — 히어로 색면 폴백 (사진 0장). */
function axisGradient(color: string): string {
  return `linear-gradient(135deg, ${color} 0%, ${color}CC 100%)`;
}

/** intro / access 등 원문을 문단(빈 줄 기준) 단위로 나누고, 문단 내 개행은 공백으로. */
function splitParagraphs(text: string): string[] {
  return text
    .split(/\n{2,}/)
    .map((para) => para.replace(/\n/g, " ").trim())
    .filter((para) => para.length > 0);
}

/**
 * course.access 를 카드 하단 bullet 리스트용으로 분리.
 * · 문장 단위 (마침표 · 개행)로 자름 · 원문 그대로 · 문안 창작 없음.
 */
function splitAccessSentences(access: string | undefined): string[] {
  if (!access) return [];
  return access
    .split(/\n+|(?<=[.。])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

/** transport 문자열 한 줄 → 카드 데이터로 파싱. */
function parseTransportLine(
  line: string,
  locale: PageLocale
): { icon: TransportIconKey; title: string; body: string } {
  const trimmed = line.trim();
  let icon: TransportIconKey = "Train";
  if (/GTX/i.test(trimmed)) icon = "Zap";
  else if (/버스/.test(trimmed) || /bus/i.test(trimmed)) icon = "Bus";
  else if (/호선|경의중앙선|경의선|지하철|철도|rail|line/i.test(trimmed)) icon = "Train";
  else if (/차량|자가용|자동차|승용차|택시/.test(trimmed) || /car|drive/i.test(trimmed)) icon = "Car";

  // "차량 — ..." · "철도 — ..." 등 em-dash 로 라벨 분리.
  const emIdx = trimmed.indexOf("—");
  if (emIdx > 0) {
    const rawTitle = trimmed.slice(0, emIdx).trim();
    const body = trimmed.slice(emIdx + 1).trim();
    // 원문 그대로 축약 없이 사용.
    return { icon, title: rawTitle, body };
  }

  // "3호선 대곡역 → ..." 처럼 라벨이 문두 단어인 케이스: 첫 단어를 title 로.
  const spaceIdx = trimmed.indexOf(" ");
  if (spaceIdx > 0) {
    return {
      icon,
      title: trimmed.slice(0, spaceIdx).trim(),
      body: trimmed.slice(spaceIdx + 1).trim(),
    };
  }

  // 축별 fallback 라벨 (본문이 짧아 라벨-바디 분리 불가한 케이스).
  const fallbackTitle =
    icon === "Bus"
      ? BUS_LABEL[locale]
      : icon === "Car"
        ? CAR_LABEL[locale]
        : icon === "Train"
          ? RAIL_LABEL[locale]
          : "GTX";
  return { icon, title: fallbackTitle, body: trimmed };
}

/**
 * course.transport 를 1~2개 카드 데이터로 파싱.
 * · 개행(\n) 으로 나뉘어 여러 이동수단이 병기된 경우 각각 카드 1개.
 * · 본문 원문 그대로 · 문안 창작 0.
 */
function parseTransportCards(
  transport: string | undefined,
  locale: PageLocale
): Array<{ icon: TransportIconKey; title: string; body: string }> {
  if (!transport) return [];
  const lines = transport
    .split(/\n+/)
    .map((s) => s.trim())
    .filter(Boolean);
  return lines.map((line) => parseTransportLine(line, locale));
}

export async function getDayTripDetailMetadata(
  id: string,
  locale: PageLocale
): Promise<Metadata> {
  const course = await loadDayTrip(id);
  if (!course) return { title: "당일코스" };
  return {
    title: course.name,
    description: course.hookLine ?? course.hook,
    alternates: { canonical: `/${locale}/products/day-trips/${id}` },
  };
}

export default async function DayTripDetailPage({
  id,
  locale = "ko",
}: {
  id: string;
  locale?: PageLocale;
}) {
  const course = await loadDayTrip(id);
  if (!course) notFound();
  const axis = getAxisBlock(course.axis);
  const displayName = locale === "ko" || !course.nameEn ? course.name : course.nameEn;
  const hookText = course.hookLine ?? course.hook;

  // 타임라인 스팟 링크 유효성 (죽은 링크 금지)
  const timeline = course.timeline ?? [];
  const timelineLinkability = await Promise.all(
    timeline.map(async (n) => (n.spotSlug ? await hasSpotAsync(n.spotSlug) : false))
  );

  // 스팟 카드용 — timeline의 spotSlug 존재하는 것만
  const spotCards = timeline
    .map((n, i) => ({ node: n, linkable: timelineLinkability[i] }))
    .filter((x) => x.linkable && x.node.spotSlug);

  // 같은 축 다른 코스 3개
  const allCourses = await loadDayTrips();
  const related = allCourses
    .filter((c) => c.axis === course.axis && c.id !== course.id)
    .slice(0, 3);

  const badgeStyle = axisBadgeStyle(course.axis);
  const axisEn = AXIS_BADGE_EN[course.axis] ?? course.axis.toUpperCase();

  // 오더 #C61 [1] — 히어로 사진 자동 수집 (timeline 스팟 gallery 폴백).
  // 오더 #C68 [1]-C — course.heroImages (사장님 업로드) 우선, 없으면 자동 수집.
  //   3장은 대형1+소형2 콜라주로, 2장/1장은 축소된 콜라주, 0장은 축 색면 폴백.
  const heroPhotos = await getCoursePhotos(course, { limit: 3 });
  const heroImgs = (course.heroImages?.length ? course.heroImages : heroPhotos).slice(0, 3);
  const hasHero = heroImgs.length > 0;

  // 오더 #C61 [2] — Breadcrumb 항목 (Home > Day Trips > Axis > Course)
  const breadcrumbAxisLabel = AXIS_LABEL_LOCALIZED[course.axis][locale];

  // 오더 #C61 [3] — 「가는 법」 카드. transport 원문에서 파싱.
  //   · 서울축: 3호선 카드 (grid-cols-1) · GTX 언급 시 2칸 (grid-cols-2)
  //   · 파주축: 개행(\n) 여부에 따라 1~2칸
  //   · 경기축: 차량 전용 카드 1개
  const transportCards = parseTransportCards(course.transport, locale);
  const gtxMentioned =
    /GTX/i.test(course.access ?? "") ||
    /GTX/i.test(course.overview?.transport ?? "") ||
    /GTX/i.test(course.transport ?? "");
  const accessBullets = splitAccessSentences(course.access);
  const introParagraphs = splitParagraphs(course.intro ?? "");
  const accessFallbackParagraphs = course.access ? [] : splitParagraphs(course.transport ?? "");

  // 오더 #C68 [1]-C: 대형 이미지 위에만 얹는 오버레이 (breadcrumb + 배지 + 제목 + 스팟 + 후크).
  //   색면 폴백/1장/2장/3장 모든 케이스에서 재사용.
  const overlayContent = (
    <div className="absolute inset-0 flex flex-col justify-between px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      {/* 상단: Breadcrumb */}
      <nav
        aria-label="breadcrumb"
        className="flex flex-wrap items-center gap-1.5 text-xs sm:text-sm"
      >
        <Link
          href="/"
          locale={locale}
          className="text-white/90 underline-offset-4 hover:underline"
        >
          {BREADCRUMB_HOME[locale]}
        </Link>
        <span aria-hidden="true" className="text-white/60">›</span>
        <Link
          href="/products"
          locale={locale}
          className="text-white/90 underline-offset-4 hover:underline"
        >
          {BREADCRUMB_DAYTRIPS[locale]}
        </Link>
        <span aria-hidden="true" className="text-white/60">›</span>
        <Link
          href="/products"
          locale={locale}
          className="text-white/90 underline-offset-4 hover:underline"
        >
          {breadcrumbAxisLabel}
        </Link>
        <span aria-hidden="true" className="text-white/60">›</span>
        <span aria-current="page" className="text-white">{displayName}</span>
      </nav>
      {/* 하단: 배지 · 제목 · 스팟 · 후크 */}
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <span
            className="inline-flex items-center rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em]"
            style={badgeStyle}
          >
            {axisEn}
          </span>
          <span
            className="inline-flex items-center rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em]"
            style={{ background: "#faf7f2", color: "#232322" }}
          >
            {course.durationBadge}
          </span>
        </div>
        <h1 className="mt-3 text-2xl font-black leading-tight tracking-[-0.03em] text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)] sm:text-3xl lg:text-4xl">
          {displayName}
        </h1>
        {course.stops.length > 0 && (
          <p className="mt-2 text-xs text-white/85 drop-shadow-[0_1px_4px_rgba(0,0,0,0.3)] sm:text-sm">
            {course.stops.map((s) => s.name).join(" · ")}
          </p>
        )}
        <p className="mt-2 max-w-[720px] text-sm leading-[1.6] text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.3)] sm:text-base">
          {hookText}
        </p>
      </div>
    </div>
  );

  return (
    <Shell>
      <article className="bg-white text-[#232322]">
        {/* ① 히어로 — 항상 렌더. 사진 유무·장수에 따라 색면/1장/2장/3장 콜라주.
             오더 #C68 [1]-C: 대형1+소형2 콜라주. 오버레이는 대형 위에만. */}
        <section className="relative w-full overflow-hidden bg-white">
          <div className="relative mx-auto h-[300px] w-full max-w-7xl overflow-hidden sm:h-[360px] lg:h-[420px]">
            {!hasHero && (
              <>
                <div
                  aria-hidden="true"
                  className="absolute inset-0"
                  style={{ background: axisGradient(axis.color) }}
                />
                {overlayContent}
              </>
            )}
            {hasHero && heroImgs.length === 1 && (
              <>
                <Image
                  src={heroImgs[0]}
                  alt={displayName}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 1280px"
                  className="object-cover"
                  priority
                />
                <div aria-hidden="true" className="absolute inset-0 bg-black/40" />
                {overlayContent}
              </>
            )}
            {hasHero && heroImgs.length === 2 && (
              <div className="absolute inset-0 grid grid-cols-1 grid-rows-[3fr_2fr] gap-1 lg:grid-cols-3 lg:grid-rows-1">
                <div className="relative overflow-hidden lg:col-span-2">
                  <Image
                    src={heroImgs[0]}
                    alt={displayName}
                    fill
                    sizes="(max-width: 1024px) 100vw, 853px"
                    className="object-cover"
                    priority
                  />
                  <div aria-hidden="true" className="absolute inset-0 bg-black/40" />
                  {overlayContent}
                </div>
                <div className="relative overflow-hidden">
                  <Image
                    src={heroImgs[1]}
                    alt=""
                    fill
                    sizes="(max-width: 1024px) 100vw, 427px"
                    className="object-cover"
                  />
                  <div aria-hidden="true" className="absolute inset-0 bg-black/20" />
                </div>
              </div>
            )}
            {hasHero && heroImgs.length === 3 && (
              <div className="absolute inset-0 grid grid-cols-2 grid-rows-[3fr_2fr] gap-1 lg:grid-cols-3 lg:grid-rows-2">
                <div className="relative overflow-hidden col-span-2 lg:col-span-2 lg:row-span-2">
                  <Image
                    src={heroImgs[0]}
                    alt={displayName}
                    fill
                    sizes="(max-width: 1024px) 100vw, 853px"
                    className="object-cover"
                    priority
                  />
                  <div aria-hidden="true" className="absolute inset-0 bg-black/40" />
                  {overlayContent}
                </div>
                <div className="relative overflow-hidden">
                  <Image
                    src={heroImgs[1]}
                    alt=""
                    fill
                    sizes="(max-width: 1024px) 50vw, 427px"
                    className="object-cover"
                  />
                  <div aria-hidden="true" className="absolute inset-0 bg-black/20" />
                </div>
                <div className="relative overflow-hidden">
                  <Image
                    src={heroImgs[2]}
                    alt=""
                    fill
                    sizes="(max-width: 1024px) 50vw, 427px"
                    className="object-cover"
                  />
                  <div aria-hidden="true" className="absolute inset-0 bg-black/20" />
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ② Overview 4칸 (없으면 숨김) — 흰색 */}
        {course.overview && hasAnyOverview(course.overview) && (
          <section className="bg-white">
            <div className="mx-auto max-w-[720px] px-4 py-8 sm:px-6 md:py-10">
              <h2 className="text-sm font-black uppercase tracking-[0.16em] text-slate-500">
                {OVERVIEW_LABEL[locale]}
              </h2>
              <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
                {course.overview.totalDuration && (
                  <OverviewCell
                    label={OVERVIEW_ITEM_LABELS[locale].totalDuration}
                    value={course.overview.totalDuration}
                  />
                )}
                {course.overview.transport && (
                  <OverviewCell
                    label={OVERVIEW_ITEM_LABELS[locale].transport}
                    value={course.overview.transport}
                  />
                )}
                {course.overview.recommendedTime && (
                  <OverviewCell
                    label={OVERVIEW_ITEM_LABELS[locale].recommendedTime}
                    value={course.overview.recommendedTime}
                  />
                )}
                {course.overview.recommendedFor && (
                  <OverviewCell
                    label={OVERVIEW_ITEM_LABELS[locale].recommendedFor}
                    value={course.overview.recommendedFor}
                  />
                )}
              </dl>
            </div>
          </section>
        )}

        {/* ③ 가는 법 — 2칸 카드 + 지도 축소 · 흰색 */}
        <section className="bg-white">
          <div className="mx-auto max-w-[720px] px-4 py-8 sm:px-6 md:py-10">
            <h2 className="text-xl font-black leading-tight tracking-[-0.02em] text-[#232322] sm:text-2xl">
              {ACCESS_LABEL[locale]}
            </h2>
            {transportCards.length > 0 && (
              <div
                className={
                  "mt-6 grid gap-3 " +
                  (transportCards.length > 1 || gtxMentioned
                    ? "grid-cols-1 md:grid-cols-2"
                    : "grid-cols-1")
                }
              >
                {transportCards.map((card, i) => {
                  const Icon = TRANSPORT_ICONS[card.icon];
                  return (
                    <div
                      key={`${card.title}-${i}`}
                      className="rounded-2xl border border-slate-200 bg-white p-5"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          aria-hidden="true"
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full"
                          style={{ background: `${axis.color}1A`, color: axis.color }}
                        >
                          <Icon className="h-5 w-5" />
                        </span>
                        <span className="text-base font-black text-[#232322]">
                          {card.title}
                        </span>
                      </div>
                      {card.body && (
                        <p className="mt-3 text-sm leading-[1.6] text-[#232322]">
                          {card.body}
                        </p>
                      )}
                      {course.duration && (
                        <p className="mt-2 text-xs text-slate-500">{course.duration}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
            {(accessBullets.length > 0 || accessFallbackParagraphs.length > 0) && (
              <ul className="mt-4 space-y-2">
                {(accessBullets.length > 0 ? accessBullets : accessFallbackParagraphs).map(
                  (line, i) => (
                    <li
                      key={i}
                      className="flex gap-2 text-sm leading-[1.7] text-[#232322]"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{ background: axis.color }}
                      />
                      <span>{line}</span>
                    </li>
                  )
                )}
              </ul>
            )}
            {/* 대곡역 축소 지도 — 클릭 시 /dmc/move */}
            <div className="mt-6">
              <Link
                href="/dmc/move"
                locale={locale}
                className="group block overflow-hidden rounded-2xl border border-slate-200 bg-white"
              >
                <Image
                  src={`/images/transit/daegok-access-map-${locale}.svg`}
                  alt={ACCESS_MAP_LINK[locale]}
                  width={720}
                  height={480}
                  className="h-auto w-full transition group-hover:opacity-90"
                />
              </Link>
              <div className="mt-2">
                <Link
                  href="/dmc/move"
                  locale={locale}
                  className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--accent)] underline-offset-4 hover:underline"
                >
                  {ACCESS_MAP_LINK[locale]} <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ④ 타임라인 (핵심) — 없으면 숨김 · 흰색 */}
        {timeline.length > 0 && (
          <section className="bg-white">
            <div className="mx-auto max-w-[720px] px-4 py-8 sm:px-6 md:py-10">
              <h2 className="text-xl font-black leading-tight tracking-[-0.02em] text-[#232322] sm:text-2xl">
                {TIMELINE_LABEL[locale]}
              </h2>
              <ol className="relative mt-6">
                {timeline.map((node, i) => {
                  const isLast = i === timeline.length - 1;
                  const linkable = timelineLinkability[i];
                  return (
                    <li key={`${node.spotName}-${i}`} className="relative pb-8 last:pb-0">
                      {/* 좌측 세로선 */}
                      {!isLast && (
                        <span
                          aria-hidden="true"
                          className="absolute left-[11px] top-6 h-full w-px"
                          style={{ background: axis.color, opacity: 0.35 }}
                        />
                      )}
                      {/* 원형 노드 (색=축) */}
                      <span
                        aria-hidden="true"
                        className="absolute left-0 top-1 inline-block h-6 w-6 rounded-full ring-4 ring-white"
                        style={{ background: axis.color }}
                      />
                      <div className="pl-10">
                        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                          {node.time && (
                            <span className="text-sm font-black text-[#232322]">{node.time}</span>
                          )}
                          {linkable && node.spotSlug ? (
                            <Link
                              href={`/dmc/${node.spotSlug}`}
                              locale={locale}
                              className="text-base font-bold text-[#232322] underline-offset-4 hover:underline sm:text-lg"
                            >
                              {node.spotName}
                            </Link>
                          ) : (
                            <span className="text-base font-bold text-[#232322] sm:text-lg">
                              {node.spotName}
                            </span>
                          )}
                          {node.duration && (
                            <span className="text-sm text-slate-500">{node.duration}</span>
                          )}
                        </div>
                        {node.note && (
                          <p className="mt-1 text-sm leading-[1.7] text-slate-700">{node.note}</p>
                        )}
                        {node.transportToNext && (
                          <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                            <span
                              aria-hidden="true"
                              className="inline-block h-4 w-px border-l border-dashed"
                              style={{ borderColor: axis.color, opacity: 0.6 }}
                            />
                            <span>↓ {node.transportToNext}</span>
                          </div>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          </section>
        )}

        {/* ⑤ About + 좌측 라인 일러스트 — 아이보리 · 문단 단위 분리 */}
        <section className="bg-[#faf7f2]">
          <div className="mx-auto max-w-[720px] px-4 py-8 sm:px-6 md:py-10">
            <h2 className="text-xl font-black leading-tight tracking-[-0.02em] text-[#232322] sm:text-2xl">
              {ABOUT_LABEL[locale]}
            </h2>
            <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-start">
              {course.illustrationKey && (
                <div className="shrink-0">
                  <Image
                    src={`/images/illustrations/${course.illustrationKey}.svg`}
                    alt=""
                    width={200}
                    height={200}
                    className="h-auto w-32 sm:w-40 md:w-48"
                  />
                </div>
              )}
              <div className="max-w-[680px]">
                {introParagraphs.length > 0
                  ? introParagraphs.map((para, i) => (
                      <p
                        key={i}
                        className="mt-3 text-base leading-[1.7] text-[#232322] first:mt-0"
                      >
                        {para}
                      </p>
                    ))
                  : (
                      <p className="text-base leading-[1.7] text-[#232322]">
                        {(course.intro ?? "").replace(/\n/g, " ")}
                      </p>
                    )}
              </div>
            </div>
          </div>
        </section>

        {/* ⑥ 이 코스가 좋은 이유 (없으면 숨김) — 아이보리 */}
        {course.whyGood && course.whyGood.length > 0 && (
          <section className="bg-[#faf7f2]">
            <div className="mx-auto max-w-[720px] px-4 py-8 sm:px-6 md:py-10">
              <h2 className="text-xl font-black leading-tight tracking-[-0.02em] text-[#232322] sm:text-2xl">
                {WHY_LABEL[locale]}
              </h2>
              <ul className="mt-6 space-y-3">
                {course.whyGood.map((line, i) => (
                  <li
                    key={i}
                    className="flex gap-3 text-base leading-[1.7] text-[#232322]"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-2 inline-block h-2 w-2 shrink-0 rounded-full"
                      style={{ background: axis.color }}
                    />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* ⑦ 스팟 카드 — 스팟 상세 있는 것만 · 흰색 */}
        {spotCards.length > 0 && (
          <section className="bg-white">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:py-10">
              <h2 className="text-xl font-black leading-tight tracking-[-0.02em] text-[#232322] sm:text-2xl">
                {STOPS_LABEL[locale]}
              </h2>
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                {spotCards.map(({ node }, i) => (
                  <Link
                    key={`${node.spotSlug}-${i}`}
                    href={`/dmc/${node.spotSlug}`}
                    locale={locale}
                    className="group block overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:border-[var(--accent)]"
                  >
                    <div
                      aria-hidden="true"
                      className="h-32 w-full"
                      style={{
                        background: `linear-gradient(135deg, ${axis.color} 0%, ${axis.color}CC 100%)`,
                      }}
                    />
                    <div className="p-4">
                      <div className="text-base font-bold text-[#232322] group-hover:text-[var(--accent)]">
                        {node.spotName}
                      </div>
                      {node.note && (
                        <p className="mt-1 line-clamp-2 text-sm text-slate-600">{node.note}</p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ⑧ FAQ — 없으면 블록 자체 숨김 · 아이보리 */}
        {course.faq && course.faq.length > 0 && (
          <section className="bg-[#faf7f2]">
            <div className="mx-auto max-w-[720px] px-4 py-8 sm:px-6 md:py-10">
              <h2 className="text-xl font-black leading-tight tracking-[-0.02em] text-[#232322] sm:text-2xl">
                {FAQ_LABEL[locale]}
              </h2>
              <dl className="mt-6 space-y-4">
                {course.faq.slice(0, 4).map((item, i) => (
                  <div
                    key={i}
                    className="rounded-2xl border border-slate-200 bg-white p-5"
                  >
                    <dt className="text-base font-bold text-[#232322]">Q. {item.q}</dt>
                    <dd className="mt-2 whitespace-pre-line text-sm leading-[1.7] text-slate-700">
                      {item.a}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>
        )}

        {/* ⑨ 같은 축 다른 코스 3개 — 흰색 */}
        {related.length > 0 && (
          <section className="bg-white">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:py-10">
              <h2 className="text-xl font-black leading-tight tracking-[-0.02em] text-[#232322] sm:text-2xl">
                {RELATED_LABEL[locale]}
              </h2>
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                {related.map((rel) => (
                  <RelatedCard
                    key={rel.id}
                    course={rel}
                    locale={locale}
                    axisColor={axis.color}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ⑩ 하단 sticky CTA — 스크롤 80% 이후에만 노출 (client) */}
        <DayTripStickyCta
          href="/best/stay"
          label={CTA_BUTTON[locale]}
          introText={CTA_INTRO[locale](course.durationBadge)}
        />

        {/* 하단 여백 (sticky 뒤에 남는 스크롤 공간) */}
        <div className="h-4" />
      </article>
    </Shell>
  );
}

function hasAnyOverview(o: NonNullable<DayTripCourse["overview"]>): boolean {
  return Boolean(o.totalDuration || o.transport || o.recommendedTime || o.recommendedFor);
}

function OverviewCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
        {label}
      </dt>
      <dd className="mt-2 text-sm font-bold leading-[1.5] text-[#232322] sm:text-base">
        {value}
      </dd>
    </div>
  );
}

function RelatedCard({
  course,
  locale,
  axisColor,
}: {
  course: DayTripCourse;
  locale: PageLocale;
  axisColor: string;
}) {
  const name = locale === "ko" || !course.nameEn ? course.name : course.nameEn;
  const hook = course.hookLine ?? course.hook;
  return (
    <Link
      href={`/products/day-trips/${course.id}`}
      locale={locale}
      className="group block overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:border-[var(--accent)]"
    >
      <div
        aria-hidden="true"
        className="h-32 w-full"
        style={{
          background: `linear-gradient(135deg, ${axisColor} 0%, ${axisColor}CC 100%)`,
        }}
      />
      <div className="p-4">
        <div className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
          {course.durationBadge}
        </div>
        <div className="mt-1 text-base font-bold text-[#232322] group-hover:text-[var(--accent)]">
          {name}
        </div>
        <p className="mt-1 line-clamp-2 text-sm text-slate-600">{hook}</p>
      </div>
    </Link>
  );
}
