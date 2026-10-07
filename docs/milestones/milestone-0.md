# Milestone 0 — Foundation: delivery plan

The order the foundation work is taken in, what each piece depends on, the decisions this milestone
must take before it can proceed, and the risks it carries.

**Status of this file.** A committed project document, recorded in the
[decisions log](../../appointment-booking-project.md#context-and-decisions-log) and in
[Suggested repository layout](../../appointment-booking-project.md#suggested-repository-layout). It
is deliberately **not** one of the nine
[portfolio deliverables](../../appointment-booking-project.md#portfolio-deliverables): it is the
plan for the work, not a claim a reviewer is invited to assess. Nothing here is authoritative over
anything. It was drafted with AI assistance and accepted by a human, as
[AI-assisted SDLC](../../appointment-booking-project.md#ai-assisted-sdlc) requires of any generated
document, and it may never decide whether a requirement is done.

## How to read this file

[Milestone 0's exit row](../../appointment-booking-project.md#milestone-exit-criteria) is the
definition of what this milestone owes. This file says **in what order** that work is taken and
**what depends on what** — nothing more. Where the two disagree, the specification wins and this
file is the defect, the same discipline
[One authoritative statement for each thing](../../appointment-booking-project.md#one-authoritative-statement-for-each-thing)
applies everywhere else.

Three conventions keep it subordinate:

- **It restates no rule.** No requirement, no acceptance criterion, no status code, no `issue` code,
  and no count of anything is stated here. Every work package cites the section that owns its rule.
- **It is not a test plan and not an acceptance-criteria document.** Test plans live under
  `docs/test-plans/` with the contents fixed in
  [Test plan contents](../../appointment-booking-project.md#test-plan-contents); acceptance criteria
  live in `docs/requirements/` under the IDs fixed in
  [Acceptance criteria and test case IDs](../../appointment-booking-project.md#acceptance-criteria-and-test-case-ids).
  This file holds neither.
- **It closes on the exit row, not on its own checklist.** A work package is finished when the
  evidence its *Evidence* column points at exists. The evidence index at the end says where to look;
  it is not a second exit criterion.

From this milestone onward the
[milestone 0 definition-of-done tier](../../appointment-booking-project.md#definition-of-done)
applies and never lapses: the lint, static-analysis, and scanning gate passes, and every skill's
eval suite is green. A later milestone that breaks either blocks its own exit.

## What this milestone must not ship

Pointers, not new rules:

- **No product behavior, and none claimed.** The exit row says so, and
  [Completion point](../../appointment-booking-project.md#completion-point) says why milestone 0 was
  prepended rather than appended. The contract files are files; nothing implements them yet.
- **No scenarios.** Milestone 1 introduces the first feature file and the step-definition harness —
  see the rhythm paragraph under
  [Milestone exit criteria](../../appointment-booking-project.md#milestone-exit-criteria).
- **No environments beyond the CI job.** The shared k3d cluster and ArgoCD arrive in milestone 5 and
  disposable per-pull-request environments in milestone 6
  ([Test environments and disposable environments](../../appointment-booking-project.md#test-environments-and-disposable-environments)).
  The base chart is linted here, not installed.
- **No measurement work.** Load and performance baselines are milestone 7; published metrics and the
  flaky score are milestone 5; `docs/traceability.md` is milestone 8.
- **One requirement document only.** `docs/requirements/NFR-012.md`, because
  [NFR-012](../../appointment-booking-project.md#non-functional-requirements) is the one requirement
  this milestone delivers. No other `FR-0NN.md` or `NFR-0NN.md` is written yet, and there is never a
  `BR-00N.md`.

## Work packages

| ID | Work package | Depends on | Produces | Evidence it serves |
|---|---|---|---|---|
| W0-01 | Repository and pull-request workflow | — | Git repository, remote, branch protection, `.gitignore`, `.env.example`, README skeleton | Every later clause: the gate and agent proofs all need a real pull request |
| W0-02 | Toolchain support check | W0-01 | A confirmation note, or the amendment the Java 25 row already prescribes | The stack row in [Tooling](../../appointment-booking-project.md#tooling) |
| W0-03 | Build skeletons and the one command | W0-02 | `settings.gradle.kts`, two service modules, frontend shell, E2E package, `Taskfile.yml` | The exit row's one-command build of all four pieces |
| W0-04 | Contract files | W0-03 | `contracts/openapi.yaml`, `contracts/events/` with `samples/` | The exit row's two contract paths |
| W0-05 | Standards artifacts | W0-01 | `.claude/skills/`, `.claude/agents/` | Every artifact listed in [Engineering standards as artifacts](../../appointment-booking-project.md#engineering-standards-as-artifacts) |
| W0-06 | Eval suites and the withheld-skill proof | W0-05, W0-08 | `.claude/evals/` | [NFR-012's floor](../../appointment-booking-project.md#non-functional-requirements), items 1 and 2 |
| W0-07 | Gate configuration and planted-violation proofs | W0-03, W0-04, W0-08, W0-10 | Tool configuration, one closed pull request per planted kind | NFR-012's floor, item 3 |
| W0-08 | CI pipeline | W0-03 | `.github/workflows/` | The pipeline every other proof runs in |
| W0-09 | Telemetry wiring | W0-03 | OpenTelemetry SDK and agent in both services, in-memory exporter available to tests | The exit row's telemetry clause |
| W0-10 | Base Helm chart | W0-03 | `charts/` umbrella and library chart | The exit row's chart-linting clause |
| W0-11 | Milestone documents | W0-05, W0-07 | `docs/requirements/NFR-012.md`, `docs/ai-sdlc.md` | NFR-012's floor, item 4, and the exit row's two named documents |
| W0-12 | Decisions-log relocation | W0-01 | `docs/decisions.md`, with the specification linking to it | The commitment in [Context and decisions log](../../appointment-booking-project.md#context-and-decisions-log) |
| W0-13 | Exit review | all | A recorded walk of the exit row, clause by clause | [Milestone exit criteria](../../appointment-booking-project.md#milestone-exit-criteria) |

### W0-01 — Repository and pull-request workflow

The project is not yet a git repository, and three of the exit row's clauses — the review agents
recording findings, the gate failing a pull request, a published CI run — cannot be satisfied without
one. First work, therefore: initialise the repository, push it to a remote that runs GitHub Actions,
and make the default branch merge through pull requests, so that "fails a pull request" is something
the repository can actually do.

`.gitignore` ignores `.env` from the first commit and `.env.example` is committed with a placeholder,
because the credential rules in
[Staff credential](../../appointment-booking-project.md#staff-credential) and
[NFR-005](../../appointment-booking-project.md#non-functional-requirements) apply to a repository
with no code in it just as much as to one with code.

The README begins as the entry point described in
[Portfolio deliverables](../../appointment-booking-project.md#portfolio-deliverables) and states
plainly which capabilities do not exist — the rule in
[Completion point](../../appointment-booking-project.md#completion-point) that the README never
describes the plan as though it were built.

### W0-02 — Toolchain support check

Before a module is scaffolded, confirm that Spring Boot, Gradle, the OpenTelemetry Java agent, and
Testcontainers all support JDK 25 on this host. The Java 25 decision row records its own fallback in
advance: if a pinned dependency does not support it, the backend reverts to Java 21 as an
**amendment to that row**, naming the dependency that forced it — not as a new decision, and not as
a reopening of the choice. Doing this check first is the whole reason it is cheap; discovering it
during W0-03 means rebuilding two modules.

### W0-03 — Build skeletons and the one command

The Gradle multi-module build with the two service modules, the pnpm workspace with the frontend
shell and the E2E package, and a `Taskfile.yml` that builds all four from one command — the task
runner named in [Tooling](../../appointment-booking-project.md#tooling). The exit row asks that the
monorepo *build*; the full install, migrate, seed, reset, and test command belongs to
[NFR-007](../../appointment-booking-project.md#non-functional-requirements) at milestone 5, so the
Taskfile gains tasks as the milestones that need them arrive rather than being written against
behavior that does not exist.

Both services are skeletons: they start, they expose no product endpoint, and they implement nothing
from [Behavior specification](../../appointment-booking-project.md#behavior-specification). A
directory is created only when something goes in it
([Suggested repository layout](../../appointment-booking-project.md#suggested-repository-layout)).

### W0-04 — Contract files

`contracts/openapi.yaml` carries the shapes milestone 1 needs, and `contracts/events/` exists with
its `samples/` directory. Every shape is taken from the section that owns it — the slots view from
[Availability window](../../appointment-booking-project.md#availability-window), the error body and
its closed `issue` list from
[Error responses](../../appointment-booking-project.md#error-responses) — and no status code or
error code is introduced that those sections do not already carry. Spectral lints the file in CI
from W0-07 onward.

How much of the event contract is due here is an open reading of the exit row; see
[Decisions this milestone must take](#decisions-this-milestone-must-take).

### W0-05 — Standards artifacts

Every skill and every review agent listed in
[Engineering standards as artifacts](../../appointment-booking-project.md#engineering-standards-as-artifacts)
is authored under `.claude/`. **That table is the set.** This plan only sequences it: if a row is
added or removed there — which needs its own decisions-log row — this ordering follows it, and no
count is stated here.

A workable order, because the artifacts reference each other:

1. `escalation-protocol` first. It is the single statement of the stop-and-raise contract, and every
   other skill carries a one-line pointer to it rather than a copy, so writing it first is what
   stops several copies existing for an afternoon.
2. `spec-authority` second, for the same reason in the other direction: it states where each kind of
   statement lives, and every artifact written after it is checked against it.
3. The remaining authoring skills, each citing the behavior sections, the numbered rules, or the
   requirement tables rather than restating them.
4. Each review agent beside its authoring counterpart, which is the pairing that table already
   requires — an agent reviewing against a standard no artifact authors to is an opinion rather than
   a check.

A skill cites the specification; it never becomes a second copy of it. An artifact that would merely
be tidy, rather than making a process outcome deterministic or evidenced, does not earn a place —
and that test has its own governor in W0-06.

### W0-06 — Eval suites and the withheld-skill proof

One eval suite per skill, running in CI, with one eval per skill **proven to fail when the skill is
withheld** — a suite that passes without its skill is measuring the model rather than the artifact.
The withheld-skill case must fail *deterministically*:
[NFR-001](../../appointment-booking-project.md#non-functional-requirements) bans retries everywhere,
so an eval that only usually fails without its skill is not evidence and is rewritten until it is.
The runner is an open decision; see below.

### W0-07 — Gate configuration and planted-violation proofs

Configure every tool in the `Quality gate` row of
[Tooling](../../appointment-booking-project.md#tooling), then prove each kind of violation fails a
pull request, one throwaway branch per kind, exactly the kinds the exit row names. Each proof is a
closed pull request whose failed check is the evidence; the link is recorded in
`docs/requirements/NFR-012.md`.

Two cautions. The planted secret is a **fabricated** value that matches the scanner's pattern and
authenticates to nothing — the fabricated-data-only rule in
[Project purpose](../../appointment-booking-project.md#project-purpose) covers a planted fixture as
much as seed data, and a real credential is never committed, not even to prove a scanner works. And
none of these branches merges: a proof is a demonstration that the gate held, so the branch is
closed, not fixed and merged.

### W0-08 — CI pipeline

GitHub Actions workflows for the build, the gate, the eval suites, and the review-agent runs. The
agents record their findings on every pull request including the runs that find nothing, and no
agent and no AI step can pass or fail the build
([AI-assisted SDLC](../../appointment-booking-project.md#ai-assisted-sdlc)). The staff token and the
two hosted-service tokens are injected as CI secrets and never appear in the tree
([Quality standards](../../appointment-booking-project.md#quality-standards)). No job and no runner
configures a retry.

### W0-09 — Telemetry wiring

The OpenTelemetry SDK and Java agent in both services, with the in-memory exporter available to
tests, which is all the exit row asks for. Asserting on spans, metrics, and redaction is
[NFR-010](../../appointment-booking-project.md#non-functional-requirements) at milestone 1, and the
rules those assertions answer to are in
[Telemetry](../../appointment-booking-project.md#telemetry). Wiring it now means milestone 1 writes
assertions rather than infrastructure.

### W0-10 — Base Helm chart

The umbrella chart and the shared library chart under `charts/`, with `helm lint`, chart-testing, and
kubeconform green in CI. Installing the chart over both services, the frontend, Postgres, Redis, and
Kafka is milestone 5's exit criterion, not this one's.

### W0-11 — Milestone documents

`docs/requirements/NFR-012.md`, whose shape is owned by the `requirement-docs` skill and whose
content answers to
[NFR-012's checklist and floor](../../appointment-booking-project.md#non-functional-requirements);
and `docs/ai-sdlc.md`, naming for every generated artifact class the prompt used, the human who
reviewed it, and what AI may never decide — with the honest limitation stated, that none of this
makes a generated artifact correct and all of it makes the human gate visible.

### W0-12 — Decisions-log relocation

The specification commits the decisions log to `docs/decisions.md` once `docs/` exists, and `docs/`
now exists. This is a **move**, not an edit: no row is reworded, reordered, or deleted, the `Status`
column travels with it, and the specification links to the new location. Because the contents of the
log are never AI's to decide, the move is proposed and a human accepts it before it lands.

### W0-13 — Exit review

Walk milestone 0's exit row clause by clause and record, for each, where the evidence lives. Zero
quarantined tests, and the milestone 0 definition-of-done tier green. The milestone is not exited
until every row is true, and a quarantined check never carries into the next milestone.

## Sequencing

The dependency spine is **W0-01 → W0-02 → W0-03 → W0-08**: no pull request, no toolchain answer, no
build, no pipeline. Everything else hangs off it.

- After W0-03: W0-04, W0-09, and W0-10 are independent of each other and can proceed in any order.
- W0-05 needs only W0-01 and can run alongside the build work; it is the largest package by volume
  and benefits from starting early.
- W0-06 and W0-07 need W0-08, because both are claims about what CI does on a pull request. They are
  the two packages that cannot be front-loaded, which is why W0-08 sits on the spine.
- W0-11 trails W0-05 and W0-07, since `NFR-012.md` records the links those two produce.
- W0-12 is independent and can land at any point after W0-01.
- W0-13 is last by definition.

## Decisions this milestone must take

Each needs a row in the
[decisions log](../../appointment-booking-project.md#context-and-decisions-log), and none of them is
AI's to decide:

| Decision | Why it cannot be defaulted |
|---|---|
| The eval runner for the skill suites | It is a tooling choice, and a dependency or stack change is an `escalation-protocol` case rather than a plausible default. The row must name the process outcome it makes deterministic. |
| JDK 25 confirmed, or the recorded fallback taken | The Java 25 row prescribes the fallback and requires the forcing dependency to be named. Either outcome is written down; silence is not an option. |
| The hosted static-analysis and telemetry accounts | Both are named in [Tooling](../../appointment-booking-project.md#tooling) as hosted services with injected tokens; which account, and who holds it, is not recorded anywhere. |
| How much of `contracts/events/` is due at milestone 0 | The exit row asks for both contract paths with the shapes milestone 1 needs, and milestone 1 emits no events. Whether that means the booking-event schema, the directory alone, or something between is a reading of the exit row — an escalation, not a default to pick. |

## Risks

| Risk | What it threatens | Response |
|---|---|---|
| A pinned dependency does not support JDK 25 | W0-03, and every module built on it | W0-02 runs first; the fallback is already recorded as an amendment to the Java 25 row, naming the dependency. |
| A hosted free tier needs an account, an approval, or an organisation before CI can be green | W0-07, W0-08 | Raise the account decisions at the start of the milestone rather than when a workflow first fails; the self-hosted half of the gate can be proven meanwhile. |
| A withheld-skill eval fails only sometimes | W0-06, and NFR-012's floor | It is rewritten until the failure is deterministic. It is never rescued by a retry, which NFR-001 bans outright, and never quarantined to get the milestone exited. |
| Chart-lint tooling is awkward on the development host | W0-10 | The chart lints in CI, which is where the exit row needs it green; a local run is convenience, not evidence. |
| A planted-violation branch is merged by accident | The repository's integrity, and the honesty of the proof | Each proof branch is closed rather than fixed and merged, and the planted secret authenticates to nothing. |
| Milestone 0 grows because the standards set grew | The milestone's finishability | The artifact table governs its own growth: a new row needs a decisions-log entry naming the process outcome it makes deterministic, and must prove one eval fails without it. |

## Evidence index

Where each package's evidence lands. The exit row remains the checklist; this table only says where
to look.

| Work package | Evidence artifact |
|---|---|
| W0-01 | The repository, its first pull request, and the README's statement of what does not exist |
| W0-02 | A row in the decisions log — the confirmation, or the amendment naming the forcing dependency |
| W0-03 | A CI run of the one Taskfile command building all four pieces |
| W0-04 | The two contract paths in the tree, and a green Spectral run over the HTTP contract |
| W0-05 | The artifacts under `.claude/skills/` and `.claude/agents/` |
| W0-06 | A green eval run per skill, plus the withheld-skill run that fails, both in CI |
| W0-07 | One closed pull request per planted kind, each with its failed check, linked from `docs/requirements/NFR-012.md` |
| W0-08 | A published CI run, and a pull request carrying every review agent's findings including a clean one |
| W0-09 | A test that obtains the in-memory exporter and sees the services' spans |
| W0-10 | A green `helm lint`, chart-testing, and kubeconform run in CI |
| W0-11 | `docs/requirements/NFR-012.md` and `docs/ai-sdlc.md` |
| W0-12 | `docs/decisions.md`, with the specification linking to it and no row altered |
| W0-13 | The recorded clause-by-clause walk of the exit row |

## Exit review (W0-13)

Recorded 2026-10-05 by Ken Doi. Each clause is from the spec exit row verbatim; the status column
says what was verified and how. This review is a claim by inspection or by CI result — it is never
AI's to decide whether a clause is satisfied.

| Clause | Status | Notes |
|---|---|---|
| `docs/requirements/NFR-012.md` | **Satisfied by inspection** | File committed at `docs/requirements/NFR-012.md`. Acceptance criteria and test cases present. |
| Monorepo builds both services, frontend, and E2E package from one Taskfile command | **Satisfied by inspection; CI run pending** | `task build` delegates to `build:services`, `build:frontend`, `build:e2e`. All four skeleton targets exist. Green CI run required before exit is complete — blocked on GitHub remote. |
| `contracts/openapi.yaml` and `contracts/events/` exist with the shapes milestone 1 needs | **Satisfied by inspection** | `contracts/openapi.yaml` contains all endpoint shapes including `GET /api/slots`, all 11 error codes, all 15 issue codes, and the full schema set. `contracts/events/.gitkeep` and `contracts/events/samples/.gitkeep` present. Milestone 1 emits no events; directory satisfies the exit row. |
| Every skill and review agent in Engineering standards as artifacts committed with an eval suite each, green in CI | **Satisfied by inspection; CI run pending** | All 9 skills under `.claude/skills/`, all 5 agents under `.claude/agents/`, all 9 eval suites under `.claude/evals/` (one `promptfooconfig.yaml` per skill). Green CI run from `eval-suites.yml` required — blocked on GitHub remote and `ANTHROPIC_API_KEY` secret. |
| One eval proven to fail when its skill is withheld | **Satisfied by inspection; CI run pending** | One `promptfooconfig-withheld.yaml` per skill, each asserting a specific string the model cannot produce without the skill using only `contains`/`not-contains` assertions (no LLM-judge). The `withheld-skill-proof` CI job verifies non-zero exit per skill — run pending. |
| Review agents run on a pull request and record findings, including a clean run | **Pending** | `.github/workflows/review-agents.yml` committed and correctly exits 0 unconditionally. Evidence requires a pull request with the workflow output — blocked on GitHub remote. |
| Lint and scanning gate proven to fail on a planted violation of each kind: formatting, static analysis, contract lint, chart lint, committed secret, vulnerable dependency | **Pending** | `.github/workflows/gate.yml` committed with all six gate kinds configured. Planted-violation proof PRs require GitHub remote. Each proof is a closed PR, never merged. Fabricated (non-authenticating) planted secret per NFR-012 AC-3. |
| `docs/ai-sdlc.md` naming what AI may draft and what it may never decide | **Satisfied by inspection** | File committed. Names every generated artifact class, the prompt and reviewer, what AI may never decide, and the honest limitation (none of this makes a generated artifact correct; it makes the human gate visible). |
| OpenTelemetry wired in both services with the in-memory exporter available to tests | **Satisfied by inspection** | `io.opentelemetry.instrumentation:opentelemetry-spring-boot-starter` in both service builds. `InMemoryOtelConfig.java` test configuration in both test classpaths, providing `InMemorySpanExporter` as a primary bean. Span assertion tests come at milestone 1 per exit row wording ("available to tests"). |
| Base Helm chart linting clean | **Pending — CI run required** | `charts/appointment-booking/` umbrella chart, `charts/library/` shared library, service charts committed. `gate.yml` includes `helm lint`. Green run requires GitHub remote. |
| No product behavior ships in this milestone, and none is claimed | **Satisfied by inspection** | Both service applications are empty skeletons (context-loads smoke test only). Frontend is a placeholder div. No endpoint is implemented. README states "does not implement any product behavior yet." |

**Milestone exit status: incomplete — pending GitHub remote.**

The following user actions unblock the remaining clauses:

1. Create a GitHub repository and run `git remote add origin <url>`.
2. Make an initial commit (`git add --all && git commit`) and push to trigger CI.
3. Run `claude setup-token` and add its output as the `CLAUDE_CODE_OAUTH_TOKEN` GitHub Actions secret, then add `SONAR_TOKEN`, `OTEL_EXPORTER_OTLP_ENDPOINT`, and `OTEL_EXPORTER_OTLP_HEADERS`. The eval suites and the review agents authenticate with the subscription token; no `ANTHROPIC_API_KEY` is used anywhere. The status cells above predate that change and are superseded by the re-run of this review required at step 8.
4. Confirm the SonarCloud project. `sonar.projectKey` is `doikenichi_qa_demo` — the key SonarCloud auto-provisions for a GitHub-bound organization — and `sonar.organization` is `doikenichi`. If a second project exists under any other key, delete it: two projects analysing one repository post two pull-request checks. Verify **Administration → Analysis Method** has automatic analysis **off**, since CI-based analysis and automatic analysis cannot both run against one project. The custom quality gate this step previously called for is **not available**: the organization is on the free plan, where `GET /api/qualitygates/list` returns `actions.create: false` and the built-in `Sonar way` gate reports `manageConditions: false`. Coverage import is withheld for the milestone 0 placeholders instead, via `sonar.coverage.exclusions` in `sonar-project.properties`; a gate condition with no imported data is not applied. See the quality-gate rows of 2026-10-06 and 2026-10-07 in `docs/decisions.md`.
5. Set up branch protection on `main` (require PR, require gate CI checks). Require the `Quality gate` job from `gate.yml` — not SonarCloud's own app check, which reports analysis status rather than this project's gate.
6. Create one proof branch per planted-violation kind, open a PR for each, verify the gate fails, close without merging. Link each closed PR into `docs/requirements/NFR-012.md`'s evidence table.
7. Open a PR carrying any small change, verify `review-agents.yml` posts a comment, close.
8. Re-run this exit review once all six remaining clauses are green.

One cleanup item not blocking exit: `appointment-booking-project.md` lines 1724 onwards still
contain the old decisions-log table rows below the pointer added by W0-12. Delete those lines
before the first commit (or in the initial commit); they are harmless but tidy to remove.
