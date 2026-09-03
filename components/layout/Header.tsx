// Header — 오더 #C27 Visit London 식 상단 완전 재편.
//
// 진화:
//   #R2  — 검은 pill + 골드 언더라인
//   #C25 — 흰 배경 pill + accent 언더라인
//   #C27 — 라운드 박스 제거 · 얇은 구분선만 · 상단 유틸바 (좌: 언어·통화, 우: 로그인)
//          · 로고 상단 중앙 · 메인 네비 로고 아래 중앙 · BEST 서브줄 박스 없이
//
// 구조 (데스크탑 lg+):
//   ┌──────────────────────────────────────────────────────────────────┐
//   │ [Utility bar] KO EN JP 简 繁 | ₩ KRW              [HeaderUserMenu]│  ← 얇은 슬레이트 · h-9
//   ├──────────────────────────────────────────────────────────────────┤
//   │                        · GOYANG DMC                              │  ← 로고 중앙 · py-5
//   ├──────────────────────────────────────────────────────────────────┤
//   │              DMC   COURSES   BEST   RESEARCH  ...                │  ← 메인 네비 중앙 · 활성 accent 하단 언더라인
//   ├──────────────────────────────────────────────────────────────────┤
//   │       BEST · 산책 · 미식 · 문화 · K-컬처 · 왕릉 · 가족 · 쇼핑 · 스테이 · 밤 │  ← BEST 서브줄 · 박스 없이 · 얇은 top border
//   └──────────────────────────────────────────────────────────────────┘
//
// 구조 (모바일 lg-):
//   [햄버거]         [GOYANG DMC 로고]         [User · Lang]
//   (메뉴 오픈 시 드로어 · 언어 스위처는 우측 드롭다운)
//
// 무접촉: navigation 항목 · navigationLabels · CATEGORY_LABEL · CURATED_CATEGORIES.

"use client";

import { Menu, X } from "lucide-react";
import { useLocale } from "next-intl";
import { useState } from "react";

import { type LocaleKey, navigation, navigationLabels, type NavigationKey } from "@/data/navigation";
import { Link, usePathname } from "@/lib/navigation";
import HeaderUserMenu from "@/components/layout/HeaderUserMenu";
import {
  CATEGORY_LABEL,
  CURATED_CATEGORIES,
} from "@/data/curated-categories";

type HeaderCopy = {
  menuLabel: string;
  closeLabel: string;
};

const copyMap: Record<LocaleKey, HeaderCopy> = {
  ko: { menuLabel: "메뉴 열기", closeLabel: "메뉴 닫기" },
  en: { menuLabel: "Open menu", closeLabel: "Close menu" },
  ja: { menuLabel: "メニューを開く", closeLabel: "メニューを閉じる" },
  "zh-CN": { menuLabel: "打开菜单", closeLabel: "关闭菜单" },
  "zh-TW": { menuLabel: "開啟選單", closeLabel: "關閉選單" },
};

// 언어 버튼 목록.
const localeButtons: { locale: LocaleKey; label: string }[] = [
  { locale: "ko", label: "KO" },
  { locale: "en", label: "EN" },
  { locale: "ja", label: "JP" },
  { locale: "zh-CN", label: "简" },
  { locale: "zh-TW", label: "繁" },
];

/** 네비 항목별 위계 톤 (오더 #R2 · #P1 로 best 추가 · #C25/C27 로 흰 배경 · accent 언더라인). */
function navTone(key: NavigationKey): "visitor" | "action" | "institutional" {
  if (key === "best" || key === "products" || key === "dmc") return "visitor";
  if (key === "contact") return "action";
  return "institutional"; // institute, research
}

/**
 * 로고 텍스트 — 5로케일 공통 영문.
 * 오더 #C28 [1]: 워드마크 크기 상향.
 * 오더 #C29:
 *   [1] "GOYANG DMC" 전체 accent 코럴 (Visit London VISIT LONDON 빨강)
 *   [2] 앞 dot(●) 제거 — 워드마크만
 *   · lg (데스크탑 상단 중앙): text-2xl (24px) → sm:text-3xl (30px)
 *   · md/sm (모바일): 상단바 높이에 맞춤
 */
function BrandLogo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClass =
    size === "lg"
      ? "text-2xl tracking-[0.18em] sm:text-3xl"
      : size === "md"
        ? "text-[13px] tracking-[0.28em]"
        : "text-[12px] tracking-[0.24em]";
  return (
    <span className={`inline-flex items-center font-black uppercase leading-none text-[var(--accent)] ${sizeClass}`}>
      GOYANG DMC
    </span>
  );
}

