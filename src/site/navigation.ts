// Canonical behavior from Global-Footer.html, not the stale standalone copy
// which incorrectly registered the close action on footer-open-button.
export function initNavigation(doc: Document = document): void {
  const listen = (selector: string, action: (event: Event) => void) =>
    doc.querySelectorAll(selector).forEach((element) => element.addEventListener("click", action));
  const toggle = (selector: string, open: boolean) =>
    doc.querySelectorAll(selector).forEach((element) => element.classList.toggle("open", open));
  listen(".mobile-menu", (event) => event.stopPropagation());
  listen(".mobile-menu-button", () => toggle(".mobile-menu-wrap", true));
  listen(".mobile-menu-wrap, .mobile-close-button", () => toggle(".mobile-menu-wrap", false));
  listen(".footer-open-button", () => toggle(".footer", true));
  listen(".footer-close-button", () => toggle(".footer", false));
  doc
    .querySelectorAll(".curve svg, .large-event-curve svg, .event-curve svg")
    .forEach((element) => element.setAttribute("preserveAspectRatio", "none"));
}
