"use client";

import { useMemo, useRef, useState } from "react";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import {
  BarChart3,
  Building2,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  FileText,
  Globe2,
  LayoutDashboard,
  Mail,
  MapPinned,
  Menu,
  Package,
  Phone,
  Search,
  Settings,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";

type PageKey =
  | "home"
  | "institute"
  | "research"
  | "dmc"
  | "products"
  | "booking"
  | "contact"
  | "admin";

type NavItem = {
  key: PageKey;
  label: string;
};

type Product = {
  id: number;
  type: string;
  slug: string;
  title: string;
  desc: string;
  duration: string;
  price: number;
  people: string;
  tag: string;
  image: string;
  includes: string[];
  caution: string[];
  status: "게시중" | "숨김";
  featured: boolean;
};

type Booking = {
  id: number;
  bookingNo: string;
  productId: number;
  productTitle: string;
  organization: string;
  name: string;
  phone: string;
  email: string;
  date: string;
  option: string;
  guests: number;
  totalPrice: number;
  status: "접수" | "검토중" | "예약확정" | "보류" | "취소";
  createdAt: string;
};

type Inquiry = {
  id: number;
  type: string;
  organization: string;
  name: string;
  phone: string;
  email: string;
  subject: string;
  status: "접수" | "검토중" | "회신완료" | "완료";
  createdAt: string;
};

type Partner = {
  id: number;
  name: string;
  type: string;
  status: string;
};

type IconComponent = typeof LayoutDashboard;

type AdminMenu = {
  key: string;
  label: string;
  icon: IconComponent;
};

type BookingOption = {
  label: string;
  multiplier: number;
};

type BookingFormState = {
  organization: string;
  name: string;
  phone: string;
  email: string;
  note: string;
  agree: boolean;
};

type ContactFormState = {
  organization: string;
  name: string;
  phone: string;
  email: string;
  project: string;
  date: string;
  people: string;
  budget: string;
  type: string;
  message: string;
  agree: boolean;
};

const navItems: NavItem[] = [
  { key: "home", label: "HOME" },
  { key: "institute", label: "연구소 소개" },
  { key: "research", label: "연구 분야" },
  { key: "dmc", label: "DMC 서비스" },
  { key: "products", label: "숙박·체험·관광상품" },
  { key: "booking", label: "예약" },
  { key: "contact", label: "문의하기" },
  { key: "admin", label: "관리자 CMS" },
];

const visualAssets = {
  heroMain:
    "https://www.goyang.go.kr/visitgoyang/site/www/images/contents/cts66_img2.jpg",
  heroMeeting:
    "https://www.goyang.go.kr/visitgoyang/site/www/images/contents/cts66_img3.jpg",
  heroTour:
    "https://www.goyang.go.kr/visitgoyang/site/www/images/contents/cts69_img2.jpg",
  institute:
    "https://www.goyang.go.kr/visitgoyang/DATA/tourRsrc/20221220041203606_AN1o.jpg",
  contact:
    "https://www.goyang.go.kr/visitgoyang/DATA/tourRsrc/20221220041102284_ZUxb.jpg",
};

const strengths = [
  "KINTEX 중심의 국내 최대 전시·컨벤션 경쟁력",
  "일산호수공원의 호수형 치유·체류 콘텐츠",
  "고양 특별관광지구 기반의 복합 관광 동선",
  "아람누리·라페스타·웨스턴돔 연계 야간 체류 확장성",
];

const researchAreas = [
  {
    title: "KINTEX 기반 MICE 전략연구",
    desc: "국내 최대 전시·컨벤션 인프라를 도시 성장전략으로 연결하는 연구",
  },
  {
    title: "일산호수공원 체류형 관광연구",
    desc: "호수공원 기반의 치유형 콘텐츠와 체류형 관광모델을 설계하는 연구",
  },
  {
    title: "고양 특별관광지구 브랜딩 연구",
    desc: "특별관광지구의 상권·관광·문화 자산을 도시브랜드로 연결하는 전략 개발",
  },
  {
    title: "아람누리·문화예술 연계 연구",
    desc: "공연, 전시, 예술 콘텐츠를 관광·MICE 동선과 결합하는 운영모델 연구",
  },
  {
    title: "DMC 상품화 모델 연구",
    desc: "현장 운영과 예약 전환이 가능한 상품 구조와 운영 체계를 설계하는 연구",
  },
  {
    title: "산업연계 협력연구",
    desc: "숙박, 교통, 공연, 식음, 상권, 로컬 파트너를 연결하는 협력 구조 연구",
  },
];

const dmcServices = [
  {
    title: "KINTEX 연계 국제회의·포럼 운영",
    desc: "전시, 국제회의, 공공포럼, 비즈니스 미팅을 고양 현지 프로그램과 결합해 운영합니다.",
  },
  {
    title: "기업행사 및 방문단 프로그램 운영",
    desc: "기업 세미나, 리더십 프로그램, 기관 방문단 일정과 로컬 체험을 결합합니다.",
  },
  {
    title: "일산호수공원 연계 인센티브투어",
    desc: "호수공원 중심의 휴식형 프로그램과 식음·문화 동선을 결합합니다.",
  },
  {
    title: "고양 특별관광지구 팸투어·시찰",
    desc: "라페스타, 웨스턴돔 등 연계형 투어를 설계합니다.",
  },
  {
    title: "VIP 의전 및 프리미엄 동선 설계",
    desc: "교통, 숙박, 의전, 만찬, 문화일정을 포함한 고급형 프로그램을 제공합니다.",
  },
  {
    title: "아람누리·상권 연계 로컬 콘텐츠",
    desc: "고양아람누리와 지역 상권을 연계한 야간 체류형 콘텐츠를 기획합니다.",
  },
];

const initialProducts: Product[] = [
  {
    id: 1,
    type: "숙박",
    slug: "kintex-business-stay",
    title: "KINTEX 연계 비즈니스 스테이",
    desc: "전시·회의 참가자와 해외 방문단을 위한 킨텍스 중심 숙박 패키지",
    duration: "1박~3박",
    price: 180000,
    people: "1~20명",
    tag: "KINTEX",
    image:
      "https://www.goyang.go.kr/visitgoyang/site/www/images/contents/cts66_img4.jpg",
    includes: ["호텔 1박", "행사장 셔틀 안내", "현지 문의 대응", "기본 체크인 가이드"],
    caution: ["성수기 요금 변동 가능", "단체 인원 별도 협의", "체크인 시간 호텔 기준 적용"],
    status: "게시중",
    featured: true,
  },
  {
    id: 2,
    type: "체험",
    slug: "ilsan-lake-park-healing",
    title: "일산호수공원 힐링 반일 코스",
    desc: "호수공원 산책, 문화예술, 로컬 동선을 결합한 체험형 프로그램",
    duration: "약 4시간",
    price: 85000,
    people: "10~40명",
    tag: "호수공원",
    image:
      "https://www.goyang.go.kr/visitgoyang/site/www/images/contents/cts69_img4.jpg",
    includes: ["가이드 진행", "기본 동선 설계", "체험 운영비", "현장 안내 자료"],
    caution: ["우천 시 일부 동선 변경", "대규모 그룹 사전협의", "행사 일정과 연계 가능"],
    status: "게시중",
    featured: true,
  },
  {
    id: 3,
    type: "관광상품",
    slug: "goyang-special-tour-zone",
    title: "고양 특별관광지구 연계 시티투어",
    desc: "KINTEX, 호수공원, 상권, 문화시설을 연결한 맞춤형 관광 코스",
    duration: "1일 코스",
    price: 120000,
    people: "10~45명",
    tag: "특별관광지구",
    image:
      "https://www.goyang.go.kr/visitgoyang/DATA/tourRsrc/20221220041123050_qZG1.jpg",
    includes: ["전용 일정표", "현지 안내", "주요 포인트 방문", "기본 운영 스태프"],
    caution: ["입장시설 별도 발생 가능", "교통 옵션 추가 가능", "외국어 운영 별도 협의"],
    status: "게시중",
    featured: false,
  },
  {
    id: 4,
    type: "패키지",
    slug: "goyang-vip-premium",
    title: "고양 VIP 프리미엄 일정",
    desc: "의전, 숙박, 교통, 호수공원, 아람누리, 만찬을 결합한 고급 프로그램",
    duration: "맞춤형",
    price: 280000,
    people: "1~15명",
    tag: "프리미엄",
    image:
      "https://www.goyang.go.kr/visitgoyang/DATA/tourRsrc/20221220041203609_xSEM.jpg",
    includes: ["맞춤 일정 설계", "VIP 응대", "교통/만찬 옵션", "전담 담당자 배정"],
    caution: ["사전 협의 필수", "기관·외빈 일정 우선", "견적형 운영 가능"],
    status: "게시중",
    featured: true,
  },
];

const initialBookings: Booking[] = [
  {
    id: 1,
    bookingNo: "GY-250510-001",
    productId: 2,
    productTitle: "일산호수공원 힐링 반일 코스",
    organization: "국제협력포럼 사무국",
    name: "김담당",
    phone: "010-1111-2222",
    email: "forum@example.com",
    date: "05.12",
    option: "프리미엄형",
    guests: 18,
    totalPrice: 2601000,
    status: "검토중",
    createdAt: "2026-04-06 10:30",
  },
  {
    id: 2,
    bookingNo: "GY-250510-002",
    productId: 1,
    productTitle: "KINTEX 연계 비즈니스 스테이",
    organization: "글로벌바이어단",
    name: "이매니저",
    phone: "010-3333-4444",
    email: "buyer@example.com",
    date: "05.15",
    option: "기본형",
    guests: 8,
    totalPrice: 1440000,
    status: "예약확정",
    createdAt: "2026-04-06 11:10",
  },
];

const initialInquiries: Inquiry[] = [
  {
    id: 1,
    type: "DMC 상담",
    organization: "A국 기관방문단",
    name: "박과장",
    phone: "010-5555-6666",
    email: "park@example.com",
    subject: "KINTEX 연계 방문단 프로그램 문의",
    status: "접수",
    createdAt: "2026-04-06 09:40",
  },
  {
    id: 2,
    type: "협업 제안",
    organization: "로컬콘텐츠랩",
    name: "정대표",
    phone: "010-7777-8888",
    email: "local@example.com",
    subject: "호수공원 야간 프로그램 협업 제안",
    status: "검토중",
    createdAt: "2026-04-06 13:15",
  },
];

const partnerItems: Partner[] = [
  { id: 1, name: "KINTEX 인근 비즈니스 호텔", type: "숙박", status: "활성" },
  { id: 2, name: "호수공원 체험 운영사", type: "체험", status: "활성" },
  { id: 3, name: "고양 로컬 투어 네트워크", type: "관광", status: "협의중" },
  { id: 4, name: "VIP 의전 서비스 파트너", type: "의전", status: "활성" },
];

const bookingDates = ["05.10", "05.11", "05.12", "05.13", "05.14", "05.15", "05.16", "05.17"];

const bookingOptions: BookingOption[] = [
  { label: "기본형", multiplier: 1 },
  { label: "프리미엄형", multiplier: 1.7 },
  { label: "VIP형", multiplier: 3.2 },
];

const adminMenus: AdminMenu[] = [
  { key: "dashboard", label: "대시보드", icon: LayoutDashboard },
  { key: "bookings", label: "예약 관리", icon: ClipboardList },
  { key: "products", label: "상품 관리", icon: Package },
  { key: "inquiries", label: "문의 관리", icon: Mail },
  { key: "content", label: "콘텐츠 관리", icon: FileText },
  { key: "partners", label: "파트너 관리", icon: Users },
  { key: "reports", label: "통계/리포트", icon: BarChart3 },
  { key: "settings", label: "설정", icon: Settings },
];

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function GradientOrb({ className }: { className?: string }) {
  return <div className={cn("absolute rounded-full blur-3xl", className)} />;
}

function SectionTitle({
  eyebrow,
  title,
  desc,
  action,
}: {
  eyebrow: string;
  title: string;
  desc?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <div className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8b6a3e]">{eyebrow}</div>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#0f1a36] lg:text-4xl">{title}</h2>
        {desc ? <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">{desc}</p> : null}
      </div>
      {action ?? null}
    </div>
  );
}

function PremiumCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "rounded-[30px] border border-white/70 bg-white/85 p-7 shadow-[0_18px_60px_rgba(15,26,54,0.08)] backdrop-blur",
        className
      )}
    >
      {children}
    </div>
  );
}

