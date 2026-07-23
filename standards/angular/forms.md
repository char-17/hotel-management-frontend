# Standard: Angular — Forms

> Level 2 (ΤΙ): rules for forms. Default: **typed Reactive Forms** for anything beyond a trivial single field.

## Rules

1. **Typed forms always**: `FormGroup<{...}>` / `FormControl<T>` — use `nonNullable` controls unless null is a real state. No untyped `FormGroup` in new code.
2. Form definition lives in the component (or a form-builder function for reuse) — **validation rules live with the definition**, not scattered in the template.
3. Built-in validators first; custom validators are pure functions (`ValidatorFn`) in their own file, unit-tested. Async validators only for server checks (uniqueness) — debounced.
4. Cross-field validation at the group level (e.g., password/confirm) — not by patching individual control errors.
5. **Error UX is explicit**: one message per error type, shown after touch/submit (not while typing the first character); the submit attempt marks all as touched.
6. Submit handling:
   - Guard: `if (form.invalid) return;` after marking touched.
   - Disable submit while the request is pending (prevent double-submit — or `exhaustMap` on a submit stream).
   - Backend errors surface to the user (form-level or mapped to fields) — never fail silently.
7. Reset with `form.reset(initialValues)` after success when the form stays open; repopulate with `patchValue` for edits.
8. `valueChanges` streams follow `standards/angular/rxjs.md` (debounce user input, teardown, `distinctUntilChanged`).
9. Template-driven forms (`ngModel`) are allowed only for trivial, single-control cases (a search box) — never for validated multi-field forms.
10. File inputs and other native controls wrap in reusable ControlValueAccessor components when used more than once.

## Checklist

- [ ] Typed, nonNullable-by-default controls; validators with the definition
- [ ] Custom validators pure + tested; cross-field at group level
- [ ] Explicit per-error messages; touched-on-submit behavior
- [ ] Double-submit prevented; backend errors shown to the user
