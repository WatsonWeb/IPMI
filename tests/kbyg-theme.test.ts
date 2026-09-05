import { readFile } from "node:fs/promises";

import { assert, test } from "vite-plus/test";

import { validateKbygThemeContract } from "../scripts/kbyg-theme-contract.ts";

const stylesheetLink =
  '<link rel="stylesheet" href="https://cdn.example.test/ipmi-kbyg-styles.css" />';
const stylesheetImport = '@import url("https://cdn.example.test/ipmi-kbyg-styles.css");';
const cmsRules = String.raw`
  .kbyg-page {
    --kbyg-accent: {{wf {&quot;path&quot;:&quot;institute:global-institute-accent-color&quot;,&quot;type&quot;:&quot;Color&quot;\} }};
    --kbyg-accent-dark: {{wf {&quot;path&quot;:&quot;institute:global-institute-dark-accent-color&quot;,&quot;type&quot;:&quot;Color&quot;\} }};
  }`;
const embed = `<style>${stylesheetImport}${cmsRules}</style>`;
const instance =
  "<!-- WEBFLOW CODE EMBED: one KBYG-Styles-Embed.html instance, class Custom Styles. -->";
const root = '<div class="kbyg-page" data-audience="sponsor"><main></main></div>';
const template = instance + root;
const errorsFor = (head = "", scaffold = template, stylesEmbed = embed) =>
  validateKbygThemeContract(head, scaffold, stylesEmbed).join("\n");

test("the shipped CSS-only Styles Embed preserves the Institute accent cascade", async () => {
  const [head, scaffold, stylesEmbed] = await Promise.all([
    readFile(new URL("../Page HTML/KBYG Pages/KBYG-Head.html", import.meta.url), "utf8"),
    readFile(new URL("../Page HTML/KBYG Pages/KBYG-Template.html", import.meta.url), "utf8"),
    readFile(new URL("../Page HTML/KBYG Pages/KBYG-Styles-Embed.html", import.meta.url), "utf8"),
  ]);

  assert.deepEqual(validateKbygThemeContract(head, scaffold, stylesEmbed), []);
});

test("exactly one KBYG import belongs in the Styles Embed, with no duplicate CSS links", () => {
  assert.strictEqual(errorsFor(), "");
  assert.match(errorsFor("", template, `<style>${cmsRules}</style>`), /exactly once via @import/);
  assert.match(
    errorsFor("", template, embed.replace(stylesheetImport, stylesheetImport.repeat(2))),
    /exactly once via @import/,
  );
  assert.match(errorsFor(`<style>${stylesheetImport}</style>`), /exactly once via @import/);
  assert.match(
    errorsFor("", template + `<style>${stylesheetImport}</style>`),
    /exactly once via @import/,
  );
  assert.match(errorsFor(embed, template, ""), /Styles Embed only/);
  for (const [head, scaffold, stylesEmbed] of [
    [stylesheetLink, template, embed],
    ["", template + stylesheetLink, embed],
    ["", template, stylesheetLink + embed],
  ]) {
    assert.match(errorsFor(head, scaffold, stylesEmbed), /Remove the KBYG CSS link/);
  }
});

test("the import must precede all rules and both CMS declarations in the same style block", () => {
  assert.match(
    errorsFor("", template, `<style>${cmsRules}${stylesheetImport}</style>`),
    /@import must be first/,
  );
  assert.match(
    errorsFor("", template, `<style>.other { color: red; }${stylesheetImport}${cmsRules}</style>`),
    /@import must be first/,
  );
  assert.match(
    errorsFor("", template, `<style>@media screen { ${stylesheetImport} }${cmsRules}</style>`),
    /@import must be first/,
  );
  assert.match(
    errorsFor("", template, `<style>${stylesheetImport}</style><style>${cmsRules}</style>`),
    /same Styles Embed/,
  );
  assert.match(
    errorsFor(`<style>${cmsRules}</style>`, template, `<style>${stylesheetImport}</style>`),
    /in the Styles Embed/,
  );
  assert.strictEqual(
    errorsFor(
      "",
      template,
      `<style>/* Import first, ignoring comments. */${stylesheetImport}${cmsRules}</style>`,
    ),
    "",
  );
});

test("both accent variables must use the matching Institute CMS Color fields", () => {
  for (const field of ["global-institute-accent-color", "global-institute-dark-accent-color"]) {
    assert.match(
      errorsFor("", template, embed.replace(`institute:${field}`, `another-reference:${field}`)),
      /Color field/,
    );
  }
  assert.match(
    errorsFor("", template, embed.replaceAll("&quot;Color&quot;", "&quot;PlainText&quot;")),
    /Color field/,
  );
  assert.match(errorsFor("", template, `<style>${stylesheetImport}</style>`), /Color field/);
  assert.match(errorsFor("", template, embed.replace(".kbyg-page", ":root")), /on \.kbyg-page/);
});

test("the Styles Embed must remain script-free and CSS-only for Designer", () => {
  assert.match(errorsFor("", template, embed + "<script>void 0;</script>"), /script-free/);
  assert.match(errorsFor("", template, `<div>${embed}</div>`), /CSS-only/);
  assert.match(
    errorsFor("", template, embed + "<style>.extra { color: red; }</style>"),
    /exactly one CSS-only/,
  );
  assert.strictEqual(errorsFor("", template, `<!-- Scripts belong in the footer. -->${embed}`), "");
});

test("the scaffold documents one Custom Styles instance before its root", () => {
  assert.match(errorsFor("", root), /exactly one Custom Styles/);
  assert.match(errorsFor("", instance + template), /exactly one Custom Styles/);
  assert.match(errorsFor("", root + instance), /before the \.kbyg-page root/);
});

test("demo inline accents cannot override the CMS theme on the scaffold root", () => {
  for (const property of ["--kbyg-accent", "--kbyg-accent-dark"]) {
    const hardcoded = template.replace(
      'class="kbyg-page"',
      `class="kbyg-page" style="${property}: #25948a"`,
    );
    assert.match(errorsFor("", hardcoded), /Inline scaffold/);
  }
  const documented = `<!-- Example: <div class="kbyg-page" style="--kbyg-accent: #25948a"> -->${template}`;
  assert.strictEqual(errorsFor("", documented), "");
});
