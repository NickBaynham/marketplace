---
name: create-astro-content-site
description: Use when building or launching a content-driven static website (artist site, creator site, portfolio, resource hub) on AWS with git-committed content and no backend - especially with on-site audio/video streaming, large downloadable assets, an email-gated downloads area, a press kit, or a production-only environment where automated tests must gate every deploy. Also use when such a site misbehaves - forms that never reach the provider, sections invisible on scroll, social shares without artwork.
---

# Create Astro Content Site

Battle-tested recipe for a static, content-as-data website on AWS, distilled
from a real artist-site build (cyr3nt.com) that shipped through seven phased
production deploys with all gates green. The two failure modes this skill
prevents: over-engineering (adding backends the brief forbids) and
rediscovering pitfalls that already cost debugging sessions.

**Core principle: the simplest architecture that meets the goal, proven in
production from Phase 1.** An engagement gate is not DRM. A static site
needs no Lambda. Launch the skeleton first; add features as phases.

## When NOT to use

Commerce checkouts, user accounts, SaaS dashboards, or content teams that
need a CMS UI - those genuinely need more than static + provider embeds.

## Architecture defaults (deviate only with a stated reason)

| Concern | Default |
|---|---|
| Framework | Astro, static output, content collections with Zod schemas; malformed content fails the build |
| Hosting | AWS Amplify Hosting wired to the repo; push to main = production deploy; custom domain + managed SSL; www to apex 301 |
| Small assets | Repo (`public/`) |
| Large media | One public-read S3 bucket with CORS for the site origin. Repo dir `s3-assets/` is source of truth, synced in `amplify.yml` via `aws s3 sync --delete`, guarded by `if [ -n "$S3_ASSETS_BUCKET" ]` so builds pass before console setup. Files near or over GitHub's 100 MB limit go under an `external/` prefix excluded from sync and uploaded once via CLI |
| Streaming | Native HTML5 `<audio>`/`<iframe>` - no player libraries |
| Mailing list | Hosted provider (e.g. Buttondown); forms POST directly to the provider endpoint with a hidden source tag. Zero backend |
| Gated downloads | Light gate: download URLs only inside inert `<template data-gated>` elements; on submit, unlock client-side and persist a flag in localStorage. Bypassable by design - the goal is list growth, not DRM. No signed URLs, no Lambda |
| Testing | Five layers: unit (Vitest), lint (ESLint + Prettier + astro check + html-validate on dist), security (npm audit + in-repo Semgrep rules), integration (Playwright vs `astro preview`), E2E (Playwright vs the production domain, run after every deploy) |
| SEO | Per-page titles matched to search intent, canonical, sitemap, RSS, JSON-LD (MusicGroup/VideoObject/etc. as fits), raster 1200x630 og:images, robots.txt, deep-linkable landing page per major resource |

## Delivery process

1. Phase the plan: each phase one feature with a written definition of done;
   every step's DoD includes tests (TDD: failing test first).
2. Phase 1 ends with the skeleton live on the real domain and E2E green
   against production - the pipeline is proven before features exist.
3. Every phase ends: full local gates, push, wait for the deploy, run the
   E2E suite against production. Build failures stop work until root-caused.
4. Content is data: adding a release/post/download is a file commit. Use
   collection-driven UI slots (newest item takes a showcase; a `featured`
   flag drives announcements) so content updates never touch components.
5. Backfill every problem hit during implementation into the spec/plan as a
   "Known issue (hit on first run)" note next to the affected step, so a
   re-run never rediscovers it. Keep CHANGELOG/FEATURES/TODO current.

## Pitfalls catalog

**REQUIRED READING before implementing:** [references/pitfalls.md](references/pitfalls.md)
- every entry was hit for real in the reference build and each one costs a
debugging session if rediscovered. Highest-severity three: removing a form
inside its own submit handler silently cancels the provider POST; CSS
scroll-driven reveal animations can leave all content permanently invisible
(use IntersectionObserver added-by-JS instead); og:image must be raster -
crawlers do not render SVG.

## Verification habits that caught real bugs

- Playwright `toBeVisible()` ignores `opacity: 0` - assert computed opacity
  when testing reveal/fade UI.
- Test the real user path, not proxies: the gate bug shipped through five
  green test layers because no test asserted the provider request actually
  fired (route-intercept at context level; the POST happens in a popup).
- Prove negative space: plant a probe (an `eval()`, a fake AWS key) and
  watch the security gate fail; flip a platform flag and watch links vanish.
- After every deploy, run E2E against the production URL, not a preview.
