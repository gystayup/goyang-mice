// 당일코스 SSOT — 오더 #FINAL PART B [B-1] · #C16 · #C33 재편.
//
// 기준점: KINTEX (일산서구 대화동).
// 오더 #C33: 시간링(30분/1시간) → 지역 2축으로 재구성. "편도 2시간 이내" 기준.
//   · seoul-tour   (서울투어 · EAST): 서울역·명동 · 상암DMC·하늘공원 · 홍대·연남 · 강남·코엑스
//   · gyeonggi-tour (경기투어 · WEST): 파주 프리미엄아울렛 · 헤이리 · 프로방스 · 임진각·평화누리·DMZ
//
// 각 목적지: duration·transport·소개문(description) 원문 사실만. 창작·의역 금지. 5로케일 ko 폴백.
// 판매 없음 — price·booking·reservation 필드 신설 금지. "예약" 표현 0.
//
// 자산: 사진 미확보. 카테고리 컬러 gradient 로 렌더 폴백 (page 컴포넌트에서 처리).

export type DayTripLocale = "ko" | "en" | "ja" | "zh-CN" | "zh-TW";
// 오더 #C33: 시간링 값 (within-30min/within-1hour) → 지역 값 (seoul-tour/gyeonggi-tour) 로 리네임.
//   타입 이름 (DayTripRing) 은 유지 — 소비처 (DayTripsTeaserSection · /products) 시그니처 안정.
export type DayTripRing = "seoul-tour" | "gyeonggi-tour";

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
  /**
   * 오더 #C16 [PART B]: 목적지 소개문 (5로케일 · 사장님 확정 원문 · 사실만).
   * ko 폴백(A안). 창작·의역 0. 배우·포스터·대사 언급 0.
   * 오더 #C33: description 무접촉 (구조만 재편).
   */
  description: DayTripI18n;
}

export interface DayTripRingBlock {
  key: DayTripRing;
  /** 링 헤드라인 (예: "서울 투어"). 5로케일. */
  label: DayTripI18n;
  /** 링 서브라인 (예: "고양에서 편도 2시간 이내"). 5로케일. */
  subline: DayTripI18n;
  /** 링 컬러 (카드 gradient 폴백용 · Tailwind class 아닌 hex). */
  color: string;
  destinations: DayTripDestination[];
}

// ─── 목적지 원문 (destinations) ── 오더 #C33: 순서·분류만 재편, description/duration/transport 원문 무접촉.

