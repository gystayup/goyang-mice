// 고양 BEST 큐레이션 카드 그리드 (Time Out 리뉴얼 3차 · Section C).
// 기존 파스텔 5카드 영역을 대체. 대형 사진(플레이스홀더 컬러 블록) +
// 좌상단 컬러 엠블럼 M 오버레이 + 카테고리 레이블 + 헤드라인 + 1줄 설명.
//
// 초기 카드는 5카테고리 각 1장씩(총 5장) 플레이스홀더 헤드라인·설명.
// 실제 큐레이션 데이터(어느 스팟인지)는 HOLD — 다음 오더로 실데이터 주입 예정.

import { Emblem } from "@/components/emblem/Emblem";
import {
  EMBLEM_COLORS,
  EMBLEM_RIBBON_TEXT,
  type EmblemCategory,
  type EmblemLocale,
} from "@/components/emblem/colors";

type LocaleKey = EmblemLocale;

const LOCALES: LocaleKey[] = ["ko", "en", "ja", "zh-CN", "zh-TW"];

const CATEGORIES: EmblemCategory[] = [
  "walk",
  "food",
  "culture",
  "kculture",
  "history",
];

const SECTION_HEADLINE: Record<LocaleKey, string> = {
  ko: "이번 주 고양 BEST",
  en: "This Week's Goyang Best",
  ja: "今週の高陽ベスト",
  "zh-CN": "本周高阳BEST",
  "zh-TW": "本週高陽BEST",
};

/**
 * 카드별 헤드라인·1줄 설명 (5카테고리 × 5로케일 플레이스홀더).
 * TODO(content): 큐레이션 실데이터 주입 시 이 상수를 교체하거나
 *                 CMS/서버 데이터로 대체.
 */
type CardCopy = { headline: string; desc: string };
const CARD_COPY: Record<LocaleKey, Record<EmblemCategory, CardCopy>> = {
  ko: {
    walk: {
      headline: "고양 BEST 산책 10선",
      desc: "일산호수공원부터 정발산까지, 사계절 걷기 좋은 길.",
    },
    food: {
      headline: "고양 BEST 미식 10선",
      desc: "일산 노포부터 K-베이커리까지, 놓치면 아쉬운 한 끼.",
    },
    culture: {
      headline: "고양 BEST 문화 10선",
      desc: "아람누리·꽃누리에서 만나는 이번 시즌 공연·전시.",
    },
    kculture: {
      headline: "고양 BEST K컬처 10선",
      desc: "KINTEX와 K-POP 아레나에서 열리는 라이브 라인업.",
    },
    history: {
      headline: "고양 BEST 역사 10선",
      desc: "행주산성부터 벽제관지까지, 걸으며 만나는 조선사.",
    },
  },
  en: {
    walk: {
      headline: "Goyang's 10 Best Walks",
      desc: "From Ilsan Lake Park to Jeongbalsan — paths for every season.",
    },
    food: {
      headline: "Goyang's 10 Best Eats",
      desc: "From long-standing Ilsan spots to K-bakeries you shouldn't miss.",
    },
    culture: {
      headline: "Goyang's 10 Best Culture Picks",
      desc: "This season's shows and exhibitions at Aramnuri and Ggotnuri.",
    },
    kculture: {
      headline: "Goyang's 10 Best K-Culture Nights",
      desc: "Live lineups coming to KINTEX and the K-POP Arena.",
    },
    history: {
      headline: "Goyang's 10 Best Historic Trails",
      desc: "From Haengju Fortress to Byeokjegwan — Joseon on foot.",
    },
  },
  ja: {
    walk: {
      headline: "高陽ベスト散策10選",
      desc: "一山湖水公園から鼎鉢山まで、四季を通じて歩きたい道。",
    },
    food: {
      headline: "高陽ベストグルメ10選",
      desc: "一山の老舗からK-ベーカリーまで、見逃せない一皿。",
    },
    culture: {
      headline: "高陽ベスト文化10選",
      desc: "アラムヌリ・ッコンヌリの今シーズンの公演・展示。",
    },
    kculture: {
      headline: "高陽ベストKカルチャー10選",
      desc: "KINTEXとK-POPアリーナのライブラインナップ。",
    },
    history: {
      headline: "高陽ベスト歴史10選",
      desc: "幸州山城から碧蹄館址まで、歩いて出会う朝鮮史。",
    },
  },
  "zh-CN": {
    walk: {
      headline: "高阳漫步TOP10",
      desc: "从一山湖水公园到鼎钵山，四季皆宜的步道。",
    },
    food: {
      headline: "高阳美食TOP10",
      desc: "一山老店到K-烘焙，值得一试的味道。",
    },
    culture: {
      headline: "高阳文化TOP10",
      desc: "阿拉木努里、花努里的本季演出与展览。",
    },
    kculture: {
      headline: "高阳K文化TOP10",
      desc: "KINTEX与K-POP竞技场的现场阵容。",
    },
    history: {
      headline: "高阳历史TOP10",
      desc: "从幸州山城到碧蹄馆址，边走边看的朝鲜史。",
    },
  },
  "zh-TW": {
    walk: {
      headline: "高陽漫步TOP10",
      desc: "從一山湖水公園到鼎鉢山，四季皆宜的步道。",
    },
    food: {
      headline: "高陽美食TOP10",
      desc: "一山老店到K-烘焙，值得一試的味道。",
    },
    culture: {
      headline: "高陽文化TOP10",
      desc: "阿拉木努里、花努里的本季演出與展覽。",
    },
    kculture: {
      headline: "高陽K文化TOP10",
      desc: "KINTEX與K-POP競技場的現場陣容。",
    },
    history: {
      headline: "高陽歷史TOP10",
      desc: "從幸州山城到碧蹄館址，邊走邊看的朝鮮史。",
    },
  },
};

