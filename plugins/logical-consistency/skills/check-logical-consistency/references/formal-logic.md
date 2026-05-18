# Formal Logic Checks

This pass treats the document as a set of propositions and looks for breaches of formal logic. The aim is not to typeset every sentence as symbolic logic — it is to use formal logic as a discipline for finding contradictions and invalid inferences that are easy to miss in prose.

## Step 1 — Extract propositions

For each major claim, write a one-line proposition. Assign a symbol (P, Q, R, …) when it makes the analysis clearer. For requirements documents, the requirement ID itself can act as the symbol.

Capture:

- The subject (who or what).
- The predicate (what is asserted about it).
- The modality (will, must, may, shall, should, can, cannot).
- The scope (when, where, for whom, under what condition).
- The quantifier (all, some, none, exactly N).

Two claims that look like contradictions on the surface are often consistent once scope and quantifier are made explicit. The reverse also happens.

## Step 2 — Propositional checks

For every pair of related propositions, ask:

- **Direct contradiction.** Is one P and the other not-P, with the same subject, predicate, modality, scope, and quantifier?
- **Incompatible constraints.** Do they impose constraints on the same quantity that cannot be simultaneously satisfied? (Both true vs. both required.)
- **Mutual exclusion missed.** Do two requirements both fire on the same trigger and demand incompatible outcomes?

Example — direct contradiction:

> Section 3.1: "All uploaded documents are encrypted at rest."
> Section 7.2: "Archived documents older than 12 months are stored in cold storage in plaintext for cost reasons."

These are P and not-P over an overlapping set.

Example — incompatible constraint:

> FR-014: "The system shall return search results within 200 ms for 95% of queries."
> NFR-007: "All search responses shall be returned within 500 ms."

These are not contradictions in isolation (200 ms ≤ 500 ms), but if NFR-007 is read as a budget (no faster than required) or if a later section claims the system never exceeds 100 ms, the set becomes inconsistent. Read constraints together, not in isolation.

## Step 3 — Quantifier checks

Confusing universal and existential quantifiers is one of the most common formal errors in prose.

- "All users can edit their own profile."  (∀ user)
- "Users can edit their own profile."  (ambiguous — likely ∀)
- "Some users can edit their own profile."  (∃)
- "No user can edit another user's profile."  (¬∃)

Watch for:

- "Users can X" followed later by "Users cannot X." Without quantifier discipline these are read as universal.
- "Every X has a Y" vs. "There exists a Y for every X." Order matters: "every man loves a woman" is genuinely ambiguous between (∀x ∃y) and (∃y ∀x).
- Implicit universal claims with one counterexample in a later section.

## Step 4 — Inference pattern checks

Common invalid argument forms that show up in prose:

### Affirming the consequent

If P then Q. Q. Therefore P. Invalid.

> "If the migration ran cleanly, the row count would match. The row count matches. Therefore the migration ran cleanly."

The matching row count is consistent with a clean migration but does not prove it. Other causes are possible.

### Denying the antecedent

If P then Q. Not P. Therefore not Q. Invalid.

> "If the user is an admin, they can delete records. This user is not an admin. Therefore they cannot delete records."

The conclusion may be true but does not follow — a non-admin role could also grant delete.

### Undistributed middle

All A are B. All C are B. Therefore all A are C. Invalid.

> "All approved vendors are in the registry. All compliant suppliers are in the registry. Therefore all approved vendors are compliant suppliers."

### Illicit major / illicit minor

A term distributed in the conclusion that was not distributed in the premise.

## Step 5 — Modal and deontic checks

Modal logic deals with necessity / possibility. Deontic logic deals with obligation / permission. Most software requirements and policies are deontic.

Conflicts to flag:

- **Must vs. must not** on the same action.
- **Permitted vs. forbidden** on the same action for the same actor.
- **Required vs. optional** for the same field, in the same state.
- **Mandatory vs. conditional** without naming the condition.

The modal verbs to watch are: shall, must, will, may, should, can, cannot, must not, may not.

For RFC-style documents, the words have specific meanings (RFC 2119: MUST, MUST NOT, SHOULD, SHOULD NOT, MAY). Check that the document uses them consistently and that no clause assigns two different levels to the same behavior.

## Step 6 — Temporal checks

Time produces a class of contradictions that prose obscures.

- "Before approval, the record is in draft." + "Drafts cannot be assigned a reviewer." + "The reviewer must be assigned before approval." → cycle.
- Dates that disagree (effective 2026-01-01 in one section, 2026-03-01 in another).
- Ordering claims that conflict (X happens before Y; later: Y happens before X).
- Retention periods that conflict (delete after 90 days; retain for audit for 7 years).

Build a small state or sequence diagram in your head (or on the page if the document is long) and check that the document's claims can co-exist on it.

## Step 7 — Definitional contradictions

If a term is defined two different ways in the same document, every claim that uses the term inherits the contradiction.

- "An *Active Account* is one that has logged in within 30 days."
- Later: "Active Accounts are those with a non-zero subscription."

These are different sets. Every downstream claim about Active Accounts is now ambiguous.

## What this pass produces

For each finding:

- The propositions involved (quoted from the source).
- The kind of formal failure (direct contradiction, quantifier error, invalid inference form, modal conflict, temporal conflict, definitional contradiction).
- The narrowest repair: which proposition to change, drop, or scope.

Formal pass findings are usually high-confidence and rate as **Major** or **Blocker** unless the document later disambiguates.
