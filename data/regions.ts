// 지역(구·시·특별지역) 확장형 목록 — SSOT.
//
// 확장 원칙:
//   · 새 지역은 이 배열에 push (enum·컴파일 타임 고정 아님).
//   · hierarchy 로 상위 그룹 (goyang / seoul / paju / gimpo / dmz) — 미래 확장.
//   · 라벨은 5로케일 (ko 기본, 나머지는 translations).
//   · order 오름차순으로 UI에 노출.
//
// 미래 확장 예시 (참고, 추가 시 이 파일에 push만):
//   { key: "seoul-jongno", label: "종로구", hierarchy: "seoul", order: 100, ... }
//   { key: "paju-heyri",   label: "헤이리", hierarchy: "paju",  order: 200, ... }
//   { key: "dmz-imjingak", label: "임진각", hierarchy: "dmz",   order: 400, ... }

export type RegionHierarchy = "goyang" | "seoul" | "paju" | "gimpo" | "dmz";

export type RegionLocale = "ko" | "en" | "ja" | "zh-CN" | "zh-TW";

export interface Region {
  /** URL·데이터 참조용 kebab-case key (컴파일 enum 아님 — 관리자 UI 이관 대비) */
  key: string;
  /** ko 기본 라벨 */
  label: string;
  hierarchy: RegionHierarchy;
  order: number;
  translations?: Partial<Record<Exclude<RegionLocale, "ko">, string>>;
}

export const regions: Region[] = [
  {
    key: "deokyang",
    label: "덕양구",
    hierarchy: "goyang",
    order: 10,
    translations: {
      en: "Deokyang-gu",
      ja: "徳陽区",
      "zh-CN": "德阳区",
      "zh-TW": "德陽區",
    },
  },
  {
    key: "ilsan-east",
    label: "일산동구",
    hierarchy: "goyang",
    order: 20,
    translations: {
      en: "Ilsandong-gu",
      ja: "一山東区",
      "zh-CN": "一山东区",
      "zh-TW": "一山東區",
    },
  },
  {
    key: "ilsan-west",
    label: "일산서구",
    hierarchy: "goyang",
    order: 30,
    translations: {
      en: "Ilsanseo-gu",
      ja: "一山西区",
      "zh-CN": "一山西区",
      "zh-TW": "一山西區",
    },
  },
];

export function getRegion(key: string): Region | undefined {
  return regions.find((r) => r.key === key);
}

export function getRegionLabel(key: string, locale: RegionLocale): string {
  const region = getRegion(key);
  if (!region) return key;
  if (locale === "ko") return region.label;
  return region.translations?.[locale] ?? region.label;
}
