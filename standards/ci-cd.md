# Standard: CI/CD

> Load when: creating or modifying pipelines, build scripts, or deployment processes.
> Changes to CI/CD affect shared infrastructure — always confirm with the user before modifying existing pipelines.

## Principles

1. **The pipeline is the gatekeeper**: nothing reaches `main`/production without passing it. No manual "it works on my machine" deploys for team projects.
2. **Fail fast, fail loud**: cheapest checks first (lint/typecheck) → tests → build → deploy.
3. **Reproducible builds**: pinned tool versions, committed lockfiles, `npm ci` (never `npm install` in CI), clean checkout.
4. Same artifact promoted across environments — build once, deploy many; environment differences come from config, not rebuilds.

## Canonical Pipeline Stages

```
lint + typecheck  →  unit tests  →  build  →  integration tests (emulators/Testcontainers)
→ [main only] deploy to staging → smoke check → manual approval → deploy to production
```

- PR pipelines run through build + tests; deploy stages run only from `main`/tags.
- Every stage's failure blocks the next; no `continue-on-error` on quality gates.

## Secrets & Config in CI

- Secrets live in the CI provider's secret store (GitHub Actions secrets, etc.) — never in workflow files or logs.
- Least privilege: deploy tokens scoped to the target project only (e.g., `firebase login:ci` token or workload identity per project).
- Verify the **target project ID** explicitly in the deploy command — never rely on a default (`firebase deploy --project <id> --only ...`).

## Deployment Rules

- Deployments are **explicit, logged, and reversible**: know the rollback path before deploying (previous artifact / `firebase hosting:rollback` / previous image).
- Database migrations run before app deploy and are backward-compatible (see `standards/database.md`); destructive migrations are decoupled and manually approved.
- Zero-downtime as default goal; anything requiring downtime is announced and approved first.
- After deploy: smoke-check the critical path (login + one core flow) before declaring success.

## GitHub Actions Conventions (default provider)

- One workflow per concern (`ci.yml`, `deploy.yml`); reusable steps via composite actions when duplicated.
- Pin action versions (`actions/checkout@v4`, not `@main`).
- Cache dependencies keyed on the lockfile hash.
- Concurrency groups to cancel superseded PR runs.

## Checklist

- [ ] Lint/typecheck/tests/build gate every PR; deploys only from `main`
- [ ] `npm ci` + lockfile; pinned action/tool versions
- [ ] Secrets in the secret store; project ID explicit in deploy commands
- [ ] Rollback path known; migrations backward-compatible; post-deploy smoke check
- [ ] Existing pipeline changes confirmed with the user first
