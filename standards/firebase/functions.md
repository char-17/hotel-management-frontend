# Standard: Firebase — Cloud Functions

> Level 2 (ΤΙ): rules for Cloud Functions (HTTP, callable, background triggers).

## Rules

1. **Structure like a real backend**: handlers thin, logic in services, data access in repositories — an Express app inside a function follows `standards/express.md` in full.
2. **Auth first line**: callable functions verify `request.auth` (and required claims) before anything else; HTTP functions verify the ID token via middleware. No exceptions, even for "internal" functions.
3. **Validate every input** with a schema (zod) — callable `request.data` is as hostile as any HTTP body; whitelist fields, never spread client data into writes.
4. **Idempotency is mandatory**: retries and duplicate deliveries happen. Background triggers tolerate re-execution (idempotency keys, existence checks, transactions); money/critical writes are idempotent by design.
5. Region set explicitly and consistently on every function (match Firestore region); memory/timeout configured deliberately, not defaulted for heavy work.
6. Cold-start discipline: lazy-init heavy SDKs inside the handler scope where possible, minimal top-level imports, shared clients (Admin SDK) initialized once per instance.
7. **Secrets via `defineSecret`/Secret Manager** — never in code, never in plain env config committed to git.
8. Errors: callable functions throw `HttpsError` with proper codes (`unauthenticated`, `permission-denied`, `invalid-argument`, `not-found`) — clients get actionable codes, logs get the details. No stack traces to clients.
9. Structured logging (`logger.info/error` with context objects) — no `console.log` string soup, no sensitive data in logs.
10. Background trigger loops guarded: a trigger writing to the collection it listens on must provably terminate (guard field/condition) — infinite trigger loops burn quota fast.
11. Server timestamps and Admin SDK writes bypass rules — functions therefore enforce their OWN authorization; "rules will catch it" does not apply server-side.

## Checklist

- [ ] Auth + claims verified first; every input schema-validated
- [ ] Idempotent under retry; trigger loops provably terminate
- [ ] HttpsError codes for clients, structured logs for diagnosis
- [ ] Secrets in Secret Manager; region/memory explicit; lazy heavy init
