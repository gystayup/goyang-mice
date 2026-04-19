import { Link } from "@/lib/navigation";
import { ArrowRight, Calendar, Newspaper } from "lucide-react";

import { listPublishedArticles } from "@/lib/news-db";
import { NEWS_CATEGORY_LABELS, type NewsCategory } from "@/lib/news-types";

const TITLES: Record<string, { title: string; subtitle: string; seeAll: string }> = {
  ko: {
    title: "연구소 소식",
    subtitle: "최근 발행된 공지와 연구 결과를 확인하세요",
    seeAll: "전체 소식 보기",
  },
  en: {
    title: "Latest News",
    subtitle: "Recent notices and research updates",
    seeAll: "See all news",
  },
  ja: {
    title: "最新ニュース",
    subtitle: "最近の公知と研究アップデート",
    seeAll: "すべてのニュースを見る",
  },
  "zh-CN": {
    title: "最新消息",
    subtitle: "查看最近的公告与研究动态",
    seeAll: "查看全部消息",
  },
  "zh-TW": {
    title: "最新消息",
    subtitle: "查看最近的公告與研究動態",
    seeAll: "查看全部消息",
  },
};

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

export default async function NewsSection({ locale }: { locale: string }) {
  const copy = TITLES[locale] ?? TITLES.ko;
  const items = await listPublishedArticles({ limit: 3 });
  if (items.length === 0) return null;

  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-slate-500">
              <Newspaper className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">News</span>
            </div>
            <h2 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">{copy.title}</h2>
            <p className="mt-2 text-sm text-slate-600 sm:text-base">{copy.subtitle}</p>
          </div>
          <Link
            href="/news"
            className="hidden items-center gap-1 rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 sm:inline-flex"
          >
            {copy.seeAll} <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {items.map((item) => (
            <Link
              key={item.id}
              href={`/news/${item.slug}`}
              className="block overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-lg"
            >
              {item.coverImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.coverImageUrl}
                  alt=""
                  className="h-40 w-full object-cover"
                />
              ) : (
                <div className="h-40 w-full bg-gradient-to-br from-slate-100 to-slate-200" />
              )}
              <div className="p-6">
                <div className="mb-3 flex items-center gap-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${CATEGORY_COLORS[item.category]}`}
                  >
                    {NEWS_CATEGORY_LABELS[item.category]}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-slate-500">
                    <Calendar className="h-3 w-3" />
                    {formatDate(item.publishedAt || item.createdAt)}
                  </div>
                </div>
                <h3 className="line-clamp-2 text-base font-semibold text-slate-900">
                  {item.title}
                </h3>
                {item.subtitle && (
                  <p className="mt-2 line-clamp-2 text-sm text-slate-600">{item.subtitle}</p>
                )}
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/news"
            className="inline-flex items-center gap-1 rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            {copy.seeAll} <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </section>
  );
}
