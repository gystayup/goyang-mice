import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/lib/auth";
import { sendNewsletter } from "@/lib/email";
import {
  getArticleById,
  markEmailSent,
  NEWS_CATEGORY_LABELS,
} from "@/lib/news-db";
import { listVisitors } from "@/lib/visitors-db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300; // 5분 — 대량 발송 대비

type Ctx = { params: Promise<{ id: string }> };

export async function POST(request: Request, ctx: Ctx) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json(
        { success: false, error: "관리자 권한이 필요합니다." },
        { status: 401 }
      );
    }

    const { id } = await ctx.params;
    const article = await getArticleById(id);
    if (!article) {
      return NextResponse.json(
        { success: false, error: "기사를 찾을 수 없습니다." },
        { status: 404 }
      );
    }
    if (article.status !== "PUBLISHED") {
      return NextResponse.json(
        { success: false, error: "공개 상태(PUBLISHED)인 기사만 발송할 수 있습니다." },
        { status: 400 }
      );
    }

    // 구독자 = marketingAgree=true 이고 이메일이 있는 방문자
    const visitors = await listVisitors();
    const recipients = Array.from(
      new Set(
        visitors
          .filter((v) => v.marketingAgree && v.email)
          .map((v) => v.email as string)
      )
    );

    if (recipients.length === 0) {
      return NextResponse.json({
        success: false,
        error: "뉴스레터 구독자가 없습니다.",
      });
    }

    const origin =
      process.env.NEXT_PUBLIC_SITE_URL ||
      new URL(request.url).origin;
    const articleUrl = `${origin}/ko/news/${article.slug}`;
    const unsubscribeBaseUrl = `${origin}/ko/mypage`;

    const result = await sendNewsletter(recipients, {
      title: article.title,
      subtitle: article.subtitle,
      body: article.body,
      coverImageUrl: article.coverImageUrl,
      categoryLabel: NEWS_CATEGORY_LABELS[article.category] ?? "소식",
      articleUrl,
      unsubscribeBaseUrl,
    });

    await markEmailSent(article.id, result.sent);

    return NextResponse.json({
      success: true,
      data: {
        total: recipients.length,
        sent: result.sent,
        failed: result.failed,
        errors: result.errors.slice(0, 10), // 상위 10건만
      },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("news send error:", msg);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
