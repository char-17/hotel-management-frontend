# Standard: Code Review

> Load when: reviewing a diff, a PR, or existing code — including self-review before presenting work.

## Review Protocol (in order)

1. **Correctness** — does it do what the requirement says? Trace the main path and every edge case by hand. Check off-by-ones, null/undefined flows, async race conditions, error paths.
2. **Security** — run the `standards/security.md` protocol on every entry point the diff touches. Security findings are blocking.
3. **Design fit** — does it respect the existing architecture and module rules? Right layer? No duplication of something that already exists? (Search the codebase before accepting "new" utilities.)
4. **Maintainability** — clear names, small units, no dead code, comments explain *why*. Would a newcomer understand this in 6 months?
5. **Tests** — new behavior covered per `standards/testing.md`; tests assert behavior, not implementation.
6. **Performance** — only flag issues with a plausible real impact (N+1, unbounded loads, missing pagination/indexes) — no micro-optimization nitpicks.

## Severity Levels (use them explicitly)

| Level | Meaning | Action |
|---|---|---|
| 🔴 Blocker | Bug, security hole, data loss risk, broken contract | Must fix before merge |
| 🟠 Major | Design violation, missing tests/validation, maintainability debt | Fix before merge unless justified |
| 🟡 Minor | Naming, small clarity issues | Fix if cheap; otherwise note |
| 💡 Suggestion | Optional improvement, learning note | Author's choice |

## Reporting Format

For each finding: **location (`file:line`) → what's wrong → why it matters → concrete fix (code if short)**. Group by severity, blockers first. End with a verdict: *approve / approve with fixes / needs changes* and a 2–3 line summary of overall quality.

## Reviewer Conduct

- Review the code, not the author; every criticism comes with a reason and an actionable alternative.
- Point out what is done **well** — validated good patterns should be repeated.
- Distinguish standards violations ("module rule X says…") from personal taste — taste is a 💡, never a 🔴.
- Don't demand rewrites outside the diff's scope; open a follow-up note instead.

## Self-Review (mandatory before presenting any work)

- [ ] Read the full diff top to bottom as if someone else wrote it
- [ ] Requirement fully met; nothing extra snuck in (no unrequested refactors)
- [ ] Every change has its explanatory comment; commit message lists every change
- [ ] Lint/build/tests pass; no debug leftovers (`console.log`, commented code, unused imports)
- [ ] Checked the relevant module checklists for every domain the diff touches
