# Changelog

## 0.1.0 — 2026-05-21

- Initial plugin scaffold.
- Adds `mcp-exploratory-testing` skill: drive Playwright MCP through bounded exploratory testing of a live web application and capture structured Markdown evidence.
- Slash commands: `/explore-workflow`, `/explore-app`, `/review-exploration`, `/exploration-to-bdd`.
- Templates: exploration session, page observation, action timeline, anomaly report, test idea, page model candidate, exploration review.
- Checklists: exploration scope, observation quality, anomaly classification, test idea quality.
- SauceDemo checkout examples: exploration session, anomaly report, candidate test ideas.
- Clean separation: observation-only; does not generate BDD specs or automation code in v0.1.
