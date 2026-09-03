// data/home-copy.ts — 오더 #C14b 홈 개편 5로케일 카피 SSOT.
//
// 신규 홈 컴포넌트가 소비:
//   · HeroDiscoverSection   — 초대형 헤드라인 + 서브 + 검색바 placeholder + 신뢰배너 3칸
//   · MustSeeSection        — 섹션 헤드라인 + 4카드 캡션 (spots.title/subtitle 재사용, 캡션만 여기)
//   · BestGridEntrySection  — 섹션 헤드라인 + 서브 (엠블럼 라벨은 CATEGORY_LABEL 재사용)
//   · DayTripsTeaserSection — 섹션 헤드라인 + 서브 + CTA (data/day-trips.ts 재사용)
//   · WhatsOnCalendarSection — 섹션 헤드라인 + 날짜바 라벨 · 빈 상태 문구
//
// 규범:
//   · 5로케일 ko 폴백(A안). 신규 카피는 5로케일 완비.
//   · 판매 소구어 0. 소개형 유지 · 가격·예약·"예약" 표현 0.
//   · 스탬프 배지 라벨은 영문 공통(브랜드 스탬프 성격) → 여기가 아니라 StampBadge 자체 상수.

export type HomeLocale = "ko" | "en" | "ja" | "zh-CN" | "zh-TW";
export const HOME_LOCALES: HomeLocale[] = ["ko", "en", "ja", "zh-CN", "zh-TW"];

export type HomeI18n = Record<HomeLocale, string>;

// ─── Hero · Discover GOYANG ─────────────────────────────────────────────
export const HERO_DISCOVER = {
  headline: {
    ko: "고양을 발견하다",
    en: "Discover GOYANG",
    ja: "高陽を発見する",
    "zh-CN": "发现高阳",
    "zh-TW": "發現高陽",
  } as HomeI18n,
  subhead: {
    ko: "GTX 16분 · 유네스코 세계유산 · K-POP 성지",
    en: "GTX 16 min · UNESCO World Heritage · K-POP heartland",
    ja: "GTX 16分 · ユネスコ世界遺産 · K-POPの聖地",
    "zh-CN": "GTX 16分钟 · 联合国教科文组织世界遗产 · K-POP 圣地",
    "zh-TW": "GTX 16分鐘 · 聯合國教科文組織世界遺產 · K-POP 聖地",
  } as HomeI18n,
  searchPlaceholder: {
    ko: "어디로 가시나요? (예: 서오릉, 스타필드, 킨텍스)",
    en: "Where would you like to go? (e.g., Seooreung, Starfield, KINTEX)",
    ja: "どこへ行きますか? (例: 西五陵、スターフィールド、KINTEX)",
    "zh-CN": "您想去哪里？(例：西五陵、Starfield、KINTEX)",
    "zh-TW": "您想去哪裡？(例：西五陵、Starfield、KINTEX)",
  } as HomeI18n,
  searchAriaLabel: {
    ko: "고양 스팟 검색",
    en: "Search Goyang spots",
    ja: "高陽スポット検索",
    "zh-CN": "搜索高阳景点",
    "zh-TW": "搜尋高陽景點",
  } as HomeI18n,
  trustBanner: [
    {
      // GTX-A · 킨텍스역 → 서울역 실측 (2024 개통, 약 16분).
      title: {
        ko: "GTX-A 16분",
        en: "GTX-A · 16 min",
        ja: "GTX-A 16分",
        "zh-CN": "GTX-A · 16分钟",
        "zh-TW": "GTX-A · 16分鐘",
      } as HomeI18n,
      desc: {
        ko: "킨텍스역에서 서울역까지 최단 16분",
        en: "Kintex to Seoul Station in as little as 16 minutes",
        ja: "キンテックス駅からソウル駅まで最短16分",
        "zh-CN": "KINTEX 站至首尔站最短仅需 16 分钟",
        "zh-TW": "KINTEX 站至首爾站最短僅需 16 分鐘",
      } as HomeI18n,
    },
    {
      // UNESCO 조선왕릉 (2009 등재) · Netflix 「미스터 퀸」·「킹덤」 등 K-드라마.
      title: {
        ko: "UNESCO × Netflix",
        en: "UNESCO × Netflix",
        ja: "UNESCO × Netflix",
        "zh-CN": "UNESCO × Netflix",
        "zh-TW": "UNESCO × Netflix",
      } as HomeI18n,
      desc: {
        ko: "유네스코 세계유산 조선왕릉 · 넷플릭스 K-드라마의 무대",
        en: "UNESCO royal tombs · the stage of Netflix K-dramas",
        ja: "ユネスコ世界遺産 朝鮮王陵 · Netflix K-ドラマの舞台",
        "zh-CN": "联合国教科文组织朝鲜王陵 · Netflix 韩剧舞台",
        "zh-TW": "聯合國教科文組織朝鮮王陵 · Netflix 韓劇舞台",
      } as HomeI18n,
    },
    {
      // 한류·MICE 특구 · 킨텍스 · 한류월드 · 고양종합운동장 K-POP 공연.
      title: {
        ko: "한류·MICE 특구",
        en: "K-Wave × MICE district",
        ja: "韓流·MICE特区",
        "zh-CN": "韩流·MICE 特区",
        "zh-TW": "韓流·MICE 特區",
      } as HomeI18n,
      desc: {
        ko: "킨텍스 · 한류월드 · K-POP 스타디움 공연 거점",
        en: "KINTEX · Hallyu World · K-POP stadium concerts",
        ja: "キンテックス · 韓流ワールド · K-POPスタジアム公演拠点",
        "zh-CN": "KINTEX · 韩流世界 · K-POP 体育场演出据点",
        "zh-TW": "KINTEX · 韓流世界 · K-POP 體育場演出據點",
      } as HomeI18n,
    },
  ],
};

