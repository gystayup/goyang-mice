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
    // 오더 #C5 [2]: 10선 순서 (01~10) 그대로. name/desc 는 data/spots.ts 의
    //   각 스팟 title.ko / subtitle.ko 그대로. region 은 regions.ts key.
    //   덕양구는 실제 key "deokyang" (오더의 "deogyang" 은 오탈자로 판단).
    items: [
      { id: "ilsan-lake-park", name: "일산호수공원", desc: "도심 한가운데 호수를 한 바퀴 도는 길", region: "ilsan-east" },
      { id: "jeongbalsan-park", name: "정발산근린공원", desc: "도심에서 바로 오르는 낮은 산", region: "ilsan-east" },
      { id: "haengju-fortress", name: "행주산성", desc: "한강을 내려다보며 걷는 성곽길", region: "deokyang" },
      { id: "changneungcheon-trail", name: "창릉천 산책로", desc: "물길을 따라 이어지는 평지 코스", region: "deokyang" },
      { id: "seooreung", name: "서오릉", desc: "왕릉 사이로 이어지는 숲길", region: "deokyang" },
      { id: "seosamneung", name: "서삼릉", desc: "조용히 걷기 좋은 왕릉 숲", region: "deokyang" },
      { id: "bamgasi-thatched-house", name: "고양 밤가시초가", desc: "신도시 한가운데 남은 옛집", region: "ilsan-east" },
      { id: "eoullimnuri-park", name: "고양어울림누리 누리공원", desc: "공연장을 둘러싼 잔디 마당", region: "deokyang" },
      { id: "aramnuri-plaza", name: "고양아람누리 야외광장", desc: "곡선 지붕 아래 열린 광장", region: "ilsan-east" },
      { id: "kintex-walkway", name: "킨텍스 일대 산책로", desc: "전시 일정 사이에 걷는 길", region: "ilsan-west" },
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
        "bamgasi-thatched-house": { name: "Bamgasi Thatched House", desc: "An old farmhouse left in the middle of a new town" },
        "eoullimnuri-park": { name: "Nuri Park at Goyang Eoullim Nuri", desc: "Lawns around a performing arts complex" },
        "aramnuri-plaza": { name: "Aram Nuri Outdoor Plaza", desc: "An open plaza beneath a curved roof" },
        "kintex-walkway": { name: "KINTEX Area Walkway", desc: "A walk between exhibition sessions" },
      },
      ja: {
        "ilsan-lake-park": { name: "一山湖水公園", desc: "都心の真ん中で湖を一周する道" },
        "jeongbalsan-park": { name: "鼎鉢山近隣公園", desc: "都心からすぐ登れる低い山" },
        "haengju-fortress": { name: "幸州山城", desc: "漢江を見下ろしながら歩く城郭の道" },
        "changneungcheon-trail": { name: "昌陵川遊歩道", desc: "水辺に沿って続く平坦なコース" },
        "seooreung": { name: "西五陵", desc: "王陵の間を抜ける森の道" },
        "seosamneung": { name: "西三陵", desc: "静かに歩ける王陵の森" },
        "bamgasi-thatched-house": { name: "高陽 バムガシ草家", desc: "新都市の真ん中に残る古い家" },
        "eoullimnuri-park": { name: "高陽オウルリムヌリ ヌリ公園", desc: "公演場を囲む芝生の広場" },
        "aramnuri-plaza": { name: "高陽アラムヌリ 屋外広場", desc: "曲線の屋根の下に開かれた広場" },
        "kintex-walkway": { name: "キンテックス一帯の遊歩道", desc: "展示の合間に歩く道" },
      },
      "zh-CN": {
        "ilsan-lake-park": { name: "一山湖水公园", desc: "环绕城市中心湖泊的步道" },
        "jeongbalsan-park": { name: "鼎钵山近邻公园", desc: "从市中心即可登上的小山" },
        "haengju-fortress": { name: "幸州山城", desc: "俯瞰汉江的城郭步道" },
        "changneungcheon-trail": { name: "昌陵川步道", desc: "沿溪流延伸的平坦路线" },
        "seooreung": { name: "西五陵", desc: "穿行于王陵之间的林间小路" },
        "seosamneung": { name: "西三陵", desc: "适合静静漫步的王陵林地" },
        "bamgasi-thatched-house": { name: "高阳栗刺草屋", desc: "留存于新城中心的老宅" },
        "eoullimnuri-park": { name: "高阳和谐世界 世界公园", desc: "环绕演出场馆的草坪广场" },
        "aramnuri-plaza": { name: "高阳阿蓝世界 户外广场", desc: "曲线屋顶下的开放广场" },
        "kintex-walkway": { name: "韩国国际展览中心一带步道", desc: "展会间隙可走的步道" },
      },
      "zh-TW": {
        "ilsan-lake-park": { name: "一山湖水公園", desc: "環繞城市中心湖泊的步道" },
        "jeongbalsan-park": { name: "鼎缽山近鄰公園", desc: "從市中心即可登上的小山" },
        "haengju-fortress": { name: "幸州山城", desc: "俯瞰漢江的城郭步道" },
        "changneungcheon-trail": { name: "昌陵川步道", desc: "沿溪流延伸的平坦路線" },
        "seooreung": { name: "西五陵", desc: "穿行於王陵之間的林間小路" },
        "seosamneung": { name: "西三陵", desc: "適合靜靜漫步的王陵林地" },
        "bamgasi-thatched-house": { name: "高陽栗刺草屋", desc: "留存於新城中心的老宅" },
        "eoullimnuri-park": { name: "高陽和諧世界 世界公園", desc: "環繞演出場館的草坪廣場" },
        "aramnuri-plaza": { name: "高陽阿藍世界 戶外廣場", desc: "曲線屋頂下的開放廣場" },
        "kintex-walkway": { name: "韓國國際展覽中心一帶步道", desc: "展會間隙可走的步道" },
      },
    },
  },
  food: { category: "food", items: [] },
  culture: { category: "culture", items: [] },
  kculture: { category: "kculture", items: [] },
  history: { category: "history", items: [] },
  family: { category: "family", items: [] },
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
