import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ArchiveBody = {
  id?: string;
  issue: string;
  season: string;
  title: string;
  desc: string;
  gradient: string;
  posterUrl?: string;
  fileUrl?: string;
  fileName?: string;
  categoryTag?: string;
  authors?: string;
  publishDate?: string;
};

function buildContent(body: ArchiveBody) {
  return JSON.stringify({
    issue: body.issue,
    season: body.season,
    gradient: body.gradient,
    posterUrl: body.posterUrl ?? "",
    fileUrl: body.fileUrl ?? "",
    fileName: body.fileName ?? "",
    categoryTag: body.categoryTag ?? "",
    authors: body.authors ?? "",
    publishDate: body.publishDate ?? "",
  });
}

function buildSlug(issue: string) {
  const base = issue.toLowerCase().replace(/\./g, "-").replace(/\s+/g, "-");
  return `${base}-${Date.now().toString(36)}`;
}

export async function GET() {
  try {
    const items = await prisma.post.findMany({
      where: { category: "ARCHIVE" },
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    console.error("Research archives GET error:", error);
    const message = error instanceof Error ? error.message : "불러오기 실패";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ArchiveBody;

    const item = await prisma.post.create({
      data: {
        category: "ARCHIVE",
        title: body.title,
        slug: buildSlug(body.issue),
        summary: body.desc,
        content: buildContent(body),
        status: "PUBLISHED",
        lang: "ko",
        publishedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, data: item });
  } catch (error) {
    console.error("Research archives POST error:", error);
    const message = error instanceof Error ? error.message : "저장 실패";
    return NextResponse.json({ success: false, error: `저장 실패: ${message}` }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = (await request.json()) as ArchiveBody;
    if (!body.id) {
      return NextResponse.json({ success: false, error: "id가 필요합니다." }, { status: 400 });
    }

    const item = await prisma.post.update({
      where: { id: body.id },
      data: {
        title: body.title,
        summary: body.desc,
        content: buildContent(body),
      },
    });

    return NextResponse.json({ success: true, data: item });
  } catch (error) {
    console.error("Research archives PUT error:", error);
    const message = error instanceof Error ? error.message : "수정 실패";
    return NextResponse.json({ success: false, error: `수정 실패: ${message}` }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = (await request.json()) as { id: string };
    await prisma.post.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Research archives DELETE error:", error);
    const message = error instanceof Error ? error.message : "삭제 실패";
    return NextResponse.json({ success: false, error: `삭제 실패: ${message}` }, { status: 500 });
  }
}
