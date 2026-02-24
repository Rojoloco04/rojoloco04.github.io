// script.ts — Portfolio interactive behaviors
// Compiled to script.js for browser use.

interface NavState {
  activeSection: string | null;
}

const state: NavState = {
  activeSection: null,
};

// ── Mobile menu ───────────────────────────────────────────────────────────────

const mobileMenuButton = document.querySelector<HTMLButtonElement>("#mobile-menu-button");
const mobileMenu = document.querySelector<HTMLElement>("#mobile-menu");
const menuIcon = mobileMenuButton?.querySelector<HTMLSpanElement>(".material-symbols-outlined");

function openMobileMenu(): void {
  mobileMenu?.classList.remove("hidden");
  if (menuIcon) menuIcon.textContent = "close";
}

function closeMobileMenu(): void {
  mobileMenu?.classList.add("hidden");
  if (menuIcon) menuIcon.textContent = "menu";
}

mobileMenuButton?.addEventListener("click", (): void => {
  const isHidden: boolean = mobileMenu?.classList.contains("hidden") ?? true;
  isHidden ? openMobileMenu() : closeMobileMenu();
});

// Close drawer when any mobile nav link is tapped
const mobileNavLinks = mobileMenu?.querySelectorAll<HTMLAnchorElement>("a");
mobileNavLinks?.forEach((link: HTMLAnchorElement): void => {
  link.addEventListener("click", closeMobileMenu);
});

// ── Active nav highlighting via IntersectionObserver ─────────────────────────

const allNavLinks = document.querySelectorAll<HTMLAnchorElement>(".nav-link");
const sections = document.querySelectorAll<HTMLElement>("section[id]");

function setActiveLink(sectionId: string): void {
  allNavLinks.forEach((link: HTMLAnchorElement): void => {
    const isActive = link.getAttribute("href") === `#${sectionId}`;
    link.classList.toggle("text-white", isActive);
    link.classList.toggle("text-text-secondary", !isActive);
  });
}

const observerOptions: IntersectionObserverInit = {
  // Subtract the sticky header height (~72px) from the top so links activate
  // when the section title is just below the header.
  rootMargin: "-72px 0px -40% 0px",
  threshold: 0,
};

const sectionObserver = new IntersectionObserver(
  (entries: IntersectionObserverEntry[]): void => {
    entries.forEach((entry: IntersectionObserverEntry): void => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        if (id) {
          state.activeSection = id;
          setActiveLink(id);
        }
      }
    });
  },
  observerOptions
);

sections.forEach((section: HTMLElement): void => {
  sectionObserver.observe(section);
});

// ── Initial active link (page load at top) ───────────────────────────────────

// Highlight the correct link based on the URL hash on first load.
function syncFromHash(): void {
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
