---
name: escalation-protocol
description: When to stop and raise rather than choose a plausible default. The single statement of the stop-and-raise contract.
---

# Escalation Protocol

This skill is the single statement of the stop-and-raise contract. Every other skill carries a one-line pointer here rather than a copy.

## When escalation is mandatory

Stop work on the path and open a GitHub issue when any of these holds:

- A status code or `issue` code is needed that does not appear in the closed list in [Error responses](../../appointment-booking-project.md#error-responses) or `contracts/openapi.yaml`.
- A business requirement (BR) would have to be narrowed or reinterpreted to fit an implementation choice.
- A rule appears to need an edit in three places — that means it was duplicated; do not sync copies.
- A stack entry or dependency change is needed that is not in a `Current` decisions-log row.
- A numeric threshold, percentage, or target is needed that has no decisions-log row permitting it.
- A requirement has no parent (FR or NFR with no BR or PO) or a BR/PO has no child (FR or NFR).

## Shape of an escalation

1. Open a GitHub issue naming the exact case encountered.
2. Link the spec section that governs the area (or note its absence).
3. Stop work on that path — do not choose a plausible default and continue.
4. Resume only after the issue is resolved with a logged decision.

## What is not an escalation

- A question answered by the behavior specification — read it and apply it.
- A gap in implementation detail that the spec leaves to the implementer (naming, package structure, local variable choice).
- A test-ordering question answered by `test-design`.
- A credential-handling question answered by `secure-coding`.

The decisions log is history, not guidance. If a rule can only be found there, it is in the wrong place — escalate rather than implement from a log row.