// ─── Must-see Section ────────────────────────────────────────────────────
export const MUST_SEE = {
  eyebrow: "MUST-SEE IN GOYANG", // 5로케일 공통 영문 브랜드 라벨
  headline: {
    ko: "고양에서 반드시 봐야 할 4곳",
    en: "Four essential stops in Goyang",
    ja: "高陽で必ず見るべき4か所",
    "zh-CN": "高阳必访 4 处",
    "zh-TW": "高陽必訪 4 處",
  } as HomeI18n,
};

// ─── Best 9 카테고리 진입 ────────────────────────────────────────────────
export const BEST_ENTRY = {
  eyebrow: "GOYANG BEST", // 5로케일 공통 영문
  headline: {
    ko: "테마별로 골라보다",
    en: "Choose by theme",
    ja: "テーマ別に選ぶ",
    "zh-CN": "按主题选择",
    "zh-TW": "按主題選擇",
  } as HomeI18n,
  subhead: {
    ko: "9가지 카테고리로 정리한 고양일산 여행 축",
    en: "Nine curated categories across Goyang-Ilsan",
    ja: "9つのカテゴリーで整理した高陽・一山の旅の軸",
    "zh-CN": "以 9 大主题梳理的高阳·一山旅程",
    "zh-TW": "以 9 大主題梳理的高陽·一山旅程",
  } as HomeI18n,
};

// ─── 당일코스 teaser ─────────────────────────────────────────────────────
export const DAYTRIPS_TEASER = {
  eyebrow: "DAY TRIPS", // 5로케일 공통 영문
  headline: {
    ko: "고양에서 30분–2시간",
    en: "30 minutes to 2 hours from Goyang",
    ja: "高陽から30分〜2時間",
    "zh-CN": "从高阳出发 30 分钟至 2 小时",
    "zh-TW": "從高陽出發 30 分鐘至 2 小時",
  } as HomeI18n,
  subhead: {
    ko: "GTX·자유로로 이어지는 서울·파주 당일 여행 축",
    en: "Day-trip axes into Seoul and Paju via GTX and Jayu-ro",
    ja: "GTX・自由路でつながるソウル・坡州の日帰り軸",
    "zh-CN": "以 GTX 与自由路串联的首尔·坡州一日游轴线",
    "zh-TW": "以 GTX 與自由路串聯的首爾·坡州一日遊軸線",
  } as HomeI18n,
  cta: {
    ko: "당일코스 전체 보기 →",
    en: "See all day trips →",
    ja: "日帰り旅行をすべて見る →",
    "zh-CN": "查看全部一日游 →",
    "zh-TW": "查看全部一日遊 →",
  } as HomeI18n,
};

// ─── WHAT'S ON 날짜 바 ───────────────────────────────────────────────────
export const WHATSON_CAL = {
  eyebrow: "WHAT'S ON", // 5로케일 공통 영문
  headline: {
    ko: "날짜별 일정",
    en: "By date",
    ja: "日付別スケジュール",
    "zh-CN": "按日期查看",
    "zh-TW": "按日期查看",
  } as HomeI18n,
  subhead: {
    ko: "오늘부터 30일 · 공연·축제·전시를 하루 단위로",
    en: "Next 30 days · concerts, festivals, exhibitions by the day",
    ja: "本日から30日 · 公演·祭り·展示を1日単位で",
    "zh-CN": "今日起 30 天 · 按天查看演出·节庆·展览",
    "zh-TW": "今日起 30 天 · 按天查看演出·節慶·展覽",
  } as HomeI18n,
  emptyDate: {
    ko: "이 날 예정된 행사가 없습니다.",
    en: "No events scheduled for this day.",
    ja: "この日の予定はありません。",
    "zh-CN": "当日暂无活动。",
    "zh-TW": "當日暫無活動。",
  } as HomeI18n,
  weekdayShort: {
    // Sun-first order matching Date.getDay().
    ko: ["일", "월", "화", "수", "목", "금", "토"],
    en: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    ja: ["日", "月", "火", "水", "木", "金", "土"],
    "zh-CN": ["日", "一", "二", "三", "四", "五", "六"],
    "zh-TW": ["日", "一", "二", "三", "四", "五", "六"],
  } as Record<HomeLocale, string[]>,
  prevLabel: {
    ko: "이전 주",
    en: "Previous week",
    ja: "前の週",
    "zh-CN": "上一周",
    "zh-TW": "上一週",
  } as HomeI18n,
  nextLabel: {
    ko: "다음 주",
    en: "Next week",
    ja: "翌週",
    "zh-CN": "下一周",
    "zh-TW": "下一週",
  } as HomeI18n,
  todayLabel: {
    ko: "오늘",
    en: "Today",
    ja: "本日",
    "zh-CN": "今日",
    "zh-TW": "今日",
  } as HomeI18n,
};

export function pickHomeLocale(locale: string): HomeLocale {
  return HOME_LOCALES.includes(locale as HomeLocale)
    ? (locale as HomeLocale)
    : "ko";
}
