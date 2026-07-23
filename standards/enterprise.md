# Standard: Enterprise Cross-Cutting Concerns

> Load when: setting up logging, configuration, error handling strategy, documentation, or observability — the concerns every serious app shares.

## Error Handling Strategy (app-wide)

1. **One consistent strategy per project**, decided once: typed domain errors thrown from business logic, translated at the boundary (HTTP error middleware / ControllerAdvice / Angular ErrorHandler + interceptor).
2. Errors carry: stable machine code (`ORDER_NOT_FOUND`), human message, and context (ids, not payloads).
3. User-facing messages are friendly and in the UI language; technical detail goes to logs only.
4. Global handlers exist so **nothing fails silently**: unhandled rejections, uncaught exceptions, and HTTP errors all land somewhere visible.

## Logging & Observability

- Structured logging (JSON in prod) with levels used honestly: `error` = needs action, `warn` = degraded, `info` = business events, `debug` = local diagnosis.
- Every request/operation carries a correlation id from edge to logs.
- Log events and identifiers — never secrets or personal data (see `standards/security.md`).
- Minimum production visibility: error reporting, request latency, and a health endpoint. Alerts on error-rate spikes, not on every single error.

## Configuration

- 12-factor: config from environment; identical code across environments.
- All required config **validated at startup** — fail fast with a clear message listing what's missing.
- One typed config object/schema per app; no scattered `process.env` / `@Value` reads through the codebase.
- Feature differences between environments are explicit flags, not `if (env === 'prod')` scattered logic.

## Documentation (the minimum that must exist)

- `README.md`: what the project is, prerequisites, how to run locally (exact commands, including emulators), how to test, how to deploy.
- API surface documented where consumed by others (OpenAPI for REST when the API has external consumers).
- Architecture decisions recorded as short ADRs (`docs/decisions/`) — see `standards/architecture.md`.
- Docs live next to the code and are updated **in the same commit** as the change that invalidates them.

## Dependency & Versioning Policy

- Every new dependency is justified: maintained, popular, license-compatible, and worth its weight vs. writing 30 lines yourself.
- Lockfiles committed; upgrades are deliberate commits with changelog reading — never drive-by.
- App versioning: tag releases; keep a human-readable CHANGELOG for anything with real users.

## Internationalization & Formatting

- User-facing strings centralized (i18n mechanism or constants) — no hardcoded literals scattered in templates when the app targets Greek + English audiences.
- Dates/currency formatted via `Intl` / framework pipes with explicit locale — never manual string assembly.

## Checklist

- [ ] One error strategy: typed errors, boundary translation, nothing silent
- [ ] Structured logs with correlation ids; no sensitive data logged
- [ ] Config validated at startup from environment; no scattered env reads
- [ ] README run/test/deploy instructions actually work
- [ ] New dependencies justified; docs updated in the same commit
