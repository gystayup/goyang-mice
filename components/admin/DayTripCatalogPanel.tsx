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
  DayTripFaqItem,
  DayTripStop,
  DayTripTimelineNode,
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
    // 오더 #C59 신규 필드 (상세 12블록)
    hookLine: "",
    overview: { totalDuration: "", transport: "", recommendedTime: "", recommendedFor: "" },
    timeline: [],
    whyGood: [],
    access: "",
    faq: [],
    illustrationKey: "",
  };
}

const ILLUSTRATION_OPTIONS = [
  "illust-airport",
  "illust-bus",
  "illust-culture",
  "illust-family",
  "illust-food",
  "illust-gtx",
  "illust-history",
  "illust-kculture",
  "illust-sim",
  "illust-subway",
  "illust-tmoney",
  "illust-walk",
];

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

  // ─── 오더 #C59 신규 필드 편집 헬퍼 ─────────────────────────────────────
  function updateOverview(patch: Partial<NonNullable<DayTripCourse["overview"]>>) {
    if (!edit) return;
    const overview = { ...(edit.course.overview ?? {}), ...patch };
    setEdit({ ...edit, course: { ...edit.course, overview } });
  }

  function updateTimeline(i: number, patch: Partial<DayTripTimelineNode>) {
    if (!edit) return;
    const timeline = [...(edit.course.timeline ?? [])];
    timeline[i] = { ...timeline[i], ...patch };
    setEdit({ ...edit, course: { ...edit.course, timeline } });
  }
  function addTimelineNode() {
    if (!edit) return;
    const timeline = [
      ...(edit.course.timeline ?? []),
      { time: "", spotName: "", spotSlug: "", duration: "", note: "", transportToNext: "" } as DayTripTimelineNode,
    ];
    setEdit({ ...edit, course: { ...edit.course, timeline } });
  }
  function removeTimelineNode(i: number) {
    if (!edit) return;
    const timeline = [...(edit.course.timeline ?? [])];
    timeline.splice(i, 1);
    setEdit({ ...edit, course: { ...edit.course, timeline } });
  }
  function moveTimelineNode(i: number, dir: -1 | 1) {
    if (!edit) return;
    const timeline = [...(edit.course.timeline ?? [])];
    const j = i + dir;
    if (j < 0 || j >= timeline.length) return;
    [timeline[i], timeline[j]] = [timeline[j], timeline[i]];
    setEdit({ ...edit, course: { ...edit.course, timeline } });
  }

  function updateWhyGood(i: number, value: string) {
    if (!edit) return;
    const whyGood = [...(edit.course.whyGood ?? [])];
    whyGood[i] = value;
    setEdit({ ...edit, course: { ...edit.course, whyGood } });
  }
  function addWhyGood() {
    if (!edit) return;
    const whyGood = [...(edit.course.whyGood ?? []), ""];
    setEdit({ ...edit, course: { ...edit.course, whyGood } });
  }
  function removeWhyGood(i: number) {
    if (!edit) return;
    const whyGood = [...(edit.course.whyGood ?? [])];
    whyGood.splice(i, 1);
    setEdit({ ...edit, course: { ...edit.course, whyGood } });
  }

  function updateFaq(i: number, patch: Partial<DayTripFaqItem>) {
    if (!edit) return;
    const faq = [...(edit.course.faq ?? [])];
    faq[i] = { ...faq[i], ...patch };
    setEdit({ ...edit, course: { ...edit.course, faq } });
  }
  function addFaq() {
    if (!edit) return;
    const faq = [...(edit.course.faq ?? []), { q: "", a: "" }];
    setEdit({ ...edit, course: { ...edit.course, faq } });
  }
  function removeFaq(i: number) {
    if (!edit) return;
    const faq = [...(edit.course.faq ?? [])];
    faq.splice(i, 1);
    setEdit({ ...edit, course: { ...edit.course, faq } });
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

              {/* ─── 오더 #C59 신규 필드 (상세 12블록 템플릿) ─── */}
              <div className="mt-6 border-t border-slate-200 pt-4">
                <h4 className="mb-2 text-sm font-black text-slate-800">
                  상세 페이지 확장 필드 (#C59 · 12블록)
                </h4>
                <p className="mb-3 text-xs text-slate-500">
                  비워두면 해당 블록은 상세 페이지에서 자동 숨김됩니다.
                </p>
              </div>

              <label className="block">
                <span className="text-xs font-semibold text-slate-700">
                  히어로 아래 후크 한 줄 (선택 · 없으면 위 후크 재사용)
                </span>
                <input
                  type="text"
                  value={edit.course.hookLine ?? ""}
                  onChange={(e) =>
                    setEdit({ ...edit, course: { ...edit.course, hookLine: e.target.value } })
                  }
                  className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1 text-sm"
                />
              </label>

              <div>
                <span className="text-xs font-semibold text-slate-700">Overview 4칸</span>
                <div className="mt-1 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <input
                    type="text"
                    value={edit.course.overview?.totalDuration ?? ""}
                    onChange={(e) => updateOverview({ totalDuration: e.target.value })}
                    className="rounded-md border border-slate-300 px-2 py-1 text-sm"
                    placeholder="총 소요 (예: 약 4시간)"
                  />
                  <input
                    type="text"
                    value={edit.course.overview?.transport ?? ""}
                    onChange={(e) => updateOverview({ transport: e.target.value })}
                    className="rounded-md border border-slate-300 px-2 py-1 text-sm"
                    placeholder="이동 (예: 편도 27~29분 · 환승 없음)"
                  />
                  <input
                    type="text"
                    value={edit.course.overview?.recommendedTime ?? ""}
                    onChange={(e) => updateOverview({ recommendedTime: e.target.value })}
                    className="rounded-md border border-slate-300 px-2 py-1 text-sm"
                    placeholder="추천 시간 (예: 09:30 ~ 13:30)"
                  />
                  <input
                    type="text"
                    value={edit.course.overview?.recommendedFor ?? ""}
                    onChange={(e) => updateOverview({ recommendedFor: e.target.value })}
                    className="rounded-md border border-slate-300 px-2 py-1 text-sm"
                    placeholder="이런 분께 (예: 처음 한국을 찾는 방문객)"
                  />
                </div>
              </div>

              <div>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-700">
                    타임라인 ({(edit.course.timeline ?? []).length}개 노드)
                  </span>
                  <button
                    type="button"
                    onClick={addTimelineNode}
                    className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-2 py-1 text-xs hover:bg-slate-50"
                  >
                    <Plus className="h-3 w-3" /> 노드 추가
                  </button>
                </div>
                <div className="space-y-2">
                  {(edit.course.timeline ?? []).map((n, i) => (
                    <div
                      key={i}
                      className="space-y-1 rounded-md border border-slate-200 p-2"
                    >
                      <div className="grid grid-cols-[80px_1fr_100px_auto] gap-1">
                        <input
                          type="text"
                          value={n.time ?? ""}
                          onChange={(e) => updateTimeline(i, { time: e.target.value })}
                          className="rounded-md border border-slate-300 px-2 py-1 text-sm"
                          placeholder="09:30"
                        />
                        <input
                          type="text"
                          value={n.spotName}
                          onChange={(e) => updateTimeline(i, { spotName: e.target.value })}
                          className="rounded-md border border-slate-300 px-2 py-1 text-sm"
                          placeholder="스팟명"
                        />
                        <input
                          type="text"
                          value={n.duration ?? ""}
                          onChange={(e) => updateTimeline(i, { duration: e.target.value })}
                          className="rounded-md border border-slate-300 px-2 py-1 text-sm"
                          placeholder="약 90분"
                        />
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => moveTimelineNode(i, -1)}
                            disabled={i === 0}
                            className="rounded border border-slate-300 px-1 text-xs disabled:opacity-40"
                          >
                            ▲
                          </button>
                          <button
                            type="button"
                            onClick={() => moveTimelineNode(i, 1)}
                            disabled={i >= (edit.course.timeline ?? []).length - 1}
                            className="rounded border border-slate-300 px-1 text-xs disabled:opacity-40"
                          >
                            ▼
                          </button>
                          <button
                            type="button"
                            onClick={() => removeTimelineNode(i)}
                            className="rounded border border-red-300 px-1 text-xs text-red-700"
                          >
                            삭제
                          </button>
                        </div>
                      </div>
                      <input
                        type="text"
                        value={n.spotSlug ?? ""}
                        onChange={(e) => updateTimeline(i, { spotSlug: e.target.value })}
                        className="w-full rounded-md border border-slate-300 px-2 py-1 text-xs"
                        placeholder="스팟 slug (선택 · /dmc/{slug} 링크. 존재하는 스팟만 링크됨)"
                      />
                      <input
                        type="text"
                        value={n.note ?? ""}
                        onChange={(e) => updateTimeline(i, { note: e.target.value })}
                        className="w-full rounded-md border border-slate-300 px-2 py-1 text-sm"
                        placeholder="한 줄 설명"
                      />
                      <input
                        type="text"
                        value={n.transportToNext ?? ""}
                        onChange={(e) => updateTimeline(i, { transportToNext: e.target.value })}
                        className="w-full rounded-md border border-slate-300 px-2 py-1 text-xs"
                        placeholder="다음 노드까지 이동 (예: 도보 15분) · 마지막 노드는 비움"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-700">
                    이 코스가 좋은 이유 ({(edit.course.whyGood ?? []).length}개)
                  </span>
                  <button
                    type="button"
                    onClick={addWhyGood}
                    className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-2 py-1 text-xs hover:bg-slate-50"
                  >
                    <Plus className="h-3 w-3" /> 항목 추가
                  </button>
                </div>
                <div className="space-y-2">
                  {(edit.course.whyGood ?? []).map((v, i) => (
                    <div key={i} className="flex gap-1">
                      <input
                        type="text"
                        value={v}
                        onChange={(e) => updateWhyGood(i, e.target.value)}
                        className="flex-1 rounded-md border border-slate-300 px-2 py-1 text-sm"
                        placeholder="한 문장으로"
                      />
                      <button
                        type="button"
                        onClick={() => removeWhyGood(i)}
                        className="rounded border border-red-300 px-2 text-xs text-red-700"
                      >
                        삭제
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <label className="block">
                <span className="text-xs font-semibold text-slate-700">
                  가는 법 상세 (선택 · 없으면 위 &apos;교통&apos; 재사용)
                </span>
                <textarea
                  rows={3}
                  value={edit.course.access ?? ""}
                  onChange={(e) =>
                    setEdit({ ...edit, course: { ...edit.course, access: e.target.value } })
                  }
                  className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1 text-sm"
                  placeholder="버스 번호 금지 (지도 페이지와 중복)"
                />
              </label>

              <div>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-700">
                    FAQ ({(edit.course.faq ?? []).length}개 · 없으면 블록 숨김)
                  </span>
                  <button
                    type="button"
                    onClick={addFaq}
                    className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-2 py-1 text-xs hover:bg-slate-50"
                  >
                    <Plus className="h-3 w-3" /> FAQ 추가
                  </button>
                </div>
                <div className="space-y-2">
                  {(edit.course.faq ?? []).map((f, i) => (
                    <div key={i} className="space-y-1 rounded-md border border-slate-200 p-2">
                      <div className="flex gap-1">
                        <input
                          type="text"
                          value={f.q}
                          onChange={(e) => updateFaq(i, { q: e.target.value })}
                          className="flex-1 rounded-md border border-slate-300 px-2 py-1 text-sm"
                          placeholder="질문 Q"
                        />
                        <button
                          type="button"
                          onClick={() => removeFaq(i)}
                          className="rounded border border-red-300 px-2 text-xs text-red-700"
                        >
                          삭제
                        </button>
                      </div>
                      <textarea
                        rows={2}
                        value={f.a}
                        onChange={(e) => updateFaq(i, { a: e.target.value })}
                        className="w-full rounded-md border border-slate-300 px-2 py-1 text-sm"
                        placeholder="답변 A"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <label className="block">
                <span className="text-xs font-semibold text-slate-700">
                  About 블록 라인 일러스트 (선택 · public/images/illustrations/)
                </span>
                <select
                  value={edit.course.illustrationKey ?? ""}
                  onChange={(e) =>
                    setEdit({
                      ...edit,
                      course: { ...edit.course, illustrationKey: e.target.value },
                    })
                  }
                  className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1 text-sm"
                >
                  <option value="">(선택 안 함 — About 블록에 일러스트 미표시)</option>
                  {ILLUSTRATION_OPTIONS.map((key) => (
                    <option key={key} value={key}>
                      {key}
                    </option>
                  ))}
                </select>
              </label>

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
