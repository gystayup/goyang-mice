// data/essentials.ts
// 오더 #E2 [3][4]: ESSENTIALS 13 items + PLAN YOUR TRIP (courses·FAQ).
//   essentials-goyang.md · essentials-goyang-2.md · essentials-medical-plantrip.md 그대로.
//
// zh-CN 항목3 「续добавить」 → 「续添」 오타 수정.
// ja  항목2 「종류별」 → 「種類別」 오타 수정.
// Toilet 아이콘: lucide-react 최신 버전에 존재. 대체 불필요.

import type { SpotLocale } from "@/data/spots";
type I18n = Record<SpotLocale, string>;

/** lucide-react 컴포넌트 이름 (렌더에서 매핑). */
export type EssentialIcon =
  | "Toilet" | "Trash2" | "Store" | "Droplet" | "HandCoins"
  | "Footprints" | "CreditCard" | "Phone" | "Info"
  | "CalendarDays" | "Wifi" | "ShieldCheck" | "Stethoscope";

export interface EssentialItem {
  id: string;
  icon: EssentialIcon;
  title: I18n;
  body: I18n;
  sub?: I18n;
  /** 우리 스팟 slug (있으면 링크). */
  slug?: string;
}

export const essentialsHeader = {
  eyebrow: "ESSENTIALS",
  title: {
    ko: "알아두면 편한 것들",
    en: "Good to Know",
    ja: "知っておくと楽なこと",
    "zh-CN": "了解这些会更方便",
    "zh-TW": "了解這些會更方便",
  } satisfies I18n,
  lead: {
    ko: "한국이 처음이라면 몇 가지가 낯설 수 있습니다. 대부분은 알고 나면 간단합니다.",
    en: "A few things may feel unfamiliar if this is your first time in Korea. Most are simple once you know them.",
    ja: "韓国が初めてなら、いくつか戸惑うことがあるかもしれません。ほとんどは知ってしまえば簡単です。",
    "zh-CN": "若是初次到访韩国，有些事或许会令人不解。多数事情知道了就很简单。",
    "zh-TW": "若是初次到訪韓國，有些事或許會令人不解。多數事情知道了就很簡單。",
  } satisfies I18n,
};

