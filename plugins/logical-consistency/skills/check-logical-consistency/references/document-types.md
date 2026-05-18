# Document Types

Different document types invite different failure modes. The three analysis passes (formal, fallacy, informal) apply to all, but the emphasis shifts.

## Software requirements (BRD, SRS, PRD, spec)

Most common failure modes:

- Two requirements impose incompatible constraints on the same quantity (timing, ownership, permission, state).
- A "Must" requirement depends on a "Should" or "Could" requirement.
- A requirement's acceptance criteria contradict the requirement.
- A term is defined once and used inconsistently elsewhere (e.g., "Active User" defined in §3, used differently in §7).
- Quantifier slips: "Users can X" later read as universal when only one role was meant.
- Modal conflicts: must / must not, shall / shall not on the same action.
- Numerical drift: p95 latency disagrees between a functional requirement, a non-functional requirement, and the SLA appendix.

Emphasize:

- Pairwise compatibility check across requirement IDs.
- Modal/deontic discipline.
- Definitional consistency for the vocabulary that requirements depend on.
- Priority dependency check (Must depending on Should is a real defect).

De-emphasize:

- Rhetorical fallacies (rare in well-formed specs; flag only when present).

## Design documents and RFCs

Common failure modes:

- "We chose X" without ruling out Y on the stated criteria — invalid by undistributed middle or false dichotomy.
- Hidden trade-offs presented as universal benefits.
- Slippery slope arguments against unchosen alternatives.
- Composition fallacy: each component is good, therefore the design is good.
- Begging the question: the design is justified by what it produces.
- Definitions of central terms (Service, Module, Boundary) that drift between sections.

Emphasize:

- Inference pattern checks on "we chose X because" arguments.
- Trade-off symmetry: are the chosen and rejected options described on the same dimensions?
- Composition / division on system-level claims.

## Essays, blog posts, op-eds, marketing copy

Common failure modes:

- Equivocation in central terms.
- Begging the question and circular reasoning.
- Appeal to popularity / authority / novelty.
- False dichotomy.
- Hasty generalization from a single anecdote.
- Straw man of opposing views.
- Slippery slope.

Emphasize:

- Fallacy pass.
- Charity test before flagging — rhetorical writing uses hedging, analogy, and figurative language. Flag only when the argument structure actually depends on the flaw.

De-emphasize:

- Pairwise pedantic contradictions across paragraphs that the author plainly did not intend as a system.

## Policies and procedures

Common failure modes:

- Deontic conflicts: an action is both required and forbidden under overlapping conditions.
- Definitions introduced late or never.
- References to clauses that do not exist.
- Silent jurisdictional or temporal assumptions.
- Loaded definitions that embed conclusions ("a *qualified candidate* is one who has been hired").

Emphasize:

- Deontic logic discipline.
- Definitions-before-use ordering.
- Cross-reference integrity within the document set.

## Contracts and legal text

Same as policies, plus:

- Definitions section vs. usage in the body — drift is a high-severity finding.
- Capitalized defined terms used outside their defined meaning.
- Numerical inconsistencies in payment terms, dates, durations.
- "Notwithstanding" clauses that override earlier provisions without flagging which.

Flag drift; do not interpret legal meaning. The skill checks consistency, not law.

## Academic / scientific writing

Common failure modes:

- Affirming the consequent dressed up as evidence ("our model predicts X, X is observed, therefore our model is correct").
- Cherry picking of results.
- Definitional drift between abstract, methods, and conclusion.
- Statistical claims whose quantifiers do not match (n=12 used to support a universal claim).
- Conclusion broader than the experimental scope.

Emphasize:

- Scope of the conclusion relative to the evidence presented.
- Quantifier discipline.

## Mixed document sets

When the user provides multiple documents (e.g., a BRD plus a tech spec, or a policy plus its implementing procedure):

- Treat the set as one unit.
- Use the document type of each piece to set its pass emphasis.
- Spend extra effort on cross-document consistency: shared terms must agree; shared numbers must agree; obligations in one must not contradict permissions in the other.
- When a contradiction spans two documents, locate it at both ends and propose which side should give.
