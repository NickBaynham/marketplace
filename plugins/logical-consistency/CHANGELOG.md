# Changelog

## 0.1.0 — 2026-05-18

- Initial plugin scaffold.
- Adds `check-logical-consistency` skill: senior logic and argument auditor for internal consistency of a document or document set.
- Three-pass analysis: formal logic, logical fallacies, informal logic. Each finding includes ID, type, location, verbatim quote, explanation, repair, and severity (Blocker / Major / Minor / Nit).
- Document-type emphasis covers software requirements (BRD, SRS, PRD, spec), design docs and RFCs, essays and blog posts, policies, and contracts; supports mixed-document review sets.
- Operating principle: principle of charity applied before any finding; refuses to invent contradictions; returns "no significant findings" when warranted.
- Adds `/logic-check <input>` slash command for direct invocation against file paths or pasted text.
- Adds `logic-auditor` sub-agent for delegated reviews.
- Reference set: formal logic checks, fallacy catalog, informal logic checks, document-type emphasis, output template.
- Report template (`templates/logic-report.md`) with the full ten-section structure.
