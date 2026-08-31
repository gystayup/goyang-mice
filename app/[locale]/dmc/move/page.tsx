import DmcMovePage, { getMoveMetadata, type PageLocale } from "../../../dmc/move/_page";
import { MOVE_LOCALES } from "@/data/dmc-move";

function toPageLocale(v: string): PageLocale {
  return (MOVE_LOCALES as string[]).includes(v) ? (v as PageLocale) : "ko";
}

export function generateStaticParams() {
  return MOVE_LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return getMoveMetadata(toPageLocale(locale));
}

export default async function LocaleDmcMovePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <DmcMovePage locale={toPageLocale(locale)} />;
}
