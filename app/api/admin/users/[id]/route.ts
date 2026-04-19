import { NextResponse } from "next/server";

import { isSuperAdmin } from "@/lib/auth";
import {
  deleteAdminUser,
  updateAdminUser,
  type AdminRole,
  type AdminStatus,
} from "@/lib/admin-users-db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ROLES: AdminRole[] = ["SUPER_ADMIN", "OPERATOR", "EDITOR", "PARTNER_MANAGER"];
const STATUSES: AdminStatus[] = ["ACTIVE", "INACTIVE"];

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await isSuperAdmin())) {
      return NextResponse.json({ success: false, error: "권한이 없습니다." }, { status: 403 });
    }
    const { id } = await params;
    const body = (await request.json()) as {
      name?: string;
      role?: AdminRole;
      status?: AdminStatus;
      password?: string;
    };
    if (body.role && !ROLES.includes(body.role)) {
      return NextResponse.json({ success: false, error: "잘못된 역할입니다." }, { status: 400 });
    }
    if (body.status && !STATUSES.includes(body.status)) {
      return NextResponse.json({ success: false, error: "잘못된 상태입니다." }, { status: 400 });
    }
    if (body.password !== undefined && body.password.length > 0 && body.password.length < 6) {
      return NextResponse.json(
        { success: false, error: "비밀번호는 6자 이상이어야 합니다." },
        { status: 400 }
      );
    }
    const updated = await updateAdminUser(id, body);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "해당 관리자를 찾을 수 없습니다." },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("admin users PATCH error:", error);
    const message = error instanceof Error ? error.message : "관리자 계정 수정에 실패했습니다.";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await isSuperAdmin())) {
      return NextResponse.json({ success: false, error: "권한이 없습니다." }, { status: 403 });
    }
    const { id } = await params;
    const ok = await deleteAdminUser(id);
    if (!ok) {
      return NextResponse.json(
        { success: false, error: "해당 관리자를 찾을 수 없습니다." },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("admin users DELETE error:", error);
    const message = error instanceof Error ? error.message : "관리자 계정 삭제에 실패했습니다.";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
