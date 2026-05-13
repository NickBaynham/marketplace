---
name: create-website
description: Use this skill when the user wants to create or scaffold a new website project from scratch with a Next.js frontend, a FastAPI backend, AWS Amplify hosting for the frontend, AWS App Runner for the backend, a Route 53 custom domain, and HTTPS. Triggers include phrases like "scaffold a new website", "create a new site", "set up a marketing site", "new Next.js + FastAPI project", "bootstrap a website with landing/about/blog/news/contact". Do NOT use when the user wants to add a single page or feature to an existing site, edit copy on a deployed site, set up only the frontend without a backend (or vice versa), build a non-marketing web app (SaaS dashboard, admin tool, internal app), or set up a non-web project. Re-running on an already-scaffolded project is allowed but the skill must diff and ask before overwriting any edited file.
---

# create-website

Scaffold a new website project that mirrors the reference stack (Next.js + FastAPI), with five starter pages and an AWS deployment story (Amplify frontend, App Runner backend, Route 53 + ACM for the domain and HTTPS).

This skill is **scaffolding only**. It does not invent product copy beyond what the user provides or what `docs/SITE.md` describes — placeholders are filled with generic but coherent defaults.

## When to use

Trigger when the user wants to bootstrap a new website from scratch. Do **not** trigger for:

- Edits to an existing site, including adding a page or changing copy.
- Single-page generation outside of a scaffold.
- SaaS dashboards, admin tools, or any non-marketing/non-content app.
- Non-web projects.

## What it produces

A working project tree containing:

- `frontend/` — Next.js (App Router) + React + TypeScript + Tailwind + MDX. Pages: `/`, `/about`, `/blog`, `/news`, `/contact`. Plus `not-found`, `error`, `sitemap`, `robots`, OG image. Vitest tests, ESLint.
- `backend/` — FastAPI managed with pdm. Endpoints: `GET /health`, `POST /contact` (rate-limited, with honeypot). Pytest. Multi-stage Dockerfile suitable for App Runner.
- `Makefile` — `setup`, `configure`, `dev`, `lint`, `typecheck`, `test`, `ci`, `docker-up`, `docker-down`, `build`, `deploy-check`.
- `amplify.yml` — Amplify build spec for the frontend (monorepo-aware: `appRoot: frontend`).
- `docker-compose.yml` — Local infra (Postgres included but commented out; uncomment if the backend needs persistence).
- `.github/workflows/ci.yml` — Lint, typecheck, test, build for both frontend and backend; tolerates a missing initial lockfile.
- `docs/SITE.md` — Where the user describes what the site is about (read by this skill on subsequent runs).
- `README.md`, `FEATURES.md`, `TODO.md`, `CHANGELOG.md`, `.gitignore`, `.editorconfig`, Prettier config, `.env.example`.

## Steps

Follow these steps **in order**. Confirm with the user before any destructive action.

### 1. Confirm target directory

- Default target: the current working directory.
- If the directory is non-empty:
  - Detect whether it is already a scaffold produced by this skill — look for `frontend/lib/site.ts`. If yes, treat this as a **re-run** (see step 7).
  - Otherwise, ask whether to (a) target a subdirectory, (b) proceed and merge, or (c) abort. Never blindly overwrite.

### 2. Look for a site description

- If `docs/SITE.md` exists in the target, read it — its contents inform placeholder page copy.
- If not, ask the user whether they want to (a) provide a `docs/SITE.md` now, (b) paste a description inline, or (c) proceed with generic copy.

### 3. Prompt for site specifics

Ask for these fields. Mark fields with sensible defaults so the user can press enter through them. The full prompt list and examples are in [`references/content-prompts.md`](./references/content-prompts.md).

| Field | Example |
|---|---|
| `site_name` | VerifiedSignal |
| `company` | Calgentik |
| `domain` | calgentik.com |
| `tagline` | Document intelligence you can verify. |
| `description` | One-sentence what-and-for-whom. |
| `contact_email` | hello@calgentik.com |
| `github_repo` | https://github.com/owner/repo |
| `accent_color` | `#5b8def` (hex, optional) |
| `analytics` | `plausible` \| `posthog` \| `none` (default `none`) |

Backend domain defaults to `api.{{domain}}`. Normalize `domain` to lowercase and strip any accidental `https://` or `www.` prefix before storing.

### 4. Generate the project

For **each file** under [`templates/`](./templates/):

