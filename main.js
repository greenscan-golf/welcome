/* ============================================================
   HERO CAROUSEL
============================================================ */

// Configuration des images du carrousel
// Ajouter ou modifier les images ici : ['chemin/image1.jpg', 'chemin/image2.jpg', ...]
const HERO_CAROUSEL_CONFIG = {
  images: [
    "assets/images/hero3.jpg",
    // "assets/images/hero6.jpg",
  ],
  intervalSeconds: 7, // Délai entre les changements d'image (en secondes)
};

class HeroCarousel {
  constructor(config) {
    this.config = config;
    this.currentIndex = 0;
    this.isTransitioning = false;
    this.autoplayInterval = null;
    this.loadedImages = new Set([0]); // L'image actuelle est chargée au démarrage

    // Éléments DOM
    this.carousel = document.getElementById("hero-carousel");
    this.track = document.querySelector(".hero-carousel-track");

    if (!this.carousel || !this.track || this.config.images.length < 1) {
      // Ne pas initialiser s'il n'y a pas d'images
      return;
    }

    this.init();
  }

  init() {
    // Créer les slides
    this.createSlides();
    // Précharger l'image suivante
    this.preloadNextImage();
    // Démarrer le carrousel automatique
    this.startAutoplay();
  }

  createSlides() {
    this.config.images.forEach((imageSrc, index) => {
      const slide = document.createElement("div");
      slide.className = "hero-slide";
      if (index === 0) slide.classList.add("active");
      slide.style.backgroundImage = `url("${imageSrc}")`;
      this.track.appendChild(slide);
    });
  }

  preloadNextImage() {
    const nextIndex = (this.currentIndex + 1) % this.config.images.length;
    const imageSrc = this.config.images[nextIndex];

    // Vérifier si l'image est déjà chargée
    if (this.loadedImages.has(nextIndex)) {
      return;
    }

    // Créer une image pour précharger
    const img = new Image();
    img.onload = () => {
      this.loadedImages.add(nextIndex);
    };
    img.src = imageSrc;
  }

  goToNext() {
    if (this.isTransitioning || this.config.images.length < 2) return;

    const nextIndex = (this.currentIndex + 1) % this.config.images.length;

    // Vérifier que l'image suivante est chargée
    if (!this.loadedImages.has(nextIndex)) {
      // Image pas encore chargée, réessayer plus tard
      setTimeout(() => this.goToNext(), 100);
      return;
    }

    this.isTransitioning = true;

    const slides = this.track.querySelectorAll(".hero-slide");
    slides[this.currentIndex].classList.remove("active");
    slides[nextIndex].classList.add("active");

    this.currentIndex = nextIndex;
    this.isTransitioning = false;

    // Précharger l'image suivante
    this.preloadNextImage();
  }

  startAutoplay() {
    if (this.config.images.length < 2) return;

    this.autoplayInterval = setInterval(() => {
      this.goToNext();
    }, this.config.intervalSeconds * 1000);

    // Arrêter le carrousel si l'utilisateur quitte la page
    window.addEventListener("beforeunload", () => {
      this.stopAutoplay();
    });
  }

  stopAutoplay() {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
      this.autoplayInterval = null;
    }
  }
}

// Initialiser le carrousel
let heroCarousel;
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    heroCarousel = new HeroCarousel(HERO_CAROUSEL_CONFIG);
  });
} else {
  heroCarousel = new HeroCarousel(HERO_CAROUSEL_CONFIG);
}

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
      a.classList.toggle("active", a.getAttribute("href") === `#${current}`);
    });
  },
  { passive: true },
);

/* ---- Scroll reveal avec performance optimisée ---- */
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("in");
        // Déconnecte l'observer pour cet élément pour économiser les ressources
        io.unobserve(e.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
);

// Performance améliorée : observe en batch
const observeElements = () => {
  const reveals = document.querySelectorAll(".reveal");
  const fragment = document.createDocumentFragment();

  reveals.forEach((el) => {
    if (!el.classList.contains("in")) {
      io.observe(el);
    }
  });
};

// Lance l'observation quand le DOM est prêt
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", observeElements);
} else {
  observeElements();
}

/* ---- Image Gallery Lightbox ---- */
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const lightboxCaption = document.getElementById("lightbox-caption");
const lightboxClose = document.querySelector(".lightbox-close");
const lightboxPrev = document.querySelector(".lightbox-prev");
const lightboxNext = document.querySelector(".lightbox-next");
const imgCells = document.querySelectorAll(".img-cell");

let currentImageIndex = 0;
const allImages = [];

// Collect all images from img-cells
imgCells.forEach((cell, index) => {
  const img = cell.querySelector("img");
  const overlay = cell.querySelector(".img-overlay");
  if (img) {
    allImages.push({
      src: img.src,
      alt: img.alt || "Image agrandie",
      caption: overlay ? overlay.textContent : "",
    });
  }
});

// Open lightbox
imgCells.forEach((cell, index) => {
  cell.addEventListener("click", () => {
    currentImageIndex = index;
    showImage(currentImageIndex);
    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
  });
});

// Show image
const showImage = (index) => {
  if (allImages.length === 0) return;
  currentImageIndex = (index + allImages.length) % allImages.length;
  const image = allImages[currentImageIndex];
  lightboxImg.src = image.src;
  lightboxImg.alt = image.alt;
  lightboxCaption.textContent = image.caption;
};

// Navigation functions
const goToPrevious = () => {
  showImage(currentImageIndex - 1);
};

const goToNext = () => {
  showImage(currentImageIndex + 1);
};

// Close lightbox
const closeLightbox = () => {
  lightbox.classList.remove("open");
  document.body.style.overflow = "";
};

lightboxClose.addEventListener("click", closeLightbox);
lightboxPrev.addEventListener("click", (e) => {
  e.stopPropagation();
  goToPrevious();
});
lightboxNext.addEventListener("click", (e) => {
  e.stopPropagation();
  goToNext();
});

// Close on click outside (on overlay or content background)
lightbox.addEventListener("click", (e) => {
  if (
    e.target === lightbox ||
    e.target === lightbox.querySelector(".lightbox-overlay")
  ) {
    closeLightbox();
  }
});

// Close on Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && lightbox.classList.contains("open")) {
    closeLightbox();
  }
  if (lightbox.classList.contains("open")) {
    if (e.key === "ArrowLeft") goToPrevious();
    if (e.key === "ArrowRight") goToNext();
  }
});

/* ---- Commander Modal ---- */
const commanderBtn = document.getElementById("commander-btn");
const commanderModal = document.getElementById("commander-modal");
const commanderClose = document.querySelector(".commander-close");
const commanderContact = document.querySelector(".commander-contact");

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

// Fermer la modal après clic sur contact (optionnel, peut rester ouvert)
commanderContact.addEventListener("click", () => {
  // Petit délai pour laisser le temps à mailto de s'ouvrir
  setTimeout(closeCommanderModal, 300);
});

commanderModal.addEventListener("click", (e) => {
  if (
    e.target === commanderModal ||
    e.target === document.querySelector(".commander-overlay")
  ) {
    closeCommanderModal();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && commanderModal.classList.contains("open")) {
    closeCommanderModal();
  }
});
