import { readFile } from "node:fs/promises";

export interface StyleSample {
  selector: string;
  index: number;
  visible: boolean;
  size: [number, number];
  style: Record<string, string>;
  before: Record<string, string>;
  after: Record<string, string>;
}
export interface StyleCapture {
  path: string;
  width: number;
  scrollWidth: number;
  audience: string | null;
  stylesheetUrls: string[];
  kbygImports: string[];
  sections: { id: string; width: number; height: number }[];
  contentOverflow: string[];
  samples: StyleSample[];
}
type ProbePath = readonly (string | number)[];
export interface ProbeDifference {
  path: string;
  legacyPresent: boolean;
  currentPresent: boolean;
  legacy: unknown;
  current: unknown;
  accepted: boolean;
  reason: string | null;
}
export interface StyleProbeReport {
  passed: boolean;
  summary: {
    legacyCaptures: number;
    currentCaptures: number;
    rawDifferences: number;
    acceptedDifferences: number;
    unexpectedDifferences: number;
    coverageIssues: number;
  };
  coverageIssues: string[];
  rawDifferences: ProbeDifference[];
  acceptedDifferences: ProbeDifference[];
  unexpectedDifferences: ProbeDifference[];
}
interface PageCoverage {
  isKbyg: boolean;
  audience: unknown;
  widths: unknown[];
  sampleCoverage: unknown[][];
}
const unknownArray = (value: unknown): value is unknown[] => Array.isArray(value);

export const reviewWidths = Object.freeze({
  kbyg: [320, 375, 479, 480, 767, 768, 991, 992, 1199, 1200, 1279, 1280, 1440, 1920],
  site: [375, 768, 991, 992, 1280, 1920],
});
export const sampleProperties = Object.freeze([
  "display",
  "position",
  "box-sizing",
  "font-family",
  "font-size",
  "font-weight",
  "line-height",
  "letter-spacing",
  "text-transform",
  "color",
  "background-color",
  "background-image",
  "border-radius",
  "border-top-width",
  "border-top-color",
  "padding-top",
  "padding-right",
  "padding-bottom",
  "padding-left",
  "margin-top",
  "margin-bottom",
  "gap",
  "grid-template-columns",
  "box-shadow",
  "overflow-x",
  "opacity",
  "transform",
  "transition",
  "content",
  "--kbyg-accent",
  "--kbyg-accent-dark",
]);
export const siteSelectors = Object.freeze([
  "body",
  "h1",
  ".navbar",
  ".nav-container",
  ".desktop-menu",
  ".mobile-menu-button",
  ".button",
  ".footer",
]);
export const kbygSelectors = Object.freeze([
  ...siteSelectors,
  ".kbyg-page",
  ".kbyg-hero",
  ".kbyg-hero__title",
  ".kbyg-button",
  ".kbyg-section__title",
  ".kbyg-section__eyebrow",
  ".kbyg-rich-text",
  ".kbyg-icon-card",
  ".kbyg-icon",
  ".kbyg-jump",
  ".kbyg-jump__select-wrap",
  ".kbyg-date-card",
  ".kbyg-agenda-card",
  ".kbyg-contact-card",
  ".kbyg-curve",
]);

const isObject = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === "object" && !unknownArray(value);
const finiteNonnegative = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value) && value >= 0;
const stringArray = (value: unknown): value is string[] =>
  unknownArray(value) && value.every((item) => typeof item === "string");
const equal = (left: unknown, right: unknown): boolean =>
  JSON.stringify(left) === JSON.stringify(right);

