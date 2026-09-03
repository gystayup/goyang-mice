// components/home/GettingHereSection.tsx
// 홈 · GETTING HERE 브릿지 섹션 (오더 #A3).
//
// 위치: ACCESS HUB 아래, SocialSection 위 (AFTER KINTEX 자리 대체).
// 서사: 공항·서울에서 고양·일산으로 어떻게 오는가 — 5경로 안내.
//
// 껍데기 재사용 (오더 #A3 [1]):
//   AfterKintexBridgeSection 의 컨테이너·차콜 패널·라운드 카드 5개·번호
//   배지 위치·우측 상단 라벨 위치 구조를 그대로 답습. 신규 디자인 없음.
//   AfterKintexBridgeSection 파일은 삭제하지 않고 보존 (오더 #A3 [7]).
//
// 번호 배지: 오더 #A3 [3] 단색 정책 유지 · 오더 #C27 로 accent 코럴 통일.
// 우측 상단 라벨: 시간대 텍스트 대신 lucide 아이콘 (Bus / Car / TrainFront
//   / Train / MoreHorizontal).
// 링크: 5카드 전부 /dmc 로 연결 (오더 #A3 [6]). /dmc/move 상세는 별도 오더 예정.

import {
  Bus,
  Car,
  MoreHorizontal,
  Train,
  TrainFront,
  type LucideIcon,
} from "lucide-react";

import type { EmblemLocale } from "@/components/emblem/colors";
import { Link } from "@/lib/navigation";

type LocaleKey = EmblemLocale;
const LOCALES: LocaleKey[] = ["ko", "en", "ja", "zh-CN", "zh-TW"];

const EYEBROW = "GETTING HERE"; // 5로케일 공통 영문

const HEADLINE: Record<LocaleKey, string> = {
  ko: "고양·일산으로 오는 방법",
  en: "How to Get to Goyang-Ilsan",
  ja: "高陽・一山への行き方",
  "zh-CN": "前往高阳·一山的方式",
  "zh-TW": "前往高陽·一山的方式",
};

const SUB: Record<LocaleKey, string> = {
  ko: "공항·서울에서 오는 경로를 안내합니다.",
  en: "Routes from the airports and Seoul.",
  ja: "空港・ソウルからの経路をご案内します。",
  "zh-CN": "介绍从机场·首尔前往的路线。",
  "zh-TW": "介紹從機場·首爾前往的路線。",
};

type Step = {
  /** 카드 제목 (5로케일). */
  title: Record<LocaleKey, string>;
  /** 카드 부제 2줄 (5로케일). 각 배열은 정확히 2요소. */
  sub: Record<LocaleKey, [string, string]>;
  /** 우측 상단 lucide 아이콘. */
  icon: LucideIcon;
  /** /dmc/move?from={key} 탭 진입 키 (오더 #A4 [2]). */
  from: "incheon" | "gimpo" | "seoul" | "metro" | "other";
};

/**
 * 5경로 (오더 #A3 [3]).
 * GTX-A 소요시간은 20분 표기 — ACCESS HUB 인포그래픽과 통일 (오더 #A3 [4]).
 * 그 외 소요시간·요금 미기재 (오더 #A3 [5]).
 */
