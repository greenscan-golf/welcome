/* ---- Mobile nav ---- */
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");

hamburger.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  hamburger.setAttribute("aria-expanded", open);
});

navLinks.querySelectorAll("a").forEach((a) => {
  a.addEventListener("click", () => navLinks.classList.remove("open"));
});

/* ---- Navbar scroll style ---- */
const navbar = document.getElementById("navbar");
window.addEventListener(
  "scroll",
  () => {
    navbar.classList.toggle("scrolled", window.scrollY > 40);
  },
  { passive: true },
);

/* ---- Active nav link on scroll ---- */
const sections = document.querySelectorAll("section[id]");
const allNavLinks = document.querySelectorAll(".nav-links a");

window.addEventListener(
  "scroll",
  () => {
    let current = "";
    sections.forEach((s) => {
      if (window.scrollY >= s.offsetTop - 100) current = s.id;
    });
    allNavLinks.forEach((a) => {
      a.classList.toggle(
        "active",
        a.getAttribute("href") === `#${current}`,
      );
    });
  },
  { passive: true },
);

/* ---- Scroll reveal ---- */
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) e.target.classList.add("in");
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
);

document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