export const essentialsItems: EssentialItem[] = [
  {
    id: "toilets",
    icon: "Toilet",
    title: { ko: "화장실", en: "Public Toilets", ja: "トイレ", "zh-CN": "公共卫生间", "zh-TW": "公共廁所" },
    body: {
      ko: "지하철역, 공원, 백화점, 큰 건물에 무료로 있습니다. 요금을 내는 곳은 거의 없습니다. 휴지가 비치돼 있지만 없는 곳도 있어 작은 휴대용 휴지를 들고 다니면 편합니다.",
      en: "Free in subway stations, parks, department stores and larger buildings. Paying to use one is almost unheard of. Paper is usually provided, though not always — a small pack in your bag helps.",
      ja: "地下鉄駅·公園·百貨店·大きな建物に無料であります。料金を払う場所はほとんどありません。紙は備え付けられていますが、ない場所もあるため、小さな携帯用ティッシュを持ち歩くと便利です。",
      "zh-CN": "地铁站、公园、百货商场与大型建筑内均免费开放，几乎无需付费。通常备有纸巾，但也有例外，随身带一小包会更方便。",
      "zh-TW": "地鐵站、公園、百貨商場與大型建築內均免費開放，幾乎無需付費。通常備有紙巾，但也有例外，隨身帶一小包會更方便。",
    },
  },
  {
    id: "bins",
    icon: "Trash2",
    title: { ko: "쓰레기통", en: "Rubbish Bins", ja: "ゴミ箱", "zh-CN": "垃圾桶", "zh-TW": "垃圾桶" },
    body: {
      ko: "길거리에 쓰레기통이 많지 않습니다. 이 점을 모르고 오면 가장 당황합니다. 편의점 앞이나 지하철역 안에 있고, 없으면 가지고 있다가 숙소나 카페에서 버리는 것이 보통입니다. 분리배출을 하므로 종류별 통이 나뉘어 있습니다.",
      en: "There are not many bins on the street — this catches most first-time visitors off guard. You will find them outside convenience stores and inside subway stations; otherwise people carry rubbish until they reach a cafe or their accommodation. Waste is separated, so bins come in sets by type.",
      // 오타 수정: 「종류별」 → 「種類別」.
      ja: "街中にゴミ箱は多くありません。これを知らずに来ると最も戸惑います。コンビニの前や地下鉄駅の中にあり、なければ持っていて宿やカフェで捨てるのが普通です。分別回収のため、種類別に箱が分かれています。",
      "zh-CN": "街上垃圾桶不多，初次到访者往往最感困扰。便利店门口与地铁站内可以找到，否则一般会先带着，到咖啡馆或住处再丢弃。因实行分类回收，垃圾桶按种类分设。",
      "zh-TW": "街上垃圾桶不多，初次到訪者往往最感困擾。便利商店門口與地鐵站內可以找到，否則一般會先帶著，到咖啡館或住處再丟棄。因實行分類回收，垃圾桶按種類分設。",
    },
  },
  {
    id: "convenience",
    icon: "Store",
    title: { ko: "편의점", en: "Convenience Stores", ja: "コンビニ", "zh-CN": "便利店", "zh-TW": "便利商店" },
    body: {
      ko: "24시간 여는 곳이 많고 어디에나 있습니다. 물과 간단한 식사, 교통카드 충전, ATM, 우산까지 대부분 해결됩니다. 안에 앉아서 먹을 자리가 있는 곳도 많습니다.",
      en: "Open around the clock in most cases, and everywhere. Water, quick meals, transit card top-ups, ATMs and umbrellas — most needs are covered. Many have seating inside.",
      ja: "24時間営業の店が多く、どこにでもあります。水や簡単な食事、交通カードのチャージ、ATM、傘までほとんど解決できます。中に座って食べられる席がある店も多いです。",
      "zh-CN": "多数24小时营业，遍布各处。饮用水、简餐、交通卡充值、ATM乃至雨伞，多数需求皆可解决。不少店内设有座位。",
      "zh-TW": "多數24小時營業，遍布各處。飲用水、簡餐、交通卡加值、ATM乃至雨傘，多數需求皆可解決。不少店內設有座位。",
    },
  },
  {
    id: "water",
    icon: "Droplet",
    title: { ko: "물", en: "Drinking Water", ja: "水", "zh-CN": "饮用水", "zh-TW": "飲用水" },
    body: {
      ko: "식당에서는 물을 무료로 줍니다. 정수기가 놓여 있어 직접 따라 마시는 곳도 많습니다. 편의점 생수는 저렴합니다. 수돗물은 음용 기준을 충족하지만 그대로 마시는 사람은 많지 않습니다.",
      en: "Restaurants serve water free of charge; many have a dispenser you help yourself from. Bottled water at convenience stores is inexpensive. Tap water meets drinking standards, though few people drink it straight.",
      ja: "食堂では水を無料で出します。浄水器が置かれ、自分で注いで飲む店も多いです。コンビニのミネラルウォーターは安価です。水道水は飲用基準を満たしていますが、そのまま飲む人は多くありません。",
      "zh-CN": "餐厅提供免费饮用水，许多店家设有饮水机可自行取用。便利店瓶装水价格低廉。自来水符合饮用标准，但直接饮用的人不多。",
      "zh-TW": "餐廳提供免費飲用水，許多店家設有飲水機可自行取用。便利商店瓶裝水價格低廉。自來水符合飲用標準，但直接飲用的人不多。",
    },
  },
  {
    id: "tipping",
    icon: "HandCoins",
    title: { ko: "팁", en: "Tipping", ja: "チップ", "zh-CN": "小费", "zh-TW": "小費" },
    body: {
      ko: "팁 문화가 없습니다. 식당, 카페, 택시 어디서도 팁을 주지 않아도 됩니다. 계산서 금액 그대로 내면 됩니다.",
      en: "There is no tipping culture. You do not tip at restaurants, cafes or in taxis. Pay the amount on the bill and that is it.",
      ja: "チップの習慣がありません。食堂·カフェ·タクシーのいずれでもチップは不要です。伝票の金額をそのまま払えば済みます。",
      "zh-CN": "没有小费文化。餐厅、咖啡馆与出租车皆无需给小费，按账单金额支付即可。",
      "zh-TW": "沒有小費文化。餐廳、咖啡館與計程車皆無需給小費，按帳單金額支付即可。",
    },
  },
  {
    id: "shoes",
    icon: "Footprints",
    title: { ko: "신발", en: "Taking Off Shoes", ja: "靴", "zh-CN": "脱鞋", "zh-TW": "脫鞋" },
    body: {
      ko: "바닥에 앉는 형태의 식당이나 한옥 시설에서는 신발을 벗습니다. 입구에 신발장이 있으면 그런 곳입니다. 양말을 신고 있으면 편합니다.",
      en: "At restaurants with floor seating and at traditional hanok facilities, shoes come off. A shoe rack at the entrance is the sign. Wearing socks makes this easier.",
      ja: "床に座る形式の食堂や韓屋施設では靴を脱ぎます。入口に下駄箱があればそういう場所です。靴下を履いていると楽です。",
      "zh-CN": "在席地而坐的餐厅与韩屋设施内需脱鞋。入口处设有鞋柜即为此类场所。穿着袜子会更方便。",
      "zh-TW": "在席地而坐的餐廳與韓屋設施內需脫鞋。入口處設有鞋櫃即為此類場所。穿著襪子會更方便。",
    },
  },
  {
    id: "payment",
    icon: "CreditCard",
    title: { ko: "결제", en: "Payment", ja: "支払い", "zh-CN": "支付", "zh-TW": "支付" },
    body: {
      ko: "카드 결제가 거의 모든 곳에서 됩니다. 다만 해외 발행 카드는 받지 않는 소규모 가게가 있어 현금을 조금 지니는 편이 안전합니다. 전통시장과 노점은 현금이 편합니다.",
      en: "Card payment works almost everywhere. Some smaller shops do not take foreign-issued cards, so carrying a little cash is safer. Traditional markets and street stalls are easier with cash.",
      ja: "カード決済はほとんどの場所で使えます。ただし海外発行カードを受け付けない小規模店があるため、現金を少し持っている方が安心です。伝統市場や屋台は現金が便利です。",
      "zh-CN": "几乎所有场所都可刷卡。但部分小店不接受境外发行的卡，随身带些现金较为稳妥。传统市场与路边摊用现金更方便。",
      "zh-TW": "幾乎所有場所都可刷卡。但部分小店不接受境外發行的卡，隨身帶些現金較為穩妥。傳統市場與路邊攤用現金更方便。",
    },
  },
  {
    id: "emergency",
    icon: "Phone",
    title: { ko: "긴급 상황", en: "Emergencies", ja: "緊急時", "zh-CN": "紧急情况", "zh-TW": "緊急情況" },
    body: {
      ko: "화재와 구급은 119, 경찰은 112입니다. 관광 관련 문의와 통역은 1330번 관광통역안내 전화에서 여러 언어로 도와줍니다.",
      en: "Fire and ambulance is 119; police is 112. For travel questions and interpretation, the 1330 tourist helpline offers assistance in several languages.",
      ja: "火災と救急は119、警察は112です。観光に関する問い合わせと通訳は1330番の観光通訳案内電話が多言語で対応します。",
      "zh-CN": "火警与急救拨119，报警拨112。旅游咨询与口译服务可拨打1330旅游热线，提供多语种协助。",
      "zh-TW": "火警與急救撥119，報警撥112。旅遊諮詢與口譯服務可撥打1330旅遊熱線，提供多語種協助。",
    },
  },
  {
    id: "info-center",
    icon: "Info",
    title: { ko: "관광안내소", en: "Tourist Information", ja: "観光案内所", "zh-CN": "旅游服务中心", "zh-TW": "旅遊服務中心" },
    body: {
      ko: "정발산역 2번 출구 앞에 고양관광정보센터가 있습니다. 관광 자료를 받고 시티투어를 문의할 수 있습니다.",
      en: "The Goyang Tourist Information Center stands just outside Exit 2 of Jeongbalsan Station. You can pick up materials there and ask about city tours.",
      ja: "鼎鉢山駅2番出口前に高陽観光情報センターがあります。観光資料を受け取り、シティツアーを問い合わせられます。",
      "zh-CN": "鼎钵山站2号出口前设有高阳旅游信息中心，可索取旅游资料并咨询城市观光。",
      "zh-TW": "鼎缽山站2號出口前設有高陽旅遊資訊中心，可索取旅遊資料並諮詢城市觀光。",
    },
    slug: "goyang-tourist-center",
  },
  {
    id: "holidays",
    icon: "CalendarDays",
    title: { ko: "공휴일", en: "Public Holidays", ja: "祝日", "zh-CN": "公休日", "zh-TW": "公休日" },
    body: {
      ko: "한국에는 두 개의 큰 명절이 있습니다. 설날과 추석이며, 음력을 따르기 때문에 해마다 날짜가 바뀝니다. 이 기간에는 사람들이 고향으로 이동하고 상점과 식당의 상당수가 며칠간 문을 닫습니다. 백화점과 대형 시설도 하루 이틀 쉬는 경우가 있습니다. 여행 일정이 이 시기와 겹친다면 미리 확인하는 편이 좋습니다.",
      en: "Korea has two major holidays — Seollal (Lunar New Year) and Chuseok. Both follow the lunar calendar, so the dates shift each year. During these periods people travel to their hometowns and a good number of shops and restaurants close for several days. Department stores and large facilities may shut for a day or two as well. If your trip overlaps, it is worth checking in advance.",
      ja: "韓国には二つの大きな名節があります。ソルラル(旧正月)とチュソクで、旧暦に従うため毎年日付が変わります。この期間は人々が故郷へ移動し、商店や食堂の相当数が数日間閉まります。百貨店や大型施設も1〜2日休む場合があります。旅行日程がこの時期と重なるなら、事前に確認しておくとよいでしょう。",
      "zh-CN": "韩国有两大节日——春节与中秋。两者依农历而定，每年日期不同。此期间民众返乡，相当多的商店与餐厅会歇业数日，百货商场与大型设施也可能休息一两天。若行程与之重叠，建议事先确认。",
      "zh-TW": "韓國有兩大節日——春節與中秋。兩者依農曆而定，每年日期不同。此期間民眾返鄉，相當多的商店與餐廳會歇業數日，百貨商場與大型設施也可能休息一兩天。若行程與之重疊，建議事先確認。",
    },
    sub: {
      ko: "그 밖의 공휴일에는 대부분의 시설이 정상 운영합니다. 오히려 사람이 많아집니다.",
      en: "On other public holidays most places operate as usual — often busier than normal.",
      ja: "その他の祝日はほとんどの施設が通常営業します。むしろ人が増えます。",
      "zh-CN": "其他公休日多数场所照常营业，人反而更多。",
      "zh-TW": "其他公休日多數場所照常營業，人反而更多。",
    },
  },
  {
    id: "internet",
    icon: "Wifi",
    title: { ko: "인터넷", en: "Internet Access", ja: "インターネット", "zh-CN": "网络", "zh-TW": "網路" },
    body: {
      ko: "카페와 식당, 지하철역, 백화점에서 무료 와이파이를 쓸 수 있습니다. 다만 이동 중에도 지도와 번역이 필요하다면 유심이나 eSIM을 준비하는 편이 낫습니다. 인천공항 입국장에서 바로 개통할 수 있습니다.",
      en: "Free Wi-Fi is available in cafes, restaurants, subway stations and department stores. Still, if you need maps and translation while moving around, a SIM or eSIM is the better option. You can activate one right in the arrival hall at Incheon Airport.",
      ja: "カフェ·食堂·地下鉄駅·百貨店で無料Wi-Fiが使えます。ただし移動中も地図や翻訳が必要なら、SIMまたはeSIMを用意する方がよいでしょう。仁川空港の入国フロアですぐに開通できます。",
      "zh-CN": "咖啡馆、餐厅、地铁站与百货商场均可使用免费Wi-Fi。但若在移动途中需要地图与翻译，建议准备SIM卡或eSIM，可在仁川机场入境大厅直接开通。",
      "zh-TW": "咖啡館、餐廳、地鐵站與百貨商場均可使用免費Wi-Fi。但若在移動途中需要地圖與翻譯，建議準備SIM卡或eSIM，可在仁川機場入境大廳直接開通。",
    },
    sub: {
      ko: "구글 지도는 한국에서 도보·대중교통 안내가 제한적입니다. 현지에서 쓰는 지도 앱을 받아두면 이동이 훨씬 수월합니다.",
      en: "Google Maps offers limited walking and transit directions in Korea. Downloading a locally used map app makes getting around much easier.",
      ja: "グーグルマップは韓国では徒歩·公共交通の案内が限定的です。現地で使われている地図アプリを入れておくと移動がずっと楽になります。",
      "zh-CN": "谷歌地图在韩国的步行与公共交通导航较为受限。下载本地常用地图应用会让出行顺畅许多。",
      "zh-TW": "谷歌地圖在韓國的步行與大眾運輸導航較為受限。下載本地常用地圖應用會讓出行順暢許多。",
    },
  },
  {
    id: "safety",
    icon: "ShieldCheck",
    title: { ko: "안전", en: "Staying Safe", ja: "安全", "zh-CN": "安全", "zh-TW": "安全" },
    body: {
      ko: "밤늦게 걸어 다니는 것이 일반적이며, 카페에서 자리를 잡아두려고 물건을 두고 가는 모습도 흔합니다. 그렇다고 해도 사람이 많은 곳에서는 소지품을 챙기는 것이 좋습니다. 경찰은 112, 화재와 구급은 119입니다.",
      en: "Walking late at night is ordinary here, and it is common to see people leave belongings on a cafe table to hold a seat. Even so, keep an eye on your things in crowded places. Police is 112; fire and ambulance is 119.",
      ja: "夜遅く歩くことは一般的で、カフェで席を取るために荷物を置いていく光景もよく見かけます。とはいえ人の多い場所では持ち物に気を配る方がよいでしょう。警察は112、火災と救急は119です。",
      "zh-CN": "深夜步行在此地十分平常，也常见有人将物品留在咖啡馆桌上占位。即便如此，在人多之处仍应留意随身物品。报警112，火警与急救119。",
      "zh-TW": "深夜步行在此地十分平常，也常見有人將物品留在咖啡館桌上佔位。即便如此，在人多之處仍應留意隨身物品。報警112，火警與急救119。",
    },
    sub: {
      ko: "잃어버린 물건은 지하철역 유실물센터나 경찰서에서 찾을 수 있습니다.",
      en: "Lost items can be reclaimed at subway lost-and-found offices or police stations.",
      ja: "落とし物は地下鉄駅の遺失物センターや警察署で受け取れます。",
      "zh-CN": "遗失物品可在地铁站失物招领处或警察局领取。",
      "zh-TW": "遺失物品可在地鐵站失物招領處或警察局領取。",
    },
  },
  {
    id: "illness",
    icon: "Stethoscope",
    title: { ko: "아플 때", en: "If You Fall Ill", ja: "体調が悪いとき", "zh-CN": "身体不适时", "zh-TW": "身體不適時" },
    body: {
      ko: "급하면 119로 전화하면 구급차가 옵니다. 급하지 않은 증상은 약국에서 상담하고 약을 살 수 있습니다. 약국은 초록 십자 표시로 찾습니다. 병원에 가야 한다면 여행자보험 가입 여부를 먼저 확인하세요. 외국인은 건강보험이 적용되지 않아 진료비를 전액 부담합니다.",
      en: "In an emergency, call 119 and an ambulance will come. For minor symptoms you can consult at a pharmacy and buy medicine there; look for the green cross sign. If you need a hospital, check your travel insurance first — visitors are not covered by national health insurance and pay the full cost.",
      ja: "急ぎの場合は119に電話すれば救急車が来ます。急を要さない症状は薬局で相談し、薬を買えます。薬局は緑の十字の表示で見つけます。病院に行く必要があれば、まず旅行保険の加入をご確認ください。外国人は健康保険が適用されず、診療費を全額負担します。",
      "zh-CN": "情况紧急时拨打119，救护车会前来。症状轻微可到药局咨询并购药，药局以绿色十字标识辨认。若需就医，请先确认是否投保旅行保险——外国人不适用国民健康保险，需全额自付诊疗费。",
      "zh-TW": "情況緊急時撥打119，救護車會前來。症狀輕微可到藥局諮詢並購藥，藥局以綠色十字標識辨認。若需就醫，請先確認是否投保旅行保險——外國人不適用國民健康保險，需全額自付診療費。",
    },
    sub: {
      ko: "응급의료 상담과 병원 안내는 1339, 관광 통역은 1330에서 받을 수 있습니다.",
      en: "For emergency medical advice and hospital guidance call 1339; for travel interpretation, 1330.",
      ja: "救急医療の相談と病院案内は1339、観光通訳は1330で受けられます。",
      "zh-CN": "急救医疗咨询与医院指引拨1339，旅游口译拨1330。",
      "zh-TW": "急救醫療諮詢與醫院指引撥1339，旅遊口譯撥1330。",
    },
  },
];

