# Best Practice: Angular — Component Design Decisions

> Level 3 (ΠΩΣ): judgment calls — when to split, smart vs dumb, projection vs inputs. Rules/mechanics: `standards/angular/components.md`.

## Smart vs Dumb — where logic lives

- **Smart (feature/container) components**: injected services, data loading, navigation, orchestration. One per route/feature area, few overall.
- **Dumb (presentational) components**: `input()` in, `output()` out, zero injected feature services. Everything in `shared/` must be dumb.
- Decision test: *"Could this component work in a Storybook with fake inputs?"* If not, it's smart — and it had better be a feature root, not a leaf.

## When to split a component

Split when **any** of these is true — not before:
1. The template has clearly distinct regions with their own data/interactions (list + detail + filters).
2. A region repeats (card in a grid) or is needed elsewhere.
3. The component handles more than one user intent (editing AND browsing AND configuring).
4. Template > ~150 lines or class > ~200 lines *and* a natural seam exists.

Do **not** split just for file size when the pieces would share all their state — you'll create prop-drilling for nothing. Cohesion beats size.

## Passing data — inputs vs projection vs service

| Situation | Choice |
|---|---|
| Parent gives child data/config | `input()` |
| Child informs parent of events | `output()` |
| Parent controls child's *content/markup* (cards, modals, layout shells) | Content projection (`ng-content`, template refs) |
| Deeply nested tree needs shared feature state | Feature-scoped state service — NOT inputs drilled 4 levels |
| Truly global concerns (auth user, theme) | Root service |

- Prop-drilling more than 2 levels → introduce a feature state service.
- Projection over configuration: a `card` with 8 boolean inputs to toggle sections should instead project content.

## Reuse judgment

- Extract to `shared/` on the **second real usage** (rule of two here — UI diverges fast; premature extraction creates config-flag monsters).
- A shared component accumulating `if (variant === ...)` branches per consumer has failed — split per variant or push markup back to consumers via projection.

## State placement (with `best-practices/angular/state-management.md`)

- State lives at the **lowest common ancestor** of everyone who needs it: component-local → feature service → root, in that order of preference.
- Route is state too: filters/selection that should survive refresh belong in the URL (query params), not only in services.

## Modals (project convention context)

Modal components are dumb: data in via dialog data, result out via close — no service calls inside the modal body; the opener owns the consequence. Combined with the no-outside-click rule (`standards/angular/material.md` §5), this keeps every modal predictable and testable.
