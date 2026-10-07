# Appointment Booking Test Project

## How to read this document

Nine parts, in the order a reader needs them. Each part is self-contained, and every statement in this document lives in exactly one of them — see [One authoritative statement for each thing](#one-authoritative-statement-for-each-thing).

| Part | What it holds | Change it when |
| --- | --- | --- |
| [Introduction](#introduction) | What this project is, what it deliberately is not, and the workflow the product delivers. | The product, its boundaries, or why the project exists changes. |
| [Definitions and conventions](#definitions-and-conventions) | The terms, the assumptions and limitations, and the document rules that everything after this depends on. Read this before changing anything; a first read needs only the terminology and the limitations index. | A term needs pinning, or a document rule changes. Rare, and it affects everything. |
| [Requirements](#requirements) | Every requirement, in tiers, with the numbered rules and the precise behavior that serves them. This part is the authority: implementation, contracts, and tests all answer to it. | Behavior, policy, ownership, or evidence changes. A business requirement needs a stakeholder decision. |
| [Implementation strategy and tooling](#implementation-strategy-and-tooling) | The chosen stack, where code lives, and the environments it runs in. | The stack, the layout, or an environment changes. Record the reason in the log. |
| [Software architecture](#software-architecture) | The components, their responsibilities, and the two contracts between them. | A component is added, removed, or made responsible for something else. |
| [Quality strategy](#quality-strategy) | The one-page map of the quality approach: levels, disciplines, tools, metrics, and how they compose into evidence. Holds no rule of its own. | A level, a discipline, a tool, or a metric is added or removed — update the row, never the rule. |
| [Development strategy](#development-strategy) | How the work is done and judged: test-first discipline, the test levels, the standards and their tooling, what is measured, what each platform addition earns, what is delivered, in what order, and when a requirement is done. | How work is verified, measured, ordered, or judged done changes. |
| [Reusable prompts for adding context](#reusable-prompts-for-adding-context) | The eight fill-in-the-bracket templates. | A recurring kind of request has no template yet. |
| [Context and decisions log](#context-and-decisions-log) | Dated decisions with their reasons and status. | Any decision is taken. Append a row; never edit or delete one. |

**Two worked paths.** The table says where each part is; these say which order to read in, because a precise question is answered at the bottom of a chain rather than in one place.

- *To understand cancellation:* start at [FR-006 and FR-007](#functional-requirements) for the requirement and the business need behind it, read [rules 5, 6, and 11 to 14](#business-rules) for the policy in one line each, then [Cancellation](#cancellation) for the exact cutoff, status codes, and error names — that section wins any disagreement with the two above it. `docs/requirements/FR-006.md` holds the acceptance criteria, and [the traceability view](#the-traceability-view) names the checks that prove them.
- *To judge what the project actually claims:* start at [Product summary](#product-summary) and [MVP boundaries](#mvp-boundaries) for the scope, [Limitations and assumptions](#limitations-and-assumptions) for what is deliberately absent and what breaks if an assumption is false, and [the traceability view](#the-traceability-view) for whether a requirement is verified. Prose in this document is never the evidence; `docs/traceability.md` is.

**Every repository path named here is a destination, not a link.** `docs/requirements/FR-003.md`, `docs/traceability.md`, `contracts/openapi.yaml`, `charts/`, `.claude/skills/` and the rest are artifacts this project creates at the milestone that needs them: [Delivery milestones](#delivery-milestones) says which milestone, and [Suggested repository layout](#suggested-repository-layout) says where each one goes. This document is the plan for them and is written in the present tense throughout, so a path is never a claim that a file exists yet, and never a claim that anything in it is verified.

## Introduction

*What this project is, what it deliberately is not, and the workflow the product delivers.*

### Project purpose

Build a small appointment booking application for one business with one staff member, as a monorepo of two backend services and a React frontend. Use it to practice frontend and backend development, automated testing at multiple levels, requirement traceability, bug tracking, observability asserted by tests, containerised delivery, and isolated test environments.

This is a portfolio project: a deliberately small product carrying deliberately broad verification, aimed at quality-engineering work. The product is the vehicle; the evidence is the point.

The product stays small. The *delivery* around it is deliberately industry-shaped, because that is what the portfolio is for: a monorepo with several deployable pieces, two backend services communicating over an event log, a cache with a correctness rule over it, telemetry that tests assert on, Helm-packaged deployment onto Kubernetes, a full lint and scanning gate, and an AI-assisted workflow whose guardrails are themselves artifacts with their own checks. Every one of those serves a [project objective](#project-objectives), never a business need — none of them puts a feature in front of a customer, and the rule that a project objective may not justify a product feature holds without exception. What a reviewer sees is listed in [Portfolio deliverables](#portfolio-deliverables), the standards it is held to in [Quality standards](#quality-standards), and the one point at which it is finished in [Completion point](#completion-point).

Keep the first version deliberately narrow. Add capabilities only when a later milestone needs them, and keep the distinction sharp: the product's narrowness is a constraint on *behavior*, and the breadth of the platform around it does not license a single extra feature. What each piece of that platform earns, and the order in which it would be trimmed, is stated once in [What each platform addition buys](#what-each-platform-addition-buys).
1
**What this project is not.** It is a practice and portfolio vehicle, not a service for real use. Customer access is a bearer confirmation code and staff access is a shared development token — both deliberate shortcuts, both documented as such. Use fabricated data only: no real customer names, email addresses, or reasons for a visit, in any environment, at any milestone. Nothing here is production-ready, and no deliverable may describe it as production-ready, hardened, or secure — "robust" in this document means [evidenced and deterministic](#quality-standards), nothing more. Everything the project assumes, and everything it deliberately does not do, is indexed in [Limitations and assumptions](#limitations-and-assumptions). Making it fit for real personal data would need real authentication, rate limiting, retention and erasure, and an operational story, every one of which is deliberately out of scope. The telemetry, the dashboards, and the Kubernetes deployment do not change that: they exist to be *asserted on and read by a reviewer*, not to be operated. There is no alerting, nobody is on call, and no number here is a service level. No message is ever sent to a real address; a notification is a stored record and an email stub, and there is no mail transport in any environment.

### Product summary

Customers can see available appointment times, book one, view a confirmation, and cancel before the appointment starts. A staff member can view the schedule for any date range they choose — past dates included, bookings in every status — mark an appointment complete once it has started, and see the notification record written for each change to a booking. "Upcoming" is a frontend label over the default range of today through today plus 6, not a restriction on the endpoint.

#### Users

- **Customer:** books and cancels an appointment.
- **Staff member:** views the schedule for a chosen date range, backwards or forwards, completes appointments that have started, and reviews the notification records produced by booking changes.

#### MVP boundaries

- One business and one staff member.
- One configured time zone, set by `APP_TIME_ZONE`, default `Europe/Berlin`.
- Fixed 30-minute appointments.
- Fixed weekday business hours: 09:00 to 17:00 local time, Monday to Friday.
- Availability covers 7 calendar days starting today, in the configured time zone.
- Holidays and staff time off do not exist in this product. Every weekday in the window is a full business day.
- Seed the schedule; do not build an availability editor.
- No customer accounts, payments, reminders, recurring appointments, multiple services offered to customers, or external integrations.
- A notification record is an audit entry: the appointment change plus the message prepared for that customer, written by `notification-service` from the domain event. **Delivering that message is out of scope.** No mail transport exists in any environment, nothing is ever sent to any address, and "sent" is not a state this product has. [BR-009](#business-requirements) asks for the record, not for the delivery.
- Protect staff endpoints with a simple development credential. Do not build full authentication in the MVP.
- The confirmation code is the customer's only credential. There is no customer login and no recovery flow.

The exact rules behind these boundaries are in [Behavior specification](#behavior-specification). That section, not this list, is what the implementation, the contract, and the tests must agree on.

### Core workflow

1. Customer opens the booking page and views available slots. — FR-001
2. Customer selects a slot and enters a name, email, and optional reason, which are validated against fixed limits. — FR-002
3. The application creates the booking and displays a confirmation code. — FR-003, and FR-004 with FR-005 if the submission is retried
4. Customer retrieves or cancels the booking using that code — the code is the only credential involved. — FR-010, FR-006, FR-007
5. Staff views the schedule for a date range and completes a booking once its start instant has been reached. — FR-008, FR-009
6. Each committed change — created, cancelled, completed — is published as a domain event, and `notification-service` writes exactly one notification record for it. — FR-011, FR-012

The trailing IDs are the only place the product is described as a sequence, and every one of the twelve [functional requirements](#functional-requirements) sits at one of these six steps, so a reader who wants the workflows rather than the requirement set can read this list and follow a single ID down from the step that interests them. The steps carry no rule of their own — step 3 says a booking is created, and what happens when two customers submit for the same slot at the same instant is the requirement's business, not the step's.

## Definitions and conventions

*The terms, the assumptions and limitations, and the document rules that everything after this depends on. Read this before changing anything.*

**Two audiences, and a reader needs three of the five subsections.** [Terminology](#terminology) pins the words the requirements are written in, [Limitations and assumptions](#limitations-and-assumptions) indexes what the project deliberately does not do, and [Operational definitions](#operational-definitions) fixes the five terms without which a non-functional requirement cannot be read honestly. The other two — [One authoritative statement for each thing](#one-authoritative-statement-for-each-thing) and [Acceptance criteria and test case IDs](#acceptance-criteria-and-test-case-ids) — are maintenance conventions for someone changing the document, and a first-time reader loses nothing by going straight to [Requirements](#requirements).

### Terminology

Two terms carry weight everywhere else in this document, so each is stated once here and cited by name afterwards.

**Active booking.** An **active booking** is a booking whose `status` is `booked`. Cancelled and completed bookings are inactive and never block a slot, which is what lets rule 11 free a slot the instant a cancellation commits. A completed booking cannot block a future slot either: completion requires the start instant to have been reached (rule 7), so every completed booking sits at or behind `now`, where rule 1 already refuses new bookings. "At most one active booking" in rule 2 therefore means **at most one row with `status = booked` for a given slot start**, and that is the shape the database constraint takes — uniqueness over the slot start **restricted to** `status = booked`, not over the slot start alone. A plain unique index would wrongly refuse the rebooking of a slot whose earlier booking was cancelled, which rule 11 requires to succeed.

**Notification record.** The audit entry [BR-009](#business-requirements) asks for: one appointment change together with the message prepared for that customer. It is never a delivery — no transport exists, nothing is sent to any address, and "sent" is not a state this product has. The rules are in [Domain events and notification records](#domain-events-and-notification-records).

### Limitations and assumptions

Everything this project takes for granted, and everything it deliberately does not do, collected in one place so a reader does not have to assemble the picture from nine sections.

**This subsection is an index, not a second statement.** Each row points at where the thing is actually stated, and adds only what an index can usefully add: for an assumption, what breaks if it turns out false. If a cell here ever disagrees with the section it links to, the linked section wins and the cell is the defect.

#### Assumptions

| Assumption | Why it is assumed | What breaks if it is false | Stated in |
| --- | --- | --- | --- |
| There is no real stakeholder; the business requirements are plausible needs written by the author as proxy. | Nobody to elicit from. The point is practising work against requirements someone else owns, not pretending someone else owns these. | Nothing technical. A real stakeholder would likely reword BR-009, reject the shared staff token, and ask for delivered notifications — the first conversation would change the requirement set, not the code. | [Business requirements](#business-requirements), `Source` column |
| One business, one staff member, one time zone, fixed weekday hours, 30-minute slots, a 7-day window, no holidays, seeded schedule. | Every one of these would add product scope without adding a new *kind* of verification problem. | Multiple staff or services would change rule 2 from one active booking per slot to one per resource, which is a different constraint and a different index. | [MVP boundaries](#mvp-boundaries) |
| All data is fabricated, in every environment and at every milestone. | A practice project has no business holding real personal data, and no deliverable may imply it does. | The project would need real authentication, retention and erasure, and an operational story — all explicitly out of scope. | [Project purpose](#project-objectives), [Quality standards](#quality-standards) |
| Every clock-dependent rule reads an injected clock, so tests own time. | Boundary rules at `-1s`, `0`, `+1s` cannot be tested deterministically against a system clock. | Determinism goes, and with it [NFR-001](#non-functional-requirements) and every boundary test. This is the assumption the banned-pattern check exists to protect. | Rule 14, [NFR-001](#non-functional-requirements) |
| A confirmation code's own entropy is sufficient protection, with no rate limiting or enumeration defence. | The code is a deliberate shortcut standing in for authentication, and the project says so rather than hardening it. | Codes become guessable at scale. Accepted because there is no real data behind them and no real traffic. | [Confirmation code access](#confirmation-code-access), [NFR-006](#non-functional-requirements) |
| One committer, one laptop class, one modern browser, and network access to the package registry only. | Everything about comparability, free-tier eligibility, and reproducibility rests on this being a solo project. | Baselines retire the moment the machine changes, and several free tiers are priced per committer. The baseline rules already handle the first case by design. | [Operational definitions](#operational-definitions), [NFR-003](#non-functional-requirements) |
| The hosted free tiers used for telemetry, load results, and static analysis stay free and stay available. | They remove real infrastructure from the project at no cost, and each is replaceable. | Telemetry and scan results lose their home. Mitigated by instrumenting with OpenTelemetry rather than a vendor SDK, so the backend can be swapped without touching code — and by self-hosting everything that must be isolated per run. | [Tooling](#tooling) |
| The persistent cluster hosting the shared environment and the reporting portal stays alive and healthy. | It is the only component with a continuous operating cost, and it is what gives teardown and run history somewhere real to live. | The shared-environment tier of the definition of done, [NFR-008](#non-functional-requirements)'s teardown realism, and cross-launch run history all go with it. The order of removal in [What each platform addition buys](#what-each-platform-addition-buys) assumes exactly this risk. | [Test environments and disposable environments](#test-environments-and-disposable-environments) |
| A dead-lettered event is always recoverable by replay. | The producer and consumer contracts are verified on both sides in CI, so a schema-invalid event can only arrive from a bug. | Rule 19's promise stays breached for that booking. The spec treats that as an open defect rather than an accepted outcome, which is the honest handling of an assumption that may fail. | Rules 19 and 20, [NFR-011](#non-functional-requirements) |

#### Limitations

Each of these is a deliberate choice, stated where it belongs and repeated nowhere.

| Limitation | Stated in |
| --- | --- |
| Not production-ready, not hardened, not secure. "Robust" here means evidenced and deterministic, nothing more. | [Project purpose](#project-purpose) |
| No real authentication: a bearer confirmation code for customers, one shared development token for staff. | [MVP boundaries](#mvp-boundaries), [Staff credential](#staff-credential) |
| No message is ever delivered. A notification record is an audit entry plus a prepared message; delivery would be a new business requirement. | [BR-009](#business-requirements), [Domain events and notification records](#domain-events-and-notification-records) |
| Any read can be stale by the time its response arrives — with or without the cache. The cache promises equivalence to a same-instant database read, not freshness on delivery. | [Availability cache](#availability-cache) |
| Notification records are eventually consistent: they appear shortly after a change, never within the request. | [Domain events and notification records](#domain-events-and-notification-records) |
| No performance promise. Numbers are laptop measurements compared only against their own baseline, never service levels, and no absolute latency or throughput target exists. | [NFR-003](#non-functional-requirements), [Performance tests](#performance-tests) |
| No published quality metric is a gate, and no borrowed industry threshold is adopted. | [No metric becomes a target](#no-metric-becomes-a-target) |
| Flakiness is only visible to the extent the four same-commit runs reveal it. A test that fails once in a thousand runs will not be caught. | [Flaky score, without retries](#flaky-score-without-retries) |
| AI output is not guaranteed correct and a review agent does not find every defect. The guardrails are checked; the human gate is what the evidence shows. | [AI-assisted SDLC](#ai-assisted-sdlc), [NFR-012](#non-functional-requirements) |
| The full list of properties this project refuses to promise — uptime, scalability, rate limiting, retention, backup, alerting, a browser matrix, localization, an accessibility audit, ordered delivery across slots, exactly-once broker semantics, a schema registry, a contract broker, a service mesh, autoscaling, multi-region operation, a second CI system, coverage percentages, and DORA figures. | [Non-functional requirements](#non-functional-requirements), the *deliberately not* paragraph |

**Adding to either list.** A new limitation is recorded in the section that owns the behavior, and gets a row here pointing at it. A new assumption gets a row here with its failure consequence, and — if anything in the project would have to change were it false — a decisions-log row saying so. An assumption nobody can name a consequence for is not an assumption worth recording.

### One authoritative statement for each thing

This document is long, so it is worth saying plainly where each kind of statement lives. Each thing is stated **once**; everywhere else cites it.

| Artifact | Holds | Does not hold |
| --- | --- | --- |
| [Behavior specification](#behavior-specification) | The precise, testable statement of every product rule. **Authoritative**: if any other section disagrees with it, this section wins and the other is a defect. | Rationale, evidence, wire shapes. |
| [Business rules](#business-rules) 1–21 | The numbered policy list, each rule stated once and cited by number everywhere else. | The detail behind a rule — that is the behavior specification's. |
| The BR, PO, FR, and NFR tables | Ownership, parentage, minimum verification type, milestone. | The rules themselves. |
| `docs/requirements/FR-0NN.md`, `NFR-0NN.md` | Acceptance criteria and the evidence plan for one requirement. | Rules another requirement owns. |
| `contracts/openapi.yaml` | HTTP wire shapes: paths, bodies, status codes, headers, error schemas. | Precedence, boundaries, or any rule it cannot express. |
| `contracts/events/*.schema.json` | Event wire shapes: the envelope and each event's `data`, one schema per version, with committed samples. | Delivery semantics, de-duplication, or the dead-letter rule — those are [rules 19 to 21](#business-rules) and the [behavior specification](#domain-events-and-notification-records). |
| `.claude/skills/`, `.claude/agents/` | The engineering standards as artifacts a tool loads and a check fails. | Product rules. A skill cites the specification; it never becomes a second copy of it. |
| `docs/traceability.md` | Links to checks and run results, and the BR and PO roll-ups. **Authoritative** for whether a requirement is verified. | Any claim not backed by a link; run history, triage state, or metric series. |
| The portal, the published report, and the metric dashboards | Run history and triage state; one run's readable report; the metric series over time. | Requirement status. A requirement is never done because a launch is green — see [Quality metrics and reporting](#quality-metrics-and-reporting). |
| [Context and decisions log](#context-and-decisions-log) | The date, the reason, and what changed — **why**, never **what**. | A restatement of the rule. Where a log row and the behavior specification conflict, the specification wins and the row is corrected to cite it. |

When a rule changes, exactly one place changes, plus a one-line log row. A rule that has to be edited in three places was duplicated; the fix is to delete the copies, not to keep them in sync.

### Operational definitions

These five terms are used by the [non-functional requirements](#non-functional-requirements), the [test strategy](#test-strategy), and the [quality metrics](#quality-metrics-and-reporting). Each means exactly one thing, and a result that does not meet the definition is not usable as evidence for it.

- **Under load** — 50 concurrent clients issuing one request each, arriving as close to simultaneously as the runner allows, against the backend and a dedicated test database seeded with the standard schedule data, with nothing else running against that database. Not a sustained-throughput test and not a soak test: the point is the simultaneity, not the duration.
- **Comparable runs** — runs sharing all of: the same workload definition (the same scenario at the same parameters, from the same committed script), host class (the same laptop model and power profile, or the same CI runner class), database engine and major version, seeded data volume, concurrency, build mode, and the absence of other deliberate load on the machine. Runs differing in any one of those are **not** comparable: they may not be averaged, compared with each other, or combined into a baseline.
- **Baseline** — the median of three comparable runs, recorded with every field below. Changing the machine, the runner class, the database version, or the seeded volume **invalidates** it: the old baseline is kept, labelled with the environment it described and the date it stopped applying, and a new one is established by three fresh runs in the new environment. There is no conversion factor between environments, and the numeric gate is simply absent until the new baseline exists. **When no comparable baseline is available** — a first measurement, a changed environment, or fewer than three comparable runs — the run is still recorded, as a baseline candidate, and the report states `no gate: baseline not established (n/3 comparable runs)`. That is a normal, passing outcome and never a reason to compare against a number from a different environment or to invent a threshold for the occasion.
- **Reproducible setup** — a checkout with no untracked state, on a machine holding only the prerequisites named in the README, with network access to the package registry and nothing else assumed; one documented command; and a second invocation over the state the first left behind.
- **Recorded environment** — every load or performance result names host class, CPU and memory, operating system, runtime version, database engine and version, seeded data volume, concurrency, repetition count, commit, and date. A result missing any of those is not usable as a baseline.

### Acceptance criteria and test case IDs

The table above gives the minimum verification type, not the evidence plan. Each functional requirement also gets `docs/requirements/FR-0NN.md`, written at the start of the milestone that delivers it, **before any test or production code for that requirement**, and reviewed in that milestone's first commit. Each contains:

1. The statement and why it exists.
2. Numbered acceptance criteria, each an observable outcome, each traceable to one or more business rules 1–21.
3. A verification plan: one row per check, naming the level, the test name, the file, and the test case ID. This is where redundancy gets caught, because a check that restates a lower level's assertion is visible in the same table.
4. Evidence links, filled in as the checks land.
5. Defects, with their regression tests.

Test case IDs name their owning requirement: `TC-FR-<number>-<sequence>`, so FR-004 owns `TC-FR-004-1`, `TC-FR-004-2`, and so on, and `TC-NFR-<number>-<sequence>` for a non-functional requirement. The ID stays with the behavior, not with the layer that happens to verify it. Business requirements own no test cases, because their evidence is their children's.

Example traceability entry:

```text
FR-004: Retrying a booking with the same idempotency key must not create a duplicate.
  -> Serves: BR-004, a customer who retries a timed-out submission ends up with one appointment
  -> API contract: Idempotency-Key header, response, and conflict behavior
  -> Implementation: booking creation and idempotency persistence
  -> FE unit/integration: client reuses the key for the same logical submission
  -> BE unit/integration: same key and payload return the original result
  -> E2E (BDD): e2e/features/idempotent-retry.feature @FR-004, "Retry after a lost response creates one booking"
  -> Acceptance criteria: docs/requirements/FR-004.md
  -> Test cases: TC-FR-004-1 (replay), TC-FR-004-2 (replay after cancellation), TC-FR-004-3 (key expiry)
  -> Defect: link any duplicate-booking bug here
```

Traceability should be maintained from planning to implementation and verification. A requirement is not complete merely because code exists; link it to evidence that verifies its behavior.

## Requirements

*Every requirement, in tiers, with the numbered rules and the precise behavior that serves them. This part is the authority: implementation, contracts, and tests all answer to it.*

Five layers sit inside this part, in the order below. They are not alternatives: each is a different altitude on the same product, and knowing which altitude answers a question is most of finding the answer.

| Layer | The question it answers | Start here if you are |
| --- | --- | --- |
| [Stakeholder requirements](#business-requirements-and-project-objectives) — BR and PO | What does the business need, and what is this project for? No mechanism appears at this altitude. | Asking whether a proposed change has anyone behind it, or what the exercise is meant to teach. |
| [Functional](#functional-requirements) and [non-functional requirements](#non-functional-requirements) — FR and NFR | What does the software do, and what must stay true about it and about the evidence? Each row names its parent, its rules, and its milestone. | Looking for ownership — which requirement a rule, a check, or a defect belongs to. |
| [Business rules](#business-rules) — 1 to 21 | What policy constrains the product, in one numbered line each? | Citing a rule by number, or checking that every rule has a check behind it. |
| [Behavior specification](#behavior-specification) | Exactly what happens, down to the status code and the error name. | Implementing, writing the contract, or writing a test. |
| [The traceability view](#the-traceability-view) | Is it verified — by which check, in which run? | Reviewing, and wanting evidence rather than assurances. |

A question normally travels down that list, and the answer is usually at the bottom.

### How requirements fit together

Every statement about this product is one of five things, and they chain in one direction. **A need** says what the business wants, in its own words, with no mechanism in it. **A requirement** answers one need with one observable behavior the software offers, or one property it must hold while offering that behavior. **A rule** states the policy constraining the behavior, in a single numbered line. **The behavior specification** says exactly what happens — the status code, the error name, the boundary instant. **The traceability view** says which check proved it, in which run. Reading downward turns a want into a testable fact; reading upward asks who wanted this and whether anyone did.

The prefixes are shorthand for those same things and carry no other meaning: `BR` a business need, `PO` a goal of the exercise rather than of the business, `FR` a behavior, `NFR` a property, and a bare number from 1 to 21 a rule. Where prose names an ID it is a reference, not the subject — every sentence here should read without the reader expanding it.

**One requirement, end to end.** The business needs that the same time is never promised to two customers ([BR-002](#business-requirements)) — that is the need, and it names no mechanism. The software answers it with one behavior: a slot has at most one active booking ([FR-003](#functional-requirements)), which is the requirement, and it is the row that carries the evidence. Two numbered rules constrain that behavior — [rule 2](#business-rules), at most one active booking, and [rule 10](#business-rules), concurrent attempts on one slot end in exactly one — and *active booking* itself is pinned in [Terminology](#terminology) so the two rules cannot drift apart. What a losing request actually receives, `409 slot_unavailable` with a `reason` of `already_booked`, is in [Error responses](#error-responses); the same race distinguished from the idempotency race is in [Idempotent booking creation](#idempotent-booking-creation). `docs/requirements/FR-003.md` turns all of that into numbered acceptance criteria with test case IDs, and [the traceability view](#the-traceability-view) links the concurrent-request check and the run that passed it. Five links, and no statement repeated at any of them: that is the pattern every requirement follows.

### Requirements and traceability

Requirements come in four tiers. They differ in who writes them and in what it takes to change one, and keeping them apart is what stops a stakeholder promise, a learning goal, and an implementation choice from being argued at the same altitude.

| Tier | States | Set by | Changes when |
| --- | --- | --- | --- |
| **BR-00N** — business requirement | What the business needs, and why, in stakeholder language. The master tier for the product. | Stakeholders. | The business need itself changes, by stakeholder decision. |
| **PO-00N** — project objective | What this exercise is meant to teach or demonstrate. A delivery constraint on how the work is done, never a need of the appointment business. | The project author, as learner. | The learning goal changes. |
| **FR-0NN** — functional requirement | The behavior the software offers in order to serve a BR. | The software architect and the developers. | A better answer to the same BR is found. |
| **NFR-0NN** — non-functional requirement | The property the system, and the evidence about it, must hold while offering that behavior. | The software architect and the developers. | Same as FR. |

Every tier carries stable IDs. Keep requirements, test plans, and test cases in version control as Markdown or another simple, reviewable format. Link requirements to design notes, source files, acceptance scenarios, automated tests, test cases, defects, and releases as those items are added.

#### Business requirements and project objectives

Two different kinds of thing were previously in one table. **BR-001 to BR-007 and BR-009** are what a one-person appointment business needs. **PO-001 to PO-007** are what this exercise is for: TDD and BDD practice, traceability, environments, measurement discipline, an evidenced AI-assisted workflow, observability as an oracle, and measurement of the verification itself are goals of the *project*, not needs of the *business*, and a reader who met them as business requirements would reasonably conclude the shop owner had asked for a CI pipeline. They keep the same evidence discipline — stable IDs, named children, a roll-up in the traceability view — and differ only in who they belong to.

##### Business requirements

These are the master requirements for the product. They say what the business needs and why, in stakeholder language, and they deliberately contain no mechanism — no endpoint, no status code, no error name, no column.

**Where they come from.** There is no external stakeholder. This is a solo practice project, so the live business requirements — BR-001 to BR-007 and BR-009 — are **assumed business needs**, written by the project author standing in for the owner of a one-person appointment business, and they carry no authority beyond that. They are written as a stakeholder would write them because the point is to practise working against requirements someone else owns — not to pretend someone else owns these. A BR added later that does come from a real person records who supplied it in the `Source` column. The former BR-008, which asked for releasable evidence, was never a business need at all and is now [PO-002](#business-requirements-and-project-objectives); the business wants bookings to work, not a traceability matrix.

The tier still buys one thing: a change rule. A BR changes only as a deliberate decision logged in the [decisions log](#context-and-decisions-log), naming the FRs and NFRs it invalidates — never as a side effect of implementation convenience. Nothing below this tier may quietly redefine one.

The FRs and NFRs that follow are not a restatement of them. They are the architect's and the developers' **answer** to them, and may be split, renumbered, reworded, or deleted whenever a better answer appears, provided the BRs they serve still hold — which is exactly what happened when FR-008 was split and FR-010 added. The division is also this project's scope test, in both directions: a proposed FR or NFR with no parent is scope creep — a BR for behavior, a BR or a [PO](#project-objectives) for a property — and a BR or PO with no FR or NFR beneath it is a promise nobody is building. Both are defects in the requirement set, and both are visible in the [traceability view](#the-traceability-view).

| ID | Business requirement | Why the business wants it | Source | Served by |
| --- | --- | --- | --- | --- |
| BR-001 | A customer can see the business's free times for the coming week and take one themselves, with no phone call and no account. | Self-service is the product's reason to exist, and an account would be a barrier out of all proportion to booking one appointment. | Assumed | FR-001, FR-002 |
| BR-002 | The same time is never promised to two customers. | A double booking is visible to the customer, costs staff time to untangle, and is the failure the business most wants prevented. | Assumed | FR-003, NFR-002 |
| BR-003 | A customer who books receives something that brings them back to their own booking later, and to nobody else's. | Without accounts a booking still has to be findable — and findable only by the person who made it. | Assumed | FR-010, NFR-006 |
| BR-004 | A customer whose submission times out and who tries again ends up with one appointment, not two. | The customer cannot tell a lost response from a lost booking, so trying again has to be safe. | Assumed | FR-004, FR-005, NFR-002, NFR-004 |
| BR-005 | A customer can cancel their own appointment up to its start time, and the freed time becomes available to others at once. | Self-service cancellation beats a no-show, and freeing a time is only worth doing if someone else can still take it. | Assumed | FR-006, FR-007 |
| BR-006 | Staff can see the schedule for a period they choose, and record which appointments actually happened. | The schedule is the staff member's working view, and completion is what makes it a record rather than a plan. | Assumed | FR-008, FR-009 |
| BR-007 | Only the business sees customer details, and the system tells an outsider nothing — not even whether a given booking exists. | The business holds names, emails, and reasons for visits; with no accounts to protect them, disclosing nothing is the cheapest way to keep that promise. | Assumed | NFR-005, NFR-006 |
| BR-009 | Every change to an appointment — booked, cancelled, or completed — leaves exactly one durable record of the change and of the message prepared for that customer, which staff can look up afterwards. | The business needs to answer "what was prepared for this customer, and when?" without reconstructing it from the schedule. A duplicate record makes that trail unreadable and a missing one makes it useless, so exactly one is the requirement. Delivering the message to the customer is deliberately not part of this requirement — see the [MVP boundaries](#mvp-boundaries). | Assumed | FR-011, FR-012, NFR-011 |

**BR-008 is retired and never reused.** The ID belonged to the former business requirement for releasable evidence, which became [PO-002](#project-objectives) because it was never a business need. Reusing the number for the notification requirement would make every earlier decisions-log row that mentions BR-008 ambiguous, so the notification requirement is BR-009 and the gap stays. There are eight live business requirements, numbered 001 to 007 and 009.

Every row says `Assumed`, and a reviewer should read the table as "what a business of this shape plausibly needs" rather than as evidence of requirements elicitation. Every BR and PO names at least one child, and every FR and NFR below names its parent — a BR for product behavior, a PO where the property exists for the exercise; milestone 8 checks both directions. A BR has no acceptance-criteria document and no checks of its own — it is satisfied when every FR and NFR serving it is verified, which is the roll-up the traceability view provides. There is no `docs/requirements/BR-00N.md`.

##### Project objectives

| ID | Project objective | Why it is in this project | Served by |
| --- | --- | --- | --- |
| PO-001 | Practise automated testing at every level, on invariants that genuinely need each level, deterministically and without retries. | The layering and the determinism rules are the skill being practised; a flaky or retried suite would teach the opposite lesson. | NFR-001, and the [test strategy](#test-strategy) as a whole |
| PO-002 | Practise requirement traceability a reviewer can follow from a stakeholder need to a run result without asking a question. | Traceability is the portfolio's central claim and the thing most often asserted rather than shown. | NFR-009 |
| PO-003 | Practise reproducible and disposable environments as a delivery capability, including the failure paths. | Provisioning is easy to demonstrate on the happy path; teardown after a failed or cancelled run is where real pipelines leak. | NFR-007, NFR-008 |
| PO-004 | Practise measurement discipline: correctness under real concurrency, and baselines that never turn into invented service levels. | Measuring honestly, and refusing to dress a laptop number as an SLA, is a judgement worth rehearsing. | NFR-002 (with BR-002 and BR-004), NFR-003 |
| PO-005 | Practise an AI-assisted development workflow whose guardrails are themselves artifacts: the code standard, the TDD cycle, the design patterns, and the review passes encoded as reusable skills and review agents rather than carried as habits. | A habit cannot be reviewed, handed over, or shown to fail. Encoding the standards makes them testable, and testing one's own tooling is the discipline this objective practises. | NFR-012 |
| PO-006 | Practise observability as a test oracle and as traceability evidence, rather than as a dashboard nobody asserts against. | Reading logs to debug is ordinary; asserting that a state change emitted exactly one event, that a cache was invalidated, and that no customer datum reached a span is the quality-engineering skill behind it. | NFR-010 |
| PO-007 | Practise measuring and reporting the quality of the verification itself — per level and overall — including a flaky score derived without retries, and refusing to turn any of those numbers into an invented target. | Measuring the suite is a separate skill from writing it, and it is where borrowed thresholds do the most damage. Deriving flakiness from disagreement across runs at one commit, rather than from reruns, is the version of the skill a project that bans retries has to learn. | NFR-013 |

A PO may be cited by the development approach, the test strategy, and the quality standards as well as by an NFR; what it may never do is justify a product feature. If a proposed behavior serves only a PO, it belongs in the test or tooling layer, not in the application.

#### Functional requirements

The behavior that serves the business requirements above. Each row names its parent BR and the business rules it owns for verification purposes. An FR's parent is always a BR, never a PO: a project objective may shape how the work is verified, but it may not put behavior into the product.

Each FR is **one observable outcome**. If a row needs an "and" to join two outcomes with different failure cases, it is two requirements — which is why FR-008 was split and FR-010 added. The rows are deliberately short: the rules behind them are stated once in [Behavior specification](#behavior-specification), and each FR's acceptance-criteria document links the exact subsection it answers to. So that nobody has to hunt for where a requirement is really stated:

| FR | Its rules are stated in |
| --- | --- |
| FR-001 | [Availability window](#availability-window), [Time handling](#time-handling) |
| FR-002 | [Input validation](#input-validation); [Error responses](#error-responses) precedence steps 2, 4, 5 |
| FR-003 | Rules 2 and 10, with the constraint shape under [Business rules](#business-rules) |
| FR-004 | [Idempotent booking creation](#idempotent-booking-creation) — canonical form, replay, claim lease, expiry |
| FR-005 | [Idempotent booking creation](#idempotent-booking-creation) — fingerprint mismatch and rule 18 |
| FR-006 | [Cancellation](#cancellation) |
| FR-007 | [Cancellation](#cancellation) — the cutoff boundary |
| FR-008 | [Completion](#completion) — the staff schedule parameters and their bounds |
| FR-009 | [Completion](#completion) — eligibility and the three rejection reasons |
| FR-010 | [Confirmation code access](#confirmation-code-access) |
| FR-011 | [Domain events and notification records](#domain-events-and-notification-records) — the outbox, dedup, replay, and dead-letter path |
| FR-012 | [Domain events and notification records](#domain-events-and-notification-records) — the staff notification view and its range bounds |

Read by who is served, rather than by number: **a customer** gets FR-001, FR-002, FR-006, FR-007, and FR-010 — view the week, book a slot, cancel, and look a booking up again. **Staff** get FR-008, FR-009, and FR-012 — the schedule, completion, and the record of what was prepared for each customer. The remaining four are invariants nobody asks for by name and everybody notices when they fail: FR-003 (one booking per slot), FR-004 and FR-005 (a retry is safe), and FR-011 (exactly one durable record per change). For the same twelve read as sequences rather than as actors, [Core workflow](#core-workflow) places each one at the step it serves.

| ID | Serves | Functional requirement | Business rules | Minimum verification | Milestone |
| --- | --- | --- | --- | --- | --- |
| FR-001 | BR-001 | Customers can view bookable slots for the 7-day window. | 1, 3, 14, 21 | API and UI tests cover future, booked, weekend, and out-of-window slots, and the exact-now boundary. | 1 |
| FR-002 | BR-001 | A customer can book a slot with valid required details. | 1, 2, 3, 4 | Validation tests at the stated limits, and a successful booking E2E test. | 2 |
| FR-003 | BR-002 | A slot cannot have more than one active booking. | 2, 10 | Backend integration and concurrent-request test asserting exactly one active record. | 3 |
| FR-004 | BR-004 | A booking retry with the same idempotency key and payload creates one booking. | 8, 16, 18 | Duplicate-request test verifies one database record and a replay of the stored status and body. | 3 |
| FR-005 | BR-004 | Reusing an idempotency key with a different payload returns a conflict. | 9, 18 | Contract and backend integration tests, including the normalized-payload cases that must *not* conflict. | 3 |
| FR-006 | BR-005 | A customer can cancel before the appointment starts. | 5, 11, 12, 13, 14 | API and UI tests verify cancellation and that the slot is offered again. | 4 |
| FR-007 | BR-005 | A customer cannot cancel at or after the appointment starts. | 6, 14 | Boundary tests at `slotStart - 1s`, `slotStart`, and `slotStart + 1s`. | 4 |
| FR-008 | BR-006 | Staff can view the schedule for a requested date range. | 15 | Authorization tests, range and default-window tests, and an E2E test. | 4 |
| FR-009 | BR-006 | Staff can complete a booking that has started. | 7, 13, 14, 15 | Authorization, state-transition, and the three rejection reasons; E2E test. | 4 |
| FR-010 | BR-003 | A customer can retrieve a booking with its confirmation code. | 12, 17 | Lookup test, identical-not-found-response test, and `cancellable` reflecting the cutoff. | 2 |
| FR-011 | BR-009 | Each committed booking state change leaves exactly one durable record of the change and its prepared message. | 19, 20 | Producer and consumer integration tests over the outbox, a redelivery, an idempotent replay emitting nothing, and the dead-letter path. | 4 |
| FR-012 | BR-009 | Staff can look up the records of appointment changes for a requested date range. | 15 | Authorization, range-bound, and default-window tests against `notification-service`, plus an E2E assertion. | 4 |

Every business rule 1–21 appears in at least one row above, so the column doubles as the rule-coverage check that milestone 8 verifies. A rule in several rows is owned by each of them; rule 3, for instance, constrains both viewing and booking, and rule 15 is owned by every staff-credentialed requirement. Rule ownership stays in this table: a BR is too coarse to pin a rule to a check, and an NFR owns no rules at all.

This set has been renumbered once, which is the tier working as intended rather than a defect in it; the reason sits in the [decisions log](#context-and-decisions-log) and is not repeated here.

#### Non-functional requirements

The table above says what the product must do. These say what must stay true *about* the system and about the evidence — mostly the properties milestones 5 to 8 exist to establish, though four of them come due earlier, with the behavior they constrain. They carry stable IDs for the same reason requirements do: so a traceability row can link each one to a named check and a dated run instead of asserting it in prose.

Three conventions keep them from colliding with the functional set, which they sit beside rather than beneath — each answers upward, not to the other: an FR always to a BR, an NFR to a BR when it constrains the product and to a [PO](#project-objectives) when the property exists for the exercise:

- **An NFR owns no business rule.** Rules 1–21 stay owned by FR-001 to FR-012, so the `Business rules` column remains the single rule-coverage check that milestone 8 reads. An NFR names the requirements it *stresses* instead: NFR-002 stressing FR-003 does not make it a second owner of rule 10.
- **An NFR is scheduled, not outstanding.** Before the milestone that delivers it, its traceability row reads **not yet due** — the same tiering the [definition of done](#definition-of-done) already applies to environment evidence. From that milestone onward it is due at every later one, and a regression in it blocks the current milestone's exit exactly as a quarantined test does.
- **Several are gates rather than behavior.** NFR-001, NFR-003, NFR-005, and NFR-009 can fail a build without a line of product code being wrong. That is the point of them: they are what keeps the rest of the evidence worth reading.

Acceptance criteria live in `docs/requirements/NFR-0NN.md`, written at the start of the delivering milestone on the same schedule as a functional requirement's. Test case IDs are `TC-NFR-<number>-<sequence>` — `TC-NFR-003-2` — deliberately distinct from `TC-FR-003-2`, which belongs to FR-003.

| ID | Serves | Non-functional requirement | Quality attribute | Stresses | Milestone |
| --- | --- | --- | --- | --- | --- |
| NFR-001 | PO-001 | The full suite returns the same verdict for the same inputs, with no retries anywhere and no quarantined tests. | Repeatability | All | 5 |
| NFR-002 | BR-002, BR-004, PO-004 | The booking invariants hold under real concurrency, not only under a harness that interleaves calls. | Correctness under load | FR-001, FR-003, FR-004, FR-011 | 7 |
| NFR-003 | PO-004 | Performance is measured, recorded with the conditions that produced it, and compared only against its own baseline. | Performance, honesty of claims | FR-001, FR-002, FR-004, FR-008, FR-011 | 7 |
| NFR-004 | BR-004 | Request handling, claim leases, and query ranges are bounded, and the lease outlives the request timeout. | Resource safety | FR-004, FR-008 | 3 |
| NFR-005 | BR-007 | The staff credential exists only as an injected environment value and never reaches the repository, a log, a response, or a report. | Secret handling | FR-008, FR-009 | 4 |
| NFR-006 | BR-003, BR-007 | Nothing beyond the confirmation code's own entropy distinguishes a code that identifies a booking from one that does not. | Non-disclosure | FR-006, FR-010 | 2 |
| NFR-007 | PO-003 | A clean checkout reaches a full green suite with one documented command. | Reproducible setup | All | 5 |
| NFR-008 | PO-003 | Every disposable environment is isolated, free of production data, and torn down whatever the run's outcome. | Operability | All | 6 |
| NFR-009 | PO-002 | Every requirement and every due NFR links to a named check and a dated run, and nothing is claimed beyond that. | Auditability | All | 8 |
| NFR-010 | PO-006, BR-007 | One booking is one trace from the browser to the notification record, and no secret, confirmation code, or customer datum appears anywhere in telemetry. | Observability, non-disclosure | All | 1 |
| NFR-011 | BR-009, BR-004 | Every committed state change is delivered at least once and takes effect exactly once, with failures bounded and visible rather than dropped. | Delivery correctness | FR-004, FR-011 | 4 |
| NFR-012 | PO-005 | The engineering standards exist as executable artifacts whose own checks run in CI, not as prose nobody can fail. | Enforceability of standards | All | 0 |
| NFR-013 | PO-007 | Every run publishes its results and its quality metrics, the flaky score is derived from the same-commit run protocol rather than from retries, and no published metric is a gate. | Measurability, honesty of claims | All | 5 |

Where each NFR's rules are stated, so a reader coming from the table lands in the right place:

| NFR | Its rules are stated in |
| --- | --- |
| NFR-001 | This section, with the policy in [Quality standards](#quality-standards) |
| NFR-002 | This section's pass-condition table, over rules 2, 10, and 18 |
| NFR-003 | This section, with the measurements in [Performance tests](#performance-tests) |
| NFR-004 | [Idempotent booking creation](#idempotent-booking-creation) for the lease, [Completion](#completion) for the staff span |
| NFR-005 | [Staff credential](#staff-credential) |
| NFR-006 | [Confirmation code access](#confirmation-code-access), over rules 12 and 17 |
| NFR-007 | This section's checklist, with the command named in `README.md` |
| NFR-008 | This section's checklist, with the lifecycle in [Test environments](#test-environments-and-disposable-environments) |
| NFR-009 | [The traceability view](#the-traceability-view) |
| NFR-010 | [Telemetry](#telemetry), with the non-disclosure scope in [Confirmation code access](#confirmation-code-access) and [Staff credential](#staff-credential) |
| NFR-011 | [Domain events and notification records](#domain-events-and-notification-records), over rules 19 and 20 |
| NFR-012 | This section's checklist, with the artifacts listed in [Engineering standards as artifacts](#engineering-standards-as-artifacts) |
| NFR-013 | [Quality metrics and reporting](#quality-metrics-and-reporting), with the determinism protocol in NFR-001 |

Where an NFR constrains product behavior — NFR-004 and NFR-006 — the behavior section is authoritative for *what the product does* and this section for *the property that must hold*. The two never restate each other.

**NFR-001 — Deterministic verification.** Fixed seed data; the injected clock wherever rule 14 requires one; no date derived from the system clock at run time; no sleep used as synchronisation; no order dependence or shared mutable state between tests; no automatic retry in CI or in any runner. Evidence: three consecutive full-suite runs green with no retries and zero quarantined tests, one further run with the test order shuffled under a **recorded seed** — a shuffle is not a breach of determinism, because the seed is printed and the order replays — and a CI check that fails the build on a banned pattern: an inline system-clock read in production code, a sleep in test code, or a retry setting in a runner configuration. This does not promise that a test never fails; it promises that a failure reproduces.

**NFR-002 — Concurrency correctness under load.** With **50 concurrent requests for one slot**: exactly one `201`, `409 slot_unavailable` for the other 49, and exactly one active booking row afterwards. With **50 concurrent requests sharing one key and one payload**: exactly one booking row, and every other response either a replay of the stored result or `409 idempotency_request_in_progress` — never a second `201`, and never `slot_unavailable`, which would mean a retry had collided with its own booking and step 3 of the [error precedence](#error-responses) had been lost. Neither run may produce a `500` or any code outside the [error table](#error-responses). Evidence: the two load scenarios, asserting database state after the run rather than only the mix of responses. This is a pass/fail gate with no metric attached. The milestone 3 integration tests are not replaced by it: they pin the same invariants deterministically, which a load run cannot.

The workload parameter is not the pass condition, so the pass condition is written out. Both runs are judged on the response set **and** on the database after the run, and every line below is an assertion:

| Checked after the run | Same-slot run: 50 clients, 50 distinct keys, one `slotStart` | Same-key run: 50 clients, one key, one identical payload |
| --- | --- | --- |
| Successful responses | Exactly one `201`. | Exactly one `201` **without** `Idempotent-Replay`. |
| Other responses | Exactly 49 × `409 slot_unavailable`, each with `reason: already_booked`. | Each of the other 49 falls into one of exactly two permitted categories: a replay — the stored status and a byte-identical body with `Idempotent-Replay: true` — or `409 idempotency_request_in_progress`. **No distribution is required and none is asserted.** The run records the observed split as information. |
| Responses that fail the run | Any `500`, any code outside the [error table](#error-responses), a second `201`, or any `slot_not_found`. | Any `500`, any `slot_unavailable` (step 3 of the precedence was lost), any `idempotency_key_reuse` (the payloads were identical), or a second non-replay `201`. |
| `bookings` rows for that slot | Exactly one, `status = booked`. One row created by the whole run. | Exactly one, `status = booked`. |
| Idempotency records | Exactly one, bound to the winner's key and fingerprint. The 49 losing keys are **unbound**: replaying one is a fresh attempt that answers `slot_unavailable`, not a replay. | Exactly one, for that key, holding one stored status, body, and `Content-Type` — identical to what the `201` returned. A request issued with the key after the run replays that same body. |
| Claims | No live claim remains: the winner's was converted, the losers' released. | No live claim remains. |

A run that produced no `201` at all is a failure, not a tie: one caller must win. The assertions are made by querying the database directly after the run, not by inferring state from the responses — inferring is exactly the mistake the run exists to catch.

**Why the two runs differ in how much of the response mix is pinned.** In the same-slot run every count is deterministic: the 50 keys are distinct, so no request ever contends for a key, and each of the 49 losers must lose the slot however the arrivals interleave. In the same-key run the mix genuinely depends on when each client arrives relative to the winner's commit — before it and the answer is `idempotency_request_in_progress`, after it and the answer is a replay — so a required split would be an assertion about the load generator's scheduling rather than about the product. What stays exact there is one count and a closed set:

- **Exactly one non-replay `201`**, which is exact regardless of timing: only the holder of the key's current claim may bind it (rule 18), and the 60-second lease cannot expire inside a run lasting seconds, so no takeover and no second commit is possible.
- **Every other response is in one of the two permitted categories**, and any category outside that set fails the run. An all-replay run and an all-`in_progress` run are both passes; the split is reported, never gated.
- **The invariants, asserted in the database after the run:** one booking row for the slot with `status = booked`; one idempotency record for the key, holding the status, body, and `Content-Type` the `201` returned; no `slot_unavailable` and no `idempotency_key_reuse` anywhere in the responses; no `500`; and no live claim left behind.

Two ways of forcing a deterministic mix were considered and rejected. A barrier that releases all 50 clients at a fixed point relative to the commit would be measuring the harness's timing control, and holding each request behind the live claim would change the product's documented behavior ([`idempotency_request_in_progress`](#idempotent-booking-creation) exists precisely so requests are not held). Both orderings are already pinned deterministically by the milestone 3 integration tests, which drive the claim and the commit in a chosen order; the load run's job is to show the invariants survive real concurrency, not to re-derive those orderings.

**NFR-003 — Measured performance, bounded claims.** The six measurements in [Performance tests](#performance-tests), each recorded under `docs/performance/` with environment, data volume, concurrency, p50, p95, run date, and commit. A numeric gate exists only once three comparable runs establish a baseline, and then compares p95 against that baseline's median: above 25% is reported and not blocking, above 50% fails. Those thresholds are project conventions sized for a laptop and a shared CI runner — loose enough to survive that noise — and every published number says so. This does not promise an absolute latency, a throughput figure, capacity, or uptime, and no number here is a service-level objective.

**NFR-004 — Bounded request handling.** A 15-second server request timeout; a 60-second idempotency claim lease; the invariant `lease > timeout` asserted by a unit test that reads both values from configuration rather than restating the literals; `GET /api/slots` bounded by the 7-day window and `GET /api/staff/bookings` by its 31-day maximum span, each already a validation error beyond range. Evidence: the lease-ordering unit test, the claim-fencing tests from milestone 3, and range tests at each span boundary. The lease and timeout bounds are due with the NFR at milestone 3; the staff 31-day span arrives with the staff endpoint in milestone 4, tested at 31 and 32 days. The configuration names for the timeout and the lease are fixed when the stack is chosen and recorded in the decisions log. This does not promise load shedding, pool sizing, or a memory ceiling.

**NFR-005 — Secret handling.** `STAFF_API_TOKEN` is the only source of the credential in every environment, local included; `.env.example` is committed with a placeholder and `.env` is git-ignored; the value never appears in a commit, a log line, an error body, a failure diff, a CI log, or a published report. Evidence: a test asserting that a rejected staff request's response body and emitted log lines contain no part of the token; a secret scan in CI over the working tree **and** over the published report artifacts; a test asserting `.env` is ignored. This does not promise authentication — the credential is a development stand-in, and the README lists it as one.

**NFR-006 — Non-disclosure through the confirmation code.** An unknown code, a malformed code, and a wrong-length code return the same status, the same body, and the same headers apart from `Date` and content length; no customer response or error carries the internal booking `id`; a code is never written to a log line or a test report; codes come from a CSPRNG and carry the database uniqueness constraint of rule 17. Evidence: the identical-response test across the three not-found classes, a contract test asserting `id` is absent from every customer schema, and a log assertion on lookup and cancellation. This does not promise constant-time comparison, rate limiting, enumeration defense beyond the code's ~50 bits, or any protection once a customer forwards their own code — all already recorded as limitations in [Confirmation code access](#confirmation-code-access).

**NFR-007 — Reproducible setup.** One documented command, run from a clean checkout on a machine holding only the documented prerequisites, installs, migrates, seeds, and runs every level; running it again over a dirty database resets rather than failing; the command in the README and the command in CI are the same string. Evidence is this checklist, and nothing beyond it:

1. A CI job on a fresh runner executes the README command verbatim — copied from the README by the job, not retyped — and exits zero.
2. The same job's log shows no manual step, no environment variable set outside `.env.example` plus injected secrets, and no prerequisite installed that the README does not name.
3. A second job runs the command twice in a row in one workspace; the second run exits zero and reports the same test totals.
4. The README's prerequisite list is the one the fresh runner satisfies: if the job needs something the README omits, the README is wrong, not the job. This does not promise support for platforms beyond the ones named once the stack is chosen.

**NFR-008 — Environment isolation and guaranteed teardown.** Each run provisions its own application instance and database; no production data or credential is reachable from the pipeline; teardown runs on a passing run, a failing run, and a cancelled run; a repeat run on the same branch is safe; a scheduled sweep deletes any environment older than 24 hours, so a teardown that was itself killed cannot leak one. Evidence is this checklist, and nothing beyond it:

1. Three proof runs — one passing, one deliberately failing, one cancelled mid-suite — each with its teardown log attached.
2. After each, the same four checks: the application instance is gone, its database is gone, the provisioning store lists no record for that run, and the names it held are free for reuse.
3. A repeat run on the same branch provisions cleanly, which is what proves the previous teardown left nothing behind.
4. One sweep run, with its report attached, listing what it found — including the expected "nothing to delete" — so the sweep itself is evidenced rather than assumed.
5. A pipeline-level assertion that no production hostname, dataset, or credential is reachable from the job, kept to the one check that would notice a mistake rather than a catalogue.

Steps 2 and 4 are the whole point: a teardown that reports success without being checked, and a sweep nobody ever sees run, are the two ways this NFR quietly becomes untrue. This does not promise quotas, cost tracking, or a parallel-run limit.

**NFR-009 — Evidence completeness.** Every row of `docs/traceability.md` carries an acceptance-criteria link, implementation links, at least one named check with its TC ID, and a dated CI run with its outcome; every business rule 1–21 stands against at least one check; every defect links to the regression test written before its fix; a quarantined check marks its requirement unverified; the README names what is not verified. Evidence: a traceability check that runs in CI and fails on a row missing a link or a run result, and milestone 8's exit criteria. This does not promise a coverage percentage — see [Quality standards](#quality-standards).

**NFR-010 — Traceable telemetry, disclosing nothing.** The rules are in [Telemetry](#telemetry). One booking produces one trace spanning the frontend, `booking-service`, the event, and `notification-service`; each state change emits exactly one producer span event and one consumer span event; the required metrics exist and are named; and no confirmation code, staff token, customer name, email address, or reason for a visit appears in any log line, span name, span attribute, metric label, or exception message. Evidence: an in-memory-exporter test asserting one span event per committed change and none per replay; a propagation test asserting the consumer's span shares the request's trace id; a telemetry redaction test that plants a booking containing a code, a token, and fabricated personal data and asserts none of it appears in exported spans, metrics, or log records; and, from milestone 5, a shared-environment trace link recorded against the E2E run. This does not promise an uptime dashboard, alerting, an on-call rotation, log retention beyond the hosted free tier, or any SLO.

**NFR-011 — Delivery correctness.** The rules are in [Domain events and notification records](#domain-events-and-notification-records). The outbox row and the booking row commit together or not at all; a published event is delivered at least once; the consumer writes at most one notification record per `eventId`; a replay commits nothing and publishes nothing; a message still failing after the attempt limit reaches the dead-letter topic with its payload and reason; consumer lag returns to zero after a run. Evidence: a transactional test asserting a rolled-back booking leaves no outbox row and a committed one leaves exactly one; a redelivery test asserting the second delivery of one `eventId` writes no second record; a replay test asserting zero events published; a poison-message test asserting exactly one dead-letter record and no notification record; a replay test asserting that a dead-lettered event replayed once, and again, yields exactly one notification record; and a crash-after-acknowledgement test asserting republication is de-duplicated rather than doubled. This does not promise ordered delivery across slots, exactly-once broker semantics, transactional messaging across services, or a schema registry.

**NFR-012 — Standards as executable artifacts.** The artifacts are listed in [Engineering standards as artifacts](#engineering-standards-as-artifacts). Every skill and every review agent listed there exists as a repository artifact; each skill carries an eval suite that runs in CI; formatting, linting, static analysis, contract linting, chart linting, dependency scanning, secret scanning, and image scanning all run on every pull request and fail it; and the AI workflow is documented with what AI may draft and what it may never decide. Evidence: this checklist, and nothing beyond it:

1. Every skill's eval suite runs in CI and is green, and one eval is proven to fail when the skill is removed — a suite that passes without its skill is measuring nothing.
2. Every review agent runs on a pull request and its findings are recorded in that pull request, including the run where it found nothing.
3. The lint and scanning gate fails a pull request containing a planted violation of each kind: a formatting breach, a static-analysis finding above the configured severity, a contract-lint error, a chart-lint error, a committed secret, and a vulnerable dependency.
4. `docs/ai-sdlc.md` names, for every generated artifact class, the prompt used, the human who reviewed it, and the decisions AI is never permitted to make — the behavior specification, the business rules, and the requirement tiers among them.

This does not promise that AI output is correct, that a review agent finds every defect, or that any generated artifact may be merged unreviewed. It promises the opposite: the guardrails are checked, and the human gate is recorded.

**NFR-013 — Published metrics, no invented targets.** The catalogue, the definitions, and the authority split are in [Quality metrics and reporting](#quality-metrics-and-reporting). Every CI run publishes a normalised result set from every level, an Allure report readable without an account, and its metric series; the flaky score is computed from the four same-commit runs NFR-001 already requires, never from a retry; `docs/traceability.md` stays the only authoritative statement of requirement status. Evidence: a run whose published report, portal launch, and metric series all exist and agree on what happened; a flaky score published with its commit and shuffle seed, proven to detect a deliberately planted non-deterministic test and to read zero otherwise; an escaped-defect record naming the level that should have caught it and the check added there; and a check that fails the build if a metric is wired as a gate without a decisions-log row permitting it. This does not promise a target for any metric, a trend in any direction, a coverage percentage, or deployment-frequency and change-failure figures — there is no production to deploy to, so the DORA framing is not borrowed here.

**What each NFR is for, and the least that counts as evidence.** Several of these verify the delivery process rather than the product. That is deliberate — the process is part of what this portfolio demonstrates — but it also means each one needs a floor, so that "done" is reachable rather than aspirational. The floor below is the minimum; exceeding it is optional and never required to exit a milestone. Every floor names a **run, a report, or an assertion** — never the existence of a file. A floor that could be satisfied by a committed script nobody executed would demonstrate the opposite of its objective, so "the provisioning scripts exist" is not evidence for PO-003 and "a seeded setup command ran on a fresh runner and recorded its result" is.

| NFR | Why it is in this project | Smallest evidence that counts |
| --- | --- | --- |
| NFR-001 | Practising the discipline that makes every other result believable. | Three consecutive green full-suite runs in CI, one shuffled-order run with its seed in the log, and the banned-pattern check failing on a planted violation. |
| NFR-002 | Learning that a harness-level race test and a real one are different claims. | One run per race at 50 clients against the test database, each asserting the row count and the response mix, published as a saved report. |
| NFR-003 | Practising measurement discipline, not performance tuning. | One baseline file per measurement, three comparable runs each, committed. No tuning work is implied or required. |
| NFR-004 | Making the timeout-versus-lease relationship a checked fact rather than a comment. | The lease-ordering unit test and the two range-limit tests. |
| NFR-005 | Handling a credential correctly once, in the production code path. | The no-token-in-body-or-logs test, a secret scan over tree and reports, and `.env` asserted ignored. |
| NFR-006 | Practising non-disclosure on a deliberately weak access model. | The identical-response test over the three not-found classes, the absent-`id` contract test, and the no-code-in-logs assertion. |
| NFR-007 | Proving the project is runnable by someone who is not its author. | One CI job that runs the README command on a fresh runner, and one that runs it twice. |
| NFR-008 | Learning environment lifecycle, including the failure paths people skip. | The pass, fail, and cancelled teardown runs, plus one sweep run with its report. |
| NFR-009 | The portfolio's central claim: every statement traceable to a run. | The traceability check green in CI, and proven to fail on a planted row with no run link. |
| NFR-010 | Learning that telemetry is an oracle, not a dashboard. | The one-span-event-per-change test, the trace-propagation test, and the redaction test over planted sensitive values. |
| NFR-011 | Learning that at-least-once delivery is a correctness problem the consumer solves. | The redelivery, replay-publishes-nothing, and poison-message-to-dead-letter tests, plus the dead-letter replay test showing recovery yields exactly one record. |
| NFR-012 | Practising guardrails that can themselves fail, rather than standards carried as habits. | Every skill's eval suite green in CI with one proven to fail without its skill, and the lint/scan gate failing on a planted violation of each kind. |
| NFR-013 | Practising measurement of the suite itself, and the refusal to borrow a threshold. | One run publishing its report, its portal launch, and its metric series; one flaky score published with commit and seed, proven to catch a planted non-deterministic test. |

**The five terms these requirements depend on** — `under load`, `comparable runs`, `baseline`, `reproducible setup`, and `recorded environment` — are defined once in [Operational definitions](#operational-definitions), because the test strategy depends on them too.

**Deliberately not non-functional requirements here.** Each of the following would be a target invented for a document rather than a property this project can produce evidence for, so none of them appears above: availability or uptime, horizontal scalability and capacity planning, rate limiting and abuse protection, real authentication or authorization roles, data retention, export and erasure workflows, backup and restore, alerting, an on-call rotation or any service-level objective over the telemetry that milestone 1 introduces, a browser and device matrix beyond one modern browser, localization beyond the single configured time zone, and an accessibility audit — the frontend checks assert that loading, empty, and error states render as text, which is a usability check and not an accessibility claim. Also excluded: a target or threshold on any published quality metric, a coverage percentage, deployment-frequency and change-failure-rate figures (there is no production to deploy to, so the DORA framing is not borrowed), and a commercial test-management tool — case IDs and requirement status stay in version control. Also excluded, now that the architecture has grown: real email or any outbound message transport, ordered delivery across slots, exactly-once broker semantics, a schema registry, consumer-driven contract testing with a broker, a service mesh, autoscaling, multi-region or multi-tenant operation, and a second CI system. If one of these becomes worth demonstrating, it arrives as a new NFR with its own evidence plan and milestone, recorded in the decisions log.

**A note on what observability did and did not change.** Telemetry was previously listed here as deliberately out of scope. It is now [NFR-010](#non-functional-requirements), because tests assert on it — which is a verification capability, not an operational one. Everything operational about it stays excluded: there is no alerting, no on-call expectation, no retention promise, and no availability target. A dashboard in this project is evidence for a reviewer to read, never a system anyone is paged by.

### Business rules

**The term *active booking* is defined once in [Terminology](#terminology)**, and rules 2 and 11 both depend on it.

1. Only slots that start strictly in the future, fall inside configured business hours, and fall inside the 7-day availability window can be booked.
2. A slot can have at most one active booking.
3. The backend is authoritative for availability. The frontend must handle a slot becoming unavailable between display and submission.
4. A booking requires a name and email that pass the rules in [Input validation](#input-validation). The optional reason is capped at 500 characters.
5. A customer can cancel while the current time is strictly before the appointment start time.
6. A customer cannot cancel at or after the appointment start time.
7. Only a booking with status `booked` whose start instant has been reached can be completed — at exactly the start instant, completion is already allowed. A cancelled booking, an already completed booking, and a booking whose start instant is still in the future cannot be completed.
8. Retrying booking creation with the same idempotency key and same payload returns the original booking result and creates no duplicate.
9. Reusing an idempotency key with a different payload returns a documented conflict response.
10. Concurrent requests attempting to book the same slot result in exactly one active booking.
11. Cancelling a booking whose start instant is still in the future makes its slot available again immediately. Availability is a property of booking state; whether `GET /api/slots` lists that slot depends only on the window (rule 1).
12. Possession of the confirmation code authorizes retrieving and cancelling that one booking, and nothing else. Codes that identify no booking — unknown, malformed, or the wrong length — are indistinguishable from one another in the response, and no error reveals whether a given code exists.
13. Booking status is one of `booked`, `cancelled`, `completed`. The only allowed transitions are `booked` to `cancelled` and `booked` to `completed`.
14. Every clock-dependent rule — 1, 5, 6, 7, 11, 16, and the release of an abandoned idempotency claim — is evaluated against an injected clock, never a system clock read inline.
15. Staff endpoints require the development credential. A missing or wrong credential is rejected without revealing whether the referenced booking exists.
16. An idempotency record is valid for replay while `now` is before `createdAt + 24h`. At that instant and after it, the key counts as unused.
17. A confirmation code is unique across all bookings, enforced at the database level.
18. Only a committed booking binds an idempotency key to its payload, and only the holder of the key's current claim may bind it. A request that fails validation, loses a conflict, or has lost its claim neither binds the key nor alters an existing binding: an unbound key stays unbound, and a key already bound to its original payload keeps that binding and its stored response untouched.
19. Every committed booking state change — creation, cancellation, completion — produces exactly one notification record for that booking, and nothing else produces one. A notification record is the audit entry for that change together with the message prepared for the customer; it is never a delivery, no transport exists, and no message is ever sent to any address. The record appears shortly after the change rather than inside the request, so the promise is **outstanding** until it exists and **breached** while a dead-lettered event (rule 20) is unrecovered — never waived.
20. A booking state change and its outbox event row commit in the **same database transaction**; a **separate relay** then publishes outbox rows to the event topic and marks them published once the broker acknowledges. Delivery is therefore at least once, and the consumer de-duplicates on event id, so a redelivery creates no second notification record. A message still unprocessable after the configured attempt limit moves to the dead-letter topic with its payload and failure reason, where it is retained for replay and never silently dropped; a replay re-enters the consumer and is safe because of that same de-duplication. An idempotent replay (rule 8) commits nothing, writes no outbox row, and therefore publishes nothing.
21. The availability cache is never authoritative, and a stale entry is never served. Each cached entry records the **availability version** it was computed at; the database holds that version per date as a monotonic counter, bumped inside the transaction that changes booking state, and an entry is served only while its recorded version still matches the authoritative one. A cached read therefore answers **exactly what a direct database read at the same instant would have answered** — the cache adds no staleness of its own — and a failed cache write costs a recomputation rather than correctness. Rule 3 holds over the cache exactly as it holds over the database.

**Where these come from.** Rules 1, 2, 4, 5, 6, 7, 11, 12, 15, and 19 are stakeholder policy — what [BR-001 to BR-009](#business-requirements) mean, stated precisely enough to test — so changing one is a stakeholder decision rather than a design choice. Rules 3, 8, 9, 10, 13, 14, 16, 17, 18, 20, and 21 are architect-authored invariants that exist so the first group still holds under concurrency, retries, crashes, and clock boundaries: no stakeholder would ask for a fenced lease, a payload fingerprint, a transactional outbox, or a cache invalidation rule, but BR-004 certainly asks that a retry not produce two appointments and BR-009 asks for exactly one record per change rather than two. Both kinds are owned for verification by a [functional requirement](#functional-requirements), which is what that table's `Business rules` column records.

### Behavior specification

These rules exist so the frontend, backend, contract, and tests cannot drift into different readings of the same sentence. Each is stated as an observable outcome. Arbitrary values are recorded once in the [Context and decisions log](#context-and-decisions-log) and changed there, in one place.

#### Availability window

- The window is **7 calendar days in the configured time zone, including today**: today's date through today plus 6 days.
- A slot is offered only when all of these hold: its start is strictly after the current time; its local date is inside the window; its local date is Monday to Friday; it starts at or after 09:00 and ends at or before 17:00 local time; it has no active booking.
- A slot starting at exactly the current time is **not** offered and cannot be booked. The comparison is `slotStart > now`, never `>=`.
- Slot starts fall on the half hour, 09:00 through 16:30, so a weekday has 16 slots.

`GET /api/slots` parameters:

| Parameter | Rules |
| --- | --- |
| `from` | Optional local date, `YYYY-MM-DD`. Defaults to today in the configured time zone. |
| `to` | Optional local date, `YYYY-MM-DD`, inclusive. Defaults to `from` plus 6 days. |

- `to` earlier than `from` is a validation error.
- A `from` before today, or a `to` after today plus 6 days, is a validation error rather than a silently clamped range. Clamping hides caller mistakes and weakens the assertion a test can make.
- The maximum span is the 7 days the window bounds already imply.
- A valid window with no bookable slots — a weekend, or today after 16:30 — returns `200` with an empty list, not `404`.
- A generated slot start that this window does not offer is still a real slot. Booking one is `409 slot_unavailable` with a `reason` detail of `not_in_future`, `outside_window`, or `already_booked`, which keeps "that is not a slot this business ever has" (`404`) separate from "that is a slot you cannot have" (`409`).

#### Time handling

- **Responses** render every instant as RFC 3339 with the configured time zone's offset for that date: `2026-01-05T10:00:00+01:00` in winter, `+02:00` in summer. A response uses `Z` only if the configured zone's offset is genuinely zero. A contract test asserts the offset is the configured zone's, not merely that the value parses as a valid instant.
- **Sub-second values are refused, not rounded.** `slotStart` is normalized to whole seconds on arrival, and that normalization must be lossless: a non-zero fractional part is rejected at validation (precedence step 2) rather than truncated. Truncating would let `09:00:00.500Z` book the 09:00 slot, and rounding would let it book 09:00 or 09:00:01 depending on the direction — either way, validation and the fingerprint could disagree about which instant the request meant. Rejecting it keeps one value flowing through schedule lookup and the fingerprint, and keeps the failure at a step where [rule 18](#business-rules) leaves the idempotency key unbound.
- **Requests** accept any representation of the correct instant, `Z` included, and normalize to an instant on arrival: `2026-01-05T09:00:00Z` and `2026-01-05T10:00:00+01:00` are the same `slotStart`. The configured-zone rule is an output contract, not an input restriction — rejecting an equivalent offset would be pedantry with no behavior behind it. The `from` and `to` query parameters are local dates and are always interpreted in the configured zone, never in the caller's.
- A slot is `{ "start": <instant>, "end": <instant> }`. `GET /api/slots` returns bookable slots only; booked and out-of-window slots are absent rather than flagged.
- `POST /api/bookings` identifies the slot by its normalized `slotStart`. A **generated slot start** is one the business schedule produces — a Monday-to-Friday local date, on the half hour, from 09:00 through 16:30 — and that definition depends on the schedule alone: not on the current time, not on the availability window, and not on existing bookings. `2026-01-05T10:07:00+01:00`, a Saturday, and 18:00 are therefore not slot starts in any week, past or future.
- Slots are generated from **local wall-clock business hours, per calendar day**. A daylight-saving change therefore shifts the UTC offset of that day's slots but never their number: every weekday has the same 16 local slots year-round.
- The configured time zone must have its daylight-saving transitions outside 09:00 to 17:00 local time. `Europe/Berlin` transitions at 02:00/03:00 and satisfies this. The constraint is a documented precondition of the configuration, asserted by a unit test that generates a window across both transition dates.
- A slot whose local start does not exist or is ambiguous is excluded from availability and rejected as `slot_not_found` if booked directly. With the constraint above this is unreachable in the default configuration; the check exists so a bad time-zone setting fails loudly instead of quietly double-booking an hour.
- Holidays are ignored.

#### Input validation

The backend is authoritative. The frontend applies the same rules for immediate feedback and must still handle a backend rejection.

| Field | Rules |
| --- | --- |
| `name` | Required. Trimmed before validation and storage. 1 to 80 characters after trimming, with at least one non-whitespace character. No control characters. |
| `email` | Required. Trimmed, lowercased before storage and comparison. 3 to 254 characters. Exactly one `@`, a non-empty local part, and a domain containing at least one dot. **No whitespace and no control characters anywhere in the value, local part included** — `a b@example.com` is rejected. Quoted local parts, which RFC 5322 would permit, are out of scope. Deliberately permissive but bounded rather than RFC 5322 complete: the job is to catch obvious mistakes, not to prove deliverability. |
| `reason` | Optional. Trimmed. 0 to 500 characters. An empty or whitespace-only value is stored as absent. |
| `slotStart` | Required. A valid RFC 3339 instant **at whole-second precision**. A fractional part is accepted only when every digit is zero (`09:00:00.000Z` is valid and normalizes to `09:00:00Z`); any non-zero fraction such as `09:00:00.500Z` is a `validation_error` with issue `fractional_seconds`, and a leap second (`:60`) is rejected with issue `not_an_instant`. Whether the value is a generated slot start, and whether that slot is obtainable, are not validation questions — see the precedence under [Error responses](#error-responses). |
| `Idempotency-Key` | Required on `POST /api/bookings`. 16 to 128 characters from `A-Z a-z 0-9 _ -`. A missing or malformed key is a validation error, not a silent pass-through — an optional key would leave rule 8 unenforceable for the clients that skip it. |

A validation failure returns one `400` listing every offending field, not just the first.

A request body carrying a field that is not in the contract is a `validation_error`. Unknown fields therefore never reach the idempotency fingerprint, which removes the question of whether they belong in it.

#### Confirmation code access

- The code is 10 characters from the 32-character Crockford base32 alphabet — digits and letters excluding `I`, `L`, `O`, `U` — drawn from a cryptographically secure source, about 50 bits of entropy.
- **Normalization happens before the format check, and is exactly two steps:** trim surrounding whitespace, then uppercase. Nothing else is applied — no `I`/`L` to `1` or `O` to `0` substitution, no separator stripping — so the accepted input alphabet is precisely the generated one and the format check can be exact. Crockford's transcription-aid substitutions are deliberately out of scope; they would add a decoding rule and a mapping test for a benefit no automated client needs.
- **After normalization, a code is well-formed when it is exactly 10 characters, each from that alphabet.** This is what makes the three test cases distinguishable: `k7h2m9qrst` lowercase is a *well-formed* code that resolves to its booking (`200`), `K7H2M9QRS` (nine characters) and `K7H2M9QRSI` (an excluded letter) are *malformed*, and `K7H2M9QRST` with no matching row is *unknown*. Malformed and unknown are indistinguishable in the response — both `404 booking_not_found` with the identical body — while a lowercase valid code is not an error at all.
- A malformed code is **not** a `validation_error`: that would disclose, by status code alone, that the value failed the format check rather than the lookup, which rule 12 forbids. The format check exists to avoid a pointless query, not to produce a distinguishable answer.
- Possession of the code authorizes retrieval and cancellation of that booking. There is no email confirmation step. This is the MVP's entire customer-access boundary and a deliberate tradeoff: it avoids accounts, at the cost of a code that behaves as a bearer credential. Rate limiting, code rotation, and enumeration defenses beyond the code's own entropy are out of scope and recorded as known limitations.
- `GET /api/bookings/{confirmationCode}` returns `confirmationCode`, `status`, `slotStart`, `slotEnd`, `name`, `email`, `reason`, `createdAt`, `cancelledAt` or `completedAt` once set, and `cancellable` — the backend's current answer to rule 5, so the frontend never evaluates the cutoff itself.
- An unknown code, a code that fails the format check, and a code of the wrong length all return the same `404 booking_not_found` body. A test asserts the three responses are identical.
- **Uniqueness and collisions.** The code column carries a database uniqueness constraint (rule 17). On a collision the generator retries, bounded to 5 attempts inside the same transaction; if all 5 collide the transaction rolls back, no booking is created, and the response is `500 internal_error` with the collision logged. At about 50 bits of entropy this is unreachable in practice, so it is specified for the sake of the persistence invariant and tested by injecting a stub generator that always returns a code already in use: both the bounded loop and the absent booking are then assertable without waiting for luck.
- The internal booking `id` is never returned by a customer endpoint. Only staff endpoints expose it.

#### Cancellation

- Eligible when `status` is `booked` and `now < slotStart`, evaluated against the injected clock.
- Success returns `200` with `status: "cancelled"` and `cancelledAt` set.
- At exactly `slotStart` and at any point after it, cancellation is rejected with `409 cancellation_window_closed`. The boundary is tested with the clock at `slotStart - 1s`, `slotStart`, and `slotStart + 1s`.
- Cancelling a booking that is already cancelled, or one that is completed, returns `409 booking_not_cancellable`. Cancellation is deliberately not idempotent: a distinct code makes it observable which rule fired, and the customer UI has no reason to retry a cancellation blindly.
- A successful cancellation of a future booking makes its slot available again as soon as the request completes. No background job, no delay.
- **Availability and the slots view are two different things.** Cancellation changes booking state: the slot has no active booking from that instant. `GET /api/slots` is a view over that state filtered by the window (rule 1), so it lists the freed slot only while the slot is inside the current window. A freed slot outside the window is available — it is simply not shown yet, and nothing has to happen when it comes into range.
- In the customer flow the two always agree, because the window advances with today: a slot booked inside the window moves *toward* the window's near edge as days pass and leaves it only by starting, never by drifting out of range while still in the future. A future booking is therefore always inside the window.
- A future booking **outside** the window can exist only from seeded data or a change of configuration, and cancelling one still frees the slot in state while `GET /api/slots` keeps omitting it until the window reaches it. This is tested by seeding a booking beyond today plus 6, cancelling it, asserting the slot is absent from the slots view, then advancing the injected clock until the window covers the slot and asserting it is offered. Nothing special runs at that moment; the window comparison is simply true by then.

#### Completion

- Eligible when `status` is `booked` and `now >= slotStart`. Staff cannot complete a booking that has not started, because "completed" asserts that the appointment happened.
- **At exactly `slotStart`, completion is allowed.** The comparison is deliberately non-strict, which makes completion the exact complement of cancellation: at the start instant cancellation is already refused (`cancellation_window_closed`) and completion is already permitted, so there is no instant where neither is possible and none where both are. Tested at `slotStart - 1s` (`booking_not_completable` with reason `not_started`), `slotStart` (allowed), and `slotStart + 1s` (allowed).
- Success returns `200` with `status: "completed"` and `completedAt` set.
- Every ineligible case returns `409 booking_not_completable`, with a `reason` in the error details of `not_started`, `already_cancelled`, or `already_completed`. One status code, three observable reasons: the contract stays small and the tests stay specific.
- An unknown booking id returns `404 booking_not_found`, and only after the staff credential has been accepted (rule 15).
- `GET /api/staff/bookings` takes `from` and `to` as the same kind of value as [`GET /api/slots`](#availability-window) — optional local dates, `YYYY-MM-DD`, read in the configured time zone, `to` inclusive — and defaults to today through today plus 6. Results include bookings in every status, each with its `id`.
- The two endpoints share the syntax and differ only in the bounds. Worth stating explicitly, because a reader could reasonably assume either set of bounds applies to both:

| Rule | `GET /api/slots` | `GET /api/staff/bookings` |
| --- | --- | --- |
| Format, zone, inclusivity | `YYYY-MM-DD`, configured zone, `to` inclusive. | Identical. |
| Malformed or non-existent date | `400 validation_error`, `2026-02-30` included. | Identical. |
| Only one parameter supplied | The other takes its default. | Identical. |
| `to` earlier than `from` | `400 validation_error`. | `400 validation_error`, same code and shape. |
| Dates before today | `400 validation_error`. | Allowed without limit — staff legitimately look backwards. |
| Dates after today plus 6 | `400 validation_error`. | Allowed, subject only to the span limit. |
| Maximum span | The 7 dates the availability window already implies. | 31 **dates**, counted inclusively; a 32nd is `400 validation_error`, issue `range_too_wide`. |

- **The span formula is inclusive of both ends**, for both endpoints: `span = (to - from) in whole days + 1`, so the limit is `to - from <= 30 days` for staff and `to - from <= 6 days` for customers. Counting dates rather than differences is what the customer window already does — today through today plus 6 is 7 dates — and the staff limit uses the same arithmetic.

| Staff request | Dates counted | Result |
| --- | --- | --- |
| `from=2026-03-10&to=2026-03-10` | 1 | Allowed. A single day is a legal range. |
| `from=2026-03-01&to=2026-03-31` | 31 | Allowed — exactly at the limit. |
| `from=2026-03-01&to=2026-04-01` | 32 | `400 validation_error`, issue `range_too_wide`. |
| `from=2026-03-31&to=2026-03-01` | — | `400 validation_error`, issue `range_inverted`, checked before the span. |

- Neither endpoint clamps an out-of-bounds range: it is refused, for the reason given under [Availability window](#availability-window).

#### Idempotent booking creation

- The key is scoped to `POST /api/bookings` and to nothing else.
- **Canonical payload form.** The fingerprint is computed over exactly these canonical values, which are also the values stored on the booking, so the stored record and the fingerprint cannot disagree:

| Field | Canonical form |
| --- | --- |
| `slotStart` | The instant as UTC at second precision, `2026-01-05T09:00:00Z`. Any equivalent offset normalizes to this, and a zero fractional part is dropped. A non-zero fraction never reaches this table: it is refused at validation, so no canonical form has to be invented for it. |
| `name` | Trimmed. Interior whitespace is preserved exactly and never collapsed, because the stored name must be what the customer typed. |
| `email` | Trimmed and lowercased. |
| `reason` | Trimmed. **Omitted, `null`, `""`, and whitespace-only are one single value: absent.** A request that omits `reason` and one that sends `""` share a fingerprint and are replays of each other, not a conflict. |

- **Payload fingerprint:** SHA-256 over the UTF-8 encoding of a JSON object holding exactly those four canonical values, keys in lexicographic order (`email`, `name`, `reason`, `slotStart`), no insignificant whitespace, and `reason` omitted entirely when absent rather than serialized as `null`. Raw request bytes are never used: a resubmission with differently cased email or re-serialized JSON is a replay, and a byte-for-byte comparison would turn a client's harmless re-encoding into a `409`.
- **Only a committed booking binds the key (rule 18).** The idempotency record is written in the same transaction as the booking, so the key becomes bound to its fingerprint at the instant the booking exists, and not before. Outcomes that create nothing — `400 validation_error`, `404 slot_not_found`, `409 slot_unavailable`, `500 internal_error` — are **not** stored against the key and leave it unbound, so a client may correct the request, or wait for the slot to free up, and retry with the same key and succeed. Storing failures would poison a key for a client that fixed its own mistake and would change the key's meaning from "this booking was created" to "this request was attempted". The two conflict responses about idempotency itself (`idempotency_key_reuse`, `idempotency_request_in_progress`) are likewise never stored: they are answers about a key, not outcomes of one. Nor do they disturb what the key already holds — a `key_reuse` refusal leaves the original binding and its stored response exactly as they were, which is why a later retry carrying the *original* payload still replays correctly.
- **Replay, same key and same fingerprint:** returns the original stored status code and response body unchanged, plus `Idempotent-Replay: true`. It creates no record and performs no state change.
- **Exactly what is stored and replayed.** The idempotency record stores three things: the status code, the response body bytes, and the `Content-Type`. A replay reproduces those three verbatim and adds `Idempotent-Replay: true`. Everything else is regenerated for the replaying request as for any other response — `Date`, `Content-Length`, and any per-request diagnostic or tracing header — because they describe this response, not the stored one. No other original header is stored, which is why the success response deliberately carries no `Location` or other resource-identifying header: the confirmation code in the body is the handle, so there is nothing header-shaped to have to replay.
- **On a first response the header is absent**, not `false`. A client therefore tests for presence, and a test asserting `Idempotent-Replay: false` on a fresh `201` would be asserting something this API never sends.
- **Replay after the booking was cancelled:** still returns the original `201` body with `status: "booked"`. A replay reproduces that request's result; it is not a view of current state. `GET /api/bookings/{confirmationCode}` is how current state is read, and the replayed code resolves to the cancelled booking, so nothing is hidden. Storing the response rather than re-deriving it is what makes this answer stable.
- **Conflict, same key and different fingerprint:** `409 idempotency_key_reuse`. No record is created or modified.
- **In flight, same key while the first request is unfinished:** `409 idempotency_request_in_progress`, documented as safe to retry after a short delay. Holding the second request behind the first would tie request latency to a lock for no benefit at this scale. A request claims the key before it starts work, which is what makes that answer possible; the claim is released on any failure, so a failed attempt leaves no trace, and it is converted into the stored record when the booking commits.
- **A claim is a fenced lease, not a timer.** The claim row carries a `claimToken` generated per request and an `expiresAt` of `claimedAt + 60s`, judged against the injected clock. A second request may take the claim over only once `now >= expiresAt`, and the takeover is a conditional update that writes a **new** `claimToken`. Committing a booking then requires the committer's own token to still be the one on the claim row, checked under a row lock inside the same transaction as the booking insert. A request whose claim was taken over therefore updates zero rows, rolls back with no booking written, and answers `409 idempotency_request_in_progress`, which the client may retry — by then the winner's result is stored and the retry replays it.
- This is what stops a stale lease from corrupting the key: without the token, a slow first request could commit a booking after a second request had already claimed the key, and the key's stored result would depend on which request happened to finish first even though rule 2 kept the slot itself safe. The lease duration must exceed the server's request timeout — 60 seconds against a 15-second timeout — so a live request never loses its claim in normal operation; the lease exists only to recover from a crashed process, and the token is what makes that recovery safe. Both orderings are tested: the taken-over request must commit nothing, and a takeover attempted before the lease expires must be refused.
- **Expiry boundary:** a stored record is valid for replay while `now < createdAt + 24h`, judged against the injected clock. At exactly `createdAt + 24h` and after it the key counts as unused, which is the same strict-comparison convention as the cancellation cutoff. Tested at `createdAt + 24h - 1s`, `createdAt + 24h`, and `createdAt + 24h + 1s`. A retry after expiry is a fresh booking attempt and may legitimately fail with `slot_unavailable`. A cleanup task may delete expired records, but deletion is not what makes a key expire — the comparison is. Twenty-four hours is long enough for any realistic retry and short enough to keep the table small.
- **Distinct from the slot race:** two *different* keys racing for one slot yield exactly one `201` and `409 slot_unavailable` for the rest, which is rule 10. One key racing with itself yields one `201` and either `409 idempotency_request_in_progress` or a replay. Different codes, separate tests, neither standing in for the other.

#### Staff credential

- Sent as `Authorization: Bearer <token>` and read from the `STAFF_API_TOKEN` environment variable.
- `.env.example` is committed with a placeholder; `.env` is git-ignored. The shared test environment, CI, and each disposable environment inject their own value as a secret or job variable. The credential is never committed, logged, echoed in an error message, or included in a test report.
- Local development and every test level use a fixed, non-secret value supplied through that same variable, so the production code path is the only code path.
- A missing, malformed, or wrong credential returns `401 unauthorized` with no detail and no hint whether the referenced booking exists.

#### Error responses

Every error shares one shape:

```json
{
  "error": {
    "code": "slot_unavailable",
    "message": "human-readable, never a stack trace",
    "details": [{ "field": "email", "issue": "invalid_format" }]
  }
}
```

`details` appears only where it adds something: validation fields, the completion reason, and the slot-unavailable reason.

**The shape of a `validation_error`'s `details` is fixed**, because the frontend, the backend, and the contract tests all compare them:

- **One entry per failing rule**, each `{ "field": ..., "issue": ... }`. A field that breaks two rules produces two entries — an over-long email containing a space yields both `too_long` and `contains_whitespace` — so a client can show every problem at once and no rule is silently dropped.
- **`field` is the name the caller used**: the JSON key for a body field (`slotStart`, `name`, `email`, `reason`), the header name for a header (`Idempotency-Key`), the parameter name for a query parameter (`from`, `to`). No synthetic paths and no renaming between layers.
- **`issue` is a stable `snake_case` code from a closed list**, never prose. `message` carries the human sentence; `issue` is what tests assert. The list: `required`, `not_a_string`, `too_short`, `too_long`, `invalid_format`, `contains_whitespace`, `contains_control_character`, `not_an_instant`, `fractional_seconds`, `not_a_date`, `range_inverted`, `range_too_wide`, `before_today`, `after_window_end`, `unknown_field`. Adding a code is a change to this list and to `contracts/openapi.yaml`, in that order — never an implementation detail invented at the call site.
- **Order is significant and deterministic**: entries are sorted by `field`, then by `issue`, both lexicographically. Sorting rather than preserving discovery order means an assertion does not depend on which validator happened to run first, and two layers can compare whole arrays instead of searching them.
- **An unknown body field yields one entry** per field, `issue: unknown_field`, and never a `message` echoing the value.
- `message` is for humans and is **never asserted** by a test: it may be reworded without a contract change, which is precisely why `issue` exists.

**Precedence on `POST /api/bookings`.** More than one of these can be true at once, so the order is fixed and a contract test walks it:

1. `Idempotency-Key` header missing or malformed → `400 validation_error`.
2. Body fields invalid, or a field outside the contract → `400 validation_error`. The canonical form cannot be computed from an invalid body, so validation necessarily precedes anything about the key — and because nothing is stored for a failed request (rule 18), the key stays unbound.
3. The key resolves: a stored record with the same fingerprint replays it; a stored record with a different fingerprint is `409 idempotency_key_reuse`; a live claim is `409 idempotency_request_in_progress`. This comes **before** the slot checks, so retrying a submission that already succeeded replays the original result instead of colliding with its own booking.
4. `slotStart` is not a generated slot start → `404 slot_not_found`. Judged against the business schedule alone, so a well-formed instant at 10:07, on a Saturday, or at 18:00 fails here whatever the date.
5. `slotStart` is a generated slot start the caller cannot have → `409 slot_unavailable`, with a `reason` of `not_in_future` (`slotStart <= now`, so the reason covers the rejected `slotStart == now` boundary as accurately as a start an hour ago), `outside_window` (beyond today plus 6 days), or `already_booked`. A start that is both non-future and out of window reports `not_in_future`, the reason listed first.
6. Otherwise the booking is created under the fencing check (rule 18), returning `201`, or `500 internal_error` if confirmation-code generation is exhausted.

The two slot errors never overlap: step 4 asks whether the business schedule contains that start at all, step 5 whether this caller may take it.

**This list is the single canonical statement of the ordering.** The contract, the implementation, and the tests cite it; none of them restates it. Two properties make it a testable contract rather than a guideline:

- **Exhaustive.** Every response `POST /api/bookings` can produce comes from exactly one of the six steps. There is no seventh outcome, and a response that cannot be attributed to a step is a defect in the implementation or a gap in this list — never a new undocumented case.
- **Total on overlaps.** Where several conditions hold at once the earlier step answers and the later ones are never evaluated. The contract test walks these deliberately overlapping cases: a malformed `Idempotency-Key` *and* an invalid body (step 1, the key first); a well-formed key *and* an unknown body field (step 2); a key under a live claim *and* an invalid body (step 2 — validation precedes the key's state, so no claim is consulted and none is taken); a key already bound to a different fingerprint *and* a slot that has meanwhile become unavailable (step 3, `idempotency_key_reuse`); a replayable key whose slot has since been booked by someone else (step 3, the replay wins); a start that is neither a schedule start nor in the future (step 4, `slot_not_found`); a schedule start that is both non-future and outside the window (step 5, reason `not_in_future`); and an exhausted confirmation-code generator on an otherwise valid request (step 6, `500 internal_error`, no booking, key left unbound).

| Code | Status | Raised when |
| --- | --- | --- |
| `validation_error` | 400 | Any field or query-parameter rule above fails. |
| `slot_not_found` | 404 | `slotStart` is not a generated slot start — the business schedule has no such slot in any week. |
| `slot_unavailable` | 409 | A generated slot the caller cannot have, with a `reason` of `not_in_future`, `outside_window`, or `already_booked`. |
| `booking_not_found` | 404 | Unknown or malformed confirmation code, or unknown staff booking id. |
| `cancellation_window_closed` | 409 | Cancellation at or after `slotStart`. |
| `booking_not_cancellable` | 409 | Cancellation of a cancelled or completed booking. |
| `booking_not_completable` | 409 | Completion of a booking that is cancelled, completed, or not yet started. |
| `idempotency_key_reuse` | 409 | Same key, different payload fingerprint. |
| `idempotency_request_in_progress` | 409 | Same key while the first request is unfinished. |
| `unauthorized` | 401 | Missing or wrong staff credential. |
| `internal_error` | 500 | An unexpected failure, including exhausted confirmation-code generation. The body carries no `details` and no diagnostic text. |

This table is the contract test's checklist: every code appears in `contracts/openapi.yaml` and has at least one test that produces it.

#### Domain events and notification records

*Rules 19 and 20. Owned for verification by [FR-011](#functional-requirements) and [FR-012](#functional-requirements), stressed by [NFR-011](#non-functional-requirements).*

`booking-service` is the only producer. Each committed booking state change appends one event row to an **outbox table in the same transaction as the state change**, and a relay publishes outbox rows to the `booking.events` topic. The outbox is what makes rule 20 true: a crash between committing a booking and publishing its event is impossible, because there is no such gap. A row is published at least once and marked published after the broker acknowledges it, so a crash after acknowledgement but before marking republishes — which is precisely why the consumer must de-duplicate.

| Event | Published when | Partition key |
| --- | --- | --- |
| `BookingCreated` | A booking is committed by `POST /api/bookings`. | `slotStart` |
| `BookingCancelled` | A booking moves `booked → cancelled`. | `slotStart` |
| `BookingCompleted` | A booking moves `booked → completed`. | `slotStart` |

Every event carries the same envelope: `eventId` (UUID, the de-duplication key), `eventType`, `occurredAt` (UTC instant at whole-second precision, from the injected clock), `bookingId`, and a `data` object holding the booking's canonical stored values. The partition key is `slotStart`, so every event about one slot is ordered with respect to the others.

- **An idempotent replay publishes nothing.** A replay commits no transaction, writes no outbox row, and so produces no event and no second notification record. This is rule 8 and rule 20 meeting: the stored response is reproduced, the side effects are not.
- **The consumer is idempotent.** `notification-service` writes at most one notification record per `eventId`, enforced by a unique constraint on `eventId` rather than by checking first — the same reasoning as rule 2's partial index. A redelivery hits the constraint and is acknowledged without writing.
- **Failures are bounded, and a dead letter is a breach rather than an outcome.** A message that cannot be processed is retried up to the configured attempt limit, then published to the dead-letter topic with its original payload and the failure reason. Nothing is silently dropped. While that event sits unrecovered, rule 19's promise for its booking is **breached**, not satisfied and not waived: the notification record does not exist and is owed.
- **Dead-lettered events are recovered by replay.** A documented replay re-publishes a dead-lettered event to the consumer, which is safe precisely because the consumer de-duplicates on `eventId` — a replay of an event that did partially succeed cannot produce a second record. Rule 19 is met for that booking once the replay succeeds and exactly one record exists. A dead-lettered event that cannot be replayed is a defect with an open issue, never a closed one.
- **Dead-letter depth is asserted, not watched.** It is zero in every run except the single test that deliberately plants a poison message, and a non-zero depth anywhere else is an [escaped defect](#escaped-defects-in-a-project-with-no-production) with the level that should have caught it named. Since CI verifies the event contract on both the producer and the consumer side, a schema-invalid event can only arrive from a bug, which is why the planted test is the only legitimate occurrence.
- **A notification record is never a delivery.** It is the audit entry BR-009 asks for: the booking id, the event id, the event type, the stored recipient address, the prepared subject and body, and `createdAt`. The prepared message is retained so staff can see what was composed for that customer, not because anything will send it. No message leaves the system, there is no mail transport in any environment, and "sent" is not a state this product has. A later decision to deliver these messages would be a new business requirement with its own transport, evidence, and milestone — not a reinterpretation of this one.
- **Events are a contract.** `contracts/events/*.schema.json` specifies the envelope and each `data` shape, with committed sample payloads under `contracts/events/samples/`. The producer side asserts that every emitted event validates against its schema; the consumer side asserts that it accepts every committed sample; and a CI check replays the committed `v1` samples after any schema change, so a change that would break a deployed consumer fails the build. A new required field is a new schema version, never an edit to an existing one.

Notification records are visible only to staff, through `GET /api/staff/notifications`, which takes the same credential (rule 15) and the same `from`/`to` semantics as `GET /api/staff/bookings` — same date syntax, same configured zone, same inclusivity, same defaulting, same malformed-date handling, the same `range_inverted` before `range_too_wide` ordering, and the same 31-day cap. It introduces no new status code and no new error code. Customers never see a notification record, and no customer response mentions that one exists.

**Eventual consistency, stated once.** A notification record appears shortly after the booking change, not within the booking request. Tests must not sleep to wait for it — [Quality standards](#quality-standards) forbids a sleep as synchronisation. An integration test drives the relay and the consumer directly, in a chosen order, so the outcome is deterministic; an end-to-end test polls a bounded condition with a deterministic timeout and a recorded attempt count, and fails rather than retrying the scenario.

#### Availability cache

*Rule 21. Owned for verification by [FR-001](#functional-requirements), stressed by [NFR-002](#non-functional-requirements).*

`GET /api/slots` reads a cached availability view. The cache is a performance detail with one hard rule over it: **it may never answer with a slot that has an active booking.** Rule 3 is unchanged — the backend is authoritative, and the cache is part of the backend, so a stale cache is a correctness defect rather than a tolerable approximation.

**The mechanism is version validation, not invalidation.** The cache and the database cannot commit together — they are two systems with no shared transaction — so correctness may not rest on an invalidation succeeding. It rests instead on a version the database owns:

- The database holds an **availability version per local date**, bumped inside the same transaction that changes booking state. The bump is part of that transaction and shares its fate: if the booking commits, the version moved; if it rolls back, the version did not.
- A cached entry is `{version, slots}` under a key of the local date in the configured zone, where `version` is the availability version the entry was computed at.
- A read takes the authoritative version with one small indexed query, then reads the entry. The entry is served **only** when the two versions are equal. Otherwise the slot list is recomputed from the database, stored under the version that was read, and served.
- **The version read and the recomputation share one snapshot.** Both happen in a single read transaction, so the slot list a writer stamps is exactly the list that version describes — never a list assembled from a later state. Reading the version first, in the same snapshot, is what makes a stamp a true label rather than a guess.
- **The version is a monotonic counter and never resets.** A timestamp, a hash, or any reusable value would let a long-dead entry match again after wrap-around or clock movement, which would reintroduce precisely the staleness the stamp exists to exclude.
- **Why that is sound:** a version match means no booking state change committed for that date between the version read and the serve, so the entry holds exactly the state that read observed.
- **What this does and does not promise.** It promises *equivalence*: a cached answer is identical to the answer a direct database read would have produced at the same instant. It does not promise that the answer is still true when the customer sees it — no read in any system can promise that, cached or not, because a booking may commit while the response is in flight. That residual window is the ordinary snapshot staleness of reading, it is identical with and without the cache, and its consequence is already handled: rule 3 requires the frontend to cope with a slot going unavailable between render and submit, and step 3 of the [error precedence](#error-responses) answers `already_booked`, so a stale read costs one conflict response and never a double booking. Closing it would require serializing every read against every write — on the uncached path too — which no part of this specification asks for.
- **A failed cache write is harmless and must not fail the request.** The stamp simply will not match on the next read, and the answer is recomputed. There is no window in which an unwritten invalidation can serve a wrong answer, which is the whole reason for choosing validation over invalidation.
- Deleting the entry after a commit is a best-effort optimisation to avoid a pointless recomputation. It is never the correctness mechanism, and its failure is ignored.
- Entries also carry a short time-to-live, purely to bound memory. It is not the mechanism, and a test may not pass by waiting for a time-to-live to lapse.
- A cache miss, an unreachable cache, a cold cache, and a cache holding a stale stamp all produce the same correct answer from the database. The cache is never required for a response, and a cache outage degrades latency only.
- Nothing else is cached. Bookings, confirmation-code lookups, idempotency records, claims, and staff queries always read the database, because every one of them is either a credential check or an invariant.

**What the cache avoids, and what it costs.** Avoided on a hit: generating the schedule's slot starts for each date in the window, the range scan over bookings for those dates, the filtering of generated starts against active bookings, and the per-date assembly of zone offsets — up to seven dates per request. Still paid on every read: one indexed lookup of the version rows for the requested dates, which is a handful of rows from a tiny table.

**And an honest statement of scale.** At this project's data volume — one business, at most 112 slots in a window — the work avoided is small, and the saving may not exceed the version lookup by much. That is deliberately not asserted here: the cache-warm and cache-cold measurements in [Performance tests](#performance-tests) are recorded *separately* precisely so the number says whether it helped, rather than this document claiming that it did. The cache's purpose in this project is the invariant and its evidence: it creates a coherency failure mode that rule 3 would otherwise never be tested against, and `GET /api/slots` is the one read hot enough for a cache to belong on at all.

**The cache adds no observable behavior.** Responses, status codes, and the contract are identical with it, without it, and with it unreachable. Rule 21 is therefore a constraint on a mechanism, not a promise to a customer — which is why it needed no business requirement of its own and is owned for verification by FR-001.

#### Telemetry

*Owned for verification by [NFR-010](#non-functional-requirements), which also fixes its evidence.*

Telemetry is part of this specification because tests assert on it. Both services and the frontend are instrumented with OpenTelemetry, and the following facts are contractual rather than incidental:

- **Trace context propagates end to end.** Every request carries a W3C `traceparent`; the frontend starts a trace, `booking-service` continues it, the event envelope carries the trace context, and `notification-service` continues that same trace when it consumes. One booking is one trace, from a click to a notification record.
- **Each domain event emits exactly one span event on the producer** and one on the consumer, which is how "exactly one event per state change" (rule 19) is asserted without reading the broker.
- **Required metrics:** request count, error count, and duration per endpoint; cache hit and miss counts; outbox backlog depth; consumer lag; dead-letter topic depth; notification records written. These are the load run's oracles as much as its dashboards.
- **Nothing sensitive is ever recorded.** No confirmation code, no staff token, and no customer name, email address, or reason for a visit may appear in a log line, a span name, a span attribute, a metric label, or an exception message. The booking id and the event id are the only identifiers telemetry carries, and this prohibition is asserted rather than trusted ([NFR-005](#non-functional-requirements), [NFR-006](#non-functional-requirements), [NFR-010](#non-functional-requirements)).
- **Assertions never leave the process.** Telemetry is asserted through an in-memory exporter inside the test, never by querying a telemetry backend. Querying a backend would put a network call and an ingestion delay inside the gate, which [NFR-001](#non-functional-requirements) forbids. The hosted backend receives shared-environment and load-run data, and supplies the dashboard and trace links that [traceability rows](#the-traceability-view) cite.

### The traceability view

`docs/traceability.md` is the artifact a reviewer actually reads, and it carries evidence rather than assurances: one row per functional and non-functional requirement, grouped under the business requirement each one serves, with these columns.

| Column | Content |
| --- | --- |
| Requirement | ID and one-line statement, for an FR or an NFR. |
| Serves | The parent BR, or the PO where the property exists for the exercise rather than for the business. |
| Business rules | The numbered rules the requirement owns. An NFR row names the requirements it stresses instead, because an NFR owns no rules. |
| Acceptance criteria | Link to `docs/requirements/FR-0NN.md` or `docs/requirements/NFR-0NN.md`. |
| Implementation | Links to the source files. |
| Checks | Every check, by level, with its test name, its file, and its TC ID. An E2E row names the feature file and the scenario. |
| Result | Link to the latest CI run, its outcome, and its date. |
| Trace | From milestone 5, the trace link the run recorded, for a requirement whose evidence includes an E2E or shared-environment run. A dashboard link is not a substitute for a check. |
| Definition-of-done tier | Which [definition-of-done](#definition-of-done) tier the evidence was gathered under — unrelated to the three requirement tiers. |
| Defects | Issue links, each with the regression test written before its fix. |

A row asserting that evidence exists without linking a scenario or test ID **and** a run result does not count. A requirement whose row has a missing link, a stale run, or a quarantined check is listed as unverified, and milestone 8 does not exit while any row is unverified.

A business requirement or project objective gets no row of its own but a heading, and under it the roll-up: it is **satisfied** when every FR and NFR serving it is verified, **partly satisfied** while some are, and **unverified** when none is. Because the roll-up is mechanical, a reviewer can read the document at either altitude — eight business needs and seven project objectives, or twenty-five pieces of linked evidence. The product headings and the project headings are kept apart, so a reviewer can see at a glance whether the booking workflow is verified independently of how much of the exercise is finished.

An NFR row before its milestone reads **not yet due**. That is not the same as unverified and does not block a milestone the NFR has not reached; from its milestone onward the row is held to exactly the same standard as every other.

## Implementation strategy and tooling

*The chosen stack, where code lives, and the environments it runs in.*

### Tooling

The stack is chosen; every row below is recorded in the [decisions log](#context-and-decisions-log) and may be revisited there rather than here.

| Concern | Choice | Why this one |
| --- | --- | --- |
| Backend | Java 25 (LTS), Spring Boot, one Gradle multi-module build | One toolchain for both services and for the API-level tests, the richest Testcontainers and Kafka support, and the current LTS rather than one two releases behind. Many target roles still name Java 17 or 21; that tradeoff was taken deliberately and is recorded in the [decisions log](#context-and-decisions-log). |
| Frontend | React with TypeScript, Vite | A common framework a reviewer can read without explanation. |
| Database | PostgreSQL, one database per service, Flyway migrations | Rule 2's partial unique index needs a real database; one per service keeps the boundary honest rather than decorative. |
| Cache | Redis | Smallest thing that makes [the availability cache](#availability-cache) and its invalidation rule real. |
| Messaging | Apache Kafka in KRaft mode, one topic plus a dead-letter topic | Carries [domain events](#domain-events-and-notification-records); consumer groups, retry, and the dead-letter topic cover the queue role without a second broker. |
| Backend unit and integration | JUnit 5, AssertJ, REST Assured, Testcontainers | Integration tests run against a real Postgres, Redis, and Kafka rather than mocks of them. |
| Frontend unit and integration | Vitest, React Testing Library, MSW | Component and page behavior against a controlled API client, including the slot-unavailable path. |
| Contract | `contracts/openapi.yaml` validated in both directions; `contracts/events/*.schema.json` validated producer-side and consumer-side | Two boundaries now exist, so both are specified as files in the repository and verified from both ends. |
| E2E | Playwright with `playwright-bdd`, in TypeScript | The best-supported Playwright API, sharing the frontend's tooling, with Gherkin that still reads as acceptance criteria. |
| Load | k6 as the gate and the recorded baseline; one equivalent JMeter plan as a second artifact | k6 is scriptable, diff-reviewable, and runs unattended in CI. The JMeter plan covers the same scenario for breadth and runs locally, non-blocking, so there is one gate and not two. |
| Telemetry | OpenTelemetry SDK and Java agent; hosted OTLP backend for dashboards; in-memory exporter in tests | Instrumentation is vendor-neutral, so the backend can change without touching code. Assertions never leave the process — see [Telemetry](#telemetry). |
| Quality gate | Spotless and Checkstyle; Biome and `tsc --strict`; Spectral; `helm lint`, chart-testing, kubeconform; gitleaks; Trivy; hosted static analysis; CodeQL; dependency alerts | Each one fails a pull request on a planted violation, which is what [NFR-012](#non-functional-requirements) requires of it. |
| Reporting | ReportPortal, self-hosted in the persistent cluster; Allure published to Pages; CTRF as the one normalised result format across JUnit, Vitest, and Playwright | A portal needs history, so it cannot live in an ephemeral cluster; Allure needs no account, so a reviewer can read a run without one; one normalised format means the metrics need one parser rather than three. |
| Quality metrics | Emitted over OTLP into the same dashboards as the product telemetry | A quality trend and a system trend are read together, and no new component is introduced to hold them. |
| CI | GitHub Actions | One pipeline, the same command string as the README ([NFR-007](#non-functional-requirements)). |
| Packaging and ops | Docker images, Helm umbrella chart with a library chart, helmfile, kind in CI, k3d plus ArgoCD for the shared environment | See [Test environments and disposable environments](#test-environments-and-disposable-environments). |
| One command | A Taskfile wrapping install, migrate, seed, and every test level | NFR-007 requires one documented command; with several languages in the repository, that command has to exist somewhere, and a task runner is the least magical place for it. |

Two choices deliberately not made: no second CI system, and no service mesh, schema registry, or contract broker. Each would add a component whose behavior this project would then have to verify, and none of them carries a rule that the current set cannot.

### Suggested repository layout

One repository, several deployable pieces, serving one product. Create a directory when something goes in it; do not scaffold empty folders to match this example.

```text
appointment-booking/
  README.md
  Taskfile.yml                 # the one documented command (NFR-007)
  .env.example
  settings.gradle.kts          # Gradle multi-module: the two services
  pnpm-workspace.yaml          # pnpm workspaces: frontend, e2e
  .claude/
    skills/                    # one per skill in Engineering standards as artifacts
    agents/                    # one per review agent in that same table
    evals/                     # one eval suite per skill, run in CI (NFR-012)
  .github/
    workflows/                 # build, test, scan, kind-in-job environment, sweep
  docs/
    requirements/              # FR-0NN.md and NFR-0NN.md: acceptance criteria, evidence plan
    test-plans/
    performance/               # one baseline file per measurement, with its conditions
    quality/                   # published metric snapshots, flaky scores with commit and seed
    test-cases/
    architecture/
    learning/                  # QA learning paths (QLP-NN), closed by evidence, not by reading
    milestones/                # one delivery plan per milestone (milestone-NN.md)
    decisions.md               # the decisions log, once docs/ exists
    ai-sdlc.md                 # what AI drafts, what reviews it, what it may never decide
    design-notes.md
    traceability.md
  services/
    booking-service/           # authoritative: slots, bookings, idempotency, outbox
      src/  test/
    notification-service/      # consumes booking events, writes notification records
      src/  test/
  frontend/
    src/  tests/
  e2e/
    features/  steps/  support/
  contracts/
    openapi.yaml               # the HTTP contract
    events/
      *.schema.json            # the event contract, one schema per event version
      samples/                 # committed payloads, replayed for compatibility
  load-tests/
    k6/                        # the gate and the recorded baselines
    jmeter/                    # one equivalent plan, non-blocking
  quality/
    metrics/                   # collectors: CTRF in, metric series out
    allure/                    # report configuration and history
    reportportal/              # launch configuration per level
  charts/
    appointment-booking/       # umbrella chart
    library/                   # shared chart templates
    helmfile.yaml
  infra/
    observability/             # collector config, dashboards as code
    shared-environment/        # k3d + ArgoCD application definitions
    disposable-environments/   # ApplicationSet, teardown, 24h sweep
    quality-portal/            # ReportPortal chart values for the shared cluster
```

### Test environments and disposable environments

Everything below runs on Kubernetes, packaged as a Helm umbrella chart over the two services, the frontend, Postgres, Redis, and Kafka, with a library chart holding what the service charts share. `helm lint`, chart-testing, and kubeconform run on every pull request, and the charts are the same in every environment — only values differ.

The shared test environment is a persistent k3d cluster running ArgoCD, which pulls this repository and reconciles it. ArgoCD pulling rather than being pushed to is what lets the cluster live on a workstation without exposing anything inbound. It runs the built frontend, both services, and isolated Postgres, Redis, and Kafka instances with deterministic seed data.

Per-pull-request environments come in two forms, deliberately:

- **Inside the CI job**, a throwaway `kind` cluster is created, the umbrella chart is installed, migrations and seeds run, the selected checks run, reports are collected, and the release and cluster are deleted. This is the gate.
- **In the shared cluster**, an ArgoCD ApplicationSet creates one namespace per open pull request, deleted when the pull request closes. These outlive the job that created them, which is the only reason teardown is a real property here rather than a side effect of the runner exiting — and it is what the 24-hour sweep in [NFR-008](#non-functional-requirements) exists to catch.

Add disposable environments as a delivery capability:

1. Provision an isolated application instance and database for a branch, pull request, or test run.
2. Apply migrations and seed known slots.
3. Run selected integration, contract, E2E, and optionally performance checks.
4. Collect test reports and logs.
5. Delete the environment and its data even when tests fail.

Each run must be isolated from other runs. Do not use production data or credentials — there is no production, and the only secrets in the pipeline are the staff development token and the telemetry and static-analysis tokens, all injected. Make cleanup automatic and safe to repeat, and let a scheduled sweep remove any namespace older than 24 hours that a killed teardown left behind ([NFR-008](#non-functional-requirements)).

The reporting portal lives in the shared cluster and nowhere else, because its value is history across launches and an ephemeral cluster has none. Every run — local, pull-request, or shared-environment — publishes its results to it, and the portal is never a dependency of a check: a run whose publish step fails still passes or fails on its own assertions.

Load and performance runs are the exception to the shared cluster: they run against a fixed, otherwise-idle host, because a noisy neighbour would make two runs non-comparable, and [NFR-003](#non-functional-requirements) defines comparability strictly enough that a shared cluster cannot satisfy it.

Helm packaging and the shared k3d and ArgoCD environment arrive in milestone 5; disposable per-pull-request environments in milestone 6. Neither is a precondition for a requirement being done before then; see the table in [Definition of done](#definition-of-done) for what is required when.

## Software architecture

*The components, their responsibilities, and the two contracts between them.*

### System shape

The component inventory, and where each component's rules are stated. This section **names responsibilities and points at
rules; it never restates one.** If a rule appears to be stated here, it is in the wrong place and belongs in
[Requirements](#requirements).

```text
                browser (React, TypeScript)
                        |  W3C traceparent starts here
                        v
        +---------------------------------------+
        |  booking-service        AUTHORITATIVE |
        |  slots, bookings, idempotency, claims |
        |  outbox rows written in-transaction   |
        +---------------------------------------+
           |            |                  |
           v            v                  v
      PostgreSQL     Redis            outbox relay
      (bookings,   (availability           |
       idempotency, view, version-         v
       outbox)      stamped)          booking.events  --> dead-letter topic
                                           |
                                           v
                          +--------------------------------+
                          |  notification-service          |
                          |  one record per eventId        |
                          |  staff notification lookup     |
                          +--------------------------------+
                                           |
                                           v
                                      PostgreSQL
                                   (notification records)

  every component exports OpenTelemetry; one booking is one trace end to end
```

| Component | Responsible for | Must never | Rules stated in |
| --- | --- | --- | --- |
| Frontend | Rendering availability, collecting booking input, holding one idempotency key across retries of a submission, surviving a slot that goes unavailable between render and submit. | Decide availability. Any client-side check is a hint. | [Availability window](#availability-window), [Input validation](#input-validation), rule 3 |
| `booking-service` | Every rule about slots, bookings, cancellation, completion, idempotency, claims, and confirmation codes. The only writer of booking state, and the only producer of domain events. | Publish an event outside the outbox, or trust the cache. | [Behavior specification](#behavior-specification), rules 1–18, 21 |
| PostgreSQL (booking) | The authoritative record: bookings, idempotency records, claims, the outbox, and the availability version counter. Enforces rule 2 by partial unique index and rule 17 by unique constraint. | Be bypassed by an application-level check standing in for a constraint. | Rules 2, 10, 16, 17, 18, 21 |
| Redis | A version-stamped copy of the availability view, serving a read only while its stamp matches. | Be authoritative, be required for a response, or fail a request when a write to it fails. | [Availability cache](#availability-cache), rule 21 |
| Outbox relay | Publishing outbox rows and marking them published on acknowledgement, which is what makes delivery at least once. | Publish inside the booking transaction, or drop a row silently. | [Domain events and notification records](#domain-events-and-notification-records), rule 20 |
| Kafka | Carrying domain events, partitioned by `slotStart`, with a dead-letter topic for what remains unprocessable. | Be treated as exactly-once, or as ordered across different slots. | Rule 20, [NFR-011](#non-functional-requirements) |
| `notification-service` | One notification record per `eventId`, enforced by unique constraint, and the staff lookup over those records. | Write a second record for a redelivered event, or send anything anywhere. | Rules 19, 20, [BR-009](#business-requirements) |
| Telemetry pipeline | Carrying traces, metrics, and logs out of every component, with trace context crossing the event boundary. | Carry a confirmation code, a token, or any customer datum. Be queried by a test. | [Telemetry](#telemetry), [NFR-010](#non-functional-requirements) |

**Two boundaries, two contracts.** HTTP is specified in `contracts/openapi.yaml` and events in `contracts/events/*.schema.json`;
both are verified from each side, and [Contract tests](#contract-tests) says how.

**What the split buys, and what it costs.** The second service exists because it produces test classes a single deployable
cannot: asynchronous assertion, at-least-once delivery, an idempotent consumer, dead-letter recovery, and a contract checked
from both ends. The cost is a boundary that can be eventually consistent, which is why the staff notification view is the only
read served by `notification-service` and why nothing in the booking path waits on it. The reasoning behind every component
here is in [What each platform addition buys](#what-each-platform-addition-buys).

### Suggested API

`contracts/openapi.yaml` is the contract and the starting point for every API change. Paths, status codes, and error codes are fixed by [Behavior specification](#behavior-specification); response field names may still change during implementation, in the contract first.

| Method and path | Purpose | Credential |
| --- | --- | --- |
| `GET /api/slots?from=&to=` | Bookable slots in the requested window. | none |
| `POST /api/bookings` | Create a booking. `Idempotency-Key` is required. | none |
| `GET /api/bookings/{confirmationCode}` | Retrieve one booking. | confirmation code |
| `POST /api/bookings/{confirmationCode}/cancel` | Cancel a booking that has not started. | confirmation code |
| `GET /api/staff/bookings?from=&to=` | Bookings in every status for the staff schedule. | staff token |
| `POST /api/staff/bookings/{id}/complete` | Complete a booking that has started. | staff token |
| `GET /api/staff/notifications?from=&to=` | Notification records for the staff view, served by `notification-service`. | staff token |

Every success and error schema is documented in the contract, including each code in the [error table](#error-responses). The first six paths are served by `booking-service`, the last by `notification-service`; both answer to the same contract document and the same error table, and no path introduces a status or error code outside it. Domain events are a second contract, specified as JSON Schema under `contracts/events/` and verified on both sides — see [Domain events and notification records](#domain-events-and-notification-records).

## Quality strategy

*The one-page map of how this project establishes quality: the levels, the disciplines, the tools, the metrics, and how they compose into evidence.*

**This section states no rule.** It is the index a reader — or an interviewer — should start from, and every row points at the section that owns the statement. Where this section and a linked section differ, the linked section wins.

### The strategy in short

The product is deliberately small so that the verification can be deliberately broad. That single trade is the whole strategy, and five commitments carry it:

1. **Every check sits at the lowest level that can hold it.** Each level has one stated job, and a higher-level test that re-asserts what a lower level already pins is deleted rather than kept for comfort. Breadth here is meant to be deliberate, not decorative.
2. **Determinism is non-negotiable, and nothing is ever retried.** Fixed seed data, an injected clock, no sleep as synchronisation, no retry anywhere. A failure must reproduce, which is what makes every other result in this project worth reading.
3. **Both boundaries are contracts.** HTTP and events are each specified as a file in the repository and verified from both sides, so implementation and contract cannot drift apart silently.
4. **Telemetry is an oracle, not a dashboard.** Tests assert on emitted spans and metrics, which turns "we have observability" into a checked fact.
5. **Nothing is claimed beyond its evidence.** A requirement is done when a linked check passes at the current milestone's tier — not when code exists. Metrics about the suite are published and read, never turned into gates.

**How the pieces compose.** The [requirement tiers](#requirements-and-traceability) say what must be true and who owns it. The [business rules](#business-rules) give each policy a citable number, and the [behavior specification](#behavior-specification) fixes its exact boundaries. The [test levels](#test-strategy) each take the part of that behavior they are the cheapest honest place for, driven test-first by [TDD](#tdd-for-development) below the surface and specified as [BDD](#bdd-for-end-to-end-tests) scenarios at it. The [contracts](#contract-tests) pin the two boundaries between components. [Telemetry](#telemetry) supplies oracles the levels could not otherwise reach. [Quality metrics](#quality-metrics-and-reporting) measure the suite itself. The [traceability view](#the-traceability-view) links every requirement to a named check and a dated run, and the [definition of done](#definition-of-done) decides, per milestone, when that chain is complete enough to count.

```text
  BR / PO            why it matters, who owns it
     |
     v
  FR / NFR           what must be true
     |
     +--> business rule 1-21        citable policy
     |        |
     |        v
     +--> behavior specification    exact boundaries
              |
              v
          the level that can hold it  (unit -> integration -> contract -> E2E -> load)
              |
              v
          named check + TC ID
              |
              v
          dated CI run + trace link + published report
              |
              v
          traceability row  ---->  requirement is done, at this milestone's tier
```

Read upwards and the chain answers "why does this test exist?"; read downwards and it answers "how do I know this requirement holds?". A break anywhere in it is the defect the strategy exists to surface.

### Quality architecture: the levels

Each level has one job, stated as what it demonstrates. The full statement of each lives in [Test strategy](#test-strategy).

| Level | Its job | Runs against | Stated in |
| --- | --- | --- | --- |
| Frontend unit | Isolated UI logic and formatting | Nothing external | [Frontend unit tests](#frontend-unit-tests) |
| Backend unit | The invariants as pure functions over an injected clock, so every boundary is cheap to test exhaustively | Nothing external | [Backend unit tests](#backend-unit-tests) |
| Frontend integration | The UI handling the backend's real answers, including the unhappy ones it cannot prevent | Controlled API client or mocked HTTP | [Frontend integration tests](#frontend-integration-tests) |
| Backend integration | The invariants surviving a real database, real transactions, and concurrency | Real Postgres, Redis, Kafka via Testcontainers | [Backend integration tests](#backend-integration-tests) |
| Contract | That the published contracts and the implementation cannot drift apart, in either direction, on both boundaries | `contracts/openapi.yaml`, `contracts/events/` | [Contract tests](#contract-tests) |
| End-to-end | That the assembled system delivers the acceptance criteria, in business language | Built frontend, both services, seeded infrastructure | [End-to-end tests](#end-to-end-tests) |
| Load | That correctness invariants hold under real concurrency, judged on state after the run | Dedicated seeded database | [Load tests](#load-tests) |
| Performance | A repeatable measurement discipline with its environment recorded and its limits stated | Fixed, otherwise-idle host | [Performance tests](#performance-tests) |

### Disciplines and guardrails

| Concern | What it commits to | Stated in |
| --- | --- | --- |
| TDD | Red–green–refactor; no production code without a failing test that required it; contract first for an API change | [TDD for development](#tdd-for-development) |
| BDD | Gherkin scenarios as the acceptance criteria for their requirements, tagged with the requirement ID, written before the automation | [BDD for end-to-end tests](#bdd-for-end-to-end-tests) |
| Standards as artifacts | The skills and review agents listed there — the table is the authoritative set — each skill with an eval suite that runs in CI and one eval proven to fail without it | [Engineering standards as artifacts](#engineering-standards-as-artifacts) |
| AI in the workflow | AI drafts and reviews; it never judges inside the gate and never decides behavior, rules, tiers, or doneness | [AI-assisted SDLC](#ai-assisted-sdlc) |
| The hard standards | No coverage gate, determinism, no retries, flaky quarantine blocking a milestone exit, correctness before metrics | [Quality standards](#quality-standards) |
| Scope control of the test suite | A check at the wrong level, or redundant breadth, is a defect rather than extra safety | [Test strategy](#test-strategy), `test-layering-reviewer` |

### Tools, by the job they do

The chosen tool for each job, with its tradeoff, is in [Tooling](#tooling); the components they run against are in [System shape](#system-shape).

| Job | Tool |
| --- | --- |
| Backend unit and integration | JUnit 5, AssertJ, REST Assured, Testcontainers |
| Frontend unit and integration | Vitest, React Testing Library, MSW |
| Contract, HTTP and events | `contracts/openapi.yaml` validated both directions; JSON Schema with committed samples replayed for compatibility |
| End-to-end | Playwright with `playwright-bdd`, in TypeScript |
| Load and performance | k6 as the gate and the baseline source; one JMeter plan as a non-blocking second artifact |
| Telemetry assertions | OpenTelemetry in-memory exporter, inside the test process |
| Static quality gate | Spotless, Checkstyle, Biome, `tsc --strict`, Spectral, `helm lint`, chart-testing, kubeconform, gitleaks, Trivy, hosted static analysis, CodeQL, dependency alerts |
| Reporting | ReportPortal for run history and triage; Allure published for a readable run; dashboards for the metric series |
| Environments | Helm on `kind` in CI, and k3d with ArgoCD for the shared environment |

### Metrics and quality management

| Concern | What it holds | Stated in |
| --- | --- | --- |
| What is measured | Per-level metrics, overall health, automation shape | [What is measured](#what-is-measured) |
| Flakiness | Disagreement across the four same-commit runs, published with commit and shuffle seed. No retries involved | [Flaky score, without retries](#flaky-score-without-retries) |
| Escaped defects | Found above the level that should have caught it, or after its milestone exited | [Escaped defects, in a project with no production](#escaped-defects-in-a-project-with-no-production) |
| The refusal to gate | Metrics are read, not gated; borrowed industry thresholds are rejected; the four binary gates are unchanged | [No metric becomes a target](#no-metric-becomes-a-target) |
| Where quality statements live | Four artifacts, four jobs, one authority each — the traceability view is authoritative for status | [Quality metrics and reporting](#quality-metrics-and-reporting) |
| Defects | Repository issues, with the regression test written before the fix | [Bug record fields](#bug-record-fields) |
| Test plan and cases | Markdown in version control, reviewable alongside code | [Test plan contents](#test-plan-contents), [Test case fields](#test-case-fields) |
| Evidence per requirement | Acceptance criteria, TC IDs, and the linked-evidence rule | [Acceptance criteria and test case IDs](#acceptance-criteria-and-test-case-ids) |
| The reviewer-facing artifact | One row per FR and NFR, grouped under the BR or PO it serves, with links and run results | [The traceability view](#the-traceability-view) |
| When something is done | Tiered by milestone, so environment evidence is never demanded before it can exist | [Definition of done](#definition-of-done), [Milestone exit criteria](#milestone-exit-criteria) |
| Quality properties under commitment | Thirteen NFRs, four of which can fail a build without any product code being wrong | [Non-functional requirements](#non-functional-requirements) |
| Terms that must not be used loosely | `under load`, `comparable runs`, `baseline`, `reproducible setup`, `recorded environment` | [Operational definitions](#operational-definitions) |
| What is not promised | Every deliberate limitation, and every assumption with its failure consequence | [Limitations and assumptions](#limitations-and-assumptions) |

### Extending the strategy

- **Adding a check:** put it at the lowest level that can hold it and say why the level above cannot. Give it a requirement ID and a TC ID, and add it to the traceability row. If it makes a higher-level test redundant, delete that test in the same change.
- **Adding a level or a tool:** it needs a job no existing level or tool already does. Record the choice and its tradeoff in [Tooling](#tooling), add a row here, and give it a *Demonstrates* line in [Test strategy](#test-strategy).
- **Adding a metric:** it goes in [What is measured](#what-is-measured) with what decision it informs. It is published, not gated — a gate needs a spec change and a decisions-log row.
- **What never changes without a logged decision:** determinism, the absence of retries, the lowest-level rule, the no-claim-beyond-evidence rule, and the refusal to gate on a published metric.

## Development strategy

*How the work is done and judged: test-first discipline, the test levels, the standards and their tooling, what is measured, what is delivered, in what order, and when a requirement is done.*

### Development approach

Development is test-first at every level. TDD drives the implementation; BDD specifies end-to-end behavior. Neither discipline adds product scope — they fix the order in which work happens.

#### TDD for development

*Serves:* [PO-001](#business-requirements-and-project-objectives).

Unit and integration code is written in red–green–refactor cycles.

1. **Red** — write the smallest failing test that states one piece of required behavior.
2. **Green** — write the least production code that passes it. No speculative abstraction.
3. **Refactor** — clean up with the suite green, changing no behavior.

Rules for this project:

- No production code without a failing test that required it, apart from trivial wiring such as configuration, imports, and generated code.
- Tests are named after behavior, not implementation, and reference the requirement ID they serve.
- The invariant-heavy logic is written test-first without exception: slot generation and filtering, input validation, booking state transitions, the cancellation cutoff with an injected clock, and idempotency key/payload rules.
- Database- and network-dependent behavior is driven at the integration level against a real test database, still test-first. Do not pull it down into unit tests with mocks that assert implementation details.
- An API change starts in `contracts/openapi.yaml`, then the contract test, then the implementation.
- A defect fix starts with a failing test that reproduces it. That test is linked in the bug record and kept as the regression test.
- A red–green–refactor cycle is a reasonable commit boundary.

#### BDD for end-to-end tests

End-to-end behavior is specified as Gherkin scenarios in feature files before the automation that runs them, and where practical before the feature is built. The scenarios are the acceptance criteria for their requirements.

- One `.feature` file per capability: view slots, book a slot, prevent duplicate bookings, retrieve and cancel a booking, staff schedule and completion, idempotent retry.
- Tag each feature or scenario with its requirement ID, for example `@FR-003`. Tags are the traceability link from scenario to requirement.
- Gherkin stays in business language. No selectors, URLs, endpoints, status codes, or database details in a step — those belong in the step definitions.
- `Given` seeds state, `When` performs a user action, `Then` asserts an observable outcome. Prefer one user intent per scenario; several `When` steps usually mean the scenario covers more than one behavior.
- `Background` holds shared seeded state such as business hours, the 7-day window, and the fixed clock. Scenario Outlines cover boundary variations such as cancelling just before and just after the appointment start time.
- Scenarios are deterministic: fixed seed data and a controllable clock, never dates computed from the system time at run time.
- Step definitions are thin — they call page objects or API helpers and assert. No business logic in steps, and nothing duplicated from the backend rules.
- BDD stops at the E2E level. Do not write Gherkin for unit or integration tests; TDD covers those.

Example feature file:

```gherkin
# e2e/features/book-a-slot.feature
@FR-002
Feature: Booking an available slot

  Background:
    Given the business is open weekdays from 09:00 to 17:00 in the configured time zone
    And the current time is fixed at 2026-01-05 08:00 local time
    And the 10:00 slot on 2026-01-05 is available

  Scenario: Customer books an available slot
    Given I am on the booking page
    When I book the 10:00 slot on 2026-01-05 as "Ada Lovelace" with email "ada@example.com"
    Then I see a confirmation with a confirmation code
    And the 10:00 slot on 2026-01-05 is no longer offered

  @FR-003
  Scenario: A slot that is already booked cannot be taken twice
    Given the 10:00 slot on 2026-01-05 is already booked
    When I try to book the 10:00 slot on 2026-01-05
    Then I am told the slot is no longer available
    And exactly one active booking exists for that slot
```

#### Engineering standards as artifacts

*Serves:* [PO-005](#project-objectives). *Verified by:* [NFR-012](#non-functional-requirements). *Delivered in:* [milestone 0](#delivery-milestones), before any product code.

The standards this project works to are written as artifacts a tool can load and a check can fail, rather than as prose a reader is trusted to remember. The skills shape how work is done; the review agents read what was done.

**This table is the authoritative list of the set.** Nothing else in this document states how many there are — every other mention says *every skill and every review agent listed here*, so adding or removing one is an edit to this table and nowhere else. The set was previously fixed at four and four; that number was stated in nine places, which is precisely the duplication `spec-authority` exists to catch.

**When a new artifact is justified.** An artifact earns its place when **withholding it would make a process outcome non-deterministic or unevidenced** — not when it would merely be tidy. The test has its own governor: every skill must carry an eval suite with at least one eval **proven to fail when the skill is withheld**, so an artifact whose value cannot be demonstrated cannot be added. A proposed artifact that fails that test belongs inside an existing one. Adding or removing a row needs a [decisions-log](#context-and-decisions-log) entry naming the process outcome it makes deterministic.

Every review agent has an authoring counterpart among the skills, because an agent reviewing against a standard that no artifact authors to is an opinion rather than a check.

| Artifact | Kind | Job |
| --- | --- | --- |
| `code-standard` | skill | Naming, module structure, the pinned error shape, the closed `issue` code list, the rule that a new issue code reaches the spec and the contract before a call site, and the Java 25 idiom this codebase expects — records, sealed types, and pattern matching where they replace an older construct, with virtual threads not adopted until a decisions-log row says so. |
| `tdd-cycle` | skill | Red–green–refactor as described above: no production code without a failing test that required it, tests named for behavior and carrying their requirement ID, commits at cycle boundaries. |
| `java-patterns` | skill | The patterns this codebase actually uses — ports and adapters, repository, transactional outbox, the fenced lease, the idempotency store — and the ones it refuses, so an abstraction arrives when a second caller does. |
| `spec-authority` | skill | Where each kind of statement lives, that the behavior specification wins any conflict, that rules are cited by number rather than restated, and that a rule needing an edit in three places was duplicated. |
| `secure-coding` | skill | Credential handling at the edge, the identical not-found discipline, and telemetry redaction at the call site — the authoring side of [NFR-005](#non-functional-requirements), [NFR-006](#non-functional-requirements), and NFR-010's redaction half. It authors against the scanners; it is never a second gate beside them. |
| `deterministic-tests` | skill | The authoring side of [NFR-001](#non-functional-requirements): an injected clock and never a system-clock read, fixed seed data, a bounded condition with a fixed timeout and a recorded attempt count in place of any sleep, no order dependence, no shared mutable state between tests, and no retry anywhere. |
| `escalation-protocol` | skill | What to do when the specification does not answer the question: stop and raise an issue rather than choose a plausible default. Names the cases where escalation is mandatory — an undocumented status or `issue` code, a BR that would have to be narrowed, a rule apparently needing an edit in three places, a stack or dependency change, a threshold or percentage, a requirement with no parent or no child — and the shape an escalation takes. **This skill is the single statement of that contract**; every other skill carries a one-line pointer to it rather than a copy. |
| `requirement-docs` | skill | The shape of `docs/requirements/FR-0NN.md` and `NFR-0NN.md`: acceptance criteria, the verification plan, `TC-FR-<number>-<sequence>` IDs, the linked behavior-specification subsection, and — for an NFR — its learning objective and minimum-evidence floor. It writes no requirement and owns no parentage; both belong to the [requirement tables](#requirements-and-traceability). |
| `test-design` | skill | Choosing the level before writing the check: each level's job and *Demonstrates* line from [Test strategy](#test-strategy), the rule that a check goes at the lowest level that can hold it, and that redundant breadth is a defect rather than extra safety. The authoring counterpart to `test-layering-reviewer`. |
| `standards-reviewer` | review agent | Reads a diff against the code standard and the decisions log, and reports anything that contradicts a `Current` decision. In a second, scheduled, non-diff mode it compares `Current` decisions against present industry practice and emits proposals with draft log rows — never a pull-request finding, and never reopening a decline whose recorded reason still holds. |
| `stability-reviewer` | review agent | Hunts the determinism breaches [NFR-001](#non-functional-requirements) bans: an inline clock read, a sleep used as synchronisation, a retry setting, order dependence, shared mutable state between tests. |
| `test-layering-reviewer` | review agent | Flags a check placed above the lowest level that could hold it, and redundant breadth, which [Test strategy](#test-strategy) treats as a defect rather than extra safety. |
| `traceability-auditor` | review agent | Checks parentage in both directions — an FR or NFR with no parent, a BR or PO with no child — and rows missing a link or a run result. |
| `security-reviewer` | review agent | Reads a diff for the breaches `secure-coding` authors against: a credential or confirmation code reaching a log line, a response body, a report, or a span attribute; a not-found response distinguishable from its siblings; an unredacted customer datum in telemetry. Advisory, like every agent here; the scanners stay the only security gate. |

Each skill carries an eval suite that runs in CI, and one eval per skill is proven to fail when the skill is withheld: a suite that passes without its skill is measuring the model, not the artifact. The review agents run on every pull request and their findings are recorded there, including the runs that find nothing. The automated checks remain the gate; a review agent's finding is advice, and it never blocks a merge by itself.

#### AI-assisted SDLC

*Serves:* [PO-005](#project-objectives).

AI is used to author and to review. It is never used to judge inside the gate, because [NFR-001](#non-functional-requirements) requires the same verdict for the same inputs and an LLM-evaluated assertion cannot promise that.

- **May be drafted by AI, then reviewed by a human before commit:** requirement and acceptance-criteria documents, test plans and test cases, Gherkin scenarios, test code, production code under `tdd-cycle`, chart and pipeline configuration, and documentation. The prompt used is recorded beside the artifact it produced.
- **May never be decided by AI:** anything in [Behavior specification](#behavior-specification), the [business rules](#business-rules), the requirement tiers and their parentage, the contents of the [decisions log](#context-and-decisions-log), and whether a requirement is done. These are owned by the stakeholder seat or the architect seat, and a generated change to one of them is a proposal until a human accepts it.
- **In the pipeline:** an AI review step comments on every pull request, alongside the review agents. Its output is advisory and labelled as such. No AI step can pass or fail the build.
- **Recorded in `docs/ai-sdlc.md`:** what AI drafted, what reviewed it, what it may never decide, and the one honest limitation — that none of this makes a generated artifact correct. It makes the human gate visible.

### Test strategy

Unit, integration, and contract tests are written before the code they cover. End-to-end behavior is written as Gherkin scenarios before the automation that runs it.

Each level has one job, stated below as what it demonstrates. A check belongs at the lowest level that can hold it. A higher-level test that re-asserts a rule a lower level already pins, without adding integration risk, is deleted rather than kept for comfort — the breadth here is meant to be deliberate, not decorative, and a reviewer should be able to see why each layer exists.

#### Frontend unit tests

*Demonstrates:* that presentation and client-side rules are testable without a browser, a server, or a clock.

Test small frontend logic in isolation:

- Required-field and email validation at the exact limits in [Input validation](#input-validation).
- Optional reason length validation, including the whitespace-only case stored as absent.
- Slot date/time formatting in the configured time zone.
- Booking and cancellation state presentation.
- Idempotency key reuse for retries of one logical submission.

#### Backend unit tests

*Demonstrates:* that the invariants are expressed as pure functions over an injected clock, so every boundary is cheap to test exhaustively.

Test business rules without the database or network:

- Slot generation and filtering, keeping "is this a generated slot start" separate from "is it bookable now".
- Booking input validation.
- Allowed booking state transitions.
- Cancellation cutoff behavior using a controllable clock.
- Idempotency key and payload rules, including the canonical payload form and the omitted-versus-empty `reason` case.
- The expiry boundary at `createdAt + 24h`, on both sides and exactly on it.
- Which availability version a state change bumps, and whether a cached entry's stamp permits it to be served, as pure functions of the change and the configured zone.
- The event envelope built from a committed change: one event per change, `occurredAt` from the injected clock, canonical stored values in `data`.

#### Frontend integration tests

*Demonstrates:* that the UI handles the backend's real answers — including the unhappy ones it cannot prevent, such as a slot taken between render and submit.

Render frontend components or pages with a controlled API client or mocked HTTP responses:

- Slot list loading, empty, and error states.
- Booking form validation and submission.
- Slot no longer available response.
- Booking confirmation and cancellation messages.
- Retry after a simulated timeout preserves the idempotency key.

#### Backend integration tests

*Demonstrates:* that the invariants survive a real database, real transactions, and concurrency — the part no unit test can honestly claim.

Run the API with a real test database:

- Create and retrieve a booking.
- Confirm a booked slot is no longer available.
- Cancel a booking and confirm the slot is offered again in the same window.
- Cancel a seeded future booking whose slot sits beyond the window, confirm the cancellation succeeds and the slot stays absent from the slots view, then advance the clock until the window covers it and confirm it is offered.
- Confirm an unknown, a malformed, and a wrong-length confirmation code return identical responses.
- Verify staff authorization, the schedule date range, and each completion rejection reason.
- Send duplicate and concurrent booking requests, with the same key and with different keys.
- Confirm the database uniqueness or transaction strategy prevents double booking, not just the application check.
- Confirm a failed attempt leaves its idempotency key unbound, and that a corrected retry with that key then succeeds.
- Confirm a request whose claim was taken over after its lease expired commits no booking, and that a takeover before lease expiry is refused.
- Confirm confirmation-code regeneration is bounded and creates no booking when it is exhausted.
- Confirm a committed booking leaves exactly one outbox row and a rolled-back one leaves none.
- Confirm an idempotent replay commits nothing, writes no outbox row, and publishes no event.
- Confirm the consumer writes one notification record per event id, and that a redelivery of the same event id writes no second record.
- Confirm a message still failing after the attempt limit reaches the dead-letter topic with its payload and reason, and produces no notification record.
- Confirm replaying that dead-lettered event produces exactly one notification record, and that replaying it twice still produces exactly one.
- Confirm a booking, a cancellation, and a completion each bump the affected date's availability version inside the committing transaction, and that a rolled-back change leaves the version untouched.
- Confirm an entry whose stamp matches is served, an entry whose stamp is stale is never served but recomputed, and a planted entry holding wrong slots under a stale stamp cannot reach a response.
- Confirm a failed cache write does **not** fail the request, and that the next read recomputes and answers correctly.
- Confirm a cached read returns byte-identical results to the same read with the cache disabled, for a populated window, an empty window, and a window with a cancellation in it — the equivalence property, asserted directly.
- Confirm the version read and the recomputation share one snapshot: with a booking committing mid-recomputation, the stored entry's stamp matches the list it holds, and is never a stamp labelling later state.
- Confirm the version counter only moves forward and is never reset by a cancellation, a completion, a rollback, or a restart, so a previously cached entry can never match again.
- Confirm an unreachable cache, a cold cache, and a cache miss all produce the same correct answer from the database.
- Confirm staff authorization, range bounds, and defaulting on `GET /api/staff/notifications` match `GET /api/staff/bookings`.
- Assert, through the in-memory exporter, that one committed change emits exactly one producer span event and one consumer span event, that both share the request's trace id, and that no planted confirmation code, token, or fabricated personal datum appears in any exported span, metric label, or log record.

#### Contract tests

*Demonstrates:* that the published contract and the implementation cannot drift apart silently, in either direction.

- Change `contracts/openapi.yaml` first, then write the contract test, then implement. The contract is the starting artifact for an API change, not a document written afterward.
- Validate API requests and responses against the OpenAPI contract.
- Assert response instants carry the configured zone's offset for their date, and that equivalent request offsets, `Z` included, are accepted.
- Check error response shapes and status codes.
- Specify and test the idempotency header, replay behavior, and key/payload conflict.
- Ensure frontend API client expectations remain compatible with backend responses.
- Validate every emitted domain event against `contracts/events/*.schema.json`, and assert the consumer accepts every committed sample payload under `contracts/events/samples/`.
- Replay the committed `v1` samples after any schema change, so a change that would break a deployed consumer fails the build. A new required field is a new schema version, never an edit to an existing one.
- Assert `GET /api/staff/notifications` introduces no status code and no error code outside the [error table](#error-responses).

#### End-to-end tests

*Demonstrates:* that the assembled system delivers the acceptance criteria, in business language a non-programmer can review.

Run the frontend, backend, and test database together in a dedicated test environment. Every E2E test is a Gherkin scenario with step definitions, as described under Development approach.

Core E2E paths, each a scenario in the feature file named beside it:

| # | Path | Feature file | Requirement |
| --- | --- | --- | --- |
| 1 | Customer books an available slot and sees a confirmation. | `book-a-slot.feature` | FR-002 |
| 2 | Customer retrieves the booking with the confirmation code. | `cancel-a-booking.feature` | FR-010 |
| 3 | Staff sees that booking in the schedule. | `staff-schedule.feature` | FR-008 |
| 4 | Customer cancels before the start time; the booking shows cancelled and the slot is offered again. | `cancel-a-booking.feature` | FR-006 |
| 5 | Customer is refused a cancellation once the appointment has started, and the booking stays booked. | `cancel-a-booking.feature` | FR-007 |
| 6 | A second customer cannot take a slot already booked. | `book-a-slot.feature` | FR-003 |
| 7 | A lost response or timeout is retried with the same idempotency key and only one booking exists. | `idempotent-retry.feature` | FR-004 |
| 8 | Staff completes a booking whose appointment time has passed. | `staff-schedule.feature` | FR-009 |
| 9 | Staff sees exactly one notification record for a booking and one for its cancellation. | `notifications.feature` | FR-011, FR-012 |

Paths 4 and 5 are separate scenarios because FR-006 and FR-007 are separate requirements with opposite outcomes; one path covering only the happy cancellation would leave FR-007 without end-to-end evidence. Path 5 is a Scenario Outline over the clock positions in [Cancellation](#cancellation).

Keep the suite at these paths. Behavior a lower level can verify stays at that level: FR-005, the three completion rejection reasons, and every validation limit are verified at the integration and contract levels only.

Path 9 is the one place the suite crosses a service boundary, which is why it is here rather than lower: it is the only check that the browser, `booking-service`, Kafka, and `notification-service` agree in an assembled system. It waits on a bounded condition with a deterministic timeout and a recorded attempt count — never a sleep, and never a retried scenario. Every scenario also injects its own `traceparent`, so each run's trace is linkable from the [traceability view](#the-traceability-view); the dead-letter path, redelivery, and de-duplication stay at the integration level, where their ordering can be driven rather than observed.

#### Load tests

*Demonstrates:* that the correctness invariants hold under real concurrency, not just under a test harness that simulates it.

Keep load tests focused on a few representative behaviors:

- Many clients read available slots, with the cache cold and with it warm, asserting afterwards that no response offered a slot the database shows as booked at that response's own version.
- Clients book different available slots.
- Many concurrent clients attempt the same slot.
- Many duplicate requests use the same idempotency key.
- A burst of bookings whose events must all be consumed: lag returns to zero and each booking has exactly one notification record.

Runs are written as k6 scripts, which are the gate and the source of every recorded baseline; one equivalent JMeter plan covers the same-slot scenario as a second artifact, run locally and non-blocking, so the project shows both tools without maintaining two gates.

Track throughput, error rate, and latency. For the same-slot race, correctness is essential: one booking succeeds, the rest receive the documented unavailable/conflict response, and only one active record exists. Three further assertions are made after every run, by querying state rather than reading the response mix: consumer lag has returned to zero, the dead-letter topic is empty, and the number of notification records equals the number of committed bookings — one per booking, never two. [NFR-002](#non-functional-requirements) pins the numbers — 50 concurrent clients for one slot and 50 sharing one idempotency key — and judges both runs on the database state afterwards, not on the response mix alone.

#### Performance tests

*Demonstrates:* a repeatable measurement discipline, with its environment recorded and its limits stated.

Set a repeatable data volume and baseline for:

- Slot availability response time, cache warm and cache cold, recorded separately — one number covering both would hide the thing the cache exists to change.
- Booking creation response time.
- Duplicate idempotent replay response time.
- Staff schedule response time.
- Notification lag: the interval from a committed booking to its notification record, measured at p50 and p95.

Record environment, data volume, concurrency, and result with each baseline. Avoid treating a local laptop number as a production service-level objective. [NFR-003](#non-functional-requirements) fixes the recorded fields and the only comparison allowed: p95 against the median of three comparable runs, reported above 25% and failing above 50%. `comparable runs` and `recorded environment` have exact meanings under [Operational definitions](#operational-definitions), and a change of machine, runner class, database version, or data volume retires the baseline rather than adjusting it.

### Quality metrics and reporting

*Serves:* [PO-007](#project-objectives). *Verified by:* [NFR-013](#non-functional-requirements). *Arrives in:* [milestone 5](#delivery-milestones), with the first repeatable full-suite runs.

Measuring the suite is a separate skill from writing it, and this section is where that skill is practised. It adds no product behavior and no business rule: every metric below is about the *verification*, never about the appointment business.

**Where each kind of quality statement lives.** Four artifacts, four jobs, and they must not drift into each other's territory:

| Artifact | Holds | Does not hold |
| --- | --- | --- |
| `docs/traceability.md` | **Authoritative** requirement status: parentage, owned rules, links to checks, run results, trace links, defects, definition-of-done tier. | Run history, triage state, metric series. |
| ReportPortal (self-hosted) | Per-test run history across launches, failure clustering, and the triage state of a failure — product defect, automation defect, environment issue, or to-investigate. | Requirement status. A requirement is never "done" because a portal launch is green. |
| Allure report, published to Pages | The human-readable report for one run, with its trend, readable by anyone with the link and no account. | Anything a reviewer must log in to see, and anything asserted. |
| Grafana | The metric series below, beside the product telemetry, so a quality trend and a system trend are read in one place. | Per-test detail, and any gate. |

If two disagree about whether a requirement is verified, `docs/traceability.md` wins. If two disagree about what happened in a run, the CI run's own record wins, and whichever artifact is wrong is corrected rather than argued with.

#### What is measured

Per test level — frontend unit, backend unit, frontend integration, backend integration, contract, end-to-end, load:

- Test count, pass rate, and failure count.
- Duration at p50 and p95, and the level's share of total pipeline wall-clock time.
- Failures grouped by triage state, so an automation defect is never counted as a product defect.
- Flaky count, which must be **zero** — a non-zero value is already a gate, because a quarantined check blocks the current milestone's exit.
- Checks added per requirement in this change, which is how test-first discipline becomes visible rather than claimed.

Overall quality health:

- **Requirement verification** — functional requirements plus *due* non-functional requirements carrying a linked passing check and a dated run, over the total. An NFR before its milestone is excluded, not counted as a failure.
- **Business-rule coverage** — rules with at least one passing check, over 21. This is a gate at milestone 8 and reads as a number before then.
- **Quarantine count** — quarantined checks, and the requirements they return to not-done. A gate: it must be zero to exit a milestone.
- **Escaped defects**, defined below.
- **Defect-to-regression linkage** — defects whose regression test was written before the fix, over all defects. A gate at milestone 8.
- **Time from first red to green on the main branch**, per defect.
- **Pipeline duration**, total and per stage.
- **Determinism evidence** — consecutive green full-suite runs, and whether the shuffled-order run's seed was recorded.

Automation shape:

- Distribution of checks across levels, read against the rule that a check belongs at the lowest level that can hold it. A level growing faster than the one below it is the signal this metric exists to produce.
- Checks per requirement, and any requirement whose only evidence is end-to-end — which is a smell, not a pass.
- Time to first failure, because a suite that fails fast is cheaper to work against than one that fails late.
- Redundant-breadth candidates raised by `test-layering-reviewer`, counted over time. The intent is for this to fall.

#### Flaky score, without retries

The project forbids automatic retries, so flakiness is not detected by rerunning a test and seeing whether it settles. It is detected by **disagreement across runs at one commit**, using the four runs [NFR-001](#non-functional-requirements) already requires: three consecutive full-suite runs and one with the test order shuffled under a recorded seed.

- A check is **flaky at commit `C`** when its outcome is not identical across all four runs at `C`.
- The **suite flaky score** is flaky checks over total checks, for that commit, published with the commit and the shuffle seed.
- The expected value is zero. A non-zero score names the checks, which are tagged `@flaky`, pulled from the gate, and given a same-day issue linked to their requirement — the existing policy, now with a number attached to it.

This definition costs nothing extra, because the four runs already exist, and it is stricter than a rerun-based score: a rerun asks whether a test *eventually* passes, which is the question a project with no retries has no interest in.

#### Escaped defects, in a project with no production

"Escaped to production" cannot be measured here, because there is no production and never will be. The term is redefined so it stays meaningful rather than being quietly dropped:

- A defect **escaped** when it was found at a level *above* the one that should have caught it — a validation bug found end-to-end, a rule-2 violation found by the load run — or when it was found after its milestone had already exited.
- Each escaped defect records the level that should have caught it and whether a check was added at that level. The second part is what makes the metric useful: an escape that produced a lower-level check is a lesson, and one that did not is a gap.
- Defects found by a review agent or by the scanning gate before merge are **not** escapes. They were caught by the process working.

#### No metric becomes a target

Published quality metrics are read, not gated. The industry's usual thresholds — a flaky rate under two percent, fewer than one escaped defect per release, a coverage or automation percentage — are deliberately **not** adopted here, for exactly the reason [NFR-003](#non-functional-requirements) refuses to turn a laptop measurement into a service level: a number invented to look respectable in a document teaches nothing, and gating on it creates pressure to make the metric move rather than to make the suite better.

The gates stay the ones this project already had, every one of them binary and already justified elsewhere: zero quarantined checks, every business rule 1–21 standing against at least one check, every traceability row carrying a link and a run result, and every defect linked to a regression test written before its fix. Adding a numeric gate to any metric in this section requires a spec change and a decisions-log row, and the burden is to say what decision the number would improve.

### Quality standards

"Robust" here means evidence, determinism, and honesty about limits. It does not mean a coverage number, and the standards below are only the ones this project intends to demonstrate. Each is carried by a [non-functional requirement](#non-functional-requirements) with the same evidence discipline as a requirement; the IDs in brackets say which row holds the evidence.

- **No coverage percentage gate.** The gate is the traceability view: every requirement links to passing checks, and every business rule 1–21 names at least one check at the lowest level that can hold it. Coverage is measured and published because it finds untested branches, but no build fails on a percentage. (NFR-009)
- **Determinism is a hard requirement.** Fixed seed data, an injected clock, no date derived from the system clock at run time, no sleep used as synchronisation, no order dependence between tests, no shared mutable state across tests. A test that needs a sleep to pass is a defect in the test. (NFR-001)
- **No automatic retries.** Neither CI nor the E2E runner retries a failed test. A retry turns a flake into a green build and destroys the signal this project exists to practise. (NFR-001)
- **Flaky tests are quarantined, not tolerated.** A test that fails and then passes with no code change is tagged `@flaky`, removed from the gate, and given an issue the same day, linked to the requirement it was verifying. That requirement stops being done while its check is quarantined.
- **A quarantine blocks a milestone exit.** A milestone does not exit while any test verifying one of its requirements is quarantined. Because quarantine returns that requirement to not-done, a quarantine over an *earlier* milestone's requirement also blocks the current milestone's exit — flakiness cannot be deferred by moving on. The only ways out are a fix, or deleting the test and replacing the evidence it was providing.
- **Load results are judged on correctness first.** Under the same-slot race, exactly one active booking and the documented conflict code for every other caller is a pass/fail gate. Metrics are recorded as baselines with environment, data volume, and concurrency. A numeric regression gate is introduced only once three comparable runs establish a baseline, and is expressed as a change against that baseline — never as a service-level objective. (NFR-002, NFR-003)
- **No claim beyond the evidence.** A requirement with code but no passing linked check is reported as unverified, in the traceability view and in the README. (NFR-009)
- **The gate is deterministic, so nothing AI-evaluated sits inside it.** An AI review step and the review agents comment on a pull request; neither can pass or fail the build. A generated artifact is a proposal until a human accepts it, and the behavior specification, the business rules, the requirement tiers, and the decisions log are never AI's to decide. (NFR-001, NFR-012)
- **Standards are artifacts, not habits.** The code standard, the TDD cycle, the design patterns, and the review passes exist as skills and review agents whose own eval suites run in CI, with one eval per skill proven to fail when the skill is withheld. Formatting, linting, static analysis, contract linting, chart linting, secret scanning, dependency scanning, and image scanning each fail a pull request on a planted violation. (NFR-012)
- **Telemetry is asserted in-process.** Observability claims are checked through an in-memory exporter inside the test, never by querying a hosted backend, because a network call and an ingestion delay inside the gate would break determinism. The hosted backend carries shared-environment and load data and supplies the links a traceability row cites. (NFR-001, NFR-010)
- **Quality metrics are published, never gated.** The gates are the binary ones that already exist: zero quarantined checks, every rule 1–21 checked, every traceability row linked, every defect carrying a regression test written before its fix. No borrowed threshold — a flaky rate, an escape count, a coverage or automation percentage — becomes a gate without a spec change and a decisions-log row saying what decision the number improves. (NFR-013)
- **Flakiness is measured without retries**, as disagreement across the four same-commit runs NFR-001 requires. The expected score is zero, and a non-zero score names its checks. (NFR-001, NFR-013)
- **No sleep, no time-to-live, no scenario retry as a synchronisation mechanism** A cross-service check polls a bounded condition with a deterministic timeout and a recorded attempt count, and fails rather than retrying the scenario. A test that passes because a cache entry expired or a consumer happened to catch up is a defect in the test. (NFR-001, NFR-011)

### Bug tracking, test plan, and test cases

Start with repository issues for bug tracking and Markdown files for the test plan and test cases. This is enough for a small learning project and keeps the records reviewable alongside code.

#### Bug record fields

- Bug ID and concise title.
- Requirement ID(s).
- Environment/build/commit.
- Preconditions and test data.
- Reproduction steps.
- Expected and actual result.
- Severity/priority.
- Evidence such as logs, screenshots, request/response details.
- The failing regression test written before the fix, and its link.
- Status and resolution.

#### Test plan contents

Create a concise MVP test plan with:

- Scope and exclusions.
- The business requirements in scope, the functional requirements under test, and the non-functional requirements due at the current milestone.
- Test levels and test types.
- Test-first approach: TDD at the unit and integration levels, Gherkin scenarios at E2E.
- Environment and test data, and which definition-of-done tier currently applies.
- Risks, including double booking and retry behavior.
- Reliability policy: determinism rules, no automatic retries, and flaky-test quarantine, as set out in [Quality standards](#quality-standards).
- Entry and exit criteria, pointing at the current milestone's exit criteria.
- Execution and defect reporting approach.

#### Test case fields

- Test case ID and title.
- Linked requirement ID(s).
- Preconditions and test data.
- Steps.
- Expected result.
- Automation level or test layer, and for E2E cases the feature file and scenario name.
- Execution status and evidence link.

### What each platform addition buys

The platform around this product is broad, and a reader is entitled to ask what each piece of it earns. This section is the answer, and it is the single place that answer lives. It sits here, rather than in the introduction, because a reader who has not yet met the product cannot judge what a piece of the platform around it is worth.

**It is not a stretch tier.** Every milestone from 0 to 8 is mandatory, the single completion point stays at the end of milestone 8, and the [core-versus-stretch split declined earlier](#context-and-decisions-log) stays declined. The removal order in the last column exists so that a decision to trim, if one is ever taken, is taken with the cost of each cut visible — not because anything below is optional today.

| Addition | What it earns, in evidence | Cost | If trimmed |
| --- | --- | --- | --- |
| Quality metrics and the flaky score | A flaky score derived from disagreement across the four same-commit runs, which teaches that flakiness is a property of a commit rather than of a rerun. Near-zero infrastructure: the runs already exist. | Lowest of any addition here. | Keep last. |
| The lint, static-analysis, and scanning gate | Gates proven to fail on a planted violation of each kind, which is the difference between a configured scanner and a demonstrated one. | Low, and mostly one-time. | Keep last. |
| `notification-service` and the event log | The only addition that creates **new classes of test** rather than more of the same: asynchronous assertion, at-least-once delivery, an idempotent consumer, dead-letter recovery, and a contract verified from both ends. Every other item here deepens an existing skill; this one adds skills. | Moderate: a second deployable, a broker, a second database. | **Never.** Removing it would return the project to a single-service suite and delete five test classes. |
| Telemetry as a test oracle | An assertion technique the project would otherwise not practise — asserting on emitted spans and metrics through an in-memory exporter — plus the redaction tests that prove nothing sensitive is recorded. | Low to moderate; instrumentation is largely declarative. | Late. |
| Skills, review agents, and their evals | Standards that can be executed and can fail, with one eval per skill proven to fail when the skill is withheld. The AI-assisted workflow with a recorded human gate is the part the reference roles ask about and the part most often merely claimed. | Moderate, and front-loaded into milestone 0. | Late. |
| Helm and the `kind`-in-job environment | Reproducible setup and a disposable environment per run — [PO-003](#project-objectives), which predates every addition on this list. | Moderate. | Late. |
| The persistent k3d cluster with ArgoCD | What makes [NFR-008](#non-functional-requirements) mean something: environments that outlive the job that created them, so a teardown can genuinely leak and a sweep has something to find. Plus a pull-based GitOps deployment. | **Highest ongoing cost on this list** — a cluster that must stay healthy, unlike everything else, which is created and destroyed per run. | Fourth to go. Teardown evidence reverts to in-job lifecycle, and NFR-008's failed-run and cancelled-run proofs weaken accordingly. |
| The self-hosted reporting portal | Run history across launches and a failure-triage workflow. Genuinely useful, but the readable per-run report and every metric are already covered by the published report and the dashboards. | Six to eight containers to deploy and operate. | **First to go.** [NFR-013](#non-functional-requirements) would narrow to the published report plus the metric series, losing cross-launch history and triage state. |
| The availability cache | One coherency invariant — rule 21 — and the equivalence property under concurrency, which rule 3 would otherwise never be tested against. Its performance benefit at this data volume is [deliberately not asserted](#availability-cache). | Low to run, and one rule plus its tests to maintain. | Third to go, with rule 21, its tests, the cold-and-warm load behavior, and one measurement. |
| The second load tool | Breadth: the same scenario expressed in a second, widely used tool. Already non-blocking, and already not the gate. | Lowest value per unit of maintenance on this list. | Second to go, with no loss of evidence at all. |

Read the table as a statement of proportion rather than of priority: the first five rows are where the quality-engineering learning actually sits, and the last three are where this project would be trimmed first if it ever had to be.

### Portfolio deliverables

The product is small on purpose; the verification work is what a reviewer is meant to see. These artifacts make it visible and are deliverables in their own right. Keep each one short — a reviewer reads a page, not a manual.

| Deliverable | Location | What a reviewer should get from it in two minutes |
| --- | --- | --- |
| README and setup guide | `README.md` | The entry point for a reader who has not opened the specification: what the product does, what the project demonstrates, how to run it, how to run each test level, where the reports are, and what is not yet verified. It **links into** the specification and the traceability view for every claim and restates no rule of its own, so there is one orientation document rather than two. |
| Architecture and decisions notes | `docs/architecture/`, plus this file's decisions log | The shape of the system and why each decision went the way it did, including the options rejected. |
| Test strategy and traceability view | `docs/test-plans/mvp-test-plan.md`, `docs/traceability.md` | Which level verifies what, and business need to requirement to implementation to check to result in one table. |
| CI test reports | published run artifacts | That the whole suite runs green unattended at every level, with the Gherkin scenarios readable as acceptance criteria. |
| Design notes on the hard parts | `docs/design-notes.md` | How double booking, idempotent replay, the injected clock, the transactional outbox, the cache invalidation rule, and the test layering were solved, and what each choice cost. |
| Observability evidence | hosted dashboards, plus `infra/observability/` | One booking as one trace from browser to notification record, the required metrics, and the trace link each E2E run records — with the assertions that make them evidence rather than decoration. |
| Deployment charts | `charts/` | That both services, the frontend, and their infrastructure install from one umbrella chart, lint clean, and run identically in every environment. |
| Quality metrics and reporting | the portal, the published Allure report, the quality dashboard, `docs/quality/` | Pass rate, duration, and flaky score per level; requirement verification and rule coverage overall; the flaky score with its commit and seed; and the stated refusal to turn any of it into a target. |
| Engineering-standards tooling | `.claude/skills/`, `.claude/agents/`, `.claude/evals/`, `docs/ai-sdlc.md` | That the standards are executable artifacts with their own passing checks, and exactly where the human gate sits in an AI-assisted workflow. |

### Delivery milestones

| Milestone | Product increment | Verification increment |
| --- | --- | --- |
| 0. Foundation | No product behavior. The monorepo, the Gradle and pnpm builds, both service skeletons, the frontend shell, the contract files, and the base Helm chart. | Every skill and review agent listed in [Engineering standards as artifacts](#engineering-standards-as-artifacts), with an eval suite each; the full lint, static-analysis, secret-, dependency-, and image-scanning gate; the CI pipeline; telemetry wiring. |
| 1. View slots | Seeded availability displayed in the frontend, read through the availability cache. | FE/BE unit tests, API integration test, cache-invalidation and cache-coherency tests, the telemetry baseline and its redaction assertion. |
| 2. Book a slot | Booking creation, validation, confirmation, and lookup. | FE and BE integration tests; first booking E2E test; telemetry assertions on the committed change. |
| 3. Prevent duplicates | Double-booking protection and idempotency. | Contract coverage, duplicate and concurrency tests, retry E2E. |
| 4. Manage bookings and notify | Customer cancellation, staff schedule, staff completion, the transactional outbox, `notification-service`, and the staff notification view. Product behavior is complete here. | State-transition, permission, boundary, and workflow tests; outbox, redelivery, replay-publishes-nothing, and dead-letter tests; the event contract verified on both sides. |
| 5. Reliable test setup | Helm umbrella chart; the shared k3d and ArgoCD environment; seed and reset process; the reporting portal deployed there. | Repeatable full E2E suite from one command, chart linting, CI reports at every level, and the first published quality metrics and flaky score. |
| 6. Disposable environments | Per-pull-request environment lifecycle, in the CI job and in the shared cluster. | Create, seed, test, collect evidence, tear down, and sweep. |
| 7. Non-functional checks | No product change. Focused load and performance scenarios. | Recorded baselines, repeatable k6 runs, and the post-run state assertions. |
| 8. Traceability and defects | No product change. Requirements, plan, cases, defects linked to code, tests, traces, and runs. | Verify every requirement has implementation and test evidence. |

#### Milestone exit criteria

A milestone is not exited until every row below is true. Each is an artifact or a result someone else can check. The bracketed IDs on milestones 5 to 8 name the [project objective](#project-objectives) that milestone's verification work exists to demonstrate; a row that would pass without demonstrating it is the wrong row.

| Milestone | Exit criteria |
| --- | --- |
| 0 | *(PO-005)* `docs/requirements/NFR-012.md`; the monorepo builds both services, the frontend, and the E2E package from one Taskfile command; `contracts/openapi.yaml` and `contracts/events/` exist with the shapes milestone 1 needs; every skill and review agent listed in [Engineering standards as artifacts](#engineering-standards-as-artifacts) committed with an eval suite each, green in CI, and one eval proven to fail when its skill is withheld; the review agents run on a pull request and record their findings, including a clean run; the lint and scanning gate proven to fail a pull request on a planted violation of each kind — formatting, static analysis, contract lint, chart lint, a committed secret, and a vulnerable dependency; `docs/ai-sdlc.md` naming what AI may draft and what it may never decide; OpenTelemetry wired in both services with the in-memory exporter available to tests; the base Helm chart linting clean. No product behavior ships in this milestone, and none is claimed. |
| 1 | `docs/requirements/FR-001.md` and `docs/requirements/NFR-010.md` with acceptance criteria and TC IDs; `@FR-001` scenario green; slot generation and filtering unit tests covering the window bounds, weekends, and the `slotStart > now` boundary; `GET /api/slots` integration tests for populated, empty, and invalid windows; the endpoint and `validation_error` in `contracts/openapi.yaml`; cache tests asserting that each state change bumps the affected date's availability version inside the committing transaction, that a rolled-back change leaves it untouched, that a stale-stamped entry is never served, that a planted wrong entry under a stale stamp cannot reach a response, that a failed cache write does not fail the request, and that an unreachable, cold, or missing cache still answers correctly from the database; telemetry tests asserting one trace spans frontend and `booking-service`, and that a planted confirmation code, token, and fabricated personal datum reach no span, metric label, or log record; a published CI run. |
| 2 | Requirement docs for FR-002 and FR-010; booking and lookup scenarios green; validation unit tests at every limit in [Input validation](#input-validation), including whitespace rejected anywhere in the email and unknown body fields rejected; FE integration tests for loading, empty, error, and slot-unavailable states; contract tests for the `201` body and the `400` shape; the booking endpoint's error precedence walked end to end, including a schedule-conforming start at exactly `now` and one in the past (`slot_unavailable`, reason `not_in_future` for both) against a non-schedule start such as 10:07 or a Saturday (`slot_not_found`); identical not-found responses asserted; the code-collision path proven with a stub generator that always collides, leaving no booking; `docs/requirements/NFR-006.md`, with the three not-found responses asserted identical, a contract test that no customer schema exposes the booking `id`, and an assertion that no confirmation code reaches a log line. |
| 3 | Requirement docs for FR-003, FR-004, FR-005; the claim-fencing race in both orderings, asserting a taken-over request writes no booking and a premature takeover is refused; a concurrent same-slot test asserting exactly one active booking at the database level; a same-key race test; replay returning the stored status and body with `Idempotent-Replay: true`; replay-after-cancellation and expiry-boundary tests at `+24h - 1s`, `+24h`, `+24h + 1s` on the injected clock; a test that a failed attempt leaves its key unbound and a corrected retry with the same key succeeds; canonical-form tests for omitted versus empty `reason`, differently cased email, and re-encoded JSON; all four idempotency and slot error codes in the contract; retry scenario green; `docs/requirements/NFR-004.md`, with a unit test asserting the claim lease exceeds the request timeout by reading both from configuration rather than restating the literals. |
| 4 | Requirement docs for FR-006 to FR-012 and `docs/requirements/NFR-011.md`; cancellation and completion boundary tests at `slotStart - 1s`, `slotStart`, and `slotStart + 1s`, asserting the start instant refuses cancellation and permits completion; the three `booking_not_completable` reasons; the `401` path; cancel-before, cancel-after, staff schedule, and staff completion scenarios green; slot re-offered after cancellation asserted end to end, including a seeded out-of-window future booking that frees its slot in state before the window reaches it; `docs/requirements/NFR-005.md`, with a rejected staff request leaking no part of the token into its body or logs, a secret scan over the working tree and the published reports, and `.env` asserted git-ignored; the staff range cap tested at 31 and 32 days, closing NFR-004; the outbox asserted to leave exactly one row on a commit and none on a rollback; a redelivery of one event id writing no second notification record; an idempotent replay publishing no event at all; a poison message reaching the dead-letter topic with its payload and reason and producing no notification record; that dead-lettered event replayed once, and again, yielding exactly one notification record; every emitted event validated against `contracts/events/`, the consumer accepting every committed sample, and the `v1` samples replayed as the backward-compatibility check; `GET /api/staff/notifications` matching the staff schedule's authorization, range bounds, and defaulting, and introducing no new status or error code; the notification scenario green end to end on a bounded wait with a recorded attempt count. Product behavior is complete at this point; nothing after this milestone adds a feature. |
| 5 | *(PO-001, PO-003)* Requirement docs for NFR-001 and NFR-007; one documented command installs, migrates, seeds, resets, and runs the full suite from a clean checkout, and survives being run twice in a row; the Helm umbrella chart installs both services, the frontend, Postgres, Redis, and Kafka, with `helm lint`, chart-testing, and kubeconform green; the shared k3d environment reconciled by ArgoCD runs the built frontend, both services, and isolated infrastructure with deterministic seed data, and the E2E run against it records its trace link; CI publishes reports for every level; zero quarantined tests; three consecutive green full runs with no retries, plus one green run with the test order shuffled under a recorded seed; the banned-pattern check failing on an inline clock read, a sleep in a test, and a runner retry setting; `docs/requirements/NFR-013.md`; the reporting portal deployed to the shared cluster by its chart and receiving a launch from every level, with a failed publish proven not to fail the run; an Allure report published and readable without an account; the per-level and overall metric series emitted and visible on the quality dashboard; the flaky score published with its commit and shuffle seed, proven to read zero on the clean suite and to name a deliberately planted non-deterministic check; and a check that fails the build if a published metric is wired as a gate without a decisions-log row permitting it. |
| 6 | *(PO-003)* A pull request provisions an isolated application, database, cache, and broker — in a `kind` cluster inside the job, and as its own namespace in the shared cluster — migrates, seeds known slots, runs the selected checks, publishes reports, and tears down — proven on a passing run, on a deliberately failing run, and on a cancelled run; a repeat run on the same branch is safe; no production data or credentials anywhere in the pipeline; `docs/requirements/NFR-008.md`, with the sweep deleting namespaces older than 24 hours and reporting what it found, including the expected empty run. |
| 7 | *(PO-004)* Requirement docs for NFR-002 and NFR-003; the five load behaviors and six measurements recorded with environment, data volume, and concurrency, on a fixed otherwise-idle host rather than the shared cluster; consumer lag back to zero, an empty dead-letter topic, and one notification record per committed booking asserted after every run; cache-warm and cache-cold availability recorded separately; the same-slot and same-key runs at 50 concurrent clients, each asserting exactly one booking row, no `500`, and no code outside the error table; baselines committed under `docs/performance/` carrying environment, data volume, concurrency, p50, p95, run date, and commit, labelled as local measurements rather than service-level objectives; a numeric gate only once three comparable runs establish a baseline. |
| 8 | *(PO-002)* `docs/traceability.md` complete for FR-001 to FR-012 and NFR-001 to NFR-013 with no unverified row, grouped under BR-001 to BR-009 and PO-001 to PO-007 with each one's roll-up stated, product headings separate from project headings; every FR and NFR naming a parent and every BR and PO naming at least one child, checked in both directions; the traceability check green in CI and proven to fail on a row that lacks a link or a run result; every business rule 1–21 mapped to at least one check; every defect linked to the regression test written before its fix; the README pointing at all nine portfolio deliverables and naming what is not verified; every traceability row's run result agreeing with the published report and the portal launch for that run, with `docs/traceability.md` the authority wherever they do not; and the escaped-defect record naming, for each entry, the level that should have caught it and the check added there. |

Every milestone from 1 onward keeps the same rhythm: write or update the Gherkin scenarios for the new user-visible behavior, add the failing unit and integration tests, then make them pass. Milestone 0 is the exception and ships no scenarios, because it ships no behavior — its output is the build, the gate, and the standards tooling that every later milestone is held to. Milestone 1 introduces the first feature file and step-definition harness; milestones 2–4 add the scenarios for booking, lookup, duplicate prevention, cancellation, staff schedule, staff completion, and notification records. Milestones 5–8 add no new scenarios of their own — they make the existing suite reliable, disposable, measured, and traceable.

#### Delivery plans

The exit criteria above say what must be true to leave a milestone. They deliberately do not say in what order the work is taken, what depends on what, or which decisions the milestone must take before it can proceed — and milestone 0 is almost entirely dependency-ordered, since the gate cannot be proven to fail before a pull request exists and no eval suite can run green before CI does. That ordering is a **delivery plan**, one per milestone at `docs/milestones/milestone-NN.md`, written at the start of the milestone it covers — the same schedule a requirement document follows, and for the same reason: a plan for work nobody has looked at yet goes stale before it is read.

A delivery plan holds sequencing, dependencies, the decisions the milestone must take, and the risks it carries. It is **subordinate to the exit criteria above**, which stay the authoritative statement of what a milestone owes, and it restates no rule, no requirement, no acceptance criterion, and no status or error code — it cites them. Where a plan disagrees with this document, this document wins and the plan is the defect. A plan is also neither a test plan nor an acceptance-criteria document: those are `docs/test-plans/` ([Test plan contents](#test-plan-contents)) and `docs/requirements/` ([Acceptance criteria and test case IDs](#acceptance-criteria-and-test-case-ids)).

A plan is drafted like any other document here — AI may write it and a human accepts it ([AI-assisted SDLC](#ai-assisted-sdlc)) — and it may never decide whether a requirement is done. Milestone 0's plan is `docs/milestones/milestone-0.md`.

#### Completion point

**Two different questions, two different answers.** The booking *workflow* is feature-complete at the end of milestone 4: view, book, look up, cancel, staff schedule, staff completion, and the notification record for each change, with no product behavior added after that point. The *project* is complete at the end of milestone 8. Milestones 5 to 8 add no product features at all — they make the existing suite reliable, disposable, measured, and traceable — so a reader should not mistake the load, performance, environment, and traceability work for application requirements: it serves [PO-001 to PO-007](#business-requirements-and-project-objectives), not the business.

Saying that does not make any of it optional. All nine milestones, 0 to 8, are in scope, run in order, and **the project is complete at the end of milestone 8** — still the single completion point. Milestone 0 was added in front rather than at the end so that the standards, the gate, and the review tooling exist before the first line of product code is held to them; adding it changed no later milestone's number, so every reference to a milestone elsewhere in this document still means what it meant. Milestones 6 and 7 are each a sizeable piece of work in their own right, and milestone 8 deliberately comes last so the traceability pass can include their evidence: the disposable-environment run and the recorded baselines are part of what the final traceability view links to.

Until a milestone is exited, the README states plainly which capabilities exist and which do not, rather than describing the plan as though it were built.

### Definition of done

A requirement is done when:

- Its acceptance behavior is clear and has a stable requirement ID.
- For customer- or staff-visible behavior, that acceptance behavior exists as a Gherkin scenario tagged with the requirement ID.
- The implementation is linked to the requirement.
- Relevant unit, integration, contract, or E2E checks pass in CI, with none of them quarantined as flaky.
- Those checks were written before the implementation they cover, or, for a fix, a failing regression test reproduced the defect first.
- The test case or automated test records the verification.
- Known defects are recorded and linked.
- The environment evidence required at the current milestone, below, is present.

Environment evidence is required from the milestone that introduces the environment, not before. Without this tiering the definition of done would claim evidence that cannot exist in milestones 1 to 4.

| From | Additional requirement |
| --- | --- |
| Milestone 0 | The lint, static-analysis, and scanning gate passes, and every skill's eval suite is green. This tier applies from milestone 0 onward and never lapses: a later milestone that breaks the gate blocks its own exit. |
| Milestones 1–4 | Checks pass locally and in CI against a local test database, with the cache and broker provided by Testcontainers. There is no shared test environment yet, and its absence does not block a requirement from being done. |
| Milestone 5 onward | The change also works in the shared k3d environment reconciled by ArgoCD, against its deterministic seed data, installed from the same Helm chart as every other environment, and its run publishes its report, its portal launch, and its metric series. |
| Milestone 6 onward | The disposable-environment run for the change provisions, seeds, checks, reports, and tears down successfully. |
| Milestone 7 onward | A change to slot availability, booking creation, idempotent replay, the staff schedule, or notification lag is re-measured against the recorded baseline, and the new number is recorded. |

Requirements closed under an earlier tier are not re-opened when a later milestone lands; milestone 5 and 6 instead re-run the whole suite in the new environment, and milestone 8 records which tier each requirement's evidence was gathered under.

A [non-functional requirement](#non-functional-requirements) is done on the same terms — linked, checked, and unquarantined — but only from the milestone that delivers it; before then its row reads *not yet due*. Once due it stays due: a later milestone that breaks NFR-001 or NFR-005 blocks its own exit, even though the requirement that first demonstrated the property closed several milestones earlier.

## Reusable prompts for adding context

Copy the relevant prompt, fill in the bracketed details, and include it when asking for help. These prompts preserve the narrow scope and keep advice traceable to requirements.

### 1. Project context prompt

```text
I am building a small appointment booking project, as a monorepo, for quality-engineering practice.

Project constraints:
- One business, one staff member, and one configured time zone.
- Fixed 30-minute weekday appointments during fixed business hours.
- Customers can view 7 calendar days of availability including today, book, retrieve a booking with its confirmation code, and cancel strictly before the appointment start.
- Staff can view the schedule for a date range, complete a booking once its start instant has been reached, and see the notification record written for each booking change.
- Precise rules for the window, time handling, validation limits, confirmation-code access, cancellation and completion boundaries, idempotency replay, and error codes are in the spec's Behavior specification section. Do not re-invent them.
- The backend must prevent double booking and support idempotent booking creation.
- Two backend services: booking-service is authoritative and publishes domain events through a transactional outbox; notification-service consumes them and writes one notification record per event. A Redis-cached availability view may never offer a slot that has an active booking.
- Telemetry is part of the specification because tests assert on it: one booking is one trace, one committed change emits exactly one event, and no code, token, or customer datum reaches a log line or a span.
- I want FE and BE unit tests, FE and BE integration tests, contract tests over both the HTTP and the event contract, real E2E tests, load and performance tests, and disposable test environments.
- Development is test-first: TDD at the unit and integration levels, BDD/Gherkin scenarios for E2E behavior.
- I also want bug tracking, a test plan, test cases, and traceability from requirements through source code to test evidence.
- Keep the scope as tight as possible. Do not add features unless I ask.

Requirements are FR-001 to FR-012 under BR-001 to BR-009, with NFR-001 to NFR-013 and project objectives PO-001 to PO-007; business rules are numbered 1 to 21.

Stack: Java 25 and Spring Boot (Gradle multi-module), React and TypeScript (Vite), PostgreSQL per service with Flyway, Redis, Kafka in KRaft mode, JUnit 5 with REST Assured and Testcontainers, Vitest with React Testing Library, Playwright with playwright-bdd, k6 with one JMeter plan, OpenTelemetry, Helm on kind and k3d with ArgoCD, GitHub Actions.
Current milestone: [fill in — 0 is the foundation, 8 is the completion point]
Relevant requirement IDs: [fill in]
Current repository structure or code: [paste or attach]
Question/task: [describe the specific help needed]

Please distinguish required MVP work from optional future work. Do not assume implementation details that I have not provided. Where a decision is needed, recommend one simple choice and explain its tradeoff briefly. When proposing implementation work, give the failing test first, and express E2E behavior as Gherkin scenarios.
```

### 2. Add or refine a requirement

```text
Using the appointment booking project context, help me add or refine this requirement. Business requirements are the stakeholders' and are changed only by them; functional and non-functional requirements are mine to shape, provided they still serve a BR.

Business need:
[describe the need]

Please provide:
1. The parent: an existing BR ID for product behavior, or a PO ID where the need is a property of the exercise rather than of the business — or a new BR stated in stakeholder language if it is genuinely a new business promise rather than a way of meeting an old one. Say so plainly if there is no parent; do not invent one to make the requirement fit. An FR's parent is always a BR.
2. A concise requirement with a stable FR ID — or an NFR ID, if the need is a property the system must hold rather than a behavior it must offer.
3. Acceptance criteria with observable outcomes.
4. At least one Gherkin acceptance scenario tagged with the FR ID, in business language, with no selectors or status codes.
5. In-scope and out-of-scope behavior.
6. Relevant FE, BE, API, data, security, or operational implications.
7. Unit, integration, contract, E2E, load, or performance tests that apply, naming the first failing test to write.
8. Links this requirement should have to its parent BR or PO, source code, test cases, and potential defects.

Keep the project scope narrow. Do not silently add adjacent features.
```

### 3. Add a test case

```text
Using the appointment booking project context, create test case [TC-ID] for requirement [FR-ID].

Scenario:
[describe the behavior]

Include preconditions, controlled test data, steps, expected results, cleanup, and the appropriate test layer. Cover relevant boundary and error behavior. Keep it deterministic and independent from other tests where possible.

If the case belongs at E2E, write it as a Gherkin scenario tagged with the requirement ID and keep selectors, endpoints, and status codes in the step definitions. If it belongs at a unit or integration level, give the failing test first and state the production behavior it should force.
```

### 4. Review a proposed implementation or change

```text
Review the following appointment booking change against the project context and requirement IDs [list IDs], naming the BR or PO each one serves.

Change or code:
[paste diff, code, or design]

Check:
- Whether it meets the stated requirements without expanding scope.
- Correctness of booking conflicts, state transitions, and idempotency where relevant.
- API contract and error behavior.
- Test coverage at the appropriate FE and BE levels.
- Whether the change was driven test-first: tests name behavior rather than implementation, and new customer- or staff-visible behavior has a tagged Gherkin scenario.
- Traceability from requirement to implementation and test evidence.
- Risks to E2E reliability, load behavior, performance, or disposable environments.

Report concrete findings with severity and file/line references when available. Do not invent requirements or claim untested behavior is verified.
```

### 5. Investigate a bug or failed test

```text
Investigate this appointment booking defect or test failure.

Requirement/test IDs: [FR-ID / TC-ID]
Environment and build: [details]
Expected result: [expected]
Actual result: [actual]
Reproduction steps: [steps]
Evidence: [logs, screenshot, request/response, trace]

Identify the most likely cause from the evidence, list any assumptions, recommend the smallest safe fix, and propose the failing regression test to write before that fix. Preserve the project scope and do not treat a guess as a confirmed root cause.
```

### 6. Plan a disposable environment

```text
Design the smallest disposable test environment for the appointment booking project using this stack: [stack].

Trigger: [pull request / branch / manual test run]
Tests to run: [tests]
Available infrastructure and limits: [details]

Cover provisioning, isolated database/data, migrations, deterministic seed data, configuration/secrets, test execution, evidence collection, cleanup after success or failure, and cost/runtime controls. Keep the design reproducible and avoid production data. Clearly mark what is MVP and what can wait.
```

### 7. Define a load or performance test

```text
Create a focused [load/performance] test plan for the appointment booking project.

Target behavior: [slot search / booking / duplicate retry / staff schedule]
Environment: [details]
Expected data volume: [details]
Expected concurrency or traffic shape: [details]
Known service objective, if any: [value or "not defined"]
Non-functional requirement this serves: [NFR-002 / NFR-003]

Specify workload, test data, correctness assertions, metrics, run duration, repeatability requirements, and result interpretation. Follow the recorded fields and comparison rule already fixed by NFR-003 rather than inventing a threshold. If no service objective is known, propose a local baseline method without presenting it as a production SLA.
```

### 8. Define an event, cache, or telemetry assertion

```text
I need a check over the asynchronous or observable part of the system.

What I want asserted: [one of — an event is published exactly once | a redelivery writes no second record | a replay publishes nothing | a poison message reaches the dead-letter topic | a cache entry is invalidated by a committed change | a cached read never offers a booked slot | a trace spans the services | nothing sensitive reaches telemetry]
Requirement and rules it serves: [FR/NFR ID, and rules from 19, 20, 21]
Spec section it answers to: [Domain events and notification records | Availability cache | Telemetry]

Please:
1. Place the check at the lowest level that can hold it, and say why the level above cannot.
2. State the deterministic mechanism. Driving the relay or the consumer directly beats waiting; if the check must wait, give the bounded condition, the fixed timeout, and the recorded attempt count. A sleep, a time-to-live lapse, or a retried scenario is not acceptable.
3. For a telemetry assertion, use the in-memory exporter inside the test — never a query against a hosted backend.
4. Give the failing test first, name it after the behavior, and tag it with its requirement ID and TC ID.
5. Say what the check would let me delete, if it makes a higher-level test redundant.
```

## Context and decisions log

The decisions log has moved to [`docs/decisions.md`](docs/decisions.md) now that `docs/` exists,
as this section committed. All rows are there unchanged. This pointer is the only content that
belongs here; a reader looking for a decision follows the link rather than reading on in the
specification file.
