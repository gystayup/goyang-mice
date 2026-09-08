// data/day-trip-courses-i18n.ts — 오더 #D25 [1]+[3] 당일코스 다국어 스키마·어댑터.
//
// 방침:
//   · TicketTranslation 등 기존 데이터 다국어 패턴 준용 — 원문 옆에 로케일별 optional 필드.
//   · 파일 분리: 원문 (data/day-trip-courses.ts) 무접촉 유지, 번역은 이 파일에 축적.
//   · 렌더는 loadDayTrip(id) 결과에 getLocalizedDayTripCourse(course, locale) 를 통과시켜
//     로케일 값 스왑. 미보유 필드는 ko 원문 폴백.
//   · 오더 #D25 범위: 스키마 + 어댑터 + 서울 6개 번역. 파주 6 · 경기 5 는 후속 PR.
//
// 번역 원칙 (오더 #D25):
//   · 숫자·역명·시간 원문 그대로 (변형 0).
//   · 고유명사 각국 표기 관례 (경복궁 → Gyeongbokgung / 景福宮 / 景福宫).
//   · 처음 등장 시 일·중 로마자 병기 권장.
//   · 원문에 없는 정보 추가 금지 · 사실 창작 금지.

import type { DayTripCourse } from "./day-trip-courses";

export type DayTripI18nLocale = "en" | "ja" | "zh-CN" | "zh-TW";

/** DayTripCourse 의 로케일 번역. 모든 필드 optional — 미설정 시 ko 원문 폴백. */
export interface DayTripCourseTranslation {
  name?: string;
  hook?: string;
  hookLine?: string;
  intro?: string;
  transport?: string;
  duration?: string;
  recommendedTime?: string;
  note?: string;
  access?: string;
  overview?: {
    totalDuration?: string;
    transport?: string;
    recommendedTime?: string;
    recommendedFor?: string;
  };
  stops?: Array<{ name?: string; note?: string }>;
  timeline?: Array<{
    spotName?: string;
    note?: string;
    duration?: string;
    transportToNext?: string;
  }>;
  whyGood?: string[];
  faq?: Array<{ q?: string; a?: string }>;
  nearby?: Array<{ name?: string; desc?: string; distance?: string }>;
}

type PerLocale = Partial<Record<DayTripI18nLocale, DayTripCourseTranslation>>;

// ─── 서울 축 6개 번역 ─────────────────────────────────────────────────────

const seoulRoyal: PerLocale = {
  en: {
    name: "Royal Seoul — Gyeongbokgung, Bukchon, Insadong",
    hook: "Six centuries of Seoul on foot, from palace gates to hanok alleys.",
    hookLine: "Six centuries of Seoul on foot, from palace gates to hanok alleys.",
    intro:
      "The course begins at Gyeongbokgung, the main palace of the Joseon dynasty, then walks through the alleys of Bukchon Hanok Village and on to Insadong.\nThe three sites connect on foot, and palace architecture, traditional housing, and craft appear in sequence — the clearest introduction for a first visit to Korea. Renting a hanbok waives the Gyeongbokgung admission fee, so photographing at the palace and continuing straight to Bukchon becomes a natural flow.",
    stops: [
      { name: "Gyeongbokgung Palace", note: "The Royal Guard Changing Ceremony and Geunjeongjeon Hall. Mornings are quietest." },
      { name: "Bukchon Hanok Village", note: "A living hanok neighborhood. Follow the quiet-zone signage." },
      { name: "Insadong", note: "A street of traditional crafts, tea, and calligraphy. Ssamziegil is a good place to finish." },
    ],
    transport: "Line 3 Daegok Stn. → Gyeongbokgung Stn. · direct, no transfer",
    duration: "About 27–29 min one way / About 2 hr 30 min on site",
    recommendedTime: "09:30 – 13:30",
    overview: {
      totalDuration: "About 4 hours",
      transport: "About 27–29 min one way · no transfer",
      recommendedTime: "09:30 – 13:30",
      recommendedFor: "First-time visitors to Korea · those planning a hanbok photoshoot",
    },
    timeline: [
      { spotName: "Depart Daegok Stn.", note: "Board Line 3 toward Gyeongbokgung · no transfer.", transportToNext: "Subway 27–29 min" },
      { spotName: "Gyeongbokgung Palace", duration: "About 90 min", note: "10:00 Royal Guard Changing Ceremony · Geunjeongjeon · Gyeonghoeru. Free entry with hanbok.", transportToNext: "Walk 15 min" },
      { spotName: "Bukchon Hanok Village", duration: "About 45 min", note: "A living neighborhood. Follow the quiet-zone signage.", transportToNext: "Walk 10 min" },
      { spotName: "Insadong", duration: "About 50 min", note: "Traditional crafts, tea, and calligraphy. Finish at Ssamziegil.", transportToNext: "Subway 27–29 min" },
      { spotName: "Arrive Daegok Stn.", note: "About 55 min total travel · 3 hr 5 min on site." },
    ],
    whyGood: [
      "Palace, hanok village, and craft street connect on foot — minimal transit stress.",
      "Renting a hanbok waives Gyeongbokgung admission and eases the photo flow.",
      "Line 3 Daegok → Gyeongbokgung Stn. is direct, no transfer.",
    ],
    access:
      "From Daegok Stn. in Goyang, Seoul Line 3 reaches Gyeongbokgung Stn. in 27–29 min · no transfer.\nExit 5 at Gyeongbokgung Stn. is closest to Gwanghwamun and the palace.\nThe Bukchon and Insadong legs are all on foot · no additional transit.",
    faq: [
      {
        q: "Does renting a hanbok really waive the Gyeongbokgung admission fee?",
        a: "Yes — wearing hanbok waives admission at Gyeongbokgung, Changdeokgung, Deoksugung, Changgyeonggung, and Jongmyo. Renting before the palace visit is the better order.",
      },
      {
        q: "When can I see the Royal Guard Changing Ceremony at Gyeongbokgung?",
        a: "Daily at 10:00 and 14:00, 20 min each (closed Tuesdays · cancelled in rain). Check the official site for the day of your visit.",
      },
      {
        q: "Are there any etiquette rules in Bukchon Hanok Village?",
        a: "This is a residential neighborhood. Follow the quiet-zone signage and do not photograph inside gates or windows.",
      },
      {
        q: "Where can I eat Korean food in Insadong?",
        a: "Traditional tea houses, bibimbap, and sujebi restaurants cluster in the alleys around Ssamziegil. Lunchtime can involve a wait — arriving early is easier.",
      },
    ],
    nearby: [
      { name: "Insadong Ssamziegil", desc: "An alley-style shopping street for traditional crafts, tea, and calligraphy", distance: "Walk 3 min" },
      { name: "Tongin Market", desc: "An alley market west of Gyeongbokgung · lunchbox cafés and old-school shops", distance: "Walk 10 min" },
      { name: "Samcheong-dong Café Street", desc: "A café and dessert cluster in the alleys next to Bukchon", distance: "Walk 15 min" },
    ],
  },
  ja: {
    name: "王のソウル — 景福宮・北村・仁寺洞",
    hook: "宮殿から韓屋の路地まで、ソウル600年を歩いて通り抜ける。",
    hookLine: "宮殿から韓屋の路地まで、ソウル600年を歩いて通り抜ける。",
    intro:
      "朝鮮王朝の正宮・景福宮（キョンボックン）から出発し、北村（ブクチョン）韓屋村の路地を抜けて仁寺洞（インサドン）の通りへとつながるコースです。\n三か所が徒歩でつながり、宮殿建築・韓屋住居・伝統工芸が順に現れるため、初めて韓国を訪れる方に最もわかりやすい構成です。韓服（ハンボク）をレンタルすると景福宮の入場料が免除されるので、宮で写真を撮ってそのまま北村へ移動する流れが自然です。",
    stops: [
      { name: "景福宮 (Gyeongbokgung)", note: "王宮守門将交代儀式と勤政殿。朝の時間帯が最も空いています。" },
      { name: "北村韓屋村 (Bukchon)", note: "住民が実際に暮らす韓屋の街。「静穏区域」の表示に従ってください。" },
      { name: "仁寺洞 (Insadong)", note: "伝統工芸・お茶・書道の通り。サムジキル（Ssamziegil）で締めくくるのがおすすめ。" },
    ],
    transport: "地下鉄3号線 大谷駅（テゴク） → 景福宮駅 直通・乗換なし",
    duration: "片道 約27〜29分 / 滞在 約2時間30分",
    recommendedTime: "09:30 〜 13:30",
    overview: {
      totalDuration: "約4時間",
      transport: "片道 約27〜29分・乗換なし",
      recommendedTime: "09:30 〜 13:30",
      recommendedFor: "初めて韓国を訪れる方・韓服体験を希望する方",
    },
    timeline: [
      { spotName: "大谷駅 出発", note: "3号線 景福宮方面 乗車・乗換なし。", transportToNext: "地下鉄 27〜29分" },
      { spotName: "景福宮", duration: "約90分", note: "10:00 守門将交代儀式・勤政殿・慶會樓。韓服着用で入場料免除。", transportToNext: "徒歩 15分" },
      { spotName: "北村韓屋村", duration: "約45分", note: "住民が暮らす街。静穏区域の表示に従ってください。", transportToNext: "徒歩 10分" },
      { spotName: "仁寺洞", duration: "約50分", note: "伝統工芸・お茶・書道の通り。サムジキルで締めくくり。", transportToNext: "地下鉄 27〜29分" },
      { spotName: "大谷駅 到着", note: "総移動 約55分・滞在 約3時間5分。" },
    ],
    whyGood: [
      "宮殿・韓屋・工芸が徒歩圏内でつながり、移動の負担がない。",
      "韓服レンタルで景福宮の入場料が免除され、撮影動線が自然になる。",
      "大谷駅から景福宮駅まで3号線直通・乗換なし。",
    ],
    access:
      "高陽の大谷駅からソウル地下鉄3号線で景福宮駅まで27〜29分・乗換なし。\n景福宮駅5番出口が光化門・景福宮方面に最も近いです。\n北村・仁寺洞区間は全て徒歩・別途の公共交通は利用しません。",
    faq: [
      {
        q: "韓服をレンタルすると本当に景福宮の入場料が無料ですか？",
        a: "はい、韓服着用時は景福宮・昌徳宮・徳寿宮・昌慶宮・宗廟の入場料が免除されます。宮殿訪問前にレンタル店を利用するのがおすすめです。",
      },
      {
        q: "景福宮の守門将交代儀式はいつ見られますか？",
        a: "毎日 10:00・14:00・各20分（火曜日は定期休館・雨天中止）。訪問前に公式サイトで当日の運営状況をご確認ください。",
      },
      {
        q: "北村韓屋村で守るべきマナーはありますか？",
        a: "実際に住民が暮らす街です。静穏区域の表示に従い、門や窓の内側を撮影しないでください。",
      },
      {
        q: "仁寺洞で韓食を食べるならどこがいいですか？",
        a: "サムジキル周辺の路地に伝統茶屋・ビビンバ・スジェビ（すいとん）の店が集まっています。昼時は混み合うので、早めの時間が入りやすいです。",
      },
    ],
    nearby: [
      { name: "仁寺洞サムジキル", desc: "伝統工芸・お茶・書道が集まる路地型ショッピング街", distance: "徒歩3分" },
      { name: "通仁市場", desc: "景福宮西側の路地市場・お弁当カフェと老舗", distance: "徒歩10分" },
      { name: "三清洞カフェ通り", desc: "北村の隣、路地に広がるカフェ・スイーツエリア", distance: "徒歩15分" },
    ],
  },
  "zh-CN": {
    name: "王的首尔 — 景福宫·北村·仁寺洞",
    hook: "从宫阙走进韩屋巷弄，用双脚穿越首尔600年。",
    hookLine: "从宫阙走进韩屋巷弄，用双脚穿越首尔600年。",
    intro:
      "从朝鲜王朝正宫景福宫出发，穿过北村韩屋村的巷弄，一路走到仁寺洞的街道。\n三处景点步行相连，宫殿建筑、韩屋民居、传统工艺依次呈现，是初次到访韩国最容易理解的路线。租借韩服可免景福宫门票，从宫殿开始拍照直接走向北村，动线十分自然。",
    stops: [
      { name: "景福宫 (Gyeongbokgung)", note: "守门将换岗仪式与勤政殿。清晨时段人最少。" },
      { name: "北村韩屋村 (Bukchon)", note: "居民实际生活的韩屋社区。请遵守静音区域指示牌。" },
      { name: "仁寺洞 (Insadong)", note: "汇集传统工艺、茶饮与书法的老街。以Ssamziegil（仁寺洞人人商店街）作为收尾最合适。" },
    ],
    transport: "地铁3号线 大谷站 → 景福宫站 直达 · 无需换乘",
    duration: "单程约27–29分钟 / 停留约2小时30分",
    recommendedTime: "09:30 – 13:30",
    overview: {
      totalDuration: "约4小时",
      transport: "单程约27–29分钟 · 无需换乘",
      recommendedTime: "09:30 – 13:30",
      recommendedFor: "初次到访韩国的旅客 · 想体验韩服拍照的旅客",
    },
    timeline: [
      { spotName: "大谷站出发", note: "3号线景福宫方向乘车 · 无需换乘。", transportToNext: "地铁 27–29分钟" },
      { spotName: "景福宫", duration: "约90分钟", note: "10:00 守门将换岗仪式 · 勤政殿 · 庆会楼。着韩服可免门票。", transportToNext: "步行 15分钟" },
      { spotName: "北村韩屋村", duration: "约45分钟", note: "居民实际生活的社区。请遵守静音区域指示牌。", transportToNext: "步行 10分钟" },
      { spotName: "仁寺洞", duration: "约50分钟", note: "传统工艺、茶饮与书法街。以Ssamziegil收尾。", transportToNext: "地铁 27–29分钟" },
      { spotName: "抵达大谷站", note: "总移动约55分钟 · 停留约3小时5分。" },
    ],
    whyGood: [
      "宫殿·韩屋·工艺步行可达，移动负担极小。",
      "租借韩服可免景福宫门票，拍照动线更自然。",
      "大谷站至景福宫站3号线直达 · 无需换乘。",
    ],
    access:
      "从高阳大谷站乘首尔地铁3号线到景福宫站，用时27–29分钟 · 无需换乘。\n景福宫站5号出口最靠近光化门与景福宫。\n北村与仁寺洞路段全程步行，无需其他公共交通。",
    faq: [
      { q: "租借韩服真的可以免景福宫门票吗？", a: "是的。穿着韩服可免景福宫、昌德宫、德寿宫、昌庆宫及宗庙的门票。建议在参观宫殿前先前往租借店。" },
      { q: "景福宫守门将换岗仪式什么时候可以看到？", a: "每日 10:00 和 14:00 各20分钟（周二定休 · 雨天取消）。访问前请在官方网站确认当日运营情况。" },
      { q: "北村韩屋村需要注意哪些礼仪？", a: "这里是居民实际居住的社区。请遵守静音区域指示牌，不要拍摄门内、窗内。" },
      { q: "仁寺洞在哪里可以吃到韩餐？", a: "Ssamziegil周边的小巷聚集着传统茶馆、拌饭、面片汤等餐馆。午餐时间可能需要等位，建议提早前往。" },
    ],
    nearby: [
      { name: "仁寺洞 Ssamziegil", desc: "汇集传统工艺、茶饮与书法的巷弄型商店街", distance: "步行3分钟" },
      { name: "通仁市场", desc: "景福宫西侧的巷弄市场 · 便当咖啡与老字号", distance: "步行10分钟" },
      { name: "三清洞咖啡街", desc: "紧邻北村的巷弄咖啡与甜点集中区", distance: "步行15分钟" },
    ],
  },
  "zh-TW": {
    name: "王的首爾 — 景福宮·北村·仁寺洞",
    hook: "從宮闕走進韓屋巷弄，用雙腳穿越首爾600年。",
    hookLine: "從宮闕走進韓屋巷弄，用雙腳穿越首爾600年。",
    intro:
      "從朝鮮王朝正宮景福宮出發，穿過北村韓屋村的巷弄，一路走到仁寺洞的街道。\n三處景點步行相連，宮殿建築、韓屋民居、傳統工藝依序展現，是初次到訪韓國最容易理解的路線。租借韓服可免景福宮門票，從宮殿開始拍照直接走向北村，動線十分自然。",
    stops: [
      { name: "景福宮 (Gyeongbokgung)", note: "守門將交接儀式與勤政殿。清晨時段人最少。" },
      { name: "北村韓屋村 (Bukchon)", note: "居民實際居住的韓屋社區。請遵守靜音區域指示牌。" },
      { name: "仁寺洞 (Insadong)", note: "匯集傳統工藝、茶飲與書法的老街。以Ssamziegil（仁寺洞人人商店街）作結最合適。" },
    ],
    transport: "地鐵3號線 大谷站 → 景福宮站 直達 · 無需轉乘",
    duration: "單程約27–29分鐘 / 停留約2小時30分",
    recommendedTime: "09:30 – 13:30",
    overview: {
      totalDuration: "約4小時",
      transport: "單程約27–29分鐘 · 無需轉乘",
      recommendedTime: "09:30 – 13:30",
      recommendedFor: "初次到訪韓國的旅客 · 想體驗韓服拍照的旅客",
    },
    timeline: [
      { spotName: "大谷站出發", note: "3號線景福宮方向乘車 · 無需轉乘。", transportToNext: "地鐵 27–29分鐘" },
      { spotName: "景福宮", duration: "約90分鐘", note: "10:00 守門將交接儀式 · 勤政殿 · 慶會樓。著韓服可免門票。", transportToNext: "步行 15分鐘" },
      { spotName: "北村韓屋村", duration: "約45分鐘", note: "居民實際居住的社區。請遵守靜音區域指示牌。", transportToNext: "步行 10分鐘" },
      { spotName: "仁寺洞", duration: "約50分鐘", note: "傳統工藝、茶飲與書法街。以Ssamziegil作結。", transportToNext: "地鐵 27–29分鐘" },
      { spotName: "抵達大谷站", note: "總移動約55分鐘 · 停留約3小時5分。" },
    ],
    whyGood: [
      "宮殿·韓屋·工藝步行可達，移動負擔極小。",
      "租借韓服可免景福宮門票，拍照動線更自然。",
      "大谷站至景福宮站3號線直達 · 無需轉乘。",
    ],
    access:
      "從高陽大谷站搭首爾地鐵3號線到景福宮站，用時27–29分鐘 · 無需轉乘。\n景福宮站5號出口最靠近光化門與景福宮。\n北村與仁寺洞路段全程步行，無需其他公共交通。",
    faq: [
      { q: "租借韓服真的可以免景福宮門票嗎？", a: "是的。身著韓服可免景福宮、昌德宮、德壽宮、昌慶宮及宗廟的門票。建議在參觀宮殿前先前往租借店。" },
      { q: "景福宮守門將交接儀式什麼時候可以看到？", a: "每日 10:00 和 14:00 各20分鐘（週二定休 · 雨天取消）。訪問前請在官方網站確認當日運營情況。" },
      { q: "北村韓屋村需要注意哪些禮儀？", a: "這裡是居民實際居住的社區。請遵守靜音區域指示牌，不要拍攝門內、窗內。" },
      { q: "仁寺洞在哪裡可以吃到韓食？", a: "Ssamziegil周邊的小巷聚集著傳統茶館、拌飯、麵疙瘩等餐館。午餐時間可能需要等位，建議提早前往。" },
    ],
    nearby: [
      { name: "仁寺洞 Ssamziegil", desc: "匯集傳統工藝、茶飲與書法的巷弄型商店街", distance: "步行3分鐘" },
      { name: "通仁市場", desc: "景福宮西側的巷弄市場 · 便當咖啡與老字號", distance: "步行10分鐘" },
      { name: "三清洞咖啡街", desc: "緊鄰北村的巷弄咖啡與甜點集中區", distance: "步行15分鐘" },
    ],
  },
};

