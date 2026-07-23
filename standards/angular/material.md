# Standard: Angular — Material & UI Layer

> Level 2 (ΤΙ): rules for Angular Material usage and the UI component layer in general.
> If the project uses a custom design system instead of Material, rules 5-10 still apply verbatim.

## Rules

1. **Theme once, centrally**: one Sass theme file defining palettes/typography/density via Material theming APIs (M3 `mat.theme`/`define-theme`). Component files never hardcode colors — they consume theme variables / CSS custom properties.
2. Respect the project's palette tokens — read the existing theme before styling anything new; never invent ad-hoc hex values in component styles.
3. Import per-component (`MatButtonModule`, `MatDialogModule`) in each standalone component — only what the template uses.
4. Don't fight Material's internals: no deep overrides of internal selectors (`.mdc-*`) — use the official theming/density APIs; if a component needs that much overriding, build a custom component instead.
5. **Dialogs (project convention — non-negotiable)**: `disableClose: true` always — closing only via explicit ✕ / Cancel / Save. Dialog data in/out is typed (`MatDialogRef<T, R>`, `MAT_DIALOG_DATA`). No browser `confirm()` — Material dialogs or in-app UI only.
6. Wrap repeated Material patterns (confirm-style dialog shell, form field with standard error display, snackbar usage) into **shared components/helpers** — the same Material boilerplate appearing 3+ times is a smell.
7. Snackbars/toasts for transient feedback only — never for errors requiring action; errors that need a decision use dialogs or inline messages.
8. Tables: `MatTable` with `trackBy`; server-side pagination/sorting for datasets that grow (see `standards/angular/http.md`) — never load unbounded lists into a client-side table.
9. Accessibility comes with Material only if used correctly: keep label associations (`mat-label`), `aria-label` on icon-only buttons, focus management in dialogs (Material's defaults — don't break them).
10. Responsive behavior via layout CSS (grid/flex + container queries or breakpoint observer) — not separate mobile/desktop component forks unless the UX genuinely differs.

## Checklist

- [ ] Central theme; zero hardcoded colors in components; palette tokens respected
- [ ] Dialogs: disableClose + typed data; explicit close buttons only
- [ ] Repeated Material boilerplate extracted to shared components
- [ ] Tables paginated server-side beyond trivial sizes; a11y intact
