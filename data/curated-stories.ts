// 홈 BEST 카테고리별 "10선" 큐레이션 콘텐츠 (Phase 1: 골격만, items 전부 []).
//
// Phase 4에서 각 카테고리 items 배열에 10곳씩 push 예정.
// 로케일 번역은 translations 에 id 매핑으로 override.
// region 은 data/regions.ts 의 key 를 참조 (다중 지역이면 regions[]).
//
// DB 이관 시 (Phase 후반) 이 파일은 fallback 역할로 유지되고,
// readCuratedStories() 헬퍼가 DB 우선 · 이 파일 fallback 패턴으로 로드.

import type {
  EmblemCategory,
  EmblemLocale,
} from "@/components/emblem/colors";

export type CuratedCategory = EmblemCategory;
export type CuratedItemLocale = Exclude<EmblemLocale, "ko">;

export interface CuratedItem {
  /** URL·번역 오버라이드 참조용 kebab-case */
  id: string;
  /** 10선 랭킹 (선택) */
  rank?: number;
  /** ko 기본 이름 (예: "일산호수공원") */
  name: string;
  subtitle?: string;
  desc: string;
  address?: string;
  hours?: string;
  photoUrl?: string;
  tags?: string[];
  /** 단일 지역 (data/regions.ts key 참조) */
  region?: string;
  /** 다중 지역 (예: 행주산성+일산 조합) */
  regions?: string[];
  links?: Array<{ label: string; url: string }>;
  /** "고양 BEST 선정" 배지 — 유료 광고 슬롯 여부 (오더 #BEST2, 값은 Phase 4). */
  featured?: boolean;
  /**
   * INSIDERS "얼굴 있는 소개" — 업체 사장·셰프 등 인물 카드 (오더 #BEST2).
   * 데이터 들어오면 아이템 카드에 인물 슬롯 렌더 (Phase 4).
   */
  host?: {
    name: string;
    title: string;
    photoUrl?: string;
  };
}

export interface CuratedItemTranslation {
  name?: string;
  subtitle?: string;
  desc?: string;
  address?: string;
  hours?: string;
  tags?: string[];
}

export interface CuratedStory {
  category: CuratedCategory;
  items: CuratedItem[];
  translations?: Partial<
    Record<CuratedItemLocale, Record<string, CuratedItemTranslation>>
  >;
}

