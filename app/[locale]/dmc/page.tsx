import DmcPage, { type PageLocale } from "../../dmc/page";

const SUPPORTED: PageLocale[] = ["ko", "en", "ja", "zh-CN", "zh-TW"];

export default async function LocaleDmcPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const pageLocale: PageLocale = SUPPORTED.includes(locale as PageLocale)
    ? (locale as PageLocale)
    : "ko";
  return <DmcPage locale={pageLocale} />;
}
