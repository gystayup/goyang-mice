import type { Metadata } from "next";
import Image from "next/image";
import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";

import PremiumCard from "@/components/common/PremiumCard";
import SectionTitle from "@/components/common/SectionTitle";
import Shell from "@/components/layout/Shell";
import { readDmcHeroMedia } from "@/lib/dmc-hero-media";
import { Link } from "@/lib/navigation";

export const dynamic = "force-dynamic";

export type PageLocale = "ko" | "en" | "ja" | "zh-CN" | "zh-TW";

type DmcCopy = {
  metadata: Metadata;
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    buttons: {
      booking: string;
      inquiry: string;
      partner: string;
    };
    mediaTitle: string;
    mediaDescription: string;
  };
  pillars: {
    eyebrow: string;
    title: string;
    items: Array<{ title: string; description: string }>;
  };
  catalogViewAll: string;
  useCases: {
    eyebrow: string;
    title: string;
    items: Array<{ title: string; description: string }>;
  };
  steps: {
    eyebrow: string;
    title: string;
    items: Array<{ step: string; title: string; description: string }>;
    ctas: {
      booking: string;
      consult: string;
    };
  };
  partners: {
    eyebrow: string;
    title: string;
    description: string;
    button: string;
  };
  places: {
    eyebrow: string;
    title: string;
    desc: string;
    placeholder: string;
  };
  move: {
    eyebrow: string;
    title: string;
    desc: string;
    placeholder: string;
  };
  final: {
    title: string;
    description: string;
    booking: string;
    inquiry: string;
    partner: string;
  };
};

const koreanCopy: DmcCopy = {
  metadata: {
    title: "MICE 안내",
    description:
      "지역 프로그램·숙박·음식점·카페·티켓·공항 접근까지 고양의 MICE 안내 서비스를 한 곳에서 확인하세요.",
  },
  hero: {
    eyebrow: "GOYANG VIBE LAB",
    title: "고양을 어떻게 경험할까",
    description:
      "고양일산의 장소를 하나씩 소개하고, 방문객 유형에 맞는 안내를 연결합니다.",
    buttons: {
      booking: "안내 카테고리 보기",
      inquiry: "기업 / 단체 문의",
      partner: "제휴 제안",
    },
    mediaTitle: "대표 미디어 영역",
    mediaDescription:
      "관리자 페이지에서 업로드한 이미지 또는 영상이 이곳에 표시되며, 고양 MICE 안내 서비스를 시각적으로 소개합니다.",
  },
  pillars: {
    eyebrow: "핵심 서비스",
    title: "고양 MICE 안내의 3가지 핵심 서비스",
    items: [
      {
        title: "기획 서비스",
        description:
          "공연·전시·MICE 방문·숙박을 연결하는 일정과 프로그램을 기획합니다.",
      },
      {
        title: "운영 서비스",
        description:
          "안내, 스케줄, 현장 응대, 이동 동선과 파트너 운영을 통합 관리합니다.",
      },
      {
        title: "로컬 연결 서비스",
        description:
          "호텔, 음식점, 카페, 티켓, 공항 접근 등 고양의 파트너를 하나의 구조로 연결합니다.",
      },
    ],
  },
  catalogViewAll: "카탈로그 전체 보기",
  useCases: {
    eyebrow: "추천 대상",
    title: "이런 방문객에게 추천합니다",
    items: [
      {
        title: "공연 방문객",
        description:
          "티켓·숙박·공항 접근을 함께 안내해 더 부드러운 공연 방문 흐름을 만들 수 있습니다.",
      },
      {
        title: "가족 방문객",
        description:
          "지역 프로그램·음식점·카페 안내를 연결해 가족 중심의 체류 경험을 만들 수 있습니다.",
      },
      {
        title: "기업 / 단체 고객",
        description:
          "숙박·식사·이동·티켓·현장 운영 지원을 묶어 효율적인 단체 운영이 가능합니다.",
      },
      {
        title: "해외 방문객",
        description:
          "공항 접근·호텔·도심 탐방·다이닝 안내를 한 흐름으로 연결할 수 있습니다.",
      },
    ],
  },
  steps: {
    eyebrow: "이용 방법",
    title: "안내는 이렇게 진행됩니다",
    items: [
      {
        step: "1",
        title: "카테고리 선택",
        description: "원하는 서비스 카테고리를 먼저 선택합니다.",
      },
      {
        step: "2",
        title: "서비스 옵션 확인",
        description: "일정, 인원, 옵션, 운영 조건을 확인합니다.",
      },
      {
        step: "3",
        title: "안내 접수",
        description: "안내 또는 문의 정보를 입력하고 요청을 보냅니다.",
      },
      {
        step: "4",
        title: "운영 확정",
        description: "일정과 세부 운영 조건을 조율해 최종 확정합니다.",
      },
    ],
    ctas: {
      booking: "안내 카테고리 보기",
      consult: "상담 문의하기",
    },
  },
  partners: {
    eyebrow: "파트너 네트워크",
    title: "고양의 사업자와 함께합니다",
    description:
      "고양 MICE 안내는 숙박·다이닝·교통·공연장·전시장·로컬 공간·MICE 연계 거점을 연결하여 방문자의 이동과 체류, 지역 경험이 자연스럽게 이어지도록 설계합니다.",
    button: "제휴 문의하기",
  },
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
    description:
      "방문 목적과 일정에 맞는 안내를 연결해 드립니다.",
    booking: "지금 안내 받기",
    inquiry: "단체 문의",
    partner: "제휴 제안",
  },
};

