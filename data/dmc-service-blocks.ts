// data/dmc-service-blocks.ts — 오더 #C49.
//
// /dmc 인덱스에서 /institute 로 이관된 4블록 (pillars · useCases · steps · partners) 데이터.
// 5로케일 ko 폴백 · 문안·구조 이관 시점 그대로.
//   · pillars      — 핵심 서비스 3가지
//   · useCases     — 방문객 유형 추천 4가지
//   · steps        — 안내 진행 절차 4단계
//   · partners     — 사업자 제휴 CTA
//
// 소비처: app/institute/_page.tsx (오더 #C49 [1] · 4블록 렌더).

export type DmcBlocksLocale = "ko" | "en" | "ja" | "zh-CN" | "zh-TW";

export type DmcServiceBlocks = {
  pillars: {
    eyebrow: string;
    title: string;
    items: Array<{ title: string; description: string }>;
  };
  useCases: {
    eyebrow: string;
    title: string;
    items: Array<{ title: string; description: string }>;
  };
  steps: {
    eyebrow: string;
    title: string;
    items: Array<{ step: string; title: string; description: string }>;
    ctas: { booking: string; consult: string };
  };
  partners: {
    eyebrow: string;
    title: string;
    description: string;
    button: string;
  };
};

const ko: DmcServiceBlocks = {
  pillars: {
    eyebrow: "핵심 서비스",
    title: "고양 MICE 안내의 3가지 핵심 서비스",
    items: [
      { title: "기획 서비스", description: "공연·전시·MICE 방문·숙박을 연결하는 일정과 프로그램을 기획합니다." },
      { title: "운영 서비스", description: "안내, 스케줄, 현장 응대, 이동 동선과 파트너 운영을 통합 관리합니다." },
      { title: "로컬 연결 서비스", description: "호텔, 음식점, 카페, 티켓, 공항 접근 등 고양의 파트너를 하나의 구조로 연결합니다." },
    ],
  },
  useCases: {
    eyebrow: "추천 대상",
    title: "이런 방문객에게 추천합니다",
    items: [
      { title: "공연 방문객", description: "티켓·숙박·공항 접근을 함께 안내해 더 부드러운 공연 방문 흐름을 만들 수 있습니다." },
      { title: "가족 방문객", description: "지역 프로그램·음식점·카페 안내를 연결해 가족 중심의 체류 경험을 만들 수 있습니다." },
      { title: "기업 / 단체 고객", description: "숙박·식사·이동·티켓·현장 운영 지원을 묶어 효율적인 단체 운영이 가능합니다." },
      { title: "해외 방문객", description: "공항 접근·호텔·도심 탐방·다이닝 안내를 한 흐름으로 연결할 수 있습니다." },
    ],
  },
  steps: {
    eyebrow: "이용 방법",
    title: "안내는 이렇게 진행됩니다",
    items: [
      { step: "1", title: "카테고리 선택", description: "원하는 서비스 카테고리를 먼저 선택합니다." },
      { step: "2", title: "서비스 옵션 확인", description: "일정, 인원, 옵션, 운영 조건을 확인합니다." },
      { step: "3", title: "안내 접수", description: "안내 또는 문의 정보를 입력하고 요청을 보냅니다." },
      { step: "4", title: "운영 확정", description: "일정과 세부 운영 조건을 조율해 최종 확정합니다." },
    ],
    ctas: { booking: "당일코스 보기", consult: "상담 문의하기" },
  },
  partners: {
    eyebrow: "파트너 네트워크",
    title: "고양의 사업자와 함께합니다",
    description: "고양 MICE 안내는 숙박·다이닝·교통·공연장·전시장·로컬 공간·MICE 연계 거점을 연결하여 방문자의 이동과 체류, 지역 경험이 자연스럽게 이어지도록 설계합니다.",
    button: "제휴 문의하기",
  },
};

