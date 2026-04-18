import DmcPage, { type PageLocale } from "../../dmc/_page";

// Route Segment Config는 route 파일에 있어야 적용됨 (정적 빌드 캐시 무효화)
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

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
