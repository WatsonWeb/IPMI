# Task 19 — Photo accessibility

Staged September 24, 2026 at **14:23:37.647Z** on `ipmi.webflow.io` only. All four custom-domain publication times remained **03:17:26.557Z**. Runtime/source release: **a3103da593efd7afeed2ba7f6b92a0ec0bb46e9b**. No production publication or form submission occurred.

## Exact scope and decisions

- [Approved photo audit](approved-photo-audit.json): P01–P27, asset URLs, page/section/classes, previous/final alternatives, source sets and roles. All 26 replacements and retained Contact P26 keep their accurate existing descriptions. P05 is decorative behind the hero overlay and remains `alt=""`. P18/P19 are informative lightbox links with the same accurate image descriptions and new `View photo: …` link names. Existing approved source metadata supports retained IPMI/team/HIT references; no identity was inferred from appearance or filenames.
- [Gallery audit](gallery-audit.json): all **67 unique active records**, exact CMS/file IDs, retained visible Caption/event metadata, old/new descriptions and every placement's old alt and lightbox JSON. Twelve visual sheets cover every asset; five approved-photo sheets cover all P01–P27. The root reviewer independently reviewed all 94 audit rows (P18/P19 are shared assets) and conservative factual wording.
- Informative thumbnails describe visible activity; visible Captions remain separate event metadata. Each link announces its opening action and scene once through its accessible name. Generated viewer thumbnail images have empty alt because the surrounding native tab now names both position and scene. Full-size images receive the corresponding scene description.
- Hidden eight Staff-category records and four other inactive records remain untouched. Existing Staff modal code/data are preserved; no hidden staff UI was exposed for this task.

## Native Webflow changes

Gallery Photos collection `63bf18a0654be0fa16c240ad` retains all 79 records, flags and original nine field definitions. Added optional single-line PlainText **Gallery Image Description**, slug `gallery-image-description`, ID `ccb308950b48ce617858bf5cf7572180`. All 67 active values were saved/queued individually through Chrome CMS; 12 inactive values remain blank. No item-level Publish now was used.

Native export was requested and displayed its automatic emailed-download-link notification. No manual email was sent and delivery was not tested. A proposed exact-ID CSV showed 67 matching records but also missing required Image/Caption fields and draft warnings. The import was canceled without execution; no images were imported or reuploaded. [Canceled preview](import-67-matches.png).

Native image alt bindings now use the new field:

