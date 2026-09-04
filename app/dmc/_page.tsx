// /[locale]/dmc 인덱스 — 오더 #C49.
//
// 재구성: "전시 소개 + 티켓 안내" 페이지.
//   · Hero
//   · Kintex/Goyang Exhibitions (신설 · ticket-booking.ts category==="exhibition" 재사용)
//   · PLACES (장소 상세 진입 그리드)
//   · GOYANG MOVE (공항 접근 브릿지)
//   · Catalog Bridge (당일코스 진입 CTA)
//   · Final CTA
//
// 이관 (오더 #C49 [1]): 아래 4블록은 /institute 로 이동 · /dmc 에서 제거.
//   · Pillars      (3개)
//   · Use Cases    (4개)
//   · Steps        (4단계)
//   · Partners     (CTA)
//   → 데이터·문안: data/dmc-service-blocks.ts (5로케일 SSOT).
//
// 무접촉:
//   · data/ticket-booking.ts · 결제 라우트 /products/[id]/reservation · admin · DB · prisma (G7 LOCK)
//   · Header · --header-h · Shell · /dmc/[slug] · /dmc/move 무영향

import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRight, Calendar, MapPin } from "lucide-react";

import PremiumCard from "@/components/common/PremiumCard";
import SectionTitle from "@/components/common/SectionTitle";
import Shell from "@/components/layout/Shell";
import { readDmcHeroMedia } from "@/lib/dmc-hero-media";
import { Link } from "@/lib/navigation";
import { ticketProducts, type TicketProduct, type TicketLocale } from "@/data/ticket-booking";

export const dynamic = "force-dynamic";

export type PageLocale = "ko" | "en" | "ja" | "zh-CN" | "zh-TW";

type DmcCopy = {
  metadata: Metadata;
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    mediaTitle: string;
    mediaDescription: string;
  };
  exhibitions: {
    eyebrow: string;
    title: string;
    desc: string;
    emptyPlaceholder: string;
    ctaTicket: string;
    ctaMore: string;
  };
  catalogViewAll: string;
  places: { eyebrow: string; title: string; desc: string; placeholder: string };
  move: { eyebrow: string; title: string; desc: string; placeholder: string };
  final: { title: string; description: string };
};

const koreanCopy: DmcCopy = {
  metadata: {
    title: "고양 전시·티켓 안내",
    description: "KINTEX·아람누리 등 고양의 전시와 티켓 안내 · 장소 상세 · 공항 접근을 한 곳에서 확인하세요.",
  },
  hero: {
    eyebrow: "GOYANG VIBE LAB",
    title: "고양의 전시와 장소를 한 곳에서",
    description: "KINTEX·아람누리·킨텍스 인근 전시와 티켓 안내, 그리고 고양·일산의 장소 상세로 이어지는 진입점입니다.",
    mediaTitle: "대표 미디어 영역",
    mediaDescription: "관리자 페이지에서 업로드한 이미지 또는 영상이 이곳에 표시됩니다.",
  },
  exhibitions: {
    eyebrow: "EXHIBITIONS",
    title: "고양의 전시",
    desc: "KINTEX·아람누리 등 고양의 전시 안내와 티켓 진입점입니다.",
    emptyPlaceholder: "등록된 전시가 곧 여기에 표시됩니다.",
    ctaTicket: "티켓 안내",
    ctaMore: "전체 카탈로그",
  },
  catalogViewAll: "당일코스 보기",
  places: {
    eyebrow: "PLACES",
    title: "고양일산의 장소",
    desc: "인사이더가 고른 장소를 한 곳씩 소개합니다.",
    placeholder: "곧 이 자리에서 만나요",
  },
  move: {
    eyebrow: "GOYANG MOVE",
    title: "공항에서 고양까지",
    desc: "인천·김포공항에서 고양일산까지 가는 방법을 단계별로 안내합니다.",
    placeholder: "곧 이 자리에서 만나요",
  },
  final: {
    title: "고양에서 무엇을 할지 함께 찾아드립니다",
    description: "방문 목적과 일정에 맞는 안내를 연결해 드립니다.",
  },
};