const seoulNight: PerLocale = {
  en: {
    name: "Seoul at Night — Myeongdong, Namsan, N Seoul Tower",
    hook: "Seoul lights up after sunset — a single line from shopping streets to the observation deck.",
    intro:
      "Shop and eat in Myeongdong, then head up Namsan to look over the Seoul night skyline.\nThe course peaks after sunset. Myeongdong is packed with K-beauty stores and street food, and Namsan can be reached by cable car or the circular bus, keeping the physical load low.\nFor visitors who want to capture Seoul's whole panorama in one shot, this is the surest choice.",
    stops: [
      { name: "Myeongdong", note: "K-beauty and fashion stores plus evening street food. Many tax refund counters." },
      { name: "Namsan Cable Car", note: "Lines can be long — boarding an hour before sunset is recommended." },
      { name: "N Seoul Tower", note: "Observation deck and the padlock terrace. The 30 min just after sunset is the best window." },
    ],
    transport: "Line 3 Daegok Stn. → Chungmuro Stn. · direct (Myeongdong is walkable from there)",
    duration: "About 30–33 min one way / About 2 hr 30 min on site",
    recommendedTime: "17:00 – 21:00",
  },
  ja: {
    name: "夜のソウル — 明洞・南山・Nソウルタワー",
    hook: "日が沈むとソウルは灯る。ショッピング街から展望台まで一直線。",
    intro:
      "明洞（ミョンドン）で買い物と屋台料理を楽しんだ後、南山（ナムサン）に登ってソウルの夜景を見下ろすコースです。日中より夕方以降の完成度が高いです。\n明洞はKビューティ店や屋台が集まり、南山はケーブルカーまたは循環バスで上れるため、体力の負担は少なめです。\nソウルの全景を一度に収めたい方に最も確実な選択肢です。",
    stops: [
      { name: "明洞", note: "Kビューティ・ファッション店と夜の屋台。免税還付カウンターも多いです。" },
      { name: "南山ケーブルカー", note: "行列が長い場合があります。日没1時間前の乗車がおすすめ。" },
      { name: "Nソウルタワー", note: "展望台と南京錠テラス。夜景は日没直後30分が最も美しいです。" },
    ],
    transport: "地下鉄3号線 大谷駅 → 忠武路駅 直通・乗換なし（明洞まで徒歩圏）",
    duration: "片道 約30〜33分 / 滞在 約2時間30分",
    recommendedTime: "17:00 〜 21:00",
  },
  "zh-CN": {
    name: "首尔的夜 — 明洞·南山·N首尔塔",
    hook: "夕阳西下，首尔亮起。一条线串联起购物街与观景台。",
    intro:
      "在明洞享受购物与街头小吃，随后登上南山俯瞰首尔夜景。此路线的完成度在傍晚以后最高。\n明洞聚集K-beauty店铺与摊贩，南山可搭乘缆车或循环巴士上山，体力负担较小。\n希望一次收藏首尔全景的旅客，最稳妥的选择就是这条路线。",
    stops: [
      { name: "明洞", note: "K-beauty与时尚店铺，以及夜间街头小吃。退税柜台众多。" },
      { name: "南山缆车", note: "排队可能较久，建议日落前1小时搭乘。" },
      { name: "N首尔塔", note: "观景台与爱情锁露台。夜景以日落后30分钟最佳。" },
    ],
    transport: "地铁3号线 大谷站 → 忠武路站 直达 · 无需换乘（可步行至明洞）",
    duration: "单程约30–33分钟 / 停留约2小时30分",
    recommendedTime: "17:00 – 21:00",
  },
  "zh-TW": {
    name: "首爾的夜 — 明洞·南山·N首爾塔",
    hook: "夕陽西下，首爾亮起。一條線串聯起購物街與觀景台。",
    intro:
      "在明洞享受購物與街頭小吃，隨後登上南山俯瞰首爾夜景。此路線的完成度在傍晚以後最高。\n明洞聚集K-beauty店鋪與攤販，南山可搭乘纜車或循環巴士上山，體力負擔較小。\n希望一次收藏首爾全景的旅客，最穩妥的選擇就是這條路線。",
    stops: [
      { name: "明洞", note: "K-beauty與時尚店鋪，以及夜間街頭小吃。退稅櫃檯眾多。" },
      { name: "南山纜車", note: "排隊可能較久，建議日落前1小時搭乘。" },
      { name: "N首爾塔", note: "觀景台與愛情鎖露台。夜景以日落後30分鐘最佳。" },
    ],
    transport: "地鐵3號線 大谷站 → 忠武路站 直達 · 無需轉乘（可步行至明洞）",
    duration: "單程約30–33分鐘 / 停留約2小時30分",
    recommendedTime: "17:00 – 21:00",
  },
};

