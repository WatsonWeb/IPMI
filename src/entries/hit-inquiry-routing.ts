import { initHitInquiryRouting } from "../site/hit-inquiry-routing";

if (["/institutes-on-the-horizon", "/attend"].includes(window.location.pathname)) {
  // Deferred scripts run while readyState is interactive, before the legacy
  // DOMContentLoaded selector has populated options and applied ?i=.
  if (document.readyState === "complete") initHitInquiryRouting();
  else document.addEventListener("DOMContentLoaded", () => initHitInquiryRouting(), { once: true });
}
