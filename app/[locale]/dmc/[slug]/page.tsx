import SpotDetailPage, {
  generateSpotDetailMetadata,
  type PageLocale,
} from "../../../dmc/[slug]/_page";

const SUPPORTED: PageLocale[] = ["ko", "en", "ja", "zh-CN", "zh-TW"];

function toPageLocale(locale: string): PageLocale {
  return SUPPORTED.includes(locale as PageLocale)
    ? (locale as PageLocale)
    : "ko";
}

// 오더 #C54-C: force-dynamic — admin Supabase 스팟 편집이 재배포 없이 반영되도록
//   요청 시점 SSR 로 렌더. generateStaticParams 제거 (force-dynamic 과 공존 무의미).
//   잘못된 slug 접근은 SpotDetailPage 내부 notFound() 유지.
export const dynamic = "force-dynamic";

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
