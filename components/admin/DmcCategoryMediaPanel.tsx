"use client";

import { useEffect, useState } from "react";
import { Download, ImagePlus, Trash2, Upload } from "lucide-react";
import Image from "next/image";

type DmcCategoryMediaKey =
  | "tour"
  | "stay"
  | "restaurant"
  | "cafe"
  | "ticket"
  | "airport";

interface DmcCategoryMediaItem {
  key: DmcCategoryMediaKey;
  label: string;
  src: string;
  fileName: string;
  mimeType: string;
  updatedAt: string | null;
}

type DmcCategoryMediaMap = Record<DmcCategoryMediaKey, DmcCategoryMediaItem>;

const categoryOrder: Array<{ key: DmcCategoryMediaKey; label: string }> = [
  { key: "tour", label: "여행상품 예약" },
  { key: "stay", label: "숙박 예약" },
  { key: "restaurant", label: "음식점 예약" },
  { key: "cafe", label: "카페 예약" },
  { key: "ticket", label: "티켓 예약" },
  { key: "airport", label: "공항픽업 예약" },
];

const emptyMap = Object.fromEntries(
  categoryOrder.map((item) => [
    item.key,
    {
      key: item.key,
      label: item.label,
      src: "",
      fileName: "",
      mimeType: "",
      updatedAt: null,
    },
  ])
) as DmcCategoryMediaMap;

