# Appointment Booking — Portfolio Project

A small appointment booking application built as a practice vehicle for multi-level automated
testing, requirement traceability, and disposable test environments. The product is the vehicle;
the evidence is the point.

See [`appointment-booking-project.md`](appointment-booking-project.md) for the full specification.

## What exists right now

| Capability | Status |
|---|---|
| Monorepo build (both services, frontend, E2E) | Milestone 0 |
| Contract files (`contracts/openapi.yaml`, `contracts/events/`) | Milestone 0 |
| Standards artifacts (skills, review agents, eval suites) | Milestone 0 |
| Lint and scanning gate | Milestone 0 |
| CI pipeline | Milestone 0 |
| Telemetry wiring | Milestone 0 |
| Base Helm chart | Milestone 0 |
| View slots (`GET /api/slots`) | Not yet — Milestone 1 |
| Book an appointment | Not yet — Milestone 2 |
| Look up / cancel a booking | Not yet — Milestone 2–4 |
| Staff schedule and completion | Not yet — Milestone 4 |
| Notification records | Not yet — Milestone 4 |

**This project does not implement any product behavior yet.** Nothing in this repository
serves a real customer or handles real data. All data is fabricated; all credentials are
development shortcuts. Do not describe anything here as production-ready or secure.

## Quick start

> Requires: Java 25, Node 20+, pnpm, and [Task](https://taskfile.dev).

```sh
cp .env.example .env
# Edit .env and fill in the placeholder values.
task build
```

See `Taskfile.yml` for all available tasks. The one-command full suite (install, migrate, seed,
reset, test) is the NFR-007 command and arrives at milestone 5.

## Portfolio deliverables

Listed in the specification under [Portfolio deliverables](appointment-booking-project.md#portfolio-deliverables).

## Decisions log

[`docs/decisions.md`](docs/decisions.md) — every decision with its date and reason.

## Active milestone

**Milestone 0 — Foundation.** No product behavior.
