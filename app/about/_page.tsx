import type { Metadata } from "next";
import { ArrowRight, Globe2, Layers3, Sparkles, Users2 } from "lucide-react";

import SectionTitle from "@/components/common/SectionTitle";
import Shell from "@/components/layout/Shell";
import { Link } from "@/lib/navigation";

export type PageLocale = "ko" | "en" | "ja" | "zh-CN" | "zh-TW";

function getAboutCopy(locale: PageLocale) {
  if (locale === "ja") {
    return {
      metadata: { title: "ABOUT", description: "GOYANG VIBE LABが文化、観光、MICE、ライフスタイル資産を実際のプログラムと運営構造につなぐ方法をご紹介します。" },
      eyebrow: "ABOUT GOYANG VIBE LAB",
      title: "高陽の資産を、訪問と滞在を生み出す体験へとキュレーションします。",
      desc: "GOYANG VIBE LABは高陽の文化、観光、MICE、ライフスタイル資産を研究し、それをプログラム・予約サービス・現場運営構造へとつなげます。",
      highlights: [
        { icon: Sparkles, value: "K-Culture", label: "公演、展示、都市ライフスタイルをひとつの物語でつなぐ研究軸です。" },
        { icon: Globe2, value: "Destination", label: "訪問者がより長く滞在し再訪したくなる都市体験設計です。" },
        { icon: Users2, value: "Hospitality", label: "VIP、バイヤー、家族、団体訪問客まで考慮した環境運営構造です。" },
        { icon: Layers3, value: "Platform", label: "研究と予約、運営、管理がひとつの構造でつながるプラットフォームです。" },
      ],
      who: {
        eyebrow: "Who We Are",
        quote: "良い研究は分析で終わらず、地域住民の生活に実質的な価値をもたらすべきです。",
        desc: "私たちは都市を説明するだけにとどまりません。都市資産をコンテンツ企画・予約サービス・パートナー運営・現場実行へとつなぎ、高陽をより体験しやすい形で設計します。",
      },
      pillars: [
        { title: "Strategy", desc: "高陽の文化、観光、MICE、ライフスタイル資産を明確な戦略方向へと整理します。", tone: "bg-[#fff3df]" },
        { title: "Experience", desc: "イベント、グルメ、滞在、ローカル体験をひとつの訪問旅程として設計します。", tone: "bg-[#eafbf4]" },
        { title: "Operation", desc: "企画から予約、パートナー、スケジュール、現場運営まで実際の実行構造でつなぎます。", tone: "bg-[#eef2ff]" },
      ],
      what: { eyebrow: "What We Do", title: "都市ブランディングから現場運営まで、ひとつの流れで設計します。" },
      capabilities: [
        { label: "Brand Narrative", title: "高陽のライフスタイルをブランドストーリーに整理します。", desc: "公演、展示、ライフスタイル、観光資産をポジショニングとプログラムコンセプトへつなげます。", tone: "bg-[#fff3df]" },
        { label: "Lifestyle Curation", title: "滞在する理由を企画します。", desc: "カフェ、グルメ、家族体験、ショッピング、ローカル空間をまとめて滞在型体験として提案します。", tone: "bg-[#eafbf4]" },
        { label: "DMC Delivery", title: "現場を動かす運営構造を作ります。", desc: "空港移動、宿泊、ダイニング、チケット、スケジュール運営をひとつの流れでつなぎます。", tone: "bg-[#eef2ff]" },
        { label: "Partner Network", title: "機関とパートナーを運営エコシステムにまとめます。", desc: "公演場、ホテル、飲食店、ローカル空間、サービス運営会社を実際の協業構造として設計します。", tone: "bg-[#ffe7df]" },
      ],
      story: {
        eyebrow: "Our Story",
        items: [
          { year: "01", title: "都市を読みます。", desc: "公演場、展示、観光拠点、ローカル空間、訪問フローを高陽全域で分析します。" },
          { year: "02", title: "研究をプログラムに変えます。", desc: "研究結果をコンテンツコンセプト・予約サービス・訪問者ジャーニーへ転換します。" },
          { year: "03", title: "運営構造へとつなげます。", desc: "パートナー構造・予約ロジック・現場シナリオを整理し、実際のプロジェクトとして実行します。" },
        ],
      },
      why: {
        eyebrow: "Why It Matters",
        title: "高陽は一度訪れる都市ではなく、また来たくなる都市であるべきです。",
        desc: "公演、観光、宿泊、ダイニング、ショッピング、ローカル体験が自然につながるよう設計し、訪問者の移動・滞在・消費が都市の中で広がることを目指します。",
        bullets: ["K-POPとKINTEX、文化需要をひとつの都市体験フローでつなぎます。", "文化、観光、MICE、ライフスタイルを分断せず統合構造で設計します。", "機関とパートナーが実際に共に使える実行型運営構造を作ります。"],
      },
      ctas: { research: "研究を見る", contact: "お問い合わせ" },
    };
  }

  if (locale === "zh-CN") {
    return {
      metadata: { title: "ABOUT", description: "介绍GOYANG VIBE LAB将文化、旅游、MICE与生活方式资产转化为实际项目与运营结构的方式。" },
      eyebrow: "ABOUT GOYANG VIBE LAB",
      title: "将高阳的资产策展为引领访问与驻留的体验。",
      desc: "GOYANG VIBE LAB研究高阳的文化、旅游、MICE与生活方式资产，并将其转化为项目、预约服务与现场运营结构。",
      highlights: [
        { icon: Sparkles, value: "K-Culture", label: "将演出、展览与城市生活方式融为一体叙事的研究方向。" },
        { icon: Globe2, value: "Destination", label: "让访客停留更久、愿意再次到访的城市体验设计。" },
        { icon: Users2, value: "Hospitality", label: "兼顾VIP、买家、家庭及团体访客的接待运营结构。" },
        { icon: Layers3, value: "Platform", label: "研究、预约、运营与管理在统一结构内协同运作的平台。" },
      ],
      who: {
        eyebrow: "Who We Are",
        quote: "好的研究不止于分析，更应为当地居民的生活带来实质性价值。",
        desc: "我们不止于解读城市。我们将城市资产连接至内容策划、预约服务、合作伙伴运营与现场执行，使高阳更易于被体验。",
      },
      pillars: [
        { title: "Strategy", desc: "将高阳的文化、旅游、MICE与生活方式资产整理为清晰的战略方向。", tone: "bg-[#fff3df]" },
        { title: "Experience", desc: "将活动、美食、住宿与本地体验设计为一体化访客旅程。", tone: "bg-[#eafbf4]" },
        { title: "Operation", desc: "从策划到预约、合作伙伴、日程与现场运营，以实际执行结构相互连结。", tone: "bg-[#eef2ff]" },
      ],
      what: { eyebrow: "What We Do", title: "从城市品牌塑造到现场运营，设计为一体化流程。" },
      capabilities: [
        { label: "Brand Narrative", title: "将高阳的生活方式整理为品牌故事。", desc: "将演出、展览、生活方式与旅游资产转化为定位策略与项目概念。", tone: "bg-[#fff3df]" },
        { label: "Lifestyle Curation", title: "策划停留的理由。", desc: "整合咖啡馆、美食、家庭体验、购物与本地空间，打造驻留型体验。", tone: "bg-[#eafbf4]" },
        { label: "DMC Delivery", title: "构建推动现场运作的运营结构。", desc: "将机场接送、住宿、餐饮、票务与日程运营整合为一体化流程。", tone: "bg-[#eef2ff]" },
        { label: "Partner Network", title: "将机构与合作伙伴整合为运营生态系统。", desc: "为演出场馆、酒店、餐厅、本地空间与服务运营商设计实际协作结构。", tone: "bg-[#ffe7df]" },
      ],
      story: {
        eyebrow: "Our Story",
        items: [
          { year: "01", title: "解读城市。", desc: "对高阳全域的演出场馆、展览、旅游据点、本地空间与访客流动进行分析。" },
          { year: "02", title: "将研究转化为项目。", desc: "将研究成果转化为内容概念、预约服务与访客旅程。" },
          { year: "03", title: "连接至运营结构。", desc: "整理合作伙伴结构、预约逻辑与现场方案，使其在实际项目中落地执行。" },
        ],
      },
      why: {
        eyebrow: "Why It Matters",
        title: "高阳应成为人们愿意再次到访的城市，而不只是路过一次的地方。",
        desc: "我们的目标是让演出、旅游、住宿、餐饮、购物与本地体验自然相连，使访客的出行、停留与消费在城市中自然延伸。",
        bullets: ["将K-POP、KINTEX与文化需求整合为一体化城市体验流程。", "以整合结构设计文化、旅游、MICE与生活方式，而非各自分立。", "构建机构与合作伙伴可实际共用的执行型运营结构。"],
      },
      ctas: { research: "查看研究", contact: "联系我们" },
    };
  }

  if (locale === "zh-TW") {
    return {
      metadata: { title: "ABOUT", description: "介紹GOYANG VIBE LAB將文化、旅遊、MICE與生活風格資產轉化為實際方案與營運結構的方式。" },
      eyebrow: "ABOUT GOYANG VIBE LAB",
      title: "將高陽的資產策展為引領訪問與駐留的體驗。",
      desc: "GOYANG VIBE LAB研究高陽的文化、旅遊、MICE與生活風格資產，並將其轉化為方案、預約服務與現場營運結構。",
      highlights: [
        { icon: Sparkles, value: "K-Culture", label: "將演出、展覽與城市生活風格融為一體敘事的研究方向。" },
        { icon: Globe2, value: "Destination", label: "讓訪客停留更久、願意再次到訪的城市體驗設計。" },
        { icon: Users2, value: "Hospitality", label: "兼顧VIP、買家、家庭及團體訪客的接待營運結構。" },
        { icon: Layers3, value: "Platform", label: "研究、預約、營運與管理在統一結構內協同運作的平台。" },
      ],
      who: {
        eyebrow: "Who We Are",
        quote: "好的研究不止於分析，更應為當地居民的生活帶來實質性價值。",
        desc: "我們不止於解讀城市。我們將城市資產連結至內容規劃、預約服務、合作夥伴營運與現場執行，使高陽更易於被體驗。",
      },
      pillars: [
        { title: "Strategy", desc: "將高陽的文化、旅遊、MICE與生活風格資產整理為清晰的策略方向。", tone: "bg-[#fff3df]" },
        { title: "Experience", desc: "將活動、美食、住宿與在地體驗設計為一體化訪客旅程。", tone: "bg-[#eafbf4]" },
        { title: "Operation", desc: "從規劃到預約、合作夥伴、日程與現場營運，以實際執行結構相互連結。", tone: "bg-[#eef2ff]" },
      ],
      what: { eyebrow: "What We Do", title: "從城市品牌塑造到現場營運，設計為一體化流程。" },
      capabilities: [
        { label: "Brand Narrative", title: "將高陽的生活方式整理為品牌故事。", desc: "將演出、展覽、生活風格與旅遊資產轉化為定位策略與方案概念。", tone: "bg-[#fff3df]" },
        { label: "Lifestyle Curation", title: "規劃停留的理由。", desc: "整合咖啡廳、美食、家庭體驗、購物與在地空間，打造駐留型體驗。", tone: "bg-[#eafbf4]" },
        { label: "DMC Delivery", title: "構建推動現場運作的營運結構。", desc: "將機場接送、住宿、餐飲、票務與日程營運整合為一體化流程。", tone: "bg-[#eef2ff]" },
        { label: "Partner Network", title: "將機構與合作夥伴整合為營運生態系統。", desc: "為演出場館、飯店、餐廳、在地空間與服務營運商設計實際協作結構。", tone: "bg-[#ffe7df]" },
      ],
      story: {
        eyebrow: "Our Story",
        items: [
          { year: "01", title: "解讀城市。", desc: "對高陽全域的演出場館、展覽、旅遊據點、在地空間與訪客流動進行分析。" },
          { year: "02", title: "將研究轉化為方案。", desc: "將研究成果轉化為內容概念、預約服務與訪客旅程。" },
          { year: "03", title: "連結至營運結構。", desc: "整理合作夥伴結構、預約邏輯與現場方案，使其在實際專案中落地執行。" },
        ],
      },
      why: {
        eyebrow: "Why It Matters",
        title: "高陽應成為人們願意再次到訪的城市，而不只是路過一次的地方。",
        desc: "我們的目標是讓演出、旅遊、住宿、餐飲、購物與在地體驗自然相連，使訪客的出行、停留與消費在城市中自然延伸。",
        bullets: ["將K-POP、KINTEX與文化需求整合為一體化城市體驗流程。", "以整合結構設計文化、旅遊、MICE與生活風格，而非各自分立。", "構建機構與合作夥伴可實際共用的執行型營運結構。"],
      },
      ctas: { research: "查看研究", contact: "聯絡我們" },
    };
  }

  if (locale === "en") {
    return {
      metadata: {
        title: "ABOUT",
        description:
          "Learn how GOYANG VIBE LAB connects culture, tourism, MICE, and lifestyle experiences into practical programs and operations.",
      },
      eyebrow: "ABOUT GOYANG VIBE LAB",
      title: "We curate Goyang's assets into experiences that lead visitors to stay longer.",
      desc:
        "GOYANG VIBE LAB studies Goyang's culture, tourism, MICE, and lifestyle assets, then connects them to programs, booking services, and on-site operations.",
      highlights: [
        {
          icon: Sparkles,
          value: "K-Culture",
          label: "Research that connects performance, exhibitions, and urban lifestyle into one narrative.",
        },
        {
          icon: Globe2,
          value: "Destination",
          label: "A destination approach that helps visitors stay longer and return for more.",
        },
        {
          icon: Users2,
          value: "Hospitality",
          label: "Operations designed for VIPs, buyers, families, and group visitors.",
        },
        {
          icon: Layers3,
          value: "Platform",
          label: "A connected structure where research, booking, operations, and management work together.",
        },
      ],
      who: {
        eyebrow: "Who We Are",
        quote:
          "Good research does not stop at analysis. It must add real value to the lives of local residents.",
        desc:
          "We do not stop at describing the city. We connect urban assets to content planning, reservation services, partner operations, and on-site execution so the city becomes easier to experience.",
      },
      pillars: [
        {
          title: "Strategy",
          desc: "We turn Goyang's cultural, tourism, MICE, and lifestyle assets into clear strategy directions.",
          tone: "bg-[#fff3df]",
        },
        {
          title: "Experience",
          desc: "We design visitor journeys that connect events, dining, stay, and local experiences into one flow.",
          tone: "bg-[#eafbf4]",
        },
        {
          title: "Operation",
          desc: "We connect planning to booking, partners, schedules, and real operational delivery.",
          tone: "bg-[#eef2ff]",
        },
      ],
      what: {
        eyebrow: "What We Do",
        title: "From city branding to field execution, we design one continuous service flow.",
      },
      capabilities: [
        {
          label: "Brand Narrative",
          title: "We shape Goyang's lifestyle into a clear brand story.",
          desc: "Performance, exhibition, lifestyle, and tourism assets are turned into positioning and program concepts.",
          tone: "bg-[#fff3df]",
        },
        {
          label: "Lifestyle Curation",
          title: "We curate reasons to stay longer.",
          desc: "Cafes, dining, family activities, shopping, and local places are connected into a layered stay experience.",
          tone: "bg-[#eafbf4]",
        },
        {
          label: "DMC Delivery",
          title: "We design operating structures that move on-site.",
          desc: "Airport pickup, accommodation, dining, ticketing, and schedules are connected into one working flow.",
          tone: "bg-[#eef2ff]",
        },
        {
          label: "Partner Network",
          title: "We connect institutions and partners into an operating ecosystem.",
          desc: "We design practical collaboration structures across venues, hotels, restaurants, local spaces, and service operators.",
          tone: "bg-[#ffe7df]",
        },
      ],
      story: {
        eyebrow: "Our Story",
        items: [
          {
            year: "01",
            title: "We read the city.",
            desc: "We analyze venues, performances, exhibitions, tourism hubs, and visitor flows across Goyang.",
          },
          {
            year: "02",
            title: "We turn research into programs.",
            desc: "We transform findings into content concepts, booking services, and practical visitor journeys.",
          },
          {
            year: "03",
            title: "We connect it to operations.",
            desc: "We organize partner structures, booking logic, and operational scenarios so ideas can run in real projects.",
          },
        ],
      },
      why: {
        eyebrow: "Why It Matters",
        title: "Goyang should become a city people return to, not just a city they visit once.",
        desc:
          "We aim to connect performance, tourism, stay, dining, shopping, and local experiences so that visitors' movement, stay, and spending naturally expand across the city.",
        bullets: [
          "Connect K-POP, KINTEX, and cultural demand into one city-scale experience flow.",
          "Integrate culture, tourism, MICE, and lifestyle instead of treating them separately.",
          "Build a practical operating structure that institutions and partners can actually use together.",
        ],
      },
      ctas: {
        research: "View Research",
        contact: "Contact Us",
      },
    };
  }

  return {
    metadata: {
      title: "ABOUT",
      description:
        "GOYANG VIBE LAB이 문화, 관광, MICE, 라이프스타일 자산을 실제 프로그램과 운영 구조로 연결하는 방식을 소개합니다.",
    },
    eyebrow: "ABOUT GOYANG VIBE LAB",
    title: "고양의 자산을 방문과 체류를 이끄는 경험으로 큐레이션합니다.",
    desc:
      "GOYANG VIBE LAB은 고양의 문화, 관광, MICE, 라이프스타일 자산을 연구하고, 이를 프로그램과 예약 서비스, 현장 운영 구조로 연결합니다.",
    highlights: [
      {
        icon: Sparkles,
        value: "K-Culture",
        label: "공연, 전시, 도시 라이프스타일을 하나의 서사로 연결하는 연구 축입니다.",
      },
      {
        icon: Globe2,
        value: "Destination",
        label: "방문자가 더 오래 머무르고 다시 찾게 만드는 도시 체류 설계입니다.",
      },
      {
        icon: Users2,
        value: "Hospitality",
        label: "VIP, 바이어, 가족, 단체 방문객까지 고려한 환대 운영 구조입니다.",
      },
      {
        icon: Layers3,
        value: "Platform",
        label: "연구와 예약, 운영, 관리가 하나의 구조 안에서 연결되는 플랫폼입니다.",
      },
    ],
    who: {
      eyebrow: "Who We Are",
      quote:
        "좋은 연구는 분석으로 끝나지 않고, 지역주민의 삶에 실질적인 가치를 더해야 합니다.",
      desc:
        "우리는 도시를 설명하는 데 머무르지 않습니다. 도시 자산을 콘텐츠 기획, 예약 서비스, 파트너 운영, 현장 실행으로 연결해 고양을 더 쉽게 경험할 수 있도록 설계합니다.",
    },
    pillars: [
      {
        title: "Strategy",
        desc: "고양의 문화, 관광, MICE, 라이프스타일 자산을 명확한 전략 방향으로 정리합니다.",
        tone: "bg-[#fff3df]",
      },
      {
        title: "Experience",
        desc: "행사, 미식, 체류, 로컬 경험을 하나의 방문 여정으로 설계합니다.",
        tone: "bg-[#eafbf4]",
      },
      {
        title: "Operation",
        desc: "기획에서 예약, 파트너, 일정, 현장 운영까지 실제 실행 구조로 연결합니다.",
        tone: "bg-[#eef2ff]",
      },
    ],
    what: {
      eyebrow: "What We Do",
      title: "도시 브랜딩부터 현장 운영까지 하나의 흐름으로 설계합니다.",
    },
    capabilities: [
      {
        label: "Brand Narrative",
        title: "고양의 라이프를 브랜드 스토리로 정리합니다.",
        desc: "공연, 전시, 라이프스타일, 관광 자산을 포지셔닝과 프로그램 콘셉트로 연결합니다.",
        tone: "bg-[#fff3df]",
      },
      {
        label: "Lifestyle Curation",
        title: "머무를 이유를 기획합니다.",
        desc: "카페, 미식, 가족 체험, 쇼핑, 로컬 공간을 묶어 체류형 경험으로 제안합니다.",
        tone: "bg-[#eafbf4]",
      },
      {
        label: "DMC Delivery",
        title: "현장을 움직이는 운영 구조를 만듭니다.",
        desc: "공항 이동, 숙박, 다이닝, 티켓, 일정 운영을 하나의 흐름으로 연결합니다.",
        tone: "bg-[#eef2ff]",
      },
      {
        label: "Partner Network",
        title: "기관과 파트너를 운영 생태계로 묶습니다.",
        desc: "공연장, 호텔, 음식점, 로컬 공간, 서비스 운영사를 실제 협업 구조로 설계합니다.",
        tone: "bg-[#ffe7df]",
      },
    ],
    story: {
      eyebrow: "Our Story",
      items: [
        {
          year: "01",
          title: "도시를 읽습니다.",
          desc: "공연장, 전시, 관광 거점, 로컬 공간, 방문 흐름을 고양 전역에서 분석합니다.",
        },
        {
          year: "02",
          title: "연구를 프로그램으로 바꿉니다.",
          desc: "연구 결과를 콘텐츠 콘셉트, 예약 서비스, 방문객 여정으로 전환합니다.",
        },
        {
          year: "03",
          title: "운영 구조로 연결합니다.",
          desc: "파트너 구조, 예약 로직, 현장 시나리오를 정리해 실제 프로젝트로 실행합니다.",
        },
      ],
    },
    why: {
      eyebrow: "Why It Matters",
      title: "고양이 한 번 들르는 도시가 아니라, 다시 찾게 되는 도시가 되어야 합니다.",
      desc:
        "공연, 관광, 숙박, 다이닝, 쇼핑, 로컬 경험이 자연스럽게 이어지도록 설계해 방문자의 이동, 체류, 소비가 도시 안에서 확장되도록 만드는 것이 목표입니다.",
      bullets: [
        "K-POP과 KINTEX, 문화 수요를 하나의 도시 경험 흐름으로 연결합니다.",
        "문화, 관광, MICE, 라이프스타일을 분절하지 않고 통합 구조로 설계합니다.",
        "기관과 파트너가 실제로 함께 쓸 수 있는 실행형 운영 구조를 만듭니다.",
      ],
    },
    ctas: {
      research: "연구 보기",
      contact: "문의하기",
    },
  };
}

