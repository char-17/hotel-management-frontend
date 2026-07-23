# Standard: Firebase — Firestore

> Level 2 (ΤΙ): rules for Firestore data access and modeling mechanics.
> For WHEN to choose subcollections vs top-level vs duplication → `best-practices/firebase/data-modeling.md`.

## Rules

1. **Model for the queries you need**, not for normalization. Every deliberate duplication is documented (where it lives + what updates it).
2. Collections: plural nouns. Document IDs: natural when one exists (`users/{uid}`), auto-ID otherwise — never encode data that changes into the ID.
3. Document limits respected by design: no unbounded arrays, no documents drifting toward 1 MiB; growing lists become subcollections.
4. **Timestamps via `serverTimestamp()`** for anything authoritative — client clocks are never trusted.
5. Multi-document invariants → **transactions/batched writes**, always. A two-write update without a batch is a bug.
6. Counters/aggregates: aggregation queries (`count()`, `sum()`) for reads; sharded counters for high-write counters — never read-all-and-count.
7. Reads are bounded: every list query has `limit()` + pagination (cursor-based via `startAfter`) — no unbounded `getDocs` on growing collections.
8. Listeners (`onSnapshot`) are attached deliberately, detached on teardown (Angular: wrap in a service, tear down with the consumer), and never attached to unbounded queries.
9. Access from the app goes through **repository/data services** — components never call the SDK directly (mirrors `standards/angular/http.md`).
10. Converters (`withConverter`) or a single mapping layer give every collection a typed model — no raw `DocumentData` floating through the app.
11. Indexes: composite indexes are committed in `firestore.indexes.json` — the console is not the source of truth.

## Checklist

- [ ] Duplications documented with their update path
- [ ] serverTimestamp everywhere authoritative; batches/transactions for multi-doc writes
- [ ] Every query bounded + paginated; listeners torn down
- [ ] Typed converters; indexes versioned in git
