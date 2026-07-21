import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PAGE_KEY = "hero-slides";

async function requireAdmin() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ success: false, error: "권한이 없습니다." }, { status: 403 });
  }
  return null;
}

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(url, key);
}

export async function GET() {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("pages")
      .select("*")
      .eq("pageKey", PAGE_KEY)
      .single();

    if (error) {
      console.error("Hero slides GET query error:", error);
      return NextResponse.json({ success: true, data: [], debug: error.message });
    }
    if (!data) {
      return NextResponse.json({ success: true, data: [], debug: "no data" });
    }
    // contentJson 키 다양한 케이스 대응
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const raw = data as any;
    const contentJson = raw.contentJson ?? raw.contentjson ?? raw["contentJson"] ?? null;
    const slides = Array.isArray(contentJson) ? contentJson : [];
    return NextResponse.json({ success: true, data: slides });
  } catch (error) {
    console.error("Hero slides GET error:", error);
    return NextResponse.json({ success: false, error: "불러오기 실패" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  try {
    const supabase = getSupabase();
    const body = (await request.json()) as { slides: Record<string, unknown>[] };

    const { data: existing } = await supabase
      .from("pages")
      .select("id")
      .eq("pageKey", PAGE_KEY)
      .single();

    if (existing) {
      await supabase
        .from("pages")
        .update({ contentJson: body.slides, status: "PUBLISHED", updatedAt: new Date().toISOString() })
        .eq("pageKey", PAGE_KEY);
    } else {
      await supabase.from("pages").insert({
        id: crypto.randomUUID(),
        pageKey: PAGE_KEY,
        title: "Hero Slides",
        slug: "hero-slides",
        contentJson: body.slides,
        status: "PUBLISHED",
        lang: "ko",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Hero slides PUT error:", error);
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: `저장 실패: ${msg}` }, { status: 500 });
  }
}
