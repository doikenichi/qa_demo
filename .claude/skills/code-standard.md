---
name: code-standard
description: Naming, module structure, error shape, closed issue-code list, and Java 25 idiom for this codebase.
---

# Code Standard

## Error shape

Every error uses the single shape from [Error responses](../../appointment-booking-project.md#error-responses). No status code or `issue` code is introduced at a call site — add it to the spec first, then to `contracts/openapi.yaml`.

## Closed `issue` code list

The 15 codes from [Error responses](../../appointment-booking-project.md#error-responses) are the complete set:

`required`, `not_a_string`, `too_short`, `too_long`, `invalid_format`, `contains_whitespace`, `contains_control_character`, `not_an_instant`, `fractional_seconds`, `not_a_date`, `range_inverted`, `range_too_wide`, `before_today`, `after_window_end`, `unknown_field`

A new code requires a spec change and a contract change, in that order, before it appears in code.

## Java 25 idiom

Use records, sealed types, and pattern matching where they replace an older construct. Concretely:

- **Records** for immutable value objects (DTOs, domain events, query results).
- **Sealed interfaces + pattern matching** for closed discriminated unions (booking status, error variants).
- **Pattern matching `instanceof`** in place of cast-after-check.
- **`switch` expressions** over sealed types — exhaustive, no fall-through.

**Virtual threads are not adopted in this codebase.** No decisions-log row authorises them. They change the concurrency model beneath the NFR-002 race tests and the NFR-004 lease-versus-timeout relationship — adopt only after a logged decision with its own evidence.

## Module structure

Two modules under `services/`: `booking-service` (authoritative for slots, bookings, idempotency, outbox) and `notification-service` (consumes booking events, writes notification records). See [Suggested repository layout](../../appointment-booking-project.md#suggested-repository-layout). No `backend/` directory.

## Naming

Test methods are named for behavior, not for implementation. They carry their requirement ID (`@Tag("FR-004")` or a comment `// TC-FR-004-2`). See `requirement-docs` for the TC-ID format.

---
*When a situation this skill does not cover arises, see [escalation-protocol](escalation-protocol.md).*
