import Link from "next/link";
import type { Metadata } from "next";
import { listPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "News",
  description: "Announcements and updates.",
};

export default async function NewsIndexPage() {
  const posts = await listPosts("news");
  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight text-[var(--color-heading)]">News</h1>
      <ul className="mt-8 divide-y divide-[var(--color-border)]">
        {posts.map((post) => (
          <li key={post.slug} className="py-5">
            <Link href={`/news/${post.slug}`} className="text-lg font-medium text-[var(--color-heading)] hover:underline">
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
