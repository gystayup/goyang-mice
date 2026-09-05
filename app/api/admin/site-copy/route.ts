// app/api/admin/site-copy/route.ts — 오더 #C60 admin 사이트 문안 CRUD API.
//
// spot-catalog route.ts 패턴 미러. Supabase pages 테이블 (pageKey='site-copy').
// GET 공개 (홈/푸터/TrustBar 읽기 · 인증 검증 없이 노출용 값). PUT admin 전용.

import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/lib/auth";
import { readSiteCopy, writeSiteCopy } from "@/lib/site-copy-db";
import type { SiteCopy } from "@/data/site-copy-defaults";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function requireAdmin() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ success: false, error: "권한이 없습니다." }, { status: 403 });
  }
  return null;
}

// GET — 현행 사이트 문안 (관리자 UI 초기 로드용).
export async function GET() {
  try {
    const data = await readSiteCopy();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

// PUT — 사이트 문안 전체 저장 (upsert).
export async function PUT(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  try {
    const body = (await request.json()) as { data?: SiteCopy };
    if (!body.data || typeof body.data !== "object") {
      return NextResponse.json(
        { success: false, error: "SiteCopy 객체가 필요합니다." },
        { status: 400 }
      );
    }
    await writeSiteCopy(body.data);
    const saved = await readSiteCopy();
    return NextResponse.json({ success: true, data: saved });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
