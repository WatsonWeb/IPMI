# 14 Contact page photo replacement

Owner: Webflow implementer. Asset owner: IPMI.

Status: Staged for review. P26 retained and approved P27 replaced; responsive and preservation checks passed September 24, 2026. Production was not published.

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

- [x] P26: the existing front image is retained and its asset reference is recorded.
- [x] P27: the approved asset is visible at the destination specified in the mapping table.
- [x] Every row has an actual Designer/CMS destination and previous asset recorded; unresolved placement guesses are closed before marking complete.
- [x] Front/back layering and source-intended composition are correct at desktop, tablet, and mobile sizes.
- [x] Images load from Webflow-managed assets with no broken or authenticated SharePoint image URLs.
- [x] Informative/decorative treatment and alternative text are verified for the new images.
- [x] Unrelated content, links, collections, and interaction behavior remain correct.
- [x] Staging URLs and comparison screenshots are recorded.

## Rollback

Restore the captured previous asset references and their original crop, focal position, and alternative-text values in the same static/component/CMS fields. Republish staging and verify every affected placement, including dependent component instances. Keep both old and new assets available through review; do not delete an asset that another page may use.

## Implementation record — September 24, 2026

Implemented by Codex through Chrome Designer as **IPMI Webmaster**, with exclusive editor control. Page **Contact Us**, ID `63c3829b2405e78449d8cae5`; staging [Contact](https://ipmi.webflow.io/contact#hero). No placeholders were needed.

[Source page 6](evidence/task14/source-p26-p27.png) confirms the lower-left foreground staff circle is P26 and upper-right background lobby circle is P27. Both are static images under **Hero Section → Hero Container → Hero Wrap → Bubble Photos**. The approved replacement visibly shows two smiling attendees holding drinks; no identities were inferred.

| Row                | Element ID                             | Previous asset and alt                                                             | Final asset and alt                                                                                                                                                                                                           |
| ------------------ | -------------------------------------- | ---------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P26 front retained | `fa1f93cb-6aa7-5288-2de1-0b033820b124` | `63c4d1501c2178619dd30322_Contact-Bubble-3.webp`; `IPMI Staff assisting Attendees` | Unchanged                                                                                                                                                                                                                     |
| P27 back           | `fa1f93cb-6aa7-5288-2de1-0b033820b123` | `63c388708ffd311b54626abd_Contact-Bubble-2.webp`; `IPMI Institute Session Lobby`   | [P27 JPEG](https://cdn.prod.website-files.com/62f30d583ebbed2d6d47f9a5/6ab4ca6019adb9f0df002db6_P27-HIT-2024-Dinner.jpg), asset `6ab4ca6019adb9f0df002db6`; `Two attendees smiling and holding drinks at the HIT 2024 dinner` |

Original P27 alt mode was **Use alt text from asset**; replacement uses **Custom description**. Old asset metadata remains unchanged. Both old and new assets remain available.

### Provenance and preserved settings

Chrome downloaded the approved SharePoint preview blob `ccccc968-72c5-49c2-8d46-1dee8f43623c.jpg` through the observed preview image. This is an official **2560 × 2560 JPEG preview derivative**, not claimed to be original camera bytes. Its local copy is ignored `.webflow/task14-photos/P27-HIT-2024-Dinner.jpg`, 405545 bytes, SHA-256 `D335D8F2CD26A7F4A3796EB83BFD2A47E9883A3547EB83456C3DE8EB29CEE4C5`. Asset search found related assets but no exact supplied match; P27 was uploaded once via the native file chooser and selected through Replace Image. No screenshot was used as a replacement photo.

[Desktop baseline](evidence/task14/before-desktop-designer.png), [mobile baseline](evidence/task14/before-mobile.png). Preserved 400 × 400 HTML dimensions, eager loading, responsive image generation, centered positioning, circle radius 50%, shadows and `object-fit: fill`. Front classes remain `bubble-photo bottom left circle front shadow-xl` with z-index 2; back remains `bubble-photo top right circle shadow-xl` with z-index auto. Webflow automatically enabled HiDPI for the larger upload. No CSS, breakpoint, focal position, layering or background edits were needed. Reloaded Designer confirmed the saved asset, alt and both unchanged element IDs.

### Verification

Only `ipmi.webflow.io` was selected; the sole listed custom domain `www.ipmievents.com` was unchecked. [Publish selection](evidence/task14/publish-staging-only.png), [completed publication](evidence/task14/publish-completed.png). No CMS immediate publication was used.

| Viewport           | Result                                                                                                                                                                                                                                         |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Desktop 1912 × 970 | [Hero](evidence/task14/desktop-hero.png), [checks](evidence/task14/desktop-checks.json): both loaded, 334px circles, correct overlap and visible subjects; document width 1912px.                                                              |
| Tablet 768 × 1024  | [Hero](evidence/task14/tablet-hero.png), [checks](evidence/task14/tablet-checks.json): both loaded, 250px circles and inherited vertical overlap preserved. Shared navigation's existing document width 790px remains a separate task 37 item. |
| Mobile 390 × 844   | [Hero](evidence/task14/mobile-hero.png), [checks](evidence/task14/mobile-checks.json): both loaded, 182px circles, foreground overlap and subjects visible, no horizontal overflow.                                                            |

- Get in Touch reaches `#contact`; the [mobile form](evidence/task14/mobile-contact.png) remains reachable with name, email, message, reCAPTCHA and Send Inquiry. No inquiry or CAPTCHA was submitted; delivery is not asserted.
- Independent orchestrator HTTP comparison against pretask staging: five images remain, only P27 changed and other four exact; all anchor opening tags and normalized text unchanged; complete form HTML byte-identical. Production's five image tags match its baseline and contain no P27.
- Contact details, email, form fields/recipients, CMS records, scripts, styles, IDs, bindings and unrelated content were preserved. Tasks 15/16 remain separate. No placeholder register changes were required.
- Viewport override reset, owned source tabs closed, staging retained for review. Designer left on Contact at Desktop without dialogs; Chrome released to the orchestrator.
- Relevant formatting and whitespace checks passed. No app build was needed for a photo-only browser change and documentation.

### Exact rollback

Restore P27's old image with prefix `https://cdn.prod.website-files.com/62f30d583ebbed2d6d47f9a5/` and **Use alt text from asset** in the same static back element. Preserve dimensions, eager loading, classes, centered circle masks and the retained P26 front photo. Republish staging only with custom domains unchecked. Retain both assets and do not restore a whole-site backup over other tasks.
