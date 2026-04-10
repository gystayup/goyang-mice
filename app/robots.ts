import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/constants";

const siteUrl = SITE_URL.replace(/\/$/, "");

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/ko"],
        disallow: ["/admin", "/ko/admin", "/api", "/prototype", "/ko/prototype"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
