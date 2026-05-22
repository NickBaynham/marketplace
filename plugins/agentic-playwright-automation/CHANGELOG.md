# Changelog

## 0.1.0 — 2026-05-21

- Initial plugin scaffold.
- Adds `agentic-playwright-automation` skill: convert approved behavior specs into maintainable Python Playwright/PyTest automation inside a standardized framework under `automation/`.
- Slash commands: `/setup-playwright-framework`, `/generate-playwright-test`, `/generate-playwright-suite`, `/review-playwright-test`, `/investigate-playwright-failure`, `/convert-bdd-to-playwright`.
- Templates: test file, page object, component object, fixture, data model, test data YAML, environment config YAML, implementation report, failure investigation, automation review.
- Checklists: automation implementation, test quality, page object quality, fixture quality, test data quality, locator quality, failure investigation, agent safety.
- SauceDemo examples: login test, login page, inventory page, conftest, users YAML, implementation report, failure investigation.
- Enforces: top-level `expect` assertions, fixture-driven test data, environment-based configuration, accessible-locator priority, no `time.sleep`, no Cucumber/Behave, no hidden business assertions, no automatic git operations.
