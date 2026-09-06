import type { Metadata } from "next";
// 오더 #C65 [1]-A: 핵심역할 아이콘 세련화 — Search/Sparkles/Recycle/Network →
//   Telescope/Palette/RefreshCw/Share2 로 교체.
import { Palette, RefreshCw, Share2, Telescope } from "lucide-react";

import PremiumCard from "@/components/common/PremiumCard";
import SectionTitle from "@/components/common/SectionTitle";
import Shell from "@/components/layout/Shell";
import { Link } from "@/lib/navigation";
// 오더 #C54 [1]-B: DMC 4블록 (Pillars·UseCases·Steps·Partners) 제거 →
//   연구소 정체성 3섹션으로 교체. data/dmc-service-blocks.ts 는 무접촉
//   (import 만 끊고 파일 자체는 남긴다).
// NewsSection 은 "연구소 소식" 이라 정체성 블록으로 유지.
import NewsSection from "@/components/home/NewsSection";
// 오더 #C53-R [1]-B: /research 에서 이관된 아카이브 클라이언트 블록.
import ResearchArchive from "@/components/institute/ResearchArchive";

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

  // 오더 #C54 [1]-A: ko 문안 교체.
  //   연구소 정체성(연구·문화관광 콘텐츠 개발·지역경제 선순환)으로 전환.
  //   en/ja/zh 브랜치는 추후 번역 오더에서 갱신 (이번 오더 무접촉).
  //   ctas.research 키는 남기지만 렌더 참조는 [1]-C 에서 제거됨.
  return {
    metadata: {
      title: "연구소 소개",
      description:
        "고양의 문화, 관광, MICE, 라이프스타일 자산을 연결하는 연구소의 비전과 운영 방향을 소개합니다.",
    },
    // 오더 #C64 [1]-A: ko 문안 압축 (title 불변, en/ja/zh 무접촉).
    title: "고양의 문화·관광·MICE를 연구하고, 지역경제로 순환시킵니다.",
    desc:
      "도시의 자산을 연구하고 콘텐츠로 개발해, 지역 사업자와 지역경제로 되돌립니다.",
    leadership: {
      eyebrow: "Leadership Message",
      quote:
        "연구는 보고서로 끝나지 않습니다. 지역이 쓸 수 있는 성과로 이어져야 합니다.",
      desc:
        "분석과 제안에 머무르지 않고, 연구를 콘텐츠·프로그램으로 개발합니다. 그 성과가 지역 사업자와 지역경제로 돌아오는 구조를 설계합니다.",
    },
    principles: [
      {
        title: "Vision",
        text: "고양의 문화·관광·MICE를 지역경제로 잇는 전문 연구소.",
      },
      {
        title: "Mission",
        text: "연구를 콘텐츠·프로그램으로 개발해 지역이 실제로 활용하게 합니다.",
      },
      {
        title: "Value",
        text: "연구·개발·지역경제를 하나의 실무 구조로 잇습니다.",
      },
    ],
    direction: {
      title: "운영 방향",
      desc:
        "연구소는 분석에서 끝나지 않고 개발과 실행으로 이어집니다. 문화·관광·MICE 연구 결과를 콘텐츠·프로그램·운영 모델로 개발하고, 지역 사업자와 함께 도시의 성과로 실현합니다.",
    },
    functions: {
      title: "핵심 기능",
      items: [
        "문화·관광·MICE 정책·산업·수요 연구",
        "지역 자산의 문화관광 콘텐츠·프로그램 개발",
        "지역 사업자·산업 연계와 지역경제 선순환 설계",
        "MICE·관광 생태계 네트워크 구축과 운영 모델 제안",
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
      <div className="mx-auto max-w-7xl px-6 py-12">
        <SectionTitle eyebrow="Institute" title={copy.title} desc={copy.desc} />

        {/* 오더 #C64 [1]-B: 상단 그리드 재배치.
           기존: lg:grid-cols-[1.1fr_0.9fr] 로 좌 리더십 / 우 V/M/V 세로 3개 →
                우측 V/M/V 세로 스택이 짧아 리더십 카드 아래 흰 여백이 크게 남음.
           변경: 리더십 카드를 가로 전폭 단독으로, 그 아래 md:grid-cols-3 로
                V/M/V 를 가로 3칸 배치 → 리더십 카드 하단 여백이 사라짐. */}
        <div className="mt-10">
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
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
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

        {/* 오더 #C53-R [1]-B: /research 에서 이관된 아카이브 블록.
            상단 정체성 그리드 바로 아래에 배치 (KCTI 벤치마크). */}
        <div className="mt-10">
          <ResearchArchive locale={locale} />
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

        {/* 오더 #C54 [1]-C: /research 는 #C53-R 에서 /institute 로 301
           리다이렉트되므로 "연구 분야 보기" 버튼은 자기 페이지로 되돌아온다.
           해당 버튼 제거, "문의하기" 만 유지. ctas.research 키는 다른 로케일
           호환성을 위해 문안 정의부에는 남겨둠. */}
        {/* 오더 #C63 [1]-D: 페이지 주버튼 통일. 차콜 solid → 코럴 solid. */}
        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full bg-[#e23e2e] px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110"
          >
            {copy.ctas.contact}
          </Link>
        </div>
      </div>

      {/* 오더 #C54 [1]-B: 하단 DMC 4블록 (Pillars·UseCases·Steps·Partners) 제거 →
         연구소 정체성 3섹션 (핵심 역할 · 지역경제 선순환 · 연구·개발 영역 +
         협력 네트워크). 카드 스타일은 기존 톤 재사용. ko 하드코딩 (다른 로케일
         ko 폴백 허용, 오더 규범). data/dmc-service-blocks.ts 는 무접촉. */}
      <div className="mx-auto flex max-w-7xl flex-col gap-14 px-6 pb-16">
        {/* 신규 1 — 연구소 핵심 역할 4카드
           오더 #C63 [1]-A: 병렬 역할이므로 번호 제거. PremiumCard 로 통일하고
             제목 위에 코럴 lucide 아이콘.
           오더 #C65 [1]-A/B: 아이콘 세련화 — 뜬 선 아이콘을 44px rounded-xl
             소프트 코럴→피치 그라디언트 틴트 타일 안으로. 아이콘도 의미에 맞게
             교체 (Telescope/Palette/RefreshCw/Share2). */}
        <section className="space-y-8">
          <SectionTitle eyebrow="핵심 역할" title="연구소가 하는 네 가지 일" />
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {[
              { title: "연구", description: "문화·관광·MICE 정책·시장·수요를 분석하고 도시 전략을 제안합니다.", Icon: Telescope },
              { title: "문화관광 콘텐츠 개발", description: "지역 자산을 방문·체류·소비로 이어지는 콘텐츠와 프로그램으로 만듭니다.", Icon: Palette },
              { title: "지역경제 선순환", description: "연구·콘텐츠의 성과가 지역 사업자와 지역경제로 환류되도록 설계합니다.", Icon: RefreshCw },
              { title: "산업 생태계 연계", description: "문화·관광·MICE·로컬 산업을 하나의 네트워크로 연결합니다.", Icon: Share2 },
            ].map(({ title, description, Icon }) => (
              <PremiumCard key={title} className="p-6">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[linear-gradient(135deg,rgba(226,62,46,0.12),rgba(255,181,143,0.14))]">
                  <Icon className="h-[22px] w-[22px] text-[#e23e2e]" aria-hidden="true" />
                </div>
                <div className="text-[1.2rem] font-black tracking-[-0.04em] text-[#232322]">
                  {title}
                </div>
                <p className="mt-3 text-[15px] leading-7 text-slate-500">
                  {description}
                </p>
              </PremiumCard>
            ))}
          </div>
        </section>

        {/* 신규 2 — 지역경제 선순환 4단계
           오더 #C63 [1]-B: 흐름이므로 번호 유지. 4색 파스텔 배지 배열 제거하고
           단일 코럴 원형 bg-[#e23e2e] text-white 로 통일. */}
        <section className="space-y-8">
          <SectionTitle eyebrow="지역경제 선순환" title="연구가 지역경제로 순환하는 구조" />
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {[
              { title: "연구·분석", description: "도시 자산과 시장·수요를 연구합니다." },
              { title: "콘텐츠·프로그램 개발", description: "연구 결과를 방문·체류형 콘텐츠로 개발합니다." },
              { title: "방문·소비 창출", description: "콘텐츠가 방문객의 이동·체류·소비로 이어집니다." },
              { title: "지역 환류·재투자", description: "성과가 지역 사업자 수익과 도시 재투자로 순환합니다." },
            ].map((item, index) => (
              <PremiumCard key={item.title} className="p-6">
                <div className="mb-4 inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#e23e2e] text-sm font-black text-white">
                  {index + 1}
                </div>
                <div className="text-[1.1rem] font-black tracking-[-0.03em] text-[#232322]">
                  {item.title}
                </div>
                <p className="mt-3 text-sm leading-7 text-slate-500">
                  {item.description}
                </p>
              </PremiumCard>
            ))}
          </div>
        </section>

        {/* 신규 3 — 연구·개발 영역 + 협력 네트워크 CTA
           오더 #C63 [1]-C: 우 카드 border-white/80·bg-white/60·backdrop-blur·shadow·
           무지개 top bar 제거 → PremiumCard 로. eyebrow 골드 대문자 → 코럴 소형.
           CTA 는 bg-[#ffe7b3] 파스텔 → bg-[#e23e2e] 코럴 solid.
           좌 카드는 골드 불릿 그대로 유지, 제목 색만 브랜드 톤으로 정리. */}
        <section className="grid gap-5 lg:grid-cols-2">
          <PremiumCard className="p-7">
            <h2 className="text-[1.2rem] font-black tracking-[-0.03em] text-[#232322]">
              연구·개발 영역
            </h2>
            <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-600">
              {[
                "문화관광 정책·전략 연구",
                "MICE 산업·행사 기획",
                "로컬 라이프스타일 콘텐츠 개발",
                "지역 산업·상권 연계",
                "도시 브랜드·마케팅",
              ].map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#D4AF37]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </PremiumCard>

          <PremiumCard className="p-7">
            <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#e23e2e]">
              협력 네트워크
            </div>
            <h2 className="mt-4 text-[1.4rem] font-black leading-snug tracking-[-0.03em] text-[#232322]">
              고양의 문화관광·MICE 생태계와 함께합니다
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              연구소는 지역 사업자, 기관, 산업 파트너와 협력해 연구를 실제 성과로 연결합니다.
            </p>
            <div className="mt-6">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full bg-[#e23e2e] px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110"
              >
                협력·연구 문의하기
              </Link>
            </div>
          </PremiumCard>
        </section>
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
