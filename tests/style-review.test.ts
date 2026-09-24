import { createServer, preview, type Plugin } from "vite-plus";
import { expect, test, vi } from "vite-plus/test";

import {
  injectReviewDevClient,
  reviewPages,
  rewriteReviewStyles,
  styleReviewPlugin,
} from "../scripts/style-review.ts";
import { rewriteReviewScripts } from "../scripts/review-scripts.ts";

const script = (body: string) => `<script>${body}</script>`;
const globalCode = script("/* mobile-menu-wrap footer-open-button preserveAspectRatio */");
const homeCode = script("/* featuresSwiper statInstitutes new Swiper */");
const modalCode = script("/* https://ipmi-express-server.vercel.app/cms-items/ modal-link */");
const sliderCode = script("/* advisorsSwiper new Swiper */");
const kbygScript =
  '<script defer src="https://cdn.jsdelivr.net/gh/WatsonWeb/IPMI@1a43ab6479710e09b92991cc9cb96dfdbc6ac2eb/ipmi-kbyg.js"></script>';
const vendorScript = '<script src="https://cdn.example.com/vendor.js"></script>';
const platformJQuery =
  '<script src="https://d3e54v103j8qbb.cloudfront.net/js/jquery-3.5.1.min.js" crossorigin="anonymous"></script>';
const legacyWebp =
  '<script defer src="https://watsonweb.github.io/IPMI/js/webp-polyfill-min.js" crossorigin="anonymous"></script>';
const analyticsCode = script('window.analytics = "preserved";');
const markup = (pageScripts: string) =>
  `<!doctype html><html><head><link rel="stylesheet" href="https://watsonweb.github.io/IPMI/ipmi-custom-styles.css"><style>@import url("https://cdn.jsdelivr.net/gh/WatsonWeb/IPMI@abc123/ipmi-kbyg-styles.css");.kbyg-page{--kbyg-accent:#25948a}</style></head><body><main>Review</main>${vendorScript}${globalCode}${pageScripts}${analyticsCode}</body></html>`;
const sponsorRoute = "/know-before-you-go/hchr-sept-2026-sponsor";

test("vanilla first-party review leaves Webflow-managed jQuery untouched", () => {
  const source = markup(kbygScript).replace(vendorScript, platformJQuery + vendorScript);
  for (const mode of ["baseline", "development", "production"] as const) {
    const result = rewriteReviewScripts(source, sponsorRoute, mode);
    expect(result.split(platformJQuery)).toHaveLength(2);
    expect(result).toContain(vendorScript);
  }
});

test("current review removes owned WebP loaders including query/hash variants; baseline preserves them", () => {
  const ownedUrls = [
    "https://watsonweb.github.io/IPMI",
    "https://cdn.jsdelivr.net/gh/WatsonWeb/IPMI@abc123",
  ].flatMap((host) =>
    ["webp-polyfill.js", "webp-polyfill-min.js"].flatMap((filename) =>
      ["", "?version=unknown", "#fallback", "?version=unknown&cache=1#fallback"].map(
        (suffix) => `${host}/js/${filename}${suffix}`,
      ),
    ),
  );
  const ownedScripts = ownedUrls.map((url) => `<script src="${url}"></script>`);
  const similarUrls = [
    "https://other.example/IPMI/js/webp-polyfill-min.js",
    "https://watsonweb.github.io.example/IPMI/js/webp-polyfill-min.js?version=unknown",
    "https://watsonweb.github.io/OTHER/js/webp-polyfill-min.js#fallback",
    "https://watsonweb.github.io/IPMI/js/webp-polyfill-min.js.backup",
    "https://watsonweb.github.io/IPMI/js/webp-polyfill-min.js.backup?version=unknown#fallback",
    "https://cdn.jsdelivr.net/gh/OtherOwner/IPMI@abc123/js/webp-polyfill-min.js?version=unknown",
    "https://cdn.jsdelivr.net/gh/WatsonWeb/OTHER@abc123/js/webp-polyfill-min.js#fallback",
    "https://cdn.jsdelivr.net/gh/WatsonWeb/IPMI@abc123?file=/js/webp-polyfill-min.js",
    "https://other.example/script.js?url=https://watsonweb.github.io/IPMI/js/webp-polyfill-min.js",
    "https://cdn.jsdelivr.net/npm/webp-hero@0.0.2/dist-cjs/polyfills.min.js",
    "https://cdn.jsdelivr.net/npm/webp-hero@0.0.2/dist-cjs/webp-hero.bundle.min.js",
  ]
    .map((url) => `<script src="${url}"></script>`)
    .join("");
  const source = markup(kbygScript + legacyWebp + ownedScripts.join("") + similarUrls);
  expect(rewriteReviewScripts(source, sponsorRoute, "baseline")).toBe(source);
  for (const mode of ["development", "production"] as const) {
    const current = rewriteReviewScripts(source, sponsorRoute, mode);
    expect(current).not.toContain(legacyWebp);
    for (const owned of ownedScripts) expect(current).not.toContain(owned);
    expect(current).toContain(similarUrls);
    expect(current).toContain(mode === "development" ? "/src/entries/site.ts" : "/site.js");
  }
});

