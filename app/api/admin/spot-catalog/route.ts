// app/api/admin/spot-catalog/route.ts — 오더 #C54 admin 스팟 CRUD API.
//
// ticket-catalog route.ts 패턴 미러. Supabase pages 테이블 (pageKey='spot-catalog').

import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/lib/auth";
import type { Spot } from "@/data/spots";
import {
  addSpotItem,
  deleteSpotItem,
  readSpotCatalog,
  updateSpotItem,
} from "@/lib/spot-catalog-db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function requireAdmin() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ success: false, error: "권한이 없습니다." }, { status: 403 });
  }
  return null;
}

// GET — 전체 스팟 목록 조회
export async function GET() {
  try {
    const spots = await readSpotCatalog();
    return NextResponse.json({ success: true, data: spots });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

// POST — 스팟 추가
export async function POST(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  try {
    const body = (await request.json()) as { item: Spot };
    if (!body.item?.slug || !body.item?.title) {
      return NextResponse.json(
        { success: false, error: "slug와 title은 필수입니다." },
        { status: 400 }
      );
    }
    const spots = await addSpotItem(body.item);
    return NextResponse.json({ success: true, data: spots });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

// PUT — 스팟 수정
export async function PUT(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  try {
    const body = (await request.json()) as { item: Spot };
    const spots = await updateSpotItem(body.item);
    return NextResponse.json({ success: true, data: spots });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

// DELETE — 스팟 삭제 (slug 기준)
export async function DELETE(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");
    if (!slug) {
      return NextResponse.json({ success: false, error: "slug가 필요합니다." }, { status: 400 });
    }
    const spots = await deleteSpotItem(slug);
    return NextResponse.json({ success: true, data: spots });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
