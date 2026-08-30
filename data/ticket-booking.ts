export type TicketCategory =
  | "concert"
  | "festival"
  | "exhibition"
  | "family"
  | "k-pop";

export interface TicketOption {
  id: string;
  label: string;
  price: number;
  benefits: string[];
}

export type TicketLocale = "en" | "ja" | "zh-CN" | "zh-TW";

export interface TicketTranslation {
  badge?: string;
  venue?: string;
  tags?: string[];
  options?: Array<{ id: string; label: string; benefits?: string[] }>;
}

export interface TicketProduct {
  id: string;
  category: TicketCategory;
  badge: string;
  title: string;
  subtitle: string;
  venue: string;
  dateText: string;
  /**
   * ISO YYYY-MM-DD. 오더 #P9: WhatsOnSection 의 "지난 이벤트 자동 숨김" 훅.
   * dateText 자유 파싱 대신 명시적 필드. 값 없으면 상시 노출 취급.
   */
  endDate?: string;
  imageTone: string;
  summary: string;
  description: string;
  posterLabel: string;
  tags: string[];
  options: TicketOption[];
  translations?: Partial<Record<TicketLocale, TicketTranslation>>;
  // 상세 소개 콘텐츠
  imageUrl?: string;
  images?: string[];
  duration?: string;
  ageLimit?: string;
  /**
   * 사진 크레딧 문자열 (오더 #P9). 값 없거나 빈 문자열이면 렌더 자체 스킵.
   */
  credit?: string;
  // 상세페이지 탭 콘텐츠
  tabNotice?: string;
  tabCasting?: string;
  tabDetails?: string;
  tabPrice?: string;
  tabDiscount?: string;
  tabUsageInfo?: string;
  tabVenue?: string;
  tabCancellation?: string;
}

export const ticketCategories: Array<{ id: TicketCategory | "all"; label: string }> = [
  { id: "all", label: "전체" },
  { id: "concert", label: "콘서트" },
  { id: "festival", label: "페스티벌" },
  { id: "exhibition", label: "전시/행사" },
  { id: "family", label: "아동/가족" },
  { id: "k-pop", label: "K-POP" },
];

