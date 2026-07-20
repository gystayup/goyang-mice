
import { BookOpen, MapPin, Sparkles } from "lucide-react";

import HeroMediaCarousel from "@/components/home/HeroMediaCarousel";
import ExpandableStats from "@/components/home/ExpandableStats";

type LocaleKey = "ko" | "en" | "ja" | "zh-CN" | "zh-TW";

type LocaleCopy = {
  badgeEyebrow: string;
  badgeTitle: string;
  cards: Array<{ eyebrow: string; title: string; desc: string; tone: string; iconTone: string; borderGlow: string; icon: typeof BookOpen }>;
  stats: Array<{ value: string; label: string; tone: string }>;
};

const LOCALES: LocaleKey[] = ["ko", "en", "ja", "zh-CN", "zh-TW"];

const heroCopy: Record<LocaleKey, LocaleCopy> = {
  ko: {
    badgeEyebrow: "고양 방문경험 연구·연계 플랫폼",
    badgeTitle: "고양 방문경험 연구·연계 플랫폼",
    cards: [
      { eyebrow: "Research", title: "고양특례시 문화·관광·마이스 전략 연구", desc: "도시 자산 분석과 방문객 여정 설계를 기반으로 실행 가능한 기획 구조를 만듭니다.", tone: "bg-gradient-to-br from-[#fffbee] to-[#fff4da]", iconTone: "bg-[#ffe8a0] text-[#9b7a00]", borderGlow: "hover:shadow-[0_0_24px_rgba(255,233,139,0.45)]", icon: BookOpen },
      { eyebrow: "DMC", title: "현장을 움직이는 로컬 운영 서비스", desc: "공연, 전시, VIP, 단체 방문객을 위한 일정 설계와 현장 대응을 통합 지원합니다.", tone: "bg-gradient-to-br from-[#f0fdf8] to-[#e8fbf3]", iconTone: "bg-[#b7f0d8] text-[#0a6b48]", borderGlow: "hover:shadow-[0_0_24px_rgba(141,240,207,0.45)]", icon: MapPin },
      { eyebrow: "Experience", title: "머무르고 이어지는 체류 경험", desc: "카페, 미식, 로컬 체험, 쇼핑 동선을 연결해 고양만의 라이프스타일 경험을 확장합니다.", tone: "bg-gradient-to-br from-[#fff5f2] to-[#ffe7df]", iconTone: "bg-[#ffd0c0] text-[#9b3a1a]", borderGlow: "hover:shadow-[0_0_24px_rgba(255,143,126,0.45)]", icon: Sparkles },
    ],
    stats: [
      { value: "K-POP · KINTEX",    label: "공연, 전시, 비즈니스 방문이 이어지는 핵심 거점",            tone: "bg-[#fffdf0]" },
      { value: "5축 연결",           label: "공연, 전시, 관광, 숙박, 쇼핑·미식을 하나의 흐름으로 연결", tone: "bg-[#f0fdf8]" },
      { value: "운영형 DMC",         label: "기획부터 안내, 현장 운영까지 이어지는 실행 구조",            tone: "bg-[#f0f4ff]" },
      { value: "라이프스타일 확장",  label: "가족 체험과 상시 운영 콘텐츠로 체류 프로그램을 확대",       tone: "bg-[#fff6f2]" },
    ],
  },
  en: {
    badgeEyebrow: "Goyang Visit Experience Platform",
    badgeTitle: "Goyang Visit Experience Research & Connection Platform",
    cards: [
      { eyebrow: "Research", title: "Strategic research for culture, tourism and MICE", desc: "We build practical strategies based on city assets and visitor journey design.", tone: "bg-gradient-to-br from-[#fffbee] to-[#fff4da]", iconTone: "bg-[#ffe8a0] text-[#9b7a00]", borderGlow: "hover:shadow-[0_0_24px_rgba(255,233,139,0.45)]", icon: BookOpen },
      { eyebrow: "DMC", title: "Local operations that keep experiences moving", desc: "We support schedules, logistics and on-site coordination for events, buyers, VIPs and groups.", tone: "bg-gradient-to-br from-[#f0fdf8] to-[#e8fbf3]", iconTone: "bg-[#b7f0d8] text-[#0a6b48]", borderGlow: "hover:shadow-[0_0_24px_rgba(141,240,207,0.45)]", icon: MapPin },
      { eyebrow: "Experience", title: "Lifestyle journeys that extend the stay", desc: "We expand visits through dining, cafés, shopping and local lifestyle experiences.", tone: "bg-gradient-to-br from-[#fff5f2] to-[#ffe7df]", iconTone: "bg-[#ffd0c0] text-[#9b3a1a]", borderGlow: "hover:shadow-[0_0_24px_rgba(255,143,126,0.45)]", icon: Sparkles },
    ],
    stats: [
      { value: "K-POP · KINTEX",       label: "A key hub for performances, exhibitions and business visits",           tone: "bg-[#fffdf0]" },
      { value: "5 connected layers",    label: "Performance, exhibition, tourism, stay and dining in one flow",        tone: "bg-[#f0fdf8]" },
      { value: "Operations-first DMC",  label: "A practical structure from planning and guidance to field delivery",  tone: "bg-[#f0f4ff]" },
      { value: "Lifestyle expansion",   label: "Family-friendly programs and repeatable content that lengthen stays",  tone: "bg-[#fff6f2]" },
    ],
  },
  ja: {
    badgeEyebrow: "高陽市訪問体験研究・連携プラットフォーム",
    badgeTitle: "高陽市訪問体験研究・連携プラットフォーム",
    cards: [
      { eyebrow: "Research", title: "文化・観光・MICEの戦略研究", desc: "都市資産分析と訪問者ジャーニー設計に基づいた実行可能な企画構造を構築します。", tone: "bg-gradient-to-br from-[#fffbee] to-[#fff4da]", iconTone: "bg-[#ffe8a0] text-[#9b7a00]", borderGlow: "hover:shadow-[0_0_24px_rgba(255,233,139,0.45)]", icon: BookOpen },
      { eyebrow: "DMC", title: "現場を動かすローカル運営サービス", desc: "公演・展示・VIP・団体訪問客向けのスケジュール設計と現場対応を統合サポートします。", tone: "bg-gradient-to-br from-[#f0fdf8] to-[#e8fbf3]", iconTone: "bg-[#b7f0d8] text-[#0a6b48]", borderGlow: "hover:shadow-[0_0_24px_rgba(141,240,207,0.45)]", icon: MapPin },
      { eyebrow: "Experience", title: "滞在が続くライフスタイル体験", desc: "カフェ・グルメ・ローカル体験・ショッピングルートを連結し、高陽独自のライフスタイル体験を拡張します。", tone: "bg-gradient-to-br from-[#fff5f2] to-[#ffe7df]", iconTone: "bg-[#ffd0c0] text-[#9b3a1a]", borderGlow: "hover:shadow-[0_0_24px_rgba(255,143,126,0.45)]", icon: Sparkles },
    ],
    stats: [
      { value: "K-POP · KINTEX",    label: "公演・展示・ビジネス訪問が続く重要拠点",            tone: "bg-[#fffdf0]" },
      { value: "5軸連結",            label: "公演・展示・観光・宿泊・ショッピング&グルメを一つの流れに", tone: "bg-[#f0fdf8]" },
      { value: "運営型DMC",          label: "企画から案内・現場運営まで続く実行構造",            tone: "bg-[#f0f4ff]" },
      { value: "ライフスタイル拡張", label: "家族体験と常時運営コンテンツで滞在プログラムを拡大", tone: "bg-[#fff6f2]" },
    ],
  },
  "zh-CN": {
    badgeEyebrow: "高阳市访客体验研究与连接平台",
    badgeTitle: "高阳市访客体验研究与连接平台",
    cards: [
      { eyebrow: "Research", title: "文化·旅游·MICE战略研究", desc: "基于城市资产分析和访客旅程设计，构建可执行的规划结构。", tone: "bg-gradient-to-br from-[#fffbee] to-[#fff4da]", iconTone: "bg-[#ffe8a0] text-[#9b7a00]", borderGlow: "hover:shadow-[0_0_24px_rgba(255,233,139,0.45)]", icon: BookOpen },
      { eyebrow: "DMC", title: "驱动现场的本地运营服务", desc: "为演出、展览、VIP及团体访客提供行程设计与现场协调的一体化支持。", tone: "bg-gradient-to-br from-[#f0fdf8] to-[#e8fbf3]", iconTone: "bg-[#b7f0d8] text-[#0a6b48]", borderGlow: "hover:shadow-[0_0_24px_rgba(141,240,207,0.45)]", icon: MapPin },
      { eyebrow: "Experience", title: "延续的体验之旅", desc: "连接咖啡馆、美食、本地体验和购物路线，扩展高阳独特的生活方式体验。", tone: "bg-gradient-to-br from-[#fff5f2] to-[#ffe7df]", iconTone: "bg-[#ffd0c0] text-[#9b3a1a]", borderGlow: "hover:shadow-[0_0_24px_rgba(255,143,126,0.45)]", icon: Sparkles },
    ],
    stats: [
      { value: "K-POP · KINTEX",  label: "演出、展览、商务访问的核心据点",            tone: "bg-[#fffdf0]" },
      { value: "5轴联接",          label: "演出、展览、旅游、住宿、购物美食融为一体",  tone: "bg-[#f0fdf8]" },
      { value: "运营型DMC",        label: "从策划到指南、现场运营的完整执行结构",      tone: "bg-[#f0f4ff]" },
      { value: "生活方式延伸",     label: "通过家庭体验和常态运营内容扩展滞留项目",   tone: "bg-[#fff6f2]" },
    ],
  },
  "zh-TW": {
    badgeEyebrow: "高陽市訪客體驗研究與連接平台",
    badgeTitle: "高陽市訪客體驗研究與連接平台",
    cards: [
      { eyebrow: "Research", title: "文化·旅遊·MICE策略研究", desc: "基於城市資產分析與訪客旅程設計，構建可執行的規劃結構。", tone: "bg-gradient-to-br from-[#fffbee] to-[#fff4da]", iconTone: "bg-[#ffe8a0] text-[#9b7a00]", borderGlow: "hover:shadow-[0_0_24px_rgba(255,233,139,0.45)]", icon: BookOpen },
      { eyebrow: "DMC", title: "驅動現場的在地運營服務", desc: "為演出、展覽、VIP及團體訪客提供行程設計與現場協調的一體化支援。", tone: "bg-gradient-to-br from-[#f0fdf8] to-[#e8fbf3]", iconTone: "bg-[#b7f0d8] text-[#0a6b48]", borderGlow: "hover:shadow-[0_0_24px_rgba(141,240,207,0.45)]", icon: MapPin },
      { eyebrow: "Experience", title: "延續的體驗旅程", desc: "連結咖啡廳、美食、在地體驗與購物路線，擴展高陽獨特的生活風格體驗。", tone: "bg-gradient-to-br from-[#fff5f2] to-[#ffe7df]", iconTone: "bg-[#ffd0c0] text-[#9b3a1a]", borderGlow: "hover:shadow-[0_0_24px_rgba(255,143,126,0.45)]", icon: Sparkles },
    ],
    stats: [
      { value: "K-POP · KINTEX",  label: "演出、展覽、商務訪問的核心據點",            tone: "bg-[#fffdf0]" },
      { value: "5軸聯接",          label: "演出、展覽、旅遊、住宿、購物美食融為一體",  tone: "bg-[#f0fdf8]" },
      { value: "運營型DMC",        label: "從策劃到指南、現場運營的完整執行結構",      tone: "bg-[#f0f4ff]" },
      { value: "生活風格延伸",     label: "透過家庭體驗與常態運營內容擴展滯留計畫",   tone: "bg-[#fff6f2]" },
    ],
  },
};

