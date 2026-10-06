# QA learning paths

A collection of quality-engineering learning paths for this project. Each path names a QA
discipline, the project objective it practises, the milestone at which it becomes live, the
guardrail artifact that enforces it, and — the only thing that closes it — the evidence the
project already has to produce anyway.

**Status of this file.** A committed project document, recorded in the
[decisions log](../../appointment-booking-project.md#context-and-decisions-log) and in
[Suggested repository layout](../../appointment-booking-project.md#suggested-repository-layout). It
is deliberately **not** one of the nine
[portfolio deliverables](../../appointment-booking-project.md#portfolio-deliverables): it is the
author's practice plan, not a claim a reviewer is invited to assess. Nothing here is authoritative
over anything.

## How to read this file

This file is an **index into evidence**, not a syllabus of its own. It restates no rule. Every
path cites the authoritative section, and where this file and that section disagree, **the section
wins** — the same discipline
[One authoritative statement for each thing](../../appointment-booking-project.md#one-authoritative-statement-for-each-thing)
applies everywhere else in the project.

Three conventions keep it honest:

- **A path is closed by evidence, never by self-assessment.** Each path's *Closed when* line names a
  run, a report, or an assertion the project must produce regardless — the same standard the
  [NFR evidence floors](../../appointment-booking-project.md#non-functional-requirements) set. "I
  read about it" closes nothing, and neither does "the script exists".
- **A path is scheduled, not outstanding.** Before its milestone a path reads *not yet due*, exactly
  as an NFR row does. Not-yet-due blocks nothing and is not a gap.
- **No path invents a target.** No percentage, no threshold, no score to beat. The
  [exclusion list](../../appointment-booking-project.md#non-functional-requirements) applies to this
  file too.

**Scope: QA only.** This is a QA-focused project, so no path here teaches application development.
Java language features, design patterns, Spring idiom, and how a dependency should be called are
present in this project **as guardrails the tooling enforces** — the `java-patterns`,
`secure-coding`, and `code-standard` skills — and deliberately **not** as learning paths. If a
question is "how should this code be written", it belongs to a skill; if it is "how do I know it is
true", it belongs here.
[QLP-13](#qlp-13--practice-currency-and-the-discipline-of-a-decline) is the single path that touches
tooling choice, and it covers the *judgement* — whether a practice has genuinely moved on — never a
language or framework technique.

## The collection

| ID | Path | Serves | Live from | Enforced by |
|---|---|---|---|---|
| [QLP-01](#qlp-01--requirements-and-traceability) | Requirements and traceability | PO-002 | 0 | `spec-authority`, `requirement-docs`, `traceability-auditor` |
| [QLP-02](#qlp-02--documentation-and-spec-authority) | Documentation and spec authority | PO-002, PO-005 | 0 | `spec-authority`, `standards-reviewer` |
| [QLP-03](#qlp-03--qa-of-the-qa-tooling) | QA of the QA tooling | PO-005 | 0 | all skills' eval suites |
| [QLP-04](#qlp-04--the-gate-proven-to-fail) | The gate, proven to fail | PO-005 | 0 | `standards-reviewer`, `secure-coding` |
| [QLP-05](#qlp-05--security-and-non-disclosure-verification) | Security and non-disclosure verification | PO-006, BR-007 | 0 (partly), 2, 4 | `secure-coding`, `security-reviewer` |
| [QLP-13](#qlp-13--practice-currency-and-the-discipline-of-a-decline) | Practice currency and the discipline of a decline | PO-005 | 0 | `standards-reviewer`, `spec-authority` |
| [QLP-06](#qlp-06--test-design-and-layering) | Test design and layering | PO-001 | 1 | `test-design`, `test-layering-reviewer` |
| [QLP-07](#qlp-07--determinism-and-flakiness) | Determinism and flakiness | PO-001 | 1 (practice), 5 (evidence) | `deterministic-tests`, `stability-reviewer` |
| [QLP-08](#qlp-08--observability-as-a-test-oracle) | Observability as a test oracle | PO-006 | 1 | `code-standard` |
| [QLP-09](#qlp-09--contract-verification-on-both-boundaries) | Contract verification on both boundaries | PO-001 | 2 | `spec-authority` |
| [QLP-10](#qlp-10--concurrency-and-correctness-under-load) | Concurrency and correctness under load | PO-004 | 3 (practice), 7 (evidence) | `stability-reviewer` |
| [QLP-11](#qlp-11--environment-and-pipeline-qa) | Environment and pipeline QA | PO-003 | 5, 6 | — |
| [QLP-12](#qlp-12--measurement-discipline-and-reporting) | Measurement discipline and reporting | PO-004, PO-007 | 5, 7 | — |

The table is ordered by the milestone a path goes live, not by ID; the IDs are stable identifiers
and never a reading order, which is why QLP-13 sits among the milestone 0 rows rather than at the
end.

Six paths are live at **milestone 0** — QLP-01 to QLP-05 and QLP-13. They are the ones that exist
before any product behavior, which is the whole reason
[milestone 0 was prepended](../../appointment-booking-project.md#completion-point).

---

## Milestone 0 paths

### QLP-01 — Requirements and traceability

*Serves:* [PO-002](../../appointment-booking-project.md#project-objectives). *Live from:* milestone 0.
*Enforced by:* `spec-authority` and `requirement-docs` (skills), `traceability-auditor` (agent).

The portfolio's central claim, and the one most often asserted rather than shown. The skill being
practised is not writing requirements — it is reading a requirement set as an auditor and finding
where it lies.

What to work through, each in its authoritative home:

- The five-layer descent, walked once end to end:
  [How requirements fit together](../../appointment-booking-project.md#how-requirements-fit-together).
- Why the tiers have different owners, and what the boundary forbids:
  [Requirements](../../appointment-booking-project.md#requirements). The reflex to build is that a BR
  is never narrowed to fit an implementation.
- The two directions of the scope test — an FR or NFR with no parent is scope creep, a BR or PO with
  no child is an unimplemented promise:
  [Business requirements and project objectives](../../appointment-booking-project.md#business-requirements-and-project-objectives).
- The row shape a reviewer can follow without asking a question, including the `FR-004` worked
  example: [The traceability view](../../appointment-booking-project.md#the-traceability-view).
- Why `not yet due` is not the same as unverified, and why a quarantine reverts a requirement to
  not-done: [Definition of done](../../appointment-booking-project.md#definition-of-done).

**The judgement this path is really for.** A requirement is done when linked evidence passes at the
current definition-of-done tier — *not because code exists*. Most traceability matrices in the wild
fail on exactly that sentence.

*Closed when:* [NFR-009's floor](../../appointment-booking-project.md#non-functional-requirements),
which lands at milestone 8; at milestone 0 only the `NFR-012.md` row of
[milestone 0's exit criteria](../../appointment-booking-project.md#milestone-exit-criteria) plus a
`traceability-auditor` run recording both a finding and a clean run. The judgement it trains is the
sentence most traceability matrices fail on: a requirement is done when linked evidence passes at
the current tier, not because code exists.

### QLP-02 — Documentation and spec authority

*Serves:* [PO-002](../../appointment-booking-project.md#project-objectives),
[PO-005](../../appointment-booking-project.md#project-objectives). *Live from:* milestone 0.
*Enforced by:* `spec-authority` (skill), `standards-reviewer` (agent).

Documentation QA treated as a verifiable property rather than tidiness. A spec with the same rule in
three places has three rules, and a reviewer cannot tell which one the code answers to.

- The rule the whole document set is built on:
  [One authoritative statement for each thing](../../appointment-booking-project.md#one-authoritative-statement-for-each-thing).
- Which part of the document a change belongs in, which is rarely next to the text it resembles:
  [How to read this document](../../appointment-booking-project.md#how-to-read-this-document).
- The index sections that must be cited rather than re-derived, and which side wins when an index
  disagrees with the section it points at:
  [Limitations and assumptions](../../appointment-booking-project.md#limitations-and-assumptions).
- The log read as history, never as guidance — `Current`, `Amended by`, `Superseded by`:
  [Context and decisions log](../../appointment-booking-project.md#context-and-decisions-log).

**The three failures to learn to spot.** A rule restated instead of cited. A rule that needs editing
in three places, which means it was duplicated and the copies should be deleted rather than synced.
A statement implemented from a decisions-log row.

*Closed when:* [NFR-012's floor](../../appointment-booking-project.md#non-functional-requirements) is met for `spec-authority`, plus one pull request touching two
or more documents that passes `standards-reviewer` with no duplicated-rule finding. The judgement it
trains is that a rule needing an edit in three places was duplicated, and the copies get deleted
rather than synced.

### QLP-03 — QA of the QA tooling

*Serves:* [PO-005](../../appointment-booking-project.md#project-objectives). *Live from:* milestone 0.
*Enforced by:* every skill's own eval suite.

The path with the least precedent elsewhere and the most transferable skill in the project: testing
the thing that does your testing. A guardrail nobody has watched fail is indistinguishable from one
that is misconfigured.

- What each artifact owns, and why one set shapes work while the other reviews it:
  [Engineering standards as artifacts](../../appointment-booking-project.md#engineering-standards-as-artifacts)
  — **the authoritative list**, and the only place the set is stated. It also carries the rule for
  when a new artifact is justified, worth reading as a worked example of the
  one-authoritative-location discipline: the count was duplicated across nine places, and the
  attempt to add a single artifact is what exposed it.
- The evidence floor, which is a checklist and nothing beyond it: NFR-012 in
  [Non-functional requirements](../../appointment-booking-project.md#non-functional-requirements).
- Why no AI step sits inside the gate, and what that costs:
  [AI-assisted SDLC](../../appointment-booking-project.md#ai-assisted-sdlc).

**The one idea worth carrying out of this project.** *A suite that passes without its skill is
measuring the model, not the artifact.* Every skill therefore needs at least one eval proven to fail
when the skill is withheld. The same reasoning is why a review agent's finding is advice and never a
merge blocker: an LLM-evaluated assertion cannot promise the same verdict for the same inputs, which
is precisely what NFR-001 demands.

*Closed when:* [NFR-012's floor](../../appointment-booking-project.md#non-functional-requirements), items 1 and 2, across every skill and agent in the set. The
judgement it trains is the one above — a suite that passes without its skill measures the model, not
the artifact — which is why the withheld-skill case is demonstrated rather than asserted.

### QLP-04 — The gate, proven to fail

*Serves:* [PO-005](../../appointment-booking-project.md#project-objectives). *Live from:* milestone 0.
*Enforced by:* `standards-reviewer`, `secure-coding`, and the planted-violation runs themselves.

Negative testing applied to the pipeline. Every scanner in the gate is configured by someone who
believes it works; this path is the habit of not believing it.

Each kind of planted violation has to fail a pull request: a formatting breach, a static-analysis
finding above the configured severity, a contract-lint error, a chart-lint error, a committed
secret, and a vulnerable dependency —
[NFR-012](../../appointment-booking-project.md#non-functional-requirements), item 3, and the
milestone 0 row of
[Milestone exit criteria](../../appointment-booking-project.md#milestone-exit-criteria). The tool
inventory is in [Tooling](../../appointment-booking-project.md#tooling); do not add or substitute one
without a decisions-log row.

**The design question each planted violation asks.** Not "did it fail" but "would it have failed for
the right reason, and would it still fail next week". A planted secret that trips the diff scanner
but not the full-tree scan has proven less than it looks.

*Closed when:* [NFR-012's floor](../../appointment-booking-project.md#non-functional-requirements), item 3 — which fixes both the kinds of violation and that each
must fail a pull request. The judgement it trains is to ask whether the gate failed for the *right*
reason, not merely that it failed.

### QLP-05 — Security and non-disclosure verification

*Serves:* [PO-006](../../appointment-booking-project.md#project-objectives),
[BR-007](../../appointment-booking-project.md#business-requirements-and-project-objectives).
*Live from:* milestone 0 for the handling rules and the scanners; milestone 2 for non-disclosure
evidence; milestone 4 for credential evidence. *Enforced by:* `secure-coding`, `security-reviewer`,
`code-standard`.

Security here is verified as a property of observable output, which is the only form of it this
project can actually evidence. Three NFRs carry it, and all three are assertion-shaped:

- **NFR-005**, the staff credential existing only as an injected environment value and reaching no
  repository, log, response, or report.
- **NFR-006**, nothing beyond a confirmation code's own entropy distinguishing a code that
  identifies a booking from one that does not — the identical-404 discipline in
  [Confirmation code access](../../appointment-booking-project.md#confirmation-code-access).
- **NFR-010**'s redaction half: no code, token, name, email address, or reason for a visit in any
  span, metric label, log record, or exception message —
  [Telemetry](../../appointment-booking-project.md#telemetry).

All three floors are in
[Non-functional requirements](../../appointment-booking-project.md#non-functional-requirements), and
the rules themselves in
[Staff credential](../../appointment-booking-project.md#staff-credential) and
[Error responses](../../appointment-booking-project.md#error-responses).

**What this path must never be allowed to become.** This project is a practice vehicle with a bearer
confirmation code and a shared development token, both deliberate shortcuts. Nothing learned here
licenses calling any of it hardened or secure, and real authentication is explicitly out of scope —
[MVP boundaries](../../appointment-booking-project.md#mvp-boundaries). Learning to state that
plainly is part of the path.

*Closed when:* the floors for [NFR-005, NFR-006 and NFR-010](../../appointment-booking-project.md#non-functional-requirements), each at its own milestone, plus
NFR-012's floor for `secure-coding`. Milestone 0 closes only the scanner and eval portion. The
judgement it trains is that non-disclosure is a property of observable output — a response body, a
log line, a span attribute — and never a claim about intent.

### QLP-13 — Practice currency and the discipline of a decline

*Serves:* [PO-005](../../appointment-booking-project.md#project-objectives). *Live from:* milestone 0.
*Enforced by:* `standards-reviewer`, `spec-authority`.

Staying current without letting novelty reopen a settled decision. These are two halves of one
judgement, and most engineers are taught only the first.

**Three kinds of out-of-date, and only one is mechanically checkable.**

| Kind | Example | How it is handled |
|---|---|---|
| Mechanical currency | A pinned dependency behind its latest release; a deprecated API still called | Checkable. Belongs to `code-standard` and the gate. |
| Practice currency | How the industry now does a thing the project already does — assertion style, a superseded telemetry convention, a normalised result format | **Proposal only.** A review raises it; a decisions-log row accepts or declines it. |
| Declined and closed | Something the log already considered and declined with a reason | **Not reopened by novelty.** The recorded reason must have stopped being true. |

The third row is the one to internalise, because this project has exercised it repeatedly. Read the
declines before raising anything:
[Context and decisions log](../../appointment-booking-project.md#context-and-decisions-log) declines
a contract broker and a schema registry, three hosted flaky-detection services, a core-versus-stretch
split, and a second orientation document — and the
[exclusion list](../../appointment-booking-project.md#non-functional-requirements) declines DORA
metrics and every coverage percentage. Several of those are mainstream practice. **None of them
becomes admissible because it is mainstream.**

**The judgement this path is for.** *Novelty is not evidence.* A practice-currency proposal has to
name the recorded reason it overturns and say what changed about the world, not about the fashion.
The failure mode it prevents is the most common one in this whole project: importing a borrowed
threshold because it is standard practice, which
[Quality standards](../../appointment-booking-project.md#quality-standards) bans outright — *no
borrowed threshold becomes a gate without a spec change and a decisions-log row saying what decision
the number improves.*

The second-most-common failure is quieter: a `Current` decision that nobody has reread since it was
taken. Reading a `Current` row and finding it still correct is a real outcome of this path, and has
to be recorded as one.

*Closed when:* one practice-currency review is recorded that produces **both** at least one proposal
carrying a draft decisions-log row, and at least one explicit *still current, reason unchanged*
finding with its reasoning — proving the review can say no. A review that only ever proposes change
is not a review.

---

## Later paths

Each is *not yet due* until its milestone, which blocks nothing. Listed with the authority to start
from, so a path can be opened the day its milestone does.

### QLP-06 — Test design and layering

*Serves:* PO-001. *Live from:* milestone 1. *Enforced by:* `test-design`, `test-layering-reviewer`.

Each level's defined job and *Demonstrates* line:
[Quality architecture: the levels](../../appointment-booking-project.md#quality-architecture-the-levels)
and [Test strategy](../../appointment-booking-project.md#test-strategy). The judgement being
practised is the lowest-level rule, and its sharp edge: **redundant breadth is a defect in this
project, not extra safety**, so a higher-level test that re-asserts a rule a lower level already
pins — without adding integration risk — gets deleted. *Closed when:* a `test-layering-reviewer` run
records a level-misplacement finding that is accepted and acted on.

### QLP-07 — Determinism and flakiness

*Serves:* PO-001. *Live from:* milestone 1 in practice, milestone 5 for evidence.
*Enforced by:* `deterministic-tests`, `stability-reviewer`.

The banned list and the quarantine protocol:
[Quality standards](../../appointment-booking-project.md#quality-standards), with NFR-001's floor.
The distinctive skill is deriving a flaky score from disagreement across four same-commit runs
rather than from reruns —
[Flaky score, without retries](../../appointment-booking-project.md#flaky-score-without-retries) —
which is the version a project banning retries is forced to learn. *Closed when:* the floors for [NFR-001 and NFR-013](../../appointment-booking-project.md#non-functional-requirements). The judgement it trains is that a retry
converts a flake into a green build and destroys the only signal that would have found it.

### QLP-08 — Observability as a test oracle

*Serves:* PO-006. *Live from:* milestone 1.

Asserting in-process through an in-memory exporter, never by querying a hosted backend:
[Telemetry](../../appointment-booking-project.md#telemetry) and NFR-010's floor. Exactly one span
event per committed change and none per replay is the assertion that separates an oracle from a
dashboard. *Closed when:* [NFR-010's floor](../../appointment-booking-project.md#non-functional-requirements). The judgement it trains is that an assertion on telemetry is
an oracle, while a dashboard nobody asserts against is decoration.

### QLP-09 — Contract verification on both boundaries

*Serves:* PO-001. *Live from:* milestone 2.

[Contract tests](../../appointment-booking-project.md#contract-tests), against
`contracts/openapi.yaml` and `contracts/events/*.schema.json` validated in both directions, with
committed samples replayed as the backward-compatibility check. The habit being built is that a new
status or issue code reaches the spec, then the contract, then a call site — in that order, never the
reverse. *Closed when:* producer-side and consumer-side validation both run in CI and the committed
`v1` samples replay green.

### QLP-10 — Concurrency and correctness under load

*Serves:* PO-004. *Live from:* milestone 3 in practice, milestone 7 for recorded evidence.

[Load tests](../../appointment-booking-project.md#load-tests), with `under load` meaning exactly what
[Operational definitions](../../appointment-booking-project.md#operational-definitions) says and
nothing looser. The lesson named in NFR-002's own rationale: *a harness-level race test and a real
one are different claims*. Correctness is the gate — exactly one active booking, no `500`, no code
outside the error table — and numbers are only ever recorded. *Closed when:* [NFR-002's floor](../../appointment-booking-project.md#non-functional-requirements). The judgement it trains is the one NFR-002's own rationale
names: a harness-level race test and a real one are different claims.

### QLP-11 — Environment and pipeline QA

*Serves:* PO-003. *Live from:* milestone 5, completed at milestone 6.

[Test environments and disposable environments](../../appointment-booking-project.md#test-environments-and-disposable-environments),
with NFR-007 and NFR-008's floors. The part most pipelines skip is the whole point here: teardown
proven on a passing run, a **deliberately failing** run, and a **cancelled** run, plus a sweep run
whose report includes the expected "nothing to delete". *Closed when:* the floors for [NFR-007 and NFR-008](../../appointment-booking-project.md#non-functional-requirements). The judgement it trains is that a teardown
reporting success without being checked, and a sweep nobody ever sees run, are the two ways this
property quietly becomes untrue.

### QLP-12 — Measurement discipline and reporting

*Serves:* PO-004, PO-007. *Live from:* milestone 5 for reporting, milestone 7 for baselines.

[Quality metrics and reporting](../../appointment-booking-project.md#quality-metrics-and-reporting)
and [Performance tests](../../appointment-booking-project.md#performance-tests), over the exact
definitions of `comparable runs`, `baseline`, and `recorded environment`. Two refusals carry the
whole path: **a laptop measurement is never an SLA**, and **no published metric is a gate**. Learning
to report `no gate: baseline not established (n/3 comparable runs)` as a normal passing outcome —
rather than reaching for a number from a different environment — is the habit. *Closed when:* the floors for [NFR-003 and NFR-013](../../appointment-booking-project.md#non-functional-requirements). The judgement it trains is the refusal
itself — reporting *no gate: baseline not established* as a normal passing outcome, rather than
borrowing a number from somewhere it does not apply.

---

## Adding a path

A new path needs: an ID, the PO or BR it serves, the milestone it becomes live, the guardrail
artifact that enforces it, a citation-only body, and a *Closed when* line naming a run, a report, or
an assertion. A path whose closure condition is the existence of a file does not qualify — that is
the same bar [the NFR floors](../../appointment-booking-project.md#non-functional-requirements) set,
and for the same reason.

A path that would teach application development belongs to a skill instead, not here.
