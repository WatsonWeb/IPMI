import path from "node:path";
import { fileURLToPath } from "node:url";

import postcss, { type AnyNode, type Root } from "postcss";
import selectorParser from "postcss-selector-parser";
import * as sass from "sass";
import { assert, test } from "vite-plus/test";

const root = fileURLToPath(new URL("../", import.meta.url));
const compileOptions = {
  charset: false,
  loadPaths: [root],
  style: "expanded" as const,
  logger: { warn() {}, debug() {} },
};
const globalBuild = sass.compile(path.join(root, "ipmi-custom-styles.scss"), compileOptions);
const kbygBuild = sass.compile(path.join(root, "ipmi-kbyg-styles.scss"), compileOptions);
const globalCss = postcss.parse(globalBuild.css);
const kbygCss = postcss.parse(kbygBuild.css);

function declarationsFor(
  css: Root,
  selector: string,
  requiredProperty?: string,
): Record<string, string> {
  const matches: Record<string, string>[] = [];
  css.walkRules((rule) => {
    if (!rule.selectors.includes(selector)) return;
    const declarations = rule.nodes.filter((node) => node.type === "decl");
    if (requiredProperty && !declarations.some((node) => node.prop === requiredProperty)) return;
    matches.push(Object.fromEntries(declarations.map((node) => [node.prop, node.value])));
  });
  assert.ok(matches.length, `Missing emitted rule ${selector.toString()}`);
  return matches[0];
}

function compileSnippet(source: string): Root {
  return postcss.parse(sass.compileString(source, compileOptions).css);
}

test("shared palette, typography, and button primitives emit no CSS when imported alone", () => {
  for (const module of [
    "global/colors",
    "global/typography-primitives",
    "modules/button-primitives",
  ]) {
    assert.strictEqual(sass.compileString(`@use "${module}";`, compileOptions).css, "");
  }
});

test("both stylesheet entrypoints consume the same non-emitting shared modules", () => {
  for (const build of [globalBuild, kbygBuild]) {
    const dependencies = build.loadedUrls.map((url) =>
      path.relative(root, fileURLToPath(url)).replaceAll(path.sep, "/"),
    );
    for (const module of [
      "global/colors.scss",
      "global/_typography-primitives.scss",
      "modules/_button-primitives.scss",
    ]) {
      assert.ok(dependencies.includes(module), `Missing shared dependency ${module}`);
    }
  }
});

test("shared typography emits identical weight and smoothing in global and KBYG contexts", () => {
  const sample = compileSnippet(`
    @use "global/typography-primitives" as type;
    .sample {
      font-weight: type.$body-weight;
      @include type.font-smoothing;
    }
  `);
  const expected = {
    "font-weight": "450",
    "-webkit-font-smoothing": "antialiased",
    "-moz-osx-font-smoothing": "grayscale",
  };
  assert.deepEqual(declarationsFor(sample, ".sample"), expected);
  for (const declarations of [
    declarationsFor(globalCss, "body", "font-weight"),
    declarationsFor(kbygCss, ".kbyg-page > main", "font-weight"),
  ]) {
    for (const [property, value] of Object.entries(expected)) {
      assert.strictEqual(declarations[property], value);
    }
  }
  assert.strictEqual(
    declarationsFor(kbygCss, ".kbyg-page > main")["font-family"],
    '"Avenir Next Variable", "Avenir Next", Avenir, sans-serif',
  );
});

