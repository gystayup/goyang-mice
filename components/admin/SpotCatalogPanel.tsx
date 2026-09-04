"use client";

// components/admin/SpotCatalogPanel.tsx — 오더 #C54 admin 스팟 관리.
//
// 저장소: /api/admin/spot-catalog (Supabase pages · pageKey='spot-catalog').
// 이미지 업로드: 기존 /api/admin/upload (category='spots') 재사용.
// 편집: 5로케일 (ko/en/ja/zh-CN/zh-TW) · 카테고리 9종 · 갤러리 배열 · published on/off.
// 안내: "갤러리의 1~3번째 사진이 프론트에 노출됩니다" (#C39 유지).

import { useEffect, useMemo, useRef, useState } from "react";
import { Edit2, ImagePlus, Loader2, Plus, Save, Search, Trash2, X } from "lucide-react";

import type { Spot, SpotGalleryImage } from "@/data/spots";

const CATEGORIES: { key: string; label: string }[] = [
  { key: "walk", label: "산책" },
  { key: "food", label: "미식" },
  { key: "culture", label: "문화" },
  { key: "kculture", label: "K-컬처" },
  { key: "history", label: "왕릉" },
  { key: "family", label: "가족" },
  { key: "shopping", label: "쇼핑" },
  { key: "stay", label: "스테이" },
  { key: "night", label: "밤" },
];

const LOCALES = [
  { key: "ko", label: "한국어" },
  { key: "en", label: "English" },
  { key: "ja", label: "日本語" },
  { key: "zh-CN", label: "简体" },
  { key: "zh-TW", label: "繁體" },
] as const;

type Locale = (typeof LOCALES)[number]["key"];

interface EditState {
  spot: Spot;
  isNew: boolean;
}

const emptyI18n = () => ({ ko: "", en: "", ja: "", "zh-CN": "", "zh-TW": "" });

function emptySpot(): Spot {
  return {
    slug: "",
    category: "walk",
    type: "list",
    region: "",
    title: emptyI18n(),
    title_en_display: "",
    subtitle: emptyI18n(),
    lead: emptyI18n(),
    meta: { updated_at: new Date().toISOString().slice(0, 10) },
    sections: [],
    access: [],
    know: [],
    ko_card: [],
    credits: [],
    related: [],
    highlights: [{ ...emptyI18n() }, { ...emptyI18n() }, { ...emptyI18n() }],
    info: { hours: "varies", duration: "1_2h", admission: "varies", access: "wheelchair" },
    adSlot: null,
    published: true,
    gallery: [],
  };
}

const PAGE_SIZE = 20;

