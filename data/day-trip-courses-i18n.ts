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

/** id → 로케일별 번역. 파주 6 · 경기 5 는 후속 오더에서 확장. */
export const dayTripTranslations: Record<string, PerLocale> = {
  "seoul-royal": seoulRoyal,
  "seoul-night": seoulNight,
  "seoul-k-youth": seoulKYouth,
  "seoul-food-design": seoulFoodDesign,
  "seoul-hip": seoulHip,
  "seoul-modern": seoulModern,
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
