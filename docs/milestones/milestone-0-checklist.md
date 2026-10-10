# Milestone 0 action checklist

Progress checklist based on the [milestone 0 delivery plan](milestone-0.md),
[NFR-012 evidence record](../requirements/NFR-012.md), and
[milestone exit criteria](../../appointment-booking-project.md#milestone-exit-criteria), reviewed
2026-10-10. The specification owns the exit criteria. A checked box means the named artifact or
result is recorded; it does not decide whether a requirement is done. Record links to completed
runs and pull requests in the evidence document, then have a human accept the exit review.

## W0-01 — Repository and pull-request workflow

- [x] Initialize the Git repository and configure the GitHub `origin` remote.
- [x] Commit `.gitignore`, a placeholder-only `.env.example`, and the README skeleton.
- [ ] Verify `main` requires pull requests and the `Quality gate` job from `gate.yml` as a required
  check. Record where the branch-protection setting can be reviewed.

## W0-02 — Toolchain support check

- [x] Record the Java 25 toolchain choice and the dependency correction in
  [the decisions log](../decisions.md).
- [ ] Have a human resolve the correction row's **Proposed — awaiting human acceptance** status.
- [ ] Confirm the pinned Gradle, Spring Boot, OpenTelemetry, and Testcontainers toolchain works with
  Java 25 through the one-command CI build; record the run link under W0-03.

## W0-03 — Build skeletons and the one command

- [x] Create both service skeletons, the frontend shell, the E2E package, and `Taskfile.yml`.
- [ ] Run the Taskfile build command in CI and link a green run showing all four pieces built.

## W0-04 — Contract files

- [x] Commit `contracts/openapi.yaml`, `contracts/events/`, and its `samples/` directory with the
  milestone 1 scope recorded in [the decisions log](../decisions.md).
- [x] Record a green Spectral run over the HTTP contract in the
  [NFR-012 evidence record](../requirements/NFR-012.md#evidence).

## W0-05 — Standards artifacts

- [x] Commit the skills and review agents under `.claude/`.
- [ ] In the exit review, compare the committed set against the authoritative
  [standards-artifact table](../../appointment-booking-project.md#engineering-standards-as-artifacts)
  and record any missing artifact before accepting it.

## W0-06 — Eval suites and withheld-skill proof

- [x] Commit one eval suite and one withheld-skill configuration for each skill.
- [x] Link the green skill-eval and withheld-skill CI runs in
  [NFR-012](../requirements/NFR-012.md#evidence).
- [ ] Have a human review those runs and accept that each withheld-skill failure is a genuine
  assertion failure, then update the evidence status.

## W0-07 — Gate configuration and planted-violation proofs

- [x] Configure the pull-request quality gate in `.github/workflows/gate.yml`.
- [ ] For **each** violation below, make a separate throwaway branch and pull request, verify the
  relevant check fails, close the pull request without merging, and link the closed pull request
  and failed run in [NFR-012](../requirements/NFR-012.md#evidence):
  - [ ] Formatting breach (Spotless or Biome).
  - [ ] Static-analysis finding above the configured severity (SonarCloud or CodeQL).
  - [ ] Contract-lint error (Spectral).
  - [ ] Chart-lint error (`helm lint`, chart-testing, or kubeconform).
  - [ ] Committed fabricated secret that authenticates to nothing (gitleaks).
  - [ ] Vulnerable dependency (Trivy or dependency-review).
- [ ] Confirm a normal pull request runs the complete lint and scanning gate, including image
  scanning, and that its required `Quality gate` job is green.

## W0-08 — CI pipeline and review agents

- [x] Commit the build, gate, eval, and review-agent workflows under `.github/workflows/`.
- [ ] Configure the required GitHub Actions secrets without putting their values in the tree or
  evidence record; verify the dependent workflows can run.
- [ ] Resolve the intermittent `standards-reviewer` error recorded in
  [NFR-012](../requirements/NFR-012.md#evidence).
- [ ] Link a real pull request where every review agent records its result, including an agent with
  no findings; ensure a missing agent report is recorded as missing, not clean.
- [ ] Confirm review-agent output remains advisory and cannot fail the build.

## W0-09 — Telemetry wiring

- [x] Wire OpenTelemetry into both services and make an in-memory exporter available to tests.
- [ ] Record the test evidence named in the [plan's evidence index](milestone-0.md#evidence-index):
  obtain the exporter and observe service spans. Keep milestone 1 telemetry assertions in
  milestone 1.

## W0-10 — Base Helm chart

- [x] Commit the umbrella and shared library charts under `charts/`.
- [ ] Link a green CI run of `helm lint`, chart-testing, and kubeconform.

## W0-11 — Milestone documents

- [x] Commit `docs/requirements/NFR-012.md` and `docs/ai-sdlc.md`.
- [ ] Have a human review `docs/ai-sdlc.md` against NFR-012's documentation criterion and record
  the result.
- [ ] Fill the remaining NFR-012 evidence rows with run and pull-request links; have a human
  review the completed evidence table.

## W0-12 — Decisions-log relocation

- [x] Move the decisions log to `docs/decisions.md` and point the specification to it.
- [x] Remove the old duplicate decisions-log rows from the specification.

## W0-13 — Exit review

- [ ] Resolve the human-acceptance status of proposed milestone 0 decisions in
  [the decisions log](../decisions.md).
- [ ] Revisit every clause of the authoritative
  [milestone 0 exit row](../../appointment-booking-project.md#milestone-exit-criteria) and record
  its evidence link and result in [the delivery plan](milestone-0.md#exit-review-w0-13).
- [ ] Confirm the milestone 0 gate and all skill eval suites are green, no test is quarantined,
  and no product behavior is shipped or claimed.
- [ ] Have a human accept the exit review before marking milestone 0 complete.

The delivery plan's statement that work is blocked by a missing GitHub remote is stale: `origin`
is configured.
