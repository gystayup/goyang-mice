// app/api/diag/spot-overlay/[slug]/route.ts — 오더 #D30 진단 라우트.
//
// spot-catalog DB 원본, data/spots.ts 정적, 오버레이 결과를 나란히 반환.
// 프로덕션 데이터로 오버레이 게이트 통과/탈락 지점 확정용.
//
// 예: /api/diag/spot-overlay/seooreung
//
// 접근 제어: 서비스 롤 키를 노출하지 않는다. 반환 데이터는 이미 공개 페이지에서
// 조회 가능한 스팟 콘텐츠. NEXT_PUBLIC_SUPABASE_URL 이 없으면 정적 폴백만 반환.

import { NextResponse } from "next/server";

import {
  overlayI18n,
  overlayNode,
  readSpotCatalog,
  readSpotCatalogLocalized,
} from "@/lib/spot-catalog-db";
import { spots as defaultSpots } from "@/data/spots";
import type { I18nText, Spot } from "@/data/spots";

export const dynamic = "force-dynamic";

const LOCALES: (keyof I18nText)[] = ["ko", "en", "ja", "zh-CN", "zh-TW"];

function summarize(t: I18nText | undefined | null) {
  if (!t) return null;
  const s = (v: string) => (v.length > 120 ? v.slice(0, 120) + "…" : v);
  const out: Record<string, string> = {};
  for (const loc of LOCALES) out[loc as string] = s(t[loc] ?? "");
  return out;
}

function diagI18n(dbT: I18nText | undefined | null, staticT: I18nText | undefined | null) {
  if (!dbT || !staticT) return { db: summarize(dbT), static: summarize(staticT), gates: null };
  const gates = LOCALES.filter((l) => l !== "ko").map((loc) => ({
    loc,
    gate1_db_loc_eq_ko: dbT[loc] === dbT.ko,
    gate2_static_loc_neq_ko: staticT[loc] !== staticT.ko,
    ko_strict_equal: dbT.ko === staticT.ko,
    ko_len_db: dbT.ko.length,
    ko_len_static: staticT.ko.length,
    would_overlay_D30: dbT[loc] === dbT.ko && staticT[loc] !== staticT.ko,
  }));
  return {
    db: summarize(dbT),
    static: summarize(staticT),
    gates,
    overlayed: summarize(overlayI18n(dbT, staticT)),
  };
}

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ slug: string }> },
) {
  const { slug } = await ctx.params;

  const [dbList, localizedList] = await Promise.all([
    readSpotCatalog(),
    readSpotCatalogLocalized(),
  ]);
  const staticSpot = defaultSpots.find((s) => s.slug === slug) ?? null;
  const dbSpot = dbList.find((s) => s.slug === slug) ?? null;
  const localizedSpot = localizedList.find((s) => s.slug === slug) ?? null;

  const sectionCount = {
    db: dbSpot?.sections?.length ?? 0,
    static: staticSpot?.sections?.length ?? 0,
    localized: localizedSpot?.sections?.length ?? 0,
  };

  const sectionsDiag =
    dbSpot?.sections?.map((s: Spot["sections"][number], i: number) => ({
      idx: i,
      heading: diagI18n(s.heading, staticSpot?.sections?.[i]?.heading),
      body: diagI18n(s.body, staticSpot?.sections?.[i]?.body),
      localizedBody: summarize(localizedSpot?.sections?.[i]?.body),
    })) ?? [];

  const topFields = {
    title: diagI18n(dbSpot?.title, staticSpot?.title),
    subtitle: diagI18n(dbSpot?.subtitle, staticSpot?.subtitle),
    lead: diagI18n(dbSpot?.lead, staticSpot?.lead),
  };

  return NextResponse.json(
    {
      slug,
      counts: {
        dbSpots: dbList.length,
        localizedSpots: localizedList.length,
        staticSpots: defaultSpots.length,
      },
      spotFound: {
        db: !!dbSpot,
        static: !!staticSpot,
        localized: !!localizedSpot,
      },
      sectionCount,
      topFields,
      sectionsDiag,
      // sanity: 재귀 오버레이가 실제로 다른 값을 생산하는지 (top-level Spot 오브젝트 전체)
      recursiveOverlayReturnsSame:
        dbSpot && staticSpot
          ? JSON.stringify(dbSpot) === JSON.stringify(overlayNode(dbSpot, staticSpot))
          : null,
    },
    { headers: { "cache-control": "no-store" } },
  );
}
