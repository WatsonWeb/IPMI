import fs from "node:fs";
import assert from "node:assert/strict";

const dir = "docs/web-refresh/evidence/task27";
const read = (path) => JSON.parse(fs.readFileSync(path, "utf8"));
const before = read("docs/web-refresh/evidence/task26/kbyg-pages-after-task26.json").items;
const after = read(`${dir}/kbyg-pages-after-task27.json`).items;
const coverage = read("docs/web-refresh/evidence/task25/coverage-actual.json");
const changes = [];
const rows = coverage.map((row) => {
  const old = before.find((item) => item.id === row.pageId);
  const current = after.find((item) => item.id === row.pageId);
  assert(old && current);
  assert.equal(current.isDraft, false);
  assert.equal(current.isArchived, false);
  for (const field of new Set([...Object.keys(old.fieldData), ...Object.keys(current.fieldData)])) {
    if (JSON.stringify(old.fieldData[field]) !== JSON.stringify(current.fieldData[field])) {
      changes.push({
        pageId: row.pageId,
        pageSlug: row.pageSlug,
        field,
        before: old.fieldData[field],
        after: current.fieldData[field],
      });
    }
  }
  const fields = current.fieldData;
  assert(!fields["hub-url"] || fields["hub-url"].startsWith("mailto:"));
  assert(!fields["support-url"]);
  const hub = {
    field: "hub-url",
    purpose: `${row.audience} MeetMax access`,
    storedDestination: fields["hub-url"] ?? null,
    currentPurpose: fields["hub-url"]
      ? "Operations email contact only"
      : "Noninteractive pending destination",
    visibleLabel: fields["hub-url"] ? fields["hub-cta-label"] : null,
    body: fields["hub-body"],
    status: "Actual MeetMax URL and approval pending",
    replacement:
      "Supply this exact Institute/audience MeetMax URL with full query string, purpose, approver and date. Replace Hub URL and set a matching Hub CTA Label; remove the pending paragraph and email-only explanation. Keep independent staff contacts.",
  };
  if (fields["hub-url"]) assert.equal(fields["hub-cta-label"], "EMAIL OPERATIONS");
  return {
    registerId: `27-${row.pageSlug}`,
    pageId: row.pageId,
    pageSlug: row.pageSlug,
    instituteId: row.instituteId,
    instituteSlug: row.instituteSlug,
    instituteName: row.instituteCmsName,
    audience: row.audience,
    stagingUrl: row.url,
    owner: "IPMI Operations",
    confirmedUrl: null,
    confirmationDate: null,
    hub,
    support:
      row.audience === "Sponsor"
        ? {
            field: "support-url",
            purpose: "Sponsor Support (MeetMax or separate support purpose unconfirmed)",
            storedDestination: fields["support-url"] ?? null,
            body: fields["support-body"],
            status: "Noninteractive pending destination",
            replacement:
              "Confirm purpose independently and supply the exact event/audience Support URL, matching CTA label, approver and date. Do not reuse Hub URL without specific approval; remove pending copy after confirmation.",
          }
        : {
            status: "Not applicable to Delegate branch; native field retained",
            storedDestination: fields["support-url"] ?? null,
          },
    preserved: [
      "Institute Agenda Link",
      "Institute KBYG Reservation URL",
      "Operations Lead contacts",
      "all content-block destinations and references",
    ],
  };
});
assert.equal(rows.length, 54);
assert.equal(new Set(rows.map((row) => `${row.instituteId}/${row.audience}`)).size, 54);
assert.equal(changes.length, 12);
for (const change of changes) {
  assert(
    ["hub-url", "hub-body", "hub-cta-label", "support-url", "support-body"].includes(change.field),
  );
  assert(/^(hchr-sept-2026|ehs-jan-2027)-(delegate|sponsor)$/.test(change.pageSlug));
}
const beforeBlocks = read("docs/web-refresh/evidence/task26/kbyg-blocks-after-task26.json").items;
const afterBlocks = read(`${dir}/kbyg-blocks-after-task27.json`).items;
assert.equal(afterBlocks.length, 43);
for (const item of afterBlocks)
  assert.deepEqual(item.fieldData, beforeBlocks.find((old) => old.id === item.id).fieldData);
assert.equal(rows.filter((row) => row.hub.storedDestination).length, 2);
assert.equal(rows.filter((row) => row.audience === "Sponsor").length, 27);
const http = read(`${dir}/root-task27-http-verification.json`);
assert.equal(http.pages, 54);
assert.deepEqual(http.failures, []);
assert.deepEqual(http.preservationDifferences, []);
const browser = read(`${dir}/browser-qa.json`);
assert.equal(browser.length, 12);
assert.equal(new Set(browser.map((row) => row.url)).size, 6);
for (const row of browser) {
  assert.equal(row.width, row.scrollWidth);
  assert(row.noindex.includes("noindex"));
  for (const section of row.sections) {
    for (const link of section.links) {
      if (link.visible) {
        assert(link.href.startsWith("mailto:"));
        assert.equal(link.text, "EMAIL OPERATIONS");
        assert.equal(link.aria, null);
      } else assert.equal(link.display, "none");
    }
  }
}
fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(`${dir}/destination-register.json`, JSON.stringify(rows, null, 2) + "\n");
fs.writeFileSync(`${dir}/native-deltas.json`, JSON.stringify(changes, null, 2) + "\n");
console.log(
  "PASS: 54 independent page/audience rows; 81 pending destination purposes; 2 accurately labeled preserved email contacts; 12 native field deltas.",
);
