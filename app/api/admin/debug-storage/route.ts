import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    return NextResponse.json({ error: "env vars missing", url: !!url, key: !!key });
  }

  const supabase = createClient(url, key);

  // 1. 버킷 목록 확인
  const { data: buckets, error: listErr } = await supabase.storage.listBuckets();

  // 2. uploads 버킷에 테스트 업로드
  const testContent = Buffer.from("test");
  const { error: uploadErr } = await supabase.storage
    .from("uploads")
    .upload("debug-test.txt", testContent, { contentType: "text/plain", upsert: true });

  // 3. pages 테이블 확인
  const { data: pagesData, error: pagesErr } = await supabase
    .from("pages")
    .select("id")
    .limit(1);

  return NextResponse.json({
    supabaseUrl: url,
    buckets: buckets?.map((b) => b.name) ?? [],
    listError: listErr?.message ?? null,
    uploadError: uploadErr?.message ?? null,
    pagesOk: !pagesErr,
    pagesError: pagesErr?.message ?? null,
  });
}
