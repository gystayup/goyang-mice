import ProductDetailPage, { generateMetadata } from "../../../products/[id]/page";

export { generateMetadata };

export default async function LocaleProductDetailPage(props: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { id, locale } = await props.params;

  return (
    <ProductDetailPage
      params={Promise.resolve({ id })}
      locale={(["ko", "en", "ja", "zh-CN", "zh-TW"] as const).includes(locale as "ko") ? (locale as "ko" | "en" | "ja" | "zh-CN" | "zh-TW") : "ko"}
    />
  );
}
