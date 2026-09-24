// @vitest-environment happy-dom
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { beforeEach, test } from "vite-plus/test";
import { initHorizon } from "../src/site/horizon";
import { initCategoryForms, populateUpcomingInstitutes } from "../src/site/forms";
import { initHitInquiryRouting } from "../src/site/hit-inquiry-routing";

beforeEach(() => {
  document.body.innerHTML = `<div class="horizon-card-inner-wrap"><a href="#invite">HIT</a><div class="event-info" data-slug="hit-2027" data-label="HIT" data-attend-recipient="canonical@example.test"></div></div>
  <div class="horizon-card-inner-wrap"><a href="#invite">Other</a><div class="event-info" data-slug="other" data-label="Other" data-attend-recipient="ignored@example.test"></div></div>
  <form><select name="Institute" id="field-institute"><option value="">Choose</option></select>
  <input id="field-category" name="Category" value="Attend"><input id="field-recipient" name="Recipient" value="baseline@example.test">
  <input id="field-attend-address" value="baseline@example.test"><input id="field-speak-address" value="speaker@example.test"><input id="field-partner-address" value="partner@example.test">
  <input type="tel" name="Phone" value="+44 20 7946 0958 ext 12">
  </form>${["Attend", "Speak", "Partner"].map((label) => `<a class="form-category-link"><span class="form-category-label">${label}</span></a>`).join("")}`;
});
const select = () => document.querySelector<HTMLSelectElement>("select")!;
const recipient = () => document.querySelector<HTMLInputElement>("#field-recipient")!.value;
function choose(value: string) {
  select().value = value;
  select().dispatchEvent(new Event("change", { bubbles: true }));
}

test("query selection uses CMS route; dropdown transitions restore baseline and preserve Phone", () => {
  initHorizon(document, "?i=hit-2027");
  initHitInquiryRouting();
  assert.equal(recipient(), "canonical@example.test");
  const data = new FormData(document.querySelector("form")!);
  assert.equal(data.get("Recipient"), "canonical@example.test");
  assert.equal(data.get("Phone"), "+44 20 7946 0958 ext 12");
  choose("Other");
  assert.equal(recipient(), "baseline@example.test");
  choose("HIT");
  choose("");
  assert.equal(recipient(), "baseline@example.test");
});

test("legacy card clicks without change events and category transitions cannot retain HIT recipient", () => {
  initHorizon(document, "");
  initCategoryForms();
  initHitInquiryRouting();
  document.querySelector<HTMLElement>(".horizon-card-inner-wrap a")!.click();
  assert.equal(recipient(), "canonical@example.test");
  const categories = document.querySelectorAll<HTMLElement>(".form-category-link");
  categories[1]!.click();
  assert.equal(recipient(), "speaker@example.test");
  categories[2]!.click();
  assert.equal(recipient(), "partner@example.test");
  categories[0]!.click();
  assert.equal(recipient(), "canonical@example.test");
  document.querySelectorAll<HTMLElement>(".horizon-card-inner-wrap a")[1]!.click();
  assert.equal(recipient(), "baseline@example.test");
});

test("missing canonical address blocks offline submit propagation and recovers on empty selection", () => {
  document.querySelector(".event-info")!.removeAttribute("data-attend-recipient");
  initHorizon(document, "?i=hit-2027");
  initHitInquiryRouting();
  assert.equal(recipient(), "");
  assert.equal(select().validity.customError, true);
  const form = document.querySelector("form")!;
  let delivered = false;
  form.addEventListener("submit", () => {
    delivered = true;
  });
  const event = new Event("submit", { bubbles: true, cancelable: true });
  form.dispatchEvent(event);
  assert.equal(event.defaultPrevented, true);
  assert.equal(delivered, false);
  choose("");
  assert.equal(select().validity.customError, false);
  assert.equal(recipient(), "baseline@example.test");
});

