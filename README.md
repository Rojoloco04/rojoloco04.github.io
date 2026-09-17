# Jack Parrack — Personal Portfolio

Personal portfolio website for Jackson Parrack, built with **HTML**, **Tailwind CSS** (CDN), and **vanilla JavaScript**.

**Live site:** [rojoloco04.github.io](https://rojoloco04.github.io)

## Sections

| Section | Description |
|---|---|
| **About** | Hero intro with headshot, typewriter animation, and social links |
| **Projects** | Featured software / hardware projects in a masonry image gallery |
| **Experience** | Work and internship history (Mastercard, DataServ) |
| **Education** | Academic background and extracurricular activities |
| **Skills** | Programming languages, tools/platforms, hardware, and spoken languages |
| **Contact** | Separate page (`contact.html`) with contact form and social links |

## File Structure

```
index.html      — Main page markup, Tailwind config, and shared component classes
contact.html    — Contact page with form (Formspree) and social links
style.css       — CSS custom properties (light + dark themes), scrollbar, scroll-reveal, skill rings
script.js       — Theme toggle, mobile menu, nav highlighting, scroll-reveal, hero typewriter, skill rings, contact form
images/         — Headshot, project screenshots, favicon, and organisation logos
```

## Features

- **Dark / light theme** — persisted to `localStorage`; an inline `<script>` in `<head>` prevents the wrong-theme flash on load.
- **Hero typewriter animation** — cycles through phrases ("Jack Parrack.", "a software engineer.", etc.) with type/delete timing.
- **Scroll indicator** — subtle "scroll" label and bouncing arrow at the bottom of the hero viewport.
- **Scroll-reveal animations** — sections fade up into view as they enter the viewport (CSS `@keyframes fadeUp` + `IntersectionObserver`).
- **Active nav highlighting** — the header link for the currently visible section is highlighted via `IntersectionObserver`.
- **Responsive mobile menu** — hamburger drawer that closes on link tap, backdrop click, `Escape`, or
  crossing up into the desktop breakpoint; locks page scroll while open.
- **Skill proficiency rings** — each skill's `data-level` (1–4) renders as a conic-gradient ring that fills when the Skills section scrolls into view; lists are auto-sorted by level.
- **Contact form** — submits via Formspree with loading state and success/error feedback; the form
  also carries a plain `action`/`method` so it still posts without JavaScript.
- **Project gallery** — hover-reveal overlays on desktop, always-visible captions on mobile.
- **Open Graph / Twitter cards** — meta tags for rich social previews.
- **Reduced motion** — `prefers-reduced-motion` drops the reveal, cursor, bounce, and ring animations
  without hiding any content; a `<noscript>` block also unhides `.reveal` sections when JS is off.

## Type scale

Text uses the default Tailwind scale (`text-xs` / `sm` / `base` / `2xl` / `4xl` / `5xl` …). Two
deliberate exceptions:

- `text-[10px]` for the small uppercase eyebrow labels — Tailwind has no step below `text-xs` (12px).
- `text-[1.75rem]` for the hero's smallest step. The hero line is `whitespace-nowrap`, so each
  breakpoint is sized to fit the longest typewriter phrase in the width actually left over; from `md`
  up the headshot sits alongside and takes 256–288px of it. Adding a longer phrase to `HERO_PHRASES`
  means re-checking that fit.

Material Symbols icons use a fixed four-step ladder: `!text-[12px]`, `[14px]`, `[18px]`, `[20px]`.

## Resume

The resume PDF (`JacksonParrack_Resume.pdf`) is hosted in the root of this repository and linked directly from the site.

## Tech Stack

- HTML5
- [Tailwind CSS](https://tailwindcss.com/) (CDN with forms plugin)
- Vanilla JavaScript (ES2020+)
- [Google Fonts — Google Sans](https://fonts.google.com/specimen/Google+Sans)
- [Google Material Symbols](https://fonts.google.com/icons)
- [Formspree](https://formspree.io/) (contact form back-end)
