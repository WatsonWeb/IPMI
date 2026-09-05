import type { StyleCapture } from "./compare-style-probes.ts";

// Execute this read-only function through the supported browser/CDP session.
// It deliberately excludes text, timestamps, tracking IDs, and animated media.
export function captureStyleProbe(): StyleCapture {
  const properties = [
    "display",
    "position",
    "box-sizing",
    "font-family",
    "font-size",
    "font-weight",
    "line-height",
    "letter-spacing",
    "text-transform",
    "color",
    "background-color",
    "background-image",
    "border-radius",
    "border-top-width",
    "border-top-color",
    "padding-top",
    "padding-right",
    "padding-bottom",
    "padding-left",
    "margin-top",
    "margin-bottom",
    "gap",
    "grid-template-columns",
    "box-shadow",
    "overflow-x",
    "opacity",
    "transform",
    "transition",
    "content",
    "--kbyg-accent",
    "--kbyg-accent-dark",
  ];
  const selectors = [
    "body",
    "h1",
    ".navbar",
    ".nav-container",
    ".desktop-menu",
    ".mobile-menu-button",
    ".button",
    ".footer",
    ".kbyg-page",
    ".kbyg-hero",
    ".kbyg-hero__title",
    ".kbyg-button",
    ".kbyg-section__title",
    ".kbyg-section__eyebrow",
    ".kbyg-rich-text",
    ".kbyg-icon-card",
    ".kbyg-icon",
    ".kbyg-jump",
    ".kbyg-jump__select-wrap",
    ".kbyg-date-card",
    ".kbyg-agenda-card",
    ".kbyg-contact-card",
    ".kbyg-curve",
  ];
  const number = (value: number): number => Math.round(value * 100) / 100;
  const samples = selectors.flatMap((selector) =>
    [...document.querySelectorAll(selector)].slice(0, 6).map((element, index) => {
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      const computed = (target: CSSStyleDeclaration): Record<string, string> =>
        Object.fromEntries(
          properties.map((property) => [property, target.getPropertyValue(property)]),
        );
      return {
        selector,
        index,
        visible: !!(rect.width && rect.height),
        size: [number(rect.width), number(rect.height)] as [number, number],
        style: computed(style),
        before: computed(getComputedStyle(element, "::before")),
        after: computed(getComputedStyle(element, "::after")),
      };
    }),
  );
  const kbyg = document.querySelector(".kbyg-page");
  return {
    path: location.pathname,
    width: innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
    audience: kbyg?.getAttribute("data-audience") ?? null,
    stylesheetUrls: [...document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]')].map(
      (e) => e.href,
    ),
    kbygImports: [...document.querySelectorAll("style")]
      .filter((e) => e.textContent.includes("ipmi-kbyg-styles.css"))
      .map((e) => e.textContent.trim()),
    sections: [...document.querySelectorAll(".kbyg-page main section")].map((element) => {
      const rect = element.getBoundingClientRect();
      return { id: element.id, width: number(rect.width), height: number(rect.height) };
    }),
    contentOverflow: [...document.querySelectorAll(".kbyg-page main *")]
      .filter((element) => {
        const rect = element.getBoundingClientRect();
        return (
          element.namespaceURI !== "http://www.w3.org/2000/svg" &&
          rect.width > 0 &&
          (rect.right > innerWidth + 1 || rect.left < -1)
        );
      })
      .map((element) => element.getAttribute("class") ?? ""),
    samples,
  };
}
