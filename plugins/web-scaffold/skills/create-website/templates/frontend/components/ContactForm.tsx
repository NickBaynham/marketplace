"use client";

import { useId, useRef, useState } from "react";

type Status = "idle" | "sending" | "ok" | "error";

export function ContactForm() {
  const baseId = useId();
  const ids = {
    name: `${baseId}-name`,
    email: `${baseId}-email`,
    message: `${baseId}-message`,
    website: `${baseId}-website`,
  };
  const statusRef = useRef<HTMLParagraphElement | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setError(null);
    const formData = new FormData(event.currentTarget);
    const payload = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      message: String(formData.get("message") ?? ""),
      website: String(formData.get("website") ?? ""),
    };
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
      const response = await fetch(`${apiBase}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      setStatus("ok");
      event.currentTarget.reset();
      statusRef.current?.focus();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setStatus("error");
      statusRef.current?.focus();
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div>
        <label htmlFor={ids.name} className="text-sm font-medium text-[var(--color-text)]">
          Name
        </label>
        <input
          id={ids.name}
          name="name"
          autoComplete="name"
          required
          className="mt-1 w-full rounded-lg border border-[var(--color-border)] bg-white px-3 py-2"
        />
      </div>
      <div>
        <label htmlFor={ids.email} className="text-sm font-medium text-[var(--color-text)]">
          Email
        </label>
        <input
          id={ids.email}
          name="email"
          type="email"
          autoComplete="email"
          required
          className="mt-1 w-full rounded-lg border border-[var(--color-border)] bg-white px-3 py-2"
        />
      </div>
      <div>
        <label htmlFor={ids.message} className="text-sm font-medium text-[var(--color-text)]">
          Message
        </label>
        <textarea
          id={ids.message}
          name="message"
          required
          rows={5}
          className="mt-1 w-full rounded-lg border border-[var(--color-border)] bg-white px-3 py-2"
        />
      </div>
      {/* Honeypot: real users do not see this field; bots that fill every field will trip it. */}
      <div aria-hidden="true" className="hidden">
        <label htmlFor={ids.website}>Website</label>
        <input id={ids.website} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <button
        type="submit"
        disabled={status === "sending"}
        className="rounded-full bg-[var(--color-accent)] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
      >
        {status === "sending" ? "Sending..." : "Send message"}
      </button>
      <p
        ref={statusRef}
        tabIndex={-1}
        role="status"
        aria-live="polite"
        className="text-sm"
      >
        {status === "ok" && <span className="text-green-700">Thanks. Message received.</span>}
        {status === "error" && (
          <span className="text-red-700">Could not send: {error}</span>
        )}
      </p>
    </form>
  );
}
