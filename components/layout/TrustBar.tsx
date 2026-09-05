// components/layout/TrustBar.tsx — 오더 #C58 [4] 신뢰 바 (푸터 바로 위 전역).
//
// · 배경 var(--accent) 코럴레드 · 전폭 · text-white · 라인 아이콘 lucide 1종
// · 4칸 5로케일:
//     1) GOYANG DMC · 고양·일산 방문 가이드 (굵게)
//     2) 서울 도심까지 GTX 16분
//     3) 공연·전시 티켓 안전 결제
//     4) 5개 언어 안내
// · 모바일 (lg-): 2칸 축소 — (2) GTX 16분 · (4) 5개 언어만 1줄
// · 금지: "공식·국가·연구원" 등 공공사칭 · 검증 불가 수치
//
// 배치: Shell.tsx <main> 뒤 <Footer/> 앞 · 전역 자동 적용.

"use client";

import { useLocale } from "next-intl";
import { Compass, Zap, ShieldCheck, Languages } from "lucide-react";

type TrustLocale = "ko" | "en" | "ja" | "zh-CN" | "zh-TW";
const LOCALES: TrustLocale[] = ["ko", "en", "ja", "zh-CN", "zh-TW"];

type Item = {
  icon: typeof Compass;
  /** 강조(굵게) 라벨. 첫 칸에서만 사용. */
  bold?: string;
  /** 본 라벨. */
  label: string;
  /** 모바일(lg-) 축소 시 노출 여부. */
  showOnMobile: boolean;
};

// 5로케일 4항목.
const ITEMS: Record<TrustLocale, Item[]> = {
  ko: [
    { icon: Compass,    bold: "GOYANG DMC", label: "고양·일산 방문 가이드",       showOnMobile: false },
    { icon: Zap,        label: "서울 도심까지 GTX 16분",                          showOnMobile: true  },
    { icon: ShieldCheck,label: "공연·전시 티켓 안전 결제",                       showOnMobile: false },
    { icon: Languages,  label: "5개 언어 안내",                                  showOnMobile: true  },
  ],
  en: [
    { icon: Compass,    bold: "GOYANG DMC", label: "Guide to Goyang · Ilsan",     showOnMobile: false },
    { icon: Zap,        label: "16 min to central Seoul via GTX",                showOnMobile: true  },
    { icon: ShieldCheck,label: "Secure ticketing for shows & exhibits",          showOnMobile: false },
    { icon: Languages,  label: "Available in 5 languages",                        showOnMobile: true  },
  ],
  ja: [
    { icon: Compass,    bold: "GOYANG DMC", label: "高陽・一山の訪問ガイド",       showOnMobile: false },
    { icon: Zap,        label: "ソウル都心までGTX16分",                            showOnMobile: true  },
    { icon: ShieldCheck,label: "公演・展示チケット安全決済",                       showOnMobile: false },
    { icon: Languages,  label: "5言語対応",                                        showOnMobile: true  },
  ],
  "zh-CN": [
    { icon: Compass,    bold: "GOYANG DMC", label: "高阳·一山访问指南",            showOnMobile: false },
    { icon: Zap,        label: "GTX 16分钟直达首尔市中心",                         showOnMobile: true  },
    { icon: ShieldCheck,label: "演出·展览门票安全支付",                            showOnMobile: false },
    { icon: Languages,  label: "5种语言服务",                                      showOnMobile: true  },
  ],
  "zh-TW": [
    { icon: Compass,    bold: "GOYANG DMC", label: "高陽·一山訪問指南",            showOnMobile: false },
    { icon: Zap,        label: "GTX 16分鐘直達首爾市中心",                         showOnMobile: true  },
    { icon: ShieldCheck,label: "演出·展覽門票安全支付",                            showOnMobile: false },
    { icon: Languages,  label: "5種語言服務",                                      showOnMobile: true  },
  ],
};

function pickLocale(locale: string): TrustLocale {
  return (LOCALES as string[]).includes(locale) ? (locale as TrustLocale) : "ko";
}

export default function TrustBar() {
  const locale = useLocale();
  const active = pickLocale(locale);
  const items = ITEMS[active];

  return (
    <section
      aria-label="Trust bar"
      className="w-full bg-[var(--accent)] text-white"
    >
      <ul className="mx-auto flex max-w-7xl flex-wrap items-stretch">
        {items.map((it, i) => {
          const Icon = it.icon;
          const mobileHide = it.showOnMobile ? "" : "hidden lg:flex";
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
                <span className="text-white/95">{it.label}</span>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