export default function DmcCategoryMediaPanel() {
  const [mediaMap, setMediaMap] = useState<DmcCategoryMediaMap>(emptyMap);
  const [selectedFiles, setSelectedFiles] = useState<
    Partial<Record<DmcCategoryMediaKey, File | null>>
  >({});
  const [loading, setLoading] = useState(true);
  const [submittingKey, setSubmittingKey] = useState<DmcCategoryMediaKey | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadMedia() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/dmc-category-media", {
        cache: "no-store",
      });
      const result = (await response.json()) as {
        success: boolean;
        data?: DmcCategoryMediaMap;
        error?: string;
      };

      if (!response.ok || !result.success) {
        throw new Error(result.error || "카테고리 이미지 정보를 불러오지 못했습니다.");
      }

      setMediaMap(result.data ?? emptyMap);
    } catch (fetchError) {
      console.error(fetchError);
      setError(
        fetchError instanceof Error
          ? fetchError.message
          : "카테고리 이미지 정보를 불러오지 못했습니다."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMedia();
  }, []);

  async function handleUpload(categoryKey: DmcCategoryMediaKey) {
    const file = selectedFiles[categoryKey];

    if (!file) {
      setError("업로드할 이미지를 먼저 선택해 주세요.");
      setMessage("");
      return;
    }

    setSubmittingKey(categoryKey);
    setError("");
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("categoryKey", categoryKey);
      formData.append("file", file);

      const response = await fetch("/api/admin/dmc-category-media", {
        method: "POST",
        body: formData,
      });
      const result = (await response.json()) as {
        success: boolean;
        data?: DmcCategoryMediaMap;
        message?: string;
        error?: string;
      };

      if (!response.ok || !result.success) {
        throw new Error(result.error || "카테고리 이미지 업로드에 실패했습니다.");
      }

      setMediaMap(result.data ?? emptyMap);
      setSelectedFiles((current) => ({ ...current, [categoryKey]: null }));
      setMessage(result.message || "카테고리 대표 이미지가 업데이트되었습니다.");
    } catch (uploadError) {
      console.error(uploadError);
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "카테고리 이미지 업로드에 실패했습니다."
      );
    } finally {
      setSubmittingKey(null);
    }
  }

  async function handleDelete(categoryKey: DmcCategoryMediaKey) {
    setSubmittingKey(categoryKey);
    setError("");
    setMessage("");

    try {
      const response = await fetch(
        `/api/admin/dmc-category-media?categoryKey=${categoryKey}`,
        {
          method: "DELETE",
        }
      );
      const result = (await response.json()) as {
        success: boolean;
        data?: DmcCategoryMediaMap;
        message?: string;
        error?: string;
      };

      if (!response.ok || !result.success) {
        throw new Error(result.error || "카테고리 이미지 삭제에 실패했습니다.");
      }

      setMediaMap(result.data ?? emptyMap);
      setSelectedFiles((current) => ({ ...current, [categoryKey]: null }));
      setMessage(result.message || "카테고리 대표 이미지를 삭제했습니다.");
    } catch (deleteError) {
      console.error(deleteError);
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "카테고리 이미지 삭제에 실패했습니다."
      );
    } finally {
      setSubmittingKey(null);
    }
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="text-xs font-semibold tracking-[0.2em] text-[#ff7d66]">
            DMC CATEGORY IMAGES
          </div>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">
            DMC 예약 카테고리 카드 이미지 관리
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
            여행상품, 숙박, 음식점, 카페, 티켓, 공항픽업 카드 상단 이미지를 카테고리별로
            따로 업로드할 수 있습니다. 이미지를 등록하면 DMC 페이지 카드 상단 그라데이션
            영역 대신 실제 사진이 노출됩니다.
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

      {message ? (
        <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {message}
        </div>
      ) : null}

      {error ? (
        <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {categoryOrder.map((category) => {
          const item = mediaMap[category.key];
          const selectedFile = selectedFiles[category.key];
          const isSubmitting = submittingKey === category.key;

          return (
            <div
              key={category.key}
              className="overflow-hidden rounded-[28px] border border-slate-200 bg-slate-50"
            >
              <div className="relative h-52 overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(255,234,199,0.7),_rgba(226,232,240,1)_58%,_rgba(241,245,249,1)_100%)]">
                {loading ? (
                  <div className="flex h-full items-center justify-center text-sm text-slate-500">
                    불러오는 중...
                  </div>
                ) : item?.src ? (
                  <Image
                    src={item.src}
                    alt={`${category.label} 대표 이미지`}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center text-center text-slate-500">
                    <ImagePlus className="h-7 w-7" />
                    <div className="mt-3 text-sm font-medium">
                      아직 등록된 이미지가 없습니다
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4 p-5">
                <div>
                  <div className="text-lg font-semibold text-slate-900">{category.label}</div>
                  <div className="mt-1 text-xs text-slate-500">
                    {item?.updatedAt
                      ? `마지막 변경: ${new Date(item.updatedAt).toLocaleString("ko-KR")}`
                      : "아직 등록되지 않았습니다."}
                  </div>
                </div>

                <label className="flex cursor-pointer flex-col items-center justify-center rounded-[22px] border border-dashed border-slate-300 bg-white px-4 py-6 text-center transition hover:border-slate-400 hover:bg-slate-50">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="hidden"
                    onChange={(event) =>
                      setSelectedFiles((current) => ({
                        ...current,
                        [category.key]: event.target.files?.[0] ?? null,
                      }))
                    }
                  />
                  <Upload className="h-6 w-6 text-slate-600" />
                  <div className="mt-2 text-sm font-semibold text-slate-900">
                    이미지 선택
                  </div>
                  <div className="mt-1 text-xs text-slate-500">
                    {selectedFile ? selectedFile.name : "JPG, PNG, WEBP, GIF / 최대 20MB"}
                  </div>
                </label>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleUpload(category.key)}
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
                  >
                    <ImagePlus className="h-4 w-4" />
                    {isSubmitting ? "업로드 중..." : "업로드"}
                  </button>

                  {item?.src ? (
                    <>
                      <a
                        href={item.src}
                        download={item.fileName || undefined}
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                      >
                        <Download className="h-4 w-4" />
                        다운로드
                      </a>

                      <button
                        type="button"
                        onClick={() => handleDelete(category.key)}
                        disabled={isSubmitting}
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <Trash2 className="h-4 w-4" />
                        삭제
                      </button>
                    </>
                  ) : null}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
