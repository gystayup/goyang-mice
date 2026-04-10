import type { Metadata } from "next";
import { ArrowRight, CheckCircle2 } from "lucide-react";

import SectionTitle from "@/components/common/SectionTitle";
import Shell from "@/components/layout/Shell";
import AirportTransferDetail from "@/components/products/AirportTransferDetail";
import CategoryServiceShowcase from "@/components/products/CategoryServiceShowcase";
import ProductCategoryQuickNav from "@/components/products/ProductCategoryQuickNav";
import TicketShowcase from "@/components/products/TicketShowcase";
import { getCategoryEyebrow, getCommonCopy } from "@/data/locales/general-copy";
import { getProductPageCopy } from "@/data/locales/product-page-copy";
import type { DmcCategoryKey } from "@/data/products";
import { getProductById } from "@/data/products";
import { Link } from "@/lib/navigation";

const showcaseCategories = new Set(["tour", "stay", "restaurant", "cafe"]);

export async function generateMetadata(props: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await props.params;
  const product = getProductById(id);

  if (!product) {
    return {
      title: "Service Not Found",
      robots: { index: false, follow: false },
    };
  }

  const pageCopy = getProductPageCopy("ko", product.id);
  const title = pageCopy?.title ?? product.id;
  const description = pageCopy?.description ?? "";

  return {
    title,
    description,
    alternates: { canonical: `/ko/products/${product.id}` },
    openGraph: {
      title,
      description,
      url: `/ko/products/${product.id}`,
      type: "article",
    },
  };
}

export default async function ProductDetailPage(props: {
  params: Promise<{ id: string }>;
  locale?: "ko" | "en" | "ja" | "zh-CN" | "zh-TW";
}) {
  const { id } = await props.params;
  const locale = props.locale ?? "ko";
  const product = getProductById(id);
  const common = getCommonCopy(locale);

  if (!product) {
    return (
      <Shell>
        <div className="mx-auto max-w-7xl px-6 py-20 text-center">
          <h1 className="text-3xl font-black tracking-tight text-slate-950">
            {common.detailPage.notFoundTitle}
          </h1>
          <p className="mt-4 text-slate-600">{common.detailPage.notFoundDescription}</p>
          <Link
            href="/products"
            locale={locale}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white"
          >
            {common.detailPage.viewAll}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Shell>
    );
  }

  const pageCopy = getProductPageCopy(locale, product.id);
  const categoryKey = product.categoryKey as DmcCategoryKey;

  return (
    <Shell>
      <div className="mx-auto max-w-7xl px-6 py-16">
        <SectionTitle
          eyebrow={pageCopy?.eyebrow ?? getCategoryEyebrow(locale, categoryKey)}
          title={pageCopy?.title ?? product.id}
          desc={pageCopy?.description ?? ""}
        />
        <ProductCategoryQuickNav activeCategory={categoryKey} />

        {product.categoryKey === "airport" ? (
          <AirportTransferDetail product={product} locale={locale} />
        ) : product.categoryKey === "ticket" ? (
          <TicketShowcase product={product} locale={locale} />
        ) : showcaseCategories.has(product.categoryKey) ? (
          <CategoryServiceShowcase
            product={product}
            category={product.categoryKey as "tour" | "stay" | "restaurant" | "cafe"}
            locale={locale}
          />
        ) : (
          <div className="mt-10 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-6">
              <div className="rounded-[32px] bg-[linear-gradient(135deg,_#0f172a_0%,_#1d4ed8_55%,_#67e8f9_100%)] p-8 text-white">
                <div className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-100">
                  {pageCopy?.eyebrow ?? getCategoryEyebrow(locale, categoryKey)}
                </div>
                <h2 className="mt-4 text-4xl font-black tracking-tight">
                  {pageCopy?.title ?? product.id}
                </h2>
                <p className="mt-4 max-w-3xl text-base leading-8 text-slate-100">
                  {pageCopy?.summary ?? ""}
                </p>

                <div className="mt-8 grid gap-4 md:grid-cols-3">
                  <StatCard label={common.detailPage.serviceScope} value={product.duration} />
                  <StatCard label={common.detailPage.recommendedGroup} value={product.people} />
                  <StatCard label={common.detailPage.operationArea} value={product.location} />
                </div>
              </div>

              <DetailCard title={common.detailPage.subcategories}>
                <div className="mt-5 flex flex-wrap gap-2">
                  {product.subcategories.map((item) => (
                    <span
                      key={item}
                      className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </DetailCard>

              <DetailCard title={common.detailPage.serviceHighlights}>
                <ul className="mt-6 space-y-4">
                  {product.highlights.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 text-sm leading-7 text-slate-600"
                    >
                      <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-sky-700" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </DetailCard>
            </div>

            <div className="space-y-6">
              <DetailCard title={common.detailPage.includedItems}>
                <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-600">
                  {product.includes.map((item) => (
                    <li key={item}>- {item}</li>
                  ))}
                </ul>
              </DetailCard>

              <DetailCard title={common.detailPage.recommendedFor}>
                <div className="mt-5 flex flex-wrap gap-2">
                  {product.idealFor.map((item) => (
                    <span
                      key={item}
                      className="rounded-full bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </DetailCard>
            </div>
          </div>
        )}
      </div>
    </Shell>
  );
}

function DetailCard({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <div className="rounded-[30px] border border-slate-200 bg-white p-8 shadow-soft">
      <h2 className="text-xl font-black tracking-tight text-slate-950">{title}</h2>
      {children}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/10 px-5 py-4">
      <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
        {label}
      </div>
      <div className="mt-2 text-lg font-bold">{value}</div>
    </div>
  );
}
