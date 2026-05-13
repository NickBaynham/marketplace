# Features

What this site currently does. Update as you add features.

## Pages

- Landing (`/`)
- About (`/about`)
- Blog (`/blog`, `/blog/[slug]`)
- News (`/news`, `/news/[slug]`)
- Contact (`/contact`)
- 404 (`app/not-found.tsx`) and error boundary (`app/error.tsx`)

## SEO and metadata

- `app/sitemap.ts` produces `/sitemap.xml` (static pages + every MDX post).
- `app/robots.ts` produces `/robots.txt` pointing at the sitemap.
- `app/opengraph-image.tsx` generates a 1200×630 OG image at build time.
- `app/manifest.webmanifest` exposes a basic PWA manifest.

## Backend

- `GET /health` — liveness probe used by App Runner.
- `POST /contact` — accepts `{ name, email, message, website }`. Validated via Pydantic, rate-limited (default 5/min per IP), with a `website` honeypot. Optionally relays to Resend if `RESEND_API_KEY` is set.

## Tooling

- Vitest tests for frontend (`*.test.ts(x)` next to source). Includes `lib/posts.test.ts` and a ContactForm integration test.
- Pytest tests for backend (`tests/`). Includes a honeypot rejection test.
- ESLint, TypeScript, ruff, mypy.
- Prettier config and `.editorconfig` for consistent formatting across the repo.
- GitHub Actions CI for every PR and push to `main` / `develop`. Tolerates a missing initial lockfile.
- Multi-stage Dockerfile + docker-compose for local backend container.

## Analytics

- Optional `Analytics` component (`components/Analytics.tsx`) that switches between Plausible, PostHog, or none via `NEXT_PUBLIC_ANALYTICS_PROVIDER`. Off by default.

## Deployment

- AWS Amplify Hosting for the Next.js frontend (`amplify.yml` configured for monorepo `appRoot: frontend`).
- AWS App Runner for the FastAPI backend.
- Route 53 for DNS, ACM for TLS.
