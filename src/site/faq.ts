import { onLoaded, onReady } from "./dom";
import { swiper } from "./vendors";

const initializedQuestions = new WeakSet<Element>();
const initializedHeaders = new WeakSet<Element>();
const initializedLinks = new WeakSet<Element>();

// Migrated from Page HTML/FAQ/FAQ-Footer.html; Webflow's existing vendor globals remain external.
export function initFaq(): void {
  const Swiper = swiper();
  onReady(() => {
    document.querySelectorAll(".faq-question").forEach((question) => {
      if (initializedQuestions.has(question)) return;
      const id = question.querySelector(".faq-id")?.id;
      if (!id) return;
      initializedQuestions.add(question);
      const elements = [
        [".gallery-wrapper", "swiper"],
        [".swiper-pagination", "pagination"],
        [".swiper-button-prev", "prev"],
        [".swiper-button-next", "next"],
      ] as const;
      for (const [selector, suffix] of elements) {
        question.querySelectorAll(selector).forEach((element) => {
          element.id = `${id}-${suffix}`;
        });
      }

      new Swiper("#" + id + "-swiper", {
        spaceBetween: 0,
        slidesPerView: 3,
        slidesPerGroup: 3,
        preloadImages: false,
        pagination: {
          el: "#" + id + "-pagination",
          clickable: true,
        },
        navigation: {
          nextEl: "#" + id + "-next",
          prevEl: "#" + id + "-prev",
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
  });

  onLoaded(() => {
    document.querySelectorAll(".faq-header").forEach((header) => {
      if (initializedHeaders.has(header)) return;
      initializedHeaders.add(header);
      header.addEventListener("click", () => {
        const open = header.getAttribute("aria-expanded") === "false";
        header.closest(".faq-question")?.classList.toggle("open", open);
        header.setAttribute("aria-expanded", String(open));
      });
    });

    // Get URL Hash
    function openFAQ(hash: string) {
      document.querySelectorAll(".faq-question").forEach((question) => {
        const id = question.querySelector(".faq-id")?.id;
        const header = question.querySelector<HTMLElement>(".faq-header");
        if (hash === id && header?.getAttribute("aria-expanded") === "false") {
          header.click();
        }
      });
    }

    openFAQ(window.location.hash.substring(1));

    document
      .querySelectorAll(".nav-dropdown-link, .footer-link, .mobile-dropdown-link")
      .forEach((link) => {
        if (initializedLinks.has(link)) return;
        initializedLinks.add(link);
        link.addEventListener("click", () => {
          const linkArr = (link.getAttribute("href") ?? "").split("#");
          if (linkArr.length === 2) openFAQ(linkArr[1]);
        });
      });
  });
}
