// 클라이언트 컴포넌트(useSession 포함)를 정적 prerender에서 제외
// → 빌드 시 useSession undefined 에러로 Vercel 배포 전체가 실패하던 문제 해결
export const dynamic = "force-dynamic";

export { default } from "./_page";
