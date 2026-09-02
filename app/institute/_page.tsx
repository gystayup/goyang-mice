import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";

import PremiumCard from "@/components/common/PremiumCard";
import SectionTitle from "@/components/common/SectionTitle";
import Shell from "@/components/layout/Shell";
import { Link } from "@/lib/navigation";

// /institute 는 "누가 하는가" 만 담는다. 홈에서 이관되어 있던 방문객·상품
// 카탈로그 5블록 중 4블록(HeroSection · WhyGoyangSection ·
// ProductPreviewSection · ContactCtaSection)은 오더 #P2 [1] 로 제거.
// 상품 정보는 /products 링크 하나로 유도.
// NewsSection 은 "연구소 소식" 이라 정체성 블록으로 유지.
import NewsSection from "@/components/home/NewsSection";

export type PageLocale = "ko" | "en" | "ja" | "zh-CN" | "zh-TW";

function getInstituteCopy(locale: PageLocale) {
  if (locale === "ja") {
    return {
      metadata: { title: "研究所紹介", description: "高陽の文化、観光、MICE、ライフスタイル資産をつなぐ研究所のビジョンと運営方針をご紹介します。" },
      title: "高陽の文化・観光・MICE・ローカルライフスタイルをつなぎ、都市の新たな体験を創ります。",
      desc: "高陽の資産をコンテンツ、プログラム、滞在型サービス、地域体験へとつなぐ都市プラットフォームを構築しています。",
      leadership: {
        eyebrow: "Leadership Message",
        quote: "高陽の資産を研究にとどめず、人々が実際に利用できるサービスと運営構造へとつなげます。",
        desc: "研究所は分析と戦略提案にとどまらず、プログラム企画・予約構造・現場運営までつながる実行型プラットフォームを目指します。高陽の文化観光資産が実際のプログラムと都市体験として実現できる構造を設計します。",
      },
      principles: [
        { title: "Vision", text: "高陽の文化、観光、MICE、ライフスタイル資産をつなぐ都市体験プラットフォームになることを目指します。" },
        { title: "Mission", text: "研究結果をコンテンツ、プログラム、滞在型サービス、運営モデルに変換し、実際に機能させます。" },
        { title: "Value", text: "都市資産、地域産業、現場運営可能性をひとつの実務構造でつなぎます。" },
      ],
      direction: {
        title: "運営方針",
        desc: "研究所は分析にとどまらず、実行まで繋げます。研究結果をプログラム・予約サービス・現場運営構造へと変換し、訪問者と地域パートナーが共に体感できる実質的なプラットフォームを構築します。",
      },
      functions: {
        title: "コア機能",
        items: ["文化・観光・MICEをつなぐ戦略研究", "ローカルライフスタイル基盤のコンテンツ・プログラム企画", "訪問者ジャーニー設計と地域産業連携", "DMCサービス提案と現場運営構造設計"],
      },
      ctas: { research: "研究分野を見る", contact: "お問い合わせ" },
      productsLink: "日帰り旅行を見る →",
    };
  }

  if (locale === "zh-CN") {
    return {
      metadata: { title: "研究所介绍", description: "介绍连接高阳文化、旅游、MICE与生活方式资产的研究所愿景及运营方向。" },
      title: "连接高阳的文化·旅游·MICE·在地生活方式，创造城市全新体验。",
      desc: "我们正在构建一个将高阳资产转化为内容、项目、驻留型服务与地区体验的城市平台。",
      leadership: {
        eyebrow: "Leadership Message",
        quote: "不让高阳的资产止步于研究，而是将其转化为人们可实际使用的服务与运营结构。",
        desc: "研究所不止于分析与战略提案，而是致力于构建连接项目策划、预约结构与现场运营的执行型平台。我们设计能让高阳文化旅游资产真正落地为项目与城市体验的整体结构。",
      },
      principles: [
        { title: "Vision", text: "成为连接高阳文化、旅游、MICE与生活方式资产的城市体验平台。" },
        { title: "Mission", text: "将研究成果转化为内容、项目、驻留型服务与运营模型，使其真正落地运转。" },
        { title: "Value", text: "将城市资产、地区产业与可落地运营能力整合为一套实务结构。" },
      ],
      direction: {
        title: "运营方向",
        desc: "研究所从分析延伸至执行。将研究结果转化为项目、预约服务与现场运营结构，构建访客与本地合作伙伴均可切实感受到的实质性平台。",
      },
      functions: {
        title: "核心职能",
        items: ["连接文化·旅游·MICE的战略研究", "基于在地生活方式的内容·项目策划", "访客旅程设计与地区产业联动", "DMC服务提案与现场运营结构设计"],
      },
      ctas: { research: "查看研究领域", contact: "联系我们" },
      productsLink: "查看一日游 →",
    };
  }

  if (locale === "zh-TW") {
    return {
      metadata: { title: "研究所介紹", description: "介紹連結高陽文化、旅遊、MICE與生活風格資產的研究所願景及營運方向。" },
      title: "連結高陽的文化·旅遊·MICE·在地生活風格，創造城市全新體驗。",
      desc: "我們正在構建一個將高陽資產轉化為內容、方案、駐留型服務與地區體驗的城市平台。",
      leadership: {
        eyebrow: "Leadership Message",
        quote: "不讓高陽的資產止步於研究，而是將其轉化為人們可實際使用的服務與營運結構。",
        desc: "研究所不止於分析與策略提案，而是致力於構建連結方案規劃、預約結構與現場營運的執行型平台。我們設計能讓高陽文化旅遊資產真正落地為方案與城市體驗的整體結構。",
      },
      principles: [
        { title: "Vision", text: "成為連結高陽文化、旅遊、MICE與生活風格資產的城市體驗平台。" },
        { title: "Mission", text: "將研究成果轉化為內容、方案、駐留型服務與營運模型，使其真正落地運作。" },
        { title: "Value", text: "將城市資產、地區產業與可落地營運能力整合為一套實務結構。" },
      ],
      direction: {
        title: "營運方向",
        desc: "研究所從分析延伸至執行。將研究結果轉化為方案、預約服務與現場營運結構，構建訪客與在地合作夥伴均可切實感受到的實質性平台。",
      },
      functions: {
        title: "核心職能",
        items: ["連結文化·旅遊·MICE的策略研究", "基於在地生活風格的內容·方案規劃", "訪客旅程設計與地區產業聯動", "DMC服務提案與現場營運結構設計"],
      },
      ctas: { research: "查看研究領域", contact: "聯絡我們" },
      productsLink: "查看一日遊 →",
    };
  }

  if (locale === "en") {
    return {
      metadata: {
        title: "Institute",
        description:
          "Explore the vision, mission, and operating direction of the institute connecting Goyang's culture, tourism, MICE, and lifestyle assets.",
      },
      title: "We connect culture, tourism, MICE, and lifestyle to create new urban experiences in Goyang.",
      desc:
        "We are building an urban platform that connects Goyang's assets to content, programs, stay services, and local experiences.",
      leadership: {
        eyebrow: "Leadership Message",
        quote:
          "We connect Goyang's assets not only to research, but also to services and operations people can actually use.",
        desc:
          "The institute links research, planning, booking structures, and operations so that Goyang's cultural and tourism resources become practical programs and visible city experiences.",
      },
      principles: [
        {
          title: "Vision",
          text: "To become a platform that connects Goyang's cultural, tourism, MICE, and lifestyle assets into a new city experience structure.",
        },
        {
          title: "Mission",
          text: "To translate research into content, programs, stay services, and operational models that can actually run.",
        },
        {
          title: "Value",
          text: "To connect urban assets, local industry, and feasible operations into one practical framework.",
        },
      ],
      direction: {
        title: "Operating Direction",
        desc:
          "We work from research to execution. Rather than stopping at analysis, we connect findings to programs, reservation services, and operational structures that can support visitors and local partners together.",
      },
      functions: {
        title: "Core Functions",
        items: [
          "Strategic research connecting culture, tourism, and MICE.",
          "Content, program, and stay-service planning based on local lifestyle.",
          "Visitor journey design and local-industry connection.",
          "DMC proposal and field-operation planning.",
        ],
      },
      ctas: {
        research: "View Research",
        contact: "Contact Us",
      },
      productsLink: "See day trips →",
    };
  }

  return {
    metadata: {
      title: "연구소 소개",
      description:
        "고양의 문화, 관광, MICE, 라이프스타일 자산을 연결하는 연구소의 비전과 운영 방향을 소개합니다.",
    },
    title: "고양의 문화·관광·MICE·로컬라이프스타일을 연결해 도시의 새로운 경험을 만듭니다.",
    desc:
      "고양의 자산을 콘텐츠, 프로그램, 체류형 서비스와 지역 경험으로 연결하는 도시 플랫폼을 만들어갑니다.",
    leadership: {
      eyebrow: "Leadership Message",
      quote:
        "고양의 자산을 연구에만 머무르게 하지 않고, 사람들이 실제로 이용할 수 있는 서비스와 운영 구조로 연결합니다.",
      desc:
        "연구소는 분석과 전략 제안에 머무르지 않고, 프로그램 기획과 예약 구조, 현장 운영까지 이어지는 실행형 플랫폼을 지향합니다. 고양의 문화관광 자산이 실제 프로그램과 도시 경험으로 이어질 수 있도록 구조를 설계합니다.",
    },
    principles: [
      {
        title: "Vision",
        text: "고양의 문화, 관광, MICE, 라이프스타일 자산을 연결하는 도시 경험 플랫폼이 되는 것을 목표로 합니다.",
      },
      {
        title: "Mission",
        text: "연구 결과를 콘텐츠, 프로그램, 체류형 서비스, 운영 모델로 번역해 실제로 작동하게 만듭니다.",
      },
      {
        title: "Value",
        text: "도시 자산, 지역 산업, 현장 운영 가능성을 하나의 실무 구조로 연결합니다.",
      },
    ],
    direction: {
      title: "운영 방향",
      desc:
        "연구소는 분석에서 끝나지 않고 실행까지 이어집니다. 연구 결과를 프로그램, 예약 서비스, 현장 운영 구조로 연결해 방문객과 지역 파트너가 함께 체감할 수 있는 실질적 플랫폼을 구축합니다.",
    },
    functions: {
      title: "핵심 기능",
      items: [
        "문화·관광·MICE를 연결하는 전략 연구",
        "로컬 라이프스타일 기반 콘텐츠·프로그램 기획",
        "방문객 여정 설계와 지역 산업 연계",
        "DMC 서비스 제안과 현장 운영 구조 설계",
      ],
    },
    ctas: {
      research: "연구 분야 보기",
      contact: "문의하기",
    },
    // 오더 #FINAL PART B [B-1]: /products → 당일코스 재편에 맞춰 5로케일 갱신.
    productsLink: "당일코스 보기 →",
  };
}

