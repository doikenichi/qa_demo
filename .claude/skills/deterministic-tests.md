---
name: deterministic-tests
description: Authoring side of NFR-001: injected clock, fixed seeds, bounded waits, no order dependence, no retries.
---

# Deterministic Tests

This skill is the authoring side of [NFR-001](../../appointment-booking-project.md#non-functional-requirements). Every rule here serves one goal: the full suite returns the same verdict for the same inputs, every time.

## Injected clock — always

Never read the system clock in production code or test code:

- **Banned in production**: `Instant.now()`, `LocalDateTime.now()`, `Clock.systemDefaultZone()`, `new Date()`, `System.currentTimeMillis()`.
- **Required**: inject a `Clock` (or a `ClockProvider` interface) and call `Clock.instant()` in production code. In tests, construct the injected clock at a fixed instant.

Every boundary test — cancellation cutoff, idempotency expiry, slot window — advances the injected clock, not the wall clock.

## Fixed seed data

All test fixtures use fabricated data with fixed values. No `UUID.randomUUID()` in test setup, no `faker.name()`, no timestamp derived from `now`. If a value needs to be unique per run, derive it from a fixed seed.

## Bounded waits — no sleeps

A wait for an async condition (e.g. a notification record written by `notification-service`) uses:
- A fixed timeout (e.g., 5 seconds).
- A fixed polling interval.
- A **recorded attempt count** logged on success or failure.

No `Thread.sleep()`, no `TimeUnit.SECONDS.sleep()`, no `Awaitility` without explicit timeout and poll interval, no fixed delays as synchronisation. A sleep that works today becomes a flaky test under load.

## No inter-test order dependence

- No `@TestMethodOrder` / `@Order` that makes one test depend on state left by another.
- No static mutable fields shared between test classes.
- Each test arranges its own state from scratch.

## No retries anywhere

No `@Retryable`, no `fluentWait`, no `retry: 3` in CI workflow steps, no `--retries` in Playwright/k6 config. A test that fails then passes unchanged is tagged `@flaky`, pulled from the gate, and given a same-day issue. Its requirement reverts to not-done.

The spec section is [NFR-001](../../appointment-booking-project.md#non-functional-requirements) and [Quality standards](../../appointment-booking-project.md#quality-standards).

---
*When a situation this skill does not cover arises, see [escalation-protocol](escalation-protocol.md).*
