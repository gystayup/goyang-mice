// scripts/c57-seed-day-trip-catalog.mjs — 오더 #C57 [2] 17코스 1회 시드.
//
// data/day-trip-courses.ts (17코스 · 서울 6 · 파주 6 · 경기 5) 을
// Supabase pages 테이블에 pageKey='day-trip-catalog' contentJson 배열로 upsert.
// Prisma·마이그레이션 없음.
//
// 실행: `node scripts/c57-seed-day-trip-catalog.mjs`
// 환경변수: .env.local 의 NEXT_PUBLIC_SUPABASE_URL · SUPABASE_SERVICE_ROLE_KEY

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

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

if (!process.env._C57_TSX_LOADED) {
  const { spawnSync } = await import("node:child_process");
  const result = spawnSync(
    "npx",
    ["-y", "tsx", "scripts/c57-seed-day-trip-catalog.mjs"],
    { stdio: "inherit", env: { ...process.env, _C57_TSX_LOADED: "1" }, shell: true }
  );
  process.exit(result.status ?? 0);
}

const coursesModule = await import(
  pathToFileURL(path.join(process.cwd(), "data", "day-trip-courses.ts")).href
);
const courses = coursesModule.dayTripCourses;

if (!Array.isArray(courses) || courses.length === 0) {
  console.error("data/day-trip-courses.ts 에서 dayTripCourses 배열을 불러오지 못했습니다.");
  process.exit(1);
}

console.log(`data/day-trip-courses.ts 로드: ${courses.length}건`);
console.log(`  축별: 서울 ${courses.filter((c) => c.axis === "seoul").length} · 파주 ${courses.filter((c) => c.axis === "paju").length} · 경기 ${courses.filter((c) => c.axis === "gyeonggi").length}`);

const supabase = createClient(url, key);
const PAGE_KEY = "day-trip-catalog";

const { data: existing } = await supabase
  .from("pages")
  .select("id")
  .eq("pageKey", PAGE_KEY)
  .maybeSingle();

const now = new Date().toISOString();

if (existing) {
  const { error } = await supabase
    .from("pages")
    .update({ contentJson: courses, updatedAt: now })
    .eq("pageKey", PAGE_KEY);
  if (error) {
    console.error("update 실패:", error.message);
    process.exit(1);
  }
  console.log(`✓ 기존 row 업데이트 완료 (${courses.length}건 upsert)`);
} else {
  const { error } = await supabase.from("pages").insert({
    id: crypto.randomUUID(),
    pageKey: PAGE_KEY,
    title: "Day Trip Catalog",
    slug: PAGE_KEY,
    contentJson: courses,
    status: "PUBLISHED",
    lang: "ko",
    createdAt: now,
    updatedAt: now,
  });
  if (error) {
    console.error("insert 실패:", error.message);
    process.exit(1);
  }
  console.log(`✓ 신규 row 생성 완료 (${courses.length}건 삽입)`);
}

const { data: check } = await supabase
  .from("pages")
  .select("contentJson")
  .eq("pageKey", PAGE_KEY)
  .single();
const dbCount = Array.isArray(check?.contentJson) ? check.contentJson.length : 0;
console.log(`✓ DB 조회 검증: ${dbCount}건`);
