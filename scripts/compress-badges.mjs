// scripts/compress-badges.mjs
// 1회성 배지 압축 스크립트. sharp 로 6장 PNG 를 최적화·리사이즈.
// - 리사이즈: 1024×1024 (spec 권장 상한)
// - 압축: palette=true (indexed PNG, aggressive quantization)
//         compressionLevel=9, effort=10 (최대 압축)
// - 알파 채널: 원본이 알파 있으면 유지, 없으면 그대로 RGB
// - 파일 in-place 덮어쓰기 (임시 저장 → move 방식으로 안전하게)
//
// 실행:
//   node scripts/compress-badges.mjs
//
// 결과: 각 파일 before/after 크기 표로 출력.
import sharp from "sharp";
import { writeFileSync, renameSync, statSync } from "node:fs";
import path from "node:path";

// 오더 #B1 [1]: SHOPPING·STAY·NIGHT 3종 추가 → 6→9.
const CATS = ["walk", "food", "culture", "kculture", "history", "family", "shopping", "stay", "night"];
const DIR = "public/images/badges";
const TARGET_SIZE = 1024;

function human(bytes) {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)}MB`;
}

async function compressOne(cat) {
  const inPath = path.join(DIR, `badge-${cat}.png`);
  const tmpPath = path.join(DIR, `badge-${cat}.png.tmp`);
  const beforeBytes = statSync(inPath).size;

  const meta = await sharp(inPath).metadata();
  const buf = await sharp(inPath)
    .resize({
      width: TARGET_SIZE,
      height: TARGET_SIZE,
      fit: "inside",
      withoutEnlargement: true,
    })
    .png({
      compressionLevel: 9,
      effort: 10,
      palette: true,
      quality: 90,
    })
    .toBuffer();

  writeFileSync(tmpPath, buf);
  renameSync(tmpPath, inPath);
  const afterBytes = statSync(inPath).size;
  const reduction = ((1 - afterBytes / beforeBytes) * 100).toFixed(1);
  return {
    cat,
    ch: meta.channels,
    hasAlpha: meta.hasAlpha,
    origSize: `${meta.width}x${meta.height}`,
    beforeBytes,
    afterBytes,
    reduction,
  };
}

const rows = [];
for (const cat of CATS) {
  const row = await compressOne(cat);
  rows.push(row);
  console.log(
    `${cat.padEnd(9)} ch=${row.ch} alpha=${row.hasAlpha} ${row.origSize.padStart(9)} → 1024x1024  ${human(row.beforeBytes).padStart(8)} → ${human(row.afterBytes).padStart(8)}  (-${row.reduction}%)`
  );
}

console.log("\ntotals:");
const totalBefore = rows.reduce((s, r) => s + r.beforeBytes, 0);
const totalAfter = rows.reduce((s, r) => s + r.afterBytes, 0);
const totalReduction = ((1 - totalAfter / totalBefore) * 100).toFixed(1);
console.log(
  `  before: ${human(totalBefore)}\n  after:  ${human(totalAfter)}\n  saved:  -${totalReduction}%`
);
