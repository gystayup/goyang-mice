import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/lib/auth";
import type { TicketProduct } from "@/data/ticket-booking";
import {
  addTicketItem,
  deleteTicketItem,
  readTicketCatalog,
  updateTicketItem,
} from "@/lib/ticket-catalog-db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function requireAdmin() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ success: false, error: "권한이 없습니다." }, { status: 403 });
  }
  return null;
}

// GET — 전체 티켓 목록 조회
export async function GET() {
  try {
    const tickets = await readTicketCatalog();
    return NextResponse.json({ success: true, data: tickets });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

// POST — 티켓 추가
export async function POST(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  try {
    const body = (await request.json()) as { item: TicketProduct };
    if (!body.item?.id || !body.item?.title) {
      return NextResponse.json(
        { success: false, error: "id와 title은 필수입니다." },
        { status: 400 }
      );
    }
    const tickets = await addTicketItem(body.item);
    return NextResponse.json({ success: true, data: tickets });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

// PUT — 티켓 수정
export async function PUT(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  try {
    const body = (await request.json()) as { item: TicketProduct };
    const tickets = await updateTicketItem(body.item);
    return NextResponse.json({ success: true, data: tickets });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

// DELETE — 티켓 삭제
export async function DELETE(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, error: "id가 필요합니다." }, { status: 400 });
    }
    const tickets = await deleteTicketItem(id);
    return NextResponse.json({ success: true, data: tickets });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
