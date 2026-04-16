import ProductDetailServerPage, {
  generateMetadata,
} from "../../../../products/[id]/detail/_page";

export { generateMetadata };

export default async function LocaleProductDetailPage(props: {
  params: Promise<{ locale: string; id: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale, id } = await props.params;
  return (
    <ProductDetailServerPage
      params={Promise.resolve({ id })}
      searchParams={props.searchParams}
      locale={locale}
    />
  );
}
