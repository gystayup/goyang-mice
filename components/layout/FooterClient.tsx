// components/layout/FooterClient.tsx — 오더 #C58 [5] · #C60 admin DB 이관.
//
// 원본 Footer.tsx UI 로직 이관. server wrapper (Footer.tsx) 가 readSiteCopy()
// 로 사업자 정보·disclaimer 를 client 에 props 전달.

"use client";

import { useLocale } from "next-intl";

import { type LocaleKey } from "@/data/navigation";
import { Link } from "@/lib/navigation";
import type { EmblemCategory } from "@/components/emblem/colors";
import { CATEGORY_LABEL, CURATED_CATEGORIES } from "@/data/curated-categories";
import type {
  BestCategoryKey,
  I18n,
  SiteCopy,
} from "@/data/site-copy-defaults";

const LOCALES: LocaleKey[] = ["ko", "en", "ja", "zh-CN", "zh-TW"];

type BusinessInfo = SiteCopy["footer"];

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
  disclaimer: string;
  disclaimerHeading: string;
  privacy: string;
  terms: string;
  // 오더 #C58 [5] 링크 3열 라벨
  columnBest: string;
  columnPrep: string;
  columnDmc: string;
  linkDayTrips: string;
  linkTransit: string;
  linkTickets: string;
  linkInstitute: string;
  linkContact: string;
  brandTag: string;
};

const L: Record<LocaleKey, BusinessLabels> = {
  ko: {
    sectionTitle: "사업자 정보",
    companyName: "상호", ceo: "대표", bizRegNo: "사업자등록번호", ecomRegNo: "통신판매업 신고번호",
    changePending: "변경신고 예정",
    address: "소재지", phone: "대표전화", email: "이메일", privacyOfficer: "개인정보관리책임자",
    operatedBy: "운영",
    disclaimer: "본 플랫폼은 정보 소개 서비스를 제공하며, 티켓(공연·전시)을 제외한 상품의 판매·알선·중개를 하지 않습니다. 티켓 외 카테고리의 실제 계약·거래는 각 사업자와 이용자 간에 직접 성립합니다.",
    disclaimerHeading: "법적 고지",
    privacy: "개인정보 처리방침", terms: "이용약관",
    columnBest: "고양 BEST", columnPrep: "여행 준비", columnDmc: "고양 DMC",
    linkDayTrips: "당일코스", linkTransit: "교통 안내",
    linkTickets: "티켓 · 공연", linkInstitute: "연구소 소개", linkContact: "문의하기",
    brandTag: "고양·일산 방문 가이드",
  },
  en: {
    sectionTitle: "Business Information",
    companyName: "Company", ceo: "CEO", bizRegNo: "Business Registration No.", ecomRegNo: "E-Commerce Registration No.",
    changePending: "change filing pending",
    address: "Address", phone: "Phone", email: "Email", privacyOfficer: "Privacy Officer",
    operatedBy: "Operated by",
    disclaimer: "This platform provides information and guidance services; it does not sell, broker or intermediate any products other than tickets (performances and exhibitions). For non-ticket categories, any actual contract or transaction is concluded directly between the listed business and the user.",
    disclaimerHeading: "Legal Notice",
    privacy: "Privacy Policy", terms: "Terms of Use",
    columnBest: "GOYANG BEST", columnPrep: "Trip Prep", columnDmc: "GOYANG DMC",
    linkDayTrips: "Day Trips", linkTransit: "Transit Guide",
    linkTickets: "Tickets · Shows", linkInstitute: "About the Institute", linkContact: "Contact",
    brandTag: "Guide to Goyang · Ilsan",
  },
  ja: {
    sectionTitle: "事業者情報",
    companyName: "商号", ceo: "代表者", bizRegNo: "事業者登録番号", ecomRegNo: "通信販売業申告番号",
    changePending: "変更届出予定",
    address: "所在地", phone: "代表電話", email: "メール", privacyOfficer: "個人情報管理責任者",
    operatedBy: "運営",
    disclaimer: "本プラットフォームは情報案内サービスを提供するものであり、チケット（公演・展示）を除く商品の販売・斡旋・仲介は行いません。チケット以外のカテゴリーにおける実際の契約・取引は、表示された各事業者と利用者との間で直接成立します。",
    disclaimerHeading: "法的告知",
    privacy: "プライバシーポリシー", terms: "利用規約",
    columnBest: "GOYANG BEST", columnPrep: "旅行準備", columnDmc: "GOYANG DMC",
    linkDayTrips: "日帰り旅行", linkTransit: "交通案内",
    linkTickets: "チケット・公演", linkInstitute: "研究所紹介", linkContact: "お問い合わせ",
    brandTag: "高陽・一山の訪問ガイド",
  },
  "zh-CN": {
    sectionTitle: "商户信息",
    companyName: "公司名称", ceo: "法定代表人", bizRegNo: "营业执照编号", ecomRegNo: "电子商务备案编号",
    changePending: "变更备案待定",
    address: "地址", phone: "电话", email: "邮箱", privacyOfficer: "个人信息管理负责人",
    operatedBy: "运营",
    disclaimer: "本平台仅提供信息介绍服务，不从事门票（演出·展览）以外商品的销售、中介或代理。门票以外类别的实际合同与交易，由所示各经营者与用户之间直接达成。",
    disclaimerHeading: "法律告知",
    privacy: "隐私政策", terms: "使用条款",
    columnBest: "高阳 BEST", columnPrep: "旅行准备", columnDmc: "高阳 DMC",
    linkDayTrips: "一日游", linkTransit: "交通指南",
    linkTickets: "门票·演出", linkInstitute: "研究所介绍", linkContact: "咨询",
    brandTag: "高阳·一山访问指南",
  },
  "zh-TW": {
    sectionTitle: "商戶資訊",
    companyName: "公司名稱", ceo: "法定代表人", bizRegNo: "營業執照編號", ecomRegNo: "電子商務備案編號",
    changePending: "變更備案待定",
    address: "地址", phone: "電話", email: "郵箱", privacyOfficer: "個人資料管理負責人",
    operatedBy: "營運",
    disclaimer: "本平台僅提供資訊介紹服務，不從事門票（演出·展覽）以外商品之銷售、仲介或代理。門票以外類別之實際合約與交易，由所示各業者與使用者之間直接成立。",
    disclaimerHeading: "法律告知",
    privacy: "隱私政策", terms: "使用條款",
    columnBest: "高陽 BEST", columnPrep: "旅行準備", columnDmc: "高陽 DMC",
    linkDayTrips: "一日遊", linkTransit: "交通指南",
    linkTickets: "門票·演出", linkInstitute: "研究所介紹", linkContact: "諮詢",
    brandTag: "高陽·一山訪問指南",
  },
};

