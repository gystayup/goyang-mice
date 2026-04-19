import type { Metadata } from "next";
import { Link } from "@/lib/navigation";
import { ArrowRight, Calendar, Newspaper } from "lucide-react";

import { listPublishedArticles } from "@/lib/news-db";
import { NEWS_CATEGORY_LABELS, type NewsCategory } from "@/lib/news-types";

export const metadata: Metadata = {
  title: "뉴스 & 소식",
  description: "고양 문화관광·MICE 연구소의 최신 뉴스와 소식을 확인하세요.",
  alternates: {
    canonical: "/ko/news",
  },
};

export const dynamic = "force-dynamic";

const CATEGORY_COLORS: Record<NewsCategory, string> = {
  notice: "bg-blue-100 text-blue-700",
  press: "bg-orange-100 text-orange-700",
  event: "bg-green-100 text-green-700",
  research: "bg-purple-100 text-purple-700",
};

function formatDate(iso: string | null | undefined) {
  if (!iso) return "";
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

export default async function NewsPage() {
  const articles = await listPublishedArticles();
  const [featured, ...rest] = articles;
  const pressReleases = articles.filter((a) => a.category === "press").slice(0, 5);

  return (
    <div className="mx-auto max-w-7xl px-6 py-14 lg:py-18">
      {/* 페이지 헤더 */}
      <div className="mb-12 border-b border-slate-200 pb-10">
        <div className="flex items-center gap-3 text-slate-500">
          <Newspaper className="h-5 w-5" />
          <span className="text-sm font-semibold">News & Updates</span>
        </div>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-950 lg:text-5xl">
          뉴스 & 소식
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
          고양 문화관광·MICE 연구소의 최신 연구 성과, DMC 운영 실적, 협력 사례 등 다양한 소식을 전해드립니다.
        </p>
      </div>

      {articles.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-16 text-center">
          <p className="text-base text-slate-500">등록된 소식이 아직 없습니다.</p>
          <p className="mt-1 text-sm text-slate-400">관리자 페이지에서 첫 기사를 작성해 보세요.</p>
        </div>
      ) : (
        <div className="space-y-16">
          {/* Featured News */}
          {featured && (
            <section>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900">주요 소식</h2>
              </div>
              <Link
                href={`/news/${featured.slug}`}
                className="block overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 text-white transition hover:shadow-xl"
              >
                {featured.coverImageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={featured.coverImageUrl}
                    alt=""
                    className="h-64 w-full object-cover sm:h-80"
                  />
                )}
                <div className="p-8 lg:p-12">
                  <div className="mb-4 flex items-center gap-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${CATEGORY_COLORS[featured.category]}`}
                    >
                      {NEWS_CATEGORY_LABELS[featured.category]}
                    </span>
                    <div className="flex items-center gap-1 text-sm text-slate-300">
                      <Calendar className="h-4 w-4" />
                      {formatDate(featured.publishedAt || featured.createdAt)}
                    </div>
                  </div>
                  <h3 className="mb-4 text-2xl font-bold lg:text-3xl">{featured.title}</h3>
                  {featured.subtitle && (
                    <p className="mb-6 max-w-2xl text-lg text-slate-300">{featured.subtitle}</p>
                  )}
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-6 py-3 text-sm font-semibold hover:bg-white/20">
                    자세히 보기 <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            </section>
          )}

          {/* Rest */}
          {rest.length > 0 && (
            <section>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900">최신 소식</h2>
              </div>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {rest.map((item) => (
                  <Link
                    key={item.id}
                    href={`/news/${item.slug}`}
                    className="block rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-lg"
                  >
                    {item.coverImageUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.coverImageUrl}
                        alt=""
                        className="h-40 w-full rounded-t-2xl object-cover"
                      />
                    )}
                    <div className="p-6">
                      <div className="mb-4 flex items-center gap-3">
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-semibold ${CATEGORY_COLORS[item.category]}`}
                        >
                          {NEWS_CATEGORY_LABELS[item.category]}
                        </span>
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                          <Calendar className="h-3 w-3" />
                          {formatDate(item.publishedAt || item.createdAt)}
                        </div>
                      </div>
                      <h3 className="mb-3 line-clamp-2 text-lg font-semibold text-slate-900">
                        {item.title}
                      </h3>
                      {item.subtitle && (
                        <p className="line-clamp-3 text-sm text-slate-600">{item.subtitle}</p>
                      )}
                      <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-blue-600">
                        자세히 보기 <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Press Releases shortcut */}
          {pressReleases.length > 0 && (
            <section>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900">언론보도</h2>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-8">
                <div className="space-y-2">
                  {pressReleases.map((item) => (
                    <Link
                      key={item.id}
                      href={`/news/${item.slug}`}
                      className="flex items-center justify-between rounded-lg border-b border-slate-100 py-4 last:border-b-0 hover:bg-slate-50"
                    >
                      <div>
                        <h4 className="mb-1 font-semibold text-slate-900">{item.title}</h4>
                        <div className="flex items-center gap-4 text-sm text-slate-600">
                          <span>{NEWS_CATEGORY_LABELS[item.category]}</span>
                          <span>{formatDate(item.publishedAt || item.createdAt)}</span>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-slate-400" />
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
