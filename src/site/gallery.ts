import { swiper } from "./vendors";
import { onReady } from "./dom";

// Migrated from Page HTML/Gallery/Gallery-Footer.html; Webflow's existing vendor globals remain external.
export function initGallery(): void {
  const Swiper = swiper();
  onReady(() => {
    // Swiper
    new Swiper("#sessions-swiper", {
      a11y: {
        slideRole: "listitem",
      },
      spaceBetween: 0,
      slidesPerView: 3,
      slidesPerGroup: 3,
      preloadImages: false,
      pagination: {
        el: "#sessions-pagination",
        clickable: true,
      },
      navigation: {
        nextEl: "#sessions-next",
        prevEl: "#sessions-prev",
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

    new Swiper("#meetings-swiper", {
      a11y: {
        slideRole: "listitem",
      },
      spaceBetween: 0,
      slidesPerView: 3,
      slidesPerGroup: 3,
      preloadImages: false,
      pagination: {
        el: "#meetings-pagination",
        clickable: true,
      },
      navigation: {
        nextEl: "#meetings-next",
        prevEl: "#meetings-prev",
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

    new Swiper("#thinktanks-swiper", {
      a11y: {
        slideRole: "listitem",
      },
      spaceBetween: 0,
      slidesPerView: 3,
      slidesPerGroup: 3,
      preloadImages: false,
      pagination: {
        el: "#thinktanks-pagination",
        clickable: true,
      },
      navigation: {
        nextEl: "#thinktanks-next",
        prevEl: "#thinktanks-prev",
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

    new Swiper("#networking-swiper", {
      a11y: {
        slideRole: "listitem",
      },
      spaceBetween: 0,
      slidesPerView: 3,
      slidesPerGroup: 3,
      preloadImages: false,
      pagination: {
        el: "#networking-pagination",
        clickable: true,
      },
      navigation: {
        nextEl: "#networking-next",
        prevEl: "#networking-prev",
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
  });
}
