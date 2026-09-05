"use client";

// components/admin/SiteCopyPanel.tsx — 오더 #C60 admin 사이트 문안 관리.
//
// 저장소: /api/admin/site-copy (Supabase pages · pageKey='site-copy').
// 5섹션 접이식 (details/summary):
//   [A] 홈 카피            — 4항목 × 5로케일
//   [B] 신뢰 바            — 4칸 × label 5로케일 (bold "GOYANG DMC" hidden 편집)
//   [C] /best 9카테고리    — label + desc × 5로케일 (카테고리별 접이식)
//   [D] 푸터 사업자 정보    — 8개 단문 필드 + disclaimer 5로케일 + disclaimerHeading 5로케일
//   [E] 환율               — USD·JPY·CNY·TWD 4개 숫자 입력 · KRW=1 표시만
//
// 규범:
//   · SpotCatalogPanel UI 톤 미러 (아이보리 카드 · 편집→저장).
//   · 문안 자체를 새로 쓰거나 다듬지 말 것 — 시드에서 옮긴 현행 값이 초기 표시.

import { useEffect, useState } from "react";
import { Loader2, Save } from "lucide-react";

import {
  BEST_CATEGORY_KEYS,
  SITE_COPY_LOCALES,
  type BestCategoryKey,
  type I18n,
  type SiteCopy,
  type SiteCopyLocale,
} from "@/data/site-copy-defaults";

const LOCALE_LABEL: Record<SiteCopyLocale, string> = {
  ko: "한국어",
  en: "English",
  ja: "日本語",
  "zh-CN": "简体",
  "zh-TW": "繁體",
};

const BEST_CAT_LABEL: Record<BestCategoryKey, string> = {
  walk: "산책",
  food: "미식",
  culture: "문화",
  kculture: "K컬처",
  history: "역사",
  family: "가족",
  shopping: "쇼핑",
  stay: "숙박",
  night: "야간",
};

