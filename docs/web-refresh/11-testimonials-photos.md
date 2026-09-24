# 11 Testimonials page photo replacements

Owner: Webflow implementer. Asset owner: IPMI.

Status: Staged for review. P20/P21 applied and verified September 24, 2026; production remains unchanged.

[Back to master](README.md)

## Source and target

- [New Web Photos.docx](https://ipmionline.sharepoint.com/:w:/s/IPMIExternal/IQCVDAeAmKmVRoa3mRUyjy1cAYda4y7oNDZjOs51OXae8Wg?e=8pGh3U): source rows and pages listed below. Row IDs P01–P27 are documentation identifiers in source order.
- Web Refresh Master To-Do: “Update copy and photo content across all pages”; source attachment is recorded in the master.
- [Testimonials](https://www.ipmievents.com/testimonials): existing feature-photo placements indicated in the source screenshots.

Replace the indicated front and back images on the Testimonials page using the supplied Casino Night and Dinner images.

## Current state and asset mapping

The source supplies one front/back pair. The actual section, current assets, and bindings must be matched against the source screenshot in Chrome. This task does not assert that testimonial content or speaker approvals have already been updated.

| Source row | Source page / row | Destination                                     | Supplied asset or instruction                                                                                                           |
| ---------- | ----------------- | ----------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| P20        | 5 / 2             | Testimonials — front image in source screenshot | [HFI 2026 Casino Night](https://ipmionline.sharepoint.com/:i:/s/IPMIExternal/IQDIj90vgu8mSaOo1TEUHJORAWNMxMaYeo70Iv_E6OM7pNA?e=5eWX3d)  |
| P21        | 5 / 3             | Testimonials — back image in same pair          | [HRMI Can 2025 Dinner 1](https://ipmionline.sharepoint.com/:i:/s/IPMIExternal/IQBOMS6L71KvQ4xC-8neWEO9AWXH_y9M8aWajFcBCXgXOc0?e=tH4deC) |

Source image links are the approved originals, not public website image URLs. Access their files through Chrome and upload/select them in Webflow; do not set a page image's URL to an authenticated SharePoint sharing page.

## Chrome and Webflow implementation checklist

1. Open the source document and each supplied asset in Chrome. Compare the source screenshot with the current Testimonials page and identify each exact placement. For an ambiguous pair, record the matching section heading and screenshot before editing; do not infer front/back from DOM order.
2. In Webflow Designer, record the page section, element or component property, static/CMS binding, current asset, alternative text, dimensions, object fit/position or background position, and any breakpoint-specific settings. Capture the current desktop and mobile presentation.
3. Retrieve the 2 approved replacement files from the provided SharePoint links through Chrome. Confirm each opens and matches its source row. Upload each to Webflow Assets with a recognizable filename, avoiding duplicate uploads when the exact approved asset already exists.
4. Select each existing destination and replace only its image source or the exact bound CMS image field. Preserve the visual front/back layering, aspect ratio, border radius/mask, sizing, and responsive layout. If a shared component/CMS field affects other pages, record those dependents and verify the change is intended before saving.
5. Preserve the composition across breakpoints, adjusting focal/object position only when required to keep the new subject visible. Apply [19 Photo accessibility](19-photo-accessibility.md): describe informative photos accurately after viewing them; use an empty alternative description for decorative images.
6. Preview desktop, tablet, and mobile. Check the new images' crop, overlap, loading, and nearby headings/links. Preserve testimonial quotations, names, titles, organization logos, recordings, filtering, and slider behavior. Approved testimonial additions are tracked separately in task 33.
7. Publish only to Webflow staging under the master rules. Compare each row to the source document and record the final asset, actual destination, staging URL, and screenshots. Keep the task unchecked until every row is verified.

## Required fields and dependencies

No new CMS collection or field is required solely for these replacements. Existing image/component/CMS fields are identified in step 2; source-file access and exact source-screenshot placement matching are required. Coordinate with [33 Approved testimonial content](33-testimonial-content.md). Complete the per-image alternative-text decisions through [19 Photo accessibility](19-photo-accessibility.md) and include results in [37 Integrated verification](37-staging-verification.md).

## Acceptance checks

- [x] P20: the approved asset is visible at the destination specified in the mapping table.
- [x] P21: the approved asset is visible at the destination specified in the mapping table.
- [x] Every row has an actual Designer/CMS destination and previous asset recorded; unresolved placement guesses are closed before marking complete.
- [x] Front/back layering and source-intended composition are correct at desktop, tablet, and mobile sizes.
- [x] Images load from Webflow-managed assets with no broken or authenticated SharePoint image URLs.
- [x] Informative/decorative treatment and alternative text are verified for the new images.
- [x] Unrelated content, links, collections, and interaction behavior remain correct.
- [x] Staging URLs and comparison screenshots are recorded.

## Rollback

Restore the captured previous asset references and their original crop, focal position, and alternative-text values in the same static/component/CMS fields. Republish staging and verify every affected placement, including dependent component instances. Keep both old and new assets available through review; do not delete an asset that another page may use.

## Applied implementation and evidence

Editor: Codex task 11 worker using the observed Webflow account **IPMI Webmaster**. Verified September 24, 2026 UTC. Staging: [Testimonials](https://ipmi.webflow.io/testimonials), page `63c262bb4553f61ffeb42593`.

[Source placement screenshot](evidence/task11/source-placements.png) confirms the hero pair beneath **Feedback from our Spectacular Guests**: P20 is the lower-left front circle and P21 is the upper-right back circle. Both are static image elements, with no CMS or shared component binding.

### Source files and applied values

The approved SharePoint images were opened separately in Chrome, visually inspected, and downloaded through the preview image's native media download. These are official JPEG preview derivatives, not claimed original-file bytes or screenshots used as photos. Both are 2560 × 2560. The downloaded bytes remain in ignored `.webflow/task11-photos/`. Asset search found no exact pre-existing matches; both were uploaded as new assets, preserving original assets and metadata.

| Row | File / bytes / source evidence                                                                  | Element / previous asset / previous asset alt                                                                                                    | New Webflow asset / exact custom alt                                                                                                                                                                                                          |
| --- | ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P20 | `P20-HFI-2026-Casino-Night.jpg`, 492471 bytes; [viewed source](evidence/task11/source-p20.png)  | `45fc8c33-bacb-f7cf-8979-02789931e0b8`; `63c277018fc675995986cce8_Testimonial-Bubble-3.webp`; `IPMI Institute guests at a Happy Hour Roundtable` | [P20 JPEG](https://cdn.prod.website-files.com/62f30d583ebbed2d6d47f9a5/6ab4c1a566358d7a1d925a5b_P20-HFI-2026-Casino-Night.jpg), asset `6ab4c1a566358d7a1d925a5b`; `Participants smiling with drinks at an outdoor IPMI gathering`             |
| P21 | `P21-HRMI-Can-2025-Dinner-1.jpg`, 408340 bytes; [viewed source](evidence/task11/source-p21.png) | `45fc8c33-bacb-f7cf-8979-02789931e0b7`; `63c277019428274dbbd2de14_Testimonial-Bubble-4.webp`; `IPMI Institute attendees laughing`                | [P21 JPEG](https://cdn.prod.website-files.com/62f30d583ebbed2d6d47f9a5/6ab4c1a589ec77159551d436_P21-HRMI-Can-2025-Dinner-1.jpg), asset `6ab4c1a589ec77159551d436`; `Attendees wearing sunglasses share smiles around an outdoor dinner table` |

Original asset URLs use prefix `https://cdn.prod.website-files.com/62f30d583ebbed2d6d47f9a5/`. [Original element capture](evidence/task11/original-elements.json), [Designer baseline](evidence/task11/original-designer.png), [desktop baseline](evidence/task11/original-desktop.png), [mobile baseline](evidence/task11/original-mobile.png).

Both elements retain 400 × 400 HTML dimensions, eager loading, responsive variants, centered object position, `object-fit: fill`, 50% circle mask and shadow. P20 retains `bubble-photo bottom left circle front shadow-xl`, z-index 2; P21 retains `bubble-photo top right circle shadow-xl`, z-index auto. No CSS, class, size, focal, crop, breakpoint or interaction changes were needed. Webflow enabled its normal HiDPI treatment for the larger assets while preserving the 400 × 400 attributes. Alt mode changed from **Use alt text from asset** to **Custom description**, leaving old asset metadata intact. No placeholders were needed.

### Verification

Only `ipmi.webflow.io` was checked in the native publish dialog; the sole listed custom domain `www.ipmievents.com` was unchecked. [Domain selection](evidence/task11/staging-only-publish.png), [publish completion](evidence/task11/publish-completed.png). No CMS Publish now action was used.

| Viewport           | Result / evidence                                                                                                                                                                                                                                 |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Desktop 1912 × 970 | [Hero](evidence/task11/desktop-hero.png), [checks](evidence/task11/desktop-checks.json): new sources loaded, 333.86px square circles, intended overlap, faces visible, no page overflow.                                                          |
| Tablet 768 × 1024  | [Hero](evidence/task11/tablet-hero.png), [checks](evidence/task11/tablet-checks.json): 250px square circles, existing vertical overlap and foreground preserved. Existing navigation extends document width to 790px; already tracked in task 37. |
| Mobile 390 × 844   | [Hero](evidence/task11/mobile-hero.png), [checks](evidence/task11/mobile-checks.json): photos fit the existing horizontal mobile pair, centered crops and faces visible, document width 390px.                                                    |

- The hero **View Testimonials** anchor reaches `#testimonials` on desktop and mobile. [Desktop cards](evidence/task11/desktop-testimonials.png), [mobile cards](evidence/task11/mobile-testimonials.png). All 22 quote cards render; this section exposes no slider, filter, recording or other interactive control requiring a separate action test. No message was submitted.
- The lower shared Institutes CTA remains unchanged, with original assets `63cf344a033565aa03ae94b7_Institutes-Bubble-6.webp` and `63cf344ad75e97ad6d8d7066_Institutes-Bubble-5.webp`. Both lazy images load when brought into view; [mobile CTA](evidence/task11/preserved-cta.png).
- Independent root read-only HTTP comparison: 51 image tags before/after; the other 49 image tags are byte-identical. All 70 anchor opening tags and normalized source text (6328 characters) are unchanged, preserving quotations, names, headshots, logos, links and CMS output. Production retains all 51 baseline image tags and contains neither replacement asset.
- No custom code, stylesheet, CMS item, collection, schema, shared component definition, existing asset bytes or metadata changed. Task 33's testimonial additions remain separate. Task 19 receives the two audited informative alt descriptions here; broader accessibility and integrated checks remain with tasks 19/37.
- Browser viewport overrides were reset; source tabs closed; staging retained for review. Designer remains on Testimonials at Desktop with no dialog open.
- `vp fmt --check docs/web-refresh/11-testimonials-photos.md docs/web-refresh/README.md` and `git diff --check` passed. No local runtime code changed, so no app build was required.

### Exact rollback

On the same two static elements, restore the previous asset references above and alt mode **Use alt text from asset**. Preserve their existing dimensions, loading, classes, masks and positions. Both prior assets remain available. Republish staging only with custom domains unchecked and verify both hero circles and the unchanged lower Institutes CTA. Do not delete the new assets or restore a whole-site backup over other tasks.