const STEPS: Step[] = [
  {
    title: {
      ko: "인천공항",
      en: "Incheon Airport",
      ja: "仁川空港",
      "zh-CN": "仁川机场",
      "zh-TW": "仁川機場",
    },
    sub: {
      ko: ["3300·5600 외", "공항철도 환승"],
      en: ["Bus 3300·5600", "via AREX"],
      ja: ["3300·5600番", "空港鉄道乗換"],
      "zh-CN": ["3300·5600路", "机场铁路换乘"],
      "zh-TW": ["3300·5600路", "機場鐵路換乘"],
    },
    icon: Bus,
    from: "incheon",
  },
  {
    title: {
      ko: "김포공항",
      en: "Gimpo Airport",
      ja: "金浦空港",
      "zh-CN": "金浦机场",
      "zh-TW": "金浦機場",
    },
    sub: {
      ko: ["서해선·150번", "택시"],
      en: ["Seohae Line·Bus 150", "Taxi"],
      ja: ["西海線·150番", "タクシー"],
      "zh-CN": ["西海线·150路", "出租车"],
      "zh-TW": ["西海線·150路", "計程車"],
    },
    icon: Car,
    from: "gimpo",
  },
  {
    title: {
      ko: "서울역·연신내",
      en: "Seoul Stn.·Yeonsinnae",
      ja: "ソウル駅·延新内",
      "zh-CN": "首尔站·延新内",
      "zh-TW": "首爾站·延新內",
    },
    sub: {
      ko: ["GTX-A 20분", "대곡·킨텍스역"],
      en: ["GTX-A 20 min", "Daegok·Kintex"],
      ja: ["GTX-A 20分", "大谷·キンテックス駅"],
      "zh-CN": ["GTX-A 20分钟", "大谷·韩国国际展览中心站"],
      "zh-TW": ["GTX-A 20分鐘", "大谷·韓國國際展覽中心站"],
    },
    icon: TrainFront,
    from: "seoul",
  },
  {
    title: {
      ko: "수도권 전철",
      en: "Metro",
      ja: "首都圏電鉄",
      "zh-CN": "首都圈地铁",
      "zh-TW": "首都圈地鐵",
    },
    sub: {
      ko: ["3호선 대화역", "경의중앙선"],
      en: ["Line 3 Daehwa", "Gyeongui-Jungang"],
      ja: ["3号線 大化駅", "京義中央線"],
      "zh-CN": ["3号线 大化站", "京义中央线"],
      "zh-TW": ["3號線 大化站", "京義中央線"],
    },
    icon: Train,
    from: "metro",
  },
  {
    title: {
      ko: "그 밖의 방법",
      en: "Other Options",
      ja: "その他の方法",
      "zh-CN": "其他方式",
      "zh-TW": "其他方式",
    },
    sub: {
      ko: ["시내버스", "공항픽업"],
      en: ["City Bus", "Airport Pickup"],
      ja: ["市内バス", "空港送迎"],
      "zh-CN": ["市内公交", "机场接送"],
      "zh-TW": ["市內公車", "機場接送"],
    },
    icon: MoreHorizontal,
    from: "other",
  },
];

// 오더 #A3 [3] 단색 정책 유지 · 오더 #C27 로 accent 코럴 통일 (카테고리색 5종 사용 금지).
const ACCENT = "#e23e2e";

export default function GettingHereSection({ locale }: { locale: string }) {
  const active: LocaleKey = (
    LOCALES.includes(locale as LocaleKey) ? locale : "ko"
  ) as LocaleKey;

  return (
    <section
      id="getting-here"
      className="mx-auto max-w-7xl scroll-mt-24 px-4 py-10 sm:px-6 sm:py-14"
    >
      <div className="rounded-[32px] bg-[var(--charcoal)] px-6 py-10 shadow-[0_28px_70px_rgba(35,35,34,0.35)] sm:rounded-[40px] sm:px-10 sm:py-14 lg:px-14">
        {/* Header */}
        <div>
          <div className="text-[11px] font-bold uppercase tracking-[0.28em] text-[var(--accent)]">
            {EYEBROW}
          </div>
          <h2 className="mt-3 max-w-3xl text-2xl font-black leading-tight tracking-[-0.03em] text-white sm:text-3xl lg:text-4xl">
            {HEADLINE[active]}
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/70 sm:text-base">
            {SUB[active]}
          </p>
        </div>

        {/* 5경로 — sm 이하: 세로 스택 · lg+: 5열 가로 */}
        <ol className="mt-10 grid gap-3 sm:mt-14 lg:grid-cols-5 lg:gap-3">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            const title = step.title[active];
            const [line1, line2] = step.sub[active];
            const label = `${title} · ${line1} · ${line2}`;
            return (
              <li key={title} className="relative">
                <Link
                  href={`/dmc/move?from=${step.from}`}
                  aria-label={label}
                  className="group flex h-full items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.05] p-5 transition hover:border-[var(--accent)]/40 hover:bg-white/[0.08] lg:flex-col lg:items-start lg:gap-3"
                >
                  {/* step number + right-top icon — 데스크톱은 상단 가로, 모바일은 좌측 세로 뱃지 */}
                  <div className="flex shrink-0 flex-col items-center gap-1 lg:w-full lg:flex-row lg:justify-between">
                    <span
                      className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-[11px] font-black lg:h-6 lg:w-6 lg:text-[10px]"
                      style={{ borderColor: ACCENT, color: ACCENT, background: `${ACCENT}18` }}
                    >
                      {`0${i + 1}`}
                    </span>
                    <Icon
                      aria-hidden="true"
                      className="hidden h-4 w-4 text-white/55 lg:inline"
                    />
                  </div>

                  {/* 모바일 전용 아이콘 (원형 뱃지 옆) */}
                  <Icon
                    aria-hidden="true"
                    className="h-4 w-4 shrink-0 text-white/55 lg:hidden"
                  />

                  {/* 제목 + 부제 2줄 */}
                  <div className="min-w-0 flex-1">
                    <div className="text-base font-black leading-tight text-white sm:text-lg">
                      {title}
                    </div>
                    <div className="mt-1 text-[13px] leading-snug text-white/70">
                      {line1}
                    </div>
                    <div className="text-[13px] leading-snug text-white/70">
                      {line2}
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
