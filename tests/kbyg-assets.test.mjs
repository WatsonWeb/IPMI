import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { test } from "vite-plus/test";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const readJson = async (relativePath) =>
  JSON.parse(await readFile(path.join(root, relativePath), "utf8"));

test("the icon map covers every staged content block exactly once", async () => {
  const [model, iconMap] = await Promise.all([
    readJson("tests/fixtures/kbyg-cms-model.json"),
    readJson("assets/kbyg/icon-map.json"),
  ]);
  const expected = model.blocks.map(({ slug, title }) => `${slug}\0${title}`).sort();
  const actual = iconMap.blocks.map(({ slug, title }) => `${slug}\0${title}`).sort();

  assert.deepEqual(actual, expected);
  assert.equal(new Set(iconMap.blocks.map(({ slug }) => slug)).size, model.blocks.length);
});

test("the Webflow asset manifest matches every local binary by MD5", async () => {
  const [iconMap, assetManifest] = await Promise.all([
    readJson("assets/kbyg/icon-map.json"),
    readJson("assets/kbyg/webflow-assets.json"),
  ]);
  const assets = new Map(assetManifest.assets.map((asset) => [asset.path, asset]));
  const requiredPaths = new Set([
    ...Object.values(iconMap.icons),
    ...Object.values(iconMap.ui),
    "assets/kbyg/photos/hero-attendee.webp",
    "assets/kbyg/photos/hero-orlando-skyline.webp",
    "assets/kbyg/photos/hub-attendee.webp",
    "assets/kbyg/photos/ritz-carlton-exterior.webp",
    "assets/kbyg/photos/ritz-carlton-pool.webp",
  ]);

  for (const relativePath of requiredPaths) {
    const record = assets.get(relativePath);
    assert.ok(record, `Missing Webflow asset record for ${relativePath}`);
    const bytes = await readFile(path.join(root, relativePath));
    assert.equal(createHash("md5").update(bytes).digest("hex"), record.md5);
    assert.match(record.webflowAssetId, /^[a-f0-9]{24}$/);
    assert.match(record.hostedUrl, /^https:\/\/cdn\.prod\.website-files\.com\//);
  }
});

test("decorative SVG icons inherit color and stay out of the accessibility tree", async () => {
  const iconMap = await readJson("assets/kbyg/icon-map.json");

  for (const relativePath of Object.values(iconMap.icons)) {
    const svg = await readFile(path.join(root, relativePath), "utf8");
    assert.match(svg, /<svg\b/);
    assert.match(svg, /currentColor/);
    assert.match(svg, /aria-hidden="true"/);
    assert.match(svg, /focusable="false"/);
    assert.doesNotMatch(svg, /<script\b|javascript:/i);
  }
});