const seoulKYouth: PerLocale = {
  en: {
    name: "K-Youth — Hongdae, Yeonnam-dong, Gyeongui Line Forest Park",
    hook: "The youngest neighborhood in Seoul, reached from Ilsan without a single transfer.",
    intro:
      "Start in Hongdae's live music and busking scene, then walk along the Gyeongui Line Forest Park to Yeonnam-dong's café alleys.\nA single Gyeongui-Jungang ride from Goyang keeps the transit load to a minimum.\nCafés and small shops line the park path, so the route suits open-ended, walk-as-you-go travel. Street performances come alive in Hongdae after dark.",
    stops: [
      { name: "Hongdae Playground Street", note: "Weekend evenings bring the busiest busking." },
      { name: "Yeonnam-dong", note: "Independent cafés and small shops. The inner alleys are more rewarding." },
      { name: "Gyeongui Line Forest Park", note: "A former railway turned park. Runs from Hongik Univ. Stn. to Yeonnam-dong." },
    ],
    transport: "Gyeongui-Jungang Line Daegok Stn. → Hongik Univ. Stn. · direct, no transfer",
    duration: "About 21 min one way / About 2 hr 45 min on site",
    recommendedTime: "16:00 – 20:00",
  },
  ja: {
    name: "K-Youth — 弘大・延南洞・京義線林道",
    hook: "一山から乗換なしで着く、ソウルで一番若い街。",
    intro:
      "弘大（ホンデ）のバスキングとライブクラブ街から出発し、京義線林道（キョンウィソン スッキル）に沿って延南洞（ヨンナムドン）のカフェ路地へと歩くコースです。\n高陽から京義中央線一本で到達でき、移動の負担が最も少ないです。\n公園沿いにカフェや雑貨店が続くため、目的地を決めない散策旅行に向きます。夕方以降は弘大の路上ライブが本格化します。",
    stops: [
      { name: "弘大「歩きたい通り」", note: "週末夕方のバスキングが最も活発です。" },
      { name: "延南洞", note: "個人経営のカフェと雑貨店が密集。路地の奥がより面白いです。" },
      { name: "京義線林道", note: "廃線跡を公園化した道。弘大入口から延南洞まで続きます。" },
    ],
    transport: "京義中央線 大谷駅 → 弘大入口駅 直通・乗換なし",
    duration: "片道 約21分 / 滞在 約2時間45分",
    recommendedTime: "16:00 〜 20:00",
  },
  "zh-CN": {
    name: "K-Youth — 弘大·延南洞·京义线林道公园",
    hook: "从一山无需换乘就能抵达，首尔最年轻的街区。",
    intro:
      "从弘大（Hongdae）街头艺人与Live Club的街区出发，沿京义线林道公园走向延南洞的咖啡巷弄。\n从高阳搭京义中央线一趟直达，移动负担最低。\n公园沿线咖啡与小店延续不断，适合没有明确目的地的散步型旅行。傍晚以后弘大街头表演正式开始。",
    stops: [
      { name: "弘大「想走的街」", note: "周末傍晚街头艺人的表演最热闹。" },
      { name: "延南洞", note: "个人咖啡与选品店密集。往巷弄深处走更有趣。" },
      { name: "京义线林道公园", note: "由旧铁路改造的公园。从弘大入口一路通至延南洞。" },
    ],
    transport: "京义中央线 大谷站 → 弘大入口站 直达 · 无需换乘",
    duration: "单程约21分钟 / 停留约2小时45分",
    recommendedTime: "16:00 – 20:00",
  },
  "zh-TW": {
    name: "K-Youth — 弘大·延南洞·京義線林道公園",
    hook: "從一山無需轉乘就能抵達，首爾最年輕的街區。",
    intro:
      "從弘大（Hongdae）街頭藝人與Live Club的街區出發，沿京義線林道公園走向延南洞的咖啡巷弄。\n從高陽搭京義中央線一趟直達，移動負擔最低。\n公園沿線咖啡與小店延續不斷，適合沒有明確目的地的散步型旅行。傍晚以後弘大街頭表演正式開始。",
    stops: [
      { name: "弘大「想走的街」", note: "週末傍晚街頭藝人的表演最熱鬧。" },
      { name: "延南洞", note: "個人咖啡與選品店密集。往巷弄深處走更有趣。" },
      { name: "京義線林道公園", note: "由舊鐵路改造的公園。從弘大入口一路通至延南洞。" },
    ],
    transport: "京義中央線 大谷站 → 弘大入口站 直達 · 無需轉乘",
    duration: "單程約21分鐘 / 停留約2小時45分",
    recommendedTime: "16:00 – 20:00",
  },
};

const seoulFoodDesign: PerLocale = {
  en: {
    name: "K-Food & Design — Gwangjang Market, Cheonggyecheon, DDP",
    hook: "A day that begins with mung-bean pancakes in a century-old market and ends in futuristic architecture.",
    intro:
      "Fill up at Gwangjang Market on bindaetteok, yukhoe, and mayak gimbap, then walk the Cheonggyecheon stream to Dongdaemun Design Plaza.\nA traditional market and contemporary architecture stand within walking distance, so the contrast is sharp. DDP is best photographed once the evening illumination comes on.",
    stops: [
      { name: "Gwangjang Market", note: "The food alley is the point. Cards work but cash moves fastest at stalls." },
      { name: "Cheonggyecheon Stream", note: "A city-center waterway. Walk from Gwangjang Market toward DDP." },
      { name: "DDP (Dongdaemun Design Plaza)", note: "Designed by Zaha Hadid. Exhibitions, night lighting, and the LED rose garden." },
    ],
    transport: "Line 3 Daegok Stn. → Jongno 3(sam)-ga Stn. · direct (Gwangjang Market is walkable from there)",
    duration: "About 30–33 min one way / About 2 hr 20 min on site",
    recommendedTime: "16:00 – 20:00",
  },
  ja: {
    name: "K-Food & Design — 広蔵市場・清渓川・DDP",
    hook: "100年市場のピンデトクから始まり、未来型建築で締めくくる一日。",
    intro:
      "広蔵（クァンジャン）市場でピンデトク・ユッケ・麻薬キンパプでお腹を満たし、清渓川（チョンゲチョン）に沿って東大門デザインプラザ（DDP）へ向かうコースです。\n伝統市場と現代建築が徒歩圏で並び、コントラストが強いです。DDPは夜間ライトアップが点灯する時間帯が写真に最適です。",
    stops: [
      { name: "広蔵市場", note: "屋台通りが核心。カード・現金とも使えますが、屋台では現金が早いです。" },
      { name: "清渓川", note: "都心の水辺。広蔵市場からDDP方面へ歩きます。" },
      { name: "DDP（東大門デザインプラザ）", note: "ザハ・ハディド設計。展示・夜間照明・LEDバラ庭園。" },
    ],
    transport: "地下鉄3号線 大谷駅 → 鍾路3街駅 直通・乗換なし（広蔵市場まで徒歩圏）",
    duration: "片道 約30〜33分 / 滞在 約2時間20分",
    recommendedTime: "16:00 〜 20:00",
  },
  "zh-CN": {
    name: "K-Food & Design — 广藏市场·清溪川·DDP",
    hook: "从百年市场的绿豆煎饼开始，以未来风建筑收尾的一天。",
    intro:
      "在广藏市场吃饱绿豆煎饼、生牛肉与「麻药紫菜包饭」，接着沿清溪川步行到东大门设计广场（DDP）。\n传统市场与现代建筑步行可达，对比鲜明。DDP在夜间灯光亮起后拍照效果最好。",
    stops: [
      { name: "广藏市场", note: "美食巷弄是核心。刷卡与现金皆通，摊贩仍以现金最快。" },
      { name: "清溪川", note: "市中心的水道。从广藏市场朝DDP方向步行。" },
      { name: "DDP（东大门设计广场）", note: "由札哈·哈迪设计。展览、夜间灯光与LED玫瑰花园。" },
    ],
    transport: "地铁3号线 大谷站 → 钟路3街站 直达（可步行至广藏市场）",
    duration: "单程约30–33分钟 / 停留约2小时20分",
    recommendedTime: "16:00 – 20:00",
  },
  "zh-TW": {
    name: "K-Food & Design — 廣藏市場·清溪川·DDP",
    hook: "從百年市場的綠豆煎餅開始，以未來風建築收尾的一天。",
    intro:
      "在廣藏市場吃飽綠豆煎餅、生牛肉與「麻藥紫菜飯捲」，接著沿清溪川步行到東大門設計廣場（DDP）。\n傳統市場與現代建築步行可達，對比鮮明。DDP在夜間燈光亮起後拍照效果最好。",
    stops: [
      { name: "廣藏市場", note: "美食巷弄是核心。刷卡與現金皆通，攤販仍以現金最快。" },
      { name: "清溪川", note: "市中心的水道。從廣藏市場朝DDP方向步行。" },
      { name: "DDP（東大門設計廣場）", note: "由札哈·哈迪設計。展覽、夜間燈光與LED玫瑰花園。" },
    ],
    transport: "地鐵3號線 大谷站 → 鐘路3街站 直達（可步行至廣藏市場）",
    duration: "單程約30–33分鐘 / 停留約2小時20分",
    recommendedTime: "16:00 – 20:00",
  },
};

const seoulHip: PerLocale = {
  en: {
    name: "Hip Seoul — Seoul Forest, Seongsu-dong",
    hook: "Not a tourist spot — the neighborhood Seoul itself hangs out in.",
    intro:
      "Start at Seoul Forest, then walk through Seongsu-dong's café streets and pop-up stores.\nA former factory district reborn as cafés, concept shops, and brand pop-ups — this suits visitors who want present-day Seoul rather than a landmark tour. Pop-ups rotate constantly, so a quick check before visiting helps.",
    stops: [
      { name: "Seoul Forest", note: "A city park with a deer enclosure and a ginkgo path." },
      { name: "Seongsu-dong Café Street", note: "Large cafés converted from red-brick factories." },
      { name: "Seongsu Pop-up Zone", note: "Brand pop-ups run year-round. Weekends can involve a wait." },
    ],
    transport: "Line 3 Daegok Stn. → Euljiro 3(sam)-ga Stn. → Line 2 transfer → Seongsu Stn. (1 transfer)",
    duration: "About 45 min one way / About 2 hr 10 min on site",
    recommendedTime: "13:00 – 17:00",
    note: "* Travel time to verify — measured with transfer wait recommended.",
  },
  ja: {
    name: "Hip Seoul — ソウルの森・聖水洞",
    hook: "観光地ではなく、ソウルの人が遊ぶ街。",
    intro:
      "ソウルの森公園から出発し、聖水洞（ソンスドン）のカフェ通りやポップアップストアを巡るコースです。\nかつての工場地帯がカフェ・セレクトショップ・ブランドポップアップに生まれ変わったエリアで、観光名所よりも「今のソウル」を見たい方に向いています。ポップアップは常に入れ替わるため、訪問前の確認が必要です。",
    stops: [
      { name: "ソウルの森", note: "鹿の放飼場と銀杏並木がある都心公園。" },
      { name: "聖水洞カフェ通り", note: "赤レンガ工場を改装した大型カフェが集まります。" },
      { name: "聖水ポップアップエリア", note: "ブランドのポップアップが常時開催。週末は行列があります。" },
    ],
    transport: "地下鉄3号線 大谷駅 → 乙支路3街駅 → 2号線乗換 → 聖水駅（乗換1回）",
    duration: "片道 約45分前後 / 滞在 約2時間10分",
    recommendedTime: "13:00 〜 17:00",
    note: "※ 所要時間は要確認 — 乗換待ち込みの実測を推奨。",
  },
  "zh-CN": {
    name: "Hip Seoul — 首尔林·圣水洞",
    hook: "不是观光地，而是首尔人自己玩的街区。",
    intro:
      "从首尔林公园出发，穿梭圣水洞（Seongsu-dong）的咖啡街与快闪店。\n此区曾是工厂地带，如今转型为咖啡、选品店与品牌快闪，适合想看「现在的首尔」的旅客。快闪内容经常更换，出发前确认为佳。",
    stops: [
      { name: "首尔林", note: "拥有梅花鹿放养区与银杏树道的市中心公园。" },
      { name: "圣水洞咖啡街", note: "由红砖工厂改造的大型咖啡店群。" },
      { name: "圣水快闪区", note: "品牌快闪常态展开。周末可能需要排队。" },
    ],
    transport: "地铁3号线 大谷站 → 乙支路3街站 → 2号线换乘 → 圣水站（换乘1次）",
    duration: "单程约45分钟 / 停留约2小时10分",
    recommendedTime: "13:00 – 17:00",
    note: "※ 通行时间需再确认 — 建议包含换乘等待时间实测。",
  },
  "zh-TW": {
    name: "Hip Seoul — 首爾林·聖水洞",
    hook: "不是觀光地，而是首爾人自己玩的街區。",
    intro:
      "從首爾林公園出發，穿梭聖水洞（Seongsu-dong）的咖啡街與快閃店。\n此區曾是工廠地帶，如今轉型為咖啡、選品店與品牌快閃，適合想看「現在的首爾」的旅客。快閃內容經常更換，出發前確認為佳。",
    stops: [
      { name: "首爾林", note: "擁有梅花鹿放養區與銀杏樹道的市中心公園。" },
      { name: "聖水洞咖啡街", note: "由紅磚工廠改造的大型咖啡店群。" },
      { name: "聖水快閃區", note: "品牌快閃常態展開。週末可能需要排隊。" },
    ],
    transport: "地鐵3號線 大谷站 → 乙支路3街站 → 2號線轉乘 → 聖水站（轉乘1次）",
    duration: "單程約45分鐘 / 停留約2小時10分",
    recommendedTime: "13:00 – 17:00",
    note: "※ 通行時間需再確認 — 建議包含轉乘等待時間實測。",
  },
};

