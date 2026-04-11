import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PAGE_KEY = "hero-slides";

export async function GET() {
  try {
    const page = await prisma.page.findUnique({
      where: { pageKey: PAGE_KEY },
    });
    if (!page) {
      return NextResponse.json({ success: true, data: [] });
    }
    const slides = Array.isArray(page.contentJson) ? page.contentJson : [];
    return NextResponse.json({ success: true, data: slides });
  } catch (error) {
    console.error("Hero slides GET error:", error);
    return NextResponse.json({ success: false, error: "불러오기 실패" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = (await request.json()) as { slides: unknown[] };
    const page = await prisma.page.upsert({
      where: { pageKey: PAGE_KEY },
      update: {
        contentJson: body.slides,
        status: "PUBLISHED",
      },
      create: {
        pageKey: PAGE_KEY,
        title: "Hero Slides",
        slug: "hero-slides",
        contentJson: body.slides,
        status: "PUBLISHED",
        lang: "ko",
      },
    });
    return NextResponse.json({ success: true, data: page });
  } catch (error) {
    console.error("Hero slides PUT error:", error);
    return NextResponse.json({ success: false, error: "저장 실패" }, { status: 500 });
  }
}
