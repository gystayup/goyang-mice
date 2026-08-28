// NextAuth v5 module augmentation.
// Session.user / User / JWT 에 관리자·방문자 세션에서 쓰는 role/kind/id/uid 필드를 확장.
// 이 확장으로 lib/auth.ts 콜백에서 `as` 캐스팅 없이 필드에 직접 접근 가능.
import type { DefaultSession } from "next-auth";

type AdminRole =
  | "SUPER_ADMIN"
  | "OPERATOR"
  | "EDITOR"
  | "PARTNER_MANAGER";

type SessionKind = "admin" | "visitor";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      role?: AdminRole;
      kind?: SessionKind;
    } & DefaultSession["user"];
  }

  interface User {
    role?: AdminRole;
    kind?: SessionKind;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: AdminRole;
    kind?: SessionKind;
    uid?: string;
  }
}

export {};
