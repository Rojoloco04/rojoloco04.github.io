# Jack Parrack — Personal Portfolio

Personal portfolio website for Jackson Parrack, built with **HTML**, **Tailwind CSS** (CDN), and **vanilla JavaScript**.

**Live site:** [rojoloco04.github.io](https://rojoloco04.github.io)

## Sections

| Section | Description |
|---|---|
| **About** | Hero intro and overview |
| **Projects** | Featured software / hardware projects |
| **Experience** | Work and internship history |
| **Activities** | Clubs, organisations, and extracurriculars |
| **Education** | Academic background |
| **Skills** | Languages, frameworks, and tools |
| **Contact** | Contact form (Formspree) and social links |

## File Structure

```
index.html      — Page markup and Tailwind config
style.css       — CSS custom properties (light + dark themes), scrollbar, scroll-reveal animation
script.js       — Theme toggle, mobile menu, nav highlighting, scroll-reveal, back-to-top, contact form
images/         — Hero image, favicons, and organisation logos
```

## Features

- **Dark / light theme** — persisted to `localStorage`; an inline `<script>` in `<head>` prevents the wrong-theme flash on load.
- **Scroll-reveal animations** — sections fade up into view as they enter the viewport (CSS `@keyframes fadeUp` + `IntersectionObserver`).
- **Active nav highlighting** — the header link for the currently visible section is highlighted via `IntersectionObserver`.
- **Responsive mobile menu** — hamburger drawer with auto-close on link tap.
- **Back-to-top button** — appears after scrolling past the first viewport height.
- **Contact form** — submits via Formspree with loading state and success/error feedback.

## Resume

The resume PDF (`JacksonParrack_Resume.pdf`) is hosted in the root of this repository and linked directly from the site.

## Tech Stack

- HTML5
- [Tailwind CSS](https://tailwindcss.com/) (CDN with forms plugin)
- Vanilla JavaScript (ES2020+)
- [Google Fonts — Google Sans](https://fonts.google.com/specimen/Google+Sans)
- [Google Material Symbols](https://fonts.google.com/icons)
- [Formspree](https://formspree.io/) (contact form back-end)
