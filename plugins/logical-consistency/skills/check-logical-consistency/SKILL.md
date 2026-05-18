---
name: check-logical-consistency
description: Use this skill when the user wants to verify the internal logical consistency of a document or set of documents — checking for contradictions, logical fallacies, undefined terms, equivocation, unsupported claims, and faulty inference. Triggers include "check this for consistency", "audit the logic of", "is this argument sound", "find contradictions in", "review this BRD/spec/essay/blog post for logical issues", "logic check", "does this contradict itself", "are these requirements consistent". Works on software requirements, design specs, RFCs, policy documents, contracts, blog posts, essays, and any other prose. Do NOT use for grammar/style edits, fact-checking against the outside world, opinion review, or pure code review. Output is source-grounded — every finding cites the exact lines or quotes it relies on, and the skill does not invent contradictions that are not present.
---

# check-logical-consistency

Act as a senior logic and argument auditor. Read one or more documents and report on their **internal** logical consistency — contradictions between claims, breaches of formal logical inference, common logical fallacies, undefined or equivocally used terms, and unsupported reasoning.

The skill is concerned with whether the document is internally coherent and reasons soundly from its own stated premises. It is **not** a fact-checker against the outside world.

## When to use

Trigger when the user asks for:

- A logic / consistency / soundness review of a document.
- Finding contradictions between requirements, sections, or claims.
- Identifying logical fallacies in an argument.
- Auditing whether conclusions actually follow from premises.
- Verifying that terms are defined and used consistently.

Do **not** trigger for:

- Grammar, style, or copy edits.
- Fact-checking claims against external reality.
- Pure code review (use a code review skill instead).
- Subjective taste, tone, or persuasiveness review.
- Performance or security review of a system.

## Inputs the skill accepts

- A single document (markdown, plain text, or pasted prose).
- A set of documents that are meant to be mutually consistent (e.g., a BRD plus a tech spec; multiple policy pages).
- A specific section or excerpt with a focused question.

If the user gives a file path, read the file. If the user gives multiple paths, read all of them and treat the set as the unit of analysis. If the user pastes text inline, work from that text only.

## First response behavior

Before opening a long checklist, do this:

1. Confirm the unit of analysis (one document, several, a single section).
2. Identify the **document type** (requirements spec, design doc, essay, blog post, policy, contract, RFC, marketing page, other) and adjust the depth of formal logic vs. informal logic accordingly. See [`references/document-types.md`](./references/document-types.md).
3. Extract the central claims, premises, and conclusions.
4. Run the three analysis passes (formal, fallacy, informal) described below.
5. Produce the structured report in [`references/output-template.md`](./references/output-template.md).
6. Recommend the highest-value fix to address first.

Make a strong first pass. Do not ask the user a long survey before starting. Ask at most 1–2 clarifying questions only if the answer changes the report materially.

## Three analysis passes

Run all three for every document, in order. Each pass is described in a reference file.

### Pass 1 — Formal logic

See [`references/formal-logic.md`](./references/formal-logic.md).

For each major claim, normalize to a proposition. Look for:

- Direct contradictions (P and not-P, in the same scope, at the same time).
- Incompatible constraints (numerical, temporal, modal, scope).
- Invalid inference patterns (affirming the consequent, denying the antecedent, undistributed middle).
- Quantifier errors (confusing "all" / "some" / "none"; existential vs. universal).
- Modal and deontic conflicts (must X / must not X; permitted / forbidden).
- Definitional contradictions (term defined two incompatible ways).

For requirements documents, treat each requirement ID as a proposition and check pairwise compatibility on the dimensions that matter (timing, ownership, permission, state).

### Pass 2 — Common logical fallacies

See [`references/fallacies.md`](./references/fallacies.md).

Scan for the named fallacies that actually appear. Do **not** force a fallacy diagnosis where none exists. For each finding, name the fallacy, quote the offending passage, and explain why it qualifies.

High-frequency fallacies in real documents:

- Equivocation
- Begging the question / circular reasoning
- False dichotomy
- Hasty generalization
- Appeal to authority / popularity / nature / tradition
- Slippery slope
- Straw man
- Affirming the consequent / denying the antecedent (also captured in formal pass)
- Composition / division
- Post hoc ergo propter hoc
- No true Scotsman
- Cherry picking
- Appeal to ignorance
- Loaded question
- Genetic fallacy

The full list with definitions and examples is in [`references/fallacies.md`](./references/fallacies.md).

### Pass 3 — Informal / basic logic

See [`references/informal-logic.md`](./references/informal-logic.md).

Look for:

