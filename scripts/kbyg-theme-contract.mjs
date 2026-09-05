import postcss from "postcss";

const accentFields = new Map([
  ["--kbyg-accent", "institute:global-institute-accent-color"],
  ["--kbyg-accent-dark", "institute:global-institute-dark-accent-color"],
]);

const withoutComments = (html) => html.replace(/<!--[\s\S]*?-->/g, "");
const attribute = (tag, name) =>
  new RegExp(`\\s${name}\\s*=\\s*(["'])([\\s\\S]*?)\\1`, "i").exec(tag)?.[2] ?? "";

export function validateKbygThemeContract(headHtml, templateHtml) {
  const failures = [];
  const head = withoutComments(headHtml);
  const template = withoutComments(templateHtml);
  const stylesheets = [...head.matchAll(/<link\b[^>]*>/gi)].filter(
    ([tag]) =>
      attribute(tag, "rel").toLowerCase().split(/\s+/).includes("stylesheet") &&
      /(?:^|\/)ipmi-kbyg-styles\.css(?:[?#]|$)/i.test(attribute(tag, "href")),
  );

  if (stylesheets.length !== 1) {
    failures.push("The KBYG head must load ipmi-kbyg-styles.css exactly once.");
  }

  const declarations = new Map([...accentFields.keys()].map((property) => [property, []]));
  for (const style of head.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style\s*>/gi)) {
    const bindings = new Map();
    const css = style[1].replace(/\{\{wf\s+([\s\S]*?)\}\}/g, (_, encoded) => {
      const token = `__kbyg_binding_${bindings.size}__`;
      try {
        bindings.set(token, JSON.parse(encoded.replace(/&quot;/g, '"').replace(/\\\}/g, "}")));
      } catch {
        bindings.set(token, null);
      }
      return token;
    });

    try {
      postcss.parse(css).walkDecls((declaration) => {
        if (!accentFields.has(declaration.prop)) return;
        declarations.get(declaration.prop).push({
          binding: bindings.get(declaration.value.trim()),
          selector: declaration.parent.selector,
          index: style.index,
        });
      });
    } catch {
      failures.push("The KBYG head contains invalid theme CSS.");
    }
  }

  for (const [property, field] of accentFields) {
    const matches = declarations.get(property);
    if (
      matches.length !== 1 ||
      matches[0].selector !== ".kbyg-page" ||
      matches[0].binding?.path !== field ||
      matches[0].binding?.type !== "Color"
    ) {
      failures.push(
        `${property} must bind once on .kbyg-page to the Institute Color field ${field}.`,
      );
    }
    if (stylesheets.length === 1 && matches.some(({ index }) => index < stylesheets[0].index)) {
      failures.push(
        `Load the KBYG stylesheet before the CMS ${property} rule so defaults cannot win.`,
      );
    }
  }

  const roots = [...template.matchAll(/<[a-z][\w:-]*\b[^>]*>/gi)].filter(([tag]) =>
    attribute(tag, "class").split(/\s+/).includes("kbyg-page"),
  );
  if (roots.length !== 1) {
    failures.push("The KBYG scaffold must contain exactly one .kbyg-page root.");
  }
  if (roots.some(([tag]) => /--kbyg-accent(?:-dark)?\s*:/i.test(attribute(tag, "style")))) {
    failures.push("Inline scaffold accent values must not override the Institute CMS theme.");
  }

  return failures;
}
