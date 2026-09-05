import { readFile } from "node:fs/promises";

import postcss, { type AnyNode, type Declaration, type Rule } from "postcss";
import { assert, test } from "vite-plus/test";

const stylesheet = postcss.parse(
  await readFile(new URL("../ipmi-kbyg-styles.css", import.meta.url), "utf8"),
);
const nativeCard = ".kbyg-page .kbyg-icon-card:has(> img.kbyg-icon-card__icon)";
const nativeAgenda =
  ".kbyg-page .kbyg-agenda-card .kbyg-rich-text p:not(.kbyg-agenda-card__row):has(> strong:first-child)";

function mediaFor(rule: Rule): string {
  const conditions: string[] = [];
  for (let parent: AnyNode | undefined = rule.parent; parent; parent = parent.parent) {
    if (parent.type === "atrule" && parent.name === "media") conditions.unshift(parent.params);
  }
  return conditions.join(" && ");
}

function declarationsFor(selector: string, media = ""): Map<string, Declaration> {
  const declarations = new Map<string, Declaration>();
  let matches = 0;
  stylesheet.walkRules((rule) => {
    if (!rule.selectors.includes(selector) || mediaFor(rule) !== media) return;
    matches += 1;
    rule.walkDecls((declaration) => {
      declarations.set(declaration.prop, declaration);
    });
  });
  assert.ok(matches, `Missing compiled Designer rule: ${selector} (${media || "all widths"})`);
  return declarations;
}

function value(declarations: Map<string, Declaration>, property: string): string {
  assert.ok(declarations.has(property), `Missing CSS declaration: ${property}`);
  const declaration = declarations.get(property);
  assert.isDefined(declaration);
  return declaration.value;
}

test("the CSS-only hidden-form wrapper guard overrides the mobile flex layout", () => {
  const wrapper = ".kbyg-page .kbyg-jump__select-wrap";
  const guard = declarationsFor(`${wrapper}:has(> [data-kbyg-jump-form].w-condition-invisible)`);
  assert.strictEqual(value(guard, "display"), "none");
  assert.strictEqual(guard.get("display")?.important, true);

  const mobile = declarationsFor(wrapper, "screen and (max-width: 991px)");
  assert.strictEqual(value(mobile, "display"), "flex");
  assert.notStrictEqual(mobile.get("display")?.important, true);

  const emptiedByRuntime = declarationsFor(
    `${wrapper}:not([data-kbyg-jump-form]):not(:has([data-kbyg-jump-form]))`,
  );
  assert.strictEqual(value(emptiedByRuntime, "display"), "none");
  assert.strictEqual(emptiedByRuntime.get("display")?.important, true);
});

test("native sponsor industry badges receive the same full SVG treatment before runtime enhancement", () => {
  for (const badge of [
    ".kbyg-page .kbyg-hero__badge[data-kbyg-audience-branch=sponsor]",
    ".kbyg-page .kbyg-hero__badge.kbyg-hero__badge--industry",
  ]) {
    assert.strictEqual(value(declarationsFor(badge), "background"), "transparent");
    const image = declarationsFor(`${badge} img`);
    assert.strictEqual(value(image, "width"), "100%");
    assert.strictEqual(value(image, "height"), "100%");
    assert.strictEqual(
      image.has("filter"),
      false,
      "Branded artwork must not receive the white glyph filter.",
    );
  }
});