// ─── PLAN YOUR TRIP ────────────────────────────────────────────────────────

export const planHeader = {
  eyebrow: "PLAN YOUR TRIP",
  title: {
    ko: "오기 전에",
    en: "Before You Come",
    ja: "来る前に",
    "zh-CN": "出发之前",
    "zh-TW": "出發之前",
  } satisfies I18n,
};

export const planFirstTime = {
  title: {
    ko: "고양이 처음이라면",
    en: "Goyang for the First Time",
    ja: "高陽が初めてなら",
    "zh-CN": "初次到访高阳",
    "zh-TW": "初次到訪高陽",
  } satisfies I18n,
  lead: {
    ko: "하루가 있다면 이렇게, 이틀이 있다면 이렇게 씁니다.",
    en: "One day, or two — here is how to spend them.",
    ja: "一日なら、二日なら。こう使います。",
    "zh-CN": "若有一天，或有两天，这样安排。",
    "zh-TW": "若有一天，或有兩天，這樣安排。",
  } satisfies I18n,
  courses: [
    {
      name: { ko: "하루", en: "One Day", ja: "一日", "zh-CN": "一天", "zh-TW": "一天" } satisfies I18n,
      stops: {
        ko: "오전 서오릉 → 점심 라페스타 → 오후 일산호수공원 → 저녁 웨스턴돔",
        en: "Morning at Seooreung → lunch at Lafesta → afternoon at Ilsan Lake Park → evening at Western Dom",
        ja: "午前は西五陵 → 昼食はラフェスタ → 午後は一山湖水公園 → 夕方はウエスタンドム",
        "zh-CN": "上午西五陵 → 午餐拉斐斯塔 → 下午一山湖水公园 → 傍晚西部圆顶",
        "zh-TW": "上午西五陵 → 午餐拉斐斯塔 → 下午一山湖水公園 → 傍晚西部圓頂",
      } satisfies I18n,
      note: {
        ko: "서오릉은 이동에 시간이 걸립니다. 오전에 먼저 다녀오는 편이 낫습니다.",
        en: "Seooreung takes time to reach — going first thing in the morning works better.",
        ja: "西五陵は移動に時間がかかります。午前に先に行く方がよいでしょう。",
        "zh-CN": "前往西五陵需较多交通时间，建议上午先行前往。",
        "zh-TW": "前往西五陵需較多交通時間，建議上午先行前往。",
      } satisfies I18n,
    },
    {
      name: { ko: "이틀", en: "Two Days", ja: "二日", "zh-CN": "两天", "zh-TW": "兩天" } satisfies I18n,
      stops: {
        ko: "첫날 서오릉·서삼릉 → 둘째 날 킨텍스 일대·호수공원·라페스타",
        en: "Day one at Seooreung and Seosamneung → day two around KINTEX, the lake park and Lafesta",
        ja: "一日目は西五陵·西三陵 → 二日目はキンテックス一帯·湖水公園·ラフェスタ",
        "zh-CN": "首日西五陵与西三陵 → 次日韩国国际展览中心一带、湖水公园与拉斐斯塔",
        "zh-TW": "首日西五陵與西三陵 → 次日韓國國際展覽中心一帶、湖水公園與拉斐斯塔",
      } satisfies I18n,
    },
    {
      name: { ko: "전시를 보러 왔다면", en: "If You Came for an Exhibition", ja: "展示が目的なら", "zh-CN": "若为展会而来", "zh-TW": "若為展會而來" } satisfies I18n,
      stops: {
        ko: "킨텍스 → 현대 모터스튜디오 → 호수공원 → 라페스타 저녁",
        en: "KINTEX → Hyundai Motorstudio → the lake park → dinner at Lafesta",
        ja: "キンテックス → 現代モータースタジオ → 湖水公園 → ラフェスタで夕食",
        "zh-CN": "韩国国际展览中心 → 现代汽车文化馆 → 湖水公园 → 拉斐斯塔晚餐",
        "zh-TW": "韓國國際展覽中心 → 現代汽車文化館 → 湖水公園 → 拉斐斯塔晚餐",
      } satisfies I18n,
    },
  ],
};

