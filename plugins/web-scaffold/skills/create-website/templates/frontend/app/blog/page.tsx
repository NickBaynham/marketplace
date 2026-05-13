import Link from "next/link";
import type { Metadata } from "next";
import { listPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Blog",
  description: "Long-form posts.",
};

export default async function BlogIndexPage() {
  const posts = await listPosts("blog");
  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight text-[var(--color-heading)]">Blog</h1>
      <ul className="mt-8 divide-y divide-[var(--color-border)]">
        {posts.map((post) => (
          <li key={post.slug} className="py-5">
            <Link href={`/blog/${post.slug}`} className="text-lg font-medium text-[var(--color-heading)] hover:underline">
              {post.title}
            </Link>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">
              {post.date} · {post.summary}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
