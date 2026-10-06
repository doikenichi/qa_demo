---
name: requirement-docs
description: Shape of docs/requirements/FR-0NN.md and NFR-0NN.md — acceptance criteria, verification plan, TC IDs, linked spec section.
---

# Requirement Docs

This skill governs the shape of `docs/requirements/FR-0NN.md` and `docs/requirements/NFR-0NN.md`. The authoritative rule on when to write one and who owns it is in [Acceptance criteria and test case IDs](../../appointment-booking-project.md#acceptance-criteria-and-test-case-ids).

**This skill writes no requirement and owns no parentage.** Both belong to the requirement tables in the spec.

## File shape: FR-0NN.md

```markdown
# FR-NNN — [Requirement name from the FR table]

**Parent:** BR-00N — [BR name]  
**Behavior spec:** [Link to the relevant spec section]  
**Milestone:** N  

## Acceptance criteria

[Numbered list of testable outcomes, taken from the behavior specification. Each maps to one or more TC IDs below.]

## Verification plan

| TC ID | Description | Level | Status |
|---|---|---|---|
| TC-FR-NNN-1 | [Behavior description] | unit / integration / contract / e2e | Not run |
| TC-FR-NNN-2 | ... | ... | ... |

## Notes

[Optional: boundary cases, data setup requirements, known limitations.]
```

## File shape: NFR-0NN.md

Same structure, plus two required sections:

```markdown
## Learning objective

[One sentence: what skill or discipline this NFR exists to practise.]

## Minimum-evidence floor

[The smallest evidence that counts as done — a run, a report, or an assertion. Never "the file exists".]
```

## TC ID format

`TC-FR-<number>-<sequence>` and `TC-NFR-<number>-<sequence>`.

Examples: `TC-FR-004-1`, `TC-FR-004-2`, `TC-NFR-001-3`.

The sequence resets per requirement, not per milestone. IDs are stable once assigned — a deleted test leaves a gap rather than causing a renumber.

## When to write it

At the **start of the milestone that delivers the requirement**, before any test or production code for it. Writing it before the code is what keeps the acceptance criteria honest.

There is no `BR-00N.md` — business requirements have no acceptance-criteria documents.

---
*When a situation this skill does not cover arises, see [escalation-protocol](escalation-protocol.md).*
