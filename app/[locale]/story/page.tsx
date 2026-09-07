import StoryPage, {
  getStoryMetadata,
  type PageLocale,
} from "../../story/_page";

const SUPPORTED: PageLocale[] = ["ko", "en", "ja", "zh-CN", "zh-TW"];

function toPageLocale(locale: string): PageLocale {
  return SUPPORTED.includes(locale as PageLocale) ? (locale as PageLocale) : "ko";
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return getStoryMetadata(toPageLocale(locale));
}

export default async function LocaleStoryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <StoryPage locale={toPageLocale(locale)} />;
}
