import ProductsPage, { type PageLocale } from "../../products/_page";

// Route Segment Config는 route 파일(page.tsx)에 있어야 적용됨.
// 매 요청마다 서버에서 재렌더링 → 관리자 변경 즉시 반영 + 번역 맵 확실히 적용
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

const SUPPORTED: PageLocale[] = ["ko", "en", "ja", "zh-CN", "zh-TW"];

export default async function LocaleProductsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const pageLocale: PageLocale = SUPPORTED.includes(locale as PageLocale)
    ? (locale as PageLocale)
    : "ko";
  return <ProductsPage locale={pageLocale} />;
}
