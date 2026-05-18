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
    ├── web-scaffold/            scaffolds a Next.js + FastAPI website
    └── business-requirements/   senior BA for AI-augmented quality intelligence work
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

### business-requirements

Status: 0.1.0

A plugin that turns rough product ideas into structured, testable, implementation-ready business requirements. It ships one skill, one slash command, and one sub-agent.

#### Skill: `analyze-requirements`

A senior Business Requirements Analyst voice with deep expertise in software quality engineering, AI-assisted and agentic automation, document intelligence platforms, and SaaS product design.

**When to invoke.** Ask Claude to "analyze requirements for X", "write a BRD for…", "what should this feature do", "turn this rough idea into requirements", "draft user stories and acceptance criteria for…", or "refine the scope of…". The skill does *not* trigger for pure implementation help on settled features, code review, or non-product analysis.

**What it produces.** A Business Requirements Analysis with up to 18 sections: executive summary, business goals, users and stakeholders, problem statement, scope (in/out/future), key use cases, functional requirements (IDs + MoSCoW priority), non-functional requirements, data requirements, AI and agentic automation requirements, integrations, reporting and analytics, Given/When/Then acceptance criteria, risks and mitigations, assumptions, open questions, MVP recommendation, and roadmap suggestions.

**Two layered modes (on by default).**

- **Product Strategy Mode** — opinionated calls on differentiating vs. commodity features, MVP scope cuts, real AI value vs. demoware, deterministic vs. agentic boundaries.
- **Implementation Handoff Mode** — engineering-ready appendix with epic, user stories, suggested API endpoints, data model changes, UI components, backend services, test cases, observability requirements, security considerations, and a Definition of Done checklist.

Disable either mid-conversation with "skip strategy" or "no handoff format."

**Default lens.** Unless the user specifies otherwise, the skill assumes the work serves an AI-Augmented Quality Intelligence Platform and uses the preferred vocabulary (Quality Intelligence Platform, Software Knowledge Model, Quality Signal, Source-grounded recommendation, Human-in-the-loop review, etc.).

#### Slash command: `/brd <topic>`

Direct invocation of the analysis. Produces a first-pass BRD using the canonical structure, with both default modes applied.

#### Sub-agent: `business-analyst`

Delegate BA work from a main agent when you need a senior BA voice on a focused question without consuming the main context window.

**Deeper documentation.**

- [Plugin README](plugins/business-requirements/README.md)
- [SKILL.md](plugins/business-requirements/skills/analyze-requirements/SKILL.md) — full skill instructions and trigger rules
- [output-template.md](plugins/business-requirements/skills/analyze-requirements/references/output-template.md) — canonical section-by-section output
- [requirement-quality-rules.md](plugins/business-requirements/skills/analyze-requirements/references/requirement-quality-rules.md) — how to write good requirements
- [agentic-checklist.md](plugins/business-requirements/skills/analyze-requirements/references/agentic-checklist.md) — questions every AI/agent feature must answer
- [product-strategy-mode.md](plugins/business-requirements/skills/analyze-requirements/references/product-strategy-mode.md)
- [implementation-handoff-mode.md](plugins/business-requirements/skills/analyze-requirements/references/implementation-handoff-mode.md)
- [vocabulary.md](plugins/business-requirements/skills/analyze-requirements/references/vocabulary.md) — preferred Quality Intelligence Platform terms
- [platform-context.md](plugins/business-requirements/skills/analyze-requirements/references/platform-context.md) — default platform inputs, outputs, agent workflows

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
