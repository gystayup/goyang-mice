"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Eye, EyeOff, PencilLine, Tags } from "lucide-react";

import type { Product } from "@/data/products";

type ProductStatus = "live" | "draft" | "hidden";

type ManagedProduct = Product & {
  adminStatus: ProductStatus;
  managerNote: string;
};

type ProductOverrides = Partial<
  Pick<
    ManagedProduct,
    | "adminStatus"
    | "managerNote"
    | "summary"
    | "reservationFeatures"
    | "operationFeatures"
    | "managementFeatures"
    | "paymentFeatures"
  >
>;

const statusMeta: Record<
  ProductStatus,
  {
    label: string;
    classes: string;
  }
> = {
  live: {
    label: "운영중",
    classes: "bg-emerald-100 text-emerald-700",
  },
  draft: {
    label: "준비중",
    classes: "bg-amber-100 text-amber-700",
  },
  hidden: {
    label: "비노출",
    classes: "bg-slate-200 text-slate-700",
  },
};

function getInitialStatus(categoryKey: Product["categoryKey"]): ProductStatus {
  if (categoryKey === "airport" || categoryKey === "ticket") return "live";
  if (categoryKey === "stay") return "draft";
  return "live";
}

function cycleProductStatus(status: ProductStatus): ProductStatus {
  if (status === "live") return "draft";
  if (status === "draft") return "hidden";
  return "live";
}

function formatCurrency(value: number) {
  return `₩ ${value.toLocaleString("ko-KR")}`;
}

