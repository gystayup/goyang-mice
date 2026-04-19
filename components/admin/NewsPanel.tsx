"use client";

import { useEffect, useState } from "react";
import {
  Edit2,
  Loader2,
  Mail,
  Plus,
  Send,
  Trash2,
  Upload,
  X,
} from "lucide-react";

import {
  NEWS_CATEGORY_LABELS,
  type NewsArticle,
  type NewsCategory,
  type NewsStatus,
} from "@/lib/news-types";

const CATEGORIES: NewsCategory[] = ["notice", "press", "event", "research"];

type EditorState = {
  id: string | null; // null = 신규
  title: string;
  subtitle: string;
  body: string;
  category: NewsCategory;
  status: NewsStatus;
  tags: string;
  coverImageUrl: string;
  coverImageFileName: string;
};

const EMPTY_EDITOR: EditorState = {
  id: null,
  title: "",
  subtitle: "",
  body: "",
  category: "notice",
  status: "DRAFT",
  tags: "",
  coverImageUrl: "",
  coverImageFileName: "",
};

export default function NewsPanel() {
  const [items, setItems] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [editor, setEditor] = useState<EditorState | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [sendingId, setSendingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/news", { cache: "no-store" });
      const json = await res.json();
      if (json.success) setItems(json.data || []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function startNew() {
    setEditor({ ...EMPTY_EDITOR });
    setMessage(null);
    setError(null);
  }

  function startEdit(item: NewsArticle) {
    setEditor({
      id: item.id,
      title: item.title,
      subtitle: item.subtitle || "",
      body: item.body,
      category: item.category,
      status: item.status,
      tags: (item.tags || []).join(", "),
      coverImageUrl: item.coverImageUrl || "",
      coverImageFileName: item.coverImageFileName || "",
    });
    setMessage(null);
    setError(null);
  }

  async function handleUpload(file: File) {
    if (!editor) return;
    setUploading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/news/upload", {
        method: "POST",
        body: fd,
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "업로드 실패");
      setEditor({
        ...editor,
        coverImageUrl: json.data.url,
        coverImageFileName: json.data.fileName,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setUploading(false);
    }
  }

  async function handleSave() {
    if (!editor) return;
    if (!editor.title.trim()) {
      setError("제목을 입력해 주세요.");
      return;
    }
    if (!editor.body.trim()) {
      setError("본문을 입력해 주세요.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const payload = {
        title: editor.title.trim(),
        subtitle: editor.subtitle.trim() || undefined,
        body: editor.body,
        category: editor.category,
        status: editor.status,
        tags: editor.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        coverImageUrl: editor.coverImageUrl || undefined,
        coverImageFileName: editor.coverImageFileName || undefined,
      };
      const url = editor.id ? `/api/admin/news/${editor.id}` : "/api/admin/news";
      const method = editor.id ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "저장 실패");
      setMessage(editor.id ? "기사가 수정되었습니다." : "기사가 작성되었습니다.");
      setEditor(null);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("이 기사를 삭제할까요? 되돌릴 수 없습니다.")) return;
    try {
      const res = await fetch(`/api/admin/news/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "삭제 실패");
      setMessage("기사가 삭제되었습니다.");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  async function handleSend(item: NewsArticle) {
    if (item.status !== "PUBLISHED") {
      alert("공개(PUBLISHED) 상태의 기사만 발송할 수 있습니다.");
      return;
    }
    if (
      !confirm(
        `"${item.title}"을(를) 뉴스레터 구독자에게 발송할까요?\n(마케팅 수신동의 방문자에게만 발송됩니다)`
      )
    )
      return;
    setSendingId(item.id);
    setMessage(null);
    setError(null);
    try {
      const res = await fetch(`/api/admin/news/${item.id}/send`, {
        method: "POST",
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "발송 실패");
      setMessage(
        `발송 완료 — 대상 ${json.data.total}명 / 성공 ${json.data.sent} / 실패 ${json.data.failed}`
      );
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setSendingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">연구소 소식 / 공지</h2>
          <p className="mt-1 text-sm text-slate-600">
            기사를 등록하고, 마케팅 수신 동의한 방문자에게 뉴스레터를 발송할 수 있습니다.
          </p>
        </div>
        {!editor && (
          <button
            type="button"
            onClick={startNew}
            className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            <Plus size={16} /> 새 기사 작성
          </button>
        )}
      </div>

      {message && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {message}
        </div>
      )}
      {error && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      {editor && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">
              {editor.id ? "기사 수정" : "새 기사 작성"}
            </h3>
            <button
              type="button"
              onClick={() => setEditor(null)}
              className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            >
              <X size={18} />
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="mb-1 block font-medium text-slate-700">카테고리</span>
              <select
                value={editor.category}
                onChange={(e) =>
                  setEditor({ ...editor, category: e.target.value as NewsCategory })
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {NEWS_CATEGORY_LABELS[c]}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-sm">
              <span className="mb-1 block font-medium text-slate-700">상태</span>
              <select
                value={editor.status}
                onChange={(e) =>
                  setEditor({ ...editor, status: e.target.value as NewsStatus })
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              >
                <option value="DRAFT">임시저장(DRAFT)</option>
                <option value="PUBLISHED">공개(PUBLISHED)</option>
              </select>
            </label>
          </div>

          <label className="mt-4 block text-sm">
            <span className="mb-1 block font-medium text-slate-700">제목 *</span>
            <input
              type="text"
              value={editor.title}
              onChange={(e) => setEditor({ ...editor, title: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              placeholder="기사 제목"
            />
          </label>

          <label className="mt-4 block text-sm">
            <span className="mb-1 block font-medium text-slate-700">부제목</span>
            <input
              type="text"
              value={editor.subtitle}
              onChange={(e) => setEditor({ ...editor, subtitle: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              placeholder="선택 입력"
            />
          </label>

          <label className="mt-4 block text-sm">
            <span className="mb-1 block font-medium text-slate-700">본문 *</span>
            <textarea
              value={editor.body}
              onChange={(e) => setEditor({ ...editor, body: e.target.value })}
              rows={12}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm"
              placeholder="본문을 입력하세요. 빈 줄을 넣으면 문단이 구분됩니다."
            />
          </label>

          <label className="mt-4 block text-sm">
            <span className="mb-1 block font-medium text-slate-700">태그 (콤마로 구분)</span>
            <input
              type="text"
              value={editor.tags}
              onChange={(e) => setEditor({ ...editor, tags: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              placeholder="예: 공지, MICE, 2026"
            />
          </label>

          <div className="mt-4">
            <span className="mb-1 block text-sm font-medium text-slate-700">커버 이미지</span>
            {editor.coverImageUrl ? (
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={editor.coverImageUrl}
                  alt=""
                  className="h-24 w-40 rounded-lg border border-slate-200 object-cover"
                />
                <div className="text-sm text-slate-600">
                  <div className="font-medium">{editor.coverImageFileName || "첨부됨"}</div>
                  <button
                    type="button"
                    onClick={() =>
                      setEditor({ ...editor, coverImageUrl: "", coverImageFileName: "" })
                    }
                    className="mt-1 text-xs text-rose-600 hover:underline"
                  >
                    제거
                  </button>
                </div>
              </div>
            ) : (
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100">
                {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                <span>{uploading ? "업로드 중..." : "이미지 업로드"}</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleUpload(f);
                  }}
                />
              </label>
            )}
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setEditor(null)}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              취소
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : null}
              {editor.id ? "수정 저장" : "작성 완료"}
            </button>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h3 className="text-base font-semibold text-slate-900">
            전체 기사 <span className="ml-2 text-sm text-slate-500">{items.length}건</span>
          </h3>
        </div>
        {loading ? (
          <div className="flex items-center justify-center p-10 text-slate-500">
            <Loader2 size={18} className="mr-2 animate-spin" /> 불러오는 중...
          </div>
        ) : items.length === 0 ? (
          <div className="p-10 text-center text-sm text-slate-500">
            등록된 기사가 없습니다. &ldquo;새 기사 작성&rdquo; 버튼으로 시작해 보세요.
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {items
              .slice()
              .sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1))
              .map((it) => (
                <li
                  key={it.id}
                  className="flex items-start gap-4 px-6 py-4 hover:bg-slate-50"
                >
                  {it.coverImageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={it.coverImageUrl}
                      alt=""
                      className="h-16 w-24 flex-shrink-0 rounded-md border border-slate-200 object-cover"
                    />
                  ) : (
                    <div className="flex h-16 w-24 flex-shrink-0 items-center justify-center rounded-md bg-slate-100 text-xs text-slate-400">
                      이미지 없음
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                          it.status === "PUBLISHED"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {it.status === "PUBLISHED" ? "공개" : "임시"}
                      </span>
                      <span className="text-xs text-slate-500">
                        {NEWS_CATEGORY_LABELS[it.category]}
                      </span>
                      {it.emailSentAt && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-sky-100 px-2 py-0.5 text-[10px] font-medium text-sky-700">
                          <Mail size={10} /> 발송 {it.emailRecipientCount ?? 0}명
                        </span>
                      )}
                    </div>
                    <div className="mt-1 truncate text-sm font-semibold text-slate-900">
                      {it.title}
                    </div>
                    {it.subtitle && (
                      <div className="truncate text-xs text-slate-500">{it.subtitle}</div>
                    )}
                    <div className="mt-1 text-[11px] text-slate-400">
                      {new Date(it.createdAt).toLocaleString("ko-KR")}
                    </div>
                  </div>
                  <div className="flex flex-shrink-0 items-center gap-1">
                    {it.status === "PUBLISHED" && (
                      <button
                        type="button"
                        onClick={() => handleSend(it)}
                        disabled={sendingId === it.id}
                        title="뉴스레터 발송"
                        className="inline-flex items-center gap-1 rounded-md bg-sky-600 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-sky-700 disabled:opacity-50"
                      >
                        {sendingId === it.id ? (
                          <Loader2 size={12} className="animate-spin" />
                        ) : (
                          <Send size={12} />
                        )}
                        발송
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => startEdit(it)}
                      title="수정"
                      className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(it.id)}
                      title="삭제"
                      className="rounded-md p-1.5 text-rose-500 hover:bg-rose-50"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  );
}
