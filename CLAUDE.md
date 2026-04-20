# CLAUDE.md — Native Form Elements

## Project Purpose

A static reference page for testing and consulting native HTML form element behaviour. Every element is shown in all possible states so developers can experience native behaviour using assistive technology and keyboard testing. No frameworks, no build tools — intentionally minimal.

**Live site:** nativeformelements.com  
**Stack:** HTML5, CSS (custom properties), Cash JS (jQuery-like micro-library), GitHub Actions CI

---

## Open GitHub Issues

| # | Title | Status |
|---|-------|--------|
| [#1](https://github.com/formspiel/native-form-elements/issues/1) | Add `accent-color` CSS | Open since 2023 |
| [#2](https://github.com/formspiel/native-form-elements/issues/2) | Add modern theme switch (CSS style queries) | Open since 2024 |
| [#3](https://github.com/formspiel/native-form-elements/issues/3) | Add ARIA `role="group"` example | Open since 2025 — partially in `index.html:734` |

---

## Layout

### Column structure
The grid always has exactly **5 columns**, one per state:

| Column | State | HTML mechanism |
|--------|-------|----------------|
| 1 | Default | — |
| 2 | Default (pre-filled) | `value=""` / `checked` |
| 3 | Required | `required` |
| 4 | Read-only | `readonly` |
| 5 | Disabled | `disabled` |

If a state is not available per the HTML standard, a visible "Not available" placeholder must fill the cell so the grid alignment is preserved.

Some element types have **variants** below the main 5-column row (e.g. placeholder, hint, pattern for text inputs). This must remain possible.

### Responsive behaviour
- Mobile: single column, minimal horizontal page padding
- Tablet: two or three columns
- Desktop (≥ 900 px): full 5-column grid

Currently `.grid-wrapper` has no `gap` — items sit flush. A small gap is needed.

---

## Design Tiers

Three tiers are switched by checkboxes in the header. The checkboxes apply CSS classes to `<body>`.

### Tier 0 — Default (no class)
- `font-family: system-ui, sans-serif`
- Dynamic type for WebKit via `font: -apple-system-body` guarded by `@supports`:
  ```css
  @supports (font: -apple-system-body) {
    body { font: -apple-system-body; font-family: system-ui, sans-serif; }
  }
  ```
- **No CSS applied to form elements** — they must render exactly as the browser/OS renders them natively.
- Minimal horizontal page padding only (`padding-inline`).

### Tier 1 — "Streamline typography" (`body.design-01`)
- Font family and font size are applied uniformly to `input`, `textarea`, `select`, `button`.
- `font-size: 100%; font-family: inherit` is the minimal correct fix.
- Currently `body.design-01 {}` and `body.design-01 label {}` are empty rule blocks — these are dead CSS and should be removed.

### Tier 2 — "Minimal Design" (`body.design-02`, formerly "Basic borders and padding")
- Minimalistic design with **highlight colour (`#003781`)** as accent colour.
- Custom focus style: a clearly visible `outline` using the accent colour.
- Padding, border-radius, and border on form elements.
- This replaces both the old "Basic borders and padding" (design-02) and "Basic design" (design-03) checkboxes — consolidate into one.
- `design-basic.css` is currently broken (see Bugs). It should be repaired and renamed `design-minimal.css`, or its contents merged into `style.css` under `.design-02`.

---

## Colour & Accessibility

### Contrast requirement — WCAG AAA (7:1)
Current colour values **do not meet 7:1** in either mode:

| Mode | Text | Background | Approx. ratio | Status |
|------|------|------------|----------------|--------|
| Light | `hsl(0,0%,20%)` = `#333` | `hsl(0,0%,90%)` = `#e6e6e6` | ~5.3:1 | ❌ Fails AAA |
| Dark | `hsl(0,0%,90%)` = `#e6e6e6` | `hsl(0,0%,20%)` = `#333` | ~5.3:1 | ❌ Fails AAA |

**Fix — light mode:** `#111111` on `#f5f5f5` → ~16:1 ✓  
**Fix — dark mode:** `#f0f0f0` on `#1a1a1a` → ~14:1 ✓

Update the `:root` custom properties accordingly. The `--color-link` value must also reach 7:1 against the page background on its own (without underline as the only distinguisher).

### Focus visibility
- Dark mode uses `:focus { outline-color: … }` — this overrides focus for all interactive elements globally, including when navigating with a mouse. Use `:focus-visible` instead so only keyboard focus shows the ring.
- High-contrast mode (`forced-colors`) is already present — keep it.

### `accent-color` (Issue #1)
Add one line to `:root`:
```css
:root { accent-color: #003781; }
```
This visually styles checkboxes, radios, range sliders, and progress bars in supporting browsers. It is also a natural companion to the Minimal Design tier.

---

## Navigation

### Current state
Skip links are generated dynamically by `behaviour.js` for `legend`, `h1`, and `h2` elements. They are injected into `<ul id="js-nav-skip-links">` inside `<nav aria-label="Skip links">`.

**Problems with this approach:**
1. The nav is invisible until focused — there is no always-visible navigation.
2. Elements that already have an `id` are silently skipped (bug — see below).
3. `<h3 id="idOfHeadline">` at line 735 gets no entry.
4. Skip links alone are not adequate navigation for a page with many sections.

### Recommended replacement
Replace the dynamic skip-link generator with a **static, always-visible `<nav>`** that lists all sections:

```html
<nav aria-label="Sections">
  <ol>
    <li><a href="#section-text">Text input</a></li>
    <li><a href="#section-password">Password</a></li>
    <!-- … -->
  </ol>
</nav>
```

- Give every `<fieldset>` or section a stable, semantic `id`.
- The nav should be **collapsed by default** (e.g. a `<details>`/`<summary>` or a disclosure button) to preserve maximum space for the examples. It expands on demand.
- On mobile a collapsed nav is essential; on desktop it can remain collapsed but should be easy to open.
- This replaces the JS-generated skip link mechanism entirely and removes the Cash dependency for that feature.

---

## Bugs

### 1. Slider `oninput` throws SyntaxError (`index.html:691`)
Hyphenated names are not valid JS identifiers in inline handlers:
```html
<!-- broken -->
<form oninput="range-slider-std-output.value=parseInt(range-slider-std.value)">

<!-- fix -->
<form oninput="this.elements['range-slider-std-output'].value = parseInt(this.elements['range-slider-std'].value)">
```

### 2. `design-basic.css` — invalid CSS
- Line 2: missing semicolon after property value.
- Lines 6–8: `@media` block contains a bare property with no selector — the `border-color` declaration is outside any rule.
- Uses `--text-color-pos` which is not defined in `style.css`.

```css
/* current — broken */
fieldset {
    border: 1px solid var(--text-color-pos)   /* missing ; */
}
@media (prefers-color-scheme: dark) {
    border-color: var(--text-color-pos)  /* no selector */
}

/* fix */
fieldset {
    border: 1px solid var(--color-text);
}
@media (prefers-color-scheme: dark) {
    fieldset {
        border-color: var(--color-text);
    }
}
```

### 3. Pattern `title` is misleading (`index.html:96`)
`pattern="[0-9]{3}"` validates three digits; the title says "three uppercase letters".
```html
<!-- fix -->
<input type="text" pattern="[0-9]{3}" title="Enter exactly three digits (0–9)." />
```

### 4. Skip links miss elements that already have an `id` (`behaviour.js:68–77`)
The `if ($(this).hasAttr('id'))` branch does nothing — elements with an existing `id` never get a skip link. The `<h3 id="idOfHeadline">` at line 735 is silently omitted.

### 5. Empty `<h2 title="hallo">` (`index.html:33`)
No text content, debug `title` attribute. JS removes the title on load; the heading becomes "No label (h2)" in skip links. Remove or replace with meaningful content.

---

## Labels — Meaningful Text Required

**Current problem:** labels describe the state, not the field:
- "Input Standard", "Input (pre-filled)", "Input (required)", "Input (read-only)", "Input (disabled)"

When a screen reader announces a field, it reads the label. If the label is "Input Standard" it is impossible to distinguish whether the screen reader announced the label or the element type. The state is also already communicated by the `required` attribute, `readonly`, etc.

**Fix:** Use a **realistic, consistent label** for each element group. The state is communicated by the HTML attribute, not the label.

```html
<!-- instead of -->
<label for="textbox-std">Input Standard</label>
<label for="textbox-req">Input (required)</label>

<!-- use -->
<label for="textbox-std">Full name</label>
<label for="textbox-req">Full name</label>  <!-- required communicated via required attribute -->
```

Choose one realistic label per section (e.g. "Full name" for text inputs, "Comment" for textareas, "Country" for the datalist) and use it consistently across all five state columns.

---

## HTML Issues

### Duplicate IDs
All IDs in the file appear unique. However, `name="check-choose"` is reused across two separate groups (`index.html:173` and `index.html:762`), and `name="textarea"` is shared by all five textarea elements (`index.html:228–249`). In a real form only the last value per name would be submitted.

### Invalid nesting — `<legend><h3>…</h3></legend>` (`index.html:774`)
`<legend>` accepts only phrasing content; block-level elements are invalid. Some screen readers announce both the group role and the heading level, causing redundancy. Use plain text in `<legend>`.

### OTP field label placement (`index.html:138–139`)
Label appears after the input. The `title="One Time Code"` tooltip is not a substitute for visible label text.

### Leftover testing sections — cleanup needed
The following sections were added for testing and should be cleaned up:

1. **`<div role="group" aria-labelledby="idOfHeadline">` (`index.html:734–771`)** — This is the partial implementation of issue #3. It needs a proper section header and description, and should be compared explicitly against `<fieldset>` + `<legend>`.

2. **`<fieldset><legend><h3>Checkbox Group</h3></legend>` (`index.html:773–810`)** — Duplicate checkbox group added to test the invalid `<legend><h3>` nesting. Once documented as an HTML issue example (or removed), the section serves no standalone purpose.

### No `autocomplete` on most inputs
For a best-practice reference page, adding `autocomplete` values where appropriate is educational (e.g. `autocomplete="name"`, `autocomplete="email"`, `autocomplete="one-time-code"`).

---

## CSS Issues (`style.css`)

| Issue | Location | Fix |
|-------|----------|-----|
| Empty rule blocks | `label {}`, `.grid-item-wrapper {}`, `fieldset {}`, `body.design-01 {}`, `body.design-01 label {}` | Remove |
| `--bright-green` defined, never used | `:root` inside `@supports` | Remove |
| `@media (color-gamut: p3)` empty | Lines 48–50 | Remove or populate |
| `:focus` instead of `:focus-visible` | Dark mode block | Change to `:focus-visible` |
| No `gap` on `.grid-wrapper` | Lines 103–110 | Add `gap: 1rem` or similar |
| `* :disabled` (space = descendant combinator) | Line 96 | Change to `*:disabled` |
| Contrast below 7:1 | `:root` colour values | See Colour section above |

---

## JavaScript Issues (`behaviour.js`)

| Issue | Notes |
|-------|-------|
| `var` throughout | Replace with `const` / `let` |
| `Generator` prototype over-engineered | `let nextId = Date.now(); function getId() { return nextId++; }` is sufficient |
| Cash CDN dependency | The library is only used for `$`, `.each`, `.on`, `.addClass`, `.removeClass`, `.attr` — all replaceable with vanilla JS in ~20 lines. Removing the CDN makes the page fully self-contained and removes a load-time single point of failure. |
| Skip links replace, not augment, navigation | See Navigation section |
| Debug detection is fragile | `indexOf('github') === -1` triggers on any URL without "github", including localhost variants that contain other substrings. `window.location.hostname === 'nativeformelements.com'` is explicit. |

---

## Missing Form Element Sections

### Input types not yet shown
| Type | Notes |
|------|-------|
| `type="email"` | Email keyboard on mobile; format validation |
| `type="tel"` | Numeric keyboard; no format validation |
| `type="url"` | URL format validation |
| `type="number"` | Spinner, `min` / `max` / `step` |
| `type="search"` | Clear button in some browsers; implicit `role="searchbox"` |
| `type="color"` | Highly browser-dependent colour picker |
| `type="file"` | `multiple`, `accept` attributes |
| `type="date"` | Date picker |
| `type="time"` | Time-only picker |
| `type="week"` | Week picker (limited support) |
| `type="month"` | Month picker (limited support) |
| `type="hidden"` | Non-interactive; relevant for AT awareness |

### Buttons and interactive elements
| Element | Notes |
|---------|-------|
| `<button>` | vs `<input type="button">` / `type="submit"` / `type="reset">` |
| `<input type="image">` | Image submit button |
| `<meter>` | Scalar gauge (battery level, disk usage) |
| `<progress>` | Determinate and indeterminate states |
| `<output>` | Already used in slider; deserves its own dedicated section |
| `<details>` / `<summary>` | Native disclosure widget |
| `<dialog>` | Native modal / non-modal dialog |

### Missing states
| State | Notes |
|-------|-------|
| `indeterminate` checkbox | Set via JS: `el.indeterminate = true` — important AT state |
| `:user-valid` / `:user-invalid` | Modern CSS pseudo-classes, post-interaction validation |
| `aria-invalid` | Explicit invalid state without browser constraint validation |
| `aria-required` | vs HTML `required` — different announcement by some AT |

---

## CI / Workflow Issues (`.github/workflows/main.yml`)

| Issue | Fix |
|-------|-----|
| `actions/checkout@v2` outdated | Update to `actions/checkout@v4` |
| `GeopJr/action-accessibility@v2.0.0` — blank `token:` | Supply `token: ${{ secrets.GITHUB_TOKEN }}` |
| No HTML validation | Add Nu Html Checker (`validator/validator-github-action`) |
| No CSS linting | Add `stylelint` |
| Only triggers on `master` | Add PR branch triggers for earlier feedback |

---

## Recommended Actions (Priority Order)

### Immediate — bugs and broken behaviour
1. Fix slider `oninput` (Bug #1)
2. Fix or replace `design-basic.css` (Bug #2)
3. Fix pattern `title` text (Bug #3)
4. Remove empty `<h2>` (Bug #5)

### High — correctness and accessibility
5. Change all labels to meaningful, realistic text instead of state descriptions
6. Replace dynamic skip links with static always-visible `<nav>` listing all sections
7. Fix colour contrast to 7:1 in both light and dark modes
8. Add `accent-color: #003781` to `:root` (closes issue #1)
9. Fix `<legend><h3>` invalid nesting
10. Clean up leftover testing checkbox groups
11. Fix `* :disabled` → `*:disabled`; `:focus` → `:focus-visible`

### Medium — completeness
12. Add missing input types (email, tel, url, number, search, color, file, date, time)
13. Add `<button>` vs `<input type="submit/reset/button">` comparison section
14. Add `indeterminate` checkbox state
15. Complete "Minimal Design" tier (repair `design-basic.css`, rename, wire up highlight colour)
16. Consolidate design-02 and design-03 checkboxes into one "Minimal Design" checkbox
17. Add `<progress>` and `<meter>` sections

### Low — polish and maintenance
18. Replace Cash with ~20 lines of vanilla JS (removes CDN dependency)
19. Remove empty CSS rule blocks
20. Remove unused `--bright-green` variable and empty `@media (color-gamut: p3)` block
21. Add `gap` to `.grid-wrapper`
22. Update CI: `actions/checkout@v4`, supply GitHub token, add HTML validation
23. Add visible column-state headers ("Default", "Pre-filled", "Required", "Read-only", "Disabled") to help new testers orient themselves
24. Split 249-country datalist into a `<template>` or separate include file
