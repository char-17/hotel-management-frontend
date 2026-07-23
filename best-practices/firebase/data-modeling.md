# Best Practice: Firebase — Data Modeling Decisions

> Level 3 (ΠΩΣ): the judgment calls for Firestore models. Mechanics: `standards/firebase/firestore.md`.
> Firestore punishes relational thinking — you model **for the screens and queries you have**, and you pay for every document read.

## Subcollection vs top-level vs embedded — the decision

| The child data is… | Model as | Why |
|---|---|---|
| Small, bounded, always loaded with the parent (address on a profile) | **Embedded map/array** in the document | One read; no join logic |
| Owned by one parent, unbounded or independently listed (order items, messages of a chat) | **Subcollection** | Parent doc stays small; children queryable/paginable |
| Queried **across** parents (all orders of all users for admin) | **Top-level collection** with reference fields (`userId`) | Collection-group queries work, but top-level is simpler for cross-parent access patterns |
| Needed in two shapes (list card vs full detail) | Full doc + **duplicated summary** where listed | Read cost: list shows 20 summaries = 1 read each; embedding summaries in a parent list doc can make it 1 read total |

Test: *"Which screen loads this, and how many reads does it cost at 10× today's data?"* If the answer is "grows without bound", the model is wrong.

## Duplication — when and how

Duplicate deliberately when a screen would otherwise need N extra reads per item (e.g., `authorName` on each post vs fetching each author).

**Every duplication must have a written update path** — the three acceptable ones:
1. **Cloud Function trigger** on the source doc fans out updates (default choice).
2. **Batched write** from the same server-side operation that changes the source.
3. **Accept staleness** explicitly (display-only data where an old name for a few minutes is fine) — documented as such.

Client-side fan-out from multiple call sites is NOT an acceptable path — someone will forget one.

## When Firestore is the wrong tool

Flag to the user (don't silently struggle) when requirements include:
- Heavy ad-hoc querying/reporting across many fields → export to BigQuery, or use SQL (`standards/database.md`).
- Multi-way joins as the core access pattern, strict cross-entity transactions everywhere → relational DB.
- Full-text search → Algolia/Typesense/Meilisearch fed by triggers — Firestore can't do it natively.

## Costs shape the model (rules of thumb)

- Reads dominate cost: a badly modeled list screen (N+1 subfetches) is a monthly bill, not just latency.
- Counters: aggregation queries for occasional counts; **sharded counters** only for high-frequency live counters (likes) — don't build sharding for a count shown on an admin page once a day.
- Listener on a list = re-read of changed docs continuously; use one-shot `getDocs` for data that doesn't need to be live. "Real-time by default" is a cost decision, not a style choice.

## Evolving a live schema

- New fields: write code tolerant of missing field (default in the converter) → backfill via script/function → then rely on it.
- Renames/restructures: dual-write new + old, migrate with a batched script (500/batch), switch readers, stop old writes — in separate deploys. Never a big-bang rename on a live collection.
