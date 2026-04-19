import { notFound } from "next/navigation";

import Shell from "@/components/layout/Shell";
import { Link } from "@/lib/navigation";
import { ArrowLeft, Calendar, Newspaper } from "lucide-react";

import { getArticleById, getPublishedArticleBySlug } from "@/lib/news-db";
import { NEWS_CATEGORY_LABELS } from "@/lib/news-types";

export const dynamic = "force-dynamic";

function formatDate(iso: string | null | undefined) {
  if (!iso) return "";
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

export default async function LocaleNewsDetailPage(props: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { id } = await props.params;

  // id 파라미터는 실제로 "slug" 로 사용합니다 (URL: /ko/news/[slug]).
  // 과거 1~6 숫자 링크 호환용으로 id lookup 도 시도합니다.
  const article =
    (await getPublishedArticleBySlug(id)) || (await getArticleById(id));
  if (!article || article.status !== "PUBLISHED") notFound();

  const paragraphs = article.body.split(/\n{2,}/);

  return (
    <Shell>
      <article className="mx-auto max-w-4xl px-6 py-16">
        <div className="flex items-center gap-3 text-sm text-slate-500">
          <Newspaper className="h-4 w-4" />
          <span>{NEWS_CATEGORY_LABELS[article.category]}</span>
          <span className="text-slate-300">/</span>
          <Calendar className="h-4 w-4" />
          <span>{formatDate(article.publishedAt || article.createdAt)}</span>
        </div>

        <h1 className="mt-6 text-4xl font-black tracking-tight text-slate-950">
          {article.title}
        </h1>
        {article.subtitle && (
          <p className="mt-4 text-lg leading-8 text-slate-600">{article.subtitle}</p>
        )}

        {article.coverImageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={article.coverImageUrl}
            alt=""
            className="mt-10 w-full rounded-[28px] border border-slate-200 object-cover shadow-soft"
          />
        )}

        <div className="mt-10 space-y-6 text-base leading-8 text-slate-700">
          {paragraphs.map((p, i) => (
            <p key={i} className="whitespace-pre-line">
              {p}
            </p>
          ))}
        </div>

        {article.tags && article.tags.length > 0 && (
          <div className="mt-10 flex flex-wrap gap-2">
            {article.tags.map((t) => (
              <span
                key={t}
                className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
              >
                #{t}
              </span>
            ))}
          </div>
        )}

        <div className="mt-12">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <ArrowLeft className="h-4 w-4" />
            뉴스 목록으로 돌아가기
          </Link>
        </div>
      </article>
    </Shell>
  );
}
