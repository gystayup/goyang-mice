// 오더 #C51: 카테고리 7종 확장 (activity·admission·tour 신설). legacy "k-pop" 은
//   Supabase 데이터 하위 호환을 위해 타입에 유지 · 렌더는 normalizeTicketCategory 로
//   concert 로 매핑 (data/ticket-categories.ts). Supabase 데이터 변경 금지 (G7 LOCK).
export type TicketCategory =
  | "concert"
  | "festival"
  | "exhibition"
  | "family"
  | "activity"
  | "admission"
  | "tour"
  | "k-pop";

export interface TicketOption {
  id: string;
  label: string;
  price: number;
  benefits: string[];
}

export type TicketLocale = "en" | "ja" | "zh-CN" | "zh-TW";

export interface TicketTranslation {
  // 기존 4필드 (C50~ 지원)
  badge?: string;
  venue?: string;
  tags?: string[];
  options?: Array<{ id: string; label: string; benefits?: string[] }>;

  // 오더 #D21 [1]-B 스키마 확장: 데이터 번역 필드 추가 (값은 admin 트랙에서 사장님이 입력).
  //   모두 optional — 미보유 시 렌더 코드에서 ko 원문 폴백 (D18 진단 결과 반영).
  //   렌더 코드에서 이 필드 참조는 별도 오더 (본 오더는 스키마만 추가).
  subtitle?: string;
  summary?: string;
  description?: string;
  duration?: string;
  ageLimit?: string;
  dateText?: string;
  posterLabel?: string;
  credit?: string;