export default function SiteCopyPanel() {
  const [data, setData] = useState<SiteCopy | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/site-copy", { cache: "no-store" });
      const json = (await res.json()) as { success: boolean; data?: SiteCopy; error?: string };
      if (!json.success || !json.data) throw new Error(json.error ?? "불러오지 못했습니다.");
      setData(json.data);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function handleSave() {
    if (!data) return;
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/site-copy", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data }),
      });
      const json = (await res.json()) as { success: boolean; data?: SiteCopy; error?: string };
      if (!json.success || !json.data) throw new Error(json.error ?? "저장 실패");
      setData(json.data);
      setMessage("저장되었습니다.");
      setTimeout(() => setMessage(null), 3000);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setSaving(false);
    }
  }

  function updateI18n(current: I18n, locale: SiteCopyLocale, value: string): I18n {
    return { ...current, [locale]: value };
  }

  if (loading || !data) {
    return (
      <div className="mt-6 flex items-center gap-2 text-sm text-slate-500">
        <Loader2 className="h-4 w-4 animate-spin" /> 사이트 문안을 불러오는 중...
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-4">
      <div className="rounded-3xl border border-slate-200 bg-white p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">사이트 문안</h2>
            <p className="mt-1 text-sm text-slate-500">
              홈 · 신뢰 바 · /best 9카테고리 · 푸터 · 환율. 5로케일 (ko/en/ja/zh-CN/zh-TW) 편집.
              저장 시 프로덕션 화면에 즉시 반영됩니다.
            </p>
          </div>
          <button
            type="button"
            onClick={() => void handleSave()}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            저장
          </button>
        </div>
        {error && (
          <div className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}
        {message && (
          <div className="mt-3 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            {message}
          </div>
        )}
      </div>

      {/* ─── [A] 홈 카피 ─── */}
      <details open className="rounded-3xl border border-slate-200 bg-[#faf7f2] p-5">
        <summary className="cursor-pointer text-base font-black uppercase tracking-[0.14em] text-slate-900">
          [A] 홈 카피 — 히어로 4항목
        </summary>
        <div className="mt-4 space-y-5">
          <I18nRow
            label="브랜드 아이브로우 (heroBrandEyebrow)"
            value={data.home.heroBrandEyebrow}
            onChange={(loc, v) =>
              setData({
                ...data,
                home: { ...data.home, heroBrandEyebrow: updateI18n(data.home.heroBrandEyebrow, loc, v) },
              })
            }
          />
          <I18nRow
            label="헤드라인 (heroHeadline)"
            value={data.home.heroHeadline}
            onChange={(loc, v) =>
              setData({
                ...data,
                home: { ...data.home, heroHeadline: updateI18n(data.home.heroHeadline, loc, v) },
              })
            }
          />
          <I18nRow
            label="서브 (heroSubhead)"
            value={data.home.heroSubhead}
            multiline
            onChange={(loc, v) =>
              setData({
                ...data,
                home: { ...data.home, heroSubhead: updateI18n(data.home.heroSubhead, loc, v) },
              })
            }
          />
          <I18nRow
            label="검색바 placeholder (heroSearchPlaceholder)"
            value={data.home.heroSearchPlaceholder}
            onChange={(loc, v) =>
              setData({
                ...data,
                home: {
                  ...data.home,
                  heroSearchPlaceholder: updateI18n(data.home.heroSearchPlaceholder, loc, v),
                },
              })
            }
          />
        </div>
      </details>

      {/* ─── [B] 신뢰 바 ─── */}
      <details className="rounded-3xl border border-slate-200 bg-[#faf7f2] p-5">
        <summary className="cursor-pointer text-base font-black uppercase tracking-[0.14em] text-slate-900">
          [B] 신뢰 바 — 4칸 (푸터 위 코럴 띠)
        </summary>
        <div className="mt-4 space-y-6">
          {data.trustBar.items.map((item, idx) => (
            <div key={idx} className="rounded-2xl bg-white p-4">
              <div className="mb-3 flex items-center justify-between">
                <div className="text-sm font-bold text-slate-900">항목 {idx + 1}</div>
                {idx === 0 && (
                  <div className="text-xs text-slate-500">
                    bold 라벨 &quot;{item.bold ?? ""}&quot; (5로케일 공통 · 브랜드)
                  </div>
                )}
              </div>
              {idx === 0 && (
                <label className="mb-3 block">
                  <span className="text-xs font-semibold text-slate-700">Bold 라벨 (첫 칸만)</span>
                  <input
                    type="text"
                    value={item.bold ?? ""}
                    onChange={(e) => {
                      const items = [...data.trustBar.items];
                      items[idx] = { ...items[idx], bold: e.target.value };
                      setData({ ...data, trustBar: { items } });
                    }}
                    className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1 text-sm"
                  />
                </label>
              )}
              <I18nRow
                label="label"
                value={item.label}
                onChange={(loc, v) => {
                  const items = [...data.trustBar.items];
                  items[idx] = { ...items[idx], label: updateI18n(items[idx].label, loc, v) };
                  setData({ ...data, trustBar: { items } });
                }}
              />
            </div>
          ))}
        </div>
      </details>

      {/* ─── [C] /best 9카테고리 ─── */}
      <details className="rounded-3xl border border-slate-200 bg-[#faf7f2] p-5">
        <summary className="cursor-pointer text-base font-black uppercase tracking-[0.14em] text-slate-900">
          [C] /best 9카테고리 — 라벨 · 설명
        </summary>
        <div className="mt-4 space-y-4">
          {BEST_CATEGORY_KEYS.map((cat) => (
            <details key={cat} className="rounded-2xl bg-white p-4">
              <summary className="cursor-pointer text-sm font-bold text-slate-900">
                {cat} · {BEST_CAT_LABEL[cat]}
              </summary>
              <div className="mt-3 space-y-4">
                <I18nRow
                  label="라벨 (label · CATEGORY_LABEL)"
                  value={data.bestCategories.label[cat]}
                  onChange={(loc, v) =>
                    setData({
                      ...data,
                      bestCategories: {
                        ...data.bestCategories,
                        label: {
                          ...data.bestCategories.label,
                          [cat]: updateI18n(data.bestCategories.label[cat], loc, v),
                        },
                      },
                    })
                  }
                />
                <I18nRow
                  label="설명 (desc · CARD_DESC)"
                  value={data.bestCategories.desc[cat]}
                  multiline
                  onChange={(loc, v) =>
                    setData({
                      ...data,
                      bestCategories: {
                        ...data.bestCategories,
                        desc: {
                          ...data.bestCategories.desc,
                          [cat]: updateI18n(data.bestCategories.desc[cat], loc, v),
                        },
                      },
                    })
                  }
                />
              </div>
            </details>
          ))}
        </div>
      </details>

      {/* ─── [D] 푸터 ─── */}
      <details className="rounded-3xl border border-slate-200 bg-[#faf7f2] p-5">
        <summary className="cursor-pointer text-base font-black uppercase tracking-[0.14em] text-slate-900">
          [D] 푸터 — 사업자 정보 · 법적 고지
        </summary>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {(
            [
              { k: "companyName", label: "상호" },
              { k: "ceo", label: "대표" },
              { k: "bizRegNo", label: "사업자등록번호" },
              { k: "ecomRegNo", label: "통신판매업 신고번호" },
              { k: "address", label: "소재지" },
              { k: "phone", label: "대표전화" },
              { k: "email", label: "이메일" },
              { k: "privacyOfficer", label: "개인정보관리책임자" },
            ] as const
          ).map(({ k, label }) => (
            <label key={k} className="block">
              <span className="text-xs font-semibold text-slate-700">{label}</span>
              <input
                type="text"
                value={data.footer[k]}
                onChange={(e) => setData({ ...data, footer: { ...data.footer, [k]: e.target.value } })}
                className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1 text-sm"
              />
            </label>
          ))}
        </div>
        <div className="mt-5 space-y-5">
          <I18nRow
            label="법적 고지 헤딩 (disclaimerHeading)"
            value={data.footer.disclaimerHeading}
            onChange={(loc, v) =>
              setData({
                ...data,
                footer: { ...data.footer, disclaimerHeading: updateI18n(data.footer.disclaimerHeading, loc, v) },
              })
            }
          />
          <I18nRow
            label="법적 고지 본문 (disclaimer)"
            value={data.footer.disclaimer}
            multiline
            onChange={(loc, v) =>
              setData({
                ...data,
                footer: { ...data.footer, disclaimer: updateI18n(data.footer.disclaimer, loc, v) },
              })
            }
          />
        </div>
      </details>

      {/* ─── [E] 환율 ─── */}
      <details className="rounded-3xl border border-slate-200 bg-[#faf7f2] p-5">
        <summary className="cursor-pointer text-base font-black uppercase tracking-[0.14em] text-slate-900">
          [E] 환율 — KRW 대비 (KRW=1 상수)
        </summary>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-md border border-slate-200 bg-white px-3 py-2">
            <div className="text-xs font-semibold text-slate-700">KRW (편집 불가 · 상수)</div>
            <div className="mt-1 text-sm text-slate-900">1</div>
          </div>
          {(["USD", "JPY", "CNY", "TWD"] as const).map((code) => (
            <label key={code} className="block rounded-md border border-slate-300 bg-white px-3 py-2">
              <span className="text-xs font-semibold text-slate-700">{code}</span>
              <input
                type="number"
                step="0.00001"
                value={data.exchangeRates[code]}
                onChange={(e) =>
                  setData({
                    ...data,
                    exchangeRates: {
                      ...data.exchangeRates,
                      [code]: Number.isFinite(parseFloat(e.target.value))
                        ? parseFloat(e.target.value)
                        : 0,
                    },
                  })
                }
                className="mt-1 w-full border-0 bg-transparent text-sm outline-none"
              />
            </label>
          ))}
        </div>
        <p className="mt-3 text-xs text-slate-500">
          예: USD 0.00073 은 1 KRW ≈ 0.00073 USD (1 USD ≈ 약 1,370원).
        </p>
      </details>

      {/* 하단 저장 버튼 (사용성) */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => void handleSave()}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          저장
        </button>
      </div>
    </div>
  );
}

function I18nRow({
  label,
  value,
  onChange,
  multiline,
}: {
  label: string;
  value: I18n;
  onChange: (loc: SiteCopyLocale, v: string) => void;
  multiline?: boolean;
}) {
  return (
    <div>
      <div className="mb-1 text-xs font-semibold text-slate-700">{label}</div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {SITE_COPY_LOCALES.map((loc) =>
          multiline ? (
            <textarea
              key={loc}
              rows={3}
              value={value[loc] ?? ""}
              onChange={(e) => onChange(loc, e.target.value)}
              placeholder={LOCALE_LABEL[loc]}
              className="rounded-md border border-slate-300 px-2 py-1 text-sm"
            />
          ) : (
            <input
              key={loc}
              type="text"
              value={value[loc] ?? ""}
              onChange={(e) => onChange(loc, e.target.value)}
              placeholder={LOCALE_LABEL[loc]}
              className="rounded-md border border-slate-300 px-2 py-1 text-sm"
            />
          )
        )}
      </div>
    </div>
  );
}
