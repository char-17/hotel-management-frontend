# Standard: Express.js

> Load when: building or modifying Express APIs — including Express apps inside Firebase Cloud Functions.
> Written for Express 5 + TypeScript. Combine with `standards/security.md` for anything auth/input related.

## Structure

```
src/
  routes/        route definitions only — wire paths to controllers
  controllers/   HTTP layer: parse request, call service, shape response
  services/      business logic — no req/res objects here, ever
  repositories/  data access (DB / Firestore / external APIs)
  middleware/    auth, validation, error handling, logging
  schemas/       request/response validation schemas (zod or similar)
```

- Controllers are thin; services are framework-free and unit-testable.
- `req`/`res` never travel below the controller layer.

## Routing & Controllers

- RESTful resource naming: plural nouns (`/api/orders/:id`), verbs via HTTP methods only.
- Version the API from day one: `/api/v1/...`.
- Async handlers always wrapped so rejections reach the error middleware (Express 5 does this natively; on Express 4 use an `asyncHandler` wrapper).
- Correct status codes: 200/201/204 success, 400 validation, 401 unauthenticated, 403 unauthorized, 404 not found, 409 conflict, 500 unexpected. Never 200-with-error-body.

## Validation

- **Every input is validated with a schema** (zod recommended): body, params, query — via middleware before the controller runs.
- Validated data is typed from the schema (`z.infer`) — the controller never touches raw `req.body`.
- Whitelist fields explicitly; never spread `req.body` into a DB write (mass assignment).

## Error Handling

- One **central error middleware** (4-arg) at the end of the chain: maps known domain errors → status codes, logs unexpected errors with stack, returns a consistent JSON envelope `{ error: { code, message } }`.
- Never leak stack traces or internal messages to clients in production.
- Domain errors are typed classes (`NotFoundError`, `ValidationError`, `ForbiddenError`) thrown from services.

## Middleware Order (canonical)

```
security headers (helmet) → CORS (explicit origins) → body parsing (with size limit)
→ request logging → rate limiting (auth/expensive routes) → auth → routes → 404 → error handler
```

## Config & Lifecycle

- All config via environment variables, validated at startup (fail fast if missing) — no secrets in code.
- Graceful shutdown: close server and DB connections on SIGTERM (not applicable inside Cloud Functions).

## Checklist

- [ ] Layered: routes → controllers → services → repositories; no `req`/`res` below controllers
- [ ] Every route input schema-validated; no raw `req.body` usage
- [ ] Central error middleware; consistent error envelope; correct status codes
- [ ] helmet + explicit CORS + body size limits + rate limiting on sensitive routes
- [ ] Config from validated env vars
