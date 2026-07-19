# CLAUDE.md — Native Form Elements

## What this is

A static reference page for testing native HTML form element behaviour. Every element is shown in all meaningful states (default, pre-filled, required, read-only, disabled) so developers can experience native rendering with assistive technology and keyboard navigation.

**Inspired by:** nativeformelements.com (separate project, not connected)  
**Repo:** github.com/formspiel/native-form-elements  
**Stack:** HTML5, CSS custom properties, vanilla JS — no frameworks, no build tools, no npm

---

## Files

```
index.html      — all markup; one page, no templates
style.css       — all styles; ~870 lines, structured in named sections
behaviour.js    — ~160 lines of vanilla JS; no dependencies
favicon.svg     — self-contained SVG favicon, dark-mode aware
```

No build step. Edit files directly and push.

---

## Pushing changes

Local `git push` is blocked by HTTP 403. Always push via the MCP tool:

```
mcp__github__push_files  owner=formspiel  repo=native-form-elements  branch=master
```

After every MCP push, sync local to avoid divergence:

```bash
git fetch origin master && git reset --hard origin/master
```

---

## Design tiers

Three tiers are toggled by checkboxes in the header. Each checkbox applies a CSS class to `<body>`. JS in `behaviour.js` also auto-enables design-02 when design-03 is checked.

| Checkbox | Body class | Name | Description |
|----------|------------|------|-------------|
| — | — | Default (Tier 0) | Zero CSS on form elements. Bare browser/OS rendering. |
| `#design-01` | `body.design-01` | Streamline typography | `font-size: 100%; font-family: inherit` on all form elements. |
| `#design-02` | `body.design-02` | Minimal Design | Highlight colour (`#003781`), borders, padding, custom focus ring, sticky column headers. |
| `#design-03` | `body.design-03` | Showcase | Experimental: glass-card fieldsets, gradient fills, custom checkbox/radio/range, `field-sizing`, `@starting-style`. Requires design-02. |

**Rule:** Tier 0 must never apply any CSS to form elements. Any reset or normalisation belongs in Tier 1 or higher.

---

## CSS architecture (`style.css`)

Sections are marked with banner comments (`/*  S E C T I O N  */`):

1. **Variables & base** — single `:root` block with all custom properties, self-hosted `@font-face` (Titan One, base64 `data:` URI), `.visually-hidden` utility, `@supports` Apple body font, dark mode overrides, forced-colors overrides
2. **Form basic styles** — cursor, label spacing; dark-mode Safari fixes
3. **Navigation** — `details`/`summary` nav styles
4. **Layout** — `.grid-wrapper` 5-column grid (≥900px)
5. **Design tiers** — `body.design-01`, `body.design-02` rules
6. **Typography scale** — `body:is(.design-01, .design-02)` heading/legend sizes
7. **Spacing** — section margins for Tier 1+
8. **Column headers** — sticky state labels, desktop only
9. **Showcase (design-03)** — base layer (custom controls, transitions), includes `forced-colors: active` overrides
10. **Showcase experimental layer** — CSS variables (`--d3-*`), glass cards, gradients
11. **Footer**
12. **Status banner** — `#status-banner` fixed-position accessible live region (see Status banner section below)

### Key custom properties

```css
:root {
  accent-color: #003781;          /* native checkbox/radio/range tint */
  --color-bg-01: #f5f5f5;         /* page background */
  --color-bg-02: #e8e8e8;         /* secondary surface */
  --color-text:  #111111;         /* body text (~16:1 on bg-01) */
  --color-link:  #003781;         /* links and highlight colour */
  --color-focus: hsl(220,80%,35%);/* focus ring colour */
}
```

Dark mode values live in `@media (prefers-color-scheme: dark) { :root { … } }`.  
Forced-colors values live in `@media (forced-colors) { :root { … } }`.

### Showcase (`design-03`) variables

Defined on `body.design-03`, overridden in dark mode:

```
--d3-a / --d3-b / --d3-c    interactive gradient colours (blue, violet, sky)
--d3-pink / --d3-amber       accent accents
--d3-grad                    linear-gradient used on checkbox/radio/range/button fills
--d3-heading-grad            gradient for h1/h2/legend text
--d3-bar-grad                fieldset left-accent bar gradient
--d3-surf / --d3-surf-active fieldset background (glass effect)
--d3-shadow / --d3-shadow-active  fieldset drop shadow
```

---

## HTML structure (`index.html`)

