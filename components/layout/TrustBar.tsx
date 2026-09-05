// components/layout/TrustBar.tsx — 오더 #C60 admin DB 이관 (server wrapper).
//
// #C58 [4] 신뢰 바 UI 는 TrustBarClient.tsx 로 이관.
// 이 파일은 서버에서 readSiteCopy() 호출 · items 를 client 에 props 전달.
// DB 실패 or contentJson 없음 → defaultSiteCopy.trustBar.items (코드 폴백).

import { readSiteCopy } from "@/lib/site-copy-db";

import TrustBarClient from "./TrustBarClient";

export default async function TrustBar() {
  const sc = await readSiteCopy();
  return <TrustBarClient items={sc.trustBar.items} />;
}
