import { onReady } from "./dom";

interface WebpMachine {
  polyfillDocument(): unknown;
}

interface WebpHero {
  WebpMachine: new () => WebpMachine;
}

const webpDataUri =
  "data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA=";
const vendorBase = "https://cdn.jsdelivr.net/npm/webp-hero@0.0.2/dist-cjs/";
const initializations = new WeakMap<Document, Promise<void>>();

function supportsWebp(): Promise<boolean> {
  return new Promise((resolve) => {
    const image = new Image();
    const finish = (supported: boolean) => {
      image.onload = null;
      image.onerror = null;
      resolve(supported);
    };
    // A successful decode must produce the same 1px image as the original
    // Modernizr check. No network request is needed for this data URI.
    image.onload = () => finish(image.width === 1);
    image.onerror = () => finish(false);
    image.src = webpDataUri;
  });
}

function loadScript(doc: Document, file: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const script = doc.createElement("script");
    const clear = () => {
      script.onload = null;
      script.onerror = null;
    };
    script.onload = () => {
      clear();
      resolve();
    };
    script.onerror = () => {
      clear();
      reject(new Error(`Unable to load WebP fallback dependency: ${file}`));
    };
    script.src = `${vendorBase}${file}`;
    doc.head.append(script);
  });
}

async function initialize(doc: Document): Promise<void> {
  const supported = await supportsWebp();
  doc.documentElement.classList.toggle("webp", supported);
  doc.documentElement.classList.toggle("no-webp", !supported);
  if (supported) return;

  // Preserve the pinned fallback while ensuring its prerequisites execute first.
  await loadScript(doc, "polyfills.min.js");
  await loadScript(doc, "webp-hero.bundle.min.js");
  await new Promise<void>((resolve) => onReady(resolve, doc));
  const hero = (doc.defaultView as (Window & { webpHero?: WebpHero }) | null)?.webpHero;
  if (typeof hero?.WebpMachine !== "function")
    throw new Error("The WebP fallback did not provide WebpMachine.");
  const machine = new hero.WebpMachine();
  const sources = Array.from(doc.querySelectorAll<HTMLImageElement>("img[srcset]"), (image) => ({
    image,
    srcset: image.getAttribute("srcset") ?? "",
  }));
  try {
    for (const { image } of sources) image.removeAttribute("srcset");
    await machine.polyfillDocument();
  } catch (error) {
    // An unsuccessful fallback must not leave responsive images degraded.
    for (const { image, srcset } of sources) image.setAttribute("srcset", srcset);
    throw error;
  }
}

export function initWebpFallback(doc: Document = document): Promise<void> {
  const existing = initializations.get(doc);
  if (existing) return existing;
  const initialization = initialize(doc).catch((error: unknown) => {
    console.warn("WebP fallback could not initialize.", error);
  });
  initializations.set(doc, initialization);
  return initialization;
}
