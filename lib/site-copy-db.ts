// lib/site-copy-db.ts — 오더 #C60 admin 사이트 문안 관리.
//
// spot-catalog-db.ts 미러하되 site-copy 는 단일 객체 (배열 아님).
// Supabase `pages` 테이블 pageKey='site-copy' 단일 row · contentJson 은 SiteCopy 객체.
// Prisma·마이그레이션 없음. Supabase 스키마 무변경 (기존 pages 재사용).
//
// 폴백: DB 조회 실패 or contentJson 없음 → data/site-copy-defaults.ts defaultSiteCopy.
//
// readSiteCopy 는 React cache() 로 래핑 → 요청당 1회 DB 조회 (spot-catalog-db 동일 패턴).

import { cache } from "react";
import { createClient } from "@supabase/supabase-js";

import { defaultSiteCopy, type SiteCopy } from "@/data/site-copy-defaults";

const PAGE_KEY = "site-copy";

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase 환경변수가 설정되지 않았습니다.");
  return createClient(url, key);
}

/**
 * DB 저장값 위에 defaultSiteCopy 필드를 얹어 누락 방어.
 *   · admin 이 부분 저장했거나 스키마 확장 시점 방어.
 *   · 오브젝트 필드만 얕은 병합. I18n 은 필드 단위로 폴백 채움.
 */
function mergeWithDefaults(partial: Partial<SiteCopy>): SiteCopy {
  const d = defaultSiteCopy;
  return {
    home: {
      heroBrandEyebrow: { ...d.home.heroBrandEyebrow, ...(partial.home?.heroBrandEyebrow ?? {}) },
      heroHeadline: { ...d.home.heroHeadline, ...(partial.home?.heroHeadline ?? {}) },
      heroSubhead: { ...d.home.heroSubhead, ...(partial.home?.heroSubhead ?? {}) },
      heroSearchPlaceholder: {
        ...d.home.heroSearchPlaceholder,
        ...(partial.home?.heroSearchPlaceholder ?? {}),
      },
    },
    trustBar: {
      items:
        Array.isArray(partial.trustBar?.items) && partial.trustBar.items.length > 0
          ? partial.trustBar.items.map((it, i) => ({
              bold: it.bold ?? d.trustBar.items[i]?.bold,
              label: { ...(d.trustBar.items[i]?.label ?? d.trustBar.items[0].label), ...(it.label ?? {}) },
            }))
          : d.trustBar.items,
    },
    bestCategories: {
      label: Object.fromEntries(
        (Object.keys(d.bestCategories.label) as (keyof typeof d.bestCategories.label)[]).map((k) => [
          k,
          { ...d.bestCategories.label[k], ...(partial.bestCategories?.label?.[k] ?? {}) },
        ])
      ) as SiteCopy["bestCategories"]["label"],
      desc: Object.fromEntries(
        (Object.keys(d.bestCategories.desc) as (keyof typeof d.bestCategories.desc)[]).map((k) => [
          k,
          { ...d.bestCategories.desc[k], ...(partial.bestCategories?.desc?.[k] ?? {}) },
        ])
      ) as SiteCopy["bestCategories"]["desc"],
    },
    footer: {
      companyName: partial.footer?.companyName ?? d.footer.companyName,
      ceo: partial.footer?.ceo ?? d.footer.ceo,
      bizRegNo: partial.footer?.bizRegNo ?? d.footer.bizRegNo,
      ecomRegNo: partial.footer?.ecomRegNo ?? d.footer.ecomRegNo,
      address: partial.footer?.address ?? d.footer.address,
      phone: partial.footer?.phone ?? d.footer.phone,
      email: partial.footer?.email ?? d.footer.email,
      privacyOfficer: partial.footer?.privacyOfficer ?? d.footer.privacyOfficer,
      disclaimer: { ...d.footer.disclaimer, ...(partial.footer?.disclaimer ?? {}) },
      disclaimerHeading: { ...d.footer.disclaimerHeading, ...(partial.footer?.disclaimerHeading ?? {}) },
    },
    exchangeRates: {
      USD: partial.exchangeRates?.USD ?? d.exchangeRates.USD,
      JPY: partial.exchangeRates?.JPY ?? d.exchangeRates.JPY,
      CNY: partial.exchangeRates?.CNY ?? d.exchangeRates.CNY,
      TWD: partial.exchangeRates?.TWD ?? d.exchangeRates.TWD,
    },
  };
}

/** DB에서 사이트 문안 읽기. 없거나 실패 시 정적 폴백. 요청당 1회 memoize. */
export const readSiteCopy = cache(async (): Promise<SiteCopy> => {
  try {
    const supabase = getSupabaseClient();
    const { data } = await supabase
      .from("pages")
      .select("contentJson")
      .eq("pageKey", PAGE_KEY)
      .single();
    if (!data?.contentJson) return defaultSiteCopy;
    return mergeWithDefaults(data.contentJson as Partial<SiteCopy>);
  } catch {
    return defaultSiteCopy;
  }
});

/** 사이트 문안 전체 저장 (upsert). */
export async function writeSiteCopy(sc: SiteCopy): Promise<void> {
  const supabase = getSupabaseClient();
  const { data: existing } = await supabase
    .from("pages")
    .select("id")
    .eq("pageKey", PAGE_KEY)
    .maybeSingle();

  const now = new Date().toISOString();

  if (existing) {
    await supabase
      .from("pages")
      .update({ contentJson: sc, updatedAt: now })
      .eq("pageKey", PAGE_KEY);
  } else {
    await supabase.from("pages").insert({
      id: crypto.randomUUID(),
      pageKey: PAGE_KEY,
      title: "Site Copy",
      slug: PAGE_KEY,
      contentJson: sc,
      status: "PUBLISHED",
      lang: "ko",
      createdAt: now,
      updatedAt: now,
    });
  }
}