const englishCopy: DmcCopy = {
  metadata: {
    title: "MICE Guide",
    description:
      "One-stop MICE guide for Goyang — regional programs, stay, dining, cafe, tickets, and airport access at a glance.",
  },
  hero: {
    eyebrow: "GOYANG VIBE LAB",
    title: "How to Experience Goyang",
    description:
      "We introduce Goyang-Ilsan's places one by one and connect each visitor with the right guidance.",
    buttons: {
      booking: "View Guide Categories",
      inquiry: "Corporate / Group Inquiry",
      partner: "Partnership Proposal",
    },
    mediaTitle: "Hero Media Area",
    mediaDescription:
      "An image or video uploaded from the admin page appears here and introduces Goyang's MICE guide visually.",
  },
  pillars: {
    eyebrow: "Core Services",
    title: "The 3 core services of Goyang MICE Guide",
    items: [
      {
        title: "Planning Service",
        description:
          "We design itineraries and programs connecting performances, exhibitions, MICE visits, and stay experiences.",
      },
      {
        title: "Operation Service",
        description:
          "We manage inquiries, schedules, on-site coordination, and transport operations in one flow.",
      },
      {
        title: "Local Connection Service",
        description:
          "We connect hotels, restaurants, cafes, tickets, and airport access partners into one network.",
      },
    ],
  },
  catalogViewAll: "See all in the catalog",
  useCases: {
    eyebrow: "Recommended Use Cases",
    title: "Recommended for these visitors",
    items: [
      {
        title: "Performance Visitors",
        description:
          "Combine tickets, accommodation, and airport access for a smoother event visit.",
      },
      {
        title: "Family Visitors",
        description:
          "Connect regional programs, dining, and cafe guides for a family-friendly stay.",
      },
      {
        title: "Corporate / Group Clients",
        description:
          "Bundle stay, dining, transport, tickets, and support for efficient group operations.",
      },
      {
        title: "International Visitors",
        description:
          "Link airport access, hotel, local walks, and dining guides in one visit flow.",
      },
    ],
  },
  steps: {
    eyebrow: "How It Works",
    title: "How the guide works",
    items: [
      {
        step: "1",
        title: "Choose a Category",
        description: "Select the service you need.",
      },
      {
        step: "2",
        title: "Review Service Options",
        description: "Check schedules, options, and conditions.",
      },
      {
        step: "3",
        title: "Submit Inquiry",
        description: "Enter your inquiry information and send your request.",
      },
      {
        step: "4",
        title: "Confirm Operations",
        description: "Finalize schedule and operating arrangement.",
      },
    ],
    ctas: {
      booking: "View Guide Categories",
      consult: "Contact for Consultation",
    },
  },
  partners: {
    eyebrow: "Partner Network",
    title: "Working with Goyang Businesses",
    description:
      "Goyang's MICE Guide connects stay, dining, transport, venues, exhibition halls, local places, and MICE-linked hubs so visitor movement, stay, and regional experience flow naturally.",
    button: "Partnership Inquiry",
  },
  places: {
    eyebrow: "PLACES",
    title: "Places in Goyang-Ilsan",
    desc: "Places chosen by insiders, introduced one at a time.",
    placeholder: "Coming soon",
  },
  move: {
    eyebrow: "GOYANG MOVE",
    title: "From the Airport to Goyang",
    desc: "Step-by-step guidance from Incheon and Gimpo airports to Goyang-Ilsan.",
    placeholder: "Coming soon",
  },
  final: {
    title: "Let us help you find what to do in Goyang",
    description:
      "We connect you with guidance that fits your purpose and schedule.",
    booking: "Get the Guide",
    inquiry: "Group Inquiry",
    partner: "Partnership Proposal",
  },
};

