# web-scaffold — TODO

Findings from the initial quality review. Items are ordered by severity. Status legend: `[x]` done, `[ ]` open, `[~]` deferred.

## Bugs (block real use)

- [x] **Missing `email-validator` dependency.** Fixed in `backend/pyproject.toml`: now `pydantic[email]>=2.7`.
- [x] **`vitest.config.ts` uses bare `__dirname`.** Replaced with `fileURLToPath(new URL("./", import.meta.url))`.
- [x] **CI `npm ci` runs before any lock file exists.** CI now uses `npm ci` only when `package-lock.json` is present, else falls back to `npm install`. Backend CI runs `pdm lock` on the fly if `pdm.lock` is missing.
- [x] **JSX templates contain raw `{{year}}` and `{{accent_color}}` tokens.** Documented in `SKILL.md` (the "Note" under placeholders) — templates are not standalone-valid until substitution. The substitution step now includes a verify-no-raw-tokens scan.

## Robustness / correctness

- [x] **Dockerfile venv strategy is implicit.** Switched to a two-stage build with an explicit `pdm venv create` + `pdm use` in the builder stage; runtime stage copies just the `.venv` and `src/`.
- [x] **No `pdm.lock` committed.** Skill next-steps now include `pdm lock` (via `make setup`) and commit guidance. Generated `TODO.md` calls out the lockfile commit explicitly.
- [x] **`SKILL.md` does not specify a copy mechanism.** Step 4 now mandates per-file `Read` → substitute → `Write`, forbids `cp -r`, and ships an authoritative file manifest.
- [x] **No conflict-resolution policy in `SKILL.md`.** Step 7 (Re-run handling) added, plus an exact prompt template `[k] keep / [r] replace / [d] diff`.
- [x] **`amplify.yml` monorepo prompt not flagged.** Next-steps now print `When asked for the monorepo "App root", enter: frontend`. Same line is in the generated `TODO.md`.
- [x] **`docker-compose.yml` requires `backend/.env`.** Switched to Compose v2 `env_file: { path, required: false }` and added `environment:` fallbacks for `APP_ENV` and `CORS_ORIGINS`.
- [x] **No rate limiting or honeypot on `/contact`.** Added `slowapi` rate limit (default `5/minute`, configurable via `CONTACT_RATE_LIMIT`) and a `website` honeypot field on both the Pydantic model and the React form (visually hidden, `aria-hidden`, `tabIndex=-1`). Backend test confirms a filled honeypot returns 422.
- [x] **CORS list missing `www`.** `backend/.env.example` now seeds CORS with `http://localhost:3000,https://{{domain}},https://www.{{domain}}`.
- [x] **Domain validation regex disallows uppercase.** `references/content-prompts.md` now requires lowercasing and stripping `https://` / `www.` before applying the regex.

## Skill quality

- [x] **No examples of end-to-end invocation.** Added an "Example transcript" section in `SKILL.md`.
- [x] **Triggering description too broad.** Rewrote the frontmatter description with explicit negatives (existing-site edits, single pages, SaaS dashboards, non-marketing apps, non-web projects).
- [x] **Re-run flow not concretely specified.** Step 7 in `SKILL.md` now includes the exact prompt template the model should use when a file diverges from its template.
- [~] **No skill-level eval.** Deferred. Plan: use `anthropic-skills:skill-creator` to seed an evals dataset of representative trigger / non-trigger prompts. Not blocking the first usable release.

## Generated-project polish

- [x] `app/not-found.tsx` and `app/error.tsx` templates.
- [x] `app/sitemap.ts` (covers static pages + every MDX post via `listPosts`).
- [x] `app/robots.ts`.
- [x] `app/opengraph-image.tsx` (1200×630 PNG generated at build time via `next/og`).
- [x] `app/manifest.webmanifest`.
- [x] `lib/posts.test.ts` (empty directory + public API surface).
- [x] `components/ContactForm.test.tsx` (mocks `fetch`; asserts payload, status messaging, and error path).
- [x] `.editorconfig` and `.prettierrc.json`.
- [x] ContactForm a11y: `useId`-based label/input pairing, `aria-live="polite"` status, focus management to the status region on submit, `noValidate` to keep error UX consistent, `autoComplete` hints.
- [x] Tailwind v4 `@theme` expanded: accent variants via `color-mix`, surface tokens, display/mono fonts, radii/spacing tokens, and `.prose` color mapping for blog/news.
- [x] Analytics: optional `Analytics` component (Plausible or PostHog), driven by `NEXT_PUBLIC_ANALYTICS_PROVIDER`. New prompt field `analytics` added to step 3 in `SKILL.md`.

## Marketplace / plugin metadata

- [x] `LICENSE` at the marketplace root and at the plugin root (proprietary / all-rights-reserved, mirroring the user's other repos).
- [x] `plugin.json` now declares `homepage`, `repository`, and `license`.
- [x] `marketplace.json` plugin entry now includes `version` (mirrors `plugin.json`).
- [~] No screenshot or short demo. Deferred — marketplace UI does not yet require previews.

## Future expansion (deferred — explicitly out of scope for this pass)

- [~] Optional database wiring (Postgres + SQLAlchemy + Alembic).
- [~] Optional auth (Clerk / Auth.js / Cognito).
- [~] Alternate deploy targets surfaced as prompts (ECS Fargate, Lambda).
- [~] Second skill `update-website` for adding a page or route to an existing scaffold.

## Verification still owed

- [ ] Smoke-test the skill end-to-end against an empty directory and confirm the generated tree builds (`make ci`).
- [ ] Run the generated frontend dev server and exercise all five pages, the 404, the error boundary, and a contact form submission.
- [ ] Run the generated backend tests (`pdm run test`) and confirm honeypot + rate-limit behavior.
