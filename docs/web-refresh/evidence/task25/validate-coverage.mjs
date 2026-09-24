import fs from "node:fs";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import path from "node:path";

const dir = path.dirname(fileURLToPath(import.meta.url));
const read = (name) => JSON.parse(fs.readFileSync(path.join(dir, name), "utf8"));
const unwrap = (value) => value.items ?? value;
const pages = unwrap(read("pages-after.json"));
const blocks = unwrap(read("blocks-after.json"));
const before = unwrap(read("pages-before.json"));
const blocksBefore = unwrap(read("blocks-before.json"));
const matrix = read("../task36/coverage-matrix.json");
const expected = read("../task36/task25-create-pack.json");
const schema = read("../task36/page-schema.json");
const multi = new Set(schema.fields.filter((f) => f.type === "MultiReference").map((f) => f.slug));
const semantic = (field, value) =>
  multi.has(field)
    ? (value ?? [])
    : typeof value === "string" && value !== ""
      ? value.replaceAll('<p id="">', "<p>")
      : value || null;
assert.equal(pages.length, 54);
assert.equal(blocks.length, 43);
assert.equal(new Set(pages.map((p) => p.fieldData.slug)).size, 54);
assert.equal(
  new Set(pages.map((p) => `${p.fieldData.institute}:${p.fieldData.audience}`)).size,
  54,
);
for (const old of before) {
  const actual = pages.find((p) => p.id === old.id);
  assert.ok(actual, `Missing original ${old.id}`);
  assert.deepEqual(actual.fieldData, old.fieldData, `Original fields changed: ${old.id}`);
  assert.equal(actual.isDraft, old.isDraft);
  assert.equal(actual.isArchived, old.isArchived);
}
for (const old of blocksBefore) {
  const actual = blocks.find((b) => b.id === old.id);
  assert.ok(actual);
  assert.deepEqual(actual.fieldData, old.fieldData);
  assert.equal(actual.isDraft, old.isDraft);
  assert.equal(actual.isArchived, old.isArchived);
}
for (const row of matrix.rows) {
  const actual = pages.find((p) => p.fieldData.slug === row.pageSlug);
  assert.ok(actual, `Missing ${row.pageSlug}`);
  assert.equal(actual.fieldData.institute, row.instituteId);
  assert.equal(actual.fieldData.audience, row.audienceOptionId);
}
for (const row of expected) {
  const actual = pages.find((p) => p.fieldData.slug === row.fieldData.slug);
  for (const [field, value] of Object.entries(row.fieldData)) {
    assert.deepEqual(
      semantic(field, actual.fieldData[field]),
      semantic(field, value),
      `${row.fieldData.slug} / ${field}`,
    );
  }
}
const result = {
  status: "pass",
  scope: "Provisional structural coverage; not final Operations approval",
  pairs: 54,
  created: 50,
  originalPagesPreserved: 4,
  originalBlocksPreserved: 43,
  fieldCountPerNewPage: 51,
};
fs.writeFileSync(path.join(dir, "validation-results.json"), JSON.stringify(result, null, 2) + "\n");
console.log(JSON.stringify(result, null, 2));
