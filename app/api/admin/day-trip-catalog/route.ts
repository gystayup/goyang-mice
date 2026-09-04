// app/api/admin/day-trip-catalog/route.ts — 오더 #C57 [1] 당일코스 CRUD API.
//
// spot-catalog route.ts 패턴 미러. Supabase pages 테이블 (pageKey='day-trip-catalog').

import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/lib/auth";
import type { DayTripCourse } from "@/data/day-trip-courses";
import {
  addDayTripCourse,
  deleteDayTripCourse,
  readDayTripCatalog,
  updateDayTripCourse,
} from "@/lib/day-trip-catalog-db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function requireAdmin() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ success: false, error: "권한이 없습니다." }, { status: 403 });
  }
  return null;
}

// GET — 전체 코스 목록 조회
export async function GET() {
  try {
    const courses = await readDayTripCatalog();
    return NextResponse.json({ success: true, data: courses });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

// POST — 코스 추가
export async function POST(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  try {
    const body = (await request.json()) as { item: DayTripCourse };
    if (!body.item?.id || !body.item?.name) {
      return NextResponse.json(
        { success: false, error: "id와 name은 필수입니다." },
        { status: 400 }
      );
    }
    const courses = await addDayTripCourse(body.item);
    return NextResponse.json({ success: true, data: courses });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

// PUT — 코스 수정
export async function PUT(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  try {
    const body = (await request.json()) as { item: DayTripCourse };
    const courses = await updateDayTripCourse(body.item);
    return NextResponse.json({ success: true, data: courses });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

// DELETE — 코스 삭제 (id 기준)
export async function DELETE(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, error: "id가 필요합니다." }, { status: 400 });
    }
    const courses = await deleteDayTripCourse(id);
    return NextResponse.json({ success: true, data: courses });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
