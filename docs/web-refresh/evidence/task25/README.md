# Task 25 — provisional native KBYG coverage

Completed September 24, 2026 under the user's explicit placeholder authorization. This is structural staging coverage, not final Operations editorial approval.

## Result

- 54 unique Institute × Audience pairs: 50 native records created, four originals preserved. No parallel collections or new blocks.
- [Actual coverage](coverage-actual.json) records every assigned ID and actual fieldData. [Exact placeholder register](placeholder-fields-actual.json) promotes 1,225 prepared entries to applied and preserves seven prior applied entries; missing native properties are explicitly distinguished from null. Owners and replacement requests remain pending.
- [Native audit](root-cms-verification.json), [structural validation](validation-results.json), and [final HTTP audit](root-http-verification.json) independently reconcile all pairs. All 43 blocks and four original page fields/flags are unchanged. Native rich-text normalization (225 values) and semantic empty normalization (275 values) are the only import differences.
- [Before pages](pages-before.json), [before blocks](blocks-before.json), [after pages](pages-after.json), [after blocks](blocks-after.json), and [published pages](pages-final.json) retain the exact audit trail.

## Native import and publication

Used task 36's original CSV through Chrome's actual CMS Import UI. The initial unloaded Institute reference preview reported unresolved values; that preview was canceled without import. Opening the Institutes collection populated the Designer reference cache. Re-uploading the unchanged slug-based CSV correctly resolved references. All 50 previews were inspected; previews 10–49 are retained as text, along with final preview and import-complete screenshots. The first ten were checked before a tool timeout and are covered definitively by the actual-ID reconciliation. All 51 fields were mapped; optional empty reference lists used native new-item defaults. A reopened Sponsor item verified rich text persisted.

CSV import natively queued all 50 items for the next site publish. No CMS Publish now action was used. Site publishes selected only `ipmi.webflow.io`; the production domain stayed visibly unchecked and its timestamp unchanged. See final-publish-destinations.png and final-publish-complete.txt. Unrelated draft records were not edited.

## Scoped template corrections

The existing static Orlando skyline incorrectly appeared on every new event. Native conditional visibility now shows it only for HCHR Sept 2026, Institute `68b0aff93e4f6363f03f620b`, and omits it elsewhere. The neutral gradient remains. Native `.kbyg-hero__media` visibility now requires Hero Image to be set, hiding the associated floating category badge together with the absent image. The four populated pages retain their media. See backdrop-condition.txt/png and hero-media-condition.txt. Source scaffold comments mirror these conditions.

Runtime pin `298d6f6925b4c91cb7e35bccae0dd3cd790cbbef/dist/ipmi-kbyg.js` and CSS pin `0bee9be0be82a5cbd03eab614bada158b88957c1/ipmi-kbyg-styles.css` remain unchanged. Calendar task 24 pin remains unchanged. Protected global CSS was not edited.

## Verification and limits

All 54 staging URLs return HTTP 200 and match event/year/audience, noindex, audience-specific anchors, and exact original links/pins. The Orlando image appears on two HCHR pages only. All 108 rendered viewport checks (1440×1000 and 390×844) pass identity/year/venue/audience/noindex/anchor presence/no horizontal overflow/no visible empty image checks. Per-page JSON contains rendered text, links, images, empty notices and section dimensions; browser-audit-summary.json summarizes it. Generic hash-only controls are recorded separately: calendar and FAQ controls and the global mobile sitemap are not broken destination URLs. New Hub/Support links remain absent; task 27 owns inherited example.com Sponsor links.

The 108 full rendered checks occurred after the skyline correction and before the final optional-media condition. [Final all-54 media audit](final-media-audit.json), root final HTTP audit, and replaced sparse screenshots cover that last delta: exactly four populated hero media containers remain and all 50 empty media containers are omitted.

Representative populated HCHR Delegate and sparse Vancouver Sponsor screenshots cover desktop, tablet 768×1024 and mobile. The neutral header remains readable without an empty image or badge gap. Missing contact portraits, page images and CTAs suppress correctly. Sparse block areas use existing empty notices. Placeholder reservations remain page-level and audience-specific.

A concrete navigation defect is handed to task 26: at `https://ipmi.webflow.io/know-before-you-go/220-hr-can-2027-sponsor`, viewport 1440×1000, clicking role link name `AGENDA` exact sets `#agenda`, but after settling the section top is -635.96875px and `data-kbyg-active-section` is `hotel-travel`. Anchor presence/hash is passing; scroll alignment is NOT passing. Task 26 must resolve direct/jump/mobile agenda navigation and task 37 retest. Known all-day date shift, sparse Sponsor Experience whitespace, empty-state contrast and full formatting cleanup remain task 37. No incorrect HCHR data was copied into new events. Strict approved-content validator requirements were not weakened.

## Local verification

Run `vp node docs/web-refresh/evidence/task25/validate-coverage.mjs` for scoped structural validation. This separate audit does not pretend provisional fields satisfy the strict approved model. `vp run check:kbyg:markup` verifies the maintained scaffold. Only comments changed in source; no compiled asset release was needed. Full accumulated documentation formatting is assigned to task 37.

## Rollback

The 50 new IDs are identified by `Created; staged provisional` in coverage-actual.json. If correction is needed, use native CMS to return only affected new records to draft/archive, preserving data and all four originals; republish staging only. Do not delete records or modify production. Remove the two native conditions only if restoring the captured prior template is intentionally required; restore no asset pins because none changed. Missing editorial facts must stay pending rather than be replaced with another event's content.
