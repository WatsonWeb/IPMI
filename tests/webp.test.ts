// @vitest-environment happy-dom
import type { Window } from "happy-dom";
import { afterEach, beforeEach, expect, test, vi } from "vite-plus/test";

let initWebpFallback: typeof import("../src/site/webp").initWebpFallback;
const probes: HTMLImageElement[] = [];
const polyfillsUrl = "https://cdn.jsdelivr.net/npm/webp-hero@0.0.2/dist-cjs/polyfills.min.js";
const heroUrl = "https://cdn.jsdelivr.net/npm/webp-hero@0.0.2/dist-cjs/webp-hero.bundle.min.js";
let readyState: DocumentReadyState = "complete";

async function flush(): Promise<void> {
  for (let turn = 0; turn < 12; turn++) await Promise.resolve();
}
function scripts(): HTMLScriptElement[] {
  return Array.from(document.querySelectorAll<HTMLScriptElement>("script[src]"));
}
function srcsets(): (string | null)[] {
  return Array.from(document.querySelectorAll("img"), (image) => image.getAttribute("srcset"));
}
const originalSrcsets = ["first.webp 1x, first-large.webp 2x", "second.webp 1x"];
function hero(polyfillDocument = vi.fn<() => void | Promise<void>>()) {
  const construct = vi.fn();
  class WebpMachine {
    constructor() {
      construct();
    }
    polyfillDocument = polyfillDocument;
  }
  vi.stubGlobal("webpHero", { WebpMachine });
  return { construct, polyfillDocument };
}
async function loadDependencies(): Promise<void> {
  expect(scripts().map((script) => script.src)).toEqual([polyfillsUrl]);
  scripts()[0].dispatchEvent(new Event("load"));
  await flush();
  expect(scripts().map((script) => script.src)).toEqual([polyfillsUrl, heroUrl]);
  scripts()[1].dispatchEvent(new Event("load"));
  await flush();
}

