# Jack Parrack — Personal Portfolio

Personal portfolio website for Jackson Parrack, built with **HTML**, **Tailwind CSS** (CDN), and **vanilla JavaScript**.

**Live site:** [rojoloco04.github.io](https://rojoloco04.github.io)

## Sections

| Section | Description |
|---|---|
| **About** | Typewriter headline, one-line intro, text links, and the headshot drawn as an IC package |
| **Projects** | Project list with greyscale thumbnails that colour in on hover |
| **Experience** | Work and internship history (Mastercard, DataServ) with dates in the margin |
| **Education** | Academic background and extracurricular activities |
| **Skills** | Programming languages, tools/platforms, hardware, and spoken languages with four-square proficiency meters |
| **Contact** | Separate page (`contact.html`) with an underline-style form and direct channels |

## File Structure

```
index.html      — Main page markup and Tailwind config
contact.html    — Contact page with form (Formspree) and direct channels
style.css       — Theme tokens (light + dark), header pill, chip headshot, page structure, meters, form
script.js       — Theme toggle, mobile menu, nav highlighting, scroll-reveal, typewriter, skill meters,
                  local time, contact form
images/         — Headshot, project screenshots, favicon, and organisation logos
```

## Design

The site is laid out like an engineering notebook: a monospace label sits in the left margin of each
section (sticky on desktop), content runs down the right, and sections are separated by hairlines
that start with a small via. The one expressive element is the headshot, drawn as an IC package with
pin stubs on every side, a handful of traces routed out to vias, a pin-1 marker, and a single slow
pulse. Everything else is text, rules, and one blue.

- **Type** — [IBM Plex Sans](https://fonts.google.com/specimen/IBM+Plex+Sans) at light and regular
  weights for text, [IBM Plex Mono](https://fonts.google.com/specimen/IBM+Plex+Mono) for labels,
  dates, and tag lists. Tags are plain mono text separated by middle dots rather than chips.
- **Colour** — every colour is a CSS custom property in `style.css` (`--c-*`, as space-separated RGB so
  Tailwind's `/opacity` modifiers work). The Tailwind config maps them to `canvas`, `surface`, `fg`,
  `muted`, `line`, and `primary`. The page background is named `canvas` rather than `base` on purpose:
  a colour called `base` would make Tailwind's `text-base` font-size utility also set the text colour.
- **No cards, no radius** — content is separated by 1px rules, and the header is the same hairline bar.
- **Screenshots** — project thumbnails are greyscale at rest so the mixed captures sit quietly
  together; they return to colour on hover, and are always in colour on touch devices.
- **Logos** — the organisation logos in `images/` are transparent PNGs (backgrounds knocked out,
  cropped, padded to a square) drawn directly on the page in their own colours, no box behind them.

## Features

- **Dark / light theme** — persisted to `localStorage`; an inline `<script>` in `<head>` prevents the wrong-theme flash on load.
- **Hero typewriter** — cycles through phrases ("Jack Parrack.", "a software engineer.", etc.) with type/delete timing.
- **Chip headshot** — the SVG is 7/3 the size of the photo and centred on it, so `--s` on `.chip` is
  the only size knob; `vector-effect: non-scaling-stroke` keeps the lines 1px at every size.
- **Header** — sticky hairline bar with the current section's link highlighted. On mobile a drawer
  drops down under the bar (absolutely positioned, so it never pushes the page) and closes on link
  tap, backdrop click, `Escape`, or crossing into the desktop breakpoint; it locks page scroll while open.
- **Skill meters** — each `.skill-row`'s `data-level` (1–4) becomes four small squares with `level`
  filled; lists are auto-sorted by level, then name, and the meter exposes its level to assistive tech.
- **Scroll-reveal** — each section fades up a few pixels as it enters the viewport.
- **Footer** — links and St. Louis local time.
- **Contact form** — submits via Formspree with loading state and success/error feedback; the form
  also carries a plain `action`/`method` so it still posts without JavaScript.
- **Open Graph / Twitter cards** — meta tags for rich social previews.
- **Reduced motion** — `prefers-reduced-motion` drops the pulse, cursor blink, fade-ins, and reveals
  without hiding any content; a `<noscript>` block also unhides revealed sections when JS is off.

## Type scale

Text uses the default Tailwind scale plus a few arbitrary values:

- The body is 15px (`text-[15px]`); mono labels are 0.72rem.
- The hero line is `whitespace-nowrap`, so each breakpoint is sized to fit the longest typewriter
  phrase ("a hardware designer.") in the width actually left over. Current steps are `2rem` /
  `sm:4xl` / `md:2.375rem` / `lg:3.5rem` / `xl:6xl`. Adding a longer phrase to `HERO_PHRASES` means
  re-checking that fit.
- Material Symbols icons use explicit `!text-[Npx]` utilities (12–20px) so they never inherit the
  surrounding font size.

## Resume

The resume PDF (`JacksonParrack_Resume.pdf`) is hosted in the root of this repository and linked directly from the site.

## Tech Stack

- HTML5
- [Tailwind CSS](https://tailwindcss.com/) (CDN with forms plugin)
- Vanilla JavaScript (ES2020+)
- [Google Fonts](https://fonts.google.com/) — IBM Plex Sans, IBM Plex Mono
- [Google Material Symbols](https://fonts.google.com/icons)
- [Formspree](https://formspree.io/) (contact form back-end)
