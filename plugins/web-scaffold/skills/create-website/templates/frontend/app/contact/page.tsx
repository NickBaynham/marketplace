import type { Metadata } from "next";
import { site } from "@/lib/site";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${site.company}.`,
};

export default function ContactPage() {
  return (
    <section className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight text-[var(--color-heading)]">Contact</h1>
      <p className="mt-3 text-[var(--color-text-muted)]">
        Email <a className="underline" href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>, or send a message below.
      </p>
      <div className="mt-8">
        <ContactForm />
      </div>
    </section>
  );
}
