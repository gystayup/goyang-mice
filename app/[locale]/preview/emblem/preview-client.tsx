"use client";

// 엠블럼 프리뷰 UI — 실물 검수용 (홈 적용 전 렌더 품질 확인).
// - 5 category × 4 size 그리드
// - 로케일 5종 전환 버튼 (리본 문자열 즉시 변경)
// - 회색 배경 카드 위 M 사이즈 엠블럼 오버레이 샘플 1블록
// Emblem 컴포넌트는 import 만, 수정하지 않음.

import { useState } from "react";

import { Emblem } from "@/components/emblem/Emblem";
import type {
  EmblemCategory,
  EmblemLocale,
  EmblemSize,
} from "@/components/emblem/colors";

const CATEGORIES: EmblemCategory[] = [
  "walk",
  "food",
  "culture",
  "kculture",
  "history",
];
const SIZES: EmblemSize[] = ["L", "M", "S", "XS"];
const LOCALES: EmblemLocale[] = ["ko", "en", "ja", "zh-CN", "zh-TW"];

const LOCALE_LABEL: Record<EmblemLocale, string> = {
  ko: "한국어",
  en: "English",
  ja: "日本語",
  "zh-CN": "简体中文",
  "zh-TW": "繁體中文",
};

export default function EmblemPreviewClient() {
  const [locale, setLocale] = useState<EmblemLocale>("ko");

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-10 text-slate-900">
      <div className="mx-auto max-w-6xl">
        {/* ── 헤더 ── */}
        <header className="border-b border-slate-200 pb-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500">
            Internal · noindex
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
            Emblem Preview
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            고양 BEST 엠블럼 5 category × 4 size 매트릭스. 로케일 전환으로 리본
            문자열·aria-label 이 즉시 바뀌는지 확인. 홈 적용 전 렌더 품질(아크
            곡률·리본 정렬·소형 가독성) 실물 검수용.
          </p>
        </header>

        {/* ── 로케일 스위처 ── */}
        <section className="mt-8">
          <div className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
            Locale
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {LOCALES.map((loc) => (
              <button
                key={loc}
                type="button"
                onClick={() => setLocale(loc)}
                className={
                  "rounded-full px-4 py-1.5 text-sm font-semibold transition " +
                  (locale === loc
                    ? "bg-slate-950 text-white shadow"
                    : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-100")
                }
                aria-pressed={locale === loc}
              >
                <span className="mr-1.5 font-mono text-[11px] text-slate-400">
                  {loc}
                </span>
                {LOCALE_LABEL[loc]}
              </button>
            ))}
          </div>
        </section>

        {/* ── 5 카테고리 × 4 사이즈 그리드 ── */}
        <section className="mt-12 space-y-10">
          {CATEGORIES.map((cat) => (
            <div key={cat}>
              <h2 className="text-base font-bold uppercase tracking-[0.18em] text-slate-500">
                {cat}
              </h2>
              <div className="mt-4 flex flex-wrap items-end gap-x-10 gap-y-6 rounded-2xl border border-slate-200 bg-white p-6">
                {SIZES.map((size) => (
                  <div key={size} className="flex flex-col items-center gap-2">
                    <Emblem category={cat} size={size} locale={locale} />
                    <span className="font-mono text-[11px] text-slate-500">
                      {cat} · {size}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* ── 사진 위 오버레이 검수 (M 사이즈 1개) ── */}
        <section className="mt-16">
          <h2 className="text-base font-bold uppercase tracking-[0.18em] text-slate-500">
            Overlay on photo (M size)
          </h2>
          <p className="mt-2 text-xs text-slate-500">
            회색 배경 카드 위에 M 사이즈 엠블럼을 얹어 크림 배경·색 대비 확인용.
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {(["food", "history"] as EmblemCategory[]).map((cat) => (
              <div
                key={cat}
                className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-gradient-to-br from-slate-500 via-slate-400 to-slate-300"
              >
                <div className="absolute right-4 top-4">
                  <Emblem category={cat} size="M" locale={locale} />
                </div>
                <div className="absolute bottom-4 left-4 rounded-full bg-black/40 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
                  {cat} · M · {locale}
                </div>
              </div>
            ))}
          </div>
        </section>

        <footer className="mt-16 border-t border-slate-200 pt-6 text-xs text-slate-400">
          Internal preview · not indexed · {new Date().getFullYear()}
        </footer>
      </div>
    </div>
  );
}