function validateCaptures(captures: unknown, label: string): string[] {
  const issues: string[] = [];
  const pages = new Map<unknown, PageCoverage>();
  if (!unknownArray(captures) || !captures.length)
    return [`${label}: captures must be a nonempty array.`];
  for (const [index, capture] of captures.entries()) {
    const at = `${label}[${index}]`;
    if (!isObject(capture)) {
      issues.push(`${at}: missing capture object.`);
      continue;
    }
    if (
      typeof capture.path !== "string" ||
      !capture.path.startsWith("/") ||
      !finiteNonnegative(capture.width) ||
      capture.width === 0
    ) {
      issues.push(`${at}: invalid page/viewport identity.`);
    }
    if (!finiteNonnegative(capture.scrollWidth))
      issues.push(`${at}: scrollWidth is missing or invalid.`);
    if (
      capture.audience !== null &&
      capture.audience !== "sponsor" &&
      capture.audience !== "delegate"
    )
      issues.push(`${at}: audience is missing or invalid.`);
    const isKbyg =
      typeof capture.path === "string" && capture.path.startsWith("/know-before-you-go/");
    if (isKbyg !== (capture.audience === "sponsor" || capture.audience === "delegate")) {
      issues.push(`${at}: page and audience coverage disagree.`);
    }
    if (!stringArray(capture.stylesheetUrls) || !capture.stylesheetUrls.length)
      issues.push(`${at}: stylesheet coverage is incomplete.`);
    if (!stringArray(capture.kbygImports) || capture.kbygImports.length !== (isKbyg ? 1 : 0)) {
      issues.push(`${at}: KBYG import coverage is incomplete or duplicated.`);
    }
    if (!stringArray(capture.contentOverflow))
      issues.push(`${at}: overflow capture is missing or invalid.`);
    if (!unknownArray(capture.sections) || (isKbyg && !capture.sections.length)) {
      issues.push(`${at}: section coverage is incomplete.`);
    } else {
      const ids = new Set();
      for (const section of capture.sections) {
        if (
          !isObject(section) ||
          typeof section.id !== "string" ||
          !section.id ||
          !finiteNonnegative(section.width) ||
          !finiteNonnegative(section.height) ||
          ids.has(section.id)
        ) {
          issues.push(`${at}: invalid or duplicate section capture.`);
        }
        if (isObject(section)) ids.add(section.id);
      }
    }
    if (!unknownArray(capture.samples) || !capture.samples.length) {
      issues.push(`${at}: sample coverage is empty or missing.`);
      continue;
    }
    const selectorCounts = new Map<unknown, number>();
    for (const [sampleIndex, sample] of capture.samples.entries()) {
      const sampleAt = `${at}.samples[${sampleIndex}]`;
      if (!isObject(sample)) {
        issues.push(`${sampleAt}: sample object is missing.`);
        continue;
      }
      const expectedIndex = selectorCounts.get(sample.selector) ?? 0;
      if (
        typeof sample.selector !== "string" ||
        sample.index !== expectedIndex ||
        expectedIndex >= 6
      ) {
        issues.push(`${sampleAt}: selector/index coverage is invalid, reordered, or duplicated.`);
      }
      selectorCounts.set(sample.selector, expectedIndex + 1);
      if (
        typeof sample.visible !== "boolean" ||
        !unknownArray(sample.size) ||
        sample.size.length !== 2 ||
        !sample.size.every(finiteNonnegative)
      ) {
        issues.push(`${sampleAt}: geometry/visibility capture is incomplete.`);
      }
      for (const target of ["style", "before", "after"]) {
        if (
          !isObject(sample[target]) ||
          !equal(Object.keys(sample[target]), sampleProperties) ||
          !Object.values(sample[target]).every((value) => typeof value === "string")
        ) {
          issues.push(
            `${sampleAt}.${target}: computed-property coverage is incomplete or reordered.`,
          );
        }
      }
    }
    if (!equal([...selectorCounts.keys()], isKbyg ? kbygSelectors : siteSelectors)) {
      issues.push(`${at}: required selector coverage is incomplete or reordered.`);
    }
    const sampleCoverage = capture.samples.map((sample) =>
      isObject(sample) ? [sample.selector, sample.index] : [undefined, undefined],
    );
    const page = pages.get(capture.path) ?? {
      isKbyg,
      audience: capture.audience,
      widths: [],
      sampleCoverage,
    };
    if (page.widths.includes(capture.width)) issues.push(`${at}: duplicate page/viewport capture.`);
    if (!equal(page.sampleCoverage, sampleCoverage))
      issues.push(`${at}: sample coverage differs across this page's viewports.`);
    if (page.audience !== capture.audience)
      issues.push(`${at}: audience changes across this page's viewports.`);
    page.widths.push(capture.width);
    pages.set(capture.path, page);
  }
  for (const [pagePath, page] of pages) {
    if (!equal(page.widths, reviewWidths[page.isKbyg ? "kbyg" : "site"])) {
      issues.push(
        `${label}: ${typeof pagePath === "string" ? pagePath : "(invalid path)"} has incomplete or reordered viewport coverage.`,
      );
    }
  }
  return issues;
}

function pathLabel(segments: ProbePath): string {
  return `$${segments.map((segment) => (typeof segment === "number" ? `[${segment}]` : `.${segment}`)).join("")}`;
}

