"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Building2,
  ChartNoAxesColumn,
  Compass,
  Download,
  FileText,
  Layers3,
  LayoutPanelTop,
  Lock,
  Navigation,
  Network,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import PremiumCard from "@/components/common/PremiumCard";
import SectionTitle from "@/components/common/SectionTitle";
import Shell from "@/components/layout/Shell";

export type PageLocale = "ko" | "en" | "ja" | "zh-CN" | "zh-TW";

function getResearchCopy(locale: PageLocale) {
  if (locale === "en") {
    return {
      hero: {
        eyebrow: "RESEARCH",
        title: "Core research tracks connecting K-culture, tourism, MICE, and lifestyle in Goyang",
        desc:
          "Our research is designed to move into execution. We connect city assets, visitor journeys, and operational models into practical outcomes.",
      },
      signals: [
        {
          icon: Sparkles,
          value: "Culture",
          label: "Research linking K-culture assets to bookable city experiences.",
        },
        {
          icon: LayoutPanelTop,
          value: "Journey",
          label: "Visitor flow design connecting arrival, stay, spending, and return.",
        },
        {
          icon: Layers3,
          value: "Model",
          label: "Execution models that connect research to operations and services.",
        },
        {
          icon: ChartNoAxesColumn,
          value: "Impact",
          label: "Measurement structures for stay extension and local economic outcomes.",
        },
      ],
      archive: {
        eyebrow: "Research Archive",
        title: "Research materials in one view",
      },
      archiveItems: [
        {
          issue: "VOL.01",
          season: "2026 SPRING",
          title: "Goyang K-Culture Visitor Journey Study",
          desc: "A study organizing arrival, stay, and spending structures around performances and exhibitions.",
        },
        {
          issue: "VOL.02",
          season: "2026 SUMMER",
          title: "Connected Stay Program Brief",
          desc: "A brief outlining stay-based tourism programs linked to event districts and local places.",
        },
        {
          issue: "VOL.03",
          season: "2026 FALL",
          title: "Lifestyle City Strategy Memo",
          desc: "A strategy note linking family experiences, cafes, dining, and shopping to city stay value.",
        },
        {
          issue: "VOL.04",
          season: "2026 WINTER",
          title: "Operations Brief Archive",
          desc: "A collection of operational materials connecting booking, schedules, partners, and field response.",
        },
      ],
      tracks: {
        eyebrow: "Research Tracks",
        title: "2026 Core Research Tracks",
        desc: "",
      },
      areas: [
        { icon: Building2,  title: "Citywide MICE Zone Research",    desc: "Designing connected MICE zones that link venues, performances, tourism, and stay." },
        { icon: Navigation, title: "Visitor Journey Design",          desc: "Planning how visitors move, spend, stay, and return across the city." },
        { icon: Network,    title: "Tourism District Models",         desc: "Creating stay-oriented program models linked to tourism districts and local commercial areas." },
        { icon: Layers3,    title: "Regional Industry Linkage",       desc: "Connecting culture, tourism, shopping, dining, and accommodation into one working structure." },
        { icon: TrendingUp, title: "Program Impact Measurement",      desc: "Building structures for tracking satisfaction, stay extension, and local economic effects." },
        { icon: FileText,   title: "Policy & Operations Briefing",    desc: "Converting research outcomes into policy notes and field-ready briefs." },
      ],
      perspective: {
        eyebrow: "Research Perspective",
        title: "Good research transforms a city's tangible and intangible assets into new value.",
        desc:
          "Our research becomes brand stories, program planning, service design, and operational briefs that can move in the field.",
      },
      frames: [
        {
          icon: Compass,
          title: "Destination Research",
          desc: "We read the city as a destination structure, not as isolated venues.",
        },
        {
          icon: Layers3,
          title: "Program Architecture",
          desc: "Research outcomes are translated into products, programs, and service structures.",
        },
        {
          icon: ChartNoAxesColumn,
          title: "Impact Measurement",
          desc: "We design ways to evaluate stay extension, spending, and local ripple effects.",
        },
      ],
      process: {
        eyebrow: "Research Process",
        title: "A process that moves from city reading to operational delivery",
        steps: [
          {
            step: "Step 1",
            title: "Read the city",
            desc: "Analyze venues, events, tourism hubs, local places, and visitor movement in Goyang.",
          },
          {
            step: "Step 2",
            title: "Translate into programs",
            desc: "Turn findings into booking services, program concepts, and visitor flows.",
          },
          {
            step: "Step 3",
            title: "Connect to execution",
            desc: "Organize field-ready briefs and operational scenarios that can run in real projects.",
          },
        ],
      },
    };
  }

  if (locale === "ja") {
    return {
      hero: {
        eyebrow: "RESEARCH",
        title: "高陽のK-カルチャー、観光、MICE、ライフスタイル戦略をつなぐコア研究トラック",
        desc: "研究は実行につながる構造を作ることを目的としています。都市資産、訪問者ジャーニー、運営モデルを実際のプログラムとサービスへつなげます。",
      },
      signals: [
        { icon: Sparkles, value: "Culture", label: "K-カルチャー資産を実際に予約可能な都市体験へつなぐ研究軸です。" },
        { icon: LayoutPanelTop, value: "Journey", label: "到着から滞在、消費、再訪問までつながる訪問者ジャーニーを設計します。" },
        { icon: Layers3, value: "Model", label: "研究を実際の運営モデルとサービス構造に変換する実行フレームです。" },
        { icon: ChartNoAxesColumn, value: "Impact", label: "滞在拡大と地域経済効果を測定する構造を共に設計します。" },
      ],
      archive: { eyebrow: "Research Archive", title: "研究資料とブリーフを一目で確認できます" },
      archiveItems: [
      ],
      tracks: { eyebrow: "Research Tracks", title: "2026年 コア研究トラック", desc: "" },
      areas: [
        { icon: Building2,  title: "都市型MICE圏域研究",    desc: "展示場、公演場、観光、宿泊資源をひとつのMICE圏域構造で連結します。" },
        { icon: Navigation, title: "訪問者ジャーニー設計",  desc: "到着、消費、滞在、再訪問までつながる訪問者フローを設計します。" },
        { icon: Network,    title: "観光特区連携モデル開発", desc: "観光特区と地域商圏を組み合わせた滞在型プログラムモデルを構築します。" },
        { icon: Layers3,    title: "地域産業連携構造",      desc: "文化、観光、ショッピング、グルメ、宿泊産業が共に機能する構造を設計します。" },
        { icon: TrendingUp, title: "プログラム効果測定",    desc: "満足度、滞在拡大、地域経済効果を測定可能な構造へ変換します。" },
        { icon: FileText,   title: "政策と現場実行ブリーフ", desc: "研究結果を現場運営や提案書作成に活用できる形で整理します。" },
      ],
      perspective: {
        eyebrow: "Research Perspective",
        title: "良い研究は都市の有形・無形資産を新たな価値へと転換するものです。",
        desc: "GOYANG MICE PLATFORMの研究は、ブランドストーリー、プログラム企画、サービス設計、現場運営ブリーフへとつながる出発点です。",
      },
      frames: [
        { icon: Compass, title: "都市目的地研究", desc: "都市を個別場所のリストではなく、ひとつの訪問目的地構造として読み解きます。" },
        { icon: Layers3, title: "プログラム構造化", desc: "研究結果を商品、プログラム、予約型サービス構造へ変換します。" },
        { icon: ChartNoAxesColumn, title: "効果測定", desc: "滞在拡大、消費効果、地域波及力を評価する構造を設計します。" },
      ],
      process: {
        eyebrow: "Research Process",
        title: "都市を読み、実行構造へとつなぐ研究プロセス",
        steps: [
          { step: "Step 1", title: "都市分析", desc: "高陽の公演場、展示場、観光拠点、ローカル空間、訪問フローを分析します。" },
          { step: "Step 2", title: "プログラム設計", desc: "研究結果を予約サービス、プログラム、訪問者ジャーニーへ具体化します。" },
          { step: "Step 3", title: "実行連携", desc: "現場ですぐ使える運営ブリーフと実行シナリオにまとめます。" },
        ],
      },
    };
  }

  if (locale === "zh-CN") {
    return {
      hero: {
        eyebrow: "RESEARCH",
        title: "连接高阳K-文化、旅游、MICE与生活方式战略的核心研究方向",
        desc: "研究的目的在于构建可落地的执行结构，将城市资产、访客旅程与运营模型转化为实际项目与服务。",
      },
      signals: [
        { icon: Sparkles, value: "Culture", label: "将K-文化资产转化为可实际预约的城市体验的研究方向。" },
        { icon: LayoutPanelTop, value: "Journey", label: "设计从到达、停留、消费到再次访问的访客旅程。" },
        { icon: Layers3, value: "Model", label: "将研究成果转化为实际运营模型与服务结构的执行框架。" },
        { icon: ChartNoAxesColumn, value: "Impact", label: "共同设计衡量停留延长与地区经济效益的评估结构。" },
      ],
      archive: { eyebrow: "Research Archive", title: "一站式浏览研究资料与简报" },
      archiveItems: [
      ],
      tracks: { eyebrow: "Research Tracks", title: "2026年 核心研究方向", desc: "" },
      areas: [
        { icon: Building2,  title: "城市型MICE区域研究",   desc: "将展览馆、演出场馆、旅游、住宿资源整合为统一的MICE区域结构。" },
        { icon: Navigation, title: "访客旅程设计",         desc: "规划从到达、消费、停留到再次访问的访客流程。" },
        { icon: Network,    title: "旅游特区联动模型开发", desc: "构建将旅游特区与当地商圈结合的驻留型项目模型。" },
        { icon: Layers3,    title: "地区产业联动结构",     desc: "设计文化、旅游、购物、餐饮、住宿产业协同运作的整体结构。" },
        { icon: TrendingUp, title: "项目效益评估",         desc: "将满意度、停留延长、地区经济效益转化为可量化的评估结构。" },
        { icon: FileText,   title: "政策与现场执行简报",   desc: "将研究成果整理为可直接用于现场运营与提案撰写的材料。" },
      ],
      perspective: {
        eyebrow: "Research Perspective",
        title: "好的研究应将城市的有形与无形资产转化为新的价值。",
        desc: "GOYANG MICE PLATFORM的研究是通往品牌故事、项目策划、服务设计与现场运营简报的起点。",
      },
      frames: [
        { icon: Compass, title: "城市目的地研究", desc: "以整体目的地结构而非孤立场所的视角解读城市。" },
        { icon: Layers3, title: "项目结构化", desc: "将研究成果转化为产品、项目与可预约服务结构。" },
        { icon: ChartNoAxesColumn, title: "效益评估", desc: "设计衡量停留延长、消费效益与地区波及影响的评估结构。" },
      ],
      process: {
        eyebrow: "Research Process",
        title: "从解读城市到构建执行结构的研究流程",
        steps: [
          { step: "Step 1", title: "城市分析", desc: "分析高阳的演出场馆、展览馆、旅游据点、本地空间与访客流动。" },
          { step: "Step 2", title: "项目设计", desc: "将研究成果具体化为预约服务、项目方案与访客旅程。" },
          { step: "Step 3", title: "落地连接", desc: "整理为可直接用于现场的运营简报与执行方案。" },
        ],
      },
    };
  }

  if (locale === "zh-TW") {
    return {
      hero: {
        eyebrow: "RESEARCH",
        title: "連結高陽K-文化、旅遊、MICE與生活風格策略的核心研究方向",
        desc: "研究的目的在於構建可落地的執行結構，將城市資產、訪客旅程與營運模型轉化為實際專案與服務。",
      },
      signals: [
        { icon: Sparkles, value: "Culture", label: "將K-文化資產轉化為可實際預約的城市體驗的研究方向。" },
        { icon: LayoutPanelTop, value: "Journey", label: "設計從到達、停留、消費到再次造訪的訪客旅程。" },
        { icon: Layers3, value: "Model", label: "將研究成果轉化為實際營運模型與服務結構的執行框架。" },
        { icon: ChartNoAxesColumn, value: "Impact", label: "共同設計衡量停留延長與地區經濟效益的評估結構。" },
      ],
      archive: { eyebrow: "Research Archive", title: "一站式瀏覽研究資料與簡報" },
      archiveItems: [
      ],
      tracks: { eyebrow: "Research Tracks", title: "2026年 核心研究方向", desc: "" },
      areas: [
        { icon: Building2,  title: "城市型MICE區域研究",   desc: "將展覽館、演出場館、旅遊、住宿資源整合為統一的MICE區域結構。" },
        { icon: Navigation, title: "訪客旅程設計",         desc: "規劃從到達、消費、停留到再次造訪的訪客流程。" },
        { icon: Network,    title: "觀光特區聯動模型開發", desc: "構建將觀光特區與當地商圈結合的駐留型方案模型。" },
        { icon: Layers3,    title: "地區產業聯動結構",     desc: "設計文化、旅遊、購物、餐飲、住宿產業協同運作的整體結構。" },
        { icon: TrendingUp, title: "方案效益評估",         desc: "將滿意度、停留延長、地區經濟效益轉化為可量化的評估結構。" },
        { icon: FileText,   title: "政策與現場執行簡報",   desc: "將研究成果整理為可直接用於現場營運與提案撰寫的材料。" },
      ],
      perspective: {
        eyebrow: "Research Perspective",
        title: "好的研究應將城市的有形與無形資產轉化為新的價值。",
        desc: "GOYANG MICE PLATFORM的研究是通往品牌故事、專案規劃、服務設計與現場營運簡報的起點。",
      },
      frames: [
        { icon: Compass, title: "城市目的地研究", desc: "以整體目的地結構而非孤立場所的視角解讀城市。" },
        { icon: Layers3, title: "專案結構化", desc: "將研究成果轉化為產品、專案與可預約服務結構。" },
        { icon: ChartNoAxesColumn, title: "效益評估", desc: "設計衡量停留延長、消費效益與地區波及影響的評估結構。" },
      ],
      process: {
        eyebrow: "Research Process",
        title: "從解讀城市到構建執行結構的研究流程",
        steps: [
          { step: "Step 1", title: "城市分析", desc: "分析高陽的演出場館、展覽館、旅遊據點、在地空間與訪客流動。" },
          { step: "Step 2", title: "專案設計", desc: "將研究成果具體化為預約服務、方案規劃與訪客旅程。" },
          { step: "Step 3", title: "落地連結", desc: "整理為可直接用於現場的營運簡報與執行方案。" },
        ],
      },
    };
  }

  return {
    hero: {
      eyebrow: "RESEARCH",
      title: "고양의 K-컬쳐, 관광, MICE, 라이프스타일을 연결하는 핵심 연구 트랙",
      desc:
        "연구는 실행으로 이어지는 구조를 만드는 데 목적이 있습니다. 도시 자산, 방문객 여정, 운영 모델을 실제 프로그램과 서비스로 연결합니다.",
    },
    signals: [
      {
        icon: Sparkles,
        value: "Culture",
        label: "K-컬쳐 자산을 실제 예약 가능한 도시 경험으로 연결하는 연구 축입니다.",
      },
      {
        icon: LayoutPanelTop,
        value: "Journey",
        label: "도착부터 체류, 소비, 재방문까지 이어지는 방문자 여정을 설계합니다.",
      },
      {
        icon: Layers3,
        value: "Model",
        label: "연구를 실제 운영 모델과 서비스 구조로 번역하는 실행 프레임입니다.",
      },
      {
        icon: ChartNoAxesColumn,
        value: "Impact",
        label: "체류 확대와 지역경제 효과를 측정하는 구조를 함께 설계합니다.",
      },
    ],
    archive: {
      eyebrow: "Research Archive",
      title: "연구 자료와 브리프를 한눈에 볼 수 있습니다",
    },
    archiveItems: [
      {
        issue: "VOL.01",
        season: "2026 SPRING",
        title: "고양 K-컬쳐 방문자 여정 연구",
        desc: "공연과 전시를 중심으로 도착, 체류, 소비 흐름을 정리한 연구 자료입니다.",
      },
      {
        issue: "VOL.02",
        season: "2026 SUMMER",
        title: "관광특구 연계 체류형 프로그램 브리프",
        desc: "행사장과 관광특구, 로컬 공간을 연결하는 체류형 프로그램 구조를 정리했습니다.",
      },
      {
        issue: "VOL.03",
        season: "2026 FALL",
        title: "라이프스타일 도시 전략 메모",
        desc: "가족 체험, 카페, 미식, 쇼핑을 포함한 고양형 라이프스타일 전략 메모입니다.",
      },
      {
        issue: "VOL.04",
        season: "2026 WINTER",
        title: "현장 운영 실행 브리프 아카이브",
        desc: "예약, 일정, 파트너 운영, 현장 대응까지 연결되는 실행 자료 모음입니다.",
      },
    ],
    tracks: {
      eyebrow: "Research Tracks",
      title: "2026년 핵심연구트랙",
      desc: "",
    },
    areas: [
      { icon: Building2,   title: "도시형 MICE 권역 연구",     desc: "전시장, 공연장, 관광, 숙박 자원을 하나의 MICE 권역 구조로 연결합니다." },
      { icon: Navigation,  title: "방문객 여정 설계",           desc: "도착, 소비, 체류, 재방문까지 이어지는 방문객 흐름을 설계합니다." },
      { icon: Network,     title: "관광특구 연계 모델 개발",    desc: "관광특구와 지역 상권을 연결한 체류형 프로그램 모델을 구축합니다." },
      { icon: Layers3,     title: "지역 산업 연계 구조",        desc: "문화, 관광, 쇼핑, 미식, 숙박 산업이 함께 작동하는 구조를 설계합니다." },
      { icon: TrendingUp,  title: "프로그램 효과 측정",         desc: "만족도, 체류 확대, 지역경제 효과를 측정 가능한 구조로 전환합니다." },
      { icon: FileText,    title: "정책과 현장 실행 브리프",    desc: "연구 결과를 실제 현장 운영과 제안서 작성에 활용할 수 있도록 정리합니다." },
    ],
    perspective: {
      eyebrow: "Research Perspective",
      title: "좋은 연구는 도시의 유무형 자산을 새로운 가치로 전환해야 합니다.",
      desc:
        "GOYANG MICE PLATFORM의 연구는 브랜드 스토리, 프로그램 기획, 서비스 설계, 현장 운영 브리프로 연결되기 위한 출발점입니다.",
    },
    frames: [
      {
        icon: Compass,
        title: "도시 목적지 연구",
        desc: "도시를 개별 장소의 목록이 아닌 하나의 방문 목적지 구조로 읽어냅니다.",
      },
      {
        icon: Layers3,
        title: "프로그램 구조화",
        desc: "연구 결과를 상품, 프로그램, 예약형 서비스 구조로 전환합니다.",
      },
      {
        icon: ChartNoAxesColumn,
        title: "효과 측정",
        desc: "체류 확대, 소비 효과, 지역 파급력을 평가하는 구조를 설계합니다.",
      },
    ],
    process: {
      eyebrow: "Research Process",
      title: "도시를 읽고 실행 구조로 연결하는 연구 과정",
      steps: [
        {
          step: "1단계",
          title: "도시 분석",
          desc: "고양의 공연장, 전시장, 관광거점, 로컬 공간, 방문 흐름을 분석합니다.",
        },
        {
          step: "2단계",
          title: "프로그램 설계",
          desc: "연구 결과를 예약 서비스, 프로그램, 방문객 여정으로 구체화합니다.",
        },
        {
          step: "3단계",
          title: "실행 연결",
          desc: "현장에서 바로 사용할 수 있는 운영 브리프와 실행 시나리오로 정리합니다.",
        },
      ],
    },
  };
}

