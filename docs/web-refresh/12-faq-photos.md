# 12 FAQ page photo replacements

Owner: Webflow implementer. Asset owner: IPMI.

Status: Staged for review. Approved P22/P23 hero photos and descriptive alt text published to staging only; responsive and interaction checks passed.

[Back to master](README.md)

## Source and target

- [New Web Photos.docx](https://ipmionline.sharepoint.com/:w:/s/IPMIExternal/IQCVDAeAmKmVRoa3mRUyjy1cAYda4y7oNDZjOs51OXae8Wg?e=8pGh3U): source rows and pages listed below. Row IDs P01–P27 are documentation identifiers in source order.
- Web Refresh Master To-Do: “Update copy and photo content across all pages”; source attachment is recorded in the master.
- [FAQ](https://www.ipmievents.com/faq): existing feature-photo placements indicated in the source screenshots.

Replace the FAQ page's source-indicated front/back feature-photo pair with the supplied session images.

## Current state and asset mapping

The source maps two replacements to the FAQ hero front/back pair. Exact original/new bindings and source screenshot verification are recorded below.

| Source row | Source page / row | Destination                            | Supplied asset or instruction                                                                                                             |
| ---------- | ----------------- | -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| P22        | 5 / 4             | FAQ — front image in source screenshot | [HRMI West 2025 Session 6](https://ipmionline.sharepoint.com/:i:/s/IPMIExternal/IQAAfUKeZhNdSpUIcbHiTL5dARtn3R3XnRgpIyPt8qWSgfs?e=8AHv52) |
| P23        | 5 / 5             | FAQ — back image in same pair          | [HIT Jun 2025 Session 3](https://ipmionline.sharepoint.com/:i:/s/IPMIExternal/IQDRySfHM57iRJQp2GIBSzSBARnHcFZFvVY0EcluWblJPS0?e=pKmFPH)   |

Source image links are the approved originals, not public website image URLs. Access their files through Chrome and upload/select them in Webflow; do not set a page image's URL to an authenticated SharePoint sharing page.

## Chrome and Webflow implementation checklist

1. Open the source document and each supplied asset in Chrome. Compare the source screenshot with the current FAQ page and identify each exact placement. For an ambiguous pair, record the matching section heading and screenshot before editing; do not infer front/back from DOM order.
2. In Webflow Designer, record the page section, element or component property, static/CMS binding, current asset, alternative text, dimensions, object fit/position or background position, and any breakpoint-specific settings. Capture the current desktop and mobile presentation.
3. Retrieve the 2 approved replacement files from the provided SharePoint links through Chrome. Confirm each opens and matches its source row. Upload each to Webflow Assets with a recognizable filename, avoiding duplicate uploads when the exact approved asset already exists.
4. Select each existing destination and replace only its image source or the exact bound CMS image field. Preserve the visual front/back layering, aspect ratio, border radius/mask, sizing, and responsive layout. If a shared component/CMS field affects other pages, record those dependents and verify the change is intended before saving.
5. Preserve the composition across breakpoints, adjusting focal/object position only when required to keep the new subject visible. Apply [19 Photo accessibility](19-photo-accessibility.md): describe informative photos accurately after viewing them; use an empty alternative description for decorative images.
6. Preview desktop, tablet, and mobile. Check the new images' crop, overlap, loading, and nearby headings/links. Keep the FAQ question galleries separate from this feature pair. Preserve question anchors, accordion behavior, answer content, and existing gallery links while applying these replacements.
7. Publish only to Webflow staging under the master rules. Compare each row to the source document and record the final asset, actual destination, staging URL, and screenshots. Keep the task unchecked until every row is verified.

## Required fields and dependencies

No new CMS collection or field is required solely for these replacements. Existing image/component/CMS fields are identified in step 2; source-file access and exact source-screenshot placement matching are required. Coordinate with [04 FAQ copy](04-faq-copy.md) and [30 Additional FAQ content and gallery images](30-faq-content-supply.md). Complete the per-image alternative-text decisions through [19 Photo accessibility](19-photo-accessibility.md) and include results in [37 Integrated verification](37-staging-verification.md).

## Acceptance checks

- [x] P22: the approved asset is visible at the destination specified in the mapping table.
- [x] P23: the approved asset is visible at the destination specified in the mapping table.
- [x] Every row has an actual Designer/CMS destination and previous asset recorded; unresolved placement guesses are closed before marking complete.
- [x] Front/back layering and source-intended composition are correct at desktop, tablet, and mobile sizes.
- [x] Images load from Webflow-managed assets with no broken or authenticated SharePoint image URLs.
- [x] Informative/decorative treatment and alternative text are verified for the new images.
- [x] Unrelated content, links, collections, and interaction behavior remain correct.
- [x] Staging URLs and comparison screenshots are recorded.

## Rollback

Restore the captured previous asset references and their original crop, focal position, and alternative-text values in the same static/component/CMS fields. Republish staging and verify every affected placement, including dependent component instances. Keep both old and new assets available through review; do not delete an asset that another page may use.

## Implementation record — September 24, 2026

Implemented by Codex through Chrome Designer as **IPMI Webmaster**, with exclusive editor control. Page: **Frequently Asked Questions**, ID `63c0dd75d28310ee815b79c6`. Staging: [FAQ](https://ipmi.webflow.io/faq#hero). No placeholder content was needed.

The [source screenshot](evidence/task12/source-front-back.png) explicitly maps P22 to the lower-left foreground hero circle and P23 to its upper-right background circle. Both are static image elements in **Hero Section → Hero Container → Hero Wrap → Bubble Photos**, not CMS fields or shared component properties. The lower Institutes CTA is a separate, unchanged pair.

| Row       | Element ID / previous asset                                                               | New Webflow asset                                                                                                                                                   | Exact custom description                                                |
| --------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| P22 front | `45fc8c33-bacb-f7cf-8979-02789931e0b8`; `63c0e2c463e7242c7ee9ac3a_IPMI-FAQ-Bubble-1.webp` | [P22 JPEG](https://cdn.prod.website-files.com/62f30d583ebbed2d6d47f9a5/6ab4c438118f040f8b2c7ec0_P22-HRMI-West-2025-Session-6.jpg), asset `6ab4c438118f040f8b2c7ec0` | `Seated speaker wearing a headset microphone during an IPMI session`    |
| P23 back  | `45fc8c33-bacb-f7cf-8979-02789931e0b7`; `63c0e2c40d966815b8d5d5b4_IPMI-FAQ-Bubble-2.webp` | [P23 JPEG](https://cdn.prod.website-files.com/62f30d583ebbed2d6d47f9a5/6ab4c494e4410c930e2e090d_P23-HIT-Jun-2025-Session-3.jpg), asset `6ab4c494e4410c930e2e090d`   | `Seated panelist holding a microphone and notes during an IPMI session` |

The previous asset alts were `IPMI Session Panel` (P22) and `IPMI Institute Session Room\n` (P23, trailing newline). Both used **Use alt text from asset**; the new descriptions use **Custom description** without altering previous asset metadata. [Original image inventory](evidence/task12/before-images.json), [new Designer bindings](evidence/task12/designer-new-bindings.json), [desktop baseline](evidence/task12/before-desktop.png), [mobile baseline](evidence/task12/before-mobile.png).

### Source provenance and presentation

The supplied links were opened in separate Chrome tabs and the actual scenes inspected: [P22 source](evidence/task12/source-p22.png), [P23 source](evidence/task12/source-p23.png). Chrome downloaded the official SharePoint preview image blobs with `downloadMedia`; these are 2560 × 2560 JPEG preview derivatives, not claimed to be original camera files. No screenshot was substituted for either photo. Local copies remain in ignored `.webflow/task12-photos/`.

| Local filename                     | Bytes  | SHA-256                                                            |
| ---------------------------------- | ------ | ------------------------------------------------------------------ |
| `P22-HRMI-West-2025-Session-6.jpg` | 294129 | `0E7B4764DFB897A4E5DD14908ABC9A642F65B04FB31E839A1734CBC36F000AA5` |
| `P23-HIT-Jun-2025-Session-3.jpg`   | 251738 | `FD74EBB088AA594FE5965DE68C58C441F58DBDF907F18B63E75B0DC5855A45B9` |

The observed blob download filenames were `7f3b48ab-2f73-422a-9d93-b88300b43a3a.jpg` and `7ce8584e-9045-4f54-9182-f6d5051bd88a.jpg`. Asset searches found no matching supplied files, so each was uploaded once through the native Replace Image chooser. Existing assets remain available.

Both elements preserve 400 × 400 HTML dimensions, eager loading, responsive sources, `object-fit: fill`, centered position, 50% circle masks and shadows. Front classes remain `bubble-photo bottom left circle front shadow-xl`, z-index 2; back classes remain `bubble-photo top right circle shadow-xl`, z-index auto. Webflow automatically enabled HiDPI for the larger uploads while retaining the 400 × 400 attributes. No size, CSS, breakpoint, focal position, background or interaction adjustment was necessary.

### Verification

Only `ipmi.webflow.io` was selected for publication; the sole listed custom domain `www.ipmievents.com` was unchecked. [Publish selection](evidence/task12/publish-domains.png), [completed publication](evidence/task12/publish-completed.png). No CMS immediate publication action was used.

| Viewport           | Verified result                                                                                                                                                                                                                                 |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Desktop 1912 × 970 | [Hero](evidence/task12/desktop-hero.png), [checks](evidence/task12/desktop-checks.json): both images loaded, 333.86px circles, faces visible, correct overlap, no document overflow.                                                            |
| Tablet 768 × 1024  | [Hero](evidence/task12/tablet-hero.png), [checks](evidence/task12/tablet-checks.json): both loaded, 250px circles, inherited vertical overlap preserved. Existing desktop navigation produces document width 790px; already tracked by task 37. |
| Mobile 390 × 844   | [Hero](evidence/task12/mobile-hero.png), [checks](evidence/task12/mobile-checks.json): both loaded, 181.5px circles, inherited horizontal pair, faces visible and document width 390px.                                                         |

- Desktop and mobile **View Questions** controls navigate to the FAQ section. Enter opens and Space closes the Institute accordion with the expected `aria-expanded` states. Pointer opening of the Think Tank answer passes on mobile; [mobile answer](evidence/task12/mobile-faq.png).
- Reloaded canonical `#what-is-an-institute`, `#what-is-a-think-tank`, and `#what-do-the-business-meetings-look-like` URLs each expand their matching answer. Seven questions, order, anchors and revised task 04 copy are preserved.
- The Institute gallery's Next/Previous controls change slides; its thumbnail opens the existing 13-item lightbox, next-image navigation works, and Escape closes it. [Desktop FAQ](evidence/task12/desktop-faq.png). No gallery content was changed; broader additions remain task 30.
- The [lower shared Institutes CTA](evidence/task12/preserved-cta.png) retains assets `63cf344a033565aa03ae94b7_Institutes-Bubble-6.webp` and `63cf344ad75e97ad6d8d7066_Institutes-Bubble-5.webp`; both loaded when brought into view.
- Independent orchestrator HTTP comparison: 20 FAQ image tags before/after, with the other 18 byte-identical; all 107 anchor opening tags and normalized source text (4843 characters) unchanged against the pretask staging baseline. All 20 production image tags remain unchanged. The existing footer's stale Think Tank anchor remains tracked in task 37.
- No CMS records, schemas, shared component definitions, existing asset bytes, scripts, stylesheets, forms or message routing changed. No messages were submitted. Broader tasks 19/30/37 remain separate.
- Viewport overrides reset, owned source tabs closed, staging retained for review; Designer left on Frequently Asked Questions at Desktop with no dialogs open.
- Relevant `vp fmt --check` and `git diff --check` passed. No runtime build was needed for browser-only image changes and documentation.

### Exact rollback

Restore the two previous static asset references above, using prefix `https://cdn.prod.website-files.com/62f30d583ebbed2d6d47f9a5/`, and restore **Use alt text from asset**. Preserve their dimensions, eager loading, classes, positions and masks. Republish staging only with custom domains unchecked; verify the hero and unchanged lower CTA. Do not delete either old or new asset or restore a whole-site backup over other tasks.
