import BestCategoryPage, {
  generateBestCategoryMetadata,
  type PageLocale,
} from "../../../best/[category]/_page";
import { CURATED_CATEGORIES } from "@/data/curated-categories";

const SUPPORTED: PageLocale[] = ["ko", "en", "ja", "zh-CN", "zh-TW"];

function toPageLocale(locale: string): PageLocale {
  return SUPPORTED.includes(locale as PageLocale)
    ? (locale as PageLocale)
    : "ko";
}

/**
 * 6 카테고리 × 5 로케일 = 30개 조합 SSG.
 * 유효하지 않은 category 로 접근 시 상세 페이지가 notFound() 처리.
 */
export function generateStaticParams() {
  return SUPPORTED.flatMap((locale) =>
    CURATED_CATEGORIES.map((category) => ({ locale, category }))
  );
}

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
