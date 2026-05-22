# exploratory-to-bdd

A Claude Code plugin that converts raw testing artifacts — exploratory session notes, Playwright MCP browser observations, user stories, acceptance criteria, manual test cases, and bug reproduction notes — into reviewable BDD specifications.

This plugin is part of a three-skill agentic testing workflow:

```
Skill 1: mcp-exploratory-testing       -> exploration session reports
Skill 2: exploratory-to-bdd            -> Markdown BDD specs, .feature files, traceability, automation candidates  (this plugin)
Skill 3: agentic-playwright-automation -> Python Playwright/PyTest automation
```

## Surfaces

- **Skill:** [`exploratory-to-bdd`](./skills/exploratory-to-bdd/SKILL.md) — activates when the user wants to turn exploration notes, user stories, or acceptance criteria into BDD specs.
- **Slash commands:**
  - `/explore-to-bdd <target-url> <scope-or-user-story>` — drive Playwright MCP and produce a full BDD bundle in one pass.
  - `/generate-bdd <source>` — convert existing notes or stories into BDD specs (no browser session required).
  - `/review-bdd <feature-or-folder>` — quality-review existing BDD specs against the checklist.
  - `/execute-bdd-mcp <feature>` — manually execute a `.feature` file through Playwright MCP and record an execution report.

## What it produces

Under `specs/bdd/`:

- `markdown/<feature>.md` — Markdown BDD spec with Business Goal, Source Material, Assumptions, Open Questions, Potential Defects, scenarios with Scenario IDs, tags, Automation Priority, and Priority Rationale.
- `features/<feature>.feature` — Gherkin feature file using `Feature`, `Background`, `Scenario`, `Scenario Outline`, and `Examples`.
- `traceability/<feature>_traceability_matrix.md` — every scenario tied to its source.
- `automation/<feature>_automation_candidates.md` — classified High / Medium / Low / Do Not Automate.
- `reviews/<feature>_bdd_quality_review.md` — BDD quality review with Approval Recommendation.

## Core principles

1. Separate observed behavior from intended behavior.
2. Never invent requirements; mark ambiguity as Open Questions or `@needs-clarification`.
3. Never silently convert observed behavior into expected behavior when the requirement is unclear.
4. Preserve traceability to source observations, user stories, or acceptance criteria.
5. Prefer user-centered language; keep selectors and implementation detail out of Gherkin.
6. Mark suspected product issues as Potential Defects with `@potential-defect`, not silent fixes.

## What it does NOT do in v0.1

- Playwright or PyTest code generation (see the `agentic-playwright-automation` plugin).
- Cucumber/Behave runtime setup.
- Step definition generation.
- Jira or GitHub issue creation.

## Layout

```
exploratory-to-bdd/
├── .claude-plugin/plugin.json
├── README.md
├── CHANGELOG.md
├── commands/
│   ├── explore-to-bdd.md
│   ├── generate-bdd.md
│   ├── review-bdd.md
│   └── execute-bdd-mcp.md
└── skills/
    └── exploratory-to-bdd/
        ├── SKILL.md
        ├── templates/
        │   ├── markdown_bdd_spec_template.md
        │   ├── gherkin_feature_template.feature
        │   ├── traceability_matrix_template.md
        │   ├── bdd_quality_review_template.md
        │   └── automation_candidate_template.md
        ├── checklists/
        │   ├── bdd_quality_checklist.md
        │   ├── ambiguity_and_defect_checklist.md
        │   └── automation_candidate_checklist.md
        └── examples/
            ├── saucedemo_login.md
            ├── saucedemo_login.feature
            ├── saucedemo_traceability_matrix.md
            └── saucedemo_bdd_quality_review.md
```

## Installation

Install via the [marketplace](../../) plugin index.
