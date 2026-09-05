import { onReady } from "./dom";
import { initFieldFocus } from "./forms";

// Native form behavior; no first-party jQuery dependency.
export function initContact(): void {
  onReady(() => initFieldFocus());
}
