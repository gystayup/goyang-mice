// data/dmc-move.ts
// GOYANG MOVE — 오는 길(IN) 데이터 (오더 #A4).
//
// 원문: /move-data-in.md — 이 파일은 원문의 스키마 이관본.
// "임의 수정·의역 금지 · 표에 없는 값 생성 금지 · 「확인필요」 항목은
// 렌더하지 말고 필드를 비워둘 것" (원문 3~4행).
//
// 정거장명은 원문이 한국어만 제공하므로 5로케일 모두 한국어 원문 그대로
// 노출한다 (문자열 하나). 구간 아래 노선명도 원문 한국어만 존재 → 동일.

export type MoveLocale = "ko" | "en" | "ja" | "zh-CN" | "zh-TW";
export const MOVE_LOCALES: MoveLocale[] = [
  "ko",
  "en",
  "ja",
  "zh-CN",
  "zh-TW",
];

export type I18nText = Record<MoveLocale, string>;

/** 노선 색상 코드 (원문 「노선 색상 코드」 그대로). */
export const LINE_COLORS = {
  airportBus: "#D4AF37",
  arex: "#378ADD",
  seohae: "#1D9E75",
  line3: "#BA7517",
  gyeongui: "#1D9E75",
  gtxA: "#7F77DD",
  line2: "#639922",
} as const;

/** 정거장 마커 종류. */
export type StationVariant = "endpoint" | "transit" | "transfer";

export interface DiagramStation {
  /** 정거장 한국어명 (5로케일 모두 한국어 원문 그대로 노출). */
  name: string;
  variant: StationVariant;
  /**
   * 이 정거장으로 들어오는 세그먼트 색.
   * 첫 정거장은 undefined (선행 세그먼트 없음).
   */
  incomingColor?: string;
  /**
   * 구간 아래 노선명 (한국어 원문). 색이 바뀌는 첫 구간에서만 표기.
   */
  incomingLineName?: string;
}

export interface LineDiagramData {
  stations: DiagramStation[];
}

export interface InfoRow {
  label: I18nText;
  /** null 이면 「확인필요」 · 원문 규칙 3에 따라 행 자체 렌더 생략. */
  value: I18nText | null;
}

export interface KoCard {
  label: I18nText;
  /** 5로케일 모두 한국어 원문 그대로 표시 (원문 규칙 4). */
  sentenceKo: string;
}

export interface Method {
  id: string;
  title: I18nText;
  /** 권장 · 가장 빠름 · 직결 등. */
  badge?: I18nText;
  /** 지역/한줄 요약. */
  region?: I18nText;
  diagram?: LineDiagramData;
  /** 값이 null 인 row 는 렌더 생략. */
  infoRows?: InfoRow[];
  notice?: I18nText;
  note?: I18nText;
  /** 이미지 파일 경로. 파일이 없으면 컴포넌트 측에서 렌더 생략. */
  imageSlot?: string;
  koCard?: KoCard;
}

export type TabKey = "incheon" | "gimpo" | "seoul" | "metro" | "other";

export interface MoveTab {
  key: TabKey;
  label: I18nText;
  intro?: I18nText;
  methods: Method[];
}

/**
 * 오더 #A5 [4] · move-data-out.md D1~D3.
 * IN 데이터와 달리 각 노선도에 별도 제목·비고가 붙는다.
 * 소스 헤더가 한국어만 제공하므로 5로케일 모두 한국어 원문 그대로 (transit
 * 관례 · 임의 번역 금지).
 */
export interface OutDiagram {
  id: string;
  titleKo: string;
  diagram: LineDiagramData;
  note: I18nText;
}

export interface Destination {
  id: string;
  name: I18nText;
  duration: I18nText;
  route: I18nText;
}

export interface DmcMoveData {
  header: {
    eyebrow: string;
    title: I18nText;
    lead: I18nText;
  };
  /** 오더 #A5 [1] 방향 토글 라벨 (5로케일). */
  directions: {
    in: I18nText;
    out: I18nText;
  };
  /** IN 탭들 (기존 #A4). */
  tabs: MoveTab[];
  /** OUT 콘텐츠 (신설 #A5). */
  out: {
    lead: I18nText;
    destinations: Destination[];
    diagrams: OutDiagram[];
    koCard: KoCard;
  };
}

// ─── 재사용 문구 ────────────────────────────────────────────────────────────

/** 1-1 · 1-3 공통 요금 문안 (원문 명시). */
const FARE_ROW: InfoRow = {
  label: {
    ko: "요금",
    en: "Fare",
    ja: "運賃",
    "zh-CN": "票价",
    "zh-TW": "票價",
  },
  value: {
    ko: "현금 9,000원 · 카드 8,500원",
    en: "Cash 9,000 / Card 8,500 KRW",
    ja: "現金9,000ウォン・カード8,500ウォン",
    "zh-CN": "现金9,000韩元·刷卡8,500韩元",
    "zh-TW": "現金9,000韓元·刷卡8,500韓元",
  },
};