1. Read the template with the `Read` tool.
2. Substitute every `{{token}}` listed below. After substitution there must be **no** remaining `{{` sequences in any file the user can see. Verify this with a final scan; if any remain, treat the run as a bug.
3. Write the substituted content to the corresponding path in the target directory with the `Write` tool. Preserve the relative path under `templates/` — e.g., `templates/frontend/app/page.tsx` becomes `<target>/frontend/app/page.tsx`.

Use the file manifest below as the authoritative list. Do **not** use `cp -r`: Bash copy preserves the raw `{{…}}` tokens.

#### Placeholders

- `{{site_name}}`
- `{{company}}`
- `{{domain}}` — already lowercased; no scheme, no `www.`, no trailing slash
- `{{api_domain}}` — defaults to `api.{{domain}}`
- `{{tagline}}`
- `{{description}}`
- `{{contact_email}}`
- `{{github_repo}}`
- `{{accent_color}}`
- `{{site_name_slug}}` — derived: `site_name` lowercased, non-alphanumeric replaced with `-`, collapsed and trimmed (e.g., `VerifiedSignal` → `verifiedsignal`, `Acme Co.` → `acme-co`). Used in package names and image tags.
- `{{year}}` — current year as a four-digit integer

Note: the templates contain `{{token}}` literals that are **not valid TypeScript, JSX, CSS, or TOML on their own** (e.g., `&copy; {{year}}` in JSX parses as object shorthand). They become valid only after substitution. The skill must always substitute before writing.

#### File manifest

Files marked **substitute** must run through token replacement; files marked **copy** may be written verbatim.

| Source under `templates/` | Mode |
|---|---|
| `.gitignore` | copy |
| `.editorconfig` | copy |
| `.prettierrc.json` | copy |
| `Makefile` | substitute |
| `README.md` | substitute |
| `FEATURES.md` | copy |
| `TODO.md` | substitute |
| `CHANGELOG.md` | substitute |
| `docker-compose.yml` | substitute |
| `docs/SITE.md` | substitute (only if it does not already exist in the target) |
| `.github/workflows/ci.yml` | copy |
| `backend/.env.example` | substitute |
| `backend/.dockerignore` | copy |
| `backend/Dockerfile` | copy |
| `backend/pyproject.toml` | substitute |
| `backend/src/app/__init__.py` | copy |
| `backend/src/app/main.py` | substitute |
| `backend/src/app/settings.py` | substitute |
| `backend/src/app/routes/__init__.py` | copy |
| `backend/src/app/routes/health.py` | copy |
| `backend/src/app/routes/contact.py` | copy |
| `backend/tests/__init__.py` | copy |
| `backend/tests/test_health.py` | copy |
| `backend/tests/test_contact.py` | copy |
| `frontend/.env.example` | substitute |
| `frontend/amplify.yml` | copy |
| `frontend/eslint.config.mjs` | copy |
| `frontend/mdx-components.tsx` | copy |
| `frontend/next-env.d.ts` | copy |
| `frontend/next.config.ts` | copy |
| `frontend/package.json` | substitute |
| `frontend/postcss.config.mjs` | copy |
| `frontend/tsconfig.json` | copy |
| `frontend/vitest.config.ts` | copy |
| `frontend/vitest.setup.ts` | copy |
| `frontend/app/globals.css` | substitute |
| `frontend/app/layout.tsx` | substitute |
| `frontend/app/page.tsx` | copy |
| `frontend/app/about/page.tsx` | copy |
| `frontend/app/blog/page.tsx` | copy |
| `frontend/app/blog/[slug]/page.tsx` | copy |
| `frontend/app/news/page.tsx` | copy |
| `frontend/app/news/[slug]/page.tsx` | copy |
| `frontend/app/contact/page.tsx` | copy |
| `frontend/app/not-found.tsx` | copy |
| `frontend/app/error.tsx` | copy |
| `frontend/app/sitemap.ts` | copy |
| `frontend/app/robots.ts` | copy |
| `frontend/app/opengraph-image.tsx` | substitute |
| `frontend/app/manifest.webmanifest` | substitute |
| `frontend/components/ContactForm.tsx` | copy |
| `frontend/components/ContactForm.test.tsx` | copy |
| `frontend/components/Analytics.tsx` | copy |
| `frontend/lib/site.ts` | substitute |
| `frontend/lib/site.test.ts` | copy |
| `frontend/lib/posts.ts` | copy |
| `frontend/lib/posts.test.ts` | copy |
| `frontend/content/blog/welcome.mdx` | substitute |
| `frontend/content/news/launch.mdx` | substitute |