beforeEach(async () => {
  vi.resetModules();
  ({ initWebpFallback } = await import("../src/site/webp"));
  // Keep real DOM nodes and load/error events, but disable all remote resource loading.
  (window as unknown as Window).happyDOM.settings.disableJavaScriptFileLoading = true;
  const append = document.head.append.bind(document.head);
  vi.spyOn(document.head, "append").mockImplementation((...nodes) => {
    // Inert script types prevent happy-dom's automatic disabled-resource error;
    // tests explicitly deliver the dependency load/error event at each stage.
    for (const node of nodes)
      if (node instanceof HTMLScriptElement) node.type = "application/x-ipmi-controlled-test";
    append(...nodes);
  });
  document.head.innerHTML = "";
  document.documentElement.className = "";
  document.body.innerHTML = `<img srcset="${originalSrcsets[0]}"><img srcset="${originalSrcsets[1]}"><picture><source srcset="untouched.webp"></picture>`;
  probes.length = 0;
  readyState = "complete";
  vi.spyOn(document, "readyState", "get").mockImplementation(() => readyState);
  vi.spyOn(console, "warn").mockImplementation(() => {});
  vi.stubGlobal("Image", function () {
    const image = document.createElement("img");
    // The capability data URI never needs a decoder/network in this test.
    let source = "";
    Object.defineProperty(image, "src", {
      configurable: true,
      get: () => source,
      set: (value: string) => {
        source = value;
      },
    });
    probes.push(image);
    return image;
  });
  Reflect.deleteProperty(window, "$");
  Reflect.deleteProperty(window, "jQuery");
  Reflect.deleteProperty(window, "webpHero");
});
afterEach(() => {
  expect("$" in window).toBe(false);
  expect("jQuery" in window).toBe(false);
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

test("supported WebP detection leaves responsive images unchanged and loads no dependencies", async () => {
  const pending = initWebpFallback();
  expect(probes).toHaveLength(1);
  expect(probes[0].src).toMatch(/^data:image\/webp;base64,/);
  expect(scripts()).toHaveLength(0);
  probes[0].width = 1;
  probes[0].dispatchEvent(new Event("load"));
  await pending;
  expect(document.documentElement.classList.contains("webp")).toBe(true);
  expect(document.documentElement.classList.contains("no-webp")).toBe(false);
  expect(srcsets()).toEqual(originalSrcsets);
  expect(scripts()).toHaveLength(0);
  expect(probes[0].onload).toBe(null);
  expect(probes[0].onerror).toBe(null);
  probes[0].dispatchEvent(new Event("error"));
  expect(initWebpFallback()).toBe(pending);
  expect(probes).toHaveLength(1);
  expect(scripts()).toHaveLength(0);
});

test.each(["error", "wrong dimensions"] as const)(
  "unsupported WebP (%s) loads dependencies in order and waits for DOM readiness",
  async (reason) => {
    readyState = "loading";
    const machine = hero();
    const pending = initWebpFallback();
    expect(initWebpFallback()).toBe(pending);
    expect(probes).toHaveLength(1);
    probes[0].width = 0;
    probes[0].dispatchEvent(new Event(reason === "error" ? "error" : "load"));
    await flush();
    expect(document.documentElement.classList.contains("no-webp")).toBe(true);
    expect(srcsets()).toEqual(originalSrcsets);
    await loadDependencies();
    expect(srcsets()).toEqual(originalSrcsets);
    expect(machine.construct).not.toHaveBeenCalled();
    readyState = "interactive";
    document.dispatchEvent(new Event("DOMContentLoaded"));
    await pending;
    expect(srcsets()).toEqual([null, null]);
    expect(document.querySelector("source")?.getAttribute("srcset")).toBe("untouched.webp");
    expect(machine.construct).toHaveBeenCalledTimes(1);
    expect(machine.polyfillDocument).toHaveBeenCalledTimes(1);
    document.dispatchEvent(new Event("DOMContentLoaded"));
    await initWebpFallback();
    expect(machine.polyfillDocument).toHaveBeenCalledTimes(1);
    expect(scripts()).toHaveLength(2);
  },
);

test.each([0, 1])(
  "dependency %s failure resolves safely without retrying or mutating srcsets",
  async (failedIndex) => {
    const machine = hero();
    const pending = initWebpFallback();
    probes[0].dispatchEvent(new Event("error"));
    await flush();
    if (failedIndex === 1) {
      scripts()[0].dispatchEvent(new Event("load"));
      await flush();
    }
    const failed = scripts()[failedIndex];
    failed.dispatchEvent(new Event("error"));
    await expect(pending).resolves.toBeUndefined();
    expect(srcsets()).toEqual(originalSrcsets);
    expect(machine.construct).not.toHaveBeenCalled();
    expect(console.warn).toHaveBeenCalledTimes(1);
    failed.dispatchEvent(new Event("load"));
    probes[0].dispatchEvent(new Event("load"));
    await initWebpFallback();
    expect(scripts()).toHaveLength(failedIndex + 1);
    expect(probes).toHaveLength(1);
    expect(srcsets()).toEqual(originalSrcsets);
    expect(machine.construct).not.toHaveBeenCalled();
  },
);

test.each([
  "missing constructor",
  "constructor throws",
  "polyfill throws",
  "polyfill rejects",
] as const)(
  "%s preserves original responsive sources and does not escape as an unhandled rejection",
  async (failure) => {
    if (failure === "missing constructor") vi.stubGlobal("webpHero", {});
    else if (failure === "constructor throws") {
      vi.stubGlobal("webpHero", {
        WebpMachine: class {
          constructor() {
            throw new Error("Construction failed");
          }
        },
      });
    } else {
      const polyfillDocument = vi.fn<() => void | Promise<void>>();
      if (failure === "polyfill throws")
        polyfillDocument.mockImplementation(() => {
          throw new Error("Decoder failed");
        });
      else polyfillDocument.mockRejectedValue(new Error("Decoder failed"));
      hero(polyfillDocument);
    }
    const pending = initWebpFallback();
    probes[0].dispatchEvent(new Event("error"));
    await flush();
    await loadDependencies();
    await expect(pending).resolves.toBeUndefined();
    expect(srcsets()).toEqual(originalSrcsets);
    expect(console.warn).toHaveBeenCalledTimes(1);
    expect(initWebpFallback()).toBe(pending);
  },
);
