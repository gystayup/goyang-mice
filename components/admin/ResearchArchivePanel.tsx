"use client";

import { useEffect, useState } from "react";
import { Edit2, Plus, Trash2, X } from "lucide-react";

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
};

type FormState = {
  id: string;
  issue: string;
  season: string;
  title: string;
  desc: string;
  gradient: string;
};

const emptyForm: FormState = {
  id: "",
  issue: "",
  season: "",
  title: "",
  desc: "",
  gradient: GRADIENT_PRESETS[0].value,
};

function parseItem(item: ArchiveItem): ParsedItem {
  let meta = { issue: "", season: "", gradient: GRADIENT_PRESETS[0].value };
  try {
    meta = JSON.parse(item.content) as typeof meta;
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
  };
}

export default function ResearchArchivePanel() {
  const [items, setItems] = useState<ParsedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

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

  useEffect(() => { void load(); }, []);

  function openNew() {
    setForm(emptyForm);
    setError("");
    setShowForm(true);
  }

  function openEdit(item: ParsedItem) {
    setForm({ id: item.id, issue: item.issue, season: item.season, title: item.title, desc: item.desc, gradient: item.gradient });
    setError("");
    setShowForm(true);
  }

  async function save() {
    if (!form.issue || !form.season || !form.title || !form.desc) {
      setError("모든 항목을 입력해주세요.");
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
          <div className="w-full max-w-lg rounded-[24px] bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold">{form.id ? "아카이브 수정" : "새 아카이브"}</h3>
              <button onClick={() => setShowForm(false)}><X className="h-5 w-5 text-slate-500" /></button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">권호 (예: VOL.05)</label>
                  <input
                    value={form.issue}
                    onChange={(e) => setForm((f) => ({ ...f, issue: e.target.value }))}
                    placeholder="VOL.05"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-slate-400"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">시즌 (예: 2026 SPRING)</label>
                  <input
                    value={form.season}
                    onChange={(e) => setForm((f) => ({ ...f, season: e.target.value }))}
                    placeholder="2026 SPRING"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">제목</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="연구 자료 제목"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-slate-400"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">설명</label>
                <textarea
                  value={form.desc}
                  onChange={(e) => setForm((f) => ({ ...f, desc: e.target.value }))}
                  rows={3}
                  placeholder="연구 자료에 대한 간략한 설명"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-slate-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">카드 색상</label>
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
                      <span
                        className="h-4 w-4 shrink-0 rounded-full"
                        style={{ background: g.value }}
                      />
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 미리보기 */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">미리보기</label>
                <div
                  className="flex h-32 w-24 items-end rounded-2xl p-3 text-white"
                  style={{ background: form.gradient }}
                >
                  <div>
                    <div className="text-[10px] font-semibold opacity-80">{form.season || "2026 SPRING"}</div>
                    <div className="text-base font-black">{form.issue || "VOL.00"}</div>
                    <div className="text-[10px] font-black leading-tight">RESEARCH<br />ARCHIVE</div>
                  </div>
                </div>
              </div>

              {error && <p className="text-sm text-rose-600">{error}</p>}

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
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <div key={item.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div
                className="flex h-28 flex-col justify-end p-4 text-white"
                style={{ background: item.gradient }}
              >
                <div className="text-[10px] font-semibold tracking-widest opacity-80">{item.season}</div>
                <div className="text-xl font-black">{item.issue}</div>
                <div className="text-[10px] font-black leading-tight">RESEARCH ARCHIVE</div>
              </div>
              <div className="p-4">
                <p className="text-sm font-bold text-slate-900 line-clamp-2">{item.title}</p>
                <p className="mt-1 text-xs text-slate-500 line-clamp-2">{item.desc}</p>
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

      <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 text-sm text-amber-800">
        <strong>안내:</strong> 여기서 추가/수정한 아카이브는 연구 분야 페이지에 즉시 반영됩니다.
        항목이 없으면 기본 샘플 데이터가 표시됩니다.
      </div>
    </div>
  );
}
