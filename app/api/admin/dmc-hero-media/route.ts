import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/lib/auth";
import {
  clearDmcHeroMedia,
  readDmcHeroMedia,
  saveDmcHeroMediaFile,
} from "@/lib/dmc-hero-media";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function requireAdmin() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ success: false, error: "권한이 없습니다." }, { status: 403 });
  }
  return null;
}

const allowedMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "video/mp4",
  "video/webm",
  "video/quicktime",
];

const maxFileSize = 60 * 1024 * 1024;

export async function GET() {
  try {
    const media = await readDmcHeroMedia();
    return NextResponse.json({ success: true, data: media });
  } catch (error) {
    console.error("DMC hero media GET error:", error);
    return NextResponse.json(
      { success: false, error: "DMC 미디어 정보를 불러오지 못했습니다." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { success: false, error: "업로드할 파일을 선택해 주세요." },
        { status: 400 }
      );
    }

    if (!allowedMimeTypes.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: "이미지(JPG, PNG, WEBP, GIF) 또는 영상(MP4, WEBM, MOV)만 업로드할 수 있습니다.",
        },
        { status: 400 }
      );
    }

    if (file.size > maxFileSize) {
      return NextResponse.json(
        { success: false, error: "파일 용량은 60MB 이하만 업로드할 수 있습니다." },
        { status: 400 }
      );
    }

    const media = await saveDmcHeroMediaFile(file);
    return NextResponse.json({
      success: true,
      message: "DMC 상단 미디어가 업데이트되었습니다.",
      data: media,
    });
  } catch (error) {
    console.error("DMC hero media POST error:", error);
    return NextResponse.json(
      { success: false, error: "DMC 미디어 업로드 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const denied = await requireAdmin();
  if (denied) return denied;
  try {
    const media = await clearDmcHeroMedia();
    return NextResponse.json({
      success: true,
      message: "DMC 상단 미디어를 삭제했습니다.",
      data: media,
    });
  } catch (error) {
    console.error("DMC hero media DELETE error:", error);
    return NextResponse.json(
      { success: false, error: "DMC 미디어 삭제 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
