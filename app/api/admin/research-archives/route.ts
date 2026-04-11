import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const items = await prisma.post.findMany({
      where: { category: "ARCHIVE" },
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    console.error("Research archives GET error:", error);
    return NextResponse.json({ success: false, error: "불러오기 실패" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      issue: string;
      season: string;
      title: string;
      desc: string;
      gradient: string;
    };

    const item = await prisma.post.create({
      data: {
        category: "ARCHIVE",
        title: body.title,
        slug: body.issue.toLowerCase().replace(".", "-"),
        summary: body.desc,
        content: JSON.stringify({
          issue: body.issue,
          season: body.season,
          gradient: body.gradient,
        }),
        status: "PUBLISHED",
        lang: "ko",
        publishedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, data: item });
  } catch (error) {
    console.error("Research archives POST error:", error);
    return NextResponse.json({ success: false, error: "저장 실패" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = (await request.json()) as {
      id: string;
      issue: string;
      season: string;
      title: string;
      desc: string;
      gradient: string;
    };

    const item = await prisma.post.update({
      where: { id: body.id },
      data: {
        title: body.title,
        slug: body.issue.toLowerCase().replace(".", "-"),
        summary: body.desc,
        content: JSON.stringify({
          issue: body.issue,
          season: body.season,
          gradient: body.gradient,
        }),
      },
    });

    return NextResponse.json({ success: true, data: item });
  } catch (error) {
    console.error("Research archives PUT error:", error);
    return NextResponse.json({ success: false, error: "수정 실패" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = (await request.json()) as { id: string };
    await prisma.post.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Research archives DELETE error:", error);
    return NextResponse.json({ success: false, error: "삭제 실패" }, { status: 500 });
  }
}