const seoulModern: PerLocale = {
  en: {
    name: "Modern Seoul — Bongeunsa, COEX, Starfield Library",
    hook: "A thousand-year temple sits across from Seoul's largest underground city.",
    intro:
      "The traditional Bongeunsa temple sits in the middle of downtown, and one street across it stands the COEX complex.\nThe stillness of a temple against a hyper-modern city, all within walking distance — that contrast is the point of this course. Starfield Library inside COEX is a 13-meter-tall bookshelf and has become a photo landmark. Because the whole loop is indoors, weather does not affect the visit.",
    stops: [
      { name: "Bongeunsa Temple", note: "A downtown temple famous for temple stay and lotus lanterns." },
      { name: "COEX Mall", note: "A vast underground complex with shopping, restaurants, and an aquarium." },
      { name: "Starfield Library", note: "A large open bookshelf. Free entry." },
    ],
    transport: "Line 3 Daegok Stn. → Express Bus Terminal Stn. → Line 9 transfer → Bongeunsa Stn. (1 transfer)",
    duration: "About 45–49 min + transfer / About 2 hr on site",
    recommendedTime: "13:00 – 17:00",
    note: "* Route to verify — Bongeunsa Stn. (Line 9) vs Samseong Stn. (Line 2) best-path check recommended.",
  },
  ja: {
    name: "Modern Seoul — 奉恩寺・COEX・星の光図書館",
    hook: "千年の寺の向かいに、ソウルで最も大きな地下都市がある。",
    intro:
      "都心にある伝統寺院・奉恩寺（ボンウンサ）から一本道を渡ると、COEX（コエックス）複合施設が現れます。\n寺の静けさと超現代都市が徒歩圏でぶつかる対比が、このコースの核心です。COEX内の「星の光図書館（Starfield Library）」は高さ13mの書架で写真スポットとなり、全区間が屋内のため天候の影響を受けません。",
    stops: [
      { name: "奉恩寺", note: "都心の寺院。テンプルステイと蓮灯りが有名。" },
      { name: "COEXモール", note: "ショッピング・レストラン・水族館を備える大型地下複合空間。" },
      { name: "星の光図書館 (Starfield Library)", note: "開放型大型書架。入場無料。" },
    ],
    transport: "地下鉄3号線 大谷駅 → 高速ターミナル駅 → 9号線乗換 → 奉恩寺駅（乗換1回）",
    duration: "片道 約45〜49分＋乗換 / 滞在 約2時間",
    recommendedTime: "13:00 〜 17:00",
    note: "※ 路線は要確認 — 奉恩寺駅（9号線）・三成駅（2号線）の実際の最適経路を確認推奨。",
  },
  "zh-CN": {
    name: "Modern Seoul — 奉恩寺·COEX·星光图书馆",
    hook: "千年古刹的对面，是首尔最大的地下城。",
    intro:
      "位于市中心的传统寺庙奉恩寺（Bongeunsa）与一街之隔的COEX综合体形成极大对比。\n寺庙的宁静与超现代都市在步行距离内相接，正是这条路线的核心。COEX内的星光图书馆（Starfield Library）拥有13米高的书架，成为热门拍摄地，全程室内，不受天气影响。",
    stops: [
      { name: "奉恩寺", note: "市中心的寺庙。以寺庙生活体验与莲花灯闻名。" },
      { name: "COEX Mall", note: "购物、餐厅与水族馆汇聚的大型地下复合空间。" },
      { name: "星光图书馆", note: "开放式大型书架。免费入场。" },
    ],
    transport: "地铁3号线 大谷站 → 高速巴士客运站站 → 9号线换乘 → 奉恩寺站（换乘1次）",
    duration: "单程约45–49分钟 + 换乘 / 停留约2小时",
    recommendedTime: "13:00 – 17:00",
    note: "※ 路线需再确认 — 建议核对奉恩寺站（9号线）与三成站（2号线）实际最优路径。",
  },
  "zh-TW": {
    name: "Modern Seoul — 奉恩寺·COEX·星光圖書館",
    hook: "千年古剎的對面，是首爾最大的地下城。",
    intro:
      "位於市中心的傳統寺廟奉恩寺（Bongeunsa）與一街之隔的COEX綜合體形成極大對比。\n寺廟的寧靜與超現代都市在步行距離內相接，正是這條路線的核心。COEX內的星光圖書館（Starfield Library）擁有13公尺高的書架，成為熱門拍攝地，全程室內，不受天氣影響。",
    stops: [
      { name: "奉恩寺", note: "市中心的寺廟。以寺廟生活體驗與蓮花燈聞名。" },
      { name: "COEX Mall", note: "購物、餐廳與水族館匯聚的大型地下複合空間。" },
      { name: "星光圖書館", note: "開放式大型書架。免費入場。" },
    ],
    transport: "地鐵3號線 大谷站 → 高速巴士客運站站 → 9號線轉乘 → 奉恩寺站（轉乘1次）",
    duration: "單程約45–49分鐘 + 轉乘 / 停留約2小時",
    recommendedTime: "13:00 – 17:00",
    note: "※ 路線需再確認 — 建議核對奉恩寺站（9號線）與三成站（2號線）實際最優路徑。",
  },
};

// ─── 파주 축 6개 번역 (오더 #D25-P) ────────────────────────────────────────

const pajuDmzPeace: PerLocale = {
  en: {
    name: "DMZ PEACE — Imjingak, Peace Nuri, Peace Gondola",
    hook: "Stay in Goyang. Visit the DMZ in Half a Day.",
    intro:
      "Start at Peace Nuri Park in Imjingak and cross the Civilian Control Line by the Peace Gondola toward Camp Greaves.\nThis is Paju's most irreplaceable experience — the Korean War, division, and the border still in effect are all understood in one place. The gondola ride crosses the Civilian Control Line, so a security declaration is required — carry your passport and leave time to spare.",
    stops: [
      { name: "Imjingak", note: "The Freedom Bridge and the Mangbaedan altar. The symbols of division gathered in one spot." },
      { name: "Peace Gondola", note: "Korea's first gondola across the Civilian Control Line. Security declaration and ID required." },
      { name: "Peace Nuri Park", note: "A pinwheel-covered hillside. A good stroll before or after the gondola." },
    ],
    transport:
      "Car — via Jayu-ro toward Munsan · about 45 min\nRail — Gyeongui-Jungang Line Daegok Stn. → Munsan Stn. (about 35 min) → transfer to Imjingang Stn. (+ about 8 min)",
    duration: "About 45 min one way / About 2–2.5 hr on site",
    recommendedTime: "09:00 – 13:00",
    note: "* To verify — check the Imjingang Stn. train schedule and gondola operating hours before visiting.",
  },
  ja: {
    name: "DMZ PEACE — 臨津閣・平和ヌリ・平和ゴンドラ",
    hook: "高陽に滞在しながら、半日でDMZを見る。",
    intro:
      "臨津閣（イムジンガク）平和ヌリから出発し、民間人統制区域を横切る平和ゴンドラに乗ってキャンプ・グリーブス方面へ渡るコースです。\n朝鮮戦争と分断、そして現在も続く境界を一か所で理解でき、坡州（パジュ）で最も代替不可能な体験です。\nゴンドラ乗車は民統線立ち入りに該当し、保安誓約手続きが必要です。パスポートを必ず持参し、時間に余裕を持って訪問してください。",
    stops: [
      { name: "臨津閣 (Imjingak)", note: "自由の橋と望拝壇。分断の象徴が集まる地点です。" },
      { name: "平和ゴンドラ", note: "民統線を横切る韓国初のゴンドラ。保安誓約と身分証必須。" },
      { name: "平和ヌリ公園", note: "丘の上の風車の丘。ゴンドラ前後の散策区間に最適です。" },
    ],
    transport:
      "車 — 自由路 文山（ムンサン）方面 約45分\n鉄道 — 京義中央線 大谷駅 → 文山駅（約35分）→ 臨津江駅 乗換（+約8分）",
    duration: "片道 約45分 / 滞在 約2〜2.5時間",
    recommendedTime: "09:00 〜 13:00",
    note: "※ 要確認 — 臨津江駅の運行本数・ゴンドラの運営時間は訪問前に公式案内をご確認ください。",
  },
  "zh-CN": {
    name: "DMZ PEACE — 临津阁·和平世界·和平缆车",
    hook: "在高阳过夜，半天时间看DMZ。",
    intro:
      "从临津阁（Imjingak）和平世界公园出发，搭乘横跨民间人统制区的和平缆车前往 Camp Greaves 方向。\n朝鲜战争、分断以及至今仍在的边界，都能在同一处理解，是坡州最不可替代的体验。\n缆车属于民统线进入范围，需办理安保申报，请务必携带护照并预留充裕时间。",
    stops: [
      { name: "临津阁 (Imjingak)", note: "自由桥与望拜坛。分断的象征汇集于此。" },
      { name: "和平缆车", note: "韩国首条横跨民统线的缆车。需办理安保申报并出示身份证件。" },
      { name: "和平世界公园", note: "山丘上的风车之丘。缆车前后适合散步。" },
    ],
    transport:
      "自驾 — 沿自由路往文山方向约45分钟\n铁路 — 京义中央线 大谷站 → 文山站（约35分钟）→ 换乘临津江站（+约8分钟）",
    duration: "单程约45分钟 / 停留约2–2.5小时",
    recommendedTime: "09:00 – 13:00",
    note: "※ 需再确认 — 临津江站班次与缆车运营时间请在出发前于官方公告确认。",
  },
  "zh-TW": {
    name: "DMZ PEACE — 臨津閣·和平世界·和平纜車",
    hook: "在高陽過夜，半天時間看DMZ。",
    intro:
      "從臨津閣（Imjingak）和平世界公園出發，搭乘橫跨民間人統制區的和平纜車前往 Camp Greaves 方向。\n朝鮮戰爭、分斷以及至今仍在的邊界，都能在同一處理解，是坡州最不可替代的體驗。\n纜車屬於民統線進入範圍，需辦理安保申報，請務必攜帶護照並預留充裕時間。",
    stops: [
      { name: "臨津閣 (Imjingak)", note: "自由橋與望拜壇。分斷的象徵匯集於此。" },
      { name: "和平纜車", note: "韓國首條橫跨民統線的纜車。需辦理安保申報並出示身分證件。" },
      { name: "和平世界公園", note: "山丘上的風車之丘。纜車前後適合散步。" },
    ],
    transport:
      "自駕 — 沿自由路往文山方向約45分鐘\n鐵路 — 京義中央線 大谷站 → 文山站（約35分鐘）→ 轉乘臨津江站（+約8分鐘）",
    duration: "單程約45分鐘 / 停留約2–2.5小時",
    recommendedTime: "09:00 – 13:00",
    note: "※ 需再確認 — 臨津江站班次與纜車運營時間請在出發前於官方公告確認。",
  },
};