// 서울투어 (EAST) · 4곳.
const SEOUL_DESTS: DayTripDestination[] = [
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
    description: {
      ko: "킨텍스역에서 GTX-A로 서울역까지 16분. 갈아탈 것 없이 직통. 서울역에 내리면 남대문시장·명동이 지하철 한 정거장. 서울 관광의 관문.",
      en: "킨텍스역에서 GTX-A로 서울역까지 16분. 갈아탈 것 없이 직통. 서울역에 내리면 남대문시장·명동이 지하철 한 정거장. 서울 관광의 관문.",
      ja: "킨텍스역에서 GTX-A로 서울역까지 16분. 갈아탈 것 없이 직통. 서울역에 내리면 남대문시장·명동이 지하철 한 정거장. 서울 관광의 관문.",
      "zh-CN": "킨텍스역에서 GTX-A로 서울역까지 16분. 갈아탈 것 없이 직통. 서울역에 내리면 남대문시장·명동이 지하철 한 정거장. 서울 관광의 관문.",
      "zh-TW": "킨텍스역에서 GTX-A로 서울역까지 16분. 갈아탈 것 없이 직통. 서울역에 내리면 남대문시장·명동이 지하철 한 정거장. 서울 관광의 관문.",
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
    description: {
      ko: "방송사가 모인 미디어 도시 상암과 노을 명소 하늘공원. 고양의 방송 인프라와 한강을 사이에 두고 이어지는 K-콘텐츠 벨트.",
      en: "방송사가 모인 미디어 도시 상암과 노을 명소 하늘공원. 고양의 방송 인프라와 한강을 사이에 두고 이어지는 K-콘텐츠 벨트.",
      ja: "방송사가 모인 미디어 도시 상암과 노을 명소 하늘공원. 고양의 방송 인프라와 한강을 사이에 두고 이어지는 K-콘텐츠 벨트.",
      "zh-CN": "방송사가 모인 미디어 도시 상암과 노을 명소 하늘공원. 고양의 방송 인프라와 한강을 사이에 두고 이어지는 K-콘텐츠 벨트.",
      "zh-TW": "방송사가 모인 미디어 도시 상암과 노을 명소 하늘공원. 고양의 방송 인프라와 한강을 사이에 두고 이어지는 K-콘텐츠 벨트.",
    },
  },
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
    description: {
      ko: "연신내에서 6호선·공항철도로 홍대입구. 라이브 클럽과 연남동 카페골목. 고양에서 한 시간이면 서울에서 가장 힙한 동네.",
      en: "연신내에서 6호선·공항철도로 홍대입구. 라이브 클럽과 연남동 카페골목. 고양에서 한 시간이면 서울에서 가장 힙한 동네.",
      ja: "연신내에서 6호선·공항철도로 홍대입구. 라이브 클럽과 연남동 카페골목. 고양에서 한 시간이면 서울에서 가장 힙한 동네.",
      "zh-CN": "연신내에서 6호선·공항철도로 홍대입구. 라이브 클럽과 연남동 카페골목. 고양에서 한 시간이면 서울에서 가장 힙한 동네.",
      "zh-TW": "연신내에서 6호선·공항철도로 홍대입구. 라이브 클럽과 연남동 카페골목. 고양에서 한 시간이면 서울에서 가장 힙한 동네.",
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
    description: {
      ko: "오전에 강남 코엑스 전시를 보고 GTX로 오후에 킨텍스 전시를 본다 — GTX-A가 만든 새 동선. MICE 참가자에게 강남과 킨텍스가 하루 거리.",
      en: "오전에 강남 코엑스 전시를 보고 GTX로 오후에 킨텍스 전시를 본다 — GTX-A가 만든 새 동선. MICE 참가자에게 강남과 킨텍스가 하루 거리.",
      ja: "오전에 강남 코엑스 전시를 보고 GTX로 오후에 킨텍스 전시를 본다 — GTX-A가 만든 새 동선. MICE 참가자에게 강남과 킨텍스가 하루 거리.",
      "zh-CN": "오전에 강남 코엑스 전시를 보고 GTX로 오후에 킨텍스 전시를 본다 — GTX-A가 만든 새 동선. MICE 참가자에게 강남과 킨텍스가 하루 거리.",
      "zh-TW": "오전에 강남 코엑스 전시를 보고 GTX로 오후에 킨텍스 전시를 본다 — GTX-A가 만든 새 동선. MICE 참가자에게 강남과 킨텍스가 하루 거리.",
    },
  },
];

