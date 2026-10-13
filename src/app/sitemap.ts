import { SITE_URL } from "@/lib/seo";
import type { MetadataRoute } from "next";
import sql from "@/lib/db";
import { CATEGORIES } from "@/lib/categories";

// 새 글이 재배포 없이 sitemap에 들어가도록 1시간마다 다시 만든다 (2026-10-14 컨트롤타워: 배포 후 고정돼 새 글 누락)
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = SITE_URL;

  const rows = await sql`SELECT slug, updated_at FROM posts WHERE status = 'published' ORDER BY published_at DESC`;

  const postEntries: MetadataRoute.Sitemap = rows.map((post) => ({
    url: `${siteUrl}/posts/${post.slug}`,
    lastModified: new Date(post.updated_at),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${siteUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];

  const categoryPages: MetadataRoute.Sitemap = CATEGORIES.map((c) => ({
    url: `${siteUrl}/category/${c.key}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.9,
  }));
  const extraPages: MetadataRoute.Sitemap = [{ url: `${siteUrl}/disclosure`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.2 }];

  return [...staticPages, ...categoryPages, ...extraPages, ...postEntries];
}
