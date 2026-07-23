# Standard: JavaScript (ES2025+)

> Load when: writing plain JavaScript (scripts, Node tooling, code that can't be TypeScript).
> If the file *can* be TypeScript, prefer TypeScript — this module covers the cases where it can't.

## Language Baseline

- **ES Modules only** (`import`/`export`); no CommonJS in new code unless the runtime forces it.
- `const` by default, `let` when reassignment is required, `var` never.
- Strict equality (`===`/`!==`) always.
- Use modern built-ins over utility libraries: `structuredClone`, `Array.prototype.at/flatMap/toSorted`, `Object.groupBy`, `Promise.allSettled`, `AbortController`, optional chaining, nullish coalescing.

## Async

1. **`async/await` over raw `.then()` chains.** Mixing the two in one function is forbidden.
2. Every `await` inside a `try/catch` **or** the caller documented as the handler — no unhandled rejections.
3. Independent async operations run in parallel: `Promise.all([...])`, not sequential awaits.
4. Long-running/cancellable operations accept an `AbortSignal`.
5. Never fire-and-forget a promise silently; if intentional, mark it: `void doAsync(); // fire-and-forget: <reason>`.

## Functions & Structure

- Small, pure functions where possible; side effects isolated and named accordingly (`saveX`, `sendY`).
- Arrow functions for callbacks/lambdas; `function` declarations for top-level named logic (hoisting readability).
- Destructure parameters for options objects: `function create({ name, retries = 3 } = {}) {}`.
- No mutation of function arguments; return new values.

## Robustness Without a Type System

- **JSDoc types on all exported functions** (`@param`, `@returns`) — editors and `// @ts-check` can then verify usage.
- Validate external input (JSON, env vars, user data) at the entry point; fail fast with clear messages.
- Guard clauses over nested `if` pyramids — return early.

## Error Handling

- Throw `Error` (or subclasses), never strings.
- Use `cause` when wrapping: `throw new Error('Sync failed', { cause: err })`.
- `catch` blocks either handle meaningfully, enrich-and-rethrow, or don't exist — no empty catches, no `console.log`-and-continue in production paths.

## Checklist

- [ ] ESM, `const`-first, `===`
- [ ] `async/await`, parallelized where independent, no unhandled rejections
- [ ] JSDoc on exported functions; `// @ts-check` where feasible
- [ ] External input validated at the boundary
- [ ] No argument mutation, no empty catch blocks
