// data/site-copy-defaults.ts — 오더 #C60 사이트 문안 DB 이관 · 폴백 SSOT.
//
// 사이트 하드코딩 문안을 admin 편집 가능하게 만들기 위한 정적 폴백 상수.
// 각 값은 현행 코드 파일에서 그대로 이관 (값 창작·의역 금지):
//   · home.hero*        ← data/home-copy.ts HERO_DISCOVER
//   · trustBar.items    ← components/layout/TrustBar.tsx ITEMS
//   · bestCategories    ← data/curated-categories.ts CATEGORY_LABEL / CARD_DESC
//   · footer            ← components/layout/Footer.tsx BUSINESS_INFO / L.disclaimer / L.disclaimerHeading
//   · exchangeRates     ← data/currency.ts EXCHANGE_RATES (KRW 제외 · KRW=1 상수)
//
// DB 폴백 사용처: lib/site-copy-db.ts readSiteCopy() 실패 or contentJson 부재 시.

export type SiteCopyLocale = "ko" | "en" | "ja" | "zh-CN" | "zh-TW";
export type I18n = Record<SiteCopyLocale, string>;

export type BestCategoryKey =
  | "walk"
  | "food"
  | "culture"
  | "kculture"
  | "history"
  | "family"
  | "shopping"
  | "stay"
  | "night";

export interface TrustBarItem {
  /** 강조(굵게) 라벨. 첫 칸에서만 사용 · 5로케일 공통 브랜드 라벨. */
  bold?: string;
  /** 본 라벨 · 5로케일. */
  label: I18n;
}

export interface SiteCopy {
  home: {
    heroBrandEyebrow: I18n;
    heroHeadline: I18n;
    heroSubhead: I18n;
    heroSearchPlaceholder: I18n;
  };
  trustBar: {
    items: TrustBarItem[]; // 4개
  };
  bestCategories: {
    label: Record<BestCategoryKey, I18n>;
    desc: Record<BestCategoryKey, I18n>;
  };
  footer: {
    companyName: string;
    ceo: string;
    bizRegNo: string;
    ecomRegNo: string;
    address: string;
    phone: string;
    email: string;
    privacyOfficer: string;
    disclaimer: I18n;
    disclaimerHeading: I18n;
  };
  exchangeRates: {
    USD: number;
    JPY: number;
    CNY: number;
    TWD: number;
    // KRW=1 상수 · 편집 불가 (필드 자체 부재).
  };
}

