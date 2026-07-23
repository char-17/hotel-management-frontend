# Standard: Firebase — Security Rules

> Level 2 (ΤΙ): rules for Firestore/Storage security rules. This is the ONLY real boundary for client SDK access — treat every rule change as security-critical (`standards/security.md` applies).

## Rules

1. **Default deny.** The rules file starts from nothing-allowed; every `allow` is explicit, narrow, and justified.
2. Client-side checks are UX, not security — anything a client can write must be validated in rules.
3. **Admin/role checks via custom claims**: `request.auth.token.admin == true`. Claims are set ONLY server-side (Admin SDK script / Cloud Function) — never client-settable role fields on user documents used for authorization.
4. Object-level authorization: ownership checks compare against `request.auth.uid` (`resource.data.ownerId == request.auth.uid`) — "logged in" alone is almost never sufficient for writes.
5. **Shape validation on every client-writable collection**: check `request.resource.data` — allowed fields (`.keys().hasOnly([...])`), types, value ranges, and that protected fields (ownerId, createdAt, role) are not overwritten on update.
6. `get()`/`exists()` calls in rules are minimized (they cost reads and latency) — prefer claims and denormalized flags where possible.
7. Reads are scoped: list operations constrained so users can only query their own data where applicable (query-based rules with `request.query` limits when needed).
8. Functions in rules (`function isOwner() {...}`) for anything used twice — rules files stay readable.
9. **Rules are code**: versioned in git (`firestore.rules`, `storage.rules`), reviewed like code, and **tested against the emulator** (`@firebase/rules-unit-testing`) before deploy — minimum: allowed-user succeeds, forbidden-user fails, malformed shape fails.
10. Storage rules mirror the same discipline: path-scoped ownership, content-type and size checks on upload.

## Checklist

- [ ] Default deny; every allow narrow and explicit
- [ ] Roles via server-set claims; ownership via uid comparison
- [ ] Shape validation with hasOnly + protected-field locks on writable collections
- [ ] Rules tested on the emulator (allow + deny + malformed cases) before deploy
