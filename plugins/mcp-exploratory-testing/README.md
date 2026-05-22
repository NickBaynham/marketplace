# mcp-exploratory-testing

A Claude Code plugin that drives Playwright MCP through bounded, human-directed exploratory testing of a live web application and captures the session as structured, reviewable Markdown evidence.

This plugin is part of a three-skill agentic testing workflow:

```
Skill 1: mcp-exploratory-testing       -> exploration session reports  (this plugin)
Skill 2: exploratory-to-bdd            -> Markdown BDD specs, .feature files, traceability, automation candidates
Skill 3: agentic-playwright-automation -> Python Playwright/PyTest automation
```

## Surfaces

- **Skill:** [`mcp-exploratory-testing`](./skills/mcp-exploratory-testing/SKILL.md) — activates when the user wants to explore a live application through Playwright MCP and produce exploration artifacts.
- **Slash commands:**
  - `/explore-workflow <target-url> <workflow-scope>` — bounded exploration of one workflow.
  - `/explore-app <target-url> <scope-or-goal>` — broader app reconnaissance, still bounded.
  - `/review-exploration <file-or-folder>` — quality review of an existing exploration artifact.
  - `/exploration-to-bdd <session-file>` — hand off an exploration session to the `exploratory-to-bdd` plugin for BDD generation.

## What it produces

Under `sessions/mcp-exploration/<app>/`:

- `<workflow>_session.md` — exploration session report with metadata, scope, assumptions, test data, page observations, action timeline, observed outcomes, anomalies, candidate test cases, candidate page models, open questions, tooling notes, and recommended next step.

Optional split reports under `reports/exploration/<app>/`:

- `<workflow>_observations.md`
- `<workflow>_anomalies.md`
- `<workflow>_test_ideas.md`
- `<workflow>_review.md`

## Core principles

1. Explore only the requested workflow or bounded scope.
2. Prefer Playwright MCP accessibility snapshots (`browser_snapshot`) over screenshots for reasoning.
3. Separate observed application behavior from intended behavior.
4. Separate application anomalies from tooling anomalies.
5. Never invent requirements; capture assumptions and open questions instead.
6. Never store private credentials, tokens, or PII in any report.
7. Mark any tool workaround (such as `browser_evaluate` to drive a click) in Tooling Notes.

## What it does NOT do in v0.1

- BDD spec generation (see the `exploratory-to-bdd` plugin).
- Gherkin `.feature` generation.
- Playwright or PyTest automation code generation (see the `agentic-playwright-automation` plugin).
- Page object implementation.
- Formal defect filing or issue creation.
- Performance, accessibility, security, or visual regression testing.

## Layout

```
mcp-exploratory-testing/
├── .claude-plugin/plugin.json
├── README.md
├── CHANGELOG.md
├── commands/
│   ├── explore-workflow.md
│   ├── explore-app.md
│   ├── review-exploration.md
│   └── exploration-to-bdd.md
└── skills/
    └── mcp-exploratory-testing/
        ├── SKILL.md
        ├── templates/
        │   ├── exploration_session_template.md
        │   ├── page_observation_template.md
        │   ├── action_timeline_template.md
        │   ├── anomaly_report_template.md
        │   ├── test_idea_template.md
        │   ├── page_model_candidate_template.md
        │   └── exploration_review_template.md
        ├── checklists/
        │   ├── exploration_scope_checklist.md
        │   ├── observation_quality_checklist.md
        │   ├── anomaly_classification_checklist.md
        │   └── test_idea_quality_checklist.md
        └── examples/
            ├── saucedemo_checkout_exploration.md
            ├── saucedemo_checkout_anomalies.md
            └── saucedemo_checkout_test_ideas.md
```

## Requirements

- Playwright MCP server enabled in the Claude Code session (`browser_navigate`, `browser_snapshot`, `browser_click`, `browser_type`, `browser_fill_form`, `browser_evaluate`, etc.).

## Installation

Install via the [marketplace](../../) plugin index.
