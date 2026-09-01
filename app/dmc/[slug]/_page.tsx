// /[locale]/dmc/[slug] — 장소 상세 폼 (오더 #B1).
//
// 데이터 원본: spot-detail-data.md.
// 화면 구성 (원문 「화면 구성」 1~7):
//   1. 갤러리 (대형1+소형3 데스크톱 / 대형1+가로스크롤 모바일)
//   2. 카테고리 라벨 (소형, 골드)
//   3. 제목 — 한글 대 + 영문 소
//   4. 위치 한 줄 — 지역 · 최근접역 도보 N분
//   5. 정보 소개 고지 (회색 소형, 한 줄)
//   6. 탭 — 개요 | 위치 (?tab= URL 동기화, 클라이언트 컴포넌트)
//        개요: 아이콘 4칸 + 카테고리 일러스트 + About + 인사이더 박스 + 광고
//        위치: 지도 + ACCESS 4칸 + 한국어 원문 카드
//   7. NEARBY — 같은 카테고리 spot 3
//
// 렌더 규칙 (원문 렌더 규칙 1~12) 전부 준수. 판매·예약 UI 신설 금지.
// generateStaticParams 는 빈 배열 (spots 0건, notFound 방어).

import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Clock, Hourglass, Ticket, Accessibility, MapPin } from "lucide-react";

import { CategoryIllustration } from "@/components/dmc/CategoryIllustration";
import { KoCopyButton } from "@/components/dmc/KoCopyButton";
import { SpotDetailTabs } from "@/components/dmc/SpotDetailTabs";
import Shell from "@/components/layout/Shell";
import {
  CATEGORY_LABEL,
  isCuratedCategory,
} from "@/data/curated-categories";
import {
  getNearbySpots,
  getSpot,
  spots,
  SPOT_LOCALES,
  type Spot,
  type SpotAccessPoint,
  type SpotInfoAccess,
  type SpotInfoAdmission,
  type SpotInfoDuration,
  type SpotInfoHours,
  type SpotLocale,
} from "@/data/spots";
import { Link } from "@/lib/navigation";

export type PageLocale = SpotLocale;

function toLocale(v: string): PageLocale {
  return SPOT_LOCALES.includes(v as PageLocale) ? (v as PageLocale) : "ko";
}

// ─── 5로케일 상수 (spot-detail-data.md 원문 그대로) ─────────────────────────

const NOTICE: Record<PageLocale, string> = {
  ko: "이 페이지는 정보 소개이며 예약·판매를 하지 않습니다. 이용은 각 사업자에게 직접 문의하세요.",
  en: "This page is for information only. We do not take bookings or sell anything — please contact the business directly.",
  ja: "このページは情報提供のみで、予約・販売は行いません。ご利用は各事業者に直接お問い合わせください。",
  "zh-CN": "本页面仅提供信息介绍，不进行预订或销售。使用请直接联系相关商家。",
  "zh-TW": "本頁面僅提供資訊介紹，不進行預訂或銷售。使用請直接聯繫相關商家。",
};

