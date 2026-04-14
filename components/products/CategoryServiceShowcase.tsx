import { CalendarDays, MapPinned } from "lucide-react";

import {
  getServiceCatalogByCategory,
  type ServiceCatalogCategory,
  type ServiceCatalogItem,
} from "@/data/service-catalog";
import type { Product } from "@/data/products";
import { Link } from "@/lib/navigation";

export default function CategoryServiceShowcase({
  product,
  category,
  items: itemsProp,
}: {
  product: Product;
  category: ServiceCatalogCategory;
  items?: ServiceCatalogItem[];
}) {
  const items = itemsProp ?? getServiceCatalogByCategory(category);

  return (
    <div className="mt-10 space-y-8">
      <section className="overflow-hidden rounded-[36px] border border-slate-200 bg-white shadow-soft">
        <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="bg-[linear-gradient(135deg,_#0f172a_0%,_#1d4ed8_42%,_#7dd3fc_100%)] p-8 text-white md:p-10">
            <div className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-100">
              {product.badge}
            </div>
            <h2 className="mt-5 text-3xl font-black tracking-tight md:text-5xl">
              {product.title}
            </h2>
            <p className="mt-5 max-w-3xl text-sm leading-8 text-slate-100 md:text-base">
              {product.summary}
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <MetricCard label="상품 구조" value="4열 카드 배치" />
              <MetricCard label="예약 흐름" value="목록 - 상세 - 결제" />
              <MetricCard label="운영 권역" value={product.location} />
            </div>
          </div>

          <div className="bg-[linear-gradient(180deg,_#fff7ed_0%,_#ffffff_100%)] p-8 md:p-10">
            <div className="text-sm font-semibold uppercase tracking-[0.22em] text-orange-500">
              Booking Flow
            </div>
            <div className="mt-4 space-y-3">
              {[
                "카드형 상품 목록에서 4개씩 비교하며 탐색합니다.",
                "상세 보기 또는 예약 버튼으로 상품 상세와 결제 화면으로 이동합니다.",
                "옵션과 인원, 날짜, 결제 방식을 선택한 뒤 예약을 접수합니다.",
                "관리자 페이지에서 예약, 결제, 운영 상태를 계속 관리할 수 있습니다.",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-[28px] border border-slate-200 bg-white px-5 py-4 text-sm leading-7 text-slate-700"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {items.map((item) => {
          const query = new URLSearchParams({ item: item.id });

          return (
            <article
              key={item.id}
              className="flex h-full flex-col overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-soft transition hover:-translate-y-1 hover:shadow-xl"
            >
              {/* 카드 헤더 — 고정 높이로 축소 */}
              <div className={`relative h-28 bg-gradient-to-br ${item.imageTone} px-5 py-4 text-slate-950`}>
                <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-600">
                  {item.subtitle}
                </div>
                <div className="mt-1 text-2xl font-black tracking-tight">{item.posterLabel}</div>
                <div className="mt-1 text-base font-black leading-tight line-clamp-1">
                  {item.title}
                </div>
              </div>

              <div className="flex flex-1 flex-col p-4">
                {/* 제목 + 설명 */}
                <h3 className="line-clamp-1 text-base font-black tracking-tight text-slate-950">
                  {item.title}
                </h3>
                <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
                  {item.summary}
                </p>

                {/* 위치 + 날짜 */}
                <div className="mt-3 space-y-1 text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <MapPinned className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                    <span className="truncate">{item.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                    <span className="truncate">{item.dateText}</span>
                  </div>
                </div>

                {/* 가격 */}
                <div className="mt-3 rounded-[16px] bg-slate-50 px-3 py-2.5">
                  {item.originalPrice ? (
                    <div className="text-xs text-slate-400 line-through">
                      {item.originalPrice.toLocaleString("ko-KR")}원
                    </div>
                  ) : null}
                  <div className="flex items-end gap-1.5">
                    {item.discountLabel ? (
                      <span className="text-base font-black text-rose-500">{item.discountLabel}</span>
                    ) : null}
                    <span className="text-xl font-black tracking-tight text-slate-950">
                      {item.price.toLocaleString("ko-KR")}원
                    </span>
                    <span className="pb-0.5 text-xs font-semibold text-slate-400">부터</span>
                  </div>
                </div>

                {/* 태그 */}
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {item.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* 버튼 */}
                <div className="mt-auto flex gap-2 pt-3">
                  <Link
                    href={`/products/${product.id}/reservation?${query.toString()}`}
                    className="inline-flex flex-1 items-center justify-center rounded-full border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    상세 보기
                  </Link>
                  <Link
                    href={`/products/${product.id}/reservation?${query.toString()}`}
                    className="inline-flex flex-1 items-center justify-center rounded-full bg-slate-950 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
                  >
                    예약
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[28px] bg-white/12 p-5">
      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-100">
        {label}
      </div>
      <div className="mt-2 text-lg font-bold text-white">{value}</div>
    </div>
  );
}