export default function ProductManagementPanel({
  products,
}: {
  products: Product[];
}) {
  const [productOverrides, setProductOverrides] = useState<Record<string, ProductOverrides>>({});
  const [selectedProductId, setSelectedProductId] = useState("");

  const managedProducts = useMemo(
    () =>
      products.map((product) => ({
        ...product,
        adminStatus:
          productOverrides[product.id]?.adminStatus ?? getInitialStatus(product.categoryKey),
        managerNote:
          productOverrides[product.id]?.managerNote ??
          `${product.category} 카테고리 운영 기준과 예약/정산 조건을 점검 중입니다.`,
        summary: productOverrides[product.id]?.summary ?? product.summary,
        reservationFeatures:
          productOverrides[product.id]?.reservationFeatures ?? product.reservationFeatures,
        operationFeatures:
          productOverrides[product.id]?.operationFeatures ?? product.operationFeatures,
        managementFeatures:
          productOverrides[product.id]?.managementFeatures ?? product.managementFeatures,
        paymentFeatures:
          productOverrides[product.id]?.paymentFeatures ?? product.paymentFeatures,
      })),
    [productOverrides, products]
  );

  const activeSelectedProductId = useMemo(
    () =>
      managedProducts.some((product) => product.id === selectedProductId)
        ? selectedProductId
        : (managedProducts[0]?.id ?? ""),
    [managedProducts, selectedProductId]
  );

  const selectedProduct = useMemo(
    () =>
      managedProducts.find((product) => product.id === activeSelectedProductId) ??
      managedProducts[0] ??
      null,
    [activeSelectedProductId, managedProducts]
  );

  if (managedProducts.length === 0) {
    return (
      <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-8 text-sm text-slate-500">
        현재 선택된 카테고리에 등록된 상품이 없습니다.
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-6">
      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6">
          <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
            Product Console
          </div>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
            상품 운영 관리자
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            홈페이지에 노출되는 상품 카테고리와 예약 흐름을 기준으로 운영 상태, 기능 구성,
            요약 문구를 한 화면에서 정리할 수 있도록 만든 관리자 전용 패널입니다.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <MetricCard
              label="전체 상품"
              value={`${managedProducts.length}개`}
              icon={<Tags className="h-5 w-5" />}
            />
            <MetricCard
              label="운영중"
              value={`${managedProducts.filter((product) => product.adminStatus === "live").length}개`}
              icon={<Eye className="h-5 w-5" />}
            />
            <MetricCard
              label="준비/비노출"
              value={`${managedProducts.filter((product) => product.adminStatus !== "live").length}개`}
              icon={<EyeOff className="h-5 w-5" />}
            />
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6">
          <h3 className="text-xl font-semibold text-slate-900">운영 포인트</h3>
          <div className="mt-5 space-y-3">
            {[
              "상품 상태는 운영중 → 준비중 → 비노출 순서로 전환됩니다.",
              "예약 기능, 운영 기능, 관리 기능, 결제 기능을 같은 화면에서 점검할 수 있습니다.",
              "요약 문구와 운영 메모를 직접 수정해 내부 운영 기준을 쌓을 수 있습니다.",
              "카테고리별 상품은 홈페이지 DMC 서비스와 관리자 운영 콘솔이 같은 기준을 공유하도록 설계했습니다.",
            ].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-7 text-slate-600"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-lg font-semibold text-slate-900">상품 목록</h3>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              카테고리 필터 반영
            </span>
          </div>

          <div className="mt-5 space-y-3">
            {managedProducts.map((product) => (
              <button
                key={product.id}
                type="button"
                onClick={() => setSelectedProductId(product.id)}
                className={`w-full rounded-3xl border p-4 text-left transition ${
                  selectedProduct?.id === product.id
                    ? "border-slate-900 bg-slate-950 text-white"
                    : "border-slate-200 bg-slate-50 text-slate-900 hover:border-slate-300"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div
                      className={`text-xs font-semibold uppercase tracking-[0.18em] ${
                        selectedProduct?.id === product.id ? "text-cyan-100" : "text-slate-500"
                      }`}
                    >
                      {product.badge}
                    </div>
                    <div className="mt-2 text-lg font-bold tracking-tight">{product.title}</div>
                    <div
                      className={`mt-2 text-sm ${
                        selectedProduct?.id === product.id ? "text-slate-200" : "text-slate-500"
                      }`}
                    >
                      {product.category} · {product.categorySummary}
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      selectedProduct?.id === product.id
                        ? "bg-white/10 text-white"
                        : statusMeta[product.adminStatus].classes
                    }`}
                  >
                    {statusMeta[product.adminStatus].label}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {selectedProduct ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-6">
            <div className="flex flex-col gap-4 border-b border-slate-100 pb-6 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
                  {selectedProduct.badge}
                </div>
                <h3 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                  {selectedProduct.title}
                </h3>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
                  {selectedProduct.desc}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setProductOverrides((current) => ({
                    ...current,
                    [selectedProduct.id]: {
                      ...current[selectedProduct.id],
                      adminStatus: cycleProductStatus(selectedProduct.adminStatus),
                    },
                  }))
                }
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                <CheckCircle2 className="h-4 w-4" />
                상태 전환
              </button>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <StatCard label="기준가" value={formatCurrency(selectedProduct.price)} />
              <StatCard label="운영 범위" value={selectedProduct.people} />
              <StatCard label="소요 구성" value={selectedProduct.duration} />
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <EditableCard
                title="상품 요약"
                icon={<PencilLine className="h-4 w-4" />}
                value={selectedProduct.summary}
                onChange={(value) =>
                  setProductOverrides((current) => ({
                    ...current,
                    [selectedProduct.id]: {
                      ...current[selectedProduct.id],
                      summary: value,
                    },
                  }))
                }
              />
              <EditableCard
                title="운영 메모"
                icon={<PencilLine className="h-4 w-4" />}
                value={selectedProduct.managerNote}
                onChange={(value) =>
                  setProductOverrides((current) => ({
                    ...current,
                    [selectedProduct.id]: {
                      ...current[selectedProduct.id],
                      managerNote: value,
                    },
                  }))
                }
              />
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {(
                [
                  { label: "예약 기능", field: "reservationFeatures" as const, items: selectedProduct.reservationFeatures },
                  { label: "운영 기능", field: "operationFeatures" as const, items: selectedProduct.operationFeatures },
                  { label: "관리 기능", field: "managementFeatures" as const, items: selectedProduct.managementFeatures },
                  { label: "결제 기능", field: "paymentFeatures" as const, items: selectedProduct.paymentFeatures },
                ]
              ).map((section) => (
                <EditableListCard
                  key={section.label}
                  title={section.label}
                  icon={<PencilLine className="h-4 w-4" />}
                  items={section.items}
                  onChange={(items) =>
                    setProductOverrides((current) => ({
                      ...current,
                      [selectedProduct.id]: {
                        ...current[selectedProduct.id],
                        [section.field]: items,
                      },
                    }))
                  }
                />
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {selectedProduct.subcategories.map((subcategory) => (
                <span
                  key={subcategory}
                  className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600"
                >
                  {subcategory}
                </span>
              ))}
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
}

function MetricCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
      <div className="flex items-center gap-2 text-slate-600">
        {icon}
        <span className="text-sm font-medium">{label}</span>
      </div>
      <div className="mt-3 text-3xl font-bold text-slate-900">{value}</div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </div>
      <div className="mt-3 text-xl font-bold text-slate-900">{value}</div>
    </div>
  );
}

function EditableCard({
  title,
  icon,
  value,
  onChange,
}: {
  title: string;
  icon: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="rounded-3xl border border-slate-200 bg-white p-5">
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
        {icon}
        <span>{title}</span>
      </div>
      <textarea
        rows={4}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-4 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-7 text-slate-700 outline-none transition focus:border-slate-300"
      />
    </label>
  );
}

function EditableListCard({
  title,
  icon,
  items,
  onChange,
}: {
  title: string;
  icon: React.ReactNode;
  items: string[];
  onChange: (items: string[]) => void;
}) {
  // 내부는 줄 단위 문자열로 편집, 저장 시 빈 줄 제거 후 배열로 변환
  const joined = items.join("\n");
  const [draft, setDraft] = useState<string>(joined);
  const [editing, setEditing] = useState<boolean>(false);

  // items prop이 외부에서 바뀌면(다른 상품 선택 등) draft 재동기화
  // editing 중이 아닐 때만 덮어써서 사용자 입력을 보호
  useEffect(() => {
    if (!editing && draft !== joined) {
      setDraft(joined);
    }
  }, [joined, editing, draft]);

  const commit = (next: string) => {
    const parsed = next
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
    onChange(parsed);
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
          {icon}
          <span>{title}</span>
        </div>
        <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-semibold text-slate-500">
          {items.length}개
        </span>
      </div>
      <textarea
        rows={Math.max(4, items.length + 1)}
        value={draft}
        placeholder="한 줄에 하나씩 입력하세요"
        onFocus={() => setEditing(true)}
        onChange={(event) => setDraft(event.target.value)}
        onBlur={() => {
          setEditing(false);
          commit(draft);
        }}
        className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-7 text-slate-700 outline-none transition focus:border-slate-300"
      />
      <p className="mt-2 text-[11px] text-slate-500">
        한 줄에 하나씩 입력하면 항목으로 자동 저장됩니다.
      </p>
    </div>
  );
}
