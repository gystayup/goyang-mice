import type { AirportTransferFilterId, AirportTransferMode, AirportTransferRouteId } from "@/data/airport-transfer";

import { pick, type LocalizedText, type PageLocale } from "./types";

type AirportRouteCopy = {
  airportName: LocalizedText;
  label: LocalizedText;
  title: LocalizedText;
  desc: LocalizedText;
  fromLabel: LocalizedText;
  toLabel: LocalizedText;
  terminalInfo: LocalizedText;
  heroNote: LocalizedText;
};

type AirportVehicleCopy = {
  name: LocalizedText;
  desc: LocalizedText;
  badges: LocalizedText[];
  etaNote: LocalizedText;
};

const routeCopy: Record<AirportTransferRouteId, AirportRouteCopy> = {
  "icn-pickup": {
    airportName: { ko: "인천국제공항", en: "Incheon International Airport", ja: "仁川国際空港", "zh-CN": "仁川国际机场", "zh-TW": "仁川國際機場" },
    label: { ko: "인천공항 픽업", en: "Incheon Airport Pickup", ja: "仁川空港ピックアップ", "zh-CN": "仁川机场接机", "zh-TW": "仁川機場接機" },
    title: { ko: "인천공항에서 고양까지 바로 연결되는 픽업", en: "Pickup from Incheon Airport to Goyang", ja: "仁川空港から高陽まで直接つながるピックアップ", "zh-CN": "仁川机场至高阳直达接机服务", "zh-TW": "仁川機場至高陽直達接機服務" },
    desc: { ko: "입국 후 호텔, 공연장, KINTEX까지 바로 이동할 수 있는 대표 픽업 노선입니다.", en: "A flagship pickup route directly connecting airport arrivals with hotels, venues, and KINTEX.", ja: "入国後すぐにホテル、公演場、KINTEXまで移動できる主力ピックアップルートです。", "zh-CN": "入境后可直达酒店、演出场馆与KINTEX的主力接机路线。", "zh-TW": "入境後可直達飯店、演出場館與KINTEX的主力接機路線。" },
    fromLabel: { ko: "인천국제공항 제1 · 제2터미널", en: "Incheon Airport Terminal 1 · 2", ja: "仁川国際空港 第1・第2ターミナル", "zh-CN": "仁川国际机场 T1·T2航站楼", "zh-TW": "仁川國際機場 第1·第2航廈" },
    toLabel: { ko: "고양 주요 호텔 · KINTEX · 공연장", en: "Goyang Hotels · KINTEX · Venues", ja: "高陽主要ホテル・KINTEX・公演場", "zh-CN": "高阳主要酒店·KINTEX·演出场馆", "zh-TW": "高陽主要飯店·KINTEX·演出場館" },
    terminalInfo: { ko: "입국장 기준 90분 무료 대기", en: "90 min free waiting from arrival", ja: "入国ゲートより90分無料待機", "zh-CN": "入境大厅起90分钟免费等候", "zh-TW": "入境大廳起90分鐘免費等候" },
    heroNote: { ko: "공연 관람객, 바이어, VIP, 단체 방문객 이동에 최적화", en: "Optimized for visitors, buyers, VIP guests, and group travel", ja: "公演観覧者、バイヤー、VIP、団体訪問客の移動に最適", "zh-CN": "专为演出观众、买家、VIP及团体访客优化", "zh-TW": "專為演出觀眾、買家、VIP及團體訪客優化" },
  },
  "icn-sending": {
    airportName: { ko: "인천국제공항", en: "Incheon International Airport", ja: "仁川国際空港", "zh-CN": "仁川国际机场", "zh-TW": "仁川國際機場" },
    label: { ko: "인천공항 샌딩", en: "Incheon Airport Sending", ja: "仁川空港センディング", "zh-CN": "仁川机场送机", "zh-TW": "仁川機場送機" },
    title: { ko: "고양에서 인천공항으로 이동하는 샌딩", en: "Sending from Goyang to Incheon Airport", ja: "高陽から仁川空港へのセンディング", "zh-CN": "高阳至仁川机场送机服务", "zh-TW": "高陽至仁川機場送機服務" },
    desc: { ko: "호텔 체크아웃부터 공항 도착까지 행사 일정과 연동해 안전하게 이동합니다.", en: "A safe transfer route aligned to hotel checkout and event schedules.", ja: "ホテルチェックアウトから空港到着まで、イベント日程に合わせて安全に移動します。", "zh-CN": "从酒店退房到抵达机场，与活动日程联动，安全出行。", "zh-TW": "從飯店退房到抵達機場，與活動日程聯動，安全出行。" },
    fromLabel: { ko: "고양 주요 호텔 · KINTEX · 공연장", en: "Goyang Hotels · KINTEX · Venues", ja: "高陽主要ホテル・KINTEX・公演場", "zh-CN": "高阳主要酒店·KINTEX·演出场馆", "zh-TW": "高陽主要飯店·KINTEX·演出場館" },
    toLabel: { ko: "인천국제공항 제1 · 제2터미널", en: "Incheon Airport Terminal 1 · 2", ja: "仁川国際空港 第1・第2ターミナル", "zh-CN": "仁川国际机场 T1·T2航站楼", "zh-TW": "仁川國際機場 第1·第2航廈" },
    terminalInfo: { ko: "출국 3시간 전 도착 권장", en: "Recommended arrival 3 hours before departure", ja: "出国3時間前到着を推奨", "zh-CN": "建议出发前3小时抵达机场", "zh-TW": "建議出發前3小時抵達機場" },
    heroNote: { ko: "단체 출국, VIP 출국, 전시 종료 후 샌딩에 적합", en: "Ideal for group departures, VIP transfers, and post-exhibition sending", ja: "団体出国、VIP出国、展示終了後のセンディングに最適", "zh-CN": "适合团体出境、VIP接送及展览结束后的送机服务", "zh-TW": "適合團體出境、VIP接送及展覽結束後的送機服務" },
  },
  "gmp-pickup": {
    airportName: { ko: "김포국제공항", en: "Gimpo International Airport", ja: "金浦国際空港", "zh-CN": "金浦国际机场", "zh-TW": "金浦國際機場" },
    label: { ko: "김포공항 픽업", en: "Gimpo Airport Pickup", ja: "金浦空港ピックアップ", "zh-CN": "金浦机场接机", "zh-TW": "金浦機場接機" },
    title: { ko: "김포공항에서 고양까지 빠르게 이동하는 픽업", en: "Fast pickup from Gimpo Airport to Goyang", ja: "金浦空港から高陽まで素早く移動するピックアップ", "zh-CN": "金浦机场至高阳快速接机服务", "zh-TW": "金浦機場至高陽快速接機服務" },
    desc: { ko: "국내선과 국제선 입국 고객을 고양 주요 거점으로 빠르게 연결합니다.", en: "A fast link from Gimpo Airport arrivals to major destinations in Goyang.", ja: "国内線・国際線の入国客を高陽の主要拠点へ素早くつなぎます。", "zh-CN": "将国内线与国际线到达旅客快速连接至高阳主要目的地。", "zh-TW": "將國內線與國際線到達旅客快速連結至高陽主要目的地。" },
    fromLabel: { ko: "김포국제공항 국내선 · 국제선", en: "Gimpo Domestic · International Terminal", ja: "金浦国際空港 国内線・国際線", "zh-CN": "金浦国际机场 国内·国际航站楼", "zh-TW": "金浦國際機場 國內·國際航廈" },
    toLabel: { ko: "고양 주요 호텔 · 스튜디오 · 행사장", en: "Goyang Hotels · Studios · Event Venues", ja: "高陽主要ホテル・スタジオ・イベント会場", "zh-CN": "高阳主要酒店·摄影棚·活动场馆", "zh-TW": "高陽主要飯店·攝影棚·活動場館" },
    terminalInfo: { ko: "입국장 기준 60분 무료 대기", en: "60 min free waiting from arrival", ja: "入国ゲートより60分無料待機", "zh-CN": "入境大厅起60分钟免费等候", "zh-TW": "入境大廳起60分鐘免費等候" },
    heroNote: { ko: "K-POP 행사, 방송 스튜디오 이동과 연계하기 적합", en: "Great for K-POP schedules and broadcast studio transfers", ja: "K-POPイベント・放送スタジオ移動との連携に最適", "zh-CN": "适合K-POP活动及广播摄影棚接送", "zh-TW": "適合K-POP活動及廣播攝影棚接送" },
  },
  "gmp-sending": {
    airportName: { ko: "김포국제공항", en: "Gimpo International Airport", ja: "金浦国際空港", "zh-CN": "金浦国际机场", "zh-TW": "金浦國際機場" },
    label: { ko: "김포공항 샌딩", en: "Gimpo Airport Sending", ja: "金浦空港センディング", "zh-CN": "金浦机场送机", "zh-TW": "金浦機場送機" },
    title: { ko: "고양에서 김포공항으로 이동하는 샌딩", en: "Sending from Goyang to Gimpo Airport", ja: "高陽から金浦空港へのセンディング", "zh-CN": "高阳至金浦机场送机服务", "zh-TW": "高陽至金浦機場送機服務" },
    desc: { ko: "개인, 가족, 단체 모두를 위한 공항 출발 이동 서비스입니다.", en: "An airport departure service for individual, family, and group visitors.", ja: "個人、家族、団体すべてのための空港出発移動サービスです。", "zh-CN": "适合个人、家庭与团体的机场出发接送服务。", "zh-TW": "適合個人、家庭與團體的機場出發接送服務。" },
    fromLabel: { ko: "고양 주요 호텔 · 스튜디오 · 행사장", en: "Goyang Hotels · Studios · Event Venues", ja: "高陽主要ホテル・スタジオ・イベント会場", "zh-CN": "高阳主要酒店·摄影棚·活动场馆", "zh-TW": "高陽主要飯店·攝影棚·活動場館" },
    toLabel: { ko: "김포국제공항 국내선 · 국제선", en: "Gimpo Domestic · International Terminal", ja: "金浦国際空港 国内線・国際線", "zh-CN": "金浦国际机场 国内·国际航站楼", "zh-TW": "金浦國際機場 國內·國際航廈" },
    terminalInfo: { ko: "국내선 2시간, 국제선 3시간 전 도착 권장", en: "Recommended 2h domestic / 3h international", ja: "国内線2時間前、国際線3時間前到着を推奨", "zh-CN": "建议国内线提前2小时、国际线提前3小时抵达", "zh-TW": "建議國內線提前2小時、國際線提前3小時抵達" },
    heroNote: { ko: "가족여행객과 공연 스태프, VIP 이동에 적합", en: "Suitable for family visitors, performance staff, and VIP guests", ja: "家族旅行者や公演スタッフ、VIPの移動に適しています", "zh-CN": "适合家庭旅客、演出工作人员及VIP接送", "zh-TW": "適合家庭旅客、演出工作人員及VIP接送" },
  },
};

