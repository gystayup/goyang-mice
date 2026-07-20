import type { Metadata } from "next";
import Image from "next/image";
import type { ReactNode } from "react";
import {
  BriefcaseBusiness,
  CalendarRange,
  Coffee,
  HeartPulse,
  Hotel,
  Landmark,
  Plane,
  Sparkles,
  Stethoscope,
  Ticket,
  UtensilsCrossed,
} from "lucide-react";

import PremiumCard from "@/components/common/PremiumCard";
import SectionTitle from "@/components/common/SectionTitle";
import Shell from "@/components/layout/Shell";
import { readDmcCategoryMediaMap } from "@/lib/dmc-category-media";
import { readDmcCustomCategories } from "@/lib/dmc-custom-categories";
import { readDmcHeroMedia } from "@/lib/dmc-hero-media";
import { Link } from "@/lib/navigation";

export const dynamic = "force-dynamic";

export type PageLocale = "ko" | "en" | "ja" | "zh-CN" | "zh-TW";

type CategoryItem = {
  key:
    | "tour"
    | "stay"
    | "restaurant"
    | "cafe"
    | "ticket"
    | "airport"
    | "medical-treatment"
    | "medical-beauty"
    | "medical-recovery";
  eyebrow: string;
  title: string;
  description: string;
  tags: string[];
  href: string;
  icon: typeof Landmark;
  theme: string;
};

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
  categories: {
    eyebrow: string;
    title: string;
    description: string;
    cta: string;
    booking: string;
    items: CategoryItem[];
  };
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
    tags: string[];
  };
  operations: {
    leftTitle: string;
    leftDescription: string;
    rightTitle: string;
    rightDescription: string;
    booking: string;
    inquiry: string;
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
    title: "고양시 MICE 안내 서비스는 이렇습니다",
    description:
      "고양을 찾는 개인 방문객, 가족, 단체, 기업고객, 전시참여자에게 지역 프로그램·숙박·음식점·카페·티켓·공항 접근 정보를 연계하여 편리한 방문과 체류를 지원합니다.",
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
  categories: {
    eyebrow: "안내 카테고리",
    title: "원스톱 지역 정보 안내",
    description: "원하는 서비스를 바로 선택하고 안내를 확인하세요",
    cta: "더 알아보기",
    booking: "안내 문의",
    items: [
      {
        key: "tour",
        eyebrow: "REGIONAL PROGRAMS",
        title: "지역 프로그램 안내",
        description:
          "공연 전후 관광과 로컬 체험을 연결하는 지역 프로그램 안내 서비스입니다.",
        tags: ["도심 탐방", "로컬 체험", "가족형 코스"],
        href: "/products/tour-experience-platform/reservation",
        icon: Landmark,
        theme: "from-[#d9ecff] via-[#fff3db] to-[#f8d8ff]",
      },
      {
        key: "stay",
        eyebrow: "ACCOMMODATION",
        title: "숙박 안내",
        description:
          "KINTEX·공연장·MICE 연계 거점 방문객을 위한 체류형 숙박 안내 서비스입니다.",
        tags: ["호텔", "레지던스", "단체 숙박"],
        href: "/products/stay-reservation-platform/reservation",
        icon: Hotel,
        theme: "from-[#e2eaff] via-[#ffffff] to-[#ffe8cb]",
      },
      {
        key: "restaurant",
        eyebrow: "RESTAURANT",
        title: "음식점 안내",
        description:
          "단체 식사와 지역 미식 경험을 연결하는 다이닝 안내 서비스입니다.",
        tags: ["단체 식사", "코스 다이닝", "VIP 만찬"],
        href: "/products/restaurant-booking-platform/reservation",
        icon: UtensilsCrossed,
        theme: "from-[#fff1df] via-[#fffaf5] to-[#ffe0d4]",
      },
      {
        key: "cafe",
        eyebrow: "LIFESTYLE",
        title: "라이프스타일 안내",
        description:
          "브런치·감성 카페·미팅 공간을 연결하는 라이프스타일 안내 서비스입니다.",
        tags: ["브런치", "디저트", "미팅 공간"],
        href: "/products/cafe-booking-platform/reservation",
        icon: Coffee,
        theme: "from-[#ecfff4] via-[#fff8eb] to-[#e6f5ff]",
      },
      {
        key: "ticket",
        eyebrow: "TICKET BOOKING",
        title: "티켓 예매",
        description:
          "공연, 전시, 체험 프로그램의 예매와 입장 흐름을 연결하는 서비스입니다.",
        tags: ["공연", "전시", "체험"],
        href: "/products/ticket-agency-platform/reservation",
        icon: Ticket,
        theme: "from-[#e7efff] via-[#fff6e4] to-[#ffd8df]",
      },
      {
        key: "airport",
        eyebrow: "AIRPORT ACCESS",
        title: "공항 접근 안내",
        description:
          "공항 도착부터 호텔과 행사장 이동까지 연결하는 교통 안내 서비스입니다.",
        tags: ["인천공항", "김포공항", "VIP 이동"],
        href: "/products/airport-pickup-platform/reservation",
        icon: Plane,
        theme: "from-[#dff6ff] via-[#ffffff] to-[#dce9ff]",
      },
      {
        key: "medical-treatment",
        eyebrow: "MEDICAL / TREATMENT",
        title: "질병치료형 안내",
        description:
          "암·중증질환·여성질환·정밀치료 진료 안내와 공항 접근·숙박·통역·사후관리를 통합 안내합니다.",
        tags: ["암·중증질환", "여성질환", "정밀치료"],
        href: "/products/medical-treatment-platform/reservation",
        icon: Stethoscope,
        theme: "from-[#e9f1ff] via-[#ffffff] to-[#f2f7ff]",
      },
      {
        key: "medical-beauty",
        eyebrow: "MEDICAL / K-BEAUTY",
        title: "건강미용 증진형 안내",
        description:
          "성형·피부·웰니스 프로그램을 프리미엄 스테이와 다국어 응대 기반으로 안내합니다.",
        tags: ["성형", "피부", "웰니스"],
        href: "/products/medical-beauty-platform/reservation",
        icon: Sparkles,
        theme: "from-[#f2f7ff] via-[#fff5f5] to-[#fff0ea]",
      },
      {
        key: "medical-recovery",
        eyebrow: "MEDICAL / RECOVERY",
        title: "회복·재활 안내",
        description:
          "회복체류, 재활, 보호자 동반 서비스와 식이·의료일정·심리상담까지 연결합니다.",
        tags: ["회복체류", "재활", "보호자 동반"],
        href: "/products/medical-recovery-platform/reservation",
        icon: HeartPulse,
        theme: "from-[#eef7ff] via-[#f5f9ff] to-[#e6f0ff]",
      },
    ],
  },
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
    title: "고양의 장소와 서비스를 연결합니다",
    description:
      "고양 MICE 안내는 숙박·다이닝·교통·공연장·전시장·로컬 공간·MICE 연계 거점을 연결하여 방문자의 이동과 체류, 지역 경험이 자연스럽게 이어지도록 설계합니다.",
    button: "제휴 문의하기",
    tags: [
      "호텔",
      "레지던스",
      "음식점",
      "카페",
      "공연장",
      "전시장",
      "교통",
      "로컬 공간",
      "쇼핑",
      "MICE 연계 거점",
    ],
  },
  operations: {
    leftTitle: "서비스는 하나의 안내 구조 안에서 확장됩니다",
    leftDescription:
      "지역 프로그램·숙박·다이닝·티켓·공항 접근이 같은 사용자 경험 구조 안에서 운영되어 카테고리 확장이 쉽습니다.",
    rightTitle: "안내와 운영은 하나의 통합 시스템으로 연결됩니다",
    rightDescription:
      "안내·일정·티켓 결제·운영이 하나의 관리자 구조로 연결되어 사용자에게는 간단하고 운영자에게는 효율적인 서비스가 됩니다.",
    booking: "안내 카테고리 보기",
    inquiry: "제휴 / 운영 문의",
  },
  final: {
    title: "지금 바로 고양의 MICE 안내 서비스를 시작해 보세요",
    description:
      "개인 안내부터 기업 / 단체 운영, 그리고 로컬 파트너 협업까지 고양의 문화관광 MICE 여정을 더 쉽게 연결합니다.",
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
    title: "This is how Goyang's MICE guide works",
    description:
      "We support easier visits and stays in Goyang by connecting regional programs, accommodation, restaurants, cafes, tickets, and airport access for individual visitors, families, groups, corporate clients, and exhibition participants.",
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
  categories: {
    eyebrow: "Guide Categories",
    title: "One-stop Regional Information Guide",
    description: "Select the service you need and see the guide right away.",
    cta: "Learn More",
    booking: "Contact for Info",
    items: [
      {
        key: "tour",
        eyebrow: "REGIONAL PROGRAMS",
        title: "Regional Programs Guide",
        description: "Guide for regional programs that connect sightseeing and local experiences before and after events.",
        tags: ["City Walk", "Local Experience", "Family Course"],
        href: "/products/tour-experience-platform/reservation",
        icon: Landmark,
        theme: "from-[#d9ecff] via-[#fff3db] to-[#f8d8ff]",
      },
      {
        key: "stay",
        eyebrow: "ACCOMMODATION",
        title: "Stay Guide",
        description: "Stay guide for visitors to KINTEX, venues, and MICE-linked hubs in Goyang.",
        tags: ["Hotel", "Residence", "Group Stay"],
        href: "/products/stay-reservation-platform/reservation",
        icon: Hotel,
        theme: "from-[#e2eaff] via-[#ffffff] to-[#ffe8cb]",
      },
      {
        key: "restaurant",
        eyebrow: "RESTAURANT",
        title: "Restaurant Guide",
        description: "Dining guide connecting group meals and local culinary experiences.",
        tags: ["Group Dining", "Course Dining", "VIP Dinner"],
        href: "/products/restaurant-booking-platform/reservation",
        icon: UtensilsCrossed,
        theme: "from-[#fff1df] via-[#fffaf5] to-[#ffe0d4]",
      },
      {
        key: "cafe",
        eyebrow: "LIFESTYLE",
        title: "Lifestyle Guide",
        description: "Cafe, brunch, and local lifestyle guide for rest and small gatherings.",
        tags: ["Brunch", "Dessert", "Meeting Space"],
        href: "/products/cafe-booking-platform/reservation",
        icon: Coffee,
        theme: "from-[#ecfff4] via-[#fff8eb] to-[#e6f5ff]",
      },
      {
        key: "ticket",
        eyebrow: "TICKET BOOKING",
        title: "Ticket Booking",
        description: "Ticket services for performances, exhibitions, and activity programs.",
        tags: ["Performance", "Exhibition", "Activity"],
        href: "/products/ticket-agency-platform/reservation",
        icon: Ticket,
        theme: "from-[#e7efff] via-[#fff6e4] to-[#ffd8df]",
      },
      {
        key: "airport",
        eyebrow: "AIRPORT ACCESS",
        title: "Airport Access Guide",
        description: "Guide connecting airport arrival to hotels, venues, and city movement.",
        tags: ["Incheon Airport", "Gimpo Airport", "VIP Transfer"],
        href: "/products/airport-pickup-platform/reservation",
        icon: Plane,
        theme: "from-[#dff6ff] via-[#ffffff] to-[#dce9ff]",
      },
      {
        key: "medical-treatment",
        eyebrow: "MEDICAL / TREATMENT",
        title: "Treatment-Focused Guide",
        description: "Integrated guide for cancer, severe illness, women's health, and precision care alongside airport access, stay, interpretation, and aftercare.",
        tags: ["Cancer & Severe", "Women's Health", "Precision Care"],
        href: "/products/medical-treatment-platform/reservation",
        icon: Stethoscope,
        theme: "from-[#e9f1ff] via-[#ffffff] to-[#f2f7ff]",
      },
      {
        key: "medical-beauty",
        eyebrow: "MEDICAL / K-BEAUTY",
        title: "Health & Beauty Guide",
        description: "Plastic surgery, dermatology, and wellness programs introduced alongside premium stay and multilingual support.",
        tags: ["Plastic Surgery", "Dermatology", "Wellness"],
        href: "/products/medical-beauty-platform/reservation",
        icon: Sparkles,
        theme: "from-[#f2f7ff] via-[#fff5f5] to-[#fff0ea]",
      },
      {
        key: "medical-recovery",
        eyebrow: "MEDICAL / RECOVERY",
        title: "Recovery & Rehabilitation Guide",
        description: "Recovery stays, rehabilitation, and caregiver-companion services connected with diet, medical schedule, and counseling support.",
        tags: ["Recovery Stay", "Rehabilitation", "Caregiver"],
        href: "/products/medical-recovery-platform/reservation",
        icon: HeartPulse,
        theme: "from-[#eef7ff] via-[#f5f9ff] to-[#e6f0ff]",
      },
    ],
  },
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
    title: "Connecting Goyang's places and services",
    description:
      "Goyang's MICE Guide connects stay, dining, transport, venues, exhibition halls, local places, and MICE-linked hubs so visitor movement, stay, and regional experience flow naturally.",
    button: "Partnership Inquiry",
    tags: [
      "Hotel",
      "Residence",
      "Restaurant",
      "Cafe",
      "Venue",
      "Exhibition Hall",
      "Transport",
      "Local Space",
      "Shopping",
      "MICE-linked Hub",
    ],
  },
  operations: {
    leftTitle: "Services expand within one guide structure",
    leftDescription:
      "Regional programs, accommodation, dining, tickets, and airport access share one user experience structure, making expansion easier.",
    rightTitle: "Guide and operations are managed in one integrated system",
    rightDescription:
      "Inquiries, schedules, ticket payments, and operations are connected in one admin structure for easier user experience and efficient operations.",
    booking: "View Guide Categories",
    inquiry: "Partnership & Operations Inquiry",
  },
  final: {
    title: "Start using Goyang's MICE Guide today",
    description:
      "From individual inquiries to corporate group operations and local partner collaboration, Goyang's MICE journey becomes more connected.",
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
    title: "高陽市MICE案内サービスをご紹介します",
    description:
      "高陽を訪れる個人訪問者、家族、団体、法人のお客様、展示参加者に、地域プログラム・宿泊・飲食店・カフェ・チケット・空港アクセス情報を組み合わせてご案内し、快適な訪問と滞在をサポートします。",
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
  categories: {
    eyebrow: "案内カテゴリ",
    title: "ワンストップ地域情報案内",
    description: "以下のカテゴリを選択すると、サービス詳細と案内ページへ直接移動できます。",
    cta: "詳しく見る",
    booking: "案内お問い合わせ",
    items: [
      { key: "tour", eyebrow: "REGIONAL PROGRAMS", title: "地域プログラム案内", description: "公演前後の観光とローカル体験をつなぐ地域プログラム案内サービスです。", tags: ["都心散策", "ローカル体験", "ファミリーコース"], href: "/products/tour-experience-platform/reservation", icon: Landmark, theme: "from-[#d9ecff] via-[#fff3db] to-[#f8d8ff]" },
      { key: "stay", eyebrow: "ACCOMMODATION", title: "宿泊案内", description: "KINTEX・公演場・MICE連携拠点への訪問者向け滞在型宿泊案内サービスです。", tags: ["ホテル", "レジデンス", "団体宿泊"], href: "/products/stay-reservation-platform/reservation", icon: Hotel, theme: "from-[#e2eaff] via-[#ffffff] to-[#ffe8cb]" },
      { key: "restaurant", eyebrow: "RESTAURANT", title: "飲食店案内", description: "団体食事と地域グルメ体験をつなぐダイニング案内サービスです。", tags: ["団体食事", "コースダイニング", "VIPディナー"], href: "/products/restaurant-booking-platform/reservation", icon: UtensilsCrossed, theme: "from-[#fff1df] via-[#fffaf5] to-[#ffe0d4]" },
      { key: "cafe", eyebrow: "LIFESTYLE", title: "ライフスタイル案内", description: "ブランチ、カフェ、ミーティングスペースをつなぐライフスタイル案内サービスです。", tags: ["ブランチ", "デザート", "ミーティングスペース"], href: "/products/cafe-booking-platform/reservation", icon: Coffee, theme: "from-[#ecfff4] via-[#fff8eb] to-[#e6f5ff]" },
      { key: "ticket", eyebrow: "TICKET BOOKING", title: "チケット予約", description: "公演、展示、体験プログラムの予約と入場フローをつなぐサービスです。", tags: ["公演", "展示", "体験"], href: "/products/ticket-agency-platform/reservation", icon: Ticket, theme: "from-[#e7efff] via-[#fff6e4] to-[#ffd8df]" },
      { key: "airport", eyebrow: "AIRPORT ACCESS", title: "空港アクセス案内", description: "空港到着からホテルと会場への移動をつなぐ交通案内サービスです。", tags: ["仁川空港", "金浦空港", "VIP移動"], href: "/products/airport-pickup-platform/reservation", icon: Plane, theme: "from-[#dff6ff] via-[#ffffff] to-[#dce9ff]" },
      { key: "medical-treatment", eyebrow: "MEDICAL / TREATMENT", title: "疾病治療型案内", description: "がん・重症疾患・女性疾患・精密治療の診療案内に、空港アクセス・宿泊・通訳・アフターケアを統合します。", tags: ["がん・重症", "女性疾患", "精密治療"], href: "/products/medical-treatment-platform/reservation", icon: Stethoscope, theme: "from-[#e9f1ff] via-[#ffffff] to-[#f2f7ff]" },
      { key: "medical-beauty", eyebrow: "MEDICAL / K-BEAUTY", title: "健康美容増進型案内", description: "美容整形・皮膚科・ウェルネスプログラムをプレミアムステイと多言語対応でご案内します。", tags: ["美容整形", "皮膚科", "ウェルネス"], href: "/products/medical-beauty-platform/reservation", icon: Sparkles, theme: "from-[#f2f7ff] via-[#fff5f5] to-[#fff0ea]" },
      { key: "medical-recovery", eyebrow: "MEDICAL / RECOVERY", title: "回復・リハビリ案内", description: "回復滞在、リハビリ、同行者サービスに食事・医療日程・カウンセリングまで連携します。", tags: ["回復滞在", "リハビリ", "同行者"], href: "/products/medical-recovery-platform/reservation", icon: HeartPulse, theme: "from-[#eef7ff] via-[#f5f9ff] to-[#e6f0ff]" },
    ],
  },
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
    title: "高陽の場所とサービスをつなぎます",
    description: "高陽MICE案内は宿泊・飲食・交通・公演場・展示場・ローカル空間・MICE連携拠点をつなぎ、訪問者の動きと消費、地域体験を自然な流れにします。",
    button: "提携のお問い合わせ",
    tags: ["ホテル", "レジデンス", "飲食店", "カフェ", "公演場", "展示場", "交通", "ローカル空間", "ショッピング", "MICE連携拠点"],
  },
  operations: {
    leftTitle: "サービスはひとつの案内構造の中で拡張されます",
    leftDescription: "地域プログラム・宿泊・飲食・チケット・空港アクセスがひとつのユーザー体験を共有し、拡張が容易になります。",
    rightTitle: "案内と運営はひとつの統合システムで管理されます",
    rightDescription: "案内・スケジュール・チケット決済・運営がひとつの管理者構造でつながり、ユーザーには簡単で、運営者には効率的なサービスになります。",
    booking: "案内カテゴリを見る",
    inquiry: "提携 / 運営のお問い合わせ",
  },
  final: {
    title: "今すぐ高陽のMICE案内を始めましょう",
    description: "個人案内から法人・団体運営、ローカルパートナー協業まで、高陽の文化観光MICEの旅をより簡単につなぎます。",
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
    title: "高阳市MICE指南服务介绍",
    description: "为前来高阳的个人访客、家庭、团体、企业客户及展览参展者，提供地区节目·住宿·餐厅·咖啡厅·票务及机场接送信息一体化指南，助力便捷访问与舒适驻留。",
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
  categories: {
    eyebrow: "指南类别",
    title: "一站式地区信息指南",
    description: "选择以下类别，可直接跳转至服务详情与指南页面。",
    cta: "了解更多",
    booking: "咨询指南",
    items: [
      { key: "tour", eyebrow: "REGIONAL PROGRAMS", title: "地区节目指南", description: "连接演出前后观光与本地体验的地区节目指南服务。", tags: ["城市漫游", "本地体验", "家庭路线"], href: "/products/tour-experience-platform/reservation", icon: Landmark, theme: "from-[#d9ecff] via-[#fff3db] to-[#f8d8ff]" },
      { key: "stay", eyebrow: "ACCOMMODATION", title: "住宿指南", description: "为KINTEX、演出场馆、MICE联动据点访客提供的驻留型住宿指南服务。", tags: ["酒店", "公寓式酒店", "团体住宿"], href: "/products/stay-reservation-platform/reservation", icon: Hotel, theme: "from-[#e2eaff] via-[#ffffff] to-[#ffe8cb]" },
      { key: "restaurant", eyebrow: "RESTAURANT", title: "餐厅指南", description: "连接团体用餐与本地美食体验的餐饮指南服务。", tags: ["团体用餐", "套餐餐厅", "VIP晚宴"], href: "/products/restaurant-booking-platform/reservation", icon: UtensilsCrossed, theme: "from-[#fff1df] via-[#fffaf5] to-[#ffe0d4]" },
      { key: "cafe", eyebrow: "LIFESTYLE", title: "生活方式指南", description: "连接早午餐、咖啡馆及会议空间的生活方式指南服务。", tags: ["早午餐", "甜品", "会议空间"], href: "/products/cafe-booking-platform/reservation", icon: Coffee, theme: "from-[#ecfff4] via-[#fff8eb] to-[#e6f5ff]" },
      { key: "ticket", eyebrow: "TICKET BOOKING", title: "票务预约", description: "连接演出、展览及体验项目预约与入场流程的服务。", tags: ["演出", "展览", "体验"], href: "/products/ticket-agency-platform/reservation", icon: Ticket, theme: "from-[#e7efff] via-[#fff6e4] to-[#ffd8df]" },
      { key: "airport", eyebrow: "AIRPORT ACCESS", title: "机场接送指南", description: "从机场抵达到酒店及活动场馆的交通接送指南服务。", tags: ["仁川机场", "金浦机场", "VIP接送"], href: "/products/airport-pickup-platform/reservation", icon: Plane, theme: "from-[#dff6ff] via-[#ffffff] to-[#dce9ff]" },
      { key: "medical-treatment", eyebrow: "MEDICAL / TREATMENT", title: "疾病治疗型指南", description: "整合癌症·重症·女性疾病·精密治疗的诊疗指南与机场接送·住宿·翻译·后续护理。", tags: ["癌症·重症", "女性疾病", "精密治疗"], href: "/products/medical-treatment-platform/reservation", icon: Stethoscope, theme: "from-[#e9f1ff] via-[#ffffff] to-[#f2f7ff]" },
      { key: "medical-beauty", eyebrow: "MEDICAL / K-BEAUTY", title: "健康美容增进型指南", description: "将整形·皮肤·健康管理项目与高端住宿及多语言服务一同介绍。", tags: ["整形", "皮肤", "健康管理"], href: "/products/medical-beauty-platform/reservation", icon: Sparkles, theme: "from-[#f2f7ff] via-[#fff5f5] to-[#fff0ea]" },
      { key: "medical-recovery", eyebrow: "MEDICAL / RECOVERY", title: "恢复·康复指南", description: "将恢复驻留、康复治疗、陪护服务与饮食·医疗行程·心理咨询整合连接。", tags: ["恢复驻留", "康复治疗", "陪护同行"], href: "/products/medical-recovery-platform/reservation", icon: HeartPulse, theme: "from-[#eef7ff] via-[#f5f9ff] to-[#e6f0ff]" },
    ],
  },
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
    title: "连接高阳的场所与服务",
    description: "高阳MICE指南整合住宿、餐饮、交通、演出场馆、展览馆、本地空间与MICE联动据点，让访客的出行、驻留与地区体验自然流畅。",
    button: "合作咨询",
    tags: ["酒店", "公寓式酒店", "餐厅", "咖啡厅", "演出场馆", "展览馆", "交通", "本地空间", "购物", "MICE联动据点"],
  },
  operations: {
    leftTitle: "服务在统一指南结构中扩展",
    leftDescription: "地区节目、住宿、餐饮、票务与机场接送共享同一用户体验，便于灵活扩展。",
    rightTitle: "指南与运营在一套集成系统中统一管理",
    rightDescription: "咨询、日程、票务支付与运营通过一套管理员结构相互连接，对用户简便，对运营者高效。",
    booking: "查看指南类别",
    inquiry: "合作/运营咨询",
  },
  final: {
    title: "立即开启高阳MICE指南体验",
    description: "从个人咨询到企业团体运营，再到本地合作伙伴协作，让高阳文化旅游MICE旅程更加便捷相连。",
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
    title: "高陽市MICE指南服務介紹",
    description: "為前來高陽的個人訪客、家庭、團體、企業客戶及展覽參展者，提供地區節目·住宿·餐廳·咖啡廳·票務及機場接送資訊一體化指南，助力便捷訪問與舒適駐留。",
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
  categories: {
    eyebrow: "指南類別",
    title: "一站式地區資訊指南",
    description: "選擇以下類別，可直接跳轉至服務詳情與指南頁面。",
    cta: "了解更多",
    booking: "諮詢指南",
    items: [
      { key: "tour", eyebrow: "REGIONAL PROGRAMS", title: "地區節目指南", description: "連結演出前後觀光與在地體驗的地區節目指南服務。", tags: ["城市漫遊", "在地體驗", "家庭路線"], href: "/products/tour-experience-platform/reservation", icon: Landmark, theme: "from-[#d9ecff] via-[#fff3db] to-[#f8d8ff]" },
      { key: "stay", eyebrow: "ACCOMMODATION", title: "住宿指南", description: "為KINTEX、演出場館、MICE聯動據點訪客提供的駐留型住宿指南服務。", tags: ["飯店", "公寓式酒店", "團體住宿"], href: "/products/stay-reservation-platform/reservation", icon: Hotel, theme: "from-[#e2eaff] via-[#ffffff] to-[#ffe8cb]" },
      { key: "restaurant", eyebrow: "RESTAURANT", title: "餐廳指南", description: "連結團體用餐與在地美食體驗的餐飲指南服務。", tags: ["團體用餐", "套餐餐廳", "VIP晚宴"], href: "/products/restaurant-booking-platform/reservation", icon: UtensilsCrossed, theme: "from-[#fff1df] via-[#fffaf5] to-[#ffe0d4]" },
      { key: "cafe", eyebrow: "LIFESTYLE", title: "生活風格指南", description: "連結早午餐、咖啡廳及會議空間的生活風格指南服務。", tags: ["早午餐", "甜品", "會議空間"], href: "/products/cafe-booking-platform/reservation", icon: Coffee, theme: "from-[#ecfff4] via-[#fff8eb] to-[#e6f5ff]" },
      { key: "ticket", eyebrow: "TICKET BOOKING", title: "票務預約", description: "連結演出、展覽及體驗方案預約與入場流程的服務。", tags: ["演出", "展覽", "體驗"], href: "/products/ticket-agency-platform/reservation", icon: Ticket, theme: "from-[#e7efff] via-[#fff6e4] to-[#ffd8df]" },
      { key: "airport", eyebrow: "AIRPORT ACCESS", title: "機場接送指南", description: "從機場抵達到飯店及活動場館的交通接送指南服務。", tags: ["仁川機場", "金浦機場", "VIP接送"], href: "/products/airport-pickup-platform/reservation", icon: Plane, theme: "from-[#dff6ff] via-[#ffffff] to-[#dce9ff]" },
      { key: "medical-treatment", eyebrow: "MEDICAL / TREATMENT", title: "疾病治療型指南", description: "整合癌症·重症·女性疾病·精密治療的診療指南與機場接送·住宿·翻譯·後續照護。", tags: ["癌症·重症", "女性疾病", "精密治療"], href: "/products/medical-treatment-platform/reservation", icon: Stethoscope, theme: "from-[#e9f1ff] via-[#ffffff] to-[#f2f7ff]" },
      { key: "medical-beauty", eyebrow: "MEDICAL / K-BEAUTY", title: "健康美容增進型指南", description: "將整形·皮膚·健康管理方案與高端住宿及多語言服務一同介紹。", tags: ["整形", "皮膚", "健康管理"], href: "/products/medical-beauty-platform/reservation", icon: Sparkles, theme: "from-[#f2f7ff] via-[#fff5f5] to-[#fff0ea]" },
      { key: "medical-recovery", eyebrow: "MEDICAL / RECOVERY", title: "恢復·復健指南", description: "將恢復駐留、復健治療、陪護服務與飲食·醫療行程·心理諮詢整合連結。", tags: ["恢復駐留", "復健治療", "陪護同行"], href: "/products/medical-recovery-platform/reservation", icon: HeartPulse, theme: "from-[#eef7ff] via-[#f5f9ff] to-[#e6f0ff]" },
    ],
  },
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
    title: "連結高陽的場所與服務",
    description: "高陽MICE指南整合住宿、餐飲、交通、演出場館、展覽館、在地空間與MICE聯動據點，讓訪客的出行、駐留與地區體驗自然流暢。",
    button: "合作諮詢",
    tags: ["飯店", "公寓式酒店", "餐廳", "咖啡廳", "演出場館", "展覽館", "交通", "在地空間", "購物", "MICE聯動據點"],
  },
  operations: {
    leftTitle: "服務在統一指南結構中擴展",
    leftDescription: "地區節目、住宿、餐飲、票務與機場接送共享同一使用者體驗，便於靈活擴展。",
    rightTitle: "指南與營運在一套整合系統中統一管理",
    rightDescription: "諮詢、日程、票務支付與營運透過一套管理員結構相互連結，對使用者簡便，對營運者高效。",
    booking: "查看指南類別",
    inquiry: "合作/營運諮詢",
  },
  final: {
    title: "立即開啟高陽MICE指南體驗",
    description: "從個人諮詢到企業團體營運，再到在地合作夥伴協作，讓高陽文化旅遊MICE旅程更加便捷相連。",
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
  const categoryMediaMap = await readDmcCategoryMediaMap();
  const customCategories = await readDmcCustomCategories();

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

      <section id="booking-categories" className="space-y-8">
        <SectionTitle
          eyebrow={copy.categories.eyebrow}
          title={copy.categories.title}
          desc={copy.categories.description}
        />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {copy.categories.items.map((item) => {
            const Icon = item.icon;
            const media = (categoryMediaMap as Record<string, { src?: string } | undefined>)[item.key];

            return (
              <article
                key={item.key}
                className="group flex h-full flex-col overflow-hidden rounded-[30px] border border-white/80 bg-white/80 shadow-[0_8px_28px_rgba(16,32,58,0.08)] backdrop-blur-sm transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_50px_rgba(16,32,58,0.13)]"
              >
                <div className={`relative aspect-[4/3] overflow-hidden bg-gradient-to-br ${item.theme}`}>
                  {media?.src ? (
                    <Image
                      src={media.src}
                      alt={item.title}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-[1.03]"
                      unoptimized
                    />
                  ) : (
                    <div className="flex h-full items-start justify-between p-7">
                      <span className="rounded-full bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-slate-700 backdrop-blur">
                        {item.eyebrow}
                      </span>
                      <div className="rounded-full bg-slate-950/90 p-4 text-white shadow-lg backdrop-blur">
                        <Icon className="h-6 w-6" />
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/75 to-transparent p-6">
                    <div className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/75">
                      {item.eyebrow}
                    </div>
                    <div className="mt-2 text-2xl font-black tracking-[-0.03em] text-white">
                      {item.title}
                    </div>
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-7">
                  <p className="min-h-[5.5rem] text-[15px] leading-7 text-slate-500">
                    {item.description}
                  </p>

                  <div className="mt-5 flex min-h-[3.5rem] flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-white/70 bg-white/70 px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm backdrop-blur"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto flex gap-3 pt-7">
                    <Link
                      href={`/products#section-${item.key}`}
                      className="inline-flex flex-1 items-center justify-center rounded-full border border-slate-200 bg-white/80 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-white"
                    >
                      {copy.categories.cta}
                    </Link>
                    <Link
                      href={`/products#section-${item.key}`}
                      className="inline-flex flex-1 items-center justify-center rounded-full bg-gradient-to-r from-[#10203a] to-[#1e3a6e] px-5 py-3 text-sm font-bold text-white transition hover:brightness-110"
                    >
                      {copy.categories.booking}
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}

          {/* 사용자 정의 카테고리 (관리자에서 추가한 항목) */}
          {customCategories.map((custom) => (
            <article
              key={`custom-${custom.slug}`}
              className="group flex h-full flex-col overflow-hidden rounded-[30px] border border-white/80 bg-white/80 shadow-[0_8px_28px_rgba(16,32,58,0.08)] backdrop-blur-sm transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_50px_rgba(16,32,58,0.13)]"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-[#eef2ff] via-[#ffffff] to-[#f1f5f9]">
                {custom.src ? (
                  <Image
                    src={custom.src}
                    alt={custom.label}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-[1.03]"
                    unoptimized
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-slate-400">
                    <Landmark className="h-12 w-12" />
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/75 to-transparent p-6">
                  <div className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/75">
                    CUSTOM
                  </div>
                  <div className="mt-2 text-2xl font-black tracking-[-0.03em] text-white">
                    {custom.label}
                  </div>
                </div>
              </div>

              <div className="flex flex-1 flex-col p-7">
                <p className="min-h-[5.5rem] text-[15px] leading-7 text-slate-500">
                  {custom.description ?? "관리자에서 설정한 맞춤 카테고리입니다."}
                </p>
                <div className="mt-auto flex gap-3 pt-7">
                  <Link
                    href={`/contact`}
                    className="inline-flex flex-1 items-center justify-center rounded-full border border-slate-200 bg-white/80 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-white"
                  >
                    {copy.categories.cta}
                  </Link>
                  <Link
                    href={`/contact`}
                    className="inline-flex flex-1 items-center justify-center rounded-full bg-gradient-to-r from-[#10203a] to-[#1e3a6e] px-5 py-3 text-sm font-bold text-white transition hover:brightness-110"
                  >
                    {copy.categories.booking}
                  </Link>
                </div>
              </div>
            </article>
          ))}
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
          <a
            href="#booking-categories"
            className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#10203a] to-[#1e3a6e] px-6 py-3 text-sm font-bold text-white shadow-[0_8px_20px_rgba(16,32,58,0.20)] transition hover:brightness-110"
          >
            {copy.steps.ctas.booking}
          </a>
          <LinkButton href="/contact" variant="secondary">
            {copy.steps.ctas.consult}
          </LinkButton>
        </div>
      </section>

      {/* ── Partners ── */}
      <section className="relative overflow-hidden rounded-[36px] border border-white/80 bg-white/60 px-7 py-10 shadow-[0_16px_48px_rgba(16,32,58,0.08)] backdrop-blur-xl">
        <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[#8df0cf] via-[#ffe98b] to-[#ffb58f]" />
        <SectionTitle
          eyebrow={copy.partners.eyebrow}
          title={copy.partners.title}
          desc={copy.partners.description}
        />
        <div className="mt-6 flex flex-wrap gap-2.5">
          {copy.partners.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/70 bg-white/80 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur transition hover:bg-white hover:shadow-md"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="mt-6">
          <LinkButton href="/contact" variant="secondary">
            {copy.partners.button}
          </LinkButton>
        </div>
      </section>

      {/* ── Operations ── */}
      <section className="grid gap-5 lg:grid-cols-2">
        <PremiumCard className="p-8">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-[linear-gradient(135deg,_#fffbee,_#fff4da)] p-3 shadow-sm">
              <CalendarRange className="h-5 w-5 text-[#9b7a00]" />
            </div>
            <div className="text-[1.2rem] font-black tracking-[-0.03em] text-slate-950 leading-[1.3]">
              {copy.operations.leftTitle}
            </div>
          </div>
          <p className="mt-5 text-[15px] leading-7 text-slate-500">
            {copy.operations.leftDescription}
          </p>
        </PremiumCard>

        <PremiumCard className="p-8">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-[linear-gradient(135deg,_#f0fdf8,_#e8fbf3)] p-3 shadow-sm">
              <BriefcaseBusiness className="h-5 w-5 text-[#0a6b48]" />
            </div>
            <div className="text-[1.2rem] font-black tracking-[-0.03em] text-slate-950 leading-[1.3]">
              {copy.operations.rightTitle}
            </div>
          </div>
          <p className="mt-5 text-[15px] leading-7 text-slate-500">
            {copy.operations.rightDescription}
          </p>
        </PremiumCard>

        <div className="flex flex-wrap gap-3 lg:col-span-2">
          <a
            href="#booking-categories"
            className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#10203a] to-[#1e3a6e] px-6 py-3 text-sm font-bold text-white shadow-[0_8px_20px_rgba(16,32,58,0.20)] transition hover:brightness-110"
          >
            {copy.operations.booking}
          </a>
          <LinkButton href="/contact" variant="secondary">
            {copy.operations.inquiry}
          </LinkButton>
        </div>
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