const englishCopy: DmcCopy = {
  metadata: { title: "Goyang Exhibitions & Tickets", description: "Exhibitions and tickets in Goyang (KINTEX, Aramnuri) plus place guides and airport access." },
  hero: {
    eyebrow: "GOYANG VIBE LAB",
    title: "Goyang exhibitions and places, in one place",
    description: "An entry point to exhibitions and tickets around KINTEX and Aramnuri, and to place guides across Goyang-Ilsan.",
    mediaTitle: "Hero Media Area",
    mediaDescription: "An image or video uploaded from the admin page appears here.",
  },
  exhibitions: {
    eyebrow: "EXHIBITIONS",
    title: "Exhibitions in Goyang",
    desc: "Exhibitions and ticket entry points across KINTEX, Aramnuri, and other Goyang venues.",
    emptyPlaceholder: "Registered exhibitions will appear here soon.",
    ctaTicket: "Ticket info",
    ctaMore: "Full catalog",
  },
  catalogViewAll: "See day trips",
  places: { eyebrow: "PLACES", title: "Places in Goyang-Ilsan", desc: "Places chosen by insiders, one at a time.", placeholder: "Coming soon" },
  move: { eyebrow: "GOYANG MOVE", title: "From the Airport to Goyang", desc: "Step-by-step guidance from Incheon and Gimpo airports.", placeholder: "Coming soon" },
  final: { title: "Let us help you find what to do in Goyang", description: "We connect you with guidance that fits your purpose and schedule." },
};

const japaneseCopy: DmcCopy = {
  metadata: { title: "高陽 展示・チケット案内", description: "KINTEX・アラムヌリなど高陽の展示・チケット案内、場所紹介と空港アクセスを一カ所で。" },
  hero: {
    eyebrow: "GOYANG VIBE LAB",
    title: "高陽の展示と場所をひとつに",
    description: "KINTEX・アラムヌリ周辺の展示・チケット案内と、高陽・一山の場所紹介への入り口です。",
    mediaTitle: "メインメディアエリア",
    mediaDescription: "管理者ページからアップロードした画像または動画がここに表示されます。",
  },
  exhibitions: {
    eyebrow: "EXHIBITIONS",
    title: "高陽の展示",
    desc: "KINTEX・アラムヌリなど高陽の展示・チケット入口です。",
    emptyPlaceholder: "登録された展示が近日中にここに表示されます。",
    ctaTicket: "チケット案内",
    ctaMore: "全カタログ",
  },
  catalogViewAll: "日帰り旅行を見る",
  places: { eyebrow: "PLACES", title: "高陽・一山の場所", desc: "インサイダーが選んだ場所を一つずつ紹介します。", placeholder: "まもなく公開します" },
  move: { eyebrow: "GOYANG MOVE", title: "空港から高陽まで", desc: "仁川・金浦空港から高陽・一山への行き方を段階別に案内します。", placeholder: "まもなく公開します" },
  final: { title: "高陽での過ごし方を一緒に探します", description: "訪問の目的と日程に合った案内をおつなぎします。" },
};

const chineseSimplifiedCopy: DmcCopy = {
  metadata: { title: "高阳 展览·门票指南", description: "KINTEX·阿蓝努里等高阳展览与门票信息、场所指南和机场接送一站式了解。" },
  hero: {
    eyebrow: "GOYANG VIBE LAB",
    title: "高阳的展览与场所，一处尽览",
    description: "KINTEX、阿蓝努里周边展览与门票入口，以及高阳·一山场所指南的进入点。",
    mediaTitle: "主要媒体区域",
    mediaDescription: "此处显示从管理员页面上传的图片或视频。",
  },
  exhibitions: {
    eyebrow: "EXHIBITIONS",
    title: "高阳的展览",
    desc: "KINTEX、阿蓝努里等高阳展览与门票入口。",
    emptyPlaceholder: "已登记的展览将很快显示在此。",
    ctaTicket: "门票信息",
    ctaMore: "完整目录",
  },
  catalogViewAll: "查看一日游",
  places: { eyebrow: "PLACES", title: "高阳·一山的场所", desc: "逐一介绍内行人精选的场所。", placeholder: "敬请期待" },
  move: { eyebrow: "GOYANG MOVE", title: "从机场到高阳", desc: "分步介绍从仁川·金浦机场前往高阳·一山的方式。", placeholder: "敬请期待" },
  final: { title: "一起找到在高阳的玩法", description: "为您连接符合出行目的与日程的指引。" },
};

