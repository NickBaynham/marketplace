import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto max-w-2xl px-6 py-24 text-center">
      <p className="text-sm font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
        404
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--color-heading)]">
        Page not found
      </h1>
      <p className="mt-3 text-[var(--color-text-muted)]">
        The page you were looking for does not exist or has moved.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block rounded-full bg-[var(--color-accent)] px-5 py-2.5 text-sm font-semibold text-white"
      >
        Back home
      </Link>
    </section>
  );
}
