# Implementation Handoff Mode

On by default. The user can disable with "no handoff format" or "skip handoff."

## What it adds

Write requirements so they can later be converted directly into engineering tasks, coding-agent prompts, GitHub issues, Jira stories, and automated acceptance tests — without an analyst-to-engineer translation pass.

For each major feature, include the following alongside the standard BRD sections.

## Engineering breakdown

### Epic
One sentence. Bounded scope.

### User stories
`As a <persona>, I want <capability>, so that <outcome>.` Group related stories under the epic. Each story maps to one or more functional requirements by ID.

### Acceptance criteria
Given/When/Then. One block per story. Use deterministic, observable assertions.

### Suggested API endpoints
List as `METHOD /path` with one-line purpose, request shape (key fields, not full schemas unless needed), response shape, auth scope, and error cases worth naming.

Example:

```
POST /collections/{id}/documents
  purpose: ingest a new document into a Collection
  request: { source_uri, kind, metadata }
  response: { document_id, status: "queued"|"parsed"|"failed" }
  auth:    Collection.write
  errors:  413 (file too large), 415 (unsupported kind), 409 (duplicate hash)
```

### Suggested data model changes
Tables or entities affected, new columns/relations, indexes, retention rules, evidence-link fields. Note migrations explicitly when they affect existing data.

### Suggested UI components
Page or component name, owning team if known, key states (loading, empty, error, success, low-confidence), and which functional requirement each state satisfies.

### Suggested backend services
Service or module name, responsibilities, upstream/downstream dependencies, async vs. sync, idempotency expectations.

### Suggested test cases
At least: happy path, primary failure mode, permission-denied case, low-confidence case (for AI features), and one regression-sensitive case. Tag each test with the requirement ID it covers.

### Observability requirements
What is logged, what metrics are emitted, what dashboards or alerts must exist before the feature is considered done. Name the metric (e.g., `agent_invocation_count`, `agent_review_acceptance_rate`).

### Security considerations
Authn/authz, data classification, audit needs, secrets handling, third-party data egress, AI-specific concerns (prompt injection, data leakage in logs, model output sanitization).

### Definition of Done
A checklist that gates "done":

- All functional requirements covered by automated tests.
- All Given/When/Then acceptance criteria pass in CI.
- Observability requirements met (logs, metrics, dashboard or alert exists).
- Security checklist complete.
- Documentation updated (README, FEATURES, CHANGELOG, runbook if needed).
- Human-in-the-loop checkpoints verified for AI features.
- Source-grounding/traceability verified for AI outputs.
- Feature flag or rollout plan defined (if applicable).

## Format goals

A reader should be able to:

- Paste the **Epic + Story + Acceptance Criteria + Definition of Done** block into Jira or GitHub as-is.
- Paste the **API + Data + UI + Tests** block into a coding agent's prompt and get a coherent first implementation pass.
- Trace every test back to a requirement ID, and every requirement back to a use case.
