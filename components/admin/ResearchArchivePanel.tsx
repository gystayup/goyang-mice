"use client";

import { useEffect, useRef, useState } from "react";
import { Edit2, FileText, ImageIcon, Loader2, Plus, Trash2, Upload, X } from "lucide-react";

const GRADIENT_PRESETS = [
  {
    label: "봄 (오렌지)",
    value:
      "linear-gradient(180deg, rgba(255,255,255,0.18), rgba(16,32,58,0.16)), linear-gradient(135deg, #ffe98b 0%, #ffb58f 36%, #ff8f7e 100%)",
  },
  {
    label: "여름 (블루)",
    value:
      "linear-gradient(180deg, rgba(255,255,255,0.14), rgba(16,32,58,0.18)), linear-gradient(135deg, #8df0cf 0%, #7fd7ff 42%, #567df0 100%)",
  },
  {
    label: "가을 (퍼플)",
    value:
      "linear-gradient(180deg, rgba(255,255,255,0.14), rgba(16,32,58,0.18)), linear-gradient(135deg, #ffc4cf 0%, #f7a8ff 34%, #7d82ff 100%)",
  },
  {
    label: "겨울 (네이비)",
    value:
      "linear-gradient(180deg, rgba(255,255,255,0.16), rgba(16,32,58,0.22)), linear-gradient(135deg, #d8f4ff 0%, #a4d8ff 32%, #3556a8 100%)",
  },
  {
    label: "그린",
    value:
      "linear-gradient(180deg, rgba(255,255,255,0.14), rgba(16,32,58,0.18)), linear-gradient(135deg, #b8f5c8 0%, #6edfa0 40%, #1a8c5a 100%)",
  },
  {
    label: "골드",
    value:
      "linear-gradient(180deg, rgba(255,255,255,0.14), rgba(16,32,58,0.18)), linear-gradient(135deg, #fff3b0 0%, #ffd966 40%, #c97b00 100%)",
  },
];

const CATEGORY_TAGS = ["기본연구", "정책연구", "이슈브리프", "개청브리프"];

type ArchiveItem = {
  id: string;
  title: string;
  summary: string | null;
  content: string;
};

type ParsedItem = {
  id: string;
  issue: string;
  season: string;
  title: string;
  desc: string;
  gradient: string;
  posterUrl: string;
  fileUrl: string;
  fileName: string;
  categoryTag: string;
  authors: string;
  publishDate: string;
};

type FormState = Omit<ParsedItem, "id"> & { id: string };

const emptyForm: FormState = {
  id: "",
  issue: "",
  season: "",
  title: "",
  desc: "",
  gradient: GRADIENT_PRESETS[0].value,
  posterUrl: "",
  fileUrl: "",
  fileName: "",
  categoryTag: CATEGORY_TAGS[0],
  authors: "",
  publishDate: "",
};

function parseItem(item: ArchiveItem): ParsedItem {
  let meta = {
    issue: "",
    season: "",
    gradient: GRADIENT_PRESETS[0].value,
    posterUrl: "",
    fileUrl: "",
    fileName: "",
    categoryTag: "",
    authors: "",
    publishDate: "",
  };
  try {
    meta = { ...meta, ...(JSON.parse(item.content) as typeof meta) };
  } catch {
    // ignore
  }
  return {
    id: item.id,
    issue: meta.issue ?? "",
    season: meta.season ?? "",
    title: item.title,
    desc: item.summary ?? "",
    gradient: meta.gradient ?? GRADIENT_PRESETS[0].value,
    posterUrl: meta.posterUrl ?? "",
    fileUrl: meta.fileUrl ?? "",
    fileName: meta.fileName ?? "",
    categoryTag: meta.categoryTag ?? "",
    authors: meta.authors ?? "",
    publishDate: meta.publishDate ?? "",
  };
}

