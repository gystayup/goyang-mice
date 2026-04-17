import type { DmcCategoryKey } from "@/data/products";

export type ServiceCatalogCategory = Extract<
  DmcCategoryKey,
  "tour" | "stay" | "restaurant" | "cafe" | "airport"
>;

export interface ServiceCatalogOption {
  id: string;
  label: string;
  price: number;
  benefits: string[];
}

export type ServiceLocale = "en" | "ja" | "zh-CN" | "zh-TW";

export interface ServiceCatalogTranslation {
  title?: string;
  subtitle?: string;
  location?: string;
  dateText?: string;
  posterLabel?: string;
  summary?: string;
  description?: string;
  tags?: string[];
  meetingPoint?: string;
  meetingPointAddress?: string;
  meetingPointNote?: string;
  tabNotice?: string;
  tabDetails?: string;
  tabUsageInfo?: string;
  tabCancellation?: string;
  highlights?: string[];
  includes?: string[];
  couponGuide?: string;
  options?: Array<{ id: string; label?: string; benefits?: string[] }>;
}

export interface ServiceCatalogItem {
  id: string;
  title: string;
  subtitle: string;
  location: string;
  dateText: string;
  imageTone: string;
  posterLabel: string;
  summary: string;
  description: string;
  tags: string[];
  originalPrice?: number;
  price: number;
  discountLabel?: string;
  options: ServiceCatalogOption[];
  // 다국어 번역 (한국어가 기본값, 나머지는 선택적)
  translations?: Partial<Record<ServiceLocale, ServiceCatalogTranslation>>;
  // 상품 소개 콘텐츠
  imageUrl?: string;          // 대표 사진 URL
  images?: string[];          // 상세페이지 슬라이더 이미지 배열
  highlights?: string[];      // 주요 특징 (불릿 포인트)
  includes?: string[];        // 포함 사항
  couponGuide?: string;       // 모바일 쿠폰 사용 안내
  // 만남의 장소 (투어 출발지)
  meetingPoint?: string;      // 예: "KINTEX 1전시장 정문 앞"
  meetingPointAddress?: string; // 상세 주소 (지도용)
  meetingPointMapUrl?: string;  // 지도 URL (네이버/카카오/구글)
  meetingPointNote?: string;    // 추가 안내 (예: "15분 전 도착 필수")
  // 상세페이지 탭 콘텐츠
  tabNotice?: string;         // 공지사항
  tabDetails?: string;        // 상품상세
  tabUsageInfo?: string;      // 이용안내
  tabCancellation?: string;   // 취소 및 환불규정
}

