import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
      {
        protocol: "https",
        hostname: "**.supabase.in",
      },
    ],
  },
  // 오더 #C53-R [1]-C: /research → /institute 통합.
  // 아카이브 UI 는 /institute 안으로 이관됐고, 외부 링크·SEO 보존 위해 301.
  async redirects() {
    return [
      {
        source: "/research",
        destination: "/institute",
        permanent: true,
      },
      {
        source: "/:locale(ko|en|ja|zh-CN|zh-TW)/research",
        destination: "/:locale/institute",
        permanent: true,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
