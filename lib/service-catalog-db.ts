import { createClient } from "@supabase/supabase-js";

import type { ServiceCatalogCategory, ServiceCatalogItem } from "@/data/service-catalog";
import { serviceCatalog as defaultCatalog } from "@/data/service-catalog";

export type CatalogMap = Record<ServiceCatalogCategory, ServiceCatalogItem[]>;

// 기본 빈 카탈로그 (DB가 비어있을 때 사용)
const EMPTY_MAP: CatalogMap = { tour: [], stay: [], restaurant: [], cafe: [], airport: [], medical: [] };

const PAGE_KEY = "service-catalog";

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase 환경변수가 설정되지 않았습니다.");
  return createClient(url, key);
}

/** DB에서 카탈로그 읽기. 없으면 기본 하드코딩 데이터 반환 */
export async function readServiceCatalog(): Promise<CatalogMap> {
  try {
    const supabase = getSupabaseClient();
    const { data } = await supabase
      .from("pages")
      .select("*")
      .eq("pageKey", PAGE_KEY)
      .single();
    // Supabase는 컬럼명을 소문자(contentjson)로 반환할 수 있으므로 양쪽 모두 처리
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const raw = data as any;
    const contentJson = raw?.contentJson ?? raw?.contentjson ?? null;
    if (!contentJson) return defaultCatalog as CatalogMap;
    // DB 데이터에 없거나 빈 카테고리는 정적 카탈로그로 보충
    const dbData = contentJson as Partial<CatalogMap>;
    const cats: ServiceCatalogCategory[] = ["tour", "stay", "restaurant", "cafe", "airport", "medical"];
    const merged = { ...EMPTY_MAP };
    for (const cat of cats) {
      const dbItems = dbData[cat];
      merged[cat] = (dbItems && dbItems.length > 0) ? dbItems : (defaultCatalog[cat] ?? []);
    }
    return merged;
  } catch {
    return defaultCatalog as CatalogMap;
  }
}

/** 카탈로그 전체 저장 (upsert) */
export async function writeServiceCatalog(catalog: CatalogMap): Promise<void> {
  const supabase = getSupabaseClient();
  const { data: existing } = await supabase
    .from("pages")
    .select("id")
    .eq("pageKey", PAGE_KEY)
    .single();

  if (existing) {
    await supabase
      .from("pages")
      .update({ contentJson: catalog, updatedAt: new Date().toISOString() })
      .eq("pageKey", PAGE_KEY);
  } else {
    await supabase.from("pages").insert({
      id: crypto.randomUUID(),
      pageKey: PAGE_KEY,
      title: "Service Catalog",
      slug: PAGE_KEY,
      contentJson: catalog,
      status: "PUBLISHED",
      lang: "ko",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }
}

/** 카테고리에 상품 추가 */
export async function addServiceCatalogItem(
  category: ServiceCatalogCategory,
  item: ServiceCatalogItem
): Promise<CatalogMap> {
  const catalog = await readServiceCatalog();
  catalog[category] = [...(catalog[category] ?? []), item];
  await writeServiceCatalog(catalog);
  return catalog;
}

/** 카테고리의 특정 상품 수정 */
export async function updateServiceCatalogItem(
  category: ServiceCatalogCategory,
  item: ServiceCatalogItem
): Promise<CatalogMap> {
  const catalog = await readServiceCatalog();
  const idx = (catalog[category] ?? []).findIndex((i) => i.id === item.id);
  if (idx === -1) throw new Error("상품을 찾을 수 없습니다.");
  catalog[category][idx] = item;
  await writeServiceCatalog(catalog);
  return catalog;
}

/** 카테고리의 특정 상품 삭제 */
export async function deleteServiceCatalogItem(
  category: ServiceCatalogCategory,
  id: string
): Promise<CatalogMap> {
  const catalog = await readServiceCatalog();
  catalog[category] = (catalog[category] ?? []).filter((i) => i.id !== id);
  await writeServiceCatalog(catalog);
  return catalog;
}
