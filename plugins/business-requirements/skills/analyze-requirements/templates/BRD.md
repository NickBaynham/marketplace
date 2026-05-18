# Business Requirements Analysis: {{feature_name}}

> Status: Draft. Owner: {{owner}}. Last updated: {{date}}.

## 1. Executive Summary

<One short paragraph. Business purpose and value.>

## 2. Business Goals

- <Measurable goal 1>
- <Measurable goal 2>

## 3. Primary Users and Stakeholders

| Persona | Role | Primary need |
|---|---|---|
| <name> | <role> | <need> |

## 4. Problem Statement

<What is broken, missing, or expensive today. Why solving it now matters.>

## 5. Scope

### In Scope

-

### Out of Scope

-

### Future Considerations

-

## 6. Key Use Cases

### UC-1: <name>

- **Actor:**
- **Goal:**
- **Trigger:**
- **Preconditions:**
- **Main flow:**
- **Alternate flows:**
- **Expected outcome:**
- **Quality considerations:**

## 7. Functional Requirements

| ID | Requirement | Priority | Notes |
|---|---|---|---|
| FR-001 | The system shall <…>. | Must | |

## 8. Non-Functional Requirements

| ID | Category | Requirement | Target |
|---|---|---|---|
| NFR-001 | Performance | <…> | <metric> |

## 9. Data Requirements

| ID | Entity | Attributes | Retention | Notes |
|---|---|---|---|---|
| DR-001 | <Entity> | <fields> | <duration> | <PII, evidence link, etc.> |

## 10. AI and Agentic Automation Requirements

| ID | Capability | Purpose | Inputs | Tools / APIs | Outputs | HITL checkpoint | Write-back scope | Traceability | Confidence handling | Logging | Permissions |
|---|---|---|---|---|---|---|---|---|---|---|---|
| AR-001 | <…> | | | | | | | | | | |

## 11. Integrations

| ID | System | Direction | Trigger | Auth | Failure mode |
|---|---|---|---|---|---|
| IR-001 | <Jira/GitHub/CI/…> | read / write / both | <event> | <auth model> | <degradation behavior> |

## 12. Reporting and Analytics

| Audience | Output | Signals / metrics | Refresh cadence |
|---|---|---|---|

## 13. Acceptance Criteria

### FR-001

```
Given <preconditions>
When  <action>
Then  <observable outcome>
```

## 14. Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation | Owner |
|---|---|---|---|---|

## 15. Assumptions

1.

## 16. Open Questions

1.

## 17. MVP Recommendation

<Smallest version that delivers measurable value and is testable end-to-end. Name what is intentionally cut.>

## 18. Roadmap Suggestions

- **Phase 2:**
- **Phase 3:**

---

## Engineering Handoff (Implementation Handoff Mode)

> Remove this section if Implementation Handoff Mode is disabled.

### Epic

<one sentence>

### User stories

- As a <persona>, I want <capability>, so that <outcome>. (covers FR-xxx)

### Suggested API endpoints

```
METHOD /path
  purpose:
  request:
  response:
  auth:
  errors:
```

### Suggested data model changes

-

### Suggested UI components

-

### Suggested backend services

-

### Suggested test cases

| Test | Type | Covers |
|---|---|---|

### Observability requirements

-

### Security considerations

-

### Definition of Done

- [ ] All functional requirements covered by automated tests
- [ ] All acceptance criteria pass in CI
- [ ] Observability requirements met
- [ ] Security checklist complete
- [ ] Documentation updated (README, FEATURES, CHANGELOG, runbook)
- [ ] Human-in-the-loop checkpoints verified for AI features
- [ ] Source-grounding/traceability verified for AI outputs
- [ ] Feature flag or rollout plan defined (if applicable)
