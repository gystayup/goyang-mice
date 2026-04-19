"use client";

import { useEffect, useState } from "react";
import { Download, ImagePlus, Plus, Trash2, Upload } from "lucide-react";
import Image from "next/image";

import { dmcCategoryMediaDefinitions } from "@/lib/dmc-category-media";

// 공유 정의에서 파생 — lib 에 카테고리를 추가하면 패널이 자동 반영
type DmcCategoryMediaKey = (typeof dmcCategoryMediaDefinitions)[number]["key"];

interface DmcCategoryMediaItem {
  key: string;
  label: string;
  src: string;
  fileName: string;
  mimeType: string;
  updatedAt: string | null;
}

type DmcCategoryMediaMap = Record<string, DmcCategoryMediaItem>;

interface DmcCustomCategory {
  slug: string;
  label: string;
  src: string;
  fileName: string;
  mimeType: string;
  updatedAt: string | null;
}

const categoryOrder: Array<{ key: DmcCategoryMediaKey; label: string }> =
  dmcCategoryMediaDefinitions.map((d) => ({ key: d.key, label: d.label }));

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
    Record<string, File | null>
  >({});
  const [loading, setLoading] = useState(true);
  const [submittingKey, setSubmittingKey] = useState<string | null>(null);

  // 사용자 정의 카테고리 상태
  const [customCategories, setCustomCategories] = useState<DmcCustomCategory[]>([]);
  const [customLoading, setCustomLoading] = useState(true);
  const [customLabel, setCustomLabel] = useState("");
  const [customFile, setCustomFile] = useState<File | null>(null);
  const [addingCustom, setAddingCustom] = useState(false);
  const [editingCustomSlug, setEditingCustomSlug] = useState<string | null>(null);
  const [customEditFile, setCustomEditFile] = useState<File | null>(null);
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

  async function loadCustomCategories() {
    setCustomLoading(true);
    try {
      const res = await fetch("/api/admin/dmc-custom-categories", { cache: "no-store" });
      const json = (await res.json()) as { success: boolean; data?: DmcCustomCategory[]; error?: string };
      if (!res.ok || !json.success) throw new Error(json.error || "사용자 정의 카테고리 로드 실패");
      setCustomCategories(json.data ?? []);
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : "사용자 정의 카테고리 로드 실패");
    } finally {
      setCustomLoading(false);
    }
  }

  useEffect(() => {
    loadMedia();
    loadCustomCategories();
  }, []);

  async function handleAddCustom() {
    const label = customLabel.trim();
    if (!label) {
      setError("카테고리 이름을 입력해 주세요.");
      return;
    }
    setAddingCustom(true);
    setError("");
    setMessage("");
    try {
      const fd = new FormData();
      fd.append("label", label);
      if (customFile) fd.append("file", customFile);
      const res = await fetch("/api/admin/dmc-custom-categories", { method: "POST", body: fd });
      const json = (await res.json()) as { success: boolean; data?: DmcCustomCategory[]; message?: string; error?: string };
      if (!res.ok || !json.success) throw new Error(json.error || "카테고리 추가 실패");
      setCustomCategories(json.data ?? []);
      setCustomLabel("");
      setCustomFile(null);
      setMessage(json.message || "카테고리가 추가되었습니다.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "카테고리 추가 실패");
    } finally {
      setAddingCustom(false);
    }
  }

  async function handleUpdateCustomImage(slug: string) {
    if (!customEditFile) {
      setError("이미지를 선택해 주세요.");
      return;
    }
    setSubmittingKey(slug);
    setError("");
    setMessage("");
    try {
      const fd = new FormData();
      fd.append("slug", slug);
      fd.append("file", customEditFile);
      const res = await fetch("/api/admin/dmc-custom-categories", { method: "PATCH", body: fd });
      const json = (await res.json()) as { success: boolean; data?: DmcCustomCategory[]; message?: string; error?: string };
      if (!res.ok || !json.success) throw new Error(json.error || "이미지 변경 실패");
      setCustomCategories(json.data ?? []);
      setCustomEditFile(null);
      setEditingCustomSlug(null);
      setMessage(json.message || "이미지가 변경되었습니다.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "이미지 변경 실패");
    } finally {
      setSubmittingKey(null);
    }
  }

  async function handleDeleteCustom(slug: string) {
    if (!confirm("이 카테고리를 삭제하시겠습니까?")) return;
    setSubmittingKey(slug);
    setError("");
    setMessage("");
    try {
      const res = await fetch(`/api/admin/dmc-custom-categories?slug=${encodeURIComponent(slug)}`, { method: "DELETE" });
      const json = (await res.json()) as { success: boolean; data?: DmcCustomCategory[]; message?: string; error?: string };
      if (!res.ok || !json.success) throw new Error(json.error || "삭제 실패");
      setCustomCategories(json.data ?? []);
      setMessage(json.message || "카테고리가 삭제되었습니다.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "삭제 실패");
    } finally {
      setSubmittingKey(null);
    }
  }

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

      {/* ── 사용자 정의 카테고리 ────────────────────────────────── */}
      <div className="mt-12 border-t border-slate-200 pt-8">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="text-xs font-semibold tracking-[0.2em] text-[#ff7d66]">
              CUSTOM CATEGORIES
            </div>
            <h3 className="mt-2 text-xl font-semibold text-slate-900">
              사용자 정의 카테고리 추가
            </h3>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
              위에 없는 신규 카테고리를 자유롭게 추가할 수 있습니다. 이름과 이미지를 입력하면
              DMC 페이지 카테고리 섹션에 자동으로 카드가 노출됩니다.
            </p>
          </div>
          <button
            type="button"
            onClick={loadCustomCategories}
            className="inline-flex items-center justify-center rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            새로고침
          </button>
        </div>

        {/* 추가 입력 폼 */}
        <div className="mt-6 rounded-[24px] border border-dashed border-slate-300 bg-slate-50/70 p-5">
          <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end">
            <div>
              <label className="mb-2 block text-xs font-semibold text-slate-600">
                카테고리 이름 *
              </label>
              <input
                type="text"
                value={customLabel}
                onChange={(e) => setCustomLabel(e.target.value)}
                placeholder="예) 웰니스 예약, 쇼핑 투어"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 focus:border-slate-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-2 block text-xs font-semibold text-slate-600">
                대표 이미지 (선택)
              </label>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={(e) => setCustomFile(e.target.files?.[0] ?? null)}
                className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-full file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-white hover:file:bg-slate-700"
              />
            </div>
            <button
              type="button"
              onClick={handleAddCustom}
              disabled={addingCustom || !customLabel.trim()}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#ff7d66] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#f16a52] disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              <Plus className="h-4 w-4" />
              {addingCustom ? "추가 중..." : "카테고리 추가"}
            </button>
          </div>
        </div>

        {/* 사용자 정의 카테고리 리스트 */}
        <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {customLoading ? (
            <div className="col-span-full py-12 text-center text-sm text-slate-500">
              불러오는 중...
            </div>
          ) : customCategories.length === 0 ? (
            <div className="col-span-full rounded-2xl border border-dashed border-slate-200 bg-white/40 py-10 text-center text-sm text-slate-500">
              아직 사용자 정의 카테고리가 없습니다. 위에서 추가해 주세요.
            </div>
          ) : (
            customCategories.map((item) => {
              const isEditing = editingCustomSlug === item.slug;
              const isSubmitting = submittingKey === item.slug;
              return (
                <div
                  key={item.slug}
                  className="overflow-hidden rounded-[28px] border border-slate-200 bg-white"
                >
                  <div className="relative h-52 overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(255,234,199,0.7),_rgba(226,232,240,1)_58%,_rgba(241,245,249,1)_100%)]">
                    {item.src ? (
                      <Image src={item.src} alt={item.label} fill className="object-cover" />
                    ) : (
                      <div className="flex h-full flex-col items-center justify-center text-slate-500">
                        <ImagePlus className="h-7 w-7" />
                        <div className="mt-2 text-sm">이미지 없음</div>
                      </div>
                    )}
                  </div>
                  <div className="space-y-4 p-5">
                    <div>
                      <div className="text-lg font-semibold text-slate-900">{item.label}</div>
                      <div className="mt-1 text-xs text-slate-500">
                        slug: <code className="rounded bg-slate-100 px-1.5 py-0.5">{item.slug}</code>
                      </div>
                      {item.updatedAt ? (
                        <div className="mt-1 text-xs text-slate-500">
                          마지막 변경: {new Date(item.updatedAt).toLocaleString("ko-KR")}
                        </div>
                      ) : null}
                    </div>

                    {isEditing ? (
                      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp,image/gif"
                          onChange={(e) => setCustomEditFile(e.target.files?.[0] ?? null)}
                          className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-full file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-white"
                        />
                        <div className="mt-3 flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleUpdateCustomImage(item.slug)}
                            disabled={isSubmitting || !customEditFile}
                            className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-xs font-semibold text-white disabled:bg-slate-400"
                          >
                            <Upload className="h-3.5 w-3.5" />
                            {isSubmitting ? "변경 중..." : "변경 저장"}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingCustomSlug(null);
                              setCustomEditFile(null);
                            }}
                            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700"
                          >
                            취소
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingCustomSlug(item.slug);
                            setCustomEditFile(null);
                          }}
                          className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                          <ImagePlus className="h-4 w-4" />
                          이미지 변경
                        </button>
                        {item.src ? (
                          <a
                            href={item.src}
                            download={item.fileName || undefined}
                            className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                          >
                            <Download className="h-4 w-4" />
                            다운로드
                          </a>
                        ) : null}
                        <button
                          type="button"
                          onClick={() => handleDeleteCustom(item.slug)}
                          disabled={isSubmitting}
                          className="inline-flex items-center justify-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 disabled:opacity-60"
                        >
                          <Trash2 className="h-4 w-4" />
                          삭제
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
