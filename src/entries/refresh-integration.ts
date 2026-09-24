import { onReady } from "../site/dom";
import { initPhotoAccessibility } from "../site/photo-accessibility";
import "../site/refresh-integration.css";

// The existing four photo pages retain their own immutable helper. This adds
// full-size viewer descriptions only to the newly audited KBYG context.
onReady(() => {
  if (document.querySelector(".kbyg-page")) initPhotoAccessibility();
});
