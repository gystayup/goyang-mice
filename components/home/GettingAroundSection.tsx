// components/home/GettingAroundSection.tsx — 오더 #C18 (B28).
//
// "대중교통 / GETTING AROUND" 블록.
//   · 고양 출발 4개 노선 요약 (자체 제작 텍스트, 5로케일)
//   · 공식 외부 링크 2개 (새 탭)
//
// 규범:
//   · 노선도 이미지 사용·임베드 0 (저작권). 텍스트 + 외부 링크만.
//   · 예약·판매 표현 0. 5로케일 ko 폴백(A안).
//   · 노선·소요 표기는 근거 있는 것만 (GTX-A 16분 = 실측).

import { ExternalLink, Train, Bus, Zap } from "lucide-react";

export type GettingAroundLocale = "ko" | "en" | "ja" | "zh-CN" | "zh-TW";
const LOCALES: GettingAroundLocale[] = ["ko", "en", "ja", "zh-CN", "zh-TW"];

function pickLocale(locale: string): GettingAroundLocale {
  return LOCALES.includes(locale as GettingAroundLocale)
    ? (locale as GettingAroundLocale)
    : "ko";
}

type I18n = Record<GettingAroundLocale, string>;

const SECTION_EYEBROW = "GETTING AROUND"; // 5로케일 공통 영문 브랜드

const SECTION_HEADLINE: I18n = {
  ko: "고양에서 출발하기",
  en: "Starting from Goyang",
  ja: "高陽から出発する",
  "zh-CN": "从高阳出发",
  "zh-TW": "從高陽出發",
};

const SECTION_SUBHEAD: I18n = {
  ko: "GTX·지하철·공항버스로 이어지는 4개 노선",
  en: "Four lines out of Goyang — GTX, subway, and airport bus",
  ja: "GTX・地下鉄・空港バスでつながる4つの路線",
  "zh-CN": "GTX·地铁·机场巴士串联的四条线路",
  "zh-TW": "GTX·地鐵·機場巴士串聯的四條線路",
};

// ─── 4개 노선 요약 ───────────────────────────────────────────────────────
interface TransitLine {
  code: I18n;
  title: I18n;
  detail: I18n;
  icon: "gtx" | "subway" | "line3" | "airport";
}

