// data/history-stories.ts
// 오더 #E2 [2]: GOYANG IN 10 STORIES — /best/history 상단에 배치.
//   goyang-history-10-stories.md 원문 그대로. 임의 수정·의역 없음.
//
// 렌더 규칙:
//   · open: null → 챕터 자체 미렌더 (오더 [5]).
//   · 연도 확인필요 항목은 eyebrow 와 본문에서 연도를 뺀다:
//       03: eyebrow "JOSEON" (md 지시), 본문에서 1413 없음.
//       05·06·08·09: 렌더 안 하므로 무관.
//       10: eyebrow "TODAY", 본문에서 연도 없음.

import type { SpotStoryChapter, SpotStoriesHeader } from "@/data/spots";

export const historyHeader: SpotStoriesHeader = {
  title: {
    ko: "서울 옆 도시가 아니라, 길 위의 도시였습니다",
    en: "Not a City Beside Seoul. A City on the Road.",
    ja: "ソウルの隣の街ではなく、道の上の街でした",
    "zh-CN": "并非首尔旁的城市，而是路上的城市",
    "zh-TW": "並非首爾旁的城市，而是路上的城市",
  },
  lead: {
    ko: "5천 년 전 이곳에서 사람들이 벼를 길렀습니다. 왕과 왕비가 이곳에 묻혔습니다. 사신들이 이곳을 지나 국경을 넘었습니다. 전쟁의 방향이 이곳에서 바뀌었습니다. 기차가 이곳에서 북쪽으로 떠났습니다. 지금은 전시와 K컬처를 보러 세계가 옵니다.",
    en: "Five thousand years ago people grew rice here. Kings and queens were buried here. Envoys passed through on their way to the border. The course of a war turned here. Trains departed north from here. Today the world arrives for exhibitions and K-culture.",
    ja: "五千年前、ここで人々が稲を育てました。王と王妃がここに葬られました。使節がここを通って国境を越えました。戦争の流れがここで変わりました。汽車がここから北へ発ちました。今は展示とKカルチャーを見に世界が訪れます。",
    "zh-CN": "五千年前，人们在此种稻。国王与王后长眠于此。使节由此出境北行。战争的走向在此逆转。列车自此驶向北方。如今，世界为展会与韩流文化而来。",
    "zh-TW": "五千年前，人們在此種稻。國王與王后長眠於此。使節由此出境北行。戰爭的走向在此逆轉。列車自此駛向北方。如今，世界為展會與韓流文化而來。",
  },
};

export const historyOutro = {
  ko: "쌀에서 왕릉으로, 전쟁에서 K컬처로.",
  en: "From rice to royal tombs. From battle to K-culture.",
  ja: "米から王陵へ。戦から Kカルチャーへ。",
  "zh-CN": "从稻米到王陵，从战场到韩流文化。",
  "zh-TW": "從稻米到王陵，從戰場到韓流文化。",
};

