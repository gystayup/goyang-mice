import { redirect } from "next/navigation";

import ReservationPage, {
  generateMetadata,
} from "../../../../products/[id]/reservation/_page";
import { getProductById } from "@/data/products";

export { generateMetadata };

// 티켓 플랫폼 상품 ID는 티켓 목록 페이지로 리다이렉트 (ticket 파라미터 없을 때)
const TICKET_PLATFORM_IDS = new Set([
  "ticket-agency-platform",
]);

export default async function LocaleReservationPage(props: {
  params: Promise<{ locale: string; id: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale, id } = await props.params;
  const searchParams = props.searchParams ? await props.searchParams : {};
  const product = getProductById(id);

  // 티켓 외 카테고리는 예약이 아닌 안내 — 상세 페이지로 리다이렉트
  if (product && product.categoryKey !== "ticket") {
    redirect(`/${locale}/products/${id}`);
  }

  // 티켓 플랫폼 상품에 ticket 파라미터 없이 접근 → 티켓 섹션 목록으로
  const hasTicket = searchParams.ticket;
  if (TICKET_PLATFORM_IDS.has(id) && !hasTicket) {
    redirect(`/${locale}/products#section-ticket`);
  }

  return (
    <ReservationPage
      params={Promise.resolve({ id })}
      searchParams={props.searchParams}
    />
  );
}
