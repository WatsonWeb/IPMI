import { swiper } from "./vendors";

// Migrated from Page HTML/Virtual Think Tanks/VirtualThinkTanks-Footer.html; Webflow's existing vendor globals remain external.
export function initVttList(): void {
  const Swiper = swiper();
  // Swiper
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
}
