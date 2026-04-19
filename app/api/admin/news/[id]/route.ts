import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/lib/auth";
import {
  deleteArticle,
  getArticleById,
  updateArticle,
  type UpdateArticleInput,
} from "@/lib/news-db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: Ctx) {
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
    return NextResponse.json({ success: true, data: article });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function PATCH(request: Request, ctx: Ctx) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json(
        { success: false, error: "관리자 권한이 필요합니다." },
        { status: 401 }
      );
    }
    const { id } = await ctx.params;
    const patch = (await request.json()) as UpdateArticleInput;
    const updated = await updateArticle(id, patch);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "기사를 찾을 수 없습니다." },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function DELETE(_req: Request, ctx: Ctx) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json(
        { success: false, error: "관리자 권한이 필요합니다." },
        { status: 401 }
      );
    }
    const { id } = await ctx.params;
    await deleteArticle(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
