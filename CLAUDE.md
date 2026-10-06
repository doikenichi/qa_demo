# CLAUDE.md

Guidance for Claude Code (claude.ai/code) working in this repository.

**This file is a map, not a source.** It says what the current state is, where each answer lives,
and what you may not decide. It deliberately does **not** restate product rules: those live in
[`appointment-booking-project.md`](appointment-booking-project.md), which wins every conflict. If
you are about to copy a rule into this file, add a pointer instead.

Every `#anchor` below is a heading in `appointment-booking-project.md`.

## 1. What this is, and the current state

This project is **specification only**. The sole file is
[`appointment-booking-project.md`](appointment-booking-project.md) — the authoritative spec for an
appointment-booking app built as a practice vehicle for multi-level automated testing, requirement
traceability, and disposable test environments.

There is no code, no package manifest, and no git repository, and therefore **no build, lint, test,
or run commands yet. Do not invent them.** Add the real command strings to this section as they
come into existence.

The stack *is* chosen and recorded in the
[decisions log](appointment-booking-project.md#context-and-decisions-log), with the inventory in
[Tooling](appointment-booking-project.md#tooling). **Change a stack row only through a new
decisions-log row.** A single `Taskfile.yml` is the one documented command NFR-007 requires.

**This is a practice vehicle, not a service.** Fabricated data only, in every environment and at
every milestone — never a real name, email address, or reason for a visit. Do not describe the
project, or anything in it, as production-ready, hardened, or secure; customer access is a bearer
confirmation code and staff access is a shared development token, both deliberate shortcuts.
"Robust" here means evidenced and deterministic, nothing more.

Nothing blocks implementation. Work starts at **milestone 0** — see section 7.

## 2. Where to look for what

The spec is already organised for a reader. Start at
[How to read this document](appointment-booking-project.md#how-to-read-this-document), which lists
its nine parts and says when each should change. Put a change in the right part rather than near
the text it resembles.

| Part | Go here for |
|---|---|
| [Introduction](appointment-booking-project.md#introduction) | What the project is and is not; the product summary, its users and boundaries; the core workflow |
| [Definitions and conventions](appointment-booking-project.md#definitions-and-conventions) | Terminology, assumptions and limitations, the one-authoritative-location rule, operational definitions, ID conventions |
| [Requirements](appointment-booking-project.md#requirements) | Any requirement, rule, behavior, or evidence question — **the authority** |
| [Implementation strategy and tooling](appointment-booking-project.md#implementation-strategy-and-tooling) | Stack, repository layout, environments |
| [Software architecture](appointment-booking-project.md#software-architecture) | The component inventory and the two contracts |
| [Quality strategy](appointment-booking-project.md#quality-strategy) | How the quality approach fits together — an index holding no rule of its own; follow its links |
| [Development strategy](appointment-booking-project.md#development-strategy) | TDD/BDD, test levels, standards tooling, quality metrics, what each platform addition buys, portfolio deliverables, milestones, definition of done |
| [Reusable prompts](appointment-booking-project.md#reusable-prompts-for-adding-context) | The eight fill-in-the-bracket templates |
| [Context and decisions log](appointment-booking-project.md#context-and-decisions-log) | Why something was decided — reasons, never restatements |

Inside Requirements, five layers sit in order, and the spec's own layer table says which altitude
answers which question, with [How requirements fit together](appointment-booking-project.md#how-requirements-fit-together)
walking one requirement from need to evidence: stakeholder requirements (BR, PO) → functional and non-functional
requirements (FR, NFR) → [business rules 1–21](appointment-booking-project.md#business-rules) →
[behavior specification](appointment-booking-project.md#behavior-specification) →
[the traceability view](appointment-booking-project.md#the-traceability-view). A question normally
travels down that list, and the answer is usually at the bottom.

## 3. Where the hard parts are specified

These are the parts that require care. They exist so the straightforward behavior stays true under
concurrency, retries, crashes, caching, and clock boundaries; most other behavior is ordinary CRUD.

| Topic | Spec section |
|---|---|
| Window, slot generation, `from`/`to` | [Availability window](appointment-booking-project.md#availability-window) |
| Instants, offsets, DST, whole-second precision | [Time handling](appointment-booking-project.md#time-handling) |
| Field limits, unknown fields, `Idempotency-Key` | [Input validation](appointment-booking-project.md#input-validation) |
| Bearer code, normalization, identical 404s | [Confirmation code access](appointment-booking-project.md#confirmation-code-access) |
| Cutoff, freed slots versus the slots view | [Cancellation](appointment-booking-project.md#cancellation) |
| Eligibility, three reasons, staff range bounds | [Completion](appointment-booking-project.md#completion) |
| Fingerprint, replay, fenced lease, expiry | [Idempotent booking creation](appointment-booking-project.md#idempotent-booking-creation) |
| Credential handling at the edge | [Staff credential](appointment-booking-project.md#staff-credential) |
| Error shape, issue list, six-step precedence | [Error responses](appointment-booking-project.md#error-responses) |
| Outbox, dedup, dead letter, notification records | [Domain events and notification records](appointment-booking-project.md#domain-events-and-notification-records) |
| Version validation, equivalence, time-to-live | [Availability cache](appointment-booking-project.md#availability-cache) |
| Traces, span events, redaction | [Telemetry](appointment-booking-project.md#telemetry) |

**Cite these; never restate or re-derive them here.** Each section states its rule once, with the
reasoning and the boundary cases, and the implementation, `contracts/openapi.yaml`,
`contracts/events/*.schema.json`, and the tests all answer to it. Do not introduce a status code or
an error code outside its table.

Policy sits in [business rules 1–21](appointment-booking-project.md#business-rules) — cite them by
number. Ownership of each rule sits in the `Business rules` column of the
[functional requirements](appointment-booking-project.md#functional-requirements) table, which
doubles as the rule-coverage check; that section also records which rules are stakeholder policy
(changing one needs a stakeholder decision) and which are architect-authored invariants that keep
the first group true.

## 4. Authority, ownership, and how to change a rule

**One authoritative location per statement** — the rule this file exists to respect. See
[One authoritative statement for each thing](appointment-booking-project.md#one-authoritative-statement-for-each-thing).

| Kind of statement | Where it lives |
|---|---|
| Behavior rules | [Behavior specification](appointment-booking-project.md#behavior-specification) — authoritative, wins any conflict |
| Policy | The numbered business rules |
| Ownership and parentage | The BR/PO/FR/NFR tables |
| Acceptance criteria | `docs/requirements/FR-0NN.md`, `NFR-0NN.md` |
| Wire shapes | `contracts/openapi.yaml`, `contracts/events/*.schema.json` |
| Evidence | `docs/traceability.md` |
| Reasons | The decisions log — reasons, never restatements |

When a rule changes, change one place plus a one-line log row. If a rule seems to need editing in
three places, it was duplicated: delete the copies instead of syncing them. Never invent a status
code or an issue code at a call site — add it to the spec and then to the contract, in that order.

**The requirement tiers have different owners, and the boundary is real.** BR (stakeholders — here
assumed, with the author as proxy) and PO (the author as learner) are the master tiers; FR and NFR
are the architect's and the developers' answer to them, ours to split, reword, renumber, or delete
while the parent still holds. The tier table is in
[Requirements](appointment-booking-project.md#requirements).

- Do not restate, narrow, or reinterpret a BR to fit an implementation. If the work needs a BR
  changed, **say so and stop** rather than editing the stakeholder tier.
- An FR's parent is always a BR, never a PO. A PO may shape how work is verified; it may never
  justify product behavior. If a proposed behavior serves only a PO, it belongs in the test or
  tooling layer, not in the application.
- An FR or NFR with no parent is scope creep; a BR or PO with no child is an unimplemented promise.
  Both are checked in both directions at milestone 8.
- An NFR owns no business rule — it names the requirements it *stresses*. An NFR row reads **not
  yet due** before its milestone, which is not the same as unverified and blocks nothing; from its
  milestone onward a regression blocks the current milestone's exit.
- A BR or PO has no checks, no acceptance-criteria document, and no business rules of its own. It
  is satisfied when its children are verified.
- A requirement is done when linked verification evidence passes at the definition-of-done tier
  current for the active milestone — **not because code exists**. Do not describe untested behavior
  as verified, and treat a requirement whose check is quarantined as flaky as not done.

`docs/traceability.md` is the reviewer-facing artifact and must carry links, not assurances; what
each row contains, and the links every requirement makes outward, are fixed in
[The traceability view](appointment-booking-project.md#the-traceability-view) — with the `FR-004`
example there showing the expected shape.

**The decisions log is history, not guidance. Never implement from it.** Read a row's `Status`
(`Current`, `Amended by …`, `Superseded by …`) before citing it; never delete or rewrite a row;
when a decision changes, add a new row and mark the old one. If a rule can only be found in the
log, it is in the wrong place. The log moves to `docs/decisions.md` once `docs/` exists.
**`BR-008` is retired and must never be reused** — there are eight live business requirements,
001–007 and 009.

### What AI may and may not do

See [AI-assisted SDLC](appointment-booking-project.md#ai-assisted-sdlc) and
[Engineering standards as artifacts](appointment-booking-project.md#engineering-standards-as-artifacts).

**AI may draft, and a human reviews before commit:** requirement and acceptance-criteria documents,
test plans and cases, Gherkin, test code, production code under `tdd-cycle`, chart and pipeline
configuration, documentation. Record the prompt beside the artifact it produced.

**AI may never decide:** anything in the behavior specification, the business rules, the requirement
tiers and their parentage, the contents of the decisions log, or whether a requirement is done. A
generated change to one of those is a **proposal** until a human accepts it.

**No AI step can pass or fail the build.** The review agents are advisory: they run on every
pull request and their findings are recorded there, including the clean runs, but a finding never
blocks a merge by itself. An LLM-evaluated assertion cannot promise the same verdict for the same
inputs, and NFR-001 requires exactly that.

Milestone 0 delivers the standards artifacts under `.claude/`, before any product code, because
standards carried as habits cannot be reviewed, handed over, or shown to fail.
[Engineering standards as artifacts](appointment-booking-project.md#engineering-standards-as-artifacts)
is **the only authoritative list of the set** — do not restate the count or the names here, and read
that table rather than this paragraph to learn what exists. It also carries the rule for when a new
artifact is justified: withholding it would make a process outcome non-deterministic or unevidenced,
and adding or removing one needs a decisions-log row. **A skill cites the spec; it never becomes a
second copy of it.** Each carries an eval suite that runs in CI, and one eval per
skill must be proven to fail when the skill is withheld — a suite that passes without its skill
measures the model, not the artifact. `docs/ai-sdlc.md` records what AI drafted, what reviewed it,
what it may never decide, and the honest limitation: none of this makes a generated artifact
correct, it makes the human gate visible.

## 5. Scope discipline

**Do not add features, abstractions, or folders beyond what the current milestone needs.** The
spec's narrowness is a deliberate design constraint, not an oversight — and it is a constraint on
**product behavior**, not on the platform around it. The delivery setup is deliberately
industry-shaped (two services, an event log, a cache, telemetry, Helm on Kubernetes, a scanning
gate, AI-assisted workflow tooling); every piece of it serves a project objective, and none of it
licenses a single extra feature.

Out of scope for the MVP: customer accounts, payments, reminders, recurring or multi-service
appointments, an availability editor, external integrations, and real authentication (staff
endpoints use a simple development credential only).

Also out of scope, each declined with a reason in the log: RabbitMQ or any second broker, a schema
registry, a contract broker such as Pact, a service mesh, a second CI system, real email or any
outbound message transport, alerting or on-call, and autoscaling.

Fixed MVP parameters: one business, one staff member, one configured time zone (`APP_TIME_ZONE`,
default `Europe/Berlin`), 30-minute slots, weekday business hours 09:00–17:00, a 7-calendar-day
availability window including today, holidays ignored, seeded schedule data.

**A notification record is an audit entry, and delivering the message is out of scope.** There is no
mail transport in any environment, nothing is ever sent to any address, and "sent" is not a state
this product has. BR-009 asks for the record, not the delivery; do not describe it as notifying the
customer, and treat a proposal to actually send as a new business requirement with its own
transport, evidence, and milestone.

Two index sections answer scope questions — **cite them rather than re-deriving a limitation or a
ranking:**

- [Limitations and assumptions](appointment-booking-project.md#limitations-and-assumptions) indexes
  every assumption and every deliberate omission, naming the owning section and, for an assumption,
  what breaks if it is false. Read it before claiming the project does something. It is an index:
  where it disagrees with the section it links to, that section wins — and a new entry goes in the
  owning section first, with a pointer row added there.
- [What each platform addition buys](appointment-booking-project.md#what-each-platform-addition-buys)
  is the authoritative statement of what each platform piece earns in evidence, its cost, and the
  order of removal if the project is ever trimmed. It is **not** a stretch tier: all nine milestones
  stay mandatory and the completion point stays at the end of milestone 8.

The [non-functional requirements](appointment-booking-project.md#non-functional-requirements)
section also fixes what is deliberately *not* promised — read its exclusion list before adding an
operational or measurement concern. Nothing on it (uptime, rate limiting, retention, alerting, a
coverage percentage, a threshold on any published metric, and the rest) may be added without a spec
change and a decisions-log entry, nor may any absolute latency or throughput target. A laptop
measurement is never an SLA, and a dashboard is never a service level. **Observability changed
category, not ambition:** it is NFR-010 because tests assert on it, and everything operational
about it stays excluded regardless.

A second, unrelated portfolio project would get its own repository, not a folder here.

## 6. Working rules that bind an edit

These constrain how work is done, whatever the milestone. The policy detail is in
[Quality standards](appointment-booking-project.md#quality-standards).

- **Determinism is mandatory**: fixed seed data, injected clock, no system-clock dates at run time,
  no sleeps as synchronisation, no inter-test order dependence.
- **No automatic retries anywhere** in CI or the E2E runner. Do not add one to get a build green.
- **No sleep, no time-to-live, and no scenario retry as a synchronisation mechanism**, including
  across services. A bounded condition with a fixed timeout and a recorded attempt count is the
  only acceptable wait.
- A test that fails then passes unchanged is tagged `@flaky`, pulled from the gate, and given a
  same-day issue linked to its requirement. Its requirement reverts to not-done, and the quarantine
  blocks the current milestone's exit — including when the requirement belongs to an earlier
  milestone. Fix it, or delete it and replace the evidence it provided.
- **No coverage percentage gate.** The gate is linked evidence per requirement plus at least one
  check for each business rule 1–21 (NFR-009).
- **Load results gate on correctness first**, with numeric comparisons only against a baseline
  established over three comparable runs, never as an SLA.
- **Nothing AI-evaluated sits inside the gate** (section 4).
- **Standards are artifacts with their own checks.** The lint, static-analysis, contract-lint,
  chart-lint, secret-, dependency-, and image-scanning gate must each be proven to fail a pull
  request on a planted violation (NFR-012).
- **Secrets stay out of the tree.** The staff credential comes from `STAFF_API_TOKEN` in every
  environment, with a committed `.env.example` placeholder and a git-ignored `.env`. The same
  applies to the two hosted-service tokens (telemetry and static analysis): injected in CI, never
  in the tree. Never commit, log, print, or report one, and never put one in a span attribute.

One line each for the three areas that have their own spec sections:

- **Test layering** — [the levels](appointment-booking-project.md#quality-architecture-the-levels)
  and the [test strategy](appointment-booking-project.md#test-strategy) give each level a defined
  job and a *Demonstrates* line. Put a check at the **lowest level that can hold it**, and delete a
  higher-level test that re-asserts a rule a lower level already pins without adding integration
  risk — redundant breadth is a defect in this project, not extra safety.
- **Metrics and reporting** —
  [Quality metrics and reporting](appointment-booking-project.md#quality-metrics-and-reporting)
  holds the catalogue and the authority split. **No published metric is a gate**,
  `docs/traceability.md` is authoritative for whether a requirement is verified, and the flaky
  score comes from the four same-commit runs rather than from retries. Do not adopt a borrowed
  threshold, and do not wire a metric as a gate without a spec change and a log row.
- **Environments and evidence timing** —
  [Test environments and disposable environments](appointment-booking-project.md#test-environments-and-disposable-environments)
  describes the shared k3d/ArgoCD cluster, the two per-pull-request forms, and why load runs use a
  fixed idle host. The [definition of done](appointment-booking-project.md#definition-of-done) is
  **tiered by milestone**, so do not demand environment evidence that cannot exist yet. Never use
  production data or credentials; cleanup must be automatic and safe to repeat, and every
  environment must **tear down even when tests fail**.

The terms **under load**, **comparable runs**, **baseline**, and **reproducible setup** have exact
definitions in [Operational definitions](appointment-booking-project.md#operational-definitions) and
must not be used loosely. The pinned numbers that implementation and tests must match live there,
in the [NFR section](appointment-booking-project.md#non-functional-requirements), and in
[Performance tests](appointment-booking-project.md#performance-tests) — read them rather than
recalling them. Each NFR also carries a stated learning objective and a **minimum-evidence floor**:
the floor is what "done" requires, exceeding it is never needed to exit a milestone, and every
floor names a run, a report, or an assertion rather than the existence of a file.

## 7. Where we are

**Active milestone: 0.** Each milestone pairs a product increment with a verification increment; the
rows are in [Delivery milestones](appointment-booking-project.md#delivery-milestones) and the
binding conditions in [Milestone exit criteria](appointment-booking-project.md#milestone-exit-criteria).
The ordered work breakdown for the active milestone is `docs/milestones/milestone-0.md` — sequencing,
dependencies, decisions, and risks only; the exit rows stay authoritative.

| # | What it adds |
|---|---|
| 0 | Foundation — monorepo, builds, both service skeletons, the contract files, every skill and review agent in the standards-artifact table with their evals, the full lint and scanning gate, CI, telemetry wiring, base Helm chart. **No product behavior.** |
| 1 | View slots, with the availability cache and the telemetry baseline |
| 2 | Book and look up |
| 3 | Prevent duplicates — idempotency |
| 4 | Cancel, staff schedule, complete, the transactional outbox, `notification-service`, the staff notification view. **Product behavior complete.** |
| 5 | Stable test setup — Helm, k3d and ArgoCD, the reporting portal, the first published metrics and flaky score |
| 6 | Disposable environments |
| 7 | Load and performance baselines |
| 8 | Traceability and defect linking. **Project complete.** |

**Check which milestone is active before proposing work, and keep later-milestone concerns out of
earlier ones.** A milestone is not finished until every one of its exit rows is true, and a
quarantined test never carries into the next milestone.

Milestone 0 was prepended rather than appended, and **no later milestone was renumbered** — every
milestone reference elsewhere still means what it meant.

**State "done" at the right altitude.** The booking workflow and all product behavior are complete
at the end of milestone 4 — notifications included. The *project* is complete at the end of
milestone 8, the single completion point, so milestone 8's traceability pass can link the milestone
6 and 7 evidence. Milestones 0 and 5–8 add no product behavior at all; they serve PO-001 to PO-007.

A review proposed splitting this into a core vertical slice plus optional stretch work, including
making the idempotency lease optional; it was considered and **declined** (see the decisions log).
Do not re-propose a core/stretch split, and do not treat milestones 5–8 or the fenced lease as
optional.

## 8. Layout and conventions

The project is a **monorepo of several deployable pieces serving one product**, with the layout in
[Suggested repository layout](appointment-booking-project.md#suggested-repository-layout): `docs/`,
`services/booking-service/` (authoritative), `services/notification-service/` (consumes booking
events), `frontend/`, `e2e/`, `contracts/`, `load-tests/`, `charts/`, `infra/`, `quality/`,
`.claude/`, plus a root `Taskfile.yml`.

**Create a directory only when something goes in it** — do not scaffold empty folders to match the
example. There is no `backend/` directory: the two services live under `services/`.

Conventions, with the detail in
[Acceptance criteria and test case IDs](appointment-booking-project.md#acceptance-criteria-and-test-case-ids):

- Requirement IDs: `BR-001`–`BR-007` and `BR-009`; `PO-001`–`PO-007`; `FR-001`–`FR-012`;
  `NFR-001`–`NFR-013`. The old flat `REQ-0NN` IDs were renamed to `FR-0NN` with their numbers
  unchanged, so `@FR-004` tags and existing decisions still line up.
- Test cases: `TC-FR-<number>-<sequence>` and `TC-NFR-<number>-<sequence>`, e.g. `TC-FR-004-2`,
  `TC-NFR-003-2`.
- Each FR and NFR has `docs/requirements/FR-0NN.md` or `docs/requirements/NFR-0NN.md` holding its
  acceptance criteria and verification plan, written at the start of the milestone that delivers it,
  before any test or production code for it. The requirements table gives only a *minimum
  verification type*, not the evidence plan. **There is no `BR-00N.md` — do not create one.**
- Each milestone has a delivery plan at `docs/milestones/milestone-NN.md`, written at that
  milestone's start: sequencing and risks only, subordinate to the exit criteria, restating no rule.
  Do not write one for a milestone that is not active.
- Requirements, test plans, and test cases live in version control as reviewable Markdown under
  `docs/`. Bug tracking uses repository issues.

When a request matches one of the eight fill-in-the-bracket templates in
[Reusable prompts](appointment-booking-project.md#reusable-prompts-for-adding-context) — project
context, add or refine a requirement, add a test case, review a change, investigate a bug, plan a
disposable environment, define a load or performance test, define an event/cache/telemetry assertion
— follow that template's required output structure.