```
<nav>          — <details>/<summary> section navigation; always visible
<header>       — page title + design-tier checkboxes
<main>
  .column-headers  — aria-hidden state labels (Default / Pre-filled / …)
  <form>       — one per section; scopes native validation/submission to that section only
    <fieldset id="section-*">  — one per element type
      <legend>
      .grid-wrapper > .grid-item-wrapper  — 5 columns per state
    .section-actions  — Submit / Reset buttons for this section's form
  </form>
  <form>
    <section id="section-aria-group">  — ARIA role="group" example
    .section-actions
  </form>
</main>
<footer>       — "Made by [contributors]" rendered via GitHub API
<div id="status-banner" role="status">  — accessible feedback for submit/invalid/reset
<script src="behaviour.js">
```

### Per-section forms (the "playground" approach)

Every section (23 `<fieldset>`s + the ARIA group `<section>`) is wrapped in its own `<form>`, each with its own Submit/Reset row. This is deliberate: a single page-wide form would mean native validation on any one required field (and there are many) blocks submission everywhere, forcing you to fill in unrelated sections just to test one element. Scoping validation per-section keeps each demo self-contained.

### Status banner

`#status-banner` (`role="status"`) is a fixed-position, always-in-DOM live region that reports what a section's form just did — submitted (with the serialized `FormData` payload), was blocked by native validation (with the invalid field count), or was reset. It's always present so screen readers announce reliably; visibility toggles via `opacity`/`pointer-events` (not `display`/`hidden`) so it can fade, respecting `prefers-reduced-motion`. Auto-hides after 7s or via its close button; never steals focus.

### Grid layout

- `.grid-wrapper` is a CSS Grid with `repeat(5, 1fr)` at ≥900 px.
- Each `.grid-item-wrapper` holds one state: default, pre-filled, required, read-only, disabled.
- If a state is unavailable for the element type, the cell contains `.not-available` with "Not available" text to preserve grid alignment.

### Section IDs

Every section has a stable `id` used by the nav:

`section-text`, `section-password`, `section-otp`, `section-checkbox`, `section-radio`, `section-textarea`, `section-select`, `section-select-advanced`, `section-datalist`, `section-slider`, `section-datetime`, `section-email`, `section-tel`, `section-url`, `section-number`, `section-search`, `section-color`, `section-file`, `section-date`, `section-time`, `section-progress`, `section-meter`, `section-buttons`, `section-aria-group`

---

## JavaScript (`behaviour.js`)

Runs on `DOMContentLoaded`. No external dependencies. Seven responsibilities:

1. **`no-js` removal** — removes `no-js` from `<html>` so CSS can respond.
2. **Default tier** — enables design-01 automatically on every load.
3. **Design tier toggles** — `.design-option` checkboxes toggle matching body class; design-03 auto-enables design-02, and unchecking design-02 also disables design-03.
4. **Slider outputs** — syncs `<output>` value to paired `<input type="range">` on `input` event.
5. **Page title** — appends the current section's heading to `document.title` from the URL hash, so shared anchor links are distinguishable.
6. **Status banner + form handlers** — delegated `submit`/`invalid`/`reset` listeners drive `#status-banner`. `submit` prevents the default navigation and shows the serialized `FormData` payload. `invalid` is listened on the capture phase (it doesn't bubble) and debounced with a 0ms timer to report the full count of invalid fields in one message. `reset` defers slider `<output>` re-sync a tick, since `reset` fires before field values actually revert.
7. **Footer contributors** — fetches `api.github.com/repos/formspiel/native-form-elements/contributors`, builds `<a>` nodes with `textContent` (no innerHTML). Fails silently.

---

## Colour & contrast

| Mode | Text | Background | Ratio |
|------|------|------------|-------|
| Light | `#111111` | `#f5f5f5` | ~16:1 ✓ WCAG AAA |
| Dark | `#f0f0f0` | `#1a1a1a` | ~14:1 ✓ WCAG AAA |

`--color-link` in dark mode is `#7ab3e8` — meets 4.5:1 against `#1a1a1a` (WCAG AA).

Focus rings use `:focus-visible` throughout (not `:focus`).

---

## Titan One font

Only affects design-03 (Showcase) headings. Self-hosted as a base64-encoded `data:` URI in a `@font-face` rule at the top of `style.css` — no request to Google Fonts or any third party. `font-display: swap` falls back to `system-ui, sans-serif` until it's parsed. Trade-off: the font now always ships with `style.css` rather than being conditionally loaded only when design-03 is enabled.

---

## Open GitHub issues

| # | Title | Status |
|---|-------|--------|
| [#2](https://github.com/formspiel/native-form-elements/issues/2) | Add modern theme switch (CSS style queries) | Open |
| [#10](https://github.com/formspiel/native-form-elements/issues/10) | Investigate multi-language textarea voice switching on macOS 26 | Open |
| [#16](https://github.com/formspiel/native-form-elements/issues/16) | Test multi-select read-only approaches across browsers | Open |
