"use client";

import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";
import { useLocale } from "next-intl";

import { type LocaleKey, navigation, navigationLabels } from "@/data/navigation";
import { Link } from "@/lib/navigation";

const LOCALES: LocaleKey[] = ["ko", "en", "ja", "zh-CN", "zh-TW"];

const policyLinks: Record<LocaleKey, Array<{ label: string; href: string }>> = {
  ko:      [{ label: "개인정보 처리방침", href: "/privacy" }, { label: "이용약관", href: "/terms" }],
  en:      [{ label: "Privacy Policy",   href: "/privacy" }, { label: "Terms of Use", href: "/terms" }],
  ja:      [{ label: "プライバシーポリシー", href: "/privacy" }, { label: "利用規約", href: "/terms" }],
  "zh-CN": [{ label: "隐私政策",         href: "/privacy" }, { label: "使用条款", href: "/terms" }],
  "zh-TW": [{ label: "隱私政策",         href: "/privacy" }, { label: "使用條款", href: "/terms" }],
};

const focusItems: Record<LocaleKey, string[]> = {
  ko: [
    "공연과 전시를 체류형 방문 프로그램으로 연결하는 기획",
    "로컬 체험, 쇼핑, 미식이 이어지는 방문 동선 설계",
    "VIP, 단체, 바이어 방문객을 위한 운영 시나리오 구성",
    "연구 기반 브랜드와 현장 실행을 잇는 프로젝트 기획",
  ],
  en: [
    "Programs that connect performances and exhibitions to longer stays",
    "Visitor journeys that combine local experiences, shopping and dining",
    "Operational scenarios for VIP, group and buyer visits",
    "Projects that connect research, branding and field execution",
  ],
  ja: [
    "公演と展示を滞在型訪問プログラムへとつなぐ企画",
    "ローカル体験・ショッピング・グルメが続く訪問動線の設計",
    "VIP・団体・バイヤー訪問客向けの運営シナリオ構成",
    "研究ベースのブランドと現場実行をつなぐプロジェクト企画",
  ],
  "zh-CN": [
    "将演出与展览连接为滞留型访问项目的策划",
    "涵盖本地体验、购物与美食的访客路线设计",
    "面向VIP、团体及买家访客的运营方案构建",
    "连接研究品牌与现场执行的项目策划",
  ],
  "zh-TW": [
    "將演出與展覽連結為滯留型訪問計畫的策劃",
    "涵蓋在地體驗、購物與美食的訪客路線設計",
    "面向VIP、團體及買家訪客的運營方案構建",
    "連結研究品牌與現場執行的計畫策劃",
  ],
};

type CopyEntry = {
  badge: string;
  title: string;
  desc: string;
  navigate: string;
  focus: string;
  collaborate: string;
  collaborateDesc: string;
  cta: string;
  location: string;
};

// 통신판매업 필수 게재 정보 — 값은 5개 로케일 공통 (한국 사업자 실제 명칭·번호)
const BUSINESS_INFO = {
  companyName: "원새봄 주식회사",
  ceo: "심송학",
  bizRegNo: "287-87-01247",
  ecomRegNo: "제 2021-서울서초-3110 호",
  address: "경기도 고양시 일산동구 호수로 358-25, 동문타워2차 618호",
  phone: "010-8851-1274",
  email: "onesaebom1@gmail.com",
  privacyOfficer: "심송학",
} as const;

type BusinessLabels = {
  sectionTitle: string;
  companyName: string;
  ceo: string;
  bizRegNo: string;
  ecomRegNo: string;
  changePending: string;
  address: string;
  phone: string;
  email: string;
  privacyOfficer: string;
  operatedBy: string;
};

const businessLabels: Record<LocaleKey, BusinessLabels> = {
  ko: {
    sectionTitle: "사업자 정보",
    companyName: "상호",
    ceo: "대표",
    bizRegNo: "사업자등록번호",
    ecomRegNo: "통신판매업 신고번호",
    changePending: "변경신고 예정",
    address: "소재지",
    phone: "대표전화",
    email: "이메일",
    privacyOfficer: "개인정보관리책임자",
    operatedBy: "운영",
  },
  en: {
    sectionTitle: "Business Information",
    companyName: "Company",
    ceo: "CEO",
    bizRegNo: "Business Registration No.",
    ecomRegNo: "E-Commerce Registration No.",
    changePending: "change filing pending",
    address: "Address",
    phone: "Phone",
    email: "Email",
    privacyOfficer: "Privacy Officer",
    operatedBy: "Operated by",
  },
  ja: {
    sectionTitle: "事業者情報",
    companyName: "商号",
    ceo: "代表者",
    bizRegNo: "事業者登録番号",
    ecomRegNo: "通信販売業申告番号",
    changePending: "変更届出予定",
    address: "所在地",
    phone: "代表電話",
    email: "メール",
    privacyOfficer: "個人情報管理責任者",
    operatedBy: "運営",
  },
  "zh-CN": {
    sectionTitle: "商户信息",
    companyName: "公司名称",
    ceo: "法定代表人",
    bizRegNo: "营业执照编号",
    ecomRegNo: "电子商务备案编号",
    changePending: "变更备案待定",
    address: "地址",
    phone: "电话",
    email: "邮箱",
    privacyOfficer: "个人信息管理负责人",
    operatedBy: "运营",
  },
  "zh-TW": {
    sectionTitle: "商戶資訊",
    companyName: "公司名稱",
    ceo: "法定代表人",
    bizRegNo: "營業執照編號",
    ecomRegNo: "電子商務備案編號",
    changePending: "變更備案待定",
    address: "地址",
    phone: "電話",
    email: "郵箱",
    privacyOfficer: "個人資料管理負責人",
    operatedBy: "營運",
  },
};

