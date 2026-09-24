import { onReady } from "./dom";
import { swiper } from "./vendors";
import { initSpeakerModal } from "./speaker-modal";
import { initFieldFocus, decorateActiveCampaignFields } from "./forms";

export function initVtt(): void {
  onReady(() => {
    const Swiper = swiper();
    initSpeakerModal();
    initFieldFocus(document, "._form_element input", "._form_element");
    decorateActiveCampaignFields();
    new Swiper("#testimonials-swiper", {
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

    new Swiper("#events-swiper", {
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
  });
}
