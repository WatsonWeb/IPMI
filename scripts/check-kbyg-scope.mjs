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
const permittedSharedChromeSelectors = new Set([
  ".kbyg-page .desktop-menu",
  ".kbyg-page .mobile-menu-button",
  ".kbyg-page .mobile-menu-button.button",
  ".kbyg-page .mobile-menu-icon",
  ".kbyg-page .mobile-menu-text",
  ".kbyg-page .mobile-menu-wrap",
  ".kbyg-page .nav-container",
  ".kbyg-page .navbar",
]);
const forbiddenSharedChromeClasses = new Set([
  "back-to-top",
  "back-to-top-button",
  "brand",
  "desktop-menu",
  "footer",
  "footer-column",
  "footer-columns",
  "footer-contact-column",
  "footer-contact-columns",
  "logo",
  "mobile-menu-button",
  "mobile-menu-icon",
  "mobile-menu-text",
  "mobile-menu-wrap",
  "nav-container",
  "nav-link",
  "nav-button",
  "navbar",
]);

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
        const selectorText = selector.toString().trim();
        if (first?.type !== "class" || first.value !== "kbyg-page") {
          failures.push(`Selector escapes .kbyg-page: ${selectorText}`);
          return;
        }

        const sharedClasses = [];
        selector.walkClasses((classNode) => {
          if (forbiddenSharedChromeClasses.has(classNode.value)) {
            sharedClasses.push(classNode.value);
          }
        });
        if (
          sharedClasses.length > 0 &&
          !permittedSharedChromeSelectors.has(selectorText) &&
          !permittedSharedChromeSelectors.has(selectorText.replace(/:hover|:focus-visible/g, ""))
        ) {
          failures.push(
            `Selector mutates shared site chrome (${sharedClasses.join(", ")}): ${selectorText}`,
          );
        }

        if (
          (selectorText.includes(":where(") || /^\.kbyg-page\s+\*/.test(selectorText)) &&
          !selectorText.startsWith(".kbyg-page > main")
        ) {
          failures.push(`Broad selector must cross the KBYG main boundary: ${selectorText}`);
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
  console.log("All emitted selectors are scoped to KBYG-owned content and approved nav rules.");
}