function pickI18n(i18n: I18n, loc: LocaleKey): string {
  return i18n[loc] ?? i18n.ko ?? "";
}

interface Props {
  business: BusinessInfo;
  bestLabelOverride?: Partial<Record<BestCategoryKey, I18n>>;
}

export default function FooterClient({ business, bestLabelOverride }: Props) {
  const locale = useLocale();
  const activeLocale: LocaleKey = (LOCALES.includes(locale as LocaleKey) ? locale : "ko") as LocaleKey;
  const t = L[activeLocale];
  const year = new Date().getFullYear();

  // 오더 #C60: disclaimer · disclaimerHeading 은 DB (business) 우선 · 없으면 t 폴백.
  const disclaimer = pickI18n(business.disclaimer, activeLocale) || t.disclaimer;
  const disclaimerHeading = pickI18n(business.disclaimerHeading, activeLocale) || t.disclaimerHeading;

  return (
    <footer className="pb-24 lg:pb-0">
      {/* ─── ② 링크 3열 · 아이보리 #faf7f2 ─── */}
      <section className="bg-[#faf7f2] text-[#232322]">
        <div className="mx-auto max-w-7xl px-5 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
          {/* 브랜드 라인 */}
          <div className="mb-8 flex items-center gap-3">
            <span className="text-lg font-black tracking-[-0.02em] text-[var(--accent)] sm:text-xl">GOYANG DMC</span>
            <span aria-hidden="true" className="h-4 w-px bg-slate-300" />
            <span className="text-sm text-slate-600">{t.brandTag}</span>
          </div>

          {/* 데스크탑 3열 · 모바일 아코디언 */}
          <div className="hidden gap-8 lg:grid lg:grid-cols-3 lg:gap-12">
            <FooterColumn title={t.columnBest} activeLocale={activeLocale} kind="best" bestLabelOverride={bestLabelOverride} />
            <FooterColumn title={t.columnPrep} activeLocale={activeLocale} kind="prep" labels={t} />
            <FooterColumn title={t.columnDmc}  activeLocale={activeLocale} kind="dmc"  labels={t} />
          </div>
          <div className="grid gap-2 lg:hidden">
            <FooterAccordion title={t.columnBest} activeLocale={activeLocale} kind="best" bestLabelOverride={bestLabelOverride} />
            <FooterAccordion title={t.columnPrep} activeLocale={activeLocale} kind="prep" labels={t} />
            <FooterAccordion title={t.columnDmc}  activeLocale={activeLocale} kind="dmc"  labels={t} />
          </div>
        </div>
      </section>

      {/* ─── ③ 법적 고지 · 차콜 var(--charcoal) · 흰 텍스트 ─── */}
      <section className="bg-[var(--charcoal)] text-white/80">
        <div className="mx-auto max-w-7xl px-5 py-8 sm:px-6 lg:px-8">

          {/* 데스크탑: 사업자 정보 항상 노출 */}
          <div className="hidden lg:block">
            <BusinessInfoBlock labels={t} business={business} disclaimer={disclaimer} disclaimerHeading={disclaimerHeading} />
          </div>

          {/* 모바일: 아코디언 (접힘 기본) */}
          <details className="lg:hidden">
            <summary className="flex cursor-pointer list-none items-center justify-between rounded border border-white/10 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">
              <span>{t.sectionTitle}</span>
              <span aria-hidden="true" className="text-white/60">▾</span>
            </summary>
            <div className="mt-3">
              <BusinessInfoBlock labels={t} business={business} disclaimer={disclaimer} disclaimerHeading={disclaimerHeading} />
            </div>
          </details>

          {/* 항상 노출: 정책 링크 + 카피라이트 */}
          <div className="mt-6 flex flex-col items-start gap-3 border-t border-white/10 pt-5 text-[11px] text-white/60 md:flex-row md:items-center md:justify-between lg:mt-8">
            <div>
              © {year} Goyang MICE Platform. All rights reserved.
              <span className="ml-2 text-white/40">· {t.operatedBy}: {business.companyName}</span>
            </div>
            <div className="flex flex-wrap gap-5">
              <Link href="/privacy" className="transition hover:text-[var(--accent)]">{t.privacy}</Link>
              <Link href="/terms" className="transition hover:text-[var(--accent)]">{t.terms}</Link>
            </div>
          </div>
        </div>
      </section>
    </footer>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex gap-1.5">
      <dt className="shrink-0 text-white/50">{k}</dt>
      <dd className="text-white/90">{v}</dd>
    </div>
  );
}