export const planAccessibility = {
  title: {
    ko: "접근성 안내",
    en: "Accessible Goyang",
    ja: "アクセシビリティ案内",
    "zh-CN": "无障碍指南",
    "zh-TW": "無障礙指南",
  } satisfies I18n,
  lead: {
    ko: "휠체어나 유아차로 이동하는 경우에 참고할 정보입니다. 각 장소의 접근성은 상세 페이지에도 표시돼 있습니다.",
    en: "For visitors travelling with a wheelchair or a pushchair. Accessibility is also shown on each place's own page.",
    ja: "車椅子やベビーカーで移動される方向けの情報です。各場所のアクセシビリティは詳細ページにも表示されています。",
    "zh-CN": "供使用轮椅或婴儿车出行者参考。各地点的无障碍信息亦标示于其详情页。",
    "zh-TW": "供使用輪椅或嬰兒車出行者參考。各地點的無障礙資訊亦標示於其詳情頁。",
  } satisfies I18n,
  labels: {
    wheelchair: { ko: "휠체어 가능", en: "Wheelchair accessible", ja: "車椅子可", "zh-CN": "轮椅可通行", "zh-TW": "輪椅可通行" } satisfies I18n,
    partial: { ko: "일부 구간 가능", en: "Partially accessible", ja: "一部区間のみ可", "zh-CN": "部分区域可通行", "zh-TW": "部分區域可通行" } satisfies I18n,
    inquiry: { ko: "현장 확인", en: "Check on site", ja: "現地でご確認", "zh-CN": "请现场确认", "zh-TW": "請現場確認" } satisfies I18n,
  },
  transportNote: {
    ko: "지하철역에는 엘리베이터가 있습니다. 저상버스는 노선에 따라 운행 여부가 다르니 확인이 필요합니다. 왕릉은 흙길과 경사가 있어 구간별로 접근성이 다릅니다.",
    en: "Subway stations have lifts. Low-floor buses run on some routes but not all, so check in advance. Royal tomb grounds include unpaved paths and slopes, so accessibility varies by section.",
    ja: "地下鉄駅にはエレベーターがあります。低床バスは路線により運行が異なるため確認が必要です。王陵は土の道と傾斜があり、区間ごとにアクセシビリティが異なります。",
    "zh-CN": "地铁站设有电梯。低地板公交并非所有线路都有，需事先确认。王陵内有土路与坡道，各区段无障碍程度不同。",
    "zh-TW": "地鐵站設有電梯。低地板公車並非所有路線都有，需事先確認。王陵內有土路與坡道，各區段無障礙程度不同。",
  } satisfies I18n,
};

