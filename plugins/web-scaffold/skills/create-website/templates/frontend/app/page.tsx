import Link from "next/link";
import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Home",
  description: site.description,
};

export default function HomePage() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-24">
      <p className="text-sm font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
        {site.company}
      </p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight text-[var(--color-heading)] sm:text-5xl">
        {site.tagline}
      </h1>
      <p className="mt-6 text-lg text-[var(--color-text-muted)]">{site.description}</p>
      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          href="/contact"
          className="rounded-full bg-[var(--color-accent)] px-5 py-2.5 text-sm font-semibold text-white"
        >
          Get in touch
        </Link>
        <Link
          href="/about"
          className="rounded-full border border-[var(--color-border)] px-5 py-2.5 text-sm font-semibold text-[var(--color-text)]"
        >
          Learn more
        </Link>
      </div>
    </section>
  );
}
