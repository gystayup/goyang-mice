import NextAuth, { type NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import Kakao from 'next-auth/providers/kakao';

import { touchLastLogin, verifyAdminPassword } from '@/lib/admin-users-db';
import { upsertVisitor } from '@/lib/visitors-db';

// role/kind/uid 필드는 types/next-auth.d.ts 의 모듈 확장으로 이미 Session/User/JWT
// 인터페이스에 노출되어 있으므로, 콜백에서 `as` 캐스팅 없이 직접 접근 가능.

/**
 * 관리자(Credentials) + 방문자(OAuth) 통합 NextAuth.
 * - Credentials 로그인 → kind="admin"
 * - Kakao/Google/Naver OAuth → kind="visitor", Supabase visitors 테이블에 upsert
 * - OAuth 환경변수가 있는 Provider 만 활성화.
 */

const providers: NextAuthConfig['providers'] = [
  Credentials({
    name: 'Credentials',
    credentials: {
      email: { label: 'Email', type: 'text' },
      password: { label: 'Password', type: 'password' },
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) {
        throw new Error('이메일과 비밀번호를 입력하세요.');
      }
      const email = String(credentials.email);
      const password = String(credentials.password);
      const user = await verifyAdminPassword(email, password);
      if (!user) throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.');
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        image: null,
        kind: 'admin' as const,
      };
    },
  }),
];

if (process.env.KAKAO_CLIENT_ID && process.env.KAKAO_CLIENT_SECRET) {
  providers.push(
    Kakao({
      clientId: process.env.KAKAO_CLIENT_ID,
      clientSecret: process.env.KAKAO_CLIENT_SECRET,
    })
  );
}

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  );
}

if (process.env.NAVER_CLIENT_ID && process.env.NAVER_CLIENT_SECRET) {
  // NextAuth v5 는 공식 Naver Provider 가 없어 custom OAuth 로 등록
  providers.push({
    id: 'naver',
    name: 'Naver',
    type: 'oauth',
    clientId: process.env.NAVER_CLIENT_ID,
    clientSecret: process.env.NAVER_CLIENT_SECRET,
    authorization: {
      url: 'https://nid.naver.com/oauth2.0/authorize',
      params: { response_type: 'code' },
    },
    token: 'https://nid.naver.com/oauth2.0/token',
    userinfo: 'https://openapi.naver.com/v1/nid/me',
    checks: ['state'],
    profile(profile: {
      response?: {
        id: string;
        email?: string;
        name?: string;
        nickname?: string;
        profile_image?: string;
      };
    }) {
      const r = profile.response;
      return {
        id: r?.id ?? '',
        name: r?.name ?? r?.nickname ?? '네이버 사용자',
        email: r?.email ?? null,
        image: r?.profile_image ?? null,
      };
    },
  });
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers,
  pages: {
    signIn: '/admin/login', // Credentials 기본. 방문자 로그인은 /login 커스텀 페이지에서 signIn('kakao' 등) 호출
    error: '/admin/login?error=true',
  },
  callbacks: {
    async signIn({ user, account }) {
      // OAuth 로그인 성공 → Supabase visitors 테이블 upsert
      if (account?.provider && account.provider !== 'credentials') {
        try {
          const provider = account.provider as 'kakao' | 'google' | 'naver';
          const providerAccountId =
            account.providerAccountId ?? String(user?.id ?? '');
          if (!providerAccountId) return false;
          const saved = await upsertVisitor({
            provider,
            providerAccountId,
            email: user?.email ?? null,
            name: user?.name ?? '방문자',
            profileImage: user?.image ?? null,
          });
          // user.id 를 visitor id 로 교체 → session.user.id 는 visitor id
          user.id = saved.id;
        } catch (err) {
          console.error('visitor upsert failed:', err);
          // 저장 실패해도 로그인은 허용 (세션에는 provider id 남음)
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      // 최초 로그인 시(user 존재)에만 확장 필드를 토큰에 심는다.
      // 이후 요청에서는 user 가 undefined 라 이 블록을 건너뛰며,
      // JWT 안에 남아 있는 role/kind/uid 가 그대로 유지된다.
      if (user) {
        if (user.role) token.role = user.role;
        token.kind =
          user.kind ??
          (account?.provider && account.provider !== 'credentials' ? 'visitor' : 'admin');
        if (user.id) token.uid = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      // token 의 확장 필드를 session.user 로 노출.
      // isSuperAdmin / isAdminAuthenticated 게이트가 여기 값을 읽는다.
      if (session.user) {
        if (token.role) session.user.role = token.role;
        if (token.kind) session.user.kind = token.kind;
        if (token.uid) session.user.id = token.uid;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  events: {
    async signIn({ user, account }) {
      // 관리자(Credentials) 의 경우만 관리자 lastLoginAt 기록
      if (account?.provider === 'credentials' && user?.id) {
        try {
          await touchLastLogin(user.id);
        } catch (err) {
          console.error('touchLastLogin failed:', err);
        }
      }
    },
    async signOut() {
      /* noop */
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
});

/** 관리자(SUPER_ADMIN/OPERATOR) 접근 확인 */
export async function isAdminAuthenticated() {
  const session = await auth();
  const u = session?.user;
  if (!u || u.kind !== 'admin') return false;
  return u.role === 'SUPER_ADMIN' || u.role === 'OPERATOR';
}

export async function isSuperAdmin() {
  const session = await auth();
  const u = session?.user;
  return u?.kind === 'admin' && u?.role === 'SUPER_ADMIN';
}

/** 방문자 로그인 여부 */
export async function isVisitorAuthenticated() {
  const session = await auth();
  const u = session?.user;
  return u?.kind === 'visitor';
}