export const historyStories: SpotStoryChapter[] = [
  {
    eyebrow: "5,020 YEARS AGO",
    theme: { ko: "쌀", en: "RICE", ja: "米", "zh-CN": "稻米", "zh-TW": "稻米" },
    title: {
      ko: "궁궐보다 먼저, 벼가 있었습니다",
      en: "Before Palaces, There Was Rice",
      ja: "宮殿より先に、稲がありました",
      "zh-CN": "早于宫殿，先有稻米",
      "zh-TW": "早於宮殿，先有稻米",
    },
    site: {
      ko: "고양가와지볍씨박물관",
      en: "Goyang Gawaji Rice Museum",
      ja: "高陽ガワジ籾博物館",
      "zh-CN": "高阳加瓦地稻种博物馆",
      "zh-TW": "高陽加瓦地稻種博物館",
    },
    open: true,
    body: {
      ko: "1991년 일산신도시를 개발하던 중 대화동 가와지마을에서 볍씨 열두 톨이 나왔습니다. 미국의 연구소에 보내 연대를 측정한 결과 5,020년 전 것으로 나왔고, 야생벼가 아니라 사람이 심어 거둔 재배벼로 확인됐습니다. 한반도에서 확인된 가장 오래된 재배 볍씨입니다. 그전까지는 벼농사의 시작을 청동기시대로 보았는데, 이 발견으로 신석기시대까지 거슬러 올라갔습니다.",
      en: "In 1991, during construction of Ilsan New Town, twelve grains of rice were found in the Gawaji hamlet of Daehwa-dong. Dating carried out at a laboratory in the United States placed them at 5,020 years old, and analysis confirmed they were cultivated rice — sown and harvested by people, not wild. They are the oldest cultivated rice grains confirmed on the Korean peninsula. Until then rice farming had been thought to begin in the Bronze Age; this find pushed it back into the Neolithic.",
      ja: "1991年、一山新都市の開発中に大化洞のガワジ村で籾十二粒が出土しました。アメリカの研究所で年代測定を行った結果5,020年前のものと判明し、野生稲ではなく人が植えて収穫した栽培稲であることが確認されました。朝鮮半島で確認された最古の栽培籾です。それまで稲作の始まりは青銅器時代とされていましたが、この発見で新石器時代まで遡りました。",
      "zh-CN": "1991年，一山新城开发过程中，于大化洞加瓦地村出土稻种十二粒。经送往美国实验室测定，年代为距今5,020年，且确认为人工播种收获的栽培稻而非野生稻，是朝鲜半岛已确认最古老的栽培稻种。此前稻作起源被认为始于青铜器时代，这一发现将其上推至新石器时代。",
      "zh-TW": "1991年，一山新城開發過程中，於大化洞加瓦地村出土稻種十二粒。經送往美國實驗室測定，年代為距今5,020年，且確認為人工播種收穫的栽培稻而非野生稻，是朝鮮半島已確認最古老的栽培稻種。此前稻作起源被認為始於青銅器時代，這一發現將其上推至新石器時代。",
    },
  },
  {
    eyebrow: "THREE KINGDOMS",
    theme: { ko: "강", en: "THE RIVER", ja: "川", "zh-CN": "江河", "zh-TW": "江河" },
    title: {
      ko: "모든 나라가 갖고 싶어 한 땅",
      en: "The Land Every Kingdom Wanted",
      ja: "すべての国が欲しがった土地",
      "zh-CN": "各国都想据有的土地",
      "zh-TW": "各國都想據有的土地",
    },
    site: {
      ko: "행주산성 일대",
      en: "Around Haengju Fortress",
      ja: "幸州山城一帯",
      "zh-CN": "幸州山城一带",
      "zh-TW": "幸州山城一帶",
    },
    open: true,
    body: {
      ko: "이 지역은 한강 하류에 접해 있습니다. 강을 쥐면 물자와 사람의 이동을 쥐게 되므로, 삼국시대에 백제와 고구려와 신라가 차례로 이곳을 두고 다투었습니다. 행주산성이 임진왜란만의 장소가 아닌 이유입니다. 그전부터 이미 오래 지켜야 했던 자리였습니다.",
      en: "This area sits on the lower Han River. To hold the river was to hold the movement of goods and people, and through the Three Kingdoms period Baekje, Goguryeo and Silla each contested it in turn. That is why Haengju Fortress is not only a site of the Imjin War — it had already been a place worth defending for a long time.",
      ja: "この地域は漢江下流に接しています。川を握れば物資と人の移動を握ることになるため、三国時代に百済·高句麗·新羅が順に この地を巡って争いました。幸州山城が壬辰倭乱だけの場所ではない理由です。それ以前からすでに長く守るべき場所でした。",
      "zh-CN": "此地临汉江下游。掌握江河即掌握物资与人员流动，故三国时期百济、高句丽、新罗曾先后争夺此地。这正是幸州山城不只属于壬辰倭乱的原因——在此之前，它早已是需长久固守之地。",
      "zh-TW": "此地臨漢江下游。掌握江河即掌握物資與人員流動，故三國時期百濟、高句麗、新羅曾先後爭奪此地。這正是幸州山城不只屬於壬辰倭亂的原因——在此之前，它早已是需長久固守之地。",
    },
  },
  {
    // md 지시: 1413 미확인 → eyebrow 를 "JOSEON" 으로 대체.
    eyebrow: "JOSEON",
    theme: { ko: "이름", en: "THE NAME", ja: "名前", "zh-CN": "名称", "zh-TW": "名稱" },
    title: {
      ko: "두 이름이 하나가 되었습니다",
      en: "Two Names Became One",
      ja: "二つの名が一つになりました",
      "zh-CN": "两个名字合而为一",
      "zh-TW": "兩個名字合而為一",
    },
    site: {
      ko: "고양 전역",
      en: "All of Goyang",
      ja: "高陽全域",
      "zh-CN": "高阳全域",
      "zh-TW": "高陽全域",
    },
    open: true,
    body: {
      ko: "고봉의 「고(高)」와 덕양의 「양(陽)」을 합쳐 고양이라는 이름이 만들어졌습니다. 이 이름은 그 뒤로 계속 쓰였습니다. 중간에 한 차례 이름을 잃었다가 되찾은 일도 있습니다. 1504년 연산군 때 이 지역이 양주에 편입되면서 고양군이 사라졌고, 1506년 중종이 즉위하자 다시 고양군으로 돌아왔습니다.",
      en: "The name Goyang was formed by joining \"Go\" from Gobong and \"Yang\" from Deogyang. It has been in use ever since — though it was once lost and recovered. In 1504, under King Yeonsangun, the area was absorbed into Yangju and Goyang-gun ceased to exist; when King Jungjong took the throne in 1506, it was restored.",
      ja: "高峰の「高」と徳陽の「陽」を合わせて高陽という名がつくられました。この名はその後も使われ続けました。途中で一度名を失い、取り戻したこともあります。1504年、燕山君の時代にこの地域が楊州に編入されて高陽郡が消え、1506年に中宗が即位すると再び高陽郡に戻りました。",
      "zh-CN": "取高峰之「高」与德阳之「阳」，合成高阳之名，此后沿用至今。其间曾一度失名又复得：1504年燕山君时期，此地并入杨州，高阳郡消失；1506年中宗即位后恢复。",
      "zh-TW": "取高峰之「高」與德陽之「陽」，合成高陽之名，此後沿用至今。其間曾一度失名又復得：1504年燕山君時期，此地併入楊州，高陽郡消失；1506年中宗即位後恢復。",
    },
  },
  {
    eyebrow: "15TH–19TH CENTURY",
    theme: { ko: "마지막 자리", en: "THE LAST PLACE", ja: "最後の場所", "zh-CN": "最后的归处", "zh-TW": "最後的歸處" },
    title: {
      ko: "서울은 그들이 산 곳, 고양은 그들이 잠든 곳",
      en: "Seoul Is Where They Lived. Goyang Is Where They Rest.",
      ja: "ソウルは彼らが生きた場所、高陽は彼らが眠る場所",
      "zh-CN": "首尔是他们生活之地，高阳是他们长眠之处",
      "zh-TW": "首爾是他們生活之地，高陽是他們長眠之處",
    },
    site: {
      ko: "서오릉 · 서삼릉",
      en: "Seooreung · Seosamneung",
      ja: "西五陵 · 西三陵",
      "zh-CN": "西五陵 · 西三陵",
      "zh-TW": "西五陵 · 西三陵",
    },
    open: true,
    body: {
      ko: "조선 왕실의 능 여덟 기와 여러 원·묘가 이 도시에 있습니다. 숙종과 인현왕후, 희빈 장씨, 예종, 철종과 철인왕후, 인수대비가 모두 여기 잠들어 있습니다. 궁궐에서 그들이 어떻게 살았는지 보았다면, 이곳에서는 그 이야기가 어떻게 끝났는지 보게 됩니다. 유네스코 세계유산 조선왕릉에 포함됩니다.",
      en: "Eight royal tombs of the Joseon dynasty, along with several princely graves, lie in this city. Sukjong and Queen Inhyeon, Jang Hui-bin, Yejong, Cheoljong and Queen Cheorin, Queen Insoo — all rest here. If the palaces show how they lived, this is where you see how their stories ended. Both sites are part of the UNESCO-listed Royal Tombs of the Joseon Dynasty.",
      ja: "朝鮮王室の陵八基と複数の園·墓がこの都市にあります。粛宗と仁顕王后、禧嬪張氏、睿宗、哲宗と哲仁王后、仁粋大妃がみなここに眠っています。宮殿で彼らがどう生きたかを見たなら、ここではその物語がどう終わったかを見ることになります。ユネスコ世界遺産の朝鮮王陵に含まれます。",
      "zh-CN": "朝鲜王室八座王陵与多处园墓坐落于此城。肃宗与仁显王后、禧嫔张氏、睿宗、哲宗与哲仁王后、仁粹大妃皆长眠于此。若说宫殿呈现他们如何生活，此地则呈现故事如何终结。两处均属联合国教科文组织世界遗产朝鲜王陵。",
      "zh-TW": "朝鮮王室八座王陵與多處園墓坐落於此城。肅宗與仁顯王后、禧嬪張氏、睿宗、哲宗與哲仁王后、仁粹大妃皆長眠於此。若說宮殿呈現他們如何生活，此地則呈現故事如何終結。兩處均屬聯合國教科文組織世界遺產朝鮮王陵。",
    },
  },
  // 05·06·08·09 는 open:확인필요 → null, 렌더 X. 데이터는 저장.
  {
    eyebrow: "JOSEON",
    theme: { ko: "국경으로 가는 길", en: "THE ROAD TO THE BORDER", ja: "国境へ向かう道", "zh-CN": "通往边境之路", "zh-TW": "通往邊境之路" },
    title: {
      ko: "조선의 국제 영빈관",
      en: "Joseon's Guest House for Envoys",
      ja: "朝鮮の国際迎賓館",
      "zh-CN": "朝鲜的国际迎宾馆",
      "zh-TW": "朝鮮的國際迎賓館",
    },
    site: {
      ko: "벽제관지",
      en: "Byeokjegwan Site",
      ja: "碧蹄館址",
      "zh-CN": "碧蹄馆址",
      "zh-TW": "碧蹄館址",
    },
    open: null,
    body: {
      ko: "한양에서 의주로 이어지는 길목에 벽제관이 있었습니다. 중국에서 온 사신은 한양에 들어가기 전 이곳에서 하룻밤을 묵었고, 중국으로 떠나는 조선 사신도 여기서 쉬어 갔습니다. 지금은 터만 남아 있습니다. 오백 년 전 이 도시는 이미 외국 손님을 맞는 자리였습니다.",
      en: "Byeokjegwan stood on the road running from Hanyang to Uiju. Envoys arriving from China spent a night here before entering the capital, and Joseon's own envoys rested here on their way out. Only the site remains today. Five hundred years ago this city was already a place that received foreign guests.",
      ja: "漢陽から義州へ続く道筋に碧蹄館がありました。中国から来た使節は漢陽に入る前にここで一晩を過ごし、中国へ向かう朝鮮の使節もここで休んでいきました。今は跡地だけが残っています。五百年前、この都市はすでに外国からの客を迎える場所でした。",
      "zh-CN": "碧蹄馆位于自汉阳通往义州的路上。自中国而来的使节入京前在此过夜，前往中国的朝鲜使节亦在此歇息。如今仅存遗址。五百年前，这座城市已是迎接外宾之处。",
      "zh-TW": "碧蹄館位於自漢陽通往義州的路上。自中國而來的使節入京前在此過夜，前往中國的朝鮮使節亦在此歇息。如今僅存遺址。五百年前，這座城市已是迎接外賓之處。",
    },
  },
  {
    eyebrow: "1593",
    theme: { ko: "패배", en: "A DEFEAT", ja: "敗北", "zh-CN": "败战", "zh-TW": "敗戰" },
    title: {
      ko: "이곳에서 진 전투가 있었습니다",
      en: "A Battle Was Lost Here",
      ja: "ここで負けた戦いがありました",
      "zh-CN": "此地曾有一场败仗",
      "zh-TW": "此地曾有一場敗仗",
    },
    site: {
      ko: "벽제관 일대",
      en: "Around Byeokjegwan",
      ja: "碧蹄館一帯",
      "zh-CN": "碧蹄馆一带",
      "zh-TW": "碧蹄館一帶",
    },
    open: null,
    body: {
      ko: "임진왜란 중 평양성을 되찾은 조명 연합군은 남쪽으로 밀고 내려왔습니다. 그러나 1593년 벽제관에서 일본군에게 패했습니다. 이 패배로 명군은 더 이상 진격하지 않았고, 자신감을 얻은 일본군은 곧 행주산성으로 향했습니다. 다음 이야기가 그것입니다.",
      en: "During the Imjin War the allied Joseon–Ming forces retook Pyongyang and pushed south. At Byeokjegwan in 1593, however, they were defeated by the Japanese. After this loss the Ming army advanced no further, and the Japanese, with their confidence restored, turned next toward Haengju Fortress. That is the next story.",
      ja: "壬辰倭乱の最中、平壌城を奪還した朝明連合軍は南へ進みました。しかし1593年、碧蹄館で日本軍に敗れます。この敗北により明軍はそれ以上進まず、自信を得た日本軍はまもなく幸州山城へ向かいました。次の物語がそれです。",
      "zh-CN": "壬辰倭乱期间，朝明联军收复平壤后南下推进。然而1593年在碧蹄馆败于日军。此败之后明军不再前进，重拾信心的日军旋即转向幸州山城。下一段故事即由此展开。",
      "zh-TW": "壬辰倭亂期間，朝明聯軍收復平壤後南下推進。然而1593年在碧蹄館敗於日軍。此敗之後明軍不再前進，重拾信心的日軍旋即轉向幸州山城。下一段故事即由此展開。",
    },
  },
  {
    eyebrow: "1593",
    theme: { ko: "승리", en: "A VICTORY", ja: "勝利", "zh-CN": "胜利", "zh-TW": "勝利" },
    title: {
      ko: "수도를 지킨 언덕",
      en: "The Hill That Held the Capital",
      ja: "首都を守った丘",
      "zh-CN": "守住首都的山丘",
      "zh-TW": "守住首都的山丘",
    },
    site: {
      ko: "행주산성",
      en: "Haengju Fortress",
      ja: "幸州山城",
      "zh-CN": "幸州山城",
      "zh-TW": "幸州山城",
    },
    open: true,
    body: {
      ko: "벽제관에서 이긴 일본군은 한강 변의 이 작은 산성으로 향했습니다. 성 안에는 권율이 이끄는 군사와 승병, 그리고 인근 주민들이 있었습니다. 여러 차례의 공격을 막아냈고 결국 일본군은 물러났습니다. 행주대첩은 임진왜란의 대표적인 승리 가운데 하나로 꼽힙니다. 지금 이곳에 서면 한강과 서울 방향이 한눈에 들어옵니다.",
      en: "After their victory at Byeokjegwan the Japanese moved on this small hill fortress by the Han River. Inside were soldiers under Gwon Yul, warrior monks and people from the surrounding area. They held off repeated assaults, and the Japanese eventually withdrew. Haengju is counted among the decisive Korean victories of the Imjin War. Stand here today and the Han River and Seoul open out before you.",
      ja: "碧蹄館で勝った日本軍は漢江沿いのこの小さな山城へ向かいました。城内には権慄が率いる兵と僧兵、そして近隣の住民がいました。度重なる攻撃を防ぎ、日本軍はついに退きました。幸州大捷は壬辰倭乱を代表する勝利の一つに数えられます。今ここに立てば、漢江とソウル方面が一望できます。",
      "zh-CN": "于碧蹄馆获胜的日军转向汉江畔这座小山城。城中有权慄率领的军士、僧兵与附近居民。他们击退多轮进攻，日军终于撤退。幸州大捷被视为壬辰倭乱代表性胜利之一。今日立于此地，汉江与首尔方向尽收眼底。",
      "zh-TW": "於碧蹄館獲勝的日軍轉向漢江畔這座小山城。城中有權慄率領的軍士、僧兵與附近居民。他們擊退多輪進攻，日軍終於撤退。幸州大捷被視為壬辰倭亂代表性勝利之一。今日立於此地，漢江與首爾方向盡收眼底。",
    },
  },
  {
    eyebrow: "18TH CENTURY",
    theme: { ko: "피난", en: "THE REFUGE", ja: "避難", "zh-CN": "避难", "zh-TW": "避難" },
    title: {
      ko: "궁을 버려야 할 때 왕이 갈 곳",
      en: "Where the King Would Go if the Palace Fell",
      ja: "宮を捨てねばならぬとき、王が行く場所",
      "zh-CN": "若须弃宫，君王将往之处",
      "zh-TW": "若須棄宮，君王將往之處",
    },
    site: {
      ko: "북한산성 · 행궁지",
      en: "Bukhansanseong · the temporary palace site",
      ja: "北漢山城·行宮址",
      "zh-CN": "北汉山城·行宫址",
      "zh-TW": "北漢山城·行宮址",
    },
    open: null,
    body: {
      ko: "임진왜란과 병자호란을 겪은 뒤 조선은 수도 방어를 다시 정비했습니다. 북한산성을 크게 손보았고, 성 안에는 위급할 때 왕실이 머물 수 있는 행궁을 두었습니다. 경복궁은 왕이 살던 곳이지만, 그곳을 떠나야 할 만큼의 위기가 왔을 때 갈 곳으로 준비된 자리가 이곳이었습니다.",
      en: "After the Imjin and Manchu invasions, Joseon reorganised the defence of its capital. Bukhansanseong was substantially rebuilt, and within the walls a temporary palace was prepared where the royal household could stay in an emergency. Gyeongbokgung is where the king lived; this is where he was to go if the crisis ever grew large enough to leave it.",
      ja: "壬辰倭乱と丙子胡乱を経た後、朝鮮は首都の防衛を立て直しました。北漢山城を大きく修築し、城内には非常時に王室が滞在できる行宮を置きました。景福宮は王が住んだ場所ですが、そこを離れねばならぬほどの危機が訪れたとき向かう先として用意されたのがこの場所でした。",
      "zh-CN": "历经壬辰倭乱与丙子胡乱之后，朝鲜重整首都防务。北汉山城大加修筑，城内设有危急时王室可驻跸的行宫。景福宫是国王居所，而当危机大到必须离宫时，此处便是预备的去处。",
      "zh-TW": "歷經壬辰倭亂與丙子胡亂之後，朝鮮重整首都防務。北漢山城大加修築，城內設有危急時王室可駐蹕的行宮。景福宮是國王居所，而當危機大到必須離宮時，此處便是預備的去處。",
    },
  },
  {
    eyebrow: "EARLY 20TH CENTURY",
    theme: { ko: "북쪽으로", en: "NORTHWARD", ja: "北へ", "zh-CN": "向北", "zh-TW": "向北" },
    title: {
      ko: "기차는 북쪽으로 떠났습니다",
      en: "The Trains Left Northward",
      ja: "汽車は北へ発ちました",
      "zh-CN": "列车驶向北方",
      "zh-TW": "列車駛向北方",
    },
    site: {
      ko: "구 일산역 · 일산시장 일대",
      en: "The old Ilsan Station and market area",
      ja: "旧一山駅·一山市場一帯",
      "zh-CN": "旧一山站·一山市场一带",
      "zh-TW": "舊一山站·一山市場一帶",
    },
    open: null,
    body: {
      ko: "경의선이 놓이면서 이 지역에 역이 들어섰습니다. 이 철길은 서울에서 북쪽으로, 평양과 신의주를 지나 대륙으로 이어졌습니다. 사람과 물자가 오갔고, 나라를 떠나야 했던 사람들도 이 길을 지났습니다. 지금 GTX가 이 도시를 지나가지만, 이곳이 철도의 도시가 된 것은 훨씬 전의 일입니다.",
      en: "With the laying of the Gyeongui Line a station came to this area. The track ran north from Seoul through Pyongyang and Uiju and on into the continent. People and goods moved along it, and so did those who had to leave the country. The GTX passes through this city today, but it became a railway city long before that.",
      ja: "京義線が敷かれ、この地域に駅ができました。この線路はソウルから北へ、平壌と新義州を経て大陸へと続きました。人と物資が行き交い、国を離れねばならなかった人々もこの道を通りました。今GTXがこの都市を通りますが、ここが鉄道の街になったのはずっと前のことです。",
      "zh-CN": "随着京义线铺设，此地设站。铁路自首尔北上，经平壤、新义州通往大陆。人与物资往来其间，不得不离乡的人们也曾行经此路。今日GTX穿城而过，但此地成为铁路之城，远早于此。",
      "zh-TW": "隨著京義線鋪設，此地設站。鐵路自首爾北上，經平壤、新義州通往大陸。人與物資往來其間，不得不離鄉的人們也曾行經此路。今日GTX穿城而過，但此地成為鐵路之城，遠早於此。",
    },
  },
  {
    // md 지시: 10번 연도 미확인 → eyebrow "TODAY", 본문에서 연도 없음.
    eyebrow: "TODAY",
    theme: { ko: "논에서 도시로", en: "FROM FIELDS TO CITY", ja: "田から都市へ", "zh-CN": "从田野到城市", "zh-TW": "從田野到城市" },
    title: {
      ko: "볍씨가 나온 그 땅 위에",
      en: "On the Ground Where the Rice Was Found",
      ja: "籾が出土したその土地の上に",
      "zh-CN": "在出土稻种的那片土地上",
      "zh-TW": "在出土稻種的那片土地上",
    },
    site: {
      ko: "일산신도시 · 호수공원 · 킨텍스",
      en: "Ilsan New Town · the lake park · KINTEX",
      ja: "一山新都市·湖水公園·キンテックス",
      "zh-CN": "一山新城·湖水公园·韩国国际展览中心",
      "zh-TW": "一山新城·湖水公園·韓國國際展覽中心",
    },
    open: true,
    body: {
      ko: "가와지 볍씨가 나온 곳은 신도시 공사 현장이었습니다. 5천 년 전 벼를 심던 땅에서 신도시가 올라갔고, 그 안에 호수공원이 생겼고, 그 옆에 전시장이 들어섰습니다. 지금은 전시와 공연을 보러 세계에서 사람들이 옵니다. 5천 년 전과 지금이 같은 땅 위에 겹쳐 있습니다.",
      en: "The place where the Gawaji rice grains emerged was a construction site for the new town. On ground where rice was planted five thousand years ago, a new town rose; within it a lake park was made, and beside it an exhibition centre. People now come from around the world for shows and performances. Five thousand years ago and today lie on the same ground.",
      ja: "ガワジ籾が出土した場所は新都市の工事現場でした。五千年前に稲を植えていた土地に新都市が建ち、その中に湖水公園ができ、その隣に展示場が入りました。今は展示や公演を見に世界から人が訪れます。五千年前と今が同じ土地の上に重なっています。",
      "zh-CN": "加瓦地稻种出土之处，正是新城的施工现场。五千年前种稻的土地上建起新城，城中辟有湖水公园，其旁矗立展馆。如今世界各地的人为展会与演出而来。五千年前与今日，重叠于同一片土地。",
      "zh-TW": "加瓦地稻種出土之處，正是新城的施工現場。五千年前種稻的土地上建起新城，城中闢有湖水公園，其旁矗立展館。如今世界各地的人為展會與演出而來。五千年前與今日，重疊於同一片土地。",
    },
  },
];
