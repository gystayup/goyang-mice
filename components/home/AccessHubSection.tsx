// components/home/AccessHubSection.tsx
// 홈 · Access Hub 섹션 — 통짜 이미지 배치 (오더 #2-R5 최종).
//
// R4의 스크림·SVG·코드 오버레이 방식은 폐기. 사장님 확정본 인포그래픽을
// CuratedGridSection 카드와 동일한 문법으로 풀와이드 그대로 배치.
//
// 배경 · 유일 시각 자산: public/images/access/access-hub.jpg
//   (originals/access/estination-korea-1.png 를 sharp mozjpeg q85 4:4:4 로 변환,
//    이미지 내 텍스트 엣지 선명도 유지. 잘림·크롭 없음.)
//
// 코드 요소:
//   · 상단 eyebrow "ACCESS HUB" (영문 고정)
//   · 헤드라인 5로케일 (기존 확정 문안 그대로 재사용)
//   · next/image alt 5로케일 (스크린리더 대응, 이미지 내용 요약)
//
// 이미지 내부 수치(20분·50분 등) 그대로 인정 — 코드 오버레이 없음.
//
// 무접촉: DB / card·hero·badge 자산 / 다른 섹션 / messages/*.json. 판매 소구어 0.

import Image from "next/image";

type LocaleKey = "ko" | "en" | "ja" | "zh-CN" | "zh-TW";
const LOCALES: LocaleKey[] = ["ko", "en", "ja", "zh-CN", "zh-TW"];

type Copy = { head: string; alt: string };

const EYEBROW = "ACCESS HUB";

const COPY: Record<LocaleKey, Copy> = {
  ko: {
    head: "가장 가까운 곳에서 만나는 가장 특별한 경험",
    alt: "고양 BEST DESTINATION CITY — 인천공항·김포공항 접근성과 GTX-A·경의선·3호선을 통한 서울역·홍대·종로·성수 이동시간을 정리한 인포그래픽",
  },
  en: {
    head: "The most special experiences, closest at hand",
    alt: "GOYANG — The Best Destination City. Infographic showing airport access from Incheon and Gimpo, plus travel times to Seoul Station, Hongdae, Jongno and Seongsu via GTX-A, Gyeongui Line and Subway Line 3.",
  },
  ja: {
    head: "最も近い場所で出会う、最も特別な体験",
    alt: "GOYANG — The Best Destination City。仁川空港・金浦空港からのアクセスと、GTX-A・京義線・3号線でのソウル駅・弘大・鍾路・聖水への所要時間をまとめたインフォグラフィック。",
  },
  "zh-CN": {
    head: "在最近的地方，遇见最特别的体验",
    alt: "GOYANG — The Best Destination City。展示从仁川机场·金浦机场的接驳，以及经由 GTX-A·京义线·3号线前往首尔站·弘大·钟路·圣水的用时信息图。",
  },
  "zh-TW": {
    head: "在最近的地方，遇見最特別的體驗",
    alt: "GOYANG — The Best Destination City。展示由仁川機場·金浦機場的接駁，以及經由 GTX-A·京義線·3號線前往首爾站·弘大·鍾路·聖水的所需時間資訊圖。",
  },
};

export default function AccessHubSection({ locale }: { locale: string }) {
  const active: LocaleKey = (
    LOCALES.includes(locale as LocaleKey) ? locale : "ko"
  ) as LocaleKey;
  const copy = COPY[active];

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12">
      <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-500">
        {EYEBROW}
      </div>
      <h2 className="mt-2 max-w-3xl text-2xl font-black leading-tight tracking-[-0.03em] text-slate-950 sm:text-3xl lg:text-4xl">
        {copy.head}
      </h2>

      {/* 통짜 인포그래픽 · 잘림·크롭 없음 · CuratedGridSection 카드와 같은 문법 */}
      <div className="mt-6 overflow-hidden rounded-[24px] border border-slate-200/70 bg-white shadow-[0_10px_30px_rgba(16,32,58,0.10)] sm:rounded-[28px]">
        <Image
          src="/images/access/access-hub.jpg"
          alt={copy.alt}
          width={1535}
          height={1024}
          sizes="(min-width: 1280px) 1232px, (min-width: 640px) calc(100vw - 3rem), calc(100vw - 2rem)"
          className="h-auto w-full"
        />
      </div>
    </section>
  );
}