// 경기투어 (WEST) · 4곳.
const GYEONGGI_DESTS: DayTripDestination[] = [
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
    description: {
      ko: "킨텍스에서 자유로를 따라 북서쪽. 신세계가 운영하는 대형 아웃렛. 쇼핑 후 파주 관광으로 이어지는 관문.",
      en: "킨텍스에서 자유로를 따라 북서쪽. 신세계가 운영하는 대형 아웃렛. 쇼핑 후 파주 관광으로 이어지는 관문.",
      ja: "킨텍스에서 자유로를 따라 북서쪽. 신세계가 운영하는 대형 아웃렛. 쇼핑 후 파주 관광으로 이어지는 관문.",
      "zh-CN": "킨텍스에서 자유로를 따라 북서쪽. 신세계가 운영하는 대형 아웃렛. 쇼핑 후 파주 관광으로 이어지는 관문.",
      "zh-TW": "킨텍스에서 자유로를 따라 북서쪽. 신세계가 운영하는 대형 아웃렛. 쇼핑 후 파주 관광으로 이어지는 관문.",
    },
  },
  {
    id: "heyri-art-village",
    title: {
      ko: "헤이리 예술마을",
      en: "Heyri Art Village",
      ja: "ヘイリ芸術村",
      "zh-CN": "Heyri 艺术村",
      "zh-TW": "Heyri 藝術村",
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
    description: {
      ko: "예술가들이 만든 국내 최대 예술인 마을. 갤러리·박물관·공방·카페가 낮은 건물마다. 파주 출판도시와 이어지는 책과 예술의 도시.",
      en: "예술가들이 만든 국내 최대 예술인 마을. 갤러리·박물관·공방·카페가 낮은 건물마다. 파주 출판도시와 이어지는 책과 예술의 도시.",
      ja: "예술가들이 만든 국내 최대 예술인 마을. 갤러리·박물관·공방·카페가 낮은 건물마다. 파주 출판도시와 이어지는 책과 예술의 도시.",
      "zh-CN": "예술가들이 만든 국내 최대 예술인 마을. 갤러리·박물관·공방·카페가 낮은 건물마다. 파주 출판도시와 이어지는 책과 예술의 도시.",
      "zh-TW": "예술가들이 만든 국내 최대 예술인 마을. 갤러리·박물관·공방·카페가 낮은 건물마다. 파주 출판도시와 이어지는 책과 예술의 도시.",
    },
  },
  {
    id: "provence-village",
    title: {
      ko: "프로방스 마을",
      en: "Provence Village",
      ja: "プロヴァンス村",
      "zh-CN": "普罗旺斯村",
      "zh-TW": "普羅旺斯村",
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
    description: {
      ko: "프랑스 남부를 옮겨온 듯한 테마 마을. 드라마 《별에서 온 그대》 촬영지로, 저녁이면 조명이 켜져 사진 명소가 된다.",
      en: "프랑스 남부를 옮겨온 듯한 테마 마을. 드라마 《별에서 온 그대》 촬영지로, 저녁이면 조명이 켜져 사진 명소가 된다.",
      ja: "프랑스 남부를 옮겨온 듯한 테마 마을. 드라마 《별에서 온 그대》 촬영지로, 저녁이면 조명이 켜져 사진 명소가 된다.",
      "zh-CN": "프랑스 남부를 옮겨온 듯한 테마 마을. 드라마 《별에서 온 그대》 촬영지로, 저녁이면 조명이 켜져 사진 명소가 된다.",
      "zh-TW": "프랑스 남부를 옮겨온 듯한 테마 마을. 드라마 《별에서 온 그대》 촬영지로, 저녁이면 조명이 켜져 사진 명소가 된다.",
    },
  },
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
      ko: "자유로 차량 약 1시간",
      en: "About 1 hr by car via Jayu-ro",
      ja: "自由路で車で約1時間",
      "zh-CN": "经自由路自驾约1小时",
      "zh-TW": "經自由路自駕約1小時",
    },
    transport: {
      ko: "자유로 · 자가용 접근",
      en: "Jayu-ro — by car",
      ja: "自由路・車で",
      "zh-CN": "自由路·自驾",
      "zh-TW": "自由路·自駕",
    },
    description: {
      ko: "고양에서 자유로 차량 약 1시간. 군사분계선에서 남쪽 7km, 평화의 종과 바람개비 잔디밭. 케이블카로 임진강을 건너 DMZ 전망대·제3땅굴까지. 외국인이 분단을 가장 가까이 체감하는 곳. ※일부 구역 사전 예약·여권 필요.",
      en: "고양에서 자유로 차량 약 1시간. 군사분계선에서 남쪽 7km, 평화의 종과 바람개비 잔디밭. 케이블카로 임진강을 건너 DMZ 전망대·제3땅굴까지. 외국인이 분단을 가장 가까이 체감하는 곳. ※일부 구역 사전 예약·여권 필요.",
      ja: "고양에서 자유로 차량 약 1시간. 군사분계선에서 남쪽 7km, 평화의 종과 바람개비 잔디밭. 케이블카로 임진강을 건너 DMZ 전망대·제3땅굴까지. 외국인이 분단을 가장 가까이 체감하는 곳. ※일부 구역 사전 예약·여권 필요.",
      "zh-CN": "고양에서 자유로 차량 약 1시간. 군사분계선에서 남쪽 7km, 평화의 종과 바람개비 잔디밭. 케이블카로 임진강을 건너 DMZ 전망대·제3땅굴까지. 외국인이 분단을 가장 가까이 체감하는 곳. ※일부 구역 사전 예약·여권 필요.",
      "zh-TW": "고양에서 자유로 차량 약 1시간. 군사분계선에서 남쪽 7km, 평화의 종과 바람개비 잔디밭. 케이블카로 임진강을 건너 DMZ 전망대·제3땅굴까지. 외국인이 분단을 가장 가까이 체감하는 곳. ※일부 구역 사전 예약·여권 필요.",
    },
  },
];

