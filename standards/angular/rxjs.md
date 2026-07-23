# Standard: Angular — RxJS

> Level 2 (ΤΙ): rules for streams. RxJS is used where it excels — events over time, async composition, HTTP — not as a general state container (signals own state; see `best-practices/angular/state-management.md`).

## Subscription Rules (the #1 leak source)

1. **Prefer never subscribing manually**: `async` pipe or `toSignal()` in components.
2. When manual subscription is unavoidable: `takeUntilDestroyed()` (in injection context) — no bare `.subscribe()` without teardown, ever.
3. One subscription per intent — no nested `.subscribe()` inside `.subscribe()` (that's a flattening operator's job).
4. HTTP observables complete on their own, but route/valueChanges/interval streams do NOT — treat every non-HTTP stream as a leak until proven bounded.

## Operator Rules

5. Choose the flattening operator **deliberately** — wrong choice = race-condition bug:
   - `switchMap`: only the latest matters (search, route param → load) — cancels previous.
   - `concatMap`: order matters, all must run (queued writes).
   - `mergeMap`: parallel, order irrelevant — bound concurrency when the source is unbounded.
   - `exhaustMap`: ignore triggers while busy (submit buttons, login).
6. User-input streams: `debounceTime` + `distinctUntilChanged` before hitting the network.
7. Multicast shared streams: `shareReplay({ bufferSize: 1, refCount: true })` — comment why sharing is needed; beware `refCount: false` keeping sources alive.
8. Pipelines stay **short and named**: > 4-5 operators → extract to a well-named function or intermediate observable.
9. No logic in `subscribe` callbacks beyond assignment/dispatch — transformation belongs in the pipe.

## Error Handling

10. `catchError` placement is deliberate: **inside** the inner observable of a flattening operator when the outer stream must survive errors (e.g., a failed save must not kill the form's stream).
11. Errors surface to the user or the central handler — never `catchError(() => EMPTY)` silently without a comment justifying it.
12. `retry({ count, delay })` only for transient failures (network), never for 4xx.

## Checklist

- [ ] No unmanaged subscriptions; no nested subscribes
- [ ] Flattening operator chosen per semantics (switch/concat/merge/exhaust)
- [ ] Shared streams multicast deliberately; long pipes extracted and named
- [ ] Errors handled where the stream must survive; nothing swallowed silently
