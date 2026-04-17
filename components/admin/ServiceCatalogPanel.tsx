"use client";

import { useEffect, useRef, useState } from "react";
import { Edit2, ImagePlus, Loader2, Plus, Trash2, X } from "lucide-react";

type Category = "tour" | "stay" | "restaurant" | "cafe" | "airport";
type ActivePanel = Category | "ticket";

const CATEGORIES: { key: Category; label: string }[] = [
  { key: "tour", label: "여행상품" },
  { key: "stay", label: "숙박예약" },
  { key: "restaurant", label: "음식점예약" },
  { key: "cafe", label: "라이프스타일" },
  { key: "airport", label: "공항픽업" },
];

// ── 티켓 관련 타입 ──────────────────────────────────────────────
type TicketCategory = "concert" | "festival" | "exhibition" | "family" | "k-pop";
const TICKET_CATEGORIES: { key: TicketCategory; label: string }[] = [
  { key: "concert", label: "콘서트" },
  { key: "festival", label: "페스티벌" },
  { key: "exhibition", label: "전시/행사" },
  { key: "family", label: "아동/가족" },
  { key: "k-pop", label: "K-POP" },
];

interface TicketOption {
  id: string;
  label: string;
  price: number;
  benefits: string[];
}

interface TicketItem {
  id: string;
  category: TicketCategory;
  badge: string;
  title: string;
  subtitle: string;
  venue: string;
  dateText: string;
  imageTone: string;
  summary: string;
  description: string;
  posterLabel: string;
  tags: string[];
  options: TicketOption[];
  imageUrl?: string;
  images?: string[];
  duration?: string;
  ageLimit?: string;
  tabNotice?: string;
  tabCasting?: string;
  tabDetails?: string;
  tabPrice?: string;
  tabDiscount?: string;
  tabUsageInfo?: string;
  tabVenue?: string;
  tabCancellation?: string;
}

const emptyTicket = (): TicketItem => ({
  id: "",
  category: "concert",
  badge: "",
  title: "",
  subtitle: "",
  venue: "",
  dateText: "",
  imageTone: COLOR_PRESETS_TICKET[0].value,
  summary: "",
  description: "",
  posterLabel: "",
  tags: [],
  options: [],
  imageUrl: undefined,
  images: [],
  duration: undefined,
  ageLimit: undefined,
  tabNotice: undefined,
  tabCasting: undefined,
  tabDetails: undefined,
  tabPrice: undefined,
  tabDiscount: undefined,
  tabUsageInfo: undefined,
  tabVenue: undefined,
  tabCancellation: undefined,
});

const COLOR_PRESETS_TICKET: { label: string; value: string }[] = [
  { label: "사이버/네온 (K-POP)", value: "from-cyan-200 via-fuchsia-200 to-sky-300" },
  { label: "옐로우/라임 (페스티벌)", value: "from-yellow-100 via-cyan-200 to-lime-200" },
  { label: "딥블루/인디고 (콘서트)", value: "from-indigo-200 via-blue-200 to-slate-300" },
  { label: "로즈/앰버 (전시)", value: "from-rose-100 via-amber-100 to-orange-200" },
  { label: "그린/민트 (가족)", value: "from-green-100 via-teal-100 to-emerald-200" },
  { label: "퍼플/핑크", value: "from-purple-200 via-pink-100 to-rose-200" },
  { label: "골드/오렌지", value: "from-yellow-200 via-orange-100 to-amber-200" },
  { label: "다크/다크 (야간)", value: "from-slate-700 via-indigo-500 to-sky-400" },
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
  // 상품 소개 콘텐츠
  imageUrl?: string;
  images?: string[];
  highlights?: string[];
  includes?: string[];
  couponGuide?: string;
  // 상세페이지 탭 콘텐츠
  tabNotice?: string;
  tabDetails?: string;
  tabUsageInfo?: string;
  tabCancellation?: string;
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
  imageUrl: undefined,
  images: [],
  highlights: [],
  includes: [],
  couponGuide: undefined,
  tabNotice: undefined,
  tabDetails: undefined,
  tabUsageInfo: undefined,
  tabCancellation: undefined,
});