If `docs/SITE.md` exists, draft landing/about page copy that paraphrases (does not copy verbatim) its content. Blog and news start with one example MDX post each.

### 5. Initialize tooling

After copying templates:

1. Do **not** run `npm install` or `pdm install` automatically — print the commands for the user to run.
2. Do **not** initialise git or make a commit unless the user explicitly asks.
3. Do **not** create AWS resources or call AWS APIs.

### 6. Print next steps

Tell the user, in this order:

```
1. cd <project>
2. make setup           # installs frontend (npm) and backend (pdm) deps
3. make configure       # creates frontend/.env.local and backend/.env from examples
4. git init && git add . && git commit -m "Initial scaffold"
   # Also commit frontend/package-lock.json and backend/pdm.lock so CI is reproducible.
5. make dev             # runs frontend on :3000 and backend on :8000
6. Open docs/SITE.md and flesh out the site's purpose.

Deploy:
- Frontend (Amplify): connect the repo in the Amplify console. When asked for the
  monorepo "App root", enter: frontend
  Then attach {{domain}} under Custom domains (Route 53 + ACM auto-managed).
  Full guide: references/amplify-deploy.md
- Backend (App Runner): build backend/Dockerfile, push to Amazon ECR, point
  App Runner at the image. Attach {{api_domain}} under Custom domains.
  Full guide: references/fastapi-backend.md
```

### 7. Re-run handling

If the target already contains a prior scaffold (detected by `frontend/lib/site.ts`):

1. Read the existing `frontend/lib/site.ts` and use its values as **defaults** when prompting; ask only for fields the user wants to change.
2. Re-read `docs/SITE.md` to pick up edits.
3. For each file in the manifest, compare the substituted template output to the file already on disk:
   - **Identical** → skip silently.
   - **Differs** → ask: `"<path> has been modified since scaffolding. Replace, keep, or show diff?"` Default is **keep**.
4. Never overwrite a user-edited file without explicit confirmation.

Use this exact prompt template when asking about a divergent file:

```
{path} differs from the current template. Choose:
  [k] keep my version (default)
  [r] replace with the new template
  [d] show the diff first
```

## Conventions to follow

These come from the marketplace's parent project (see the project `CLAUDE.md`):

- **pdm** for Python package management. No virtualenvs inside containers (the Dockerfile builds one in a builder stage and copies the resulting `.venv` into the runtime stage).
- **Make** targets for every workflow (setup, lint, test, build, run, docker).
- **docker-compose** for any local databases or system-level tooling.
- **No emojis** in code, comments, logs, UI, or generated docs.
- **README** stays concise — link out to detailed docs in `guides/` or to the plugin references.
- Maintain `CHANGELOG.md` (what changed), `FEATURES.md` (what exists), `TODO.md` (what's pending) in the generated project.
- Tests live next to code (`*.test.ts(x)` for frontend) or under `tests/` (backend).
- Latest stable APIs and libraries. As of writing: Next.js 16, React 19, Tailwind v4, FastAPI ≥ 0.115.

## Example transcript

A short example of what a successful invocation looks like:

```
User:    Scaffold a new website for "Acme Robotics", domain acmerobotics.io.
Skill:   Found no docs/SITE.md. Provide one, paste a description, or use generic copy?
User:    Generic for now.
Skill:   Confirming fields (press enter to accept):
           site_name      = Acme Robotics
           company        = Acme Robotics
           domain         = acmerobotics.io
           api_domain     = api.acmerobotics.io
           tagline        = Robotics that ships.
           description    = Industrial automation for mid-market manufacturers.
           contact_email  = hello@acmerobotics.io
           github_repo    = (blank)
           accent_color   = #5b8def
           analytics      = none
User:    accept all
Skill:   Writing 54 files...
         All placeholders substituted. No raw {{…}} tokens remain.

         Next steps:
           1. cd .
           2. make setup
           3. make configure
           4. git init && git add . && git commit -m "Initial scaffold"
           5. make dev
           6. Edit docs/SITE.md.

         Deploy: see references/amplify-deploy.md and references/fastapi-backend.md.
```

## References

- [`references/amplify-deploy.md`](./references/amplify-deploy.md) — Amplify Hosting + Route 53 + ACM/HTTPS for the frontend.
- [`references/fastapi-backend.md`](./references/fastapi-backend.md) — App Runner for the FastAPI service, with notes on ECS Fargate and Lambda alternatives.
- [`references/content-prompts.md`](./references/content-prompts.md) — Full prompt list with examples and validation rules.
