# Standard: Angular — HTTP & Data Access

> Level 2 (ΤΙ): rules for communicating with backends (REST APIs, Firebase SDK calls follow the same layering).

## Layering

1. **Components never touch `HttpClient` (or Firebase SDKs) directly.** All I/O goes through dedicated data services (`OrderApiService`, `PortfolioDataService`).
2. Data services do exactly: build request → typed response → map to domain model. No UI state, no navigation, no toasts — those belong to callers/state services.
3. **DTO types are explicit** and colocated with the data service; the service maps DTO → domain model at the boundary (`standards/typescript.md`). Never let raw API shapes leak into components.

## Rules

4. `provideHttpClient(withInterceptors([...]))` — functional interceptors for: auth token attachment, API base URL, error mapping, correlation id. One concern per interceptor.
5. Error strategy is **centralized**: the error interceptor maps HTTP failures to typed app errors (`NotFoundError`, `UnauthorizedError`, `NetworkError`); 401 triggers the auth flow in ONE place. Components handle only what they can act on (show message, retry button).
6. Every request the user awaits has visible state: loading / success / error — modeled as a state signal or `Resource`, not booleans scattered ad hoc. (Which mechanism → `best-practices/angular/state-management.md`.)
7. Cancellation: navigation-driven or superseded requests are cancelled (`switchMap` on params, or unsubscribed via `takeUntilDestroyed`) — no orphan requests writing stale state.
8. Query params via `HttpParams`, headers via `HttpHeaders` — never string-concatenated URLs with user input.
9. Retries: only idempotent GETs, only transient failures, bounded (`retry({ count: 2, delay })`). Never retry POSTs automatically.
10. Caching is deliberate: `shareReplay` for per-session static data, or an explicit cache service with invalidation — comment the invalidation story. No accidental duplicate in-flight requests for the same resource.
11. **No secrets in the client.** Anything in the Angular bundle (environment files included) is public — API keys there must be restricted server-side (see `standards/security.md`).

## Checklist

- [ ] All I/O behind data services; explicit DTOs mapped at the boundary
- [ ] Interceptors: auth, errors, base URL — one concern each; 401 handled once
- [ ] Loading/error state visible for every awaited request; stale responses cancelled
- [ ] No auto-retry on mutations; caching has an invalidation story
