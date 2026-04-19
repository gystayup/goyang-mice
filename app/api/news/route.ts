import { NextResponse } from "next/server";

import { listPublishedArticles, type NewsCategory } from "@/lib/news-db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const VALID_CATS: NewsCategory[] = ["notice", "press", "event", "research"];

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const catRaw = url.searchParams.get("category");
    const limitRaw = url.searchParams.get("limit");
    const category =
      catRaw && (VALID_CATS as string[]).includes(catRaw)
        ? (catRaw as NewsCategory)
        : undefined;
    const limit = limitRaw ? Math.max(1, Math.min(100, Number(limitRaw) || 0)) : undefined;
    const items = await listPublishedArticles({ category, limit });
    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
