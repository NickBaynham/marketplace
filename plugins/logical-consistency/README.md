# logical-consistency

A Claude Code plugin that audits a document — or a set of documents — for **internal** logical consistency: contradictions, common logical fallacies, undefined or equivocated terms, and invalid inference forms.

It works on software requirements (BRD, SRS, PRD, spec), design documents and RFCs, essays and blog posts, policies, contracts, and any other prose where the claims are supposed to fit together.

The plugin ships three surfaces:

- **Skill:** [`check-logical-consistency`](./skills/check-logical-consistency/SKILL.md) — activates from natural-language requests like "check this for consistency" or "audit the logic of this BRD."
- **Slash command:** `/logic-check <file path(s) or pasted text>` — invoke the audit directly.
- **Sub-agent:** [`logic-auditor`](./agents/logic-auditor.md) — delegate a logical-consistency review from a main agent without consuming its context window.

## What it produces

A Logical Consistency Report with the following sections:

1. Summary verdict
2. Documents reviewed
3. Central claims extracted
4. Findings — Contradictions
5. Findings — Logical fallacies
6. Findings — Informal logic issues (undefined terms, terminological drift, equivocation setup, missing premises, unsupported claims, scope drift, numerical inconsistencies, internal citation drift)
7. Findings — Inference errors
8. Severity summary (Blockers / Majors / Minors / Nits)
9. Recommended repair order
10. Out-of-scope items noted but not assessed

Each finding is structured: ID, type, location, verbatim quote, one- or two-sentence explanation, concrete repair, severity rating.

## Three analysis passes

Every review runs three passes in order, with depth adjusted to the document type.

- **Formal logic.** Direct contradictions, incompatible constraints, quantifier errors, modal and deontic conflicts, temporal cycles, definitional contradictions, invalid inference forms (affirming the consequent, denying the antecedent, undistributed middle, illicit major/minor).
- **Logical fallacies.** Equivocation, begging the question, false dichotomy, hasty generalization, appeals to authority / popularity / nature / tradition, slippery slope, straw man, composition / division, post hoc, no true Scotsman, cherry picking, appeal to ignorance, loaded question, genetic fallacy, and more.
- **Informal logic.** Undefined or under-defined load-bearing terms, terminological drift, equivocation setup, missing premises, unsupported claims, scope drift within sections, numerical inconsistencies, internal citation drift.

## When it triggers

The `check-logical-consistency` skill activates on phrases like:

- "check this for consistency"
- "audit the logic of…"
- "is this argument sound"
- "find contradictions in…"
- "review this BRD/spec/essay for logical issues"
- "logic check"
- "does this contradict itself"
- "are these requirements consistent"

It does **not** trigger for grammar/style edits, fact-checking against the outside world, opinion review, or pure code review.

## Operating principle

The skill applies the **principle of charity** before flagging any finding. False positives in logical review damage trust faster than misses, so a clean document earns a short "no significant findings" report rather than a padded one.

The skill is concerned only with **internal** consistency. It does not fact-check the document against external reality.

## Installation

This plugin lives in the [marketplace](../../) repository. Install it into a Claude Code session via the marketplace and the skill, slash command, and sub-agent become available.

## Layout

```
logical-consistency/
├── .claude-plugin/plugin.json
├── README.md
├── CHANGELOG.md
├── commands/
│   └── logic-check.md                       # /logic-check <input>
├── agents/
│   └── logic-auditor.md                     # delegated audit sub-agent
└── skills/
    └── check-logical-consistency/
        ├── SKILL.md                         # primary skill behavior
        ├── references/
        │   ├── formal-logic.md
        │   ├── fallacies.md
        │   ├── informal-logic.md
        │   ├── document-types.md
        │   └── output-template.md
        └── templates/
            └── logic-report.md              # blank report with the full section structure
```

## Further reading

- [SKILL.md](./skills/check-logical-consistency/SKILL.md) — full skill instructions and trigger rules
- [formal-logic.md](./skills/check-logical-consistency/references/formal-logic.md) — propositional, quantifier, modal, deontic, temporal, and inference checks
- [fallacies.md](./skills/check-logical-consistency/references/fallacies.md) — catalog of common fallacies with detection patterns and examples
- [informal-logic.md](./skills/check-logical-consistency/references/informal-logic.md) — undefined terms, drift, missing premises, scope and citation issues
- [document-types.md](./skills/check-logical-consistency/references/document-types.md) — emphasis per document type (requirements, design, essay, policy, contract, RFC, mixed sets)
- [output-template.md](./skills/check-logical-consistency/references/output-template.md) — canonical report structure
