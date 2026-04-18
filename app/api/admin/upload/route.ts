import { NextRequest, NextResponse } from "next/server";
import { deleteFile, listFiles, uploadFile } from "@/lib/storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "application/pdf",
];
const MAX_SIZE = 100 * 1024 * 1024;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const category = (formData.get("category") as string) || "general";

    if (!(file instanceof File)) {
      return NextResponse.json({ success: false, error: "파일을 선택해 주세요." }, { status: 400 });
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: "이미지(JPG·PNG·WEBP·GIF), 영상(MP4·WEBM·MOV), PDF만 업로드할 수 있습니다." },
        { status: 400 }
      );
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ success: false, error: "파일 크기는 100MB 이하여야 합니다." }, { status: 400 });
    }

    const ext = file.name.split(".").pop() ?? "bin";
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    const url = await uploadFile(buffer, filename, file.type, category);

    return NextResponse.json({ success: true, url, filename, originalName: file.name, size: file.size, type: file.type });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ success: false, error: "업로드 중 오류가 발생했습니다." }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") || "general";
    const files = await listFiles(category);
    return NextResponse.json({ success: true, data: files });
  } catch (err) {
    console.error("List error:", err);
    return NextResponse.json({ success: false, error: "목록을 불러오지 못했습니다." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { filename, category = "general" } = await req.json();
    if (!filename || typeof filename !== "string" || filename.includes("..")) {
      return NextResponse.json({ success: false, error: "잘못된 파일명입니다." }, { status: 400 });
    }
    await deleteFile(filename, category);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: "삭제 중 오류가 발생했습니다." }, { status: 500 });
  }
}
