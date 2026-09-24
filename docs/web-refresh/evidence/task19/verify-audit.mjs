import assert from "node:assert/strict";
import { readFileSync, writeFileSync } from "node:fs";

const read = (name) => JSON.parse(readFileSync(new URL(name, import.meta.url), "utf8"));
const canonical = (url) => url.replace("uploads-ssl.webflow.com", "cdn.prod.website-files.com");
const approved = read("approved-photo-audit.json");
const gallery = read("gallery-audit.json");
const contexts = read("responsive-context-audit.json");
assert.equal(approved.length, 27);
assert.equal(new Set(approved.map((row) => row.id)).size, 27);
assert.equal(gallery.length, 67);
assert.equal(new Set(gallery.map((row) => row.cmsId)).size, 67);
assert.equal(
  gallery.reduce((sum, row) => sum + row.placements.length, 0),
  97,
);
assert.equal(contexts.length, 30);
const expected = new Map(gallery.map((row) => [canonical(row.asset.url), row.newDescription]));
for (const page of ["gallery", "faq", "about", "attend"]) {
  const native = read(`native-${page}-bindings.json`);
  for (const image of native)
    assert.equal(image.alt, expected.get(canonical(image.src ?? image.image)));
}
for (const width of [390, 768, 1440]) {
  const widthContexts = contexts.filter((row) => row.width === width);
  assert.equal(widthContexts.length, 10);
  assert.equal(
    widthContexts.reduce((sum, row) => sum + row.photos.length, 0),
    27,
  );
  assert.equal(
    widthContexts.reduce((sum, row) => sum + row.lightboxes.length, 0),
    97,
  );
  for (const context of widthContexts) {
    for (const photo of context.photos) {
      const source = approved.find((row) => row.asset === photo.src);
      assert(source, photo.src);
      assert.equal(photo.alt, source.newAlt);
      assert.equal(photo.srcset, source.srcset ?? "");
      assert.equal(photo.sizes, source.sizes ?? "");
    }
    for (const link of context.lightboxes) {
      assert(link.alt?.trim());
      assert.equal(link.name, `View photo: ${link.alt}`);
      assert.notEqual(link.role, "listitem");
    }
  }
}
const checks = read("browser-lightbox-checks.json");
for (const check of checks) {
  for (const image of check.images ?? [])
    assert.equal(image.alt, expected.get(canonical(image.src)));
  if (check.label.includes("focus return")) {
    assert.equal(check.images.length, 0);
    assert(check.active.startsWith("View photo: "));
  }
}
assert.equal(read("root-task19-native-verification.json").unexpectedDeltas.length, 0);
assert.equal(read("root-task19-exact-descriptions.json").exactDescriptionMismatches.length, 0);
const summary = {
  approved: 27,
  activeCms: 67,
  bindings: 97,
  widths: [390, 768, 1440],
  pageWidthChecks: 30,
  result: "pass",
};
writeFileSync(
  new URL("audit-verification.json", import.meta.url),
  JSON.stringify(summary, null, 2) + "\n",
);
console.log(summary);
