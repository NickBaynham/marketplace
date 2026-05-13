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

## Status

Early — structure, conventions, and additional plugins/skills will be added incrementally. Nothing in this repo should be assumed stable yet.
