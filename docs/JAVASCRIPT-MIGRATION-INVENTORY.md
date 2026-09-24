# First-party JavaScript migration inventory

Maintained first-party browser behavior now lives in strict TypeScript under `src/site/` and page-specific `src/entries/`. Vendor implementations are not copied into these bundles. KBYG has its own entry and migration coverage; this inventory covers the existing global and non-KBYG page snippets.

## Browser entries

| Entry / generated bundle          | Replaces                                                     | Preserved behavior                                                                  |
| --------------------------------- | ------------------------------------------------------------ | ----------------------------------------------------------------------------------- |
| `site.ts` / `site.js`             | Global Footer inline code; `IPMI-Navigation.js`; WebP loader | Mobile menu, footer open/close, Safari curve SVG scaling, conditional WebP fallback |
| `home.ts` / `home.js`             | Home Footer inline code                                      | Six Swipers, counters and staggered circular statistics                             |
| `about.ts` / `about.js`           | About Footer inline code                                     | Advisor HTML modal, two Swipers, statistics                                         |
| `institute.ts` / `institute.js`   | Institute Footer inline code                                 | CMS speaker modal, categories/recipients/fields, six Swipers                        |
| `vtt.ts` / `vtt.js`               | VTT Footer inline code                                       | CMS speaker modal, ActiveCampaign field decoration/focus, two Swipers               |
| `vtt-list.ts` / `vtt-list.js`     | VirtualThinkTanks Footer inline code                         | Events Swiper                                                                       |
| `attend.ts` / `attend.js`         | Attend Footer inline code                                    | Per-section desktop/mobile Swipers, upcoming institutes, form categories/recipients |
| `recap.ts` / `recap.js`           | Recap Footer and Password Lock executable code               | Forms, three Swipers, legacy URL presentation gate                                  |
| `institutes.ts` / `institutes.js` | Institutes Footer inline and standalone copies               | Shared checkbox-driven institute filters                                            |
| `recaps.ts` / `recaps.js`         | Recaps Footer inline and standalone copies                   | Same filter implementation, separate deployment entry                               |
| `gallery.ts` / `gallery.js`       | Gallery Footer inline code                                   | Four Swipers                                                                        |
| `faq.ts` / `faq.js`               | FAQ Footer inline code                                       | Per-question gallery, accordion ARIA, URL/hash-link opening                         |
| `contact.ts` / `contact.js`       | Contact Footer inline code                                   | Form focus/blur treatment                                                           |
| `horizon.ts` / `horizon.js`       | `Horizon-Institute-Selector.js`                              | Industry outlines, card/dropdown synchronization, URL preselection, field treatment |

The canonical navigation is the working Global Footer implementation. The discarded standalone copy bound its close action to the open button. Shared modules consolidate navigation, list filters, statistics, speaker modal handling, DOM readiness, and narrow external-vendor interfaces. Page-specific Swiper selectors, options and responsive breakpoints remain explicit.

Eight replaced standalone JavaScript files were removed: navigation, Institutes filters, Recaps filters, Horizon selector, the source/minified bulk-redirect utility pair, and the source/minified WebP loader pair. Their history remains recoverable in Git.

## CMS data and intentional safety corrections

`Recap-Password-Lock.html` is now declarative: a `meta[name="ipmi-download-password"]` content value bound to the native CMS PlainText field. The recap entry reads it after DOM readiness. Install the field through Webflow's native Connect control; pasting the exported token alone does not establish a binding. This remains a public, presentation-only URL gate, not authentication. The former password console logging was removed; sensitive downloads require server-side access control.

The runtime now uses native DOM events, class/attribute/value updates, DOM readiness, `fetch` and `DOMParser`, not jQuery or a compatibility wrapper. Form-category logic and focus treatment are shared in `src/site/forms.ts`; slider options remain explicit and unchanged. Text and options are constructed through DOM APIs.

Shared modal handling validates unknown CMS JSON, listens before assigning image URLs, and settles cached/missing/error images. Biography HTML remains trusted CMS rich text and the API endpoint is unchanged. Scroll resets use the native element `scrollTop` property. About-page requests parse only the `.bio-columns` fragment without executing response scripts. Numeric timer delays replace implicitly coerced string delays. Inactive, commented-out VTT field/date code is not carried forward as executable functionality.

## Retained external and historical material

- Neither first-party runtime code nor tests/tooling depend on jQuery. The `jquery` and `@types/jquery` packages and ambient types were removed. Webflow's own platform-injected script stays untouched for native components; historical complete exports retain their platform scripts. No custom jQuery import is added.
- Swiper 8, CountUp 2.3.2, CircularProgressBar 1.1.9, FontAwesome, Finsweet, Webflow and ActiveCampaign remain external integrations. Their maintained script references are retained. An exact duplicate VTT Swiper script tag was consolidated.
- WebP detection and loading are now native TypeScript inside `site.js`. The pinned external `webp-hero@0.0.2` decoder remains a conditional dependency only for browsers that fail the existing WebP test image. Its two scripts load in order without jQuery, followed by DOM readiness. Remove the old global `webp-polyfill-min.js` script when installing `site.js`; do not run both loaders. The former bundled Modernizr detector and duplicate source/minified loader files are retired.
- `Institutes-on-the-Horizon.html` is a historical full Webflow export containing Webflow/vendor/analytics code and old inline snapshots, not the maintained page initializer. Deploy `Horizon-Footer.html` with the new entry instead. Legal `*-Source.html` and generated/minified policy HTML are historical content exports, not maintained JavaScript modules. Do not deploy their embedded snapshots as new runtime code.
- The old one-off redirect console utility is now inert typed data plus an explicit adapter function in `src/site/admin-redirects.ts`. All 316 redirect rules are retained. No public entry imports it; importing the module does not discover Angular internals or write redirects. A separately authorized operator must review the rules and provide a valid admin adapter before invoking it. Its historical Webflow Angular interface is not guaranteed to exist today.

## Verification and deployment

Run `vp run verify` for strict type checking, lint, build, tests and existing stylesheet/CMS guards. `tests/site-behaviors.test.ts` uses happy-dom with native events and no jQuery globals, controlled vendor doubles and mocked fetch responses. It covers navigation, filters, Horizon, forms, counters and timing, all page slider inventories, FAQ state, recap data gating, missing-vendor guards, and inert redirect data. Speaker tests cover no-photo rendering, cached photos, load/error events, failed responses, and loading cleanup. Build tests execute all 15 emitted IIFEs with jQuery access trapped as an error. These tests do not exercise production vendor internals, live form submissions, live CMS services, or the legacy admin UI.

Deployment is a separate reviewed step:

1. Build and inspect each `dist/<entry>.js` and matching source map. Do not ship TypeScript source as a script URL.
2. Upload the approved build, verify the artifact URLs, then replace the literal `__ASSET_COMMIT_SHA__` placeholders in maintained snippets with that release's full commit. The shown jsDelivr URLs require that release commit to actually contain the `dist/` artifacts; a git-ignored local build alone is not enough. An alternative approved asset host requires updating the URL base consistently. No placeholder URL is a currently deployed asset.
3. Install `site.js` once in Global Footer and only the relevant page bundle in each page/template Footer. Keep required vendor scripts ahead of the deferred first-party entry. Remove the replaced inline/standalone initializers and old WebP loader to prevent duplicate initialization.
4. Re-establish the recap native CMS field binding, check both CMS content variants and missing-data states, then smoke-test actual vendors, modal loading, forms, filters and responsive interactions on staging before production publishing.

No Webflow configuration changes, form submissions, admin redirect operations, or publishing were performed by this source migration.