export function getInstituteMetadata(locale: PageLocale): Metadata {
  const copy = getInstituteCopy(locale);

  return {
    title: copy.metadata.title,
    description: copy.metadata.description,
    alternates: {
      canonical: `/${locale}/institute`,
    },
  };
}

export const metadata = getInstituteMetadata("ko");

export default async function InstitutePage({ locale = "ko" }: { locale?: PageLocale }) {
  const copy = getInstituteCopy(locale);

  return (
    <Shell>
      <div className="mx-auto max-w-7xl px-6 py-16">
        <SectionTitle eyebrow="Institute" title={copy.title} desc={copy.desc} />

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <PremiumCard>
            <div className="text-sm font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">
              {copy.leadership.eyebrow}
            </div>
            <blockquote className="mt-5 text-2xl font-black leading-snug tracking-tight text-[#232322]">
              {copy.leadership.quote}
            </blockquote>
            <p className="mt-5 text-sm leading-8 text-[#232322]/70">
              {copy.leadership.desc}
            </p>
          </PremiumCard>

          <div className="grid gap-4">
            {copy.principles.map((item) => (
              <PremiumCard key={item.title}>
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#232322]/50">
                  {item.title}
                </div>
                <div className="mt-3 text-lg font-black tracking-tight text-[#232322]">
                  {item.text}
                </div>
              </PremiumCard>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <PremiumCard>
            <h2 className="text-2xl font-black tracking-tight text-[#232322]">
              {copy.direction.title}
            </h2>
            <p className="mt-4 text-sm leading-8 text-[#232322]/70">
              {copy.direction.desc}
            </p>
          </PremiumCard>

          <PremiumCard>
            <h2 className="text-2xl font-black tracking-tight text-[#232322]">
              {copy.functions.title}
            </h2>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-[#232322]/70">
              {copy.functions.items.map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
          </PremiumCard>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/research"
            className="inline-flex items-center gap-2 rounded-full bg-[#232322] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#232322]/85"
          >
            {copy.ctas.research}
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full border border-[#232322]/20 px-6 py-3 text-sm font-semibold text-[#232322]/80 transition-colors hover:border-[#D4AF37] hover:text-[#D4AF37]"
          >
            {copy.ctas.contact}
          </Link>
        </div>
      </div>

      {/* 연구소 소식 — 자체 <section> 컨테이너·패딩을 가지므로 max-w-7xl 랩퍼 밖으로 배치. */}
      <NewsSection locale={locale} />

      {/* B1~B4 삭제 자리 — /products 진입점 하나만 (오더 #P2 [1]). */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="flex justify-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-full border border-[#232322]/20 px-6 py-3 text-sm font-semibold text-[#232322]/80 transition-colors hover:border-[#D4AF37] hover:text-[#D4AF37]"
          >
            {copy.productsLink}
          </Link>
        </div>
      </section>
    </Shell>
  );
}
