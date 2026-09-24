import { onReady } from "../site/dom";
import { initNavigation } from "../site/navigation";
import { initWebpFallback } from "../site/webp";
onReady(() => initNavigation());
void initWebpFallback();