export default function SpotCatalogPanel() {
  const [items, setItems] = useState<Spot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const [edit, setEdit] = useState<EditState | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/spot-catalog", { cache: "no-store" });
      const json = (await res.json()) as { success: boolean; data?: Spot[]; error?: string };
      if (!json.success || !json.data) throw new Error(json.error ?? "목록을 불러오지 못했습니다.");
      setItems(json.data);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  const filtered = useMemo(() => {
    return items.filter((s) => {
      if (filterCategory && s.category !== filterCategory) return false;
      if (query) {
        const q = query.toLowerCase();
        const hit =
          s.slug.toLowerCase().includes(q) ||
          (s.title.ko ?? "").toLowerCase().includes(q) ||
          (s.title_en_display ?? "").toLowerCase().includes(q);
        if (!hit) return false;
      }
      return true;
    });
  }, [items, filterCategory, query]);

  useEffect(() => {
    setPage(0);
  }, [filterCategory, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  async function handleSave() {
    if (!edit) return;
    const item = edit.spot;
    if (!item.slug || !item.title.ko) {
      setError("slug와 한국어 이름은 필수입니다.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const method = edit.isNew ? "POST" : "PUT";
      const res = await fetch("/api/admin/spot-catalog", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ item }),
      });
      const json = (await res.json()) as { success: boolean; data?: Spot[]; error?: string };
      if (!json.success || !json.data) throw new Error(json.error ?? "저장 실패");
      setItems(json.data);
      setEdit(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(slug: string) {
    if (!confirm(`정말 삭제하시겠습니까? (${slug})`)) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/spot-catalog?slug=${encodeURIComponent(slug)}`, {
        method: "DELETE",
      });
      const json = (await res.json()) as { success: boolean; data?: Spot[]; error?: string };
      if (!json.success || !json.data) throw new Error(json.error ?? "삭제 실패");
      setItems(json.data);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }

  async function handleUpload(file: File) {
    if (!edit) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("category", "spots");
      const res = await fetch("/api/admin/upload", { method: "POST", body: form });
      const json = (await res.json()) as { success: boolean; url?: string; error?: string };
      if (!json.success || !json.url) throw new Error(json.error ?? "업로드 실패");
      const gallery = [...(edit.spot.gallery ?? []), { url: json.url }];
      setEdit({ ...edit, spot: { ...edit.spot, gallery } });
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setUploading(false);
    }
  }

  function moveImage(i: number, dir: -1 | 1) {
    if (!edit) return;
    const gallery = [...(edit.spot.gallery ?? [])];
    const j = i + dir;
    if (j < 0 || j >= gallery.length) return;
    [gallery[i], gallery[j]] = [gallery[j], gallery[i]];
    setEdit({ ...edit, spot: { ...edit.spot, gallery } });
  }

  function removeImage(i: number) {
    if (!edit) return;
    const gallery = [...(edit.spot.gallery ?? [])];
    gallery.splice(i, 1);
    setEdit({ ...edit, spot: { ...edit.spot, gallery } });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900">스팟 관리 (총 {items.length}건)</h2>
        <button
          type="button"
          onClick={() => setEdit({ spot: emptySpot(), isNew: true })}
          className="inline-flex items-center gap-1.5 rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800"
        >
          <Plus className="h-4 w-4" /> 새 스팟
        </button>
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setFilterCategory("")}
          className={`rounded-full px-3 py-1 text-xs font-semibold ${filterCategory === "" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
        >
          전체
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c.key}
            type="button"
            onClick={() => setFilterCategory(c.key)}
            className={`rounded-full px-3 py-1 text-xs font-semibold ${filterCategory === c.key ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
          >
            {c.label}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-1 rounded-md border border-slate-300 bg-white px-2 py-1">
          <Search className="h-3.5 w-3.5 text-slate-400" />
          <input
            type="search"
            placeholder="slug/이름 검색"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="min-w-0 flex-1 border-0 bg-transparent text-sm outline-none"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-slate-500"><Loader2 className="h-4 w-4 animate-spin" /> 로딩 중...</div>
      ) : (
        <div className="overflow-hidden rounded-md border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">Slug</th>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">이름 (KO)</th>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">카테고리</th>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">지역</th>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">갤러리</th>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">노출</th>
                <th className="px-3 py-2 text-right font-semibold text-slate-700">액션</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {paged.map((s) => (
                <tr key={s.slug} className="hover:bg-slate-50">
                  <td className="px-3 py-2 font-mono text-xs text-slate-600">{s.slug}</td>
                  <td className="px-3 py-2 text-slate-900">{s.title.ko}</td>
                  <td className="px-3 py-2 text-slate-700">{s.category}</td>
                  <td className="px-3 py-2 text-slate-700">{s.region}</td>
                  <td className="px-3 py-2 text-slate-700">{s.gallery?.length ?? 0}장</td>
                  <td className="px-3 py-2">
                    {s.published === false ? (
                      <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs text-slate-600">숨김</span>
                    ) : (
                      <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-800">노출</span>
                    )}
                  </td>
                  <td className="px-3 py-2 text-right">
                    <button
                      type="button"
                      onClick={() => setEdit({ spot: JSON.parse(JSON.stringify(s)) as Spot, isNew: false })}
                      className="mr-1 inline-flex items-center gap-1 rounded-md border border-slate-300 px-2 py-1 text-xs hover:bg-slate-100"
                    >
                      <Edit2 className="h-3 w-3" /> 편집
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleDelete(s.slug)}
                      className="inline-flex items-center gap-1 rounded-md border border-red-300 px-2 py-1 text-xs text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-3 w-3" /> 삭제
                    </button>
                  </td>
                </tr>
              ))}
              {paged.length === 0 && (
                <tr><td colSpan={7} className="px-3 py-8 text-center text-slate-500">결과 없음</td></tr>
              )}
            </tbody>
          </table>
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-3 py-2 text-sm">
              <span className="text-slate-600">{page + 1} / {totalPages} 페이지</span>
              <div className="flex gap-1">
                <button type="button" onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0} className="rounded-md border border-slate-300 px-2 py-1 disabled:opacity-40">이전</button>
                <button type="button" onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1} className="rounded-md border border-slate-300 px-2 py-1 disabled:opacity-40">다음</button>
              </div>
            </div>
          )}
        </div>
      )}

      {edit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setEdit(null)}>
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3">
              <h3 className="text-lg font-bold">{edit.isNew ? "새 스팟" : "스팟 편집"}</h3>
              <button type="button" onClick={() => setEdit(null)} className="text-slate-500 hover:text-slate-700"><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-4 px-5 py-4">
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="text-xs font-semibold text-slate-700">Slug (URL 키)</span>
                  <input type="text" value={edit.spot.slug} disabled={!edit.isNew} onChange={(e) => setEdit({ ...edit, spot: { ...edit.spot, slug: e.target.value } })} className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1 text-sm disabled:bg-slate-100" placeholder="예: my-new-spot" />
                </label>
                <label className="block">
                  <span className="text-xs font-semibold text-slate-700">카테고리</span>
                  <select value={edit.spot.category} onChange={(e) => setEdit({ ...edit, spot: { ...edit.spot, category: e.target.value as Spot["category"] } })} className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1 text-sm">
                    {CATEGORIES.map((c) => (<option key={c.key} value={c.key}>{c.label}</option>))}
                  </select>
                </label>
                <label className="block">
                  <span className="text-xs font-semibold text-slate-700">지역 (region)</span>
                  <input type="text" value={edit.spot.region} onChange={(e) => setEdit({ ...edit, spot: { ...edit.spot, region: e.target.value } })} className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1 text-sm" placeholder="예: 일산동구" />
                </label>
                <label className="block">
                  <span className="text-xs font-semibold text-slate-700">영문 대제목</span>
                  <input type="text" value={edit.spot.title_en_display} onChange={(e) => setEdit({ ...edit, spot: { ...edit.spot, title_en_display: e.target.value } })} className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1 text-sm" placeholder="예: ILSAN LAKE PARK" />
                </label>
              </div>

              <div>
                <div className="mb-1 text-xs font-semibold text-slate-700">이름 (5로케일)</div>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {LOCALES.map((l) => (
                    <input key={l.key} type="text" value={edit.spot.title[l.key as Locale] ?? ""} onChange={(e) => setEdit({ ...edit, spot: { ...edit.spot, title: { ...edit.spot.title, [l.key]: e.target.value } } })} className="rounded-md border border-slate-300 px-2 py-1 text-sm" placeholder={l.label} />
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-1 text-xs font-semibold text-slate-700">한 줄 소개 (subtitle · 5로케일)</div>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {LOCALES.map((l) => (
                    <input key={l.key} type="text" value={edit.spot.subtitle[l.key as Locale] ?? ""} onChange={(e) => setEdit({ ...edit, spot: { ...edit.spot, subtitle: { ...edit.spot.subtitle, [l.key]: e.target.value } } })} className="rounded-md border border-slate-300 px-2 py-1 text-sm" placeholder={l.label} />
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-1 text-xs font-semibold text-slate-700">상세 설명 (lead · 5로케일)</div>
                <div className="grid grid-cols-1 gap-2">
                  {LOCALES.map((l) => (
                    <textarea key={l.key} rows={2} value={edit.spot.lead[l.key as Locale] ?? ""} onChange={(e) => setEdit({ ...edit, spot: { ...edit.spot, lead: { ...edit.spot.lead, [l.key]: e.target.value } } })} className="rounded-md border border-slate-300 px-2 py-1 text-sm" placeholder={l.label} />
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-700">갤러리 이미지 <span className="ml-1 text-slate-500">({edit.spot.gallery?.length ?? 0}장 · 프론트에는 1~3번째만 노출됩니다)</span></span>
                  <div>
                    <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) void handleUpload(f); e.target.value = ""; }} />
                    <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading} className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-2 py-1 text-xs hover:bg-slate-50 disabled:opacity-50">
                      {uploading ? <Loader2 className="h-3 w-3 animate-spin" /> : <ImagePlus className="h-3 w-3" />} 업로드
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {(edit.spot.gallery ?? []).map((img: SpotGalleryImage, i) => (
                    <div key={`${img.url}-${i}`} className={`relative aspect-[4/3] overflow-hidden rounded-md border-2 ${i < 3 ? "border-green-500" : "border-slate-200"} bg-slate-100`}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img.url} alt="" className="h-full w-full object-cover" />
                      <div className="absolute inset-x-0 top-0 flex justify-between p-1 text-xs">
                        <span className={`rounded px-1 ${i < 3 ? "bg-green-500 text-white" : "bg-white/90 text-slate-700"}`}>{i + 1}</span>
                      </div>
                      <div className="absolute inset-x-0 bottom-0 flex justify-between bg-black/40 p-1">
                        <button type="button" onClick={() => moveImage(i, -1)} disabled={i === 0} className="rounded bg-white/90 px-1 text-xs text-slate-700 disabled:opacity-40">◀</button>
                        <button type="button" onClick={() => removeImage(i)} className="rounded bg-red-500/90 px-1 text-xs text-white">삭제</button>
                        <button type="button" onClick={() => moveImage(i, 1)} disabled={i >= (edit.spot.gallery?.length ?? 0) - 1} className="rounded bg-white/90 px-1 text-xs text-slate-700 disabled:opacity-40">▶</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="inline-flex items-center gap-2">
                  <input type="checkbox" checked={edit.spot.published !== false} onChange={(e) => setEdit({ ...edit, spot: { ...edit.spot, published: e.target.checked } })} className="h-4 w-4" />
                  <span className="text-sm">프론트 노출</span>
                </label>
              </div>
            </div>
            <div className="flex justify-end gap-2 border-t border-slate-200 bg-slate-50 px-5 py-3">
              <button type="button" onClick={() => setEdit(null)} className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm">취소</button>
              <button type="button" onClick={() => void handleSave()} disabled={loading} className="inline-flex items-center gap-1 rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} 저장
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
