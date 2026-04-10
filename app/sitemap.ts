import type { MetadataRoute } from "next";

import { products } from "@/data/products";
import { SITE_URL } from "@/lib/constants";

const siteUrl = SITE_URL.replace(/\/$/, "");
const now = new Date();

const staticRoutes: Array<{
  path: string;
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;
  priority: number;
}> = [
  { path: "/ko", changeFrequency: "weekly", priority: 1 },
  { path: "/ko/about", changeFrequency: "monthly", priority: 0.9 },
  { path: "/ko/institute", changeFrequency: "monthly", priority: 0.8 },
  { path: "/ko/research", changeFrequency: "weekly", priority: 0.9 },
  { path: "/ko/dmc", changeFrequency: "weekly", priority: 0.9 },
  { path: "/ko/products", changeFrequency: "daily", priority: 0.9 },
  { path: "/ko/news", changeFrequency: "weekly", priority: 0.7 },
  { path: "/ko/contact", changeFrequency: "monthly", priority: 0.8 },
  { path: "/ko/privacy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/ko/terms", changeFrequency: "yearly", priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${siteUrl}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const productEntries: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${siteUrl}/ko/products/${product.id}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticEntries, ...productEntries];
}