export const curatedStories: Record<CuratedCategory, CuratedStory> = {
  // 오더 #C2: /best/walk 배선. name·desc 는 data/spots.ts 의
  //   ilsan-lake-park 스팟에서 그대로 가져옴 (title.ko + subtitle.ko). 새 문안 생성 없음.
  //   region 은 regions.ts key 규칙으로 "ilsan-east" (spot.region 라벨 "일산동구" 대응 key).
  //   translations 는 아직 미설정 — Phase 4 카드 다국어 렌더 도입 시 채운다.
  walk: {
    category: "walk",
    // 오더 #C8 [2]: 산책 7건 (오더 명시 순서). 이전 10건 중 3건
    //   (밤가시초가·어울림누리 누리공원·아람누리 야외광장) 은 items 에서 제외.
    //   해당 스팟은 spots.ts 에 남아 SSG 경로 유지되나 목록에서는 노출 X.
    //   서오릉·서삼릉·행주산성 은 walk items 유지 + history items 에도 등재.
    items: [
      { id: "ilsan-lake-park", name: "일산호수공원", desc: "도심 한가운데 호수를 한 바퀴 도는 길", region: "ilsan-east" },
      { id: "jeongbalsan-park", name: "정발산근린공원", desc: "도심에서 바로 오르는 낮은 산", region: "ilsan-east" },
      { id: "changneungcheon-trail", name: "창릉천 산책로", desc: "물길을 따라 이어지는 평지 코스", region: "deokyang" },
      { id: "kintex-walkway", name: "킨텍스 일대 산책로", desc: "전시 일정 사이에 걷는 길", region: "ilsan-west" },
      { id: "seooreung", name: "서오릉", desc: "왕릉 사이로 이어지는 숲길", region: "deokyang" },
      { id: "seosamneung", name: "서삼릉", desc: "조용히 걷기 좋은 왕릉 숲", region: "deokyang" },
      { id: "haengju-fortress", name: "행주산성", desc: "한강을 내려다보며 걷는 성곽길", region: "deokyang" },
    ],
    // 오더 #C3 [2] · #C5 [2]: name/desc 4로케일 override. spots.ts title/subtitle 그대로.
    translations: {
      en: {
        "ilsan-lake-park": { name: "Ilsan Lake Park", desc: "A loop around the lake in the middle of the city" },
        "jeongbalsan-park": { name: "Jeongbalsan Park", desc: "A low hill you can climb straight from downtown" },
        "haengju-fortress": { name: "Haengju Fortress", desc: "A fortress walk overlooking the Han River" },
        "changneungcheon-trail": { name: "Changneungcheon Trail", desc: "A flat route along the stream" },
        "seooreung": { name: "Seooreung Royal Tombs", desc: "Forest paths between royal tombs" },
        "seosamneung": { name: "Seosamneung Royal Tombs", desc: "A quiet woodland around royal tombs" },
        "kintex-walkway": { name: "KINTEX Area Walkway", desc: "A walk between exhibition sessions" },
      },
      ja: {
        "ilsan-lake-park": { name: "一山湖水公園", desc: "都心の真ん中で湖を一周する道" },
        "jeongbalsan-park": { name: "鼎鉢山近隣公園", desc: "都心からすぐ登れる低い山" },
        "haengju-fortress": { name: "幸州山城", desc: "漢江を見下ろしながら歩く城郭の道" },
        "changneungcheon-trail": { name: "昌陵川遊歩道", desc: "水辺に沿って続く平坦なコース" },
        "seooreung": { name: "西五陵", desc: "王陵の間を抜ける森の道" },
        "seosamneung": { name: "西三陵", desc: "静かに歩ける王陵の森" },
        "kintex-walkway": { name: "キンテックス一帯の遊歩道", desc: "展示の合間に歩く道" },
      },
      "zh-CN": {
        "ilsan-lake-park": { name: "一山湖水公园", desc: "环绕城市中心湖泊的步道" },
        "jeongbalsan-park": { name: "鼎钵山近邻公园", desc: "从市中心即可登上的小山" },
        "haengju-fortress": { name: "幸州山城", desc: "俯瞰汉江的城郭步道" },
        "changneungcheon-trail": { name: "昌陵川步道", desc: "沿溪流延伸的平坦路线" },
        "seooreung": { name: "西五陵", desc: "穿行于王陵之间的林间小路" },
        "seosamneung": { name: "西三陵", desc: "适合静静漫步的王陵林地" },
        "kintex-walkway": { name: "韩国国际展览中心一带步道", desc: "展会间隙可走的步道" },
      },
      "zh-TW": {
        "ilsan-lake-park": { name: "一山湖水公園", desc: "環繞城市中心湖泊的步道" },
        "jeongbalsan-park": { name: "鼎缽山近鄰公園", desc: "從市中心即可登上的小山" },
        "haengju-fortress": { name: "幸州山城", desc: "俯瞰漢江的城郭步道" },
        "changneungcheon-trail": { name: "昌陵川步道", desc: "沿溪流延伸的平坦路線" },
        "seooreung": { name: "西五陵", desc: "穿行於王陵之間的林間小路" },
        "seosamneung": { name: "西三陵", desc: "適合靜靜漫步的王陵林地" },
        "kintex-walkway": { name: "韓國國際展覽中心一帶步道", desc: "展會間隙可走的步道" },
      },
    },
  },
  // 오더 #C8 [2][3]: 미식 6. name/desc = spots.ts title.ko/subtitle.ko 그대로.
  food: {
    category: "food",
    items: [
      { id: "lafesta", name: "라페스타", desc: "밤늦게까지 이어지는 거리형 상권", region: "ilsan-east" },
      { id: "westerndom", name: "웨스턴돔", desc: "라페스타와 마주 보는 또 하나의 거리", region: "ilsan-east" },
      { id: "baekseok-food-alley", name: "백석 먹자골목", desc: "퇴근길에 붐비는 골목 상권", region: "ilsan-east" },
      { id: "hwajeong-rodeo", name: "화정 로데오거리", desc: "덕양구의 대표 상권", region: "deokyang" },
      { id: "ilsan-traditional-market", name: "일산 전통시장", desc: "시장 안에서 먹는 한 끼", region: "ilsan-west" },
      { id: "daehwa-cafes", name: "대화동 카페 밀집구역", desc: "호수공원 산책 뒤에 들르는 곳", region: "ilsan-west" },
    ],
    translations: {
      en: {
        "lafesta": { name: "La Festa", desc: "An open-air street that stays busy late" },
        "westerndom": { name: "Western Dom", desc: "A second street facing La Festa" },
        "baekseok-food-alley": { name: "Baekseok Food Alley", desc: "A back-street strip that fills up after work" },
        "hwajeong-rodeo": { name: "Hwajeong Rodeo Street", desc: "The main commercial strip in Deokyang" },
        "ilsan-traditional-market": { name: "Ilsan Traditional Market", desc: "A meal inside the market" },
        "daehwa-cafes": { name: "Daehwa Cafe Cluster", desc: "Where to stop after a lake park walk" },
      },
      ja: {
        "lafesta": { name: "ラフェスタ", desc: "夜遅くまで続くストリート型商圏" },
        "westerndom": { name: "ウエスタンドム", desc: "ラフェスタと向かい合うもう一つの通り" },
        "baekseok-food-alley": { name: "白石食べ物横丁", desc: "退勤時に賑わう横丁商圏" },
        "hwajeong-rodeo": { name: "花井ロデオ通り", desc: "徳陽区を代表する商圏" },
        "ilsan-traditional-market": { name: "一山伝統市場", desc: "市場の中で食べる一食" },
        "daehwa-cafes": { name: "大化洞カフェ密集エリア", desc: "湖水公園の散策後に立ち寄る場所" },
      },
      "zh-CN": {
        "lafesta": { name: "拉斐斯塔", desc: "热闹至深夜的街区商圈" },
        "westerndom": { name: "西部圆顶", desc: "与拉斐斯塔相对的另一条街" },
        "baekseok-food-alley": { name: "白石美食巷", desc: "下班后热闹的巷弄商圈" },
        "hwajeong-rodeo": { name: "花井罗迪欧街", desc: "德阳区的代表商圈" },
        "ilsan-traditional-market": { name: "一山传统市场", desc: "在市场里吃的一餐" },
        "daehwa-cafes": { name: "大化洞咖啡聚集区", desc: "湖水公园散步后的落脚处" },
      },
      "zh-TW": {
        "lafesta": { name: "拉斐斯塔", desc: "熱鬧至深夜的街區商圈" },
        "westerndom": { name: "西部圓頂", desc: "與拉斐斯塔相對的另一條街" },
        "baekseok-food-alley": { name: "白石美食巷", desc: "下班後熱鬧的巷弄商圈" },
        "hwajeong-rodeo": { name: "花井羅迪歐街", desc: "德陽區的代表商圈" },
        "ilsan-traditional-market": { name: "一山傳統市場", desc: "在市場裡吃的一餐" },
        "daehwa-cafes": { name: "大化洞咖啡聚集區", desc: "湖水公園散步後的落腳處" },
      },
    },
  },

  // 오더 #C8 [2][3]: 문화 6.
  culture: {
    category: "culture",
    items: [
      { id: "aramnuri", name: "고양아람누리", desc: "고양의 대표 공연장", region: "ilsan-east" },
      { id: "eoullimnuri", name: "고양어울림누리", desc: "덕양구의 공연·전시 거점", region: "deokyang" },
      { id: "hyundai-motorstudio", name: "현대 모터스튜디오 고양", desc: "자동차를 주제로 한 대형 전시공간", region: "ilsan-west" },
      { id: "latin-america-museum", name: "중남미문화원", desc: "라틴아메리카를 옮겨온 정원", region: "deokyang" },
      { id: "aram-art-museum", name: "아람미술관", desc: "공연장 안의 전시 공간", region: "ilsan-east" },
      { id: "kintex", name: "킨텍스", desc: "국내 최대 규모의 전시장", region: "ilsan-west" },
    ],
    translations: {
      en: {
        "aramnuri": { name: "Goyang Aram Nuri", desc: "Goyang's main performing arts centre" },
        "eoullimnuri": { name: "Goyang Eoullim Nuri", desc: "The arts hub of Deokyang" },
        "hyundai-motorstudio": { name: "Hyundai Motorstudio Goyang", desc: "A large exhibition space built around cars" },
        "latin-america-museum": { name: "Museum of Latin American Art", desc: "A garden that brings Latin America to Goyang" },
        "aram-art-museum": { name: "Aram Art Museum", desc: "A gallery inside the arts centre" },
        "kintex": { name: "KINTEX", desc: "Korea's largest exhibition centre" },
      },
      ja: {
        "aramnuri": { name: "高陽アラムヌリ", desc: "高陽を代表する公演場" },
        "eoullimnuri": { name: "高陽オウルリムヌリ", desc: "徳陽区の公演·展示拠点" },
        "hyundai-motorstudio": { name: "現代モータースタジオ高陽", desc: "自動車をテーマにした大型展示空間" },
        "latin-america-museum": { name: "中南米文化院", desc: "ラテンアメリカを移した庭園" },
        "aram-art-museum": { name: "アラム美術館", desc: "公演場の中の展示空間" },
        "kintex": { name: "キンテックス", desc: "国内最大規模の展示場" },
      },
      "zh-CN": {
        "aramnuri": { name: "高阳阿蓝世界", desc: "高阳代表性演出场馆" },
        "eoullimnuri": { name: "高阳和谐世界", desc: "德阳区演出与展览据点" },
        "hyundai-motorstudio": { name: "现代汽车文化馆高阳", desc: "以汽车为主题的大型展览空间" },
        "latin-america-museum": { name: "中南美文化院", desc: "移植拉丁美洲的庭园" },
        "aram-art-museum": { name: "阿蓝美术馆", desc: "演出场馆内的展览空间" },
        "kintex": { name: "韩国国际展览中心", desc: "韩国最大规模展览中心" },
      },
      "zh-TW": {
        "aramnuri": { name: "高陽阿藍世界", desc: "高陽代表性演出場館" },
        "eoullimnuri": { name: "高陽和諧世界", desc: "德陽區演出與展覽據點" },
        "hyundai-motorstudio": { name: "現代汽車文化館高陽", desc: "以汽車為主題的大型展覽空間" },
        "latin-america-museum": { name: "中南美文化院", desc: "移植拉丁美洲的庭園" },
        "aram-art-museum": { name: "阿藍美術館", desc: "演出場館內的展覽空間" },
        "kintex": { name: "韓國國際展覽中心", desc: "韓國最大規模展覽中心" },
      },
    },
  },

  // 오더 #C8 [2][3]: K컬처 4.
  kculture: {
    category: "kculture",
    items: [
      { id: "goyang-stadium", name: "고양종합운동장", desc: "K팝 스타디움 공연이 열리는 곳", region: "ilsan-west" },
      { id: "kintex-kpop", name: "킨텍스 K팝 이벤트", desc: "팬 이벤트와 콘서트가 열리는 실내 무대", region: "ilsan-west" },
      { id: "hallyu-world", name: "한류월드", desc: "K컬처를 주제로 조성된 구역", region: "ilsan-west" },
      { id: "onemount", name: "원마운트", desc: "스노우파크와 워터파크가 있는 복합시설", region: "ilsan-west" },
    ],
    translations: {
      en: {
        "goyang-stadium": { name: "Goyang Stadium", desc: "Where K-pop stadium shows happen" },
        "kintex-kpop": { name: "K-pop Events at KINTEX", desc: "Indoor stages for fan events and concerts" },
        "hallyu-world": { name: "Hallyu World", desc: "A district built around Korean pop culture" },
        "onemount": { name: "One Mount", desc: "A complex with snow and water parks" },
      },
      ja: {
        "goyang-stadium": { name: "高陽総合運動場", desc: "K-POPスタジアム公演が開かれる場所" },
        "kintex-kpop": { name: "キンテックスK-POPイベント", desc: "ファンイベントとコンサートの屋内ステージ" },
        "hallyu-world": { name: "韓流ワールド", desc: "K-カルチャーをテーマにした区域" },
        "onemount": { name: "ワンマウント", desc: "スノーパークとウォーターパークのある複合施設" },
      },
      "zh-CN": {
        "goyang-stadium": { name: "高阳综合运动场", desc: "举办K-pop体育场演唱会之地" },
        "kintex-kpop": { name: "韩国国际展览中心K-pop活动", desc: "举办粉丝活动与演唱会的室内舞台" },
        "hallyu-world": { name: "韩流世界", desc: "以韩流文化为主题的区域" },
        "onemount": { name: "One Mount", desc: "设有雪世界与水上乐园的综合设施" },
      },
      "zh-TW": {
        "goyang-stadium": { name: "高陽綜合運動場", desc: "舉辦K-pop體育場演唱會之地" },
        "kintex-kpop": { name: "韓國國際展覽中心K-pop活動", desc: "舉辦粉絲活動與演唱會的室內舞台" },
        "hallyu-world": { name: "韓流世界", desc: "以韓流文化為主題的區域" },
        "onemount": { name: "One Mount", desc: "設有雪世界與水上樂園的綜合設施" },
      },
    },
  },

  // 오더 #C8 [2][3]: history 4. 왕릉·산성·초가. spot.category=history 로 조정된 3건 +
  //   bamgasi-thatched-house (spot.category=walk 유지, curated 는 history 등재).
  history: {
    category: "history",
    items: [
      { id: "seooreung", name: "서오릉", desc: "왕릉 사이로 이어지는 숲길", region: "deokyang" },
      { id: "seosamneung", name: "서삼릉", desc: "조용히 걷기 좋은 왕릉 숲", region: "deokyang" },
      { id: "haengju-fortress", name: "행주산성", desc: "한강을 내려다보며 걷는 성곽길", region: "deokyang" },
      { id: "bamgasi-thatched-house", name: "고양 밤가시초가", desc: "신도시 한가운데 남은 옛집", region: "ilsan-east" },
    ],
    translations: {
      en: {
        "seooreung": { name: "Seooreung Royal Tombs", desc: "Forest paths between royal tombs" },
        "seosamneung": { name: "Seosamneung Royal Tombs", desc: "A quiet woodland around royal tombs" },
        "haengju-fortress": { name: "Haengju Fortress", desc: "A fortress walk overlooking the Han River" },
        "bamgasi-thatched-house": { name: "Bamgasi Thatched House", desc: "An old farmhouse left in the middle of a new town" },
      },
      ja: {
        "seooreung": { name: "西五陵", desc: "王陵の間を抜ける森の道" },
        "seosamneung": { name: "西三陵", desc: "静かに歩ける王陵の森" },
        "haengju-fortress": { name: "幸州山城", desc: "漢江を見下ろしながら歩く城郭の道" },
        "bamgasi-thatched-house": { name: "高陽 バムガシ草家", desc: "新都市の真ん中に残る古い家" },
      },
      "zh-CN": {
        "seooreung": { name: "西五陵", desc: "穿行于王陵之间的林间小路" },
        "seosamneung": { name: "西三陵", desc: "适合静静漫步的王陵林地" },
        "haengju-fortress": { name: "幸州山城", desc: "俯瞰汉江的城郭步道" },
        "bamgasi-thatched-house": { name: "高阳栗刺草屋", desc: "留存于新城中心的老宅" },
      },
      "zh-TW": {
        "seooreung": { name: "西五陵", desc: "穿行於王陵之間的林間小路" },
        "seosamneung": { name: "西三陵", desc: "適合靜靜漫步的王陵林地" },
        "haengju-fortress": { name: "幸州山城", desc: "俯瞰漢江的城郭步道" },
        "bamgasi-thatched-house": { name: "高陽栗刺草屋", desc: "留存於新城中心的老宅" },
      },
    },
  },

  // 오더 #C8 [2][3]: family 2. onemount(kculture 도 등재) · kintex-walkway(walk 도 등재).
  family: {
    category: "family",
    items: [
      { id: "onemount", name: "원마운트", desc: "스노우파크와 워터파크가 있는 복합시설", region: "ilsan-west" },
      { id: "kintex-walkway", name: "킨텍스 일대 산책로", desc: "전시 일정 사이에 걷는 길", region: "ilsan-west" },
    ],
    translations: {
      en: {
        "onemount": { name: "One Mount", desc: "A complex with snow and water parks" },
        "kintex-walkway": { name: "KINTEX Area Walkway", desc: "A walk between exhibition sessions" },
      },
      ja: {
        "onemount": { name: "ワンマウント", desc: "スノーパークとウォーターパークのある複合施設" },
        "kintex-walkway": { name: "キンテックス一帯の遊歩道", desc: "展示の合間に歩く道" },
      },
      "zh-CN": {
        "onemount": { name: "One Mount", desc: "设有雪世界与水上乐园的综合设施" },
        "kintex-walkway": { name: "韩国国际展览中心一带步道", desc: "展会间隙可走的步道" },
      },
      "zh-TW": {
        "onemount": { name: "One Mount", desc: "設有雪世界與水上樂園的綜合設施" },
        "kintex-walkway": { name: "韓國國際展覽中心一帶步道", desc: "展會間隙可走的步道" },
      },
    },
  },
};

export function getCuratedStory(cat: CuratedCategory): CuratedStory {
  return curatedStories[cat];
}

/**
 * 오더 #C3: 카드 렌더용 로케일 스왑.
 *   ko 는 item 원본. 그 외 로케일은 story.translations[locale][item.id] 로 필드 override.
 *   해당 로케일 override 가 없거나 필드가 비면 ko 값으로 폴백 (빈 값 회피).
 *   구조: 얕은 병합 (name/desc/subtitle/address/hours/tags 만 override 대상 필드).
 */
export function getLocalizedCuratedItem(
  item: CuratedItem,
  story: CuratedStory,
  locale: EmblemLocale,
): CuratedItem {
  if (locale === "ko") return item;
  const override = story.translations?.[locale]?.[item.id];
  if (!override) return item;
  return {
    ...item,
    name: override.name ?? item.name,
    subtitle: override.subtitle ?? item.subtitle,
    desc: override.desc ?? item.desc,
    address: override.address ?? item.address,
    hours: override.hours ?? item.hours,
    tags: override.tags ?? item.tags,
  };
}
