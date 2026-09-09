// scripts/d26-verify.mjs — D26 검증 스크립트 (오더 #D26-검증).
//
// 각 스팟의 sections[].body 에서 en/ja/zh-CN/zh-TW 가 ko 와 다른지 확인.
// 다르면 O (번역됨), 같으면 X (미번역), sections 없으면 SKIP.
//
// 사용: `node scripts/d26-verify.mjs`  (tsx 로 재실행됨)

import { spawnSync } from "node:child_process";
import path from "node:path";

if (!process.env._TSX) {
  const r = spawnSync(
    "npx",
    ["-y", "tsx", "scripts/d26-verify.mjs"],
    {
      stdio: "inherit",
      env: { ...process.env, _TSX: "1" },
      shell: true,
      cwd: process.cwd(),
    },
  );
  process.exit(r.status ?? 0);
}

const mod = await import(
  "file://" + path.resolve("data/spots.ts").replace(/\\/g, "/")
);
const spots = mod.spots;

const LOCALES = ["en", "ja", "zh-CN", "zh-TW"];
const rows = [];

for (const s of spots) {
  if (!s.sections || s.sections.length === 0) {
    rows.push({
      slug: s.slug,
      category: s.category,
      en: "SKIP",
      ja: "SKIP",
      "zh-CN": "SKIP",
      "zh-TW": "SKIP",
      note: "no sections",
    });
    continue;
  }
  const row = { slug: s.slug, category: s.category, en: "O", ja: "O", "zh-CN": "O", "zh-TW": "O", note: "" };
  for (const loc of LOCALES) {
    for (const sec of s.sections) {
      if (sec.body[loc] === sec.body.ko) {
        row[loc] = "X";
        break;
      }
    }
  }
  rows.push(row);
}

rows.sort((a, b) => (a.category + a.slug).localeCompare(b.category + b.slug));

console.log("slug".padEnd(38), "cat".padEnd(10), "en".padEnd(4), "ja".padEnd(4), "zh-CN".padEnd(6), "zh-TW".padEnd(6), "note");
console.log("─".repeat(85));

const stats = { total: 0, ok: 0, part: 0, skip: 0, ko: 0 };
for (const r of rows) {
  const parts = [r.en, r.ja, r["zh-CN"], r["zh-TW"]];
  let status = "";
  if (parts.every((p) => p === "SKIP")) {
    status = "S";
    stats.skip++;
  } else if (parts.every((p) => p === "O")) {
    status = "✓";
    stats.ok++;
  } else if (parts.every((p) => p === "X")) {
    status = "!";
    stats.ko++;
  } else {
    status = "~";
    stats.part++;
  }
  stats.total++;
  console.log(
    r.slug.padEnd(38),
    r.category.padEnd(10),
    r.en.padEnd(4),
    r.ja.padEnd(4),
    r["zh-CN"].padEnd(6),
    r["zh-TW"].padEnd(6),
    status,
    r.note,
  );
}

console.log("─".repeat(85));
console.log(
  `총 ${stats.total}건 · 완전번역(✓) ${stats.ok} · 부분번역(~) ${stats.part} · 미번역(!) ${stats.ko} · 스킵(S) ${stats.skip}`,
);