const chineseTraditionalCopy: DmcCopy = {
  metadata: { title: "高陽 展覽·門票指南", description: "KINTEX·阿藍努里等高陽展覽與門票資訊、場所指南和機場接送一站式了解。" },
  hero: {
    eyebrow: "GOYANG VIBE LAB",
    title: "高陽的展覽與場所，一處盡覽",
    description: "KINTEX、阿藍努里周邊展覽與門票入口，以及高陽·一山場所指南的進入點。",
    mediaTitle: "主要媒體區域",
    mediaDescription: "此處顯示從管理員頁面上傳的圖片或影片。",
  },
  exhibitions: {
    eyebrow: "EXHIBITIONS",
    title: "高陽的展覽",
    desc: "KINTEX、阿藍努里等高陽展覽與門票入口。",
    emptyPlaceholder: "已登記的展覽將很快顯示在此。",
    ctaTicket: "門票資訊",
    ctaMore: "完整目錄",
  },
  catalogViewAll: "查看一日遊",
  places: { eyebrow: "PLACES", title: "高陽·一山的場所", desc: "逐一介紹內行人精選的場所。", placeholder: "敬請期待" },
  move: { eyebrow: "GOYANG MOVE", title: "從機場到高陽", desc: "分步介紹從仁川·金浦機場前往高陽·一山的方式。", placeholder: "敬請期待" },
  final: { title: "一起找到在高陽的玩法", description: "為您連接符合出行目的與日程的指引。" },
};

export const metadata: Metadata = koreanCopy.metadata;

function getCopy(locale: PageLocale) {
  if (locale === "en") return englishCopy;
  if (locale === "ja") return japaneseCopy;
  if (locale === "zh-CN") return chineseSimplifiedCopy;
  if (locale === "zh-TW") return chineseTraditionalCopy;
  return koreanCopy;
}

// ─── Exhibition 데이터 ─────────────────────────────────────────────
// ticket-booking.ts 재사용. category === "exhibition" 필터 · KINTEX venue 우선.
// 신규 결제 로직 구축 0. CTA 는 기존 /products/{id}/reservation 라우트.
function pickLocalizedVenue(t: TicketProduct, locale: PageLocale): string {
  if (locale === "ko") return t.venue;
  const key = locale as TicketLocale;
  return t.translations?.[key]?.venue ?? t.venue;
}

function parseStartDate(dateText: string, fallback: string): string {
  const m = dateText.match(/(\d{4})[.\-/](\d{1,2})[.\-/](\d{1,2})/);
  if (!m) return fallback;
  const [, y, mo, d] = m;
  return `${y}-${mo.padStart(2, "0")}-${d.padStart(2, "0")}`;
}

function getGoyangExhibitions(locale: PageLocale): Array<TicketProduct & { startIso: string; kintexPriority: number }> {
  const list = ticketProducts
    .filter((t) => t.category === "exhibition")
    .map((t) => {
      const startIso = parseStartDate(t.dateText, t.endDate ?? "9999-99-99");
      const venue = pickLocalizedVenue(t, locale);
      const isKintex = /KINTEX|킨텍스/i.test(venue) || /KINTEX|킨텍스/i.test(t.venue);
      return { ...t, startIso, kintexPriority: isKintex ? 0 : 1 };
    });
  list.sort((a, b) => a.kintexPriority - b.kintexPriority || a.startIso.localeCompare(b.startIso));
  return list;
}

