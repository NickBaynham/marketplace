# Preferred Vocabulary

Use these terms consistently when writing requirements for the AI-Augmented Quality Intelligence Platform. They are not interchangeable with marketing synonyms — pick the canonical term.

## Platform identity

- **Quality Intelligence Platform** — the platform overall.
- **Document Intelligence** — the capability area for ingesting and analyzing unstructured software documentation.
- **Software Knowledge Model** — the structured representation of a software system that the platform maintains from ingested sources.
- **Living software model** — a Software Knowledge Model that is continuously updated from new evidence (use when emphasizing the temporal/feedback aspect).

## Signals and outputs

- **Quality Signal** — a single observation about software quality (a coverage gap, a flaky test, a defect cluster, a risk indicator).
- **Risk Signal** — a Quality Signal that specifically indicates elevated risk.
- **Coverage Intelligence** — analysis of what is and is not covered by tests, traced to requirements.
- **Release Readiness** — a summary view of whether a release meets defined quality bars.
- **Quality Report** — a human-readable report aggregating multiple signals for a stakeholder audience.

## AI and agents

- **Agent-assisted testing** — workflows where an agent participates in test design, execution, or analysis.
- **Test Design Assistant** — the specific agent surface for generating candidate test cases.
- **Source-grounded recommendation** — an AI output that cites the underlying evidence (document, requirement, ticket) it was derived from.
- **Evidence-backed analysis** — analysis where every conclusion is traceable to identifiable source artifacts.
- **Human-in-the-loop review** — a required human checkpoint between agent draft and committed action.
- **Auditable AI output** — an AI output recorded with full inputs, tools, citations, and reviewer decision.

## Process and feedback

- **Traceability** — the explicit linkage from requirement → use case → test case → defect → evidence.
- **Feedback loop** — the closed cycle from reviewer decision back into model improvement or rule tuning.
- **Model-based testing** — testing driven by an explicit model of expected system behavior, not by hand-written scripts alone.

## Anti-patterns (avoid)

- "Smart" — replace with the specific behavior.
- "AI-powered" — replace with the specific AI capability and its checkpoint model.
- "Insights" — replace with **Quality Signal** or **Quality Report** depending on whether it is one observation or an aggregate.
- "Automated everything" — replace with the specific automated steps and the human checkpoints in between.
- "Self-healing" — almost always overclaim. State what the system actually does on failure.
