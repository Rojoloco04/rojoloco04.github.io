// ── Theme ─────────────────────────────────────────────────────────────────────
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

// ── Mobile menu ───────────────────────────────────────────────────────────────

const siteHeader = document.querySelector("#site-header");
const mobileMenuButton = document.querySelector("#mobile-menu-button");
const mobileMenu = document.querySelector("#mobile-menu");
const mobileBackdrop = document.querySelector("#mobile-backdrop");
const menuIcon = mobileMenuButton?.querySelector(".material-symbols-outlined");

function openMobileMenu() {
  mobileMenu?.classList.add("menu-open");
  mobileBackdrop?.classList.add("menu-open");
  siteHeader?.classList.add("menu-open");
  mobileMenu?.removeAttribute("inert");
  mobileMenuButton?.setAttribute("aria-expanded", "true");
  if (menuIcon) menuIcon.textContent = "close";
}

function closeMobileMenu() {
  mobileMenu?.classList.remove("menu-open");
  mobileBackdrop?.classList.remove("menu-open");
  siteHeader?.classList.remove("menu-open");
  mobileMenu?.setAttribute("inert", "");
  mobileMenuButton?.setAttribute("aria-expanded", "false");
  if (menuIcon) menuIcon.textContent = "menu";
}

mobileMenuButton?.addEventListener("click", () => {
  mobileMenu?.classList.contains("menu-open") ? closeMobileMenu() : openMobileMenu();
});

// Close the drawer when the backdrop or any nav link is tapped
mobileBackdrop?.addEventListener("click", closeMobileMenu);
mobileMenu?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMobileMenu);
});

// ── Active nav highlighting ───────────────────────────────────────────────────
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
    // Offset by the sticky header height (~72 px) and ignore the bottom 40 %
    // so that the link activates when the section title is just below the header.
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

// ── Scroll-reveal ─────────────────────────────────────────────────────────────
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

// ── Hero typewriter ───────────────────────────────────────────────────────────
// Cycles through phrases by typing and deleting them one character at a time.

const HERO_PHRASES = [
  "Jack Parrack.",
  "a software engineer.",
  "a hardware designer.",
  "a leader.",
  "a problem solver.",
];

const heroTyped = document.querySelector("#hero-typed");

if (heroTyped) {
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function typeHero() {
    // Pause when the tab is hidden to save battery
    if (document.hidden) {
      setTimeout(typeHero, 500);
      return;
    }

    const phrase = HERO_PHRASES[phraseIndex];

    heroTyped.textContent = isDeleting
      ? phrase.substring(0, charIndex - 1)
      : phrase.substring(0, charIndex + 1);

    if (isDeleting) charIndex--;
    else charIndex++;

    let delay = isDeleting ? 50 : 90;

    if (!isDeleting && charIndex === phrase.length) {
      // Pause at the end of a phrase before deleting
      delay = phraseIndex === 0 ? 2500 : 1800;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % HERO_PHRASES.length;
      delay = 350;
    }

    setTimeout(typeHero, delay);
  }

  // Short initial delay so the page can settle before typing starts
  setTimeout(typeHero, 600);
}

// ── Nav adaptive colour ───────────────────────────────────────────────────────
// Watches sections marked with data-bg="light". When one enters the viewport
// the header gains .nav-over-light so links stay readable against a pale bg.

const lightBgSections = document.querySelectorAll("[data-bg='light']");

if (siteHeader && lightBgSections.length) {
  let lightCount = 0;

  const navColorObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        lightCount += entry.isIntersecting ? 1 : -1;
      });
      lightCount = Math.max(0, lightCount);
      siteHeader.classList.toggle("nav-over-light", lightCount > 0);
    },
    { rootMargin: "-64px 0px 0px 0px", threshold: 0 }
  );

  lightBgSections.forEach((s) => navColorObserver.observe(s));
}

// ── Skill rings ───────────────────────────────────────────────────────────────
// Replaces each skill item's icon with a CSS conic-gradient ring that
// fills clockwise based on proficiency level (1–4).

(function () {

  function makeRing(level) {
    const div = document.createElement('div');
    div.classList.add('skill-ring', `lvl-${level}`);
    div.setAttribute('aria-hidden', 'true');
    div.dataset.target = String((level / 4) * 100);
    return div;
  }

  // Sort each skill list: highest level first, alphabetically within each level
  document.querySelectorAll('ul:has(li.skill-item[data-level])').forEach(ul => {
    const items = [...ul.querySelectorAll('li.skill-item[data-level]')];
    const label = li => li.textContent.trim();
    items.sort((a, b) => {
      const lvlDiff = parseInt(b.dataset.level, 10) - parseInt(a.dataset.level, 10);
      if (lvlDiff !== 0) return lvlDiff;
      return label(a).localeCompare(label(b));
    });
    items.forEach(li => ul.appendChild(li));
  });

  document.querySelectorAll('li.skill-item[data-level]').forEach(li => {
    const level = parseInt(li.dataset.level, 10);
    if (level < 1 || level > 4) return;
    const icon = li.querySelector('.material-symbols-outlined');
    const ring = makeRing(level);
    if (icon) icon.replaceWith(ring);
    else li.prepend(ring);
  });

  const skillsSection = document.querySelector('#skills');
  if (!skillsSection) return;

  const ringObserver = new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting) return;
    document.querySelectorAll('.skill-ring').forEach(ring => {
      ring.style.setProperty('--ring-pct', ring.dataset.target);
    });
    ringObserver.unobserve(skillsSection);
  }, { threshold: 0.15 });

  ringObserver.observe(skillsSection);
})();

// ── Contact form ──────────────────────────────────────────────────────────────
// Submits the form data to Formspree and shows success / error feedback.

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xqedgvzp";

const contactForm = document.querySelector("#contact-form");
const submitBtn = document.querySelector("#submit-btn");
const formStatus = document.querySelector("#form-status");

contactForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!submitBtn || !formStatus) return;

  // Clear any stale status from a previous submit
  formStatus.textContent = "";
  formStatus.className = "hidden text-center text-sm py-2.5 px-4 rounded-lg font-medium";

  // Disable the button and show a loading state
  submitBtn.disabled = true;
  submitBtn.innerHTML =
    '<span class="material-symbols-outlined !text-[18px]">hourglass_empty</span> Sending\u2026';

  try {
    const response = await fetch(FORMSPREE_ENDPOINT, {
      method: "POST",
      body: new FormData(contactForm),
      headers: { Accept: "application/json" },
    });

    if (response.ok) {
      formStatus.textContent = "Message sent! I\u2019ll get back to you soon.";
      formStatus.className =
        "text-center text-sm py-2.5 px-4 rounded-lg font-medium bg-green-900/40 border border-green-700/50 text-green-400";
      contactForm.reset();
    } else {
      const data = await response.json().catch(() => ({}));
      throw new Error(data?.errors?.[0]?.message ?? "Something went wrong.");
    }
  } catch (err) {
    formStatus.textContent =
      err instanceof Error
        ? err.message
        : "Failed to send. Please email me directly at parrackjack@gmail.com.";
    formStatus.className =
      "text-center text-sm py-2.5 px-4 rounded-lg font-medium bg-red-900/40 border border-red-700/50 text-red-400";
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML =
      '<span class="material-symbols-outlined !text-[18px]">send</span> Send Message';
    formStatus.classList.remove("hidden");
  }
});
