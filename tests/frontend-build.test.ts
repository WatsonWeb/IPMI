import { readFile } from "node:fs/promises";
import path from "node:path";
import { Script } from "node:vm";
import { Window } from "happy-dom";
import { createBuilder, createServer, type Rolldown } from "vite-plus";
import { describe, expect, test } from "vite-plus/test";

import { browserEntries, browserEnvironments } from "../scripts/frontend-entries.ts";
import {
  compileAllStylesheets,
  compileStylesheet,
  projectRoot,
} from "../scripts/compile-styles.ts";
import { sha256, type StyleBaseline } from "../scripts/style-baseline.ts";
import { assertSafeAssetOutput, webflowAssetsPlugin } from "../scripts/webflow-assets-plugin.ts";

const baseline: StyleBaseline = JSON.parse(
  await readFile(new URL("./fixtures/style-baseline.json", import.meta.url), "utf8"),
);
const buildOptions = {
  outDir: "dist",
  emptyOutDir: false,
  copyPublicDir: false,
  cssMinify: false,
  minify: "oxc" as const,
  sourcemap: true,
};

test("TypeScript stylesheet compiler retains frozen CSS bytes and dependency graphs", async () => {
  for (const result of await compileAllStylesheets()) {
    const key = result.name === "ipmi-kbyg-styles" ? "kbygBuild" : "globalBuild";
    expect(sha256(result.css)).toBe(baseline.stylesheets[key].sha256);
    expect(result.dependencies).toContain(path.join(projectRoot, "global/colors.scss"));
  }
  await expect(compileStylesheet("../../private")).rejects.toThrow("Unknown stylesheet entrypoint");
});

test("native multi-environment Vite build emits real minified IIFEs and TypeScript source maps", async () => {
  const outputs: Rolldown.OutputAsset[] = [];
  const chunks: Rolldown.OutputChunk[] = [];
  const before = await readFile(path.join(projectRoot, "ipmi-custom-styles.css"));
  const builder = await createBuilder({
    configFile: false,
    root: projectRoot,
    appType: "custom",
    publicDir: false,
    logLevel: "silent",
    plugins: [webflowAssetsPlugin()],
    environments: browserEnvironments(),
    build: { ...buildOptions, write: false },
    builder: {
      async buildApp(app) {
        for (const environment of Object.values(app.environments)) {
          const result = await app.build(environment);
          const bundles = Array.isArray(result) ? result : "output" in result ? [result] : [];
          for (const bundle of bundles)
            for (const output of bundle.output) {
              if (output.type === "asset") outputs.push(output);
              else chunks.push(output);
            }
        }
      },
    },
  });
  await builder.buildApp();
  const entries = browserEntries();
  expect(chunks.map((chunk) => chunk.fileName).sort()).toEqual(
    entries.map((entry) => entry.fileName).sort(),
  );
  for (const chunk of chunks) {
    expect(chunk.imports).toEqual([]);
    expect(chunk.dynamicImports).toEqual([]);
    expect(() => new Script(chunk.code)).not.toThrow();
    expect(chunk.code).not.toContain("sourceMappingURL=data:");
    const mapAsset = outputs.find((asset) => asset.fileName === `${chunk.fileName}.map`);
    expect(mapAsset).toBeDefined();
    const map = JSON.parse(String(mapAsset?.source)) as {
      sources: string[];
      sourcesContent: string[];
    };
    expect(map.sources.some((source) => source.endsWith(".ts"))).toBe(true);
    expect(map.sources.some((source) => /node_modules.*jquery/.test(source))).toBe(false);
    expect(map.sourcesContent.length).toBe(map.sources.length);
    expect(chunk.code.split("\n").length).toBeLessThan(8);

    // Run every actual production entry without the platform's optional global
    // DOM library. Vendor doubles isolate our initialization, not vendor internals.
    const page = new Window({
      url: "https://example.test/",
      settings: { disableJavaScriptFileLoading: true },
    });
    const runtimeErrors: string[] = [];
    const forbiddenReads: string[] = [];
    for (const name of ["jQuery", "$"]) {
      Object.defineProperty(page, name, {
        configurable: true,
        get() {
          forbiddenReads.push(name);
          throw new Error(`First-party bundle read ${name}`);
        },
      });
    }
    page.addEventListener("error", (event) =>
      runtimeErrors.push(
        "message" in event && typeof event.message === "string" ? event.message : event.type,
      ),
    );
    try {
      page.eval(`
        window.Swiper = class {};
        window.countUp = { CountUp: class { start() {} } };
        window.CircularProgressBar = class { initial() {} };
        // Resolve only the native WebP capability probe; no remote dependencies
        // or image requests are needed to smoke-test supported browsers.
        window.Image = function () {
          const image = document.createElement("img");
          Object.defineProperty(image, "width", { value: 1 });
          Object.defineProperty(image, "src", { set() {
            queueMicrotask(() => image.dispatchEvent(new Event("load")));
          } });
          return image;
        };
      `);
      page.eval(chunk.code);
      await page.happyDOM.waitUntilComplete();
      expect(forbiddenReads, chunk.fileName).toEqual([]);
      expect(runtimeErrors, chunk.fileName).toEqual([]);
      expect(page.document.querySelectorAll('script[src*="webp-hero"]')).toHaveLength(0);
    } finally {
      await page.happyDOM.close();
    }
  }
  for (const [name, key] of [
    ["ipmi-custom-styles.css", "globalBuild"],
    ["ipmi-kbyg-styles.css", "kbygBuild"],
  ] as const) {
    const css = outputs.filter((asset) => asset.fileName === name);
    expect(css).toHaveLength(1);
    expect(sha256(css[0].source)).toBe(baseline.stylesheets[key].sha256);
  }
  expect(await readFile(path.join(projectRoot, "ipmi-custom-styles.css"))).toEqual(before);
  const kbyg = chunks.find((chunk) => chunk.fileName === "ipmi-kbyg.js");
  expect(kbyg).toBeDefined();
  if (!kbyg) throw new Error("Missing built KBYG runtime");
  const browser = new Window({ url: "https://example.test/know-before-you-go/test-sponsor" });
  try {
    browser.document.body.innerHTML = '<main class="kbyg-page" data-audience="sponsor"></main>';
    browser.eval(kbyg.code);
    const first: unknown = browser.eval("window.IPMIKBYG.init(document)[0]");
    expect(first).toBeTruthy();
    browser.eval(kbyg.code);
    const second: unknown = browser.eval("window.IPMIKBYG.init(document)[0]");
    expect(second).toBe(first);
    const calendar: unknown = browser.eval(
      'window.IPMIKBYG.createICalendar({title:"Typed build",start:"2026-07-22",allDay:true})',
    );
    expect(calendar).toContain("DTSTART;VALUE=DATE:20260722");
    expect(calendar).toContain("DTEND;VALUE=DATE:20260723");
  } finally {
    await browser.happyDOM.close();
  }
});

