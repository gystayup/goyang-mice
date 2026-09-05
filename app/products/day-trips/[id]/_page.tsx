// /[locale]/products/day-trips/[id] — 오더 #C59 상세 12블록 템플릿.
//
// 방침 (사장님 확정 · #C59):
//   · 템플릿 1건만 (서울① seoul-royal), 나머지 16코스는 신규 필드 미채움 → 조건부 블록 숨김.
//   · 판매·예약 없음. 소개형.
//   · 창작·의역 금지. 원문 그대로.
//   · 신규 색 도입 0 · 기존 토큰만 (#232322 · var(--accent) · var(--gold) · #faf7f2).
//   · 신규 이미지 제작 금지 · public/images/illustrations/ 12종 재사용.
//   · 5로케일 폴백 · ko 만 신규 필드 채움 · en/ja/zh-CN/zh-TW 렌더 시 ko fallback.
//
// 12블록:
//   ① 히어로 (사진 or 축 컬러 폴백)
//   ② 제목 영역 (배지 2개 · 코스명 · 스팟 · 후크)
//   ③ Overview 4칸
//   ④ 타임라인 (핵심)
//   ⑤ 지도 (다음 오더 안내 placeholder · Leaflet 등 신규 도입 큰 부담)
//   ⑥ About (좌측 라인 일러스트)
//   ⑦ 이 코스가 좋은 이유
//   ⑧ 가는 법
//   ⑨ 스팟 카드
//   ⑩ FAQ (없으면 블록 숨김)
//   ⑪ 같은 축 다른 코스 3개
//   ⑫ 하단 sticky CTA "고양 숙소 보기" → /best/stay

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

import Shell from "@/components/layout/Shell";
import { Link } from "@/lib/navigation";
import { getAxisBlock, type DayTripLocale } from "@/data/day-trips";
import type { DayTripCourse } from "@/data/day-trip-courses";
import { loadDayTrip, loadDayTrips } from "@/lib/day-trip-catalog-db";
import { hasSpotAsync } from "@/lib/spot-catalog-db";

export type PageLocale = DayTripLocale;

