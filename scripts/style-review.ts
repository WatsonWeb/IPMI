import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { Connect, Plugin } from "vite-plus";
import { insertBeforeClosingTag, rewriteReviewScripts } from "./review-scripts.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const reviewPages = new Map([
  ["/", "Homepage"],
  ["/institutes/healthcare-gci-oct-2026", "Institute"],
  ["/know-before-you-go/hchr-sept-2026-sponsor", "KBYG Sponsor"],
  ["/know-before-you-go/hchr-sept-2026-delegate", "KBYG Delegate"],
]);
const assets = new Set(["ipmi-custom-styles.css", "ipmi-kbyg-styles.css"]);

export function rewriteReviewStyles(
  html: string,
  legacy: boolean,
  expectedKbyg = html.includes("ipmi-kbyg-styles.css"),
): string {
  const prefix = legacy ? "/__style-review/legacy/" : "/";
  const counts = new Map<string, number>();
  const result = html.replace(
    /https:\/\/(?:watsonweb\.github\.io\/IPMI|cdn\.jsdelivr\.net\/gh\/WatsonWeb\/IPMI@[a-f\d]+)\/(?:dist\/)?(ipmi-(?:custom|kbyg)-styles\.css)(?=[\s"'?#)<]|$)/g,
    (_url: string, name: string) => {
      counts.set(name, (counts.get(name) ?? 0) + 1);
      return `${prefix}${name}`;
    },
  );
  for (const [name, expected] of [
    ["ipmi-custom-styles.css", 1],
    ["ipmi-kbyg-styles.css", expectedKbyg ? 1 : 0],
  ] as const) {
    const count = counts.get(name) ?? 0;
    // Existing Webflow pages load the global sheet in both head and a native
    // embed. Preserve and rewrite every reference without altering that baseline.
    const global = name === "ipmi-custom-styles.css";
    if (global ? count < 1 : count !== expected) {
      throw new Error(
        `Cannot safely replace staging stylesheets: expected ${global ? "at least 1" : expected} ${name} reference, found ${count}. Review the upstream markup.`,
      );
    }
  }
  return result;
}

export function injectReviewDevClient(html: string): string {
  // Backend-integration style injection preserves the published inline CSS.
  // transformIndexHtml would resolve its @imports and alter the frozen baseline.
  return insertBeforeClosingTag(
    html,
    "head",
    '<script type="module" src="/@vite/client"></script>',
  );
}

// Development/review only. Four explicit public HTML routes are snapshotted
// once per server process; no CMS writes, arbitrary proxy URLs, or file paths.
export interface StyleReviewOptions {
  fetchPage?: (url: string) => Promise<string>;
}

export function styleReviewPlugin(options: StyleReviewOptions = {}): Plugin {
  const snapshots = new Map<string, Promise<string>>();
  let development = false;
  const middleware: Connect.NextHandleFunction = async (request, response, next) => {
    const url = new URL(request.url ?? "/", "http://127.0.0.1");
    if (request.method !== "GET" && request.method !== "HEAD") return next();
    try {
      if (url.pathname === "/__style-review") {
        const links = [...reviewPages]
          .map(
            ([route, label]) =>
              `<li>${label}: <a href="${route}?style-baseline=legacy">Frozen CSS</a> · <a href="${route}">Vite+ build</a></li>`,
          )
          .join("");
        response.setHeader("Content-Type", "text/html; charset=utf-8");
        response.end(
          `<!doctype html><html lang="en"><meta charset="utf-8"><title>IPMI stylesheet review</title><h1>IPMI stylesheet review</h1><p>Local review only. HTML is fetched read-only from staging and reused for both CSS versions. No Webflow changes are made.</p><ul>${links}</ul></html>`,
        );
        return;
      }
      if (url.pathname.startsWith("/__style-review/legacy/")) {
        const name = url.pathname.slice("/__style-review/legacy/".length);
        if (!assets.has(name)) return next();
        response.setHeader("Content-Type", "text/css; charset=utf-8");
        response.setHeader("Cache-Control", "no-store");
        response.end(await readFile(path.join(root, name)));
        return;
      }
      if (!reviewPages.has(url.pathname)) return next();
      let snapshot = snapshots.get(url.pathname);
      if (!snapshot) {
        const upstreamUrl = `https://ipmi.webflow.io${url.pathname}`;
        snapshot = options.fetchPage
          ? options.fetchPage(upstreamUrl)
          : fetch(upstreamUrl).then(async (upstream) => {
              if (!upstream.ok) throw new Error(`Staging snapshot failed: HTTP ${upstream.status}`);
              return upstream.text();
            });
        snapshots.set(url.pathname, snapshot);
      }
      let source: string;
      try {
        source = await snapshot;
      } catch (error) {
        // Failed requests may be retried; don't evict a newer in-flight retry.
        if (snapshots.get(url.pathname) === snapshot) snapshots.delete(url.pathname);
        throw error;
      }
      response.setHeader("Content-Type", "text/html; charset=utf-8");
      response.setHeader("Cache-Control", "no-store");
      response.setHeader(
        "X-IPMI-Style-Review",
        url.searchParams.get("style-baseline") === "legacy" ? "legacy" : "current",
      );
      const legacy = url.searchParams.get("style-baseline") === "legacy";
      const styles = rewriteReviewStyles(
        source,
        legacy,
        url.pathname.startsWith("/know-before-you-go/"),
      );
      const html = rewriteReviewScripts(
        styles,
        url.pathname,
        legacy ? "baseline" : development ? "development" : "production",
      );
      response.end(development ? injectReviewDevClient(html) : html);
    } catch (error) {
      next(error);
    }
  };
  return {
    name: "ipmi-read-only-style-review",
    configureServer(server) {
      // Includes Vite's dev client so stylesheet dependency changes can reload
      // the review page. Preview intentionally serves without this client.
      development = true;
      server.middlewares.use(middleware);
    },
    configurePreviewServer(server) {
      server.middlewares.use(middleware);
    },
  };
}
