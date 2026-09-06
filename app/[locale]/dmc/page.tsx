import DmcPage, { getDmcMetadata, type PageLocale } from "../../dmc/_page";

// Route Segment Config는 route 파일에 있어야 적용됨 (정적 빌드 캐시 무효화)
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

const SUPPORTED: PageLocale[] = ["ko", "en", "ja", "zh-CN", "zh-TW"];

function toPageLocale(locale: string): PageLocale {
  return SUPPORTED.includes(locale as PageLocale) ? (locale as PageLocale) : "ko";
}

// 오더 #C67 [1]-A: 문서 title 복구. institute 라우트 패턴 미러.
//   generateMetadata 없으면 루트 SITE_NAME 로 폴백돼 "고양 티켓" 미표시.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return getDmcMetadata(toPageLocale(locale));
}

export default async function LocaleDmcPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <DmcPage locale={toPageLocale(locale)} />;
}