// TODO(routing): 카테고리별 상세 라우트 준비되면 아래 map 갱신.
// 현재는 앵커 플레이스홀더.
const STORY_HREF: Record<EmblemCategory, string> = {
  walk: "#",
  food: "#",
  culture: "#",
  kculture: "#",
  history: "#",
};

export default function CuratedGridSection({ locale }: { locale: string }) {
  const activeLocale: LocaleKey = (
    LOCALES.includes(locale as LocaleKey) ? locale : "ko"
  ) as LocaleKey;
  const sectionHeadline = SECTION_HEADLINE[activeLocale];

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-18">
      <h2 className="text-xl font-black tracking-[-0.03em] text-slate-950 sm:text-2xl">
        {sectionHeadline}
      </h2>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORIES.map((cat) => {
          const color = EMBLEM_COLORS[cat];
          const ribbonLabel = EMBLEM_RIBBON_TEXT[activeLocale][cat];
          const { headline, desc } = CARD_COPY[activeLocale][cat];
          return (
            <a
              key={cat}
              id={`story-${cat}`}
              href={STORY_HREF[cat]}
              className="group block scroll-mt-24 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950"
            >
              <article className="overflow-hidden">
                {/* 사진 자리 — 실제 사진 준비 전 카테고리 색 solid/gradient 블록 */}
                <div
                  className="relative aspect-[4/3] overflow-hidden rounded-2xl"
                  style={{
                    background: `linear-gradient(135deg, ${color} 0%, ${color}CC 100%)`,
                  }}
                >
                  {/* 엠블럼 M 오버레이 — 좌상단 12px 이격 */}
                  <div className="absolute left-3 top-3">
                    <Emblem
                      category={cat}
                      size="M"
                      locale={activeLocale}
                    />
                  </div>
                  {/* subtle hover lift */}
                  <div className="pointer-events-none absolute inset-0 bg-black/0 transition group-hover:bg-black/10" />
                </div>

                <div className="mt-4">
                  {/* 카테고리 레이블 — 엠블럼 색 소형 볼드 */}
                  <div
                    className="text-[11px] font-bold uppercase tracking-[0.18em]"
                    style={{ color }}
                  >
                    {ribbonLabel}
                  </div>
                  <h3 className="mt-1 text-lg font-black leading-snug tracking-[-0.02em] text-slate-950 sm:text-xl">
                    {headline}
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    {desc}
                  </p>
                </div>
              </article>
            </a>
          );
        })}
      </div>
    </section>
  );
}
