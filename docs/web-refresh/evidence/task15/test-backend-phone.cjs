// Pure renderer test. Pass the patched email directory; never imports the server.
const assert = require("node:assert/strict");
const path = require("node:path");
const { renderFormEmail, createTemplateData } = require(path.resolve(process.argv[2], "index.js"));

(async () => {
  const results = [];
  for (const form of ["Contact Form", "Attend Request", "Invitation Request"]) {
    const baseline = {
      Name: "Synthetic QA",
      Email: "qa@example.invalid",
      Category: "Attend",
      Company: "QA",
      Recipient: "unchanged@example.invalid",
    };
    for (const Phone of [
      undefined,
      "",
      "   ",
      "+44 20 7946 0958 ext 12",
      "+1 (416) 555-0100 x 7",
      '<img src=x onerror="test">&\'',
    ]) {
      const data = { ...baseline, Phone };
      const html = await renderFormEmail(form, data);
      assert.equal(html.includes("Phone:</span>"), Boolean(Phone?.trim()));
      assert.ok(!html.includes("{{phone}}"));
      if (Phone?.startsWith("+")) assert.ok(html.includes(Phone));
      if (Phone?.startsWith("<")) {
        assert.ok(html.includes("&lt;img src=x onerror=&quot;test&quot;&gt;&amp;&#39;"));
        assert.ok(!html.includes("<img src=x"));
      }
      const mapped = createTemplateData(data, form);
      assert.equal(mapped.name, baseline.Name);
      assert.equal(mapped.email, baseline.Email);
      if (form !== "Contact Form") assert.equal(mapped.category, baseline.Category);
      assert.equal(data.Recipient, baseline.Recipient);
      results.push({ form, phone: Phone ?? null, passed: true });
    }
  }
  console.log(
    JSON.stringify(
      {
        scope:
          "Local optional Phone HTML rendering only; no server import, network, webhook or delivery",
        results,
      },
      null,
      2,
    ),
  );
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