const pajuBorderView: PerLocale = {
  en: {
    name: "BORDER VIEW — Odusan Unification Observatory, Heyri Art Village",
    hook: "Look toward the North, then 20 minutes later you arrive in an art village.",
    intro:
      "View the northern side from Odusan Unification Observatory, sitting where the Han and Imjin rivers meet, then drive about 20 minutes to Heyri Art Village.\nThe pivot from a divided Korea to an artistic Korea is the point of this course. The observatory closes early in the afternoon, so a morning-to-early-afternoon slot fits best.\nAfter DMZ, this is the next course to recommend to foreign VIP or MICE guests.",
    stops: [
      { name: "Odusan Unification Observatory", note: "The two-river confluence and views toward the North. Telescopes installed." },
      { name: "Heyri Art Village", note: "A settlement village of artists — galleries, museums, book houses, and cafés." },
    ],
    transport: "Car — via Jayu-ro toward Seongdong IC. About 25–30 min from Goyang.",
    duration: "About 25–30 min one way / About 2–2.5 hr on site",
    recommendedTime: "10:00 – 14:00",
    note: "* Hours — the observatory is generally 09:00–17:00. Verify before visiting.",
  },
  ja: {
    name: "BORDER VIEW — 烏頭山統一展望台・ヘイリ芸術村",
    hook: "北を眺めた20分後、芸術村に到着する。",
    intro:
      "漢江と臨津江が合流する地点にある烏頭山（オドゥサン）統一展望台から北朝鮮方面を眺望し、車で20分ほど移動してヘイリ芸術村へと渡るコースです。\n分断の韓国から芸術の韓国へと移り変わる転換が、このコースの核心です。展望台は午後遅くに閉館するため、午前〜早い午後の商品として組むのが適切です。\n外国人VIP・MICE参加者にはDMZの次に勧められます。",
    stops: [
      { name: "烏頭山統一展望台", note: "二つの川が合流する地形と北朝鮮方面の眺望。望遠鏡設置。" },
      { name: "ヘイリ芸術村", note: "ギャラリー・博物館・ブックハウス・カフェが混在する芸術家定住の村。" },
    ],
    transport: "車 — 自由路 城東IC方面。高陽基準で約25〜30分",
    duration: "片道 約25〜30分 / 滞在 約2〜2.5時間",
    recommendedTime: "10:00 〜 14:00",
    note: "※ 運営時間 — 展望台は概ね09:00〜17:00。訪問前にご確認ください。",
  },
  "zh-CN": {
    name: "BORDER VIEW — 乌头山统一展望台·坡州出版城艺术村",
    hook: "眺望朝鲜之后20分钟，抵达艺术村。",
    intro:
      "位于汉江与临津江交汇处的乌头山统一展望台可眺望朝鲜方向，车程约20分钟即可抵达坡州出版城艺术村（Heyri）。\n从「分断的韩国」到「艺术的韩国」的转换正是这条路线的核心。展望台在下午稍晚就闭馆，最适合安排为上午到早下午的行程。\n对外国VIP·MICE与会者，推荐指数仅次于DMZ路线。",
    stops: [
      { name: "乌头山统一展望台", note: "两江汇流的地形与朝鲜方向的眺望。设有望远镜。" },
      { name: "坡州出版城艺术村 (Heyri)", note: "艺术家聚居的村落。汇集画廊、博物馆、书屋与咖啡馆。" },
    ],
    transport: "自驾 — 沿自由路往城东IC方向。距高阳约25–30分钟。",
    duration: "单程约25–30分钟 / 停留约2–2.5小时",
    recommendedTime: "10:00 – 14:00",
    note: "※ 运营时间 — 展望台一般为09:00–17:00。请出发前确认。",
  },
  "zh-TW": {
    name: "BORDER VIEW — 烏頭山統一展望台·坡州出版城藝術村",
    hook: "眺望朝鮮之後20分鐘，抵達藝術村。",
    intro:
      "位於漢江與臨津江匯流處的烏頭山統一展望台可眺望朝鮮方向，車程約20分鐘即可抵達坡州出版城藝術村（Heyri）。\n從「分斷的韓國」到「藝術的韓國」的轉換正是這條路線的核心。展望台在下午稍晚就閉館，最適合安排為上午到早下午的行程。\n對外國VIP·MICE與會者，推薦指數僅次於DMZ路線。",
    stops: [
      { name: "烏頭山統一展望台", note: "兩江匯流的地形與朝鮮方向的眺望。設有望遠鏡。" },
      { name: "坡州出版城藝術村 (Heyri)", note: "藝術家聚居的村落。匯集畫廊、博物館、書屋與咖啡館。" },
    ],
    transport: "自駕 — 沿自由路往城東IC方向。距高陽約25–30分鐘。",
    duration: "單程約25–30分鐘 / 停留約2–2.5小時",
    recommendedTime: "10:00 – 14:00",
    note: "※ 營運時間 — 展望台一般為09:00–17:00。請出發前確認。",
  },
};

const pajuArtCafe: PerLocale = {
  en: {
    name: "ART & CAFÉ — Heyri Art Village, Provence Village",
    hook: "Start the day in the art village, end it in the village that lights up.",
    intro:
      "Look through galleries and architecture in Heyri, then move on to Provence Village.\nHeyri is not a shopping strip but a village where more than 300 artists actually live — studios, museums, and book cafés are mixed together, giving you plenty to talk about. Provence photographs best after the evening lights come on, so a late-afternoon start is better.\nA combination that lands well with younger travelers, couples, and families.",
    stops: [
      { name: "Heyri Art Village", note: "Most galleries open at 11:00. Many close on Mondays." },
      { name: "Provence Village", note: "A cluster of south-French-style shops and restaurants. Evening lighting is the point." },
    ],
    transport: "Car — via Jayu-ro toward Seongdong IC. About 25–30 min from Goyang (the two sites are adjacent).",
    duration: "About 25–30 min one way / About 2.5 hr on site",
    recommendedTime: "15:00 – 19:00",
  },
  ja: {
    name: "ART & CAFÉ — ヘイリ芸術村・プロヴァンス村",
    hook: "芸術村で一日を始め、灯りがともる村で締めくくる。",
    intro:
      "ヘイリでギャラリーと建築を巡った後、プロヴァンス村に移動するコースです。\nヘイリはショッピング街ではなく、300人余りのアーティストが実際に暮らす村で、アトリエ・博物館・ブックカフェが混在し、語れる要素が豊富です。プロヴァンスは夕方の照明がついた後に写真が最も映えるため、遅めの午後出発が有利です。\n若い旅行者・カップル・ファミリーに反応の良い組み合わせです。",
    stops: [
      { name: "ヘイリ芸術村", note: "ギャラリーの多くは午前11時開館、月曜休館が多いです。" },
      { name: "プロヴァンス村", note: "南仏風の店舗・レストランが集まる複合施設。夜間照明がポイント。" },
    ],
    transport: "車 — 自由路 城東IC方面。高陽基準で約25〜30分（両者は隣接）",
    duration: "片道 約25〜30分 / 滞在 約2.5時間",
    recommendedTime: "15:00 〜 19:00",
  },
  "zh-CN": {
    name: "ART & CAFÉ — 坡州出版城艺术村·普罗旺斯村",
    hook: "在艺术村开启一天，在灯火亮起的村庄收尾。",
    intro:
      "在艺术村欣赏画廊与建筑之后，移动至普罗旺斯村。\n此艺术村并非购物街，而是300多位艺术家实际居住的村庄，工作室、博物馆、书店咖啡交织，可谈之处极多。普罗旺斯村在傍晚亮灯后拍照效果最佳，因此建议下午稍晚出发。\n对年轻旅客、情侣与家庭反响良好。",
    stops: [
      { name: "坡州出版城艺术村 (Heyri)", note: "大多数画廊上午11点开馆，周一休馆居多。" },
      { name: "普罗旺斯村", note: "汇集南法风格商店与餐厅的复合园区。夜间灯光是重点。" },
    ],
    transport: "自驾 — 沿自由路往城东IC方向。距高阳约25–30分钟（两处相邻）",
    duration: "单程约25–30分钟 / 停留约2.5小时",
    recommendedTime: "15:00 – 19:00",
  },
  "zh-TW": {
    name: "ART & CAFÉ — 坡州出版城藝術村·普羅旺斯村",
    hook: "在藝術村開啟一天，在燈火亮起的村莊收尾。",
    intro:
      "在藝術村欣賞畫廊與建築之後，移動至普羅旺斯村。\n此藝術村並非購物街，而是300多位藝術家實際居住的村莊，工作室、博物館、書店咖啡交織，可談之處極多。普羅旺斯村在傍晚亮燈後拍照效果最佳，因此建議下午稍晚出發。\n對年輕旅客、情侶與家庭反響良好。",
    stops: [
      { name: "坡州出版城藝術村 (Heyri)", note: "大多數畫廊上午11點開館，週一休館居多。" },
      { name: "普羅旺斯村", note: "匯集南法風格商店與餐廳的複合園區。夜間燈光是重點。" },
    ],
    transport: "自駕 — 沿自由路往城東IC方向。距高陽約25–30分鐘（兩處相鄰）",
    duration: "單程約25–30分鐘 / 停留約2.5小時",
    recommendedTime: "15:00 – 19:00",
  },
};

const pajuKBookHangeul: PerLocale = {
  en: {
    name: "K-BOOK & HANGEUL — Paju Book City, Forest of Wisdom",
    hook: "A whole city made of publishing houses — rare, even in the world.",
    intro:
      "Walk Paju Book City, where publishers, printers, binderies, bookshops, and book cafés are gathered in a single complex, and finish at the Forest of Wisdom, a large open bookshelf.\nEach building was designed with intent, so this also works as an architecture trip. The Forest of Wisdom has appeared in many music videos and dramas.\nFor foreign visitors, explain it not as a \"library\" but as **K-BOOK · Hangeul · architecture · K-drama** — that combination communicates the value.",
    stops: [
      { name: "Paju Book City", note: "A publishing and printing complex that is also a collection of contemporary architecture. Open on weekdays." },
      { name: "Forest of Wisdom", note: "A large open bookshelf. Free entry — check quiet-zone signs when taking photos." },
      { name: "Movable-type and printing workshop", note: "Museums and workshops in the complex run hands-on programs (advance check required)." },
    ],
    transport: "Car — via Jayu-ro toward Munsan. About 15–20 min from Goyang.",
    duration: "About 15–20 min one way / About 2.5 hr on site",
    recommendedTime: "10:00 – 14:00 or 14:00 – 18:00",
  },
  ja: {
    name: "K-BOOK & HANGEUL — 坡州出版都市・知恵の森",
    hook: "都市全体が出版社でできている。世界的にも珍しい場所です。",
    intro:
      "出版社・印刷所・製本所・書店・ブックカフェが一つの団地に集まる坡州（パジュ）出版都市を歩き、大型開放書架「知恵の森」で締めくくるコースです。\n建物一つ一つが設計意図を持つ団地で、建築旅行としても成立します。知恵の森はミュージックビデオやドラマの撮影地として何度も紹介されている場所でもあります。\n外国人には「図書館」ではなく **K-BOOK・ハングル・建築・K-ドラマ** としてまとめて説明すると価値が伝わります。",
    stops: [
      { name: "坡州出版都市 (Paju Book City)", note: "出版・印刷団地であり現代建築の集合。平日も開放されています。" },
      { name: "知恵の森 (Forest of Wisdom)", note: "大型開放書架。閲覧無料、写真撮影時は静穏区域の表示をご確認ください。" },
      { name: "活字・印刷体験", note: "団地内の博物館・工房で体験プログラムを運営（事前確認要）。" },
    ],
    transport: "車 — 自由路 文山方面。高陽基準で約15〜20分",
    duration: "片道 約15〜20分 / 滞在 約2.5時間",
    recommendedTime: "10:00 〜 14:00 または 14:00 〜 18:00",
  },
  "zh-CN": {
    name: "K-BOOK & HANGEUL — 坡州出版城·智慧之林",
    hook: "一整座城市都由出版社构成。放眼世界也极为罕见。",
    intro:
      "在集出版社、印刷厂、装订厂、书店与书籍咖啡于一园的坡州出版城散步，并以大型开放式书架「智慧之林」收尾。\n每栋建筑都带有明确的设计意图，作为建筑之旅同样成立。智慧之林亦多次出现在音乐录影带与电视剧中。\n对外国旅客而言，不要以「图书馆」介绍，而应结合 **K-BOOK · 韩文 · 建筑 · 韩剧** 一并说明，方能传达价值。",
    stops: [
      { name: "坡州出版城 (Paju Book City)", note: "出版·印刷园区，同时是现代建筑的集合。工作日亦对外开放。" },
      { name: "智慧之林 (Forest of Wisdom)", note: "大型开放式书架。免费阅览，摄影时请注意静音区域标示。" },
      { name: "活字·印刷体验", note: "园区内的博物馆与工坊设有体验课程（须事前确认）。" },
    ],
    transport: "自驾 — 沿自由路往文山方向。距高阳约15–20分钟",
    duration: "单程约15–20分钟 / 停留约2.5小时",
    recommendedTime: "10:00 – 14:00 或 14:00 – 18:00",
  },
  "zh-TW": {
    name: "K-BOOK & HANGEUL — 坡州出版都市·智慧之林",
    hook: "整座城市都由出版社構成。放眼世界也極為罕見。",
    intro:
      "在集出版社、印刷廠、裝訂廠、書店與書籍咖啡於一園的坡州出版都市散步，並以大型開放式書架「智慧之林」收尾。\n每棟建築都帶有明確的設計意圖，作為建築之旅同樣成立。智慧之林亦多次出現在音樂錄影帶與電視劇中。\n對外國旅客而言，不要以「圖書館」介紹，而應結合 **K-BOOK · 韓文 · 建築 · 韓劇** 一併說明，方能傳達價值。",
    stops: [
      { name: "坡州出版都市 (Paju Book City)", note: "出版·印刷園區，同時是現代建築的集合。平日亦對外開放。" },
      { name: "智慧之林 (Forest of Wisdom)", note: "大型開放式書架。免費閱覽，攝影時請注意靜音區域標示。" },
      { name: "活字·印刷體驗", note: "園區內的博物館與工坊設有體驗課程（須事前確認）。" },
    ],
    transport: "自駕 — 沿自由路往文山方向。距高陽約15–20分鐘",
    duration: "單程約15–20分鐘 / 停留約2.5小時",
    recommendedTime: "10:00 – 14:00 或 14:00 – 18:00",
  },
};

