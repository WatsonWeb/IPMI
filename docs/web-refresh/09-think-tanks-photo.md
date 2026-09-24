# 09 Think Tanks page photo replacement

Owner: Webflow implementer. Asset owner: IPMI.

Status: Staged for review. Approved P15 back hero bubble and contextual alternative text are published to Webflow staging only; responsive and preservation checks passed.

[Back to master](README.md)

## Source and target

- [New Web Photos.docx](https://ipmionline.sharepoint.com/:w:/s/IPMIExternal/IQCVDAeAmKmVRoa3mRUyjy1cAYda4y7oNDZjOs51OXae8Wg?e=8pGh3U): source rows and pages listed below. Row IDs P01–P27 are documentation identifiers in source order.
- Web Refresh Master To-Do: “Update copy and photo content across all pages”; source attachment is recorded in the master.
- [Think Tanks](https://www.ipmievents.com/thinktanks): existing feature-photo placements indicated in the source screenshots.

Replace the indicated back bubble image on the Think Tanks page with the supplied roundtable image.

## Current state and asset mapping

The source supplies a single back-bubble replacement. Its exact static hero destination, previous/new asset, and preserved front/back stack are recorded in the implementation evidence below.

| Source row | Source page / row | Destination                                    | Supplied asset or instruction                                                                                                                   |
| ---------- | ----------------- | ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| P15        | 3 / 5             | Think Tanks — back bubble in source screenshot | [Indeed Pasta Making Roundtable](https://ipmionline.sharepoint.com/:i:/s/IPMIExternal/IQAzDfy2LhNrRa_uWT_jaB-eAYoX2Qcgry0bLvGIcpjXMUQ?e=ra0E1G) |

Source image links are the approved originals, not public website image URLs. Access their files through Chrome and upload/select them in Webflow; do not set a page image's URL to an authenticated SharePoint sharing page.

## Chrome and Webflow implementation checklist

1. Open the source document and each supplied asset in Chrome. Compare the source screenshot with the current Think Tanks page and identify each exact placement. For an ambiguous pair, record the matching section heading and screenshot before editing; do not infer front/back from DOM order.
2. In Webflow Designer, record the page section, element or component property, static/CMS binding, current asset, alternative text, dimensions, object fit/position or background position, and any breakpoint-specific settings. Capture the current desktop and mobile presentation.
3. Retrieve the 1 approved replacement file from the provided SharePoint links through Chrome. Confirm each opens and matches its source row. Upload each to Webflow Assets with a recognizable filename, avoiding duplicate uploads when the exact approved asset already exists.
4. Select each existing destination and replace only its image source or the exact bound CMS image field. Preserve the visual front/back layering, aspect ratio, border radius/mask, sizing, and responsive layout. If a shared component/CMS field affects other pages, record those dependents and verify the change is intended before saving.
5. Preserve the composition across breakpoints, adjusting focal/object position only when required to keep the new subject visible. Apply [19 Photo accessibility](19-photo-accessibility.md): describe informative photos accurately after viewing them; use an empty alternative description for decorative images.
6. Preview desktop, tablet, and mobile. Check the new images' crop, overlap, loading, and nearby headings/links. Preserve the front bubble and all Think Tank cards, event imagery, registration links, and video links. Match the exact scene visually before writing alternative text; the asset name alone does not establish every visible detail.
7. Publish only to Webflow staging under the master rules. Compare each row to the source document and record the final asset, actual destination, staging URL, and screenshots. Keep the task unchecked until every row is verified.

## Required fields and dependencies

No new CMS collection or field is required solely for these replacements. Existing image/component/CMS fields are identified in step 2; source-file access and exact source-screenshot placement matching are required. Coordinate with [04 FAQ copy](04-faq-copy.md). Complete the per-image alternative-text decisions through [19 Photo accessibility](19-photo-accessibility.md) and include results in [37 Integrated verification](37-staging-verification.md).

## Acceptance checks

- [x] P15: the approved asset is visible at the destination specified in the mapping table.
- [x] Every row has an actual Designer/CMS destination and previous asset recorded; unresolved placement guesses are closed before marking complete.
- [x] Front/back layering and source-intended composition are correct at desktop, tablet, and mobile sizes.
- [x] Images load from Webflow-managed assets with no broken or authenticated SharePoint image URLs.
- [x] Informative/decorative treatment and alternative text are verified for the new images.
- [x] Unrelated content, links, collections, and interaction behavior remain correct.
- [x] Staging URLs and comparison screenshots are recorded.

## Rollback

Restore the captured previous asset references and their original crop, focal position, and alternative-text values in the same static/component/CMS fields. Republish staging and verify every affected placement, including dependent component instances. Keep both old and new assets available through review; do not delete an asset that another page may use.

## Implementation evidence — September 24, 2026

Editor: Codex task 09 worker, Chrome Designer account **IPMI Webmaster**, site **IPMI**, Think Tanks & Roundtables page `63bce3783bf2dd08dee72004`. All website edits used the Designer UI. [Source P15](evidence/task09/source-p15.png) spans the page 3/4 break and identifies the **upper-right back hero bubble**, beside “A Relatable, Responsive, and Real-Time Platform.”

### Source, exact destination, and accessibility

The approved SharePoint link opened successfully. The supported image-locator `downloadMedia()` retrieved its clean official preview JPEG, **2068 × 2068**, **348221 bytes**. This is a source photograph, not a screenshot or a claim of original-byte retrieval. Observed blob/download filename `e976c2b1-d3bb-4a2c-945b-4b3ad209b041.jpg` was copied to `.webflow/task09-photos/P15-Indeed-Pasta-Making-Roundtable.jpg`. [Viewed source](evidence/task09/approved-photo-viewer.png). Asset search found no matching approved image; it was uploaded as a new asset through the native file chooser. Existing asset bytes and metadata were preserved.

- **Destination:** Hero Section → Hero Container → Hero Wrap → Bubble Photos → upper-right Bubble Photo, static element `45fc8c33-bacb-f7cf-8979-02789931e0b7`, class `bubble-photo top right circle shadow-xl`. No shared component or CMS binding was changed.
- **Previous:** [VTT-Bubble-6.webp](https://cdn.prod.website-files.com/62f30d583ebbed2d6d47f9a5/63bf072282f5b2021273fe2b_VTT-Bubble-6.webp), `Use alt text from asset`, rendered alt `IPMI Virtual Think Tank Session`.
- **New:** [P15-Indeed-Pasta-Making-Roundtable.jpg](https://cdn.prod.website-files.com/62f30d583ebbed2d6d47f9a5/6ab4b990eae4404f847681a0_P15-Indeed-Pasta-Making-Roundtable.jpg), asset ID `6ab4b990eae4404f847681a0`, custom description **A participant speaking to seated colleagues during an IPMI roundtable**. The description reflects the viewed scene without inferred identities or an unseen cooking activity.
- Retained `400 × 400` image attributes, eager loading, responsive images enabled, centered `object-fit: fill`, 50% circular mask, back z-index auto, 60% desktop width/max 400px, top margin −15%, and existing absolute positioning. Webflow automatically enabled HiDPI for the larger source while retaining the existing rendered dimensions. No class or breakpoint style was edited.
- Preserved lower-left/front element `45fc8c33-bacb-f7cf-8979-02789931e0b8`, [VTT-Bubble-4.webp](https://cdn.prod.website-files.com/62f30d583ebbed2d6d47f9a5/63bf05d3ec34fcabe8959d4e_VTT-Bubble-4.webp), its original alt and z-index 2. The [VTT background](https://cdn.prod.website-files.com/62f30d583ebbed2d6d47f9a5/63bf05d2deff096c5f9b8919_VTT-Background.webp) is unchanged.

[Original Designer settings](evidence/task09/original-designer-settings.png), [original page fields](evidence/task09/original-page.json), and [staged page fields](evidence/task09/staged-page.json) record the exact before/after. A stale Gallery responsive-image cache appeared immediately after navigating Designer; reloading corrected it before any edit. The fresh baseline and published page used the original VTT photos.

### Staging verification

- Published once with **ipmi.webflow.io checked** and **www.ipmievents.com unchecked**: [selected domains](evidence/task09/staging-only-publish.png). [Completion](evidence/task09/publish-completed.png) showed staging published a few seconds ago; production remained published 3 hours ago.
- [Staging Think Tanks hero](https://ipmi.webflow.io/thinktanks#hero) passed visual checks at **1912 × 970**, **768 × 1024**, and **390 × 844**. The circular overlap follows the existing desktop diagonal, tablet vertical, and mobile horizontal layout. The new roundtable scene and adjacent copy remain visible. All hero images load from Webflow-managed URLs, with responsive P15 variants and exact alt text.
- After custom pagination initialized, all **111 link text/href pairs** and the full rendered page text matched the pre-edit baseline exactly. Only one source/alt pair changed among the 37 image records; all other image sources, descriptions, dimensions, and computed styles matched. The initial immediately-after-load capture in `staged-page.json` predates pagination initialization; [settled desktop checks](evidence/task09/desktop-checks.json) contain the final links and text.
- Hero CTA navigates to `#thinktanks` on mobile. The upcoming card and four visible recent cards preserve their event links. The testimonial Next control advances and enables Previous; [interaction evidence](evidence/task09/testimonials-interaction.png). Registration/video destinations and CMS records were not edited or submitted.
- No document overflow at desktop/mobile. At 768px the document remains 790px wide due to the previously recorded shared desktop navigation issue, tracked for task 37; no photo-specific overflow was introduced. [Tablet checks](evidence/task09/tablet-checks.json) and [mobile checks](evidence/task09/mobile-checks.json).
- Independent lead HTTP review confirmed P15 is present only on staging, with the exact alt/class; production retains all 37 original image tags. Webflow generated responsive `srcset`/`sizes` for existing event thumbnail `63bb0ebe2801846349281669_VTT%20Cover%20Image%207.webp` during publish, retaining its source and alt; this is not a content replacement.
- No placeholders, runtime code changes, CMS changes, or shared asset overwrites were needed. Browser viewport overrides were reset, source tabs closed, and Designer left at Desktop with no open dialog. Task 19 retains the broader photo audit; task 37 retains integrated acceptance.

| Viewport | Before                                                     | Staged                                                                                          |
| -------- | ---------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Desktop  | [Original hero](evidence/task09/original-desktop-hero.png) | [Hero](evidence/task09/desktop-hero.png)                                                        |
| Tablet   | —                                                          | [Hero](evidence/task09/tablet-hero.png)                                                         |
| Mobile   | [Original hero](evidence/task09/original-mobile-hero.png)  | [Hero](evidence/task09/mobile-hero.png), [CTA destination](evidence/task09/mobile-upcoming.png) |

Documentation was formatted and checked with `vp fmt`; Git whitespace checks passed. No application build was needed for this browser-only image change.
