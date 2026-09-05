import { assert, test } from "vite-plus/test";

import {
  type StyleCapture,
  acceptedDifferenceReason,
  compareStyleProbes,
  kbygSelectors,
  reviewWidths,
  sampleProperties,
  siteSelectors,
} from "../scripts/compare-style-probes.ts";

function captures(kbyg = false): StyleCapture[] {
  const computed = () =>
    Object.fromEntries(
      sampleProperties.map((property) => [
        property,
        property === "transition"
          ? "transform 0.2s, opacity 0.2s, -webkit-transform 0.2s"
          : "baseline",
      ]),
    );
  return reviewWidths[kbyg ? "kbyg" : "site"].map((width) => ({
    path: kbyg ? "/know-before-you-go/test-sponsor" : "/",
    width,
    scrollWidth: width,
    audience: kbyg ? "sponsor" : null,
    stylesheetUrls: ["http://127.0.0.1:5173/__style-review/legacy/ipmi-custom-styles.css"],
    kbygImports: kbyg
      ? [
          '@import url("/__style-review/legacy/ipmi-kbyg-styles.css");\n.kbyg-page { --kbyg-accent: #25948a; }',
        ]
      : [],
    sections: kbyg
      ? [
          { id: "welcome", width, height: 100 },
          { id: "prepare", width, height: 200 },
        ]
      : [],
    contentOverflow: [],
    samples: (kbyg ? kbygSelectors : siteSelectors).map((selector) => ({
      selector,
      index: 0,
      visible: true,
      size: [width, 100],
      style: computed(),
      before: computed(),
      after: computed(),
    })),
  }));
}

test("complete identical captures pass and only exact classified preview/transition changes are accepted", () => {
  for (const kbyg of [false, true]) {
    const legacy = captures(kbyg);
    assert.strictEqual(compareStyleProbes(legacy, structuredClone(legacy)).passed, true);
    const current = structuredClone(legacy);
    for (const capture of current) {
      capture.stylesheetUrls[0] = "http://127.0.0.1:5173/ipmi-custom-styles.css";
      if (kbyg)
        capture.kbygImports[0] = capture.kbygImports[0].replace("/__style-review/legacy/", "/");
      for (const sample of capture.samples) {
        for (const target of ["style", "before", "after"] as const)
          sample[target].transition = "transform 0.2s, opacity 0.2s";
      }
    }
    const result = compareStyleProbes(legacy, current);
    assert.strictEqual(result.passed, true);
    assert.ok(result.summary.acceptedDifferences > 0);
    assert.strictEqual(result.summary.rawDifferences, result.summary.acceptedDifferences);
    assert.strictEqual(result.summary.unexpectedDifferences, 0);
    assert.ok(result.acceptedDifferences.every((difference) => difference.reason));
  }
});

test("geometry, color, media layout, overflow, section order, and sample order changes fail", () => {
  const legacy = captures(true);
  for (const mutate of [
    (current) => {
      current[0].samples[0].size[0] += 0.01;
    },
    (current) => {
      current[0].samples[0].style.color = "rgb(0, 0, 0)";
    },
    (current) => {
      current[0].samples[0].style["grid-template-columns"] = "1fr 1fr";
    },
    (current) => {
      current[0].scrollWidth += 1;
    },
    (current) => {
      current[0].sections.push({ id: "extra", width: 320, height: 100 });
    },
    (current) => {
      current[0].sections.reverse();
    },
    (current) => {
      current[0].samples.reverse();
    },
    (current) => {
      current.reverse();
    },
    (current) => {
      current[0].samples[0].before.transition = "transform 0.3s, opacity 0.2s";
    },
  ] satisfies ((current: StyleCapture[]) => void)[]) {
    const current = structuredClone(legacy);
    mutate(current);
    const result = compareStyleProbes(legacy, current);
    assert.strictEqual(result.passed, false);
    assert.ok(result.summary.unexpectedDifferences > 0);
  }
});