const LABEL_ABOUT: Record<PageLocale, string> = {
  ko: "소개", en: "About", ja: "紹介", "zh-CN": "介绍", "zh-TW": "介紹",
};
const LABEL_MAP_CTA: Record<PageLocale, string> = {
  ko: "지도에서 보기", en: "View on map", ja: "地図で見る",
  "zh-CN": "在地图上查看", "zh-TW": "在地圖上查看",
};
const LABEL_OFFICIAL: Record<PageLocale, string> = {
  ko: "공식 사이트", en: "Official site", ja: "公式サイト",
  "zh-CN": "官方网站", "zh-TW": "官方網站",
};
const LABEL_NEARBY: Record<PageLocale, string> = {
  ko: "이 근처에서", en: "Nearby", ja: "この近くで",
  "zh-CN": "附近", "zh-TW": "附近",
};
const LABEL_AD: Record<PageLocale, string> = {
  ko: "광고", en: "Advertisement", ja: "広告",
  "zh-CN": "广告", "zh-TW": "廣告",
};
const LABEL_DRIVER: Record<PageLocale, string> = {
  ko: "기사님께 보여주세요",
  en: "Show this to the driver",
  ja: "運転手にお見せください",
  "zh-CN": "请出示给司机",
  "zh-TW": "請出示給司機",
};
const LABEL_COPY: Record<PageLocale, string> = {
  ko: "복사", en: "Copy", ja: "コピー", "zh-CN": "复制", "zh-TW": "複製",
};
const LABEL_COPIED: Record<PageLocale, string> = {
  ko: "복사됨", en: "Copied", ja: "コピーしました",
  "zh-CN": "已复制", "zh-TW": "已複製",
};
const LABEL_COMING_SOON: Record<PageLocale, string> = {
  ko: "곧 이 자리에서 만나요",
  en: "Coming soon",
  ja: "まもなく公開します",
  "zh-CN": "敬请期待",
  "zh-TW": "敬請期待",
};

const TAB_LABEL: Record<PageLocale, { overview: string; location: string }> = {
  ko: { overview: "개요", location: "위치" },
  en: { overview: "Overview", location: "Location" },
  ja: { overview: "概要", location: "場所" },
  "zh-CN": { overview: "概览", location: "位置" },
  "zh-TW": { overview: "概覽", location: "位置" },
};

// GOYANG INSIDERS — 5로케일 공통 영문 (spec).
const INSIDERS_LABEL = "GOYANG INSIDERS";

// BEST 배지 — 5로케일 공통 한국어 + 영문 병기 (spec).
const BEST_BADGE = "GOYANG BEST 선정 · GOYANG BEST Selected";

// 정보 아이콘 4칸 라벨 (spec)
const INFO_LABEL_HOURS: Record<PageLocale, string> = {
  ko: "운영 시간", en: "Hours", ja: "営業時間", "zh-CN": "开放时间", "zh-TW": "開放時間",
};
const INFO_LABEL_DURATION: Record<PageLocale, string> = {
  ko: "소요 시간", en: "Duration", ja: "所要時間", "zh-CN": "所需时间", "zh-TW": "所需時間",
};
const INFO_LABEL_ADMISSION: Record<PageLocale, string> = {
  ko: "입장료", en: "Admission", ja: "入場料", "zh-CN": "门票", "zh-TW": "門票",
};
const INFO_LABEL_ACCESS: Record<PageLocale, string> = {
  ko: "접근성", en: "Accessibility", ja: "アクセシビリティ",
  "zh-CN": "无障碍", "zh-TW": "無障礙",
};

