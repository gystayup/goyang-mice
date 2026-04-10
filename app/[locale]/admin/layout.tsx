import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "관리자",
  description: "고양 MICE 플랫폼 관리자 페이지",
  robots: {
    index: false,
    follow: false,
  },
};

export default function LocaleAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
