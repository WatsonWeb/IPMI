import expected from "../tests/fixtures/style-baseline.json" with { type: "json" };

import {
  assertCaptureSource,
  captureStyleBaseline,
  compareStyleBaselines,
} from "./style-baseline.ts";

const args = process.argv.slice(2);
try {
  if (args.includes("--capture")) {
    const confirmation = args.find((arg) => arg.startsWith("--confirm-source-commit="));
    if (args.length !== 2 || !confirmation)
      throw new Error(
        "Use --capture --confirm-source-commit=<full HEAD SHA> to print a reviewed baseline; no files are written.",
      );
    const commit = confirmation.slice("--confirm-source-commit=".length);
    assertCaptureSource(commit);
    const baseline = await captureStyleBaseline();
    assertCaptureSource(commit);
    console.log(JSON.stringify(baseline, null, 2));
  } else {
    if (args.length) throw new Error(`Unknown arguments: ${args.join(" ")}`);
    const actual = await captureStyleBaseline();
    const failures = compareStyleBaselines(expected, actual);
    if (failures.length) throw new Error(failures.join("\n"));
    console.log(
      "Style baseline passed: KBYG build/artifact and legacy global artifact are byte-identical; modern global rebuild is unchanged in memory. No CSS files written.",
    );
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