const copyMap: Record<LocaleKey, CopyEntry> = {
  ko: {
    badge: "고양 MICE 플랫폼",
    title: "고양의 문화, 관광, MICE, 로컬 라이프스타일을 연결하는 도시 플랫폼",
    desc: "연구, 기획, 예약, 운영, 체류 경험을 하나의 DMC 구조로 연결해 고양 방문 경험을 설계합니다.",
    navigate: "바로가기",
    focus: "주요 영역",
    collaborate: "협력 제안",
    collaborateDesc: "행사 운영, 연구 프로젝트, 로컬 프로그램, 제휴 제안까지 필요한 내용을 보내주시면 상황에 맞는 구조로 정리해 드립니다.",
    cta: "제안 보내기",
    location: "경기도 고양시 · 일산 권역 · KINTEX 연계 거점",
  },
  en: {
    badge: "Goyang MICE Platform",
    title: "A city platform connecting culture, tourism, MICE and local lifestyle in Goyang",
    desc: "We connect research, planning, bookings, operations and stay experiences in one DMC structure built for Goyang.",
    navigate: "Navigate",
    focus: "Focus",
    collaborate: "Collaborate",
    collaborateDesc: "Share your event, research, local program or partnership goals and we will help shape the right structure.",
    cta: "Send Proposal",
    location: "Goyang, Gyeonggi-do · Ilsan district · KINTEX linked zone",
  },
  ja: {
    badge: "高陽 MICEプラットフォーム",
    title: "高陽市の文化・観光・MICE・ローカルライフスタイルをつなぐ都市プラットフォーム",
    desc: "研究・企画・予約・運営・滞在体験を一つのDMC構造でつなぎ、高陽訪問体験を設計します。",
    navigate: "ナビゲーション",
    focus: "主要領域",
    collaborate: "連携提案",
    collaborateDesc: "イベント運営・研究プロジェクト・ローカルプログラム・提携提案など、ご要件をお知らせいただければ最適な構造でご提案します。",
    cta: "提案を送る",
    location: "京畿道高陽市 · 一山エリア · KINTEX連携拠点",
  },
  "zh-CN": {
    badge: "高阳 MICE平台",
    title: "连接高阳市文化、旅游、MICE与本地生活方式的城市平台",
    desc: "将研究、策划、预约、运营与滞留体验整合为一个DMC结构，全面设计高阳访客体验。",
    navigate: "快速导航",
    focus: "主要领域",
    collaborate: "合作提案",
    collaborateDesc: "无论是活动运营、研究项目、本地计划还是合作提案，请告知您的需求，我们将为您量身制定最合适的结构。",
    cta: "发送提案",
    location: "京畿道高阳市 · 一山区域 · KINTEX联动据点",
  },
  "zh-TW": {
    badge: "高陽 MICE平台",
    title: "連結高陽市文化、旅遊、MICE與在地生活風格的城市平台",
    desc: "將研究、策劃、預約、運營與滯留體驗整合為一個DMC結構，全面設計高陽訪客體驗。",
    navigate: "快速導覽",
    focus: "主要領域",
    collaborate: "合作提案",
    collaborateDesc: "無論是活動運營、研究計畫、在地項目還是合作提案，請告知您的需求，我們將為您量身制定最合適的結構。",
    cta: "發送提案",
    location: "京畿道高陽市 · 一山區域 · KINTEX聯動據點",
  },
};

