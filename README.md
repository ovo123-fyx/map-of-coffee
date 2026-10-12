# Map of Coffee

A curated guide to Brisbane's specialty coffee shops — built from scratch with
vanilla HTML, CSS and JavaScript. No frameworks, no site builders, no build step.

**Live demo:** _(enable GitHub Pages to publish)_

---

## What it does

Five pages, each solving one job for the visitor:

| Page | Purpose |
|------|---------|
| `index.html` | Landing page — hero, search entry point, Brisbane map |
| `list.html` | Browse all cafés, filter live by name or suburb |
| `detail.html` | A single café — menu with category filtering |
| `guide.html` | Brewing methods, tasting notes, FAQ accordion |
| `about.html` | About the project, team, contact form |

## Features

- **Live search** — filters the café list as you type, with no page reload, and
  hides a whole row once all of its cards are filtered out.
- **Menu filtering** — category tabs on the detail page, implemented with
  *event delegation* so a single listener handles every tab.
- **FAQ accordion** — same delegation pattern; only one answer stays open.
- **Dark mode** — toggled on the client and applied across all five pages.
- **Back-to-top** — appears on scroll past a threshold, smooth-scrolls up.
- **Responsive layout** — breakpoint-driven; collapses to a hamburger menu on mobile.

## Accessibility

Interactive controls carry the ARIA state they need, rather than relying on
visual cues alone:

```html
<button class="nav-toggle" id="navToggle"
        aria-label="Toggle navigation"
        aria-expanded="false"
        aria-controls="navLinks">
```

Document structure uses semantic landmarks (`<header>`, `<nav>`, `<main>`,
`<footer>`) so screen readers can navigate by region.

## Tech

```
HTML5          semantic markup, ARIA attributes
CSS3           custom properties, flexbox + grid, media queries
JavaScript     vanilla ES6, event delegation, no dependencies
Google Fonts   Playfair Display (display) + Inter (body)
```

No build tooling. Clone and open `index.html`.

## Structure

```
map-of-coffee/
├── index.html · list.html · detail.html · guide.html · about.html
├── css/style.css          ~1,700 lines
├── js/script.js           ~190 lines
├── images/
└── REFERENCES.txt         image sources and licences
```

## Credits

Photography from [Unsplash](https://unsplash.com) under the Unsplash License.
Full attribution in `REFERENCES.txt`.

---

Originally built as individual coursework for DECO1400 (Introduction to Web
Design) at the University of Queensland, and kept here as a portfolio piece.
