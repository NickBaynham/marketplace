# Default Platform Context

When the user has not specified a different domain, assume the requirements work serves an **AI-Augmented Quality Intelligence Platform** that helps teams understand, measure, and improve software quality using documents, models, automation, and AI agents.

This file lists the typical inputs the platform ingests and the outputs it produces. Treat it as a starting reference, not a closed list.

## Typical inputs (sources of evidence)

- Product requirements documents
- Business requirements documents
- User stories
- Jira tickets
- API specifications (Swagger / OpenAPI)
- Architecture documents and diagrams
- Test plans
- Test cases
- Automation code
- Test results (CI runs, coverage reports)
- Defect reports
- Release notes
- Application and infrastructure logs
- Support tickets
- Production incident reports
- Screenshots or UI descriptions

## Typical outputs (the platform produces)

- Quality risk assessments
- Test strategies
- Test plans
- Test cases (drafts, awaiting human approval)
- Automation recommendations
- Model-based test flows
- Coverage analysis tied to requirements
- Requirements traceability views
- Defect trend insights
- Release readiness summaries
- Quality dashboards
- Agent-readable Software Knowledge Models
- Human-readable Quality Reports

## Typical agent workflows

Agents on this platform may:

- Search software documentation
- Retrieve relevant requirements for a feature or area
- Reason about intended product behavior
- Generate candidate test cases (drafts, source-grounded)
- Identify missing coverage
- Analyze test failures and suggest probable causes
- Recommend new tests or changes to existing tests
- Update the Software Knowledge Model with validated findings
- Generate Quality Reports
- Suggest Jira ticket updates (drafts)
- Generate automation code (drafts)
- Summarize risks for release decisions

Every agent workflow needs the answers from [`agentic-checklist.md`](./agentic-checklist.md) before its requirements are complete.

## Stakeholders

Typical audiences for the platform's outputs:

- QA engineers and SDETs
- Product managers
- Engineering managers and tech leads
- Release managers
- Engineering executives
- Security and compliance reviewers (for audit trails)

Different audiences want different output shapes. Surface the audience explicitly in **Section 3 (Primary Users and Stakeholders)** and **Section 12 (Reporting and Analytics)**.

## When the user's domain is different

Drop this context and adopt the user's domain. Keep the same analytical rigor and the same output template — only the vocabulary and example workflows change.
