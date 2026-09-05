# IPMI Webflow frontend

Strict TypeScript browser behavior and Sass styles for the IPMI Webflow site.
Vite+ is the supported development, build, formatting, typed-lint and test
toolchain. Maintained first-party JavaScript, tests and tooling are TypeScript;
CodeKit, the old `.mjs` tooling and the handwritten root KBYG runtime are retired.
Custom browser code uses native DOM APIs and `fetch`; neither the runtime nor
the test/tooling dependencies require jQuery.

## Development

Run from the repository root:

```sh
vp install
vp dev
vp check
vp test --run
vp build
vp preview
vp run verify
```

- `vp dev` serves real TypeScript entries and baseline-safe compiled CSS.
- `vp check` runs formatting, strict type checking and type-aware lint. Vendor
  code and historical Webflow exports are excluded from maintained source checks.
- `vp test --run` runs TypeScript tests, including DOM-backed happy-dom behavior,
  native Vite builds/source maps, review rewriting, and stylesheet/CMS contracts.
- `vp build` creates two CSS assets and 15 independent minified IIFE scripts,
  each with a `.js.map`, under `dist/`. Entries are discovered from
  `src/entries/*.ts`; output names match the source basenames.
- `vp preview` serves the built output. Run `vp build` first.
- `vp run verify` runs the complete check/build/test/baseline/CMS validation chain.

Validation scripts use `node scripts/*.ts` inside `package.json`, run through
Vite+'s task runner. Do not nest `vp node` there: the local Vite+ npm shim can
shadow the global CLI and lacks that subcommand. At the terminal, `vp node`
remains the supported direct-script command.

Builds do not clear `dist/`, overwrite root compatibility CSS, copy arbitrary
repository files, or publish. Remove obsolete release artifacts deliberately
when packaging a release. `vp pack` optionally builds browser-review helper
modules into ignored `.webflow/review-tools/`; those are not site assets.

## Local before/after review

Open `/__style-review` on the development or preview server. Four explicit
staging routes are fetched read-only and cached once per server run: homepage,
Institute, KBYG Sponsor and KBYG Delegate. Both views reuse the same HTML.

Current views replace recognized first-party inline/runtime scripts and
stylesheet URLs with local TypeScript development entries or built IIFEs.
`?style-baseline=legacy` retains published JavaScript and uses frozen CSS.
Vendor scripts, native CMS configuration and unrelated markup are preserved.
Unrecognized first-party script layouts fail closed instead of silently
installing duplicate handlers. Network access to staging/vendor assets is
required; the local review makes no Webflow or CMS writes.

## Source and stylesheet ownership

- `src/entries/`: 15 page-specific browser entrypoints, including `site` and
  `ipmi-kbyg`.
- `src/site/`: native global/page behavior and narrow interfaces for existing
  external Swiper and statistics integrations.
- `src/kbyg/`: KBYG behavior and browser API.
- `scripts/`: typed compilation, baseline, validation and review tooling.
- `tests/`: TypeScript behavior, build and regression tests.

Webflow's platform-injected jQuery is outside these bundles and remains untouched
for its own components. Do not add a custom jQuery import or remove Webflow's
managed scripts as part of deploying this code. Tests run our code without that
global, including every built entrypoint. See [Webflow's custom-code guidance](https://help.webflow.com/hc/en-us/articles/33961332238611-Custom-code-embed).

The former jQuery-based WebP loader is also replaced by native detection and
conditional dependency loading inside `site.js`. Remove its old standalone
script tag when deploying; browsers with WebP support load no fallback decoder.

The global and KBYG stylesheets remain separate delivered assets. Both reuse
non-emitting primitives in `global/colors.scss`,
`global/_typography-primitives.scss` and `modules/_button-primitives.scss`.
Do not import emitting global modules into KBYG. KBYG layout, distinct shades
and `.kbyg-page` scoping remain in `ipmi-kbyg-styles.scss`; existing Institute
layout continues to use native Webflow styling.

## Frozen CSS baseline

`tests/fixtures/style-baseline.json` independently protects the legacy root
global CSS, the modern global compilation, and the matching KBYG artifact/build.
The TypeScript/toolchain migration does not relax these fingerprints or change
CSS output. Modern global CSS intentionally differs from the old legacy artifact
only through the previously reviewed obsolete-prefix removal.

```sh
vp run check:styles:baseline
vp node scripts/compare-style-probes.ts BEFORE_CAPTURE.json AFTER_CAPTURE.json
```

For an intentional future design change, review its visual effect first, commit
the stylesheet changes, then print and explicitly review a candidate baseline:

```sh
vp node scripts/check-style-baseline.ts --capture --confirm-source-commit=FULL_HEAD_SHA
```

Capture rejects dirty/untracked stylesheet sources and mismatched commit IDs;
checks never silently refresh fixtures. Historical results are recorded in
[the stylesheet review](docs/STYLE-CLEANUP-BASELINE.md). Current migration scope
and validation status are in [the TypeScript migration](docs/TYPESCRIPT-MIGRATION.md).

## Deployment

No deployment is performed by these commands. `dist/` is ignored. The literal
`__ASSET_COMMIT_SHA__` URLs in maintained snippets require a real approved release
containing those artifacts; a local build alone does not make CDN URLs available.
Install `site.js` once globally and only the matching page bundle, removing
replaced inline/standalone initializers. Keep required vendor scripts before
deferred first-party entries. See the [page migration inventory](docs/JAVASCRIPT-MIGRATION-INVENTORY.md)
for bundle mappings, the recap CMS password chip rebind, retained historical
exports/admin data, coverage limits and release steps.

KBYG's native `Custom Styles` embed remains its single CSS source for Designer
and published pages. Preserve both native Institute color chips and keep the
import before their declarations. Do not add a duplicate KBYG import to Head
code. JavaScript stays separate; Designer styling does not require it.
