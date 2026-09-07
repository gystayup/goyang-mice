// components/story/StoryClient.tsx — 오더 #D05 [1]-B.
//
// GOYANG STORY — 매장 스토리 카드 (9/9 포럼 시연용).
//   · URL 쿼리 ?store=<매장명> 로 매장명 수신 (없으면 "고양")
//   · 사진 1장 업로드 → 미리보기 → "스토리 생성" → 30초 내 결과 카드
//   · 결과 카드: 사진 + 제목 + 본문 + 매장명 + "GOYANG STORY" 워터마크
//   · 모바일 360px 폭에서 깨지지 않음 (현장 휴대폰 전용)
//   · "이미지로 저장" — html2canvas 로 PNG 다운로드
//
// C83 화풍 변환 UI 는 시연 후 재검토 (오더 지시 "화풍/이미지 변환 전부 제외").

"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Download, Loader2, Upload } from "lucide-react";

type StoryResult = {
  success: boolean;
  store?: string;
  title?: string;
  body?: string;
  tags?: string[];
  error?: string;
};

export default function StoryClient() {
  const searchParams = useSearchParams();
  const storeFromQuery = (searchParams.get("store") ?? "").trim();
  const store = storeFromQuery || "고양";

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    store: string;
    title: string;
    body: string;
    tags: string[];
  } | null>(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  function handlePick(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    setError(null);
    setResult(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(f);
    setPreviewUrl(f ? URL.createObjectURL(f) : null);
    e.target.value = "";
  }

  async function handleGenerate() {
    if (!file) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("store", store);
      const res = await fetch("/api/story", { method: "POST", body: form });
      let json: StoryResult | null = null;
      try {
        json = (await res.json()) as StoryResult;
      } catch {
        throw new Error(`서버 응답 오류 (HTTP ${res.status})`);
      }
      if (!res.ok || !json?.success || !json.title || !json.body) {
        throw new Error(json?.error ?? `스토리 생성 실패 (HTTP ${res.status})`);
      }
      setResult({
        store: json.store ?? store,
        title: json.title,
        body: json.body,
        tags: Array.isArray(json.tags) ? json.tags : [],
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }

  async function handleDownload() {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      // 오더 [1]-B: html2canvas 로 카드 → PNG. 동적 import 로 초기 번들 감소.
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: "#ffffff",
        scale: 2,
        useCORS: true,
      });
      const dataUrl = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      const safe = (result?.store ?? "goyang-story").replace(/[^\w가-힣ㄱ-ㅎ]+/g, "-");
      a.href = dataUrl;
      a.download = `goyang-story-${safe}-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (e) {
      setError(e instanceof Error ? `저장 실패: ${e.message}` : String(e));
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-8 sm:py-12">
      <div className="flex items-baseline gap-2">
        <h1 className="text-xl font-black tracking-[-0.03em] text-[#232322] sm:text-2xl">
          GOYANG STORY
        </h1>
        <span className="rounded-full bg-[#e23e2e] px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.16em] text-white">
          BETA
        </span>
      </div>
      <p className="mt-2 text-sm text-slate-600">
        매장에서 찍은 사진 한 장으로 AI 스토리 카드를 만들어 봅니다.
      </p>

      <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700">
        매장: <span className="font-semibold text-[#232322]">{store}</span>
        {!storeFromQuery && (
          <span className="ml-1 text-slate-500">
            (URL 에 <code className="font-mono">?store=매장명</code> 을 추가하면 반영됩니다)
          </span>
        )}
      </div>

      {/* 컨트롤 영역 */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          hidden
          onChange={handlePick}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={loading}
          className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition hover:border-slate-950 disabled:opacity-50"
        >
          <Upload className="h-4 w-4" aria-hidden="true" />
          사진 선택
        </button>
        <button
          type="button"
          onClick={() => void handleGenerate()}
          disabled={!file || loading}
          className="inline-flex items-center gap-1.5 rounded-full bg-[#e23e2e] px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              생성 중… (최대 30초)
            </>
          ) : (
            "스토리 생성"
          )}
        </button>
      </div>
      {file && !loading && !result && (
        <p className="mt-2 text-[11px] text-slate-500">
          {file.name} · {(file.size / 1024 / 1024).toFixed(2)} MB
        </p>
      )}

      {error && (
        <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* 결과 카드 — 360px 폭 안전. html2canvas 캡처 대상. */}
      {result && previewUrl && (
        <>
          <div className="mt-6 flex justify-center">
            <div
              ref={cardRef}
              className="w-full max-w-[360px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              style={{ fontFamily: '"SUIT Variable", "Apple SD Gothic Neo", sans-serif' }}
            >
              <div className="relative aspect-[4/3] w-full bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl}
                  alt=""
                  className="h-full w-full object-cover"
                  crossOrigin="anonymous"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/50 to-transparent"
                />
                <span className="absolute right-3 top-3 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.16em] text-white">
                  GOYANG STORY
                </span>
              </div>
              <div className="p-4">
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#e23e2e]">
                  {result.store}
                </div>
                <h2 className="mt-1.5 text-lg font-black leading-tight tracking-[-0.02em] text-[#232322]">
                  {result.title}
                </h2>
                <p className="mt-2 whitespace-pre-line text-[13px] leading-relaxed text-slate-700">
                  {result.body}
                </p>
                {result.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {result.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
                <div className="mt-3 border-t border-slate-100 pt-2 text-[10px] text-slate-400">
                  고양 문화관광·MICE 연구소 · AI 생성 · 참고용
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-center">
            <button
              type="button"
              onClick={() => void handleDownload()}
              disabled={downloading}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#232322] px-5 py-2 text-sm font-bold text-[#232322] transition hover:border-[#e23e2e] hover:text-[#e23e2e] disabled:opacity-50"
            >
              {downloading ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <Download className="h-4 w-4" aria-hidden="true" />
              )}
              이미지로 저장
            </button>
          </div>
        </>
      )}

      <p className="mt-6 text-[10px] leading-relaxed text-slate-500">
        AI가 생성한 결과는 참고용입니다. 사실과 다를 수 있어 방문 전 재확인해 주세요.
      </p>
    </div>
  );
}
