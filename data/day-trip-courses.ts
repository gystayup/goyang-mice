// data/day-trip-courses.ts — 오더 #C57 [2] 17코스 데이터 (md 원문 그대로 이식).
//
// 원문: day-trips-seoul-6courses.md · day-trips-paju-6courses.md · day-trips-gyeonggi-5courses.md
// 사장님 md 원문 그대로 · 창작·의역 절대 금지 · "확인 필요" 표기도 원문 그대로.
// 5로케일: ko 만 입력 · en/ja/zh-CN/zh-TW 는 렌더 시 ko 폴백 (fork 번역 금지).

export type DayTripAxis = "seoul" | "paju" | "gyeonggi";
export type DayTripDurationBadge = "4H" | "5H" | "5-6H" | "6H" | "8H";

export interface DayTripStop {
  name: string; // 스팟 이름 (원문 ko)
  note: string; // "— " 이후 한 줄 설명 (원문 ko)
}

/** 오더 #C59 신규 · Overview 4칸 (총 소요 / 이동 / 추천 시간 / 이런 분께). */
export interface DayTripOverview {
  totalDuration?: string;
  transport?: string;
  recommendedTime?: string;
  recommendedFor?: string;
}

/** 오더 #C59 신규 · 타임라인 노드 1개. */
export interface DayTripTimelineNode {
  /** 도착·체류 시각. 예: "09:30". */
  time?: string;
  /** /dmc/{slug} 연결용 스팟 slug. 없으면 링크 없이 텍스트만. */
  spotSlug?: string;
  /** 화면에 표기할 스팟명 (spotSlug 유무와 무관). */
  spotName: string;
  /** 체류 시간. 예: "60분". */
  duration?: string;
  /** 한 줄 설명. */
  note?: string;
  /** 다음 노드까지 이동 수단·소요. 예: "도보 15분". 마지막 노드는 undefined. */
  transportToNext?: string;
}

/** 오더 #C59 신규 · FAQ 항목. */
export interface DayTripFaqItem {
  q: string;
  a: string;
}

export interface DayTripCourse {
  /** URL slug (kebab-case). */
  id: string;
  axis: DayTripAxis;
  /** 축 내 순서 (①②③... → 1,2,3...). */
  order: number;
  /** 소요 시간 배지 (상품명·필터용). */
  durationBadge: DayTripDurationBadge;
  /** 코스명 · ko 원문 (예: "왕의 서울 — 경복궁 · 북촌 · 인사동"). */
  name: string;
  /** 영문 상품명 · md 상품 구성 권고에서 발췌 (없으면 undefined). */
  nameEn?: string;
  /** 후크(한 줄) · ko 원문. */
  hook: string;
  /** 소개 문단 · ko 원문 (\n 개행 유지). */
  intro: string;
  /** 스팟별 한 줄 리스트. */
  stops: DayTripStop[];
  /** 교통 · ko 원문 (\n 유지). */
  transport: string;
  /** 소요 · ko 원문. */
  duration: string;
  /** 추천 시간 · ko 원문. */
  recommendedTime: string;
  /** ※ 확인 필요 · 운영시간 등 부가 안내 (원문 그대로 · 없으면 undefined). */
  note?: string;
  /** admin 노출 여부. false 만 화면에서 제외. */
  published?: boolean;

  // ─── 오더 #C59 신규 필드 (상세 12블록 템플릿) ─────────────────────────
  /** 후크와 별도로 상세 상단에 배치하는 한 줄 카피 (없으면 hook 재사용). */
  hookLine?: string;
  /** Overview 4칸. */
  overview?: DayTripOverview;
  /** 타임라인 노드 배열 (스팟 + 이동). */
  timeline?: DayTripTimelineNode[];
  /** "이 코스가 좋은 이유" 불릿 3개. */
  whyGood?: string[];
  /** 가는 법 상세 문단 (\n 유지). transport 와 별도. */
  access?: string;
  /** FAQ (없으면 블록 자체 숨김). */
  faq?: DayTripFaqItem[];
  /** About 블록 좌측 라인 일러스트 파일명 (예: "illust-culture"). */
  illustrationKey?: string;
}

// ─── 서울 축 6코스 ─────────────────────────────────────────────────────────

