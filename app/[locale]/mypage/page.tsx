import { redirect } from "next/navigation";
import type { Metadata } from "next";

import Shell from "@/components/layout/Shell";
import MyPagePanel from "@/components/auth/MyPagePanel";
import { auth } from "@/lib/auth";
import { findVisitorById } from "@/lib/visitors-db";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "마이페이지 | 고양특례시 GOYANG DMC",
};

export default async function MyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await auth();
  const user = session?.user as
    | { id?: string; kind?: "admin" | "visitor"; name?: string | null; email?: string | null; image?: string | null }
    | undefined;

  if (!user || user.kind !== "visitor" || !user.id) {
    redirect(`/${locale}/login?callbackUrl=/${locale}/mypage`);
  }

  const visitor = await findVisitorById(user.id!);

  return (
    <Shell>
      <MyPagePanel
        locale={locale}
        visitor={
          visitor ?? {
            id: user.id!,
            name: user.name ?? "방문자",
            email: user.email ?? null,
            phone: null,
            profileImage: user.image ?? null,
            marketingAgree: false,
            provider: "kakao",
            providerAccountId: "",
            lastLoginAt: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
        }
      />
    </Shell>
  );
}
