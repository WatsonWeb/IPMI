import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import browserslist from "browserslist";
import postcss, { type ChildNode } from "postcss";
import postcssPackage from "postcss/package.json" with { type: "json" };
import autoprefixerPackage from "autoprefixer/package.json" with { type: "json" };
import * as sass from "sass";

import { compileStylesheet } from "./compile-styles.ts";

export const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export interface CssFingerprint {
  bytes: number;
  sha256: string;
  orderedAstSha256: string;
  orderedNodeHashes: string[];
}
export const baselineStylesheetNames = [
  "kbygArtifact",
  "kbygBuild",
  "globalArtifact",
  "globalBuild",
] as const;
export type BaselineStylesheetName = (typeof baselineStylesheetNames)[number];
export interface StyleBaseline {
  version: number;
  sourceCommit: string;
  purpose: string;
  toolchain: {
    sass: string;
    postcss: string;
    autoprefixer: string;
    browsers: string[];
    lockfileSha256: string;
  };
  compilerOptions: {
    charset: boolean;
    sourceMap: boolean;
    kbygStyle: string;
    globalStyle: string;
    autoprefixer: string;
  };
  legacyGlobalArtifactDiffersFromModernBuild: boolean;
  stylesheets: Record<BaselineStylesheetName, CssFingerprint>;
}
type CssTreeNode =
  | ["decl", string, string, boolean]
  | ["rule", string, CssTreeNode[] | undefined]
  | ["atrule", string, string, CssTreeNode[] | null];

export function sha256(value: string | Uint8Array): string {
  return createHash("sha256").update(value).digest("hex");
}

// Arrays deliberately preserve rule, declaration, fallback, and at-rule order.
// Only non-rendering comments and formatting metadata are excluded.
export function orderedCssTree(css: string): CssTreeNode[] {
  function serialize(node: ChildNode): CssTreeNode {
    if (node.type === "decl") return [node.type, node.prop, node.value, node.important === true];
    const children =
      "nodes" in node
        ? node.nodes?.filter((child) => child.type !== "comment").map(serialize)
        : undefined;
    if (node.type === "rule") return [node.type, node.selector, children];
    if (node.type === "atrule") return [node.type, node.name, node.params, children ?? null];
    throw new Error(`Unsupported CSS node in baseline: ${node.type}`);
  }
  return postcss
    .parse(css)
    .nodes.filter((node) => node.type !== "comment")
    .map(serialize);
}

export function cssFingerprint(css: string): CssFingerprint {
  const orderedTree = orderedCssTree(css);
  return {
    bytes: Buffer.byteLength(css),
    sha256: sha256(css),
    orderedAstSha256: sha256(JSON.stringify(orderedTree)),
    // Retaining one hash per top-level subtree pinpoints the first changed
    // selector/media group without storing duplicate stylesheet fixtures.
    orderedNodeHashes: orderedTree.map((node) => sha256(JSON.stringify(node))),
  };
}

export async function captureStyleBaseline(root = projectRoot): Promise<StyleBaseline> {
  const [kbygArtifact, globalArtifact, kbygBuild, globalBuild, lockfile] = await Promise.all([
    readFile(path.join(root, "ipmi-kbyg-styles.css"), "utf8"),
    readFile(path.join(root, "ipmi-custom-styles.css"), "utf8"),
    compileStylesheet("ipmi-kbyg-styles", root),
    compileStylesheet("ipmi-custom-styles", root),
    readFile(path.join(root, "pnpm-lock.yaml")),
  ]);
  return {
    version: 1,
    sourceCommit: execFileSync("git", ["rev-parse", "HEAD"], {
      cwd: root,
      encoding: "utf8",
    }).trim(),
    purpose: "No-render-change shared Sass cleanup; never regenerate the legacy global artifact.",
    toolchain: {
      sass: sass.info.split("\n")[0] ?? sass.info,
      postcss: postcssPackage.version,
      autoprefixer: autoprefixerPackage.version,
      browsers: browserslist(undefined, { path: root }),
      lockfileSha256: sha256(lockfile),
    },
    compilerOptions: {
      charset: false,
      sourceMap: false,
      kbygStyle: "expanded",
      globalStyle: "compressed",
      autoprefixer: "default targets resolved above; no custom overrides",
    },
    legacyGlobalArtifactDiffersFromModernBuild: globalArtifact !== globalBuild.css,
    stylesheets: {
      kbygArtifact: cssFingerprint(kbygArtifact),
      kbygBuild: cssFingerprint(kbygBuild.css),
      globalArtifact: cssFingerprint(globalArtifact),
      globalBuild: cssFingerprint(globalBuild.css),
    },
  };
}