export default function ServiceCatalogPanel() {
  const [catalog, setCatalog] = useState<CatalogMap>({ tour: [], stay: [], restaurant: [], cafe: [], airport: [] });
  const [activeCategory, setActiveCategory] = useState<ActivePanel>("tour");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  // 폼 상태
  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ServiceCatalogItem | null>(null);
  const [form, setForm] = useState<ServiceCatalogItem>(emptyItem());
  const [tagsInput, setTagsInput] = useState("");
  const [highlightsInput, setHighlightsInput] = useState("");
  const [includesInput, setIncludesInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

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
    setHighlightsInput("");
    setIncludesInput("");
    setFormOpen(true);
    setMsg(null);
  }

  function openEdit(item: ServiceCatalogItem) {
    setEditingItem(item);
    setForm({ ...item });
    setTagsInput(item.tags.join(", "));
    setHighlightsInput((item.highlights ?? []).join("\n"));
    setIncludesInput((item.includes ?? []).join("\n"));
    setFormOpen(true);
    setMsg(null);
  }

  function closeForm() {
    setFormOpen(false);
    setEditingItem(null);
    setForm(emptyItem());
    setTagsInput("");
    setHighlightsInput("");
    setIncludesInput("");
  }

  async function handleImageUpload(file: File) {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("category", "catalog");
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const json = (await res.json()) as { success: boolean; url?: string; error?: string };
      if (!json.success || !json.url) throw new Error(json.error ?? "업로드 실패");
      setField("imageUrl", json.url);
    } catch (e) {
      setMsg({ type: "err", text: e instanceof Error ? e.message : "이미지 업로드 실패" });
    } finally {
      setUploading(false);
    }
  }

  async function handleGalleryUpload(file: File) {
    setUploadingGallery(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("category", "catalog");
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const json = (await res.json()) as { success: boolean; url?: string; error?: string };
      if (!json.success || !json.url) throw new Error(json.error ?? "업로드 실패");
      setForm((prev) => ({ ...prev, images: [...(prev.images ?? []), json.url!] }));
    } catch (e) {
      setMsg({ type: "err", text: e instanceof Error ? e.message : "갤러리 업로드 실패" });
    } finally {
      setUploadingGallery(false);
    }
  }

  function removeGalleryImage(idx: number) {
    setForm((prev) => ({ ...prev, images: (prev.images ?? []).filter((_, i) => i !== idx) }));
  }

  function setField<K extends keyof ServiceCatalogItem>(key: K, value: ServiceCatalogItem[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    if (!form.title.trim()) { setMsg({ type: "err", text: "상품명을 입력하세요." }); return; }
    // 공항픽업은 가격 0 허용 (옵션별 가격 사용), 그 외 카테고리는 가격 필수
    if (activeCategory !== "airport" && (!form.price || form.price <= 0)) { setMsg({ type: "err", text: "가격을 입력하세요." }); return; }

    const tags = tagsInput.split(",").map((t) => t.trim()).filter(Boolean);
    const highlights = highlightsInput.split("\n").map((l) => l.trim()).filter(Boolean);
    const includes = includesInput.split("\n").map((l) => l.trim()).filter(Boolean);
    const itemId = editingItem ? form.id : `${activeCategory}-${Date.now()}`;
    const payload: ServiceCatalogItem = { ...form, id: itemId, tags, highlights, includes };

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

  const items = activeCategory !== "ticket" ? (catalog[activeCategory as Category] ?? []) : [];

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6">
      {/* 헤더 */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="text-xs font-semibold tracking-[0.2em] text-[#3655a6]">SERVICE CATALOG</div>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">예약 서비스 상품 관리</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            투어, 숙박, 음식점, 라이프스타일, 공항픽업, 티켓 상품을 추가·수정·삭제합니다.
          </p>
        </div>
        {activeCategory !== "ticket" && (
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
        )}
      </div>

      {/* 알림 */}
      {msg && activeCategory !== "ticket" && (
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
        {/* 티켓 탭 */}
        <button
          type="button"
          onClick={() => { setActiveCategory("ticket"); closeForm(); setMsg(null); }}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
            activeCategory === "ticket"
              ? "bg-indigo-600 text-white"
              : "border border-indigo-200 bg-white text-indigo-700 hover:bg-indigo-50"
          }`}
        >
          🎫 티켓
        </button>
      </div>

      {/* 티켓 탭 선택 시 별도 패널 렌더링 */}
      {activeCategory === "ticket" && (
        <TicketCatalogTab />
      )}

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

            {/* ── 상품 소개 섹션 ── */}
            <div className="md:col-span-2">
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500 mb-3">📸 상품 소개 콘텐츠 (예약 페이지에 표시)</div>

                {/* 대표 사진 */}
                <div className="mb-4">
                  <label className="block text-xs font-semibold text-slate-600">대표 사진</label>
                  <div className="mt-1.5 flex gap-3 items-center">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) void handleImageUpload(file);
                        e.target.value = "";
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-50"
                    >
                      {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ImagePlus className="h-3.5 w-3.5" />}
                      {uploading ? "업로드 중..." : "사진 업로드"}
                    </button>
                    {form.imageUrl && (
                      <button
                        type="button"
                        onClick={() => setField("imageUrl", undefined)}
                        className="text-xs text-rose-500 hover:underline"
                      >
                        삭제
                      </button>
                    )}
                  </div>
                  {form.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={form.imageUrl} alt="대표 사진" className="mt-2 h-32 w-full rounded-xl object-cover" />
                  ) : (
                    <div className="mt-2 flex h-20 items-center justify-center rounded-xl border border-dashed border-slate-200 text-xs text-slate-400">
                      업로드된 사진 없음
                    </div>
                  )}
                </div>

                {/* 주요 특징 */}
                <div className="mb-4">
                  <label className="block text-xs font-semibold text-slate-600">주요 특징 (한 줄에 하나씩)</label>
                  <textarea
                    value={highlightsInput}
                    onChange={(e) => setHighlightsInput(e.target.value)}
                    rows={3}
                    placeholder={"예:\n분위기 있는 실내 공간\n계절 식재료 사용 브런치 메뉴\n모바일 쿠폰으로 간편 입장"}
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-slate-400 focus:outline-none resize-none"
                  />
                </div>

                {/* 포함 사항 */}
                <div className="mb-4">
                  <label className="block text-xs font-semibold text-slate-600">포함 사항 (한 줄에 하나씩)</label>
                  <textarea
                    value={includesInput}
                    onChange={(e) => setIncludesInput(e.target.value)}
                    rows={3}
                    placeholder={"예:\n브런치 세트 1인 제공\n음료 1잔 포함\n모바일 쿠폰 발송"}
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-slate-400 focus:outline-none resize-none"
                  />
                </div>

                {/* 모바일 쿠폰 안내 */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600">모바일 쿠폰 사용 안내</label>
                  <textarea
                    value={form.couponGuide ?? ""}
                    onChange={(e) => setField("couponGuide", e.target.value || undefined)}
                    rows={3}
                    placeholder="예: 예약 완료 후 등록된 이메일로 모바일 쿠폰이 발송됩니다. 방문 시 쿠폰 화면을 직원에게 제시해 주세요."
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-slate-400 focus:outline-none resize-none"
                  />
                </div>

                {/* 갤러리 이미지 (상세페이지 슬라이더) */}
                <div className="mt-4 border-t border-slate-100 pt-4">
                  <div className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500 mb-2">🖼️ 상세페이지 슬라이더 이미지 (추가)</div>
                  <input
                    ref={galleryInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) void handleGalleryUpload(file);
                      e.target.value = "";
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => galleryInputRef.current?.click()}
                    disabled={uploadingGallery}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-50"
                  >
                    {uploadingGallery ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ImagePlus className="h-3.5 w-3.5" />}
                    {uploadingGallery ? "업로드 중..." : "이미지 추가"}
                  </button>
                  {(form.images ?? []).length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {(form.images ?? []).map((url, idx) => (
                        <div key={idx} className="relative">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={url} alt={`갤러리 ${idx + 1}`} className="h-20 w-28 rounded-xl object-cover" />
                          <button
                            type="button"
                            onClick={() => removeGalleryImage(idx)}
                            className="absolute -right-1.5 -top-1.5 rounded-full bg-rose-500 p-0.5 text-white"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ── 상세페이지 탭 콘텐츠 ── */}
            <div className="md:col-span-2">
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500 mb-3">📋 상세페이지 탭 내용</div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600">공지사항 (선택)</label>
                    <textarea
                      value={form.tabNotice ?? ""}
                      onChange={(e) => setField("tabNotice", e.target.value || undefined)}
                      rows={3}
                      placeholder="공지사항 내용을 입력하세요."
                      className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-slate-400 focus:outline-none resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600">상품상세 (선택)</label>
                    <textarea
                      value={form.tabDetails ?? ""}
                      onChange={(e) => setField("tabDetails", e.target.value || undefined)}
                      rows={5}
                      placeholder="상품 상세 내용을 입력하세요. (더보기로 접힘)"
                      className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-slate-400 focus:outline-none resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600">이용안내 (선택)</label>
                    <textarea
                      value={form.tabUsageInfo ?? ""}
                      onChange={(e) => setField("tabUsageInfo", e.target.value || undefined)}
                      rows={4}
                      placeholder="이용 방법, 주의사항 등을 입력하세요."
                      className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-slate-400 focus:outline-none resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600">취소 및 환불규정 (선택)</label>
                    <textarea
                      value={form.tabCancellation ?? ""}
                      onChange={(e) => setField("tabCancellation", e.target.value || undefined)}
                      rows={4}
                      placeholder="취소 및 환불 규정을 입력하세요."
                      className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-slate-400 focus:outline-none resize-none"
                    />
                  </div>
                </div>
              </div>
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

// ── 티켓 카탈로그 탭 ─────────────────────────────────────────────
function TicketCatalogTab() {
  const [tickets, setTickets] = useState<TicketItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TicketItem | null>(null);
  const [form, setForm] = useState<TicketItem>(emptyTicket());
  const [tagsInput, setTagsInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/ticket-catalog", { cache: "no-store" });
      const json = (await res.json()) as { success: boolean; data?: TicketItem[] };
      if (json.success && json.data) setTickets(json.data);
    } catch {
      setMsg({ type: "err", text: "불러오기 실패" });
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { void load(); }, []);

  function setField<K extends keyof TicketItem>(key: K, value: TicketItem[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function openAdd() {
    setEditingItem(null);
    setForm(emptyTicket());
    setTagsInput("");
    setFormOpen(true);
    setMsg(null);
  }
  function openEdit(item: TicketItem) {
    setEditingItem(item);
    setForm({ ...item });
    setTagsInput(item.tags.join(", "));
    setFormOpen(true);
    setMsg(null);
  }
  function closeForm() {
    setFormOpen(false);
    setEditingItem(null);
    setForm(emptyTicket());
    setTagsInput("");
  }

  async function handleImageUpload(file: File) {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("category", "tickets");
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const json = (await res.json()) as { success: boolean; url?: string; error?: string };
      if (!json.success || !json.url) throw new Error(json.error ?? "업로드 실패");
      setField("imageUrl", json.url);
    } catch (e) {
      setMsg({ type: "err", text: e instanceof Error ? e.message : "이미지 업로드 실패" });
    } finally {
      setUploading(false);
    }
  }

  async function handleGalleryUploadTicket(file: File) {
    setUploadingGallery(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("category", "tickets");
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const json = (await res.json()) as { success: boolean; url?: string; error?: string };
      if (!json.success || !json.url) throw new Error(json.error ?? "업로드 실패");
      setForm((prev) => ({ ...prev, images: [...(prev.images ?? []), json.url!] }));
    } catch (e) {
      setMsg({ type: "err", text: e instanceof Error ? e.message : "갤러리 업로드 실패" });
    } finally {
      setUploadingGallery(false);
    }
  }

  function removeGalleryImageTicket(idx: number) {
    setForm((prev) => ({ ...prev, images: (prev.images ?? []).filter((_, i) => i !== idx) }));
  }

  async function handleSave() {
    if (!form.title.trim()) { setMsg({ type: "err", text: "공연명을 입력하세요." }); return; }
    const tags = tagsInput.split(",").map((t) => t.trim()).filter(Boolean);
    const itemId = editingItem ? form.id : `ticket-${Date.now()}`;
    const payload: TicketItem = { ...form, id: itemId, tags };
    setSaving(true); setMsg(null);
    try {
      const method = editingItem ? "PUT" : "POST";
      const res = await fetch("/api/admin/ticket-catalog", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ item: payload }),
      });
      const json = (await res.json()) as { success: boolean; data?: TicketItem[]; error?: string };
      if (!json.success) throw new Error(json.error ?? "저장 실패");
      if (json.data) setTickets(json.data);
      setMsg({ type: "ok", text: editingItem ? "수정되었습니다." : "티켓이 추가되었습니다." });
      closeForm();
    } catch (e) {
      setMsg({ type: "err", text: e instanceof Error ? e.message : "저장 실패" });
    } finally { setSaving(false); }
  }

  async function handleDelete(item: TicketItem) {
    if (!confirm(`"${item.title}" 티켓을 삭제하시겠습니까?`)) return;
    setSaving(true); setMsg(null);
    try {
      const res = await fetch(`/api/admin/ticket-catalog?id=${item.id}`, { method: "DELETE" });
      const json = (await res.json()) as { success: boolean; data?: TicketItem[]; error?: string };
      if (!json.success) throw new Error(json.error ?? "삭제 실패");
      if (json.data) setTickets(json.data);
      setMsg({ type: "ok", text: "삭제되었습니다." });
    } catch (e) {
      setMsg({ type: "err", text: e instanceof Error ? e.message : "삭제 실패" });
    } finally { setSaving(false); }
  }

  function addOption() {
    setField("options", [...form.options, { id: `opt-${Date.now()}`, label: "", price: 0, benefits: [] }]);
  }
  function removeOption(idx: number) {
    setField("options", form.options.filter((_, i) => i !== idx));
  }
  function setOption(idx: number, key: keyof TicketOption, value: string | number | string[]) {
    const next = form.options.map((o, i) => (i === idx ? { ...o, [key]: value } : o));
    setField("options", next);
  }

  return (
    <div className="mt-6">
      {/* 티켓 탭 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-indigo-700">🎫 티켓 공연·전시·페스티벌 관리</p>
          <p className="mt-0.5 text-xs text-slate-500">포스터, 공연시간, 관람연령, 좌석별 가격 등 인터파크 스타일로 등록합니다.</p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={load} className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">새로고침</button>
          <button type="button" onClick={openAdd} className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">
            <Plus className="h-4 w-4" /> 티켓 추가
          </button>
        </div>
      </div>

      {msg && (
        <div className={`mt-4 rounded-2xl border px-4 py-3 text-sm ${msg.type === "ok" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-rose-200 bg-rose-50 text-rose-700"}`}>
          {msg.text}
        </div>
      )}

      {/* 티켓 목록 */}
      {loading ? (
        <div className="mt-8 flex items-center justify-center gap-2 text-slate-400">
          <Loader2 className="h-5 w-5 animate-spin" /> 불러오는 중...
        </div>
      ) : tickets.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-indigo-200 py-12 text-center text-sm text-slate-400">
          등록된 티켓이 없습니다. 위 버튼으로 추가하세요.
        </div>
      ) : (
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {tickets.map((t) => {
            const minPrice = t.options.length > 0 ? Math.min(...t.options.map((o) => o.price)) : 0;
            const catLabel = TICKET_CATEGORIES.find((c) => c.key === t.category)?.label ?? t.category;
            return (
              <div key={t.id} className="flex flex-col gap-3 overflow-hidden rounded-[20px] border border-indigo-100 bg-indigo-50/30 p-4">
                {t.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={t.imageUrl} alt={t.title} className="h-28 w-full rounded-[14px] object-cover" />
                ) : (
                  <div className={`flex h-20 flex-col justify-end rounded-[14px] bg-gradient-to-br ${t.imageTone} px-3 py-2`}>
                    <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-600">{t.badge}</div>
                    <div className="text-lg font-black tracking-tight text-slate-900">{t.posterLabel}</div>
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-700">{catLabel}</span>
                    {t.badge && <span className="text-[10px] text-slate-500">{t.badge}</span>}
                  </div>
                  <div className="mt-1 text-sm font-bold text-slate-900 line-clamp-1">{t.title}</div>
                  <div className="mt-0.5 text-xs text-slate-500 line-clamp-1">{t.venue} · {t.dateText}</div>
                  {(t.duration || t.ageLimit) && (
                    <div className="mt-0.5 text-xs text-slate-400">
                      {t.duration && `⏱ ${t.duration}`}{t.duration && t.ageLimit && " · "}{t.ageLimit && `👤 ${t.ageLimit}`}
                    </div>
                  )}
                  {minPrice > 0 && (
                    <div className="mt-1 text-sm font-black text-indigo-700">₩{minPrice.toLocaleString("ko-KR")} ~</div>
                  )}
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => openEdit(t)} className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                    <Edit2 className="h-3.5 w-3.5" /> 수정
                  </button>
                  <button type="button" onClick={() => handleDelete(t)} disabled={saving} className="flex items-center justify-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-100 disabled:opacity-50">
                    <Trash2 className="h-3.5 w-3.5" /> 삭제
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 추가/수정 폼 */}
      {formOpen && (
        <div className="mt-6 rounded-[24px] border border-indigo-100 bg-indigo-50/30 p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">{editingItem ? "티켓 수정" : "새 티켓 추가"}</h3>
            <button type="button" onClick={closeForm} className="rounded-full p-1.5 text-slate-400 hover:bg-slate-200"><X className="h-5 w-5" /></button>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {/* 카테고리 */}
            <div>
              <label className="block text-xs font-semibold text-slate-600">카테고리 *</label>
              <select value={form.category} onChange={(e) => setField("category", e.target.value as TicketCategory)}
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none">
                {TICKET_CATEGORIES.map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}
              </select>
            </div>
            {/* 배지 */}
            <div>
              <label className="block text-xs font-semibold text-slate-600">배지 (예: 예매 중, 오픈 예정)</label>
              <input type="text" value={form.badge} onChange={(e) => setField("badge", e.target.value)}
                placeholder="예: 예매 중" className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none" />
            </div>
            {/* 포스터 라벨 */}
            <div>
              <label className="block text-xs font-semibold text-slate-600">포스터 큰 텍스트</label>
              <input type="text" value={form.posterLabel} onChange={(e) => setField("posterLabel", e.target.value)}
                placeholder="예: ARENA, MUSICAL, FEST" className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none" />
            </div>
            {/* 공연명 */}
            <div>
              <label className="block text-xs font-semibold text-slate-600">공연명 *</label>
              <input type="text" value={form.title} onChange={(e) => setField("title", e.target.value)}
                placeholder="예: 뮤지컬 데스노트 - 대전" className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none" />
            </div>
            {/* 부제목 */}
            <div>
              <label className="block text-xs font-semibold text-slate-600">부제목</label>
              <input type="text" value={form.subtitle} onChange={(e) => setField("subtitle", e.target.value)}
                placeholder="예: 고양형 K-POP 연계 공연" className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none" />
            </div>
            {/* 공연장 */}
            <div>
              <label className="block text-xs font-semibold text-slate-600">공연장 (장소)</label>
              <input type="text" value={form.venue} onChange={(e) => setField("venue", e.target.value)}
                placeholder="예: 고양아람누리 아람극장" className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none" />
            </div>
            {/* 공연 기간 */}
            <div>
              <label className="block text-xs font-semibold text-slate-600">공연 기간</label>
              <input type="text" value={form.dateText} onChange={(e) => setField("dateText", e.target.value)}
                placeholder="예: 2026.06.09 ~ 2026.06.14" className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none" />
            </div>
            {/* 공연 시간 */}
            <div>
              <label className="block text-xs font-semibold text-slate-600">공연 시간</label>
              <input type="text" value={form.duration ?? ""} onChange={(e) => setField("duration", e.target.value || undefined)}
                placeholder="예: 165분 (인터미션 20분 포함)" className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none" />
            </div>
            {/* 관람 연령 */}
            <div>
              <label className="block text-xs font-semibold text-slate-600">관람 연령</label>
              <input type="text" value={form.ageLimit ?? ""} onChange={(e) => setField("ageLimit", e.target.value || undefined)}
                placeholder="예: 14세 이상 관람가" className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none" />
            </div>
            {/* 카드 색상 */}
            <div>
              <label className="block text-xs font-semibold text-slate-600">카드 색상 (포스터 미사용 시)</label>
              <select value={form.imageTone} onChange={(e) => setField("imageTone", e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none">
                {COLOR_PRESETS_TICKET.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
              <div className={`mt-1.5 h-8 w-full rounded-lg bg-gradient-to-br ${form.imageTone}`} />
            </div>
            {/* 한 줄 설명 */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-600">한 줄 설명</label>
              <input type="text" value={form.summary} onChange={(e) => setField("summary", e.target.value)}
                placeholder="예: 고양 공연 인프라의 시작을 알리는 K-POP 라이브 시리즈." className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none" />
            </div>
            {/* 상세 설명 */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-600">상세 설명</label>
              <textarea value={form.description} onChange={(e) => setField("description", e.target.value)}
                rows={3} placeholder="공연 상세 설명을 입력하세요."
                className="mt-1.5 w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none" />
            </div>
            {/* 포스터 사진 업로드 */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-600">포스터 사진</label>
              <div className="mt-1.5 flex gap-3 items-center">
                <input ref={fileRef} type="file" accept="image/*" className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) void handleImageUpload(f); e.target.value = ""; }} />
                <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-50">
                  {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ImagePlus className="h-3.5 w-3.5" />}
                  {uploading ? "업로드 중..." : "포스터 업로드"}
                </button>
                {form.imageUrl && <button type="button" onClick={() => setField("imageUrl", undefined)} className="text-xs text-rose-500 hover:underline">삭제</button>}
              </div>
              {form.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={form.imageUrl} alt="포스터" className="mt-2 h-40 w-full rounded-xl object-cover object-top" />
              ) : (
                <div className="mt-2 flex h-20 items-center justify-center rounded-xl border border-dashed border-slate-200 text-xs text-slate-400">업로드된 포스터 없음</div>
              )}
            </div>
            {/* 갤러리 이미지 */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-600">상세페이지 슬라이더 이미지 (추가)</label>
              <div className="mt-1.5 flex gap-3 items-center">
                <input ref={galleryRef} type="file" accept="image/*" className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) void handleGalleryUploadTicket(f); e.target.value = ""; }} />
                <button type="button" onClick={() => galleryRef.current?.click()} disabled={uploadingGallery}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-50">
                  {uploadingGallery ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ImagePlus className="h-3.5 w-3.5" />}
                  {uploadingGallery ? "업로드 중..." : "이미지 추가"}
                </button>
              </div>
              {(form.images ?? []).length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {(form.images ?? []).map((url, idx) => (
                    <div key={idx} className="relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt={`갤러리 ${idx + 1}`} className="h-20 w-28 rounded-xl object-cover" />
                      <button type="button" onClick={() => removeGalleryImageTicket(idx)}
                        className="absolute -right-1.5 -top-1.5 rounded-full bg-rose-500 p-0.5 text-white">
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* 태그 */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-600">태그 (쉼표로 구분)</label>
              <input type="text" value={tagsInput} onChange={(e) => setTagsInput(e.target.value)}
                placeholder="예: K-POP, 공연, 프리미엄 좌석" className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none" />
            </div>
            {/* 상세페이지 탭 콘텐츠 */}
            <div className="md:col-span-2">
              <div className="rounded-xl border border-indigo-100 bg-white p-4">
                <div className="text-xs font-bold uppercase tracking-[0.15em] text-indigo-500 mb-3">📋 상세페이지 탭 내용</div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600">공지사항</label>
                    <textarea value={form.tabNotice ?? ""} onChange={(e) => setField("tabNotice", e.target.value || undefined)}
                      rows={2} placeholder="공지사항 내용" className="mt-1 w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600">캐스팅 정보</label>
                    <textarea value={form.tabCasting ?? ""} onChange={(e) => setField("tabCasting", e.target.value || undefined)}
                      rows={3} placeholder="배우/캐스팅 정보를 입력하세요." className="mt-1 w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600">상품상세</label>
                    <textarea value={form.tabDetails ?? ""} onChange={(e) => setField("tabDetails", e.target.value || undefined)}
                      rows={4} placeholder="공연 상세 내용을 입력하세요." className="mt-1 w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600">가격 안내</label>
                    <textarea value={form.tabPrice ?? ""} onChange={(e) => setField("tabPrice", e.target.value || undefined)}
                      rows={4} placeholder="좌석 등급별 가격, 구매 조건 등을 입력하세요." className="mt-1 w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600">할인정보</label>
                    <textarea value={form.tabDiscount ?? ""} onChange={(e) => setField("tabDiscount", e.target.value || undefined)}
                      rows={4} placeholder="얼리버드, 단체 할인, 청소년 할인 등을 입력하세요." className="mt-1 w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600">이용안내</label>
                    <textarea value={form.tabUsageInfo ?? ""} onChange={(e) => setField("tabUsageInfo", e.target.value || undefined)}
                      rows={3} placeholder="공연장 이용 안내" className="mt-1 w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600">장소 안내</label>
                    <textarea value={form.tabVenue ?? ""} onChange={(e) => setField("tabVenue", e.target.value || undefined)}
                      rows={4} placeholder="공연장 주소, 교통편, 주차 안내 등을 입력하세요." className="mt-1 w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600">취소 및 환불규정</label>
                    <textarea value={form.tabCancellation ?? ""} onChange={(e) => setField("tabCancellation", e.target.value || undefined)}
                      rows={3} placeholder="취소/환불 규정을 입력하세요." className="mt-1 w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none" />
                  </div>
                </div>
              </div>
            </div>
            {/* 좌석 등급 옵션 */}
            <div className="md:col-span-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-600">좌석 등급 / 가격 (VIP · R석 · S석 등)</label>
                <button type="button" onClick={addOption} className="flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-50">
                  <Plus className="h-3.5 w-3.5" /> 등급 추가
                </button>
              </div>
              {form.options.length === 0 ? (
                <p className="mt-2 text-xs text-slate-400">좌석 등급이 없습니다. 위 버튼으로 추가하세요.</p>
              ) : (
                <div className="mt-2 space-y-2">
                  {form.options.map((opt, idx) => (
                    <div key={opt.id} className="flex gap-2 rounded-xl border border-slate-200 bg-white p-3">
                      <div className="flex flex-1 flex-wrap gap-2">
                        <input type="text" value={opt.label} onChange={(e) => setOption(idx, "label", e.target.value)}
                          placeholder="등급명 (예: VIP, R석)" className="flex-1 min-w-[100px] rounded-lg border border-slate-200 px-2 py-1.5 text-xs focus:outline-none" />
                        <input type="number" value={opt.price || ""} onChange={(e) => setOption(idx, "price", Number(e.target.value))}
                          placeholder="가격" className="w-24 rounded-lg border border-slate-200 px-2 py-1.5 text-xs focus:outline-none" />
                        <input type="text" value={opt.benefits.join(", ")} onChange={(e) => setOption(idx, "benefits", e.target.value.split(",").map((b) => b.trim()).filter(Boolean))}
                          placeholder="혜택 (쉼표 구분, 예: 우선입장, 굿즈)" className="flex-1 min-w-[120px] rounded-lg border border-slate-200 px-2 py-1.5 text-xs focus:outline-none" />
                      </div>
                      <button type="button" onClick={() => removeOption(idx)} className="flex-shrink-0 rounded-full p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-500">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mt-5 flex justify-end gap-3">
            <button type="button" onClick={closeForm} className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100">취소</button>
            <button type="button" onClick={handleSave} disabled={saving}
              className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50">
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {editingItem ? "수정 저장" : "티켓 추가"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