export const ticketProducts: TicketProduct[] = [
  {
    id: "goyang-kpop-arena-open",
    category: "k-pop",
    badge: "오픈 예정",
    title: "GOYANG K-POP ARENA OPEN STAGE",
    subtitle: "고양형 K-POP 연계 공연",
    venue: "고양 K-POP 아레나",
    dateText: "2026.05.14 - 2026.05.16",
    endDate: "2026-05-16",
    imageTone: "from-cyan-200 via-fuchsia-200 to-sky-300",
    posterLabel: "ARENA",
    summary: "고양 공연 인프라의 시작을 알리는 대표 K-POP 라이브 시리즈입니다.",
    description:
      "고양 K-POP 아레나 개장과 함께 진행되는 시그니처 공연 시리즈입니다. 프리미엄존, 일반존, 가족 관람존으로 구성되며 공연 이후 DMC 체류 프로그램과도 연결됩니다.",
    tags: ["K-POP", "공연", "프리미엄 좌석"],
    duration: "120분 (인터미션 없음)",
    ageLimit: "전체 관람가",
    tabNotice: "※ 공연 시작 30분 후에는 입장이 제한됩니다.\n※ 공연장 내 음식 반입 금지 (음료는 뚜껑 있는 것만 허용)\n※ 사진 촬영 가능, 영상 촬영 및 플래시 사용 금지",
    tabCasting: "■ 아티스트 라인업\n\n• 헤드라이너: 고양 K-POP 아레나 개장 기념 스페셜 아티스트 (추후 공개)\n• 서포팅: 고양시 출신 신인 아티스트 3팀\n• 오프닝 DJ 세트 포함\n\n■ 공연 구성\n• 오프닝 퍼포먼스 (20분)\n• 메인 라이브 공연 (100분)\n\n⚠️ 캐스팅은 주최측 사정에 따라 변경될 수 있습니다.",
    tabDetails: "고양 K-POP 아레나 개장을 알리는 최초의 공식 시그니처 공연입니다.\n\n🎤 공연 소개\n고양시가 새롭게 선보이는 K-POP 아레나의 개관 공연으로, 국내외 K-POP 팬들을 위한 프리미엄 라이브 무대입니다.\n\n🏟️ 좌석 구성\n- VIP 구역: 스테이지 정면 1~5열, 특별 굿즈 포함\n- R석: 메인 플로어 지정석\n- S석: 사이드 및 2층 지정석\n\n✨ 특별 혜택\n- VIP 구매자: 공연 전 포토월 참여 기회 제공\n- 얼리버드 구매자: 한정판 포스터 증정",
    tabUsageInfo: "• 공연장: 고양 K-POP 아레나 (KINTEX 인접)\n• 입장: 공연 시작 1시간 전부터\n• 모바일 티켓 또는 실물 티켓 지참 필수\n• 주차: 공연장 주차장 이용 가능 (유료)\n• 대중교통: 대화역 도보 15분 / 셔틀버스 운행\n• 분실물: 공연장 운영팀 031-XXXX-XXXX",
    tabPrice: "■ 좌석 등급별 가격\n\n• VIP 패키지: 198,000원\n  - 스테이지 정면 1~5열 지정석\n  - 공연 전 포토월 참여 기회\n  - 한정판 웰컴 굿즈 증정\n\n• R석: 143,000원\n  - 메인 플로어 지정석\n  - 모바일 티켓 발권\n\n• S석: 99,000원\n  - 사이드 및 2층 지정석\n  - 현장 발권 가능\n\n※ 가격은 부가세 포함 금액입니다.\n※ 1인당 최대 4매 구매 가능",
    tabDiscount: "🎟️ 얼리버드 할인\n• 오픈 후 72시간 이내 구매 시 전 좌석 10% 할인\n• 한정 수량 소진 시 조기 종료\n\n🎓 청소년 할인\n• 만 13세~18세: S석 30% 할인\n• 학생증 또는 청소년증 현장 제시 필수\n\n👨‍👩‍👧 가족 패키지 할인\n• 동일 좌석 4인 동반 구매 시 1인 무료\n• VIP·R석 적용 가능\n\n🏢 단체 할인\n• 20인 이상 단체: 15% 할인\n• 50인 이상 단체: 20% 할인\n• 사전 문의 필수 (contact@goyang-mice.kr)\n\n※ 할인은 중복 적용 불가\n※ 얼리버드 종료 후 정가 적용",
    tabVenue: "📍 공연 장소\n고양 K-POP 아레나 (KINTEX 인접)\n경기도 고양시 일산서구 킨텍스로 217-60\n\n🚇 대중교통\n• 지하철: 대화역 (3호선) 도보 15분\n• 버스: 고양 종합터미널에서 셔틀버스 운행 (공연 당일)\n• 공항버스: 인천공항 리무진 직행 운행\n\n🚗 자가용\n• 네이버맵: '고양 K-POP 아레나' 검색\n• 주차장: 아레나 전용 주차장 3,000면 운영 (유료)\n• 주차 요금: 시간당 2,000원 / 공연 당일 5,000원 정액\n\n🏨 인근 숙박\n• KINTEX 인근 호텔 다수 위치\n• 숙박 패키지 예약 시 셔틀버스 무료 이용 가능\n\n⚠️ 안내\n• 공연 시작 1시간 전부터 입장 가능\n• 공연 시작 30분 후 입장 제한",
    tabCancellation: "■ 취소 및 환불 규정\n\n• 구매 후 7일 이내 & 공연일 10일 전: 100% 환불\n• 공연일 9일 전 ~ 7일 전: 70% 환불\n• 공연일 6일 전 ~ 3일 전: 50% 환불\n• 공연일 2일 전 ~ 당일: 환불 불가\n\n■ 공연 취소 시\n주최측 사정으로 인한 공연 취소 시 100% 환불 처리됩니다.\n\n■ 환불 처리\n• 신용카드: 3~5 영업일\n• 카카오페이·계좌이체: 2~3 영업일",
    options: [
      { id: "vip", label: "VIP 패키지", price: 198000, benefits: ["우선 입장", "웰컴 굿즈"] },
      { id: "r", label: "R석", price: 143000, benefits: ["지정 좌석", "모바일 티켓"] },
      { id: "s", label: "S석", price: 99000, benefits: ["지정 좌석", "현장 발권 가능"] },
      // 임시값(고양시 정보 확보 시 교체 예정)
      { id: "a", label: "A석", price: 79000, benefits: ["지정 좌석"] },
      { id: "b", label: "B석", price: 59000, benefits: ["지정 좌석"] },
    ],
    translations: {
      en: { badge: "Coming Soon", venue: "Goyang K-POP Arena", tags: ["K-POP", "Concert", "Premium Seats"], options: [{ id: "vip", label: "VIP Package", benefits: ["Priority Entry", "Welcome Goods"] }, { id: "r", label: "R-Class", benefits: ["Assigned Seat", "Mobile Ticket"] }, { id: "s", label: "S-Class", benefits: ["Assigned Seat", "On-site Ticketing"] }, { id: "a", label: "A-Class", benefits: ["Assigned Seat"] }, { id: "b", label: "B-Class", benefits: ["Assigned Seat"] }] },
      ja: { badge: "近日オープン", venue: "高陽K-POPアリーナ", tags: ["K-POP", "公演", "プレミアム席"], options: [{ id: "vip", label: "VIPパッケージ", benefits: ["優先入場", "ウェルカムグッズ"] }, { id: "r", label: "R席", benefits: ["指定席", "モバイルチケット"] }, { id: "s", label: "S席", benefits: ["指定席", "現場発券可"] }, { id: "a", label: "A席", benefits: ["指定席"] }, { id: "b", label: "B席", benefits: ["指定席"] }] },
      "zh-CN": { badge: "即将开放", venue: "高阳K-POP竞技场", tags: ["K-POP", "演出", "高级座位"], options: [{ id: "vip", label: "VIP套餐", benefits: ["优先入场", "欢迎礼品"] }, { id: "r", label: "R区", benefits: ["对号入座", "手机票"] }, { id: "s", label: "S区", benefits: ["对号入座", "现场取票"] }, { id: "a", label: "A区", benefits: ["对号入座"] }, { id: "b", label: "B区", benefits: ["对号入座"] }] },
      "zh-TW": { badge: "即將開放", venue: "高陽K-POP競技場", tags: ["K-POP", "演出", "高級座位"], options: [{ id: "vip", label: "VIP套餐", benefits: ["優先入場", "歡迎禮品"] }, { id: "r", label: "R區", benefits: ["對號入座", "手機票"] }, { id: "s", label: "S區", benefits: ["對號入座", "現場取票"] }, { id: "a", label: "A區", benefits: ["對號入座"] }, { id: "b", label: "B區", benefits: ["對號入座"] }] },
    },
  },
  {
    id: "goyang-con-city-festival",
    category: "festival",
    badge: "2차 티켓 오픈",
    title: "GOYANG CON CITY FESTIVAL",
    subtitle: "도시 라이프스타일 뮤직 페스티벌",
    venue: "일산 문화광장",
    dateText: "2026.06.20 - 2026.06.21",
    endDate: "2026-06-21",
    imageTone: "from-yellow-100 via-cyan-200 to-lime-200",
    posterLabel: "FEST",
    summary: "음악, 푸드, 야간체험을 함께 즐기는 여름 시즌 야외 페스티벌입니다.",
    description:
      "도심 속 야외 공간에서 열리는 라이프스타일 뮤직 페스티벌입니다. 공연 관람과 함께 푸드존, 로컬 굿즈, 야간 콘텐츠를 묶어 체류형 일정 구성이 가능합니다.",
    tags: ["페스티벌", "야외 공연", "푸드존"],
    options: [
      { id: "two-day", label: "양일권", price: 129000, benefits: ["양일 입장", "MD 구매권"] },
      { id: "day-pass", label: "1일권", price: 78000, benefits: ["지정 날짜 입장"] },
    ],
    translations: {
      en: { badge: "2nd Ticket Sale", venue: "Ilsan Cultural Plaza", tags: ["Festival", "Outdoor Concert", "Food Zone"], options: [{ id: "two-day", label: "2-Day Pass", benefits: ["2-Day Entry", "MD Voucher"] }, { id: "day-pass", label: "1-Day Pass", benefits: ["Single Day Entry"] }] },
      ja: { badge: "第2次チケット販売", venue: "一山文化広場", tags: ["フェスティバル", "野外公演", "フードゾーン"], options: [{ id: "two-day", label: "2日間パス", benefits: ["両日入場", "MD引換券"] }, { id: "day-pass", label: "1日券", benefits: ["指定日入場"] }] },
      "zh-CN": { badge: "第二轮票务开放", venue: "一山文化广场", tags: ["音乐节", "户外演出", "美食区"], options: [{ id: "two-day", label: "两日票", benefits: ["两日入场", "周边兑换券"] }, { id: "day-pass", label: "一日票", benefits: ["指定日入场"] }] },
      "zh-TW": { badge: "第二輪票務開放", venue: "一山文化廣場", tags: ["音樂節", "戶外演出", "美食區"], options: [{ id: "two-day", label: "兩日票", benefits: ["兩日入場", "周邊兌換券"] }, { id: "day-pass", label: "一日票", benefits: ["指定日入場"] }] },
    },
  },
  {
    id: "goyang-art-night",
    category: "exhibition",
    badge: "좌석 추가 오픈",
    title: "GOYANG ART NIGHT EXHIBITION",
    subtitle: "미디어아트 + 야간 전시",
    venue: "고양아람누리 전시관",
    dateText: "2026.05.01 - 2026.05.30",
    endDate: "2026-05-30",
    imageTone: "from-stone-200 via-indigo-200 to-pink-200",
    posterLabel: "ART",
    summary: "야간 관람과 전시 체험 프로그램을 결합한 몰입형 전시 티켓입니다.",
    description:
      "미디어아트형 전시와 야간 아트워크 프로그램, 로컬 카페 쿠폰을 결합한 전시형 티켓입니다. 단체 관람과 기업형 방문객 예약도 지원할 수 있습니다.",
    tags: ["전시", "야간", "미디어아트"],
    options: [
      { id: "docent", label: "도슨트 패키지", price: 42000, benefits: ["도슨트 포함", "카페 쿠폰"] },
      { id: "general", label: "일반 입장권", price: 18000, benefits: ["전시 입장", "모바일 티켓"] },
    ],
    translations: {
      en: { badge: "Extra Seats Available", venue: "Goyang Aramnuri Exhibition Hall", tags: ["Exhibition", "Night", "Media Art"], options: [{ id: "docent", label: "Docent Package", benefits: ["Guided Tour", "Café Coupon"] }, { id: "general", label: "General Admission", benefits: ["Exhibition Entry", "Mobile Ticket"] }] },
      ja: { badge: "追加席販売中", venue: "高陽アラムヌリ展示館", tags: ["展示", "夜間", "メディアアート"], options: [{ id: "docent", label: "解説付きパッケージ", benefits: ["解説ガイド付き", "カフェクーポン"] }, { id: "general", label: "一般入場券", benefits: ["展示入場", "モバイルチケット"] }] },
      "zh-CN": { badge: "增开座位", venue: "高阳阿拉木努里展览馆", tags: ["展览", "夜间", "媒体艺术"], options: [{ id: "docent", label: "导览套餐", benefits: ["含导览", "咖啡券"] }, { id: "general", label: "普通入场券", benefits: ["展览入场", "手机票"] }] },
      "zh-TW": { badge: "增開座位", venue: "高陽阿拉木努里展覽館", tags: ["展覽", "夜間", "媒體藝術"], options: [{ id: "docent", label: "導覽套餐", benefits: ["含導覽", "咖啡券"] }, { id: "general", label: "普通入場券", benefits: ["展覽入場", "手機票"] }] },
    },
  },
  {
    id: "goyang-family-play",
    category: "family",
    badge: "가족 추천",
    title: "GOYANG FAMILY PLAY WEEK",
    subtitle: "아동/가족 체험 공연",
    venue: "고양어울림누리",
    dateText: "2026.07.03 - 2026.07.12",
    endDate: "2026-07-12",
    imageTone: "from-pink-100 via-amber-100 to-sky-200",
    posterLabel: "FAMILY",
    summary: "아이와 가족이 함께 즐기는 체험형 공연과 워크숍 프로그램입니다.",
    description:
      "가족 단위 방문객을 위해 공연 관람과 만들기 체험, 로컬 카페 쿠폰을 결합한 시즌형 티켓입니다. 숙박과 카페 예약과도 연동하기 좋습니다.",
    tags: ["가족", "체험 공연", "주말 프로그램"],
    options: [
      { id: "family-pack", label: "가족 패키지 4인", price: 136000, benefits: ["4인 입장", "체험 재료 포함"] },
      { id: "adult", label: "성인 1인권", price: 38000, benefits: ["공연 입장"] },
      { id: "child", label: "아동 1인권", price: 24000, benefits: ["공연 입장", "체험 참여"] },
    ],
    translations: {
      en: { badge: "Family Pick", venue: "Goyang Eoullim Nuri", tags: ["Family", "Experience Show", "Weekend Program"], options: [{ id: "family-pack", label: "Family Pack (4 persons)", benefits: ["Entry for 4", "Activity Kit"] }, { id: "adult", label: "Adult 1 Person", benefits: ["Show Entry"] }, { id: "child", label: "Child 1 Person", benefits: ["Show Entry", "Activity"] }] },
      ja: { badge: "ファミリー向け", venue: "高陽オウルリムヌリ", tags: ["ファミリー", "体験公演", "週末プログラム"], options: [{ id: "family-pack", label: "ファミリー4名", benefits: ["4名入場", "体験キット付き"] }, { id: "adult", label: "大人1名", benefits: ["公演入場"] }, { id: "child", label: "子ども1名", benefits: ["公演入場", "体験参加"] }] },
      "zh-CN": { badge: "家庭推荐", venue: "高阳欧拉利姆努里", tags: ["家庭", "体验演出", "周末活动"], options: [{ id: "family-pack", label: "家庭4人套餐", benefits: ["4人入场", "含体验材料"] }, { id: "adult", label: "成人1张", benefits: ["演出入场"] }, { id: "child", label: "儿童1张", benefits: ["演出入场", "体验活动"] }] },
      "zh-TW": { badge: "家庭推薦", venue: "高陽歐拉利姆努里", tags: ["家庭", "體驗演出", "週末活動"], options: [{ id: "family-pack", label: "家庭4人套餐", benefits: ["4人入場", "含體驗材料"] }, { id: "adult", label: "成人1張", benefits: ["演出入場"] }, { id: "child", label: "兒童1張", benefits: ["演出入場", "體驗活動"] }] },
    },
  },
  {
    id: "goyang-kmusic-series",
    category: "concert",
    badge: "한정 특가",
    title: "GOYANG K-MUSIC SERIES",
    subtitle: "보컬/밴드 큐레이션 공연",
    venue: "고양아람누리 아람극장",
    dateText: "2026.04.24 - 2026.04.25",
    endDate: "2026-04-25",
    imageTone: "from-slate-800 via-slate-700 to-neutral-700",
    posterLabel: "LIVE",
    summary: "보컬과 밴드 중심으로 구성된 고양형 라이브 시리즈입니다.",
    description:
      "실내 공연장 중심의 프리미엄 라이브 콘텐츠로, 공연장 접근성과 체류 동선을 고려한 티켓 구조입니다. VIP 응대와 기업 초청 운영도 지원할 수 있습니다.",
    tags: ["콘서트", "밴드", "실내 공연"],
    options: [
      { id: "premium", label: "프리미엄석", price: 156000, benefits: ["전용 게이트", "MD 쿠폰"] },
      { id: "standard", label: "일반석", price: 88000, benefits: ["지정 좌석"] },
    ],
    translations: {
      en: { badge: "Limited Offer", venue: "Goyang Aramnuri Aram Theater", tags: ["Concert", "Band", "Indoor Show"], options: [{ id: "premium", label: "Premium Seat", benefits: ["Dedicated Gate", "MD Coupon"] }, { id: "standard", label: "Standard Seat", benefits: ["Assigned Seat"] }] },
      ja: { badge: "限定特価", venue: "高陽アラムヌリ アラム劇場", tags: ["コンサート", "バンド", "室内公演"], options: [{ id: "premium", label: "プレミアムシート", benefits: ["専用ゲート", "MDクーポン"] }, { id: "standard", label: "一般席", benefits: ["指定席"] }] },
      "zh-CN": { badge: "限时特惠", venue: "高阳阿拉木努里剧场", tags: ["音乐会", "乐队", "室内演出"], options: [{ id: "premium", label: "高级座位", benefits: ["专属通道", "周边优惠券"] }, { id: "standard", label: "普通座位", benefits: ["对号入座"] }] },
      "zh-TW": { badge: "限時特惠", venue: "高陽阿拉木努里劇場", tags: ["音樂會", "樂隊", "室內演出"], options: [{ id: "premium", label: "高級座位", benefits: ["專屬通道", "周邊優惠券"] }, { id: "standard", label: "普通座位", benefits: ["對號入座"] }] },
    },
  },
  {
    id: "goyang-mice-opening-show",
    category: "concert",
    badge: "오픈 예정",
    title: "GOYANG MICE OPENING SHOW",
    subtitle: "비즈니스 연계 스페셜 퍼포먼스",
    venue: "KINTEX 야외무대",
    dateText: "2026.09.12",
    endDate: "2026-09-12",
    imageTone: "from-sky-200 via-blue-200 to-indigo-300",
    posterLabel: "MICE",
    summary: "전시 참가자와 VIP를 위한 스페셜 퍼포먼스 티켓입니다.",
    description:
      "MICE 행사와 연동되는 특별 스테이지로, 바이어와 VIP 고객을 대상으로 하는 프리미엄 좌석과 네트워킹 입장권을 함께 운영할 수 있습니다.",
    tags: ["MICE", "VIP", "스페셜 무대"],
    options: [
      { id: "networking", label: "네트워킹 패키지", price: 210000, benefits: ["리셉션 포함", "우선 입장"] },
      { id: "general", label: "일반석", price: 69000, benefits: ["모바일 티켓"] },
    ],
    translations: {
      en: { badge: "Coming Soon", venue: "KINTEX Outdoor Stage", tags: ["MICE", "VIP", "Special Stage"], options: [{ id: "networking", label: "Networking Package", benefits: ["Reception Included", "Priority Entry"] }, { id: "general", label: "General Seat", benefits: ["Mobile Ticket"] }] },
      ja: { badge: "近日オープン", venue: "KINTEX野外ステージ", tags: ["MICE", "VIP", "スペシャルステージ"], options: [{ id: "networking", label: "ネットワーキングパッケージ", benefits: ["レセプション込み", "優先入場"] }, { id: "general", label: "一般席", benefits: ["モバイルチケット"] }] },
      "zh-CN": { badge: "即将开放", venue: "KINTEX户外舞台", tags: ["MICE", "VIP", "特别舞台"], options: [{ id: "networking", label: "社交套餐", benefits: ["含接待会", "优先入场"] }, { id: "general", label: "普通座位", benefits: ["手机票"] }] },
      "zh-TW": { badge: "即將開放", venue: "KINTEX戶外舞台", tags: ["MICE", "VIP", "特別舞台"], options: [{ id: "networking", label: "社交套餐", benefits: ["含接待會", "優先入場"] }, { id: "general", label: "普通座位", benefits: ["手機票"] }] },
    },
  },
  {
    id: "goyang-local-stage",
    category: "concert",
    badge: "오늘 오픈",
    title: "GOYANG LOCAL STAGE",
    subtitle: "로컬 크리에이터 야외 라이브",
    venue: "일산호수공원 야외무대",
    dateText: "2026.08.08 - 2026.08.09",
    endDate: "2026-08-09",
    imageTone: "from-emerald-100 via-cyan-100 to-blue-200",
    posterLabel: "LOCAL",
    summary: "고양 로컬 브랜드와 크리에이터가 함께 만드는 야외 공연 프로그램입니다.",
    description:
      "공연과 플리마켓, 푸드트럭, 체험 부스를 함께 즐길 수 있는 고양형 로컬 스테이지입니다. 커플, 가족, 소규모 그룹 관람객에게 잘 맞습니다.",
    tags: ["로컬", "야외무대", "플리마켓"],
    options: [
      { id: "weekend", label: "주말 패스", price: 54000, benefits: ["양일 입장"] },
      { id: "single", label: "1일권", price: 32000, benefits: ["하루 입장"] },
    ],
    translations: {
      en: { badge: "On Sale Now", venue: "Ilsan Lake Park Outdoor Stage", tags: ["Local", "Outdoor Stage", "Flea Market"], options: [{ id: "weekend", label: "Weekend Pass", benefits: ["2-Day Entry"] }, { id: "single", label: "1-Day Pass", benefits: ["Single Day Entry"] }] },
      ja: { badge: "本日オープン", venue: "一山湖水公園野外ステージ", tags: ["ローカル", "野外ステージ", "フリーマーケット"], options: [{ id: "weekend", label: "週末パス", benefits: ["両日入場"] }, { id: "single", label: "1日券", benefits: ["1日入場"] }] },
      "zh-CN": { badge: "今日开售", venue: "一山湖水公园户外舞台", tags: ["本地", "户外舞台", "跳蚤市场"], options: [{ id: "weekend", label: "周末通票", benefits: ["两日入场"] }, { id: "single", label: "一日票", benefits: ["单日入场"] }] },
      "zh-TW": { badge: "今日開售", venue: "一山湖水公園戶外舞台", tags: ["本地", "戶外舞台", "跳蚤市場"], options: [{ id: "weekend", label: "週末通票", benefits: ["兩日入場"] }, { id: "single", label: "一日票", benefits: ["單日入場"] }] },
    },
  },
  {
    id: "goyang-night-run-ticket",
    category: "festival",
    badge: "티켓 오픈",
    title: "GOYANG NIGHT RUN & SHOW",
    subtitle: "야간 러닝 + 공연 결합 티켓",
    venue: "고양종합운동장",
    dateText: "2026.10.02",
    endDate: "2026-10-02",
    imageTone: "from-violet-200 via-fuchsia-200 to-indigo-300",
    posterLabel: "RUN",
    summary: "야간 러닝 이벤트와 메인 공연을 함께 즐기는 복합형 티켓입니다.",
    description:
      "러닝 이벤트 참여 후 메인 공연과 푸드 콘텐츠를 즐길 수 있는 시즌형 티켓입니다. 단체 참가자용 패키지와 기본형 티켓을 함께 운영할 수 있습니다.",
    tags: ["스포츠", "야간 이벤트", "패키지 티켓"],
    options: [
      { id: "race-pack", label: "러닝 패키지", price: 72000, benefits: ["러닝 키트", "공연 입장"] },
      { id: "show-only", label: "공연 관람권", price: 39000, benefits: ["공연 입장"] },
    ],
    translations: {
      en: { badge: "Tickets Available", venue: "Goyang Stadium", tags: ["Sports", "Night Event", "Package Ticket"], options: [{ id: "race-pack", label: "Running Package", benefits: ["Running Kit", "Show Entry"] }, { id: "show-only", label: "Show Ticket", benefits: ["Show Entry"] }] },
      ja: { badge: "チケット販売中", venue: "高陽総合運動場", tags: ["スポーツ", "夜間イベント", "パッケージチケット"], options: [{ id: "race-pack", label: "ランニングパッケージ", benefits: ["ランニングキット", "公演入場"] }, { id: "show-only", label: "公演観覧券", benefits: ["公演入場"] }] },
      "zh-CN": { badge: "票务开放", venue: "高阳综合运动场", tags: ["体育", "夜间活动", "套票"], options: [{ id: "race-pack", label: "跑步套餐", benefits: ["跑步装备", "演出入场"] }, { id: "show-only", label: "演出门票", benefits: ["演出入场"] }] },
      "zh-TW": { badge: "票務開放", venue: "高陽綜合運動場", tags: ["體育", "夜間活動", "套票"], options: [{ id: "race-pack", label: "跑步套餐", benefits: ["跑步裝備", "演出入場"] }, { id: "show-only", label: "演出門票", benefits: ["演出入場"] }] },
    },
  },
];

export function getTicketProduct(ticketId?: string) {
  if (!ticketId) {
    return ticketProducts[0];
  }

  return ticketProducts.find((ticket) => ticket.id === ticketId) ?? ticketProducts[0];
}
