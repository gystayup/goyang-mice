"use client";

import { useEffect, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Image,
  Loader2,
  Plus,
  Save,
  Trash2,
  Video,
} from "lucide-react";

type HeroSlide = {
  id: string;
  type: "youtube" | "image";
  koLabel: string;
  koTitle: string;
  koDesc: string;
  enLabel: string;
  enTitle: string;
  enDesc: string;
  youtubeId?: string;
  background?: string;
};

const GRADIENT_PRESETS = [
  {
    label: "블루 (KINTEX)",
    value: "linear-gradient(135deg, #213b83 0%, #5679e8 48%, #9edff6 100%)",
  },
  {
    label: "선셋 (로컬 체류)",
    value: "linear-gradient(135deg, #ffe38f 0%, #ffb39b 40%, #c39af9 100%)",
  },
  {
    label: "나이트 (야간 프로그램)",
    value: "linear-gradient(135deg, #122548 0%, #3557b0 42%, #ff8d8b 84%, #ffd280 100%)",
  },
  {
    label: "딥 오션 (DMC 서비스)",
    value: "linear-gradient(135deg, #0f2027 0%, #203a43 40%, #2c5364 100%)",
  },
  {
    label: "에메랄드",
    value: "linear-gradient(135deg, #134e5e 0%, #71b280 100%)",
  },
  {
    label: "퍼플 드림",
    value: "linear-gradient(135deg, #6a3093 0%, #a044ff 100%)",
  },
];

function newSlide(): HeroSlide {
  return {
    id: `slide-${Date.now()}`,
    type: "image",
    koLabel: "",
    koTitle: "",
    koDesc: "",
    enLabel: "",
    enTitle: "",
    enDesc: "",
    background: GRADIENT_PRESETS[0].value,
  };
}

