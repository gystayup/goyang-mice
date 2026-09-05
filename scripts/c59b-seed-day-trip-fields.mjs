// scripts/c59b-seed-day-trip-fields.mjs — 오더 #C59-B [1] 신규 7필드 병합 시드.
//
// 목적: /ko/products/day-trips/seoul-royal 화면에서
//       ③Overview · ④타임라인 · ⑦좋은 이유 · ⑨스팟 카드 · ⑩FAQ 5개 블록이
//       조용히 숨겨지던 원인을 해소한다.
//       원인은 신규 7필드 (hookLine · overview · timeline · whyGood · access · faq · illustrationKey)
//       가 data/day-trip-courses.ts 코드에만 있고 Supabase pages 테이블
//       (pageKey='day-trip-catalog') 에는 없어서 loadDayTrip() 이 값을 읽지 못한 것.
//
// 규칙:
//   · DB 값을 base 로 유지 (기존 필드는 절대 덮어쓰지 않음).
//   · 각 코스에 대해 id 매칭 → 코드의 신규 7필드만 병합.
//   · DB 에 없는 새 코스가 있다면 코드 전체를 push (신규 추가).
//   · Supabase 스키마 무변경 · prisma 무접촉.
//
// 실행: node scripts/c59b-seed-day-trip-fields.mjs
//   (내부에서 tsx 로 self-respawn 하여 TS 데이터 파일을 import 함)

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

// TS 파일 import 를 위한 tsx self-respawn (c57 시드 패턴 미러)
if (!process.env._C59B_TSX_LOADED) {
  const { spawnSync } = await import("node:child_process");
  const result = spawnSync(
    "npx",
    ["-y", "tsx", "scripts/c59b-seed-day-trip-fields.mjs"],
    { stdio: "inherit", env: { ...process.env, _C59B_TSX_LOADED: "1" }, shell: true }
  );
  process.exit(result.status ?? 0);
}

const coursesModule = await import(
  pathToFileURL(path.join(process.cwd(), "data", "day-trip-courses.ts")).href
);
const codeCourses = coursesModule.dayTripCourses;

if (!Array.isArray(codeCourses) || codeCourses.length === 0) {
  console.error("data/day-trip-courses.ts 에서 dayTripCourses 배열을 불러오지 못했습니다.");
  process.exit(1);
}

console.log(`[C59-B] 코드 데이터 로드: ${codeCourses.length}건`);

const supabase = createClient(url, key);
const PAGE_KEY = "day-trip-catalog";

const { data: existing, error: readErr } = await supabase
  .from("pages")
  .select("id, contentJson")
  .eq("pageKey", PAGE_KEY)
  .maybeSingle();

if (readErr) {
  console.error("DB 조회 실패:", readErr.message);
  process.exit(1);
}

const dbCourses = Array.isArray(existing?.contentJson) ? existing.contentJson : [];
console.log(`[C59-B] DB 코스: ${dbCourses.length}건 (기존 row ${existing ? "존재" : "없음"})`);

const NEW_FIELDS = [
  "hookLine",
  "overview",
  "timeline",
  "whyGood",
  "access",
  "faq",
  "illustrationKey",
];

const codeById = new Map(codeCourses.map((c) => [c.id, c]));

// 병합: DB 각 코스를 base 로, 코드의 신규 7필드만 덮어씀
const merged = [];
let preservedCount = 0;
const newFieldsFilled = {};
for (const dbCourse of dbCourses) {
  const codeCourse = codeById.get(dbCourse.id);
  if (!codeCourse) {
    merged.push(dbCourse);
    preservedCount++;
    continue;
  }
  const patched = { ...dbCourse };
  const filled = [];
  for (const f of NEW_FIELDS) {
    if (codeCourse[f] !== undefined) {
      patched[f] = codeCourse[f];
      filled.push(f);
    }
  }
  if (filled.length > 0) {
    newFieldsFilled[dbCourse.id] = filled;
  }
  merged.push(patched);
  preservedCount++;
}

// DB 에 없는 신규 코스는 코드 그대로 추가
const dbIds = new Set(dbCourses.map((c) => c.id));
let addedCount = 0;
for (const codeCourse of codeCourses) {
  if (!dbIds.has(codeCourse.id)) {
    merged.push(codeCourse);
    addedCount++;
    newFieldsFilled[codeCourse.id] = NEW_FIELDS.filter((f) => codeCourse[f] !== undefined);
  }
}

console.log(`[C59-B] 병합 결과: 총 ${merged.length}건 · 기존 보존 ${preservedCount} · 신규 추가 ${addedCount}`);
console.log(`[C59-B] 신규 필드 반영 코스:`);
for (const [id, fields] of Object.entries(newFieldsFilled)) {
  console.log(`  · ${id} — [${fields.join(", ")}] (${fields.length}/${NEW_FIELDS.length})`);
}
if (Object.keys(newFieldsFilled).length === 0) {
  console.log(`  (신규 필드 반영된 코스 없음)`);
}

const now = new Date().toISOString();

if (existing) {
  const { error } = await supabase
    .from("pages")
    .update({ contentJson: merged, updatedAt: now })
    .eq("pageKey", PAGE_KEY);
  if (error) {
    console.error("update 실패:", error.message);
    process.exit(1);
  }
  console.log(`✓ 기존 row 업데이트 완료 (${merged.length}건)`);
} else {
  const { error } = await supabase.from("pages").insert({
    id: crypto.randomUUID(),
    pageKey: PAGE_KEY,
    title: "Day Trip Catalog",
    slug: PAGE_KEY,
    contentJson: merged,
    status: "PUBLISHED",
    lang: "ko",
    createdAt: now,
    updatedAt: now,
  });
  if (error) {
    console.error("insert 실패:", error.message);
    process.exit(1);
  }
  console.log(`✓ 신규 row 생성 완료 (${merged.length}건)`);
}

// 검증
const { data: check } = await supabase
  .from("pages")
  .select("contentJson")
  .eq("pageKey", PAGE_KEY)
  .single();
const finalList = Array.isArray(check?.contentJson) ? check.contentJson : [];
const seoulRoyal = finalList.find((c) => c.id === "seoul-royal");
const seoulRoyalFieldCount = seoulRoyal
  ? NEW_FIELDS.filter((f) => seoulRoyal[f] !== undefined).length
  : 0;

// 기존 필드 보존 스팟 체크 (첫 코스 3개)
const preserveSample = finalList.slice(0, 3).map((c) => ({
  id: c.id,
  name: c.name,
  hasIntro: !!c.intro,
  hasStops: Array.isArray(c.stops) && c.stops.length > 0,
  hasTransport: !!c.transport,
}));

console.log(`✓ DB 조회 검증: 총 ${finalList.length}건`);
console.log(`✓ seoul-royal 신규 필드: ${seoulRoyalFieldCount}/${NEW_FIELDS.length}`);
console.log(`✓ 기존 필드 보존 샘플 (앞 3건):`);
for (const s of preserveSample) {
  console.log(`  · ${s.id} — intro:${s.hasIntro} stops:${s.hasStops} transport:${s.hasTransport}`);
}
