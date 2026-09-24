import { onReady } from "./dom";
import { swiper } from "./vendors";
import { initCategoryForms } from "./forms";

export function initRecap(): void {
  onReady(() => {
    const Swiper = swiper();
    initCategoryForms({ speakAsSpeaker: false });
    new Swiper("#recap-swiper", {
      a11y: {
        slideRole: "listitem",
      },
      preloadImages: false,
      spaceBetween: 0,
      pagination: {
        el: "#recap-pagination",
        clickable: true,
      },
      navigation: {
        nextEl: "#recap-next",
        prevEl: "#recap-prev",
      },
    });

    new Swiper("#events-swiper", {
      a11y: {
        slideRole: "listitem",
      },
      enabled: false,
      spaceBetween: 0,
      slidesPerView: 3,
      slidesPerGroup: 3,
      preloadImages: false,
      pagination: {
        el: "#events-pagination",
        clickable: true,
      },
      navigation: {
        nextEl: "#events-next",
        prevEl: "#events-prev",
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

    new Swiper("#testimonials-swiper", {
      a11y: {
        slideRole: "listitem",
      },
      enabled: false,
      spaceBetween: 0,
      slidesPerView: 1,
      slidesPerGroup: 1,
      preloadImages: false,
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
          slidesPerView: 1,
          slidesPerGroup: 1,
          spaceBetween: 0,
          enabled: false,
        },
      },
    });
  });
}
