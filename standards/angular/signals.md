# Standard: Angular — Signals

> Level 2 (ΤΙ): rules for using the signal APIs correctly.
> For WHEN to choose signal vs Observable vs Resource vs linkedSignal vs effect → `best-practices/angular/state-management.md` (required reading).

## Rules

1. **Signals are the default for component/feature state** in new code: `signal()` for writable state, `computed()` for anything derivable.
2. Derive, don't duplicate: if a value can be computed from existing signals, it MUST be a `computed()` — never a second `signal()` kept in sync manually.
3. Update via `set`/`update` only. Signal values are treated as **immutable**: replace arrays/objects (`update(list => [...list, item])`), never mutate in place — OnPush and `computed` depend on reference changes.
4. `effect()` is for **side effects only** (logging, localStorage, imperative DOM/3rd-party APIs) — never for deriving state (that's `computed`) and never for syncing signal → signal (that's `computed` or `linkedSignal`). Writing to signals inside an effect is a red flag requiring justification.
5. `linkedSignal()` for writable state that **resets when a source changes** (e.g., selection resets when the list reloads).
6. Component inputs: `input()` / `input.required()`; two-way: `model()`. Route params via `withComponentInputBinding`.
7. RxJS boundary: `toSignal()` to consume streams in templates (provide `initialValue` or handle `undefined`), `toObservable()` when a signal must feed an RxJS pipeline. Convert at the edge — don't ping-pong between the two worlds inside one service.
8. `untracked()` only to read a signal inside an effect/computed without creating a dependency — with a comment explaining why.
9. Naming: state signals are nouns (`items`, `selectedId`); computed are descriptive (`visibleItems`, `canSubmit`); private writable + public readonly pattern in services.

## Forbidden

- Manual subscription bookkeeping to mirror an Observable into a signal (use `toSignal`).
- `effect()` chains where one effect writes state another effect reads — restructure as `computed`/`linkedSignal`.
- Storing derived values in the DB/state because "computing is annoying".

## Checklist

- [ ] All derivable values are `computed`; zero manually-synced duplicates
- [ ] Immutable updates everywhere
- [ ] Effects contain only true side effects
- [ ] RxJS↔signals conversion happens once, at the boundary