test("missing captures, samples, properties, and duplicated viewport identities fail coverage checks", () => {
  const legacy = captures();
  for (const mutate of [
    (current) => {
      current.pop();
    },
    (current) => {
      current[0].samples.pop();
    },
    (current) => {
      current[0].samples = [];
    },
    (current) => {
      delete current[0].samples[0].after.color;
    },
    (current) => {
      current[1].width = current[0].width;
    },
    (current) => {
      current[0].path = "/another-page";
    },
  ] satisfies ((current: StyleCapture[]) => void)[]) {
    const current = structuredClone(legacy);
    mutate(current);
    const result = compareStyleProbes(legacy, current);
    assert.strictEqual(result.passed, false);
    assert.ok(result.coverageIssues.length > 0);
  }
  const bothIncomplete = captures().slice(1);
  assert.strictEqual(
    compareStyleProbes(bothIncomplete, structuredClone(bothIncomplete)).passed,
    false,
  );
  assert.strictEqual(compareStyleProbes([], []).passed, false);
});

test("preview path acceptance cannot hide origin, asset, query, CSS, or ordering changes", () => {
  const urlPath = [0, "stylesheetUrls", 0];
  const oldUrl = "http://127.0.0.1:5173/__style-review/legacy/ipmi-custom-styles.css";
  for (const newUrl of [
    "http://127.0.0.1:4173/ipmi-custom-styles.css",
    "https://example.com/ipmi-custom-styles.css",
    "http://127.0.0.1:5173/ipmi-kbyg-styles.css",
    "http://127.0.0.1:5173/ipmi-custom-styles.css?v=2",
  ])
    assert.strictEqual(acceptedDifferenceReason(urlPath, oldUrl, newUrl), null);
  assert.strictEqual(
    acceptedDifferenceReason(
      urlPath,
      "https://example.com/__style-review/legacy/ipmi-custom-styles.css",
      "https://example.com/ipmi-custom-styles.css",
    ),
    null,
  );
  assert.strictEqual(
    acceptedDifferenceReason(
      [0, "samples", 0, "style", "background-image"],
      oldUrl,
      "http://127.0.0.1:5173/ipmi-custom-styles.css",
    ),
    null,
  );
  const oldImport =
    '@import url("/__style-review/legacy/ipmi-kbyg-styles.css");\n.kbyg-page { color: red; }';
  assert.strictEqual(
    acceptedDifferenceReason(
      [0, "kbygImports", 0],
      oldImport,
      '@import url("/ipmi-kbyg-styles.css");\n.kbyg-page { color: blue; }',
    ),
    null,
  );
  const legacy = captures();
  for (const capture of legacy) capture.stylesheetUrls.push("https://example.com/shared.css");
  const current = structuredClone(legacy);
  current[0].stylesheetUrls.reverse();
  assert.strictEqual(compareStyleProbes(legacy, current).passed, false);
});

test("transition alias acceptance is exact and restricted to computed sample transition properties", () => {
  const before = "transform 0.2s, opacity 0.2s, -webkit-transform 0.2s";
  const after = "transform 0.2s, opacity 0.2s";
  for (const target of ["style", "before", "after"]) {
    assert.ok(acceptedDifferenceReason([0, "samples", 0, target, "transition"], before, after));
  }
  assert.strictEqual(
    acceptedDifferenceReason([0, "sections", 0, "style", "transition"], before, after),
    null,
  );
  assert.strictEqual(
    acceptedDifferenceReason([0, "samples", 0, "style", "color"], before, after),
    null,
  );
  for (const changed of [
    "opacity 0.2s, transform 0.2s",
    "transform 0.2s ease-in, opacity 0.2s",
    `${after}, color 0.2s`,
    `${after} `,
  ]) {
    assert.strictEqual(
      acceptedDifferenceReason([0, "samples", 0, "style", "transition"], before, changed),
      null,
    );
  }
});
