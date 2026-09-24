# Shared-style cleanup and Vite+ baseline

> Historical phase report: the results below record the completed stylesheet-only cleanup. The subsequent TypeScript migration changes runtime/build ownership, removes the archived CodeKit tooling, and expands build output. See [TypeScript migration](TYPESCRIPT-MIGRATION.md) for current commands, scope and validation status; the historical measurements below are not a new runtime sign-off.

This is a source-organization and tooling refactor, not a redesign. KBYG keeps its separate, scoped stylesheet and native CMS accent bindings. Shared Sass palette tokens, typography primitives, and button effects are reused without importing global selectors into KBYG.

## Frozen baseline

The pre-cleanup source commit is `45f76b4e2d825ad03e9c70ac46203bd79b0d4b14`. The reviewed fixture at `tests/fixtures/style-baseline.json` records artifact hashes, ordered CSS trees, compiler settings, and browser targets. Do not regenerate it merely to make a failing check pass.

The checks distinguish two global outputs:

- The legacy root `ipmi-custom-styles.css` remains untouched and byte-identical to its baseline.
- The modern global compilation matches its separately frozen compiler baseline. It is intentionally not byte-identical to the legacy artifact.

KBYG's compiled CSS and root artifact remain byte-identical to their frozen baseline. Shared primitives emit no CSS by themselves. Regression tests also cover both entrypoints' dependency graphs, industry aliases, runtime color fallbacks, typography, button effects, and KBYG selector isolation.

The legacy-to-modern global audit found only obsolete WebKit compatibility output removal: 203 to 197 rules and 415 to 375 declarations. No retained values, selectors, declaration order, or at-rule order changed. Fonts, colors, geometry, and breakpoints are unchanged. Removed output includes prefixed transform/animation fallbacks, WebKit placeholder rules, and duplicate prefixed transition entries. The old source-map footer is not emitted by the modern build.

## Build and review workflow

```sh
vp install
vp run verify
vp dev
vp build
vp preview
```

`vp run verify` runs formatting/lint checks, the build, frozen-baseline and isolation checks, tests, and CMS validation. `vp run check:styles:baseline` runs the frozen stylesheet comparison alone.

Vite+ emits only `ipmi-custom-styles.css`, `ipmi-kbyg-styles.css`, and `ipmi-kbyg.js` into `dist/`; it does not overwrite published root assets. Preview serves the built assets. The former CodeKit configuration is archived under `docs/legacy/`.

Open `/__style-review` on the local development or preview server for paired frozen/current CSS views. `scripts/style-review.ts` fetches each of four explicit staging pages read-only once per server run and reuses the same HTML for both versions. It rewrites stylesheet URLs without Vite HTML transformation, preserving inline styles and the native KBYG import. Development adds only the Vite reload client; preview does not.

## Browser comparison coverage

Paired Chrome/CDP computed-style probes use this width matrix:

| Pages                     | Viewport widths in pixels                                                  |
| ------------------------- | -------------------------------------------------------------------------- |
| KBYG Sponsor and Delegate | 320, 375, 479, 480, 767, 768, 991, 992, 1199, 1200, 1279, 1280, 1440, 1920 |
| Homepage and Institute    | 375, 768, 991, 992, 1280, 1920                                             |

The comparison permits only review-URL mappings and the redundant, exact `-webkit-transform 0.2s` transition alias. Other differences require investigation. Homepage resize transitions need at least one second after resizing and a subsequent 600 ms stable interval before capture; transient animation measurements are not valid regressions.

Two pre-existing findings remain outside this cleanup:

- Homepage and Institute have 22 px horizontal overflow at 768 px in both frozen and current CSS views.
- All four captured pages contain two global stylesheet links, in the head and a hidden `Custom Styles` embed. Their delivery is unchanged; KBYG still has one KBYG import. Consolidating the existing global links is a separate follow-up.

Local screenshots and probe reports are under the ignored `.webflow/style-cleanup-2026-09-05/` directory. No Webflow writes or publishing were performed for this cleanup.

## Completed verification

The settled before/after run passed all 40 paired viewport states (80 captures):

- Sponsor: 14 pairs, 140 accepted differences.
- Delegate: 14 pairs, 140 accepted differences.
- Institute: 6 pairs, 54 accepted differences.
- Homepage: 6 pairs, 60 accepted differences.

All 394 raw differences are the exact preview URL mappings or redundant transition alias described above. There are zero unexpected differences and zero coverage gaps. Both KBYG variants have no document or content overflow at any tested width. Representative desktop, tablet, and mobile screenshots were inspected; no cleanup-induced visual discrepancy was found.

`scripts/compare-style-probes.ts` validates paired JSON captures and exits nonzero for unexpected differences or incomplete coverage. It preserves raw evidence and does not refresh baselines:

```sh
vp node scripts/compare-style-probes.ts .webflow/style-cleanup-2026-09-05/sponsor-legacy.json .webflow/style-cleanup-2026-09-05/sponsor-current.json
```

Chrome smoke checks on the modern local Sponsor preview confirmed:

- Calendar download succeeds; the generated all-day event starts July 22 and ends July 23, matching the displayed deadline without a timezone shift.
- Hotel photos open the native Webflow lightbox; Escape closes it.
- At 375 px, View All Key Dates expands three visible cards to four; keyboard Space collapses them again. At desktop width, the disclosure hides when all four dates are already visible.
- The shared mobile menu opens and closes, and the native section selector reaches Contact with the correct active state and sticky offset.
- Address and Sponsor Hub links retain `_blank` and `noopener noreferrer`. Sponsor Hub remains the requested placeholder; no external form or calendar event was submitted.
- No loaded KBYG image had a broken-image state.

The final `vp run verify` passed all 67 tests across 10 files, plus formatting, linting, build, frozen CSS fingerprints, selector isolation, markup, and CMS-model checks. Development asset responses and production preview assets were also checked against their expected compiled bytes. Published root CSS and runtime files remain unchanged.

## Limits

These comparisons cover Chrome, not every browser engine or older browsers requiring the removed prefixes. This is not a fresh Figma audit. The refactor and modern build have not been published; passing local checks does not constitute a production deployment.