| Page                                       |                     Templates | Rendered placements | Previous binding                          |
| ------------------------------------------ | ----------------------------: | ------------------: | ----------------------------------------- |
| [Gallery](https://ipmi.webflow.io/gallery) |                  4 categories |                  40 | Caption                                   |
| [FAQ](https://ipmi.webflow.io/faq)         |                nested gallery |                  13 | Caption                                   |
| [About](https://ipmi.webflow.io/about)     |            Mission + carousel |                   6 | Mission Caption; carousel empty asset alt |
| [Attend](https://ipmi.webflow.io/attend)   | 3 categories × desktop/mobile |                  38 | Caption                                   |

All **97 bindings** were read back from Designer and published DOM. Ninety-five rendered alt values changed; P18/P19 were already correct. About's four carousel anchors now have native custom `role="link"` instead of `role="listitem"`.

Native Save normalized **65 image URL hosts** from `uploads-ssl.webflow.com` to `cdn.prod.website-files.com`. Original file IDs, path/query, filenames, other image properties, dimensions, Captions, category/order/filter references and flags remained identical. This is native serialization, not an asset replacement. [Independent 79-record audit](root-task19-native-verification.json) and [exact descriptions/schema check](root-task19-exact-descriptions.json).

## Maintained supplement

The maintained [Page HTML shell](../../../../Page%20HTML/Global/Photo-Accessibility-Supplement.html) was appended to the existing native footer code of Gallery, FAQ, About and Attend. Each complete preexisting footer was copied, preserved and independently checked after reopening native page settings; no live legacy inline behavior was replaced with a checkout snippet.

Installed immutable assets:

- `https://cdn.jsdelivr.net/gh/WatsonWeb/IPMI@a3103da593efd7afeed2ba7f6b92a0ec0bb46e9b/dist/photo-accessibility.js`
- `https://cdn.jsdelivr.net/gh/WatsonWeb/IPMI@a3103da593efd7afeed2ba7f6b92a0ec0bb46e9b/dist/photo-accessibility.css`

The shell retains `__ASSET_COMMIT_SHA__` for future releases. [CDN verification](root-task19-cdn-verification.json) proves both published assets exactly match local release bytes. The runtime derives descriptions from real native thumbnail alt and exact single-image Webflow JSON destinations; it never guesses metadata or rewrites groups, URLs, captions, events or native behavior. Explicit non-image/multiple-image configurations are skipped. It follows lazy/next/previous viewer images, preserves unknown media and external meaningful names, restores stale owned attributes, and supports idempotent initialization and cleanup.

Scoped CSS restores a three-pixel blue focus outline with a white contrast ring and visually hides Swiper live-status text without removing `aria-live`. Both frozen root stylesheets and their baseline fixture remain unchanged.

Toolchain tests explicitly own the new entry/shell. The existing Calendar entry also gained its missing maintained shell/ownership mapping, and the dependency walker now recognizes CSS leaves. This resolves task 24's prior entry-inventory failure; no Calendar live pin or behavior changed.

## Verification

- `vp test --run tests/photo-accessibility.test.ts tests/toolchain-contract.test.ts`: **30 passed**. Behaviors include exact current-image descriptions, unknown/non-image media preservation, external meaningful labels, cleanup/reinit and no duplicate observer ownership.
- `vp build`, focused type-aware lint, frozen style baseline and `git diff --check`: pass.
- `vp node docs/web-refresh/evidence/task19/verify-audit.mjs`: [pass](audit-verification.json), cross-checks all 27 approved images and responsive source sets, 67 records, 97 native bindings and 30 page/width observations.
- [Responsive browser audit](responsive-context-audit.json): ten pages at **390, 768 and 1440px**; all 97 links have meaningful names at every width, all approved alt/srcset/sizes match the audit, including both Attend variants.
- [Keyboard/viewer observations](browser-lightbox-checks.json): Gallery Enter → next → previous → Escape; correct changing full-size alt and focus returned to the originating link. About Mission tablet viewer retains six-image group; FAQ mobile accordion/viewer retains 13-image group; Attend mobile six-image group and desktop Speak/Partner destinations work. Original desktop Speak single-image behavior is preserved. About keyboard carousel Next advances the photo while `Next slide` stays assertive and visually clipped.
- Screenshots show [Gallery focus](gallery-focus.png), [viewer](gallery-viewer.png), [About tablet viewer](about-tablet-viewer.png), [tablet carousel](about-tablet-carousel.png), [Attend mobile focus](attend-mobile-focus.png), [mobile viewer](attend-mobile-viewer.png), and [FAQ mobile viewer](faq-mobile-viewer.png). Mobile page strips document context; lower lazy images were additionally scrolled into view in the Home/Institutes Recaps and Gallery CTA desktop screenshots. A full-page capture alone does not force all offscreen lazy media to load.
- [Browser diagnostics](browser-console.json): no relevant application error; two unrelated Chrome-extension logger warnings.
- [Independent HTTP comparison](root-task19-http-verification.json): all 11 routes return 200; original image assets/attributes/source sets, anchor destinations, exact form HTML, lightbox JSON, existing pins and inline scripts are preserved. Only intended alt/role changes and two new pins on each of four pages appear. No delivery or real submission is claimed.

## Chair, KBYG and concurrent state

GCI October 2026's unlinked chair artwork retains dynamic Partner-name alt `PLACEHOLDER - Chair Sponsor (approval pending)`, matching its visible neutral artwork. [Screenshot](chair-placeholder-desktop.png). Task 17's approval/replacement register remains authoritative; this audit does not approve a real chair sponsor.

An independent user-owned agenda task published staging at **14:06:51.027Z** during this work. The actor was initially unknown; subsequent coordination established authorized concurrent KBYG work. The user requires **day cards and the full-agenda PDF button together**. [Concurrent HTTP comparison](root-task19-concurrent-http-verification.json) established that partial photo binding publication introduced no unrelated changes on the 11 audited routes. Current external KBYG copy, references, slugs, venue images and all 54 records were independently rebaselined and preserved before this task's publication.

The concurrent local changes in `Page HTML/KBYG Pages/KBYG-Template.html`, `docs/web-refresh/26-kbyg-agenda-links.md`, and `scripts/check-kbyg-markup.ts` are excluded from task 19 commits. Do not restore their older versions.

The [KBYG rendered image audit](kbyg-image-audit.json) and [hero](kbyg-hero.png), [hub](kbyg-hub.png), [venue](kbyg-venue-external.png) screenshots identify these explicit task 37 integration items on `/know-before-you-go/ehs-jan-2027-delegate` and any other contexts reusing the assets:

| Asset ID                   | Current alternative                                         | Visually verified replacement                     |
| -------------------------- | ----------------------------------------------------------- | ------------------------------------------------- |
| `6ab42c78b94c2e08f98100ff` | Attendee viewing the IPMI Events event app in a hotel lobby | Hands typing on a smartphone                      |
| `6ab525d2ac5a08c76d1eeed8` | Event venue                                                 | Hotel entrance framed by trees and landscaping    |
| `6ab525d204624f9027bea52a` | Event venue                                                 | Hotel garden with lawn, trees and outdoor seating |

The first current alt overstates app/location identity; the new venue assets have null native image metadata and inherit the generic KBYG fallback/link name `Open photo: Event venue`. Task 37 must use maintained/native description inputs, verify link names and full-size alternatives, and preserve exact external assets. No task 19 supplement is installed on KBYG. Its hub description accurately describes handshaking at a cocktail function; the redundant category icon is silent.

Task 37 also owns the same inherited Swiper live-status styling outside these four pages: homepage keyboard Next at 768px visibly renders `This is the last slide` with no clipping and 22px height. Do not remove its live announcement. Shared navbar overflow, FAQ footer hash, KBYG dates/spacing and accumulated formatting remain separate integration items.

## Remaining approvals, cleanup and rollback

No new content placeholder was created. Final supplied-photo/caption approval for tasks 29–32, real chair identity/artwork and production publication remain pending with their existing owners. Any later asset replacement must recheck its description and dynamic viewer mapping.

Viewport override was reset and owned functional Designer/QA tabs were closed. The earlier failed recovery tab `1953600956` rejected close because its debugger was unattached; the original user tab `1953600721` was preserved. Chrome ownership was explicitly released to the coordinator. Both owned local review/development servers were stopped.

Rollback only the affected field/bindings and four appended asset pairs. Previous values and lightbox mappings are in the audits; full pre-edit CMS/schema/page snapshots and native footer clipboard backups remain under ignored `.webflow/web-refresh-2026-09-23-baseline` and `.webflow/task19`. Restore original Caption bindings (About carousel asset-empty alt) and original carousel roles only if rolling back this task. Do not reverse approved photo swaps, reupload image files, remove later unrelated CMS fields, or overwrite concurrent KBYG changes with an old whole-page/site restore. Republish staging only and repeat focus/viewer checks.
