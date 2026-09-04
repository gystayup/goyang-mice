import DmcTicketDetailPage, {
  getTicketDetailMetadata,
  type PageLocale,
} from "../../../../dmc/tickets/[id]/_page";

const LOCALES: PageLocale[] = ["ko", "en", "ja", "zh-CN", "zh-TW"];

function toPageLocale(v: string): PageLocale {
  return (LOCALES as string[]).includes(v) ? (v as PageLocale) : "ko";
}

// 오더 #C54-C 정합: admin Supabase 티켓 편집이 재배포 없이 반영되도록 SSR 강제.
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  return getTicketDetailMetadata(id, toPageLocale(locale));
}

export default async function LocaleDmcTicketDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  return <DmcTicketDetailPage id={id} locale={toPageLocale(locale)} />;
}
