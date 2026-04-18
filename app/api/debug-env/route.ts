import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * 진단용: DATABASE_URL 호스트명 확인
 * 문제 해결 후 반드시 삭제할 것
 */
export async function GET() {
  const url = process.env.DATABASE_URL;
  const directUrl = process.env.DIRECT_URL;

  function analyze(value: string | undefined, name: string) {
    if (value === undefined) return { name, status: "UNDEFINED" };
    if (value === "") return { name, status: "EMPTY" };

    // 호스트명만 추출 (비밀번호 노출 방지)
    let host = "";
    try {
      const match = value.match(/@([^:/]+)/);
      host = match ? match[1] : "UNPARSEABLE";
    } catch {
      host = "ERROR";
    }

    // 포트 추출
    let port = "";
    try {
      const match = value.match(/:(\d+)\//);
      port = match ? match[1] : "";
    } catch {
      port = "";
    }

    // 사용자명 추출
    let username = "";
    try {
      const match = value.match(/\/\/([^:]+):/);
      username = match ? match[1] : "";
    } catch {
      username = "";
    }

    return {
      name,
      length: value.length,
      protocolOk: value.startsWith("postgresql://") || value.startsWith("postgres://"),
      username,
      host,
      port,
      hasPgbouncer: value.includes("pgbouncer=true"),
    };
  }

  return NextResponse.json({
    DATABASE_URL: analyze(url, "DATABASE_URL"),
    DIRECT_URL: analyze(directUrl, "DIRECT_URL"),
    VERCEL_ENV: process.env.VERCEL_ENV,
    VERCEL_DEPLOYMENT_ID: process.env.VERCEL_DEPLOYMENT_ID,
    timestamp: new Date().toISOString(),
  });
}