type DbArchiveItem = {
  id: string;
  title: string;
  summary: string | null;
  content: string;
};

type ArchiveCard = {
  id?: string;
  issue: string;
  season: string;
  title: string;
  desc: string;
  /** 오더 #G2 [1] 판정 2: 렌더에서 사용 안 함 (그라디언트 배경 제거). DB 이관본 호환용으로 optional 유지. */
  gradient?: string;
  posterUrl?: string;
  fileUrl?: string;
  fileName?: string;
  categoryTag?: string;
  authors?: string;
  publishDate?: string;
};

function parseDbItems(items: DbArchiveItem[]): ArchiveCard[] {
  return items.map((item) => {
    let meta: {
      issue?: string;
      season?: string;
      gradient?: string;
      posterUrl?: string;
      fileUrl?: string;
      fileName?: string;
      categoryTag?: string;
      authors?: string;
      publishDate?: string;
    } = {};
    try {
      meta = JSON.parse(item.content);
    } catch {
      /* ignore */
    }
    return {
      id: item.id,
      issue: meta.issue ?? "",
      season: meta.season ?? "",
      title: item.title,
      desc: item.summary ?? "",
      gradient: meta.gradient ?? "",
      posterUrl: meta.posterUrl ?? "",
      fileUrl: meta.fileUrl ?? "",
      fileName: meta.fileName ?? "",
      categoryTag: meta.categoryTag ?? "",
      authors: meta.authors ?? "",
      publishDate: meta.publishDate ?? "",
    };
  });
}