const pajuLakeBridge: PerLocale = {
  en: {
    name: "LAKE & BRIDGE — Majang Lake Suspension Bridge",
    hook: "No mountain climb — walk across the water instead.",
    intro:
      "Cross the suspension bridge over Majang Lake and loop the lakeside walking trail.\nWith no climbing involved, this suits families and older travelers, and the view from the bridge photographs well. As the surest nature alternative to offer visitors less interested in the DMZ or modern history.",
    stops: [
      { name: "Majang Lake Suspension Bridge", note: "A suspension bridge across the lake. The sway is part of the appeal — kids love it." },
      { name: "Lakeside walking trail", note: "A single deck loop. A flat, easy course." },
      { name: "Lakeview café", note: "A finishing point after the walk." },
    ],
    transport: "Car only — about the 40-min range from Goyang.",
    duration: "About the 40-min range one way / About 2 hr on site",
    recommendedTime: "11:00 – 15:00",
    note: "Hours: Mar–Oct 09:00–18:00 / Nov–Feb 09:00–17:00\n* To verify — actual drive time from Goyang.",
  },
  ja: {
    name: "LAKE & BRIDGE — マジャン湖 吊り橋",
    hook: "山に登らず、湖の上を歩く。",
    intro:
      "湖を横切る吊り橋を渡り、湖畔の散策路を巡るコースです。\n登山の負担がなくファミリー・シニア層に向いており、橋上から見る湖の景色は写真にもよく残ります。DMZや近現代史への関心が薄い方に提示できる自然型の代替として最も確実な選択です。",
    stops: [
      { name: "マジャン湖 吊り橋", note: "湖を横切る吊り橋。揺れがあり、子どもに人気です。" },
      { name: "湖畔散策路", note: "デッキ道を一周。無理のない平坦なコースです。" },
      { name: "湖ビューカフェ", note: "散策後の締めくくり地点。" },
    ],
    transport: "車専用 — 高陽基準で40分台",
    duration: "片道 約40分台 / 滞在 約2時間",
    recommendedTime: "11:00 〜 15:00",
    note: "運営時間: 3〜10月 09:00〜18:00 / 11〜2月 09:00〜17:00\n※ 要確認 — 高陽出発の実走行時間。",
  },
  "zh-CN": {
    name: "LAKE & BRIDGE — 马场湖悬索桥",
    hook: "不必登山，直接走在湖面上。",
    intro:
      "跨越湖面的悬索桥，再绕行湖畔散步道一圈。\n没有登山负担，适合家庭与年长旅客，桥上俯瞰湖景也很上镜。作为对DMZ与近现代史兴趣较低的旅客的自然型替代方案，是最稳妥的选择。",
    stops: [
      { name: "马场湖悬索桥", note: "横跨湖面的悬索桥。桥面摇晃，孩子们特别喜欢。" },
      { name: "湖畔散步道", note: "木栈道一圈。平坦轻松的散步路线。" },
      { name: "湖景咖啡", note: "散步后的收尾之处。" },
    ],
    transport: "自驾 — 距高阳约40分钟出头",
    duration: "单程约40分钟出头 / 停留约2小时",
    recommendedTime: "11:00 – 15:00",
    note: "运营时间：3–10月 09:00–18:00 / 11–2月 09:00–17:00\n※ 需再确认 — 高阳出发的实际车程。",
  },
  "zh-TW": {
    name: "LAKE & BRIDGE — 馬場湖懸索橋",
    hook: "不必登山，直接走在湖面上。",
    intro:
      "跨越湖面的懸索橋，再繞行湖畔散步道一圈。\n沒有登山負擔，適合家庭與年長旅客，橋上俯瞰湖景也很上鏡。作為對DMZ與近現代史興趣較低的旅客的自然型替代方案，是最穩妥的選擇。",
    stops: [
      { name: "馬場湖懸索橋", note: "橫跨湖面的懸索橋。橋面搖晃，孩子們特別喜歡。" },
      { name: "湖畔散步道", note: "木棧道一圈。平坦輕鬆的散步路線。" },
      { name: "湖景咖啡", note: "散步後的收尾之處。" },
    ],
    transport: "自駕 — 距高陽約40分鐘出頭",
    duration: "單程約40分鐘出頭 / 停留約2小時",
    recommendedTime: "11:00 – 15:00",
    note: "營運時間：3–10月 09:00–18:00 / 11–2月 09:00–17:00\n※ 需再確認 — 高陽出發的實際車程。",
  },
};

const pajuKNature: PerLocale = {
  en: {
    name: "K-NATURE ADVENTURE — Gamaksan Suspension Bridge",
    hook: "150 meters above a ravine — the Korea the mountains give you.",
    intro:
      "Cross the Gamaksan suspension bridge and walk the forest path and stream up to a viewpoint.\nThis lands well with active European and North American travelers who want an outdoor day.\nBecause travel takes a large share of the four hours, run this **only as a car-only product**. Sending it out with public-transit guidance causes trouble on the ground.",
    stops: [
      { name: "Gamaksan Suspension Bridge", note: "A suspension bridge over a ravine. There is a bypass for anyone uneasy with heights." },
      { name: "Forest trail and stream", note: "A gentle walking section past the bridge." },
      { name: "Viewpoint", note: "Views over the northern Paju ridgelines." },
    ],
    transport: "Car only — about 1 hr from Goyang.",
    duration: "About 1 hr one way / About 2 hr on site",
    recommendedTime: "10:00 – 14:00",
    note: "* To verify — actual drive time from Goyang; winter closures if any.",
  },
  ja: {
    name: "K-NATURE ADVENTURE — 紺岳山（カムアクサン）吊り橋",
    hook: "渓谷の上150メートル、山が与える韓国。",
    intro:
      "紺岳山（カムアクサン）の吊り橋を渡り、森の道と渓谷を辿って眺望地点まで歩くコースです。\nアクティブな旅行を求めるヨーロッパ・北米の方に反応が良いです。\nただし4時間のうち移動比率が大きいため、**車専用商品**としてのみ運用する必要があります。公共交通案内で出すと現場で問題が生じます。",
    stops: [
      { name: "紺岳山 吊り橋", note: "渓谷を横切る吊り橋。高所恐怖症の方は迂回路を利用。" },
      { name: "森の道・渓谷", note: "橋の先に緩やかな散策区間。" },
      { name: "眺望地点", note: "坡州北部の稜線を望みます。" },
    ],
    transport: "車専用 — 高陽基準で約1時間前後",
    duration: "片道 約1時間 / 滞在 約2時間",
    recommendedTime: "10:00 〜 14:00",
    note: "※ 要確認 — 高陽出発の実走行時間、冬季通行止めの有無。",
  },
  "zh-CN": {
    name: "K-NATURE ADVENTURE — 绀岳山悬索桥",
    hook: "山谷之上150米，山所馈赠的韩国。",
    intro:
      "跨越绀岳山悬索桥，沿森林与溪谷步道走到观景点。\n对追求户外体验的欧美旅客反应良好。\n但4小时中移动比重较大，必须仅以**自驾专用产品**运营。用公共交通指南发送会在现场产生问题。",
    stops: [
      { name: "绀岳山悬索桥", note: "横跨溪谷的悬索桥。有高空恐惧者可走绕行路。" },
      { name: "森林步道·溪谷", note: "过桥后是缓坡的散步段。" },
      { name: "观景点", note: "眺望坡州北部的稜线。" },
    ],
    transport: "自驾 — 距高阳约1小时左右",
    duration: "单程约1小时 / 停留约2小时",
    recommendedTime: "10:00 – 14:00",
    note: "※ 需再确认 — 高阳出发的实际车程、冬季是否封闭。",
  },
  "zh-TW": {
    name: "K-NATURE ADVENTURE — 紺岳山懸索橋",
    hook: "山谷之上150公尺，山所饋贈的韓國。",
    intro:
      "跨越紺岳山懸索橋，沿森林與溪谷步道走到觀景點。\n對追求戶外體驗的歐美旅客反應良好。\n但4小時中移動比重較大，必須僅以**自駕專用產品**營運。用公共交通指南發送會在現場產生問題。",
    stops: [
      { name: "紺岳山懸索橋", note: "橫跨溪谷的懸索橋。有懼高症者可走繞行路。" },
      { name: "森林步道·溪谷", note: "過橋後是緩坡的散步段。" },
      { name: "觀景點", note: "眺望坡州北部的稜線。" },
    ],
    transport: "自駕 — 距高陽約1小時左右",
    duration: "單程約1小時 / 停留約2小時",
    recommendedTime: "10:00 – 14:00",
    note: "※ 需再確認 — 高陽出發的實際車程、冬季是否封閉。",
  },
};

// ─── 경기 축 5개 번역 (오더 #D25-G) ────────────────────────────────────────

const gyeonggiRoyalSuwon: PerLocale = {
  en: {
    name: "ROYAL SUWON 4H — Suwon Hwaseong Fortress, Hwaseong Haenggung, Haengridan-gil",
    hook: "Walk the fortress walls, pass through the palace, and end the evening in a lane behind it.",
    intro:
      "Walk the walls of Suwon Hwaseong Fortress (a UNESCO World Heritage site), tour Hwaseong Haenggung Palace, and drop down into the Haengridan-gil lanes right in front of the palace.\nThe royal retreat where the king once stayed and a young commercial street are linked on foot, so history and the present slot into a single route. In Gyeonggi Province, this is the one place that can be packaged with the same density as a Seoul 4-hour course.",
    stops: [
      { name: "Hwaseong Haenggung Palace", note: "King Jeongjo's temporary palace. Standing programs include a martial-arts demonstration." },
      { name: "Suwon Hwaseong Fortress", note: "A walking section along the fortress walls. The Hwaseong Train eases the physical load." },
      { name: "Haengridan-gil", note: "A café and restaurant lane in front of the palace. A good place to finish." },
    ],
    transport: "Car — about 54–57 km from Ilsan · about 54–58 min.",
    duration: "About 1 hr one way / About 2 hr on site",
    recommendedTime: "13:00 – 17:00",
    note: "Hours: Hwaseong Haenggung 09:00–18:00\nNight opening on Fri, Sat, Sun, and public holidays from May 1 to Nov 1.\n* Use the night opening — in the autumn season, a 15:00 departure can extend to a night visit.",
  },
  ja: {
    name: "ROYAL SUWON 4H — 水原華城・華城行宮・幸理団キル",
    hook: "城壁を歩き、行宮を過ぎ、路地で夕食を取る。",
    intro:
      "ユネスコ世界遺産・水原華城（スウォンファソン）の城壁を歩き、華城行宮を巡った後、行宮の前に広がる幸理団キル（ヘンリダンギル）の路地に降りるコースです。\n王が滞在した行宮と若い商店街が徒歩でつながり、歴史と現在が一つの動線に収まります。京畿圏でソウルの4時間コースと最も近い密度で商品化できる唯一の場所です。",
    stops: [
      { name: "華城行宮 (Haenggung)", note: "正祖が滞在した行宮。武芸披露などの常設プログラムがあります。" },
      { name: "水原華城 (Hwaseong)", note: "城壁道の徒歩区間。華城列車を利用すれば体力の負担が軽くなります。" },
      { name: "幸理団キル (Haengridan-gil)", note: "行宮前のカフェ・食堂路地。締めくくりに最適。" },
    ],
    transport: "車 — 一山基準で約54〜57km・約54〜58分",
    duration: "片道 約1時間 / 滞在 約2時間",
    recommendedTime: "13:00 〜 17:00",
    note: "運営時間: 華城行宮 09:00〜18:00\n5月1日〜11月1日のうち金・土・日・祝日は夜間開場あり\n※ 夜間開場の活用 — 秋シーズンは15:00出発で夜間観覧まで組み込めます。",
  },
  "zh-CN": {
    name: "ROYAL SUWON 4H — 水原华城·华城行宫·幸理团街",
    hook: "走城墙，穿行宫，最后在巷弄里用晚餐。",
    intro:
      "沿着联合国教科文组织世界遗产 — 水原华城（Suwon Hwaseong）的城墙散步，参观华城行宫，随后走进行宫前的幸理团街（Haengridan-gil）巷弄。\n国王曾驻跸的行宫与年轻的商圈徒步相连，历史与当下浓缩于同一动线。是京畿圈唯一能以接近首尔4小时路线的密度打包成产品的地方。",
    stops: [
      { name: "华城行宫 (Haenggung)", note: "正祖曾驻跸的行宫。设有武艺展示等常设节目。" },
      { name: "水原华城 (Hwaseong)", note: "沿城墙步行的区间。搭乘华城列车可减轻体力负担。" },
      { name: "幸理团街 (Haengridan-gil)", note: "行宫前的咖啡与餐饮巷弄，是收尾的好地方。" },
    ],
    transport: "自驾 — 距一山约54–57km · 约54–58分钟",
    duration: "单程约1小时 / 停留约2小时",
    recommendedTime: "13:00 – 17:00",
    note: "运营时间：华城行宫 09:00–18:00\n5月1日–11月1日期间，周五·六·日与法定假日开放夜间参观\n※ 善用夜间开放 — 秋季可安排15:00出发，衔接夜间游览。",
  },
  "zh-TW": {
    name: "ROYAL SUWON 4H — 水原華城·華城行宮·幸理團街",
    hook: "走城牆，穿行宮，最後在巷弄裡用晚餐。",
    intro:
      "沿著聯合國教科文組織世界遺產 — 水原華城（Suwon Hwaseong）的城牆散步，參觀華城行宮，隨後走進行宮前的幸理團街（Haengridan-gil）巷弄。\n國王曾駐蹕的行宮與年輕的商圈徒步相連，歷史與當下濃縮於同一動線。是京畿圈唯一能以接近首爾4小時路線的密度打包成產品的地方。",
    stops: [
      { name: "華城行宮 (Haenggung)", note: "正祖曾駐蹕的行宮。設有武藝展示等常設節目。" },
      { name: "水原華城 (Hwaseong)", note: "沿城牆步行的區間。搭乘華城列車可減輕體力負擔。" },
      { name: "幸理團街 (Haengridan-gil)", note: "行宮前的咖啡與餐飲巷弄，是收尾的好地方。" },
    ],
    transport: "自駕 — 距一山約54–57km · 約54–58分鐘",
    duration: "單程約1小時 / 停留約2小時",
    recommendedTime: "13:00 – 17:00",
    note: "營運時間：華城行宮 09:00–18:00\n5月1日–11月1日期間，週五·六·日與法定假日開放夜間參觀\n※ 善用夜間開放 — 秋季可安排15:00出發，銜接夜間遊覽。",
  },
};

