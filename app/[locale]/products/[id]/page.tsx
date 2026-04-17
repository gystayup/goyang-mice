import { redirect } from "next/navigation";

import ProductDetailPage, { generateMetadata } from "../../../products/[id]/_page";
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

export default async function LocaleProductDetailPage(props: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { id, locale } = await props.params;

  if (PLATFORM_IDS.has(id)) {
    const product = getProductById(id);
    const categoryKey = product?.categoryKey ?? "tour";
    redirect(`/${locale}/products#section-${categoryKey}`);
  }

  return (
    <ProductDetailPage
      params={Promise.resolve({ id })}
      locale={(["ko", "en", "ja", "zh-CN", "zh-TW"] as const).includes(locale as "ko") ? (locale as "ko" | "en" | "ja" | "zh-CN" | "zh-TW") : "ko"}
    />
  );
}
