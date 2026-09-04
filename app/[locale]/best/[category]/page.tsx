import BestCategoryPage, {
  generateBestCategoryMetadata,
  type PageLocale,
} from "../../../best/[category]/_page";

const SUPPORTED: PageLocale[] = ["ko", "en", "ja", "zh-CN", "zh-TW"];

function toPageLocale(locale: string): PageLocale {
  return SUPPORTED.includes(locale as PageLocale)
    ? (locale as PageLocale)
    : "ko";
}

// 오더 #C54-C: force-dynamic — admin Supabase 스팟 편집이 재배포 없이 반영되도록
//   요청 시점 SSR 로 렌더. generateStaticParams 제거 (force-dynamic 과 공존 무의미).
//   유효하지 않은 category 는 하위 페이지에서 notFound() 처리 유지.
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}) {
  const { locale, category } = await params;
  return generateBestCategoryMetadata(category, toPageLocale(locale));
}

export default async function LocaleBestCategoryPage({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}) {
  const { locale, category } = await params;
  return (
    <BestCategoryPage category={category} locale={toPageLocale(locale)} />
  );
}