test("root and dist release CSS URLs map to the same two owned local assets", () => {
  for (const host of [
    "https://watsonweb.github.io/IPMI",
    "https://cdn.jsdelivr.net/gh/WatsonWeb/IPMI@0123456789abcdef",
  ]) {
    for (const directory of ["", "dist/"]) {
      const source = `<html><head><link rel="stylesheet" href="${host}/${directory}ipmi-custom-styles.css"><style>@import url("${host}/${directory}ipmi-kbyg-styles.css");.kbyg-page{--kbyg-accent:#25948a}</style></head><body></body></html>`;
      for (const legacy of [true, false]) {
        const prefix = legacy ? "/__style-review/legacy/" : "/";
        const result = rewriteReviewStyles(source, legacy, true);
        expect(result).toContain(`href="${prefix}ipmi-custom-styles.css"`);
        expect(result).toContain(`url("${prefix}ipmi-kbyg-styles.css")`);
        expect(result).not.toContain(host);
        expect(result).toContain("--kbyg-accent:#25948a");
      }
    }
  }
});

test("stylesheet coverage rejects missing or unknown references and duplicate KBYG imports", () => {
  const source = markup(kbygScript);
  const withoutKbyg = source.replace(/<style>[\s\S]*?<\/style>/, "");
  expect(() => rewriteReviewStyles(withoutKbyg, false, true)).toThrow(
    "expected 1 ipmi-kbyg-styles.css reference, found 0",
  );
  expect(() => rewriteReviewStyles(source, false, false)).toThrow(
    "expected 0 ipmi-kbyg-styles.css reference, found 1",
  );
  expect(() =>
    rewriteReviewStyles(
      source.replace("watsonweb.github.io/IPMI", "unknown.example/assets"),
      false,
      true,
    ),
  ).toThrow("expected at least 1 ipmi-custom-styles.css reference, found 0");
  expect(() =>
    rewriteReviewStyles(
      source.replace("cdn.jsdelivr.net/gh/WatsonWeb/IPMI@abc123", "unknown.example/assets"),
      false,
      true,
    ),
  ).toThrow("expected 1 ipmi-kbyg-styles.css reference, found 0");
  expect(() =>
    rewriteReviewStyles(
      source +
        '<style>@import url("https://watsonweb.github.io/IPMI/dist/ipmi-kbyg-styles.css");</style>',
      false,
      true,
    ),
  ).toThrow("expected 1 ipmi-kbyg-styles.css reference, found 2");
  expect(rewriteReviewStyles(withoutKbyg, false, false)).toContain(
    'href="/ipmi-custom-styles.css"',
  );
});

