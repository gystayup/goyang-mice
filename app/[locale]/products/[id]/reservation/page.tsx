import { redirect } from "next/navigation";

import ReservationPage, {
  generateMetadata,
} from "../../../../products/[id]/reservation/_page";
import { getProductById } from "@/data/products";

export { generateMetadata };

// 플랫폼 상품 ID는 서비스 예약 목록 페이지로 리다이렉트
const PLATFORM_IDS = new Set([
  "tour-experience-platform",
  "stay-reservation-platform",
  "restaurant-booking-platform",
  "cafe-booking-platform",
  "ticket-agency-platform",
  "airport-pickup-platform",
]);

export default async function LocaleReservationPage(props: {
  params: Promise<{ locale: string; id: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale, id } = await props.params;

  if (PLATFORM_IDS.has(id)) {
    const product = getProductById(id);
    const categoryKey = product?.categoryKey ?? "tour";
    redirect(`/${locale}/products#section-${categoryKey}`);
  }

  return (
    <ReservationPage
      params={Promise.resolve({ id })}
      searchParams={props.searchParams}
    />
  );
}
