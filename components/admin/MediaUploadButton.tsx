"use client";

import Image from "next/image";
import { Loader2, Trash2, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface UploadedFile {
  filename: string;
  url: string;
  size: number;
  createdAt: string;
}

interface Props {
  category?: string;
  onUpload?: (url: string) => void;
  label?: string;
  showLibrary?: boolean;
}

export default function MediaUploadButton({
  category = "general",
  onUpload,
  label = "미디어 업로드",
  showLibrary = true,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const loadFiles = async () => {
    try {
      const res = await fetch(`/api/admin/upload?category=${category}`);
      const json = await res.json();
      if (json.success) setFiles(json.data);
    } catch {
      // silent
    }
  };

  useEffect(() => {
    if (showLibrary) loadFiles();
  }, [category, showLibrary]);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("category", category);
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const json = await res.json();
      if (json.success) {
        onUpload?.(json.url);
        if (showLibrary) loadFiles();
      } else {
        setError(json.error ?? "업로드 실패");
      }
    } catch {
      setError("업로드 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleDelete = async (filename: string) => {
    if (!confirm("이 파일을 삭제하시겠습니까?")) return;
    try {
      await fetch("/api/admin/upload", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename, category }),
      });
      loadFiles();
    } catch {
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  const isVideo = (url: string) =>
    /\.(mp4|webm|mov)$/i.test(url);

  const formatSize = (bytes: number) =>
    bytes < 1024 * 1024
      ? `${(bytes / 1024).toFixed(0)}KB`
      : `${(bytes / 1024 / 1024).toFixed(1)}MB`;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime"
          className="hidden"
          onChange={handleChange}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Upload className="h-4 w-4" />
          )}
          {label}
        </button>
        <span className="text-xs text-slate-400">JPG · PNG · WEBP · GIF · MP4 · WEBM · MOV · 최대 60MB</span>
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {showLibrary && files.length > 0 && (
        <div className="rounded-[20px] border border-slate-200 bg-slate-50 p-4">
          <div className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            업로드된 파일 ({files.length})
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {files.map((f) => (
              <div
                key={f.filename}
                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                {isVideo(f.url) ? (
                  <video
                    src={f.url}
                    className="aspect-square w-full object-cover"
                    muted
                  />
                ) : (
                  <div className="relative aspect-square w-full">
                    <Image
                      src={f.url}
                      alt={f.filename}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      unoptimized={f.url.startsWith("/uploads/")}
                    />
                  </div>
                )}
                <div className="p-2">
                  <p className="truncate text-[11px] font-medium text-slate-600">{f.filename}</p>
                  <p className="text-[10px] text-slate-400">{formatSize(f.size)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(f.filename)}
                  className="absolute right-2 top-2 hidden h-7 w-7 items-center justify-center rounded-full bg-white/90 text-red-500 shadow group-hover:flex"
                  title="삭제"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
                {onUpload && (
                  <button
                    type="button"
                    onClick={() => onUpload(f.url)}
                    className="absolute bottom-8 left-0 right-0 hidden bg-slate-950/80 py-1 text-center text-[11px] font-semibold text-white group-hover:block"
                  >
                    선택
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
