import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

import { test } from "vite-plus/test";

import { validateKbygThemeContract } from "../scripts/kbyg-theme-contract.mjs";

const stylesheet = '<link rel="stylesheet" href="https://cdn.example.test/ipmi-kbyg-styles.css" />';
const cmsStyle = String.raw`<style>
  .kbyg-page {
    --kbyg-accent: {{wf {&quot;path&quot;:&quot;institute:global-institute-accent-color&quot;,&quot;type&quot;:&quot;Color&quot;\} }};
    --kbyg-accent-dark: {{wf {&quot;path&quot;:&quot;institute:global-institute-dark-accent-color&quot;,&quot;type&quot;:&quot;Color&quot;\} }};
  }
</style>`;
const template = '<div class="kbyg-page" data-audience="sponsor"><main></main></div>';

test("the shipped KBYG head and scaffold preserve the referenced Institute accent cascade", async () => {
  const [head, scaffold] = await Promise.all([
    readFile(new URL("../Page HTML/KBYG Pages/KBYG-Head.html", import.meta.url), "utf8"),
    readFile(new URL("../Page HTML/KBYG Pages/KBYG-Template.html", import.meta.url), "utf8"),
  ]);

  assert.deepEqual(validateKbygThemeContract(head, scaffold), []);
});

test("CMS theme declarations must follow exactly one KBYG stylesheet", () => {
  assert.deepEqual(validateKbygThemeContract(stylesheet + cmsStyle, template), []);
  assert.match(
    validateKbygThemeContract(cmsStyle + stylesheet, template).join("\n"),
    /before the CMS/,
  );
  for (const links of ["", stylesheet + stylesheet]) {
    assert.match(validateKbygThemeContract(links + cmsStyle, template).join("\n"), /exactly once/);
  }
});

test("both accent variables must use the matching Institute CMS Color fields", () => {
  for (const field of ["global-institute-accent-color", "global-institute-dark-accent-color"]) {
    const wrongField = cmsStyle.replace(`institute:${field}`, `another-reference:${field}`);
    assert.match(
      validateKbygThemeContract(stylesheet + wrongField, template).join("\n"),
      /Color field/,
    );
  }
  const wrongType = cmsStyle.replaceAll("&quot;Color&quot;", "&quot;PlainText&quot;");
  assert.match(
    validateKbygThemeContract(stylesheet + wrongType, template).join("\n"),
    /Color field/,
  );
  assert.match(validateKbygThemeContract(stylesheet, template).join("\n"), /Color field/);
  const unscoped = cmsStyle.replace(".kbyg-page", ":root");
  assert.match(
    validateKbygThemeContract(stylesheet + unscoped, template).join("\n"),
    /on \.kbyg-page/,
  );
});

test("demo inline accents cannot override the CMS theme on the scaffold root", () => {
  for (const property of ["--kbyg-accent", "--kbyg-accent-dark"]) {
    const hardcoded = template.replace(
      'class="kbyg-page"',
      `class="kbyg-page" style="${property}: #25948a"`,
    );
    assert.match(
      validateKbygThemeContract(stylesheet + cmsStyle, hardcoded).join("\n"),
      /Inline scaffold/,
    );
  }
  const documented = `<!-- Example: <div class="kbyg-page" style="--kbyg-accent: #25948a"> -->${template}`;
  assert.deepEqual(validateKbygThemeContract(stylesheet + cmsStyle, documented), []);
});