// 열거형 값 → 5로케일 라벨 (spec 원문 그대로)
const ENUM_HOURS: Record<SpotInfoHours, Record<PageLocale, string>> = {
  always: { ko: "연중무휴", en: "Open year-round", ja: "年中無休", "zh-CN": "全年开放", "zh-TW": "全年開放" },
  varies: { ko: "시설별 상이", en: "Varies by facility", ja: "施設により異なる", "zh-CN": "因设施而异", "zh-TW": "因設施而異" },
  seasonal: { ko: "계절별 운영", en: "Seasonal hours", ja: "季節により変動", "zh-CN": "季节性开放", "zh-TW": "季節性開放" },
  inquiry: { ko: "현장 확인", en: "Check on site", ja: "現地でご確認", "zh-CN": "请现场确认", "zh-TW": "請現場確認" },
};
const ENUM_DURATION: Record<SpotInfoDuration, Record<PageLocale, string>> = {
  "30min": { ko: "30분", en: "30 min", ja: "30分", "zh-CN": "30分钟", "zh-TW": "30分鐘" },
  "1h": { ko: "1시간", en: "1 hour", ja: "1時間", "zh-CN": "1小时", "zh-TW": "1小時" },
  "1_2h": { ko: "1~2시간", en: "1–2 hours", ja: "1〜2時間", "zh-CN": "1～2小时", "zh-TW": "1～2小時" },
  half_day: { ko: "반나절", en: "Half day", ja: "半日", "zh-CN": "半天", "zh-TW": "半天" },
  full_day: { ko: "하루", en: "Full day", ja: "1日", "zh-CN": "一天", "zh-TW": "一天" },
};
const ENUM_ADMISSION: Record<SpotInfoAdmission, Record<PageLocale, string>> = {
  free: { ko: "무료", en: "Free", ja: "無料", "zh-CN": "免费", "zh-TW": "免費" },
  paid: { ko: "유료", en: "Paid", ja: "有料", "zh-CN": "收费", "zh-TW": "收費" },
  varies: { ko: "시설별 상이", en: "Varies by facility", ja: "施設により異なる", "zh-CN": "因设施而异", "zh-TW": "因設施而異" },
  inquiry: { ko: "현장 확인", en: "Check on site", ja: "現地でご確認", "zh-CN": "请现场确认", "zh-TW": "請現場確認" },
};
const ENUM_ACCESS: Record<SpotInfoAccess, Record<PageLocale, string>> = {
  wheelchair: { ko: "휠체어 가능", en: "Wheelchair accessible", ja: "車椅子可", "zh-CN": "轮椅可通行", "zh-TW": "輪椅可通行" },
  partial: { ko: "일부 구간 가능", en: "Partially accessible", ja: "一部区間のみ可", "zh-CN": "部分区域可通行", "zh-TW": "部分區域可通行" },
  inquiry: { ko: "현장 확인", en: "Check on site", ja: "現地でご確認", "zh-CN": "请现场确认", "zh-TW": "請現場確認" },
};

// ACCESS 4칸 (spec: GTX 킨텍스역 · 3호선 대화역 · 서울역 · 인천공항)
const ACCESS_HUBS: ReadonlyArray<{
  key: string;
  label: Record<PageLocale, string>;
}> = [
  { key: "gtx-kintex", label: { ko: "GTX 킨텍스역", en: "GTX Kintex Stn.", ja: "GTX キンテックス駅", "zh-CN": "GTX 韩国国际展览中心站", "zh-TW": "GTX 韓國國際展覽中心站" } },
  { key: "daehwa", label: { ko: "3호선 대화역", en: "Daehwa Stn. (Line 3)", ja: "3号線 大化駅", "zh-CN": "3号线 大化站", "zh-TW": "3號線 大化站" } },
  { key: "seoul", label: { ko: "서울역", en: "Seoul Stn.", ja: "ソウル駅", "zh-CN": "首尔站", "zh-TW": "首爾站" } },
  { key: "incheon-airport", label: { ko: "인천공항", en: "Incheon Airport", ja: "仁川空港", "zh-CN": "仁川机场", "zh-TW": "仁川機場" } },
];

const DASH = "—";

// ─── metadata / staticParams ────────────────────────────────────────────────

export async function generateSpotDetailMetadata(
  slug: string,
  locale: PageLocale
): Promise<Metadata> {
  const spot = getSpot(slug);
  if (!spot) return { title: "" };
  return {
    title: `${spot.title[locale]} — ${
      isCuratedCategory(spot.category) ? CATEGORY_LABEL[locale][spot.category] : spot.category
    }`,
    description: spot.lead[locale],
    alternates: {
      canonical: `/${locale}/dmc/${slug}`,
    },
  };
}

