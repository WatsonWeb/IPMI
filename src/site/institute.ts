import { onReady } from "./dom";
import { swiper } from "./vendors";
import { initSpeakerModal } from "./speaker-modal";
import { initCategoryForms } from "./forms";

export function initInstitute(): void {
  onReady(() => {
    const Swiper = swiper();
    initSpeakerModal();
    initCategoryForms({ speakAsSpeaker: true });
    new Swiper("#advisors-swiper", {
      a11y: {
        slideRole: "listitem",
      },
      preloadImages: false,
      simulateTouch: false,
      pagination: {
        el: "#advisors-pagination",
        clickable: true,
      },
      navigation: {
        nextEl: "#advisors-next",
        prevEl: "#advisors-prev",
      },
      breakpoints: {
        // Mobile Landscape
        480: {
          slidesPerView: 2,
          slidesPerGroup: 2,
        },
        // Tablet
        768: {
          slidesPerView: 3,
          slidesPerGroup: 3,
        },
        // Desktop
        992: {
          slidesPerView: 4,
          slidesPerGroup: 4,
        },
      },
    });

    new Swiper("#speakers-swiper", {
      a11y: {
        slideRole: "listitem",
      },
      preloadImages: false,
      simulateTouch: false,
      pagination: {
        el: "#speakers-pagination",
        clickable: true,
      },
      navigation: {
        nextEl: "#speakers-next",
        prevEl: "#speakers-prev",
      },
      grid: {
        fill: "row",
        rows: 2,
      },
      breakpoints: {
        // Mobile Portrait
        374: {
          slidesPerView: 2,
          slidesPerGroup: 2,
        },
        // Tablet
        768: {
          slidesPerView: 3,
          slidesPerGroup: 3,
        },
        // Desktop
        992: {
          slidesPerView: 4,
          slidesPerGroup: 4,
        },
        // Desktop MD
        1280: {
          slidesPerView: 5,
          slidesPerGroup: 5,
        },
      },
    });

    new Swiper("#legacy-advisors-swiper", {
      a11y: {
        slideRole: "listitem",
      },
      preloadImages: false,
      simulateTouch: false,
      pagination: {
        el: "#legacy-advisors-pagination",
        clickable: true,
      },
      navigation: {
        nextEl: "#legacy-advisors-next",
        prevEl: "#legacy-advisors-prev",
      },
      breakpoints: {
        // Mobile Landscape
        480: {
          slidesPerView: 2,
          slidesPerGroup: 2,
        },
        // Tablet
        768: {
          slidesPerView: 3,
          slidesPerGroup: 3,
        },
        // Desktop
        992: {
          slidesPerView: 4,
          slidesPerGroup: 4,
        },
      },
    });

    new Swiper("#legacy-speakers-swiper", {
      a11y: {
        slideRole: "listitem",
      },
      preloadImages: false,
      simulateTouch: false,
      pagination: {
        el: "#legacy-speakers-pagination",
        clickable: true,
      },
      navigation: {
        nextEl: "#legacy-speakers-next",
        prevEl: "#legacy-speakers-prev",
      },
      grid: {
        fill: "row",
        rows: 2,
      },
      breakpoints: {
        // Mobile Portrait
        374: {
          slidesPerView: 2,
          slidesPerGroup: 2,
        },
        // Tablet
        768: {
          slidesPerView: 3,
          slidesPerGroup: 3,
        },
        // Desktop
        992: {
          slidesPerView: 4,
          slidesPerGroup: 4,
        },
        // Desktop MD
        1280: {
          slidesPerView: 5,
          slidesPerGroup: 5,
        },
      },
    });

    new Swiper("#partners-swiper-new", {
      a11y: {
        slideRole: "listitem",
      },
      preloadImages: false,
      simulateTouch: false,
      pagination: {
        el: "#partners-pagination",
        clickable: true,
      },
      navigation: {
        nextEl: "#partners-next",
        prevEl: "#partners-prev",
      },
      grid: {
        fill: "row",
        rows: 2,
      },
      breakpoints: {
        // Mobile Portrait
        374: {
          slidesPerView: 2,
          slidesPerGroup: 2,
        },
        // Tablet
        768: {
          slidesPerView: 3,
          slidesPerGroup: 3,
        },
        // Desktop
        992: {
          slidesPerView: 4,
          slidesPerGroup: 4,
        },
        // Desktop MD
        1280: {
          slidesPerView: 5,
          slidesPerGroup: 5,
        },
      },
    });

    new Swiper("#partners-swiper", {
      a11y: {
        slideRole: "listitem",
      },
      preloadImages: false,
      simulateTouch: false,
      pagination: {
        el: "#partners-pagination",
        clickable: true,
      },
      navigation: {
        nextEl: "#partners-next",
        prevEl: "#partners-prev",
      },
      grid: {
        fill: "row",
        rows: 2,
      },
      breakpoints: {
        // Mobile Portrait
        374: {
          slidesPerView: 2,
          slidesPerGroup: 2,
        },
        // Tablet
        768: {
          slidesPerView: 3,
          slidesPerGroup: 3,
        },
        // Desktop
        992: {
          slidesPerView: 4,
          slidesPerGroup: 4,
        },
        // Desktop MD
        1280: {
          slidesPerView: 5,
          slidesPerGroup: 5,
        },
      },
    });
  });
}
