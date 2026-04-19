import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/lib/auth";
import {
  addDmcCustomCategory,
  deleteDmcCustomCategory,
  readDmcCustomCategories,
  updateDmcCustomCategoryImage,
} from "@/lib/dmc-custom-categories";

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
    const items = await readDmcCustomCategories();
    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    console.error("DMC custom categories GET error:", error);
    return NextResponse.json(
      { success: false, error: "사용자 정의 카테고리 정보를 불러오지 못했습니다." },
      { status: 500 }
    );
  }
}

// 새 카테고리 추가 (+ 최초 이미지 업로드 선택)
export async function POST(request: Request) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json(
        { success: false, error: "관리자 권한이 필요합니다." },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const label = String(formData.get("label") || "").trim();
    const description = String(formData.get("description") || "").trim();
    const file = formData.get("file");

    if (!label) {
      return NextResponse.json(
        { success: false, error: "카테고리 이름을 입력해 주세요." },
        { status: 400 }
      );
    }

    let uploadFile: File | undefined;
    if (file instanceof File && file.size > 0) {
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
      uploadFile = file;
    }

    const items = await addDmcCustomCategory({
      label,
      description: description || undefined,
      file: uploadFile,
    });

    return NextResponse.json({
      success: true,
      message: "카테고리가 추가되었습니다.",
      data: items,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("DMC custom categories POST error:", msg);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

// 기존 카테고리 이미지 변경
export async function PATCH(request: Request) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json(
        { success: false, error: "관리자 권한이 필요합니다." },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const slug = String(formData.get("slug") || "").trim();
    const file = formData.get("file");

    if (!slug) {
      return NextResponse.json(
        { success: false, error: "수정할 카테고리를 선택해 주세요." },
        { status: 400 }
      );
    }
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

    const items = await updateDmcCustomCategoryImage(slug, file);
    return NextResponse.json({
      success: true,
      message: "카테고리 이미지가 변경되었습니다.",
      data: items,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("DMC custom categories PATCH error:", msg);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json(
        { success: false, error: "관리자 권한이 필요합니다." },
        { status: 401 }
      );
    }
    const slug = new URL(request.url).searchParams.get("slug")?.trim();
    if (!slug) {
      return NextResponse.json(
        { success: false, error: "삭제할 카테고리를 선택해 주세요." },
        { status: 400 }
      );
    }
    const items = await deleteDmcCustomCategory(slug);
    return NextResponse.json({
      success: true,
      message: "카테고리를 삭제했습니다.",
      data: items,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("DMC custom categories DELETE error:", msg);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
