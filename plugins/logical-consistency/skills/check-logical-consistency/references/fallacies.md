# Logical Fallacy Catalog

This catalog covers the fallacies that appear most often in real documents. Each entry gives the structure, a detection pattern, an example, and a repair.

A fallacy is a defect in the **structure** of an argument, not a defect of opinion or taste. Do not flag a statement as a fallacy unless the structure is genuinely faulty. Apply the principle of charity first: prefer the strongest reasonable reading before calling foul.

## Equivocation

A key term shifts meaning across the argument.

**Detection.** The same word carries two senses, and the conclusion only follows if the senses are conflated.

> "The law is what the courts apply. The law of gravity is therefore what the courts apply."

**Repair.** Disambiguate the term, or use two different terms.

## Begging the question (circular reasoning)

The conclusion is assumed in the premises.

**Detection.** Restate the argument; the premise and conclusion are the same proposition wearing different clothes.

> "This system is reliable because it produces reliable results."

**Repair.** Replace one side with an independent claim that can be tested.

## False dichotomy (false dilemma)

The argument presents only two options when more exist.

**Detection.** "Either X or Y" framing where Z is also available.

> "Either we ship without tests or we miss the deadline."

**Repair.** Enumerate the realistic options, including partial / phased solutions.

## Hasty generalization

A universal conclusion drawn from a small or unrepresentative sample.

**Detection.** A specific incident is used to support a sweeping claim.

> "Two users complained about the new flow. The new flow is failing for everyone."

**Repair.** Restate the claim with appropriate scope and sample size.

## Appeal to authority

A claim is supported solely by who said it, where the speaker is not a relevant authority or where the claim itself is contested among authorities.

**Detection.** "X says Y, therefore Y" without independent reason to accept Y, and X is outside the relevant domain or quoted out of context.

> "A well-known investor said this architecture is the future of search."

**Repair.** Provide the substantive reason, not the endorsement.

## Appeal to popularity (ad populum)

A claim is supported because many people accept it.

**Detection.** "Everyone is doing X" used in place of a reason to do X.

> "Every modern startup uses this framework, so we should too."

**Repair.** Argue from the actual properties of the option.

## Appeal to nature / appeal to tradition

"Natural is good" or "we've always done it this way."

**Detection.** Either of those phrases as a load-bearing premise.

**Repair.** Argue from the property, not from naturalness or tradition.

## Slippery slope

If we allow A, then B will follow, then C, then catastrophe D — with no support for the chain.

**Detection.** A chain of conditionals whose individual links are not defended.

> "If we let users edit their display name, they'll start spoofing identities, then we'll have fraud, then we'll lose the platform."

**Repair.** Defend each link or remove the chain.

## Straw man

The opposing position is restated in a weaker form than its actual proponents hold, and that weaker form is attacked.

**Detection.** The argument refutes a position no informed proponent of the original view would defend.

**Repair.** Restate the strongest version of the opposing view before refuting it.

## Affirming the consequent

If P then Q. Q. Therefore P. Invalid. Also covered in the formal pass.

## Denying the antecedent

If P then Q. Not P. Therefore not Q. Invalid. Also covered in the formal pass.

## Composition

What is true of the parts is asserted of the whole without warrant.

> "Every component in the system is fast, therefore the system is fast."

(End-to-end latency can be slow even when each step is fast.)

**Repair.** Argue from the property of the whole, not just the parts.

## Division

The reverse of composition. What is true of the whole is asserted of each part.

> "The team is highly experienced, so each engineer is highly experienced."

## Post hoc ergo propter hoc

After this, therefore because of this. Mistakes temporal sequence for causation.

> "We added the new caching layer and traffic doubled. The caching layer caused the traffic increase."

**Repair.** Distinguish correlation from causation; offer a mechanism or a controlled comparison.

## No true Scotsman

A counterexample to a generalization is dismissed by tightening the generalization ad hoc.

> "No production-grade Python project relies on dynamic typing." "Stripe does." "No *truly* production-grade Python project relies on dynamic typing."

**Repair.** Either accept the counterexample or restate the original claim more narrowly from the start.

## Cherry picking

Selecting only the evidence that supports the conclusion.

**Detection.** A pattern of citations, examples, or numbers that all run one way, with no acknowledgment of contrary evidence the author plausibly knows.

**Repair.** Address the strongest contrary evidence.

## Appeal to ignorance

X has not been proven false, therefore X is true. Or: X has not been proven true, therefore X is false.

> "No one has shown the system can be breached, so it is secure."

**Repair.** Replace with the actual evidence for or against.

## Loaded question

A question that presupposes a contested premise.

> "Why does this feature ship without tests?"

(Presumes the feature ships without tests.)

**Repair.** Separate the presupposition from the question.

## Genetic fallacy

Judging an idea by its origin rather than its content.

> "That argument was raised by a competitor, so it isn't worth considering."

**Repair.** Engage with the content.

## Tu quoque

Dismissing a criticism by pointing out that the critic is guilty of the same fault. The criticism may still be valid.

## Red herring

Introducing an irrelevant topic to divert attention from the actual issue.

## Moving the goalposts

Revising the criteria for success after the original criteria were met.

## Texas sharpshooter

Drawing a target around the bullet holes — selecting the data first, then identifying a pattern.

## Bandwagon

A specific form of ad populum: "growth proves correctness."

## How to write a fallacy finding

For each fallacy you flag:

1. Name the fallacy.
2. Quote the offending passage verbatim with its location.
3. Show the argument structure that makes it a fallacy of this type (two sentences max).
4. Propose a repair.
5. Severity: typically **Major** for load-bearing fallacies, **Minor** for incidental ones that do not affect the document's main claims.

If you cannot draw the argument structure, the diagnosis is probably wrong. Drop it.