const japaneseCopy: DmcCopy = {
  metadata: {
    title: "MICEガイド",
    description:
      "地域プログラム・宿泊・飲食店・カフェ・チケット・空港アクセスまで、高陽のMICE案内を一カ所でご確認いただけます。",
  },
  hero: {
    eyebrow: "GOYANG VIBE LAB",
    title: "高陽をどう楽しむか",
    description:
      "高陽・一山の場所を一つずつ紹介し、訪問者に合った案内をつなぎます。",
    buttons: { booking: "案内カテゴリを見る", inquiry: "法人 / 団体のお問い合わせ", partner: "提携のご提案" },
    mediaTitle: "メインメディアエリア",
    mediaDescription: "管理者ページからアップロードした画像または動画が表示され、高陽MICE案内サービスをビジュアルで紹介します。",
  },
  pillars: {
    eyebrow: "コアサービス",
    title: "高陽MICE案内の3つのコアサービス",
    items: [
      { title: "企画サービス", description: "公演・展示・MICE訪問・宿泊をつなぐ日程とプログラムを企画します。" },
      { title: "運営サービス", description: "案内・スケジュール・現場対応・移動動線・パートナー運営を統合管理します。" },
      { title: "ローカル連携サービス", description: "ホテル、飲食店、カフェ、チケット、空港アクセスなどのパートナーをひとつの構造でつなぎます。" },
    ],
  },
  catalogViewAll: "カタログをすべて見る",
  useCases: {
    eyebrow: "おすすめの対象",
    title: "このような訪問者におすすめします",
    items: [
      { title: "公演訪問者", description: "チケット・宿泊・空港アクセスをまとめてご案内し、よりスムーズな公演訪問フローを作れます。" },
      { title: "家族訪問者", description: "地域プログラム・飲食・カフェ案内を組み合わせてファミリー向けの滞在体験を作れます。" },
      { title: "法人 / 団体客", description: "宿泊、食事、交通、チケット、サポートをまとめて効率的な団体運営が可能です。" },
      { title: "インバウンド訪問者", description: "空港アクセス・ホテル・都心散策・飲食案内をひとつの旅程にまとめられます。" },
    ],
  },
  steps: {
    eyebrow: "ご利用方法",
    title: "案内の流れ",
    items: [
      { step: "1", title: "カテゴリを選ぶ", description: "必要なサービスを選択します。" },
      { step: "2", title: "サービス内容を確認", description: "日程、オプション、条件を確認します。" },
      { step: "3", title: "案内を申し込む", description: "案内情報を入力してリクエストを送信します。" },
      { step: "4", title: "運営を確定", description: "日程と運営の最終調整を行います。" },
    ],
    ctas: { booking: "案内カテゴリを見る", consult: "お問い合わせ" },
  },
  partners: {
    eyebrow: "Partner Network",
    title: "高陽の事業者とともに",
    description: "高陽MICE案内は宿泊・飲食・交通・公演場・展示場・ローカル空間・MICE連携拠点をつなぎ、訪問者の動きと消費、地域体験を自然な流れにします。",
    button: "提携のお問い合わせ",
  },
  places: {
    eyebrow: "PLACES",
    title: "高陽・一山の場所",
    desc: "インサイダーが選んだ場所を一つずつ紹介します。",
    placeholder: "まもなく公開します",
  },
  move: {
    eyebrow: "GOYANG MOVE",
    title: "空港から高陽まで",
    desc: "仁川・金浦空港から高陽・一山までの行き方を段階別に案内します。",
    placeholder: "まもなく公開します",
  },
  final: {
    title: "高陽での過ごし方を一緒に探します",
    description: "訪問の目的と日程に合った案内をおつなぎします。",
    booking: "案内を受ける",
    inquiry: "団体のお問い合わせ",
    partner: "提携のご提案",
  },
};