const LINES: TransitLine[] = [
  {
    icon: "gtx",
    code: {
      ko: "GTX-A",
      en: "GTX-A",
      ja: "GTX-A",
      "zh-CN": "GTX-A",
      "zh-TW": "GTX-A",
    },
    title: {
      ko: "킨텍스·대곡 → 서울역 16분",
      en: "Kintex · Daegok → Seoul Station · 16 min",
      ja: "キンテックス・大谷 → ソウル駅 16分",
      "zh-CN": "KINTEX·大谷 → 首尔站 16分钟",
      "zh-TW": "KINTEX·大谷 → 首爾站 16分鐘",
    },
    detail: {
      ko: "고양 관문 노선. 서울역에서 KTX·공항철도 환승.",
      en: "Goyang's gateway line. Transfer to KTX and Airport Railroad at Seoul Station.",
      ja: "高陽の玄関口路線。ソウル駅でKTX・空港鉄道に乗換。",
      "zh-CN": "高阳门户线路。首尔站可换乘 KTX 与机场铁道。",
      "zh-TW": "高陽門戶線路。首爾站可換乘 KTX 與機場鐵道。",
    },
  },
  {
    icon: "line3",
    code: {
      ko: "3호선",
      en: "Line 3",
      ja: "3号線",
      "zh-CN": "3号线",
      "zh-TW": "3號線",
    },
    title: {
      ko: "대화·정발산·원당·지축",
      en: "Daehwa · Jeongbalsan · Wondang · Jichuk",
      ja: "大化・鼎鉢山・元堂・紙杻",
      "zh-CN": "大化·鼎钵山·元堂·纸杻",
      "zh-TW": "大化·鼎缽山·元堂·紙杻",
    },
    detail: {
      ko: "강남 방향 축. 도심 관광지·업무지구 직결.",
      en: "Southbound to Gangnam. Direct link to downtown sights and business districts.",
      ja: "江南方向の軸。都心の観光地・ビジネス街に直結。",
      "zh-CN": "南向江南轴线。直达市中心景点与商务区。",
      "zh-TW": "南向江南軸線。直達市中心景點與商務區。",
    },
  },
  {
    icon: "subway",
    code: {
      ko: "경의중앙선",
      en: "Gyeongui-Jungang Line",
      ja: "京義中央線",
      "zh-CN": "京义中央线",
      "zh-TW": "京義中央線",
    },
    title: {
      ko: "일산·백마·풍산",
      en: "Ilsan · Baengma · Pungsan",
      ja: "一山・白馬・楓山",
      "zh-CN": "一山·白马·枫山",
      "zh-TW": "一山·白馬·楓山",
    },
    detail: {
      ko: "홍대·용산 방향 축. 서울 서북부·한강 라인.",
      en: "Toward Hongdae and Yongsan. Northwestern Seoul along the Han River.",
      ja: "弘大・龍山方向の軸。ソウル西北部・漢江ライン。",
      "zh-CN": "弘大·龙山方向轴线。首尔西北部·汉江沿线。",
      "zh-TW": "弘大·龍山方向軸線。首爾西北部·漢江沿線。",
    },
  },
  {
    icon: "airport",
    code: {
      ko: "공항버스",
      en: "Airport Bus",
      ja: "空港バス",
      "zh-CN": "机场巴士",
      "zh-TW": "機場巴士",
    },
    title: {
      ko: "킨텍스·일산 → 인천공항 직통",
      en: "Kintex · Ilsan → Incheon Airport · direct",
      ja: "キンテックス・一山 → 仁川空港 直通",
      "zh-CN": "KINTEX·一山 → 仁川机场 直达",
      "zh-TW": "KINTEX·一山 → 仁川機場 直達",
    },
    detail: {
      ko: "환승 없이 인천공항까지. 24시간 운영 노선 존재.",
      en: "Direct to Incheon Airport with no transfer. Some routes run 24 hours.",
      ja: "乗換なしで仁川空港へ。24時間運行の路線あり。",
      "zh-CN": "无需换乘直达仁川机场。部分线路 24 小时运营。",
      "zh-TW": "無需換乘直達仁川機場。部分線路 24 小時運營。",
    },
  },
];

// ─── 공식 외부 링크 2개 ──────────────────────────────────────────────────
const OFFICIAL_LINKS_HEADLINE: I18n = {
  ko: "공식 노선도 · 앱",
  en: "Official maps and apps",
  ja: "公式路線図・アプリ",
  "zh-CN": "官方路线图与应用",
  "zh-TW": "官方路線圖與應用程式",
};

interface OfficialLink {
  label: I18n;
  href: string;
  hint: I18n;
}

const OFFICIAL_LINKS: OfficialLink[] = [
  {
    label: {
      ko: "서울 지하철 노선도 (공식·4개 국어)",
      en: "Seoul Subway Map (official · 4 languages)",
      ja: "ソウル地下鉄路線図 (公式・4言語)",
      "zh-CN": "首尔地铁路线图 (官方·4 语言)",
      "zh-TW": "首爾地鐵路線圖 (官方·4 語言)",
    },
    href: "http://www.seoulmetro.co.kr/kr/cyberStation.do",
    hint: {
      ko: "서울교통공사 사이버 스테이션",
      en: "Seoul Metro Cyber Station",
      ja: "ソウル交通公社サイバーステーション",
      "zh-CN": "首尔交通公社 Cyber Station",
      "zh-TW": "首爾交通公社 Cyber Station",
    },
  },
  {
    label: {
      ko: "실시간 지하철 앱",
      en: "Real-time Subway App",
      ja: "リアルタイム地下鉄アプリ",
      "zh-CN": "实时地铁应用",
      "zh-TW": "即時地鐵應用程式",
    },
    // 대표 앱 스토어 검색 링크 (특정 앱 배타적 추천 회피).
    href: "https://play.google.com/store/search?q=%EC%A7%80%ED%95%98%EC%B2%A0&c=apps",
    hint: {
      ko: "Google Play — '지하철' 검색",
      en: "Google Play — search for 'subway'",
      ja: "Google Play — '地下鉄' 検索",
      "zh-CN": "Google Play — 搜索“地铁”",
      "zh-TW": "Google Play — 搜尋「地鐵」",
    },
  },
];

