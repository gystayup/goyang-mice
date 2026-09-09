// scripts/d26-overlay-test.mjs — overlay 함수 단위 테스트 (오더 #D26-검증).
//
// DB 미번역 (en===ko) + static 번역됨 (en!==ko) 케이스에서 overlay 결과가
// static 값을 채택하는지 확인.

import { spawnSync } from "node:child_process";
import path from "node:path";

if (!process.env._TSX) {
  const r = spawnSync(
    "npx",
    ["-y", "tsx", "scripts/d26-overlay-test.mjs"],
    { stdio: "inherit", env: { ...process.env, _TSX: "1" }, shell: true },
  );
  process.exit(r.status ?? 0);
}

// spots 정적 데이터에서 seooreung 뽑아 mock DB 만든다: en/ja/zh 를 ko 로 되돌려
// D26 이전 시드 상태를 시뮬레이션.
const spotsMod = await import(
  "file://" + path.resolve("data/spots.ts").replace(/\\/g, "/")
);
const staticSpots = spotsMod.spots;

const staticSeo = staticSpots.find((s) => s.slug === "seooreung");
if (!staticSeo) throw new Error("seooreung not found");

// deep clone + 강제 미번역 marker
const dbSeo = JSON.parse(JSON.stringify(staticSeo));
for (const sec of dbSeo.sections) {
  for (const loc of ["en", "ja", "zh-CN", "zh-TW"]) {
    sec.body[loc] = sec.body.ko;
    sec.heading[loc] = sec.heading.ko;
  }
}
console.log("Before overlay (DB mock):");
console.log("  en body[0..80]:", dbSeo.sections[0].body.en.slice(0, 80));
console.log("  ja body[0..80]:", dbSeo.sections[0].body.ja.slice(0, 80));
console.log("  en === ko?", dbSeo.sections[0].body.en === dbSeo.sections[0].body.ko);

// overlay 함수는 lib/spot-catalog-db.ts 내부에 있으므로, 여기서 로직 재구현해
// 동일한 결과 확인 (실제 함수는 export 안 되므로 mirror).
const OVERLAY_LOCALES = ["en", "ja", "zh-CN", "zh-TW"];

function isI18nText(v) {
  if (!v || typeof v !== "object") return false;
  return (
    typeof v.ko === "string" &&
    typeof v.en === "string" &&
    typeof v.ja === "string" &&
    typeof v["zh-CN"] === "string" &&
    typeof v["zh-TW"] === "string"
  );
}
function overlayI18n(db, st) {
  const out = { ...db };
  for (const loc of OVERLAY_LOCALES) {
    if (db[loc] === db.ko && st[loc] !== st.ko && db.ko === st.ko) {
      out[loc] = st[loc];
    }
  }
  return out;
}
function overlayNode(dbNode, staticNode) {
  if (dbNode === null || dbNode === undefined) return dbNode;
  if (isI18nText(dbNode)) {
    if (isI18nText(staticNode)) return overlayI18n(dbNode, staticNode);
    return dbNode;
  }
  if (Array.isArray(dbNode)) {
    if (!Array.isArray(staticNode)) return dbNode;
    return dbNode.map((it, i) => overlayNode(it, staticNode[i]));
  }
  if (typeof dbNode === "object") {
    if (staticNode === null || staticNode === undefined || typeof staticNode !== "object" || Array.isArray(staticNode)) return dbNode;
    const out = {};
    for (const k of Object.keys(dbNode)) {
      out[k] = k in staticNode ? overlayNode(dbNode[k], staticNode[k]) : dbNode[k];
    }
    return out;
  }
  return dbNode;
}

const merged = overlayNode(dbSeo, staticSeo);

console.log("\nAfter overlay:");
console.log("  en body[0..120]:", merged.sections[0].body.en.slice(0, 120));
console.log("  ja body[0..120]:", merged.sections[0].body.ja.slice(0, 120));
console.log("  zh-CN body[0..80]:", merged.sections[0].body["zh-CN"].slice(0, 80));
console.log("  zh-TW body[0..80]:", merged.sections[0].body["zh-TW"].slice(0, 80));

const enOK = merged.sections[0].body.en.startsWith("The kings and queens");
const jaOK = merged.sections[0].body.ja.startsWith("あなたが一気見");
const zhCnOK = merged.sections[0].body["zh-CN"].startsWith("你追完的那部剧");
const zhTwOK = merged.sections[0].body["zh-TW"].startsWith("你追完的那部劇");

console.log("\n결과:");
console.log("  en 오버레이 성공?", enOK);
console.log("  ja 오버레이 성공?", jaOK);
console.log("  zh-CN 오버레이 성공?", zhCnOK);
console.log("  zh-TW 오버레이 성공?", zhTwOK);

// admin 이 DB en 을 실제 번역해 둔 케이스: 오버레이가 그 값을 덮어쓰지 않아야 함.
const dbAdminTranslated = JSON.parse(JSON.stringify(staticSeo));
for (const sec of dbAdminTranslated.sections) {
  sec.body.en = "ADMIN-TRANSLATED VALUE";
  // ja/zh 는 여전히 ko 폴백
  sec.body.ja = sec.body.ko;
  sec.body["zh-CN"] = sec.body.ko;
  sec.body["zh-TW"] = sec.body.ko;
}
const merged2 = overlayNode(dbAdminTranslated, staticSeo);
console.log("\nadmin 번역 존중 테스트:");
console.log("  admin 이 번역한 en 유지?", merged2.sections[0].body.en === "ADMIN-TRANSLATED VALUE");
console.log("  미번역 ja 는 static 로 오버레이?", merged2.sections[0].body.ja.startsWith("あなたが"));