const SEOUL_COURSES: DayTripCourse[] = [
  {
    id: "seoul-royal",
    axis: "seoul",
    order: 1,
    durationBadge: "4H",
    name: "왕의 서울 — 경복궁 · 북촌 · 인사동",
    hook: "궁궐에서 한옥골목까지, 서울의 600년을 걸어서 통과한다.",
    intro:
      "조선의 정궁 경복궁에서 출발해 북촌 한옥마을의 골목을 지나 인사동 거리로 이어지는\n코스입니다. 세 곳이 걸어서 연결되고, 궁궐 건축·한옥 주거·전통 공예가 순서대로\n나타나 처음 한국을 찾는 방문객에게 가장 이해가 빠릅니다. 한복을 대여하면 경복궁\n입장료가 면제되므로, 궁에서 사진을 찍고 그대로 북촌까지 이동하는 흐름이 자연스럽습니다.",
    stops: [
      { name: "경복궁", note: "수문장 교대의식과 근정전. 아침 시간대가 가장 한산합니다." },
      { name: "북촌한옥마을", note: "사람이 실제로 사는 한옥 동네. 정숙 구역이 있으니 표지판을 따르세요." },
      { name: "인사동", note: "전통 공예·차·붓글씨 거리. 쌈지길에서 마무리하기 좋습니다." },
    ],
    transport: "3호선 대곡역 → 경복궁역 직통 · 환승 없음",
    duration: "편도 약 27~29분 / 체류 약 2시간 30분",
    recommendedTime: "09:30 ~ 13:30",
    // 오더 #C59 상세 12블록 시드 (서울① 왕의 서울)
    hookLine: "궁궐에서 한옥골목까지, 서울의 600년을 걸어서 통과한다.",
    overview: {
      totalDuration: "약 4시간",
      transport: "편도 약 27~29분 · 환승 없음",
      recommendedTime: "09:30 ~ 13:30",
      recommendedFor: "처음 한국을 찾는 방문객 · 한복 체험을 원하는 분",
    },
    timeline: [
      {
        time: "09:30",
        spotName: "대곡역 출발",
        note: "3호선 경복궁역 방면 승차 · 환승 없음.",
        transportToNext: "지하철 27~29분",
      },
      {
        time: "10:00",
        spotName: "경복궁",
        duration: "약 90분",
        note: "10:00 수문장 교대의식 · 근정전 · 경회루. 한복 대여 시 입장료 면제.",
        transportToNext: "도보 15분",
      },
      {
        time: "11:45",
        spotName: "북촌한옥마을",
        duration: "약 45분",
        note: "사람이 실제로 사는 동네. 정숙 구역 표지판을 따르세요.",
        transportToNext: "도보 10분",
      },
      {
        time: "12:40",
        spotName: "인사동",
        duration: "약 50분",
        note: "전통 공예·차·붓글씨 거리. 쌈지길에서 마무리.",
        transportToNext: "지하철 27~29분",
      },
      {
        time: "13:30",
        spotName: "대곡역 도착",
        note: "총 이동 약 55분 · 체류 약 3시간 5분.",
      },
    ],
    whyGood: [
      "궁궐 · 한옥 · 공예가 도보 거리로 이어져 이동 부담이 없다.",
      "한복을 대여하면 경복궁 입장료가 면제되고 사진 동선이 자연스럽다.",
      "대곡역에서 경복궁역까지 3호선 직통 · 환승이 없다.",
    ],
    access:
      "고양 대곡역에서 서울 3호선으로 경복궁역까지 27~29분 · 환승 없음.\n경복궁역 5번 출구가 광화문·경복궁 방면과 가장 가깝습니다.\n북촌·인사동 구간은 전부 도보 이동 · 별도 대중교통을 이용하지 않습니다.",
    faq: [
      {
        q: "한복을 대여하면 정말 경복궁 입장료가 무료인가요?",
        a: "네, 한복 착용 시 경복궁·창덕궁·덕수궁·창경궁·종묘 입장료가 면제됩니다. 궁궐 방문 전 대여점을 이용하는 것이 유리합니다.",
      },
      {
        q: "경복궁 수문장 교대의식은 언제 볼 수 있나요?",
        a: "매일 10:00 · 14:00 · 각 20분 진행 (화요일 정기 휴궁 · 우천 시 취소). 방문 전 공식 사이트에서 당일 운영 여부를 확인하세요.",
      },
      {
        q: "북촌 한옥마을에서 지켜야 할 예절이 있나요?",
        a: "실제 주민이 거주하는 동네입니다. 정숙 구역 표지판을 따르고, 대문·창문 안쪽을 촬영하지 마세요.",
      },
      {
        q: "인사동에서 한식을 먹기 좋은 곳이 있나요?",
        a: "쌈지길 인근 골목에 전통찻집·비빔밥·수제비 식당이 밀집합니다. 점심 시간에는 대기가 있을 수 있어 이른 편이 좋습니다.",
      },
    ],
    illustrationKey: "illust-culture",
  },
  {
    id: "seoul-night",
    axis: "seoul",
    order: 2,
    durationBadge: "4H",
    name: "서울의 밤 — 명동 · 남산 · N서울타워",
    hook: "해가 지면 서울이 켜진다. 쇼핑 거리에서 전망대까지 한 줄로.",
    intro:
      "명동에서 쇼핑과 길거리 음식을 즐긴 뒤 남산으로 올라가 서울 야경을 내려다보는\n코스입니다. 낮보다 저녁에 완성도가 높습니다. 명동은 K-뷰티 매장과 노점이 밀집해\n있고, 남산은 케이블카 또는 순환버스로 오를 수 있어 체력 부담이 적습니다.\n서울 전경을 한 번에 담고 싶은 방문객에게 가장 확실한 선택입니다.",
    stops: [
      { name: "명동", note: "K-뷰티·패션 매장과 저녁 노점. 면세 환급 창구가 많습니다." },
      { name: "남산 케이블카", note: "대기가 길 수 있어 일몰 1시간 전 탑승을 권합니다." },
      { name: "N서울타워", note: "전망대와 자물쇠 테라스. 야경은 일몰 직후 30분이 가장 좋습니다." },
    ],
    transport: "3호선 대곡역 → 충무로역 직통 · 환승 없음 (명동까지 도보권)",
    duration: "편도 약 30~33분 / 체류 약 2시간 30분",
    recommendedTime: "17:00 ~ 21:00",
  },
  {
    id: "seoul-k-youth",
    axis: "seoul",
    order: 3,
    durationBadge: "4H",
    name: "K-Youth — 홍대 · 연남동 · 경의선숲길",
    hook: "일산에서 환승 없이 닿는, 서울에서 가장 젊은 동네.",
    intro:
      "버스킹과 라이브 클럽의 홍대에서 시작해 경의선숲길을 따라 연남동 카페 골목으로\n걷는 코스입니다. 고양에서 경의중앙선 한 번에 닿아 이동 부담이 가장 적습니다.\n공원길을 따라 카페·소품숍이 이어지므로 정해진 목적지 없이 걷는 여행에 맞습니다.\n저녁에는 홍대 거리 공연이 시작됩니다.",
    stops: [
      { name: "홍대 걷고싶은거리", note: "주말 저녁 버스킹이 가장 활발합니다." },
      { name: "연남동", note: "개인 카페와 소품숍 밀집. 골목 안쪽이 더 재미있습니다." },
      { name: "경의선숲길", note: "폐선 부지를 공원으로 바꾼 길. 홍대입구에서 연남동까지 이어집니다." },
    ],
    transport: "경의중앙선 대곡역 → 홍대입구역 직통 · 환승 없음",
    duration: "편도 약 21분 / 체류 약 2시간 45분",
    recommendedTime: "16:00 ~ 20:00",
  },
  {
    id: "seoul-food-design",
    axis: "seoul",
    order: 4,
    durationBadge: "4H",
    name: "K-Food & Design — 광장시장 · 청계천 · DDP",
    hook: "100년 시장의 빈대떡에서 시작해 미래형 건축으로 끝나는 하루.",
    intro:
      "광장시장에서 빈대떡·육회·마약김밥으로 배를 채우고, 청계천을 따라 걸어\n동대문디자인플라자로 이동하는 코스입니다. 전통 시장과 현대 건축이 도보 거리로\n붙어 있어 대비가 강합니다. DDP는 야간 조명이 켜지는 시간대가 사진이 가장 좋습니다.",
    stops: [
      { name: "광장시장", note: "먹거리 골목이 핵심. 현금과 카드 모두 통용되나 노점은 현금이 빠릅니다." },
      { name: "청계천", note: "도심 한복판의 물길. 광장시장에서 DDP 방향으로 걷습니다." },
      { name: "DDP(동대문디자인플라자)", note: "자하 하디드 설계. 전시·야간 조명·LED 장미정원." },
    ],
    transport: "3호선 대곡역 → 종로3가역 직통 · 환승 없음 (광장시장까지 도보권)",
    duration: "편도 약 30~33분 / 체류 약 2시간 20분",
    recommendedTime: "16:00 ~ 20:00",
  },
  {
    id: "seoul-hip",
    axis: "seoul",
    order: 5,
    durationBadge: "4H",
    name: "Hip Seoul — 서울숲 · 성수동",
    hook: "관광지가 아니라 서울 사람들이 노는 동네.",
    intro:
      "서울숲 공원에서 시작해 성수동 카페 거리와 팝업스토어를 도는 코스입니다.\n과거 공장 지대가 카페·편집숍·브랜드 팝업으로 바뀐 구역으로, 관광 명소보다\n현재의 서울을 보고 싶은 방문객에게 맞습니다. 팝업은 상시 교체되므로 방문 전\n확인이 필요합니다.",
    stops: [
      { name: "서울숲", note: "사슴방사장과 은행나무길이 있는 도심 공원." },
      { name: "성수동 카페거리", note: "붉은 벽돌 공장을 개조한 대형 카페들." },
      { name: "성수 팝업 구역", note: "브랜드 팝업이 상시 열립니다. 주말은 대기가 있습니다." },
    ],
    transport: "3호선 대곡역 → 을지로3가역 → 2호선 환승 → 성수역 (환승 1회)",
    duration: "편도 약 45분 내외 / 체류 약 2시간 10분",
    recommendedTime: "13:00 ~ 17:00",
    note: "※ 소요시간 확인 필요 — 환승 대기 포함 실측 권장",
  },
  {
    id: "seoul-modern",
    axis: "seoul",
    order: 6,
    durationBadge: "4H",
    name: "Modern Seoul — 봉은사 · 코엑스 · 별마당도서관",
    hook: "천년 사찰 건너편에 서울에서 가장 큰 지하도시가 있다.",
    intro:
      "도심 한복판의 전통 사찰 봉은사에서 길 하나를 건너면 코엑스 복합단지가 나옵니다.\n사찰의 정적과 초현대 도시가 도보 거리에서 맞붙는 대비가 이 코스의 핵심입니다.\n코엑스 안 별마당도서관은 13미터 높이 서가로 사진 명소가 되었고, 비가 오거나\n더운 날에도 전 구간이 실내라 날씨 영향을 받지 않습니다.",
    stops: [
      { name: "봉은사", note: "도심 사찰. 템플스테이와 연등이 유명합니다." },
      { name: "코엑스몰", note: "쇼핑·식당·아쿠아리움이 들어선 대형 지하 복합공간." },
      { name: "별마당도서관", note: "개방형 대형 서가. 무료 입장." },
    ],
    transport: "3호선 대곡역 → 고속터미널역 → 9호선 환승 → 봉은사역 (환승 1회)",
    duration: "편도 약 45~49분 + 환승 / 체류 약 2시간",
    recommendedTime: "13:00 ~ 17:00",
    note: "※ 노선 확인 필요 — 봉은사역(9호선)·삼성역(2호선) 중 실제 최적 경로 확인 권장",
  },
];