function BusinessInfoBlock({
  labels: t,
  business,
  disclaimer,
  disclaimerHeading,
}: {
  labels: BusinessLabels;
  business: BusinessInfo;
  disclaimer: string;
  disclaimerHeading: string;
}) {
  return (
    <>
      <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/50">
        {t.sectionTitle}
      </div>
      <dl className="mt-2 grid gap-x-6 gap-y-1 text-[11px] leading-5 sm:grid-cols-2 lg:grid-cols-3">
        <Row k={t.companyName} v={business.companyName} />
        <Row k={t.ceo} v={business.ceo} />
        <Row k={t.bizRegNo} v={business.bizRegNo} />
        <div className="flex gap-1.5 sm:col-span-2 lg:col-span-2">
          <dt className="shrink-0 text-white/50">{t.ecomRegNo}</dt>
          <dd className="text-white/90">
            {business.ecomRegNo}
            <span className="ml-1 text-white/50">({t.changePending})</span>
          </dd>
        </div>
        <div className="flex gap-1.5 sm:col-span-2 lg:col-span-3">
          <dt className="shrink-0 text-white/50">{t.address}</dt>
          <dd className="text-white/90">{business.address}</dd>
        </div>
        <Row k={t.phone} v={business.phone} />
        <Row k={t.email} v={business.email} />
        <Row k={t.privacyOfficer} v={business.privacyOfficer} />
      </dl>
      <p className="mt-4 text-[11px] leading-5 text-white/70">
        <span className="mr-2 font-semibold text-white/50">{disclaimerHeading}</span>
        {disclaimer}
      </p>
    </>
  );
}

