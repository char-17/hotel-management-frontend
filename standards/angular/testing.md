# Standard: Angular — Testing

> Level 2 (ΤΙ): Angular-specific testing rules. General strategy (pyramid, behavior-first, doubles policy) is in `standards/testing.md` — read that first.

## What gets tested, and how

| Unit | Tool | Focus |
|---|---|---|
| Services (logic/state) | Plain instantiation or `TestBed.inject` | Behavior of methods, signal state transitions |
| Data services | `provideHttpClientTesting` + `HttpTestingController` | Request shape (URL/method/body), DTO mapping, error mapping |
| Components | TestBed + Harnesses (or Testing Library) | Rendered output + user interaction — like a user |
| Validators / pipes | Plain function calls | Pure input → output |
| Guards / interceptors | `TestBed.runInInjectionContext` | Allow/deny paths, header/error behavior |

## Rules

1. **Test through the template, not the class**: click buttons, type into inputs, assert on rendered DOM/harness state — not on private fields or internal method calls.
2. Use **component harnesses** (`HarnessLoader`) for Material components — never query Material's internal DOM classes (they change between versions).
3. `HttpTestingController`: `expectOne` with URL+method, respond with realistic DTO fixtures, and `verify()` in `afterEach` — no unflushed requests.
4. Signals in tests: assert `component.value()` outputs and rendered results; for `effect`s call `TestBed.tick()`/`fixture.detectChanges()` as needed — no arbitrary `setTimeout` waits.
5. Async: `fakeAsync` + `tick()` for time-based logic (debounce, timers); real timers are a flakiness source and forbidden in unit tests.
6. Mock at the **service boundary**: components get stub services (jasmine spy / simple object with signals); services get mocked HTTP — not mocked components.
7. Firebase-backed services test against the **emulator suite** in integration tests (`standards/firebase/workflow.md`); pure logic around them stays unit-tested with stubs.
8. Every component test suite covers: renders with typical input, empty/edge input, user interaction emits/navigates correctly, loading/error states display.
9. Fixtures/builders per feature (`makeOrder(overrides)`) — no 200-line shared fixture files.
10. E2E (Playwright/Cypress) reserved for critical journeys (login, core business flow, checkout-equivalent) — everything else is covered lower in the pyramid.

## Checklist

- [ ] Behavior via DOM/harnesses; zero assertions on internals
- [ ] HTTP verified request-by-request with `verify()`; realistic fixtures
- [ ] `fakeAsync` for time; no real timers, no sleeps
- [ ] Loading/error/empty states tested, not just happy path
