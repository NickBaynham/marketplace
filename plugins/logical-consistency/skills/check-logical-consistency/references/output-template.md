# Output Template

This is the canonical structure for a Logical Consistency Report produced by the `check-logical-consistency` skill. Use it unless the user explicitly asks for another shape.

If a category has zero findings, write "None." rather than padding.

```markdown
# Logical Consistency Report: <Document or Set Name>

## 1. Summary Verdict
One short paragraph. State whether the document is internally consistent, where the worst defects cluster, and what should be repaired first.

## 2. Documents Reviewed
- `<path or title>` — <document type, e.g., BRD, design doc, blog post>
- ... (one bullet per document)

State the unit of analysis (single document, mutually-consistent set, focused excerpt).

## 3. Central Claims Extracted
List the 3–10 load-bearing claims, premises, or theses. Quote or paraphrase verbatim where possible. Number them C1, C2, ... so later findings can reference them.

## 4. Findings — Contradictions
| ID | Severity | Type | Location | Finding | Repair |
|---|---|---|---|---|---|
| F-001 | Major | Direct contradiction | §3.1, §7.2 | "All uploaded documents are encrypted at rest" vs. "Archived documents older than 12 months are stored in cold storage in plaintext." | Decide whether cold-storage archives are exempt and state it once. |

## 5. Findings — Logical Fallacies
For each fallacy:

- **Fallacy:** <name>
- **Location:** <file:line or §section>
- **Quote:** "<verbatim passage>"
- **Why it qualifies:** <one or two sentences naming the argument structure>
- **Repair:** <concrete fix>
- **Severity:** Blocker / Major / Minor / Nit

## 6. Findings — Informal Logic
Subsections, each with location, quote, finding, repair, severity:

### Undefined or under-defined terms
### Terminological drift (same concept, two names)
### Equivocation setup (same word, two senses)
### Missing premises
### Unsupported load-bearing claims
### Scope drift
### Numerical or quantitative inconsistencies
### Citation / cross-reference drift (internal only)

Omit subsections with no findings, or write "None."

## 7. Findings — Inference Errors
Invalid argument forms (affirming the consequent, denying the antecedent, undistributed middle, illicit major/minor, quantifier slip, modal/deontic conflict, temporal cycle).

For each: location, the argument as stated, the formal defect, the repair, severity.

## 8. Severity Summary
- Blockers: <n>
- Majors: <n>
- Minors: <n>
- Nits: <n>

## 9. Recommended Repair Order
A short ordered list — which fixes to make first and why (e.g., "Fix F-003 first: defines a term that nine downstream requirements depend on").

## 10. Out-of-Scope Items Noted
Anything the reviewer noticed but did not assess. Typical entries:

- External factual claims that would need outside verification.
- Style, tone, or persuasiveness concerns.
- Implementation feasibility.
- Legal interpretation.

State each in one line so the user can re-scope if they want the skill to look at it under a different lens.
```
