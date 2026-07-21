import type { Metadata } from "next";
import Link from "next/link";

import TicketReservationBooking from "@/components/booking/TicketReservationBooking";
import SectionTitle from "@/components/common/SectionTitle";
import Shell from "@/components/layout/Shell";
import ProductCategoryQuickNav from "@/components/products/ProductCategoryQuickNav";
import { getProductById } from "@/data/products";
import { readTicketCatalog } from "@/lib/ticket-catalog-db";

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

  // 티켓 외 카테고리는 예약이 아닌 안내 상품 — 상세 페이지로 안내
  if (product.categoryKey !== "ticket") {
    return (
      <Shell>
        <div className="mx-auto max-w-3xl px-6 py-20 text-center">
          <h1 className="text-3xl font-black tracking-tight text-slate-950">
            안내 상품입니다
          </h1>
          <p className="mt-4 text-sm leading-8 text-slate-600">
            이 카테고리는 예약이 아닌 안내 정보만 제공합니다. 상세 페이지에서 정보를 확인해 주세요.
          </p>
          <Link
            href={`/products/${product.id}`}
            className="mt-8 inline-flex rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800"
          >
            안내 보기
          </Link>
        </div>
      </Shell>
    );
  }

  // 티켓 DB에서 해당 티켓 조회
  const ticketId = getSearchParam(searchParams.ticket);
  const initialOptionId = getSearchParam(searchParams.option);
  const rawCount = getSearchParam(searchParams.count);
  const parsedCount = rawCount ? Number.parseInt(rawCount, 10) : undefined;
  const initialCount =
    parsedCount && Number.isFinite(parsedCount) && parsedCount > 0 ? parsedCount : undefined;
  const initialDate = getSearchParam(searchParams.date);
  let dbTicket: import("@/data/ticket-booking").TicketProduct | undefined;
  if (ticketId) {
    try {
      const tickets = await readTicketCatalog();
      dbTicket = tickets.find((t) => t.id === ticketId);
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

        <TicketReservationBooking
          product={product}
          initialTicketId={ticketId}
          initialTicket={dbTicket}
          initialOptionId={initialOptionId}
          initialCount={initialCount}
          initialDate={initialDate}
        />
      </div>
    </Shell>
  );
}

function getSearchParam(value?: string | string[]) {
  if (Array.isArray(value)) return value[0];
  return value;
}
