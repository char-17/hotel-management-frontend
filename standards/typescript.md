# Standard: TypeScript

> Load when: writing or reviewing any TypeScript (frontend or backend).

## Compiler Baseline

`tsconfig` must have: `"strict": true`, `"noUncheckedIndexedAccess": true`, `"noImplicitOverride": true`, `"forceConsistentCasingInFileNames": true`. Do not weaken these to silence errors — fix the types.

## Typing Rules

1. **`any` is forbidden.** Use `unknown` at boundaries and narrow with type guards. `as` casts only with a comment justifying why the type is known.
2. **Model the domain with types.** Union types for finite states (`type Status = 'draft' | 'published' | 'archived'`) instead of booleans/enums-of-strings scattered around.
3. **Interfaces for object shapes, `type` for unions/intersections/utilities.** Be consistent within a project.
4. **DTOs are explicit.** API request/response shapes are declared types, colocated with the data service — never inferred from usage.
5. **Discriminated unions + exhaustive `switch`** (with `never` default check) for variant handling — the compiler catches missing cases.
6. **`readonly` by default** for properties and arrays that shouldn't mutate; `as const` for literal configs.
7. Return types on all exported functions — inference is fine for local helpers only.

## Null Safety

- Distinguish `undefined` (absent) from `null` (intentionally empty); pick one convention per project and stick to it.
- No non-null assertions (`!`) except immediately after an explicit check the compiler can't see — with a comment.
- Optional chaining/nullish coalescing (`?.`, `??`) over `&&`/`||` value fallbacks (`||` mishandles `0`/`''`).

## Generics

- Use generics to preserve type relationships (`function first<T>(arr: T[]): T | undefined`), not to look clever.
- Constrain them (`<T extends { id: string }>`) when the body relies on structure.
- If a generic parameter is used once and never relates two things, it's unnecessary — remove it.

## Utility Types

Prefer built-ins over hand-rolled shapes: `Partial`, `Required`, `Pick`, `Omit`, `Record`, `ReturnType`, `Awaited`. Derive variants from a single source-of-truth type instead of duplicating.

## Error Handling

- Typed error results at boundaries: either throw domain-specific `Error` subclasses or return a discriminated result (`{ ok: true, data } | { ok: false, error }`) — pick per project, be consistent.
- Caught errors are `unknown` — narrow before use.

## Checklist

- [ ] Zero `any`; `unknown` + narrowing at boundaries
- [ ] Finite states as unions; exhaustive switches
- [ ] Explicit DTO types for all I/O
- [ ] Exported functions have return types
- [ ] No `!` assertions without justification
