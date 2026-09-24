import fs from "node:fs";
import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";
const dir = path.dirname(fileURLToPath(import.meta.url));
const read = (name) =>
  JSON.parse(fs.readFileSync(path.join(dir, name), "utf8").replace(/^\uFEFF/, ""));
const { events } = read("events.json");
const { answers } = read("curated-answers.json");
const { sources, excluded } = read("sources.json");
const config = read("configuration.json");
const { placeholders } = read("replacement-register.json");
assert.equal(events.length, 26);
assert.equal(new Set(events.map((e) => e.id)).size, 26);
assert.equal(answers.length, 16);
assert.equal(new Set(answers.map((e) => e.id)).size, 16);
assert.equal(sources.length, 5);
assert.equal(placeholders.length, 6);
assert.equal(config.applied, false);
assert.equal(config.isolatedProject, null);
assert(config.aliases.find((a) => a.terms.includes("HGC")).title === null);
assert(excluded.some((x) => x.includes("6ab4dcb7c6fcf3d14c3706d1")));
assert(excluded.some((x) => x.includes("6ab4e34be2c912b57c47208b")));
for (const p of placeholders) {
  assert.equal(p.applied, false);
  assert.equal(p.approval, null);
  assert(p.text.match(/Placeholder|Pending confirmation/));
}
for (const e of events) {
  assert(e.start <= e.end);
  assert.equal(e.stagingUrl, "https://ipmi.webflow.io/institutes/" + e.slug);
  assert.equal(e.publicUrl, "https://www.ipmievents.com/institutes/" + e.slug);
  assert.equal(e.status, "retained-provisional-approval-pending");
  if (e.horizon) {
    assert.equal(e.calendarAction, "none");
    assert(e.knowledgeAction.includes("no calendar registration"));
  }
}
// Verify the proposed selection contract with real records and boundary/trap fixtures.
// This reference function is an offline oracle, not deployed Lyro functionality.
function select(pool, today, title) {
  return (
    pool
      .filter((e) => !e.isDraft && !e.isArchived && e.end >= today && e.title.trim() === title)
      .sort(
        (a, b) =>
          Number(b.start <= today) - Number(a.start <= today) ||
          a.start.localeCompare(b.start) ||
          a.slug.localeCompare(b.slug),
      )[0] ?? null
  );
}
assert.equal(
  new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Toronto",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date("2026-09-25T01:00:00Z")),
  "2026-09-24",
);
assert.equal(
  select(events, "2026-09-24", "HR Management Institute Canada").slug,
  "hrmi-canada-nov-2026",
);
assert.equal(
  select(events, "2026-11-10", "HR Management Institute Canada").slug,
  "hrmi-canada-nov-2026",
);
assert.equal(
  select(events, "2026-11-11", "HR Management Institute Canada").slug,
  "hr-can-april-2027",
);
assert.equal(select(events, "2026-09-24", "HR Management Institute").slug, "hrmi-oct-2026");
assert.equal(select(events, "2026-09-24", "EHS Management Institute").slug, "ehs-jan-2027");
assert.equal(select(events, "2028-01-01", "HR Management Institute Canada"), null);
const ended = { ...events[5], slug: "past-trap", start: "2026-04-26", end: "2026-04-29" };
assert.notEqual(select([ended, ...events], "2026-09-24", ended.title).slug, "past-trap");
assert.notEqual(
  select(
    [{ ...events[5], isDraft: true }, ...events.filter((e) => e.id !== events[5].id)],
    "2026-09-24",
    ended.title,
  ).slug,
  events[5].slug,
);
for (const a of answers) {
  assert(a.answer.length > 30);
  assert(a.criteria.length >= 2);
  for (const u of a.links) assert(u.startsWith("https://ipmi.webflow.io/"));
}
assert(!answers.find((a) => a.id === "R14").answer.includes("Healthcare Law"));
assert.equal(answers.find((a) => a.id === "R08").links.length, 0);
const baseline = read("baseline-transcripts.json");
assert.equal(baseline.cases.length, 16);
for (const a of answers) {
  const b = baseline.cases.find((b) => b.id === a.id);
  assert(b);
  assert.equal(b.prompt, a.prompt);
  assert(["pass", "fail", "blocked"].includes(b.result));
  assert(b.reason);
  if (b.result === "blocked") {
    assert.equal(b.actualAnswer, null);
    assert.equal(b.executed, false);
  } else {
    assert.equal(b.executed, true);
    assert(b.actualAnswer.length > 0);
    assert(b.executedDate);
    assert(Array.isArray(b.links));
  }
}
assert.equal(baseline.cases.find((b) => b.id === "R08").executed, false);
console.log(
  "PASS: 26 facts; 5 approved excerpts; 6 local placeholders; 16 cases; timezone/ongoing/end-boundary/past/draft/no-candidate selection; alias and Horizon safeguards. Local oracle only; provider regressions retain their own verdicts.",
);
