// 홈 BEST 카테고리별 큐레이션 콘텐츠 (Phase 1: 골격만, items 전부 []).
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
  /** 랭킹 순번 (선택, 카드 좌측 상단 표시용) */
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
    // 오더 #C8 [2]: walk +2 (원당종마목장·장항습지) 추가.
    // 오더 #C10 [1]: walk +2 (안곡습지공원·고양생태공원) 추가.
    items: [
      { id: "ilsan-lake-park", name: "일산호수공원", desc: "도심 한가운데 호수를 한 바퀴 도는 길", region: "ilsan-east" },
      { id: "jeongbalsan-park", name: "정발산근린공원", desc: "도심에서 바로 오르는 낮은 산", region: "ilsan-east" },
      { id: "changneungcheon-trail", name: "창릉천 산책로", desc: "물길을 따라 이어지는 평지 코스", region: "deokyang" },
      { id: "kintex-walkway", name: "킨텍스 일대 산책로", desc: "전시 일정 사이에 걷는 길", region: "ilsan-west" },
      { id: "seooreung", name: "서오릉", desc: "왕릉 사이로 이어지는 숲길", region: "deokyang" },
      { id: "seosamneung", name: "서삼릉", desc: "조용히 걷기 좋은 왕릉 숲", region: "deokyang" },
      { id: "haengju-fortress", name: "행주산성", desc: "한강을 내려다보며 걷는 성곽길", region: "deokyang" },
      { id: "wondang-ranch-lets-run-farm", name: "원당종마목장 (렛츠런팜 원당)", desc: "말 목장 · 사극·CF 촬영지", region: "deokyang" },
      { id: "janghang-wetlands", name: "장항습지", desc: "한강 하구의 습지", region: "ilsan-east" },
      { id: "angok-wetland-park", name: "안곡습지공원", desc: "도심 속 습지 생태공원", region: "ilsan-east" },
      { id: "goyang-ecological-park", name: "고양생태공원", desc: "킨텍스 인근 생태공원", region: "ilsan-west" },
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
        "wondang-ranch-lets-run-farm": { name: "Wondang Horse Ranch (Let's Run Farm)" },
        "janghang-wetlands": { name: "Janghang Wetlands" },
        "angok-wetland-park": { name: "Angok Wetland Park" },
        "goyang-ecological-park": { name: "Goyang Ecological Park" },
      },
      ja: {
        "ilsan-lake-park": { name: "一山湖水公園", desc: "都心の真ん中で湖を一周する道" },
        "jeongbalsan-park": { name: "鼎鉢山近隣公園", desc: "都心からすぐ登れる低い山" },
        "haengju-fortress": { name: "幸州山城", desc: "漢江を見下ろしながら歩く城郭の道" },
        "changneungcheon-trail": { name: "昌陵川遊歩道", desc: "水辺に沿って続く平坦なコース" },
        "seooreung": { name: "西五陵", desc: "王陵の間を抜ける森の道" },
        "seosamneung": { name: "西三陵", desc: "静かに歩ける王陵の森" },
        "kintex-walkway": { name: "キンテックス一帯の遊歩道", desc: "展示の合間に歩く道" },
        "wondang-ranch-lets-run-farm": { name: "元堂種馬牧場(レッツランファーム元堂)" },
        "janghang-wetlands": { name: "獐項湿地" },
        "angok-wetland-park": { name: "安谷湿地公園" },
        "goyang-ecological-park": { name: "高陽生態公園" },
      },
      "zh-CN": {
        "ilsan-lake-park": { name: "一山湖水公园", desc: "环绕城市中心湖泊的步道" },
        "jeongbalsan-park": { name: "鼎钵山近邻公园", desc: "从市中心即可登上的小山" },
        "haengju-fortress": { name: "幸州山城", desc: "俯瞰汉江的城郭步道" },
        "changneungcheon-trail": { name: "昌陵川步道", desc: "沿溪流延伸的平坦路线" },
        "seooreung": { name: "西五陵", desc: "穿行于王陵之间的林间小路" },
        "seosamneung": { name: "西三陵", desc: "适合静静漫步的王陵林地" },
        "kintex-walkway": { name: "韩国国际展览中心一带步道", desc: "展会间隙可走的步道" },
        "wondang-ranch-lets-run-farm": { name: "元堂种马牧场（Let's Run Farm 元堂）" },
        "janghang-wetlands": { name: "獐项湿地" },
        "angok-wetland-park": { name: "安谷湿地公园" },
        "goyang-ecological-park": { name: "高阳生态公园" },
      },
      "zh-TW": {
        "ilsan-lake-park": { name: "一山湖水公園", desc: "環繞城市中心湖泊的步道" },
        "jeongbalsan-park": { name: "鼎缽山近鄰公園", desc: "從市中心即可登上的小山" },
        "haengju-fortress": { name: "幸州山城", desc: "俯瞰漢江的城郭步道" },
        "changneungcheon-trail": { name: "昌陵川步道", desc: "沿溪流延伸的平坦路線" },
        "seooreung": { name: "西五陵", desc: "穿行於王陵之間的林間小路" },
        "seosamneung": { name: "西三陵", desc: "適合靜靜漫步的王陵林地" },
        "kintex-walkway": { name: "韓國國際展覽中心一帶步道", desc: "展會間隙可走的步道" },
        "wondang-ranch-lets-run-farm": { name: "元堂種馬牧場（Let's Run Farm 元堂）" },
        "janghang-wetlands": { name: "獐項濕地" },
        "angok-wetland-park": { name: "安谷濕地公園" },
        "goyang-ecological-park": { name: "高陽生態公園" },
      },
    },
  },
  // 오더 #C8 [2][3]: 미식 6. name/desc = spots.ts title.ko/subtitle.ko 그대로.
  // 오더 #FD1 [1]: TourAPI 실데이터 6건 추가 (총 12). A안 — 신규 6건은 subtitle 첫 문장 원문 그대로,
  //   4로케일 translations 는 ko 복제 (다국어 번역은 후속 별도 오더).
  food: {
    category: "food",
    items: [
      { id: "lafesta", name: "라페스타", desc: "밤늦게까지 이어지는 거리형 상권", region: "ilsan-east" },
      { id: "westerndom", name: "웨스턴돔", desc: "라페스타와 마주 보는 또 하나의 거리", region: "ilsan-east" },
      { id: "baekseok-food-alley", name: "백석 먹자골목", desc: "퇴근길에 붐비는 골목 상권", region: "ilsan-east" },
      { id: "hwajeong-rodeo", name: "화정 로데오거리", desc: "덕양구의 대표 상권", region: "deokyang" },
      { id: "ilsan-traditional-market", name: "일산 전통시장", desc: "시장 안에서 먹는 한 끼", region: "ilsan-west" },
      { id: "daehwa-cafes", name: "대화동 카페 밀집구역", desc: "호수공원 산책 뒤에 들르는 곳", region: "ilsan-west" },
      // 오더 #FD1 [1]: TourAPI 실데이터 6건.
      { id: "neungwon-galbi", name: "능원숯불갈비", desc: "능원숯불갈비는 고양시 용두동, 서오릉 정문 앞에 있는 숯불구이 전문점이다.", region: "deokyang" },
      { id: "neunggok-halmeoni-bugeotang", name: "능곡할머니북어탕", desc: "현재는 폐역이 된 능곡역 인근에 위치한 능곡할머니북어탕은 전통의 북어탕 맛집이다.", region: "deokyang" },
      { id: "gobongsan-siraegi", name: "고봉산시래기", desc: "고봉산 시래기는 일산동구 고봉산 아래에 있는 생선구이와 가마솥 밥 전문점이다.", region: "ilsan-east" },
      { id: "gom-taco", name: "곰타코", desc: "곰타코는 백석역 근처에 있는 멕시코 음식점이다.", region: "ilsan-east" },
      { id: "the-nurungji", name: "더 누룽지", desc: "더 누룽지는 경기도 고양시 덕이동, 덕이 초등학교 근처에 있는 해물누룽지탕 전문점이다.", region: "ilsan-west" },
      { id: "gaya-milmyeon-ilsan", name: "가야밀면돼지국밥 일산본점", desc: "가야밀면돼지국밥 일산본점은 일산 대화동 킨텍스 건너편에 있는 밀면, 돼지국밥 맛집이다.", region: "ilsan-west" },
      // 오더 #REV1 [2]: spots-food-01-10.md 미반영 4건 (restaurant).
      { id: "jeongbalsan-cafe-street", name: "정발산 카페거리", desc: "작은 카페들이 모인 골목", region: "ilsan-east" },
      { id: "hallyu-world-dining", name: "한류월드 식당가", desc: "킨텍스에서 걸어갈 수 있는 식사 구역", region: "ilsan-west" },
      { id: "bamridan-gil", name: "밤리단길", desc: "주택가 사이에 생긴 골목 상권", region: "ilsan-east" },
      { id: "starfield-dining", name: "스타필드 고양 식당가", desc: "날씨와 상관없이 먹을 수 있는 곳", region: "deokyang" },
      // 오더 #REV1 [3]: spot-drink-goyang.md — food/subtype:drink. region 원본이 "고양 전역"이라 미설정.
      { id: "drink-goyang", name: "고양이 만드는 것", desc: "커피를 볶고, 술을 빚는 도시" },
    ],
    translations: {
      en: {
        "lafesta": { name: "La Festa", desc: "An open-air street that stays busy late" },
        "westerndom": { name: "Western Dom", desc: "A second street facing La Festa" },
        "baekseok-food-alley": { name: "Baekseok Food Alley", desc: "A back-street strip that fills up after work" },
        "hwajeong-rodeo": { name: "Hwajeong Rodeo Street", desc: "The main commercial strip in Deokyang" },
        "ilsan-traditional-market": { name: "Ilsan Traditional Market", desc: "A meal inside the market" },
        "daehwa-cafes": { name: "Daehwa Cafe Cluster", desc: "Where to stop after a lake park walk" },
        // 오더 #FD1 [1]: A안 — ko 복제.
        "neungwon-galbi": { name: "능원숯불갈비", desc: "능원숯불갈비는 고양시 용두동, 서오릉 정문 앞에 있는 숯불구이 전문점이다." },
        "neunggok-halmeoni-bugeotang": { name: "능곡할머니북어탕", desc: "현재는 폐역이 된 능곡역 인근에 위치한 능곡할머니북어탕은 전통의 북어탕 맛집이다." },
        "gobongsan-siraegi": { name: "고봉산시래기", desc: "고봉산 시래기는 일산동구 고봉산 아래에 있는 생선구이와 가마솥 밥 전문점이다." },
        "gom-taco": { name: "곰타코", desc: "곰타코는 백석역 근처에 있는 멕시코 음식점이다." },
        "the-nurungji": { name: "더 누룽지", desc: "더 누룽지는 경기도 고양시 덕이동, 덕이 초등학교 근처에 있는 해물누룽지탕 전문점이다." },
        "gaya-milmyeon-ilsan": { name: "가야밀면돼지국밥 일산본점", desc: "가야밀면돼지국밥 일산본점은 일산 대화동 킨텍스 건너편에 있는 밀면, 돼지국밥 맛집이다." },
        // 오더 #REV1 [2][3]: 미반영 4건 + drink-goyang. 원본 md 5로케일 완비 값 그대로.
        "jeongbalsan-cafe-street": { name: "Jeongbalsan Cafe Street", desc: "A lane of small independent cafes" },
        "hallyu-world-dining": { name: "Hallyu World Dining", desc: "Dining within walking distance of KINTEX" },
        "bamridan-gil": { name: "Bamridan-gil", desc: "A lane that grew up between houses" },
        "starfield-dining": { name: "Starfield Goyang Dining", desc: "Dining that works whatever the weather" },
        "drink-goyang": { name: "What Goyang Makes", desc: "A city that roasts and brews" },
      },
      ja: {
        "lafesta": { name: "ラフェスタ", desc: "夜遅くまで続くストリート型商圏" },
        "westerndom": { name: "ウエスタンドム", desc: "ラフェスタと向かい合うもう一つの通り" },
        "baekseok-food-alley": { name: "白石食べ物横丁", desc: "退勤時に賑わう横丁商圏" },
        "hwajeong-rodeo": { name: "花井ロデオ通り", desc: "徳陽区を代表する商圏" },
        "ilsan-traditional-market": { name: "一山伝統市場", desc: "市場の中で食べる一食" },
        "daehwa-cafes": { name: "大化洞カフェ密集エリア", desc: "湖水公園の散策後に立ち寄る場所" },
        // 오더 #FD1 [1]: A안 — ko 복제.
        "neungwon-galbi": { name: "능원숯불갈비", desc: "능원숯불갈비는 고양시 용두동, 서오릉 정문 앞에 있는 숯불구이 전문점이다." },
        "neunggok-halmeoni-bugeotang": { name: "능곡할머니북어탕", desc: "현재는 폐역이 된 능곡역 인근에 위치한 능곡할머니북어탕은 전통의 북어탕 맛집이다." },
        "gobongsan-siraegi": { name: "고봉산시래기", desc: "고봉산 시래기는 일산동구 고봉산 아래에 있는 생선구이와 가마솥 밥 전문점이다." },
        "gom-taco": { name: "곰타코", desc: "곰타코는 백석역 근처에 있는 멕시코 음식점이다." },
        "the-nurungji": { name: "더 누룽지", desc: "더 누룽지는 경기도 고양시 덕이동, 덕이 초등학교 근처에 있는 해물누룽지탕 전문점이다." },
        "gaya-milmyeon-ilsan": { name: "가야밀면돼지국밥 일산본점", desc: "가야밀면돼지국밥 일산본점은 일산 대화동 킨텍스 건너편에 있는 밀면, 돼지국밥 맛집이다." },
        // 오더 #REV1 [2][3]: 미반영 4건 + drink-goyang. 원본 md 5로케일 완비 값 그대로.
        "jeongbalsan-cafe-street": { name: "鼎鉢山カフェ通り", desc: "小さなカフェが集まる路地" },
        "hallyu-world-dining": { name: "韓流ワールド飲食街", desc: "キンテックスから歩いて行ける食事エリア" },
        "bamridan-gil": { name: "バムリダン通り", desc: "住宅街の間にできた路地商圏" },
        "starfield-dining": { name: "スターフィールド高陽 飲食街", desc: "天気に左右されず食べられる場所" },
        "drink-goyang": { name: "高陽がつくるもの", desc: "珈琲を焙煎し、酒を醸す街" },
      },
      "zh-CN": {
        "lafesta": { name: "拉斐斯塔", desc: "热闹至深夜的街区商圈" },
        "westerndom": { name: "西部圆顶", desc: "与拉斐斯塔相对的另一条街" },
        "baekseok-food-alley": { name: "白石美食巷", desc: "下班后热闹的巷弄商圈" },
        "hwajeong-rodeo": { name: "花井罗迪欧街", desc: "德阳区的代表商圈" },
        "ilsan-traditional-market": { name: "一山传统市场", desc: "在市场里吃的一餐" },
        "daehwa-cafes": { name: "大化洞咖啡聚集区", desc: "湖水公园散步后的落脚处" },
        // 오더 #FD1 [1]: A안 — ko 복제.
        "neungwon-galbi": { name: "능원숯불갈비", desc: "능원숯불갈비는 고양시 용두동, 서오릉 정문 앞에 있는 숯불구이 전문점이다." },
        "neunggok-halmeoni-bugeotang": { name: "능곡할머니북어탕", desc: "현재는 폐역이 된 능곡역 인근에 위치한 능곡할머니북어탕은 전통의 북어탕 맛집이다." },
        "gobongsan-siraegi": { name: "고봉산시래기", desc: "고봉산 시래기는 일산동구 고봉산 아래에 있는 생선구이와 가마솥 밥 전문점이다." },
        "gom-taco": { name: "곰타코", desc: "곰타코는 백석역 근처에 있는 멕시코 음식점이다." },
        "the-nurungji": { name: "더 누룽지", desc: "더 누룽지는 경기도 고양시 덕이동, 덕이 초등학교 근처에 있는 해물누룽지탕 전문점이다." },
        "gaya-milmyeon-ilsan": { name: "가야밀면돼지국밥 일산본점", desc: "가야밀면돼지국밥 일산본점은 일산 대화동 킨텍스 건너편에 있는 밀면, 돼지국밥 맛집이다." },
        // 오더 #REV1 [2][3]: 미반영 4건 + drink-goyang. 원본 md 5로케일 완비 값 그대로.
        "jeongbalsan-cafe-street": { name: "鼎钵山咖啡街", desc: "小型咖啡馆聚集的巷弄" },
        "hallyu-world-dining": { name: "韩流世界餐饮街", desc: "从韩国国际展览中心步行可达的餐饮区" },
        "bamridan-gil": { name: "栗里断街", desc: "住宅区之间形成的巷弄商圈" },
        "starfield-dining": { name: "星芒城高阳餐饮区", desc: "不受天气影响的用餐场所" },
        "drink-goyang": { name: "高阳所酿所焙", desc: "焙咖啡、酿酒的城市" },
      },
      "zh-TW": {
        "lafesta": { name: "拉斐斯塔", desc: "熱鬧至深夜的街區商圈" },
        "westerndom": { name: "西部圓頂", desc: "與拉斐斯塔相對的另一條街" },
        "baekseok-food-alley": { name: "白石美食巷", desc: "下班後熱鬧的巷弄商圈" },
        "hwajeong-rodeo": { name: "花井羅迪歐街", desc: "德陽區的代表商圈" },
        "ilsan-traditional-market": { name: "一山傳統市場", desc: "在市場裡吃的一餐" },
        "daehwa-cafes": { name: "大化洞咖啡聚集區", desc: "湖水公園散步後的落腳處" },
        // 오더 #FD1 [1]: A안 — ko 복제.
        "neungwon-galbi": { name: "능원숯불갈비", desc: "능원숯불갈비는 고양시 용두동, 서오릉 정문 앞에 있는 숯불구이 전문점이다." },
        "neunggok-halmeoni-bugeotang": { name: "능곡할머니북어탕", desc: "현재는 폐역이 된 능곡역 인근에 위치한 능곡할머니북어탕은 전통의 북어탕 맛집이다." },
        "gobongsan-siraegi": { name: "고봉산시래기", desc: "고봉산 시래기는 일산동구 고봉산 아래에 있는 생선구이와 가마솥 밥 전문점이다." },
        "gom-taco": { name: "곰타코", desc: "곰타코는 백석역 근처에 있는 멕시코 음식점이다." },
        "the-nurungji": { name: "더 누룽지", desc: "더 누룽지는 경기도 고양시 덕이동, 덕이 초등학교 근처에 있는 해물누룽지탕 전문점이다." },
        "gaya-milmyeon-ilsan": { name: "가야밀면돼지국밥 일산본점", desc: "가야밀면돼지국밥 일산본점은 일산 대화동 킨텍스 건너편에 있는 밀면, 돼지국밥 맛집이다." },
        // 오더 #REV1 [2][3]: 미반영 4건 + drink-goyang. 원본 md 5로케일 완비 값 그대로.
        "jeongbalsan-cafe-street": { name: "鼎缽山咖啡街", desc: "小型咖啡館聚集的巷弄" },
        "hallyu-world-dining": { name: "韓流世界餐飲街", desc: "從韓國國際展覽中心步行可達的餐飲區" },
        "bamridan-gil": { name: "栗里斷街", desc: "住宅區之間形成的巷弄商圈" },
        "starfield-dining": { name: "星芒城高陽餐飲區", desc: "不受天氣影響的用餐場所" },
        "drink-goyang": { name: "高陽所釀所焙", desc: "焙咖啡、釀酒的城市" },
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
      // 오더 #REV1 [1]: spots-culture-kculture.md 미반영 05·08 (region 원본 확인필요 → 미설정).
      { id: "goyang-museum-of-art", name: "고양시립미술관", desc: "지역 미술을 보여주는 공간" },
      { id: "kkotnuri", name: "꽃누리", desc: "소규모 공연이 열리는 공간" },
    ],
    translations: {
      en: {
        "aramnuri": { name: "Goyang Aram Nuri", desc: "Goyang's main performing arts centre" },
        "eoullimnuri": { name: "Goyang Eoullim Nuri", desc: "The arts hub of Deokyang" },
        "hyundai-motorstudio": { name: "Hyundai Motorstudio Goyang", desc: "A large exhibition space built around cars" },
        "latin-america-museum": { name: "Museum of Latin American Art", desc: "A garden that brings Latin America to Goyang" },
        "aram-art-museum": { name: "Aram Art Museum", desc: "A gallery inside the arts centre" },
        "kintex": { name: "KINTEX", desc: "Korea's largest exhibition centre" },
        // 오더 #REV1 [1]: 원본 md 5로케일 완비 값 그대로.
        "goyang-museum-of-art": { name: "Goyang Museum of Art", desc: "A window on the city's art scene" },
        "kkotnuri": { name: "Kkot Nuri", desc: "A venue for smaller performances" },
      },
      ja: {
        "aramnuri": { name: "高陽アラムヌリ", desc: "高陽を代表する公演場" },
        "eoullimnuri": { name: "高陽オウルリムヌリ", desc: "徳陽区の公演·展示拠点" },
        "hyundai-motorstudio": { name: "現代モータースタジオ高陽", desc: "自動車をテーマにした大型展示空間" },
        "latin-america-museum": { name: "中南米文化院", desc: "ラテンアメリカを移した庭園" },
        "aram-art-museum": { name: "アラム美術館", desc: "公演場の中の展示空間" },
        "kintex": { name: "キンテックス", desc: "国内最大規模の展示場" },
        // 오더 #REV1 [1]: 원본 md 5로케일 완비 값 그대로.
        "goyang-museum-of-art": { name: "高陽市立美術館", desc: "地域の美術を見せる空間" },
        "kkotnuri": { name: "コンヌリ", desc: "小規模公演が開かれる空間" },
      },
      "zh-CN": {
        "aramnuri": { name: "高阳阿蓝世界", desc: "高阳代表性演出场馆" },
        "eoullimnuri": { name: "高阳和谐世界", desc: "德阳区演出与展览据点" },
        "hyundai-motorstudio": { name: "现代汽车文化馆高阳", desc: "以汽车为主题的大型展览空间" },
        "latin-america-museum": { name: "中南美文化院", desc: "移植拉丁美洲的庭园" },
        "aram-art-museum": { name: "阿蓝美术馆", desc: "演出场馆内的展览空间" },
        "kintex": { name: "韩国国际展览中心", desc: "韩国最大规模展览中心" },
        // 오더 #REV1 [1]: 원본 md 5로케일 완비 값 그대로.
        "goyang-museum-of-art": { name: "高阳市立美术馆", desc: "展现本地美术的空间" },
        "kkotnuri": { name: "花世界", desc: "举办小型演出的场地" },
      },
      "zh-TW": {
        "aramnuri": { name: "高陽阿藍世界", desc: "高陽代表性演出場館" },
        "eoullimnuri": { name: "高陽和諧世界", desc: "德陽區演出與展覽據點" },
        "hyundai-motorstudio": { name: "現代汽車文化館高陽", desc: "以汽車為主題的大型展覽空間" },
        "latin-america-museum": { name: "中南米文化院", desc: "移植拉丁美洲的庭園" },
        "aram-art-museum": { name: "阿藍美術館", desc: "演出場館內的展覽空間" },
        "kintex": { name: "韓國國際展覽中心", desc: "韓國最大規模展覽中心" },
        // 오더 #REV1 [1]: 원본 md 5로케일 완비 값 그대로.
        "goyang-museum-of-art": { name: "高陽市立美術館", desc: "展現本地美術的空間" },
        "kkotnuri": { name: "花世界", desc: "舉辦小型演出的場地" },
      },
    },
  },

  // 오더 #C8 [2][3] · #E1 [2] · #E2 [1]: K컬처 7 (learn·after-dark 추가).
  kculture: {
    category: "kculture",
    items: [
      { id: "goyang-tourist-center", name: "고양관광정보센터", desc: "벽화가 있는 정발산역 앞 안내소", region: "ilsan-east" },
      { id: "learn-kculture", name: "고양에서 배우는 K컬처", desc: "보는 것에서 해보는 것으로", region: "ilsan-east" },
      { id: "goyang-after-dark", name: "고양의 밤", desc: "한국 사람들이 저녁에 실제로 노는 방법", region: "ilsan-east" },
      { id: "goyang-stadium", name: "고양종합운동장", desc: "K팝 스타디움 공연이 열리는 곳", region: "ilsan-west" },
      { id: "kintex-kpop", name: "킨텍스 K팝 이벤트", desc: "팬 이벤트와 콘서트가 열리는 실내 무대", region: "ilsan-west" },
      { id: "hallyu-world", name: "한류월드", desc: "K컬처를 주제로 조성된 구역", region: "ilsan-west" },
      { id: "onemount", name: "원마운트", desc: "스노우파크와 워터파크가 있는 복합시설", region: "ilsan-west" },
    ],
    translations: {
      en: {
        "goyang-tourist-center": { name: "Goyang Tourist Information Center", desc: "The information center with the mural, by Jeongbalsan Station" },
        "learn-kculture": { name: "Learn K-Culture in Goyang", desc: "From watching to doing" },
        "goyang-after-dark": { name: "Goyang After Dark", desc: "How Koreans actually spend an evening" },
        "goyang-stadium": { name: "Goyang Stadium", desc: "Where K-pop stadium shows happen" },
        "kintex-kpop": { name: "K-pop Events at KINTEX", desc: "Indoor stages for fan events and concerts" },
        "hallyu-world": { name: "Hallyu World", desc: "A district built around Korean pop culture" },
        "onemount": { name: "One Mount", desc: "A complex with snow and water parks" },
      },
      ja: {
        "goyang-tourist-center": { name: "高陽観光情報センター", desc: "壁画のある鼎鉢山駅前の案内所" },
        "learn-kculture": { name: "高陽で学ぶKカルチャー", desc: "見ることから、やってみることへ" },
        "goyang-after-dark": { name: "高陽の夜", desc: "韓国の人が夕方に実際に遊ぶ方法" },
        "goyang-stadium": { name: "高陽総合運動場", desc: "K-POPスタジアム公演が開かれる場所" },
        "kintex-kpop": { name: "キンテックスK-POPイベント", desc: "ファンイベントとコンサートの屋内ステージ" },
        "hallyu-world": { name: "韓流ワールド", desc: "K-カルチャーをテーマにした区域" },
        "onemount": { name: "ワンマウント", desc: "スノーパークとウォーターパークのある複合施設" },
      },
      "zh-CN": {
        "goyang-tourist-center": { name: "高阳旅游信息中心", desc: "鼎钵山站前设有壁画的服务中心" },
        "learn-kculture": { name: "在高阳学习韩流文化", desc: "从观看到亲身体验" },
        "goyang-after-dark": { name: "高阳之夜", desc: "韩国人傍晚真正的消遣方式" },
        "goyang-stadium": { name: "高阳综合运动场", desc: "举办K-pop体育场演唱会之地" },
        "kintex-kpop": { name: "韩国国际展览中心K-pop活动", desc: "举办粉丝活动与演唱会的室内舞台" },
        "hallyu-world": { name: "韩流世界", desc: "以韩流文化为主题的区域" },
        "onemount": { name: "One Mount", desc: "设有雪世界与水上乐园的综合设施" },
      },
      "zh-TW": {
        "goyang-tourist-center": { name: "高陽旅遊資訊中心", desc: "鼎缽山站前設有壁畫的服務中心" },
        "learn-kculture": { name: "在高陽學習韓流文化", desc: "從觀看到親身體驗" },
        "goyang-after-dark": { name: "高陽之夜", desc: "韓國人傍晚真正的消遣方式" },
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
    // 오더 #C8 [2]: history +4 (행주산성 역사공원·흥국사·북한산성·고양 공양왕릉).
    items: [
      { id: "seooreung", name: "서오릉", desc: "왕릉 사이로 이어지는 숲길", region: "deokyang" },
      { id: "seosamneung", name: "서삼릉", desc: "조용히 걷기 좋은 왕릉 숲", region: "deokyang" },
      { id: "haengju-fortress", name: "행주산성", desc: "한강을 내려다보며 걷는 성곽길", region: "deokyang" },
      { id: "bamgasi-thatched-house", name: "고양 밤가시초가", desc: "신도시 한가운데 남은 옛집", region: "ilsan-east" },
      { id: "haengju-historical-park", name: "행주산성 역사공원", desc: "행주산성과 이어지는 역사 공원", region: "deokyang" },
      { id: "heungguksa-goyang", name: "흥국사 (고양)", desc: "북한산 자락의 유서 깊은 사찰", region: "deokyang" },
      { id: "bukhansanseong", name: "북한산성", desc: "고양·서울에 걸친 산성 유적", region: "deokyang" },
      { id: "gongyang-royal-tomb", name: "고양 공양왕릉", desc: "고려 마지막 왕이 잠든 곳", region: "deokyang" },
    ],
    translations: {
      en: {
        "seooreung": { name: "Seooreung Royal Tombs", desc: "Forest paths between royal tombs" },
        "seosamneung": { name: "Seosamneung Royal Tombs", desc: "A quiet woodland around royal tombs" },
        "haengju-fortress": { name: "Haengju Fortress", desc: "A fortress walk overlooking the Han River" },
        "bamgasi-thatched-house": { name: "Bamgasi Thatched House", desc: "An old farmhouse left in the middle of a new town" },
        "haengju-historical-park": { name: "Haengju Historical Park" },
        "heungguksa-goyang": { name: "Heungguksa Temple (Goyang)" },
        "bukhansanseong": { name: "Bukhansanseong Fortress" },
        "gongyang-royal-tomb": { name: "King Gongyang's Tomb (Goyang)" },
      },
      ja: {
        "seooreung": { name: "西五陵", desc: "王陵の間を抜ける森の道" },
        "seosamneung": { name: "西三陵", desc: "静かに歩ける王陵の森" },
        "haengju-fortress": { name: "幸州山城", desc: "漢江を見下ろしながら歩く城郭の道" },
        "bamgasi-thatched-house": { name: "高陽 バムガシ草家", desc: "新都市の真ん中に残る古い家" },
        "haengju-historical-park": { name: "幸州山城歴史公園" },
        "heungguksa-goyang": { name: "興国寺(高陽)" },
        "bukhansanseong": { name: "北漢山城" },
        "gongyang-royal-tomb": { name: "高陽 恭譲王陵" },
      },
      "zh-CN": {
        "seooreung": { name: "西五陵", desc: "穿行于王陵之间的林间小路" },
        "seosamneung": { name: "西三陵", desc: "适合静静漫步的王陵林地" },
        "haengju-fortress": { name: "幸州山城", desc: "俯瞰汉江的城郭步道" },
        "bamgasi-thatched-house": { name: "高阳栗刺草屋", desc: "留存于新城中心的老宅" },
        "haengju-historical-park": { name: "幸州山城历史公园" },
        "heungguksa-goyang": { name: "兴国寺 (高阳)" },
        "bukhansanseong": { name: "北汉山城" },
        "gongyang-royal-tomb": { name: "高阳 恭让王陵" },
      },
      "zh-TW": {
        "seooreung": { name: "西五陵", desc: "穿行於王陵之間的林間小路" },
        "seosamneung": { name: "西三陵", desc: "適合靜靜漫步的王陵林地" },
        "haengju-fortress": { name: "幸州山城", desc: "俯瞰漢江的城郭步道" },
        "bamgasi-thatched-house": { name: "高陽栗刺草屋", desc: "留存於新城中心的老宅" },
        "haengju-historical-park": { name: "幸州山城歷史公園" },
        "heungguksa-goyang": { name: "興國寺 (高陽)" },
        "bukhansanseong": { name: "北漢山城" },
        "gongyang-royal-tomb": { name: "高陽 恭讓王陵" },
      },
    },
  },

  // 오더 #C8 [2][3]: family 2. onemount(kculture 도 등재) · kintex-walkway(walk 도 등재).
  //   #C8 [2] family +2 추가: 아쿠아플라넷 일산 · 일산 어린이천문대.
  family: {
    category: "family",
    items: [
      { id: "onemount", name: "원마운트", desc: "스노우파크와 워터파크가 있는 복합시설", region: "ilsan-west" },
      { id: "kintex-walkway", name: "킨텍스 일대 산책로", desc: "전시 일정 사이에 걷는 길", region: "ilsan-west" },
      { id: "aquaplanet-ilsan", name: "아쿠아플라넷 일산", desc: "한류월드 안 실내 수족관", region: "ilsan-west" },
      { id: "ilsan-childrens-observatory", name: "일산 어린이천문대", desc: "천체 관측 체험 시설", region: "ilsan-east" },
    ],
    translations: {
      en: {
        "onemount": { name: "One Mount", desc: "A complex with snow and water parks" },
        "kintex-walkway": { name: "KINTEX Area Walkway", desc: "A walk between exhibition sessions" },
        "aquaplanet-ilsan": { name: "Aqua Planet Ilsan" },
        "ilsan-childrens-observatory": { name: "Ilsan Children's Observatory" },
      },
      ja: {
        "onemount": { name: "ワンマウント", desc: "スノーパークとウォーターパークのある複合施設" },
        "kintex-walkway": { name: "キンテックス一帯の遊歩道", desc: "展示の合間に歩く道" },
        "aquaplanet-ilsan": { name: "アクアプラネット一山" },
        "ilsan-childrens-observatory": { name: "一山こども天文台" },
      },
      "zh-CN": {
        "onemount": { name: "One Mount", desc: "设有雪世界与水上乐园的综合设施" },
        "kintex-walkway": { name: "韩国国际展览中心一带步道", desc: "展会间隙可走的步道" },
        "aquaplanet-ilsan": { name: "水族館 一山" },
        "ilsan-childrens-observatory": { name: "一山儿童天文台" },
      },
      "zh-TW": {
        "onemount": { name: "One Mount", desc: "設有雪世界與水上樂園的綜合設施" },
        "kintex-walkway": { name: "韓國國際展覽中心一帶步道", desc: "展會間隙可走的步道" },
        "aquaplanet-ilsan": { name: "水族館 一山" },
        "ilsan-childrens-observatory": { name: "一山兒童天文台" },
      },
    },
  },

  // ─── 오더 #B1 [1]: SHOPPING 12곳 ─────────────────────────────────────────
  //   9곳은 이번 오더 신규 spot (starfield-goyang·wondang-market·lottemart-goyang·
  //   ilsan-furniture-district·emart-ilsan·homeplus-goyang-terminal·
  //   hyundai-dept-kintex·homeplus-kintex·deoki-rodeo).
  //   3곳은 기존 spot 재사용 (lafesta·westerndom·ilsan-traditional-market) —
  //   다른 카테고리에서도 이미 노출되지만, 쇼핑 앵커성 강해 이 목록에도 등재.
  //   desc 는 TourAPI overview 1문장 발췌 (창작·의역 금지).
  shopping: {
    category: "shopping",
    items: [
      { id: "starfield-goyang", name: "스타필드 고양", desc: "서울과 경기 서북부를 연결하는 관문적 위치의 대형 복합쇼핑몰", region: "deokyang" },
      { id: "wondang-market", name: "원당시장", desc: "오랜 역사와 전통을 자랑하는 덕양구 대표 재래시장", region: "deokyang" },
      { id: "lottemart-goyang", name: "롯데마트 고양점", desc: "신선식품·생활용품·패션을 두루 갖춘 대형마트", region: "deokyang" },
      { id: "ilsan-furniture-district", name: "일산가구단지", desc: "고양에 위치한 대형 규모의 가구단지", region: "ilsan-west" },
      { id: "lafesta", name: "라페스타", desc: "일산 신도시 중심상업용지의 보행자 스트리트몰", region: "ilsan-east" },
      { id: "westerndom", name: "웨스턴돔", desc: "라페스타와 함께 일산을 대표하는 스트리트형 쇼핑몰", region: "ilsan-east" },
      { id: "emart-ilsan", name: "이마트 일산점", desc: "신선식품·생활용품·패션용품을 두루 갖춘 대형마트", region: "ilsan-east" },
      { id: "homeplus-goyang-terminal", name: "홈플러스 고양터미널점", desc: "고양종합터미널에 인접한 대형마트", region: "ilsan-east" },
      { id: "ilsan-traditional-market", name: "일산시장", desc: "1908년 경의선 철도 개통과 함께 형성된 오래된 시장", region: "ilsan-west" },
      { id: "hyundai-dept-kintex", name: "현대백화점 킨텍스점", desc: "고객의 삶에 품격과 여유를 더하는 프리미엄 라이프스타일 문화 공간", region: "ilsan-west" },
      { id: "homeplus-kintex", name: "홈플러스 킨텍스점", desc: "킨텍스 인근 대형마트", region: "ilsan-west" },
      { id: "deoki-rodeo", name: "덕이동 로데오거리", desc: "국내 최고의 패션브랜드들이 입점한 아울렛형 상권", region: "ilsan-west" },
    ],
    translations: {
      en: {
        "starfield-goyang": { name: "Starfield Goyang" },
        "wondang-market": { name: "Wondang Market" },
        "lottemart-goyang": { name: "Lotte Mart Goyang" },
        "ilsan-furniture-district": { name: "Ilsan Furniture District" },
        "lafesta": { name: "Lafesta" },
        "westerndom": { name: "Westerndom" },
        "emart-ilsan": { name: "E-Mart Ilsan" },
        "homeplus-goyang-terminal": { name: "Homeplus Goyang Terminal" },
        "ilsan-traditional-market": { name: "Ilsan Traditional Market" },
        "hyundai-dept-kintex": { name: "The Hyundai Kintex" },
        "homeplus-kintex": { name: "Homeplus Kintex" },
        "deoki-rodeo": { name: "Deoki-dong Rodeo Street" },
      },
      ja: {
        "starfield-goyang": { name: "スターフィールド高陽" },
        "wondang-market": { name: "元堂市場" },
        "lottemart-goyang": { name: "ロッテマート高陽店" },
        "ilsan-furniture-district": { name: "一山家具団地" },
        "lafesta": { name: "ラフェスタ" },
        "westerndom": { name: "ウェスタンドーム" },
        "emart-ilsan": { name: "イーマート一山店" },
        "homeplus-goyang-terminal": { name: "ホームプラス高陽ターミナル店" },
        "ilsan-traditional-market": { name: "一山市場" },
        "hyundai-dept-kintex": { name: "現代百貨店キンテックス店" },
        "homeplus-kintex": { name: "ホームプラスキンテックス店" },
        "deoki-rodeo": { name: "徳耳洞ロデオストリート" },
      },
      "zh-CN": {
        "starfield-goyang": { name: "Starfield 高阳" },
        "wondang-market": { name: "元堂市场" },
        "lottemart-goyang": { name: "乐天玛特高阳店" },
        "ilsan-furniture-district": { name: "一山家具园区" },
        "lafesta": { name: "Lafesta" },
        "westerndom": { name: "Westerndom" },
        "emart-ilsan": { name: "易买得一山店" },
        "homeplus-goyang-terminal": { name: "家乐福高阳客运站店" },
        "ilsan-traditional-market": { name: "一山市场" },
        "hyundai-dept-kintex": { name: "现代百货 KINTEX 店" },
        "homeplus-kintex": { name: "家乐福 KINTEX 店" },
        "deoki-rodeo": { name: "德耳洞罗迪欧街" },
      },
      "zh-TW": {
        "starfield-goyang": { name: "Starfield 高陽" },
        "wondang-market": { name: "元堂市場" },
        "lottemart-goyang": { name: "樂天瑪特高陽店" },
        "ilsan-furniture-district": { name: "一山家具園區" },
        "lafesta": { name: "Lafesta" },
        "westerndom": { name: "Westerndom" },
        "emart-ilsan": { name: "易買得一山店" },
        "homeplus-goyang-terminal": { name: "家樂福高陽客運站店" },
        "ilsan-traditional-market": { name: "一山市場" },
        "hyundai-dept-kintex": { name: "現代百貨 KINTEX 店" },
        "homeplus-kintex": { name: "家樂福 KINTEX 店" },
        "deoki-rodeo": { name: "德耳洞羅迪歐街" },
      },
    },
  },

  // ─── 오더 #B1 [1]: STAY 7곳 (TourAPI contentTypeId=32 전량) ───────────────
  //   MICE 필수 축. 12곳 억지 발굴 없이 인벤토리 실측 7곳으로 확정.
  //   KINTEX 인근 3곳 명시 (소노캄·룩소르·케이트리).
  stay: {
    category: "stay",
    items: [
      { id: "hotel-the-wynn", name: "호텔 더 윈", desc: "원흥동의 IoT 음성인식 스마트 호텔", region: "deokyang" },
      { id: "gyisc-youth-center", name: "고양국제청소년문화센터 유스센터", desc: "청소년 수련활동을 위한 문화 숙박 시설", region: "ilsan-east" },
      { id: "lakebay-hostel", name: "레이크베이 호스텔", desc: "장항동 라페스타·웨스턴돔 인근 신축 호스텔", region: "ilsan-east" },
      { id: "sono-calm-goyang", name: "소노캄 고양", desc: "킨텍스 인근 5성급 호텔", region: "ilsan-east" },
      { id: "deohyusik-anok-tanhyun", name: "더휴식 아늑호텔 일산탄현점", desc: "테마 객실을 갖춘 부티크 숙소", region: "ilsan-west" },
      { id: "hotel-luxor", name: "룩소르 호텔", desc: "대화역 5번 출구 인근 실속형 호텔", region: "ilsan-west" },
      { id: "kintex-by-ktree", name: "킨텍스 바이 케이트리", desc: "킨텍스 제1전시장 옆 레지던스 호텔", region: "ilsan-west" },
    ],
    translations: {
      en: {
        "hotel-the-wynn": { name: "Hotel The Wynn" },
        "gyisc-youth-center": { name: "Goyang Int'l Youth Culture Center" },
        "lakebay-hostel": { name: "Lakebay Hostel" },
        "sono-calm-goyang": { name: "Sono Calm Goyang" },
        "deohyusik-anok-tanhyun": { name: "DeoHyuSik Anok Hotel Ilsan Tanhyun" },
        "hotel-luxor": { name: "Hotel Luxor" },
        "kintex-by-ktree": { name: "Kintex by K-Tree" },
      },
      ja: {
        "hotel-the-wynn": { name: "ホテル ザ ウィン" },
        "gyisc-youth-center": { name: "高陽国際青少年文化センターユースセンター" },
        "lakebay-hostel": { name: "レイクベイ ホステル" },
        "sono-calm-goyang": { name: "ソノカーム高陽" },
        "deohyusik-anok-tanhyun": { name: "ドヒュシク アヌク ホテル 一山炭峴店" },
        "hotel-luxor": { name: "ルクソール ホテル" },
        "kintex-by-ktree": { name: "キンテックス バイ Kツリー" },
      },
      "zh-CN": {
        "hotel-the-wynn": { name: "The Wynn 酒店" },
        "gyisc-youth-center": { name: "高阳国际青少年文化中心 Youth Center" },
        "lakebay-hostel": { name: "Lakebay 青旅" },
        "sono-calm-goyang": { name: "Sono Calm 高阳" },
        "deohyusik-anok-tanhyun": { name: "DeoHyuSik Anok 酒店 一山炭岘店" },
        "hotel-luxor": { name: "Luxor 酒店" },
        "kintex-by-ktree": { name: "Kintex by K-Tree" },
      },
      "zh-TW": {
        "hotel-the-wynn": { name: "The Wynn 酒店" },
        "gyisc-youth-center": { name: "高陽國際青少年文化中心 Youth Center" },
        "lakebay-hostel": { name: "Lakebay 青旅" },
        "sono-calm-goyang": { name: "Sono Calm 高陽" },
        "deohyusik-anok-tanhyun": { name: "DeoHyuSik Anok 酒店 一山炭峴店" },
        "hotel-luxor": { name: "Luxor 酒店" },
        "kintex-by-ktree": { name: "Kintex by K-Tree" },
      },
    },
  },

  // ─── 오더 #B1 [1]: NIGHT 9곳 (기존 42스팟 재사용, A안) ───────────────────
  //   유흥·주점(drink-goyang) 제외 확정. shopping/dining 카테고리 중복 허용.
  //   9곳 확보 · 12곳 억지 채우기 안 함.
  //   근거: overview 야간·야경·일루미네이션 명시 5 + 야간 성격 뚜렷 4.
  night: {
    category: "night",
    items: [
      { id: "ilsan-lake-park", name: "일산호수공원", desc: "해질 무렵 호수에 비친 도시 불빛과 야경", region: "ilsan-east" },
      { id: "westerndom", name: "웨스턴돔", desc: "돔 구조 천장에 형형색색의 조명이 켜지는 야간", region: "ilsan-east" },
      { id: "lafesta", name: "라페스타", desc: "일산 신도시의 보행자 스트리트몰 · 야간 상권", region: "ilsan-east" },
      { id: "bamridan-gil", name: "밤리단길", desc: "예쁜 연못과 노래하는 분수대가 있는 야경 골목", region: "ilsan-east" },
      { id: "onemount", name: "원마운트", desc: "스노우파크·워터파크를 갖춘 야간 개장 복합시설", region: "ilsan-west" },
      { id: "kintex-kpop", name: "킨텍스 K-POP", desc: "K-POP 콘서트·팬 이벤트가 열리는 야간 공연 거점", region: "ilsan-west" },
      { id: "hallyu-world-dining", name: "한류월드 다이닝", desc: "킨텍스 인근 야간 상권", region: "ilsan-west" },
      { id: "starfield-dining", name: "스타필드 다이닝", desc: "스타필드 고양의 야간 다이닝 존", region: "deokyang" },
      { id: "goyang-after-dark", name: "고양의 밤", desc: "관광지가 아닌 고양의 밤 생활문화 코스", region: "ilsan-east" },
    ],
    translations: {
      en: {
        "ilsan-lake-park": { name: "Ilsan Lake Park", desc: "City lights on the lake at dusk" },
        "westerndom": { name: "Westerndom", desc: "The dome ceiling lights up after dark" },
        "lafesta": { name: "Lafesta", desc: "A pedestrian street mall that keeps going into the night" },
        "bamridan-gil": { name: "Bamridan-gil", desc: "A lit-up alley with a pond and singing fountain" },
        "onemount": { name: "One Mount", desc: "A snow-and-water park complex with evening hours" },
        "kintex-kpop": { name: "KINTEX K-POP", desc: "The hub of evening K-POP concerts and fan events" },
        "hallyu-world-dining": { name: "Hallyu World Dining", desc: "An evening dining district near KINTEX" },
        "starfield-dining": { name: "Starfield Dining", desc: "The evening dining zone inside Starfield Goyang" },
        "goyang-after-dark": { name: "Goyang After Dark", desc: "Goyang's after-hours life — not the tourist version" },
      },
      ja: {
        "ilsan-lake-park": { name: "一山湖水公園", desc: "夕暮れ時、湖に映る街の灯り" },
        "westerndom": { name: "ウェスタンドーム", desc: "夜になるとドーム天井に色とりどりの照明" },
        "lafesta": { name: "ラフェスタ", desc: "夜まで賑わう歩行者ストリートモール" },
        "bamridan-gil": { name: "バムリダン通り", desc: "池と歌う噴水のある夜景の路地" },
        "onemount": { name: "ワンマウント", desc: "夜間営業のスノー・ウォーター複合施設" },
        "kintex-kpop": { name: "キンテックス K-POP", desc: "K-POPコンサートやファンイベントの夜間拠点" },
        "hallyu-world-dining": { name: "韓流ワールド ダイニング", desc: "キンテックス近くの夜間商圏" },
        "starfield-dining": { name: "スターフィールド ダイニング", desc: "スターフィールド高陽の夜間ダイニング" },
        "goyang-after-dark": { name: "高陽の夜", desc: "観光地ではない、高陽の夜の生活文化コース" },
      },
      "zh-CN": {
        "ilsan-lake-park": { name: "一山湖水公园", desc: "傍晚湖面倒映的城市灯光" },
        "westerndom": { name: "Westerndom", desc: "入夜后穹顶亮起五彩灯光" },
        "lafesta": { name: "Lafesta", desc: "延续到夜晚的步行街商圈" },
        "bamridan-gil": { name: "栗里断街", desc: "有池塘与音乐喷泉的夜景巷" },
        "onemount": { name: "One Mount", desc: "夜间开放的雪世界与水乐园综合设施" },
        "kintex-kpop": { name: "KINTEX K-POP", desc: "K-POP 演唱会与粉丝活动的夜间据点" },
        "hallyu-world-dining": { name: "韩流世界餐饮区", desc: "KINTEX 附近的夜间商圈" },
        "starfield-dining": { name: "Starfield 餐饮区", desc: "Starfield 高阳的夜间餐饮区" },
        "goyang-after-dark": { name: "高阳之夜", desc: "非观光化的高阳夜晚生活文化路线" },
      },
      "zh-TW": {
        "ilsan-lake-park": { name: "一山湖水公園", desc: "傍晚湖面倒映的城市燈光" },
        "westerndom": { name: "Westerndom", desc: "入夜後穹頂亮起五彩燈光" },
        "lafesta": { name: "Lafesta", desc: "延續到夜晚的步行街商圈" },
        "bamridan-gil": { name: "栗里斷街", desc: "有池塘與音樂噴泉的夜景巷" },
        "onemount": { name: "One Mount", desc: "夜間開放的雪世界與水樂園綜合設施" },
        "kintex-kpop": { name: "KINTEX K-POP", desc: "K-POP 演唱會與粉絲活動的夜間據點" },
        "hallyu-world-dining": { name: "韓流世界餐飲區", desc: "KINTEX 附近的夜間商圈" },
        "starfield-dining": { name: "Starfield 餐飲區", desc: "Starfield 高陽的夜間餐飲區" },
        "goyang-after-dark": { name: "高陽之夜", desc: "非觀光化的高陽夜晚生活文化路線" },
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