export default function HeroSlidesPanel() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/hero-slides")
      .then((r) => r.json())
      .then((json) => {
        if (json.success && json.data.length > 0) {
          setSlides(json.data as HeroSlide[]);
        } else {
          // 기본값: 현재 하드코딩된 슬라이드
          setSlides(defaultSlides);
        }
        setLoading(false);
      })
      .catch(() => {
        setSlides(defaultSlides);
        setLoading(false);
      });
  }, []);

  const save = async () => {
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch("/api/admin/hero-slides", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slides }),
      });
      const json = (await res.json()) as { success: boolean };
      if (json.success) {
        setMsg({ type: "success", text: "저장되었습니다." });
      } else {
        setMsg({ type: "error", text: "저장 실패" });
      }
    } catch {
      setMsg({ type: "error", text: "저장 중 오류가 발생했습니다." });
    }
    setSaving(false);
  };

  const update = (id: string, field: keyof HeroSlide, value: string) => {
    setSlides((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const moveUp = (i: number) => {
    if (i === 0) return;
    setSlides((prev) => {
      const next = [...prev];
      [next[i - 1], next[i]] = [next[i], next[i - 1]];
      return next;
    });
  };

  const moveDown = (i: number) => {
    setSlides((prev) => {
      if (i >= prev.length - 1) return prev;
      const next = [...prev];
      [next[i], next[i + 1]] = [next[i + 1], next[i]];
      return next;
    });
  };

  const remove = (id: string) => {
    if (!confirm("이 슬라이드를 삭제할까요?")) return;
    setSlides((prev) => prev.filter((s) => s.id !== id));
  };

  const add = () => {
    const s = newSlide();
    setSlides((prev) => [...prev, s]);
    setExpandedId(s.id);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">히어로 슬라이드 관리</h2>
          <p className="mt-0.5 text-sm text-slate-500">
            메인 페이지 상단 캐러셀 슬라이드를 편집합니다. 최대 7개 권장.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={add}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200"
          >
            <Plus className="h-4 w-4" />
            슬라이드 추가
          </button>
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            저장
          </button>
        </div>
      </div>

      {msg && (
        <div
          className={`rounded-xl px-4 py-3 text-sm font-medium ${
            msg.type === "success"
              ? "bg-emerald-50 text-emerald-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {msg.text}
        </div>
      )}

      <div className="space-y-3">
        {slides.map((slide, i) => {
          const isOpen = expandedId === slide.id;
          return (
            <div
              key={slide.id}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
            >
              {/* 헤더 */}
              <div className="flex items-center gap-3 px-4 py-3">
                {/* 순서 뱃지 */}
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">
                  {i + 1}
                </span>

                {/* 미디어 타입 아이콘 */}
                <div
                  className="flex h-10 w-16 shrink-0 items-center justify-center rounded-xl"
                  style={
                    slide.type === "image"
                      ? { background: slide.background ?? "#213b83" }
                      : { background: "#000" }
                  }
                >
                  {slide.type === "youtube" ? (
                    <Video className="h-4 w-4 text-white" />
                  ) : (
                    <Image className="h-4 w-4 text-white" />
                  )}
                </div>

                {/* 제목 */}
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-slate-800">
                    {slide.koTitle || "(제목 없음)"}
                  </p>
                  <p className="truncate text-xs text-slate-400">{slide.koLabel}</p>
                </div>

                {/* 버튼 */}
                <div className="flex shrink-0 items-center gap-1">
                  <button
                    type="button"
                    onClick={() => moveUp(i)}
                    disabled={i === 0}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 disabled:opacity-30"
                    title="위로"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveDown(i)}
                    disabled={i === slides.length - 1}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 disabled:opacity-30"
                    title="아래로"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(slide.id)}
                    className="rounded-lg p-1.5 text-red-400 hover:bg-red-50"
                    title="삭제"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setExpandedId(isOpen ? null : slide.id)}
                    className="ml-1 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    {isOpen ? "닫기" : "편집"}
                  </button>
                </div>
              </div>

              {/* 편집 폼 */}
              {isOpen && (
                <div className="border-t border-slate-100 px-4 pb-5 pt-4">
                  {/* 타입 선택 */}
                  <div className="mb-4">
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                      슬라이드 타입
                    </label>
                    <div className="flex gap-3">
                      {(["image", "youtube"] as const).map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => update(slide.id, "type", t)}
                          className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition ${
                            slide.type === t
                              ? "border-slate-900 bg-slate-900 text-white"
                              : "border-slate-200 text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          {t === "youtube" ? (
                            <Video className="h-4 w-4" />
                          ) : (
                            <Image className="h-4 w-4" />
                          )}
                          {t === "youtube" ? "유튜브 영상" : "이미지 (그라디언트)"}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 유튜브 ID */}
                  {slide.type === "youtube" && (
                    <div className="mb-4">
                      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                        유튜브 영상 ID
                      </label>
                      <input
                        type="text"
                        value={slide.youtubeId ?? ""}
                        onChange={(e) => update(slide.id, "youtubeId", e.target.value)}
                        placeholder="예: Hsg5JTPITFw (URL에서 v= 뒤 부분)"
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
                      />
                    </div>
                  )}

                  {/* 배경 그라디언트 */}
                  {slide.type === "image" && (
                    <div className="mb-4">
                      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                        배경 그라디언트
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {GRADIENT_PRESETS.map((g) => (
                          <button
                            key={g.value}
                            type="button"
                            onClick={() => update(slide.id, "background", g.value)}
                            title={g.label}
                            className={`flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-medium transition ${
                              slide.background === g.value
                                ? "border-slate-900 shadow-sm"
                                : "border-slate-200 hover:border-slate-400"
                            }`}
                          >
                            <span
                              className="h-4 w-8 rounded-md"
                              style={{ background: g.value }}
                            />
                            {g.label}
                          </button>
                        ))}
                      </div>
                      <input
                        type="text"
                        value={slide.background ?? ""}
                        onChange={(e) => update(slide.id, "background", e.target.value)}
                        placeholder="또는 직접 CSS gradient 입력"
                        className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-500 outline-none focus:border-slate-400"
                      />
                    </div>
                  )}

                  {/* 한국어 / 영어 나란히 */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {/* 한국어 */}
                    <div className="space-y-3 rounded-xl bg-slate-50 p-4">
                      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                        🇰🇷 한국어
                      </p>
                      <div>
                        <label className="mb-1 block text-xs text-slate-500">라벨</label>
                        <input
                          type="text"
                          value={slide.koLabel}
                          onChange={(e) => update(slide.id, "koLabel", e.target.value)}
                          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm outline-none focus:border-slate-400"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs text-slate-500">제목</label>
                        <input
                          type="text"
                          value={slide.koTitle}
                          onChange={(e) => update(slide.id, "koTitle", e.target.value)}
                          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm outline-none focus:border-slate-400"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs text-slate-500">설명</label>
                        <textarea
                          value={slide.koDesc}
                          onChange={(e) => update(slide.id, "koDesc", e.target.value)}
                          rows={2}
                          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm outline-none focus:border-slate-400"
                        />
                      </div>
                    </div>

                    {/* 영어 */}
                    <div className="space-y-3 rounded-xl bg-slate-50 p-4">
                      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                        🇺🇸 English
                      </p>
                      <div>
                        <label className="mb-1 block text-xs text-slate-500">Label</label>
                        <input
                          type="text"
                          value={slide.enLabel}
                          onChange={(e) => update(slide.id, "enLabel", e.target.value)}
                          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm outline-none focus:border-slate-400"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs text-slate-500">Title</label>
                        <input
                          type="text"
                          value={slide.enTitle}
                          onChange={(e) => update(slide.id, "enTitle", e.target.value)}
                          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm outline-none focus:border-slate-400"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs text-slate-500">
                          Description
                        </label>
                        <textarea
                          value={slide.enDesc}
                          onChange={(e) => update(slide.id, "enDesc", e.target.value)}
                          rows={2}
                          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm outline-none focus:border-slate-400"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {slides.length === 0 && (
        <div className="rounded-2xl border-2 border-dashed border-slate-200 py-12 text-center text-slate-400">
          <Image className="mx-auto mb-3 h-10 w-10 opacity-40" />
          <p className="text-sm">슬라이드가 없습니다. 추가 버튼을 눌러 시작하세요.</p>
        </div>
      )}

      {slides.length > 0 && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            변경사항 저장
          </button>
        </div>
      )}
    </div>
  );
}

// 기본 슬라이드 (DB에 데이터가 없을 때 사용)
const defaultSlides: HeroSlide[] = [
  {
    id: "intro-video",
    type: "youtube",
    koLabel: "고양 소개 영상",
    koTitle: "도시의 분위기와 K-컬처 장면을 담은 대표 영상",
    koDesc: "공연, 전시, 체류, 라이프스타일 장면이 자연스럽게 이어지는 대표 미디어입니다.",
    enLabel: "Goyang city film",
    enTitle: "A featured video that introduces the city and its K-culture atmosphere",
    enDesc: "A lead visual that connects performance, exhibition, stay and lifestyle scenes.",
    youtubeId: "Hsg5JTPITFw",
  },
  {
    id: "kintex",
    type: "image",
    koLabel: "KINTEX 거점",
    koTitle: "공연과 전시, 비즈니스 방문이 이어지는 주요 장면",
    koDesc: "행사 관람, 현장 운영, 지역 체류가 하나의 흐름으로 이어지는 메인 비주얼입니다.",
    enLabel: "KINTEX hub",
    enTitle: "A key visual for performances, exhibitions and business visits",
    enDesc: "A main scene where events, operations and local stays connect in one flow.",
    background: "linear-gradient(135deg, #213b83 0%, #5679e8 48%, #9edff6 100%)",
  },
  {
    id: "local-stay",
    type: "image",
    koLabel: "로컬 체류",
    koTitle: "가족 체험과 로컬 체류가 자연스럽게 이어지는 분위기",
    koDesc: "관광, 미식, 쇼핑, 숙박을 함께 보여주는 라이프스타일 장면입니다.",
    enLabel: "Local stay",
    enTitle: "A softer scene where family experiences and longer stays naturally connect",
    enDesc: "A lifestyle-oriented visual combining tourism, dining, shopping and local visits.",
    background: "linear-gradient(135deg, #ffe38f 0%, #ffb39b 40%, #c39af9 100%)",
  },
  {
    id: "night-program",
    type: "image",
    koLabel: "야간 프로그램",
    koTitle: "야간 공연과 현장 운영의 에너지를 담은 비주얼",
    koDesc: "캠페인 배너와 시즌형 대표 장면으로 교체해 사용할 수 있는 이미지 영역입니다.",
    enLabel: "Night program",
    enTitle: "A visual that captures night events and on-site energy",
    enDesc: "A campaign-ready scene that can be replaced with seasonal brand media.",
    background: "linear-gradient(135deg, #122548 0%, #3557b0 42%, #ff8d8b 84%, #ffd280 100%)",
  },
  {
    id: "dmc-service",
    type: "image",
    koLabel: "DMC 서비스",
    koTitle: "고양의 문화·관광·MICE를 하나로 잇는 운영 플랫폼",
    koDesc: "연구, 기획, 예약, 현장 운영까지 고양의 모든 방문 경험을 연결합니다.",
    enLabel: "DMC Services",
    enTitle: "An operations platform connecting culture, tourism and MICE in Goyang",
    enDesc: "Connecting every visitor experience in Goyang — from research and booking to on-site operations.",
    background: "linear-gradient(135deg, #0f2027 0%, #203a43 40%, #2c5364 100%)",
  },
];
