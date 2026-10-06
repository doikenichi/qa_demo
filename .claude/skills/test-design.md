---
name: test-design
description: Choosing the test level before writing the check. Authoring counterpart to test-layering-reviewer.
---

# Test Design

Choose the level **before** writing the check. The rule from [Test strategy](../../appointment-booking-project.md#test-strategy): a check goes at the **lowest level that can hold it**. A higher-level test that re-asserts a rule a lower level already pins, without adding integration risk, is deleted rather than kept.

## Level reference

| Level | Job | Demonstrates |
|---|---|---|
| Frontend unit (Vitest) | Presentation logic, client-side validation, state | Testable without a browser, server, or clock |
| Backend unit (JUnit 5) | Business invariants as pure functions over injected clock | Boundary rules are cheap to test exhaustively |
| Frontend integration (Vitest + MSW) | UI handles real backend responses including unhappy paths | UI handles what the backend actually sends |
| Backend integration (JUnit 5 + Testcontainers) | Service behavior with real DB, real Redis, real Kafka | Invariants hold against real storage |
| Contract (REST Assured / Pact consumer) | Wire shape matches the OpenAPI spec on both sides | Shape contract between producer and consumer |
| E2E (Playwright + playwright-bdd) | Assembled system user path, Gherkin scenario | Full workflow works in an assembled system |

## Decision rule

Ask: "Can this rule be verified without a running server?" → unit test.  
Ask: "Can this rule be verified without a browser?" → backend integration test.  
Ask: "Does this check that shape is honoured across the wire?" → contract test.  
Ask: "Does this check that the assembled system delivers the user outcome?" → E2E test.

## What makes redundant breadth a defect

A check is redundant if: (a) a lower level already pins the same rule, and (b) the higher-level test adds no new integration risk. Redundant breadth makes the suite slower, harder to read, and misleading about what each level proves. Delete it.

Example: a backend unit test already asserts that `slotStart == now` is refused. An integration test that also checks the same boundary, with no additional DB/network involvement, is redundant.

## Applies at all levels

This rule applies to tests written for FRs and NFRs. Configuration and tooling artifacts do not need a TDD cycle but are still reviewed before commit.

---
*When a situation this skill does not cover arises, see [escalation-protocol](escalation-protocol.md).*
