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
import { Clock, Hourglass, Ticket, Accessibility, MapPin, Tv, Clapperboard, Footprints, BookOpen, Compass, Shirt, Music, AlertTriangle, Phone, UtensilsCrossed, Coffee, Moon, Route, ExternalLink } from "lucide-react";

import { CategoryIllustration } from "@/components/dmc/CategoryIllustration";
import { KoCopyButton } from "@/components/dmc/KoCopyButton";
import Shell from "@/components/layout/Shell";
import {
  CATEGORY_LABEL,
  isCuratedCategory,
} from "@/data/curated-categories";
import {
  getNearbySpots,
  getSpot,
  hasSpot,
  spots,
  SPOT_LOCALES,
  type Spot,
  type SpotAccessPoint,
  type SpotGalleryImage,
  type SpotInfoAccess,
  type SpotInfoAdmission,
  type SpotInfoDuration,
  type SpotInfoHours,
  type SpotLocale,
} from "@/data/spots";
import { Link } from "@/lib/navigation";
import { resolveSpotGallery } from "@/lib/spot-photos";

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
// 오더 #V1 [2]: Location 섹션 라벨 (단일 스크롤 재구성).
const LABEL_LOCATION: Record<PageLocale, string> = {
  ko: "위치", en: "Location", ja: "場所", "zh-CN": "位置", "zh-TW": "位置",
};
const LABEL_PHONE: Record<PageLocale, string> = {
  ko: "전화", en: "Phone", ja: "電話", "zh-CN": "电话", "zh-TW": "電話",
};
const LABEL_ADDRESS: Record<PageLocale, string> = {
  ko: "주소", en: "Address", ja: "住所", "zh-CN": "地址", "zh-TW": "地址",
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

// ─── 오더 #E1: THE STORY · 한복 · 공지 라벨 (5로케일) ──────────────────────
const STORY_TITLE = "THE STORY";
// 한복 안내 카드 헤더.
const HANBOK_TITLE: Record<PageLocale, string> = {
  ko: "한복 무료입장", en: "Free Entry in Hanbok", ja: "韓服無料入場", "zh-CN": "着韩服免费入场", "zh-TW": "著韓服免費入場",
};
const HANBOK_CAUTION_LABEL: Record<PageLocale, string> = {
  ko: "주의", en: "Notes", ja: "注意", "zh-CN": "注意事项", "zh-TW": "注意事項",
};
// 공지 배너 헤더.
const NOTICE_LABEL: Record<PageLocale, string> = {
  ko: "안내", en: "Notice", ja: "お知らせ", "zh-CN": "公告", "zh-TW": "公告",
};

// ─── 오더 #C9: FIND YOUR WALK 섹션 라벨 (5로케일) ───────────────────────────
const WALKS_TITLE = "FIND YOUR WALK";
const WALKS_SUBTITLE: Record<PageLocale, string> = {
  ko: "다섯 가지 산책 중에서 오늘의 산책을 고르세요",
  en: "Five walks. Pick the one that fits today.",
  ja: "五つの散歩から、今日の一つを選んでください",
  "zh-CN": "五种散步方式，选一个属于今天的",
  "zh-TW": "五種散步方式，選一個屬於今天的",
};

// ─── 오더 #D4: ON SCREEN 섹션 라벨 (5로케일) ────────────────────────────────
// ON SCREEN 은 섹션 제목으로 5로케일 공통 영문 (spec).
const ON_SCREEN_TITLE = "ON SCREEN";
const ON_SCREEN_SUBTITLE: Record<PageLocale, string> = {
  ko: "드라마와 영화에서 본 그 사람들이 실제로 잠든 곳",
  en: "The people you saw on screen actually rest here",
  ja: "ドラマや映画で見たあの人たちが実際に眠る場所",
  "zh-CN": "剧中与影片里见过的人物，真实长眠于此",
  "zh-TW": "劇中與影片裡見過的人物，真實長眠於此",
};
// 오더 #D4 [4]: open:false 항목 필수 병기 문구.
const ON_SCREEN_CLOSED: Record<PageLocale, string> = {
  ko: "현재 비공개 구역입니다",
  en: "This area is currently closed to visitors",
  ja: "現在非公開区域です",
  "zh-CN": "该区域目前不对外开放",
  "zh-TW": "該區域目前不對外開放",
};
const ON_SCREEN_COURSE_LABEL: Record<PageLocale, string> = {
  ko: "걸어서 도는 코스",
  en: "Walking route",
  ja: "歩いて回るコース",
  "zh-CN": "步行路线",
  "zh-TW": "步行路線",
};

// 오더 #D3 [4] 판정 4: 이미지 저작권 크레딧 5로케일. cpyrht 값 기반 자동 표시.
//   Type1 (공공누리 1유형, 자유이용) / Type3 (공공누리 3유형, 원본유지).
const CREDIT_LABEL: Record<"Type1" | "Type3", Record<PageLocale, string>> = {
  Type1: {
    ko: "출처: 한국관광공사 (공공누리 제1유형)",
    en: "Source: Korea Tourism Organization (KOGL Type 1)",
    ja: "出典: 韓国観光公社（KOGL 第1類型）",
    "zh-CN": "来源: 韩国观光公社（KOGL 第1类型）",
    "zh-TW": "來源: 韓國觀光公社（KOGL 第1類型）",
  },
  Type3: {
    ko: "출처: 한국관광공사 (공공누리 제3유형·원본유지)",
    en: "Source: Korea Tourism Organization (KOGL Type 3 · No modification)",
    ja: "出典: 韓国観光公社（KOGL 第3類型・原本維持）",
    "zh-CN": "来源: 韩国观光公社（KOGL 第3类型·原本保持）",
    "zh-TW": "來源: 韓國觀光公社（KOGL 第3類型·原本維持）",
  },
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

  const insiderNode = <InsiderBox spot={spot} locale={locale} />;
  return (
    <Shell>
      <article className="bg-white text-[#232322]">
        {/* 1. 갤러리 — 대형1+소형3 (n≥4) / 그리드 (n=2·3) / 단일 (n=1). */}
        <Gallery
          images={resolveSpotGallery(spot.gallery, spot.slug, spot.title.ko)}
          title={spot.title[locale]}
          locale={locale}
        />

        {/* 오더 #E1 [4]: 공지 배너 — 갤러리 바로 아래. 없으면 미렌더. */}
        <NoticeBanner spot={spot} locale={locale} />

        {/* 2. 제목 · 지역 · 최근접역 (풀폭 헤더) */}
        <section className="mx-auto max-w-6xl px-6 pt-10">
          <CategoryLabel category={spot.category} locale={locale} />
          <TitleBlock spot={spot} locale={locale} />
          <LocationLine spot={spot} locale={locale} />
          <p className="mt-6 text-xs leading-relaxed text-[#232322]/55">
            {NOTICE[locale]}
          </p>
        </section>

        {/* 오더 #V1 [2]: 탭 → 단일 스크롤. lg+ 에서 좌 본문 + 우 사이드바.
             모바일은 세로 연속. 값 없는 섹션은 각 컴포넌트 내부에서 렌더 스킵. */}
        <section className="mx-auto max-w-6xl px-6 pt-10 pb-16">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-14">
            <div className="space-y-12 lg:col-span-2">
              {/* 3. Location — 지도 + 주소 + 전화 */}
              <LocationSection spot={spot} locale={locale} />

              {/* 4. About — 일러스트 + 본문 좌우 */}
              <AboutBlock spot={spot} locale={locale} />

              {/* 5. 운영시간 (InfoQuad 4칸 안에 hours 포함) */}
              <InfoQuad spot={spot} locale={locale} />

              {/* 모바일: 인사이더 박스를 본문 중간에 (사이드바가 밑으로 밀리는 상황 방지) */}
              <div className="lg:hidden">{insiderNode}</div>

              {/* 기존 오버레이 섹션 유지 (값 있을 때만 렌더). */}
              <WalksSection spot={spot} locale={locale} />
              <StorySection spot={spot} locale={locale} />
              <OnScreenSection spot={spot} locale={locale} />
              {/* 오더 #C20 [1]: FOOD HUB — foodHub 값 있을 때만 렌더 (밤리단길 전용). */}
              <FoodHubSection spot={spot} locale={locale} />
              <AroundSection spot={spot} locale={locale} />
              <HanbokSection spot={spot} locale={locale} />
              <PartnerCta spot={spot} locale={locale} />

              {/* 6. 한국어 원문 카드 (외국인용, 복사 버튼) */}
              <KoCardBlock spot={spot} locale={locale} />

              {/* 모바일: 광고 본문 하단 */}
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
        </section>

        {/* 7. NEARBY — 페이지 하단 풀폭 */}
        <NearbySection spot={spot} locale={locale} />
      </article>
    </Shell>
  );
}

// ─── 1. 갤러리 ──────────────────────────────────────────────────────────────
//
// 오더 #D3 [4] 판정 1: Type1/Type3 렌더 분기.
//   · Type1 (+ cpyrht 미설정) — 크롭 그리드로 배치.
//   · Type3 — 원본 비율(object-contain) 단독 배치. 크롭·필터 금지.
//   · 각 이미지 하단에 크레딧 (cpyrht 이 있으면 5로케일 매핑, 없으면 credit 필드).

function resolveCredit(img: SpotGalleryImage, locale: PageLocale): string | null {
  if (img.cpyrht) return CREDIT_LABEL[img.cpyrht][locale];
  return img.credit ?? null;
}

function Caption({ text }: { text: string | null }) {
  if (!text) return null;
  return (
    <p className="mt-1 px-2 text-[11px] leading-relaxed text-[#232322]/55">{text}</p>
  );
}

function Gallery({
  images,
  title,
  locale,
}: {
  images: NonNullable<Spot["gallery"]>;
  title: string;
  locale: PageLocale;
}) {
  // 오더 #D3 [1] 판정 1: Type3 는 카드/그리드에서 분리, 상세에서만 원본 비율 단독.
  const cropable = images.filter((im) => im.cpyrht !== "Type3");
  const originalOnly = images.filter((im) => im.cpyrht === "Type3");

  if (images.length === 0) return null;

  return (
    <section>
      {cropable.length > 0 && <GalleryCrop images={cropable} title={title} locale={locale} />}
      {originalOnly.length > 0 && (
        <div className="mx-auto max-w-6xl px-6 py-8 space-y-8">
          {originalOnly.map((img, i) => (
            <figure key={i}>
              {/* Type3: object-contain, 크롭/필터/오버레이 금지. */}
              <div className="relative w-full bg-[#232322]/5">
                <Image
                  src={img.url}
                  alt={title}
                  width={1600}
                  height={1067}
                  className="mx-auto h-auto w-full object-contain"
                  sizes="(max-width: 1024px) 100vw, 1024px"
                />
              </div>
              <Caption text={resolveCredit(img, locale)} />
            </figure>
          ))}
        </div>
      )}
    </section>
  );
}

/** Type1 (또는 cpyrht 미지정) 이미지들을 크롭 그리드로 배치. */
function GalleryCrop({
  images,
  title,
  locale,
}: {
  images: SpotGalleryImage[];
  title: string;
  locale: PageLocale;
}) {
  const n = images.length;

  if (n === 1) {
    const img = images[0];
    return (
      <>
        <div className="relative aspect-[16/9] max-h-[600px] w-full bg-[#232322]">
          <Image src={img.url} alt={title} fill className="object-cover" sizes="100vw" priority />
        </div>
        <div className="mx-auto max-w-6xl px-6">
          <Caption text={resolveCredit(img, locale)} />
        </div>
      </>
    );
  }

  if (n === 2 || n === 3) {
    return (
      <div className={`grid gap-2 ${n === 2 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 sm:grid-cols-3"}`}>
        {images.map((img, i) => (
          <figure key={i}>
            <div className="relative aspect-[4/3] w-full bg-[#232322]">
              <Image src={img.url} alt={title} fill className="object-cover" sizes="(max-width: 640px) 100vw, 33vw" priority={i === 0} />
            </div>
            <Caption text={resolveCredit(img, locale)} />
          </figure>
        ))}
      </div>
    );
  }

  // n >= 4 → 대형1 + 소형3 (데스크톱). 모바일: 대형1 + 3장 가로 스크롤.
  const [hero, ...rest] = images;
  const smalls = rest.slice(0, 3);
  return (
    <>
      {/* Desktop */}
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
      {/* Mobile */}
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
      <div className="mx-auto max-w-6xl px-6">
        <Caption text={resolveCredit(hero, locale)} />
      </div>
    </>
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

// 오더 #V1 [2]: 상세 페이지 세로 스크롤로 재구성 — 탭 제거. SpotDetailPage 본문
// 에서 각 섹션을 직접 배치. (기존 OverviewTab/LocationTab 컴포넌트는 삭제.)

// 오더 #V1 [2]: Location 섹션 — 지도(임베드/링크) + 주소 + 전화.
//   map_embed 있으면 iframe 우선.
//   없고 map[0].lat/lng 있으면 OpenStreetMap 임베드 자동 생성.
//   둘 다 없으면 지도 CTA(카카오 외부 링크)만.
//   주소/전화도 값 있을 때만 렌더. 아무 것도 없으면 섹션 통째로 스킵.
function LocationSection({ spot, locale }: { spot: Spot; locale: PageLocale }) {
  const first = spot.map?.[0];
  const address = spot.ko_card?.[0]?.address_ko ?? null;
  const phone = spot.phone ?? null;
  const embed = resolveMapEmbed(spot);
  const mapPointName = spot.ko_card?.[0]?.name_ko;
  const mapHref = mapPointName
    ? `https://map.kakao.com/?q=${encodeURIComponent(mapPointName)}`
    : null;
  // 아무 데이터도 없으면 섹션 자체 스킵.
  if (!embed && !mapHref && !address && !phone) return null;
  return (
    <section aria-label={LABEL_LOCATION[locale]}>
      <div className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#D4AF37]">
        {LABEL_LOCATION[locale]}
      </div>
      {embed && (
        <div className="mt-4 border border-[#232322]/15">
          <div className="relative aspect-[16/9] w-full bg-[#232322]/5">
            <iframe
              src={embed}
              title={spot.title[locale]}
              className="absolute inset-0 h-full w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      )}
      {(address || phone || mapHref) && (
        <div className="mt-4 space-y-3 border border-[#232322]/15 p-5">
          {address && (
            <div className="flex items-start gap-3 text-sm text-[#232322]/85">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#D4AF37]" aria-hidden="true" />
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#232322]/55">
                  {LABEL_ADDRESS[locale]}
                </div>
                <div className="mt-0.5">{address}</div>
              </div>
            </div>
          )}
          {phone && (
            <div className="flex items-start gap-3 text-sm text-[#232322]/85">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[#D4AF37]" aria-hidden="true" />
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#232322]/55">
                  {LABEL_PHONE[locale]}
                </div>
                <a href={`tel:${phone}`} className="mt-0.5 block hover:text-[#D4AF37]">
                  {phone}
                </a>
              </div>
            </div>
          )}
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
        </div>
      )}
      {/* Location 섹션 하단에 ACCESS 4칸 (허브별 소요시간). 데이터 없으면 "—". */}
      <div className="mt-6">
        <AccessQuad access={spot.access ?? []} locale={locale} />
      </div>
      {/* first 좌표 참조로 lint no-unused-vars 방지 (이미 embed 에서 사용됨) */}
      {first && null}
    </section>
  );
}

// map_embed 값 있으면 그대로, 없으면 map[0] 좌표로 OSM 임베드 URL 생성.
// 둘 다 없으면 null → iframe 미렌더.
function resolveMapEmbed(spot: Spot): string | null {
  if (spot.map_embed && spot.map_embed.length > 0) return spot.map_embed;
  const m = spot.map?.[0];
  if (!m || typeof m.lat !== "number" || typeof m.lng !== "number") return null;
  const dx = 0.005; // ~500m
  const dy = 0.003;
  const bbox = `${m.lng - dx},${m.lat - dy},${m.lng + dx},${m.lat + dy}`;
  const marker = `${m.lat},${m.lng}`;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${marker}`;
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

// ─── FIND YOUR WALK (오더 #C9 [3][4]) ───────────────────────────────────────
// 상세 페이지 About 아래·ON SCREEN 위. spot.walks 없으면 미렌더.
// 색: 골드 #D4AF37 · 차콜 #232322 (3색 규범).
function WalksSection({ spot, locale }: { spot: Spot; locale: PageLocale }) {
  const walks = spot.walks;
  if (!walks || walks.length === 0) return null;
  return (
    <section className="border-t border-[#232322]/10 pt-8">
      <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.28em] text-[#D4AF37]">
        <Footprints className="h-4 w-4" aria-hidden="true" />
        <span>{WALKS_TITLE}</span>
      </div>
      <p className="mt-2 text-base leading-relaxed text-[#232322]/85 sm:text-lg">
        {WALKS_SUBTITLE[locale]}
      </p>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {walks.map((w) => (
          <article
            key={w.id}
            className="flex flex-col gap-3 border border-[#232322]/15 p-5"
          >
            <div className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#D4AF37]">
              {w.eyebrow}
            </div>
            <h3 className="text-lg font-black leading-snug tracking-[-0.02em]">
              {w.title[locale]}
            </h3>
            <p className="text-sm font-semibold leading-snug text-[#D4AF37]">
              {w.hook[locale]}
            </p>
            <p className="text-sm leading-relaxed text-[#232322]/85">
              {w.body[locale]}
            </p>
            <div className="mt-1 flex items-start gap-1.5 text-xs text-[#232322]/70">
              <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span>{w.stops[locale]}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#232322]/70">
              <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span>{w.bestTime[locale]}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

// ─── ON SCREEN (오더 #D4 [3]) ────────────────────────────────────────────────
// 상세 페이지 About 아래에 배치. spot.onScreen 없으면 미렌더.
// 금지: 포스터·스틸컷·배우 사진·배우명·대사·방송사 로고 (렌더 코드 어디에도 X).
// open:false 항목은 회색·투명도로 시각 구분 + "현재 비공개 구역입니다" 5로케일 병기.
function OnScreenSection({ spot, locale }: { spot: Spot; locale: PageLocale }) {
  const os = spot.onScreen;
  // works·courses 둘 다 비면 섹션 미렌더.
  const hasWorks = !!os?.works && os.works.length > 0;
  const hasCourses = !!os?.courses && os.courses.length > 0;
  if (!os || (!hasWorks && !hasCourses)) return null;
  return (
    <section className="border-t border-[#232322]/10 pt-8">
      <div className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#D4AF37]">
        {ON_SCREEN_TITLE}
      </div>
      {hasWorks && (
        <p className="mt-2 text-base leading-relaxed text-[#232322]/85 sm:text-lg">
          {ON_SCREEN_SUBTITLE[locale]}
        </p>
      )}
      {hasWorks && (
        <ul className="mt-6 space-y-6">
          {os.works.map((w, i) => {
            // 오더 #E1 [1]: music → Music 아이콘.
            const Icon = w.type === "drama" ? Tv : w.type === "film" ? Clapperboard : Music;
            const closed = !w.open;
            // music: broadcaster 대신 artist 표시.
            const meta = w.type === "music"
              ? [w.artist, w.album, w.year].filter(Boolean).join(" · ")
              : `${w.broadcaster ? `${w.broadcaster} · ` : ""}${w.year}`;
            return (
              <li
                key={i}
                className={`border-l-2 pl-4 ${
                  closed
                    ? "border-[#232322]/25 opacity-60"
                    : "border-[#D4AF37]"
                }`}
              >
                <div className="flex items-center gap-2 text-sm font-bold text-[#232322]">
                  <Icon
                    className={`h-4 w-4 shrink-0 ${closed ? "text-[#232322]/50" : "text-[#D4AF37]"}`}
                    aria-hidden="true"
                  />
                  <span>
                    {w.titleKo} / {w.titleEn} · {meta}
                  </span>
                </div>
                <p className="mt-2 text-sm text-[#232322]/85">
                  {w.characters[locale]}
                </p>
                <p className="mt-1 text-sm text-[#232322]/70">
                  → {w.site[locale]}
                </p>
                {w.note && (
                  <p className="mt-1 text-xs text-[#232322]/60">
                    {w.note[locale]}
                  </p>
                )}
                {closed && (
                  <p className="mt-2 text-xs font-semibold text-[#232322]/60">
                    ※ {ON_SCREEN_CLOSED[locale]}
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      )}
      {hasCourses && (
        <div className={`${hasWorks ? "mt-8" : "mt-6"} border border-[#232322]/15 p-5`}>
          <div className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#D4AF37]">
            {ON_SCREEN_COURSE_LABEL[locale]}
          </div>
          <ul className="mt-4 space-y-3">
            {os.courses!.map((c, i) => (
              <li key={i}>
                <div className="text-sm font-black text-[#232322]">
                  {c.name[locale]}
                </div>
                <div className="mt-1 text-sm text-[#232322]/70">
                  {c.stops.map((s) => s[locale]).join(" → ")}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

// ─── 오더 #E1 [3][4][5]: THE STORY 섹션 ────────────────────────────────────
// open:null 챕터는 렌더 X (게이트). open:false 는 회색 + 비공개 문구.
// 금지: 포스터/스틸/배우명/대사/방송사 로고.
function StorySection({ spot, locale }: { spot: Spot; locale: PageLocale }) {
  const stories = spot.stories;
  if (!stories || stories.length === 0) return null;
  // 오더 [5]: open:null 챕터 완전 배제.
  const visible = stories.filter((c) => c.open !== null);
  if (visible.length === 0) return null;
  const header = spot.storiesHeader;
  return (
    <section className="border-t border-[#232322]/10 pt-8">
      <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.28em] text-[#D4AF37]">
        <BookOpen className="h-4 w-4" aria-hidden="true" />
        <span>{STORY_TITLE}</span>
      </div>
      {header && (
        <>
          <h3 className="mt-3 text-xl font-black leading-snug tracking-[-0.02em] sm:text-2xl">
            {header.title[locale]}
          </h3>
          <p className="mt-2 text-base leading-relaxed text-[#232322]/85">
            {header.lead[locale]}
          </p>
        </>
      )}
      <div className="mt-6 space-y-8">
        {visible.map((c, i) => {
          const closed = c.open === false;
          return (
            <article
              key={i}
              className={`border-l-2 pl-4 ${closed ? "border-[#232322]/25 opacity-60" : "border-[#D4AF37]"}`}
            >
              <div className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#D4AF37]">
                {c.eyebrow}
              </div>
              <p className={`mt-1 text-xs font-black uppercase tracking-[0.2em] ${closed ? "text-[#232322]/60" : "text-[#D4AF37]"}`}>
                {c.theme[locale]}
              </p>
              <h4 className="mt-2 text-lg font-black leading-snug tracking-[-0.02em]">
                {c.title[locale]}
              </h4>
              {c.people && (
                <p className="mt-2 text-sm font-semibold text-[#232322]/85">
                  {c.people[locale]}
                </p>
              )}
              <p className="mt-1 text-sm text-[#232322]/70">
                → {c.site[locale]}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-[#232322]/85">
                {c.body[locale]}
              </p>
              {c.onScreen && c.onScreen.length > 0 && (
                <ul className="mt-3 space-y-1">
                  {c.onScreen.map((w, wi) => {
                    const WI = w.type === "drama" ? Tv : w.type === "film" ? Clapperboard : Music;
                    return (
                      <li key={wi} className="flex items-center gap-1.5 text-xs text-[#232322]/70">
                        <WI className="h-3.5 w-3.5 shrink-0 text-[#D4AF37]" aria-hidden="true" />
                        <span>
                          {w.titleKo} / {w.titleEn}
                          {w.broadcaster ? ` · ${w.broadcaster}` : ""} · {w.year}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}
              {c.note && (
                <p className="mt-2 text-xs text-[#232322]/60">
                  {c.note[locale]}
                </p>
              )}
              {closed && (
                <p className="mt-2 text-xs font-semibold text-[#232322]/60">
                  ※ {ON_SCREEN_CLOSED[locale]}
                </p>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}

// ─── 오더 #E1 [3][4]: AROUND (nearby) 섹션 — 전시장에서 걸어서 등. ────────
// ─── FOOD HUB (오더 #C20 [1]) ────────────────────────────────────────────
// 밤리단길 전용 · foodHub 값 있을 때만 렌더 (다른 스팟은 미소비).
//   FOOD 10 + CAFE 8 목록 + NIGHT 야경 스팟 재사용 + COURSES 2h/4h.
//   §5-4 준수 · 개별 F&B 는 spots.ts 스팟 신설 없이 nearby 리스트로.
//   각 항목: 상호명 + 주소 + overview 첫 문장 + 길찾기 CTA (kakao map URL).
//   판매·예약·"예약" 표현 0.
const FOODHUB_LABELS: Record<PageLocale, { food: string; cafe: string; night: string; courses: string; directions: string; homepage: string }> = {
  ko: { food: "FOOD 10", cafe: "CAFE 8", night: "NIGHT", courses: "미식 코스", directions: "길찾기", homepage: "공식 사이트" },
  en: { food: "FOOD 10", cafe: "CAFE 8", night: "NIGHT", courses: "Foodie Courses", directions: "Directions", homepage: "Official site" },
  ja: { food: "FOOD 10", cafe: "CAFE 8", night: "NIGHT", courses: "美食コース", directions: "経路", homepage: "公式サイト" },
  "zh-CN": { food: "FOOD 10", cafe: "CAFE 8", night: "NIGHT", courses: "美食路线", directions: "路线", homepage: "官方网站" },
  "zh-TW": { food: "FOOD 10", cafe: "CAFE 8", night: "NIGHT", courses: "美食路線", directions: "路線", homepage: "官方網站" },
};

function kakaoMapUrl(lat: number, lng: number, name: string): string {
  return `https://map.kakao.com/link/map/${encodeURIComponent(name)},${lat},${lng}`;
}

function FoodHubItemCard({
  item,
  locale,
}: {
  item: import("@/data/spots").SpotFoodHubItem;
  locale: PageLocale;
}) {
  const labels = FOODHUB_LABELS[locale];
  return (
    <li className="flex h-full flex-col gap-2 border border-[#232322]/15 p-4 transition-colors hover:border-[#D4AF37]">
      <p className="text-sm font-black leading-snug text-[#232322]">
        {item.title[locale]}
      </p>
      <p className="text-[11px] leading-relaxed text-[#232322]/55">
        {item.addr_ko}
      </p>
      <p className="text-xs leading-relaxed text-[#232322]/75">
        {item.first_sentence[locale]}
      </p>
      <div className="mt-auto flex flex-wrap gap-2 pt-2 text-[11px] font-bold">
        <a
          href={kakaoMapUrl(item.lat, item.lng, item.title.ko)}
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex items-center gap-1 text-[#D4AF37] hover:underline"
        >
          <MapPin className="h-3 w-3" aria-hidden="true" />
          {labels.directions}
        </a>
        {item.homepage && (
          <a
            href={item.homepage}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-1 text-[#232322]/70 hover:text-[#D4AF37]"
          >
            <ExternalLink className="h-3 w-3" aria-hidden="true" />
            {labels.homepage}
          </a>
        )}
      </div>
    </li>
  );
}

function FoodHubSection({ spot, locale }: { spot: Spot; locale: PageLocale }) {
  const fh = spot.foodHub;
  if (!fh) return null;
  const labels = FOODHUB_LABELS[locale];
  const nightSpots = fh.night
    .map((n) => ({ n, s: getSpot(n.slug) }))
    .filter((x): x is { n: (typeof fh.night)[number]; s: Spot } => x.s !== null);

  // Build a map: id → item title (for course stops label).
  const idToTitle = new Map<string, string>();
  for (const it of [...fh.food, ...fh.cafe]) {
    idToTitle.set(it.id, it.title[locale]);
  }
  // spot slug fallback (course stops may reference existing spot slugs).
  function stopLabel(id: string): string {
    const inHub = idToTitle.get(id);
    if (inHub) return inHub;
    const s = getSpot(id);
    return s ? s.title[locale] : id;
  }

  return (
    <section className="border-t border-[#232322]/10 pt-8">
      <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.28em] text-[#D4AF37]">
        <UtensilsCrossed className="h-4 w-4" aria-hidden="true" />
        <span>FOOD HUB</span>
      </div>
      <h3 className="mt-3 text-xl font-black leading-snug tracking-[-0.02em] sm:text-2xl">
        {fh.headline[locale]}
      </h3>
      <p className="mt-2 text-base leading-relaxed text-[#232322]/85">
        {fh.subhead[locale]}
      </p>

      {/* FOOD 10 */}
      {fh.food.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.24em] text-[#232322]/70">
            <UtensilsCrossed className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{labels.food}</span>
          </div>
          <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {fh.food.map((it) => (
              <FoodHubItemCard key={it.id} item={it} locale={locale} />
            ))}
          </ul>
        </div>
      )}

      {/* CAFE 8 */}
      {fh.cafe.length > 0 && (
        <div className="mt-10">
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.24em] text-[#232322]/70">
            <Coffee className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{labels.cafe}</span>
          </div>
          <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {fh.cafe.map((it) => (
              <FoodHubItemCard key={it.id} item={it} locale={locale} />
            ))}
          </ul>
        </div>
      )}

      {/* NIGHT — 기존 spot 재사용 */}
      {nightSpots.length > 0 && (
        <div className="mt-10">
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.24em] text-[#232322]/70">
            <Moon className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{labels.night}</span>
          </div>
          <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {nightSpots.map(({ n, s }) => (
              <li key={n.slug} className="border border-[#232322]/15 p-4 hover:border-[#D4AF37]">
                <Link href={`/dmc/${n.slug}`} className="group block">
                  <p className="text-sm font-black leading-snug text-[#232322] group-hover:text-[#D4AF37]">
                    {s.title[locale]}
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-[#232322]/70">
                    {n.note[locale]}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* COURSES */}
      {fh.courses.length > 0 && (
        <div className="mt-10">
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.24em] text-[#232322]/70">
            <Route className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{labels.courses}</span>
          </div>
          <div className="mt-4 space-y-6">
            {fh.courses.map((c) => (
              <div key={c.key} className="border border-[#232322]/15 p-5">
                <p className="text-sm font-black text-[#232322]">{c.label[locale]}</p>
                <ol className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#232322]/80">
                  {c.stops.map((s, i) => (
                    <li key={s} className="flex items-center gap-2">
                      <span className="font-semibold">{stopLabel(s)}</span>
                      {i < c.stops.length - 1 && (
                        <span aria-hidden="true" className="text-[#D4AF37]">→</span>
                      )}
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 크레딧 */}
      <p className="mt-8 text-[11px] italic text-[#232322]/55">
        {fh.credit[locale]}
      </p>
    </section>
  );
}

function AroundSection({ spot, locale }: { spot: Spot; locale: PageLocale }) {
  const nb = spot.nearby;
  if (!nb || nb.items.length === 0) return null;
  return (
    <section className="border-t border-[#232322]/10 pt-8">
      <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.28em] text-[#D4AF37]">
        <Compass className="h-4 w-4" aria-hidden="true" />
        <span>{nb.eyebrow}</span>
      </div>
      <h3 className="mt-3 text-xl font-black leading-snug tracking-[-0.02em] sm:text-2xl">
        {nb.title[locale]}
      </h3>
      {nb.lead && (
        <p className="mt-2 text-base leading-relaxed text-[#232322]/85">
          {nb.lead[locale]}
        </p>
      )}
      <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {nb.items.map((it, i) => {
          const inner = (
            <div className="flex h-full flex-col gap-2 border border-[#232322]/15 p-4 transition-colors group-hover:border-[#D4AF37]">
              <div className="flex items-baseline justify-between gap-3">
                <p className="text-sm font-black leading-snug text-[#232322]">
                  {it.name[locale]}
                </p>
                {it.distance && (
                  <span className="shrink-0 text-xs text-[#232322]/60">{it.distance}</span>
                )}
              </div>
              <p className="text-xs leading-relaxed text-[#232322]/70">
                {it.tag[locale]}
              </p>
              {it.note && (
                <p className="text-[11px] leading-relaxed text-[#232322]/55">
                  {it.note[locale]}
                </p>
              )}
            </div>
          );
          return (
            <li key={i}>
              {it.slug && hasSpot(it.slug) ? (
                <Link href={`/dmc/${it.slug}`} className="group block h-full">
                  {inner}
                </Link>
              ) : (
                <div className="group block h-full">{inner}</div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

// ─── 오더 #E1 [3][4]: 한복 안내 카드. ─────────────────────────────────────
function HanbokSection({ spot, locale }: { spot: Spot; locale: PageLocale }) {
  const h = spot.hanbok;
  if (!h) return null;
  return (
    <section className="border-t border-[#232322]/10 pt-8">
      <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.28em] text-[#D4AF37]">
        <Shirt className="h-4 w-4" aria-hidden="true" />
        <span>{HANBOK_TITLE[locale]}</span>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-[#232322]/85">
        {h.note[locale]}
      </p>
      <div className="mt-4 border border-[#232322]/15 p-4">
        <div className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#232322]/60">
          {HANBOK_CAUTION_LABEL[locale]}
        </div>
        <p className="mt-2 text-xs leading-relaxed text-[#232322]/70">
          {h.caution[locale]}
        </p>
      </div>
    </section>
  );
}

// ─── 오더 #E2 [1]: 제휴 CTA — 스팟 하단, /contact 링크. ──────────────────
function PartnerCta({ spot, locale }: { spot: Spot; locale: PageLocale }) {
  const cta = spot.partnerCta;
  if (!cta) return null;
  return (
    <section className="border-t border-[#232322]/10 pt-8">
      <Link
        href="/contact"
        className="inline-flex items-center gap-2 border border-[#D4AF37] px-5 py-3 text-sm font-bold text-[#D4AF37] transition-colors hover:bg-[#D4AF37] hover:text-white"
      >
        {cta[locale]}
      </Link>
    </section>
  );
}

// ─── 오더 #E1 [4]: 공지 배너 — 갤러리 바로 아래. ──────────────────────────
function NoticeBanner({ spot, locale }: { spot: Spot; locale: PageLocale }) {
  const n = spot.notice;
  if (!n) return null;
  return (
    <section className="mx-auto mt-4 max-w-6xl px-6">
      <div className="flex items-start gap-3 border border-[#D4AF37]/40 bg-[#D4AF37]/10 p-4">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#D4AF37]" aria-hidden="true" />
        <div className="min-w-0">
          <div className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#232322]/70">
            {NOTICE_LABEL[locale]}
          </div>
          <p className="mt-1 text-sm leading-relaxed text-[#232322]/85">
            {n.body[locale]}
          </p>
        </div>
      </div>
    </section>
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
  // 오더 #C5: address_ko null 이면 주소 줄 렌더 생략. 복사 텍스트도 이름만.
  const combined = first.address_ko
    ? `${first.name_ko}\n${first.address_ko}`
    : first.name_ko;
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
      {first.address_ko && (
        <p className="mt-1 text-sm text-[#232322]/70">{first.address_ko}</p>
      )}
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
