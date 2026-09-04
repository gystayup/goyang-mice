"use client";

// components/admin/DayTripCatalogPanel.tsx — 오더 #C57 [1] 당일코스 admin.
//
// 저장소: /api/admin/day-trip-catalog (Supabase pages · pageKey='day-trip-catalog').
// 스팟(SpotCatalogPanel) 미러: 모달 CRUD · 검색 · 축 필터 · 노출 on/off.
// 편집 필드: id/축/순서/시간 배지/코스명(ko·en)/후크/소개/스팟 리스트/교통/소요/추천 시간/확인 필요.
// 창작 문안 저장을 강제하지 않음 (사장님 원문 그대로 관리).

import { useEffect, useMemo, useState } from "react";
import { Edit2, Loader2, Plus, Save, Search, Trash2, X } from "lucide-react";

import type {
  DayTripAxis,
  DayTripCourse,
  DayTripDurationBadge,
  DayTripStop,
} from "@/data/day-trip-courses";

const AXES: { key: DayTripAxis; label: string }[] = [
  { key: "seoul", label: "서울" },
  { key: "paju", label: "파주" },
  { key: "gyeonggi", label: "경기" },
];

const BADGES: DayTripDurationBadge[] = ["4H", "5H", "5-6H", "6H", "8H"];

interface EditState {
  course: DayTripCourse;
  isNew: boolean;
}

function emptyCourse(): DayTripCourse {
  return {
    id: "",
    axis: "seoul",
    order: 1,
    durationBadge: "4H",
    name: "",
    nameEn: "",
    hook: "",
    intro: "",
    stops: [],
    transport: "",
    duration: "",
    recommendedTime: "",
    note: "",
    published: true,
  };
}

const PAGE_SIZE = 20;