export default function ResearchArchivePanel() {
  const [items, setItems] = useState<ParsedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [uploadingPoster, setUploadingPoster] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const posterInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/research-archives");
      const data = (await res.json()) as { success: boolean; data: ArchiveItem[] };
      if (data.success) setItems(data.data.map(parseItem));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  function openNew() {
    setForm(emptyForm);
    setError("");
    setShowForm(true);
  }

  function openEdit(item: ParsedItem) {
    setForm({ ...item });
    setError("");
    setShowForm(true);
  }

  async function uploadTo(file: File, category: string): Promise<{ url: string; filename: string }> {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("category", category);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const data = (await res.json()) as {
      success: boolean;
      url?: string;
      filename?: string;
      originalName?: string;
      error?: string;
    };
    if (!data.success || !data.url) throw new Error(data.error ?? "업로드 실패");
    return { url: data.url, filename: data.originalName ?? data.filename ?? file.name };
  }

  async function handlePosterUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPoster(true);
    setError("");
    try {
      const { url } = await uploadTo(file, "research-poster");
      setForm((f) => ({ ...f, posterUrl: url }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "포스터 업로드 실패");
    } finally {
      setUploadingPoster(false);
      if (posterInputRef.current) posterInputRef.current.value = "";
    }
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingFile(true);
    setError("");
    try {
      const { url, filename } = await uploadTo(file, "research-file");
      setForm((f) => ({ ...f, fileUrl: url, fileName: filename }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "파일 업로드 실패");
    } finally {
      setUploadingFile(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function save() {
    if (!form.issue || !form.season || !form.title || !form.desc) {
      setError("권호/시즌/제목/설명은 필수 입력입니다.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const method = form.id ? "PUT" : "POST";
      const res = await fetch("/api/admin/research-archives", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = (await res.json()) as { success: boolean; error?: string };
      if (!data.success) throw new Error(data.error ?? "저장 실패");
      setShowForm(false);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "저장 실패");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("삭제하시겠습니까?")) return;
    await fetch("/api/admin/research-archives", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    await load();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">연구 아카이브 관리</h2>
        <button
          onClick={openNew}
          className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
        >
          <Plus className="h-4 w-4" />
          새 아카이브 추가
        </button>
      </div>

      {/* 폼 모달 */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-[24px] bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold">{form.id ? "아카이브 수정" : "새 아카이브"}</h3>
              <button onClick={() => setShowForm(false)}>
                <X className="h-5 w-5 text-slate-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">권호 (예: VOL.05)</label>
                  <input
                    value={form.issue}
                    onChange={(e) => setForm((f) => ({ ...f, issue: e.target.value }))}
                    placeholder="VOL.05"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">시즌 (예: 2026 SPRING)</label>
                  <input
                    value={form.season}
                    onChange={(e) => setForm((f) => ({ ...f, season: e.target.value }))}
                    placeholder="2026 SPRING"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">카테고리 태그</label>
                  <select
                    value={form.categoryTag}
                    onChange={(e) => setForm((f) => ({ ...f, categoryTag: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
                  >
                    {CATEGORY_TAGS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">발행일</label>
                  <input
                    type="date"
                    value={form.publishDate}
                    onChange={(e) => setForm((f) => ({ ...f, publishDate: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">제목</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="연구 자료 제목"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">저자 (예: 주연우 外)</label>
                <input
                  value={form.authors}
                  onChange={(e) => setForm((f) => ({ ...f, authors: e.target.value }))}
                  placeholder="주연우 外"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">설명</label>
                <textarea
                  value={form.desc}
                  onChange={(e) => setForm((f) => ({ ...f, desc: e.target.value }))}
                  rows={3}
                  placeholder="연구 자료에 대한 간략한 설명"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
                />
              </div>

              {/* 포스터 업로드 */}
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">포스터 이미지 (표지)</label>
                <div className="flex items-center gap-3">
                  {form.posterUrl ? (
                    <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-lg border border-slate-200">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={form.posterUrl} alt="포스터" className="h-full w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setForm((f) => ({ ...f, posterUrl: "" }))}
                        className="absolute right-1 top-1 rounded-full bg-black/60 p-0.5 text-white"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex h-24 w-20 shrink-0 items-center justify-center rounded-lg border border-dashed border-slate-300 text-slate-400">
                      <ImageIcon className="h-6 w-6" />
                    </div>
                  )}
                  <div className="flex-1">
                    <input
                      ref={posterInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handlePosterUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => posterInputRef.current?.click()}
                      disabled={uploadingPoster}
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40"
                    >
                      {uploadingPoster ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                      {uploadingPoster ? "업로드 중..." : form.posterUrl ? "포스터 교체" : "포스터 업로드"}
                    </button>
                    <p className="mt-1 text-xs text-slate-500">JPG · PNG · WEBP (최대 100MB)</p>
                  </div>
                </div>
              </div>

              {/* 연구자료 파일 업로드 */}
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">연구자료 파일 (PDF)</label>
                <div className="flex items-center gap-3">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50">
                    <FileText className={`h-6 w-6 ${form.fileUrl ? "text-rose-500" : "text-slate-300"}`} />
                  </div>
                  <div className="flex-1">
                    {form.fileUrl && (
                      <div className="mb-1 flex items-center gap-2 text-xs text-slate-600">
                        <span className="truncate">{form.fileName || form.fileUrl}</span>
                        <button
                          type="button"
                          onClick={() => setForm((f) => ({ ...f, fileUrl: "", fileName: "" }))}
                          className="shrink-0 text-rose-500 hover:text-rose-700"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="application/pdf"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingFile}
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40"
                    >
                      {uploadingFile ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                      {uploadingFile ? "업로드 중..." : form.fileUrl ? "파일 교체" : "PDF 업로드"}
                    </button>
                    <p className="mt-1 text-xs text-slate-500">PDF (최대 100MB)</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">카드 색상 (포스터 미등록 시 사용)</label>
                <div className="grid grid-cols-3 gap-2">
                  {GRADIENT_PRESETS.map((g) => (
                    <button
                      key={g.label}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, gradient: g.value }))}
                      className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-medium transition ${
                        form.gradient === g.value ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-slate-50 text-slate-700"
                      }`}
                    >
                      <span className="h-4 w-4 shrink-0 rounded-full" style={{ background: g.value }} />
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>

              {error && <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setShowForm(false)}
                  className="flex-1 rounded-full border border-slate-200 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  취소
                </button>
                <button
                  onClick={save}
                  disabled={saving}
                  className="flex-1 rounded-full bg-slate-900 py-2 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-40"
                >
                  {saving ? "저장 중..." : "저장"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 목록 */}
      {loading ? (
        <p className="text-sm text-slate-500">불러오는 중...</p>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 p-10 text-center">
          <p className="text-sm text-slate-500">등록된 아카이브가 없습니다.</p>
          <p className="mt-1 text-xs text-slate-400">위의 &ldquo;새 아카이브 추가&rdquo; 버튼으로 추가하세요.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="h-24 w-20 shrink-0 overflow-hidden rounded-lg">
                {item.posterUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={item.posterUrl} alt={item.title} className="h-full w-full object-cover" />
                ) : (
                  <div
                    className="flex h-full w-full flex-col justify-end p-2 text-white"
                    style={{ background: item.gradient }}
                  >
                    <div className="text-[8px] font-semibold opacity-80">{item.season}</div>
                    <div className="text-xs font-black">{item.issue}</div>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  {item.categoryTag && (
                    <span className="rounded-md bg-indigo-100 px-2 py-0.5 text-xs font-semibold text-indigo-700">
                      {item.categoryTag}
                    </span>
                  )}
                  <span className="text-xs text-slate-500">{item.issue} · {item.season}</span>
                </div>
                <p className="mt-1 truncate text-sm font-bold text-slate-900">{item.title}</p>
                <p className="mt-1 text-xs text-slate-500 line-clamp-2">{item.desc}</p>
                <div className="mt-2 flex items-center gap-3 text-xs text-slate-500">
                  {item.publishDate && <span>{item.publishDate}</span>}
                  {item.authors && <span>· {item.authors}</span>}
                  {item.fileUrl && (
                    <span className="inline-flex items-center gap-1 text-emerald-600">
                      <FileText className="h-3 w-3" /> PDF
                    </span>
                  )}
                </div>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => openEdit(item)}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                  >
                    <Edit2 className="h-3 w-3" /> 수정
                  </button>
                  <button
                    onClick={() => remove(item.id)}
                    className="inline-flex items-center gap-1 rounded-lg border border-rose-100 px-3 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50"
                  >
                    <Trash2 className="h-3 w-3" /> 삭제
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
        <strong>안내:</strong> 포스터 이미지를 업로드하면 /research 페이지 목록의 썸네일로 사용됩니다.
        PDF를 업로드하면 다운로드 버튼이 활성화됩니다 (로그인 사용자만 다운로드 가능).
      </div>
    </div>
  );
}
