import InstitutePage, { getInstituteMetadata, type PageLocale } from "../../institute/page";

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
  return getInstituteMetadata(toPageLocale(locale));
}

export default async function LocaleInstitutePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <InstitutePage locale={toPageLocale(locale)} />;
}
