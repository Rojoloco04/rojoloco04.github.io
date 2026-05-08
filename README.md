# Jack Parrack — Personal Portfolio

Personal portfolio website for Jackson Parrack, built with **HTML**, **Tailwind CSS** (CDN), and **vanilla JavaScript**.

**Live site:** [rojoloco04.github.io](https://rojoloco04.github.io)

## Sections

| Section | Description |
|---|---|
| **About** | Hero intro with headshot, typewriter animation, and social links |
| **Projects** | Featured software / hardware projects in a masonry image gallery |
| **Experience** | Work and internship history (Mastercard, TIU, DataServ) |
| **Education** | Academic background and extracurricular activities |
| **Skills** | Languages, frameworks, cloud/DevOps, hardware, and human languages |
| **Contact** | Separate page (`contact.html`) with contact form and social links |

## File Structure

```
index.html      — Main page markup and Tailwind config
contact.html    — Contact page with form (Formspree) and social links
style.css       — CSS custom properties (light + dark themes), scrollbar, scroll-reveal animation
script.js       — Theme toggle, mobile menu, nav highlighting, scroll-reveal, hero typewriter, contact form
images/         — Headshot, project screenshots, favicons, and organisation logos
```

## Features

- **Dark / light theme** — persisted to `localStorage`; an inline `<script>` in `<head>` prevents the wrong-theme flash on load.
- **Hero typewriter animation** — cycles through phrases ("Jack Parrack.", "a software engineer.", etc.) with type/delete timing.
- **Scroll indicator** — subtle "scroll" label and bouncing arrow at the bottom of the hero viewport.
- **Scroll-reveal animations** — sections fade up into view as they enter the viewport (CSS `@keyframes fadeUp` + `IntersectionObserver`).
- **Active nav highlighting** — the header link for the currently visible section is highlighted via `IntersectionObserver`.
- **Responsive mobile menu** — hamburger drawer with auto-close on link tap or backdrop click.
- **Contact form** — submits via Formspree with loading state and success/error feedback.
- **Project gallery** — hover-reveal overlays on desktop, always-visible captions on mobile.
- **Open Graph / Twitter cards** — meta tags for rich social previews.

## Resume

The resume PDF (`JacksonParrack_Resume.pdf`) is hosted in the root of this repository and linked directly from the site.

## Tech Stack

- HTML5
- [Tailwind CSS](https://tailwindcss.com/) (CDN with forms plugin)
- Vanilla JavaScript (ES2020+)
- [Google Fonts — Google Sans](https://fonts.google.com/specimen/Google+Sans)
- [Google Material Symbols](https://fonts.google.com/icons)
- [Formspree](https://formspree.io/) (contact form back-end)
