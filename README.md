# marketplace

A personal marketplace of Claude Code plugins and skills, structured so that any Claude Code session can install one of these extensions and use it immediately.

This repository is intended to be consumed by Claude Code (and the Claude Agent SDK where applicable). It is not a runnable application on its own.

## Layout

```
marketplace/
├── .claude-plugin/
│   └── marketplace.json         marketplace manifest: lists installable plugins
├── CLAUDE.md                    project guidance loaded into every session
├── LICENSE
└── plugins/
    └── web-scaffold/            first plugin (see below)
```

A plugin is a self-contained directory under `plugins/` with its own `.claude-plugin/plugin.json` and a `skills/<skill-name>/SKILL.md` for each skill it exposes.

## Installing a plugin

In a Claude Code session, install plugins from this marketplace using the standard plugin install flow (point your session at this repo). Each plugin then becomes available in that session.

## Plugins

### web-scaffold

Status: 0.1.0

A plugin that scaffolds a new website project from scratch. It ships one skill:

#### Skill: `create-website`

Builds a working repository for a marketing/content website with a Next.js frontend, a FastAPI backend, and an AWS deployment story.

**When to invoke.** Ask Claude to "scaffold a new website", "create a marketing site", or "bootstrap a Next.js + FastAPI project". The skill triggers from natural-language prompts of that shape. It does *not* trigger for edits to an existing site, single-page generation, SaaS dashboards, or non-web projects.

**What it generates.**

- **Frontend** — Next.js 16 (App Router), React 19, TypeScript, Tailwind v4, MDX. Starter pages: `/`, `/about`, `/blog`, `/news`, `/contact`, plus `not-found`, `error`, `sitemap`, `robots`, an Open Graph image, and a web manifest. Vitest tests for `lib/` and the contact form. ESLint, Prettier, `.editorconfig`.
- **Backend** — FastAPI managed with pdm. Endpoints: `GET /health` and `POST /contact`. The contact endpoint is rate-limited and includes a honeypot. Pytest covers the happy path, missing fields, and the honeypot. Multi-stage Dockerfile suited to AWS App Runner.
- **Local workflow** — `Makefile` with parallel `dev` (frontend on :3000, backend on :8000), plus `setup`, `configure`, `lint`, `typecheck`, `test`, `ci`, `docker-up`, `docker-down`, `build`, `deploy-check`. `docker-compose.yml` with an optional commented-out Postgres service.
- **Deployment** — `amplify.yml` configured for the monorepo layout (`appRoot: frontend`). References describe AWS Amplify Hosting for the frontend, AWS App Runner for the backend, and Route 53 + ACM for the domain and HTTPS.
- **Optional analytics** — A small `Analytics` component routes to Plausible, PostHog, or nothing, driven by `NEXT_PUBLIC_ANALYTICS_PROVIDER`.
- **Project docs** — `README.md`, `FEATURES.md`, `TODO.md`, `CHANGELOG.md`, plus `docs/SITE.md` where the user describes what the site is about (read by the skill on subsequent runs to inform copy).

**Prompted fields.** The skill asks for `site_name`, `company`, `domain`, `tagline`, `description`, `contact_email`, `github_repo`, `accent_color`, and `analytics`. The backend domain defaults to `api.<domain>`. Full list and validation rules: [content-prompts.md](plugins/web-scaffold/skills/create-website/references/content-prompts.md).

**Deeper documentation.**

- [Plugin README](plugins/web-scaffold/README.md)
- [SKILL.md](plugins/web-scaffold/skills/create-website/SKILL.md) — full skill instructions, placeholder rules, file manifest, re-run behavior, example transcript
- [amplify-deploy.md](plugins/web-scaffold/skills/create-website/references/amplify-deploy.md) — Amplify + Route 53 + HTTPS for the frontend
- [fastapi-backend.md](plugins/web-scaffold/skills/create-website/references/fastapi-backend.md) — App Runner deploy for the backend, plus ECS Fargate and Lambda alternatives
- [TODO.md](plugins/web-scaffold/TODO.md) — quality-reviewed follow-ups

## Conventions

Repository-wide conventions are defined in [CLAUDE.md](CLAUDE.md) and are followed by every plugin and skill here:

- **pdm** for Python package management.
- **Make** targets for setup, run, lint, test, build, and Docker workflows.
- **docker-compose** for any local databases or system-level tooling.
- Latest stable APIs and libraries.
- No emojis in code, comments, logs, UI, or generated docs.
- Standard technical writing in documentation.
- Each project maintains `CHANGELOG.md`, `FEATURES.md`, and `TODO.md`.

## Status

Early. Structure, conventions, and additional plugins will be added incrementally. Nothing in this repository should be considered stable yet.

## License

See [LICENSE](LICENSE).