test("Institute replacement requires both legacy modal and slider fragments", () => {
  const route = "/institutes/healthcare-gci-oct-2026";
  for (const mode of ["development", "production"] as const) {
    expect(() => rewriteReviewScripts(markup(modalCode), route, mode)).toThrow(
      "institute sliders fragment",
    );
    expect(() => rewriteReviewScripts(markup(sliderCode), route, mode)).toThrow(
      "institute modal fragment",
    );
    const changedModal = script('window.changedModal = "modal-link updated CMS loader";');
    expect(() => rewriteReviewScripts(markup(changedModal + sliderCode), route, mode)).toThrow(
      "institute modal fragment",
    );
    const changedSlider = script('window.changedSlider = "new Swiper updated configuration";');
    expect(() => rewriteReviewScripts(markup(modalCode + changedSlider), route, mode)).toThrow(
      "institute sliders fragment",
    );
    expect(rewriteReviewScripts(markup(modalCode + sliderCode), route, mode)).not.toContain(
      modalCode,
    );
    const combined = script(
      "/* https://ipmi-express-server.vercel.app/cms-items/ modal-link advisorsSwiper new Swiper */",
    );
    expect(rewriteReviewScripts(markup(combined), route, mode)).not.toContain(combined);
    const completeBundle =
      '<script defer src="https://cdn.jsdelivr.net/gh/WatsonWeb/IPMI@abc123/dist/institute.js"></script>';
    const result = rewriteReviewScripts(markup(completeBundle), route, mode);
    expect(result).not.toContain(completeBundle);
    expect(result).toContain(
      mode === "development" ? "/src/entries/institute.ts" : "/institute.js",
    );
  }
});

test("pre-existing global head and native-embed imports are both preserved and rewritten", () => {
  const source = markup(kbygScript).replace(
    "</body>",
    '<div hidden><style>@import url("https://watsonweb.github.io/IPMI/ipmi-custom-styles.css");</style></div></body>',
  );
  for (const legacy of [true, false]) {
    const prefix = legacy ? "/__style-review/legacy/" : "/";
    const result = rewriteReviewStyles(source, legacy, true);
    expect(result).toContain(`href="${prefix}ipmi-custom-styles.css"`);
    expect(result).toContain(`url("${prefix}ipmi-custom-styles.css")`);
    expect(result.split(`${prefix}ipmi-custom-styles.css`)).toHaveLength(3);
    expect(result).not.toContain("https://watsonweb.github.io/IPMI/ipmi-custom-styles.css");
    expect(result).toContain(`url("${prefix}ipmi-kbyg-styles.css")`);
  }
});

test.each(["development", "production"] as const)(
  "%s concurrent reviews share one in-flight upstream snapshot",
  async (mode) => {
    let release: ((html: string) => void) | undefined;
    const pending = new Promise<string>((resolve) => {
      release = resolve;
    });
    const fetchPage = vi.fn(() => pending);
    let requestsStarted = 0;
    const observeRequests: Plugin = {
      name: "observe-review-requests",
      configureServer(server) {
        server.middlewares.use((request, _response, next) => {
          if (request.url?.split("?")[0] === sponsorRoute) requestsStarted += 1;
          next();
        });
      },
      configurePreviewServer(server) {
        server.middlewares.use((request, _response, next) => {
          if (request.url?.split("?")[0] === sponsorRoute) requestsStarted += 1;
          next();
        });
      },
    };
    const config = {
      configFile: false as const,
      appType: "custom" as const,
      publicDir: false as const,
      logLevel: "silent" as const,
      plugins: [observeRequests, styleReviewPlugin({ fetchPage })],
      build: { outDir: "dist", emptyOutDir: false, copyPublicDir: false },
    };
    const server =
      mode === "development"
        ? await createServer({ ...config, server: { host: "127.0.0.1", port: 0 } })
        : await preview({ ...config, preview: { host: "127.0.0.1", port: 0 } });
    const source = markup(kbygScript).replace("Review</main>", "Single upstream version</main>");
    try {
      if ("listen" in server) await server.listen();
      const address = server.httpServer?.address();
      if (!address || typeof address === "string") throw new Error("No review server address");
      const origin = `http://127.0.0.1:${address.port}`;
      const responses = Promise.all([
        fetch(`${origin}${sponsorRoute}?style-baseline=legacy`),
        fetch(`${origin}${sponsorRoute}`),
      ]);
      await vi.waitFor(() => expect(requestsStarted).toBe(2));
      expect(fetchPage).toHaveBeenCalledTimes(1);
      if (!release) throw new Error("Missing snapshot resolver");
      release(source);
      for (const response of await responses) {
        expect(response.status).toBe(200);
        expect(await response.text()).toContain("Single upstream version</main>");
      }
    } finally {
      release?.(source);
      await server.close();
    }
  },
);

