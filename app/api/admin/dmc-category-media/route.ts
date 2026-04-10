import { NextResponse } from "next/server";

import {
  clearDmcCategoryMediaFile,
  parseDmcCategoryKey,
  readDmcCategoryMediaMap,
  saveDmcCategoryMediaFile,
} from "@/lib/dmc-category-media";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const allowedMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

const maxFileSize = 20 * 1024 * 1024;

export async function GET() {
  try {
    const mediaMap = await readDmcCategoryMediaMap();
    return NextResponse.json({ success: true, data: mediaMap });
  } catch (error) {
    console.error("DMC category media GET error:", error);
    return NextResponse.json(
      { success: false, error: "카테고리 이미지 정보를 불러오지 못했습니다." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const categoryKey = parseDmcCategoryKey(String(formData.get("categoryKey") || ""));
    const file = formData.get("file");

    if (!categoryKey) {
      return NextResponse.json(
        { success: false, error: "이미지를 등록할 카테고리를 선택해 주세요." },
        { status: 400 }
      );
    }

    if (!(file instanceof File)) {
      return NextResponse.json(
        { success: false, error: "업로드할 이미지를 선택해 주세요." },
        { status: 400 }
      );
    }

    if (!allowedMimeTypes.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: "카테고리 카드는 JPG, PNG, WEBP, GIF 이미지 파일만 업로드할 수 있습니다.",
        },
        { status: 400 }
      );
    }

    if (file.size > maxFileSize) {
      return NextResponse.json(
        { success: false, error: "카테고리 이미지는 20MB 이하만 업로드할 수 있습니다." },
        { status: 400 }
      );
    }

    const mediaMap = await saveDmcCategoryMediaFile(categoryKey, file);
    return NextResponse.json({
      success: true,
      message: "카테고리 대표 이미지가 업데이트되었습니다.",
      data: mediaMap,
    });
  } catch (error) {
    console.error("DMC category media POST error:", error);
    return NextResponse.json(
      { success: false, error: "카테고리 이미지 업로드 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const categoryKey = parseDmcCategoryKey(
      new URL(request.url).searchParams.get("categoryKey")
    );

    if (!categoryKey) {
      return NextResponse.json(
        { success: false, error: "삭제할 카테고리를 선택해 주세요." },
        { status: 400 }
      );
    }

    const mediaMap = await clearDmcCategoryMediaFile(categoryKey);
    return NextResponse.json({
      success: true,
      message: "카테고리 대표 이미지를 삭제했습니다.",
      data: mediaMap,
    });
  } catch (error) {
    console.error("DMC category media DELETE error:", error);
    return NextResponse.json(
      { success: false, error: "카테고리 이미지 삭제 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
