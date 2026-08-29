"use client";

import { MapPin } from "lucide-react";
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

// 법적 면책 문구 — 관광진흥법·의료법상 여행업·외국인환자 유치업 미해당 고지
// 소개형 카테고리(숙박·음식·카페·투어·의료)에 대한 비판매·비알선·비유치 명시
const disclaimers: Record<LocaleKey, readonly [string, string]> = {
  ko: [
    "본 플랫폼은 관광정보 제공 및 연구·기획 서비스를 제공하며, 여행상품의 판매·알선 및 외국인환자 유치행위를 하지 않습니다.",
    "티켓 외 카테고리(숙박·음식·카페·투어·의료 등)의 정보는 안내 목적이며, 실제 계약·거래는 표시된 각 사업자와 이용자 간에 직접 성립합니다.",
  ],
  en: [
    "This platform provides tourism information and research and planning services only. It does not sell or broker travel products, nor engage in the recruitment of foreign patients.",
    "Information on non-ticket categories (accommodation, dining, cafés, tours, medical, etc.) is provided for guidance only; any actual contract or transaction is concluded directly between the listed business and the user.",
  ],
  ja: [
    "本プラットフォームは観光情報の提供および研究・企画サービスを提供するものであり、旅行商品の販売・斡旋および外国人患者の誘致行為は行いません。",
    "チケット以外のカテゴリー（宿泊・飲食・カフェ・ツアー・医療等）の情報は案内を目的とし、実際の契約・取引は表示された各事業者と利用者との間で直接成立します。",
  ],
  "zh-CN": [
    "本平台仅提供旅游信息及研究、策划服务，不从事旅游产品的销售、中介及外国患者招揽行为。",
    "门票以外类别（住宿、餐饮、咖啡、旅游、医疗等）的信息仅供参考，实际合同、交易由所示各经营者与用户直接达成。",
  ],
  "zh-TW": [
    "本平台僅提供觀光資訊及研究、企劃服務，不從事旅遊商品之銷售、仲介及外國病患招攬行為。",
    "門票以外類別（住宿、餐飲、咖啡、旅遊、醫療等）之資訊僅供參考，實際合約、交易由所示各業者與使用者直接成立。",
  ],
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
    location: "경기도 고양시 · 일산 권역 · KINTEX 연계 거점",
  },
  en: {
    badge: "Goyang MICE Platform",
    title: "A city platform connecting culture, tourism, MICE and local lifestyle in Goyang",
    desc: "A guide to Goyang across lakes, KINTEX, food, culture and history — one flow, one platform.",
    navigate: "Navigate",
    location: "Goyang, Gyeonggi-do · Ilsan district · KINTEX linked zone",
  },
  ja: {
    badge: "高陽 MICEプラットフォーム",
    title: "高陽市の文化・観光・MICE・ローカルライフスタイルをつなぐ都市プラットフォーム",
    desc: "湖水公園・KINTEX・グルメ・文化・歴史を一つの流れでご案内する高陽訪問体験プラットフォーム。",
    navigate: "ナビゲーション",
    location: "京畿道高陽市 · 一山エリア · KINTEX連携拠点",
  },
  "zh-CN": {
    badge: "高阳 MICE平台",
    title: "连接高阳市文化、旅游、MICE与本地生活方式的城市平台",
    desc: "湖水公园、KINTEX、美食、文化与历史一气连贯——高阳访问体验指南平台。",
    navigate: "快速导航",
    location: "京畿道高阳市 · 一山区域 · KINTEX联动据点",
  },
  "zh-TW": {
    badge: "高陽 MICE平台",
    title: "連結高陽市文化、旅遊、MICE與在地生活風格的城市平台",
    desc: "湖水公園、KINTEX、美食、文化與歷史一氣連貫——高陽訪問體驗指南平台。",
    navigate: "快速導覽",
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
        <div className="grid gap-8 px-5 py-8 sm:px-6 lg:grid-cols-[1.4fr_1fr] lg:px-8">
          <div>
            <div className="inline-flex rounded-full bg-[linear-gradient(135deg,_#8df0cf,_#ffe98b)] px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-slate-950">
              {copy.badge}
            </div>
            <h2 className="mt-4 text-[1.3rem] font-black leading-[1.2] tracking-[-0.04em] text-white sm:text-[1.55rem]">
              {copy.title}
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-400">{copy.desc}</p>
            <div className="mt-5 flex items-start gap-3 text-sm">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
              <span>{copy.location}</span>
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

        {/* 법적 면책 문구 — 여행업·외국인환자 유치업 미해당 고지 */}
        <div className="border-t border-white/10 px-5 py-6 text-xs leading-6 text-slate-400 sm:px-6 lg:px-8">
          <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
            {disclaimerHeadings[activeLocale]}
          </div>
          <div className="mt-3 space-y-2">
            {disclaimers[activeLocale].map((sentence, i) => (
              <p key={i} className="text-slate-400">
                {sentence}
              </p>
            ))}
          </div>
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
