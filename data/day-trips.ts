// 시간대 여행(당일코스) SSOT — 오더 #FINAL PART B [B-1].
//
// 기준점: KINTEX (일산서구 대화동).
// 링 3개: 30분 이내 / 1시간 이내 / 2시간 이내.
// 각 목적지: 소요시간·교통수단 사실만. 창작·의역 금지. 5로케일 ko 폴백.
// 판매 없음 — price·booking·reservation 필드 신설 금지. "예약" 표현 0.
//
// 자산: 사진 미확보. 카테고리 컬러 gradient 로 렌더 폴백 (page 컴포넌트에서 처리).

export type DayTripLocale = "ko" | "en" | "ja" | "zh-CN" | "zh-TW";
export type DayTripRing = "within-30min" | "within-1hour" | "within-2hour";

export type DayTripI18n = Record<DayTripLocale, string>;

export interface DayTripDestination {
  /** URL 참조용 kebab-case (아직 상세 라우트 없음 · 후속 오더 대비 예약). */
  id: string;
  /** 목적지명 5로케일 (한글은 원문 그대로, 다국어는 사장님 승인 표기). */
  title: DayTripI18n;
  /** 짧은 지역 라벨 (예: "서울", "파주") 5로케일. */
  region: DayTripI18n;
  /** 소요 시간 사실 (예: "약 16–17분"). 5로케일 · 숫자·단위만. */
  duration: DayTripI18n;
  /** 교통수단 사실 (예: "GTX-A 킨텍스역 → 서울역"). 5로케일. */
  transport: DayTripI18n;
}

export interface DayTripRingBlock {
  key: DayTripRing;
  /** 링 헤드라인 (예: "30분 이내"). 5로케일. */
  label: DayTripI18n;
  /** 링 서브라인 (예: "지하철·GTX 생활권"). 5로케일. */
  subline: DayTripI18n;
  /** 링 컬러 (카드 gradient 폴백용 · Tailwind class 아닌 hex). */
  color: string;
  destinations: DayTripDestination[];
}

// ─── [30분 이내] · 서울역·명동 · 상암DMC·하늘공원 · 파주 프리미엄아울렛 ─────
const RING_30MIN: DayTripRingBlock = {
  key: "within-30min",
  label: {
    ko: "30분 이내",
    en: "Within 30 min",
    ja: "30分以内",
    "zh-CN": "30分钟以内",
    "zh-TW": "30分鐘以內",
  },
  subline: {
    ko: "GTX·자유로 · 킨텍스에서 곧장 닿는 거리",
    en: "GTX and Jayu-ro — straight from KINTEX",
    ja: "GTX・自由路 — KINTEXからすぐ",
    "zh-CN": "GTX与自由路 — KINTEX直达",
    "zh-TW": "GTX與自由路 — KINTEX直達",
  },
  color: "#0F766E",
  destinations: [
    {
      id: "seoul-station-myeongdong",
      title: {
        ko: "서울역·명동",
        en: "Seoul Station · Myeongdong",
        ja: "ソウル駅・明洞",
        "zh-CN": "首尔站·明洞",
        "zh-TW": "首爾站·明洞",
      },
      region: { ko: "서울", en: "Seoul", ja: "ソウル", "zh-CN": "首尔", "zh-TW": "首爾" },
      duration: {
        ko: "약 16–17분",
        en: "About 16–17 min",
        ja: "約16–17分",
        "zh-CN": "约16–17分钟",
        "zh-TW": "約16–17分鐘",
      },
      transport: {
        ko: "GTX-A 킨텍스역 → 서울역",
        en: "GTX-A Kintex Stn. → Seoul Stn.",
        ja: "GTX-A キンテックス駅 → ソウル駅",
        "zh-CN": "GTX-A 韩国国际展览中心站 → 首尔站",
        "zh-TW": "GTX-A 韓國國際展覽中心站 → 首爾站",
      },
    },
    {
      id: "sangam-dmc-haneul-park",
      title: {
        ko: "상암 DMC·하늘공원",
        en: "Sangam DMC · Haneul Park",
        ja: "上岩DMC·空公園",
        "zh-CN": "上岩DMC·天空公园",
        "zh-TW": "上岩DMC·天空公園",
      },
      region: { ko: "서울", en: "Seoul", ja: "ソウル", "zh-CN": "首尔", "zh-TW": "首爾" },
      duration: {
        ko: "지하철권 30분대",
        en: "Around 30 min by metro",
        ja: "地下鉄で30分台",
        "zh-CN": "地铁30分钟左右",
        "zh-TW": "地鐵30分鐘左右",
      },
      transport: {
        ko: "지하철 · 버스 연계",
        en: "Metro and bus",
        ja: "地下鉄・バス連携",
        "zh-CN": "地铁·公交衔接",
        "zh-TW": "地鐵·公車銜接",
      },
    },
    {
      id: "paju-premium-outlets-shinsegae",
      title: {
        ko: "파주 프리미엄아울렛(신세계)",
        en: "Paju Premium Outlets (Shinsegae)",
        ja: "新世界プレミアムアウトレット坡州",
        "zh-CN": "坡州新世界高级奥特莱斯",
        "zh-TW": "坡州新世界高級名品購物中心",
      },
      region: { ko: "파주", en: "Paju", ja: "坡州", "zh-CN": "坡州", "zh-TW": "坡州" },
      duration: {
        ko: "자유로로 30분대",
        en: "Around 30 min via Jayu-ro",
        ja: "自由路で30分台",
        "zh-CN": "经自由路约30分钟",
        "zh-TW": "經自由路約30分鐘",
      },
      transport: {
        ko: "자유로 인접 · 자가용 접근 우수",
        en: "Right off Jayu-ro — easy by car",
        ja: "自由路に隣接・車で便利",
        "zh-CN": "紧邻自由路·自驾便利",
        "zh-TW": "緊鄰自由路·自駕便利",
      },
    },
  ],
};