const en: DmcServiceBlocks = {
  pillars: {
    eyebrow: "Core Services",
    title: "The 3 core services of Goyang MICE Guide",
    items: [
      { title: "Planning Service", description: "We design itineraries and programs connecting performances, exhibitions, MICE visits, and stay experiences." },
      { title: "Operation Service", description: "We manage inquiries, schedules, on-site coordination, and transport operations in one flow." },
      { title: "Local Connection Service", description: "We connect hotels, restaurants, cafes, tickets, and airport access partners into one network." },
    ],
  },
  useCases: {
    eyebrow: "Recommended Use Cases",
    title: "Recommended for these visitors",
    items: [
      { title: "Performance Visitors", description: "Combine tickets, accommodation, and airport access for a smoother event visit." },
      { title: "Family Visitors", description: "Connect regional programs, dining, and cafe guides for a family-friendly stay." },
      { title: "Corporate / Group Clients", description: "Bundle stay, dining, transport, tickets, and support for efficient group operations." },
      { title: "International Visitors", description: "Link airport access, hotel, local walks, and dining guides in one visit flow." },
    ],
  },
  steps: {
    eyebrow: "How It Works",
    title: "How the guide works",
    items: [
      { step: "1", title: "Choose a Category", description: "Select the service you need." },
      { step: "2", title: "Review Service Options", description: "Check schedules, options, and conditions." },
      { step: "3", title: "Submit Inquiry", description: "Enter your inquiry information and send your request." },
      { step: "4", title: "Confirm Operations", description: "Finalize schedule and operating arrangement." },
    ],
    ctas: { booking: "See day trips", consult: "Contact for Consultation" },
  },
  partners: {
    eyebrow: "Partner Network",
    title: "Working with Goyang Businesses",
    description: "Goyang's MICE Guide connects stay, dining, transport, venues, exhibition halls, local places, and MICE-linked hubs so visitor movement, stay, and regional experience flow naturally.",
    button: "Partnership Inquiry",
  },
};

const ja: DmcServiceBlocks = {
  pillars: {
    eyebrow: "コアサービス",
    title: "高陽MICE案内の3つのコアサービス",
    items: [
      { title: "企画サービス", description: "公演・展示・MICE訪問・宿泊をつなぐ日程とプログラムを企画します。" },
      { title: "運営サービス", description: "案内・スケジュール・現場対応・移動動線・パートナー運営を統合管理します。" },
      { title: "ローカル連携サービス", description: "ホテル、飲食店、カフェ、チケット、空港アクセスなどのパートナーをひとつの構造でつなぎます。" },
    ],
  },
  useCases: {
    eyebrow: "おすすめの対象",
    title: "このような訪問者におすすめします",
    items: [
      { title: "公演訪問者", description: "チケット・宿泊・空港アクセスをまとめてご案内し、よりスムーズな公演訪問フローを作れます。" },
      { title: "家族訪問者", description: "地域プログラム・飲食・カフェ案内を組み合わせてファミリー向けの滞在体験を作れます。" },
      { title: "法人 / 団体客", description: "宿泊、食事、交通、チケット、サポートをまとめて効率的な団体運営が可能です。" },
      { title: "インバウンド訪問者", description: "空港アクセス・ホテル・都心散策・飲食案内をひとつの旅程にまとめられます。" },
    ],
  },
  steps: {
    eyebrow: "ご利用方法",
    title: "案内の流れ",
    items: [
      { step: "1", title: "カテゴリを選ぶ", description: "必要なサービスを選択します。" },
      { step: "2", title: "サービス内容を確認", description: "日程、オプション、条件を確認します。" },
      { step: "3", title: "案内を申し込む", description: "案内情報を入力してリクエストを送信します。" },
      { step: "4", title: "運営を確定", description: "日程と運営の最終調整を行います。" },
    ],
    ctas: { booking: "日帰り旅行を見る", consult: "お問い合わせ" },
  },
  partners: {
    eyebrow: "Partner Network",
    title: "高陽の事業者とともに",
    description: "高陽MICE案内は宿泊・飲食・交通・公演場・展示場・ローカル空間・MICE連携拠点をつなぎ、訪問者の動きと消費、地域体験を自然な流れにします。",
    button: "提携のお問い合わせ",
  },
};

