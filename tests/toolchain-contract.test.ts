import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { runInNewContext } from "node:vm";
import { Window } from "happy-dom";
import { parseFragment, type DefaultTreeAdapterMap } from "parse5";
import { expect, test } from "vite-plus/test";

import baseline from "./fixtures/style-baseline.json" with { type: "json" };

const root = fileURLToPath(new URL("..", import.meta.url));

test("first-party tooling has no jQuery dependency or ambient types", () => {
  const manifest = JSON.parse(readFileSync(path.join(root, "package.json"), "utf8")) as {
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
  };
  for (const dependencies of [manifest.dependencies, manifest.devDependencies]) {
    expect(dependencies ?? {}).not.toHaveProperty("jquery");
    expect(dependencies ?? {}).not.toHaveProperty("@types/jquery");
  }
  const types = JSON.parse(readFileSync(path.join(root, "tsconfig.json"), "utf8")) as {
    compilerOptions: { types: string[] };
  };
  expect(types.compilerOptions.types).not.toContain("jquery");
});
// Explicit ownership inventory: deriving this from the build would miss a deleted entry.
const footers = {
  site: "Page HTML/Global/Global-Footer.html",
  "ipmi-kbyg": "Page HTML/KBYG Pages/KBYG-Footer.html",
  home: "Page HTML/Home/Home-Footer.html",
  about: "Page HTML/About Us/About-Footer.html",
  contact: "Page HTML/Contact Us/Contact-Footer.html",
  attend: "Page HTML/Attend An Institute/Attend-Footer.html",
  gallery: "Page HTML/Gallery/Gallery-Footer.html",
  faq: "Page HTML/FAQ/FAQ-Footer.html",
  horizon: "Page HTML/Institutes on the Horizon/Horizon-Footer.html",
  "hit-inquiry-routing": "Page HTML/Institutes on the Horizon/HIT-Routing-Supplement.html",
  "photo-accessibility": "Page HTML/Global/Photo-Accessibility-Supplement.html",
  "refresh-integration": "Page HTML/Global/Refresh-Integration-Supplement.html",
  "institutes-calendar": "Page HTML/Institutes/Calendar-Supplement.html",
  institute: "Page HTML/Institute Single/Institute-Footer.html",
  institutes: "Page HTML/Institutes/Institutes-Footer.html",
  recap: "Page HTML/Recap Single/Recap-Footer.html",
  recaps: "Page HTML/Recaps/Recaps-Footer.html",
  vtt: "Page HTML/Virtual Think Tanks Single/VTT-Footer.html",
  "vtt-list": "Page HTML/Virtual Think Tanks/VirtualThinkTanks-Footer.html",
};

function scriptSources(html: string): string[] {
  const sources: string[] = [];
  function visit(node: DefaultTreeAdapterMap["node"]): void {
    if ("tagName" in node && node.tagName === "script") {
      const source = node.attrs.find((attribute) => attribute.name === "src")?.value;
      if (source) sources.push(source);
    }
    if ("childNodes" in node) for (const child of node.childNodes) visit(child);
  }
  visit(parseFragment(html));
  return sources;
}

test("all maintained browser entries remain present", () => {
  const entries = readdirSync(path.join(root, "src/entries"))
    .filter((name) => name.endsWith(".ts") && !name.endsWith(".d.ts"))
    .map((name) => name.slice(0, -3));
  expect(entries.sort()).toEqual(Object.keys(footers).sort());
});

test.each(Object.entries(footers).filter(([entry]) => entry !== "institutes-calendar"))(
  "%s Footer loads its single release-pinned bundle",
  (entry, footer) => {
    const sources = scriptSources(readFileSync(path.join(root, footer), "utf8"));
    const expected = `https://cdn.jsdelivr.net/gh/WatsonWeb/IPMI@__ASSET_COMMIT_SHA__/dist/${entry}.js`;
    // Leave vendor tags and historical exports alone; inspect only maintained IPMI dist references.
    const firstPartyBundles = sources.filter((source) =>
      /^https:\/\/(?:cdn\.jsdelivr\.net\/gh\/WatsonWeb\/IPMI@[^/]+|watsonweb\.github\.io\/IPMI)\/dist\//.test(
        source,
      ),
    );
    expect(firstPartyBundles).toEqual([expected]);
  },
);