export default function Header() {
  const pathname = usePathname();
  const locale = useLocale();
  const activeLocale: LocaleKey = (["ko", "en", "ja", "zh-CN", "zh-TW"].includes(locale) ? locale : "ko") as LocaleKey;
  const copy = copyMap[activeLocale];
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  // 오더 #C32: BEST 하위 9카테고리 서브줄은 홈(/) 및 /best·/best/{cat} 에서만 노출.
  //   상세·/dmc·/products·/institute·/research·/news 등 기타 페이지에서는 숨김 (헤더 슬림화).
  //   상세 spacer(--header-h) 는 서브줄 없는 슬림 헤더 기준으로 CSS 변수 설정됨.
  const showBestSubRow = pathname === "/" || pathname === "/best" || pathname.startsWith("/best/");

  return (
    <header className="sticky top-0 z-50 border-b-[3px] border-[var(--accent)] bg-white">
      {/* ── [Desktop] 상단 유틸바 · 좌: 언어 + 통화 · 우: 로그인 CTA ── */}
      {/* 오더 #C32: 슬림화 — h-9 → h-8. */}
      <div className="hidden border-b border-slate-100 bg-white lg:block">
        <div className="mx-auto flex h-8 max-w-7xl items-center justify-between px-6">
          {/* 좌측: 언어 5개 + | + 통화 (모양만) */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-0.5">
              {localeButtons.map(({ locale: loc, label }) => (
                <Link
                  key={loc}
                  href={pathname}
                  locale={loc}
                  aria-current={activeLocale === loc ? "true" : undefined}
                  className={`inline-flex h-6 min-w-6 items-center justify-center px-1.5 text-[11px] font-bold transition ${
                    activeLocale === loc
                      ? "text-[var(--accent)]"
                      : "text-slate-500 hover:text-[var(--charcoal)]"
                  }`}
                >
                  {label}
                </Link>
              ))}
            </div>
            <span aria-hidden="true" className="inline-block h-3.5 w-px bg-slate-200" />
            {/* 통화 — 오더 #C27 "모양만" (버튼/드롭다운 아님) */}
            <span
              aria-label="Currency KRW"
              className="text-[11px] font-bold tracking-[0.08em] text-slate-500"
            >
              ₩ KRW
            </span>
          </div>
          {/* 우측: 로그인 / 사용자 메뉴 */}
          <div className="flex items-center">
            <HeaderUserMenu locale={activeLocale} />
          </div>
        </div>
      </div>

      {/* ── [Desktop] 브랜드 로우 · 로고 상단 중앙 ── */}
      {/* 오더 #C32: 슬림화 — py-5 → py-3. */}
      <div className="hidden lg:block">
        <div className="mx-auto flex max-w-7xl items-center justify-center px-6 py-3">
          <Link href="/" aria-label="GOYANG DMC" className="group inline-flex items-center">
            <BrandLogo size="lg" />
          </Link>
        </div>
      </div>

      {/* ── [Desktop] 메인 네비 · 중앙 정렬 · 활성 = accent 하단 언더라인 ── */}
      <div className="hidden border-t border-slate-100 lg:block">
        <nav className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-2 gap-y-1 px-6">
          {navigation.map((item) => {
            const active = isActive(item.href);
            const tone = navTone(item.key);
            const toneClass = active
              ? "text-[var(--accent)]"
              : tone === "visitor"
                ? "text-[var(--charcoal)] hover:text-[var(--accent)]"
                : tone === "action"
                  ? "text-slate-600 hover:text-[var(--accent)]"
                  : "text-slate-400 hover:text-slate-700";
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`relative inline-flex shrink-0 items-center px-3 py-2 text-[12px] font-semibold uppercase tracking-[0.12em] transition xl:text-[13px] ${toneClass} border-b-2 ${
                  active ? "border-[var(--accent)]" : "border-transparent"
                }`}
              >
                {navigationLabels[activeLocale][item.key]}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* ── [Desktop] BEST 서브줄 · 박스 없이 · 오더 #C29 [3]: 구분선 slate-200 로 진하게.
             오더 #C32: 홈(/) 과 /best·/best/{cat} 에서만 노출 — 상세·기타 페이지 숨김. ── */}
      {showBestSubRow ? (
        <div className="hidden border-t border-slate-200 bg-white lg:block">
          <BestCategoriesSubRow activeLocale={activeLocale} pathname={pathname} />
        </div>
      ) : null}

      {/* ── [Mobile] 브랜드 라인 · 좌 햄버거 · 중앙 로고 · 우 User+언어 ── */}
      {/* 오더 #C32: 슬림화 — py-3 → py-2. */}
      <div className="lg:hidden">
        <div className="mx-auto grid max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-2 px-3 py-2 sm:px-4">
          {/* 좌: 햄버거 */}
          <button
            type="button"
            aria-label={menuOpen ? copy.closeLabel : copy.menuLabel}
            onClick={() => setMenuOpen((o) => !o)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 bg-white text-[var(--charcoal)] transition hover:bg-slate-50"
          >
            {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>

          {/* 중앙: 로고 */}
          <div className="flex items-center justify-center">
            <Link href="/" aria-label="GOYANG DMC" className="inline-flex items-center">
              <BrandLogo size="sm" />
            </Link>
          </div>

          {/* 우: User + 언어 드롭다운 */}
          <div className="flex items-center justify-end gap-1.5">
            <HeaderUserMenu locale={activeLocale} />
            <MobileLocaleSelector activeLocale={activeLocale} pathname={pathname} />
          </div>
        </div>

        {/* 모바일 드로어 메뉴 */}
        {menuOpen ? (
          <div className="border-t border-slate-100 bg-white px-3 pb-4 pt-2 sm:px-4">
            <nav className="grid gap-1">
              {navigation.map((item) => {
                const active = isActive(item.href);
                const tone = navTone(item.key);
                const toneClass = active
                  ? "text-[var(--accent)]"
                  : tone === "visitor"
                    ? "text-[var(--charcoal)] hover:text-[var(--accent)]"
                    : tone === "action"
                      ? "text-slate-600 hover:text-[var(--accent)]"
                      : "text-slate-400 hover:text-slate-700";
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={`inline-flex min-h-12 items-center border-b border-slate-100 px-2 py-3 text-sm font-semibold uppercase tracking-[0.1em] transition ${toneClass} ${
                      active ? "border-b-2 border-[var(--accent)]" : ""
                    }`}
                  >
                    {navigationLabels[activeLocale][item.key]}
                  </Link>
                );
              })}
            </nav>
            {/* 모바일 BEST 서브 카테고리 — 오더 #C29 [3]: 구분선 slate-200 로 진하게. */}
            <div className="mt-3 border-t border-slate-200 pt-3">
              <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--accent)]">
                BEST
              </div>
              <div className="flex flex-wrap gap-1.5">
                {CURATED_CATEGORIES.map((cat) => {
                  const href = `/best/${cat}`;
                  const active = pathname === href;
                  return (
                    <Link
                      key={cat}
                      href={href}
                      onClick={() => setMenuOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className={`inline-flex shrink-0 items-center rounded-full border px-3 py-1.5 text-[12px] font-semibold transition ${
                        active
                          ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]"
                          : "border-slate-200 text-slate-700 hover:border-[var(--accent)]/40 hover:text-[var(--charcoal)]"
                      }`}
                    >
                      {CATEGORY_LABEL[activeLocale][cat]}
                    </Link>
                  );
                })}
              </div>
            </div>
            {/* 모바일 유틸 (언어는 우측 드롭다운, 통화만 여기) */}
            <div className="mt-3 flex items-center gap-3 border-t border-slate-100 pt-3">
              <span className="text-[11px] font-bold tracking-[0.08em] text-slate-500">
                ₩ KRW
              </span>
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}

/**
 * BEST 하위 9카테고리 서브 네비 (데스크탑 · 박스 없음 · 얇은 top border만).
 * 카테고리 라벨은 data/curated-categories.ts 의 CATEGORY_LABEL 재사용.
 */
function BestCategoriesSubRow({
  activeLocale,
  pathname,
}: {
  activeLocale: LocaleKey;
  pathname: string;
}) {
  return (
    <nav
      aria-label="BEST 카테고리"
      className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-2 gap-y-1 px-6 py-2"
    >
      <span className="mr-2 text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--accent)]">
        BEST
      </span>
      {CURATED_CATEGORIES.map((cat) => {
        const href = `/best/${cat}`;
        const active = pathname === href;
        return (
          <Link
            key={cat}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`inline-flex shrink-0 items-center px-2 py-1 text-[11px] font-semibold transition ${
              active
                ? "text-[var(--accent)]"
                : "text-slate-600 hover:text-[var(--accent)]"
            }`}
          >
            {CATEGORY_LABEL[activeLocale][cat]}
          </Link>
        );
      })}
    </nav>
  );
}

// 모바일용 언어 선택기 (드롭다운) — 흰 배경 톤.
function MobileLocaleSelector({
  activeLocale,
  pathname,
}: {
  activeLocale: LocaleKey;
  pathname: string;
}) {
  const [open, setOpen] = useState(false);
  const current = localeButtons.find((b) => b.locale === activeLocale);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-9 items-center gap-1 rounded-md border border-slate-200 bg-white px-2 text-[11px] font-bold text-[var(--charcoal)] transition hover:bg-slate-50"
      >
        {current?.label ?? "KO"}
        <svg
          className={`h-2.5 w-2.5 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-11 z-50 min-w-[90px] overflow-hidden rounded-md border border-slate-200 bg-white shadow-[0_12px_32px_rgba(15,23,42,0.15)]">
          {localeButtons.map(({ locale: loc, label }) => (
            <Link
              key={loc}
              href={pathname}
              locale={loc}
              onClick={() => setOpen(false)}
              className={`flex items-center justify-between px-4 py-2.5 text-[12px] font-bold transition hover:bg-slate-50 ${
                activeLocale === loc ? "text-[var(--accent)]" : "text-slate-700"
              }`}
            >
              <span>{label}</span>
              {activeLocale === loc && (
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
