import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

type UserRole = 'SUPER_ADMIN' | 'OPERATOR' | 'EDITOR' | 'PARTNER_MANAGER';
type TokenWithRole = { role?: UserRole };
type UserWithRole = { role?: UserRole };

/**
 * NextAuth 설정
 * 관리자 로그인 및 세션 관리
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

        // TODO: 데이터베이스에서 사용자 조회
        // const user = await db.user.findUnique({
        //   where: { email: credentials.email },
        // });
        //
        // if (!user) {
        //   throw new Error('사용자를 찾을 수 없습니다.');
        // }
        //
        // // 비밀번호 검증 (bcrypt 사용)
        // const isPasswordValid = await bcrypt.compare(
        //   credentials.password,
        //   user.passwordHash
        // );
        //
        // if (!isPasswordValid) {
        //   throw new Error('비밀번호가 올바르지 않습니다.');
        // }
        //
        // if (user.status !== 'ACTIVE') {
        //   throw new Error('비활성화된 계정입니다.');
        // }

        // 환경변수 기반 관리자 계정 (DB 연동 전 사용)
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@goyangmice.kr';
        const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

        if (
          credentials.email === adminEmail &&
          credentials.password === adminPassword
        ) {
          return {
            id: '1',
            email: credentials.email,
            name: 'Admin',
            role: 'SUPER_ADMIN' as UserRole,
            image: null,
          };
        }

        throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.');
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
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as typeof session.user & UserWithRole).role = (
          token as typeof token & TokenWithRole
        ).role;
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
      // TODO: 로그인 기록
      console.log('User signed in:', user.email);
    },
    async signOut() {
      // TODO: 로그아웃 기록
      console.log('User signed out');
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
