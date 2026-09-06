import type { Metadata } from "next";

import { AuthProvider } from "@/lib/auth-provider";
import { SITE_DESCRIPTION, SITE_NAME, SITE_OG_IMAGE, SITE_URL } from "@/lib/constants";

import "./globals.css";

const metadataBase = new URL(SITE_URL);

export const metadata: Metadata = {
  metadataBase,
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: ["고양 MICE", "고양 투어", "KINTEX", "고양 숙박", "공항픽업", "DMC 서비스", "고양 문화관광", "K-POP 공연"],
  authors: [{ name: "고양 문화관광·MICE 연구소" }],
  creator: "고양 문화관광·MICE 연구소",
  alternates: {
    canonical: "/ko",
  },
  openGraph: {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: `${SITE_URL.replace(/\/$/, "")}/ko`,
    siteName: SITE_NAME,
    locale: "ko_KR",
    type: "website",
    images: [
      {
        url: SITE_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "고양 문화관광·MICE 연구소",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [SITE_OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ?? undefined,
    other: process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION
      ? { "naver-site-verification": [process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION] }
      : undefined,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 오더 #C69 [1] — root 에서 next-auth SessionProvider (AuthProvider) 로 감싼다.
  //   non-locale 라우트 (/admin/*, /admin/login) 는 app/[locale]/layout.tsx 를
  //   거치지 않아 그동안 SessionProvider 컨텍스트가 없었고, useSession() 이
  //   undefined 를 반환해 /admin 렌더 시 500 발생. root 감싸기로 전 라우트 커버.
  //   locale 하위는 [locale]/layout.tsx 에도 AuthProvider 가 남아 있어 중첩되지만
  //   next-auth SessionProvider 는 중첩 무해.
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full bg-white text-slate-900 antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
