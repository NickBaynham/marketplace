import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: `About ${site.company}.`,
};

export default function AboutPage() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight text-[var(--color-heading)]">
        About {site.company}
      </h1>
      <p className="mt-6 text-[var(--color-text-muted)]">{site.description}</p>
      <p className="mt-4 text-[var(--color-text-muted)]">
        Tell the story here: what problem you solve, who you serve, and why. Replace this
        copy with content drawn from <code>docs/SITE.md</code> or your own draft.
      </p>
    </section>
  );
}
