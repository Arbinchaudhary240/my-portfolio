const STORAGE_KEY = "portfolio-theme";

function toggleDarkMode(force) {
  const isDark = typeof force === "boolean" ? force : !document.body.classList.contains("dark-mode");
  document.body.classList.toggle("dark-mode", isDark);
  localStorage.setItem(STORAGE_KEY, isDark ? "dark" : "light");

  const modeToggle = document.getElementById("modeToggle");
  if (!modeToggle) return;

  const icon = modeToggle.querySelector(".mode-toggle__icon");
  const label = modeToggle.querySelector(".mode-toggle__label");

  if (isDark) {
    icon.textContent = "🌞";
    label.textContent = "Light";
  } else {
    icon.textContent = "🌙";
    label.textContent = "Dark";
  }
}

function initTheme() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    toggleDarkMode(stored === "dark");
    return;
  }

  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  toggleDarkMode(prefersDark);
}

function setupNav() {
  const nav = document.getElementById("primaryNav");
  const toggle = document.getElementById("navToggle");
  const links = Array.from(nav?.querySelectorAll(".nav__link") ?? []);

  if (!nav || !toggle) return;

  const setExpanded = (expanded) => {
    toggle.setAttribute("aria-expanded", String(expanded));
    nav.classList.toggle("active", expanded);
  };

  toggle.addEventListener("click", () => {
    setExpanded(!nav.classList.contains("active"));
  });

  links.forEach((link) => {
    link.addEventListener("click", () => {
      setExpanded(false);
    });
  });

  // close the menu if the user clicks outside it
  document.addEventListener("click", (event) => {
    if (!nav.contains(event.target) && !toggle.contains(event.target)) {
      setExpanded(false);
    }
  });
}

function initTyping() {
  const root = document.querySelector(".typing");
  if (!root) return;

  const words = JSON.parse(root.getAttribute("data-words") || "[]");
  if (!words.length) return;

  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const speed = 100;
  const pause = 1600;

  const update = () => {
    const word = words[wordIndex];
    const current = word.slice(0, charIndex);
    root.textContent = current;

    if (!isDeleting && charIndex < word.length) {
      charIndex += 1;
      setTimeout(update, speed);
      return;
    }

    if (isDeleting && charIndex > 0) {
      charIndex -= 1;
      setTimeout(update, speed / 1.5);
      return;
    }

    if (!isDeleting) {
      isDeleting = true;
      setTimeout(update, pause);
      return;
    }

    isDeleting = false;
    wordIndex = (wordIndex + 1) % words.length;
    setTimeout(update, 500);
  };

  update();
}

function observeReveal() {
  const revealElements = document.querySelectorAll(".reveal");
  if (!revealElements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealElements.forEach((el) => observer.observe(el));
}

function setupScrollTop() {
  const btn = document.getElementById("scrollTop");
  if (!btn) return;

  const toggleVisibility = () => {
    const shouldShow = window.scrollY > 480;
    btn.classList.toggle("show", shouldShow);
  };

  window.addEventListener("scroll", toggleVisibility, { passive: true });
  btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  toggleVisibility();
}

function updateActiveLink() {
  const sections = document.querySelectorAll("section[id]");
  const links = document.querySelectorAll(".nav__link");

  const getCurrentSection = () => {
    const scrollY = window.pageYOffset;
    let currentId = "home";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 120;
      if (scrollY >= sectionTop) {
        currentId = section.id;
      }
    });

    links.forEach((link) => {
      link.classList.toggle(
        "active",
        link.getAttribute("href") === `#${currentId}`
      );
    });
  };

  window.addEventListener("scroll", getCurrentSection, { passive: true });
  getCurrentSection();
}

function setupContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  const status = form.querySelector(".form-status");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = form.querySelector("#name").value.trim();
    const email = form.querySelector("#email").value.trim();
    const message = form.querySelector("#message").value.trim();

    if (!name || !email || !message) {
      status.textContent = "Please fill in all fields.";
      return;
    }

    status.textContent = "Sending message...";

    setTimeout(() => {
      status.textContent = "Message sent! I’ll get back to you soon.";
      form.reset();
    }, 700);
  });
}

function setCopyrightYear() {
  const el = document.getElementById("year");
  if (!el) return;
  el.textContent = new Date().getFullYear();
}

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  setupNav();
  initTyping();
  observeReveal();
  setupScrollTop();
  updateActiveLink();
  setupContactForm();
  setCopyrightYear();

  document.getElementById("modeToggle")?.addEventListener("click", () => {
    toggleDarkMode();
  });
});
