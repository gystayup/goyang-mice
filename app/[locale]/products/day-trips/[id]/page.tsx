import DayTripDetailPage, {
  getDayTripDetailMetadata,
  type PageLocale,
} from "../../../../products/day-trips/[id]/_page";

const LOCALES: PageLocale[] = ["ko", "en", "ja", "zh-CN", "zh-TW"];

function toPageLocale(v: string): PageLocale {
  return (LOCALES as string[]).includes(v) ? (v as PageLocale) : "ko";
}

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  return getDayTripDetailMetadata(id, toPageLocale(locale));
}

export default async function LocaleDayTripDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  return <DayTripDetailPage id={id} locale={toPageLocale(locale)} />;
}