test("a failed upstream snapshot is evicted so a later review can retry", async () => {
  const fetchPage = vi
    .fn<() => Promise<string>>()
    .mockRejectedValueOnce(new Error("Temporary upstream failure"))
    .mockResolvedValue(markup(kbygScript));
  const server = await createServer({
    configFile: false,
    appType: "custom",
    publicDir: false,
    logLevel: "silent",
    plugins: [styleReviewPlugin({ fetchPage })],
    server: { host: "127.0.0.1", port: 0 },
  });
  try {
    await server.listen();
    const address = server.httpServer?.address();
    if (!address || typeof address === "string") throw new Error("No review server address");
    const origin = `http://127.0.0.1:${address.port}`;
    const failed = await fetch(`${origin}${sponsorRoute}`);
    expect(failed.status).toBe(500);
    await failed.text();
    const retry = await fetch(`${origin}${sponsorRoute}`);
    expect(retry.status).toBe(200);
    expect(await retry.text()).toContain("/src/entries/ipmi-kbyg.ts");
    const cached = await fetch(`${origin}${sponsorRoute}?style-baseline=legacy`);
    expect(cached.status).toBe(200);
    await cached.text();
    expect(fetchPage).toHaveBeenCalledTimes(2);
  } finally {
    await server.close();
  }
});

test("stylesheet baseline rewriting leaves CMS declarations and unrelated references intact", () => {
  const html = markup(kbygScript);
  const current = rewriteReviewStyles(html, false);
  const legacy = rewriteReviewStyles(html, true);
  expect(current).toContain('href="/ipmi-custom-styles.css"');
  expect(current).toContain('url("/ipmi-kbyg-styles.css")');
  expect(legacy).toContain('url("/__style-review/legacy/ipmi-kbyg-styles.css")');
  expect(legacy).toContain(".kbyg-page{--kbyg-accent:#25948a}");
  expect(current).toContain(kbygScript);
  expect(current).toContain(analyticsCode);
});

test("dev-client injection preserves inline imports without Vite HTML/CSS transformation", () => {
  const html = markup(kbygScript);
  expect(
    injectReviewDevClient(html).replace('<script type="module" src="/@vite/client"></script>', ""),
  ).toBe(html);
});

test("literal closing tags in Webflow deployment comments cannot swallow runtime scripts", () => {
  const source = markup(kbygScript)
    .replace("<head>", "<head><!-- before-</head> instructions -->")
    .replace("</body>", "<!-- KBYG collection-template before-</body> custom code. -->\n</body>");
  const current = injectReviewDevClient(rewriteReviewScripts(source, sponsorRoute, "development"));
  expect(current).toContain("<!-- before-</head> instructions -->");
  expect(current).toContain("<!-- KBYG collection-template before-</body> custom code. -->");
  expect(current).toMatch(/-->\s*<script type="module" src="\/src\/entries\/site.ts"><\/script>/);
  expect(current).toMatch(
    /<script type="module" src="\/src\/entries\/ipmi-kbyg.ts"><\/script>\s*<\/body>/,
  );
  expect(current).toContain('<script type="module" src="/@vite/client"></script></head>');
});

