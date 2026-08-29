"use client";

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

type CopyEntry = {
  badge: string;
  title: string;
  desc: string;
  navigate: string;
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

// 법적 면책 문구 — 티켓 예외 명시. 5로케일 각 1문장.
const disclaimers: Record<LocaleKey, string> = {
  ko: "본 플랫폼은 정보 소개 서비스를 제공하며, 티켓(공연·전시)을 제외한 상품의 판매·알선·중개를 하지 않습니다. 티켓 외 카테고리의 실제 계약·거래는 각 사업자와 이용자 간에 직접 성립합니다.",
  en: "This platform provides information and guidance services; it does not sell, broker or intermediate any products other than tickets (performances and exhibitions). For non-ticket categories, any actual contract or transaction is concluded directly between the listed business and the user.",
  ja: "本プラットフォームは情報案内サービスを提供するものであり、チケット（公演・展示）を除く商品の販売・斡旋・仲介は行いません。チケット以外のカテゴリーにおける実際の契約・取引は、表示された各事業者と利用者との間で直接成立します。",
  "zh-CN": "本平台仅提供信息介绍服务，不从事门票（演出·展览）以外商品的销售、中介或代理。门票以外类别的实际合同与交易，由所示各经营者与用户之间直接达成。",
  "zh-TW": "本平台僅提供資訊介紹服務，不從事門票（演出·展覽）以外商品之銷售、仲介或代理。門票以外類別之實際合約與交易，由所示各業者與使用者之間直接成立。",
};

const disclaimerHeadings: Record<LocaleKey, string> = {
  ko: "법적 고지",
  en: "Legal Notice",
  ja: "法的告知",
  "zh-CN": "法律告知",
  "zh-TW": "法律告知",
};

const copyMap: Record<LocaleKey, CopyEntry> = {
  ko: {
    badge: "고양 MICE 플랫폼",
    title: "고양의 문화, 관광, MICE, 로컬 라이프스타일을 연결하는 도시 플랫폼",
    desc: "호수·킨텍스·미식·문화·역사를 한 흐름으로 안내하는 고양 방문 경험 플랫폼.",
    navigate: "바로가기",
  },
  en: {
    badge: "Goyang MICE Platform",
    title: "A city platform connecting culture, tourism, MICE and local lifestyle in Goyang",
    desc: "A guide to Goyang across lakes, KINTEX, food, culture and history — one flow, one platform.",
    navigate: "Navigate",
  },
  ja: {
    badge: "高陽 MICEプラットフォーム",
    title: "高陽市の文化・観光・MICE・ローカルライフスタイルをつなぐ都市プラットフォーム",
    desc: "湖水公園・KINTEX・グルメ・文化・歴史を一つの流れでご案内する高陽訪問体験プラットフォーム。",
    navigate: "ナビゲーション",
  },
  "zh-CN": {
    badge: "高阳 MICE平台",
    title: "连接高阳市文化、旅游、MICE与本地生活方式的城市平台",
    desc: "湖水公园、KINTEX、美食、文化与历史一气连贯——高阳访问体验指南平台。",
    navigate: "快速导航",
  },
  "zh-TW": {
    badge: "高陽 MICE平台",
    title: "連結高陽市文化、旅遊、MICE與在地生活風格的城市平台",
    desc: "湖水公園、KINTEX、美食、文化與歷史一氣連貫——高陽訪問體驗指南平台。",
    navigate: "快速導覽",
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
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[32px] bg-[var(--charcoal)] text-white/70 shadow-[0_28px_80px_rgba(35,35,34,0.35)]">
        {/* 상단 골드 라인 (오더 #R2 브랜드 리프레시) */}
        <div className="h-[3px] bg-[var(--gold)]" />
        {/* 격자 배경 */}
        <div
          className="pointer-events-none absolute inset-0 rounded-[32px] opacity-[0.03]"
          style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)", backgroundSize: "26px 26px" }}
        />
        <div className="grid gap-8 px-5 py-8 sm:px-6 lg:grid-cols-[1.4fr_1fr] lg:px-8">
          <div>
            <div className="inline-flex rounded-full bg-[var(--gold)] px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-[var(--charcoal)]">
              {copy.badge}
            </div>
            <h2 className="mt-4 text-[1.3rem] font-black leading-[1.2] tracking-[-0.04em] text-white sm:text-[1.55rem]">
              {copy.title}
            </h2>
            <p className="mt-3 text-sm leading-6 text-white/60">{copy.desc}</p>
          </div>

          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">
              {copy.navigate}
            </div>
            <ul className="mt-5 space-y-3">
              {navigation.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-white/60 transition hover:text-[var(--gold)]">
                    {navigationLabels[activeLocale][item.key]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 사업자 정보 블록 — 통신판매업 법정 필수 항목 전량 유지, 표기만 축소 (F2 오더) */}
        <div className="border-t border-white/10 px-5 py-4 text-[10px] leading-4 text-white/60 sm:px-6 lg:px-8">
          <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">
            {bLabels.sectionTitle}
          </div>
          <dl className="mt-2 grid gap-x-5 gap-y-1 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex gap-1.5">
              <dt className="shrink-0 text-white/45">{bLabels.companyName}</dt>
              <dd className="text-white/80">{BUSINESS_INFO.companyName}</dd>
            </div>
            <div className="flex gap-1.5">
              <dt className="shrink-0 text-white/45">{bLabels.ceo}</dt>
              <dd className="text-white/80">{BUSINESS_INFO.ceo}</dd>
            </div>
            <div className="flex gap-1.5">
              <dt className="shrink-0 text-white/45">{bLabels.bizRegNo}</dt>
              <dd className="text-white/80">{BUSINESS_INFO.bizRegNo}</dd>
            </div>
            <div className="flex gap-1.5 sm:col-span-2 lg:col-span-2">
              <dt className="shrink-0 text-white/45">{bLabels.ecomRegNo}</dt>
              <dd className="text-white/80">
                {BUSINESS_INFO.ecomRegNo}
                <span className="ml-1 text-white/45">({bLabels.changePending})</span>
              </dd>
            </div>
            <div className="flex gap-1.5 sm:col-span-2 lg:col-span-3">
              <dt className="shrink-0 text-white/45">{bLabels.address}</dt>
              <dd className="text-white/80">{BUSINESS_INFO.address}</dd>
            </div>
            <div className="flex gap-1.5">
              <dt className="shrink-0 text-white/45">{bLabels.phone}</dt>
              <dd className="text-white/80">{BUSINESS_INFO.phone}</dd>
            </div>
            <div className="flex gap-1.5">
              <dt className="shrink-0 text-white/45">{bLabels.email}</dt>
              <dd className="text-white/80">{BUSINESS_INFO.email}</dd>
            </div>
            <div className="flex gap-1.5">
              <dt className="shrink-0 text-white/45">{bLabels.privacyOfficer}</dt>
              <dd className="text-white/80">{BUSINESS_INFO.privacyOfficer}</dd>
            </div>
          </dl>
        </div>

        {/* 법적 면책 문구 — 티켓 예외 명시 (F2 압축: 2문장 → 1문장) */}
        <div className="border-t border-white/10 px-5 py-4 text-[11px] leading-5 text-white/60 sm:px-6 lg:px-8">
          <span className="mr-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">
            {disclaimerHeadings[activeLocale]}
          </span>
          <span className="text-white/60">{disclaimers[activeLocale]}</span>
        </div>

        <div className="flex flex-col gap-4 border-t border-white/10 px-5 py-6 text-xs text-white/50 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div>
            © {year} Goyang MICE Platform. All rights reserved.
            <span className="ml-2 text-white/40">
              · {bLabels.operatedBy}: {BUSINESS_INFO.companyName}
            </span>
          </div>
          <div className="flex flex-wrap gap-4">
            {policies.map((item) => (
              <Link key={item.href} href={item.href} className="transition hover:text-[var(--gold)]">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
