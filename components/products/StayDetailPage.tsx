"use client";

import Image from "next/image";
import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Heart,
  Share2,
  Star,
  Images,
  Users,
  Clock3,
  Check,
  ChevronDown,
  ChevronUp,
  Wifi,
  Car,
  Coffee,
  Utensils,
  Dumbbell,
  Bath,
  Navigation,
  Send,
  ThumbsUp,
} from "lucide-react";
import { Link } from "@/lib/navigation";
import type { ServiceCatalogItem } from "@/data/service-catalog";

interface StayDetailPageProps {
  item: ServiceCatalogItem;
  reservationUrl: string;
  backUrl?: string;
}

// ─── 날짜 유틸 ────────────────────────────────────────────────────────────────
function formatDate(d: Date) {
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}
function dayLabel(d: Date) {
  return ["일", "월", "화", "수", "목", "금", "토"][d.getDay()];
}
function addDays(d: Date, n: number) {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

// ─── 편의시설 아이콘 목록 ─────────────────────────────────────────────────────
const AMENITIES = [
  { icon: <Wifi className="h-5 w-5" />, label: "무선 인터넷" },
  { icon: <Car className="h-5 w-5" />, label: "주차장" },
  { icon: <Coffee className="h-5 w-5" />, label: "조식 운영" },
  { icon: <Utensils className="h-5 w-5" />, label: "레스토랑" },
  { icon: <Dumbbell className="h-5 w-5" />, label: "피트니스" },
  { icon: <Bath className="h-5 w-5" />, label: "스파" },
];

// ─── 메인 컴포넌트 ────────────────────────────────────────────────────────────
export default function StayDetailPage({
  item,
  reservationUrl,
  backUrl = "/products",
}: StayDetailPageProps) {
  const today = new Date();
  const [checkIn, setCheckIn] = useState(addDays(today, 1));
  const [nights, setNights] = useState(1);
  const [guests, setGuests] = useState(2);
  const [activeTab, setActiveTab] = useState<"rooms" | "intro" | "facilities" | "reviews" | "map" | "cancel">("rooms");
  const [liked, setLiked] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [currentImg, setCurrentImg] = useState(0);
  const [introExpanded, setIntroExpanded] = useState(false);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(
    item.options.length > 0 ? item.options[0].id : null
  );

  // 리뷰
  const [reviews, setReviews] = useState<{ name: string; rating: number; text: string; date: string; helpful: number }[]>([
    { name: "김**", rating: 5, text: "KINTEX 전시 참가 때 이용했는데 접근성이 정말 좋아요. 객실도 깔끔하고 조식도 만족스러웠습니다.", date: "2026.03.22", helpful: 12 },
    { name: "이**", rating: 4, text: "비즈니스 출장으로 2박 했습니다. 체크인이 빠르고 직원분들이 친절했어요. 다음에도 이용할 것 같습니다.", date: "2026.02.15", helpful: 8 },
    { name: "박**", rating: 5, text: "조용하고 깔끔한 숙소입니다. 주변에 편의시설도 많고 고양 여행에 최적의 위치였어요.", date: "2026.01.30", helpful: 5 },
  ]);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewHover, setReviewHover] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviewName, setReviewName] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const checkOut = addDays(checkIn, nights);
  const allImages: string[] = [];
  if (item.imageUrl) allImages.push(item.imageUrl);
  if (item.images) allImages.push(...item.images);

  const avgRating = reviews.length > 0
    ? Math.round((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10) / 10
    : 0;

  const tabs = [
    { key: "rooms" as const, label: "객실 선택" },
    { key: "intro" as const, label: "숙소소개" },
    { key: "facilities" as const, label: "시설서비스" },
    { key: "reviews" as const, label: `리뷰 (${reviews.length})` },
    { key: "map" as const, label: "지도" },
    { key: "cancel" as const, label: "취소규정" },
  ];

  const minPrice = item.options.length > 0
    ? Math.min(...item.options.map((o) => o.price))
    : item.price;

  const selectedOption = item.options.find((o) => o.id === selectedOptionId) ?? item.options[0] ?? null;
  const selectedReservationUrl = selectedOption
    ? `${reservationUrl}&option=${selectedOption.id}&nights=${nights}&guests=${guests}`
    : `${reservationUrl}&nights=${nights}&guests=${guests}`;

  return (
    <div className="mx-auto max-w-2xl pb-24">
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
            liked ? "bg-rose-50 text-rose-500" : "bg-slate-100 text-slate-500"
          }`}
        >
          <Heart className={`h-5 w-5 ${liked ? "fill-rose-500" : ""}`} />
        </button>
        <button className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500">
          <Share2 className="h-5 w-5" />
        </button>
      </div>

      {/* ── 날짜·인원 선택 바 ── */}
      <div className="border-b border-slate-100 bg-white px-4 py-3">
        <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-1 py-1">
          {/* 체크인 */}
          <div className="flex flex-1 flex-col items-center py-2">
            <p className="text-[10px] font-semibold text-slate-400">체크인</p>
            <p className="mt-0.5 text-sm font-black text-slate-900">{formatDate(checkIn)}</p>
            <p className="text-[10px] text-slate-400">{dayLabel(checkIn)}요일</p>
          </div>
          {/* 박수 조절 */}
          <div className="flex flex-col items-center gap-1">
            <button
              onClick={() => setNights((n) => Math.max(1, n - 1))}
              className="rounded-full bg-white p-0.5 shadow-sm hover:bg-slate-100"
            >
              <ChevronLeft className="h-3.5 w-3.5 text-slate-500" />
            </button>
            <span className="rounded-full bg-slate-950 px-2.5 py-1 text-xs font-black text-white">
              {nights}박
            </span>
            <button
              onClick={() => setNights((n) => n + 1)}
              className="rounded-full bg-white p-0.5 shadow-sm hover:bg-slate-100"
            >
              <ChevronRight className="h-3.5 w-3.5 text-slate-500" />
            </button>
          </div>
          {/* 체크아웃 */}
          <div className="flex flex-1 flex-col items-center py-2">
            <p className="text-[10px] font-semibold text-slate-400">체크아웃</p>
            <p className="mt-0.5 text-sm font-black text-slate-900">{formatDate(checkOut)}</p>
            <p className="text-[10px] text-slate-400">{dayLabel(checkOut)}요일</p>
          </div>
          {/* 구분선 */}
          <div className="h-10 w-px bg-slate-200" />
          {/* 인원 */}
          <div className="flex items-center gap-2 px-3">
            <Users className="h-4 w-4 text-slate-400" />
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setGuests((g) => Math.max(1, g - 1))}
                className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 text-slate-600 hover:bg-slate-300"
              >
                <span className="text-xs font-bold">−</span>
              </button>
              <span className="w-4 text-center text-sm font-black text-slate-900">{guests}</span>
              <button
                onClick={() => setGuests((g) => g + 1)}
                className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 text-slate-600 hover:bg-slate-300"
              >
                <span className="text-xs font-bold">+</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── 사진 그리드 (NOL 스타일: 1큰 + 4작은) ── */}
      <div className="relative">
        {allImages.length >= 5 ? (
          /* 이미지 5장 이상: 1큰+4작은 */
          <div className="grid h-64 grid-cols-3 gap-0.5 sm:h-80">
            <div className="relative col-span-2 row-span-2 overflow-hidden">
              <Image src={allImages[0]} alt={item.title} fill className="object-cover" sizes="440px" priority />
            </div>
            {allImages.slice(1, 5).map((src, i) => (
              <div key={i} className="relative overflow-hidden">
                <Image src={src} alt={`사진 ${i + 2}`} fill className="object-cover" sizes="220px" />
              </div>
            ))}
          </div>
        ) : allImages.length > 0 ? (
          /* 이미지 1~4장: 슬라이더 — 항상 전체 너비 */
          <div className="relative w-full overflow-hidden bg-slate-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={allImages[currentImg]}
              alt={item.title}
              className="block h-auto w-full transition duration-500"
              loading="eager"
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/25 to-transparent" />
            {allImages.length > 1 && (
              <>
                <button onClick={() => setCurrentImg((p) => (p - 1 + allImages.length) % allImages.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white">
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button onClick={() => setCurrentImg((p) => (p + 1) % allImages.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white">
                  <ChevronRight className="h-5 w-5" />
                </button>
                <div className="absolute bottom-3 right-3 rounded-full bg-black/40 px-2.5 py-1 text-xs font-bold text-white">
                  {currentImg + 1} / {allImages.length}
                </div>
              </>
            )}
          </div>
        ) : (
          /* 이미지 없음: 그라디언트 */
          <div className={`flex h-64 w-full items-center justify-center bg-gradient-to-br ${item.imageTone}`}>
            <p className="text-4xl font-black tracking-tight text-slate-900 opacity-30">{item.posterLabel}</p>
          </div>
        )}

        {/* 전체 사진 버튼 */}
        {allImages.length > 1 && (
          <button
            onClick={() => setGalleryOpen(true)}
            className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-sm hover:bg-black/70"
          >
            <Images className="h-3.5 w-3.5" />
            전체 사진 ({allImages.length})
          </button>
        )}
      </div>

      {/* ── 숙소 기본 정보 ── */}
      <div className="px-5 pt-5">
        {/* 배지 */}
        <div className="flex flex-wrap items-center gap-2">
          {item.discountLabel && (
            <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-black text-rose-500 ring-1 ring-rose-200">
              {item.discountLabel} 할인
            </span>
          )}
          {item.tags.slice(0, 2).map((t) => (
            <span key={t} className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-600 ring-1 ring-sky-100">
              {t}
            </span>
          ))}
        </div>

        {/* 호텔명 */}
        <h1 className="mt-3 text-2xl font-black leading-snug tracking-tight text-slate-950">
          {item.title}
        </h1>

        {/* 위치 */}
        <div className="mt-2 flex items-center gap-1.5 text-sm text-slate-500">
          <MapPin className="h-4 w-4 shrink-0 text-slate-400" />
          <span>{item.location}</span>
          <button className="ml-1 text-xs font-bold text-sky-600 hover:underline">지도 보기 &gt;</button>
        </div>

        {/* 별점 + 리뷰 */}
        <button
          onClick={() => setActiveTab("reviews")}
          className="mt-3 flex items-center gap-2 hover:opacity-80"
        >
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className={`h-4 w-4 ${s <= Math.round(avgRating) ? "fill-amber-400 text-amber-400" : "text-slate-200"}`} />
            ))}
          </div>
          <span className="text-sm font-black text-slate-800">{avgRating}</span>
          <span className="text-xs font-semibold text-sky-600 underline">리뷰 {reviews.length}개 보기</span>
        </button>

        {/* 쿠폰 배너 */}
        {item.discountLabel && (
          <div className="mt-4 flex items-center justify-between rounded-2xl bg-gradient-to-r from-sky-50 to-indigo-50 px-4 py-3 ring-1 ring-sky-100">
            <div className="flex items-center gap-2">
              <span className="text-lg">🎟️</span>
              <div>
                <p className="text-xs font-bold text-sky-700">예약 시 즉시 할인 적용</p>
                <p className="text-[11px] text-sky-500">지금 예약하면 {item.discountLabel} 할인 혜택</p>
              </div>
            </div>
            <button className="rounded-full bg-sky-600 px-3 py-1.5 text-[11px] font-black text-white hover:bg-sky-700">
              쿠폰받기
            </button>
          </div>
        )}
      </div>

      {/* ── 탭 바 ── */}
      <div className="sticky top-14 z-10 mt-5 bg-white">
        <div className="flex overflow-x-auto border-b border-slate-200 scrollbar-none">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`shrink-0 border-b-2 px-5 py-3.5 text-sm font-bold transition ${
                activeTab === tab.key
                  ? "border-slate-950 text-slate-950"
                  : "border-transparent text-slate-400 hover:text-slate-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── 탭 콘텐츠 ── */}

      {/* 객실 선택 */}
      {activeTab === "rooms" && (
        <div className="px-5 py-5 space-y-3">
          <p className="text-xs text-slate-400">
            {formatDate(checkIn)}({dayLabel(checkIn)}) 체크인 · {nights}박 · 성인 {guests}명 기준
          </p>
          {item.options.length > 0 ? (
            item.options.map((opt) => (
              <RoomCard
                key={opt.id}
                opt={opt}
                nights={nights}
                imageTone={item.imageTone}
                selected={selectedOptionId === opt.id}
                onSelect={() => setSelectedOptionId(opt.id)}
              />
            ))
          ) : (
            <p className="py-10 text-center text-sm text-slate-400">객실 정보 준비 중입니다.</p>
          )}
        </div>
      )}

      {/* 숙소 소개 */}
      {activeTab === "intro" && (
        <div className="px-5 py-6">
          {/* 갤러리 세로 스크롤 (상세 이미지) */}
          {item.images && item.images.length > 0 && (
            <div className="-mx-5 mb-6 space-y-1.5 bg-white">
              {item.images.map((src, i) => (
                <div key={i} className="relative w-full overflow-hidden bg-slate-50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={`숙소 이미지 ${i + 1}`}
                    className="block h-auto w-full"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          )}
          {/* 소개 텍스트 */}
          {item.tabDetails ? (
            <div>
              <div className={`overflow-hidden transition-all duration-500 ${introExpanded ? "max-h-[9999px]" : "max-h-48"}`}>
                <p className="whitespace-pre-wrap text-sm leading-8 text-slate-600">{item.tabDetails}</p>
              </div>
              {!introExpanded && <div className="pointer-events-none -mt-16 h-16 bg-gradient-to-t from-white to-transparent" />}
              <button
                onClick={() => setIntroExpanded((p) => !p)}
                className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-2xl border border-slate-200 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
              >
                {introExpanded ? <>접기 <ChevronUp className="h-4 w-4" /></> : <>더보기 <ChevronDown className="h-4 w-4" /></>}
              </button>
            </div>
          ) : (
            <p className="py-10 text-center text-sm text-slate-400">소개 내용 준비 중입니다.</p>
          )}
        </div>
      )}

      {/* 시설 서비스 */}
      {activeTab === "facilities" && (
        <div className="px-5 py-6">
          {item.tabUsageInfo ? (
            <p className="whitespace-pre-wrap text-sm leading-8 text-slate-600">{item.tabUsageInfo}</p>
          ) : (
            <>
              <h2 className="mb-4 text-base font-black text-slate-950">주요 편의시설</h2>
              <div className="grid grid-cols-3 gap-3">
                {AMENITIES.map((a) => (
                  <div key={a.label} className="flex flex-col items-center gap-2 rounded-2xl bg-slate-50 py-4">
                    <span className="text-slate-500">{a.icon}</span>
                    <span className="text-xs font-semibold text-slate-600">{a.label}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* ── 리뷰 탭 ── */}
      {activeTab === "reviews" && (
        <div className="px-5 py-6 space-y-6">

          {/* 평점 요약 */}
          <div className="flex items-center gap-5 rounded-2xl bg-slate-50 px-5 py-4">
            <div className="flex flex-col items-center">
              <p className="text-4xl font-black text-slate-950">{avgRating}</p>
              <div className="mt-1 flex gap-0.5">
                {[1,2,3,4,5].map((s) => (
                  <Star key={s} className={`h-3.5 w-3.5 ${s <= Math.round(avgRating) ? "fill-amber-400 text-amber-400" : "text-slate-200"}`} />
                ))}
              </div>
              <p className="mt-1 text-[11px] text-slate-400">총 {reviews.length}개 리뷰</p>
            </div>
            <div className="flex-1 space-y-1.5">
              {[5,4,3,2,1].map((n) => {
                const cnt = reviews.filter((r) => r.rating === n).length;
                const pct = reviews.length > 0 ? (cnt / reviews.length) * 100 : 0;
                return (
                  <div key={n} className="flex items-center gap-2">
                    <span className="w-3 text-[11px] font-bold text-slate-500">{n}</span>
                    <div className="flex-1 h-1.5 rounded-full bg-slate-200 overflow-hidden">
                      <div className="h-full rounded-full bg-amber-400 transition-all" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="w-4 text-right text-[11px] text-slate-400">{cnt}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 기존 리뷰 목록 */}
          <div className="space-y-4">
            {reviews.map((r, i) => (
              <div key={i} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-xs font-black text-slate-600">
                        {r.name[0]}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">{r.name}</p>
                        <p className="text-[11px] text-slate-400">{r.date}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map((s) => (
                      <Star key={s} className={`h-3.5 w-3.5 ${s <= r.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"}`} />
                    ))}
                  </div>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{r.text}</p>
                <div className="mt-3 flex items-center gap-1">
                  <button
                    onClick={() => setReviews((prev) => prev.map((rv, idx) => idx === i ? { ...rv, helpful: rv.helpful + 1 } : rv))}
                    className="flex items-center gap-1 rounded-full bg-slate-50 px-3 py-1 text-[11px] font-semibold text-slate-500 hover:bg-slate-100"
                  >
                    <ThumbsUp className="h-3 w-3" /> 도움이 돼요 {r.helpful}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* 리뷰 작성 폼 */}
          <div className="rounded-2xl border border-sky-100 bg-sky-50/50 p-4">
            <h3 className="mb-4 text-sm font-black text-slate-950">✏️ 리뷰 작성하기</h3>
            {reviewSubmitted ? (
              <div className="flex flex-col items-center gap-2 py-4 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                  <Check className="h-6 w-6 text-emerald-600" />
                </div>
                <p className="text-sm font-bold text-slate-800">리뷰가 등록되었습니다!</p>
                <p className="text-xs text-slate-500">소중한 후기 감사합니다.</p>
                <button
                  onClick={() => { setReviewSubmitted(false); setReviewText(""); setReviewName(""); setReviewRating(5); }}
                  className="mt-2 rounded-full border border-slate-200 px-4 py-1.5 text-xs font-semibold text-slate-600 hover:bg-white"
                >
                  추가 작성
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {/* 별점 선택 */}
                <div>
                  <p className="mb-2 text-xs font-semibold text-slate-600">별점 선택</p>
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onMouseEnter={() => setReviewHover(s)}
                        onMouseLeave={() => setReviewHover(0)}
                        onClick={() => setReviewRating(s)}
                        className="transition active:scale-90"
                      >
                        <Star className={`h-8 w-8 transition ${
                          s <= (reviewHover || reviewRating) ? "fill-amber-400 text-amber-400" : "text-slate-300"
                        }`} />
                      </button>
                    ))}
                    <span className="ml-2 self-center text-sm font-black text-amber-500">
                      {["", "별로예요", "아쉬워요", "보통이에요", "좋아요", "최고예요"][reviewHover || reviewRating]}
                    </span>
                  </div>
                </div>
                {/* 이름 */}
                <input
                  type="text"
                  value={reviewName}
                  onChange={(e) => setReviewName(e.target.value)}
                  placeholder="닉네임 (예: 김**)"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-200"
                />
                {/* 리뷰 내용 */}
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="숙박 후기를 자유롭게 작성해주세요. (최소 10자 이상)"
                  rows={4}
                  className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-sky-200"
                />
                <button
                  onClick={() => {
                    if (!reviewText.trim() || reviewText.length < 10 || !reviewName.trim()) return;
                    setReviews((prev) => [{
                      name: reviewName,
                      rating: reviewRating,
                      text: reviewText,
                      date: formatDate(new Date()),
                      helpful: 0,
                    }, ...prev]);
                    setReviewSubmitted(true);
                  }}
                  disabled={reviewText.length < 10 || !reviewName.trim()}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 py-3 text-sm font-black text-white transition hover:bg-slate-800 active:scale-[0.98] disabled:opacity-40"
                >
                  <Send className="h-4 w-4" /> 리뷰 등록하기
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── 지도 탭 ── */}
      {activeTab === "map" && (
        <div className="px-5 py-6 space-y-4">
          {/* 주소 카드 */}
          <div className="flex items-start gap-3 rounded-2xl bg-slate-50 px-4 py-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-950">
              <MapPin className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-black text-slate-950">{item.title}</p>
              <p className="mt-0.5 text-sm text-slate-500">{item.location}</p>
            </div>
          </div>

          {/* 지도 플레이스홀더 + 카카오/네이버 버튼 */}
          <div className="relative overflow-hidden rounded-2xl bg-slate-100" style={{ height: 200 }}>
            {/* 지도 배경 이미지 느낌 */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-200 via-slate-100 to-sky-50" />
            {/* 격자 패턴 */}
            <svg className="absolute inset-0 h-full w-full opacity-20" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#94a3b8" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
            {/* 도로 흉내 */}
            <svg className="absolute inset-0 h-full w-full opacity-30" xmlns="http://www.w3.org/2000/svg">
              <line x1="0" y1="100" x2="100%" y2="100" stroke="#cbd5e1" strokeWidth="8"/>
              <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#cbd5e1" strokeWidth="8"/>
              <line x1="0" y1="60%" x2="100%" y2="60%" stroke="#e2e8f0" strokeWidth="4"/>
            </svg>
            {/* 핀 */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-500 shadow-lg ring-2 ring-white">
                <MapPin className="h-5 w-5 text-white" />
              </div>
              <div className="mx-auto mt-1 h-2 w-2 rounded-full bg-rose-500/40" />
            </div>
            {/* 지도 열기 오버레이 텍스트 */}
            <p className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[11px] font-semibold text-slate-400">
              아래 버튼을 눌러 지도를 열어주세요
            </p>
          </div>

          {/* 지도 앱 버튼 */}
          <div className="grid grid-cols-2 gap-3">
            <a
              href={`https://map.kakao.com/?q=${encodeURIComponent(item.location)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-2xl bg-[#FEE500] py-3.5 text-sm font-black text-[#3C1E1E] transition hover:brightness-95 active:scale-95"
            >
              <span className="text-base">🗺️</span> 카카오맵
            </a>
            <a
              href={`https://map.naver.com/v5/search/${encodeURIComponent(item.location)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-2xl bg-[#03C75A] py-3.5 text-sm font-black text-white transition hover:brightness-95 active:scale-95"
            >
              <Navigation className="h-4 w-4" /> 네이버지도
            </a>
          </div>

          {/* 교통 안내 */}
          {item.tabUsageInfo ? (
            <div className="rounded-2xl border border-slate-100 bg-white p-4">
              <h3 className="mb-3 text-sm font-black text-slate-950">🚌 교통 안내</h3>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-600">{item.tabUsageInfo}</p>
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-100 bg-white p-4 space-y-3">
              <h3 className="text-sm font-black text-slate-950">🚌 교통 안내</h3>
              {[
                { icon: "🚇", label: "지하철", desc: "대화역 (3호선) 도보 15분" },
                { icon: "🚌", label: "버스", desc: "KINTEX 정류장 하차 후 도보 5분" },
                { icon: "🚗", label: "자가용", desc: "네이버지도에서 '위 주소' 검색" },
                { icon: "✈️", label: "공항버스", desc: "인천공항 리무진 직행 운행" },
              ].map((t) => (
                <div key={t.label} className="flex items-center gap-3">
                  <span className="text-lg">{t.icon}</span>
                  <div>
                    <span className="text-xs font-bold text-slate-700">{t.label}</span>
                    <p className="text-xs text-slate-500">{t.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 취소 규정 */}
      {activeTab === "cancel" && (
        <div className="px-5 py-6">
          {item.tabCancellation ? (
            <p className="whitespace-pre-wrap text-sm leading-8 text-slate-600">{item.tabCancellation}</p>
          ) : (
            <div className="space-y-3">
              {[
                { period: "체크인 3일 전 이전", refund: "100% 환불" },
                { period: "체크인 2일 전", refund: "50% 환불" },
                { period: "체크인 1일 전 ~ 당일", refund: "환불 불가" },
              ].map((row) => (
                <div key={row.period} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                  <span className="text-sm text-slate-600">{row.period}</span>
                  <span className={`text-sm font-black ${row.refund === "환불 불가" ? "text-rose-500" : "text-emerald-600"}`}>
                    {row.refund}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── 하단 고정 바 ── */}
      {/* 오더 #P4: 숙박은 티켓 외 카테고리 → 가격 표시 렌더 차단, CTA 는 "안내 보기". */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 px-4 py-4 shadow-[0_-2px_20px_rgba(0,0,0,0.1)] backdrop-blur-md">
        <div className="mx-auto flex max-w-2xl items-center justify-end gap-4">
          <Link
            href={selectedReservationUrl}
            className="rounded-2xl bg-slate-950 px-10 py-3.5 text-base font-black text-white shadow-lg transition hover:bg-slate-800 active:scale-95"
          >
            안내 보기
          </Link>
        </div>
      </div>

      {/* ── 전체사진 모달 ── */}
      {galleryOpen && allImages.length > 0 && (
        <div className="fixed inset-0 z-50 flex flex-col bg-black" onClick={() => setGalleryOpen(false)}>
          <div className="flex items-center justify-between px-4 py-3">
            <button className="text-white opacity-80 hover:opacity-100">
              <ChevronLeft className="h-6 w-6" />
            </button>
            <span className="text-sm font-bold text-white">{currentImg + 1} / {allImages.length}</span>
            <button className="text-sm font-bold text-white opacity-80 hover:opacity-100" onClick={() => setGalleryOpen(false)}>닫기</button>
          </div>
          <div className="flex flex-1 items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setCurrentImg((p) => (p - 1 + allImages.length) % allImages.length)}
              className="absolute left-3 z-10 rounded-full bg-white/20 p-3 text-white">
              <ChevronLeft className="h-6 w-6" />
            </button>
            <div className="relative h-80 w-full sm:h-[500px]">
              <Image src={allImages[currentImg]} alt="" fill className="object-contain" sizes="100vw" />
            </div>
            <button onClick={() => setCurrentImg((p) => (p + 1) % allImages.length)}
              className="absolute right-3 z-10 rounded-full bg-white/20 p-3 text-white">
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
          <div className="flex gap-2 overflow-x-auto px-4 py-3 scrollbar-none">
            {allImages.map((src, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setCurrentImg(i); }}
                className={`relative h-16 w-20 shrink-0 overflow-hidden rounded-lg transition ${i === currentImg ? "ring-2 ring-white" : "opacity-50"}`}
              >
                <Image src={src} alt="" fill className="object-cover" sizes="80px" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── 객실 카드 (선택형) ────────────────────────────────────────────────────────
function RoomCard({
  opt,
  nights,
  imageTone,
  selected,
  onSelect,
}: {
  opt: { id: string; label: string; price: number; benefits: string[]; imageUrl?: string };
  nights: number;
  imageTone: string;
  selected: boolean;
  onSelect: () => void;
}) {
  const total = opt.price * nights;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full overflow-hidden rounded-2xl border-2 bg-white text-left shadow-sm transition ${
        selected ? "border-slate-950" : "border-slate-100 hover:border-slate-300"
      }`}
    >
      {/* 객실 이미지 — 있을 때만 */}
      {(opt as { imageUrl?: string }).imageUrl && (
        <div className="relative aspect-[16/7] overflow-hidden bg-slate-100">
          <Image
            src={(opt as { imageUrl: string }).imageUrl}
            alt={opt.label}
            fill
            className="object-cover"
            sizes="(max-width:768px) 100vw, 672px"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
            <p className="text-sm font-black text-white">{opt.label}</p>
          </div>
        </div>
      )}

      {/* 객실 정보 */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            {/* 선택 상태 + 객실명 */}
            <div className="flex items-center gap-2">
              <div className={`mt-0.5 h-4 w-4 shrink-0 rounded-full border-2 transition ${
                selected ? "border-slate-950 bg-slate-950" : "border-slate-300"
              }`}>
                {selected && <div className="m-0.5 h-2 w-2 rounded-full bg-white" />}
              </div>
              <p className="text-sm font-black text-slate-900">{opt.label}</p>
            </div>
            {/* 체크인/아웃 */}
            <div className="mt-2 flex items-center gap-3 text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <Clock3 className="h-3 w-3" /> 체크인 15:00
              </span>
              <span className="flex items-center gap-1">
                <Clock3 className="h-3 w-3" /> 체크아웃 11:00
              </span>
            </div>
            {/* 혜택 */}
            <div className="mt-2 flex flex-wrap gap-1">
              {opt.benefits.map((b) => (
                <span
                  key={b}
                  className="inline-flex items-center gap-0.5 rounded-full bg-sky-50 px-2 py-0.5 text-[10px] font-semibold text-sky-600"
                >
                  <Check className="h-3 w-3" />
                  {b}
                </span>
              ))}
            </div>
          </div>
          {/* 가격 — 오더 #P4: 숙박(티켓 외 카테고리) 렌더 차단.
              opt.price / nights / total 데이터 필드는 유지 (되돌리기 대비). */}
        </div>
      </div>
    </button>
  );
}
