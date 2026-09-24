import fs from "node:fs";
import assert from "node:assert/strict";
const dir = new URL("./", import.meta.url);
const read = (name) =>
  JSON.parse(fs.readFileSync(new URL(name, dir), "utf8").replace(/^\uFEFF/, ""));
const matrix = read("coverage-matrix.json");
const before = read("pages-before.json").items;
const after = read("pages-after-save.json").items;
const blocks = read("blocks-before.json").items;
const blocksAfter = read("blocks-after.json").items;
assert.equal(blocksAfter.length, blocks.length);
for (const block of blocks) {
  const current = blocksAfter.find((item) => item.id === block.id);
  assert(current);
  assert.deepEqual(current.fieldData, block.fieldData);
  assert.equal(current.isDraft, block.isDraft);
  assert.equal(current.isArchived, block.isArchived);
}
const source = read("../task35/calendar-roster.json").events;
const pack = read("task25-create-pack.json");
const rows = matrix.rows;
assert.equal(rows.length, 54);
assert.equal(new Set(rows.map((r) => `${r.instituteId}:${r.audience}`)).size, 54);
assert.equal(new Set(rows.map((r) => r.pageSlug)).size, 54);
assert.equal(pack.length, 50);
assert.equal(rows.filter((r) => r.pageId).length, 4);
for (const event of source) {
  const pair = rows.filter((r) => r.instituteId === event.id);
  assert.equal(pair.length, 2);
  for (const row of pair)
    for (const key of ["title", "year", "start", "end", "location", "horizon"])
      assert.deepEqual(row[key], event[key]);
}
for (const original of before) {
  const current = after.find((p) => p.id === original.id);
  assert(current);
  for (const key of [
    "slug",
    "institute",
    "audience",
    "operations-lead",
    "hero-image",
    "hub-image",
    "key-dates",
    "kbyg-reservation-details",
    "hub-url",
    "support-url",
  ])
    assert.deepEqual(current.fieldData[key], original.fieldData[key]);
  assert.equal(current.isDraft, false);
  assert.equal(current.isArchived, false);
  if (original.fieldData.slug.startsWith("hchr-"))
    assert.deepEqual(current.fieldData, original.fieldData);
  for (const key of ["preparation", "key-dates", "agenda-days", "experience", "faqs"]) {
    for (const id of current.fieldData[key] ?? [])
      assert.equal(
        blocks.find((b) => b.id === id).fieldData.institute,
        current.fieldData.institute,
      );
  }
}
assert.equal(
  after.find((p) => p.fieldData.slug === "ehs-jan-2027-delegate").fieldData["welcome-body"],
  "<p>Placeholder - Operations copy pending.</p>",
);
for (const item of pack) {
  assert.equal(item.isDraft, true);
  for (const key of ["operations-lead", "hub-url", "support-url", "hero-image", "hub-image"])
    assert.equal(item.fieldData[key], null);
  for (const key of ["preparation", "key-dates", "agenda-days", "experience", "faqs"])
    assert.deepEqual(item.fieldData[key], []);
  assert.equal(item.fieldData["agenda-title"], "Institute Agenda");
  assert(!JSON.stringify(item).includes("example.com"));
}
const schema = read("page-schema.json")
  .fields.map((f) => f.slug)
  .sort();
for (const item of pack) assert.deepEqual(Object.keys(item.fieldData).sort(), schema);
const result = {
  checkedAt: new Date().toISOString(),
  result: "pass",
  pairs: 54,
  existing: 4,
  missing: 50,
  exactScheduleRows: 52,
  preservedPastRows: 2,
  originalBlocks: blocks.length,
  scope:
    "Structural handoff and four saved CMS records; not final Operations content approval or 54 live pages",
  finalContentValidation:
    "Pending: unknown staff, links, deadlines, logistics and approvals remain explicit; original strict validator unchanged",
};
fs.writeFileSync(new URL("validation-results.json", dir), JSON.stringify(result, null, 2) + "\n");
console.log(JSON.stringify(result, null, 2));
