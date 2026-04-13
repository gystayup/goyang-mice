/**
 * Storage 유틸 - 로컬 또는 Supabase Storage 선택
 * UPLOAD_SERVICE=supabase 이면 Supabase, 그 외는 로컬 파일 시스템 사용
 */
import { createClient } from "@supabase/supabase-js";

const UPLOAD_SERVICE = process.env.UPLOAD_SERVICE || "local";

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase 환경변수가 설정되지 않았습니다.");
  return createClient(url, key);
}

export async function uploadFile(
  buffer: Buffer,
  filename: string,
  mimeType: string,
  category: string
): Promise<string> {
  if (UPLOAD_SERVICE === "supabase") {
    const supabase = getSupabaseClient();
    const path = `admin/${category}/${filename}`;
    const { error } = await supabase.storage
      .from("goyang mice")
      .upload(path, buffer, { contentType: mimeType, upsert: false });
    if (error) throw new Error(error.message);
    const { data } = supabase.storage.from("goyang mice").getPublicUrl(path);
    return data.publicUrl;
  }

  // 로컬 저장
  const fs = await import("fs");
  const pathModule = await import("path");
  const dir = pathModule.join(process.cwd(), "public", "uploads", "admin", category);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(pathModule.join(dir, filename), buffer);
  return `/uploads/admin/${category}/${filename}`;
}

export async function deleteFile(filename: string, category: string): Promise<void> {
  if (UPLOAD_SERVICE === "supabase") {
    const supabase = getSupabaseClient();
    await supabase.storage.from("goyang mice").remove([`admin/${category}/${filename}`]);
    return;
  }

  const fs = await import("fs");
  const pathModule = await import("path");
  const filePath = pathModule.join(process.cwd(), "public", "uploads", "admin", category, filename);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
}

export async function listFiles(category: string): Promise<Array<{ filename: string; url: string; size: number; createdAt: Date }>> {
  if (UPLOAD_SERVICE === "supabase") {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.storage.from("goyang mice").list(`admin/${category}`);
    if (error) throw new Error(error.message);
    return (data ?? []).map((f) => {
      const { data: urlData } = supabase.storage
        .from("goyang mice")
        .getPublicUrl(`admin/${category}/${f.name}`);
      return {
        filename: f.name,
        url: urlData.publicUrl,
        size: f.metadata?.size ?? 0,
        createdAt: new Date(f.created_at ?? Date.now()),
      };
    });
  }

  const fs = await import("fs");
  const pathModule = await import("path");
  const dir = pathModule.join(process.cwd(), "public", "uploads", "admin", category);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).map((filename) => {
    const stat = fs.statSync(pathModule.join(dir, filename));
    return {
      filename,
      url: `/uploads/admin/${category}/${filename}`,
      size: stat.size,
      createdAt: stat.birthtime,
    };
  }).reverse();
}