export function acceptedDifferenceReason(
  segments: ProbePath,
  legacy: unknown,
  current: unknown,
): string | null {
  if (typeof legacy !== "string" || typeof current !== "string" || !Number.isInteger(segments[0]))
    return null;
  if (segments.length === 3 && segments[1] === "stylesheetUrls" && Number.isInteger(segments[2])) {
    const match = legacy.match(
      /^(http:\/\/(?:127\.0\.0\.1|localhost)(?::\d+)?)?\/__style-review\/legacy\/(ipmi-(?:custom|kbyg)-styles\.css)$/,
    );
    if (match && current === `${match[1] ?? ""}/${match[2]}`) {
      return "Exact local preview path mapping; stylesheet identity and origin are unchanged.";
    }
  }
  if (segments.length === 3 && segments[1] === "kbygImports" && Number.isInteger(segments[2])) {
    const oldImport = '@import url("/__style-review/legacy/ipmi-kbyg-styles.css");';
    const newImport = '@import url("/ipmi-kbyg-styles.css");';
    if (legacy.startsWith(oldImport) && current === newImport + legacy.slice(oldImport.length)) {
      return "Exact KBYG preview import path mapping; all other embedded CSS is byte-identical.";
    }
  }
  if (
    segments.length === 5 &&
    segments[1] === "samples" &&
    Number.isInteger(segments[2]) &&
    ["style", "before", "after"].includes(String(segments[3])) &&
    segments[4] === "transition" &&
    legacy === "transform 0.2s, opacity 0.2s, -webkit-transform 0.2s" &&
    current === "transform 0.2s, opacity 0.2s"
  ) {
    return "Exact redundant -webkit-transform transition alias removed; standard transform and opacity timing are unchanged.";
  }
  return null;
}

export function compareStyleProbes(legacy: unknown, current: unknown): StyleProbeReport {
  const coverageIssues = [
    ...validateCaptures(legacy, "legacy"),
    ...validateCaptures(current, "current"),
  ];
  const rawDifferences: ProbeDifference[] = [];
  function record(
    segments: ProbePath,
    before: unknown,
    after: unknown,
    beforePresent = true,
    afterPresent = true,
  ): void {
    const reason =
      beforePresent && afterPresent ? acceptedDifferenceReason(segments, before, after) : null;
    rawDifferences.push({
      path: pathLabel(segments),
      legacyPresent: beforePresent,
      currentPresent: afterPresent,
      legacy: beforePresent ? before : null,
      current: afterPresent ? after : null,
      accepted: reason !== null,
      reason,
    });
  }
  function walk(before: unknown, after: unknown, segments: ProbePath = []): void {
    if (Object.is(before, after)) return;
    if (unknownArray(before) && unknownArray(after)) {
      if (before.length !== after.length)
        record([...segments, "length"], before.length, after.length);
      for (let index = 0; index < Math.max(before.length, after.length); index += 1) {
        if (index >= before.length || index >= after.length)
          record(
            [...segments, index],
            before[index],
            after[index],
            index < before.length,
            index < after.length,
          );
        else walk(before[index], after[index], [...segments, index]);
      }
    } else if (isObject(before) && isObject(after)) {
      if (!equal(Object.keys(before), Object.keys(after)))
        record([...segments, "[keys]"], Object.keys(before), Object.keys(after));
      for (const key of new Set([...Object.keys(before), ...Object.keys(after)])) {
        if (!Object.hasOwn(before, key) || !Object.hasOwn(after, key))
          record(
            [...segments, key],
            before[key],
            after[key],
            Object.hasOwn(before, key),
            Object.hasOwn(after, key),
          );
        else walk(before[key], after[key], [...segments, key]);
      }
    } else record(segments, before, after);
  }
  walk(legacy, current);
  const acceptedDifferences = rawDifferences.filter((difference) => difference.accepted);
  const unexpectedDifferences = rawDifferences.filter((difference) => !difference.accepted);
  return {
    passed: coverageIssues.length === 0 && unexpectedDifferences.length === 0,
    summary: {
      legacyCaptures: unknownArray(legacy) ? legacy.length : 0,
      currentCaptures: unknownArray(current) ? current.length : 0,
      rawDifferences: rawDifferences.length,
      acceptedDifferences: acceptedDifferences.length,
      unexpectedDifferences: unexpectedDifferences.length,
      coverageIssues: coverageIssues.length,
    },
    coverageIssues,
    rawDifferences,
    acceptedDifferences,
    unexpectedDifferences,
  };
}

if (import.meta.main) {
  try {
    if (process.argv.length !== 4)
      throw new Error(
        "Usage: vp node scripts/compare-style-probes.ts <legacy.json> <current.json>",
      );
    const [legacy, current] = await Promise.all(
      process.argv
        .slice(2)
        .map(async (file): Promise<unknown> => JSON.parse(await readFile(file, "utf8"))),
    );
    const report = compareStyleProbes(legacy, current);
    console.log(JSON.stringify(report, null, 2));
    if (!report.passed) process.exitCode = 1;
  } catch (error) {
    console.log(
      JSON.stringify(
        { passed: false, error: error instanceof Error ? error.message : String(error) },
        null,
        2,
      ),
    );
    process.exitCode = 1;
  }
}
