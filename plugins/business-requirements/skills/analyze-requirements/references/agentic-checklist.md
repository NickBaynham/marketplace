# Agentic Feature Checklist

Apply these questions to every AI or agent feature before treating its requirements as complete. If a question cannot be answered, that gap is itself a requirement or an open question.

## Task definition

1. What specific task is the agent performing? (One sentence, no marketing language.)
2. What is the agent **not** doing in this feature?
3. Why is this an agent task rather than a deterministic system task? Name the judgment or unstructured-input element that justifies the choice.

## Inputs

4. What input data does the agent need? Where does it come from?
5. What is the quality and provenance of that input data? Who owns it?
6. What happens when input is missing, malformed, or stale?

## Tools and APIs

7. What tools or APIs does the agent call?
8. Which calls are read-only? Which mutate state?
9. What rate limits, quotas, or costs apply?

## Outputs

10. What does the agent produce? In what format?
11. What is the maximum and minimum useful output (1 result, 100 results, structured vs. prose)?
12. Is the output a recommendation, a draft, or a committed action?

## Human-in-the-loop

13. Who reviews or approves the output?
14. Which actions require human approval before they take effect?
15. What is the review interface? How does a reviewer accept, edit, or reject?
16. What happens if no human reviews within a timeout?

## Write-back scope

17. What can the agent write back to the platform (status updates, model updates, comments, tickets)?
18. What can it never write back without explicit human action?
19. Are writes reversible? How?

## Source grounding and traceability

20. How is each output traced to source evidence (document IDs, requirement IDs, line ranges, URLs)?
21. Can a user click through from an agent claim to the underlying evidence?
22. What happens to traceability when the underlying source changes?

## Hallucination and confidence

23. How is the agent's confidence measured or estimated?
24. What confidence threshold gates auto-action vs. human review?
25. How are unsupported claims detected (citations missing, contradicting evidence)?
26. What is the user-visible disclosure when output is low-confidence?

## Logging and audit

27. What is logged for every agent invocation (prompt, inputs, tools called, outputs, reviewer decision)?
28. How long are logs retained? Who can read them?
29. Can a past decision be reproduced from the log?

## Fallback and failure

30. What happens when the model is unavailable, slow, or returns an error?
31. What happens on low confidence? Defer to human, decline, or escalate?
32. Is there a deterministic fallback path? Should there be?

## Permissions

33. Which roles can invoke this agent?
34. Which roles can approve its writes?
35. What scopes does the agent have on integrated systems? Can those scopes be reduced?

## Drift and feedback

36. How are reviewer decisions captured and used to improve the agent?
37. What signals indicate the agent is degrading (rising rejection rate, slower latency, more retries)?
38. Who watches those signals, and on what dashboard?

## Output

When writing AI/agentic requirements, structure each one as: **purpose, inputs, tools, outputs, HITL checkpoint, write-back scope, traceability, confidence handling, logging, permissions.** A requirement that omits any of these is incomplete.
