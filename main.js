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

/* ---- Image Gallery Lightbox ---- */
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const lightboxCaption = document.getElementById("lightbox-caption");
const lightboxClose = document.querySelector(".lightbox-close");
const imgCells = document.querySelectorAll(".img-cell");

// Open lightbox
imgCells.forEach((cell) => {
  cell.addEventListener("click", () => {
    const img = cell.querySelector("img");
    const overlay = cell.querySelector(".img-overlay");
    
    if (img) {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt || "Image agrandie";
      lightboxCaption.textContent = overlay ? overlay.textContent : "";
      lightbox.classList.add("open");
      document.body.style.overflow = "hidden";
    }
  });
});

// Close lightbox
const closeLightbox = () => {
  lightbox.classList.remove("open");
  document.body.style.overflow = "";
};

lightboxClose.addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox || e.target === lightbox.querySelector(".lightbox-overlay")) {
    closeLightbox();
  }
});

// Close on Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && lightbox.classList.contains("open")) {
    closeLightbox();
  }
});

/* ---- Commander Modal ---- */
const commanderBtn = document.getElementById("commander-btn");
const commanderModal = document.getElementById("commander-modal");
const commanderClose = document.querySelector(".commander-close");
const commanderOk = document.querySelector(".commander-ok");

const openCommanderModal = () => {
  commanderModal.classList.add("open");
  document.body.style.overflow = "hidden";
};

const closeCommanderModal = () => {
  commanderModal.classList.remove("open");
  document.body.style.overflow = "";
};

commanderBtn.addEventListener("click", openCommanderModal);
commanderClose.addEventListener("click", closeCommanderModal);
commanderOk.addEventListener("click", closeCommanderModal);

commanderModal.addEventListener("click", (e) => {
  if (e.target === commanderModal || e.target === document.querySelector(".commander-overlay")) {
    closeCommanderModal();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && commanderModal.classList.contains("open")) {
    closeCommanderModal();
  }
});