/** 1-1 · 2-3 공통 한국어 원문 카드 라벨 (원문: "1-1과 동일"). */
const DRIVER_LABEL: I18nText = {
  ko: "기사님께 보여주세요",
  en: "Show this to the driver",
  ja: "運転手にお見せください",
  "zh-CN": "请出示给司机",
  "zh-TW": "請出示給司機",
};

// ─── 노선도 데이터 ──────────────────────────────────────────────────────────

const DIAGRAM_1_1: LineDiagramData = {
  stations: [
    { name: "인천공항 T1·T2", variant: "endpoint" },
    { name: "백석", variant: "transit", incomingColor: LINE_COLORS.airportBus },
    { name: "마두역", variant: "transit", incomingColor: LINE_COLORS.airportBus },
    { name: "일산동구청", variant: "transit", incomingColor: LINE_COLORS.airportBus },
    { name: "주엽역", variant: "transit", incomingColor: LINE_COLORS.airportBus },
    { name: "대화동", variant: "endpoint", incomingColor: LINE_COLORS.airportBus },
  ],
};

const DIAGRAM_1_2: LineDiagramData = {
  stations: [
    { name: "인천공항", variant: "endpoint" },
    { name: "킨텍스", variant: "transit", incomingColor: LINE_COLORS.airportBus },
    { name: "소노캄호텔", variant: "endpoint", incomingColor: LINE_COLORS.airportBus },
  ],
};

const DIAGRAM_1_3: LineDiagramData = {
  stations: [
    { name: "인천공항 T1·T2", variant: "endpoint" },
    { name: "행신", variant: "transit", incomingColor: LINE_COLORS.airportBus },
    { name: "능곡·화정", variant: "transit", incomingColor: LINE_COLORS.airportBus },
    { name: "성사고등학교", variant: "endpoint", incomingColor: LINE_COLORS.airportBus },
  ],
};

const DIAGRAM_1_4: LineDiagramData = {
  stations: [
    { name: "인천공항 T1·T2", variant: "endpoint" },
    { name: "행신", variant: "transit", incomingColor: LINE_COLORS.airportBus },
    { name: "화정·원당", variant: "transit", incomingColor: LINE_COLORS.airportBus },
    { name: "식사동", variant: "endpoint", incomingColor: LINE_COLORS.airportBus },
  ],
};

const DIAGRAM_1_5: LineDiagramData = {
  stations: [
    { name: "인천공항", variant: "endpoint" },
    { name: "원흥", variant: "transit", incomingColor: LINE_COLORS.airportBus },
    { name: "삼송·지축", variant: "transit", incomingColor: LINE_COLORS.airportBus },
    { name: "고양동", variant: "endpoint", incomingColor: LINE_COLORS.airportBus },
  ],
};

const DIAGRAM_1_6: LineDiagramData = {
  stations: [
    { name: "인천공항", variant: "endpoint" },
    {
      name: "김포공항",
      variant: "transfer",
      incomingColor: LINE_COLORS.arex,
      incomingLineName: "공항철도",
    },
    {
      name: "대곡",
      variant: "transfer",
      incomingColor: LINE_COLORS.seohae,
      incomingLineName: "서해선",
    },
    {
      name: "대화역",
      variant: "endpoint",
      incomingColor: LINE_COLORS.line3,
      incomingLineName: "3호선",
    },
  ],
};

const DIAGRAM_2_1: LineDiagramData = {
  stations: [
    { name: "김포공항", variant: "endpoint" },
    {
      name: "대곡",
      variant: "transfer",
      incomingColor: LINE_COLORS.seohae,
      incomingLineName: "서해선",
    },
    {
      name: "대화역",
      variant: "endpoint",
      incomingColor: LINE_COLORS.line3,
      incomingLineName: "3호선",
    },
  ],
};

const DIAGRAM_3_1: LineDiagramData = {
  stations: [
    { name: "서울역", variant: "endpoint" },
    { name: "연신내", variant: "transit", incomingColor: LINE_COLORS.gtxA },
    { name: "대곡", variant: "transit", incomingColor: LINE_COLORS.gtxA },
    { name: "킨텍스역", variant: "endpoint", incomingColor: LINE_COLORS.gtxA },
  ],
};

const DIAGRAM_4_1: LineDiagramData = {
  stations: [
    { name: "종로3가", variant: "endpoint" },
    { name: "경복궁", variant: "transit", incomingColor: LINE_COLORS.line3 },
    { name: "연신내", variant: "transit", incomingColor: LINE_COLORS.line3 },
    { name: "대곡", variant: "transit", incomingColor: LINE_COLORS.line3 },
    { name: "주엽", variant: "transit", incomingColor: LINE_COLORS.line3 },
    { name: "대화역", variant: "endpoint", incomingColor: LINE_COLORS.line3 },
  ],
};