  // 8개 탭 콘텐츠
  tabNotice?: string;
  tabCasting?: string;
  tabDetails?: string;
  tabPrice?: string;
  tabDiscount?: string;
  tabUsageInfo?: string;
  tabVenue?: string;
  tabCancellation?: string;
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
  /**
   * 실재 확인된 행사인지 (오더 #P9-d). 미지정=false=미검증 취급.
   * 미검증 항목은 홈 WHAT'S ON · 상세 라우트 · /products 티켓 그리드에서 전부 비노출.
   * 데이터는 삭제하지 않고 플래그로만 숨겨 복구 가능성을 남긴다.
   */
  verified?: boolean;
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
      en: {
        badge: "Coming Soon",
        venue: "Goyang K-POP Arena",
        tags: ["K-POP", "Concert", "Premium Seats"],
        subtitle: "K-POP live series in Goyang",
        summary: "The flagship K-POP live series launching Goyang's performance infrastructure.",
        description:
          "The signature concert series marking the opening of Goyang K-POP Arena. It includes Premium, General, and Family Viewing zones, and connects to the DMC stay programs after the show.",
        duration: "120 min (no intermission)",
        ageLimit: "All ages",
        dateText: "2026.05.14 – 2026.05.16",
        posterLabel: "ARENA",
        tabNotice:
          "※ Entry is restricted 30 minutes after the show starts.\n※ Outside food is not allowed inside the venue (drinks with lids are permitted).\n※ Photography is allowed; video recording and flash are not.",
        tabCasting:
          "■ Artist lineup\n\n• Headliner: Special artist for the Goyang K-POP Arena opening (to be announced)\n• Supporting: Three emerging artists from Goyang\n• Opening DJ set included\n\n■ Program\n• Opening performance (20 min)\n• Main live show (100 min)\n\n⚠️ The lineup may change at the organizer's discretion.",
        tabDetails:
          "The first official signature show marking the opening of Goyang K-POP Arena.\n\n🎤 About the show\nThe opening show of Goyang's new K-POP Arena — a premium live stage for K-POP fans from Korea and abroad.\n\n🏟️ Seating\n- VIP: Rows 1–5 facing the stage, with special merch\n- R-Class: Main floor assigned seating\n- S-Class: Side and second-tier assigned seating\n\n✨ Special benefits\n- VIP: Photo-wall opportunity before the show\n- Early-bird buyers: Limited-edition poster",
        tabUsageInfo:
          "• Venue: Goyang K-POP Arena (next to KINTEX)\n• Entry: From 1 hour before the show\n• Mobile or physical ticket required\n• Parking: On-site parking available (paid)\n• Transit: Daehwa Stn. (Line 3) 15 min on foot / shuttle bus available\n• Lost & found: Venue operations 031-XXXX-XXXX",
        tabPrice:
          "■ Prices by seat grade\n\n• VIP Package: 198,000 KRW\n  - Assigned seats in rows 1–5 facing the stage\n  - Photo-wall opportunity before the show\n  - Limited-edition welcome merch\n\n• R-Class: 143,000 KRW\n  - Main floor assigned seating\n  - Mobile ticketing\n\n• S-Class: 99,000 KRW\n  - Side and second-tier assigned seating\n  - On-site ticketing available\n\n※ Prices include VAT.\n※ Up to 4 tickets per person.",
        tabDiscount:
          "🎟️ Early-bird\n• 10% off all seats within 72 hours of opening sales\n• Ends earlier if the quota sells out\n\n🎓 Youth discount\n• Ages 13–18: 30% off S-Class\n• Student ID or youth ID required on site\n\n👨‍👩‍👧 Family package\n• Buy 4 seats together and 1 person is free\n• Applies to VIP and R-Class\n\n🏢 Group discount\n• 20+ people: 15% off\n• 50+ people: 20% off\n• Advance inquiry required (contact@goyang-mice.kr)\n\n※ Discounts do not stack\n※ Full price applies once early-bird ends",
        tabVenue:
          "📍 Venue\nGoyang K-POP Arena (next to KINTEX)\n217-60 KINTEX-ro, Ilsanseo-gu, Goyang-si, Gyeonggi-do\n\n🚇 Transit\n• Subway: Daehwa Stn. (Line 3), 15 min on foot\n• Bus: Shuttle from Goyang Terminal (show days)\n• Airport bus: Direct limousine from Incheon Airport\n\n🚗 By car\n• Naver Map: search \"Goyang K-POP Arena\"\n• Parking: 3,000-space dedicated lot (paid)\n• Rate: 2,000 KRW/hour · 5,000 KRW flat on show days\n\n🏨 Nearby stays\n• Multiple hotels near KINTEX\n• Free shuttle available with a stay package\n\n⚠️ Notes\n• Entry from 1 hour before the show\n• No entry 30 minutes after the show starts",
        tabCancellation:
          "■ Cancellation and refund policy\n\n• Within 7 days of purchase & at least 10 days before the show: 100% refund\n• 9–7 days before the show: 70% refund\n• 6–3 days before the show: 50% refund\n• 2 days before or on the day: no refund\n\n■ If the show is cancelled\nFull refund if the show is cancelled by the organizer.\n\n■ Refund processing\n• Credit card: 3–5 business days\n• KakaoPay / bank transfer: 2–3 business days",
        options: [{ id: "vip", label: "VIP Package", benefits: ["Priority Entry", "Welcome Goods"] }, { id: "r", label: "R-Class", benefits: ["Assigned Seat", "Mobile Ticket"] }, { id: "s", label: "S-Class", benefits: ["Assigned Seat", "On-site Ticketing"] }, { id: "a", label: "A-Class", benefits: ["Assigned Seat"] }, { id: "b", label: "B-Class", benefits: ["Assigned Seat"] }],
      },
      ja: {
        badge: "近日オープン",
        venue: "高陽K-POPアリーナ (KINTEX隣接)",
        tags: ["K-POP", "公演", "プレミアム席"],
        subtitle: "高陽型K-POP連携公演",
        summary: "高陽の公演インフラ始動を告げる代表的なK-POPライブシリーズです。",
        description:
          "高陽K-POPアリーナ開場に合わせて開催されるシグネチャー公演シリーズです。プレミアムゾーン、一般ゾーン、ファミリー観覧ゾーンで構成され、公演後のDMC滞在プログラムとも連携します。",
        duration: "120分（休憩なし）",
        ageLimit: "全年齢対象",
        dateText: "2026.05.14 – 2026.05.16",
        posterLabel: "ARENA",
        tabNotice:
          "※ 公演開始30分後は入場が制限されます。\n※ 会場内への飲食物持ち込み禁止（フタ付きの飲み物のみ可）\n※ 写真撮影は可能、動画撮影・フラッシュ使用は禁止です。",
        tabCasting:
          "■ アーティストラインナップ\n\n• ヘッドライナー: 高陽K-POPアリーナ開場記念スペシャルアーティスト（後日発表）\n• サポート: 高陽市出身の新人アーティスト3組\n• オープニングDJセット含む\n\n■ 公演構成\n• オープニングパフォーマンス（20分）\n• メインライブ公演（100分）\n\n⚠️ ラインナップは主催者の都合により変更となる場合があります。",
        tabDetails:
          "高陽K-POPアリーナの開場を告げる初の公式シグネチャー公演です。\n\n🎤 公演について\n高陽市が新たに披露するK-POPアリーナの開館公演で、国内外のK-POPファンに向けたプレミアムライブステージです。\n\n🏟️ 座席構成\n- VIP: ステージ正面1〜5列、特別グッズ付き\n- R席: メインフロア指定席\n- S席: サイドおよび2階指定席\n\n✨ 特典\n- VIP購入者: 公演前のフォトウォール参加機会\n- 早期購入者: 限定ポスター進呈",
        tabUsageInfo:
          "• 会場: 高陽K-POPアリーナ（KINTEX隣接）\n• 入場: 公演開始1時間前から\n• モバイルチケットまたは実券の持参必須\n• 駐車: 会場駐車場利用可（有料）\n• 公共交通: 大化駅（3号線）徒歩15分／シャトルバス運行\n• 遺失物: 会場運営チーム 031-XXXX-XXXX",
        tabPrice:
          "■ 座席等級別料金\n\n• VIPパッケージ: 198,000ウォン\n  - ステージ正面1〜5列指定席\n  - 公演前フォトウォール参加機会\n  - 限定ウェルカムグッズ進呈\n\n• R席: 143,000ウォン\n  - メインフロア指定席\n  - モバイルチケット\n\n• S席: 99,000ウォン\n  - サイド・2階指定席\n  - 現場発券可\n\n※ 料金は消費税込み\n※ お一人様最大4枚まで購入可",
        tabDiscount:
          "🎟️ 早期割引\n• 販売開始から72時間以内の購入で全席10%割引\n• 数量限定 · 早期終了の可能性あり\n\n🎓 青少年割引\n• 満13〜18歳: S席30%割引\n• 学生証または青少年証の現場提示必須\n\n👨‍👩‍👧 ファミリーパッケージ\n• 同一座席4名同時購入で1名無料\n• VIP・R席対象\n\n🏢 団体割引\n• 20名以上の団体: 15%割引\n• 50名以上の団体: 20%割引\n• 事前お問い合わせ必須（contact@goyang-mice.kr）\n\n※ 割引の重複適用不可\n※ 早期割終了後は定価適用",
        tabVenue:
          "📍 公演会場\n高陽K-POPアリーナ（KINTEX隣接）\n京畿道 高陽市 一山西区 KINTEX路 217-60\n\n🚇 公共交通\n• 地下鉄: 大化（テファ）駅（3号線）徒歩15分\n• バス: 高陽総合ターミナルからシャトルバス運行（公演当日）\n• 空港バス: 仁川空港リムジン直行運行\n\n🚗 自家用車\n• Naverマップ: 「高陽K-POPアリーナ」検索\n• 駐車場: アリーナ専用駐車場3,000台運営（有料）\n• 駐車料金: 1時間2,000ウォン／公演当日 5,000ウォン定額\n\n🏨 周辺宿泊\n• KINTEX近隣に多数のホテル\n• 宿泊パッケージ予約でシャトルバス無料利用可\n\n⚠️ ご案内\n• 公演開始1時間前から入場可能\n• 公演開始30分後は入場制限",
        tabCancellation:
          "■ キャンセル・返金規定\n\n• 購入後7日以内 & 公演日10日前まで: 100%返金\n• 公演日9日前〜7日前: 70%返金\n• 公演日6日前〜3日前: 50%返金\n• 公演日2日前〜当日: 返金不可\n\n■ 公演中止の場合\n主催者の都合による中止時は100%返金対応。\n\n■ 返金処理\n• クレジットカード: 3〜5営業日\n• カカオペイ・銀行振込: 2〜3営業日",
        options: [{ id: "vip", label: "VIPパッケージ", benefits: ["優先入場", "ウェルカムグッズ"] }, { id: "r", label: "R席", benefits: ["指定席", "モバイルチケット"] }, { id: "s", label: "S席", benefits: ["指定席", "現場発券可"] }, { id: "a", label: "A席", benefits: ["指定席"] }, { id: "b", label: "B席", benefits: ["指定席"] }],
      },
      "zh-CN": {
        badge: "即将开放",
        venue: "高阳K-POP竞技场 (KINTEX旁)",
        tags: ["K-POP", "演出", "高级座位"],
        subtitle: "高阳K-POP联动演出",
        summary: "宣告高阳演出基础设施启动的代表性K-POP现场系列。",
        description:
          "配合高阳K-POP竞技场开幕举行的招牌演出系列。设有 Premium、普通、家庭观演三个区域，演出后可与 DMC 停留项目衔接。",
        duration: "120分钟（无中场休息）",
        ageLimit: "全年龄段",
        dateText: "2026.05.14 – 2026.05.16",
        posterLabel: "ARENA",
        tabNotice:
          "※ 演出开始30分钟后限制入场。\n※ 场内禁止外带食物（仅可带有盖饮料）\n※ 允许拍照；禁止摄像与闪光灯。",
        tabCasting:
          "■ 艺人阵容\n\n• 主打艺人: 高阳K-POP竞技场开幕特别嘉宾（稍后公布）\n• 助阵: 高阳出身新人艺人3组\n• 含开场 DJ Set\n\n■ 演出构成\n• 开场表演（20分钟）\n• 主要现场演出（100分钟）\n\n⚠️ 阵容可能因主办方原因变动。",
        tabDetails:
          "高阳K-POP竞技场开幕以来首场官方招牌演出。\n\n🎤 演出简介\n作为高阳新亮相K-POP竞技场的开馆演出，为国内外K-POP粉丝呈现的高端现场舞台。\n\n🏟️ 座位构成\n- VIP：舞台正面1〜5排指定席，含特别周边\n- R区：主舞池指定席\n- S区：侧面及2层指定席\n\n✨ 特别福利\n- VIP购票者：演出前照片墙参与机会\n- 早鸟购票者：限量海报赠送",
        tabUsageInfo:
          "• 场地: 高阳K-POP竞技场（KINTEX旁）\n• 入场: 演出开始前1小时起\n• 需持手机票或实体票\n• 停车: 场馆停车场可用（收费）\n• 公共交通: 大化站（3号线）步行15分钟 / 有接驳巴士\n• 失物: 场馆运营组 031-XXXX-XXXX",
        tabPrice:
          "■ 各座位等级价格\n\n• VIP套餐: 198,000韩元\n  - 舞台正面1〜5排指定席\n  - 演出前照片墙参与机会\n  - 限量欢迎周边赠送\n\n• R区: 143,000韩元\n  - 主舞池指定席\n  - 手机票\n\n• S区: 99,000韩元\n  - 侧面及2层指定席\n  - 现场取票可用\n\n※ 价格含增值税\n※ 每人最多购买4张",
        tabDiscount:
          "🎟️ 早鸟优惠\n• 开售72小时内购票，全席位10%优惠\n• 限量供应 · 售完即止\n\n🎓 青少年优惠\n• 13〜18岁: S区30%优惠\n• 现场须出示学生证或青少年证\n\n👨‍👩‍👧 家庭套餐优惠\n• 同一区域4人同购，1人免费\n• 适用 VIP·R区\n\n🏢 团体优惠\n• 20人以上: 15%优惠\n• 50人以上: 20%优惠\n• 需事先咨询（contact@goyang-mice.kr）\n\n※ 优惠不可叠加\n※ 早鸟结束后按原价\n",
        tabVenue:
          "📍 演出场地\n高阳K-POP竞技场（KINTEX旁）\n京畿道高阳市一山西区KINTEX路217-60\n\n🚇 公共交通\n• 地铁: 大化（Daehwa）站（3号线）步行15分钟\n• 巴士: 高阳综合客运站接驳巴士运行（演出当日）\n• 机场巴士: 仁川机场机场大巴直达\n\n🚗 自驾\n• Naver地图: 搜索「高阳K-POP竞技场」\n• 停车: 场馆专用停车场3,000个车位（收费）\n• 停车费: 每小时2,000韩元 / 演出当日定额5,000韩元\n\n🏨 周边住宿\n• KINTEX附近多家酒店\n• 预订住宿套餐可免费乘接驳巴士\n\n⚠️ 注意事项\n• 演出开始前1小时起可入场\n• 演出开始30分钟后限制入场",
        tabCancellation:
          "■ 取消及退款规定\n\n• 购买后7日内 & 演出前10日前: 100%退款\n• 演出前9日〜7日前: 70%退款\n• 演出前6日〜3日前: 50%退款\n• 演出前2日〜当日: 不予退款\n\n■ 演出取消时\n因主办方原因取消时全额退款。\n\n■ 退款处理\n• 信用卡: 3〜5个工作日\n• KakaoPay·银行转账: 2〜3个工作日",
        options: [{ id: "vip", label: "VIP套餐", benefits: ["优先入场", "欢迎礼品"] }, { id: "r", label: "R区", benefits: ["对号入座", "手机票"] }, { id: "s", label: "S区", benefits: ["对号入座", "现场取票"] }, { id: "a", label: "A区", benefits: ["对号入座"] }, { id: "b", label: "B区", benefits: ["对号入座"] }],
      },
      "zh-TW": {
        badge: "即將開放",
        venue: "高陽K-POP競技場 (KINTEX旁)",
        tags: ["K-POP", "演出", "高級座位"],
        subtitle: "高陽K-POP聯動演出",
        summary: "宣告高陽演出基礎設施啟動的代表性K-POP現場系列。",
        description:
          "配合高陽K-POP競技場開幕舉行的招牌演出系列。設有 Premium、普通、家庭觀演三個區域，演出後可與 DMC 停留計畫銜接。",
        duration: "120分鐘（無中場休息）",
        ageLimit: "全年齡段",
        dateText: "2026.05.14 – 2026.05.16",
        posterLabel: "ARENA",
        tabNotice:
          "※ 演出開始30分鐘後限制入場。\n※ 場內禁止外帶食物（僅可帶有蓋飲料）\n※ 允許拍照；禁止攝影與閃光燈。",
        tabCasting:
          "■ 藝人陣容\n\n• 主打藝人: 高陽K-POP競技場開幕特別嘉賓（稍後公布）\n• 助陣: 高陽出身新人藝人3組\n• 含開場 DJ Set\n\n■ 演出構成\n• 開場表演（20分鐘）\n• 主要現場演出（100分鐘）\n\n⚠️ 陣容可能因主辦方原因變動。",
        tabDetails:
          "高陽K-POP競技場開幕以來首場官方招牌演出。\n\n🎤 演出簡介\n作為高陽新亮相K-POP競技場的開館演出，為國內外K-POP歌迷呈現的高端現場舞台。\n\n🏟️ 座位構成\n- VIP：舞台正面1〜5排指定席，含特別周邊\n- R區：主舞池指定席\n- S區：側面及2層指定席\n\n✨ 特別福利\n- VIP購票者：演出前照片牆參與機會\n- 早鳥購票者：限量海報贈送",
        tabUsageInfo:
          "• 場地: 高陽K-POP競技場（KINTEX旁）\n• 入場: 演出開始前1小時起\n• 需持手機票或實體票\n• 停車: 場館停車場可用（收費）\n• 公共交通: 大化站（3號線）步行15分鐘 / 有接駁巴士\n• 失物: 場館營運組 031-XXXX-XXXX",
        tabPrice:
          "■ 各座位等級價格\n\n• VIP套餐: 198,000韓元\n  - 舞台正面1〜5排指定席\n  - 演出前照片牆參與機會\n  - 限量歡迎周邊贈送\n\n• R區: 143,000韓元\n  - 主舞池指定席\n  - 手機票\n\n• S區: 99,000韓元\n  - 側面及2層指定席\n  - 現場取票可用\n\n※ 價格含加值稅\n※ 每人最多購買4張",
        tabDiscount:
          "🎟️ 早鳥優惠\n• 開售72小時內購票，全席位10%優惠\n• 限量供應 · 售完即止\n\n🎓 青少年優惠\n• 13〜18歲: S區30%優惠\n• 現場須出示學生證或青少年證\n\n👨‍👩‍👧 家庭套餐優惠\n• 同一區域4人同購，1人免費\n• 適用 VIP·R區\n\n🏢 團體優惠\n• 20人以上: 15%優惠\n• 50人以上: 20%優惠\n• 需事先諮詢（contact@goyang-mice.kr）\n\n※ 優惠不可疊加\n※ 早鳥結束後按原價\n",
        tabVenue:
          "📍 演出場地\n高陽K-POP競技場（KINTEX旁）\n京畿道高陽市一山西區KINTEX路217-60\n\n🚇 公共交通\n• 地鐵: 大化（Daehwa）站（3號線）步行15分鐘\n• 巴士: 高陽綜合客運站接駁巴士運行（演出當日）\n• 機場巴士: 仁川機場機場大巴直達\n\n🚗 自駕\n• Naver地圖: 搜尋「高陽K-POP競技場」\n• 停車: 場館專用停車場3,000個車位（收費）\n• 停車費: 每小時2,000韓元 / 演出當日定額5,000韓元\n\n🏨 周邊住宿\n• KINTEX附近多家飯店\n• 預訂住宿套餐可免費搭乘接駁巴士\n\n⚠️ 注意事項\n• 演出開始前1小時起可入場\n• 演出開始30分鐘後限制入場",
        tabCancellation:
          "■ 取消及退款規定\n\n• 購買後7日內 & 演出前10日前: 100%退款\n• 演出前9日〜7日前: 70%退款\n• 演出前6日〜3日前: 50%退款\n• 演出前2日〜當日: 不予退款\n\n■ 演出取消時\n因主辦方原因取消時全額退款。\n\n■ 退款處理\n• 信用卡: 3〜5個工作日\n• KakaoPay·銀行轉帳: 2〜3個工作日",
        options: [{ id: "vip", label: "VIP套餐", benefits: ["優先入場", "歡迎禮品"] }, { id: "r", label: "R區", benefits: ["對號入座", "手機票"] }, { id: "s", label: "S區", benefits: ["對號入座", "現場取票"] }, { id: "a", label: "A區", benefits: ["對號入座"] }, { id: "b", label: "B區", benefits: ["對號入座"] }],
      },
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
      en: { badge: "2nd Ticket Sale", venue: "Ilsan Cultural Plaza", tags: ["Festival", "Outdoor Concert", "Food Zone"], subtitle: "Lifestyle music festival in the city", summary: "An outdoor summer-season festival that mixes music, food, and after-dark experiences.", description: "A lifestyle music festival held in an outdoor city space. Alongside the shows, food zones, local goods, and after-dark content combine into a stay-oriented itinerary.", dateText: "2026.06.20 – 2026.06.21", posterLabel: "FEST", options: [{ id: "two-day", label: "2-Day Pass", benefits: ["2-Day Entry", "MD Voucher"] }, { id: "day-pass", label: "1-Day Pass", benefits: ["Single Day Entry"] }] },
      ja: { badge: "第2次チケット販売", venue: "一山文化広場 (Ilsan Cultural Plaza)", tags: ["フェスティバル", "野外公演", "フードゾーン"], subtitle: "都市ライフスタイル・ミュージックフェスティバル", summary: "音楽・フード・夜のコンテンツを一緒に楽しむ夏シーズン野外フェスティバルです。", description: "都心の野外空間で開かれるライフスタイル・ミュージックフェスティバルです。公演鑑賞に加えて、フードゾーン・ローカルグッズ・夜間コンテンツを組み合わせた滞在型の日程が構成できます。", dateText: "2026.06.20 – 2026.06.21", posterLabel: "FEST", options: [{ id: "two-day", label: "2日間パス", benefits: ["両日入場", "MD引換券"] }, { id: "day-pass", label: "1日券", benefits: ["指定日入場"] }] },
      "zh-CN": { badge: "第二轮票务开放", venue: "一山文化广场 (Ilsan Cultural Plaza)", tags: ["音乐节", "户外演出", "美食区"], subtitle: "城市生活方式音乐节", summary: "融合音乐、美食与夜间体验的夏季户外音乐节。", description: "在都市户外空间举行的生活方式音乐节。除演出观赏之外，还可结合美食区、本地周边与夜间内容，形成停留型行程。", dateText: "2026.06.20 – 2026.06.21", posterLabel: "FEST", options: [{ id: "two-day", label: "两日票", benefits: ["两日入场", "周边兑换券"] }, { id: "day-pass", label: "一日票", benefits: ["指定日入场"] }] },
      "zh-TW": { badge: "第二輪票務開放", venue: "一山文化廣場 (Ilsan Cultural Plaza)", tags: ["音樂節", "戶外演出", "美食區"], subtitle: "城市生活風格音樂節", summary: "融合音樂、美食與夜間體驗的夏季戶外音樂節。", description: "在都市戶外空間舉行的生活風格音樂節。除演出觀賞之外，還可結合美食區、本地周邊與夜間內容，形成停留型行程。", dateText: "2026.06.20 – 2026.06.21", posterLabel: "FEST", options: [{ id: "two-day", label: "兩日票", benefits: ["兩日入場", "周邊兌換券"] }, { id: "day-pass", label: "一日票", benefits: ["指定日入場"] }] },
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
      en: { badge: "Extra Seats Available", venue: "Goyang Aramnuri Exhibition Hall", tags: ["Exhibition", "Night", "Media Art"], subtitle: "Media art + night exhibition", summary: "An immersive exhibition ticket combining night viewing and hands-on programs.", description: "An exhibition ticket combining media-art displays, evening artwork programs, and a local café coupon. Group tours and corporate bookings are supported.", dateText: "2026.05.01 – 2026.05.30", posterLabel: "ART", options: [{ id: "docent", label: "Docent Package", benefits: ["Guided Tour", "Café Coupon"] }, { id: "general", label: "General Admission", benefits: ["Exhibition Entry", "Mobile Ticket"] }] },
      ja: { badge: "追加席販売中", venue: "高陽アラムヌリ展示館 (Aramnuri)", tags: ["展示", "夜間", "メディアアート"], subtitle: "メディアアート＋夜間展示", summary: "夜間観覧と展示体験プログラムを組み合わせた没入型展示チケットです。", description: "メディアアート型展示と夜間アートワークプログラム、ローカルカフェクーポンを組み合わせた展示型チケットです。団体観覧や企業型来場者の予約にも対応可能です。", dateText: "2026.05.01 – 2026.05.30", posterLabel: "ART", options: [{ id: "docent", label: "解説付きパッケージ", benefits: ["解説ガイド付き", "カフェクーポン"] }, { id: "general", label: "一般入場券", benefits: ["展示入場", "モバイルチケット"] }] },
      "zh-CN": { badge: "增开座位", venue: "高阳阿拉木努里展览馆 (Aramnuri)", tags: ["展览", "夜间", "媒体艺术"], subtitle: "媒体艺术＋夜间展览", summary: "结合夜间观展与体验节目的沉浸式展览门票。", description: "结合媒体艺术展、夜间艺术节目与本地咖啡券的展览型门票。可支持团体观展与企业访客预约。", dateText: "2026.05.01 – 2026.05.30", posterLabel: "ART", options: [{ id: "docent", label: "导览套餐", benefits: ["含导览", "咖啡券"] }, { id: "general", label: "普通入场券", benefits: ["展览入场", "手机票"] }] },
      "zh-TW": { badge: "增開座位", venue: "高陽阿拉木努里展覽館 (Aramnuri)", tags: ["展覽", "夜間", "媒體藝術"], subtitle: "媒體藝術＋夜間展覽", summary: "結合夜間觀展與體驗節目的沉浸式展覽門票。", description: "結合媒體藝術展、夜間藝術節目與本地咖啡券的展覽型門票。可支援團體觀展與企業訪客預約。", dateText: "2026.05.01 – 2026.05.30", posterLabel: "ART", options: [{ id: "docent", label: "導覽套餐", benefits: ["含導覽", "咖啡券"] }, { id: "general", label: "普通入場券", benefits: ["展覽入場", "手機票"] }] },
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
      en: { badge: "Family Pick", venue: "Goyang Eoullim Nuri", tags: ["Family", "Experience Show", "Weekend Program"], subtitle: "Experience show for kids and families", summary: "Hands-on shows and workshop programs designed for kids and families to enjoy together.", description: "A seasonal ticket for family visitors that combines a live show, a craft experience, and a local café coupon. Pairs well with a stay or café booking.", dateText: "2026.07.03 – 2026.07.12", posterLabel: "FAMILY", options: [{ id: "family-pack", label: "Family Pack (4 persons)", benefits: ["Entry for 4", "Activity Kit"] }, { id: "adult", label: "Adult 1 Person", benefits: ["Show Entry"] }, { id: "child", label: "Child 1 Person", benefits: ["Show Entry", "Activity"] }] },
      ja: { badge: "ファミリー向け", venue: "高陽オウルリムヌリ (Eoullim Nuri)", tags: ["ファミリー", "体験公演", "週末プログラム"], subtitle: "キッズ/ファミリー体験公演", summary: "お子様とご家族が一緒に楽しめる体験型公演とワークショッププログラムです。", description: "ファミリー来場者向けに公演鑑賞・工作体験・ローカルカフェクーポンをまとめたシーズン限定チケットです。宿泊やカフェ予約との連携にも適しています。", dateText: "2026.07.03 – 2026.07.12", posterLabel: "FAMILY", options: [{ id: "family-pack", label: "ファミリー4名", benefits: ["4名入場", "体験キット付き"] }, { id: "adult", label: "大人1名", benefits: ["公演入場"] }, { id: "child", label: "子ども1名", benefits: ["公演入場", "体験参加"] }] },
      "zh-CN": { badge: "家庭推荐", venue: "高阳欧拉利姆努里 (Eoullim Nuri)", tags: ["家庭", "体验演出", "周末活动"], subtitle: "儿童/家庭体验演出", summary: "适合亲子共赏的体验型演出与工作坊项目。", description: "面向家庭观众的季节性套票，包含演出观赏、手工体验与本地咖啡券。也便于与住宿及咖啡预约联动。", dateText: "2026.07.03 – 2026.07.12", posterLabel: "FAMILY", options: [{ id: "family-pack", label: "家庭4人套餐", benefits: ["4人入场", "含体验材料"] }, { id: "adult", label: "成人1张", benefits: ["演出入场"] }, { id: "child", label: "儿童1张", benefits: ["演出入场", "体验活动"] }] },
      "zh-TW": { badge: "家庭推薦", venue: "高陽歐拉利姆努里 (Eoullim Nuri)", tags: ["家庭", "體驗演出", "週末活動"], subtitle: "兒童/家庭體驗演出", summary: "適合親子共賞的體驗型演出與工作坊項目。", description: "面向家庭觀眾的季節性套票，包含演出觀賞、手作體驗與本地咖啡券。也便於與住宿及咖啡預約聯動。", dateText: "2026.07.03 – 2026.07.12", posterLabel: "FAMILY", options: [{ id: "family-pack", label: "家庭4人套餐", benefits: ["4人入場", "含體驗材料"] }, { id: "adult", label: "成人1張", benefits: ["演出入場"] }, { id: "child", label: "兒童1張", benefits: ["演出入場", "體驗活動"] }] },
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
      en: { badge: "Limited Offer", venue: "Goyang Aramnuri Aram Theater", tags: ["Concert", "Band", "Indoor Show"], subtitle: "Curated vocal and band concerts", summary: "Goyang's own live series curated around vocalists and bands.", description: "Premium indoor live content, with a ticket structure designed around venue access and visitor flow. VIP handling and corporate hospitality are supported.", dateText: "2026.04.24 – 2026.04.25", posterLabel: "LIVE", options: [{ id: "premium", label: "Premium Seat", benefits: ["Dedicated Gate", "MD Coupon"] }, { id: "standard", label: "Standard Seat", benefits: ["Assigned Seat"] }] },
      ja: { badge: "限定特価", venue: "高陽アラムヌリ アラム劇場 (Aram Theater)", tags: ["コンサート", "バンド", "室内公演"], subtitle: "ボーカル/バンドのキュレーション公演", summary: "ボーカルとバンドを中心に構成された高陽型ライブシリーズです。", description: "室内公演場を中心としたプレミアムライブコンテンツで、会場アクセスと滞在動線を考慮したチケット構成です。VIP対応や企業招待運営にも対応可能です。", dateText: "2026.04.24 – 2026.04.25", posterLabel: "LIVE", options: [{ id: "premium", label: "プレミアムシート", benefits: ["専用ゲート", "MDクーポン"] }, { id: "standard", label: "一般席", benefits: ["指定席"] }] },
      "zh-CN": { badge: "限时特惠", venue: "高阳阿拉木努里剧场 (Aram Theater)", tags: ["音乐会", "乐队", "室内演出"], subtitle: "人声/乐队策展演出", summary: "以人声与乐队为核心的高阳现场系列。", description: "以室内演出场馆为主的高级现场内容，票务结构充分考虑场馆通达与停留动线。可支持VIP接待与企业邀请运营。", dateText: "2026.04.24 – 2026.04.25", posterLabel: "LIVE", options: [{ id: "premium", label: "高级座位", benefits: ["专属通道", "周边优惠券"] }, { id: "standard", label: "普通座位", benefits: ["对号入座"] }] },
      "zh-TW": { badge: "限時特惠", venue: "高陽阿拉木努里劇場 (Aram Theater)", tags: ["音樂會", "樂隊", "室內演出"], subtitle: "人聲/樂隊策展演出", summary: "以人聲與樂隊為核心的高陽現場系列。", description: "以室內演出場館為主的高級現場內容，票務結構充分考量場館通達與停留動線。可支援VIP接待與企業邀請營運。", dateText: "2026.04.24 – 2026.04.25", posterLabel: "LIVE", options: [{ id: "premium", label: "高級座位", benefits: ["專屬通道", "周邊優惠券"] }, { id: "standard", label: "普通座位", benefits: ["對號入座"] }] },
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
      en: { badge: "Coming Soon", venue: "KINTEX Outdoor Stage", tags: ["MICE", "VIP", "Special Stage"], subtitle: "Special performance tied to business events", summary: "A special performance ticket for exhibition attendees and VIP guests.", description: "A special stage tied to MICE events, offering premium seats and networking passes for buyers and VIP guests.", dateText: "2026.09.12", posterLabel: "MICE", options: [{ id: "networking", label: "Networking Package", benefits: ["Reception Included", "Priority Entry"] }, { id: "general", label: "General Seat", benefits: ["Mobile Ticket"] }] },
      ja: { badge: "近日オープン", venue: "KINTEX野外ステージ", tags: ["MICE", "VIP", "スペシャルステージ"], subtitle: "ビジネス連携スペシャルパフォーマンス", summary: "展示会参加者とVIPのためのスペシャルパフォーマンスチケットです。", description: "MICEイベントと連動するスペシャルステージで、バイヤーとVIPを対象としたプレミアム席とネットワーキング入場券を併用運営できます。", dateText: "2026.09.12", posterLabel: "MICE", options: [{ id: "networking", label: "ネットワーキングパッケージ", benefits: ["レセプション込み", "優先入場"] }, { id: "general", label: "一般席", benefits: ["モバイルチケット"] }] },
      "zh-CN": { badge: "即将开放", venue: "KINTEX户外舞台", tags: ["MICE", "VIP", "特别舞台"], subtitle: "商务联动特别演出", summary: "面向展会参会者与VIP宾客的特别演出票。", description: "与MICE活动联动的特别舞台，可为买家与VIP宾客同时提供高级座位与社交入场券。", dateText: "2026.09.12", posterLabel: "MICE", options: [{ id: "networking", label: "社交套餐", benefits: ["含接待会", "优先入场"] }, { id: "general", label: "普通座位", benefits: ["手机票"] }] },
      "zh-TW": { badge: "即將開放", venue: "KINTEX戶外舞台", tags: ["MICE", "VIP", "特別舞台"], subtitle: "商務聯動特別演出", summary: "面向展會參會者與VIP賓客的特別演出票。", description: "與MICE活動聯動的特別舞台，可為買家與VIP賓客同時提供高級座位與社交入場券。", dateText: "2026.09.12", posterLabel: "MICE", options: [{ id: "networking", label: "社交套餐", benefits: ["含接待會", "優先入場"] }, { id: "general", label: "普通座位", benefits: ["手機票"] }] },
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
      en: { badge: "On Sale Now", venue: "Ilsan Lake Park Outdoor Stage", tags: ["Local", "Outdoor Stage", "Flea Market"], subtitle: "Outdoor live show by local creators", summary: "An outdoor program produced with local Goyang brands and creators.", description: "Goyang's local stage where you can enjoy a show along with a flea market, food trucks, and experience booths. Well suited to couples, families, and small groups.", dateText: "2026.08.08 – 2026.08.09", posterLabel: "LOCAL", options: [{ id: "weekend", label: "Weekend Pass", benefits: ["2-Day Entry"] }, { id: "single", label: "1-Day Pass", benefits: ["Single Day Entry"] }] },
      ja: { badge: "本日オープン", venue: "一山湖水公園野外ステージ (Ilsan Lake Park)", tags: ["ローカル", "野外ステージ", "フリーマーケット"], subtitle: "ローカルクリエイターの野外ライブ", summary: "高陽のローカルブランドとクリエイターが一緒に作る野外公演プログラムです。", description: "公演と一緒にフリーマーケット・フードトラック・体験ブースを楽しめる高陽型ローカルステージです。カップル・ファミリー・少人数グループに向いています。", dateText: "2026.08.08 – 2026.08.09", posterLabel: "LOCAL", options: [{ id: "weekend", label: "週末パス", benefits: ["両日入場"] }, { id: "single", label: "1日券", benefits: ["1日入場"] }] },
      "zh-CN": { badge: "今日开售", venue: "一山湖水公园户外舞台 (Ilsan Lake Park)", tags: ["本地", "户外舞台", "跳蚤市场"], subtitle: "本地创作者户外现场", summary: "由高阳本地品牌与创作者共同呈现的户外演出项目。", description: "可与跳蚤市场、餐车与体验展位一同享受的高阳本地舞台。适合情侣、家庭与小型团体。", dateText: "2026.08.08 – 2026.08.09", posterLabel: "LOCAL", options: [{ id: "weekend", label: "周末通票", benefits: ["两日入场"] }, { id: "single", label: "一日票", benefits: ["单日入场"] }] },
      "zh-TW": { badge: "今日開售", venue: "一山湖水公園戶外舞台 (Ilsan Lake Park)", tags: ["本地", "戶外舞台", "跳蚤市場"], subtitle: "本地創作者戶外現場", summary: "由高陽本地品牌與創作者共同呈現的戶外演出項目。", description: "可與跳蚤市場、餐車與體驗展位一同享受的高陽本地舞台。適合情侶、家庭與小型團體。", dateText: "2026.08.08 – 2026.08.09", posterLabel: "LOCAL", options: [{ id: "weekend", label: "週末通票", benefits: ["兩日入場"] }, { id: "single", label: "一日票", benefits: ["單日入場"] }] },
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
      en: { badge: "Tickets Available", venue: "Goyang Stadium", tags: ["Sports", "Night Event", "Package Ticket"], subtitle: "Night run + concert combo ticket", summary: "A combo ticket that pairs a night-run event with a main concert.", description: "A seasonal ticket that lets you enjoy the main show and food content after taking part in the run. Group packages and standard tickets can run in parallel.", dateText: "2026.10.02", posterLabel: "RUN", options: [{ id: "race-pack", label: "Running Package", benefits: ["Running Kit", "Show Entry"] }, { id: "show-only", label: "Show Ticket", benefits: ["Show Entry"] }] },
      ja: { badge: "チケット販売中", venue: "高陽総合運動場 (Goyang Stadium)", tags: ["スポーツ", "夜間イベント", "パッケージチケット"], subtitle: "夜間ランニング＋公演のセットチケット", summary: "夜間ランニングイベントとメイン公演を一緒に楽しむ複合型チケットです。", description: "ランニングイベント参加後にメイン公演とフードコンテンツを楽しめるシーズン限定チケットです。団体参加者用パッケージと基本型チケットの併売にも対応できます。", dateText: "2026.10.02", posterLabel: "RUN", options: [{ id: "race-pack", label: "ランニングパッケージ", benefits: ["ランニングキット", "公演入場"] }, { id: "show-only", label: "公演観覧券", benefits: ["公演入場"] }] },
      "zh-CN": { badge: "票务开放", venue: "高阳综合运动场 (Goyang Stadium)", tags: ["体育", "夜间活动", "套票"], subtitle: "夜跑＋演出组合票", summary: "将夜跑活动与主打演出结合的复合型门票。", description: "参与跑步活动后可享受主打演出与美食内容的季节性门票。可同时运营团体套餐与基本票种。", dateText: "2026.10.02", posterLabel: "RUN", options: [{ id: "race-pack", label: "跑步套餐", benefits: ["跑步装备", "演出入场"] }, { id: "show-only", label: "演出门票", benefits: ["演出入场"] }] },
      "zh-TW": { badge: "票務開放", venue: "高陽綜合運動場 (Goyang Stadium)", tags: ["體育", "夜間活動", "套票"], subtitle: "夜跑＋演出組合票", summary: "將夜跑活動與主打演出結合的複合型門票。", description: "參與跑步活動後可享受主打演出與美食內容的季節性門票。可同時運營團體套餐與基本票種。", dateText: "2026.10.02", posterLabel: "RUN", options: [{ id: "race-pack", label: "跑步套餐", benefits: ["跑步裝備", "演出入場"] }, { id: "show-only", label: "演出門票", benefits: ["演出入場"] }] },
    },
  },
];

export function getTicketProduct(ticketId?: string) {
  if (!ticketId) {
    return ticketProducts[0];
  }

  return ticketProducts.find((ticket) => ticket.id === ticketId) ?? ticketProducts[0];
}
