import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

import autoprefixer from "autoprefixer";
import postcss from "postcss";
import * as sass from "sass";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourcePath = path.join(root, "ipmi-kbyg-styles.scss");
const outputPath = path.join(root, "ipmi-kbyg-styles.css");

await readFile(sourcePath, "utf8");

const compiled = sass.compile(sourcePath, {
  charset: false,
  loadPaths: [root],
  style: "expanded",
});

const processed = await postcss([autoprefixer]).process(compiled.css, {
  from: sourcePath,
  map: false,
  to: outputPath,
});

const banner = "/* IPMI KBYG template styles — generated from ipmi-kbyg-styles.scss. */\n";
await writeFile(outputPath, `${banner}${processed.css.trim()}\n`, "utf8");

console.log(`Built ${path.relative(root, outputPath)}`);