test.each([
  [sponsorRoute, kbygScript, "ipmi-kbyg"],
  ["/", homeCode, "home"],
  ["/institutes/healthcare-gci-oct-2026", modalCode + sliderCode, "institute"],
])("current review replaces owned handlers exactly once on %s", (route, pageCode, entry) => {
  const original = markup(pageCode);
  expect(rewriteReviewScripts(original, route, "baseline")).toBe(original);
  for (const mode of ["development", "production"] as const) {
    const current = rewriteReviewScripts(original, route, mode);
    expect(current).not.toContain(globalCode);
    expect(current).not.toContain(pageCode);
    expect(current).toContain(vendorScript);
    expect(current).toContain(analyticsCode);
    expect(current).toContain("--kbyg-accent:#25948a");
    const source = mode === "development" ? `/src/entries/${entry}.ts` : `/${entry}.js`;
    expect(current.split(`src="${source}"`)).toHaveLength(2);
    expect(current).toContain(mode === "development" ? 'type="module"' : "<script defer");
  }
});

test("unknown upstream changes fail closed rather than double-binding legacy and modern JS", () => {
  expect(() => rewriteReviewScripts(markup(""), sponsorRoute, "production")).toThrow(
    "missing ipmi-kbyg",
  );
  expect(() => rewriteReviewScripts(markup(homeCode), "/unexpected", "development")).toThrow(
    "No reviewed JavaScript",
  );
  expect(reviewPages.size).toBe(4);
  expect(reviewPages.has("/../../.env")).toBe(false);
});

test.each(["development", "production"] as const)(
  "%s HTTP review serves current code and caches identical upstream markup",
  async (mode) => {
    const fetchPage = vi.fn(async () => markup(kbygScript + legacyWebp));
    const shared = {
      configFile: false as const,
      appType: "custom" as const,
      publicDir: false as const,
      logLevel: "silent" as const,
      plugins: [styleReviewPlugin({ fetchPage })],
      build: { outDir: "dist", emptyOutDir: false, copyPublicDir: false },
    };
    const server =
      mode === "development"
        ? await createServer({ ...shared, server: { host: "127.0.0.1", port: 0 } })
        : await preview({ ...shared, preview: { host: "127.0.0.1", port: 0 } });
    try {
      if ("listen" in server) await server.listen();
      const address = server.httpServer?.address();
      if (!address || typeof address === "string") throw new Error("No review server address");
      const origin = `http://127.0.0.1:${address.port}`;
      const legacy = await fetch(`${origin}${sponsorRoute}?style-baseline=legacy`);
      expect(legacy.headers.get("x-ipmi-style-review")).toBe("legacy");
      const legacyHtml = await legacy.text();
      expect(legacyHtml).toContain(kbygScript);
      expect(legacyHtml).toContain(legacyWebp);
      expect(legacyHtml).toContain('@import url("/__style-review/legacy/ipmi-kbyg-styles.css")');
      const response = await fetch(`${origin}${sponsorRoute}`);
      expect(response.status).toBe(200);
      const current = await response.text();
      expect(current).not.toContain(kbygScript);
      expect(current).not.toContain(legacyWebp);
      expect(current).toContain(
        mode === "development" ? "/src/entries/ipmi-kbyg.ts" : "/ipmi-kbyg.js",
      );
      expect(current.includes("/@vite/client")).toBe(mode === "development");
      expect(current).not.toContain("html-proxy");
      expect(fetchPage).toHaveBeenCalledTimes(1);
      expect(fetchPage).toHaveBeenCalledWith(`https://ipmi.webflow.io${sponsorRoute}`);
      const invalid = await fetch(`${origin}/not-an-allowed-proxy-page`);
      expect(invalid.status).toBe(404);
      expect(fetchPage).toHaveBeenCalledTimes(1);
    } finally {
      await server.close();
    }
  },
);