// ─── [1시간 이내] · 홍대·연남 · 강남·코엑스 · 헤이리·프로방스 · 롯데아울렛 파주 ──
const RING_1HOUR: DayTripRingBlock = {
  key: "within-1hour",
  label: {
    ko: "1시간 이내",
    en: "Within 1 hour",
    ja: "1時間以内",
    "zh-CN": "1小时以内",
    "zh-TW": "1小時以內",
  },
  subline: {
    ko: "GTX 서울 도심 · 파주 문화 벨트",
    en: "GTX into Seoul · Paju's culture belt",
    ja: "GTXでソウル都心・坡州の文化ベルト",
    "zh-CN": "GTX进首尔市中心·坡州文化带",
    "zh-TW": "GTX進首爾市中心·坡州文化帶",
  },
  color: "#DB2777",
  destinations: [
    {
      id: "hongdae-yeonnam",
      title: {
        ko: "홍대·연남",
        en: "Hongdae · Yeonnam",
        ja: "弘大·延南",
        "zh-CN": "弘大·延南",
        "zh-TW": "弘大·延南",
      },
      region: { ko: "서울", en: "Seoul", ja: "ソウル", "zh-CN": "首尔", "zh-TW": "首爾" },
      duration: {
        ko: "GTX + 환승 1시간대",
        en: "About 1 hr with GTX + transfer",
        ja: "GTX+乗換で1時間台",
        "zh-CN": "GTX加换乘约1小时",
        "zh-TW": "GTX加轉乘約1小時",
      },
      transport: {
        ko: "GTX-A → 서울역 경유 지하철 환승",
        en: "GTX-A to Seoul Stn., then metro transfer",
        ja: "GTX-A → ソウル駅で乗換",
        "zh-CN": "GTX-A→首尔站换乘地铁",
        "zh-TW": "GTX-A→首爾站轉乘地鐵",
      },
    },
    {
      id: "gangnam-coex",
      title: {
        ko: "강남·코엑스",
        en: "Gangnam · COEX",
        ja: "江南·COEX",
        "zh-CN": "江南·COEX",
        "zh-TW": "江南·COEX",
      },
      region: { ko: "서울", en: "Seoul", ja: "ソウル", "zh-CN": "首尔", "zh-TW": "首爾" },
      duration: {
        ko: "GTX 생활권 1시간대",
        en: "About 1 hr within GTX reach",
        ja: "GTX圏で1時間台",
        "zh-CN": "GTX生活圈约1小时",
        "zh-TW": "GTX生活圈約1小時",
      },
      transport: {
        ko: "GTX-A · 오전 코엑스 → 오후 킨텍스 이동 가능",
        en: "GTX-A — a morning at COEX and an afternoon at KINTEX is doable",
        ja: "GTX-A · 午前COEX→午後KINTEX の移動が可能",
        "zh-CN": "GTX-A·上午COEX→下午KINTEX 可完成",
        "zh-TW": "GTX-A·上午COEX→下午KINTEX 可完成",
      },
    },
    {
      id: "heyri-provence",
      title: {
        ko: "헤이리 예술마을·프로방스",
        en: "Heyri Art Village · Provence",
        ja: "ヘイリ芸術村·プロヴァンス",
        "zh-CN": "Heyri艺术村·普罗旺斯",
        "zh-TW": "Heyri藝術村·普羅旺斯",
      },
      region: { ko: "파주", en: "Paju", ja: "坡州", "zh-CN": "坡州", "zh-TW": "坡州" },
      duration: {
        ko: "자유로로 1시간 내외",
        en: "About 1 hr via Jayu-ro",
        ja: "自由路で1時間前後",
        "zh-CN": "经自由路约1小时",
        "zh-TW": "經自由路約1小時",
      },
      transport: {
        ko: "자유로 · 자가용 접근",
        en: "Jayu-ro — by car",
        ja: "自由路・車で",
        "zh-CN": "自由路·自驾",
        "zh-TW": "自由路·自駕",
      },
    },
    {
      id: "lotte-premium-outlets-paju",
      title: {
        ko: "롯데프리미엄아울렛 파주",
        en: "Lotte Premium Outlets Paju",
        ja: "ロッテプレミアムアウトレット坡州",
        "zh-CN": "乐天高级奥特莱斯坡州",
        "zh-TW": "樂天高級名品購物中心坡州",
      },
      region: { ko: "파주", en: "Paju", ja: "坡州", "zh-CN": "坡州", "zh-TW": "坡州" },
      duration: {
        ko: "마을버스 약 10분",
        en: "About 10 min by community bus",
        ja: "コミュニティバスで約10分",
        "zh-CN": "村庄巴士约10分钟",
        "zh-TW": "社區巴士約10分鐘",
      },
      transport: {
        ko: "GTX-A 운정중앙역 1번 출구 → 마을버스 81번",
        en: "GTX-A Unjeong-jungang Stn. Exit 1 → Village Bus 81",
        ja: "GTX-A 雲井中央駅1番出口 → コミュニティバス81番",
        "zh-CN": "GTX-A 云井中央站1号出口 → 村庄巴士81路",
        "zh-TW": "GTX-A 雲井中央站1號出口 → 社區巴士81路",
      },
    },
  ],
};

