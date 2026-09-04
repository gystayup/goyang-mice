// 오더 #C48 [1](B) — TourAPI 이미지 수집 · 1회 실행 스크립트.
//
// 목적:
//   /best 82 items 중 사진 미확보 61개에 TourAPI 이미지를 다운로드해 배선.
//   공공누리 제1유형(cpyrht="Type1")만 카드에 사용 (오더 규범).
//
// 실행:
//   node scripts/c48-fetch-tourapi-images.mjs
//   → public/images/spots/{id}-api-1.jpg 저장
//   → scripts/tmp/c48-results.json 결과 요약
//   → data/curated-stories.ts 자동 편집 (photoUrl + photoCredit)

import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";

const ROOT = process.cwd();
const IMG_DIR = join(ROOT, "public", "images", "spots");
const OUT_JSON = join(ROOT, "scripts", "tmp", "c48-results.json");

// .env.local 파싱 (dotenv 회피, 초경량).
function loadEnv(path) {
  const src = readFileSync(path, "utf8");
  const out = {};
  for (const line of src.split(/\r?\n/)) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (!m) continue;
    let v = m[2].trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    out[m[1]] = v;
  }
  return out;
}

const env = loadEnv(join(ROOT, ".env.local"));
const SERVICE_KEY = env.TOUR_API_KEY_ENCODED;
if (!SERVICE_KEY) {
  console.error("ERROR: TOUR_API_KEY_ENCODED not found in .env.local");
  process.exit(1);
}
console.log("TourAPI key loaded (length:", SERVICE_KEY.length + ")");

const BASE = "https://apis.data.go.kr/B551011/KorService2";
const MOBILE_OS = "ETC";
const MOBILE_APP = "goyang-dmc";

