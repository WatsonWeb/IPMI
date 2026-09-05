import expected from "./fixtures/style-baseline.json" with { type: "json" };

import { assert, test } from "vite-plus/test";

import {
  assertCaptureSource,
  baselineStylesheetNames,
  captureStyleBaseline,
  compareStyleBaselines,
  cssFingerprint,
  orderedCssTree,
} from "../scripts/style-baseline.ts";

test("both emitted stylesheets and the in-memory global build retain their pre-cleanup baselines", async () => {
  const actual = await captureStyleBaseline();
  assert.deepEqual(compareStyleBaselines(expected, actual), []);
  assert.strictEqual(expected.legacyGlobalArtifactDiffersFromModernBuild, true);
});

test("the baseline catches artifact and source-build mutations independently", () => {
  for (const name of baselineStylesheetNames) {
    const mutated = structuredClone(expected);
    mutated.stylesheets[name] = cssFingerprint(".changed { color: red; }");
    const failures = compareStyleBaselines(expected, mutated);
    assert.ok(failures.some((message) => message.startsWith(`${name}: expected`)));
    assert.ok(
      failures.some((message) =>
        message.includes(`${name}: ordered CSS tree changed at top-level node 1`),
      ),
    );
  }
});

test("ordered CSS diagnostics retain cascade order, duplicate fallbacks, important flags, and media contexts", () => {
  const baseline =
    ".a { color: red; color: blue; } @media (max-width: 479px) { .b { display: block !important; } }";
  for (const mutation of [
    ".a { color: blue; color: red; } @media (max-width: 479px) { .b { display: block !important; } }",
    ".a { color: blue; } @media (max-width: 479px) { .b { display: block !important; } }",
    "@media (max-width: 479px) { .b { display: block !important; } } .a { color: red; color: blue; }",
    ".a { color: red; color: blue; } @media (max-width: 767px) { .b { display: block !important; } }",
    ".a { color: red; color: blue; } @media (max-width: 479px) { .b { display: block; } }",
  ]) {
    assert.notDeepEqual(orderedCssTree(baseline), orderedCssTree(mutation));
  }
});

test("byte checks catch formatting changes even when the rendering tree is unchanged", () => {
  const before = cssFingerprint(".a { color: red; }");
  const after = cssFingerprint("/* changed */\n.a{color:red}");
  assert.strictEqual(before.orderedAstSha256, after.orderedAstSha256);
  assert.notStrictEqual(before.sha256, after.sha256);
});

test("capture refuses missing or abbreviated confirmation instead of silently refreshing baselines", () => {
  for (const confirmation of [undefined, "", "HEAD", "45f76b4"]) {
    assert.throws(() => assertCaptureSource(confirmation), /full 40-character HEAD SHA/);
  }
});
