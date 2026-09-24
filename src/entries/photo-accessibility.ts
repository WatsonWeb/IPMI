import { onReady } from "../site/dom";
import { initPhotoAccessibility } from "../site/photo-accessibility";
import "../site/photo-accessibility.css";

onReady(() => initPhotoAccessibility());
