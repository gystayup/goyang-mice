// scripts/c54-seed-spot-catalog.mjs — 오더 #C54 스팟 카탈로그 1회 시드.
//
// data/spots.ts 배열 (69곳) 을 Supabase pages 테이블에 pageKey='spot-catalog'
// contentJson 배열로 upsert. Prisma·마이그레이션 없음.
//
// 실행: `node scripts/c54-seed-spot-catalog.mjs`
// 환경변수: .env.local 의 NEXT_PUBLIC_SUPABASE_URL · SUPABASE_SERVICE_ROLE_KEY

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { register } from "node:module";

// .env.local parse
const envFile = readFileSync(path.join(process.cwd(), ".env.local"), "utf-8");
const env = {};
envFile.split("\n").forEach((line) => {
  const m = line.match(/^([A-Z_]+)=(.*)$/);
  if (m) env[m[1]] = m[2].replace(/^['"]|['"]$/g, "");
});

const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("Missing Supabase env in .env.local");
  process.exit(1);
}

// data/spots.ts 를 로드하기 위해 tsx 대신 tsconfig-paths + swc-node 를 시도.
// 간단히: TypeScript 파일을 dynamic import 하기 위해 tsx runtime 필요.
// 대신 정적 파일에서 spots 배열을 파싱: `export const spots: Spot[] = [`
// 부터 `];` 까지 텍스트를 잘라내면 유효 TS 코드. 대신 tsx 실행 시도.

// tsx 로 재실행 (재귀 방지 플래그)
if (!process.env._C54_TSX_LOADED) {
  const { spawnSync } = await import("node:child_process");
  const result = spawnSync(
    "npx",
    ["-y", "tsx", "scripts/c54-seed-spot-catalog.mjs"],
    { stdio: "inherit", env: { ...process.env, _C54_TSX_LOADED: "1" }, shell: true }
  );
  process.exit(result.status ?? 0);
}

// tsx 아래에서 실행. data/spots.ts 직접 import.
const spotsModule = await import(pathToFileURL(path.join(process.cwd(), "data", "spots.ts")).href);
const spots = spotsModule.spots;

if (!Array.isArray(spots) || spots.length === 0) {
  console.error("data/spots.ts 에서 spots 배열을 불러오지 못했습니다.");
  process.exit(1);
}

console.log(`data/spots.ts 로드: ${spots.length}건`);

const supabase = createClient(url, key);
const PAGE_KEY = "spot-catalog";

const { data: existing } = await supabase
  .from("pages")
  .select("id")
  .eq("pageKey", PAGE_KEY)
  .maybeSingle();

const now = new Date().toISOString();

if (existing) {
  const { error } = await supabase
    .from("pages")
    .update({ contentJson: spots, updatedAt: now })
    .eq("pageKey", PAGE_KEY);
  if (error) {
    console.error("update 실패:", error.message);
    process.exit(1);
  }
  console.log(`✓ 기존 row 업데이트 완료 (${spots.length}건 upsert)`);
} else {
  const { error } = await supabase.from("pages").insert({
    id: crypto.randomUUID(),
    pageKey: PAGE_KEY,
    title: "Spot Catalog",
    slug: PAGE_KEY,
    contentJson: spots,
    status: "PUBLISHED",
    lang: "ko",
    createdAt: now,
    updatedAt: now,
  });
  if (error) {
    console.error("insert 실패:", error.message);
    process.exit(1);
  }
  console.log(`✓ 신규 row 생성 완료 (${spots.length}건 삽입)`);
}

// 검증: 다시 읽어서 건수 확인
const { data: check } = await supabase
  .from("pages")
  .select("contentJson")
  .eq("pageKey", PAGE_KEY)
  .single();
const dbCount = Array.isArray(check?.contentJson) ? check.contentJson.length : 0;
console.log(`✓ DB 조회 검증: ${dbCount}건`);
