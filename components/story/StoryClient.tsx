// components/story/StoryClient.tsx — 오더 #D06 [2].
//
// GOYANG STORY 통합 카드 (9/9 포럼 시연용).
//   · URL ?store=<매장명> (없으면 "고양")
//   · 사진 1장 upload → "스토리 만들기" 1버튼 → 텍스트+이미지 병렬 결과
//   · 통합 카드: 변환 이미지 (없으면 원본) + 제목 + 본문(매장명 포함) + tags + 워터마크
//   · 부분 실패: 어느 한 쪽 실패해도 다른 쪽은 표시. 실패 사유 배너.
//   · 모바일 360px 안전 · PNG 다운로드 (html2canvas 동적 import)

"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Download, Loader2, Upload } from "lucide-react";

type StoryPayload = { title: string; body: string; tags: string[] };
type ApiResp = {
  success?: boolean;
  store?: string;
  story?: StoryPayload | null;
  image?: string | null;
  storyError?: string | null;
  imageError?: string | null;
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
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    store: string;
    story: StoryPayload | null;
    imageUrl: string | null;
    storyError: string | null;
    imageError: string | null;
  } | null>(null);

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
      let json: ApiResp | null = null;
      try {
        json = (await res.json()) as ApiResp;
      } catch {
        throw new Error(`서버 응답 오류 (HTTP ${res.status})`);
      }
      // 전체 실패 (텍스트·이미지 둘 다 실패, 또는 상위 500)
      if (!json?.success) {
        throw new Error(json?.error ?? json?.storyError ?? json?.imageError ?? `생성 실패 (HTTP ${res.status})`);
      }
      setResult({
        store: json.store ?? store,
        story: json.story ?? null,
        imageUrl: json.image ?? null,
        storyError: json.storyError ?? null,
        imageError: json.imageError ?? null,
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

  const cardImage = result?.imageUrl ?? previewUrl;

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
        매장에서 찍은 사진 한 장으로 스케치 이미지와 AI 스토리를 함께 만들어 봅니다.
      </p>

      <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700">
        매장: <span className="font-semibold text-[#232322]">{store}</span>
        {!storeFromQuery && (
          <span className="ml-1 text-slate-500">
            (URL 에 <code className="font-mono">?store=매장명</code> 을 추가하면 반영됩니다)
          </span>
        )}
      </div>

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
              스토리 만드는 중… (최대 60초)
            </>
          ) : (
            "스토리 만들기"
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

      {result && (
        <>
          {/* 부분 실패 배너 (한 쪽만 실패한 경우) */}
          {result.imageError && result.story && (
            <div className="mt-4 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
              이미지 변환은 실패했습니다: {result.imageError} (원본 사진으로 대체 표시)
            </div>
          )}
          {result.storyError && result.imageUrl && (
            <div className="mt-4 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
              텍스트 스토리 생성은 실패했습니다: {result.storyError}
            </div>
          )}

          {/* 통합 결과 카드 — 360px 폭 안전. html2canvas 캡처 대상. */}
          <div className="mt-6 flex justify-center">
            <div
              ref={cardRef}
              className="w-full max-w-[360px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              style={{ fontFamily: '"SUIT Variable", "Apple SD Gothic Neo", sans-serif' }}
            >
              <div className="relative aspect-[4/3] w-full bg-slate-100">
                {cardImage ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={cardImage}
                      alt=""
                      className="h-full w-full object-cover"
                      crossOrigin="anonymous"
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/50 to-transparent"
                    />
                  </>
                ) : null}
                <span className="absolute right-3 top-3 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.16em] text-white">
                  GOYANG STORY
                </span>
              </div>
              <div className="p-4">
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#e23e2e]">
                  {result.store}
                </div>
                {result.story ? (
                  <>
                    <h2 className="mt-1.5 text-lg font-black leading-tight tracking-[-0.02em] text-[#232322]">
                      {result.story.title}
                    </h2>
                    <p className="mt-2 whitespace-pre-line text-[13px] leading-relaxed text-slate-700">
                      {result.story.body}
                    </p>
                    {result.story.tags.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {result.story.tags.map((t) => (
                          <span
                            key={t}
                            className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <p className="mt-2 text-[13px] leading-relaxed text-slate-500">
                    텍스트 스토리를 만들지 못했습니다.
                  </p>
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
        AI 생성 결과는 참고용입니다. 사실과 다를 수 있어 방문 전 재확인해 주세요.
      </p>
    </div>
  );
}