test("development transforms actual TypeScript entry modules and serves baseline-safe CSS", async () => {
  const server = await createServer({
    configFile: false,
    root: projectRoot,
    appType: "custom",
    publicDir: false,
    logLevel: "silent",
    plugins: [webflowAssetsPlugin()],
    server: { host: "127.0.0.1", port: 0 },
  });
  try {
    await server.listen();
    const address = server.httpServer?.address();
    if (!address || typeof address === "string") throw new Error("No test server address");
    const origin = `http://127.0.0.1:${address.port}`;
    const runtime = await fetch(`${origin}/src/entries/ipmi-kbyg.ts`);
    expect(runtime.status).toBe(200);
    expect(runtime.headers.get("content-type")).toContain("javascript");
    const code = await runtime.text();
    expect(code).toContain("IPMIKBYG");
    expect(code).not.toContain("declare global");
    expect(code).not.toContain("interface Window");
    for (const [name, key] of [
      ["ipmi-custom-styles.css", "globalBuild"],
      ["ipmi-kbyg-styles.css", "kbygBuild"],
    ] as const) {
      const response = await fetch(`${origin}/${name}`);
      expect(response.status).toBe(200);
      expect(sha256(await response.text())).toBe(baseline.stylesheets[key].sha256);
    }
    const head = await fetch(`${origin}/ipmi-kbyg-styles.css`, { method: "HEAD" });
    expect(await head.text()).toBe("");
  } finally {
    await server.close();
  }
});

describe("build output safety", () => {
  const safe = { root: projectRoot, publicDir: false as const, build: buildOptions };
  test.each([".", "..", "../another-project", "dist/nested"])("rejects output %s", (outDir) => {
    expect(() => assertSafeAssetOutput({ ...safe, build: { ...buildOptions, outDir } })).toThrow(
      "must write",
    );
  });
  test("rejects cleanup and public-directory copying", () => {
    expect(() => assertSafeAssetOutput(safe)).not.toThrow();
    expect(() =>
      assertSafeAssetOutput({ ...safe, build: { ...buildOptions, emptyOutDir: true } }),
    ).toThrow();
    expect(() =>
      assertSafeAssetOutput({ ...safe, build: { ...buildOptions, copyPublicDir: true } }),
    ).toThrow();
    expect(() => assertSafeAssetOutput({ ...safe, publicDir: "public" })).toThrow();
  });
});