// ─── 파주 축 6코스 ─────────────────────────────────────────────────────────

const PAJU_COURSES: DayTripCourse[] = [
  {
    id: "paju-dmz-peace",
    axis: "paju",
    order: 1,
    durationBadge: "4H",
    name: "DMZ PEACE — 임진각 · 평화누리 · 평화곤돌라",
    nameEn: "DMZ PEACE",
    hook: '고양에 머물면서, 반나절 만에 DMZ를 본다.\n> 영문 카피: **"Stay in Goyang. Visit the DMZ in Half a Day."**',
    intro:
      "임진각 평화누리에서 출발해 민간인통제구역을 가로지르는 평화곤돌라를 타고\n캠프 그리브스 방향으로 넘어가는 코스입니다. 한국전쟁과 분단, 그리고 지금도\n이어지는 경계를 한 장소에서 이해할 수 있어 파주에서 가장 대체 불가능한 경험입니다.\n곤돌라 탑승은 민통선 출입에 해당해 보안서약 절차가 필요하므로, 여권을 반드시\n지참하고 시간 여유를 두고 방문하십시오.",
    stops: [
      { name: "임진각", note: "자유의 다리와 망배단. 분단의 상징이 모여 있는 지점입니다." },
      { name: "평화곤돌라", note: "민통선을 가로지르는 국내 최초 곤돌라. 보안서약·신분증 필수." },
      { name: "평화누리공원", note: "언덕 위 바람개비 언덕. 곤돌라 전후 산책 구간으로 좋습니다." },
    ],
    transport:
      "차량 — 자유로 문산 방면 약 45분\n철도 — 경의중앙선 대곡역 → 문산역(약 35분) → 임진강역 환승(+약 8분)",
    duration: "편도 약 45분 / 체류 약 2~2.5시간",
    recommendedTime: "09:00 ~ 13:00",
    note: "※ 확인 필요 — 임진강역 운행 편수·곤돌라 운영시간은 방문 전 공식 안내 확인",
  },
  {
    id: "paju-border-view",
    axis: "paju",
    order: 2,
    durationBadge: "4H",
    name: "BORDER VIEW — 오두산통일전망대 · 헤이리예술마을",
    nameEn: "BORDER VIEW",
    hook: "북한을 바라본 뒤 20분, 예술마을에 도착한다.",
    intro:
      "한강과 임진강이 만나는 지점에 선 오두산통일전망대에서 북한 방향을 조망하고,\n차로 20분 남짓 이동해 헤이리예술마을로 넘어가는 코스입니다. 분단의 한국에서\n예술의 한국으로 넘어가는 전환이 이 코스의 핵심입니다. 전망대는 오후 늦게\n문을 닫으므로 오전~이른 오후 상품으로 배치하는 것이 맞습니다.\n외국인 VIP·MICE 참가자에게 DMZ 다음으로 권할 만합니다.",
    stops: [
      { name: "오두산통일전망대", note: "두 강이 합류하는 지형과 북한 방향 조망. 망원경 설치." },
      { name: "헤이리예술마을", note: "갤러리·박물관·북하우스·카페가 섞인 예술인 정착 마을." },
    ],
    transport: "차량 — 자유로 성동IC 방면. 고양 기준 약 25~30분",
    duration: "편도 약 25~30분 / 체류 약 2~2.5시간",
    recommendedTime: "10:00 ~ 14:00",
    note: "※ 운영시간 — 전망대는 대체로 09:00~17:00 안내. 방문 전 확인 권장",
  },
  {
    id: "paju-art-cafe",
    axis: "paju",
    order: 3,
    durationBadge: "4H",
    name: "ART & CAFÉ — 헤이리예술마을 · 프로방스마을",
    nameEn: "ART & CAFÉ",
    hook: "예술마을에서 하루를 시작해, 조명이 켜지는 마을에서 끝낸다.",
    intro:
      "헤이리에서 갤러리와 건축을 둘러본 뒤 프로방스마을로 이동하는 코스입니다.\n헤이리는 쇼핑 거리가 아니라 예술가 300여 명이 실제로 거주하는 마을이라,\n작업실·박물관·북카페가 섞여 있어 이야기할 거리가 많습니다. 프로방스는\n저녁 조명이 들어온 뒤 사진이 가장 좋으므로 늦은 오후 출발이 유리합니다.\n젊은 여행자·커플·가족에게 반응이 좋은 조합입니다.",
    stops: [
      { name: "헤이리예술마을", note: "갤러리 대부분 오전 11시 개관, 월요일 휴관이 많습니다." },
      { name: "프로방스마을", note: "남프랑스풍 상점·레스토랑 단지. 야간 조명이 포인트." },
    ],
    transport: "차량 — 자유로 성동IC 방면. 고양 기준 약 25~30분 (두 곳은 인접)",
    duration: "편도 약 25~30분 / 체류 약 2.5시간",
    recommendedTime: "15:00 ~ 19:00",
  },
  {
    id: "paju-k-book-hangeul",
    axis: "paju",
    order: 4,
    durationBadge: "4H",
    name: "K-BOOK & HANGEUL — 파주출판도시 · 지혜의숲",
    nameEn: "K-BOOK & HANGEUL",
    hook: "도시 전체가 출판사로 이루어진 곳. 세계에서도 드뭅니다.",
    intro:
      "출판사·인쇄소·제본소·서점·북카페가 한 단지에 모인 파주출판도시를 걷고,\n대형 개방 서가인 지혜의숲에서 마무리하는 코스입니다. 건축물 하나하나가\n설계 의도를 가진 단지여서 건축 여행으로도 성립합니다. 지혜의숲은 뮤직비디오와\n드라마 촬영 배경으로 여러 차례 소개된 공간이기도 합니다.\n외국인에게는 \"도서관\"이 아니라 **K-BOOK · 한글 · 건축 · K-드라마**로 묶어\n설명해야 가치가 전달됩니다.",
    stops: [
      { name: "파주출판도시", note: "출판·인쇄 단지이자 현대건축 집합. 평일에도 개방됩니다." },
      { name: "지혜의숲", note: "대형 개방 서가. 열람 무료, 사진 촬영 시 정숙 구역 확인." },
      { name: "활자·인쇄 체험", note: "단지 내 박물관·공방에서 체험 프로그램 운영(사전 확인 필요)." },
    ],
    transport: "차량 — 자유로 문산 방면. 고양 기준 약 15~20분",
    duration: "편도 약 15~20분 / 체류 약 2.5시간",
    recommendedTime: "10:00 ~ 14:00 또는 14:00 ~ 18:00",
  },
  {
    id: "paju-lake-bridge",
    axis: "paju",
    order: 5,
    durationBadge: "4H",
    name: "LAKE & BRIDGE — 마장호수 출렁다리",
    nameEn: "LAKE & BRIDGE",
    hook: "산에 오르지 않고, 호수 위를 걷는다.",
    intro:
      "호수를 가로지르는 출렁다리를 건너고 호숫가 산책로를 도는 코스입니다.\n등산 부담이 없어 가족·시니어 방문객에게 맞고, 다리 위에서 보는 호수 풍경이\n사진으로 잘 남습니다. DMZ나 근현대사에 관심이 적은 방문객에게 제시할\n자연형 대안으로 가장 확실한 선택입니다.",
    stops: [
      { name: "마장호수 출렁다리", note: "호수를 가로지르는 현수교. 흔들림이 있어 아이들이 좋아합니다." },
      { name: "호숫가 산책로", note: "데크길 한 바퀴. 무리 없는 평지 코스입니다." },
      { name: "호수 전망 카페", note: "산책 후 마무리 지점." },
    ],
    transport: "차량 전용 — 고양 기준 약 40분대",
    duration: "편도 약 40분대 / 체류 약 2시간",
    recommendedTime: "11:00 ~ 15:00",
    note: "운영시간: 3~10월 09:00~18:00 / 11~2월 09:00~17:00\n※ 확인 필요 — 고양 출발 실주행 시간",
  },
  {
    id: "paju-k-nature",
    axis: "paju",
    order: 6,
    durationBadge: "4H",
    name: "K-NATURE ADVENTURE — 감악산 출렁다리",
    nameEn: "K-NATURE",
    hook: "계곡 위 150미터, 산이 주는 한국.",
    intro:
      "감악산 출렁다리를 건너고 숲길과 계곡을 따라 전망 지점까지 걷는 코스입니다.\n활동적인 여행을 원하는 유럽·미주 방문객에게 반응이 좋습니다.\n다만 4시간 중 이동 비중이 커서 **차량 전용 상품**으로만 운용해야 합니다.\n대중교통 안내로 내보내면 현장에서 문제가 생깁니다.",
    stops: [
      { name: "감악산 출렁다리", note: "계곡을 가로지르는 현수교. 고소공포가 있으면 우회로 이용." },
      { name: "숲길·계곡", note: "다리 이후 완만한 산책 구간." },
      { name: "전망 지점", note: "파주 북부 능선 조망." },
    ],
    transport: "차량 전용 — 고양 기준 약 1시간 내외",
    duration: "편도 약 1시간 / 체류 약 2시간",
    recommendedTime: "10:00 ~ 14:00",
    note: "※ 확인 필요 — 고양 출발 실주행 시간, 동절기 통제 여부",
  },
];

