# Best Practice: Architecture Decisions

> Level 3 (ΠΩΣ): the judgment layer over `standards/architecture.md` — when to apply how much architecture.

## The core judgment: match ceremony to complexity

Architecture is bought with complexity. Buy exactly as much as the problem requires:

| Project reality | Right-sized architecture |
|---|---|
| CRUD app, one dev, simple domain | Feature folders + services + repositories. **No DDD ceremony**, no use-case classes, no CQRS |
| Real business rules (pricing, workflows, permissions matrices) | Extract a framework-free domain layer; entities/value objects where invariants live |
| Complex domain, evolving rules, multiple bounded areas | Full DDD: aggregates, ubiquitous language, explicit bounded contexts |
| Multiple apps sharing logic | Extract shared packages/libs — only at the second real consumer, not speculatively |

Applying enterprise patterns to a small app is as much an architecture failure as spaghetti in a big one — review both directions with equal severity.

## When to introduce a design pattern

Ask in order: (1) What recurring problem exists **now**? (2) Does the simplest fix (a function, a map) solve it? (3) Only then, the named pattern.

- Strategy: when the *third* behavioral variant of the same operation appears — not the second (`if/else` is fine for two).
- Factory: when construction logic is duplicated or conditional across call sites — not for `new X()` behind a wrapper.
- Adapter: at every 3rd-party boundary you might replace or must test around (payment, mail, storage) — this one IS worth doing early.
- Observer/events: when two modules must stay decoupled — not within one feature where a direct call is honest and traceable.

## When to create an abstraction (interface/base class/helper)

- **Rule of three** for helpers/utilities; rule of two for 3rd-party adapters and anything crossing a layer boundary.
- An interface with exactly one implementation and no test-seam or boundary purpose is noise — delete it.
- Wrong abstraction is worse than duplication: if consumers keep needing flags/params to bend the shared thing, inline it back and let the copies diverge.

## Monolith vs services (and frontend equivalents)

- Default: **modular monolith** — clean internal boundaries, single deploy. Split into separate services/apps only for a concrete driver: independent scaling, separate team ownership, isolation of a risky dependency.
- Never split for "cleanliness" — a network boundary multiplies every cost (versioning, latency, partial failure, ops).

## Deciding and recording

- Two viable designs → short trade-off comparison (complexity, testability, migration cost, reversibility) + one recommendation, presented to the user **before** coding.
- Prefer **reversible** decisions; where irreversible (data model, public API contract), slow down and get explicit approval.
- Significant decisions get a 5-line ADR in `docs/decisions/`: context → options → decision → consequences. Future-you will not remember why.

## Consistency beats purity

An existing codebase's established pattern wins over the theoretically better one — mixed patterns cost more than either pattern alone. Propose a migration explicitly if the old pattern is genuinely harmful; never introduce a parallel second way silently.
