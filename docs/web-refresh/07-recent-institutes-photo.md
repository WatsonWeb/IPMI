# 07 Recent Institutes photo replacement

Owner: Webflow implementer. Asset owner: IPMI.

Status: Staged for review. The approved hero back photo is installed and verified on Webflow staging; production was not published.

[Back to master](README.md)

## Source and target

- [New Web Photos.docx](https://ipmionline.sharepoint.com/:w:/s/IPMIExternal/IQCVDAeAmKmVRoa3mRUyjy1cAYda4y7oNDZjOs51OXae8Wg?e=8pGh3U): source rows and pages listed below. Row IDs P01–P27 are documentation identifiers in source order.
- Web Refresh Master To-Do: “Update copy and photo content across all pages”; source attachment is recorded in the master.
- [Recent Institutes](https://www.ipmievents.com/recent-institutes): existing feature-photo placements indicated in the source screenshots.

Replace only the back image in the Recent Institutes hero pair with the supplied session photo.

## Current state and asset mapping

The source maps one replacement to the Recent Institutes hero back image. Its original asset, static binding, visual overlap, and responsive crop are recorded below alongside the verified replacement.

| Source row | Source page / row | Destination                         | Supplied asset or instruction                                                                                                                |
| ---------- | ----------------- | ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| P10        | 2 / 4             | Recent Institutes hero — back image | [HRMI Central 2024 Session 1](https://ipmionline.sharepoint.com/:i:/s/IPMIExternal/IQAY5ZFMd81EQJnaZjIecn8OAaYU1owhfAfu7ZBv-ARHn7w?e=9EIo96) |

Source image links are the approved originals, not public website image URLs. Access their files through Chrome and upload/select them in Webflow; do not set a page image's URL to an authenticated SharePoint sharing page.

## Chrome and Webflow implementation checklist

1. Open the source document and each supplied asset in Chrome. Compare the source screenshot with the current Recent Institutes page and identify each exact placement. For an ambiguous pair, record the matching section heading and screenshot before editing; do not infer front/back from DOM order.
2. In Webflow Designer, record the page section, element or component property, static/CMS binding, current asset, alternative text, dimensions, object fit/position or background position, and any breakpoint-specific settings. Capture the current desktop and mobile presentation.
3. Retrieve the 1 approved replacement file from the provided SharePoint links through Chrome. Confirm each opens and matches its source row. Upload each to Webflow Assets with a recognizable filename, avoiding duplicate uploads when the exact approved asset already exists.
4. Select each existing destination and replace only its image source or the exact bound CMS image field. Preserve the visual front/back layering, aspect ratio, border radius/mask, sizing, and responsive layout. If a shared component/CMS field affects other pages, record those dependents and verify the change is intended before saving.
5. Preserve the composition across breakpoints, adjusting focal/object position only when required to keep the new subject visible. Apply [19 Photo accessibility](19-photo-accessibility.md): describe informative photos accurately after viewing them; use an empty alternative description for decorative images.
6. Preview desktop, tablet, and mobile. Check the new images' crop, overlap, loading, and nearby headings/links. Preserve the front image and all individual recap/event card images. A back image is the visually rear layer, not necessarily the first or last image in the Navigator.
7. Publish only to Webflow staging under the master rules. Compare each row to the source document and record the final asset, actual destination, staging URL, and screenshots. Keep the task unchecked until every row is verified.

## Required fields and dependencies

No new CMS collection or field is required solely for these replacements. Existing image/component/CMS fields are identified in step 2; source-file access and exact source-screenshot placement matching are required. Coordinate with [29 Complete gallery image supply](29-gallery-content-supply.md). Complete the per-image alternative-text decisions through [19 Photo accessibility](19-photo-accessibility.md) and include results in [37 Integrated verification](37-staging-verification.md).

## Acceptance checks

- [x] P10: the approved asset is visible at the destination specified in the mapping table.
- [x] Every row has an actual Designer/CMS destination and previous asset recorded; unresolved placement guesses are closed before marking complete.
- [x] Front/back layering and source-intended composition are correct at desktop, tablet, and mobile sizes.
- [x] Images load from Webflow-managed assets with no broken or authenticated SharePoint image URLs.
- [x] Informative/decorative treatment and alternative text are verified for the new images.
- [x] Unrelated content, links, collections, and interaction behavior remain correct.
- [x] Staging URLs and comparison screenshots are recorded.

## Implementation evidence — September 24, 2026

Editor: Codex task 07 worker, Chrome Designer account **IPMI Webmaster**, site **IPMI**, Recent Institutes page `63c9c220e884f4185e4f746d`. All website edits used the Designer UI. The source document's [P10 screenshot](evidence/task07/source-p10.png) confirms the back circle in the hero headed **Incredible Institutes That Deliver Immediate Impact**. Word repaginated the screenshot onto page 3; P10's asset label remained in its preceding row. The lower Recaps pair is a separate placement and was preserved.

### Source retrieval and exact change

The approved SharePoint link opened successfully and the [actual photo](evidence/task07/source-photo.png) was inspected. Supported image-locator `downloadMedia()` retrieved a clean official **2560 × 2560 JPEG preview derivative**, 360280 bytes, observed filename `06247b77-9b20-4b6e-a206-8c8e02dd52ec.jpg`. It was copied from Downloads to `.webflow/task07-photos/P10-HRMI-Central-2024-Session-1.jpg` and uploaded through the Webflow file chooser as a new asset after searching existing assets. This is not a screenshot, placeholder, or claim of original-byte retrieval. Existing asset bytes and metadata were preserved.

- Destination: **Hero Section → Hero Container → Hero Wrap → Bubble Photos → Bubble Photo**, static element `45fc8c33-bacb-f7cf-8979-02789931e0b7`, visually upper-right/back on desktop; class `bubble-photo top right circle shadow-xl`.
- Previous source: [RecentInstitutes-Bubble-1.webp](https://cdn.prod.website-files.com/62f30d583ebbed2d6d47f9a5/63c9ce53fcf70113cc4f04e7_RecentInstitutes-Bubble-1.webp), asset-derived alt `IPMI attendees in a crowd`.
- New source: [P10-HRMI-Central-2024-Session-1.jpg](https://cdn.prod.website-files.com/62f30d583ebbed2d6d47f9a5/6ab4b4b02a5eb1c3401b943c_P10-HRMI-Central-2024-Session-1.jpg).
- Exact element-specific **Custom description**: `Attendees listening and smiling during an IPMI Institute session`. Informative photo; no person, company, or venue identity was inferred.
- Retained `400 × 400` attributes, eager loading, responsive images enabled, centered `50% 50%` position, `object-fit: fill`, circular `50%` radius, and back z-index `auto`. Webflow automatically enabled HiDPI and generated responsive variants. No class, focal-position, breakpoint, CMS, component, runtime, or hosted-asset change was made. [Original fields](evidence/task07/original-element.json) and [published fields](evidence/task07/desktop-checks.json) provide exact references.

### Staging verification

- Published once with only **ipmi.webflow.io** checked and **www.ipmievents.com** unchecked; [domain evidence](evidence/task07/staging-only-publish.png). Completion showed staging published a few seconds ago while production remained published 2 hours ago.
- [Recent Institutes hero](https://ipmi.webflow.io/recent-institutes#hero) passed at desktop **1912 × 970**, tablet **768 × 1024**, and mobile **390 × 844**. New subjects remain visible with existing diagonal, vertical, and horizontal overlap. No crop adjustment was necessary. Adjacent text and CTAs remain readable. Desktop and mobile have no document overflow; known shared navigation overflow at 768px remains the existing task 37 follow-up.
- P10 loads from a Webflow-managed responsive source (`-p-500.jpg` sampled on desktop), with nonzero natural dimensions and the exact custom alt. No authenticated SharePoint image URL is installed.
- Hero front remains `63cf39059bfd70d0e6bafa41_RecentInstitutes-Bubble-3.webp`, alt `IPMI Dinner`. Both lower Recaps sources and descriptions remain unchanged; [preserved pair](evidence/task07/preserved-recaps.png). No task 06 component defaults or overrides were edited.
- Independent lead HTTP comparison confirmed the other three bubble image tags are byte-identical to baseline, task 01 overview remains staged, and production retains the old hero source and alt. Production was unchanged.
- Healthcare filter smoke test returned healthcare event links including `hchr-sept-2026`, `healthcare-it-2026`, and `healthcare-finance-2026`; toggled off afterward. Hero anchors retain `#institutes` and `/insights`; Recaps CTA retains `/insights`. The existing mobile label “view upcoming institutes” still targets this page's `#institutes`; label was not edited by this photo task.
- No placeholders needed. No application build required for browser-only changes. Changed documentation/JSON formatted and checked with `vp fmt`; Git whitespace checks passed. Source tabs closed, temporary viewport override cleared, Designer left at desktop with no dialog, and Chrome control released.

| Viewport | Before                                                | After                                      |
| -------- | ----------------------------------------------------- | ------------------------------------------ |
| Desktop  | [Original](evidence/task07/original-desktop-hero.png) | [Staged](evidence/task07/desktop-hero.png) |
| Tablet   | [Original](evidence/task07/original-tablet-hero.png)  | [Staged](evidence/task07/tablet-hero.png)  |
| Mobile   | [Original](evidence/task07/original-mobile-hero.png)  | [Staged](evidence/task07/mobile-hero.png)  |

## Rollback

Restore the captured previous asset references and their original crop, focal position, and alternative-text values in the same static/component/CMS fields. Republish staging and verify every affected placement, including dependent component instances. Keep both old and new assets available through review; do not delete an asset that another page may use.