export default async function DmcPage({
  locale = "ko",
}: {
  locale?: PageLocale;
}) {
  const copy = getCopy(locale);
  const heroMedia = await readDmcHeroMedia();
  const exhibitions = getGoyangExhibitions(locale);

  return (
    <Shell>
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-6 pb-24 pt-10 md:gap-14">
        {/* ── Hero ── */}
        <section className="relative overflow-hidden rounded-[40px] bg-[linear-gradient(145deg,_#080e1a_0%,_#0d1a30_40%,_#1a3060_100%)] shadow-[0_28px_70px_rgba(8,14,26,0.22)]">
          <div className="pointer-events-none absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)", backgroundSize: "26px 26px" }} />
          <div className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full bg-[#8df0cf]/14 blur-[70px]" />
          <div className="pointer-events-none absolute -bottom-12 right-10 h-60 w-60 rounded-full bg-[#a4d8ff]/14 blur-[70px]" />
          <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[#8df0cf] via-[#ffe98b] to-[#ffb58f]" />
          <div className="relative grid gap-0 lg:grid-cols-[1.02fr_0.98fr]">
            <div className="flex flex-col justify-center p-7 md:p-10">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#8df0cf]/25 bg-[#8df0cf]/10 px-3.5 py-1.5">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#8df0cf] opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#8df0cf]" />
                </span>
                <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#8df0cf]/90">{copy.hero.eyebrow}</span>
              </div>
              <h1 className="mt-4 text-2xl font-black leading-[1.18] tracking-[-0.04em] text-white [text-wrap:balance] sm:text-3xl md:text-[2.4rem] md:leading-[1.12]">
                {copy.hero.title}
              </h1>
              <div className="mt-4 h-px w-full max-w-sm bg-gradient-to-r from-[#8df0cf]/30 to-transparent" />
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-400 md:text-[17px] md:leading-8">
                {copy.hero.description}
              </p>
            </div>
            <div className="border-l border-white/10 p-4 md:p-6">
              <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-slate-900/80 shadow-[0_24px_60px_rgba(15,23,42,0.28)]">
                <div className="aspect-[4/3]">
                  {heroMedia.mediaType === "image" && heroMedia.src ? (
                    <Image src={heroMedia.src} alt={copy.hero.mediaTitle} fill className="h-full w-full object-cover" unoptimized />
                  ) : heroMedia.mediaType === "video" && heroMedia.src ? (
                    <video className="h-full w-full object-cover" src={heroMedia.src} autoPlay muted loop playsInline />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,_#1f2937_0%,_#111827_100%)] p-8 text-center">
                      <div>
                        <div className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-100">{copy.hero.mediaTitle}</div>
                        <p className="mt-4 max-w-md text-base leading-8 text-slate-200">{copy.hero.mediaDescription}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Exhibitions (신설 · 오더 #C49 [1] · ticket-booking.ts 재사용) ── */}
        <section className="space-y-6">
          <SectionTitle eyebrow={copy.exhibitions.eyebrow} title={copy.exhibitions.title} desc={copy.exhibitions.desc} />
          {exhibitions.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {exhibitions.map((ex) => (
                <ExhibitionCard key={ex.id} exhibition={ex} locale={locale} labels={copy.exhibitions} />
              ))}
            </div>
          ) : (
            <PremiumCard className="p-8 text-center">
              <p className="text-base font-black tracking-tight text-slate-950 sm:text-lg">
                {copy.exhibitions.emptyPlaceholder}
              </p>
            </PremiumCard>
          )}
          <div className="flex justify-end">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-950 transition hover:border-slate-950 hover:shadow-md"
            >
              {copy.exhibitions.ctaMore}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* ── PLACES ── PremiumCard 재사용 · spots 0건이면 placeholder. */}
        <section className="space-y-6">
          <SectionTitle eyebrow={copy.places.eyebrow} title={copy.places.title} desc={copy.places.desc} />
          <PremiumCard className="p-8 text-center">
            <p className="text-base font-black tracking-tight text-slate-950 sm:text-lg">
              {copy.places.placeholder}
            </p>
          </PremiumCard>
        </section>

        {/* ── GOYANG MOVE ── */}
        <section className="space-y-6">
          <SectionTitle eyebrow={copy.move.eyebrow} title={copy.move.title} desc={copy.move.desc} />
          <PremiumCard className="p-8 text-center">
            <p className="text-base font-black tracking-tight text-slate-950 sm:text-lg">
              {copy.move.placeholder}
            </p>
          </PremiumCard>
        </section>

        {/* ── Catalog Bridge (당일코스 진입) ── */}
        <section className="flex justify-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#10203a] to-[#1e3a6e] px-6 py-3 text-sm font-bold text-white shadow-[0_8px_20px_rgba(16,32,58,0.20)] transition hover:brightness-110"
          >
            {copy.catalogViewAll}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </section>

        {/* ── Final CTA ── */}
        <section className="relative overflow-hidden rounded-[40px] bg-[linear-gradient(145deg,_#080e1a_0%,_#0d1a30_40%,_#1a3060_100%)] p-10 text-white shadow-[0_28px_70px_rgba(8,14,26,0.22)] md:p-14">
          <div className="pointer-events-none absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)", backgroundSize: "26px 26px" }} />
          <div className="pointer-events-none absolute -right-12 -top-12 h-60 w-60 rounded-full bg-[#8df0cf]/14 blur-[70px]" />
          <div className="pointer-events-none absolute -bottom-10 left-1/4 h-48 w-48 rounded-full bg-[#ffb58f]/12 blur-[60px]" />
          <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[#8df0cf] via-[#ffe98b] to-[#ffb58f]" />
          <div className="relative max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#ffe98b]/25 bg-[#ffe98b]/10 px-3.5 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#ffe98b]" />
              <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#ffe98b]/90">FINAL CTA</span>
            </div>
            <h2 className="mt-5 text-3xl font-black tracking-[-0.04em] text-white [text-wrap:balance] md:text-[2.8rem] md:leading-[1.12]">
              {copy.final.title}
            </h2>
            <div className="mt-5 h-px w-full bg-gradient-to-r from-[#8df0cf]/30 to-transparent" />
            <p className="mt-5 text-base leading-8 text-slate-400 md:text-lg">
              {copy.final.description}
            </p>
          </div>
        </section>
      </div>
    </Shell>
  );
}