const DIAGRAM_4_2: LineDiagramData = {
  stations: [
    { name: "홍대입구", variant: "endpoint" },
    { name: "디지털미디어시티", variant: "transit", incomingColor: LINE_COLORS.gyeongui },
    { name: "행신", variant: "transit", incomingColor: LINE_COLORS.gyeongui },
    { name: "일산역", variant: "endpoint", incomingColor: LINE_COLORS.gyeongui },
  ],
};

// ─── 데이터 본체 ────────────────────────────────────────────────────────────

// ─── OUT 노선도 데이터 (오더 #A5 [4]) ──────────────────────────────────────

const OUT_DIAGRAM_D1: LineDiagramData = {
  stations: [
    { name: "대화역", variant: "endpoint" },
    { name: "대곡", variant: "transit", incomingColor: LINE_COLORS.line3 },
    { name: "연신내 30분", variant: "transit", incomingColor: LINE_COLORS.line3 },
    { name: "경복궁 40분", variant: "transit", incomingColor: LINE_COLORS.line3 },
    { name: "종로3가 45분", variant: "transit", incomingColor: LINE_COLORS.line3 },
    { name: "강남 60분", variant: "endpoint", incomingColor: LINE_COLORS.line3 },
  ],
};

const OUT_DIAGRAM_D2: LineDiagramData = {
  stations: [
    { name: "킨텍스역", variant: "endpoint" },
    { name: "연신내", variant: "transit", incomingColor: LINE_COLORS.gtxA },
    { name: "서울역 20분", variant: "endpoint", incomingColor: LINE_COLORS.gtxA },
  ],
};

const OUT_DIAGRAM_D3: LineDiagramData = {
  stations: [
    { name: "일산역", variant: "endpoint" },
    {
      name: "홍대입구 20분",
      variant: "transfer",
      incomingColor: LINE_COLORS.gyeongui,
      incomingLineName: "경의중앙선",
    },
    {
      name: "성수 60분",
      variant: "endpoint",
      incomingColor: LINE_COLORS.line2,
      incomingLineName: "2호선 환승",
    },
  ],
};

