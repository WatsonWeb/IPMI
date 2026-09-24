import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const read = (name) => JSON.parse(readFileSync(new URL(name, import.meta.url), "utf8"));
const matrix = read("routing-matrix.json");
const register = read("replacement-register.json");
const test = read("delivery-test.json");
const observed = read("provider-observations.json");
const baseline = read("../task22/baseline-transcripts.json");
assert.equal(matrix.routes.length, 7);
assert.equal(new Set(matrix.routes.map((r) => r.id)).size, 7);
assert.equal(register.length, 10);
for (const entry of register) {
  assert.equal(entry.exactText, matrix.messages[entry.id]);
  assert.equal(entry.applied, false);
  assert.equal(entry.approval, null);
}
for (const route of matrix.routes) {
  assert.equal(route.applied, false);
  assert.equal(route.approval, null);
  assert.equal(
    route.proposedPendingValue.previewAction,
    "Keep conversation (no transfer to agent)",
  );
  for (const key of ["agentId", "departmentId", "notificationEmail", "contactUrl", "ticketInbox"])
    assert.equal(route.proposedPendingValue[key], null);
  assert(matrix.messages[route.messageId].includes("Preview only"));
  assert.equal(route.offline, "23-offline");
  assert.equal(route.noAvailability, "23-offline");
  assert(route.unknownRecipient.startsWith("Fail closed"));
  assert(route.fallback.behavior.includes("no chat transfer"));
}
const hit = matrix.routes.find((r) => r.id === "23-hit-2027");
assert.equal(hit.actualPriorValue.preservedNativeFormRecipient, "scolquhoun@ipmievents.com");
assert(hit.audience.includes("exclude Speak/Sponsor"));
assert(
  matrix.routes
    .find((r) => r.id === "23-additional")
    .audience.includes("never substitute social guest policy"),
);
assert(matrix.routes.find((r) => r.id === "23-hgc").audience.includes("do not infer HCHR"));
assert.equal(test.networkEnabled, false);
assert.equal(test.authorization, null);
assert.equal(test.approvedTestDestination, null);
assert.equal(test.isolatedProject, null);
assert.equal(test.fixture.consent, false);
assert(test.fixture.replyEmail.endsWith("@example.invalid"));
assert.equal(test.cases.length, 13);
assert.equal(observed.delivery.sent, false);
assert.equal(observed.delivery.R08, "blocked");
assert.equal(baseline.cases.find((r) => r.id === "R08").executed, false);
assert.equal(baseline.cases.filter((r) => r.result === "fail").length, 15);
assert.equal(observed.team.rows.find((r) => r.operatorId === "3931675").name, "Sam Colquhoun");
console.log(
  "PASS: 7 scoped routes, 10 unapplied messages, 13 controlled test cases, null sending destinations/authorization, preserved HIT boundary and unchanged 15-fail/1-blocked baseline. Local package only; no delivery performed.",
);