test("reset restores baseline and repeated initialization adds no options", async () => {
  initHorizon(document, "?i=hit-2027");
  initHitInquiryRouting();
  initHitInquiryRouting();
  assert.equal(select().options.length, 3);
  document.querySelector("form")!.reset();
  await Promise.resolve();
  assert.equal(recipient(), "baseline@example.test");
});

test("captured live selector and deferred bundle run in DOMContentLoaded order", () => {
  // The VM contains only the captured selector and built supplement, with no
  // sending service, Webflow handler, or network implementation.
  const context = {
    document,
    window: {
      location: { search: "?i=hit-2027", pathname: "/institutes-on-the-horizon" },
      getComputedStyle: window.getComputedStyle.bind(window),
    },
    Option: class {
      constructor(text: string, value: string) {
        const option = document.createElement("option");
        option.text = text;
        option.value = value;
        return option;
      }
    },
    URLSearchParams,
    Element,
    MutationObserver,
    queueMicrotask,
  };
  runInNewContext(readFileSync("tests/fixtures/horizon-published-selector.js", "utf8"), context);
  // Simulate a deferred script, for which interactive is before DOMContentLoaded.
  Object.defineProperty(document, "readyState", { configurable: true, value: "interactive" });
  runInNewContext(readFileSync("dist/hit-inquiry-routing.js", "utf8"), context);
  assert.equal(select().options.length, 1);
  document.dispatchEvent(new Event("DOMContentLoaded"));
  assert.equal(select().options.length, 3);
  assert.equal(recipient(), "canonical@example.test");
  choose("Other");
  assert.equal(recipient(), "baseline@example.test");
  document.querySelector<HTMLElement>(".horizon-card-inner-wrap a")!.click();
  assert.equal(recipient(), "canonical@example.test");
  choose("");
  assert.equal(recipient(), "baseline@example.test");
});

test("generic Attend maps native CMS identity after delayed option creation and restores Speaker/Partner", async () => {
  document.querySelectorAll(".horizon-card-inner-wrap").forEach((card) => card.remove());
  document.body.insertAdjacentHTML(
    "beforeend",
    `<div id="upcoming-institutes">
    <div class="upcoming-institute" data-slug="hit-2027" data-attend-recipient="canonical@example.test"><div class="upcoming-institute-name">Same title</div><div class="upcoming-institute-date">Jun 6</div></div>
    <div class="upcoming-institute" data-slug="different-year" data-attend-recipient="other@example.test"><div class="upcoming-institute-name">Same title</div><div class="upcoming-institute-date">Jun 6</div></div>
  </div>`,
  );
  initCategoryForms({ speakAsSpeaker: true });
  initHitInquiryRouting();
  populateUpcomingInstitutes();
  select().selectedIndex = 1;
  select().dispatchEvent(new Event("change"));
  assert.equal(recipient(), "canonical@example.test");
  select().selectedIndex = 2;
  select().dispatchEvent(new Event("change"));
  assert.equal(
    recipient(),
    "baseline@example.test",
    "duplicate labels must follow native CMS row identity",
  );
  select().selectedIndex = 1;
  select().dispatchEvent(new Event("change"));
  document.querySelectorAll<HTMLElement>(".form-category-link")[1]!.click();
  assert.equal(recipient(), "speaker@example.test");
  document.querySelectorAll<HTMLElement>(".form-category-link")[2]!.click();
  assert.equal(recipient(), "partner@example.test");
  document.querySelectorAll<HTMLElement>(".form-category-link")[0]!.click();
  assert.equal(recipient(), "canonical@example.test");
  choose("");
  assert.equal(recipient(), "baseline@example.test");
  select().selectedIndex = 1;
  select().options[1]!.text = "unexpected replacement";
  select().options[1]!.value = "unexpected replacement";
  select().dispatchEvent(new Event("change"));
  assert.equal(select().validity.customError, true);
  assert.equal(recipient(), "");
  await Promise.resolve();
});