export const dmcMoveData: DmcMoveData = {
  header: {
    eyebrow: "GOYANG MOVE",
    title: {
      ko: "고양·일산으로 오는 방법",
      en: "How to Get to Goyang-Ilsan",
      ja: "高陽・一山への行き方",
      "zh-CN": "前往高阳·一山的方式",
      "zh-TW": "前往高陽·一山的方式",
    },
    lead: {
      ko: "공항과 서울에서 고양·일산까지 오는 경로를 수단별로 안내합니다. 목적지에 따라 이용할 노선이 다르므로 도착지를 먼저 확인하세요.",
      en: "Routes to Goyang-Ilsan from the airports and Seoul. The right line depends on your destination, so check where you are heading first.",
      ja: "空港とソウルから高陽・一山までの経路を手段別にご案内します。目的地によって利用する路線が異なるため、行き先をまずご確認ください。",
      "zh-CN": "介绍从机场和首尔前往高阳·一山的各种交通方式。不同目的地对应的线路不同，请先确认您的到达地。",
      "zh-TW": "介紹從機場和首爾前往高陽·一山的各種交通方式。不同目的地對應的路線不同，請先確認您的到達地。",
    },
  },
  directions: {
    in: {
      ko: "오는 길",
      en: "Getting Here",
      ja: "来る道",
      "zh-CN": "前往高阳",
      "zh-TW": "前往高陽",
    },
    out: {
      ko: "나가는 길",
      en: "Going Out",
      ja: "出かける道",
      "zh-CN": "前往首尔",
      "zh-TW": "前往首爾",
    },
  },
  tabs: [
    // ─── TAB 1 · 인천공항 ─────────────────────────────────────────────────
    {
      key: "incheon",
      label: {
        ko: "인천공항",
        en: "Incheon Airport",
        ja: "仁川空港",
        "zh-CN": "仁川机场",
        "zh-TW": "仁川機場",
      },
      intro: {
        ko: "공항버스 5개 노선이 있으며 지역이 겹치지 않습니다. 목적지에 맞는 노선을 확인하세요.",
        en: "Five airport bus routes serve different districts. Check which one goes to your destination.",
        ja: "空港バス5路線があり、それぞれ担当地域が異なります。目的地に合う路線をご確認ください。",
        "zh-CN": "共有5条机场巴士线路，服务区域各不相同。请确认前往您目的地的线路。",
        "zh-TW": "共有5條機場巴士線路，服務區域各不相同。請確認前往您目的地的線路。",
      },
      methods: [
        {
          id: "1-1",
          title: {
            ko: "공항버스 3300",
            en: "Airport Bus 3300",
            ja: "空港バス3300番",
            "zh-CN": "机场巴士3300路",
            "zh-TW": "機場巴士3300路",
          },
          badge: {
            ko: "권장",
            en: "Recommended",
            ja: "おすすめ",
            "zh-CN": "推荐",
            "zh-TW": "推薦",
          },
          region: {
            ko: "일산신도시",
            en: "Ilsan New Town",
            ja: "一山新都市",
            "zh-CN": "一山新城",
            "zh-TW": "一山新城",
          },
          diagram: DIAGRAM_1_1,
          infoRows: [
            {
              label: {
                ko: "소요",
                en: "Duration",
                ja: "所要時間",
                "zh-CN": "耗时",
                "zh-TW": "耗時",
              },
              value: {
                ko: "약 85분",
                en: "About 85 min",
                ja: "約85分",
                "zh-CN": "约85分钟",
                "zh-TW": "約85分鐘",
              },
            },
            FARE_ROW,
            {
              label: {
                ko: "승차홈",
                en: "Boarding",
                ja: "乗車ホーム",
                "zh-CN": "乘车口",
                "zh-TW": "乘車口",
              },
              value: {
                ko: "T1 1층 9번 · T2 지하 35번",
                en: "T1 1F Gate 9 · T2 B1 Gate 35",
                ja: "T1 1階9番 · T2 地下35番",
                "zh-CN": "T1一层9号 · T2地下35号",
                "zh-TW": "T1一樓9號 · T2地下35號",
              },
            },
            {
              label: {
                ko: "예매",
                en: "Booking",
                ja: "予約",
                "zh-CN": "预订",
                "zh-TW": "預訂",
              },
              value: {
                ko: "불가 — 현장 선착순",
                en: "Not available — first come, first served",
                ja: "予約不可 — 現場先着順",
                "zh-CN": "不可预订 — 现场先到先得",
                "zh-TW": "不可預訂 — 現場先到先得",
              },
            },
          ],
          notice: {
            ko: "수도권 통합환승할인이 적용되지 않으며 하차 태그가 필요 없습니다.",
            en: "Not covered by the metropolitan transfer discount. No tag-out required.",
            ja: "首都圏統合乗換割引は適用されず、降車時のタッチは不要です。",
            "zh-CN": "不适用首都圈换乘优惠，下车无需刷卡。",
            "zh-TW": "不適用首都圈換乘優惠，下車無需刷卡。",
          },
          koCard: {
            label: DRIVER_LABEL,
            sentenceKo: "3300번 일산 가는 버스 맞나요?",
          },
        },
        {
          id: "1-2",
          title: {
            ko: "공항버스 5600",
            en: "Airport Bus 5600",
            ja: "空港バス5600番",
            "zh-CN": "机场巴士5600路",
            "zh-TW": "機場巴士5600路",
          },
          region: {
            ko: "킨텍스·소노캄호텔",
            en: "KINTEX · Sono Calm Hotel",
            ja: "KINTEX・ソノカムホテル",
            "zh-CN": "KINTEX·索诺凯姆酒店",
            "zh-TW": "KINTEX·索諾凱姆酒店",
          },
          diagram: DIAGRAM_1_2,
          // 정보표: 소요·요금 = 확인필요 (렌더 생략) — infoRows 자체 미제공
          note: {
            ko: "2024년 7400번에서 이관된 노선입니다.",
            en: "Transferred from route 7400 in 2024.",
            ja: "2024年に7400番から移管された路線です。",
            "zh-CN": "2024年从7400路移交的线路。",
            "zh-TW": "2024年從7400路移交的線路。",
          },
        },
        {
          id: "1-3",
          title: {
            ko: "공항버스 3200",
            en: "Airport Bus 3200",
            ja: "空港バス3200番",
            "zh-CN": "机场巴士3200路",
            "zh-TW": "機場巴士3200路",
          },
          region: {
            ko: "덕양 능곡·화정",
            en: "Deogyang · Neunggok · Hwajeong",
            ja: "徳陽 能谷・花井",
            "zh-CN": "德阳 能谷·花井",
            "zh-TW": "德陽 能谷·花井",
          },
          diagram: DIAGRAM_1_3,
          infoRows: [FARE_ROW], // 요금은 3300과 동일 문안 사용 (원문 명시)
          note: {
            ko: "공항 방면은 시내 구간에서도 승차할 수 있습니다.",
            en: "You can also board at city stops when heading to the airport.",
            ja: "空港方面は市内区間でも乗車できます。",
            "zh-CN": "前往机场方向也可在市区站点上车。",
            "zh-TW": "前往機場方向也可在市區站點上車。",
          },
        },
        {
          id: "1-4",
          title: {
            ko: "공항버스 7400",
            en: "Airport Bus 7400",
            ja: "空港バス7400番",
            "zh-CN": "机场巴士7400路",
            "zh-TW": "機場巴士7400路",
          },
          region: {
            ko: "덕양 원당·식사",
            en: "Deogyang · Wondang · Siksa",
            ja: "徳陽 元堂・食事",
            "zh-CN": "德阳 元堂·食事",
            "zh-TW": "德陽 元堂·食事",
          },
          diagram: DIAGRAM_1_4,
          note: {
            ko: "2024년 3월부터 일산신도시 구간이 폐지되었습니다.",
            en: "The Ilsan New Town section was discontinued in March 2024.",
            ja: "2024年3月から一山新都市区間が廃止されました。",
            "zh-CN": "自2024年3月起取消一山新城区间。",
            "zh-TW": "自2024年3月起取消一山新城區間。",
          },
        },
        {
          id: "1-5",
          title: {
            ko: "공항버스 7500",
            en: "Airport Bus 7500",
            ja: "空港バス7500番",
            "zh-CN": "机场巴士7500路",
            "zh-TW": "機場巴士7500路",
          },
          region: {
            ko: "고양동·삼송",
            en: "Goyang-dong · Samsong",
            ja: "高陽洞・三松",
            "zh-CN": "高阳洞·三松",
            "zh-TW": "高陽洞·三松",
          },
          diagram: DIAGRAM_1_5,
          note: {
            ko: "저녁 시간 이후 공항으로 갈 때는 3호선으로 백석역까지 이동한 뒤 3300번을 이용하세요.",
            en: "For late-evening airport trips, take Line 3 to Baekseok Stn. and transfer to bus 3300.",
            ja: "夜間に空港へ向かう場合は3号線で白石駅まで移動し、3300番をご利用ください。",
            "zh-CN": "夜间前往机场时，请乘3号线至白石站后换乘3300路。",
            "zh-TW": "夜間前往機場時，請乘3號線至白石站後換乘3300路。",
          },
        },
        {
          id: "1-6",
          title: {
            ko: "전철 — 공항철도 김포공항 환승",
            en: "Metro — Transfer via Gimpo (AREX)",
            ja: "電鉄 — 空港鉄道 金浦空港乗換",
            "zh-CN": "地铁 — 机场铁路 金浦机场换乘",
            "zh-TW": "地鐵 — 機場鐵路 金浦機場換乘",
          },
          diagram: DIAGRAM_1_6,
          notice: {
            ko: "환승이 두 번 필요하고 두 역 모두 환승 통로가 복잡합니다. 짐이 많으면 공항버스를 권합니다.",
            en: "Two transfers, both at stations with complex passageways. If you have luggage, the airport bus is easier.",
            ja: "乗り換えが2回あり、どちらの駅も乗換通路が複雑です。荷物が多い場合は空港バスをお勧めします。",
            "zh-CN": "需换乘两次，两站的换乘通道都较复杂。行李较多时建议乘坐机场巴士。",
            "zh-TW": "需換乘兩次，兩站的換乘通道都較複雜。行李較多時建議搭乘機場巴士。",
          },
          koCard: {
            label: {
              ko: "역무원에게 보여주세요",
              en: "Show this to station staff",
              ja: "駅員にお見せください",
              "zh-CN": "请出示给站务员",
              "zh-TW": "請出示給站務員",
            },
            sentenceKo: "서해선 타는 곳이 어디예요?",
          },
        },
      ],
    },

    // ─── TAB 2 · 김포공항 ─────────────────────────────────────────────────
    {
      key: "gimpo",
      label: {
        ko: "김포공항",
        en: "Gimpo Airport",
        ja: "金浦空港",
        "zh-CN": "金浦机场",
        "zh-TW": "金浦機場",
      },
      intro: {
        ko: "공항버스 직행 노선이 없습니다. 전철이나 택시를 이용하세요.",
        en: "There is no direct airport bus. Use the metro or a taxi.",
        ja: "空港バスの直行路線はありません。電鉄またはタクシーをご利用ください。",
        "zh-CN": "没有直达机场巴士，请利用地铁或出租车。",
        "zh-TW": "沒有直達機場巴士，請利用地鐵或計程車。",
      },
      methods: [
        {
          id: "2-1",
          title: {
            ko: "서해선 → 3호선",
            en: "Seohae Line → Line 3",
            ja: "西海線 → 3号線",
            "zh-CN": "西海线 → 3号线",
            "zh-TW": "西海線 → 3號線",
          },
          badge: {
            ko: "권장",
            en: "Recommended",
            ja: "おすすめ",
            "zh-CN": "推荐",
            "zh-TW": "推薦",
          },
          diagram: DIAGRAM_2_1,
          infoRows: [
            {
              label: {
                ko: "환승",
                en: "Transfers",
                ja: "乗換",
                "zh-CN": "换乘",
                "zh-TW": "換乘",
              },
              value: {
                ko: "1회 (대곡역)",
                en: "1 transfer (Daegok)",
                ja: "1回(大谷駅)",
                "zh-CN": "换乘1次(大谷站)",
                "zh-TW": "換乘1次(大谷站)",
              },
            },
            // 소요·요금 = 확인필요 (원문에 따라 렌더 생략 — infoRows 에 미포함)
          ],
        },
        {
          id: "2-2",
          title: {
            ko: "시내버스 150번",
            en: "City Bus 150",
            ja: "市内バス150番",
            "zh-CN": "市内公交150路",
            "zh-TW": "市內公車150路",
          },
          // 정보 = 확인필요 (노선·소요 렌더 생략, 표기만)
        },
        {
          id: "2-3",
          title: {
            ko: "택시",
            en: "Taxi",
            ja: "タクシー",
            "zh-CN": "出租车",
            "zh-TW": "計程車",
          },
          // 소요 = 확인필요 (렌더 생략)
          koCard: {
            label: DRIVER_LABEL,
            sentenceKo: "일산 킨텍스로 가주세요",
          },
        },
      ],
    },

    // ─── TAB 3 · 서울역·연신내 ────────────────────────────────────────────
    {
      key: "seoul",
      label: {
        ko: "서울역·연신내",
        en: "Seoul Stn.·Yeonsinnae",
        ja: "ソウル駅·延新内",
        "zh-CN": "首尔站·延新内",
        "zh-TW": "首爾站·延新內",
      },
      methods: [
        {
          id: "3-1",
          title: {
            ko: "GTX-A",
            en: "GTX-A",
            ja: "GTX-A",
            "zh-CN": "GTX-A",
            "zh-TW": "GTX-A",
          },
          badge: {
            ko: "가장 빠름",
            en: "Fastest",
            ja: "最速",
            "zh-CN": "最快",
            "zh-TW": "最快",
          },
          diagram: DIAGRAM_3_1,
          infoRows: [
            {
              label: {
                ko: "소요",
                en: "Duration",
                ja: "所要時間",
                "zh-CN": "耗时",
                "zh-TW": "耗時",
              },
              value: {
                ko: "약 20분",
                en: "About 20 min",
                ja: "約20分",
                "zh-CN": "约20分钟",
                "zh-TW": "約20分鐘",
              },
            },
            {
              label: {
                ko: "환승",
                en: "Transfers",
                ja: "乗換",
                "zh-CN": "换乘",
                "zh-TW": "換乘",
              },
              value: {
                ko: "대곡역에서 3호선·경의중앙선·서해선",
                en: "Transfer at Daegok to Line 3, Gyeongui-Jungang, Seohae",
                ja: "大谷駅で3号線·京義中央線·西海線",
                "zh-CN": "大谷站可换乘3号线·京义中央线·西海线",
                "zh-TW": "大谷站可換乘3號線·京義中央線·西海線",
              },
            },
          ],
          note: {
            ko: "2024년 12월 서북부 구간이 개통했습니다.",
            en: "The northwestern section opened in December 2024.",
            ja: "2024年12月に西北部区間が開通しました。",
            "zh-CN": "2024年12月西北部区间开通。",
            "zh-TW": "2024年12月西北部區間開通。",
          },
        },
      ],
    },

    // ─── TAB 4 · 수도권 전철 ──────────────────────────────────────────────
    {
      key: "metro",
      label: {
        ko: "수도권 전철",
        en: "Metro",
        ja: "首都圏電鉄",
        "zh-CN": "首都圈地铁",
        "zh-TW": "首都圈地鐵",
      },
      methods: [
        {
          id: "4-1",
          title: {
            ko: "3호선",
            en: "Line 3",
            ja: "3号線",
            "zh-CN": "3号线",
            "zh-TW": "3號線",
          },
          badge: {
            ko: "직결",
            en: "Direct",
            ja: "直通",
            "zh-CN": "直通",
            "zh-TW": "直通",
          },
          diagram: DIAGRAM_4_1,
          note: {
            ko: "환승 없이 서울 도심에서 일산까지 이어집니다. 킨텍스와 호수공원은 대화역에서 내리세요.",
            en: "A direct ride from central Seoul to Ilsan. Get off at Daehwa for KINTEX and Lake Park.",
            ja: "乗り換えなしでソウル都心から一山まで。KINTEXと湖水公園は大化駅で下車してください。",
            "zh-CN": "无需换乘，从首尔市中心直达一山。前往KINTEX和湖水公园请在大化站下车。",
            "zh-TW": "無需換乘，從首爾市中心直達一山。前往KINTEX和湖水公園請在大化站下車。",
          },
        },
        {
          id: "4-2",
          title: {
            ko: "경의중앙선",
            en: "Gyeongui-Jungang Line",
            ja: "京義中央線",
            "zh-CN": "京义中央线",
            "zh-TW": "京義中央線",
          },
          diagram: DIAGRAM_4_2,
          note: {
            ko: "일산역은 호수공원·킨텍스와 거리가 있습니다. 3호선 대화역이나 GTX 킨텍스역이 더 가깝습니다.",
            en: "Ilsan Stn. is some distance from Lake Park and KINTEX. Daehwa (Line 3) or GTX Kintex Stn. is closer.",
            ja: "一山駅は湖水公園·KINTEXから距離があります。3号線大化駅またはGTXキンテックス駅の方が近いです。",
            "zh-CN": "一山站距离湖水公园·KINTEX较远，大化站或GTX韩国国际展览中心站更近。",
            "zh-TW": "一山站距離湖水公園·KINTEX較遠，大化站或GTX韓國國際展覽中心站更近。",
          },
        },
      ],
    },

    // ─── TAB 5 · 그 밖의 방법 ─────────────────────────────────────────────
    // 5-1 시내버스 · 5-2 택시 = 확인필요 (렌더 생략) — methods 배열에 미포함.
    {
      key: "other",
      label: {
        ko: "그 밖의 방법",
        en: "Other Options",
        ja: "その他の方法",
        "zh-CN": "其他方式",
        "zh-TW": "其他方式",
      },
      methods: [
        {
          id: "5-3",
          title: {
            ko: "공항픽업",
            en: "Airport Pickup",
            ja: "空港送迎",
            "zh-CN": "机场接送",
            "zh-TW": "機場接送",
          },
          note: {
            ko: "소개형 안내입니다. 예약·중개는 하지 않으며 업체에 직접 문의하세요.",
            en: "Information only. We do not book or broker; please contact the operator directly.",
            ja: "情報提供のみです。予約·仲介は行いませんので、事業者に直接お問い合わせください。",
            "zh-CN": "仅提供信息介绍，不进行预订或中介，请直接联系相关商家。",
            "zh-TW": "僅提供資訊介紹，不進行預訂或仲介，請直接聯繫相關商家。",
          },
        },
      ],
    },
  ],
  out: {
    lead: {
      ko: "고양·일산에서 서울 주요 지역으로 가는 경로입니다. 3호선은 환승 없이 도심과 강남까지 이어집니다.",
      en: "Routes from Goyang-Ilsan to central Seoul. Line 3 runs straight through downtown and on to Gangnam without a transfer.",
      ja: "高陽・一山からソウル主要地域への経路です。3号線は乗り換えなしで都心と江南までつながります。",
      "zh-CN": "从高阳·一山前往首尔主要地区的路线。3号线无需换乘即可直达市中心和江南。",
      "zh-TW": "從高陽·一山前往首爾主要地區的路線。3號線無需換乘即可直達市中心和江南。",
    },
    destinations: [
      {
        id: "O1",
        name: {
          ko: "서울역",
          en: "Seoul Station",
          ja: "ソウル駅",
          "zh-CN": "首尔站",
          "zh-TW": "首爾站",
        },
        duration: {
          ko: "20분",
          en: "20 min",
          ja: "20分",
          "zh-CN": "20分钟",
          "zh-TW": "20分鐘",
        },
        route: {
          ko: "GTX-A 킨텍스역",
          en: "GTX-A from Kintex",
          ja: "GTX-A キンテックス駅",
          "zh-CN": "GTX-A 韩国国际展览中心站",
          "zh-TW": "GTX-A 韓國國際展覽中心站",
        },
      },
      {
        id: "O2",
        name: {
          ko: "홍대입구",
          en: "Hongdae",
          ja: "弘大入口",
          "zh-CN": "弘大入口",
          "zh-TW": "弘大入口",
        },
        duration: {
          ko: "20분",
          en: "20 min",
          ja: "20分",
          "zh-CN": "20分钟",
          "zh-TW": "20分鐘",
        },
        route: {
          ko: "경의중앙선",
          en: "Gyeongui-Jungang Line",
          ja: "京義中央線",
          "zh-CN": "京义中央线",
          "zh-TW": "京義中央線",
        },
      },
      {
        id: "O3",
        name: {
          ko: "연신내",
          en: "Yeonsinnae",
          ja: "延新内",
          "zh-CN": "延新内",
          "zh-TW": "延新內",
        },
        duration: {
          ko: "30분",
          en: "30 min",
          ja: "30分",
          "zh-CN": "30分钟",
          "zh-TW": "30分鐘",
        },
        route: {
          ko: "3호선 직결",
          en: "Line 3 direct",
          ja: "3号線直通",
          "zh-CN": "3号线直达",
          "zh-TW": "3號線直達",
        },
      },
      {
        id: "O4",
        name: {
          ko: "경복궁",
          en: "Gyeongbokgung",
          ja: "景福宮",
          "zh-CN": "景福宫",
          "zh-TW": "景福宮",
        },
        duration: {
          ko: "40분",
          en: "40 min",
          ja: "40分",
          "zh-CN": "40分钟",
          "zh-TW": "40分鐘",
        },
        route: {
          ko: "3호선 직결",
          en: "Line 3 direct",
          ja: "3号線直通",
          "zh-CN": "3号线直达",
          "zh-TW": "3號線直達",
        },
      },
      {
        id: "O5",
        name: {
          ko: "종로3가",
          en: "Jongno 3-ga",
          ja: "鍾路3街",
          "zh-CN": "钟路3街",
          "zh-TW": "鍾路3街",
        },
        duration: {
          ko: "45분",
          en: "45 min",
          ja: "45分",
          "zh-CN": "45分钟",
          "zh-TW": "45分鐘",
        },
        route: {
          ko: "3호선 직결",
          en: "Line 3 direct",
          ja: "3号線直通",
          "zh-CN": "3号线直达",
          "zh-TW": "3號線直達",
        },
      },
      {
        id: "O6",
        name: {
          ko: "강남",
          en: "Gangnam",
          ja: "江南",
          "zh-CN": "江南",
          "zh-TW": "江南",
        },
        duration: {
          ko: "60분",
          en: "60 min",
          ja: "60分",
          "zh-CN": "60分钟",
          "zh-TW": "60分鐘",
        },
        route: {
          ko: "3호선 · GTX-A 수서",
          en: "Line 3 · GTX-A via Suseo",
          ja: "3号線 · GTX-A 水西",
          "zh-CN": "3号线 · GTX-A 水西",
          "zh-TW": "3號線 · GTX-A 水西",
        },
      },
      {
        id: "O7",
        name: {
          ko: "성수",
          en: "Seongsu",
          ja: "聖水",
          "zh-CN": "圣水",
          "zh-TW": "聖水",
        },
        duration: {
          ko: "60분",
          en: "60 min",
          ja: "60分",
          "zh-CN": "60分钟",
          "zh-TW": "60分鐘",
        },
        route: {
          ko: "경의중앙선 + 2호선",
          en: "Gyeongui-Jungang + Line 2",
          ja: "京義中央線 + 2号線",
          "zh-CN": "京义中央线 + 2号线",
          "zh-TW": "京義中央線 + 2號線",
        },
      },
    ],
    diagrams: [
      {
        id: "D1",
        titleKo: "3호선 한 줄로 가는 곳",
        diagram: OUT_DIAGRAM_D1,
        note: {
          ko: "환승 없이 서울 도심과 강남까지 이어집니다. 외국인에게 가장 안내하기 쉬운 노선입니다.",
          en: "A single ride to downtown Seoul and on to Gangnam. The easiest route to explain to visitors.",
          ja: "乗り換えなしでソウル都心と江南までつながります。訪問者に最も案内しやすい路線です。",
          "zh-CN": "无需换乘直达首尔市中心与江南，是最便于向访客说明的线路。",
          "zh-TW": "無需換乘直達首爾市中心與江南，是最便於向訪客說明的路線。",
        },
      },
      {
        id: "D2",
        titleKo: "GTX-A 가장 빠름",
        diagram: OUT_DIAGRAM_D2,
        note: {
          ko: "고양에서 서울 도심까지 가장 빠른 수단입니다.",
          en: "The fastest way from Goyang into central Seoul.",
          ja: "高陽からソウル都心まで最も速い手段です。",
          "zh-CN": "从高阳前往首尔市中心最快的方式。",
          "zh-TW": "從高陽前往首爾市中心最快的方式。",
        },
      },
      {
        id: "D3",
        titleKo: "경의중앙선 홍대·성수",
        diagram: OUT_DIAGRAM_D3,
        note: {
          ko: "홍대입구에서 2호선으로 갈아타면 성수까지 이어집니다.",
          en: "Transfer to Line 2 at Hongdae to reach Seongsu.",
          ja: "弘大入口で2号線に乗り換えると聖水まで行けます。",
          "zh-CN": "在弘大入口换乘2号线即可前往圣水。",
          "zh-TW": "在弘大入口換乘2號線即可前往聖水。",
        },
      },
    ],
    koCard: {
      label: {
        ko: "역무원에게 보여주세요",
        en: "Show this to station staff",
        ja: "駅員にお見せください",
        "zh-CN": "请出示给站务员",
        "zh-TW": "請出示給站務員",
      },
      sentenceKo: "서울역 가는 표 어떻게 사요?",
    },
  },
};

export const MOVE_TAB_KEYS: TabKey[] = dmcMoveData.tabs.map((t) => t.key);

export function isTabKey(v: string | null | undefined): v is TabKey {
  return typeof v === "string" && (MOVE_TAB_KEYS as string[]).includes(v);
}
