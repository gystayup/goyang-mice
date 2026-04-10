import ProductsPage, { type PageLocale } from "../../products/_page";

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