const zhCN: DmcServiceBlocks = {
  pillars: {
    eyebrow: "核心服务",
    title: "高阳MICE指南的三大核心服务",
    items: [
      { title: "策划服务", description: "规划连接演出、展览、MICE访问与住宿的行程和项目。" },
      { title: "运营服务", description: "统一管理咨询、日程、现场接待、交通动线与合作伙伴运营。" },
      { title: "本地联动服务", description: "将酒店、餐厅、咖啡厅、票务及机场接送等高阳合作伙伴整合为一体化网络。" },
    ],
  },
  useCases: {
    eyebrow: "推荐对象",
    title: "适合以下类型的访客",
    items: [
      { title: "演出访客", description: "将票务、住宿、机场接送打包介绍，打造更顺畅的观演体验。" },
      { title: "家庭访客", description: "整合地区节目、餐饮及咖啡厅指南，打造家庭友好型驻留体验。" },
      { title: "企业/团体客户", description: "捆绑住宿、餐饮、交通、票务及服务支持，实现高效团体运营。" },
      { title: "国际访客", description: "将机场接送、酒店、城市漫游及餐饮指南整合为一体化行程。" },
    ],
  },
  steps: {
    eyebrow: "使用方法",
    title: "指南流程",
    items: [
      { step: "1", title: "选择类别", description: "选择所需服务。" },
      { step: "2", title: "查看服务详情", description: "确认日程、选项与条件。" },
      { step: "3", title: "提交咨询", description: "填写咨询信息并发送请求。" },
      { step: "4", title: "确认运营安排", description: "最终确认日程与运营事宜。" },
    ],
    ctas: { booking: "查看一日游", consult: "联系咨询" },
  },
  partners: {
    eyebrow: "Partner Network",
    title: "与高阳商家同行",
    description: "高阳MICE指南整合住宿、餐饮、交通、演出场馆、展览馆、本地空间与MICE联动据点，让访客的出行、驻留与地区体验自然流畅。",
    button: "合作咨询",
  },
};

const zhTW: DmcServiceBlocks = {
  pillars: {
    eyebrow: "核心服務",
    title: "高陽MICE指南的三大核心服務",
    items: [
      { title: "策劃服務", description: "規劃連結演出、展覽、MICE訪問與住宿的行程和方案。" },
      { title: "營運服務", description: "統一管理諮詢、日程、現場接待、交通動線與合作夥伴營運。" },
      { title: "在地聯動服務", description: "將飯店、餐廳、咖啡廳、票務及機場接送等高陽合作夥伴整合為一體化網絡。" },
    ],
  },
  useCases: {
    eyebrow: "推薦對象",
    title: "適合以下類型的訪客",
    items: [
      { title: "演出訪客", description: "將票務、住宿、機場接送打包介紹，打造更順暢的觀演體驗。" },
      { title: "家庭訪客", description: "整合地區節目、餐飲及咖啡廳指南，打造家庭友好型駐留體驗。" },
      { title: "企業/團體客戶", description: "捆綁住宿、餐飲、交通、票務及服務支援，實現高效團體營運。" },
      { title: "國際訪客", description: "將機場接送、飯店、在地漫遊及餐飲指南整合為一體化行程。" },
    ],
  },
  steps: {
    eyebrow: "使用方法",
    title: "指南流程",
    items: [
      { step: "1", title: "選擇類別", description: "選擇所需服務。" },
      { step: "2", title: "查看服務詳情", description: "確認日程、選項與條件。" },
      { step: "3", title: "提交諮詢", description: "填寫諮詢資訊並送出請求。" },
      { step: "4", title: "確認營運安排", description: "最終確認日程與營運事宜。" },
    ],
    ctas: { booking: "查看一日遊", consult: "聯絡諮詢" },
  },
  partners: {
    eyebrow: "Partner Network",
    title: "與高陽商家同行",
    description: "高陽MICE指南整合住宿、餐飲、交通、演出場館、展覽館、在地空間與MICE聯動據點，讓訪客的出行、駐留與地區體驗自然流暢。",
    button: "合作諮詢",
  },
};

export function getDmcServiceBlocks(locale: DmcBlocksLocale): DmcServiceBlocks {
  if (locale === "en") return en;
  if (locale === "ja") return ja;
  if (locale === "zh-CN") return zhCN;
  if (locale === "zh-TW") return zhTW;
  return ko;
}