export const defaultSiteCopy: SiteCopy = {
  home: {
    heroBrandEyebrow: {
      ko: "고양시 공식 여행 안내",
      en: "GOYANG OFFICIAL TRAVEL GUIDE",
      ja: "高陽公式トラベルガイド",
      "zh-CN": "高阳官方旅行指南",
      "zh-TW": "高陽官方旅行指南",
    },
    heroHeadline: {
      ko: "고양을 발견하다",
      en: "Discover GOYANG",
      ja: "高陽を発見する",
      "zh-CN": "发现高阳",
      "zh-TW": "發現高陽",
    },
    heroSubhead: {
      ko: "GTX 16분 · 유네스코 세계유산 · K-POP 성지",
      en: "GTX 16 min · UNESCO World Heritage · K-POP heartland",
      ja: "GTX 16分 · ユネスコ世界遺産 · K-POPの聖地",
      "zh-CN": "GTX 16分钟 · 联合国教科文组织世界遗产 · K-POP 圣地",
      "zh-TW": "GTX 16分鐘 · 聯合國教科文組織世界遺產 · K-POP 聖地",
    },
    heroSearchPlaceholder: {
      ko: "어디로 가시나요? (예: 서오릉, 스타필드, 킨텍스)",
      en: "Where would you like to go? (e.g., Seooreung, Starfield, KINTEX)",
      ja: "どこへ行きますか? (例: 西五陵、スターフィールド、KINTEX)",
      "zh-CN": "您想去哪里？(例：西五陵、Starfield、KINTEX)",
      "zh-TW": "您想去哪裡？(例：西五陵、Starfield、KINTEX)",
    },
  },
  trustBar: {
    // 4항목 · 순서:
    //   (1) GOYANG DMC · 방문 가이드     bold="GOYANG DMC"
    //   (2) GTX 16분
    //   (3) 티켓 안전 결제
    //   (4) 5개 언어
    items: [
      {
        bold: "GOYANG DMC",
        label: {
          ko: "고양·일산 방문 가이드",
          en: "Guide to Goyang · Ilsan",
          ja: "高陽・一山の訪問ガイド",
          "zh-CN": "高阳·一山访问指南",
          "zh-TW": "高陽·一山訪問指南",
        },
      },
      {
        label: {
          ko: "서울 도심까지 GTX 16분",
          en: "16 min to central Seoul via GTX",
          ja: "ソウル都心までGTX16分",
          "zh-CN": "GTX 16分钟直达首尔市中心",
          "zh-TW": "GTX 16分鐘直達首爾市中心",
        },
      },
      {
        label: {
          ko: "공연·전시 티켓 안전 결제",
          en: "Secure ticketing for shows & exhibits",
          ja: "公演・展示チケット安全決済",
          "zh-CN": "演出·展览门票安全支付",
          "zh-TW": "演出·展覽門票安全支付",
        },
      },
      {
        label: {
          ko: "5개 언어 안내",
          en: "Available in 5 languages",
          ja: "5言語対応",
          "zh-CN": "5种语言服务",
          "zh-TW": "5種語言服務",
        },
      },
    ],
  },
  bestCategories: {
    label: {
      walk: {
        ko: "산책",
        en: "Walks",
        ja: "散策",
        "zh-CN": "散步",
        "zh-TW": "散步",
      },
      food: {
        ko: "미식",
        en: "Food",
        ja: "美食",
        "zh-CN": "美食",
        "zh-TW": "美食",
      },
      culture: {
        ko: "문화",
        en: "Culture",
        ja: "文化",
        "zh-CN": "文化",
        "zh-TW": "文化",
      },
      kculture: {
        ko: "K컬처",
        en: "K-Culture",
        ja: "K文化",
        "zh-CN": "K文化",
        "zh-TW": "K文化",
      },
      history: {
        ko: "역사",
        en: "History",
        ja: "歴史",
        "zh-CN": "历史",
        "zh-TW": "歷史",
      },
      family: {
        ko: "가족",
        en: "Family",
        ja: "ファミリー",
        "zh-CN": "亲子",
        "zh-TW": "親子",
      },
      shopping: {
        ko: "쇼핑",
        en: "Shopping",
        ja: "ショッピング",
        "zh-CN": "购物",
        "zh-TW": "購物",
      },
      stay: {
        ko: "숙박",
        en: "Stay",
        ja: "宿泊",
        "zh-CN": "住宿",
        "zh-TW": "住宿",
      },
      night: {
        ko: "야간",
        en: "Night",
        ja: "ナイト",
        "zh-CN": "夜间",
        "zh-TW": "夜間",
      },
    },
    desc: {
      walk: {
        ko: "일산호수공원부터 정발산까지, 사계절 걷기 좋은 길",
        en: "From Ilsan Lake Park to Jeongbalsan — trails made for every season.",
        ja: "一山湖水公園から鼎鉢山まで、四季を通じて歩きたい道。",
        "zh-CN": "从一山湖水公园到鼎钵山，四季皆宜的漫步路线。",
        "zh-TW": "從一山湖水公園到鼎缽山，四季皆宜的漫步路線。",
      },
      food: {
        ko: "일산 카페거리부터 백석 맛집까지, 놓치면 아쉬운 한 끼",
        en: "From Ilsan's cafe streets to Baekseok's kitchens — a meal worth the trip.",
        ja: "一山カフェ通りから白石の名店まで、逃したくない一食。",
        "zh-CN": "从一山咖啡街到白石名店，一顿不容错过的美味。",
        "zh-TW": "從一山咖啡街到白石名店，一頓不容錯過的美味。",
      },
      culture: {
        ko: "아람누리·꽃누리에서 만나는 이번 시즌 공연·전시",
        en: "This season's stages and exhibitions at Aram Nuri and Kkot Nuri.",
        ja: "アラムヌリ・コッヌリで出会う、今シーズンの舞台と展示。",
        "zh-CN": "在阿蓝努里·花努里，遇见本季演出与展览。",
        "zh-TW": "在阿藍努里·花努里，遇見本季演出與展覽。",
      },
      kculture: {
        ko: "킨텍스에서 열리는 K-POP·팬 이벤트의 중심",
        en: "KINTEX — the hub of K-POP concerts and fan events.",
        ja: "KINTEXで開かれるK-POP・ファンイベントの中心地。",
        "zh-CN": "KINTEX——K-POP与粉丝活动的中心。",
        "zh-TW": "KINTEX——K-POP與粉絲活動的中心。",
      },
      history: {
        ko: "행주산성부터 서오릉까지, 걸으며 만나는 고양의 시간",
        en: "From Haengju Fortress to Seooreung — Goyang's story, on foot.",
        ja: "幸州山城から西五陵まで、歩いて出会う高陽の時間。",
        "zh-CN": "从幸州山城到西五陵，步行走进高阳的历史。",
        "zh-TW": "從幸州山城到西五陵，步行走進高陽的歷史。",
      },
      family: {
        ko: "스타필드·원마운트, 아이와 하루가 짧은 곳",
        en: "Starfield and OneMount — where a day with the kids is never long enough.",
        ja: "Starfield・OneMount、子どもと過ごす一日が短い場所。",
        "zh-CN": "Starfield·OneMount，与孩子共度的一天总嫌短。",
        "zh-TW": "Starfield·OneMount，與孩子共度的一天總嫌短。",
      },
      shopping: {
        ko: "스타필드부터 원당시장까지, 고양 쇼핑 앵커",
        en: "From Starfield to Wondang Market — Goyang's shopping anchors.",
        ja: "スターフィールドから元堂市場まで、高陽のショッピング拠点。",
        "zh-CN": "从Starfield到元堂市场，高阳的购物据点。",
        "zh-TW": "從Starfield到元堂市場，高陽的購物據點。",
      },
      stay: {
        ko: "킨텍스 인근부터 원흥까지, 고양의 숙박 선택지",
        en: "From KINTEX to Wonheung — where to stay in Goyang.",
        ja: "KINTEX近くから元興まで、高陽の宿泊選択肢。",
        "zh-CN": "从KINTEX附近到元兴，高阳的住宿选择。",
        "zh-TW": "從KINTEX附近到元興，高陽的住宿選擇。",
      },
      night: {
        ko: "호수공원 야경부터 라페스타·웨스턴돔까지, 밤에도 이어지는 고양",
        en: "From the lit-up lake park to Lafesta and Westerndom — Goyang, after dark.",
        ja: "湖水公園の夜景からラフェスタ・ウェスタンドームまで、高陽の夜。",
        "zh-CN": "从湖水公园夜景到Lafesta·Westerndom，高阳的夜晚。",
        "zh-TW": "從湖水公園夜景到Lafesta·Westerndom，高陽的夜晚。",
      },
    },
  },
  footer: {
    companyName: "원새봄 주식회사",
    ceo: "심송학",
    bizRegNo: "287-87-01247",
    ecomRegNo: "제 2021-서울서초-3110 호",
    address: "경기도 고양시 일산동구 호수로 358-25, 동문타워2차 618호",
    phone: "010-8851-1274",
    email: "onesaebom1@gmail.com",
    privacyOfficer: "심송학",
    disclaimer: {
      ko: "본 플랫폼은 정보 소개 서비스를 제공하며, 티켓(공연·전시)을 제외한 상품의 판매·알선·중개를 하지 않습니다. 티켓 외 카테고리의 실제 계약·거래는 각 사업자와 이용자 간에 직접 성립합니다.",
      en: "This platform provides information and guidance services; it does not sell, broker or intermediate any products other than tickets (performances and exhibitions). For non-ticket categories, any actual contract or transaction is concluded directly between the listed business and the user.",
      ja: "本プラットフォームは情報案内サービスを提供するものであり、チケット（公演・展示）を除く商品の販売・斡旋・仲介は行いません。チケット以外のカテゴリーにおける実際の契約・取引は、表示された各事業者と利用者との間で直接成立します。",
      "zh-CN": "本平台仅提供信息介绍服务，不从事门票（演出·展览）以外商品的销售、中介或代理。门票以外类别的实际合同与交易，由所示各经营者与用户之间直接达成。",
      "zh-TW": "本平台僅提供資訊介紹服務，不從事門票（演出·展覽）以外商品之銷售、仲介或代理。門票以外類別之實際合約與交易，由所示各業者與使用者之間直接成立。",
    },
    disclaimerHeading: {
      ko: "법적 고지",
      en: "Legal Notice",
      ja: "法的告知",
      "zh-CN": "法律告知",
      "zh-TW": "法律告知",
    },
  },
  exchangeRates: {
    USD: 0.00073,
    JPY: 0.107,
    CNY: 0.0053,
    TWD: 0.023,
  },
};

export const SITE_COPY_LOCALES: SiteCopyLocale[] = [
  "ko",
  "en",
  "ja",
  "zh-CN",
  "zh-TW",
];

export const BEST_CATEGORY_KEYS: BestCategoryKey[] = [
  "walk",
  "food",
  "culture",
  "kculture",
  "history",
  "family",
  "shopping",
  "stay",
  "night",
];

export function pickSiteCopyLocale(locale: string): SiteCopyLocale {
  return (SITE_COPY_LOCALES as string[]).includes(locale)
    ? (locale as SiteCopyLocale)
    : "ko";
}