// ─── [2시간 이내] · 임진각·평화누리·DMZ ─────────────────────────────────
const RING_2HOUR: DayTripRingBlock = {
  key: "within-2hour",
  label: {
    ko: "2시간 이내",
    en: "Within 2 hours",
    ja: "2時間以内",
    "zh-CN": "2小时以内",
    "zh-TW": "2小時以內",
  },
  subline: {
    ko: "파주 최북단 · DMZ 접경",
    en: "Northernmost Paju — the DMZ frontier",
    ja: "坡州最北・DMZ接境",
    "zh-CN": "坡州最北端·DMZ接境",
    "zh-TW": "坡州最北端·DMZ接境",
  },
  color: "#312E81",
  destinations: [
    {
      id: "imjingak-peace-nuri-dmz",
      title: {
        ko: "임진각·평화누리·DMZ",
        en: "Imjingak · Peace Nuri · DMZ",
        ja: "臨津閣·平和ヌリ·DMZ",
        "zh-CN": "临津阁·平和努里·DMZ",
        "zh-TW": "臨津閣·平和努里·DMZ",
      },
      region: { ko: "파주", en: "Paju", ja: "坡州", "zh-CN": "坡州", "zh-TW": "坡州" },
      duration: {
        ko: "자유로 최북단 · 2시간 이내",
        en: "Within 2 hrs — northern end of Jayu-ro",
        ja: "自由路の最北端・2時間以内",
        "zh-CN": "自由路最北端·2小时以内",
        "zh-TW": "自由路最北端·2小時以內",
      },
      transport: {
        ko: "자유로 최북단 · 자가용 접근",
        en: "Northern end of Jayu-ro — by car",
        ja: "自由路最北端・車で",
        "zh-CN": "自由路最北端·自驾",
        "zh-TW": "自由路最北端·自駕",
      },
    },
  ],
};

export const dayTripRings: DayTripRingBlock[] = [RING_30MIN, RING_1HOUR, RING_2HOUR];

/** 페이지 헤더 문안 (5로케일). 사장님 명시 라벨 · 부제 그대로. */
export const DAY_TRIPS_PAGE_COPY: {
  eyebrow: DayTripI18n;
  title: DayTripI18n;
  subtitle: DayTripI18n;
  anchorLabel: DayTripI18n;
} = {
  eyebrow: {
    ko: "GOYANG DAY TRIPS",
    en: "GOYANG DAY TRIPS",
    ja: "GOYANG DAY TRIPS",
    "zh-CN": "GOYANG DAY TRIPS",
    "zh-TW": "GOYANG DAY TRIPS",
  },
  title: {
    ko: "당일코스",
    en: "DAY TRIPS",
    ja: "日帰り旅行",
    "zh-CN": "一日游",
    "zh-TW": "一日遊",
  },
  subtitle: {
    ko: "고양에서 30분–1시간, 서울과 파주",
    en: "30 min – 1 hour from Goyang — into Seoul and Paju",
    ja: "高陽から30分〜1時間、ソウルと坡州",
    "zh-CN": "从高阳出发30分钟至1小时，前往首尔与坡州",
    "zh-TW": "從高陽出發30分鐘至1小時，前往首爾與坡州",
  },
  anchorLabel: {
    ko: "기준점: KINTEX (일산서구 대화동)",
    en: "Anchor: KINTEX (Daehwa-dong, Ilsan-seo)",
    ja: "基準点: KINTEX (一山西区 大化洞)",
    "zh-CN": "基准点: KINTEX (一山西区 大化洞)",
    "zh-TW": "基準點: KINTEX (一山西區 大化洞)",
  },
};
