"use client";

import { useEffect, useRef, useState } from "react";
import {
  Building2,
  ChartNoAxesColumn,
  ChevronLeft,
  ChevronRight,
  Compass,
  FileText,
  Layers3,
  LayoutPanelTop,
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
          gradient:
            "linear-gradient(180deg, rgba(255,255,255,0.18), rgba(16,32,58,0.16)), linear-gradient(135deg, #ffe98b 0%, #ffb58f 36%, #ff8f7e 100%)",
        },
        {
          issue: "VOL.02",
          season: "2026 SUMMER",
          title: "Connected Stay Program Brief",
          desc: "A brief outlining stay-based tourism programs linked to event districts and local places.",
          gradient:
            "linear-gradient(180deg, rgba(255,255,255,0.14), rgba(16,32,58,0.18)), linear-gradient(135deg, #8df0cf 0%, #7fd7ff 42%, #567df0 100%)",
        },
        {
          issue: "VOL.03",
          season: "2026 FALL",
          title: "Lifestyle City Strategy Memo",
          desc: "A strategy note linking family experiences, cafes, dining, and shopping to city stay value.",
          gradient:
            "linear-gradient(180deg, rgba(255,255,255,0.14), rgba(16,32,58,0.18)), linear-gradient(135deg, #ffc4cf 0%, #f7a8ff 34%, #7d82ff 100%)",
        },
        {
          issue: "VOL.04",
          season: "2026 WINTER",
          title: "Operations Brief Archive",
          desc: "A collection of operational materials connecting booking, schedules, partners, and field response.",
          gradient:
            "linear-gradient(180deg, rgba(255,255,255,0.16), rgba(16,32,58,0.22)), linear-gradient(135deg, #d8f4ff 0%, #a4d8ff 32%, #3556a8 100%)",
        },
      ],
      tracks: {
        eyebrow: "Research Tracks",
        title: "2026 Core Research Tracks",
        desc: "",
      },
      areas: [
        { icon: Building2,  title: "Citywide MICE Zone Research",    desc: "Designing connected MICE zones that link venues, performances, tourism, and stay.",                     tone: "bg-[#fff3df]" },
        { icon: Navigation, title: "Visitor Journey Design",          desc: "Planning how visitors move, spend, stay, and return across the city.",                                 tone: "bg-[#eafbf4]" },
        { icon: Network,    title: "Tourism District Models",         desc: "Creating stay-oriented program models linked to tourism districts and local commercial areas.",          tone: "bg-[#eef2ff]" },
        { icon: Layers3,    title: "Regional Industry Linkage",       desc: "Connecting culture, tourism, shopping, dining, and accommodation into one working structure.",          tone: "bg-[#ffe7df]" },
        { icon: TrendingUp, title: "Program Impact Measurement",      desc: "Building structures for tracking satisfaction, stay extension, and local economic effects.",            tone: "bg-[#f7f1ff]" },
        { icon: FileText,   title: "Policy & Operations Briefing",    desc: "Converting research outcomes into policy notes and field-ready briefs.",                               tone: "bg-[#eef8ff]" },
      ],
      perspective: {
        eyebrow: "Research Perspective",
        title: "Research should end in experiences people can choose, not only in reports",
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
        { issue: "VOL.01", season: "2026 SPRING", title: "高陽K-カルチャー訪問者ジャーニー研究", desc: "公演と展示を中心に、到着・滞在・消費の流れを整理した研究資料です。", gradient: "linear-gradient(180deg, rgba(255,255,255,0.18), rgba(16,32,58,0.16)), linear-gradient(135deg, #ffe98b 0%, #ffb58f 36%, #ff8f7e 100%)" },
        { issue: "VOL.02", season: "2026 SUMMER", title: "観光特区連携・滞在型プログラムブリーフ", desc: "会場と観光特区、ローカル空間をつなぐ滞在型プログラム構造を整理しました。", gradient: "linear-gradient(180deg, rgba(255,255,255,0.14), rgba(16,32,58,0.18)), linear-gradient(135deg, #8df0cf 0%, #7fd7ff 42%, #567df0 100%)" },
        { issue: "VOL.03", season: "2026 FALL", title: "ライフスタイル都市戦略メモ", desc: "家族体験、カフェ、グルメ、ショッピングを含む高陽型ライフスタイル戦略メモです。", gradient: "linear-gradient(180deg, rgba(255,255,255,0.14), rgba(16,32,58,0.18)), linear-gradient(135deg, #ffc4cf 0%, #f7a8ff 34%, #7d82ff 100%)" },
        { issue: "VOL.04", season: "2026 WINTER", title: "現場運営実行ブリーフアーカイブ", desc: "予約、スケジュール、パートナー運営、現場対応まで連携する実行資料集です。", gradient: "linear-gradient(180deg, rgba(255,255,255,0.16), rgba(16,32,58,0.22)), linear-gradient(135deg, #d8f4ff 0%, #a4d8ff 32%, #3556a8 100%)" },
      ],
      tracks: { eyebrow: "Research Tracks", title: "2026年 コア研究トラック", desc: "" },
      areas: [
        { icon: Building2,  title: "都市型MICE圏域研究",    desc: "展示場、公演場、観光、宿泊資源をひとつのMICE圏域構造で連結します。",                 tone: "bg-[#fff3df]" },
        { icon: Navigation, title: "訪問者ジャーニー設計",  desc: "到着、消費、滞在、再訪問までつながる訪問者フローを設計します。",                     tone: "bg-[#eafbf4]" },
        { icon: Network,    title: "観光特区連携モデル開発", desc: "観光特区と地域商圏を組み合わせた滞在型プログラムモデルを構築します。",               tone: "bg-[#eef2ff]" },
        { icon: Layers3,    title: "地域産業連携構造",      desc: "文化、観光、ショッピング、グルメ、宿泊産業が共に機能する構造を設計します。",         tone: "bg-[#ffe7df]" },
        { icon: TrendingUp, title: "プログラム効果測定",    desc: "満足度、滞在拡大、地域経済効果を測定可能な構造へ変換します。",                       tone: "bg-[#f7f1ff]" },
        { icon: FileText,   title: "政策と現場実行ブリーフ", desc: "研究結果を現場運営や提案書作成に活用できる形で整理します。",                        tone: "bg-[#eef8ff]" },
      ],
      perspective: {
        eyebrow: "Research Perspective",
        title: "良い研究は都市を説明するだけでなく、選択可能な体験として翻訳されるべきです",
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
        { issue: "VOL.01", season: "2026 SPRING", title: "高阳K-文化访客旅程研究", desc: "以演出与展览为中心，梳理到达、停留与消费流程的研究资料。", gradient: "linear-gradient(180deg, rgba(255,255,255,0.18), rgba(16,32,58,0.16)), linear-gradient(135deg, #ffe98b 0%, #ffb58f 36%, #ff8f7e 100%)" },
        { issue: "VOL.02", season: "2026 SUMMER", title: "旅游特区联动驻留型项目简报", desc: "整理了连接活动场地、旅游特区与本地空间的驻留型项目结构。", gradient: "linear-gradient(180deg, rgba(255,255,255,0.14), rgba(16,32,58,0.18)), linear-gradient(135deg, #8df0cf 0%, #7fd7ff 42%, #567df0 100%)" },
        { issue: "VOL.03", season: "2026 FALL", title: "生活方式城市战略备忘录", desc: "包含家庭体验、咖啡馆、美食、购物的高阳型生活方式战略备忘录。", gradient: "linear-gradient(180deg, rgba(255,255,255,0.14), rgba(16,32,58,0.18)), linear-gradient(135deg, #ffc4cf 0%, #f7a8ff 34%, #7d82ff 100%)" },
        { issue: "VOL.04", season: "2026 WINTER", title: "现场运营执行简报档案", desc: "涵盖预约、日程、合作伙伴运营与现场应对的执行资料集。", gradient: "linear-gradient(180deg, rgba(255,255,255,0.16), rgba(16,32,58,0.22)), linear-gradient(135deg, #d8f4ff 0%, #a4d8ff 32%, #3556a8 100%)" },
      ],
      tracks: { eyebrow: "Research Tracks", title: "2026年 核心研究方向", desc: "" },
      areas: [
        { icon: Building2,  title: "城市型MICE区域研究",   desc: "将展览馆、演出场馆、旅游、住宿资源整合为统一的MICE区域结构。",       tone: "bg-[#fff3df]" },
        { icon: Navigation, title: "访客旅程设计",         desc: "规划从到达、消费、停留到再次访问的访客流程。",                       tone: "bg-[#eafbf4]" },
        { icon: Network,    title: "旅游特区联动模型开发", desc: "构建将旅游特区与当地商圈结合的驻留型项目模型。",                     tone: "bg-[#eef2ff]" },
        { icon: Layers3,    title: "地区产业联动结构",     desc: "设计文化、旅游、购物、餐饮、住宿产业协同运作的整体结构。",           tone: "bg-[#ffe7df]" },
        { icon: TrendingUp, title: "项目效益评估",         desc: "将满意度、停留延长、地区经济效益转化为可量化的评估结构。",           tone: "bg-[#f7f1ff]" },
        { icon: FileText,   title: "政策与现场执行简报",   desc: "将研究成果整理为可直接用于现场运营与提案撰写的材料。",               tone: "bg-[#eef8ff]" },
      ],
      perspective: {
        eyebrow: "Research Perspective",
        title: "好的研究不止于解读城市，更要转化为可供选择的体验",
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
        { issue: "VOL.01", season: "2026 SPRING", title: "高陽K-文化訪客旅程研究", desc: "以演出與展覽為中心，梳理到達、停留與消費流程的研究資料。", gradient: "linear-gradient(180deg, rgba(255,255,255,0.18), rgba(16,32,58,0.16)), linear-gradient(135deg, #ffe98b 0%, #ffb58f 36%, #ff8f7e 100%)" },
        { issue: "VOL.02", season: "2026 SUMMER", title: "觀光特區聯動駐留型方案簡報", desc: "整理了連結活動場地、觀光特區與在地空間的駐留型方案結構。", gradient: "linear-gradient(180deg, rgba(255,255,255,0.14), rgba(16,32,58,0.18)), linear-gradient(135deg, #8df0cf 0%, #7fd7ff 42%, #567df0 100%)" },
        { issue: "VOL.03", season: "2026 FALL", title: "生活風格城市策略備忘錄", desc: "包含家庭體驗、咖啡廳、美食、購物的高陽型生活風格策略備忘錄。", gradient: "linear-gradient(180deg, rgba(255,255,255,0.14), rgba(16,32,58,0.18)), linear-gradient(135deg, #ffc4cf 0%, #f7a8ff 34%, #7d82ff 100%)" },
        { issue: "VOL.04", season: "2026 WINTER", title: "現場營運執行簡報檔案", desc: "涵蓋預約、日程、合作夥伴營運與現場應對的執行資料集。", gradient: "linear-gradient(180deg, rgba(255,255,255,0.16), rgba(16,32,58,0.22)), linear-gradient(135deg, #d8f4ff 0%, #a4d8ff 32%, #3556a8 100%)" },
      ],
      tracks: { eyebrow: "Research Tracks", title: "2026年 核心研究方向", desc: "" },
      areas: [
        { icon: Building2,  title: "城市型MICE區域研究",   desc: "將展覽館、演出場館、旅遊、住宿資源整合為統一的MICE區域結構。",       tone: "bg-[#fff3df]" },
        { icon: Navigation, title: "訪客旅程設計",         desc: "規劃從到達、消費、停留到再次造訪的訪客流程。",                       tone: "bg-[#eafbf4]" },
        { icon: Network,    title: "觀光特區聯動模型開發", desc: "構建將觀光特區與當地商圈結合的駐留型方案模型。",                     tone: "bg-[#eef2ff]" },
        { icon: Layers3,    title: "地區產業聯動結構",     desc: "設計文化、旅遊、購物、餐飲、住宿產業協同運作的整體結構。",           tone: "bg-[#ffe7df]" },
        { icon: TrendingUp, title: "方案效益評估",         desc: "將滿意度、停留延長、地區經濟效益轉化為可量化的評估結構。",           tone: "bg-[#f7f1ff]" },
        { icon: FileText,   title: "政策與現場執行簡報",   desc: "將研究成果整理為可直接用於現場營運與提案撰寫的材料。",               tone: "bg-[#eef8ff]" },
      ],
      perspective: {
        eyebrow: "Research Perspective",
        title: "好的研究不止於解讀城市，更要轉化為可供選擇的體驗",
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
        gradient:
          "linear-gradient(180deg, rgba(255,255,255,0.18), rgba(16,32,58,0.16)), linear-gradient(135deg, #ffe98b 0%, #ffb58f 36%, #ff8f7e 100%)",
      },
      {
        issue: "VOL.02",
        season: "2026 SUMMER",
        title: "관광특구 연계 체류형 프로그램 브리프",
        desc: "행사장과 관광특구, 로컬 공간을 연결하는 체류형 프로그램 구조를 정리했습니다.",
        gradient:
          "linear-gradient(180deg, rgba(255,255,255,0.14), rgba(16,32,58,0.18)), linear-gradient(135deg, #8df0cf 0%, #7fd7ff 42%, #567df0 100%)",
      },
      {
        issue: "VOL.03",
        season: "2026 FALL",
        title: "라이프스타일 도시 전략 메모",
        desc: "가족 체험, 카페, 미식, 쇼핑을 포함한 고양형 라이프스타일 전략 메모입니다.",
        gradient:
          "linear-gradient(180deg, rgba(255,255,255,0.14), rgba(16,32,58,0.18)), linear-gradient(135deg, #ffc4cf 0%, #f7a8ff 34%, #7d82ff 100%)",
      },
      {
        issue: "VOL.04",
        season: "2026 WINTER",
        title: "현장 운영 실행 브리프 아카이브",
        desc: "예약, 일정, 파트너 운영, 현장 대응까지 연결되는 실행 자료 모음입니다.",
        gradient:
          "linear-gradient(180deg, rgba(255,255,255,0.16), rgba(16,32,58,0.22)), linear-gradient(135deg, #d8f4ff 0%, #a4d8ff 32%, #3556a8 100%)",
      },
    ],
    tracks: {
      eyebrow: "Research Tracks",
      title: "2026년 핵심연구트랙",
      desc: "",
    },
    areas: [
      { icon: Building2,   title: "도시형 MICE 권역 연구",     desc: "전시장, 공연장, 관광, 숙박 자원을 하나의 MICE 권역 구조로 연결합니다.",          tone: "bg-[#fff3df]" },
      { icon: Navigation,  title: "방문객 여정 설계",           desc: "도착, 소비, 체류, 재방문까지 이어지는 방문객 흐름을 설계합니다.",                tone: "bg-[#eafbf4]" },
      { icon: Network,     title: "관광특구 연계 모델 개발",    desc: "관광특구와 지역 상권을 연결한 체류형 프로그램 모델을 구축합니다.",                tone: "bg-[#eef2ff]" },
      { icon: Layers3,     title: "지역 산업 연계 구조",        desc: "문화, 관광, 쇼핑, 미식, 숙박 산업이 함께 작동하는 구조를 설계합니다.",           tone: "bg-[#ffe7df]" },
      { icon: TrendingUp,  title: "프로그램 효과 측정",         desc: "만족도, 체류 확대, 지역경제 효과를 측정 가능한 구조로 전환합니다.",               tone: "bg-[#f7f1ff]" },
      { icon: FileText,    title: "정책과 현장 실행 브리프",    desc: "연구 결과를 실제 현장 운영과 제안서 작성에 활용할 수 있도록 정리합니다.",        tone: "bg-[#eef8ff]" },
    ],
    perspective: {
      eyebrow: "Research Perspective",
      title: "좋은 연구는 도시를 설명하는 데서 끝나지 않고, 선택 가능한 경험으로 번역되어야 합니다",
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
  issue: string;
  season: string;
  title: string;
  desc: string;
  gradient: string;
};

