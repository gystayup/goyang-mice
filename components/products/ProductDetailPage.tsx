"use client";

import Image from "next/image";
import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  MapPinned,
  CalendarDays,
  Clock3,
  Users,
  Tag,
  ChevronDown,
  ChevronUp,
  Share2,
  Heart,
  Star,
  CheckCircle2,
} from "lucide-react";
import { Link } from "@/lib/navigation";
import { useLocale } from "next-intl";
import type { ServiceCatalogItem } from "@/data/service-catalog";
import type { TicketProduct } from "@/data/ticket-booking";
import BookingCalendar from "@/components/products/BookingCalendar";
import type { BookingCalendarProps } from "@/components/products/BookingCalendar";

// ─── i18n ────────────────────────────────────────────────────────────────────
type SupportedLocale = "ko" | "en" | "ja" | "zh-CN" | "zh-TW";

const localeToBCP47: Record<SupportedLocale, string> = {
  ko: "ko-KR",
  en: "en-US",
  ja: "ja-JP",
  "zh-CN": "zh-CN",
  "zh-TW": "zh-TW",
};

const T = {
  // Tab labels
  tabNotice: {
    ko: "공지사항",
    en: "Notice",
    ja: "お知らせ",
    "zh-CN": "公告",
    "zh-TW": "公告",
  },
  tabCasting: {
    ko: "캐스팅",
    en: "Casting",
    ja: "キャスト",
    "zh-CN": "演员表",
    "zh-TW": "演員表",
  },
  tabDetails: {
    ko: "상품상세",
    en: "Details",
    ja: "商品詳細",
    "zh-CN": "商品详情",
    "zh-TW": "商品詳情",
  },
  tabPrice: {
    ko: "가격",
    en: "Price",
    ja: "料金",
    "zh-CN": "价格",
    "zh-TW": "價格",
  },
  tabDiscount: {
    ko: "할인정보",
    en: "Discounts",
    ja: "割引情報",
    "zh-CN": "优惠信息",
    "zh-TW": "優惠資訊",
  },
  tabUsage: {
    ko: "이용안내",
    en: "Usage Info",
    ja: "ご利用案内",
    "zh-CN": "使用须知",
    "zh-TW": "使用須知",
  },
  tabVenue: {
    ko: "장소",
    en: "Venue",
    ja: "会場",
    "zh-CN": "场地",
    "zh-TW": "場地",
  },
  tabCancellation: {
    ko: "취소·환불",
    en: "Cancellation",
    ja: "キャンセル・返金",
    "zh-CN": "取消·退款",
    "zh-TW": "取消·退款",
  },
  // Info labels
  labelLocation: {
    ko: "장소",
    en: "Venue",
    ja: "会場",
    "zh-CN": "地点",
    "zh-TW": "地點",
  },
  labelSchedule: {
    ko: "운영",
    en: "Schedule",
    ja: "スケジュール",
    "zh-CN": "运营",
    "zh-TW": "運營",
  },
  labelDuration: {
    ko: "소요시간",
    en: "Duration",
    ja: "所要時間",
    "zh-CN": "时长",
    "zh-TW": "時長",
  },
  labelAge: {
    ko: "연령",
    en: "Age",
    ja: "年齢",
    "zh-CN": "年龄",
    "zh-TW": "年齡",
  },
  // Misc
  discountSuffix: {
    ko: "할인",
    en: "OFF",
    ja: "割引",
    "zh-CN": "折扣",
    "zh-TW": "折扣",
  },
  reviewsPending: {
    ko: "후기 준비 중",
    en: "Reviews coming soon",
    ja: "レビュー準備中",
    "zh-CN": "评价准备中",
    "zh-TW": "評價準備中",
  },
  meetingPoint: {
    ko: "만남의 장소",
    en: "Meeting Point",
    ja: "集合場所",
    "zh-CN": "集合地点",
    "zh-TW": "集合地點",
  },
  viewOnMap: {
    ko: "지도에서 보기",
    en: "View on Map",
    ja: "地図で見る",
    "zh-CN": "在地图上查看",
    "zh-TW": "在地圖上查看",
  },
  dateTimeSelect: {
    ko: "날짜 및 시간 선택",
    en: "Select Date & Time",
    ja: "日時を選択",
    "zh-CN": "选择日期和时间",
    "zh-TW": "選擇日期和時間",
  },
  change: {
    ko: "변경",
    en: "Change",
    ja: "変更",
    "zh-CN": "更改",
    "zh-TW": "更改",
  },
  ticketsLabel: {
    ko: "매수",
    en: "Tickets",
    ja: "枚数",
    "zh-CN": "张数",
    "zh-TW": "張數",
  },
  personsLabel: {
    ko: "인원",
    en: "Persons",
    ja: "人数",
    "zh-CN": "人数",
    "zh-TW": "人數",
  },
  ticketsUnit: {
    ko: "매",
    en: "ticket(s)",
    ja: "枚",
    "zh-CN": "张",
    "zh-TW": "張",
  },
  personsUnit: {
    ko: "명",
    en: "person(s)",
    ja: "名",
    "zh-CN": "人",
    "zh-TW": "人",
  },
  selected: {
    ko: "선택됨",
    en: "selected",
    ja: "選択済み",
    "zh-CN": "已选择",
    "zh-TW": "已選擇",
  },
  ticketOptions: {
    ko: "티켓 옵션",
    en: "Ticket Options",
    ja: "チケットオプション",
    "zh-CN": "票务选项",
    "zh-TW": "票務選項",
  },
  collapse: {
    ko: "접기",
    en: "Collapse",
    ja: "閉じる",
    "zh-CN": "收起",
    "zh-TW": "收起",
  },
  seeMore: {
    ko: "상세 내용 더보기",
    en: "See More",
    ja: "詳細を見る",
    "zh-CN": "查看更多",
    "zh-TW": "查看更多",
  },
  contentPending: {
    ko: "내용이 준비 중입니다.",
    en: "Content coming soon.",
    ja: "コンテンツ準備中です。",
    "zh-CN": "内容准备中。",
    "zh-TW": "內容準備中。",
  },
  bestPrice: {
    ko: "최저가",
    en: "Best Price",
    ja: "最安値",
    "zh-CN": "最低价",
    "zh-TW": "最低價",
  },
  wonUnit: {
    ko: "원~",
    en: "KRW~",
    ja: "ウォン~",
    "zh-CN": "韩元~",
    "zh-TW": "韓元~",
  },
  inquiry: {
    ko: "예약 문의",
    en: "Inquiry",
    ja: "お問い合わせ",
    "zh-CN": "预约咨询",
    "zh-TW": "預約諮詢",
  },
  bookNow: {
    ko: "예약하기",
    en: "Book Now",
    ja: "予約する",
    "zh-CN": "立即预约",
    "zh-TW": "立即預約",
  },
} satisfies Record<string, Record<SupportedLocale, string>>;