// ─── [서울 투어] EAST · 4곳 ─────────────────────────────────────────────────
const SEOUL_TOUR: DayTripRingBlock = {
  key: "seoul-tour",
  label: {
    ko: "서울 투어",
    en: "Seoul Tour",
    ja: "ソウルツアー",
    "zh-CN": "首尔投游",
    "zh-TW": "首爾投遊",
  },
  subline: {
    ko: "고양에서 편도 2시간 이내 · GTX·지하철 축",
    en: "Within 2 hours one way from Goyang · via GTX and metro",
    ja: "高陽から片道2時間以内 · GTX・地下鉄軸",
    "zh-CN": "从高阳单程2小时以内 · GTX与地铁轴线",
    "zh-TW": "從高陽單程2小時以內 · GTX與地鐵軸線",
  },
  color: "#0F766E",
  destinations: SEOUL_DESTS,
};

// ─── [경기 투어] WEST · 4곳 ─────────────────────────────────────────────────
const GYEONGGI_TOUR: DayTripRingBlock = {
  key: "gyeonggi-tour",
  label: {
    ko: "경기 투어",
    en: "Gyeonggi Tour",
    ja: "京畿ツアー",
    "zh-CN": "京畿投游",
    "zh-TW": "京畿投遊",
  },
  subline: {
    ko: "고양에서 편도 2시간 이내 · 자유로·파주 벨트",
    en: "Within 2 hours one way from Goyang · via Jayu-ro and the Paju belt",
    ja: "高陽から片道2時間以内 · 自由路・坡州ベルト",
    "zh-CN": "从高阳单程2小时以内 · 自由路与坡州文化带",
    "zh-TW": "從高陽單程2小時以內 · 自由路與坡州文化帶",
  },
  color: "#DB2777",
  destinations: GYEONGGI_DESTS,
};

// 오더 #C33: 지역 2축 배열.
export const dayTripRings: DayTripRingBlock[] = [SEOUL_TOUR, GYEONGGI_TOUR];

/** 페이지 헤더 문안 (5로케일). 오더 #C33: 서울·경기 2축 · 편도 2시간 이내. */
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
    ko: "고양에서 2시간, 서울과 경기",
    en: "Two hours from Goyang — Seoul and Gyeonggi",
    ja: "高陽から2時間、ソウルと京畿",
    "zh-CN": "从高阳出发2小时，首尔与京畿",
    "zh-TW": "從高陽出發2小時，首爾與京畿",
  },
  subtitle: {
    ko: "고양에서 편도 2시간 이내, 서울과 경기 당일 여행",
    en: "Day trips into Seoul and Gyeonggi within a 2-hour ride from Goyang",
    ja: "高陽から片道2時間以内、ソウルと京畿の日帰り旅行",
    "zh-CN": "从高阳单程2小时以内，首尔与京畿的一日游",
    "zh-TW": "從高陽單程2小時以內，首爾與京畿的一日遊",
  },
  anchorLabel: {
    ko: "기준점: KINTEX (일산서구 대화동)",
    en: "Anchor: KINTEX (Daehwa-dong, Ilsan-seo)",
    ja: "基準点: KINTEX (一山西区 大化洞)",
    "zh-CN": "基准点: KINTEX (一山西区 大化洞)",
    "zh-TW": "基準點: KINTEX (一山西區 大化洞)",
  },
};
