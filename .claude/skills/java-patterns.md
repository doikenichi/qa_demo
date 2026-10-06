---
name: java-patterns
description: The architectural patterns this codebase uses and the ones it refuses, so an abstraction arrives when a second caller does.
---

# Java Patterns

## Patterns in use

These patterns are in scope for this codebase. Introduce each only when the problem it solves is present.

**Ports and adapters (hexagonal architecture)**
The domain core (`booking-service` business logic) depends on interfaces (ports), not on Spring, the database, or Kafka. Adapters implement the ports: REST controllers, JPA repositories, Kafka producers. This keeps the domain testable without a running server.

**Repository**
Data access for a single aggregate root goes through one repository interface. The repository does not leak query details into the domain. One database per service — `booking-service` and `notification-service` each own their schema.

**Transactional outbox**
Booking state changes and their event rows commit in one transaction. A separate relay reads and publishes the outbox. This is why rule 20 is provable — see [Domain events and notification records](../../appointment-booking-project.md#domain-events-and-notification-records).

**Fenced lease**
Each idempotency claim holds a `claimToken`. Takeover is only allowed after `expiresAt`, and only by writing a new token. Committing a booking checks that the committer's token still holds the claim, under a row lock. See [Idempotent booking creation](../../appointment-booking-project.md#idempotent-booking-creation).

**Idempotency store**
The fingerprint (SHA-256 over canonical payload) is stored with the response. A key that resolves to a matching fingerprint replays the stored response. A key with a mismatched fingerprint is a conflict. See the same section.

## The rule on abstraction

An abstraction is introduced when a **second caller** arrives — not in anticipation of one. Three similar lines are better than a premature abstraction. Do not design for hypothetical future requirements.

## Patterns refused

- No Spring `@Autowired` field injection — constructor injection only (testable, explicit).
- No service-layer classes that are thin pass-throughs to the repository — the domain logic belongs in a domain object or service, not scattered across layers.
- No virtual threads — not yet authorised (see `code-standard`).
- No shared mutable state between tests — see `deterministic-tests`.

---
*When a situation this skill does not cover arises, see [escalation-protocol](escalation-protocol.md).*