// ─── 라벨 (5로케일) ─────────────────────────────────────────────────────
const OVERVIEW_LABEL: Record<PageLocale, string> = {
  ko: "Overview",
  en: "Overview",
  ja: "Overview",
  "zh-CN": "Overview",
  "zh-TW": "Overview",
};
const OVERVIEW_ITEM_LABELS: Record<PageLocale, {
  totalDuration: string;
  transport: string;
  recommendedTime: string;
  recommendedFor: string;
}> = {
  ko: { totalDuration: "총 소요", transport: "이동", recommendedTime: "추천 시간", recommendedFor: "이런 분께" },
  en: { totalDuration: "Total time", transport: "Transit", recommendedTime: "Best time", recommendedFor: "For you if" },
  ja: { totalDuration: "総所要", transport: "移動", recommendedTime: "おすすめ時間", recommendedFor: "こんな方に" },
  "zh-CN": { totalDuration: "总用时", transport: "交通", recommendedTime: "推荐时间", recommendedFor: "适合" },
  "zh-TW": { totalDuration: "總用時", transport: "交通", recommendedTime: "推薦時間", recommendedFor: "適合" },
};
const TIMELINE_LABEL: Record<PageLocale, string> = {
  ko: "코스 타임라인",
  en: "Course timeline",
  ja: "コースタイムライン",
  "zh-CN": "路线时间轴",
  "zh-TW": "路線時間軸",
};
const MAP_LABEL: Record<PageLocale, string> = {
  ko: "지도",
  en: "Map",
  ja: "地図",
  "zh-CN": "地图",
  "zh-TW": "地圖",
};
const MAP_NOTICE: Record<PageLocale, string> = {
  ko: "지도는 다음 오더에서 연결됩니다.",
  en: "Interactive map will be connected in a future update.",
  ja: "地図は次回アップデートで接続されます。",
  "zh-CN": "地图将在下次更新中接入。",
  "zh-TW": "地圖將在下次更新中接入。",
};
const ABOUT_LABEL: Record<PageLocale, string> = {
  ko: "About this course",
  en: "About this course",
  ja: "About this course",
  "zh-CN": "About this course",
  "zh-TW": "About this course",
};
const WHY_LABEL: Record<PageLocale, string> = {
  ko: "이 코스가 좋은 이유",
  en: "Why this course",
  ja: "このコースがおすすめの理由",
  "zh-CN": "为什么选这条路线",
  "zh-TW": "為什麼選這條路線",
};
const ACCESS_LABEL: Record<PageLocale, string> = {
  ko: "가는 법",
  en: "Getting there",
  ja: "行き方",
  "zh-CN": "如何前往",
  "zh-TW": "如何前往",
};
const ACCESS_MAP_LINK: Record<PageLocale, string> = {
  ko: "대곡역 교통 개념도 보기",
  en: "See Daegok Station map",
  ja: "大谷駅 交通図を見る",
  "zh-CN": "查看大谷站交通图",
  "zh-TW": "查看大谷站交通圖",
};
const STOPS_LABEL: Record<PageLocale, string> = {
  ko: "코스에 포함된 스팟",
  en: "Stops on this course",
  ja: "コース内のスポット",
  "zh-CN": "路线上的地点",
  "zh-TW": "路線上的地點",
};
const FAQ_LABEL: Record<PageLocale, string> = {
  ko: "자주 묻는 질문",
  en: "FAQ",
  ja: "よくある質問",
  "zh-CN": "常见问题",
  "zh-TW": "常見問題",
};
const RELATED_LABEL: Record<PageLocale, string> = {
  ko: "같은 축의 다른 코스",
  en: "Other courses in this axis",
  ja: "同じ軸の他のコース",
  "zh-CN": "同一线路的其他路线",
  "zh-TW": "同一線路的其他路線",
};
const CTA_INTRO: Record<PageLocale, (badge: string) => string> = {
  ko: (b) => `이 코스는 고양에서 왕복 ${b} · Stay in Goyang.`,
  en: (b) => `This course runs ${b} round-trip from Goyang · Stay in Goyang.`,
  ja: (b) => `このコースは高陽から往復${b} · Stay in Goyang.`,
  "zh-CN": (b) => `本路线从高阳往返 ${b} · Stay in Goyang.`,
  "zh-TW": (b) => `本路線從高陽往返 ${b} · Stay in Goyang.`,
};
const CTA_BUTTON: Record<PageLocale, string> = {
  ko: "고양 숙소 보기",
  en: "See stays in Goyang",
  ja: "高陽の宿泊を見る",
  "zh-CN": "查看高阳住宿",
  "zh-TW": "查看高陽住宿",
};
const AXIS_BADGE_EN: Record<string, string> = {
  seoul: "SEOUL",
  paju: "PAJU",
  gyeonggi: "GYEONGGI",
};

/** 축 배지 색 — 신규 색 도입 0 · 기존 토큰만. */
function axisBadgeStyle(axis: string): { background: string; color: string } {
  if (axis === "seoul") return { background: "var(--accent)", color: "#ffffff" };
  if (axis === "gyeonggi") return { background: "var(--gold)", color: "#232322" };
  return { background: "var(--charcoal, #232322)", color: "#ffffff" };
}

export async function getDayTripDetailMetadata(
  id: string,
  locale: PageLocale
): Promise<Metadata> {
  const course = await loadDayTrip(id);
  if (!course) return { title: "당일코스" };
  return {
    title: course.name,
    description: course.hookLine ?? course.hook,
    alternates: { canonical: `/${locale}/products/day-trips/${id}` },
  };
}

