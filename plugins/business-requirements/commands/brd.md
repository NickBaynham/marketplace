---
description: Produce a Business Requirements Analysis (BRD) for a feature, capability, or platform idea. Invokes the analyze-requirements skill.
argument-hint: <feature or platform idea>
---

Invoke the `analyze-requirements` skill to produce a Business Requirements Analysis for the topic below.

Topic: $ARGUMENTS

If the topic is empty, ask one clarifying question: "What feature, capability, or platform idea should I analyze?" and stop until the user answers.

Otherwise, follow the skill's **First response behavior**:

1. Restate the idea in clearer business language.
2. State the likely business objective.
3. Identify the likely users.
4. List the 3–5 biggest ambiguities (not a long survey).
5. Produce a structured first-pass analysis using the canonical 18-section output template, marking assumptions clearly.
6. Recommend the next best area to refine.

Apply both **Product Strategy Mode** and **Implementation Handoff Mode** unless the user has previously disabled them in this conversation.

Use the preferred Quality Intelligence Platform vocabulary when the topic fits that domain. If the topic is clearly a different domain, adopt the user's domain but keep the same analytical rigor.

Do not write the output to a file unless the user asks. Return the analysis in the chat.
