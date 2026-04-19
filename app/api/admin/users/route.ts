import { NextResponse } from "next/server";

import { isSuperAdmin } from "@/lib/auth";
import {
  createAdminUser,
  listPublicAdminUsers,
  type AdminRole,
  type AdminStatus,
} from "@/lib/admin-users-db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ROLES: AdminRole[] = ["SUPER_ADMIN", "OPERATOR", "EDITOR", "PARTNER_MANAGER"];
const STATUSES: AdminStatus[] = ["ACTIVE", "INACTIVE"];

export async function GET() {
  try {
    if (!(await isSuperAdmin())) {
      return NextResponse.json({ success: false, error: "권한이 없습니다." }, { status: 403 });
    }
    const users = await listPublicAdminUsers();
    return NextResponse.json({ success: true, data: users });
  } catch (error) {
    console.error("admin users GET error:", error);
    return NextResponse.json(
      { success: false, error: "관리자 목록을 불러오지 못했습니다." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    if (!(await isSuperAdmin())) {
      return NextResponse.json({ success: false, error: "권한이 없습니다." }, { status: 403 });
    }
    const body = (await request.json()) as {
      email?: string;
      name?: string;
      role?: AdminRole;
      password?: string;
      status?: AdminStatus;
    };
    if (!body.email || !body.name || !body.password || !body.role) {
      return NextResponse.json(
        { success: false, error: "이메일 · 이름 · 역할 · 비밀번호는 필수입니다." },
        { status: 400 }
      );
    }
    if (!ROLES.includes(body.role)) {
      return NextResponse.json({ success: false, error: "잘못된 역할입니다." }, { status: 400 });
    }
    if (body.status && !STATUSES.includes(body.status)) {
      return NextResponse.json({ success: false, error: "잘못된 상태입니다." }, { status: 400 });
    }
    if (body.password.length < 6) {
      return NextResponse.json(
        { success: false, error: "비밀번호는 6자 이상이어야 합니다." },
        { status: 400 }
      );
    }
    const created = await createAdminUser({
      email: body.email,
      name: body.name,
      role: body.role,
      password: body.password,
      status: body.status,
    });
    return NextResponse.json({ success: true, data: created });
  } catch (error) {
    console.error("admin users POST error:", error);
    const message = error instanceof Error ? error.message : "관리자 계정 추가에 실패했습니다.";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
