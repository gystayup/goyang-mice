import type { Metadata } from "next";

import AirportTransferBooking from "@/components/booking/AirportTransferBooking";
import BookingForm from "@/components/booking/BookingForm";
import CategoryServiceReservation from "@/components/booking/CategoryServiceReservation";
import TicketReservationBooking from "@/components/booking/TicketReservationBooking";
import SectionTitle from "@/components/common/SectionTitle";
import Shell from "@/components/layout/Shell";
import ProductCategoryQuickNav from "@/components/products/ProductCategoryQuickNav";
import { getProductById } from "@/data/products";
import { readServiceCatalog } from "@/lib/service-catalog-db";

const showcaseCategories = new Set<string>(["tour", "stay", "restaurant", "cafe"]);

export async function generateMetadata(props: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await props.params;
  const product = getProductById(id);

  return {
    title: product ? `${product.title} 예약` : "예약",
    description: product
      ? `${product.title}의 상세 옵션과 결제 방식을 확인하고 바로 예약 요청을 진행할 수 있습니다.`
      : "예약 페이지",
    alternates: {
      canonical: product ? `/ko/products/${product.id}/reservation` : "/ko/products",
    },
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function ReservationPage(props: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { id } = await props.params;
  const searchParams = props.searchParams ? await props.searchParams : {};
  const product = getProductById(id);

  if (!product) {
    return (
      <Shell>
        <div className="mx-auto max-w-7xl px-6 py-20 text-center">
          <h1 className="text-3xl font-black tracking-tight text-slate-950">
            예약 가능한 서비스를 찾을 수 없습니다.
          </h1>
        </div>
      </Shell>
    );
  }

  // DB 카탈로그에서 해당 아이템 조회
  const itemId = getSearchParam(searchParams.item);
  let catalogItem: import("@/data/service-catalog").ServiceCatalogItem | undefined;
  if (showcaseCategories.has(product.categoryKey) && itemId) {
    try {
      const catalog = await readServiceCatalog();
      const catKey = product.categoryKey as "tour" | "stay" | "restaurant" | "cafe";
      catalogItem = catalog[catKey]?.find((i) => i.id === itemId);
    } catch {
      // fallback to static data
    }
  }

  return (
    <Shell>
      <div className="mx-auto max-w-7xl px-6 py-16">
        <SectionTitle
          eyebrow="Reservation"
          title={`${product.title} 예약 요청`}
          desc="선택한 상품의 상세 설명과 옵션, 결제 방식을 확인한 뒤 바로 예약 요청을 진행할 수 있습니다."
        />
        <ProductCategoryQuickNav
          activeCategory={product.categoryKey}
          mode="reservation"
        />

        {product.categoryKey === "airport" ? (
          <AirportTransferBooking
            product={product}
            initialMode={getSearchParam(searchParams.mode)}
            initialRouteId={getSearchParam(searchParams.route)}
            initialVehicleId={getSearchParam(searchParams.vehicle)}
            initialFrom={getSearchParam(searchParams.from)}
            initialTo={getSearchParam(searchParams.to)}
            initialDepartureDate={getSearchParam(searchParams.departureDate)}
            initialPassengers={getSearchParam(searchParams.passengers)}
          />
        ) : product.categoryKey === "ticket" ? (
          <TicketReservationBooking
            product={product}
            initialTicketId={getSearchParam(searchParams.ticket)}
          />
        ) : showcaseCategories.has(product.categoryKey) ? (
          <CategoryServiceReservation
            product={product}
            category={product.categoryKey as "tour" | "stay" | "restaurant" | "cafe"}
            initialItemId={itemId}
            initialItem={catalogItem}
          />
        ) : (
          <div className="mt-10 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-6">
              <div className="rounded-[30px] border border-slate-200 bg-white p-8 shadow-soft">
                <div className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
                  {product.badge}
                </div>
                <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950">
                  {product.title}
                </h2>
                <p className="mt-4 text-sm leading-8 text-slate-600">
                  {product.summary}
                </p>
              </div>
            </div>

            <BookingForm product={product} />
          </div>
        )}
      </div>
    </Shell>
  );
}

function getSearchParam(value?: string | string[]) {
  if (Array.isArray(value)) return value[0];
  return value;
}
