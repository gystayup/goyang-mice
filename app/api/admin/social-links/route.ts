import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/lib/auth";
import {
  readSocialLinks,
  writeSocialLinks,
  type SocialLinksData,
} from "@/lib/social-links-db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await readSocialLinks();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("social-links GET error:", error);
    return NextResponse.json(
      { success: false, error: "SNS 설정을 불러오지 못했습니다." },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ success: false, error: "권한이 없습니다." }, { status: 403 });
    }
    const body = (await request.json()) as Partial<SocialLinksData>;
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { success: false, error: "잘못된 요청 본문입니다." },
        { status: 400 }
      );
    }
    const current = await readSocialLinks();
    const next: SocialLinksData = {
      youtube: { ...current.youtube, ...(body.youtube ?? {}) },
      instagram: { ...current.instagram, ...(body.instagram ?? {}) },
      tiktok: { ...current.tiktok, ...(body.tiktok ?? {}) },
    };
    await writeSocialLinks(next);
    return NextResponse.json({ success: true, data: next });
  } catch (error) {
    console.error("social-links PUT error:", error);
    return NextResponse.json(
      { success: false, error: "SNS 설정 저장에 실패했습니다." },
      { status: 500 }
    );
  }
}
