# Informal Logic Checks

Most defects in real documents are not classical fallacies and not formal contradictions. They are softer reasoning failures that still corrupt the conclusion. This pass catches them.

## Undefined or under-defined terms

A term carries load in the argument but is never defined, or is defined so loosely that two readers reasonably disagree on what it means.

**Detection.** Pick the 5–10 most load-bearing nouns and noun phrases. For each, ask: would two careful readers agree on its extension (which things in the world it applies to)?

Examples of load-bearing but commonly under-defined terms:

- "User" (visitor? authenticated? paying? admin?)
- "Active" (logged in within 30 days? non-zero subscription? non-zero usage?)
- "Document" (uploaded file? rendered web page? logical record?)
- "Reliable" (uptime? correctness? both?)
- "Real-time" (sub-second? sub-minute? eventual?)
- "AI" / "smart" / "intelligent"

**Finding format.** Quote the first load-bearing use, ask the disambiguation question, propose a definition.

## Terminological drift

The same concept is named two different ways across the document. Readers do not realize the two names refer to the same thing — or, worse, they treat them as different.

> Section 2: "Submission record"
> Section 5: "Filed document"
> Section 9: "Customer entry"

If these are the same thing, pick one and rename. If they are different, define each and the relationships among them.

## Equivocation setup

The same word is used in two different senses in different parts of the document. Even if no fallacious argument depends on it yet, a future revision could create one.

> "*Approval* is required from a manager" (a UI action)
> "All approvals are automatically synced to the data lake" (the resulting data record)

Different concepts; same word.

## Missing premises

An argument that only works if an unstated premise is granted. Surface the premise.

> "We will move to event-driven architecture. Therefore we no longer need the batch reconciliation job."

Missing premise: that the new event-driven flow eliminates the conditions that made batch reconciliation necessary. State and defend it.

## Unsupported claims

A claim presented as a given that actually requires evidence to accept. Distinguish:

- **Stipulation** — the document explicitly chooses this as a premise. Fine.
- **Self-evident** — the document treats it as obvious; if not actually obvious, flag.
- **Argued** — the document supports it. Fine if the support holds.
- **Asserted** — the document states it without support. Flag if load-bearing.

## Scope creep within a section

A section starts arguing about one scope and slides into another without warning.

> A section opens about "support for PDF documents," argues a constraint, then concludes with a claim about "all document types."

The narrower premise does not support the broader conclusion.

## Numerical and quantitative inconsistencies

When the document includes numbers:

- Totals that do not add up.
- Percentages whose parts exceed 100% with no overlap explanation.
- SLAs, time bounds, or thresholds that disagree across sections.
- Currency, units, or precision that differ silently.
- Population sizes that are inconsistent across rows or sections.

Always re-add tables. Always check that p50 / p95 / p99 timing claims agree across sections.

## Citation drift

Citations and references that do not say what the text claims they say. Restrict this check to:

- Internal references (Section 3.2, Appendix A, "see above").
- References to other documents in the same review set.
- Quoted passages whose context is also in the document.

Do **not** fact-check against the outside world — that is out of scope for this skill.

For internal cross-references, flag:

- Pointers to sections that do not exist.
- Pointers whose target says something different from what the citing passage implies.
- Dangling defined-but-never-used terms, or used-but-never-defined terms.

## Charity test

Before submitting any informal finding, run the charity test:

1. State the most reasonable interpretation of the passage that makes the document consistent.
2. If that interpretation is plausible, drop the finding.
3. If it requires reading material into the document that is not there, keep the finding and quote the missing piece.

Charity prevents the largest class of false positives in informal review.

## Severity calibration

- **Blocker** — A load-bearing claim depends on the undefined term, and the document's downstream actions diverge depending on which definition is chosen.
- **Major** — Terminology drift or missing premise that materially affects what the reader takes away.
- **Minor** — Cosmetic terminology drift, narrow scope slip, or an under-defined term in a non-load-bearing area.
- **Nit** — Stylistic preference, not a logical defect. (Avoid filing nits as findings unless the document is otherwise clean and the user asked for a thorough pass.)
