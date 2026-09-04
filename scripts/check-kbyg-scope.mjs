import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

import postcss from "postcss";
import selectorParser from "postcss-selector-parser";

const rootDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const cssPath = path.join(rootDirectory, "ipmi-kbyg-styles.css");
const css = await readFile(cssPath, "utf8");
const root = postcss.parse(css, { from: cssPath });
const failures = [];

function insideKeyframes(rule) {
  let parent = rule.parent;
  while (parent) {
    if (parent.type === "atrule" && /keyframes$/i.test(parent.name)) return true;
    parent = parent.parent;
  }
  return false;
}

root.walkAtRules(/keyframes$/i, (rule) => {
  if (!rule.params.startsWith("kbyg-")) {
    failures.push(`Keyframe name must start with "kbyg-": ${rule.params}`);
  }
});

root.walkRules((rule) => {
  if (insideKeyframes(rule)) return;

  try {
    selectorParser((selectors) => {
      selectors.each((selector) => {
        const first = selector.nodes.find((node) => node.type !== "comment");
        if (first?.type !== "class" || first.value !== "kbyg-page") {
          failures.push(`Selector escapes .kbyg-page: ${selector.toString().trim()}`);
        }
      });
    }).processSync(rule.selector);
  } catch (error) {
    failures.push(`Invalid selector "${rule.selector}": ${error.message}`);
  }
});

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else {
  console.log("All emitted selectors are scoped to .kbyg-page.");
}