const chineseSimplifiedCopy: DmcCopy = {
  metadata: {
    title: "MICE 指南",
    description: "地区节目·住宿·餐厅·咖啡厅·票务及机场接送指南，高阳MICE安内一站式了解。",
  },
  hero: {
    eyebrow: "GOYANG VIBE LAB",
    title: "如何体验高阳",
    description: "逐一介绍高阳·一山的场所，并为每位访客连接合适的指引。",
    buttons: { booking: "查看指南类别", inquiry: "企业/团体咨询", partner: "合作提案" },
    mediaTitle: "主要媒体区域",
    mediaDescription: "此处展示从管理员页面上传的图片或视频，以视觉方式介绍高阳MICE指南服务。",
  },
  pillars: {
    eyebrow: "核心服务",
    title: "高阳MICE指南的三大核心服务",
    items: [
      { title: "策划服务", description: "规划连接演出、展览、MICE访问与住宿的行程和项目。" },
      { title: "运营服务", description: "统一管理咨询、日程、现场接待、交通动线与合作伙伴运营。" },
      { title: "本地联动服务", description: "将酒店、餐厅、咖啡厅、票务及机场接送等高阳合作伙伴整合为一体化网络。" },
    ],
  },
  catalogViewAll: "查看完整目录",
  useCases: {
    eyebrow: "推荐对象",
    title: "适合以下类型的访客",
    items: [
      { title: "演出访客", description: "将票务、住宿、机场接送打包介绍，打造更顺畅的观演体验。" },
      { title: "家庭访客", description: "整合地区节目、餐饮及咖啡厅指南，打造家庭友好型驻留体验。" },
      { title: "企业/团体客户", description: "捆绑住宿、餐饮、交通、票务及服务支持，实现高效团体运营。" },
      { title: "国际访客", description: "将机场接送、酒店、城市漫游及餐饮指南整合为一体化行程。" },
    ],
  },
  steps: {
    eyebrow: "使用方法",
    title: "指南流程",
    items: [
      { step: "1", title: "选择类别", description: "选择所需服务。" },
      { step: "2", title: "查看服务详情", description: "确认日程、选项与条件。" },
      { step: "3", title: "提交咨询", description: "填写咨询信息并发送请求。" },
      { step: "4", title: "确认运营安排", description: "最终确认日程与运营事宜。" },
    ],
    ctas: { booking: "查看指南类别", consult: "联系咨询" },
  },
  partners: {
    eyebrow: "Partner Network",
    title: "与高阳商家同行",
    description: "高阳MICE指南整合住宿、餐饮、交通、演出场馆、展览馆、本地空间与MICE联动据点，让访客的出行、驻留与地区体验自然流畅。",
    button: "合作咨询",
  },
  places: {
    eyebrow: "PLACES",
    title: "高阳·一山的场所",
    desc: "逐一介绍内行人精选的场所。",
    placeholder: "敬请期待",
  },
  move: {
    eyebrow: "GOYANG MOVE",
    title: "从机场到高阳",
    desc: "分步介绍从仁川·金浦机场前往高阳·一山的方式。",
    placeholder: "敬请期待",
  },
  final: {
    title: "一起找到在高阳的玩法",
    description: "为您连接符合出行目的与日程的指引。",
    booking: "立即获取指南",
    inquiry: "团体咨询",
    partner: "合作提案",
  },
};

