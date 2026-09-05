import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

import postcss from "postcss";
import { test } from "vite-plus/test";

const stylesheet = postcss.parse(
  await readFile(new URL("../ipmi-kbyg-styles.css", import.meta.url), "utf8"),
);
const nativeCard = ".kbyg-page .kbyg-icon-card:has(> img.kbyg-icon-card__icon)";
const nativeAgenda =
  ".kbyg-page .kbyg-agenda-card .kbyg-rich-text p:not(.kbyg-agenda-card__row):has(> strong:first-child)";

function mediaFor(rule) {
  const conditions = [];
  for (let parent = rule.parent; parent; parent = parent.parent) {
    if (parent.type === "atrule" && parent.name === "media") conditions.unshift(parent.params);
  }
  return conditions.join(" && ");
}

function declarationsFor(selector, media = "") {
  const declarations = new Map();
  let matches = 0;
  stylesheet.walkRules((rule) => {
    if (!rule.selectors.includes(selector) || mediaFor(rule) !== media) return;
    matches += 1;
    rule.walkDecls((declaration) => declarations.set(declaration.prop, declaration));
  });
  assert.ok(matches, `Missing compiled Designer rule: ${selector} (${media || "all widths"})`);
  return declarations;
}

function value(declarations, property) {
  assert.ok(declarations.has(property), `Missing CSS declaration: ${property}`);
  return declarations.get(property).value;
}

test("the CSS-only hidden-form wrapper guard overrides the mobile flex layout", () => {
  const wrapper = ".kbyg-page .kbyg-jump__select-wrap";
  const guard = declarationsFor(`${wrapper}:has(> [data-kbyg-jump-form].w-condition-invisible)`);
  assert.equal(value(guard, "display"), "none");
  assert.equal(guard.get("display").important, true);

  const mobile = declarationsFor(wrapper, "screen and (max-width: 991px)");
  assert.equal(value(mobile, "display"), "flex");
  assert.notEqual(mobile.get("display").important, true);

  const emptiedByRuntime = declarationsFor(
    `${wrapper}:not([data-kbyg-jump-form]):not(:has([data-kbyg-jump-form]))`,
  );
  assert.equal(value(emptiedByRuntime, "display"), "none");
  assert.equal(emptiedByRuntime.get("display").important, true);
});

test("native sponsor industry badges receive the same full SVG treatment before runtime enhancement", () => {
  for (const badge of [
    ".kbyg-page .kbyg-hero__badge[data-kbyg-audience-branch=sponsor]",
    ".kbyg-page .kbyg-hero__badge.kbyg-hero__badge--industry",
  ]) {
    assert.equal(value(declarationsFor(badge), "background"), "transparent");
    const image = declarationsFor(`${badge} img`);
    assert.equal(value(image, "width"), "100%");
    assert.equal(value(image, "height"), "100%");
    assert.equal(
      image.has("filter"),
      false,
      "Branded artwork must not receive the white glyph filter.",
    );
  }
});

test("native agenda layout is gated away from enhanced rows and stacks below 1200px", () => {
  const desktop = declarationsFor(nativeAgenda);
  assert.equal(value(desktop, "display"), "grid");
  assert.equal(value(desktop, "grid-template-columns"), "146px minmax(0, 1fr)");
  assert.equal(value(desktop, "overflow-wrap"), "anywhere");
  assert.equal(
    value(declarationsFor(`${nativeAgenda} > strong:first-child`), "text-align"),
    "right",
  );

  const narrowQuery = "screen and (max-width: 1199px)";
  const narrow = declarationsFor(nativeAgenda, narrowQuery);
  assert.equal(value(narrow, "grid-template-columns"), "minmax(0, 1fr)");
  assert.equal(value(narrow, "gap"), "4px");
  assert.equal(value(narrow, "font-size"), "16px");
  assert.equal(value(narrow, "line-height"), "24px");
  assert.equal(
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
  assert.equal(card.has("filter"), false);
  const circle = declarationsFor(`${nativeCard}::before`);
  assert.equal(
    value(circle, "background"),
    "linear-gradient(180deg, var(--kbyg-accent), var(--kbyg-accent-dark))",
  );
  assert.equal(value(circle, "border-radius"), "50%");
  assert.equal(value(circle, "width"), "var(--kbyg-native-icon-size)");
  assert.equal(value(circle, "height"), "var(--kbyg-native-icon-size)");
  assert.equal(value(circle, "pointer-events"), "none");
  assert.equal(
    circle.has("filter"),
    false,
    "The colored circle must not be whitened with its glyph.",
  );

  const image = declarationsFor(`${nativeCard} > img.kbyg-icon-card__icon`);
  assert.equal(value(image, "background"), "transparent");
  assert.equal(value(image, "filter"), "brightness(0) invert(1)");
  assert.equal(value(image, "object-fit"), "contain");
  assert.equal(value(image, "padding"), "calc(var(--kbyg-native-icon-size) / 4)");

  stylesheet.walkDecls(/^--kbyg-native-icon-/, (declaration) => {
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
  assert.equal(value(desktop, "--kbyg-native-icon-size"), "88px");
  assert.equal(value(desktop, "--kbyg-native-icon-top"), "-45px");
  assert.equal(value(desktop, "--kbyg-native-icon-left"), "27px");

  const tablet = declarationsFor(nativeCard, "screen and (max-width: 991px)");
  assert.equal(value(tablet, "--kbyg-native-icon-size"), "70px");
  assert.equal(value(tablet, "--kbyg-native-icon-top"), "-35px");

  const phoneQuery = "screen and (max-width: 479px)";
  assert.equal(value(declarationsFor(nativeCard, phoneQuery), "--kbyg-native-icon-left"), "25px");
  const sponsorPhone = declarationsFor(
    ".kbyg-page[data-audience=sponsor] #prepare .kbyg-icon-card:has(> img.kbyg-icon-card__icon)",
    phoneQuery,
  );
  assert.equal(value(sponsorPhone, "--kbyg-native-icon-left"), "28px");
});
