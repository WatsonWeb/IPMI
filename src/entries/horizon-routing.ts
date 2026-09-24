import { initHorizonRouting } from "../site/horizon-routing";

if (window.location.pathname === "/institutes-on-the-horizon") {
  // Deferred scripts run while readyState is interactive, before the legacy
  // DOMContentLoaded selector has populated options and applied ?i=.
  if (document.readyState === "complete") initHorizonRouting();
  else document.addEventListener("DOMContentLoaded", () => initHorizonRouting(), { once: true });
}