const vehicleCopy: Record<string, AirportVehicleCopy> = {
  "icn-pickup-economy": { name: { ko: "이코노미 세단 3인", en: "Economy Sedan for 3", ja: "エコノミーセダン 3名", "zh-CN": "经济型轿车 3人", "zh-TW": "經濟型轎車 3人" }, desc: { ko: "Hyundai Sonata / Kia K5 동급", en: "Hyundai Sonata / Kia K5 class", ja: "現代ソナタ / 起亜K5 同級", "zh-CN": "现代索纳塔 / 起亚K5同级", "zh-TW": "現代索納塔 / 起亞K5同級" }, badges: [{ ko: "즉시 확정", en: "Instant Confirm", ja: "即時確定", "zh-CN": "即时确认", "zh-TW": "即時確認" }, { ko: "무료 대기", en: "Free Waiting", ja: "無料待機", "zh-CN": "免费等候", "zh-TW": "免費等候" }], etaNote: { ko: "평균 소요 65분", en: "Approx. 65 min", ja: "平均所要65分", "zh-CN": "平均用时约65分钟", "zh-TW": "平均用時約65分鐘" } },
  "icn-pickup-suv": { name: { ko: "프리미엄 SUV 5인", en: "Premium SUV for 5", ja: "プレミアムSUV 5名", "zh-CN": "豪华SUV 5人", "zh-TW": "豪華SUV 5人" }, desc: { ko: "Carnival Hi-Limousine / SUV 동급", en: "Carnival Hi-Limousine / SUV class", ja: "カーニバルハイリムジン / SUV同級", "zh-CN": "嘉华豪华版 / SUV同级", "zh-TW": "嘉華豪華版 / SUV同級" }, badges: [{ ko: "영문 지원", en: "English Support", ja: "英語対応", "zh-CN": "英语服务", "zh-TW": "英語服務" }, { ko: "VIP 추천", en: "VIP Pick", ja: "VIPおすすめ", "zh-CN": "VIP推荐", "zh-TW": "VIP推薦" }], etaNote: { ko: "평균 소요 65분", en: "Approx. 65 min", ja: "平均所要65分", "zh-CN": "平均用时约65分钟", "zh-TW": "平均用時約65分鐘" } },
  "icn-pickup-van": { name: { ko: "그룹 밴 9인", en: "Group Van for 9", ja: "グループバン 9名", "zh-CN": "团体客货车 9人", "zh-TW": "團體廂型車 9人" }, desc: { ko: "Solati / 대형 밴 동급", en: "Solati / Large Van class", ja: "ソラティ / 大型バン同級", "zh-CN": "索拉提 / 大型面包车同级", "zh-TW": "索拉提 / 大型廂型車同級" }, badges: [{ ko: "단체 이동", en: "Group Transfer", ja: "団体移動", "zh-CN": "团体接送", "zh-TW": "團體接送" }, { ko: "수하물 대응", en: "Luggage Ready", ja: "手荷物対応", "zh-CN": "大件行李", "zh-TW": "大件行李" }], etaNote: { ko: "평균 소요 70분", en: "Approx. 70 min", ja: "平均所要70分", "zh-CN": "平均用时约70分钟", "zh-TW": "平均用時約70分鐘" } },
  "icn-sending-economy": { name: { ko: "샌딩 세단 3인", en: "Sending Sedan for 3", ja: "センディングセダン 3名", "zh-CN": "送机轿车 3人", "zh-TW": "送機轎車 3人" }, desc: { ko: "Hyundai Sonata / Kia K5 동급", en: "Hyundai Sonata / Kia K5 class", ja: "現代ソナタ / 起亜K5 同級", "zh-CN": "现代索纳塔 / 起亚K5同级", "zh-TW": "現代索納塔 / 起亞K5同級" }, badges: [{ ko: "즉시 확정", en: "Instant Confirm", ja: "即時確定", "zh-CN": "即时确认", "zh-TW": "即時確認" }, { ko: "야간 가능", en: "Night Available", ja: "夜間対応可", "zh-CN": "夜间可用", "zh-TW": "夜間可用" }], etaNote: { ko: "호텔 출발 기준 65분", en: "Approx. 65 min from hotel", ja: "ホテル出発より約65分", "zh-CN": "从酒店出发约65分钟", "zh-TW": "從飯店出發約65分鐘" } },
  "icn-sending-suv": { name: { ko: "샌딩 프리미엄 SUV 5인", en: "Premium Sending SUV for 5", ja: "センディングプレミアムSUV 5名", "zh-CN": "豪华送机SUV 5人", "zh-TW": "豪華送機SUV 5人" }, desc: { ko: "Carnival Hi-Limousine / SUV 동급", en: "Carnival Hi-Limousine / SUV class", ja: "カーニバルハイリムジン / SUV同級", "zh-CN": "嘉华豪华版 / SUV同级", "zh-TW": "嘉華豪華版 / SUV同級" }, badges: [{ ko: "VIP 추천", en: "VIP Pick", ja: "VIPおすすめ", "zh-CN": "VIP推荐", "zh-TW": "VIP推薦" }, { ko: "영문 지원", en: "English Support", ja: "英語対応", "zh-CN": "英语服务", "zh-TW": "英語服務" }], etaNote: { ko: "호텔 출발 기준 65분", en: "Approx. 65 min from hotel", ja: "ホテル出発より約65分", "zh-CN": "从酒店出发约65分钟", "zh-TW": "從飯店出發約65分鐘" } },
  "gmp-pickup-economy": { name: { ko: "시티 세단 3인", en: "City Sedan for 3", ja: "シティセダン 3名", "zh-CN": "城市轿车 3人", "zh-TW": "城市轎車 3人" }, desc: { ko: "Hyundai Avante / Kia K3 동급", en: "Hyundai Avante / Kia K3 class", ja: "現代アバンテ / 起亜K3 同級", "zh-CN": "现代悦动 / 起亚K3同级", "zh-TW": "現代悅動 / 起亞K3同級" }, badges: [{ ko: "빠른 배차", en: "Fast Dispatch", ja: "素早い配車", "zh-CN": "快速派车", "zh-TW": "快速派車" }, { ko: "무료 대기", en: "Free Waiting", ja: "無料待機", "zh-CN": "免费等候", "zh-TW": "免費等候" }], etaNote: { ko: "평균 소요 35분", en: "Approx. 35 min", ja: "平均所要35分", "zh-CN": "平均用时约35分钟", "zh-TW": "平均用時約35分鐘" } },
  "gmp-pickup-van": { name: { ko: "그룹 밴 7인", en: "Group Van for 7", ja: "グループバン 7名", "zh-CN": "团体客货车 7人", "zh-TW": "團體廂型車 7人" }, desc: { ko: "Carnival / 대형 밴 동급", en: "Carnival / Large Van class", ja: "カーニバル / 大型バン同級", "zh-CN": "嘉华 / 大型面包车同级", "zh-TW": "嘉華 / 大型廂型車同級" }, badges: [{ ko: "단체 이동", en: "Group Transfer", ja: "団体移動", "zh-CN": "团体接送", "zh-TW": "團體接送" }, { ko: "행사 일정 대응", en: "Event Ready", ja: "イベント日程対応", "zh-CN": "活动日程保障", "zh-TW": "活動日程保障" }], etaNote: { ko: "평균 소요 40분", en: "Approx. 40 min", ja: "平均所要40分", "zh-CN": "平均用时约40分钟", "zh-TW": "平均用時約40分鐘" } },
  "gmp-sending-economy": { name: { ko: "시티 샌딩 세단 3인", en: "City Sending Sedan for 3", ja: "シティセンディングセダン 3名", "zh-CN": "城市送机轿车 3人", "zh-TW": "城市送機轎車 3人" }, desc: { ko: "Hyundai Avante / Kia K3 동급", en: "Hyundai Avante / Kia K3 class", ja: "現代アバンテ / 起亜K3 同級", "zh-CN": "现代悦动 / 起亚K3同级", "zh-TW": "現代悅動 / 起亞K3同級" }, badges: [{ ko: "빠른 출발", en: "Fast Departure", ja: "素早い出発", "zh-CN": "快速出发", "zh-TW": "快速出發" }, { ko: "국내선 추천", en: "Good for Domestic", ja: "国内線おすすめ", "zh-CN": "适合国内线", "zh-TW": "適合國內線" }], etaNote: { ko: "평균 소요 35분", en: "Approx. 35 min", ja: "平均所要35分", "zh-CN": "平均用时约35分钟", "zh-TW": "平均用時約35分鐘" } },
  "gmp-sending-suv": { name: { ko: "프리미엄 샌딩 SUV 5인", en: "Premium Sending SUV for 5", ja: "プレミアムセンディングSUV 5名", "zh-CN": "豪华送机SUV 5人", "zh-TW": "豪華送機SUV 5人" }, desc: { ko: "Carnival Hi-Limousine / SUV 동급", en: "Carnival Hi-Limousine / SUV class", ja: "カーニバルハイリムジン / SUV同級", "zh-CN": "嘉华豪华版 / SUV同级", "zh-TW": "嘉華豪華版 / SUV同級" }, badges: [{ ko: "VIP 추천", en: "VIP Pick", ja: "VIPおすすめ", "zh-CN": "VIP推荐", "zh-TW": "VIP推薦" }, { ko: "K-POP 일정 대응", en: "K-POP Ready", ja: "K-POP日程対応", "zh-CN": "K-POP日程保障", "zh-TW": "K-POP日程保障" }], etaNote: { ko: "평균 소요 40분", en: "Approx. 40 min", ja: "平均所要40分", "zh-CN": "平均用时约40分钟", "zh-TW": "平均用時約40分鐘" } },
};

