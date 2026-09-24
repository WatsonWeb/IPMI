// @vitest-environment happy-dom
import assert from "node:assert/strict";
import { beforeEach, test } from "vite-plus/test";
import {
  addDays,
  dateLabel,
  eventsOn,
  readCalendarEvents,
  shiftMonth,
  siteToday,
  validDate,
} from "../src/site/institutes-calendar-model";
import { initInstitutesCalendar } from "../src/site/institutes-calendar";

const row = (slug: string, start: string, end: string, horizon = "false", title = slug) =>
  `<span data-ipmi-calendar-event data-slug="${slug}" data-start="${start}" data-end="${end}" data-title="${title}" data-location="Venue" data-horizon="${horizon}" data-url="/institutes/${slug}"></span>`;
beforeEach(() => {
  document.body.innerHTML = "";
  document.documentElement.style.overflow = "";
});

test("strict date validation rejects suffixes, incomplete and impossible dates", () => {
  for (const value of [
    "2027-02-29",
    "2026-04-31",
    "2027-01-01T00:00:00Z",
    "2027-1-01",
    "2027-00-01",
    "",
    "2027-01-01junk",
  ])
    assert.equal(validDate(value), false, value);
  assert.equal(validDate("2028-02-29"), true);
  assert.equal(shiftMonth("2028-01-31", 1), "2028-02-29");
  assert.equal(shiftMonth("2027-01-31", 1), "2027-02-28");
  assert.equal(addDays("2026-12-31", 1), "2027-01-01");
});

test("Toronto today follows midnight and DST; event labels retain authored components", () => {
  assert.equal(siteToday(new Date("2027-01-01T04:59:59Z")), "2026-12-31");
  assert.equal(siteToday(new Date("2027-01-01T05:00:00Z")), "2027-01-01");
  assert.equal(siteToday(new Date("2027-03-14T06:59:59Z")), "2027-03-14");
  assert.equal(siteToday(new Date("2027-03-14T07:00:00Z")), "2027-03-14");
  assert.equal(siteToday(new Date("2027-11-07T05:59:59Z")), "2027-11-07");
  assert.equal(siteToday(new Date("2027-11-07T06:00:00Z")), "2027-11-07");
  assert.equal(siteToday(new Date("2027-01-01T05:00:00Z"), "America/Los_Angeles"), "2026-12-31");
  assert.equal(siteToday(new Date("2027-01-01T05:00:00Z"), "Pacific/Kiritimati"), "2027-01-01");
  assert.equal(dateLabel("2027-03-14"), "March 14, 2027");
});

test("ongoing ranges, end today, overlap, cross-year, deduplication, invalid rows and sorting", () => {
  document.body.innerHTML =
    row("ongoing", "2026-12-30", "2027-01-02") +
    row("ended", "2026-12-01", "2026-12-30") +
    row("today", "2026-12-31", "2026-12-31") +
    row("a", "2027-01-01", "2027-01-03", "true", "Alpha") +
    row("z", "2027-01-01", "2027-01-01", "true", "Zeta") +
    row("a", "2027-01-01", "2027-01-03") +
    row("reverse", "2027-02-02", "2027-02-01") +
    row("missing", "2027-01-01", "") +
    row("unknown", "2027-01-01", "2027-01-01", "yes") +
    row("beyond", "2028-01-01", "2028-01-02");
  const events = readCalendarEvents(document, "2026-12-31");
  assert.deepEqual(
    events.map((e) => e.slug),
    ["ongoing", "today", "a", "z"],
  );
  assert.deepEqual(
    eventsOn(events, "2026-12-31").map((e) => e.slug),
    ["ongoing", "today"],
  );
  assert.deepEqual(
    eventsOn(events, "2027-01-01").map((e) => e.slug),
    ["ongoing", "a", "z"],
  );
  assert.deepEqual(
    eventsOn(events, "2027-01-02").map((e) => e.slug),
    ["ongoing", "a"],
  );
  assert.deepEqual(eventsOn(events, "2027-01-04"), []);
});

function fixture() {
  document.body.innerHTML = `<input id="existing-filter" type="checkbox" checked><button data-ipmi-calendar-open hidden>View calendar</button><dialog data-ipmi-calendar-dialog aria-labelledby="title"><h2 id="title">Institutes calendar</h2><button data-ipmi-calendar-close>Close</button><button data-ipmi-calendar-prev>Previous</button><h3 data-ipmi-calendar-month aria-live="polite"></h3><button data-ipmi-calendar-next>Next</button><div data-ipmi-calendar-grid role="grid"></div><section data-ipmi-calendar-details aria-live="polite"></section></dialog><div id="ipmi-calendar-data">${row("released", "2027-01-04", "2027-01-06")}${row("hit-2027", "2027-06-06", "2027-06-08", "true")}${row("cross-month", "2027-05-30", "2027-06-01", "true")}</div>`;
  const dialog = document.querySelector<HTMLDialogElement>("dialog")!;
  dialog.showModal = () => {
    dialog.open = true;
  };
  dialog.close = () => {
    dialog.open = false;
    dialog.dispatchEvent(new Event("close"));
  };
  return dialog;
}
const click = (selector: string) => document.querySelector<HTMLButtonElement>(selector)!.click();
const key = (value: string, shiftKey = false) =>
  document.activeElement!.dispatchEvent(
    new KeyboardEvent("keydown", { key: value, shiftKey, bubbles: true, cancelable: true }),
  );

