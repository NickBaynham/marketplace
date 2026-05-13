# web-scaffold

A Claude Code plugin that ships one skill: [`create-website`](./skills/create-website/SKILL.md).

The skill scaffolds a new website project with:

- **Frontend** — Next.js (App Router) + React + TypeScript + Tailwind + MDX. Starter pages: landing, about, blog, news, contact.
- **Backend** — FastAPI managed with pdm. Minimal `/health` and `/contact` endpoints.
- **Deployment** — `amplify.yml` for the Next.js frontend on AWS Amplify, container build for the FastAPI service on AWS App Runner. Route 53 + ACM for the domain and HTTPS.
- **Local workflow** — Makefile (`setup`, `configure`, `dev`, `lint`, `typecheck`, `test`, `ci`, `docker-up`, `deploy-check`), docker-compose for any local infra, GitHub Actions CI.

The skill prompts for site specifics (name, domain, contact email, etc.) and reads an optional `docs/SITE.md` to inform placeholder copy.

## Installation

This plugin lives in the [marketplace](../../) repository. Install it into a Claude Code session via the marketplace, then invoke the skill by asking Claude to create or scaffold a new website.

## Layout

```
web-scaffold/
├── .claude-plugin/plugin.json
├── README.md
├── CHANGELOG.md
└── skills/
    └── create-website/
        ├── SKILL.md            instructions Claude follows
        ├── references/         deeper docs the skill links to
        └── templates/          files copied into the new project
```
