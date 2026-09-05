// scripts/c60-seed-site-copy.mjs — 오더 #C60 사이트 문안 1회 시드.
//
// data/site-copy-defaults.ts 의 defaultSiteCopy (홈·신뢰바·BEST·푸터·환율)
// 를 Supabase pages 테이블에 pageKey='site-copy' contentJson 단일 객체로 upsert.
// Prisma·마이그레이션 없음.
//
// 실행: `node scripts/c60-seed-site-copy.mjs`
// 환경변수: .env.local 의 NEXT_PUBLIC_SUPABASE_URL · SUPABASE_SERVICE_ROLE_KEY

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

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

// tsx 로 재실행 (재귀 방지 플래그) — TypeScript 소스 (data/site-copy-defaults.ts) 를 import 하려면 tsx runtime 필요.
if (!process.env._C60_TSX_LOADED) {
  const { spawnSync } = await import("node:child_process");
  const result = spawnSync(
    "npx",
    ["-y", "tsx", "scripts/c60-seed-site-copy.mjs"],
    { stdio: "inherit", env: { ...process.env, _C60_TSX_LOADED: "1" }, shell: true }
  );
  process.exit(result.status ?? 0);
}

// tsx 아래에서 실행. data/site-copy-defaults.ts 직접 import.
const mod = await import(
  pathToFileURL(path.join(process.cwd(), "data", "site-copy-defaults.ts")).href
);
const defaultSiteCopy = mod.defaultSiteCopy;

if (!defaultSiteCopy || typeof defaultSiteCopy !== "object") {
  console.error("data/site-copy-defaults.ts 에서 defaultSiteCopy 를 불러오지 못했습니다.");
  process.exit(1);
}

console.log("defaultSiteCopy 로드 완료 (홈·신뢰바·BEST·푸터·환율)");

const supabase = createClient(url, key);
const PAGE_KEY = "site-copy";

const { data: existing } = await supabase
  .from("pages")
  .select("id")
  .eq("pageKey", PAGE_KEY)
  .maybeSingle();

const now = new Date().toISOString();

if (existing) {
  const { error } = await supabase
    .from("pages")
    .update({ contentJson: defaultSiteCopy, updatedAt: now })
    .eq("pageKey", PAGE_KEY);
  if (error) {
    console.error("update 실패:", error.message);
    process.exit(1);
  }
  console.log("✓ 기존 site-copy row 업데이트 완료");
} else {
  const { error } = await supabase.from("pages").insert({
    id: crypto.randomUUID(),
    pageKey: PAGE_KEY,
    title: "Site Copy",
    slug: PAGE_KEY,
    contentJson: defaultSiteCopy,
    status: "PUBLISHED",
    lang: "ko",
    createdAt: now,
    updatedAt: now,
  });
  if (error) {
    console.error("insert 실패:", error.message);
    process.exit(1);
  }
  console.log("✓ 신규 site-copy row 생성 완료");
}

// 검증: 다시 읽어서 필드 확인
const { data: check } = await supabase
  .from("pages")
  .select("contentJson")
  .eq("pageKey", PAGE_KEY)
  .single();
const c = check?.contentJson;
console.log(
  "✓ DB 조회 검증:",
  c
    ? `home.heroHeadline.ko="${c.home?.heroHeadline?.ko ?? ""}" · trustBar.items=${c.trustBar?.items?.length ?? 0}개 · bestCategories.label.walk.ko="${c.bestCategories?.label?.walk?.ko ?? ""}" · footer.companyName="${c.footer?.companyName ?? ""}" · exchangeRates.USD=${c.exchangeRates?.USD ?? "?"}`
    : "contentJson 없음"
);
