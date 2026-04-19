import type { Metadata } from "next";

import Shell from "@/components/layout/Shell";
import LoginPanel from "@/components/auth/LoginPanel";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "로그인 | 고양특례시 K-컬처플랫폼",
  description:
    "카카오·구글·네이버로 간편하게 로그인하고 예약·문의 이력을 관리하세요.",
};

export default async function VisitorLoginPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}) {
  const { locale } = await params;
  const { callbackUrl, error } = await searchParams;
  return (
    <Shell>
      <LoginPanel locale={locale} callbackUrl={callbackUrl} error={error} />
    </Shell>
  );
}