async function fetchJson(path, params) {
  const q = new URLSearchParams({
    serviceKey: SERVICE_KEY,
    MobileOS: MOBILE_OS,
    MobileApp: MOBILE_APP,
    _type: "json",
    ...params,
  });
  // serviceKey 는 이미 URL encoded 되어 있으므로 URLSearchParams가 이중 인코딩하지 않도록
  // 직접 문자열로 조립.
  const raw = Array.from(q.entries())
    .filter(([k]) => k !== "serviceKey")
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join("&");
  const url = `${BASE}/${path}?serviceKey=${SERVICE_KEY}&${raw}`;
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText} for ${path}`);
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`Non-JSON response from ${path}: ${text.slice(0, 200)}`);
  }
}

async function detailImage2(contentid) {
  // subImageYN 파라미터는 KorService2에서 무효 (INVALID_REQUEST_PARAMETER_ERROR).
  const r = await fetchJson("detailImage2", {
    contentId: contentid,
    imageYN: "Y",
    numOfRows: "20",
    pageNo: "1",
  });
  const items = r?.response?.body?.items?.item;
  if (!items) return [];
  return Array.isArray(items) ? items : [items];
}

async function searchKeyword2(keyword) {
  // sigunguCode=35 는 고양시 코드가 아님. 제거하고 addr1으로 고양시 필터.
  const r = await fetchJson("searchKeyword2", {
    keyword,
    areaCode: "31", // 경기도
    numOfRows: "10",
    pageNo: "1",
  });
  const items = r?.response?.body?.items?.item;
  if (!items) return [];
  const arr = Array.isArray(items) ? items : [items];
  // 고양시 결과 우선.
  const goyang = arr.filter((x) => typeof x.addr1 === "string" && x.addr1.includes("고양시"));
  return goyang.length > 0 ? goyang : arr;
}

async function downloadImage(url, destPath) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Image HTTP ${res.status} for ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  mkdirSync(dirname(destPath), { recursive: true });
  writeFileSync(destPath, buf);
  return buf.length;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// ─── 대상 매핑 (id → contentid) ────────────────────────────────────────────
// spots.ts 에서 추출한 slug→contentid (scripts/tmp/spot-tourapi-map.json).
// 이미 사진 배선된 id 는 나중 필터로 스킵.
const SPOT_MAP = JSON.parse(readFileSync(join(ROOT, "scripts", "tmp", "spot-tourapi-map.json"), "utf8"));
const CID_BY_SLUG = new Map(SPOT_MAP.filter((x) => x.contentid).map((x) => [x.slug, x.contentid]));

// curated-stories.ts 파싱: 최상위 items 배열의 id 목록.
function parseCuratedIds() {
  const src = readFileSync(join(ROOT, "data", "curated-stories.ts"), "utf8");
  const catRe = /^ {2}(walk|food|culture|kculture|history|family|shopping|stay|night):\s*\{$/gm;
  const cats = [];
  let m;
  while ((m = catRe.exec(src)) !== null) {
    cats.push({ name: m[1], start: m.index });
  }
  const result = {};
  for (let i = 0; i < cats.length; i++) {
    const c = cats[i];
    const end = i + 1 < cats.length ? cats[i + 1].start : src.length;
    const block = src.slice(c.start, end);
    // items 배열에서 최상위 { id: "..." } 만 추출 (nested 는 이 카테고리에 없음)
    const ids = [];
    const idRe = /^ {6}\{\s*id:\s*"([^"]+)"/gm;
    let im;
    while ((im = idRe.exec(block)) !== null) ids.push(im[1]);
    result[c.name] = ids;
  }
  return result;
}

// 이미 사진 배선된 id 판정: (1) photoUrl 필드 있음 (2) spots.ts gallery 있음 (3) 로컬 파일 -1.jpg 등 존재
function hasPhoto(id) {
  // (1) photoUrl in curated-stories
  const src = readFileSync(join(ROOT, "data", "curated-stories.ts"), "utf8");
  const re = new RegExp(`\\{\\s*id:\\s*"${id.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&")}"[^}]*photoUrl:`);
  if (re.test(src)) return "photoUrl";
  // (2) spots.ts gallery (Type1)
  const spotsSrc = readFileSync(join(ROOT, "data", "spots.ts"), "utf8");
  const slugPos = spotsSrc.indexOf(`slug: "${id}"`);
  if (slugPos > 0) {
    const block = spotsSrc.slice(slugPos, slugPos + 8000);
    const galleryMatch = block.match(/gallery:\s*\[([\s\S]*?)\]/);
    if (galleryMatch && galleryMatch[1].includes("/images/spots/")) {
      // gallery에 로컬 이미지 있음, Type1 필터
      if (!galleryMatch[1].includes('cpyrht: "Type3"') || galleryMatch[1].includes('cpyrht: "Type1"')) {
        return "gallery";
      }
    }
  }
  // (3) 로컬 파일 -1.jpg or {id}.jpg or {id}-api-1.jpg
  for (const suffix of ["-1", "-2", "-3", "", "-api-1"]) {
    for (const ext of ["jpg", "png", "webp"]) {
      if (existsSync(join(IMG_DIR, `${id}${suffix}.${ext}`))) return `file:${id}${suffix}.${ext}`;
    }
  }
  return null;
}

// 카테고리 우선순위 (오더 명시).
const CATEGORY_ORDER = ["food", "stay", "night", "kculture", "family", "shopping", "walk", "culture", "history"];

// 조회 실패 케이스에서 재사용할 후보 이름 매핑 (curated-only concept ids)
// spots.ts에 없거나 있어도 contentid 없는 id 를 검색어로.
const KEYWORD_FALLBACK = {
  // kculture concept
  "learn-kculture": null,   // 개념 · 검색 불가
  "goyang-after-dark": null, // 개념
  "goyang-stadium": "고양종합운동장",
  "kintex-kpop": null, // 개념 (KINTEX 자체는 있음)
  "hallyu-world": "한류월드",
  "onemount": "원마운트",
  // walk
  "changneungcheon-trail": "창릉천",
  "kintex-walkway": null, // 개념 (킨텍스 있음)
  "janghang-wetlands": "장항습지",
  // culture
  "gawaji-rice-museum": "고양가와지볍씨박물관",
  // history
  "bamgasi-thatched-house": "밤가시초가",
  "haengju-historical-park": "행주산성 역사공원",
  "heungguksa-goyang": "흥국사",
  // family/night
  "starfield-dining": null, // 개념 (스타필드 있음)
  "drink-goyang": null, // 개념
};

