# Standard: Testing

> Load when: writing tests, fixing failing tests, or deciding what to test.

## Strategy

- **Test pyramid:** many unit tests (business logic), fewer integration tests (layers wired together, DB/emulator), few e2e tests (critical user journeys only).
- **Test behavior, not implementation.** Assert on outputs and observable effects — not on internal calls, private state, or DOM structure details. Refactoring must not break tests if behavior is unchanged.
- Coverage is a byproduct, not a goal: prioritize business rules, edge cases, error paths, and anything that has broken before. 100% coverage of getters is worthless.

## What Every Feature Must Cover

1. Happy path
2. Boundary values (empty, zero, max, off-by-one)
3. Invalid input → correct rejection/error
4. Failure of dependencies (API down, DB error) → correct handling
5. AuthZ: forbidden user is actually forbidden

## Structure & Naming

- **Arrange–Act–Assert**, visually separated; one behavior per test.
- Names state the scenario and expectation: `rejects_expired_token`, `returns 404 when order does not exist`.
- Tests are **independent and order-agnostic**; no shared mutable state; fresh fixtures per test (builders/factories over giant shared fixtures).
- No logic in tests (loops/conditionals) — parameterize instead (`test.each`, `@ParameterizedTest`).

## Test Doubles Policy

- Mock only what you don't own or can't run: external HTTP APIs, clocks, randomness, payment providers.
- **Do not mock the database when a real one is feasible** — use Testcontainers (JVM) or the Firebase emulator suite (Firestore/Auth/Functions). Mock/prod divergence has masked real failures before; this is a standing project rule.
- Never mock the unit under test or simple value objects.
- Fake clocks for time-dependent logic — no `sleep`-based tests.

## Per-Stack Notes

- **Angular:** component tests via TestBed + Harnesses (or Testing Library) — interact like a user (click, type), assert on rendered output; services tested as plain classes; `HttpTestingController` for data services.
- **Express/Node:** service logic as pure unit tests; routes via `supertest` against the wired app (validation + status codes + error envelope).
- **Spring Boot:** see `standards/spring-boot.md` (slice tests, Testcontainers).
- **Firebase:** security rules tested with `@firebase/rules-unit-testing` against the emulator.

## Flakiness

A flaky test is a **bug** — fix the root cause (awaits, fake timers, isolation), never re-run-until-green, never `skip` without a tracked reason.

## Checklist

- [ ] New/changed behavior has tests covering happy path + edges + error paths
- [ ] Tests assert behavior, run independently, contain no logic
- [ ] Real DB/emulator for integration; mocks only at true external boundaries
- [ ] All tests pass locally before presenting the work
