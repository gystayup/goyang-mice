// components/badges/StampBadge.tsx — 오더 #C14b 스탬프 배지 4종.
//
// Time Out 잡지 스타일의 원형 도장 (pen-style seal).
// 사장님 명시 4종 (사실 근거만):
//   · UNESCO WORLD HERITAGE — 조선왕릉 2009년 유네스코 등재 (seooreung·seosamneung)
//   · NETFLIX SENSATION    — 미스터 퀸 (2020) 비영어권 세계 7위 등 실제 순위 (Royal tombs)
//   · GTX-A 16 MIN         — GTX-A 킨텍스역 → 서울역 16분 (kintex·kintex-kpop 등)
//   · K-POP LIVE           — 고양종합운동장·킨텍스 K-POP 공연 (kintex-kpop·goyang-stadium)
//
// 규범:
//   · 카드당 최대 1개 (혼잡 방지, 소비 컴포넌트가 판정)
//   · 라벨은 영문 공통 (브랜드 스탬프 성격) · aria-label 만 로케일화
//   · 색: 골드 var(--gold) · 흰 배경 · 그림자 subtle
//   · pointer-events-none (Link 클릭 통과) · aria-hidden 은 부모가 판정

import type { HomeLocale } from "@/data/home-copy";

export type StampKind = "unesco" | "netflix" | "gtx" | "kpop";

const STAMP_LABEL: Record<StampKind, string> = {
  unesco: "UNESCO WORLD HERITAGE",
  netflix: "NETFLIX SENSATION",
  gtx: "GTX-A 16 MIN",
  kpop: "K-POP LIVE",
};

const STAMP_ARIA: Record<StampKind, Record<HomeLocale, string>> = {
  unesco: {
    ko: "유네스코 세계유산 인증",
    en: "UNESCO World Heritage",
    ja: "ユネスコ世界遺産",
    "zh-CN": "联合国教科文组织世界遗产",
    "zh-TW": "聯合國教科文組織世界遺產",
  },
  netflix: {
    ko: "넷플릭스 화제작 무대",
    en: "Featured in Netflix hits",
    ja: "Netflix話題作の舞台",
    "zh-CN": "Netflix 热播作品取景地",
    "zh-TW": "Netflix 熱播作品取景地",
  },
  gtx: {
    ko: "GTX-A 킨텍스역에서 서울역 16분",
    en: "16 minutes from Kintex to Seoul Station on GTX-A",
    ja: "GTX-Aでキンテックス駅からソウル駅まで16分",
    "zh-CN": "GTX-A 从 KINTEX 站至首尔站 16 分钟",
    "zh-TW": "GTX-A 從 KINTEX 站至首爾站 16 分鐘",
  },
  kpop: {
    ko: "K-POP 공연 거점",
    en: "A K-POP live venue",
    ja: "K-POP公演拠点",
    "zh-CN": "K-POP 演出据点",
    "zh-TW": "K-POP 演出據點",
  },
};

/**
 * 원형 도장 배지.
 * @param kind 4종 중 하나.
 * @param locale aria-label 용 로케일 (렌더 텍스트는 영문 공통).
 * @param size 지름 px (기본 64).
 * @param className 추가 클래스 (위치·회전 등).
 */
export function StampBadge({
  kind,
  locale,
  size = 64,
  className,
}: {
  kind: StampKind;
  locale: HomeLocale;
  size?: number;
  className?: string;
}) {
  const label = STAMP_LABEL[kind];
  const aria = STAMP_ARIA[kind][locale];
  const parts = label.split(" ");
  // Split into two lines: first 1-2 words on top, rest below (fits circle typography).
  const mid = Math.ceil(parts.length / 2);
  const line1 = parts.slice(0, mid).join(" ");
  const line2 = parts.slice(mid).join(" ");

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 100 100"
      role="img"
      aria-label={aria}
      className={`pointer-events-none drop-shadow-[0_4px_10px_rgba(0,0,0,0.25)] ${className ?? ""}`}
    >
      {/* 흰 배경 원 */}
      <circle cx="50" cy="50" r="46" fill="#ffffff" />
      {/* 골드 외곽 링 (두께 2.5) */}
      <circle
        cx="50"
        cy="50"
        r="45"
        fill="none"
        stroke="var(--gold, #D4AF37)"
        strokeWidth="2.5"
      />
      {/* 내부 얇은 링 (double-ring stamp look) */}
      <circle
        cx="50"
        cy="50"
        r="39"
        fill="none"
        stroke="var(--gold, #D4AF37)"
        strokeWidth="0.8"
      />
      {/* 상단 라인 */}
      <text
        x="50"
        y="46"
        textAnchor="middle"
        fontSize="9.5"
        fontWeight="900"
        fill="var(--gold, #D4AF37)"
        letterSpacing="0.5"
        fontFamily="system-ui, -apple-system, sans-serif"
      >
        {line1}
      </text>
      {/* 하단 라인 */}
      <text
        x="50"
        y="60"
        textAnchor="middle"
        fontSize="9.5"
        fontWeight="900"
        fill="var(--gold, #D4AF37)"
        letterSpacing="0.5"
        fontFamily="system-ui, -apple-system, sans-serif"
      >
        {line2}
      </text>
      {/* 하단 별표 데코 */}
      <text
        x="50"
        y="72"
        textAnchor="middle"
        fontSize="8"
        fill="var(--gold, #D4AF37)"
        opacity="0.7"
      >
        ★
      </text>
    </svg>
  );
}

/** 스팟 slug → 스탬프 종류 매핑 (사실 근거 있는 것만). 없으면 null → 배지 미노출.
 *  카드당 최대 1개 규범 상 여기서는 우선순위 있는 1종만 반환. */
export function stampForSlug(slug: string): StampKind | null {
  // UNESCO: 조선왕릉 2009 등재분.
  if (slug === "seooreung" || slug === "seosamneung") return "unesco";
  // NETFLIX: 왕릉·왕가 관련 K-드라마 무대 (사장님 확정 원문 근거).
  //   현재 우선순위상 UNESCO 로 이미 커버됨 → 다른 넷플릭스 스탬프 대상 없음.
  // GTX: KINTEX 도보권 스팟.
  if (slug === "kintex" || slug === "kintex-kpop" || slug === "hallyu-world") return "gtx";
  // K-POP: 고양종합운동장 · 킨텍스 K-POP 이벤트.
  if (slug === "goyang-stadium") return "kpop";
  return null;
}
