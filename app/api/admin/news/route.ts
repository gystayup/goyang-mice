import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/lib/auth";
import {
  createArticle,
  listAllArticles,
  type CreateArticleInput,
  type NewsCategory,
  type NewsStatus,
} from "@/lib/news-db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json(
        { success: false, error: "관리자 권한이 필요합니다." },
        { status: 401 }
      );
    }
    const items = await listAllArticles();
    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("news GET error:", msg);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json(
        { success: false, error: "관리자 권한이 필요합니다." },
        { status: 401 }
      );
    }
    const body = (await request.json()) as Partial<CreateArticleInput>;
    if (!body.title?.trim() || !body.body?.trim() || !body.category || !body.status) {
      return NextResponse.json(
        { success: false, error: "제목·본문·카테고리·상태는 필수입니다." },
        { status: 400 }
      );
    }
    const input: CreateArticleInput = {
      title: body.title.trim(),
      subtitle: body.subtitle?.trim() || undefined,
      body: body.body,
      category: body.category as NewsCategory,
      status: body.status as NewsStatus,
      tags: Array.isArray(body.tags) ? body.tags : [],
      coverImageUrl: body.coverImageUrl,
      coverImageFileName: body.coverImageFileName,
      publishedAt: body.publishedAt ?? null,
    };
    const article = await createArticle(input);
    return NextResponse.json({ success: true, data: article });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("news POST error:", msg);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