export default async function DayTripDetailPage({
  id,
  locale = "ko",
}: {
  id: string;
  locale?: PageLocale;
}) {
  const course = await loadDayTrip(id);
  if (!course) notFound();
  const axis = getAxisBlock(course.axis);
  const displayName = locale === "ko" || !course.nameEn ? course.name : course.nameEn;
  const hookText = course.hookLine ?? course.hook;

  // 타임라인 스팟 링크 유효성 (죽은 링크 금지)
  const timeline = course.timeline ?? [];
  const timelineLinkability = await Promise.all(
    timeline.map(async (n) => (n.spotSlug ? await hasSpotAsync(n.spotSlug) : false))
  );

  // 스팟 카드용 — timeline의 spotSlug 존재하는 것만
  const spotCards = timeline
    .map((n, i) => ({ node: n, linkable: timelineLinkability[i] }))
    .filter((x) => x.linkable && x.node.spotSlug);

  // 같은 축 다른 코스 3개
  const allCourses = await loadDayTrips();
  const related = allCourses
    .filter((c) => c.axis === course.axis && c.id !== course.id)
    .slice(0, 3);

  const badgeStyle = axisBadgeStyle(course.axis);
  const axisEn = AXIS_BADGE_EN[course.axis] ?? course.axis.toUpperCase();

  return (
    <Shell>
      <article className="bg-white text-[#232322]">
        {/* ① 히어로 — 사진 미확보 → 축 컬러 그라디언트 폴백 (기존 #C47 패턴) */}
        <section className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 sm:pt-8">
          <div
            aria-hidden="true"
            className="relative w-full overflow-hidden rounded-2xl"
            style={{
              height: "clamp(20rem, 40vw, 30rem)",
              background: `linear-gradient(135deg, ${axis.color} 0%, ${axis.color}CC 55%, ${axis.color}99 100%)`,
            }}
          />
        </section>

        {/* ② 제목 영역 */}
        <section className="mx-auto max-w-[720px] px-4 pt-10 sm:px-6 sm:pt-14">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="inline-flex items-center rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em]"
              style={badgeStyle}
            >
              {axisEn}
            </span>
            <span
              className="inline-flex items-center rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em]"
              style={{ background: "#faf7f2", color: "#232322" }}
            >
              {course.durationBadge}
            </span>
          </div>
          <h1 className="mt-4 text-3xl font-black leading-tight tracking-[-0.03em] text-[#232322] sm:text-4xl lg:text-5xl">
            {displayName}
          </h1>
          {course.stops.length > 0 && (
            <p className="mt-3 text-sm text-slate-500 sm:text-base">
              {course.stops.map((s) => s.name).join(" · ")}
            </p>
          )}
          <p className="mt-4 text-base leading-[1.7] text-[#232322] sm:text-lg">{hookText}</p>
        </section>

        {/* ③ Overview 4칸 (없으면 숨김) */}
        {course.overview && hasAnyOverview(course.overview) && (
          <section className="mx-auto max-w-[720px] px-4 py-10 sm:px-6 sm:py-16">
            <h2 className="text-sm font-black uppercase tracking-[0.16em] text-slate-500">
              {OVERVIEW_LABEL[locale]}
            </h2>
            <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
              {course.overview.totalDuration && (
                <OverviewCell
                  label={OVERVIEW_ITEM_LABELS[locale].totalDuration}
                  value={course.overview.totalDuration}
                />
              )}
              {course.overview.transport && (
                <OverviewCell
                  label={OVERVIEW_ITEM_LABELS[locale].transport}
                  value={course.overview.transport}
                />
              )}
              {course.overview.recommendedTime && (
                <OverviewCell
                  label={OVERVIEW_ITEM_LABELS[locale].recommendedTime}
                  value={course.overview.recommendedTime}
                />
              )}
              {course.overview.recommendedFor && (
                <OverviewCell
                  label={OVERVIEW_ITEM_LABELS[locale].recommendedFor}
                  value={course.overview.recommendedFor}
                />
              )}
            </dl>
          </section>
        )}

        {/* ④ 타임라인 (핵심) — 없으면 숨김 */}
        {timeline.length > 0 && (
          <section className="bg-[#faf7f2]">
            <div className="mx-auto max-w-[720px] px-4 py-10 sm:px-6 sm:py-16">
              <h2 className="text-xl font-black leading-tight tracking-[-0.02em] text-[#232322] sm:text-2xl">
                {TIMELINE_LABEL[locale]}
              </h2>
              <ol className="relative mt-6">
                {timeline.map((node, i) => {
                  const isLast = i === timeline.length - 1;
                  const linkable = timelineLinkability[i];
                  return (
                    <li key={`${node.spotName}-${i}`} className="relative pb-8 last:pb-0">
                      {/* 좌측 세로선 */}
                      {!isLast && (
                        <span
                          aria-hidden="true"
                          className="absolute left-[11px] top-6 h-full w-px"
                          style={{ background: axis.color, opacity: 0.35 }}
                        />
                      )}
                      {/* 원형 노드 (색=축) */}
                      <span
                        aria-hidden="true"
                        className="absolute left-0 top-1 inline-block h-6 w-6 rounded-full ring-4 ring-[#faf7f2]"
                        style={{ background: axis.color }}
                      />
                      <div className="pl-10">
                        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                          {node.time && (
                            <span className="text-sm font-black text-[#232322]">{node.time}</span>
                          )}
                          {linkable && node.spotSlug ? (
                            <Link
                              href={`/dmc/${node.spotSlug}`}
                              className="text-base font-bold text-[#232322] underline-offset-4 hover:underline sm:text-lg"
                            >
                              {node.spotName}
                            </Link>
                          ) : (
                            <span className="text-base font-bold text-[#232322] sm:text-lg">
                              {node.spotName}
                            </span>
                          )}
                          {node.duration && (
                            <span className="text-sm text-slate-500">{node.duration}</span>
                          )}
                        </div>
                        {node.note && (
                          <p className="mt-1 text-sm leading-[1.7] text-slate-700">{node.note}</p>
                        )}
                        {node.transportToNext && (
                          <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                            <span
                              aria-hidden="true"
                              className="inline-block h-4 w-px border-l border-dashed"
                              style={{ borderColor: axis.color, opacity: 0.6 }}
                            />
                            <span>↓ {node.transportToNext}</span>
                          </div>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          </section>
        )}

        {/* ⑤ 지도 — Leaflet 등 신규 라이브러리 도입 없이 placeholder */}
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16">
          <h2 className="text-xl font-black leading-tight tracking-[-0.02em] text-[#232322] sm:text-2xl">
            {MAP_LABEL[locale]}
          </h2>
          <div
            aria-hidden="true"
            className="mt-4 flex h-[400px] w-full items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-[#faf7f2]"
          >
            <span className="text-sm text-slate-500">{MAP_NOTICE[locale]}</span>
          </div>
        </section>

        {/* ⑥ About + 좌측 라인 일러스트 */}
        <section className="mx-auto max-w-[720px] px-4 py-10 sm:px-6 sm:py-16">
          <h2 className="text-xl font-black leading-tight tracking-[-0.02em] text-[#232322] sm:text-2xl">
            {ABOUT_LABEL[locale]}
          </h2>
          <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-start">
            {course.illustrationKey && (
              <div className="shrink-0">
                <Image
                  src={`/images/illustrations/${course.illustrationKey}.svg`}
                  alt=""
                  width={120}
                  height={120}
                  className="h-24 w-24 sm:h-28 sm:w-28"
                />
              </div>
            )}
            <p className="whitespace-pre-line text-base leading-[1.7] text-[#232322]">
              {course.intro}
            </p>
          </div>
        </section>

        {/* ⑦ 이 코스가 좋은 이유 (없으면 숨김) */}
        {course.whyGood && course.whyGood.length > 0 && (
          <section className="mx-auto max-w-[720px] px-4 py-10 sm:px-6 sm:py-16">
            <h2 className="text-xl font-black leading-tight tracking-[-0.02em] text-[#232322] sm:text-2xl">
              {WHY_LABEL[locale]}
            </h2>
            <ul className="mt-6 space-y-3">
              {course.whyGood.map((line, i) => (
                <li key={i} className="flex gap-3 text-base leading-[1.7] text-[#232322]">
                  <span
                    aria-hidden="true"
                    className="mt-2 inline-block h-2 w-2 shrink-0 rounded-full"
                    style={{ background: axis.color }}
                  />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ⑧ 가는 법 — 버스 번호 금지 · 하단 대곡역 지도 링크 */}
        <section className="mx-auto max-w-[720px] px-4 py-10 sm:px-6 sm:py-16">
          <h2 className="text-xl font-black leading-tight tracking-[-0.02em] text-[#232322] sm:text-2xl">
            {ACCESS_LABEL[locale]}
          </h2>
          {course.access ? (
            <p className="mt-6 whitespace-pre-line text-base leading-[1.7] text-[#232322]">
              {course.access}
            </p>
          ) : (
            <p className="mt-6 whitespace-pre-line text-base leading-[1.7] text-[#232322]">
              {course.transport}
            </p>
          )}
          <div className="mt-6">
            <Link
              href="/dmc/move"
              className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--accent)] underline-offset-4 hover:underline"
            >
              {ACCESS_MAP_LINK[locale]} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* ⑨ 스팟 카드 — 스팟 상세 있는 것만 */}
        {spotCards.length > 0 && (
          <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16">
            <h2 className="text-xl font-black leading-tight tracking-[-0.02em] text-[#232322] sm:text-2xl">
              {STOPS_LABEL[locale]}
            </h2>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {spotCards.map(({ node }, i) => (
                <Link
                  key={`${node.spotSlug}-${i}`}
                  href={`/dmc/${node.spotSlug}`}
                  className="group block overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:border-[var(--accent)]"
                >
                  <div
                    aria-hidden="true"
                    className="h-32 w-full"
                    style={{
                      background: `linear-gradient(135deg, ${axis.color} 0%, ${axis.color}CC 100%)`,
                    }}
                  />
                  <div className="p-4">
                    <div className="text-base font-bold text-[#232322] group-hover:text-[var(--accent)]">
                      {node.spotName}
                    </div>
                    {node.note && (
                      <p className="mt-1 line-clamp-2 text-sm text-slate-600">{node.note}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ⑩ FAQ — 없으면 블록 자체 숨김 */}
        {course.faq && course.faq.length > 0 && (
          <section className="mx-auto max-w-[720px] px-4 py-10 sm:px-6 sm:py-16">
            <h2 className="text-xl font-black leading-tight tracking-[-0.02em] text-[#232322] sm:text-2xl">
              {FAQ_LABEL[locale]}
            </h2>
            <dl className="mt-6 space-y-4">
              {course.faq.slice(0, 4).map((item, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-slate-200 bg-white p-5"
                >
                  <dt className="text-base font-bold text-[#232322]">Q. {item.q}</dt>
                  <dd className="mt-2 whitespace-pre-line text-sm leading-[1.7] text-slate-700">
                    {item.a}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        {/* ⑪ 같은 축 다른 코스 3개 */}
        {related.length > 0 && (
          <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16">
            <h2 className="text-xl font-black leading-tight tracking-[-0.02em] text-[#232322] sm:text-2xl">
              {RELATED_LABEL[locale]}
            </h2>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {related.map((rel) => (
                <RelatedCard key={rel.id} course={rel} locale={locale} axisColor={axis.color} />
              ))}
            </div>
          </section>
        )}

        {/* ⑫ 하단 sticky CTA — "고양 숙소 보기" → /best/stay */}
        <div
          role="complementary"
          className="sticky bottom-0 z-30 border-t border-slate-200 bg-[#faf7f2]/95 backdrop-blur"
        >
          <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-4 py-4 sm:flex-row sm:justify-between sm:px-6">
            <p className="text-sm text-[#232322] sm:text-base">
              {CTA_INTRO[locale](course.durationBadge)}
            </p>
            <Link
              href="/best/stay"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-bold text-white shadow-[0_8px_20px_rgba(226,62,46,0.28)] transition hover:brightness-110"
            >
              {CTA_BUTTON[locale]} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* 하단 여백 (sticky 뒤에 남는 스크롤 공간) */}
        <div className="h-4" />
      </article>
    </Shell>
  );
}

function hasAnyOverview(o: NonNullable<DayTripCourse["overview"]>): boolean {
  return Boolean(o.totalDuration || o.transport || o.recommendedTime || o.recommendedFor);
}

function OverviewCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
        {label}
      </dt>
      <dd className="mt-2 text-sm font-bold leading-[1.5] text-[#232322] sm:text-base">
        {value}
      </dd>
    </div>
  );
}

function RelatedCard({
  course,
  locale,
  axisColor,
}: {
  course: DayTripCourse;
  locale: PageLocale;
  axisColor: string;
}) {
  const name = locale === "ko" || !course.nameEn ? course.name : course.nameEn;
  const hook = course.hookLine ?? course.hook;
  return (
    <Link
      href={`/products/day-trips/${course.id}`}
      className="group block overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:border-[var(--accent)]"
    >
      <div
        aria-hidden="true"
        className="h-32 w-full"
        style={{
          background: `linear-gradient(135deg, ${axisColor} 0%, ${axisColor}CC 100%)`,
        }}
      />
      <div className="p-4">
        <div className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
          {course.durationBadge}
        </div>
        <div className="mt-1 text-base font-bold text-[#232322] group-hover:text-[var(--accent)]">
          {name}
        </div>
        <p className="mt-1 line-clamp-2 text-sm text-slate-600">{hook}</p>
      </div>
    </Link>
  );
}
