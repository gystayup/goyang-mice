// components/home/AccessHubSection.tsx
// 홈 · Access Hub 섹션 (CuratedGridSection 과 SocialSection 사이).
//
// 구조:
//   · eyebrow: "ACCESS HUB" (5로케일 공통 라벨)
//   · 헤드라인 (로케일별)
//   · 서브 1문장 (로케일별)
//   · 인포그래픽 이미지 풀와이드 — next/image, alt 5로케일
//     · 실 해상도 1535x1024 (ratio 1.499, 약 3:2) — 원본 PNG는 리포 밖(/originals/access) 보관.
//     · sizes 실해상도 기준으로 지정 (불필요 업스케일 방지).
//     · 이미지 안 텍스트는 영문 고정(로컬라이즈 대상 아님, 문안 예:
//       "STAY IN GOYANG. EXPERIENCE MORE OF KOREA.").
//   · 하단 캡션 1줄 (로케일별): 접근 시간 요약.
//
// 번역: 컴포넌트 내부 Record<LocaleKey, ...> 상수 (EmblemEntrySection 방식 준용).
// messages/*.json 키 추가 없음.
//
// 무접촉: 카드/hero/badge 자산, DB, 다른 섹션. 판매 소구어 0.

import Image from "next/image";

type LocaleKey = "ko" | "en" | "ja" | "zh-CN" | "zh-TW";

const LOCALES: LocaleKey[] = ["ko", "en", "ja", "zh-CN", "zh-TW"];

type Copy = {
  head: string;
  sub: string;
  caption: string;
  alt: string;
};

const EYEBROW = "ACCESS HUB";

const COPY: Record<LocaleKey, Copy> = {
  ko: {
    head: "가장 가까운 곳에서 만나는 가장 특별한 경험",
    sub: "공항·서울·DMZ·KINTEX를 가장 빠르게 잇는 대한민국 관문 도시",
    caption:
      "서울 13–17분(GTX-A) · 김포공항 9분(대곡역 기준) · 파주 DMZ 30분 · 인천공항 직결",
    alt: "고양일산 교통 접근성 인포그래픽 — GTX-A로 서울, 김포·인천공항, 파주 DMZ, KINTEX 연결",
  },
  en: {
    head: "The most special experiences, closest at hand",
    sub: "The gateway city that links the airports, Seoul, the DMZ and KINTEX in the shortest time",
    caption:
      "Seoul 13–17 min (GTX-A) · Gimpo Airport 9 min (from Daegok) · Paju DMZ 30 min · Direct to Incheon Airport",
    alt: "Goyang-Ilsan access infographic — GTX-A connects to Seoul, Gimpo and Incheon airports, Paju DMZ and KINTEX",
  },
  ja: {
    head: "最も近い場所で出会う、最も特別な体験",
    sub: "空港・ソウル・DMZ・KINTEXを最短でつなぐ、韓国のゲートウェイ都市",
    caption:
      "ソウル13–17分（GTX-A）・金浦空港9分（大谷駅基準）・坡州DMZ30分・仁川空港直結",
    alt: "高陽・一山アクセスインフォグラフィック — GTX-Aでソウル、金浦・仁川空港、坡州DMZ、KINTEXを連結",
  },
  "zh-CN": {
    head: "在最近的地方，遇见最特别的体验",
    sub: "以最短时间连接机场、首尔、DMZ与KINTEX的韩国门户城市",
    caption:
      "首尔13–17分钟（GTX-A）· 金浦机场9分钟（自大谷站）· 坡州DMZ 30分钟 · 直达仁川机场",
    alt: "高阳·一山交通门户信息图 — GTX-A 连接首尔、金浦与仁川机场、坡州DMZ、KINTEX",
  },
  "zh-TW": {
    head: "在最近的地方，遇見最特別的體驗",
    sub: "以最短時間連接機場、首爾、DMZ與KINTEX的韓國門戶城市",
    caption:
      "首爾13–17分鐘（GTX-A）· 金浦機場9分鐘（自大谷站）· 坡州DMZ 30分鐘 · 直達仁川機場",
    alt: "高陽·一山交通門戶資訊圖 — GTX-A 連接首爾、金浦與仁川機場、坡州DMZ、KINTEX",
  },
};

export default function AccessHubSection({ locale }: { locale: string }) {
  const active: LocaleKey = (LOCALES.includes(locale as LocaleKey)
    ? locale
    : "ko") as LocaleKey;
  const copy = COPY[active];

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-18">
      <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-500">
        {EYEBROW}
      </div>
      <h2 className="mt-3 max-w-3xl text-xl font-black leading-tight tracking-[-0.03em] text-slate-950 sm:text-2xl">
        {copy.head}
      </h2>
      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base">
        {copy.sub}
      </p>

      {/*
        인포그래픽 이미지 — 실 해상도 1535x1024 (약 3:2). max-w-7xl 컨테이너
        안쪽 최대 렌더 폭 ~1232px 이라 원본 이내 → 업스케일 없음.
        sizes 는 실제 최대 렌더 폭 기준으로 명시.
        고해상도 교체 시 access-hub.jpg 파일 덮어쓰기만으로 반영 가능
        (width/height 값은 원본 비율만 같으면 재조정 불필요).
      */}
      <div className="mt-8 overflow-hidden rounded-[20px] border border-slate-200/70 bg-white shadow-[0_10px_30px_rgba(16,32,58,0.08)]">
        <Image
          src="/images/access/access-hub.jpg"
          alt={copy.alt}
          width={1535}
          height={1024}
          sizes="(min-width: 1280px) 1232px, (min-width: 640px) calc(100vw - 3rem), calc(100vw - 2rem)"
          className="h-auto w-full"
        />
      </div>

      <p className="mt-4 text-xs leading-relaxed text-slate-500 sm:text-sm">
        {copy.caption}
      </p>
    </section>
  );
}
