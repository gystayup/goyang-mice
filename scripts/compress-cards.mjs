// scripts/compress-cards.mjs
// 1회성 카드 사진 압축·포맷 정리 스크립트.
// 입력: public/images/cards/card-<cat>.jpg.png (이중 확장자, 실제 PNG 콘텐츠)
// 출력: public/images/cards/card-<cat>.jpg          (JPG, 압축)
// 원본 .jpg.png 는 처리 후 삭제.
//
// 압축: sharp jpeg quality=82, mozjpeg, progressive
// 리사이즈: 최대 1600px (4:3 유지, fit=inside)
// EXIF 회전 자동 보정
//
// 실행: node scripts/compress-cards.mjs
import sharp from "sharp";
import { writeFileSync, unlinkSync, statSync, existsSync } from "node:fs";
import path from "node:path";

const CATS = ["walk", "food", "culture", "kculture", "history", "family"];
const DIR = "public/images/cards";
const MAX_WIDTH = 1600;
const QUALITY = 82;

function human(bytes) {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)}MB`;
}

async function processOne(cat) {
  const srcCandidates = [
    path.join(DIR, `card-${cat}.jpg.png`),
    path.join(DIR, `card-${cat}.png`),
    path.join(DIR, `card-${cat}.jpg`),
  ];
  const srcPath = srcCandidates.find((p) => existsSync(p));
  if (!srcPath) {
    return { cat, status: "MISSING" };
  }
  const dstPath = path.join(DIR, `card-${cat}.jpg`);
  const srcBytes = statSync(srcPath).size;
  const meta = await sharp(srcPath).metadata();

  const buf = await sharp(srcPath)
    .rotate() // EXIF orientation 보정
    .resize({
      width: MAX_WIDTH,
      height: MAX_WIDTH,
      fit: "inside",
      withoutEnlargement: true,
    })
    .jpeg({ quality: QUALITY, progressive: true, mozjpeg: true })
    .toBuffer();

  writeFileSync(dstPath, buf);
  if (srcPath !== dstPath) {
    unlinkSync(srcPath);
  }
  const dstBytes = statSync(dstPath).size;
  const reduction = ((1 - dstBytes / srcBytes) * 100).toFixed(1);
  return {
    cat,
    status: "OK",
    srcName: path.basename(srcPath),
    origSize: `${meta.width}x${meta.height}`,
    origFmt: meta.format,
    srcBytes,
    dstBytes,
    reduction,
  };
}

const rows = [];
for (const cat of CATS) {
  const row = await processOne(cat);
  rows.push(row);
  if (row.status === "MISSING") {
    console.log(`${cat.padEnd(9)} MISSING`);
  } else {
    console.log(
      `${cat.padEnd(9)} ${row.srcName.padEnd(24)} fmt=${row.origFmt} ${row.origSize.padStart(11)}  ${human(row.srcBytes).padStart(8)} → ${human(row.dstBytes).padStart(8)}  (-${row.reduction}%)`
    );
  }
}

const ok = rows.filter((r) => r.status === "OK");
if (ok.length) {
  const totalBefore = ok.reduce((s, r) => s + r.srcBytes, 0);
  const totalAfter = ok.reduce((s, r) => s + r.dstBytes, 0);
  const totalReduction = ((1 - totalAfter / totalBefore) * 100).toFixed(1);
  console.log(
    `\ntotals (${ok.length} files):\n  before: ${human(totalBefore)}\n  after:  ${human(totalAfter)}\n  saved:  -${totalReduction}%`
  );
}