test("shared button tokens and active effect match both consumers without changing geometry", () => {
  const sample = compileSnippet(`
    @use "modules/button-primitives" as button;
    .effect {
      border-radius: button.$pill-radius;
      background-color: button.$overlay-color;
      transform: scale(button.$overlay-scale);
      transition: all button.$overlay-duration ease;
    }
    .active { @include button.overlay-active; }
  `);
  const effect = declarationsFor(sample, ".effect");
  assert.deepEqual(effect, {
    "border-radius": "100px",
    "background-color": "#fff",
    transform: "scale(0.2)",
    transition: "all 200ms ease",
  });
  const globalOverlay = declarationsFor(globalCss, ".button::after");
  const kbygOverlay = declarationsFor(kbygCss, ".kbyg-page .kbyg-button::after");
  for (const property of ["background-color", "transform"]) {
    assert.strictEqual(globalOverlay[property], effect[property]);
    assert.strictEqual(kbygOverlay[property], effect[property]);
  }
  assert.strictEqual(globalOverlay["border-radius"], effect["border-radius"]);
  assert.strictEqual(globalOverlay.transition, effect.transition);
  assert.strictEqual(kbygOverlay.transition, "transform 200ms ease, opacity 200ms ease");
  assert.strictEqual(globalOverlay.top, "0");
  assert.strictEqual(globalOverlay.left, "0");
  assert.strictEqual(globalOverlay.width, "100%");
  assert.strictEqual(globalOverlay.height, "100%");
  assert.strictEqual(kbygOverlay.inset, "0");
  assert.strictEqual(kbygOverlay["border-radius"], "inherit");
  assert.strictEqual(
    declarationsFor(kbygCss, ".kbyg-page .kbyg-button")["border-radius"],
    effect["border-radius"],
  );

  const active = declarationsFor(sample, ".active");
  assert.deepEqual(active, { opacity: "0.25", transform: "none" });
  for (const [css, selector] of [
    [globalCss, ".button:hover::after"],
    [globalCss, ".button:focus::after"],
    [kbygCss, ".kbyg-page .kbyg-button:hover::after"],
    [kbygCss, ".kbyg-page .kbyg-button:focus::after"],
  ] as const) {
    assert.deepEqual(declarationsFor(css, selector), active);
  }
});

test("all existing industry palette aliases and KBYG runtime accent fallbacks remain intact", () => {
  const industries = {
    primary: "#0284c7",
    "primary-dark": "#0273ad",
    healthcare: "#25948a",
    "healthcare-dark": "#1f7a72",
    environmental: "#57993d",
    "environmental-dark": "#498033",
    sales: "#bf3048",
    "sales-dark": "#a6293e",
    hr: "#8b49a6",
    "hr-dark": "#763e8c",
    legal: "#bf7830",
    "legal-dark": "#a66829",
  };
  const sample = compileSnippet(`
    @use "global/colors";
    .palette {
      ${Object.keys(industries)
        .map((name) => `--${name}: #{colors.$${name}};`)
        .join("\n")}
    }
  `);
  assert.deepEqual(
    declarationsFor(sample, ".palette"),
    Object.fromEntries(Object.entries(industries).map(([name, value]) => [`--${name}`, value])),
  );
  const theme = declarationsFor(kbygCss, ".kbyg-page");
  assert.strictEqual(theme["--kbyg-accent"], `var(--accent, ${industries.healthcare})`);
  assert.strictEqual(
    theme["--kbyg-accent-dark"],
    `var(--accent-dark, ${industries["healthcare-dark"]})`,
  );
  assert.strictEqual(theme["--kbyg-line"], "#d2d2d7");
  assert.strictEqual(theme["--kbyg-ink"], "#3f3f47");
  assert.strictEqual(theme["--kbyg-muted"], "#62626c");
});

test("shared dependencies introduce no unscoped rules or keyframes into the KBYG build", () => {
  kbygCss.walkAtRules(/keyframes$/i, (rule) => {
    assert.match(rule.params, /^kbyg-/);
  });
  kbygCss.walkRules((rule) => {
    for (let parent: AnyNode | undefined = rule.parent; parent; parent = parent.parent) {
      if (parent.type === "atrule" && /keyframes$/i.test(parent.name)) return;
    }
    selectorParser((selectors) => {
      selectors.each((selector) => {
        const first = selector.nodes.find((node) => node.type !== "comment");
        if (first?.type !== "class") throw new Error(`Unscoped selector: ${selector.toString()}`);
        assert.strictEqual(first.value, "kbyg-page", `Unscoped selector: ${selector.toString()}`);
      });
    }).processSync(rule.selector);
  });
});
