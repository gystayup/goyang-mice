// scripts/transparent-badges.mjs
// 1회성 배지 6장 흰 배경 → 투명 변환 스크립트.
//
// 방식:
//   1. 원본 RGBA raw 픽셀 로드 (sharp .ensureAlpha().raw())
//   2. 4 코너 시드로 flood fill (DFS, 4-connectivity)
//      · 흰색 임계값: min(R,G,B) >= 235
//      · flood fill 도달 픽셀만 알파 수정 → 배지 안쪽 갇힌 흰색은 자동 보존
//   3. 알파 감쇠 (안티에일리어싱 부드럽게):
//      · min(R,G,B) 가 클수록 (더 흰색) 더 투명
//      · alpha = clamp((255 - min(R,G,B)) * 12.75, 0, 255)
//      · min=255 → alpha=0, min=240 → alpha=191, min=235 → alpha=255
//   4. sharp png(palette=true) 로 재저장 — 알파 포함 인덱스 PNG (파일 크기 최소)
//
// 검증 (커밋 안전장치):
//   · 4 코너 알파 = 0 (완전 투명)
//   · 중심 픽셀 (w/2, h/2) 이 flood fill 에 안 잡혔는지
//   · 중심 반경(min(w,h)/4) 원 내부에서 visited 픽셀 수 = 0 이어야
//   · 하나라도 실패 시 원본 안 건드리고 리포트에 FAIL 표시
//
// 실행: node scripts/transparent-badges.mjs
import sharp from "sharp";
import { writeFileSync, unlinkSync, statSync, existsSync, renameSync } from "node:fs";
import path from "node:path";

const CATS = ["walk", "food", "culture", "kculture", "history", "family"];
const DIR = "public/images/badges";
const WHITE_THRESHOLD = 235; // min(R,G,B) 이 값 이상이면 "흰색"

function isWhite(r, g, b) {
  return r >= WHITE_THRESHOLD && g >= WHITE_THRESHOLD && b >= WHITE_THRESHOLD;
}

/**
 * 알파 감쇠 함수: 흰색일수록 투명.
 * min(R,G,B) >= 250 (사실상 흰색) → alpha 0 (완전 투명)
 *   · 코너/저장 편차로 순수 255 가 아닌 252 같은 값도 완전 투명 처리
 * 235 <= min(R,G,B) < 250 (안티에일리어싱 경계) → 부분 알파 (부드러운 전환)
 *   · m=249 → alpha 17, m=240 → alpha 170, m=235 → alpha 255 (원본 유지)
 */
const SOLID_WHITE = 250;
function alphaForWhite(r, g, b) {
  const m = Math.min(r, g, b);
  if (m >= SOLID_WHITE) return 0;
  const a = (SOLID_WHITE - m) * (255 / (SOLID_WHITE - WHITE_THRESHOLD));
  return Math.max(0, Math.min(255, Math.round(a)));
}

