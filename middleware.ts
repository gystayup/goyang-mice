import createMiddleware from "next-intl/middleware";
import { getToken } from "next-auth/jwt";
import { routing } from "./i18n/routing";
import { type NextRequest, NextResponse } from "next/server";

const intlMiddleware = createMiddleware(routing);

const ADMIN_LOGIN_PREFIX = "/admin/login";

type AdminJwt = {
  kind?: string;
  role?: string;
};

export default async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // /admin 경로는 로케일 미들웨어 적용 제외 + 세션 게이트
  if (pathname.startsWith("/admin")) {
    // /admin/login 자체와 그 하위(에러/콜백 등)는 게이트 제외 → 무한 리다이렉트 방지
    if (pathname === ADMIN_LOGIN_PREFIX || pathname.startsWith(`${ADMIN_LOGIN_PREFIX}/`)) {
      return NextResponse.next();
    }

    // NextAuth JWT 세션 검증 (Edge 호환: getToken은 콜백 실행 없이 쿠키만 디코드)
    const token = (await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    })) as (AdminJwt | null);

    const isAdmin =
      token?.kind === "admin" &&
      (token?.role === "SUPER_ADMIN" || token?.role === "OPERATOR");

    if (!isAdmin) {
      const loginUrl = new URL(ADMIN_LOGIN_PREFIX, request.url);
      loginUrl.searchParams.set("callbackUrl", `${pathname}${search}`);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