const filterCopy: Record<AirportTransferFilterId, LocalizedText> = {
  "meet-greet": { ko: "미팅보드 서비스", en: "Meet & Greet", ja: "ミーティングボードサービス", "zh-CN": "接机牌服务", "zh-TW": "接機牌服務" },
  "english-driver": { ko: "영어 가능 기사", en: "English-speaking Driver", ja: "英語対応ドライバー", "zh-CN": "英语司机", "zh-TW": "英語司機" },
  wheelchair: { ko: "휠체어 수용 가능", en: "Wheelchair Friendly", ja: "車椅子対応", "zh-CN": "轮椅无障碍", "zh-TW": "輪椅無障礙" },
  wifi: { ko: "차량 내 Wi-Fi", en: "In-car Wi-Fi", ja: "車内Wi-Fi", "zh-CN": "车内Wi-Fi", "zh-TW": "車內Wi-Fi" },
  charger: { ko: "충전기 제공", en: "Device Charger", ja: "充電器提供", "zh-CN": "提供充电器", "zh-TW": "提供充電器" },
  "pet-friendly": { ko: "반려동물 탑승 가능", en: "Pet Friendly", ja: "ペット同乗可", "zh-CN": "允许携带宠物", "zh-TW": "允許攜帶寵物" },
  water: { ko: "생수 제공", en: "Water Included", ja: "ミネラルウォーター提供", "zh-CN": "提供矿泉水", "zh-TW": "提供礦泉水" },
  multilingual: { ko: "다국어 기사 지원", en: "Multilingual Driver", ja: "多言語ドライバー対応", "zh-CN": "多语言司机", "zh-TW": "多語言司機" },
};

