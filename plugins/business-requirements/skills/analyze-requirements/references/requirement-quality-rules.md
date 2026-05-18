# Requirement Quality Rules

Apply these rules to every functional and non-functional requirement.

## Rules

- Use **"shall"** for mandatory system behavior. Use **"should"** for recommended behavior. Avoid "will," "may," or "can" for normative statements.
- Make each requirement **specific, testable, and unambiguous**. A requirement that cannot fail a test is not a requirement.
- Avoid vague terms unless paired with a measurable threshold:
  - Not allowed alone: easy, fast, smart, robust, intuitive, scalable, seamless, modern.
  - Allowed with a metric: "fast (p95 < 500 ms under 100 concurrent users)."
- **One requirement per statement.** Split compound statements. "The system shall A and B" becomes FR-x (A) and FR-y (B).
- Identify **dependencies** between requirements. A depends on B → note it on A.
- Identify **source evidence** where applicable (a document, a regulation, a user interview).
- Call out **risks** when a requirement depends on unreliable AI behavior, third-party SLAs, or unverified assumptions.
- Distinguish **user-facing behavior** from **internal system behavior**. Tag them when it matters.
- Include **acceptance criteria** for important requirements. Acceptance criteria are Given/When/Then or a measurable assertion — not a restatement of the requirement.

## ID conventions

- `FR-NNN` — functional requirements
- `NFR-NNN` — non-functional requirements
- `DR-NNN` — data requirements
- `AR-NNN` — AI/agentic requirements
- `IR-NNN` — integration requirements

Number within category, zero-padded to three digits. IDs are stable across revisions — never renumber after publication.

## Priority

Use MoSCoW: **Must**, **Should**, **Could**, **Won't (this release)**. Default to **Should** if the user has not signalled. Explain any **Must** that is not obvious.

## Examples

Bad:

> The system should make it easy for users to find documents.

Why bad: vague ("easy"), no metric, no testable assertion, no actor, weak verb.

Better:

> **FR-014** — The system shall return Collection search results within 1 second (p95) for queries against Collections containing up to 100,000 documents. **Priority: Must.** **Acceptance:** Given a Collection with 100,000 indexed documents, when a user submits a keyword query, then results are returned in under 1 second at the 95th percentile across a 1-hour load test.

Bad:

> The agent will help users write tests.

Why bad: actor unclear, scope unbounded, no checkpoint, no traceability.

Better:

> **AR-007** — The Test Design Assistant shall propose candidate test cases for a selected requirement, citing the requirement ID and any linked specification sections as evidence. Each proposal shall be marked **draft** until a human reviewer approves it. **Priority: Must.** **Acceptance:** Given a requirement with at least one linked specification, when the user invokes "Suggest test cases," then the system returns 1–10 candidate cases, each annotated with the source requirement ID and at least one specification anchor, and each in **draft** status until approved.
