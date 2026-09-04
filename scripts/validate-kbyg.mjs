import { readFile } from "node:fs/promises";
import path from "node:path";

import { validateKbygModel } from "./kbyg-validator.mjs";

const inputPath = process.argv[2];
if (!inputPath) {
  console.error("Usage: vp run validate:kbyg -- <KBYG CMS export.json>");
  process.exit(2);
}

const model = JSON.parse(await readFile(path.resolve(inputPath), "utf8"));
const errors = validateKbygModel(model);

if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log("KBYG CMS model is valid.");
}
