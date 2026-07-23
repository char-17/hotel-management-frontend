# Standard: Relational Database Design & Optimization

> Load when: designing schemas, writing SQL, adding indexes, planning migrations.
> For Firestore/NoSQL see `standards/firebase/`.

## Schema Design

1. **Normalize to 3NF first**; denormalize only with a measured read-performance justification, documented next to the schema.
2. Every table: surrogate primary key (`BIGINT IDENTITY` or `UUIDv7`), `created_at`, `updated_at` (UTC).
3. **Constraints are the last line of defense** — encode invariants in the DB, not just the app: `NOT NULL` by default, `FOREIGN KEY` always, `UNIQUE` for natural keys, `CHECK` for domains (e.g., `amount >= 0`).
4. Correct types: `NUMERIC/DECIMAL` for money (never float), `TIMESTAMPTZ`/UTC for time, `TEXT`/`VARCHAR` sized realistically, booleans as booleans.
5. Naming: `snake_case`, singular or plural **consistently per project**; FK columns as `<table>_id`; no reserved words.
6. Soft deletes (`deleted_at`) only when history/restore is a requirement — otherwise real deletes with FK `ON DELETE` behavior chosen deliberately (`RESTRICT` default; `CASCADE` only when the child is meaningless without the parent).

## Querying

- **Never `SELECT *`** in application code — name the columns.
- Parameterized queries only — string concatenation into SQL is forbidden (see `standards/security.md`).
- Pagination: keyset (`WHERE id > :last ORDER BY id LIMIT n`) for large/infinite lists; OFFSET only for small admin tables.
- N+1 detection: any query executed inside a loop is a bug until proven otherwise — batch with `IN (...)` or joins.
- Set-based operations over row-by-row processing.

## Indexing

- Index: every FK, every column in frequent `WHERE`/`ORDER BY`/`JOIN` predicates.
- Composite indexes ordered by: equality columns first, then range/sort columns; leftmost-prefix rule applies.
- Don't index blindly: each index costs writes — remove unused indexes; verify with `EXPLAIN (ANALYZE)` before/after.
- Partial/filtered indexes for common predicates on sparse data (e.g., `WHERE status = 'active'`).

## Transactions & Integrity

- Transactions span **one** logical unit of work — short; never hold one across user interaction or external HTTP calls.
- Choose isolation deliberately; handle serialization/deadlock retries where the level requires it.
- Idempotency for money/critical writes: unique constraint on an idempotency key.

## Migrations

- **Every schema change is a versioned migration file** (Flyway/Liquibase/knex/etc.) — never manual prod edits.
- Migrations are forward-only and backward-compatible with the running app version (expand → migrate data → contract, in separate releases for zero-downtime).
- Destructive migrations (drop column/table) require an explicit user go-ahead and a backup step.

## Checklist

- [ ] 3NF baseline; constraints encode the invariants; correct types (money = NUMERIC, time = UTC)
- [ ] No `SELECT *`, no SQL concatenation, no queries in loops
- [ ] FKs and hot predicates indexed; verified with EXPLAIN
- [ ] Short transactions; idempotent critical writes
- [ ] Versioned, backward-compatible migrations
