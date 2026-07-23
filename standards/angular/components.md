# Standard: Angular — Components

> Level 2 (ΤΙ): rules for writing components. For the judgment calls (when to split, smart vs dumb) see `best-practices/angular/component-design.md`.

## Structure

```
src/app/
  core/        singletons: auth, interceptors, guards, app-wide services
  shared/      dumb reusable components, pipes, directives (no business logic)
  features/    one folder per feature — components + feature services + routes
```

## Rules

1. **Standalone components only** — no new NgModules. Lazy-load features via `loadComponent`/`loadChildren`.
2. `changeDetection: ChangeDetectionStrategy.OnPush` on **every** component, no exceptions.
3. Components are **thin**: presentation and user interaction only. Business logic, data fetching, and orchestration live in services.
4. Inputs/outputs via signal APIs: `input()`, `input.required()`, `output()`, `model()` for two-way. No `@Input()`/`@Output()` decorators in new code.
5. Dependency injection via `inject()` — not constructor parameters — in new code.
6. New control flow only: `@if`, `@for` (with **mandatory** `track`), `@switch`, `@defer`. No `*ngIf`/`*ngFor` in new code.
7. No function calls in templates for derived values — use `computed()` or pure pipes.
8. Host bindings via the `host` metadata object, not `@HostBinding`/`@HostListener` decorators.
9. One component per file; selector prefixed with the app prefix; file naming per Angular style guide (`user-card.component.ts`).
10. Shared components receive inputs and emit outputs — they never inject feature services or reach into global state.

## Templates & UX (project conventions — non-negotiable)

- **Modals/dialogs never close on outside click or Escape** — only explicit ✕ / Cancel / Save buttons.
- No browser `confirm()`/`alert()` — in-app UI only.
- Every interactive element is reachable by keyboard; images have `alt`; buttons have discernible text (a11y baseline).
- User-visible strings follow the project's i18n approach — no hardcoded mixed-language literals.

## Checklist

- [ ] Standalone + OnPush + signal-based inputs/outputs
- [ ] No business logic or HTTP in the component
- [ ] `@for` has `track`; no function calls in template expressions
- [ ] Modal/dialog behavior follows the project convention
- [ ] Shared components are pure input/output
