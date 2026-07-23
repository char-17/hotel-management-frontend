# Standard: Angular — Services & Dependency Injection

> Level 2 (ΤΙ): rules for services, DI, and state ownership.

## Rules

1. **One service = one responsibility.** `AuthService`, `OrderService` — never a grab-bag `AppService`/`UtilsService`.
2. `providedIn: 'root'` by default; feature/route-level providers only when scoping is intentional (state per route instance) — comment why.
3. Services are the **only** owners of state and logic:
   - Data services: HTTP/Firestore access, typed DTOs in/out (see `standards/angular/http.md`).
   - State services: signals holding feature state + `computed()` derivations + methods that mutate.
   - Components never hold shared state and never call `HttpClient` directly.
4. Expose **read-only** state: `readonly items = this._items.asReadonly()` — mutations only through service methods, never by writing to exposed signals from outside.
5. `inject()` for dependencies; no circular service dependencies — if two services need each other, extract the shared part into a third.
6. Interceptors (functional, `HttpInterceptorFn`) handle cross-cutting HTTP concerns: auth tokens, error mapping, correlation ids — never duplicated per-service.
7. Guards are functions (`CanActivateFn`) and treat auth state as **async** (Observable/Promise) — never a snapshot boolean of an unresolved stream (page-refresh bug class).
8. Utilities without state are plain exported functions — not services.

## Testability requirement

Every service must be constructible in a test with its dependencies replaced (DI-provided, no hidden globals, no direct `window`/`document` access — use Angular abstractions or injection tokens).

## Checklist

- [ ] Single responsibility; correct providedIn scope
- [ ] State exposed read-only; mutations via methods
- [ ] No circular dependencies; cross-cutting HTTP in interceptors
- [ ] Guards async-safe; stateless helpers are plain functions
