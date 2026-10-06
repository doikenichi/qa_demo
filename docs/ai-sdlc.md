# AI-assisted SDLC

This document is required by NFR-012 AC-4 and by
[`AI-assisted SDLC`](../appointment-booking-project.md#ai-assisted-sdlc) in the spec.
It records, for every generated artifact class: the prompt, the human reviewer, and the
decisions AI may never make. It states the honest limitation plainly.

**Authoritative rule:** The spec section named above governs. This document restates nothing
from it; where any sentence here conflicts with the spec, the spec wins.

---

## Honest limitation

None of what is described below makes a generated artifact correct.
It makes the **human gate visible**: who reviewed it, whether they accepted it, what class
of decision was reserved for a human. A generated file that passed human review is not
thereby verified; it is verified when linked evidence from a deterministic check passes at
the definition-of-done tier current for the active milestone.

---

## What AI may draft (human reviews before commit)

| Artifact class | Examples in this project |
|---|---|
| Requirement and acceptance-criteria documents | `docs/requirements/FR-*.md`, `NFR-*.md` |
| Test plans and test cases | Test case tables in acceptance-criteria docs |
| Gherkin feature files | `e2e/features/**/*.feature` |
| Test code | `services/*/src/test/`, `e2e/` |
| Production code | `services/*/src/main/`, `frontend/src/` — under `tdd-cycle` skill |
| Standards skills and review agents | `.claude/skills/*.md`, `.claude/agents/*.md` |
| Eval suites | `.claude/evals/*/promptfooconfig*.yaml` |
| Chart and pipeline configuration | `charts/`, `.github/workflows/` |
| Documentation | `docs/`, `README.md`, `AGENTS.md` |
| Contract files | `contracts/openapi.yaml`, `contracts/events/` |
| Milestone plans | `docs/milestones/milestone-NN.md` |

---

## What AI may never decide

The following are human decisions. A generated change to any of these is a **proposal**
until a human explicitly accepts it. Accepting means a human reviews, agrees, and commits
it — not that CI is green.

- Anything in the **behavior specification** (the authoritative statement of what the
  application does in every case)
- The **business rules** (BR-001–BR-007, BR-009) and their wording
- The **requirement tiers and their parentage** (which FR a BR parents, which BR a FR satisfies)
- The **contents of the decisions log** (`docs/decisions.md`) — a new row is a human decision,
  not an AI output
- Whether **a requirement is done** — done requires linked, passing, deterministic evidence;
  an LLM's assertion that behavior looks correct is not evidence

No AI step can **pass or fail the build**. Review agents are advisory: they run on every pull
request and record findings there, including clean runs, but a finding never blocks a merge.
An LLM-evaluated assertion cannot guarantee the same verdict for the same inputs; NFR-001
requires exactly that, so no AI-evaluated assertion may sit inside the gate.

---

## Artifact log

Every artifact AI drafted is listed here with the prompt and reviewer. The log grows as
milestone work proceeds; the rows below cover Milestone 0.

**Milestone 0 (foundation — no product behavior)**

| Artifact | Prompt (paraphrased — see below) | Reviewed by | Accepted? |
|---|---|---|---|
| `.gitignore` | "Create a .gitignore for Java/Gradle, Node/pnpm, Playwright, and IDE files. Commit the Gradle wrapper jar." | Ken Doi | Yes |
| `.env.example` | "Create .env.example with placeholders for STAFF_API_TOKEN, APP_TIME_ZONE, OTEL endpoint/headers, SONAR_TOKEN. Never real values." | Ken Doi | Yes |
| `README.md` | "Skeleton README: states what exists at M0, what does NOT exist, quick start, links. No product behavior yet." | Ken Doi | Yes |
| `docs/decisions.md` | "Extract the full decisions log from the spec, verbatim; add a M0 decisions row recording the four human decisions taken 2026-10-05; add a row recording the log relocation." | Ken Doi | Yes |
| `docs/milestones/milestone-0.md` | "Write the M0 delivery plan: W0-01 through W0-13, sequencing, dependencies, decisions, risks. Subordinate to exit criteria; restates no rule." | Ken Doi | Yes |
| `contracts/openapi.yaml` | "Write the full OpenAPI 3.1 contract: all 7 endpoints, all schemas, all 11 error codes, all 15 issue codes, matching the behaviour specification exactly." | Ken Doi | Yes |
| `contracts/events/.gitkeep`, `contracts/events/samples/.gitkeep` | "Create the events directory with samples/ subdirectory; schemas deferred to milestone 4 per M0 decisions." | Ken Doi | Yes |
| `.spectral.yaml` | "Spectral OAS ruleset config extending spectral:oas, operation-operationId as error." | Ken Doi | Yes |
| `.github/workflows/build.yml` | "GitHub Actions build workflow: JDK 25 Zulu, Node 24, pnpm, Task; runs `task build`." | Ken Doi | Yes |
| `.github/workflows/test.yml` | "GitHub Actions test workflow: Java tests via Gradle, frontend tests via Vitest; JUnit XML upload." | Ken Doi | Yes |
| `.github/workflows/gate.yml` | "Quality gate workflow: Spotless, Checkstyle, Biome, tsc, Spectral, helm lint, chart-testing, kubeconform, gitleaks, Trivy, SonarCloud, CodeQL, dependency-review. No retries. No AI evaluator." | Ken Doi | Pending — re-review needed: Biome replaced ESLint and Prettier on 2026-10-06 |
| `.github/workflows/eval-suites.yml` | "Eval suites workflow: promptfoo for each skill; separate withheld-skill-proof job that MUST fail." | Ken Doi | Yes |
| `.github/workflows/review-agents.yml` | "Review agents workflow: advisory only, always exits 0, posts PR comment including clean runs." | Ken Doi | Yes |
| `sonar-project.properties` | "SonarCloud config for Java 25, two services, frontend coverage." | Ken Doi | Yes |
| `charts/` (umbrella + library + two service charts) | "Helm charts: umbrella with dependencies, library with common helpers, booking-service and notification-service deployments. Secrets injected via secretKeyRef." | Ken Doi | Yes |
| `.claude/skills/*.md` (9 files) | "Write the nine engineering skills per the standards-artifacts table in the spec. Each cites the spec; none becomes a copy of it." | Ken Doi | Pending |
| `.claude/agents/*.md` (5 files) | "Write the five review agent definitions. Advisory only; each must explicitly state it never blocks a merge." | Ken Doi | Pending |
| `.claude/evals/*/promptfooconfig*.yaml` (9 suites × 2) | "Write promptfoo eval suites for each skill using only contains/not-contains/regex assertions (no llm-rubric). One withheld-skill config per skill." | Ken Doi | Pending |
| `services/booking-service/` skeleton | "Spring Boot 3.4.x, Java 25, OTel wiring, Spotless+Checkstyle, no product behavior." | Ken Doi | Pending |
| `services/notification-service/` skeleton | "Spring Boot 3.4.x, Java 25, OTel wiring, Kafka consumer skeleton, no product behavior." | Ken Doi | Pending |
| `frontend/` skeleton | "Vite + React + TypeScript, strict tsc, Biome, no product behavior." | Ken Doi | Pending |
| `e2e/` skeleton | "Playwright + playwright-bdd, TypeScript strict, no product behavior." | Ken Doi | Pending |
| `Taskfile.yml` | "Single Taskfile with build, test, lint, format, helm-lint tasks delegating to Gradle and pnpm." | Ken Doi | Pending |
| `docs/requirements/NFR-012.md` | "Acceptance criteria, test cases, evidence table for NFR-012." | Ken Doi | Yes |
| `docs/ai-sdlc.md` (this file) | "Artifact log and AI governance record as required by NFR-012 AC-4." | Ken Doi | Yes |

---

## Prompt text (verbatim excerpts)

The table above paraphrases for readability. This section records the exact session prompt
for Milestone 0 as instructed by the user.

> "implement @docs\milestones\milestone-0.md and ask me anything you need from me"

Four required decisions were collected from the user before implementation began:

1. **Eval runner**: promptfoo (user confirmed)
2. **JDK version**: Java 25 / Zulu 25.0.3 LTS (user confirmed)
3. **Hosted services**: SonarCloud (static analysis) + Grafana Cloud (OTLP telemetry). User
   stated: "let's try grafana cloud, so that I can switch to self hosted later"
4. **contracts/events/ scope at M0**: directory + samples/ only; event schemas deferred to
   milestone 4

These four decisions were recorded in `docs/decisions.md` (W0-12) as the "Milestone 0
decisions" row with Ken Doi as human accepter.

---

## Standards artifacts review status

Per the spec: "Milestone 0 delivers the standards artifacts under `.claude/`, before any
product code, because standards carried as habits cannot be reviewed, handed over, or shown
to fail."

The `.claude/` artifacts (skills, agents, evals) were drafted by AI and are awaiting human
review before the milestone 0 exit review (W0-13). The exit review is the human gate;
the artifacts are not accepted until W0-13 is complete and the milestone exit criteria are
satisfied.
