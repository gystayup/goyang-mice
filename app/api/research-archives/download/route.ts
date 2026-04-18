import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    const loginUrl = new URL("/admin/login", req.url);
    loginUrl.searchParams.set("callbackUrl", req.url);
    return NextResponse.redirect(loginUrl);
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ success: false, error: "id가 필요합니다." }, { status: 400 });
  }

  try {
    const post = await prisma.post.findUnique({ where: { id } });
    if (!post || post.category !== "ARCHIVE") {
      return NextResponse.json({ success: false, error: "자료를 찾을 수 없습니다." }, { status: 404 });
    }

    let meta: { fileUrl?: string } = {};
    try {
      meta = JSON.parse(post.content) as { fileUrl?: string };
    } catch {
      // ignore
    }

    if (!meta.fileUrl) {
      return NextResponse.json({ success: false, error: "등록된 파일이 없습니다." }, { status: 404 });
    }

    return NextResponse.redirect(meta.fileUrl);
  } catch (error) {
    console.error("Download error:", error);
    const message = error instanceof Error ? error.message : "다운로드 실패";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
