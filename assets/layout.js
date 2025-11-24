// Load shared header and footer into each page and initialise interactions/sliders
document.addEventListener("DOMContentLoaded", () => {
  loadFragment("site-header", "assets/header.html", () => {
    initHeaderInteractions();
  });

  loadFragment("site-footer", "assets/footer.html");

  // Sliders & banner
  initBannerSlider();
  initCelebrationBanner();
  initCategoryAutoSlide({
    sliderSelector: ".category-slider",
    trackSelector: ".group-15",
    itemSelector: ":scope > div",
    slideInterval: 3000, // 3 seconds per slide
  });
  initLoopingSlider({
    sliderSelector: ".top-picks-slider",
    trackSelector: ".top-picks-track",
    itemSelector: ":scope > [class^='product-box']",
    speed: 0.4,
  });
  initLoopingSlider({
    sliderSelector: ".best-sellers-slider",
    trackSelector: ".best-sellers-track",
    itemSelector: ":scope > [class^='product-box-']",
    speed: 0.4,
  });
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

function initCelebrationBanner() {
  const banner = document.querySelector(".celebration-banner");
  if (!banner) return;

  const imagePanel = banner.querySelector(".celebration-image");
  const dots = banner.querySelectorAll(".banner-dot");

  if (!imagePanel || !dots.length) return;

  const slides = [
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

function initLoopingSlider(config) {
  const slider = document.querySelector(config.sliderSelector);
  const track = slider ? slider.querySelector(config.trackSelector) : null;

  if (!slider || !track || slider.dataset.loopingSlider === "ready") return;

  const items = Array.from(
    track.querySelectorAll(config.itemSelector || ":scope > *")
  );

  if (items.length < 2) return;
  slider.dataset.loopingSlider = "ready";

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );
  if (prefersReducedMotion.matches) return;

  // Duplicate original cards once for seamless looping
  const clones = items.map((node) => node.cloneNode(true));
  clones.forEach((clone) => track.appendChild(clone));

  let baseWidth = 0;
  let position = 0;
  let isHovering = false;
  let lastPointerX = null;
  let manualVelocity = 0;
  const autoSpeed = config.speed ?? 0.35;
  const hoverAutoFactor = config.hoverAutoFactor ?? 0.25;
  const manualScale = config.dragFactor ?? 0.45;
  const manualFriction = config.dragFriction ?? 0.92;
  let itemWidth = 0;
  let gap = 36;

  function measureWidth() {
    const totalWidth = track.scrollWidth;
    baseWidth = totalWidth / 2;
    if (baseWidth === 0) {
      requestAnimationFrame(measureWidth);
    }
    // measure card width and gap for step navigation
    const items = Array.from(track.querySelectorAll(config.itemSelector || ":scope > *"));
    if (items.length >= 2) {
      const rect1 = items[0].getBoundingClientRect();
      const rect2 = items[1].getBoundingClientRect();
      itemWidth = rect1.width;
      gap = Math.max(0, rect2.left - rect1.right) || gap;
    } else if (items.length === 1) {
      const rect = items[0].getBoundingClientRect();
      itemWidth = rect.width;
    }
  }

  function normalizePosition() {
    if (!baseWidth) return;
    position %= baseWidth;
    if (position < 0) {
      position += baseWidth;
    }
  }

  function applyTransform() {
    track.style.transform = `translate3d(-${position}px, 0, 0)`;
  }

  function animate() {
    if (baseWidth) {
      const activeAuto =
        autoSpeed * (isHovering ? hoverAutoFactor : 1);
      position += activeAuto + manualVelocity;
      manualVelocity *= manualFriction;
      if (Math.abs(manualVelocity) < 0.01) {
        manualVelocity = 0;
      }
      normalizePosition();
      applyTransform();
    }
    requestAnimationFrame(animate);
  }

  function nudgeBy(delta) {
    if (!baseWidth) return;
    manualVelocity -= delta * manualScale;
  }

  function handlePointerMove(clientX) {
    if (!isHovering) return;
    if (lastPointerX !== null) {
      const delta = clientX - lastPointerX;
      nudgeBy(delta);
    }
    lastPointerX = clientX;
  }

  // slider.addEventListener("mouseenter", (event) => {
  //   isHovering = true;
  //   lastPointerX = event.clientX;
  // });

  // slider.addEventListener("mouseleave", () => {
  //   isHovering = false;
  //   lastPointerX = null;
  // });

  // slider.addEventListener("mousemove", (event) => {
  //   handlePointerMove(event.clientX);
  // });

  slider.addEventListener(
    "touchstart",
    (event) => {
      isHovering = true;
      lastPointerX = event.touches[0]?.clientX ?? null;
    },
    { passive: true }
  );

  slider.addEventListener(
    "touchmove",
    (event) => {
      const touchX = event.touches[0]?.clientX ?? null;
      if (touchX !== null) {
        handlePointerMove(touchX);
      }
    },
    { passive: true }
  );

  slider.addEventListener(
    "touchend",
    () => {
      isHovering = false;
      lastPointerX = null;
    },
    { passive: true }
  );

  window.addEventListener("resize", () => {
    measureWidth();
    normalizePosition();
    applyTransform();
  });

  measureWidth();
  applyTransform();
  animate();

  // Arrow controls (prev/next) inside slider's parent section
  const parent = slider.parentElement || document;
  const prevBtn = parent.querySelector(".slider-btn.prev");
  const nextBtn = parent.querySelector(".slider-btn.next");

  function step(deltaCards = 1) {
    const stepSize = (itemWidth || 280) + (gap || 36);
    position += deltaCards * stepSize;
    normalizePosition();
    manualVelocity = 0;
    applyTransform();
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => step(-1));
  }
  if (nextBtn) {
    nextBtn.addEventListener("click", () => step(1));
  }
}

// Category slider with auto-slide and smooth circular loop
function initCategoryAutoSlide(config) {
  const slider = document.querySelector(config.sliderSelector);
  const track = slider ? slider.querySelector(config.trackSelector) : null;

  if (!slider || !track || slider.dataset.autoSlide === "ready") return;

  const items = Array.from(
    track.querySelectorAll(config.itemSelector || ":scope > *")
  );

  if (items.length < 2) return;
  slider.dataset.autoSlide = "ready";

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );
  if (prefersReducedMotion.matches) return;

  // Clone items for seamless loop
  items.forEach((item) => {
    const clone = item.cloneNode(true);
    track.appendChild(clone);
  });

  let currentIndex = 0;
  let itemWidth = 0;
  let gap = 48; // Match CSS gap
  let isTransitioning = false;
  let autoSlideInterval = null;
  const slideInterval = config.slideInterval || 3000;

  function calculateItemWidth() {
    if (items.length === 0) return;
    const firstItem = items[0];
    const secondItem = items[1];
    
    if (firstItem && secondItem) {
      const firstRect = firstItem.getBoundingClientRect();
      const secondRect = secondItem.getBoundingClientRect();
      itemWidth = firstRect.width;
      gap = secondRect.left - firstRect.right;
    } else {
      const rect = firstItem.getBoundingClientRect();
      itemWidth = rect.width;
      // Try to get gap from computed style
      const computedGap = getComputedStyle(track).gap;
      gap = computedGap ? parseInt(computedGap) : 48;
    }
  }

  function getTotalOffset(index) {
    return index * (itemWidth + gap);
  }

  function slideToIndex(index, instant = false) {
    if (isTransitioning && !instant) return;
    
    isTransitioning = !instant;
    const offset = getTotalOffset(index);
    
    if (instant) {
      track.style.transition = "none";
    } else {
      track.style.transition = "transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)";
    }
    
    track.style.transform = `translate3d(-${offset}px, 0, 0)`;
    
    if (!instant) {
      setTimeout(() => {
        isTransitioning = false;
      }, 800);
    }
  }

  function nextSlide() {
    if (isTransitioning) return;
    
    currentIndex++;
    
    // When we reach the first clone (index = items.length), it looks identical to first original
    // Smoothly transition to it, creating seamless loop from last to first
    if (currentIndex === items.length) {
      // Smoothly show first clone (visually same as first original)
      slideToIndex(currentIndex, false);
      
      // After transition completes, invisibly reset to first original
      // This prepares for the next cycle without visible jump
      setTimeout(() => {
        if (currentIndex === items.length && !isTransitioning) {
          currentIndex = 0;
          slideToIndex(currentIndex, true);
        }
      }, 850);
    } else if (currentIndex > items.length) {
      // We've gone past clones, reset to corresponding original position
      currentIndex = currentIndex - items.length;
      slideToIndex(currentIndex, true);
    } else {
      // Normal forward progression through original items
      slideToIndex(currentIndex, false);
    }
  }

  function startAutoSlide() {
    if (autoSlideInterval) return;
    
    autoSlideInterval = setInterval(() => {
      nextSlide();
    }, slideInterval);
  }

  function stopAutoSlide() {
    if (autoSlideInterval) {
      clearInterval(autoSlideInterval);
      autoSlideInterval = null;
    }
  }

  // Pause on hover
  // slider.addEventListener("mouseenter", stopAutoSlide);
  // slider.addEventListener("mouseleave", startAutoSlide);

  // Pause on touch
  let touchStartTime = 0;
  slider.addEventListener("touchstart", () => {
    touchStartTime = Date.now();
    stopAutoSlide();
  }, { passive: true });

  slider.addEventListener("touchend", () => {
    const touchDuration = Date.now() - touchStartTime;
    if (touchDuration < 300) {
      // Quick tap - advance one slide
      nextSlide();
    }
    // Resume auto-slide after a delay
    setTimeout(startAutoSlide, slideInterval);
  }, { passive: true });

  // Initialize
  calculateItemWidth();
  slideToIndex(0, true);

  // Recalculate on resize
  window.addEventListener("resize", () => {
    calculateItemWidth();
    slideToIndex(currentIndex, true);
  });

  // Start auto-slide
  startAutoSlide();
}

