// components/layout/TrustBarClient.tsx — 오더 #C58 [4] · #C60 admin DB 이관.
//
// 원본 TrustBar.tsx 로직 이관. server wrapper (TrustBar.tsx) 가 DB 조회 후
// items 를 5로케일 완전 형태로 전달. 이 파일은 locale 선택만 담당.
//
// · 배경 var(--accent) 코럴레드 · 전폭 · text-white · 라인 아이콘 lucide 1종
// · 4칸 5로케일 (order-agnostic — items 배열 순서를 그대로 렌더).
// · 모바일 (lg-): 2번째와 4번째 칸만 노출 (기존 UI 규범 유지).

"use client";

import { useLocale } from "next-intl";
import { Compass, Zap, ShieldCheck, Languages } from "lucide-react";

import type { I18n, SiteCopyLocale, TrustBarItem } from "@/data/site-copy-defaults";
import { pickSiteCopyLocale } from "@/data/site-copy-defaults";

// index-기반 icon · mobile 노출 규칙 (기존 하드코딩 유지 · admin 편집 대상 아님).
const ICONS = [Compass, Zap, ShieldCheck, Languages];
const SHOW_ON_MOBILE = [false, true, false, true];

interface Props {
  items: TrustBarItem[];
}

function pickLabel(i18n: I18n, loc: SiteCopyLocale): string {
  return i18n[loc] ?? i18n.ko ?? "";
}

export default function TrustBarClient({ items }: Props) {
  const locale = useLocale();
  const active = pickSiteCopyLocale(locale);

  return (
    <section
      aria-label="Trust bar"
      className="w-full bg-[var(--accent)] text-white"
    >
      <ul className="mx-auto flex max-w-7xl flex-wrap items-stretch">
        {items.map((it, i) => {
          const Icon = ICONS[i] ?? Compass;
          const mobileHide = SHOW_ON_MOBILE[i] ? "" : "hidden lg:flex";
          const label = pickLabel(it.label, active);
          return (
            <li
              key={i}
              className={`flex flex-1 basis-1/2 items-center gap-3 px-4 py-4 sm:px-5 sm:py-5 lg:basis-1/4 ${mobileHide} ${
                i > 0 ? "lg:border-l lg:border-white/20" : ""
              }`}
            >
              <span
                aria-hidden="true"
                className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/15"
              >
                <Icon className="h-4 w-4" strokeWidth={1.75} />
              </span>
              <div className="min-w-0 text-sm leading-snug sm:text-[15px]">
                {it.bold && (
                  <span className="mr-1.5 font-black tracking-[-0.01em]">{it.bold}</span>
                )}
                <span className="text-white/95">{label}</span>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
