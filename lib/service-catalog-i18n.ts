import type {
  ServiceCatalogCategory,
  ServiceCatalogItem,
  ServiceLocale,
} from "@/data/service-catalog";
import { serviceCatalog as staticCatalog } from "@/data/service-catalog";

/**
 * 상품 데이터에 현재 locale 번역을 적용한 객체를 반환.
 *
 * DB에서 읽은 상품에는 `translations`가 없을 수 있으므로,
 * 같은 id를 가진 static 파일의 상품에서 번역을 찾아 보충함.
 *
 * 번역이 전혀 없으면 한국어 원본(기본값)을 그대로 사용.
 */
export function getLocalizedServiceItem<T extends ServiceCatalogItem>(
  item: T,
  locale: string
): T {
  // 한국어 또는 지원되지 않는 locale이면 원본 반환
  if (locale === "ko" || !isServiceLocale(locale)) {
    return item;
  }

  // 1) 아이템 자체에서 번역 찾기
  let t = item.translations?.[locale];

  // 2) 없으면 static 카탈로그에서 같은 id 상품의 번역 찾기 (DB 데이터 대응)
  if (!t) {
    const staticItem = findStaticItemById(item.id);
    t = staticItem?.translations?.[locale];
  }

  if (!t) return item;

  return {
    ...item,
    title: t.title ?? item.title,
    subtitle: t.subtitle ?? item.subtitle,
    location: t.location ?? item.location,
    dateText: t.dateText ?? item.dateText,
    posterLabel: t.posterLabel ?? item.posterLabel,
    summary: t.summary ?? item.summary,
    description: t.description ?? item.description,
    tags: t.tags ?? item.tags,
    meetingPoint: t.meetingPoint ?? item.meetingPoint,
    meetingPointAddress: t.meetingPointAddress ?? item.meetingPointAddress,
    meetingPointNote: t.meetingPointNote ?? item.meetingPointNote,
    tabNotice: t.tabNotice ?? item.tabNotice,
    tabDetails: t.tabDetails ?? item.tabDetails,
    tabUsageInfo: t.tabUsageInfo ?? item.tabUsageInfo,
    tabCancellation: t.tabCancellation ?? item.tabCancellation,
    highlights: t.highlights ?? item.highlights,
    includes: t.includes ?? item.includes,
    couponGuide: t.couponGuide ?? item.couponGuide,
  };
}

function findStaticItemById(id: string): ServiceCatalogItem | undefined {
  const categories: ServiceCatalogCategory[] = [
    "tour",
    "stay",
    "restaurant",
    "cafe",
    "airport",
  ];
  for (const cat of categories) {
    const items = staticCatalog[cat];
    if (!items) continue;
    const found = items.find((i) => i.id === id);
    if (found) return found;
  }
  return undefined;
}

function isServiceLocale(locale: string): locale is ServiceLocale {
  return (
    locale === "en" || locale === "ja" || locale === "zh-CN" || locale === "zh-TW"
  );
}
