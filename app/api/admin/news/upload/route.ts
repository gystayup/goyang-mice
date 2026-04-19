import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/lib/auth";
import { uploadCoverImage } from "@/lib/news-db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const maxFileSize = 20 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json(
        { success: false, error: "관리자 권한이 필요합니다." },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");
    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json(
        { success: false, error: "이미지를 선택해 주세요." },
        { status: 400 }
      );
    }
    if (!allowedMimeTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: "JPG, PNG, WEBP, GIF 이미지만 업로드할 수 있습니다." },
        { status: 400 }
      );
    }
    if (file.size > maxFileSize) {
      return NextResponse.json(
        { success: false, error: "이미지는 20MB 이하만 업로드할 수 있습니다." },
        { status: 400 }
      );
    }

    const result = await uploadCoverImage(file);
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("news upload error:", msg);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