const gyeonggiKoreanGarden: PerLocale = {
  en: {
    name: "KOREAN GARDEN ESCAPE 5H — Garden of Morning Calm",
    hook: "Instead of explaining what a Korean garden is, we show you.",
    intro:
      "Walk through an arboretum laid out in the Korean traditional garden style. The changing seasons themselves become the product — spring blossoms, autumn foliage, and winter illumination each show a different face.\nThe garden has been featured as a drama filming location, making it easy to introduce to Hallyu visitors and well-suited to guests who want nature without a hike.",
    stops: [
      { name: "Korean Garden", note: "The central section. The essence of the traditional landscape style is concentrated here." },
      { name: "Seasonal Gardens", note: "Spring blossoms · autumn foliage · the Lighting Festival of Five-Color Stars in winter." },
      { name: "Trails · Cafés", note: "Gentle slopes. The entire course is walkable." },
    ],
    transport: "Car — toward the Gapyeong area.",
    duration: "About 1 hr 20 min range one way / About 2–2.5 hr on site",
    recommendedTime: "11:00 – 16:00",
    note: "* To verify — actual drive time from Goyang; winter lighting festival operating dates.",
  },
  ja: {
    name: "KOREAN GARDEN ESCAPE 5H — 朝の静けさ樹木園",
    hook: "韓国式庭園とは何かを、説明ではなく実物で見せる。",
    intro:
      "韓国の伝統庭園様式で造成された樹木園を歩くコースです。季節の変化そのものが商品となる場所で、春の花・秋の紅葉・冬の照明シーズンごとに異なる表情を見せます。\nドラマ撮影地として何度も紹介されており、韓流ファンにも説明しやすく、山登りの負担なく自然を楽しみたい方に向いています。",
    stops: [
      { name: "韓国庭園", note: "樹木園の中心区域。伝統造園様式が集約されています。" },
      { name: "季節庭園", note: "春の花・秋の紅葉・冬の五色星の光庭園展。" },
      { name: "散策路・カフェ", note: "緩やかな傾斜。全区間徒歩可能です。" },
    ],
    transport: "車 — 加平（カピョン）方面",
    duration: "片道 約1時間20分台 / 滞在 約2〜2.5時間",
    recommendedTime: "11:00 〜 16:00",
    note: "※ 要確認 — 高陽出発の実走行時間、冬の照明フェスティバル運営期間。",
  },
  "zh-CN": {
    name: "KOREAN GARDEN ESCAPE 5H — 晨静树木园",
    hook: "什么是韩式庭园？无需解释，看实景。",
    intro:
      "在以韩国传统庭园式样打造的树木园中散步。四季变化本身就是这里的产品，春花、秋叶与冬季灯光季各呈现不同面貌。\n作为多部电视剧的取景地，向韩流旅客介绍时十分容易，也适合不想登山、只想亲近自然的旅客。",
    stops: [
      { name: "韩国庭园", note: "树木园的核心区域，集中呈现传统造景样式。" },
      { name: "季节庭园", note: "春花·秋叶·冬季「五色星光庭园展」。" },
      { name: "散步道·咖啡", note: "缓坡设计，全程可步行。" },
    ],
    transport: "自驾 — 往加平方向",
    duration: "单程约1小时20分钟上下 / 停留约2–2.5小时",
    recommendedTime: "11:00 – 16:00",
    note: "※ 需再确认 — 高阳出发的实际车程、冬季灯光节的运营期间。",
  },
  "zh-TW": {
    name: "KOREAN GARDEN ESCAPE 5H — 晨靜樹木園",
    hook: "什麼是韓式庭園？無需解釋，看實景。",
    intro:
      "在以韓國傳統庭園式樣打造的樹木園中散步。四季變化本身就是這裡的產品，春花、秋葉與冬季燈光季各呈現不同面貌。\n作為多部電視劇的取景地，向韓流旅客介紹時十分容易，也適合不想登山、只想親近自然的旅客。",
    stops: [
      { name: "韓國庭園", note: "樹木園的核心區域，集中呈現傳統造景樣式。" },
      { name: "季節庭園", note: "春花·秋葉·冬季「五色星光庭園展」。" },
      { name: "散步道·咖啡", note: "緩坡設計，全程可步行。" },
    ],
    transport: "自駕 — 往加平方向",
    duration: "單程約1小時20分鐘上下 / 停留約2–2.5小時",
    recommendedTime: "11:00 – 16:00",
    note: "※ 需再確認 — 高陽出發的實際車程、冬季燈光節的營運期間。",
  },
};

const gyeonggiLivingKorea: PerLocale = {
  en: {
    name: "LIVING KOREA 5–6H — Korean Folk Village",
    hook: "If Gyeongbokgung is the Korea of the kings, this is the Korea people actually lived in.",
    intro:
      "Hanok houses, traditional living spaces, farming scenery, folk performances, and food all gathered in one place.\n**The point of this course is that it does not overlap with the Seoul Gyeongbokgung route.** Where the palace shows the royal court, the Folk Village shows daily life. Selling the two courses on separate days makes them complement each other. Building the route around the performance schedule raises the finish.",
    stops: [
      { name: "Traditional Village", note: "Hanok houses from different regions rebuilt on the grounds — actual size." },
      { name: "Folk Performances", note: "Nongak farmers' music · tightrope walking · mounted martial arts. Match your route to the schedule." },
      { name: "Experiences · Traditional Food", note: "Workshop experiences and market food." },
    ],
    transport: "Car — toward the Yongin area.",
    duration: "About 1 hr one way / About 3–4 hr on site",
    recommendedTime: "10:00 – 16:00",
    note: "* To verify — actual drive time from Goyang; performance schedule (varies by season).",
  },
  ja: {
    name: "LIVING KOREA 5–6H — 韓国民俗村",
    hook: "景福宮が王の韓国なら、ここは人々が暮らした韓国です。",
    intro:
      "韓屋と伝統的な生活空間、農村風景、民俗公演と食が一つの場所に集まっています。\n**この商品の核心は、ソウルの景福宮コースと重ならない点です。** 宮殿が王室を見せるとすれば、民俗村は暮らしを見せます。二つのコースを二日に分けて販売すると相互補完になります。公演時間表に合わせて動線を組むと完成度が上がります。",
    stops: [
      { name: "伝統マウル (Traditional Village)", note: "地域別の韓屋を移築した区域。実物大です。" },
      { name: "民俗公演", note: "農楽（ノンアク）・綱渡り・馬上武芸。時間表確認後、動線を合わせてください。" },
      { name: "体験・伝統料理", note: "工房体験と市場料理。" },
    ],
    transport: "車 — 龍仁（ヨンイン）方面",
    duration: "片道 約1時間前後 / 滞在 約3〜4時間",
    recommendedTime: "10:00 〜 16:00",
    note: "※ 要確認 — 高陽出発の実走行時間、公演時間表（季節ごとに異なる）。",
  },
  "zh-CN": {
    name: "LIVING KOREA 5–6H — 韩国民俗村",
    hook: "景福宫是国王的韩国，这里是人们生活的韩国。",
    intro:
      "韩屋、传统生活空间、农村风景，以及民俗表演与美食全部汇聚一处。\n**这条路线的重点在于——不会与首尔的景福宫路线重复。** 宫殿呈现的是王室，民俗村呈现的是生活。将两条路线分两天销售，可形成相互补充。搭配表演时间表规划动线，完成度更高。",
    stops: [
      { name: "传统村庄", note: "按地区迁建的韩屋区域，实际尺寸。" },
      { name: "民俗表演", note: "农乐、走绳、马上武艺。请核对时间表后再规划动线。" },
      { name: "体验·传统美食", note: "工坊体验与市场美食。" },
    ],
    transport: "自驾 — 往龙仁方向",
    duration: "单程约1小时上下 / 停留约3–4小时",
    recommendedTime: "10:00 – 16:00",
    note: "※ 需再确认 — 高阳出发的实际车程、表演时间表（因季节而异）。",
  },
  "zh-TW": {
    name: "LIVING KOREA 5–6H — 韓國民俗村",
    hook: "景福宮是國王的韓國，這裡是人們生活的韓國。",
    intro:
      "韓屋、傳統生活空間、農村風景，以及民俗表演與美食全部匯聚一處。\n**這條路線的重點在於——不會與首爾的景福宮路線重複。** 宮殿呈現的是王室，民俗村呈現的是生活。將兩條路線分兩天銷售，可形成相互補充。搭配表演時間表規劃動線，完成度更高。",
    stops: [
      { name: "傳統村莊", note: "按地區遷建的韓屋區域，實際尺寸。" },
      { name: "民俗表演", note: "農樂、走繩、馬上武藝。請核對時間表後再規劃動線。" },
      { name: "體驗·傳統美食", note: "工坊體驗與市場美食。" },
    ],
    transport: "自駕 — 往龍仁方向",
    duration: "單程約1小時上下 / 停留約3–4小時",
    recommendedTime: "10:00 – 16:00",
    note: "※ 需再確認 — 高陽出發的實際車程、表演時間表（因季節而異）。",
  },
};