test("open/reopen recomputes date, keyboard crosses months, Horizon never links, bounds and expiry", () => {
  const dialog = fixture();
  let now = new Date("2027-01-04T18:00Z");
  initInstitutesCalendar(document, () => now);
  click("[data-ipmi-calendar-open]");
  assert.equal(document.activeElement?.getAttribute("data-date"), "2027-01-04");
  assert.equal(document.querySelectorAll("[data-ipmi-calendar-details] a").length, 1);
  assert.equal(
    document.querySelector<HTMLButtonElement>("[data-ipmi-calendar-prev]")!.disabled,
    true,
  );
  key("Home");
  assert.equal(document.activeElement?.getAttribute("data-date"), "2027-01-03");
  key("End");
  assert.equal(document.activeElement?.getAttribute("data-date"), "2027-01-09");
  key("ArrowUp");
  assert.equal(document.activeElement?.getAttribute("data-date"), "2027-01-02");
  key("ArrowLeft");
  key("ArrowLeft");
  assert.equal(document.activeElement?.getAttribute("data-date"), "2027-01-01");
  for (let i = 0; i < 4; i++) key("PageDown");
  click('[data-date="2027-05-30"]');
  assert.match(document.querySelector("[data-ipmi-calendar-details]")!.textContent!, /cross-month/);
  key("ArrowRight");
  key("ArrowRight");
  assert.equal(document.activeElement?.getAttribute("data-date"), "2027-06-01");
  assert.match(document.querySelector("[data-ipmi-calendar-details]")!.textContent!, /cross-month/);
  click('[data-date="2027-06-06"]');
  assert.match(
    document.querySelector("[data-ipmi-calendar-details]")!.textContent!,
    /registration is not yet available/,
  );
  assert.equal(document.querySelectorAll("[data-ipmi-calendar-details] a").length, 0);
  for (let i = 0; i < 8; i++) key("PageDown");
  assert.equal(document.activeElement?.getAttribute("data-date"), "2027-12-31");
  assert.equal(
    document.querySelector<HTMLButtonElement>("[data-ipmi-calendar-next]")!.disabled,
    true,
  );
  assert.match(
    document.querySelector("[data-ipmi-calendar-details]")!.textContent!,
    /No Institutes scheduled for this day./,
  );
  key("Escape");
  assert.equal(dialog.open, false);
  assert.equal(document.activeElement?.hasAttribute("data-ipmi-calendar-open"), true);
  assert.equal(document.querySelector<HTMLInputElement>("#existing-filter")!.checked, true);
  now = new Date("2027-07-10T18:00Z");
  click("[data-ipmi-calendar-open]");
  assert.equal(document.activeElement?.getAttribute("data-date"), "2027-07-10");
  key("Escape");
  now = new Date("2028-01-01T05:00Z");
  click("[data-ipmi-calendar-open]");
  assert.equal(dialog.open, false);
  assert.equal(
    document.querySelector<HTMLButtonElement>("[data-ipmi-calendar-open]")!.hidden,
    true,
  );
});

test("focus wraps, native list refreshed on every opening, potential truncation fails closed", () => {
  fixture();
  initInstitutesCalendar(document, () => new Date("2027-01-04T18:00Z"));
  click("[data-ipmi-calendar-open]");
  const close = document.querySelector<HTMLButtonElement>("[data-ipmi-calendar-close]")!;
  close.focus();
  key("Tab", true);
  assert.equal(document.activeElement?.tagName, "A");
  key("Tab");
  assert.equal(document.activeElement, close);
  click("[data-ipmi-calendar-close]");
  document.getElementById("ipmi-calendar-data")!.innerHTML = row(
    "changed",
    "2027-01-04",
    "2027-01-04",
    "true",
  );
  click("[data-ipmi-calendar-open]");
  assert.match(document.querySelector("[data-ipmi-calendar-details]")!.textContent!, /changed/);
  click("[data-ipmi-calendar-close]");
  document.getElementById("ipmi-calendar-data")!.innerHTML = Array.from({ length: 100 }, (_, i) =>
    row(String(i), "2027-01-04", "2027-01-04"),
  ).join("");
  click("[data-ipmi-calendar-open]");
  assert.equal(document.querySelector<HTMLDialogElement>("dialog")!.open, false);
});