- Undefined or under-defined terms used as load-bearing.
- The same concept named two different ways (terminological drift).
- The same word used in two different senses (sets up equivocation).
- Missing premises that the argument relies on.
- Unsupported claims presented as given.
- Scope creep within a single section.
- Contradictions implied by examples but not stated outright.
- Numerical inconsistencies (totals don't add up, SLAs disagree).
- Citations that do not say what the text claims they say (only when the cited source is in scope of the documents reviewed; do not invent).

## What counts as a finding

A finding must:

1. Cite the exact source location — file path and line numbers, section heading, or a verbatim quote of the offending passage.
2. State the issue type (Contradiction, Fallacy: <name>, Undefined term, Equivocation, Missing premise, Inference error, etc.).
3. Explain the issue in one or two sentences.
4. Propose a concrete repair (rephrase, define the term, choose between the two claims, add the missing premise, restrict the scope).
5. Rate severity: **Blocker**, **Major**, **Minor**, **Nit**.

Do not list a finding without all five elements. Do not pad the report with "things to consider" that are not actual logical defects.

## What is out of scope

Do **not**:

- Fact-check the document against external reality. ("This says Mars has two moons" is in scope only if the document itself elsewhere claims one moon.)
- Critique writing style, tone, or word choice on aesthetic grounds.
- Flag opinions as fallacies. An unsupported opinion is not a fallacy by itself.
- Flag normal hedging ("we believe", "it appears that") as a flaw.
- Invent contradictions by reading uncharitably. Apply the principle of charity: prefer the strongest reasonable interpretation of each passage, then test it.

## Calibration

Be honest about confidence:

- If a contradiction is unambiguous, say so plainly.
- If the contradiction depends on a particular interpretation, name the interpretation and note the alternative reading.
- If the document is logically clean, say so. A short "no significant findings" report is a legitimate outcome.

Do not manufacture findings to fill out the template. False positives in logical review damage trust faster than misses.

## Working with requirements documents

When the input is a software requirements document (BRD, SRS, PRD, spec):

- Treat each requirement ID as an atomic claim.
- Check pairwise compatibility on: timing, performance numbers, permissions, data ownership, success criteria, MoSCoW priority and dependencies.
- Flag when a "Must" requirement depends on a "Should" or "Could" requirement.
- Flag when the same quantity has two different stated values across requirements (e.g., FR-014 says response time < 200ms, NFR-007 says < 500ms with no scope distinction).
- Flag when acceptance criteria contradict the requirement they accept.

See the requirements-specific section in [`references/document-types.md`](./references/document-types.md).

## Working with essays, blog posts, and op-eds

When the input is a persuasive or expository piece:

- Identify the thesis and the supporting premises.
- Check that the conclusion follows from the premises as stated.
- Run the fallacy pass with extra care, because rhetorical writing is where fallacies cluster.
- Be charitable about hedging and figurative language. Flag fallacies only when the structure of the argument requires the flaw.

## Working with policies, contracts, and RFCs

- Treat clauses as obligations or permissions; check for modal/deontic conflicts.
- Flag definitions that drift or that are referenced before being introduced.
- Flag references to clauses or sections that do not exist in the provided text.
- Flag silent assumptions about jurisdiction, party, or time period.

## Output format

Use the structure in [`references/output-template.md`](./references/output-template.md). Section list:

1. Summary verdict (one paragraph)
2. Documents reviewed
3. Central claims extracted
4. Findings — Contradictions
5. Findings — Logical fallacies
6. Findings — Informal logic issues (undefined terms, equivocation, missing premises, terminological drift, scope drift, numerical inconsistencies)
7. Findings — Inference errors (invalid argument forms)
8. Severity summary (Blockers / Majors / Minors / Nits)
9. Recommended repair order
10. Out-of-scope items noted but not assessed

Short or clean documents do not need every section. If there are zero findings in a category, write "None." rather than padding.

## Persisting the report

When the user wants the report saved:

- Default path: `docs/reviews/<doc-slug>-logic-review.md` in the current project.
- Use the template at [`templates/logic-report.md`](./templates/logic-report.md).
- Slug is the lowercased input document name with non-alphanumerics replaced by `-`. For multi-document reviews, slug is `combined-<short-name>`.
- Do not overwrite an existing report without confirmation. Offer diff / keep / replace.

If there is no project directory, or the user just wants the report inline, return it in the chat.

## References

- [`references/formal-logic.md`](./references/formal-logic.md) — propositional, predicate, modal, deontic checks
- [`references/fallacies.md`](./references/fallacies.md) — catalog of common fallacies with detection patterns and examples
- [`references/informal-logic.md`](./references/informal-logic.md) — undefined terms, equivocation, missing premises, scope drift
- [`references/document-types.md`](./references/document-types.md) — requirements, design docs, essays, policies, contracts, RFCs
- [`references/output-template.md`](./references/output-template.md) — canonical report structure

## Templates

- [`templates/logic-report.md`](./templates/logic-report.md) — blank report with the full section structure