const COPYRIGHT_NOTE: I18n = {
  ko: "※ 노선도 이미지는 저작권 사유로 임베드하지 않습니다. 위 공식 링크에서 확인해 주세요.",
  en: "※ Route-map images are not embedded due to copyright. Please refer to the official links above.",
  ja: "※ 路線図画像は著作権上の理由により埋め込みません。上記公式リンクをご参照ください。",
  "zh-CN": "※ 因版权原因不嵌入路线图。请查看上方官方链接。",
  "zh-TW": "※ 因版權原因不嵌入路線圖。請查看上方官方連結。",
};

// ─── 아이콘 매핑 ─────────────────────────────────────────────────────────
function IconFor({ kind }: { kind: TransitLine["icon"] }) {
  switch (kind) {
    case "gtx":
      return <Zap className="h-5 w-5" aria-hidden="true" />;
    case "line3":
    case "subway":
      return <Train className="h-5 w-5" aria-hidden="true" />;
    case "airport":
      return <Bus className="h-5 w-5" aria-hidden="true" />;
  }
}

export default function GettingAroundSection({ locale }: { locale: string }) {
  const active = pickLocale(locale);

  return (
    <section className="bg-[#faf7f2]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
        <div className="text-[11px] font-bold uppercase tracking-[0.28em] text-[var(--accent)]">
          {SECTION_EYEBROW}
        </div>
        <h2 className="mt-3 text-2xl font-black tracking-[-0.03em] text-[#232322] sm:text-3xl lg:text-4xl">
          {SECTION_HEADLINE[active]}
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
          {SECTION_SUBHEAD[active]}
        </p>

        {/* 4개 노선 요약 */}
        <ul className="mt-8 grid grid-cols-1 gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-5">
          {LINES.map((line, i) => (
            <li
              key={i}
              className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-5 shadow-[0_4px_14px_rgba(16,32,58,0.05)]"
            >
              <span
                aria-hidden="true"
                className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--accent)]/15 text-[var(--accent)]"
              >
                <IconFor kind={line.icon} />
              </span>
              <div className="min-w-0">
                <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--accent)]">
                  {line.code[active]}
                </div>
                <div className="mt-1 text-base font-black leading-snug tracking-[-0.02em] text-[#232322] sm:text-lg">
                  {line.title[active]}
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                  {line.detail[active]}
                </p>
              </div>
            </li>
          ))}
        </ul>

        {/* 공식 링크 */}
        <div className="mt-12">
          <div className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500">
            {OFFICIAL_LINKS_HEADLINE[active]}
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            {OFFICIAL_LINKS.map((l, i) => (
              <a
                key={i}
                href={l.href}
                target="_blank"
                rel="noreferrer noopener"
                className="group inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-[#232322] shadow-[0_4px_14px_rgba(16,32,58,0.06)] transition hover:border-slate-950 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              >
                <span>{l.label[active]}</span>
                <ExternalLink
                  className="h-3.5 w-3.5 text-slate-500 transition-colors group-hover:text-[var(--accent)]"
                  aria-hidden="true"
                />
              </a>
            ))}
          </div>
          <div className="mt-3 space-y-1">
            {OFFICIAL_LINKS.map((l, i) => (
              <p key={i} className="text-[11px] text-slate-500">
                · {l.hint[active]}
              </p>
            ))}
          </div>
        </div>

        {/* 저작권 안내 */}
        <p className="mt-8 text-[11px] italic text-slate-500 sm:text-xs">
          {COPYRIGHT_NOTE[active]}
        </p>
      </div>
    </section>
  );
}
