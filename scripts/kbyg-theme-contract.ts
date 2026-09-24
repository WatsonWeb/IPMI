import postcss, { type AtRule, type Declaration, type Root } from "postcss";

interface CmsColorBinding {
  path?: unknown;
  type?: unknown;
}
interface StylesheetImport {
  source: string;
  stylesheet: Root;
  rule: AtRule;
}
interface ThemeDeclaration {
  binding: CmsColorBinding | null | undefined;
  selector: string | undefined;
  source: string;
  stylesheet: Root;
  declaration: Declaration;
}
function parseBinding(encoded: string): CmsColorBinding | null {
  const value: unknown = JSON.parse(encoded.replace(/&quot;/g, '"').replace(/\\\}/g, "}"));
  if (value === null || typeof value !== "object" || Array.isArray(value)) return null;
  return {
    path: "path" in value ? value.path : undefined,
    type: "type" in value ? value.type : undefined,
  };
}

const accentFields = new Map([
  ["--kbyg-accent", "institute:global-institute-accent-color"],
  ["--kbyg-accent-dark", "institute:global-institute-dark-accent-color"],
]);

const withoutComments = (html: string): string =>
  html.replace(/<!--[\s\S]*?-->/g, (comment) => " ".repeat(comment.length));
const attribute = (tag: string, name: string): string =>
  new RegExp(`\\s${name}\\s*=\\s*(["'])([\\s\\S]*?)\\1`, "i").exec(tag)?.[2] ?? "";
const stylePattern = /<style\b[^>]*>([\s\S]*?)<\/style\s*>/gi;

export function validateKbygThemeContract(
  headHtml: string,
  templateHtml: string,
  embedHtml = "",
): string[] {
  const failures: string[] = [];
  const sources = [
    { name: "head", html: withoutComments(headHtml) },
    { name: "scaffold", html: withoutComments(templateHtml) },
    { name: "Styles Embed", html: withoutComments(embedHtml) },
  ];
  const imports: StylesheetImport[] = [];
  const declarations = new Map<string, ThemeDeclaration[]>(
    [...accentFields.keys()].map((property) => [property, []]),
  );

  for (const source of sources) {
    const stylesheetLinks = [...source.html.matchAll(/<link\b[^>]*>/gi)].filter(([tag]) =>
      /(?:^|\/)ipmi-kbyg-styles\.css(?:[?#]|$)/i.test(attribute(tag, "href")),
    );
    if (stylesheetLinks.length) {
      failures.push(
        `Remove the KBYG CSS link from the ${source.name}; the Styles Embed owns its import.`,
      );
    }

    const styles = [...source.html.matchAll(stylePattern)];
    if (source.name === "Styles Embed") {
      if (/<script\b/i.test(source.html)) {
        failures.push("The Styles Embed must remain script-free for the Webflow Designer canvas.");
      }
      if (styles.length !== 1 || source.html.replace(stylePattern, "").trim()) {
        failures.push("The Styles Embed must contain exactly one CSS-only <style> block.");
      }
    }

    for (const style of styles) {
      const bindings = new Map<string, CmsColorBinding | null>();
      const css = (style[1] ?? "").replace(
        /\{\{wf\s+([\s\S]*?)\}\}/g,
        (_match: string, encoded: string) => {
          const token = `__kbyg_binding_${bindings.size}__`;
          try {
            bindings.set(token, parseBinding(encoded));
          } catch {
            bindings.set(token, null);
          }
          return token;
        },
      );

      try {
        const stylesheet = postcss.parse(css);
        stylesheet.walkAtRules(/^import$/i, (rule) => {
          if (!/\bipmi-kbyg-styles\.css(?:[\s"'?#)]|$)/i.test(rule.params)) return;
          imports.push({ source: source.name, stylesheet, rule });
          if (
            rule.parent !== stylesheet ||
            stylesheet.nodes.find((node) => node.type !== "comment") !== rule
          ) {
            failures.push(
              "The KBYG @import must be first, before all CSS rules in its style block.",
            );
          }
        });
        stylesheet.walkDecls((declaration) => {
          if (!accentFields.has(declaration.prop)) return;
          declarations.get(declaration.prop)?.push({
            binding: bindings.get(declaration.value.trim()),
            selector: declaration.parent?.type === "rule" ? declaration.parent.selector : undefined,
            source: source.name,
            stylesheet,
            declaration,
          });
        });
      } catch {
        failures.push(`The KBYG ${source.name} contains invalid theme CSS.`);
      }
    }
  }

  const stylesheetImport = imports[0];
  if (imports.length !== 1 || stylesheetImport?.source !== "Styles Embed") {
    failures.push("Load the KBYG stylesheet exactly once via @import in the Styles Embed only.");
  }

  for (const [property, field] of accentFields) {
    const matches = declarations.get(property) ?? [];
    const match = matches[0];
    if (
      matches.length !== 1 ||
      match?.source !== "Styles Embed" ||
      match?.selector !== ".kbyg-page" ||
      match?.binding?.path !== field ||
      match?.binding?.type !== "Color"
    ) {
      failures.push(
        `${property} must bind once on .kbyg-page in the Styles Embed to the Institute Color field ${field}.`,
      );
    }
    if (
      imports.length === 1 &&
      stylesheetImport &&
      matches.some(
        ({ stylesheet, declaration }) =>
          stylesheet !== stylesheetImport.stylesheet ||
          (declaration.source?.start?.offset ?? -1) <
            (stylesheetImport.rule.source?.end?.offset ?? Infinity),
      )
    ) {
      failures.push(
        `The CMS ${property} rule must follow the KBYG @import in the same Styles Embed.`,
      );
    }
  }

  const roots = [...withoutComments(templateHtml).matchAll(/<[a-z][\w:-]*\b[^>]*>/gi)].filter(
    ([tag]) => attribute(tag, "class").split(/\s+/).includes("kbyg-page"),
  );
  if (roots.length !== 1) {
    failures.push("The KBYG scaffold must contain exactly one .kbyg-page root.");
  }
  if (roots.some(([tag]) => /--kbyg-accent(?:-dark)?\s*:/i.test(attribute(tag, "style")))) {
    failures.push("Inline scaffold accent values must not override the Institute CMS theme.");
  }
  const instances = [...templateHtml.matchAll(/<!--[\s\S]*?-->/g)].filter(([comment]) =>
    /WEBFLOW CODE EMBED:[\s\S]*\bKBYG-Styles-Embed\.html\b[\s\S]*\bCustom Styles\b/i.test(comment),
  );
  if (
    instances.length !== 1 ||
    roots.length !== 1 ||
    (instances[0]?.index ?? Infinity) > (roots[0]?.index ?? -1)
  ) {
    failures.push("Document exactly one Custom Styles embed instance before the .kbyg-page root.");
  }

  return failures;
}
