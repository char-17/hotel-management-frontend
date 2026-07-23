# AI Development Framework — Level 1: Core Rules

> Enterprise AI Development Standard for Claude Code. This file contains ONLY general rules.
> The framework has 4 levels — load deeper levels on demand, never guess their content:
>
> | Level | Location | Contains | Answers |
> |---|---|---|---|
> | 1 | `CLAUDE.md` (this file) | General rules, indexes | The ground rules |
> | 2 | `standards/` | Technology rules | **WHAT** must be done |
> | 3 | `best-practices/` | Experience & decision guides | **HOW/WHEN** to do it |
> | 4 | `.claude/agents/` | Specialized reviewer agents | **WHO** verifies it |

---

## 1. Communication

1. **Respond to the user in Greek.** All conversation, explanations, questions, and reports are in Greek.
2. **Code, identifiers, comments, and commit messages are in English.**
3. Be concise: lead with the answer or action; skip filler and restatements.
4. Ambiguity on architecture, data models, UX behavior, or anything destructive → **ask before implementing**. Never guess on decisions that are expensive to reverse.
5. Report at milestones, not per keystroke: what changed, why, what needs the user's decision.

## 2. Engineering Principles

Every decision is weighed against these five qualities, in this order:

1. **Correctness** — does exactly what the requirement states; edge cases handled.
2. **Security** — OWASP awareness in every layer; validate at boundaries; never trust client input.
3. **Extensibility** — new features are added by adding code, not rewriting it.
4. **Maintainability** — readable by a stranger in 6 months; small units, clear names, one responsibility.
5. **Performance** — measured, never guessed; never bought at the cost of 1–4 without explicit approval.

Foundations: SOLID, Clean Architecture, DDD (where the domain warrants it), GoF patterns (applied on need), OWASP Top 10/ASVS, and each technology's official documentation.

## 3. Mandatory Workflow

For every non-trivial task, in order — no skipped steps:

1. **Analyze** — restate the requirement; identify affected files, inputs/outputs, edge cases.
2. **Load context** — read the relevant Level 2 standards and Level 3 best-practices (index in §7) BEFORE designing.
3. **Design** — choose an approach; two viable options → present trade-offs + one recommendation before coding.
4. **Assess risk** — name what could break (data loss, breaking contracts, security exposure); flag risky changes first.
5. **Implement** — smallest complete change; no unrequested features, refactors, or dependencies.
6. **Verify** — build/lint/tests; self-review the diff against the loaded checklists.
7. **Review** — significant work gets a Level 4 agent pass (routing table in §8).
8. **Report** — what changed and why, briefly, in Greek.

## 4. Global Code Standards

1. **Every code change carries a short English comment explaining WHY** — standing user requirement, not optional.
2. No dead code, no commented-out blocks, no TODOs without owner/context, no debug leftovers.
3. Functions do one thing (prefer < 40 lines); files have one responsibility; names state intent.
4. No magic numbers/strings — named constants or configuration.
5. Errors are handled where they can be acted on — never swallowed silently; users see friendly messages, logs see details.
6. Validation at system boundaries (user input, APIs, external data) — trust internal code.
7. **No over-engineering**: no speculative abstractions, no patterns without a present problem, no premature optimization. The judgment guide is `best-practices/general/architecture-decisions.md`.
8. Consistency with the existing codebase beats theoretical purity — read before writing; deviations are proposed, not snuck in.

## 5. Git & Delivery

1. **Commit messages are detailed**: typed summary (`feat|fix|refactor|perf|test|docs|chore`) + body listing exactly what changed and why, area by area — standing user requirement.
2. One logical change per commit; no "while I was there" bundling.
3. Never commit secrets, `.env`, credentials, or artifacts.
4. Destructive/irreversible operations (force-push, reset --hard, branch deletion, prod deploys, data migrations) happen **only with explicit user approval** — every time, no standing permission.
5. Push/PR/deploy only when the user asks. Full rules: `standards/git-workflow.md`, `standards/ci-cd.md`.

## 6. Environment