export default function Footer() {
  const locale = useLocale();
  const activeLocale: LocaleKey = (LOCALES.includes(locale as LocaleKey) ? locale : "ko") as LocaleKey;
  const copy = copyMap[activeLocale];
  const policies = policyLinks[activeLocale];
  const bLabels = businessLabels[activeLocale];
  const year = new Date().getFullYear();

  return (
    <footer className="px-4 pb-24 pt-10 sm:px-5 lg:px-6 lg:pb-8">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[32px] bg-[linear-gradient(145deg,_#080e1a_0%,_#0d1a30_50%,_#102040_100%)] text-slate-300 shadow-[0_28px_80px_rgba(8,14,26,0.26)]">
        {/* 상단 네온 라인 */}
        <div className="h-[3px] bg-gradient-to-r from-[#8df0cf] via-[#ffe98b] to-[#ffb58f]" />
        {/* 격자 배경 */}
        <div
          className="pointer-events-none absolute inset-0 rounded-[32px] opacity-[0.03]"
          style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)", backgroundSize: "26px 26px" }}
        />
        <div className="grid gap-8 px-5 py-10 sm:px-6 lg:grid-cols-[1.15fr_0.8fr_0.8fr_1fr] lg:px-8">
          <div>
            <div className="inline-flex rounded-full bg-[linear-gradient(135deg,_#8df0cf,_#ffe98b)] px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-slate-950">
              {copy.badge}
            </div>
            <h2 className="mt-4 text-[1.45rem] font-black leading-[1.18] tracking-[-0.04em] text-white sm:text-[1.7rem]">
              {copy.title}
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-400">{copy.desc}</p>
            <div className="mt-6 space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
                <span>{copy.location}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-slate-500" />
                <span>010-8851-1274</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-slate-500" />
                <span>onesaebom1@gmail.com</span>
              </div>
            </div>
          </div>

          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.2em] text-[#fff0b0]">
              {copy.navigate}
            </div>
            <ul className="mt-5 space-y-3">
              {navigation.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-slate-400 transition hover:text-white">
                    {navigationLabels[activeLocale][item.key]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.2em] text-[#fff0b0]">
              {copy.focus}
            </div>
            <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-400">
              {focusItems[activeLocale].map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.2em] text-[#fff0b0]">
              {copy.collaborate}
            </div>
            <p className="mt-5 text-sm leading-7 text-slate-400">{copy.collaborateDesc}</p>
            <Link
              href="/contact"
              className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-full bg-gradient-to-r from-[#ff8f7e] to-[#ffcc8f] px-5 text-sm font-bold text-slate-950 shadow-[0_8px_24px_rgba(255,143,126,0.30)] transition hover:-translate-y-0.5 hover:brightness-105"
            >
              {copy.cta}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* 사업자 정보 블록 — 통신판매업 필수 게재 */}
        <div className="border-t border-white/10 px-5 py-6 text-xs leading-6 text-slate-400 sm:px-6 lg:px-8">
          <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
            {bLabels.sectionTitle}
          </div>
          <dl className="mt-3 grid gap-x-6 gap-y-1.5 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex gap-2">
              <dt className="shrink-0 text-slate-500">{bLabels.companyName}</dt>
              <dd className="text-slate-300">{BUSINESS_INFO.companyName}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="shrink-0 text-slate-500">{bLabels.ceo}</dt>
              <dd className="text-slate-300">{BUSINESS_INFO.ceo}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="shrink-0 text-slate-500">{bLabels.bizRegNo}</dt>
              <dd className="text-slate-300">{BUSINESS_INFO.bizRegNo}</dd>
            </div>
            <div className="flex gap-2 sm:col-span-2 lg:col-span-2">
              <dt className="shrink-0 text-slate-500">{bLabels.ecomRegNo}</dt>
              <dd className="text-slate-300">
                {BUSINESS_INFO.ecomRegNo}
                <span className="ml-1 text-slate-500">({bLabels.changePending})</span>
              </dd>
            </div>
            <div className="flex gap-2 sm:col-span-2 lg:col-span-3">
              <dt className="shrink-0 text-slate-500">{bLabels.address}</dt>
              <dd className="text-slate-300">{BUSINESS_INFO.address}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="shrink-0 text-slate-500">{bLabels.phone}</dt>
              <dd className="text-slate-300">{BUSINESS_INFO.phone}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="shrink-0 text-slate-500">{bLabels.email}</dt>
              <dd className="text-slate-300">{BUSINESS_INFO.email}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="shrink-0 text-slate-500">{bLabels.privacyOfficer}</dt>
              <dd className="text-slate-300">{BUSINESS_INFO.privacyOfficer}</dd>
            </div>
          </dl>
        </div>

        <div className="flex flex-col gap-4 border-t border-white/10 px-5 py-6 text-xs text-slate-500 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div>
            © {year} Goyang MICE Platform. All rights reserved.
            <span className="ml-2 text-slate-600">
              · {bLabels.operatedBy}: {BUSINESS_INFO.companyName}
            </span>
          </div>
          <div className="flex flex-wrap gap-4">
            {policies.map((item) => (
              <Link key={item.href} href={item.href} className="transition hover:text-white">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
