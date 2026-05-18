# Output Template

This is the canonical structure for a Business Requirements Analysis produced by the `analyze-requirements` skill. Use it unless the user explicitly requests another format.

Short requests do not need every section, but always include functional requirements with IDs, acceptance criteria, and a clear scope statement.

```markdown
# Business Requirements Analysis: <Feature or Platform Name>

## 1. Executive Summary
One short paragraph. Business purpose and value, no fluff.

## 2. Business Goals
Bulleted, measurable goals. Each goal names what changes and how the change is measured.

## 3. Primary Users and Stakeholders
Persona, role, primary need. Distinguish day-to-day users from approvers and observers.

## 4. Problem Statement
What is broken, missing, or expensive today. Why solving it now matters.

## 5. Scope
### In Scope
### Out of Scope
### Future Considerations

## 6. Key Use Cases
For each use case, include:

- Use case name
- Actor
- Goal
- Trigger
- Preconditions
- Main flow
- Alternate flows
- Expected outcome
- Quality considerations

## 7. Functional Requirements
Use requirement IDs. One requirement per row.

| ID | Requirement | Priority | Notes |
|---|---|---|---|
| FR-001 | The system shall allow a user to upload a software document into a Collection. | Must | Source knowledge ingestion. |
| FR-002 | The system shall parse uploaded PDFs into searchable text within 60 seconds for files up to 25 MB. | Must | Measurable performance criterion. |

Priorities: **Must**, **Should**, **Could**, **Won't (this release)**.

## 8. Non-Functional Requirements
Cover: performance, scalability, security, reliability, usability, observability, maintainability, compliance. Skip what does not apply, but say so.

## 9. Data Requirements
Major entities, key attributes, relationships, retention rules, traceability needs. Note any PII, regulated data, or evidence-linkage requirements.

## 10. AI and Agentic Automation Requirements
For each AI or agent feature:

- Purpose
- Inputs
- Tools/APIs invoked
- Outputs
- Human-in-the-loop checkpoints
- Write-back scope vs. read-only
- Source-grounding and traceability
- Hallucination/confidence handling
- Logging and audit
- Permissions

Refer to `references/agentic-checklist.md`.

## 11. Integrations
External systems (Jira, GitHub, CI/CD, test frameworks, log stores, doc repositories). For each, note direction (read/write), trigger, auth model, and failure mode.

## 12. Reporting and Analytics
Dashboards, quality signals, metrics, decision-support outputs. Name the audience for each.

## 13. Acceptance Criteria
Use Given/When/Then. One block per important requirement.

```
Given <preconditions>
When  <action>
Then  <observable outcome>
And   <additional outcome, optional>
```

## 14. Risks and Mitigations
Product, technical, quality, security, operational. For each risk: likelihood, impact, mitigation, owner (if known).

## 15. Assumptions
Listed separately from confirmed requirements. Each assumption is something to validate.

## 16. Open Questions
The list of things that block precise design or estimation. Number them so the user can answer by number.

## 17. MVP Recommendation
What to build first, and why. Name the smallest version that delivers measurable value and is testable end-to-end.

## 18. Roadmap Suggestions
Phase 2, Phase 3 ideas. Do not let these bleed back into MVP scope.
```
