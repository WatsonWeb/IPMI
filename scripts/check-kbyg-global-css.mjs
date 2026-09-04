import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const expectedHash = "80ef3c254bef30f97398b63b0888a934085bb9b371ce4ee74e2e6b20befe4496";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const css = await readFile(path.join(root, "ipmi-custom-styles.css"));
const actualHash = createHash("sha256").update(css).digest("hex");

if (actualHash !== expectedHash) {
  console.error(`ipmi-custom-styles.css changed: expected ${expectedHash}, received ${actualHash}`);
  process.exitCode = 1;
} else {
  console.log(`Global stylesheet unchanged (${actualHash}).`);
}
