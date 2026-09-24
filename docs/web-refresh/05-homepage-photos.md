# 05 Homepage photo replacements

Owner: Webflow implementer. Asset owner: IPMI.

Status: Staged for review. All four approved photographs are installed and verified on Webflow staging; production was not published.

[Back to master](README.md)

## Source and target

- [New Web Photos.docx](https://ipmionline.sharepoint.com/:w:/s/IPMIExternal/IQCVDAeAmKmVRoa3mRUyjy1cAYda4y7oNDZjOs51OXae8Wg?e=8pGh3U): source rows and pages listed below. Row IDs P01–P27 are documentation identifiers in source order.
- Web Refresh Master To-Do: “Update copy and photo content across all pages”; source attachment is recorded in the master.
- [Homepage](https://www.ipmievents.com/): existing feature-photo placements indicated in the source screenshots.

Replace four homepage feature photos: the front/back pair by the statistics and Innovative Ideas section, and the other pair associated with Recent Institutes/Recaps. Use the source screenshots to confirm the second pair's section before selecting elements.

## Current state and asset mapping

The source supplies four homepage replacements. The implementation record below captures current Webflow asset references, static element IDs, and responsive image checks. Source front/back labels were matched visually; tasks 01–02 were preserved.

| Source row | Source page / row | Destination                                                                                 | Supplied asset or instruction                                                                                                                  |
| ---------- | ----------------- | ------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| P01        | 1 / 1             | Statistics / Innovative Ideas — front bubble                                                | [Innovative Ideas Front Bubble](https://ipmionline.sharepoint.com/:i:/s/IPMIExternal/IQBO1E5_-D7yRIj7iCisQ-TsAUqu52g8xdGbM_JRGIAOEVk?e=RN1LwN) |
| P02        | 1 / 2             | Statistics / Innovative Ideas — back bubble                                                 | [HIT Jun 2025 Think Tank 9](https://ipmionline.sharepoint.com/:i:/s/IPMIExternal/IQDr4tSnUYyET6NMxmyhckpvAa7clavTcHRwXjWLjyiG5hM?e=ADFfwy)     |
| P03        | 1 / 3             | Other pair / Recent Institutes (Recaps) — front; confirm section against source screenshot  | [HCHR Mar 2025 Session 22](https://ipmionline.sharepoint.com/:i:/s/IPMIExternal/IQBpeb4eRokcSZ2abQNmk9_-AdrdgeDlYZwRb_zoUZYbdPI?e=0LmbCg)      |
| P04        | 1 / 4             | Other pair / Recent Institutes (Recaps) — back; confirm same pair against source screenshot | [HRMI West 2025 Think Tank 7](https://ipmionline.sharepoint.com/:i:/s/IPMIExternal/IQBlrx2f5T9dQZo1acibqzrkAdvo5SPHzdG-SrzGdKasbY0?e=8cvmmD)   |

Source image links are the approved originals, not public website image URLs. Access their files through Chrome and upload/select them in Webflow; do not set a page image's URL to an authenticated SharePoint sharing page.

## Chrome and Webflow implementation checklist

1. Open the source document and each supplied asset in Chrome. Compare the source screenshot with the current Homepage page and identify each exact placement. For an ambiguous pair, record the matching section heading and screenshot before editing; do not infer front/back from DOM order.
2. In Webflow Designer, record the page section, element or component property, static/CMS binding, current asset, alternative text, dimensions, object fit/position or background position, and any breakpoint-specific settings. Capture the current desktop and mobile presentation.
3. Retrieve the 4 approved replacement files from the provided SharePoint links through Chrome. Confirm each opens and matches its source row. Upload each to Webflow Assets with a recognizable filename, avoiding duplicate uploads when the exact approved asset already exists.
4. Select each existing destination and replace only its image source or the exact bound CMS image field. Preserve the visual front/back layering, aspect ratio, border radius/mask, sizing, and responsive layout. If a shared component/CMS field affects other pages, record those dependents and verify the change is intended before saving.
5. Preserve the composition across breakpoints, adjusting focal/object position only when required to keep the new subject visible. Apply [19 Photo accessibility](19-photo-accessibility.md): describe informative photos accurately after viewing them; use an empty alternative description for decorative images.
6. Preview desktop, tablet, and mobile. Check the new images' crop, overlap, loading, and nearby headings/links. Do not use these four feature photos as a bulk replacement for Institute card thumbnails or gallery CMS items.
7. Publish only to Webflow staging under the master rules. Compare each row to the source document and record the final asset, actual destination, staging URL, and screenshots. Keep the task unchecked until every row is verified.

## Required fields and dependencies

No new CMS collection or field is required solely for these replacements. Existing image/component/CMS fields are identified in step 2; source-file access and exact source-screenshot placement matching are required. Coordinate with [01 Overview copy](01-homepage-and-institute-overview-copy.md) and [02 Institute statistics](02-institute-statistics.md). Complete the per-image alternative-text decisions through [19 Photo accessibility](19-photo-accessibility.md) and include results in [37 Integrated verification](37-staging-verification.md).

## Acceptance checks

- [x] P01: the approved asset is visible at the destination specified in the mapping table.
- [x] P02: the approved asset is visible at the destination specified in the mapping table.
- [x] P03: the approved asset is visible at the destination specified in the mapping table.
- [x] P04: the approved asset is visible at the destination specified in the mapping table.
- [x] Every row has an actual Designer/CMS destination and previous asset recorded; unresolved placement guesses are closed before marking complete.
- [x] Front/back layering and source-intended composition are correct at desktop, tablet, and mobile sizes.
- [x] Images load from Webflow-managed assets with no broken or authenticated SharePoint image URLs.
- [x] Informative/decorative treatment and alternative text are verified for the new images.
- [x] The scoped image changes preserve nearby content, links, collections, and behavior; the existing mobile link limitation is recorded below.
- [x] Staging URLs and comparison screenshots are recorded.

## Implementation evidence — September 23–24, 2026

Editor: Codex task 05 worker, Chrome Webflow Designer account **IPMI Webmaster**, site **IPMI**, Home page `6392772fccd80e60d3026008`. Work started September 23 America/Chicago and finished September 24. All edits used the Designer UI. The source document's [first-page screenshots](evidence/task05/source-placements.png) confirmed P01/P02 beside **Sharing Innovative Ideas and Solutions across Industry Verticals**, and P03/P04 beside **Recaps and Insights from our Recent Institutes**. Front/back was matched visually before element selection.

### Sources and retrieval

All four approved SharePoint links opened successfully, and each actual photograph was visually inspected. SharePoint's **Download this file to your device** action did not yield an original-file download; a supported browser download-event wait also timed out. The browser tool blocked `chrome://downloads/`; no alternate route into that blocked browser page was attempted. The supported image locator `downloadMedia()` saved each displayed SharePoint photo as a clean **2560 × 2560 JPEG**, without viewer chrome, padding, or a placeholder. These are official source **preview derivatives**, not a claim of original-byte retrieval. Their complete square compositions match the approved photos and exceed the displayed bubble resolution. No invented or placeholder imagery was used.

Files were copied locally to `.webflow/task05-photos/` with the recognizable P01–P04 filenames below, then uploaded as four new Webflow assets through the file chooser. Existing asset bytes and metadata were preserved. No CMS image, gallery record, shared component, stylesheet, runtime script, or published hosting asset was changed.

### Exact element and rollback mapping

All four are unlinked, static Home image elements, **Bubble Photo**, with retained width/height attributes `400` × `400`, lazy loading, responsive images enabled, circular `50%` radius, `object-fit: fill`, and centered `50% 50%` object position. The square sources need no focal or crop change. Webflow automatically enabled HiDPI and generated responsive variants after selection. The front elements retain z-index `2`; back elements retain `auto`. No class or breakpoint layout styles were edited. Previous alt mode was **Use alt text from asset**; new descriptions are element-specific **Custom description**, preserving shared asset metadata.

| Row | Designer destination / element ID                                                                                                                                          | Previous asset / alt                                                                                                                                                               | New asset / exact alt                                                                                                                                                                                                            |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P01 | Stats Section → Feature Column Right → Bubble Photos → lower-left front; `c7296410-0a3c-0186-b749-729261e2abbc`; classes `bubble-photo bottom left circle front shadow-xl` | [Institute-Photo-2.webp](https://cdn.prod.website-files.com/62f30d583ebbed2d6d47f9a5/63b3e8dc3c3dd79f8f6d91eb_Institute-Photo-2.webp); `CXOs networking at an IPMI Institute`      | [P01-Innovative-Ideas-Front-Bubble.jpg](https://cdn.prod.website-files.com/62f30d583ebbed2d6d47f9a5/6ab4ad4da11c8b3bd07ffa38_P01-Innovative-Ideas-Front-Bubble.jpg); `Two panelists sharing ideas on stage at an IPMI Institute` |
| P02 | Stats Section → Feature Column Right → Bubble Photos → upper-right back; `6c03384e-ba77-28dc-2ff8-6eaf5d311ed0`; classes `bubble-photo top right circle shadow-xl`         | [Institute-Photo-1.webp](https://cdn.prod.website-files.com/62f30d583ebbed2d6d47f9a5/63b3efa8463266747d64b394_Institute-Photo-1.webp); `A speaker presenting at an IPMI Institute` | [P02-HIT-Jun-2025-Think-Tank-9.jpg](https://cdn.prod.website-files.com/62f30d583ebbed2d6d47f9a5/6ab4ad4e118f040f8b24dd68_P02-HIT-Jun-2025-Think-Tank-9.jpg); `A participant discussing ideas at a Think Tank table`              |
| P03 | Recaps Section → Recap Column Left → Bubble Photos → lower-right front; `53aed787-6b9c-89bd-648a-4a4d9b312f66`; classes `bubble-photo circle shadow-xl bottom right front` | [Recaps-Bubble-3.webp](https://cdn.prod.website-files.com/62f30d583ebbed2d6d47f9a5/63c02fc8a26314651f63ba26_Recaps-Bubble-3.webp); `A keynote speaker at an IPMI Institute`        | [P03-HCHR-Mar-2025-Session-22.jpg](https://cdn.prod.website-files.com/62f30d583ebbed2d6d47f9a5/6ab4ad4e67be61a871ef0885_P03-HCHR-Mar-2025-Session-22.jpg); `Two speakers in conversation on stage at an IPMI Institute`          |
| P04 | Recaps Section → Recap Column Left → Bubble Photos → upper-left back; `53aed787-6b9c-89bd-648a-4a4d9b312f65`; classes `bubble-photo circle shadow-xl top left`             | [Recaps-Bubble-4.webp](https://cdn.prod.website-files.com/62f30d583ebbed2d6d47f9a5/63c02fc9f12622d4843c1c34_Recaps-Bubble-4.webp); `IPMI Institute Outdoor Entertainment`          | [P04-HRMI-West-2025-Think-Tank-7.jpg](https://cdn.prod.website-files.com/62f30d583ebbed2d6d47f9a5/6ab4ad4dbce50bba4e8f79d4_P04-HRMI-West-2025-Think-Tank-7.jpg); `A participant contributing to a Think Tank discussion`         |

The photos illustrate panel conversation and small-group participation and receive informative descriptions. No person, company, or venue identities were inferred. Source event labels establish the Think Tank context; descriptive alt text does not depend on identifying the pictured people.

### Staging checks

- Published with only **ipmi.webflow.io** checked; **www.ipmievents.com** unchecked. Completion displayed staging “Published a few seconds ago” while production remained “Published 2 hours ago.” Designer publish dialog was closed afterward.
- [Statistics pair](https://ipmi.webflow.io/#stats) and [Recaps pair](https://ipmi.webflow.io/#recaps) visually passed at desktop **1912 × 970**, tablet **768 × 1024**, and mobile **390 × 844**. The circles measured approximately **316px**, **238px**, and **192.5px** respectively. Layering follows the existing responsive layout: diagonal desktop pairs, vertical tablet pairs, horizontal mobile pairs. Subjects remain visible and nearby text/CTAs remain readable.
- All four rendered `src` values match the mapping above and all four `alt` values match the custom descriptions. All loaded after their sections were visited (`complete: true`, nonzero `naturalWidth`). Webflow generated 500/800/1080/1600px variants; sampled desktop delivery used `-p-500.jpg`. No SharePoint URL is used as a site image source.
- Home Institute count still resolves to **20**. Source and alt replacement did not alter the staged copy from tasks 01–02. The lead independently verified four correct staging asset IDs, alt strings, and front/back classes, and confirmed production still uses all four previous image URLs and descriptions.
- No mobile document overflow at 390px. The existing mobile **Learn More About IPMI** control has `href="#"`, while the desktop control has `/about`; **See Institute Insights** retains `/insights`. The unchanged baseline markup identifies the mobile link as `#stats a.button.blue-gradient.hidden-tablet-up.margin-top-30.w-button`, within Stats Section → Feature Column Right → Button; desktop uses `a.button.blue-gradient.hidden-mobile.w-button`. The mobile link behavior belongs to [task 20](20-mobile-learn-more.md), was not changed here, and is not claimed fixed by photo QA.
- No application build/test needed for these browser-only image changes. Changed Markdown was formatted and checked with `vp fmt`; Git whitespace checks passed. Browser viewport override was reset and Chrome control released at handoff.

| Evidence                                | Statistics pair                                                    | Recaps pair                                                          |
| --------------------------------------- | ------------------------------------------------------------------ | -------------------------------------------------------------------- |
| Staging desktop                         | [Desktop stats](evidence/task05/desktop-stats.png)                 | [Desktop recaps](evidence/task05/desktop-recaps.png)                 |
| Staging tablet                          | [Tablet stats](evidence/task05/tablet-stats.png)                   | [Tablet recaps](evidence/task05/tablet-recaps.png)                   |
| Staging mobile                          | [Mobile stats](evidence/task05/mobile-stats.png)                   | [Mobile recaps](evidence/task05/mobile-recaps.png)                   |
| Original desktop (unchanged production) | [Original stats](evidence/task05/original-desktop-stats.png)       | [Original recaps](evidence/task05/original-desktop-recaps.png)       |
| Original mobile (unchanged production)  | [Original mobile stats](evidence/task05/original-mobile-stats.png) | [Original mobile recaps](evidence/task05/original-mobile-recaps.png) |

### Retrieval/upload recipe for later photo tasks

Open the supplied SharePoint image link in Chrome and inspect the image. If its download menu fails, use the documented browser locator `getByRole('img', {name: 'Previewing image <filename>', exact: true}).downloadMedia()`. Read the rendered image's `src`, `naturalWidth`, and `naturalHeight`; in this run blob UUIDs became local JPEG filenames under `C:/Users/Bryan/Downloads/`. Copy the observed downloaded file to a recognizable local task name. The four source blob filenames were `a0f18f67-19fd-4481-8718-01569ce3cd54.jpg`, `f50fca2b-3467-472f-a714-dbdda6ea22cf.jpg`, `d82a25a3-d0ad-42ba-848e-cb72aa7d7e33.jpg`, and `4db60f4b-50f4-46df-9a94-b6b676faaca7.jpg` for P01–P04 respectively.

In Designer image settings choose **Replace Image...**, search existing assets first, and upload through **Choose File** using `waitForEvent('filechooser')` before clicking and `chooser.setFiles()` with absolute paths afterward. Confirm the upload input's `isMultiple()` before batching files. Select the exact new asset in the picker, set **Custom description**, and verify the published output. Do not overwrite an old shared asset or claim that a preview derivative is the original byte stream.

## Rollback

Restore the captured previous asset references and their original crop, focal position, and alternative-text values in the same static/component/CMS fields. Republish staging and verify every affected placement, including dependent component instances. Keep both old and new assets available through review; do not delete an asset that another page may use.
