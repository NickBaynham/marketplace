# Marketplace

This repository is a personal marketplace of plugins and skills for Claude Code sessions.

## Purpose

Collect reusable extensions in one place so they can be installed into any Claude Code session — across machines and projects — without rebuilding them each time. Contents are intended to be loaded by Claude Code (and the Claude Agent SDK where applicable) rather than executed as a standalone application.

## What lives here

- **Plugins** — Claude Code plugins that bundle slash commands, hooks, agents, and MCP server configurations.
- **Skills** — Skill packages (the `Skill` tool surface) that give Claude specialized capabilities and domain knowledge for specific tasks.

Each plugin or skill is self-contained and independently installable.

## How it gets used

A Claude Code session pulls a plugin or skill from this repo and registers it locally. From that point on, the session can invoke the skill via the `Skill` tool, or use the plugin's commands, agents, and hooks as if they were built in.

## Plugins

| Plugin | Skill | Purpose |
|---|---|---|
| [`web-scaffold`](plugins/web-scaffold/) | [`create-website`](plugins/web-scaffold/skills/create-website/SKILL.md) | Scaffold a Next.js + FastAPI website with Amplify + App Runner deploy targets, Route 53 + HTTPS. |
| [`astro-content-site`](plugins/astro-content-site/) | [`create-astro-content-site`](plugins/astro-content-site/skills/create-astro-content-site/SKILL.md) | Build and launch a content-driven static site (artist/creator/portfolio) on Astro + Amplify + S3: content collections, streaming, gated downloads, zero-backend mailing list, phased TDD delivery with production E2E gates, plus a pitfalls catalog distilled from a real build. |
| [`business-requirements`](plugins/business-requirements/) | [`analyze-requirements`](plugins/business-requirements/skills/analyze-requirements/SKILL.md) | Senior Business Requirements Analyst for AI-augmented quality intelligence work. Also ships `/brd` and a `business-analyst` sub-agent. |
| [`logical-consistency`](plugins/logical-consistency/) | [`check-logical-consistency`](plugins/logical-consistency/skills/check-logical-consistency/SKILL.md) | Audit a document or set of documents for internal logical consistency — contradictions, fallacies, undefined or equivocated terms, invalid inferences. Also ships `/logic-check` and a `logic-auditor` sub-agent. |

## Status

Early — structure, conventions, and additional plugins/skills will be added incrementally. Nothing in this repo should be assumed stable yet.