async function main() {
  const idsByCat = parseCuratedIds();
  console.log("\nCurated items by category:");
  for (const c of CATEGORY_ORDER) console.log(`  ${c}: ${idsByCat[c]?.length || 0}`);

  const targets = [];
  for (const cat of CATEGORY_ORDER) {
    for (const id of idsByCat[cat] || []) {
      const already = hasPhoto(id);
      if (already) {
        console.log(`  SKIP ${cat}/${id} (${already})`);
        continue;
      }
      // contentid 조회 순서: spots.ts map → KEYWORD_FALLBACK
      let contentid = CID_BY_SLUG.get(id) || null;
      let keyword = null;
      if (!contentid) {
        keyword = KEYWORD_FALLBACK[id];
        if (keyword === undefined) {
          // 명시 fallback 없음 → id에서 유추 시도 스킵.
          console.log(`  NO_MAP ${cat}/${id} (contentid 없고 KEYWORD_FALLBACK 미정 · 스킵)`);
          continue;
        }
        if (keyword === null) {
          console.log(`  SKIP_CONCEPT ${cat}/${id} (개념 id · 검색 불가)`);
          continue;
        }
      }
      targets.push({ cat, id, contentid, keyword });
    }
  }
  console.log(`\nCollection targets: ${targets.length}`);

  const results = [];
  for (const t of targets) {
    let contentid = t.contentid;
    try {
      if (!contentid && t.keyword) {
        await sleep(300);
        const items = await searchKeyword2(t.keyword);
        if (items.length === 0) {
          console.log(`  FAIL ${t.cat}/${t.id}: searchKeyword2 "${t.keyword}" 결과 0`);
          results.push({ ...t, status: "search_empty" });
          continue;
        }
        contentid = items[0].contentid;
        console.log(`  SEARCH ${t.cat}/${t.id} "${t.keyword}" → contentid ${contentid}`);
      }
      await sleep(300);
      const images = await detailImage2(contentid);
      // KorService2 응답 필드는 cpyrhtDivCd (cpyrht 아님).
      const type1 = images.filter((x) => (x.cpyrhtDivCd ?? x.cpyrht ?? "").trim() === "Type1");
      const usable = type1.length > 0 ? type1 : []; // Type1만 카드 사용
      if (usable.length === 0) {
        console.log(`  FAIL ${t.cat}/${t.id}: Type1 이미지 없음 (전체 ${images.length}, Type1 0)`);
        results.push({ ...t, contentid, status: "no_type1", totalImages: images.length });
        continue;
      }
      const img = usable[0];
      const imgUrl = img.originimgurl || img.smallimageurl;
      if (!imgUrl) {
        console.log(`  FAIL ${t.cat}/${t.id}: 이미지 URL 없음`);
        results.push({ ...t, contentid, status: "no_url" });
        continue;
      }
      const dest = join(IMG_DIR, `${t.id}-api-1.jpg`);
      const size = await downloadImage(imgUrl, dest);
      console.log(`  OK ${t.cat}/${t.id}: ${(size / 1024).toFixed(0)}KB (${imgUrl.slice(-40)})`);
      results.push({ ...t, contentid, status: "ok", size, imgUrl, cpyrht: "Type1" });
    } catch (e) {
      console.log(`  ERROR ${t.cat}/${t.id}: ${e.message}`);
      results.push({ ...t, status: "error", error: e.message });
    }
  }

  mkdirSync(dirname(OUT_JSON), { recursive: true });
  writeFileSync(OUT_JSON, JSON.stringify(results, null, 2));
  console.log(`\nResults saved: ${OUT_JSON}`);

  // 요약.
  const byStatus = {};
  const byCatOk = {};
  for (const r of results) {
    byStatus[r.status] = (byStatus[r.status] || 0) + 1;
    if (r.status === "ok") byCatOk[r.cat] = (byCatOk[r.cat] || 0) + 1;
  }
  console.log("\nSummary by status:", byStatus);
  console.log("Summary OK by category:", byCatOk);
}

main().catch((e) => {
  console.error("FATAL:", e);
  process.exit(1);
});
