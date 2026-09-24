// Offline published-markup/legacy-script check. Never loads Webflow or sends a form.
// Usage: vp node <this-file> <saved-html-directory> <saved-jquery-file>
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { Window } from "happy-dom";

const [directory, jqueryFile] = process.argv.slice(2);
const bundle = readFileSync("dist/hit-inquiry-routing.js", "utf8");
const results = [];
for (const page of ["institutes-on-the-horizon", "attend", "institutes-hit-2027"]) {
  const html = readFileSync(path.join(directory, `${page}-after-task34-staging.html`), "utf8");
  const window = new Window({
    url: `https://offline.invalid/${page === "institutes-hit-2027" ? "institutes/hit-2027" : page}${page === "institutes-on-the-horizon" ? "?i=hit-2027" : ""}`,
    settings: {
      enableJavaScriptEvaluation: true,
      disableCSSFileLoading: true,
      disableJavaScriptFileLoading: true,
      disableIframePageLoading: true,
    },
  });
  const doc = window.document;
  // Parse without any scripts/resources, then keep only native inquiry content.
  doc.body.innerHTML = html
    .replace(/<script\b[\s\S]*?<\/script>/gi, "")
    .replace(/<(?:iframe|style)\b[\s\S]*?<\/(?:iframe|style)>/gi, "")
    .replace(/<(?:img|link)\b[^>]*>/gi, "");
  const form = doc.querySelector('form:has(input[name="Phone"])');
  assert.ok(form);
  const metadata = [
    ...doc.querySelectorAll(
      ".horizon-card-inner-wrap, .form-category-link, #attend-button, #speak-button, #partner-button",
    ),
  ]
    .map((e) => e.outerHTML)
    .join("");
  doc.body.innerHTML = metadata + form.outerHTML;
  const activeForm = doc.querySelector("form");
  const field = (id) => doc.getElementById(id);
  const recipient = () => field("field-recipient").value;
  const select = field("field-institute");
  const baseline = field("field-attend-address").value;
  const phone = activeForm.querySelector('[name="Phone"]');
  const checks = [];
  const record = (state, expected) => {
    assert.equal(recipient(), expected, `${page}: ${state}`);
    for (const value of ["", "+44 20 7946 0958 ext 12"]) {
      phone.value = value;
      const payload = new window.FormData(activeForm);
      assert.equal(payload.get("Phone"), value);
      assert.equal(payload.get("Recipient"), expected);
    }
    checks.push({ state, recipient: expected, phoneValues: ["", "+44 20 7946 0958 ext 12"] });
  };
  if (page === "institutes-hit-2027") {
    record("unchanged direct native route", "scolquhoun@ipmievents.com");
  } else {
    const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
    const legacy = scripts.find((s) =>
      page === "attend" ? s.includes("upcomingInsitutes") : s.includes("function setOutlineColors"),
    );
    assert.ok(legacy, "actual live initializer located");
    if (page === "attend") window.eval(readFileSync(jqueryFile, "utf8"));
    // Happy DOM does not implement the browser's Option constructor.
    window.Option = function (text, value) {
      const option = doc.createElement("option");
      option.text = text;
      option.value = value;
      return option;
    };
    // Window eval is used only for saved, reviewed first-party code and the
    // site's saved jQuery dependency. No network service/Webflow AJAX exists.
    window.eval(legacy);
    window.eval(bundle);
    doc.dispatchEvent(new window.Event("DOMContentLoaded"));
    await window.happyDOM.waitUntilComplete();
    const rows = [...doc.querySelectorAll("#upcoming-institutes .upcoming-institute")];
    const hitIndex =
      page === "attend"
        ? rows.findIndex((r) => r.dataset.slug === "hit-2027") + 1
        : [...select.options].findIndex((o) => o.dataset.slug === "hit-2027");
    assert.ok(hitIndex > 0);
    const choose = (index) => {
      select.selectedIndex = index;
      select.dispatchEvent(new window.Event("change", { bubbles: true }));
    };
    record("initial query/default", page === "attend" ? baseline : "scolquhoun@ipmievents.com");
    choose(hitIndex);
    record("HIT dropdown", "scolquhoun@ipmievents.com");
    choose(1);
    record("other event", baseline);
    choose(hitIndex);
    choose(0);
    record("selection cleared", baseline);
    if (page === "institutes-on-the-horizon") {
      doc
        .querySelector('.event-info[data-slug="hit-2027"]')
        .closest(".horizon-card-inner-wrap")
        .click();
      record("HIT card without change event", "scolquhoun@ipmievents.com");
    } else {
      choose(hitIndex);
      for (const [label, kind] of [
        ["Speak", "speak"],
        ["Partner", "partner"],
        ["Attend", "attend"],
      ]) {
        [...doc.querySelectorAll(".form-category-link")]
          .find((e) => e.querySelector(".form-category-label").textContent.trim() === label)
          .click();
        record(
          `HIT ${label}`,
          label === "Attend" ? "scolquhoun@ipmievents.com" : field(`field-${kind}-address`).value,
        );
      }
      field("speak-button").click();
      record(
        "section Speak CTA triggers existing category handler",
        field("field-speak-address").value,
      );
      field("attend-button").click();
      record("section Attend CTA restores HIT", "scolquhoun@ipmievents.com");
    }
  }
  results.push({ page, checks });
  await window.happyDOM.close();
}
console.log(
  JSON.stringify(
    {
      scope:
        "Offline published HTML + actual saved legacy initializers + pinned supplement. Standard FormData only; no Webflow AJAX, CAPTCHA, webhook, notification or actual delivery tested.",
      results,
    },
    null,
    2,
  ),
);
