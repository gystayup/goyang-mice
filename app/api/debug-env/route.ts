import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * 진단용: DATABASE_URL 상태 확인 (비밀번호 노출 없이)
 * 문제 해결 후 반드시 삭제할 것
 */
export async function GET() {
  const url = process.env.DATABASE_URL;
  const directUrl = process.env.DIRECT_URL;

  function analyze(value: string | undefined, name: string) {
    if (value === undefined) return { name, status: "UNDEFINED (변수 자체 없음)" };
    if (value === "") return { name, status: "EMPTY STRING" };
    return {
      name,
      length: value.length,
      startsWith: value.substring(0, 20),
      endsWith: value.substring(Math.max(0, value.length - 20)),
      protocolOk: value.startsWith("postgresql://") || value.startsWith("postgres://"),
      hasLeadingSpace: value !== value.trimStart(),
      hasTrailingSpace: value !== value.trimEnd(),
      firstCharCode: value.charCodeAt(0),
      startsWithQuote: value.startsWith('"') || value.startsWith("'"),
    };
  }

  return NextResponse.json({
    DATABASE_URL: analyze(url, "DATABASE_URL"),
    DIRECT_URL: analyze(directUrl, "DIRECT_URL"),
    NODE_ENV: process.env.NODE_ENV,
    VERCEL_ENV: process.env.VERCEL_ENV,
    timestamp: new Date().toISOString(),
  });
}
