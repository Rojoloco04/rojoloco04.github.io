/*
 * script.js — Behaviour for index.html and contact.html
 *
 * Layout:
 *   1. Theme toggle
 *   2. Mobile menu
 *   3. Active nav highlighting
 *   4. Scroll-reveal
 *   5. Hero typewriter
 *   6. Skill meters
 *   7. Local time
 *   8. Contact form
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

/** Keep every theme-toggle icon in sync with the current mode. */
function syncThemeUI() {
  const dark = isDark();
  document.querySelectorAll(".theme-icon").forEach((icon) => {
    icon.textContent = dark ? "light_mode" : "dark_mode";
  });
}

document.querySelectorAll(".theme-btn").forEach((btn) => {
  btn.addEventListener("click", () => setTheme(!isDark()));
});

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
// Uses IntersectionObserver so the header nav marks the section currently
// visible in the viewport.

const allNavLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll("section[id]");

function setActiveLink(sectionId) {
  allNavLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${sectionId}`;
    link.classList.toggle("text-fg", isActive);
    link.classList.toggle("text-muted", !isActive);
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
// `.reveal` blocks fade up a few pixels when they enter the viewport.

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
  { threshold: 0.05 }
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
const INITIAL_DELAY_MS = 700;

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

// ── 6. Skill meters ───────────────────────────────────────────────────────────
// Each `.skill-row[data-level]` (1-4) gets a four-square meter with `level`
// squares filled. Lists are sorted highest level first, alphabetically within
// a level.

const MAX_SKILL_LEVEL = 4;
const LEVEL_LABELS = ["", "Beginner", "Intermediate", "Proficient", "Expert"];

document.querySelectorAll("ul:has(.skill-row[data-level])").forEach((ul) => {
  const items = [...ul.querySelectorAll(".skill-row[data-level]")];
  const label = (li) => li.textContent.trim();
  items.sort((a, b) => {
    const levelDiff = parseInt(b.dataset.level, 10) - parseInt(a.dataset.level, 10);
    if (levelDiff !== 0) return levelDiff;
    return label(a).localeCompare(label(b));
  });
  items.forEach((li) => ul.appendChild(li));
});

document.querySelectorAll(".skill-row[data-level]").forEach((li) => {
  const level = parseInt(li.dataset.level, 10);
  if (!(level >= 1 && level <= MAX_SKILL_LEVEL)) return;

  const name = document.createElement("span");
  name.textContent = li.textContent.trim();
  li.textContent = "";
  li.append(name);

  const meter = document.createElement("span");
  meter.className = "meter";
  meter.setAttribute("role", "img");
  meter.setAttribute("aria-label", `${LEVEL_LABELS[level]} (${level} of ${MAX_SKILL_LEVEL})`);
  meter.title = LEVEL_LABELS[level];
  for (let i = 0; i < MAX_SKILL_LEVEL; i++) {
    const seg = document.createElement("i");
    if (i < level) seg.className = "f";
    meter.append(seg);
  }
  li.append(meter);
});

// ── 7. Local time ─────────────────────────────────────────────────────────────
// Footer clock in St. Louis time, refreshed every 30s.

const localTime = document.querySelector("#local-time");

if (localTime) {
  const fmt = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/Chicago",
  });
  const tick = () => {
    localTime.textContent = fmt.format(new Date());
  };
  tick();
  setInterval(tick, 30_000);
}

// ── 8. Contact form ───────────────────────────────────────────────────────────
// Submits the form data to Formspree and shows success / error feedback.
// The form also carries a plain `action`/`method`, so it still works without JS.

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xqedgvzp";

// Tinted backgrounds/borders read correctly in both themes; only the text colour
// needs a per-theme value to stay legible.
const STATUS_BASE_CLASSES = "text-sm py-2.5 px-4 font-medium border";
const STATUS_SUCCESS_CLASSES = "bg-green-500/10 border-green-500/40 text-green-700 dark:text-green-400";
const STATUS_ERROR_CLASSES = "bg-red-500/10 border-red-500/40 text-red-700 dark:text-red-400";

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