export default async function HeroSection({ locale }: { locale: string }) {
  const activeLocale: LocaleKey = (LOCALES.includes(locale as LocaleKey) ? locale : "ko") as LocaleKey;
  const copy = heroCopy[activeLocale];

  return (
    <section className="relative overflow-hidden pb-12 pt-4 sm:pb-16 sm:pt-6 lg:pb-20">
      {/* 배경 글로우 오브 */}
      <div className="pointer-events-none absolute -left-24 top-8 h-64 w-64 rounded-full bg-[#8df0cf] opacity-20 blur-[80px]" />
      <div className="pointer-events-none absolute -right-20 top-16 h-72 w-72 rounded-full bg-[#a4d8ff] opacity-25 blur-[90px]" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-48 w-48 rounded-full bg-[#ffb58f] opacity-18 blur-[70px]" />

      {/* 캐러셀 */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <HeroMediaCarousel />
      </div>

      {/* 콘텐츠 카드 영역 */}
      <div className="mx-auto mt-8 max-w-7xl px-4 sm:mt-10 sm:px-6 lg:mt-12">
        <div className="relative overflow-hidden rounded-[30px] border border-white/80 bg-white/72 p-5 shadow-[0_20px_60px_rgba(16,32,58,0.10),_0_0_0_1px_rgba(255,255,255,0.6)] backdrop-blur-xl sm:rounded-[36px] sm:p-6 lg:p-8">

          {/* ── 플랫폼 타이틀 배너 ── */}
          <div className="relative overflow-hidden rounded-[22px] bg-[linear-gradient(135deg,_#080e1a_0%,_#10203a_30%,_#1a3060_60%,_#2d4a8a_100%)] px-6 py-7 sm:px-8 sm:py-8 lg:px-10 lg:py-9">
            {/* 격자 배경 */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.06]"
              style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.7) 1px, transparent 1px)", backgroundSize: "24px 24px" }}
            />
            {/* 글로우 오브 — 2개로 축소 (좌상 mint, 우하 sky) */}
            <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-[#8df0cf]/16 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-10 right-20 h-36 w-36 rounded-full bg-[#a4d8ff]/18 blur-3xl" />

            {/* 뱃지 */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#8df0cf]/30 bg-[#8df0cf]/12 px-3 py-1 backdrop-blur">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#8df0cf] opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#8df0cf]" />
              </span>
              <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#8df0cf]/90">
                {copy.badgeEyebrow}
              </span>
            </div>

            {/* 메인 타이틀 */}
            <h2 className="mt-4 text-[1.5rem] font-black leading-[1.2] tracking-[-0.03em] text-white [text-wrap:balance] sm:text-[1.9rem] lg:text-[2.4rem] lg:leading-[1.15]">
              {copy.badgeTitle}
            </h2>

            {/* 하단 장식 라인 */}
            <div className="mt-6 h-px w-full bg-gradient-to-r from-[#8df0cf]/50 via-[#ffe98b]/35 to-transparent" />
          </div>

          {/* ── 카드 3개 ── */}
          <div className="mt-4 grid gap-3 sm:gap-4 lg:grid-cols-3">
            {copy.cards.map((card) => {
              const Icon = card.icon;
              return (
                <article
                  key={card.eyebrow}
                  className={`group relative overflow-hidden rounded-[22px] border border-white/80 p-5 shadow-[0_8px_28px_rgba(16,32,58,0.07)] transition duration-300 hover:-translate-y-1 sm:p-6 ${card.tone} ${card.borderGlow}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl shadow-sm ${card.iconTone}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="inline-flex rounded-full border border-slate-200/70 bg-white/70 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500 backdrop-blur">
                      {card.eyebrow}
                    </span>
                  </div>
                  <h3 className="mt-4 text-lg font-black leading-[1.25] tracking-[-0.03em] text-slate-950 sm:text-xl">
                    {card.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-7 text-slate-500 sm:text-[15px]">{card.desc}</p>
                </article>
              );
            })}
          </div>

          {/* ── 통계 4개 접기/펼치기 ── */}
          <ExpandableStats stats={copy.stats} locale={locale} />
        </div>
      </div>
    </section>
  );
}
