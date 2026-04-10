"use client";

import { useEffect, useState } from "react";
import { Download, ImagePlus, Trash2, Upload, Video } from "lucide-react";
import Image from "next/image";

type DmcHeroMediaType = "none" | "image" | "video";

interface DmcHeroMedia {
  mediaType: DmcHeroMediaType;
  src: string;
  fileName: string;
  mimeType: string;
  updatedAt: string | null;
}

const emptyMedia: DmcHeroMedia = {
  mediaType: "none",
  src: "",
  fileName: "",
  mimeType: "",
  updatedAt: null,
};

export default function DmcHeroMediaPanel() {
  const [media, setMedia] = useState<DmcHeroMedia>(emptyMedia);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadMedia() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/dmc-hero-media", {
        cache: "no-store",
      });
      const result = (await response.json()) as {
        success: boolean;
        data?: DmcHeroMedia;
        error?: string;
      };

      if (!response.ok || !result.success) {
        throw new Error(result.error || "DMC 미디어 정보를 불러오지 못했습니다.");
      }

      setMedia(result.data ?? emptyMedia);
    } catch (fetchError) {
      console.error(fetchError);
      setError(
        fetchError instanceof Error
          ? fetchError.message
          : "DMC 미디어 정보를 불러오지 못했습니다."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMedia();
  }, []);

  async function handleUpload() {
    if (!selectedFile) {
      setError("업로드할 파일을 먼저 선택해 주세요.");
      setMessage("");
      return;
    }

    setSubmitting(true);
    setError("");
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch("/api/admin/dmc-hero-media", {
        method: "POST",
        body: formData,
      });
      const result = (await response.json()) as {
        success: boolean;
        data?: DmcHeroMedia;
        message?: string;
        error?: string;
      };

      if (!response.ok || !result.success) {
        throw new Error(result.error || "DMC 미디어 업로드에 실패했습니다.");
      }

      setMedia(result.data ?? emptyMedia);
      setMessage(result.message || "DMC 상단 미디어가 업데이트되었습니다.");
      setSelectedFile(null);
    } catch (uploadError) {
      console.error(uploadError);
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "DMC 미디어 업로드에 실패했습니다."
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    setSubmitting(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/admin/dmc-hero-media", {
        method: "DELETE",
      });
      const result = (await response.json()) as {
        success: boolean;
        data?: DmcHeroMedia;
        message?: string;
        error?: string;
      };

      if (!response.ok || !result.success) {
        throw new Error(result.error || "DMC 미디어 삭제에 실패했습니다.");
      }

      setMedia(result.data ?? emptyMedia);
      setSelectedFile(null);
      setMessage(result.message || "DMC 상단 미디어를 삭제했습니다.");
    } catch (deleteError) {
      console.error(deleteError);
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "DMC 미디어 삭제에 실패했습니다."
      );
    } finally {
      setSubmitting(false);
    }
  }

  const selectedLabel = selectedFile
    ? `${selectedFile.name} (${Math.round(selectedFile.size / 1024)}KB)`
    : "선택된 파일이 없습니다.";

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="text-xs font-semibold tracking-[0.2em] text-[#ff7d66]">
            DMC HERO MEDIA
          </div>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">
            DMC 상단 사진·영상 관리
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
            여기에서 업로드한 이미지나 영상이 DMC 페이지 상단 우측 미디어 영역에
            바로 반영됩니다. 운영자는 교체, 삭제, 다운로드까지 한 곳에서 관리할 수
            있습니다.
          </p>
        </div>
        <button
          type="button"
          onClick={loadMedia}
          className="inline-flex items-center justify-center rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          새로고침
        </button>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-slate-950">
          <div className="relative flex min-h-[340px] items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(255,236,203,0.2),_rgba(15,23,42,0.98)_45%)] p-4">
            {loading ? (
              <div className="text-sm text-white/70">미디어 정보를 불러오는 중입니다...</div>
            ) : media.mediaType === "image" && media.src ? (
              <Image
                src={media.src}
                alt="DMC 상단 대표 이미지"
                fill
                className="rounded-[22px] object-cover"
              />
            ) : media.mediaType === "video" && media.src ? (
              <video
                src={media.src}
                controls
                playsInline
                className="h-full max-h-[420px] w-full rounded-[22px] object-cover"
              />
            ) : (
              <div className="flex max-w-sm flex-col items-center text-center text-white/75">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
                  <ImagePlus className="h-7 w-7" />
                </div>
                <div className="mt-4 text-xl font-semibold">
                  아직 등록된 DMC 상단 미디어가 없습니다
                </div>
                <p className="mt-3 text-sm leading-7 text-white/65">
                  관리자 페이지에서 이미지를 업로드하거나 영상을 등록하면 이 영역에
                  바로 반영됩니다.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
            <div className="text-sm font-semibold text-slate-900">현재 등록 상태</div>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <div className="flex items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3">
                <span>미디어 유형</span>
                <span className="font-semibold text-slate-900">
                  {media.mediaType === "image"
                    ? "이미지"
                    : media.mediaType === "video"
                      ? "영상"
                      : "미등록"}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3">
                <span>파일명</span>
                <span className="max-w-[12rem] truncate font-semibold text-slate-900">
                  {media.fileName || "-"}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3">
                <span>마지막 변경</span>
                <span className="font-semibold text-slate-900">
                  {media.updatedAt
                    ? new Date(media.updatedAt).toLocaleString("ko-KR")
                    : "-"}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-5">
            <div className="text-sm font-semibold text-slate-900">업로드</div>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              JPG, PNG, WEBP, GIF 이미지와 MP4, WEBM, MOV 영상 업로드를 지원합니다.
              최대 60MB까지 등록할 수 있습니다.
            </p>

            <label className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-[24px] border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center transition hover:border-slate-400 hover:bg-slate-100">
              <input
                type="file"
                accept="image/*,video/mp4,video/webm,video/quicktime"
                className="hidden"
                onChange={(event) => {
                  setSelectedFile(event.target.files?.[0] ?? null);
                  setError("");
                  setMessage("");
                }}
              />
              <Upload className="h-7 w-7 text-slate-600" />
              <div className="mt-3 text-sm font-semibold text-slate-900">
                파일 선택
              </div>
              <div className="mt-2 text-xs text-slate-500">{selectedLabel}</div>
            </label>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleUpload}
                disabled={submitting}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {selectedFile?.type.startsWith("video/") ? (
                  <Video className="h-4 w-4" />
                ) : (
                  <ImagePlus className="h-4 w-4" />
                )}
                {submitting ? "업로드 중..." : "업로드 반영"}
              </button>

              {media.src ? (
                <>
                  <a
                    href={media.src}
                    download={media.fileName || undefined}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    <Download className="h-4 w-4" />
                    현재 파일 다운로드
                  </a>

                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={submitting}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-5 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Trash2 className="h-4 w-4" />
                    현재 파일 삭제
                  </button>
                </>
              ) : null}
            </div>

            {message ? (
              <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {message}
              </div>
            ) : null}

            {error ? (
              <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {error}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
