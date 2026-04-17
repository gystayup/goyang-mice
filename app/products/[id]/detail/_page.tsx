import type { Metadata } from "next";

import Shell from "@/components/layout/Shell";
import ProductDetailPage from "@/components/products/ProductDetailPage";
import { getProductById } from "@/data/products";
import { readServiceCatalog } from "@/lib/service-catalog-db";
import { getLocalizedServiceItem } from "@/lib/service-catalog-i18n";
import { readTicketCatalog } from "@/lib/ticket-catalog-db";

// 관리자에서 업데이트 시 즉시 반영되도록 캐시 비활성화
export const dynamic = "force-dynamic";
export const revalidate = 0;

const CATEGORY_LABELS: Record<string, string> = {
  tour: "투어",
  stay: "숙박",
  restaurant: "음식점",
  cafe: "라이프스타일",
  ticket: "티켓",
  airport: "공항픽업",
};

export async function generateMetadata(props: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}): Promise<Metadata> {
  const { id } = await props.params;
  const product = getProductById(id);
  return {
    title: product ? `${product.title} 상세` : "상품 상세",
    robots: { index: false, follow: false },
  };
}

function getParam(value?: string | string[]) {
  if (Array.isArray(value)) return value[0];
  return value;
}

export default async function ProductDetailServerPage(props: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
  locale?: string;
}) {
  const { id } = await props.params;
  const searchParams = props.searchParams ? await props.searchParams : {};
  const locale = props.locale ?? "ko";
  const product = getProductById(id);

  if (!product) {
    return (
      <Shell>
        <div className="mx-auto max-w-7xl px-6 py-20 text-center">
          <h1 className="text-2xl font-black text-slate-950">
            상품을 찾을 수 없습니다.
          </h1>
        </div>
      </Shell>
    );
  }

  const itemId = getParam(searchParams.item);
  const ticketId = getParam(searchParams.ticket);

  // 티켓 상세
  if (product.categoryKey === "ticket" && ticketId) {
    let ticket;
    try {
      const tickets = await readTicketCatalog();
      ticket = tickets.find((t) => t.id === ticketId);
    } catch {
      // ignore
    }

    if (!ticket) {
      return (
        <Shell>
          <div className="mx-auto max-w-7xl px-6 py-20 text-center">
            <h1 className="text-2xl font-black text-slate-950">티켓을 찾을 수 없습니다.</h1>
          </div>
        </Shell>
      );
    }

    const reservationUrl = `/products/${product.id}/reservation?ticket=${ticketId}`;

    return (
      <Shell>
        <ProductDetailPage
          data={{ type: "ticket", item: ticket }}
          reservationUrl={reservationUrl}
          backUrl="/products"
        />
      </Shell>
    );
  }

  // 서비스 카탈로그 상세 (투어/숙박/음식점/라이프스타일)
  const showcaseCategories = new Set(["tour", "stay", "restaurant", "cafe"]);
  if (showcaseCategories.has(product.categoryKey) && itemId) {
    let catalogItem;
    try {
      const catalog = await readServiceCatalog();
      const catKey = product.categoryKey as "tour" | "stay" | "restaurant" | "cafe";
      catalogItem = catalog[catKey]?.find((i) => i.id === itemId);
    } catch {
      // ignore
    }

    // locale 적용 — 해당 언어로 번역된 항목 반환
    if (catalogItem) {
      catalogItem = getLocalizedServiceItem(catalogItem, locale);
    }

    if (!catalogItem) {
      return (
        <Shell>
          <div className="mx-auto max-w-7xl px-6 py-20 text-center">
            <h1 className="text-2xl font-black text-slate-950">상품을 찾을 수 없습니다.</h1>
          </div>
        </Shell>
      );
    }

    const reservationUrl = `/products/${product.id}/reservation?item=${itemId}`;

    return (
      <Shell>
        <ProductDetailPage
          data={{
            type: "service",
            item: catalogItem,
            category: product.categoryKey,
            categoryLabel: CATEGORY_LABELS[product.categoryKey] ?? product.categoryKey,
          }}
          reservationUrl={reservationUrl}
          backUrl="/products"
        />
      </Shell>
    );
  }

  // 공항픽업 등 기타 → 예약 페이지로 바로 리다이렉트
  return (
    <Shell>
      <div className="mx-auto max-w-7xl px-6 py-20 text-center">
        <h1 className="text-2xl font-black text-slate-950">해당 상품은 예약 페이지로 이동합니다.</h1>
        <a
          href={`/products/${product.id}/reservation`}
          className="mt-4 inline-block rounded-2xl bg-slate-950 px-8 py-3 text-white"
        >
          예약 페이지로 이동
        </a>
      </div>
    </Shell>
  );
}
