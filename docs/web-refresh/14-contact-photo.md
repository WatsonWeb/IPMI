# 14 Contact page photo replacement

Owner: Webflow implementer. Asset owner: IPMI.

Status: Ready for implementation, subject to source-image access and placement verification. Documentation only; no website edits performed.

[Back to master](README.md)

## Source and target

- [New Web Photos.docx](https://ipmionline.sharepoint.com/:w:/s/IPMIExternal/IQCVDAeAmKmVRoa3mRUyjy1cAYda4y7oNDZjOs51OXae8Wg?e=8pGh3U): source rows and pages listed below. Row IDs P01–P27 are documentation identifiers in source order.
- Web Refresh Master To-Do: “Update copy and photo content across all pages”; source attachment is recorded in the master.
- [Contact](https://www.ipmievents.com/contact): existing feature-photo placements indicated in the source screenshots.

Keep the existing front image and replace the back image with the supplied HIT 2024 Dinner photo. The source explicitly permits retaining the front image; this plan uses that permission.

## Current state and asset mapping

Chrome research found current image alternative text corresponding to “IPMI Staff assisting Attendees” and “IPMI Institute Session Lobby.” Those descriptions alone do not prove which element is visually front or back. Confirm the pair from the source screenshot and the page before selecting the replacement. No new front-image asset is required.

| Source row | Source page / row | Destination           | Supplied asset or instruction                                                                                                    |
| ---------- | ----------------- | --------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| P26        | 6 / 3             | Contact — front image | KEEP existing image; source: “Ok if we need to keep it the same”                                                                 |
| P27        | 6 / 4             | Contact — back image  | [HIT 2024 Dinner](https://ipmionline.sharepoint.com/:i:/s/IPMIExternal/IQC_w5jihyf8SKN1BqjwJ5XPAZRy7Mp0wWVjaCpJEaOLMAc?e=iH8MrS) |

Source image links are the approved originals, not public website image URLs. Access their files through Chrome and upload/select them in Webflow; do not set a page image's URL to an authenticated SharePoint sharing page.

## Chrome and Webflow implementation checklist

1. Open the source document and each supplied asset in Chrome. Compare the source screenshot with the current Contact page and identify each exact placement. For an ambiguous pair, record the matching section heading and screenshot before editing; do not infer front/back from DOM order.
2. In Webflow Designer, record the page section, element or component property, static/CMS binding, current asset, alternative text, dimensions, object fit/position or background position, and any breakpoint-specific settings. Capture the current desktop and mobile presentation.
3. Retrieve the 1 approved replacement file from the provided SharePoint links through Chrome. Confirm each opens and matches its source row. Upload each to Webflow Assets with a recognizable filename, avoiding duplicate uploads when the exact approved asset already exists.
4. Select each existing destination and replace only its image source or the exact bound CMS image field. Preserve the visual front/back layering, aspect ratio, border radius/mask, sizing, and responsive layout. If a shared component/CMS field affects other pages, record those dependents and verify the change is intended before saving.
5. Preserve the composition across breakpoints, adjusting focal/object position only when required to keep the new subject visible. Apply [19 Photo accessibility](19-photo-accessibility.md): describe informative photos accurately after viewing them; use an empty alternative description for decorative images.
6. Preview desktop, tablet, and mobile. Check the new images' crop, overlap, loading, and nearby headings/links. Record the retained front image's current asset reference and verify it remains unchanged. Do not upload a substitute front photo or treat its retained row as a missing dependency. Contact details, form recipients, and staff routing are managed in their separate tasks.
7. Publish only to Webflow staging under the master rules. Compare each row to the source document and record the final asset, actual destination, staging URL, and screenshots. Keep the task unchecked until every row is verified.

## Required fields and dependencies

No new CMS collection or field is required solely for these replacements. Existing image/component/CMS fields are identified in step 2; source-file access and exact source-screenshot placement matching are required. Coordinate with [15 Optional phone fields](15-optional-phone-fields.md) and [16 Public contact email](16-public-contact-email.md). Complete the per-image alternative-text decisions through [19 Photo accessibility](19-photo-accessibility.md) and include results in [37 Integrated verification](37-staging-verification.md).

## Acceptance checks

- [ ] P26: the existing front image is retained and its asset reference is recorded.
- [ ] P27: the approved asset is visible at the destination specified in the mapping table.
- [ ] Every row has an actual Designer/CMS destination and previous asset recorded; unresolved placement guesses are closed before marking complete.
- [ ] Front/back layering and source-intended composition are correct at desktop, tablet, and mobile sizes.
- [ ] Images load from Webflow-managed assets with no broken or authenticated SharePoint image URLs.
- [ ] Informative/decorative treatment and alternative text are verified for the new images.
- [ ] Unrelated content, links, collections, and interaction behavior remain correct.
- [ ] Staging URLs and comparison screenshots are recorded.

## Rollback

Restore the captured previous asset references and their original crop, focal position, and alternative-text values in the same static/component/CMS fields. Republish staging and verify every affected placement, including dependent component instances. Keep both old and new assets available through review; do not delete an asset that another page may use.
