# 06 Upcoming Institutes photo replacements

Owner: Webflow implementer. Asset owner: IPMI.

Status: Ready for implementation, subject to source-image access and placement verification. Documentation only; no website edits performed.

[Back to master](README.md)

## Source and target

- [New Web Photos.docx](https://ipmionline.sharepoint.com/:w:/s/IPMIExternal/IQCVDAeAmKmVRoa3mRUyjy1cAYda4y7oNDZjOs51OXae8Wg?e=8pGh3U): source rows and pages listed below. Row IDs P01–P27 are documentation identifiers in source order.
- Web Refresh Master To-Do: “Update copy and photo content across all pages”; source attachment is recorded in the master.
- [Upcoming Institutes](https://www.ipmievents.com/institutes): existing feature-photo placements indicated in the source screenshots.

Replace five specified images on Upcoming Institutes. The source identifies two separate front-image placements; match each screenshot before editing so the Dinner and Session 9 images do not overwrite the same slot.

## Current state and asset mapping

The source supplies a background image, a front bubble, a separate front/back pair, and an Intimate/Interactive section image. Exact section ownership for the repeated front labels has not been definitively recorded in Designer. No current image/CMS asset IDs are asserted.

| Source row | Source page / row | Destination                                                            | Supplied asset or instruction                                                                                                                |
| ---------- | ----------------- | ---------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| P05        | 1 / 5             | Upcoming Institutes — background image; match source screenshot        | [HR East 2026 Session 2.jpg](https://ipmionline.sharepoint.com/:i:/s/IPMIExternal/IQCIvwX0sBA4Q4X-XO-VH0VeAQBLFiXEaiOxDRKwVDMOJ0k?e=cUPZJl)  |
| P06        | 1 / 6             | Upcoming Institutes — front bubble in page 1 screenshot                | [HR Central 2024 Dinner](https://ipmionline.sharepoint.com/:i:/s/IPMIExternal/IQB4wy3T4J7uTbCPgj4emSRzAWXEBZcUwcmRREmMdw-WSOE?e=8bwv7R)      |
| P07        | 2 / 1             | Upcoming Institutes — front image in page 2 pair; distinguish from P06 | [HR East 2026 Session 9](https://ipmionline.sharepoint.com/:i:/s/IPMIExternal/IQDu7oc7EdoATZKkx3lKw0_BAb_d-cOuFACEthK0DK1RF44?e=s38DM2)      |
| P08        | 2 / 2             | Upcoming Institutes — back image paired with P07                       | [HRMI West 2025 Think Tank 5](https://ipmionline.sharepoint.com/:i:/s/IPMIExternal/IQC3JsDJbgc6Q59BiIzYp8RPAROkTRyY0sA4X84UbjRKQLw?e=EOFdf7) |
| P09        | 2 / 3             | Intimate / Interactive section — indicated image                       | [CLDI Apr 2025 Think Tank 9](https://ipmionline.sharepoint.com/:i:/s/IPMIExternal/IQCj_tyEuLDfQJoyCuzVriZGAfPgDMgs3eAppNoU7NmItE8?e=kM2UXj)  |

Source image links are the approved originals, not public website image URLs. Access their files through Chrome and upload/select them in Webflow; do not set a page image's URL to an authenticated SharePoint sharing page.

## Chrome and Webflow implementation checklist

1. Open the source document and each supplied asset in Chrome. Compare the source screenshot with the current Upcoming Institutes page and identify each exact placement. For an ambiguous pair, record the matching section heading and screenshot before editing; do not infer front/back from DOM order.
2. In Webflow Designer, record the page section, element or component property, static/CMS binding, current asset, alternative text, dimensions, object fit/position or background position, and any breakpoint-specific settings. Capture the current desktop and mobile presentation.
3. Retrieve the 5 approved replacement files from the provided SharePoint links through Chrome. Confirm each opens and matches its source row. Upload each to Webflow Assets with a recognizable filename, avoiding duplicate uploads when the exact approved asset already exists.
4. Select each existing destination and replace only its image source or the exact bound CMS image field. Preserve the visual front/back layering, aspect ratio, border radius/mask, sizing, and responsive layout. If a shared component/CMS field affects other pages, record those dependents and verify the change is intended before saving.
5. Preserve the composition across breakpoints, adjusting focal/object position only when required to keep the new subject visible. Apply [19 Photo accessibility](19-photo-accessibility.md): describe informative photos accurately after viewing them; use an empty alternative description for decorative images.
6. Preview desktop, tablet, and mobile. Check the new images' crop, overlap, loading, and nearby headings/links. Do not change event-card images, list filters, pagination, dates, registration actions, or Horizon status while replacing the five section images. Verify P05 as the actual background-style slot rather than an overlapping image element before choosing its editing control.
7. Publish only to Webflow staging under the master rules. Compare each row to the source document and record the final asset, actual destination, staging URL, and screenshots. Keep the task unchecked until every row is verified.

## Required fields and dependencies

No new CMS collection or field is required solely for these replacements. Existing image/component/CMS fields are identified in step 2; source-file access and exact source-screenshot placement matching are required. Coordinate with [01 Overview copy](01-homepage-and-institute-overview-copy.md) and [24 Institutes calendar](24-institutes-calendar.md). Complete the per-image alternative-text decisions through [19 Photo accessibility](19-photo-accessibility.md) and include results in [37 Integrated verification](37-staging-verification.md).

## Acceptance checks

- [ ] P05: the approved asset is visible at the destination specified in the mapping table.
- [ ] P06: the approved asset is visible at the destination specified in the mapping table.
- [ ] P07: the approved asset is visible at the destination specified in the mapping table.
- [ ] P08: the approved asset is visible at the destination specified in the mapping table.
- [ ] P09: the approved asset is visible at the destination specified in the mapping table.
- [ ] Every row has an actual Designer/CMS destination and previous asset recorded; unresolved placement guesses are closed before marking complete.
- [ ] Front/back layering and source-intended composition are correct at desktop, tablet, and mobile sizes.
- [ ] Images load from Webflow-managed assets with no broken or authenticated SharePoint image URLs.
- [ ] Informative/decorative treatment and alternative text are verified for the new images.
- [ ] Unrelated content, links, collections, and interaction behavior remain correct.
- [ ] Staging URLs and comparison screenshots are recorded.

## Rollback

Restore the captured previous asset references and their original crop, focal position, and alternative-text values in the same static/component/CMS fields. Republish staging and verify every affected placement, including dependent component instances. Keep both old and new assets available through review; do not delete an asset that another page may use.