export function compareStyleBaselines(expected: StyleBaseline, actual: StyleBaseline): string[] {
  const failures: string[] = [];
  for (const name of ["sass", "postcss", "autoprefixer", "browsers"] as const) {
    if (JSON.stringify(expected.toolchain[name]) !== JSON.stringify(actual.toolchain[name])) {
      failures.push(`Toolchain ${name} differs from the frozen baseline.`);
    }
  }
  if (JSON.stringify(expected.compilerOptions) !== JSON.stringify(actual.compilerOptions)) {
    failures.push("Compiler options differ from the frozen baseline.");
  }
  for (const name of baselineStylesheetNames) {
    const before = expected.stylesheets[name];
    const after = actual.stylesheets[name];
    if (before.sha256 !== after?.sha256 || before.bytes !== after?.bytes) {
      failures.push(
        `${name}: expected ${before.bytes} bytes / ${before.sha256}, received ${after?.bytes} bytes / ${after?.sha256}.`,
      );
    }
    if (before.orderedAstSha256 !== after?.orderedAstSha256) {
      const count = Math.max(before.orderedNodeHashes.length, after?.orderedNodeHashes.length ?? 0);
      let index = 0;
      while (index < count && before.orderedNodeHashes[index] === after?.orderedNodeHashes[index])
        index += 1;
      failures.push(
        `${name}: ordered CSS tree changed at top-level node ${index + 1}; selectors, declarations, or at-rule context/order differ.`,
      );
    }
  }
  if (actual.stylesheets.kbygArtifact.sha256 !== actual.stylesheets.kbygBuild.sha256) {
    failures.push("The checked-in KBYG artifact does not match its source build.");
  }
  if (
    expected.legacyGlobalArtifactDiffersFromModernBuild !==
    actual.legacyGlobalArtifactDiffersFromModernBuild
  ) {
    failures.push("The known legacy/modern global build relationship changed.");
  }
  return failures;
}

// Capture is explicit and read-only. It prints JSON for a reviewed fixture
// update; neither check nor capture silently rewrites a baseline or CSS file.
export function assertCaptureSource(commit: string | undefined, root = projectRoot): void {
  if (!/^[a-f0-9]{40}$/.test(commit ?? "")) {
    throw new Error("Capture requires --confirm-source-commit=<full 40-character HEAD SHA>.");
  }
  const git = (...args: string[]): string =>
    execFileSync("git", args, { cwd: root, encoding: "utf8" }).trim();
  if (git("rev-parse", "HEAD") !== commit)
    throw new Error("Capture commit must equal current HEAD.");
  const changed = git("diff", "--name-only", commit, "--", "*.scss", "*.css", "pnpm-lock.yaml");
  const untracked = git("ls-files", "--others", "--exclude-standard")
    .split("\n")
    .filter((name) => /\.(scss|css)$/.test(name));
  if (changed || untracked.length) {
    throw new Error(
      `Capture requires unchanged stylesheet sources/artifacts and lockfile. Changes: ${[changed, ...untracked].filter(Boolean).join(", ")}`,
    );
  }
}
