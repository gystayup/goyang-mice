"use client";

import { useEffect, useState } from "react";
import { Edit2, Loader2, Plus, Trash2, X } from "lucide-react";

type Category = "tour" | "stay" | "restaurant" | "cafe";
const CATEGORIES: { key: Category; label: string }[] = [
  { key: "tour", label: "여행상품" },
  { key: "stay", label: "숙박예약" },
  { key: "restaurant", label: "음식점예약" },
  { key: "cafe", label: "라이프스타일" },
];

const COLOR_PRESETS: { label: string; value: string }[] = [
  { label: "하늘/청록", value: "from-amber-100 via-cyan-100 to-sky-200" },
  { label: "핑크/오렌지", value: "from-fuchsia-100 via-pink-100 to-orange-200" },
  { label: "연두/에메랄드", value: "from-lime-100 via-emerald-100 to-cyan-200" },
  { label: "남색/하늘 (야간)", value: "from-slate-700 via-indigo-500 to-sky-400" },
  { label: "그레이/스톤", value: "from-slate-100 via-zinc-100 to-stone-200" },
  { label: "앰버/로즈", value: "from-amber-100 via-orange-100 to-rose-200" },
  { label: "퍼플/인디고", value: "from-violet-100 via-purple-100 to-indigo-200" },
  { label: "그린/라임", value: "from-green-100 via-teal-100 to-lime-200" },
  { label: "옐로우/피치", value: "from-yellow-100 via-orange-100 to-peach-200" },
  { label: "블루/시안", value: "from-blue-100 via-sky-100 to-cyan-200" },
  { label: "로즈/핑크", value: "from-rose-100 via-pink-100 to-fuchsia-200" },
  { label: "스카이/화이트", value: "from-sky-50 via-blue-50 to-indigo-100" },
];

interface ServiceCatalogOption {
  id: string;
  label: string;
  price: number;
  benefits: string[];
}

interface ServiceCatalogItem {
  id: string;
  title: string;
  subtitle: string;
  location: string;
  dateText: string;
  imageTone: string;
  posterLabel: string;
  summary: string;
  description: string;
  tags: string[];
  originalPrice?: number;
  price: number;
  discountLabel?: string;
  options: ServiceCatalogOption[];
}

type CatalogMap = Record<Category, ServiceCatalogItem[]>;

const emptyItem = (): ServiceCatalogItem => ({
  id: "",
  title: "",
  subtitle: "",
  location: "",
  dateText: "",
  imageTone: COLOR_PRESETS[0].value,
  posterLabel: "",
  summary: "",
  description: "",
  tags: [],
  originalPrice: undefined,
  price: 0,
  discountLabel: undefined,
  options: [],
});