const chineseTraditionalCopy: DmcCopy = {
  metadata: {
    title: "MICE 指南",
    description: "地區節目·住宿·餐廳·咖啡廳·票務及機場接送指南，高陽MICE指南一站式了解。",
  },
  hero: {
    eyebrow: "GOYANG VIBE LAB",
    title: "如何體驗高陽",
    description: "逐一介紹高陽·一山的場所，並為每位訪客連接合適的指引。",
    buttons: { booking: "查看指南類別", inquiry: "企業/團體諮詢", partner: "合作提案" },
    mediaTitle: "主要媒體區域",
    mediaDescription: "此處展示從管理員頁面上傳的圖片或影片，以視覺方式介紹高陽MICE指南服務。",
  },
  pillars: {
    eyebrow: "核心服務",
    title: "高陽MICE指南的三大核心服務",
    items: [
      { title: "策劃服務", description: "規劃連結演出、展覽、MICE訪問與住宿的行程和方案。" },
      { title: "營運服務", description: "統一管理諮詢、日程、現場接待、交通動線與合作夥伴營運。" },
      { title: "在地聯動服務", description: "將飯店、餐廳、咖啡廳、票務及機場接送等高陽合作夥伴整合為一體化網絡。" },
    ],
  },
  catalogViewAll: "查看完整目錄",
  useCases: {
    eyebrow: "推薦對象",
    title: "適合以下類型的訪客",
    items: [
      { title: "演出訪客", description: "將票務、住宿、機場接送打包介紹，打造更順暢的觀演體驗。" },
      { title: "家庭訪客", description: "整合地區節目、餐飲及咖啡廳指南，打造家庭友好型駐留體驗。" },
      { title: "企業/團體客戶", description: "捆綁住宿、餐飲、交通、票務及服務支援，實現高效團體營運。" },
      { title: "國際訪客", description: "將機場接送、飯店、在地漫遊及餐飲指南整合為一體化行程。" },
    ],
  },
  steps: {
    eyebrow: "使用方法",
    title: "指南流程",
    items: [
      { step: "1", title: "選擇類別", description: "選擇所需服務。" },
      { step: "2", title: "查看服務詳情", description: "確認日程、選項與條件。" },
      { step: "3", title: "提交諮詢", description: "填寫諮詢資訊並送出請求。" },
      { step: "4", title: "確認營運安排", description: "最終確認日程與營運事宜。" },
    ],
    ctas: { booking: "查看指南類別", consult: "聯絡諮詢" },
  },
  partners: {
    eyebrow: "Partner Network",
    title: "與高陽商家同行",
    description: "高陽MICE指南整合住宿、餐飲、交通、演出場館、展覽館、在地空間與MICE聯動據點，讓訪客的出行、駐留與地區體驗自然流暢。",
    button: "合作諮詢",
  },
  places: {
    eyebrow: "PLACES",
    title: "高陽·一山的場所",
    desc: "逐一介紹內行人精選的場所。",
    placeholder: "敬請期待",
  },
  move: {
    eyebrow: "GOYANG MOVE",
    title: "從機場到高陽",
    desc: "分步介紹從仁川·金浦機場前往高陽·一山的方式。",
    placeholder: "敬請期待",
  },
  final: {
    title: "一起找到在高陽的玩法",
    description: "為您連接符合出行目的與日程的指引。",
    booking: "立即獲取指南",
    inquiry: "團體諮詢",
    partner: "合作提案",
  },
};

export const metadata: Metadata = koreanCopy.metadata;

function getCopy(locale: PageLocale) {
  if (locale === "en") return englishCopy;
  if (locale === "ja") return japaneseCopy;
  if (locale === "zh-CN") return chineseSimplifiedCopy;
  if (locale === "zh-TW") return chineseTraditionalCopy;
  return koreanCopy;
}