function t(key: keyof typeof T, locale: SupportedLocale): string {
  return T[key][locale] ?? T[key]["ko"];
}

// ─── Types ────────────────────────────────────────────────────────────────────
type DetailItem =
  | { type: "service"; item: ServiceCatalogItem; category: string; categoryLabel: string }
  | { type: "ticket"; item: TicketProduct };

interface ProductDetailPageProps {
  data: DetailItem;
  reservationUrl: string;
  backUrl?: string;
}

// ─── 탭 콘텐츠 렌더러 ────────────────────────────────────────────────────────
function RichContent({ text }: { text: string }) {
  const lines = text.split("\n");

  return (
    <div className="space-y-1">
      {lines.map((line, i) => {
        const trimmed = line.trim();

        // 빈 줄
        if (!trimmed) return <div key={i} className="h-2" />;

        // 숫자 키캡 이모지 헤더: 1️⃣, 2️⃣, ...
        const numberEmojiMatch = trimmed.match(/^([0-9]\uFE0F?\u20E3|🔟)\s*(.*)/);
        if (numberEmojiMatch) {
          const num = numberEmojiMatch[1];
          const rest = numberEmojiMatch[2];
          return (
            <div
              key={i}
              className="group mt-5 flex items-center gap-3 first:mt-0"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-sm font-black text-white shadow-md shadow-slate-900/20">
                {num}
              </span>
              <span className="flex-1 border-b border-dashed border-slate-200 pb-2 text-[15px] font-black tracking-tight text-slate-900">
                {rest}
              </span>
            </div>
          );
        }

        // 섹션 제목: ■, ★, ▶ 또는 큰 이모지로 시작
        const isHeader =
          /^[■★▶◆●◉✅🎤🏟️✨🎫📋⚠️🚌💡🎵🗓️🔖🎁🧾📍🚗🎶📸🎨🍽️🏨🎯🗺️🧭]/.test(trimmed);

        if (isHeader) {
          const emojiMatch = trimmed.match(/^[\p{Emoji}\p{Symbol}■▶★◆●◉]+/u);
          const emoji = emojiMatch ? emojiMatch[0] : "";
          const title = trimmed.slice(emoji.length).trim();

          return (
            <div
              key={i}
              className="group relative mt-6 overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-5 py-4 shadow-lg shadow-slate-900/10 first:mt-0"
            >
              <span className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent" />
              <span className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-gradient-to-br from-sky-400/20 via-fuchsia-400/10 to-transparent blur-2xl" />
              <div className="relative flex items-center gap-3">
                {emoji && (
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-lg ring-1 ring-white/20 backdrop-blur-sm">
                    {emoji}
                  </span>
                )}
                <span className="bg-gradient-to-r from-white via-slate-100 to-white bg-clip-text text-[15px] font-black tracking-tight text-transparent">
                  {title}
                </span>
              </div>
            </div>
          );
        }

        // 경고: ※ 로 시작
        if (/^※/.test(trimmed)) {
          const content = trimmed.slice(1).trim();
          return (
            <div
              key={i}
              className="my-1 flex items-start gap-2.5 rounded-xl border border-amber-200/70 bg-gradient-to-r from-amber-50 to-orange-50/40 px-4 py-2.5 text-[13px] leading-relaxed text-amber-900"
            >
              <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-amber-400 text-[10px] font-black text-white">
                !
              </span>
              <span className="font-medium">{content}</span>
            </div>
          );
        }

        // 화살표 → 로 시작: 하위 설명/포인트
        if (/^[→⇒▸]/.test(trimmed)) {
          const content = trimmed.slice(1).trim();
          return (
            <div
              key={i}
              className="ml-12 flex items-start gap-2 rounded-lg bg-sky-50/60 px-3 py-1.5 text-[13px] leading-relaxed text-slate-700 ring-1 ring-sky-100"
            >
              <span className="mt-1 text-sky-500">→</span>
              <span className="min-w-0 font-medium">{content}</span>
            </div>
          );
        }

        // 라벨 포맷: "키: 값" 패턴 (예: "집결 장소: 원마운트광장")
        if (/^[가-힣\s]+\s*:\s+.+/.test(trimmed) && trimmed.length < 80) {
          const [label, ...rest] = trimmed.split(":");
          const value = rest.join(":").trim();
          return (
            <div
              key={i}
              className="flex items-baseline gap-3 border-b border-slate-100 px-4 py-2.5 last:border-0"
            >
              <span className="shrink-0 text-[12px] font-bold text-slate-400">
                {label.trim()}
              </span>
              <span className="min-w-0 flex-1 text-[13.5px] font-semibold text-slate-800">
                {value}
              </span>
            </div>
          );
        }

        // 리스트: •, -, ·, ▪ 로 시작
        if (/^[•\-·▪]/.test(trimmed)) {
          const content = trimmed.slice(1).trim();
          return (
            <div
              key={i}
              className="group flex items-start gap-3 rounded-lg px-4 py-1.5 text-[13.5px] leading-relaxed text-slate-700 transition hover:bg-slate-50"
            >
              <span className="mt-[9px] h-1 w-3 shrink-0 rounded-full bg-gradient-to-r from-slate-900 to-slate-400 transition group-hover:w-4" />
              <span className="min-w-0">{content}</span>
            </div>
          );
        }

        // 가격/숫자 강조: 숫자+원 포함
        if (/\d{1,3}(,\d{3})+원/.test(trimmed)) {
          return (
            <div
              key={i}
              className="mx-4 my-1 inline-block rounded-lg bg-gradient-to-r from-amber-50 to-yellow-50 px-3 py-1.5 text-[13px] font-bold text-amber-900 ring-1 ring-amber-200/60"
            >
              {trimmed}
            </div>
          );
        }

        // 숏 서브헤더: 짧고 따옴표/대시 없는 단독 라인 (예: "원마운트에서 시작", "호수공원 & 정발산")
        if (trimmed.length < 30 && !trimmed.includes(".")) {
          return (
            <p
              key={i}
              className="ml-12 mt-1 px-2 text-[13px] font-bold uppercase tracking-wide text-slate-500"
            >
              {trimmed}
            </p>
          );
        }

        // 일반 텍스트
        return (
          <p key={i} className="px-4 text-[13.5px] leading-[1.75] text-slate-600">
            {trimmed}
          </p>
        );
      })}
    </div>
  );
}

