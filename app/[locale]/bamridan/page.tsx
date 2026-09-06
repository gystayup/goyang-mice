import BamridanPage, {
  getBamridanMetadata,
  type PageLocale,
} from "../../bamridan/_page";

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
  return getBamridanMetadata(toPageLocale(locale));
}

export default async function LocaleBamridanPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <BamridanPage locale={toPageLocale(locale)} />;
}
