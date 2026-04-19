import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

import { touchLastLogin, verifyAdminPassword } from '@/lib/admin-users-db';

type UserRole = 'SUPER_ADMIN' | 'OPERATOR' | 'EDITOR' | 'PARTNER_MANAGER';
type TokenWithRole = { role?: UserRole; uid?: string };
type UserWithRole = { role?: UserRole };

/**
 * NextAuth 설정
 * 관리자 로그인 및 세션 관리 — Supabase pages 테이블의 admin-users row 에 저장된
 * bcrypt 해시 계정과 비교합니다.
 */

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
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
        if (!user) {
          throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.');
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          image: null,
        };
      },
    }),
  ],
  pages: {
    signIn: '/admin/login',
    error: '/admin/login?error=true',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user && 'role' in user) {
        (token as typeof token & TokenWithRole).role = (user as UserWithRole).role;
      }
      if (user?.id) {
        (token as typeof token & TokenWithRole).uid = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as typeof session.user & UserWithRole).role = (
          token as typeof token & TokenWithRole
        ).role;
        const uid = (token as typeof token & TokenWithRole).uid;
        if (uid) {
          (session.user as typeof session.user & { id?: string }).id = uid;
        }
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl + '/admin';
    },
  },
  events: {
    async signIn({ user }) {
      if (user?.id) {
        try {
          await touchLastLogin(user.id);
        } catch (err) {
          console.error('touchLastLogin failed:', err);
        }
      }
    },
    async signOut() {
      // 별도 기록 필요 시 여기서 처리
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
});

/**
 * 관리자 권한 확인 유틸
 */
export async function isAdminAuthenticated() {
  const session = await auth();
  const role = (session?.user as UserWithRole | undefined)?.role;
  return role === 'SUPER_ADMIN' || role === 'OPERATOR';
}

export async function isSuperAdmin() {
  const session = await auth();
  const role = (session?.user as UserWithRole | undefined)?.role;
  return role === 'SUPER_ADMIN';
}
