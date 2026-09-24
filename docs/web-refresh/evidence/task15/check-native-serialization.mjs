// Offline DOM check of saved published markup. No scripts, network or submission.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { Window } from "happy-dom";

const results = [];
for (const file of process.argv.slice(2)) {
  const window = new Window({
    settings: {
      disableJavaScriptEvaluation: true,
      disableCSSFileLoading: true,
      disableJavaScriptFileLoading: true,
    },
  });
  const html = readFileSync(file, "utf8");
  // Parse only the native inquiry form, avoiding all external scripts and assets.
  const formMarkup = [...html.matchAll(/<form\b[\s\S]*?<\/form>/gi)]
    .map((m) => m[0])
    .find((s) => /name="Phone"/.test(s));
  assert.ok(formMarkup, file);
  window.document.body.innerHTML = formMarkup
    .replace(/<script\b[\s\S]*?<\/script>/gi, "")
    .replace(/<iframe\b[\s\S]*?<\/iframe>/gi, "");
  const form = window.document.querySelector("form");
  const phone = form.querySelector('input[name="Phone"]');
  assert.equal(form.querySelectorAll('input[name="Phone"]').length, 1);
  assert.equal(phone.type, "tel");
  assert.equal(phone.required, false);
  assert.equal(phone.getAttribute("autocomplete"), "tel");
  assert.equal(
    window.document.querySelector(`label[for="${phone.id}"]`).textContent,
    "Phone number (optional)",
  );
  const required = [...form.querySelectorAll("[required]")].map((e) => ({
    id: e.id,
    missing: e.validity.valueMissing,
  }));
  assert.ok(required.some((e) => e.missing));
  const values = ["", "+44 20 7946 0958 ext 12", "+1 (416) 555-0100 x 7"];
  for (const value of values) {
    phone.value = value;
    assert.equal(phone.validity.valid, true);
    assert.equal(new window.FormData(form).get("Phone"), value);
  }
  results.push({ file, phoneId: phone.id, required, values, passed: true });
  await window.happyDOM.close();
}
console.log(
  JSON.stringify(
    {
      scope:
        "Offline standard FormData from published markup; does not verify Webflow AJAX payload, webhook receipt, CAPTCHA, delivery, success or failure",
      results,
    },
    null,
    2,
  ),
);
