import path from "node:path";
import { fileURLToPath } from "node:url";

import autoprefixer from "autoprefixer";
import postcss from "postcss";
import * as sass from "sass";

export const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const stylesheetEntries = Object.freeze({
  "ipmi-custom-styles": { style: "compressed", banner: "" },
  "ipmi-kbyg-styles": {
    style: "expanded",
    banner: "/* IPMI KBYG template styles — generated from ipmi-kbyg-styles.scss. */\n",
  },
} satisfies Record<string, { style: sass.OutputStyle; banner: string }>);

export interface CompiledStylesheet {
  name: string;
  fileName: string;
  css: string;
  dependencies: string[];
}

// One compiler path for Vite build/dev, compatibility builds, and regression
// checks. This function is pure with respect to files: callers own any output.
export async function compileStylesheet(
  name: string,
  root = projectRoot,
): Promise<CompiledStylesheet> {
  if (!Object.hasOwn(stylesheetEntries, name))
    throw new Error(`Unknown stylesheet entrypoint: ${name}`);
  const entry = stylesheetEntries[name as keyof typeof stylesheetEntries];
  const sourcePath = path.join(root, `${name}.scss`);
  const outputPath = path.join(root, `${name}.css`);
  const compiled = sass.compile(sourcePath, {
    charset: false,
    loadPaths: [root],
    style: entry.style,
    // Legacy global source has known deprecations; migrating their semantics
    // is independent of moving the unchanged compiler pipeline into Vite+.
    logger: { warn() {}, debug() {} },
  });
  const processed = await postcss([autoprefixer]).process(compiled.css, {
    from: sourcePath,
    map: false,
    to: outputPath,
  });
  return {
    name,
    fileName: `${name}.css`,
    css: entry.banner ? `${entry.banner}${processed.css.trim()}\n` : processed.css,
    dependencies: compiled.loadedUrls
      .filter((url) => url.protocol === "file:")
      .map((url) => fileURLToPath(url)),
  };
}

export async function compileAllStylesheets(root = projectRoot) {
  return Promise.all(Object.keys(stylesheetEntries).map((name) => compileStylesheet(name, root)));
}
