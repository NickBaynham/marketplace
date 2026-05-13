import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPost, listPosts } from "@/lib/posts";

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  const posts = await listPosts("blog");
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost("blog", slug);
  if (!post) return {};
  return { title: post.title, description: post.summary };
}

export default async function BlogPostPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const post = await getPost("blog", slug);
  if (!post) notFound();
  const Body = post.Body;
  return (
    <article className="prose mx-auto max-w-3xl px-6 py-16">
      <h1>{post.title}</h1>
      <p className="text-sm text-[var(--color-text-muted)]">{post.date}</p>
      <Body />
    </article>
  );
}
