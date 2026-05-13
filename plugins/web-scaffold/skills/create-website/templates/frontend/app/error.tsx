"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="mx-auto max-w-2xl px-6 py-24 text-center">
      <h1 className="text-3xl font-semibold tracking-tight text-[var(--color-heading)]">
        Something went wrong
      </h1>
      <p className="mt-3 text-[var(--color-text-muted)]">
        An unexpected error occurred. Please try again.
      </p>
      {error.digest && (
        <p className="mt-2 text-xs text-[var(--color-text-muted)]">Reference: {error.digest}</p>
      )}
      <button
        onClick={reset}
        className="mt-8 rounded-full bg-[var(--color-accent)] px-5 py-2.5 text-sm font-semibold text-white"
      >
        Try again
      </button>
    </section>
  );
}
