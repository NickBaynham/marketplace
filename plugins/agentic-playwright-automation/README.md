# agentic-playwright-automation

A Claude Code plugin that turns approved behavior specifications (BDD specs, Gherkin `.feature` files, automation candidate reviews, user stories, acceptance criteria, and exploration artifacts) into maintainable Python Playwright/PyTest automation inside a standardized framework.

This plugin is part of a three-skill agentic testing workflow:

```
Skill 1: mcp-exploratory-testing       -> exploration session reports
Skill 2: exploratory-to-bdd            -> Markdown BDD specs, .feature files, traceability, automation candidates
Skill 3: agentic-playwright-automation -> Python Playwright/PyTest automation  (this plugin)
```

## Surfaces

- **Skill:** [`agentic-playwright-automation`](./skills/agentic-playwright-automation/SKILL.md) — activates when the user wants to scaffold a Python Playwright/PyTest framework, convert behavior specs into automation, review existing automation, or investigate a failing test.
- **Slash commands:**
  - `/setup-playwright-framework [<app-or-url>]` — scaffold `automation/` (PDM, Makefile, base classes, docs, sample tests).
  - `/generate-playwright-test <source>` — one test from a BDD scenario, Markdown spec, user story, or acceptance criteria.
  - `/generate-playwright-suite <bdd-folder>` — High-priority automatable scenarios only.
  - `/review-playwright-test <test-or-folder>` — read-only quality review with Approval Recommendation.
  - `/investigate-playwright-failure <test>` — classify failure (eight categories), fix only the responsible layer.
  - `/convert-bdd-to-playwright <bdd>` — explicit BDD-to-automation bridge.

## What it produces

Under `automation/`:

- `framework/pages/` — page objects.
- `framework/components/` — reusable UI components.
- `framework/models/` — data models (`User`, `Product`, `CheckoutCustomer`, ...).
- `framework/data/` — YAML loader and factories.
- `tests/ui/`, `tests/api/` — PyTest tests with top-level `expect` assertions.
- `test_data/<environment>/` — environment-partitioned YAML test data.
- `config/environments.yaml`, `config/settings.py` — environment configuration.
- `reports/automation/` — implementation reports.
- `reports/automation/reviews/` — automation review reports.
- `reports/automation/failures/` — failure investigation reports.
- `docs/` — framework rules, adding tests, page object standard, fixture standard, test data standard, locator strategy, failure investigation.

## Core principles

1. Python, PyTest, and Playwright sync API (unless the project already uses async).
2. Business assertions stay at the top level of test functions; page objects do not hide them.
3. Use fixtures for configuration, pages, test data, and reusable setup.
4. Never hard-code URLs, credentials, product names, or checkout data in tests.
5. Locator priority: role/name > label > placeholder > text > test id > stable CSS > XPath last.
6. No `time.sleep` and no arbitrary `wait_for_timeout`; rely on Playwright auto-waiting and `expect`.
7. Reuse existing patterns; do not invent new ones.
8. Never weaken an assertion to make a test pass; classify the failure first.
9. If application behavior appears defective, raise a Potential Defect note instead of masking.
10. Preserve traceability back to the source spec in every test docstring.

## What it does NOT do in v0.1

- Cucumber/Behave runtime setup or step definitions.
- Jira or GitHub issue creation.
- Visual regression, performance, security, or accessibility-audit automation.
- Full CI/CD deployment automation beyond basic GitHub Actions guidance.
- Automatic git commits, pushes, or pull requests.
- Package installation or test execution without explicit user authorization.

## Layout

```
agentic-playwright-automation/
├── .claude-plugin/plugin.json
├── README.md
├── CHANGELOG.md
├── commands/
│   ├── setup-playwright-framework.md
│   ├── generate-playwright-test.md
│   ├── generate-playwright-suite.md
│   ├── review-playwright-test.md
│   ├── investigate-playwright-failure.md
│   └── convert-bdd-to-playwright.md
└── skills/
    └── agentic-playwright-automation/
        ├── SKILL.md
        ├── templates/
        │   ├── test_file_template.py
        │   ├── page_object_template.py
        │   ├── component_object_template.py
        │   ├── fixture_template.py
        │   ├── data_model_template.py
        │   ├── test_data_template.yaml
        │   ├── environment_config_template.yaml
        │   ├── implementation_report_template.md
        │   ├── failure_investigation_template.md
        │   └── automation_review_template.md
        ├── checklists/
        │   ├── automation_implementation_checklist.md
        │   ├── test_quality_checklist.md
        │   ├── page_object_quality_checklist.md
        │   ├── fixture_quality_checklist.md
        │   ├── test_data_quality_checklist.md
        │   ├── locator_quality_checklist.md
        │   ├── failure_investigation_checklist.md
        │   └── agent_safety_checklist.md
        └── examples/
            ├── saucedemo_login_test.py
            ├── saucedemo_login_page.py
            ├── saucedemo_inventory_page.py
            ├── saucedemo_conftest.py
            ├── saucedemo_users.yaml
            ├── saucedemo_implementation_report.md
            └── saucedemo_failure_investigation.md
```

## Requirements

- Python 3.10+ (recommended).
- PDM (preferred) or another Python package manager already in use by the project.

## Installation

Install via the [marketplace](../../) plugin index.
