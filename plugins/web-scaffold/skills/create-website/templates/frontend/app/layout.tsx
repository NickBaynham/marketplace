import type { Metadata } from "next";
import Link from "next/link";
import { Analytics } from "@/components/Analytics";
import { site } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(`https://${site.domain}`),
  title: {
    default: `${site.name}`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  openGraph: {
    title: site.name,
    description: site.description,
    siteName: site.company,
    type: "website",
  },
};

const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/news", label: "News" },
  { href: "/contact", label: "Contact" },
];

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        <header className="border-b border-[var(--color-border)]">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <Link href="/" className="font-semibold text-[var(--color-heading)]">
              {site.name}
            </Link>
            <nav className="flex gap-6 text-sm text-[var(--color-text-muted)]">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} className="hover:text-[var(--color-text)]">
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-[var(--color-border)] py-8 text-sm text-[var(--color-text-muted)]">
          <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-3 px-6 sm:flex-row sm:items-center">
            <span>
              &copy; {{year}} {site.company}. All rights reserved.
            </span>
            <span>
              <a href={`mailto:${site.contactEmail}`} className="hover:text-[var(--color-text)]">
                {site.contactEmail}
              </a>
            </span>
          </div>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
