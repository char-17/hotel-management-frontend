# Standard: Software Architecture

> Load when: designing systems, defining layers/boundaries, evaluating structural decisions, applying DDD.

## Core Rules

1. **Dependencies point inward.** Domain logic depends on nothing framework-specific. Frameworks (Angular, Express, Spring) are delivery mechanisms at the edge.
2. **Separate by responsibility, not by file type alone.** Prefer feature-based structure (`features/orders/`) over purely technical layering when the app grows.
3. **One direction of data flow.** UI → service → domain → persistence. No layer skipping, no circular dependencies.
4. **Explicit boundaries.** Cross-boundary communication goes through interfaces/DTOs — never leak persistence entities or framework objects across layers.
5. **Composition over inheritance.** Inheritance only for true is-a relationships with stable base behavior.

## Standard Layering

```
presentation/   UI components, controllers, request/response DTOs
application/    use cases, orchestration, transaction boundaries
domain/         entities, value objects, domain services, business rules
infrastructure/ DB access, external APIs, framework adapters
```

- Small apps may merge `application` + `domain`, but never mix `presentation` with persistence.

## SOLID in Practice

| Principle | Concrete test |
|---|---|
| SRP | Can you describe the class/module in one sentence without "and"? |
| OCP | Can a new variant be added without editing existing switch/if chains? |
| LSP | Can any subtype replace its base without callers noticing? |
| ISP | Do implementors use every method of the interface they implement? |
| DIP | Do high-level policies depend on abstractions, not concrete adapters? |

## DDD — apply only when the domain is complex

- **Entities** have identity; **Value Objects** are immutable and compared by value.
- **Aggregates** define transactional consistency boundaries — one aggregate per transaction.
- **Ubiquitous language**: names in code match names the user/business uses.
- Skip DDD ceremony for CRUD apps — a service + repository is enough. Do not force it.

## Design Patterns — usage policy

- Patterns solve *recurring* problems. Name the problem first, then the pattern.
- Common legitimate uses: Strategy (replace conditionals on behavior), Factory (complex creation), Adapter (3rd-party isolation), Observer/pub-sub (decoupled events), Repository (persistence abstraction).
- **Anti-rule:** introducing a pattern "for flexibility" without a current second use case is over-engineering — reject it.

## Decision Records

For significant decisions (framework choice, data model, API shape), record a short ADR-style note in the repo (`docs/decisions/`): context → options → decision → consequences.

## Checklist

- [ ] No circular dependencies between standards/layers
- [ ] Domain logic is framework-free and unit-testable in isolation
- [ ] Public boundaries use DTOs/interfaces, not internal entities
- [ ] Every abstraction has ≥ 2 real usages or a documented near-term need
- [ ] New feature fits the existing structure; deviations are justified in writing