// ─── 경기 축 5코스 ─────────────────────────────────────────────────────────

const GYEONGGI_COURSES: DayTripCourse[] = [
  {
    id: "gyeonggi-royal-suwon",
    axis: "gyeonggi",
    order: 1,
    durationBadge: "4H",
    name: "ROYAL SUWON 4H — 수원화성 · 화성행궁 · 행리단길",
    nameEn: "Royal Suwon",
    hook: "성벽을 걷고, 행궁을 지나, 골목에서 저녁을 먹는다.",
    intro:
      "유네스코 세계유산 수원화성의 성벽을 걷고 화성행궁을 둘러본 뒤, 행궁 앞\n행리단길 골목으로 내려오는 코스입니다. 왕이 머물던 행궁과 젊은 상권이\n걸어서 이어져 있어 역사와 현재가 한 동선에 들어옵니다. 경기권에서 서울\n4시간 코스와 가장 비슷한 밀도로 상품화할 수 있는 유일한 곳입니다.",
    stops: [
      { name: "화성행궁", note: "정조가 머물던 행궁. 무예 시범 등 상설 프로그램이 있습니다." },
      { name: "수원화성", note: "성벽길 구간 도보. 화성열차를 타면 체력 부담이 줄어듭니다." },
      { name: "행리단길", note: "행궁 앞 카페·식당 골목. 마무리 지점으로 좋습니다." },
    ],
    transport: "차량 — 일산 기준 약 54~57km · 약 54~58분",
    duration: "편도 약 1시간 / 체류 약 2시간",
    recommendedTime: "13:00 ~ 17:00",
    note: "운영시간: 화성행궁 09:00~18:00\n5월 1일~11월 1일 중 금·토·일·공휴일 야간개장 운영\n※ 야간개장 활용 — 가을 시즌에는 15:00 출발로 야간 관람까지 붙일 수 있습니다.",
  },
  {
    id: "gyeonggi-korean-garden",
    axis: "gyeonggi",
    order: 2,
    durationBadge: "5H",
    name: "KOREAN GARDEN ESCAPE 5H — 아침고요수목원",
    nameEn: "Korean Garden Escape",
    hook: "한국식 정원이 무엇인지, 설명 대신 보여준다.",
    intro:
      "한국 전통 정원 양식으로 조성된 수목원을 걷는 코스입니다. 계절 변화가\n그대로 상품이 되는 곳이라 봄꽃·가을 단풍·겨울 조명 시즌마다 다른 얼굴을\n보여줍니다. 드라마 촬영지로도 여러 차례 소개돼 한류 방문객에게 설명하기\n쉽고, 산행 부담 없이 자연을 보고 싶은 방문객에게 맞습니다.",
    stops: [
      { name: "한국정원", note: "수목원의 중심 구역. 전통 조경 양식이 집약돼 있습니다." },
      { name: "계절 정원", note: "봄꽃·가을 단풍·겨울 오색별빛정원전." },
      { name: "산책로·카페", note: "완만한 경사. 전 구간 도보 가능합니다." },
    ],
    transport: "차량 — 가평 방면",
    duration: "편도 약 1시간 20분대 / 체류 약 2~2.5시간",
    recommendedTime: "11:00 ~ 16:00",
    note: "※ 확인 필요 — 고양 출발 실주행 시간, 겨울 조명 축제 운영 기간",
  },
  {
    id: "gyeonggi-living-korea",
    axis: "gyeonggi",
    order: 3,
    durationBadge: "5-6H",
    name: "LIVING KOREA 5–6H — 한국민속촌",
    nameEn: "Living Korea",
    hook: "경복궁이 왕의 한국이라면, 여기는 사람들이 살던 한국이다.",
    intro:
      "한옥과 전통 생활공간, 농촌 풍경, 민속 공연과 음식이 한 공간에 모인 곳입니다.\n**서울의 경복궁 코스와 겹치지 않는 것이 이 상품의 핵심입니다.** 궁궐이\n왕실을 보여준다면 민속촌은 생활을 보여줍니다. 두 코스를 이틀에 나눠\n판매하면 서로를 보완합니다. 공연 시간표에 맞춰 동선을 짜야 완성도가 올라갑니다.",
    stops: [
      { name: "전통마을", note: "지역별 한옥을 옮겨 지은 구역. 실제 크기입니다." },
      { name: "민속 공연", note: "농악·줄타기·마상무예. 시간표 확인 후 동선을 맞추십시오." },
      { name: "체험·전통음식", note: "공방 체험과 장터 음식." },
    ],
    transport: "차량 — 용인 방면",
    duration: "편도 약 1시간 내외 / 체류 약 3~4시간",
    recommendedTime: "10:00 ~ 16:00",
    note: "※ 확인 필요 — 고양 출발 실주행 시간, 공연 시간표(계절별 상이)",
  },
  {
    id: "gyeonggi-nami-island",
    axis: "gyeonggi",
    order: 4,
    durationBadge: "6H",
    name: "NAMI ISLAND ESCAPE 6H — 남이섬",
    nameEn: "Nami Island Escape",
    hook: "5분 배를 타면, 한국에서 가장 유명한 나무길이 나온다.",
    intro:
      "가평 선착장에서 배로 5분 들어가는 섬입니다. 메타세쿼이아길과 은행나무길,\n강변 산책로가 이어져 사진 찍기 좋고, 한류 촬영지로 오랫동안 알려져\n외국인 인지도가 매우 높습니다. 연중 운영합니다.\n\n**주의 — 4시간 상품으로 만들면 안 됩니다.** 차량 이동만 왕복 3시간에\n가까운 데다 주차·매표·승선 대기가 더해집니다. 6시간이 맞습니다.",
    stops: [
      { name: "가평 선착장", note: "경기도 가평군 가평읍 북한강변로 1024. 매표 후 승선." },
      { name: "메타세쿼이아길", note: "섬의 대표 이미지. 입도 직후 바로 이어집니다." },
      { name: "은행나무길·강변", note: "가을 시즌이 가장 강합니다." },
      { name: "섬 내 카페", note: "귀환 배편 전 마무리 지점." },
    ],
    transport: "차량 — 일산 기준 약 91.8km · 약 1시간 23분 + 도선 약 5분",
    duration: "편도 약 1시간 30분 / 체류 약 2.5~3시간",
    recommendedTime: "09:30 ~ 15:30",
    note: '※ 남이섬은 행정구역상 강원특별자치도 춘천이나, 관광객 진입은 경기도 가평\n선착장을 통합니다. 안내 문안에는 "가평 선착장 경유"로 표기하십시오.',
  },
  {
    id: "gyeonggi-everland",
    axis: "gyeonggi",
    order: 5,
    durationBadge: "8H",
    name: "EVERLAND FULL DAY 8H — 에버랜드",
    nameEn: "Everland Full Day",
    hook: "하루를 통째로 쓰는 대신, 하루로 끝난다.",
    intro:
      "사파리와 판다월드, 대형 어트랙션을 갖춘 국내 최대 테마파크입니다.\n외국인 가족·학생·단체 방문객에게 반응이 가장 확실한 상품입니다.\n\n**주의 — 절대 4시간 상품으로 만들지 마십시오.** 왕복 2시간을 빼면\n두 시간밖에 남지 않아 입장과 대기만 하다 나오게 됩니다. **8시간 종일권만\n판매합니다.** 시간을 줄이면 상품이 아니라 불만이 됩니다.",
    stops: [
      { name: "사파리월드", note: "차량 탑승 관람. 오전이 대기가 짧습니다." },
      { name: "판다월드", note: "실내 구역. 날씨 영향을 받지 않습니다." },
      { name: "어트랙션", note: "대기 시간 앱 확인 후 동선을 짜십시오." },
      { name: "시즌 축제", note: "튤립·장미·할로윈·일루미네이션." },
    ],
    transport: "차량 — 일산역 기준 약 68km · 약 1시간 4분",
    duration: "편도 약 1시간 / 체류 약 6시간",
    recommendedTime: "09:00 ~ 17:00",
  },
];

/** 총 17코스 시드 배열 (SEOUL 6 + PAJU 6 + GYEONGGI 5). */
export const dayTripCourses: DayTripCourse[] = [
  ...SEOUL_COURSES,
  ...PAJU_COURSES,
  ...GYEONGGI_COURSES,
];
