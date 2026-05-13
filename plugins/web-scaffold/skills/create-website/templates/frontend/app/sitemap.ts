import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { listPosts } from "@/lib/posts";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = `https://${site.domain}`;
  const now = new Date();

  const staticUrls: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${base}/news`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.5 },
  ];

  const [blog, news] = await Promise.all([listPosts("blog"), listPosts("news")]);

  const postUrls: MetadataRoute.Sitemap = [
    ...blog.map((p) => ({
      url: `${base}/blog/${p.slug}`,
      lastModified: p.date ? new Date(p.date) : now,
      changeFrequency: "yearly" as const,
      priority: 0.4,
    })),
    ...news.map((p) => ({
      url: `${base}/news/${p.slug}`,
      lastModified: p.date ? new Date(p.date) : now,
      changeFrequency: "yearly" as const,
      priority: 0.4,
    })),
  ];

  return [...staticUrls, ...postUrls];
}