function human(bytes) {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)}MB`;
}

async function processOne(cat) {
  const inPath = path.join(DIR, `badge-${cat}.png`);
  if (!existsSync(inPath)) return { cat, status: "MISSING" };

  const beforeBytes = statSync(inPath).size;
  const origMeta = await sharp(inPath).metadata();

  const { data, info } = await sharp(inPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const buf = Buffer.from(data); // 가변 사본

  // ---- flood fill (DFS, 4-connectivity, 4 코너 시드) ----
  const visited = new Uint8Array(width * height);
  const stack = [];
  const cornerCoords = [
    [0, 0],
    [width - 1, 0],
    [0, height - 1],
    [width - 1, height - 1],
  ];
  for (const [cx, cy] of cornerCoords) {
    const idx = cy * width + cx;
    if (visited[idx]) continue;
    const pi = idx * channels;
    if (isWhite(buf[pi], buf[pi + 1], buf[pi + 2])) {
      stack.push([cx, cy]);
      visited[idx] = 1;
    }
  }

  let filledCount = 0;
  while (stack.length) {
    const [x, y] = stack.pop();
    const idx = y * width + x;
    const pi = idx * channels;
    buf[pi + 3] = alphaForWhite(buf[pi], buf[pi + 1], buf[pi + 2]);
    filledCount++;

    if (x + 1 < width) {
      const ni = idx + 1;
      if (!visited[ni]) {
        const npi = ni * channels;
        if (isWhite(buf[npi], buf[npi + 1], buf[npi + 2])) {
          visited[ni] = 1;
          stack.push([x + 1, y]);
        }
      }
    }
    if (x - 1 >= 0) {
      const ni = idx - 1;
      if (!visited[ni]) {
        const npi = ni * channels;
        if (isWhite(buf[npi], buf[npi + 1], buf[npi + 2])) {
          visited[ni] = 1;
          stack.push([x - 1, y]);
        }
      }
    }
    if (y + 1 < height) {
      const ni = idx + width;
      if (!visited[ni]) {
        const npi = ni * channels;
        if (isWhite(buf[npi], buf[npi + 1], buf[npi + 2])) {
          visited[ni] = 1;
          stack.push([x, y + 1]);
        }
      }
    }
    if (y - 1 >= 0) {
      const ni = idx - width;
      if (!visited[ni]) {
        const npi = ni * channels;
        if (isWhite(buf[npi], buf[npi + 1], buf[npi + 2])) {
          visited[ni] = 1;
          stack.push([x, y - 1]);
        }
      }
    }
  }

  // ---- 검증 (커밋 안전장치) ----
  const cornerAlphas = cornerCoords.map(([cx, cy]) => {
    const idx = cy * width + cx;
    return buf[idx * channels + 3];
  });
  const allCornersTransparent = cornerAlphas.every((a) => a === 0);

  const midX = Math.floor(width / 2);
  const midY = Math.floor(height / 2);
  const centerVisited = visited[midY * width + midX] === 1;

  const R = Math.floor(Math.min(width, height) / 4);
  let insideBreached = 0;
  for (let dy = -R; dy <= R; dy++) {
    for (let dx = -R; dx <= R; dx++) {
      if (dx * dx + dy * dy > R * R) continue;
      const nx = midX + dx;
      const ny = midY + dy;
      if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
      if (visited[ny * width + nx]) insideBreached++;
    }
  }

  const safe = allCornersTransparent && !centerVisited && insideBreached === 0;

  // ---- 결과 PNG 생성 (알파 포함 인덱스 PNG) ----
  const outBuf = await sharp(buf, {
    raw: { width, height, channels: 4 },
  })
    .png({
      compressionLevel: 9,
      effort: 10,
      palette: true,
      quality: 90,
    })
    .toBuffer();

  const outMeta = await sharp(outBuf).metadata();
  const afterBytes = outBuf.length;

  return {
    cat,
    status: "OK",
    origMeta: `${origMeta.width}x${origMeta.height} alpha=${origMeta.hasAlpha}`,
    beforeBytes,
    afterBytes,
    filledCount,
    filledPct: ((filledCount / (width * height)) * 100).toFixed(1),
    cornerAlphas,
    allCornersTransparent,
    centerVisited,
    insideBreached,
    outHasAlpha: outMeta.hasAlpha,
    outChannels: outMeta.channels,
    safe,
    outBuf,
    inPath,
  };
}

// ---- 파이프라인 ----
const results = [];
for (const cat of CATS) {
  const r = await processOne(cat);
  results.push(r);
  if (r.status === "MISSING") {
    console.log(`${cat.padEnd(9)} MISSING`);
    continue;
  }
  console.log(
    `${cat.padEnd(9)} ${r.origMeta.padEnd(22)}  ${human(r.beforeBytes).padStart(8)} → ${human(r.afterBytes).padStart(8)}  filled=${r.filledPct.padStart(5)}%  corners=[${r.cornerAlphas.join(",")}]  centerVisited=${r.centerVisited}  insideBreached=${r.insideBreached}  hasAlpha=${r.outHasAlpha}  ${r.safe ? "SAFE" : "*** FAIL ***"}`
  );
}

const failed = results.filter((r) => r.status === "OK" && !r.safe);
const oks = results.filter((r) => r.status === "OK" && r.safe);

if (failed.length) {
  console.log(`\n❌ ${failed.length} file(s) failed safety check — NO files written.`);
  console.log("   Failure reasons:");
  for (const r of failed) {
    const reasons = [];
    if (!r.allCornersTransparent) reasons.push(`corner alpha not all 0: [${r.cornerAlphas.join(",")}]`);
    if (r.centerVisited) reasons.push("center pixel flood-filled");
    if (r.insideBreached > 0) reasons.push(`${r.insideBreached} inside pixels breached`);
    console.log(`   · badge-${r.cat}.png: ${reasons.join("; ")}`);
  }
  console.log("\n   No changes made to any file. Report and stop.");
  process.exit(1);
}

// 모든 파일 safe → 원본 덮어쓰기 (atomic via tmp file)
console.log(`\n✅ all ${oks.length} file(s) passed safety — writing…`);
let totalBefore = 0;
let totalAfter = 0;
for (const r of oks) {
  const tmpPath = r.inPath + ".tmp";
  writeFileSync(tmpPath, r.outBuf);
  renameSync(tmpPath, r.inPath);
  totalBefore += r.beforeBytes;
  totalAfter += r.afterBytes;
  console.log(`  wrote ${r.inPath} (${human(r.afterBytes)})`);
}

const totalReduction = ((1 - totalAfter / totalBefore) * 100).toFixed(1);
console.log(
  `\ntotals:\n  before: ${human(totalBefore)}\n  after:  ${human(totalAfter)}\n  delta:  ${totalReduction.startsWith("-") ? "+" : "-"}${totalReduction.replace("-", "")}%`
);
