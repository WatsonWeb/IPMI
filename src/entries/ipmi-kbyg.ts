import kbyg from "../kbyg";

declare global {
  interface Window {
    IPMIKBYG?: typeof kbyg;
  }
}

window.IPMIKBYG = kbyg;
kbyg.autoInit(document);
