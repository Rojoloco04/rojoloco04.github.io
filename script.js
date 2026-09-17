/*
 * script.js — Behaviour for index.html and contact.html
 *
 * Layout:
 *   1. Theme toggle
 *   2. Mobile menu
 *   3. Active nav highlighting
 *   4. Scroll-reveal
 *   5. Hero typewriter
 *   6. Skill rings
 *   7. Contact form
 *
 * Both pages load this file, so every lookup is optional — a selector that only
 * exists on one page simply yields null on the other.
 */

// ── 1. Theme ──────────────────────────────────────────────────────────────────
// Reads/writes the `dark` class on <html> and persists the choice to
// localStorage so the inline script in <head> can restore it before paint.

function isDark() {
  return document.documentElement.classList.contains("dark");
}

function setTheme(dark) {
  document.documentElement.classList.toggle("dark", dark);
  localStorage.setItem("theme", dark ? "dark" : "light");
  syncThemeUI();
}

/** Keep every theme-toggle icon / label in sync with the current mode. */
function syncThemeUI() {
  const dark = isDark();
  const icon = document.querySelector("#theme-icon");
  if (icon) icon.textContent = dark ? "light_mode" : "dark_mode";

  const mobileIcon = document.querySelector("#mobile-theme-icon");
  if (mobileIcon) mobileIcon.textContent = dark ? "light_mode" : "dark_mode";
}

document.querySelector("#theme-toggle")?.addEventListener("click", () => setTheme(!isDark()));
document.querySelector("#mobile-theme-toggle")?.addEventListener("click", () => setTheme(!isDark()));

syncThemeUI();

// ── 2. Mobile menu ────────────────────────────────────────────────────────────

const siteHeader = document.querySelector("#site-header");
const mobileMenuButton = document.querySelector("#mobile-menu-button");
const mobileMenu = document.querySelector("#mobile-menu");
const mobileBackdrop = document.querySelector("#mobile-backdrop");
const menuIcon = mobileMenuButton?.querySelector(".material-symbols-outlined");

// Matches Tailwind's `md` breakpoint, above which the drawer is display:none.
const desktopQuery = window.matchMedia("(min-width: 768px)");

function isMobileMenuOpen() {
  return mobileMenu?.classList.contains("menu-open") ?? false;
}

function openMobileMenu() {
  mobileMenu?.classList.add("menu-open");
  mobileBackdrop?.classList.add("menu-open");
  siteHeader?.classList.add("menu-open");
  document.body.classList.add("menu-open");
  mobileMenu?.removeAttribute("inert");
  mobileMenuButton?.setAttribute("aria-expanded", "true");
  if (menuIcon) menuIcon.textContent = "close";
}

function closeMobileMenu() {
  mobileMenu?.classList.remove("menu-open");
  mobileBackdrop?.classList.remove("menu-open");
  siteHeader?.classList.remove("menu-open");
  document.body.classList.remove("menu-open");
  mobileMenu?.setAttribute("inert", "");
  mobileMenuButton?.setAttribute("aria-expanded", "false");
  if (menuIcon) menuIcon.textContent = "menu";
}

mobileMenuButton?.addEventListener("click", () => {
  if (isMobileMenuOpen()) closeMobileMenu();
  else openMobileMenu();
});

// Close the drawer when the backdrop or any nav link is tapped
mobileBackdrop?.addEventListener("click", closeMobileMenu);
mobileMenu?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMobileMenu);
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && isMobileMenuOpen()) {
    closeMobileMenu();
    mobileMenuButton?.focus();
  }
});

// Crossing into desktop hides the drawer via CSS, but the header would keep its
// squared-off "menu open" corners and the body would stay scroll-locked.
desktopQuery.addEventListener("change", (e) => {
  if (e.matches) closeMobileMenu();
});

// ── 3. Active nav highlighting ────────────────────────────────────────────────
// Uses IntersectionObserver so the header nav underlines the section currently
// visible in the viewport.

const allNavLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll("section[id]");

function setActiveLink(sectionId) {
  allNavLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${sectionId}`;
    link.classList.toggle("text-foreground", isActive);
    link.classList.toggle("text-text-secondary", !isActive);
  });
}

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        if (id) setActiveLink(id);
      }
    });
  },
  {
    // Clear the 68px sticky header (plus a few px of slack) and ignore the bottom
    // 40% so a link activates once its section title sits just below the header.
    rootMargin: "-72px 0px -40% 0px",
    threshold: 0,
  }
);

sections.forEach((section) => sectionObserver.observe(section));

// Set initial active link based on the URL hash (or default to the first section)
function syncFromHash() {
  let hash = "";
  try {
    hash = decodeURIComponent(window.location.hash.slice(1));
  } catch {
    hash = window.location.hash.slice(1);
  }
  if (hash) {
    setActiveLink(hash);
  } else if (sections.length) {
    setActiveLink(sections[0].getAttribute("id") ?? "");
  }
}

syncFromHash();
window.addEventListener("hashchange", syncFromHash);

// ── 4. Scroll-reveal ──────────────────────────────────────────────────────────
// Sections with the `.reveal` class fade up into view when they enter the
// viewport, powered by a separate IntersectionObserver.

const revealElements = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);

revealElements.forEach((el) => revealObserver.observe(el));

// ── 5. Hero typewriter ────────────────────────────────────────────────────────
// Cycles through phrases by typing and deleting them one character at a time.
// Keep phrases short — the hero line is `whitespace-nowrap`, so a long one would
// run past the edge of a narrow screen.

const HERO_PHRASES = [
  "Jack Parrack.",
  "a software engineer.",
  "a hardware designer.",
  "a leader.",
  "a problem solver.",
];

const TYPE_DELAY_MS = 90;
const DELETE_DELAY_MS = 50;
const PAUSE_FIRST_PHRASE_MS = 2500;
const PAUSE_PHRASE_MS = 1800;
const PAUSE_BETWEEN_PHRASES_MS = 350;
const HIDDEN_TAB_POLL_MS = 500;
const INITIAL_DELAY_MS = 600;

const heroTyped = document.querySelector("#hero-typed");

if (heroTyped) {
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  const typeHero = () => {
    // Pause when the tab is hidden to save battery
    if (document.hidden) {
      setTimeout(typeHero, HIDDEN_TAB_POLL_MS);
      return;
    }

    const phrase = HERO_PHRASES[phraseIndex];

    heroTyped.textContent = isDeleting
      ? phrase.substring(0, charIndex - 1)
      : phrase.substring(0, charIndex + 1);

    if (isDeleting) charIndex--;
    else charIndex++;

    let delay = isDeleting ? DELETE_DELAY_MS : TYPE_DELAY_MS;

    if (!isDeleting && charIndex === phrase.length) {
      // Pause at the end of a phrase before deleting
      delay = phraseIndex === 0 ? PAUSE_FIRST_PHRASE_MS : PAUSE_PHRASE_MS;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % HERO_PHRASES.length;
      delay = PAUSE_BETWEEN_PHRASES_MS;
    }

    setTimeout(typeHero, delay);
  };

  // Short initial delay so the page can settle before typing starts
  setTimeout(typeHero, INITIAL_DELAY_MS);
}

// ── 6. Skill rings ────────────────────────────────────────────────────────────
// Replaces each skill item's icon with a CSS conic-gradient ring that
// fills clockwise based on proficiency level (1–4).

const MAX_SKILL_LEVEL = 4;

function makeSkillRing(level) {
  const ring = document.createElement("div");
  ring.classList.add("skill-ring", `lvl-${level}`);
  ring.setAttribute("aria-hidden", "true");
  ring.dataset.target = String((level / MAX_SKILL_LEVEL) * 100);
  return ring;
}

// Sort each skill list: highest level first, alphabetically within each level
document.querySelectorAll("ul:has(li.skill-item[data-level])").forEach((ul) => {
  const items = [...ul.querySelectorAll("li.skill-item[data-level]")];
  const label = (li) => li.textContent.trim();
  items.sort((a, b) => {
    const levelDiff = parseInt(b.dataset.level, 10) - parseInt(a.dataset.level, 10);
    if (levelDiff !== 0) return levelDiff;
    return label(a).localeCompare(label(b));
  });
  items.forEach((li) => ul.appendChild(li));
});

document.querySelectorAll("li.skill-item[data-level]").forEach((li) => {
  const level = parseInt(li.dataset.level, 10);
  if (!(level >= 1 && level <= MAX_SKILL_LEVEL)) return;
  const icon = li.querySelector(".material-symbols-outlined");
  const ring = makeSkillRing(level);
  if (icon) icon.replaceWith(ring);
  else li.prepend(ring);
});

// Hold the rings at 0% until the section scrolls in, then let CSS animate the fill
const skillsSection = document.querySelector("#skills");

if (skillsSection) {
  const ringObserver = new IntersectionObserver(
    (entries) => {
      if (!entries[0].isIntersecting) return;
      document.querySelectorAll(".skill-ring").forEach((ring) => {
        ring.style.setProperty("--ring-pct", ring.dataset.target);
      });
      ringObserver.unobserve(skillsSection);
    },
    { threshold: 0.15 }
  );

  ringObserver.observe(skillsSection);
}

// ── 7. Contact form ───────────────────────────────────────────────────────────
// Submits the form data to Formspree and shows success / error feedback.
// The form also carries a plain `action`/`method`, so it still works without JS.

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xqedgvzp";

// Tinted backgrounds/borders read correctly in both themes; only the text colour
// needs a per-theme value to stay legible.
const STATUS_BASE_CLASSES = "text-center text-sm py-2.5 px-4 rounded-lg font-medium border";
const STATUS_SUCCESS_CLASSES = "bg-green-500/15 border-green-500/40 text-green-700 dark:text-green-400";
const STATUS_ERROR_CLASSES = "bg-red-500/15 border-red-500/40 text-red-700 dark:text-red-400";

const contactForm = document.querySelector("#contact-form");
const submitBtn = document.querySelector("#submit-btn");
const formStatus = document.querySelector("#form-status");

function setFormStatus(message, variantClasses) {
  if (!formStatus) return;
  formStatus.textContent = message;
  formStatus.className = `${STATUS_BASE_CLASSES} ${variantClasses}`;
}

contactForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!submitBtn || !formStatus) return;

  // Clear any stale status from a previous submit
  formStatus.textContent = "";
  formStatus.className = `hidden ${STATUS_BASE_CLASSES}`;

  // Disable the button and show a loading state
  submitBtn.disabled = true;
  submitBtn.innerHTML =
    '<span class="material-symbols-outlined !text-[18px]">hourglass_empty</span> Sending…';

  try {
    const response = await fetch(FORMSPREE_ENDPOINT, {
      method: "POST",
      body: new FormData(contactForm),
      headers: { Accept: "application/json" },
    });

    if (response.ok) {
      setFormStatus("Message sent! I’ll get back to you soon.", STATUS_SUCCESS_CLASSES);
      contactForm.reset();
    } else {
      const data = await response.json().catch(() => ({}));
      throw new Error(data?.errors?.[0]?.message ?? "Something went wrong.");
    }
  } catch (err) {
    setFormStatus(
      err instanceof Error
        ? err.message
        : "Failed to send. Please email me directly at parrackjack@gmail.com.",
      STATUS_ERROR_CLASSES
    );
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML =
      '<span class="material-symbols-outlined !text-[18px]">send</span> Send Message';
    formStatus.classList.remove("hidden");
  }
});
