# Standard: Git Workflow

> Load when: committing, branching, preparing PRs, or resolving repository state.

## Commits

1. **Detailed commit messages are mandatory** (standing user requirement). Format:
   ```
   <type>: <short imperative summary (≤ 72 chars)>

   - <file/area>: exactly what changed and why
   - <file/area>: exactly what changed and why
   ```
   Types: `feat`, `fix`, `refactor`, `perf`, `test`, `docs`, `chore`, `build`.
2. The body lists **exactly what changed** — file by file or area by area — not vague summaries. Code comments in the diff are a separate practice and do not replace this.
3. One logical change per commit. Unrelated fixes go in separate commits — never bundle "while I was there" changes.
4. Commit compiling, working states. No "WIP" commits on shared branches.
5. Never commit: secrets, `.env`, credentials, build artifacts, `node_modules`, IDE junk — keep `.gitignore` current.

## Branching

- `main` is always deployable. Work happens on short-lived branches: `feature/<topic>`, `fix/<topic>`, `chore/<topic>`.
- Sync with `main` regularly (rebase local-only branches; merge if already pushed/shared).
- Delete branches after merge.

## Safety Rules (hard limits)

- **Never** force-push, `reset --hard`, delete branches, or amend pushed commits without explicit user approval.
- Never rewrite history on shared branches.
- Never bypass hooks (`--no-verify`) — fix the underlying failure.
- Resolve merge conflicts by understanding both sides — never discard one side blindly. Unexpected files/branches are investigated, not deleted.
- Pushing to remote happens only when the user asks.

## Pull Requests

- PR description: what + why, how it was tested, anything reviewers should focus on. Link the issue/task.
- Small PRs (reviewable in one sitting). A PR that mixes refactor + feature is split.
- CI must be green before requesting review; author performs a self-review pass first (see `standards/code-review.md`).

## Recovery Etiquette

- Before any risky operation: check `git status` + `git log` and state the plan to the user.
- Prefer additive fixes (`revert`) over history rewriting on anything pushed.
- Uncommitted work is sacred — stash or commit before switching contexts; never checkout-over it.

## Checklist

- [ ] Message: typed summary + body listing every change and its reason
- [ ] One logical change; no secrets/artifacts in the diff
- [ ] Branch named by intent; based on fresh `main`
- [ ] No destructive git operations without explicit approval
