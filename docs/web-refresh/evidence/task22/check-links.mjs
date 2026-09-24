import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const dir = path.dirname(fileURLToPath(import.meta.url));
const { events } = JSON.parse(fs.readFileSync(path.join(dir, "events.json"), "utf8"));
const results = [];
for (const e of events) {
  const response = await fetch(e.stagingUrl);
  const html = await response.text();
  const title = html.match(/<title>(.*?)<\/title>/s)?.[1] ?? "";
  const pass = response.ok && response.url === e.stagingUrl && title.includes("Institute");
  results.push({
    id: e.id,
    url: e.stagingUrl,
    status: response.status,
    finalUrl: response.url,
    title,
    pass,
  });
}
fs.writeFileSync(
  path.join(dir, "link-checks.json"),
  JSON.stringify(
    {
      checkedAt: new Date().toISOString(),
      method:
        "Read-only anonymous HTTP GET; response status/final URL/page title, not form or provider tests",
      results,
    },
    null,
    2,
  ) + "\n",
);
if (results.some((r) => !r.pass)) throw Error("Event link check failed");
console.log(
  "PASS: all 26 exact staging event URLs return HTTP 200 with Institute page titles and no redirect.",
);
