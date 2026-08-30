import SpotDetailPage, {
  generateSpotDetailMetadata,
  generateSpotDetailStaticParams,
  type PageLocale,
} from "../../../dmc/[slug]/_page";

const SUPPORTED: PageLocale[] = ["ko", "en", "ja", "zh-CN", "zh-TW"];

function toPageLocale(locale: string): PageLocale {
  return SUPPORTED.includes(locale as PageLocale)
    ? (locale as PageLocale)
    : "ko";
}

// spots 배열이 비어있는 동안은 빈 배열. dynamicParams 기본값(true) 유지 →
// 유효 slug 가 채워지면 자동으로 렌더, 그 전까지 접근은 notFound() 처리.
export function generateStaticParams() {
  return generateSpotDetailStaticParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  return generateSpotDetailMetadata(slug, toPageLocale(locale));
}

export default async function LocaleDmcSpotPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  return <SpotDetailPage slug={slug} locale={toPageLocale(locale)} />;
}
