---
name: tdd-cycle
description: Red–green–refactor discipline: no production code without a failing test, tests named for behavior with requirement IDs, commits at cycle boundaries.
---

# TDD Cycle

## The discipline

1. **Red** — Write a failing test that names the behavior it verifies and carries its requirement ID. The test must fail for the right reason before any production code is written.
2. **Green** — Write the minimum production code to make that test pass. Nothing more.
3. **Refactor** — Clean up without changing behavior. All tests remain green.
4. **Commit** at cycle boundaries — a commit contains one test plus the code that makes it pass.

No production code without a failing test that required it. This is a hard rule, not a guideline.

## Test naming and IDs

Name tests for the behavior they verify, not for the implementation:
- Good: `"cancellation at exactly slotStart is refused with cancellation_window_closed"`
- Avoid: `"testCancelBooking"`

Every test carries its requirement ID. In JUnit 5: `@Tag("FR-006")`. In Vitest/Playwright: a comment `// TC-FR-006-1` or a tag in the describe block.

TC IDs follow the format `TC-FR-<number>-<sequence>` or `TC-NFR-<number>-<sequence>`. See `requirement-docs` for the full format.

## Test level

Write the test at the **lowest level that can hold it**. A unit test that can verify the rule without a database or network is preferred over an integration test. See `test-design` for the level decision.

## What this applies to

All product code and all test code under `services/`, `frontend/`, and `e2e/`. Configuration and infrastructure (Helm charts, CI workflows) do not follow this cycle but are still reviewed before commit.

For a fix: a failing regression test reproduces the defect first, then the fix makes it pass. A requirement whose check is quarantined as flaky reverts to not-done status — it is never rescued by quarantine to make a milestone exit.

---
*When a situation this skill does not cover arises, see [escalation-protocol](escalation-protocol.md).*
