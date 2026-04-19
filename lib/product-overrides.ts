import { createClient } from "@supabase/supabase-js";

// 관리자 상품 패널에서 편집 가능한 필드
export type ProductOverrideData = {
  adminStatus?: "live" | "draft" | "hidden";
  managerNote?: string;
  summary?: string;
  title?: string;
  desc?: string;
  price?: number;
  people?: string;
  duration?: string;
  reservationFeatures?: string[];
  operationFeatures?: string[];
  managementFeatures?: string[];
  paymentFeatures?: string[];
};

export type ProductOverridesMap = Record<string, ProductOverrideData>;

const PAGE_KEY = "product-overrides";

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase 환경변수가 설정되지 않았습니다.");
  return createClient(url, key);
}

/**
 * pages 테이블 한 row 에 { [productId]: overrides } 맵 형태로 저장합니다.
 * 기존 service-catalog 와 동일한 패턴을 사용해 별도 스키마 변경 없이 즉시 동작합니다.
 */
export async function readProductOverrides(): Promise<ProductOverridesMap> {
  try {
    const supabase = getSupabaseClient();
    const { data } = await supabase
      .from("pages")
      .select("*")
      .eq("pageKey", PAGE_KEY)
      .single();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const raw = data as any;
    const contentJson = raw?.contentJson ?? raw?.contentjson ?? null;
    if (!contentJson || typeof contentJson !== "object") return {};
    return contentJson as ProductOverridesMap;
  } catch {
    return {};
  }
}

async function writeAll(map: ProductOverridesMap): Promise<void> {
  const supabase = getSupabaseClient();
  const { data: existing } = await supabase
    .from("pages")
    .select("id")
    .eq("pageKey", PAGE_KEY)
    .single();

  const now = new Date().toISOString();
  if (existing) {
    await supabase
      .from("pages")
      .update({ contentJson: map, updatedAt: now })
      .eq("pageKey", PAGE_KEY);
  } else {
    await supabase.from("pages").insert({
      id: crypto.randomUUID(),
      pageKey: PAGE_KEY,
      title: "Product Overrides",
      slug: PAGE_KEY,
      contentJson: map,
      status: "PUBLISHED",
      lang: "ko",
      createdAt: now,
      updatedAt: now,
    });
  }
}

export async function writeProductOverride(
  productKey: string,
  data: ProductOverrideData
): Promise<ProductOverrideData> {
  const map = await readProductOverrides();
  map[productKey] = data;
  await writeAll(map);
  return data;
}

export async function deleteProductOverride(productKey: string): Promise<void> {
  const map = await readProductOverrides();
  if (productKey in map) {
    delete map[productKey];
    await writeAll(map);
  }
}