export default function DayTripCatalogPanel() {
  const [items, setItems] = useState<DayTripCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterAxis, setFilterAxis] = useState<"" | DayTripAxis>("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const [edit, setEdit] = useState<EditState | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/day-trip-catalog", { cache: "no-store" });
      const json = (await res.json()) as {
        success: boolean;
        data?: DayTripCourse[];
        error?: string;
      };
      if (!json.success || !json.data) throw new Error(json.error ?? "목록을 불러오지 못했습니다.");
      setItems(json.data);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  const filtered = useMemo(() => {
    return items.filter((c) => {
      if (filterAxis && c.axis !== filterAxis) return false;
      if (query) {
        const q = query.toLowerCase();
        const hit =
          c.id.toLowerCase().includes(q) ||
          c.name.toLowerCase().includes(q) ||
          (c.nameEn ?? "").toLowerCase().includes(q);
        if (!hit) return false;
      }
      return true;
    });
  }, [items, filterAxis, query]);

  useEffect(() => {
    setPage(0);
  }, [filterAxis, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  async function handleSave() {
    if (!edit) return;
    const item = edit.course;
    if (!item.id || !item.name) {
      setError("id와 코스명은 필수입니다.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const method = edit.isNew ? "POST" : "PUT";
      const res = await fetch("/api/admin/day-trip-catalog", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ item }),
      });
      const json = (await res.json()) as {
        success: boolean;
        data?: DayTripCourse[];
        error?: string;
      };
      if (!json.success || !json.data) throw new Error(json.error ?? "저장 실패");
      setItems(json.data);
      setEdit(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm(`정말 삭제하시겠습니까? (${id})`)) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/day-trip-catalog?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const json = (await res.json()) as {
        success: boolean;
        data?: DayTripCourse[];
        error?: string;
      };
      if (!json.success || !json.data) throw new Error(json.error ?? "삭제 실패");
      setItems(json.data);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }

  function updateStop(i: number, patch: Partial<DayTripStop>) {
    if (!edit) return;
    const stops = [...edit.course.stops];
    stops[i] = { ...stops[i], ...patch };
    setEdit({ ...edit, course: { ...edit.course, stops } });
  }
  function addStop() {
    if (!edit) return;
    setEdit({
      ...edit,
      course: { ...edit.course, stops: [...edit.course.stops, { name: "", note: "" }] },
    });
  }
  function removeStop(i: number) {
    if (!edit) return;
    const stops = [...edit.course.stops];
    stops.splice(i, 1);
    setEdit({ ...edit, course: { ...edit.course, stops } });
  }
  function moveStop(i: number, dir: -1 | 1) {
    if (!edit) return;
    const stops = [...edit.course.stops];
    const j = i + dir;
    if (j < 0 || j >= stops.length) return;
    [stops[i], stops[j]] = [stops[j], stops[i]];
    setEdit({ ...edit, course: { ...edit.course, stops } });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900">당일코스 관리 (총 {items.length}건)</h2>
        <button
          type="button"
          onClick={() => setEdit({ course: emptyCourse(), isNew: true })}
          className="inline-flex items-center gap-1.5 rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800"
        >
          <Plus className="h-4 w-4" /> 새 코스
        </button>
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setFilterAxis("")}
          className={`rounded-full px-3 py-1 text-xs font-semibold ${filterAxis === "" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
        >
          전체
        </button>
        {AXES.map((a) => (
          <button
            key={a.key}
            type="button"
            onClick={() => setFilterAxis(a.key)}
            className={`rounded-full px-3 py-1 text-xs font-semibold ${filterAxis === a.key ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
          >
            {a.label}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-1 rounded-md border border-slate-300 bg-white px-2 py-1">
          <Search className="h-3.5 w-3.5 text-slate-400" />
          <input
            type="search"
            placeholder="id/이름 검색"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="min-w-0 flex-1 border-0 bg-transparent text-sm outline-none"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Loader2 className="h-4 w-4 animate-spin" /> 로딩 중...
        </div>
      ) : (
        <div className="overflow-hidden rounded-md border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">ID</th>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">코스명</th>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">축</th>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">시간</th>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">순서</th>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">노출</th>
                <th className="px-3 py-2 text-right font-semibold text-slate-700">액션</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {paged.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50">
                  <td className="px-3 py-2 font-mono text-xs text-slate-600">{c.id}</td>
                  <td className="px-3 py-2 text-slate-900">{c.name}</td>
                  <td className="px-3 py-2 text-slate-700">
                    {AXES.find((a) => a.key === c.axis)?.label ?? c.axis}
                  </td>
                  <td className="px-3 py-2 text-slate-700">{c.durationBadge}</td>
                  <td className="px-3 py-2 text-slate-700">{c.order}</td>
                  <td className="px-3 py-2">
                    {c.published === false ? (
                      <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs text-slate-600">
                        숨김
                      </span>
                    ) : (
                      <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-800">
                        노출
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2 text-right">
                    <button
                      type="button"
                      onClick={() =>
                        setEdit({
                          course: JSON.parse(JSON.stringify(c)) as DayTripCourse,
                          isNew: false,
                        })
                      }
                      className="mr-1 inline-flex items-center gap-1 rounded-md border border-slate-300 px-2 py-1 text-xs hover:bg-slate-100"
                    >
                      <Edit2 className="h-3 w-3" /> 편집
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleDelete(c.id)}
                      className="inline-flex items-center gap-1 rounded-md border border-red-300 px-2 py-1 text-xs text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-3 w-3" /> 삭제
                    </button>
                  </td>
                </tr>
              ))}
              {paged.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-3 py-8 text-center text-slate-500">
                    결과 없음
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-3 py-2 text-sm">
              <span className="text-slate-600">
                {page + 1} / {totalPages} 페이지
              </span>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="rounded-md border border-slate-300 px-2 py-1 disabled:opacity-40"
                >
                  이전
                </button>
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={page >= totalPages - 1}
                  className="rounded-md border border-slate-300 px-2 py-1 disabled:opacity-40"
                >
                  다음
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {edit && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setEdit(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3">
              <h3 className="text-lg font-bold">{edit.isNew ? "새 코스" : "코스 편집"}</h3>
              <button
                type="button"
                onClick={() => setEdit(null)}
                className="text-slate-500 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4 px-5 py-4">
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="text-xs font-semibold text-slate-700">ID (URL 키)</span>
                  <input
                    type="text"
                    value={edit.course.id}
                    disabled={!edit.isNew}
                    onChange={(e) =>
                      setEdit({ ...edit, course: { ...edit.course, id: e.target.value } })
                    }
                    className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1 text-sm disabled:bg-slate-100"
                    placeholder="예: seoul-royal"
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-semibold text-slate-700">축</span>
                  <select
                    value={edit.course.axis}
                    onChange={(e) =>
                      setEdit({
                        ...edit,
                        course: { ...edit.course, axis: e.target.value as DayTripAxis },
                      })
                    }
                    className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1 text-sm"
                  >
                    {AXES.map((a) => (
                      <option key={a.key} value={a.key}>
                        {a.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="text-xs font-semibold text-slate-700">시간 배지</span>
                  <select
                    value={edit.course.durationBadge}
                    onChange={(e) =>
                      setEdit({
                        ...edit,
                        course: {
                          ...edit.course,
                          durationBadge: e.target.value as DayTripDurationBadge,
                        },
                      })
                    }
                    className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1 text-sm"
                  >
                    {BADGES.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="text-xs font-semibold text-slate-700">순서 (축 내)</span>
                  <input
                    type="number"
                    min={1}
                    value={edit.course.order}
                    onChange={(e) =>
                      setEdit({
                        ...edit,
                        course: { ...edit.course, order: Number(e.target.value) || 1 },
                      })
                    }
                    className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1 text-sm"
                  />
                </label>
                <label className="block col-span-2">
                  <span className="text-xs font-semibold text-slate-700">코스명 (한국어)</span>
                  <input
                    type="text"
                    value={edit.course.name}
                    onChange={(e) =>
                      setEdit({ ...edit, course: { ...edit.course, name: e.target.value } })
                    }
                    className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1 text-sm"
                    placeholder="예: 왕의 서울 — 경복궁 · 북촌 · 인사동"
                  />
                </label>
                <label className="block col-span-2">
                  <span className="text-xs font-semibold text-slate-700">영문 상품명 (선택)</span>
                  <input
                    type="text"
                    value={edit.course.nameEn ?? ""}
                    onChange={(e) =>
                      setEdit({ ...edit, course: { ...edit.course, nameEn: e.target.value } })
                    }
                    className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1 text-sm"
                    placeholder="예: Royal Seoul"
                  />
                </label>
              </div>

              <label className="block">
                <span className="text-xs font-semibold text-slate-700">후크 (한 줄)</span>
                <textarea
                  rows={2}
                  value={edit.course.hook}
                  onChange={(e) =>
                    setEdit({ ...edit, course: { ...edit.course, hook: e.target.value } })
                  }
                  className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1 text-sm"
                />
              </label>

              <label className="block">
                <span className="text-xs font-semibold text-slate-700">소개 (문단)</span>
                <textarea
                  rows={5}
                  value={edit.course.intro}
                  onChange={(e) =>
                    setEdit({ ...edit, course: { ...edit.course, intro: e.target.value } })
                  }
                  className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1 text-sm"
                />
              </label>

              <div>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-700">
                    스팟 리스트 ({edit.course.stops.length}개)
                  </span>
                  <button
                    type="button"
                    onClick={addStop}
                    className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-2 py-1 text-xs hover:bg-slate-50"
                  >
                    <Plus className="h-3 w-3" /> 스팟 추가
                  </button>
                </div>
                <div className="space-y-2">
                  {edit.course.stops.map((s, i) => (
                    <div
                      key={i}
                      className="grid grid-cols-[1fr_2fr_auto] gap-2 rounded-md border border-slate-200 p-2"
                    >
                      <input
                        type="text"
                        value={s.name}
                        onChange={(e) => updateStop(i, { name: e.target.value })}
                        className="rounded-md border border-slate-300 px-2 py-1 text-sm"
                        placeholder="이름"
                      />
                      <input
                        type="text"
                        value={s.note}
                        onChange={(e) => updateStop(i, { note: e.target.value })}
                        className="rounded-md border border-slate-300 px-2 py-1 text-sm"
                        placeholder="한 줄 설명"
                      />
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => moveStop(i, -1)}
                          disabled={i === 0}
                          className="rounded border border-slate-300 px-1 text-xs disabled:opacity-40"
                        >
                          ▲
                        </button>
                        <button
                          type="button"
                          onClick={() => moveStop(i, 1)}
                          disabled={i >= edit.course.stops.length - 1}
                          className="rounded border border-slate-300 px-1 text-xs disabled:opacity-40"
                        >
                          ▼
                        </button>
                        <button
                          type="button"
                          onClick={() => removeStop(i)}
                          className="rounded border border-red-300 px-1 text-xs text-red-700"
                        >
                          삭제
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label className="block">
                  <span className="text-xs font-semibold text-slate-700">교통</span>
                  <textarea
                    rows={3}
                    value={edit.course.transport}
                    onChange={(e) =>
                      setEdit({
                        ...edit,
                        course: { ...edit.course, transport: e.target.value },
                      })
                    }
                    className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1 text-sm"
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-semibold text-slate-700">소요</span>
                  <input
                    type="text"
                    value={edit.course.duration}
                    onChange={(e) =>
                      setEdit({ ...edit, course: { ...edit.course, duration: e.target.value } })
                    }
                    className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1 text-sm"
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-semibold text-slate-700">추천 시간</span>
                  <input
                    type="text"
                    value={edit.course.recommendedTime}
                    onChange={(e) =>
                      setEdit({
                        ...edit,
                        course: { ...edit.course, recommendedTime: e.target.value },
                      })
                    }
                    className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1 text-sm"
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-semibold text-slate-700">
                    확인 필요 · 운영시간 (선택)
                  </span>
                  <textarea
                    rows={2}
                    value={edit.course.note ?? ""}
                    onChange={(e) =>
                      setEdit({ ...edit, course: { ...edit.course, note: e.target.value } })
                    }
                    className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1 text-sm"
                  />
                </label>
              </div>

              <div>
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={edit.course.published !== false}
                    onChange={(e) =>
                      setEdit({
                        ...edit,
                        course: { ...edit.course, published: e.target.checked },
                      })
                    }
                    className="h-4 w-4"
                  />
                  <span className="text-sm">프론트 노출</span>
                </label>
              </div>
            </div>
            <div className="flex justify-end gap-2 border-t border-slate-200 bg-slate-50 px-5 py-3">
              <button
                type="button"
                onClick={() => setEdit(null)}
                className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
              >
                취소
              </button>
              <button
                type="button"
                onClick={() => void handleSave()}
                disabled={loading}
                className="inline-flex items-center gap-1 rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}{" "}
                저장
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