const gyeonggiNamiIsland: PerLocale = {
  en: {
    name: "NAMI ISLAND ESCAPE 6H — Nami Island",
    hook: "A five-minute boat ride to Korea's most famous tree-lined path.",
    intro:
      "Five minutes by boat from the Gapyeong dock. Metasequoia and ginkgo-lined paths and riverside walks make it excellent for photography, and long-standing use as a Hallyu filming location gives it very high recognition among foreign visitors. Open year-round.\n\n**Note — do not package this as a 4-hour product.** Round-trip driving alone approaches 3 hours, and parking, ticketing, and boarding waits add up. Six hours is the right length.",
    stops: [
      { name: "Gapyeong Dock", note: "1024 Bukhangangbyeon-ro, Gapyeong-eup, Gapyeong-gun, Gyeonggi-do. Board after purchasing tickets." },
      { name: "Metasequoia Path", note: "The island's signature image. It begins right after arrival." },
      { name: "Ginkgo Path · Riverside", note: "The autumn season is strongest." },
      { name: "Café on the island", note: "A finishing point before the return boat." },
    ],
    transport: "Car — about 91.8 km from Ilsan · about 1 hr 23 min + about 5 min by ferry.",
    duration: "About 1 hr 30 min one way / About 2.5–3 hr on site",
    recommendedTime: "09:30 – 15:30",
    note: '* Nami Island is administratively in Chuncheon, Gangwon Special Self-Governing Province, but tourist access is via the Gapyeong dock in Gyeonggi-do. Copy should state "via the Gapyeong dock."',
  },
  ja: {
    name: "NAMI ISLAND ESCAPE 6H — 南怡島",
    hook: "5分の船に乗れば、韓国で最も有名な並木道が現れる。",
    intro:
      "加平（カピョン）船着場から船で5分の島です。メタセコイアの並木道と銀杏並木、川辺の散策路が続いて写真映えし、韓流ロケ地として長く知られてきたため外国人の認知度が非常に高い場所です。通年営業。\n\n**注意 — 4時間商品にしてはいけません。** 車の移動だけで往復3時間近くかかり、駐車・チケット・乗船待ちが加わります。6時間が適切です。",
    stops: [
      { name: "加平船着場 (Gapyeong)", note: "京畿道加平郡加平邑北漢江邊路1024。チケット購入後乗船。" },
      { name: "メタセコイア並木道", note: "島の代表イメージ。入島直後すぐに続きます。" },
      { name: "銀杏並木・川辺", note: "秋シーズンが最も強いです。" },
      { name: "島内カフェ", note: "帰り船便の前の締めくくり地点。" },
    ],
    transport: "車 — 一山基準で約91.8km・約1時間23分 + 渡船 約5分",
    duration: "片道 約1時間30分 / 滞在 約2.5〜3時間",
    recommendedTime: "09:30 〜 15:30",
    note: '※ 南怡島は行政区域上、江原特別自治道春川市ですが、観光客の進入は京畿道加平船着場を経由します。案内文言には「加平船着場経由」と表記してください。',
  },
  "zh-CN": {
    name: "NAMI ISLAND ESCAPE 6H — 南怡岛",
    hook: "乘船5分钟，便见韩国最有名的林荫小径。",
    intro:
      "从加平（Gapyeong）码头搭船5分钟即达的岛屿。水杉林荫道、银杏道与江畔散步路适合摄影，作为韩流拍摄地知名度极高，深受外国游客欢迎。全年运营。\n\n**注意 — 不能作为4小时产品。** 光是自驾往返就接近3小时，再加上停车、售票与乘船等候，共需6小时才合适。",
    stops: [
      { name: "加平码头 (Gapyeong)", note: "京畿道加平郡加平邑北汉江边路1024。购票后登船。" },
      { name: "水杉林荫道", note: "岛屿的代表画面。入岛后即刻延伸。" },
      { name: "银杏道·江畔", note: "秋季最为出色。" },
      { name: "岛内咖啡", note: "返程船班前的收尾之处。" },
    ],
    transport: "自驾 — 距一山约91.8km · 约1小时23分 + 渡船约5分钟",
    duration: "单程约1小时30分 / 停留约2.5–3小时",
    recommendedTime: "09:30 – 15:30",
    note: '※ 南怡岛在行政区划上属江原特别自治道春川市，但游客进入需经京畿道加平码头。指南文案应标注「经加平码头」。',
  },
  "zh-TW": {
    name: "NAMI ISLAND ESCAPE 6H — 南怡島",
    hook: "搭船5分鐘，便見韓國最有名的林蔭小徑。",
    intro:
      "從加平（Gapyeong）碼頭搭船5分鐘即達的島嶼。水杉林蔭道、銀杏道與江畔散步路適合攝影，作為韓流拍攝地知名度極高，深受外國遊客歡迎。全年營運。\n\n**注意 — 不能作為4小時產品。** 光是自駕往返就接近3小時，再加上停車、售票與乘船等候，共需6小時才合適。",
    stops: [
      { name: "加平碼頭 (Gapyeong)", note: "京畿道加平郡加平邑北漢江邊路1024。購票後登船。" },
      { name: "水杉林蔭道", note: "島嶼的代表畫面。入島後即刻延伸。" },
      { name: "銀杏道·江畔", note: "秋季最為出色。" },
      { name: "島內咖啡", note: "返程船班前的收尾之處。" },
    ],
    transport: "自駕 — 距一山約91.8km · 約1小時23分 + 渡船約5分鐘",
    duration: "單程約1小時30分 / 停留約2.5–3小時",
    recommendedTime: "09:30 – 15:30",
    note: '※ 南怡島在行政區劃上屬江原特別自治道春川市，但遊客進入需經京畿道加平碼頭。指南文案應標註「經加平碼頭」。',
  },
};

const gyeonggiEverland: PerLocale = {
  en: {
    name: "EVERLAND FULL DAY 8H — Everland",
    hook: "Give up a whole day, and the whole day is done in one.",
    intro:
      "Korea's largest theme park, with a safari, Panda World, and major attractions.\nAmong the surest products for foreign families, students, and group visitors.\n\n**Note — never make this a 4-hour product.** Subtracting round-trip travel of 2 hours leaves only two, and you spend that time on entry and waiting. **Sell the 8-hour full-day pass only.** Cutting hours turns this from a product into a complaint.",
    stops: [
      { name: "Safari World", note: "Vehicle-based viewing. Mornings have shorter waits." },
      { name: "Panda World", note: "Indoor area. Weather does not affect it." },
      { name: "Attractions", note: "Check wait times on the app and route accordingly." },
      { name: "Seasonal Festivals", note: "Tulips · roses · Halloween · illuminations." },
    ],
    transport: "Car — about 68 km from Ilsan Stn. · about 1 hr 4 min.",
    duration: "About 1 hr one way / About 6 hr on site",
    recommendedTime: "09:00 – 17:00",
  },
  ja: {
    name: "EVERLAND FULL DAY 8H — エバーランド",
    hook: "一日を丸ごと使う代わりに、一日で終わる。",
    intro:
      "サファリとパンダワールド、大型アトラクションを備えた国内最大のテーマパークです。\n外国人ファミリー・学生・団体の反応が最も確実な商品です。\n\n**注意 — 絶対に4時間商品にしてはいけません。** 往復2時間を引くと二時間しか残らず、入場と待ち時間だけで終わってしまいます。**8時間終日券のみを販売してください。** 時間を削ると商品ではなく不満になります。",
    stops: [
      { name: "サファリワールド", note: "車両乗車観覧。午前中は待ち時間が短めです。" },
      { name: "パンダワールド", note: "屋内区域。天候の影響を受けません。" },
      { name: "アトラクション", note: "待ち時間はアプリで確認して動線を組んでください。" },
      { name: "シーズンフェスティバル", note: "チューリップ・バラ・ハロウィン・イルミネーション。" },
    ],
    transport: "車 — 一山駅基準で約68km・約1時間4分",
    duration: "片道 約1時間 / 滞在 約6時間",
    recommendedTime: "09:00 〜 17:00",
  },
  "zh-CN": {
    name: "EVERLAND FULL DAY 8H — 爱宝乐园",
    hook: "用一整天，一天就结束。",
    intro:
      "拥有野生动物园、熊猫世界及大型游乐设施的韩国最大主题公园。\n对外国家庭、学生与团体来说，是反响最稳定的产品。\n\n**注意 — 千万不要做成4小时产品。** 扣除往返2小时后仅剩2小时，只够排队入场。**仅销售8小时全日票**，缩短时间只会带来投诉而非产品。",
    stops: [
      { name: "野生动物园", note: "乘车观赏。上午排队较短。" },
      { name: "熊猫世界", note: "室内区域，不受天气影响。" },
      { name: "游乐设施", note: "请用App查询等待时间后再规划动线。" },
      { name: "季节庆典", note: "郁金香·玫瑰·万圣节·灯饰秀。" },
    ],
    transport: "自驾 — 距一山站约68km · 约1小时4分",
    duration: "单程约1小时 / 停留约6小时",
    recommendedTime: "09:00 – 17:00",
  },
  "zh-TW": {
    name: "EVERLAND FULL DAY 8H — 愛寶樂園",
    hook: "用一整天，一天就結束。",
    intro:
      "擁有野生動物園、熊貓世界及大型遊樂設施的韓國最大主題公園。\n對外國家庭、學生與團體來說，是反響最穩定的產品。\n\n**注意 — 千萬不要做成4小時產品。** 扣除往返2小時後僅剩2小時，只夠排隊入場。**僅販售8小時全日票**，縮短時間只會帶來投訴而非產品。",
    stops: [
      { name: "野生動物園", note: "乘車觀賞。上午排隊較短。" },
      { name: "熊貓世界", note: "室內區域，不受天氣影響。" },
      { name: "遊樂設施", note: "請用App查詢等待時間後再規劃動線。" },
      { name: "季節慶典", note: "鬱金香·玫瑰·萬聖節·燈飾秀。" },
    ],
    transport: "自駕 — 距一山站約68km · 約1小時4分",
    duration: "單程約1小時 / 停留約6小時",
    recommendedTime: "09:00 – 17:00",
  },
};

/** id → 로케일별 번역. 17/17 코스 완료 (D25-S · D25-P · D25-G). */
export const dayTripTranslations: Record<string, PerLocale> = {
  "seoul-royal": seoulRoyal,
  "seoul-night": seoulNight,
  "seoul-k-youth": seoulKYouth,
  "seoul-food-design": seoulFoodDesign,
  "seoul-hip": seoulHip,
  "seoul-modern": seoulModern,
  "paju-dmz-peace": pajuDmzPeace,
  "paju-border-view": pajuBorderView,
  "paju-art-cafe": pajuArtCafe,
  "paju-k-book-hangeul": pajuKBookHangeul,
  "paju-lake-bridge": pajuLakeBridge,
  "paju-k-nature": pajuKNature,
  "gyeonggi-royal-suwon": gyeonggiRoyalSuwon,
  "gyeonggi-korean-garden": gyeonggiKoreanGarden,
  "gyeonggi-living-korea": gyeonggiLivingKorea,
  "gyeonggi-nami-island": gyeonggiNamiIsland,
  "gyeonggi-everland": gyeonggiEverland,
};

/** 로케일 값 스왑 · 미보유 필드는 ko 원문 폴백. */
export function getLocalizedDayTripCourse(
  course: DayTripCourse,
  locale: string
): DayTripCourse {
  if (locale === "ko") return course;
  if (!["en", "ja", "zh-CN", "zh-TW"].includes(locale)) return course;
  const tr = dayTripTranslations[course.id]?.[locale as DayTripI18nLocale];
  if (!tr) return course;

  const localizedOverview = course.overview
    ? {
        totalDuration: tr.overview?.totalDuration ?? course.overview.totalDuration,
        transport: tr.overview?.transport ?? course.overview.transport,
        recommendedTime: tr.overview?.recommendedTime ?? course.overview.recommendedTime,
        recommendedFor: tr.overview?.recommendedFor ?? course.overview.recommendedFor,
      }
    : course.overview;

  return {
    ...course,
    name: tr.name ?? course.name,
    hook: tr.hook ?? course.hook,
    hookLine: tr.hookLine ?? course.hookLine,
    intro: tr.intro ?? course.intro,
    transport: tr.transport ?? course.transport,
    duration: tr.duration ?? course.duration,
    recommendedTime: tr.recommendedTime ?? course.recommendedTime,
    note: tr.note ?? course.note,
    access: tr.access ?? course.access,
    overview: localizedOverview,
    stops: course.stops.map((s, i) => ({
      name: tr.stops?.[i]?.name ?? s.name,
      note: tr.stops?.[i]?.note ?? s.note,
    })),
    timeline: course.timeline?.map((n, i) => ({
      ...n,
      spotName: tr.timeline?.[i]?.spotName ?? n.spotName,
      note: tr.timeline?.[i]?.note ?? n.note,
      duration: tr.timeline?.[i]?.duration ?? n.duration,
      transportToNext: tr.timeline?.[i]?.transportToNext ?? n.transportToNext,
    })),
    whyGood: course.whyGood?.map((w, i) => tr.whyGood?.[i] ?? w),
    faq: course.faq?.map((f, i) => ({
      q: tr.faq?.[i]?.q ?? f.q,
      a: tr.faq?.[i]?.a ?? f.a,
    })),
    nearby: course.nearby?.map((n, i) => ({
      ...n,
      name: tr.nearby?.[i]?.name ?? n.name,
      desc: tr.nearby?.[i]?.desc ?? n.desc,
      distance: tr.nearby?.[i]?.distance ?? n.distance,
    })),
  };
}

/** 여러 코스에 일괄 적용. */
export function getLocalizedDayTripCourses(
  courses: DayTripCourse[],
  locale: string
): DayTripCourse[] {
  return courses.map((c) => getLocalizedDayTripCourse(c, locale));
}
