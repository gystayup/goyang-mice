import DmcMovePage, { getMoveMetadata, type PageLocale } from "../../../dmc/move/_page";
import { MOVE_LOCALES } from "@/data/dmc-move";

function toPageLocale(v: string): PageLocale {
  return (MOVE_LOCALES as string[]).includes(v) ? (v as PageLocale) : "ko";
}

// 오더 #C54-C: force-dynamic — admin Supabase 스팟 편집이 재배포 없이 반영되도록
//   요청 시점 SSR 로 렌더. generateStaticParams 제거 (force-dynamic 과 공존 무의미).
export const dynamic = "force-dynamic";

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
