# Best Practice: Angular — Choosing the Right State Primitive

> Level 3 (ΠΩΣ): the decision guide for signal() vs computed() vs linkedSignal() vs effect() vs Observable vs Resource.
> The mechanics of each live in `standards/angular/signals.md` and `standards/angular/rxjs.md` — this file is about **choosing**.

## The Decision Table

| You have… | Use | Why |
|---|---|---|
| A value the component/feature owns and changes | `signal()` | Synchronous state with reactive reads — the default |
| A value derivable from other state | `computed()` | Derivations must never be stored — they desync |
| Writable state that must **reset when a source changes** | `linkedSignal()` | Selection resets when the list reloads — without effect hacks |
| Async data driven by reactive params (id, filters) | `resource()` / `rxResource()` | Loading/error/value + cancellation of stale requests, built in |
| **Events over time** (typing, websocket, router, valueChanges) | Observable | Time, ordering, cancellation semantics — RxJS's home turf |
| A stream the template should read | `toSignal()` at the boundary | One conversion point; template stays signal-simple |
| A true side effect (localStorage, analytics, imperative 3rd-party API) | `effect()` | The ONLY legitimate effect use — not state derivation |

## Decision Rules (in order)

1. **Start by asking: is it state, a derivation, an event stream, or a side effect?** Misclassifying here causes every downstream mess.
2. **State → `signal()`.** If two pieces of state must always agree, one of them isn't state — it's a `computed()`.
3. **Derivation → `computed()`, always.** The moment you write "update X whenever Y changes" for data, you wanted `computed` (or `linkedSignal` if X must also be user-writable).
4. **User-writable + source-driven → `linkedSignal()`.** Classic cases: selected item resets on list reload; form default follows a loaded entity but the user can edit. Before `linkedSignal`, people did this with `effect` writing to a `signal` — that pattern is now a code smell.
5. **Async fetch driven by params → `resource`/`rxResource`.** It replaces the hand-rolled trio (loading signal + data signal + error signal + switchMap). Hand-roll only when you need semantics resource doesn't offer (queued writes, optimistic updates).
6. **Events over time → Observable.** Debounced search input, drag streams, websocket feeds, router events. Compose in RxJS, then `toSignal()` **once** at the edge for the template. Don't rebuild `debounceTime` with effects and setTimeout.
7. **`effect()` last.** Before writing one, ask: "am I deriving state?" → `computed`/`linkedSignal`; "am I fetching?" → `resource`; "am I reacting to an event?" → Observable. If it's genuinely a side effect on the outside world — then `effect`, kept tiny.

## Smells → Corrections

| Smell | Correction |
|---|---|
| `effect()` that writes to another signal | `computed()` or `linkedSignal()` |
| Two signals updated together everywhere | Second one becomes `computed()` |
| `loading`/`error`/`data` signal triplet + manual switchMap | `resource()` / `rxResource()` |
| `.subscribe(v => this.sig.set(v))` | `toSignal()` |
| Signal ↔ observable converted back and forth in one file | Pick the home per `1.`, convert once at the boundary |
| BehaviorSubject as feature state store | Signals in a state service |

## Scaling Up

- Feature state lives in a **signal-based state service** (private writable, public readonly + computed). This covers the vast majority of apps.
- Reach for a store library (NgRx SignalStore) only when multiple features share complex state with devtools/undo/entity needs — not by default. Adding a store to a CRUD feature is over-engineering; say so in review.
