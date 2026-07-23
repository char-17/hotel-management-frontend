# Best Practice: Angular — Performance Decisions

> Level 3 (ΠΩΣ): when each optimization is worth it — and when it isn't. Iron rule: **measure first** (DevTools Performance, Lighthouse, bundle analyzer); optimizations without numbers are rejected.

## The baseline is already fast — verify before adding machinery

OnPush + signals + `track` + lazy routes (all mandatory per standards) already solve most Angular performance. When something feels slow, check for **violations of the baseline first** — a missing `track`, a template function call, an eager route — before reaching for advanced tools.

## Decision guide

| Symptom / situation | First move | Escalate to (only if measured) |
|---|---|---|
| Slow initial load | Check bundle: lazy routes, analyze what's in main | `@defer` below-the-fold, preload strategies, SSR/prerender for public pages |
| Long lists feel sluggish | `track` correctness, pagination from server | Virtual scroll (CDK) — only for genuinely long lists (500+ rendered rows) |
| Laggy typing/interaction | Template function calls → `computed`; debounce input streams | Move heavy computation to a web worker |
| Frequent re-render churn | Verify OnPush everywhere; check an object being recreated each CD (new reference per read) | Memoize at the source (`computed`), split the hot region into its own component |
| Slow images | `NgOptimizedImage`, explicit dimensions, modern formats | CDN/resizing pipeline |
| "Everything is slow" after data grows | Server-side pagination/filtering (`standards/angular/http.md`) | Never client-side-filter unbounded datasets — fix the API contract |

## When NOT to optimize

- No user-perceivable symptom + no metric → **no optimization.** Complexity is a permanent cost; speed you can't measure is not a benefit.
- Virtual scroll for 50 rows, workers for millisecond computations, custom CD hacks (`detach`) — rejected in review as over-engineering.
- Caching layers: only with a stated invalidation story (`standards/angular/http.md` §10). A cache without invalidation is a bug factory with good intentions.

## Bundle discipline (the usual real culprit)

1. Analyze before and after (`ng build --stats-json` + analyzer / `source-map-explorer`).
2. Heavy libraries: import the piece, not the barrel; question any dependency > ~30 kB gzip doing something small — often 20 lines replace it.
3. Charts/editors/maps load behind `@defer` or dynamic `import()` at the interaction point.
4. Fonts/icons subset; no two libraries doing the same job (two date libs, two icon packs).

## @defer judgment

- Great for: below-the-fold sections, heavy widgets, admin-only panels, anything behind interaction.
- Not for: content needed for first meaningful paint, or tiny components (the wrapper costs more than it saves).
- Always define `@placeholder`/`@loading` states — layout shift is a performance bug too (CLS).

## Reporting

Any performance change ships with: metric before → change → metric after, in the commit message. "Feels faster" is not a result.
