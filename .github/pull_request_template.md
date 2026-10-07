## What this changes

<!-- One or two sentences. What a reviewer needs before reading the diff. -->

**Active milestone:** <!-- e.g. 0 -->
**Requirements touched:** <!-- e.g. NFR-012, FR-004 — or "none" -->

## Why

<!-- The problem, not the solution. Link the issue if there is one. -->

## Evidence

<!--
A requirement is done when linked verification evidence passes at the
definition-of-done tier current for the active milestone — not because code
exists. Link the run, the report, or the assertion. "Tested locally" is not
evidence.
-->

- [ ] Checks pass, with no retry added to make them pass (NFR-001)
- [ ] New or changed tests sit at the lowest level that can hold them
- [ ] `docs/traceability.md` updated, if this changes what verifies a requirement

## Spec and decisions

<!--
Leave the boxes unticked if they do not apply — an unticked box is information.

A rule changed in more than one place was duplicated: delete the copies rather
than syncing them. A status code or `issue` code reaches the spec and then the
contract, in that order, before any call site.
-->

- [ ] No business rule, behavior-specification statement, or requirement parentage changed
- [ ] A stack, tooling, or policy change carries a new row in `docs/decisions.md`
- [ ] No BR or PO was narrowed, reworded, or reinterpreted to fit this implementation
- [ ] AI-drafted content is logged in `docs/ai-sdlc.md` and is marked a proposal until accepted

## Determinism and secrets

- [ ] No system-clock read at run time, no sleep used as synchronisation, no retry
- [ ] No credential added to the tree, a log line, a report, or a span attribute

---

<!--
The block between the two markers below is written by the `Review Agents`
workflow. Leave the markers in place and do not edit between them: the next run
replaces whatever sits there. Everything outside them is yours and is never
touched.
-->

<!-- review-agents:start -->
_The review agents have not reported on this pull request yet._
<!-- review-agents:end -->