export function getAboutMetadata(locale: PageLocale): Metadata {
  const copy = getAboutCopy(locale);

  return {
    title: copy.metadata.title,
    description: copy.metadata.description,
    alternates: {
      canonical: `/${locale}/about`,
    },
  };
}

export const metadata = getAboutMetadata("ko");

export default function AboutPage({ locale = "ko" }: { locale?: PageLocale }) {
  const copy = getAboutCopy(locale);

  return (
    <Shell>
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 pb-20 pt-10">
        <section className="relative overflow-hidden rounded-[40px] bg-[linear-gradient(145deg,_#080e1a_0%,_#0d1a30_40%,_#102040_70%,_#1a3060_100%)] px-6 py-10 text-white shadow-[0_28px_70px_rgba(8,14,26,0.22)] lg:px-10 lg:py-12">
          {/* 도트 그리드 */}
          <div className="pointer-events-none absolute inset-0 opacity-[0.045]" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)", backgroundSize: "26px 26px" }} />
          {/* 글로우 오브 */}
          <div className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full bg-[#8df0cf]/15 blur-[70px]" />
          <div className="pointer-events-none absolute -bottom-12 right-0 h-72 w-72 rounded-full bg-[#a4d8ff]/14 blur-[80px]" />
          <div className="pointer-events-none absolute right-1/4 top-1/2 h-48 w-48 rounded-full bg-[#ffb58f]/10 blur-[70px]" />
          {/* 상단 네온 라인 */}
          <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[#8df0cf] via-[#ffe98b] to-[#ffb58f]" />

          <div className="relative grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            {/* 왼쪽: 텍스트 */}
            <div className="flex h-full flex-col gap-5">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#8df0cf]/25 bg-[#8df0cf]/10 px-3.5 py-1.5">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#8df0cf] opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#8df0cf]" />
                </span>
                <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#8df0cf]/90">{copy.eyebrow}</span>
              </div>
              <div>
                <h1 className="max-w-2xl text-2xl font-black leading-[1.18] tracking-[-0.04em] text-white [text-wrap:balance] sm:text-3xl lg:text-[2.8rem] lg:leading-[1.12]">
                  {copy.title}
                </h1>
                <div className="mt-5 h-px w-full max-w-sm bg-gradient-to-r from-[#8df0cf]/30 to-transparent" />
                <p className="mt-5 max-w-xl text-base leading-8 text-slate-400">
                  {copy.desc}
                </p>
              </div>
            </div>

            {/* 오른쪽: 4개 하이라이트 카드 */}
            <div className="grid gap-3 sm:grid-cols-2">
              {copy.highlights.map((item, index) => {
                const Icon = item.icon;
                const accents = [
                  { iconBg: "bg-[#ffe98b]/20", iconColor: "text-[#ffe98b]", border: "border-[#ffe98b]/20", bar: "bg-[#ffe98b]" },
                  { iconBg: "bg-[#8df0cf]/18", iconColor: "text-[#8df0cf]", border: "border-[#8df0cf]/20", bar: "bg-[#8df0cf]" },
                  { iconBg: "bg-[#a4d8ff]/18", iconColor: "text-[#a4d8ff]", border: "border-[#a4d8ff]/20", bar: "bg-[#a4d8ff]" },
                  { iconBg: "bg-[#ffb58f]/18", iconColor: "text-[#ffb58f]", border: "border-[#ffb58f]/20", bar: "bg-[#ffb58f]" },
                ];
                const ac = accents[index % 4];
                return (
                  <div
                    key={item.value}
                    className={`relative overflow-hidden rounded-[22px] border bg-white/[0.06] p-5 backdrop-blur-sm transition duration-300 hover:bg-white/[0.10] ${ac.border}`}
                  >
                    {/* 왼쪽 컬러 라인 */}
                    <div className={`absolute left-0 top-4 h-8 w-[3px] rounded-r-full ${ac.bar}`} />
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${ac.iconBg}`}>
                      <Icon className={`h-5 w-5 ${ac.iconColor}`} />
                    </div>
                    <div className="mt-4 text-[1.05rem] font-black tracking-[-0.03em] text-white">
                      {item.value}
                    </div>
                    <p className="mt-2 text-[13px] leading-6 text-slate-400">{item.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[34px] border border-white/70 bg-white/85 p-7 shadow-[0_14px_38px_rgba(16,32,58,0.08)] backdrop-blur">
            <div className="text-sm font-semibold uppercase tracking-[0.2em] text-[#ff7d66]">
              {copy.who.eyebrow}
            </div>
            <blockquote className="mt-4 text-2xl font-black leading-snug tracking-tight text-slate-950 lg:text-3xl">
              {copy.who.quote}
            </blockquote>
            <p className="mt-5 text-sm leading-8 text-slate-600">{copy.who.desc}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {copy.pillars.map((item) => (
              <div
                key={item.title}
                className={`rounded-[30px] border border-white/70 p-6 shadow-[0_12px_30px_rgba(16,32,58,0.06)] ${item.tone}`}
              >
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  {item.title}
                </div>
                <div className="mt-3 text-xl font-black tracking-tight text-slate-950">
                  {item.title}
                </div>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[36px] border border-white/70 bg-white/82 px-6 py-8 shadow-[0_14px_38px_rgba(16,32,58,0.08)] backdrop-blur lg:px-8">
          <SectionTitle eyebrow={copy.what.eyebrow} title={copy.what.title} />

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {copy.capabilities.map((item) => (
              <div
                key={item.title}
                className={`rounded-[30px] border border-white/80 p-6 shadow-[0_10px_28px_rgba(16,32,58,0.05)] ${item.tone}`}
              >
                <div className="text-xs font-semibold uppercase tracking-[0.22em] text-[#ff7d66]">
                  {item.label}
                </div>
                <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-950">
                  {item.title}
                </h2>
                <p className="mt-4 text-sm leading-7 text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[36px] border border-white/70 bg-[linear-gradient(135deg,_#fff3df_0%,_#ffe8df_36%,_#fffdf8_100%)] p-7 shadow-[0_14px_38px_rgba(16,32,58,0.08)]">
            <div className="text-sm font-semibold uppercase tracking-[0.22em] text-[#ff7d66]">
              {copy.story.eyebrow}
            </div>
            <div className="mt-6 space-y-5">
              {copy.story.items.map((item) => (
                <div
                  key={item.year}
                  className="rounded-[26px] border border-white/80 bg-white/70 p-5"
                >
                  <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                    Step {item.year}
                  </div>
                  <div className="mt-2 text-xl font-black tracking-tight text-slate-950">
                    {item.title}
                  </div>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[36px] border border-white/70 bg-[#10203a] p-7 text-white shadow-[0_18px_46px_rgba(16,32,58,0.14)]">
            <div className="text-sm font-semibold uppercase tracking-[0.22em] text-[#fff0b0]">
              {copy.why.eyebrow}
            </div>
            <h2 className="mt-4 text-3xl font-black leading-tight tracking-tight">
              {copy.why.title}
            </h2>
            <p className="mt-5 text-sm leading-8 text-white/78">{copy.why.desc}</p>

            <div className="mt-8 grid gap-4">
              {copy.why.bullets.map((item) => (
                <div
                  key={item}
                  className="rounded-[24px] border border-white/10 bg-white/8 px-5 py-4 text-sm leading-7 text-white/84"
                >
                  {item}
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/research"
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
              >
                {copy.ctas.research}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                {copy.ctas.contact}
              </Link>
            </div>
          </div>
        </section>
      </div>
    </Shell>
  );
}
