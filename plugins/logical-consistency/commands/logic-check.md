---
description: Check a document or set of documents for internal logical consistency — contradictions, logical fallacies, undefined terms, and faulty inference. Invokes the check-logical-consistency skill.
argument-hint: <file path(s) or pasted text>
---

Invoke the `check-logical-consistency` skill to audit the internal logical consistency of the input below.

Input: $ARGUMENTS

Interpretation rules:

- If the input is one or more file paths, read each file and treat the set as the unit of analysis.
- If the input is pasted prose, work from that prose only.
- If the input is empty, ask one clarifying question: "Which document, set of documents, or passage should I audit for logical consistency?" and stop until the user answers.

Follow the skill's **First response behavior**:

1. Confirm the unit of analysis.
2. Identify the document type and set pass emphasis accordingly.
3. Extract the load-bearing claims, premises, and conclusions.
4. Run the three analysis passes in order: formal logic, fallacies, informal logic.
5. Produce the report using the canonical output template.
6. Recommend the highest-value repair to address first.

Apply the principle of charity before flagging any finding. Do not invent contradictions to fill out the template. A short "no significant findings" report is a legitimate outcome.

Do not write the report to a file unless the user asks. Return the report in the chat.