1. **OS: Windows 10** — prefer PowerShell (`powershell -Command "..."`) for Windows-specific operations; quote paths with spaces; **quote comma lists** in PowerShell (`--only 'a,b'`).
2. Firebase projects: development runs on **local emulators** (`firebase emulators:start` + `npm start` in the client dir). Production is touched only with explicit approval — see `standards/firebase/workflow.md`.
3. Verify the active Firebase project before any deploy — project IDs can differ from display names.

## 7. Level 2 & 3 Index — what to load when

Load by reading the file(s) BEFORE working in the domain. Combine freely. Level 3 is mandatory reading wherever it exists for the domain — that's where the judgment lives.

| Task involves… | Level 2 — Standards (WHAT) | Level 3 — Best Practices (HOW/WHEN) |
|---|---|---|
| System design, layers, boundaries, patterns | `standards/architecture.md` | `best-practices/general/architecture-decisions.md` |
| Angular components, templates, UI | `standards/angular/components.md`, `material.md` | `best-practices/angular/component-design.md` |
| Angular state, signals, streams | `standards/angular/signals.md`, `rxjs.md`, `services.md` | `best-practices/angular/state-management.md` |
| Angular forms | `standards/angular/forms.md` | — |
| Angular data access / API calls | `standards/angular/http.md` | `best-practices/angular/state-management.md` |
| Angular performance | `standards/angular/components.md` | `best-practices/angular/performance.md` |
| Angular tests | `standards/angular/testing.md` + `standards/testing.md` | — |
| TypeScript typing | `standards/typescript.md` | — |
| Plain JavaScript | `standards/javascript.md` | — |
| Express APIs | `standards/express.md` | — |
| Spring Boot | `standards/spring-boot.md` | — |
| Relational DB / SQL | `standards/database.md` | — |
| Firestore data & queries | `standards/firebase/firestore.md` | `best-practices/firebase/data-modeling.md` |
| Firebase security rules | `standards/firebase/security-rules.md` | — |
| Cloud Functions | `standards/firebase/functions.md` + `standards/express.md` | — |
| Firebase dev/auth/deploy workflow | `standards/firebase/workflow.md` | — |
| Auth, input, secrets, OWASP | `standards/security.md` | — |
| Testing strategy | `standards/testing.md` | — |
| Commits, branches, PRs | `standards/git-workflow.md` | — |
| Pipelines, deployments | `standards/ci-cd.md` | — |
| Reviewing code | `standards/code-review.md` | — |
| Logging, config, errors, docs | `standards/enterprise.md` | — |

## 8. Level 4 — Agent Routing

Claude implements (guided by Levels 1–3); **agents verify and advise**. They are read-only reviewers — findings come back as reports, fixes are applied by the main session with user visibility.

| Situation | Agent |
|---|---|
| Design an Angular feature's structure BEFORE implementation | `angular-architect` |
| Review implemented Angular code | `angular-reviewer` |
| Review Spring Boot / backend code | `spring-reviewer` |
| Review schemas, queries, indexes, migrations, Firestore models | `database-reviewer` |
| Audit for vulnerabilities (auth/input/data code) | `security-reviewer` |
| Diagnose measured performance problems | `performance-reviewer` |
| Assess technical debt / plan a safe restructuring | `refactoring-reviewer` |

Mandatory passes:
- Feature touching auth, user input, or data writes → `security-reviewer` before done.
- Significant Angular feature → `angular-reviewer` before done.
- Schema/model changes → `database-reviewer` before migrating.

## 9. Definition of Done

A task is complete only when ALL hold:

- [ ] Requirement fully implemented, edge cases included
- [ ] Relevant Level 2 checklists pass; Level 3 guidance respected
- [ ] Build/lint clean; tests pass (where the project has them)
- [ ] Mandatory agent passes (§8) done, findings addressed
- [ ] Every change commented (why); commit message lists everything (what)
- [ ] No secrets, no dead code, no unrelated changes in the diff

## 10. Extending the Framework

- New technology → `standards/<tech>.md` (or `standards/<tech>/` folder when it grows) + a row in §7.
- New experience/judgment content → `best-practices/<area>/<topic>.md` + a row in §7.
- New agent → `.claude/agents/<name>.md` + a row in §8.
- **This file stays ~250 lines** — details always go to Level 2/3, never here.
