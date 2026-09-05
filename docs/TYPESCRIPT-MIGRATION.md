# TypeScript and native Vite migration

This phase replaces maintained first-party JavaScript and legacy build tooling with strict TypeScript and native Vite+ builds. It is not a design change or a production deployment. The previous shared-Sass cleanup and frozen CSS outputs remain intact.

## Architecture and output

`vite.config.ts` uses Vite's native multi-environment application builder. Every `src/entries/*.ts` entry produces a standalone, minified classic IIFE and an external TypeScript source map. There are 15 browser entries:

| Scope                   | Entries / generated `.js` basenames                               |
| ----------------------- | ----------------------------------------------------------------- |
| Global and KBYG         | `site`, `ipmi-kbyg`                                               |
| Main pages              | `home`, `about`, `contact`, `attend`, `gallery`, `faq`, `horizon` |
| CMS templates and lists | `institute`, `institutes`, `recap`, `recaps`, `vtt`, `vtt-list`   |

Output is `dist/<entry>.js` plus `dist/<entry>.js.map`, alongside `ipmi-custom-styles.css` and `ipmi-kbyg-styles.css`. Scripts have no runtime module-chunk dependency. First-party behavior uses vanilla TypeScript/native DOM APIs and fetch, without jQuery imports, globals or ambient types. Shared site modules and narrow vendor interfaces live in `src/site/`; KBYG lives in `src/kbyg/`. Webflow's platform-managed scripts remain untouched.

CodeKit configuration, `.mjs` build/test tooling, duplicate maintained standalone page JavaScript, and the handwritten root `ipmi-kbyg.js` are retired. The two root CSS compatibility artifacts remain protected. The first-party WebP detector/loader is now typed and included in `site.js`; its external decoder is still conditionally loaded for unsupported browsers. Other externally loaded vendors and historical full Webflow/content exports are retained rather than rewritten. The historical redirect utility is typed, inert and excluded from public entrypoints. See the [page inventory](JAVASCRIPT-MIGRATION-INVENTORY.md) for exact mappings and exceptions.

## Daily commands

```sh
vp install
vp dev
vp check
vp test --run
vp build
vp preview
vp run verify
```

`vp check` includes strict TypeScript checking and type-aware lint. `vp run verify` additionally builds and runs tests, frozen CSS comparisons, KBYG selector/markup checks and CMS validation. Preview serves the built assets; it is not a source-compilation fallback.

Optional `vp pack` produces ESM browser-QA helper modules under ignored `.webflow/review-tools/` for hosts that cannot import TypeScript. These helper bundles are not deployed to the site. Typed commands such as `vp node scripts/compare-style-probes.ts BEFORE.json AFTER.json` remain available directly.

## Before/after review and regression protection

`/__style-review` exposes four cached staging routes: homepage, Institute, KBYG Sponsor and KBYG Delegate. Each route is fetched read-only once per server run. Current and baseline views share the same captured HTML; current views replace only recognized first-party scripts and stylesheet URLs. Development uses actual TypeScript entry modules; production preview uses built IIFEs. `?style-baseline=legacy` preserves published JavaScript and loads frozen CSS.

The review parser preserves external vendors, native CMS configuration and unrelated markup. It refuses an unrecognized first-party script layout, preventing accidental duplicate old/new initializers. It does not run Vite's full HTML transformation over the captured page or write to Webflow.

Regression tests cover strict compilation, DOM-backed behavior in happy-dom, native multi-entry builds, minified script syntax, TypeScript source maps, external vendor boundaries, development asset responses, review-script replacement, and existing CSS/CMS contracts. Every emitted IIFE is also executed without jQuery. Site tests use native events and controlled vendor/fetch doubles; they do not claim to exercise live form submissions or vendor internals.

The immutable stylesheet fixture remains `tests/fixtures/style-baseline.json`. KBYG build/root CSS and legacy global root CSS retain their frozen bytes; modern global compilation retains its separately reviewed fingerprint. The earlier prefix-removal distinction is unchanged. Historical CSS-only results remain in [the baseline report](STYLE-CLEANUP-BASELINE.md), not evidence of this phase's new runtime behavior.

## Original TypeScript migration validation

These results record the initial TypeScript migration before the subsequent vanilla-DOM follow-up; the follow-up validation is recorded separately below.

- `vp run verify`: **133 tests across 12 files pass**, with zero formatting, lint or strict type errors. All 15 production bundles, CSS baselines, selector/markup guards and CMS validation pass.
- `vp install --frozen-lockfile` and optional `vp pack` both pass. The lockfile is consistent and the QA helper bundles compile from TypeScript.
- Chrome production-preview comparison: **40 paired page/viewport captures pass**, with zero unexpected differences and no coverage gaps. The 394 accepted raw differences are only the already-reviewed stylesheet URL mappings and redundant WebKit transition alias; no layout/color tolerance was added.
- Sponsor and Delegate each cover 320, 375, 479, 480, 767, 768, 991, 992, 1199, 1200, 1279, 1280, 1440 and 1920px. Neither has document or content overflow at these widths.
- Homepage and Institute each cover 375, 768, 991, 992, 1280 and 1920px. Their existing 22px document overflow at 768px and duplicate global stylesheet references remain unchanged; these are separate site cleanup items, not introduced by the migration.
- Built-bundle smoke tests pass for mobile date expansion/collapse (including Space), desktop all-dates display, mobile menu open/close, keyboard section navigation and the Webflow venue lightbox including Escape dismissal. The downloaded ICS contains `DTSTART;VALUE=DATE:20260722` and the correct exclusive end `20260723`. Maps and placeholder Sponsor Hub links retain `_blank` and `noopener noreferrer`.
- Representative Sponsor screenshots were inspected at 375, 768 and 1440px. Development-module initialization was also checked; the final paired captures use actual production IIFEs.
- Other browser engines and live external form/API integrations: not claimed by the local test suite.
- Deployment: not performed.

