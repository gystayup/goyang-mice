"use client";

import { useCallback, useEffect, useState } from "react";
import { GripVertical, Plus, Save, Trash2, Video } from "lucide-react";

type YoutubeVideo = { id: string; title?: string; url: string; thumbnail?: string };
type YoutubeSettings = {
  channelId?: string;
  channelUrl?: string;
  autoSync?: boolean;
  featuredVideoUrl?: string;
  videos: YoutubeVideo[];
};
type InstagramPost = { id: string; url: string; caption?: string };
type InstagramSettings = { handle?: string; profileUrl?: string; posts: InstagramPost[] };
type TiktokVideo = { id: string; url: string; caption?: string };
type TiktokSettings = { handle?: string; profileUrl?: string; videos: TiktokVideo[] };

type SocialLinksData = {
  youtube: YoutubeSettings;
  instagram: InstagramSettings;
  tiktok: TiktokSettings;
};

const EMPTY: SocialLinksData = {
  youtube: { videos: [], autoSync: true },
  instagram: { posts: [] },
  tiktok: { videos: [] },
};

function uid() {
  try {
    return crypto.randomUUID();
  } catch {
    return `sns_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  }
}

export default function SocialLinksPanel() {
  const [data, setData] = useState<SocialLinksData>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/social-links");
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error ?? "불러오기 실패");
      setData({ ...EMPTY, ...json.data });
    } catch (e) {
      setError(e instanceof Error ? e.message : "불러오기 실패");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const save = useCallback(async () => {
    setSaveStatus("saving");
    setError("");
    try {
      const res = await fetch("/api/admin/social-links", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error ?? "저장 실패");
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 1600);
    } catch (e) {
      setSaveStatus("error");
      setError(e instanceof Error ? e.message : "저장 실패");
    }
  }, [data]);

  if (loading) {
    return (
      <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-10 text-center text-slate-500">
        SNS 설정을 불러오는 중…
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-6">
      <div className="flex items-center justify-between rounded-3xl border border-slate-200 bg-white p-6">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">SNS 콘텐츠 관리</h2>
          <p className="mt-1 text-sm text-slate-500">
            유튜브는 채널 ID로 자동 동기화, 인스타/틱톡은 게시물 URL 수동 등록 방식입니다.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <SaveBadge status={saveStatus} />
          <button
            onClick={save}
            className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            <Save className="h-4 w-4" />
            저장
          </button>
        </div>
      </div>

      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      {/* YouTube */}
      <section className="rounded-3xl border border-slate-200 bg-white p-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <Video className="h-6 w-6 text-rose-600" />
          <h3 className="text-lg font-semibold text-slate-900">유튜브</h3>
          <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">
            자동 동기화 가능
          </span>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <Field label="채널 ID (예: UCxxxx…)">
            <input
              value={data.youtube.channelId ?? ""}
              onChange={(e) =>
                setData((d) => ({ ...d, youtube: { ...d.youtube, channelId: e.target.value } }))
              }
              className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-slate-400"
              placeholder="UC_example_channel_id"
            />
          </Field>
          <Field label="채널 URL">
            <input
              value={data.youtube.channelUrl ?? ""}
              onChange={(e) =>
                setData((d) => ({ ...d, youtube: { ...d.youtube, channelUrl: e.target.value } }))
              }
              className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-slate-400"
              placeholder="https://youtube.com/@goyangmice"
            />
          </Field>
          <Field label="홈 하이라이트 영상 URL (선택)">
            <input
              value={data.youtube.featuredVideoUrl ?? ""}
              onChange={(e) =>
                setData((d) => ({
                  ...d,
                  youtube: { ...d.youtube, featuredVideoUrl: e.target.value },
                }))
              }
              className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-slate-400"
              placeholder="https://youtube.com/watch?v=…"
            />
          </Field>
          <label className="mt-1 flex items-end gap-3 pb-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={data.youtube.autoSync ?? true}
              onChange={(e) =>
                setData((d) => ({ ...d, youtube: { ...d.youtube, autoSync: e.target.checked } }))
              }
              className="h-4 w-4"
            />
            <span>
              <strong>자동 동기화 사용</strong>
              <span className="ml-2 text-xs text-slate-500">
                (YOUTUBE_API_KEY 와 채널 ID 필요)
              </span>
            </span>
          </label>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-slate-700">
              추천 영상 (자동 동기화 비활성 시 표시)
            </h4>
            <button
              onClick={() =>
                setData((d) => ({
                  ...d,
                  youtube: {
                    ...d.youtube,
                    videos: [...d.youtube.videos, { id: uid(), url: "" }],
                  },
                }))
              }
              className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
            >
              <Plus className="h-3.5 w-3.5" /> 영상 추가
            </button>
          </div>
          <div className="mt-3 space-y-2">
            {data.youtube.videos.length === 0 ? (
              <p className="rounded-xl bg-slate-50 px-3 py-3 text-xs text-slate-500">
                추가된 영상이 없습니다.
              </p>
            ) : (
              data.youtube.videos.map((v, idx) => (
                <div
                  key={v.id}
                  className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2"
                >
                  <GripVertical className="h-4 w-4 text-slate-400" />
                  <span className="w-6 text-xs text-slate-500">{idx + 1}</span>
                  <input
                    value={v.url}
                    onChange={(e) =>
                      setData((d) => ({
                        ...d,
                        youtube: {
                          ...d.youtube,
                          videos: d.youtube.videos.map((x) =>
                            x.id === v.id ? { ...x, url: e.target.value } : x
                          ),
                        },
                      }))
                    }
                    placeholder="https://youtube.com/watch?v=…"
                    className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm outline-none focus:border-slate-400"
                  />
                  <input
                    value={v.title ?? ""}
                    onChange={(e) =>
                      setData((d) => ({
                        ...d,
                        youtube: {
                          ...d.youtube,
                          videos: d.youtube.videos.map((x) =>
                            x.id === v.id ? { ...x, title: e.target.value } : x
                          ),
                        },
                      }))
                    }
                    placeholder="제목 (선택)"
                    className="w-48 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm outline-none focus:border-slate-400"
                  />
                  <button
                    onClick={() =>
                      setData((d) => ({
                        ...d,
                        youtube: {
                          ...d.youtube,
                          videos: d.youtube.videos.filter((x) => x.id !== v.id),
                        },
                      }))
                    }
                    className="rounded-lg p-1.5 text-rose-600 transition hover:bg-rose-50"
                    aria-label="삭제"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Instagram */}
      <section className="rounded-3xl border border-slate-200 bg-white p-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="h-6 w-6 rounded-md bg-gradient-to-tr from-amber-400 via-rose-500 to-fuchsia-600" />
          <h3 className="text-lg font-semibold text-slate-900">인스타그램</h3>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
            수동 URL 등록
          </span>
        </div>
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <Field label="계정 (@핸들)">
            <input
              value={data.instagram.handle ?? ""}
              onChange={(e) =>
                setData((d) => ({
                  ...d,
                  instagram: { ...d.instagram, handle: e.target.value },
                }))
              }
              className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-slate-400"
              placeholder="@goyangmice"
            />
          </Field>
          <Field label="프로필 URL">
            <input
              value={data.instagram.profileUrl ?? ""}
              onChange={(e) =>
                setData((d) => ({
                  ...d,
                  instagram: { ...d.instagram, profileUrl: e.target.value },
                }))
              }
              className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-slate-400"
              placeholder="https://instagram.com/goyangmice"
            />
          </Field>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-slate-700">게시물 URL (권장 9개)</h4>
            <button
              onClick={() =>
                setData((d) => ({
                  ...d,
                  instagram: {
                    ...d.instagram,
                    posts: [...d.instagram.posts, { id: uid(), url: "" }],
                  },
                }))
              }
              className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
            >
              <Plus className="h-3.5 w-3.5" /> 게시물 추가
            </button>
          </div>
          <div className="mt-3 space-y-2">
            {data.instagram.posts.length === 0 ? (
              <p className="rounded-xl bg-slate-50 px-3 py-3 text-xs text-slate-500">
                등록된 게시물이 없습니다.
              </p>
            ) : (
              data.instagram.posts.map((p, idx) => (
                <div
                  key={p.id}
                  className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2"
                >
                  <GripVertical className="h-4 w-4 text-slate-400" />
                  <span className="w-6 text-xs text-slate-500">{idx + 1}</span>
                  <input
                    value={p.url}
                    onChange={(e) =>
                      setData((d) => ({
                        ...d,
                        instagram: {
                          ...d.instagram,
                          posts: d.instagram.posts.map((x) =>
                            x.id === p.id ? { ...x, url: e.target.value } : x
                          ),
                        },
                      }))
                    }
                    placeholder="https://instagram.com/p/…"
                    className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm outline-none focus:border-slate-400"
                  />
                  <input
                    value={p.caption ?? ""}
                    onChange={(e) =>
                      setData((d) => ({
                        ...d,
                        instagram: {
                          ...d.instagram,
                          posts: d.instagram.posts.map((x) =>
                            x.id === p.id ? { ...x, caption: e.target.value } : x
                          ),
                        },
                      }))
                    }
                    placeholder="캡션 (선택)"
                    className="w-48 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm outline-none focus:border-slate-400"
                  />
                  <button
                    onClick={() =>
                      setData((d) => ({
                        ...d,
                        instagram: {
                          ...d.instagram,
                          posts: d.instagram.posts.filter((x) => x.id !== p.id),
                        },
                      }))
                    }
                    className="rounded-lg p-1.5 text-rose-600 transition hover:bg-rose-50"
                    aria-label="삭제"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* TikTok */}
      <section className="rounded-3xl border border-slate-200 bg-white p-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="h-6 w-6 rounded-md bg-slate-900" />
          <h3 className="text-lg font-semibold text-slate-900">틱톡</h3>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
            수동 URL 등록
          </span>
        </div>
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <Field label="계정 (@핸들)">
            <input
              value={data.tiktok.handle ?? ""}
              onChange={(e) =>
                setData((d) => ({ ...d, tiktok: { ...d.tiktok, handle: e.target.value } }))
              }
              className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-slate-400"
              placeholder="@goyangmice"
            />
          </Field>
          <Field label="프로필 URL">
            <input
              value={data.tiktok.profileUrl ?? ""}
              onChange={(e) =>
                setData((d) => ({
                  ...d,
                  tiktok: { ...d.tiktok, profileUrl: e.target.value },
                }))
              }
              className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-slate-400"
              placeholder="https://tiktok.com/@goyangmice"
            />
          </Field>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-slate-700">영상 URL (권장 6개)</h4>
            <button
              onClick={() =>
                setData((d) => ({
                  ...d,
                  tiktok: {
                    ...d.tiktok,
                    videos: [...d.tiktok.videos, { id: uid(), url: "" }],
                  },
                }))
              }
              className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
            >
              <Plus className="h-3.5 w-3.5" /> 영상 추가
            </button>
          </div>
          <div className="mt-3 space-y-2">
            {data.tiktok.videos.length === 0 ? (
              <p className="rounded-xl bg-slate-50 px-3 py-3 text-xs text-slate-500">
                등록된 영상이 없습니다.
              </p>
            ) : (
              data.tiktok.videos.map((v, idx) => (
                <div
                  key={v.id}
                  className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2"
                >
                  <GripVertical className="h-4 w-4 text-slate-400" />
                  <span className="w-6 text-xs text-slate-500">{idx + 1}</span>
                  <input
                    value={v.url}
                    onChange={(e) =>
                      setData((d) => ({
                        ...d,
                        tiktok: {
                          ...d.tiktok,
                          videos: d.tiktok.videos.map((x) =>
                            x.id === v.id ? { ...x, url: e.target.value } : x
                          ),
                        },
                      }))
                    }
                    placeholder="https://tiktok.com/@user/video/…"
                    className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm outline-none focus:border-slate-400"
                  />
                  <input
                    value={v.caption ?? ""}
                    onChange={(e) =>
                      setData((d) => ({
                        ...d,
                        tiktok: {
                          ...d.tiktok,
                          videos: d.tiktok.videos.map((x) =>
                            x.id === v.id ? { ...x, caption: e.target.value } : x
                          ),
                        },
                      }))
                    }
                    placeholder="캡션 (선택)"
                    className="w-48 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm outline-none focus:border-slate-400"
                  />
                  <button
                    onClick={() =>
                      setData((d) => ({
                        ...d,
                        tiktok: {
                          ...d.tiktok,
                          videos: d.tiktok.videos.filter((x) => x.id !== v.id),
                        },
                      }))
                    }
                    className="rounded-lg p-1.5 text-rose-600 transition hover:bg-rose-50"
                    aria-label="삭제"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function SaveBadge({ status }: { status: "idle" | "saving" | "saved" | "error" }) {
  if (status === "idle") return null;
  const meta: Record<"saving" | "saved" | "error", { label: string; className: string }> = {
    saving: { label: "저장 중…", className: "bg-slate-100 text-slate-600" },
    saved: { label: "저장 완료", className: "bg-emerald-100 text-emerald-700" },
    error: { label: "저장 실패", className: "bg-rose-100 text-rose-700" },
  };
  const { label, className } = meta[status];
  return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${className}`}>{label}</span>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-slate-600">{label}</span>
      {children}
    </label>
  );
}
