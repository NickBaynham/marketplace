# Logical Consistency Report: <Document or Set Name>

> Date: <YYYY-MM-DD>
> Reviewer: `check-logical-consistency` skill
> Documents under review: <count>
> Document type(s): <BRD / design doc / essay / policy / contract / RFC / other>

## 1. Summary Verdict

<One short paragraph. State whether the document is internally consistent, where the worst defects cluster, and what should be repaired first.>

## 2. Documents Reviewed

- `<path or title>` — <document type>

Unit of analysis: <single document | document set | excerpt>.

## 3. Central Claims Extracted

- **C1.** <claim or thesis>
- **C2.** <claim>
- **C3.** <claim>

## 4. Findings — Contradictions

| ID | Severity | Type | Location | Finding | Repair |
|---|---|---|---|---|---|
| F-001 | <Blocker/Major/Minor/Nit> | <Direct / Constraint / Modal / Temporal / Definitional> | <§ref or file:line> | <one-line summary with quoted passages> | <concrete fix> |

## 5. Findings — Logical Fallacies

### F-101 — <Fallacy name>

- **Location:** <§ref or file:line>
- **Quote:** "<verbatim passage>"
- **Why it qualifies:** <argument structure>
- **Repair:** <concrete fix>
- **Severity:** <Blocker/Major/Minor/Nit>

## 6. Findings — Informal Logic

### Undefined or under-defined terms

- **F-201.** <term> — first load-bearing use at <location>. Two reasonable readings: <A> and <B>. Repair: define once at <location> and use consistently. Severity: <…>.

### Terminological drift (same concept, two names)

- None.

### Equivocation setup (same word, two senses)

- None.

### Missing premises

- None.

### Unsupported load-bearing claims

- None.

### Scope drift

- None.

### Numerical or quantitative inconsistencies

- None.

### Citation / cross-reference drift (internal only)

- None.

## 7. Findings — Inference Errors

### F-301 — <Invalid form, e.g., Affirming the consequent>

- **Location:** <§ref>
- **Argument as stated:** "<verbatim>"
- **Formal defect:** <one line>
- **Repair:** <concrete fix>
- **Severity:** <…>

## 8. Severity Summary

- Blockers: 0
- Majors: 0
- Minors: 0
- Nits: 0

## 9. Recommended Repair Order

1. <fix> — <reason it goes first>
2. <fix>
3. <fix>

## 10. Out-of-Scope Items Noted

- <External factual claim — would need outside verification.>
- <Style or tone concern.>
- <Implementation feasibility.>
- <Legal interpretation.>