// ─── 상품상세 세로 스크롤 갤러리 (야놀자 스타일) ──────────────────────────────
function DetailGallery({ images }: { images: string[] }) {
  if (!images || images.length === 0) return null;
  return (
    <div className="mb-6 space-y-1.5 bg-white">
      {images.map((src, i) => (
        <div key={i} className="relative w-full overflow-hidden bg-slate-50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={`상품 이미지 ${i + 1}`}
            className="block h-auto w-full"
            loading="lazy"
          />
        </div>
      ))}
    </div>
  );
}

// ─── 메인 컴포넌트 ────────────────────────────────────────────────────────────
export default function ProductDetailPage({
  data,
  reservationUrl,
  backUrl = "/products",
}: ProductDetailPageProps) {
  const rawLocale = useLocale();
  const locale = (["ko", "en", "ja", "zh-CN", "zh-TW"].includes(rawLocale)
    ? rawLocale
    : "ko") as SupportedLocale;
  const bcp47 = localeToBCP47[locale];

  const item = data.item;
  const isTicket = data.type === "ticket";
  const ticket = isTicket ? (item as TicketProduct) : null;
  const service = !isTicket ? (item as ServiceCatalogItem) : null;

  // 이미지 목록
  const allImages: string[] = [];
  if (item.imageUrl) allImages.push(item.imageUrl);
  if (item.images) allImages.push(...item.images);

  const [currentImg, setCurrentImg] = useState(0);
  const [activeTab, setActiveTab] = useState<string>("details");
  const [detailsExpanded, setDetailsExpanded] = useState(false);
  const [liked, setLiked] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState<{
    date: Date;
    timeSlot: string;
    count: number;
  } | null>(null);

  // ── Booking calendar helpers ──────────────────────────────────────────────
  // Determine category for calendar
  const calendarCategory: BookingCalendarProps["category"] = isTicket
    ? "ticket"
    : (() => {
        const cat = (data as { category?: string }).category ?? "";
        if (cat === "restaurant") return "restaurant";
        if (cat === "cafe") return "cafe";
        return "tour";
      })();

  // Next 3 weekends (Sat) from today for ticket performance dates
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const samplePerformanceDates: Date[] = (() => {
    const dates: Date[] = [];
    const cursor = new Date(today);
    while (dates.length < 6) {
      cursor.setDate(cursor.getDate() + 1);
      if (cursor.getDay() === 6 || cursor.getDay() === 0) {
        // Sat or Sun
        dates.push(new Date(cursor));
      }
    }
    return dates;
  })();

  const prevImg = () => setCurrentImg((p) => (p - 1 + allImages.length) % allImages.length);
  const nextImg = () => setCurrentImg((p) => (p + 1) % allImages.length);

  // 탭 구성
  type TabKey = "notice" | "casting" | "details" | "price" | "discount" | "usage" | "venue" | "cancellation";
  const TAB_LABELS: Record<TabKey, keyof typeof T> = {
    notice: "tabNotice",
    casting: "tabCasting",
    details: "tabDetails",
    price: "tabPrice",
    discount: "tabDiscount",
    usage: "tabUsage",
    venue: "tabVenue",
    cancellation: "tabCancellation",
  };

  const tabs: { key: TabKey; label: string; content?: string }[] = [];
  if (item.tabNotice) tabs.push({ key: "notice", label: t("tabNotice", locale), content: item.tabNotice });
  if (ticket?.tabCasting) tabs.push({ key: "casting", label: t("tabCasting", locale), content: ticket.tabCasting });
  tabs.push({ key: "details", label: t("tabDetails", locale), content: item.tabDetails });
  if (isTicket && ticket?.tabPrice) tabs.push({ key: "price", label: t("tabPrice", locale), content: ticket.tabPrice });
  if (isTicket && ticket?.tabDiscount) tabs.push({ key: "discount", label: t("tabDiscount", locale), content: ticket.tabDiscount });
  if (item.tabUsageInfo) tabs.push({ key: "usage", label: t("tabUsage", locale), content: item.tabUsageInfo });
  if (isTicket && ticket?.tabVenue) tabs.push({ key: "venue", label: t("tabVenue", locale), content: ticket.tabVenue });
  if (item.tabCancellation)
    tabs.push({ key: "cancellation", label: t("tabCancellation", locale), content: item.tabCancellation });

  const activeContent = tabs.find((tab) => tab.key === activeTab)?.content;

  // 가격
  const minPrice = isTicket
    ? ticket!.options.length > 0 ? Math.min(...ticket!.options.map((o) => o.price)) : 0
    : service!.price;
  const originalPrice = !isTicket ? service!.originalPrice : undefined;
  const categoryLabel = isTicket ? ticket!.badge : (data as { categoryLabel: string }).categoryLabel;
  const discountPct =
    originalPrice && minPrice
      ? Math.round((1 - minPrice / originalPrice) * 100)
      : null;

  // 세부 갤러리 이미지 (슬라이더 제외 나머지)
  const galleryImages = item.images ?? [];

  // ── Booking confirmation label ────────────────────────────────────────────
  const countUnitLabel = calendarCategory === "ticket"
    ? t("ticketsUnit", locale)
    : t("personsUnit", locale);
  const countTypeLabel = calendarCategory === "ticket"
    ? t("ticketsLabel", locale)
    : t("personsLabel", locale);

  return (
    <div className="mx-auto max-w-2xl pb-32">
      {/* ── 상단 네비게이션 ── */}
      <div className="sticky top-0 z-20 flex items-center gap-3 bg-white/95 px-4 py-3 backdrop-blur-md">
        <Link
          href={backUrl}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
        >
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <span className="flex-1 truncate text-sm font-bold text-slate-800">{item.title}</span>
        <button
          type="button"
          onClick={() => setLiked((p) => !p)}
          className={`flex h-9 w-9 items-center justify-center rounded-full transition ${
            liked ? "bg-rose-50 text-rose-500" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
          }`}
        >
          <Heart className={`h-5 w-5 ${liked ? "fill-rose-500" : ""}`} />
        </button>
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
        >
          <Share2 className="h-5 w-5" />
        </button>
      </div>

      {/* ── 이미지 슬라이더 ── */}
      <div className="relative w-full overflow-hidden bg-slate-100">
        {allImages.length > 0 ? (
          <>
            {/* 이미지 — 항상 컨테이너 전체 너비, 원본 비율 유지 */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={allImages[currentImg]}
              alt={item.title}
              className="block h-auto w-full transition duration-500"
              loading="eager"
            />
            {/* 그라디언트 오버레이 */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/25 to-transparent" />

            {allImages.length > 1 && (
              <>
                <button
                  onClick={prevImg}
                  className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white backdrop-blur-sm hover:bg-black/50"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={nextImg}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white backdrop-blur-sm hover:bg-black/50"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
                {/* 인디케이터 도트 */}
                <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5">
                  {allImages.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentImg(i)}
                      className={`h-1.5 rounded-full transition-all ${
                        i === currentImg ? "w-5 bg-white" : "w-1.5 bg-white/50"
                      }`}
                    />
                  ))}
                </div>
                <div className="absolute bottom-4 right-4 rounded-full bg-black/40 px-2.5 py-1 text-xs font-bold text-white">
                  {currentImg + 1} / {allImages.length}
                </div>
              </>
            )}
          </>
        ) : (
          <div className={`flex aspect-[4/3] w-full flex-col items-center justify-center bg-gradient-to-br ${item.imageTone} p-8`}>
            <p className="text-5xl font-black tracking-tight text-slate-900 opacity-40">
              {item.posterLabel}
            </p>
          </div>
        )}
      </div>

      {/* ── 상품 기본 정보 — 프리미엄 매거진 스타일 ── */}
      <div className="px-5 pt-6">
        {/* 카테고리 + 할인 배지 */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-sky-50 to-cyan-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-sky-700 ring-1 ring-sky-200/60">
            <span className="h-1 w-1 rounded-full bg-sky-500" />
            {categoryLabel}
          </span>
          {discountPct && (
            <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-white shadow-sm shadow-rose-200">
              {discountPct}% {t("discountSuffix", locale)}
            </span>
          )}
        </div>

        {/* 제목 — 드라마틱한 타이포 */}
        <h1 className="mt-4 text-[1.7rem] font-black leading-[1.15] tracking-[-0.035em] text-slate-950">
          {item.title}
        </h1>
        {(isTicket ? ticket!.subtitle : service!.subtitle) && (
          <p className="mt-2 text-[13px] font-medium leading-relaxed text-slate-500">
            {isTicket ? ticket!.subtitle : service!.subtitle}
          </p>
        )}

        {/* 별점 + 리뷰 — 카드형 */}
        <div className="mt-4 inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 px-3.5 py-1.5 ring-1 ring-amber-200/60">
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
            ))}
          </div>
          <span className="text-sm font-black text-amber-900">5.0</span>
          <span className="h-3 w-px bg-amber-300/60" />
          <span className="text-[11px] font-semibold text-amber-700/80">
            {t("reviewsPending", locale)}
          </span>
        </div>

        {/* 정보 — 미니멀 리스트 스타일 */}
        <div className="mt-5 space-y-2.5 rounded-2xl bg-slate-50/80 px-4 py-3.5 ring-1 ring-slate-100">
          <InfoRow icon={<MapPinned className="h-4 w-4" />} label={t("labelLocation", locale)}>
            {isTicket ? ticket!.venue : service!.location}
          </InfoRow>
          <InfoRow icon={<CalendarDays className="h-4 w-4" />} label={t("labelSchedule", locale)}>
            {isTicket ? ticket!.dateText : service!.dateText}
          </InfoRow>
          {ticket?.duration && (
            <InfoRow icon={<Clock3 className="h-4 w-4" />} label={t("labelDuration", locale)}>
              {ticket.duration}
            </InfoRow>
          )}
          {ticket?.ageLimit && (
            <InfoRow icon={<Users className="h-4 w-4" />} label={t("labelAge", locale)}>
              {ticket.ageLimit}
            </InfoRow>
          )}
        </div>

        {/* 태그 — 세련된 미니멀 */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {item.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-600 transition hover:border-slate-900 hover:text-slate-900"
            >
              <span className="text-slate-400">#</span>
              {tag}
            </span>
          ))}
        </div>

        {/* 가격 — 이미지와 동일한 edge-to-edge 너비 */}
        <div className="-mx-5 mt-5 flex items-end justify-between bg-gradient-to-r from-slate-950 to-slate-800 px-5 py-4">
          <div>
            {originalPrice && (
              <p className="text-xs text-slate-400 line-through">
                ₩{originalPrice.toLocaleString(bcp47)}
              </p>
            )}
            {minPrice > 0 ? (
              <p className="text-2xl font-black text-white">
                <span className="text-sm font-semibold text-slate-300">₩</span>
                {minPrice.toLocaleString(bcp47)}
                <span className="ml-0.5 text-sm font-semibold text-slate-300">
                  {locale === "ko" ? "~" : locale === "ja" ? "〜" : locale === "en" ? "+" : " 起"}
                </span>
              </p>
            ) : (
              <p className="text-xl font-bold text-sky-400">{t("inquiry", locale)}</p>
            )}
          </div>
          {discountPct && (
            <span className="rounded-full bg-rose-500 px-3 py-1.5 text-sm font-black text-white">
              {discountPct}% OFF
            </span>
          )}
        </div>
      </div>

      {/* ── 만남의 장소 (투어/상품에만) ── */}
      {!isTicket && service?.meetingPoint && (
        <div className="mt-5 px-5">
          <h2 className="mb-3 flex items-center gap-2 text-base font-black text-slate-950">
            <span>📍</span> {t("meetingPoint", locale)}
          </h2>
          <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-4 shadow-sm transition hover:shadow-md">
            {/* 장식용 그라데이션 */}
            <span className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br from-sky-100 via-cyan-50 to-transparent blur-2xl" />

            <div className="relative flex items-start gap-3">
              {/* 지도 핀 아이콘 */}
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-900 to-slate-700 text-white shadow-lg shadow-slate-900/20">
                <MapPinned className="h-6 w-6" />
              </div>

              {/* 주요 정보 */}
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                  Meeting Point
                </p>
                <p className="mt-1 text-[15px] font-black leading-snug tracking-tight text-slate-950">
                  {service.meetingPoint}
                </p>
                {service.meetingPointAddress && (
                  <p className="mt-1 text-[12px] font-medium text-slate-500">
                    {service.meetingPointAddress}
                  </p>
                )}
                {service.meetingPointNote && (
                  <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-800 ring-1 ring-amber-200">
                    <Clock3 className="h-3 w-3" />
                    {service.meetingPointNote}
                  </div>
                )}
              </div>
            </div>

            {/* 지도에서 보기 버튼 */}
            <a
              href={
                service.meetingPointMapUrl ||
                `https://map.naver.com/p/search/${encodeURIComponent(
                  service.meetingPointAddress || service.meetingPoint
                )}`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="relative mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl bg-slate-950 py-2.5 text-[13px] font-bold text-white transition hover:bg-slate-800 active:scale-[0.98]"
            >
              🗺️ {t("viewOnMap", locale)}
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        </div>
      )}

      {/* ── 날짜 및 시간 선택 — 이미지와 동일한 edge-to-edge 너비 ── */}
      <div className="mt-5">
        <h2 className="mb-3 flex items-center gap-2 px-5 text-base font-black text-slate-950">
          <span>📅</span> {t("dateTimeSelect", locale)}
        </h2>

        {bookingConfirmed ? (
          /* Confirmation summary card */
          <div className="flex items-center justify-between rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4">
            <div className="flex items-start gap-2">
              <span className="mt-0.5 text-base">✅</span>
              <div>
                <p className="text-sm font-black text-emerald-800">
                  {bookingConfirmed.date.toLocaleDateString(bcp47, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    weekday: "short",
                  })}{" "}
                  {bookingConfirmed.timeSlot}
                </p>
                <p className="mt-0.5 text-xs font-semibold text-emerald-600">
                  {countTypeLabel}{" "}
                  {bookingConfirmed.count}
                  {countUnitLabel} {t("selected", locale)}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setBookingConfirmed(null)}
              className="rounded-xl border border-emerald-200 bg-white px-3 py-1.5 text-xs font-bold text-emerald-700 transition hover:bg-emerald-50 active:scale-95"
            >
              {t("change", locale)}
            </button>
          </div>
        ) : (
          <BookingCalendar
            category={calendarCategory}
            performanceDates={isTicket ? samplePerformanceDates : undefined}
            onConfirm={(date, timeSlot, count) =>
              setBookingConfirmed({ date, timeSlot, count })
            }
          />
        )}
      </div>

      {/* ── 티켓 옵션 (티켓 전용) ── */}
      {isTicket && ticket!.options.length > 0 && (
        <div className="mt-5 px-5">
          <h2 className="mb-3 text-base font-black text-slate-950">{t("ticketOptions", locale)}</h2>
          <div className="space-y-2">
            {ticket!.options.map((opt) => (
              <div
                key={opt.id}
                className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-bold text-slate-900">{opt.label}</p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {opt.benefits.map((b) => (
                      <span
                        key={b}
                        className="inline-flex items-center gap-0.5 rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold text-slate-500 ring-1 ring-slate-200"
                      >
                        <CheckCircle2 className="h-3 w-3 text-sky-400" />
                        {b}
                      </span>
                    ))}
                  </div>
                </div>
                <span className="ml-4 shrink-0 text-base font-black text-slate-950">
                  ₩{opt.price.toLocaleString(bcp47)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── 탭 바 — 프리미엄 스타일 ── */}
      {tabs.length > 0 && (
        <div className="mt-8">
          <div className="sticky top-[58px] z-10 flex overflow-x-auto border-y border-slate-200 bg-white/90 backdrop-blur-xl scrollbar-none">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`relative shrink-0 px-5 py-4 text-[13px] font-bold transition ${
                  activeTab === tab.key
                    ? "text-slate-950"
                    : "text-slate-400 hover:text-slate-700"
                }`}
              >
                {tab.label}
                {/* 하단 액센트 바 */}
                <span
                  className={`absolute bottom-0 left-5 right-5 h-0.5 rounded-full transition-all ${
                    activeTab === tab.key
                      ? "bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 opacity-100"
                      : "opacity-0"
                  }`}
                />
              </button>
            ))}
          </div>

          {/* 탭 콘텐츠 */}
          <div className={activeTab === "details" ? "pt-2" : "px-5 py-6"}>
            {activeContent ? (
              activeTab === "details" ? (
                /* 상품상세: 야놀자 스타일 - 이미지 세로 스크롤 + 텍스트 */
                <div>
                  {/* 세로 스크롤 갤러리 */}
                  {galleryImages.length > 0 && (
                    <DetailGallery images={galleryImages} />
                  )}
                  {/* 텍스트 상세 설명 */}
                  {activeContent && (
                    <div className="px-5 pb-4">
                      <div
                        className={`overflow-hidden transition-all duration-500 ${
                          detailsExpanded ? "max-h-[9999px]" : "max-h-80"
                        }`}
                      >
                        <RichContent text={activeContent} />
                      </div>
                      {/* 그라디언트 페이드 + 더보기 버튼 */}
                      {!detailsExpanded && (
                        <div className="pointer-events-none -mt-20 h-20 bg-gradient-to-t from-white to-transparent" />
                      )}
                      <button
                        onClick={() => setDetailsExpanded((p) => !p)}
                        className="mt-1 flex w-full items-center justify-center gap-1.5 rounded-2xl border border-slate-200 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 active:scale-[0.98]"
                      >
                        {detailsExpanded ? (
                          <>{t("collapse", locale)} <ChevronUp className="h-4 w-4" /></>
                        ) : (
                          <>{t("seeMore", locale)} <ChevronDown className="h-4 w-4" /></>
                        )}
                      </button>
                    </div>
                  )}
                  {/* 이미지만 있고 텍스트 없을 때 */}
                  {!activeContent && galleryImages.length === 0 && (
                    <div className="px-5 py-10 text-center text-sm text-slate-400">
                      {t("contentPending", locale)}
                    </div>
                  )}
                </div>
              ) : (
                /* 나머지 탭: 리치 텍스트 */
                <RichContent text={activeContent} />
              )
            ) : (
              /* 상품상세 탭인데 텍스트는 없어도 이미지는 표시 */
              activeTab === "details" && galleryImages.length > 0 ? (
                <DetailGallery images={galleryImages} />
              ) : (
                <div className="flex flex-col items-center py-10 text-slate-400">
                  <p className="text-sm">{t("contentPending", locale)}</p>
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* 탭 없을 때 기본 설명 */}
      {tabs.length === 0 && (
        <div className="mt-6 px-5 py-4">
          <RichContent text={isTicket ? ticket!.description : service!.description} />
        </div>
      )}

      {/* ── 하단 고정 예약 버튼 ── */}
      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-slate-100 bg-white/95 px-4 py-4 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] backdrop-blur-md">
        <div className="mx-auto flex max-w-2xl items-center gap-4">
          <div className="flex-1">
            {minPrice > 0 ? (
              <>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                  {t("bestPrice", locale)}
                </p>
                <p className="text-xl font-black text-slate-950">
                  <span className="text-[13px] font-semibold text-slate-500">₩</span>
                  {minPrice.toLocaleString(bcp47)}
                  <span className="ml-0.5 text-sm font-semibold text-slate-500">
                    {locale === "ko" ? "~" : locale === "ja" ? "〜" : locale === "en" ? "+" : " 起"}
                  </span>
                </p>
              </>
            ) : (
              <p className="text-sm font-semibold text-slate-500">{t("inquiry", locale)}</p>
            )}
          </div>
          <Link
            href={reservationUrl}
            className="rounded-2xl bg-gradient-to-r from-slate-950 to-slate-800 px-10 py-3.5 text-base font-black text-white shadow-lg shadow-slate-900/20 transition hover:from-slate-900 hover:to-slate-700 active:scale-95"
          >
            {t("bookNow", locale)}
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── 정보 칩 ─────────────────────────────────────────────────────────────────
function InfoChip({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
      <span className="text-slate-400">{icon}</span>
      {children}
    </div>
  );
}

// ─── 정보 행 — 상품 정보 섹션용 (라벨 + 값) ─────────────────────────────────
function InfoRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-slate-500 ring-1 ring-slate-200">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          {label}
        </p>
        <p className="mt-0.5 text-sm font-semibold leading-snug text-slate-800">
          {children}
        </p>
      </div>
    </div>
  );
}