function getArchiveLabels(locale: PageLocale) {
  if (locale === "en") return { download: "Download", loginRequired: "Login to download", nonSale: "Not for sale" };
  if (locale === "ja") return { download: "ダウンロード", loginRequired: "ログイン後ダウンロード", nonSale: "非売品" };
  if (locale === "zh-CN") return { download: "下载", loginRequired: "登录后下载", nonSale: "非卖品" };
  if (locale === "zh-TW") return { download: "下載", loginRequired: "登入後下載", nonSale: "非賣品" };
  return { download: "다운로드", loginRequired: "로그인 후 다운로드", nonSale: "비매품" };
}

export default function ResearchPage({ locale = "ko" }: { locale?: PageLocale }) {
  const copy = getResearchCopy(locale);
  const labels = getArchiveLabels(locale);
  const { data: session } = useSession();
  const router = useRouter();
  const isLoggedIn = !!session?.user;
  const [dbArchiveItems, setDbArchiveItems] = useState<ArchiveCard[] | null>(null);

  useEffect(() => {
    fetch("/api/admin/research-archives")
      .then((r) => r.json())
      .then((data: { success: boolean; data: DbArchiveItem[] }) => {
        if (data.success && data.data.length > 0) {
          setDbArchiveItems(parseDbItems(data.data));
        }
      })
      .catch(() => { /* fallback to hardcoded */ });
  }, []);

  const archiveItems: ArchiveCard[] = dbArchiveItems ?? copy.archiveItems;

  function handleDownload(item: ArchiveCard) {
    if (!item.id) return;
    if (!isLoggedIn) {
      const callbackUrl = encodeURIComponent(typeof window !== "undefined" ? window.location.href : "/research");
      router.push(`/admin/login?callbackUrl=${callbackUrl}`);
      return;
    }
    window.open(`/api/research-archives/download?id=${item.id}`, "_blank");
  }

  return (
    <Shell>
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 pb-20 pt-10">
        {/* ── Hero (오더 #G2 [1] 판정 3): 다크 네이비 그라디언트 → 차콜 단색. */}
        <section className="relative overflow-hidden rounded-[40px] bg-[#232322] px-6 py-10 text-white lg:px-10 lg:py-12">
          {/* 상단 라인: 골드 단색 (판정 5) */}
          <div className="absolute inset-x-0 top-0 h-[3px] bg-[#D4AF37]" />

          <div className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-3.5 py-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />
                <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#D4AF37]">{copy.hero.eyebrow}</span>
              </div>
              <h1 className="mt-5 max-w-4xl text-2xl font-black leading-[1.18] tracking-[-0.04em] text-white [text-wrap:balance] sm:text-3xl lg:text-[3rem] lg:leading-[1.1]">
                {copy.hero.title}
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-white/70">
                {copy.hero.desc}
              </p>
              <div className="mt-7 h-px w-full bg-white/20" />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {copy.signals.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.value}
                    className="rounded-[22px] border border-white/10 bg-white/[0.06] p-5"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/12">
                      <Icon className="h-5 w-5 text-[#D4AF37]" />
                    </div>
                    <div className="mt-4 text-xl font-black tracking-[-0.03em] text-white">
                      {item.value}
                    </div>
                    <p className="mt-2 text-sm leading-7 text-white/70">{item.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Archive (오더 #G2 [1] 판정 2·4): 그라디언트·그림자·backdrop-blur 제거,
            보더 차콜/15, 배경 흰색. VOL 그라디언트 → 차콜 텍스트 + 번호로만 구분. */}
        <section className="relative overflow-hidden rounded-[36px] border border-[#232322]/15 bg-white px-6 py-8 lg:px-8">
          <div className="absolute inset-x-0 top-0 h-[3px] bg-[#D4AF37]" />
          <SectionTitle eyebrow={copy.archive.eyebrow} title={copy.archive.title} />

          <div className="relative mt-6 grid grid-cols-2 gap-5 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
            {archiveItems.map((item, idx) => {
              const hasPoster = !!item.posterUrl;
              const hasFile = !!item.fileUrl && !!item.id;
              return (
                <article
                  key={item.id ?? `${item.issue}-${idx}`}
                  className="group flex flex-col"
                >
                  {/* 포스터 썸네일 (세로 비율) */}
                  <button
                    type="button"
                    onClick={() => hasFile && handleDownload(item)}
                    disabled={!hasFile}
                    className={`relative aspect-[3/4] w-full overflow-hidden rounded-xl border border-[#232322]/15 ${
                      hasFile ? "cursor-pointer" : "cursor-default"
                    }`}
                    aria-label={hasFile ? labels.download : item.title}
                  >
                    {hasPoster ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={item.posterUrl} alt={item.title} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full flex-col justify-end bg-white p-4 text-[#232322]">
                        <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#232322]/60">{item.season}</div>
                        <div className="mt-1 text-2xl font-black tracking-[-0.03em]">{item.issue}</div>
                        <div className="mt-2 text-[10px] font-black leading-tight tracking-[-0.02em] text-[#232322]/70">
                          RESEARCH
                          <br />
                          ARCHIVE
                        </div>
                      </div>
                    )}
                  </button>

                  {/* 본문 */}
                  <div className="mt-3 flex min-w-0 flex-1 flex-col">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {item.categoryTag && (
                        <span className="rounded-md bg-[#D4AF37] px-2 py-0.5 text-[10px] font-bold text-[#232322]">
                          {item.categoryTag}
                        </span>
                      )}
                      {!item.categoryTag && item.issue && (
                        <span className="rounded-md bg-[#232322]/5 px-2 py-0.5 text-[10px] font-bold text-[#232322]/80">
                          {item.issue}
                        </span>
                      )}
                    </div>
                    <h3 className="mt-2 line-clamp-2 text-sm font-black tracking-[-0.02em] text-[#232322] sm:text-[15px]">
                      {item.title}
                    </h3>
                    <div className="mt-1.5 flex flex-wrap items-center gap-x-2 text-[11px] text-[#232322]/60">
                      <span className="font-semibold text-[#232322]/80">{labels.nonSale}</span>
                      {item.publishDate && <span className="text-[#232322]/50">|</span>}
                      {item.publishDate && <span>{item.publishDate}</span>}
                    </div>
                    {item.authors && (
                      <p className="mt-1 line-clamp-1 text-[11px] text-[#232322]/70">{item.authors}</p>
                    )}

                    {hasFile && (
                      <div className="mt-3">
                        <button
                          type="button"
                          onClick={() => handleDownload(item)}
                          className="inline-flex items-center gap-1.5 rounded-full border border-[#232322]/20 bg-white px-3 py-1.5 text-[11px] font-semibold text-[#232322]/85 transition-colors hover:border-[#232322] hover:bg-[#232322] hover:text-white"
                        >
                          {isLoggedIn ? (
                            <>
                              <Download className="h-3 w-3" />
                              {labels.download}
                            </>
                          ) : (
                            <>
                              <Lock className="h-3 w-3" />
                              {labels.loginRequired}
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* ── Research Tracks ── */}
        <section className="space-y-6">
          <SectionTitle
            eyebrow={copy.tracks.eyebrow}
            title={copy.tracks.title}
            desc={copy.tracks.desc}
          />
          {/* 오더 #G2 [1] 판정 2: 파스텔 tone 배경 6종 제거, bg-white + 얇은 골드 라인.
              판정 4: shadow · hover translate · boxShadow · backdrop-blur 전부 제거. */}
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {copy.areas.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="group relative overflow-hidden rounded-[26px] border border-[#232322]/15 bg-white p-7 transition-colors"
                >
                  <div className="absolute inset-x-0 top-0 h-[3px] rounded-t-[26px] bg-[#D4AF37]" />
                  <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#232322]/5">
                    <Icon className="h-6 w-6 text-[#232322]/80" />
                  </div>
                  <div className="text-xl font-black leading-[1.25] tracking-[-0.03em] text-[#232322] sm:text-2xl">
                    {item.title}
                  </div>
                  <p className="mt-3 text-[15px] leading-7 text-[#232322]/70">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Perspective (오더 #G2 [1] 판정 3·4·5): 다크 네이비 → 차콜,
            shadow·backdrop-blur·글로우 오브 제거, 3px 라인 골드, 아이콘 배경 골드 톤 */}
        <section className="grid gap-5 lg:grid-cols-[1fr_1fr]">
          <div className="relative overflow-hidden rounded-[32px] bg-[#232322] p-8 text-white">
            <div className="absolute inset-x-0 top-0 h-[3px] bg-[#D4AF37]" />
            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-3 py-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />
                <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#D4AF37]">{copy.perspective.eyebrow}</span>
              </div>
              <h2 className="mt-5 text-[1.5rem] font-black leading-[1.25] tracking-[-0.035em] text-white [text-wrap:balance] sm:text-2xl lg:text-[1.8rem]">
                {copy.perspective.title}
              </h2>
              <div className="mt-5 h-px w-full bg-white/20" />
              <p className="mt-5 text-[15px] leading-8 text-white/70">
                {copy.perspective.desc}
              </p>
            </div>
          </div>

          <div className="grid gap-4">
            {copy.frames.map((item) => {
              const Icon = item.icon;
              return (
                <PremiumCard key={item.title} className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-[#232322]/5 p-3">
                      <Icon className="h-5 w-5 text-[#232322]/80" />
                    </div>
                    <div className="text-[1.1rem] font-black tracking-[-0.03em] text-[#232322]">
                      {item.title}
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-[#232322]/60">
                    {item.desc}
                  </p>
                </PremiumCard>
              );
            })}
          </div>
        </section>

        {/* ── Process (오더 #G2 [1] 판정 5): 스텝 번호 배지 민트↔하늘 그라디언트 → 골드 단색. */}
        <section className="space-y-6">
          <SectionTitle eyebrow={copy.process.eyebrow} title={copy.process.title} />
          <div className="grid gap-5 md:grid-cols-3">
            {copy.process.steps.map((item, index) => (
              <PremiumCard key={item.step} className="p-7">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#D4AF37] text-sm font-black text-[#232322]">
                    {index + 1}
                  </div>
                  <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#232322]/50">{item.step}</div>
                </div>
                <div className="mt-4 text-[1.3rem] font-black tracking-[-0.03em] text-[#232322]">
                  {item.title}
                </div>
                <p className="mt-3 text-[15px] leading-7 text-[#232322]/60">
                  {item.desc}
                </p>
              </PremiumCard>
            ))}
          </div>
        </section>
      </div>
    </Shell>
  );
}