Local evidence is under ignored `.webflow/typescript-migration-2026-09-05/`: paired captures, `all-comparison.json`, `smoke-results.json` and screenshots. Reproduce the strict comparison with:

```sh
vp node scripts/compare-style-probes.ts .webflow/typescript-migration-2026-09-05/all-legacy.json .webflow/typescript-migration-2026-09-05/all-current.json
```

For browser comparisons, start both variants from the same fresh-load viewport and follow the same resize sequence. Scroll through lazy content, return to the top, and wait for fonts, scroll position, document height and slider widths to settle. Reusing a previously resized slider state or capturing before its resize processing completes can produce misleading height differences. Final captures use matched states, without relaxing the comparator or changing the frozen fixture.

## Vanilla DOM follow-up validation

The jQuery follow-up removes `jquery`, `@types/jquery`, the ambient types, and all first-party runtime use of `$`/jQuery. It does not introduce a compatibility shim. Native events, `fetch`, `DOMParser`, value/class updates and shared form/modal helpers replace the previous calls. WebP detection and its conditional vendor loader are included in `site.js`; the old standalone loader pair is removed. Webflow's platform-managed jQuery remains untouched.

- `vp run verify`: **162 tests across 13 files pass**, with zero formatting, lint or strict type errors. All 15 builds and the CSS, selector, markup and CMS guards pass. `vp install --frozen-lockfile` also passes.
- Every emitted IIFE executes with `$` and `jQuery` access trapped as errors. DOM tests use native events and controlled fetch/vendor responses. Nine WebP tests cover supported and unsupported detection, ordered loading, readiness, repeated initialization, dependency failures and responsive-source restoration after decoder failure.
- Form recipients and the existing Attend/Speak/Partner differences are preserved. Rapid category changes cannot be overwritten by stale timers, and each company-size select resets to its own option. Modal requests cancel when superseded/closed; delayed responses cannot reopen them. About-page HTML requests import only the selected biography fragment without executing response scripts. FAQ initialization also handles an already-loaded document.
- Chrome production preview was compared at **12 page/viewport pairs**: Homepage and Institute, each at 375, 768, 991, 992, 1280 and 1920px. All sampled styles, other element dimensions and overflow match, apart from the previously approved stylesheet URL and redundant transition-alias mappings. Final strict reports additionally flag five total-body-height differences of **0.06–0.19px**. A legacy-versus-legacy control independently reproduces 0.11–0.14px body-height variation. These measurements remain visible in the reports; no comparator tolerance or fixture was loosened, and the final strict browser comparison is **not** reported as an all-pass result.
- The existing 22px document overflow at 768px on Homepage/Institute is present in both versions; no new overflow was observed. Both built stylesheets and the KBYG runtime are byte-identical to the saved pre-follow-up build. The global runtime changes only to include the native WebP loader. The earlier 40-pair KBYG/site review is historical evidence, not rerun as part of these 12 pairs.
- Chrome confirms native Speak/Attend category values, matching recipient addresses, company-size reset, field focus/blur and advisor-carousel advancement. The final global bundle's supported-WebP path loads no decoder or legacy WebP script. No form was submitted.
- Live speaker-profile loading remains a staging verification requirement: the same public CMS request fails from local preview in both legacy and migrated pages (resource status 0, no response body), while both clear their loading indicator. Successful profile rendering, cached/error photos and cancellation are covered by controlled-response tests. Localhost reCAPTCHA also rejects the staging site key; this is not evidence of a production submission failure. Other browser engines and real unsupported-WebP decoder execution were not tested here.
- No Webflow settings, CMS content, vendor/platform scripts or production deployment were changed.

Local evidence is under ignored `.webflow/vanilla-typescript-2026-09-05/`: saved pre-change builds in `before/`, paired captures, strict comparison reports, the legacy repeat control, browser smoke results and a mobile Homepage screenshot. The strict reports deliberately retain the fractional-height observations above.

## Release requirements

`dist/` is ignored and builds do not publish. Inspect and package the approved artifacts, confirm their real release URLs, then replace `__ASSET_COMMIT_SHA__` in maintained snippets. The shown jsDelivr URLs require a release commit that actually contains `dist/`; merely building locally is insufficient. Use one global `site.js` and the relevant page bundle, retaining vendor load order and removing replaced initializers.

Rebind the recap password metadata through Webflow's native CMS Connect control as described in the inventory. It remains a presentation-only URL gate, not authentication. Preserve KBYG's single native stylesheet import and both Institute color field chips. Stage and smoke-test the actual release before separately approving production publishing.