test("native agenda layout is gated away from enhanced rows and stacks below 1200px", () => {
  const desktop = declarationsFor(nativeAgenda);
  assert.strictEqual(value(desktop, "display"), "grid");
  assert.strictEqual(value(desktop, "grid-template-columns"), "146px minmax(0, 1fr)");
  assert.strictEqual(value(desktop, "overflow-wrap"), "anywhere");
  assert.strictEqual(
    value(declarationsFor(`${nativeAgenda} > strong:first-child`), "text-align"),
    "right",
  );

  const narrowQuery = "screen and (max-width: 1199px)";
  const narrow = declarationsFor(nativeAgenda, narrowQuery);
  assert.strictEqual(value(narrow, "grid-template-columns"), "minmax(0, 1fr)");
  assert.strictEqual(value(narrow, "gap"), "4px");
  assert.strictEqual(value(narrow, "font-size"), "16px");
  assert.strictEqual(value(narrow, "line-height"), "24px");
  assert.strictEqual(
    value(declarationsFor(`${nativeAgenda} > strong:first-child`, narrowQuery), "text-align"),
    "left",
  );

  stylesheet.walkRules((rule) => {
    for (const selector of rule.selectors) {
      if (!selector.includes(".kbyg-agenda-card .kbyg-rich-text p") || !selector.includes(":has("))
        continue;
      assert.ok(
        selector.includes(":not(.kbyg-agenda-card__row)"),
        `Native fallback leaks into runtime rows: ${selector}`,
      );
    }
  });
});

test("native card glyph filters stay separate from the industry-colored circle and runtime wrappers", () => {
  const card = declarationsFor(nativeCard);
  assert.strictEqual(card.has("filter"), false);
  const circle = declarationsFor(`${nativeCard}::before`);
  assert.strictEqual(
    value(circle, "background"),
    "linear-gradient(180deg, var(--kbyg-accent), var(--kbyg-accent-dark))",
  );
  assert.strictEqual(value(circle, "border-radius"), "50%");
  assert.strictEqual(value(circle, "width"), "var(--kbyg-native-icon-size)");
  assert.strictEqual(value(circle, "height"), "var(--kbyg-native-icon-size)");
  assert.strictEqual(value(circle, "pointer-events"), "none");
  assert.strictEqual(
    circle.has("filter"),
    false,
    "The colored circle must not be whitened with its glyph.",
  );

  const image = declarationsFor(`${nativeCard} > img.kbyg-icon-card__icon`);
  assert.strictEqual(value(image, "background"), "transparent");
  assert.strictEqual(value(image, "filter"), "brightness(0) invert(1)");
  assert.strictEqual(value(image, "object-fit"), "contain");
  assert.strictEqual(value(image, "padding"), "calc(var(--kbyg-native-icon-size) / 4)");

  stylesheet.walkDecls(/^--kbyg-native-icon-/, (declaration) => {
    assert.strictEqual(declaration.parent?.type, "rule");
    if (declaration.parent?.type !== "rule") throw new Error("Expected a rule parent.");
    for (const selector of declaration.parent.selectors) {
      assert.ok(
        selector.includes(":has(> img.kbyg-icon-card__icon)"),
        `Native fallback must not affect runtime wrappers: ${selector}`,
      );
    }
  });
});

test("native card circles preserve responsive desktop, tablet, and phone geometry", () => {
  const desktop = declarationsFor(nativeCard);
  assert.strictEqual(value(desktop, "--kbyg-native-icon-size"), "88px");
  assert.strictEqual(value(desktop, "--kbyg-native-icon-top"), "-45px");
  assert.strictEqual(value(desktop, "--kbyg-native-icon-left"), "27px");

  const tablet = declarationsFor(nativeCard, "screen and (max-width: 991px)");
  assert.strictEqual(value(tablet, "--kbyg-native-icon-size"), "70px");
  assert.strictEqual(value(tablet, "--kbyg-native-icon-top"), "-35px");

  const phoneQuery = "screen and (max-width: 479px)";
  assert.strictEqual(
    value(declarationsFor(nativeCard, phoneQuery), "--kbyg-native-icon-left"),
    "25px",
  );
  const sponsorPhone = declarationsFor(
    ".kbyg-page[data-audience=sponsor] #prepare .kbyg-icon-card:has(> img.kbyg-icon-card__icon)",
    phoneQuery,
  );
  assert.strictEqual(value(sponsorPhone, "--kbyg-native-icon-left"), "28px");
});
