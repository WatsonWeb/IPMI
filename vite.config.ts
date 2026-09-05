import { defineConfig } from "vite-plus";

import { browserEnvironments } from "./scripts/frontend-entries.ts";
import { styleReviewPlugin } from "./scripts/style-review.ts";
import { webflowAssetsPlugin } from "./scripts/webflow-assets-plugin.ts";

export default defineConfig({
  appType: "custom",
  publicDir: false,
  plugins: [webflowAssetsPlugin(), styleReviewPlugin()],
  server: { host: "127.0.0.1", port: 5173, strictPort: true },
  preview: { host: "127.0.0.1", port: 4173, strictPort: true },
  // Native Vite app builder: independent Webflow-compatible IIFE entries,
  // all built from TypeScript rather than copied published JavaScript.
  builder: {},
  environments: browserEnvironments(),
  build: {
    outDir: "dist",
    emptyOutDir: false,
    copyPublicDir: false,
    cssMinify: false,
    minify: "oxc",
    sourcemap: true,
    target: "es2020",
  },
  fmt: {
    ignorePatterns: [
      "**/*", "!src/", "!src/**", "!scripts/", "!scripts/**", "!tests/", "!tests/**",
      "!assets/", "!assets/kbyg/", "!assets/kbyg/*.json", "!assets/kbyg/photos/", "!assets/kbyg/photos/*.md",
      "!Page HTML/", "!Page HTML/KBYG Pages/", "!Page HTML/KBYG Pages/**",
      "!docs/", "!docs/**", "!*.md", "!vite.config.ts", "!tsconfig.json", "!package.json", "!pnpm-workspace.yaml",
    ],
  },
  lint: {
    ignorePatterns: ["dist/**", "js/**", "Page HTML/**", "assets/**"],
    options: { typeAware: true, typeCheck: true },
  },
  test: {
    include: ["tests/**/*.test.ts"],
    environment: "node",
    testTimeout: 20000,
    hookTimeout: 30000,
  },
  // Optional compiled helpers for browser QA hosts that cannot import .ts.
  // These are tooling artifacts, never part of the public site deployment.
  pack: {
    entry: {
      "style-browser-probe": "scripts/style-browser-probe.ts",
      "compare-style-probes": "scripts/compare-style-probes.ts",
    },
    outDir: ".webflow/review-tools",
    clean: false,
    format: ["esm"],
    platform: "node",
    target: "node22",
    dts: false,
    sourcemap: false,
  },
});
