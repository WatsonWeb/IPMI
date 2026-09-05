import { initStatistics } from "./statistics";
import { swiper } from "./vendors";
import { onReady } from "./dom";

// Migrated from Page HTML/Home/Home-Footer.html; Webflow's existing vendor globals remain external.
export function initHome(): void {
  const Swiper = swiper();
  onReady(() => {
    // Swiper
    new Swiper("#features-swiper", {
      a11y: {
        slideRole: "listitem",
      },
      spaceBetween: 0,
      slidesPerView: 3,
      slidesPerGroup: 3,
      preloadImages: false,
      pagination: {
        el: "#features-pagination",
        clickable: true,
      },
      navigation: {
        nextEl: "#features-next",
        prevEl: "#features-prev",
      },
      breakpoints: {
        // Mobile
        1: {
          slidesPerView: 1,
          slidesPerGroup: 1,
          enabled: true,
          spaceBetween: 20,
        },

        // Tablet
        768: {
          slidesPerView: 2,
          slidesPerGroup: 2,
          enabled: true,
          spaceBetween: 0,
        },
        // Desktop
        992: {
          slidesPerView: 3,
          slidesPerGroup: 3,
          spaceBetween: 0,
          enabled: false,
        },
      },
    });

    new Swiper("#institutes-mobile-swiper", {
      a11y: {
        slideRole: "listitem",
      },
      spaceBetween: 30,
      preloadImages: false,
      pagination: {
        el: "#institutes-mobile-pagination",
        clickable: true,
      },
      navigation: {
        nextEl: "#institutes-mobile-next",
        prevEl: "#institutes-mobile-prev",
      },
    });

    new Swiper("#institutes-desktop-swiper", {
      a11y: {
        slideRole: "listitem",
      },
      spaceBetween: 0,
      slidesPerView: 3,
      slidesPerGroup: 3,
      preloadImages: false,
      pagination: {
        el: "#institutes-desktop-pagination",
        clickable: true,
      },
      navigation: {
        nextEl: "#institutes-desktop-next",
        prevEl: "#institutes-desktop-prev",
      },
      breakpoints: {
        // Mobile
        1: {
          slidesPerView: 1,
          slidesPerGroup: 1,
          enabled: true,
          spaceBetween: 20,
        },

        // Tablet
        768: {
          slidesPerView: 2,
          slidesPerGroup: 2,
          enabled: true,
          spaceBetween: 0,
        },
        // Desktop
        992: {
          slidesPerView: 3,
          slidesPerGroup: 3,
          spaceBetween: 0,
          enabled: false,
        },
      },
    });

    new Swiper("#recaps-swiper", {
      a11y: {
        slideRole: "listitem",
      },
      spaceBetween: 0,
      slidesPerView: 4,
      slidesPerGroup: 4,
      preloadImages: false,
      pagination: {
        el: "#recaps-pagination",
        clickable: true,
      },
      navigation: {
        nextEl: "#recaps-next",
        prevEl: "#recaps-prev",
      },
      breakpoints: {
        // Mobile
        1: {
          slidesPerView: 1,
          slidesPerGroup: 1,
          enabled: true,
          spaceBetween: 20,
        },

        // Tablet
        768: {
          slidesPerView: 2,
          slidesPerGroup: 2,
          enabled: true,
          spaceBetween: 0,
        },
        // Desktop
        992: {
          slidesPerView: 4,
          slidesPerGroup: 4,
          spaceBetween: 0,
          enabled: false,
        },
      },
    });

    new Swiper("#testimonials-swiper", {
      a11y: {
        slideRole: "listitem",
      },
      spaceBetween: 0,
      slidesPerView: 3,
      slidesPerGroup: 3,
      preloadImages: false,
      grabCursor: true,
      pagination: {
        el: "#testimonials-pagination",
        clickable: true,
      },
      navigation: {
        nextEl: "#testimonials-next",
        prevEl: "#testimonials-prev",
      },
      breakpoints: {
        // Mobile
        1: {
          slidesPerView: 1,
          slidesPerGroup: 1,
          spaceBetween: 20,
        },

        // Tablet
        768: {
          slidesPerView: 2,
          slidesPerGroup: 2,
          spaceBetween: 0,
        },
        // Desktop
        992: {
          slidesPerView: 3,
          slidesPerGroup: 3,
          spaceBetween: 0,
        },
      },
    });
    new Swiper("#attend-swiper", {
      a11y: {
        slideRole: "listitem",
      },
      spaceBetween: 0,
      slidesPerView: 3,
      slidesPerGroup: 3,
      preloadImages: false,
      pagination: {
        el: "#attend-pagination",
        clickable: true,
      },
      navigation: {
        nextEl: "#attend-next",
        prevEl: "#attend-prev",
      },
      breakpoints: {
        // Mobile
        1: {
          slidesPerView: 1,
          slidesPerGroup: 1,
          enabled: true,
          spaceBetween: 20,
        },

        // Tablet
        768: {
          slidesPerView: 2,
          slidesPerGroup: 2,
          enabled: true,
          spaceBetween: 0,
        },
        // Desktop
        992: {
          slidesPerView: 3,
          slidesPerGroup: 3,
          spaceBetween: 0,
          enabled: false,
        },
      },
    });

    initStatistics({ colorCircle: "#52525B", threshold: 0.75, minimumRatio: 0.5 });
  });
}
