const state = {
  activeSection: null,
};

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
  const isHidden = mobileMenu?.classList.contains("hidden") ?? true;
  isHidden ? openMobileMenu() : closeMobileMenu();
});

// Close drawer when any mobile nav link is tapped
const mobileNavLinks = mobileMenu?.querySelectorAll("a");
mobileNavLinks?.forEach((link) => {
  link.addEventListener("click", closeMobileMenu);
});

// ── Active nav highlighting via IntersectionObserver ─────────────────────────

const allNavLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll("section[id]");

function setActiveLink(sectionId) {
  allNavLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${sectionId}`;
    link.classList.toggle("text-white", isActive);
    link.classList.toggle("text-text-secondary", !isActive);
  });
}

const observerOptions = {
  // Subtract the sticky header height (~72px) from the top so links activate
  // when the section title is just below the header.
  rootMargin: "-72px 0px -40% 0px",
  threshold: 0,
};

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute("id");
      if (id) {
        state.activeSection = id;
        setActiveLink(id);
      }
    }
  });
}, observerOptions);

sections.forEach((section) => {
  sectionObserver.observe(section);
});

// ── Initial active link (page load at top) ───────────────────────────────────

function syncFromHash() {
  const hash = window.location.hash.slice(1);
  if (hash) {
    setActiveLink(hash);
  } else if (sections.length > 0) {
    const firstId = sections[0].getAttribute("id");
    if (firstId) setActiveLink(firstId);
  }
}

syncFromHash();
window.addEventListener("hashchange", syncFromHash);

// ── Contact form ───────────────────────────────────────────────────────────────
const FORMSPREE_ENDPOINT = "https://formspree.io/f/xqedgvzp";

const contactForm = document.querySelector("#contact-form");
const submitBtn = document.querySelector("#submit-btn");
const formStatus = document.querySelector("#form-status");

contactForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!submitBtn || !formStatus) return;

  submitBtn.disabled = true;
  submitBtn.innerHTML =
    '<span class="material-symbols-outlined !text-[18px]">hourglass_empty</span> Sending...';

  try {
    const response = await fetch(FORMSPREE_ENDPOINT, {
      method: "POST",
      body: new FormData(contactForm),
      headers: { Accept: "application/json" },
    });

    if (response.ok) {
      formStatus.textContent = "Message sent! I'll get back to you soon.";
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