export const planFaq: { q: I18n; a: I18n }[] = [
  {
    q: { ko: "서울에서 얼마나 걸리나요", en: "How far is it from Seoul?", ja: "ソウルからどのくらいかかりますか", "zh-CN": "从首尔要多久", "zh-TW": "從首爾要多久" },
    a: {
      ko: "GTX-A로 서울역에서 킨텍스역까지 약 20분입니다. 3호선은 환승 없이 도심에서 일산까지 이어집니다.",
      en: "About 20 minutes from Seoul Station to Kintex Station on the GTX-A. Line 3 runs from central Seoul to Ilsan without a transfer.",
      ja: "GTX-Aでソウル駅からキンテックス駅まで約20分です。3号線は乗り換えなしで都心から一山までつながります。",
      "zh-CN": "乘GTX-A从首尔站到韩国国际展览中心站约20分钟。3号线无需换乘，从市中心直达一山。",
      "zh-TW": "乘GTX-A從首爾站到韓國國際展覽中心站約20分鐘。3號線無需換乘，從市中心直達一山。",
    },
  },
  {
    q: { ko: "하루면 충분한가요", en: "Is one day enough?", ja: "一日で足りますか", "zh-CN": "一天够吗", "zh-TW": "一天夠嗎" },
    a: {
      ko: "한 지역만 본다면 하루로 됩니다. 왕릉과 일산 도심을 함께 보려면 이틀이 편합니다. 두 곳이 서로 떨어져 있습니다.",
      en: "One day works if you stay in one area. Two days are more comfortable if you want both the royal tombs and central Ilsan — the two are some distance apart.",
      ja: "一つの地域だけ見るなら一日で足ります。王陵と一山都心を一緒に見るなら二日の方が楽です。二か所は離れています。",
      "zh-CN": "若只游览一个区域，一天足够。若想同时造访王陵与一山市区，两天较为从容——两处相距较远。",
      "zh-TW": "若只遊覽一個區域，一天足夠。若想同時造訪王陵與一山市區，兩天較為從容——兩處相距較遠。",
    },
  },
  {
    q: { ko: "영어가 통하나요", en: "Is English spoken?", ja: "英語は通じますか", "zh-CN": "能用英语吗", "zh-TW": "能用英語嗎" },
    a: {
      ko: "관광안내소와 대형 시설에서는 통합니다. 작은 가게에서는 어려울 수 있으나 번역 앱으로 대부분 해결됩니다. 이 사이트의 한국어 원문 카드를 보여주셔도 됩니다.",
      en: "Yes at tourist information centres and larger facilities. It can be harder at small shops, though a translation app usually solves it. You can also show the Korean phrase cards on this site.",
      ja: "観光案内所や大型施設では通じます。小さな店では難しい場合がありますが、翻訳アプリでほぼ解決します。当サイトの韓国語原文カードをお見せいただいても構いません。",
      "zh-CN": "旅游服务中心与大型设施可以。小店可能有些困难，但用翻译应用大多能解决，也可出示本站的韩语原文卡片。",
      "zh-TW": "旅遊服務中心與大型設施可以。小店可能有些困難，但用翻譯應用大多能解決，也可出示本站的韓語原文卡片。",
    },
  },
  {
    q: { ko: "언제 가는 게 좋나요", en: "When is the best time to visit?", ja: "いつ行くのがよいですか", "zh-CN": "什么时候去比较好", "zh-TW": "什麼時候去比較好" },
    a: {
      ko: "봄과 가을이 걷기에 좋습니다. 봄에는 꽃박람회가, 가을에는 축제가 열립니다. 여름은 덥고 습하며 겨울은 바람이 찹니다. 설날과 추석 연휴에는 문 닫는 곳이 많습니다.",
      en: "Spring and autumn are best for walking. A flower festival runs in spring and other festivals in autumn. Summers are hot and humid; winter winds are cold. Many places close over the Seollal and Chuseok holidays.",
      ja: "春と秋が歩くのに適しています。春には花博覧会が、秋には祭りが開かれます。夏は暑く湿度が高く、冬は風が冷たいです。ソルラルとチュソクの連休は閉まる場所が多くなります。",
      "zh-CN": "春秋两季最适合步行。春季有花卉博览会，秋季有各类庆典。夏季闷热，冬季风寒。春节与中秋连假期间多处歇业。",
      "zh-TW": "春秋兩季最適合步行。春季有花卉博覽會，秋季有各類慶典。夏季悶熱，冬季風寒。春節與中秋連假期間多處歇業。",
    },
  },
  {
    q: { ko: "숙소는 어디가 좋나요", en: "Where should I stay?", ja: "宿はどこがよいですか", "zh-CN": "住哪里比较好", "zh-TW": "住哪裡比較好" },
    a: {
      ko: "킨텍스 일대는 전시 참가자에게 편하고, 정발산역 일대는 식당과 상점이 가까워 걸어 다니기 좋습니다. 서울과 오가는 일정이라면 GTX 킨텍스역이나 3호선 역 근처가 편합니다.",
      en: "The KINTEX area suits exhibition visitors; around Jeongbalsan Station you are close to restaurants and shops and can walk everywhere. If you plan to go back and forth to Seoul, staying near GTX Kintex Station or a Line 3 station is easier.",
      ja: "キンテックス一帯は展示参加者に便利で、鼎鉢山駅一帯は飲食店や商店が近く歩きやすいです。ソウルと行き来する日程なら、GTXキンテックス駅や3号線の駅近くが便利です。",
      "zh-CN": "韩国国际展览中心一带便于参展者；鼎钵山站周边餐厅商店集中，适合步行。若行程需往返首尔，住在GTX韩国国际展览中心站或3号线站附近更为便利。",
      "zh-TW": "韓國國際展覽中心一帶便於參展者；鼎缽山站周邊餐廳商店集中，適合步行。若行程需往返首爾，住在GTX韓國國際展覽中心站或3號線站附近更為便利。",
    },
  },
];
