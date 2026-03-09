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

const mobileMenuButton = document.querySelector("#mobile-menu-button");
const mobileMenu = document.querySelector("#mobile-menu");
const menuIcon = mobileMenuButton?.querySelector(".material-symbols-outlined");

function openMobileMenu() {
  mobileMenu?.classList.remove("hidden");
  if (menuIcon) menuIcon.textContent = "close";
}

function closeMobileMenu() {
  mobileMenu?.classList.add("hidden");
  if (menuIcon) menuIcon.textContent = "menu";
}

mobileMenuButton?.addEventListener("click", () => {
  mobileMenu?.classList.contains("hidden") ? openMobileMenu() : closeMobileMenu();
});

// Close the drawer when any mobile nav link is tapped
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
  const hash = window.location.hash.slice(1);
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

// ── Back-to-top button ───────────────────────────────────────────────────────
// Shows after the user scrolls past the first viewport height.

const backToTop = document.querySelector("#back-to-top");

if (backToTop) {
  window.addEventListener(
    "scroll",
    () => {
      backToTop.classList.toggle("hidden", window.scrollY < window.innerHeight);
      backToTop.classList.toggle("flex", window.scrollY >= window.innerHeight);
    },
    { passive: true }
  );

  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

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
    const phrase = HERO_PHRASES[phraseIndex];

    heroTyped.textContent = isDeleting
      ? phrase.substring(0, charIndex - 1)
      : phrase.substring(0, charIndex + 1);

    isDeleting ? charIndex-- : charIndex++;

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

// ── Contact form ──────────────────────────────────────────────────────────────
// Submits the form data to Formspree and shows success / error feedback.

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xqedgvzp";

const contactForm = document.querySelector("#contact-form");
const submitBtn = document.querySelector("#submit-btn");
const formStatus = document.querySelector("#form-status");

contactForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!submitBtn || !formStatus) return;

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
