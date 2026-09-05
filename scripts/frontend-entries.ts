import { readdirSync } from "node:fs";
import path from "node:path";
import type { EnvironmentOptions } from "vite-plus";

import { projectRoot } from "./compile-styles.ts";

export interface BrowserEntry {
  name: string;
  source: string;
  fileName: string;
}

export function browserEntries(root = projectRoot): BrowserEntry[] {
  return readdirSync(path.join(root, "src/entries"))
    .filter((name) => /^[a-z][a-z0-9-]*\.ts$/.test(name) && !name.endsWith(".d.ts"))
    .sort()
    .map((name) => ({
      name: name.slice(0, -3),
      source: path.join(root, "src/entries", name),
      fileName: name.replace(/\.ts$/, ".js"),
    }));
}

// Webflow loads classic deferred scripts, so each entry is a self-contained
// IIFE with no runtime import chunks or second copy of Webflow's jQuery.
export function browserEnvironments(root = projectRoot): Record<string, EnvironmentOptions> {
  const entries = browserEntries(root);
  if (!entries.some((entry) => entry.name === "ipmi-kbyg"))
    throw new Error("Missing KBYG browser entry.");
  return Object.fromEntries(
    entries.map((entry) => [
      entry.name === "ipmi-kbyg" ? "client" : entry.name.replaceAll("-", "_"),
      {
        consumer: "client",
        build: {
          outDir: "dist",
          emptyOutDir: false,
          copyPublicDir: false,
          target: "es2020",
          minify: "oxc",
          sourcemap: true,
          cssMinify: false,
          lib: {
            entry: entry.source,
            formats: ["iife"],
            name: `IPMI_${entry.name.replaceAll("-", "_")}`,
            fileName: () => entry.fileName,
          },
        },
      } satisfies EnvironmentOptions,
    ]),
  );
}