// 오더 #C1 [2]: spots 배열에서 5로케일 × slug 정적 파라미터 파생.
//   spots 가 0건이면 빈 배열 (notFound 방어 유지, dynamicParams=true 로 지연 렌더).
export function generateSpotDetailStaticParams(): Array<{
  locale: PageLocale;
  slug: string;
}> {
  const params: Array<{ locale: PageLocale; slug: string }> = [];
  for (const spot of spots) {
    for (const locale of SPOT_LOCALES) {
      params.push({ locale, slug: spot.slug });
    }
  }
  return params;
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

  return (
    <Shell>
      <article className="bg-white text-[#232322]">
        <Gallery images={spot.gallery ?? []} title={spot.title[locale]} />

        <section className="mx-auto max-w-6xl px-6 pt-10">
          <CategoryLabel category={spot.category} locale={locale} />
          <TitleBlock spot={spot} locale={locale} />
          <LocationLine spot={spot} locale={locale} />
          <p className="mt-6 text-xs leading-relaxed text-[#232322]/55">
            {NOTICE[locale]}
          </p>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-16">
          <Suspense fallback={null}>
            <SpotDetailTabs
              labels={TAB_LABEL[locale]}
              overview={<OverviewTab spot={spot} locale={locale} />}
              location={<LocationTab spot={spot} locale={locale} />}
            />
          </Suspense>
        </section>

        <NearbySection spot={spot} locale={locale} />
      </article>
    </Shell>
  );
}

// ─── 1. 갤러리 ──────────────────────────────────────────────────────────────

