import { onReady } from "./dom";
import { profileModal } from "./profile-modal";
import { initStatistics } from "./statistics";
import { swiper } from "./vendors";

const initializedAdvisors = new WeakSet<Element>();

/** Keep the trusted CMS profile fragment inert, matching .load's selector behavior. */
function profileFragments(html: string): Element[] {
  const parsed = new DOMParser().parseFromString(html, "text/html");
  parsed
    .querySelectorAll("script, iframe, object, embed, base, meta[http-equiv], link[rel=import]")
    .forEach((element) => element.remove());
  parsed.querySelectorAll("*").forEach((element) => {
    for (const attribute of Array.from(element.attributes)) {
      const name = attribute.name.toLowerCase();
      const value = Array.from(attribute.value)
        .filter((character) => character.charCodeAt(0) > 32)
        .join("")
        .toLowerCase();
      if (
        name.startsWith("on") ||
        name === "srcdoc" ||
        (["href", "src", "xlink:href", "action", "formaction", "poster"].includes(name) &&
          /^(?:javascript|vbscript|data):/.test(value))
      ) {
        element.removeAttribute(attribute.name);
      }
    }
  });
  return Array.from(parsed.querySelectorAll(".bio-columns"));
}

// Migrated from Page HTML/About Us/About-Footer.html; Webflow's existing vendor globals remain external.
export function initAbout(): void {
  const Swiper = swiper();
  onReady(() => {
    // Profile Modal
    const modal = document.querySelector<HTMLElement>("#profile-modal");
    const container = document.querySelector("#modal-container");
    if (modal && container) {
      const lifecycle = profileModal(modal);
      document.querySelectorAll(".advisors a").forEach((link) => {
        if (initializedAdvisors.has(link)) return;
        initializedAdvisors.add(link);
        link.addEventListener("click", (event) => {
          event.preventDefault();
          const href = link.getAttribute("href");
          if (!href) return;
          const item = link.closest(".w-dyn-item");
          const request = lifecycle.begin(Array.from(item?.querySelectorAll(".loading") ?? []));
          void (async () => {
            try {
              const url = new URL(href, document.baseURI);
              if (!/^https?:$/.test(url.protocol)) throw new Error("Invalid profile URL");
              const response = await fetch(url.href, {
                signal: request.signal,
                credentials: "same-origin",
              });
              if (!response.ok) throw new Error(`Advisor response failed: HTTP ${response.status}`);
              const html = await response.text();
              if (!request.isCurrent()) return;
              const fragments = profileFragments(html);
              if (fragments.length === 0) throw new Error("Advisor profile fragment is missing");
              container.replaceChildren(
                ...fragments.map((fragment) => document.importNode(fragment, true)),
              );
              modal.classList.add("open");
            } catch {
              if (request.isCurrent()) console.error("Error loading Advisor Bio");
            } finally {
              request.finish();
            }
          })();
        });
      });
    }

    // Swiper
    new Swiper("#about-swiper", {
      preloadImages: false,
      spaceBetween: 0,
      pagination: {
        el: "#about-pagination",
        clickable: true,
      },
      navigation: {
        nextEl: "#about-next",
        prevEl: "#about-prev",
      },
    });

    new Swiper("#staff-swiper", {
      preloadImages: false,
      pagination: {
        el: "#staff-pagination",
        clickable: true,
      },
      navigation: {
        nextEl: "#staff-next",
        prevEl: "#staff-prev",
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

    initStatistics({ colorCircle: "#a1a1aa", threshold: 0.3, minimumRatio: 0.3 });
  });
}
