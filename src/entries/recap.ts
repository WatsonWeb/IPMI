import { initRecap } from "../site/recap";
import { onReady } from "../site/dom";
import { unlockRecap } from "../site/recap-access";
onReady(() => unlockRecap());
initRecap();
