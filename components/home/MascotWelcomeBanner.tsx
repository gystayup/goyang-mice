// @deprecated — 오더 #C52 로 홈에서 렌더 제거. 마스코트는 HeroDiscoverSection 우측 상단 absolute 로 이동.
//   컴포넌트 파일은 재사용 여지 위해 보존 (import 소비처 0 · dead code).
//
// components/home/MascotWelcomeBanner.tsx — 오더 #C26 섹션 사이 한복 고양이 웰컴 배너.
//
// 배치: HomePageContent 에서 MustSeeSection 과 BestGridEntrySection 사이.
// 목적: 브랜드 캐릭터 노출 · 섹션 사이 여백 채움.
//
// 자산: public/images/mascot/welcome-hanbok-cats.png (1312×1199 · PNG RGBA · 투명).
//   · 이미지에 이미 "어서오세요 고양·일산으로" 한글 카피 포함
//   · 규범: 이미지 수정·생성 금지 (표시만).
//
// 카피:
//   · 이미지 자체에 한글 웰컴 카피가 각인돼 있으므로 로케일 카피는 중복 방지 차원에서 생략
//   · 우측(데스크탑) / 아래(모바일) 에 영문 브랜드 서브 라인 한 줄만 노출
//   · alt 만 5로케일 (스크린리더용).
//
// 반응형:
//   · 데스크탑 (lg+): 좌 이미지 h-56, 우 영문 서브 라인 (수직 중앙 정렬)
//   · 태블릿·모바일: 세로 스택 (이미지 h-40 → h-48, 서브 라인 아래)
//   · 이미지 크기는 과하지 않게 · 원본 비율 유지
//
// 배경:
//   · 이미지가 투명 PNG 라 배경 자유. 아이보리 (#faf7f2) 톤으로 섹션 브레이커.
//     Must-see (흰) 와 BestGridEntry (흰) 사이에 살짝 톤 차이로 브레이크.

import Image from "next/image";

type WelcomeLocale = "ko" | "en" | "ja" | "zh-CN" | "zh-TW";
const WELCOME_LOCALES: WelcomeLocale[] = ["ko", "en", "ja", "zh-CN", "zh-TW"];

// alt 5로케일 (스크린리더 · SEO). 이미지에 한글 카피가 각인돼 있으니 alt 도 그 뜻을 전달.
const MASCOT_ALT: Record<WelcomeLocale, string> = {
  ko: "한복 입은 고양 마스코트 · 어서오세요",
  en: "Goyang mascots in traditional hanbok · Welcome",
  ja: "韓服姿の高陽マスコット · ようこそ",
  "zh-CN": "身穿韩服的高阳吉祥物 · 欢迎",
  "zh-TW": "身穿韓服的高陽吉祥物 · 歡迎",
};

function pickWelcomeLocale(locale: string): WelcomeLocale {
  return (WELCOME_LOCALES as string[]).includes(locale) ? (locale as WelcomeLocale) : "ko";
}

export default function MascotWelcomeBanner({ locale }: { locale: string }) {
  const active = pickWelcomeLocale(locale);

  return (
    <section aria-label={MASCOT_ALT[active]} className="bg-[#faf7f2]">
      {/* 홈 정합: 상하 py-16 sm:py-20 lg:py-24 통일. */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
        <div className="flex flex-col items-center gap-4 lg:flex-row lg:items-center lg:justify-center lg:gap-10">
          {/* 마스코트 이미지 · 원본 비율 유지 · 데스크탑 224px · 모바일 160px */}
          <div className="relative h-40 w-40 shrink-0 sm:h-48 sm:w-48 lg:h-56 lg:w-56">
            <Image
              src="/images/mascot/welcome-hanbok-cats.png"
              alt={MASCOT_ALT[active]}
              fill
              sizes="(max-width: 640px) 160px, (max-width: 1024px) 192px, 224px"
              className="object-contain"
            />
          </div>

          {/* 영문 브랜드 서브 라인 — 5로케일 공통. 이미지에 한글 카피 중복 방지. */}
          <div className="text-center lg:text-left">
            <div className="text-[11px] font-bold uppercase tracking-[0.28em] text-[var(--accent)]">
              Welcome
            </div>
            <div className="mt-1 text-lg font-black uppercase tracking-[0.08em] text-[var(--charcoal,#232322)] sm:text-xl lg:text-2xl">
              Welcome to Goyang · Ilsan
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
