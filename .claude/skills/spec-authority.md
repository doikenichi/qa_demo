---
name: spec-authority
description: Where each kind of statement lives and which source wins any conflict.
---

# Spec Authority

The authoritative location for each kind of statement, from [One authoritative statement for each thing](../../appointment-booking-project.md#one-authoritative-statement-for-each-thing):

| Kind of statement | Where it lives | Wins conflict? |
|---|---|---|
| Behavior rules | [Behavior specification](../../appointment-booking-project.md#behavior-specification) | **Yes — always** |
| Policy | Numbered business rules 1–21 | Yes |
| Ownership and parentage | BR/PO/FR/NFR tables | Yes |
| Acceptance criteria | `docs/requirements/FR-0NN.md`, `NFR-0NN.md` | Yes |
| Wire shapes | `contracts/openapi.yaml`, `contracts/events/*.schema.json` | Yes |
| Evidence | `docs/traceability.md` | Yes |
| Reasons | `docs/decisions.md` — reasons only, never implementation guidance | No |

## Rules to apply

- **Cite rules by number** (rule 2, rule 18) rather than restating them in comments or code.
- **The behavior specification wins any conflict** — if this skill, a log row, or a comment says something different, the spec section is right and everything else is the defect.
- **A rule needing an edit in three places was duplicated.** Delete the copies; do not keep them in sync.
- **The decisions log is history, not guidance.** Read a row's `Status` (`Current`, `Amended by …`, `Superseded by …`) before citing it. If a rule can only be found in the log, it belongs in the behavior specification.
- **Never invent a status code or issue code at a call site.** Add it to the spec, then to the contract, in that order.

## Change discipline

When a rule changes: change one place plus a one-line log row. If the behavior specification and an implementation disagree, the implementation is the defect — not the spec.

---
*When a situation this skill does not cover arises, see [escalation-protocol](escalation-protocol.md).*
