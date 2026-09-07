// components/story/StoryClient.tsx — 오더 #C83 [1]-B.
//
// "나의 고양 스토리 (베타)" 최소 UI:
//   · 사진 1장 업로드 (input file, image/*)
//   · "스케치로 변환" 버튼 → POST /api/story (formData: file+style=sketch)
//   · 변환 중 로딩 · 실패 시 에러 배너
//   · 성공 시 원본 + 변환 결과를 카드 2열로 나란히 표시
//
// 결과 이미지는 서버가 data URL (base64) 로 반환 → next/image 대신 <img> 사용
// (data URL 은 최적화 대상 아님, next.config.ts remotePatterns 무관).

"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, Upload } from "lucide-react";

type Locale = "ko" | "en" | "ja" | "zh-CN" | "zh-TW";

type Copy = {
  heading: string;
  beta: string;
  intro: string;
  pickButton: string;
  convertButton: string;
  converting: string;
  originalLabel: string;
  resultLabel: string;
  disclaimer: string;
};

const COPIES: Record<Locale, Copy> = {
  ko: {
    heading: "나의 고양 스토리",
    beta: "BETA",
    intro:
      "고양에서 찍은 사진을 스케치 화풍으로 바꿔봅니다. 사진 1장을 골라 '스케치로 변환' 을 눌러주세요.",
    pickButton: "사진 선택",
    convertButton: "스케치로 변환",
    converting: "변환 중…",
    originalLabel: "원본",
    resultLabel: "스케치",
    disclaimer:
      "AI 화풍 변환 결과는 원본과 다를 수 있습니다. 개인적인 사용·미리보기 용도로 제공됩니다.",
  },
  en: {
    heading: "My Goyang Story",
    beta: "BETA",
    intro:
      "Transform a photo taken in Goyang into a hand-drawn sketch style. Pick a photo and click 'Convert to sketch'.",
    pickButton: "Select photo",
    convertButton: "Convert to sketch",
    converting: "Converting…",
    originalLabel: "Original",
    resultLabel: "Sketch",
    disclaimer:
      "AI-style outputs may differ from the original. For personal preview only.",
  },
  ja: {
    heading: "私の高陽ストーリー",
    beta: "BETA",
    intro:
      "高陽で撮った写真を鉛筆スケッチ風に変換します。写真を1枚選び「スケッチに変換」を押してください。",
    pickButton: "写真を選択",
    convertButton: "スケッチに変換",
    converting: "変換中…",
    originalLabel: "オリジナル",
    resultLabel: "スケッチ",
    disclaimer:
      "AIによる画風変換の結果は原本と異なることがあります。個人プレビュー用途です。",
  },
  "zh-CN": {
    heading: "我的高阳故事",
    beta: "BETA",
    intro:
      "将您在高阳拍摄的照片转换为手绘素描风格。选择一张照片并点击「转换为素描」。",
    pickButton: "选择照片",
    convertButton: "转换为素描",
    converting: "转换中…",
    originalLabel: "原图",
    resultLabel: "素描",
    disclaimer: "AI 风格转换结果可能与原图不同，仅供个人预览。",
  },
  "zh-TW": {
    heading: "我的高陽故事",
    beta: "BETA",
    intro:
      "將您在高陽拍攝的照片轉換為手繪素描風格。選擇一張照片並點擊「轉換為素描」。",
    pickButton: "選擇照片",
    convertButton: "轉換為素描",
    converting: "轉換中…",
    originalLabel: "原圖",
    resultLabel: "素描",
    disclaimer: "AI 風格轉換結果可能與原圖不同，僅供個人預覽。",
  },
};

export default function StoryClient({ locale = "ko" }: { locale?: Locale }) {
  const copy = COPIES[locale] ?? COPIES.ko;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // preview 정리 (메모리 누수 방지)
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  function handlePick(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    setError(null);
    setResultUrl(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(f);
    setPreviewUrl(f ? URL.createObjectURL(f) : null);
    e.target.value = "";
  }

  async function handleConvert() {
    if (!file) return;
    setLoading(true);
    setError(null);
    setResultUrl(null);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("style", "sketch");
      const res = await fetch("/api/story", { method: "POST", body: form });
      type StoryResponse = { success?: boolean; image?: string; error?: string };
      let json: StoryResponse | null = null;
      try {
        json = (await res.json()) as StoryResponse;
      } catch {
        throw new Error(`서버 응답 오류 (HTTP ${res.status})`);
      }
      if (!res.ok || !json?.success || !json.image) {
        throw new Error(json?.error ?? `변환 실패 (HTTP ${res.status})`);
      }
      setResultUrl(json.image);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="flex items-baseline gap-2">
        <h1 className="text-2xl font-black tracking-[-0.03em] text-[#232322] sm:text-3xl">
          {copy.heading}
        </h1>
        <span className="rounded-full bg-[#e23e2e] px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.16em] text-white">
          {copy.beta}
        </span>
      </div>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
        {copy.intro}
      </p>

      <div className="mt-8 flex flex-wrap items-center gap-3">
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
          className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 transition hover:border-slate-950 disabled:opacity-50"
        >
          <Upload className="h-4 w-4" aria-hidden="true" />
          {copy.pickButton}
        </button>
        <button
          type="button"
          onClick={() => void handleConvert()}
          disabled={!file || loading}
          className="inline-flex items-center gap-2 rounded-full bg-[#e23e2e] px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              {copy.converting}
            </>
          ) : (
            copy.convertButton
          )}
        </button>
        {file && (
          <span className="text-xs text-slate-500">
            {file.name} · {(file.size / 1024 / 1024).toFixed(2)} MB
          </span>
        )}
      </div>

      {error && (
        <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      {(previewUrl || resultUrl) && (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {previewUrl && (
            <figure className="overflow-hidden rounded-[16px] border border-slate-200 bg-white">
              <div className="relative aspect-[4/3] w-full bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>
              <figcaption className="px-4 py-2 text-xs font-semibold text-slate-600">
                {copy.originalLabel}
              </figcaption>
            </figure>
          )}
          {resultUrl && (
            <figure className="overflow-hidden rounded-[16px] border border-slate-200 bg-white">
              <div className="relative aspect-[4/3] w-full bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={resultUrl}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>
              <figcaption className="px-4 py-2 text-xs font-semibold text-slate-600">
                {copy.resultLabel}
              </figcaption>
            </figure>
          )}
        </div>
      )}

      <p className="mt-8 text-[11px] leading-relaxed text-slate-500">
        {copy.disclaimer}
      </p>
    </div>
  );
}