test.each([
  "ipmi.webflow.io",
  "www.ipmievents.com",
  "ipmievents.com",
  "www.ipmionline.com",
  "ipmionline.com",
  "preview.ipmi.webflow.io",
])(
  "calendar shell mounts and loads its pinned bundle only on the staging host: %s",
  async (host) => {
    const expected =
      "https://cdn.jsdelivr.net/gh/WatsonWeb/IPMI@__ASSET_COMMIT_SHA__/dist/institutes-calendar";
    const html = readFileSync(path.join(root, footers["institutes-calendar"]), "utf8");
    // Execute only the maintained inline gate, with all network/evaluation disabled in the DOM.
    const window = new Window({
      url: `https://${host}/institutes`,
      settings: {
        enableJavaScriptEvaluation: false,
        disableJavaScriptFileLoading: true,
        disableCSSFileLoading: true,
      },
    });
    try {
      const doc = window.document;
      doc.body.innerHTML = html;
      const loaders = doc.querySelectorAll("script");
      expect(loaders.length).toBe(1);
      expect(scriptSources(html)).toEqual([]);
      expect(doc.querySelector("[data-ipmi-calendar-shell]")).toBeNull();
      expect(doc.querySelector("link[rel=stylesheet]")).toBeNull();
      Object.defineProperty(doc, "currentScript", { configurable: true, value: loaders[0] });
      runInNewContext(loaders[0].textContent, { document: doc, window }, { timeout: 1000 });
      expect(doc.querySelector("template[data-ipmi-calendar-staging]")).toBeNull();
      const staged = host === "ipmi.webflow.io";
      expect(doc.querySelectorAll("[data-ipmi-calendar-shell]").length).toBe(staged ? 1 : 0);
      expect(doc.querySelectorAll("[data-ipmi-calendar-dialog]").length).toBe(staged ? 1 : 0);
      expect(
        Array.from(doc.querySelectorAll("script[src]"), (script) => script.getAttribute("src")),
      ).toEqual(staged ? [`${expected}.js`] : []);
      expect(
        Array.from(doc.querySelectorAll("link[rel=stylesheet]"), (link) =>
          link.getAttribute("href"),
        ),
      ).toEqual(staged ? [`${expected}.css`] : []);
      if (staged) expect(doc.querySelector("script[src]")?.hasAttribute("defer")).toBe(true);
    } finally {
      await window.happyDOM.close();
    }
  },
);

test("superseded first-party JavaScript and CodeKit tooling stay retired", () => {
  for (const relative of [
    "Page HTML/301 Redirects/301-Bulk-Redirects-min.js",
    "Page HTML/301 Redirects/301-Bulk-Redirects.js",
    "Page HTML/IPMI-Navigation.js",
    "Page HTML/Institutes on the Horizon/Horizon-Institute-Selector.js",
    "Page HTML/Institutes/Institutes-Footer.js",
    "Page HTML/Recaps/Recaps-Footer.js",
    "ipmi-kbyg.js",
    "config.codekit3",
    "docs/legacy/config.codekit3",
    "scripts/build-kbyg.mjs",
    "js/webp-polyfill.js",
    "js/webp-polyfill-min.js",
  ]) {
    expect(existsSync(path.join(root, relative)), relative).toBe(false);
  }
});

test("frozen root CSS remains intact", () => {
  for (const [filename, fingerprint] of [
    ["ipmi-custom-styles.css", baseline.stylesheets.globalArtifact],
    ["ipmi-kbyg-styles.css", baseline.stylesheets.kbygArtifact],
  ] as const) {
    const content = readFileSync(path.join(root, filename));
    expect(content.length, filename).toBe(fingerprint.bytes);
    expect(createHash("sha256").update(content).digest("hex"), filename).toBe(fingerprint.sha256);
  }
});

test("public entry dependency graphs exclude the separately authorized redirect utility", () => {
  const visited = new Set<string>();
  const admin = path.join(root, "src/site/admin-redirects.ts");
  expect(existsSync(admin)).toBe(true);
  function visit(filename: string): void {
    expect(filename, "Admin redirect utilities must never enter public browser bundles").not.toBe(
      admin,
    );
    if (visited.has(filename)) return;
    visited.add(filename);
    if (path.extname(filename) === ".css") return;
    const source = readFileSync(filename, "utf8");
    // Follow literal ES imports/re-exports, dynamic imports and CommonJS requires.
    // This is intentionally conservative; build tests separately verify actual bundled code.
    const imports = source.matchAll(
      /(?:\bfrom\s*|\bimport\s*(?:\(\s*)?|\brequire\s*\(\s*)["']([^"']+)["']/g,
    );
    for (const match of imports) {
      const specifier = match[1];
      if (!specifier.startsWith(".")) continue;
      const base = path.resolve(path.dirname(filename), specifier).replace(/\.(?:js|ts)$/, "");
      const resolved = [base, `${base}.ts`, path.join(base, "index.ts")].find(
        (candidate) => existsSync(candidate) && /\.(?:ts|css)$/.test(candidate),
      );
      expect(resolved, `Unresolved local import ${specifier} in ${filename}`).toBeDefined();
      if (resolved) visit(resolved);
    }
  }
  for (const entry of Object.keys(footers)) visit(path.join(root, "src/entries", `${entry}.ts`));
});
