import type { Metadata } from "next";
import Link from "next/link";

import TicketReservationBooking from "@/components/booking/TicketReservationBooking";
import SectionTitle from "@/components/common/SectionTitle";
import Shell from "@/components/layout/Shell";
import ProductCategoryQuickNav from "@/components/products/ProductCategoryQuickNav";
import { getProductById } from "@/data/products";
import { readTicketCatalog } from "@/lib/ticket-catalog-db";
import type { PageLocale } from "@/data/locales/types";
import { getReservationCopy } from "@/data/locales/reservation-copy";

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
  locale?: PageLocale;
}) {
  const { id } = await props.params;
  const searchParams = props.searchParams ? await props.searchParams : {};
  const product = getProductById(id);
  const locale: PageLocale = props.locale ?? "ko";
  const copy = getReservationCopy(locale);

  if (!product) {
    return (
      <Shell>
        <div className="mx-auto max-w-7xl px-6 py-20 text-center">
          <h1 className="text-3xl font-black tracking-tight text-slate-950">
            {copy.notFoundTitle}
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
            {copy.infoOnlyTitle}
          </h1>
          <p className="mt-4 text-sm leading-8 text-slate-600">{copy.infoOnlyDesc}</p>
          <Link
            href={`/${locale}/products/${product.id}`}
            className="mt-8 inline-flex rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800"
          >
            {copy.infoOnlyCta}
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
      {/* 오더 #D20: max-w-7xl (1280) → max-w-[1200px] 로 정합, 좌우 24px padding 유지.
          이전은 상단 검은 카드/보라·핑크 그라디언트가 좌우 여백 낭비 → D20 은 좌 1fr + 우 360 sticky 로 폭 활용.
          #D21: locale 전달 및 SectionTitle 문안 5로케일 사전에서 조회. */}
      <div className="mx-auto max-w-[1200px] px-6 py-16">
        <SectionTitle
          eyebrow={copy.sectionEyebrow}
          title={`${product.title} · ${copy.sectionTitleSuffix}`}
          desc={copy.sectionDesc}
        />
        <ProductCategoryQuickNav
          activeCategory={product.categoryKey}
          mode="reservation"
        />

        <TicketReservationBooking
          product={product}
          locale={locale}
          copy={copy}
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
