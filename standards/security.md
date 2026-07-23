# Standard: Application Security (OWASP-aligned)

> Load when: anything touching auth, user input, data storage, secrets, file handling, or external calls.
> Baseline: OWASP Top 10 + ASVS. Security findings are **blocking** — fix before shipping.

## Input & Output

1. **All external input is hostile** until validated: HTTP bodies/params/headers, query strings, file uploads, webhook payloads, env-provided URLs.
2. Validate with **schemas + allowlists** at the boundary (zod / Bean Validation / rules); reject, don't sanitize-and-hope.
3. **Injection defenses:**
   - SQL: parameterized queries only — never string concatenation.
   - XSS: rely on framework escaping (Angular default); `bypassSecurityTrust*` / `innerHTML` with user data is forbidden without sanitization and justification.
   - Command: never interpolate user input into shell commands; use exec APIs with argument arrays.
   - Path traversal: resolve and verify paths stay inside the allowed root before file access.
4. Output encoding matches the sink (HTML, attribute, URL, JSON).

## Authentication & Authorization

- Never build custom crypto or password storage — use the platform (Firebase Auth, Spring Security + bcrypt/argon2).
- **AuthN ≠ AuthZ**: after identifying the user, check *permission for this specific resource* (object-level checks — the #1 OWASP API risk). "Hidden in the UI" is not authorization.
- Server-side enforcement always; roles via server-set claims/records, never client-asserted.
- Sessions/tokens: short-lived access tokens, secure storage (httpOnly cookies where applicable), logout invalidates server-side state where it exists.
- Rate-limit login and other sensitive endpoints; generic error messages (no user enumeration).

## Secrets & Data

- **No secrets in code, git history, logs, or client bundles.** Env vars / secret managers only. Anything shipped to the browser is public — including Angular `environment.ts`.
- If a secret ever lands in git: rotate it — deleting the commit is not enough.
- Log **events**, not payloads: never log passwords, tokens, full card/ID numbers, or personal data. Mask where context is needed.
- Personal data: collect the minimum, encrypt in transit (TLS everywhere) and at rest where the platform supports it.

## HTTP Hardening (web apps/APIs)

- Security headers (helmet or equivalent): CSP, `X-Content-Type-Options`, `Referrer-Policy`, HSTS in prod.
- CORS: explicit origin allowlist — never `*` with credentials.
- Request body size limits; upload type + size validation (content-based, not extension-only).
- CSRF protection for cookie-based sessions.

## Dependencies

- Prefer well-maintained, widely-used packages; check before adding new ones.
- `npm audit` / dependency scanning acted on for high/critical findings; lockfiles committed.

## Review Protocol

When asked for a security review, examine in order: entry points → auth/authz on each → input validation → data flows to sinks (DB/HTML/shell/files) → secrets handling → error/log leakage → dependencies. Report findings by severity: **Critical / High / Medium / Low**, each with location, exploit scenario, and a concrete fix.

## Checklist

- [ ] Every entry point validated (schema + allowlist); parameterized queries everywhere
- [ ] Object-level authorization on every resource access; server-side enforcement
- [ ] No secrets in code/client/logs; TLS everywhere
- [ ] Security headers, strict CORS, body limits, rate limiting on sensitive routes
- [ ] Errors don't leak internals; logs don't leak data