function AnchorButton({
  href,
  variant,
  children,
}: {
  href: string;
  variant: "primary" | "secondary";
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      className={
        variant === "primary"
          ? "inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          : "inline-flex items-center justify-center rounded-full bg-[#ffe7b3] px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-[#ffdf9b]"
      }
    >
      {children}
    </a>
  );
}

function LinkButton({
  href,
  variant,
  children,
}: {
  href: string;
  variant: "ghost" | "secondary";
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={
        variant === "secondary"
          ? "inline-flex items-center justify-center rounded-full bg-[#ffe7b3] px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-[#ffdf9b]"
          : "inline-flex items-center justify-center rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
      }
    >
      {children}
    </Link>
  );
}

export default async function DmcPage({
  locale = "ko",
}: {
  locale?: PageLocale;
}) {
  const copy = getCopy(locale);
  const heroMedia = await readDmcHeroMedia();

  return (
    <Shell>
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-6 pb-24 pt-10 md:gap-14">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden rounded-[40px] bg-[linear-gradient(145deg,_#080e1a_0%,_#0d1a30_40%,_#1a3060_100%)] shadow-[0_28px_70px_rgba(8,14,26,0.22)]">
        {/* 도트 그리드 */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)", backgroundSize: "26px 26px" }} />
        {/* 글로우 */}
        <div className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full bg-[#8df0cf]/14 blur-[70px]" />
        <div className="pointer-events-none absolute -bottom-12 right-10 h-60 w-60 rounded-full bg-[#a4d8ff]/14 blur-[70px]" />
        {/* 상단 네온 라인 */}
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
                  <Image
                    src={heroMedia.src}
                    alt={copy.hero.mediaTitle}
                    fill
                    className="h-full w-full object-cover"
                    unoptimized
                  />
                ) : heroMedia.mediaType === "video" && heroMedia.src ? (
                  <video
                    className="h-full w-full object-cover"
                    src={heroMedia.src}
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,_#1f2937_0%,_#111827_100%)] p-8 text-center">
                    <div>
                      <div className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-100">
                        {copy.hero.mediaTitle}
                      </div>
                      <p className="mt-4 max-w-md text-base leading-8 text-slate-200">
                        {copy.hero.mediaDescription}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PLACES (신설 A · 오더 #P3 [1]) ── PremiumCard 재사용, spots 0건이므로 placeholder만 렌더. */}
      <section className="space-y-6">
        <SectionTitle eyebrow={copy.places.eyebrow} title={copy.places.title} desc={copy.places.desc} />
        <PremiumCard className="p-8 text-center">
          <p className="text-base font-black tracking-tight text-slate-950 sm:text-lg">
            {copy.places.placeholder}
          </p>
        </PremiumCard>
      </section>

      {/* ── Pillars ── */}
      <section className="space-y-8">
        <SectionTitle
          eyebrow={copy.pillars.eyebrow}
          title={copy.pillars.title}
        />
        <div className="grid gap-5 md:grid-cols-3">
          {copy.pillars.items.map((item, index) => {
            const gradients = [
              { from: "#fffbee", to: "#fff4da", glow: "rgba(255,233,139,0.45)" },
              { from: "#f0fdf8", to: "#e8fbf3", glow: "rgba(141,240,207,0.45)" },
              { from: "#f0f4ff", to: "#eef2ff", glow: "rgba(100,130,255,0.4)" },
            ];
            const g = gradients[index % 3];
            return (
              <div
                key={item.title}
                style={{ background: `linear-gradient(145deg, ${g.from}, ${g.to})` }}
                className="group relative overflow-hidden rounded-[28px] border border-white/80 p-7 shadow-[0_8px_28px_rgba(16,32,58,0.07)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_0_32px_var(--glow)]"
              >
                <div className="absolute inset-x-0 top-0 h-[3px] rounded-t-[28px] bg-gradient-to-r from-[#8df0cf]/60 via-[#ffe98b]/50 to-[#ffb58f]/40" />
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-sm font-black text-slate-700 shadow-sm">
                  {index + 1}
                </div>
                <div className="mt-4 text-[1.3rem] font-black tracking-[-0.04em] text-slate-950">
                  {item.title}
                </div>
                <p className="mt-3 text-[15px] leading-7 text-slate-600">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Use Cases ── */}
      <section className="space-y-8">
        <SectionTitle
          eyebrow={copy.useCases.eyebrow}
          title={copy.useCases.title}
        />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {copy.useCases.items.map((item, index) => {
            const colors = [
              { bg: "bg-[#ffe8a0]", text: "text-[#9b7a00]" },
              { bg: "bg-[#b7f0d8]", text: "text-[#0a6b48]" },
              { bg: "bg-[#d4ddff]", text: "text-[#3655a6]" },
              { bg: "bg-[#ffd0c0]", text: "text-[#9b3a1a]" },
            ];
            const c = colors[index % 4];
            return (
              <PremiumCard key={item.title} className="p-6">
                <div className={`mb-4 inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-black ${c.bg} ${c.text}`}>
                  {index + 1}
                </div>
                <div className="text-[1.1rem] font-black tracking-[-0.03em] text-slate-950">
                  {item.title}
                </div>
                <p className="mt-3 text-sm leading-7 text-slate-500">
                  {item.description}
                </p>
              </PremiumCard>
            );
          })}
        </div>
      </section>

      {/* ── Steps ── */}
      <section className="space-y-8">
        <SectionTitle
          eyebrow={copy.steps.eyebrow}
          title={copy.steps.title}
        />
        <div className="grid gap-5 lg:grid-cols-4">
          {copy.steps.items.map((item, index) => (
            <PremiumCard key={item.step} className="p-7">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,_#8df0cf,_#a4d8ff)] text-sm font-black text-slate-950">
                  {item.step}
                </div>
              </div>
              <div className="mt-4 text-[1.2rem] font-black tracking-[-0.03em] text-slate-950">
                {item.title}
              </div>
              <p className="mt-3 text-sm leading-7 text-slate-500">
                {item.description}
              </p>
            </PremiumCard>
          ))}
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/products"
            className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#10203a] to-[#1e3a6e] px-6 py-3 text-sm font-bold text-white shadow-[0_8px_20px_rgba(16,32,58,0.20)] transition hover:brightness-110"
          >
            {copy.steps.ctas.booking}
          </Link>
          <LinkButton href="/contact" variant="secondary">
            {copy.steps.ctas.consult}
          </LinkButton>
        </div>
      </section>

      {/* ── GOYANG MOVE (신설 B · 오더 #P3 [1]) ── 헤더+설명+placeholder만.
          8단계 UX 구현 금지 (R7 소관, 버스 데이터 병목). */}
      <section className="space-y-6">
        <SectionTitle eyebrow={copy.move.eyebrow} title={copy.move.title} desc={copy.move.desc} />
        <PremiumCard className="p-8 text-center">
          <p className="text-base font-black tracking-tight text-slate-950 sm:text-lg">
            {copy.move.placeholder}
          </p>
        </PremiumCard>
      </section>

      {/* ── Partners ── */}
      <section className="relative overflow-hidden rounded-[36px] border border-white/80 bg-white/60 px-7 py-10 shadow-[0_16px_48px_rgba(16,32,58,0.08)] backdrop-blur-xl">
        <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[#8df0cf] via-[#ffe98b] to-[#ffb58f]" />
        <SectionTitle
          eyebrow={copy.partners.eyebrow}
          title={copy.partners.title}
          desc={copy.partners.description}
        />
        {/* 오더 #P3 [1]: 카테고리 태그 10개 삭제 — /best 6카테고리와 축이 겹쳐
            발견층 중복. 헤더·설명·제휴 문의 CTA만 유지. */}
        <div className="mt-6">
          <LinkButton href="/contact" variant="secondary">
            {copy.partners.button}
          </LinkButton>
        </div>
      </section>

      {/* ── Catalog Bridge (오더 #P3 [1] 배치: Partners 뒤 · Final CTA 앞) ── */}
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
