import { onReady } from "./dom";
import { initCategoryForms, populateUpcomingInstitutes } from "./forms";
import { swiper } from "./vendors";

export function initAttend(): void {
  onReady(() => {
    const Swiper = swiper();
    document.querySelectorAll<HTMLElement>(".attend-section").forEach((section) => {
      const id = section.id;
      if (!id) return;
      const selector = (suffix: string) => `#${CSS.escape(`${id}-${suffix}`)}`;
      const assignIds = (container: string, mode: string) => {
        section.querySelectorAll(container).forEach((slider) => {
          for (const [target, suffix] of [
            [".gallery-wrapper", "swiper"],
            [".swiper-pagination", "pagination"],
            [".swiper-button-prev", "prev"],
            [".swiper-button-next", "next"],
          ] as const) {
            slider.querySelectorAll(target).forEach((element) => {
              element.id = `${id}-${mode}-${suffix}`;
            });
          }
        });
      };
      assignIds(".attend-slider-wrap .gallery-slider", "desktop");
      assignIds(".attend-mobile-slider-wrap .attend-mobile-slider", "mobile");
      new Swiper(selector("desktop-swiper"), {
        a11y: {
          slideRole: "listitem",
        },
        spaceBetween: 0,
        slidesPerView: 1,
        slidesPerGroup: 1,
        preloadImages: false,
        pagination: {
          el: selector("desktop-pagination"),
          clickable: true,
        },
        navigation: {
          nextEl: selector("desktop-next"),
          prevEl: selector("desktop-prev"),
        },
      });

      new Swiper(selector("mobile-swiper"), {
        a11y: {
          slideRole: "listitem",
        },
        spaceBetween: 0,
        slidesPerView: 2,
        slidesPerGroup: 2,
        preloadImages: false,
        pagination: {
          el: selector("mobile-pagination"),
          clickable: true,
        },
        navigation: {
          nextEl: selector("mobile-next"),
          prevEl: selector("mobile-prev"),
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
        },
      });
    });
    populateUpcomingInstitutes();
    initCategoryForms({ speakAsSpeaker: true });
    for (const category of ["attend", "speak", "partner"]) {
      document.getElementById(`${category}-button`)?.addEventListener("click", () => {
        document
          .querySelectorAll<HTMLElement>(`.${category}-category`)
          .forEach((link) => link.click());
      });
    }
  });
}
