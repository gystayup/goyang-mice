import ContactPage, { type PageLocale } from "../../contact/_page";

const SUPPORTED: PageLocale[] = ["ko", "en", "ja", "zh-CN", "zh-TW"];

export default async function LocaleContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const pageLocale: PageLocale = SUPPORTED.includes(locale as PageLocale)
    ? (locale as PageLocale)
    : "ko";
  return <ContactPage locale={pageLocale} />;
}
