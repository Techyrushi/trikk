// Load shared header and footer into each page and initialise interactions/sliders
document.addEventListener("DOMContentLoaded", () => {
  loadFragment("site-header", "assets/header.html", () => {
    initHeaderInteractions();
  });

  loadFragment("site-footer", "assets/footer.html");

  // Sliders & banner
  initBannerSlider();
  initSectionSliders();
});

function loadFragment(targetId, url, callback) {
  const container = document.getElementById(targetId);
  if (!container) return;

  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to load: " + url);
      }
      return response.text();
    })
    .then((html) => {
      container.innerHTML = html;
      if (typeof callback === "function") {
        callback();
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

// Mobile header interactions (hamburger menu + category dropdowns)
function initHeaderInteractions() {
  const header = document.querySelector(".header");
  if (!header) return;

  const toggle = header.querySelector(".mobile-menu-toggle");
  const nav = header.querySelector(".nav");

  if (toggle && nav) {
    toggle.addEventListener("click", (event) => {
      event.stopPropagation();
      header.classList.toggle("open");
    });
  }

  initNavDropdowns(header);

  // Close any open menus when clicking outside header
  document.addEventListener("click", (event) => {
    if (!header.contains(event.target)) {
      header.classList.remove("open");
      header
        .querySelectorAll(".nav-item.open")
        .forEach((item) => item.classList.remove("open"));
    }
  });
}

// Sample subcategories for each main nav category
const NAV_CATEGORIES = {
  WATCHES: ["Men's Watches", "Women's Watches", "Smart Watches", "Limited Edition"],
  SUNGLASSES: ["Men's Sunglasses", "Women's Sunglasses", "Sport", "Premium"],
  SHOES: ["Casual Shoes", "Formal Shoes", "Sneakers"],
  ELECTRONICS: ["Smartwatches", "Headphones", "Speakers"],
  WOODEN: ["Wooden Watches", "Wooden Clocks", "Desk Décor"],
  ACCESSORIES: ["Belts", "Wallets", "Bracelets"],
};

function initNavDropdowns(header) {
  const navItems = header.querySelectorAll(".nav-item span");

  navItems.forEach((labelSpan) => {
    const label = labelSpan.textContent.trim();
    const subcategories = NAV_CATEGORIES[label];

    if (!subcategories || !subcategories.length) return;

    const navItem = labelSpan.parentElement;
    if (!navItem) return;

    // Create dropdown container
    const dropdown = document.createElement("div");
    dropdown.className = "nav-dropdown";

    subcategories.forEach((sub) => {
      const link = document.createElement("a");
      link.href = "#";
      link.textContent = sub;
      dropdown.appendChild(link);
    });

    navItem.appendChild(dropdown);

    navItem.addEventListener("click", (event) => {
      event.stopPropagation();

      // Toggle this item's dropdown, close others
      const isOpen = navItem.classList.contains("open");
      header
        .querySelectorAll(".nav-item.open")
        .forEach((item) => item.classList.remove("open"));

      if (!isOpen) {
        navItem.classList.add("open");
      }
    });
  });
}

// Banner slider (auto-rotating hero)
function initBannerSlider() {
  const banner = document.querySelector(".banner");
  if (!banner) return;

  const imagePanel = banner.querySelector(".IMG");
  const dots = banner.querySelectorAll(".banner-dot");

  if (!imagePanel || !dots.length) return;

  const slides = [
    "https://c.animaapp.com/mi8igq1hn2mvbH/img/es-8059-05-q-1.png",
    "https://c.animaapp.com/mi8igq1hn2mvbH/img/mask-group-11.png",
    "https://c.animaapp.com/mi8igq1hn2mvbH/img/mask-group-2.png",
    "https://c.animaapp.com/mi8igq1hn2mvbH/img/mask-group-3.png",
  ];

  let current = 0;

  function applySlide(index) {
    const image = slides[index];
    if (!image) return;

    imagePanel.style.transition = "background-image 0.6s ease-out";
    imagePanel.style.backgroundImage = `url(${image})`;

    dots.forEach((dot, i) => {
      if (i === index) {
        dot.classList.add("active");
      } else {
        dot.classList.remove("active");
      }
    });
  }

  applySlide(current);

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      current = index;
      applySlide(current);
    });
  });

  setInterval(() => {
    current = (current + 1) % slides.length;
    applySlide(current);
  }, 6000);
}

// Section sliders for product/category rows on smaller screens
function initSectionSliders() {
  // Only activate sliders on tablet/mobile where horizontal space is limited
  if (window.innerWidth > 1024) return;

  // Top Picks section
  initHorizontalSlider({
    sectionSelector: ".pick-for-you",
    itemSelector: '[class^="product-box"]',
  });

  // Best Sellers section
  initHorizontalSlider({
    sectionSelector: ".best-sellers",
    itemSelector: '[class^="product-box-"]',
  });

  // Explore by Category section – reuse existing group-15 as track
  initHorizontalSlider({
    sectionSelector: ".category",
    itemSelector: ".group-15 > div",
    trackSelector: ".group-15",
  });
}

function initHorizontalSlider(config) {
  const section = document.querySelector(config.sectionSelector);
  if (!section) return;

  const existingTrack = config.trackSelector
    ? section.querySelector(config.trackSelector)
    : null;

  const items = Array.from(
    (existingTrack || section).querySelectorAll(config.itemSelector)
  );

  if (!items.length) return;

  let track;

  if (existingTrack) {
    track = existingTrack;
  } else {
    track = document.createElement("div");
    track.className = "slider-track";

    items.forEach((item) => {
      track.appendChild(item);
    });

    section.appendChild(track);
  }

  let index = 0;

  function goTo(nextIndex) {
    index = (nextIndex + items.length) % items.length;
    const offset = -index * 100;
    track.style.transform = `translateX(${offset}%)`;
  }

  // Initial position
  goTo(0);

  // Auto-advance
  setInterval(() => {
    goTo(index + 1);
  }, 5000);
}

