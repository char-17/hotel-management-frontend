# Standard: Firebase — Development Workflow, Auth & Deployment

> Level 2 (ΤΙ): the mandatory local/prod workflow. This reflects the user's actual setup — follow it exactly.

## Local Development (mandatory)

1. **All development runs against the emulator suite** — production data is touched only with explicit user approval.
   - Root: `firebase emulators:start` — projects keep saved state via import/export in `emulator-data/`; preserve that flow (`--import`/`--export-on-exit`).
   - Frontend: `npm start` in the client directory (`clients/`, `frontend/` — check the project).
2. Emulator connection code (`connectFirestoreEmulator`, etc.) is environment-gated — it must be impossible to ship a build pointing at emulators.
3. Seed/demo data lives in the emulator export — not in ad-hoc scripts that drift.

## Auth & Roles

4. Roles via **custom claims**, set by a server-side Admin SDK script (e.g., `set-admin-*.mjs` pattern) — never from client code.
5. After a claim change the client must **refresh the ID token** (`getIdToken(true)`) — otherwise the old claims stick until expiry.
6. Angular guards treat auth as **async** (Observable/Promise) — snapshot booleans break on page refresh (known bug class, already fixed once; do not reintroduce).
7. Sensitive operations are enforced server-side (rules or Functions) even when the UI hides them.

## Deployment

8. Deploys are **explicit and user-approved** — never a side effect of another task.
9. Before any deploy: verify the active project (`firebase use`) — project IDs can differ from display names (e.g., `-9c450` suffixes). Prefer `--project <id>` explicitly.
10. Targeted deploys: `firebase deploy --only hosting,firestore,functions` — deploy only what changed. **PowerShell: quote comma lists** (`--only 'hosting,functions'`).
11. `firebase.json`, `firestore.rules`, `firestore.indexes.json` are versioned in git — the console is never the source of truth. Console-made changes get pulled back into the repo immediately.
12. Hosting: SPA rewrite to `index.html`; static assets cached aggressively; `index.html` no-cache. Rollback path: `firebase hosting:rollback` / redeploy previous commit — know it before deploying.

## Checklist

- [ ] Emulators for all dev; emulator wiring environment-gated
- [ ] Claims server-set; token refreshed after changes; guards async
- [ ] Correct `--project` verified; targeted `--only` deploys; PowerShell quoting
- [ ] Config/rules/indexes in git; rollback path known
