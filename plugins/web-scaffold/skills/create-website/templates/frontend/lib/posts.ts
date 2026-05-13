import { readdirSync } from "node:fs";
import path from "node:path";
import type { ComponentType } from "react";

export type PostKind = "blog" | "news";

export type PostMeta = {
  slug: string;
  title: string;
  date: string;
  summary: string;
};

export type Post = PostMeta & { Body: ComponentType };

function slugsFor(kind: PostKind): string[] {
  const dir = path.join(process.cwd(), "content", kind);
  try {
    return readdirSync(dir)
      .filter((f) => f.endsWith(".mdx"))
      .map((f) => f.replace(/\.mdx$/, ""));
  } catch {
    return [];
  }
}

async function loadMdx(kind: PostKind, slug: string) {
  if (kind === "blog") return import(`@/content/blog/${slug}.mdx`);
  return import(`@/content/news/${slug}.mdx`);
}

async function loadPost(kind: PostKind, slug: string): Promise<Post | null> {
  try {
    const mod = await loadMdx(kind, slug);
    const meta = (mod.meta ?? {}) as Partial<PostMeta>;
    return {
      slug,
      title: meta.title ?? slug,
      date: meta.date ?? "",
      summary: meta.summary ?? "",
      Body: mod.default as ComponentType,
    };
  } catch {
    return null;
  }
}

export async function listPosts(kind: PostKind): Promise<PostMeta[]> {
  const slugs = slugsFor(kind);
  const posts = await Promise.all(slugs.map((s) => loadPost(kind, s)));
  return posts
    .filter((p): p is Post => p !== null)
    .map(({ slug, title, date, summary }) => ({ slug, title, date, summary }))
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getPost(kind: PostKind, slug: string): Promise<Post | null> {
  return loadPost(kind, slug);
}
