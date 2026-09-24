import { onReady } from "../site/dom";
import { initPhotoAccessibility } from "../site/photo-accessibility";
import "../site/refresh-integration.css";

// The existing four photo pages retain their own immutable helper. This adds
// full-size viewer descriptions to KBYG and the reused native Institute venues.
onReady(() => {
  if (document.querySelector(".kbyg-page, .detail-lightbox .detail-photo-image"))
    initPhotoAccessibility();
});