function Gallery({
  images,
  title,
}: {
  images: NonNullable<Spot["gallery"]>;
  title: string;
}) {
  const n = images.length;
  if (n === 0) return null; // 렌더 규칙 3

  if (n === 1) {
    return (
      <section className="relative aspect-[16/9] max-h-[600px] w-full bg-[#232322]">
        <Image src={images[0].url} alt={title} fill className="object-cover" sizes="100vw" priority />
      </section>
    );
  }

  if (n === 2 || n === 3) {
    return (
      <section className={`grid gap-2 ${n === 2 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 sm:grid-cols-3"}`}>
        {images.map((img, i) => (
          <div key={i} className="relative aspect-[4/3] w-full bg-[#232322]">
            <Image src={img.url} alt={title} fill className="object-cover" sizes="(max-width: 640px) 100vw, 33vw" priority={i === 0} />
          </div>
        ))}
      </section>
    );
  }

  // n >= 4 → 대형1 + 소형3 (데스크톱). 모바일: 대형1 + 3장 가로 스크롤.
  const [hero, ...rest] = images;
  const smalls = rest.slice(0, 3);
  return (
    <section>
      {/* Desktop: 4-column × 3-row grid, hero 대형(col-span-3 row-span-3), 소형 3장 우측 세로 */}
      <div className="hidden sm:grid sm:grid-cols-4 sm:grid-rows-3 sm:gap-2">
        <div className="relative aspect-auto bg-[#232322] sm:col-span-3 sm:row-span-3">
          <Image src={hero.url} alt={title} fill className="object-cover" sizes="66vw" priority />
        </div>
        {smalls.map((img, i) => (
          <div key={i} className="relative bg-[#232322]">
            <Image src={img.url} alt={title} fill className="object-cover" sizes="33vw" />
          </div>
        ))}
      </div>
      {/* Mobile: 대형1 + 소형 가로 스크롤 */}
      <div className="sm:hidden">
        <div className="relative aspect-[16/9] w-full bg-[#232322]">
          <Image src={hero.url} alt={title} fill className="object-cover" sizes="100vw" priority />
        </div>
        <div className="mt-2 flex gap-2 overflow-x-auto">
          {smalls.map((img, i) => (
            <div key={i} className="relative aspect-[4/3] w-40 shrink-0 bg-[#232322]">
              <Image src={img.url} alt={title} fill className="object-cover" sizes="160px" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── 2. 카테고리 라벨 · 3. 제목 · 4. 위치 한 줄 ─────────────────────────────

function CategoryLabel({ category, locale }: { category: Spot["category"]; locale: PageLocale }) {
  const label = isCuratedCategory(category) ? CATEGORY_LABEL[locale][category] : category;
  return (
    <div className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#D4AF37]">
      {label}
    </div>
  );
}

function TitleBlock({ spot, locale }: { spot: Spot; locale: PageLocale }) {
  return (
    <div className="mt-4">
      <h1 className="text-3xl font-black leading-tight tracking-[-0.03em] sm:text-5xl">
        {spot.title[locale]}
      </h1>
      {spot.title_en_display && (
        <p className="mt-2 text-sm font-bold uppercase tracking-[0.18em] text-[#232322]/60">
          {spot.title_en_display}
        </p>
      )}
    </div>
  );
}

function LocationLine({ spot, locale }: { spot: Spot; locale: PageLocale }) {
  const parts: string[] = [];
  if (spot.region) parts.push(spot.region);
  if (spot.nearest_station) {
    // 오더 #C4 [3]: name 은 5로케일 스왑. walk_min null 이면 시간 미표시.
    const stationName = spot.nearest_station.name[locale];
    const walkMin = spot.nearest_station.walk_min;
    parts.push(
      walkMin != null
        ? `${stationName} ${walkMin}${walkMinSuffix(locale)}`
        : stationName,
    );
  }
  if (parts.length === 0) return null;
  return (
    <p className="mt-4 text-sm text-[#232322]/70">{parts.join(" · ")}</p>
  );
}

function walkMinSuffix(locale: PageLocale): string {
  switch (locale) {
    case "en": return " min walk";
    case "ja": return "分";
    case "zh-CN": return "分钟";
    case "zh-TW": return "分鐘";
    case "ko":
    default:
      return "분";
  }
}

// ─── 개요 탭 ────────────────────────────────────────────────────────────────

function OverviewTab({ spot, locale }: { spot: Spot; locale: PageLocale }) {
  const insiderNode = <InsiderBox spot={spot} locale={locale} />;
  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-14">
      <div className="space-y-10 lg:col-span-2">
        <InfoQuad spot={spot} locale={locale} />
        {/* 모바일: 인사이더 박스를 아이콘 4칸 바로 아래 (오더 렌더 규칙 11) */}
        <div className="lg:hidden">{insiderNode}</div>
        <AboutBlock spot={spot} locale={locale} />
        {/* 모바일: 광고를 본문 중간에 (오더 렌더 규칙 11) */}
        {spot.adSlot !== null && (
          <div className="lg:hidden">
            <AdSlot locale={locale} />
          </div>
        )}
      </div>
      <aside className="space-y-6 lg:col-span-1">
        <div className="hidden lg:block">{insiderNode}</div>
        {spot.adSlot !== null && (
          <div className="hidden lg:block">
            <AdSlot locale={locale} />
          </div>
        )}
      </aside>
    </div>
  );
}

function InfoQuad({ spot, locale }: { spot: Spot; locale: PageLocale }) {
  // 렌더 규칙 4: 값 없어도 칸 유지, "—" 표시.
  const cells = [
    {
      icon: Clock,
      label: INFO_LABEL_HOURS[locale],
      value: spot.info?.hours ? ENUM_HOURS[spot.info.hours][locale] : DASH,
    },
    {
      icon: Hourglass,
      label: INFO_LABEL_DURATION[locale],
      value: spot.info?.duration ? ENUM_DURATION[spot.info.duration][locale] : DASH,
    },
    {
      icon: Ticket,
      label: INFO_LABEL_ADMISSION[locale],
      value: spot.info?.admission ? ENUM_ADMISSION[spot.info.admission][locale] : DASH,
    },
    {
      icon: Accessibility,
      label: INFO_LABEL_ACCESS[locale],
      value: spot.info?.access ? ENUM_ACCESS[spot.info.access][locale] : DASH,
    },
  ];
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {cells.map(({ icon: Icon, label, value }) => (
        <div key={label} className="flex items-start gap-3 border border-[#232322]/15 p-4">
          <Icon className="mt-0.5 h-5 w-5 shrink-0 text-[#D4AF37]" aria-hidden="true" />
          <div className="min-w-0">
            <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#232322]/60">
              {label}
            </div>
            <div className="mt-1 text-sm font-semibold">{value}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function AboutBlock({ spot, locale }: { spot: Spot; locale: PageLocale }) {
  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
        <CategoryIllustration
          category={spot.category}
          className="h-16 w-16 shrink-0"
        />
        <div className="min-w-0">
          <div className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#D4AF37]">
            {LABEL_ABOUT[locale]}
          </div>
          <p className="mt-3 whitespace-pre-line text-base leading-relaxed text-[#232322]/85 sm:text-lg">
            {spot.lead[locale]}
          </p>
        </div>
      </div>
      {/* 오더 #C4 [4]: sections 2개(걷는 길·언제 가면 좋은가)를 소개 아래에
          heading + body 로 순차 렌더. 이전에는 AboutBlock 이 lead 만 표시하고
          sections 를 어디서도 렌더하지 않아 화면에 안 나왔었다. */}
      {spot.sections.map((section, i) => (
        <div key={i} className="border-t border-[#232322]/10 pt-8">
          <h3 className="text-lg font-black leading-snug tracking-[-0.02em] sm:text-xl">
            {section.heading[locale]}
          </h3>
          <p className="mt-3 whitespace-pre-line text-base leading-relaxed text-[#232322]/85">
            {section.body[locale]}
          </p>
        </div>
      ))}
    </div>
  );
}

function InsiderBox({ spot, locale }: { spot: Spot; locale: PageLocale }) {
  const highlights = (spot.highlights ?? []).slice(0, 3); // 렌더 규칙 5
  const hasInsider = !!spot.insider;
  const mapHref = spot.ko_card?.[0]
    ? `https://map.kakao.com/?q=${encodeURIComponent(spot.ko_card[0].name_ko)}`
    : null;
  return (
    <div className="space-y-4 border border-[#232322]/15 p-6">
      <div className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#D4AF37]">
        {INSIDERS_LABEL}
      </div>
      {hasInsider && spot.insider && (
        <>
          <div className="text-xs font-bold uppercase tracking-[0.18em] text-[#232322]/70">
            {spot.insider.role[locale]}
          </div>
          <blockquote className="text-lg font-black leading-snug tracking-[-0.02em]">
            “{spot.insider.quote[locale]}”
          </blockquote>
        </>
      )}
      {highlights.length > 0 && (
        <ul className="space-y-2">
          {highlights.map((h, i) => (
            <li key={i} className="border-l-2 border-[#D4AF37] pl-3 text-sm leading-snug text-[#232322]/85">
              {h[locale]}
            </li>
          ))}
        </ul>
      )}
      <div className="flex flex-wrap gap-2 pt-2">
        {mapHref && (
          <a
            href={mapHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 border border-[#232322] px-4 py-2 text-xs font-bold text-[#232322] transition-colors hover:border-[#D4AF37] hover:text-[#D4AF37]"
          >
            <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
            {LABEL_MAP_CTA[locale]}
          </a>
        )}
        {spot.official_url && (
          <a
            href={spot.official_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block border border-[#232322] px-4 py-2 text-xs font-bold text-[#232322] transition-colors hover:border-[#D4AF37] hover:text-[#D4AF37]"
          >
            {LABEL_OFFICIAL[locale]}
          </a>
        )}
      </div>
      {spot.best_selected && (
        <div className="inline-block bg-[#D4AF37] px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-[#232322]">
          {BEST_BADGE}
        </div>
      )}
    </div>
  );
}

function AdSlot({ locale }: { locale: PageLocale }) {
  // 렌더 규칙 7: spot.adSlot === null 이면 상위 컴포넌트에서 이 함수 호출 안 함.
  return (
    <div className="border border-dashed border-[#232322]/15 p-6">
      <div className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#232322]/50">
        {LABEL_AD[locale]}
      </div>
      <div className="mt-2 min-h-[120px]" data-ad-slot="dmc-spot-detail" aria-hidden="true" />
    </div>
  );
}

// ─── 위치 탭 ────────────────────────────────────────────────────────────────

function LocationTab({ spot, locale }: { spot: Spot; locale: PageLocale }) {
  const mapPointName = spot.ko_card?.[0]?.name_ko;
  const mapHref = mapPointName
    ? `https://map.kakao.com/?q=${encodeURIComponent(mapPointName)}`
    : null;
  return (
    <div className="space-y-12">
      {/* 지도 — 정적 카드 + 카카오 지도 외부 링크 (구현 단순화 : SDK 미도입) */}
      {mapHref && (
        <div className="border border-[#232322]/15 p-6">
          <div className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#D4AF37]">
            {LABEL_MAP_CTA[locale]}
          </div>
          <a
            href={mapHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 border border-[#232322] px-4 py-2 text-sm font-bold text-[#232322] transition-colors hover:border-[#D4AF37] hover:text-[#D4AF37]"
          >
            <MapPin className="h-4 w-4" aria-hidden="true" />
            {LABEL_MAP_CTA[locale]}
          </a>
        </div>
      )}
      <AccessQuad access={spot.access ?? []} locale={locale} />
      <KoCardBlock spot={spot} locale={locale} />
    </div>
  );
}

function AccessQuad({
  access,
  locale,
}: {
  access: SpotAccessPoint[];
  locale: PageLocale;
}) {
  // ACCESS 4칸 고정 (spec). spot.access 에서 매칭되는 hub 의 minutes/mode 를 채움.
  const byFrom = new Map(access.map((a) => [a.from, a] as const));
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {ACCESS_HUBS.map((h) => {
        const match = byFrom.get(h.key === "gtx-kintex" ? "GTX 킨텍스역" : h.key === "daehwa" ? "3호선 대화역" : h.key === "seoul" ? "서울역" : null!);
        return (
          <div key={h.key} className="border border-[#232322]/15 p-4">
            <div className="text-sm font-black">{h.label[locale]}</div>
            <div className="mt-1 text-xs text-[#232322]/70">
              {/* 오더 #C1 [3]: minutes null → 시간·모드 미표시, 역 이름만 (label). */}
              {match
                ? match.minutes != null
                  ? `${match.mode} · ${match.minutes}${walkMinSuffix(locale)}`
                  : null
                : DASH}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function KoCardBlock({ spot, locale }: { spot: Spot; locale: PageLocale }) {
  const first = spot.ko_card?.[0];
  if (!first) return null;
  const combined = `${first.name_ko}\n${first.address_ko}`;
  return (
    <div className="border border-[#232322]/20 p-6 sm:p-8">
      <div className="flex items-start justify-between gap-4">
        <div className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#D4AF37]">
          {LABEL_DRIVER[locale]}
        </div>
        <KoCopyButton
          text={combined}
          label={LABEL_COPY[locale]}
          copiedLabel={LABEL_COPIED[locale]}
        />
      </div>
      <p className="mt-4 text-xl font-black leading-tight sm:text-2xl">
        {first.name_ko}
      </p>
      <p className="mt-1 text-sm text-[#232322]/70">{first.address_ko}</p>
    </div>
  );
}

// ─── 7. NEARBY ──────────────────────────────────────────────────────────────

function NearbySection({ spot, locale }: { spot: Spot; locale: PageLocale }) {
  const nearby = getNearbySpots(spot.slug);
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#D4AF37]">
        {LABEL_NEARBY[locale]}
      </div>
      {nearby.length === 0 ? (
        <p className="mt-4 text-base text-[#232322]/60">
          {LABEL_COMING_SOON[locale]}
        </p>
      ) : (
        <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {nearby.map((n) => (
            <li key={n.slug}>
              <Link
                href={`/dmc/${n.slug}`}
                className="block border border-[#232322]/15 p-5 transition-colors hover:border-[#D4AF37]"
              >
                <div className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#D4AF37]">
                  {isCuratedCategory(n.category) ? CATEGORY_LABEL[locale][n.category] : n.category}
                </div>
                <p className="mt-2 text-lg font-black leading-tight tracking-[-0.02em]">
                  {n.title[locale]}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