// ─── Exhibition Card ─────────────────────────────────────────────
// 기존 /products/{id}/reservation 라우트 재사용 · 신규 결제 로직 0.
function ExhibitionCard({
  exhibition,
  locale,
  labels,
}: {
  exhibition: TicketProduct & { startIso: string };
  locale: PageLocale;
  labels: DmcCopy["exhibitions"];
}) {
  const venue = pickLocalizedVenue(exhibition, locale);
  return (
    <article className="group overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_4px_14px_rgba(16,32,58,0.06)] transition hover:border-slate-950 hover:shadow-md">
      {exhibition.imageUrl ? (
        <div className="relative aspect-[16/9] w-full bg-slate-100">
          <Image src={exhibition.imageUrl} alt={exhibition.title} fill className="object-cover" sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw" />
        </div>
      ) : (
        <div
          aria-hidden="true"
          className={`relative flex aspect-[16/9] w-full items-end bg-gradient-to-br ${exhibition.imageTone} p-4`}
        >
          <span className="text-2xl font-black uppercase tracking-[0.14em] text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.35)]">
            {exhibition.posterLabel}
          </span>
        </div>
      )}
      <div className="flex flex-col gap-2 p-5">
        <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--accent)]">
          {exhibition.badge}
        </div>
        <h3 className="text-base font-black leading-tight tracking-[-0.02em] text-slate-950 sm:text-lg">
          {exhibition.title}
        </h3>
        {exhibition.subtitle && (
          <p className="text-sm text-slate-600">{exhibition.subtitle}</p>
        )}
        <div className="mt-2 flex items-start gap-2 text-xs text-slate-600">
          <MapPin className="mt-0.5 h-3 w-3 shrink-0" aria-hidden="true" />
          <span>{venue}</span>
        </div>
        <div className="flex items-start gap-2 text-xs text-slate-600">
          <Calendar className="mt-0.5 h-3 w-3 shrink-0" aria-hidden="true" />
          <span>{exhibition.dateText}</span>
        </div>
        <Link
          href={`/products/${exhibition.id}/reservation`}
          className="mt-3 inline-flex items-center justify-center gap-1.5 rounded-full bg-slate-950 px-4 py-2 text-xs font-bold text-white transition hover:brightness-110"
        >
          {labels.ctaTicket}
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </article>
  );
}