function ImageCard({
  src,
  title,
  subtitle,
  className = "",
}: {
  src: string;
  title: string;
  subtitle?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[30px] border border-white/60 shadow-[0_20px_60px_rgba(15,26,54,0.12)]",
        className
      )}
    >
      <img src={src} alt={title} className="h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0f1a36]/85 via-[#0f1a36]/20 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-6 text-white">
        {subtitle ? (
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-white/80">{subtitle}</div>
        ) : null}
        <div className="mt-2 text-xl font-bold tracking-tight">{title}</div>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: IconComponent;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <PremiumCard className="p-6">
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
        <Icon className="h-4 w-4" />
        {label}
      </div>
      <div className="mt-4 text-3xl font-bold tracking-tight text-[#0f1a36]">{value}</div>
      {sub ? <div className="mt-2 text-sm text-slate-500">{sub}</div> : null}
    </PremiumCard>
  );
}

function Header({
  activePage,
  setActivePage,
  mobileOpen,
  setMobileOpen,
}: {
  activePage: PageKey;
  setActivePage: Dispatch<SetStateAction<PageKey>>;
  mobileOpen: boolean;
  setMobileOpen: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <button onClick={() => setActivePage("home")} className="text-left">
          <div className="text-lg font-bold tracking-tight text-[#0f1a36]">고양 문화관광·MICE 연구소</div>
          <div className="text-sm text-slate-500">부설 고양 DMC센터</div>
        </button>

        <nav className="hidden items-center gap-2 xl:flex">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setActivePage(item.key)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition",
                activePage === item.key
                  ? "bg-[#101b3a] text-white shadow-lg shadow-slate-300/50"
                  : "text-slate-600 hover:bg-slate-100 hover:text-[#101b3a]"
              )}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button className="hidden rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 sm:block">
            KR / EN
          </button>
          <button
            onClick={() => setActivePage("admin")}
            className="hidden rounded-full bg-gradient-to-r from-[#101b3a] to-[#253d79] px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-slate-300/50 sm:block"
          >
            CMS 데모
          </button>
          <button onClick={() => setMobileOpen((prev) => !prev)} className="rounded-full border border-slate-300 p-2 xl:hidden">
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {mobileOpen ? (
        <div className="border-t border-slate-200 bg-white px-4 py-4 xl:hidden">
          <div className="space-y-2">
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => {
                  setActivePage(item.key);
                  setMobileOpen(false);
                }}
                className={cn(
                  "w-full rounded-2xl px-4 py-3 text-left text-sm font-medium",
                  activePage === item.key ? "bg-[#101b3a] text-white" : "bg-slate-50 text-slate-700"
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <div className="text-lg font-bold tracking-tight text-[#0f1a36]">고양 문화관광·MICE 연구소</div>
          <div className="mt-1 text-sm text-slate-500">부설 고양 DMC센터</div>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
            KINTEX, 일산호수공원, 고양 특별관광지구를 연구하고 실현하는 통합 플랫폼
          </p>
        </div>
        <div className="grid gap-2 text-sm text-slate-600">
          <div>주소: 경기도 고양시</div>
          <div>전화: 000-0000-0000</div>
          <div>이메일: info@goyangmice.kr</div>
          <div className="pt-2 text-slate-400">© Goyang Culture, Tourism & MICE Institute. All rights reserved.</div>
        </div>
      </div>
    </footer>
  );
}

function Shell({
  children,
  activePage,
  setActivePage,
  mobileOpen,
  setMobileOpen,
}: {
  children: ReactNode;
  activePage: PageKey;
  setActivePage: Dispatch<SetStateAction<PageKey>>;
  mobileOpen: boolean;
  setMobileOpen: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <div className="min-h-screen bg-[#f7f8fb] text-slate-900">
      <Header activePage={activePage} setActivePage={setActivePage} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      {children}
      <Footer />
    </div>
  );
}

function HomePage({
  setActivePage,
  setSelectedProductId,
  products,
}: {
  setActivePage: Dispatch<SetStateAction<PageKey>>;
  setSelectedProductId: Dispatch<SetStateAction<number>>;
  products: Product[];
}) {
  return (
    <>
      <section className="relative overflow-hidden border-b border-slate-200 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.95),_rgba(240,244,255,0.88)_40%,_rgba(250,243,235,0.92)_75%)]">
        <GradientOrb className="-left-24 top-10 h-72 w-72 bg-[#d7e5ff]/70" />
        <GradientOrb className="right-10 top-20 h-64 w-64 bg-[#f7d4cf]/50" />
        <GradientOrb className="left-1/2 top-56 h-72 w-72 -translate-x-1/2 bg-[#f4e5bf]/35" />
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:py-28">
          <div className="relative z-10 flex flex-col justify-center">
            <div className="mb-5 inline-flex w-fit rounded-full border border-[#d8dfea] bg-white/90 px-4 py-1.5 text-sm text-slate-600 shadow-sm">
              Goyang Culture, Tourism & MICE Institute · Goyang DMC Center
            </div>
            <h1 className="max-w-4xl text-4xl font-bold leading-tight tracking-tight text-[#0f1a36] lg:text-6xl">
              KINTEX와 일산호수공원을 잇는
              <br />
              <span className="bg-gradient-to-r from-[#0f1a36] via-[#3b2d56] to-[#b1584f] bg-clip-text text-transparent">
                고양 문화관광·MICE 플랫폼
              </span>
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
              KINTEX, 일산호수공원, 고양 특별관광지구, 아람누리 등 고양의 핵심 자산을 연구·브랜딩·행사운영·숙박·체험·관광상품 예약까지 연결하는 전략 플랫폼
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button onClick={() => setActivePage("institute")} className="rounded-full bg-gradient-to-r from-[#101b3a] to-[#28488f] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-300/60">
                연구소 소개
              </button>
              <button onClick={() => setActivePage("dmc")} className="rounded-full border border-slate-300 bg-white/90 px-5 py-3 text-sm font-semibold text-slate-700 backdrop-blur">
                DMC 서비스 보기
              </button>
              <button onClick={() => setActivePage("products")} className="rounded-full border border-[#d6c09a] bg-[#fff8ef] px-5 py-3 text-sm font-semibold text-[#8b6a3e]">
                예약 서비스 보기
              </button>
            </div>
          </div>

          <div className="relative z-10 grid gap-4 lg:grid-cols-2">
            <ImageCard src={visualAssets.heroMain} title="KINTEX와 고양 특별관광지구를 하나의 전략으로" subtitle="GOYANG SPECIAL TOURIST ZONE" className="h-[260px] lg:col-span-2" />
            <ImageCard src={visualAssets.heroMeeting} title="KINTEX 중심 국제회의·포럼 운영" subtitle="KINTEX MICE" className="h-[210px]" />
            <ImageCard src={visualAssets.heroTour} title="일산호수공원과 로컬 관광 동선 연계" subtitle="LAKE PARK DMC" className="h-[210px]" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <SectionTitle
          eyebrow="Core Structure"
          title="KINTEX와 일산호수공원을 연결하는 통합형 홈페이지"
          desc="고양 문화관광·MICE 연구소를 본체로 두고, 부설 고양 DMC센터를 실행조직으로 배치해 KINTEX, 일산호수공원, 특별관광지구, 문화예술 자원을 하나의 도시 경험으로 연결합니다."
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {[
            { title: "KINTEX 전략연구", desc: "국내 최대 전시·컨벤션 인프라를 도시 성장전략으로 연결", tone: "from-[#eef4ff] to-white" },
            { title: "호수공원·관광 연계", desc: "일산호수공원과 특별관광지구를 체류형 프로그램으로 연결", tone: "from-[#fff0eb] to-white" },
            { title: "DMC 예약·상품화", desc: "숙박, 체험, 관광상품, VIP 동선을 예약으로 전환", tone: "from-[#fdf7ea] to-white" },
          ].map((item) => (
            <PremiumCard key={item.title} className={cn("bg-gradient-to-br", item.tone)}>
              <div className="text-2xl font-bold tracking-tight text-[#0f1a36]">{item.title}</div>
              <p className="mt-4 text-sm leading-7 text-slate-600">{item.desc}</p>
            </PremiumCard>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden border-y border-slate-200 bg-[#101b3a] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(222,175,97,0.2),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(177,88,79,0.22),transparent_40%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.2em] text-[#e0c287]">Why Goyang</div>
            <h2 className="mt-3 text-3xl font-bold tracking-tight lg:text-4xl">KINTEX와 일산호수공원이 고양의 경쟁력입니다</h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300">
              고양은 KINTEX의 대형 전시·컨벤션 경쟁력과 일산호수공원의 치유형 콘텐츠, 특별관광지구의 복합 상권, 아람누리의 문화예술 자원을 함께 갖춘 도시입니다.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {strengths.map((item) => (
              <div key={item} className="rounded-3xl border border-white/10 bg-white/10 p-6 text-sm leading-7 text-slate-100 backdrop-blur">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <SectionTitle
          eyebrow="Products & Booking"
          title="KINTEX·호수공원·특별관광지구 상품을 바로 연결합니다"
          desc="KINTEX 참가자, 방문단, 관광객이 고양의 핵심 자원을 실제 문의와 예약으로 이어갈 수 있도록 DMC 플랫폼 구조를 반영했습니다."
          action={
            <button onClick={() => setActivePage("products")} className="w-fit rounded-full bg-gradient-to-r from-[#101b3a] to-[#28488f] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-300/60">
              전체 상품 보기
            </button>
          }
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-4">
          {products.slice(0, 4).map((product) => (
            <div key={product.id} className="group rounded-[28px] border border-slate-200 bg-white p-7 shadow-[0_18px_60px_rgba(15,26,54,0.08)] transition hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(15,26,54,0.12)]">
              <div className="flex items-center justify-between">
                <div className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">{product.type}</div>
                <div className="text-xs font-semibold text-[#b1584f]">{product.tag}</div>
              </div>
              <div className="mt-4 overflow-hidden rounded-3xl">
                <img src={product.image} alt={product.title} className="h-28 w-full object-cover transition duration-500 group-hover:scale-105" />
              </div>
              <div className="mt-5 text-xl font-bold tracking-tight text-[#0f1a36]">{product.title}</div>
              <p className="mt-3 text-sm leading-7 text-slate-600">{product.desc}</p>
              <div className="mt-6 flex gap-2">
                <button onClick={() => { setSelectedProductId(product.id); setActivePage("booking"); }} className="rounded-full bg-[#101b3a] px-4 py-2 text-sm font-semibold text-white">
                  예약하기
                </button>
                <button onClick={() => setActivePage("products")} className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">
                  보기
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function InstitutePage() {
  return (
    <div className="mx-auto max-w-7xl space-y-8 px-6 py-16">
      <SectionTitle eyebrow="Institute" title="KINTEX와 고양 관광자원의 미래가치를 연구하고 실현하는 전문기관" desc="정책연구와 DMC 실행기능을 결합해 고양의 문화관광·MICE 경쟁력을 높이는 복합형 플랫폼입니다." />
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <PremiumCard>
          <div className="flex items-center gap-3 text-slate-500">
            <Building2 className="h-5 w-5" />
            <span className="text-sm font-semibold">설립 취지</span>
          </div>
          <p className="mt-5 text-base leading-8 text-slate-600">
            고양 문화관광·MICE 연구소는 KINTEX, 일산호수공원, 특별관광지구, 문화예술 인프라를 전략적으로 연결하여 도시브랜드와 지역경제 성과로 확장하기 위해 설립되었습니다.
          </p>
        </PremiumCard>
        <ImageCard src={visualAssets.institute} title="KINTEX와 호수공원을 도시 전략으로 연결하는 기관" subtitle="Institute Identity" className="min-h-[360px]" />
      </div>
    </div>
  );
}

function ResearchPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-8 px-6 py-16">
      <SectionTitle eyebrow="Research" title="KINTEX·호수공원·특별관광지구의 미래전략을 연구합니다" desc="정책 제안에 그치지 않고 현장 적용과 실행 가능성을 함께 검토하는 것이 연구소의 차별성입니다." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {researchAreas.map((item) => (
          <PremiumCard key={item.title}>
            <div className="text-xl font-bold tracking-tight text-[#0f1a36]">{item.title}</div>
            <p className="mt-4 text-sm leading-7 text-slate-600">{item.desc}</p>
          </PremiumCard>
        ))}
      </div>
    </div>
  );
}

function DmcPage({ setActivePage }: { setActivePage: Dispatch<SetStateAction<PageKey>> }) {
  return (
    <div className="mx-auto max-w-7xl space-y-8 px-6 py-16">
      <SectionTitle
        eyebrow="DMC Services"
        title="KINTEX 행사부터 호수공원 체험까지, 고양형 DMC 서비스를 제공합니다"
        desc="KINTEX 행사 방문 수요와 일산호수공원·특별관광지구 체류 수요를 연결해 기업행사, 국제회의, 인센티브투어, 팸투어, VIP 프로그램을 운영합니다."
        action={
          <button onClick={() => setActivePage("contact")} className="w-fit rounded-full bg-gradient-to-r from-[#101b3a] to-[#28488f] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-300/60">
            DMC 상담 신청
          </button>
        }
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {dmcServices.map((item) => (
          <PremiumCard key={item.title}>
            <div className="text-lg font-bold tracking-tight text-[#0f1a36]">{item.title}</div>
            <p className="mt-4 text-sm leading-7 text-slate-600">{item.desc}</p>
          </PremiumCard>
        ))}
      </div>
    </div>
  );
}

function ProductsPage({
  setActivePage,
  setSelectedProductId,
  products,
}: {
  setActivePage: Dispatch<SetStateAction<PageKey>>;
  setSelectedProductId: Dispatch<SetStateAction<number>>;
  products: Product[];
}) {
  const [filter, setFilter] = useState("전체");
  const [query, setQuery] = useState("");

  const filtered = products.filter((p) => {
    const filterOk = filter === "전체" ? true : p.type === filter;
    const queryOk = query.trim() ? `${p.title} ${p.desc} ${p.tag}`.toLowerCase().includes(query.toLowerCase()) : true;
    return filterOk && queryOk && p.status !== "숨김";
  });

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-6 py-16">
      <SectionTitle eyebrow="Products" title="고양 핵심 관광자원을 예약으로 연결합니다" desc="KINTEX 비즈니스 수요, 일산호수공원 체험 수요, 특별관광지구 관광 수요를 하나의 DMC 상품 구조로 묶은 페이지입니다." />
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-3">
          {["전체", "숙박", "체험", "관광상품", "패키지"].map((item) => (
            <button key={item} onClick={() => setFilter(item)} className={cn("rounded-full px-4 py-2 text-sm font-semibold", filter === item ? "bg-[#101b3a] text-white" : "border border-slate-300 bg-white text-slate-700")}>
              {item}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3 rounded-full border border-slate-300 bg-white px-4 py-3 text-sm text-slate-500 shadow-sm">
          <Search className="h-4 w-4" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="상품명 또는 키워드 검색" className="w-56 bg-transparent outline-none" />
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {filtered.map((product) => (
          <div key={product.id} className="rounded-[28px] border border-slate-200 bg-white p-7 shadow-[0_18px_60px_rgba(15,26,54,0.08)]">
            <div className="flex items-center justify-between">
              <div className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">{product.type}</div>
              <div className="text-xs font-semibold text-[#b1584f]">{product.tag}</div>
            </div>
            <div className="mt-4 overflow-hidden rounded-3xl">
              <img src={product.image} alt={product.title} className="h-28 w-full object-cover" />
            </div>
            <div className="mt-5 text-xl font-bold tracking-tight text-[#0f1a36]">{product.title}</div>
            <p className="mt-3 text-sm leading-7 text-slate-600">{product.desc}</p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500">
              <span className="rounded-full bg-slate-100 px-3 py-1">{product.duration}</span>
              <span className="rounded-full bg-slate-100 px-3 py-1">{product.people}</span>
              <span className="rounded-full bg-slate-100 px-3 py-1">{product.status}</span>
            </div>
            <div className="mt-6 text-lg font-bold text-[#0f1a36]">₩ {product.price.toLocaleString()}~</div>
            <div className="mt-6 flex gap-2">
              <button onClick={() => { setSelectedProductId(product.id); setActivePage("booking"); }} className="rounded-full bg-[#101b3a] px-4 py-2 text-sm font-semibold text-white">
                예약하기
              </button>
              <button onClick={() => { setSelectedProductId(product.id); setActivePage("booking"); }} className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">
                상세보기
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BookingPage({
  selectedProductId,
  setSelectedProductId,
  setActivePage,
  products,
  onSubmitBooking,
}: {
  selectedProductId: number;
  setSelectedProductId: Dispatch<SetStateAction<number>>;
  setActivePage: Dispatch<SetStateAction<PageKey>>;
  products: Product[];
  onSubmitBooking: (booking: Booking) => void;
}) {
  const product = products.find((p) => p.id === selectedProductId) ?? products[0];
  const bookingIdRef = useRef(1000);
  const [selectedDate, setSelectedDate] = useState(bookingDates[2]);
  const [selectedOption, setSelectedOption] = useState(bookingOptions[1]);
  const [guestCount, setGuestCount] = useState(12);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<BookingFormState>({
    organization: "",
    name: "",
    phone: "",
    email: "",
    note: "",
    agree: false,
  });
  const estimatedPrice = Math.round(product.price * selectedOption.multiplier * guestCount);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.email || !form.agree) return;
    const nextId = bookingIdRef.current++;
    onSubmitBooking({
      id: nextId,
      bookingNo: `GY-${String(nextId).padStart(6, "0")}`,
      productId: product.id,
      productTitle: product.title,
      organization: form.organization || "미입력",
      name: form.name,
      phone: form.phone,
      email: form.email,
      date: selectedDate,
      option: selectedOption.label,
      guests: guestCount,
      totalPrice: estimatedPrice,
      status: "접수",
      createdAt: "방금 전",
    });
    setSubmitted(true);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-6 py-16">
      <SectionTitle eyebrow="Booking" title="고양 현지 자원과 연결되는 예약 페이지" desc="KINTEX 참가자, 방문단, 관광객이 고양 현지 프로그램을 한 화면에서 선택하고 예약 접수할 수 있는 구조입니다." />
      <div className="flex flex-wrap gap-3">
        {products.map((item) => (
          <button key={item.id} onClick={() => { setSelectedProductId(item.id); setSubmitted(false); }} className={cn("rounded-full px-4 py-2 text-sm font-semibold", selectedProductId === item.id ? "bg-[#101b3a] text-white" : "border border-slate-300 bg-white text-slate-700")}>
            {item.title}
          </button>
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <PremiumCard>
          <div className="overflow-hidden rounded-[28px] border border-slate-200"><img src={product.image} alt={product.title} className="h-64 w-full object-cover" /></div>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#0f1a36]">{product.title}</h2>
          <p className="mt-5 text-base leading-8 text-slate-600">{product.desc}</p>
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-6">
              <div className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8b6a3e]">날짜 선택</div>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {bookingDates.map((date) => (
                  <button key={date} onClick={() => setSelectedDate(date)} className={cn("rounded-2xl px-3 py-4 text-sm font-semibold", selectedDate === date ? "bg-[#101b3a] text-white" : "border border-slate-200 bg-white text-slate-700")}>{date}</button>
                ))}
              </div>
            </div>
            <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-6">
              <div className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8b6a3e]">옵션 선택</div>
              <div className="mt-4 space-y-3">
                {bookingOptions.map((option) => (
                  <button key={option.label} onClick={() => setSelectedOption(option)} className={cn("flex w-full items-center justify-between rounded-2xl px-4 py-4 text-left", selectedOption.label === option.label ? "bg-[#101b3a] text-white" : "border border-slate-200 bg-white text-slate-700")}>
                    <span className="text-sm font-semibold">{option.label}</span>
                    <span className="text-sm font-bold">x {option.multiplier}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </PremiumCard>

        <div className="rounded-[30px] border border-slate-200 bg-[#111c3d] p-8 text-white shadow-[0_20px_70px_rgba(15,26,54,0.15)]">
          <div className="text-sm font-semibold uppercase tracking-[0.2em] text-[#e0c287]">Booking Summary</div>
          <div className="mt-6 space-y-4">
            <div className="rounded-2xl border border-white/10 bg-white/10 px-5 py-4 text-sm text-slate-100">선택 상품: {product.title}</div>
            <div className="rounded-2xl border border-white/10 bg-white/10 px-5 py-4 text-sm text-slate-100">선택 날짜: {selectedDate}</div>
            <div className="rounded-2xl border border-white/10 bg-white/10 px-5 py-4 text-sm text-slate-100">선택 옵션: {selectedOption.label}</div>
            <div className="rounded-2xl border border-white/10 bg-white/10 px-5 py-4 text-sm text-slate-100">예상 금액: ₩ {estimatedPrice.toLocaleString()}</div>
          </div>
          <div className="mt-6 flex items-center gap-3">
            <button onClick={() => setGuestCount(Math.max(1, guestCount - 1))} className="rounded-full border border-white/20 px-3 py-2 text-sm">-</button>
            <div className="min-w-[48px] text-center text-base font-bold">{guestCount}</div>
            <button onClick={() => setGuestCount(guestCount + 1)} className="rounded-full border border-white/20 px-3 py-2 text-sm">+</button>
          </div>
          {submitted ? (
            <div className="mt-6 rounded-3xl border border-white/10 bg-white/10 p-6">
              <div className="flex items-center gap-3 text-[#e0c287]"><ShieldCheck className="h-5 w-5" /><span className="font-semibold">예약이 접수되었습니다</span></div>
              <button onClick={() => setActivePage("admin")} className="mt-5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#111c3d]">관리자 CMS 보기</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6">
              <div className="space-y-3">
                {[
                  { key: "organization", label: "기관명 / 단체명" },
                  { key: "name", label: "담당자명" },
                  { key: "phone", label: "연락처" },
                  { key: "email", label: "이메일" },
                ].map((field) => (
                  <input key={field.key} value={form[field.key as keyof Omit<BookingFormState, "agree">] as string} onChange={(e) => setForm({ ...form, [field.key]: e.target.value })} placeholder={field.label} className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-4 text-sm text-white placeholder:text-slate-300 outline-none" />
                ))}
                <textarea value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} placeholder="추가 요청사항" rows={4} className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-4 text-sm text-white placeholder:text-slate-300 outline-none" />
                <label className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-4 text-sm text-slate-300">
                  <input type="checkbox" checked={form.agree} onChange={(e) => setForm({ ...form, agree: e.target.checked })} className="mt-1" />
                  <span>개인정보 수집 및 예약 약관에 동의합니다.</span>
                </label>
              </div>
              <button type="submit" className="mt-6 w-full rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#111c3d]">예약 신청하기</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function ContactPage({
  onSubmitInquiry,
  setActivePage,
}: {
  onSubmitInquiry: (inquiry: Inquiry) => void;
  setActivePage: Dispatch<SetStateAction<PageKey>>;
}) {
  const inquiryIdRef = useRef(2000);
  const [form, setForm] = useState<ContactFormState>({
    organization: "",
    name: "",
    phone: "",
    email: "",
    project: "",
    date: "",
    people: "",
    budget: "",
    type: "DMC 상담",
    message: "",
    agree: false,
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.email || !form.agree) return;
    const nextId = inquiryIdRef.current++;
    onSubmitInquiry({
      id: nextId,
      type: form.type,
      organization: form.organization || "미입력",
      name: form.name,
      phone: form.phone,
      email: form.email,
      subject: form.project || form.type,
      status: "접수",
      createdAt: "방금 전",
    });
    setSubmitted(true);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-6 py-16">
      <SectionTitle eyebrow="Contact" title="고양 관광·MICE 협력과 제안을 기다립니다" desc="연구, 행사 운영, KINTEX 연계 프로그램, 일산호수공원 체험, 특별관광지구 관광상품, 협업 제안까지 하나의 통합 창구에서 접수합니다." />
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="relative overflow-hidden rounded-[30px] border border-slate-200 bg-[#111c3d] p-8 text-white shadow-[0_20px_70px_rgba(15,26,54,0.15)]">
          <img src={visualAssets.contact} alt="문의 배경 이미지" className="absolute inset-0 h-full w-full object-cover opacity-25" />
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(17,28,61,0.88),rgba(17,28,61,0.7))]" />
          <div className="relative">
            <div className="flex items-center gap-3 text-[#e0c287]"><Mail className="h-5 w-5" /><span className="text-sm font-semibold">Contact Info</span></div>
            <div className="mt-8 space-y-4 text-sm text-slate-100">
              <div className="flex items-center gap-3"><Phone className="h-4 w-4" /> 000-0000-0000</div>
              <div className="flex items-center gap-3"><Mail className="h-4 w-4" /> info@goyangmice.kr</div>
              <div className="flex items-center gap-3"><MapPinned className="h-4 w-4" /> 경기도 고양시</div>
              <div className="flex items-center gap-3"><Globe2 className="h-4 w-4" /> www.goyangmice.kr</div>
            </div>
          </div>
        </div>
        <PremiumCard>
          {submitted ? (
            <div className="rounded-3xl bg-[#eef4ff] p-8">
              <div className="flex items-center gap-3 text-[#0f1a36]"><CheckCircle2 className="h-5 w-5" /><span className="font-semibold">문의가 접수되었습니다</span></div>
              <button onClick={() => setActivePage("admin")} className="mt-6 rounded-full bg-[#101b3a] px-5 py-3 text-sm font-semibold text-white">관리자 CMS 보기</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  ["organization", "기관명"],
                  ["name", "담당자명"],
                  ["phone", "연락처"],
                  ["email", "이메일"],
                  ["project", "행사/사업명"],
                  ["date", "예정일"],
                  ["people", "예상인원"],
                  ["budget", "예산범위"],
                ].map(([key, label], idx) => (
                  <input key={key} value={form[key as keyof Omit<ContactFormState, "agree">] as string} onChange={(e) => setForm({ ...form, [key]: e.target.value })} placeholder={label} className={cn("rounded-2xl px-4 py-4 text-sm text-slate-700 outline-none", idx % 2 === 0 ? "bg-[#eef4ff]" : "bg-slate-50")} />
                ))}
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="rounded-2xl bg-[#fff2ee] px-4 py-4 text-sm text-slate-700 outline-none md:col-span-2">
                  <option>DMC 상담</option>
                  <option>연구용역 문의</option>
                  <option>KINTEX 연계 프로그램 문의</option>
                  <option>호수공원 체험 문의</option>
                  <option>협업 제안</option>
                </select>
                <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="문의내용 입력" rows={5} className="rounded-2xl bg-slate-50 px-4 py-4 text-sm text-slate-700 outline-none md:col-span-2" />
              </div>
              <label className="mt-6 flex items-start gap-3 rounded-2xl bg-[#fdf7ea] px-4 py-4 text-sm text-slate-600">
                <input type="checkbox" checked={form.agree} onChange={(e) => setForm({ ...form, agree: e.target.checked })} className="mt-1" />
                <span>개인정보 수집 및 이용에 동의합니다.</span>
              </label>
              <button type="submit" className="mt-6 rounded-full bg-gradient-to-r from-[#101b3a] to-[#28488f] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-300/60">문의 접수하기</button>
            </form>
          )}
        </PremiumCard>
      </div>
    </div>
  );
}

function AdminSidebar({ activeTab, setActiveTab }: { activeTab: string; setActiveTab: Dispatch<SetStateAction<string>> }) {
  return (
    <PremiumCard className="p-4">
      <div className="px-3 pb-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">CMS Menu</div>
      <div className="space-y-2">
        {adminMenus.map((item) => {
          const Icon = item.icon;
          return (
            <button key={item.key} onClick={() => setActiveTab(item.key)} className={cn("flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm transition", activeTab === item.key ? "bg-[#101b3a] text-white" : "bg-slate-50 text-slate-700 hover:bg-slate-100")}>
              <span className="flex items-center gap-3"><Icon className="h-4 w-4" />{item.label}</span>
              <ChevronRight className="h-4 w-4 opacity-70" />
            </button>
          );
        })}
      </div>
    </PremiumCard>
  );
}

function AdminPage({
  products,
  setProducts,
  bookings,
  setBookings,
  inquiries,
  setInquiries,
}: {
  products: Product[];
  setProducts: Dispatch<SetStateAction<Product[]>>;
  bookings: Booking[];
  setBookings: Dispatch<SetStateAction<Booking[]>>;
  inquiries: Inquiry[];
  setInquiries: Dispatch<SetStateAction<Inquiry[]>>;
}) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const publishedProducts = products.filter((item) => item.status === "게시중").length;

  const updateBookingStatus = (id: number, status: Booking["status"]) => setBookings((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)));
  const updateInquiryStatus = (id: number, status: Inquiry["status"]) => setInquiries((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)));
  const toggleProductStatus = (id: number) => setProducts((prev) => prev.map((item) => (item.id === id ? { ...item, status: item.status === "게시중" ? "숨김" : "게시중" } : item)));

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <SectionTitle eyebrow="Admin CMS" title="관리자 CMS 실행 데모" desc="예약, 상품, 문의, 콘텐츠를 한 화면 안에서 관리하는 통합 운영 데모입니다." />
      <div className="mt-8 grid gap-6 xl:grid-cols-[280px_1fr]">
        <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-4">
            <StatCard icon={ClipboardList} label="예약 건수" value={`${bookings.length}건`} sub="데모 누적 접수" />
            <StatCard icon={Mail} label="문의 건수" value={`${inquiries.length}건`} sub="처리 대기 포함" />
            <StatCard icon={Package} label="게시 상품" value={`${publishedProducts}개`} sub="현재 노출 기준" />
            <StatCard icon={Users} label="파트너" value={`${partnerItems.length}개사`} sub="제휴 현황" />
          </div>

          {activeTab === "bookings" && (
            <PremiumCard>
              <div className="mt-6 space-y-4">
                {bookings.map((item) => (
                  <div key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="font-semibold text-[#0f1a36]">{item.productTitle}</div>
                    <div className="mt-1 text-sm text-slate-500">{item.bookingNo} · {item.name}</div>
                    <select value={item.status} onChange={(e) => updateBookingStatus(item.id, e.target.value as Booking["status"])} className="mt-3 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none">
                      <option>접수</option><option>검토중</option><option>예약확정</option><option>보류</option><option>취소</option>
                    </select>
                  </div>
                ))}
              </div>
            </PremiumCard>
          )}

          {activeTab === "products" && (
            <PremiumCard>
              <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {products.map((item) => (
                  <div key={item.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                    <img src={item.image} alt={item.title} className="h-28 w-full rounded-2xl object-cover" />
                    <div className="mt-4 text-lg font-bold text-[#0f1a36]">{item.title}</div>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs">
                      <span className="rounded-full bg-white px-3 py-1 text-slate-600">{item.type}</span>
                      <span className="rounded-full bg-white px-3 py-1 text-slate-600">{item.status}</span>
                    </div>
                    <button onClick={() => toggleProductStatus(item.id)} className="mt-4 rounded-full bg-[#101b3a] px-3 py-2 text-xs font-semibold text-white">{item.status === "게시중" ? "숨김" : "게시"}</button>
                  </div>
                ))}
              </div>
            </PremiumCard>
          )}

          {activeTab === "inquiries" && (
            <PremiumCard>
              <div className="mt-6 space-y-4">
                {inquiries.map((item) => (
                  <div key={item.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                    <div className="text-sm font-semibold text-[#8b6a3e]">{item.type}</div>
                    <div className="mt-1 text-lg font-bold text-[#0f1a36]">{item.subject}</div>
                    <div className="mt-2 text-sm text-slate-500">{item.organization} · {item.name}</div>
                    <select value={item.status} onChange={(e) => updateInquiryStatus(item.id, e.target.value as Inquiry["status"])} className="mt-3 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none">
                      <option>접수</option><option>검토중</option><option>회신완료</option><option>완료</option>
                    </select>
                  </div>
                ))}
              </div>
            </PremiumCard>
          )}
        </div>
      </div>
    </div>
  );
}

export default function GoyangMicePlatformRunnableV1() {
  const [activePage, setActivePage] = useState<PageKey>("home");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(2);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [inquiries, setInquiries] = useState<Inquiry[]>(initialInquiries);

  const addBooking = (booking: Booking) => setBookings((prev) => [booking, ...prev]);
  const addInquiry = (inquiry: Inquiry) => setInquiries((prev) => [inquiry, ...prev]);

  const page = useMemo(() => {
    switch (activePage) {
      case "home":
        return <HomePage setActivePage={setActivePage} setSelectedProductId={setSelectedProductId} products={products} />;
      case "institute":
        return <InstitutePage />;
      case "research":
        return <ResearchPage />;
      case "dmc":
        return <DmcPage setActivePage={setActivePage} />;
      case "products":
        return <ProductsPage setActivePage={setActivePage} setSelectedProductId={setSelectedProductId} products={products} />;
      case "booking":
        return <BookingPage selectedProductId={selectedProductId} setSelectedProductId={setSelectedProductId} setActivePage={setActivePage} products={products} onSubmitBooking={addBooking} />;
      case "contact":
        return <ContactPage onSubmitInquiry={addInquiry} setActivePage={setActivePage} />;
      case "admin":
        return <AdminPage products={products} setProducts={setProducts} bookings={bookings} setBookings={setBookings} inquiries={inquiries} setInquiries={setInquiries} />;
      default:
        return <HomePage setActivePage={setActivePage} setSelectedProductId={setSelectedProductId} products={products} />;
    }
  }, [activePage, products, selectedProductId, bookings, inquiries]);

  return <Shell activePage={activePage} setActivePage={setActivePage} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen}>{page}</Shell>;
}