function parseDbItems(items: DbArchiveItem[]): ArchiveCard[] {
  return items.map((item) => {
    let meta = { issue: "", season: "", gradient: "" };
    try { meta = JSON.parse(item.content) as typeof meta; } catch { /* ignore */ }
    return { issue: meta.issue ?? "", season: meta.season ?? "", title: item.title, desc: item.summary ?? "", gradient: meta.gradient ?? "" };
  });
}

export default function ResearchPage({ locale = "ko" }: { locale?: PageLocale }) {
  const copy = getResearchCopy(locale);
  const archiveRef = useRef<HTMLDivElement>(null);
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

  const archiveItems = dbArchiveItems ?? copy.archiveItems;

  const scrollArchive = (direction: "left" | "right") => {
    const container = archiveRef.current;
    if (!container) return;
    const cardWidth = container.querySelector("article")?.offsetWidth ?? container.clientWidth * 0.72;
    container.scrollBy({
      left: direction === "right" ? cardWidth + 16 : -(cardWidth + 16),
      behavior: "smooth",
    });
  };

  return (
    <Shell>
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 pb-20 pt-10">
        <section className="overflow-hidden rounded-[40px] border border-white/70 bg-[linear-gradient(135deg,_#10203a_0%,_#304f9b_38%,_#8df0cf_100%)] px-6 py-8 text-white shadow-[0_24px_60px_rgba(16,32,58,0.14)] lg:px-10 lg:py-10">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.22em] text-[#fff0b0]">
                {copy.hero.eyebrow}
              </div>
              <h1 className="mt-4 max-w-4xl text-2xl font-black leading-tight tracking-tight text-white sm:text-3xl lg:text-5xl">
                {copy.hero.title}
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-white/82">
                {copy.hero.desc}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {copy.signals.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.value}
                    className="rounded-[28px] border border-white/20 bg-white/12 p-5 backdrop-blur-xl"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15">
                      <Icon className="h-5 w-5 text-[#fff0b0]" />
                    </div>
                    <div className="mt-5 text-xl font-black tracking-tight text-white">
                      {item.value}
                    </div>
                    <p className="mt-2 text-sm leading-7 text-white/78">{item.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="rounded-[36px] border border-white/70 bg-white/82 px-6 py-8 shadow-[0_14px_38px_rgba(16,32,58,0.08)] backdrop-blur lg:px-8">
          <SectionTitle eyebrow={copy.archive.eyebrow} title={copy.archive.title} />

          {/* 통합 캐러셀 (모바일 + 데스크탑 공통) */}
          <div className="relative mt-6">
            {/* 화살표 버튼 */}
            <div className="mb-3 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => scrollArchive("left")}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 transition hover:bg-slate-50"
                aria-label="Previous"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollArchive("right")}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 transition hover:bg-slate-50"
                aria-label="Next"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* 가로 스크롤 컨테이너 */}
            <div
              ref={archiveRef}
              className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 scrollbar-hide"
            >
              {archiveItems.map((item) => (
                <article
                  key={item.issue}
                  className="flex w-[70vw] shrink-0 snap-start flex-col rounded-[30px] border border-slate-200 bg-white shadow-soft sm:w-[45vw] lg:w-[calc(25%-12px)]"
                >
                  <div className="relative aspect-[4/5] rounded-t-[30px] p-5 text-white" style={{ background: item.gradient }}>
                    <div className="text-sm font-semibold tracking-[0.18em] text-white/88">{item.season}</div>
                    <div className="mt-4 text-3xl font-black tracking-tight">{item.issue}</div>
                    <div className="mt-8 text-2xl font-black leading-tight">RESEARCH</div>
                    <div className="text-xl font-black leading-tight">ARCHIVE</div>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="text-lg font-black tracking-tight text-slate-950">{item.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{item.desc}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <SectionTitle
            eyebrow={copy.tracks.eyebrow}
            title={copy.tracks.title}
            desc={copy.tracks.desc}
          />
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {copy.areas.map((item) => {
              const Icon = item.icon;
              return (
                <PremiumCard key={item.title} className={`p-7 ${item.tone}`}>
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/70 shadow-sm">
                    <Icon className="h-6 w-6 text-slate-700" />
                  </div>
                  <div className="text-xl font-black leading-snug tracking-tight text-slate-950 sm:text-2xl">
                    {item.title}
                  </div>
                  <p className="mt-3 text-base leading-8 text-slate-700">
                    {item.desc}
                  </p>
                </PremiumCard>
              );
            })}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <PremiumCard className="p-8">
            <div className="text-sm font-semibold uppercase tracking-[0.22em] text-orange-500">
              {copy.perspective.eyebrow}
            </div>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950">
              {copy.perspective.title}
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-600">
              {copy.perspective.desc}
            </p>
          </PremiumCard>

          <div className="grid gap-4">
            {copy.frames.map((item) => {
              const Icon = item.icon;
              return (
                <PremiumCard key={item.title} className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-slate-100 p-3 text-sky-700">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="text-xl font-black tracking-tight text-slate-950">
                      {item.title}
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-slate-600">
                    {item.desc}
                  </p>
                </PremiumCard>
              );
            })}
          </div>
        </section>

        <section className="space-y-6">
          <SectionTitle eyebrow={copy.process.eyebrow} title={copy.process.title} />
          <div className="grid gap-6 md:grid-cols-3">
            {copy.process.steps.map((item) => (
              <PremiumCard key={item.step} className="p-7">
                <div className="text-sm font-semibold uppercase tracking-[0.22em] text-sky-700">
                  {item.step}
                </div>
                <div className="mt-3 text-2xl font-black tracking-tight text-slate-950">
                  {item.title}
                </div>
                <p className="mt-4 text-base leading-8 text-slate-600">
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