const modeCopy: Record<AirportTransferMode, LocalizedText> = {
  pickup: { ko: "공항 픽업", en: "Airport Pickup", ja: "空港ピックアップ", "zh-CN": "机场接机", "zh-TW": "機場接機" },
  sending: { ko: "공항 샌딩", en: "Airport Sending", ja: "空港センディング", "zh-CN": "机场送机", "zh-TW": "機場送機" },
};

export function getAirportRouteCopy(locale: PageLocale, routeId: AirportTransferRouteId) {
  const route = routeCopy[routeId];
  return {
    airportName: pick(locale, route.airportName),
    label: pick(locale, route.label),
    title: pick(locale, route.title),
    desc: pick(locale, route.desc),
    fromLabel: pick(locale, route.fromLabel),
    toLabel: pick(locale, route.toLabel),
    terminalInfo: pick(locale, route.terminalInfo),
    heroNote: pick(locale, route.heroNote),
  };
}

export function getAirportVehicleCopy(locale: PageLocale, vehicleId: string) {
  const vehicle = vehicleCopy[vehicleId];
  if (!vehicle) return null;
  return {
    name: pick(locale, vehicle.name),
    desc: pick(locale, vehicle.desc),
    badges: vehicle.badges.map((badge) => pick(locale, badge)),
    etaNote: pick(locale, vehicle.etaNote),
  };
}

export function getAirportFilterLabel(locale: PageLocale, filterId: AirportTransferFilterId) {
  return pick(locale, filterCopy[filterId]);
}

export function getAirportModeLabel(locale: PageLocale, mode: AirportTransferMode) {
  return pick(locale, modeCopy[mode]);
}
