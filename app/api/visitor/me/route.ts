import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { findVisitorById, updateVisitorProfile } from "@/lib/visitors-db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type SessionUser = { id?: string; kind?: "admin" | "visitor" };

async function requireVisitor() {
  const session = await auth();
  const u = session?.user as SessionUser | undefined;
  if (!u || u.kind !== "visitor" || !u.id) return null;
  return u.id;
}

export async function GET() {
  try {
    const visitorId = await requireVisitor();
    if (!visitorId) {
      return NextResponse.json({ success: false, error: "로그인이 필요합니다." }, { status: 401 });
    }
    const visitor = await findVisitorById(visitorId);
    if (!visitor) {
      return NextResponse.json(
        { success: false, error: "방문자 정보를 찾을 수 없습니다." },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: visitor });
  } catch (error) {
    console.error("visitor me GET error:", error);
    return NextResponse.json(
      { success: false, error: "정보를 불러오지 못했습니다." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const visitorId = await requireVisitor();
    if (!visitorId) {
      return NextResponse.json({ success: false, error: "로그인이 필요합니다." }, { status: 401 });
    }
    const body = (await request.json()) as {
      name?: string;
      phone?: string;
      marketingAgree?: boolean;
    };
    const updated = await updateVisitorProfile(visitorId, body);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "방문자 정보를 찾을 수 없습니다." },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("visitor me PATCH error:", error);
    return NextResponse.json(
      { success: false, error: "정보 수정에 실패했습니다." },
      { status: 500 }
    );
  }
}
