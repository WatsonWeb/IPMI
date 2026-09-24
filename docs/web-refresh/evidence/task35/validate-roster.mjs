import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const directory = path.dirname(fileURLToPath(import.meta.url));
const read = (name) => JSON.parse(fs.readFileSync(path.join(directory, name), "utf8"));
const manifest = read("calendar-roster.json");
const audit = read("all-institutes-reconciliation.json");
const attend = read("attend-live-source.json");
const horizon = read("horizon-live-source.json");
const upcoming = read("upcoming-live-source.json");
const checks = [];
const check = (name, run) => {
  run();
  checks.push({ name, result: "pass" });
};
const unique = (rows, field) => [...new Set(rows.map((row) => row[field]))].sort();
const normalize = (value) => value.replace(/\s+/g, " ").trim();
const validDate = (date) =>
  /^\d{4}-\d{2}-\d{2}$/.test(date) &&
  new Date(`${date}T00:00:00Z`).toISOString().slice(0, 10) === date;
const active = audit.records.filter(
  (row) =>
    row.end >= manifest.coverage.asOf &&
    row.start <= manifest.coverage.through &&
    !row.isArchived &&
    !row.isDraft,
);

check("103-record paginated inventory and exact 26-record partition", () => {
  assert.equal(audit.records.length, 103);
  assert.deepEqual(
    manifest.source.pages.map((page) => [page.offset, page.total]),
    [
      [0, 103],
      [100, 103],
    ],
  );
  assert.equal(active.length, 26);
  assert.equal(audit.records.filter((row) => row.end < manifest.coverage.asOf).length, 77);
  assert.deepEqual(unique(active, "id"), unique(manifest.events, "id"));
  for (const row of manifest.events) {
    const source = active.find((record) => record.id === row.id);
    for (const [key, value] of Object.entries(source))
      assert.deepEqual(row[key], value, `${row.slug}: ${key}`);
  }
});
check("Strict date ranges, exact storage, unique IDs/slugs and provisional authority", () => {
  assert.equal(unique(audit.records, "id").length, 103);
  assert.equal(unique(audit.records, "slug").length, 103);
  assert.deepEqual(audit.duplicateIdentityDateLocation, []);
  for (const row of audit.records) {
    assert.ok(validDate(row.start) && validDate(row.end) && row.start <= row.end, row.slug);
    assert.equal(row.storedStart, `${row.start}T00:00:00.000Z`);
    assert.equal(row.storedEnd, `${row.end}T00:00:00.000Z`);
  }
  for (const row of manifest.events) {
    assert.equal(row.year, Number(row.start.slice(0, 4)));
    assert.ok(row.title.trim() && row.location.trim());
    assert.equal(row.status, "retained-provisional-approval-pending");
    assert.equal(row.approvalRegisterId, `35-${row.slug}`);
  }
});
check("Live Attend identity/option coverage matches all 26 native records", () => {
  assert.equal(attend.rows.length, 26);
  assert.equal(attend.options.length, 27);
  assert.equal(attend.options[0].value, "");
  assert.deepEqual(unique(attend.rows, "slug"), unique(manifest.events, "slug"));
  for (const row of manifest.events)
    assert.ok(attend.rows.find((item) => item.slug === row.slug).text.startsWith(row.title));
});
check("Released and Horizon live card coverage, title, location and dates", () => {
  const released = manifest.events.filter((row) => !row.horizon);
  const locked = manifest.events.filter((row) => row.horizon);
  assert.equal(released.length, 6);
  assert.equal(locked.length, 20);
  assert.deepEqual(unique(upcoming.rows, "slug"), unique(released, "slug"));
  assert.deepEqual(unique(horizon.rows, "slug"), unique(locked, "slug"));
  const month = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  for (const row of manifest.events) {
    const cards = row.horizon
      ? horizon.rows.filter((item) => item.attributes["data-label"])
      : upcoming.rows;
    const card = cards.find((item) => item.slug === row.slug);
    const content = normalize(card.text);
    assert.ok(
      content.includes(normalize(row.title)) && content.includes(normalize(row.location)),
      row.slug,
    );
    for (const date of [row.start, row.end])
      assert.ok(
        content.includes(`${month[Number(date.slice(5, 7)) - 1]} ${Number(date.slice(8))}`),
        row.slug,
      );
    assert.ok(content.includes(String(row.year)));
  }
});
check("TAEEI boundary, empty December, no current ongoing event and HIT exception", () => {
  const taeei = manifest.events.find((row) => row.slug === "29-taeei-can");
  assert.deepEqual([taeei.year, taeei.start, taeei.end], [2027, "2027-05-30", "2027-06-01"]);
  assert.equal(manifest.events.filter((row) => row.start <= manifest.coverage.asOf).length, 0);
  assert.equal(
    manifest.events.filter((row) => row.start <= "2027-12-31" && row.end >= "2027-12-01").length,
    0,
  );
  for (const row of manifest.events)
    assert.equal(row.calendarAction, row.horizon ? "none" : "view-existing-institute");
  assert.equal(manifest.events.find((row) => row.slug === "hit-2027").calendarAction, "none");
  assert.equal(
    attend.rows.find((row) => row.slug === "hit-2027").attributes["data-attend-recipient"],
    "scolquhoun@ipmievents.com",
  );
});
check("Changed Markdown local link targets exist", () => {
  const files = ["README.md", "PLACEHOLDERS.md", "35-calendar-content-through-2027.md"].map(
    (name) => path.resolve(directory, "../..", name),
  );
  files.push(path.join(directory, "README.md"), path.join(directory, "ROSTER.md"));
  for (const file of files)
    for (const match of fs.readFileSync(file, "utf8").matchAll(/\]\(([^)]+)\)/g)) {
      const href = match[1];
      if (/^(https?:|mailto:|#)/.test(href)) continue;
      const target = path.resolve(path.dirname(file), decodeURIComponent(href.split("#")[0]));
      assert.ok(fs.existsSync(target), `${file} -> ${href}`);
    }
});
const result = {
  validatedAt: new Date().toISOString(),
  checks,
  summary: manifest.summary,
  limitations: [
    "Stored/native facts only; no client completeness or cancellation approval",
    "No calendar runtime test; task 24 implements the grid",
    "No Webflow mutation or publication",
  ],
};
fs.writeFileSync(
  path.join(directory, "validation-results.json"),
  JSON.stringify(result, null, 2) + "\n",
);
console.log(JSON.stringify(result, null, 2));
