# Pitfalls Catalog

Every entry below was hit during the reference build (cyr3nt.com,
Astro 7 / Amplify / S3, 2026). Format: symptom, cause, fix. Severity
CRITICAL means user-facing breakage that shipped past green tests.

## Forms and the email gate

### CRITICAL: Removing a form in its submit handler cancels the submission

Symptom: gate "works" visually, but the mailing-list provider never
receives any subscriber. Cause: calling `form.remove()` synchronously
inside the `submit` event - the browser re-checks that the form can
navigate after the event fires, and a disconnected form cannot, so the
POST is silently aborted. Fix: `form.hidden = true` in the submit path;
reserve `remove()` for paths with no submission in flight. Add
`form[hidden] { display: none; }` because a scoped `form { display: flex }`
outranks the UA `[hidden]` rule (second-order bug: the "hidden" form stays
visible).

### Testing the gate: the provider POST happens in a popup

`page.route()` never sees it. Use context-level `context.route()` plus
`page.waitForEvent("popup")`, assert both, then close the popup. Prove the
test catches the regression by temporarily reintroducing the bug.

### Gate markup: no anchor before unlock

Put download URLs in inert `<template data-gated data-url data-title>`
elements. The built page then contains zero `<a>` tags for gated assets
even with JavaScript disabled; the unlock script materializes links
(`rel="noopener"`, `target="_blank"`). Store only an unlock flag in
localStorage, never the email.

## CSS and visual

### CRITICAL: Scroll-driven reveal animations can hide all content

Symptom: everything below the hero renders at `opacity: 0` in some
Chromium environments even though `CSS.supports("animation-timeline: view()")`
is true; Playwright `toBeVisible()` still passes (it ignores opacity), so
tests stay green. Fix: never let CSS alone hold content at opacity 0. Use
IntersectionObserver: content is visible by default; JS adds the hiding
class at init and a reveal class on intersect; no-JS users see everything.
Assert computed opacity in an integration test.

### Mirrored/transformed glyphs displace their own letter-spacing

`transform: scaleX(-1)` on an inline-block letter flips its trailing
letter-spacing to the wrong side (double gap before, collision after).
Zero the glyph's letter-spacing and restore the gap with margin. Wide
tracking also needs `white-space: nowrap` plus a smaller font clamp, and
inline-block fragments the accessible name - put `role="img"` +
`aria-label` on the wordmark wrapper.

### Digit glyphs may not cap-align

Some display faces (e.g. Syne) draw numerals below the capitals with equal
ink height. Measure with canvas `TextMetrics` (actualBoundingBoxAscent) and
correct with `transform: translateY(-0.15em)`; `font-variant-numeric:
lining-nums` may do nothing.

## Astro specifics

### JSON-LD scripts need `is:inline`

Without it Astro processes `<script type="application/ld+json">` as a
bundled module. Applies to any literal script tag rendered in a layout.

### create-astro cannot scaffold into a non-empty directory non-interactively

And older flags (`--typescript`) have been removed. Scaffold in a scratch
directory and copy files in, or hand-create package.json + tsconfig. The
end state matters, not the scaffolder.

### `astro check` excess-property errors on test fixtures

Passing an object literal with extra fields to a typed param is a TS
error only for literals. Add an index signature (`[key: string]: unknown`)
to the param type rather than widening real fields.

## Playwright

### Strict-mode substring collisions grow over time

`getByRole("heading", { name: "CYR3NT" })` matches "CYR3NT Serum 2 Patch
Collection" the day that heading appears. Use `exact: true` for brand
names likely to become prefixes of future headings - in E2E suites too,
not just integration.

### `toBeVisible()` ignores opacity

Assert `getComputedStyle(el).opacity` when the UI under test fades or
reveals. This is how an invisible-content bug ships through green suites.

### Scope list counts

`getByRole("listitem")` double-counts nested lists; scope to a testid
container or direct children (`.grid > li`).

## Build pipeline and AWS

### Guard optional build steps against unset environment

`aws s3 sync` in `amplify.yml` fails every deploy until the env var and
service role exist. Wrap in `if [ -n "$S3_ASSETS_BUCKET" ]` with an else
echo so bootstrap deploys pass and the skip is visible in logs.

### `aws s3 sync --delete` needs an escape hatch for huge files

Sync from a repo directory means git carries every synced byte (GitHub
hard limit 100 MB/file). Exclude an `external/*` prefix from the sync and
upload those (400 MB WAVs, full sets) once via `aws s3 cp`. Distribute
audio as tagged 320 kbps MP3, not the raw WAV.

### Amplify console steps block CLI automation

Connecting the GitHub repo (OAuth app install) and, in restricted
sessions, `amplify update-app` are console/user actions. Design the plan
so those are explicit USER ACTION steps; provide the exact one-shot CLI
command as the alternative. `update-app --custom-rules` REPLACES the rule
list - fetch and preserve existing rules (e.g. the SPA 404 rewrite) when
adding the www redirect.

### Locale/ICU drift breaks date tests

`toLocaleDateString("en-GB")` renders September as "Sept" in current ICU.
Build dates from `Intl.DateTimeFormat("en-US").formatToParts` and pin UTC.

### Logged-out Semgrep registry packs detect almost nothing

`p/ci`, `p/security-audit`, even planted `eval()` and AWS keys pass. Ship
an in-repo `.semgrep/rules.yaml` and prove the gate by planting a probe
and watching the build fail.

### html-validate rejects inline styles and redundant roles

Scoped `<style>` blocks only; no `style=""` attributes; no `role="list"`
on `<ul>` (style with `list-style: none` instead).

## SEO and sharing

### og:image must be raster

Facebook/Discord/X crawlers do not render SVG. Generate 1200x630 PNG
cards (render an HTML template with the site's real fonts via headless
browser screenshot). Absolute URLs only.

### Titles should match search intent, not site nav

"Downloads" ranks for nothing; "Free Serum 2 Presets for Melodic Techno -
ARTIST" targets what producers type. Give every major free resource its
own deep-linkable landing page - external links then land their equity on
a page about that resource.

### Structured data pairs with the content type

MusicGroup (artist, sameAs filtered by platform visibility), MusicAlbum
with ItemList of MusicRecording, MusicEvent per gig, VideoObject for
embedded sets (thumbnail derivable from the YouTube ID). Fetch real video
titles via oEmbed rather than guessing.

## Product logic

### The "newest item" slot must handle every content type

A latest-release spotlight built for singles breaks the day an album is
newest (no audioUrl - silent dead end). When a collection drives a
showcase, handle each variant and link to the type's detail page. Do not
dodge with fixture dates - fix the component and let fixtures exercise
the real state.

### Site-wide flags must actually be site-wide

A platform visibility flag consulted by one component and hardcoded in
another (footer filtering only spotify) is worse than no flag. Route
every consumer - links, embeds, JSON-LD sameAs, nav - through one
predicate, and make the toggle test flip a real flag against real content.

### Same-day events vanish at midnight

Date-only frontmatter parses to 00:00 UTC; filtering `>= now` hides
tonight's gig all day. Compare against start of current UTC day.