// ─── 링크 3열 구현 (데스크탑) ─────────────────────────────────────────────
type ColumnKind = "best" | "prep" | "dmc";

function FooterColumn({
  title,
  activeLocale,
  kind,
  labels,
  bestLabelOverride,
}: {
  title: string;
  activeLocale: LocaleKey;
  kind: ColumnKind;
  labels?: BusinessLabels;
  bestLabelOverride?: Partial<Record<BestCategoryKey, I18n>>;
}) {
  return (
    <div>
      <h3 className="text-sm font-black uppercase tracking-[0.14em] text-[#232322]">{title}</h3>
      <div aria-hidden="true" className="mt-2 h-px w-10 bg-[var(--accent)]" />
      <ul className="mt-4 space-y-2 text-sm text-slate-700">
        {renderColumnLinks(kind, activeLocale, labels, bestLabelOverride)}
      </ul>
    </div>
  );
}

// ─── 모바일 아코디언 ───────────────────────────────────────────────────
function FooterAccordion({
  title,
  activeLocale,
  kind,
  labels,
  bestLabelOverride,
}: {
  title: string;
  activeLocale: LocaleKey;
  kind: ColumnKind;
  labels?: BusinessLabels;
  bestLabelOverride?: Partial<Record<BestCategoryKey, I18n>>;
}) {
  return (
    <details className="rounded-lg border border-slate-200 bg-white/60">
      <summary className="flex cursor-pointer items-center justify-between px-4 py-3 text-sm font-black uppercase tracking-[0.14em] text-[#232322]">
        <span>{title}</span>
        <span aria-hidden="true" className="text-[var(--accent)]">▾</span>
      </summary>
      <ul className="space-y-2 px-4 pb-4 text-sm text-slate-700">
        {renderColumnLinks(kind, activeLocale, labels, bestLabelOverride)}
      </ul>
    </details>
  );
}

function renderColumnLinks(
  kind: ColumnKind,
  locale: LocaleKey,
  labels?: BusinessLabels,
  bestLabelOverride?: Partial<Record<BestCategoryKey, I18n>>
) {
  if (kind === "best") {
    return CURATED_CATEGORIES.map((cat: EmblemCategory) => {
      // 오더 #C60: DB 값 우선 · 없으면 코드 CATEGORY_LABEL 폴백.
      const dbLabel = bestLabelOverride?.[cat as BestCategoryKey]?.[locale];
      const label = dbLabel ?? CATEGORY_LABEL[locale][cat];
      return (
        <li key={cat}>
          <Link
            href={`/best/${cat}`}
            className="inline-flex transition hover:text-[var(--accent)]"
          >
            {label}
          </Link>
        </li>
      );
    });
  }
  if (kind === "prep") {
    // FAQ 페이지 미존재 → 그 줄 생략 (오더 규범).
    return (
      <>
        <li>
          <Link href="/products" className="inline-flex transition hover:text-[var(--accent)]">
            {labels!.linkDayTrips}
          </Link>
        </li>
        <li>
          <Link href="/dmc/move" className="inline-flex transition hover:text-[var(--accent)]">
            {labels!.linkTransit}
          </Link>
        </li>
      </>
    );
  }
  // dmc
  return (
    <>
      <li>
        <Link href="/dmc" className="inline-flex transition hover:text-[var(--accent)]">
          {labels!.linkTickets}
        </Link>
      </li>
      <li>
        <Link href="/institute" className="inline-flex transition hover:text-[var(--accent)]">
          {labels!.linkInstitute}
        </Link>
      </li>
      <li>
        <Link href="/contact" className="inline-flex transition hover:text-[var(--accent)]">
          {labels!.linkContact}
        </Link>
      </li>
    </>
  );
}