export const serviceCatalog: Record<ServiceCatalogCategory, ServiceCatalogItem[]> = {
  tour: [
    {
      id: "lake-park-sunset-tour",
      title: "일산호수공원 선셋 로컬투어",
      subtitle: "감성 루트 1일",
      location: "일산호수공원 · 라페스타 · 웨스턴돔",
      dateText: "매일 운영 · 반일 코스",
      imageTone: "from-amber-100 via-cyan-100 to-sky-200",
      posterLabel: "LOCAL TOUR",
      summary: "공연과 전시 방문 전후에 연결하기 좋은 고양 대표 로컬투어입니다.",
      description:
        "일산호수공원, 라페스타, 로컬 베이커리와 포토 스폿을 묶은 반일형 여행상품입니다. 공연 관람객, 가족 방문객, 해외 바이어 모두를 위한 유연한 일정으로 운영할 수 있습니다.",
      tags: ["버스투어", "로컬 명소", "반일 코스"],
      originalPrice: 78000,
      price: 59000,
      discountLabel: "24%",
      meetingPoint: "원마운트 광장",
      meetingPointAddress: "경기도 고양시 일산서구 한류월드로 300 원마운트 광장",
      meetingPointMapUrl: "https://map.naver.com/p/search/원마운트",
      meetingPointNote: "출발 15분 전 도착 필수",
      translations: {
        en: {
          title: "Ilsan Lake Park Sunset Local Tour",
          subtitle: "Half-day emotional route",
          location: "Ilsan Lake Park · La Festa · Western Dom",
          dateText: "Daily · Half-day course",
          posterLabel: "LOCAL TOUR",
          summary:
            "A signature Goyang local tour ideal for connecting with performances and exhibitions.",
          tags: ["Bus Tour", "Local Spots", "Half-day"],
          meetingPoint: "WonMount Plaza",
          meetingPointAddress:
            "300 Hallyu World-ro, Ilsanseo-gu, Goyang-si, Gyeonggi-do",
          meetingPointNote: "Arrive 15 minutes before departure",
          tabNotice: "※ The operation schedule may change due to weather or on-site conditions.\n※ A reservation confirmation SMS will be sent 2 hours before departure.",
          tabDetails: "Ilsan Lake Park Sunset Local Tour connects Goyang's iconic attractions in a half-day emotional experience.\n\n📍 Course Guide\n- Ilsan Lake Park Sunset Walk (approx. 60 min)\n- La Festa Street & Local Café (approx. 40 min)\n- Western Dom Night View Photo Time (approx. 30 min)\n\n🚌 Transportation\n- Dedicated shuttle bus (departing from KINTEX)\n- Minimum 4 participants for confirmed departure\n\n💡 Recommended for\n- First-time visitors to Goyang\n- Exhibition attendees with free time after KINTEX\n- VIP escort programs for international buyers",
          tabUsageInfo: "• Meeting point: KINTEX Hall 1 main entrance\n• Departure: 4:30 PM (arrive 15 min early)\n• Duration: approx. 2 hours 30 minutes\n• Wear comfortable sneakers\n• Some routes may change in rain\n• Snacks and drinks provided during tour\n• Minimum participants: 4",
          tabCancellation: "■ Cancellation & Refund Policy\n\n• 3 days to 1 day before use: 50% refund\n• Same-day cancellation or no-show: no refund\n• 4+ days before use: 100% refund\n\n■ Weather Cancellation\n• Full refund or reschedule if tour is cancelled due to weather\n\n■ Refund Processing\n• 3–5 business days depending on payment method",
          options: [
            { id: "weekday", label: "Weekday General Pass", benefits: ["Guide included", "Local coupon provided"] },
            { id: "vip", label: "Premium Companion Pass", benefits: ["Small group operation", "Photo documentation included"] },
          ],
        },
        ja: {
          title: "一山湖水公園サンセットローカルツアー",
          subtitle: "感性ルート 半日",
          location: "一山湖水公園 · ラフェスタ · ウェスタンドーム",
          dateText: "毎日運営 · 半日コース",
          posterLabel: "LOCAL TOUR",
          summary:
            "公演や展示の前後に繋げやすい、高陽の代表ローカルツアーです。",
          tags: ["バスツアー", "ローカル名所", "半日コース"],
          meetingPoint: "ウォンマウント広場",
          meetingPointAddress:
            "京畿道高陽市一山西区ハンリューワールド路 300 ウォンマウント広場",
          meetingPointNote: "出発15分前に到着必須",
          tabNotice: "※ 運営スケジュールは天候や現場状況により変更される場合があります。\n※ 出発2時間前に予約確定のSMSが送信されます。",
          tabDetails: "一山湖水公園サンセットローカルツアーは、高陽の代表名所を感性的に繋いだ半日型体験商品です。\n\n📍 コース案内\n- 一山湖水公園サンセット散策（約60分）\n- ラフェスタ街・ローカルカフェ（約40分）\n- ウェスタンドーム夜景フォトタイム（約30分）\n\n🚌 移動方法\n- 専用シャトルバス（KINTEX出発）\n- 最小4名以上で出発確定\n\n💡 こんな方におすすめ\n- 高陽初来訪のお客様\n- KINTEX展示参加後の自由時間旅行者\n- 海外バイヤーの随行プログラム",
          tabUsageInfo: "• 集合場所：KINTEX第1展示場正門前\n• 出発時間：午後4時30分（15分前到着必須）\n• 所要時間：約2時間30分\n• 服装：歩きやすいスニーカー推奨\n• 雨天時は一部コース変更あり\n• ツアー中に軽食・ドリンク提供\n• 最小出発人数：4名",
          tabCancellation: "■ キャンセル・払い戻し規定\n\n• ご利用日3日前〜前日：予約金の50%を払い戻し\n• 当日キャンセルまたはノーショー：払い戻し不可\n• ご利用日4日前以前：100%払い戻し\n\n■ 天候による中止\n• 悪天候でツアー運営不可の場合、全額払い戻しまたは日程変更\n\n■ 払い戻し処理期間\n• 支払い方法により3〜5営業日",
          options: [
            { id: "weekday", label: "平日一般チケット", benefits: ["ガイド込み", "ローカルクーポン付き"] },
            { id: "vip", label: "プレミアム同行チケット", benefits: ["小規模運営", "写真記録込み"] },
          ],
        },
        "zh-CN": {
          title: "一山湖水公园日落本地游",
          subtitle: "感性路线 半日",
          location: "一山湖水公园 · 拉费斯塔 · Western Dom",
          dateText: "每日运营 · 半日行程",
          posterLabel: "LOCAL TOUR",
          summary:
            "适合在演出和展览前后衔接的高阳代表本地游产品。",
          tags: ["巴士游", "本地景点", "半日游"],
          meetingPoint: "WonMount广场",
          meetingPointAddress:
            "京畿道高阳市一山西区韩流世界路300号 WonMount广场",
          meetingPointNote: "出发前15分钟务必到达",
          tabNotice: "※ 运营日程可能因天气或现场情况而变更。\n※ 出发前2小时将发送预订确认短信。",
          tabDetails: "一山湖水公园日落本地游是将高阳代表名胜感性连接的半日型体验产品。\n\n📍 行程指南\n- 一山湖水公园日落散步（约60分钟）\n- 拉费斯塔街道·本地咖啡馆（约40分钟）\n- Western Dom夜景拍照时间（约30分钟）\n\n🚌 交通方式\n- 专用班车（以KINTEX为出发地）\n- 最少4人以上出发确定\n\n💡 推荐人群\n- 首次访问高阳的游客\n- KINTEX展会后有空余时间的旅行者\n- 海外买家随行接待项目",
          tabUsageInfo: "• 集合地点：KINTEX第1展览馆正门前\n• 出发时间：下午4:30（出发前15分钟必须到达）\n• 所需时间：约2小时30分钟\n• 着装：建议穿舒适运动鞋\n• 雨天部分路线可能变更\n• 游览途中提供零食和饮料\n• 最少出发人数：4人",
          tabCancellation: "■ 取消及退款规定\n\n• 使用日前3天至前1天：退还预付款的50%\n• 使用当日取消或未出现：不予退款\n• 使用日前4天以上：全额退款\n\n■ 因天气取消\n• 因恶劣天气无法运营时，全额退款或变更日程\n\n■ 退款处理时间\n• 根据支付方式，需3-5个工作日",
          options: [
            { id: "weekday", label: "平日普通票", benefits: ["含导游", "提供本地优惠券"] },
            { id: "vip", label: "高级随行票", benefits: ["小规模运营", "含摄影记录"] },
          ],
        },
        "zh-TW": {
          title: "一山湖水公園日落在地遊",
          subtitle: "感性路線 半日",
          location: "一山湖水公園 · 拉費斯塔 · Western Dom",
          dateText: "每日運營 · 半日行程",
          posterLabel: "LOCAL TOUR",
          summary:
            "適合在演出和展覽前後銜接的高陽代表在地遊產品。",
          tags: ["巴士遊", "在地景點", "半日遊"],
          meetingPoint: "WonMount廣場",
          meetingPointAddress:
            "京畿道高陽市一山西區韓流世界路300號 WonMount廣場",
          meetingPointNote: "出發前15分鐘務必到達",
          tabNotice: "※ 運營日程可能因天氣或現場情況而變更。\n※ 出發前2小時將發送預訂確認簡訊。",
          tabDetails: "一山湖水公園日落在地遊是將高陽代表名勝感性連接的半日型體驗產品。\n\n📍 行程指南\n- 一山湖水公園日落散步（約60分鐘）\n- 拉費斯塔街道·在地咖啡館（約40分鐘）\n- Western Dom夜景拍照時間（約30分鐘）\n\n🚌 交通方式\n- 專用班車（以KINTEX為出發地）\n- 最少4人以上出發確定\n\n💡 推薦人群\n- 首次訪問高陽的遊客\n- KINTEX展會後有空餘時間的旅行者\n- 海外買家隨行接待項目",
          tabUsageInfo: "• 集合地點：KINTEX第1展覽館正門前\n• 出發時間：下午4:30（出發前15分鐘必須到達）\n• 所需時間：約2小時30分鐘\n• 著裝：建議穿舒適運動鞋\n• 雨天部分路線可能變更\n• 遊覽途中提供零食和飲料\n• 最少出發人數：4人",
          tabCancellation: "■ 取消及退款規定\n\n• 使用日前3天至前1天：退還預付款的50%\n• 使用當日取消或未出現：不予退款\n• 使用日前4天以上：全額退款\n\n■ 因天氣取消\n• 因惡劣天氣無法運營時，全額退款或變更日程\n\n■ 退款處理時間\n• 根據支付方式，需3-5個工作日",
          options: [
            { id: "weekday", label: "平日普通票", benefits: ["含導遊", "提供在地優惠券"] },
            { id: "vip", label: "高級隨行票", benefits: ["小規模運營", "含攝影記錄"] },
          ],
        },
      },
      tabNotice: "※ 운영 일정은 기상 및 현장 상황에 따라 변경될 수 있습니다.\n※ 출발 2시간 전까지 예약 확정 안내 문자가 발송됩니다.",
      tabDetails: "일산호수공원 선셋 로컬투어는 고양의 대표 명소를 감성적으로 연결한 반일형 체험 상품입니다.\n\n📍 코스 안내\n- 일산호수공원 선셋 산책 (약 60분)\n- 라페스타 거리 & 로컬 카페 (약 40분)\n- 웨스턴돔 야경 포토타임 (약 30분)\n\n🚌 이동 방법\n- 전용 셔틀 버스 제공 (KINTEX 출발 기준)\n- 최소 4인 이상 출발 확정\n\n💡 이런 분께 추천해요\n- 고양 첫 방문 방문객\n- KINTEX 전시 참가 후 자유 시간 여행객\n- 해외 바이어 의전 동행 프로그램",
      tabUsageInfo: "• 집결 장소: KINTEX 1전시장 정문 앞\n• 출발 시간: 오후 4시 30분 (15분 전 도착 필수)\n• 소요 시간: 약 2시간 30분\n• 복장: 편한 운동화 권장\n• 우천 시 일부 코스 변경 가능\n• 투어 중 간식 및 음료 제공\n• 최소 출발 인원: 4인",
      tabCancellation: "■ 취소 및 환불 규정\n\n• 이용일 3일 전 ~ 이용일 전날: 예약금의 50% 환불\n• 이용일 당일 취소 또는 노쇼: 환불 불가\n• 이용일 4일 전 이전: 100% 환불\n\n■ 날씨로 인한 취소\n• 투어 운영 불가 수준의 기상 상황 시 전액 환불 또는 일정 변경\n\n■ 환불 처리 기간\n• 결제 수단에 따라 3~5 영업일 소요",
      options: [
        {
          id: "weekday",
          label: "평일 일반권",
          price: 59000,
          benefits: ["가이드 포함", "로컬 쿠폰 제공"],
        },
        {
          id: "vip",
          label: "프리미엄 동행권",
          price: 89000,
          benefits: ["소규모 운영", "사진 기록 포함"],
        },
      ],
    },
    {
      id: "k-culture-city-walk",
      title: "K-컬처 시티워크 투어",
      subtitle: "오전 또는 오후 선택",
      location: "고양 스타필드 · 공연장 연계 동선",
      dateText: "오전/오후 선택 가능",
      imageTone: "from-fuchsia-100 via-pink-100 to-orange-200",
      posterLabel: "CITY WALK",
      summary: "K-컬처와 라이프스타일을 묶은 도심형 체험 상품입니다.",
      description:
        "쇼핑, 공연, 라이프스타일 스폿을 연결하는 워킹형 상품입니다. 공연 관람 이후 짧은 체류 시간을 확장하고 싶은 방문객에게 특히 잘 맞습니다.",
      tags: ["도심투어", "K-컬처", "라이프스타일"],
      originalPrice: 52000,
      price: 41000,
      discountLabel: "21%",
      meetingPoint: "원마운트 광장",
      meetingPointAddress: "경기도 고양시 일산서구 한류월드로 300 원마운트 광장",
      meetingPointMapUrl: "https://map.naver.com/p/search/원마운트",
      meetingPointNote: "출발 15분 전 도착 필수",
      translations: {
        en: {
          title: "K-Culture City Walk Tour",
          subtitle: "Morning or afternoon available",
          location: "Starfield Goyang · Venue-linked route",
          dateText: "Morning/Afternoon selectable",
          posterLabel: "CITY WALK",
          summary:
            "A city walking tour connecting K-Culture and lifestyle spots.",
          tags: ["City Tour", "K-Culture", "Lifestyle"],
          meetingPoint: "WonMount Plaza",
          meetingPointNote: "Arrive 15 minutes before departure",
          options: [
            { id: "am", label: "Morning City Walk", benefits: ["Guide included"] },
            { id: "pm", label: "Afternoon City Walk", benefits: ["Evening route recommended"] },
          ],
        },
        ja: {
          title: "K-カルチャーシティウォークツアー",
          subtitle: "午前または午後選択",
          location: "高陽スターフィールド · 公演場連携動線",
          dateText: "午前/午後選択可能",
          posterLabel: "CITY WALK",
          summary:
            "K-カルチャーとライフスタイルを繋ぐ都心型体験商品です。",
          tags: ["都心ツアー", "K-カルチャー", "ライフスタイル"],
          meetingPoint: "ウォンマウント広場",
          meetingPointNote: "出発15分前に到着必須",
          options: [
            { id: "am", label: "午前シティウォーク", benefits: ["ガイド込み"] },
            { id: "pm", label: "午後シティウォーク", benefits: ["夜間動線推奨"] },
          ],
        },
        "zh-CN": {
          title: "K-文化城市漫步之旅",
          subtitle: "上午或下午选择",
          location: "高阳Starfield · 演出场连接路线",
          dateText: "上午/下午可选",
          posterLabel: "CITY WALK",
          summary:
            "连接K-文化与生活方式的都市体验产品。",
          tags: ["都市游", "K-文化", "生活方式"],
          meetingPoint: "WonMount广场",
          meetingPointNote: "出发前15分钟务必到达",
          options: [
            { id: "am", label: "上午城市漫步", benefits: ["含导游"] },
            { id: "pm", label: "下午城市漫步", benefits: ["推荐夜间路线"] },
          ],
        },
        "zh-TW": {
          title: "K-文化城市漫步之旅",
          subtitle: "上午或下午選擇",
          location: "高陽Starfield · 演出場連接路線",
          dateText: "上午/下午可選",
          posterLabel: "CITY WALK",
          summary:
            "連接K-文化與生活風格的都市體驗產品。",
          tags: ["都市遊", "K-文化", "生活風格"],
          meetingPoint: "WonMount廣場",
          meetingPointNote: "出發前15分鐘務必到達",
          options: [
            { id: "am", label: "上午城市漫步", benefits: ["含導遊"] },
            { id: "pm", label: "下午城市漫步", benefits: ["推薦夜間路線"] },
          ],
        },
      },
      options: [
        {
          id: "am",
          label: "오전 시티워크",
          price: 41000,
          benefits: ["가이드 포함"],
        },
        {
          id: "pm",
          label: "오후 시티워크",
          price: 43000,
          benefits: ["야간 동선 추천"],
        },
      ],
    },
    {
      id: "family-healing-course",
      title: "가족 힐링 체험 패키지",
      subtitle: "가족 추천 1일",
      location: "고양 생태공원 · 체험농장",
      dateText: "주말 집중 운영",
      imageTone: "from-lime-100 via-emerald-100 to-cyan-200",
      posterLabel: "FAMILY",
      summary: "아이와 부모가 함께 즐길 수 있는 자연형 로컬 체험 상품입니다.",
      description:
        "생태공원 산책, 농장 체험, 로컬 푸드 체험을 묶은 가족형 상품입니다. 숙박이나 라이프스타일 예약과 연결하면 체류형 프로그램으로 확장하기 좋습니다.",
      tags: ["가족", "체험", "주말"],
      originalPrice: 98000,
      price: 76000,
      discountLabel: "22%",
      meetingPoint: "원마운트 광장",
      meetingPointAddress: "경기도 고양시 일산서구 한류월드로 300 원마운트 광장",
      meetingPointMapUrl: "https://map.naver.com/p/search/원마운트",
      meetingPointNote: "출발 20분 전 도착 권장",
      translations: {
        en: {
          title: "Family Healing Experience Package",
          subtitle: "Recommended for families · 1 day",
          location: "Goyang Eco Park · Experience Farm",
          dateText: "Weekend operation",
          posterLabel: "FAMILY",
          summary:
            "A nature-based local experience that parents and children can enjoy together.",
          tags: ["Family", "Experience", "Weekend"],
          meetingPoint: "WonMount Plaza",
          meetingPointNote: "Arrive 20 minutes before departure",
          options: [
            { id: "four", label: "Family 4-Person Pass", benefits: ["Experience materials included"] },
            { id: "six", label: "Family 6-Person Pass", benefits: ["Private space provided"] },
          ],
        },
        ja: {
          title: "家族ヒーリング体験パッケージ",
          subtitle: "家族推薦 1日",
          location: "高陽生態公園 · 体験農場",
          dateText: "週末集中運営",
          posterLabel: "FAMILY",
          summary:
            "子供と親が一緒に楽しめる自然型ローカル体験商品です。",
          tags: ["家族", "体験", "週末"],
          meetingPoint: "ウォンマウント広場",
          meetingPointNote: "出発20分前到着推奨",
          options: [
            { id: "four", label: "家族4名チケット", benefits: ["体験材料込み"] },
            { id: "six", label: "家族6名チケット", benefits: ["専用スペース提供"] },
          ],
        },
        "zh-CN": {
          title: "家庭疗愈体验套餐",
          subtitle: "家庭推荐 1日",
          location: "高阳生态公园 · 体验农场",
          dateText: "周末集中运营",
          posterLabel: "FAMILY",
          summary:
            "适合亲子共同享受的自然型本地体验产品。",
          tags: ["家庭", "体验", "周末"],
          meetingPoint: "WonMount广场",
          meetingPointNote: "建议出发前20分钟到达",
          options: [
            { id: "four", label: "家庭4人票", benefits: ["含体验材料"] },
            { id: "six", label: "家庭6人票", benefits: ["提供专用空间"] },
          ],
        },
        "zh-TW": {
          title: "家庭療癒體驗套餐",
          subtitle: "家庭推薦 1日",
          location: "高陽生態公園 · 體驗農場",
          dateText: "週末集中運營",
          posterLabel: "FAMILY",
          summary:
            "適合親子共同享受的自然型在地體驗產品。",
          tags: ["家庭", "體驗", "週末"],
          meetingPoint: "WonMount廣場",
          meetingPointNote: "建議出發前20分鐘到達",
          options: [
            { id: "four", label: "家庭4人票", benefits: ["含體驗材料"] },
            { id: "six", label: "家庭6人票", benefits: ["提供專用空間"] },
          ],
        },
      },
      options: [
        {
          id: "four",
          label: "가족 4인권",
          price: 76000,
          benefits: ["체험 재료 포함"],
        },
        {
          id: "six",
          label: "가족 6인권",
          price: 109000,
          benefits: ["전용 공간 제공"],
        },
      ],
    },
    {
      id: "night-photo-bus",
      title: "고양 나이트 포토 버스투어",
      subtitle: "야간 감성 코스",
      location: "호수공원 · 야경 포토 스폿",
      dateText: "금/토 야간 운영",
      imageTone: "from-slate-700 via-indigo-500 to-sky-400",
      posterLabel: "NIGHT",
      summary: "야경 명소와 사진 포인트를 연결한 야간형 투어 상품입니다.",
      description:
        "고양의 야경 스폿과 공연장 주변의 감도 높은 공간을 연결한 로컬 체험 코스입니다. 커플, 해외 방문객, 야간 콘텐츠 수요에 적합합니다.",
      tags: ["야간투어", "포토", "버스투어"],
      originalPrice: 64000,
      price: 49000,
      discountLabel: "23%",
      meetingPoint: "원마운트 광장",
      meetingPointAddress: "경기도 고양시 일산서구 한류월드로 300 원마운트 광장",
      meetingPointMapUrl: "https://map.naver.com/p/search/원마운트",
      meetingPointNote: "야간 출발 · 15분 전 도착",
      translations: {
        en: {
          title: "Goyang Night Photo Bus Tour",
          subtitle: "Night-vibe emotional course",
          location: "Lake Park · Night Photo Spots",
          dateText: "Fri/Sat Night operation",
          posterLabel: "NIGHT",
          summary:
            "A night tour linking Goyang's night views and photo spots.",
          tags: ["Night Tour", "Photo", "Bus Tour"],
          meetingPoint: "WonMount Plaza",
          meetingPointNote: "Night departure · Arrive 15 min early",
          options: [
            { id: "photo", label: "Photo Tour Pass", benefits: ["Photo spot guidance"] },
            { id: "photo-vip", label: "Premium Photo Pass", benefits: ["Private vehicle", "Night snap included"] },
          ],
        },
        ja: {
          title: "高陽ナイトフォトバスツアー",
          subtitle: "夜間感性コース",
          location: "湖水公園 · 夜景フォトスポット",
          dateText: "金/土 夜間運営",
          posterLabel: "NIGHT",
          summary:
            "夜景名所と撮影スポットを繋いだ夜間型ツアー商品です。",
          tags: ["夜間ツアー", "フォト", "バスツアー"],
          meetingPoint: "ウォンマウント広場",
          meetingPointNote: "夜間出発 · 15分前到着",
          options: [
            { id: "photo", label: "フォトツアーチケット", benefits: ["撮影スポット案内"] },
            { id: "photo-vip", label: "プレミアムフォトチケット", benefits: ["専用車両", "夜景スナップ込み"] },
          ],
        },
        "zh-CN": {
          title: "高阳夜景摄影巴士游",
          subtitle: "夜间感性路线",
          location: "湖水公园 · 夜景摄影地点",
          dateText: "周五/周六夜间运营",
          posterLabel: "NIGHT",
          summary:
            "连接夜景名胜和摄影地点的夜间游产品。",
          tags: ["夜间游", "摄影", "巴士游"],
          meetingPoint: "WonMount广场",
          meetingPointNote: "夜间出发 · 提前15分钟到达",
          options: [
            { id: "photo", label: "摄影游览票", benefits: ["摄影地点引导"] },
            { id: "photo-vip", label: "高级摄影票", benefits: ["专用车辆", "含夜景快照"] },
          ],
        },
        "zh-TW": {
          title: "高陽夜景攝影巴士遊",
          subtitle: "夜間感性路線",
          location: "湖水公園 · 夜景攝影地點",
          dateText: "週五/週六夜間運營",
          posterLabel: "NIGHT",
          summary:
            "連接夜景名勝和攝影地點的夜間遊產品。",
          tags: ["夜間遊", "攝影", "巴士遊"],
          meetingPoint: "WonMount廣場",
          meetingPointNote: "夜間出發 · 提前15分鐘到達",
          options: [
            { id: "photo", label: "攝影遊覽票", benefits: ["攝影地點引導"] },
            { id: "photo-vip", label: "高級攝影票", benefits: ["專用車輛", "含夜景快照"] },
          ],
        },
      },
      options: [
        {
          id: "photo",
          label: "포토 투어권",
          price: 49000,
          benefits: ["촬영 포인트 안내"],
        },
        {
          id: "photo-vip",
          label: "프리미엄 포토권",
          price: 74000,
          benefits: ["전용 차량", "야경 스냅 포함"],
        },
      ],
    },
  ],
  stay: [
    {
      id: "kintex-business-stay",
      title: "KINTEX 비즈니스 스테이",
      subtitle: "전시 참가자 전용",
      location: "KINTEX 인근 비즈니스 호텔",
      dateText: "1박~5박 예약 가능",
      imageTone: "from-slate-100 via-zinc-100 to-stone-200",
      posterLabel: "STAY",
      summary: "전시 참가자와 바이어를 위한 연속형 숙박 패키지입니다.",
      description:
        "KINTEX 접근성이 좋은 비즈니스 호텔 상품으로, 조식, 셔틀, 빠른 체크인 옵션까지 선택할 수 있습니다. 행사 일정과 연동해 객실 블록 운영도 가능합니다.",
      tags: ["비즈니스호텔", "전시 참가", "조식 선택"],
      originalPrice: 178000,
      price: 139000,
      discountLabel: "21%",
      translations: {
        en: { title: "KINTEX Business Stay", subtitle: "Exhibition attendees only", location: "Business hotels near KINTEX", dateText: "1-5 nights available", posterLabel: "STAY", summary: "A continuous stay package for exhibitors and buyers.", tags: ["Business Hotel", "Exhibition", "Breakfast"], options: [{ id: "standard", label: "Standard Double", benefits: ["Breakfast option", "Fast check-in"] }, { id: "executive", label: "Executive Twin", benefits: ["Lounge access", "Shuttle included"] }] },
        ja: { title: "KINTEXビジネスステイ", subtitle: "展示参加者専用", location: "KINTEX近隣ビジネスホテル", dateText: "1泊〜5泊予約可能", posterLabel: "STAY", summary: "展示参加者とバイヤーのための連泊型宿泊パッケージ。", tags: ["ビジネスホテル", "展示参加", "朝食選択"], options: [{ id: "standard", label: "スタンダードダブル", benefits: ["朝食選択", "早期チェックイン"] }, { id: "executive", label: "エグゼクティブツイン", benefits: ["ラウンジ利用", "シャトル込み"] }] },
        "zh-CN": { title: "KINTEX商务住宿", subtitle: "展会参会者专属", location: "KINTEX附近商务酒店", dateText: "可预订1-5晚", posterLabel: "STAY", summary: "为展会参会者和买家提供的连续住宿套餐。", tags: ["商务酒店", "展会", "可选早餐"], options: [{ id: "standard", label: "标准双人间", benefits: ["可选早餐", "快速入住"] }, { id: "executive", label: "行政双床间", benefits: ["贵宾厅使用", "含班车"] }] },
        "zh-TW": { title: "KINTEX商務住宿", subtitle: "展會參會者專屬", location: "KINTEX附近商務酒店", dateText: "可預訂1-5晚", posterLabel: "STAY", summary: "為展會參會者和買家提供的連續住宿套餐。", tags: ["商務酒店", "展會", "可選早餐"], options: [{ id: "standard", label: "標準雙人間", benefits: ["可選早餐", "快速入住"] }, { id: "executive", label: "行政雙床間", benefits: ["貴賓廳使用", "含班車"] }] },
      },
      options: [
        {
          id: "standard",
          label: "스탠더드 더블",
          price: 139000,
          benefits: ["조식 선택", "빠른 체크인"],
        },
        {
          id: "executive",
          label: "이그제큐티브 트윈",
          price: 189000,
          benefits: ["라운지 이용", "셔틀 포함"],
        },
      ],
    },
    {
      id: "vip-suite-stay",
      title: "VIP 스위트 스테이",
      subtitle: "아티스트 · 바이어 운영",
      location: "고양 프리미엄 호텔",
      dateText: "1박 단위 예약",
      imageTone: "from-amber-100 via-orange-100 to-rose-200",
      posterLabel: "VIP",
      summary: "아티스트, VIP, 고급 초청 고객을 위한 스위트 객실 상품입니다.",
      description:
        "프라이빗 체크인, 전용 차량 연결, 컨시어지 요청까지 함께 운영할 수 있는 숙박 상품입니다. 공항픽업과 함께 구성하면 VIP 패키지로 확장 가능합니다.",
      tags: ["VIP", "스위트", "컨시어지"],
      originalPrice: 420000,
      price: 345000,
      discountLabel: "18%",
      translations: {
        en: { title: "VIP Suite Stay", subtitle: "For artists & buyers", location: "Goyang Premium Hotel", dateText: "Per night booking", posterLabel: "VIP", summary: "Suite rooms for artists, VIPs and premium guests.", tags: ["VIP", "Suite", "Concierge"], options: [{ id: "suite", label: "Suite 1 Night", benefits: ["Welcome amenity", "Concierge"] }, { id: "suite-car", label: "Suite + Vehicle", benefits: ["Airport transfer", "Private check-in"] }] },
        ja: { title: "VIPスイートステイ", subtitle: "アーティスト・バイヤー運営", location: "高陽プレミアムホテル", dateText: "1泊単位予約", posterLabel: "VIP", summary: "アーティスト、VIP、高級招待顧客のためのスイートルーム。", tags: ["VIP", "スイート", "コンシェルジュ"], options: [{ id: "suite", label: "スイート1泊", benefits: ["ウェルカムアメニティ", "コンシェルジュ"] }, { id: "suite-car", label: "スイート＋車両", benefits: ["空港連携", "専用チェックイン"] }] },
        "zh-CN": { title: "VIP套房住宿", subtitle: "艺人·买家专属", location: "高阳高端酒店", dateText: "按晚预订", posterLabel: "VIP", summary: "为艺人、VIP及贵宾提供的套房产品。", tags: ["VIP", "套房", "礼宾"], options: [{ id: "suite", label: "套房1晚", benefits: ["欢迎礼品", "礼宾服务"] }, { id: "suite-car", label: "套房＋用车", benefits: ["机场接送", "专属入住"] }] },
        "zh-TW": { title: "VIP套房住宿", subtitle: "藝人·買家專屬", location: "高陽高端酒店", dateText: "按晚預訂", posterLabel: "VIP", summary: "為藝人、VIP及貴賓提供的套房產品。", tags: ["VIP", "套房", "禮賓"], options: [{ id: "suite", label: "套房1晚", benefits: ["歡迎禮品", "禮賓服務"] }, { id: "suite-car", label: "套房＋用車", benefits: ["機場接送", "專屬入住"] }] },
      },
      options: [
        {
          id: "suite",
          label: "스위트 1박",
          price: 345000,
          benefits: ["웰컴 어메니티", "컨시어지"],
        },
        {
          id: "suite-car",
          label: "스위트 + 차량",
          price: 468000,
          benefits: ["공항 연계", "전용 체크인"],
        },
      ],
    },
    {
      id: "family-weekend-stay",
      title: "가족 주말 스테이 패키지",
      subtitle: "로컬 체험 연계",
      location: "일산호수공원 인근 호텔",
      dateText: "금·토·일 운영",
      imageTone: "from-sky-100 via-cyan-100 to-lime-100",
      posterLabel: "WEEKEND",
      summary: "가족 체험 프로그램과 연결되는 주말형 숙박 패키지입니다.",
      description:
        "객실 숙박과 로컬 카페, 체험 프로그램, 티켓 상품을 함께 묶을 수 있는 체류형 패키지입니다. 가족 방문객의 평균 체류 시간을 늘리는 구조에 적합합니다.",
      tags: ["가족", "주말", "체험 연계"],
      originalPrice: 238000,
      price: 185000,
      discountLabel: "22%",
      translations: {
        en: { title: "Family Weekend Stay Package", subtitle: "Local experience combo", location: "Hotels near Ilsan Lake Park", dateText: "Fri/Sat/Sun operation", posterLabel: "WEEKEND", summary: "A weekend stay package linked with family experience programs.", tags: ["Family", "Weekend", "Experience"], options: [{ id: "family-room", label: "Family Room 1 Night", benefits: ["Children's amenity set"] }, { id: "family-plus", label: "Family Room + Experience", benefits: ["Café coupon", "Experience ticket included"] }] },
        ja: { title: "家族週末ステイパッケージ", subtitle: "ローカル体験連携", location: "一山湖水公園近隣ホテル", dateText: "金・土・日運営", posterLabel: "WEEKEND", summary: "家族体験プログラムと連携する週末型宿泊パッケージ。", tags: ["家族", "週末", "体験連携"], options: [{ id: "family-room", label: "ファミリールーム1泊", benefits: ["子供用アメニティセット"] }, { id: "family-plus", label: "ファミリールーム＋体験", benefits: ["カフェクーポン", "体験券込み"] }] },
        "zh-CN": { title: "家庭周末住宿套餐", subtitle: "本地体验连接", location: "一山湖水公园附近酒店", dateText: "周五·六·日运营", posterLabel: "WEEKEND", summary: "与家庭体验项目连接的周末住宿套餐。", tags: ["家庭", "周末", "体验连接"], options: [{ id: "family-room", label: "家庭房1晚", benefits: ["儿童礼品套装"] }, { id: "family-plus", label: "家庭房＋体验", benefits: ["咖啡馆优惠券", "含体验票"] }] },
        "zh-TW": { title: "家庭週末住宿套餐", subtitle: "在地體驗連接", location: "一山湖水公園附近酒店", dateText: "週五·六·日運營", posterLabel: "WEEKEND", summary: "與家庭體驗項目連接的週末住宿套餐。", tags: ["家庭", "週末", "體驗連接"], options: [{ id: "family-room", label: "家庭房1晚", benefits: ["兒童禮品套裝"] }, { id: "family-plus", label: "家庭房＋體驗", benefits: ["咖啡館優惠券", "含體驗票"] }] },
      },
      options: [
        {
          id: "family-room",
          label: "패밀리룸 1박",
          price: 185000,
          benefits: ["아동 어메니티 세트"],
        },
        {
          id: "family-plus",
          label: "패밀리룸 + 체험",
          price: 229000,
          benefits: ["카페 쿠폰", "체험권 포함"],
        },
      ],
    },
    {
      id: "group-room-block",
      title: "단체 객실 블록 예약",
      subtitle: "이벤트 · 기업 그룹",
      location: "고양 주요 호텔 다중 연계",
      dateText: "20객실 이상 문의 가능",
      imageTone: "from-indigo-100 via-slate-100 to-zinc-200",
      posterLabel: "GROUP",
      summary: "행사 단체를 위한 객실 블록 예약 상품입니다.",
      description:
        "20객실 이상 그룹 숙박을 전제로 만든 단체 객실 블록 상품입니다. 룸타입 배분, 체크인 명단, 셔틀 연계, 후불 정산까지 함께 운영하기 좋습니다.",
      tags: ["단체", "룸블록", "후불 정산"],
      originalPrice: 210000,
      price: 168000,
      discountLabel: "20%",
      translations: {
        en: { title: "Group Room Block Reservation", subtitle: "Events · Corporate groups", location: "Multiple major Goyang hotels", dateText: "20+ rooms inquiry", posterLabel: "GROUP", summary: "A room block reservation for event groups.", tags: ["Group", "Room Block", "Post-payment"], options: [{ id: "block-standard", label: "Basic Room Block", benefits: ["Group list management"] }, { id: "block-premium", label: "Premium Room Block", benefits: ["Shuttle", "Post-payment settlement"] }] },
        ja: { title: "団体客室ブロック予約", subtitle: "イベント·企業グループ", location: "高陽主要ホテル連携", dateText: "20室以上問い合わせ", posterLabel: "GROUP", summary: "行事団体のための客室ブロック予約商品。", tags: ["団体", "ルームブロック", "後払い"], options: [{ id: "block-standard", label: "基本ルームブロック", benefits: ["グループ名簿管理"] }, { id: "block-premium", label: "プレミアムルームブロック", benefits: ["シャトル", "後払い精算"] }] },
        "zh-CN": { title: "团体房间预订", subtitle: "活动·企业团体", location: "高阳主要酒店联动", dateText: "20间以上咨询", posterLabel: "GROUP", summary: "为活动团体提供的房间整块预订产品。", tags: ["团体", "房间整块", "后付款"], options: [{ id: "block-standard", label: "基本房间整块", benefits: ["团体名单管理"] }, { id: "block-premium", label: "高级房间整块", benefits: ["班车", "后付款结算"] }] },
        "zh-TW": { title: "團體房間預訂", subtitle: "活動·企業團體", location: "高陽主要酒店聯動", dateText: "20間以上諮詢", posterLabel: "GROUP", summary: "為活動團體提供的房間整塊預訂產品。", tags: ["團體", "房間整塊", "後付款"], options: [{ id: "block-standard", label: "基本房間整塊", benefits: ["團體名單管理"] }, { id: "block-premium", label: "高級房間整塊", benefits: ["班車", "後付款結算"] }] },
      },
      options: [
        {
          id: "block-standard",
          label: "기본 룸블록",
          price: 168000,
          benefits: ["그룹 명단관리"],
        },
        {
          id: "block-premium",
          label: "프리미엄 룸블록",
          price: 214000,
          benefits: ["셔틀", "후불 정산"],
        },
      ],
    },
  ],
  restaurant: [
    {
      id: "kintex-dining-course",
      title: "KINTEX 비즈니스 코스 다이닝",
      subtitle: "바이어 미팅 전용",
      location: "KINTEX 인근 프리미엄 레스토랑",
      dateText: "점심/저녁 선택 가능",
      imageTone: "from-amber-100 via-stone-100 to-orange-200",
      posterLabel: "DINING",
      summary: "바이어 미팅과 소규모 비즈니스 만찬에 적합한 코스 다이닝 예약입니다.",
      description:
        "전시 참가자와 바이어 미팅에 맞춘 코스 다이닝 상품입니다. 룸 좌석, 통역 동선, 식단 조정, 세금계산서 발행까지 연결할 수 있습니다.",
      tags: ["비즈니스", "코스 다이닝", "룸 좌석"],
      originalPrice: 98000,
      price: 76000,
      discountLabel: "22%",
      translations: {
        en: { title: "KINTEX Business Course Dining", subtitle: "For buyer meetings", location: "Premium restaurant near KINTEX", dateText: "Lunch/Dinner available", posterLabel: "DINING", summary: "Course dining ideal for buyer meetings and small business dinners.", tags: ["Business", "Course Dining", "Private Room"], options: [{ id: "lunch", label: "Lunch Course", benefits: ["Private room available"] }, { id: "dinner", label: "Dinner Course", benefits: ["Welcome drink included"] }] },
        ja: { title: "KINTEXビジネスコースダイニング", subtitle: "バイヤーミーティング専用", location: "KINTEX近隣プレミアムレストラン", dateText: "昼/夜選択可", posterLabel: "DINING", summary: "バイヤーミーティングや小規模ビジネス会食に最適なコースダイニング。", tags: ["ビジネス", "コース", "個室"], options: [{ id: "lunch", label: "ランチコース", benefits: ["個室利用可"] }, { id: "dinner", label: "ディナーコース", benefits: ["ウェルカムドリンク込み"] }] },
        "zh-CN": { title: "KINTEX商务套餐", subtitle: "买家会议专属", location: "KINTEX附近高端餐厅", dateText: "可选午餐/晚餐", posterLabel: "DINING", summary: "适合买家会议和小型商务晚宴的套餐预订。", tags: ["商务", "套餐", "包间"], options: [{ id: "lunch", label: "午餐套餐", benefits: ["可用包间"] }, { id: "dinner", label: "晚餐套餐", benefits: ["含欢迎饮品"] }] },
        "zh-TW": { title: "KINTEX商務套餐", subtitle: "買家會議專屬", location: "KINTEX附近高端餐廳", dateText: "可選午餐/晚餐", posterLabel: "DINING", summary: "適合買家會議和小型商務晚宴的套餐預訂。", tags: ["商務", "套餐", "包間"], options: [{ id: "lunch", label: "午餐套餐", benefits: ["可用包間"] }, { id: "dinner", label: "晚餐套餐", benefits: ["含歡迎飲品"] }] },
      },
      options: [
        {
          id: "lunch",
          label: "런치 코스",
          price: 76000,
          benefits: ["룸 좌석 가능"],
        },
        {
          id: "dinner",
          label: "디너 코스",
          price: 109000,
          benefits: ["웰컴 드링크 포함"],
        },
      ],
    },
    {
      id: "local-food-table",
      title: "고양 로컬 미식 테이블",
      subtitle: "관광특구 상권 연계",
      location: "원마운트 · 라페스타 상권",
      dateText: "매일 운영",
      imageTone: "from-rose-100 via-orange-100 to-amber-200",
      posterLabel: "LOCAL FOOD",
      summary: "고양 로컬 상권을 경험할 수 있는 미식형 예약 상품입니다.",
      description:
        "상권 체류를 늘릴 수 있도록 로컬 인기 메뉴와 골목 공간 경험을 묶은 식사 상품입니다. 소규모 그룹과 개별 방문객 모두에게 적합합니다.",
      tags: ["로컬 미식", "상권 연계", "체류형"],
      originalPrice: 42000,
      price: 32000,
      discountLabel: "24%",
      translations: {
        en: { title: "Goyang Local Gourmet Table", subtitle: "Tourism-zone linked", location: "WonMount · La Festa area", dateText: "Daily", posterLabel: "LOCAL FOOD", summary: "A gourmet booking that lets you experience Goyang's local districts.", tags: ["Local Food", "District", "Stay-friendly"], options: [{ id: "set", label: "Local Set", benefits: ["Signature menu included"] }, { id: "special", label: "Special Course", benefits: ["Dessert included"] }] },
        ja: { title: "高陽ローカル美食テーブル", subtitle: "観光特区商圏連携", location: "ウォンマウント · ラフェスタ", dateText: "毎日運営", posterLabel: "LOCAL FOOD", summary: "高陽のローカル商圏を体験できる美食型予約商品。", tags: ["ローカル美食", "商圏", "滞在型"], options: [{ id: "set", label: "ローカルセット", benefits: ["代表メニュー込み"] }, { id: "special", label: "スペシャルコース", benefits: ["デザート込み"] }] },
        "zh-CN": { title: "高阳本地美食餐桌", subtitle: "旅游特区商圈连接", location: "WonMount · La Festa商圈", dateText: "每日运营", posterLabel: "LOCAL FOOD", summary: "可体验高阳本地商圈的美食型预订产品。", tags: ["本地美食", "商圈", "滞留型"], options: [{ id: "set", label: "本地套餐", benefits: ["含招牌菜"] }, { id: "special", label: "特别套餐", benefits: ["含甜点"] }] },
        "zh-TW": { title: "高陽在地美食餐桌", subtitle: "旅遊特區商圈連接", location: "WonMount · La Festa商圈", dateText: "每日運營", posterLabel: "LOCAL FOOD", summary: "可體驗高陽在地商圈的美食型預訂產品。", tags: ["在地美食", "商圈", "滯留型"], options: [{ id: "set", label: "在地套餐", benefits: ["含招牌菜"] }, { id: "special", label: "特別套餐", benefits: ["含甜點"] }] },
      },
      options: [
        {
          id: "set",
          label: "로컬 세트",
          price: 32000,
          benefits: ["대표 메뉴 포함"],
        },
        {
          id: "special",
          label: "스페셜 코스",
          price: 47000,
          benefits: ["디저트 포함"],
        },
      ],
    },
    {
      id: "vip-banquet-night",
      title: "VIP 만찬 나이트",
      subtitle: "프라이빗 다이닝",
      location: "고양 프라이빗 다이닝룸",
      dateText: "사전 예약제",
      imageTone: "from-slate-800 via-amber-700 to-stone-500",
      posterLabel: "VIP",
      summary: "고급 초청객을 위한 프라이빗 만찬 상품입니다.",
      description:
        "VIP 응대와 의전 흐름에 맞춰 설계된 만찬형 상품입니다. 공항픽업, 숙박, 티켓 초청과 연계하기 쉬운 구조입니다.",
      tags: ["VIP", "만찬", "프라이빗"],
      originalPrice: 180000,
      price: 149000,
      discountLabel: "17%",
      translations: {
        en: { title: "VIP Banquet Night", subtitle: "Private dining", location: "Goyang Private Dining Room", dateText: "Reservation required", posterLabel: "VIP", summary: "Private banquet product for premium invited guests.", tags: ["VIP", "Banquet", "Private"], options: [{ id: "private", label: "Private Dining", benefits: ["Private room", "Custom menu"] }, { id: "private-plus", label: "Private Dining Plus", benefits: ["Wine pairing", "Dedicated service"] }] },
        ja: { title: "VIP晩餐ナイト", subtitle: "プライベートダイニング", location: "高陽プライベートダイニングルーム", dateText: "事前予約制", posterLabel: "VIP", summary: "高級招待客のためのプライベート晩餐商品。", tags: ["VIP", "晩餐", "プライベート"], options: [{ id: "private", label: "プライベートダイニング", benefits: ["専用ルーム", "カスタムメニュー"] }, { id: "private-plus", label: "プライベートダイニングプラス", benefits: ["ワインペアリング", "専任対応"] }] },
        "zh-CN": { title: "VIP晚宴之夜", subtitle: "私人用餐", location: "高阳私人用餐厅", dateText: "需提前预约", posterLabel: "VIP", summary: "为高端邀请宾客提供的私人晚宴产品。", tags: ["VIP", "晚宴", "私人"], options: [{ id: "private", label: "私人餐厅", benefits: ["专用包间", "定制菜单"] }, { id: "private-plus", label: "私人餐厅Plus", benefits: ["葡萄酒搭配", "专属服务"] }] },
        "zh-TW": { title: "VIP晚宴之夜", subtitle: "私人用餐", location: "高陽私人用餐廳", dateText: "需提前預約", posterLabel: "VIP", summary: "為高端邀請賓客提供的私人晚宴產品。", tags: ["VIP", "晚宴", "私人"], options: [{ id: "private", label: "私人餐廳", benefits: ["專用包間", "定製菜單"] }, { id: "private-plus", label: "私人餐廳Plus", benefits: ["葡萄酒搭配", "專屬服務"] }] },
      },
      options: [
        {
          id: "private",
          label: "프라이빗 다이닝",
          price: 149000,
          benefits: ["전용 룸", "맞춤 메뉴"],
        },
        {
          id: "private-plus",
          label: "프라이빗 다이닝 플러스",
          price: 198000,
          benefits: ["와인 페어링", "전담 응대"],
        },
      ],
    },
    {
      id: "family-korean-table",
      title: "가족 한식 테이블 예약",
      subtitle: "세대형 식사 상품",
      location: "고양 한식당 · 가족모임 공간",
      dateText: "주중/주말 운영",
      imageTone: "from-yellow-100 via-stone-100 to-lime-100",
      posterLabel: "FAMILY TABLE",
      summary: "가족 방문객과 단체 모임에 적합한 한식 중심 식사 예약입니다.",
      description:
        "고양 로컬 식문화를 경험할 수 있는 한식형 테이블 상품입니다. 가족 행사와 소규모 단체 예약에 유용합니다.",
      tags: ["가족", "한식", "단체식"],
      originalPrice: 36000,
      price: 28000,
      discountLabel: "22%",
      translations: {
        en: { title: "Family Korean Table Reservation", subtitle: "Multi-generation meal", location: "Korean restaurant · Family spaces", dateText: "Weekday/Weekend", posterLabel: "FAMILY TABLE", summary: "Korean-style table reservation ideal for families and group gatherings.", tags: ["Family", "Korean", "Group Meal"], options: [{ id: "basic", label: "Basic Korean Table", benefits: ["Recommended for 4 persons"] }, { id: "premium", label: "Premium Korean Table", benefits: ["Seasonal menu included"] }] },
        ja: { title: "家族韓食テーブル予約", subtitle: "世代型食事商品", location: "高陽韓食店 · 家族集まり空間", dateText: "平日/週末運営", posterLabel: "FAMILY TABLE", summary: "家族訪問客と団体集まりに最適な韓食中心の食事予約。", tags: ["家族", "韓食", "団体食"], options: [{ id: "basic", label: "基本韓食テーブル", benefits: ["4名様推奨"] }, { id: "premium", label: "プレミアム韓食テーブル", benefits: ["季節メニュー込み"] }] },
        "zh-CN": { title: "家庭韩餐预订", subtitle: "多代聚餐产品", location: "高阳韩餐厅 · 家庭聚会空间", dateText: "平日/周末运营", posterLabel: "FAMILY TABLE", summary: "适合家庭访客和团体聚会的韩餐预订。", tags: ["家庭", "韩餐", "团餐"], options: [{ id: "basic", label: "基本韩餐桌", benefits: ["推荐4人用"] }, { id: "premium", label: "高级韩餐桌", benefits: ["含时令菜单"] }] },
        "zh-TW": { title: "家庭韓餐預訂", subtitle: "多代聚餐產品", location: "高陽韓餐廳 · 家庭聚會空間", dateText: "平日/週末運營", posterLabel: "FAMILY TABLE", summary: "適合家庭訪客和團體聚會的韓餐預訂。", tags: ["家庭", "韓餐", "團餐"], options: [{ id: "basic", label: "基本韓餐桌", benefits: ["推薦4人用"] }, { id: "premium", label: "高級韓餐桌", benefits: ["含時令菜單"] }] },
      },
      options: [
        {
          id: "basic",
          label: "기본 상차림",
          price: 28000,
          benefits: ["4인 기준 추천"],
        },
        {
          id: "premium",
          label: "프리미엄 상차림",
          price: 42000,
          benefits: ["계절 메뉴 포함"],
        },
      ],
    },
  ],
  cafe: [
    {
      id: "brunch-social-club",
      title: "브런치 소셜 클럽 예약",
      subtitle: "라이프스타일 오전 프로그램",
      location: "고양 브런치 카페 라운지",
      dateText: "오전 타임 운영",
      imageTone: "from-rose-100 via-amber-100 to-yellow-100",
      posterLabel: "BRUNCH",
      summary: "브런치와 로컬 라이프스타일 공간 경험을 함께 묶은 예약 상품입니다.",
      description:
        "모닝 브런치, 감도 있는 공간, 가벼운 네트워킹을 함께 운영할 수 있는 라이프스타일 상품입니다. 여성 그룹과 소규모 방문객에게 적합합니다.",
      tags: ["브런치", "라운지", "라이프스타일"],
      originalPrice: 32000,
      price: 24000,
      discountLabel: "25%",
      translations: {
        en: { title: "Brunch Social Club Reservation", subtitle: "Morning lifestyle program", location: "Goyang Brunch Café Lounge", dateText: "Morning hours", posterLabel: "BRUNCH", summary: "Reservation combining brunch and local lifestyle space.", tags: ["Brunch", "Lounge", "Lifestyle"], options: [{ id: "single", label: "Brunch Single Pass", benefits: ["Signature menu included"] }, { id: "couple", label: "Brunch Couple Pass", benefits: ["Dessert included"] }] },
        ja: { title: "ブランチソーシャルクラブ予約", subtitle: "ライフスタイル午前プログラム", location: "高陽ブランチカフェラウンジ", dateText: "午前タイム運営", posterLabel: "BRUNCH", summary: "ブランチとローカルライフスタイル空間体験を組み合わせた予約商品。", tags: ["ブランチ", "ラウンジ", "ライフスタイル"], options: [{ id: "single", label: "ブランチ1名チケット", benefits: ["代表メニュー込み"] }, { id: "couple", label: "ブランチ2名チケット", benefits: ["デザート込み"] }] },
        "zh-CN": { title: "早午餐社交俱乐部预订", subtitle: "生活方式早间项目", location: "高阳早午餐咖啡厅", dateText: "上午运营", posterLabel: "BRUNCH", summary: "结合早午餐和本地生活方式空间的预订产品。", tags: ["早午餐", "休闲厅", "生活方式"], options: [{ id: "single", label: "早午餐单人票", benefits: ["含招牌菜单"] }, { id: "couple", label: "早午餐双人票", benefits: ["含甜点"] }] },
        "zh-TW": { title: "早午餐社交俱樂部預訂", subtitle: "生活風格早間項目", location: "高陽早午餐咖啡廳", dateText: "上午運營", posterLabel: "BRUNCH", summary: "結合早午餐和在地生活風格空間的預訂產品。", tags: ["早午餐", "休閒廳", "生活風格"], options: [{ id: "single", label: "早午餐單人票", benefits: ["含招牌菜單"] }, { id: "couple", label: "早午餐雙人票", benefits: ["含甜點"] }] },
      },
      options: [
        {
          id: "single",
          label: "브런치 1인권",
          price: 24000,
          benefits: ["대표 메뉴 포함"],
        },
        {
          id: "couple",
          label: "브런치 2인권",
          price: 46000,
          benefits: ["디저트 포함"],
        },
      ],
    },
    {
      id: "local-cafe-hop",
      title: "고양 로컬 카페 호핑 투어",
      subtitle: "취향 기반 반일 코스",
      location: "행주산성 · 일산 로컬 카페",
      dateText: "오후 집중 운영",
      imageTone: "from-sky-100 via-cyan-100 to-indigo-100",
      posterLabel: "CAFE HOP",
      summary: "카페 예약과 이동 동선을 묶은 라이프스타일 투어형 상품입니다.",
      description:
        "고양 로컬의 개성 있는 카페들을 연결해 취향 중심 동선을 제안하는 상품입니다. 여행상품과 결합해 반일 코스로 운영하기 좋습니다.",
      tags: ["카페투어", "로컬 공간", "반일 코스"],
      originalPrice: 38000,
      price: 29000,
      discountLabel: "24%",
      translations: {
        en: { title: "Goyang Local Cafe Hopping Tour", subtitle: "Taste-based half-day course", location: "Haengju · Ilsan Local Cafés", dateText: "Afternoon focus", posterLabel: "CAFE HOP", summary: "A lifestyle tour connecting café reservations with routes.", tags: ["Café Tour", "Local Space", "Half-day"], options: [{ id: "hop-basic", label: "2-Café Course", benefits: ["2 drinks included"] }, { id: "hop-plus", label: "3-Café Course", benefits: ["Dessert included"] }] },
        ja: { title: "高陽ローカルカフェホッピングツアー", subtitle: "趣向ベース半日コース", location: "幸州山城 · 一山ローカルカフェ", dateText: "午後集中運営", posterLabel: "CAFE HOP", summary: "カフェ予約と移動動線を組み合わせたライフスタイルツアー。", tags: ["カフェツアー", "ローカル空間", "半日コース"], options: [{ id: "hop-basic", label: "カフェ2店舗コース", benefits: ["ドリンク2杯込み"] }, { id: "hop-plus", label: "カフェ3店舗コース", benefits: ["デザート込み"] }] },
        "zh-CN": { title: "高阳本地咖啡馆巡游", subtitle: "品味型半日行程", location: "幸州山城 · 一山本地咖啡馆", dateText: "下午集中运营", posterLabel: "CAFE HOP", summary: "结合咖啡馆预订与行程动线的生活方式巡游产品。", tags: ["咖啡馆游", "本地空间", "半日游"], options: [{ id: "hop-basic", label: "2家咖啡馆路线", benefits: ["含2杯饮品"] }, { id: "hop-plus", label: "3家咖啡馆路线", benefits: ["含甜点"] }] },
        "zh-TW": { title: "高陽在地咖啡館巡遊", subtitle: "品味型半日行程", location: "幸州山城 · 一山在地咖啡館", dateText: "下午集中運營", posterLabel: "CAFE HOP", summary: "結合咖啡館預訂與行程動線的生活風格巡遊產品。", tags: ["咖啡館遊", "在地空間", "半日遊"], options: [{ id: "hop-basic", label: "2家咖啡館路線", benefits: ["含2杯飲品"] }, { id: "hop-plus", label: "3家咖啡館路線", benefits: ["含甜點"] }] },
      },
      options: [
        {
          id: "hop-basic",
          label: "카페 2곳 코스",
          price: 29000,
          benefits: ["음료 2잔 포함"],
        },
        {
          id: "hop-plus",
          label: "카페 3곳 코스",
          price: 41000,
          benefits: ["디저트 포함"],
        },
      ],
    },
    {
      id: "creative-work-lounge",
      title: "크리에이티브 워크 라운지",
      subtitle: "소규모 미팅 · 창작 모임",
      location: "고양 라이프스타일 스튜디오",
      dateText: "평일/주말 시간대 선택",
      imageTone: "from-violet-100 via-fuchsia-100 to-pink-100",
      posterLabel: "WORK LOUNGE",
      summary: "작업, 대화, 미팅이 가능한 감도 높은 공간 예약 서비스입니다.",
      description:
        "브랜드 미팅, 소규모 워크숍, 창작 모임에 적합한 공간 예약 상품입니다. 음료 패키지와 간단한 케이터링 옵션을 함께 선택할 수 있습니다.",
      tags: ["공간대여", "미팅", "창작"],
      originalPrice: 54000,
      price: 42000,
      discountLabel: "22%",
      translations: {
        en: { title: "Creative Work Lounge", subtitle: "Small meetings · Creative gatherings", location: "Goyang Lifestyle Studio", dateText: "Weekday/Weekend time slots", posterLabel: "WORK LOUNGE", summary: "Space reservation for work, conversations and meetings.", tags: ["Space Rental", "Meeting", "Creative"], options: [{ id: "space-only", label: "Space Rental", benefits: ["2-hour rental"] }, { id: "space-drink", label: "Space + Drink Package", benefits: ["Welcome drink included"] }] },
        ja: { title: "クリエイティブワークラウンジ", subtitle: "小規模ミーティング·創作集まり", location: "高陽ライフスタイルスタジオ", dateText: "平日/週末時間選択", posterLabel: "WORK LOUNGE", summary: "作業·対話·ミーティングが可能な感度の高い空間予約サービス。", tags: ["空間レンタル", "ミーティング", "創作"], options: [{ id: "space-only", label: "スペース利用券", benefits: ["2時間貸し切り"] }, { id: "space-drink", label: "スペース＋ドリンクパッケージ", benefits: ["ウェルカムドリンク込み"] }] },
        "zh-CN": { title: "创意工作休息室", subtitle: "小型会议 · 创作聚会", location: "高阳生活方式工作室", dateText: "平日/周末时段可选", posterLabel: "WORK LOUNGE", summary: "可进行工作、对话和会议的高品质空间预订服务。", tags: ["空间租赁", "会议", "创作"], options: [{ id: "space-only", label: "空间租赁券", benefits: ["2小时包场"] }, { id: "space-drink", label: "空间＋饮品套餐", benefits: ["含欢迎饮品"] }] },
        "zh-TW": { title: "創意工作休息室", subtitle: "小型會議 · 創作聚會", location: "高陽生活風格工作室", dateText: "平日/週末時段可選", posterLabel: "WORK LOUNGE", summary: "可進行工作、對話和會議的高品質空間預訂服務。", tags: ["空間租賃", "會議", "創作"], options: [{ id: "space-only", label: "空間租賃券", benefits: ["2小時包場"] }, { id: "space-drink", label: "空間＋飲品套餐", benefits: ["含歡迎飲品"] }] },
      },
      options: [
        {
          id: "space-only",
          label: "공간 이용권",
          price: 42000,
          benefits: ["2시간 대관"],
        },
        {
          id: "space-drink",
          label: "공간 + 음료 패키지",
          price: 58000,
          benefits: ["웰컴 드링크 포함"],
        },
      ],
    },
    {
      id: "sunset-rooftop-cafe",
      title: "선셋 루프탑 카페 예약",
      subtitle: "야간 감성 체류형",
      location: "고양 루프탑 카페",
      dateText: "금·토 야간 운영",
      imageTone: "from-indigo-100 via-sky-100 to-cyan-200",
      posterLabel: "ROOFTOP",
      summary: "야경과 음료, 음악을 함께 즐기는 루프탑 카페 예약 상품입니다.",
      description:
        "공연 이후나 가벼운 2차 동선으로 추천하는 야간형 카페 상품입니다. 티켓 상품과 연결하기에도 좋은 구조입니다.",
      tags: ["루프탑", "야간", "감성 체류"],
      originalPrice: 36000,
      price: 28000,
      discountLabel: "22%",
      translations: {
        en: { title: "Sunset Rooftop Cafe Reservation", subtitle: "Night-vibe stay", location: "Goyang Rooftop Café", dateText: "Fri/Sat Night", posterLabel: "ROOFTOP", summary: "Rooftop cafe reservation enjoying night views, drinks and music.", tags: ["Rooftop", "Night", "Emotional Stay"], options: [{ id: "sunset", label: "Sunset Package", benefits: ["2 drinks included"] }, { id: "sunset-plus", label: "Sunset Platter", benefits: ["Brunch platter included"] }] },
        ja: { title: "サンセットルーフトップカフェ予約", subtitle: "夜間感性滞在型", location: "高陽ルーフトップカフェ", dateText: "金·土夜間運営", posterLabel: "ROOFTOP", summary: "夜景·ドリンク·音楽を楽しむルーフトップカフェ予約商品。", tags: ["ルーフトップ", "夜間", "感性滞在"], options: [{ id: "sunset", label: "サンセットパッケージ", benefits: ["ドリンク2杯込み"] }, { id: "sunset-plus", label: "サンセットプラッター", benefits: ["ブランチプラッター込み"] }] },
        "zh-CN": { title: "日落屋顶咖啡馆预订", subtitle: "夜间感性滞留型", location: "高阳屋顶咖啡馆", dateText: "周五·六夜间运营", posterLabel: "ROOFTOP", summary: "一边欣赏夜景、享受饮品与音乐的屋顶咖啡馆预订产品。", tags: ["屋顶", "夜间", "感性滞留"], options: [{ id: "sunset", label: "日落套餐", benefits: ["含2杯饮品"] }, { id: "sunset-plus", label: "日落拼盘", benefits: ["含早午餐拼盘"] }] },
        "zh-TW": { title: "日落屋頂咖啡館預訂", subtitle: "夜間感性滯留型", location: "高陽屋頂咖啡館", dateText: "週五·六夜間運營", posterLabel: "ROOFTOP", summary: "一邊欣賞夜景、享受飲品與音樂的屋頂咖啡館預訂產品。", tags: ["屋頂", "夜間", "感性滯留"], options: [{ id: "sunset", label: "日落套餐", benefits: ["含2杯飲品"] }, { id: "sunset-plus", label: "日落拼盤", benefits: ["含早午餐拼盤"] }] },
      },
      options: [
        {
          id: "sunset",
          label: "선셋 패키지",
          price: 28000,
          benefits: ["음료 2잔 포함"],
        },
        {
          id: "sunset-plus",
          label: "선셋 플래터",
          price: 42000,
          benefits: ["브런치 플래터 포함"],
        },
      ],
    },
  ],
  airport: [
    {
      id: "airport-incheon-standard",
      title: "인천공항 픽업·샌딩 예약",
      subtitle: "공항 이동 서비스",
      location: "인천국제공항 1·2터미널",
      dateText: "365일 · 24시간 운영",
      imageTone: "from-slate-800 via-slate-700 to-sky-900",
      posterLabel: "AIRPORT",
      summary: "인천공항에서 고양 주요 숙소·행사장까지 안전하고 편리한 이동 서비스입니다.",
      description:
        "공식 차량으로 운영되는 공항 픽업 및 샌딩 서비스입니다. 인천공항 1·2터미널에서 고양시 주요 지점까지 직통으로 이동합니다. 단체·VIP 모두 대응 가능합니다.",
      tags: ["인천공항", "픽업", "VIP 이동"],
      price: 0,
      translations: {
        en: { title: "Incheon Airport Pickup & Sendoff", subtitle: "Airport transfer service", location: "Incheon Int'l Airport T1·T2", dateText: "365 days · 24h", posterLabel: "AIRPORT", summary: "Safe and convenient transfer from Incheon Airport to Goyang venues.", tags: ["Incheon Airport", "Pickup", "VIP Transfer"], options: [{ id: "sedan", label: "Sedan (1-3 persons)", benefits: ["Dedicated driver", "24/7 service"] }, { id: "van", label: "Van (4-7 persons)", benefits: ["Large trunk", "Group available"] }, { id: "vip-van", label: "VIP Limousine (1-4 persons)", benefits: ["VIP protocol", "Welcome board"] }] },
        ja: { title: "仁川空港ピックアップ・送迎", subtitle: "空港送迎サービス", location: "仁川国際空港 第1·2ターミナル", dateText: "365日 · 24時間", posterLabel: "AIRPORT", summary: "仁川空港から高陽の主要施設まで安全・快適な移動サービス。", tags: ["仁川空港", "ピックアップ", "VIP送迎"], options: [{ id: "sedan", label: "セダン（1〜3名）", benefits: ["専任ドライバー", "24時間対応"] }, { id: "van", label: "バン（4〜7名）", benefits: ["大型トランク", "団体対応"] }, { id: "vip-van", label: "VIPリムジン（1〜4名）", benefits: ["VIP送迎", "ウェルカムボード"] }] },
        "zh-CN": { title: "仁川机场接送预约", subtitle: "机场接送服务", location: "仁川国际机场 T1·T2", dateText: "全年·24小时", posterLabel: "AIRPORT", summary: "从仁川机场到高阳市主要地点的安全便捷接送服务。", tags: ["仁川机场", "接送", "VIP接送"], options: [{ id: "sedan", label: "轿车（1-3人）", benefits: ["专属司机", "24小时服务"] }, { id: "van", label: "商务车（4-7人）", benefits: ["大型行李箱", "可接团体"] }, { id: "vip-van", label: "VIP豪华车（1-4人）", benefits: ["VIP礼宾", "欢迎牌"] }] },
        "zh-TW": { title: "仁川機場接送預約", subtitle: "機場接送服務", location: "仁川國際機場 T1·T2", dateText: "全年·24小時", posterLabel: "AIRPORT", summary: "從仁川機場到高陽市主要地點的安全便捷接送服務。", tags: ["仁川機場", "接送", "VIP接送"], options: [{ id: "sedan", label: "轎車（1-3人）", benefits: ["專屬司機", "24小時服務"] }, { id: "van", label: "商務車（4-7人）", benefits: ["大型行李箱", "可接團體"] }, { id: "vip-van", label: "VIP豪華車（1-4人）", benefits: ["VIP禮賓", "歡迎牌"] }] },
      },
      tabNotice: "※ 항공편 도착 후 수하물 수취 시간을 고려하여 기사가 대기합니다.\n※ 항공편 지연 시 추가 비용 없이 대기합니다.\n※ 예약 확정 후 기사 연락처가 문자로 발송됩니다.",
      tabDetails: "인천공항 픽업·샌딩 예약은 인천국제공항 1·2터미널에서 고양시 주요 지점까지 운행하는 공식 차량 이동 서비스입니다.\n\n📍 운행 구간\n- 인천공항 1터미널 ↔ 고양시 (KINTEX, 일산, 주요 호텔)\n- 인천공항 2터미널 ↔ 고양시 (KINTEX, 일산, 주요 호텔)\n\n🚗 차량 종류\n- 세단: 1~3인 소그룹, 비즈니스 이동\n- 승합: 4~7인 그룹, 대형 수하물 가능\n- VIP 리무진: 1~4인, VIP 의전 서비스\n\n💡 이런 분께 추천\n- KINTEX 전시 참가자 및 바이어\n- 해외 VIP 의전 프로그램\n- 단체 이동이 필요한 행사 참가팀",
      tabUsageInfo: "• 픽업 장소: 예약 시 선택한 터미널 입국장 출구\n• 기사가 이름/회사명 팻말을 들고 대기합니다\n• 항공편 도착 30분 전 기사 연락처 문자 발송\n• 짐 보관 및 적재 도움 제공\n• 샌딩: 출발 2시간 전 픽업 기준 운행\n• 주요 목적지: KINTEX, 일산 주요 호텔, 킨텍스 전시장\n• 야간/새벽 운행 가능 (24시간)",
      tabCancellation: "■ 취소 및 환불 규정\n\n• 이용일 3일 전 이전: 100% 환불\n• 이용일 2일 전: 50% 환불\n• 이용일 전날 ~ 당일 취소: 환불 불가\n\n■ 항공편 결항/지연\n• 항공사 사정으로 인한 결항 시 전액 환불\n• 지연 시 추가 대기 비용 없음\n\n■ 환불 처리\n• 결제 수단에 따라 3~5 영업일 소요",
      options: [
        { id: "sedan", label: "세단 (1-3인)", price: 85000, benefits: ["전용 기사", "24시간"] },
        { id: "van", label: "승합 (4-7인)", price: 120000, benefits: ["대형 트렁크", "단체 가능"] },
        { id: "vip-van", label: "VIP 리무진 (1-4인)", price: 180000, benefits: ["VIP 의전", "웰컴 보드"] },
      ],
    },
    {
      id: "airport-gimpo-standard",
      title: "김포공항 픽업·샌딩 예약",
      subtitle: "공항 이동 서비스",
      location: "김포국제공항",
      dateText: "365일 · 06:00-24:00 운영",
      imageTone: "from-sky-800 via-sky-600 to-cyan-400",
      posterLabel: "GIMPO",
      summary: "김포공항에서 고양 주요 지점까지 빠르고 편리한 이동 서비스입니다.",
      description:
        "김포공항에서 고양시 주요 숙소·행사장까지 운행하는 공항 픽업 서비스입니다. 운항 일정에 맞춰 유연하게 예약할 수 있습니다.",
      tags: ["김포공항", "픽업", "단거리"],
      price: 0,
      translations: {
        en: { title: "Gimpo Airport Pickup & Sendoff", subtitle: "Airport transfer service", location: "Gimpo International Airport", dateText: "365 days · 06:00-24:00", posterLabel: "GIMPO", summary: "Fast and convenient transfer from Gimpo Airport to Goyang.", tags: ["Gimpo Airport", "Pickup", "Short-haul"], options: [{ id: "sedan", label: "Sedan (1-3 persons)", benefits: ["Dedicated driver", "Direct route"] }, { id: "van", label: "Van (4-7 persons)", benefits: ["Group available"] }] },
        ja: { title: "金浦空港ピックアップ・送迎", subtitle: "空港送迎サービス", location: "金浦国際空港", dateText: "365日 · 06:00-24:00", posterLabel: "GIMPO", summary: "金浦空港から高陽市の主要施設まで快適な送迎サービス。", tags: ["金浦空港", "ピックアップ", "近距離"], options: [{ id: "sedan", label: "セダン（1〜3名）", benefits: ["専任ドライバー", "直通"] }, { id: "van", label: "バン（4〜7名）", benefits: ["団体対応"] }] },
        "zh-CN": { title: "金浦机场接送预约", subtitle: "机场接送服务", location: "金浦国际机场", dateText: "全年·06:00-24:00", posterLabel: "GIMPO", summary: "从金浦机场到高阳市主要地点的快速便捷接送服务。", tags: ["金浦机场", "接送", "短途"], options: [{ id: "sedan", label: "轿车（1-3人）", benefits: ["专属司机", "直达"] }, { id: "van", label: "商务车（4-7人）", benefits: ["可接团体"] }] },
        "zh-TW": { title: "金浦機場接送預約", subtitle: "機場接送服務", location: "金浦國際機場", dateText: "全年·06:00-24:00", posterLabel: "GIMPO", summary: "從金浦機場到高陽市主要地點的快速便捷接送服務。", tags: ["金浦機場", "接送", "短途"], options: [{ id: "sedan", label: "轎車（1-3人）", benefits: ["專屬司機", "直達"] }, { id: "van", label: "商務車（4-7人）", benefits: ["可接團體"] }] },
      },
      tabNotice: "※ 항공편 도착 후 수하물 수취 시간을 고려하여 기사가 대기합니다.\n※ 운항 지연 시 추가 비용 없이 대기합니다.\n※ 예약 확정 후 기사 연락처가 문자로 발송됩니다.",
      tabDetails: "김포공항 픽업·샌딩 예약은 김포국제공항에서 고양시 주요 지점까지 빠르고 편리하게 운행하는 이동 서비스입니다.\n\n📍 운행 구간\n- 김포공항 ↔ 고양시 (KINTEX, 일산, 주요 호텔)\n- 인천공항 대비 이동 시간 단축 (약 30분)\n\n🚗 차량 종류\n- 세단: 1~3인 소그룹, 직통 이동\n- 승합: 4~7인 그룹, 단체 수하물 가능\n\n💡 이런 분께 추천\n- 국내선/일본·중국 노선 이용객\n- KINTEX 전시 참가자\n- 짧고 빠른 이동이 필요한 방문객",
      tabUsageInfo: "• 픽업 장소: 김포공항 국내선/국제선 도착 출구\n• 기사가 이름/회사명 팻말을 들고 대기합니다\n• 항공편 도착 30분 전 기사 연락처 문자 발송\n• 운행 시간: 06:00 ~ 24:00 (심야 예외 문의)\n• 짐 적재 도움 제공\n• 주요 목적지: KINTEX, 일산 주요 호텔",
      tabCancellation: "■ 취소 및 환불 규정\n\n• 이용일 3일 전 이전: 100% 환불\n• 이용일 2일 전: 50% 환불\n• 이용일 전날 ~ 당일 취소: 환불 불가\n\n■ 항공편 결항/지연\n• 항공사 사정으로 인한 결항 시 전액 환불\n• 지연 시 추가 대기 비용 없음\n\n■ 환불 처리\n• 결제 수단에 따라 3~5 영업일 소요",
      options: [
        { id: "sedan", label: "세단 (1-3인)", price: 55000, benefits: ["전용 기사", "직통"] },
        { id: "van", label: "승합 (4-7인)", price: 75000, benefits: ["단체 가능"] },
      ],
    },
  ],
};

export function getServiceCatalogByCategory(category: ServiceCatalogCategory) {
  return serviceCatalog[category];
}

export function getServiceCatalogItem(
  category: ServiceCatalogCategory,
  itemId?: string
) {
  const items = getServiceCatalogByCategory(category);
  if (!itemId) return items[0];
  return items.find((item) => item.id === itemId) ?? items[0];
}