export default function ServiceCatalogPanel() {
  const [catalog, setCatalog] = useState<CatalogMap>({ tour: [], stay: [], restaurant: [], cafe: [] });
  const [activeCategory, setActiveCategory] = useState<Category>("tour");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  // 폼 상태
  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ServiceCatalogItem | null>(null);
  const [form, setForm] = useState<ServiceCatalogItem>(emptyItem());
  const [tagsInput, setTagsInput] = useState("");

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/service-catalog", { cache: "no-store" });
      const json = (await res.json()) as { success: boolean; data?: CatalogMap; error?: string };
      if (json.success && json.data) setCatalog(json.data);
    } catch {
      setMsg({ type: "err", text: "불러오기 실패" });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function openAdd() {
    const blank = emptyItem();
    setEditingItem(null);
    setForm(blank);
    setTagsInput("");
    setFormOpen(true);
    setMsg(null);
  }

  function openEdit(item: ServiceCatalogItem) {
    setEditingItem(item);
    setForm({ ...item });
    setTagsInput(item.tags.join(", "));
    setFormOpen(true);
    setMsg(null);
  }

  function closeForm() {
    setFormOpen(false);
    setEditingItem(null);
    setForm(emptyItem());
    setTagsInput("");
  }

  function setField<K extends keyof ServiceCatalogItem>(key: K, value: ServiceCatalogItem[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    if (!form.title.trim()) { setMsg({ type: "err", text: "상품명을 입력하세요." }); return; }
    if (!form.price || form.price <= 0) { setMsg({ type: "err", text: "가격을 입력하세요." }); return; }

    const tags = tagsInput.split(",").map((t) => t.trim()).filter(Boolean);
    const itemId = editingItem ? form.id : `${activeCategory}-${Date.now()}`;
    const payload: ServiceCatalogItem = { ...form, id: itemId, tags };

    setSaving(true);
    setMsg(null);
    try {
      const method = editingItem ? "PUT" : "POST";
      const res = await fetch("/api/admin/service-catalog", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category: activeCategory, item: payload }),
      });
      const json = (await res.json()) as { success: boolean; data?: CatalogMap; error?: string };
      if (!json.success) throw new Error(json.error ?? "저장 실패");
      if (json.data) setCatalog(json.data);
      setMsg({ type: "ok", text: editingItem ? "수정되었습니다." : "상품이 추가되었습니다." });
      closeForm();
    } catch (e) {
      setMsg({ type: "err", text: e instanceof Error ? e.message : "저장 실패" });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(item: ServiceCatalogItem) {
    if (!confirm(`"${item.title}" 상품을 삭제하시겠습니까?`)) return;
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch(
        `/api/admin/service-catalog?category=${activeCategory}&id=${item.id}`,
        { method: "DELETE" }
      );
      const json = (await res.json()) as { success: boolean; data?: CatalogMap; error?: string };
      if (!json.success) throw new Error(json.error ?? "삭제 실패");
      if (json.data) setCatalog(json.data);
      setMsg({ type: "ok", text: "삭제되었습니다." });
    } catch (e) {
      setMsg({ type: "err", text: e instanceof Error ? e.message : "삭제 실패" });
    } finally {
      setSaving(false);
    }
  }

  // 옵션 관리
  function addOption() {
    setField("options", [
      ...form.options,
      { id: `opt-${Date.now()}`, label: "", price: 0, benefits: [] },
    ]);
  }
  function removeOption(idx: number) {
    setField("options", form.options.filter((_, i) => i !== idx));
  }
  function setOption(idx: number, key: keyof ServiceCatalogOption, value: string | number | string[]) {
    const next = form.options.map((o, i) => (i === idx ? { ...o, [key]: value } : o));
    setField("options", next);
  }

  const items = catalog[activeCategory] ?? [];

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6">
      {/* 헤더 */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="text-xs font-semibold tracking-[0.2em] text-[#3655a6]">SERVICE CATALOG</div>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">예약 서비스 상품 관리</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            투어, 숙박, 음식점, 라이프스타일 카테고리별 서비스 상품을 추가·수정·삭제합니다.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={load}
            className="inline-flex items-center rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            새로고침
          </button>
          <button
            type="button"
            onClick={openAdd}
            className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            <Plus className="h-4 w-4" />
            새 상품 추가
          </button>
        </div>
      </div>

      {/* 알림 */}
      {msg && (
        <div className={`mt-4 rounded-2xl border px-4 py-3 text-sm ${msg.type === "ok" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-rose-200 bg-rose-50 text-rose-700"}`}>
          {msg.text}
        </div>
      )}

      {/* 카테고리 탭 */}
      <div className="mt-5 flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            type="button"
            onClick={() => { setActiveCategory(cat.key); closeForm(); setMsg(null); }}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              activeCategory === cat.key
                ? "bg-slate-950 text-white"
                : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            {cat.label}
            <span className="ml-1.5 text-xs opacity-60">({(catalog[cat.key] ?? []).length})</span>
          </button>
        ))}
      </div>

      {/* 상품 목록 */}
      {loading ? (
        <div className="mt-8 flex items-center justify-center gap-2 text-slate-400">
          <Loader2 className="h-5 w-5 animate-spin" /> 불러오는 중...
        </div>
      ) : items.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-slate-200 py-12 text-center text-sm text-slate-400">
          등록된 상품이 없습니다. 새 상품 추가 버튼을 눌러 시작하세요.
        </div>
      ) : (
        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-3 overflow-hidden rounded-[20px] border border-slate-200 bg-slate-50 p-4"
            >
              {/* 미리보기 헤더 */}
              <div className={`flex h-16 flex-col justify-end rounded-[14px] bg-gradient-to-br ${item.imageTone} px-3 py-2`}>
                <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-600">{item.subtitle}</div>
                <div className="text-lg font-black tracking-tight text-slate-900">{item.posterLabel}</div>
              </div>

              <div className="flex-1">
                <div className="text-sm font-bold text-slate-900 line-clamp-1">{item.title}</div>
                <div className="mt-0.5 text-xs text-slate-500 line-clamp-1">{item.summary}</div>
                <div className="mt-1.5 flex items-center gap-2">
                  <span className="text-base font-black text-slate-950">
                    ₩{item.price.toLocaleString("ko-KR")}
                  </span>
                  {item.discountLabel && (
                    <span className="text-xs font-bold text-rose-500">{item.discountLabel}</span>
                  )}
                </div>
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {item.tags.slice(0, 3).map((t) => (
                    <span key={t} className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] text-slate-600">{t}</span>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => openEdit(item)}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  <Edit2 className="h-3.5 w-3.5" /> 수정
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(item)}
                  disabled={saving}
                  className="flex items-center justify-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-100 disabled:opacity-50"
                >
                  <Trash2 className="h-3.5 w-3.5" /> 삭제
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 추가/수정 폼 */}
      {formOpen && (
        <div className="mt-6 rounded-[24px] border border-slate-200 bg-slate-50 p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">
              {editingItem ? "상품 수정" : "새 상품 추가"}
            </h3>
            <button type="button" onClick={closeForm} className="rounded-full p-1.5 text-slate-400 hover:bg-slate-200">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {/* 포스터 라벨 */}
            <div>
              <label className="block text-xs font-semibold text-slate-600">카드 상단 큰 텍스트 (posterLabel) *</label>
              <input
                type="text"
                value={form.posterLabel}
                onChange={(e) => setField("posterLabel", e.target.value)}
                placeholder="예: BRUNCH, STAY, VIP"
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
              />
            </div>

            {/* 상품명 */}
            <div>
              <label className="block text-xs font-semibold text-slate-600">상품명 *</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setField("title", e.target.value)}
                placeholder="예: 브런치 소셜 클럽 예약"
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
              />
            </div>

            {/* 부제목 */}
            <div>
              <label className="block text-xs font-semibold text-slate-600">부제목 (카드 상단 작은 텍스트)</label>
              <input
                type="text"
                value={form.subtitle}
                onChange={(e) => setField("subtitle", e.target.value)}
                placeholder="예: 라이프스타일 오전 프로그램"
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
              />
            </div>

            {/* 위치 */}
            <div>
              <label className="block text-xs font-semibold text-slate-600">위치</label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => setField("location", e.target.value)}
                placeholder="예: 고양 브런치 카페 라운지"
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
              />
            </div>

            {/* 운영 일정 */}
            <div>
              <label className="block text-xs font-semibold text-slate-600">운영 일정</label>
              <input
                type="text"
                value={form.dateText}
                onChange={(e) => setField("dateText", e.target.value)}
                placeholder="예: 오전 타임 운영"
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
              />
            </div>

            {/* 색상 테마 */}
            <div>
              <label className="block text-xs font-semibold text-slate-600">카드 색상 테마</label>
              <select
                value={form.imageTone}
                onChange={(e) => setField("imageTone", e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
              >
                {COLOR_PRESETS.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
              {/* 색상 미리보기 */}
              <div className={`mt-1.5 h-8 w-full rounded-lg bg-gradient-to-br ${form.imageTone}`} />
            </div>

            {/* 한 줄 설명 */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-600">한 줄 설명</label>
              <input
                type="text"
                value={form.summary}
                onChange={(e) => setField("summary", e.target.value)}
                placeholder="예: 브런치와 로컬 라이프스타일 공간 경험을 함께 묶은 예약입니다."
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
              />
            </div>

            {/* 상세 설명 */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-600">상세 설명</label>
              <textarea
                value={form.description}
                onChange={(e) => setField("description", e.target.value)}
                rows={3}
                placeholder="상품 상세 설명을 입력하세요."
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-slate-400 focus:outline-none resize-none"
              />
            </div>

            {/* 가격 */}
            <div>
              <label className="block text-xs font-semibold text-slate-600">판매 가격 (원) *</label>
              <input
                type="number"
                value={form.price || ""}
                onChange={(e) => setField("price", Number(e.target.value))}
                placeholder="예: 24000"
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
              />
            </div>

            {/* 원래 가격 */}
            <div>
              <label className="block text-xs font-semibold text-slate-600">원래 가격 (취소선, 선택)</label>
              <input
                type="number"
                value={form.originalPrice || ""}
                onChange={(e) => setField("originalPrice", e.target.value ? Number(e.target.value) : undefined)}
                placeholder="예: 32000"
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
              />
            </div>

            {/* 할인 라벨 */}
            <div>
              <label className="block text-xs font-semibold text-slate-600">할인 표시 (선택)</label>
              <input
                type="text"
                value={form.discountLabel || ""}
                onChange={(e) => setField("discountLabel", e.target.value || undefined)}
                placeholder="예: 25%"
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
              />
            </div>

            {/* 태그 */}
            <div>
              <label className="block text-xs font-semibold text-slate-600">태그 (쉼표로 구분)</label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="예: 브런치, 라운지, 라이프스타일"
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
              />
            </div>

            {/* 옵션 관리 */}
            <div className="md:col-span-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-600">예약 옵션 (가격 티어)</label>
                <button
                  type="button"
                  onClick={addOption}
                  className="flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  <Plus className="h-3.5 w-3.5" /> 옵션 추가
                </button>
              </div>
              {form.options.length === 0 ? (
                <p className="mt-2 text-xs text-slate-400">옵션이 없습니다. 위 버튼으로 추가하세요.</p>
              ) : (
                <div className="mt-2 space-y-2">
                  {form.options.map((opt, idx) => (
                    <div key={opt.id} className="flex gap-2 rounded-xl border border-slate-200 bg-white p-3">
                      <div className="flex flex-1 flex-wrap gap-2">
                        <input
                          type="text"
                          value={opt.label}
                          onChange={(e) => setOption(idx, "label", e.target.value)}
                          placeholder="옵션명"
                          className="flex-1 min-w-[100px] rounded-lg border border-slate-200 px-2 py-1.5 text-xs focus:outline-none"
                        />
                        <input
                          type="number"
                          value={opt.price || ""}
                          onChange={(e) => setOption(idx, "price", Number(e.target.value))}
                          placeholder="가격"
                          className="w-24 rounded-lg border border-slate-200 px-2 py-1.5 text-xs focus:outline-none"
                        />
                        <input
                          type="text"
                          value={opt.benefits.join(", ")}
                          onChange={(e) => setOption(idx, "benefits", e.target.value.split(",").map((b) => b.trim()).filter(Boolean))}
                          placeholder="혜택 (쉼표 구분)"
                          className="flex-1 min-w-[120px] rounded-lg border border-slate-200 px-2 py-1.5 text-xs focus:outline-none"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeOption(idx)}
                        className="flex-shrink-0 rounded-full p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-500"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 저장 버튼 */}
          <div className="mt-5 flex justify-end gap-3">
            <button
              type="button"
              onClick={closeForm}
              className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              취소
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:bg-slate-400"
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {editingItem ? "수정 저장" : "상품 추가"}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
