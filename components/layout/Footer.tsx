// components/layout/Footer.tsx — 오더 #C60 admin DB 이관 (server wrapper).
//
// #C58 [5] Footer UI 는 FooterClient.tsx 로 이관.
// 이 파일은 서버에서 readSiteCopy() 호출 · 사업자 정보·disclaimer·BEST 라벨을
// client 에 props 전달. DB 실패 → defaultSiteCopy 폴백.

import { readSiteCopy } from "@/lib/site-copy-db";

import FooterClient from "./FooterClient";

export default async function Footer() {
  const sc = await readSiteCopy();
  return (
    <FooterClient
      business={sc.footer}
      bestLabelOverride={sc.bestCategories.label}
    />
  );
}
