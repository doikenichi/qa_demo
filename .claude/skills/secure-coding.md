---
name: secure-coding
description: Credential handling at the edge, identical not-found discipline, and telemetry redaction at the call site. Authoring side of NFR-005, NFR-006, and NFR-010 redaction.
---

# Secure Coding

This skill is the authoring side of [NFR-005](../../appointment-booking-project.md#non-functional-requirements), [NFR-006](../../appointment-booking-project.md#non-functional-requirements), and the redaction half of [NFR-010](../../appointment-booking-project.md#non-functional-requirements). The scanners are the gate; this skill is how code is written so the scanners don't find anything.

## Credential handling at the edge

The staff credential lives in `STAFF_API_TOKEN` and nowhere else. At every call site:

- Read it from the environment (or Spring's `@Value`). Never hardcode, never log, never include in a response body, never put in a span attribute.
- A request that fails credential verification returns `401 unauthorized` with the standard error body — the body carries no part of the token.
- In tests: inject the credential through the same `STAFF_API_TOKEN` environment variable, not through a hardcoded test string in source.

The spec section is [Staff credential](../../appointment-booking-project.md#staff-credential).

## Identical not-found discipline

All three cases — well-formed code with no matching row, malformed code, code of wrong length — return the same response: `404 booking_not_found` with an identical body. The format check exists to avoid a pointless query, not to produce a distinguishable answer.

Rule: a response body, a status code, a response time, or any observable behavior must not distinguish a malformed code from an unknown one. A test asserts the three responses are **identical**. See [Confirmation code access](../../appointment-booking-project.md#confirmation-code-access).

## Telemetry redaction at the call site

No customer datum, confirmation code, or staff token reaches any span attribute, metric label, or log record. At every call site that creates a span or logs a message, redact or omit:

- `name`, `email`, `reason` — never in span attributes.
- Confirmation code — never in span attributes or log lines.
- `STAFF_API_TOKEN` value — never anywhere outside the credential check.

Use a fixed placeholder (`[REDACTED]`) or omit the attribute entirely. Do not rely on a downstream scrubber — redact at the source.

The spec section is [Telemetry](../../appointment-booking-project.md#telemetry) and [NFR-010](../../appointment-booking-project.md#non-functional-requirements).

---
*When a situation this skill does not cover arises, see [escalation-protocol](escalation-protocol.md).*
