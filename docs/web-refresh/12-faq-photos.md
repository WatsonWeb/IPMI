# 12 FAQ page photo replacements

Owner: Webflow implementer. Asset owner: IPMI.

Status: Ready for implementation, subject to source-image access and placement verification. Documentation only; no website edits performed.

[Back to master](README.md)

## Source and target

- [New Web Photos.docx](https://ipmionline.sharepoint.com/:w:/s/IPMIExternal/IQCVDAeAmKmVRoa3mRUyjy1cAYda4y7oNDZjOs51OXae8Wg?e=8pGh3U): source rows and pages listed below. Row IDs P01–P27 are documentation identifiers in source order.
- Web Refresh Master To-Do: “Update copy and photo content across all pages”; source attachment is recorded in the master.
- [FAQ](https://www.ipmievents.com/faq): existing feature-photo placements indicated in the source screenshots.

Replace the FAQ page's source-indicated front/back feature-photo pair with the supplied session images.

## Current state and asset mapping

The source maps two replacements to the FAQ page's front/back pair. The current assets and exact section bindings have not been recorded in this task; compare the pair to page 5 of the source before selecting either slot.

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

- [ ] P22: the approved asset is visible at the destination specified in the mapping table.
- [ ] P23: the approved asset is visible at the destination specified in the mapping table.
- [ ] Every row has an actual Designer/CMS destination and previous asset recorded; unresolved placement guesses are closed before marking complete.
- [ ] Front/back layering and source-intended composition are correct at desktop, tablet, and mobile sizes.
- [ ] Images load from Webflow-managed assets with no broken or authenticated SharePoint image URLs.
- [ ] Informative/decorative treatment and alternative text are verified for the new images.
- [ ] Unrelated content, links, collections, and interaction behavior remain correct.
- [ ] Staging URLs and comparison screenshots are recorded.

## Rollback

Restore the captured previous asset references and their original crop, focal position, and alternative-text values in the same static/component/CMS fields. Republish staging and verify every affected placement, including dependent component instances. Keep both old and new assets available through review; do not delete an asset that another page may use.
